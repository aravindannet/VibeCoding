import { useState, useEffect, useMemo } from "react";
// ...existing code...
import Auth from "./Auth";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { arrayMove } from "./utils/arrayMove";
// ...existing code...
import { fetchTasks, createTask, updateTask, deleteTask, addTaskComment } from "./utils/api";
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor, TouchSensor } from "@dnd-kit/core";
import SortableTask from "./components/SortableTask";
import { Status, Task, Priority, AppUser, UserRole } from "./utils/types";
// Kanban columns definition
const COLUMNS = [
  { id: "todo", title: "Not Started", color: "bg-zinc-100" },
  { id: "inprogress", title: "In Progress", color: "bg-amber-100" },
  { id: "blocker", title: "Blocked", color: "bg-rose-100" },
  { id: "done", title: "Done", color: "bg-emerald-100" },
] as const;
import AddTaskDialog from "./dialogs/AddTaskDialog";
import Dialog from "./dialogs/Dialog";
import ConfirmDialog from "./dialogs/ConfirmDialog";
import ProfileDialog from "./dialogs/ProfileDialog";
import Header from "./components/Header";
import ActiveFilters from "./components/ActiveFilters";
import TaskBoard from "./components/TaskBoard";
import { ExternalLink, Trash2, Plus, CalendarDays, Sun, Moon, Search, LogOut, Send, ArrowRight } from "lucide-react";
import { HeaderBar } from "./components/HeaderBarAndToolbar";
import Toolbar from "./components/Toolbar";
import Button from "./components/Button";
import PrimaryButton from "./components/PrimaryButton";
import TableView from "./components/TableView";
import Column from "./components/Column";
import Textarea from "./components/Textarea";
import Input from "./components/Input";


export default function App() {
  // State
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<'save' | 'delete' | null>(null);
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("kanban-dark");
    return saved ? saved === "1" : true;
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<'users' | 'date' | 'search' | null>(null);
  const [query, setQuery] = useState("");
  const [userFilter, setUserFilter] = useState<string[]>([]);
  const [sheetTask, setSheetTask] = useState<Task | null>(null);
  const [pendingTask, setPendingTask] = useState<Task | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // Drag state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [isDropAnimating, setIsDropAnimating] = useState(false);
  const activeTask = activeId ? tasks.find(t => (t._id || t.id) === activeId) : null;

  // Sensors: Enable both Pointer and Touch for desktop and mobile drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        tolerance: 5,
        delay: 150
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
  delay: 150,
        tolerance: 5
      }
    })
  );

  // Columns
  const columns = useMemo(() => {
          const byCol: Record<Status, Task[]> = { todo: [], inprogress: [], blocker: [], done: [] };
          tasks.filter((t) => {
            const passesUserFilter = userFilter.length === 0 || userFilter.includes(t.owner);
            const passesSearchFilter =
              query === "" || 
              t.name.toLowerCase().includes(query.toLowerCase()) ||
              (t.owner || "").toLowerCase().includes(query.toLowerCase());
            let passesDateFilter = !selectedDate;
            if (selectedDate) {
              if (!t.startDate && !t.endDate) {
                passesDateFilter = false;
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
            if (passesUserFilter && passesSearchFilter && passesDateFilter) {
              byCol[t.status].push(t);
            }
            return null;
          });
          return byCol;
  }, [tasks, userFilter, query, selectedDate]);

  // Unique users for filter dropdown
  const users = Array.from(new Set(tasks.map(t => t.owner).filter(Boolean)));

  const filteredColumns = COLUMNS.map((c) => ({ ...c, tasks: (columns as any)[c.id] as Task[] }));

  // Effects
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const res = await import('./utils/api');
          const { getUserByUid } = res;
          const userFromDb = await getUserByUid(firebaseUser.uid);
          setUser({
            uid: userFromDb.uid,
            displayName: userFromDb.displayName || firebaseUser.displayName,
            email: userFromDb.email || firebaseUser.email,
            role: userFromDb.role,
          });
        } catch (err) {
          setUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            role: firebaseUser.email === "aravindan.net@gmail.com" ? "CFG" : "USR",
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("kanban-dark", dark ? "1" : "0");
  }, [dark]);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks", err);
      }
    }
    loadTasks();
  }, []);

  // Handlers
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    setOverId(event.over?.id || null);
  };

  const handleDragEnd = async (event: any) => {
    setIsDropAnimating(true);
    setTimeout(() => {
      setActiveId(null);
      setOverId(null);
      setIsDropAnimating(false);
    }, 220);
    const { active, over } = event;
    if (!over) return;
    const activeTask = tasks.find((t) => (t._id || t.id) === active.id);
    if (!activeTask) return;
    const overId = over.id as string;
  const isColumn = (COLUMNS as any).some((c: any) => c.id === overId);
    // Build column-wise task lists (excluding the active task) so we can insert
    const colMap: Record<string, Task[]> = { todo: [], inprogress: [], blocker: [], done: [] } as any;
    tasks.forEach((t) => {
      const idKey = t._id || t.id;
      if (idKey === (activeTask._id || activeTask.id)) return; // skip active
      colMap[t.status || 'todo'].push(t);
    });

    let destColumn: Status | null = null;
    if (isColumn) {
      destColumn = overId as Status;
      // insert at end of that column — ensure we update the task's status in-memory
      colMap[destColumn].push({ ...(activeTask as Task), status: destColumn });
    } else {
      // Dropped over another task — insert before that task in its column
      const overTask = tasks.find((t) => (t._id || t.id) === overId);
      destColumn = (overTask?.status || activeTask.status) as Status;
      const list = colMap[destColumn] || [];
      const insertIndex = list.findIndex((t) => (t._id || t.id) === (overTask?._id || overTask?.id));
      if (insertIndex === -1) {
        // not found (rare) — append
        list.push({ ...(activeTask as Task), status: destColumn });
      } else {
        list.splice(insertIndex, 0, { ...(activeTask as Task), status: destColumn });
      }
      colMap[destColumn] = list;
    }

    // Reconstruct tasks array preserving column order
    const newTasks: Task[] = [];
    (COLUMNS as any).forEach((c: any) => {
      const key = c.id as Status;
      newTasks.push(...(colMap[key] || []));
    });

    setTasks(newTasks as Task[]);

    // If status changed, persist to backend
    if (destColumn && activeTask.status !== destColumn) {
      const updateId = activeTask._id || activeTask.id;
      if (!updateId) return;
      try {
        const updated = { ...activeTask, status: destColumn };
        const savedTask = await updateTask(updateId, updated);
        setTasks((prev) => prev.map((t) => ((t._id || t.id) === savedTask._id ? savedTask : t)));
      } catch (err) {
        console.error('Failed to move task:', err);
      }
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== id));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const addTask = async (task: Task) => {
    try {
      const { id, ...taskData } = task;
      const newTaskData = { status: 'todo', owner: user?.displayName || '', ...taskData };
      const newTask = await createTask(newTaskData);
      setTasks((prev) => [newTask, ...prev]);
      setUserFilter([]);
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      const updateId = updatedTask._id || updatedTask.id;
      if (!updateId) return;
      const savedTask = await updateTask(updateId, updatedTask);
      setTasks((prev) => prev.map((t) => ((t._id || t.id) === savedTask._id ? savedTask : t)));
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };


  if (!user) {
    return <Auth onAuth={setUser} />;
  }

  return (
    <div className={`${dark ? "dark" : ""}`}> 

  <div className="bg-gradient-to-b from-zinc-100 to-zinc-200 p-2 sm:p-4 md:p-6 dark:from-zinc-950 dark:to-zinc-900">
    <HeaderBar
        user={user}
        setAdminPanelOpen={setAdminPanelOpen}
        adminPanelOpen={adminPanelOpen}
        setProfileOpen={setProfileOpen}
        profileOpen={profileOpen}
        setUser={setUser}
        setTasks={setTasks}
        panelOpen={panelOpen}
        setPanelOpen={setPanelOpen}
        panelTab={panelTab}
        setPanelTab={setPanelTab}
        users={users}
        userFilter={userFilter}
        setUserFilter={setUserFilter}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        dark={dark}
        setDark={setDark}
      />
  <div className="min-h-screen pt-4 sm:pt-6 overflow-x-hidden">
        <div className="mx-auto max-w-7xl h-full flex flex-col"> 
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            {/* Logo and user info are now in the floating header, so this is empty for layout spacing */}
            <div />
            <Toolbar
              query={query}
              setQuery={setQuery}
              users={users}
              userFilter={userFilter}
              setUserFilter={setUserFilter}
              dark={dark}
              setDark={setDark}
              setAddOpen={setAddOpen}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setPanelOpen={setPanelOpen}
              setPanelTab={setPanelTab}
            />


          </div>

          {/* Active filters band */}
          {(userFilter.length > 0 || query || selectedDate) && (
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                {selectedDate && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="font-semibold text-indigo-700 dark:text-indigo-200">📅 Date:</span>
                    <span className="text-zinc-700 dark:text-zinc-100">{selectedDate}</span>
                  </div>
                )}
                {userFilter.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-indigo-700 dark:text-indigo-200 text-xs sm:text-sm">👥 Users:</span>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      {userFilter.map(user => (
                        <span key={user} className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-lg bg-indigo-100 dark:bg-indigo-800/50">
                          <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-indigo-500 text-white font-bold text-xs">
                            {user.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                          <span className="text-xs sm:text-sm text-indigo-700 dark:text-indigo-200">{user}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {query && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="font-semibold text-indigo-700 dark:text-indigo-200">🔍 Search:</span>
                    <span className="text-zinc-700 dark:text-zinc-100">"{query}"</span>
                  </div>
                )}
              </div>
              <Button 
                onClick={() => {
                  setSelectedDate("");
                  setQuery("");
                  setUserFilter([]);
                }}
                className="w-full sm:w-auto mt-2 sm:mt-0 shrink-0 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
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
                onDelete={(id) => setTasks(prev => prev.filter(t => (t._id || t.id) !== id))} 
              />
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 flex-1 overflow-x-auto pb-4"> 
                {filteredColumns.map((col: any) => ( 
                  <div key={col.id} className="flex flex-col min-w-[280px] sm:min-w-0"> 
                    <Column 
                      id={col.id} 
                      title={col.title} 
                      color={col.color} 
                      tasks={col.tasks} 
                      onInspect={setSheetTask} 
                      onDelete={(task) => {
                        setPendingTask(task);
                        setConfirmType('delete');
                        setConfirmOpen(true);
                      }}
                      onTaskUpdate={handleTaskUpdate}
                      hideTaskId={isDropAnimating ? activeId : null}
                      activeId={activeId}
                      overId={isDropAnimating ? null : overId}
                    /> 
                  </div> 
                ))} 
              </div> 
              <DragOverlay dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }}>
                {activeTask && (
                  <SortableTask
                    task={activeTask}
                    onInspect={() => {}}
                    onDelete={() => {}}
                    onUpdate={() => {}}
                    dragOverlay={true}
                  />
                )}
              </DragOverlay>
            </DndContext> 
          )}

          <Dialog open={!!sheetTask} onClose={() => setSheetTask(null)} title={sheetTask?.name || "Edit Task"}>
            {sheetTask && (
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Status</div>
                    <div className="mt-1">
                      <select
                        value={sheetTask.status}
                        onChange={(e) => {
                          const status = e.target.value as Status;
                          setTasks((prev) => prev.map((t) => ((t._id || t.id) === (sheetTask._id || sheetTask.id) ? { ...t, status } : t)));
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
                          setTasks((prev) => prev.map((t) => ((t._id || t.id) === (sheetTask._id || sheetTask.id) ? { ...t, priority } : t)));
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
                      setTasks((prev) => prev.map((t) => ((t._id || t.id) === (sheetTask._id || sheetTask.id) ? { ...t, owner } : t)));
                      setSheetTask((s: any) => ({ ...s, owner }));
                    }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Jira Issue Key</div>
                    <Input value={sheetTask.jiraKey || ""} onChange={(e: any) => {
                      const jiraKey = e.target.value.toUpperCase();
                      setTasks((prev) => prev.map((t) => ((t._id || t.id) === (sheetTask._id || sheetTask.id) ? { ...t, jiraKey } : t)));
                      setSheetTask((s: any) => ({ ...s, jiraKey }));
                    }} placeholder="e.g., ABC-123" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Start</div>
                    <Input type="date" value={sheetTask.startDate || ""} onChange={(e: any) => {
                      const startDate = e.target.value;
                      setTasks((prev) => prev.map((t) => ((t._id || t.id) === (sheetTask._id || sheetTask.id) ? { ...t, startDate } : t)));
                      setSheetTask((s: any) => ({ ...s, startDate }));
                    }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">End</div>
                    <Input type="date" value={sheetTask.endDate || ""} onChange={(e: any) => {
                      const endDate = e.target.value;
                      setTasks((prev) => prev.map((t) => ((t._id || t.id) === (sheetTask._id || sheetTask.id) ? { ...t, endDate } : t)));
                      setSheetTask((s: any) => ({ ...s, endDate }));
                    }} />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Description</div>
                  <Textarea rows={4} value={sheetTask.description || ""} onChange={(e: any) => {
                    const description = e.target.value;
                    setTasks((prev) => prev.map((t) => ((t._id || t.id) === (sheetTask._id || sheetTask.id) ? { ...t, description } : t)));
                    setSheetTask((s: any) => ({ ...s, description }));
                  }} />
                </div>

                {/* Comments & History */}
                <div>
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Add comment</div>
                  <div className="mt-2 relative">
                    <Textarea
                      placeholder="Write a comment..."
                      className="w-full pr-12 py-1.5 text-zinc-900 placeholder-zinc-500"
                      id="newCommentInput"
                      rows={2}
                      onKeyDown={async (e: any) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          const el: HTMLTextAreaElement | null = document.querySelector('#newCommentInput');
                          if (!el) return;
                          const text = el.value.trim();
                          if (!text) return;
                          try {
                            const payload = { author: user?.displayName || user?.email || 'Anon', text };
                            const newHistory = await addTaskComment(sheetTask._id || sheetTask.id, payload);
                            const updated = { ...(sheetTask as any) };
                            updated.history = [...(updated.history || []), { ...newHistory, createdAt: new Date(newHistory.createdAt).toISOString() }];
                            setTasks((prev) => prev.map((t) => ((t._id || t.id) === (updated._id || updated.id) ? updated : t)));
                            setSheetTask(updated);
                            el.value = '';
                          } catch (err) {
                            console.error('Failed to post comment', err);
                          }
                        }
                      }}
                    />
                    <Button
                      stopPropagation={true}
                      className="!rounded-none !bg-transparent !shadow-none !px-0 !py-0 !border-0 !border-transparent absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800 w-7 h-7 flex items-center justify-center focus:outline-none focus:ring-0 hover:!bg-transparent"
                      title="Send comment"
                      aria-label="Send comment"
                      onClick={async (e: any) => {
                        e.preventDefault();
                        const el: HTMLTextAreaElement | null = document.querySelector('#newCommentInput');
                        if (!el) return;
                        const text = el.value.trim();
                        if (!text) return;
                        try {
                          const payload = { author: user?.displayName || user?.email || 'Anon', text };
                          const newHistory = await addTaskComment(sheetTask._id || sheetTask.id, payload);
                          // refresh task locally: append history entry
                          const updated = { ...(sheetTask as any) };
                          updated.history = [...(updated.history || []), { ...newHistory, createdAt: new Date(newHistory.createdAt).toISOString() }];
                          setTasks((prev) => prev.map((t) => ((t._id || t.id) === (updated._id || updated.id) ? updated : t)));
                          setSheetTask(updated);
                          el.value = '';
                        } catch (err) {
                          console.error('Failed to post comment', err);
                        }
                      }}
                    >
                      <ArrowRight className="h-5 w-5 text-indigo-600 dark:text-white" />
                    </Button>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">History</div>
                    <div className="mt-2 space-y-2 max-h-36 overflow-auto history-scroll p-2 rounded-md bg-white/60 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-700/30 text-xs text-zinc-700 dark:text-zinc-300 shadow-sm" style={{backgroundClip: 'padding-box'}}>
                      {(sheetTask.history || []).length === 0 && <div>No history yet</div>}
                      {(sheetTask.history || []).map((h: any, i: number) => {
                        // If this history entry is a comment, render as: Name (first) \n comment text \n timestamp
                        if (h.action === 'comment') {
                          const author = (h.by || h.author || 'Anon') as string;
                          const firstName = author.split(' ').filter(Boolean)[0] || author;
                          const commentText = h.to || h.text || '';
                          const nextIsComment = (sheetTask.history || [])[i + 1]?.action === 'comment';
                          return (
                            <div key={i} className={`space-y-1 ${nextIsComment ? 'border-b border-zinc-200/30 dark:border-zinc-700/30 pb-2' : ''}`}>
                              <div className="font-medium">{firstName}</div>
                              <div className="text-zinc-700 dark:text-zinc-200 whitespace-pre-wrap">{commentText}</div>
                              <div className="text-zinc-600 dark:text-zinc-400 text-xs">{new Date(h.createdAt).toLocaleString()}</div>
                            </div>
                          );
                        }
                        return (
                          <div key={i}>
                            <div className="font-medium">{h.action}</div>
                            <div className="text-zinc-500">{h.by} {h.from ? `: ${h.from} → ${h.to}` : h.to}</div>
                            <div className="text-zinc-600 dark:text-zinc-400 text-xs">{new Date(h.createdAt).toLocaleString()}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-end gap-2">
                  <PrimaryButton type="button" onClick={() => {
                    setPendingTask(sheetTask);
                    setConfirmType('save');
                    setConfirmOpen(true);
                  }}>Save Task</PrimaryButton>
                </div>

                <div className="flex justify-between pt-2">
                  <Button type="button" onClick={() => {
                    setPendingTask(sheetTask);
                    setConfirmType('delete');
                    setConfirmOpen(true);
                  }} className="border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20">
                    <Trash2 className="h-4 w-4" /> Delete task
                  </Button>
                  <Button onClick={() => setSheetTask(null)}>Close</Button>
                </div>
              </form>
            )}
          </Dialog>

          <AddTaskDialog
            addOpen={addOpen}
            setAddOpen={setAddOpen}
            addTask={addTask}
            user={user}
          />

          <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Drag tasks between columns (including <span className="font-medium">Blocked</span>). Data persists in your browser (localStorage). Now supports Dark Mode 🌙.
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title={confirmType === 'delete' ? 'Delete Task?' : 'Save Task?'}
        message={confirmType === 'delete' ? 'Are you sure you want to delete this task? This action cannot be undone.' : 'Are you sure you want to save changes to this task?'}
        confirmLabel={confirmType === 'delete' ? 'Delete' : 'Save'}
        cancelLabel="Cancel"
        onCancel={() => { setConfirmOpen(false); setPendingTask(null); setConfirmType(null); }}
        onConfirm={async () => {
          setConfirmOpen(false);
          if (confirmType === 'delete' && pendingTask) {
            await onDelete(pendingTask._id || pendingTask.id);
            setSheetTask(null);
          } else if (confirmType === 'save' && pendingTask) {
            await handleTaskUpdate(pendingTask);
            setSheetTask(null);
          }
          setPendingTask(null);
          setConfirmType(null);
        }}
      />
    </div>
  </div>
  );
}