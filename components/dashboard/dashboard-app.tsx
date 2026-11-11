"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownToLine,
  Heart,
  Wallet,
  Users,
  Coins,
  QrCode,
  Mic,
  BookHeart,
  CalendarDays,
  Plus,
  ShieldCheck,
  Activity,
  Info,
  Search,
  Check,
  Undo2,
} from "lucide-react";
import { Role, Contribution } from "@/lib/types";
import {
  money,
  totalFor,
  dateLabel,
  mcView,
  csv,
  downloadFile,
} from "@/lib/utils";
import { useDemo } from "@/components/providers";
import { DashboardShell } from "./shell";
import { ContributionTable } from "./contribution-table";
import { AnalyticsChart } from "./charts";
import { Badge, EmptyState, ProgressBar } from "@/components/common/ui";
import {
  FamilyCampaigns,
  CashModal,
  FamilyPeople,
  WithdrawalDemo,
  SettingsView,
} from "./family-views";
import { QRManagement } from "./qr-management";
import { AdminCampaigns, AdminUsers } from "./admin-views";
import { users, mcAssignments, acknowledgementLabels } from "@/lib/mock-data";
export function StatCard({
  label,
  value,
  foot,
  icon: Icon,
}: {
  label: string;
  value: string;
  foot: string;
  icon: typeof Heart;
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        {label}
        <Icon />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-foot">{foot}</div>
    </div>
  );
}
export function DashboardApp({
  role,
  section,
}: {
  role: Role;
  section: string;
}) {
  return (
    <DashboardShell role={role} section={section}>
      {role === "family" ? (
        <FamilyDashboard section={section} />
      ) : role === "donor" ? (
        <DonorDashboard section={section} />
      ) : role === "mc" ? (
        <MCDashboard section={section} />
      ) : (
        <AdminDashboard section={section} />
      )}
    </DashboardShell>
  );
}
function Title({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="dash-title">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div className="dash-title-actions">{children}</div>}
    </div>
  );
}
function FamilyDashboard({ section }: { section: string }) {
  const { state } = useDemo();
  const [cash, setCash] = useState(false);
  const c =
    state.campaigns.find((c) => c.id === state.activeCampaignId) ||
    state.campaigns[0];
  const rows = state.contributions.filter((r) => r.campaignId === c.id);
  if (section === "campaigns") return <FamilyCampaigns />;
  if (section === "qr") return <QRManagement />;
  if (section === "mc" || section === "administrators")
    return <FamilyPeople mc={section === "mc"} />;
  if (section === "withdrawals") return <WithdrawalDemo />;
  if (section === "settings") return <SettingsView role="family" />;
  if (section === "reports") return <Reports rows={rows} />;
  return (
    <>
      <Title
        title={
          section === "contributions"
            ? "Contributions"
            : section === "donors"
              ? "Donor register"
              : "A little clarity. A little comfort."
        }
        description={
          section
            ? "Every gesture of support, thoughtfully accounted for."
            : "Welcome back, Akua. Here’s how your community is coming together."
        }
      >
        <button
          className="btn btn-secondary"
          onClick={() =>
            downloadFile(
              "demo-family-report.csv",
              csv([
                ["DEMO FAMILY CONTRIBUTION REPORT"],
                ["Memorial", "Total verified (GHS)", "Contributors"],
                [
                  c.name,
                  totalFor(rows),
                  rows.filter((r) => r.status === "Verified").length,
                ],
              ]),
            )
          }
        >
          <ArrowDownToLine size={13} />
          Export report
        </button>
        <button className="btn" onClick={() => setCash(true)}>
          <Plus size={14} />
          Record cash
        </button>
      </Title>
      {section ? (
        <>
          <div className="demo-notice mb-20">
            <Info />
            Browser-local demo records. Cash entries are recorded as verified by
            the demo organiser.
          </div>
          <ContributionTable rows={rows} register={section === "donors"} />
        </>
      ) : (
        <>
          <div className="dash-banner">
            <img src={c.image} alt="Fictional memorial portrait" />
            <div>
              <h3>{c.name}</h3>
              <p>
                {c.years} <span style={{ margin: "0 8px" }}>·</span>{" "}
                {dateLabel(c.date)} <span style={{ margin: "0 8px" }}>·</span>{" "}
                {c.location}
              </p>
            </div>
            <Badge>{c.status}</Badge>
            <Link href={`/memorial/?id=${c.id}`}>
              View memorial <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="stats-grid">
            <StatCard
              label="Total verified contributions"
              value={money(totalFor(rows))}
              icon={Wallet}
              foot="All verified demo contributions"
            />
            <StatCard
              label="Digital contributions"
              value={money(totalFor(rows.filter((r) => r.method !== "Cash")))}
              icon={Heart}
              foot="Mobile money & card (demo)"
            />
            <StatCard
              label="Cash contributions"
              value={money(totalFor(rows.filter((r) => r.method === "Cash")))}
              icon={Coins}
              foot="Recorded by family organisers"
            />
            <StatCard
              label="Contributions received"
              value={String(rows.filter((r) => r.status === "Verified").length)}
              icon={Users}
              foot="Every gesture makes a difference"
            />
          </div>
          <OverviewCharts rows={rows} campaignId={c.id} />
          <ContributionTable compact rows={rows} />
          <div className="quick-grid">
            {[
              {
                href: "qr",
                icon: QrCode,
                title: "Share a little easier",
                text: "Generate & download your memorial QR code",
              },
              {
                href: "mc",
                icon: Mic,
                title: "Keep acknowledgements thoughtful",
                text: "Manage your MC and announcement access",
              },
              {
                href: "campaigns",
                icon: BookHeart,
                title: "Tell their story",
                text: "Update the memorial & funeral details",
              },
            ].map((x) => (
              <Link
                key={x.href}
                className="quick-card"
                href={`/dashboard/family/${x.href}/`}
              >
                <x.icon />
                <div>
                  <strong>{x.title}</strong>
                  <p>{x.text}</p>
                </div>
                <ArrowUpRight />
              </Link>
            ))}
          </div>
          <p className="demo-caption">
            Demo workspace · All contributions are illustrative · No funds are
            collected
          </p>
        </>
      )}
      {cash && <CashModal campaignId={c.id} onClose={() => setCash(false)} />}
    </>
  );
}
function OverviewCharts({
  rows,
  campaignId,
}: {
  rows: Contribution[];
  campaignId: string;
}) {
  const { state } = useDemo();
  const [days, setDays] = useState(30);
  const c = state.campaigns.find((c) => c.id === campaignId)!;
  const total = totalFor(rows);
  return (
    <div className="dashboard-grid">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Support over time</h2>
            <p>Every contribution is part of their story.</p>
          </div>
          <select
            aria-label="Chart date range"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={30}>Last 30 days</option>
            <option value={7}>Last 7 days</option>
          </select>
        </div>
        <div className="panel-body">
          <AnalyticsChart rows={rows} days={days} />
          <div className="chart-legend">
            <span>
              <i className="legend-dot" />
              Digital contributions
            </span>
            <span>
              <i className="legend-dot gold" />
              Cash contributions
            </span>
          </div>
        </div>
      </div>
      <div className="panel fundraising-panel">
        <div className="panel-header">
          <h2>Coming together for the family</h2>
          <Heart size={16} color="#a4ad8e" />
        </div>
        <div className="panel-body">
          <div className="fundraising-amount">{money(total)}</div>
          <div className="fundraising-target">
            of {money(c.target)} fundraising goal
          </div>
          <ProgressBar value={(total / c.target) * 100} />
          <div className="fundraising-meta">
            <span>{Math.round((total / c.target) * 100)}% of goal reached</span>
            <span>{money(Math.max(0, c.target - total))} to go</span>
          </div>
          <div className="fundraising-box">
            <CalendarDays />
            <div>
              <strong>A celebration of life</strong>
              <p>
                {dateLabel(c.date)} · {c.location}
              </p>
              <p>Thank you for keeping their memory alive.</p>
            </div>
          </div>
          <Link
            className="text-link mt-20"
            style={{ fontSize: 9 }}
            href={`/memorial/?id=${c.id}`}
          >
            Visit the memorial page <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
export function Reports({ rows }: { rows: Contribution[] }) {
  const { state, toast } = useDemo();
  const [days, setDays] = useState(30);
  return (
    <>
      <Title
        title="The story behind the support."
        description="A clear view of your demonstration contributions and campaign activity."
      >
        <button
          className="btn"
          onClick={() => {
            downloadFile(
              "nsaabode-demo-analytics.csv",
              csv([
                ["DEMO ANALYTICS - NO REAL PAYMENTS"],
                ["Campaign", "Verified (GHS)", "Digital (GHS)", "Cash (GHS)"],
                ...state.campaigns.map((c) => {
                  const rs = rows.filter((r) => r.campaignId === c.id);
                  return [
                    c.name,
                    totalFor(rs),
                    totalFor(rs.filter((r) => r.method !== "Cash")),
                    totalFor(rs.filter((r) => r.method === "Cash")),
                  ];
                }),
              ]),
            );
            toast("Demo analytics report downloaded");
          }}
        >
          <ArrowDownToLine size={14} />
          Download report
        </button>
      </Title>
      <div className="filter-bar">
        <select
          aria-label="Report date range"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value={30}>Last 30 days</option>
          <option value={7}>Last 7 days</option>
        </select>
      </div>
      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Contributions over time</h2>
          </div>
          <div className="panel-body">
            <AnalyticsChart rows={rows} days={days} />
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h2>Digital versus cash</h2>
          </div>
          <div className="panel-body">
            <AnalyticsChart rows={rows} kind="methods" days={days} />
            <div className="chart-legend">
              <span>
                <i className="legend-dot" />
                Digital
              </span>
              <span>
                <i className="legend-dot gold" />
                Cash
              </span>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h2>Contribution amount distribution (GHS)</h2>
          </div>
          <div className="panel-body">
            <AnalyticsChart rows={rows} kind="distribution" days={days} />
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h2>Daily contribution activity</h2>
          </div>
          <div className="panel-body">
            <AnalyticsChart rows={rows} kind="activity" days={days} />
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <h2>Campaign performance</h2>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Memorial</th>
                <th>Verified contributions</th>
                <th>Target</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.campaigns
                .filter((c) => rows.some((r) => r.campaignId === c.id))
                .map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.name}</strong>
                    </td>
                    <td>{money(totalFor(rows, c.id))}</td>
                    <td>{money(c.target)}</td>
                    <td>
                      {Math.round((totalFor(rows, c.id) / c.target) * 100)}%
                    </td>
                    <td>
                      <Badge>{c.status}</Badge>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="note-text">
        All charts use illustrative local records. Exports include all available
        records; chart date filters apply to visualisations.
      </p>
    </>
  );
}
function DonorDashboard({ section }: { section: string }) {
  const { state } = useDemo();
  const user =
    state.user?.role === "donor"
      ? state.user
      : state.demoUsers.find((u) => u.role === "donor")!;
  const rows = state.contributions.filter((c) => c.userId === user.id);
  const verified = rows.filter((c) => c.status === "Verified");
  if (section === "settings" || section === "preferences")
    return (
      <SettingsView role="donor" preferences={section === "preferences"} />
    );
  return (
    <>
      <Title
        title={
          section
            ? "Your gestures of support."
            : `Thank you for being there, ${user.name.split(" ")[0]}.`
        }
        description="Your contributions, your memories, and the families you’ve stood beside."
      >
        <Link href="/campaigns/" className="btn">
          Explore memorials <ArrowUpRight size={14} />
        </Link>
      </Title>
      {!section && (
        <div className="stats-grid">
          <StatCard
            label="Total contributed"
            value={money(totalFor(rows))}
            icon={Heart}
            foot="Verified demonstration contributions"
          />
          <StatCard
            label="Families supported"
            value={String(new Set(verified.map((c) => c.campaignId)).size)}
            icon={Users}
            foot="A community of care"
          />
          <StatCard
            label="Contributions made"
            value={String(verified.length)}
            icon={BookHeart}
            foot="Thank you for every gesture"
          />
          <StatCard
            label="Pending contributions"
            value={String(rows.filter((c) => c.status === "Pending").length)}
            icon={Activity}
            foot="Demonstration records only"
          />
        </div>
      )}
      <ContributionTable rows={rows} donor />
      <p className="note-text">
        Only records associated with your demo contributor account appear here.
        Receipts are illustrative and do not prove a payment.
      </p>
    </>
  );
}
function MCDashboard({ section }: { section: string }) {
  const { state, setState, toast } = useDemo();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState(
    section === "announced" ? "announced" : "pending",
  );
  useEffect(
    () => setTab(section === "announced" ? "announced" : "pending"),
    [section],
  );
  const assignments = state.mcAssignments
    .filter(
      (a) => a.userId === (state.user?.role === "mc" ? state.user.id : "u3"),
    )
    .map((a) => a.campaignId);
  const [selectedCampaignId, setCampaignId] = useState(assignments[0]);
  const campaignId = assignments.includes(selectedCampaignId)
    ? selectedCampaignId
    : assignments[0];
  const rows = state.contributions
    .filter(
      (c) =>
        assignments.includes(c.campaignId) &&
        c.campaignId === campaignId &&
        c.status === "Verified",
    )
    .map(mcView);
  if (section === "settings") return <SettingsView role="mc" />;
  if (!assignments.length)
    return (
      <>
        <Title
          title="Your MC workspace."
          description="Your assigned memorials will appear here."
        />
        <EmptyState
          title="No memorials are currently assigned"
          description="A family organiser can assign a demo memorial from MC management."
        />
      </>
    );
  if (section === "campaigns")
    return (
      <>
        <Title
          title="Your assigned memorials."
          description="A clear, calm workspace for the occasion."
        />
        <div className="campaign-grid">
          {state.campaigns
            .filter((c) => assignments.includes(c.id))
            .map((c) => (
              <div className="panel" key={c.id}>
                <div className="panel-body" style={{ paddingTop: 25 }}>
                  <img
                    src={c.image}
                    alt="Fictional portrait"
                    style={{
                      height: 180,
                      width: "100%",
                      objectFit: "cover",
                      objectPosition: "top",
                      borderRadius: 4,
                    }}
                  />
                  <h3 className="mt-20">{c.name}</h3>
                  <p className="small mt-20">
                    {dateLabel(c.date)} · {c.venue}
                  </p>
                  <Link className="btn mt-20" href="/dashboard/mc/">
                    Open announcement queue <Mic size={14} />
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </>
    );
  const visible = rows.filter(
    (c) =>
      (tab === "announced" ? c.announced : !c.announced) &&
      `${c.name} ${c.id}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <Title
        title="Acknowledge with care."
        description="A calm, clear view for the moments that matter at the funeral grounds."
      />
      <div className="demo-notice">
        <ShieldCheck />
        Donor choices are respected. Anonymous identities and amounts are never
        included in this MC view. Name-only amounts are also hidden.
      </div>
      <div className="mc-toolbar">
        <select
          aria-label="Assigned campaign"
          value={campaignId}
          onChange={(e) => setCampaignId(e.target.value)}
        >
          {state.campaigns
            .filter((c) => assignments.includes(c.id))
            .map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
        </select>
        <div className="search-input">
          <Search />
          <input
            aria-label="Search announcements"
            placeholder="Search visible donor name or reference…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
      <div className="tabs">
        <button
          className={tab === "pending" ? "active" : ""}
          onClick={() => setTab("pending")}
        >
          Pending ({rows.filter((c) => !c.announced).length})
        </button>
        <button
          className={tab === "announced" ? "active" : ""}
          onClick={() => setTab("announced")}
        >
          Announced ({rows.filter((c) => c.announced).length})
        </button>
      </div>
      {visible.length ? (
        <div className="mc-grid">
          {visible.map((c) => (
            <div className="announcement-card" key={c.id}>
              <div className="announcement-top">
                <span>{c.id}</span>
                <Badge>{c.announced ? "Announced" : "Pending"}</Badge>
              </div>
              <h3>{c.name}</h3>
              <div className="announcement-amount">
                {c.amount === null ? "Amount private" : money(c.amount)}
              </div>
              <p>
                {acknowledgementLabels[c.acknowledgement]} ·{" "}
                {c.acknowledgement === "anonymous"
                  ? "Do not announce personal details."
                  : c.acknowledgement === "name"
                    ? "Please acknowledge the name only."
                    : "Name and amount may be announced."}
              </p>
              <button
                className={`btn ${c.announced ? "btn-secondary" : ""}`}
                onClick={() => {
                  setState((s) => ({
                    ...s,
                    contributions: s.contributions.map((r) =>
                      r.id === c.id ? { ...r, announced: !r.announced } : r,
                    ),
                  }));
                  toast(
                    c.announced
                      ? "Returned to pending queue"
                      : "Marked as announced",
                  );
                }}
              >
                {c.announced ? <Undo2 size={15} /> : <Check size={15} />}{" "}
                {c.announced ? "Return to pending" : "Mark as announced"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={q ? "No matching announcements" : "You’re all caught up."}
          description="Announcements will appear here as contributions are verified."
        />
      )}
    </>
  );
}
function AdminDashboard({ section }: { section: string }) {
  const { state } = useDemo();
  if (section === "campaigns") return <AdminCampaigns />;
  if (section === "users") return <AdminUsers />;
  if (section === "reports") return <Reports rows={state.contributions} />;
  if (section === "settings") return <SettingsView role="admin" />;
  if (section === "transactions")
    return (
      <>
        <Title
          title="Transaction monitoring."
          description="Inspect illustrative contribution records. No financial operations are connected."
        />
        <ContributionTable rows={state.contributions} />
      </>
    );
  if (section === "audit")
    return (
      <>
        <Title
          title="A clear record of activity."
          description="Browser-local demonstration audit log."
        />
        <div className="panel">
          {state.audit.map((a) => (
            <div className="audit-row" key={a.id}>
              <ShieldCheck />
              <div>
                {a.action}
                <time>{new Date(a.date).toLocaleString("en-GB")}</time>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  return (
    <>
      <Title
        title="A community, thoughtfully managed."
        description="Your overview of the Nsaabɔdeɛ demonstration platform."
      >
        <Link className="btn" href="/dashboard/admin/campaigns/">
          Review campaigns <ArrowUpRight size={14} />
        </Link>
      </Title>
      <div className="stats-grid">
        <StatCard
          label="Demo users"
          value={String(state.demoUsers.length)}
          icon={Users}
          foot="Across four workspace roles"
        />
        <StatCard
          label="Total memorial campaigns"
          value={String(state.campaigns.length)}
          icon={BookHeart}
          foot={`${state.campaigns.filter((c) => c.status === "Active").length} currently active`}
        />
        <StatCard
          label="Pending approvals"
          value={String(
            state.campaigns.filter((c) => c.status === "Pending").length,
          )}
          icon={ShieldCheck}
          foot="Awaiting demo moderation"
        />
        <StatCard
          label="Recorded contributions"
          value={money(totalFor(state.contributions))}
          icon={Wallet}
          foot="Illustrative verified records only"
        />
      </div>
      <ReportsPreview rows={state.contributions} />
      <div className="panel">
        <div className="panel-header">
          <h2>Recent platform activity</h2>
          <Link href="/dashboard/admin/audit/">View audit log ↗</Link>
        </div>
        {state.audit.slice(0, 6).map((a) => (
          <div className="audit-row" key={a.id}>
            <Activity />
            <div>
              {a.action}
              <time>{dateLabel(a.date)}</time>
            </div>
          </div>
        ))}
      </div>
      <p className="demo-caption">
        Platform administration is simulated. No real financial or access
        operations are performed.
      </p>
    </>
  );
}
function ReportsPreview({ rows }: { rows: Contribution[] }) {
  return (
    <div className="dashboard-grid">
      <div className="panel">
        <div className="panel-header">
          <h2>Platform contribution activity</h2>
        </div>
        <div className="panel-body">
          <AnalyticsChart rows={rows} />
        </div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <h2>Contribution methods</h2>
        </div>
        <div className="panel-body">
          <AnalyticsChart rows={rows} kind="methods" />
          <div className="chart-legend">
            <span>
              <i className="legend-dot" />
              Digital
            </span>
            <span>
              <i className="legend-dot gold" />
              Cash
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
