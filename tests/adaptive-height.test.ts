import test from "node:test";
import assert from "node:assert/strict";
import { observeAdaptiveHeight } from "../src/adaptive-height.ts";

class FakeObserver {
  static current: FakeObserver;
  callback: ResizeObserverCallback;
  disconnected = false;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    FakeObserver.current = this;
  }
  observe() {}
  disconnect() { this.disconnected = true; }
  trigger() { this.callback([], this as unknown as ResizeObserver); }
}

const flush = async () => { await Promise.resolve(); await Promise.resolve(); };

test("measures the content box with padding and coalesces resize requests", async () => {
  let contentHeight = 40;
  const requests: number[] = [];
  let resolveFirst!: () => void;
  const layout = observeAdaptiveHeight(
    { getBoundingClientRect: () => ({ height: contentHeight }) } as HTMLElement,
    (height) => {
      requests.push(height);
      return requests.length === 1 ? new Promise<void>((resolve) => { resolveFirst = resolve; }) : Promise.resolve();
    },
    FakeObserver as unknown as typeof ResizeObserver,
  );

  assert.deepEqual(requests, [48]); // Initial measurement does not await an observer delivery.
  FakeObserver.current.trigger();
  assert.deepEqual(requests, [48]);
  contentHeight = 62;
  FakeObserver.current.trigger();
  contentHeight = 80;
  FakeObserver.current.trigger();
  assert.deepEqual(requests, [48]);
  resolveFirst();
  await flush();
  assert.deepEqual(requests, [48, 88]);
  layout.dispose();
  assert.equal(FakeObserver.current.disconnected, true);
});

test("explicit render/resize measurements work without observer delivery", async () => {
  let contentHeight = 40;
  const requests: number[] = [];
  const layout = observeAdaptiveHeight(
    { getBoundingClientRect: () => ({ height: contentHeight }) } as HTMLElement,
    async (height) => { requests.push(height); },
    FakeObserver as unknown as typeof ResizeObserver,
  );
  await flush();
  contentHeight = 110;
  layout.measure();
  await flush();
  contentHeight = 60;
  layout.measure();
  assert.deepEqual(requests, [48, 118, 68]);
  layout.dispose();
});

test("does not request the same size twice and ignores later observations after disposal", () => {
  const requests: number[] = [];
  let contentHeight = 30;
  const layout = observeAdaptiveHeight(
    { getBoundingClientRect: () => ({ height: contentHeight }) } as HTMLElement,
    async (height) => { requests.push(height); },
    FakeObserver as unknown as typeof ResizeObserver,
  );
  FakeObserver.current.trigger();
  FakeObserver.current.trigger();
  assert.deepEqual(requests, [38]);
  layout.dispose();
  contentHeight = 80;
  FakeObserver.current.trigger();
  assert.deepEqual(requests, [38]);
  assert.equal(FakeObserver.current.disconnected, true);
});
