import React, { useEffect, useMemo, useState } from "react";
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { Status, Task, Priority } from "./utils/types";
import AddTaskDialog from "./dialogs/AddTaskDialog";
import JiraDialog from "./dialogs/JiraDialog";
import Sheet from "./dialogs/Sheet";
import Header from "./components/Header";
import ActiveFilters from "./components/ActiveFilters";
import TaskBoard from "./components/TaskBoard";
import { ExternalLink, Trash2, Plus, Sun, Moon, PlugZap, Search } from "lucide-react";
import Button from "./components/Button";
import PrimaryButton from "./components/PrimaryButton";
import Input from "./components/Input";
import Textarea from "./components/Textarea";
import Logo from "./components/Logo";
import TableView from "./components/TableView";
import FloatingDatePicker from "./components/FloatingDatePicker";
import UserFilterDropdown from "./components/UserFilterDropdown";
import Column from "./components/Column";

const COLUMNS = [
  { id: "todo", title: "Not Started", color: "bg-zinc-100" },
  { id: "inprogress", title: "In Progress", color: "bg-amber-100" },
  { id: "blocker", title: "Blocked", color: "bg-rose-100" },
  { id: "done", title: "Done", color: "bg-emerald-100" },
] as const;

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
  const [userFilter, setUserFilter] = useState<string[]>([]);
  const [sheetTask, setSheetTask] = useState<Task | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [jiraOpen, setJiraOpen] = useState(false);
  const [jiraBaseUrl, setJiraBaseUrl] = useState(() => localStorage.getItem("kanban-jira-base") || "");
  const [jiraConnected, setJiraConnected] = useState(() => !!localStorage.getItem("kanban-jira-base"));
  const [selectedDate, setSelectedDate] = useState("");

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        tolerance: 5,
        delay: 150
      }
    })
  );

  // Get unique users for filter dropdown
  const users = Array.from(new Set(tasks.map(t => t.owner).filter(Boolean)));

  const columns = useMemo(() => {
    const byCol: Record<Status, Task[]> = { todo: [], inprogress: [], blocker: [], done: [] };
    
    tasks.filter((t) => {
      // User filter
      const passesUserFilter = userFilter.length === 0 || userFilter.includes(t.owner);
      
      // Search query filter
      const passesSearchFilter = 
        query === "" || 
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        (t.jiraKey || "").toLowerCase().includes(query.toLowerCase()) ||
        (t.owner || "").toLowerCase().includes(query.toLowerCase());
      
      // Date filter
      let passesDateFilter = !selectedDate; // If no date selected, show everything
      if (selectedDate) {
        if (!t.startDate && !t.endDate) {
          passesDateFilter = false; // No dates on task, don't show when filtering by date
        } else {
          const selectDate = new Date(selectedDate);
          const startDate = t.startDate ? new Date(t.startDate) : null;
          const endDate = t.endDate ? new Date(t.endDate) : null;
          
          if (startDate && endDate) {
            passesDateFilter = selectDate >= startDate && selectDate <= endDate;
          } else if (startDate) {
            passesDateFilter = selectDate >= startDate;
          } else if (endDate) {
            passesDateFilter = selectDate <= endDate;
          }
        }
      }
      
      return passesUserFilter && passesSearchFilter && passesDateFilter;
    }).forEach((t) => byCol[t.status].push(t));
    
    return byCol;
  }, [tasks, query, userFilter, selectedDate]);

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
  const addTask = (task: Task) => {
    setTasks((prev) => [{ ...task }, ...prev]);
    setUserFilter([]);
  };
  
  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

// ...existing code...

  const filteredColumns = COLUMNS.map((c) => ({ ...c, tasks: (columns as any)[c.id] as Task[] }));

  return (
    <div className={`${dark ? "dark" : ""}`}> 
      <div className="h-screen overflow-hidden bg-gradient-to-b from-zinc-100 to-zinc-200 p-6 dark:from-zinc-950 dark:to-zinc-900">
        <div className="mx-auto max-w-7xl h-full flex flex-col"> 
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Logo />
            </div>
            <div className="flex items-center gap-2">
              <FloatingDatePicker
                selectedDate={selectedDate}
                onDateSelect={(date) => setSelectedDate(date)}
                onClear={() => setSelectedDate("")}
              />
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
                <Input placeholder="Search by task, owner, or JIRA key" className="pl-8" value={query} onChange={(e: any) => setQuery(e.target.value)} />
              </div>
              <UserFilterDropdown users={users} selected={userFilter} setSelected={setUserFilter} />
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

          {/* Active filters band */}
          {(userFilter.length > 0 || query || selectedDate) && (
            <div className="mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
              <div className="flex flex-wrap items-center gap-4">
                {selectedDate && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-indigo-700 dark:text-indigo-200">📅 Date:</span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-100">{selectedDate}</span>
                  </div>
                )}
                {userFilter.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-indigo-700 dark:text-indigo-200">👥 Users:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      {userFilter.map(user => (
                        <span key={user} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-800/50">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white font-bold text-xs">
                            {user.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                          <span className="text-sm text-indigo-700 dark:text-indigo-200">{user}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {query && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-indigo-700 dark:text-indigo-200">🔍 Search:</span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-100">"{query}"</span>
                  </div>
                )}
              </div>
              <Button 
                onClick={() => {
                  setSelectedDate("");
                  setQuery("");
                  setUserFilter([]);
                }}
                className="shrink-0 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
              >
                Reset All Filters
              </Button>
            </div>
          )}

          {(query || userFilter.length > 0 || selectedDate) ? (
            <div className="flex-1 overflow-y-auto px-1">
              <TableView
                tasks={Object.values(columns).flat()} 
                onInspect={setSheetTask} 
                onDelete={(id) => setTasks(prev => prev.filter(t => t.id !== id))} 
              />
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}> 
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 flex-1"> 
                {filteredColumns.map((col: any) => ( 
                  <div key={col.id} className="flex flex-col h-full"> 
                    <Column 
                      id={col.id} 
                      title={col.title} 
                      color={col.color} 
                      tasks={col.tasks} 
                      onInspect={setSheetTask} 
                      onDelete={(id: string) => setTasks(prev => prev.filter(t => t.id !== id))}
                      onTaskUpdate={handleTaskUpdate}
                    /> 
                  </div> 
                ))} 
              </div> 
              <DragOverlay /> 
            </DndContext> 
          )}

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