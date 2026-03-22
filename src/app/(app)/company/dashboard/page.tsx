

import { getTasksByCompany, getSubmissions, getEvaluations, getTask, getUser } from '@/lib/api';
import { mockUsers, mockCompanies } from '@/lib/mock-data';
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
import { ArrowRight, Briefcase, PlusCircle, Clock, Star, Monitor, Users, XCircle, FileCheck } from 'lucide-react';
import Link from 'next/link';

// For prototype, we'll use a hardcoded user ID. In a real app, this would come from auth.
const CURRENT_USER_ID = 'user-2';

export default async function CompanyDashboard() {
  const user = await mockUsers.find((u) => u.id === CURRENT_USER_ID);
  if (!user || !user.companyId) return <div>Company not found</div>;

  const company = mockCompanies.find(c => c.id === user.companyId);

  const [tasks, allSubmissions, allEvaluations] = await Promise.all([
      getTasksByCompany(user.companyId),
      getSubmissions(),
      getEvaluations()
  ]);
  
  const companyTaskIds = new Set(tasks.map(task => task.id));
  const companySubmissions = allSubmissions.filter(sub => companyTaskIds.has(sub.taskId));
  
  // Metrics calculation
  const totalAssignedCandidates = new Set(companySubmissions.map(s => s.userId)).size;
  const pendingReviewCount = companySubmissions.filter(s => ['pending', 'in-review', 'resubmitted'].includes(s.status)).length;
  const shortlistedCount = companySubmissions.filter(s => s.status === 'shortlisted').length;
  const rejectedCount = companySubmissions.filter(s => s.status === 'rejected').length;


  const submissionsWithDetails = await Promise.all(
    companySubmissions
      .filter(s => ['pending', 'in-review', 'resubmitted'].includes(s.status))
      .sort((a,b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 5)
      .map(async (submission) => {
        const task = await getTask(submission.taskId);
        const candidate = await getUser(submission.userId);
        return { ...submission, task, candidate };
      })
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="font-headline text-3xl font-bold tracking-tight">
          {company?.name || 'Company'} Dashboard
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
            <CardTitle className="text-sm font-medium">Total Assigned Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{totalAssignedCandidates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{pendingReviewCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Candidates</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{shortlistedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Candidates</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      <div>
          <Card>
            <CardHeader>
              <CardTitle>Action Required: Pending Reviews</CardTitle>
              <CardDescription>
                The newest submissions awaiting your evaluation.
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
                  {submissionsWithDetails.length > 0 ? submissionsWithDetails.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.candidate?.name}</TableCell>
                      <TableCell>{sub.task?.title}</TableCell>
                      <TableCell>
                        <Badge variant={
                          sub.status === 'resubmitted' ? 'warning' : 'secondary'
                        } className="capitalize">
                          {sub.status.replace('-', ' ')}
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
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No submissions are currently awaiting review.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
