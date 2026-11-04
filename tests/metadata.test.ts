import test from "node:test";
import assert from "node:assert/strict";
import { statusMetadata } from "../src/metadata.ts";

const time = (timestamp: number) => `TIME-${timestamp}`;

test("successful metadata contains only the successful update time", () => {
  assert.equal(statusMetadata({ kind: "success", credit: 0, lastSuccess: 1234 }, time), "Updated TIME-1234");
});

test("loading preserves the last successful timestamp and actionable connection guidance", () => {
  assert.equal(statusMetadata({ kind: "loading" }, time), "Refreshing…");
  assert.equal(statusMetadata({ kind: "loading", previous: 0, lastSuccess: 0 }, time), "Last successful refresh TIME-0");
  assert.equal(statusMetadata({ kind: "disconnected" }, time), "Connect Vast.ai in Settings → Integrations.");
});

test("invalid and unavailable metadata retains guidance and successful timestamps without unknown billing text", () => {
  assert.equal(statusMetadata({ kind: "invalid" }, time), "Vast.ai rejected the key. Reconnect in Settings → Integrations.");
  assert.equal(statusMetadata({ kind: "unavailable" }, time), "Could not refresh Vast.ai credit.");
  assert.equal(statusMetadata({ kind: "unavailable", previous: 0, lastSuccess: 1234 }, time), "Could not refresh Vast.ai credit. Last successful refresh TIME-1234.");
  assert.equal(statusMetadata({ kind: "invalid", previous: 0, lastSuccess: 1234 }, time), "Vast.ai rejected the key. Reconnect in Settings → Integrations. Last successful refresh TIME-1234.");
});
