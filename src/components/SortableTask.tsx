import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { User as UserIcon, Link as LinkIcon, ExternalLink, Trash2, MoveRight } from "lucide-react";
import Card from "./Card";
import Badge from "./Badge";
import Button from "./Button";
import { Task, Priority } from "../utils/types";

const SortableTask = ({ task, onInspect, onDelete, dragOverlay = false }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const isOverlay = dragOverlay === true;
  const style = isOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        scale: isDragging ? 0.97 : 1,
        zIndex: isDragging ? 1 : 0,
      };
  return (
    <motion.div
      layout
      style={style}
      initial={isOverlay ? { scale: 0.95, opacity: 0.8, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.25)' } : false}
      animate={isOverlay ? { scale: 1.05, opacity: 1, boxShadow: '0 16px 48px 0 rgba(31,38,135,0.25)' } : false}
      transition={isOverlay ? { type: 'spring', stiffness: 350, damping: 30 } : {}}
    >
      <div ref={isOverlay ? undefined : setNodeRef} {...(isOverlay ? {} : attributes)} {...(isOverlay ? {} : listeners)}>
        <Card className={`mb-3 cursor-grab active:cursor-grabbing ${isDragging || isOverlay ? "ring-2 ring-indigo-400" : ""}`}>
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              {task.owner && (
                <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200">
                  <UserIcon className="h-3 w-3" /> {task.owner}
                </div>
              )}
              <div className="truncate text-base font-extrabold leading-tight dark:text-zinc-100">{task.name}</div>
              {task.description && (
                <div className="mt-1 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">{task.description}</div>
              )}
            </div>
            <div className="flex items-center gap-1">
              {task.jiraKey && (
                <a
                  href={task.jiraBaseUrl ? `${task.jiraBaseUrl.replace(/\/$/, "")}/browse/${task.jiraKey}` : `#`}
                  target="_blank"
                  rel="noreferrer"
                  className="group"
                  title="Open in Jira"
                >
                  <Badge className="border-indigo-300 text-indigo-700 bg-indigo-50 group-hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-700"><LinkIcon className="h-3 w-3" /> {task.jiraKey}</Badge>
                </a>
              )}
              <Button className="!rounded-full px-2 py-1" title="Details" onClick={() => onInspect(task)}>
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button className="!rounded-full px-2 py-1" title="Delete" onClick={() => onDelete(task.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <Badge className="border-zinc-300 text-zinc-700 dark:text-zinc-300 dark:border-zinc-600">Start: {task.startDate || "—"}</Badge>
            <MoveRight className="h-3 w-3 text-zinc-400" />
            <Badge className="border-zinc-300 text-zinc-700 dark:text-zinc-300 dark:border-zinc-600">End: {task.endDate || "—"}</Badge>
            {task.priority && (
              <Badge
                className={`border-transparent ${{
                  High: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200",
                  Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
                  Low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
                }[task.priority as Priority]}`}
              >
                {task.priority}
              </Badge>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default SortableTask;
