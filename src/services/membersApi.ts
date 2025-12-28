import { authFetch } from '@/lib/api';

export type MemberCreate = {
  name: string;
  email: string;
  phone: string;
  gymId?: string;
};

export async function getMembers(gymId?: string) {
  let url = '/members';
  if (gymId) url = `/members?gymId=${encodeURIComponent(gymId)}`;
  else {
    try {
      const raw = localStorage.getItem('gm_user');
      const user = raw ? JSON.parse(raw) : null;
      const userGym = user?.gymId || user?.gym || null;
      if (userGym) url = `/members?gymId=${encodeURIComponent(userGym)}`;
    } catch (e) {
      // ignore
    }
  }
  return authFetch(url, { method: 'GET' });
}

export async function getMember(id: string) {
  return authFetch(`/members/${id}`, { method: 'GET' });
}

export async function createMember(payload: MemberCreate) {
  return authFetch('/members', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateMember(id: string, payload: Partial<MemberCreate>) {
  return authFetch(`/members/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteMember(id: string) {
  return authFetch(`/members/${id}`, { method: 'DELETE' });
}
