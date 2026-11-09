'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartDiseaseInput, PredictionResponse } from '../types/prediction';
import { Header } from '../components/Header';
import { PresetSelector } from '../components/PresetSelector';
import { PredictionForm } from '../components/PredictionForm';
import { ResultCard } from '../components/ResultCard';
import { MedicalGuideModal } from '../components/MedicalGuideModal';
import { MedicalHeroGraphic } from '../components/MedicalHeroGraphic';
import {
  HeartPulse,
  AlertCircle,
  Activity,
  Shield,
  FileCheck2,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

const DEFAULT_FORM_DATA: HeartDiseaseInput = {
  age: 38,
  sex: 'Female',
  chest_pain_type: 'Typical angina',
  resting_blood_pressure: 110,
  cholestoral: 175,
  fasting_blood_sugar: 'Lower than 120 mg/ml',
  rest_ecg: 'Normal',
  Max_heart_rate: 188,
  exercise_induced_angina: 'No',
  oldpeak: 0.0,
  slope: 'Upsloping',
  vessels_colored_by_flourosopy: 'Zero',
  thalassemia: 'Normal'
};

export default function Home() {
  const [formData, setFormData] = useState<HeartDiseaseInput>(DEFAULT_FORM_DATA);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [presetToast, setPresetToast] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFieldChange = (field: keyof HeartDiseaseInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectPreset = (presetData: HeartDiseaseInput) => {
    setFormData(presetData);
    setResult(null);
    setError(null);
    setPresetToast('Preset benchmark values loaded into form');
    setTimeout(() => setPresetToast(null), 3000);
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM_DATA);
    setResult(null);
    setError(null);
    setPresetToast('Form reset to default baseline');
    setTimeout(() => setPresetToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${API_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Prediction server returned HTTP ${response.status}`);
      }

      const data: PredictionResponse = await response.json();
      setResult(data);

      // Smooth scroll to the result section
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Prediction request error:', err);
      setError(
        err.message || 'Unable to connect to FastAPI prediction backend. Verify the backend server is running on http://127.0.0.1:8000.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 antialiased relative">
      {/* Subtle background ambient mesh glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-100/50 via-indigo-50/25 to-transparent pointer-events-none -z-10" />

      {/* Header with live API heartbeat badge and guide trigger */}
      <Header onOpenGuide={() => setIsGuideOpen(true)} />

      {/* Toast notification for preset loading */}
      <AnimatePresence>
        {presetToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 flex items-center gap-2 pointer-events-none backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{presetToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Clinical Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Hero Section: 2-Column Responsive Layout with Medical Hero Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 sm:mb-12">
          {/* Left Column: Heading, Badges & Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-300 text-blue-800 text-xs font-semibold tracking-tight shadow-2xs">
                <HeartPulse className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>Cleveland Clinic Clinical Validation Protocol</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-[11px] font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>StandardScaler Calibrated</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
              Cardiovascular Disease{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent">
                Risk Intelligence
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-normal max-w-2xl mt-3.5 leading-relaxed">
              Standardized clinical decision support engine. Evaluate ischemic heart disease probability via our tuned Logistic Regression model with standard feature scaling across 13 diagnostic biomarkers.
            </p>

            {/* Quick Metrics Bar with colorful icon tags */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-5 pt-4 border-t border-slate-200/80 text-xs">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/70 text-blue-900 font-semibold">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Tuned Logistic Regression</span>
              </div>
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200/70 text-indigo-900 font-semibold">
                <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>13 Biomarkers</span>
              </div>
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200/70 text-rose-900 font-semibold">
                <Zap className="w-3.5 h-3.5 text-rose-600" />
                <span>Sub-30ms Real-Time Inference</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Medical Hero Telemetry Illustration */}
          <div className="lg:col-span-5">
            <MedicalHeroGraphic />
          </div>
        </div>

        {/* Error Notification Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs sm:text-sm flex items-start space-x-3.5 shadow-xs"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Backend Communication Notice: </span>
                <span className="font-normal">{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-rose-600 hover:text-rose-800 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-100 transition"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Patient Presets Selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <PresetSelector
            onSelectPreset={handleSelectPreset}
            onReset={handleReset}
          />
        </motion.div>

        {/* Clinical Prediction Form (Wizard & All-in-One) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <PredictionForm
            formData={formData}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </motion.div>

        {/* Diagnostic Results Card Section */}
        <div ref={resultsRef}>
          <ResultCard
            result={result}
            formData={formData}
            onClear={() => setResult(null)}
          />
        </div>
      </main>

      {/* Clinical Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-6 mt-16 text-center text-xs text-slate-500 font-light print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">CardioScan Intelligence</span>
            <span>&bull;</span>
            <span>Clinical Cardiovascular Decision Support System</span>
          </div>

          <div className="text-slate-400 text-[11px]">
            Trained on Cleveland Clinic Foundation Dataset &bull; FastAPI + Scikit-Learn Logistic Regression + Next.js
          </div>
        </div>
      </footer>

      {/* Biomarker Reference Modal */}
      <MedicalGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
