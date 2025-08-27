import React, { useState } from 'react';
import { Clock, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTimer } from '../hooks/useTimer';
import clsx from 'clsx';

const PRESET_MINUTES = [15, 30, 45, 60, 90];

export function TimerBottomSheet() {
  const { state, dispatch } = useApp();
  const { startTimer } = useTimer();
  const [customMinutes, setCustomMinutes] = useState<string>('');

  if (!state.isTimerBottomSheetOpen) return null;

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_TIMER_BOTTOM_SHEET' });
  };

  const handlePresetClick = (minutes: number) => {
    startTimer(minutes);
  };

  const handleCustomTimer = () => {
    const minutes = parseInt(customMinutes);
    if (minutes > 0 && minutes <= 999) {
      startTimer(minutes);
      setCustomMinutes('');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="bg-gradient-to-t from-gray-900 to-gray-800 rounded-t-3xl p-6 border-t border-white/10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Clock size={24} className="text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Set Timer</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
            >
              <X size={20} className="text-gray-300" />
            </button>
          </div>

          {/* Preset buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {PRESET_MINUTES.map((minutes) => (
              <button
                key={minutes}
                onClick={() => handlePresetClick(minutes)}
                className={clsx(
                  'p-4 rounded-xl font-semibold transition-all duration-200 transform',
                  'bg-gradient-to-br from-blue-500/20 to-teal-500/20',
                  'border border-white/10 backdrop-blur-sm',
                  'hover:from-blue-500/30 hover:to-teal-500/30',
                  'active:scale-95 hover:scale-105',
                  'text-white'
                )}
                style={{ minHeight: '56px' }}
              >
                {minutes}m
              </button>
            ))}
          </div>

          {/* Custom timer input */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Custom Timer</h3>
            <div className="flex space-x-3">
              <input
                type="number"
                placeholder="Enter minutes..."
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className={clsx(
                  'flex-1 p-4 rounded-xl bg-white/10 border border-white/20',
                  'text-white placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                  'backdrop-blur-sm'
                )}
                style={{ minHeight: '56px' }}
                min="1"
                max="999"
              />
              <button
                onClick={handleCustomTimer}
                disabled={!customMinutes || parseInt(customMinutes) <= 0}
                className={clsx(
                  'px-6 py-4 rounded-xl font-semibold transition-all duration-200',
                  'bg-gradient-to-r from-blue-500 to-teal-500',
                  'hover:from-blue-600 hover:to-teal-600',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'text-white'
                )}
                style={{ minHeight: '56px' }}
              >
                Start
              </button>
            </div>
          </div>

          {/* Safe area spacer */}
          <div className="h-8" />
        </div>
      </div>
    </>
  );
}