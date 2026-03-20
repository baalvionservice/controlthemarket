import { getTasksByCompany, getSubmissions, getTask, getUser } from '@/lib/api';
import { mockUsers } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowRight, Briefcase, FileText, PlusCircle } from 'lucide-react';
import Link from 'next/link';

// For prototype, we'll use a hardcoded user ID. In a real app, this would come from auth.
const CURRENT_USER_ID = 'user-2';

export default async function CompanyDashboard() {
  const user = await mockUsers.find((u) => u.id === CURRENT_USER_ID);
  if (!user || !user.companyId) return <div>Company not found</div>;

  const tasks = await getTasksByCompany(user.companyId);
  const allSubmissions = await getSubmissions();
  
  const companyTaskIds = new Set(tasks.map(task => task.id));
  const companySubmissions = allSubmissions.filter(sub => companyTaskIds.has(sub.taskId));

  const submissionsWithDetails = await Promise.all(
    companySubmissions.map(async (submission) => {
      const task = await getTask(submission.taskId);
      const candidate = await getUser(submission.userId);
      return { ...submission, task, candidate };
    })
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="font-headline text-3xl font-bold tracking-tight">
          Company Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/company/tasks/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Task
            </Link>
          </Button>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Tasks currently open for submissions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companySubmissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Received for all your tasks
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>
            New submissions awaiting your review.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissionsWithDetails.slice(0, 5).map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.candidate?.name}</TableCell>
                  <TableCell>{sub.task?.title}</TableCell>
                  <TableCell>
                    <Badge variant={
                      sub.status === 'evaluated' ? 'default' :
                      sub.status === 'in-review' ? 'secondary' : 'outline'
                    }>
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <Button asChild variant="outline" size="sm">
                      <Link href={`/company/submissions/${sub.id}`}>
                        Review <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
