

'use server';

import {
  mockUsers,
  mockCompanies,
  mockTasks,
  mockSubmissions,
  mockEvaluations,
  mockEvaluationSchemas,
  mockActivityLogs,
  mockNotifications,
  mockTestCases,
  mockGitHubRepositories,
  mockWebhooks,
  mockWebhookTriggerLogs,
  mockTeams,
  mockApiIntegrations,
  mockIntegrationLogs,
  mockSystemMetrics,
  mockServiceStatus,
  mockSystemLogs,
  mockSystemErrors,
  mockSystemIncidents,
  mockServiceLoad,
  mockScalingEvents,
  mockInvoices,
} from './mock-data';
import type { User, Company, Task, Submission, Evaluation, EvaluationSchema, Activity, Notification, TestCase, GitHubRepository, Webhook, WebhookTriggerLog, Team, ApiIntegration, IntegrationLog, SystemMetric, ServiceStatus, SystemLog, SystemError, SystemIncident, ServiceLoad, ScalingEvent, Invoice, InvoiceStatus } from './types';

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

// --- Evaluation Schema API ---
export async function getEvaluationSchemas(): Promise<EvaluationSchema[]> {
    await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
    return mockEvaluationSchemas;
}

// --- Activity Log API ---
export async function getActivityLogs(): Promise<Activity[]> {
  await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
  return mockActivityLogs;
}

// --- Notification API ---
export async function getNotifications(): Promise<Notification[]> {
  await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
  return mockNotifications;
}

// --- Test Case API ---
export async function getTestCasesBySubmission(submissionId: string): Promise<TestCase[]> {
  await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
  return mockTestCases.filter((tc) => tc.submissionId === submissionId);
}

// --- GitHub Integration API ---
export async function getGitHubRepositories(): Promise<GitHubRepository[]> {
  await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
  return mockGitHubRepositories;
}

// --- Webhook API ---
export async function getWebhooks(): Promise<Webhook[]> {
  await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
  return mockWebhooks;
}

export async function getWebhookTriggerLogs(webhookId: string): Promise<WebhookTriggerLog[]> {
    await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
    return mockWebhookTriggerLogs.filter(log => log.webhookId === webhookId);
}

// --- Team API ---
export async function getTeams(): Promise<Team[]> {
    await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
    return mockTeams;
}

// --- API Integration API ---
export async function getApiIntegrations(): Promise<ApiIntegration[]> {
    await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
    return mockApiIntegrations;
}

// --- Integration Log API ---
export async function getIntegrationLogs(): Promise<IntegrationLog[]> {
    await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
    return mockIntegrationLogs;
}

// --- System Monitoring API ---
export async function getSystemMetrics(): Promise<SystemMetric[]> {
    await new Promise(res => setTimeout(res, 100)); // Faster for "real-time" feel
    return mockSystemMetrics;
}

export async function getServiceStatus(): Promise<ServiceStatus[]> {
    await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
    return mockServiceStatus;
}

export async function getServiceLoad(): Promise<ServiceLoad[]> {
    await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
    return mockServiceLoad;
}

export async function getScalingEvents(): Promise<ScalingEvent[]> {
    await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
    return mockScalingEvents;
}

// --- System Log API ---
export async function getSystemLogs(): Promise<SystemLog[]> {
  await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
  return mockSystemLogs;
}

// --- Error Tracking API ---
export async function getSystemErrors(): Promise<SystemError[]> {
  await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
  return mockSystemErrors;
}

export async function getSystemIncidents(): Promise<SystemIncident[]> {
  await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
  return mockSystemIncidents;
}

// --- Billing API ---
export async function getInvoices(): Promise<Invoice[]> {
  await new Promise(res => setTimeout(res, ARTIFICIAL_DELAY));
  return mockInvoices;
}
