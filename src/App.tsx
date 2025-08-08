import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Plus,
  Search,
  PlugZap,
  Trash2,
  AlertTriangle,
  Loader2,
  Moon,
  Sun,
  ExternalLink,
} from "lucide-react";
import AddTaskDialog from "./dialogs/AddTaskDialog";
import JiraDialog from "./dialogs/JiraDialog";
import Card from "./components/Card";
import Badge from "./components/Badge";
import Button from "./components/Button";
import PrimaryButton from "./components/PrimaryButton";
import Input from "./components/Input";
import Textarea from "./components/Textarea";
import DroppableColumn from "./components/DroppableColumn";
import SortableTask from "./components/SortableTask";
import Column from "./components/Column";
import Sheet from "./dialogs/Sheet";
import Dialog from "./dialogs/Dialog";
import { Status, Priority, Task } from "./utils/types";



const COLUMNS = [
  {
    id: "todo",
    title: "Not Started",
    color: "bg-gradient-to-br from-zinc-50 via-zinc-100 to-stone-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-stone-900",
    icon: <CalendarDays className="h-4 w-4" />
  },
  {
    id: "inprogress",
    title: "In Progress",
    color: "bg-gradient-to-br from-gray-50 via-gray-100 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900",
    icon: <Loader2 className="h-4 w-4 animate-spin-slow" />
  },
  {
    id: "blocker",
    title: "Blocked",
    color: "bg-gradient-to-br from-stone-100 via-zinc-100 to-red-50 dark:from-stone-900 dark:via-zinc-900 dark:to-red-900",
    icon: <AlertTriangle className="h-4 w-4" />
  },
  {
    id: "done",
    title: "Done",
    color: "bg-gradient-to-br from-emerald-50 via-gray-100 to-zinc-50 dark:from-emerald-900 dark:via-gray-900 dark:to-zinc-900",
    icon: <CheckCircle2 className="h-4 w-4" />
  },
] as const;

// ...existing code...

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("kanban-dark");
    return saved ? saved === "1" : true; // default to dark
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("kanban-tasks-v2");
    return saved ? JSON.parse(saved) as Task[] : [];
  });
  const [query, setQuery] = useState("");
  const [sheetTask, setSheetTask] = useState<Task | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [jiraOpen, setJiraOpen] = useState(false);
  const [jiraBaseUrl, setJiraBaseUrl] = useState(() => localStorage.getItem("kanban-jira-base") || "");
  const [jiraConnected, setJiraConnected] = useState(() => !!localStorage.getItem("kanban-jira-base"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("kanban-dark", dark ? "1" : "0");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("kanban-tasks-v2", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    if (jiraBaseUrl) localStorage.setItem("kanban-jira-base", jiraBaseUrl);
  }, [jiraBaseUrl]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const columns = useMemo(() => {
    const byCol: Record<Status, Task[]> = { todo: [], inprogress: [], blocker: [], done: [] };
    tasks
      .filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          (t.jiraKey || "").toLowerCase().includes(query.toLowerCase()) ||
          (t.owner || "").toLowerCase().includes(query.toLowerCase())
      )
      .forEach((t) => byCol[t.status].push(t as Task));
    return byCol;
  }, [tasks, query]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    const isColumn = (COLUMNS as any).some((c: any) => c.id === overId);
    let destColumn: Status | null = null;
    if (isColumn) destColumn = overId as Status;
    else {
      const overTask = tasks.find((t) => t.id === overId);
      destColumn = (overTask?.status || activeTask.status) as Status;
    }

    if (destColumn && activeTask.status !== destColumn) {
      setTasks((prev) => prev.map((t) => (t.id === activeTask.id ? { ...t, status: destColumn as Status } : t)));
    }
  };

  const onDelete = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const addTask = (task: Task) => setTasks((prev) => [{ ...task }, ...prev]);

// ...existing code...

  const filteredColumns = COLUMNS.map((c) => ({ ...c, tasks: (columns as any)[c.id] as Task[] }));

  return (
    <div className={`${dark ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-200 p-6 dark:from-zinc-950 dark:to-zinc-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold tracking-tight dark:text-zinc-100">
                Status Board
              </motion.h1>
              <Badge className="border-indigo-300 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-700">Kanban • Drag & Drop</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
                <Input placeholder="Search by task, owner, or JIRA key" className="pl-8" value={query} onChange={(e: any) => setQuery(e.target.value)} />
              </div>
              <Button onClick={() => setDark((d: boolean) => !d)}>
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {dark ? "Light" : "Dark"} mode
              </Button>
              <Button onClick={() => setJiraOpen(true)} className={`${jiraConnected ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-700" : ""}`}>
                <PlugZap className="h-4 w-4" /> {jiraConnected ? "Jira Connected" : "Connect Jira"}
              </Button>
              <PrimaryButton onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4" /> Add Task
              </PrimaryButton>
            </div>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {filteredColumns.map((col: any) => (
                <div key={col.id} className="flex flex-col">
                  <Column id={col.id} title={col.title} color={col.color} tasks={col.tasks} onInspect={setSheetTask} onDelete={(id: string) => setTasks(prev => prev.filter(t => t.id !== id))} />
                </div>
              ))}
            </div>
            <DragOverlay />
          </DndContext>

          <Sheet open={!!sheetTask} onClose={() => setSheetTask(null)} title={sheetTask?.name || "Task"}>
            {sheetTask && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Status</div>
                    <div className="mt-1">
                      <select
                        value={sheetTask.status}
                        onChange={(e) => {
                          const status = e.target.value as Status;
                          setTasks((prev) => prev.map((t) => (t.id === sheetTask.id ? { ...t, status } : t)));
                          setSheetTask((s: any) => ({ ...s, status }));
                        }}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100"
                      >
                        <option value="todo">Not Started</option>
                        <option value="inprogress">In Progress</option>
                        <option value="blocker">Blocked</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Priority</div>
                    <div className="mt-1">
                      <select
                        value={sheetTask.priority || "Medium"}
                        onChange={(e) => {
                          const priority = e.target.value as Priority;
                          setTasks((prev) => prev.map((t) => (t.id === sheetTask.id ? { ...t, priority } : t)));
                          setSheetTask((s: any) => ({ ...s, priority }));
                        }}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Owner</div>
                    <Input value={sheetTask.owner || ""} onChange={(e: any) => {
                      const owner = e.target.value;
                      setTasks((prev) => prev.map((t) => (t.id === sheetTask.id ? { ...t, owner } : t)));
                      setSheetTask((s: any) => ({ ...s, owner }));
                    }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Jira Issue Key</div>
                    <Input value={sheetTask.jiraKey || ""} onChange={(e: any) => {
                      const jiraKey = e.target.value.toUpperCase();
                      setTasks((prev) => prev.map((t) => (t.id === sheetTask.id ? { ...t, jiraKey } : t)));
                      setSheetTask((s: any) => ({ ...s, jiraKey }));
                    }} placeholder="e.g., ABC-123" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Start</div>
                    <Input type="date" value={sheetTask.startDate || ""} onChange={(e: any) => {
                      const startDate = e.target.value;
                      setTasks((prev) => prev.map((t) => (t.id === sheetTask.id ? { ...t, startDate } : t)));
                      setSheetTask((s: any) => ({ ...s, startDate }));
                    }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">End</div>
                    <Input type="date" value={sheetTask.endDate || ""} onChange={(e: any) => {
                      const endDate = e.target.value;
                      setTasks((prev) => prev.map((t) => (t.id === sheetTask.id ? { ...t, endDate } : t)));
                      setSheetTask((s: any) => ({ ...s, endDate }));
                    }} />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Description</div>
                  <Textarea rows={4} value={sheetTask.description || ""} onChange={(e: any) => {
                    const description = e.target.value;
                    setTasks((prev) => prev.map((t) => (t.id === sheetTask.id ? { ...t, description } : t)));
                    setSheetTask((s: any) => ({ ...s, description }));
                  }} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Jira Link</div>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      {(jiraBaseUrl && sheetTask.jiraKey) ? (
                        <a
                          className="inline-flex items-center gap-1 text-indigo-700 underline dark:text-indigo-300"
                          target="_blank"
                          rel="noreferrer"
                          href={`${jiraBaseUrl.replace(/\/$/, "")}/browse/${sheetTask.jiraKey}`}
                        >
                          Open <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-zinc-500 dark:text-zinc-400">Set base URL & key</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-end justify-end gap-2">
                    <PrimaryButton onClick={() => setSheetTask(null)}>Save Task</PrimaryButton>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button onClick={() => { setTasks(prev => prev.filter(t => t.id !== (sheetTask as any).id)); setSheetTask(null); }} className="border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20">
                    <Trash2 className="h-4 w-4" /> Delete task
                  </Button>
                  <Button onClick={() => setSheetTask(null)}>Close</Button>
                </div>
              </div>
            )}
          </Sheet>

          <AddTaskDialog
            addOpen={addOpen}
            setAddOpen={setAddOpen}
            addTask={addTask}
            jiraBaseUrl={jiraBaseUrl}
          />
          <JiraDialog
            jiraOpen={jiraOpen}
            setJiraOpen={setJiraOpen}
            jiraBaseUrl={jiraBaseUrl}
            setJiraBaseUrl={setJiraBaseUrl}
            setJiraConnected={setJiraConnected}
          />

          <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Drag tasks between columns (including <span className="font-medium">Blocked</span>). Data persists in your browser (localStorage). Now supports Dark Mode 🌙.
          </div>
        </div>
      </div>
    </div>
  );
}