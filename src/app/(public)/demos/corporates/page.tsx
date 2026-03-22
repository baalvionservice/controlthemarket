
import { CorporateDashboard } from "./corporate-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data as requested
const mockCorporateClients = [
  { id: 'corp-1', name: "TechNova Solutions", industry: "Tech", location: "Bangalore, India", open_positions: 12, pain_points: ["Unverified skills", "Long interview process"] },
  { id: 'corp-2', name: "GlobalConsult Ltd.", industry: "Consulting", location: "New York, USA", open_positions: 8, pain_points: ["Multiple teams involved", "Resume unreliability"] },
  { id: 'corp-3', name: "Innovate Fintech", industry: "FinTech", location: "London, UK", open_positions: 25, pain_points: ["High competition for talent", "Slow screening process"] },
  { id: 'corp-4', name: "Synergy BPO", industry: "BPO", location: "Manila, Philippines", open_positions: 50, pain_points: ["High volume, low quality", "High attrition rate"] },
  { id: 'corp-5', name: "NextGen Startups", industry: "Startup", location: "Berlin, Germany", open_positions: 5, pain_points: ["Lack of brand recognition", "Niche skill requirements"] },
  { id: 'corp-6', name: "Digital Momentum", industry: "Product", location: "San Francisco, USA", open_positions: 18, pain_points: ["Long interview process", "Unverified skills"] },
  { id: 'corp-7', name: "Quantum Leap AI", industry: "Tech", location: "Toronto, Canada", open_positions: 30, pain_points: ["Niche skill requirements", "High competition for talent"] },
  { id: 'corp-8', name: "Apex Advisory", industry: "Consulting", location: "Singapore", open_positions: 15, pain_points: ["Resume unreliability", "Multiple teams involved"] },
  { id: 'corp-9', name: "HealthForward", industry: "Product", location: "Boston, USA", open_positions: 9, pain_points: ["Slow screening process", "Unverified skills"] },
  { id: 'corp-10', name: "Streamline Ops", industry: "BPO", location: "Krakow, Poland", open_positions: 40, pain_points: ["High volume, low quality", "Inconsistent evaluation"] },
];

const mockCandidatePipeline = [
    { id: 'cand-1', name: 'Anika Sharma', topSkill: 'React.js', status: 'Pending Review', assessmentScore: 88 },
    { id: 'cand-2', name: 'Ben Carter', topSkill: 'Python', status: 'Interview Scheduled', assessmentScore: 92 },
    { id: 'cand-3', name: 'Chloe Davis', topSkill: 'Figma', status: 'Approved', assessmentScore: 95 },
    { id: 'cand-4', name: 'David Rodriguez', topSkill: 'Node.js', status: 'Rejected', assessmentScore: 65 },
    { id: 'cand-5', name: 'Eva Wilson', topSkill: 'Data Analysis', status: 'Pending Review', assessmentScore: 89 },
];

const mockChartData = {
    openPositions: [
        { name: 'Engineering', value: 45 },
        { name: 'Product', value: 20 },
        { name: 'Sales', value: 30 },
        { name: 'Marketing', value: 15 },
    ],
    topSkills: [
        { name: 'JavaScript', value: 80 },
        { name: 'Python', value: 75 },
        { name: 'Cloud (AWS/GCP)', value: 60 },
        { name: 'AI/ML', value: 45 },
        { name: 'UI/UX Design', value: 30 },
    ]
};

const mockAlerts = [
    { id: 'alert-1', severity: 'warning', message: 'Interview for Ben Carter is delayed by 3 days.' },
    { id: 'alert-2', severity: 'high', message: 'Candidate Anika Sharma has unverified skill documents.' },
    { id: 'alert-3', severity: 'low', message: '15 new candidates in the pipeline for Engineering roles.' },
];

export default function CorporatesDemoPage() {
  return (
    <div className="flex-1 space-y-6 bg-muted/20 p-8 pt-6">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">
          The Corporate Hiring Dilemma
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
            Large enterprises face a unique set of challenges in talent acquisition. High-volume applications, coordination across multiple teams, and the reliance on unverified resumes lead to long hiring cycles, high costs, and inconsistent quality. Visualizing these pain points is the first step toward building a smarter, data-driven hiring strategy.
        </p>
      </div>

       <CorporateDashboard 
            clients={mockCorporateClients}
            pipeline={mockCandidatePipeline}
            chartData={mockChartData}
            alerts={mockAlerts}
        />
    </div>
  );
}
