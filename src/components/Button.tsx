import React from "react";


const baseBtn =
  "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm shadow-2xl transition active:scale-[.98] border backdrop-blur-2xl dark:bg-zinc-900/40 dark:border-zinc-700/40 dark:backdrop-blur-md";

const Button = React.forwardRef<HTMLButtonElement, any>(({ className = "", children, stopPropagation = false, onClick, onPointerDown, onTouchStart, ...props }, ref) => {
  const handlePointerDown = (e: any) => {
    if (stopPropagation) e.stopPropagation();
    if (onPointerDown) onPointerDown(e);
  };
  const handleClick = (e: any) => {
    if (stopPropagation) e.stopPropagation();
    if (onClick) onClick(e);
  };
  const handleTouchStart = (e: any) => {
    if (stopPropagation) e.stopPropagation();
    if (onTouchStart) onTouchStart(e);
  };

  return (
    <button
      ref={ref}
      className={`${baseBtn} bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:bg-zinc-900/40 dark:border-zinc-700/40 dark:text-zinc-100 dark:hover:bg-zinc-800/50 ${className}`}
      style={{
        boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
