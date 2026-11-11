"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  ArrowUpRight,
  Pencil,
  Search,
  Info,
  Trash2,
  Check,
  Download,
  UserPlus,
} from "lucide-react";
import { useDemo } from "@/components/providers";
import { Campaign, Role } from "@/lib/types";
import { users, acknowledgementLabels } from "@/lib/mock-data";
import { money, dateLabel, totalFor } from "@/lib/utils";
import {
  Modal,
  Field,
  Badge,
  ProgressBar,
  EmptyState,
} from "@/components/common/ui";
export function CashModal({
  campaignId,
  onClose,
}: {
  campaignId: string;
  onClose: () => void;
}) {
  const { setState, toast } = useDemo();
  return (
    <Modal title="Record a cash contribution" onClose={onClose}>
      <div className="demo-notice mb-20">
        <Info />
        Local demonstration only. This records a verified cash entry; no money
        is moved.
      </div>
      <form
        className="form-stack"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const name = String(f.get("name")).trim();
          if (!name) return;
          setState((s) => ({
            ...s,
            contributions: [
              {
                id: `CASH-DEMO-${crypto.randomUUID().slice(0, 8)}`,
                campaignId,
                userId: null,
                name,
                amount: Number(f.get("amount")),
                method: "Cash",
                date: new Date().toISOString(),
                status: "Verified",
                acknowledgement: f.get("ack") as "full" | "name" | "anonymous",
                announced: false,
              },
              ...s.contributions,
            ],
            audit: [
              {
                id: crypto.randomUUID(),
                action: `Cash contribution recorded for ${name} (demo)`,
                date: new Date().toISOString(),
              },
              ...s.audit,
            ],
          }));
          toast("Verified cash contribution recorded in this browser");
          onClose();
        }}
      >
        <Field label="Contributor’s full name">
          <input
            name="name"
            required
            pattern=".*\S.*"
            maxLength={80}
            placeholder="e.g. Yaw Agyeman"
          />
        </Field>
        <Field label="Amount received (GHS)">
          <input
            name="amount"
            required
            type="number"
            min="1"
            max="1000000"
            step="0.01"
            placeholder="500"
          />
        </Field>
        <Field label="Acknowledgement preference">
          <select name="ack">
            {Object.entries(acknowledgementLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <label className="small">
          <input type="checkbox" required /> I confirm this demonstration cash
          entry is verified.
        </label>
        <div className="form-actions">
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn">
            Save cash record <Check size={15} />
          </button>
        </div>
      </form>
    </Modal>
  );
}
export function FamilyCampaigns() {
  const { state } = useDemo();
  const [editing, setEditing] = useState<Campaign | "new" | null>(null);
  const [q, setQ] = useState("");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("create") === "1")
      setEditing("new");
  }, []);
  const list = state.campaigns.filter(
    (c) =>
      (c.id === "kwasi-mensah" || c.id.startsWith("demo-")) &&
      c.name.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <div className="dash-title">
        <div>
          <h1>A place for their story.</h1>
          <p>Create and care for your family’s memorial pages.</p>
        </div>
        <button className="btn" onClick={() => setEditing("new")}>
          <Plus size={15} />
          Create a funeral page
        </button>
      </div>
      <div className="filter-bar">
        <div className="search-input">
          <Search />
          <input
            aria-label="Search your campaigns"
            placeholder="Search your memorials…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
      {list.length ? (
        <div className="campaign-grid">
          {list.map((c) => (
            <div className="campaign-card" key={c.id}>
              <div className="campaign-photo">
                <img src={c.image} alt="Fictional memorial portrait" />
                <span className="photo-label">{c.status}</span>
              </div>
              <div className="campaign-body">
                <div className="eyebrow">
                  {c.location} · {dateLabel(c.date)}
                </div>
                <h3>{c.name}</h3>
                <p className="years">{c.years}</p>
                <ProgressBar
                  value={(totalFor(state.contributions, c.id) / c.target) * 100}
                />
                <div className="campaign-amount">
                  <strong>{money(totalFor(state.contributions, c.id))}</strong>
                  <span>of {money(c.target)}</span>
                </div>
                <div className="form-actions">
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => setEditing(c)}
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                  <Link
                    className="btn btn-small"
                    href={`/memorial/?id=${c.id}`}
                  >
                    Preview <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No memorials found"
          description="Create a funeral page or try another search."
        />
      )}
      {editing && (
        <CampaignModal campaign={editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}
function CampaignModal({
  campaign,
  onClose,
}: {
  campaign: Campaign | "new";
  onClose: () => void;
}) {
  const { setState, toast } = useDemo();
  const editing = campaign !== "new";
  const [picture, setPicture] = useState(
    editing ? campaign.image : "/images/kwasi-portrait.png",
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      title={editing ? "Care for their memorial" : "Create a funeral page"}
      onClose={onClose}
    >
      <form
        className="form-stack"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const record: Campaign = {
            id: editing
              ? campaign.id
              : `demo-${crypto.randomUUID().slice(0, 10)}`,
            name: String(f.get("name")).trim(),
            years: String(f.get("years")),
            location: String(f.get("location")),
            venue: String(f.get("venue")),
            date: String(f.get("date")),
            target: Number(f.get("target")),
            image: picture,
            status: editing ? campaign.status : "Pending",
            organiser: String(f.get("organiser")),
            obituary: String(f.get("obituary")),
            description: String(f.get("description")),
          };
          if (!record.name) return;
          setState((s) => ({
            ...s,
            campaigns: editing
              ? s.campaigns.map((c) => (c.id === record.id ? record : c))
              : [...s.campaigns, record],
            activeCampaignId: record.id,
            audit: [
              {
                id: crypto.randomUUID(),
                action: `${editing ? "Updated" : "Created"} memorial: ${record.name} (demo)`,
                date: new Date().toISOString(),
              },
              ...s.audit,
            ],
          }));
          toast(
            editing
              ? "Memorial details updated"
              : "Demo memorial created. Review it in the admin workspace to approve.",
          );
          onClose();
        }}
      >
        <div className="demo-notice">
          <Info />
          Use fictional details. New demo memorials start pending and can be
          approved in the superadmin workspace.
        </div>
        <Field label="Full name of your loved one">
          <input
            name="name"
            required
            pattern=".*\S.*"
            maxLength={100}
            defaultValue={editing ? campaign.name : ""}
            placeholder="e.g. Nana Kwasi Mensah"
          />
        </Field>
        <div className="form-grid">
          <Field label="Years of life">
            <input
              name="years"
              required
              defaultValue={editing ? campaign.years : ""}
              placeholder="1948 — 2026"
            />
          </Field>
          <Field label="Family / organiser">
            <input
              name="organiser"
              required
              defaultValue={editing ? campaign.organiser : "The Mensah family"}
            />
          </Field>
        </div>
        <Field label="Memorial photograph (max 2 MB)">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) {
                setError("Please choose an image smaller than 2 MB.");
                return;
              }
              if (
                !["image/png", "image/jpeg", "image/webp"].includes(file.type)
              ) {
                setError("Please choose a PNG, JPEG, or WebP image.");
                return;
              }
              setLoading(true);
              const reader = new FileReader();
              reader.onload = () => {
                setPicture(String(reader.result));
                setError("");
                setLoading(false);
              };
              reader.onerror = () => {
                setError("The image could not be loaded.");
                setLoading(false);
              };
              reader.readAsDataURL(file);
            }}
          />
        </Field>
        <img
          src={picture}
          alt="Memorial photograph preview"
          style={{
            height: 95,
            width: 80,
            objectFit: "cover",
            objectPosition: "top",
            borderRadius: 4,
          }}
        />
        {error && <p className="error-text">{error}</p>}
        <div className="form-grid">
          <Field label="Funeral date">
            <input
              name="date"
              required
              type="date"
              defaultValue={editing ? campaign.date : ""}
            />
          </Field>
          <Field label="City / town">
            <select
              name="location"
              defaultValue={editing ? campaign.location : "Kumasi"}
            >
              {[
                "Accra",
                "Kumasi",
                "Cape Coast",
                "Takoradi",
                "Tamale",
                "Ho",
                "Sunyani",
                "Koforidua",
              ].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Funeral venue">
          <input
            name="venue"
            required
            defaultValue={editing ? campaign.venue : ""}
            placeholder="Church or venue name and address"
          />
        </Field>
        <Field label="Fundraising target (GHS)">
          <input
            name="target"
            type="number"
            min="1"
            max="10000000"
            required
            defaultValue={editing ? campaign.target : 50000}
          />
        </Field>
        <Field label="Their story / obituary">
          <textarea
            name="obituary"
            required
            minLength={20}
            maxLength={5000}
            defaultValue={editing ? campaign.obituary : ""}
            placeholder="Tell the story of their life…"
          />
        </Field>
        <Field label="A message from the family">
          <textarea
            name="description"
            required
            minLength={10}
            maxLength={3000}
            defaultValue={editing ? campaign.description : ""}
            placeholder="How can the community support your family?"
          />
        </Field>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button disabled={loading} className="btn">
            {editing ? "Save changes" : "Create demo memorial"}{" "}
            <ArrowUpRight size={14} />
          </button>
        </div>
      </form>
    </Modal>
  );
}
export function FamilyPeople({ mc = false }: { mc?: boolean }) {
  const { state, setState, toast } = useDemo();
  const [modal, setModal] = useState(false);
  const [remove, setRemove] = useState<string | null>(null);
  const campaignId = state.activeCampaignId;
  const activeCampaign =
    state.campaigns.find((c) => c.id === campaignId) || state.campaigns[0];
  const mcActive = state.mcAssignments.some(
    (a) => a.userId === "u3" && a.campaignId === campaignId,
  );
  const setMcActive = (active: boolean) =>
    setState((s) => ({
      ...s,
      mcAssignments: active
        ? [
            ...s.mcAssignments.filter(
              (a) => !(a.userId === "u3" && a.campaignId === campaignId),
            ),
            { userId: "u3", campaignId },
          ]
        : s.mcAssignments.filter(
            (a) => !(a.userId === "u3" && a.campaignId === campaignId),
          ),
    }));
  return (
    <>
      <div className="dash-title">
        <div>
          <h1>
            {mc ? "Thoughtful acknowledgements." : "A family working together."}
          </h1>
          <p>
            {mc
              ? "Manage the MC for your family’s funeral."
              : "Manage your local demonstration family administrators."}
          </p>
        </div>
        <button className="btn" onClick={() => setModal(true)}>
          <UserPlus size={14} />
          {mc ? "Assign a demo MC" : "Add administrator"}
        </button>
      </div>
      <div className="demo-notice mb-20">
        <Info />
        {mc
          ? "MC access is a frontend demonstration. Anonymous identities and private amounts are removed from the announcement view."
          : "No invitations are sent. Administrators added here are browser-local demonstration records."}
      </div>
      {mc ? (
        <div className="panel">
          <div className="panel-body" style={{ paddingTop: 25 }}>
            <h3>Kofi Owusu</h3>
            <p className="small mt-20">
              kofi@example.com · {activeCampaign.name}
            </p>
            <div className="form-actions">
              <Badge>{mcActive ? "Active" : "Suspended"}</Badge>
              <Link href="/dashboard/mc/" className="btn btn-secondary">
                Preview MC workspace <ArrowUpRight size={14} />
              </Link>
              <button
                className="btn"
                onClick={() => {
                  setMcActive(!mcActive);
                  toast(
                    mcActive
                      ? "Demo MC assignment paused"
                      : "Demo MC assignment reactivated",
                  );
                }}
              >
                {mcActive ? "Pause assignment" : "Reactivate assignment"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="panel">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {state.members.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <strong>{m.name}</strong>
                    </td>
                    <td>{m.email}</td>
                    <td>
                      <Badge>{m.role}</Badge>
                    </td>
                    <td>
                      {m.role !== "Owner" && (
                        <button
                          className="icon-button"
                          aria-label={`Remove ${m.name}`}
                          onClick={() => setRemove(m.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {remove && (
        <Modal
          title="Remove this administrator?"
          onClose={() => setRemove(null)}
        >
          <p className="small">
            This removes the local demonstration record only.
          </p>
          <div className="form-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setRemove(null)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                setState((s) => ({
                  ...s,
                  members: s.members.filter((m) => m.id !== remove),
                }));
                setRemove(null);
                toast("Demo administrator removed");
              }}
            >
              Remove administrator
            </button>
          </div>
        </Modal>
      )}
      {modal && (
        <Modal
          title={mc ? "Assign a demo MC" : "Add a family administrator"}
          onClose={() => setModal(false)}
        >
          {mc ? (
            <div className="form-stack">
              <p className="small">
                Kofi Owusu is the available demonstration MC.
              </p>
              <Field label="Campaign">
                <select>
                  <option>{activeCampaign.name}</option>
                </select>
              </Field>
              <button
                className="btn"
                onClick={() => {
                  setMcActive(true);
                  setModal(false);
                  toast("Kofi Owusu assigned to the demo memorial");
                }}
              >
                Assign Kofi Owusu
              </button>
            </div>
          ) : (
            <form
              className="form-stack"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                setState((s) => ({
                  ...s,
                  members: [
                    ...s.members,
                    {
                      id: crypto.randomUUID(),
                      name: String(f.get("name")).trim(),
                      email: String(f.get("email")),
                      role: "Administrator",
                    },
                  ],
                }));
                setModal(false);
                toast("Demo administrator added. No invitation was sent.");
              }}
            >
              <Field label="Full name">
                <input name="name" required pattern=".*\S.*" maxLength={80} />
              </Field>
              <Field label="Email address">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="family@example.com"
                />
              </Field>
              <button className="btn">Add demo administrator</button>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
export function WithdrawalDemo() {
  const { toast } = useDemo();
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<
    { id: string; amount: number; date: string }[]
  >([]);
  return (
    <>
      <div className="dash-title">
        <div>
          <h1>Withdrawal requests.</h1>
          <p>A visual demonstration of the future family request flow.</p>
        </div>
        <button className="btn" onClick={() => setOpen(true)}>
          <Plus size={14} />
          Create demo request
        </button>
      </div>
      <div className="demo-notice mb-20">
        <Info />
        No real funds, withdrawals, or banking operations exist. Requests are
        illustrative and no payout can occur.
      </div>
      {requests.length ? (
        <div className="panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>Demo reference</th>
                <th>Requested amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{money(r.amount)}</td>
                  <td>{dateLabel(r.date)}</td>
                  <td>
                    <Badge>Demo only</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No demo requests yet"
          description="Preview the form to see how a future request could look."
        />
      )}
      {open && (
        <Modal
          title="Preview a withdrawal request"
          onClose={() => setOpen(false)}
        >
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              setRequests((r) => [
                {
                  id: `DEMO-WR-${crypto.randomUUID().slice(0, 6)}`,
                  amount: Number(f.get("amount")),
                  date: new Date().toISOString(),
                },
                ...r,
              ]);
              setOpen(false);
              toast("Demo request created. No funds will be withdrawn.");
            }}
          >
            <div className="demo-notice">
              <Info />
              Visual demonstration only. Do not enter bank account details.
            </div>
            <Field label="Illustrative amount (GHS)">
              <input
                name="amount"
                required
                type="number"
                min="1"
                max="1000000"
              />
            </Field>
            <Field label="Purpose">
              <textarea required placeholder="Funeral arrangements (demo)" />
            </Field>
            <button className="btn">Save demo request</button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function SettingsView({
  role,
  preferences = false,
}: {
  role: Role;
  preferences?: boolean;
}) {
  const { state, setState, toast } = useDemo();
  const user =
    state.user?.role === role
      ? state.user
      : state.demoUsers.find((u) => u.role === role)!;
  const [reset, setReset] = useState(false);
  return (
    <>
      <div className="dash-title">
        <div>
          <h1>
            {preferences
              ? "A gesture, on your terms."
              : role === "admin"
                ? "Platform settings."
                : "Make yourself at home."}
          </h1>
          <p>
            {preferences
              ? "Choose your default acknowledgement preference."
              : "Manage your profile and local demonstration preferences."}
          </p>
        </div>
      </div>
      <div className="settings-grid">
        {!preferences && (
          <form
            className="panel settings-panel form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              setState((s) => ({
                ...s,
                user: {
                  ...user,
                  name: String(f.get("name")).trim(),
                  email: String(f.get("email")),
                },
                demoUsers: s.demoUsers.map((u) =>
                  u.id === user.id
                    ? {
                        ...u,
                        name: String(f.get("name")).trim(),
                        email: String(f.get("email")),
                      }
                    : u,
                ),
              }));
              toast("Demo profile saved");
            }}
          >
            <h2>
              {role === "admin" ? "Administrator profile" : "Your profile"}
            </h2>
            <Field label="Full name">
              <input
                key={user.id + "name"}
                name="name"
                required
                pattern=".*\S.*"
                maxLength={80}
                defaultValue={user.name}
              />
            </Field>
            <Field label="Email address">
              <input
                key={user.id + "email"}
                name="email"
                type="email"
                required
                defaultValue={user.email}
              />
            </Field>
            <button className="btn">Save profile</button>
            <Link className="text-link" href="/two-factor/">
              Explore two-factor verification <ArrowUpRight size={14} />
            </Link>
          </form>
        )}
        <form
          className="panel settings-panel"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            setState((s) => ({
              ...s,
              preferences: {
                acknowledgement: String(
                  f.get("ack") || s.preferences.acknowledgement,
                ),
                notifications: f.get("notifications") === "on",
              },
            }));
            toast("Local demonstration preferences saved");
          }}
        >
          <h2>Thoughtful preferences</h2>
          <Field label="Default acknowledgement">
            <select name="ack" defaultValue={state.preferences.acknowledgement}>
              {Object.entries(acknowledgementLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <p className="note-text">
            This is a starting preference. You can choose a different option for
            each contribution.
          </p>
          <label className="toggle-row">
            Demo email notifications
            <input
              name="notifications"
              type="checkbox"
              defaultChecked={state.preferences.notifications}
            />
          </label>
          <p className="note-text">
            No emails or notifications are actually sent.
          </p>
          <button className="btn">Save preferences</button>
        </form>
        <div className="panel settings-panel">
          <h2>Your demo data</h2>
          <p className="small">
            Campaigns, contributions, and preferences are saved in this browser.
            Resetting restores the original demonstration.
          </p>
          <button className="btn btn-secondary" onClick={() => setReset(true)}>
            Reset demonstration
          </button>
        </div>
      </div>
      {reset && (
        <Modal title="Reset the demonstration?" onClose={() => setReset(false)}>
          <p>
            This removes all locally created campaigns, contributions, and
            settings in this browser.
          </p>
          <div className="form-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setReset(false)}
            >
              Keep my demo data
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                localStorage.removeItem("nsaa-demo-v1");
                window.location.assign("/");
              }}
            >
              Reset demo data
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
