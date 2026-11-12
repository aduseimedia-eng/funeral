"use client";
import { useState } from "react";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Contribution } from "@/lib/types";
import { money, dateLabel, csv, downloadFile } from "@/lib/utils";
import { acknowledgementLabels } from "@/lib/mock-data";
import { Badge, EmptyState } from "@/components/common/ui";
import { receipt } from "@/lib/downloads";
import { useDemo } from "@/components/providers";
export function ContributionTable({
  rows,
  compact = false,
  donor = false,
  register = false,
}: {
  rows: Contribution[];
  compact?: boolean;
  donor?: boolean;
  register?: boolean;
}) {
  const { state, toast } = useDemo();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [method, setMethod] = useState("All methods");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const filtered = rows
    .filter(
      (c) =>
        `${c.name} ${c.id}`.toLowerCase().includes(q.toLowerCase()) &&
        (status === "All statuses" || c.status === status) &&
        (method === "All methods" ||
          (method === "Cash" ? c.method === "Cash" : c.method !== "Cash")),
    )
    .sort((a, b) =>
      sort === "amount"
        ? b.amount - a.amount
        : sort === "name"
          ? a.name.localeCompare(b.name)
          : new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  const size = compact ? 5 : 8;
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * size, current * size);
  const exportRows = () => {
    downloadFile(
      `nsaabode-demo-${register ? "donor-register" : "contributions"}.csv`,
      csv([
        ["DEMO RECORDS - NO REAL PAYMENTS"],
        [
          "Name",
          "Amount (GHS)",
          "Method",
          "Date",
          "Reference",
          "Status",
          "Acknowledgement",
        ],
        ...filtered.map((c) => [
          c.name,
          c.amount,
          c.method,
          c.date,
          c.id,
          c.status,
          acknowledgementLabels[c.acknowledgement],
        ]),
      ]),
    );
    toast("Demo register exported");
  };
  return (
    <div className="panel">
      {!compact && (
        <div className="table-toolbar">
          <div className="search-input">
            <Search />
            <input
              aria-label="Search contribution records"
              placeholder="Search name or reference…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            aria-label="Filter payment status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option>All statuses</option>
            <option>Verified</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
          <select
            aria-label="Filter contribution method"
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
              setPage(1);
            }}
          >
            <option>All methods</option>
            <option>Digital</option>
            <option>Cash</option>
          </select>
          <select
            aria-label="Sort contribution records"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="newest">Newest first</option>
            <option value="amount">Highest amount</option>
            <option value="name">Name A–Z</option>
          </select>
          <button
            className="icon-button"
            aria-label="Export filtered demo records"
            disabled={!filtered.length}
            onClick={exportRows}
          >
            <Download size={16} />
          </button>
          {(q || status !== "All statuses" || method !== "All methods") && (
            <button
              className="btn btn-secondary btn-small"
              onClick={() => {
                setQ("");
                setStatus("All statuses");
                setMethod("All methods");
                setPage(1);
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}
      {compact && (
        <div className="panel-header">
          <div>
            <h2>Recent contributions</h2>
            <p>A little support, from a caring community.</p>
          </div>
          <a
            href={
              donor
                ? "/dashboard/donor/history/"
                : "/dashboard/family/contributions/"
            }
          >
            View all ↗
          </a>
        </div>
      )}
      {visible.length ? (
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Contribution records, scroll horizontally for more columns"
        >
          <table className="data-table">
            <thead>
              <tr>
                <th>{donor ? "Memorial" : "Contributor"}</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                {!compact && (
                  <>
                    <th>Reference</th>
                    <th>Acknowledgement</th>
                    {donor && <th>Receipt</th>}
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="table-name">
                      <span className="table-avatar">
                        {c.name
                          .split(" ")
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                      <div>
                        <strong>
                          {donor
                            ? state.campaigns.find((x) => x.id === c.campaignId)
                                ?.name
                            : c.name}
                        </strong>
                        <small>
                          {donor
                            ? "Your contribution"
                            : acknowledgementLabels[c.acknowledgement]}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>{money(c.amount)}</strong>
                  </td>
                  <td>
                    <Badge>{c.method === "Cash" ? "Cash" : "Digital"}</Badge>
                    {!compact && <small>{c.method}</small>}
                  </td>
                  <td>{dateLabel(c.date)}</td>
                  <td>
                    <Badge>{c.status}</Badge>
                  </td>
                  {!compact && (
                    <>
                      <td>{c.id}</td>
                      <td>{acknowledgementLabels[c.acknowledgement]}</td>
                      {donor && (
                        <td>
                          <button
                            className="icon-button"
                            disabled={c.status !== "Verified"}
                            aria-label={`Download receipt ${c.id}`}
                            onClick={() => {
                              const campaign = state.campaigns.find(
                                (x) => x.id === c.campaignId,
                              );
                              if (campaign) receipt(c, campaign);
                            }}
                          >
                            <Download size={14} />
                          </button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title={
            rows.length
              ? "No matching contributions"
              : "The first gesture starts here."
          }
          description={
            rows.length
              ? "Try changing your search or filters."
              : "Verified contributions will appear here when you complete a demo contribution or record cash."
          }
        />
      )}
      <div className="pagination">
        <span>
          {filtered.length
            ? `${(current - 1) * size + 1}–${Math.min(current * size, filtered.length)} of ${filtered.length} contributions`
            : "0 contributions"}
        </span>
        <div>
          <button
            disabled={current === 1}
            aria-label="Previous page"
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft size={12} />
          </button>
          <span>
            {current} / {pages}
          </span>
          <button
            disabled={current === pages}
            aria-label="Next page"
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
