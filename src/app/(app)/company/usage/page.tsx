import { getPlanUsage, getUsageMetrics } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap, Briefcase, HardDrive } from "lucide-react";
import { UsageTrendsChart, UsageBreakdownPanel } from "./charts";

export default async function UsageMetricsPage() {
    const [planUsage, usageMetrics] = await Promise.all([
        getPlanUsage(),
        getUsageMetrics()
    ]);
    
    const latestMetrics = usageMetrics[usageMetrics.length - 1];

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                <h2 className="font-headline text-3xl font-bold tracking-tight">
                    Usage Metrics
                </h2>
                <p className="text-muted-foreground">
                    Monitor your plan's usage and track trends over time.
                </p>
                </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">API Calls (Last 30d)</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {usageMetrics.reduce((acc, curr) => acc + curr.apiCalls, 0).toLocaleString()}
                    </div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tasks Created (Last 30d)</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {usageMetrics.reduce((acc, curr) => acc + curr.tasksCreated, 0)}
                    </div>
                </CardContent>
                </Card>
                 <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Storage Usage</CardTitle>
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{latestMetrics.storageUsage.toFixed(1)} GB</div>
                </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <UsageTrendsChart data={usageMetrics} />
                </div>
                <div>
                    <UsageBreakdownPanel data={planUsage} />
                </div>
            </div>
        </div>
    )
}
