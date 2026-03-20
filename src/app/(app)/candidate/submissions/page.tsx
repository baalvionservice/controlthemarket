'use client';

import { useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useSubmissions } from '@/contexts/submissions-context';
import { SubmissionList } from './submission-list';
import { mockTasks, mockEvaluations } from '@/lib/mock-data';
import type { Submission } from '@/lib/types';
import type { getTask, getEvaluationBySubmission } from '@/lib/api';

export type SubmissionWithDetails = Submission & {
  task?: ReturnType<typeof mockTasks.find>;
  evaluation?: ReturnType<typeof mockEvaluations.find>;
};

export default function SubmissionsPage() {
  const { user } = useAuth();
  const { submissions: allSubmissions } = useSubmissions();
  
  const submissionsForUser = useMemo(() => {
    if (!user) return [];
    return allSubmissions.filter(sub => sub.userId === user.id);
  }, [allSubmissions, user]);

  const submissionsWithDetails: SubmissionWithDetails[] = useMemo(() => {
    return submissionsForUser.map((submission) => {
      const task = mockTasks.find(t => t.id === submission.taskId);
      const evaluation = submission.id ? mockEvaluations.find(e => e.submissionId === submission.id) : undefined;
      return { ...submission, task, evaluation };
    });
  }, [submissionsForUser]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <h2 className="font-headline text-3xl font-bold tracking-tight">
          My Tasks
        </h2>
      </div>
      <SubmissionList submissions={submissionsWithDetails} />
    </div>
  );
}
