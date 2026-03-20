import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getTasksByCompany, getSubmissions } from "@/lib/api";
import { mockUsers } from "@/lib/mock-data";
import { CompanyTaskList } from "./task-list";
import type { TaskWithSubmissionCount } from './task-list';

const CURRENT_USER_ID = "user-2";

export default async function ManageTasksPage() {
  const user = await mockUsers.find((u) => u.id === CURRENT_USER_ID);
  if (!user || !user.companyId) return <div>Company not found</div>;
  
  const tasks = await getTasksByCompany(user.companyId);
  const submissions = await getSubmissions();

  const tasksWithSubmissionCount: TaskWithSubmissionCount[] = tasks.map(task => ({
    ...task,
    submissionCount: submissions.filter(sub => sub.taskId === task.id).length
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="font-headline text-3xl font-bold tracking-tight">
          Manage Tasks
        </h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/company/tasks/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Task
            </Link>
          </Button>
        </div>
      </div>
      <CompanyTaskList tasks={tasksWithSubmissionCount} />
    </div>
  );
}
