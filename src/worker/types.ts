import type { Database } from "./db";

export interface AuthUser {
  id: string;
  email: string;
}

export type AppEnv = {
  Bindings: {
    DB: D1Database;

    LOGIN_RATE_LIMITER: {
      limit(options: {
        key: string;
      }): Promise<{
        success: boolean;
      }>;
    };
  };

  Variables: {
    db: Database;
    user: AuthUser;
    sessionId: string;
  };
};