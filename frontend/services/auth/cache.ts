type AuthCache = {
  csrfToken: string;
  isSignedIn: boolean;
  expiresAt: number;
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5分

let cache: AuthCache | null = null;

export function getAuthCache(): AuthCache | null {
  if (!cache) return null;
  if (Date.now() > cache.expiresAt) {
    cache = null;
    return null;
  }
  return cache;
}

export function setAuthCache(csrfToken: string, isSignedIn: boolean): void {
  cache = {
    csrfToken,
    isSignedIn,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
}

export function invalidateAuthCache(): void {
  cache = null;
}
