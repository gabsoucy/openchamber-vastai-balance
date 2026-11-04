import test from "node:test";
import assert from "node:assert/strict";
import { createStatusHeaderPublisher, statusHeaderControl } from "../src/status-header.ts";
import type { ViewState } from "../src/refresh.ts";

const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
const success = (credit: number): ViewState => ({ kind: "success", credit, lastSuccess: 1 });

test("formats success including true zero; retains cached and stale values, clears unavailable states", () => {
  assert.equal(statusHeaderControl(success(0))[0]?.label, "Cached: $0.00");
  assert.equal(statusHeaderControl({ kind: "loading", previous: 4, lastSuccess: 1 })[0]?.label, "Cached: $4.00");
  assert.equal(statusHeaderControl({ kind: "unavailable", previous: 4, lastSuccess: 1 })[0]?.label, "Stale: $4.00");
  assert.equal(statusHeaderControl({ kind: "invalid", previous: 4, lastSuccess: 1 })[0]?.label, "Stale: $4.00");
  assert.deepEqual(statusHeaderControl({ kind: "disconnected" }), []);
  assert.deepEqual(statusHeaderControl({ kind: "loading" }), []);
  assert.deepEqual(statusHeaderControl({ kind: "invalid" }), []);
  assert.deepEqual(statusHeaderControl({ kind: "unavailable" }), []);
  assert.ok(statusHeaderControl(success(Number.MAX_VALUE))[0]!.label.length <= 60);
});

test("publishes latest account state in order, clears controls, and does not clear on dispose", async () => {
  const sent: string[] = [];
  let finish!: () => void;
  const publisher = createStatusHeaderPublisher(async (controls) => {
    sent.push(controls[0]?.label ?? "clear");
    if (sent.length === 1) await new Promise<void>((resolve) => { finish = resolve; });
  });
  publisher.update(success(3));
  assert.deepEqual(sent, []); // Waits for feature support from onReady.
  publisher.enable(true);
  publisher.update(success(0));
  assert.deepEqual(sent, ["Cached: $3.00"]);
  finish();
  await flush();
  assert.deepEqual(sent, ["Cached: $3.00", "Cached: $0.00"]);
  publisher.update({ kind: "disconnected" });
  await flush();
  assert.deepEqual(sent, ["Cached: $3.00", "Cached: $0.00", "clear"]);
  publisher.update(success(8));
  await flush();
  publisher.dispose();
  assert.equal(sent.at(-1), "Cached: $8.00");
});

test("handles unsupported/rejected control publication without an unhandled rejection", async () => {
  const publisher = createStatusHeaderPublisher(async () => { throw new Error("UNSUPPORTED"); });
  publisher.enable(true);
  publisher.update(success(1));
  await flush();
  publisher.update(success(2));
  await flush();
});
