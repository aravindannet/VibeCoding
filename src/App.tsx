import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Plus,
  Link as LinkIcon,
  ExternalLink,
  Search,
  PlugZap,
  Trash2,
  MoveRight,
  AlertTriangle,
  Loader2,
  Moon,
  Sun,
  User as UserIcon,
} from "lucide-react";



type Status = "todo" | "inprogress" | "blocker" | "done";
type Priority = "Low" | "Medium" | "High";
type Task = {
  id: string;
  name: string;
  owner?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  jiraKey?: string | null;
  jiraBaseUrl?: string | null;
  status: Status;
  priority?: Priority;
};

const baseBtn =
  "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm shadow-sm transition active:scale-[.98] border";
const Button = ({ className = "", children, ...props }: any) => (
  <button
    className={`${baseBtn} bg-zinc-100 border-zinc-300 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-700 ${className}`}
    {...props}
  >
    {children}
  </button>
);
const PrimaryButton = ({ className = "", children, ...props }: any) => (
  <button
    className={`${baseBtn} border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 dark:border-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 ${className}`}
    {...props}
  >
    {children}
  </button>
);
const Input = (props: any) => (
  <input
    {...props}
    className={`w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100 ${
      props.className || ""
    }`}
  />
);
const Textarea = (props: any) => (
  <textarea
    {...props}
    className={`w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100 ${
      props.className || ""
    }`}
  />
);
const Badge = ({ children, className = "", ...rest }: any) => (
  <span
    {...rest}
    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium dark:text-zinc-100 dark:border-zinc-600 ${className}`}
  >
    {children}
  </span>
);
const Card = ({ children, className = "", ...rest }: any) => (
  <div
    {...rest}
    className={`rounded-2xl border backdrop-blur-2xl p-4 shadow-2xl dark:bg-zinc-900/40 dark:border-zinc-700/40 dark:backdrop-blur-md ${className}`}
    style={{
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      border: '1px solid rgba(255,255,255,0.25)',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 60%, rgba(245,245,255,0.04) 100%)',
      backdropFilter: 'blur(24px)',
    }}
  >
    {children}
  </div>
);
const Sheet = ({ open, onClose, title, children }: any) => (
  <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
    <div
      className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    />
    <div
      className={`absolute right-0 top-0 h-full w-full max-w-md bg-white/30 backdrop-blur-md shadow-2xl transition-transform dark:bg-zinc-950/40 dark:backdrop-blur-md ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          border: '1px solid rgba(255,255,255,0.35)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.45) 60%, rgba(245,245,255,0.25) 100%)',
          backdropFilter: 'blur(18px)',
        }}
    >
      <div className="flex items-center justify-between border-b border-white/30 dark:border-zinc-800/40 p-4">
        <h3 className="text-lg font-semibold dark:text-zinc-100">{title}</h3>
        <Button onClick={onClose} className="!rounded-full px-2 py-1">✕</Button>
      </div>
      <div className="overflow-y-auto p-4">{children}</div>
    </div>
  </div>
);
const Dialog = ({ open, onClose, title, children }: any) => (
  <div className={`fixed inset-0 z-50 ${open ? "" : "hidden"}`}>
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="absolute left-1/2 top-1/2 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/30 backdrop-blur-md shadow-2xl dark:bg-zinc-950/40 dark:backdrop-blur-md"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          border: '1px solid rgba(255,255,255,0.35)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.45) 60%, rgba(245,245,255,0.25) 100%)',
          backdropFilter: 'blur(18px)',
        }}>
      <div className="flex items-center justify-between border-b border-white/30 dark:border-zinc-800/40 p-4">
        <h3 className="text-lg font-semibold dark:text-zinc-100">{title}</h3>
        <Button onClick={onClose} className="!rounded-full px-2 py-1">✕</Button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  </div>
);

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

function DroppableColumn({ id, children, className = "" }: any) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? "ring-2 ring-indigo-400" : ""}`}
    >
      {children}
    </div>
  );
}

function SortableTask({ task, onInspect, onDelete, dragOverlay = false }: any) {
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
}

function Column({ id, title, color, tasks, onInspect, onDelete }: any) {
  // Flip clock animation for count (applies to all columns)
  const count = tasks.length;
  return (
    <div className="flex h-full min-h-[460px] flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Only one status indicator per column */}
          <div
            className={`h-3 w-3 rounded-full ${id === "todo" ? "bg-zinc-400" : id === "inprogress" ? "bg-amber-500" : id === "done" ? "bg-emerald-500" : "bg-rose-500"}`}
          />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-700 dark:text-zinc-200">{title}</h3>
          <motion.div
            key={count}
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-300 font-extrabold text-4xl px-4 py-2 rounded-xl shadow-lg flex items-center justify-center"
            style={{ perspective: 400 }}
          >
            {count}
          </motion.div>
        </div>
      </div>
      <DroppableColumn id={id} className={`flex-1 rounded-2xl border border-dashed ${color} p-3 dark:border-zinc-700`}>
        <SortableContext items={tasks.map((t: Task) => t.id)} strategy={rectSortingStrategy}>
          {tasks.map((task: Task) => (
            <SortableTask key={task.id} task={task} onInspect={onInspect} onDelete={onDelete} />
          ))}
        </SortableContext>
      </DroppableColumn>
    </div>
  );
}

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

  function AddTaskDialog() {
    const [name, setName] = useState("");
    const [owner, setOwner] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [jiraKey, setJiraKey] = useState("");
    const [priority, setPriority] = useState<Priority>("Medium");

    const submit = (e: any) => {
      e.preventDefault();
      const id = uuidv4();
      addTask({ id, name, owner, description, startDate, endDate, jiraKey: jiraKey || null, jiraBaseUrl: jiraBaseUrl || null, status: "todo", priority });
      setAddOpen(false);
    };

    return (
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Add Task">
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Task name</label>
              <Input required placeholder="e.g., Implement login API" value={name} onChange={(e: any) => setName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Owner</label>
              <Input placeholder="e.g., Keerthana" value={owner} onChange={(e: any) => setOwner(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Description</label>
            <Textarea rows={3} placeholder="Optional details" value={description} onChange={(e: any) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Start date</label>
              <Input type="date" value={startDate} onChange={(e: any) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">End date</label>
              <Input type="date" value={endDate} onChange={(e: any) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Jira issue key (optional)</label>
              <Input placeholder="e.g., ABC-123" value={jiraKey} onChange={(e: any) => setJiraKey(e.target.value.toUpperCase())} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={() => setAddOpen(false)}>Cancel</Button>
            <PrimaryButton type="submit"><Plus className="h-4 w-4" /> Save Task</PrimaryButton>
          </div>
        </form>
      </Dialog>
    );
  }

  function JiraDialog() {
    const [base, setBase] = useState(jiraBaseUrl);
    const [token, setToken] = useState("");

    const save = (e: any) => {
      e.preventDefault();
      setJiraBaseUrl(base);
      setJiraConnected(true);
      setJiraOpen(false);
    };

    return (
      <Dialog open={jiraOpen} onClose={() => setJiraOpen(false)} title="Connect to Jira (demo)">
        <form onSubmit={save} className="space-y-3">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Store your Jira base URL so issue keys link out. API calls are mocked in this demo and not sent anywhere.</div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Jira base URL</label>
            <Input placeholder="https://your-domain.atlassian.net" value={base} onChange={(e: any) => setBase(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">API token (optional)</label>
            <Input placeholder="Stored locally only (demo)" value={token} onChange={(e: any) => setToken(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={() => setJiraOpen(false)}>Cancel</Button>
            <PrimaryButton type="submit"><PlugZap className="h-4 w-4" /> Save</PrimaryButton>
          </div>
        </form>
      </Dialog>
    );
  }

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

          <AddTaskDialog />
          <JiraDialog />

          <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Drag tasks between columns (including <span className="font-medium">Blocked</span>). Data persists in your browser (localStorage). Now supports Dark Mode 🌙.
          </div>
        </div>
      </div>
    </div>
  );
}