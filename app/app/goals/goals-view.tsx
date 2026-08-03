"use client";

import { useState, useTransition } from "react";
import { Modal, Field, inputCls, btnPrimary, btnGhost } from "@/components/ui";
import { fmtDate, isOverdue } from "@/lib/format";
import type { Goal, GoalHorizon } from "@/lib/types";
import { saveGoal, setGoalProgress, deleteGoal } from "./actions";

export function GoalsView({ goals }: { goals: Goal[] }) {
  const [editing, setEditing] = useState<Goal | null>(null);
  const [modalHorizon, setModalHorizon] = useState<GoalHorizon | null>(null);

  const sections: { horizon: GoalHorizon; label: string; blurb: string }[] = [
    {
      horizon: "short",
      label: "Short-term goals",
      blurb: "The next few weeks or months.",
    },
    {
      horizon: "long",
      label: "Long-term goals",
      blurb: "The big picture — quarters and years.",
    },
  ];

  return (
    <div className="space-y-10">
      {sections.map((section) => {
        const sectionGoals = goals.filter((g) => g.horizon === section.horizon);
        return (
          <section key={section.horizon}>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-semibold text-ink">{section.label}</h2>
                <p className="text-xs text-ink-faint">{section.blurb}</p>
              </div>
              <button
                onClick={() => {
                  setEditing(null);
                  setModalHorizon(section.horizon);
                }}
                className={btnGhost}
              >
                + New goal
              </button>
            </div>

            {sectionGoals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line-strong py-10 text-center text-sm text-ink-faint">
                Nothing here yet — set your first {section.horizon}-term goal.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {sectionGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={() => {
                      setEditing(goal);
                      setModalHorizon(goal.horizon);
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

      <GoalModal
        key={editing?.id ?? modalHorizon ?? "closed"}
        open={modalHorizon !== null}
        goal={editing}
        defaultHorizon={modalHorizon ?? "short"}
        onClose={() => setModalHorizon(null)}
      />
    </div>
  );
}

function GoalCard({ goal, onEdit }: { goal: Goal; onEdit: () => void }) {
  const [progress, setProgress] = useState(goal.progress);
  const [, startTransition] = useTransition();
  const achieved = goal.status === "achieved";

  const commit = (value: number) =>
    startTransition(() => setGoalProgress(goal.id, value));

  return (
    <div
      className={`rounded-2xl border p-5 transition ${
        achieved
          ? "border-green/25 bg-green-soft/40"
          : "border-line bg-surface/60 hover:border-line-strong"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button onClick={onEdit} className="min-w-0 text-left">
          <p className={`font-medium leading-snug ${achieved ? "text-green" : "text-ink"}`}>
            {achieved && "✓ "}
            {goal.title}
          </p>
          {goal.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-dim">
              {goal.description}
            </p>
          )}
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete goal "${goal.title}"?`))
              startTransition(() => deleteGoal(goal.id));
          }}
          aria-label="Delete goal"
          className="shrink-0 rounded-lg p-1.5 text-ink-faint transition hover:bg-red-soft hover:text-red"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" />
          </svg>
        </button>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-ink-dim">{progress}%</span>
          {goal.target_date && (
            <span
              className={
                !achieved && isOverdue(goal.target_date)
                  ? "font-medium text-red"
                  : "text-ink-faint"
              }
            >
              Target: {fmtDate(goal.target_date)}
            </span>
          )}
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-surface-3">
          <div
            className={`h-full rounded-full transition-all ${
              achieved ? "bg-green" : "bg-gradient-to-r from-accent to-accent-bright"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          onPointerUp={() => commit(progress)}
          onKeyUp={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") commit(progress);
          }}
          aria-label={`Progress for ${goal.title}`}
          className="mt-2 w-full cursor-pointer accent-[#7c5cff]"
        />
        {!achieved && (
          <button
            onClick={() => {
              setProgress(100);
              commit(100);
            }}
            className="mt-2 text-xs font-medium text-green transition hover:underline"
          >
            Mark achieved
          </button>
        )}
      </div>
    </div>
  );
}

function GoalModal({
  open,
  goal,
  defaultHorizon,
  onClose,
}: {
  open: boolean;
  goal: Goal | null;
  defaultHorizon: GoalHorizon;
  onClose: () => void;
}) {
  const handleSubmit = async (formData: FormData) => {
    await saveGoal(formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={goal ? "Edit goal" : "New goal"}>
      <form action={handleSubmit} className="space-y-4">
        {goal && <input type="hidden" name="id" value={goal.id} />}
        <input type="hidden" name="progress" value={goal?.progress ?? 0} />
        <Field label="Title">
          <input name="title" required defaultValue={goal?.title} placeholder="Reach $10k monthly revenue" className={inputCls} />
        </Field>
        <Field label="Description">
          <textarea name="description" rows={3} defaultValue={goal?.description} placeholder="What does done look like?" className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Horizon">
            <select name="horizon" defaultValue={goal?.horizon ?? defaultHorizon} className={inputCls}>
              <option value="short">Short-term</option>
              <option value="long">Long-term</option>
            </select>
          </Field>
          <Field label="Target date">
            <input name="target_date" type="date" defaultValue={goal?.target_date ?? ""} className={inputCls} />
          </Field>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={btnGhost}>
            Cancel
          </button>
          <button type="submit" className={btnPrimary}>
            {goal ? "Save changes" : "Add goal"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
