
'use client';

import type { User, UserRole, Company } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { mockUsers, mockCompanies } from '@/lib/mock-data';

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

  // In-memory store for session-specific mock data
  const [sessionUsers, setSessionUsers] = useState<User[]>(mockUsers);
  const [sessionCompanies, setSessionCompanies] = useState<Company[]>(mockCompanies);


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
        return updatedUser;
    });
  };

  const acceptConsent = () => {
    setUser(prevUser => {
        if (!prevUser || prevUser.role !== 'candidate') return prevUser;
        const updatedUser = { 
            ...prevUser, 
            consentAccepted: true,
            consentAcceptedAt: new Date().toISOString(),
        };
        localStorage.setItem('skillmatch-user', JSON.stringify(updatedUser));
        return updatedUser;
    });
  };
  
  const completeCandidateOnboarding = () => {
    setUser(prevUser => {
        if (!prevUser || prevUser.role !== 'candidate') return prevUser;
        const updatedUser = { 
            ...prevUser, 
            candidateOnboardingCompleted: true,
        };
        localStorage.setItem('skillmatch-user', JSON.stringify(updatedUser));
        return updatedUser;
    });
  }

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    const foundUser = sessionUsers.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
    );
    // Password is not checked in this mock implementation
    if (foundUser) {
      if (foundUser.role === 'company' && foundUser.companyId) {
        const company = sessionCompanies.find(c => c.id === foundUser.companyId);
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
    if (sessionUsers.some((u) => u.email.toLowerCase() === details.email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUserId = `user-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      name: details.name,
      email: details.email,
      role: details.role,
      createdAt: new Date().toISOString(),
      isActive: true,
      isVerified: true, // Auto-verify in mock
      consentAccepted: details.role === 'candidate' ? false : undefined,
      profile: {
        avatarUrl: `https://picsum.photos/seed/${newUserId}/100/100`,
      },
    };

    if (details.role === 'candidate') {
      newUser.profile!.skills = details.skills || [];
      newUser.candidateOnboardingCompleted = false;
    }

    if (details.role === 'company' && details.companyName) {
      const companyId = `company-${Date.now()}`;
      const newCompany: Company = {
        id: companyId,
        name: details.companyName,
        description: details.companyDescription || 'No description provided.',
        ownerId: newUserId,
        website: details.companyWebsite,
        logoUrl: `https://picsum.photos/seed/${companyId}/100/100`,
        industry: 'Not specified',
        location: 'Not specified',
        createdAt: new Date().toISOString(),
        isActive: true,
        isVerified: true, // Auto-verify
      };
      setSessionCompanies(prev => [...prev, newCompany]);
      newUser.companyId = companyId;
      newUser.companyName = newCompany.name;
      newUser.onboardingCompleted = false;
    }

    setSessionUsers(prev => [...prev, newUser]);
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

    const isPublicPath = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname === '/';
    
    if (!user && !isPublicPath) {
      router.push('/login');
    } else if (user && isPublicPath) {
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
