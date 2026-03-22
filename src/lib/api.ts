
'use server';

import * as api from './mock-api';
import {
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
  mockServiceLoad,
  mockScalingEvents,
  mockSystemIncidents,
  mockInvoices,
  mockPlanUsage,
  mockUsageMetrics,
  mockRevenueMetrics,
  mockPlanDistribution,
  mockRevenueSources,
} from './mock-data';

// This file now acts as a pass-through to the mock API,
// but could be swapped out for a real API implementation later.

// --- User API ---
export const getUsers = async () => (await api.getAllUsers()).data;
export const getUser = async (id: string) => (await api.getUserById(id)).data;
export const createUser = api.createUser;

// --- Company API ---
export const getCompanies = async () => (await api.getAllCompanies()).data;
export const getCompany = async (id: string) => (await api.getCompanyById(id)).data;
export const createCompany = api.createCompany;

// --- Task API ---
export const getTasks = async () => (await api.getAllTasks()).data;
export const getTask = async (id: string) => (await api.getTaskById(id)).data;
export const getTasksByCompany = async (companyId: string) => (await api.getTasksByCompanyId(companyId)).data;
export const createTask = api.createTask;
export const assignTask = api.assignTask;

// --- Submission API ---
export const getSubmissions = async () => (await api.getAllSubmissions()).data;
export const getSubmission = async (id: string) => (await api.getSubmissionById(id)).data;
export const getSubmissionsByUser = async (userId: string) => (await api.getSubmissionsByUser(userId)).data;
export const getSubmissionsByTask = async (taskId: string) => (await api.getSubmissionsByTask(taskId)).data;
export const createSubmission = api.createSubmission;
export const updateSubmissionStatus = api.updateSubmissionStatus;

// --- Evaluation API ---
export const getEvaluationBySubmission = async (submissionId: string) => (await api.getEvaluationBySubmissionId(submissionId)).data;
export const getAllEvaluations = async () => (await api.getAllEvaluations()).data;
export const createEvaluation = api.createEvaluation;


// --- Remaining data is still from mock-data.ts as API functions were not requested for them ---
export const getEvaluationSchemas = async () => mockEvaluationSchemas;
export const getActivityLogs = async () => mockActivityLogs;
export const getNotifications = async () => mockNotifications;
export const getTestCasesBySubmission = async (submissionId: string) => mockTestCases.filter(tc => tc.submissionId === submissionId);
export const getGitHubRepositories = async () => mockGitHubRepositories;
export const getWebhooks = async () => mockWebhooks;
export const getWebhookTriggerLogs = async (webhookId: string) => mockWebhookTriggerLogs.filter(log => log.webhookId === webhookId);
export const getTeams = async () => mockTeams;
export const getApiIntegrations = async () => mockApiIntegrations;
export const getIntegrationLogs = async () => mockIntegrationLogs;
export const getSystemMetrics = async () => mockSystemMetrics;
export const getServiceStatus = async () => mockServiceStatus;
export const getServiceLoad = async () => mockServiceLoad;
export const getScalingEvents = async () => mockScalingEvents;
export const getSystemLogs = async () => mockSystemLogs;
export const getSystemErrors = async () => mockSystemErrors;
export const getSystemIncidents = async () => mockSystemIncidents;
export const getInvoices = async () => (await api.getAllInvoices()).data;
export const getPlanUsage = async () => mockPlanUsage;
export const getUsageMetrics = async () => mockUsageMetrics;
export const getRevenueMetrics = async () => mockRevenueMetrics;
export const getPlanDistribution = async () => mockPlanDistribution;
export const getRevenueSources = async () => mockRevenueSources;
export const getPlans = async () => (await api.getAllPlans()).data;
export const getSubscriptions = async () => (await api.getAllSubscriptions()).data;
