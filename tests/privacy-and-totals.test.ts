import { test } from "node:test";
import assert from "node:assert/strict";
import { mcView, totalFor, csv } from "../lib/utils";
import { contributions } from "../lib/mock-data";
test("MC projection excludes anonymous identity, private amount and user ID", () => {
  const row = {
    ...contributions[0],
    name: "Private donor",
    amount: 999,
    userId: "private-user",
    acknowledgement: "anonymous" as const,
  };
  const view = mcView(row);
  assert.equal(view.name, "Anonymous");
  assert.equal(view.amount, null);
  assert.ok(!JSON.stringify(view).includes("Private donor"));
  assert.ok(!("userId" in view));
});
test("Name-only acknowledgements hide the amount; full acknowledgements retain it", () => {
  const row = contributions[0];
  assert.equal(mcView({ ...row, acknowledgement: "name" }).amount, null);
  assert.equal(mcView({ ...row, acknowledgement: "name" }).name, row.name);
  assert.equal(mcView({ ...row, acknowledgement: "full" }).amount, row.amount);
});
test("Fundraising totals exclude failed and pending records and respect campaign scope", () => {
  const row = contributions[0];
  const rows = [
    { ...row, amount: 100, status: "Verified" as const },
    { ...row, amount: 900, status: "Failed" as const },
    { ...row, amount: 500, status: "Pending" as const },
    { ...row, campaignId: "another", amount: 50 },
  ];
  assert.equal(totalFor(rows, row.campaignId), 100);
  assert.equal(totalFor(rows), 150);
});
test("CSV export quotes text and protects spreadsheet formula cells", () => {
  assert.equal(
    csv([["=1+1", 'a"b', "hello,world"]]),
    '"\'=1+1","a""b","hello,world"',
  );
});
