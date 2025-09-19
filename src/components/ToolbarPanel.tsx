import React from 'react';
import { X } from 'lucide-react';
import SimpleDatePicker from './SimpleDatePicker';
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
  defaultTab?: 'users' | 'date' | 'search' | null;
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
  defaultTab,
}) => {
  if (!open) return null;

  return (
  <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 z-0" onClick={(e: React.MouseEvent) => {
        // If a floating date button is registered globally and the click lies within its rect,
        // forward the click to that button so the picker opens even when overlays get in the way.
        // @ts-ignore
        const btn: HTMLButtonElement | undefined = window.__floatingDatePickerButton;
        if (btn && !e.defaultPrevented) {
          const rect = btn.getBoundingClientRect();
          const x = (e.nativeEvent as MouseEvent).clientX;
          const y = (e.nativeEvent as MouseEvent).clientY;
          if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            // forward the click and don't close the panel
            btn.click();
            return;
          }
        }
        // @ts-ignore
        if (window.__suppressToolbarBackdrop) {
          return;
        }
        onClose();
      }} />
  <div className="relative w-full sm:max-w-lg rounded-t-xl sm:rounded-xl p-4 sm:p-6 z-10">
        <div
          className="rounded-2xl border backdrop-blur-2xl p-2 sm:p-4 shadow-2xl dark:bg-[#18181b] dark:border-zinc-700/40 dark:backdrop-blur-md bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_60%,rgba(245,245,255,0.04)_100%)] text-zinc-900 dark:text-zinc-100"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            border: '1px solid rgba(255,255,255,0.25)',
            backdropFilter: 'blur(24px)'
          }}
        >
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Tools</div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
            <X className="h-5 w-5" />
          </button>
        </div>

  <div className="space-y-3">
          <label className="block">
            <div className="text-xs text-zinc-600 dark:text-zinc-300 mb-1">Search</div>
            <input
              aria-label="Search tasks"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks, owner or JIRA"
              className="w-full pl-3 pr-3 py-2 rounded-lg bg-white/90 dark:bg-zinc-900/80 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 border border-zinc-200/60"
            />
          </label>

          <div className="flex flex-col gap-3">
            {/* Show only the requested tab when opened from mobile; otherwise show both */}
            {(defaultTab === 'users' || !defaultTab) && (
              <div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300 mb-1">Users</div>
                <div className="space-y-2 p-2 rounded-md bg-white/70 dark:bg-zinc-900/50 border border-zinc-200/30 shadow-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={users.length > 0 && userFilter.length === users.length}
                      onChange={e => setUserFilter(e.target.checked ? [...users] : [])}
                      className="accent-indigo-500"
                    />
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Select All</span>
                  </label>
                  {users.map(u => (
                    <label key={u} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={userFilter.includes(u)}
                        onChange={e => setUserFilter(e.target.checked ? [...userFilter, u] : userFilter.filter(x => x !== u))}
                        className="accent-indigo-500"
                      />
                      <span className="text-sm text-zinc-900 dark:text-zinc-100">{u}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {(defaultTab === 'date' || !defaultTab) && (
              <div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300 mb-1">Date</div>
                <div className="p-2 rounded-md bg-white/70 dark:bg-zinc-900/50 border border-zinc-200/30 shadow-sm">
                  <SimpleDatePicker
                    selectedDate={selectedDate}
                    onDateSelect={(d) => setSelectedDate(d)}
                    onClear={() => setSelectedDate('')}
                    buttonClassName="w-full justify-between"
                  />
                  {selectedDate && (
                    <div className="mt-2 flex justify-end">
                      <button onClick={() => setSelectedDate('')} className="text-xs text-indigo-600 dark:text-indigo-300">Clear</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Add Task removed from Tools panel on mobile per request */}
        </div>
      </div>
    </div>
  </div>
  );
};

export default ToolbarPanel;
