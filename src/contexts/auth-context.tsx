'use client';

import type { User, UserRole } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  users: User[]; // All available users for login selector
  login: (userId: string) => void;
  signup: (
    name: string,
    email: string,
    role: UserRole
  ) => { success: boolean; message?: string };
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers); // Manage users in state
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // On initial load, try to log in the user from localStorage
    const storedUserId = localStorage.getItem('skillmatch-user-id');
    if (storedUserId) {
      // Find user in the initial mock user list
      const foundUser = mockUsers.find((u) => u.id === storedUserId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setLoading(false);
  }, []);

  const login = (userId: string) => {
    // Find user from the dynamic list of users in state
    const foundUser = users.find((u) => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('skillmatch-user-id', userId);
      router.push('/dashboard');
    }
  };

  const signup = (
    name: string,
    email: string,
    role: UserRole
  ): { success: boolean; message?: string } => {
    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      return {
        success: false,
        message: 'An account with this email already exists.',
      };
    }

    // Create a new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      profile: {
        avatarUrl: `https://picsum.photos/seed/${name}/100/100`,
      },
    };

    // If company, create a mock companyId
    if (role === 'company') {
      newUser.companyId = `company-${Date.now()}`;
    }

    setUsers((prevUsers) => [...prevUsers, newUser]);
    setUser(newUser);
    localStorage.setItem('skillmatch-user-id', newUser.id);
    router.push('/dashboard');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skillmatch-user-id');
    router.push('/login');
  };

  useEffect(() => {
    if (loading) return;

    const isAuthPath = pathname === '/login' || pathname === '/signup';
    // If user is not logged in and not on an auth path, redirect to login
    if (!user && !isAuthPath) {
      router.push('/login');
    }
    // If user is logged in and on an auth path, redirect to their dashboard
    if (user && isAuthPath) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider
      value={{ user, users, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
