import type { Schedule } from "@/types";

export const DAYS = [
  { value: 1, label: "Senin" },
  { value: 2, label: "Selasa" },
  { value: 3, label: "Rabu" },
  { value: 4, label: "Kamis" },
  { value: 5, label: "Jumat" },
  { value: 6, label: "Sabtu" },
  { value: 0, label: "Minggu" },
];

export function getTodayWIB(): number {
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  return [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ].indexOf(weekday);
}

export function getDayName(day: number) {
  return (
    DAYS.find((item) => item.value === day)?.label
    ?? "Tidak diketahui"
  );
}

export function hasScheduleConflict(
  candidate: Schedule,
  schedules: Schedule[]
): boolean {
  return schedules.some((schedule) => {
    if (schedule.id === candidate.id) {
      return false;
    }

    if (schedule.dayOfWeek !== candidate.dayOfWeek) {
      return false;
    }

    return (
      candidate.startTime < schedule.endTime &&
      candidate.endTime > schedule.startTime
    );
  });
}