
import {
    BookOpen,
    ListTodo,
    CalendarDays,
    Clock,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { usePlanner } from "@/context/PlannerContext";
import { useNow } from "@/hooks/useNow";

import {
    isOverdue,
    getCountdown,
} from "@/lib/date";

import { AlertCircle } from "lucide-react";

export default function Dashboard() {
    const {
        schedules,
        subjects,
        tasks,
        events,
    } = usePlanner();

    const currentTime = useNow();
    const now = new Date(currentTime);

    const weekday = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        timeZone: "Asia/Jakarta",
    }).format(now);

    const today = [
        "Sun", "Mon", "Tue", "Wed",
        "Thu", "Fri", "Sat",
    ].indexOf(weekday);

    const todaySchedules = schedules
        .filter((item) => item.dayOfWeek === today)
        .sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
        );

    const activeTasks = tasks
        .filter((task) => task.status !== "done")
        .sort((a, b) =>
            Date.parse(a.deadline) - Date.parse(b.deadline)
        );

    const overdueTasks = activeTasks.filter(
        (task) =>
            isOverdue(task.deadline, currentTime)
    );

    const upcomingEvents = events
        .filter((event) =>
            Date.parse(event.startAt) >= now.getTime()
        )
        .sort((a, b) =>
            Date.parse(a.startAt) - Date.parse(b.startAt)
        );

    const statistics = [
        {
            title: "Matkul hari ini",
            value: todaySchedules.length,
            icon: BookOpen,
            color: "bg-blue-100 text-blue-700",
        },
        {
            title: "Tugas aktif",
            value: activeTasks.length,
            icon: ListTodo,
            color: "bg-amber-100 text-amber-700",
        },
        {
            title: "Acara mendatang",
            value: upcomingEvents.length,
            icon: CalendarDays,
            color: "bg-purple-100 text-purple-700",
        },
        {
            title: "Tugas terlambat",
            value: overdueTasks.length,
            icon: AlertCircle,
            color: "bg-red-100 text-red-700",
        },
    ];

    function formatDate(value: string) {
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Jakarta",
        }).format(new Date(value));
    }

    return (
        <div className="space-y-6">

            <section>
                <h1 className="text-2xl font-bold tracking-tight">
                    Personal Dashboard
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Kelola jadwal, tugas, dan aktivitasmu.
                </p>
            </section>

            {/* Statistics */}

            <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {statistics.map((item) => (
                    <Card key={item.title}>
                        <CardContent className="flex items-center gap-4 p-5">

                            <div className={`rounded-xl p-3 ${item.color}`}>
                                <item.icon size={24} />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {item.title}
                                </p>

                                <p className="text-3xl font-bold">
                                    {item.value}
                                </p>
                            </div>

                        </CardContent>
                    </Card>
                ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">

                {/* Today's Schedule */}

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Jadwal Hari Ini
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">

                        {todaySchedules.length === 0 && (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                Tidak ada jadwal hari ini.
                            </p>
                        )}

                        {todaySchedules.map((schedule) => {
                            const subject = subjects.find(
                                (item) => item.id === schedule.subjectId
                            );

                            return (
                                <div
                                    key={schedule.id}
                                    className="rounded-lg border-l-4 bg-muted/60 p-4"
                                    style={{
                                        borderLeftColor: subject?.color,
                                    }}
                                >
                                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">

                                        <Clock size={14} />

                                        {schedule.startTime} - {schedule.endTime}

                                    </div>

                                    <h3 className="font-semibold">
                                        {subject?.name}
                                    </h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {schedule.room}
                                    </p>
                                </div>
                            );
                        })}

                    </CardContent>
                </Card>

                {/* Upcoming Deadlines */}

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Deadline Terdekat
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">

                        {activeTasks.length === 0 && (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                Semua tugas sudah selesai.
                            </p>
                        )}

                        {activeTasks.slice(0, 5).map((task) => (
                            <div
                                key={task.id}
                                className="flex items-start justify-between gap-3 rounded-lg border p-4"
                            >
                                <div>
                                    <p className="font-medium">
                                        {task.title}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatDate(task.deadline)}
                                    </p>
                                    <p
                                        className={`mt-1 text-xs font-medium ${isOverdue(task.deadline, currentTime)
                                                ? "text-red-600"
                                                : "text-muted-foreground"
                                            }`}
                                    >
                                        {getCountdown(task.deadline, currentTime)}
                                    </p>
                                </div>

                                <Badge
                                    variant={
                                        task.priority === "high"
                                            ? "destructive"
                                            : "secondary"
                                    }
                                >
                                    {task.priority}
                                </Badge>

                            </div>
                        ))}

                    </CardContent>
                </Card>

            </section>

            {/* Upcoming Events */}

            <Card>
                <CardHeader>
                    <CardTitle>
                        Acara Mendatang
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-3 sm:grid-cols-2">

                    {upcomingEvents.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            Belum ada acara mendatang.
                        </p>
                    )}

                    {upcomingEvents.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-start gap-3 rounded-lg border p-4"
                        >
                            <div className="rounded-lg bg-primary/20 p-3">
                                <CalendarDays size={22} />
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    {event.title}
                                </h3>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {formatDate(event.startAt)}
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {event.location}
                                </p>
                            </div>

                        </div>
                    ))}

                </CardContent>
            </Card>

        </div>
    );
}
