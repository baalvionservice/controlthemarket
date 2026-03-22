
'use server';

import * as api from './mock-api';
import * as dataLayer from './data-layer';
import type { User, TaskTemplate } from './types';

// This file now acts as the single source of truth for all data operations.
// It uses the hybrid data layer for fetching, and all functions are standardized
// to return the data array/object directly, abstracting away the API response structure.

// --- User API ---
export const getUsers = async () => (await dataLayer.getHybridUsers());
export const getUser = async (id: string) => (await api.getUserById(id)).data;
export const createUser = api.createUser;
export const updateUser = api.updateUser;


// --- Company API ---
export const getCompanies = async () => (await dataLayer.getHybridCompanies());
export const getCompany = async (id: string) => (await api.getCompanyById(id)).data;
export const createCompany = api.createCompany;

// --- Task API ---
export const getTasks = async () => (await dataLayer.getHybridTasks());
export const getTask = async (id: string) => (await api.getTaskById(id)).data;

export const getTasksByCompany = async (companyId: string) => {
    const allTasks = await dataLayer.getHybridTasks();
    return allTasks.filter(t => t.companyId === companyId);
};
export const createTask = api.createTask;
export const assignTask = api.assignTask;


// --- Submission API ---
export const getSubmissions = async () => (await dataLayer.getHybridSubmissions());
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
export const getAllEvaluations = async () => (await dataLayer.getHybridEvaluations());
export const createEvaluation = api.createEvaluation;
export const getEvaluationSchemas = async () => (await api.getEvaluationSchemas()).data;


// --- Payment APIs ---
export const createPayment = api.createPayment;
export const getInvoicesByCompanyId = async (companyId: string) => (await api.getInvoicesByCompanyId(companyId));
export const createSubscription = api.createSubscription;
export const getAllPlans = async () => (await api.getAllPlans()).data;
export const getSubscriptionByCompany = async (companyId: string) => (await api.getSubscriptionByCompany(companyId)).data;
export const updateSubscription = api.updateSubscription;
export const getAllSubscriptions = async () => (await api.getAllSubscriptions()).data;
export const getAllInvoices = async () => (await api.getAllInvoices()).data;


// --- Badge API ---
export const getBadges = async () => (await api.getAllBadges()).data;


// --- Activity & Notification APIs ---
export const getActivityLogs = async () => (await dataLayer.getHybridActivities());
export const getNotifications = async () => (await dataLayer.getHybridNotifications());


// --- Template API ---
export const getTemplates = async () => (await api.getTemplates()).data;
export const saveTemplate = api.saveTaskAsTemplate;


// --- Other Admin/System APIs ---
export const getTestCasesBySubmission = async (submissionId: string) => (await api.getTestCasesBySubmission(submissionId)).data;
export const getGitHubRepositories = async () => (await api.getGitHubRepositories()).data;
export const getWebhooks = async () => (await api.getWebhooks()).data;
export const getWebhookTriggerLogs = async (webhookId: string) => (await api.getWebhookTriggerLogs(webhookId)).data;
export const getTeams = async () => (await api.getTeams()).data;
export const getApiIntegrations = async () => (await api.getApiIntegrations()).data;
export const getIntegrationLogs = async () => (await api.getIntegrationLogs()).data;
export const getSystemMetrics = async () => (await api.getSystemMetrics()).data;
export const getServiceStatus = async () => (await api.getServiceStatus()).data;
export const getServiceLoad = async () => (await api.getServiceLoad()).data;
export const getScalingEvents = async () => (await api.getScalingEvents()).data;
export const getSystemIncidents = async () => (await api.getSystemIncidents()).data;
export const getSystemLogs = async () => (await dataLayer.getHybridSystemLogs());
export const getSystemErrors = async () => (await dataLayer.getHybridSystemErrors());
export const getPlanUsage = async () => (await api.getPlanUsage()).data;
export const getUsageMetrics = async () => (await api.getUsageMetrics()).data;
export const getRevenueMetrics = async () => (await api.getRevenueMetrics()).data;
export const getPlanDistribution = async () => (await api.getPlanDistribution()).data;
export const getRevenueSources = async () => (await api.getRevenueSources()).data;
