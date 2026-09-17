import monogramUrl from "@/assets/monogram-transparent.png";

function Footer() {
  return (
    <footer class="border-t border-border bg-background py-10">
      <div class="mx-auto max-w-5xl px-6 text-center">
        <p class="font-serif text-2xl font-medium text-foreground">
          Licia{" "}
          <img
            src={monogramUrl}
            alt="&"
            class="mx-1 inline-block h-[calc(1.43em+5.2px)] w-auto align-middle"
          />{" "}
          Emanuele
        </p>
        <p class="mt-2 font-sans text-sm text-muted-foreground">
          Con amore, non vediamo l&apos;ora di celebrare insieme a voi.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
