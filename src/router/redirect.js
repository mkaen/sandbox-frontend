const DEFAULT_REDIRECT = '/';
const NON_REDIRECT_ROUTE_NAMES = new Set(['login', 'register-user', 'not-found']);

export function buildLoginLocation(fullPath) {
    return { path: '/login', query: { redirect: fullPath } };
}

// The redirect query is user-controlled input: only accept in-app paths that
// resolve to a real, non-auth route, otherwise fall back to the default.
export function resolveSafeRedirect(router, redirect) {
    const isInternalPath =
        typeof redirect === 'string' &&
        redirect.startsWith('/') &&
        !redirect.startsWith('//') &&
        !redirect.includes('\\');

    if (!isInternalPath) {
        return DEFAULT_REDIRECT;
    }

    const resolved = router.resolve(redirect);
    if (NON_REDIRECT_ROUTE_NAMES.has(resolved.name)) {
        return DEFAULT_REDIRECT;
    }

    return resolved.fullPath;
}
