
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../components/Button";

// Dynamic API URL: localhost for development, Render for production
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : (import.meta.env.VITE_API_URL || "https://vibecoding-wd29.onrender.com/api");

export default function AdminUserRoles({ currentUser, onClose }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const USERS_PER_PAGE = 8;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_URL}/users`);
        setUsers(res.data);
        setPage(1);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleRoleChange = async (uid, newRole) => {
    setSaving(true);
    setError("");
    try {
      await axios.put(`${API_URL}/users/${uid}/role`, { role: newRole });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.uid === uid ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError("Failed to update role");
    } finally {
      setSaving(false);
    }
  };

  // Filter and paginate users
  const filteredUsers = users.filter(
    u =>
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  // Render dialog
  return (
    <div
      className="relative max-w-3xl w-full mx-auto rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 60%, rgba(245,245,255,0.04) 100%)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        border: '1px solid rgba(255,255,255,0.25)',
        backdropFilter: 'blur(24px)',
  minHeight: '420px',
        maxHeight: '80vh',
      }}
    >
      {/* Close button provided by Dialog wrapper */}
      <style>{`
        input[type="text"]::-ms-clear,
        input[type="text"]::-webkit-clear-button,
        input[type="text"]::-webkit-search-cancel-button {
          display: none;
        }
      `}</style>
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 px-4 pt-4">
  <h2 className="text-lg font-bold text-indigo-700 dark:text-indigo-200 whitespace-nowrap">User Role Management</h2>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 w-64"
        />
      </div>
      <div className="overflow-x-auto min-h-[340px] w-full px-4 pb-4 flex-1">
        <table className="w-full min-w-[480px] max-w-full bg-transparent rounded-xl border-separate border-spacing-0">
          <thead>
            <tr className="bg-indigo-100/60 dark:bg-indigo-900/40">
              <th className="p-2 text-left font-semibold text-indigo-700 dark:text-indigo-200">Name</th>
              <th className="p-2 text-left font-semibold text-indigo-700 dark:text-indigo-200">Email</th>
              <th className="p-2 text-left font-semibold text-indigo-700 dark:text-indigo-200">Role</th>
              <th className="p-2 text-left font-semibold text-indigo-700 dark:text-indigo-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user.uid} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition">
                <td className="p-2 text-zinc-800 dark:text-zinc-100 font-medium">{user.displayName || <span className="italic text-zinc-400">-</span>}</td>
                <td className="p-2 text-zinc-600 dark:text-zinc-300">{user.email}</td>
                <td className="p-2 font-bold">
                  <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold ${user.role === 'CFG' ? 'bg-indigo-200 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200' : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-2">
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user.uid, e.target.value)}
                    disabled={saving || user.uid === currentUser.uid || user.email === 'aravindan.net@gmail.com'}
                    className="rounded-xl border border-indigo-200 dark:border-indigo-700 px-3 py-1 bg-white/80 dark:bg-zinc-900/80 text-indigo-700 dark:text-indigo-200 shadow focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
                  >
                    <option value="USR">User</option>
                    <option value="CFG">Admin</option>
                  </select>
                  {user.uid === currentUser.uid && <span className="ml-2 text-xs text-zinc-400">(You)</span>}
                  {/* Removed (Protected) text for aravindan.net@gmail.com */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2 pb-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg border bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-indigo-700 dark:text-indigo-200 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-lg border bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-indigo-700 dark:text-indigo-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      {saving && <div className="mt-4 text-indigo-600 text-center animate-pulse">Saving...</div>}
    </div>
  );
}
