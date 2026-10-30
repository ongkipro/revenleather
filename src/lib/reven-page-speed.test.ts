import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("gtag waits for the Meta pixel's slot to pass, the pixel does not wait", () => {
  // Reven page speed (2026-10-30): Meta keeps 2.5 s for its ad-delivery
  // signal; Google remarketing moves to 6 s so the two never load together.
  assert.match(source("../components/storefront/tracking/GoogleAdsBase.astro"), /setTimeout\(loadGtag, 6000\)/);
  assert.match(source("../components/storefront/tracking/MetaPixelBase.astro"), /setTimeout\(loadPixel, 2500\)/);
});
