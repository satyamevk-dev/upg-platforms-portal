# Deploy on Coolify (self-hosted on a VPS)

This app is a **Docker Compose** stack: PostgreSQL, a one-shot **Prisma migrate** container, and the **Next.js** app (`Dockerfile` standalone image).

**Note:** `coolify-compose.yml` (repository root) uses Coolify’s `exclude_from_hc` flag on `migrate` so a finished migration does not fail the stack health check. The stock `docker compose` CLI may reject that field; use `deploy/docker-compose.yml` for local Docker testing, and let Coolify apply this file on the server.

## 1. VPS and Coolify

1. Use a fresh **64-bit Linux** VPS (Ubuntu LTS is the smoothest path). Minimum **2 vCPU / 2 GB RAM**; more if Coolify builds on the same host.
2. Open ports **22** (SSH), **80** and **443** (HTTP/HTTPS for apps and Let’s Encrypt). Coolify’s UI is often on **8000** until you put a domain on it—see [Coolify installation](https://coolify.io/docs/get-started/installation).
3. Install Coolify on the server:

   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
   ```

4. Open the URL the installer prints (e.g. `http://YOUR_SERVER_IP:8000`), create the **admin** account immediately, and finish Coolify’s onboarding (server/localhost is usually pre-added).

## 2. DNS (optional but recommended)

- Point a hostname at your VPS (e.g. `training.example.com` → server IP).
- In Coolify, configure **wildcard** or per-app DNS as described in their [domains](https://coolify.io/docs/knowledge-base/server/introduction#wildcard-domain) docs so generated URLs use HTTPS.

## 3. Create the application in Coolify

1. **Project** → **New resource** → **Docker Compose** (or **Service Stack**, depending on Coolify version).
2. Connect this **Git** repository and select the branch you deploy from.
3. Set the Compose file path to (repository root):

   `coolify-compose.yml`

4. Save; Coolify should detect **environment variables** from the compose file.

## 4. Environment variables

Set these in the resource’s **Environment Variables** (Developer view is fine).

| Variable | Purpose |
|----------|---------|
| `POSTGRES_PASSWORD` | Strong password for the bundled Postgres. |
| `DATABASE_URL` | Must match Postgres. Example: `postgresql://htd:YOUR_PASSWORD@postgres:5432/htd_training` (host **`postgres`** is the compose service name). |
| `NEXTAUTH_SECRET` | Long random secret, e.g. `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | **Public** site URL with scheme, **no trailing slash**, e.g. `https://training.example.com`. Must match what users type in the browser after you attach the domain in Coolify. |

Optional (defaults in compose):

- `POSTGRES_USER` (default `htd`)
- `POSTGRES_DB` (default `htd_training`)

Optional for email / seed:

- SMTP / `EMAIL_FROM` (see `deploy/env.example`)
- `SUPER_ADMIN_PASSWORD` if you run the seed (below)

### Coolify “magic” URLs (optional)

If your Coolify version supports [magic environment variables](https://coolify.io/docs/knowledge-base/docker/compose#coolify-s-magic-environment-variables), you can add a line in the compose file such as `SERVICE_URL_WEB_3000` and map `NEXTAUTH_URL` to the generated HTTPS URL once you confirm the exact variable name in the UI. The simplest reliable approach is to set **`NEXTAUTH_URL` manually** to your final public URL after the domain is assigned.

## 5. Domain and port for `web`

1. In the Compose stack UI, open the **`web`** service.
2. **Add a domain** / FQDN Coolify provides or your custom hostname.
3. Set routing to **container port `3000`** (Coolify’s proxy sends HTTPS to the app on 3000 internally).

Do **not** rely on publishing `3000` on the host unless you intend to bypass the proxy; `coolify-compose.yml` only **exposes** 3000 on the internal network.

## 6. Deploy

Trigger **Deploy**. Coolify will:

1. Start **postgres** and wait until healthy.
2. Run **migrate** once (`prisma migrate deploy`).
3. Build and start **web**.

## 7. Seed data (optional)

After a successful deploy, run a one-off command from Coolify’s terminal / exec UI **or** SSH on the server:

```bash
docker exec -it <migrate-or-web-container> sh
# or use Coolify "Execute Command" on a one-off container built from the same image as migrate
```

Practical approach: in Coolify, **one-shot** or **console** into an image that has `prisma` and the repo’s `prisma/` folder—same as local `deploy/Dockerfile.migrate`—with `DATABASE_URL` set, then:

```bash
node prisma/seed.mjs
```

(Ensure `SUPER_ADMIN_PASSWORD` and any other seed env vars are set if your `prisma/seed.mjs` expects them.)

## 8. Local compose vs Coolify

- **Local / generic VPS:** `deploy/docker-compose.yml` (may map host port `3000`).
- **Coolify:** `coolify-compose.yml` at repo root (`exclude_from_hc` on `migrate`, no host `ports` on `web`).

## Troubleshooting

- **Auth redirects / cookies:** `NEXTAUTH_URL` must exactly match the public HTTPS URL (scheme + host, no trailing slash).
- **Database connection errors:** `DATABASE_URL` host must be **`postgres`**, not `localhost`, inside the stack.
- **Migrate fails:** Fix migrations, redeploy; if Postgres volume is half-migrated, remove the stack volume only after backup (destructive).

For Coolify-specific behavior (labels, health checks, previews), see [Docker Compose in Coolify](https://coolify.io/docs/knowledge-base/docker/compose).
