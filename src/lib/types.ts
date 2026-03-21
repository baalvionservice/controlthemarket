

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
  recordingStatus?: 'Recording' | 'Paused' | 'Completed' | 'Not Started';
  assignedAt: string; // ISO 8601 date string
  submittedAt?: string; // ISO 8601 date string
  resubmittedAt?: string; // ISO 8601 date string
  lastUpdated: string; // ISO 8601 date string
  timeSpentMinutes?: number;
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

export type NotificationType = 'task_deadline' | 'new_submission' | 'user_signup' | 'system_warning' | 'flagged_submission';
export type NotificationPriority = 'High' | 'Medium' | 'Low';
export type NotificationStatus = 'Unread' | 'Read' | 'Resolved';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
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

export type IntegrationStatus = 'Connected' | 'Pending' | 'Error';

export interface GitHubRepository {
  id: string;
  name: string;
  url: string;
  ownerName: string; // Candidate or Team name
  ownerId: string;
  status: IntegrationStatus;
  lastSync: string; // ISO date string
  commitCount: number;
  branchCount: number;
  lastCommitMessage: string;
}

export type WebhookEvent = 'submission.created' | 'submission.evaluated' | 'task.published' | 'user.created';
export type WebhookStatus = 'Active' | 'Inactive' | 'Error';

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  status: WebhookStatus;
  lastTriggered?: string; // ISO date string
}

export interface WebhookTriggerLog {
    id: string;
    webhookId: string;
    timestamp: string;
    status: 'Success' | 'Failed';
    payload: string;
}

export interface Team {
  id: string;
  name: string;
  companyId: string;
  memberIds: string[];
  leadId: string; // The user ID of the team lead
}

export type ApiIntegrationStatus = 'Active' | 'Inactive' | 'Error';
export type ApiIntegrationCategory = 'Analytics' | 'Chat' | 'Cloud Storage' | 'DevOps' | 'Monitoring' | 'Other';

export interface ApiIntegration {
  id: string;
  name: string;
  category: ApiIntegrationCategory;
  description: string;
  status: ApiIntegrationStatus;
  lastSync: string; // ISO date string
  apiKey: string;
  endpointUrl: string;
  subscribedEvents: WebhookEvent[];
}

export type IntegrationLogSource = 'GitHub' | 'Webhook' | 'Jira' | 'Slack' | 'Sentry' | 'Vercel';

export interface IntegrationLog {
  id: string;
  source: IntegrationLogSource;
  eventType: string; // e.g., 'push', 'submission.evaluated'
  status: 'Success' | 'Warning' | 'Error';
  timestamp: string;
  description: string;
  relatedEntity: {
    type: 'Task' | 'Submission' | 'User' | 'Company' | 'System';
    id: string;
    name?: string;
  };
}
