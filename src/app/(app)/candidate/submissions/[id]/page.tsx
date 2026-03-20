'use client';

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
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Star, MessageSquare, Briefcase, ExternalLink, FileText, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const statusSteps = ['assigned', 'in-progress', 'pending', 'in-review', 'evaluated'];

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const { submissions } = useSubmissions();
  
  const submission = useMemo(() => submissions.find(s => s.id === params.id), [submissions, params.id]);

  const task = useMemo(() => submission ? mockTasks.find(t => t.id === submission.taskId) : undefined, [submission]);
  const evaluation = useMemo(() => submission ? mockEvaluations.find(e => e.submissionId === submission.id) : undefined, [submission]);

  if (!submission) {
    // Since this is now a client component, we can't use notFound() directly in the render path
    // in the same way. A redirect or a "not found" component would be better.
    // For this mock, we can show a simple message or redirect.
    // In a real app, you'd handle this more gracefully, maybe in a useEffect.
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

  const currentStep = statusSteps.indexOf(submission.status);
  const progressValue = currentStep === -1 ? 0 : (currentStep + 1) / statusSteps.length * 100;
  const isCompleted = submission.status === 'evaluated' || submission.status === 'shortlisted' || submission.status === 'rejected';

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
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressValue} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {statusSteps.map((step, index) => (
              <span key={step} className={cn("capitalize", index <= currentStep && "font-semibold text-primary")}>
                {step.replace('-', ' ')}
              </span>
            ))}
          </div>
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
                 <Badge variant={isCompleted ? "default" : "outline"}>{submission.status}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>Evaluation</span>
                 <Badge variant={isCompleted ? "default" : "outline"}>
                    {isCompleted ? "Completed" : "Pending"}
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
