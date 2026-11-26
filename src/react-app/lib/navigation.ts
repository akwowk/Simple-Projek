import {
  LayoutDashboard,
  BookOpen,
  ListTodo,
  CalendarDays,
  CalendarRange,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Jadwal Matkul",
    path: "/schedule",
    icon: BookOpen,
  },
  {
    title: "Daftar Tugas",
    path: "/tasks",
    icon: ListTodo,
  },
  {
    title: "Daftar Acara",
    path: "/events",
    icon: CalendarDays,
  },
  {
    title: "Kalender",
    path: "/calendar",
    icon: CalendarRange,
  },
  {
    title: "Pengaturan",
    path: "/settings",
    icon: Settings,
  },
];