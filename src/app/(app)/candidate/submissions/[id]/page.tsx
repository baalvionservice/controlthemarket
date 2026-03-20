'use client';

import React from 'react';
import { useSubmissions } from '@/contexts/submissions-context';
import { mockTasks, mockEvaluations } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Star, MessageSquare, Briefcase, ExternalLink, FileText, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const statusSteps = ['assigned', 'in-progress', 'pending', 'in-review', 'evaluated'];

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const { submissions } = useSubmissions();
  
  const submission = useMemo(() => submissions.find(s => s.id === params.id), [submissions, params.id]);

  const task = useMemo(() => submission ? mockTasks.find(t => t.id === submission.taskId) : undefined, [submission]);
  const evaluation = useMemo(() => submission ? mockEvaluations.find(e => e.submissionId === submission.id) : undefined, [submission]);

  if (!submission) {
    // In a real app, handle not found case. For this mock, we can show a message or redirect.
     return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <h2 className="font-headline text-3xl font-bold tracking-tight">
          Submission Not Found
        </h2>
        <p className="text-muted-foreground">The submission you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/candidate/submissions">Go to My Tasks</Link>
        </Button>
      </div>
     )
  }

  let currentStepIndex = statusSteps.indexOf(submission.status);
  if (['shortlisted', 'rejected', 'resubmitted'].includes(submission.status)) {
    // 'resubmitted' should be visually at the 'pending' stage
    if (submission.status === 'resubmitted') {
        currentStepIndex = statusSteps.indexOf('pending');
    } else { // 'shortlisted' and 'rejected' are post-evaluation
        currentStepIndex = statusSteps.indexOf('evaluated');
    }
  }
  const currentStep = currentStepIndex;

  const isFinalState = submission.status === 'evaluated' || submission.status === 'shortlisted' || submission.status === 'rejected';

  const getTimestampForStep = (step: string) => {
    switch(step) {
        case 'assigned':
            return submission.assignedAt ? `Assigned: ${format(new Date(submission.assignedAt), 'PPp')}` : 'Not assigned yet';
        case 'in-progress':
             if (submission.status === 'in-progress') return `Last updated: ${format(new Date(submission.lastUpdated), 'PPp')}`;
             return 'In Progress';
        case 'pending':
            if (submission.resubmittedAt) return `Resubmitted: ${format(new Date(submission.resubmittedAt), 'PPp')}`;
            if (submission.submittedAt) return `Submitted: ${format(new Date(submission.submittedAt), 'PPp')}`;
            return 'Not submitted yet';
        case 'in-review':
            return submission.status === 'in-review' ? 'Currently under review' : 'Awaiting review';
        case 'evaluated':
            if (evaluation?.evaluatedAt) return `Evaluated: ${format(new Date(evaluation.evaluatedAt), 'PPp')}`;
            return 'Awaiting evaluation';
        default:
            return '';
    }
}

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight">
                Task Status: {task?.title}
            </h2>
            <p className="text-muted-foreground">
                Review your submission and the feedback provided.
            </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
           <CardDescription>
            {task?.multiRound && submission.currentRound
                ? `Currently on Round ${submission.currentRound} of ${task?.rounds?.length || 1}.`
                : `Follow the status of your submission.`}
            </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 overflow-x-auto">
            <TooltipProvider>
                <div className="flex items-start min-w-[500px]">
                    {statusSteps.map((step, index) => {
                        const isCompletedStep = currentStep > index;
                        const isCurrentStep = currentStep === index;
                        const isFutureStep = currentStep < index;

                        return (
                            <React.Fragment key={step}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex flex-col items-center text-center">
                                            <div
                                                className={cn(
                                                    'flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold transition-all',
                                                    isCompletedStep && 'bg-primary text-primary-foreground',
                                                    isCurrentStep && 'bg-primary/20 text-primary ring-2 ring-primary',
                                                    isFutureStep && 'bg-muted text-muted-foreground'
                                                )}
                                            >
                                                {isCompletedStep ? <CheckCircle className="h-6 w-6" /> : index + 1}
                                            </div>
                                            <p className={cn(
                                                "mt-2 w-20 text-xs capitalize",
                                                isCurrentStep && "font-semibold text-primary",
                                                isFutureStep && "text-muted-foreground"
                                            )}>
                                                {step.replace('-', ' ')}
                                            </p>
                                        </div>
                                    </TooltipTrigger>
                                     <TooltipContent>
                                        <p>{getTimestampForStep(step)}</p>
                                    </TooltipContent>
                                </Tooltip>
                                
                                {index < statusSteps.length - 1 && (
                                    <div className={cn(
                                        "flex-1 h-1 mt-5 rounded-full mx-2",
                                        isCompletedStep ? "bg-primary" : "bg-muted"
                                    )} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </TooltipProvider>
        </CardContent>
      </Card>


      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>Task Details</span>
                <Badge variant="secondary">{task?.difficulty}</Badge>
            </CardTitle>
            <CardDescription>
                Assigned on {format(new Date(submission.assignedAt), 'PPP')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-2"><Briefcase className="h-4 w-4" /> Role</h4>
                <p className="text-muted-foreground">{task?.roleCategory}</p>
            </div>
             <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4" /> Your Submission</h4>
                {submission.content ? (
                     <Button asChild variant="outline" size="sm">
                        <Link href={submission.content.value} target="_blank" rel="noopener noreferrer">
                            View Submission <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                ) : (
                    <p className="text-sm text-muted-foreground">Not submitted yet.</p>
                )}
            </div>
             <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4" /> Status</h4>
                 <Badge variant={isFinalState ? "default" : "outline"} className="capitalize">{submission.status.replace('-', ' ')}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>Evaluation</span>
                 <Badge variant={isFinalState ? "default" : "outline"}>
                    {isFinalState ? "Completed" : "Pending"}
                 </Badge>
            </CardTitle>
            <CardDescription>
              {evaluation ? `Evaluated on ${format(new Date(evaluation.evaluatedAt), 'PPP')}` : 'Awaiting evaluation'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {evaluation ? (
                <>
                 <div className="space-y-1">
                    <h4 className="font-semibold flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500" /> Score</h4>
                    <p className="text-2xl font-bold">{evaluation.score}/100</p>
                </div>
                <div className="space-y-1">
                    <h4 className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Feedback</h4>
                    <p className="text-muted-foreground italic">"{evaluation.feedback}"</p>
                </div>
                </>
            ): (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <p>Your submission has not been evaluated yet. Please check back later.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
