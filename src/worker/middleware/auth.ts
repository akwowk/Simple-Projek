import {
  createMiddleware,
} from "hono/factory";

import {
  getCookie,
} from "hono/cookie";

import {
  validateSession,
  SESSION_COOKIE,
} from "../services/session";

import {
  ApiError,
} from "../lib/errors";

import type { AppEnv } from "../types";

export const authMiddleware =
  createMiddleware<AppEnv>(
    async (c, next) => {

      const token = getCookie(
        c,
        SESSION_COOKIE
      );

      if (!token) {
        throw new ApiError(
          401,
          "Silakan login terlebih dahulu",
          "UNAUTHORIZED"
        );
      }

      const db = c.get("db");

      const session = await validateSession(
        db,
        token
      );

      if (!session) {
        throw new ApiError(
          401,
          "Session tidak valid atau sudah berakhir",
          "SESSION_EXPIRED"
        );
      }

      c.set("user", session.user);

      c.set(
        "sessionId",
        session.sessionId
      );

      await next();
    }
  );