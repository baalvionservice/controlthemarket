
'use client';

import type { User, UserRole, Company } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import * as api from '@/lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupDetails {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  skills?: string[];
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
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  signup: (details: SignupDetails) => Promise<AuthResult>;
  logout: () => void;
  loading: boolean;
  updateUser: (updates: Partial<User>) => void;
  acceptConsent: () => void;
  completeCandidateOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('skillmatch-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('skillmatch-user');
    }
    setLoading(false);
  }, []);
  
  const updateUser = (updates: Partial<User>) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, ...updates };
        localStorage.setItem('skillmatch-user', JSON.stringify(updatedUser));
        // Also update in the mock DB
        api.getUsers().then(users => {
          // This is a mock update, in a real app this would be a PATCH request
        });
        return updatedUser;
    });
  };

  const acceptConsent = () => {
    updateUser({
      consentAccepted: true,
      consentAcceptedAt: new Date().toISOString(),
    });
  };
  
  const completeCandidateOnboarding = () => {
    updateUser({ candidateOnboardingCompleted: true });
  }

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    const allUsers = await api.getUsers();
    const foundUser = allUsers.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
    );
    // Password is not checked in this mock implementation
    if (foundUser) {
      if (foundUser.role === 'company' && foundUser.companyId) {
        const company = await api.getCompany(foundUser.companyId);
        if (company) {
            foundUser.companyName = company.name;
        }
      }
      setUser(foundUser);
      localStorage.setItem('skillmatch-user', JSON.stringify(foundUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials.' };
  };

  const signup = async (details: SignupDetails): Promise<AuthResult> => {
    const allUsers = await api.getUsers();
    if (allUsers.some((u) => u.email.toLowerCase() === details.email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    let companyId: string | undefined;
    let companyName: string | undefined;

    if (details.role === 'company' && details.companyName) {
      // In a real app, this would be a transaction
      // For mock, we create company first
      // const newCompanyData = await api.createCompany({
      //   name: details.companyName,
      //   description: details.companyDescription || 'No description provided.',
      //   ownerId: '', // placeholder
      //   website: details.companyWebsite,
      //   logoUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
      // });
      // companyId = newCompanyData.data.id;
      // companyName = newCompanyData.data.name;
    }

    const userData: Omit<User, 'id'|'createdAt'|'isActive'> = {
      name: details.name,
      email: details.email,
      role: details.role,
      companyId,
      companyName,
      candidateOnboardingCompleted: details.role === 'candidate' ? false : undefined,
      onboardingCompleted: details.role === 'company' ? false : undefined,
      profile: {
        avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
        skills: details.skills || [],
      }
    };
    
    const newUserResponse = await api.createUser(userData);
    const newUser = newUserResponse.data;
    
    setUser(newUser);
    localStorage.setItem('skillmatch-user', JSON.stringify(newUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skillmatch-user');
  };

  useEffect(() => {
    if (loading) return;

    const isPublicPath = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname === '/' || pathname.startsWith('/demos');
    
    if (!user && !isPublicPath) {
      router.push('/login');
    } else if (user && (isPublicPath && !pathname.startsWith('/demos'))) {
      if (user.role === 'company' && !user.onboardingCompleted) {
        router.push('/company/onboarding');
      } else if (user.role === 'candidate' && !user.candidateOnboardingCompleted) {
        router.push('/signup/candidate/onboarding');
      } else {
        router.push(`/${user.role}/dashboard`);
      }
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateUser, acceptConsent, completeCandidateOnboarding }}>
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
