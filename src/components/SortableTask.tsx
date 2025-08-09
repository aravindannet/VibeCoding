import React, { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { User as UserIcon, Link as LinkIcon, ExternalLink, Trash2, MoveRight, ThumbsUp, ThumbsDown, Heart } from "lucide-react";

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
      <div ref={isOverlay ? undefined : setNodeRef} {...(isOverlay ? {} : attributes)} {...(isOverlay ? {} : listeners)}>
  <Card className={`mb-2 cursor-grab active:cursor-grabbing ${isDragging || isOverlay ? "ring-2 ring-indigo-400" : ""} py-2 px-2.5`}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                {task.owner && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200">
                    <UserIcon className="h-2.5 w-2.5" /> {task.owner}
                  </div>
                )}
                <div className="truncate text-sm font-bold leading-tight dark:text-zinc-100">{task.name}</div>
              </div>
              {task.description && (
                <div className="line-clamp-1 text-[11px] text-zinc-600 dark:text-zinc-400">{task.description}</div>
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
                  <Badge className="!px-1.5 !py-0.5 border-indigo-300 text-indigo-700 bg-indigo-50 group-hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-700 text-[10px]"><LinkIcon className="h-2.5 w-2.5" /> {task.jiraKey}</Badge>
                </a>
              )}
              <Button className="!rounded-full !px-1.5 !py-1.5" title="Details" onClick={() => onInspect(task)}>
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button className="!rounded-full !px-1.5 !py-1.5" title="Delete" onClick={() => onDelete(task.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
            <div className="flex items-center gap-1">
              <Badge className="!px-1.5 !py-0.5 border-zinc-300 text-zinc-700 dark:text-zinc-300 dark:border-zinc-600">{task.startDate || "—"}</Badge>
              <MoveRight className="h-2.5 w-2.5 text-zinc-400" />
              <Badge className="!px-1.5 !py-0.5 border-zinc-300 text-zinc-700 dark:text-zinc-300 dark:border-zinc-600">{task.endDate || "—"}</Badge>
            </div>
            <div className="flex items-center gap-1.5">
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
              <div className="flex items-center gap-0.5">
                <Button 
                  className={`!rounded-full !p-1 transition-colors ${task.reaction === 'like' ? 'bg-emerald-500 text-white dark:bg-emerald-500 dark:text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
                  title="Like"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate({ ...task, reaction: task.reaction === 'like' ? undefined : 'like' });
                  }}
                >
                  <ThumbsUp className={`h-3 w-3 ${task.reaction === 'like' ? 'fill-white' : ''}`} />
                </Button>
                <Button 
                  className={`!rounded-full !p-1 transition-colors ${task.reaction === 'dislike' ? 'bg-amber-400 text-white dark:bg-amber-400 dark:text-white shadow-lg shadow-amber-400/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
                  title="Dislike"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate({ ...task, reaction: task.reaction === 'dislike' ? undefined : 'dislike' });
                  }}
                >
                  <ThumbsDown className={`h-3 w-3 ${task.reaction === 'dislike' ? 'fill-white' : ''}`} />
                </Button>
                <Button 
                  className={`!rounded-full !p-1 transition-colors ${task.reaction === 'heart' ? 'bg-red-500 text-white dark:bg-red-500 dark:text-white shadow-lg shadow-red-500/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
                  title="Heart"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate({ ...task, reaction: task.reaction === 'heart' ? undefined : 'heart' });
                  }}
                >
                  <Heart className={`h-3 w-3 ${task.reaction === 'heart' ? 'fill-white' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default SortableTask;
