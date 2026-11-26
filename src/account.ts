export type AutoTopUp =
  | { kind: "on"; threshold: number; amount: number }
  | { kind: "off" }
  | { kind: "unknown" };

export type AccountCredit = { credit: number; autoTopUp: AutoTopUp };

export class AccountResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccountResponseError";
  }
}

const positive = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value > 0;

/**
 * Vast.ai auto-billing: when credit drops below `autobill_threshold`, the card on file
 * (`has_billing`) is charged `autobill_amount`. Without a card nothing can be charged.
 * Anything that doesn't fit these shapes stays unknown instead of being guessed.
 */
export function parseAutoTopUp(account: Record<string, unknown>): AutoTopUp {
  const { has_billing: card, autobill_threshold: threshold, autobill_amount: amount } = account;
  if (card === false) return { kind: "off" };
  if (card !== true) return { kind: "unknown" };
  if (positive(amount) && typeof threshold === "number" && Number.isFinite(threshold) && threshold >= 0) {
    return { kind: "on", threshold, amount };
  }
  const unset = (value: unknown) => value === null || value === undefined || value === 0;
  return unset(amount) || unset(threshold) ? { kind: "off" } : { kind: "unknown" };
}

export function parseAccountCredit(body: string): AccountCredit {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new AccountResponseError("Vast.ai returned an unreadable account response.");
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new AccountResponseError("Vast.ai returned an invalid account response.");
  }
  const account = payload as Record<string, unknown>;
  const credit = account.credit;
  if (typeof credit !== "number" || !Number.isFinite(credit)) {
    throw new AccountResponseError("Vast.ai did not return a valid credit amount.");
  }
  return { credit, autoTopUp: parseAutoTopUp(account) };
}

export function autoTopUpSummary(autoTopUp: AutoTopUp, money: (value: number) => string): string | undefined {
  if (autoTopUp.kind === "off") return "Auto-top-up off";
  if (autoTopUp.kind === "on") return `Auto-top-up +${money(autoTopUp.amount)} below ${money(autoTopUp.threshold)}`;
  return undefined;
}
