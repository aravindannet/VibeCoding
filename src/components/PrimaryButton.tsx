import React from "react";


const baseBtn =
  "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm shadow-2xl transition active:scale-[.98] border backdrop-blur-2xl dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:backdrop-blur-md";

const PrimaryButton = ({ className = "", children, ...props }: any) => (
  <button
    className={`${baseBtn} bg-[linear-gradient(135deg,rgba(99,102,241,0.10)_60%,rgba(99,102,241,0.04)_100%)] border-indigo-400 text-white hover:bg-indigo-600 dark:text-white ${className}`}
    style={{
      boxShadow: '0 8px 32px 0 rgba(99,102,241,0.12)',
      border: '1px solid rgba(99,102,241,0.18)',
      backdropFilter: 'blur(24px)',
      opacity: 0.85,
    }}
    {...props}
  >
    {children}
  </button>
);

export default PrimaryButton;
