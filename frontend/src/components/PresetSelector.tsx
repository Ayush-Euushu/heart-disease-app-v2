'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartDiseaseInput } from '../types/prediction';
import {
  Sparkles,
  UserCheck,
  AlertOctagon,
  RotateCcw,
  Check,
  ArrowRight,
  ShieldCheck,
  Heart,
  Activity,
  Flame,
  Zap,
  Layers
} from 'lucide-react';

interface PresetSelectorProps {
  onSelectPreset: (preset: HeartDiseaseInput) => void;
  onReset: () => void;
  activePresetKey?: string | null;
}

export const PRESETS: Record<
  string,
  {
    title: string;
    subtitle: string;
    expectedBadge: string;
    badgeStyle: string;
    demographic: string;
    tags: { label: string; icon: any }[];
    icon: any;
    iconBg: string;
    gradientBg: string;
    activeBorder: string;
    textColor: string;
    glowColor: string;
    data: HeartDiseaseInput;
  }
> = {
  healthy: {
    title: 'Low Risk Profile',
    subtitle: 'Younger female, high chronotropic reserve, zero vessel calcification, normal ST segment',
    expectedBadge: '< 20% Expected Risk',
    badgeStyle: 'bg-emerald-600 text-white shadow-xs',
    demographic: '38yo Female',
    tags: [
      { label: 'Max HR 188 bpm', icon: Zap },
      { label: '0 Vessels Colored', icon: ShieldCheck },
      { label: 'Normal Perfusion', icon: Heart },
      { label: 'Oldpeak 0.0 mm', icon: Activity }
    ],
    icon: UserCheck,
    iconBg: 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200',
    gradientBg:
      'bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white hover:from-emerald-100/90 hover:via-teal-50/70 hover:to-emerald-50/50 border-emerald-200/90 hover:border-emerald-400',
    activeBorder: 'ring-2 ring-emerald-500 border-emerald-500 from-emerald-100/80 via-teal-50 to-emerald-50 shadow-md shadow-emerald-500/10',
    textColor: 'text-emerald-950',
    glowColor: 'rgba(16, 185, 129, 0.2)',
    data: {
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
    }
  },
  moderate: {
    title: 'Moderate Risk Profile',
    subtitle: 'Middle-aged male, borderline hypertension, ST-T wave variation, single vessel narrowing',
    expectedBadge: '~50% Expected Risk',
    badgeStyle: 'bg-amber-500 text-white shadow-xs',
    demographic: '55yo Male',
    tags: [
      { label: 'ST-T Abnormality', icon: Activity },
      { label: '1 Vessel Narrowed', icon: Layers },
      { label: 'Oldpeak 1.2 mm', icon: Zap },
      { label: 'Flat ST Slope', icon: Sparkles }
    ],
    icon: Sparkles,
    iconBg: 'bg-amber-100 text-amber-700 ring-2 ring-amber-200',
    gradientBg:
      'bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-white hover:from-amber-100/90 hover:via-orange-50/70 hover:to-amber-50/50 border-amber-200/90 hover:border-amber-400',
    activeBorder: 'ring-2 ring-amber-500 border-amber-500 from-amber-100/80 via-orange-50 to-amber-50 shadow-md shadow-amber-500/10',
    textColor: 'text-amber-950',
    glowColor: 'rgba(245, 158, 11, 0.2)',
    data: {
      age: 55,
      sex: 'Male',
      chest_pain_type: 'Atypical angina',
      resting_blood_pressure: 135,
      cholestoral: 230,
      fasting_blood_sugar: 'Lower than 120 mg/ml',
      rest_ecg: 'ST-T wave abnormality',
      Max_heart_rate: 145,
      exercise_induced_angina: 'No',
      oldpeak: 1.2,
      slope: 'Flat',
      vessels_colored_by_flourosopy: 'One',
      thalassemia: 'Normal'
    }
  },
  highRisk: {
    title: 'High Risk Profile',
    subtitle: 'Older male, asymptomatic angina, severe ST depression, multivessel disease, reversible defect',
    expectedBadge: '> 75% Expected Risk',
    badgeStyle: 'bg-rose-600 text-white shadow-xs',
    demographic: '62yo Male',
    tags: [
      { label: '3 Vessels Narrowed', icon: AlertOctagon },
      { label: 'Reversible Defect', icon: Heart },
      { label: 'Oldpeak 2.8 mm', icon: Zap },
      { label: 'Exertional Angina', icon: Flame }
    ],
    icon: AlertOctagon,
    iconBg: 'bg-rose-100 text-rose-700 ring-2 ring-rose-200',
    gradientBg:
      'bg-gradient-to-br from-rose-50/90 via-purple-50/40 to-white hover:from-rose-100/90 hover:via-purple-50/60 hover:to-rose-50/50 border-rose-200/90 hover:border-rose-400',
    activeBorder: 'ring-2 ring-rose-500 border-rose-500 from-rose-100/80 via-purple-50 to-rose-50 shadow-md shadow-rose-500/15',
    textColor: 'text-rose-950',
    glowColor: 'rgba(225, 29, 72, 0.25)',
    data: {
      age: 62,
      sex: 'Male',
      chest_pain_type: 'Asymptomatic',
      resting_blood_pressure: 150,
      cholestoral: 280,
      fasting_blood_sugar: 'Greater than 120 mg/ml',
      rest_ecg: 'Left ventricular hypertrophy',
      Max_heart_rate: 120,
      exercise_induced_angina: 'Yes',
      oldpeak: 2.8,
      slope: 'Downsloping',
      vessels_colored_by_flourosopy: 'Three',
      thalassemia: 'Reversable Defect'
    }
  }
};

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  onSelectPreset,
  onReset,
  activePresetKey
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(activePresetKey || null);

  const handleSelect = (key: string, data: HeartDiseaseInput) => {
    setSelectedKey(key);
    onSelectPreset(data);
  };

  const handleReset = () => {
    setSelectedKey(null);
    onReset();
  };

  return (
    <div className="relative overflow-hidden bg-white/95 rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm mb-8 transition-all duration-200">
      {/* Background ambient corner glows */}
      <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-blue-100/40 via-indigo-50/20 to-transparent rounded-bl-full pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Quick Patient Evaluation Presets
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                1-Click Load
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Instantly populate the 13 clinical predictors with validated benchmark profiles calibrated for our tuned Logistic Regression model
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-medium text-slate-600 hover:text-slate-950 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all shadow-2xs self-end sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Form</span>
        </button>
      </div>

      {/* 3 Interactive Preset Cards with rich visual gradients */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {Object.entries(PRESETS).map(([key, item]) => {
          const Icon = item.icon;
          const isSelected = selectedKey === key;

          return (
            <motion.button
              key={key}
              type="button"
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(key, item.data)}
              className={`relative flex flex-col justify-between text-left p-4.5 rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer overflow-hidden ${
                isSelected ? item.activeBorder : item.gradientBg
              }`}
            >
              {/* Corner soft glow */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl pointer-events-none opacity-60"
                style={{ backgroundColor: item.glowColor }}
              />

              <div className="relative">
                {/* Top badges bar */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold tracking-tight px-2.5 py-0.5 rounded-lg bg-white/95 text-slate-800 shadow-2xs border border-slate-200/60">
                    {item.demographic}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg ${item.badgeStyle}`}>
                    {item.expectedBadge}
                  </span>
                </div>

                {/* Title & Icon with Category Accent */}
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-xl shadow-xs shrink-0 ${item.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-sm font-bold tracking-tight block ${item.textColor}`}>
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Verified Benchmark
                    </span>
                  </div>
                </div>

                {/* Subtitle summary */}
                <p className="text-[11px] text-slate-600 leading-relaxed font-light mb-3.5 line-clamp-2">
                  {item.subtitle}
                </p>
              </div>

              {/* Biomarker pill tags with intuitive mini-icons */}
              <div className="relative pt-3 border-t border-slate-200/50 flex flex-wrap gap-1.5 items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 2).map((t, idx) => {
                    const TagIcon = t.icon;
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/90 text-slate-700 shadow-2xs border border-slate-200/40"
                      >
                        <TagIcon className="w-2.5 h-2.5 text-blue-600" />
                        {t.label}
                      </span>
                    );
                  })}
                </div>

                {isSelected ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-white px-2.5 py-0.5 rounded-full shadow-xs border border-blue-200">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> Loaded
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 group-hover:text-blue-600 transition">
                    Load Preset <ArrowRight className="w-3 h-3 text-slate-400" />
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
