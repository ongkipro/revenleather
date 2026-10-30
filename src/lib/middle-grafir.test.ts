import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

/**
 * Reven: every landing page is hybrid, so most buyers see the middle form.
 * A grafir request there must never become a COD order — it is saved as a
 * manual transfer and closed by the admin on WhatsApp.
 */

const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("the middle form offers grafir on approved products only", () => {
  const form = source("../components/storefront/forms/FormMiddleContent.astro");
  assert.match(form, /supportsGrafir = isApprovedGrafirSlug\(product\.slug\)/);
  assert.match(form, /supportsGrafir && \(\s*<section class="form-block" data-grafir-block>/);
  assert.match(form, /name="grafir_text"[\s\S]*?maxlength="24"/);
});

test("a middle-form grafir request is sent and saved as a transfer, never COD", () => {
  const script = source("../scripts/form-middle.ts");
  assert.match(script, /const paymentMethod = grafirText \? "manual_transfer" : "cod";/);
  assert.match(script, /payment_method: paymentMethod,\s*grafir_text: grafirText,/);

  const api = source("../pages/api/submit-middle-order.ts");
  assert.match(api, /const paymentMethod = grafirText \? "manual_transfer" : "cod";/);
  assert.match(api, /grafirText\.length > 24/);
  assert.match(api, /paymentMethod,\s*\.\.\.\(sellerBankAccount \? \{ sellerBankAccountId: sellerBankAccount\.id \} : \{\}\),/);
  // The grafir text lives in the order note, so the address sent to the
  // courier stays clean.
  assert.match(api, /customerNote: `Grafir: \$\{grafirText\}`/);
  assert.doesNotMatch(api, /paymentMethod: "cod"/);
});
