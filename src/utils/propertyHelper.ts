import { Property } from '../types/property';

/**
 * Deduplicate property list by canonical ID and property identity fingerprint
 * Lightweight pure-JS utility without any heavy dependencies to keep initial bundle ultra-fast.
 */
export const deduplicatePropertyList = (list: Property[]): Property[] => {
  if (!list || !Array.isArray(list)) return [];
  const seenIds = new Set<string>();
  const seenFingerprints = new Set<string>();
  const result: Property[] = [];

  for (const prop of list) {
    if (!prop || !prop.id) continue;
    if (seenIds.has(prop.id)) continue;

    // Build unique fingerprint based on property content
    const title = (prop.title || '').trim().toLowerCase();
    const city = (prop.city || '').trim().toLowerCase();
    const loc = (prop.locality || '').trim().toLowerCase();
    const price = (prop.priceDisplay || prop.price || '').toString().trim().toLowerCase();
    const fp = `${title}|${city}|${loc}|${price}`;

    if (fp.length > 6 && seenFingerprints.has(fp)) {
      // Duplicate listing with different ID - skip duplicate
      continue;
    }

    seenIds.add(prop.id);
    if (fp.length > 6) {
      seenFingerprints.add(fp);
    }
    result.push(prop);
  }

  return result;
};
