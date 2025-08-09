import React from "react";
import { useDroppable } from "@dnd-kit/core";

const DroppableColumn = ({ id, children, className = "" }: any) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`${className} relative transition-all duration-300 ease-in-out
        ${isOver ? `
          ring-2 ring-indigo-400/50 
          shadow-[0_0_30px_rgba(99,102,241,0.3),inset_0_0_20px_rgba(99,102,241,0.2)] 
          before:absolute before:inset-0 before:rounded-2xl
          before:bg-gradient-to-b before:from-indigo-500/10 before:via-transparent before:to-indigo-500/10
          before:animate-pulse before:-z-10 before:blur-sm
          after:absolute after:inset-0 after:rounded-2xl
          after:bg-gradient-to-b after:from-indigo-400/5 after:to-indigo-400/5
          after:animate-pulse after:animation-delay-500 after:-z-10
          dark:ring-indigo-400/30 
          dark:shadow-[0_0_30px_rgba(99,102,241,0.2),inset_0_0_30px_rgba(99,102,241,0.15)]
        ` : ""}`}
    >
      {children}
    </div>
  );
};

export default DroppableColumn;
