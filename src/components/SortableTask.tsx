import React, { useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { User as UserIcon, Link as LinkIcon, ExternalLink, Trash2, MoveRight, ThumbsUp, ThumbsDown, Heart, GripVertical } from "lucide-react";
import Card from "./Card";
import Badge from "./Badge";
import Button from "./Button";

const SortableTask = ({ task, onInspect, onDelete, onUpdate, dragOverlay = false }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id || task.id });
  useEffect(() => {
    if (isDragging) {
      console.log('Dragging task:', task._id || task.id, task.name);
    }
  }, [isDragging, task]);
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
      <Card
        ref={isOverlay ? undefined : setNodeRef}
        className={`relative flex select-none flex-row items-start gap-3 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-lg px-4 py-3 transition-all duration-150 ${isDragging ? "ring-2 ring-indigo-400 scale-[1.02]" : "hover:shadow-xl"}`}
        style={style}
        {...attributes}
        tabIndex={0}
        aria-label={task.name}
      >
        {/* Drag handle */}
        <div {...listeners} className="flex items-center cursor-grab select-none mt-1">
          <GripVertical className="h-4 w-4 text-zinc-400" />
        </div>
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
              <Button className="!rounded-full !px-2 !py-1" title="Details" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onInspect(task); }}>
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button className="!rounded-full !px-2 !py-1" title="Delete" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(task._id || task.id); }}>
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
              <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">
                <span>{task.startDate}</span>
                <MoveRight className="h-3 w-3" />
                <span>{task.endDate}</span>
              </div>
            )}
            {task.priority && (
              <Badge className={`text-xs font-semibold px-2 py-1 rounded-lg ${{
                High: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200",
                Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
                Low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
              }[task.priority as string]}`}>{task.priority}</Badge>
            )}
            {task.jiraKey && (
              <a
                href={task.jiraBaseUrl ? `${task.jiraBaseUrl.replace(/\/$/, "")}/browse/${task.jiraKey}` : `#`}
                target="_blank"
                rel="noreferrer"
                className="group"
                title="Open in Jira"
              >
                <Badge className="!px-2 !py-1 border-indigo-300 text-indigo-700 bg-indigo-50 group-hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-700 text-xs">
                  <LinkIcon className="h-3 w-3" /> {task.jiraKey}
                </Badge>
              </a>
            )}
          </div>
          
          {/* Reaction buttons row */}
          <div className="flex items-center gap-1">
            <Button 
              className={`!rounded-full !px-2 !py-1 transition-colors ${task.reaction === 'like' ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-400/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
              title="Like"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onUpdate({ ...task, reaction: task.reaction === 'like' ? undefined : 'like' });
              }}
            >
              <ThumbsUp className="h-4 w-4" style={task.reaction === 'like' ? { fill: '#FFC107' } : {}} />
            </Button>
            <Button 
              className={`!rounded-full !px-2 !py-1 transition-colors ${task.reaction === 'dislike' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
              title="Dislike"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onUpdate({ ...task, reaction: task.reaction === 'dislike' ? undefined : 'dislike' });
              }}
            >
              <ThumbsDown className="h-4 w-4" style={task.reaction === 'dislike' ? { fill: '#FF1744' } : {}} />
            </Button>
            <Button 
              className={`!rounded-full !px-2 !py-1 transition-colors ${task.reaction === 'heart' ? 'bg-fuchsia-600 text-white shadow-lg' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
              title="Heart"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onUpdate({ ...task, reaction: task.reaction === 'heart' ? undefined : 'heart' });
              }}
            >
              <Heart className="h-4 w-4" style={task.reaction === 'heart' ? { fill: '#C026D3' } : {}} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SortableTask;
