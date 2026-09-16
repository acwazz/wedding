import { expect, test, type Page } from "@playwright/test";

// wait for hydration: fills/clicks before React attaches listeners are lost
async function open(page: Page) {
  await page.goto("/");
  await page.waitForFunction(() => {
    const w = window as unknown as Record<string, unknown>;
    return w["__appReady"] === true;
  });
}

test("RSVP form is disabled when built with VITE_RSVP_ENABLED=false", async ({
  page,
}) => {
  await open(page);
  await expect(page.getByRole("status")).toContainText(
    "A breve potrai confermare la tua presenza. Torna a trovarci presto!",
  );
  await expect(page.locator("#firstName")).toBeDisabled();
  await expect(page.locator("#lastName")).toBeDisabled();
  await expect(page.locator("#notes")).toBeDisabled();
  await expect(
    page.locator('input[name="attending"][value="yes"]'),
  ).toBeDisabled();
  await expect(
    page.locator('input[name="attending"][value="no"]'),
  ).toBeDisabled();
  await expect(page.locator("#guests")).toHaveText("0");
  await expect(page.getByRole("button", { name: "Diminuisci" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Aumenta" })).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Invia conferma" }),
  ).toBeDisabled();
  await expect(page.getByRole("alert")).toHaveCount(0);
});
