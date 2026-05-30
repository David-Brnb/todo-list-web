import { NavLink } from "react-router-dom";
import { Compass, Home, User, type LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/cn";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

const items: NavItem[] = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/account", label: "Account", icon: User },
];

export function Sidebar() {
  return (
    <>
      {/* Desktop: persistent left rail */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border-soft bg-surface px-4 py-6 lg:flex">
        <div className="px-2">
          <BrandLogo />
        </div>
        <nav className="mt-8 flex flex-col gap-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 font-inter text-sm font-semibold transition",
                  isActive
                    ? "bg-brand-tint text-brand"
                    : "text-nav-inactive hover:bg-surface-muted hover:text-ink",
                )
              }
            >
              <it.icon className="h-5 w-5" />
              {it.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile: fixed bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border-soft bg-surface lg:hidden">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 font-inter text-xs font-medium transition",
                isActive ? "text-brand" : "text-nav-inactive",
              )
            }
          >
            <it.icon className="h-5 w-5" />
            {it.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
