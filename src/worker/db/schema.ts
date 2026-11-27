
import { sql } from "drizzle-orm";

import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/sqlite-core";

// Timestamp UTC dalam format ISO 8601.
const utcNow = sql`
  (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
`;


// ================================
// USERS
// ================================

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey().notNull(),

    email: text("email").notNull(),

    passwordHash:
      text("password_hash").notNull(),

    createdAt:
      text("created_at")
        .notNull()
        .default(utcNow),

    updatedAt:
      text("updated_at")
        .notNull()
        .default(utcNow),
  },
  (table) => [
    uniqueIndex("users_email_idx")
      .on(table.email),
  ]
);


// ================================
// SESSIONS
// ================================

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey().notNull(),

    userId:
      text("user_id")
        .notNull()
        .references(() => users.id, {
          onDelete: "cascade",
        }),

    tokenHash:
      text("token_hash").notNull(),

    expiresAt:
      text("expires_at").notNull(),

    createdAt:
      text("created_at")
        .notNull()
        .default(utcNow),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_idx")
      .on(table.tokenHash),

    index("sessions_user_id_idx")
      .on(table.userId),

    index("sessions_expires_at_idx")
      .on(table.expiresAt),
  ]
);


// ================================
// SUBJECTS
// ================================

export const subjects = sqliteTable(
  "subjects",
  {
    id: text("id").primaryKey().notNull(),

    name: text("name").notNull(),

    lecturer:
      text("lecturer").notNull(),

    color:
      text("color")
        .notNull()
        .default("#3b82f6"),

    createdAt:
      text("created_at")
        .notNull()
        .default(utcNow),

    updatedAt:
      text("updated_at")
        .notNull()
        .default(utcNow),
  },
  (table) => [
    uniqueIndex("subjects_name_idx")
      .on(sql`lower(trim(${table.name}))`),
  ]
);


// ================================
// SCHEDULES
// ================================

export const schedules = sqliteTable(
  "schedules",
  {
    id: text("id").primaryKey().notNull(),

    subjectId:
      text("subject_id")
        .notNull()
        .references(() => subjects.id, {
          onDelete: "cascade",
        }),

    dayOfWeek:
      integer("day_of_week").notNull(),

    startTime:
      text("start_time").notNull(),

    endTime:
      text("end_time").notNull(),

    room:
      text("room").notNull(),

    createdAt:
      text("created_at")
        .notNull()
        .default(utcNow),

    updatedAt:
      text("updated_at")
        .notNull()
        .default(utcNow),
  },
  (table) => [
    index("schedules_subject_id_idx")
      .on(table.subjectId),

    index("schedules_day_time_idx")
      .on(
        table.dayOfWeek,
        table.startTime
      ),

    check(
      "schedules_valid_day",
      sql`${table.dayOfWeek} BETWEEN 0 AND 6`
    ),

    check(
      "schedules_valid_time",
      sql`${table.startTime} < ${table.endTime}`
    ),

    uniqueIndex("schedules_unique_idx")
      .on(
        table.subjectId,
        table.dayOfWeek,
        table.startTime,
        table.endTime
      ),
  ]
);


// ================================
// TASKS
// ================================

export const tasks = sqliteTable(
  "tasks",
  {
    id: text("id").primaryKey().notNull(),

    subjectId:
      text("subject_id")
        .references(() => subjects.id, {
          onDelete: "set null",
        }),

    title: text("title").notNull(),

    description:
      text("description")
        .notNull()
        .default(""),

    deadline:
      text("deadline").notNull(),

    priority:
      text("priority", {
        enum: ["low", "medium", "high"],
      })
        .notNull()
        .default("medium"),

    status:
      text("status", {
        enum: [
          "todo",
          "in_progress",
          "done",
        ],
      })
        .notNull()
        .default("todo"),

    createdAt:
      text("created_at")
        .notNull()
        .default(utcNow),

    updatedAt:
      text("updated_at")
        .notNull()
        .default(utcNow),
  },
  (table) => [
    index("tasks_subject_id_idx")
      .on(table.subjectId),

    index("tasks_deadline_idx")
      .on(table.deadline),

    index("tasks_status_deadline_idx")
      .on(
        table.status,
        table.deadline
      ),

    check(
      "tasks_valid_priority",
      sql`${table.priority} IN ('low', 'medium', 'high')`
    ),

    check(
      "tasks_valid_status",
      sql`${table.status} IN ('todo', 'in_progress', 'done')`
    ),
  ]
);


// ================================
// EVENTS
// ================================

export const events = sqliteTable(
  "events",
  {
    id: text("id").primaryKey().notNull(),

    title:
      text("title").notNull(),

    description:
      text("description")
        .notNull()
        .default(""),

    startAt:
      text("start_at").notNull(),

    endAt:
      text("end_at").notNull(),

    location:
      text("location")
        .notNull()
        .default(""),

    createdAt:
      text("created_at")
        .notNull()
        .default(utcNow),

    updatedAt:
      text("updated_at")
        .notNull()
        .default(utcNow),
  },
  (table) => [
    index("events_start_at_idx")
      .on(table.startAt),

    index("events_end_at_idx")
      .on(table.endAt),

    check(
      "events_valid_time",
      sql`${table.startAt} < ${table.endAt}`
    ),
  ]
);


// ================================
// REMINDERS
// ================================

export const reminders = sqliteTable(
  "reminders",
  {
    id: text("id").primaryKey().notNull(),

    targetType:
      text("target_type", {
        enum: [
          "schedule",
          "task",
          "event",
        ],
      }).notNull(),

    targetId:
      text("target_id").notNull(),

    remindAt:
      text("remind_at").notNull(),

    sentAt:
      text("sent_at"),

    status:
      text("status", {
        enum: [
          "pending",
          "processing",
          "sent",
          "failed",
          "cancelled",
        ],
      })
        .notNull()
        .default("pending"),

    attempts:
      integer("attempts")
        .notNull()
        .default(0),

    lastError:
      text("last_error"),

    createdAt:
      text("created_at")
        .notNull()
        .default(utcNow),

    updatedAt:
      text("updated_at")
        .notNull()
        .default(utcNow),
  },
  (table) => [
    index("reminders_status_time_idx")
      .on(
        table.status,
        table.remindAt
      ),

    index("reminders_target_idx")
      .on(
        table.targetType,
        table.targetId
      ),

    uniqueIndex("reminders_unique_idx")
      .on(
        table.targetType,
        table.targetId,
        table.remindAt
      ),

    check(
      "reminders_valid_target",
      sql`${table.targetType} IN ('schedule', 'task', 'event')`
    ),

    check(
      "reminders_valid_status",
      sql`${table.status} IN ('pending', 'processing', 'sent', 'failed', 'cancelled')`
    ),

    check(
      "reminders_valid_attempts",
      sql`${table.attempts} >= 0`
    ),
  ]
);


// ================================
// INFERRED TYPES
// ================================

export type UserRow =
  typeof users.$inferSelect;

export type NewUser =
  typeof users.$inferInsert;

export type SessionRow =
  typeof sessions.$inferSelect;

export type SubjectRow =
  typeof subjects.$inferSelect;

export type NewSubject =
  typeof subjects.$inferInsert;

export type ScheduleRow =
  typeof schedules.$inferSelect;

export type NewSchedule =
  typeof schedules.$inferInsert;

export type TaskRow =
  typeof tasks.$inferSelect;

export type NewTask =
  typeof tasks.$inferInsert;

export type EventRow =
  typeof events.$inferSelect;

export type NewEvent =
  typeof events.$inferInsert;

export type ReminderRow =
  typeof reminders.$inferSelect;

export type NewReminder =
  typeof reminders.$inferInsert;
