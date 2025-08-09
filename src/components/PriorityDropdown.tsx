import React from "react";

const priorities = ["Low", "Medium", "High"];

export default function PriorityDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        listRef.current &&
        !listRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        className="w-full rounded-xl border backdrop-blur-2xl shadow-2xl border-zinc-300 bg-white dark:bg-zinc-900/40 dark:border-zinc-700/40 dark:backdrop-blur-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-zinc-100 flex justify-between items-center"
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          border: "1px solid rgba(255,255,255,0.25)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.12) 60%, rgba(245,245,255,0.04) 100%)",
          backdropFilter: "blur(24px)",
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{value}</span>
        <span className="ml-2">▼</span>
      </button>
      {open && (
        <div
          ref={listRef}
          className="absolute left-0 mt-2 z-30 rounded-xl border backdrop-blur-2xl shadow-2xl border-zinc-200 bg-white dark:bg-zinc-900/90 dark:border-zinc-700/40 dark:backdrop-blur-md min-w-full py-1"
          style={{
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
            border: "1px solid rgba(255,255,255,0.25)",
            background: "linear-gradient(135deg, rgba(24,24,27,0.98) 80%, rgba(39,39,42,0.98) 100%)",
            backdropFilter: "blur(24px)",
          }}
        >
          {priorities.map((p) => (
            <button
              key={p}
              type="button"
              className={`w-full text-left px-4 py-2 text-sm rounded-xl transition-colors ${
                value === p
                  ? "bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-bold"
                  : "text-zinc-700 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              onClick={() => {
                onChange(p);
                setOpen(false);
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
