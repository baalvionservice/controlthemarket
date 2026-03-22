
'use client';
      
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import {
  ArrowUp,
  Award,
  BarChart2,
  BrainCircuit,
  Briefcase,
  Check,
  CheckCircle,
  FileText,
  ShieldCheck,
  TrendingUp,
  Trophy,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';


const ShopifyLogo = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto text-muted-foreground transition-opacity opacity-60 hover:opacity-100">
    <title>Shopify</title>
    <path d="M21.187 8.112c.03.186.045.374.045.562 0 3.38-2.739 6.12-6.12 6.12-1.395 0-2.67-.465-3.675-1.253v3.918c0 .248-.112.483-.3.643-.188.16-.435.24-.682.21l-3.33-1.023c-.15-.045-.285-.128-.4-.24s-.2-.255-.24-.4c-.03-.143-.023-.293.023-.435l1.02-3.33c.045-.15.128-.285.24-.4.112-.112.255-.2.4-.24.143-.045.293-.053.435-.023l3.33 1.023c.248.075.435.27.533.51V12.1c1.02-1.005 2.49-1.635 4.125-1.635.345 0 .683.03.9-.09.09-.045.15-.12.195-.21.03-.09.045-.18.015-.27l-.435-1.425c-.06-.21-.24-.36-.465-.39l-1.08-.165c-.18-.03-.36.015-.51.135-.15.12-.24.3-.24.495v.21c0 .24-.12.465-.315.6-.195.135-.45.165-.675.09l-3.33-1.023c-.15-.045-.285-.128-.4-.24-.112-.112-.2-.255-.24-.4-.03-.143-.023-.293.023-.435l1.02-3.33c.045-.15.128-.285.24-.4.112-.112.255-.2.4-.24.143-.045.293-.053.435-.023l3.33 1.023c.248.075.435.27.533.51V8.2c.99-1.065 2.475-1.74 4.14-1.74 2.88 0 5.25 2.055 5.79 4.755.015.09.015.18.015.27l-.015.627zM8.385 10.366l-1.62 5.31 1.62-5.31zM9.405 6.226l-1.62 5.31 1.62-5.31z" />
  </svg>
);

const DecathlonLogo = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto text-muted-foreground transition-opacity opacity-60 hover:opacity-100">
        <title>Decathlon</title>
        <path d="M24 10.373H9.288L0 2.222h14.61zM11.956 12.04h11.93L13.82 21.78h-11.9z"/>
    </svg>
);

const BookingLogo = () => (
     <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto text-muted-foreground transition-opacity opacity-60 hover:opacity-100">
        <title>Booking.com</title>
        <path d="M2.518 14.861h1.764c.264 0 .47.018.618.053.147.036.264.106.353.212.088.106.132.253.132.441a.76.76 0 0 1-.221.574.903.903 0 0 1-.58.22c-.176 0-.332-.018-.47-.053-.139-.036-.25-.106-.331-.212a.84.84 0 0 0-.131-.282H2.518v.52c.1.22.25.39.45.51.2.12.43.18.69.18.39 0 .72-.08.99-.24.27-.16.48-.38.63-.66.15-.28.22-.6.22-.96 0-.38-.07-.7-.22-.96a1.99 1.99 0 0 0-.62-0.66c-.27-.16-.6-.24-.99-.24-.26 0-.49.06-.69.18a1.32 1.32 0 0 0-.45.51v.52zM6.634 12.05h1.77c1.86 0 3.23.47 4.11 1.41 0.88.94.132 2.21.132 3.82 0 1.6-.44 2.87-1.32 3.81-.88.94-2.25 1.41-4.11 1.41H6.634v-11.86zm1.76 10.34c1.37 0 2.37-.32 3.01-.96.64-.64.96-1.57.96-2.79 0-1.22-.32-2.15-.96-2.79-.64-.64-1.64-.96-3.01-.96h-0.2v7.5zM17.06 0v2.4h-5.02v21.6h5.02V24h-12.05v-2.4h5.03V2.4H5.03V0h12.03z"/>
    </svg>
);

const PGLogo = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto text-muted-foreground transition-opacity opacity-60 hover:opacity-100">
        <title>P&G</title>
        <path d="M16.507 8.012a6.47 6.47 0 00-6.494 6.444h2.533a3.96 3.96 0 113.96-3.957zM24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-4.322 0a7.678 7.678 0 10-15.356 0 7.678 7.678 0 0015.356 0z"/>
    </svg>
);

const SamsungLogo = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto text-muted-foreground transition-opacity opacity-60 hover:opacity-100">
        <title>Samsung</title>
        <path d="M0 7.896h2.862l2.106 4.11-2.106 4.109H0zm24 0l-5.012 8.219H24zM16.03 2.01l-1.921 3.753 1.921 3.752h3.918l1.922-3.752L19.948 2.01zM8.082 2.01L4.164 9.176l3.918 6.942h3.918l-3.918-6.942L12 2.01z"/>
    </svg>
);

const FedExLogo = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto text-muted-foreground transition-opacity opacity-60 hover:opacity-100">
        <title>FedEx</title>
        <path d="M8.88 7.464V24H5.25V7.464zm4.184 9.397-5.385 7.14h-3.96l6.83-8.89-6.38-8.11h4.058l4.437 6.015zm-.1 3.018h3.338v-3.784h-3.338zm11.036-7.854c-.165-1.023-.528-1.848-1.09-2.475-.56-.627-1.32-1.089-2.276-1.386a6.59 6.59 0 00-3.036-.43v10.395h3.63a5.55 5.55 0 002.573-.594c.66-.396 1.155-1.023 1.485-1.88.33-.859.495-1.85.495-2.972a7.1 7.1 0 00-.28-.15z"/>
    </svg>
);

const AmazonLogo = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto text-muted-foreground transition-opacity opacity-60 hover:opacity-100">
        <title>Amazon</title>
        <path d="M22.513 14.162c-.235 2.115-1.855 4.39-4.818 4.39-1.848 0-3.11-1.05-3.87-2.002-.132.891-.24 1.782-.363 2.673l-.219.869c-.066.27-.11.486-.11.642 0 .546.578.618 1.144.438.566-.18 1.05-.624 1.47-1.344l.89-.96c.264-.282.682-.282.946 0 .264.282.264.744 0 1.026l-1.056 1.152c-1.043 1.128-2.33 1.74-3.85 1.74-1.92 0-3.3-1.01-3.3-2.91 0-1.47.803-2.61 2.05-3.41 1.24-.8 2.92-1.41 4.95-1.93l.3-.07c1.23-.33 1.95-.57 1.95-1.54 0-.8-.5-1.3-1.4-1.3-.9 0-1.6.4-2.2 1.3-.1.1-.3.2-.5.1-.2-.1-.3-.3-.2-.5l.6-2.1c.1-.2.3-.3.5-.2.2.1.3.3.2.5-.02.07-.03.13-.05.19C17.3 6.712 18.277 6 19.58 6c1.68 0 2.93 1.01 2.93 2.87 0 1.3-.5 2.2-1.5 2.9-.9.7-2.3 1.2-4 1.7l-.4.1c-1.4.4-1.8.6-1.8 1.3 0 .7.6.9 1.2.9.8 0 1.5-.5 1.9-1.4l.1-.2c.1-.2.3-.4.6-.4.2 0 .4.2.4.4v.1zm-10.23-9.51c.21-.21.54-.21.75 0l3.99 3.99c.21.21.21.54 0 .75l-1.59 1.59c-.21.21-.54.21-.75 0L12 8.28l-2.67 2.67c-.21.21-.54.21-.75 0l-1.59-1.59c-.21-.21-.21-.54 0-.75zm-3.57 9.51C5.463 9.412 1.183 9.762 1.183 14.3c0 3.1 2.7 4.7 5.4 4.7 2.6 0 5.6-1.5 5.6-4.7 0-4.3-4-5-7.7-4.7z"/>
    </svg>
);


export default function PlatformLandingPage() {
    useEffect(() => {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            },
            { threshold: 0.12 }
        );
        document.querySelectorAll('.reveal').forEach((el) => {
            revealObserver.observe(el);
        });

        const handleScroll = () => {
            const header = document.querySelector('header');
            if (header) {
                if (window.scrollY > 10) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        const chartObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.bar-item').forEach((bar) => {
                            (bar as HTMLElement).classList.add('animated');
                        });
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );
        document.querySelectorAll('.data-chart-wrap').forEach((chart) => {
            chartObserver.observe(chart);
        });

        const counterObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const counters = entry.target.querySelectorAll('.counter-num');
                        counters.forEach((counter) => {
                            const target = +(counter.getAttribute('data-target') || 0);
                            (counter as HTMLElement).innerHTML = '0';
                            const duration = 1800;
                            const frameDuration = 1000 / 60;
                            const totalFrames = Math.round(duration / frameDuration);
                            let frame = 0;

                            const interval = setInterval(() => {
                                frame++;
                                const progress = frame / totalFrames;
                                const currentCount = Math.round(target * progress);

                                if (parseInt(counter.innerHTML, 10) !== currentCount) {
                                    (counter as HTMLElement).innerHTML = currentCount.toLocaleString();
                                }

                                if (frame === totalFrames) {
                                    clearInterval(interval);
                                    (counter as HTMLElement).innerHTML = target.toLocaleString();
                                }
                            }, frameDuration);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        document.querySelectorAll('.counter-section').forEach((section) => {
            counterObserver.observe(section);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            revealObserver.disconnect();
            chartObserver.disconnect();
            counterObserver.disconnect();
        };
    }, []);

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

  const marqueeItems = [
    { "company": "TechCorp", "text": "hired 12 engineers in 6 days" },
    { "company": "Innovate Inc.", "text": "reduced hiring cost by 68%" },
    { "company": "BuildFast", "text": "found their CTO in 4 days" },
    { "company": "ScaleUp AI", "text": "tripled candidate quality" },
    { "company": "DevStudio", "text": "saved 40 hours per hire" },
    { "company": "CloudBase", "text": "now hires 5x faster" },
    { "company": "DataFlow", "text": "cut bad hires by 92%" },
    { "company": "NexGen", "text": "promoted 8 SkillMatch hires internally" }
  ];

  return (
    <>
    <div className="flex flex-col">
      <section className="container flex flex-col items-center justify-center gap-6 pb-8 pt-12 text-center md:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          <h1 className="hero-headline font-headline text-4xl font-extrabold tracking-tighter animate-in fade-in slide-in-from-top-4 duration-1000 md:text-6xl lg:text-7xl">
            Hire by <span className="highlight-word">Skill</span>, <br className="md:hidden" />
            Not by Resume.
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground animate-in fade-in slide-in-from-top-6 duration-1000 delay-200 md:text-xl">
            SkillMatch Pro is the proof-of-skill ecosystem where top companies discover and hire verified talent based on real-world performance.
          </p>
        </div>
        <div className="flex gap-4 animate-in fade-in slide-in-from-top-8 duration-1000 delay-300">
          <Button asChild size="lg">
            <Link href="/signup/company">Start Hiring</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/signup/candidate">Prove Your Skills</Link>
          </Button>
        </div>
        <div className="relative mt-8 w-full max-w-5xl reveal reveal-scale delay-4">
          <Image
            src="https://picsum.photos/seed/hero-dash/1200/750"
            alt="SkillMatch Pro Dashboard Preview"
            width={1200}
            height={750}
            className="hero-preview rounded-xl border-8 border-muted shadow-2xl"
            priority
          />
        </div>
      </section>

      <section className="marquee-bar">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <div key={index} className="marquee-item">
              <span className="marquee-dot"></span>
              <span className="marquee-text">
                <strong>{item.company}</strong> {item.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/50 py-12 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center reveal">
            <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              A New Standard in Hiring
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              A simple, transparent, and effective process for both companies and candidates.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center reveal delay-1">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">1. Take the Test</h3>
              <p className="mt-2 text-muted-foreground">Candidates choose from real-world tasks created by companies and submit their best work.</p>
            </div>
             <div className="text-center reveal delay-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">2. Get Evaluated</h3>
              <p className="mt-2 text-muted-foreground">Submissions are scored against objective criteria, providing clear, unbiased performance data.</p>
            </div>
             <div className="text-center reveal delay-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">3. Get Discovered</h3>
              <p className="mt-2 text-muted-foreground">Top performers rank high on leaderboards, where leading companies find their next great hire.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-20 reveal">
        <div className="data-chart-wrap">
          <div className="chart-title">Average time to hire <span>↓ 85% faster</span></div>
          <div className="bar-chart">
            <div className="bar-item" data-width="97%">
              <div className="bar-label">Traditional</div>
              <div className="bar-track"><div className="bar-fill" style={{ '--target': '97%', background: 'hsl(220,10%,78%)' } as React.CSSProperties}></div></div>
              <div className="bar-value">41 days</div>
            </div>
            <div className="bar-item" data-width="29%">
              <div className="bar-label">Resume-based</div>
              <div className="bar-track"><div className="bar-fill" style={{ '--target': '29%', background: 'hsl(221,83%,70%)' } as React.CSSProperties}></div></div>
              <div className="bar-value">12 days</div>
            </div>
            <div className="bar-item" data-width="15%">
              <div className="bar-label">SkillMatch Pro</div>
              <div className="bar-track"><div className="bar-fill" style={{ '--target': '15%', background: 'hsl(142,76%,36%)' } as React.CSSProperties}></div></div>
              <div className="bar-value">6 days</div>
            </div>
          </div>
          <div className="metric-cards">
            <div className="metric-card">
              <div className="metric-value" style={{ color: 'hsl(142,76%,36%)' }}>85%</div>
              <div className="metric-label">Faster than industry avg.</div>
              <div className="metric-trend"><ArrowUp size={14} /> vs traditional</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: 'hsl(221,83%,53%)' }}>$8,200</div>
              <div className="metric-label">Saved per hire avg.</div>
              <div className="metric-trend"><TrendingUp size={14} /> per role filled</div>
            </div>
          </div>
        </div>
      </section>

       <section className="container py-12 md:py-20 reveal">
         <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                The SkillMatch Pro Difference
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
                See how we stack up against traditional, resume-based hiring methods.
            </p>
          </div>
          <div className="table-responsive-wrapper mt-12">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="highlight-col">SkillMatch Pro</th>
                  <th>Traditional Hiring</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Real-world skill tasks</td>
                  <td className="highlight-col"><Check className="text-primary mx-auto" /> Always included</td>
                  <td><X className="text-destructive mx-auto" /> Resume only</td>
                </tr>
                <tr>
                  <td>Objective performance scoring</td>
                  <td className="highlight-col"><Check className="text-primary mx-auto" /> AI-powered</td>
                  <td><X className="text-destructive mx-auto" /> Gut-feel interviews</td>
                </tr>
                <tr>
                  <td>Verified skills & badges</td>
                  <td className="highlight-col"><Check className="text-primary mx-auto" /> Auto-verified</td>
                  <td><X className="text-destructive mx-auto" /> Self-reported only</td>
                </tr>
                <tr>
                  <td>Live competitive leaderboard</td>
                  <td className="highlight-col"><Check className="text-primary mx-auto" /> Real-time</td>
                  <td><X className="text-destructive mx-auto" /> Not available</td>
                </tr>
                <tr>
                  <td>Average time to hire</td>
                  <td className="highlight-col"><strong>6 days</strong></td>
                  <td className="bad-metric">41 days</td>
                </tr>
                <tr>
                  <td>Average cost per hire</td>
                  <td className="highlight-col"><strong>$2,900</strong></td>
                  <td className="bad-metric">$11,000+</td>
                </tr>
                <tr>
                  <td>Bias-free candidate discovery</td>
                  <td className="highlight-col"><Check className="text-primary mx-auto" /> Data-driven</td>
                  <td><X className="text-destructive mx-auto" /> Name/school bias</td>
                </tr>
                <tr>
                  <td>Analytics dashboard</td>
                  <td className="highlight-col"><Check className="text-primary mx-auto" /> Full insights</td>
                  <td><X className="text-destructive mx-auto" /> Spreadsheets only</td>
                </tr>
              </tbody>
            </table>
          </div>
       </section>

      <section className="bg-muted/50 py-12 md:py-20">
        <div className="container counter-section reveal grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="counter-item">
            <span className="counter-num" data-target="2400">0</span><span>+</span>
            <div>Companies hiring</div>
          </div>
          <div className="counter-item">
            <span className="counter-num" data-target="48000">0</span><span>+</span>
            <div>Verified candidates</div>
          </div>
          <div className="counter-item">
            <span className="counter-num" data-target="6">0</span><span> days</span>
            <div>Average time to hire</div>
          </div>
          <div className="counter-item">
            <span className="counter-num" data-target="94">0</span><span>%</span>
            <div>Hiring satisfaction</div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-20">
        <div className="mx-auto max-w-3xl text-center reveal">
          <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
            A Platform Built on Trust and Performance
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Everything you need to hire or get hired with confidence.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={feature.title} className="reveal" style={{ transitionDelay: `${index * 100}ms`}}>
              <Card className="feature-card h-full">
                <CardHeader>
                  <div className="feature-icon">{feature.icon}</div>
                  <CardTitle className="mt-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>
      
      <section className="bg-muted/50 py-12 md:py-20">
        <div className="container reveal">
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                    Loved by Top Companies & Candidates
                </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.name} className="reveal" style={{ transitionDelay: `${index * 150}ms` }}>
                    <Card className="testimonial-card">
                        <CardContent className="pt-6">
                             <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                             <div className="mt-4 flex items-center gap-3">
                                <Avatar className="h-10 w-10">
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
                    </div>
                ))}
            </div>
        </div>
      </section>

      <section className="container py-12 text-center md:py-20">
         <div className="mx-auto max-w-2xl reveal">
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
    </>
  );
}
