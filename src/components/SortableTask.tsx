// Helper to format date as DD-MON-YY
function formatShortDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate().toString().padStart(2, '0');
  const mon = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = d.getFullYear().toString().slice(-2);
  return `${day}-${mon}-${year}`;
}

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
  history?: Array<{ action: string; by?: string; from?: string; to?: string; createdAt?: string }>;
}

interface SortableTaskProps {
  task: Task;
  onInspect: (task: Task) => void;
  onDelete: (task: Task) => void;
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

  // Inline style that handles transform/transition for both overlay and normal cards.
  const inlineStyle = {
    transform: CSS.Transform.toString(transform),
    transition: isOverlay ? 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)' : transition,
    // reduce touch interference
    touchAction: 'none' as any,
    WebkitTapHighlightColor: 'transparent' as any,
    userSelect: 'none' as any,
  };

  // Placeholder class to hide the original while preserving layout when dragging
  const placeholderClass = isDragging && !isOverlay ? 'invisible pointer-events-none' : '';
  return (
    <motion.div
      ref={isOverlay ? undefined : setNodeRef}
      layout
      style={inlineStyle}
      className={placeholderClass}
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
  style={isOverlay ? inlineStyle : undefined}
        {...attributes}
        {...listeners}
        tabIndex={0}
        aria-label={task.name}
        // apply placeholder class to preserve layout when dragging
        data-placeholder={placeholderClass}
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
                stopPropagation={true}
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
                stopPropagation={true}
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(task);
                }}
                tabIndex={0}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {/* Comment bubble previously added - ensure it doesn't propagate */}
              <Button
                className="!rounded-full !px-2 !py-1"
                title="Comments"
                aria-label="Add/view comments"
                stopPropagation={true}
                onClick={(e) => {
                  e.preventDefault();
                  onInspect(task);
                }}
                tabIndex={0}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                {task.history && task.history.filter((h:any) => h.action === 'comment').length > 0 && (
                  <span className="ml-1 text-[11px] font-semibold">{task.history.filter((h:any) => h.action === 'comment').length}</span>
                )}
              </Button>
            </div>
          </div>

          {/* Description row */}
          {task.description && (
            <div className="text-xs text-zinc-600 dark:text-zinc-400 truncate" style={{ marginLeft: '0.5rem' }}>
              {task.description}
            </div>
          )}

          {/* Date and Priority row (priority right-aligned) */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {task.startDate && task.endDate && (
                <div className="flex items-center gap-1 text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg whitespace-nowrap max-w-[120px]">
                  <span>{formatShortDate(task.startDate)}</span>
                  <MoveRight className="h-3 w-3" />
                  <span>{formatShortDate(task.endDate)}</span>
                </div>
              )}
            </div>
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
