import { getTask, getUsers } from '@/lib/api';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AssignTaskForm } from './assign-task-form';
import type { User } from '@/lib/types';

export default async function AssignTaskPage({ params }: { params: { taskId: string } }) {
  const task = await getTask(params.taskId);
  const users = await getUsers();
  
  if (!task) {
    notFound();
  }

  const candidates = users.filter((user): user is User & { role: 'candidate' } => user.role === 'candidate');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Assign Task
          </h2>
          <p className="text-muted-foreground">Assign "{task.title}" to one or more candidates.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Select Candidates</CardTitle>
          <CardDescription>
            Choose the candidates you want to assign this task to. Previously assigned candidates are pre-selected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssignTaskForm candidates={candidates} task={task} />
        </CardContent>
      </Card>
    </div>
  );
}
