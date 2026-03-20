import { getAlerts, getUsers, getTasks, getCompanies, getSubmissions } from "@/lib/api";
import { AlertList } from "./alert-list";
import type { Alert, User, Task, Company, Submission } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type AlertWithDetails = Alert & {
  relatedEntityData?: User | Company | Task | Submission | { id: string; name?: string };
};

export default async function SystemAlertsPage() {
  const [
    allAlerts,
    allUsers,
    allTasks,
    allCompanies,
    allSubmissions
  ] = await Promise.all([
    getAlerts(),
    getUsers(),
    getTasks(),
    getCompanies(),
    getSubmissions()
  ]);

  const entityMaps = {
    User: new Map(allUsers.map(u => [u.id, u])),
    Company: new Map(allCompanies.map(c => [c.id, c])),
    Task: new Map(allTasks.map(t => [t.id, t])),
    Submission: new Map(allSubmissions.map(s => [s.id, s])),
    System: new Map(),
  };

  const alertData: AlertWithDetails[] = allAlerts.map(alert => {
    let relatedEntityData;
    if (alert.relatedEntity.type !== 'System') {
      relatedEntityData = entityMaps[alert.relatedEntity.type]?.get(alert.relatedEntity.id);
    } else {
      relatedEntityData = { id: alert.relatedEntity.id, name: alert.relatedEntity.name };
    }
    
    return {
      ...alert,
      relatedEntityData,
    };
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
         <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight">
                System Alerts & Notifications
            </h2>
            <p className="text-muted-foreground">
                A centralized hub for all platform warnings, deadlines, and activities.
            </p>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Global Alert Stream</CardTitle>
            <CardDescription>
                Monitor user actions, system events, and administrative changes.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <AlertList initialData={alertData} />
        </CardContent>
      </Card>
    </div>
  );
}
