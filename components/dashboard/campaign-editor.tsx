"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ImagePlus } from "lucide-react";
import { Campaign } from "@/lib/types";
import { validateMemorial } from "@/lib/memorials";
import { dateLabel, money } from "@/lib/utils";
import { useDemo } from "@/components/providers";
import { Modal, Field, Badge } from "@/components/common/ui";

const fallback = "/images/memorial-placeholder.svg";
export function CampaignEditor({
  campaign,
  onClose,
}: {
  campaign: Campaign | "new";
  onClose: () => void;
}) {
  const editing = campaign !== "new";
  const { setState } = useDemo();
  const [record, setRecord] = useState<Campaign>(() =>
    editing
      ? { ...campaign }
      : {
          id: `demo-${crypto.randomUUID().slice(0, 10)}`,
          name: "",
          years: "",
          organiser: "",
          location: "",
          venue: "",
          date: "",
          time: "09:00",
          target: 50000,
          image: fallback,
          status: "Pending",
          obituary: "",
          description: "",
        },
  );
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const update = (key: keyof Campaign, value: string | number) => {
    setRecord((r) => ({ ...r, [key]: value }));
    setError("");
  };
  const go = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const upload = async (file?: File) => {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 8 * 1024 * 1024
    ) {
      setError("Choose a JPG, PNG or WebP photograph under 8 MB.");
      return;
    }
    setLoading(true);
    setError("");
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      const scale = Math.min(1, 1000 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No canvas");
      ctx.fillStyle = "#f4f0e7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      update("image", canvas.toDataURL("image/jpeg", 0.8));
    } catch {
      setError(
        "We couldn’t read that photograph. Please choose another image.",
      );
    } finally {
      URL.revokeObjectURL(url);
      setLoading(false);
    }
  };
  const save = () => {
    const invalid = validateMemorial(record);
    if (invalid) {
      setError(invalid);
      go(0);
      return;
    }
    const cleaned = {
      ...record,
      name: record.name.trim(),
      organiser: record.organiser.trim(),
      venue: record.venue.trim(),
      location: record.location.trim(),
      obituary: record.obituary.trim(),
      description: record.description.trim(),
    };
    setState((s) => ({
      ...s,
      campaigns: editing
        ? s.campaigns.map((c) => (c.id === record.id ? cleaned : c))
        : [cleaned, ...s.campaigns],
      activeCampaignId: record.id,
      audit: [
        {
          id: crypto.randomUUID(),
          action: `${editing ? "Updated" : "Submitted"} memorial: ${cleaned.name} (demo)`,
          date: new Date().toISOString(),
        },
        ...s.audit,
      ],
    }));
    setSaved(true);
  };
  return (
    <Modal
      title={
        saved
          ? "A place for their memory."
          : editing
            ? "Care for their memorial"
            : "Create a funeral page"
      }
      onClose={onClose}
    >
      {saved ? (
        <div className="editor-success form-stack">
          <span className="success-mark">
            <Check size={30} />
          </span>
          <h3>
            {editing
              ? "Your changes are ready."
              : "Your memorial is ready for review."}
          </h3>
          <p>
            {record.name} has been {editing ? "updated" : "added"} to your
            family workspace.{" "}
            {record.status === "Pending"
              ? "Approve it in the demo admin workspace to make it appear on Explore."
              : "Open the memorial to see your changes."}
          </p>
          <div className="demo-notice">
            This demo is saved in this browser only. It will not appear on
            another device.
          </div>
          <div className="form-actions">
            <Link
              className="btn btn-secondary"
              href={`/memorial/?id=${record.id}`}
            >
              Preview memorial
            </Link>
            {record.status === "Pending" ? (
              <Link
                className="btn"
                href={`/dashboard/admin/campaigns/?review=${record.id}`}
              >
                Try demo approval <ArrowRight size={16} />
              </Link>
            ) : (
              <button className="btn" onClick={onClose}>
                Back to memorials
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <ol className="editor-steps" aria-label="Memorial creation progress">
            {["The details", "Their story", "Review"].map((label, i) => (
              <li
                key={label}
                aria-current={step === i ? "step" : undefined}
                className={i <= step ? "reached" : ""}
              >
                <span>{i + 1}</span>
                {label}
              </li>
            ))}
          </ol>
          <h3 ref={heading} tabIndex={-1} className="editor-heading">
            {
              [
                "Begin with the person you remember.",
                "Make room for their story.",
                "A final look, with care.",
              ][step]
            }
          </h3>
          <p className="note-text">
            Use fictional details for this demo. All fields are required except
            the photograph.
          </p>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 2) {
                const invalid = validateMemorial(
                  step === 0
                    ? {
                        ...record,
                        obituary: "A life lovingly remembered.",
                        description: "With love from the family.",
                      }
                    : record,
                );
                if (invalid) {
                  setError(invalid);
                  return;
                }
              }
              if (step === 2) save();
              else go(step + 1);
            }}
          >
            {step === 0 && (
              <>
                <div className="portrait-upload">
                  <img src={record.image} alt="Memorial photograph preview" />
                  <div>
                    <Field label="Memorial photograph">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        disabled={loading}
                        onChange={(e) => {
                          void upload(e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                    </Field>
                    <p className="note-text">
                      <ImagePlus size={14} /> JPG, PNG or WebP · up to 8 MB
                    </p>
                    {loading && <p role="status">Preparing photograph…</p>}
                    {record.image !== fallback && (
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => update("image", fallback)}
                      >
                        Remove photograph
                      </button>
                    )}
                  </div>
                </div>
                <Field label="Full name">
                  <input
                    required
                    maxLength={100}
                    value={record.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="e.g. Nana Kwasi Mensah"
                  />
                </Field>
                <div className="form-grid">
                  <Field label="Years of life">
                    <input
                      required
                      maxLength={20}
                      value={record.years}
                      onChange={(e) => update("years", e.target.value)}
                      placeholder="1948 — 2026"
                    />
                  </Field>
                  <Field label="Family / organiser">
                    <input
                      required
                      maxLength={100}
                      value={record.organiser}
                      onChange={(e) => update("organiser", e.target.value)}
                      placeholder="e.g. The Mensah family"
                    />
                  </Field>
                  <Field label="Funeral date">
                    <input
                      type="date"
                      required
                      value={record.date}
                      onChange={(e) => update("date", e.target.value)}
                    />
                  </Field>
                  <Field label="Service time (Ghana)">
                    <input
                      type="time"
                      required
                      value={record.time || "09:00"}
                      onChange={(e) => update("time", e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="City / town">
                  <input
                    required
                    maxLength={100}
                    value={record.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="e.g. Kumasi"
                  />
                </Field>
                <Field label="Venue and address">
                  <input
                    required
                    maxLength={200}
                    value={record.venue}
                    onChange={(e) => update("venue", e.target.value)}
                    placeholder="Church or venue name and address"
                  />
                </Field>
                <Field label="Fundraising target (GHS)">
                  <input
                    required
                    type="number"
                    min={1}
                    max={10000000}
                    step="0.01"
                    value={record.target || ""}
                    onChange={(e) => update("target", Number(e.target.value))}
                  />
                </Field>
              </>
            )}
            {step === 1 && (
              <>
                <Field label="Their story / obituary">
                  <textarea
                    required
                    minLength={20}
                    maxLength={5000}
                    rows={8}
                    value={record.obituary}
                    onChange={(e) => update("obituary", e.target.value)}
                    placeholder="The moments, values and people that made their life special…"
                  />
                </Field>
                <span className="character-count">
                  {record.obituary.length.toLocaleString()} / 5,000
                </span>
                <Field label="A message from the family">
                  <textarea
                    required
                    minLength={10}
                    maxLength={3000}
                    rows={5}
                    value={record.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="How can the community support your family?"
                  />
                </Field>
                <span className="character-count">
                  {record.description.length.toLocaleString()} / 3,000
                </span>
              </>
            )}
            {step === 2 && (
              <div className="editor-review">
                <div className="review-identity">
                  <img src={record.image} alt="Memorial preview" />
                  <div>
                    <Badge>{record.status}</Badge>
                    <h3>{record.name}</h3>
                    <p>{record.years}</p>
                  </div>
                </div>
                <dl>
                  <dt>Organised by</dt>
                  <dd>{record.organiser}</dd>
                  <dt>Celebration of life</dt>
                  <dd>
                    {dateLabel(record.date)} · {record.time || "09:00"} GMT
                    <br />
                    {record.venue}, {record.location}
                  </dd>
                  <dt>Contribution goal</dt>
                  <dd>{money(record.target)}</dd>
                </dl>
                <h4>Their story</h4>
                <p className="preserve-lines">{record.obituary}</p>
                <h4>From the family</h4>
                <p className="preserve-lines">{record.description}</p>
                <div className="demo-notice">
                  {editing
                    ? "Saving updates this memorial in your browser."
                    : "After submitting, the memorial stays pending until you approve it in the demo admin workspace."}
                </div>
              </div>
            )}
            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}
            <div className="form-actions editor-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => (step ? go(step - 1) : onClose())}
              >
                {step ? "Back" : "Cancel"}
              </button>
              <button className="btn" disabled={loading}>
                {step === 2
                  ? editing
                    ? "Save changes"
                    : "Submit for demo review"
                  : "Continue"}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}
