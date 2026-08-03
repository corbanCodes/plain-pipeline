"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/app/(auth)/auth-form";
import { logoutAction } from "@/app/(auth)/actions";
import { initials } from "@/lib/format";
import type { User } from "@/lib/types";

const links = [
  {
    href: "/app",
    label: "Dashboard",
    icon: <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 12h8v9h-8zM3 15h8v6H3z" />,
  },
  {
    href: "/app/leads",
    label: "Leads",
    icon: (
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    ),
  },
  {
    href: "/app/tasks",
    label: "Tasks",
    icon: <path d="M9 5H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4M15 5h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-4M9 3h6v18H9z" />,
  },
  {
    href: "/app/goals",
    label: "Goals",
    icon: (
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    ),
  },
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
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-accent-soft text-accent-bright"
                : "text-ink-dim hover:bg-surface-2 hover:text-ink"
            } ${vertical ? "" : "shrink-0"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {l.icon}
            </svg>
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
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface/60 md:flex">
        <div className="flex items-center gap-2.5 px-5 py-6">
          <Logo size={26} />
          <span className="font-semibold tracking-tight text-ink">Plain Pipeline</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          <NavLinks vertical />
        </nav>
        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-bright">
              {initials(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{user.name}</p>
              <p className="truncate text-xs text-ink-faint">{user.email}</p>
            </div>
          </div>
          <form action={logoutAction} className="mt-3">
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-dim transition hover:bg-surface-2 hover:text-ink">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Logo size={24} />
            <span className="text-sm font-semibold text-ink">Plain Pipeline</span>
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
