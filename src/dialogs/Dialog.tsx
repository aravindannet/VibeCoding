import React from "react";
import { X } from "lucide-react";

const Dialog = ({ open, onClose, children, maxWidth }: any) => (
  <div className={`fixed inset-0 z-50 ${open ? "" : "hidden"}`}>
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div
      className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 rounded-3xl shadow-2xl dark:bg-zinc-900/40 dark:border-zinc-700/40 dark:backdrop-blur-md transition-all duration-300"
      style={{
        maxWidth: maxWidth || '40rem',
        maxHeight: '80vh',
        boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.18)',
        border: '1.5px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(120deg, rgba(255,255,255,0.13) 60%, rgba(245,245,255,0.06) 100%)',
        backdropFilter: 'blur(60px) saturate(2.2)',
        WebkitBackdropFilter: 'blur(60px) saturate(2.2)',
      }}
    >
      <div className="flex flex-col">
        <div className="flex justify-end items-start w-full" style={{ minHeight: 0 }}>
          <button
            onClick={onClose}
            className="m-2 p-1 rounded-full bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md hover:bg-white/80 dark:hover:bg-zinc-800/70 border border-white/40 dark:border-zinc-700/40 shadow transition"
            aria-label="Close dialog"
            type="button"
            style={{ lineHeight: 0, border: 'none', background: 'none', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}
          >
            <X className="h-5 w-5 text-zinc-700 dark:text-zinc-200" strokeWidth={2} />
          </button>
        </div>
  <div className="p-2 sm:p-4 pt-0 overflow-auto" style={{ maxHeight: 'calc(80vh - 40px)' }}>{children}</div>
      </div>
    </div>
  </div>
);

export default Dialog;
