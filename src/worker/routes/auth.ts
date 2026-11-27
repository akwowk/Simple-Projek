
import { Hono } from "hono";

import {
  getCookie,
  setCookie,
  deleteCookie,
} from "hono/cookie";

import {
  zValidator,
} from "@hono/zod-validator";

import { eq } from "drizzle-orm";

import { users } from "../db/schema";
import { loginSchema } from "../schemas/auth";

import {
  success,
  failure,
} from "../lib/response";

import { ApiError } from "../lib/errors";

import {
  verifyAccessKey,
} from "../lib/crypto";

import {
  createSession,
  deleteSession,
  deleteAllSessions,
  deleteExpiredSessions,
  SESSION_COOKIE,
  SESSION_DURATION,
} from "../services/session";

import {
  authMiddleware,
} from "../middleware/auth";

import type { AppEnv } from "../types";

const app = new Hono<AppEnv>();


// ================================
// LOGIN
// ================================

app.post(
  "/login",

  async (c, next) => {
    const ip =
      c.req.header("CF-Connecting-IP") ??
      "local";

    const result =
      await c.env.LOGIN_RATE_LIMITER.limit({
        key: `login:${ip}`,
      });

    if (!result.success) {
      c.header("Retry-After", "60");

      throw new ApiError(
        429,
        "Terlalu banyak percobaan login. Coba lagi nanti.",
        "RATE_LIMITED"
      );
    }

    await next();
  },

  zValidator(
    "json",
    loginSchema,
    (result, c) => {
      if (!result.success) {
        return c.json(
          failure(
            "Email atau access key tidak valid",
            "VALIDATION_ERROR"
          ),
          400
        );
      }
    }
  ),

  async (c) => {
    const db = c.get("db");

    const {
      email,
      password,
    } = c.req.valid("json");

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const valid = await verifyAccessKey(
      password,
      user?.passwordHash ?? "0".repeat(64)
    );

    if (!user || !valid) {
      throw new ApiError(
        401,
        "Email atau access key salah",
        "INVALID_CREDENTIALS"
      );
    }

    const previousToken = getCookie(
      c,
      SESSION_COOKIE
    );

    if (previousToken) {
      await deleteSession(
        db,
        previousToken
      );
    }

    await deleteExpiredSessions(db);

    const session = await createSession(
      db,
      user.id
    );

    const secure =
      new URL(c.req.url).protocol === "https:";

    setCookie(
      c,
      SESSION_COOKIE,
      session.token,
      {
        httpOnly: true,
        secure,
        sameSite: "Strict",
        path: "/",
        maxAge: SESSION_DURATION,
      }
    );

    return c.json(
      success(
        {
          user: {
            id: user.id,
            email: user.email,
          },

          expiresAt:
            session.expiresAt,
        },
        "Login berhasil"
      )
    );
  }
);


// ================================
// GET CURRENT USER
// ================================

app.get(
  "/me",
  authMiddleware,
  (c) => {
    return c.json(
      success({
        user: c.get("user"),
      })
    );
  }
);


// ================================
// LOGOUT CURRENT DEVICE
// ================================

app.post(
  "/logout",
  async (c) => {
    const token = getCookie(
      c,
      SESSION_COOKIE
    );

    if (token) {
      await deleteSession(
        c.get("db"),
        token
      );
    }

    deleteCookie(
      c,
      SESSION_COOKIE,
      {
        path: "/",
        httpOnly: true,
        secure:
          new URL(c.req.url).protocol === "https:",
        sameSite: "Strict",
      }
    );

    return c.json(
      success(
        null,
        "Logout berhasil"
      )
    );
  }
);


// ================================
// LOGOUT ALL DEVICES
// ================================

app.post(
  "/logout-all",
  authMiddleware,
  async (c) => {
    const user = c.get("user");

    await deleteAllSessions(
      c.get("db"),
      user.id
    );

    deleteCookie(
      c,
      SESSION_COOKIE,
      {
        path: "/",
        httpOnly: true,
        secure:
          new URL(c.req.url).protocol === "https:",
        sameSite: "Strict",
      }
    );

    return c.json(
      success(
        null,
        "Seluruh perangkat berhasil logout"
      )
    );
  }
);

export default app;
