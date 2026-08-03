import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Task } from "@/lib/types";
import { TaskBoard } from "./task-board";

export const metadata: Metadata = { title: "Tasks — Plain Pipeline" };

export default async function TasksPage() {
  const user = await requireUser();
  const tasks = db
    .prepare(
      `SELECT * FROM tasks WHERE user_id = ?
       ORDER BY (due_date IS NULL), due_date,
       CASE priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
       created_at DESC`
    )
    .all(user.id) as Task[];

  const open = tasks.filter((t) => t.status !== "done").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
        <p className="mt-1 text-sm text-ink-dim">
          {open} open task{open === 1 ? "" : "s"} — drag cards between columns to
          update them.
        </p>
      </div>
      <TaskBoard tasks={tasks} />
    </div>
  );
}
