import React from "react";

const baseBtn =
  "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm shadow-sm transition active:scale-[.98] border";

const PrimaryButton = ({ className = "", children, ...props }: any) => (
  <button
    className={`${baseBtn} border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 dark:border-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default PrimaryButton;
