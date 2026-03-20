'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { FilePen, Send, Star, UserPlus } from 'lucide-react';
import type { Submission, Evaluation } from '@/lib/types';

interface ActivityLogProps {
  submission: Submission;
  evaluation?: Evaluation;
}

export function ActivityLog({ submission, evaluation }: ActivityLogProps) {
  const activityEvents = [];

  if (submission.assignedAt) {
    activityEvents.push({
      icon: UserPlus,
      title: 'Task Assigned',
      timestamp: submission.assignedAt,
    });
  }

  if (submission.submittedAt) {
    activityEvents.push({
      icon: Send,
      title: 'Initial Submission',
      timestamp: submission.submittedAt,
    });
  }
  
  if (submission.status === 'in-review') {
    // There's no specific timestamp for this, so use lastUpdated as a best guess
    activityEvents.push({
      icon: FilePen,
      title: 'Review Started',
      timestamp: submission.lastUpdated,
    });
  }

  if (submission.resubmittedAt) {
    activityEvents.push({
      icon: Send,
      title: 'Work Resubmitted',
      timestamp: submission.resubmittedAt,
    });
  }

  if (evaluation?.evaluatedAt) {
    activityEvents.push({
      icon: Star,
      title: 'Evaluation Completed',
      timestamp: evaluation.evaluatedAt,
      description: `Final Score: ${evaluation.score}/100`,
    });
  }

  const sortedEvents = activityEvents.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>A timeline of all actions for this task.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
           {sortedEvents.map((event, index) => (
            <div key={index} className="flex items-start gap-4 pb-8 last:pb-0">
              {index < sortedEvents.length - 1 && (
                <div className="absolute left-[34px] top-2 h-full w-px -translate-x-1/2 bg-border" />
              )}
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                <event.icon className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div className="flex-1 -translate-y-1">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.timestamp), 'PPp')}
                </p>
                {event.description && (
                  <p className="mt-1 text-sm text-muted-foreground italic">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
          {sortedEvents.length === 0 && (
              <p className="text-sm text-muted-foreground">No activity to show yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
