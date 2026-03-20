import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  export default function SettingsPage() {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Settings
          </h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Company Settings</CardTitle>
            <CardDescription>
              Manage your company profile, billing, and team members here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This feature is coming soon.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  