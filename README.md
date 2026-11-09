# 🫀 CardioScan: Cardiovascular Disease Risk Intelligence

A full-stack clinical decision support (CDS) web application powered by a tuned Logistic Regression machine learning model with standard feature scaling, built for high-precision ischemic heart disease risk evaluation across 13 diagnostic biomarkers[cite: 2].

[![Live Deployment](https://img.shields.io/badge/Vercel-Live%20App-blue?style=for-the-badge&logo=vercel)](https://heart-disease-app-v2.vercel.app/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

---

## 🌟 Overview

CardioScan bridges clinical analytics and modern web technology. It leverages the **Cleveland Clinic Foundation Heart Disease Dataset** to evaluate patient biomarkers in real-time, providing actionable risk probabilities, confidence scores, and contributing diagnostic factors within sub-30ms execution times[cite: 2].

---

## 🚀 Key Features

* **Clinical Decision Support:** Evaluates 13 distinct patient biomarkers (age, sex, chest pain type, resting blood pressure, cholesterol, fasting blood sugar, rest ECG, max heart rate, exercise-induced angina, oldpeak, slope, major vessels fluoroscopy, and thalassemia).
* **Live Engine Heartbeat:** Real-time health-checking mechanism that monitors backend connectivity and model pipeline status.
* **Patient Presets:** One-click benchmark loading for Healthy, Moderate Risk, and High Risk clinical profiles[cite: 2].
* **Interactive Biomarker Guide:** Built-in medical reference modal explaining each diagnostic factor and clinical significance.
* **Unified Multi-Service Architecture:** Deployed as a single monolithic project on Vercel with clean API routing (`/api/(.*)`) and native framework integration.

---

## 🛠️ Technology Stack

* **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
* **Backend:** FastAPI, Python, Pydantic, Uvicorn.
* **Machine Learning:** Scikit-learn, Pandas, NumPy, Joblib (Tuned Logistic Regression Pipeline with `StandardScaler`).
* **Deployment & Hosting:** Vercel (Multi-Service Architecture).

---

## 📂 Project Structure

```text
Heart_Disease_Web_App/
├── backend/                  # FastAPI Backend Service
│   ├── main.py               # API endpoints, lifespan, and CORS configuration
│   ├── model_service.py      # ML pipeline inference logic
│   ├── requirements.txt      # Python dependencies (UTF-8 encoded)
│   └── model/                # Saved scikit-learn pipeline (.pkl/.joblib)
├── frontend/                 # Next.js Frontend Service
│   ├── src/                  # App components, pages, types, and styles
│   ├── package.json          # Node dependencies
│   └── next.config.ts        # Next.js configuration
└── vercel.json               # Root multi-service routing configuration
