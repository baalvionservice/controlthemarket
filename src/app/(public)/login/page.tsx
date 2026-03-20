'use client';

import { useAuth, type LoginCredentials } from '@/contexts/auth-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { Loader2, User, Briefcase, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '@/lib/mock-data';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const handleLogin = async (userId: string) => {
    setIsSubmitting(userId);
    const user = mockUsers.find((u) => u.id === userId);

    if (user) {
      const result = await login({ email: user.email, password: 'password' }); // Password is not checked in mock auth
      if (!result.success) {
        toast({
          title: 'Login Failed',
          description: result.message,
          variant: 'destructive',
        });
        setIsSubmitting(null);
      }
      // On success, auth context handles redirection
    } else {
       toast({
        title: 'Login Failed',
        description: 'Mock user not found.',
        variant: 'destructive',
      });
      setIsSubmitting(null);
    }
  };

  return (
    <div className="container flex h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Log In As</CardTitle>
          <CardDescription>
            Select a mock role to log in instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <Button
            className="w-full"
            onClick={() => handleLogin('user-1')}
            disabled={!!isSubmitting}
          >
            {isSubmitting === 'user-1' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <User className="mr-2 h-4 w-4" />
            )}
            Log in as Candidate
          </Button>
           <Button
            variant="secondary"
            className="w-full"
            onClick={() => handleLogin('user-2')}
            disabled={!!isSubmitting}
          >
            {isSubmitting === 'user-2' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Briefcase className="mr-2 h-4 w-4" />
            )}
            Log in as Company
          </Button>
           <Button
            variant="secondary"
            className="w-full"
            onClick={() => handleLogin('user-3')}
            disabled={!!isSubmitting}
          >
            {isSubmitting === 'user-3' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Shield className="mr-2 h-4 w-4" />
            )}
            Log in as Admin
          </Button>
        </CardContent>
        <div className="p-6 pt-0 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
