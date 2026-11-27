
import { Hono } from "hono";

import {
  eq,
  asc,
  and,
  ne,
  lt,
  gt,
} from "drizzle-orm";

import { zValidator } from "@hono/zod-validator";

import {
  schedules,
  subjects,
} from "../db/schema";

import {
  createScheduleSchema,
  updateScheduleSchema,
} from "../schemas/schedule";

import { success, failure } from "../lib/response";
import { ApiError } from "../lib/errors";
import { nowISO } from "../lib/date";

import type { Database } from "../db";
import type { AppEnv } from "../types";

const app = new Hono<AppEnv>();


async function ensureSubjectExists(
  db: Database,
  subjectId: string
) {
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


async function checkConflict(
  db: Database,
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  excludeId?: string
) {
  const [conflict] = await db
    .select()
    .from(schedules)
    .where(
      and(
        eq(schedules.dayOfWeek, dayOfWeek),
        lt(schedules.startTime, endTime),
        gt(schedules.endTime, startTime),

        excludeId
          ? ne(schedules.id, excludeId)
          : undefined
      )
    )
    .limit(1);

  if (conflict) {
    throw new ApiError(
      409,
      "Jadwal bentrok dengan mata kuliah lain",
      "SCHEDULE_CONFLICT"
    );
  }
}


// GET ALL SCHEDULES

app.get("/", async (c) => {
  const db = c.get("db");

  const day = c.req.query("day");

  if (
    day !== undefined &&
    !/^[0-6]$/.test(day)
  ) {
    throw new ApiError(
      400,
      "Hari harus berada pada rentang 0-6",
      "INVALID_DAY"
    );
  }

  const result = await db
    .select()
    .from(schedules)
    .where(
      day !== undefined
        ? eq(schedules.dayOfWeek, Number(day))
        : undefined
    )
    .orderBy(
      asc(schedules.dayOfWeek),
      asc(schedules.startTime)
    );

  return c.json(success(result));
});


// GET SCHEDULE BY ID

app.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const [schedule] = await db
    .select()
    .from(schedules)
    .where(eq(schedules.id, id))
    .limit(1);

  if (!schedule) {
    throw new ApiError(
      404,
      "Jadwal tidak ditemukan",
      "SCHEDULE_NOT_FOUND"
    );
  }

  return c.json(success(schedule));
});


// CREATE SCHEDULE

app.post(
  "/",

  zValidator(
    "json",
    createScheduleSchema,
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

    await checkConflict(
      db,
      data.dayOfWeek,
      data.startTime,
      data.endTime
    );

    const [created] = await db
      .insert(schedules)
      .values({
        id: crypto.randomUUID(),
        ...data,
      })
      .returning();

    return c.json(
      success(
        created,
        "Jadwal berhasil ditambahkan"
      ),
      201
    );
  }
);


// UPDATE SCHEDULE

app.patch(
  "/:id",

  zValidator(
    "json",
    updateScheduleSchema,
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

    const [existing] = await db
      .select()
      .from(schedules)
      .where(eq(schedules.id, id))
      .limit(1);

    if (!existing) {
      throw new ApiError(
        404,
        "Jadwal tidak ditemukan",
        "SCHEDULE_NOT_FOUND"
      );
    }

    const merged = {
      subjectId:
        data.subjectId ?? existing.subjectId,

      dayOfWeek:
        data.dayOfWeek ?? existing.dayOfWeek,

      startTime:
        data.startTime ?? existing.startTime,

      endTime:
        data.endTime ?? existing.endTime,

      room:
        data.room ?? existing.room,
    };

    const validation =
      createScheduleSchema.safeParse(merged);

    if (!validation.success) {
      return c.json(
        failure(
          "Jadwal tidak valid",
          "VALIDATION_ERROR",
          validation.error.issues
        ),
        400
      );
    }

    await ensureSubjectExists(
      db,
      merged.subjectId
    );

    await checkConflict(
      db,
      merged.dayOfWeek,
      merged.startTime,
      merged.endTime,
      id
    );

    const [updated] = await db
      .update(schedules)
      .set({
        ...merged,
        updatedAt: nowISO(),
      })
      .where(eq(schedules.id, id))
      .returning();

    if (!updated) {
      throw new ApiError(
        404,
        "Jadwal tidak ditemukan",
        "SCHEDULE_NOT_FOUND"
      );
    }

    return c.json(
      success(
        updated,
        "Jadwal berhasil diperbarui"
      )
    );
  }
);


// DELETE SCHEDULE

app.delete("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const [deleted] = await db
    .delete(schedules)
    .where(eq(schedules.id, id))
    .returning();

  if (!deleted) {
    throw new ApiError(
      404,
      "Jadwal tidak ditemukan",
      "SCHEDULE_NOT_FOUND"
    );
  }

  return c.json(
    success(
      { id },
      "Jadwal berhasil dihapus"
    )
  );
});

export default app;
