import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as membersApi from '@/services/membersApi';
import * as feesApi from '@/services/feesApi';
import * as expensesApi from '@/services/expensesApi';

type DataContextType = {
  members: any[];
  fees: any[];
  expenses: any[];
  loading: boolean;
  refreshAll: () => Promise<void>;
  refreshMembers: () => Promise<void>;
  createMember: (payload: any) => Promise<any>;
  updateMember: (id: string, payload: any) => Promise<any>;
  deleteMember: (id: string) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const MEMBERS_KEY = 'gm_cache_members';
const FEES_KEY = 'gm_cache_fees';
const EXPENSES_KEY = 'gm_cache_expenses';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem(MEMBERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [fees, setFees] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem(FEES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [expenses, setExpenses] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem(EXPENSES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  const persist = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      // ignore
    }
  };

  const refreshMembers = async () => {
    try {
      const data = await membersApi.getMembers();
      setMembers(Array.isArray(data) ? data : []);
      persist(MEMBERS_KEY, data);
    } catch (e) {
      console.error('DataProvider.refreshMembers error', e);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    try {
      // fetch members first (critical for scoping), then fees and expenses
      const m = await membersApi.getMembers();
      setMembers(Array.isArray(m) ? m : []);
      persist(MEMBERS_KEY, m);

      const f = await feesApi.getFees();
      setFees(Array.isArray(f) ? f : []);
      persist(FEES_KEY, f);

      const ex = await expensesApi.getExpenses();
      setExpenses(Array.isArray(ex) ? ex : []);
      persist(EXPENSES_KEY, ex);
    } catch (e) {
      console.error('DataProvider.refreshAll failed', e);
      throw e; // bubble to caller (auth) so it can decide whether to proceed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // background refresh after mount
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createMember = async (payload: any) => {
    const created = await membersApi.createMember(payload);
    setMembers((prev) => {
      const next = [...prev, created];
      persist(MEMBERS_KEY, next);
      return next;
    });
    return created;
  };

  const updateMember = async (id: string, payload: any) => {
    const updated = await membersApi.updateMember(id, payload);
    setMembers((prev) => {
      const next = prev.map((m) => (m._id === id || m.id === id ? updated : m));
      persist(MEMBERS_KEY, next);
      return next;
    });
    return updated;
  };

  const deleteMember = async (id: string) => {
    await membersApi.deleteMember(id);
    setMembers((prev) => {
      const next = prev.filter((m) => m._id !== id && m.id !== id);
      persist(MEMBERS_KEY, next);
      return next;
    });
  };

  return (
    <DataContext.Provider value={{ members, fees, expenses, loading, refreshAll, refreshMembers, createMember, updateMember, deleteMember }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};

export default DataContext;
