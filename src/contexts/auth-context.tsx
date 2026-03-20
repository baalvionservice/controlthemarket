'use client';

import type { User, UserRole, Company } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { mockUsers, mockCompanies } from '@/lib/mock-data';

interface SignupDetails {
  name: string;
  email: string;
  role: UserRole;
  // Candidate fields
  skills?: string[];
  // Company fields
  companyName?: string;
  companyDescription?: string;
  companyWebsite?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[]; // All available users for login selector
  companies: Company[];
  login: (userId: string) => void;
  signup: (details: SignupDetails) => { success: boolean; message?: string };
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
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
    details: SignupDetails
  ): { success: boolean; message?: string } => {
    // Check if user already exists
    if (users.some((u) => u.email === details.email)) {
      return {
        success: false,
        message: 'An account with this email already exists.',
      };
    }

    const userId = `user-${Date.now()}`;
    const newUser: User = {
      id: userId,
      name: details.name,
      email: details.email,
      role: details.role,
      profile: {
        avatarUrl: `https://picsum.photos/seed/${userId}/100/100`,
      },
    };

    if (details.role === 'candidate') {
        newUser.profile!.skills = details.skills || [];
    }
    
    if (details.role === 'company' && details.companyName) {
      const newCompany: Company = {
        id: `company-${Date.now()}`,
        name: details.companyName,
        description: details.companyDescription || 'No description provided.',
        ownerId: newUser.id,
        website: details.companyWebsite,
      };
      setCompanies((prevCompanies) => [...prevCompanies, newCompany]);
      newUser.companyId = newCompany.id;
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

    const isAuthPath = pathname.startsWith('/login') || pathname.startsWith('/signup');
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
      value={{ user, users, companies, login, signup, logout, loading }}
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
