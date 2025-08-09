import React from "react";


const baseBtn =
  "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm shadow-2xl transition active:scale-[.98] border backdrop-blur-2xl dark:bg-zinc-900/40 dark:border-zinc-700/40 dark:backdrop-blur-md";

const Button = ({ className = "", children, ...props }: any) => (
  <button
    className={`${baseBtn} bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:bg-zinc-900/40 dark:border-zinc-700/40 dark:text-zinc-100 dark:hover:bg-zinc-800/50 ${className}`}
    style={{
      boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
    }}
    {...props}
  >
    {children}
  </button>
);

export default Button;
