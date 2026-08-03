"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const STATUSES = ["todo", "in_progress", "done"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

function revalidate() {
  revalidatePath("/app");
  revalidatePath("/app/tasks");
}

export async function saveTask(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = Number(formData.get("id") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const status = String(formData.get("status") ?? "todo");
  const priority = String(formData.get("priority") ?? "medium");
  const task = {
    title,
    description: String(formData.get("description") ?? "").trim(),
    status: STATUSES.includes(status) ? status : "todo",
    priority: PRIORITIES.includes(priority) ? priority : "medium",
    due_date: String(formData.get("due_date") ?? "") || null,
  };

  if (id) {
    db.prepare(
      `UPDATE tasks SET title=@title, description=@description, status=@status,
       priority=@priority, due_date=@due_date, updated_at=datetime('now')
       WHERE id=@id AND user_id=@user_id`
    ).run({ ...task, id, user_id: user.id });
  } else {
    db.prepare(
      `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
       VALUES (@user_id, @title, @description, @status, @priority, @due_date)`
    ).run({ ...task, user_id: user.id });
  }
  revalidate();
}

export async function moveTask(id: number, status: string): Promise<void> {
  const user = await requireUser();
  if (!STATUSES.includes(status)) return;
  db.prepare(
    "UPDATE tasks SET status=?, updated_at=datetime('now') WHERE id=? AND user_id=?"
  ).run(status, id, user.id);
  revalidate();
}

export async function deleteTask(id: number): Promise<void> {
  const user = await requireUser();
  db.prepare("DELETE FROM tasks WHERE id=? AND user_id=?").run(id, user.id);
  revalidate();
}
