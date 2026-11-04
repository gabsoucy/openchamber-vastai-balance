import type { GuestStatusControl } from "@openchamber/sdk";
import type { ViewState } from "./refresh.ts";

const controlId = "vastai-credit-amount";
const money = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

function amountLabel(prefix: "Cached" | "Stale", value: number): string {
  let amount = money.format(value);
  if (amount.length > 48) amount = value.toExponential(2);
  return `${prefix}: ${amount}`;
}

export function statusHeaderControl(state: ViewState): GuestStatusControl[] {
  let label: string | undefined;
  if (state.kind === "success") label = amountLabel("Cached", state.credit);
  else if (state.kind === "loading" && state.previous !== undefined) label = amountLabel("Cached", state.previous);
  else if ((state.kind === "unavailable" || state.kind === "invalid") && state.previous !== undefined) label = amountLabel("Stale", state.previous);
  if (!label) return [];
  return [{ kind: "button", id: controlId, label, disabled: true }];
}

export function createStatusHeaderPublisher(setControls: (controls: GuestStatusControl[]) => Promise<void>) {
  let controls: GuestStatusControl[] = [];
  let enabled = false;
  let disposed = false;
  let inFlight = false;
  let sent: string | undefined;

  const flush = () => {
    const next = JSON.stringify(controls);
    if (!enabled || disposed || inFlight || next === sent) return;
    sent = next;
    inFlight = true;
    void setControls(controls).catch(() => {
      // Unsupported/rejected host calls must never become unhandled rejections.
    }).finally(() => {
      inFlight = false;
      if (!disposed && JSON.stringify(controls) !== sent) flush();
    });
  };

  return {
    update(state: ViewState) {
      controls = statusHeaderControl(state);
      flush();
    },
    enable(supported: boolean) {
      enabled = supported;
      flush();
    },
    dispose() {
      // Do not clear: controls intentionally retain the last cached amount while folded.
      disposed = true;
    },
  };
}
