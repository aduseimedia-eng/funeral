# Verification

## Automated checks

The production static export and TypeScript checks have been run during implementation. The focused test suite covers anonymous and name-only MC privacy, exclusion of pending/failed payments from fundraising totals, campaign-scoped totals, and CSV formula protection. The final packaging workflow reruns the checks and production build against the source being published.

## Browser checks

Reviewed in Microsoft Edge using the native computer-use interface:

- Desktop public homepage: navigation, editorial hero, local floral asset, and page content render.
- Desktop family overview: seeded totals, contribution chart, campaign summary, and register render.
- Verified cash journey: entered a fictional GH₵250 cash contribution. Total verified contributions changed from GH₵14,500 to GH₵14,750 and cash changed from GH₵1,850 to GH₵2,100. The new row appeared as verified cash.
- Checkout journey: entered a fictional contributor, selected Anonymous, reviewed the preference, simulated MTN Mobile Money success, and reached the clearly labelled demonstration result. No external payment provider was contacted.
- Demo receipt PDF download: generated a 4,717-byte file in the browser’s Downloads folder.
- QR poster PDF download: generated a 4,245,330-byte A4 poster file in the browser’s Downloads folder.
- Responsive QR management: reviewed a single-column layout and compact header at 400 CSS pixels.
- Responsive homepage: reviewed at 400 and 320 CSS pixels, then adjusted heading scaling, navigation spacing, and multiline dashboard heading leading. The 320-pixel homepage fits the viewport.

Downloads above were QA outputs and are not part of the site’s seeded data. Browser-local records made during QA stay only in that local browser; they are not bundled into the deployment.

## Verification boundaries

The browser walkthrough samples the main public, family, checkout, and QR flows. Every page is included in the production build, but not every form permutation or physical device was manually exercised. The failure simulation, campaign moderation, MC queues, report filtering, role-specific history, and other local interactions are implemented and typechecked; MC privacy and totals also have focused automated coverage. There are no live accounts, payment gateways, emails, financial operations, or backend integration to test.
