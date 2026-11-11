import { jsPDF } from "jspdf";
import { Contribution, Campaign } from "./types";
import { dateLabel, money } from "./utils";
export function receipt(c: Contribution, campaign: Campaign) {
  const doc = new jsPDF();
  doc.setFontSize(11);
  doc.setTextColor(147, 126, 78);
  doc.text("NSAABODEE / DEMONSTRATION RECEIPT", 20, 25);
  doc.setTextColor(39, 43, 38);
  doc.setFontSize(23);
  doc.text("A gesture of support.", 20, 48);
  doc.setFontSize(11);
  const lines = [
    `Reference: ${c.id}`,
    `Memorial: ${campaign.name}`,
    `Contributor: ${c.name}`,
    `Amount: ${money(c.amount).replace("GH₵", "GHS ")}`,
    `Method: ${c.method}`,
    `Recorded: ${dateLabel(c.date)}`,
    `Acknowledgement: ${c.acknowledgement}`,
    `Demo status: ${c.status}`,
  ];
  lines.forEach((line, i) =>
    doc.text(line.replace(/[^\x20-\x7E]/g, ""), 20, 73 + i * 12),
  );
  doc.setTextColor(140, 110, 60);
  doc.text("FRONTEND SIMULATION - NO MONEY HAS BEEN TRANSFERRED.", 20, 195);
  doc.setTextColor(100);
  doc.text("This is an illustrative record, not proof of payment.", 20, 208);
  doc.save(`demo-receipt-${c.id}.pdf`);
}
