import React from "react";

const Card = ({ children, className = "", ...rest }: any) => (
  <div
    {...rest}
    className={`rounded-2xl border backdrop-blur-2xl p-4 shadow-2xl dark:bg-zinc-900/40 dark:border-zinc-700/40 dark:backdrop-blur-md ${className}`}
    style={{
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      border: '1px solid rgba(255,255,255,0.25)',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 60%, rgba(245,245,255,0.04) 100%)',
      backdropFilter: 'blur(24px)',
    }}
  >
    {children}
  </div>
);

export default Card;
