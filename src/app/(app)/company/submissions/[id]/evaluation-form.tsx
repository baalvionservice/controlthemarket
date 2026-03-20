'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Loader2, Sparkles, Send } from 'lucide-react';
import type { SubmissionWithRelations } from './page';
import { aiSubmissionFeedback, type SubmissionFeedbackInput } from '@/ai/flows/ai-submission-feedback-flow';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().min(10, { message: 'Feedback must be at least 10 characters long.' }),
});

export function EvaluationForm({ submission }: { submission: SubmissionWithRelations }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      score: submission.evaluation?.score || 80,
      feedback: submission.evaluation?.feedback || '',
    },
  });

  const scoreValue = form.watch('score');

  const generateAiFeedback = async () => {
    setIsAiLoading(true);
    try {
      if (!submission.task || !submission.content) {
          throw new Error('Task description or submission content is missing.');
      }
        
      // This is a simplified version. In a real app, you'd fetch content from a URL.
      const submissionContent = submission.content.value.startsWith('http')
        ? `Link submitted: ${submission.content.value}`
        : 'File content (mocked)';

      const input: SubmissionFeedbackInput = {
        taskDescription: submission.task.description,
        submissionContent: submissionContent,
        submissionType: submission.content.type === 'link' ? 'link_summary' : 'text',
      };
      
      const result = await aiSubmissionFeedback(input);
      form.setValue('feedback', result.overallFeedback, { shouldValidate: true });
      form.setValue('score', result.overallScore, { shouldValidate: true });
      toast({ title: 'AI Feedback Generated', description: 'The form has been populated with AI-suggested feedback and score.'});
    } catch (error) {
      console.error(error);
      toast({ title: 'AI Error', description: 'Could not generate AI feedback.', variant: 'destructive' });
    } finally {
      setIsAiLoading(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log('Evaluation Submitted:', values);

    // Mock API call
    setTimeout(() => {
      toast({
        title: 'Evaluation Submitted',
        description: 'The candidate has been notified.',
      });
      setIsSubmitting(false);
      // In a real app, you would update the submission status and maybe redirect
      // For mock, let's just refresh to show the new evaluation
      router.refresh();
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <Button type="button" variant="outline" onClick={generateAiFeedback} disabled={isAiLoading}>
            {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
            Generate AI Feedback
          </Button>

          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback</FormLabel>
                <FormControl>
                  <Textarea placeholder="Provide constructive feedback for the candidate..." className="min-h-[150px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="score"
            render={({ field: { onChange, ...fieldProps} }) => (
              <FormItem>
                <FormLabel>
                  Score: <span className="font-bold text-lg text-primary">{scoreValue}</span>/100
                </FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[scoreValue]}
                    onValueChange={(vals) => onChange(vals[0])}
                    {...fieldProps}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Submit Evaluation
            </Button>
        </div>
      </form>
    </Form>
  );
}
