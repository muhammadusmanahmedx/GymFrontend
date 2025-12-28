import { authFetch } from '@/lib/api';

export type CreateFeePayload = {
  memberId: string;
  gymId: string;
  amount: number;
  month: string;
  dueDate: string;
};

export async function getFees(memberId?: string, gymId?: string) {
  let params = '';
  if (memberId) params = `?memberId=${encodeURIComponent(memberId)}`;
  else if (gymId) params = `?gymId=${encodeURIComponent(gymId)}`;
  else {
    try {
      const raw = localStorage.getItem('gm_user');
      const user = raw ? JSON.parse(raw) : null;
      const userGym = user?.gymId || user?.gym || null;
      if (userGym) params = `?gymId=${encodeURIComponent(userGym)}`;
    } catch (e) {
      // ignore
    }
  }
  return authFetch(`/fees${params}`, { method: 'GET' });
}

export async function createFee(payload: CreateFeePayload) {
  return authFetch('/fees', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateFee(id: string, payload: Partial<CreateFeePayload & { status?: string; paidDate?: string }>) {
  return authFetch(`/fees/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteFee(id: string) {
  return authFetch(`/fees/${id}`, { method: 'DELETE' });
}
