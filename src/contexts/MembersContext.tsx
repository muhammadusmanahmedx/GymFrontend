import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as membersApi from '@/services/membersApi';
import { useToast } from '@/hooks/use-toast';

type Member = any;

type MembersContextType = {
  members: Member[];
  loading: boolean;
  refresh: () => Promise<void>;
  create: (payload: any) => Promise<Member>;
  update: (id: string, payload: any) => Promise<Member>;
  remove: (id: string) => Promise<void>;
};

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export const MembersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await membersApi.getMembers();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to load members', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const create = async (payload: any) => {
    const m = await membersApi.createMember(payload);
    setMembers((prev) => [...prev, m]);
    return m;
  };

  const update = async (id: string, payload: any) => {
    const updated = await membersApi.updateMember(id, payload);
    setMembers((prev) => prev.map((p) => (p._id === id || p.id === id ? updated : p)));
    return updated;
  };

  const remove = async (id: string) => {
    await membersApi.deleteMember(id);
    setMembers((prev) => prev.filter((p) => p._id !== id && p.id !== id));
  };

  return (
    <MembersContext.Provider value={{ members, loading, refresh, create, update, remove }}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembers = () => {
  const ctx = useContext(MembersContext);
  if (!ctx) throw new Error('useMembers must be used within MembersProvider');
  return ctx;
};
