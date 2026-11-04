import test from "node:test";
import assert from "node:assert/strict";
import { AccountResponseError, parseAccountCredit } from "../src/account.ts";

test("uses numeric credit, not balance, and ignores billing and alert settings", () => {
  assert.deepEqual(parseAccountCredit('{"credit":12.34,"balance":900,"autobill_threshold":10,"autobill_amount":20,"credit_alert":5}'), { credit: 12.34, autoTopUp: "Unknown" });
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
