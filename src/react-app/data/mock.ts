import type {
  Subject,
  Schedule,
  Task,
  Event,
} from "@/types";

const todayWIB = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const today = new Date(`${todayWIB}T00:00:00+07:00`);

function futureDate(days: number) {
  return new Date(
    Date.now() + days * 86400000
  ).toISOString();
}

const dayOfWeek = new Date(
  `${todayWIB}T12:00:00Z`
).getUTCDay();

export const subjects: Subject[] = [
  {
    id: "1",
    name: "Jaringan Komputer",
    lecturer: "Dosen Jaringan",
    color: "#3b82f6",
  },
  {
    id: "2",
    name: "Pemrograman Web",
    lecturer: "Dosen Pemrograman",
    color: "#16a34a",
  },
  {
    id: "3",
    name: "Metode Penelitian",
    lecturer: "Dosen Penelitian",
    color: "#9333ea",
  },
];

export const schedules: Schedule[] = [
  {
    id: "1",
    subjectId: "1",
    dayOfWeek,
    startTime: "08:00",
    endTime: "10:00",
    room: "302",
  },
  {
    id: "2",
    subjectId: "2",
    dayOfWeek,
    startTime: "13:00",
    endTime: "15:00",
    room: "Lab Komputer",
  },
];

export const tasks: Task[] = [
  {
    id: "1",
    subjectId: "3",
    title: "Laporan penelitian AI",
    description: "Menyelesaikan hasil dan pembahasan.",
    deadline: futureDate(1),
    priority: "high",
    status: "todo",
  },
  {
    id: "2",
    subjectId: "1",
    title: "Konfigurasi Inter-VLAN",
    description: "Praktik menggunakan Packet Tracer.",
    deadline: futureDate(3),
    priority: "medium",
    status: "in_progress",
  },
  {
    id: "3",
    subjectId: "2",
    title: "Website sederhana",
    description: "Membuat tampilan website responsive.",
    deadline: futureDate(5),
    priority: "low",
    status: "todo",
  },
];

const eventStart = new Date(
  today.getTime() + 2 * 86400000 + 19 * 3600000
);

export const events: Event[] = [
  {
    id: "1",
    title: "Rapat kelompok",
    description: "Membahas tugas kelompok.",
    startAt: eventStart.toISOString(),
    endAt: new Date(
      eventStart.getTime() + 3600000
    ).toISOString(),
    location: "Online",
  },
];