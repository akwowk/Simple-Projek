
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import type { AppEnv } from "./types";

import { databaseMiddleware } from "./middleware/database";

import { success, failure } from "./lib/response";
import { ApiError } from "./lib/errors";
import { nowISO } from "./lib/date";

import subjectRoutes from "./routes/subjects";
import scheduleRoutes from "./routes/schedules";
import taskRoutes from "./routes/tasks";
import eventRoutes from "./routes/events";
import dashboardRoutes from "./routes/dashboard";
import calendarRoutes from "./routes/calendar";

import { bodyLimit } from "hono/body-limit";

import authRoutes from "./routes/auth";

import {
  authMiddleware,
} from "./middleware/auth";

import {
  csrfMiddleware,
} from "./middleware/csrf";

const app = new Hono<AppEnv>();


// ================================
// GLOBAL MIDDLEWARE
// ================================

app.use("/api/*", async (c, next) => {
  await next();

  c.header(
    "Cache-Control",
    "no-store"
  );

  c.header(
    "X-Content-Type-Options",
    "nosniff"
  );
});

app.use(
  "/api/*",
  databaseMiddleware
);

app.use(
  "/api/*",
  bodyLimit({
    maxSize: 32 * 1024,

    onError: (c) => {
      return c.json(
        failure(
          "Ukuran request terlalu besar",
          "PAYLOAD_TOO_LARGE"
        ),
        413
      );
    },
  })
);

app.use(
  "/api/*",
  csrfMiddleware
);


// ================================
// HEALTH CHECK
// ================================

app.get("/api/health", (c) => {
  return c.json(
    success(
      {
        name: "MyPlanner API",
        version: "0.2.0",
        timestamp: nowISO(),
      },
      "API is running"
    )
  );
});

app.route(
  "/api/auth",
  authRoutes
);

app.use("/api/*", async (c, next) => {
  const path = c.req.path;

  if (
    path === "/api/health" ||
    path === "/api/auth" ||
    path.startsWith("/api/auth/")
  ) {
    await next();
    return;
  }

  return authMiddleware(c, next);
});


// ================================
// REST API ROUTES
// ================================

app.route(
  "/api/subjects",
  subjectRoutes
);

app.route(
  "/api/schedules",
  scheduleRoutes
);

app.route(
  "/api/tasks",
  taskRoutes
);

app.route(
  "/api/events",
  eventRoutes
);

app.route(
  "/api/dashboard",
  dashboardRoutes
);

app.route(
  "/api/calendar",
  calendarRoutes
);


// ================================
// NOT FOUND
// ================================

app.notFound((c) => {
  return c.json(
    failure(
      "Endpoint tidak ditemukan",
      "NOT_FOUND"
    ),
    404
  );
});


// ================================
// GLOBAL ERROR HANDLER
// ================================

app.onError((error, c) => {
  if (error instanceof ApiError) {
    return c.json(
      failure(
        error.message,
        error.code
      ),
      error.status
    );
  }

  if (error instanceof HTTPException) {
    return c.json(
      failure(
        error.status >= 500
          ? "Terjadi kesalahan pada server"
          : "Request tidak valid",
        "HTTP_ERROR"
      ),
      error.status
    );
  }

  if (error instanceof SyntaxError) {
    return c.json(
      failure(
        "Format request tidak valid",
        "INVALID_REQUEST"
      ),
      400
    );
  }

  const messages: string[] = [];

  let current: unknown = error;

  for (
    let i = 0;
    i < 5 && current instanceof Error;
    i++
  ) {
    messages.push(current.message);
    current = current.cause;
  }

  const message = messages.join(" ");

  if (
    message.includes("SCHEDULE_CONFLICT")
  ) {
    return c.json(
      failure(
        "Jadwal bentrok dengan mata kuliah lain",
        "SCHEDULE_CONFLICT"
      ),
      409
    );
  }

  if (
    message.includes(
      "UNIQUE constraint failed"
    )
  ) {
    return c.json(
      failure(
        "Data sudah tersedia",
        "DUPLICATE_DATA"
      ),
      409
    );
  }

  if (
    message.includes(
      "FOREIGN KEY constraint failed"
    )
  ) {
    return c.json(
      failure(
        "Relasi data tidak valid",
        "INVALID_REFERENCE"
      ),
      409
    );
  }

  console.error(
    "Unhandled API error:",
    error
  );

  return c.json(
    failure(
      "Terjadi kesalahan pada server",
      "INTERNAL_SERVER_ERROR"
    ),
    500
  );
});

export default app;
