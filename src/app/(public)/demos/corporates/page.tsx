
import { CorporateDashboard } from "./corporate-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data as per the new prompt
const mockCorporateClients = [
  { id: 'corp-1', name: "TechNova Solutions", industry: "Tech", location: "Bangalore, India", open_positions: 12, pain_points: ["Unverified skills", "Long interview process"] },
  { id: 'corp-2', name: "GlobalConsult Ltd.", industry: "Consulting", location: "New York, USA", open_positions: 8, pain_points: ["Multiple teams involved", "Resume unreliability"] },
  { id: 'corp-3', name: "Innovatech Labs", industry: "Product", location: "Berlin, Germany", open_positions: 5, pain_points: ["Slow screening", "Limited analytics"] },
  { id: 'corp-4', name: "NextGen BPO", industry: "BPO", location: "Manila, Philippines", open_positions: 20, pain_points: ["High volume candidates", "Unverified skills"] },
  { id: 'corp-5', name: "AlphaStartups Inc.", industry: "Startup", location: "San Francisco, USA", open_positions: 7, pain_points: ["Time-consuming interviews", "Lack of dashboards"] },
  { id: 'corp-6', name: "CloudCore Solutions", industry: "Tech", location: "London, UK", open_positions: 15, pain_points: ["Resume misalignment", "Multiple approvals"] },
  { id: 'corp-7', name: "StratEdge Advisors", industry: "Consulting", location: "Toronto, Canada", open_positions: 4, pain_points: ["Limited insight on candidates", "Delayed feedback"] },
  { id: 'corp-8', name: "ByteWave Technologies", industry: "Tech", location: "Tokyo, Japan", open_positions: 9, pain_points: ["Manual assessments", "Unstandardized scoring"] },
  { id: 'corp-9', name: "GreenLogic Products", industry: "Product", location: "Sydney, Australia", open_positions: 6, pain_points: ["Lack of skill validation", "Long process"] },
  { id: 'corp-10', name: "Horizon Global Corp.", industry: "BPO", location: "Mumbai, India", open_positions: 11, pain_points: ["High attrition", "Multiple teams involvement"] },
];

const mockCandidatePipeline = [
    { id: 'cand-1', name: 'Riya Sharma', topSkill: 'Java Developer', status: 'Assessment Pending', assessmentScore: 0 },
    { id: 'cand-2', name: 'John Doe', topSkill: 'Data Analyst', status: 'Passed Skill Test', assessmentScore: 92 },
    { id: 'cand-3', name: 'Akira Tanaka', topSkill: 'Product Manager', status: 'Failed Skill Test', assessmentScore: 45 },
    { id: 'cand-4', name: 'Maria Lopez', topSkill: 'UX Designer', status: 'Assessment Pending', assessmentScore: 0 },
    { id: 'cand-5', name: 'Liam Smith', topSkill: 'Cloud Engineer', status: 'Passed Skill Test', assessmentScore: 88 },
    { id: 'cand-6', name: 'Priya Mehta', topSkill: 'QA Engineer', status: 'Assessment In Progress', assessmentScore: 50 },
    { id: 'cand-7', name: 'Ethan Brown', topSkill: 'Fullstack Dev', status: 'Passed Skill Test', assessmentScore: 95 },
    { id: 'cand-8', name: 'Sofia Garcia', topSkill: 'Data Scientist', status: 'Assessment Pending', assessmentScore: 0 },
    { id: 'cand-9', name: 'Hiroshi Yamamoto', topSkill: 'DevOps Engineer', status: 'Failed Skill Test', assessmentScore: 40 },
    { id: 'cand-10', name: 'Isabella Rossi', topSkill: 'Business Analyst', status: 'Assessment In Progress', assessmentScore: 60 },
];

const mockApiChartData = {
    assessment_results: { "Passed": 3, "Failed": 2, "Pending": 5 },
    open_positions_by_industry: { "Tech": 36, "Consulting": 12, "BPO": 31, "Product": 11 },
    candidates_processed_weekly: [5, 8, 7, 10, 6, 12, 9]
};

const mockAlerts = [
    { id: 'alert-1', severity: 'high', message: '3 companies have unverified skills pending review' },
    { id: 'alert-2', severity: 'warning', message: '5 interviews delayed this week' },
    { id: 'alert-3', severity: 'low', message: '2 candidates failed assessment twice' },
];

export default function CorporatesDemoPage() {
    const chartData = {
        assessmentResults: Object.entries(mockApiChartData.assessment_results).map(([name, value]) => ({ name, value })),
        openPositions: Object.entries(mockApiChartData.open_positions_by_industry).map(([name, value]) => ({ name, value })),
        candidatesProcessed: mockApiChartData.candidates_processed_weekly.map((value, index) => ({ name: `Week ${index + 1}`, value }))
    };

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
            chartData={chartData}
            alerts={mockAlerts}
        />
    </div>
  );
}
