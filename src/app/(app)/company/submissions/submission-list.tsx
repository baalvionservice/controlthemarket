'use client';

import { useState, useMemo } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import type { SubmissionStatus, RoleCategory } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import type { EvaluationData } from './page';

type SortKey = 'candidate.name' | 'score' | 'applicationDate';
type SortDirection = 'asc' | 'desc';

const statuses: (SubmissionStatus | 'All')[] = ["All", "pending", "in-review", "evaluated", "shortlisted", "rejected", "resubmitted"];
const roles: (RoleCategory | 'All')[] = ["All", "Engineering", "Design", "Marketing", "Business", "Data"];

export function CompanySubmissionsList({ data }: { data: EvaluationData[] }) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'All'>('All');
  const [roleFilter, setRoleFilter] = useState<RoleCategory | 'All'>('All');
  const [sortKey, setSortKey] = useState<SortKey>('applicationDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter(item => {
      const matchesSearch = item.candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesRole = roleFilter === 'All' || item.task.roleCategory === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });

    return filtered.sort((a, b) => {
      let valA, valB;
      if (sortKey === 'candidate.name') {
        valA = a.candidate.name;
        valB = b.candidate.name;
      } else if (sortKey === 'score') {
        valA = a.score || 0;
        valB = b.score || 0;
      } else { // applicationDate
        valA = new Date(a.applicationDate).getTime();
        valB = new Date(b.applicationDate).getTime();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, searchTerm, statusFilter, roleFilter, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getStatusVariant = (status: SubmissionStatus): 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' => {
     switch (status) {
      case 'evaluated':
      case 'shortlisted': // Completed -> green
        return 'default'; 
      case 'in-review': // In Progress -> blue
        return 'secondary';
      case 'pending': // Pending -> yellow
      case 'resubmitted':
        return 'warning';
      case 'rejected': // Rejected -> red
        return 'destructive';
      default:
        return 'outline';
    }
  }

  const handleBulkAction = (action: 'Shortlist' | 'Reject') => {
    if (selectedRows.size === 0) return;
    toast({
        title: `Bulk Action: ${action}`,
        description: `Mock action to ${action.toLowerCase()} ${selectedRows.size} candidate(s).`
    });
    setSelectedRows(new Set());
  }
  
  const toggleRow = (id: string) => {
    setSelectedRows(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredAndSortedData.length) {
        setSelectedRows(new Set());
    } else {
        setSelectedRows(new Set(filteredAndSortedData.map(item => item.id)));
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 md:flex-row justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
             <div className="relative flex-1 md:grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by candidate name..."
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
                    {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SubmissionStatus | 'All')}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    {statuses.map(status => <SelectItem key={status} value={status} className="capitalize">{status.replace('-', ' ')}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          {selectedRows.size > 0 && (
             <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleBulkAction('Shortlist')}>Shortlist ({selectedRows.size})</Button>
                <Button variant="destructive" onClick={() => handleBulkAction('Reject')}>Reject ({selectedRows.size})</Button>
             </div>
          )}
      </div>

      {/* Table */}
       <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedRows.size > 0 && selectedRows.size === filteredAndSortedData.length}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
              </TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('candidate.name')}>
                    Candidate
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Applied Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('score')}>
                    Score
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('applicationDate')}>
                    Submitted
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((item) => (
                <TableRow key={item.id} data-state={selectedRows.has(item.id) && "selected"}>
                  <TableCell>
                      <Checkbox
                        checked={selectedRows.has(item.id)}
                        onCheckedChange={() => toggleRow(item.id)}
                        aria-label="Select row"
                      />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={item.candidate.avatarUrl} alt={item.candidate.name} />
                            <AvatarFallback>{item.candidate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{item.candidate.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.task.roleCategory}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)} className="capitalize">{item.status.replace('-', ' ')}</Badge>
                  </TableCell>
                  <TableCell>{item.score ? `${item.score}/100` : 'N/A'}</TableCell>
                  <TableCell>{format(new Date(item.applicationDate), 'PPP')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                           <Link href={`/company/submissions/${item.id}`}>Start Evaluation</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Send Feedback</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No evaluations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
