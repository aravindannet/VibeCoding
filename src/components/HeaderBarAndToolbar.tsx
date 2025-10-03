import Logo from "./Logo";
import AdminUserRoles from "../admin/AdminUserRoles";
import Dialog from "../dialogs/Dialog";
import ProfileDialog from "../dialogs/ProfileDialog";
import { signOut, getAuth } from "firebase/auth";
import { LogOut, Search, CalendarDays, Sun, Moon, Plus, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Input from "./Input";
import UserFilterDropdown from "./UserFilterDropdown";
import PrimaryButton from "./PrimaryButton";
import Toolbar from "./Toolbar";
import ToolbarPanel from "./ToolbarPanel";

export function HeaderBar({
  user,
  setAdminPanelOpen,
  adminPanelOpen,
  setProfileOpen,
  profileOpen,
  setUser,
  setTasks,
  // forwarded toolbar props (optional)
  panelOpen,
  setPanelOpen,
  panelTab,
  setPanelTab,
  query,
  setQuery,
  users,
  userFilter,
  setUserFilter,
  dark,
  setDark,
  setAddOpen,
  selectedDate,
  setSelectedDate,
}: any) {

  return (
  <div className="w-full px-4 py-3">
    <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
    <Logo />
      <span className="flex items-center gap-2 px-3 py-1 text-zinc-700 dark:text-zinc-100 font-semibold text-base min-w-0 overflow-hidden">
        {user?.role === 'CFG' && (
          <button
            onClick={() => setAdminPanelOpen(true)}
            title="Manage User Roles"
            className="ml-1 p-1 rounded-full transition hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/40 dark:border-zinc-700/40"
          >
            <Plus className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
          </button>
        )}
        {adminPanelOpen && user?.role === 'CFG' && (
          <Dialog open={adminPanelOpen} onClose={() => setAdminPanelOpen(false)} maxWidth="40rem">
            <AdminUserRoles currentUser={user} onClose={() => setAdminPanelOpen(false)} />
          </Dialog>
        )}
        <span className="truncate max-w-[140px] sm:max-w-none">
          {user?.displayName && user.displayName.trim() !== '' ? user.displayName : (user?.email || 'Account')}
        </span>
        <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold text-indigo-700 dark:text-indigo-200">
          {user?.role === 'CFG' ? 'CFG' : user?.role === 'USR' ? 'User' : user?.role}
        </span>
        <button
          onClick={() => setProfileOpen(true)}
          title="Edit Profile"
          className="ml-1 p-1 rounded-full transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <User className="h-5 w-5 text-zinc-500 dark:text-zinc-300" />
        </button>
        <button
          onClick={() => setDark && setDark(!dark)}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={dark}
          className="ml-1 p-1 rounded-full transition"
        >
          {dark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-zinc-500" />}
        </button>
        <button
          onClick={() => signOut(getAuth())}
          title="Sign Out"
          className="ml-1 p-1 rounded-full transition"
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
      <ToolbarPanel
        open={panelOpen}
        onClose={() => { setPanelOpen(false); }}
        defaultTab={panelTab}
        query={query}
        setQuery={setQuery}
        users={users}
        userFilter={userFilter}
        setUserFilter={setUserFilter}
        setAddOpen={setAddOpen}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      </div>
    </div>
  );
}

// Note: Desktop toolbar rendered by separate `Toolbar` component file.
