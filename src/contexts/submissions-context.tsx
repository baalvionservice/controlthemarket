'use client';

import type { Submission } from '@/lib/types';
import { mockSubmissions } from '@/lib/mock-data';
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';

interface SubmissionsContextType {
  submissions: Submission[];
  updateSubmission: (submissionId: string, updates: Partial<Submission>) => void;
  findSubmissionByTask: (taskId: string, userId: string) => Submission | undefined;
}

const SubmissionsContext = createContext<SubmissionsContextType | undefined>(undefined);

export function SubmissionsProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);

  const updateSubmission = useCallback((submissionId: string, updates: Partial<Submission>) => {
    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === submissionId 
          ? { ...sub, ...updates, lastUpdated: new Date().toISOString() } 
          : sub
      )
    );
  }, []);
  
  const findSubmissionByTask = useCallback((taskId: string, userId: string): Submission | undefined => {
      return submissions.find(sub => sub.taskId === taskId && sub.userId === userId);
  }, [submissions]);

  const value = useMemo(() => ({ submissions, updateSubmission, findSubmissionByTask }), [submissions, updateSubmission, findSubmissionByTask]);

  return (
    <SubmissionsContext.Provider value={value}>
      {children}
    </SubmissionsContext.Provider>
  );
}

export function useSubmissions() {
  const context = useContext(SubmissionsContext);
  if (context === undefined) {
    throw new Error('useSubmissions must be used within a SubmissionsProvider');
  }
  return context;
}
