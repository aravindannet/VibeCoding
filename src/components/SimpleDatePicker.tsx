import React, { useState, useMemo, useRef, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

interface Props {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onClear: () => void;
  buttonClassName?: string;
}

const SimpleDatePicker: React.FC<Props> = ({ selectedDate, onDateSelect, onClear, buttonClassName }) => {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => (selectedDate ? new Date(selectedDate) : new Date()));

  const daysInMonth = useMemo(() => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate(), [currentMonth]);
  const firstDayOfMonth = useMemo(() => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(), [currentMonth]);

  const weeks: (number | null)[][] = [];
  let days: (number | null)[] = [];
  let day = 1;
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  while (day <= daysInMonth) {
    days.push(day);
    if (days.length === 7) {
      weeks.push(days);
      days = [];
    }
    day++;
  }
  if (days.length > 0) {
    while (days.length < 7) days.push(null);
    weeks.push(days);
  }

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const handleDayClick = (d: number) => {
    const sel = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
    onDateSelect(formatDate(sel));
    setOpen(false);
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [popupPos, setPopupPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    function compute() {
      const btn = buttonRef.current;
      if (!btn) return setPopupPos(null);
      const rect = btn.getBoundingClientRect();
      const popupW = 280;
      const popupH = 360;
      const left = Math.min(Math.max(8, rect.left), Math.max(8, window.innerWidth - popupW - 8));
      const top = Math.min(Math.max(8, rect.bottom + 8), Math.max(8, window.innerHeight - popupH - 8));
      setPopupPos({ left, top });
    }
    if (open) compute();
    window.addEventListener('resize', compute);
    window.addEventListener('scroll', compute, true);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute, true);
    };
  }, [open, buttonRef.current, currentMonth]);

  const popup = (
    <div style={{ position: 'fixed', left: popupPos ? popupPos.left : Math.max(8, Math.floor(window.innerWidth / 2 - 140)), top: popupPos ? popupPos.top : Math.max(8, Math.floor(window.innerHeight / 2 - 180)), zIndex: 2147483647 }}>
      <div className="mt-2 w-[280px] rounded-2xl border p-4 shadow-2xl backdrop-blur-2xl dark:bg-[#18181b] dark:border-zinc-700/40 bg-white/80" style={{ boxShadow: '0 8px 32px rgba(31,38,135,0.18)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(18px)' }}>
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
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map((d, i) => (
            <button
              key={i}
              onClick={() => d && handleDayClick(d)}
              disabled={!d}
              className={`h-8 w-8 aspect-square rounded-lg p-1 text-sm ${!d ? 'invisible' : 'hover:bg-cyan-50 dark:hover:bg-cyan-900/30'} ${d && formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d)) === selectedDate ? 'bg-cyan-100 text-cyan-900 dark:bg-cyan-900/60 dark:text-cyan-100' : 'text-zinc-900 dark:text-zinc-100'}`}
            >
              {d}
            </button>
          ))}
        </div>

        {selectedDate && (
          <div className="mt-3 flex items-center justify-end gap-2 border-t border-zinc-200/60 pt-3 dark:border-zinc-700/40">
            <Button onClick={() => { onClear(); setOpen(false); }} className="!px-2 !py-1 text-xs text-zinc-900 dark:text-zinc-100">
              <X className="h-3 w-3" /> Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative inline-block">
      <Button
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); setOpen(v => !v); }}
        className={`inline-flex items-center gap-2 ${buttonClassName || ''}`}
        title={selectedDate ? `Selected: ${selectedDate}` : 'Filter by date'}
        aria-expanded={open}
        ref={buttonRef}
      >
        <Calendar className="h-4 w-4 text-zinc-700 dark:text-zinc-100" />
        <span className="hidden sm:inline">{selectedDate ? 'Date Filtered' : 'Filter by Date'}</span>
      </Button>

      {open && (typeof document !== 'undefined' ? ReactDOM.createPortal(popup, document.body) : popup)}
    </div>
  );
};

export default SimpleDatePicker;
