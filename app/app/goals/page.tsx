import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Goal } from "@/lib/types";
import { GoalsView } from "./goals-view";

export const metadata: Metadata = { title: "Goals — Plain Pipeline" };

export default async function GoalsPage() {
  const user = await requireUser();
  const goals = db
    .prepare(
      `SELECT * FROM goals WHERE user_id = ?
       ORDER BY status = 'achieved', (target_date IS NULL), target_date, created_at DESC`
    )
    .all(user.id) as Goal[];

  const active = goals.filter((g) => g.status === "active").length;
  const achieved = goals.filter((g) => g.status === "achieved").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">Goals</h1>
        <p className="mt-1 text-sm text-ink-dim">
          {active} in progress · {achieved} achieved
        </p>
      </div>
      <GoalsView goals={goals} />
    </div>
  );
}
