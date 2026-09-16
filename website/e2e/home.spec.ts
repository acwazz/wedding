import { expect, test, type Page } from "@playwright/test";

// wait for hydration: fills/clicks before React attaches listeners are lost
async function open(page: Page) {
  await page.goto("/");
  await page.waitForFunction(() => {
    const w = window as unknown as Record<string, unknown>;
    return w["__appReady"] === true;
  });
}

test("homepage shows couple, date and venue", async ({ page }) => {
  await open(page);
  await expect(page).toHaveTitle("Il matrimonio di Licia ed Emanuele");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Licia ed Emanuele",
  );
  await expect(page.getByText("Sabato 10 aprile 2027")).toBeVisible();
  await expect(page.getByText("Villa Grant, Roma")).toBeVisible();
});

test("anchor navigation scrolls to sections", async ({ page }) => {
  await open(page);
  const nav = page.getByRole("navigation", {
    name: "Navigazione principale",
  });
  await nav.getByRole("link", { name: "Programma" }).click();
  await expect(page.locator("#programma")).toBeInViewport();
  // scrollRestoration races the native anchor jump on the 2nd click, so assert hash
  await nav.getByRole("link", { name: "RSVP" }).click();
  await expect(page).toHaveURL(/#rsvp$/);
});

test("program lists all five events", async ({ page }) => {
  await open(page);
  await expect(page.locator("#programma ul li")).toHaveCount(5);
  for (const title of [
    "Cerimonia",
    "Aperitivo",
    "Ricevimento",
    "Taglio della torta",
    "Festa e balli",
  ]) {
    await expect(
      page.locator("#programma").getByRole("heading", { name: title }),
    ).toBeVisible();
  }
});

test("mobile menu opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await open(page);
  const menuButton = page.getByRole("button", { name: "menu" });
  await menuButton.click();
  const mobileNav = page.locator("#mobile-nav");
  await expect(mobileNav.getByRole("link", { name: "RSVP" })).toBeVisible();
  await menuButton.click();
  // closed state is max-h-0 + opacity-0, not display:none — assert via class
  await expect(mobileNav).toHaveClass(/max-h-0/);
});

test("RSVP validates required fields", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "Invia conferma" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Per favore, inserisci nome e cognome.",
  );

  await page.locator("#firstName").fill("Mario");
  await page.getByRole("button", { name: "Invia conferma" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Per favore, inserisci nome e cognome.",
  );

  await page.locator("#lastName").fill("Rossi");
  await page.getByRole("button", { name: "Invia conferma" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Per favore, conferma se parteciperai o meno.",
  );

  await page.locator('input[name="attending"][value="yes"]').check();
  await page.getByRole("button", { name: "Invia conferma" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Il numero totale deve essere tra 1 e 15.",
  );
});

test("RSVP success flow with guests and reset", async ({ page }) => {
  await page.route("**/rsvp", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    }),
  );
  await open(page);
  await page.locator("#firstName").fill("Mario");
  await page.locator("#lastName").fill("Rossi");
  await page.locator('input[name="attending"][value="yes"]').check();
  const guests = page.locator("#guests");
  await expect(guests).toBeEnabled();
  await guests.fill("2");
  await page.getByRole("button", { name: "Invia conferma" }).click();
  await expect(
    page.getByRole("heading", { name: "Grazie per la tua risposta!" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Compila un altro invito" }).click();
  await expect(page.locator("#firstName")).toHaveValue("");
});

test("RSVP guest count must be between 1 and 15", async ({ page }) => {
  await page.route("**/rsvp", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    }),
  );
  await open(page);
  await page.locator("#firstName").fill("Mario");
  await page.locator("#lastName").fill("Rossi");
  await page.locator('input[name="attending"][value="yes"]').check();
  const guests = page.locator("#guests");
  await expect(guests).toBeEnabled();

  await guests.fill("0");
  await expect(guests).toHaveValue("0");
  await guests.fill("");
  await expect(guests).toHaveValue("0");

  await guests.fill("16");
  await page.getByRole("button", { name: "Invia conferma" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Il numero totale deve essere tra 1 e 15.",
  );

  await guests.fill("15");
  await page.getByRole("button", { name: "Invia conferma" }).click();
  await expect(
    page.getByRole("heading", { name: "Grazie per la tua risposta!" }),
  ).toBeVisible();
});

test("RSVP backend failure shows error", async ({ page }) => {
  await page.route("**/rsvp", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: '{"error":"x"}',
    }),
  );
  await open(page);
  await page.locator("#firstName").fill("Mario");
  await page.locator("#lastName").fill("Rossi");
  await page.locator('input[name="attending"][value="no"]').check();
  await page.getByRole("button", { name: "Invia conferma" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Impossibile inviare la conferma. Riprova più tardi.",
  );
});

test("declining disables guest count", async ({ page }) => {
  await open(page);
  const guests = page.locator("#guests");
  await expect(guests).toBeDisabled();
  await page.locator('input[name="attending"][value="no"]').check();
  await expect(guests).toBeDisabled();
  await expect(guests).toHaveValue("0");
});
