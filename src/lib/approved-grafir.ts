/**
 * Canonical set of 33 Reven Leather product/landing-page slugs approved for
 * complimentary custom laser engraving (Gratis Grafir Nama / Inisial / Logo),
 * mapped from the 28 validated reference photos in `letak grafir tas`.
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
  'reven-adam-clutch-bag',
  'reven-angkara-multibag',
  'reven-ardana-multibag',
  'reven-asgard-leather-laptop-bag',
  'reven-darius-clutch-bag',
  'reven-frontier-bag',
  'reven-futura-multibag',
  'reven-gio-handbag',
  'reven-sadewa-multibag',
  'yudistira-sling-bag',
]);

export function isApprovedGrafirSlug(slug: string | undefined | null): boolean {
  if (!slug) return false;
  return APPROVED_GRAFIR_SLUGS.has(slug.trim().toLowerCase());
}
