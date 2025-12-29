import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { API, authFetch } from '@/lib/api';

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  gymName?: string;
  subscriptionStatus?: 'active' | 'blocked';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, gymName?: string) => Promise<void>;
  logout: () => void;
  updateUser?: (patch: Partial<User>) => void;
}

// `API` is imported from `src/lib/api.ts`

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getToken() {
  return localStorage.getItem('gm_token');
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.message || body?.error || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return res.json().catch(() => ({}));
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('gm_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('gm_user', JSON.stringify(user));
    else localStorage.removeItem('gm_user');
  }, [user]);

  const login = async (email: string, password: string) => {
    const data: any = await authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const { accessToken, user: u } = data;
    if (!accessToken) throw new Error('No token returned');
    localStorage.setItem('gm_token', accessToken);
    // write user to localStorage immediately so DataProvider can read gymId
    try {
      localStorage.setItem('gm_user', JSON.stringify(u));
    } catch (e) {
      // ignore
    }
    setUser(u);
    return u;
  };

  const register = async (name: string, email: string, password: string, gymName?: string, gymLocation?: string) => {
    // Call signup endpoint via authFetch to ensure URL normalization
    await authFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, gymName, gymLocation }),
    });

    // After signup, login to obtain token
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('gm_token');
    localStorage.removeItem('gm_user');
    setUser(null);
  };

  const updateUser = (patch: Partial<User>) => {
    setUser((prev) => {
      const next = prev ? { ...prev, ...patch } : (patch as User);
      if (next) localStorage.setItem('gm_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
