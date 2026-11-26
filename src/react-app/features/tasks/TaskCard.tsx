
import {
  CalendarDays,
  Clock,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  formatDateTime,
  getCountdown,
  isOverdue,
} from "@/lib/date";

import type {
  Task,
  Subject,
  TaskStatus,
} from "@/types";

interface Props {
  task: Task;
  subject?: Subject;
  now: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (
    id: string,
    status: TaskStatus
  ) => void;
}

const STATUS_LABELS = {
  todo: "Belum dikerjakan",
  in_progress: "Sedang dikerjakan",
  done: "Selesai",
};

const PRIORITY_LABELS = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
};

const PRIORITY_COLORS = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export default function TaskCard({
  task,
  subject,
  now,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  const completed = task.status === "done";

  const overdue =
    !completed && isOverdue(task.deadline, now);

  return (
    <article
      className={cn(
        "space-y-4 rounded-xl border bg-card p-4 sm:p-5",
        overdue && "border-red-400",
        completed && "opacity-75"
      )}
    >
      <div className="flex items-start gap-3">

        <button
          type="button"
          className="mt-1 shrink-0"
          aria-label={
            completed
              ? "Tandai belum selesai"
              : "Tandai selesai"
          }
          aria-pressed={completed}
          onClick={() =>
            onStatusChange(
              task.id,
              completed ? "todo" : "done"
            )
          }
        >
          {completed ? (
            <CheckCircle2
              size={22}
              className="text-emerald-600"
            />
          ) : (
            <Circle
              size={22}
              className="text-muted-foreground"
            />
          )}
        </button>

        <div className="min-w-0 flex-1 space-y-2">

          <h3
            className={cn(
              "break-words font-semibold",
              completed && "line-through"
            )}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen size={14} />

            {subject?.name ?? "Tugas umum"}
          </div>

        </div>

        <Badge className={PRIORITY_COLORS[task.priority]}>
          {PRIORITY_LABELS[task.priority]}
        </Badge>

      </div>

      <div className="space-y-2 rounded-lg bg-muted/50 p-3">

        <div className="flex items-center gap-2 text-sm">
          <CalendarDays size={16} />

          {formatDateTime(task.deadline)}
        </div>

        <div
          className={cn(
            "flex items-center gap-2 text-xs font-medium",
            overdue
              ? "text-red-600"
              : completed
                ? "text-emerald-600"
                : "text-muted-foreground"
          )}
        >
          <Clock size={14} />

          {completed
            ? "Tugas selesai"
            : getCountdown(task.deadline, now)}
        </div>

      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">

        <select
          aria-label="Status pengerjaan"
          className="rounded-md border bg-background px-2 py-2 text-xs"
          value={task.status}
          onChange={(e) =>
            onStatusChange(
              task.id,
              e.target.value as TaskStatus
            )
          }
        >
          {Object.entries(STATUS_LABELS).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            )
          )}
        </select>

        <div className="flex gap-1">

          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit tugas"
            onClick={() => onEdit(task)}
          >
            <Pencil size={16} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            aria-label="Hapus tugas"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 size={16} />
          </Button>

        </div>

      </div>

    </article>
  );
}
