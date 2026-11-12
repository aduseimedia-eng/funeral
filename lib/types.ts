export type Role = "family" | "donor" | "mc" | "admin";
export type Acknowledgement = "full" | "name" | "anonymous";
export type CampaignStatus =
  "Active" | "Pending" | "Completed" | "Suspended" | "Rejected";
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
export interface Campaign {
  id: string;
  name: string;
  years: string;
  location: string;
  venue: string;
  date: string;
  time?: string;
  image: string;
  target: number;
  status: CampaignStatus;
  organiser: string;
  obituary: string;
  description: string;
}
export interface Contribution {
  id: string;
  campaignId: string;
  userId: string | null;
  name: string;
  amount: number;
  method: string;
  date: string;
  status: "Verified" | "Pending" | "Failed";
  acknowledgement: Acknowledgement;
  announced: boolean;
}
export interface Condolence {
  id: string;
  campaignId: string;
  name: string;
  message: string;
  date: string;
}
export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: string;
}
export interface AuditEntry {
  id: string;
  action: string;
  date: string;
}
