
import {
  randomBytes,
  randomUUID,
  createHash,
} from "node:crypto";

import { spawnSync } from "node:child_process";

import {
  createInterface,
} from "node:readline/promises";

import {
  stdin as input,
  stdout as output,
} from "node:process";

const rl = createInterface({
  input,
  output,
});

try {
  console.log("\n=== MyPlanner Account Setup ===\n");

  const email = (
    await rl.question("Email: ")
  ).trim().toLowerCase();

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    throw new Error("Email tidak valid.");
  }

  const id = randomUUID();

  const accessKey = randomBytes(32)
    .toString("hex");

  const passwordHash = createHash("sha256")
    .update(accessKey)
    .digest("hex");

  const escapeSQL = (value) =>
    `'${value.replace(/'/g, "''")}'`;

  const sql = `
    INSERT INTO users (
      id,
      email,
      password_hash
    )
    SELECT
      ${escapeSQL(id)},
      ${escapeSQL(email)},
      ${escapeSQL(passwordHash)}
    WHERE NOT EXISTS (
      SELECT 1 FROM users
    );
  `;

  const mode = process.argv.includes("--remote")
    ? "--remote"
    : "--local";

  console.log(`\nDatabase target: ${mode}`);

  const result = spawnSync(
    "pnpm",
    [
      "exec",
      "wrangler",
      "d1",
      "execute",
      "DB",
      mode,
      "--command",
      sql,
    ],
    {
      encoding: "utf8",
    }
  );

  if (result.status !== 0) {
    throw new Error(
      result.stderr ||
      "Gagal membuat akun."
    );
  }

  const verification = spawnSync(
    "pnpm",
    [
      "exec",
      "wrangler",
      "d1",
      "execute",
      "DB",
      mode,
      "--json",
      "--command",
      `SELECT id FROM users WHERE id = ${escapeSQL(id)};`,
    ],
    {
      encoding: "utf8",
    }
  );

  if (verification.status !== 0) {
    throw new Error(
      "Gagal memverifikasi akun."
    );
  }

  const rows = JSON.parse(
    verification.stdout
  );

  const created = rows.some((item) =>
    item.results?.some(
      (row) => row.id === id
    )
  );

  if (!created) {
    throw new Error(
      "Akun sudah tersedia. MyPlanner hanya mendukung satu akun."
    );
  }

  console.log("\nAccount created successfully!\n");

  console.log("Email      :", email);
  console.log("Access Key :", accessKey);

  console.log(
    "\nSimpan access key di password manager."
  );

  console.log(
    "Access key tidak dapat dilihat kembali dari database."
  );

} catch (error) {
  console.error(
    "\nError:",
    error.message
  );

  process.exitCode = 1;

} finally {
  rl.close();
}
