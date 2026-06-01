from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
from collections import defaultdict
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


def to_float(value: str) -> float | None:
    if value is None or value == "":
        return None
    try:
        parsed = float(value)
    except ValueError:
        return None
    if not math.isfinite(parsed):
        return None
    return parsed


def metrics(pairs: list[tuple[float, float]]) -> dict[str, float | int | None]:
    if not pairs:
        return {"n": 0, "rmse": None, "mae": None, "nse": None, "r2": None}
    y = [a for a, _ in pairs]
    p = [b for _, b in pairs]
    n = len(pairs)
    mse = sum((a - b) ** 2 for a, b in pairs) / n
    mae = sum(abs(a - b) for a, b in pairs) / n
    mean_y = sum(y) / n
    denom = sum((a - mean_y) ** 2 for a in y)
    nse = None if denom == 0 else 1 - (sum((a - b) ** 2 for a, b in pairs) / denom)
    return {"n": n, "rmse": math.sqrt(mse), "mae": mae, "nse": nse, "r2": nse}


def split_name(day: str, validation_start: str, test_start: str) -> str:
    if day < validation_start:
        return "train"
    if day < test_start:
        return "validation"
    return "test"


def safe_ratio(part: int, total: int) -> float:
    return 0.0 if total == 0 else part / total


def main() -> int:
    parser = argparse.ArgumentParser(description="Stdlib persistence baseline for E1.1 sandbox.")
    parser.add_argument("--dataset", required=True, type=Path)
    parser.add_argument("--expected-sha256", required=True)
    parser.add_argument("--out-dir", default=Path("sandbox/ml_hydro_baseline/runs"), type=Path)
    parser.add_argument("--validation-start", required=True)
    parser.add_argument("--test-start", required=True)
    parser.add_argument("--seed", default=42, type=int)
    args = parser.parse_args()

    dataset_hash = sha256_file(args.dataset)
    if dataset_hash.lower() != args.expected_sha256.lower():
        raise RuntimeError(f"Dataset hash mismatch: {dataset_hash}")

    run_id = datetime.now(timezone.utc).strftime("run_%Y%m%d_%H%M%S_hydro_ml_baseline_v0_sandbox")
    run_dir = args.out_dir / run_id
    run_dir.mkdir(parents=True, exist_ok=False)

    split_config = {
        "strategy": "strict_temporal",
        "validation_start": args.validation_start,
        "test_start": args.test_start,
        "random_split_allowed": False,
        "shuffle_allowed": False,
    }
    model_config = {
        "models": {
            "persistence": "executed",
            "xgboost": "not_executed_dependency_unavailable",
            "lightgbm": "not_executed_dependency_unavailable",
        },
        "seed": args.seed,
        "implementation": "python_stdlib",
    }

    required = {"station_id", "bucket_day", *FEATURE_COLUMNS, *TARGET_COLUMNS}
    counts = defaultdict(int)
    target_pairs: dict[str, dict[str, list[tuple[float, float]]]] = {
        "q_t_plus_1": {"train": [], "validation": [], "test": []},
        "q_t_plus_7": {"train": [], "validation": [], "test": []},
    }
    feature_non_null = defaultdict(int)
    feature_zero = defaultdict(int)
    feature_sum = defaultdict(float)
    feature_sum_sq = defaultdict(float)
    station_counts = defaultdict(int)
    date_min = None
    date_max = None
    missing_required: list[str] = []

    with args.dataset.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        missing_required = sorted(required - set(reader.fieldnames or []))
        if missing_required:
            raise RuntimeError(f"Missing columns: {missing_required}")
        for row in reader:
            day = row["bucket_day"]
            split = split_name(day, args.validation_start, args.test_start)
            counts["rows_total"] += 1
            counts[f"rows_{split}"] += 1
            station_counts[row["station_id"]] += 1
            date_min = day if date_min is None or day < date_min else date_min
            date_max = day if date_max is None or day > date_max else date_max

            for feature in FEATURE_COLUMNS:
                value = to_float(row.get(feature, ""))
                if value is None:
                    counts[f"null_{feature}"] += 1
                    continue
                feature_non_null[feature] += 1
                feature_sum[feature] += value
                feature_sum_sq[feature] += value * value
                if value == 0:
                    feature_zero[feature] += 1

            target1 = to_float(row["q_t_plus_1"])
            pred1 = to_float(row["q_lag_1"])
            if target1 is not None and pred1 is not None:
                target_pairs["q_t_plus_1"][split].append((target1, pred1))
            else:
                counts[f"missing_pair_q_t_plus_1_{split}"] += 1

            target7 = to_float(row["q_t_plus_7"])
            pred7 = to_float(row["q_lag_7"])
            if target7 is not None and pred7 is not None:
                target_pairs["q_t_plus_7"][split].append((target7, pred7))
            else:
                counts[f"missing_pair_q_t_plus_7_{split}"] += 1

    metrics_payload = {
        target: {f"persistence_{split}": metrics(pairs) for split, pairs in split_pairs.items()}
        for target, split_pairs in target_pairs.items()
    }

    feature_profile = {}
    for feature in FEATURE_COLUMNS:
        n = feature_non_null[feature]
        mean = None if n == 0 else feature_sum[feature] / n
        variance = None if n == 0 else max(0.0, (feature_sum_sq[feature] / n) - (mean or 0.0) ** 2)
        feature_profile[feature] = {
            "non_null": n,
            "null_count": counts[f"null_{feature}"],
            "null_ratio": safe_ratio(counts[f"null_{feature}"], counts["rows_total"]),
            "zero_ratio": safe_ratio(feature_zero[feature], n),
            "mean": mean,
            "std": None if variance is None else math.sqrt(variance),
        }

    top_stations = sorted(station_counts.items(), key=lambda item: item[1], reverse=True)[:20]
    observations = []
    if counts["rows_train"] == 0 or counts["rows_validation"] == 0 or counts["rows_test"] == 0:
        observations.append({"type": "SPLIT_EMPTY", "severity": "BLOCKING", "detail": "One temporal split is empty."})
    if top_stations and safe_ratio(top_stations[0][1], counts["rows_total"]) > 0.2:
        observations.append({"type": "STATION_DOMINANCE", "severity": "WARNING", "detail": "Top station exceeds 20% of rows."})
    for target, split_metrics in metrics_payload.items():
        test_nse = split_metrics["persistence_test"]["nse"]
        if test_nse is not None and test_nse > 0.95:
            observations.append({"type": "LEAKAGE_SUSPECTED", "severity": "WARNING", "detail": f"Persistence test NSE high for {target}: {test_nse:.4f}"})

    freeze_manifest = {
        "run_id": run_id,
        "status": "ML_SANDBOX_ONLY",
        "dataset_path": str(args.dataset),
        "dataset_hash": dataset_hash,
        "feature_list": FEATURE_COLUMNS,
        "feature_list_hash": sha256_json(FEATURE_COLUMNS),
        "split_config": split_config,
        "split_config_hash": sha256_json(split_config),
        "model_config": model_config,
        "model_config_hash": sha256_json(model_config),
        "random_seed": args.seed,
        "training_cutoff_date": args.validation_start,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "date_min": date_min,
        "date_max": date_max,
    }

    feature_importance = {
        "persistence_q_t_plus_1": {"q_lag_1": 1.0},
        "persistence_q_t_plus_7": {"q_lag_7": 1.0},
        "xgboost": {"status": "not_executed_dependency_unavailable"},
        "lightgbm": {"status": "not_executed_dependency_unavailable"},
    }

    summary = {
        "run_id": run_id,
        "status": "ML_SANDBOX_ONLY",
        "rows": dict(counts),
        "stations": {"count": len(station_counts), "top_20": top_stations},
        "date_min": date_min,
        "date_max": date_max,
        "feature_profile": feature_profile,
        "observations": observations,
    }

    (run_dir / "freeze_manifest.json").write_text(json.dumps(freeze_manifest, indent=2), encoding="utf-8")
    (run_dir / "metrics.json").write_text(json.dumps(metrics_payload, indent=2), encoding="utf-8")
    (run_dir / "feature_importance.json").write_text(json.dumps(feature_importance, indent=2), encoding="utf-8")
    (run_dir / "data_profile.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    (run_dir / "SANDBOX_ONLY.txt").write_text(
        "ML_SANDBOX_ONLY. No scientific, business, operational, DG, or official use is allowed.\n",
        encoding="utf-8",
    )
    (run_dir / "run_summary.md").write_text(build_run_summary(freeze_manifest, metrics_payload, summary), encoding="utf-8")

    print(json.dumps({"run_id": run_id, "run_dir": str(run_dir), "rows": counts["rows_total"]}, separators=(",", ":")))
    return 0


def build_run_summary(freeze: dict, metrics_payload: dict, summary: dict) -> str:
    lines = [
        "# E1.1 Hydro ML Baseline Sandbox Run",
        "",
        "| Champ | Valeur |",
        "|---|---|",
        f"| Run ID | `{freeze['run_id']}` |",
        "| Statut | `ML_SANDBOX_ONLY` |",
        f"| Dataset hash | `{freeze['dataset_hash']}` |",
        f"| Date min | `{summary['date_min']}` |",
        f"| Date max | `{summary['date_max']}` |",
        f"| Rows total | {summary['rows'].get('rows_total', 0)} |",
        f"| Rows train | {summary['rows'].get('rows_train', 0)} |",
        f"| Rows validation | {summary['rows'].get('rows_validation', 0)} |",
        f"| Rows test | {summary['rows'].get('rows_test', 0)} |",
        f"| Stations | {summary['stations']['count']} |",
        "",
        "## Metrics",
        "",
        "| Target | Split | N | RMSE | MAE | NSE/R2 |",
        "|---|---|---:|---:|---:|---:|",
    ]
    for target, split_metrics in metrics_payload.items():
        for split_key, vals in split_metrics.items():
            nse_value = vals["nse"]
            lines.append(
                f"| `{target}` | `{split_key}` | {vals['n']} | {fmt(vals['rmse'])} | {fmt(vals['mae'])} | {fmt(nse_value)} |"
            )
    lines.extend(
        [
            "",
            "## Observations",
            "",
        ]
    )
    if summary["observations"]:
        for obs in summary["observations"]:
            lines.append(f"- `{obs['type']}` / `{obs['severity']}`: {obs['detail']}")
    else:
        lines.append("- Aucun signal bloquant automatique detecte par le baseline persistence stdlib.")
    lines.extend(
        [
            "",
            "## Conclusion sandbox",
            "",
            "- Pipeline ML minimal: fonctionne pour baseline persistence.",
            "- XGBoost/LightGBM: non executes dans ce runner stdlib, dependances indisponibles ou environnement Python instable.",
            "- Resultats: interdits pour usage scientifique, metier, operationnel ou DG.",
        ]
    )
    return "\n".join(lines) + "\n"


def fmt(value: float | int | None) -> str:
    if value is None:
        return "NA"
    return f"{value:.6f}"


if __name__ == "__main__":
    raise SystemExit(main())

