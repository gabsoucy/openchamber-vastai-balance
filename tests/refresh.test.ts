import test from "node:test";
import assert from "node:assert/strict";
import { HostRequestError } from "@openchamber/sdk";
import { CreditRefresh, type ViewState } from "../src/refresh.ts";

function harness() {
  let visible = true;
  let active = 0;
  let maximum = 0;
  const requests: Array<(value: { status: number; body: string }) => void> = [];
  const rejectors: Array<(error: unknown) => void> = [];
  let timerCallback: (() => void) | undefined;
  let timerCount = 0;
  const states: ViewState[] = [];
  const controller = new CreditRefresh({ request: () => new Promise((resolve, reject) => {
    active++;
    maximum = Math.max(maximum, active);
    requests.push((value) => { active--; resolve(value); });
    rejectors.push((error) => { active--; reject(error); });
  }) }, (state) => states.push(state), () => 1234, {
    visible: () => visible,
    every: (callback) => { timerCallback = callback; timerCount++; return timerCount as ReturnType<typeof setInterval>; },
    cancel: () => { timerCount--; timerCallback = undefined; },
  });
  return {
    controller, states, requests,
    visibility(value: boolean) { visible = value; controller.visibilityChanged(); },
    tick() { timerCallback?.(); },
    get active() { return active; }, get maximum() { return maximum; }, get timerCount() { return timerCount; },
    finish(body = '{"credit":0}', status = 200, index = requests.length - 1) { requests[index]?.({ status, body }); },
    reject(error: unknown, index = rejectors.length - 1) { rejectors[index]?.(error); },
  };
}

const flush = async () => { await Promise.resolve(); await Promise.resolve(); };

test("initial state is disconnected before the host connection snapshot arrives", () => {
  const h = harness();
  assert.deepEqual(h.states[0], { kind: "disconnected" });
  h.controller.connection(false, "");
  assert.equal(h.states.length, 1);
});

test("avoids replay refetches and overlapping calls; supports manual/timed refresh", async () => {
  const h = harness();
  h.controller.connection(true, "user-a");
  h.controller.connection(true, "user-a");
  h.controller.refresh();
  assert.equal(h.active, 1);
  assert.equal(h.timerCount, 1);
  h.finish(); await flush();
  assert.deepEqual(h.states.at(-1), { kind: "success", credit: 0, lastSuccess: 1234, autoTopUp: { kind: "unknown" } });
  h.tick();
  assert.equal(h.active, 1);
  h.finish('{"credit":8}'); await flush();
  assert.equal(h.maximum, 1);
  assert.equal(h.states.at(-1)?.kind, "success");
});

test("account changes clear state and ignore obsolete in-flight responses", async () => {
  const h = harness();
  h.controller.connection(true, "user-a");
  h.controller.connection(true, "user-b");
  assert.equal(h.states.at(-1)?.kind, "loading");
  assert.equal(h.active, 1);
  h.finish('{"credit":55}', 200, 0); await flush();
  assert.equal(h.active, 1);
  h.finish('{"credit":4}', 200, 1); await flush();
  assert.deepEqual(h.states.at(-1), { kind: "success", credit: 4, lastSuccess: 1234, autoTopUp: { kind: "unknown" } });
});

test("visibility stops periodic work, refreshes on return, and dispose ignores pending results", async () => {
  const h = harness();
  h.controller.connection(true, "user-a");
  h.visibility(false);
  assert.equal(h.timerCount, 0);
  h.finish('{"credit":1}'); await flush();
  h.visibility(true);
  assert.equal(h.active, 1);
  h.controller.dispose();
  h.finish('{"credit":2}'); await flush();
  assert.notEqual(h.states.at(-1)?.kind, "success");
  assert.equal(h.timerCount, 0);
});

test("does not overlap a request across hide/show and refreshes after the old request settles", async () => {
  const h = harness();
  h.controller.connection(true, "user-a");
  h.visibility(false);
  h.visibility(true);
  assert.equal(h.active, 1);
  h.finish('{"credit":3}', 200, 0);
  await flush();
  assert.equal(h.active, 1);
  h.finish('{"credit":6}', 200, 1);
  await flush();
  assert.equal(h.maximum, 1);
  assert.deepEqual(h.states.at(-1), { kind: "success", credit: 6, lastSuccess: 1234, autoTopUp: { kind: "unknown" } });
});

test("distinguishes invalid credentials and unavailable/malformed responses while retaining last success", async () => {
  const h = harness();
  h.controller.connection(true, "user-a");
  h.finish('{"credit":9}'); await flush();
  h.controller.refresh(); h.finish("{}", 200); await flush();
  assert.deepEqual(h.states.at(-1), { kind: "unavailable", previous: 9, lastSuccess: 1234 });
  h.controller.refresh(); h.finish("", 403); await flush();
  assert.deepEqual(h.states.at(-1), { kind: "invalid", previous: 9, lastSuccess: 1234 });
  h.controller.connection(false, "user-a");
  assert.deepEqual(h.states.at(-1), { kind: "disconnected" });
});

test("native DISCONNECTED rejection remains actionable after the ensuing disconnected snapshot", async () => {
  const h = harness();
  h.controller.connection(true, "user-a");
  h.finish('{"credit":9}'); await flush();
  h.controller.refresh();
  h.reject(new HostRequestError("DISCONNECTED", "Not connected.")); await flush();
  assert.deepEqual(h.states.at(-1), { kind: "invalid" });
  assert.equal(h.timerCount, 0);
  h.controller.connection(false, "");
  assert.deepEqual(h.states.at(-1), { kind: "invalid" });
  h.controller.connection(false, "");
  assert.deepEqual(h.states.at(-1), { kind: "invalid" });
  h.controller.connection(true, "user-a");
  assert.equal(h.states.at(-1)?.kind, "loading");
  h.finish('{"credit":2}'); await flush();
  assert.deepEqual(h.states.at(-1), { kind: "success", credit: 2, lastSuccess: 1234, autoTopUp: { kind: "unknown" } });
});

test("explicit disconnect during a pending request stays ordinary and ignores its rejection", async () => {
  const h = harness();
  h.controller.connection(true, "user-a");
  h.controller.connection(false, "");
  h.reject(new HostRequestError("DISCONNECTED", "Not connected.")); await flush();
  assert.deepEqual(h.states.at(-1), { kind: "disconnected" });
  assert.equal(h.timerCount, 0);
});

test("generic rejected requests remain unavailable with the last successful value", async () => {
  const h = harness();
  h.controller.connection(true, "user-a");
  h.finish('{"credit":7}'); await flush();
  h.controller.refresh();
  h.reject(new Error("network unavailable")); await flush();
  assert.deepEqual(h.states.at(-1), { kind: "unavailable", previous: 7, lastSuccess: 1234 });
});

test("obsolete DISCONNECTED rejections after account switch, hide, or dispose cannot set invalid", async () => {
  const switched = harness();
  switched.controller.connection(true, "user-a");
  switched.controller.connection(true, "user-b");
  switched.reject(new HostRequestError("DISCONNECTED", "Not connected."), 0); await flush();
  assert.notEqual(switched.states.at(-1)?.kind, "invalid");
  switched.controller.dispose();

  const hidden = harness();
  hidden.controller.connection(true, "user-a");
  hidden.visibility(false);
  hidden.reject(new HostRequestError("DISCONNECTED", "Not connected.")); await flush();
  assert.notEqual(hidden.states.at(-1)?.kind, "invalid");

  const disposed = harness();
  disposed.controller.connection(true, "user-a");
  disposed.controller.dispose();
  disposed.reject(new HostRequestError("DISCONNECTED", "Not connected.")); await flush();
  assert.notEqual(disposed.states.at(-1)?.kind, "invalid");
});
