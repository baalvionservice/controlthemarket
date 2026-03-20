'use server';

import {
  mockUsers,
  mockCompanies,
  mockTasks,
  mockSubmissions,
  mockEvaluations,
} from './mock-data';
import type { User, Company, Task, Submission, Evaluation } from './types';

const ARTIFICIAL_DELAY = 500;

// --- User API ---
export async function getUsers(): Promise<User[]> {
  await new Promise((res) => setTimeout(res, ARTIFICIAL_DELAY));
  return mockUsers;
}

export async function getUser(id: string): Promise<User | undefined> {
  await new Promise((res) => setTimeout(res, ARTIFICIAL_DELAY));
  return mockUsers.find((u) => u.id === id);
}

// --- Company API ---
export async function getCompanies(): Promise<Company[]> {
  await new Promise((res) => setTimeout(res, ARTIFICIAL_DELAY));
  return mockCompanies;
}

export async function getCompany(id: string): Promise<Company | undefined> {
  await new Promise((res) => setTimeout(res, ARTIFICIAL_DELAY));
  return mockCompanies.find((c) => c.id === id);
}

// --- Task API ---
export async function getTasks(): Promise<Task[]> {
  await new Promise((res) => setTimeout(res, ARTIFICIAL_DELAY));
  return mockTasks;
}

export async function getTask(id: string): Promise<Task | undefined> {
  await new Promise((res) => setTimeout(res, ARTIFICIAL_DELAY));
  return mockTasks.find((t) => t.id === id);
}

export async function getTasksByCompany(companyId: string): Promise<Task[]> {
  await new Promise((res) => setTimeout(res, ARTIFICIAL_DELAY));
  return mockTasks.filter((t) => t.companyId === companyId);
}

// --- Submission API ---
export async function getSubmissions(): Promise<Submission[]> {
  await new Promise((res) => setTimeout(res, ARTIFICIAL_DELAY));
  return mockSubmissions;
}

export async function getSubmission(id: string): Promise<Submission | undefined> {
    await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
    return mockSubmissions.find(s => s.id === id);
}

export async function getSubmissionsByUser(userId: string): Promise<Submission[]> {
  await new Promise((res) => setTimeout(res, ARTIFICIAL_DELAY));
  return mockSubmissions.filter((s) => s.userId === userId);
}

// --- Evaluation API ---
export async function getEvaluationBySubmission(
  submissionId: string
): Promise<Evaluation | undefined> {
  await new Promise((res) => setTimeout(res, ARTIFICIAL_DELAY));
  return mockEvaluations.find((e) => e.submissionId === submissionId);
}

export async function getEvaluations(): Promise<Evaluation[]> {
    await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
    return mockEvaluations;
}
