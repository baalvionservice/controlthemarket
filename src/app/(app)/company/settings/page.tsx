'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
    Building, 
    Users, 
    Bell, 
    CreditCard,
    Settings,
    PlusCircle,
    Save
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SchemaFormDialog } from "./schema-form-dialog";
import { mockEvaluationSchemas, mockUsers, mockCompanies } from "@/lib/mock-data"; 
import type { EvaluationSchema, User, Company } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

export default function CompanySettingsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    
    // Mock state for Evaluation Schemas
    const [schemas, setSchemas] = useState<EvaluationSchema[]>(mockEvaluationSchemas);
    const [isSchemaDialogOpen, setIsSchemaDialogOpen] = useState(false);
    const [selectedSchema, setSelectedSchema] = useState<EvaluationSchema | null>(null);

    // Mock company data - in a real app this would be fetched
    const companyData = mockCompanies.find(c => c.id === user?.companyId) || mockCompanies[0];
    const [company, setCompany] = useState(companyData);
    
    // Mock users for the company
    const companyUsers = mockUsers.filter(u => u.companyId === user?.companyId);

    const handleSaveChanges = () => {
        toast({
            title: "Settings Saved",
            description: "Your company settings have been updated.",
        });
    };

    const handleAddNewSchema = () => {
        setSelectedSchema(null);
        setIsSchemaDialogOpen(true);
    };

    const handleEditSchema = (schema: EvaluationSchema) => {
        setSelectedSchema(schema);
        setIsSchemaDialogOpen(true);
    };
    
    const handleSaveSchema = (schemaData: EvaluationSchema) => {
        if (selectedSchema) {
            setSchemas(schemas.map(s => s.id === schemaData.id ? schemaData : s));
        } else {
            setSchemas([...schemas, { ...schemaData, id: `schema-${Date.now()}` }]);
        }
        toast({ title: 'Schema saved successfully!' });
    };

    return (
    <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h2 className="font-headline text-3xl font-bold tracking-tight">
                    Company Settings
                </h2>
                <p className="text-muted-foreground">
                    Manage your company profile, users, and evaluation settings.
                </p>
            </div>
             <div className="flex items-center space-x-2">
                <Button onClick={handleSaveChanges}>
                    <Save className="mr-2 h-4 w-4" /> Save All Changes
                </Button>
            </div>
        </div>
      
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Company Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" />Company Profile</CardTitle>
                    <CardDescription>Update your company's public information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" value={company.name} onChange={e => setCompany({...company, name: e.target.value})}/>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="companyWebsite">Website</Label>
                        <Input id="companyWebsite" value={company.website} onChange={e => setCompany({...company, website: e.target.value})}/>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="companyDescription">Description</Label>
                        <Textarea id="companyDescription" value={company.description} onChange={e => setCompany({...company, description: e.target.value})}/>
                    </div>
                </CardContent>
            </Card>

             {/* User Management Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />User Management</CardTitle>
                    <CardDescription>View users in your organization.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {companyUsers.map(u => (
                        <div key={u.id} className="flex items-center justify-between rounded-md border p-3">
                            <div className="flex items-center gap-3">
                                <p className="font-medium">{u.name}</p>
                                <p className="text-sm text-muted-foreground">{u.email}</p>
                            </div>
                            <Badge variant={u.role === 'company' ? 'default' : 'secondary'}>{u.role === 'company' ? 'Admin' : 'Member'}</Badge>
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button variant="outline">Invite User</Button>
                </CardFooter>
            </Card>

            {/* Notification Settings Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notification Settings</CardTitle>
                    <CardDescription>Manage your company's notification preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="notif-new-submission" className="flex-1">
                            New Submission Received
                        </Label>
                        <Switch id="notif-new-submission" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="notif-deadline" className="flex-1">
                            Task Deadline Reminders
                        </Label>
                        <Switch id="notif-deadline" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="notif-summary" className="flex-1">
                           Weekly Activity Summary
                        </Label>
                        <Switch id="notif-summary" />
                    </div>
                </CardContent>
            </Card>

             {/* Subscription Plan Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Subscription Plan</CardTitle>
                    <CardDescription>Manage your current plan and billing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-md border p-4">
                        <div>
                            <p className="font-bold text-lg">Pro Plan</p>
                            <p className="text-sm text-muted-foreground">$99 / month</p>
                        </div>
                        <Button variant="outline">Manage Subscription</Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Evaluation Schemas Card */}
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />Evaluation Schemas</CardTitle>
                <CardDescription>Manage the criteria and scoring rubrics for your candidate evaluations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {schemas.map(schema => (
                        <Card key={schema.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-base">
                                <span>{schema.name}</span>
                                <Badge variant={schema.isActive ? 'default' : 'outline'}>
                                        {schema.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                </CardTitle>
                                <CardDescription>{schema.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">Criteria ({schema.criteria.length})</h4>
                                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                        {schema.criteria.slice(0, 3).map(crit => <li key={crit.id}>{crit.name}</li>)}
                                        {schema.criteria.length > 3 && <li>...and {schema.criteria.length - 3} more</li>}
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button variant="outline" size="sm" onClick={() => handleEditSchema(schema)}>
                                    <Settings className="mr-2 h-4 w-4" /> Edit
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleAddNewSchema}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create New Schema
                </Button>
            </CardFooter>
        </Card>

       <SchemaFormDialog
            isOpen={isSchemaDialogOpen}
            onOpenChange={setIsSchemaDialogOpen}
            onSave={handleSaveSchema}
            schema={selectedSchema}
        />
    </div>
    );
}
