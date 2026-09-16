import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Church,
  Wine,
  UtensilsCrossed,
  CakeSlice,
  Music,
  Heart,
  Menu,
  X,
  Copy,
  Check,
  Minus,
  Plus,
  Shirt,
  Gem,
  Landmark,
  MapPin,
  type LucideIcon,
} from "lucide-react";

import heroUrl from "../assets/hero.png?url";
import monogramUrl from "../assets/monogram-transparent.png";

const RSVP_ENDPOINT =
  import.meta.env["VITE_RSVP_ENDPOINT"] || "http://localhost:8787/rsvp";

const RSVP_ENABLED = import.meta.env["VITE_RSVP_ENABLED"] !== "false";

const IBAN = "IT27X0306903222100000017877";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Il matrimonio di Licia ed Emanuele" },
      {
        name: "description",
        content:
          "Unisciti a noi per celebrare il matrimonio di Licia ed Emanuele. Scopri il programma della giornata e conferma la tua presenza.",
      },
      { property: "og:title", content: "Il matrimonio di Licia ed Emanuele" },
      {
        property: "og:description",
        content:
          "Unisciti a noi per celebrare il matrimonio di Licia ed Emanuele. Scopri il programma e conferma la tua presenza.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Attending = "yes" | "no" | "";

function Home() {
  useEffect(() => {
    (window as unknown as Record<string, unknown>)["__appReady"] = true;
  }, []);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Program />
        <InfoUtili />
        <Rsvp />
      </main>
      <Footer />
    </>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#programma", label: "Programma" },
    { href: "#info-utili", label: "Info utili" },
    { href: "#rsvp", label: "RSVP" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border/50 bg-background/80 backdrop-blur-md"
          : "bg-gradient-to-b from-background/80 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center gap-3 font-serif text-xl font-semibold tracking-wide text-foreground"
        >
          Licia{" "}
          <img
            src={monogramUrl}
            alt="&"
            className="mx-1 inline-block h-[calc(1.43em+5.2px)] w-auto align-middle"
          />{" "}
          Emanuele
        </Link>
        <nav aria-label="Navigazione principale">
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative font-sans text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all hover:after:w-full"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden"
          >
            {open ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </nav>
      </div>
      <nav
        id="mobile-nav"
        aria-label="Navigazione mobile"
        className={`absolute inset-x-0 top-full overflow-hidden px-6 pt-2 backdrop-blur-md transition-all duration-300 ease-out md:hidden ${
          open
            ? "max-h-64 border-t border-border/50 bg-background/80 pb-4 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-right font-sans text-base font-medium text-foreground/80 transition-colors hover:bg-secondary/40 hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="hero"
      className="relative -mt-20 flex min-h-screen items-center justify-center overflow-hidden scroll-mt-24"
    >
      <img
        src={heroUrl}
        alt="Illustrazione romantica degli sposi che si dirigono verso la villa del matrimonio"
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1080}
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-primary-foreground drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
        <p className="mb-4 font-sans text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/95 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
          Siete invitati al nostro matrimonio
        </p>
        <h1 className="font-serif text-4xl font-medium leading-[1.1] [font-variant:small-caps] sm:text-5xl md:text-7xl">
          Il matrimonio di <span className="block">Licia ed Emanuele</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md font-sans text-lg font-light md:text-xl">
          Sabato 10 aprile 2027
          <span className="mx-3 text-accent">·</span>
          Villa Grant, Roma
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#rsvp"
            className="inline-flex items-center justify-center rounded-full bg-primary-foreground px-8 py-3.5 font-sans text-sm font-semibold uppercase tracking-wider text-primary drop-shadow-none [text-shadow:none] transition-transform hover:-translate-y-0.5"
          >
            Conferma presenza
          </a>
          <a
            href="#programma"
            className="inline-flex items-center justify-center rounded-full bg-primary-foreground px-8 py-3.5 font-sans text-sm font-semibold uppercase tracking-wider text-primary drop-shadow-none [text-shadow:none] transition-transform hover:-translate-y-0.5"
          >
            Scopri il programma
          </a>
        </div>
      </div>
    </section>
  );
}

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
  const overlayRef = useRef<HTMLDivElement>(null);
  const [slapped, setSlapped] = useState(false);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el || slapped) return;
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
    return () => observer.disconnect();
  }, [slapped]);

  return (
    <section
      id="programma"
      className="scroll-mt-24 bg-background py-24 md:py-32"
    >
      <div className="relative mx-auto max-w-4xl px-6">
        <div className="mb-16 text-center">
          <p className="font-sans text-sm font-medium uppercase tracking-[0.2em] text-accent">
            La giornata
          </p>
          <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
            Programma
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />
          <ul className="space-y-10 md:space-y-14">
            {schedule.map((item, index) => (
              <li
                key={item.title}
                className={`relative flex items-start gap-6 md:gap-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div
                  className={`hidden md:block md:w-1/2 ${
                    index % 2 === 0
                      ? "md:pr-12 md:text-right"
                      : "md:pl-12 md:text-left"
                  }`}
                >
                  <span className="font-serif text-3xl font-medium text-primary">
                    {item.time}
                  </span>
                </div>

                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-sm md:absolute md:left-1/2 md:-translate-x-1/2">
                  <item.icon
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                </div>

                <div
                  className={`md:w-1/2 ${
                    index % 2 === 0
                      ? "md:pl-12 md:text-left"
                      : "md:pr-12 md:text-right"
                  }`}
                >
                  <span className="font-serif text-2xl font-medium text-primary md:hidden">
                    {item.time}
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-foreground md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-md font-sans font-light leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div
          ref={overlayRef}
          aria-hidden="true"
          className={`absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[2px] transition-opacity duration-500 ${
            slapped ? "opacity-100" : "opacity-0"
          }`}
        >
          <span
            className={`-rotate-6 rounded-xl border-2 border-dashed border-primary/60 bg-background/80 px-6 py-3 font-serif text-3xl font-medium uppercase tracking-[0.2em] text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] md:px-10 md:py-4 md:text-6xl md:tracking-[0.3em] ${
              slapped
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

const VILLA_GRANT_LAT = 41.687463;
const VILLA_GRANT_LON = 12.448046;

function InfoIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="card-icon flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Icon className="h-5 w-5" />
    </div>
  );
}

function InfoUtili() {
  const [ibanCopied, setIbanCopied] = useState(false);
  return (
    <section
      id="info-utili"
      className="scroll-mt-24 bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-16 text-center">
          <p className="font-sans text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Da sapere
          </p>
          <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
            Info utili
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <InfoIcon icon={Shirt} />
            <h3 className="mt-4 font-serif text-2xl font-medium text-foreground">
              Dress code
            </h3>
            <p className="mt-3 font-sans font-light leading-relaxed text-muted-foreground">
              Abbiamo deciso di non scegliere una palette precisa, vogliamo che
              vi sentiate belli ed eleganti. Ma abbiamo un paio di richieste:
              niente abiti bianchi e no magliette a maniche corte! Grazie, love
              u &lt;3
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <InfoIcon icon={Gem} />
            <h3 className="mt-4 font-serif text-2xl font-medium text-foreground">
              No proposte di matrimonio
            </h3>
            <p className="mt-3 font-sans font-light leading-relaxed text-muted-foreground">
              La giornata è dedicata a noi: lasciate a casa l&apos;anello e le
              ginocchia a terra.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <InfoIcon icon={Landmark} />
            <h3 className="mt-4 font-serif text-2xl font-medium text-foreground">
              IBAN
            </h3>
            <div className="mt-3 flex items-center justify-between gap-4">
              <code className="break-all font-mono text-sm text-muted-foreground">
                {IBAN}
              </code>
              <button
                type="button"
                aria-label="Copia IBAN"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(IBAN);
                    setIbanCopied(true);
                    setTimeout(() => setIbanCopied(false), 2000);
                  } catch {
                    setIbanCopied(false);
                  }
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                {ibanCopied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <InfoIcon icon={MapPin} />
          <h3 className="mt-4 font-serif text-2xl font-medium text-foreground">
            Come raggiungere Villa Grant
          </h3>
          <p className="mt-3 font-sans font-light leading-relaxed text-muted-foreground">
            Villa Grant — Via di Pratica 281, Roma. Dal GRA prendi l&apos;uscita
            26 (SS148 Pontina) direzione Pomezia/Latina, poi l&apos;uscita
            Pratica di Mare.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <iframe
              title="Mappa di Villa Grant su Google Maps"
              src={`https://maps.google.com/maps?q=${VILLA_GRANT_LAT},${VILLA_GRANT_LON}&z=16&output=embed`}
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${VILLA_GRANT_LAT},${VILLA_GRANT_LON}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 font-sans text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Apri la mappa con le coordinate (Google Maps)
          </a>
        </div>
      </div>
    </section>
  );
}

function Counter({
  value,
  min,
  max,
  disabled = false,
  id,
  labelId,
  onValueChange,
}: {
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  id: string;
  labelId: string;
  onValueChange: (value: number) => void;
}) {
  const prevRef = useRef(value);
  const prev = prevRef.current;
  if (value !== prev) prevRef.current = value;
  const slide =
    value >= prev ? "slide-in-from-bottom-2" : "slide-in-from-top-2";

  const buttonClass =
    "flex h-12 w-12 items-center justify-center rounded-xl border border-input bg-background text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 disabled:cursor-not-allowed disabled:border-input disabled:bg-muted disabled:text-muted-foreground";

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className="flex items-center gap-3"
    >
      <button
        type="button"
        aria-label="Diminuisci numero di persone"
        disabled={disabled || value <= min}
        onClick={() => onValueChange(Math.max(min, value - 1))}
        className={buttonClass}
      >
        <Minus className="h-4 w-4" />
      </button>
      <div
        id={id}
        aria-live="polite"
        className={`w-12 text-center font-sans text-xl font-medium tabular-nums ${
          disabled ? "text-muted-foreground" : "text-foreground"
        }`}
      >
        <span
          key={value}
          className={`animate-in fade-in ${slide} duration-200 motion-reduce:animate-none`}
        >
          {value}
        </span>
      </div>
      <button
        type="button"
        aria-label="Aumenta numero di persone"
        disabled={disabled || value >= max}
        onClick={() => onValueChange(Math.min(max, value + 1))}
        className={buttonClass}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function Rsvp() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    attending: "" as Attending,
    guests: 0,
    notes: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isAttending = form.attending === "yes";

  async function handleSubmit(e: React.FormEvent) {
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
    if (isAttending && (form.guests < 1 || form.guests > 15)) {
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
        body: JSON.stringify(form),
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
    <section id="rsvp" className="scroll-mt-24 bg-secondary/40 py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-12 text-center">
          <p className="font-sans text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Conferma presenza
          </p>
          <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
            RSVP
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-sans font-light leading-relaxed text-muted-foreground">
            Ti aspettiamo! Per aiutarci nell&apos;organizzazione, conferma la
            tua partecipazione entro il 15 febbraio 2027.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-6 font-serif text-2xl font-medium text-foreground">
              Grazie per la tua risposta!
            </h3>
            <p className="mt-3 font-sans font-light text-muted-foreground">
              Abbiamo ricevuto la tua conferma. Non vediamo l&apos;ora di
              festeggiare insieme.
            </p>
            <button
              onClick={handleReset}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Compila un altro invito
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-8 shadow-sm md:p-12"
            noValidate
          >
            {status === "error" && (
              <div
                className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 font-sans text-sm text-destructive"
                role="alert"
              >
                {errorMsg}
              </div>
            )}

            {!RSVP_ENABLED && (
              <div
                role="status"
                className="mb-6 rounded-lg border border-primary/30 bg-primary/10 p-4 font-sans text-sm text-primary"
              >
                A breve potrai confermare la tua presenza. Torna a trovarci
                presto!
              </div>
            )}

            <fieldset disabled={!RSVP_ENABLED}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block font-sans text-sm font-medium text-foreground"
                  >
                    Nome
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 font-sans text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-ring"
                    placeholder="Il tuo nome"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="block font-sans text-sm font-medium text-foreground"
                  >
                    Cognome
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 font-sans text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-ring"
                    placeholder="Il tuo cognome"
                    required
                  />
                </div>
              </div>

              <fieldset className="mt-8 space-y-3">
                <legend className="block font-sans text-sm font-medium text-foreground">
                  Parteciperai alla celebrazione?
                </legend>
                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-input bg-background px-5 py-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={form.attending === "yes"}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          attending: e.target.value as Attending,
                        }))
                      }
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="font-sans text-sm text-foreground">
                      Sarò presente
                    </span>
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-input bg-background px-5 py-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={form.attending === "no"}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          attending: e.target.value as Attending,
                          guests: 0,
                        }))
                      }
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="font-sans text-sm text-foreground">
                      Non potrò esserci
                    </span>
                  </label>
                </div>
              </fieldset>

              <div className="mt-8 space-y-2">
                <span
                  id="guests-label"
                  className="block font-sans text-sm font-medium text-foreground"
                >
                  Saremo in
                </span>
                <Counter
                  id="guests"
                  labelId="guests-label"
                  value={form.guests}
                  min={0}
                  max={15}
                  disabled={!isAttending}
                  onValueChange={(guests) =>
                    setForm((prev) => ({ ...prev, guests }))
                  }
                />
                <p className="font-sans text-xs text-muted-foreground">
                  Numero totale di persone, te compreso: da 1 a 15. Inserisci 1
                  se verrai da solo/a.
                </p>
              </div>

              <div className="mt-8 space-y-2">
                <label
                  htmlFor="notes"
                  className="block font-sans text-sm font-medium text-foreground"
                >
                  Intolleranze, allergie o altre esigenze
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 font-sans text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-ring"
                  placeholder="Facoltativo, es: Hannibal - intollerante alla carne di maiale"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-10 w-full rounded-full bg-primary px-8 py-4 font-sans text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Invio in corso…" : "Invia conferma"}
              </button>
            </fieldset>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="font-serif text-2xl font-medium text-foreground">
          Licia{" "}
          <img
            src={monogramUrl}
            alt="&"
            className="mx-1 inline-block h-[calc(1.43em+5.2px)] w-auto align-middle"
          />{" "}
          Emanuele
        </p>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          Con amore, non vediamo l&apos;ora di celebrare insieme a voi.
        </p>
      </div>
    </footer>
  );
}
