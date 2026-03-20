# SkillMatch Pro: System Architecture

This document provides a high-level overview of the system architecture for the SkillMatch Pro platform. It is designed to guide the development process, ensuring a scalable, secure, and maintainable application.

## 1. Architecture Overview

SkillMatch Pro is a full-stack web application built on a modern, serverless-oriented stack.

-   **Frontend:** A Next.js (App Router) application using React, TypeScript, and Tailwind CSS for a fast, server-rendered user interface.
-   **Backend & Database:** The backend is powered by Firebase, leveraging its integrated suite of services:
    -   **Firebase Authentication:** For user management and secure login.
    -   **Firestore:** A NoSQL, document-based database for all application data.
    -   **Cloud Storage for Firebase:** For storing candidate submission files (e.g., ZIP archives, PDFs).
    -   **Genkit/Cloud Functions:** For server-side logic, such as AI-powered evaluations and third-party integrations.
-   **Infrastructure & Hosting:** The Next.js frontend will be hosted on Vercel for optimal performance and CI/CD, while the entire backend runs on the Firebase/Google Cloud infrastructure.

---

## 2. Frontend Architecture

-   **Framework:** Next.js 14+ with the App Router, React 18 (Server Components), and TypeScript.
-   **Styling:** Tailwind CSS with shadcn/ui components for a consistent and professional design system.
-   **Core Pages/Routes:**
    -   `/`: Public landing page.
    -   `/login`, `/signup`: Authentication pages.
    -   `/(app)/candidate/dashboard`: Candidate's main dashboard.
    -   `/(app)/candidate/tasks`: Page to browse and filter available tasks.
    -   `/(app)/candidate/tasks/[taskId]`: Detailed view of a specific task.
    -   `/(app)/candidate/submissions`: List of candidate's past submissions and their status.
    -   `/(app)/company/dashboard`: Company's main dashboard.
    -   `/(app)/company/tasks`: Manage created tasks.
    -   `/(app)/company/tasks/create`: Form for creating a new task (with AI assistance).
    -   `/(app)/company/submissions`: View and manage submissions for their tasks.
    -   `/(app)/company/submissions/[submissionId]`: Page to review and evaluate a specific submission.
    -   `/(app)/admin/dashboard`: Admin panel for platform oversight.
-   **Component Structure:**
    -   **UI Components (`src/components/ui`):** Reusable, generic components from shadcn/ui (Button, Card, Input, etc.).
    -   **App Components (`src/components`):** Application-specific components like `DashboardSidebar`, `Logo`, etc.
    -   **Layouts (`src/app/(public)` & `src/app/(app)`):** Route groups define distinct layouts for public-facing pages and the authenticated application dashboard.
-   **State Management:**
    -   **React Server Components:** Used by default for data fetching, reducing client-side JavaScript.
    -   **React `useState` / `useEffect`:** For local component state in Client Components.
    -   **React Context (`src/contexts/auth-context.tsx`):** For managing global state like user authentication status.

---

## 3. Backend Architecture

The backend leverages a "Backend as a Service" (BaaS) model with Firebase, complemented by server-side logic within Next.js.

-   **API Structure:** We will favor Next.js Server Actions and direct client-to-Firestore communication over a traditional standalone REST API.
    -   **Next.js Server Actions:** Used for mutations and form submissions (e.g., creating a task). This allows calling server-side functions directly from React components.
    -   **Firebase Client SDK:** Used for real-time data fetching (`useCollection`, `useDocument`) directly within React components. Access is securely managed by Firestore Security Rules.
-   **Layered Logic:**
    -   **Routes (Next.js):** The frontend routes in the `app` directory define the application's structure.
    -   **UI Components:** Handle user interaction and trigger data operations.
    -   **Server Actions / Flows (`src/ai/flows`):** Contain the core business logic for mutations and AI-related processing.
    -   **Models (Firestore):** The database collections act as the data models.
-   **Authentication:** Firebase Authentication will manage user identities (email/password, Google auth).
-   **Role-Based Access Control (RBAC):**
    -   A `role` field ('candidate', 'company', 'admin') will be stored in each user's document in Firestore.
    -   **Firestore Security Rules** will be the primary mechanism for enforcing access control, ensuring users can only read or write data appropriate for their role.

---

## 4. Database Design

-   **Database Type:** Firestore (NoSQL). Its flexible, scalable nature is a perfect fit for this application.
-   **Core Collections:**
    -   `users`:
        -   **Document ID:** `{userId}` (from Firebase Auth)
        -   **Data:** `name`, `email`, `role`, `companyId` (if applicable), `profile` object.
    -   `companies`:
        -   **Document ID:** `{companyId}`
        -   **Data:** `name`, `description`, `ownerId`.
    -   `tasks`:
        -   **Document ID:** `{taskId}`
        -   **Data:** `title`, `description`, `difficulty`, `deadline`, `companyId`.
    -   `submissions`:
        -   **Document ID:** `{submissionId}`
        -   **Data:** `taskId`, `userId` (candidate), `companyId`, `content` (link/file path), `status`, `submittedAt`.
    -   `evaluations`:
        -   **Document ID:** `{evaluationId}`
        -   **Data:** `submissionId`, `score`, `feedback`, `evaluatedBy` (company user ID).
-   **Relationships:** Relationships are managed via stored IDs. For example, a `Submission` document contains a `taskId` and a `userId` to link it to the corresponding Task and User.

---

## 5. Core System Flow (Example: Task Submission & Evaluation)

1.  **Task Creation:** A logged-in 'company' user fills out the "Create Task" form. A Next.js Server Action is invoked, which writes a new document to the `tasks` collection in Firestore.
2.  **Task Discovery:** A 'candidate' user browses the tasks page, which securely reads from the `tasks` collection.
3.  **Submission:** The candidate submits their work. The client uploads the file to **Cloud Storage** and then creates a new document in the `submissions` collection with the file path/link, `taskId`, and `userId`. Firestore Security Rules verify the user is a 'candidate'.
4.  **Evaluation:** A 'company' user associated with the task views the submission. After reviewing, they submit a score and feedback. This action creates a new document in the `evaluations` collection and updates the `status` of the corresponding `submission` document to 'evaluated'. Security rules ensure only the correct company can evaluate.
5.  **Feedback:** The candidate sees the updated 'evaluated' status and can view the data from the `evaluations` document.

---

## 6. Infrastructure

-   **Hosting:**
    -   **Frontend (Next.js):** Vercel (Recommended) or Firebase App Hosting. Vercel provides seamless integration with Next.js.
    -   **Backend (Firebase):** Google Cloud's global infrastructure.
-   **Database Hosting:** Firestore is fully managed by Google Cloud.
-   **File Storage:** Cloud Storage for Firebase will be used for storing submission files.

---

## 7. Scalability Considerations

The chosen architecture is inherently scalable.

-   **Serverless:** Firebase services (Auth, Firestore, Storage) and Next.js Server Actions/Vercel Functions are serverless, scaling automatically with demand.
-   **Decoupled Frontend/Backend:** The frontend is decoupled from the backend logic, allowing them to be scaled independently.
-   **AI Integration:** The existing Genkit flows for AI evaluation are designed as separate, scalable services that don't block core application functionality.
-   **Future Microservices:** If a complex piece of business logic emerges (e.g., advanced analytics), it can be built as a separate Cloud Function without altering the core application.

---

## 8. Security Considerations

-   **Authentication & Authorization:** Firebase Auth provides robust authentication. **Firestore Security Rules are critical** and will be the primary method for authorization, preventing unauthorized data access.
-   **Data Validation:**
    -   **Client-Side:** Libraries like `zod` will be used in forms.
    -   **Backend:** Security rules will perform data validation on all writes to Firestore.
-   **Secure File Uploads:** Cloud Storage for Firebase has its own security rules system to ensure that only authenticated candidates can upload submissions for specific tasks.
-   **Rate Limiting:** Firebase services have built-in abuse protection. Additional rate limiting can be implemented in Cloud Functions if needed.
