'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Github, Link as LinkIcon, UploadCloud, File, X, Loader2 } from 'lucide-react';
import type { Task } from '@/lib/types';

const formSchema = z.object({
  submissionType: z.enum(['link', 'file']),
  link: z.string().url('Please enter a valid URL.').optional(),
  // Mock file object
  file: z.object({
    name: z.string(),
    size: z.number(),
  }).optional(),
}).superRefine((data, ctx) => {
  if (data.submissionType === 'link' && !data.link) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['link'],
      message: 'A URL is required for link submissions.',
    });
  }
  if (data.submissionType === 'file' && !data.file) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['file'],
      message: 'A file is required for file uploads.',
    });
  }
});

interface SubmissionFormProps {
    task: Task;
}

export function SubmissionForm({ task }: SubmissionFormProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('link');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            submissionType: 'link',
        },
    });

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        form.setValue('submissionType', value as 'link' | 'file');
        form.clearErrors(); // Clear errors when switching tabs
        form.resetField('link');
        form.resetField('file');
    }

    // Mock file selection
    const handleFileSelect = () => {
        form.setValue('file', { name: 'my-project-submission.zip', size: 1024 * 1024 * 2.5 });
    }

    const clearFile = () => {
        form.resetField('file');
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        console.log('Submitting:', values);
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: 'Submission Successful!',
            description: `Your work for "${task.title}" has been submitted.`,
        });
        
        setIsLoading(false);
        form.reset();
    }

    return (
         <Card>
            <CardHeader>
                <CardTitle>Submit Your Work</CardTitle>
                <CardDescription>Once you have completed the task, submit your work here.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="link">
                                    <LinkIcon className="mr-2 h-4 w-4" />
                                    Submit Link
                                </TabsTrigger>
                                <TabsTrigger value="file">
                                    <UploadCloud className="mr-2 h-4 w-4" />
                                    Upload File
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="link" className="pt-4">
                                <FormField
                                    control={form.control}
                                    name="link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Repository or Project URL</FormLabel>
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
                                                    <Button variant="ghost" size="icon" onClick={clearFile}>
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
                        </Tabs>
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="ghost" onClick={() => form.reset()}>Clear</Button>
                            <Button type="submit" disabled={isLoading}>
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
