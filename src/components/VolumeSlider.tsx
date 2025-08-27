import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface VolumeSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

const STEP_SIZE = 0.05; // 5% steps for keyboard navigation
const DEBOUNCE_DELAY = 16; // ~60fps for smooth updates

export function VolumeSlider({
  value,
  onChange,
  disabled = false,
  ariaLabel = "Volume",
}: VolumeSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Clamp value between 0 and 1
  const clampedValue = Math.max(0, Math.min(1, value));

  // Debounced onChange to improve performance
  const debouncedOnChange = useCallback(
    (newValue: number) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onChange(newValue);
      }, DEBOUNCE_DELAY);
    },
    [onChange]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const updateValueFromEvent = useCallback(
    (clientX: number) => {
      if (!sliderRef.current || disabled) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      debouncedOnChange(percentage);
    },
    [debouncedOnChange, disabled]
  );

  // Pointer Events
  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || e.button !== 0) return; // Only left mouse button

    e.preventDefault();
    setIsDragging(true);
    updateValueFromEvent(e.clientX);

    // Capture pointer for smooth dragging
    if (sliderRef.current) {
      sliderRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || disabled) return;
    updateValueFromEvent(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      if (sliderRef.current) {
        sliderRef.current.releasePointerCapture(e.pointerId);
      }
    }
  };

  // Click-to-set functionality
  const handleClick = (e: React.MouseEvent) => {
    if (disabled || isDragging) return;
    e.preventDefault();
    updateValueFromEvent(e.clientX);
  };

  // Touch Events for better mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      setIsDragging(true);
      updateValueFromEvent(touch.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || disabled) return;
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      updateValueFromEvent(touch.clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    let newValue = clampedValue;
    let handled = true;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        newValue = Math.min(1, clampedValue + STEP_SIZE);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        newValue = Math.max(0, clampedValue - STEP_SIZE);
        break;
      case "Home":
        newValue = 0;
        break;
      case "End":
        newValue = 1;
        break;
      case "PageUp":
        newValue = Math.min(1, clampedValue + STEP_SIZE * 4);
        break;
      case "PageDown":
        newValue = Math.max(0, clampedValue - STEP_SIZE * 4);
        break;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
      onChange(newValue);
    }
  };

  return (
    <div className="flex-1 px-2">
      <div
        ref={sliderRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clampedValue * 100)}
        aria-valuetext={`${Math.round(clampedValue * 100)}%`}
        aria-disabled={disabled}
        className={clsx(
          "relative rounded-full transition-all duration-200 outline-none",
          "focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-white/10"
        )}
        style={{
          minHeight: "44px", // Larger touch target for accessibility
          padding: "16px 0", // Better touch target padding
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {/* Track */}
        <div
          className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-2 rounded-full bg-white/20"
          aria-hidden="true"
        />

        {/* Fill */}
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 transition-all duration-150"
          style={{ width: `${clampedValue * 100}%` }}
          aria-hidden="true"
        />

        {/* Thumb */}
        <div
          className={clsx(
            "absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2",
            "w-5 h-5 rounded-full transition-all duration-200",
            "bg-white shadow-lg border-2 border-transparent",
            isDragging && "scale-125 shadow-xl",
            isFocused &&
              !disabled &&
              "ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900",
            disabled ? "opacity-50" : "hover:scale-110 hover:shadow-xl"
          )}
          style={{ left: `${clampedValue * 100}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
