/** Resolve a path under `public/` for any Vite `base` (e.g. GitHub project pages). */
export function publicAsset(relativePath) {
  const base = import.meta.env.BASE_URL || '/';
  const clean = String(relativePath).replace(/^\/+/, '');
  return `${base}${clean}`.replace(/\/{2,}/g, '/');
}
