import { createFileRoute, redirect } from "@tanstack/react-router";

// participation cards point here: send guests to the main site
export const Route = createFileRoute("/invito")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
