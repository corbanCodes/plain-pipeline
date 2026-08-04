"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, inputCls, btnPrimary } from "@/components/ui";
import type { AuthState } from "./actions";

export function AuthForm({
  mode,
  action,
}: {
  mode: "login" | "signup";
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <div className="glow flex min-h-screen flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <Logo />
        <span className="font-display text-lg font-semibold tracking-tight text-ink">
          Plain Pipeline
        </span>
      </Link>

      <div className="glass w-full max-w-sm rounded-3xl p-8 shadow-2xl shadow-black/50">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-ink-dim">
          {mode === "signup"
            ? "Free, fast, and refreshingly plain."
            : "Sign in to pick up where you left off."}
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          {mode === "signup" && (
            <Field label="Name">
              <input name="name" required placeholder="Alex Rivera" className={inputCls} />
            </Field>
          )}
          <Field label="Email">
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className={inputCls}
            />
          </Field>
          <Field label="Password">
            <input
              name="password"
              type="password"
              required
              minLength={mode === "signup" ? 8 : 1}
              placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
              className={inputCls}
            />
          </Field>

          {state.error && (
            <p className="rounded-lg border border-red/30 bg-red-soft px-3 py-2 text-sm text-red">
              {state.error}
            </p>
          )}

          <button type="submit" disabled={pending} className={`${btnPrimary} w-full`}>
            {pending
              ? "One moment…"
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-sm text-ink-dim">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-accent-bright hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="font-medium text-accent-bright hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#c026d3] shadow-[0_4px_16px_-2px_rgba(168,85,247,0.5)]"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M4 17V9M12 17V5M20 17v-6" />
      </svg>
    </span>
  );
}
