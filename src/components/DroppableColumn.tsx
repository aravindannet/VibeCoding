import React from "react";
import { useDroppable } from "@dnd-kit/core";

const DroppableColumn = ({ id, children, className = "" }: any) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? "ring-2 ring-indigo-400" : ""}`}
    >
      {children}
    </div>
  );
};

export default DroppableColumn;
