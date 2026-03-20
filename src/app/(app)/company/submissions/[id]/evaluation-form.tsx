'use client';

import { useState, useMemo } from 'react';
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

const evaluationCriteria = {
    'Technical Skills': 'Assesses mastery of required technologies and tools.',
    'Problem Solving': 'Evaluates the ability to analyze problems and devise effective solutions.',
    'Communication': 'Judges the clarity and effectiveness of communication.',
    'Code Quality': 'Reviews code for readability, structure, and best practices.',
};

const criteriaKeys = Object.keys(evaluationCriteria) as (keyof typeof evaluationCriteria)[];

const formSchema = z.object({
  criteriaScores: z.object(
    criteriaKeys.reduce((acc, key) => {
      acc[key] = z.number().min(0).max(10).default(8);
      return acc;
    }, {} as Record<keyof typeof evaluationCriteria, z.ZodNumber>)
  ),
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
      criteriaScores: submission.evaluation?.criteriaScores 
        ? (submission.evaluation.criteriaScores as any)
        : criteriaKeys.reduce((acc, key) => ({...acc, [key]: 8}), {}),
      feedback: submission.evaluation?.feedback || '',
    },
  });

  const watchedScores = form.watch('criteriaScores');
  const totalScore = useMemo(() => {
    const scores = Object.values(watchedScores);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average * 10); // Scale to 0-100
  }, [watchedScores]);


  const generateAiFeedback = async () => {
    setIsAiLoading(true);
    try {
      if (!submission.task || !submission.content) {
          throw new Error('Task description or submission content is missing.');
      }
        
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
      
      const aiScoreOutOf10 = Math.round(result.overallScore / 10);
      const newScores = criteriaKeys.reduce((acc, key) => {
        acc[key] = aiScoreOutOf10;
        return acc;
      }, {} as Record<keyof typeof evaluationCriteria, number>);

      form.setValue('criteriaScores', newScores, { shouldValidate: true });

      toast({ title: 'AI Feedback Generated', description: 'The form has been populated with AI-suggested feedback and scores.'});
    } catch (error) {
      console.error(error);
      toast({ title: 'AI Error', description: 'Could not generate AI feedback.', variant: 'destructive' });
    } finally {
      setIsAiLoading(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const finalScore = totalScore;
    console.log('Evaluation Submitted:', { ...values, score: finalScore });

    // Mock API call
    setTimeout(() => {
      toast({
        title: 'Evaluation Submitted',
        description: 'The candidate has been notified.',
      });
      setIsSubmitting(false);
      router.refresh();
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <Button type="button" variant="outline" onClick={generateAiFeedback} disabled={isAiLoading}>
            {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
            Generate with AI
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
          <div className="space-y-6 rounded-md border p-4">
            <div className='flex justify-between items-center'>
                <h3 className="font-medium">Scoring Criteria</h3>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Score</p>
                    <p className="text-2xl font-bold text-primary">{totalScore}/100</p>
                </div>
            </div>

            {criteriaKeys.map(key => (
              <FormField
                key={key}
                control={form.control}
                name={`criteriaScores.${key}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {key}: <span className="font-bold text-primary">{field.value}</span>/10
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
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
