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
export type TaskType = 'Coding' | 'MCQ' | 'Design' | 'Documentation' | 'Project';

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
  timeLimitMinutes?: number;
  deadline: string; // ISO 8601 date string
  companyId: string;
  createdBy: string; // User ID of creator
  status: TaskStatus;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  multiRound?: boolean;
  rounds?: TaskRound[];
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
  | 'moved-to-next-round';

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
}

export interface EvaluationSchema {
  id: string;
  name: string;
  description: string;
  criteria: EvaluationCriterion[];
  isActive: boolean;
}
