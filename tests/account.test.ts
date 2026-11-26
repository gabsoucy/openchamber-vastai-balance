import test from "node:test";
import assert from "node:assert/strict";
import { AccountResponseError, autoTopUpSummary, parseAccountCredit } from "../src/account.ts";

test("uses numeric credit, not balance", () => {
  assert.equal(parseAccountCredit('{"credit":12.34,"balance":900}').credit, 12.34);
});

test("auto-top-up: on only with a card and a threshold and amount", () => {
  const read = (fields: object) => parseAccountCredit(JSON.stringify({ credit: 1, ...fields })).autoTopUp;
  assert.deepEqual(read({ has_billing: true, autobill_threshold: 10, autobill_amount: 20 }), { kind: "on", threshold: 10, amount: 20 });
  assert.deepEqual(read({ has_billing: false, autobill_threshold: 10, autobill_amount: 20 }), { kind: "off" });
  assert.deepEqual(read({ has_billing: true, autobill_threshold: null, autobill_amount: null }), { kind: "off" });
  assert.deepEqual(read({ has_billing: true, autobill_threshold: 10, autobill_amount: 0 }), { kind: "off" });
  assert.deepEqual(read({ autobill_threshold: 10, autobill_amount: 20 }), { kind: "unknown" });
  assert.deepEqual(read({ has_billing: true, autobill_threshold: "10", autobill_amount: 20 }), { kind: "unknown" });
});

test("auto-top-up text", () => {
  const money = (value: number) => `$${value}`;
  assert.equal(autoTopUpSummary({ kind: "on", threshold: 10, amount: 20 }, money), "Auto-top-up +$20 below $10");
  assert.equal(autoTopUpSummary({ kind: "off" }, money), "Auto-top-up off");
  assert.equal(autoTopUpSummary({ kind: "unknown" }, money), undefined);
});

test("preserves real zero and accepts finite negative credit", () => {
  assert.equal(parseAccountCredit('{"credit":0,"balance":99}').credit, 0);
  assert.equal(parseAccountCredit('{"credit":-2.5}').credit, -2.5);
});

test("rejects missing, null, string, non-finite, malformed and invalid root values", () => {
  for (const body of ["{", "null", "[]", '"account"', "42", "{}", '{"credit":null}', '{"credit":"0"}', '{"credit":1e400}']) {
    assert.throws(() => parseAccountCredit(body), AccountResponseError, body);
  }
});
