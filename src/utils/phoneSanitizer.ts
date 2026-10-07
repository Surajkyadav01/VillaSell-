import { BRAND_CONFIG } from '../data/brandConfig';

/**
 * Checks if a given phone number belongs to the website owner / admin helpline
 * (e.g. +91 8383826205 or any variations).
 */
export const isHelplineOrAdminPhone = (p?: string | null): boolean => {
  if (!p) return true;
  const trimmed = p.trim();
  if (!trimmed) return true;

  // Exact comparison with brand config values
  if (
    trimmed === BRAND_CONFIG.phone ||
    trimmed === BRAND_CONFIG.phoneClean ||
    trimmed === '+91 83838 26205' ||
    trimmed === '+918383826205' ||
    trimmed === '+91 8383826205' ||
    trimmed === '8383826205'
  ) {
    return true;
  }

  // Digits-only pattern matching for helpline 8383826205
  const digits = trimmed.replace(/\D/g, '');
  if (digits.includes('8383826205') || digits === '8383826205' || digits === '918383826205') {
    return true;
  }

  return false;
};

/**
 * Sanitizes a user phone number:
 * - If it is empty, null, or matches the admin/helpline number, returns empty string ''.
 * - Only genuine personal phone numbers entered by the user are preserved.
 */
export const sanitizeUserPhone = (p?: string | null): string => {
  if (!p) return '';
  if (isHelplineOrAdminPhone(p)) return '';
  return p.trim();
};

/**
 * Resolves full name from display name or email:
 * Returns the account's actual name, or derives a clean formatted name from email.
 */
export const resolveUserDisplayName = (name?: string | null, email?: string | null): string => {
  if (name && name.trim()) {
    return name.trim();
  }
  if (email && email.trim() && email.includes('@')) {
    const raw = email.split('@')[0];
    // Clean up dots, underscores, numbers if needed or format with title case
    const formatted = raw
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return formatted || 'User';
  }
  return 'User';
};
