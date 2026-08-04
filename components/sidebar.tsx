"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  LogOut,
  SquareKanban,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/app/(auth)/auth-form";
import { logoutAction } from "@/app/(auth)/actions";
import { initials } from "@/lib/format";
import type { User } from "@/lib/types";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/app", label: "Dashboard", icon: LayoutGrid },
  { href: "/app/leads", label: "Leads", icon: Users },
  { href: "/app/tasks", label: "Tasks", icon: SquareKanban },
  { href: "/app/goals", label: "Goals", icon: Target },
];

function NavLinks({ vertical }: { vertical: boolean }) {
  const pathname = usePathname();
  return (
    <>
      {links.map((l) => {
        const active =
          l.href === "/app" ? pathname === "/app" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-gradient-to-r from-accent/25 to-accent-2/15 text-ink shadow-[inset_0_0_0_1px_rgba(167,139,250,0.25)]"
                : "text-ink-dim hover:bg-white/[0.05] hover:text-ink"
            } ${vertical ? "" : "shrink-0"}`}
          >
            <l.icon
              size={17}
              strokeWidth={1.9}
              className={active ? "text-accent-bright" : ""}
            />
            {l.label}
          </Link>
        );
      })}
    </>
  );
}

export function Sidebar({ user }: { user: User }) {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="sticky top-0 hidden h-screen shrink-0 p-4 pr-0 md:block">
        <aside className="glass flex h-full w-60 flex-col rounded-2xl">
          <div className="flex items-center gap-2.5 px-5 py-6">
            <Logo size={28} />
            <span className="font-display font-semibold tracking-tight text-ink">
              Plain Pipeline
            </span>
          </div>
          <nav className="flex flex-1 flex-col gap-1.5 px-3">
            <NavLinks vertical />
          </nav>
          <div className="border-t border-line p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/40 to-accent-2/30 text-xs font-semibold text-ink shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                {initials(user.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                <p className="truncate text-xs text-ink-faint">{user.email}</p>
              </div>
            </div>
            <form action={logoutAction} className="mt-3">
              <button className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-ink-dim transition hover:bg-white/[0.05] hover:text-ink">
                <LogOut size={15} strokeWidth={1.9} />
                Sign out
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 border-b border-line bg-[#0a0a11]/95 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Logo size={24} />
            <span className="font-display text-sm font-semibold text-ink">
              Plain Pipeline
            </span>
          </div>
          <form action={logoutAction}>
            <button className="text-xs font-medium text-ink-dim">Sign out</button>
          </form>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
          <NavLinks vertical={false} />
        </nav>
      </div>
    </>
  );
}
