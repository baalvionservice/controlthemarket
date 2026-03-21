
import { getSystemMetrics, getServiceStatus } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Server, Zap, AlertTriangle, Timer, Database } from "lucide-react";
import { SystemLoadChart, ApiRequestChart, ApiResponseTimeChart, DatabaseQueryChart } from "./charts";
import { ServiceStatusPanel } from "./service-status-panel";
import { cn } from "@/lib/utils";

export default async function SystemMonitoringPage() {
  const metrics = await getSystemMetrics();
  const services = await getServiceStatus();
  const latestMetric = metrics[metrics.length - 1];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Performance Metrics
          </h2>
          <p className="text-muted-foreground">
            A real-time overview of platform performance and infrastructure health.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <div className="text-2xl font-bold">{latestMetric.systemLoad.toFixed(1)}%</div>
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
            <div className="text-2xl font-bold">{latestMetric.errorRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. API Response</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestMetric.avgApiResponseTime.toFixed(0)} ms</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. DB Query</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestMetric.dbQueryTime.toFixed(0)} ms</div>
          </CardContent>
        </Card>
        <ServiceStatusPanel services={services} className="lg:col-span-2" />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <SystemLoadChart data={metrics} />
        <ApiRequestChart data={metrics} />
        <ApiResponseTimeChart data={metrics} />
        <DatabaseQueryChart data={metrics} />
      </div>
    </div>
  );
}
