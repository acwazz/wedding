import { Dynamic } from "solid-js/web";
import type { LucideIcon } from "lucide-solid";

function InfoIcon(props: { icon: LucideIcon }) {
  return (
    <div class="card-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Dynamic component={props.icon} class="h-5 w-5" />
    </div>
  );
}

export default InfoIcon;
