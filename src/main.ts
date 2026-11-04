import { connectHost } from "@openchamber/sdk";
import { applyHostReady, mountButton } from "@openchamber/sdk/ui";
import { CreditRefresh, type ViewState } from "./refresh.ts";
import { observeAdaptiveHeight } from "./adaptive-height.ts";
import { createStatusHeaderPublisher } from "./status-header.ts";

const host = connectHost();
const creditNode = document.querySelector<HTMLElement>("#credit")!;
const detailNode = document.querySelector<HTMLElement>("#detail")!;
const refreshButtonRoot = document.querySelector<HTMLElement>("#refresh")!;
const refreshButton = mountButton(refreshButtonRoot, {
  label: "Refresh",
  variant: "outline",
  size: "xs",
  onClick: () => refresh.refresh(),
});
const money = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });
const statusHeader = createStatusHeaderPublisher((controls) => host.setStatusControls(controls));
const layout = observeAdaptiveHeight(document.querySelector<HTMLElement>("main")!, (height) => host.setHeight(height));

function render(state: ViewState): void {
  if (state.kind === "disconnected") {
    creditNode.textContent = "Not connected";
    detailNode.textContent = "Auto-top-up: Unknown · Connect Vast.ai in Settings → Integrations.";
  } else if (state.kind === "loading") {
    creditNode.textContent = state.previous === undefined ? "Loading…" : `${money.format(state.previous)} · refreshing`;
    detailNode.textContent = `Auto-top-up: Unknown · ${state.lastSuccess ? `Last successful refresh ${new Date(state.lastSuccess).toLocaleTimeString()}` : "Available credit"}`;
  } else if (state.kind === "success") {
    creditNode.textContent = money.format(state.credit);
    detailNode.textContent = `Auto-top-up: Unknown · Available credit · Updated ${new Date(state.lastSuccess).toLocaleTimeString()}`;
  } else {
    creditNode.textContent = state.previous === undefined ? (state.kind === "invalid" ? "Invalid credentials" : "Unavailable") : `${money.format(state.previous)} · Stale`;
    detailNode.textContent = `Auto-top-up: Unknown · ${state.kind === "invalid" ? "Vast.ai rejected the key. Reconnect in Settings → Integrations." : "Could not refresh Vast.ai credit."}${state.lastSuccess ? ` Last successful refresh ${new Date(state.lastSuccess).toLocaleTimeString()}.` : ""}`;
  }
  refreshButton.update({ disabled: state.kind === "disconnected" || state.kind === "loading" || state.kind === "invalid" });
  statusHeader.update(state);
  layout.measure();
}

const refresh = new CreditRefresh(host, render);
host.onReady((ctx) => {
  applyHostReady(ctx, document.documentElement);
  layout.measure();
  statusHeader.enable(ctx.features?.statusControls === true);
});
host.onConnection(({ connected, account }) => refresh.connection(connected, account));
document.addEventListener("visibilitychange", () => refresh.visibilityChanged());
window.addEventListener("resize", layout.measure);
window.addEventListener("pagehide", () => {
  refresh.dispose();
  layout.dispose();
  window.removeEventListener("resize", layout.measure);
  statusHeader.dispose();
  refreshButton.dispose();
  host.dispose();
}, { once: true });
