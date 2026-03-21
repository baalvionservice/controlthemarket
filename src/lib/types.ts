
export type UserRole = 'candidate' | 'company' | 'admin';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string; // ISO 8601 date string
  isActive: boolean;
  isVerified?: boolean;
  companyId?: string; // For users with the 'company' role
  companyName?: string; // For users with the 'company' role
  onboardingCompleted?: boolean;
  profile?: {
    avatarUrl: string;
    bio?: string;
    location?: string;
    experienceLevel?: ExperienceLevel;
    skills?: string[];
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioLinks?: string[];
  };
  candidatePerformance?: {
    completedTasks?: number;
    averageScore?: number;
    ranking?: number;
  };
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  ownerId: string; // The ID of the user who owns the company
  website?: string;
  logoUrl?: string;
  industry?: string;
  location?: string;
  createdAt: string; // ISO 8601 date string
  isActive?: boolean;
  isVerified?: boolean;
}

export type TaskDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type TaskStatus = 'draft' | 'published' | 'closed' | 'archived';
export type RoleCategory = 'Engineering' | 'Design' | 'Marketing' | 'Business' | 'Data';
export type TaskType = 'Coding' | 'MCQ' | 'Design' | 'Documentation' | 'Project' | 'UI' | 'Component' | 'Styling' | 'Feature Implementation' | 'Campaign Planning' | 'Content Creation' | 'Social Media' | 'Email Marketing' | 'Ads' | 'Market Analysis' | 'Strategy Planning' | 'Financial Modeling' | 'Presentation' | 'Data Cleaning' | 'Visualization' | 'Statistical Analysis' | 'Reporting';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface TaskRound {
  roundNumber: number;
  instructions: string;
  expectedOutputs: string;
  timeLimitMinutes?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  instructions: string;
  expectedOutputs: string;
  roleCategory: RoleCategory;
  taskTypes?: TaskType[];
  difficulty: TaskDifficulty;
  priority?: TaskPriority;
  timeLimitMinutes?: number;
  deadline: string; // ISO 8601 date string
  companyId: string;
  createdBy: string; // User ID of creator
  status: TaskStatus;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  multiRound?: boolean;
  rounds?: TaskRound[];
  imageUrl?: string;
  imageHint?: string;
}

export interface TaskTemplate {
  templateId: string;
  title: string;
  description: string;
  roleCategory: RoleCategory;
  difficulty: TaskDifficulty;
  taskTypes: TaskType[];
  instructions: string;
  expectedOutputs: string;
  timeLimitMinutes?: number;
  createdBy: string; // companyId
  createdAt: string;
  updatedAt: string;
  multiRound?: boolean;
  rounds?: TaskRound[];
}

export type SubmissionContentType = 'link' | 'file' | 'externalLink';

export type SubmissionStatus =
  | 'assigned'
  | 'in-progress'
  | 'pending'
  | 'in-review'
  | 'evaluated'
  | 'shortlisted'
  | 'rejected'
  | 'resubmitted'
  | 'moved-to-next-round'
  | 'flagged';

export type ValidationStatus = 'Valid' | 'Invalid' | 'Warning' | 'Pending';
export type TestCaseStatus = 'Passed' | 'Failed' | 'Warning' | 'Pending';
export type SandboxStatus = 'Active' | 'Idle' | 'Completed' | 'Error' | 'Not Started';
export type LiveSessionStatus = 'Not Started' | 'Scheduled' | 'Active' | 'Completed' | 'Cancelled';
export type PlagiarismRisk = 'High' | 'Medium' | 'Low' | 'None';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  expectedOutcome: string;
  actualOutcome: string;
  status: TestCaseStatus;
}

export interface Submission {
  id: string;
  taskId: string;
  userId: string; // candidateId
  companyId: string; // Denormalized for easier querying
  content?: {
    type: SubmissionContentType;
    value: string; // URL or file path
    fileName?: string; // For file uploads
    fileSize?: number; // for file uploads
  };
  status: SubmissionStatus;
  validationStatus?: ValidationStatus;
  testCaseStatus?: TestCaseStatus;
  autoScore?: number;
  autoScoringStatus?: 'Pending' | 'Completed' | 'Failed';
  sandboxStatus?: SandboxStatus;
  liveSessionStatus?: LiveSessionStatus;
  plagiarismRisk?: PlagiarismRisk;
  assignedAt: string; // ISO 8601 date string
  submittedAt?: string; // ISO 8601 date string
  resubmittedAt?: string; // ISO 8601 date string
  lastUpdated: string; // ISO 8601 date string
  attemptsCount?: number;
  currentRound?: number;
}

export interface Evaluation {
  id: string;
  submissionId: string;
  score: number; // 0-100 overall score
  criteriaScores?: {
    [key: string]: number;
  };
  criteriaComments?: {
    [key: string]: string;
  };
  feedback: string;
  evaluatedBy: string; // userId of company member
  evaluatedAt: string; // ISO 8601 date string
}

export interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  weight?: number;
}

export interface EvaluationSchema {
  id: string;
  name: string;
  description: string;
  criteria: EvaluationCriterion[];
  isActive: boolean;
}

export type ActivityActionType = 'submission' | 'task_update' | 'status_change' | 'login' | 'override' | 'user_created' | 'company_created';
export type ActivityStatus = 'Success' | 'Failed' | 'Pending';

export interface Activity {
  id: string;
  performerId: string; // userId
  actionType: ActivityActionType;
  timestamp: string; // ISO 8601
  targetEntity: {
    type: 'Task' | 'User' | 'Company' | 'Submission';
    id: string;
    name?: string;
  };
  status: ActivityStatus;
  description: string;
}

export type AlertType = 'task_deadline' | 'new_submission' | 'user_signup' | 'system_warning' | 'flagged_submission';
export type AlertPriority = 'High' | 'Medium' | 'Low';
export type AlertStatus = 'New' | 'Acknowledged' | 'Resolved';

export interface Alert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  status: AlertStatus;
  timestamp: string; // ISO 8601
  title: string;
  description: string;
  relatedEntity: {
    type: 'Task' | 'User' | 'Company' | 'Submission' | 'System';
    id: string;
    name?: string;
  };
}

export type PerformanceTrend = 'improving' | 'declining' | 'stable' | 'new';

export interface CandidateInsight {
  candidate: User;
  aggregatedScore: number;
  percentileRank: number;
  evaluationCount: number;
  trend: PerformanceTrend;
  topSkill: string | null;
  weakestSkill: string | null;
}

export interface CompanyInsight {
  company: Company;
  avgCandidateScore: number;
  candidateCount: number;
  topSkills: string[];
  skillGaps: string[];
}
