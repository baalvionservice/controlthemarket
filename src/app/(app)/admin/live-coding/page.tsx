
import { getSubmissions, getUsers, getTasks } from "@/lib/api";
import { LiveCodingList } from "./live-coding-list";
import type { Submission, Task, User, LiveSessionStatus } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type LiveCodingSessionData = {
  submissionId: string;
  candidate: User;
  task: Task;
  status: LiveSessionStatus;
  lastActivity: string;
};

export default async function LiveCodingDashboardPage() {
  const [
    allSubmissions,
    allUsers,
    allTasks,
  ] = await Promise.all([
    getSubmissions(),
    getUsers(),
    getTasks(),
  ]);

  const sessionData: LiveCodingSessionData[] = allSubmissions
    .map(submission => {
        const candidate = allUsers.find(u => u.id === submission.userId);
        const task = allTasks.find(t => t.id === submission.taskId);

        if (!candidate || !task) return null;

        return {
            submissionId: submission.id,
            candidate: candidate,
            task: task,
            status: submission.liveSessionStatus || 'Not Started',
            lastActivity: submission.lastUpdated,
        };
    })
    .filter((item): item is LiveCodingSessionData => item !== null);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
         <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight">
                Live Coding Sessions
            </h2>
            <p className="text-muted-foreground">
                Monitor and manage real-time coding sessions with candidates.
            </p>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Active and Upcoming Sessions</CardTitle>
            <CardDescription>
                An overview of all live coding sessions on the platform.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <LiveCodingList initialData={sessionData} />
        </CardContent>
      </Card>
    </div>
  );
}
