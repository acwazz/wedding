import { Show } from "solid-js";
import Minus from "lucide-solid/icons/minus";
import Plus from "lucide-solid/icons/plus";

function Counter(props: {
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  id: string;
  labelId: string;
  onValueChange: (value: number) => void;
}) {
  let prev = props.value;
  const slide = (v: number) =>
    v >= prev ? "slide-in-from-bottom-2" : "slide-in-from-top-2";

  const buttonClass =
    "flex h-12 w-12 items-center justify-center rounded-xl border border-input bg-background text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 disabled:cursor-not-allowed disabled:border-input disabled:bg-muted disabled:text-muted-foreground";

  return (
    <div
      role="group"
      aria-labelledby={props.labelId}
      class="flex items-center gap-3"
    >
      <button
        type="button"
        aria-label="Diminuisci numero di persone"
        disabled={props.disabled || props.value <= props.min}
        onclick={() =>
          props.onValueChange(Math.max(props.min, props.value - 1))
        }
        class={buttonClass}
      >
        <Minus class="h-4 w-4" />
      </button>
      <div
        id={props.id}
        aria-live="polite"
        class={`w-12 text-center font-sans text-xl font-medium tabular-nums ${
          props.disabled ? "text-muted-foreground" : "text-foreground"
        }`}
      >
        <Show
          when={props.value}
          keyed
          fallback={
            <span class="animate-in fade-in slide-in-from-top-2 duration-200 motion-reduce:animate-none">
              0
            </span>
          }
        >
          {(v) => {
            const dir = slide(v);
            prev = v;
            return (
              <span
                class={`animate-in fade-in ${dir} duration-200 motion-reduce:animate-none`}
              >
                {v}
              </span>
            );
          }}
        </Show>
      </div>
      <button
        type="button"
        aria-label="Aumenta numero di persone"
        disabled={props.disabled || props.value >= props.max}
        onclick={() =>
          props.onValueChange(Math.min(props.max, props.value + 1))
        }
        class={buttonClass}
      >
        <Plus class="h-4 w-4" />
      </button>
    </div>
  );
}

export default Counter;
