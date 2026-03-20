'use client';

import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TaskCard } from './task-card';
import type { Task, RoleCategory, TaskDifficulty } from '@/lib/types';
import { Search } from 'lucide-react';

export type TaskWithCompany = Task & {
  companyName: string;
  companyLogo?: string;
};

const roleCategories: (RoleCategory | 'All')[] = ["All", "Engineering", "Design", "Marketing", "Business", "Data"];
const difficulties: (TaskDifficulty | 'All')[] = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];


export function TaskList({ tasks }: { tasks: TaskWithCompany[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleCategory | 'All'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<TaskDifficulty | 'All'>('All');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || task.roleCategory === roleFilter;
      const matchesDifficulty = difficultyFilter === 'All' || task.difficulty === difficultyFilter;
      return matchesSearch && matchesRole && matchesDifficulty;
    });
  }, [tasks, searchTerm, roleFilter, difficultyFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title or company..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as RoleCategory | 'All')}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            {roleCategories.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={(value) => setDifficultyFilter(value as TaskDifficulty | 'All')}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map(diff => <SelectItem key={diff} value={diff}>{diff}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <h3 className="text-xl font-semibold">No Tasks Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
