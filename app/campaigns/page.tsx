"use client";
import { isPublicMemorial } from "@/lib/memorials";
import { useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  Navbar,
  Footer,
  CampaignCard,
  EmptyState,
} from "@/components/common/ui";
import { useDemo } from "@/components/providers";
export default function Campaigns() {
  const { state, ready } = useDemo();
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("All locations");
  const [status, setStatus] = useState("All memorials");
  const [sort, setSort] = useState("recent");
  const reset = () => {
    setQ("");
    setLocation("All locations");
    setStatus("All memorials");
    setSort("recent");
  };
  const rows = state.campaigns
    .filter(
      (c) =>
        isPublicMemorial(c) &&
        `${c.name} ${c.organiser}`
          .toLowerCase()
          .includes(q.trim().toLowerCase()) &&
        (location === "All locations" || c.location === location) &&
        (status === "All memorials" || c.status === status),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "date"
          ? b.date.localeCompare(a.date)
          : 0,
    );
  return (
    <>
      <Navbar />
      <main className="container content-wrap">
        <div className="page-hero">
          <div className="eyebrow">REMEMBER A LIFE. STAND WITH A FAMILY.</div>
          <h1>A community of remembrance.</h1>
          <p>
            Find a loved one’s memorial, share a memory, and offer your support.
            Every gesture brings a little comfort.
          </p>
        </div>
        <div className="filter-bar">
          <div className="search-input">
            <Search />
            <input
              aria-label="Search memorials"
              placeholder="Search by name or family…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select
            aria-label="Filter by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option>All locations</option>
            {[
              ...new Set(
                state.campaigns.filter(isPublicMemorial).map((c) => c.location),
              ),
            ].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All memorials</option>
            <option>Active</option>
            <option>Completed</option>
          </select>
          <select
            aria-label="Sort memorials"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="recent">Recently added</option>
            <option value="name">Name A–Z</option>
            <option value="date">Latest service date</option>
          </select>
          {(q ||
            location !== "All locations" ||
            status !== "All memorials" ||
            sort !== "recent") && (
            <button className="btn btn-secondary" onClick={reset}>
              Clear filters
            </button>
          )}
        </div>
        <p className="note-text" role="status">
          {rows.length} memorial{rows.length !== 1 ? "s" : ""} · Illustrative
          demo campaigns
        </p>
        {!ready ? (
          <div className="loading-state" role="status">
            Loading memorials…
          </div>
        ) : rows.length ? (
          <div className="campaign-grid">
            {rows.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No memorials found"
            description="Try another name, location, or status."
            action={
              <button className="btn btn-secondary" onClick={reset}>
                Clear filters
              </button>
            }
          />
        )}
        <div className="info-card mt-20">
          <h3>A place for their story.</h3>
          <p className="small mt-20">
            Create a memorial that brings your family and community together.
          </p>
          <Link
            className="text-link mt-20"
            href="/dashboard/family/campaigns/?create=1"
          >
            Create a funeral page <ArrowUpRight size={16} />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
