// Use VITE_API_URL when set, otherwise default to deployed backend
export const API = import.meta.env.VITE_API_URL || "https://gymbackendnestjs.vercel.app";

export async function authFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any) };
  const token = localStorage.getItem('gm_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const base = API.replace(/\/$/, '');
  const url = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;

  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (err: any) {
    // network-level error (CORS, DNS, refused connection)
    throw new Error(`Network error: ${err?.message || String(err)}`);
  }

  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = null; }
  if (!res.ok) {
    const msg = body?.message || body?.error || text || res.statusText || 'Request failed';
    throw new Error(msg);
  }
  return body;
}
