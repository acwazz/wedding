import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import Heart from "lucide-solid/icons/heart";

import Counter from "@/components/Counter";

const RSVP_ENDPOINT =
  import.meta.env["VITE_RSVP_ENDPOINT"] || "http://localhost:8787/rsvp";

const RSVP_ENABLED = import.meta.env["VITE_RSVP_ENABLED"] !== "false";

type Attending = "yes" | "no" | "";

function Rsvp() {
  const [form, setForm] = createStore({
    firstName: "",
    lastName: "",
    attending: "" as Attending,
    guests: 0,
    notes: "",
  });
  const [status, setStatus] = createSignal<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = createSignal("");

  const isAttending = () => form.attending === "yes";

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setStatus("error");
      setErrorMsg("Per favore, inserisci nome e cognome.");
      return;
    }
    if (!form.attending) {
      setStatus("error");
      setErrorMsg("Per favore, conferma se parteciperai o meno.");
      return;
    }
    if (isAttending() && (form.guests < 1 || form.guests > 15)) {
      setStatus("error");
      setErrorMsg("Il numero totale deve essere tra 1 e 15.");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch(RSVP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          attending: form.attending,
          guests: form.guests,
          notes: form.notes,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Impossibile inviare la conferma. Riprova più tardi.");
    }
  }

  function handleReset() {
    setForm({
      firstName: "",
      lastName: "",
      attending: "",
      guests: 0,
      notes: "",
    });
    setStatus("idle");
    setErrorMsg("");
  }

  return (
    <section id="rsvp" class="scroll-mt-24 bg-secondary/40 py-24 md:py-32">
      <div class="mx-auto max-w-2xl px-6">
        <div class="mb-12 text-center">
          <p class="font-sans text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Conferma presenza
          </p>
          <h2 class="mt-3 font-serif text-4xl font-medium md:text-5xl">RSVP</h2>
          <p class="mx-auto mt-4 max-w-lg font-sans font-light leading-relaxed text-muted-foreground">
            Ti aspettiamo! Per aiutarci nell&apos;organizzazione, conferma la
            tua partecipazione entro il 15 febbraio 2027.
          </p>
        </div>

        {status() === "success" ? (
          <div class="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Heart class="h-8 w-8 text-primary" />
            </div>
            <h3 class="mt-6 font-serif text-2xl font-medium text-foreground">
              Grazie per la tua risposta!
            </h3>
            <p class="mt-3 font-sans font-light text-muted-foreground">
              Abbiamo ricevuto la tua conferma. Non vediamo l&apos;ora di
              festeggiare insieme.
            </p>
            <button
              onclick={handleReset}
              class="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Compila un altro invito
            </button>
          </div>
        ) : (
          <form
            onsubmit={handleSubmit}
            class="rounded-2xl border border-border bg-card p-8 shadow-sm md:p-12"
            noValidate
          >
            {status() === "error" && (
              <div
                class="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 font-sans text-sm text-destructive"
                role="alert"
              >
                {errorMsg()}
              </div>
            )}

            {!RSVP_ENABLED && (
              <div
                role="status"
                class="mb-6 rounded-lg border border-primary/30 bg-primary/10 p-4 font-sans text-sm text-primary"
              >
                A breve potrai confermare la tua presenza. Torna a trovarci
                presto!
              </div>
            )}

            <fieldset disabled={!RSVP_ENABLED}>
              <div class="grid gap-6 md:grid-cols-2">
                <div class="space-y-2">
                  <label
                    for="firstName"
                    class="block font-sans text-sm font-medium text-foreground"
                  >
                    Nome
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={form.firstName}
                    onInput={(e) => setForm("firstName", e.currentTarget.value)}
                    class="w-full rounded-xl border border-input bg-background px-4 py-3 font-sans text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-ring"
                    placeholder="Il tuo nome"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <label
                    for="lastName"
                    class="block font-sans text-sm font-medium text-foreground"
                  >
                    Cognome
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={form.lastName}
                    onInput={(e) => setForm("lastName", e.currentTarget.value)}
                    class="w-full rounded-xl border border-input bg-background px-4 py-3 font-sans text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-ring"
                    placeholder="Il tuo cognome"
                    required
                  />
                </div>
              </div>

              <fieldset class="mt-8 space-y-3">
                <legend class="block font-sans text-sm font-medium text-foreground">
                  Parteciperai alla celebrazione?
                </legend>
                <div class="flex flex-wrap gap-4">
                  <label class="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-input bg-background px-5 py-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={form.attending === "yes"}
                      onChange={(e) =>
                        setForm("attending", e.currentTarget.value as Attending)
                      }
                      class="h-4 w-4 accent-primary"
                    />
                    <span class="font-sans text-sm text-foreground">
                      Sarò presente
                    </span>
                  </label>
                  <label class="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-input bg-background px-5 py-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={form.attending === "no"}
                      onChange={(e) => {
                        setForm(
                          "attending",
                          e.currentTarget.value as Attending,
                        );
                        setForm("guests", 0);
                      }}
                      class="h-4 w-4 accent-primary"
                    />
                    <span class="font-sans text-sm text-foreground">
                      Non potrò esserci
                    </span>
                  </label>
                </div>
              </fieldset>

              <div class="mt-8 space-y-2">
                <span
                  id="guests-label"
                  class="block font-sans text-sm font-medium text-foreground"
                >
                  Saremo in
                </span>
                <Counter
                  id="guests"
                  labelId="guests-label"
                  value={form.guests}
                  min={0}
                  max={15}
                  disabled={!isAttending()}
                  onValueChange={(guests) => setForm("guests", guests)}
                />
                <p class="font-sans text-xs text-muted-foreground">
                  Numero totale di persone, te compreso: da 1 a 15. Inserisci 1
                  se verrai da solo/a.
                </p>
              </div>

              <div class="mt-8 space-y-2">
                <label
                  for="notes"
                  class="block font-sans text-sm font-medium text-foreground"
                >
                  Intolleranze, allergie o altre esigenze
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={form.notes}
                  onInput={(e) => setForm("notes", e.currentTarget.value)}
                  class="w-full rounded-xl border border-input bg-background px-4 py-3 font-sans text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-ring"
                  placeholder="Facoltativo, es: Hannibal - intollerante alla carne di maiale"
                />
              </div>

              <button
                type="submit"
                disabled={status() === "submitting"}
                class="mt-10 w-full rounded-full bg-primary px-8 py-4 font-sans text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status() === "submitting"
                  ? "Invio in corso…"
                  : "Invia conferma"}
              </button>
            </fieldset>
          </form>
        )}
      </div>
    </section>
  );
}

export default Rsvp;
