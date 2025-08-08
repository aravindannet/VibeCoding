import React from "react";
import Button from "../components/Button";

const Dialog = ({ open, onClose, title, children }: any) => (
  <div className={`fixed inset-0 z-50 ${open ? "" : "hidden"}`}>
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="absolute left-1/2 top-1/2 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/30 backdrop-blur-md shadow-2xl dark:bg-zinc-950/40 dark:backdrop-blur-md"
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        border: '1px solid rgba(255,255,255,0.35)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.45) 60%, rgba(245,245,255,0.25) 100%)',
        backdropFilter: 'blur(18px)',
      }}>
      <div className="flex items-center justify-between border-b border-white/30 dark:border-zinc-800/40 p-4">
        <h3 className="text-lg font-semibold dark:text-zinc-100">{title}</h3>
        <Button onClick={onClose} className="!rounded-full px-2 py-1">✕</Button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  </div>
);

export default Dialog;
