'use client';

import { useState, useMemo, useEffect } from 'react';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Github, UploadCloud, File, X, Loader2, Link as LinkIcon } from 'lucide-react';
import type { Task, SubmissionContentType } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { useSubmissions } from '@/contexts/submissions-context';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  submissionType: z.enum(['link', 'file', 'externalLink']),
  link: z.string().optional(),
  file: z.object({
    name: z.string(),
    size: z.number(),
  }).optional(),
  externalLink: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.submissionType === 'link') {
    if (!data.link) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['link'],
        message: 'A GitHub repository URL is required.',
      });
    } else {
        try {
            const url = new URL(data.link);
            if (url.protocol !== 'https:' || url.hostname !== 'github.com') {
                 ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['link'],
                    message: 'Please enter a valid GitHub repository URL.',
                });
            } else if (url.pathname.split('/').filter(Boolean).length < 2) {
                 ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['link'],
                    message: 'Please include both a username and repository in the URL (e.g., https://github.com/user/repo).',
                });
            }
        } catch (e) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['link'],
                message: 'Please enter a valid URL format.',
            });
        }
    }
  }
  if (data.submissionType === 'file' && !data.file) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['file'],
      message: 'A file is required for file uploads.',
    });
  }
  if (data.submissionType === 'externalLink') {
    if (!data.externalLink) {
        ctx.addIssue({
            code: 'custom',
            path: ['externalLink'],
            message: 'An external link is required.'
        });
    } else {
        try {
            const url = new URL(data.externalLink);
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                ctx.addIssue({
                    code: 'custom',
                    path: ['externalLink'],
                    message: 'Please enter a valid URL.'
                });
            }
        } catch (e) {
            ctx.addIssue({
                code: 'custom',
                path: ['externalLink'],
                message: 'Please enter a valid URL format.'
            });
        }
    }
  }
});

interface SubmissionFormProps {
    task: Task;
}

export function SubmissionForm({ task }: SubmissionFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();
    const { findSubmissionByTask, updateSubmission } = useSubmissions();

    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('link');

    const submission = useMemo(() => {
        if (!user) return undefined;
        return findSubmissionByTask(task.id, user.id);
    }, [task, user, findSubmissionByTask]);

    const currentRoundNumber = useMemo(() => submission?.currentRound || 1, [submission]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            submissionType: 'link',
        },
    });

    const watchedForm = form.watch();
    useEffect(() => {
        if (submission && submission.status === 'assigned') {
            const hasInput = watchedForm.link || watchedForm.externalLink || watchedForm.file;
            if(hasInput) {
                updateSubmission(submission.id, { status: 'in-progress' });
            }
        }
    }, [watchedForm, submission, updateSubmission]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        form.setValue('submissionType', value as 'link' | 'file' | 'externalLink');
        form.clearErrors(); // Clear errors when switching tabs
        form.resetField('link');
        form.resetField('file');
        form.resetField('externalLink');
    }

    const handleFileSelect = () => {
        form.setValue('file', { name: 'my-project-submission.zip', size: 1024 * 1024 * 2.5 });
    }

    const clearFile = () => {
        form.resetField('file');
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!submission) {
            toast({ title: 'Error', description: 'Could not find submission record for this task.', variant: 'destructive'});
            return;
        }

        setIsLoading(true);
        console.log('Submitting:', values);
        
        await new Promise(resolve => setTimeout(resolve, 1500));

        const isResubmission = ['pending', 'in-review', 'evaluated', 'rejected', 'resubmitted'].includes(submission.status);
        
        let contentValue: string | undefined;
        if (values.submissionType === 'link') contentValue = values.link;
        if (values.submissionType === 'externalLink') contentValue = values.externalLink;
        if (values.submissionType === 'file') contentValue = `/mock-uploads/${values.file?.name}`;

        if (!contentValue) {
            toast({ title: 'Error', description: 'Submission content is missing.', variant: 'destructive'});
            setIsLoading(false);
            return;
        }
        
        const submissionUpdate: Partial<any> = {
            status: isResubmission ? 'resubmitted' : 'pending',
            content: {
                type: values.submissionType as SubmissionContentType,
                value: contentValue,
                ...(values.file && { fileName: values.file.name, fileSize: values.file.size }),
            },
            submittedAt: new Date().toISOString(),
            ...(isResubmission && { resubmittedAt: new Date().toISOString() })
        };

        updateSubmission(submission.id, submissionUpdate);

        toast({
            title: 'Submission Successful!',
            description: `Your work for "${task.title}" has been submitted.`,
        });
        
        setIsLoading(false);
        router.push(`/candidate/submissions/${submission.id}`);
    }

    if (!submission) {
         return (
            <Card>
                <CardHeader>
                    <CardTitle>Unable to Submit</CardTitle>
                    <CardDescription>This task has not been assigned to you.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    const submissionDisabled = ['pending', 'in-review', 'evaluated', 'shortlisted'].includes(submission.status);

    return (
         <Card>
            <CardHeader>
                <CardTitle>
                    {task.multiRound ? `Submit Your Work for Round ${currentRoundNumber}` : 'Submit Your Work'}
                </CardTitle>
                <CardDescription>
                    {submissionDisabled
                        ? 'Your submission is currently under review. You can resubmit if requested.'
                        : 'Once you have completed the task, submit your work here.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <fieldset disabled={submissionDisabled}>
                            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="link">
                                        <Github className="mr-2 h-4 w-4" />
                                        GitHub Repo
                                    </TabsTrigger>
                                    <TabsTrigger value="file">
                                        <UploadCloud className="mr-2 h-4 w-4" />
                                        Upload File
                                    </TabsTrigger>
                                    <TabsTrigger value="externalLink">
                                        <LinkIcon className="mr-2 h-4 w-4" />
                                        External Link
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="link" className="pt-4">
                                    <FormField
                                        control={form.control}
                                        name="link"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>GitHub Repository URL</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="https://github.com/your-username/your-repo" className="pl-10" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>
                                <TabsContent value="file" className="pt-4">
                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Project File</FormLabel>
                                                {field.value ? (
                                                    <div className="flex items-center justify-between rounded-md border p-3">
                                                        <div className="flex items-center gap-3">
                                                            <File className="h-6 w-6 text-primary" />
                                                            <div>
                                                                <p className="text-sm font-medium">{field.value.name}</p>
                                                                <p className="text-xs text-muted-foreground">{(field.value.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={clearFile} type="button">
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <FormControl>
                                                        <div 
                                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
                                                            onClick={handleFileSelect}
                                                        >
                                                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                                                            <p className="text-sm text-muted-foreground mt-2">
                                                                <span className="font-semibold text-primary">Click to select a file</span> (mock)
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">PDF, ZIP, DOCX up to 10MB</p>
                                                        </div>
                                                    </FormControl>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>
                                <TabsContent value="externalLink" className="pt-4">
                                    <FormField
                                        control={form.control}
                                        name="externalLink"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>External Link</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="https://example.com/your-project" className="pl-10" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormDescription>
                                                    Provide a shareable link to your work (e.g., Google Drive, portfolio).
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>
                            </Tabs>
                        </fieldset>
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="ghost" onClick={() => form.reset()} disabled={submissionDisabled}>Clear</Button>
                            <Button type="submit" disabled={isLoading || submissionDisabled}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Work"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
       </Card>
    )
}
