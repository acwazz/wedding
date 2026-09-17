import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import Menu from "lucide-solid/icons/menu";
import X from "lucide-solid/icons/x";

import monogramUrl from "@/assets/monogram-transparent.png";

const navLinks = [
  { href: "#programma", label: "Programma" },
  { href: "#info-utili", label: "Info utili" },
  { href: "#rsvp", label: "RSVP" },
];

function Header() {
  const [scrolled, setScrolled] = createSignal(false);
  const [open, setOpen] = createSignal(false);

  onMount(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  return (
    <header
      class={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled()
          ? "border-b border-border/50 bg-background/80 backdrop-blur-md"
          : "bg-gradient-to-b from-background/80 to-transparent"
      }`}
    >
      <div class="mx-auto flex h-20 max-w-5xl items-center justify-between px-6">
        <a
          href="/"
          class="flex items-center gap-3 font-serif text-xl font-semibold tracking-wide text-foreground"
        >
          Licia{" "}
          <img
            src={monogramUrl}
            alt="&"
            class="mx-1 inline-block h-[calc(1.43em+5.2px)] w-auto align-middle"
          />{" "}
          Emanuele
        </a>
        <nav aria-label="Navigazione principale">
          <ul class="hidden items-center gap-8 md:flex">
            <For each={navLinks}>
              {(link) => (
                <li>
                  <a
                    href={link.href}
                    class="relative font-sans text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all hover:after:w-full"
                  >
                    {link.label}
                  </a>
                </li>
              )}
            </For>
          </ul>
          <button
            type="button"
            onclick={() => setOpen((v) => !v)}
            aria-expanded={open()}
            aria-controls="mobile-nav"
            aria-label={open() ? "Chiudi menu" : "Apri menu"}
            class="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden"
          >
            <Show when={open()} fallback={<Menu class="h-6 w-6" />}>
              <X class="h-6 w-6" />
            </Show>
          </button>
        </nav>
      </div>
      <nav
        id="mobile-nav"
        aria-label="Navigazione mobile"
        class={`absolute inset-x-0 top-full overflow-hidden px-6 pt-2 backdrop-blur-md transition-all duration-300 ease-out md:hidden ${
          open()
            ? "max-h-64 border-t border-border/50 bg-background/80 pb-4 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <ul class="flex flex-col">
          <For each={navLinks}>
            {(link) => (
              <li>
                <a
                  href={link.href}
                  onclick={() => setOpen(false)}
                  class="block rounded-lg px-3 py-3 text-right font-sans text-base font-medium text-foreground/80 transition-colors hover:bg-secondary/40 hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            )}
          </For>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
