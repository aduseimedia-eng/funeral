"use client";
import Link from "next/link";
import { useEffect, useRef, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookHeart,
  Heart,
  Users,
  QrCode,
  Mic,
  UserRoundCog,
  ChartNoAxesCombined,
  ArrowUpFromLine,
  Settings,
  ArrowUpRight,
  ArrowLeft,
  Menu,
  X,
  ShieldCheck,
  ScrollText,
  Activity,
  Flower2,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/common/ui";
import { useDemo } from "@/components/providers";
import { Role } from "@/lib/types";
import { users } from "@/lib/mock-data";
export const menuItems = {
  family: [
    ["", "Overview", LayoutDashboard],
    ["campaigns", "My campaigns", BookHeart],
    ["contributions", "Contributions", Heart],
    ["donors", "Donor register", Users],
    ["qr", "QR codes", QrCode],
    ["mc", "MC management", Mic],
    ["administrators", "Family administrators", UserRoundCog],
    ["reports", "Reports & analytics", ChartNoAxesCombined],
    ["withdrawals", "Withdrawal requests", ArrowUpFromLine],
    ["settings", "Settings", Settings],
  ],
  donor: [
    ["", "Overview", LayoutDashboard],
    ["history", "Contribution history", Heart],
    ["preferences", "Acknowledgements", BookHeart],
    ["settings", "Profile settings", Settings],
  ],
  mc: [
    ["", "Live announcements", Mic],
    ["campaigns", "Assigned campaigns", BookHeart],
    ["announced", "Announcement history", ScrollText],
    ["settings", "Settings", Settings],
  ],
  admin: [
    ["", "Overview", LayoutDashboard],
    ["users", "User management", Users],
    ["campaigns", "Campaign management", BookHeart],
    ["transactions", "Transaction monitoring", Activity],
    ["reports", "Reports & analytics", ChartNoAxesCombined],
    ["audit", "Audit log", ScrollText],
    ["settings", "Platform settings", Settings],
  ],
} as const;
export function DashboardShell({
  role,
  section,
  children,
}: {
  role: Role;
  section: string;
  children: ReactNode;
}) {
  const { state, setState, ready } = useDemo();
  const [open, setOpen] = useState(false);
  const sidebar = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebar.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const closeOnResize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };
    const keys = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab") return;
      const items = Array.from(
        sidebar.current?.querySelectorAll<HTMLElement>(
          "a[href],button:not(:disabled)",
        ) || [],
      ).filter((el) => el.getClientRects().length);
      const first = items[0],
        last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("resize", closeOnResize);
    document.addEventListener("keydown", keys);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", keys);
      window.removeEventListener("resize", closeOnResize);
      menuButton.current?.focus();
    };
  }, [open]);
  const router = useRouter();
  const user =
    state.user?.role === role
      ? state.user
      : state.demoUsers.find((u) => u.role === role)!;
  const title =
    role === "family"
      ? "Family workspace"
      : role === "donor"
        ? "Contributor workspace"
        : role === "mc"
          ? "MC workspace"
          : "Platform administration";
  const current =
    menuItems[role].find((x) => x[0] === section)?.[1] || "Overview";
  return (
    <div className="dashboard">
      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}
      <aside
        ref={sidebar}
        id="dashboard-sidebar"
        role={open ? "dialog" : undefined}
        aria-modal={open || undefined}
        aria-label="Workspace navigation"
        className={`sidebar ${open ? "open" : ""}`}
      >
        <button
          className="icon-button sidebar-close"
          aria-label="Close dashboard menu"
          onClick={() => setOpen(false)}
        >
          <X size={22} />
        </button>
        <Logo />
        <div className="workspace-label">{title.toUpperCase()}</div>
        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          {menuItems[role].map(([path, label, Icon]) => (
            <Link
              className={section === path ? "active" : ""}
              aria-current={section === path ? "page" : undefined}
              key={path}
              onClick={() => setOpen(false)}
              href={`/dashboard/${role}/${path ? path + "/" : ""}`}
            >
              <Icon />
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <Flower2 size={23} strokeWidth={1} />
            <strong>Here for your family.</strong>
            <p>A thoughtful space for moments that matter.</p>
            <Link href="/#faq">
              Help & guidance <ArrowUpRight size={12} />
            </Link>
          </div>
          <Link className="text-link" href="/">
            <ArrowLeft size={13} />
            Back to website
          </Link>
          <button
            className="text-link"
            style={{
              background: "none",
              border: 0,
              padding: 0,
              marginTop: 15,
              fontSize: 10,
              color: "#89917c",
            }}
            onClick={() => {
              setState((s) => ({ ...s, user: null }));
              router.push("/login/");
            }}
          >
            <LogOut size={13} />
            Leave demo
          </button>
        </div>
      </aside>
      <div className="dashboard-main" inert={open}>
        <header className="dash-header">
          <div className="dash-header-title">
            <button
              className="icon-button mobile-dash-toggle"
              aria-label="Toggle dashboard menu"
              ref={menuButton}
              aria-controls="dashboard-sidebar"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <Menu size={19} />
            </button>
            <span>{title}</span>
            <span style={{ color: "#b4baa8" }}>/</span>
            <span>{current}</span>
          </div>
          <div className="dash-header-actions">
            <select
              aria-label="Switch demo role"
              value={role}
              onChange={(e) => {
                const next = e.target.value as Role;
                setState((s) => ({
                  ...s,
                  user: s.demoUsers.find((u) => u.role === next)!,
                }));
                router.push(`/dashboard/${next}/`);
              }}
            >
              <option value="family">Family organiser demo</option>
              <option value="donor">Contributor demo</option>
              <option value="mc">Funeral MC demo</option>
              <option value="admin">Superadmin demo</option>
            </select>
            <div className="dash-user">
              <span className="avatar">
                {user.name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")}
              </span>
              <div>
                <strong>{user.name}</strong>
                <small>
                  {role === "family"
                    ? "Family organiser"
                    : role === "admin"
                      ? "Superadmin"
                      : role === "mc"
                        ? "Funeral MC"
                        : "Contributor"}
                </small>
              </div>
            </div>
          </div>
        </header>
        <main className="dash-content">
          {ready &&
            role === "family" &&
            state.campaigns.filter(
              (c) => c.id === "kwasi-mensah" || c.id.startsWith("demo-"),
            ).length > 1 && (
              <div className="family-campaign-select">
                <label htmlFor="active-memorial">Family memorial</label>
                <select
                  id="active-memorial"
                  value={state.activeCampaignId}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      activeCampaignId: e.target.value,
                    }))
                  }
                >
                  {state.campaigns
                    .filter(
                      (c) =>
                        c.id === "kwasi-mensah" || c.id.startsWith("demo-"),
                    )
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          {ready ? (
            children
          ) : (
            <div className="loading-state">
              <div className="spinner" />
              <p>Preparing your demo workspace…</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
