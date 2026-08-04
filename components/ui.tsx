"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export const inputCls =
  "w-full rounded-xl border border-line-strong bg-white/[0.04] px-3.5 py-2.5 text-sm text-ink " +
  "placeholder:text-ink-faint outline-none transition focus:border-accent focus:bg-white/[0.06] focus:ring-2 focus:ring-accent/30";

export const btnPrimary =
  "btn-gradient inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white " +
  "focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong bg-white/[0.03] px-4 py-2.5 text-sm font-medium " +
  "text-ink-dim transition hover:border-accent hover:text-ink focus:outline-none";

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      {children}
    </label>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="backdrop-fade fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-[8vh] backdrop-blur-md"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-pop gradient-border w-full max-w-lg rounded-3xl p-[1px]">
        <div className="rounded-3xl bg-[#0c0c14]/95 p-6 shadow-2xl shadow-black/60 sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-xl p-2 text-ink-faint transition hover:bg-white/[0.06] hover:text-ink"
            >
              <X size={17} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
