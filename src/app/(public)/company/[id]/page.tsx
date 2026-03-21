
import { getCompany, getTasksByCompany, getUsers } from '@/lib/api';
import { notFound } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Briefcase,
    MapPin,
    Eye,
    Users,
    CheckCircle,
    BarChart2,
    Star
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


export default async function CompanyProfilePage({ params }: { params: { id: string } }) {
    const company = await getCompany(params.id);

    if (!company) {
        notFound();
    }
    
    // Mock data for this profile page
    const tasks = await getTasksByCompany(company.id);
    const activeTasks = tasks.filter(t => t.status === 'published').length;
    const candidatesEvaluated = 128; // mock
    const hiringSuccessRate = 15; // mock percentage
    
    const topHires = (await getUsers()).filter(u => u.role === 'candidate').slice(0, 3);

    return (
        <div className="flex-1 bg-muted/20 pb-20">
            {/* Header section */}
            <div className="relative h-48 w-full bg-muted">
                 <Image src={`https://picsum.photos/seed/${company.id}/1200/300`} alt={`${company.name} banner`} layout="fill" objectFit="cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            
            <div className="container -mt-16">
                 {/* Main company info card */}
                 <Card className="overflow-hidden">
                    <CardHeader className="flex flex-col md:flex-row items-start gap-6">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                            <AvatarImage src={company.logoUrl} alt={company.name} />
                            <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h1 className="font-headline text-3xl font-bold">{company.name}</h1>
                            <p className="text-muted-foreground">{company.description}</p>
                            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                {company.industry && <div className="flex items-center gap-2"><Briefcase className="h-4 w-4" /><span>{company.industry}</span></div>}
                                {company.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{company.location}</span></div>}
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <Button variant="outline">Follow (Mock)</Button>
                             <Button>View Jobs</Button>
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                     {/* Hiring Activity Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hiring Activity</CardTitle>
                                <CardDescription>An overview of {company.name}'s engagement on the platform.</CardDescription>
                            </CardHeader>
                             <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="text-center">
                                    <CardHeader><CardTitle>{activeTasks}</CardTitle></CardHeader>
                                    <CardContent><p className="text-sm text-muted-foreground">Open Roles</p></CardContent>
                                </Card>
                                 <Card className="text-center">
                                    <CardHeader><CardTitle>{candidatesEvaluated}</CardTitle></CardHeader>
                                    <CardContent><p className="text-sm text-muted-foreground">Candidates Evaluated</p></CardContent>
                                </Card>
                                 <Card className="text-center">
                                    <CardHeader><CardTitle>{hiringSuccessRate}%</CardTitle></CardHeader>
                                    <CardContent><p className="text-sm text-muted-foreground">Success Rate</p></CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                        
                         {/* Top Candidates Hired Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Candidates Hired (Mock)</CardTitle>
                                <CardDescription>A showcase of talent hired through SkillMatch Pro.</CardDescription>
                            </CardHeader>
                             <CardContent className="space-y-4">
                                {topHires.map(user => (
                                    <div key={user.id} className="flex items-center justify-between rounded-md border p-3">
                                        <div className="flex items-center gap-3">
                                             <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.profile?.avatarUrl} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">Frontend Developer</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 font-bold text-lg">
                                            <Star className="h-5 w-5 text-yellow-500" />
                                            <span>92</span>
                                        </div>
                                         <Button asChild variant="ghost" size="sm">
                                            <Link href={`/candidate/${user.id}`}>View Profile</Link>
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Side Panel */}
                    <div className="space-y-8">
                        <Card>
                             <CardHeader>
                                <CardTitle>Active Tasks</CardTitle>
                            </CardHeader>
                             <CardContent className="space-y-3">
                                {tasks.filter(t => t.status === 'published').slice(0,5).map(task => (
                                    <div key={task.id}>
                                        <p className="font-medium">{task.title}</p>
                                        <p className="text-sm text-muted-foreground">{task.roleCategory}</p>
                                    </div>
                                ))}
                                {tasks.length === 0 && <p className="text-sm text-muted-foreground">No active tasks.</p>}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
