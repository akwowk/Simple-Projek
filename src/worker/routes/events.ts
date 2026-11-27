
import { Hono } from "hono";

import {
  eq,
  asc,
  and,
  gt,
  lte,
  type SQL,
} from "drizzle-orm";

import { zValidator } from "@hono/zod-validator";

import { events } from "../db/schema";

import {
  createEventSchema,
  updateEventSchema,
} from "../schemas/event";

import { success, failure } from "../lib/response";
import { ApiError } from "../lib/errors";
import { nowISO } from "../lib/date";

import type { AppEnv } from "../types";

const app = new Hono<AppEnv>();


// GET ALL EVENTS

app.get("/", async (c) => {
  const db = c.get("db");

  const status = c.req.query("status");
  const now = nowISO();

  const conditions: SQL[] = [];

  if (status === "upcoming") {
    conditions.push(
      gt(events.startAt, now)
    );

  } else if (status === "ongoing") {
    conditions.push(
      lte(events.startAt, now),
      gt(events.endAt, now)
    );

  } else if (status === "completed") {
    conditions.push(
      lte(events.endAt, now)
    );

  } else if (status !== undefined) {
    throw new ApiError(
      400,
      "Status acara tidak valid",
      "INVALID_STATUS"
    );
  }

  const result = await db
    .select()
    .from(events)
    .where(
      conditions.length
        ? and(...conditions)
        : undefined
    )
    .orderBy(asc(events.startAt));

  return c.json(success(result));
});


// GET EVENT BY ID

app.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);

  if (!event) {
    throw new ApiError(
      404,
      "Acara tidak ditemukan",
      "EVENT_NOT_FOUND"
    );
  }

  return c.json(success(event));
});


// CREATE EVENT

app.post(
  "/",

  zValidator(
    "json",
    createEventSchema,
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

    const [created] = await db
      .insert(events)
      .values({
        id: crypto.randomUUID(),

        title: data.title,

        description:
          data.description ?? "",

        startAt: data.startAt,

        endAt: data.endAt,

        location:
          data.location ?? "",
      })
      .returning();

    return c.json(
      success(
        created,
        "Acara berhasil ditambahkan"
      ),
      201
    );
  }
);


// UPDATE EVENT

app.patch(
  "/:id",

  zValidator(
    "json",
    updateEventSchema,
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
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (!existing) {
      throw new ApiError(
        404,
        "Acara tidak ditemukan",
        "EVENT_NOT_FOUND"
      );
    }

    const merged = {
      title:
        data.title ?? existing.title,

      description:
        data.description ?? existing.description,

      location:
        data.location ?? existing.location,

      startAt:
        data.startAt ?? existing.startAt,

      endAt:
        data.endAt ?? existing.endAt,
    };

    const validation =
      createEventSchema.safeParse(merged);

    if (!validation.success) {
      return c.json(
        failure(
          "Waktu acara tidak valid",
          "VALIDATION_ERROR",
          validation.error.issues
        ),
        400
      );
    }

    const [updated] = await db
      .update(events)
      .set({
        ...merged,
        updatedAt: nowISO(),
      })
      .where(eq(events.id, id))
      .returning();

    if (!updated) {
      throw new ApiError(
        404,
        "Acara tidak ditemukan",
        "EVENT_NOT_FOUND"
      );
    }

    return c.json(
      success(
        updated,
        "Acara berhasil diperbarui"
      )
    );
  }
);


// DELETE EVENT

app.delete("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const [deleted] = await db
    .delete(events)
    .where(eq(events.id, id))
    .returning();

  if (!deleted) {
    throw new ApiError(
      404,
      "Acara tidak ditemukan",
      "EVENT_NOT_FOUND"
    );
  }

  return c.json(
    success(
      { id },
      "Acara berhasil dihapus"
    )
  );
});

export default app;
