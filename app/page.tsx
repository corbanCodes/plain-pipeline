import Link from "next/link";
import { Logo } from "./(auth)/auth-form";

const features = [
  {
    title: "Leads with a next action",
    body: "Every lead carries one clear next step and a date. No lead ever sits idle — you always know what to do next.",
    icon: (
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    ),
  },
  {
    title: "A board for your day",
    body: "Drag tasks across To do, In progress and Done. Priorities and due dates keep the week honest.",
    icon: (
      <path d="M9 5H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4M15 5h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-4M9 3h6v18H9z" />
    ),
  },
  {
    title: "Goals, short and long",
    body: "Set short-term targets and long-term ambitions, track progress, and watch the bars fill up.",
    icon: (
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="glow flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <Logo />
          <span className="text-lg font-semibold tracking-tight">Plain Pipeline</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-ink-dim transition hover:text-ink"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-bright"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-6 pt-20 pb-24 text-center">
        <p className="mb-5 rounded-full border border-line-strong bg-surface px-4 py-1.5 text-xs font-medium tracking-wide text-ink-dim">
          The CRM that stays out of your way
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          Leads, tasks &amp; goals.
          <br />
          <span className="bg-gradient-to-r from-accent-bright to-blue bg-clip-text text-transparent">
            Nothing you don&apos;t need.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-dim">
          Plain Pipeline is a lean CRM and planner for people who want to close
          deals and get things done — not configure software.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/signup"
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-bright"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-line-strong px-6 py-3 text-sm font-semibold text-ink-dim transition hover:border-accent hover:text-ink"
          >
            Sign in
          </Link>
        </div>

        <div className="mt-24 grid w-full gap-5 text-left sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-line bg-surface/70 p-6 backdrop-blur transition hover:border-line-strong"
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-bright">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {f.icon}
                </svg>
              </span>
              <h3 className="font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">{f.body}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-line py-6 text-center text-xs text-ink-faint">
        Plain Pipeline — refreshingly simple.
      </footer>
    </div>
  );
}
