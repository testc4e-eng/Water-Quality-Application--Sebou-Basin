from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path


FEATURE_COLUMNS = [
    "q_lag_1",
    "q_lag_7",
    "rainfall_1d",
    "rainfall_7d",
    "rainfall_30d",
    "evap_7d",
    "evap_30d",
    "month",
    "wet_season_flag",
]

TARGET_COLUMNS = ["q_t_plus_1", "q_t_plus_7"]


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def sha256_json(payload: object) -> str:
    content = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(content).hexdigest()


def rmse(y_true, y_pred) -> float:
    import numpy as np

    return float(np.sqrt(np.mean((y_true - y_pred) ** 2)))


def mae(y_true, y_pred) -> float:
    import numpy as np

    return float(np.mean(np.abs(y_true - y_pred)))


def nse(y_true, y_pred) -> float:
    import numpy as np

    denominator = np.sum((y_true - np.mean(y_true)) ** 2)
    if denominator == 0:
        return float("nan")
    return float(1 - (np.sum((y_true - y_pred) ** 2) / denominator))


def r2(y_true, y_pred) -> float:
    return nse(y_true, y_pred)


def evaluate(y_true, y_pred) -> dict[str, float]:
    return {
        "rmse": rmse(y_true, y_pred),
        "mae": mae(y_true, y_pred),
        "nse": nse(y_true, y_pred),
        "r2": r2(y_true, y_pred),
    }


def strict_temporal_split(df, validation_start: str, test_start: str):
    df = df.sort_values(["bucket_day", "station_id"]).copy()
    train = df[df["bucket_day"] < validation_start]
    validation = df[(df["bucket_day"] >= validation_start) & (df["bucket_day"] < test_start)]
    test = df[df["bucket_day"] >= test_start]
    return train, validation, test


def fit_optional_model(model_name: str, x_train, y_train, seed: int):
    if model_name == "xgboost":
        try:
            from xgboost import XGBRegressor
        except ImportError:
            return None, "xgboost_not_installed"
        model = XGBRegressor(
            n_estimators=300,
            max_depth=4,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            objective="reg:squarederror",
            random_state=seed,
        )
    elif model_name == "lightgbm":
        try:
            from lightgbm import LGBMRegressor
        except ImportError:
            return None, "lightgbm_not_installed"
        model = LGBMRegressor(
            n_estimators=300,
            learning_rate=0.05,
            num_leaves=31,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=seed,
        )
    else:
        raise ValueError(f"Unsupported model: {model_name}")

    model.fit(x_train, y_train)
    return model, "trained"


def main() -> int:
    parser = argparse.ArgumentParser(description="Run hydro ML baseline sandbox from an extracted CSV.")
    parser.add_argument("--dataset", required=True, type=Path, help="CSV extracted from read-only DB query.")
    parser.add_argument("--out-dir", default=Path("sandbox/ml_hydro_baseline/runs"), type=Path)
    parser.add_argument("--validation-start", required=True, help="YYYY-MM-DD strict temporal validation start.")
    parser.add_argument("--test-start", required=True, help="YYYY-MM-DD strict temporal test start.")
    parser.add_argument("--seed", default=42, type=int)
    args = parser.parse_args()

    import pandas as pd

    if not args.dataset.exists():
        raise FileNotFoundError(args.dataset)

    run_id = datetime.now(timezone.utc).strftime("run_%Y%m%d_%H%M%S_hydro_ml_baseline_v0_sandbox")
    run_dir = args.out_dir / run_id
    run_dir.mkdir(parents=True, exist_ok=False)

    df = pd.read_csv(args.dataset, parse_dates=["bucket_day"])
    df["bucket_day"] = df["bucket_day"].dt.strftime("%Y-%m-%d")
    required = {"station_id", "bucket_day", *FEATURE_COLUMNS, *TARGET_COLUMNS}
    missing = sorted(required - set(df.columns))
    if missing:
        raise ValueError(f"Dataset missing columns: {missing}")

    df = df.dropna(subset=FEATURE_COLUMNS + TARGET_COLUMNS)
    train, validation, test = strict_temporal_split(df, args.validation_start, args.test_start)

    split_config = {
        "strategy": "strict_temporal",
        "validation_start": args.validation_start,
        "test_start": args.test_start,
    }
    model_config = {
        "models": ["persistence", "xgboost_if_available", "lightgbm_if_available"],
        "seed": args.seed,
    }
    freeze = {
        "run_id": run_id,
        "status": "ML_SANDBOX_ONLY",
        "dataset_path": str(args.dataset),
        "dataset_hash": sha256_file(args.dataset),
        "feature_list": FEATURE_COLUMNS,
        "feature_list_hash": sha256_json(FEATURE_COLUMNS),
        "split_config": split_config,
        "split_config_hash": sha256_json(split_config),
        "model_config": model_config,
        "model_config_hash": sha256_json(model_config),
        "random_seed": args.seed,
        "extraction_timestamp": None,
        "training_cutoff_date": args.validation_start,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    metrics: dict[str, dict[str, dict[str, float | str]]] = {}
    feature_importance: dict[str, dict[str, float]] = {}

    for target in TARGET_COLUMNS:
        metrics[target] = {}
        x_train = train[FEATURE_COLUMNS]
        y_train = train[target]
        x_validation = validation[FEATURE_COLUMNS]
        y_validation = validation[target]
        x_test = test[FEATURE_COLUMNS]
        y_test = test[target]

        for split_name, split_df, y_split in [
            ("validation", validation, y_validation),
            ("test", test, y_test),
        ]:
            if target == "q_t_plus_1":
                y_pred = split_df["q_lag_1"]
            else:
                y_pred = split_df["q_lag_7"]
            metrics[target][f"persistence_{split_name}"] = evaluate(y_split, y_pred)

        for model_name in ["xgboost", "lightgbm"]:
            model, status = fit_optional_model(model_name, x_train, y_train, args.seed)
            if model is None:
                metrics[target][model_name] = {"status": status}
                continue
            metrics[target][f"{model_name}_validation"] = evaluate(y_validation, model.predict(x_validation))
            metrics[target][f"{model_name}_test"] = evaluate(y_test, model.predict(x_test))
            if hasattr(model, "feature_importances_"):
                feature_importance[f"{model_name}_{target}"] = dict(
                    zip(FEATURE_COLUMNS, [float(v) for v in model.feature_importances_])
                )

    (run_dir / "freeze_manifest.json").write_text(json.dumps(freeze, indent=2), encoding="utf-8")
    (run_dir / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    (run_dir / "feature_importance.json").write_text(json.dumps(feature_importance, indent=2), encoding="utf-8")
    (run_dir / "SANDBOX_ONLY.txt").write_text(
        "This run is ML_SANDBOX_ONLY. No scientific, business, DG, or official reporting use is allowed.\n",
        encoding="utf-8",
    )
    print(run_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

