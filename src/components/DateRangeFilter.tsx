import React from 'react';
import Button from './Button';
import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear
}) => {
  return (
    <div className="relative flex items-center gap-2">
      <div className="flex items-center gap-1 rounded-2xl border border-zinc-300 bg-white px-2 dark:border-zinc-700 dark:bg-zinc-900">
        <Calendar className="h-4 w-4 text-zinc-400" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="bg-transparent px-1 py-2 text-sm text-zinc-700 outline-none dark:text-zinc-300"
        />
        <span className="text-zinc-400">→</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="bg-transparent px-1 py-2 text-sm text-zinc-700 outline-none dark:text-zinc-300"
        />
      </div>
      {(startDate || endDate) && (
        <Button
          onClick={onClear}
          className="!px-2 !py-2"
          title="Clear date filter"
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default DateRangeFilter;
