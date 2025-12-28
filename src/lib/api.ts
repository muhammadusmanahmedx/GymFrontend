export const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function authFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any) };
  const token = localStorage.getItem('gm_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = null; }
  if (!res.ok) {
    const msg = body?.message || body?.error || text || res.statusText || 'Request failed';
    throw new Error(msg);
  }
  return body;
}
