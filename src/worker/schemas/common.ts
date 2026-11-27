import { z } from "zod";

export const idSchema = z
  .string()
  .trim()
  .min(1)
  .max(100);

export const colorSchema = z
  .string()
  .regex(
    /^#[0-9a-fA-F]{6}$/,
    "Format warna tidak valid"
  );

export const timeSchema = z
  .string()
  .regex(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    "Gunakan format waktu HH:mm"
  );

export const dateTimeSchema = z
  .iso.datetime({
    offset: true,
  })
  .transform((value) =>
    new Date(value).toISOString()
  );

export const daySchema = z
  .number()
  .int()
  .min(0)
  .max(6);

export const prioritySchema = z.enum([
  "low",
  "medium",
  "high",
]);

export const statusSchema = z.enum([
  "todo",
  "in_progress",
  "done",
]);