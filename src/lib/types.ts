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
export type TaskStatus = 'draft' | 'open' | 'closed' | 'archived';
export type RoleCategory = 'Engineering' | 'Design' | 'Marketing' | 'Business' | 'Data';
export type TaskType = 'Coding' | 'MCQ' | 'Design' | 'Documentation' | 'Project';


export interface Task {
  id: string;
  title: string;
  description: string;
  roleCategory: RoleCategory;
  taskTypes?: TaskType[];
  difficulty: TaskDifficulty;
  deadline: string; // ISO 8601 date string
  companyId: string;
  status: TaskStatus;
  createdAt: string; // ISO 8601 date string
}

export type SubmissionStatus =
  | 'pending'
  | 'in-review'
  | 'evaluated'
  | 'shortlisted'
  | 'rejected';

export interface Submission {
  id: string;
  taskId: string;
  userId: string; // candidateId
  companyId: string; // Denormalized for easier querying
  content: {
    type: 'link' | 'file';
    value: string; // URL or file path
  };
  status: SubmissionStatus;
  submittedAt: string; // ISO 8601 date string
}

export interface Evaluation {
  id: string;
  submissionId: string;
  score: number; // 0-100
  feedback: string;
  evaluatedBy: string; // userId of company member
  evaluatedAt: string; // ISO 8601 date string
}
