'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartDiseaseInput } from '../types/prediction';
import { MedicalScanningLoader } from './MedicalScanningLoader';
import {
  User,
  Heart,
  Droplets,
  Activity,
  Gauge,
  ChevronDown,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Calendar,
  Users,
  Flame,
  Zap,
  TrendingDown,
  TrendingUp,
  Crosshair,
  Layers,
  HeartCrack,
  Check
} from 'lucide-react';

interface PredictionFormProps {
  formData: HeartDiseaseInput;
  onChange: (field: keyof HeartDiseaseInput, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

// Patient-friendly plain-English glossary for every feature
const FEATURE_EXPLANATIONS: Record<
  keyof HeartDiseaseInput,
  { plainTitle: string; plainDesc: string; whyItMatters: string; typicalRange: string }
> = {
  age: {
    plainTitle: 'Patient Age',
    plainDesc: 'How old you are in completed years.',
    whyItMatters: 'Cardiovascular risk naturally increases as blood vessels age and become less elastic over time.',
    typicalRange: 'Adults 18 – 100 years'
  },
  sex: {
    plainTitle: 'Biological Sex',
    plainDesc: 'Biological sex assigned at birth.',
    whyItMatters: 'Hormonal differences, vessel diameter, and coronary artery plaque patterns vary between biological sexes.',
    typicalRange: 'Female or Male'
  },
  resting_blood_pressure: {
    plainTitle: 'Resting Blood Pressure (Top Number)',
    plainDesc: 'The pressure inside your arteries when your heart is relaxed at rest.',
    whyItMatters: 'Chronic high blood pressure strains arterial walls, accelerating coronary narrowing.',
    typicalRange: 'Optimal: Under 120 mmHg; Stage 2 Hypertension: 140+ mmHg'
  },
  cholestoral: {
    plainTitle: 'Total Blood Cholesterol',
    plainDesc: 'The total amount of fatty substances circulating in your bloodstream.',
    whyItMatters: 'Excess cholesterol deposits into artery walls, forming plaque that restricts blood flow to your heart.',
    typicalRange: 'Desirable: Under 200 mg/dL; High: 240+ mg/dL'
  },
  fasting_blood_sugar: {
    plainTitle: 'Fasting Blood Sugar',
    plainDesc: 'Blood glucose level after not eating overnight (at least 8 hours).',
    whyItMatters: 'Elevated blood sugar inflames blood vessel linings and triples the likelihood of arterial disease.',
    typicalRange: 'Normal: 120 mg/dL or lower; Pre-diabetic / Diabetic: Above 120 mg/dL'
  },
  chest_pain_type: {
    plainTitle: 'Chest Discomfort Presentation',
    plainDesc: 'The type and trigger of any chest tightness, ache, pressure, or absence of symptoms.',
    whyItMatters: 'Typical angina (pressure during exertion relieved by rest) strongly correlates with coronary narrowing.',
    typicalRange: 'Typical, Atypical, Musculoskeletal, or Asymptomatic'
  },
  rest_ecg: {
    plainTitle: 'Resting Heart Electrical Pattern',
    plainDesc: 'The baseline electrical wave of your heart measured while resting comfortably.',
    whyItMatters: 'Reveals whether the heart muscle is thickened (hypertrophy) or experiencing resting strain (ST-T changes).',
    typicalRange: 'Normal tracing, ST-T wave changes, or Left Ventricular Hypertrophy'
  },
  Max_heart_rate: {
    plainTitle: 'Peak Exercise Heart Rate',
    plainDesc: 'The highest pulse you reached during a standardized treadmill or bike stress test.',
    whyItMatters: 'A vigorous heart easily reaches higher exercise rates; inability to raise heart rate may reflect arterial disease.',
    typicalRange: 'Normally estimated as ~220 minus your age (e.g. 160–185 bpm)'
  },
  exercise_induced_angina: {
    plainTitle: 'Chest Tightness During Exercise',
    plainDesc: 'Whether you felt chest tightness, pressure, or breathlessness while walking or exercising.',
    whyItMatters: 'Exertion increases heart oxygen demand; pain suggests arteries cannot deliver enough oxygenated blood.',
    typicalRange: 'No (favorable) or Yes (warning indicator)'
  },
  oldpeak: {
    plainTitle: 'Heart Strain on Exercise (ST Wave Dip)',
    plainDesc: 'A temporary dip in electrical signals during exercise showing heart muscle strain under effort.',
    whyItMatters: 'Deeper dips indicate that portions of your heart muscle were starved for oxygen during exertion.',
    typicalRange: 'Normal: 0.0 – 0.5 mm; Moderate: 1.0 – 1.9 mm; Severe: 2.0+ mm'
  },
  slope: {
    plainTitle: 'Recovery Slope After Peak Exercise',
    plainDesc: 'How quickly your heart’s electrical wave returns to normal after finishing peak exercise.',
    whyItMatters: 'An upsloping recovery is healthy; a flat or downward slope shows prolonged oxygen starvation.',
    typicalRange: 'Upsloping (healthy), Flat (borderline), Downsloping (ischemic)'
  },
  vessels_colored_by_flourosopy: {
    plainTitle: 'Narrowed Major Coronary Arteries',
    plainDesc: 'An X-ray dye test counting how many of the 4 main heart arteries show calcium or narrowing.',
    whyItMatters: 'Zero is the cleanest reading. Every colored vessel indicates significant localized blockage.',
    typicalRange: '0 vessels (best) to 3 or 4 vessels (multivessel narrowing)'
  },
  thalassemia: {
    plainTitle: 'Nuclear Heart Blood Flow Scan',
    plainDesc: 'A specialized imaging scan showing how uniformly blood reaches your heart muscle.',
    whyItMatters: 'A "Reversible Defect" means blood flow drops only during stress—a classic sign of treatable arterial blockage.',
    typicalRange: 'Normal Flow, Fixed Scar, or Reversible Stress Defect'
  }
};

export const PredictionForm: React.FC<PredictionFormProps> = ({
  formData,
  onChange,
  onSubmit,
  loading
}) => {
  // Wizard state: Step 1 to 4
  const [currentStep, setCurrentStep] = useState<number>(1);
  // View mode: 'wizard' vs 'all'
  const [viewMode, setViewMode] = useState<'wizard' | 'all'>('wizard');
  // Language mode: 'patient' vs 'clinical'
  const [isPatientMode, setIsPatientMode] = useState<boolean>(true);
  // Active tooltip popover for quick feature info
  const [activeTooltip, setActiveTooltip] = useState<keyof HeartDiseaseInput | null>(null);

  const steps = [
    {
      id: 1,
      title: isPatientMode ? 'About You' : 'Demographics',
      subtitle: 'Age & Biological Sex',
      icon: User,
      color: 'from-blue-500 to-indigo-600',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 2,
      title: isPatientMode ? 'Vitals & Blood Panel' : 'Vitals & Lipids',
      subtitle: 'Pressure, Cholesterol & Sugar',
      icon: Droplets,
      color: 'from-rose-500 to-amber-500',
      badgeColor: 'bg-rose-100 text-rose-700'
    },
    {
      id: 3,
      title: isPatientMode ? 'Chest Symptoms & ECG' : 'Symptoms & Resting ECG',
      subtitle: 'Pain Presentation & Rhythm',
      icon: Activity,
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-100 text-emerald-700'
    },
    {
      id: 4,
      title: isPatientMode ? 'Stress Test & Scans' : 'Stress & Nuclear Imaging',
      subtitle: 'Treadmill HR, Oldpeak & Vessels',
      icon: Gauge,
      color: 'from-purple-500 to-pink-600',
      badgeColor: 'bg-purple-100 text-purple-700'
    }
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Render colorful field header with context icon
  const renderFieldHeader = (
    field: keyof HeartDiseaseInput,
    clinicalLabel: string,
    IconComponent: any,
    iconStyle: string,
    unitBadge?: string
  ) => {
    const info = FEATURE_EXPLANATIONS[field];
    const isTooltipOpen = activeTooltip === field;

    return (
      <div className="relative mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg shrink-0 shadow-2xs ${iconStyle}`}>
              <IconComponent className="w-3.5 h-3.5" />
            </div>
            <label
              htmlFor={field}
              className="text-xs font-bold text-slate-800 tracking-tight cursor-pointer hover:text-blue-600 transition"
              onClick={() => setActiveTooltip(isTooltipOpen ? null : field)}
            >
              {isPatientMode ? info.plainTitle : clinicalLabel}
            </label>
            <button
              type="button"
              onClick={() => setActiveTooltip(isTooltipOpen ? null : field)}
              className="text-slate-400 hover:text-blue-600 transition p-0.5 rounded-full"
              title="Click for plain-English explanation"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          {unitBadge && (
            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              {unitBadge}
            </span>
          )}
        </div>

        {/* Interactive Tooltip Popover */}
        <AnimatePresence>
          {isTooltipOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute z-30 left-0 right-0 top-8 p-3.5 rounded-2xl bg-slate-900 text-white text-[11px] shadow-2xl border border-slate-700 leading-relaxed font-light backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-semibold text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  {info.plainTitle}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(null)}
                  className="text-slate-400 hover:text-white text-sm leading-none"
                >
                  &times;
                </button>
              </div>
              <p className="text-slate-200 mb-1.5">{info.plainDesc}</p>
              <p className="text-slate-400 text-[10px]">
                <strong className="text-slate-300">Why it matters:</strong> {info.whyItMatters}
              </p>
              <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-emerald-400 font-mono font-medium">
                {info.typicalRange}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Top Controls: Mode Switchers & Helpful Context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 border-b border-slate-200/80 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                13-Biomarker Diagnostic Evaluation
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                13/13 Calibrated
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light">
              {viewMode === 'wizard'
                ? `Step ${currentStep} of 4 &bull; ${steps[currentStep - 1].title}`
                : 'All-in-One Comprehensive Clinical Dashboard'}
            </p>
          </div>
        </div>

        {/* Toggles: Patient Mode & Wizard vs All Grid */}
        <div className="flex items-center space-x-2.5 self-end sm:self-auto flex-wrap gap-y-2">
          {/* Plain English vs Clinical Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsPatientMode(!isPatientMode)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isPatientMode
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-700 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
            <span>{isPatientMode ? 'Plain English (Active)' : 'Clinical Mode'}</span>
          </button>

          {/* Wizard vs All-in-One Toggle */}
          <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('wizard')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                viewMode === 'wizard'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Step Wizard
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Inputs
            </button>
          </div>
        </div>
      </div>

      {/* Wizard Step Navigation Tabs (only shown in wizard mode) */}
      {viewMode === 'wizard' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = currentStep === s.id;
              const isPast = currentStep > s.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentStep(s.id)}
                  className={`flex items-center space-x-2.5 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-white border-blue-400 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                      : isPast
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      : 'bg-slate-50/60 border-slate-200/60 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition-all shadow-2xs ${
                      isActive
                        ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                        : isPast
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 text-emerald-700 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-xs font-bold truncate">{s.title}</span>
                    <span className="block text-[10px] text-slate-400 truncate font-light">
                      {s.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Visual progress bar with animated gradient */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-rose-500 h-full rounded-full"
              initial={false}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Engaging Pulse / Laser Scanning Loader Component */}
      <MedicalScanningLoader isLoading={loading} />

      {/* Form Content: Step Wizard or All Grid */}
      <div className={`transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {/* STEP 1: Demographics */}
        {(viewMode === 'all' || currentStep === 1) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden bg-white/95 rounded-3xl p-6 border border-slate-200/80 shadow-xs mb-5"
          >
            {/* Top decorative gradient edge */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />

            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 mb-5">
              <div className="w-9 h-9 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center border border-blue-200">
                <User className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Step 1: Patient Demographics & Baseline
                </h3>
                <p className="text-xs text-slate-500 font-light">
                  {isPatientMode
                    ? 'Basic demographic details required for risk calibration'
                    : 'Baseline physiological age and biological sex'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Age */}
              <div>
                {renderFieldHeader(
                  'age',
                  'Age',
                  Calendar,
                  'bg-blue-100 text-blue-700',
                  'Range: 18 – 100'
                )}
                <div className="relative">
                  <input
                    id="age"
                    type="number"
                    min="18"
                    max="100"
                    required
                    value={formData.age}
                    onChange={(e) => onChange('age', parseFloat(e.target.value) || 0)}
                    disabled={loading}
                    className="w-full pl-3.5 pr-14 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 outline-none transition font-medium"
                    placeholder="38"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none font-medium">
                    years
                  </span>
                </div>
              </div>

              {/* Sex */}
              <div>
                {renderFieldHeader(
                  'sex',
                  'Biological Sex',
                  Users,
                  'bg-indigo-100 text-indigo-700',
                  'At birth'
                )}
                <div className="relative">
                  <select
                    id="sex"
                    value={formData.sex}
                    onChange={(e) => onChange('sex', e.target.value)}
                    disabled={loading}
                    className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 outline-none transition cursor-pointer font-medium"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Vitals & Lipids */}
        {(viewMode === 'all' || currentStep === 2) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden bg-white/95 rounded-3xl p-6 border border-slate-200/80 shadow-xs mb-5"
          >
            {/* Top decorative gradient edge */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500" />

            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 mb-5">
              <div className="w-9 h-9 rounded-2xl bg-rose-100/80 text-rose-600 flex items-center justify-center border border-rose-200">
                <Heart className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Step 2: Cardiovascular Vitals & Metabolic Biomarkers
                </h3>
                <p className="text-xs text-slate-500 font-light">
                  {isPatientMode
                    ? 'Resting blood pressure, total blood cholesterol, and fasting blood sugar'
                    : 'Systemic resting pressure and lipid panel fractionation'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Resting BP */}
              <div>
                {renderFieldHeader(
                  'resting_blood_pressure',
                  'Resting Blood Pressure',
                  Stethoscope,
                  'bg-rose-100 text-rose-700',
                  'Normal <120'
                )}
                <div className="relative">
                  <input
                    id="resting_blood_pressure"
                    type="number"
                    min="60"
                    max="250"
                    required
                    value={formData.resting_blood_pressure}
                    onChange={(e) => onChange('resting_blood_pressure', parseFloat(e.target.value) || 0)}
                    disabled={loading}
                    className="w-full pl-3.5 pr-16 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 outline-none transition font-medium"
                    placeholder="110"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none font-medium">
                    mmHg
                  </span>
                </div>
              </div>

              {/* Serum Cholesterol */}
              <div>
                {renderFieldHeader(
                  'cholestoral',
                  'Serum Cholesterol',
                  Droplets,
                  'bg-amber-100 text-amber-700',
                  'Optimal <200'
                )}
                <div className="relative">
                  <input
                    id="cholestoral"
                    type="number"
                    min="80"
                    max="600"
                    required
                    value={formData.cholestoral}
                    onChange={(e) => onChange('cholestoral', parseFloat(e.target.value) || 0)}
                    disabled={loading}
                    className="w-full pl-3.5 pr-16 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 outline-none transition font-medium"
                    placeholder="175"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none font-medium">
                    mg/dL
                  </span>
                </div>
              </div>

              {/* Fasting Blood Sugar */}
              <div>
                {renderFieldHeader(
                  'fasting_blood_sugar',
                  'Fasting Blood Sugar',
                  Flame,
                  'bg-orange-100 text-orange-700',
                  'Threshold 120'
                )}
                <div className="relative">
                  <select
                    id="fasting_blood_sugar"
                    value={formData.fasting_blood_sugar}
                    onChange={(e) => onChange('fasting_blood_sugar', e.target.value)}
                    disabled={loading}
                    className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 outline-none transition cursor-pointer font-medium"
                  >
                    <option value="Lower than 120 mg/ml">
                      {isPatientMode ? 'Normal Fasting (≤ 120 mg/dL)' : '≤ 120 mg/dL (Normal)'}
                    </option>
                    <option value="Greater than 120 mg/ml">
                      {isPatientMode ? 'High / Diabetic (> 120 mg/dL)' : '> 120 mg/dL (Elevated)'}
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Symptoms & ECG */}
        {(viewMode === 'all' || currentStep === 3) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden bg-white/95 rounded-3xl p-6 border border-slate-200/80 shadow-xs mb-5"
          >
            {/* Top decorative gradient edge */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />

            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 mb-5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <Activity className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Step 3: Chest Pain Presentation & Resting Electrocardiogram
                </h3>
                <p className="text-xs text-slate-500 font-light">
                  {isPatientMode
                    ? 'How chest discomfort presents, plus resting ECG wave patterns'
                    : 'Anginal pain classification and baseline 12-lead ECG findings'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Chest Pain Type */}
              <div>
                {renderFieldHeader(
                  'chest_pain_type',
                  'Chest Pain Presentation',
                  HeartCrack,
                  'bg-rose-100 text-rose-700',
                  'Presentation'
                )}
                <div className="relative">
                  <select
                    id="chest_pain_type"
                    value={formData.chest_pain_type}
                    onChange={(e) => onChange('chest_pain_type', e.target.value)}
                    disabled={loading}
                    className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 outline-none transition cursor-pointer font-medium"
                  >
                    <option value="Typical angina">
                      {isPatientMode ? 'Typical Angina (Pressure with exertion, relieved by rest)' : 'Typical Angina (Classic)'}
                    </option>
                    <option value="Atypical angina">
                      {isPatientMode ? 'Atypical Angina (Unusual chest discomfort)' : 'Atypical Angina'}
                    </option>
                    <option value="Non-anginal pain">
                      {isPatientMode ? 'Non-Heart Related Pain (Muscle / rib cage ache)' : 'Non-Anginal Pain'}
                    </option>
                    <option value="Asymptomatic">
                      {isPatientMode ? 'No Chest Pain Symptoms (Silent Presentation)' : 'Asymptomatic'}
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Resting ECG */}
              <div>
                {renderFieldHeader(
                  'rest_ecg',
                  'Resting ECG Tracing',
                  Activity,
                  'bg-emerald-100 text-emerald-700',
                  'Sinus rhythm'
                )}
                <div className="relative">
                  <select
                    id="rest_ecg"
                    value={formData.rest_ecg}
                    onChange={(e) => onChange('rest_ecg', e.target.value)}
                    disabled={loading}
                    className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 outline-none transition cursor-pointer font-medium"
                  >
                    <option value="Normal">
                      {isPatientMode ? 'Normal Baseline Waveform' : 'Normal'}
                    </option>
                    <option value="ST-T wave abnormality">
                      {isPatientMode ? 'Mild Electrical Abnormality (ST-T inversion)' : 'ST-T Wave Abnormality'}
                    </option>
                    <option value="Left ventricular hypertrophy">
                      {isPatientMode ? 'Thickened Heart Muscle (Left Ventricular Hypertrophy)' : 'Left Ventricular Hypertrophy (LVH)'}
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Stress Testing & Imaging */}
        {(viewMode === 'all' || currentStep === 4) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden bg-white/95 rounded-3xl p-6 border border-slate-200/80 shadow-xs mb-5"
          >
            {/* Top decorative gradient edge */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600" />

            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 mb-5">
              <div className="w-9 h-9 rounded-2xl bg-purple-100/80 text-purple-600 flex items-center justify-center border border-purple-200">
                <Gauge className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Step 4: Stress Hemodynamics, Coronary Vessels & Nuclear Perfusion
                </h3>
                <p className="text-xs text-slate-500 font-light">
                  {isPatientMode
                    ? 'Treadmill stress test metrics, fluoroscopy dye test, and nuclear imaging scan'
                    : 'Exercise hemodynamics, ST displacement, coronary calcification, and scintigraphy'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Max Heart Rate */}
              <div>
                {renderFieldHeader(
                  'Max_heart_rate',
                  'Maximum Exercise Heart Rate',
                  Zap,
                  'bg-rose-100 text-rose-700',
                  'Target ~220 - age'
                )}
                <div className="relative">
                  <input
                    id="Max_heart_rate"
                    type="number"
                    min="60"
                    max="240"
                    required
                    value={formData.Max_heart_rate}
                    onChange={(e) => onChange('Max_heart_rate', parseFloat(e.target.value) || 0)}
                    disabled={loading}
                    className="w-full pl-3.5 pr-14 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 outline-none transition font-medium"
                    placeholder="188"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none font-medium">
                    bpm
                  </span>
                </div>
              </div>

              {/* Exercise Induced Angina */}
              <div>
                {renderFieldHeader(
                  'exercise_induced_angina',
                  'Exercise-Induced Angina',
                  Activity,
                  'bg-red-100 text-red-700',
                  'Exertion trigger'
                )}
                <div className="relative">
                  <select
                    id="exercise_induced_angina"
                    value={formData.exercise_induced_angina}
                    onChange={(e) => onChange('exercise_induced_angina', e.target.value)}
                    disabled={loading}
                    className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 outline-none transition cursor-pointer font-medium"
                  >
                    <option value="No">{isPatientMode ? 'No (No chest tightness with exertion)' : 'No'}</option>
                    <option value="Yes">{isPatientMode ? 'Yes (Felt chest tightness with exertion)' : 'Yes'}</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Oldpeak (ST Depression) */}
              <div>
                {renderFieldHeader(
                  'oldpeak',
                  'ST Depression (Oldpeak)',
                  TrendingDown,
                  'bg-violet-100 text-violet-700',
                  'Normal < 1.0 mm'
                )}
                <div className="relative">
                  <input
                    id="oldpeak"
                    type="number"
                    step="0.1"
                    min="0.0"
                    max="8.0"
                    required
                    value={formData.oldpeak}
                    onChange={(e) => onChange('oldpeak', parseFloat(e.target.value) || 0)}
                    disabled={loading}
                    className="w-full pl-3.5 pr-14 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 outline-none transition font-medium"
                    placeholder="0.0"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none font-medium">
                    mm
                  </span>
                </div>
              </div>

              {/* Slope */}
              <div>
                {renderFieldHeader(
                  'slope',
                  'Peak Exercise ST Slope',
                  TrendingUp,
                  'bg-cyan-100 text-cyan-700',
                  'Wave trajectory'
                )}
                <div className="relative">
                  <select
                    id="slope"
                    value={formData.slope}
                    onChange={(e) => onChange('slope', e.target.value)}
                    disabled={loading}
                    className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 outline-none transition cursor-pointer font-medium"
                  >
                    <option value="Upsloping">
                      {isPatientMode ? 'Upsloping (Healthy cardiac response)' : 'Upsloping (Physiological)'}
                    </option>
                    <option value="Flat">
                      {isPatientMode ? 'Flat (Borderline oxygen supply)' : 'Flat (Equivocal)'}
                    </option>
                    <option value="Downsloping">
                      {isPatientMode ? 'Downsloping (Signs of oxygen strain)' : 'Downsloping (Ischemia)'}
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Vessels Colored by Fluoroscopy */}
              <div>
                {renderFieldHeader(
                  'vessels_colored_by_flourosopy',
                  'Fluoroscopy Colored Vessels',
                  Crosshair,
                  'bg-purple-100 text-purple-700',
                  '0 to 4 major arteries'
                )}
                <div className="relative">
                  <select
                    id="vessels_colored_by_flourosopy"
                    value={formData.vessels_colored_by_flourosopy}
                    onChange={(e) => onChange('vessels_colored_by_flourosopy', e.target.value)}
                    disabled={loading}
                    className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 outline-none transition cursor-pointer font-medium"
                  >
                    <option value="Zero">0 Vessels (Clean / Open Arteries)</option>
                    <option value="One">1 Major Vessel Narrowed</option>
                    <option value="Two">2 Major Vessels Narrowed</option>
                    <option value="Three">3 Major Vessels Narrowed</option>
                    <option value="Four">4 Major Vessels Narrowed</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Thalassemia / Nuclear Perfusion */}
              <div>
                {renderFieldHeader(
                  'thalassemia',
                  'Thallium Perfusion Scan',
                  Layers,
                  'bg-fuchsia-100 text-fuchsia-700',
                  'Nuclear scan'
                )}
                <div className="relative">
                  <select
                    id="thalassemia"
                    value={formData.thalassemia}
                    onChange={(e) => onChange('thalassemia', e.target.value)}
                    disabled={loading}
                    className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 outline-none transition cursor-pointer font-medium"
                  >
                    <option value="Normal">
                      {isPatientMode ? 'Normal Blood Flow Throughout Heart' : 'Normal Uniform Perfusion'}
                    </option>
                    <option value="Reversable Defect">
                      {isPatientMode ? 'Reversible Defect (Drops only during stress)' : 'Reversable Defect (Stress Ischemia)'}
                    </option>
                    <option value="Fixed Defect">
                      {isPatientMode ? 'Fixed Defect (Old scar tissue / past infarct)' : 'Fixed Defect (Infarction / Scar)'}
                    </option>
                    <option value="No">No Defect Documented</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation Buttons & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-3 gap-4">
        {/* Wizard Step buttons (in wizard mode) */}
        {viewMode === 'wizard' ? (
          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              type="button"
              disabled={currentStep === 1 || loading}
              onClick={handlePrev}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-light flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All 13 standard clinical predictors ready for evaluation</span>
          </div>
        )}

        {/* Primary Submit Button with vibrant gradient and animated pulse */}
        <button
          type="submit"
          disabled={loading}
          className="relative group w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 hover:from-blue-700 hover:via-indigo-700 hover:to-rose-700 active:scale-[0.99] text-white font-bold text-sm tracking-tight shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-3 cursor-pointer overflow-hidden"
        >
          {/* Subtle button sheen animation */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />

          {loading ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Executing Logistic Regression Inference...</span>
            </>
          ) : (
            <>
              <Activity className="w-5 h-5 text-white/90 animate-pulse" />
              <span>
                {currentStep === 4 || viewMode === 'all'
                  ? 'Compute Cardiovascular Risk Score'
                  : 'Evaluate Risk (Quick Analysis)'}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
