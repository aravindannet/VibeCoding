import React, { useState } from 'react';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingDatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onClear: () => void;
}

const FloatingDatePicker: React.FC<FloatingDatePickerProps> = ({
  selectedDate,
  onDateSelect,
  onClear
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => selectedDate ? new Date(selectedDate) : new Date());

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

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 ${selectedDate ? 'ring-2 ring-cyan-500/50 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300' : ''}`}
        title={selectedDate ? 'Selected: ' + selectedDate : 'Filter by date'}
      >
        <Calendar className="h-4 w-4" />
        {selectedDate ? 'Date Filtered' : 'Filter by Date'}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-0 top-full z-50 mt-2 origin-top-left"
          >
            <div className="w-[280px] rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
              <div className="mb-4 flex items-center justify-between">
                <button onClick={prevMonth} className="rounded-full p-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </div>
                <button onClick={nextMonth} className="rounded-full p-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
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
                        ? 'bg-cyan-100 text-cyan-900 dark:bg-cyan-900/50 dark:text-cyan-100'
                        : 'text-zinc-700 dark:text-zinc-300'}
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {selectedDate && (
                <div className="mt-3 flex items-center justify-end gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-700">
                  <Button onClick={() => { onClear(); setIsOpen(false); }} className="!px-2 !py-1 text-xs">
                    <X className="h-3 w-3" /> Clear
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingDatePicker;
