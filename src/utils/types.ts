export type UserRole = "CFG" | "USR";
export type AppUser = {
  uid: string;
  displayName?: string;
  email?: string;
  role: UserRole;
};
export type Status = "todo" | "inprogress" | "blocker" | "done";
export type Priority = "Low" | "Medium" | "High";
export type Task = {
  id: string;
  _id?: string;
  name: string;
  owner?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  jiraKey?: string | null;
  jiraBaseUrl?: string | null;
  status: Status;
  priority?: Priority;
  reaction?: 'like' | 'dislike' | 'heart';
  comments?: { author?: string; text: string; createdAt?: string }[];
  history?: { type: string; by?: string; from?: string; to?: string; createdAt?: string }[];
};
