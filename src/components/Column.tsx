import React from "react";
import { motion } from "framer-motion";
import DroppableColumn from "./DroppableColumn";
import SortableTask from "./SortableTask";
import { Task } from "../utils/types";

const Column = ({ id, title, color, tasks, onInspect, onDelete, onTaskUpdate }: any) => {
  const count = tasks.length;
  // Shrink cards if more than 7 and less than or equal to 10 tasks
  const shrinkCards = tasks.length > 3 && tasks.length <= 10;
  // Always enforce max height and scroll for overflow
  const columnScrollClass = 'overflow-y-auto max-h-[400px] sm:max-h-[520px]';
  return (
    <div className="flex h-full min-h-[460px] flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              id === "todo" ? "bg-slate-500" : 
              id === "inprogress" ? "bg-blue-500" : 
              id === "done" ? "bg-green-500" : 
              "bg-red-500"} opacity-75`}
          />
          <h3 className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200">{title}</h3>
          <motion.div
            key={count}
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-300 font-extrabold text-4xl px-4 py-2 rounded-xl shadow-lg flex items-center justify-center"
            style={{ perspective: 400 }}
          >
            {count}
          </motion.div>
        </div>
      </div>
      <DroppableColumn id={id} className={`flex-1 rounded-2xl p-3 border transition-all duration-300
        ${id === 'todo' ? 'border-slate-300/30 bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-900 dark:via-indigo-900/20 dark:to-slate-800 shadow-[0_0_15px_rgba(99,102,241,0.2),inset_0_0_40px_rgba(99,102,241,0.1)]' : ''}
        ${id === 'inprogress' ? 'border-blue-300/30 bg-gradient-to-b from-blue-50 via-sky-100/50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/30 dark:to-slate-800 shadow-[0_0_15px_rgba(59,130,246,0.2),inset_0_0_40px_rgba(59,130,246,0.1)]' : ''}
        ${id === 'blocker' ? 'border-rose-300/30 bg-gradient-to-b from-rose-50 via-red-50/50 to-orange-50 dark:from-slate-900 dark:via-rose-900/20 dark:to-slate-800 shadow-[0_0_15px_rgba(244,63,94,0.2),inset_0_0_40px_rgba(244,63,94,0.1)]' : ''}
        ${id === 'done' ? 'border-emerald-300/30 bg-gradient-to-b from-emerald-50 via-green-50/50 to-teal-50 dark:from-slate-900 dark:via-emerald-900/20 dark:to-slate-800 shadow-[0_0_15px_rgba(16,185,129,0.2),inset_0_0_40px_rgba(16,185,129,0.1)]' : ''}
        ${columnScrollClass} backdrop-blur-lg backdrop-saturate-150 bg-opacity-95 
        hover:shadow-[0_0_25px_rgba(99,102,241,0.3),inset_0_0_60px_rgba(99,102,241,0.15)] 
        hover:border-opacity-50 hover:bg-opacity-100
        dark:hover:shadow-[0_0_25px_rgba(99,102,241,0.2),inset_0_0_60px_rgba(99,102,241,0.1)]`}> 
        {tasks.map((task: Task) => (
          <div className="mb-4 last:mb-0 flex justify-center">
            <div className="w-full max-w-xl">
              <SortableTask 
                key={task._id || task.id} 
                task={task} 
                onInspect={onInspect} 
                onDelete={onDelete} 
                onUpdate={onTaskUpdate}
                shrink={shrinkCards} 
              />
            </div>
          </div>
        ))}
      </DroppableColumn>
    </div>
  );
};

export default Column;
