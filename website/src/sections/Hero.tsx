import heroUrl from "@/assets/hero.png?url";

function Hero() {
  return (
    <section
      id="hero"
      class="relative -mt-20 flex min-h-screen items-center justify-center overflow-hidden scroll-mt-24"
    >
      <img
        src={heroUrl}
        alt="Illustrazione romantica degli sposi che si dirigono verso la villa del matrimonio"
        class="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1080}
        fetchpriority="high"
      />
      <div class="absolute inset-0 bg-black/25" />
      <div class="relative z-10 mx-auto max-w-3xl px-6 text-center text-primary-foreground drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
        <p class="mb-4 font-sans text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/95 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
          Siete invitati al nostro matrimonio
        </p>
        <h1 class="font-serif text-4xl font-medium leading-[1.1] [font-variant:small-caps] sm:text-5xl md:text-7xl">
          Il matrimonio di <span class="block">Licia ed Emanuele</span>
        </h1>
        <p class="mx-auto mt-6 max-w-md font-sans text-lg font-light md:text-xl">
          Sabato 10 aprile 2027
          <span class="mx-3 text-accent">·</span>
          Villa Grant, Roma
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#rsvp"
            class="inline-flex items-center justify-center rounded-full bg-primary-foreground px-8 py-3.5 font-sans text-sm font-semibold uppercase tracking-wider text-primary drop-shadow-none [text-shadow:none] transition-transform hover:-translate-y-0.5"
          >
            Conferma presenza
          </a>
          <a
            href="#programma"
            class="inline-flex items-center justify-center rounded-full bg-primary-foreground px-8 py-3.5 font-sans text-sm font-semibold uppercase tracking-wider text-primary drop-shadow-none [text-shadow:none] transition-transform hover:-translate-y-0.5"
          >
            Scopri il programma
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
