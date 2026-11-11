"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Info, Check, ShieldCheck } from "lucide-react";
import { Logo, Field } from "@/components/common/ui";
import { useDemo } from "@/components/providers";
import { Role } from "@/lib/types";
import { users } from "@/lib/mock-data";
type Mode =
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password"
  | "verify-email"
  | "two-factor";
export function AuthForm({ mode }: { mode: Mode }) {
  const { state, setState, toast } = useDemo();
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [role, setRole] = useState<Role>("family");
  const [error, setError] = useState("");
  const titles = {
    login: "Welcome back.",
    register: "Begin with togetherness.",
    "forgot-password": "A fresh start.",
    "reset-password": "Choose a new password.",
    "verify-email": "Check your inbox.",
    "two-factor": "One more step.",
  };
  const descriptions = {
    login: "A little clarity. A little comfort. All in one place.",
    register: "Create a demo account to explore your workspace.",
    "forgot-password": "Simulate a password reset email. No email is sent.",
    "reset-password":
      "Set a demonstration password. No credentials are stored.",
    "verify-email": "Simulate email verification using the demo code 123456.",
    "two-factor": "Enter 123456 to simulate two-factor verification.",
  };
  const login = (r: Role) => {
    setState((s) => ({ ...s, user: s.demoUsers.find((u) => u.role === r)! }));
    toast(
      `Entered the ${r === "family" ? "family organiser" : r === "admin" ? "superadmin" : r} demo`,
    );
    router.push(`/dashboard/${r}/`);
  };
  return (
    <main className="auth-layout">
      <section className="auth-brand">
        <Logo light />
        <div>
          <div className="eyebrow">ROOTED IN TRADITION. CONNECTED BY LOVE.</div>
          <h2>
            Honouring lives.
            <br />
            Supporting families.
            <br />
            <em>Together.</em>
          </h2>
          <p>
            A thoughtful space to remember a loved one and stand with the people
            they leave behind.
          </p>
        </div>
        <div className="auth-brand-bottom">REMEMBER. HONOUR. SUPPORT.</div>
      </section>
      <section className="auth-content">
        <div className="auth-form">
          <Link className="small" href="/">
            ← Back to Nsaabɔdeɛ
          </Link>
          <h1>{done ? "You’re all set." : titles[mode]}</h1>
          <p>
            {done
              ? "Your demo action is complete. No email was sent and no security service was contacted."
              : descriptions[mode]}
          </p>
          {done ? (
            <div>
              <div className="success-icon">
                <Check />
              </div>
              <Link
                className="btn"
                href={mode === "register" ? "/verify-email/" : "/login/"}
              >
                Continue <ArrowUpRight size={16} />
              </Link>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setError("");
                const f = new FormData(e.currentTarget);
                if (mode === "login") {
                  const u = state.demoUsers.find(
                    (u) =>
                      u.email.toLowerCase() ===
                      String(f.get("email")).toLowerCase(),
                  );
                  if (!u) {
                    setError(
                      "Use a demo account below, or akua@example.com with any 6-character password.",
                    );
                    return;
                  }
                  setState((s) => ({ ...s, user: u }));
                  router.push(`/dashboard/${u.role}/`);
                } else if (mode === "register") {
                  const account = {
                    id: `demo-${crypto.randomUUID()}`,
                    name: String(f.get("name")).trim(),
                    email: String(f.get("email")),
                    role,
                  };
                  if (
                    state.demoUsers.some(
                      (u) =>
                        u.email.toLowerCase() === account.email.toLowerCase(),
                    )
                  ) {
                    setError(
                      "A demo account with this email already exists. Please log in.",
                    );
                    return;
                  }
                  setState((s) => ({
                    ...s,
                    user: account,
                    demoUsers: [...s.demoUsers, account],
                  }));
                  setDone(true);
                } else if (mode === "two-factor" || mode === "verify-email") {
                  if (f.get("code") !== "123456") {
                    setError("Use the demonstration code 123456.");
                    return;
                  }
                  setDone(true);
                } else {
                  if (
                    mode === "reset-password" &&
                    f.get("password") !== f.get("confirm")
                  ) {
                    setError("Passwords must match.");
                    return;
                  }
                  setDone(true);
                }
              }}
            >
              {mode === "register" && (
                <Field label="Full name">
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    pattern=".*\S.*"
                    maxLength={80}
                    placeholder="Your name"
                  />
                </Field>
              )}
              {["login", "register", "forgot-password"].includes(mode) && (
                <Field label="Email address">
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="akua@example.com"
                  />
                </Field>
              )}
              {["login", "register", "reset-password"].includes(mode) && (
                <Field
                  label={
                    mode === "reset-password"
                      ? "New demo password"
                      : "Demo password"
                  }
                >
                  <input
                    name="password"
                    type="password"
                    minLength={6}
                    required
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    placeholder="Any 6 or more characters"
                  />
                </Field>
              )}
              {mode === "reset-password" && (
                <Field label="Confirm demo password">
                  <input
                    name="confirm"
                    type="password"
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />
                </Field>
              )}
              {mode === "register" && (
                <Field label="I am joining as">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                  >
                    <option value="family">Family organiser</option>
                    <option value="donor">Contributor</option>
                    <option value="mc">Funeral MC</option>
                  </select>
                </Field>
              )}
              {(mode === "verify-email" || mode === "two-factor") && (
                <Field label="6-digit demonstration code">
                  <input
                    name="code"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    placeholder="123456"
                    autoComplete="one-time-code"
                  />
                </Field>
              )}
              {mode === "login" && (
                <Link className="auth-forgot" href="/forgot-password/">
                  Forgot password?
                </Link>
              )}
              {error && (
                <p className="error-text" role="alert">
                  {error}
                </p>
              )}
              <button className="btn">
                {mode === "login"
                  ? "Enter demo workspace"
                  : mode === "register"
                    ? "Create demo account"
                    : mode === "forgot-password"
                      ? "Simulate reset email"
                      : mode === "reset-password"
                        ? "Save demo password"
                        : "Verify demo code"}{" "}
                <ArrowUpRight size={16} />
              </button>
              {mode === "login" && (
                <p className="small">
                  New here? <Link href="/register/">Create an account</Link>
                </p>
              )}
              {mode === "register" && (
                <p className="small">
                  Already have an account? <Link href="/login/">Log in</Link>
                </p>
              )}
            </form>
          )}
          {mode === "login" && (
            <>
              <div className="auth-divider">OR EXPLORE A DEMO</div>
              <div className="demo-roles">
                {(["family", "donor", "mc", "admin"] as Role[]).map((r) => (
                  <button key={r} onClick={() => login(r)}>
                    {r === "family"
                      ? "Family organiser"
                      : r === "donor"
                        ? "Contributor"
                        : r === "mc"
                          ? "Funeral MC"
                          : "Superadmin"}{" "}
                    ↗
                  </button>
                ))}
              </div>
              <p className="small">
                <Link href="/two-factor/">Two-factor demo</Link> ·{" "}
                <Link href="/verify-email/">Email verification demo</Link>
              </p>
            </>
          )}
          <div className="demo-notice">
            <Info />
            Frontend demonstration. Accounts and verification are simulated.
            Please use fictional information.
          </div>
        </div>
      </section>
    </main>
  );
}
