import { createMiddleware } from "hono/factory";
import { createDb } from "../db";
import type { AppEnv } from "../types";

export const databaseMiddleware =
  createMiddleware<AppEnv>(async (c, next) => {
    const db = createDb(c.env.DB);

    c.set("db", db);

    await next();
  });