import { base, resolve } from '$app/paths';

/** Typed `resolve()` wrapper for dynamic string paths from data/props. */
export function appResolve(path: string): string {
	return (resolve as unknown as (route: string) => string)(path);
}

/** Normalize pathname for tab matching (respects `paths.base` in production). */
export function normalizePathname(pathname: string): string {
	let p = pathname;
	if (base && p.startsWith(base)) {
		p = p.slice(base.length) || '/';
	}
	if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
	return p || '/';
}

export function pathStartsWith(pathname: string, prefix: string): boolean {
	const n = normalizePathname(pathname);
	return n === prefix || n.startsWith(`${prefix}/`);
}
