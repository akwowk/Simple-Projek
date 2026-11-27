
import { Hono } from "hono";
import { count } from "drizzle-orm";

import { createDb } from "./db";

import {
  subjects,
  schedules,
  tasks,
  events,
} from "./db/schema";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{
  Bindings: Bindings;
}>();


// ================================
// API HEALTH CHECK
// ================================

app.get("/api/health", (c) => {
  return c.json({
    success: true,
    message: "MyPlanner API is running",
    timestamp: new Date().toISOString(),
  });
});


// ================================
// DATABASE HEALTH CHECK
// ================================

app.get("/api/db/health", async (c) => {
  try {
    const db = createDb(c.env.DB);

    // Jalankan query untuk memastikan
    // koneksi database dan migration valid.
    await db
      .select({ total: count() })
      .from(subjects);

    return c.json({
      success: true,
      message: "Database connected successfully",
      database: "Cloudflare D1",
      orm: "Drizzle ORM",
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Database health error:", error);

    return c.json(
      {
        success: false,
        message: "Database connection failed",
      },
      500
    );
  }
});


// ================================
// DEVELOPMENT DATABASE TEST
// Hapus sebelum deployment publik.
// ================================

app.get("/api/db/test", async (c) => {
  try {
    const db = createDb(c.env.DB);

    const [
      subjectRows,
      scheduleRows,
      taskRows,
      eventRows,
    ] = await Promise.all([
      db.select({ total: count() }).from(subjects),
      db.select({ total: count() }).from(schedules),
      db.select({ total: count() }).from(tasks),
      db.select({ total: count() }).from(events),
    ]);

    return c.json({
      success: true,
      message: "Database query successful",

      data: {
        subjects: subjectRows[0]?.total ?? 0,
        schedules: scheduleRows[0]?.total ?? 0,
        tasks: taskRows[0]?.total ?? 0,
        events: eventRows[0]?.total ?? 0,
      },
    });

  } catch (error) {
    console.error("Database test error:", error);

    return c.json(
      {
        success: false,
        message: "Failed to query database",
      },
      500
    );
  }
});

export default app;
