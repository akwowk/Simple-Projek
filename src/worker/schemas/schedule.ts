import { z } from "zod";

import {
  idSchema,
  daySchema,
  timeSchema,
} from "./common";

const scheduleSchema = z.strictObject({
  subjectId: idSchema,

  dayOfWeek: daySchema,

  startTime: timeSchema,

  endTime: timeSchema,

  room: z
    .string()
    .trim()
    .min(1, "Ruangan wajib diisi")
    .max(150),
});

export const createScheduleSchema =
  scheduleSchema.refine(
    (value) =>
      value.startTime < value.endTime,
    {
      message:
        "Jam selesai harus setelah jam mulai",
      path: ["endTime"],
    }
  );

export const updateScheduleSchema =
  scheduleSchema
    .partial()
    .refine(
      (value) => Object.keys(value).length > 0,
      "Tidak ada data yang diperbarui"
    );