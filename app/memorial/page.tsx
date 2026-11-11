"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Share2,
  Heart,
  ChevronRight,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  Navbar,
  Footer,
  ProgressBar,
  Field,
  EmptyState,
} from "@/components/common/ui";
import { QRCodeDisplay, campaignUrl } from "@/components/qr/qr-display";
import { useDemo } from "@/components/providers";
import { money, dateLabel, totalFor } from "@/lib/utils";
export default function Memorial() {
  const { state, setState, toast, ready } = useDemo();
  const [id, setId] = useState("kwasi-mensah");
  const [fromQr, setFromQr] = useState(false);
  useEffect(() => {
    setId(
      new URLSearchParams(window.location.search).get("id") || "kwasi-mensah",
    );
    setFromQr(new URLSearchParams(window.location.search).get("via") === "qr");
  }, []);
  const c = state.campaigns.find((c) => c.id === id);
  if (!ready)
    return (
      <div className="loading-state">
        <div className="spinner" />
      </div>
    );
  if (fromQr && state.qrDisabled.includes(id))
    return (
      <>
        <Navbar />
        <EmptyState
          title="This demo QR code is paused"
          description="The family organiser can reactivate it in the QR workspace. This pause applies only in this browser."
        />
        <div className="container content-wrap">
          <Link className="btn btn-secondary" href="/campaigns/">
            Explore memorials
          </Link>
        </div>
        <Footer />
      </>
    );
  if (!c)
    return (
      <>
        <Navbar />
        <EmptyState
          title="Memorial not found"
          description="Please explore the available memorials."
        />
        <Footer />
      </>
    );
  const total = totalFor(state.contributions, id);
  const count = state.contributions.filter(
    (r) => r.campaignId === id && r.status === "Verified",
  ).length;
  const share = async () => {
    const url = campaignUrl(id);
    try {
      if (navigator.share)
        await navigator.share({ title: `In memory of ${c.name}`, url });
      else {
        await navigator.clipboard.writeText(url);
        toast("Memorial link copied");
      }
    } catch {
      toast("Share cancelled or unavailable");
    }
  };
  return (
    <>
      <Navbar />
      <main>
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/campaigns/">Memorials</Link>
            <ChevronRight size={12} />
            <span>{c.name}</span>
          </div>
        </div>
        <div className="memorial-banner">
          <div className="container memorial-header">
            <img src={c.image} alt={`Fictional portrait of ${c.name}`} />
            <div>
              <div className="eyebrow">IN LOVING MEMORY</div>
              <h1>{c.name}</h1>
              <div className="years">{c.years}</div>
              <p>A life beautifully lived. A love that remains.</p>
            </div>
          </div>
        </div>
        <div className="container memorial-grid">
          <article className="memorial-content">
            <h2>A life to remember</h2>
            <p>{c.obituary}</p>
            <div className="info-card">
              <h3>Celebration of life</h3>
              <div>
                <CalendarDays />
                <div>
                  <strong>{dateLabel(c.date)}</strong>
                  <span>Funeral service · 9:00 am</span>
                </div>
              </div>
              <div>
                <MapPin />
                <div>
                  <strong>{c.venue}</strong>
                  <span>{c.location}, Ghana</span>
                </div>
              </div>
            </div>
            <h2>Standing with the family</h2>
            <p>{c.description}</p>
            <div className="info-card">
              <div>
                <Users />
                <div>
                  <strong>Organised by {c.organiser}</strong>
                  <span>Family organiser · Illustrative demonstration</span>
                </div>
              </div>
            </div>
            <h2>The condolence book</h2>
            <p>A few kind words can mean more than you know.</p>
            {state.condolences
              .filter((m) => m.campaignId === id)
              .map((m) => (
                <div className="condolence" key={m.id}>
                  <strong>{m.name}</strong>
                  <time>{dateLabel(m.date)}</time>
                  <p>{m.message}</p>
                </div>
              ))}
            <form
              className="condolence-form form-stack"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                if (String(f.get("message")).trim().length < 5) {
                  toast("Please add a message of at least five characters.");
                  return;
                }
                setState((s) => ({
                  ...s,
                  condolences: [
                    {
                      id: crypto.randomUUID(),
                      campaignId: id,
                      name: String(f.get("name")).trim(),
                      message: String(f.get("message")).trim(),
                      date: new Date().toISOString(),
                    },
                    ...s.condolences,
                  ],
                }));
                e.currentTarget.reset();
                toast("Your message has been added to this demo memorial");
              }}
            >
              <h3>Leave a message of comfort</h3>
              <Field label="Your name">
                <input
                  name="name"
                  required
                  maxLength={80}
                  pattern=".*\S.*"
                  placeholder="Your name"
                />
              </Field>
              <Field label="Your message">
                <textarea
                  name="message"
                  required
                  maxLength={1500}
                  minLength={5}
                  placeholder="Share a memory or a few kind words…"
                />
              </Field>
              <div>
                <button className="btn">
                  Add your message <Heart size={15} />
                </button>
              </div>
            </form>
          </article>
          <aside className="fund-card">
            <div className="eyebrow">TOGETHER, WE SUPPORT</div>
            <div className="fund-total mt-20">{money(total)}</div>
            <div className="small">
              contributed towards a {money(c.target)} goal
            </div>
            <ProgressBar value={(total / c.target) * 100} />
            <div className="fundraising-meta">
              <span>{count} verified contributions</span>
              <span>{Math.round((total / c.target) * 100)}% of goal</span>
            </div>
            {c.status === "Active" ? (
              <Link className="btn" href={`/checkout/?id=${id}`}>
                Contribute in their memory <Heart size={16} />
              </Link>
            ) : (
              <p className="note-text">
                This memorial is {c.status.toLowerCase()} and is not accepting
                contributions.
              </p>
            )}
            <button className="btn btn-secondary" onClick={share}>
              Share this memorial <Share2 size={15} />
            </button>
            <p className="note-text">
              <ShieldCheck
                size={13}
                style={{ display: "inline", verticalAlign: "middle" }}
              />{" "}
              Frontend demonstration. No real money is collected.
            </p>
            <QRCodeDisplay value={campaignUrl(id)} />
            <p className="demo-caption">
              Memorial stories and portraits are fictional.
            </p>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
