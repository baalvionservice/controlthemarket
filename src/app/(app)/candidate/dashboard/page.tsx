import { getSubmissionsByUser, getTask, getEvaluationBySubmission } from '@/lib/api';
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
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// For prototype, we'll use a hardcoded user ID. In a real app, this would come from auth.
const CURRENT_USER_ID = 'user-1';

export default async function CandidateDashboard() {
  const user = mockUsers.find((u) => u.id === CURRENT_USER_ID);
  const submissions = await getSubmissionsByUser(CURRENT_USER_ID);

  const submissionsWithDetails = await Promise.all(
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
          Welcome back, {user?.name.split(' ')[0]}!
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Submissions
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluated</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.filter((s) => s.status === 'evaluated').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Submissions reviewed
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>
            Here's a look at your recent activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissionsWithDetails.slice(0, 5).map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.task?.title}</TableCell>
                  <TableCell>
                    <Badge variant={
                      sub.status === 'evaluated' ? 'default' :
                      sub.status === 'in-review' ? 'secondary' : 'outline'
                    }>
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sub.evaluation ? `${sub.evaluation.score}/100` : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/candidate/submissions/${sub.id}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
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
