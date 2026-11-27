import { z } from "zod";

import {
  idSchema,
  dateTimeSchema,
  prioritySchema,
  statusSchema,
} from "./common";

const taskSchema = z.strictObject({
  subjectId: idSchema
    .nullable()
    .optional(),

  title: z
    .string()
    .trim()
    .min(1, "Judul tugas wajib diisi")
    .max(150),

  description: z
    .string()
    .trim()
    .max(5000)
    .optional(),

  deadline: dateTimeSchema,

  priority: prioritySchema.optional(),

  status: statusSchema.optional(),
});

export const createTaskSchema = taskSchema;

export const updateTaskSchema =
  taskSchema
    .partial()
    .refine(
      (value) => Object.keys(value).length > 0,
      "Tidak ada data yang diperbarui"
    );