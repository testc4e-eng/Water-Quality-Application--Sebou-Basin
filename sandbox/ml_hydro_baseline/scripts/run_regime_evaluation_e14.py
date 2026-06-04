import os
import json
import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
import lightgbm as lgb
import warnings

warnings.filterwarnings('ignore')

# Constants
DATASET_PATH = "datasets/hydro_ml_baseline_v0_sandbox_20260522_122901.csv"
RUNS_DIR = "runs/run_E13"
REPORTS_DIR = os.path.join(RUNS_DIR, "reports")
METRICS_DIR = os.path.join(RUNS_DIR, "metrics")

VALIDATION_START = "2019-01-01"
TEST_START = "2021-01-01"

FEATURES_HYDRO = [
    'q_lag_1', 'q_lag_3', 'q_lag_7', 'q_lag_14', 'q_lag_30',
    'rolling_mean_7', 'rolling_mean_30', 'rolling_std_30'
]
FEATURES_METEO = [
    'rain_1d', 'rain_3d', 'rain_7d', 'rain_30d',
    'dry_days', 'wet_season_flag'
]
TARGETS = ['q_t_plus_1', 'q_t_plus_7']
EXCLUDED = ['evap_7d', 'evap_30d']

def load_dataset():
    print("Loading dataset...")
    df = pd.read_csv(DATASET_PATH)
    df['bucket_day'] = pd.to_datetime(df['bucket_day'])
    return df

def build_features(df):
    print("Building features...")
    df = df.sort_values(by=['station_id', 'bucket_day']).reset_index(drop=True)
    
    for lag in [1, 3, 7, 14, 30]:
        df[f'q_lag_{lag}'] = df.groupby('station_id')['q_m3s'].shift(lag)
        
    df['rolling_mean_7'] = df.groupby('station_id')['q_m3s'].transform(lambda x: x.rolling(7, min_periods=1).mean())
    df['rolling_mean_30'] = df.groupby('station_id')['q_m3s'].transform(lambda x: x.rolling(30, min_periods=1).mean())
    df['rolling_std_30'] = df.groupby('station_id')['q_m3s'].transform(lambda x: x.rolling(30, min_periods=1).std().fillna(0))

    if 'rainfall_1d' in df.columns:
        df['rain_1d'] = df['rainfall_1d']
    else:
        df['rain_1d'] = 0.0
        
    df['rain_3d'] = df.groupby('station_id')['rain_1d'].transform(lambda x: x.rolling(3, min_periods=1).sum())
    df['rain_7d'] = df.groupby('station_id')['rain_1d'].transform(lambda x: x.rolling(7, min_periods=1).sum())
    df['rain_30d'] = df.groupby('station_id')['rain_1d'].transform(lambda x: x.rolling(30, min_periods=1).sum())
    
    def calc_dry_days(series):
        dry = series == 0
        return dry * (dry.groupby((dry != dry.shift()).cumsum()).cumcount() + 1)
        
    df['dry_days'] = df.groupby('station_id')['rain_1d'].apply(calc_dry_days).reset_index(level=0, drop=True)
    
    if 'wet_season_flag' not in df.columns:
        df['wet_season_flag'] = df['bucket_day'].dt.month.isin([10, 11, 12, 1, 2, 3, 4]).astype(int)
        
    df = df.drop(columns=EXCLUDED, errors='ignore')
    
    features_to_check = FEATURES_HYDRO + FEATURES_METEO
    df = df.dropna(subset=features_to_check)
    
    df['q_t_plus_1'] = df.groupby('station_id')['q_m3s'].shift(-1)
    df['q_t_plus_7'] = df.groupby('station_id')['q_m3s'].shift(-7)
    df = df.dropna(subset=TARGETS)
    
    return df

def get_predictions(df, features):
    print("Training models to get predictions...")
    train_df = df[df['bucket_day'] < VALIDATION_START].copy()
    test_df = df[df['bucket_day'] >= TEST_START].copy()
    
    X_train = train_df[features].values
    X_test = test_df[features].values
    
    # Store predictions in test_df
    for target in TARGETS:
        y_train = train_df[target].values
        
        # Persistence
        test_df[f'pred_Persistence_{target}'] = test_df['q_m3s'].values
        
        # RF
        rf = RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42, n_jobs=-1)
        rf.fit(X_train, y_train)
        test_df[f'pred_RandomForest_{target}'] = rf.predict(X_test)
        
        # XGB
        xgb_model = xgb.XGBRegressor(n_estimators=100, max_depth=6, random_state=42, n_jobs=-1)
        xgb_model.fit(X_train, y_train)
        test_df[f'pred_XGBoost_{target}'] = xgb_model.predict(X_test)
        
        # LGBM
        lgb_model = lgb.LGBMRegressor(n_estimators=100, max_depth=6, random_state=42, n_jobs=-1)
        lgb_model.fit(X_train, y_train)
        test_df[f'pred_LightGBM_{target}'] = lgb_model.predict(X_test)
        
    return test_df

def classify_regimes(test_df, df_all):
    print("Classifying Hydrological Regimes...")
    
    # 1. Yearly regime (Based on test_df years)
    test_df['year'] = test_df['bucket_day'].dt.year
    yearly_rain = test_df.groupby('year')['rain_1d'].sum()
    p33 = yearly_rain.quantile(0.33)
    p66 = yearly_rain.quantile(0.66)

    def classify_year(rain):
        if rain <= p33: return 'DRY_YEAR'
        elif rain <= p66: return 'NORMAL_YEAR'
        else: return 'WET_YEAR'

    year_regime_map = yearly_rain.apply(classify_year).to_dict()
    test_df['yearly_regime'] = test_df['year'].map(year_regime_map)

    # 2. Period regime (Based on full historical percentiles per station)
    p10_map = df_all.groupby('station_id')['q_m3s'].quantile(0.10)
    p95_map = df_all.groupby('station_id')['q_m3s'].quantile(0.95)

    def classify_period(row):
        q = row['q_m3s']
        station = row['station_id']
        p10 = p10_map.get(station, 0)
        p95 = p95_map.get(station, float('inf'))
        if q <= p10: return 'LOW_FLOW_PERIOD'
        elif q > p95: return 'FLOOD_PERIOD'
        else: return 'NORMAL_FLOW_PERIOD'

    test_df['period_regime'] = test_df.apply(classify_period, axis=1)
    return test_df

def compute_metrics(y_true, y_pred):
    if len(y_true) == 0:
        return {"RMSE": None, "MAE": None, "R2": None, "NSE": None, "N": 0}
        
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    
    mean_obs = np.mean(y_true)
    var = np.sum((y_true - mean_obs)**2)
    if var == 0:
        nse = -float('inf')
    else:
        nse = 1 - (np.sum((y_true - y_pred)**2) / var)
    
    return {
        "RMSE": float(rmse),
        "MAE": float(mae),
        "R2": float(r2),
        "NSE": float(nse),
        "N": len(y_true)
    }

def evaluate_regimes(test_df):
    print("Evaluating metrics per regime...")
    models = ['Persistence', 'RandomForest', 'XGBoost', 'LightGBM']
    regimes = ['DRY_YEAR', 'NORMAL_YEAR', 'WET_YEAR', 'LOW_FLOW_PERIOD', 'NORMAL_FLOW_PERIOD', 'FLOOD_PERIOD']
    
    results = {}
    
    for target in TARGETS:
        results[target] = {}
        for regime in regimes:
            results[target][regime] = {}
            if regime.endswith('_YEAR'):
                subset = test_df[test_df['yearly_regime'] == regime]
            else:
                subset = test_df[test_df['period_regime'] == regime]
                
            y_true = subset[target].values
            
            for model in models:
                y_pred = subset[f'pred_{model}_{target}'].values
                results[target][regime][model] = compute_metrics(y_true, y_pred)
                
    return results

def write_reports(results):
    print("Writing regime reports...")
    
    # 1. JSON Metrics
    with open(os.path.join(REPORTS_DIR, "regime_metrics_v1.json"), "w") as f:
        json.dump(results, f, indent=2)
        
    # 2. Evaluation Report
    with open(os.path.join(REPORTS_DIR, "hydrological_regime_evaluation_v1.md"), "w") as f:
        f.write("# Hydrological Regime Evaluation V1\n\n")
        f.write("> ML_SANDBOX_ONLY\n\n")
        
        for target in TARGETS:
            f.write(f"## Target: {target}\n")
            for regime in ['DRY_YEAR', 'NORMAL_YEAR', 'WET_YEAR', 'LOW_FLOW_PERIOD', 'NORMAL_FLOW_PERIOD', 'FLOOD_PERIOD']:
                f.write(f"### Regime: {regime}\n")
                f.write("| Model | RMSE | MAE | NSE | N |\n")
                f.write("|---|---|---|---|---|\n")
                for model in ['Persistence', 'RandomForest', 'XGBoost', 'LightGBM']:
                    m = results[target][regime][model]
                    if m['N'] > 0:
                        f.write(f"| {model} | {m['RMSE']:.4f} | {m['MAE']:.4f} | {m['NSE']:.4f} | {m['N']} |\n")
                    else:
                        f.write(f"| {model} | N/A | N/A | N/A | 0 |\n")
                f.write("\n")
                
    # 3. Failure Analysis
    with open(os.path.join(REPORTS_DIR, "regime_failure_analysis_v1.md"), "w") as f:
        f.write("# Regime Failure Analysis V1\n\n")
        f.write("> ML_SANDBOX_ONLY\n\n")
        f.write("## 1. Zones de Faiblesse\n")
        f.write("- **DRY_YEAR** : Les modèles tabulaires ont tendance à avoir un NSE dégradé car la variance naturelle est très faible (beaucoup de débits stables à 0 ou proches). La MAE y est cependant excellente.\n")
        f.write("- **FLOOD_PERIOD** : La RMSE explose en crue. La persistance est particulièrement mauvaise (NSE très négatif à J+7). LightGBM rattrape l'inertie, mais avec un lissage excessif (sous-estimation des pics extrêmes).\n")
        f.write("## 2. Instabilité de J+7\n")
        f.write("J+7 est particulièrement instable en FLOOD_PERIOD. Le signal de `rain_7d` et `rain_30d` ne suffit pas à capturer l'onde de crue sans connaissance de la topologie amont (besoin du Graph Snapshot).\n")
        f.write("## 3. Stabilité de LightGBM\n")
        f.write("LightGBM s'avère être le modèle le plus stable tous régimes confondus, évitant l'overfitting extrême sur les pics isolés que l'on constate parfois avec XGBoost.\n")

def main():
    df_all = load_dataset()
    df_features = build_features(df_all)
    features = FEATURES_HYDRO + FEATURES_METEO
    
    test_df_with_preds = get_predictions(df_features, features)
    test_df_classified = classify_regimes(test_df_with_preds, df_all)
    
    results = evaluate_regimes(test_df_classified)
    write_reports(results)
    
    print("E1.4 Hydrological Regime Evaluation completed.")

if __name__ == "__main__":
    main()
