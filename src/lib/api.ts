// Use VITE_API_URL when set, otherwise default to deployed backend
export const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function authFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any) };
  const token = localStorage.getItem('gm_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const base = API.replace(/\/$/, '');
  const url = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
  console.debug('[authFetch] Request ->', url, options);

  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (err: any) {
    // network-level error (CORS, DNS, refused connection)
    console.error('[authFetch] Network error:', err);
    throw new Error(`Network error: ${err?.message || String(err)}`);
  }

  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = null; }

  console.debug('[authFetch] Response <-', { url, status: res.status, body: body ?? text });

  if (!res.ok) {
    const msg = body?.message || body?.error || text || res.statusText || 'Request failed';
    // If the token is invalid/expired, clear local storage and force redirect to auth
    if (res.status === 401) {
      try {
        localStorage.removeItem('gm_token');
        localStorage.removeItem('gm_user');
      } catch (e) {
        // ignore
      }
      // Redirecting to the auth screen so the app can re-authenticate the user
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
      throw new Error(msg);
    }
    throw new Error(msg);
  }
  return body;
}
