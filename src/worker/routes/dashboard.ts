
import { Hono } from "hono";

import {
  eq,
  ne,
  gt,
  lt,
  asc,
  and,
  count,
} from "drizzle-orm";

import {
  subjects,
  schedules,
  tasks,
  events,
} from "../db/schema";

import { success } from "../lib/response";

import {
  getTodayWIB,
  getDateWIB,
} from "../lib/date";

import type { AppEnv } from "../types";

const app = new Hono<AppEnv>();

app.get("/", async (c) => {
  const db = c.get("db");

  const currentDate = new Date();

  const now = currentDate.toISOString();
  const today = getTodayWIB(currentDate);

  const [
    todaySchedules,
    upcomingTasks,
    upcomingEvents,
    activeTaskCount,
    overdueTaskCount,
    upcomingEventCount,
  ] = await db.batch([
    // Today's schedules
    db
      .select({
        id: schedules.id,
        subjectId: schedules.subjectId,
        dayOfWeek: schedules.dayOfWeek,
        startTime: schedules.startTime,
        endTime: schedules.endTime,
        room: schedules.room,

        subjectName: subjects.name,
        lecturer: subjects.lecturer,
        color: subjects.color,
      })
      .from(schedules)
      .innerJoin(
        subjects,
        eq(
          schedules.subjectId,
          subjects.id
        )
      )
      .where(
        eq(schedules.dayOfWeek, today)
      )
      .orderBy(
        asc(schedules.startTime)
      ),

    // Nearest unfinished task deadlines
    db
      .select()
      .from(tasks)
      .where(
        ne(tasks.status, "done")
      )
      .orderBy(asc(tasks.deadline))
      .limit(5),

    // Upcoming events
    db
      .select()
      .from(events)
      .where(
        gt(events.startAt, now)
      )
      .orderBy(asc(events.startAt))
      .limit(5),

    // Active task count
    db
      .select({ total: count() })
      .from(tasks)
      .where(
        ne(tasks.status, "done")
      ),

    // Overdue task count
    db
      .select({ total: count() })
      .from(tasks)
      .where(
        and(
          ne(tasks.status, "done"),
          lt(tasks.deadline, now)
        )
      ),

    // Upcoming event count
    db
      .select({ total: count() })
      .from(events)
      .where(
        gt(events.startAt, now)
      ),
  ]);

  return c.json(
    success({
      date: getDateWIB(currentDate),
      timezone: "Asia/Jakarta",

      statistics: {
        todaySchedules:
          todaySchedules.length,

        activeTasks:
          activeTaskCount[0]?.total ?? 0,

        overdueTasks:
          overdueTaskCount[0]?.total ?? 0,

        upcomingEvents:
          upcomingEventCount[0]?.total ?? 0,
      },

      todaySchedules,
      upcomingTasks,
      upcomingEvents,
    })
  );
});

export default app;
