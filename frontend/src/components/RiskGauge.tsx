'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RiskGaugeProps {
  percentage: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  healthyPercentage: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  percentage,
  riskLevel,
  healthyPercentage
}) => {
  // Clamp value between 0 and 100
  const clamped = Math.min(Math.max(percentage, 0), 100);

  // SVG Gauge geometry (semi-circle from 180deg to 0deg)
  const radius = 88;
  const strokeWidth = 14;
  const center = 110;
  // Circumference of semi-circle
  const arcLength = Math.PI * radius;
  // Stroke dashoffset for the semi-circle (clamped / 100 * arcLength)
  const strokeOffset = arcLength * (1 - clamped / 100);

  // Dynamic theme colors based on risk level
  const colors = {
    Low: {
      stroke: 'url(#emerald-gradient)',
      text: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      glow: 'rgba(16, 185, 129, 0.15)',
      needle: '#059669',
      label: 'Low Cardiovascular Risk'
    },
    Moderate: {
      stroke: 'url(#amber-gradient)',
      text: 'text-amber-600',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
      glow: 'rgba(245, 158, 11, 0.15)',
      needle: '#d97706',
      label: 'Moderate Cardiovascular Risk'
    },
    High: {
      stroke: 'url(#rose-gradient)',
      text: 'text-rose-600',
      badgeBg: 'bg-rose-50 border-rose-200 text-rose-800',
      glow: 'rgba(225, 29, 72, 0.18)',
      needle: '#e11d48',
      label: 'High Cardiovascular Risk'
    }
  }[riskLevel];

  // Needle Geometry via Trigonometry (180deg at 0% -> 270deg at 50% -> 360deg at 100%)
  const needleLength = radius - 14;
  const angleDeg = 180 + (clamped / 100) * 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const needleX2 = center + needleLength * Math.cos(angleRad);
  const needleY2 = center + needleLength * Math.sin(angleRad);

  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background radial glow */}
      <div
        className="absolute w-48 h-36 rounded-full blur-2xl pointer-events-none transition-all duration-700"
        style={{ backgroundColor: colors.glow }}
      />

      <div className="relative w-56 h-36 flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 220 140"
          className="w-full h-full overflow-hidden"
        >
          <defs>
            <linearGradient id="track-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="amber-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="rose-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="60%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#9f1239" />
            </linearGradient>

            <filter id="gauge-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke="url(#track-gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Calibrated Risk Segments Indicators (subtle tick marks) */}
          {/* 40% Mark */}
          <line
            x1="82"
            y1="34"
            x2="85"
            y2="42"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* 65% Mark */}
          <line
            x1="138"
            y1="34"
            x2="135"
            y2="42"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Active Animated Progress Arc */}
          <motion.path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: strokeOffset }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            filter="url(#gauge-shadow)"
          />

          {/* Trigonometric Needle - permanently anchored at center pin (110, 110) */}
          <line
            x1={center}
            y1={center}
            x2={needleX2}
            y2={needleY2}
            stroke={colors.needle}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Center Pivot circles (non-animated, always on top) */}
          <g>
            <circle cx={center} cy={center} r="7" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
            <circle cx={center} cy={center} r="3.5" fill={colors.needle} />
          </g>

          {/* Scale range labels */}
          <text x="14" y="128" fill="#94a3b8" fontSize="9" fontWeight="500" fontFamily="sans-serif">
            0% Low
          </text>
          <text x="110" y="14" fill="#94a3b8" fontSize="8" fontWeight="500" textAnchor="middle" fontFamily="sans-serif">
            50% Cutoff
          </text>
          <text x="206" y="128" fill="#94a3b8" fontSize="9" fontWeight="500" textAnchor="end" fontFamily="sans-serif">
            100% Critical
          </text>
        </svg>

      </div>

      {/* Central Exact Readout — placed below the SVG to avoid overlap */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col items-center mt-1"
      >
        <div className="flex items-baseline">
          <span className={`text-3xl sm:text-4xl font-extralight tracking-tight font-sans ${colors.text}`}>
            {clamped.toFixed(1)}
          </span>
          <span className={`text-lg font-light ml-0.5 ${colors.text}`}>%</span>
        </div>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
          Disease Probability
        </span>
      </motion.div>

      {/* Risk Badge and Confidence */}
      <div className="mt-3 flex flex-col items-center gap-1.5 text-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-2xs ${colors.badgeBg}`}
        >
          {riskLevel} Risk Profile
        </span>
        <span className="text-xs text-slate-500 font-light">
          Healthy Perfusion Confidence: <strong className="font-medium text-slate-700">{healthyPercentage}%</strong>
        </span>
      </div>
    </div>
  );
};

