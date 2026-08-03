"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

function revalidate() {
  revalidatePath("/app");
  revalidatePath("/app/goals");
}

export async function saveGoal(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = Number(formData.get("id") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const horizon = String(formData.get("horizon") ?? "short");
  const goal = {
    title,
    description: String(formData.get("description") ?? "").trim(),
    horizon: horizon === "long" ? "long" : "short",
    target_date: String(formData.get("target_date") ?? "") || null,
    progress: Math.min(100, Math.max(0, Number(formData.get("progress") ?? 0) || 0)),
  };

  if (id) {
    db.prepare(
      `UPDATE goals SET title=@title, description=@description, horizon=@horizon,
       target_date=@target_date, progress=@progress,
       status = CASE WHEN @progress >= 100 THEN 'achieved' ELSE 'active' END
       WHERE id=@id AND user_id=@user_id`
    ).run({ ...goal, id, user_id: user.id });
  } else {
    db.prepare(
      `INSERT INTO goals (user_id, title, description, horizon, target_date, progress)
       VALUES (@user_id, @title, @description, @horizon, @target_date, @progress)`
    ).run({ ...goal, user_id: user.id });
  }
  revalidate();
}

export async function setGoalProgress(id: number, progress: number): Promise<void> {
  const user = await requireUser();
  const p = Math.min(100, Math.max(0, Math.round(progress) || 0));
  db.prepare(
    `UPDATE goals SET progress=?,
     status = CASE WHEN ? >= 100 THEN 'achieved' ELSE 'active' END
     WHERE id=? AND user_id=?`
  ).run(p, p, id, user.id);
  revalidate();
}

export async function deleteGoal(id: number): Promise<void> {
  const user = await requireUser();
  db.prepare("DELETE FROM goals WHERE id=? AND user_id=?").run(id, user.id);
  revalidate();
}
