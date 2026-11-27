
import {
  and,
  eq,
  gt,
  lte,
} from "drizzle-orm";

import {
  sessions,
  users,
} from "../db/schema";

import {
  generateToken,
  sha256,
} from "../lib/crypto";

import type { Database } from "../db";

export const SESSION_COOKIE =
  "myplanner_session";

export const SESSION_DURATION =
  30 * 24 * 60 * 60;

export async function createSession(
  db: Database,
  userId: string
) {
  const token = generateToken();

  const tokenHash = await sha256(token);

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION * 1000
  ).toISOString();

  const sessionId = crypto.randomUUID();

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    tokenHash,
    expiresAt,
  });

  return {
    token,
    sessionId,
    expiresAt,
  };
}

export async function validateSession(
  db: Database,
  token: string
) {
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return null;
  }

  const tokenHash = await sha256(token);

  const now = new Date().toISOString();

  const [result] = await db
    .select({
      sessionId: sessions.id,
      expiresAt: sessions.expiresAt,

      user: {
        id: users.id,
        email: users.email,
      },
    })
    .from(sessions)
    .innerJoin(
      users,
      eq(sessions.userId, users.id)
    )
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        gt(sessions.expiresAt, now)
      )
    )
    .limit(1);

  return result ?? null;
}

export async function deleteSession(
  db: Database,
  token: string
) {
  const tokenHash = await sha256(token);

  await db
    .delete(sessions)
    .where(
      eq(sessions.tokenHash, tokenHash)
    );
}

export async function deleteExpiredSessions(
  db: Database
) {
  await db
    .delete(sessions)
    .where(
      lte(
        sessions.expiresAt,
        new Date().toISOString()
      )
    );
}

export async function deleteAllSessions(
  db: Database,
  userId: string
) {
  await db
    .delete(sessions)
    .where(
      eq(sessions.userId, userId)
    );
}
