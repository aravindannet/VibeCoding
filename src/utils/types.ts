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
  approvalStatus?: 'pending' | 'approved' | 'pending_review';
};

export interface ReasonCode {
  id: number;
  code: string;
  description: string;
  isHighValue: boolean;
}

export interface TaskComment {
  id: string;
  taskId: string;
  comment: string;
  user: string;
  timestamp: Date;
}

export interface TaskApproval {
  taskId: string;
  reasonCodes: number[];
  comment: string;
  status: 'approved' | 'pending_review';
  user: string;
  timestamp: Date;
}
