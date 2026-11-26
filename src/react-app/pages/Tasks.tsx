
import { useState } from "react";

import {
  Plus,
  Search,
  ListTodo,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import StatCard from "@/components/shared/StatCard";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

import TaskCard from "@/features/tasks/TaskCard";
import TaskForm from "@/features/tasks/TaskForm";

import { usePlanner } from "@/context/PlannerContext";
import { useNow } from "@/hooks/useNow";
import { isOverdue } from "@/lib/date";

import type {
  Task,
  TaskStatus,
  Priority,
} from "@/types";

type StatusFilter =
  | "all"
  | "overdue"
  | TaskStatus;

export default function Tasks() {
  const {
    tasks,
    setTasks,
    subjects,
  } = usePlanner();

  const now = useNow();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [priorityFilter, setPriorityFilter] =
    useState<Priority | "all">("all");

  const [subjectFilter, setSubjectFilter] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("deadline");

  const [formOpen, setFormOpen] = useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const completed = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;

  const overdue = tasks.filter(
    (task) =>
      task.status !== "done" &&
      isOverdue(task.deadline, now)
  ).length;

  const priorityOrder = {
    high: 0,
    medium: 1,
    low: 2,
  };

  const filteredTasks = tasks
    .filter((task) => {
      const subjectName =
        subjects.find(
          (s) => s.id === task.subjectId
        )?.name ?? "";

      const matchesSearch =
        `${task.title} ${task.description} ${subjectName}`
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (
          statusFilter === "overdue"
            ? task.status !== "done" &&
              isOverdue(task.deadline, now)
            : task.status === statusFilter
        );

      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;

      const matchesSubject =
        subjectFilter === "all" ||
        (
          subjectFilter === "none"
            ? task.subjectId === null
            : task.subjectId === subjectFilter
        );

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesSubject
      );
    })
    .sort((a, b) => {
      // Tugas selesai selalu ditempatkan terakhir.
      if (
        (a.status === "done") !==
        (b.status === "done")
      ) {
        return a.status === "done" ? 1 : -1;
      }

      if (sortBy === "priority") {
        return (
          priorityOrder[a.priority] -
          priorityOrder[b.priority] ||
          Date.parse(a.deadline) -
          Date.parse(b.deadline)
        );
      }

      if (sortBy === "title") {
        return a.title.localeCompare(b.title, "id");
      }

      return (
        Date.parse(a.deadline) -
        Date.parse(b.deadline)
      );
    });

  function handleAdd() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  function handleSave(task: Task) {
    setTasks((previous) => {
      const exists = previous.some(
        (item) => item.id === task.id
      );

      return exists
        ? previous.map((item) =>
            item.id === task.id ? task : item
          )
        : [...previous, task];
    });
  }

  function handleStatusChange(
    id: string,
    status: TaskStatus
  ) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, status }
          : task
      )
    );
  }

  function handleDelete() {
    if (!deleteId) return;

    setTasks((previous) =>
      previous.filter(
        (task) => task.id !== deleteId
      )
    );

    setDeleteId(null);
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSubjectFilter("all");
    setSortBy("deadline");
  }

  const filterClass =
    "h-10 rounded-md border border-input bg-background px-3 text-sm";

  return (
    <div className="space-y-6">

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Daftar Tugas
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Kelola tugas dan deadline perkuliahan.
          </p>
        </div>

        <Button onClick={handleAdd}>
          <Plus size={16} />
          Tambah Tugas
        </Button>

      </section>

      {/* Statistics */}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">

        <StatCard
          title="Total Tugas"
          value={tasks.length}
          icon={<ListTodo size={22} />}
          color="bg-blue-100 text-blue-700"
        />

        <StatCard
          title="Dalam Proses"
          value={inProgress}
          icon={<Clock size={22} />}
          color="bg-amber-100 text-amber-700"
        />

        <StatCard
          title="Selesai"
          value={completed}
          icon={<CheckCircle2 size={22} />}
          color="bg-emerald-100 text-emerald-700"
        />

        <StatCard
          title="Terlambat"
          value={overdue}
          icon={<AlertCircle size={22} />}
          color="bg-red-100 text-red-700"
        />

      </section>

      {/* Search and Filters */}

      <section className="space-y-3 rounded-xl border bg-card p-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            className="pl-10"
            placeholder="Cari judul atau mata kuliah..."
            aria-label="Cari tugas"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">

          <select
            aria-label="Filter status"
            className={filterClass}
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as StatusFilter
              )
            }
          >
            <option value="all">Semua status</option>
            <option value="todo">Belum dikerjakan</option>
            <option value="in_progress">Dalam proses</option>
            <option value="done">Selesai</option>
            <option value="overdue">Terlambat</option>
          </select>

          <select
            aria-label="Filter mata kuliah"
            className={filterClass}
            value={subjectFilter}
            onChange={(e) =>
              setSubjectFilter(e.target.value)
            }
          >
            <option value="all">Semua mata kuliah</option>
            <option value="none">Tugas umum</option>

            {subjects.map((subject) => (
              <option
                key={subject.id}
                value={subject.id}
              >
                {subject.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter prioritas"
            className={filterClass}
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value as Priority | "all"
              )
            }
          >
            <option value="all">Semua prioritas</option>
            <option value="high">Prioritas tinggi</option>
            <option value="medium">Prioritas sedang</option>
            <option value="low">Prioritas rendah</option>
          </select>

          <select
            aria-label="Urutkan tugas"
            className={filterClass}
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <option value="deadline">Deadline terdekat</option>
            <option value="priority">Prioritas tertinggi</option>
            <option value="title">Judul A-Z</option>
          </select>

        </div>

        <div className="flex items-center justify-between gap-2">

          <p className="text-xs text-muted-foreground">
            Menampilkan {filteredTasks.length} dari{" "}
            {tasks.length} tugas
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
          >
            Reset Filter
          </Button>

        </div>

      </section>

      {/* Tasks List */}

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<ListTodo size={32} />}
          title="Tidak ada tugas"
          description="Belum ada tugas atau tidak ditemukan tugas yang sesuai dengan filter."
          action={
            <Button
              variant="outline"
              onClick={
                tasks.length ? resetFilters : handleAdd
              }
            >
              {tasks.length
                ? "Reset Filter"
                : "Tambah Tugas"}
            </Button>
          }
        />
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">

          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              subject={subjects.find(
                (s) => s.id === task.subjectId
              )}
              now={now}
              onEdit={handleEdit}
              onDelete={setDeleteId}
              onStatusChange={handleStatusChange}
            />
          ))}

        </section>
      )}

      {formOpen && (
        <TaskForm
          open={formOpen}
          subjects={subjects}
          initialData={editingTask}
          onSave={handleSave}
          onClose={() => setFormOpen(false)}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus Tugas?"
        description="Tugas ini akan dihapus dari daftar tugas."
        confirmLabel="Hapus Tugas"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

    </div>
  );
}
