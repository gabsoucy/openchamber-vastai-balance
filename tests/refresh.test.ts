import test from "node:test";
import assert from "node:assert/strict";
import { CreditRefresh, type ViewState } from "../src/refresh.ts";

function harness() {
  let visible = true;
  let active = 0;
  let maximum = 0;
  const requests: Array<(value: { status: number; body: string }) => void> = [];
  let timerCallback: (() => void) | undefined;
  let timerCount = 0;
  const states: ViewState[] = [];
  const controller = new CreditRefresh({ request: () => new Promise((resolve) => {
    active++;
    maximum = Math.max(maximum, active);
    requests.push((value) => { active--; resolve(value); });
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
  assert.deepEqual(h.states.at(-1), { kind: "success", credit: 0, lastSuccess: 1234 });
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
  assert.deepEqual(h.states.at(-1), { kind: "success", credit: 4, lastSuccess: 1234 });
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
  assert.deepEqual(h.states.at(-1), { kind: "success", credit: 6, lastSuccess: 1234 });
});

test("distinguishes invalid credentials and unavailable/malformed responses while retaining last success", async () => {
  const h = harness();
  h.controller.connection(true, "user-a");
  h.finish('{"credit":9}'); await flush();
  h.controller.refresh(); h.finish("{}", 200); await flush();
  assert.deepEqual(h.states.at(-1), { kind: "unavailable", previous: 9, lastSuccess: 1234 });
  h.controller.refresh(); h.finish("", 401); await flush();
  assert.deepEqual(h.states.at(-1), { kind: "invalid", previous: 9, lastSuccess: 1234 });
  h.controller.connection(false, "user-a");
  assert.deepEqual(h.states.at(-1), { kind: "disconnected" });
});
