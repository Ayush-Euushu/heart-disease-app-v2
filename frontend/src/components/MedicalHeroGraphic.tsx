'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Activity,
  ShieldCheck,
  Sparkles,
  Zap,
  Droplets,
  Stethoscope
} from 'lucide-react';

export const MedicalHeroGraphic: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg lg:max-w-none mx-auto">
      {/* Background radial glow auras */}
      <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Cardiac Telemetry Display Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-700/60 p-6 shadow-2xl backdrop-blur-xl overflow-hidden text-white"
      >
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Top Telemetry Header */}
        <div className="relative flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
              CardioScan Telemetry HUD
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium font-mono">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Active Rhythm</span>
          </div>
        </div>

        {/* Centerpiece: Animated Cardiac Vector & Waveform */}
        <div className="relative py-6 flex flex-col items-center justify-center">
          {/* Animated concentric pulse rings */}
          <div className="absolute w-44 h-44 rounded-full border border-rose-500/20 animate-ping opacity-25 pointer-events-none" />
          <div className="absolute w-36 h-36 rounded-full border border-rose-500/30 animate-pulse opacity-40 pointer-events-none" />

          {/* Central Glowing Anatomical Heart Vector */}
          <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-rose-500/25 flex items-center justify-center animate-heartbeat">
            <div className="w-full h-full rounded-[22px] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden">
              {/* Internal glowing gradient */}
              <div className="absolute inset-0 bg-radial from-rose-500/30 to-transparent" />
              <Heart className="w-12 h-12 text-rose-500 fill-rose-500/30 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]" />
              <span className="text-[10px] font-mono tracking-widest text-rose-200 mt-1 font-semibold">
                CDS &bull; ML
              </span>
            </div>
          </div>

          {/* Sweeping ECG Waveform Oscilloscope Visual */}
          <div className="w-full mt-5 relative h-16 bg-slate-950/70 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center px-4">
            {/* Grid background lines */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, #0ea5e9 1px, transparent 1px), linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)`,
                backgroundSize: '16px 16px'
              }}
            />

            {/* Glowing Laser Scanline */}
            <div className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent blur-[1px] animate-scanline pointer-events-none" />

            {/* SVG ECG Path with continuous sweep */}
            <svg
              className="w-full h-12 overflow-visible"
              viewBox="0 0 500 50"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="ecg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="70%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <filter id="ecg-glow">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#38bdf8" />
                </filter>
              </defs>

              <path
                d="M 0 25 L 60 25 L 75 25 L 85 10 L 95 40 L 105 5 L 115 35 L 125 25 L 180 25 L 230 25 L 240 12 L 250 42 L 260 2 L 270 38 L 280 25 L 340 25 L 390 25 L 400 10 L 410 40 L 420 5 L 430 35 L 440 25 L 500 25"
                fill="none"
                stroke="url(#ecg-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#ecg-glow)"
                className="animate-ecg-sweep"
              />
            </svg>
          </div>
        </div>

        {/* Floating Telemetry Micro-Badges */}
        <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col">
            <span className="text-[10px] text-slate-400 font-light flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Inference
            </span>
            <span className="text-xs font-semibold text-slate-100 font-mono mt-0.5">
              &lt; 25 ms
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col">
            <span className="text-[10px] text-slate-400 font-light flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Confidence
            </span>
            <span className="text-xs font-semibold text-slate-100 font-mono mt-0.5">
              Calibrated
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col">
            <span className="text-[10px] text-slate-400 font-light flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Features
            </span>
            <span className="text-xs font-semibold text-slate-100 font-mono mt-0.5">
              13 Factors
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

