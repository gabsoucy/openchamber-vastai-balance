import test from "node:test";
import assert from "node:assert/strict";
import { formatHoursLeft, gpuSummary, parseRentals, spendSummary as spend, RentalsResponseError } from "../src/rentals.ts";

const money = (value: number) => `$${value.toFixed(2)}`;
// Compare with ordinary spaces; summaries use non-breaking ones inside short phrases.
const plain = (text: string | undefined) => text?.replace(/ /g, " ");
const gpus = (rentals: Parameters<typeof gpuSummary>[0]) => plain(gpuSummary(rentals, money));
const spendSummary = (...args: Parameters<typeof spend>) => plain(spend(...args));
const body = (instances: unknown[]) => JSON.stringify({ instances_found: instances.length, instances });
const running = (num_gpus: number, gpu_name: string, dph_total: number) => ({ actual_status: "running", num_gpus, gpu_name, dph_total });

test("running instances add GPUs and $/h; stopped instances are only counted", () => {
  const rentals = parseRentals(body([
    running(2, "RTX 5090", 0.8),
    running(1, "RTX 5090", 0.4),
    { actual_status: "exited", num_gpus: 4, gpu_name: "H100", dph_total: 9 },
    { actual_status: "loading", num_gpus: 1, gpu_name: "A100", dph_total: 1 },
  ]));
  assert.equal(rentals.gpus, 3);
  assert.equal(rentals.models.length, 1);
  assert.ok(Math.abs(rentals.dollarsPerHour - 1.2) < 1e-9);
  assert.equal(rentals.stopped, 2);
  assert.equal(gpus(rentals), "3 × RTX 5090 · $1.20/h\n2 stopped");
  assert.equal(spendSummary(rentals, 12, money), "$1.20/h total · ~10 h of credit");
});

test("mixed GPU models are listed; rate without a known credit has no time left", () => {
  const rentals = parseRentals(body([running(1, "RTX 5090", 0.5), running(1, "RTX 3060", 0.1)]));
  assert.equal(gpus(rentals), "1 × RTX 5090 · $0.50/h\n1 × RTX 3060 · $0.10/h");
  assert.equal(spendSummary(rentals, undefined, money), "$0.60/h total");
});

test("no instances and only stopped instances have no spend line", () => {
  const none = parseRentals(body([]));
  assert.equal(gpus(none), "No rentals");
  assert.equal(spendSummary(none, 10, money), undefined);
  const stopped = parseRentals(body([{ actual_status: "exited" }]));
  assert.equal(gpus(stopped), "No GPUs running · 1 stopped");
  assert.equal(spendSummary(stopped, 10, money), undefined);
});

test("malformed responses throw instead of looking like zero rentals", () => {
  for (const bad of ["not json", "{}", '{"instances":null}', '{"instances":[null]}', body([{ actual_status: "running", num_gpus: 1 }])]) {
    assert.throws(() => parseRentals(bad), RentalsResponseError, bad);
  }
});

test("time left at the current rate", () => {
  assert.equal(formatHoursLeft(10, 0), undefined);
  assert.equal(formatHoursLeft(0.1, 1), "<1 h");
  assert.equal(formatHoursLeft(-5, 1), "<1 h");
  assert.equal(formatHoursLeft(10.01, 0.12), "~3 d");
  assert.equal(formatHoursLeft(5, 0.12), "~41 h");
});
