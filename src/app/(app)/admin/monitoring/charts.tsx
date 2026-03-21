
'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { SystemMetric } from '@/lib/types';
import { format } from 'date-fns';

const chartConfig = {
  systemLoad: {
    label: 'System Load',
    color: 'hsl(var(--chart-1))',
  },
  apiRequests: {
    label: 'API Requests',
    color: 'hsl(var(--chart-2))',
  },
};

export function SystemLoadChart({ data }: { data: SystemMetric[] }) {
  const chartData = data.slice(-30).map(metric => ({
    time: format(new Date(metric.timestamp), 'HH:mm:ss'),
    systemLoad: metric.systemLoad,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Load (%)</CardTitle>
        <CardDescription>CPU and memory usage over the last minute.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} />
            <YAxis domain={[0, 100]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="systemLoad"
              type="natural"
              fill="var(--color-systemLoad)"
              fillOpacity={0.4}
              stroke="var(--color-systemLoad)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


export function ApiRequestChart({ data }: { data: SystemMetric[] }) {
  const chartData = data.slice(-30).map(metric => ({
    time: format(new Date(metric.timestamp), 'HH:mm:ss'),
    apiRequests: metric.apiRequestsPerMinute,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Request Rate</CardTitle>
        <CardDescription>Requests per minute over the last minute.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="apiRequests"
              type="natural"
              fill="var(--color-apiRequests)"
              fillOpacity={0.4}
              stroke="var(--color-apiRequests)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
