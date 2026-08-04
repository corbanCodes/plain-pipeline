"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarCheck,
  KanbanSquare,
  Lock,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Logo } from "@/app/(auth)/auth-form";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export function Landing() {
  return (
    <div className="relative overflow-x-clip">
      <Orbs />
      <Nav />
      <Hero />
      <Mockup />
      <Stats />
      <Bento />
      <CTA />
      <footer className="border-t border-line py-8 text-center text-xs text-ink-faint">
        Plain Pipeline — refreshingly simple. Built for people who close.
      </footer>
    </div>
  );
}

function Orbs() {
  return (
    <div aria-hidden className="absolute inset-x-0 top-0 h-[900px] overflow-hidden">
      <div className="orb left-[8%] top-[-120px] h-[420px] w-[420px] bg-[#8b5cf6]/50" />
      <div className="orb right-[5%] top-[60px] h-[360px] w-[360px] bg-[#d946ef]/40 [animation-delay:-6s]" />
      <div className="orb left-[38%] top-[380px] h-[300px] w-[300px] bg-[#22d3ee]/25 [animation-delay:-12s]" />
    </div>
  );
}

function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="sticky top-4 z-50 mx-auto mt-4 flex w-[min(94%,64rem)] items-center justify-between rounded-2xl px-4 py-3 glass"
    >
      <Link href="/" className="flex items-center gap-2.5">
        <Logo size={30} />
        <span className="font-display text-[17px] font-semibold tracking-tight">
          Plain Pipeline
        </span>
      </Link>
      <nav className="flex items-center gap-1.5">
        <a
          href="#features"
          className="hidden rounded-xl px-4 py-2 text-sm font-medium text-ink-dim transition hover:text-ink sm:block"
        >
          Features
        </a>
        <Link
          href="/login"
          className="rounded-xl px-4 py-2 text-sm font-medium text-ink-dim transition hover:text-ink"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="btn-gradient rounded-xl px-4 py-2 text-sm font-semibold text-white"
        >
          Get started
        </Link>
      </nav>
    </motion.header>
  );
}

function Hero() {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="show"
      className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-24 text-center sm:pt-32"
    >
      <motion.p
        variants={fadeUp}
        className="mb-7 flex items-center gap-2 rounded-full border border-line-strong bg-surface/70 px-4 py-1.5 text-xs font-medium backdrop-blur"
      >
        <Sparkles size={13} className="text-fuchsia" />
        <span className="shimmer">The CRM that stays out of your way</span>
      </motion.p>

      <motion.h1
        variants={fadeUp}
        className="font-display text-[clamp(2.9rem,8vw,5.2rem)] font-bold leading-[1.02] tracking-tight"
      >
        Your pipeline,
        <br />
        <span className="text-gradient">beautifully plain.</span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="mt-7 max-w-xl text-lg leading-relaxed text-ink-dim"
      >
        Leads with next actions. A board for your week. Goals that actually move.
        One sleek workspace — zero busywork.
      </motion.p>

      <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/signup"
          className="btn-gradient group flex items-center gap-2 rounded-2xl px-7 py-3.5 text-[15px] font-semibold text-white"
        >
          Start for free
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/login"
          className="rounded-2xl border border-line-strong bg-surface/50 px-7 py-3.5 text-[15px] font-semibold text-ink-dim backdrop-blur transition hover:border-accent hover:text-ink"
        >
          Sign in
        </Link>
      </motion.div>
    </motion.section>
  );
}

function Mockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.35, ease }}
      style={{ perspective: 1200 }}
      className="mx-auto mt-20 w-[min(94%,58rem)] px-0 sm:px-6"
    >
      <div className="gradient-border rounded-3xl p-2 shadow-[0_40px_120px_-30px_rgba(139,92,246,0.35)]">
        <div className="overflow-hidden rounded-2xl bg-[#0a0a11]">
          {/* window chrome */}
          <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 rounded-md bg-surface-2 px-3 py-0.5 text-[10px] text-ink-faint">
              plainpipeline.app
            </span>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-3">
            {[
              { label: "Pipeline value", value: "$48,200", color: "text-gradient" },
              { label: "Open leads", value: "14", color: "text-blue" },
              { label: "Tasks due today", value: "3", color: "text-amber" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.5, ease }}
                className="rounded-xl border border-line bg-surface/80 p-4 text-left"
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-ink-faint">
                  {s.label}
                </p>
                <p className={`mt-1 font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-4 px-5 pb-6 sm:grid-cols-3">
            {[
              {
                title: "To do",
                dot: "bg-blue",
                cards: ["Follow up with Meridian Co.", "Prep Thursday demo"],
              },
              {
                title: "In progress",
                dot: "bg-amber",
                cards: ["Proposal for Acme — $12k", "Onboarding checklist"],
              },
              { title: "Done", dot: "bg-green", cards: ["Signed: Northwind 🎉"] },
            ].map((col, i) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.12, duration: 0.5, ease }}
                className="rounded-xl border border-line bg-surface/60 p-3 text-left"
              >
                <div className="mb-2.5 flex items-center gap-2 px-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${col.dot}`} />
                  <span className="text-xs font-semibold text-ink-dim">{col.title}</span>
                </div>
                <div className="space-y-2">
                  {col.cards.map((c) => (
                    <div
                      key={c}
                      className="rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-xs text-ink-dim"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Stats() {
  const stats = [
    { value: "30 sec", label: "from signup to first lead" },
    { value: "Zero", label: "configuration required" },
    { value: "1 place", label: "for leads, tasks & goals" },
  ];
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto mt-24 grid w-[min(94%,58rem)] gap-4 sm:grid-cols-3"
    >
      {stats.map((s) => (
        <motion.div key={s.label} variants={fadeUp} className="text-center">
          <p className="font-display text-3xl font-bold text-gradient">{s.value}</p>
          <p className="mt-1 text-sm text-ink-faint">{s.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

const tiles = [
  {
    icon: Users,
    title: "An action stream, not a database",
    body: "Every lead carries one clear next step with a date. Overdue turns red, today turns amber — your morning starts itself.",
    className: "sm:col-span-2",
  },
  {
    icon: KanbanSquare,
    title: "Drag. Drop. Done.",
    body: "A slick three-column board with priorities and due dates.",
    className: "",
  },
  {
    icon: Target,
    title: "Goals that move",
    body: "Short-term targets, long-term ambitions, satisfying progress bars.",
    className: "",
  },
  {
    icon: Zap,
    title: "Fast everywhere",
    body: "No loading spinners, no bloat. Just you and your pipeline.",
    className: "",
  },
  {
    icon: CalendarCheck,
    title: "Today at a glance",
    body: "A dashboard that answers one question: what should I do next?",
    className: "",
  },
  {
    icon: Lock,
    title: "Yours alone",
    body: "Private accounts, encrypted passwords, your data stays your data.",
    className: "",
  },
];

function Bento() {
  return (
    <section id="features" className="mx-auto mt-28 w-[min(94%,58rem)]">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-10 text-center"
      >
        <h2 className="font-display text-4xl font-bold tracking-tight">
          Everything you need. <span className="text-gradient">Nothing you don&apos;t.</span>
        </h2>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-4 sm:grid-cols-3"
      >
        {tiles.map((t) => (
          <motion.div
            key={t.title}
            variants={fadeUp}
            className={`card-hover glass rounded-2xl p-6 ${t.className}`}
          >
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-bright">
              <t.icon size={20} strokeWidth={1.8} />
            </span>
            <h3 className="font-display text-lg font-semibold text-ink">{t.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-dim">{t.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function CTA() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto my-28 w-[min(94%,58rem)]"
    >
      <div className="gradient-border relative overflow-hidden rounded-3xl px-8 py-16 text-center">
        <div className="orb left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 bg-[#8b5cf6]/30" />
        <h2 className="relative font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Ready to get <span className="text-gradient">moving?</span>
        </h2>
        <p className="relative mt-4 text-ink-dim">
          Free to start. Your first lead takes 30 seconds.
        </p>
        <div className="relative mt-8">
          <Link
            href="/signup"
            className="btn-gradient inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-[15px] font-semibold text-white"
          >
            Create your account <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
