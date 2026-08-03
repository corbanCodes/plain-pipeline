"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const STATUSES = ["new", "contacted", "qualified", "won", "lost"];

function revalidate() {
  revalidatePath("/app");
  revalidatePath("/app/leads");
}

export async function saveLead(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = Number(formData.get("id") ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const status = String(formData.get("status") ?? "new");
  const lead = {
    name,
    company: String(formData.get("company") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    status: STATUSES.includes(status) ? status : "new",
    value: Math.max(0, Number(formData.get("value") ?? 0) || 0),
    next_action: String(formData.get("next_action") ?? "").trim(),
    next_action_date: String(formData.get("next_action_date") ?? "") || null,
    notes: String(formData.get("notes") ?? "").trim(),
  };

  if (id) {
    db.prepare(
      `UPDATE leads SET name=@name, company=@company, email=@email, phone=@phone,
       status=@status, value=@value, next_action=@next_action,
       next_action_date=@next_action_date, notes=@notes, updated_at=datetime('now')
       WHERE id=@id AND user_id=@user_id`
    ).run({ ...lead, id, user_id: user.id });
  } else {
    db.prepare(
      `INSERT INTO leads (user_id, name, company, email, phone, status, value,
       next_action, next_action_date, notes)
       VALUES (@user_id, @name, @company, @email, @phone, @status, @value,
       @next_action, @next_action_date, @notes)`
    ).run({ ...lead, user_id: user.id });
  }
  revalidate();
}

export async function setLeadStatus(id: number, status: string): Promise<void> {
  const user = await requireUser();
  if (!STATUSES.includes(status)) return;
  db.prepare(
    "UPDATE leads SET status=?, updated_at=datetime('now') WHERE id=? AND user_id=?"
  ).run(status, id, user.id);
  revalidate();
}

export async function deleteLead(id: number): Promise<void> {
  const user = await requireUser();
  db.prepare("DELETE FROM leads WHERE id=? AND user_id=?").run(id, user.id);
  revalidate();
}
