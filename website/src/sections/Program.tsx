import { For, createSignal, onCleanup, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";
import Church from "lucide-solid/icons/church";
import Wine from "lucide-solid/icons/wine";
import UtensilsCrossed from "lucide-solid/icons/utensils-crossed";
import CakeSlice from "lucide-solid/icons/cake-slice";
import Music from "lucide-solid/icons/music";

const schedule = [
  {
    time: "12:00",
    title: "Cerimonia",
    description:
      "Il momento più atteso: ci diremo sì a mezzogiorno in punto, circondati dalle persone che amiamo.",
    icon: Church,
  },
  {
    time: "13:00",
    title: "Aperitivo",
    description:
      "Brindisi e antipasti in giardino per festeggiare insieme sotto il sole del primo pomeriggio.",
    icon: Wine,
  },
  {
    time: "14:30",
    title: "Ricevimento",
    description:
      "Pranzo nella villa con piatti della tradizione romana e tanto buon vino.",
    icon: UtensilsCrossed,
  },
  {
    time: "16:30",
    title: "Taglio della torta",
    description:
      "Condivideremo il dolce inizio della nostra vita insieme. Non mancate agli applausi (e alla torta!).",
    icon: CakeSlice,
  },
  {
    time: "17:30",
    title: "Festa e balli",
    description:
      "Musica, balli e tanti brindisi per chiudere la giornata. Scarpette comode consigliate!",
    icon: Music,
  },
];

function Program() {
  let overlayRef: HTMLDivElement | undefined;
  const [slapped, setSlapped] = createSignal(false);

  onMount(() => {
    const el = overlayRef;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSlapped(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    onCleanup(() => observer.disconnect());
  });

  return (
    <section id="programma" class="scroll-mt-24 bg-background py-24 md:py-32">
      <div class="relative mx-auto max-w-4xl px-6">
        <div class="mb-16 text-center">
          <p class="font-sans text-sm font-medium uppercase tracking-[0.2em] text-accent">
            La giornata
          </p>
          <h2 class="mt-3 font-serif text-4xl font-medium md:text-5xl">
            Programma
          </h2>
        </div>

        <div class="relative">
          <div class="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />
          <ul class="space-y-10 md:space-y-14">
            <For each={schedule}>
              {(item, index) => (
                <li
                  class={`relative flex items-start gap-6 md:gap-0 ${
                    index() % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div
                    class={`hidden md:block md:w-1/2 ${
                      index() % 2 === 0
                        ? "md:pr-12 md:text-right"
                        : "md:pl-12 md:text-left"
                    }`}
                  >
                    <span class="font-serif text-3xl font-medium text-primary">
                      {item.time}
                    </span>
                  </div>

                  <div class="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-sm md:absolute md:left-1/2 md:-translate-x-1/2">
                    <Dynamic
                      component={item.icon}
                      class="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                  </div>

                  <div
                    class={`md:w-1/2 ${
                      index() % 2 === 0
                        ? "md:pl-12 md:text-left"
                        : "md:pr-12 md:text-right"
                    }`}
                  >
                    <span class="font-serif text-2xl font-medium text-primary md:hidden">
                      {item.time}
                    </span>
                    <h3 class="font-serif text-2xl font-medium text-foreground md:text-3xl">
                      {item.title}
                    </h3>
                    <p class="mt-2 max-w-md font-sans font-light leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </li>
              )}
            </For>
          </ul>
        </div>

        <div
          ref={overlayRef}
          aria-hidden="true"
          class={`absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[2px] transition-opacity duration-500 ${
            slapped() ? "opacity-100" : "opacity-0"
          }`}
        >
          <span
            class={`-rotate-6 rounded-xl border-2 border-dashed border-primary/60 bg-background/80 px-6 py-3 font-serif text-3xl font-medium uppercase tracking-[0.2em] text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] md:px-10 md:py-4 md:text-6xl md:tracking-[0.3em] ${
              slapped()
                ? "animate-[tape-slap_0.7s_cubic-bezier(0.2,1.6,0.4,1)_both]"
                : "opacity-0"
            }`}
          >
            in arrivo
          </span>
        </div>
      </div>
    </section>
  );
}

export default Program;
