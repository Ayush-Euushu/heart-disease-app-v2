'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PredictionResponse, HeartDiseaseInput } from '../types/prediction';
import { RiskGauge } from './RiskGauge';
import { ClinicalReportModal } from './ClinicalReportModal';
import {
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Sparkles,
  Heart,
  Activity,
  ArrowRight,
  TrendingUp,
  Stethoscope,
  HeartPulse,
  Flame,
  Zap,
  Check
} from 'lucide-react';

interface ResultCardProps {
  result: PredictionResponse | null;
  formData: HeartDiseaseInput;
  onClear: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, formData, onClear }) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showPlainEnglish, setShowPlainEnglish] = useState(true);

  if (!result) return null;

  const isRisk = result.prediction === 1;
  const isHighRisk = result.risk_level === 'High';
  const isModerateRisk = result.risk_level === 'Moderate';

  // Dynamic color theme definitions
  const theme = {
    Low: {
      cardBg: 'bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border-emerald-300 shadow-emerald-500/10',
      badge: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/20',
      auraColor: 'rgba(16, 185, 129, 0.25)',
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/30',
      headline: 'Healthy Cardiac Perfusion Profile',
      tagline: 'Favorable clinical indicators suggest low probability of ischemic heart disease',
      statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      accentBorder: 'border-l-4 border-l-emerald-500',
      factorDot: 'bg-emerald-500 ring-4 ring-emerald-100'
    },
    Moderate: {
      cardBg: 'bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white border-amber-300 shadow-amber-500/10',
      badge: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20',
      auraColor: 'rgba(245, 158, 11, 0.25)',
      iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30',
      headline: 'Moderate Risk & Proactive Observation Recommended',
      tagline: 'Certain intermediate markers suggest clinical follow-up and preventive lifestyle optimization',
      statusBadge: 'bg-amber-100 text-amber-800 border-amber-300',
      accentBorder: 'border-l-4 border-l-amber-500',
      factorDot: 'bg-amber-500 ring-4 ring-amber-100'
    },
    High: {
      cardBg: 'bg-gradient-to-br from-rose-50/90 via-purple-50/40 to-white border-rose-300 shadow-rose-500/15',
      badge: 'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white shadow-rose-600/30',
      auraColor: 'rgba(225, 29, 72, 0.3)',
      iconBg: 'bg-gradient-to-tr from-rose-600 via-pink-600 to-purple-600 text-white shadow-md shadow-rose-500/30',
      headline: 'Elevated Cardiovascular Risk Detected',
      tagline: 'Multiple pathophysiological markers correlate with significant coronary artery strain',
      statusBadge: 'bg-rose-100 text-rose-800 border-rose-300',
      accentBorder: 'border-l-4 border-l-rose-500',
      factorDot: 'bg-rose-500 ring-4 ring-rose-100'
    }
  }[result.risk_level];

  // Plain-English patient translations
  const patientExplanations = {
    Low: {
      headline: 'Your heart markers are in a reassuring, healthy range',
      summary:
        'Based on your inputs (such as your healthy resting blood pressure, normal heart rate response, clear coronary vessels, and absence of chest pain with exercise), the statistical chance of significant coronary artery disease is very low.',
      recommendations: [
        'Continue regular aerobic activity (walking, jogging, swimming) for 150+ minutes per week.',
        'Maintain a balanced diet rich in leafy greens, whole grains, and lean proteins.',
        'Keep up with routine annual wellness checkups with your doctor.'
      ]
    },
    Moderate: {
      headline: 'Some cardiovascular markers warrant proactive attention',
      summary:
        'Your profile shows a mixture of normal and borderline indicators (such as mild ST changes or slight vessel calcification). While not in an immediate critical zone, these signs suggest you could benefit from preventive lifestyle improvements and a check-in with your doctor.',
      recommendations: [
        'Review blood pressure and cholesterol numbers with your healthcare provider.',
        'Discuss whether a preventive diet (like the Mediterranean or DASH diet) would be helpful.',
        'Monitor any new or unusual shortness of breath or chest discomfort when exercising.'
      ]
    },
    High: {
      headline: 'Multiple markers indicate elevated cardiovascular strain',
      summary:
        'Several of your key indicators (such as elevated ST depression during exercise, multiple colored vessels, low peak exercise heart rate, or perfusion changes) suggest potential narrowing or strain in the coronary arteries.',
      recommendations: [
        'Schedule a formal clinical evaluation and ECG with a cardiologist promptly.',
        'Avoid strenuous unmonitored exercise until cleared by your medical team.',
        'Discuss medications (such as statins or blood pressure therapies) with your physician.'
      ]
    }
  }[result.risk_level];

  return (
    <>
      <AnimatePresence>
        <motion.section
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`relative overflow-hidden mt-10 rounded-3xl p-6 sm:p-8 border shadow-lg transition-all duration-300 ${theme.cardBg}`}
        >
          {/* Background animated radial glow aura */}
          <div
            className="absolute -top-12 -right-12 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700"
            style={{ backgroundColor: theme.auraColor }}
          />

          {/* Top Clinical Header & Actions */}
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
            <div className="flex items-center space-x-4">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${theme.iconBg}`}
              >
                {isRisk ? (
                  <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8" />
                ) : (
                  <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className={`text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs ${theme.badge}`}
                  >
                    {result.risk_level} Risk Category
                  </span>
                  <span className="text-xs text-slate-500 font-light flex items-center gap-1">
                    <HeartPulse className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    Tuned Logistic Regression Engine
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                  {theme.headline}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-light mt-0.5">
                  {theme.tagline}
                </p>
              </div>
            </div>

            {/* Micro-interaction Action buttons */}
            <div className="flex items-center space-x-2 self-end sm:self-auto print:hidden">
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Clinical Report & PDF</span>
              </button>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-medium shadow-2xs hover:shadow-xs active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Probability Gauge & Key Insight Cards */}
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 py-7 border-b border-slate-200/80 items-stretch">
            {/* Left Column: Visual Risk Gauge */}
            <div className="lg:col-span-5 bg-white/95 rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center backdrop-blur-sm relative overflow-hidden">
              <div className="w-full flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  Dynamic Risk Meter
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${theme.statusBadge}`}>
                  {result.status}
                </span>
              </div>
              <RiskGauge
                percentage={result.probability_percentage}
                riskLevel={result.risk_level}
                healthyPercentage={result.healthy_probability_percentage}
              />
            </div>

            {/* Right Column: Diagnostic Synthesis & Clinical Confidence */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-4">
              {/* Card 1: Medical Summary */}
              <div className={`bg-white/95 rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex-1 ${theme.accentBorder}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    Clinical Diagnostic Synthesis
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Cleveland Cohort Calibrated
                  </span>
                </div>

                <p className="text-sm font-normal text-slate-800 leading-relaxed mt-2">
                  {result.summary}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-5 pt-3.5 border-t border-slate-100 text-xs text-slate-600 font-light">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Healthy Perfusion: <strong className="font-semibold text-emerald-700">{result.healthy_probability_percentage}%</strong></span>
                  </div>
                  <span className="text-slate-300">&bull;</span>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-rose-600" />
                    <span>Ischemic Risk: <strong className="font-semibold text-rose-700">{result.probability_percentage}%</strong></span>
                  </div>
                </div>
              </div>

              {/* Card 2: Interactive Plain-English Translation Toggle */}
              <div className="bg-white/95 rounded-3xl p-5 border border-slate-200/80 shadow-xs backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      What Does This Mean for You? (Plain English)
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPlainEnglish(!showPlainEnglish)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    {showPlainEnglish ? 'Hide Details' : 'View Translation'}
                  </button>
                </div>

                {showPlainEnglish && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 text-xs text-slate-600 space-y-2.5 font-light leading-relaxed"
                  >
                    <p className="font-semibold text-slate-800 text-sm">
                      {patientExplanations.headline}
                    </p>
                    <p>{patientExplanations.summary}</p>
                    <div className="pt-2.5 border-t border-slate-100">
                      <span className="font-bold text-slate-700 block mb-1.5">
                        Recommended everyday actions:
                      </span>
                      <ul className="space-y-1 text-slate-600">
                        {patientExplanations.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Contributing Factors Section */}
          <div className="relative pt-6">
            <div className="flex items-center space-x-2 mb-4">
              {isRisk ? (
                <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              )}
              <h3 className="text-sm font-bold tracking-tight text-slate-900">
                {isRisk
                  ? 'Key Pathophysiological Indicators Driving the Risk Score'
                  : 'Favorable Hemodynamic & Diagnostic Indicators Observed'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.contributing_factors.map((factor, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                  className="flex items-start space-x-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs text-slate-700"
                >
                  <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${theme.factorDot}`} />
                  <span className="font-medium leading-relaxed">{factor}</span>
                </motion.div>
              ))}
            </div>

            {/* Standard Clinical Advisory & Disclaimer */}
            <div className="mt-6 p-4 rounded-2xl bg-white/90 border border-slate-200/80 flex items-start space-x-3 shadow-2xs">
              <Heart className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-500 font-light leading-relaxed">
                <strong className="font-semibold text-slate-700">Clinical Decision Support Advisory: </strong>
                This automated risk calculation is an algorithmic diagnostic adjunct based on multivariate Logistic Regression modeling with standard feature scaling. It is designed to assist clinical intuition and does not replace a complete medical examination, 12-lead electrocardiogram review, or direct cardiologist consultation.
              </div>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Clinical Report & Print Modal */}
      <ClinicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        result={result}
        formData={formData}
      />
    </>
  );
};
