'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Edit } from 'lucide-react';
import type { SubmissionStatus } from '@/lib/types';
import type { AdminSubmissionData } from './page';

const statuses: (SubmissionStatus | 'All')[] = ["All", "assigned", "in-progress", "pending", "in-review", "evaluated", "shortlisted", "rejected", "resubmitted", "moved-to-next-round"];


export function AdminSubmissionsList({ data }: { data: AdminSubmissionData[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'All'>('All');
  
  const getStatusVariant = (status: SubmissionStatus): 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' | 'purple' => {
     switch (status) {
      case 'shortlisted': return 'default';
      case 'moved-to-next-round': return 'purple';
      case 'in-review':
      case 'evaluated':
        return 'secondary';
      case 'pending':
      case 'resubmitted':
      case 'in-progress':
        return 'warning';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  }

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.company.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
  }, [data, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search by candidate, task, or company..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SubmissionStatus | 'All')}>
            <SelectTrigger className="w-full md:w-[240px]">
                <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
                {statuses.map(status => <SelectItem key={status} value={status} className="capitalize">{status.replace('-', ' ')}</SelectItem>)}
            </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={item.candidate.profile?.avatarUrl} alt={item.candidate.name} />
                            <AvatarFallback>{item.candidate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{item.candidate.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.task.title}</TableCell>
                  <TableCell>{item.company.name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)} className="capitalize">{item.status.replace('-', ' ')}</Badge>
                  </TableCell>
                  <TableCell>{item.score ? `${item.score}/100` : 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                       <Link href={`/admin/submissions/${item.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Override
                       </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No submissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
