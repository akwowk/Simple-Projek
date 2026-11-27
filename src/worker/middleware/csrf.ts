import {
  createMiddleware,
} from "hono/factory";

import { ApiError } from "../lib/errors";
import type { AppEnv } from "../types";

const SAFE_METHODS = new Set([
  "GET",
  "HEAD",
  "OPTIONS",
]);

export const csrfMiddleware =
  createMiddleware<AppEnv>(
    async (c, next) => {

      if (
        SAFE_METHODS.has(c.req.method)
      ) {
        await next();
        return;
      }

      const origin = c.req.header("Origin");

      const expectedOrigin =
        new URL(c.req.url).origin;

      if (
        !origin ||
        origin !== expectedOrigin
      ) {
        throw new ApiError(
          403,
          "Origin request tidak diizinkan",
          "CSRF_REJECTED"
        );
      }

      await next();
    }
  );