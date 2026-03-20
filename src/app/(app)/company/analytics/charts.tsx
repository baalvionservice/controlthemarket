'use client';

import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from 'recharts';
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
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

const submissionsData = [
  { status: 'Pending', count: 12 },
  { status: 'In-Review', count: 8 },
  { status: 'Evaluated', count: 25 },
  { status: 'Shortlisted', count: 5 },
];

const submissionsChartConfig = {
  count: {
    label: 'Submissions',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;


const tasksData = [
  { difficulty: 'Beginner', count: 5, fill: 'var(--color-beginner)' },
  { difficulty: 'Intermediate', count: 12, fill: 'var(--color-intermediate)' },
  { difficulty: 'Advanced', count: 4, fill: 'var(--color-advanced)' },
  { difficulty: 'Expert', count: 2, fill: 'var(--color-expert)' },
];

const tasksChartConfig = {
  count: {
    label: 'Tasks',
  },
  beginner: {
    label: 'Beginner',
    color: 'hsl(var(--chart-1))',
  },
  intermediate: {
    label: 'Intermediate',
    color: 'hsl(var(--chart-2))',
  },
  advanced: {
    label: 'Advanced',
    color: 'hsl(var(--chart-3))',
  },
  expert: {
    label: 'Expert',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;


export function AnalyticsCharts() {
  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Submissions by Status</CardTitle>
          <CardDescription>A look at the current pipeline of candidate submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={submissionsChartConfig}>
            <BarChart accessibilityLayer data={submissionsData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="status"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Tasks by Difficulty</CardTitle>
          <CardDescription>Distribution of tasks across different difficulty levels.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
            <ChartContainer config={tasksChartConfig} className="mx-auto aspect-square w-full max-w-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
                <Pie data={tasksData} dataKey="count" nameKey="difficulty" innerRadius={60}>
                    {tasksData.map((entry) => (
                        <Cell key={entry.difficulty} fill={entry.fill} />
                    ))}
                </Pie>
                 <ChartLegend
                    content={<ChartLegendContent nameKey="difficulty" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
