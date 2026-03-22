
'use client';

import { getPlanUsage, getUsageMetrics } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap, Briefcase, HardDrive, FileText } from "lucide-react";
import { UsageTrendsChart, UsageBreakdownPanel } from "./charts";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";
import type { Plan, Subscription, PlanUsage } from "@/lib/types";
import { useMemo } from "react";

export default function UsageMetricsPage() {
    const { user, plan, subscription, loading } = useAuth();

    const planUsage: PlanUsage[] = useMemo(() => {
        if (!plan || !subscription) return [];
        return [
            { feature: 'Tasks', usage: subscription.usage.tasksCreated, limit: plan.limits.tasks, unit: 'tasks' },
            { feature: 'Submissions', usage: subscription.usage.submissionsReceived, limit: plan.limits.submissions, unit: 'submissions received' },
        ];
    }, [plan, subscription]);

    if (loading || !user || !plan || !subscription) {
      return (
        <div className="flex h-full w-full items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    
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
                        <CardTitle className="text-sm font-medium">Tasks Created</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {subscription.usage.tasksCreated.toLocaleString()} / {plan.limits.tasks === -1 ? 'Unlimited' : plan.limits.tasks.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Submissions Received</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         <div className="text-2xl font-bold">
                            {subscription.usage.submissionsReceived.toLocaleString()} / {plan.limits.submissions === -1 ? 'Unlimited' : plan.limits.submissions.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Storage Usage</CardTitle>
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {/* This part remains static for now as storage isn't tracked in this update */}
                        <div className="text-2xl font-bold">1.2 GB / 50 GB</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* The trends chart requires historical data which we are not yet storing per-day. */}
                    {/* <UsageTrendsChart data={usageMetrics} /> */}
                </div>
                <div>
                    <UsageBreakdownPanel data={planUsage} />
                </div>
            </div>
        </div>
    )
}
```