import React from 'react';
import { X } from 'lucide-react';
import FloatingDatePicker from './FloatingDatePicker';
import UserFilterDropdown from './UserFilterDropdown';
import Button from './Button';

interface Props {
  open: boolean;
  onClose: () => void;
  query: string;
  setQuery: (q: string) => void;
  users: any[];
  userFilter: any[];
  setUserFilter: (u: any[]) => void;
  setAddOpen: (b: boolean) => void;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
}

const ToolbarPanel: React.FC<Props> = ({
  open,
  onClose,
  query,
  setQuery,
  users,
  userFilter,
  setUserFilter,
  setAddOpen,
  selectedDate,
  setSelectedDate,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white dark:bg-zinc-900 rounded-t-xl sm:rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Tools</div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block">
            <div className="text-xs text-zinc-500 mb-1">Search</div>
            <input
              aria-label="Search tasks"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks, owner or JIRA"
              className="w-full pl-3 pr-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm"
            />
          </label>

          <div className="flex flex-col gap-2">
            <div>
              <div className="text-xs text-zinc-500 mb-1">Users</div>
              <UserFilterDropdown users={users} selected={userFilter} setSelected={setUserFilter} />
            </div>
            <div>
              <div className="text-xs text-zinc-500 mb-1">Date</div>
              <FloatingDatePicker selectedDate={selectedDate} onDateSelect={setSelectedDate} onClear={() => setSelectedDate('')} />
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={() => { setAddOpen(true); onClose(); }} className="w-full bg-indigo-600 text-white">
              Add Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolbarPanel;
