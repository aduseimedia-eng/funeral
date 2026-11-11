"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as seed from "@/lib/mock-data";
import {
  Campaign,
  Contribution,
  Condolence,
  User,
  FamilyMember,
  AuditEntry,
} from "@/lib/types";
type State = {
  campaigns: Campaign[];
  contributions: Contribution[];
  condolences: Condolence[];
  user: User | null;
  demoUsers: User[];
  mcAssignments: { userId: string; campaignId: string }[];
  suspendedUsers: string[];
  activeCampaignId: string;
  members: FamilyMember[];
  audit: AuditEntry[];
  qrDisabled: string[];
  preferences: { acknowledgement: string; notifications: boolean };
};
const initial: State = {
  campaigns: seed.campaigns,
  contributions: seed.contributions,
  condolences: seed.condolences,
  user: null,
  demoUsers: seed.users,
  mcAssignments: seed.mcAssignments,
  suspendedUsers: [],
  activeCampaignId: "kwasi-mensah",
  members: seed.familyMembers,
  audit: seed.auditLog,
  qrDisabled: [],
  preferences: { acknowledgement: "full", notifications: true },
};
const Context = createContext<{
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
  toast: (s: string) => void;
  ready: boolean;
}>(null!);
export function Providers({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initial);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    try {
      const s = localStorage.getItem("nsaa-demo-v1");
      if (s) setState({ ...initial, ...JSON.parse(s) });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("nsaa-demo-v1", JSON.stringify(state));
      } catch {
        setNotice(
          "Browser storage is full. Your current changes will last until this page closes.",
        );
      }
    }
  }, [state, ready]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(t);
  }, [notice]);
  return (
    <Context.Provider value={{ state, setState, toast: setNotice, ready }}>
      {children}
      {notice && (
        <div className="toast" role="status">
          <span className="toast-dot" />
          {notice}
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
export const useDemo = () => useContext(Context);
