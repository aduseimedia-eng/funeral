import { test, expect } from "@playwright/test";

test("create, review, approve, find and remember a memorial", async ({
  page,
}) => {
  await page.goto("/dashboard/family/campaigns/?create=1");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog
    .getByLabel("Memorial photograph", { exact: true })
    .setInputFiles("public/images/kwasi-portrait.png");
  await expect(
    dialog.getByAltText("Memorial photograph preview"),
  ).toHaveAttribute("src", /^data:image\/jpeg/);
  await dialog
    .getByLabel("Full name", { exact: true })
    .fill("Akosua Frontend Demo");
  await dialog.getByLabel("Years of life").fill("1948 — 2026");
  await dialog.getByLabel("Family / organiser").fill("The Demo family");
  await dialog.getByLabel("Funeral date").fill("2026-12-12");
  await dialog.getByLabel("Service time (Ghana)").fill("10:30");
  await dialog.getByLabel("City / town").fill("Kumasi");
  await dialog.getByLabel("Venue and address").fill("Demo community hall");
  await dialog.getByRole("button", { name: "Continue", exact: true }).click();
  await dialog
    .getByLabel("Their story / obituary")
    .fill(
      "A generous teacher remembered for her warmth.\nHer community carries her memory forward.",
    );
  await dialog
    .getByLabel("A message from the family")
    .fill("Thank you for standing with our family.");
  await dialog.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(dialog.getByText("Demo community hall, Kumasi")).toBeVisible();
  await dialog.getByRole("button", { name: "Submit for demo review" }).click();
  await expect(
    dialog.getByText("Your memorial is ready for review."),
  ).toBeVisible();
  const preview = await dialog
    .getByRole("link", { name: "Preview memorial" })
    .getAttribute("href");
  await dialog.getByRole("link", { name: "Try demo approval" }).click();
  await page
    .getByRole("row")
    .filter({ hasText: "Akosua Frontend Demo" })
    .getByRole("button", { name: "Approve", exact: true })
    .click();
  await page
    .getByLabel("Moderation note")
    .fill("Reviewed this fictional memorial for the demo.");
  await page.getByRole("button", { name: "Confirm demo action" }).click();
  await expect(
    page.getByText("Akosua Frontend Demo is now on Explore."),
  ).toBeVisible();
  await page.getByRole("link", { name: "View Explore" }).click();
  await page
    .getByRole("textbox", { name: "Search memorials" })
    .fill("Akosua Frontend Demo");
  await page
    .getByRole("link", { name: /Akosua Frontend Demo.*View memorial/ })
    .click();
  await expect(
    page.getByText("Funeral service · 10:30 GMT (Ghana)"),
  ).toBeVisible();
  await expect(page.getByText("Leave the first memory.")).toBeVisible();
  await page.getByLabel("Your name", { exact: true }).fill("Demo friend");
  await page
    .getByLabel("Your message", { exact: true })
    .fill("Your kindness will always be remembered.");
  await page.getByRole("button", { name: "Add your message" }).click();
  await expect(
    page.getByText(
      "Your message has been added to the condolence book in this browser.",
    ),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Your kindness will always be remembered."),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Akosua Frontend Demo" }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/memorial-desktop.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "Contribute in their memory" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Full name", { exact: true }).fill("Demo supporter");
  await page.getByLabel("Email address (demo)").fill("supporter@example.com");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: /Continue|Review/ }).click();
  await page.getByRole("button", { name: /Simulate/ }).click();
  await expect(page.getByText(/Thank you/).first()).toBeVisible();
  await page.goto(preview!);
  await expect(page.getByText("1 verified contributions")).toBeVisible();
});

test("mobile pages fit and navigation can be closed with Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/campaigns/",
    "/memorial/?id=kwasi-mensah",
    "/dashboard/family/",
    "/dashboard/admin/campaigns/",
    "/checkout/?id=kwasi-mensah",
    "/about/",
    "/login/",
    "/register/",
    "/dashboard/donor/",
    "/dashboard/mc/",
    "/dashboard/family/reports/",
    "/dashboard/family/qr/",
    "/dashboard/family/settings/",
  ]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await page.waitForTimeout(250);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      route,
    ).toBe(true);
    await page.screenshot({
      path: `test-results/mobile-${route.split("?")[0].replaceAll("/", "-") || "home"}.png`,
      fullPage: true,
    });
  }
  await page.goto("/dashboard/family/");
  await page.getByRole("button", { name: "Toggle dashboard menu" }).click();
  await expect(
    page.getByRole("dialog", { name: "Workspace navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Toggle dashboard menu" }),
  ).toBeFocused();
  await page.goto("/campaigns/");
  const menu = page.getByRole("button", { name: "Open menu", exact: true });
  await expect(menu).toBeInViewport();
  await menu.click();
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Home", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await page.goto("/dashboard/family/campaigns/?create=1");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Full name", { exact: true }).fill("Mobile demo");
  await expect(page.getByLabel("Full name", { exact: true })).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/mobile-editor.png",
    fullPage: true,
  });
});

test("empty search can be reset and withdrawal previews survive reload", async ({
  page,
}) => {
  await page.goto("/campaigns/");
  await page
    .getByRole("textbox", { name: "Search memorials" })
    .fill("no-matching-memorial");
  await expect(
    page.getByRole("heading", { name: "No memorials found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).first().click();
  await expect(
    page.getByRole("heading", { name: "Nana Kwasi Mensah" }),
  ).toBeVisible();
  await page.goto("/dashboard/family/withdrawals/");
  await page.getByRole("button", { name: "Create demo request" }).click();
  await page.getByLabel("Illustrative amount (GHS)").fill("100");
  await page
    .getByLabel("Purpose", { exact: true })
    .fill("Demo venue arrangements");
  await page.getByRole("button", { name: "Save demo request" }).click();
  await page.reload();
  await expect(
    page.getByRole("cell", { name: "Demo venue arrangements" }),
  ).toBeVisible();
});
