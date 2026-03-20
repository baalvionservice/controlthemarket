import { getTask, getCompany } from '@/lib/api';
import { notFound } from 'next/navigation';
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
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { SubmissionForm } from './submission-form';

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const task = await getTask(params.id);
  if (!task) {
    notFound();
  }

  const company = await getCompany(task.companyId);

  const renderTaskContent = () => {
    if (task.multiRound && task.rounds) {
      return (
         <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {task.rounds.map((round, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">{round.roundNumber}</span>
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
          ))}
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
            <Button size="lg">Start Task <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent>
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
      
       <SubmissionForm task={task} />

    </div>
  );
}
