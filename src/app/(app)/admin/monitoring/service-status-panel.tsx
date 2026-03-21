
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ServiceStatus, ServiceStatusState } from '@/lib/types';
import { Server, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const getStatusInfo = (status: ServiceStatusState) => {
  switch (status) {
    case 'Running':
      return { icon: CheckCircle, color: 'text-green-500', label: 'Running' };
    case 'Degraded':
      return { icon: AlertTriangle, color: 'text-yellow-500', label: 'Degraded' };
    case 'Down':
      return { icon: XCircle, color: 'text-red-500', label: 'Down' };
  }
};

export function ServiceStatusPanel({ services, className }: { services: ServiceStatus[], className?: string }) {
  const overallStatus = services.every(s => s.status === 'Running')
    ? 'All systems operational.'
    : services.some(s => s.status === 'Down')
    ? 'Major outage detected.'
    : 'Some services are degraded.';

  return (
    <Card className={cn("lg:col-span-1", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Service Status</span>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
            {overallStatus.includes('All') ? (
                <span className="text-green-500">Healthy</span>
            ) : overallStatus.includes('Major') ? (
                <span className="text-red-500">Outage</span>
            ) : (
                <span className="text-yellow-500">Degraded</span>
            )}
        </div>
        <p className="text-xs text-muted-foreground">{overallStatus}</p>
        <div className="mt-4 flex justify-around gap-2">
          <TooltipProvider>
            {services.map(service => {
              const statusInfo = getStatusInfo(service.status);
              return (
                <Tooltip key={service.id}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-1">
                      <statusInfo.icon className={`h-6 w-6 ${statusInfo.color}`} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{service.name}: {statusInfo.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
