import React, { useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { User as UserIcon, Link as LinkIcon, ExternalLink, Trash2, MoveRight, ThumbsUp, ThumbsDown, Heart } from "lucide-react";
import { GripVertical } from "lucide-react";

import Card from "./Card";
import Badge from "./Badge";
import Button from "./Button";
import { Task, Priority } from "../utils/types";

const SortableTask = ({ task, onInspect, onDelete, onUpdate, dragOverlay = false, shrink = false }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const isOverlay = dragOverlay === true;
  const style = isOverlay
    ? {
        transform: CSS.Transform.toString(transform),
        transition: 'transform 200ms ease-in-out',
      }
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.9 : 1,
        scale: isDragging ? 1.02 : 1,
        zIndex: isDragging ? 999 : 0,
      };
  return (
    <motion.div
      layout
      style={style}
      initial={isOverlay ? { scale: 1.05, opacity: 0.95, boxShadow: '0 12px 40px 0 rgba(31,38,135,0.3)' } : false}
      animate={isOverlay ? { 
        scale: 1.05,
        opacity: 1,
        boxShadow: '0 20px 60px 0 rgba(31,38,135,0.35)',
        rotateZ: transform?.toString().includes('rotate') ? 0 : undefined
      } : {}}
      transition={isOverlay ? { 
        type: 'spring',
        stiffness: 400,
        damping: 25,
        mass: 1
      } : {
        duration: 0.2,
        ease: 'easeOut'
      }}
    >
      <div ref={isOverlay ? undefined : setNodeRef}>
        <Card className={`mb-3 ${isDragging || isOverlay ? "ring-2 ring-indigo-400" : ""} py-4 px-4`}>
          {/* Top section: info and buttons */}
          <div className="flex items-start justify-between gap-2">
            {/* Draggable info area: left only */}
            <div
              className="flex items-center gap-3 min-w-0 cursor-grab active:cursor-grabbing px-2 py-1"
              {...(isOverlay ? {} : attributes)}
              {...(isOverlay ? {} : listeners)}
              tabIndex={0}
              role="button"
              aria-label="Drag task"
            >
              <GripVertical className="h-4 w-4 text-zinc-400 mr-1" />
              {task.owner && (
                <div className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200">
                  <UserIcon className="h-2.5 w-2.5" /> {task.owner}
                </div>
              )}
              <div className="truncate text-sm font-bold leading-tight dark:text-zinc-100">{task.name}</div>
              {task.description && (
                <div className="line-clamp-1 text-[11px] text-zinc-600 dark:text-zinc-400">{task.description}</div>
              )}
              {task.jiraKey && (
                <a
                  href={task.jiraBaseUrl ? `${task.jiraBaseUrl.replace(/\/$/, "")}/browse/${task.jiraKey}` : `#`}
                  target="_blank"
                  rel="noreferrer"
                  className="group"
                  title="Open in Jira"
                >
                  <Badge className="!px-1.5 !py-0.5 border-indigo-300 text-indigo-700 bg-indigo-50 group-hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-700 text-[10px]"><LinkIcon className="h-2.5 w-2.5" /> {task.jiraKey}</Badge>
                </a>
              )}
            </div>
            {/* Non-draggable: Details and Delete buttons (right) */}
            <div className="flex items-center gap-1" style={{ pointerEvents: 'auto' }}>
              <Button className="!rounded-full !px-2 !py-2" title="Details" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onInspect(task); }}>
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button className="!rounded-full !px-2 !py-2" title="Delete" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(task.id); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Date area (not draggable) */}
          <div className="mt-1.5 flex items-center gap-1">
            <Badge className="!px-1.5 !py-0.5 border-zinc-300 text-zinc-700 dark:text-zinc-300 dark:border-zinc-600">{task.startDate || "—"}</Badge>
            <MoveRight className="h-2.5 w-2.5 text-zinc-400" />
            <Badge className="!px-1.5 !py-0.5 border-zinc-300 text-zinc-700 dark:text-zinc-300 dark:border-zinc-600">{task.endDate || "—"}</Badge>
          </div>
          {/* Non-draggable section: priority and reaction buttons */}
          <div className="mt-1.5 flex items-center justify-between text-[10px]">
            <div>
              {task.priority && (
                <Badge
                  className={`!px-1.5 !py-0.5 border-transparent ${{
                    High: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200",
                    Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
                    Low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
                  }[task.priority as Priority]}`}
                >
                  {task.priority}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <Button 
                className={`!rounded-full !px-2 !py-2 transition-colors ${task.reaction === 'like' ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-400/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
                title="Like"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdate({ ...task, reaction: task.reaction === 'like' ? undefined : 'like' });
                }}
              >
                <ThumbsUp className="h-4 w-4" style={task.reaction === 'like' ? { fill: '#FFC107' } : {}} />
              </Button>
              <Button 
                className={`!rounded-full !px-2 !py-2 transition-colors ${task.reaction === 'dislike' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
                title="Dislike"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdate({ ...task, reaction: task.reaction === 'dislike' ? undefined : 'dislike' });
                }}
              >
                <ThumbsDown className="h-4 w-4" style={task.reaction === 'dislike' ? { fill: '#FF1744' } : {}} />
              </Button>
              <Button 
                className={`!rounded-full !px-2 !py-2 transition-colors ${task.reaction === 'heart' ? 'bg-fuchsia-600 text-white shadow-lg' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
                title="Heart"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdate({ ...task, reaction: task.reaction === 'heart' ? undefined : 'heart' });
                }}
              >
                <Heart className="h-4 w-4" style={task.reaction === 'heart' ? { fill: '#C026D3' } : {}} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default SortableTask;
