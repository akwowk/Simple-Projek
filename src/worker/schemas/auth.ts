import { z } from "zod";

export const loginSchema = z.strictObject({
  email: z
    .email("Email tidak valid")
    .max(254)
    .transform((value) =>
      value.trim().toLowerCase()
    ),

  password: z
    .string()
    .regex(
      /^[a-f0-9]{64}$/,
      "Access key tidak valid"
    ),
});