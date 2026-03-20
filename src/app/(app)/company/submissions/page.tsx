import { getSubmissions, getUser, getTask, getEvaluations } from "@/lib/api";
import { mockUsers } from "@/lib/mock-data";
import { CompanySubmissionsList } from "./submission-list";
import type { Submission, Task, User, Evaluation, RoleCategory } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Clock, CheckCircle, Star, XCircle } from "lucide-react";

// For prototype, we'll use a hardcoded user ID. In a real app, this would come from auth.
const CURRENT_USER_ID = 'user-2';

export type EvaluationData = {
  id: string; // submissionId
  candidate: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  task: {
    id: string;
    title: string;
    roleCategory: RoleCategory;
  };
  status: Submission['status'];
  score?: number;
  applicationDate: string;
};

export default async function CompanySubmissionsPage() {
  const user = await mockUsers.find((u) => u.id === CURRENT_USER_ID);
  if (!user || !user.companyId) return <div>Company not found</div>;
  
  const tasks = await getTasksByCompany(user.companyId);
  const allSubmissions = await getSubmissions();
  const allUsers = await getUsers();
  const allEvaluations = await getEvaluations();

  const companyTaskIds = new Set(tasks.map(task => task.id));
  const companySubmissions = allSubmissions.filter(sub => 
    companyTaskIds.has(sub.taskId) && sub.status !== 'assigned' && sub.status !== 'in-progress'
  );

  const evaluationData: EvaluationData[] = companySubmissions
    .map(submission => {
        const candidate = allUsers.find(u => u.id === submission.userId);
        const task = tasks.find(t => t.id === submission.taskId);
        const evaluation = allEvaluations.find(e => e.submissionId === submission.id);

        if (!candidate || !task) return null;

        return {
            id: submission.id,
            candidate: {
                id: candidate.id,
                name: candidate.name,
                avatarUrl: candidate.profile?.avatarUrl || '',
            },
            task: {
                id: task.id,
                title: task.title,
                roleCategory: task.roleCategory,
            },
            status: submission.status,
            score: evaluation?.score,
            applicationDate: submission.submittedAt || submission.assignedAt,
        };
    })
    .filter((item): item is EvaluationData => item !== null);

  const totalCandidates = new Set(evaluationData.map(e => e.candidate.id)).size;
  const pending = evaluationData.filter(e => e.status === 'pending').length;
  const inReview = evaluationData.filter(e => e.status === 'in-review').length;
  const completed = evaluationData.filter(e => e.status === 'evaluated').length;
  const shortlisted = evaluationData.filter(e => e.status === 'shortlisted').length;
  const rejected = evaluationData.filter(e => e.status === 'rejected').length;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="font-headline text-3xl font-bold tracking-tight">
          Candidate Evaluations
        </h2>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalCandidates}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{pending + inReview}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evaluations Done</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{completed + shortlisted}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{shortlisted}</div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{rejected}</div>
            </CardContent>
        </Card>
      </div>
      
      <CompanySubmissionsList data={evaluationData} />
    </div>
  );
}
