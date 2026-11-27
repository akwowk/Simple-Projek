
import { Hono } from "hono";
import { asc } from "drizzle-orm";

import {
  subjects,
  schedules,
  tasks,
  events,
} from "../db/schema";

import { success } from "../lib/response";
import type { AppEnv } from "../types";

const app = new Hono<AppEnv>();

app.get("/", async (c) => {
  const db = c.get("db");

  const [
    subjectRows,
    scheduleRows,
    taskRows,
    eventRows,
  ] = await db.batch([
    db
      .select()
      .from(subjects)
      .orderBy(asc(subjects.name)),

    db
      .select()
      .from(schedules)
      .orderBy(
        asc(schedules.dayOfWeek),
        asc(schedules.startTime)
      ),

    db
      .select()
      .from(tasks)
      .orderBy(asc(tasks.deadline)),

    db
      .select()
      .from(events)
      .orderBy(asc(events.startAt)),
  ]);

  return c.json(
    success({
      subjects: subjectRows,
      schedules: scheduleRows,
      tasks: taskRows,
      events: eventRows,
    })
  );
});

export default app;
