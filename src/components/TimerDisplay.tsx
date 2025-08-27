import React from 'react';
import { Clock, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTimer } from '../hooks/useTimer';
import clsx from 'clsx';

export function TimerDisplay() {
  const { state } = useApp();
  const { formatTime, getProgress, stopTimer } = useTimer();

  if (!state.timer.isVisible) return null;

  const progress = getProgress();
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        {/* Progress Ring */}
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-white text-xs font-semibold">
            {formatTime(state.timer.remaining)}
          </div>
          <Clock size={12} className="text-blue-400 mt-1" />
        </div>

        {/* Stop button */}
        <button
          onClick={stopTimer}
          className={clsx(
            'absolute -top-2 -right-2 p-1 rounded-full',
            'bg-red-500/80 hover:bg-red-500 transition-colors duration-200',
            'backdrop-blur-sm border border-white/20'
          )}
          style={{ minWidth: '24px', minHeight: '24px' }}
        >
          <X size={12} className="text-white" />
        </button>
      </div>
    </div>
  );
}