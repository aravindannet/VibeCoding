import React from "react";


const baseBtn =
  "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm shadow-2xl transition active:scale-[.98] border backdrop-blur-2xl dark:bg-zinc-900/40 dark:border-zinc-700/40 dark:backdrop-blur-md";

const Button = ({ className = "", children, ...props }: any) => (
  <button
    className={`${baseBtn} bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_60%,rgba(245,245,255,0.04)_100%)] border-zinc-300 text-zinc-900 hover:bg-zinc-200 dark:text-zinc-100 ${className}`}
    style={{
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      border: '1px solid rgba(255,255,255,0.25)',
      backdropFilter: 'blur(24px)',
    }}
    {...props}
  >
    {children}
  </button>
);

export default Button;
