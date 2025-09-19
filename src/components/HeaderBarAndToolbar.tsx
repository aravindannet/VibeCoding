import Logo from "./Logo";
import AdminUserRoles from "../admin/AdminUserRoles";
import ProfileDialog from "../dialogs/ProfileDialog";
import { signOut, getAuth } from "firebase/auth";
import { LogOut, Search, CalendarDays, Sun, Moon, Plus } from "lucide-react";
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
  const [panelOpen, setPanelOpen] = useState(false);

  return (
  <div className="w-full px-4 py-3">
    <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
    <Logo />
      <span className="flex items-center gap-2 px-3 py-1 text-zinc-700 dark:text-zinc-100 font-semibold text-base min-w-0 overflow-hidden">
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
        <span className="truncate max-w-[140px] sm:max-w-none">
          {user?.displayName && user.displayName.trim() !== '' ? user.displayName : (user?.email || 'Account')}
        </span>
        <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold text-indigo-700 dark:text-indigo-200">
          {user?.role === 'CFG' ? 'CFG' : user?.role === 'USR' ? 'User' : user?.role}
        </span>
        <button
          onClick={() => setProfileOpen(true)}
          title="Edit Profile"
          className="ml-1 p-1 rounded-full transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3zm-2 6h12" /></svg>
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
        onClose={() => setPanelOpen(false)}
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
