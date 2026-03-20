import { getTasksByCompany, getSubmissions, getUser, getTask, getEvaluationBySubmission } from "@/lib/api";
import { mockUsers } from "@/lib/mock-data";
import { CompanySubmissionsList } from "./submission-list";
import type { Submission, Task, User, Evaluation } from '@/lib/types';

// For prototype, we'll use a hardcoded user ID. In a real app, this would come from auth.
const CURRENT_USER_ID = 'user-2';

export type SubmissionWithRelations = Submission & {
  task?: Task;
  candidate?: User;
  evaluation?: Evaluation;
};

export default async function CompanySubmissionsPage() {
  const user = await mockUsers.find((u) => u.id === CURRENT_USER_ID);
  if (!user || !user.companyId) return <div>Company not found</div>;
  
  const tasks = await getTasksByCompany(user.companyId);
  const allSubmissions = await getSubmissions();

  const companyTaskIds = new Set(tasks.map(task => task.id));
  const companySubmissions = allSubmissions.filter(sub => companyTaskIds.has(sub.taskId) && sub.status !== 'assigned' && sub.status !== 'in-progress');

  const submissionsWithDetails: SubmissionWithRelations[] = await Promise.all(
    companySubmissions.map(async (submission) => {
      const task = await getTask(submission.taskId);
      const candidate = await getUser(submission.userId);
      const evaluation = await getEvaluationBySubmission(submission.id);
      return { ...submission, task, candidate, evaluation };
    })
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="font-headline text-3xl font-bold tracking-tight">
          Review Submissions
        </h2>
      </div>
      <CompanySubmissionsList submissions={submissionsWithDetails} />
    </div>
  );
}
