/**
 * Canonical set of 33 Reven Leather product/landing-page slugs approved for
 * complimentary custom laser engraving (Gratis Grafir Nama / Inisial / Logo),
 * mapped from the 28 validated reference photos in `letak grafir tas`.
 * Includes both `landing_pages.slug` and `products.slug` forms.
 */
export const APPROVED_GRAFIR_SLUGS: ReadonlySet<string> = new Set([
  'ammar-sling-bag',
  'barry-sling-bag',
  'benicio-handbag',
  'bima-sling-bag',
  'bonature-sling-bag',
  'diamante-handbag',
  'greyson-handbag-clutch',
  'hazar-waist-bag',
  'helsinki-leather-laptop-bag',
  'ironhide-pouch',
  'jayatra-handbag',
  'key-holder-sling-bag',
  'khalid-clutch',
  'khalid-pouch',
  'lisbon-handbag',
  'magnus-multibag',
  'mahameru-waist-bag',
  'mahesa-multibag',
  'marque-sling-bag',
  'matthew-handbag',
  'nakula-pouch-bag',
  'nayaka-pouch',
  'oslo',
  'oslo-sling-bag',
  'reven-adam-clutch-bag',
  'adam-clutch-bag',
  'reven-angkara-multibag',
  'angkara-multibag',
  'reven-ardana-multibag',
  'ardana-multibag',
  'reven-asgard-leather-laptop-bag',
  'asgard-leather-laptop-bag',
  'reven-darius-clutch-bag',
  'darius-clutch-bag',
  'reven-frontier-bag',
  'frontier-bag',
  'reven-futura-multibag',
  'futura-multibag',
  'reven-gio-handbag',
  'gio-handbag',
  'reven-sadewa-multibag',
  'sadewa-multibag',
  'yudistira-sling-bag',
]);

export function isApprovedGrafirSlug(slug: string | undefined | null): boolean {
  if (!slug) return false;
  const clean = slug.trim().toLowerCase();
  return APPROVED_GRAFIR_SLUGS.has(clean) || APPROVED_GRAFIR_SLUGS.has(clean.replace(/^reven-/, ''));
}
