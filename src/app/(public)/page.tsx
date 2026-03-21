
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import {
  BarChart2,
  BrainCircuit,
  Briefcase,
  CheckCircle,
  FileText,
  ShieldCheck,
  Trophy,
  Award
} from 'lucide-react';
import Image from 'next/image';

export default function PlatformLandingPage() {
  const features = [
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: 'Real-World Tasks',
      description: 'Candidates solve practical, role-specific challenges instead of writing cover letters.',
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      title: 'Data-Driven Analytics',
      description: 'Companies get objective insights into candidate performance and skill levels.',
    },
    {
      icon: <Trophy className="h-8 w-8 text-primary" />,
      title: 'Competitive Leaderboards',
      description: 'Top performers are showcased, creating a pool of proven talent.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: 'Verified Profiles',
      description: 'Skills and achievements are validated through performance on actual tasks.',
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Trust Badges',
      description: 'Candidates earn badges for achievements, building credibility and trust.',
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Insights',
      description: 'Leverage AI to get preliminary feedback and scoring on submissions.',
    },
  ];
  
  const testimonials = [
      {
          quote: "SkillMatch Pro transformed our hiring process. We now hire faster and with more confidence than ever before.",
          name: "Jane Doe",
          title: "Head of Talent, TechCorp",
          avatar: "https://picsum.photos/seed/testimonial1/100/100"
      },
      {
          quote: "As a developer, I finally got to show what I can actually do. I landed my dream job in two weeks.",
          name: "John Smith",
          title: "Senior Frontend Engineer",
          avatar: "https://picsum.photos/seed/testimonial2/100/100"
      },
      {
          quote: "The analytics are a game-changer. We can see skill gaps and strengths across all candidates at a glance.",
          name: "Emily White",
          title: "CTO, Innovate Inc.",
          avatar: "https://picsum.photos/seed/testimonial3/100/100"
      }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-6 pb-8 pt-12 md:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter md:text-6xl lg:text-7xl">
            Hire by Skill, <br className="md:hidden" />
            <span className="text-primary">
              Not by Resume.
            </span>
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            SkillMatch Pro is the proof-of-skill ecosystem where top companies discover and hire verified talent based on real-world performance.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/signup/company">Start Hiring</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/signup/candidate">Prove Your Skills</Link>
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
       <section className="bg-muted/50 py-12 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              A New Standard in Hiring
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              A simple, transparent, and effective process for both companies and candidates.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">1. Take the Test</h3>
              <p className="mt-2 text-muted-foreground">Candidates choose from real-world tasks created by companies and submit their best work.</p>
            </div>
             <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">2. Get Evaluated</h3>
              <p className="mt-2 text-muted-foreground">Submissions are scored against objective criteria, providing clear, unbiased performance data.</p>
            </div>
             <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">3. Get Discovered</h3>
              <p className="mt-2 text-muted-foreground">Top performers rank high on leaderboards, where leading companies find their next great hire.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
            A Platform Built on Trust and Performance
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Everything you need to hire or get hired with confidence.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                {feature.icon}
                <CardTitle className="mt-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="bg-muted/50 py-12 md:py-20">
        <div className="container">
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                    Loved by Top Companies & Candidates
                </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                {testimonials.map((testimonial) => (
                    <Card key={testimonial.name}>
                        <CardContent className="pt-6">
                             <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                             <div className="mt-4 flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container py-12 md:py-20 text-center">
         <div className="mx-auto max-w-2xl">
           <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                Ready to Join the Future of Hiring?
            </h2>
             <p className="mt-4 text-muted-foreground md:text-lg">
                Whether you're looking for the best talent or want to prove you are the best, your journey starts here.
            </p>
             <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" asChild>
                    <Link href="/signup/candidate">Prove Your Skills</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="/signup/company">Find Top Talent</Link>
                </Button>
            </div>
         </div>
      </section>
    </div>
  );
}
