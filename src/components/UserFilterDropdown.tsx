import React from "react";

interface UserFilterDropdownProps {
  users: string[];
  selected: string[];
  setSelected: (users: string[]) => void;
}

const UserFilterDropdown: React.FC<UserFilterDropdownProps> = ({ users, selected, setSelected }) => {
  const [show, setShow] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!show) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShow(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [show]);
  const allSelected = users.length > 0 && selected.length === users.length;
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100 flex items-center gap-2"
        onClick={() => setShow(v => !v)}
        style={{ minWidth: 120 }}
      >
        <span>{selected.length === 0 ? "Filter by user" : `${selected.length} selected`}</span>
        <span className="ml-2">▼</span>
      </button>
      {show && (
        <div
          className="absolute left-0 mt-2 z-20 rounded-xl border backdrop-blur-2xl shadow-2xl border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-700/40 dark:backdrop-blur-md p-2 min-w-[180px] max-h-64 overflow-auto"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'linear-gradient(135deg, rgba(24,24,27,0.98) 80%, rgba(39,39,42,0.98) 100%)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <label className="flex items-center gap-2 py-1 cursor-pointer border-b border-zinc-100 dark:border-zinc-700 mb-2 pb-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={e => {
                setSelected(e.target.checked ? [...users] : []);
              }}
              className="accent-indigo-500"
            />
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-100">Select All</span>
          </label>
          {users.map(user => (
            <label key={user} className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(user)}
                onChange={e => {
                  setSelected(
                    e.target.checked
                      ? [...selected, user]
                      : selected.filter(u => u !== user)
                  );
                }}
                className="accent-indigo-500"
              />
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-500 text-white font-bold text-xs shadow">
                {user.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
              <span className="text-sm text-zinc-700 dark:text-zinc-100">{user}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFilterDropdown;
