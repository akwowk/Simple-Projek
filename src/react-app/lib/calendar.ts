
import type { EventInput } from "@fullcalendar/core";

import type {
  Schedule,
  Subject,
  Task,
  Event,
} from "@/types";

export type CalendarCategory =
  | "schedule"
  | "task"
  | "event";

export const CALENDAR_CATEGORIES = [
  {
    value: "schedule",
    label: "Mata Kuliah",
    color: "#2563eb",
  },
  {
    value: "task",
    label: "Deadline Tugas",
    color: "#d97706",
  },
  {
    value: "event",
    label: "Acara",
    color: "#9333ea",
  },
] as const;

export function buildCalendarEvents(
  schedules: Schedule[],
  subjects: Subject[],
  tasks: Task[],
  events: Event[]
): EventInput[] {
  const scheduleEvents: EventInput[] =
    schedules.map((schedule) => {
      const subject = subjects.find(
        (item) => item.id === schedule.subjectId
      );

      return {
        id: `schedule-${schedule.id}`,
        title: subject?.name ?? "Mata Kuliah",
        daysOfWeek: [schedule.dayOfWeek],
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        backgroundColor: "#2563eb",
        borderColor: "#2563eb",
        textColor: "#ffffff",
        allDay: false,
        extendedProps: {
          category: "schedule",
          description: subject?.lecturer ?? "",
          location: schedule.room,
          originalId: schedule.id,
        },
      };
    });

  const taskEvents: EventInput[] =
    tasks.map((task) => {
      const completed = task.status === "done";

      const subject = subjects.find(
        (item) => item.id === task.subjectId
      );

      return {
        id: `task-${task.id}`,
        title: `${completed ? "✓" : "Deadline:"} ${task.title}`,
        start: task.deadline,
        allDay: false,
        backgroundColor: completed
          ? "#64748b"
          : "#d97706",
        borderColor: completed
          ? "#64748b"
          : "#d97706",
        textColor: "#ffffff",
        extendedProps: {
          category: "task",
          description: task.description,
          subjectName: subject?.name ?? "Tugas umum",
          priority: task.priority,
          status: task.status,
          originalId: task.id,
        },
      };
    });

  const personalEvents: EventInput[] =
    events.map((event) => ({
      id: `event-${event.id}`,
      title: event.title,
      start: event.startAt,
      end: event.endAt,
      allDay: false,
      backgroundColor: "#9333ea",
      borderColor: "#9333ea",
      textColor: "#ffffff",
      extendedProps: {
        category: "event",
        description: event.description,
        location: event.location,
        originalId: event.id,
      },
    }));

  return [
    ...scheduleEvents,
    ...taskEvents,
    ...personalEvents,
  ];
}
