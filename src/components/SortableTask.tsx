
import React, { useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Link as LinkIcon,
  ExternalLink,
  Trash2,
  MoveRight,
  ThumbsUp,
  ThumbsDown,
  Heart,
  GripVertical,
} from "lucide-react";
import Card from "./Card";
import Badge from "./Badge";
import Button from "./Button";

interface Task {
  _id?: string;
  id?: string;
  name: string;
  owner?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  priority?: "High" | "Medium" | "Low";
  reaction?: "like" | "dislike" | "heart";
  jiraKey?: string;
  jiraBaseUrl?: string;
}

interface SortableTaskProps {
  task: Task;
  onInspect: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdate: (task: Task) => void;
  dragOverlay?: boolean;
}

const REACTIONS = [
  {
    key: "like",
    icon: ThumbsUp,
    title: "Like",
    activeClass: "bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-400/20",
    hoverClass: "hover:bg-zinc-100 dark:hover:bg-zinc-700",
    fill: "#FFC107",
  },
  {
    key: "dislike",
    icon: ThumbsDown,
    title: "Dislike",
    activeClass: "bg-red-500 text-white shadow-lg shadow-red-500/20",
    hoverClass: "hover:bg-zinc-100 dark:hover:bg-zinc-700",
    fill: "#FF1744",
  },
  {
    key: "heart",
    icon: Heart,
    title: "Heart",
    activeClass: "bg-fuchsia-600 text-white shadow-lg",
    hoverClass: "hover:bg-zinc-100 dark:hover:bg-zinc-700",
    fill: "#C026D3",
  },
];

const PRIORITY_STYLES: Record<string, string> = {
  High: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200",
  Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
  Low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
};

const SortableTask: React.FC<SortableTaskProps> = ({ task, onInspect, onDelete, onUpdate, dragOverlay = false }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id || task.id });
  const isOverlay = dragOverlay === true;
  const style = isOverlay
    ? {
        transform: CSS.Transform.toString(transform),
        transition: 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)',
      }
    : isDragging && !isOverlay
    ? {
        display: 'none',
      }
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: 1,
        filter: 'none',
        scale: 1,
        rotate: 0,
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)',
        zIndex: 0,
      };

  // Restore point: original card is hidden while dragging (not rendered)
  if (isDragging && !isOverlay) {
    return null;
  }
  return (
    <motion.div
      ref={isOverlay ? undefined : setNodeRef}
      layout
      style={style}
      initial={isOverlay ? { scale: 1.05, opacity: 0.95, boxShadow: '0 12px 40px 0 rgba(31,38,135,0.3)' } : false}
      animate={isOverlay
        ? { scale: 1.05, opacity: 1, boxShadow: '0 20px 60px 0 rgba(31,38,135,0.35)', rotate: 0 }
        : isDragging
        ? { scale: 1.04, opacity: 0.96, rotate: 2, boxShadow: '0 12px 40px 0 rgba(31,38,135,0.25), 0 2px 8px 0 rgba(0,0,0,0.10)' }
        : { scale: 1, opacity: 1, rotate: 0, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)' }
      }
      transition={{
        layout: { type: 'spring', stiffness: 500, damping: 30, mass: 1 },
        default: { duration: 0.2, ease: 'easeOut' },
      }}
    >
      <Card
        className={`relative flex select-none flex-row items-start gap-3 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-lg px-4 py-3 transition-all duration-150 ${isDragging ? "ring-2 ring-indigo-400 scale-[1.02]" : "hover:shadow-xl"} cursor-grab active:cursor-grabbing`}
        style={style}
        {...attributes}
        {...listeners}
        tabIndex={0}
        aria-label={task.name}
      >
  {/* Drag handle removed to free up space for card content */}
        {/* Card content */}
        <div className="flex flex-col flex-1 min-w-0 gap-2">
          {/* Top row: Owner, Title and Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {task.owner && (
                <div className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200">
                  <UserIcon className="h-3 w-3" /> {task.owner}
                </div>
              )}
              <span className="truncate text-sm font-bold leading-tight dark:text-zinc-100">{task.name}</span>
            </div>
            {/* Action buttons on top right */}
            <div className="flex items-center gap-1 ml-2">
              <Button
                className="!rounded-full !px-2 !py-1"
                title="Details"
                aria-label="Edit task details"
                onPointerDown={e => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  onInspect(task);
                }}
                tabIndex={0}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                className="!rounded-full !px-2 !py-1"
                title="Delete"
                aria-label="Delete task"
                onPointerDown={e => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(task._id || task.id || "");
                }}
                tabIndex={0}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Description row */}
          {task.description && (
            <div className="text-xs text-zinc-600 dark:text-zinc-400 truncate" style={{ marginLeft: '0.5rem' }}>
              {task.description}
            </div>
          )}

          {/* Date and Priority row */}
          <div className="flex items-center gap-2">
            {task.startDate && task.endDate && (
              <div className="flex items-center gap-1 text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg whitespace-nowrap max-w-[120px]">
                <span>{task.startDate}</span>
                <MoveRight className="h-3 w-3" />
                <span>{task.endDate}</span>
              </div>
            )}
            {task.priority && (
              <Badge className={`text-xs font-semibold px-2 py-1 rounded-lg ${PRIORITY_STYLES[task.priority] || ''}`}>{task.priority}</Badge>
            )}
          </div>

          {/* Reaction buttons row */}
          <div className="flex items-center gap-1 justify-between">
            <div className="flex items-center gap-1">
              {REACTIONS.map(({ key, icon: Icon, title, activeClass, hoverClass, fill }) => (
                <Button
                  key={key}
                  className={`!rounded-full !px-2 !py-1 transition-colors ${task.reaction === key ? activeClass : hoverClass}`}
                  title={title}
                  aria-label={title}
                  onPointerDown={e => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    onUpdate({ ...task, reaction: task.reaction === key ? undefined : key as Task['reaction'] });
                  }}
                  tabIndex={0}
                >
                  <Icon className="h-4 w-4" style={task.reaction === key ? { fill } : {}} />
                </Button>
              ))}
            </div>
            {task.jiraKey && (
              <a
                href={task.jiraBaseUrl ? `${task.jiraBaseUrl.replace(/\/$/, "")}/browse/${task.jiraKey}` : `#`}
                target="_blank"
                rel="noreferrer"
                className="group"
                title="Open in Jira"
                tabIndex={0}
                onPointerDown={e => e.stopPropagation()}
              >
                <Badge className="!px-2 !py-1 border-indigo-300 text-indigo-700 bg-indigo-50 group-hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-700 text-xs">
                  <LinkIcon className="h-3 w-3" /> {task.jiraKey}
                </Badge>
              </a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SortableTask;
