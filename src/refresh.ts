import { HostRequestError } from "@openchamber/sdk";
import { parseAccountCredit, type AutoTopUp } from "./account.ts";

export type ViewState =
  | { kind: "disconnected" }
  | { kind: "loading"; previous?: number; lastSuccess?: number }
  | { kind: "success"; credit: number; lastSuccess: number; autoTopUp: AutoTopUp }
  | { kind: "invalid"; previous?: number; lastSuccess?: number }
  | { kind: "unavailable"; previous?: number; lastSuccess?: number };

type Host = { request: (request: { method: "GET"; path: string }) => Promise<{ status: number; body: string }> };
type Runtime = {
  visible: () => boolean;
  every: (callback: () => void, ms: number) => ReturnType<typeof setInterval>;
  cancel: (timer: ReturnType<typeof setInterval>) => void;
};

const runtime: Runtime = {
  visible: () => document.visibilityState === "visible",
  every: (callback, ms) => setInterval(callback, ms),
  cancel: (timer) => clearInterval(timer),
};

export class CreditRefresh {
  private readonly host: Host;
  private readonly changed: (state: ViewState) => void;
  private readonly clock: () => number;
  private readonly env: Runtime;
  private connected = false;
  private account = "";
  private timer?: ReturnType<typeof setInterval>;
  private inFlight = false;
  private generation = 0;
  private lastSuccess?: number;
  private credit?: number;
  private nativeCredentialRejected = false;
  constructor(
    host: Host,
    changed: (state: ViewState) => void,
    clock: () => number = Date.now,
    env: Runtime = runtime,
  ) {
    this.host = host;
    this.changed = changed;
    this.clock = clock;
    this.env = env;
    this.changed({ kind: "disconnected" });
  }

  connection(connected: boolean, account: string): void {
    if (!connected && this.nativeCredentialRejected) {
      this.nativeCredentialRejected = false;
      this.generation++;
      this.stopTimer();
      this.connected = false;
      this.account = account;
      this.credit = undefined;
      this.lastSuccess = undefined;
      this.setState({ kind: "invalid" });
      return;
    }
    if (!connected) this.nativeCredentialRejected = false;
    const same = this.connected === connected && this.account === account;
    if (same) return;
    if (connected) this.nativeCredentialRejected = false;
    this.generation++;
    this.stopTimer();
    const accountChanged = this.account !== account;
    this.connected = connected;
    this.account = account;
    if (!connected || accountChanged) {
      this.credit = undefined;
      this.lastSuccess = undefined;
    }
    if (!connected) {
      this.setState({ kind: "disconnected" });
      return;
    }
    this.setState({ kind: "loading" });
    this.refresh();
    this.syncTimer();
  }

  visibilityChanged(): void {
    if (!this.env.visible()) {
      this.stopTimer();
      this.generation++;
      return;
    }
    if (this.connected) {
      this.refresh();
      this.syncTimer();
    }
  }

  refresh(): void {
    if (!this.connected || !this.env.visible() || this.inFlight) return;
    const generation = this.generation;
    this.inFlight = true;
    this.setState({ kind: "loading", previous: this.credit, lastSuccess: this.lastSuccess });
    void this.host.request({ method: "GET", path: "/api/v0/users/current/" }).then((result) => {
      if (generation !== this.generation) return;
      if (result.status === 401 || result.status === 403) {
        this.setState({ kind: "invalid", previous: this.credit, lastSuccess: this.lastSuccess });
      } else if (result.status < 200 || result.status >= 300) {
        this.setState({ kind: "unavailable", previous: this.credit, lastSuccess: this.lastSuccess });
      } else {
        const parsed = parseAccountCredit(result.body);
        this.credit = parsed.credit;
        this.lastSuccess = this.clock();
        this.setState({ kind: "success", credit: parsed.credit, lastSuccess: this.lastSuccess, autoTopUp: parsed.autoTopUp });
      }
    }).catch((error: unknown) => {
      if (generation !== this.generation) return;
      if (error instanceof HostRequestError && error.code === "DISCONNECTED") {
        this.nativeCredentialRejected = true;
        this.generation++;
        this.connected = false;
        this.stopTimer();
        this.credit = undefined;
        this.lastSuccess = undefined;
        this.setState({ kind: "invalid" });
      } else {
        this.setState({ kind: "unavailable", previous: this.credit, lastSuccess: this.lastSuccess });
      }
    }).finally(() => {
      this.inFlight = false;
      if (generation !== this.generation && this.connected && this.env.visible()) this.refresh();
    });
  }

  dispose(): void {
    this.generation++;
    this.connected = false;
    this.stopTimer();
  }

  private syncTimer(): void {
    if (this.timer || !this.connected || !this.env.visible()) return;
    this.timer = this.env.every(() => this.refresh(), 60_000);
  }

  private stopTimer(): void {
    if (this.timer) this.env.cancel(this.timer);
    this.timer = undefined;
  }

  private setState(state: ViewState): void {
    this.changed(state);
  }
}
