

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Logo />
          <nav className="ml-6 hidden items-center space-x-4 lg:flex lg:space-x-6">
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Leaderboard
            </Link>
            <Link
              href="/companies"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Companies
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Blog
            </Link>
            <Link
              href="/badges"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Badges
            </Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-muted/50">
        <div className="container py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="col-span-2 md:col-span-1">
                    <Logo />
                    <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                        The proof-of-skill hiring platform for the modern era.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold">Platform</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="/leaderboard" className="text-muted-foreground hover:text-primary">Leaderboard</Link></li>
                        <li><Link href="/companies" className="text-muted-foreground hover:text-primary">Companies</Link></li>
                        <li><Link href="/pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
                        <li><Link href="/badges" className="text-muted-foreground hover:text-primary">Badges</Link></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold">Company</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                        <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
                        <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold">Legal</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
             <div className="mt-8 flex items-center justify-between border-t pt-8">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} SkillMatch Pro. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    <Link href="#" className="text-muted-foreground hover:text-primary"><Github className="h-5 w-5" /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></Link>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
