
import { getSystemMetrics, getServiceStatus } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Server, Zap, AlertTriangle } from "lucide-react";
import { SystemLoadChart, ApiRequestChart } from "./charts";
import { ServiceStatusPanel } from "./service-status-panel";

export default async function SystemMonitoringPage() {
  const metrics = await getSystemMetrics();
  const services = await getServiceStatus();
  const latestMetric = metrics[metrics.length - 1];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            System Monitoring
          </h2>
          <p className="text-muted-foreground">
            A real-time overview of platform health and performance.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestMetric.activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Load</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestMetric.systemLoad}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests/min</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestMetric.apiRequestsPerMinute}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestMetric.errorRate}%</div>
          </CardContent>
        </Card>
         <ServiceStatusPanel services={services} />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <SystemLoadChart data={metrics} />
        <ApiRequestChart data={metrics} />
      </div>
    </div>
  );
}
