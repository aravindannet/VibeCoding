import { CalendarDays, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Status } from "./types";

export const COLUMNS = [
  {
    id: "todo",
    title: "Not Started",
    color: "bg-gradient-to-b from-indigo-50 via-violet-50 via-purple-50 to-sky-50 dark:from-indigo-900/40 dark:via-violet-900/40 dark:via-purple-900/40 dark:to-sky-900/40",
    icon: <CalendarDays className="h-4 w-4" />
  },
  {
    id: "inprogress",
    title: "In Progress",
    color: "bg-gradient-to-b from-amber-50 via-orange-50 via-yellow-50 to-blue-50 dark:from-amber-900/40 dark:via-orange-900/40 dark:via-yellow-900/40 dark:to-blue-900/40",
    icon: <Loader2 className="h-4 w-4 animate-spin-slow" />
  },
  {
    id: "blocker",
    title: "Blocked",
    color: "bg-gradient-to-b from-rose-50 via-pink-50 via-red-50 to-orange-50 dark:from-rose-900/40 dark:via-pink-900/40 dark:via-red-900/40 dark:to-orange-900/40",
    icon: <AlertTriangle className="h-4 w-4" />
  },
  {
    id: "done",
    title: "Done",
    color: "bg-gradient-to-b from-emerald-50 via-green-50 via-teal-50 to-cyan-50 dark:from-emerald-900/40 dark:via-green-900/40 dark:via-teal-900/40 dark:to-cyan-900/40",
    icon: <CheckCircle2 className="h-4 w-4" />
  },
] as const;

export type ColumnId = typeof COLUMNS[number]["id"];
