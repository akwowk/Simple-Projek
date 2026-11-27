
import { Hono } from "hono";
import { eq, asc, and, ne, sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";

import { subjects } from "../db/schema";

import {
  createSubjectSchema,
  updateSubjectSchema,
} from "../schemas/subject";

import { success, failure } from "../lib/response";
import { ApiError } from "../lib/errors";
import { nowISO } from "../lib/date";

import type { AppEnv } from "../types";

const app = new Hono<AppEnv>();


// GET ALL SUBJECTS

app.get("/", async (c) => {
  const db = c.get("db");

  const result = await db
    .select()
    .from(subjects)
    .orderBy(asc(subjects.name));

  return c.json(success(result));
});


// GET SUBJECT BY ID

app.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const [subject] = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, id))
    .limit(1);

  if (!subject) {
    throw new ApiError(
      404,
      "Mata kuliah tidak ditemukan",
      "SUBJECT_NOT_FOUND"
    );
  }

  return c.json(success(subject));
});


// CREATE SUBJECT

app.post(
  "/",

  zValidator(
    "json",
    createSubjectSchema,
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

    const [existing] = await db
      .select()
      .from(subjects)
      .where(
        sql`lower(trim(${subjects.name})) = lower(trim(${data.name}))`
      )
      .limit(1);

    if (existing) {
      throw new ApiError(
        409,
        "Mata kuliah sudah tersedia",
        "SUBJECT_DUPLICATE"
      );
    }

    const [created] = await db
      .insert(subjects)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        lecturer: data.lecturer,
        color: data.color,
      })
      .returning();

    return c.json(
      success(
        created,
        "Mata kuliah berhasil ditambahkan"
      ),
      201
    );
  }
);


// UPDATE SUBJECT

app.patch(
  "/:id",

  zValidator(
    "json",
    updateSubjectSchema,
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
      .from(subjects)
      .where(eq(subjects.id, id))
      .limit(1);

    if (!existing) {
      throw new ApiError(
        404,
        "Mata kuliah tidak ditemukan",
        "SUBJECT_NOT_FOUND"
      );
    }

    if (data.name !== undefined) {
      const [duplicate] = await db
        .select()
        .from(subjects)
        .where(
          and(
            ne(subjects.id, id),
            sql`lower(trim(${subjects.name})) = lower(trim(${data.name}))`
          )
        )
        .limit(1);

      if (duplicate) {
        throw new ApiError(
          409,
          "Nama mata kuliah sudah digunakan",
          "SUBJECT_DUPLICATE"
        );
      }
    }

    const [updated] = await db
      .update(subjects)
      .set({
        ...data,
        updatedAt: nowISO(),
      })
      .where(eq(subjects.id, id))
      .returning();

    if (!updated) {
      throw new ApiError(
        404,
        "Mata kuliah tidak ditemukan",
        "SUBJECT_NOT_FOUND"
      );
    }

    return c.json(
      success(
        updated,
        "Mata kuliah berhasil diperbarui"
      )
    );
  }
);


// DELETE SUBJECT

app.delete("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const [deleted] = await db
    .delete(subjects)
    .where(eq(subjects.id, id))
    .returning();

  if (!deleted) {
    throw new ApiError(
      404,
      "Mata kuliah tidak ditemukan",
      "SUBJECT_NOT_FOUND"
    );
  }

  return c.json(
    success(
      { id },
      "Mata kuliah berhasil dihapus"
    )
  );
});

export default app;
