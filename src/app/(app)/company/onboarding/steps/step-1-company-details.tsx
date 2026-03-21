'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { OnboardingData } from '../onboarding-flow';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
    companyName: z.string().min(2, 'Company name must be at least 2 characters.'),
    companyWebsite: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
    companyDescription: z.string().min(10, 'Description must be at least 10 characters.').optional().or(z.literal('')),
});

interface Step1Props {
    onNext: (data: Partial<OnboardingData>) => void;
    data: OnboardingData;
}

export function Step1CompanyDetails({ onNext, data }: Step1Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: data.companyName,
            companyWebsite: data.companyWebsite,
            companyDescription: data.companyDescription,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        onNext(values);
    }
    
    return (
        <Form {...form}>
            <form id="step-0-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl><Input placeholder="Your Company Inc." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="companyWebsite"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Website</FormLabel>
                            <FormControl><Input placeholder="https://yourcompany.com" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="companyDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Description</FormLabel>
                            <FormControl><Textarea placeholder="What does your company do?" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
