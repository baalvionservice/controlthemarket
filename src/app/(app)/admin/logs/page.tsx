
import { getSubmissions, getUsers, getTasks, getCompanies } from "@/lib/api";
import { AdminExecutionLogsList } from "./log-list";
import type { Submission, Task, User, Company } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ExecutionLogData = {
  id: string; // submissionId
  candidate: User;
  task: Task;
  company: Company;
  status: Submission['status'];
  logSummary: string; // "5 logs, 1 error"
  applicationDate: string;
};

export default async function ExecutionLogsDashboardPage() {
  const [
    allSubmissions,
    allUsers,
    allTasks,
    allCompanies,
  ] = await Promise.all([
    getSubmissions(),
    getUsers(),
    getTasks(),
    getCompanies(),
  ]);

  const logData: ExecutionLogData[] = allSubmissions
    .map(submission => {
        const candidate = allUsers.find(u => u.id === submission.userId);
        const task = allTasks.find(t => t.id === submission.taskId);
        const company = allCompanies.find(c => c.id === submission.companyId);

        if (!candidate || !task || !company) return null;

        // Mock log summary
        const logCount = Math.floor(Math.random() * 5) + 3;
        const errorCount = Math.random() > 0.8 ? 1 : 0;
        const logSummary = `${logCount} logs${errorCount > 0 ? `, ${errorCount} error(s)` : ''}`;

        return {
            id: submission.id,
            candidate: candidate,
            task: task,
            company: company,
            status: submission.status,
            logSummary: logSummary,
            applicationDate: submission.submittedAt || submission.assignedAt,
        };
    })
    .filter((item): item is ExecutionLogData => item !== null);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
         <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight">
                Execution Logs
            </h2>
            <p className="text-muted-foreground">
                Review execution logs for all candidate submissions and sessions.
            </p>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>All Submission Logs</CardTitle>
            <CardDescription>
                An overview of all logs generated during automated processing.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <AdminExecutionLogsList data={logData} />
        </CardContent>
      </Card>
    </div>
  );
}
