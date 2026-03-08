import React from 'react';
import { Task } from '../utils/types';
import Badge from './Badge';
import { UserIcon, LinkIcon, ExternalLink, Trash2 } from 'lucide-react';
import Button from './Button';

interface TaskGridProps {
  tasks: Task[];
  onInspect: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskGrid: React.FC<TaskGridProps> = ({ tasks, onInspect, onDelete }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <div key={task.id} className="rounded-xl border bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-3">
            {/* Header with task name and actions */}
            <div className="flex items-start justify-between gap-4">
              <h3 className="truncate text-base font-bold text-zinc-900 dark:text-zinc-100">
                {task.name}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <Button className="!rounded-full !px-1.5 !py-1.5" title="Details" onClick={() => onInspect(task)}>
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Button className="!rounded-full !px-1.5 !py-1.5" title="Delete" onClick={() => onDelete(task.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Task details */}
            <div className="space-y-2">
              {/* Owner and Status */}
              <div className="flex items-center gap-2 text-sm">
                {task.owner && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200">
                    <UserIcon className="h-3 w-3" /> {task.owner}
                  </div>
                )}
                <Badge
                  className={
                    task.status === 'todo'
                      ? 'border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300'
                      : task.status === 'inprogress'
                      ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                      : task.status === 'blocker'
                      ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                  }
                >
                  {task.status === 'todo'
                    ? 'Not Started'
                    : task.status === 'inprogress'
                    ? 'In Progress'
                    : task.status === 'blocker'
                    ? 'Blocked'
                    : 'Done'}
                </Badge>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{task.description}</p>
              )}

              {/* Dates and Priority */}
              <div className="flex flex-col gap-2 text-xs">
                {(task.startDate || task.endDate) ? (
                  <div className="grid grid-cols-2 gap-2 w-full min-w-0">
                    <Badge className="w-full border-zinc-300 text-zinc-700 dark:text-zinc-300 dark:border-zinc-600 justify-between min-w-0">
                      <span className="truncate">Start: {task.startDate || "—"}</span>
                    </Badge>
                    <Badge className="w-full border-zinc-300 text-zinc-700 dark:text-zinc-300 dark:border-zinc-600 justify-between min-w-0">
                      <span className="truncate">End: {task.endDate || "—"}</span>
                    </Badge>
                  </div>
                ) : (
                  <div className="text-zinc-400">—</div>
                )}

                {task.priority && (
                  <div>
                    <Badge
                      className={`border-transparent ${
                        {
                          High: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200",
                          Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
                          Low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
                        }[task.priority]
                      }`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Jira Link */}
              {task.jiraKey && (
                <div className="pt-1">
                  <a
                    href={task.jiraBaseUrl ? `${task.jiraBaseUrl.replace(/\/$/, "")}/browse/${task.jiraKey}` : '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-block"
                    title="Open in Jira"
                  >
                    <Badge className="border-indigo-300 text-indigo-700 bg-indigo-50 group-hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-700">
                      <LinkIcon className="h-3 w-3" /> {task.jiraKey}
                    </Badge>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskGrid;
