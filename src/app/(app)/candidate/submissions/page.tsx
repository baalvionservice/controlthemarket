import { getSubmissionsByUser, getTask, getEvaluationBySubmission } from '@/lib/api';
import { SubmissionList } from './submission-list';
import type { Submission } from '@/lib/types';

// For prototype, we'll use a hardcoded user ID. In a real app, this would come from auth.
const CURRENT_USER_ID = 'user-1';

export type SubmissionWithDetails = Submission & {
  task?: Awaited<ReturnType<typeof getTask>>;
  evaluation?: Awaited<ReturnType<typeof getEvaluationBySubmission>>;
};

export default async function SubmissionsPage() {
  const submissions = await getSubmissionsByUser(CURRENT_USER_ID);

  const submissionsWithDetails: SubmissionWithDetails[] = await Promise.all(
    submissions.map(async (submission) => {
      const task = await getTask(submission.taskId);
      const evaluation = await getEvaluationBySubmission(submission.id);
      return { ...submission, task, evaluation };
    })
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <h2 className="font-headline text-3xl font-bold tracking-tight">
          My Submissions
        </h2>
      </div>
      <SubmissionList submissions={submissionsWithDetails} />
    </div>
  );
}
