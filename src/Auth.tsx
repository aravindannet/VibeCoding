import React, { useState } from "react";
import { DEMO_KANBAN_IMAGE } from "./assets/kanban-demo-image";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import app from "./firebase";
import { AppUser, UserRole } from "./utils/types";
import { upsertUser, getUserByUid } from "./utils/api";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function Auth({ onAuth }: { onAuth: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");

  // Remove getRoleForUser, always fetch from backend

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      let userCred;
      if (mode === "login") {
        if (!email || !password) {
          setError("Email and password are required.");
          return;
        }
        userCred = await signInWithEmailAndPassword(auth, email, password);
        // Fetch user info (including role) from backend
        const userFromDb = await getUserByUid(userCred.user.uid);
        const appUser: AppUser = {
          uid: userFromDb.uid,
          displayName: userFromDb.displayName || userCred.user.displayName,
          email: userFromDb.email || userCred.user.email,
          role: userFromDb.role,
        };
        console.log('[Auth.tsx] Loaded user from DB (login):', userFromDb);
        await upsertUser(appUser); // Optionally keep this to sync displayName/email
        onAuth(appUser);
      } else {
        if (!name || !email || !password) {
          setError("Name, email, and password are required.");
          return;
        }
        const displayNameToSave = name.trim() !== '' ? name : 'User';
        userCred = await createUserWithEmailAndPassword(auth, email, password);
        // Set displayName after registration
        if (userCred.user) {
          await updateProfile(userCred.user, { displayName: displayNameToSave });
          await userCred.user.reload();
        }
        // Get the latest user info from Firebase
        const updatedUser = getAuth().currentUser;
        // Save user to backend with displayName
        const appUser: AppUser = {
          uid: updatedUser.uid,
          displayName: displayNameToSave,
          email: updatedUser.email,
          role: 'USR',
        };
        await upsertUser(appUser);
        onAuth(appUser);
      }
    } catch (err: any) {
      console.error('Registration or upsertUser error:', err);
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Fetch user info (including role) from backend
      const userFromDb = await getUserByUid(result.user.uid);
      const appUser: AppUser = {
        uid: userFromDb.uid,
        displayName: userFromDb.displayName || result.user.displayName,
        email: userFromDb.email || result.user.email,
        role: userFromDb.role,
      };
      console.log('[Auth.tsx] Loaded user from DB (google):', userFromDb);
      await upsertUser(appUser); // Optionally keep this to sync displayName/email
      onAuth(appUser);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-end bg-black">
      {/* Full-page blurred dark kanban image */}
      {/* Desk-unrolled, perspective, and left-to-right blur/fade effect */}
      <div
  className="fixed inset-0 w-full h-full z-0 pointer-events-none"
  style={{}}
      >
        {/* Main background image with frosted glass and vignette */}
        <img
          src={DEMO_KANBAN_IMAGE}
          alt="Kanban board demo"
          className="w-full h-full object-cover"
          style={{
            filter: 'blur(0.7px) brightness(1.08) saturate(1.15) drop-shadow(0 8px 32px rgba(31,38,135,0.10))',
            transition: 'opacity 1s',
            opacity: 1,
          }}
        />
        {/* Animated color overlay for a modern vibe */}
        <div
          className="absolute inset-0 pointer-events-none animate-bg-fade"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(99,102,241,0.18) 0%, rgba(168,85,247,0.10) 60%, rgba(0,0,0,0) 100%)',
            mixBlendMode: 'screen',
          }}
        />
        {/* Soft vignette for focus */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 120% 80% at 50% 60%, rgba(30,30,40,0.10) 60%, rgba(30,30,40,0.25) 100%)',
          }}
        />
      </div>
      <style>{`
        @keyframes bg-fade {
          0% { opacity: 0.85; }
          50% { opacity: 1; }
          100% { opacity: 0.85; }
        }
        .animate-bg-fade {
          animation: bg-fade 6s ease-in-out infinite;
        }
      `}</style>
      {/* Fade overlay toward the right (login form) */}
      <div className="fixed inset-0 w-full h-full z-10 pointer-events-none" style={{
        background: 'linear-gradient(90deg, rgba(20,20,30,0.85) 60%, rgba(20,20,30,0.45) 80%, rgba(20,20,30,0.0) 100%)'
      }} />
      {/* Login form floats on the right */}
      <div className="relative z-20 flex flex-1 items-center justify-end min-h-screen">
        <div className="w-full max-w-md mr-8 bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-2xl p-10 backdrop-blur-2xl border border-white/30 animate-fade-in-up" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}>
          <h2 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-200 text-center tracking-tight drop-shadow">Sign {mode === "login" ? "In" : "Up"}</h2>
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
            {mode === "register" && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100"
              required
            />
            <button
              type="submit"
              className="relative overflow-hidden rounded-xl py-2 font-semibold w-full group focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-lg"
              style={{ background: 'linear-gradient(90deg, #6366f1 0%, #a21caf 100%)' }}
            >
              <span className="relative z-10 text-white drop-shadow-lg">
                {mode === "login" ? "Sign In" : "Register"}
              </span>
              {/* Animated gradient shine */}
              <span
                className="absolute left-0 top-0 h-full w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.0) 100%)',
                  pointerEvents: 'none',
                  animation: 'shine 1.2s linear infinite',
                  maskImage: 'linear-gradient(120deg, transparent 60%, white 100%)',
                  WebkitMaskImage: 'linear-gradient(120deg, transparent 60%, white 100%)',
                }}
              />
            </button>
          </form>
          <button onClick={handleGoogle} className="mt-4 w-full bg-white border border-zinc-300 dark:border-zinc-700 rounded-xl py-2 font-semibold flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition shadow">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
            Continue with Google
          </button>
          <div className="mt-8 flex items-center justify-center w-full">
            <span className="text-zinc-500 dark:text-zinc-300 text-base font-medium select-none">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?
                  <button
                    className="ml-2 relative text-indigo-600 dark:text-indigo-300 font-bold transition-colors duration-200 focus:outline-none group"
                    onClick={() => setMode('register')}
                  >
                    <span className="inline-block pb-0.5 border-b-2 border-transparent group-hover:border-indigo-400 group-hover:text-indigo-400 transition-all duration-200">
                      Register
                    </span>
                  </button>
                </>
              ) : (
                <>
                  Already have an account?
                  <button
                    className="ml-2 relative text-indigo-600 dark:text-indigo-300 font-bold transition-colors duration-200 focus:outline-none group"
                    onClick={() => setMode('login')}
                  >
                    <span className="inline-block pb-0.5 border-b-2 border-transparent group-hover:border-indigo-400 group-hover:text-indigo-400 transition-all duration-200">
                      Sign In
                    </span>
                  </button>
                </>
              )}
            </span>
          </div>
          {error && <div className="mt-3 text-red-600 text-sm text-center font-semibold">{error}</div>}
        </div>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(.4,0,.2,1) both;
        }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
}
