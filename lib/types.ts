export type User = {
  id: number;
  email: string;
  name: string;
};

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export type Lead = {
  id: number;
  user_id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  value: number;
  next_action: string;
  next_action_date: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type Task = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type GoalHorizon = "short" | "long";
export type GoalStatus = "active" | "achieved";

export type Goal = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  horizon: GoalHorizon;
  target_date: string | null;
  progress: number;
  status: GoalStatus;
  created_at: string;
};

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];
