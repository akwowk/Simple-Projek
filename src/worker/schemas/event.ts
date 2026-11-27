import { z } from "zod";
import { dateTimeSchema } from "./common";

const eventSchema = z.strictObject({
  title: z
    .string()
    .trim()
    .min(1, "Nama acara wajib diisi")
    .max(150),

  description: z
    .string()
    .trim()
    .max(5000)
    .optional(),

  startAt: dateTimeSchema,

  endAt: dateTimeSchema,

  location: z
    .string()
    .trim()
    .max(250)
    .optional(),
});

export const createEventSchema =
  eventSchema.refine(
    (value) =>
      Date.parse(value.startAt) <
      Date.parse(value.endAt),
    {
      message:
        "Waktu selesai harus setelah waktu mulai",
      path: ["endAt"],
    }
  );

export const updateEventSchema =
  eventSchema
    .partial()
    .refine(
      (value) => Object.keys(value).length > 0,
      "Tidak ada data yang diperbarui"
    );