'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PredictionResponse, HeartDiseaseInput } from '../types/prediction';
import {
  X,
  Printer,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Activity,
  FileCheck2,
  Calendar,
  User,
  Stethoscope,
  Info
} from 'lucide-react';

interface ClinicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PredictionResponse | null;
  formData: HeartDiseaseInput;
}

export const ClinicalReportModal: React.FC<ClinicalReportModalProps> = ({
  isOpen,
  onClose,
  result,
  formData
}) => {
  if (!isOpen || !result) return null;

  const isRisk = result.prediction === 1;
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const reportTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const reportId = `CDS-${Math.floor(100000 + Math.random() * 900000)}`;

  // Define clinical reference table
  const biomarkersList = [
    {
      name: 'Age',
      category: 'Demographics',
      patientValue: `${formData.age} yrs`,
      reference: '18 – 100 yrs',
      status: formData.age > 60 ? 'Review' : 'Normal'
    },
    {
      name: 'Biological Sex',
      category: 'Demographics',
      patientValue: formData.sex,
      reference: 'Male / Female',
      status: 'Normal'
    },
    {
      name: 'Chest Pain Presentation',
      category: 'Symptoms',
      patientValue: formData.chest_pain_type,
      reference: 'Typical / Atypical / Non-anginal / Asymptomatic',
      status: formData.chest_pain_type === 'Asymptomatic' || formData.chest_pain_type === 'Typical angina' ? 'Attention' : 'Normal'
    },
    {
      name: 'Resting Blood Pressure',
      category: 'Hemodynamics',
      patientValue: `${formData.resting_blood_pressure} mmHg`,
      reference: '< 120 mmHg (Normal systolic)',
      status: formData.resting_blood_pressure >= 140 ? 'High' : formData.resting_blood_pressure >= 120 ? 'Elevated' : 'Optimal'
    },
    {
      name: 'Serum Cholesterol',
      category: 'Lipids',
      patientValue: `${formData.cholestoral} mg/dL`,
      reference: '< 200 mg/dL (Desirable)',
      status: formData.cholestoral >= 240 ? 'High' : formData.cholestoral >= 200 ? 'Borderline' : 'Optimal'
    },
    {
      name: 'Fasting Blood Sugar',
      category: 'Metabolic',
      patientValue: formData.fasting_blood_sugar === 'Greater than 120 mg/ml' ? '> 120 mg/dL' : '≤ 120 mg/dL',
      reference: '≤ 120 mg/dL (Normal fasting)',
      status: formData.fasting_blood_sugar === 'Greater than 120 mg/ml' ? 'Elevated' : 'Normal'
    },
    {
      name: 'Resting ECG',
      category: 'Electrophysiology',
      patientValue: formData.rest_ecg,
      reference: 'Normal baseline sinus rhythm',
      status: formData.rest_ecg === 'Normal' ? 'Normal' : 'Abnormal'
    },
    {
      name: 'Max Heart Rate (Treadmill)',
      category: 'Stress Test',
      patientValue: `${formData.Max_heart_rate} bpm`,
      reference: `Target: ~${220 - formData.age} bpm`,
      status: formData.Max_heart_rate < 120 ? 'Reduced' : 'Normal'
    },
    {
      name: 'Exercise-Induced Angina',
      category: 'Stress Test',
      patientValue: formData.exercise_induced_angina,
      reference: 'No exertional angina',
      status: formData.exercise_induced_angina === 'Yes' ? 'Positive' : 'Normal'
    },
    {
      name: 'ST Depression (Oldpeak)',
      category: 'ECG Stress',
      patientValue: `${formData.oldpeak} mm`,
      reference: '< 1.0 mm (Normal)',
      status: formData.oldpeak >= 2.0 ? 'Severe' : formData.oldpeak >= 1.0 ? 'Moderate' : 'Normal'
    },
    {
      name: 'Peak ST Segment Slope',
      category: 'ECG Stress',
      patientValue: formData.slope,
      reference: 'Upsloping (Physiological)',
      status: formData.slope === 'Downsloping' ? 'Ischemic' : formData.slope === 'Flat' ? 'Borderline' : 'Normal'
    },
    {
      name: 'Fluoroscopy Colored Vessels',
      category: 'Coronary Anatomy',
      patientValue: `${formData.vessels_colored_by_flourosopy} vessels`,
      reference: '0 vessels (Patent lumen)',
      status: formData.vessels_colored_by_flourosopy !== 'Zero' ? 'Calcified' : 'Clean'
    },
    {
      name: 'Thallium Perfusion Scintigraphy',
      category: 'Nuclear Perfusion',
      patientValue: formData.thalassemia,
      reference: 'Normal uniform perfusion',
      status: formData.thalassemia === 'Reversable Defect' || formData.thalassemia === 'Fixed Defect' ? 'Defect' : 'Normal'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto print:shadow-none print:border-none print:max-w-none print:rounded-none"
        >
          {/* Action Header (hidden in print) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 print:hidden">
            <div className="flex items-center space-x-2 text-slate-700">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-sm">Clinical Summary & Consultation Report</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Report Document Body */}
          <div className="p-6 sm:p-10 text-slate-900 space-y-6 print:p-0 print:space-y-4">
            {/* Medical Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-slate-200 gap-4">
              <div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-950">CardioScan Intelligence</h1>
                    <p className="text-xs text-slate-500 font-light">Clinical Cardiovascular Decision Support System</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-2">
                  Model: Tuned Logistic Regression &bull; Cleveland Clinic Foundation Protocol
                </p>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5">
                <div><span className="font-semibold text-slate-700">Report ID:</span> {reportId}</div>
                <div><span className="font-semibold text-slate-700">Date:</span> {reportDate} &bull; {reportTime}</div>
                <div><span className="font-semibold text-slate-700">Evaluation:</span> Standardized 13-Biomarker Analysis</div>
              </div>
            </div>

            {/* Patient Profile & Classification Summary Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              {/* Demographics Column */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Patient Demographics</span>
                <div className="mt-1 space-y-0.5 text-xs text-slate-700">
                  <div><strong>Age:</strong> {formData.age} years</div>
                  <div><strong>Biological Sex:</strong> {formData.sex}</div>
                  <div><strong>Presentation:</strong> {formData.chest_pain_type}</div>
                </div>
              </div>

              {/* Classification Column */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Risk Assessment Tier</span>
                <div className="mt-1 flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      isRisk
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {isRisk ? <AlertTriangle className="w-3 h-3 mr-1" /> : <ShieldCheck className="w-3 h-3 mr-1" />}
                    {result.risk_level} Cardiovascular Risk
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Status: <strong>{result.status}</strong>
                </div>
              </div>

              {/* Exact Probability Column */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Model Probability</span>
                <div className="mt-1 flex items-baseline space-x-1">
                  <span className={`text-2xl font-bold ${isRisk ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {result.probability_percentage}%
                  </span>
                  <span className="text-xs text-slate-400">ischemic risk</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Healthy Confidence: {result.healthy_probability_percentage}%
                </div>
              </div>
            </div>

            {/* Diagnostic Narrative Synthesis */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                Diagnostic Narrative & Clinical Summary
              </h3>
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/60 text-xs sm:text-sm text-slate-800 leading-relaxed font-light">
                {result.summary}
              </div>
            </div>

            {/* Key Pathophysiological Factors */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Primary Clinical Contributing Factors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.contributing_factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 flex items-start space-x-2"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        isRisk ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                    />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 13 Clinical Biomarkers Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Complete 13-Biomarker Physiological Profile
              </h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600">
                    <tr>
                      <th className="py-2.5 px-3 sm:px-4">Biomarker / Indicator</th>
                      <th className="py-2.5 px-3 sm:px-4">Category</th>
                      <th className="py-2.5 px-3 sm:px-4">Patient Result</th>
                      <th className="py-2.5 px-3 sm:px-4 hidden sm:table-cell">Standard Reference</th>
                      <th className="py-2.5 px-3 sm:px-4 text-right">Indicator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                    {biomarkersList.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition">
                        <td className="py-2 px-3 sm:px-4 font-medium text-slate-900">{row.name}</td>
                        <td className="py-2 px-3 sm:px-4 text-slate-500 text-[11px]">{row.category}</td>
                        <td className="py-2 px-3 sm:px-4 font-semibold text-slate-800">{row.patientValue}</td>
                        <td className="py-2 px-3 sm:px-4 text-slate-500 text-[11px] hidden sm:table-cell">{row.reference}</td>
                        <td className="py-2 px-3 sm:px-4 text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                              row.status === 'Optimal' || row.status === 'Clean' || row.status === 'Normal'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : row.status === 'Borderline' || row.status === 'Elevated' || row.status === 'Review'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommended Clinical Next Steps */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                Actionable Next Steps for Patient & Primary Care Physician
              </span>
              <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 font-light">
                {isRisk ? (
                  <>
                    <li>Schedule a comprehensive clinical cardiology evaluation and resting 12-lead ECG review.</li>
                    <li>Consider non-invasive stress echocardiography or coronary computed tomography angiography (CCTA).</li>
                    <li>Discuss guideline-directed medical therapy for lipid reduction and blood pressure management.</li>
                    <li>Adopt dietary interventions (Mediterranean/DASH diet) and structured supervised aerobic exercise.</li>
                  </>
                ) : (
                  <>
                    <li>Continue routine annual preventive health screenings and metabolic blood panels.</li>
                    <li>Maintain regular cardiovascular exercise (at least 150 minutes of moderate aerobic activity weekly).</li>
                    <li>Maintain blood pressure below 120/80 mmHg and serum LDL below guideline thresholds.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Disclaimer & Physician Hand-off Signoff */}
            <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>Notice of Algorithmic Clinical Decision Support:</strong> This automated risk report was produced via a tuned Logistic Regression Scikit-Learn Pipeline trained on the Cleveland Clinic Cardiovascular Dataset. This model serves as an informational diagnostic adjunct and does not constitute a definitive medical diagnosis. Clinical correlation by a licensed physician is mandatory.
              </p>
              <div className="flex justify-between items-end pt-6 print:pt-10">
                <div className="border-t border-slate-300 w-48 text-center text-slate-500 pt-1">
                  Physician Signature
                </div>
                <div className="border-t border-slate-300 w-48 text-center text-slate-500 pt-1">
                  Date Reviewed
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

