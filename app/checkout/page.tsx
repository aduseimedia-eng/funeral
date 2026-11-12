"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Info,
  Download,
  XCircle,
} from "lucide-react";
import { Navbar, Footer, Field, EmptyState } from "@/components/common/ui";
import { useDemo } from "@/components/providers";
import { Acknowledgement, Contribution } from "@/lib/types";
import { acknowledgementLabels } from "@/lib/mock-data";
import { money } from "@/lib/utils";
import { receipt } from "@/lib/downloads";
export default function Checkout() {
  const { state, setState, ready } = useDemo();
  const [id, setId] = useState("kwasi-mensah");
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(200);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ack, setAck] = useState<Acknowledgement>("full");
  const [method, setMethod] = useState("MTN Mobile Money");
  const [result, setResult] = useState("success");
  const [processing, setProcessing] = useState(false);
  const [payment, setPayment] = useState<Contribution | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setId(
      new URLSearchParams(window.location.search).get("id") || "kwasi-mensah",
    );
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (state.user) {
      setName(state.user.name);
      setEmail(state.user.email);
    }
  }, [state.user]);
  useEffect(() => {
    setAck(state.preferences.acknowledgement as Acknowledgement);
  }, [state.preferences.acknowledgement]);
  const c = state.campaigns.find((c) => c.id === id);
  if (!ready)
    return (
      <div className="loading-state">
        <div className="spinner" />
      </div>
    );
  if (!c || c.status !== "Active")
    return (
      <>
        <Navbar />
        <EmptyState
          title="Contributions are unavailable"
          description="Please choose an active memorial."
          action={
            <Link className="btn" href="/campaigns/">
              Explore memorials
            </Link>
          }
        />
        <Footer />
      </>
    );
  const submit = () => {
    if (processing) return;
    setProcessing(true);
    timer.current = setTimeout(() => {
      const row: Contribution = {
        id: `NSA-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        campaignId: id,
        userId: state.user?.role === "donor" ? state.user.id : null,
        name: name.trim(),
        amount,
        method,
        date: new Date().toISOString(),
        status: result === "success" ? "Verified" : "Failed",
        acknowledgement: ack,
        announced: false,
      };
      setState((s) => ({ ...s, contributions: [row, ...s.contributions] }));
      setPayment(row);
      setProcessing(false);
      setStep(4);
    }, 1800);
  };
  return (
    <>
      <Navbar />
      <main className="checkout-wrap">
        <div className="checkout-top">
          <div className="eyebrow">A GESTURE THAT MATTERS</div>
          <h1>Stand with the family.</h1>
          <p>In loving memory of {c.name}</p>
        </div>
        <div className="demo-notice">
          <Info />
          Demo checkout only. No money will be collected. Please use fictional
          details.
        </div>
        <div className="checkout-steps">
          {["Contribution", "Your details", "Payment", "Review"].map(
            (label, i) => (
              <div
                key={label}
                className={`checkout-step ${step >= i ? "active" : ""}`}
                aria-current={step === i ? "step" : undefined}
              >
                <span>{step > i ? <Check size={12} /> : i + 1}</span>
                {label}
              </div>
            ),
          )}
        </div>
        <div className="checkout-card">
          {processing ? (
            <div className="result-card" role="status">
              <div className="spinner" />
              <h2>Simulating your contribution…</h2>
              <p>This demonstration does not contact a payment provider.</p>
            </div>
          ) : step === 0 ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (amount > 0 && amount <= 1000000) setStep(1);
              }}
            >
              <h2>Choose your contribution</h2>
              <p className="note-text">
                Every gesture of support makes a difference.
              </p>
              <div className="amount-grid">
                {[50, 100, 200, 500, 1000, 2000].map((a) => (
                  <button
                    type="button"
                    className={`choice ${amount === a ? "active" : ""}`}
                    key={a}
                    onClick={() => setAmount(a)}
                  >
                    {money(a)}
                  </button>
                ))}
              </div>
              <Field label="Or enter a custom amount (GHS)">
                <input
                  aria-label="Custom contribution amount"
                  type="number"
                  min="1"
                  max="1000000"
                  step="0.01"
                  value={amount || ""}
                  required
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </Field>
              <div className="form-actions">
                <button className="btn">
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </form>
          ) : step === 1 ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) setStep(2);
              }}
            >
              <h2>Your details & acknowledgement</h2>
              <div className="form-stack mt-20">
                <Field label="Full name">
                  <input
                    required
                    pattern=".*\S.*"
                    maxLength={80}
                    placeholder="e.g. Kwame Asante"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
                <Field label="Email address (demo)">
                  <input
                    type="email"
                    required
                    placeholder="kwame@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
              </div>
              <h3 className="mt-20">How would you like to be acknowledged?</h3>
              {(
                [
                  [
                    "full",
                    "Full acknowledgement",
                    "Your name and amount can be announced by the MC.",
                  ],
                  [
                    "name",
                    "Name only",
                    "Your name can be announced. Your amount stays hidden from the MC.",
                  ],
                  [
                    "anonymous",
                    "Anonymous",
                    "Neither your name nor your amount is shown to the MC.",
                  ],
                ] as const
              ).map(([value, label, description]) => (
                <label className="choice-row" key={value}>
                  <input
                    type="radio"
                    name="ack"
                    checked={ack === value}
                    onChange={() => setAck(value)}
                  />
                  <span>
                    <strong>{label}</strong>
                    <small>{description}</small>
                  </span>
                </label>
              ))}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(0)}
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
                <button className="btn">
                  Continue <ArrowRight size={14} />
                </button>
              </div>
            </form>
          ) : step === 2 ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(3);
              }}
            >
              <h2>Choose a demo payment method</h2>
              <p className="note-text">
                No account, phone, or bank card details are required.
              </p>
              {[
                ["MTN Mobile Money", "MTN", ""],
                ["Telecel Cash", "telecel", "telecel"],
                ["AT Money", "AT", "at"],
                ["Bank card", "CARD", "card"],
              ].map(([value, label, style]) => (
                <label className="choice-row" key={value}>
                  <input
                    type="radio"
                    name="method"
                    checked={method === value}
                    onChange={() => setMethod(value)}
                  />
                  <span className={`payment-mark ${style}`}>{label}</span>
                  <span>
                    <strong>{value}</strong>
                    <small>Simulated payment</small>
                  </span>
                </label>
              ))}
              <div className="mt-20">
                <Field label="Demonstration outcome">
                  <select
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                  >
                    <option value="success">
                      Simulate a successful payment
                    </option>
                    <option value="failure">Simulate a failed payment</option>
                  </select>
                </Field>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button className="btn">
                  Review contribution <ArrowRight size={14} />
                </button>
              </div>
            </form>
          ) : step === 3 ? (
            <div>
              <h2>A moment to review</h2>
              {[
                ["Memorial", c.name],
                ["Contribution", money(amount)],
                ["Contributor", name],
                ["Demo email", email],
                ["Acknowledgement", acknowledgementLabels[ack]],
                ["Payment method", method],
                [
                  "Simulation outcome",
                  result === "success" ? "Success" : "Failure",
                ],
              ].map(([label, value]) => (
                <div className="review-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
              <p className="note-text">
                The family organiser can view the contribution register. Your MC
                acknowledgement preference is shown above.
              </p>
              <div className="demo-notice">
                <Info />
                This action creates a local demo record only. No funds will be
                transferred.
              </div>
              <div className="form-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
                <button className="btn" onClick={submit}>
                  Simulate {money(amount)} contribution <Heart size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="result-card">
              <div className="success-icon">
                {payment?.status === "Verified" ? (
                  <Check size={28} />
                ) : (
                  <XCircle size={28} />
                )}
              </div>
              <div className="eyebrow">DEMONSTRATION RESULT</div>
              <h2 className="mt-20">
                {payment?.status === "Verified"
                  ? "Your support has been recorded."
                  : "The simulated payment failed."}
              </h2>
              <p>
                {payment?.status === "Verified"
                  ? "Thank you for standing with the family in this demonstration."
                  : "No verified contribution was added. You can retry the simulation."}
                <br />
                <strong>No money has been transferred.</strong>
              </p>
              <p>Reference: {payment?.id}</p>
              {payment?.status === "Verified" ? (
                <button
                  className="btn"
                  onClick={() => payment && receipt(payment, c)}
                >
                  <Download size={15} />
                  Download demo receipt
                </button>
              ) : (
                <button
                  className="btn"
                  onClick={() => {
                    setPayment(null);
                    setStep(2);
                  }}
                >
                  Try again
                </button>
              )}
              <Link className="btn btn-secondary" href={`/memorial/?id=${id}`}>
                Back to memorial
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
