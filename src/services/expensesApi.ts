import { authFetch } from '@/lib/api';

export type CreateExpensePayload = {
  gymId: string;
  description: string;
  amount: number;
  category: string;
  date: string; // ISO date
};

export async function getExpenses(gymId?: string) {
  let url = '/expenses';
  if (gymId) url = `/expenses?gymId=${encodeURIComponent(gymId)}`;
  else {
    try {
      const raw = localStorage.getItem('gm_user');
      const user = raw ? JSON.parse(raw) : null;
      const userGym = user?.gymId || user?.gym || null;
      if (userGym) url = `/expenses?gymId=${encodeURIComponent(userGym)}`;
    } catch (e) {
      // ignore
    }
  }
  return authFetch(url, { method: 'GET' });
}

export async function getExpense(id: string) {
  return authFetch(`/expenses/${id}`, { method: 'GET' });
}

export async function createExpense(payload: CreateExpensePayload) {
  return authFetch('/expenses', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateExpense(id: string, payload: Partial<CreateExpensePayload>) {
  return authFetch(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteExpense(id: string) {
  return authFetch(`/expenses/${id}`, { method: 'DELETE' });
}
