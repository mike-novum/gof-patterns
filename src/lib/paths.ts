/**
 * Помощник для построения URL с учётом base path (GitHub Pages project site).
 *
 * Использование:
 *   <a href={url('/patterns/singleton/')}>
 *
 * На локальном dev base = '/gof-patterns/', на продакшене — то же самое.
 * Внешние URL (http://...) и якоря (#...) возвращаются как есть.
 */
export const BASE_URL = import.meta.env.BASE_URL;

export function url(path: string): string {
  if (!path) return BASE_URL;
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith('#')) return path;
  if (path.startsWith('mailto:') || path.startsWith('tel:')) return path;

  const clean = path.startsWith('/') ? path : '/' + path;
  // BASE_URL всегда заканчивается на '/', убираем его чтобы не было двойного
  const base = BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/';
  return base + clean.replace(/^\//, '');
}
