import * as api from './mock-api';
import {
  mockUsers,
  mockCompanies,
  mockTasks,
  mockSubmissions,
  mockEvaluations,
} from './mock-data';
import type { User, Company, Task, Submission, Evaluation } from './types';

// This file acts as a hybrid data layer, fetching from the persistent
// mock API first and falling back to the hardcoded mock data.

const mergeData = <T extends { id: string }>(apiData: T[], mockData: T[]): T[] => {
    const apiDataIds = new Set(apiData.map(d => d.id));
    const filteredMockData = mockData.filter(d => !apiDataIds.has(d.id));
    return [...apiData, ...filteredMockData];
}

export const getHybridUsers = async (): Promise<User[]> => {
  const { data: apiUsers } = await api.getAllUsers();
  return mergeData(apiUsers, mockUsers);
};

export const getHybridCompanies = async (): Promise<Company[]> => {
  const { data: apiCompanies } = await api.getAllCompanies();
  return mergeData(apiCompanies, mockCompanies);
};

export const getHybridTasks = async (): Promise<Task[]> => {
    const { data: apiTasks } = await api.getAllTasks();
    return mergeData(apiTasks, mockTasks);
};

export const getHybridSubmissions = async (): Promise<Submission[]> => {
    const { data: apiSubmissions } = await api.getAllSubmissions();
    return mergeData(apiSubmissions, mockSubmissions);
};

export const getHybridEvaluations = async (): Promise<Evaluation[]> => {
    const { data: apiEvaluations } = await api.getAllEvaluations();
    return mergeData(apiEvaluations, mockEvaluations);
};
