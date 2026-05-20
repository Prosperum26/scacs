/**
 * Parse CORS_ORIGIN — supports comma-separated list for production
 * (e.g. https://scacs.vercel.app,https://scacs-*.vercel.app via exact URLs).
 */
export const parseCorsOrigins = (raw: string): string[] =>
  raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

export const isOriginAllowed = (origin: string | undefined, allowed: string[]): boolean => {
  if (!origin) return true;
  if (allowed.includes(origin)) return true;
  if (allowed.includes('*')) return true;
  return false;
};
