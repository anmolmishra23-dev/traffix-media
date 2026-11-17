// Creates the tables, security rules and starting content in your Supabase database.
// Usage:  npm run db:setup -- you@example.com
//         (the email is optional; it is added as an admin who can log in to /admin)
// Safe to run more than once.

import { readFile } from "node:fs/promises";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url || url.includes("YOUR-PASSWORD")) {
  console.error("✗ Set DATABASE_URL in .env.local (replace YOUR-PASSWORD with your database password).");
  process.exit(1);
}

const adminEmail = process.argv[2]?.trim().toLowerCase();
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  console.log("✓ Connected to database");

  await client.query(await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8"));
  console.log("✓ Tables, security rules and storage bucket created");

  await client.query(await readFile(new URL("../supabase/seed.sql", import.meta.url), "utf8"));
  console.log("✓ Starting content loaded");

  if (adminEmail) {
    await client.query("insert into public.admin_users (email) values ($1) on conflict do nothing", [adminEmail]);
    console.log(`✓ ${adminEmail} can now manage the site at /admin`);
  }

  const { rows } = await client.query(`
    select (select count(*) from public.projects) as projects,
           (select count(*) from public.categories) as industries,
           (select count(*) from public.services) as services,
           (select string_agg(email, ', ') from public.admin_users) as admins`);
  console.log("\nDatabase now has:", rows[0]);
  if (!rows[0].admins) {
    console.log("\n! No admin yet. Create a user in Supabase (Authentication → Users), then run:");
    console.log("  npm run db:setup -- their@email.com");
  }
} catch (err) {
  console.error("✗ Setup failed:", err.message);
  if (/ENOTFOUND|ENETUNREACH|EHOSTUNREACH|ETIMEDOUT/.test(err.code ?? err.message)) {
    console.error(
      "\nYour network may not support IPv6, which the direct connection needs.\n" +
        "Use the Session pooler string instead: Supabase → Connect → Session pooler,\n" +
        "and put it in DATABASE_URL.",
    );
  }
  if (/password authentication failed/.test(err.message)) {
    console.error("\nWrong password. Check DATABASE_URL (special characters must be URL-encoded).");
  }
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
