'use client';

import React from 'react';
import {
  X,
  BookOpen,
  Calendar,
  Users,
  Stethoscope,
  Droplets,
  Flame,
  HeartCrack,
  Activity,
  Zap,
  TrendingDown,
  TrendingUp,
  Crosshair,
  Layers,
  Sparkles
} from 'lucide-react';

interface MedicalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalGuideModal: React.FC<MedicalGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    {
      name: 'Age',
      category: 'Demographics',
      unit: 'Years',
      icon: Calendar,
      iconColor: 'bg-blue-100 text-blue-700',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      desc: 'Patient physiological age in completed calendar years. Vessel stiffness and arterial plaque prevalence increase naturally over time.'
    },
    {
      name: 'Biological Sex',
      category: 'Demographics',
      unit: 'Female / Male',
      icon: Users,
      iconColor: 'bg-indigo-100 text-indigo-700',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      desc: 'Karyotypic sex assigned at birth. Hormonal differences and epicardial vessel diameters contribute to variance in cardiovascular risk profiles.'
    },
    {
      name: 'Chest Pain Type',
      category: 'Symptoms',
      unit: 'Subtypes (0–3)',
      icon: HeartCrack,
      iconColor: 'bg-rose-100 text-rose-700',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      desc: 'Typical Angina (classic pressure provoked by exertion and relieved by rest), Atypical Angina, Non-anginal musculoskeletal pain, or Asymptomatic (silent presentation).'
    },
    {
      name: 'Resting Blood Pressure',
      category: 'Hemodynamics',
      unit: 'mm Hg',
      icon: Stethoscope,
      iconColor: 'bg-rose-100 text-rose-700',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      desc: 'Systolic blood pressure measured upon hospital or clinic admission. Chronic elevations (>140 mmHg) cause microvascular endothelial strain.'
    },
    {
      name: 'Serum Cholesterol',
      category: 'Lipids',
      unit: 'mg/dL',
      icon: Droplets,
      iconColor: 'bg-amber-100 text-amber-700',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      desc: 'Total fasting blood serum cholesterol level. Levels above 200 mg/dL accelerate atheroma plaque accumulation inside coronary walls.'
    },
    {
      name: 'Fasting Blood Sugar',
      category: 'Metabolic',
      unit: '> 120 mg/dL',
      icon: Flame,
      iconColor: 'bg-orange-100 text-orange-700',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      desc: 'Fasting glucose status after 8+ hours. Values exceeding 120 mg/dL reflect impaired glucose tolerance or diabetes, multiplying vascular risk.'
    },
    {
      name: 'Resting Electrocardiogram',
      category: 'Electrophysiology',
      unit: '12-Lead ECG',
      icon: Activity,
      iconColor: 'bg-emerald-100 text-emerald-700',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'Baseline electrical tracing: Normal sinus rhythm, ST-T wave abnormalities (T-wave inversion / ST elevation), or Left Ventricular Hypertrophy (LVH).'
    },
    {
      name: 'Maximum Heart Rate',
      category: 'Stress Testing',
      unit: 'bpm',
      icon: Zap,
      iconColor: 'bg-rose-100 text-rose-700',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      desc: 'Highest pulse achieved during treadmill or cycle stress test. Reflects chronotropic reserve; inability to reach age-predicted targets indicates disease.'
    },
    {
      name: 'Exercise-Induced Angina',
      category: 'Stress Testing',
      unit: 'Yes / No',
      icon: Activity,
      iconColor: 'bg-red-100 text-red-700',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      desc: 'Provocation of ischemic chest tightness during exercise stress test. Indicates transient subendocardial oxygen supply-demand mismatch.'
    },
    {
      name: 'Oldpeak (ST Depression)',
      category: 'ECG Stress',
      unit: 'mm',
      icon: TrendingDown,
      iconColor: 'bg-violet-100 text-violet-700',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
      desc: 'Degree of ST segment depression relative to resting baseline. Depressions ≥ 1.0 mm signify reversible myocardial ischemia during physical strain.'
    },
    {
      name: 'Peak ST Slope',
      category: 'ECG Stress',
      unit: 'Trajectory',
      icon: TrendingUp,
      iconColor: 'bg-cyan-100 text-cyan-700',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      desc: 'Slope of ST segment at peak exercise: Upsloping (healthy physiological acceleration), Flat (borderline ischemia), or Downsloping (severe ischemia).'
    },
    {
      name: 'Fluoroscopy Colored Vessels',
      category: 'Angiography',
      unit: '0 to 4 Vessels',
      icon: Crosshair,
      iconColor: 'bg-purple-100 text-purple-700',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      desc: 'Number of major coronary arteries (LAD, LCx, RCA, LM) showing contrast dye filling defects or lumen calcification under X-ray fluoroscopy.'
    },
    {
      name: 'Thallium Perfusion Scintigraphy',
      category: 'Nuclear Perfusion',
      unit: 'Perfusion Scan',
      icon: Layers,
      iconColor: 'bg-fuchsia-100 text-fuchsia-700',
      badgeColor: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
      desc: 'Myocardial nuclear imaging: Normal perfusion, Fixed Defect (permanent infarcted scar tissue), or Reversible Defect (stress ischemia that normalizes at rest).'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 my-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  13 Clinical Biomarkers Guide
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                  Cleveland Standards
                </span>
              </div>
              <p className="text-xs text-slate-500 font-light mt-0.5">
                Medical definitions, clinical thresholds, and diagnostic significance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-3.5 divide-y divide-slate-100">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="pt-3.5 first:pt-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-1.5 rounded-lg shrink-0 shadow-2xs ${item.iconColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900">
                        {idx + 1}. {item.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-light ml-2">
                        &bull; {item.category}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}
                  >
                    {item.unit}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-light pl-8">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-light">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Standardized diagnostic features calibrated for Scikit-Learn</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-xs cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
