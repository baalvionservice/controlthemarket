'use client';

import type { User, UserRole, Company } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { mockUsers, mockCompanies } from '@/lib/mock-data';

export interface LoginCredentials {
  email: string;
  password?: string; // Password check is mocked
}

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

interface AuthResult {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  companies: Company[];
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  signup: (details: SignupDetails) => AuthResult;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const getInitialState = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return fallback;
  }
};


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => getInitialState('skillmatch-users', mockUsers));
  const [companies, setCompanies] = useState<Company[]>(() => getInitialState('skillmatch-companies', mockCompanies));
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    localStorage.setItem('skillmatch-users', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem('skillmatch-companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    // On initial load, try to log in the user from localStorage
    const storedUserId = localStorage.getItem('skillmatch-user-id');
    if (storedUserId) {
      const foundUser = users.find((u) => u.id === storedUserId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // This should only run once on initial load

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    // Artificial delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());
    
    if (foundUser) {
      // In a real app, you'd also verify the password here.
      setUser(foundUser);
      localStorage.setItem('skillmatch-user-id', foundUser.id);
      router.push('/dashboard');
      return { success: true };
    } else {
      return { success: false, message: 'Invalid email or password.' };
    }
  };

  const signup = (
    details: SignupDetails
  ): AuthResult => {
    // Check if user already exists
    if (users.some((u) => u.email.toLowerCase() === details.email.toLowerCase())) {
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
      createdAt: new Date().toISOString(),
      isActive: true,
      profile: {
        avatarUrl: `https://picsum.photos/seed/${userId}/100/100`,
      },
    };

    if (details.role === 'candidate') {
        newUser.profile!.skills = details.skills || [];
    }
    
    if (details.role === 'company' && details.companyName) {
      const companyId = `company-${Date.now()}`;
      const newCompany: Company = {
        id: companyId,
        name: details.companyName,
        description: details.companyDescription || 'No description provided.',
        ownerId: newUser.id,
        website: details.companyWebsite,
        logoUrl: `https://picsum.photos/seed/${companyId}/100/100`,
        isActive: true,
        isVerified: false, // Companies start as unverified
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
