# Nsaabɔdeɛ

A frontend-only Ghanaian funeral contribution and digital memorial prototype, built with Next.js App Router, TypeScript, Tailwind CSS, Lucide, Recharts, qrcode, and jsPDF.

## Run locally

```powershell
cd C:\Users\aduse\Desktop\Codes\Nsaa\nsaa-web
npm install
npm run dev
```

Open http://localhost:3000. The project exports a static website with `npm run build`; output is in `out/`. There are no API routes, databases, payment integrations, or backend processes.

## Demo workspaces

On `/login/`, choose Family organiser, Contributor, Funeral MC, or Superadmin. You can also use the seeded email addresses below with any password of six or more characters. These are **simulated accounts**, not authentication.

| Role | Email | Route |
|---|---|---|
| Family organiser | akua@example.com | `/dashboard/family/` |
| Contributor | kwame@example.com | `/dashboard/donor/` |
| Funeral MC | kofi@example.com | `/dashboard/mc/` |
| Superadmin | abena@example.com | `/dashboard/admin/` |

Other account screens: `/register/`, `/forgot-password/`, `/reset-password/`, `/verify-email/`, `/two-factor/`. Verification uses the demo code `123456`. Registration creates a browser-local account; passwords are never stored. No emails are sent.

## Main journeys

- Browse `/campaigns/`, search/filter memorials, open a memorial, and add a condolence.
- Use checkout to choose a preset/custom GHS amount, fictional donor details, acknowledgement preference, payment method, and success/failure simulation. A verified demo record updates the corresponding totals. Failed attempts remain separate and never increase verified totals.
- Sign in as a contributor before checkout to link the new local contribution to that contributor’s own history. Guest records remain unlinked.
- Create/edit a memorial in three steps: details and portrait, story, then review. Choose the service time in Ghana, preview the full memorial, and follow the confirmation link to demo approval. Approved memorials appear on Explore in this browser and accept simulated contributions.
- Record verified cash contributions, search/filter/sort/page the register, and export CSV reports.
- Generate campaign URL QR codes, copy links, open a WhatsApp sharing draft, and download standalone QR PNGs or A4 poster PNG/PDF files. All exports happen in the browser.
- Use MC management to assign/pause Kofi Owusu, then switch to MC mode to mark contributions announced or return them to pending. Anonymous names and private amounts are removed by `mcView` before the announcement cards receive them.
- Review campaign moderation, mock users, contribution monitoring, reports, and the local audit log in the admin workspace.

## Data and architecture

- `app/`: public/account pages and statically generated dashboard routes.
- `components/common/`: shared UI, navigation, cards, fields, modals, and status indicators.
- `components/dashboard/`: dashboard shell and reusable dashboard features.
- `components/providers.tsx`: shared frontend state, localStorage persistence, and toast notifications.
- `lib/types.ts`: typed domain models for a future REST adapter.
- `lib/mock-data/`: users, campaigns, contributions, transactions, condolences, assignments, QR statistics, and audit seed data.
- `lib/utils.ts`: currency/date formatting, verified totals, privacy projection, and safe CSV formatting.
- `lib/downloads.ts`: clearly labelled demonstration PDF receipts.
- `tests/`: focused tests of privacy projection, verified totals, and CSV formula protection.

Replace the provider’s local state operations with a future Django REST Framework adapter while retaining these domain types and UI components. No Django or server-side persistence is included here. Static pages and query-string memorial IDs let newly created campaigns work locally without server route generation.

## Important demonstration limits

All users, memorial stories, portraits, transactions, and analytics are illustrative. **No money is transferred.** Local role navigation is not an access-control boundary. Anyone with access to the browser can switch demo roles and inspect demo data. MC privacy is a UI/data-projection demonstration, not server-enforced security.

Changes are stored under `nsaa-demo-v1` in localStorage. They do not synchronise between people, browsers, or devices. If saving fails, a persistent notice explains that current edits may be lost after reloading. JPG, PNG and WebP uploads up to 8 MB are resized to a maximum 1,000-pixel edge before storage. Withdrawal previews are saved per memorial. Use Settings → Reset demonstration to restore the seed data.

QR pausing is local: links containing `via=qr` display a paused screen in the browser where the code was paused. Global revocation and real scan analytics require a future backend. QR statistics are clearly marked mock data. Withdrawal requests, user suspension, and email notifications are visual demonstrations and do not perform financial, security, or communication operations.

Report visualisations support 7/30-day ranges; report CSVs contain all available records. Charts use the latest demo record date or 11 November 2026 as a reference, so the seeded demonstration remains useful.

## Checks

```powershell
npm run typecheck
npm test
npm run build
```

With the local preview running, `npm run test:browser` runs isolated, headless Microsoft Edge tests for creation → approval → Explore → condolence → simulated contribution, mobile navigation/layouts, filter resets, and persisted withdrawal previews. Set `PREVIEW_URL` to test a different local port; the default is `http://localhost:3000`. These tests use fresh browser contexts and do not change your own demo data. Screenshots and failure traces go to the ignored `test-results/` directory.

See [asset provenance and generation prompts](docs/ASSETS.md) for the locally included artwork.
