import type { ViewState } from "./refresh.ts";

export function statusMetadata(
  state: ViewState,
  formatTime: (timestamp: number) => string = (timestamp) => new Date(timestamp).toLocaleTimeString(),
): string {
  if (state.kind === "disconnected") return "Connect Vast.ai in Settings → Integrations.";
  if (state.kind === "success") return `Updated ${formatTime(state.lastSuccess)}`;
  if (state.kind === "loading") {
    return state.lastSuccess === undefined ? "Refreshing…" : `Last successful refresh ${formatTime(state.lastSuccess)}`;
  }
  const message = state.kind === "invalid"
    ? "Vast.ai rejected the key. Reconnect in Settings → Integrations."
    : "Could not refresh Vast.ai credit.";
  return message + (state.lastSuccess === undefined ? "" : ` Last successful refresh ${formatTime(state.lastSuccess)}.`);
}
