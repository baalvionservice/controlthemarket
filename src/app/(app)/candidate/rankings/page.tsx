import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  export default function RankingsPage() {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Rankings
          </h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Platform Leaderboard</CardTitle>
            <CardDescription>
              See how you stack up against other candidates on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">The leaderboard is coming soon.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  