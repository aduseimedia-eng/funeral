import {
  Campaign,
  Contribution,
  Condolence,
  User,
  FamilyMember,
} from "@/lib/types";
export const users: User[] = [
  { id: "u1", name: "Akua Mensah", email: "akua@example.com", role: "family" },
  { id: "u2", name: "Kwame Asante", email: "kwame@example.com", role: "donor" },
  { id: "u3", name: "Kofi Owusu", email: "kofi@example.com", role: "mc" },
  { id: "u4", name: "Abena Osei", email: "abena@example.com", role: "admin" },
];
export const campaigns: Campaign[] = [
  {
    id: "kwasi-mensah",
    name: "Nana Kwasi Mensah",
    years: "1948 — 2026",
    location: "Kumasi",
    venue: "Prempeh Assembly Hall, Kumasi",
    date: "2026-12-12",
    image: "/images/kwasi-portrait.png",
    target: 80000,
    status: "Active",
    organiser: "The Mensah family",
    obituary:
      "A devoted father, beloved grandfather, and a pillar of his community. Nana Kwasi lived a life of generosity, wisdom, and quiet strength. A teacher for over forty years, he believed that every child deserved a chance to learn. His warmth lives on in the many lives he touched.",
    description:
      "Join us as we celebrate a life beautifully lived. Your contribution supports the funeral arrangements and helps us give our beloved father a dignified farewell. Medaase for standing with our family.",
  },
  {
    id: "grace-boateng",
    name: "Mrs. Grace Boateng",
    years: "1955 — 2026",
    location: "Accra",
    venue: "Calvary Methodist Church, Adabraka",
    date: "2026-12-19",
    image: "/images/grace-portrait.png",
    target: 50000,
    status: "Active",
    organiser: "The Boateng family",
    obituary:
      "A loving mother, a woman of faith, and a friend to everyone she met. Grace brought people together with her kindness, laughter, and boundless love for her family.",
    description:
      "Help the Boateng family celebrate the beautiful life and enduring legacy of our beloved mother.",
  },
  {
    id: "joseph-osei",
    name: "Dr. Joseph Osei",
    years: "1951 — 2026",
    location: "Cape Coast",
    venue: "Wesley Methodist Cathedral, Cape Coast",
    date: "2026-12-05",
    image: "/images/joseph-portrait.png",
    target: 60000,
    status: "Active",
    organiser: "The Osei family",
    obituary:
      "A dedicated physician and cherished husband whose life was defined by service. Joseph gave his time freely and left every community better than he found it.",
    description:
      "We invite friends, colleagues, and loved ones to come together in remembrance and support.",
  },
  {
    id: "ama-adjei",
    name: "Madam Ama Adjei",
    years: "1942 — 2026",
    location: "Takoradi",
    venue: "Star of the Sea Cathedral, Takoradi",
    date: "2026-11-28",
    image: "/images/grace-portrait.png",
    target: 40000,
    status: "Pending",
    organiser: "The Adjei family",
    obituary:
      "Our cherished matriarch, remembered for her gentle spirit and the home she made for so many.",
    description:
      "A celebration of a life rooted in family, faith, and community.",
  },
];
const donors = [
  "Kwame Asante",
  "Ama Boateng",
  "John Mensah",
  "Akosua Owusu",
  "Kwaku Appiah",
  "Abena Osei",
  "Yaw Agyeman",
  "Esi Nyarko",
  "Kojo Antwi",
  "Adwoa Sarpong",
  "Nana Yeboah",
  "Efua Addison",
  "Kwesi Baah",
  "Afia Aidoo",
  "Kofi Darko",
  "Mary Ofori",
  "Samuel Annan",
  "Akua Addo",
];
const amounts = [
  500, 200, 1000, 2500, 150, 5000, 300, 750, 1200, 400, 2000, 500, 10000, 1500,
  800, 600, 3500, 800,
];
export const contributions: Contribution[] = donors.map((name, i) => ({
  id: `NSA-2026-${String(i + 1).padStart(4, "0")}`,
  campaignId: campaigns[i < 12 ? 0 : i < 15 ? 1 : 2].id,
  userId: i % 5 === 0 ? "u2" : null,
  name,
  amount: amounts[i],
  method:
    i % 4 === 0 ? "Cash" : i % 3 === 0 ? "Telecel Cash" : "MTN Mobile Money",
  date: `2026-11-${String(4 + Math.floor(i / 3)).padStart(2, "0")}T${String(9 + (i % 9)).padStart(2, "0")}:30:00`,
  status: i === 17 ? "Pending" : "Verified",
  acknowledgement: i % 5 === 2 ? "anonymous" : i % 4 === 1 ? "name" : "full",
  announced: i > 8,
}));
export const condolences: Condolence[] = [
  {
    id: "c1",
    campaignId: "kwasi-mensah",
    name: "Akosua & the Owusu family",
    message:
      "Nana was a light in our community. His wisdom and kindness will stay with us always. May his gentle soul rest in perfect peace.",
    date: "2026-11-08",
  },
  {
    id: "c2",
    campaignId: "kwasi-mensah",
    name: "Kwame Asante",
    message:
      "Thank you for everything you taught us, Sir. Your legacy lives on in every student whose life you changed. Damirifa due.",
    date: "2026-11-09",
  },
];
export const familyMembers: FamilyMember[] = [
  { id: "f1", name: "Akua Mensah", email: "akua@example.com", role: "Owner" },
  {
    id: "f2",
    name: "Yaw Mensah",
    email: "yaw@example.com",
    role: "Administrator",
  },
];
export const mcAssignments = [{ userId: "u3", campaignId: "kwasi-mensah" }];
export const qrStatistics = [
  { day: "Mon", scans: 24 },
  { day: "Tue", scans: 38 },
  { day: "Wed", scans: 32 },
  { day: "Thu", scans: 56 },
  { day: "Fri", scans: 41 },
  { day: "Sat", scans: 89 },
  { day: "Sun", scans: 62 },
];
export const paymentTransactions = contributions.map((c) => ({
  reference: c.id,
  contributionId: c.id,
  status: c.status,
  provider: c.method,
}));
export const auditLog = [
  { id: "a1", action: "Demo workspace created", date: "2026-11-11T09:00:00" },
];
export const acknowledgementLabels = {
  full: "Full acknowledgement",
  name: "Name only",
  anonymous: "Anonymous",
};
