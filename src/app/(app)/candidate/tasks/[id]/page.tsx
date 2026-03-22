
'use client';

import { useState, useEffect, useMemo } from 'react';
import { getTask, getCompany } from '@/lib/api';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import {
  Briefcase,
  Calendar,
  Clock,
  Award,
  BookOpen,
  Target,
  ArrowRight,
  Sparkles,
  Loader2,
  AlertTriangle,
  Paperclip,
  Download,
} from 'lucide-react';
import Link from 'next/link';
import { SubmissionForm } from './submission-form';
import type { Task, Company, Submission, TaskPriority } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { useSubmissions } from '@/contexts/submissions-context';
import { cn } from '@/lib/utils';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const [task, setTask] = useState<Task | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { findSubmissionByTask, updateSubmission } = useSubmissions();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const taskData = await getTask(params.id);
      if (taskData) {
        setTask(taskData);
        const companyData = await getCompany(taskData.companyId);
        setCompany(companyData || null);
      } else {
        notFound();
      }
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  const submission = useMemo(() => {
    if (!user || !task) return undefined;
    return findSubmissionByTask(task.id, user.id);
  }, [task, user, findSubmissionByTask]);

  const handleStartTask = () => {
    if (submission && submission.status === 'assigned') {
      updateSubmission(submission.id, { status: 'in-progress' });
    }
    // In a real app this might start a timer, etc.
    // For now, it just changes status.
    // The button will be disabled if the task is already started.
  };

  const isTaskStarted = useMemo(() => {
    if (!submission) return false;
    return submission.status !== 'assigned';
  }, [submission]);

  const currentRoundNumber = useMemo(() => submission?.currentRound || 1, [submission]);

  if (loading || !task) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getPriorityVariant = (priority?: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'warning';
      default:
        return 'outline';
    }
  };

  const renderTaskContent = () => {
    if (task.multiRound && task.rounds) {
      return (
         <Accordion type="single" collapsible className="w-full" defaultValue={`item-${currentRoundNumber - 1}`}>
          {task.rounds.map((round, index) => {
            const isCurrentRound = round.roundNumber === currentRoundNumber;
            const isCompletedRound = round.roundNumber < currentRoundNumber;

            return (
                <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg" disabled={!isCurrentRound && !isCompletedRound}>
                    <div className="flex items-center gap-4">
                    <span className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full font-bold",
                        isCurrentRound && "bg-primary text-primary-foreground animate-pulse",
                        isCompletedRound && "bg-primary/50 text-primary-foreground",
                        !isCurrentRound && !isCompletedRound && "bg-muted text-muted-foreground",
                    )}>{round.roundNumber}</span>
                    <span>Round {round.roundNumber}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pl-12 space-y-8 pt-4">
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Instructions</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{round.instructions}</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Expected Outputs</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{round.expectedOutputs}</p>
                    </div>
                    {round.timeLimitMinutes && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" /> 
                        <span>Time Limit: {round.timeLimitMinutes} minutes</span>
                    </div>
                    )}
                </AccordionContent>
                </AccordionItem>
            );
        })}
        </Accordion>
      );
    }
    
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Instructions</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{task.instructions}</p>
            </div>
            <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Expected Outputs</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{task.expectedOutputs}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            {task.title}
          </h2>
          <div className="flex items-center gap-2">
            {company && (
                 <Link href="#" className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={company.logoUrl} alt={company.name} />
                        <AvatarFallback>{company.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-muted-foreground hover:underline">{company.name}</span>
                </Link>
            )}
          </div>
        </div>
        <div className="flex gap-2">
            {submission && (
                <Button size="lg" onClick={handleStartTask} disabled={isTaskStarted}>
                    {isTaskStarted ? (task.multiRound ? `Begin Round ${currentRoundNumber}` : `Task in Progress`) : 'Start Task'} 
                    {!isTaskStarted && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
            )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {task.imageUrl && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                        <Image src={task.imageUrl} alt={task.title} fill className="object-cover" data-ai-hint={task.imageHint}/>
                    </div>
                )}
                {renderTaskContent()}
            </CardContent>
        </Card>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4 text-sm">
                    <div className="flex items-start justify-between">
                        <span className="font-medium text-muted-foreground flex items-center gap-2"><Briefcase className="h-4 w-4" /> Role</span>
                        <span className="font-semibold">{task.roleCategory}</span>
                    </div>
                     <div className="flex items-start justify-between">
                        <span className="font-medium text-muted-foreground flex items-center gap-2"><Award className="h-4 w-4" /> Difficulty</span>
                        <Badge variant="outline">{task.difficulty}</Badge>
                    </div>
                    {task.priority && (
                         <div className="flex items-start justify-between">
                            <span className="font-medium text-muted-foreground flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Priority</span>
                            <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                        </div>
                    )}
                     <div className="flex items-start justify-between">
                        <span className="font-medium text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Deadline</span>
                        <span className="font-semibold">{format(new Date(task.deadline), 'PPP')}</span>
                    </div>
                     {task.timeLimitMinutes && !task.multiRound && (
                         <div className="flex items-start justify-between">
                            <span className="font-medium text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Time Limit</span>
                            <span className="font-semibold">{task.timeLimitMinutes} minutes</span>
                        </div>
                    )}
                    {task.multiRound && (
                         <div className="flex items-start justify-between">
                            <span className="font-medium text-muted-foreground flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Task Type</span>
                            <span className="font-semibold">Multi-Round ({task.rounds?.length || 0} rounds)</span>
                        </div>
                    )}
                    {task.projectFile && (
                        <div className="space-y-2 pt-2">
                            <div className="font-medium text-muted-foreground flex items-center gap-2">
                                <Paperclip className="h-4 w-4" /> Task Resources
                            </div>
                            <Button asChild variant="secondary" className="w-full justify-start text-left">
                                <Link href={task.projectFile.url} download>
                                    <Download className="mr-2 h-4 w-4" />
                                    <span>{task.projectFile.name}</span>
                                </Link>
                            </Button>
                        </div>
                    )}
                 </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Task Categories</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {task.taskTypes?.map(type => (
                        <Badge key={type} variant="secondary">{type}</Badge>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
      
       {isTaskStarted && <SubmissionForm task={task} />}

    </div>
  );
}
