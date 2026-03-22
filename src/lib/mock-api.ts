
import { getDB, setDB } from './mock-db';
import type { User, Company, Task, Submission, Evaluation, SubmissionStatus, Invoice, Plan, Subscription } from './types';

const ARTIFICIAL_DELAY = 300;

// --- UTILITY ---
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const simulateApiCall = <T>(data: T): Promise<{ success: true; data: T }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, data });
    }, Math.random() * 500 + 300); // 300-800ms delay
  });
};

// --- USER APIs ---

export const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: true; data: User }> => {
  const db = getDB();
  const newUser: User = {
    ...userData,
    id: generateId('user'),
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  setDB({ ...db, users: [...db.users, newUser] });
  return simulateApiCall(newUser);
};

export const getUserById = async (id: string): Promise<{ success: true; data: User | undefined }> => {
  const db = getDB();
  const user = db.users.find(u => u.id === id);
  return simulateApiCall(user);
};

export const getAllUsers = async (): Promise<{ success: true; data: User[] }> => {
  const db = getDB();
  return simulateApiCall(db.users);
};


// --- COMPANY APIs ---

export const createCompany = async (companyData: Omit<Company, 'id' | 'createdAt'>): Promise<{ success: true; data: Company }> => {
  const db = getDB();
  const newCompany: Company = {
    ...companyData,
    id: generateId('co'),
    createdAt: new Date().toISOString(),
  };
  setDB({ ...db, companies: [...db.companies, newCompany] });
  return simulateApiCall(newCompany);
};

export const getCompanyById = async (id: string): Promise<{ success: true; data: Company | undefined }> => {
  const db = getDB();
  const company = db.companies.find(c => c.id === id);
  return simulateApiCall(company);
};

export const getAllCompanies = async (): Promise<{ success: true; data: Company[] }> => {
    const db = getDB();
    return simulateApiCall(db.companies);
};


// --- TASK APIs ---

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: true; data: Task }> => {
  const db = getDB();
  const now = new Date().toISOString();
  const newTask: Task = {
    ...taskData,
    id: generateId('task'),
    createdAt: now,
    updatedAt: now,
  };
  setDB({ ...db, tasks: [...db.tasks, newTask] });
  return simulateApiCall(newTask);
};

export const getAllTasks = async (): Promise<{ success: true; data: Task[] }> => {
  const db = getDB();
  return simulateApiCall(db.tasks);
};

export const getTaskById = async (taskId: string): Promise<{ success: true; data: Task | undefined }> => {
  const db = getDB();
  const task = db.tasks.find(t => t.id === taskId);
  return simulateApiCall(task);
};

export const getTasksByCompanyId = async (companyId: string): Promise<{ success: true; data: Task[] }> => {
  const db = getDB();
  const tasks = db.tasks.filter(t => t.companyId === companyId);
  return simulateApiCall(tasks);
}

// assignTask creates a new submission with status 'assigned'
export const assignTask = async (taskId: string, userId: string): Promise<{ success: true; data: Submission }> => {
  const db = getDB();
  const task = db.tasks.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found");

  const existingSubmission = db.submissions.find(s => s.taskId === taskId && s.userId === userId);
  if (existingSubmission) return simulateApiCall(existingSubmission);

  const now = new Date().toISOString();
  const newSubmission: Submission = {
    id: generateId('sub'),
    taskId,
    userId,
    companyId: task.companyId,
    status: 'assigned',
    assignedAt: now,
    lastUpdated: now,
  };
  setDB({ ...db, submissions: [...db.submissions, newSubmission] });
  return simulateApiCall(newSubmission);
};


// --- SUBMISSION APIs ---

export const createSubmission = async (submissionData: Omit<Submission, 'id'|'companyId'|'status'|'assignedAt'|'lastUpdated'>): Promise<{ success: true; data: Submission }> => {
  const db = getDB();
  const task = db.tasks.find(t => t.id === submissionData.taskId);
  if (!task) throw new Error("Task not found");
  
  const now = new Date().toISOString();
  const newSubmission: Submission = {
    ...submissionData,
    id: generateId('sub'),
    companyId: task.companyId,
    status: 'pending',
    assignedAt: now, // Should ideally exist, but we add it for robustness
    submittedAt: now,
    lastUpdated: now,
  };
  setDB({ ...db, submissions: [...db.submissions, newSubmission] });
  return simulateApiCall(newSubmission);
};

export const getSubmissionsByUser = async (userId: string): Promise<{ success: true; data: Submission[] }> => {
  const db = getDB();
  const userSubmissions = db.submissions.filter(s => s.userId === userId);
  return simulateApiCall(userSubmissions);
};

export const getAllSubmissions = async (): Promise<{ success: true; data: Submission[] }> => {
    const db = getDB();
    return simulateApiCall(db.submissions);
}

export const getSubmissionById = async (id: string): Promise<{ success: true; data: Submission | undefined }> => {
    const db = getDB();
    const submission = db.submissions.find(s => s.id === id);
    return simulateApiCall(submission);
}

export const getSubmissionsByTask = async (taskId: string): Promise<{ success: true; data: Submission[] }> => {
  const db = getDB();
  const taskSubmissions = db.submissions.filter(s => s.taskId === taskId);
  return simulateApiCall(taskSubmissions);
};

export const updateSubmissionStatus = async (submissionId: string, status: SubmissionStatus): Promise<{ success: true; data: Submission | undefined }> => {
    const db = getDB();
    let updatedSubmission: Submission | undefined;
    const updatedSubmissions = db.submissions.map(s => {
        if (s.id === submissionId) {
            updatedSubmission = { ...s, status, lastUpdated: new Date().toISOString() };
            return updatedSubmission;
        }
        return s;
    });
    setDB({ ...db, submissions: updatedSubmissions });
    return simulateApiCall(updatedSubmission);
};

// --- EVALUATION APIs ---

export const createEvaluation = async (evaluationData: Omit<Evaluation, 'id' | 'evaluatedAt'>): Promise<{ success: true; data: Evaluation }> => {
  const db = getDB();
  const now = new Date().toISOString();
  const newEvaluation: Evaluation = {
    ...evaluationData,
    id: generateId('eval'),
    evaluatedAt: now,
  };
  
  const submissions = db.submissions.map(s => {
      if (s.id === evaluationData.submissionId) {
          return { ...s, status: 'evaluated' as SubmissionStatus, lastUpdated: now };
      }
      return s;
  });

  setDB({ ...db, evaluations: [...db.evaluations, newEvaluation], submissions });
  return simulateApiCall(newEvaluation);
};

export const getEvaluationBySubmissionId = async (submissionId: string): Promise<{ success: true; data: Evaluation | undefined }> => {
  const db = getDB();
  const evaluation = db.evaluations.find(e => e.submissionId === submissionId);
  return simulateApiCall(evaluation);
};

export const getAllEvaluations = async (): Promise<{ success: true, data: Evaluation[] }> => {
    const db = getDB();
    return simulateApiCall(db.evaluations);
};


// --- PAYMENT APIs (MOCK) ---

export const createPayment = async (data: any): Promise<{ success: true, data: any }> => {
    const newPayment = { ...data, id: generateId('pay'), createdAt: new Date().toISOString() };
    // In a real scenario, you'd add this to a 'payments' collection in the DB.
    return simulateApiCall(newPayment);
}

export const getUserPayments = async (userId: string): Promise<{ success: true, data: any[] }> => {
    // Mock implementation returns an empty array
    return simulateApiCall([]);
}

// --- Other API mocks that might be needed ---

export const getAllPlans = async (): Promise<{ success: true; data: Plan[] }> => {
    const db = getDB();
    return simulateApiCall(db.plans);
}

export const getAllSubscriptions = async (): Promise<{ success: true; data: Subscription[] }> => {
    const db = getDB();
    return simulateApiCall(db.subscriptions);
}

export const getAllInvoices = async (): Promise<{ success: true; data: Invoice[] }> => {
    const db = getDB();
    return simulateApiCall(db.invoices);
}
