import type { User, Company, Task, Submission, Evaluation } from './types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alice Candidate',
    email: 'alice@example.com',
    role: 'candidate',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    isActive: true,
    isVerified: true,
    profile: {
      avatarUrl: 'https://picsum.photos/seed/avatar1/100/100',
      bio: 'Aspiring frontend developer with a passion for React.',
      location: 'San Francisco, CA',
      experienceLevel: 'Intermediate',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      githubUrl: 'https://github.com/alice-candidate',
      linkedinUrl: 'https://linkedin.com/in/alice-candidate',
    },
    candidatePerformance: {
      completedTasks: 2,
      averageScore: 92,
      ranking: 15,
    },
  },
  {
    id: 'user-2',
    name: 'Bob Company',
    email: 'bob@techcorp.com',
    role: 'company',
    companyId: 'company-1',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString(),
    isActive: true,
    isVerified: true,
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
    createdAt: new Date(new Date().setDate(new Date().getDate() - 120)).toISOString(),
    isActive: true,
    isVerified: true,
    profile: {
      avatarUrl: 'https://picsum.photos/seed/avatar3/100/100',
    },
  },
  {
    id: 'user-4',
    name: 'Diana Developer',
    email: 'diana@example.com',
    role: 'candidate',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    isActive: true,
    isVerified: true,
    profile: {
      avatarUrl: 'https://picsum.photos/seed/avatar4/100/100',
      bio: 'Full-stack engineer with 5 years of experience.',
      location: 'New York, NY',
      experienceLevel: 'Advanced',
      skills: ['Node.js', 'Python', 'GraphQL', 'AWS'],
      githubUrl: 'https://github.com/diana-dev',
    },
    candidatePerformance: {
      completedTasks: 1,
      averageScore: 88,
      ranking: 23,
    },
  },
  {
    id: 'user-5',
    name: 'Ethan Employer',
    email: 'ethan@innovate.io',
    role: 'company',
    companyId: 'company-2',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    isActive: true,
    isVerified: true,
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
    ownerId: 'user-2',
    website: 'https://techcorp.com',
    logoUrl: 'https://picsum.photos/seed/company1/100/100',
    industry: 'Technology',
    location: 'Silicon Valley, CA',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString(),
    isActive: true,
    isVerified: true,
  },
  {
    id: 'company-2',
    name: 'Innovate Inc.',
    description: 'Building the future of decentralized applications.',
    ownerId: 'user-5',
    website: 'https://innovate.io',
    logoUrl: 'https://picsum.photos/seed/company2/100/100',
    industry: 'FinTech',
    location: 'New York, NY',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    isActive: true,
    isVerified: false,
  },
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Build a Responsive Navbar Component',
    description:
      'Create a fully responsive navigation bar using React and Tailwind CSS. The component should be reusable and include a mobile-friendly hamburger menu.',
    roleCategory: 'Engineering',
    taskTypes: ['Coding', 'Design'],
    difficulty: 'Intermediate',
    deadline: '2024-08-15T23:59:59Z',
    companyId: 'company-1',
    status: 'open',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Design a Database Schema for a Blog',
    description:
      'Design a normalized PostgreSQL schema for a blogging platform. The schema should support users, posts, comments, and tags. Provide the SQL script to create the tables.',
    roleCategory: 'Data',
    taskTypes: ['Documentation'],
    difficulty: 'Beginner',
    deadline: '2024-08-20T23:59:59Z',
    companyId: 'company-1',
    status: 'open',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Create a Serverless API Endpoint',
    description:
      'Develop a serverless function (e.g., AWS Lambda, Vercel Functions) that fetches data from a third-party API and returns a transformed JSON response. The function should include error handling and caching.',
    roleCategory: 'Engineering',
    taskTypes: ['Coding'],
    difficulty: 'Advanced',
    deadline: '2024-08-25T23:59:59Z',
    companyId: 'company-2',
    status: 'closed',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: 'sub-1',
    taskId: 'task-1',
    userId: 'user-1',
    companyId: 'company-1',
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
    companyId: 'company-1',
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
    companyId: 'company-1',
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
