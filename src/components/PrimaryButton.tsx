import React from "react";


const baseBtn =
  "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm shadow-2xl transition active:scale-[.98] border backdrop-blur-2xl dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:backdrop-blur-md";

const PrimaryButton = ({ className = "", children, ...props }: any) => (
  <button
    className={`${baseBtn} bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 dark:bg-indigo-600/90 dark:border-indigo-500/50 dark:hover:bg-indigo-500/80 ${className}`}
    style={{
      boxShadow: '0 4px 12px 0 rgba(99,102,241,0.2)',
    }}
    {...props}
  >
    {children}
  </button>
);

export default PrimaryButton;
