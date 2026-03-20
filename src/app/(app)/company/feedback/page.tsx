import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  export default function FeedbackPage() {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Feedback
          </h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Feedback Management</CardTitle>
            <CardDescription>
              This is where you would manage feedback templates and history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This feature is coming soon.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  