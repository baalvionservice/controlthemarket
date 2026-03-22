'use server';

import * as api from './mock-api';
import * as dataLayer from './data-layer';
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
  mockPlanUsage,
  mockUsageMetrics,
  mockRevenueMetrics,
  mockPlanDistribution,
  mockRevenueSources,
} from './mock-data';
import type { User } from './types';

// This file now acts as the single source of truth for all data operations.
// It uses the hybrid data layer for fetching, ensuring a mix of
// persistent mock data and fallback hardcoded data.
// All create/update/delete operations go directly to the persistent mock API.


// --- User API ---
export const getUsers = dataLayer.getHybridUsers;
export const getUser = async (id: string) => (await api.getUserById(id)).data;
export const createUser = api.createUser;
export const updateUser = api.updateUser;


// --- Company API ---
export const getCompanies = dataLayer.getHybridCompanies;
export const getCompany = async (id: string) => (await api.getCompanyById(id)).data;
export const createCompany = api.createCompany;

// --- Task API ---
export const getTasks = dataLayer.getHybridTasks;
export const getTask = async (id: string) => (await api.getTaskById(id)).data;

export const getVisibleTasksForUser = async (user: User) => {
    const allTasks = await dataLayer.getHybridTasks();
    if (user.role === 'admin') {
        return allTasks;
    }
    if (user.role === 'company') {
        return allTasks.filter(task => task.companyId === user.companyId);
    }
    if (user.role === 'candidate') {
        return allTasks.filter(task => {
            if (task.isPrivate) {
                return task.assignedTo?.includes(user.id);
            }
            return task.isOpen !== false; // Default to open if not specified
        });
    }
    return [];
};


export const getTasksByCompany = async (companyId: string) => {
    const allTasks = await dataLayer.getHybridTasks();
    return allTasks.filter(t => t.companyId === companyId);
};
export const createTask = api.createTask;
export const assignTask = api.assignTask;

// --- Submission API ---
export const getSubmissions = dataLayer.getHybridSubmissions;
export const getSubmission = async (id: string) => (await api.getSubmissionById(id)).data;
export const getSubmissionsByUser = async (userId: string) => {
    const allSubmissions = await dataLayer.getHybridSubmissions();
    return allSubmissions.filter(s => s.userId === userId);
};
export const getSubmissionsByTask = async (taskId: string) => {
    const allSubmissions = await dataLayer.getHybridSubmissions();
    return allSubmissions.filter(s => s.taskId === taskId);
}
export const createSubmission = api.createSubmission;
export const updateSubmission = api.updateSubmission;
export const updateSubmissionStatus = api.updateSubmissionStatus;


// --- Evaluation API ---
export const getEvaluationBySubmission = async (submissionId: string) => (await api.getEvaluationBySubmissionId(submissionId)).data;
export const getAllEvaluations = dataLayer.getHybridEvaluations;
export const createEvaluation = api.createEvaluation;


// --- Payment APIs ---
export const createPayment = api.createPayment;
export const getInvoicesByUserId = api.getInvoicesByUserId;
export const createSubscription = api.createSubscription;
export const getAllPlans = api.getAllPlans;
export const getSubscriptionByCompany = api.getSubscriptionByCompany;
export const updateSubscription = api.updateSubscription;
export const getAllSubscriptions = api.getAllSubscriptions;
export const getAllInvoices = api.getAllInvoices;


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
export const getSystemIncidents = async () => mockSystemIncidents;
export const getPlanUsage = async () => mockPlanUsage;
export const getUsageMetrics = async () => mockUsageMetrics;
export const getRevenueMetrics = async () => mockRevenueMetrics;
export const getPlanDistribution = async () => mockPlanDistribution;
export const getRevenueSources = async () => mockRevenueSources;
