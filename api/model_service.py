import os
from pathlib import Path
from typing import Dict, Any, List, Tuple
import joblib
import pickle
import pandas as pd
import numpy as np

# Locate model and scaler files directly in the current backend folder
CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent

MODEL_PATHS = [
    CURRENT_DIR / "heart_disease_xgb_model.pkl",
    ROOT_DIR / "heart_disease_xgb_model.pkl",
    CURRENT_DIR / "heart_disease_model.pkl"
]
SCALER_PATHS = [
    CURRENT_DIR / "scaler.pkl",
    ROOT_DIR / "scaler.pkl"
]

_model = None
_scaler = None

def get_model():
    """Load model singleton lazily."""
    global _model
    if _model is not None:
        return _model

    for p in MODEL_PATHS:
        if p.exists():
            _model = joblib.load(p)
            return _model

    raise FileNotFoundError(
        f"Model file not found in {[str(p) for p in MODEL_PATHS]}"
    )

def get_scaler():
    """Load scaler singleton lazily."""
    global _scaler
    if _scaler is not None:
        return _scaler

    for p in SCALER_PATHS:
        if p.exists():
            try:
                _scaler = joblib.load(p)
            except Exception:
                with open(p, 'rb') as f:
                    _scaler = pickle.load(f)
            return _scaler

    raise FileNotFoundError(
        f"scaler.pkl not found in {[str(p) for p in SCALER_PATHS]}"
    )

def normalize_input(data: Dict[str, Any]) -> pd.DataFrame:
    """Validate, normalize, and construct the single-row DataFrame."""
    age = float(data.get("age", 50))

    sex_raw = str(data.get("sex", "")).strip().lower()
    if sex_raw in ["1", "male", "m", "true"]:
        sex = "Male"
    elif sex_raw in ["0", "female", "f", "false"]:
        sex = "Female"
    else:
        sex = "Male" if "mal" in sex_raw and "fe" not in sex_raw else "Female"

    cp_raw = str(data.get("chest_pain_type", "")).strip().lower()
    if "asymptomatic" in cp_raw or cp_raw == "3":
        cp = "Asymptomatic"
    elif "atypical" in cp_raw or cp_raw == "1":
        cp = "Atypical angina"
    elif "non-anginal" in cp_raw or "non anginal" in cp_raw or cp_raw == "2":
        cp = "Non-anginal pain"
    elif "typical" in cp_raw or cp_raw == "0":
        cp = "Typical angina"
    else:
        cp = "Typical angina"

    trestbps = float(data.get("resting_blood_pressure", 120))
    chol = float(data.get("cholestoral", 200))

    fbs_raw = str(data.get("fasting_blood_sugar", "")).strip().lower()
    if "greater" in fbs_raw or ">" in fbs_raw or fbs_raw in ["1", "true", "yes"]:
        fbs = "Greater than 120 mg/ml"
    else:
        fbs = "Lower than 120 mg/ml"

    ecg_raw = str(data.get("rest_ecg", "")).strip().lower()
    if "hypertrophy" in ecg_raw or "lvh" in ecg_raw or ecg_raw == "2":
        ecg = "Left ventricular hypertrophy"
    elif "st-t" in ecg_raw or "abnormality" in ecg_raw or ecg_raw == "1":
        ecg = "ST-T wave abnormality"
    else:
        ecg = "Normal"

    thalach = float(data.get("Max_heart_rate", 150))

    exang_raw = str(data.get("exercise_induced_angina", "")).strip().lower()
    if exang_raw in ["1", "yes", "y", "true"]:
        exang = "Yes"
    else:
        exang = "No"

    oldpeak = float(data.get("oldpeak", 0.0))

    slope_raw = str(data.get("slope", "")).strip().lower()
    if "down" in slope_raw or slope_raw == "2":
        slope = "Downsloping"
    elif "flat" in slope_raw or slope_raw == "1":
        slope = "Flat"
    elif "up" in slope_raw or slope_raw == "0":
        slope = "Upsloping"
    else:
        slope = "Flat"

    ca_raw = str(data.get("vessels_colored_by_flourosopy", "")).strip().lower()
    ca_map = {
        "0": "Zero", "zero": "Zero",
        "1": "One", "one": "One",
        "2": "Two", "two": "Two",
        "3": "Three", "three": "Three",
        "4": "Four", "four": "Four"
    }
    ca = ca_map.get(ca_raw, "Zero")

    thal_raw = str(data.get("thalassemia", "")).strip().lower()
    if "fixed" in thal_raw or thal_raw == "2":
        thal = "Fixed Defect"
    elif "revers" in thal_raw or thal_raw == "3":
        thal = "Reversable Defect"
    elif "no" in thal_raw or thal_raw == "0":
        thal = "No"
    else:
        thal = "Normal"

    row = {
        "age": age,
        "sex": sex,
        "chest_pain_type": cp,
        "resting_blood_pressure": trestbps,
        "cholestoral": chol,
        "fasting_blood_sugar": fbs,
        "rest_ecg": ecg,
        "Max_heart_rate": thalach,
        "exercise_induced_angina": exang,
        "oldpeak": oldpeak,
        "slope": slope,
        "vessels_colored_by_flourosopy": ca,
        "thalassemia": thal
    }

    return pd.DataFrame([row])

def generate_insights(df: pd.DataFrame, probability: float) -> Tuple[str, List[str]]:
    factors = []
    row = df.iloc[0]

    if row["thalassemia"] == "Reversable Defect":
        factors.append("Reversible myocardial perfusion defect identified during thalassemia evaluation.")
    if row["oldpeak"] >= 2.0:
        factors.append(f"Significant exercise-induced ST depression ({row['oldpeak']} mm).")
    elif row["oldpeak"] >= 1.0:
        factors.append(f"Moderate ST depression ({row['oldpeak']} mm) observed on stress testing.")
    if row["exercise_induced_angina"] == "Yes":
        factors.append("Presence of exercise-induced angina symptoms.")
    if row["vessels_colored_by_flourosopy"] in ["One", "Two", "Three", "Four"]:
        factors.append(f"Fluoroscopy indicates {row['vessels_colored_by_flourosopy'].lower()} major vessel(s) colored.")
    if row["cholestoral"] >= 240:
        factors.append(f"Elevated total serum cholesterol ({int(row['cholestoral'])} mg/dl).")
    if row["resting_blood_pressure"] >= 140:
        factors.append(f"Stage 2 hypertension / elevated resting BP ({int(row['resting_blood_pressure'])} mmHg).")
    if row["Max_heart_rate"] < 120 and row["age"] < 65:
        factors.append(f"Lower than expected maximum heart rate ({int(row['Max_heart_rate'])} bpm).")

    if not factors:
        if probability >= 0.5:
            factors.append("Aggregate cardiovascular marker profile indicates elevated statistical risk.")
        else:
            factors.append("Resting blood pressure and serum cholesterol within favorable ranges.")
            factors.append("Normal cardiac perfusion and baseline electrocardiogram metrics.")

    if probability >= 0.7:
        summary = "High clinical probability of coronary artery disease detected. Immediate comprehensive cardiology follow-up is recommended."
    elif probability >= 0.5:
        summary = "Elevated risk profile detected. Further non-invasive diagnostic testing and lifestyle modification recommended."
    elif probability >= 0.3:
        summary = "Borderline / moderate risk detected. Routine clinical monitoring and preventive heart health practices advised."
    else:
        summary = "Healthy cardiovascular profile. The machine learning pipeline indicates low likelihood of coronary heart disease."

    return summary, factors

def predict_heart_disease(data: Dict[str, Any]) -> Dict[str, Any]:
    model = get_model()
    scaler = get_scaler()
    
    df = normalize_input(data)
    
    categorical_cols = [
        'sex', 'chest_pain_type', 'fasting_blood_sugar', 
        'rest_ecg', 'exercise_induced_angina', 'slope', 
        'vessels_colored_by_flourosopy', 'thalassemia'
    ]
    
    df_encoded = pd.get_dummies(df, columns=categorical_cols)
    
    # Safely align feature names with fallback support
    if hasattr(model, "feature_names_in_"):
        expected_columns = [str(col) for col in model.feature_names_in_]
    elif hasattr(scaler, "feature_names_in_"):
        expected_columns = [str(col) for col in scaler.feature_names_in_]
    else:
        expected_columns = list(df_encoded.columns)
    
    for col in expected_columns:
        if col not in df_encoded.columns:
            df_encoded[col] = 0
            
    df_encoded = df_encoded[expected_columns]
    
    df_scaled = pd.DataFrame(scaler.transform(df_encoded), columns=expected_columns)
    df_scaled.columns = [str(col) for col in df_scaled.columns]

    probabilities = model.predict_proba(df_scaled)[0]
    
    # Class 0 = heart disease, Class 1 = healthy in this Logistic Regression model
    prob_disease = float(probabilities[0])
    prob_pct = round(prob_disease * 100, 1)

    if prob_disease >= 0.65:
        risk_level = "High"
    elif prob_disease >= 0.40:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    # Derive binary prediction from disease probability for consistency
    pred = 1 if prob_disease >= 0.5 else 0
    status = "Heart Disease Risk" if pred == 1 else "Healthy"
    summary, contributing_factors = generate_insights(df, prob_disease)

    return {
        "prediction": pred,
        "status": status,
        "probability": round(prob_disease, 4),
        "probability_percentage": prob_pct,
        "healthy_probability_percentage": round((1.0 - prob_disease) * 100, 1),
        "risk_level": risk_level,
        "summary": summary,
        "contributing_factors": contributing_factors,
        "normalized_features": df.to_dict(orient="records")[0]
    }