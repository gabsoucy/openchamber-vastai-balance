import { connectHost } from "@openchamber/sdk";
import { applyHostReady } from "@openchamber/sdk/ui";
import { CreditRefresh, type ViewState } from "./refresh.ts";
import { observeAdaptiveHeight } from "./adaptive-height.ts";
import { statusMetadata } from "./metadata.ts";
import { gpuSummary, parseRentals, spendSummary, type Rentals } from "./rentals.ts";
import { autoTopUpSummary } from "./account.ts";

const host = connectHost();
const creditNode = document.querySelector<HTMLElement>("#credit")!;
const detailNode = document.querySelector<HTMLElement>("#detail")!;
const rentalsNode = document.querySelector<HTMLElement>("#rentals")!;
const gpusNode = document.querySelector<HTMLElement>("#gpus")!;
const spendNode = document.querySelector<HTMLElement>("#spend")!;
const topUpNode = document.querySelector<HTMLElement>("#topup")!;
const instancesLink = document.querySelector<HTMLAnchorElement>("#instances")!;
const refreshButton = document.querySelector<HTMLButtonElement>("#refresh")!;
const currency = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });
const money = (value: number) => currency.format(value);
// Hourly rates are often fractions of a cent apart, so they get three decimals.
const rateFormat = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 3, maximumFractionDigits: 3 });
const rate = (value: number) => rateFormat.format(value);
const layout = observeAdaptiveHeight(document.querySelector<HTMLElement>("main")!, (height) => host.setHeight(height));

// Rentals are read after each successful credit refresh, so they follow the
// credit lifecycle (open, connect, manual and 60 s refresh, never while hidden).
let rentals: Rentals | undefined;
let rentalsFailed = false;
let rentalsGeneration = 0;
let rentalsInFlight = false;
let lastCredit: number | undefined;

function renderRentals(): void {
  if (rentals) {
    gpusNode.textContent = gpuSummary(rentals, rate) + (rentalsFailed ? " · Stale" : "");
    const spend = spendSummary(rentals, lastCredit, rate);
    spendNode.textContent = spend ?? "";
    spendNode.hidden = spend === undefined;
  } else {
    gpusNode.textContent = rentalsFailed ? "Rentals unavailable" : "Checking rentals…";
    spendNode.hidden = true;
  }
}

function clearRentals(): void {
  rentalsGeneration++;
  rentals = undefined;
  rentalsFailed = false;
  lastCredit = undefined;
  rentalsNode.hidden = true;
  topUpNode.hidden = true;
}

function loadRentals(): void {
  if (rentalsInFlight) return;
  const generation = rentalsGeneration;
  rentalsInFlight = true;
  void host.request({ method: "GET", path: "/api/v0/instances/" }).then((result) => {
    if (generation !== rentalsGeneration) return;
    if (result.status < 200 || result.status >= 300) throw new Error(`HTTP ${result.status}`);
    rentals = parseRentals(result.body);
    rentalsFailed = false;
  }).catch(() => {
    if (generation === rentalsGeneration) rentalsFailed = true;
  }).finally(() => {
    rentalsInFlight = false;
    if (generation !== rentalsGeneration) return;
    renderRentals();
    layout.measure();
  });
}

function render(state: ViewState): void {
  if (state.kind === "disconnected") {
    creditNode.textContent = "Not connected";
  } else if (state.kind === "loading") {
    creditNode.textContent = state.previous === undefined ? "Loading…" : money(state.previous);
  } else if (state.kind === "success") {
    creditNode.textContent = money(state.credit);
  } else {
    creditNode.textContent = state.previous === undefined ? (state.kind === "invalid" ? "Invalid credentials" : "Unavailable") : `${money(state.previous)} · Stale`;
  }
  detailNode.textContent = statusMetadata(state);

  // No known credit (disconnect, rejected key, account switch): drop the old account's rentals.
  if (state.kind === "disconnected" || state.kind === "invalid" || (state.kind === "loading" && state.previous === undefined)) {
    clearRentals();
  } else if (state.kind === "success") {
    lastCredit = state.credit;
    rentalsNode.hidden = false;
    const topUp = autoTopUpSummary(state.autoTopUp, money);
    topUpNode.textContent = topUp ?? "";
    topUpNode.hidden = topUp === undefined;
    renderRentals();
    loadRentals();
  }

  const busy = state.kind === "loading";
  refreshButton.disabled = busy || state.kind === "disconnected" || state.kind === "invalid";
  refreshButton.classList.toggle("spinning", busy);
  layout.measure();
}

const refresh = new CreditRefresh(host, render);
refreshButton.addEventListener("click", () => refresh.refresh());
// A sandboxed frame can't open links itself; the host opens them in the browser.
instancesLink.addEventListener("click", (event) => {
  event.preventDefault();
  void host.openUrl(instancesLink.href).catch(() => undefined);
});
host.onReady((ctx) => {
  applyHostReady(ctx, document.documentElement);
  layout.measure();
});
host.onConnection(({ connected, account }) => refresh.connection(connected, account));
document.addEventListener("visibilitychange", () => refresh.visibilityChanged());
window.addEventListener("resize", layout.measure);
window.addEventListener("pagehide", () => {
  refresh.dispose();
  layout.dispose();
  rentalsGeneration++;
  window.removeEventListener("resize", layout.measure);
  host.dispose();
}, { once: true });
