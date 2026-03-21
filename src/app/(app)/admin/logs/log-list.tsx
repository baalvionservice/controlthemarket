
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import type { ExecutionLogData } from './page';
import { getStatusVariant } from '../submissions/submission-list';

export function AdminExecutionLogsList({ data }: { data: ExecutionLogData[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.task.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    }).sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
  }, [data, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
             <div className="relative flex-1 md:grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search candidate or task..."
                    className="pl-10 min-w-[200px] md:min-w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
      </div>

       <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Session Status</TableHead>
              <TableHead>Log Summary</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar><AvatarImage src={item.candidate.profile?.avatarUrl} alt={item.candidate.name} /><AvatarFallback>{item.candidate.name.charAt(0)}</AvatarFallback></Avatar>
                        <span className="font-medium">{item.candidate.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{item.task.title}</div>
                    <div className="text-sm text-muted-foreground">{item.company.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)} className="capitalize">{item.status.replace('-', ' ')}</Badge>
                  </TableCell>
                  <TableCell>{item.logSummary}</TableCell>
                  <TableCell>{format(new Date(item.applicationDate), 'PPp')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/submissions/${item.id}`}>View Logs</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">No logs found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
