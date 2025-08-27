import clsx from "clsx";
import { Clock, Timer, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useApp } from "../context/AppContext";
import { useTimer } from "../hooks/useTimer";

const PRESET_MINUTES = [15, 30, 45, 60, 90];
const MAX_TIMER_MINUTES = 999;
const MIN_TIMER_MINUTES = 1;

interface ValidationError {
  message: string;
  type: "error" | "warning";
}

export const TimerBottomSheet = React.memo(function TimerBottomSheet() {
  const { state, dispatch } = useApp();
  const { startTimer, stopTimer, formatTime, getProgress } = useTimer();

  // State management
  const [customMinutes, setCustomMinutes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  // Memoized handlers
  const handleClose = useCallback(() => {
    dispatch({ type: "TOGGLE_TIMER_BOTTOM_SHEET" });
    setCustomMinutes("");
    setValidationError(null);
  }, [dispatch]);

  const handleToggleModal = useCallback(() => {
    dispatch({ type: "TOGGLE_TIMER_BOTTOM_SHEET" });
  }, [dispatch]);

  const validateCustomInput = useCallback(
    (value: string): ValidationError | null => {
      if (!value.trim()) return null;

      const num = parseFloat(value);
      if (isNaN(num)) {
        return { message: "Please enter a valid number", type: "error" };
      }
      if (num < MIN_TIMER_MINUTES) {
        return {
          message: `Minimum timer is ${MIN_TIMER_MINUTES} minute`,
          type: "error",
        };
      }
      if (num > MAX_TIMER_MINUTES) {
        return {
          message: `Maximum timer is ${MAX_TIMER_MINUTES} minutes`,
          type: "error",
        };
      }
      if (num % 1 !== 0) {
        return { message: "Please enter whole minutes only", type: "warning" };
      }
      return null;
    },
    []
  );

  const handlePresetClick = useCallback(
    async (minutes: number) => {
      setIsLoading(true);
      try {
        await startTimer(minutes);
        handleClose();
      } catch (error) {
        console.error("Failed to start timer:", error);
        setValidationError({
          message: "Failed to start timer. Please try again.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [startTimer, handleClose]
  );

  const handleCustomTimer = useCallback(async () => {
    const error = validateCustomInput(customMinutes);
    if (error && error.type === "error") {
      setValidationError(error);
      return;
    }

    const minutes = Math.floor(parseFloat(customMinutes));
    setIsLoading(true);

    try {
      await startTimer(minutes);
      handleClose();
    } catch (error) {
      console.error("Failed to start custom timer:", error);
      setValidationError({
        message: "Failed to start timer. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [customMinutes, validateCustomInput, startTimer, handleClose]);

  const handleCustomInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCustomMinutes(value);

      const error = validateCustomInput(value);
      setValidationError(error);
    },
    [validateCustomInput]
  );

  // Touch handlers for swipe-to-close
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart) return;

      const touchEnd = e.changedTouches[0].clientY;
      const distance = touchStart - touchEnd;

      // If swiped down more than 100px, close the modal
      if (distance < -100) {
        handleClose();
      }
      setTouchStart(null);
    },
    [touchStart, handleClose]
  );

  // Keyboard handling
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    },
    [handleClose]
  );

  // Focus management
  useEffect(() => {
    if (state.isTimerBottomSheetOpen) {
      // Focus the first focusable element when modal opens
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);

      // Prevent background scrolling
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [state.isTimerBottomSheetOpen]);

  // Focus trap
  useEffect(() => {
    if (!state.isTimerBottomSheetOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, input, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [state.isTimerBottomSheetOpen]);

  // Render modal content
  const modalContent = state.isTimerBottomSheetOpen ? (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="timer-modal-title"
          aria-describedby="timer-modal-description"
          className="bg-gradient-to-t from-gray-900 to-gray-800 rounded-t-3xl p-6 border-t border-white/10 shadow-2xl"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Drag indicator for mobile */}
          <div className="flex justify-center mb-4">
            <div
              className="w-12 h-1.5 bg-gray-500 rounded-full"
              aria-hidden="true"
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {state.timer.isActive ? (
                <>
                  <div className="relative">
                    <Clock size={24} className="text-green-400" aria-hidden="true" />
                    <div className="absolute -inset-1 bg-green-400/20 rounded-full animate-pulse" />
                  </div>
                  <h2
                    id="timer-modal-title"
                    className="text-xl font-semibold text-white"
                  >
                    Timer Running
                  </h2>
                </>
              ) : (
                <>
                  <Clock size={24} className="text-blue-400" aria-hidden="true" />
                  <h2
                    id="timer-modal-title"
                    className="text-xl font-semibold text-white"
                  >
                    Set Timer
                  </h2>
                </>
              )}
            </div>
            <button
              ref={firstFocusableRef}
              onClick={handleClose}
              aria-label={state.timer.isActive ? "Close timer view" : "Close timer settings"}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <X size={20} className="text-gray-300" aria-hidden="true" />
            </button>
          </div>

          {state.timer.isActive ? (
            /* Timer Running View */
            <>
              <div id="timer-modal-description" className="sr-only">
                Timer is currently running. View remaining time and controls.
              </div>

              {/* Simple Timer Display */}
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-white mb-4">
                  {formatTime(state.timer.remaining)}
                </div>
                <div className="text-gray-400 text-sm">
                  {Math.round(getProgress())}% complete
                </div>
              </div>

              {/* Stop Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    stopTimer();
                    handleClose();
                  }}
                  className="px-8 py-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:text-red-300 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400/50 active:scale-95"
                >
                  Stop Timer
                </button>
              </div>
            </>
          ) : (
            /* Set Timer View */
            <>
              <div id="timer-modal-description" className="sr-only">
                Choose a preset timer duration or enter a custom time in minutes
              </div>

              {/* Error/Warning Display */}
              {validationError && (
                <div
                  role="alert"
                  className={clsx(
                    "mb-4 p-3 rounded-lg text-sm font-medium",
                    validationError.type === "error"
                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                  )}
                >
                  {validationError.message}
                </div>
              )}

              {/* Preset buttons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {PRESET_MINUTES.map((minutes, index) => (
                  <button
                    key={minutes}
                    onClick={() => handlePresetClick(minutes)}
                    disabled={isLoading}
                    aria-label={`Set timer for ${minutes} minutes`}
                    className={clsx(
                      "p-4 rounded-xl font-semibold transition-all duration-200 transform",
                      "bg-gradient-to-br from-blue-500/20 to-teal-500/20",
                      "border border-white/10 backdrop-blur-sm",
                      "hover:from-blue-500/30 hover:to-teal-500/30",
                      "active:scale-95 hover:scale-105",
                      "focus:outline-none focus:ring-2 focus:ring-blue-400",
                      "text-white",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                    style={{ minHeight: "56px" }}
                    tabIndex={index === 0 ? 0 : -1}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mx-auto" />
                    ) : (
                      `${minutes}m`
                    )}
                  </button>
                ))}
              </div>

              {/* Custom timer input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-300">Custom Timer</h3>
                  {customMinutes && !validationError && (
                    <span className="text-xs text-blue-400 font-medium">
                      {customMinutes} minute{parseInt(customMinutes) !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                <div className="relative">
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <input
                        ref={customInputRef}
                        type="number"
                        placeholder="Minutes..."
                        value={customMinutes}
                        onChange={handleCustomInputChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isLoading && customMinutes && validationError?.type !== 'error') {
                            handleCustomTimer();
                          }
                        }}
                        disabled={isLoading}
                        aria-label="Custom timer duration in minutes"
                        aria-describedby="custom-timer-help"
                        aria-invalid={
                          validationError?.type === "error" ? "true" : "false"
                        }
                        className={clsx(
                          "w-full p-3 pr-8 rounded-xl border transition-all duration-200",
                          "text-white placeholder-gray-400 text-center font-medium",
                          "focus:outline-none focus:ring-2 backdrop-blur-sm",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          // Dynamic background based on state
                          isLoading 
                            ? "bg-gray-600/20 border-gray-500/30"
                            : validationError?.type === "error"
                            ? "bg-red-500/10 border-red-500/50 focus:border-red-500 focus:ring-red-400/50"
                            : validationError?.type === "warning"
                            ? "bg-yellow-500/10 border-yellow-500/50 focus:border-yellow-500 focus:ring-yellow-400/50"
                            : customMinutes
                            ? "bg-blue-500/10 border-blue-400/50 focus:border-blue-400 focus:ring-blue-400/50"
                            : "bg-white/10 border-white/20 focus:border-blue-400 focus:ring-blue-400/50"
                        )}
                        style={{ minHeight: "48px" }}
                        min={MIN_TIMER_MINUTES}
                        max={MAX_TIMER_MINUTES}
                        step="1"
                      />
                      
                      {/* Clear button */}
                      {customMinutes && !isLoading && (
                        <button
                          onClick={() => {
                            setCustomMinutes("");
                            setValidationError(null);
                            customInputRef.current?.focus();
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0.5 rounded-full bg-gray-600/50 hover:bg-gray-600 transition-colors duration-200"
                          aria-label="Clear input"
                        >
                          <X size={12} className="text-gray-300" />
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={handleCustomTimer}
                      disabled={
                        isLoading ||
                        !customMinutes ||
                        validationError?.type === "error"
                      }
                      aria-label="Start custom timer"
                      className={clsx(
                        "px-4 py-3 rounded-xl font-semibold transition-all duration-200 transform",
                        "active:scale-95 hover:scale-105",
                        "focus:outline-none focus:ring-2 focus:ring-blue-400/50",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                        // Dynamic styling based on state
                        isLoading
                          ? "bg-gray-600 cursor-wait"
                          : !customMinutes || validationError?.type === "error"
                          ? "bg-gray-600 text-gray-400"
                          : validationError?.type === "warning"
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                          : "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
                      )}
                      style={{ minHeight: "48px", minWidth: "80px" }}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-1">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                        </div>
                      ) : (
                        "Start"
                      )}
                    </button>
                  </div>
                  
                  {/* Help text and validation */}
                  <div className="mt-2 min-h-[20px]">
                    {validationError ? (
                      <div
                        id="custom-timer-help"
                        className={clsx(
                          "text-xs font-medium flex items-center space-x-1",
                          validationError.type === "error" ? "text-red-400" : "text-yellow-400"
                        )}
                      >
                        <span>⚠</span>
                        <span>{validationError.message}</span>
                      </div>
                    ) : (
                      <div
                        id="custom-timer-help"
                        className="text-xs text-gray-500"
                      >
                        Enter {MIN_TIMER_MINUTES}-{MAX_TIMER_MINUTES} minutes • Press Enter to start
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Safe area spacer */}
          <div className="h-8" />
        </div>
      </div>
    </>
  ) : null;

  return (
    <>
      {/* Timer Button */}
      <button
        onClick={handleToggleModal}
        aria-label={state.timer.isActive ? "Timer running - click to view" : "Open timer settings"}
        className={clsx(
          "p-3 rounded-2xl transition-all duration-200 transform relative",
          "active:scale-90 hover:scale-105",
          "backdrop-blur-sm border",
          "focus:outline-none focus:ring-2",
          // Dynamic styling based on timer state
          state.timer.isActive
            ? [
                "bg-gradient-to-br from-green-500/30 to-emerald-500/30",
                "hover:from-green-500/40 hover:to-emerald-500/40",
                "border-green-400/30 focus:ring-green-400",
                "shadow-lg shadow-green-500/20"
              ]
            : [
                "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
                "hover:from-purple-500/30 hover:to-pink-500/30",
                "border-white/10 focus:ring-purple-400"
              ]
        )}
        style={{ minWidth: "48px", minHeight: "48px" }}
      >
        {state.timer.isActive ? (
          <>
            {/* Pulsing animation ring for active timer */}
            <div className="absolute inset-0 rounded-2xl bg-green-400/20 animate-pulse" />
            <Timer size={24} className="text-green-400 relative z-10" />
            {/* Small dot indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse" />
          </>
        ) : (
          <Timer size={24} className="text-purple-400" />
        )}
      </button>

      {/* Portal for Modal */}
      {typeof document !== "undefined" &&
        createPortal(modalContent, document.body)}
    </>
  );
});
