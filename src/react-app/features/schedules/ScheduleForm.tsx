
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
  DAYS,
  hasScheduleConflict,
} from "@/lib/schedule";

import type {
  Schedule,
  Subject,
} from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (schedule: Schedule) => void;
  subjects: Subject[];
  schedules: Schedule[];
  selectedDay: number;
  initialData?: Schedule | null;
}

export default function ScheduleForm({
  open,
  onClose,
  onSave,
  subjects,
  schedules,
  selectedDay,
  initialData,
}: Props) {
  const [subjectId, setSubjectId] = useState(
    initialData?.subjectId ?? ""
  );

  const [dayOfWeek, setDayOfWeek] = useState(
    initialData?.dayOfWeek ?? selectedDay
  );

  const [startTime, setStartTime] = useState(
    initialData?.startTime ?? ""
  );

  const [endTime, setEndTime] = useState(
    initialData?.endTime ?? ""
  );

  const [room, setRoom] = useState(
    initialData?.room ?? ""
  );

  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!subjects.some((s) => s.id === subjectId)) {
      setError("Pilih mata kuliah terlebih dahulu.");
      return;
    }

    if (!startTime || !endTime) {
      setError("Jam mulai dan selesai wajib diisi.");
      return;
    }

    if (startTime >= endTime) {
      setError(
        "Jam selesai harus lebih besar dari jam mulai."
      );
      return;
    }

    if (!room.trim()) {
      setError("Ruangan wajib diisi.");
      return;
    }

    const schedule: Schedule = {
      id: initialData?.id ?? crypto.randomUUID(),
      subjectId,
      dayOfWeek,
      startTime,
      endTime,
      room: room.trim(),
    };

    if (hasScheduleConflict(schedule, schedules)) {
      setError(
        "Jadwal bentrok dengan mata kuliah lain."
      );
      return;
    }

    onSave(schedule);
    onClose();
  }

  const selectClass =
    "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Jadwal" : "Tambah Jadwal"}
          </DialogTitle>

          <DialogDescription>
            Atur informasi jadwal perkuliahan.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div className="space-y-2">
            <Label htmlFor="schedule-subject">
              Mata Kuliah
            </Label>

            <select
              id="schedule-subject"
              className={selectClass}
              value={subjectId}
              onChange={(e) =>
                setSubjectId(e.target.value)
              }
              required
            >
              <option value="">
                Pilih mata kuliah
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
            <Label htmlFor="schedule-day">
              Hari
            </Label>

            <select
              id="schedule-day"
              className={selectClass}
              value={dayOfWeek}
              onChange={(e) =>
                setDayOfWeek(Number(e.target.value))
              }
            >
              {DAYS.map((day) => (
                <option
                  key={day.value}
                  value={day.value}
                >
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="start-time">
                Jam Mulai
              </Label>

              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) =>
                  setStartTime(e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">
                Jam Selesai
              </Label>

              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) =>
                  setEndTime(e.target.value)
                }
                required
              />
            </div>

          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule-room">
              Ruangan
            </Label>

            <Input
              id="schedule-room"
              placeholder="Contoh: Lab Komputer"
              value={room}
              onChange={(e) =>
                setRoom(e.target.value)
              }
              required
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </div>
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
              Simpan Jadwal
            </Button>
          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
}
