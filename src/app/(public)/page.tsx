import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="container flex flex-col items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-20">
        <h1 className="text-center font-headline text-3xl font-extrabold leading-tight tracking-tighter md:text-6xl">
          Hire the best talent. <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Prove your skills.
          </span>
        </h1>
        <p className="mx-auto max-w-[700px] text-center text-lg text-muted-foreground">
          SkillMatch Pro replaces outdated resumes with real-world tasks.
          Companies find top talent, and candidates showcase their true
          abilities.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/signup">Get Started</Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/login">Explore Tasks</Link>
        </Button>
      </div>
    </section>
  );
}
