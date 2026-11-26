export type Priority = "low" | "medium" | "high";

export type TaskStatus =
  | "todo"
  | "in_progress"
  | "done";

export interface Subject {
  id: string;
  name: string;
  lecturer: string;
  color: string;
}

export interface Schedule {
  id: string;
  subjectId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
}

export interface Task {
  id: string;
  subjectId: string | null;
  title: string;
  description: string;
  deadline: string;
  priority: Priority;
  status: TaskStatus;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  location: string;
}