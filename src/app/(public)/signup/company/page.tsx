import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function CompanySignupPage() {
  return (
    <div className="container flex h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-headline">Company Signup</CardTitle>
          <CardDescription>
            This feature is coming soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            We're putting the finishing touches on our company portal. Check back soon to start finding top talent.
          </p>
           <div className="mt-4 text-center text-sm">
            <Link href="/signup" className="underline">
              Back to signup options
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
