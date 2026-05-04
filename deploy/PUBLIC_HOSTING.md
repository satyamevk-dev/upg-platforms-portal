# Public hosting (users on the internet)

This app needs **Node.js**, **PostgreSQL**, and these env vars at runtime:

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | PostgreSQL connection string (`sslmode=require` if the host requires TLS). |
| `NEXTAUTH_URL` | Full public URL, e.g. `https://your-app.onrender.com` — **no trailing slash**. |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NODE_ENV` | `production` (usually set by the platform). |

Optional: SMTP / `EMAIL_FROM`, `SUPER_ADMIN_PASSWORD` for `prisma db seed`, `AUTH_TRUST_HOST=true` if the platform needs it behind proxies.

---

## Option 1 — Render (simplest managed stack)

Good fit: one **Web Service** + **PostgreSQL**, no Docker changes. Free tier exists but sleeps after idle ([Render](https://render.com)).

1. Push this repository to **GitHub** (or GitLab / Bitbucket Render supports).
2. **Dashboard → New → PostgreSQL**  
   - Create the database; copy the **Internal Database URL** (or External if Render says the app must use it).
3. **New → Web Service** → connect the repo.  
   - **Runtime:** Node  
   - **Node version:** 20 (set via env `NODE_VERSION=20` or `engines` in `package.json` if you add it).
4. **Environment** on the Web Service:
   - Add `DATABASE_URL` = your Postgres URL.  
   - Turn on **“Include in build”** / build-time access for `DATABASE_URL` so migrations can run during build ([Render env docs](https://render.com/docs/environment-variables)).
   - Add `NEXTAUTH_SECRET` (long random string).
   - After first deploy, set `NEXTAUTH_URL` to the service’s **https** URL (Render shows it), then redeploy if needed.
5. **Build command:**

   ```bash
   npm ci && npx prisma migrate deploy && npm run build
   ```

6. **Start command:**

   ```bash
   npm start
   ```

7. Deploy. Open the public URL, test login.

**Seed (optional):** Render **Shell** (or one-off job) with repo + `DATABASE_URL`:

```bash
npx prisma db seed
```

**Copy local DB → Render Postgres (destructive on Render):** from your laptop, install `pg_dump` / `psql` (`brew install libpq`), then:

```bash
export TARGET_DATABASE_URL='postgresql://…render.com/…?sslmode=require'
npm run db:sync:push
```

Uses `DATABASE_URL` from `.env` as the source. Type `YES` to confirm. See `scripts/db-sync-push.sh`.

---

## Option 2 — Railway

1. **New project → Deploy from GitHub** (this repo).  
2. **Add resource → Database → PostgreSQL**; link it so `DATABASE_URL` is injected.  
3. If Railway builds with **Dockerfile**: the final image does **not** include the Prisma CLI. Run migrations once from your laptop (with production `DATABASE_URL`) or use Railway’s **one-off** / **cron** pattern, or switch the service to **Railpack/Nixpacks** (Node) and use a release/build step that runs `npx prisma migrate deploy` where `node_modules` includes `prisma`.  
4. Set `NEXTAUTH_URL` to the **public HTTPS** URL Railway assigns (or your custom domain) and `NEXTAUTH_SECRET`.

[Railway docs](https://docs.railway.app/)

---

## Option 3 — Vercel + managed Postgres

1. Create a project on [Vercel](https://vercel.com) from this Git repo (Next.js is detected).  
2. Add **Neon**, **Supabase**, or **Vercel Postgres**; set `DATABASE_URL` (use the **pooled** URL if the provider recommends it for serverless).  
3. Set `NEXTAUTH_URL` to `https://your-project.vercel.app` (or custom domain) and `NEXTAUTH_SECRET`.  
4. **Migrations:** run `npx prisma migrate deploy` locally or in CI against production `DATABASE_URL` after schema changes — Vercel’s build does not replace a dedicated migrate step unless you add it (e.g. GitHub Action).

---

## Option 4 — Your VPS + Coolify

Self-hosted panel, full control, same Docker stack as local. See **`deploy/COOLIFY.md`** and **`coolify-compose.yml`**.

---

## After go-live

- Confirm **`NEXTAUTH_URL`** matches the browser address (scheme + host, no trailing slash).  
- Use **HTTPS** only for real users.  
- Back up Postgres on a schedule (platform snapshots or `pg_dump`).

No step here can be completed for you without your cloud account and Git remote; follow one option above on your provider.
