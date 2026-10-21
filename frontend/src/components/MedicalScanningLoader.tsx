'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Shield, Sparkles, Cpu, CheckCircle } from 'lucide-react';

interface MedicalScanningLoaderProps {
  isLoading: boolean;
}

const STEPS = [
  'Acquiring 13 patient hemodynamic & diagnostic biomarkers...',
  'Standardizing features via Cleveland Clinic StandardScaler...',
  'Evaluating Logistic Regression class probability vectors...',
  'Synthesizing clinical risk pathways & patient summary...'
];

export const MedicalScanningLoader: React.FC<MedicalScanningLoaderProps> = ({ isLoading }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/40 p-5 sm:p-6 text-white shadow-xl shadow-blue-900/20 mb-6"
    >
      {/* Animated laser scan beam */}
      <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-md -skew-x-12 animate-[scanline_1.8s_ease-in-out_infinite] pointer-events-none" />

      {/* Background ambient lighting */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Pulsing Hologram Heart & Scanner Graphic */}
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 shrink-0">
            {/* Concentric expanding ripples */}
            <span className="absolute inline-flex h-full w-full rounded-2xl bg-blue-500 opacity-25 animate-ping" />
            <span className="absolute inline-flex h-12 w-12 rounded-xl bg-rose-500 opacity-30 animate-pulse" />

            <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-600 p-0.5 shadow-md flex items-center justify-center animate-heartbeat">
              <div className="w-full h-full rounded-[14px] bg-slate-950/90 flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-400 fill-rose-500/40" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
                Live Clinical Inference
              </span>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                Tuned Logistic Regression
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-semibold tracking-tight text-white mt-1">
              Executing Cardiovascular Risk Engine...
            </h4>

            {/* Sequencing step label with animated swap */}
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-blue-200/90 font-light min-h-[20px]">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentStepIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-cyan-100"
                >
                  {STEPS[currentStepIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Progress Dots Indicator */}
        <div className="flex items-center space-x-1.5 self-center sm:self-auto shrink-0 bg-slate-950/50 px-3.5 py-2 rounded-xl border border-slate-800/80">
          {STEPS.map((_, idx) => (
            <span
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx <= currentStepIndex
                  ? 'w-5 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                  : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

