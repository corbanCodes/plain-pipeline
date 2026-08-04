import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fmtMoney } from "@/lib/format";
import type { Lead } from "@/lib/types";
import { LeadsView } from "./leads-view";

export const metadata: Metadata = { title: "Leads — Plain Pipeline" };

export default async function LeadsPage() {
  const user = await requireUser();
  const leads = db
    .prepare(
      `SELECT * FROM leads WHERE user_id = ?
       ORDER BY (next_action_date IS NULL), next_action_date, updated_at DESC`
    )
    .all(user.id) as Lead[];

  const open = leads.filter((l) => l.status !== "won" && l.status !== "lost");
  const pipelineValue = open.reduce((s, l) => s + l.value, 0);
  const wonValue = leads
    .filter((l) => l.status === "won")
    .reduce((s, l) => s + l.value, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-ink-dim">
            {open.length} open · {fmtMoney(pipelineValue)} in the pipeline ·{" "}
            {fmtMoney(wonValue)} won
          </p>
        </div>
      </div>
      <LeadsView leads={leads} />
    </div>
  );
}
