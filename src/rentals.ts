export type GpuModel = { name: string; gpus: number; dollarsPerHour: number };

export type Rentals = {
  /** GPUs in instances Vast.ai reports as running. */
  gpus: number;
  /** Running GPUs grouped by model, in first-seen order, with that model's combined $/h. */
  models: GpuModel[];
  /** Combined $/h of running instances. */
  dollarsPerHour: number;
  /** Instances that exist but are not running (still billed for storage). */
  stopped: number;
};

export class RentalsResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RentalsResponseError";
  }
}

const finite = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

export function parseRentals(body: string): Rentals {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new RentalsResponseError("Vast.ai returned an unreadable instances response.");
  }
  const instances = payload && typeof payload === "object" ? (payload as Record<string, unknown>).instances : undefined;
  if (!Array.isArray(instances)) throw new RentalsResponseError("Vast.ai returned an invalid instances response.");

  const rentals: Rentals = { gpus: 0, models: [], dollarsPerHour: 0, stopped: 0 };
  for (const item of instances) {
    if (!item || typeof item !== "object") throw new RentalsResponseError("Vast.ai returned an invalid instance.");
    const instance = item as Record<string, unknown>;
    if (instance.actual_status !== "running") {
      rentals.stopped++;
      continue;
    }
    const gpus = finite(instance.num_gpus);
    const price = finite(instance.dph_total);
    if (gpus === undefined || price === undefined) throw new RentalsResponseError("Vast.ai returned an incomplete running instance.");
    rentals.gpus += gpus;
    rentals.dollarsPerHour += price;
    const name = (typeof instance.gpu_name === "string" ? instance.gpu_name.trim() : "") || "GPU";
    const model = rentals.models.find((entry) => entry.name === name);
    if (model) {
      model.gpus += gpus;
      model.dollarsPerHour += price;
    } else {
      rentals.models.push({ name, gpus, dollarsPerHour: price });
    }
  }
  return rentals;
}

export function formatHoursLeft(credit: number, dollarsPerHour: number): string | undefined {
  if (!(dollarsPerHour > 0)) return undefined;
  // The epsilon keeps float sums such as 0.8 + 0.4 from flooring a whole hour away.
  const hours = Math.max(0, credit) / dollarsPerHour + 1e-9;
  if (hours < 1) return "<1 h";
  if (hours < 48) return `~${Math.floor(hours)} h`;
  return `~${Math.floor(hours / 24)} d`;
}

// Non-breaking spaces keep short phrases ("2 stopped", "~9 h") on one line in narrow frames.
const keep = (text: string) => text.replace(/ /g, "\u00a0");

/** What is rented: one line per running GPU model with its $/h, then stopped instances. */
export function gpuSummary(rentals: Rentals, money: (value: number) => string): string {
  const stopped = rentals.stopped > 0 ? keep(`${rentals.stopped} stopped`) : "";
  if (rentals.gpus === 0) return stopped ? `No GPUs running · ${stopped}` : "No rentals";
  const lines = rentals.models.map((model) => `${model.gpus} × ${model.name} · ${money(model.dollarsPerHour)}/h`);
  if (stopped) lines.push(stopped);
  return lines.join("\n");
}

/** Account-wide burn: total $/h of running instances and how long the credit lasts at that rate. */
export function spendSummary(
  rentals: Rentals,
  credit: number | undefined,
  money: (value: number) => string,
): string | undefined {
  if (!(rentals.dollarsPerHour > 0)) return undefined;
  const rate = `${money(rentals.dollarsPerHour)}/h total`;
  const left = credit === undefined ? undefined : formatHoursLeft(credit, rentals.dollarsPerHour);
  return left ? `${rate} · ${keep(left)} of credit` : rate;
}
