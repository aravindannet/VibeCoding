export type Status = "todo" | "inprogress" | "blocker" | "done";
export type Priority = "Low" | "Medium" | "High";
export type Task = {
  id: string;
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
};
