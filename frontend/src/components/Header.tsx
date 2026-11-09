'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Wifi, WifiOff, RefreshCw, BookOpen, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide }) => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastChecked, setLastChecked] = useState<string>('');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${API_URL}/api/health`, { method: 'GET', cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'healthy') {
            setBackendStatus('online');
            setLastChecked(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            return;
          }
        }
        setBackendStatus('offline');
      } catch {
        setBackendStatus('offline');
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 border-b border-slate-200/80 shadow-xs transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-sm ring-1 ring-blue-500/20">
            <HeartPulse className="w-5 h-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-400"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg sm:text-xl tracking-tight text-slate-900">
                Cardio<span className="text-blue-600 font-bold">Scan</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 bg-slate-100/80 text-slate-600 text-[11px] font-medium tracking-tight px-2 py-0.5 rounded-md border border-slate-200/70">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                Clinical CDS
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light tracking-tight hidden md:block">
              Cleveland Diagnostic Cohort &bull; ML Cardiovascular Decision Support
            </p>
          </div>
        </div>

        {/* Live Status & Utilities */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Live API status badge with micro-pulse animation */}
          <div
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 shadow-2xs ${
              backendStatus === 'online'
                ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-800'
                : backendStatus === 'checking'
                ? 'bg-amber-50/70 border-amber-200/80 text-amber-800'
                : 'bg-rose-50/70 border-rose-200/80 text-rose-800'
            }`}
          >
            {backendStatus === 'online' ? (
              <div className="flex items-center space-x-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-medium tracking-tight flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  <span className="hidden sm:inline">Engine Online</span>
                  <span className="sm:hidden">Active</span>
                </span>
                {lastChecked && (
                  <span className="hidden md:inline text-[10px] text-emerald-600/70 font-normal ml-0.5">
                    ({lastChecked})
                  </span>
                )}
              </div>
            ) : backendStatus === 'checking' ? (
              <div className="flex items-center space-x-1.5">
                <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                <span className="font-medium tracking-tight">Handshaking...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="font-medium tracking-tight flex items-center gap-1">
                  <WifiOff className="w-3 h-3 text-rose-600" />
                  <span className="hidden sm:inline">Backend Offline</span>
                  <span className="sm:hidden">Offline</span>
                </span>
              </div>
            )}
          </div>

          {/* Reference Modal Action Button */}
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-blue-700 bg-white hover:bg-slate-50/90 active:bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Biomarker Reference</span>
              <span className="sm:hidden">Guide</span>
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
};
