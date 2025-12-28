import React, { createContext, useContext, ReactNode } from 'react';
import { useData } from '@/contexts/DataContext';
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
  const { members, loading, refreshMembers, createMember, updateMember, deleteMember } = useData();
  const { toast } = useToast();

  // surface a small wrapper so existing consumers keep the same API
  const refresh = async () => {
    try {
      await refreshMembers();
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to load members', variant: 'destructive' });
    }
  };

  const create = async (payload: any) => createMember(payload);
  const update = async (id: string, payload: any) => updateMember(id, payload);
  const remove = async (id: string) => deleteMember(id);

  return <MembersContext.Provider value={{ members, loading, refresh, create, update, remove }}>{children}</MembersContext.Provider>;
};

export const useMembers = () => {
  const ctx = useContext(MembersContext);
  if (!ctx) throw new Error('useMembers must be used within MembersProvider');
  return ctx;
};
