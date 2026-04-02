"use client";

import type { User, UserRole, Company, Plan, Subscription } from "@/lib/types";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import * as api from "@/lib/api";

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
  plan: Plan | null;
  subscription: Subscription | null;
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
  const [plan, setPlan] = useState<Plan | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchCompanyData = async (companyId: string) => {
    const [subRes, plansRes] = await Promise.all([
      api.getSubscriptionByCompany(companyId),
      api.getAllPlans(),
    ]);
    const activeSub = (subRes as any)?.data || subRes;
    const allPlans = (plansRes as any)?.data || plansRes;

    if (activeSub) {
      const currentPlan =
        allPlans?.find((p: any) => p.id === activeSub.planId) || null;
      setSubscription(activeSub);
      setPlan(currentPlan);

      // Handle expired subscription
      if (new Date(activeSub.endDate) < new Date()) {
        const freePlan = allPlans?.find((p: any) => p.name === "Free")!;
        await api.updateSubscription(activeSub.id, { status: "EXPIRED" });
        const { data: newFreeSub } = await api.createSubscription({
          companyId: companyId,
          planId: freePlan.id,
          status: "ACTIVE",
          startDate: new Date().toISOString(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ).toISOString(),
          billingCycle: "YEARLY",
          usage: { tasksCreated: 0, submissionsReceived: 0 },
        });
        setSubscription(newFreeSub);
        setPlan(freePlan);
      }
    } else {
      // If no subscription, assign a free one
      const freePlan = allPlans?.find((p: any) => p.name === "Free")!;
      const { data: newFreeSub } = await api.createSubscription({
        companyId: companyId,
        planId: freePlan.id,
        status: "ACTIVE",
        startDate: new Date().toISOString(),
        endDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 99)
        ).toISOString(), // Long expiry for free plan
        billingCycle: "YEARLY",
        usage: { tasksCreated: 0, submissionsReceived: 0 },
      });
      setSubscription(newFreeSub);
      setPlan(freePlan);
    }
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("skillmatch-user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.role === "company" && parsedUser.companyId) {
          fetchCompanyData(parsedUser.companyId);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("skillmatch-user");
    }
    setLoading(false);
  }, []);

  const updateUser = (updates: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = {
        ...prevUser,
        ...updates,
        profile: {
          ...(prevUser.profile || {}),
          ...updates.profile,
        },
      };
      localStorage.setItem("skillmatch-user", JSON.stringify(updatedUser));
      api.updateUser(prevUser.id, updates);
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
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    const allUsers = await api.getUsers();
    const foundUser = allUsers.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
    );
    // Password is not checked in this mock implementation
    if (foundUser) {
      if (foundUser.role === "company" && foundUser.companyId) {
        const company = await api.getCompany(foundUser.companyId);
        if (company) {
          foundUser.companyName = company.name;
        }
        await fetchCompanyData(foundUser.companyId);
      }
      setUser(foundUser);
      localStorage.setItem("skillmatch-user", JSON.stringify(foundUser));
      return { success: true };
    }
    return { success: false, message: "Invalid credentials." };
  };

  const signup = async (details: SignupDetails): Promise<AuthResult> => {
    const allUsers = await api.getUsers();
    if (
      allUsers.some(
        (u) => u.email.toLowerCase() === details.email.toLowerCase()
      )
    ) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    let companyId: string | undefined;
    let companyName: string | undefined;

    if (details.role === "company" && details.companyName) {
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

    const userData: Omit<User, "id" | "createdAt"> = {
      name: details.name,
      email: details.email,
      role: details.role,
      isActive: true,
      companyId,
      companyName,
      candidateOnboardingCompleted:
        details.role === "candidate" ? false : undefined,
      onboardingCompleted: details.role === "company" ? false : undefined,
      profile: {
        avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
        skills: details.skills || [],
      },
    };

    const newUserResponse = await api.createUser(userData);
    const newUser = newUserResponse.data;

    setUser(newUser);
    localStorage.setItem("skillmatch-user", JSON.stringify(newUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setPlan(null);
    setSubscription(null);
    localStorage.removeItem("skillmatch-user");
  };

  useEffect(() => {
    if (loading) return;

    const isPublicPath =
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname === "/" ||
      pathname.startsWith("/demos") ||
      pathname.startsWith("/blog") ||
      pathname.startsWith("/badges") ||
      pathname.startsWith("/companies") ||
      pathname.startsWith("/contact") ||
      pathname.startsWith("/demos") ||
      pathname.startsWith("/leaderboard") ||
      pathname.startsWith("/pricing") ||
      pathname.startsWith("/privacy") ||
      pathname.startsWith("/terms") ||
      pathname.startsWith("/about");

    if (!user && !isPublicPath) {
      router.push("/login");
    } else if (user && isPublicPath && !pathname.startsWith("/demos")) {
      if (user.role === "company" && !user.onboardingCompleted) {
        router.push("/company/onboarding");
      } else if (
        user.role === "candidate" &&
        !user.candidateOnboardingCompleted
      ) {
        router.push("/signup/candidate/onboarding");
      } else {
        router.push(`/${user.role}/dashboard`);
      }
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        plan,
        subscription,
        login,
        signup,
        logout,
        loading,
        updateUser,
        acceptConsent,
        completeCandidateOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
