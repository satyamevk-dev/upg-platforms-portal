"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";

const LAST_LOGIN_EMAIL_KEY = "htd-last-login-email";
const SAVED_CREDENTIALS_KEY = "htd-saved-login-credentials";
const LOGIN_EMAIL_HISTORY_KEY = "htd-login-email-history";
const MAX_LOGIN_EMAIL_HISTORY = 15;

type LoginHistoryEntry = { email: string; password: string };

/** Typical HTML form pattern: local@domain.tld (RFC-style length cap applied separately). */
const LOGIN_EMAIL_PATTERN = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z]{2,}";
const LOGIN_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/i;
const LOGIN_EMAIL_MAX_LENGTH = 254;

function isLoginEmailValid(value: string): boolean {
  const v = value.trim();
  if (v.length < 5 || v.length > LOGIN_EMAIL_MAX_LENGTH) return false;
  return LOGIN_EMAIL_REGEX.test(v);
}

function parseLoginHistoryRaw(parsed: unknown): LoginHistoryEntry[] {
  if (!Array.isArray(parsed)) return [];
  const out: LoginHistoryEntry[] = [];
  const seen = new Set<string>();
  for (const item of parsed) {
    if (typeof item === "string") {
      const n = item.trim().toLowerCase();
      if (isLoginEmailValid(n) && !seen.has(n)) {
        seen.add(n);
        out.push({ email: n, password: "" });
      }
      continue;
    }
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const emailRaw = typeof o.email === "string" ? o.email : "";
    const n = emailRaw.trim().toLowerCase();
    const password = typeof o.password === "string" ? o.password : "";
    if (isLoginEmailValid(n) && !seen.has(n)) {
      seen.add(n);
      out.push({ email: n, password });
    }
  }
  return out.slice(0, MAX_LOGIN_EMAIL_HISTORY);
}

function readStoredLoginHistory(): LoginHistoryEntry[] {
  try {
    const raw = localStorage.getItem(LOGIN_EMAIL_HISTORY_KEY);
    if (!raw) return [];
    return parseLoginHistoryRaw(JSON.parse(raw) as unknown);
  } catch {
    return [];
  }
}

/** Suggestions for the email field: saved history, or last single email from older builds. */
function readEmailHistoryForSuggestions(): string[] {
  const entries = readStoredLoginHistory();
  if (entries.length > 0) return entries.map((e) => e.email);
  try {
    const last = localStorage.getItem(LAST_LOGIN_EMAIL_KEY);
    if (last) {
      const n = last.trim().toLowerCase();
      if (isLoginEmailValid(n)) return [n];
    }
  } catch {
    /* ignore */
  }
  return [];
}

function getCachedPasswordForEmail(emailNormalized: string): string | null {
  const entry = readStoredLoginHistory().find((e) => e.email === emailNormalized);
  if (!entry || entry.password.length === 0) return null;
  return entry.password;
}

function recordSuccessfulLoginWithPassword(
  emailNormalized: string,
  password: string,
): void {
  try {
    if (!isLoginEmailValid(emailNormalized)) return;
    const prev = readStoredLoginHistory();
    const next: LoginHistoryEntry[] = [
      { email: emailNormalized, password },
      ...prev.filter((e) => e.email !== emailNormalized),
    ].slice(0, MAX_LOGIN_EMAIL_HISTORY);
    localStorage.setItem(LOGIN_EMAIL_HISTORY_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

type SavedCredentials = { email: string; password: string };

function readSavedCredentials(): SavedCredentials | null {
  try {
    const raw = localStorage.getItem(SAVED_CREDENTIALS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const o = parsed as Record<string, unknown>;
    const email = typeof o.email === "string" ? o.email : "";
    const password = typeof o.password === "string" ? o.password : "";
    if (!email || !password) return null;
    return { email, password };
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberOnDevice, setRememberOnDevice] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailHistory, setEmailHistory] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const id = window.setTimeout(() => {
      if (cancelled) return;
      try {
        setEmailHistory(readEmailHistoryForSuggestions());
        const creds = readSavedCredentials();
        if (creds) {
          setEmail(creds.email);
          setPassword(creds.password);
          setRememberOnDevice(true);
          const ne = creds.email.trim().toLowerCase();
          if (isLoginEmailValid(ne)) {
            recordSuccessfulLoginWithPassword(ne, creds.password);
            setEmailHistory(readEmailHistoryForSuggestions());
          }
          return;
        }
        const savedEmail = localStorage.getItem(LAST_LOGIN_EMAIL_KEY);
        if (savedEmail) {
          setEmail(savedEmail);
          const n = savedEmail.trim().toLowerCase();
          if (isLoginEmailValid(n)) {
            const cached = getCachedPasswordForEmail(n);
            if (cached !== null) setPassword(cached);
          }
        }
      } catch {
        /* ignore private mode / denied storage */
      }
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const trimmedEmail = email.trim();
    if (!isLoginEmailValid(trimmedEmail)) {
      setError("Enter a valid email address (for example, name@company.com).");
      return;
    }

    setIsSubmitting(true);
    const paramCallback = new URLSearchParams(window.location.search).get("callbackUrl");
    const callbackUrlForSignIn = paramCallback ?? "/dashboard";

    let result: Awaited<ReturnType<typeof signIn>>;
    try {
      result = await signIn("credentials", {
        email: trimmedEmail,
        password,
        callbackUrl: callbackUrlForSignIn,
        redirect: false,
      });
    } catch {
      setError("Sign-in request failed. Check your connection and try again.");
      setIsSubmitting(false);
      return;
    }

    if (result?.error) {
      setError(
        "Invalid credentials. Try your Platform Owner, trainer, or client account, or run npm run db:seed after changing SUPER_ADMIN_PASSWORD.",
      );
      setIsSubmitting(false);
      return;
    }

    if (!result?.ok) {
      setError("Could not complete sign-in. Please try again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const normalizedEmail = trimmedEmail.toLowerCase();
      localStorage.setItem(LAST_LOGIN_EMAIL_KEY, normalizedEmail);
      recordSuccessfulLoginWithPassword(normalizedEmail, password);
      if (rememberOnDevice) {
        localStorage.setItem(
          SAVED_CREDENTIALS_KEY,
          JSON.stringify({ email: normalizedEmail, password }),
        );
      } else {
        localStorage.removeItem(SAVED_CREDENTIALS_KEY);
      }
    } catch {
      /* ignore */
    }

    const session = await getSession();
    const role = session?.user?.role;

    let path: string;
    if (
      paramCallback &&
      paramCallback.startsWith("/") &&
      !paramCallback.startsWith("//")
    ) {
      if (role !== "super_admin" && (paramCallback === "/" || paramCallback === "")) {
        path = "/dashboard";
      } else {
        path = paramCallback;
      }
    } else if (role === "super_admin") {
      path = "/";
    } else {
      path = "/dashboard";
    }

    window.location.assign(new URL(path, window.location.origin).href);
  }

  const fieldClassName =
    "rounded-xl border border-[#D0D3E7] bg-white/95 px-3 py-2.5 text-slate-900 shadow-inner shadow-slate-900/5 transition placeholder:text-[#7683A4] focus:border-[#F46036] focus:outline-none focus:ring-2 focus:ring-[#F46036]/30";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-slate-950 bg-[url('/login-background.png')] bg-cover bg-[58%_center] bg-no-repeat">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950/70 via-slate-900/45 to-[#3a1408]/55"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#F46036]/25 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#4FCEC0]/20 blur-[120px]"
        aria-hidden
      />

      <Link
        href="/"
        aria-label="Infinite home"
        className="absolute left-3 top-3 z-20 inline-flex items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F46036]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:left-4 sm:top-4"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/infinite-logo-dark.png"
          alt="Infinite"
          width={164}
          height={110}
          className="h-14 w-auto select-none rounded-md sm:h-16"
          draggable={false}
        />
      </Link>

      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[#D0D3E7]/80 bg-[#F7F7FF]/90 p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10">
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F46036]">
                Welcome to
              </p>
              <h1 className="mt-2 text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
                Knowledge Platform - Unified Platform Group
              </h1>
              <div
                className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-gradient-to-r from-[#F46036] to-[#4FCEC0]"
                aria-hidden
              />
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
                Email
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={LOGIN_EMAIL_MAX_LENGTH}
                  minLength={5}
                  pattern={LOGIN_EMAIL_PATTERN}
                  list="login-email-history"
                  title="Use an address like name@company.com (letters, numbers, and common symbols before @)."
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => {
                    const v = event.target.value;
                    setEmail(v);
                    const n = v.trim().toLowerCase();
                    if (isLoginEmailValid(n)) {
                      const cached = getCachedPasswordForEmail(n);
                      if (cached !== null) setPassword(cached);
                    }
                  }}
                  className={fieldClassName}
                  id="login-email"
                />
                {emailHistory.length > 0 ? (
                  <span className="text-xs font-normal text-[#7683A4]">
                    Focus this field or start typing to choose a recent address ({emailHistory.length} saved on
                    this device).
                  </span>
                ) : null}
              </label>
              <datalist id="login-email-history">
                {emailHistory.map((addr) => (
                  <option key={addr} value={addr} />
                ))}
              </datalist>

              <div className="flex flex-col gap-2 text-sm font-medium text-slate-800">
                <span>Password</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`${fieldClassName} w-full pr-14`}
                    id="login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-pressed={showPassword}
                    aria-controls="login-password"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-[#b23d1e] underline decoration-[#b23d1e]/40 underline-offset-2 hover:bg-[#F46036]/10 hover:text-[#7d2b13] focus:outline-none focus:ring-2 focus:ring-[#F46036]/40"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#D0D3E7]/80 bg-white/60 px-3 py-3 text-sm text-slate-800 backdrop-blur-sm">
                <input
                  type="checkbox"
                  checked={rememberOnDevice}
                  onChange={(event) => setRememberOnDevice(event.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#D0D3E7] text-[#F46036] focus:ring-[#F46036]"
                />
                <span>
                  <span className="font-medium">Remember email and password on this device</span>
                  <span className="mt-1 block text-xs font-normal leading-snug text-[#7683A4]">
                    If you choose yes, your browser will fill these fields next time. Only use on a private
                    computer you trust; anyone with access to this browser could sign in.
                  </span>
                </span>
              </label>

              {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#F46036] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#F46036]/30 transition hover:bg-[#d44a20] focus:outline-none focus:ring-2 focus:ring-[#F46036] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isSubmitting ? "Signing in..." : "Continue"}
              </button>
            </form>

            {process.env.NODE_ENV !== "production" ? (
              <details className="mt-6 rounded-xl border border-[#D0D3E7]/80 bg-white/60 p-4 text-xs text-[#7683A4] backdrop-blur-sm">
                <summary className="cursor-pointer select-none font-semibold text-slate-800">
                  Demo accounts for evaluation
                </summary>
                <div className="mt-3 space-y-2 border-t border-[#D0D3E7]/80 pt-3 font-mono text-[11px] leading-relaxed text-[#7683A4]">
                  <p>
                    <span className="font-sans font-medium text-slate-700">Platform Owner (database):</span>{" "}
                    satyamevk@infinite.com — password from{" "}
                    <span className="font-sans">SUPER_ADMIN_PASSWORD</span> after{" "}
                    <span className="font-sans">npm run db:seed</span>
                  </p>
                  <p>
                    <span className="font-sans font-medium text-slate-700">Trainer:</span>{" "}
                    trainer@example.com / trainer123
                  </p>
                  <p>
                    <span className="font-sans font-medium text-slate-700">Client:</span>{" "}
                    client@example.com / client123
                  </p>
                </div>
              </details>
            ) : null}

            <p className="mt-6 text-center text-xs text-[#7683A4]">
              <Link
                href="/"
                className="font-medium underline decoration-[#D0D3E7] underline-offset-2 transition hover:text-[#F46036]"
              >
                Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
