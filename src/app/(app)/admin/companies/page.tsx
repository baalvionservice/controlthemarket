import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  export default function ManageCompaniesPage() {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Manage Companies
          </h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Companies</CardTitle>
            <CardDescription>
              This is where company management functionality will be displayed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Company management table is coming soon.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  