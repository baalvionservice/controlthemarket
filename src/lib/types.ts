export type UserRole = 'candidate' | 'company' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profile?: {
    avatarUrl: string;
    bio?: string;
  };
  companyId?: string; // For users with the 'company' role
}

export interface Company {
  id: string;
  name: string;
  description: string;
  ownerId: string; // The ID of the user who owns the company
}

export type TaskDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: TaskDifficulty;
  deadline: string; // ISO 8601 date string
  companyId: string;
}

export type SubmissionStatus = 'pending' | 'in-review' | 'evaluated';

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
