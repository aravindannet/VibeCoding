import React from 'react';
import { Task } from '../utils/types';
import Badge from './Badge';
import { UserIcon, LinkIcon, ExternalLink, Trash2, MoveRight } from 'lucide-react';
import Button from './Button';

interface TableViewProps {
  tasks: Task[];
  onInspect: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TableView: React.FC<TableViewProps> = ({ tasks, onInspect, onDelete }) => {
  return (
  <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-800">
  <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3">Task</th>
            <th className="px-4 py-3">Owner</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-2 py-2">Dates</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/50"
            >
              <td className="px-2 py-2">
                <div className="flex flex-col gap-0.5 min-h-0">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1 text-base">
                    <span className="truncate max-w-[400px]">{task.name}</span>
                    {task.jiraKey && (
                      <a
                        href={task.jiraBaseUrl ? `${task.jiraBaseUrl.replace(/\/$/, "")}/browse/${task.jiraKey}` : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="group"
                        title="Open in Jira"
                      >
                        <Badge className="border-indigo-300 text-indigo-700 bg-indigo-50 group-hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-700 px-2 py-0.5 text-[9px] whitespace-nowrap">
                          <LinkIcon className="h-3 w-3" /> {task.jiraKey}
                        </Badge>
                      </a>
                    )}
                  </div>
                  {task.description && (
                    <div className="truncate text-base text-zinc-500 dark:text-zinc-400 max-w-[500px]">
                      {task.description}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                {task.owner && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                    <UserIcon className="h-3 w-3" /> {task.owner}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <Badge
                  className={
                    `${
                      task.status === 'todo'
                        ? 'border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300'
                        : task.status === 'inprogress'
                        ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                        : task.status === 'blocker'
                        ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                    } whitespace-nowrap`
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
              </td>
              <td className="px-4 py-3">
                {task.priority && (
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
                )}
              </td>
              <td className="px-2 py-2">
                  {task.startDate && task.endDate && (
                    <Badge className="flex items-center gap-0.5 text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-lg whitespace-nowrap max-w-[120px]">
                    <span>{task.startDate}</span>
                    <MoveRight className="h-3 w-3" />
                    <span>{task.endDate}</span>
                  </Badge>
                )}
                {(!task.startDate || !task.endDate) && <span className="text-zinc-400">—</span>}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button className="!rounded-full !px-1.5 !py-1.5" title="Details" onClick={() => onInspect(task)}>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button className="!rounded-full !px-1.5 !py-1.5" title="Delete" onClick={() => onDelete(task.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
