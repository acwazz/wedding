import { expect, test, type Page } from "@playwright/test";

// wait for app mount: fills/clicks before Solid attaches listeners are lost
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
  await expect(page.getByText("entro il 15 febbraio 2027")).toBeVisible();
});

test("anchor navigation scrolls to sections", async ({ page }) => {
  await open(page);
  const nav = page.getByRole("navigation", {
    name: "Navigazione principale",
  });
  await nav.getByRole("link", { name: "Programma" }).click();
  await expect(page.locator("#programma")).toBeInViewport();
  // native anchors: the 2nd click is asserted via hash (stable regardless of scroll)
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

test("mobile viewports have no horizontal overflow", async ({ page }) => {
  for (const size of [
    { width: 320, height: 568 },
    { width: 360, height: 740 },
    { width: 375, height: 812 },
  ]) {
    await page.setViewportSize(size);
    await open(page);
    const overflowPx = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflowPx).toBeLessThanOrEqual(0);
  }
});

test("program tape fits within the timeline on small viewports", async ({
  page,
}) => {
  for (const size of [
    { width: 320, height: 568 },
    { width: 360, height: 740 },
  ]) {
    await page.setViewportSize(size);
    await open(page);
    const fits = await page.evaluate(() => {
      const tape = document.querySelector(
        '#programma div[aria-hidden="true"] > span',
      );
      if (!(tape instanceof HTMLElement)) return false;
      const parent = tape.offsetParent;
      if (!(parent instanceof HTMLElement)) return false;
      const t = tape.getBoundingClientRect();
      const p = parent.getBoundingClientRect();
      return t.left >= p.left && t.right <= p.right;
    });
    expect(fits).toBe(true);
  }
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
  await expect(guests).toHaveText("0");
  await page.getByRole("button", { name: "Aumenta" }).click();
  await page.getByRole("button", { name: "Aumenta" }).click();
  await expect(guests).toHaveText("2");
  await page.getByRole("button", { name: "Invia conferma" }).click();
  await expect(
    page.getByRole("heading", { name: "Grazie per la tua risposta!" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Compila un altro invito" }).click();
  await expect(page.locator("#firstName")).toHaveValue("");
});

test("RSVP guest counter steps between 0 and 15", async ({ page }) => {
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
  const minus = page.getByRole("button", { name: "Diminuisci" });
  const plus = page.getByRole("button", { name: "Aumenta" });

  await expect(guests).toHaveText("0");
  await expect(minus).toBeDisabled();

  await plus.click();
  await expect(guests).toHaveText("1");
  await minus.click();
  await expect(guests).toHaveText("0");
  await expect(minus).toBeDisabled();

  for (let i = 0; i < 15; i++) await plus.click();
  await expect(guests).toHaveText("15");
  await expect(plus).toBeDisabled();

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

test("/invito redirects to the main site", async ({ page }) => {
  await page.goto("/invito");
  await expect(page).toHaveURL("http://localhost:5173/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Licia ed Emanuele",
  );
});

test("info utili cards each have an icon", async ({ page }) => {
  await open(page);
  await expect(page.locator("#info-utili .card-icon svg")).toHaveCount(4);
});

test("info utili icons sit left of the card titles", async ({ page }) => {
  await open(page);
  const iconsLeftOfTitles = await page.evaluate(() => {
    const icons = document.querySelectorAll("#info-utili .card-icon");
    return Array.from(icons).every((icon) => {
      const title = icon.parentElement?.querySelector("h3");
      if (!title) return false;
      const i = icon.getBoundingClientRect();
      const t = title.getBoundingClientRect();
      return i.right <= t.left && i.top < t.bottom && i.bottom > t.top;
    });
  });
  expect(iconsLeftOfTitles).toBe(true);
});

test("declining disables guest counter", async ({ page }) => {
  await open(page);
  const guests = page.locator("#guests");
  const minus = page.getByRole("button", { name: "Diminuisci" });
  const plus = page.getByRole("button", { name: "Aumenta" });
  await expect(guests).toHaveText("0");
  await expect(minus).toBeDisabled();
  await expect(plus).toBeDisabled();
  await page.locator('input[name="attending"][value="no"]').check();
  await expect(minus).toBeDisabled();
  await expect(plus).toBeDisabled();
  await expect(guests).toHaveText("0");
});
