
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Briefcase, FileText } from 'lucide-react';
import type { AdminCompanyData } from './page';

interface TenantDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tenant: AdminCompanyData | null;
}

export function TenantDetailDialog({ isOpen, onOpenChange, tenant }: TenantDetailDialogProps) {
  if (!tenant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={tenant.logoUrl} alt={tenant.name} />
              <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{tenant.name}</DialogTitle>
              <DialogDescription>
                Tenant ID: {tenant.id}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{tenant.userCount}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tasks</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{tenant.taskCount}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{tenant.submissionCount}</div>
                </CardContent>
            </Card>
        </div>
        <div className="mt-4">
            <h4 className="font-medium mb-2">Tenant Data (Mock Isolation)</h4>
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
                <p>This view demonstrates data isolation. In a real multi-tenant application, all data queries for this tenant would be strictly scoped to <strong>Tenant ID: {tenant.id}</strong>. This ensures that one tenant cannot access another tenant's data.</p>
                <p className="mt-2">For example, fetching tasks would be equivalent to:</p>
                <code className="block bg-muted p-2 rounded-md mt-1 text-xs">SELECT * FROM tasks WHERE tenant_id = '{tenant.id}';</code>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
