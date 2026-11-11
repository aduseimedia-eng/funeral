import { Contribution } from "@/lib/types";
export const money = (value: number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
export const dateLabel = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
export const totalFor = (rows: Contribution[], id?: string) =>
  rows
    .filter((c) => c.status === "Verified" && (!id || c.campaignId === id))
    .reduce((sum, c) => sum + c.amount, 0);
export function mcView(c: Contribution) {
  return {
    id: c.id,
    campaignId: c.campaignId,
    name: c.acknowledgement === "anonymous" ? "Anonymous" : c.name,
    amount: c.acknowledgement === "full" ? c.amount : null,
    acknowledgement: c.acknowledgement,
    announced: c.announced,
    status: c.status,
  };
}
export function downloadFile(
  name: string,
  content: string,
  type = "text/csv;charset=utf-8",
) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function csv(rows: (string | number)[][]) {
  return rows
    .map((row) =>
      row
        .map((v) => {
          let s = String(v);
          if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
          return '"' + s.replaceAll('"', '""') + '"';
        })
        .join(","),
    )
    .join("\r\n");
}
