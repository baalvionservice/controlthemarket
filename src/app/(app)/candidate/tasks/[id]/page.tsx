import { getTask, getCompany } from '@/lib/api';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
} from 'lucide-react';
import Link from 'next/link';

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const task = await getTask(params.id);
  if (!task) {
    notFound();
  }

  const company = await getCompany(task.companyId);

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
            <CardContent className="space-y-8">
                <div className="space-y-4">
                     <h3 className="font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Instructions</h3>
                     <p className="text-muted-foreground whitespace-pre-wrap">{task.instructions}</p>
                </div>
                 <div className="space-y-4">
                     <h3 className="font-semibold flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Expected Outputs</h3>
                     <p className="text-muted-foreground whitespace-pre-wrap">{task.expectedOutputs}</p>
                </div>
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
                     {task.timeLimitMinutes && (
                         <div className="flex items-start justify-between">
                            <span className="font-medium text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Time Limit</span>
                            <span className="font-semibold">{task.timeLimitMinutes} minutes</span>
                        </div>
                    )}
                 </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Task Types</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {task.taskTypes?.map(type => (
                        <Badge key={type} variant="secondary">{type}</Badge>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
      
       <Card>
            <CardHeader>
                <CardTitle>Submit Your Work</CardTitle>
                <CardDescription>Once you have completed the task, submit your work here.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex h-32 w-full items-center justify-center rounded-md border-2 border-dashed">
                    <div className="text-center">
                        <p className="text-muted-foreground">This is where the submission UI will be.</p>
                        <Button variant="secondary" className="mt-2" disabled>Submit Work</Button>
                    </div>
                </div>
            </CardContent>
       </Card>

    </div>
  );
}
