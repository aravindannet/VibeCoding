import React from "react";

const Card = ({ children, className = "", ...rest }: any) => (
  <div
    {...rest}
    className={`rounded-2xl border bg-white/80 backdrop-blur-xl p-4 shadow-lg transition-shadow duration-200 dark:bg-zinc-900/40 dark:border-zinc-700/40 dark:backdrop-blur-md hover:shadow-xl ${className}`}
    style={{
      boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.15)',
      border: '1px solid rgba(255,255,255,0.3)',
      backdropFilter: 'blur(24px)',
      willChange: 'transform',
    }}
  >
    {children}
  </div>
);

export default Card;
