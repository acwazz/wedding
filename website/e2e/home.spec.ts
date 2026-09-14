import { expect, test } from "@playwright/test";

test("homepage shows couple, date and venue", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Il matrimonio di Licia ed Emanuele");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Licia ed Emanuele",
  );
  await expect(page.getByText("Sabato 10 aprile 2027")).toBeVisible();
  await expect(page.getByText("Villa Grant, Roma")).toBeVisible();
});

test("anchor navigation scrolls to sections", async ({ page }) => {
  await page.goto("/");
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
  await page.goto("/");
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
  await page.goto("/");
  const menuButton = page.getByRole("button", { name: "menu" });
  await menuButton.click();
  const mobileNav = page.locator("#mobile-nav");
  await expect(mobileNav.getByRole("link", { name: "RSVP" })).toBeVisible();
  await menuButton.click();
  // closed state is max-h-0 + opacity-0, not display:none — assert via class
  await expect(mobileNav).toHaveClass(/max-h-0/);
});

test("RSVP validates required fields", async ({ page }) => {
  await page.goto("/");
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
    "Il numero totale deve essere almeno 1.",
  );
});

test("RSVP success flow with guests and reset", async ({ page }) => {
  await page.goto("/");
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

test("declining disables guest count", async ({ page }) => {
  await page.goto("/");
  const guests = page.locator("#guests");
  await expect(guests).toBeDisabled();
  await page.locator('input[name="attending"][value="no"]').check();
  await expect(guests).toBeDisabled();
  await expect(guests).toHaveValue("0");
});
