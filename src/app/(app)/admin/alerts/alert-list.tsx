'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { DateRange } from "react-day-picker";
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Calendar as CalendarIcon, Check, Shield, AlertTriangle, User, Briefcase, Building, FileText } from 'lucide-react';
import type { AlertType, AlertPriority, AlertStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import type { AlertWithDetails } from './page';
import { cn } from '@/lib/utils';

const alertTypes: (AlertType | 'All')[] = ["All", "task_deadline", "new_submission", "user_signup", "system_warning", "flagged_submission"];
const priorities: (AlertPriority | 'All')[] = ["All", "High", "Medium", "Low"];
const statuses: (AlertStatus | 'All')[] = ["All", "New", "Acknowledged", "Resolved"];

const getPriorityVariant = (priority: AlertPriority) => {
    switch (priority) {
        case 'High': return 'destructive';
        case 'Medium': return 'warning';
        case 'Low': return 'default';
        default: return 'outline';
    }
}
const getStatusVariant = (status: AlertStatus) => {
    switch(status) {
        case 'New': return 'default';
        case 'Acknowledged': return 'secondary';
        case 'Resolved': return 'outline';
        default: return 'outline';
    }
}
const getRelatedEntityIcon = (type: AlertWithDetails['relatedEntity']['type']) => {
    switch(type) {
        case 'Task': return <Briefcase className="h-4 w-4" />;
        case 'User': return <User className="h-4 w-4" />;
        case 'Company': return <Building className="h-4 w-4" />;
        case 'Submission': return <FileText className="h-4 w-4" />;
        case 'System': return <Shield className="h-4 w-4" />;
        default: return <AlertTriangle className="h-4 w-4" />;
    }
}


export function AlertList({ initialData }: { initialData: AlertWithDetails[] }) {
  const [data, setData] = useState<AlertWithDetails[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<AlertType | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<AlertPriority | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'All'>('All');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { toast } = useToast();

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      const matchesDate = (() => {
        if (!dateRange?.from) return true;
        const itemDate = new Date(item.timestamp);
        itemDate.setHours(0,0,0,0);
        if (dateRange.to) {
            return itemDate >= dateRange.from && itemDate <= dateRange.to;
        }
        return itemDate.getTime() === dateRange.from.getTime();
      })();

      return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesDate;
    }).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [data, searchTerm, typeFilter, priorityFilter, statusFilter, dateRange]);

  const handleStatusChange = (alertId: string, newStatus: AlertStatus) => {
    setData(prev => prev.map(item => item.id === alertId ? { ...item, status: newStatus } : item));
    toast({
        title: `Alert ${newStatus}`,
        description: `Alert ID ${alertId} has been marked as ${newStatus}.`
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center">
         <div className="relative flex-1 md:grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search alerts..."
                className="pl-10 min-w-[200px] md:min-w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as AlertType | 'All')}>
            <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
                {alertTypes.map(type => <SelectItem key={type} value={type} className="capitalize">{type.replace('_', ' ')}</SelectItem>)}
            </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as AlertPriority | 'All')}>
            <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
                {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
        </Select>
         <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AlertStatus | 'All')}>
            <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
                {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
        </Select>
         <Popover>
            <PopoverTrigger asChild>
                <Button id="date" variant={"outline"} className={cn("w-full justify-start text-left font-normal md:w-[240px]", !dateRange && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : (format(dateRange.from, "LLL dd, y"))) : (<span>Filter by date</span>)}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2}/>
            </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Related Entity</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id} className={cn(item.status === 'New' && 'bg-accent/50')}>
                  <TableCell>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-sm">{item.description}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(item.priority)}>{item.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                  </TableCell>
                   <TableCell>
                    <div className="flex items-center gap-2">
                        {getRelatedEntityIcon(item.relatedEntity.type)}
                        <span className="font-medium">{item.relatedEntity.name || item.relatedEntity.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(item.timestamp), 'PPp')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'Acknowledged')} disabled={item.status === 'Acknowledged' || item.status === 'Resolved'}>
                            <Check className="mr-2 h-4 w-4"/> Acknowledge
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'Resolved')} disabled={item.status === 'Resolved'}>
                            <Shield className="mr-2 h-4 w-4"/> Resolve
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No alerts found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
