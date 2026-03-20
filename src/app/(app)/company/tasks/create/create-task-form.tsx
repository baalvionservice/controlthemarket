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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AiAssistantDialog } from './ai-assistant-dialog';
import type { RoleCategory, TaskDifficulty, TaskType } from '@/lib/types';

const roleCategories: RoleCategory[] = ["Engineering", "Design", "Marketing", "Business", "Data"];
const taskTypes: TaskType[] = ["Coding", "MCQ", "Design", "Documentation", "Project"];

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  roleCategory: z.enum(roleCategories, {required_error: "Please select a role category."}),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {required_error: "Please select a difficulty."}),
  taskTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one task type.',
  }),
  deadline: z.date({ required_error: 'A deadline is required.' }),
});

export function CreateTaskForm() {
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      taskTypes: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would differentiate between "Save Draft" and "Publish"
    console.log(values);
    toast({
      title: 'Task Action!',
      description: `The task "${values.title}" has been processed.`,
    });
    // form.reset(); // Commented out to inspect form state after submission
  }
  
  const handleDescriptionUpdate = (newDescription: string) => {
    form.setValue('description', newDescription, { shouldValidate: true });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Task Information */}
          <div className="space-y-6 rounded-md border p-6">
            <h3 className="text-lg font-medium">Task Information</h3>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Build a Responsive Navbar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span>Task Description</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsAiDialogOpen(true)}>
                      <Sparkles className="mr-2 h-4 w-4 text-primary" />
                      Generate with AI
                    </Button>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the task in detail, including instructions and expected outputs."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="roleCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role/Position</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleCategories.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a difficulty level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Task Type */}
          <div className="space-y-6 rounded-md border p-6">
             <h3 className="text-lg font-medium">Task Type</h3>
            <FormField
              control={form.control}
              name="taskTypes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Select Task Types</FormLabel>
                    <FormDescription>
                      Choose one or more types that apply to this task.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {taskTypes.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="taskTypes"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Timing */}
          <div className="space-y-6 rounded-md border p-6">
            <h3 className="text-lg font-medium">Timing</h3>
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Submission Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal md:w-1/2',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Templates */}
          <div className="space-y-4 rounded-md border p-6">
            <h3 className="text-lg font-medium">Templates</h3>
             <FormDescription>
                Save your task configuration as a template for future use.
            </FormDescription>
            <div className="flex gap-4">
                <Button type="button" variant="outline" disabled>Save as Template</Button>
                <Button type="button" variant="outline" disabled>Load from Template</Button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost">Cancel</Button>
            <Button type="submit" variant="secondary" onClick={() => console.log('Saving as draft...')}>Save Draft</Button>
            <Button type="submit" onClick={() => console.log('Publishing task...')}>Publish Task</Button>
          </div>
        </form>
      </Form>
      <AiAssistantDialog 
        isOpen={isAiDialogOpen} 
        onOpenChange={setIsAiDialogOpen} 
        onDescriptionUpdate={handleDescriptionUpdate}
        initialTitle={form.watch('title')}
      />
    </>
  );
}
