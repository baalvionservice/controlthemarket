'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import type { User, Task } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSubmissions } from '@/contexts/submissions-context';

const formSchema = z.object({
  candidateIds: z.array(z.string()).refine((value) => value.length > 0, {
    message: 'You must select at least one candidate.',
  }),
});

interface AssignTaskFormProps {
  candidates: User[];
  task: Task;
  assignedCandidateIds: string[];
}

export function AssignTaskForm({ candidates, task, assignedCandidateIds }: AssignTaskFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { addSubmission, findSubmissionByTask } = useSubmissions();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateIds: assignedCandidateIds,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newAssignments = values.candidateIds.filter(
        id => !findSubmissionByTask(task.id, id)
    );

    newAssignments.forEach(candidateId => {
        addSubmission({
            taskId: task.id,
            userId: candidateId,
            companyId: task.companyId,
            status: 'assigned',
        });
    });

    if (newAssignments.length > 0) {
        toast({
            title: 'Task Assigned',
            description: `The task "${task.title}" has been assigned to ${newAssignments.length} new candidate(s).`,
        });
    } else {
        toast({
            title: 'No New Assignments',
            description: 'All selected candidates were already assigned this task.',
        });
    }
    
    router.push('/company/tasks');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="candidateIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Candidates</FormLabel>
              </div>
              <ScrollArea className="h-72 w-full">
                <div className="space-y-3 pr-4">
                  {candidates.map((candidate) => (
                    <FormField
                      key={candidate.id}
                      control={form.control}
                      name="candidateIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={candidate.id}
                            className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 transition-colors hover:bg-accent/50 has-[[data-state=checked]]:bg-accent/50"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(candidate.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), candidate.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== candidate.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-normal cursor-pointer">
                                {candidate.name}
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                {candidate.email}
                              </p>
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit">Assign Task</Button>
        </div>
      </form>
    </Form>
  );
}
