# Module: Packaging, deployment & observability

**Track:** Advanced · **Module ID:** `pya-platform`

## Overview

This module aligns with the training library topic **Packaging, deployment & observability**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Containers and slim base images for Python services
- WSGI / ASGI servers and graceful shutdown
- Structured logging, metrics, and tracing hooks
- Blue/green or canary patterns for Python rollouts

---

## Lesson 1: Slim containers and multi-stage builds

- Use **distroless** or **slim** bases after compiling wheels in builder stage; run as **non-root**; pin digest **`FROM python:3.12-slim@sha256:...`** for reproducibility.
- Copy **only** needed artifacts into runtime layer; avoid shipping compilers and `.git` history into prod images.
- Prerequisites: Docker or OCI runtime; CI publishing to registry with vulnerability scan (Trivy/Grype).

## Lesson 2: WSGI / ASGI servers and graceful shutdown

- **Happy path**: **`gunicorn`+`uvicorn.workers`** or pure **uvicorn** behind load balancer; configure **`timeout`**, **`keep-alive`**, **`graceful_timeout`** to drain in-flight requests on SIGTERM during deploys.
- Health checks hit **`/ready`** vs **`/live`** semantics separately from root route.
- Checkpoints: rolling deploy shows zero 502 spike in metrics during pod rotation.

## Lesson 3: Structured logging, metrics, tracing hooks

- Emit **JSON logs** with **`request_id`**, **`trace_id`** fields; expose **Prometheus** metrics for RPS, latency histograms, saturation; initialize **OpenTelemetry** exporters when org standard mandates.
- Correlate **worker PID** restarts with OOM events via container logs.
- Pitfalls: logging **PII**; huge log volume from DEBUG in prod; missing **correlation** across async boundaries.

## Lesson 4: Blue/green or canary rollouts

- **Done** when deployment doc describes **traffic shift** percentage, automatic **rollback** on error rate SLO burn, and **feature flags** interaction with container versions.
- Document **migrations** ordering with app startup (expand/contract) to avoid schema/app mismatch during canary.
- Handoff: post-incident review updates **runbook** with last verified deploy date.

## Lesson 5: Lab—readiness vs liveness and a minimal metrics hook

- Sketch **two HTTP endpoints**: `/live` (process up) and `/ready` (DB ping OK)—document which your orchestrator should use for traffic and why.
- Add a **counter** (Prometheus client or printf-style log metric) for `http_requests_total{route,status}` in a toy ASGI app—curl it and verify labels.
- Write a **5-line rollout checklist**: image digest, migration flag, feature flag default, rollback command, who owns the pager.

## Lesson 6: Anti-patterns in deploy and observability

- **Liveness-only probes** when the app depends on a down database—endless crash loops instead of shedding load.
- **Logging secrets** “temporarily” for debugging—log pipelines retain data; use redaction middleware.
- **Dashboards without owners**—on-call cannot interpret alerts; tie dashboards to services and teams.

---

## Key takeaways

- **Container slimming is security and cold-start speed**—fewer packages mean fewer CVEs.
- **Graceful shutdown is a feature**—SIGTERM handling separates pros from demo apps.
- **Observability is not three dashboards**—it is correlated logs, metrics, and traces with ownership.

---

## Quiz

1. **Multi-stage Docker builds** mainly help by:  
   A) Always running as root  
   B) Separating build-time tools from the final runtime image to reduce size and attack surface  
   C) Disabling virtual environments  

2. On SIGTERM, a well-behaved ASGI/WSGI stack should generally:  
   A) Drop active connections immediately always  
   B) Stop accepting new work and drain in-flight requests up to configured graceful timeouts  
   C) Ignore the signal  

3. **Structured logging** (JSON fields) helps operations because:  
   A) It removes timestamps  
   B) Machines can parse and query fields like `request_id` and `trace_id` reliably  
   C) It forbids text messages  

4. A **readiness** probe should reflect:  
   A) Only process is alive  
   B) The app can safely receive traffic (dependencies ready, migrations done, etc.)  
   C) Only CPU temperature  

5. **Canary deployments** reduce risk by:  
   A) Deploying to all users instantly  
   B) Routing a small slice of traffic to the new version while monitoring key metrics before full promotion  
   C) Skipping monitoring  

6. **Pinning `FROM python:...@sha256:...`** in Dockerfiles mainly improves:  
   A) Image build speed always  
   B) Reproducible base image bytes across builds and registries (barring mutable tags)  
   C) Python syntax compatibility  

7. **Prometheus histograms** for latency are useful because:  
   A) They replace logs entirely  
   B) They support SLO-style quantile estimation and alerting on tail latency  
   C) They only store the last request  

8. Running the container **as non-root** helps security because:  
   A) It disables all networking  
   B) Exploits that escape the app gain limited UID capabilities inside the container  
   C) It guarantees no CVEs in dependencies  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
