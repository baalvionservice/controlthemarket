
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Sparkles, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AiAssistantDialog } from './ai-assistant-dialog';
import type { RoleCategory, TaskDifficulty, TaskType, TaskTemplate } from '@/lib/types';
import { mockTemplates } from '@/lib/mock-data';

const roleCategories: RoleCategory[] = ["Engineering", "Design", "Marketing", "Business", "Data"];
const allTaskTypes: TaskType[] = ["Coding", "MCQ", "Design", "Documentation", "Project", "UI", "Component", "Styling", "Feature Implementation", "Campaign Planning", "Content Creation", "Social Media", "Email Marketing", "Ads"];

const roleTaskTypesMap: Record<RoleCategory, TaskType[]> = {
  Engineering: ["Coding", "Project", "Documentation", "UI", "Component", "Styling", "Feature Implementation"],
  Design: ["Design", "Project", "Documentation", "UI", "Styling"],
  Marketing: ["Documentation", "Project", "MCQ", "Campaign Planning", "Content Creation", "Social Media", "Email Marketing", "Ads"],
  Business: ["Documentation", "Project"],
  Data: ["Coding", "Project", "MCQ", "Documentation"],
};

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  roleCategory: z.enum(roleCategories, {required_error: "Please select a role category."}),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {required_error: "Please select a difficulty."}),
  taskTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one task type.',
  }),
  deadline: z.date({ required_error: 'A deadline is required.' }),
  multiRound: z.boolean().default(false),
  // Fields for single-round tasks
  instructions: z.string(),
  expectedOutputs: z.string(),
  timeLimitMinutes: z.coerce.number().positive().int().optional(),
  // Fields for multi-round tasks
  rounds: z.array(z.object({
    instructions: z.string().min(20, 'Instructions must be at least 20 characters.'),
    expectedOutputs: z.string().min(20, 'Expected Outputs must be at least 20 characters.'),
    timeLimitMinutes: z.coerce.number().positive().int().optional(),
  })).optional(),
}).superRefine((data, ctx) => {
  if (data.multiRound) {
    if (!data.rounds || data.rounds.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['rounds'],
        message: 'Multi-round tasks must have at least one round.',
      });
    }
  } else {
    if (data.instructions.length < 20) {
      ctx.addIssue({
        code: 'custom',
        path: ['instructions'],
        message: 'Instructions must be at least 20 characters for a single-round task.',
      });
    }
    if (data.expectedOutputs.length < 20) {
        ctx.addIssue({
          code: 'custom',
          path: ['expectedOutputs'],
          message: 'Expected outputs must be at least 20 characters for a single-round task.',
        });
      }
  }
});


export function CreateTaskForm() {
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [templates] = useState<TaskTemplate[]>(mockTemplates);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      expectedOutputs: '',
      taskTypes: [],
      timeLimitMinutes: undefined,
      multiRound: false,
      rounds: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rounds',
  });

  const watchedRoleCategory = form.watch('roleCategory');
  const watchedMultiRound = form.watch('multiRound');
  
  const availableTaskTypes = useMemo(() => {
    if (!watchedRoleCategory) return [];
    return roleTaskTypesMap[watchedRoleCategory] || [];
  }, [watchedRoleCategory]);

  useEffect(() => {
    const currentSelectedTypes = form.getValues('taskTypes') || [];
    const validSelectedTypes = currentSelectedTypes.filter(type => availableTaskTypes.includes(type as TaskType));
    
    if (currentSelectedTypes.length !== validSelectedTypes.length) {
      form.setValue('taskTypes', validSelectedTypes, { shouldValidate: true });
    }
  }, [watchedRoleCategory, availableTaskTypes, form]);

  function handleLoadTemplate(templateId: string) {
    const template = templates.find(t => t.templateId === templateId);
    if (!template) return;

    form.reset();
    form.setValue('title', template.title, { shouldValidate: true });
    form.setValue('description', template.description, { shouldValidate: true });
    form.setValue('roleCategory', template.roleCategory, { shouldValidate: true });
    form.setValue('difficulty', template.difficulty, { shouldValidate: true });
    form.setValue('taskTypes', template.taskTypes || [], { shouldValidate: true });
    form.setValue('multiRound', template.multiRound || false, { shouldValidate: true });
    
    if (template.multiRound && template.rounds) {
      form.setValue('rounds', template.rounds.map(r => ({...r, timeLimitMinutes: r.timeLimitMinutes || undefined })), { shouldValidate: true });
    } else {
      form.setValue('instructions', template.instructions, { shouldValidate: true });
      form.setValue('expectedOutputs', template.expectedOutputs, { shouldValidate: true });
      form.setValue('timeLimitMinutes', template.timeLimitMinutes || undefined, { shouldValidate: true });
    }
    
    toast({
      title: "Template Loaded",
      description: `The form has been populated with the "${template.title}" template.`,
    });
  }

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
                      placeholder="Provide a general overview of the task and its objectives."
                      className="min-h-[120px]"
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
          
          {/* Instructions and Outputs */}
           <div className="space-y-6 rounded-md border p-6">
                <FormField
                    control={form.control}
                    name="multiRound"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Multi-Round Task</FormLabel>
                            <FormDescription>
                            Enable this to create a task with multiple sequential rounds.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                />
               
               {!watchedMultiRound ? (
                 <>
                    <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Provide detailed, step-by-step instructions for the candidate."
                                className="min-h-[150px]"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="expectedOutputs"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Expected Outputs</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Describe the final deliverables (e.g., 'A link to a GitHub repository', 'A PDF document')."
                                className="min-h-[100px]"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                 </>
               ) : (
                <div className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="rounded-md border bg-muted/50 p-4 space-y-4 relative">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium">Round {index + 1}</h4>
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                           
                            <FormField
                                control={form.control}
                                name={`rounds.${index}.instructions`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instructions</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder={`Instructions for round ${index + 1}`} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`rounds.${index}.expectedOutputs`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expected Outputs</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder={`Expected outputs for round ${index + 1}`} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`rounds.${index}.timeLimitMinutes`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Time Limit (minutes)</FormLabel>
                                    <FormControl>
                                      <Input type="number" placeholder="e.g., 60" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ instructions: '', expectedOutputs: '', timeLimitMinutes: undefined })}
                    >
                        Add Round
                    </Button>
                    <FormMessage>{form.formState.errors.rounds?.message}</FormMessage>
                </div>
               )}
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
                      {watchedRoleCategory
                        ? 'Choose one or more types that apply to this task.'
                        : 'Please select a Role/Position to see available task types.'}
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {allTaskTypes.map((item) => {
                    const isEnabled = availableTaskTypes.includes(item);
                    return (
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
                                  disabled={!isEnabled}
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
                              <FormLabel className={cn("font-normal", !isEnabled && "text-muted-foreground/50")}>
                                {item}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    );
                  })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Timing */}
          <div className="space-y-6 rounded-md border p-6">
            <h3 className="text-lg font-medium">Timing</h3>
             <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
               <FormField
                control={form.control}
                name="timeLimitMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Time Limit (in minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 120" {...field} disabled={watchedMultiRound} />
                    </FormControl>
                    <FormDescription>
                      For single-round tasks. Leave blank for no time limit.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                              'w-full pl-3 text-left font-normal',
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
                     <FormDescription>
                       The final date candidates can submit their work.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Templates */}
          <div className="space-y-6 rounded-md border p-6">
            <h3 className="text-lg font-medium">Templates</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Load from Template</Label>
                <Select onValueChange={handleLoadTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template to pre-fill the form" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.templateId} value={template.templateId}>{template.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Selecting a template will overwrite existing content in the form.
                </p>
              </div>
              <div className="pt-4">
                <Button type="button" variant="outline" disabled>Save as Template</Button>
                 <p className="text-sm text-muted-foreground pt-2">
                    Save the current task configuration as a template for future use.
                 </p>
              </div>
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
