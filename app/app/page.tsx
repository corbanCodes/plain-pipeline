import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fmtMoney, fmtDate, isOverdue, isToday, initials } from "@/lib/format";
import type { Lead, Task, Goal } from "@/lib/types";

export const metadata: Metadata = { title: "Dashboard — Plain Pipeline" };

export default async function DashboardPage() {
  const user = await requireUser();
  const leads = db
    .prepare("SELECT * FROM leads WHERE user_id = ?")
    .all(user.id) as Lead[];
  const tasks = db
    .prepare("SELECT * FROM tasks WHERE user_id = ?")
    .all(user.id) as Task[];
  const goals = db
    .prepare("SELECT * FROM goals WHERE user_id = ?")
    .all(user.id) as Goal[];

  const openLeads = leads.filter((l) => l.status !== "won" && l.status !== "lost");
  const pipelineValue = openLeads.reduce((s, l) => s + l.value, 0);
  const openTasks = tasks.filter((t) => t.status !== "done");
  const dueSoon = openTasks.filter(
    (t) => t.due_date && (isOverdue(t.due_date) || isToday(t.due_date))
  );
  const activeGoals = goals.filter((g) => g.status === "active");
  const avgProgress = activeGoals.length
    ? Math.round(activeGoals.reduce((s, g) => s + g.progress, 0) / activeGoals.length)
    : 0;

  const actionQueue = openLeads
    .filter((l) => l.next_action)
    .sort((a, b) =>
      (a.next_action_date ?? "9999").localeCompare(b.next_action_date ?? "9999")
    )
    .slice(0, 5);

  const upcomingTasks = openTasks
    .filter((t) => t.due_date)
    .sort((a, b) => a.due_date!.localeCompare(b.due_date!))
    .slice(0, 5);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const firstName = user.name.split(" ")[0];

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-ink-faint">{today}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Welcome back, {firstName}
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open leads" value={String(openLeads.length)} href="/app/leads" accent="text-blue" />
        <StatCard label="Pipeline value" value={fmtMoney(pipelineValue)} href="/app/leads" accent="text-accent-bright" />
        <StatCard
          label="Tasks due"
          value={String(dueSoon.length)}
          sub={`${openTasks.length} open in total`}
          href="/app/tasks"
          accent={dueSoon.length > 0 ? "text-amber" : "text-green"}
        />
        <StatCard
          label="Goal progress"
          value={activeGoals.length ? `${avgProgress}%` : "—"}
          sub={`${activeGoals.length} active goal${activeGoals.length === 1 ? "" : "s"}`}
          href="/app/goals"
          accent="text-green"
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Panel title="Next actions" href="/app/leads" linkLabel="All leads">
          {actionQueue.length === 0 ? (
            <Empty text="No next actions queued. Add one to a lead so nothing slips." />
          ) : (
            <ul className="divide-y divide-line">
              {actionQueue.map((lead) => (
                <li key={lead.id} className="flex items-center gap-3 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-semibold text-ink-dim">
                    {initials(lead.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{lead.next_action}</p>
                    <p className="truncate text-xs text-ink-faint">
                      {lead.name}
                      {lead.company ? ` · ${lead.company}` : ""}
                    </p>
                  </div>
                  {lead.next_action_date && (
                    <DateChip iso={lead.next_action_date} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Tasks coming up" href="/app/tasks" linkLabel="Open board">
          {upcomingTasks.length === 0 ? (
            <Empty text="No dated tasks. Head to the board to plan your week." />
          ) : (
            <ul className="divide-y divide-line">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3 py-3">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      task.status === "in_progress" ? "bg-amber" : "bg-blue"
                    }`}
                  />
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                    {task.title}
                  </p>
                  <DateChip iso={task.due_date!} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {activeGoals.length > 0 && (
        <div className="mt-5">
          <Panel title="Goals in motion" href="/app/goals" linkLabel="All goals">
            <div className="grid gap-x-8 gap-y-4 py-2 sm:grid-cols-2">
              {activeGoals.slice(0, 4).map((goal) => (
                <div key={goal.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-ink">{goal.title}</span>
                    <span className="shrink-0 text-xs text-ink-dim">{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-accent-bright"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  href,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  href: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-line bg-surface/60 p-5 transition hover:border-line-strong hover:bg-surface"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</p>
      <p className={`mt-2 text-3xl font-semibold tracking-tight ${accent}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-faint">{sub}</p>}
    </Link>
  );
}

function Panel({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-semibold text-ink">{title}</h2>
        <Link href={href} className="text-xs font-medium text-accent-bright hover:underline">
          {linkLabel} →
        </Link>
      </div>
      {children}
    </div>
  );
}

function DateChip({ iso }: { iso: string }) {
  const overdue = isOverdue(iso);
  const today = isToday(iso);
  return (
    <span
      className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${
        overdue
          ? "bg-red-soft text-red"
          : today
            ? "bg-amber-soft text-amber"
            : "bg-surface-3 text-ink-dim"
      }`}
    >
      {overdue ? `Overdue · ${fmtDate(iso)}` : today ? "Today" : fmtDate(iso)}
    </span>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-ink-faint">{text}</p>;
}
