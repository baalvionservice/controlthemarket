import { getSubmission, getTask, getEvaluationBySubmission } from '@/lib/api';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Star, MessageSquare, Briefcase, ExternalLink, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const submission = await getSubmission(params.id);
  if (!submission) {
    notFound();
  }

  const task = await getTask(submission.taskId);
  const evaluation = await getEvaluationBySubmission(submission.id);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight">
                Submission Details
            </h2>
            <p className="text-muted-foreground">
                Review your submission and the feedback provided.
            </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>Task: {task?.title}</span>
                <Badge variant="secondary">{task?.difficulty}</Badge>
            </CardTitle>
            <CardDescription>
                Submitted on {format(new Date(submission.submittedAt), 'PPP')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-2"><Briefcase className="h-4 w-4" /> Role</h4>
                <p className="text-muted-foreground">{task?.roleCategory}</p>
            </div>
             <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4" /> Your Submission</h4>
                <Button asChild variant="outline" size="sm">
                    <Link href={submission.content.value} target="_blank" rel="noopener noreferrer">
                        View Submission <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>Evaluation</span>
                 <Badge variant={submission.status === "evaluated" ? "default" : "outline"}>{submission.status}</Badge>
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
                <p className="text-muted-foreground">Your submission has not been evaluated yet. Please check back later.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
