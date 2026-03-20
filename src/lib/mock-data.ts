import type { User, Company, Task, Submission, Evaluation } from './types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alice Candidate',
    email: 'alice@example.com',
    role: 'candidate',
    profile: {
      avatarUrl: 'https://picsum.photos/seed/avatar1/100/100',
      bio: 'Aspiring frontend developer with a passion for React.',
    },
  },
  {
    id: 'user-2',
    name: 'Bob Company',
    email: 'bob@techcorp.com',
    role: 'company',
    companyId: 'company-1',
    profile: {
      avatarUrl: 'https://picsum.photos/seed/avatar2/100/100',
      bio: 'Hiring manager at TechCorp.',
    },
  },
  {
    id: 'user-3',
    name: 'Charlie Admin',
    email: 'charlie@skillmatch.pro',
    role: 'admin',
    profile: {
      avatarUrl: 'https://picsum.photos/seed/avatar3/100/100',
    },
  },
  {
    id: 'user-4',
    name: 'Diana Developer',
    email: 'diana@example.com',
    role: 'candidate',
    profile: {
      avatarUrl: 'https://picsum.photos/seed/avatar4/100/100',
      bio: 'Full-stack engineer with 5 years of experience.',
    },
  },
  {
    id: 'user-5',
    name: 'Ethan Employer',
    email: 'ethan@innovate.io',
    role: 'company',
    companyId: 'company-2',
    profile: {
      avatarUrl: 'https://picsum.photos/seed/avatar5/100/100',
      bio: 'Lead Recruiter at Innovate Inc.',
    },
  },
];

export const mockCompanies: Company[] = [
  {
    id: 'company-1',
    name: 'TechCorp',
    description: 'A leading innovator in cloud solutions.',
  },
  {
    id: 'company-2',
    name: 'Innovate Inc.',
    description: 'Building the future of decentralized applications.',
  },
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Build a Responsive Navbar Component',
    description:
      'Create a fully responsive navigation bar using React and Tailwind CSS. The component should be reusable and include a mobile-friendly hamburger menu.',
    difficulty: 'Intermediate',
    deadline: '2024-08-15T23:59:59Z',
    companyId: 'company-1',
  },
  {
    id: 'task-2',
    title: 'Design a Database Schema for a Blog',
    description:
      'Design a normalized PostgreSQL schema for a blogging platform. The schema should support users, posts, comments, and tags. Provide the SQL script to create the tables.',
    difficulty: 'Beginner',
    deadline: '2024-08-20T23:59:59Z',
    companyId: 'company-1',
  },
  {
    id: 'task-3',
    title: 'Create a Serverless API Endpoint',
    description:
      'Develop a serverless function (e.g., AWS Lambda, Vercel Functions) that fetches data from a third-party API and returns a transformed JSON response. The function should include error handling and caching.',
    difficulty: 'Advanced',
    deadline: '2024-08-25T23:59:59Z',
    companyId: 'company-2',
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: 'sub-1',
    taskId: 'task-1',
    userId: 'user-1',
    content: {
      type: 'link',
      value: 'https://github.com/alice-candidate/responsive-navbar',
    },
    status: 'evaluated',
    submittedAt: '2024-08-10T10:00:00Z',
  },
  {
    id: 'sub-2',
    taskId: 'task-1',
    userId: 'user-4',
    content: {
      type: 'link',
      value: 'https://github.com/diana-developer/navbar-project',
    },
    status: 'in-review',
    submittedAt: '2024-08-11T14:30:00Z',
  },
  {
    id: 'sub-3',
    taskId: 'task-2',
    userId: 'user-1',
    content: {
      type: 'link',
      value: 'https://gist.github.com/alice-candidate/schema.sql',
    },
    status: 'pending',
    submittedAt: '2024-08-12T09:00:00Z',
  },
];

export const mockEvaluations: Evaluation[] = [
  {
    id: 'eval-1',
    submissionId: 'sub-1',
    score: 92,
    feedback:
      'Excellent work! The component is well-structured and fully responsive. Great use of Tailwind CSS variants. Consider adding ARIA attributes for better accessibility.',
    evaluatedBy: 'user-2',
    evaluatedAt: '2024-08-11T18:00:00Z',
  },
];
