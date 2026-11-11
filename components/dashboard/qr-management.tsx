"use client";
import { useState } from "react";
import {
  Copy,
  Download,
  Flower2,
  Info,
  MessageCircle,
  QrCode,
  ScanLine,
} from "lucide-react";
import { useDemo } from "@/components/providers";
import { useQr, QRCodeDisplay, campaignUrl } from "@/components/qr/qr-display";
import { Field, Badge } from "@/components/common/ui";
import { qrStatistics } from "@/lib/mock-data";
import { jsPDF } from "jspdf";
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });
}
export function QRManagement() {
  const { state, setState, toast } = useDemo();
  const id = state.activeCampaignId;
  const setId = (value: string) =>
    setState((s) => ({ ...s, activeCampaignId: value }));
  const [scans, setScans] = useState(0);
  const [busy, setBusy] = useState(false);
  const c = state.campaigns.find((c) => c.id === id)!;
  const url = campaignUrl(id);
  const qrUrl = `${url}&via=qr`;
  const qr = useQr(qrUrl);
  const disabled = state.qrDisabled.includes(id);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast("Memorial link copied");
    } catch {
      toast("Copy unavailable. Select the memorial URL to copy it.");
    }
  };
  const download = async (kind: "qr" | "png" | "pdf") => {
    if (!qr || busy || disabled) return;
    setBusy(true);
    try {
      if (kind === "qr") {
        const a = document.createElement("a");
        a.href = qr;
        a.download = `${id}-qr.png`;
        a.click();
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 1414;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#faf8ef";
      ctx.fillRect(0, 0, 1000, 1414);
      ctx.strokeStyle = "#c8b991";
      ctx.lineWidth = 2;
      ctx.strokeRect(35, 35, 930, 1344);
      ctx.textAlign = "center";
      ctx.fillStyle = "#9f8757";
      ctx.font = "22px 'DM Serif Display', Georgia, serif";
      ctx.fillText("IN LOVING MEMORY", 500, 105);
      const portrait = await loadImage(c.image);
      const ratio = Math.max(245 / portrait.width, 290 / portrait.height);
      ctx.save();
      ctx.beginPath();
      ctx.rect(377, 145, 245, 290);
      ctx.clip();
      ctx.drawImage(
        portrait,
        500 - (portrait.width * ratio) / 2,
        145,
        portrait.width * ratio,
        portrait.height * ratio,
      );
      ctx.restore();
      ctx.fillStyle = "#2d392c";
      ctx.font = "46px 'DM Serif Display', Georgia, serif";
      const lines =
        c.name.length > 29
          ? [
              c.name.slice(0, c.name.lastIndexOf(" ")),
              c.name.slice(c.name.lastIndexOf(" ") + 1),
            ]
          : [c.name];
      lines.forEach((line, i) => ctx.fillText(line, 500, 510 + i * 48, 850));
      ctx.font = "22px Arial";
      ctx.fillStyle = "#8b8e7e";
      ctx.fillText(c.years, 500, 610);
      ctx.drawImage(await loadImage(qr), 300, 650, 400, 400);
      ctx.fillStyle = "#2d392c";
      ctx.font = "29px 'DM Serif Display', Georgia, serif";
      ctx.fillText("Scan to remember. Scan to support.", 500, 1115);
      ctx.fillStyle = "#7e8571";
      ctx.font = "19px Arial";
      ctx.fillText("Open your camera and scan this QR code.", 500, 1160);
      ctx.font = "14px Arial";
      ctx.fillText(url, 500, 1210, 850);
      ctx.font = "16px Arial";
      ctx.fillText("DEMONSTRATION ONLY - NO REAL PAYMENTS", 500, 1270);
      ctx.fillStyle = "#a68a50";
      ctx.font = "28px 'DM Serif Display', Georgia, serif";
      ctx.fillText("Nsaabɔdeɛ", 500, 1330);
      const data = canvas.toDataURL("image/png");
      if (kind === "pdf") {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        pdf.addImage(data, "PNG", 0, 0, 210, 297);
        pdf.save(`${id}-demo-poster.pdf`);
      } else {
        const a = document.createElement("a");
        a.href = data;
        a.download = `${id}-demo-poster.png`;
        a.click();
      }
      toast("Print-ready demo poster downloaded");
    } catch {
      toast("The download could not be created. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <div className="dash-title">
        <div>
          <h1>One scan. A shared remembrance.</h1>
          <p>
            Your memorial QR code, ready for programmes, invitations, and the
            funeral grounds.
          </p>
        </div>
        <Badge>{disabled ? "Suspended" : "Active"}</Badge>
      </div>
      <div className="qr-management">
        <div className="panel qr-controls">
          <Field label="Choose a memorial">
            <select value={id} onChange={(e) => setId(e.target.value)}>
              {state.campaigns
                .filter(
                  (c) => c.id === "kwasi-mensah" || c.id.startsWith("demo-"),
                )
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </Field>
          <h3>Share the memorial</h3>
          <div className="link-box">
            <input
              aria-label="Memorial URL"
              readOnly
              value={url}
              onFocus={(e) => e.target.select()}
            />
            <button
              className="icon-button"
              aria-label="Copy memorial URL"
              onClick={copy}
            >
              <Copy size={16} />
            </button>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() =>
              window.open(
                `https://wa.me/?text=${encodeURIComponent(`In loving memory of ${c.name}. Remember and support the family: ${url} (demonstration memorial)`)}`,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            <MessageCircle size={15} />
            Share via WhatsApp
          </button>
          <h3>Download & print</h3>
          <p className="small">
            Choose a standalone QR code or a complete A4 memorial poster.
          </p>
          <div
            className="form-actions"
            style={{ justifyContent: "flex-start", flexWrap: "wrap" }}
          >
            <button
              className="btn btn-secondary"
              disabled={!qr || disabled || busy}
              onClick={() => download("qr")}
            >
              <QrCode size={14} />
              QR PNG
            </button>
            <button
              className="btn btn-secondary"
              disabled={!qr || disabled || busy}
              onClick={() => download("png")}
            >
              <Download size={14} />
              Poster PNG
            </button>
            <button
              className="btn"
              disabled={!qr || disabled || busy}
              onClick={() => download("pdf")}
            >
              <Download size={14} />
              Poster PDF
            </button>
          </div>
          <h3>
            QR activity <Badge>Demo</Badge>
          </h3>
          <div
            className="stats-grid"
            style={{ gridTemplateColumns: "1fr 1fr", marginTop: 15 }}
          >
            <div className="stat-card">
              <div className="stat-top">
                Illustrative scans
                <ScanLine size={16} />
              </div>
              <div className="stat-value">
                {qrStatistics.reduce((s, d) => s + d.scans, 0) + scans}
              </div>
              <div className="stat-foot">Mock statistics · last 7 days</div>
            </div>
            <div className="stat-card">
              <div className="stat-top">QR status</div>
              <div className="stat-value" style={{ fontSize: 23 }}>
                {disabled ? "Paused" : "Active"}
              </div>
              <div className="stat-foot">Browser-local state</div>
            </div>
          </div>
          <div
            className="form-actions"
            style={{ justifyContent: "flex-start" }}
          >
            <button
              className="btn btn-secondary"
              disabled={disabled}
              onClick={() => {
                setScans((s) => s + 1);
                toast("One illustrative scan added");
              }}
            >
              Simulate a scan
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setState((s) => ({
                  ...s,
                  qrDisabled: disabled
                    ? s.qrDisabled.filter((x) => x !== id)
                    : [...s.qrDisabled, id],
                }));
                toast(
                  disabled
                    ? "Demo QR reactivated"
                    : "Demo QR paused. QR visitors in this browser will see a paused message.",
                );
              }}
            >
              {disabled ? "Reactivate QR" : "Pause QR code"}
            </button>
          </div>
          <div className="demo-notice mt-20">
            <Info />
            Pausing is simulated in this browser. Downloaded codes cannot be
            globally disabled without a future backend.
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h2>Print-ready poster preview</h2>
            <Badge>A4</Badge>
          </div>
          <div className={`poster ${disabled ? "qr-disabled" : ""}`}>
            <Flower2 size={28} strokeWidth={1} />
            <div className="eyebrow">IN LOVING MEMORY</div>
            <img
              className="portrait"
              src={c.image}
              alt="Fictional memorial portrait"
            />
            <h2>{c.name}</h2>
            <div className="years">{c.years}</div>
            <QRCodeDisplay value={qrUrl} />
            <p>
              Scan to remember.
              <br />
              Scan to support the family.
            </p>
            <small>{url}</small>
            <p>Demo only · No real payments</p>
          </div>
        </div>
      </div>
    </>
  );
}
