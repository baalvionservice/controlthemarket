import { getCompanies, getUsers, getTasks } from "@/lib/api";
import { AdminCompaniesList } from "./company-list";
import type { Company } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type AdminCompanyData = Company & {
  userCount: number;
  taskCount: number;
  ownerName: string;
};

export default async function ManageCompaniesPage() {
  const [allCompanies, allUsers, allTasks] = await Promise.all([
    getCompanies(),
    getUsers(),
    getTasks(),
  ]);

  const companyData: AdminCompanyData[] = allCompanies.map(company => {
    const owner = allUsers.find(u => u.id === company.ownerId);
    return {
      ...company,
      userCount: allUsers.filter(user => user.companyId === company.id).length,
      taskCount: allTasks.filter(task => task.companyId === company.id).length,
      ownerName: owner?.name || 'N/A',
    };
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Manage Companies
          </h2>
          <p className="text-muted-foreground">
            View, edit, and manage all companies on the platform.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Platform Companies</CardTitle>
          <CardDescription>
            Use the filters to find specific companies and perform actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminCompaniesList initialData={companyData} />
        </CardContent>
      </Card>
    </div>
  );
}
