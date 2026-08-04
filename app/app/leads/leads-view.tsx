"use client";

import { useState, useTransition } from "react";
import { Modal, Field, inputCls, btnPrimary, btnGhost } from "@/components/ui";
import { fmtMoney, fmtDate, isOverdue, isToday, initials } from "@/lib/format";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/lib/types";
import { saveLead, setLeadStatus, deleteLead } from "./actions";

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-blue-soft text-blue",
  contacted: "bg-amber-soft text-amber",
  qualified: "bg-accent-soft text-accent-bright",
  won: "bg-green-soft text-green",
  lost: "bg-red-soft text-red",
};

export function LeadsView({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<"all" | "open" | LeadStatus>("open");
  const [editing, setEditing] = useState<Lead | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [, startTransition] = useTransition();

  const filtered = leads.filter((l) => {
    if (filter === "all") return true;
    if (filter === "open") return l.status !== "won" && l.status !== "lost";
    return l.status === filter;
  });

  const openModal = (lead: Lead | null) => {
    setEditing(lead);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { value: "open", label: "Open" },
              { value: "all", label: "All" },
              ...LEAD_STATUSES,
            ] as { value: "all" | "open" | LeadStatus; label: string }[]
          ).map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                filter === f.value
                  ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-[0_4px_14px_-4px_rgba(168,85,247,0.6)]"
                  : "border border-line-strong bg-white/[0.03] text-ink-dim hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={() => openModal(null)} className={btnPrimary}>
          <PlusIcon /> New lead
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState onAdd={() => openModal(null)} />
      ) : (
        <div className="glass overflow-hidden rounded-2xl">
          {filtered.map((lead, i) => (
            <div
              key={lead.id}
              className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 transition hover:bg-white/[0.04] ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <button
                onClick={() => openModal(lead)}
                className="flex min-w-0 flex-1 basis-52 items-center gap-3 text-left"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/35 to-accent-2/25 text-xs font-semibold text-ink shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
                  {initials(lead.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">
                    {lead.name}
                  </span>
                  <span className="block truncate text-xs text-ink-faint">
                    {lead.company || lead.email || "—"}
                  </span>
                </span>
              </button>

              <div className="w-24 text-sm font-medium text-ink">
                {lead.value > 0 ? fmtMoney(lead.value) : <span className="text-ink-faint">—</span>}
              </div>

              <div className="min-w-0 flex-1 basis-48">
                {lead.next_action ? (
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowIcon />
                    <span className="truncate text-ink-dim">{lead.next_action}</span>
                    {lead.next_action_date && (
                      <span
                        className={`shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium ${
                          isOverdue(lead.next_action_date)
                            ? "bg-red-soft text-red"
                            : isToday(lead.next_action_date)
                              ? "bg-amber-soft text-amber"
                              : "text-ink-faint"
                        }`}
                      >
                        {isToday(lead.next_action_date)
                          ? "Today"
                          : fmtDate(lead.next_action_date)}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs italic text-ink-faint">
                    No next action set
                  </span>
                )}
              </div>

              <select
                value={lead.status}
                onChange={(e) =>
                  startTransition(() =>
                    setLeadStatus(lead.id, e.target.value)
                  )
                }
                className={`cursor-pointer appearance-none rounded-full border-0 px-3 py-1 text-xs font-medium outline-none ${statusStyles[lead.status]}`}
              >
                {LEAD_STATUSES.map((s) => (
                  <option key={s.value} value={s.value} className="bg-surface text-ink">
                    {s.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  if (confirm(`Delete lead "${lead.name}"?`))
                    startTransition(() => deleteLead(lead.id));
                }}
                aria-label="Delete lead"
                className="rounded-lg p-2 text-ink-faint transition hover:bg-red-soft hover:text-red"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}

      <LeadModal
        key={editing?.id ?? "new"}
        open={modalOpen}
        lead={editing}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

function LeadModal({
  open,
  lead,
  onClose,
}: {
  open: boolean;
  lead: Lead | null;
  onClose: () => void;
}) {
  const handleSubmit = async (formData: FormData) => {
    await saveLead(formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={lead ? "Edit lead" : "New lead"}>
      <form action={handleSubmit} className="space-y-4">
        {lead && <input type="hidden" name="id" value={lead.id} />}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" className="col-span-2 sm:col-span-1">
            <input name="name" required defaultValue={lead?.name} placeholder="Jordan Smith" className={inputCls} />
          </Field>
          <Field label="Company" className="col-span-2 sm:col-span-1">
            <input name="company" defaultValue={lead?.company} placeholder="Acme Inc." className={inputCls} />
          </Field>
          <Field label="Email" className="col-span-2 sm:col-span-1">
            <input name="email" type="email" defaultValue={lead?.email} placeholder="jordan@acme.com" className={inputCls} />
          </Field>
          <Field label="Phone" className="col-span-2 sm:col-span-1">
            <input name="phone" defaultValue={lead?.phone} placeholder="(555) 123-4567" className={inputCls} />
          </Field>
          <Field label="Deal value ($)">
            <input name="value" type="number" min="0" step="1" defaultValue={lead?.value || ""} placeholder="0" className={inputCls} />
          </Field>
          <Field label="Status">
            <select name="status" defaultValue={lead?.status ?? "new"} className={inputCls}>
              {LEAD_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Next action" className="col-span-2 sm:col-span-1">
            <input name="next_action" defaultValue={lead?.next_action} placeholder="Send follow-up email" className={inputCls} />
          </Field>
          <Field label="Action date" className="col-span-2 sm:col-span-1">
            <input name="next_action_date" type="date" defaultValue={lead?.next_action_date ?? ""} className={inputCls} />
          </Field>
          <Field label="Notes" className="col-span-2">
            <textarea name="notes" rows={3} defaultValue={lead?.notes} placeholder="Anything worth remembering…" className={inputCls} />
          </Field>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={btnGhost}>
            Cancel
          </button>
          <button type="submit" className={btnPrimary}>
            {lead ? "Save changes" : "Add lead"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong py-16 text-center">
      <p className="font-medium text-ink">No leads here yet</p>
      <p className="mt-1 text-sm text-ink-dim">
        Add your first lead and give it a next action.
      </p>
      <button onClick={onAdd} className={`${btnPrimary} mt-5`}>
        <PlusIcon /> New lead
      </button>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-accent-bright">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" />
    </svg>
  );
}
