"use client";
import Link from "next/link";
import { useEffect, useRef, ReactNode } from "react";
import {
  ArrowUpRight,
  Flower2,
  X,
  Heart,
  Check,
  Menu,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { Campaign } from "@/lib/types";
import { money, totalFor, dateLabel } from "@/lib/utils";
import { useDemo } from "@/components/providers";
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`logo ${light ? "light" : ""}`}>
      <span className="logo-mark">
        <Flower2 size={29} strokeWidth={1.4} />
      </span>
      <span>
        Nsaabɔdeɛ
        <span className="logo-caption">REMEMBER. HONOUR. SUPPORT.</span>
      </span>
    </Link>
  );
}
export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="demo-strip">
        Rooted in tradition. Connected by love.{" "}
        <span>Frontend demo · No real payments</span>
      </div>
      <header className="navbar">
        <div className="container nav-inner">
          <Logo />
          <nav
            className={open ? "nav-links open" : "nav-links"}
            aria-label="Main navigation"
          >
            <Link onClick={() => setOpen(false)} href="/campaigns/">
              Explore memorials
            </Link>
            <Link onClick={() => setOpen(false)} href="/#how-it-works">
              How it works
            </Link>
            <Link onClick={() => setOpen(false)} href="/about/">
              Our story
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/login/"
              className="mobile-login"
            >
              Log in
            </Link>
          </nav>
          <div className="nav-actions">
            <Link href="/login/" className="desktop-login">
              Log in <ArrowUpRight size={15} />
            </Link>
            <Link
              className="btn btn-small"
              href="/dashboard/family/campaigns/?create=1"
            >
              Create a funeral page <ArrowUpRight size={16} />
            </Link>
            <button
              className="icon-button mobile-menu"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <div className="navbar-spacer" aria-hidden="true" />
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo light />
            <p>
              Preserving a beautiful tradition.
              <br />
              Bringing us closer, wherever we are.
            </p>
            <span className="small">Made with care, for Ghana and beyond.</span>
          </div>
          <div>
            <h4>THE PLATFORM</h4>
            <Link href="/campaigns/">Explore memorials</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/dashboard/family/campaigns/?create=1">
              Create a funeral page
            </Link>
          </div>
          <div>
            <h4>HERE TO HELP</h4>
            <Link href="/about/">Our story</Link>
            <Link href="/#faq">Frequently asked questions</Link>
            <Link href="/login/">Try the demo</Link>
          </div>
          <div>
            <h4>OUR PROMISE</h4>
            <p>
              Respect for every life.
              <br />
              Care for every family.
              <br />
              Clarity in every contribution.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Nsaabɔdeɛ. All rights reserved.</span>
          <span>Illustrative memorials · Browser-local demonstration</span>
          <span>
            Ghana <span className="ghana-flag">🇬🇭</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className={`badge badge-${String(children).toLowerCase().replaceAll(" ", "-")}`}
    >
      {children}
    </span>
  );
}
export function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label="Fundraising progress"
      aria-valuenow={Math.min(100, Math.round(value))}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${Math.max(0, Math.min(value, 100))}%` }} />
    </div>
  );
}
export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { state } = useDemo();
  const total = totalFor(state.contributions, campaign.id);
  const count = state.contributions.filter(
    (c) => c.campaignId === campaign.id && c.status === "Verified",
  ).length;
  return (
    <Link href={`/memorial/?id=${campaign.id}`} className="campaign-card">
      <div className="campaign-photo">
        <img
          src={campaign.image}
          alt={`Illustrative portrait of ${campaign.name}`}
        />
        <span className="photo-label">
          <span />
          In loving memory
        </span>
        <span className="card-arrow">
          <ArrowUpRight size={19} />
        </span>
      </div>
      <div className="campaign-body">
        <div className="eyebrow">
          {campaign.location}, Ghana <span>•</span> {dateLabel(campaign.date)}
        </div>
        <h3>{campaign.name}</h3>
        <p className="years">{campaign.years}</p>
        <ProgressBar value={(total / campaign.target) * 100} />
        <div className="campaign-amount">
          <strong>
            {money(total)} <span>raised</span>
          </strong>
          <span>of {money(campaign.target)}</span>
        </div>
        <div className="campaign-foot">
          <span>
            <Heart size={13} /> {count} contributions
          </span>
          <span>
            View memorial <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
export function EmptyState({
  title = "Nothing here yet",
  description = "New activity will appear here.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="empty-state">
      <Flower2 size={32} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const list = ref.current?.querySelectorAll<HTMLElement>(
          'button,a,input,select,textarea,[tabindex="0"]',
        );
        if (!list?.length) return;
        const first = list[0],
          last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = old;
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="modal"
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
export function CheckLine({ children }: { children: ReactNode }) {
  return (
    <span className="check-line">
      <Check size={15} />
      {children}
    </span>
  );
}
