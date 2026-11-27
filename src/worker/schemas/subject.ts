import { z } from "zod";
import { colorSchema } from "./common";

export const createSubjectSchema =
  z.strictObject({
    name: z
      .string()
      .trim()
      .min(1, "Nama mata kuliah wajib diisi")
      .max(150),

    lecturer: z
      .string()
      .trim()
      .min(1, "Nama dosen wajib diisi")
      .max(150),

    color: colorSchema.default("#3b82f6"),
  });

export const updateSubjectSchema =
  createSubjectSchema
    .partial()
    .refine(
      (value) => Object.keys(value).length > 0,
      "Tidak ada data yang diperbarui"
    );