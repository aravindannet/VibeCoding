import React from 'react';
import Button from './Button';

interface ActiveFiltersProps {
  selectedDate: string;
  query: string;
  userFilter: string[];
  onReset: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  selectedDate,
  query,
  userFilter,
  onReset,
}) => {
  if (!selectedDate && !query && userFilter.length === 0) return null;

  return (
    <div className="mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
      <div className="flex flex-wrap items-center gap-4">
        {selectedDate && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-indigo-700 dark:text-indigo-200">📅 Date:</span>
            <span className="text-sm text-zinc-700 dark:text-zinc-100">{selectedDate}</span>
          </div>
        )}
        {userFilter.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-indigo-700 dark:text-indigo-200">👥 Users:</span>
            <div className="flex flex-wrap items-center gap-2">
              {userFilter.map(user => (
                <span key={user} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-800/50">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white font-bold text-xs">
                    {user.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                  <span className="text-sm text-indigo-700 dark:text-indigo-200">{user}</span>
                </span>
              ))}
            </div>
          </div>
        )}
        {query && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-indigo-700 dark:text-indigo-200">🔍 Search:</span>
            <span className="text-sm text-zinc-700 dark:text-zinc-100">"{query}"</span>
          </div>
        )}
      </div>
      <Button 
        onClick={onReset}
        className="shrink-0 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
      >
        Reset All Filters
      </Button>
    </div>
  );
};

export default ActiveFilters;
