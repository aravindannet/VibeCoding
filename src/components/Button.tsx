import React from "react";

const baseBtn =
  "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm shadow-sm transition active:scale-[.98] border";

const Button = ({ className = "", children, ...props }: any) => (
  <button
    className={`${baseBtn} bg-zinc-100 border-zinc-300 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-700 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
