import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  gymName: string;
  subscriptionStatus: 'active' | 'blocked';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, gymName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user - in production, this would come from the API
    setUser({
      id: '1',
      name: 'John Doe',
      email: email,
      gymName: 'FitZone Gym',
      subscriptionStatus: 'active',
    });
  };

  const register = async (name: string, email: string, password: string, gymName: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      id: '1',
      name,
      email,
      gymName,
      subscriptionStatus: 'active',
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }}>
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
