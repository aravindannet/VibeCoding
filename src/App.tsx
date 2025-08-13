import { useState, useEffect, useMemo } from "react";
// ...existing code...
import Auth from "./Auth";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { arrayMove } from "./utils/arrayMove";
// ...existing code...
import { fetchTasks, createTask, updateTask, deleteTask } from "./utils/api";
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import SortableTask from "./components/SortableTask";
import { Status, Task, Priority, AppUser, UserRole } from "./utils/types";
import AddTaskDialog from "./dialogs/AddTaskDialog";
import JiraDialog from "./dialogs/JiraDialog";
import Dialog from "./dialogs/Dialog";
import ConfirmDialog from "./dialogs/ConfirmDialog";
import ProfileDialog from "./dialogs/ProfileDialog";
import Header from "./components/Header";
import ActiveFilters from "./components/ActiveFilters";
import TaskBoard from "./components/TaskBoard";
import { ExternalLink, Trash2, Plus, Sun, Moon, PlugZap, Search, LogOut } from "lucide-react";
import Button from "./components/Button";
import PrimaryButton from "./components/PrimaryButton";
import Input from "./components/Input";
import Textarea from "./components/Textarea";
import Logo from "./components/Logo";
import TableView from "./components/TableView";
import FloatingDatePicker from "./components/FloatingDatePicker";
import UserFilterDropdown from "./components/UserFilterDropdown";
import Column from "./components/Column";
import AdminUserRoles from "./admin/AdminUserRoles";

const COLUMNS = [
  { id: "todo", title: "Not Started", color: "bg-zinc-100" },
  { id: "inprogress", title: "In Progress", color: "bg-amber-100" },
  { id: "blocker", title: "Blocked", color: "bg-rose-100" },
  { id: "done", title: "Done", color: "bg-emerald-100" },
] as const;

export default function App() {
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<'save' | 'delete' | null>(null);
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("kanban-dark");
    return saved ? saved === "1" : true; // default to dark
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [userFilter, setUserFilter] = useState<string[]>([]);
  const [sheetTask, setSheetTask] = useState<Task | null>(null);
  const [pendingTask, setPendingTask] = useState<Task | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [jiraOpen, setJiraOpen] = useState(false);
  const [jiraBaseUrl, setJiraBaseUrl] = useState(() => localStorage.getItem("kanban-jira-base") || "");
  const [jiraConnected, setJiraConnected] = useState(() => !!localStorage.getItem("kanban-jira-base"));
  const [selectedDate, setSelectedDate] = useState("");

  // Listen for auth state changes
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user info (including role) from backend
          const res = await import('./utils/api');
          const { getUserByUid } = res;
          const userFromDb = await getUserByUid(firebaseUser.uid);
          console.log('[App.tsx] Loaded user from DB:', userFromDb);
          setUser({
            uid: userFromDb.uid,
            displayName: userFromDb.displayName || firebaseUser.displayName,
            email: userFromDb.email || firebaseUser.email,
            role: userFromDb.role,
          });
        } catch (err) {
          // fallback: set user with default role if backend fails
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

  // Load tasks from backend on mount
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

  // Drag state for overlay
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [isDropAnimating, setIsDropAnimating] = useState(false);
  const activeTask = activeId ? tasks.find(t => (t._id || t.id) === activeId) : null;

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
    }).forEach((t) => {
      if (byCol[t.status]) {
        byCol[t.status].push(t);
      }
    });
    
    return byCol;
  }, [tasks, query, userFilter, selectedDate]);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    setOverId(event.active.id);
    setIsDropAnimating(false);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    setOverId(over.id);
    if (active.id === over.id) return;
    setTasks((prev) => {
      const activeIndex = prev.findIndex((t) => (t._id || t.id) === active.id);
      const overIndex = prev.findIndex((t) => (t._id || t.id) === over.id);
      if (activeIndex === -1 || overIndex === -1) return prev;
      const activeTask = prev[activeIndex];
      const overTask = prev[overIndex];
      if (!activeTask || !overTask) return prev;
      // If dragging within the same column
      if (activeTask.status === overTask.status) {
        // Only reorder within the same column
        const columnTasks = prev.filter(t => t.status === activeTask.status);
        const columnTaskIds = columnTasks.map(t => t._id || t.id);
        const oldColIndex = columnTaskIds.indexOf(active.id);
        const newColIndex = columnTaskIds.indexOf(over.id);
        if (oldColIndex === -1 || newColIndex === -1) return prev;
        const newColumnTasks = arrayMove(columnTasks, oldColIndex, newColIndex);
        // Replace the column in the full tasks array
        let result = prev.map(t => t.status === activeTask.status ? newColumnTasks.shift()! : t);
        return result;
      } else {
        // Dragging to a new column: remove from source, insert into target column at hovered position
        const sourceCol = activeTask.status;
        const targetCol = overTask.status;
        const newActiveTask = { ...activeTask, status: targetCol };
        // Remove from source
        const newTasks = prev.filter(t => (t._id || t.id) !== active.id);
        // Find where to insert in target column
        let insertIdx = newTasks.findIndex((t, idx) => t.status === targetCol && (t._id || t.id) === over.id);
        if (insertIdx === -1) insertIdx = newTasks.length;
        // Insert into newTasks
        const before = newTasks.slice(0, insertIdx);
        const after = newTasks.slice(insertIdx);
        return [...before, newActiveTask, ...after];
      }
    });
  };

  const handleDragEnd = async (event: any) => {
    setIsDropAnimating(true);
    setTimeout(() => {
      setActiveId(null);
      setOverId(null);
      setIsDropAnimating(false);
    }, 220); // match dropAnimation duration
    const { active, over } = event;
    if (!over) return;
    const activeTask = tasks.find((t) => (t._id || t.id) === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    const isColumn = (COLUMNS as any).some((c: any) => c.id === overId);
    let destColumn: Status | null = null;
    if (isColumn) destColumn = overId as Status;
    else {
      const overTask = tasks.find((t) => (t._id || t.id) === overId);
      destColumn = (overTask?.status || activeTask.status) as Status;
    }

    if (destColumn && activeTask.status !== destColumn) {
      // Optimistically update UI
      const updateId = activeTask._id || activeTask.id;
      if (!updateId) {
        console.warn('Skipping update: task has no _id or id', activeTask);
        return;
      }
      setTasks((prev) => prev.map((t) => ((t._id || t.id) === updateId ? { ...t, status: destColumn } : t)));
      // Update backend in background
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
      // Remove id before sending to backend
      const { id, ...taskData } = task;
      // Ensure status is set to 'todo' if not present
      // Set owner to current user's displayName if not provided
      const newTaskData = { status: 'todo', owner: user.displayName || '', ...taskData };
      const newTask = await createTask(newTaskData);
      console.log('Backend response for new task:', newTask);
      setTasks((prev) => [newTask, ...prev]);
      setUserFilter([]);
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      const updateId = updatedTask._id || updatedTask.id;
      if (!updateId) {
        console.warn('Skipping update: task has no _id or id', updatedTask);
        return;
      }
      const savedTask = await updateTask(updateId, updatedTask);
      setTasks((prev) => prev.map((t) => ((t._id || t.id) === savedTask._id ? savedTask : t)));
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const filteredColumns = COLUMNS.map((c) => ({ ...c, tasks: (columns as any)[c.id] as Task[] }));

  if (!user) {
    return <Auth onAuth={setUser} />;
  }

  return (
    <div className={`${dark ? "dark" : ""}`}> 
      {/* Header: Logo, displayName, sign out icon */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
        <Logo />
  <span className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/70 dark:bg-zinc-800/70 shadow text-zinc-700 dark:text-zinc-100 font-semibold text-base">
          {user?.role === 'CFG' && (
            <button
              onClick={() => setAdminPanelOpen(true)}
              title="Manage User Roles"
              className="ml-1 p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-zinc-700 transition border border-indigo-200 dark:border-indigo-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          )}
      {adminPanelOpen && user?.role === 'CFG' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-4 max-w-2xl w-full relative">
            <button
              onClick={() => setAdminPanelOpen(false)}
              className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-xl"
              title="Close"
            >
              &times;
            </button>
            <AdminUserRoles currentUser={user} onClose={() => setAdminPanelOpen(false)} />
          </div>
        </div>
      )}
          {user?.displayName && user.displayName.trim() !== '' ? user.displayName : (user?.email || 'Account')}
          <span className="ml-2 px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700">
            {user?.role === 'CFG' ? 'CFG' : user?.role === 'USR' ? 'User' : user?.role}
          </span>
          <button
            onClick={() => setProfileOpen(true)}
            title="Edit Profile"
            className="ml-1 p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-zinc-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3zm-2 6h12" /></svg>
          </button>
          <button
            onClick={() => signOut(getAuth())}
            title="Sign Out"
            className="ml-1 p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
          >
            <LogOut className="h-5 w-5 text-zinc-500 dark:text-zinc-300" />
          </button>
        </span>
        <ProfileDialog
          user={user}
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          onProfileUpdate={(updatedUser) => {
            setUser(updatedUser);
            setTasks(prev => prev.map(t => t.owner === user.displayName ? { ...t, owner: updatedUser.displayName } : t));
          }}
        />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-200 p-2 sm:p-4 md:p-6 dark:from-zinc-950 dark:to-zinc-900 overflow-x-hidden">
        <div className="mx-auto max-w-7xl h-full flex flex-col"> 
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            {/* Logo and user info are now in the floating header, so this is empty for layout spacing */}
            <div />
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
                <FloatingDatePicker
                  selectedDate={selectedDate}
                  onDateSelect={(date) => setSelectedDate(date)}
                  onClear={() => setSelectedDate("")}
                />
                <div className="relative flex-1 sm:flex-none">
                  <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input placeholder="Search by task, owner, or JIRA key" className="pl-8 w-full" value={query} onChange={(e: any) => setQuery(e.target.value)} />
                </div>
                <UserFilterDropdown users={users} selected={userFilter} setSelected={setUserFilter} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={() => setDark((d: boolean) => !d)}>
                  {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="hidden sm:inline">{dark ? "Light" : "Dark"} mode</span>
                </Button>
                <Button onClick={() => setJiraOpen(true)} className={`${jiraConnected ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-700" : ""}`}>
                  <PlugZap className="h-4 w-4" /> 
                  <span className="hidden sm:inline">{jiraConnected ? "Jira Connected" : "Connect Jira"}</span>
                </Button>
                <PrimaryButton onClick={() => setAddOpen(true)} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4" /> Add Task
                </PrimaryButton>
              </div>
            </div>
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
                    <PrimaryButton type="button" onClick={() => {
                      setPendingTask(sheetTask);
                      setConfirmType('save');
                      setConfirmOpen(true);
                    }}>Save Task</PrimaryButton>
                  </div>
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
            jiraBaseUrl={jiraBaseUrl}
            user={user}
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
  );
}