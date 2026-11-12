import { test } from "node:test";
import assert from "node:assert/strict";
import { isPublicMemorial, validateMemorial } from "../lib/memorials";
import { campaigns } from "../lib/mock-data";
import { CampaignStatus } from "../lib/types";

test("Only approved and completed memorials appear on Explore", () => {
  for (const status of ["Pending", "Rejected", "Suspended"] as CampaignStatus[])
    assert.equal(isPublicMemorial({ ...campaigns[0], status }), false);
  assert.equal(isPublicMemorial({ ...campaigns[0], status: "Active" }), true);
  assert.equal(
    isPublicMemorial({ ...campaigns[0], status: "Completed" }),
    true,
  );
});
test("Memorial submission rejects inconsistent dates, blank stories and invalid targets", () => {
  const c = { ...campaigns[0], years: "1948 — 2026", date: "2026-11-15" };
  assert.equal(validateMemorial(c), "");
  for (const patch of [
    { years: "2026 — 1948" },
    { years: "1948 — 2099" },
    { date: "2025-12-01" },
    { target: NaN },
    { target: 0 },
    { target: 10000001 },
    { name: "   " },
    { venue: "   " },
    { obituary: "                        " },
    { description: "     " },
  ])
    assert.notEqual(
      validateMemorial({ ...c, ...patch }),
      "",
      JSON.stringify(patch),
    );
});
