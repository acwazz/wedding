import { Show, createSignal, onCleanup } from "solid-js";
import Copy from "lucide-solid/icons/copy";
import Check from "lucide-solid/icons/check";
import Shirt from "lucide-solid/icons/shirt";
import Gem from "lucide-solid/icons/gem";
import Landmark from "lucide-solid/icons/landmark";
import MapPin from "lucide-solid/icons/map-pin";

import InfoIcon from "@/components/InfoIcon";

const IBAN = "IT27X0306903222100000017877";

const VILLA_GRANT_LAT = 41.687463;
const VILLA_GRANT_LON = 12.448046;

function InfoUtili() {
  const [ibanCopied, setIbanCopied] = createSignal(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => clearTimeout(copyTimer));

  return (
    <section id="info-utili" class="scroll-mt-24 bg-background py-24 md:py-32">
      <div class="mx-auto max-w-4xl px-6">
        <div class="mb-16 text-center">
          <p class="font-sans text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Da sapere
          </p>
          <h2 class="mt-3 font-serif text-4xl font-medium md:text-5xl">
            Info utili
          </h2>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div class="flex items-center gap-4">
              <InfoIcon icon={Shirt} />
              <h3 class="font-serif text-2xl font-medium text-foreground">
                Dress code
              </h3>
            </div>
            <p class="mt-3 font-sans font-light leading-relaxed text-muted-foreground">
              Abbiamo deciso di non scegliere una palette precisa, vogliamo che
              vi sentiate belli ed eleganti. Ma abbiamo un paio di richieste:
              niente abiti bianchi e no magliette a maniche corte! Grazie, love
              u &lt;3
            </p>
          </div>
          <div class="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div class="flex items-center gap-4">
              <InfoIcon icon={Gem} />
              <h3 class="font-serif text-2xl font-medium text-foreground">
                No proposte di matrimonio
              </h3>
            </div>
            <p class="mt-3 font-sans font-light leading-relaxed text-muted-foreground">
              La giornata è dedicata a noi: lasciate a casa l&apos;anello e le
              ginocchia a terra.
            </p>
          </div>
          <div class="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div class="flex items-center gap-4">
              <InfoIcon icon={Landmark} />
              <h3 class="font-serif text-2xl font-medium text-foreground">
                IBAN
              </h3>
            </div>
            <div class="mt-3 flex items-center justify-between gap-4">
              <code class="break-all font-mono text-sm text-muted-foreground">
                {IBAN}
              </code>
              <button
                type="button"
                aria-label="Copia IBAN"
                onclick={async () => {
                  try {
                    await navigator.clipboard.writeText(IBAN);
                    setIbanCopied(true);
                    clearTimeout(copyTimer);
                    copyTimer = setTimeout(() => setIbanCopied(false), 2000);
                  } catch {
                    setIbanCopied(false);
                  }
                }}
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <Show when={ibanCopied()} fallback={<Copy size={16} />}>
                  <Check size={16} />
                </Show>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div class="flex items-center gap-4">
            <InfoIcon icon={MapPin} />
            <h3 class="font-serif text-2xl font-medium text-foreground">
              Come raggiungere Villa Grant
            </h3>
          </div>
          <p class="mt-3 font-sans font-light leading-relaxed text-muted-foreground">
            Villa Grant — Via di Pratica 281, Roma. Dal GRA prendi l&apos;uscita
            26 (SS148 Pontina) direzione Pomezia/Latina, poi l&apos;uscita
            Pratica di Mare.
          </p>
          <div class="mt-6 overflow-hidden rounded-xl border border-border">
            <iframe
              title="Mappa di Villa Grant su Google Maps"
              src={`https://maps.google.com/maps?q=${VILLA_GRANT_LAT},${VILLA_GRANT_LON}&z=16&output=embed`}
              class="h-72 w-full"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${VILLA_GRANT_LAT},${VILLA_GRANT_LON}`}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex items-center gap-2 font-sans text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Apri la mappa con le coordinate (Google Maps)
          </a>
        </div>
      </div>
    </section>
  );
}

export default InfoUtili;
