import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

/**
 * Reven: every landing page is hybrid, so most buyers see the middle form.
 * Picking Gratis Grafir there swaps it, in place, for the full form (district,
 * shipping, transfer only); the middle form itself stays COD.
 */

const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("the middle form offers the grafir choice on approved products only, without taking the text", () => {
  const form = source("../components/storefront/forms/FormMiddleContent.astro");
  assert.match(form, /supportsGrafir = isApprovedGrafirSlug\(product\.slug\)/);
  assert.match(form, /supportsGrafir && \(\s*<section class="form-block" data-grafir-block>/);
  assert.match(form, /name="grafir_choice" value="custom"/);
  assert.doesNotMatch(form, /name="grafir_text"/);
});

test("the full form waits inert beside the middle form for approved grafir products", () => {
  const resolved = source("../components/storefront/forms/GeoIpResolvedForm.astro");
  assert.match(resolved, /grafirFullForm = resolvedMode !== 'full' && isApprovedGrafirSlug\(productSlug\)/);
  assert.match(resolved, /grafirFullForm && \(\s*<template data-grafir-full-form>\s*<FormHybridContent/);
});

test("picking grafir swaps to the full form; the middle form never sends grafir", () => {
  const script = source("../scripts/form-middle.ts");
  assert.match(script, /radio\.value === "custom"\) void showGrafirFullForm\(\)/);
  assert.match(script, /await import\("\.\/form-hybrid"\)/);
  assert.match(script, /setGrafirChoice\(grafirFullRoot, "custom"\)/);
  // "Tanpa Grafir" on the full form swaps back to the COD form.
  assert.match(script, /target\.value !== "none"\) return;[\s\S]*?formRoot\.hidden = false;/);
  // A failed swap must not leave the buyer on the COD form.
  assert.match(script, /window\.location\.assign\(\s*`\/full-form\?product_id=/);
  assert.match(script, /payment_method: "cod",/);
  assert.doesNotMatch(script, /grafir_text/);

  // A cached page that still posts grafir is redirected, never saved as COD.
  const api = source("../pages/api/submit-middle-order.ts");
  assert.match(api, /if \(String\(body\.grafir_text \|\| ""\)\.trim\(\)\)\s*return json\([\s\S]*?code: "AREA_REQUIRES_FULL"/);
  assert.match(api, /paymentMethod: "cod"/);
});

test("the full form the swap lands on takes grafir and never offers COD with it", () => {
  // An AdsBookCMS release that overwrites these files drops grafir from the
  // full form while the middle form still swaps to it; this catches that.
  const form = source("../components/storefront/forms/FormHybridContent.astro");
  assert.match(form, /supportsGrafir = isApprovedGrafirSlug\(product\.slug\)/);
  assert.match(form, /name="grafir_choice"/);
  assert.match(form, /name="grafir_text"/);

  const script = source("../scripts/form-hybrid.ts");
  assert.match(script, /const codDisabled = isCodDisabledByProvince\(\) \|\| isGrafirRequested\(\);/);
  assert.match(script, /const customerNote = grafirNote \? `Grafir: \$\{grafirNote\}` : "";/);
});
