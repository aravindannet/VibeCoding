import Logo from "./Logo";
import AdminUserRoles from "../admin/AdminUserRoles";
import ProfileDialog from "../dialogs/ProfileDialog";
import { signOut, getAuth } from "firebase/auth";
import { LogOut, Search, CalendarDays, Sun, Moon, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Input from "./Input";
import UserFilterDropdown from "./UserFilterDropdown";
import PrimaryButton from "./PrimaryButton";

export function HeaderBar({ user, setAdminPanelOpen, adminPanelOpen, setProfileOpen, profileOpen, setUser, setTasks }) {
  return (
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
  );
}

export function Toolbar({ query, setQuery, users, userFilter, setUserFilter, dark, setDark, setAddOpen, selectedDate, setSelectedDate }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateBtnRef = useRef(null);
  const [tempDate, setTempDate] = useState(selectedDate || "");

  // Close popover on outside click
  function handleClickOutside(e) {
    if (dateBtnRef.current && !dateBtnRef.current.contains(e.target)) {
      setShowDatePicker(false);
    }
  }
  // Attach/detach listener
  useEffect(() => {
    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDatePicker]);

  return (
    <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
      <div className="relative flex-1 sm:flex-none">
        <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
        <Input placeholder="Search by task, owner, or JIRA key" className="pl-8 w-full" value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      <UserFilterDropdown users={users} selected={userFilter} setSelected={setUserFilter} />
      <div className="relative" ref={dateBtnRef}>
        <button
          className="p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-zinc-700 transition"
          onClick={() => setShowDatePicker(v => !v)}
          title="Filter by Date"
          type="button"
        >
          <CalendarDays className="h-6 w-6 text-blue-500" />
        </button>
        {showDatePicker && (
          <div className="absolute z-50 mt-2 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg p-3 flex flex-col items-center min-w-[180px]">
            <input
              type="date"
              value={tempDate}
              onChange={e => setTempDate(e.target.value)}
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-sm bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 mb-2"
            />
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded bg-indigo-500 text-white text-xs font-semibold hover:bg-indigo-600"
                onClick={() => {
                  setShowDatePicker(false);
                  setSelectedDate(tempDate);
                }}
                type="button"
              >Apply</button>
              <button
                className="px-3 py-1 rounded bg-zinc-200 text-zinc-700 text-xs font-semibold hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
                onClick={() => {
                  setShowDatePicker(false);
                  setTempDate("");
                  setSelectedDate("");
                }}
                type="button"
              >Clear</button>
            </div>
          </div>
        )}
      </div>
      <button
        className="p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-zinc-700 transition"
        onClick={() => setDark((d: boolean) => !d)}
        title="Toggle Dark Mode"
      >
        {dark ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6 text-zinc-700 dark:text-zinc-200" />}
      </button>
      <PrimaryButton onClick={() => setAddOpen(true)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4" /> Add Task
      </PrimaryButton>
    </div>
  );
}
// ...existing code...
