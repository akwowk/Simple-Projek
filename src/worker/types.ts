import type { Database } from "./db";

export type AppEnv = {
  Bindings: {
    DB: D1Database;
  };

  Variables: {
    db: Database;
  };
};