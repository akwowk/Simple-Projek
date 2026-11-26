
import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  toLocalInput,
  fromLocalInput,
} from "@/lib/date";

import type {
  Task,
  Subject,
  Priority,
  TaskStatus,
} from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  subjects: Subject[];
  initialData?: Task | null;
}

export default function TaskForm({
  open,
  onClose,
  onSave,
  subjects,
  initialData,
}: Props) {
  const [title, setTitle] = useState(
    initialData?.title ?? ""
  );

  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );

  const [subjectId, setSubjectId] = useState(
    initialData?.subjectId ?? ""
  );

  const [deadline, setDeadline] = useState(
    initialData
      ? toLocalInput(initialData.deadline)
      : ""
  );

  const [priority, setPriority] = useState<Priority>(
    initialData?.priority ?? "medium"
  );

  const [status, setStatus] = useState<TaskStatus>(
    initialData?.status ?? "todo"
  );

  const [error, setError] = useState("");

  const selectClass =
    "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";

  function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Judul tugas wajib diisi.");
      return;
    }

    if (!deadline) {
      setError("Deadline wajib diisi.");
      return;
    }

    if (
      subjectId &&
      !subjects.some((s) => s.id === subjectId)
    ) {
      setError("Mata kuliah tidak ditemukan.");
      return;
    }

    const parsedDeadline = Date.parse(
      `${deadline}:00+07:00`
    );

    if (Number.isNaN(parsedDeadline)) {
      setError("Deadline tidak valid.");
      return;
    }

    const task: Task = {
      id: initialData?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      subjectId: subjectId || null,
      deadline: fromLocalInput(deadline),
      priority,
      status,
    };

    onSave(task);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">

        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Tugas" : "Tambah Tugas"}
          </DialogTitle>

          <DialogDescription>
            Atur informasi dan deadline tugas.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div className="space-y-2">
            <Label htmlFor="task-title">
              Judul Tugas
            </Label>

            <Input
              id="task-title"
              placeholder="Contoh: Laporan praktikum"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
              maxLength={150}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-subject">
              Mata Kuliah
            </Label>

            <select
              id="task-subject"
              className={selectClass}
              value={subjectId}
              onChange={(e) =>
                setSubjectId(e.target.value)
              }
            >
              <option value="">
                Tugas umum / Tanpa mata kuliah
              </option>

              {subjects.map((subject) => (
                <option
                  key={subject.id}
                  value={subject.id}
                >
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">
              Deskripsi
            </Label>

            <textarea
              id="task-description"
              rows={3}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Catatan atau detail tugas..."
              className="w-full resize-y rounded-md border border-input bg-background p-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-deadline">
              Deadline (WIB)
            </Label>

            <Input
              id="task-deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) =>
                setDeadline(e.target.value)
              }
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="space-y-2">
              <Label htmlFor="task-priority">
                Prioritas
              </Label>

              <select
                id="task-priority"
                className={selectClass}
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as Priority)
                }
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-status">
                Status
              </Label>

              <select
                id="task-status"
                className={selectClass}
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as TaskStatus)
                }
              >
                <option value="todo">
                  Belum dikerjakan
                </option>

                <option value="in_progress">
                  Sedang dikerjakan
                </option>

                <option value="done">
                  Selesai
                </option>
              </select>
            </div>

          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Batal
            </Button>

            <Button type="submit">
              Simpan Tugas
            </Button>
          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
}
