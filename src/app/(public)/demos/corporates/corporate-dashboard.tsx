'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, AlertTriangle, Info, Bell, Users, Briefcase } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Data types based on page.tsx
interface CorporateClient {
    id: string;
    name: string;
    industry: string;
    location: string;
    open_positions: number;
    pain_points: string[];
}

interface PipelineCandidate {
    id: string;
    name: string;
    topSkill: string;
    status: string;
    assessmentScore: number;
}

interface ChartData {
    assessmentResults: { name: string; value: number }[];
    openPositions: { name: string; value: number }[];
    candidatesProcessed: { name: string; value: number }[];
}

interface Alert {
    id: string;
    severity: 'low' | 'warning' | 'high';
    message: string;
}

interface CorporateDashboardProps {
    clients: CorporateClient[];
    pipeline: PipelineCandidate[];
    chartData: ChartData;
    alerts: Alert[];
}

const industryFilters = ["All", "Tech", "Product", "Consulting", "BPO", "Startup", "FinTech"];

export function CorporateDashboard({ clients, pipeline, chartData, alerts }: CorporateDashboardProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [industryFilter, setIndustryFilter] = useState('All');

    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesIndustry = industryFilter === 'All' || client.industry === industryFilter;
            return matchesSearch && matchesIndustry;
        });
    }, [clients, searchTerm, industryFilter]);
    
    const getAlertIcon = (severity: 'low' | 'warning' | 'high') => {
        switch(severity) {
            case 'high': return <AlertTriangle className="h-5 w-5 text-destructive" />;
            case 'warning': return <Bell className="h-5 w-5 text-yellow-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    }

    const COLORS: { [key: string]: string } = {
        'Passed': '#00C49F',
        'Failed': '#FF8042',
        'Pending': '#FFBB28'
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Corporate Client Pain Points</CardTitle>
                    <CardDescription>A list of example corporate clients and their primary challenges in hiring.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col gap-4 md:flex-row mb-6">
                        <div className="relative flex-1 md:grow-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by company name..."
                                className="pl-10 min-w-[200px] md:min-w-[300px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={industryFilter} onValueChange={setIndustryFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by industry" />
                            </SelectTrigger>
                            <SelectContent>
                                {industryFilters.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Industry</TableHead>
                                    <TableHead>Open Positions</TableHead>
                                    <TableHead>Key Pain Points</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.map(client => (
                                <TableRow key={client.id}>
                                    <TableCell>
                                        <p className="font-medium">{client.name}</p>
                                        <p className="text-sm text-muted-foreground">{client.location}</p>
                                    </TableCell>
                                    <TableCell><Badge variant="outline">{client.industry}</Badge></TableCell>
                                    <TableCell className="font-medium text-center">{client.open_positions}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {client.pain_points.map(point => <Badge key={point} variant="secondary">{point}</Badge>)}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Mock Admin Dashboard</CardTitle>
                        <CardDescription>A simulated view of a corporate HR dashboard, powered by SkillMatch Pro.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2"><Briefcase className="h-4 w-4" /> Assessment Results</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie data={chartData.assessmentResults} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                                {chartData.assessmentResults.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />)}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Candidate Pipeline</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Candidate</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pipeline.slice(0,4).map(p => (
                                                <TableRow key={p.id}>
                                                    <TableCell className="font-medium">{p.name}</TableCell>
                                                    <TableCell><Badge variant="outline">{p.status}</Badge></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                         <div>
                            <h3 className="font-semibold text-lg mb-4">Open Positions by Industry</h3>
                             <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData.openPositions}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                           <h3 className="font-semibold text-lg mb-4">Candidates Processed per Week</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={chartData.candidatesProcessed}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                 <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Alerts & Notifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {alerts.map(alert => (
                                <div key={alert.id} className="flex items-start gap-3 rounded-md border p-3">
                                    {getAlertIcon(alert.severity)}
                                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Mock API Endpoints</CardTitle>
                            <CardDescription>Example API endpoints that would power this dashboard.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs font-mono bg-muted p-4 rounded-md">
                            <p><span className="font-bold text-green-600">GET</span> /api/corporates</p>
                            <p><span className="font-bold text-green-600">GET</span> /api/company/:id/candidates</p>
                            <p><span className="font-bold text-green-600">GET</span> /api/company/:id/analytics</p>
                            <p><span className="font-bold text-blue-600">POST</span> /api/company/:id/candidate-status</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
