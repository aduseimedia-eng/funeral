"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Info,
  ShieldCheck,
  Check,
  X,
  Pause,
  ArrowUpRight,
} from "lucide-react";
import { useDemo } from "@/components/providers";
import { Campaign, CampaignStatus } from "@/lib/types";
import { users } from "@/lib/mock-data";
import { money, dateLabel, totalFor } from "@/lib/utils";
import { Badge, Modal, Field, EmptyState } from "@/components/common/ui";
export function AdminCampaigns() {
  const { state, setState, toast } = useDemo();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All statuses");
  const [action, setAction] = useState<{
    campaign: Campaign;
    status: CampaignStatus;
  } | null>(null);
  const list = state.campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) &&
      (filter === "All statuses" || c.status === filter),
  );
  return (
    <>
      <div className="dash-title">
        <div>
          <h1>Care for every memorial.</h1>
          <p>
            Review and moderate illustrative campaigns with clear, local
            actions.
          </p>
        </div>
        <Badge>
          {state.campaigns.filter((c) => c.status === "Pending").length} pending
          review
        </Badge>
      </div>
      <div className="filter-bar">
        <div className="search-input">
          <Search />
          <input
            aria-label="Search campaigns for moderation"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search memorial name…"
          />
        </div>
        <select
          aria-label="Filter moderation status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {[
            "All statuses",
            "Pending",
            "Active",
            "Suspended",
            "Rejected",
            "Completed",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="panel">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Memorial</th>
                <th>Organiser</th>
                <th>Contributions</th>
                <th>Status</th>
                <th>Moderation</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong>
                    <small>
                      {c.location} · {dateLabel(c.date)}
                    </small>
                  </td>
                  <td>{c.organiser}</td>
                  <td>{money(totalFor(state.contributions, c.id))}</td>
                  <td>
                    <Badge>{c.status}</Badge>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link
                        href={`/memorial/?id=${c.id}`}
                        aria-label={`View ${c.name}`}
                      >
                        <ArrowUpRight size={12} />
                      </Link>
                      {c.status !== "Active" && (
                        <button
                          onClick={() =>
                            setAction({ campaign: c, status: "Active" })
                          }
                        >
                          Approve
                        </button>
                      )}
                      {c.status !== "Rejected" && (
                        <button
                          onClick={() =>
                            setAction({ campaign: c, status: "Rejected" })
                          }
                        >
                          Reject
                        </button>
                      )}
                      {c.status === "Active" && (
                        <button
                          onClick={() =>
                            setAction({ campaign: c, status: "Suspended" })
                          }
                        >
                          Suspend
                        </button>
                      )}
                      {c.status === "Active" && (
                        <button
                          onClick={() =>
                            setAction({ campaign: c, status: "Completed" })
                          }
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!list.length && (
          <EmptyState
            title="No campaigns match"
            description="Try another search or moderation status."
          />
        )}
      </div>
      <p className="note-text">
        These actions only update local demo data and the illustrative audit
        log.
      </p>
      {action && (
        <Modal
          title={`${action.status === "Active" ? "Approve" : action.status === "Rejected" ? "Reject" : action.status === "Completed" ? "Complete" : "Suspend"} this demo memorial?`}
          onClose={() => setAction(null)}
        >
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const reason = String(
                new FormData(e.currentTarget).get("reason"),
              );
              setState((s) => ({
                ...s,
                campaigns: s.campaigns.map((c) =>
                  c.id === action.campaign.id
                    ? { ...c, status: action.status }
                    : c,
                ),
                audit: [
                  {
                    id: crypto.randomUUID(),
                    action: `${action.campaign.name}: ${action.status} — ${reason} (demo moderation)`,
                    date: new Date().toISOString(),
                  },
                  ...s.audit,
                ],
              }));
              toast(
                `Demo campaign status updated to ${action.status.toLowerCase()}`,
              );
              setAction(null);
            }}
          >
            <p className="small">
              {action.campaign.name} will be marked{" "}
              {action.status.toLowerCase()} in this browser.
            </p>
            <Field label="Moderation note">
              <textarea
                name="reason"
                required
                minLength={5}
                maxLength={500}
                placeholder="Add a brief reason for the audit log…"
              />
            </Field>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setAction(null)}
              >
                Cancel
              </button>
              <button className="btn">
                Confirm demo action <Check size={14} />
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
export function AdminUsers() {
  const { state, setState, toast } = useDemo();
  const [q, setQ] = useState("");
  const [role, setRole] = useState("All roles");
  const suspended = state.suspendedUsers;
  const [details, setDetails] = useState<string | null>(null);
  const list = state.demoUsers.filter(
    (u) =>
      `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()) &&
      (role === "All roles" || u.role === role),
  );
  return (
    <>
      <div className="dash-title">
        <div>
          <h1>People behind the community.</h1>
          <p>Inspect mock users and preview platform account management.</p>
        </div>
      </div>
      <div className="demo-notice mb-20">
        <Info />
        User actions are visual simulations. They do not create or enforce real
        access restrictions.
      </div>
      <div className="filter-bar">
        <div className="search-input">
          <Search />
          <input
            aria-label="Search users"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email…"
          />
        </div>
        <select
          aria-label="Filter user role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>All roles</option>
          <option value="family">Family organiser</option>
          <option value="donor">Contributor</option>
          <option value="mc">MC</option>
          <option value="admin">Superadmin</option>
        </select>
      </div>
      <div className="panel">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Demo status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.name}</strong>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <Badge>
                      {suspended.includes(u.id) ? "Suspended" : "Active"}
                    </Badge>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button onClick={() => setDetails(u.id)}>
                        View user
                      </button>
                      {u.role !== "admin" && (
                        <button
                          onClick={() => {
                            const paused = suspended.includes(u.id);
                            setState((s) => ({
                              ...s,
                              suspendedUsers: paused
                                ? s.suspendedUsers.filter((id) => id !== u.id)
                                : [...s.suspendedUsers, u.id],
                              audit: [
                                {
                                  id: crypto.randomUUID(),
                                  action: `${paused ? "Reactivated" : "Suspended"} ${u.name} (visual demo only)`,
                                  date: new Date().toISOString(),
                                },
                                ...s.audit,
                              ],
                            }));
                            toast("Demo user status updated in this view");
                          }}
                        >
                          {suspended.includes(u.id) ? "Reactivate" : "Suspend"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!list.length && (
          <EmptyState
            title="No matching users"
            description="Try another name or role."
          />
        )}
      </div>
      {details && (
        <Modal title="Demo user details" onClose={() => setDetails(null)}>
          {state.demoUsers
            .filter((u) => u.id === details)
            .map((u) => (
              <div key={u.id} className="form-stack">
                <h3>{u.name}</h3>
                <p className="small">{u.email}</p>
                <Badge>{u.role}</Badge>
                <p className="small">User ID: {u.id}</p>
                <p className="small">
                  Recorded contributions:{" "}
                  {state.contributions.filter((c) => c.userId === u.id).length}
                </p>
                <p className="small">
                  This is an illustrative account with no authentication service
                  connected.
                </p>
              </div>
            ))}
        </Modal>
      )}
    </>
  );
}
