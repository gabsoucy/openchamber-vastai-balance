export type AccountCredit = { credit: number; autoTopUp: "Unknown" };

export class AccountResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccountResponseError";
  }
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
  const credit = (payload as Record<string, unknown>).credit;
  if (typeof credit !== "number" || !Number.isFinite(credit)) {
    throw new AccountResponseError("Vast.ai did not return a valid credit amount.");
  }
  return { credit, autoTopUp: "Unknown" };
}
