
import { useState } from "react";

import {
  CalendarDays,
  CalendarCheck,
  BookOpen,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { usePlanner } from "@/context/PlannerContext";

import DaySelector from "@/features/schedules/DaySelector";
import ScheduleCard from "@/features/schedules/ScheduleCard";
import ScheduleForm from "@/features/schedules/ScheduleForm";
import SubjectForm from "@/features/schedules/SubjectForm";

import {
  getTodayWIB,
  getDayName,
} from "@/lib/schedule";

import type {
  Schedule as ScheduleType,
  Subject,
} from "@/types";

export default function Schedule() {
  const {
    schedules,
    setSchedules,
    subjects,
    setSubjects,
  } = usePlanner();

  const [selectedDay, setSelectedDay] = useState(
    getTodayWIB
  );

  const [scheduleFormOpen, setScheduleFormOpen] =
    useState(false);

  const [subjectFormOpen, setSubjectFormOpen] =
    useState(false);

  const [editingSchedule, setEditingSchedule] =
    useState<ScheduleType | null>(null);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const filteredSchedules = schedules
    .filter(
      (schedule) =>
        schedule.dayOfWeek === selectedDay
    )
    .sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

  const activeDays = new Set(
    schedules.map((schedule) => schedule.dayOfWeek)
  ).size;

  const statistics = [
    {
      title: "Total Jadwal",
      value: schedules.length,
      icon: CalendarDays,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Mata Kuliah",
      value: subjects.length,
      icon: BookOpen,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Hari Aktif",
      value: activeDays,
      icon: CalendarCheck,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  function handleAddSchedule() {
    setEditingSchedule(null);
    setScheduleFormOpen(true);
  }

  function handleEditSchedule(
    schedule: ScheduleType
  ) {
    setEditingSchedule(schedule);
    setScheduleFormOpen(true);
  }

  function handleSaveSchedule(
    schedule: ScheduleType
  ) {
    setSchedules((previous) => {
      const exists = previous.some(
        (item) => item.id === schedule.id
      );

      if (exists) {
        return previous.map((item) =>
          item.id === schedule.id
            ? schedule
            : item
        );
      }

      return [...previous, schedule];
    });

    setSelectedDay(schedule.dayOfWeek);
  }

  function handleSaveSubject(subject: Subject) {
    setSubjects((previous) => [
      ...previous,
      subject,
    ]);
  }

  function handleConfirmDelete() {
    if (!deleteId) return;

    setSchedules((previous) =>
      previous.filter(
        (schedule) => schedule.id !== deleteId
      )
    );

    setDeleteId(null);
  }

  return (
    <div className="space-y-6">

      {/* Page Heading */}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Jadwal Mata Kuliah
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Kelola jadwal perkuliahan mingguan.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          <Button
            variant="outline"
            onClick={() => setSubjectFormOpen(true)}
          >
            <BookOpen size={16} />
            Mata Kuliah
          </Button>

          <Button
            onClick={handleAddSchedule}
            disabled={subjects.length === 0}
          >
            <Plus size={16} />
            Tambah Jadwal
          </Button>

        </div>

      </section>

      {/* Statistics */}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-3">

        {statistics.map((item) => (
          <Card key={item.title}>
            <CardContent className="flex items-center gap-3 p-4">

              <div className={`rounded-xl p-3 ${item.color}`}>
                <item.icon size={22} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {item.title}
                </p>

                <p className="text-2xl font-bold">
                  {item.value}
                </p>
              </div>

            </CardContent>
          </Card>
        ))}

      </section>

      {/* Day Filter */}

      <DaySelector
        selectedDay={selectedDay}
        onChange={setSelectedDay}
        schedules={schedules}
      />

      {/* Schedule List */}

      <section className="space-y-4">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Jadwal Hari {getDayName(selectedDay)}
          </h2>

          <span className="text-sm text-muted-foreground">
            {filteredSchedules.length} kelas
          </span>
        </div>

        {filteredSchedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-card p-12 text-center">

            <div className="rounded-full bg-muted p-4">
              <CalendarCheck
                size={32}
                className="text-muted-foreground"
              />
            </div>

            <h3 className="font-semibold">
              Tidak ada jadwal
            </h3>

            <p className="text-sm text-muted-foreground">
              Belum ada mata kuliah pada hari{" "}
              {getDayName(selectedDay)}.
            </p>

            <Button
              variant="outline"
              onClick={handleAddSchedule}
              disabled={subjects.length === 0}
            >
              <Plus size={16} />
              Tambah Jadwal
            </Button>

          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">

            {filteredSchedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                subject={subjects.find(
                  (subject) =>
                    subject.id === schedule.subjectId
                )}
                onEdit={handleEditSchedule}
                onDelete={setDeleteId}
              />
            ))}

          </div>
        )}

      </section>

      {/* Add / Edit Schedule Dialog */}

      {scheduleFormOpen && (
        <ScheduleForm
          open={scheduleFormOpen}
          onClose={() => setScheduleFormOpen(false)}
          onSave={handleSaveSchedule}
          schedules={schedules}
          subjects={subjects}
          selectedDay={selectedDay}
          initialData={editingSchedule}
        />
      )}

      {/* Add Subject Dialog */}

      {subjectFormOpen && (
        <SubjectForm
          open={subjectFormOpen}
          onClose={() => setSubjectFormOpen(false)}
          onSave={handleSaveSubject}
          subjects={subjects}
        />
      )}

      {/* Delete Confirmation */}

      <Dialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">

          <DialogHeader>
            <DialogTitle>
              Hapus Jadwal?
            </DialogTitle>

            <DialogDescription>
              Jadwal ini akan dihapus dari daftar
              perkuliahan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
            >
              Batal
            </Button>

            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Hapus Jadwal
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

    </div>
  );
}
