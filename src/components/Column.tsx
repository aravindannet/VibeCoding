import React from "react";
import { motion } from "framer-motion";
import DroppableColumn from "./DroppableColumn";
import SortableTask from "./SortableTask";
import { Task } from "../utils/types";

const Column = ({ id, title, color, tasks, onInspect, onDelete }: any) => {
  const count = tasks.length;
  return (
    <div className="flex h-full min-h-[460px] flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${id === "todo" ? "bg-zinc-400" : id === "inprogress" ? "bg-amber-500" : id === "done" ? "bg-emerald-500" : "bg-rose-500"}`}
          />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-700 dark:text-zinc-200">{title}</h3>
          <motion.div
            key={count}
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-300 font-extrabold text-4xl px-4 py-2 rounded-xl shadow-lg flex items-center justify-center"
            style={{ perspective: 400 }}
          >
            {count}
          </motion.div>
        </div>
      </div>
      <DroppableColumn id={id} className={`flex-1 rounded-2xl border border-dashed ${color} p-3 dark:border-zinc-700`}>
        {tasks.map((task: Task) => (
          <SortableTask key={task.id} task={task} onInspect={onInspect} onDelete={onDelete} />
        ))}
      </DroppableColumn>
    </div>
  );
};

export default Column;
