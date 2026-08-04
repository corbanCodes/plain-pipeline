"use client";

import { useEffect, useState, useTransition } from "react";
import { Modal, Field, inputCls, btnPrimary, btnGhost } from "@/components/ui";
import { fmtDate, isOverdue, isToday } from "@/lib/format";
import {
  TASK_PRIORITIES,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/types";
import { saveTask, moveTask, deleteTask } from "./actions";

const COLUMNS: { key: TaskStatus; label: string; dot: string }[] = [
  { key: "todo", label: "To do", dot: "bg-blue" },
  { key: "in_progress", label: "In progress", dot: "bg-amber" },
  { key: "done", label: "Done", dot: "bg-green" },
];

const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-surface-3 text-ink-dim",
  medium: "bg-blue-soft text-blue",
  high: "bg-amber-soft text-amber",
  urgent: "bg-red-soft text-red",
};

export function TaskBoard({ tasks: serverTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(serverTasks);
  const [editing, setEditing] = useState<Task | null>(null);
  const [modalStatus, setModalStatus] = useState<TaskStatus | null>(null);
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => setTasks(serverTasks), [serverTasks]);

  const onDrop = (status: TaskStatus, e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    const id = Number(e.dataTransfer.getData("text/plain"));
    if (!id) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    startTransition(() => moveTask(id, status));
  };

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(col.key);
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => onDrop(col.key, e)}
              className={`flex min-h-72 flex-col rounded-2xl border bg-white/[0.03] p-3 backdrop-blur-md transition ${
                dragOver === col.key
                  ? "border-accent bg-accent-soft/40 shadow-[0_0_30px_-10px_rgba(139,92,246,0.4)]"
                  : "border-line"
              }`}
            >
              <div className="mb-3 flex items-center justify-between px-1.5">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                  <span className="text-sm font-semibold text-ink">{col.label}</span>
                  <span className="rounded-full bg-surface-3 px-2 py-0.5 text-xs text-ink-dim">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setEditing(null);
                    setModalStatus(col.key);
                  }}
                  aria-label={`Add task to ${col.label}`}
                  className="rounded-lg p-1.5 text-ink-faint transition hover:bg-surface-2 hover:text-ink"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-2.5">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", String(task.id))
                    }
                    onClick={() => {
                      setEditing(task);
                      setModalStatus(task.status);
                    }}
                    className="card-hover group cursor-grab rounded-xl border border-line bg-surface-2/90 p-3.5 active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm font-medium leading-snug ${
                          task.status === "done"
                            ? "text-ink-faint line-through"
                            : "text-ink"
                        }`}
                      >
                        {task.title}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete task "${task.title}"?`))
                            startTransition(() => deleteTask(task.id));
                        }}
                        aria-label="Delete task"
                        className="rounded p-1 text-ink-faint opacity-0 transition group-hover:opacity-100 hover:text-red"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {task.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-dim">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2.5 flex items-center gap-2">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium capitalize ${priorityStyles[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                      {task.due_date && (
                        <span
                          className={`text-[11px] font-medium ${
                            task.status !== "done" && isOverdue(task.due_date)
                              ? "text-red"
                              : task.status !== "done" && isToday(task.due_date)
                                ? "text-amber"
                                : "text-ink-faint"
                          }`}
                        >
                          {isToday(task.due_date) ? "Due today" : fmtDate(task.due_date)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-line py-8 text-xs text-ink-faint">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <TaskModal
        key={editing?.id ?? modalStatus ?? "closed"}
        open={modalStatus !== null}
        task={editing}
        defaultStatus={modalStatus ?? "todo"}
        onClose={() => setModalStatus(null)}
      />
    </div>
  );
}

function TaskModal({
  open,
  task,
  defaultStatus,
  onClose,
}: {
  open: boolean;
  task: Task | null;
  defaultStatus: TaskStatus;
  onClose: () => void;
}) {
  const handleSubmit = async (formData: FormData) => {
    await saveTask(formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={task ? "Edit task" : "New task"}>
      <form action={handleSubmit} className="space-y-4">
        {task && <input type="hidden" name="id" value={task.id} />}
        <input type="hidden" name="status" value={task?.status ?? defaultStatus} />
        <Field label="Title">
          <input name="title" required defaultValue={task?.title} placeholder="Call the venue about Friday" className={inputCls} />
        </Field>
        <Field label="Description">
          <textarea name="description" rows={3} defaultValue={task?.description} placeholder="Optional details…" className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Priority">
            <select name="priority" defaultValue={task?.priority ?? "medium"} className={inputCls}>
              {TASK_PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Due date">
            <input name="due_date" type="date" defaultValue={task?.due_date ?? ""} className={inputCls} />
          </Field>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={btnGhost}>
            Cancel
          </button>
          <button type="submit" className={btnPrimary}>
            {task ? "Save changes" : "Add task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
