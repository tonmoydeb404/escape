import React, { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';

interface VolumeSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function VolumeSlider({ value, onChange, disabled = false }: VolumeSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    
    setIsDragging(true);
    updateValue(e);
    
    // Capture pointer for smooth dragging
    if (sliderRef.current) {
      sliderRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || disabled) return;
    updateValue(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e: React.PointerEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onChange(percentage);
  };

  return (
    <div className="flex-1 px-2">
      <div
        ref={sliderRef}
        className={clsx(
          'relative h-2 rounded-full cursor-pointer transition-all duration-200',
          'bg-white/20',
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ minHeight: '32px', padding: '12px 0' }}
      >
        {/* Track */}
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-2 rounded-full bg-white/20" />
        
        {/* Fill */}
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 transition-all duration-150"
          style={{ width: `${value * 100}%` }}
        />
        
        {/* Thumb */}
        <div
          className={clsx(
            'absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2',
            'w-5 h-5 rounded-full transition-all duration-200',
            'bg-white shadow-lg',
            isDragging ? 'scale-125' : 'scale-100',
            disabled ? 'opacity-50' : 'hover:scale-110'
          )}
          style={{ left: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}