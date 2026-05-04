import fs from "node:fs";

const raw = fs.readFileSync(new URL("../.env", import.meta.url), "utf8");
const line = raw.split(/\r?\n/).find((l) => /^\s*DATABASE_URL\s*=/.test(l));
if (!line) {
  console.error("DATABASE_URL not found in .env");
  process.exit(1);
}
let v = line.replace(/^\s*DATABASE_URL\s*=\s*/, "").trim();
if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
  v = v.slice(1, -1);
}
try {
  const u = new URL(v);
  u.searchParams.delete("schema");
  let out = u.toString();
  if (out.endsWith("?")) out = out.slice(0, -1);
  process.stdout.write(out);
} catch {
  process.stdout.write(
    v.replace(/[?&]schema=[^&]*/g, "").replace(/\?&/g, "?").replace(/[?]$/g, ""),
  );
}
