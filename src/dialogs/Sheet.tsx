import React from "react";
import Button from "../components/Button";

const Sheet = ({ open, onClose, title, children }: any) => (
  <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
    <div
      className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    />
    <div
      className={`absolute right-0 top-0 h-full w-full sm:max-w-md rounded-2xl border backdrop-blur-2xl shadow-2xl transition-transform dark:bg-zinc-900/40 dark:border-zinc-700/40 dark:backdrop-blur-md ${open ? "translate-x-0" : "translate-x-full"}`}
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        border: '1px solid rgba(255,255,255,0.25)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 60%, rgba(245,245,255,0.04) 100%)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <div className="flex items-center justify-between border-b border-white/30 dark:border-zinc-800/40 p-4">
        <h3 className="text-lg font-semibold dark:text-zinc-100">{title}</h3>
        <Button onClick={onClose} className="!rounded-full px-2 py-1">✕</Button>
      </div>
      <div className="overflow-y-auto p-4">{children}</div>
    </div>
  </div>
);

export default Sheet;
