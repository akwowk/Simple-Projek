
import { Hono } from "hono";

import {
  eq,
  ne,
  asc,
  and,
  lt,
  type SQL,
} from "drizzle-orm";

import { zValidator } from "@hono/zod-validator";

import {
  tasks,
  subjects,
} from "../db/schema";

import {
  createTaskSchema,
  updateTaskSchema,
} from "../schemas/task";

import {
  prioritySchema,
  statusSchema,
} from "../schemas/common";

import { success, failure } from "../lib/response";
import { ApiError } from "../lib/errors";
import { nowISO } from "../lib/date";

import type { Database } from "../db";
import type { AppEnv } from "../types";

const app = new Hono<AppEnv>();


async function ensureSubjectExists(
  db: Database,
  subjectId?: string | null
) {
  if (!subjectId) return;

  const [subject] = await db
    .select({ id: subjects.id })
    .from(subjects)
    .where(eq(subjects.id, subjectId))
    .limit(1);

  if (!subject) {
    throw new ApiError(
      404,
      "Mata kuliah tidak ditemukan",
      "SUBJECT_NOT_FOUND"
    );
  }
}


// GET ALL TASKS

app.get("/", async (c) => {
  const db = c.get("db");

  const status = c.req.query("status");
  const priority = c.req.query("priority");
  const subjectId = c.req.query("subjectId");

  const conditions: SQL[] = [];

  if (status === "overdue") {
    conditions.push(
      ne(tasks.status, "done"),
      lt(tasks.deadline, nowISO())
    );

  } else if (status !== undefined) {
    const result =
      statusSchema.safeParse(status);

    if (!result.success) {
      throw new ApiError(
        400,
        "Status tugas tidak valid",
        "INVALID_STATUS"
      );
    }

    conditions.push(
      eq(tasks.status, result.data)
    );
  }

  if (priority !== undefined) {
    const result =
      prioritySchema.safeParse(priority);

    if (!result.success) {
      throw new ApiError(
        400,
        "Prioritas tidak valid",
        "INVALID_PRIORITY"
      );
    }

    conditions.push(
      eq(tasks.priority, result.data)
    );
  }

  if (subjectId !== undefined) {
    conditions.push(
      eq(tasks.subjectId, subjectId)
    );
  }

  const result = await db
    .select()
    .from(tasks)
    .where(
      conditions.length
        ? and(...conditions)
        : undefined
    )
    .orderBy(asc(tasks.deadline));

  return c.json(success(result));
});


// GET TASK BY ID

app.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const [task] = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, id))
    .limit(1);

  if (!task) {
    throw new ApiError(
      404,
      "Tugas tidak ditemukan",
      "TASK_NOT_FOUND"
    );
  }

  return c.json(success(task));
});


// CREATE TASK

app.post(
  "/",

  zValidator(
    "json",
    createTaskSchema,
    (result, c) => {
      if (!result.success) {
        return c.json(
          failure(
            "Validasi gagal",
            "VALIDATION_ERROR",
            result.error.issues
          ),
          400
        );
      }
    }
  ),

  async (c) => {
    const db = c.get("db");
    const data = c.req.valid("json");

    await ensureSubjectExists(
      db,
      data.subjectId
    );

    const [created] = await db
      .insert(tasks)
      .values({
        id: crypto.randomUUID(),

        subjectId:
          data.subjectId ?? null,

        title: data.title,

        description:
          data.description ?? "",

        deadline: data.deadline,

        priority:
          data.priority ?? "medium",

        status:
          data.status ?? "todo",
      })
      .returning();

    return c.json(
      success(
        created,
        "Tugas berhasil ditambahkan"
      ),
      201
    );
  }
);


// UPDATE TASK

app.patch(
  "/:id",

  zValidator(
    "json",
    updateTaskSchema,
    (result, c) => {
      if (!result.success) {
        return c.json(
          failure(
            "Validasi gagal",
            "VALIDATION_ERROR",
            result.error.issues
          ),
          400
        );
      }
    }
  ),

  async (c) => {
    const db = c.get("db");
    const id = c.req.param("id");
    const data = c.req.valid("json");

    await ensureSubjectExists(
      db,
      data.subjectId
    );

    const [updated] = await db
      .update(tasks)
      .set({
        ...data,
        updatedAt: nowISO(),
      })
      .where(eq(tasks.id, id))
      .returning();

    if (!updated) {
      throw new ApiError(
        404,
        "Tugas tidak ditemukan",
        "TASK_NOT_FOUND"
      );
    }

    return c.json(
      success(
        updated,
        "Tugas berhasil diperbarui"
      )
    );
  }
);


// DELETE TASK

app.delete("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const [deleted] = await db
    .delete(tasks)
    .where(eq(tasks.id, id))
    .returning();

  if (!deleted) {
    throw new ApiError(
      404,
      "Tugas tidak ditemukan",
      "TASK_NOT_FOUND"
    );
  }

  return c.json(
    success(
      { id },
      "Tugas berhasil dihapus"
    )
  );
});

export default app;
