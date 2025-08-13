import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";

export default function ProfileDialog({ user, open, onClose, onProfileUpdate }) {
  const [name, setName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const auth = getAuth();
      await updateProfile(auth.currentUser, { displayName: name });
      await auth.currentUser.reload();
      onProfileUpdate({ ...auth.currentUser });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white rounded-xl py-2 font-semibold hover:bg-indigo-700 transition">
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
        {error && <div className="mt-2 text-red-600 text-sm text-center">{error}</div>}
        <button onClick={onClose} className="mt-4 w-full text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200">Cancel</button>
      </div>
    </div>
  );
}
