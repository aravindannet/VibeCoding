import React from "react";

const Badge = ({ children, className = "", ...rest }: any) => (
  <span
    {...rest}
    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium dark:text-zinc-100 dark:border-zinc-600 ${className}`}
  >
    {children}
  </span>
);

export default Badge;
