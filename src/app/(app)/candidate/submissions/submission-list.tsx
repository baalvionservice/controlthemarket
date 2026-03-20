'use client';

import { useState, useMemo } from 'react';
import type { SubmissionWithDetails } from './page';
import type { SubmissionStatus, TaskDifficulty } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

const statuses: (SubmissionStatus | 'All')[] = ["All", "assigned", "in-progress", "pending", "in-review", "evaluated", "shortlisted", "rejected", "resubmitted"];
const difficulties: (TaskDifficulty | 'All')[] = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];

export function SubmissionList({ submissions }: { submissions: SubmissionWithDetails[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'All'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<TaskDifficulty | 'All'>('All');

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
        const task = sub.task;
        if (!task) return false;

        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
        const matchesDifficulty = difficultyFilter === 'All' || task.difficulty === difficultyFilter;
        
        return matchesSearch && matchesStatus && matchesDifficulty;
    }).sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }, [submissions, searchTerm, statusFilter, difficultyFilter]);

   const getStatusVariant = (status: SubmissionStatus) => {
    switch (status) {
      case 'evaluated':
      case 'shortlisted':
      case 'pending': // Submitted
      case 'resubmitted':
        return 'default'; // Blue-ish for "completed" user actions
      case 'in-progress':
      case 'in-review':
        return 'secondary'; // Neutral Gray for active states
      case 'assigned':
        return 'outline'; // Lightest gray for initial state
      case 'rejected':
        return 'destructive'; // Red
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by task title..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SubmissionStatus | 'All')}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(status => <SelectItem key={status} value={status} className="capitalize">{status.replace('-', ' ')}</SelectItem>)}
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

      <div className="rounded-md border">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.task?.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{sub.task?.difficulty}</Badge>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>{format(new Date(sub.lastUpdated), 'PPP')}</TooltipTrigger>
                        <TooltipContent>
                           <div className="flex flex-col gap-1 text-xs">
                              {sub.submittedAt && <p>Submitted: {format(new Date(sub.submittedAt), 'PPp')}</p>}
                              {sub.resubmittedAt && <p>Resubmitted: {format(new Date(sub.resubmittedAt), 'PPp')}</p>}
                              <p>Assigned: {format(new Date(sub.assignedAt), 'PPp')}</p>
                           </div>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(sub.status)} className="capitalize">
                        {sub.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sub.evaluation ? `${sub.evaluation.score}/100` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/candidate/submissions/${sub.id}`}>
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                  <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                          No tasks found.
                      </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>
    </div>
  );
}
