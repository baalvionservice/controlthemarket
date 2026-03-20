import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getTasks, getSubmissions, getCompanies } from "@/lib/api";
import { AdminTaskList } from "./task-list";
import type { TaskWithDetails } from './task-list';

export default async function ManageTasksPage() {
  const tasks = await getTasks();
  const submissions = await getSubmissions();
  const companies = await getCompanies();

  const tasksWithDetails: TaskWithDetails[] = tasks.map(task => {
    const company = companies.find(c => c.id === task.companyId);
    return {
        ...task,
        submissionCount: submissions.filter(sub => sub.taskId === task.id).length,
        companyName: company?.name || "N/A"
    }
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="font-headline text-3xl font-bold tracking-tight">
          Manage All Tasks
        </h2>
      </div>
      <AdminTaskList tasks={tasksWithDetails} />
    </div>
  );
}
