import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingDatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onClear: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  buttonClassName?: string;
}

const FloatingDatePicker: React.FC<FloatingDatePickerProps> = ({
  selectedDate,
  onDateSelect,
  onClear,
  open,
  onOpenChange
  , buttonClassName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [popupPos, setPopupPos] = useState<{ left: number; top: number } | null>(null);
  React.useEffect(() => {
    if (typeof open === 'boolean') setIsOpen(open);
  }, [open]);
  const [currentMonth, setCurrentMonth] = useState(() => selectedDate ? new Date(selectedDate) : new Date());

  // temporary debug: capture uncaught errors while reproducing the issue
  useEffect(() => {
    const onErr = (e: ErrorEvent) => {
      // noop: previously used for temporary error capture during debugging
    };
    window.addEventListener('error', onErr);
    return () => window.removeEventListener('error', onErr);
  }, []);

  // Register button element globally for legacy click-forward shim (ToolbarPanel)
  useEffect(() => {
    // @ts-ignore
    window.__floatingDatePickerButton = buttonRef.current;
    return () => {
      // @ts-ignore
      if (window.__floatingDatePickerButton === buttonRef.current) window.__floatingDatePickerButton = undefined;
    };
  }, [buttonRef.current]);

  // debug: log when isOpen changes
  useEffect(() => {
    // isOpen changed (debug logs removed)
  }, [isOpen]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const weeks = [];
  let days = [];
  let day = 1;

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // Fill in the days of the month
  while (day <= daysInMonth) {
    days.push(day);
    if (days.length === 7) {
      weeks.push(days);
      days = [];
    }
    day++;
  }

  // Add any remaining days
  if (days.length > 0) {
    while (days.length < 7) {
      days.push(null);
    }
    weeks.push(days);
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDayClick = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(formatDate(selected));
    setIsOpen(false);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  // compute popup position when opening or on scroll/resize
  useLayoutEffect(() => {
    function compute() {
      const btn = buttonRef.current;
      if (!btn) return setPopupPos(null);
      const rect = btn.getBoundingClientRect();
    // recorded rect for layout computation (debug logs removed)
      // Use viewport coordinates and clamp so the popup stays visible on small screens
      const popupW = 280;
      const popupH = 360; // approximate height
      const leftViewport = Math.max(8, rect.left);
      const topViewport = rect.bottom + 8;
      const clampedLeft = Math.min(leftViewport, Math.max(8, window.innerWidth - popupW - 8));
      const clampedTop = Math.min(topViewport, Math.max(8, window.innerHeight - popupH - 8));
      // computed popupPos (debug logs removed)
      setPopupPos({ left: clampedLeft, top: clampedTop });
    }
    if (isOpen) compute();
    window.addEventListener('resize', compute);
    window.addEventListener('scroll', compute, true);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute, true);
    };
  }, [isOpen, buttonRef, currentMonth]);

  // debug: log when we are about to render the portal/popup
  useEffect(() => {
    // rendering portal (debug logs removed)
  }, [isOpen, popupPos]);

  return (
    <div className="relative">
      <Button
        onClick={(e: React.MouseEvent) => {
          // prevent the click from bubbling to any backdrop/overlay handlers
          e.stopPropagation();
          // suppress toolbar backdrop for this event loop tick so backdrop doesn't close the panel immediately
          // @ts-ignore
          window.__suppressToolbarBackdrop = true;
          setTimeout(() => {
            // @ts-ignore
            window.__suppressToolbarBackdrop = false;
          }, 0);
          const next = !isOpen;
          setIsOpen(next);
          onOpenChange && onOpenChange(next);
        }}
  className={`inline-flex items-center gap-2 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_40%,rgba(255,255,255,0.02)_100%)] dark:bg-[#18181b] border border-zinc-200/40 dark:border-zinc-700/40 text-zinc-900 dark:text-zinc-100 ${selectedDate ? 'ring-2 ring-cyan-500/50' : ''} ${buttonClassName || ''}`}
        title={selectedDate ? 'Selected: ' + selectedDate : 'Filter by date'}
        ref={buttonRef}
        aria-expanded={isOpen}
      >
        <Calendar className="h-4 w-4 text-zinc-700 dark:text-zinc-100" />
        <span className="hidden sm:inline">{selectedDate ? 'Date Filtered' : 'Filter by Date'}</span>
      </Button>

      <AnimatePresence>
      {isOpen && ReactDOM.createPortal(
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              left: (() => {
                if (popupPos) return popupPos.left;
                try {
                  if (buttonRef.current) return buttonRef.current.getBoundingClientRect().left;
                } catch (e) {}
                // fallback: center horizontally
                return Math.max(8, Math.floor(window.innerWidth / 2 - 140));
              })(),
              top: (() => {
                if (popupPos) return popupPos.top;
                try {
                  if (buttonRef.current) return buttonRef.current.getBoundingClientRect().bottom + 8;
                } catch (e) {}
                // fallback: center vertically
                return Math.max(8, Math.floor(window.innerHeight / 2 - 180));
              })(),
              zIndex: 2147483646
            }}
            className="origin-top-left"
          >
            <div
              className="w-[280px] rounded-2xl border p-4 shadow-2xl backdrop-blur-2xl dark:bg-[#18181b] dark:border-zinc-700/40 dark:backdrop-blur-md bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_60%,rgba(245,245,255,0.04)_100%)]"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(24px)'
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <button onClick={prevMonth} className="rounded-full p-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </div>
                <button onClick={nextMonth} className="rounded-full p-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {weeks.flat().map((day, i) => (
                  <button
                    key={i}
                    onClick={() => day && handleDayClick(day)}
                    disabled={!day}
                    className={`
                      h-8 w-8
                      aspect-square rounded-lg p-1 text-sm
                      ${!day ? 'invisible' : 'hover:bg-cyan-50 dark:hover:bg-cyan-900/30'}
                      ${formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day || 1)) === selectedDate
                        ? 'bg-cyan-100 text-cyan-900 dark:bg-cyan-900/60 dark:text-cyan-100'
                        : 'text-zinc-900 dark:text-zinc-100'}
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {selectedDate && (
                <div className="mt-3 flex items-center justify-end gap-2 border-t border-zinc-200/60 pt-3 dark:border-zinc-700/40">
                  <Button onClick={() => { onClear(); setIsOpen(false); }} className="!px-2 !py-1 text-xs text-zinc-900 dark:text-zinc-100">
                    <X className="h-3 w-3" /> Clear
                  </Button>
                </div>
              )}
            </div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingDatePicker;
