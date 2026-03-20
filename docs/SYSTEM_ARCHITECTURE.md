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

## 4. Database Design & Entity Relationships

This section details the Firestore database schema, entity relationships, and data integrity rules.

### 4.1. Database Type

-   **Database:** Firestore (NoSQL)
-   **Reasoning:** Its flexible, document-based data model is ideal for the evolving requirements of SkillMatch Pro. The real-time capabilities are a plus for live updates on submission statuses, and its serverless nature ensures scalability with minimal operational overhead.

### 4.2. Core Collections

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

### 4.3. Textual ER Diagram

The relationships are managed via stored IDs in documents, representing foreign keys in a relational model.

`
  Company (1) --< (M) User      // A company has multiple users (employees)
  User (1) >-- (1) Company     // A user belongs to at most one company

  Company (1) --< (M) Task      // A company creates multiple tasks

  User (1) --< (M) Submission  // A candidate makes multiple submissions
  Task (1) --< (M) Submission  // A task receives multiple submissions

  Submission (1) -- (1) Evaluation // A submission receives one evaluation

  User (1) --< (M) Evaluation  // A company user performs multiple evaluations
`

### 4.4. Detailed Relationship Explanations

-   **User ↔ Company (Many-to-One)**
    -   **Description:** A `User` with the role of 'company' is associated with one `Company`. A `Company` can have multiple `Users` (employees, recruiters, hiring managers).
    -   **Implementation:**
        -   The `users` document for a company employee contains a `companyId` field.
        -   The `companies` document has an `ownerId` to denote the primary administrator.
    -   **Cardinality:** `User (M)` to `Company (1)`.

-   **Company ↔ Task (One-to-Many)**
    -   **Description:** A `Company` can post multiple `Tasks` to the platform. Each `Task` is created by and belongs to exactly one `Company`.
    -   **Implementation:** The `tasks` document contains a `companyId` field.
    -   **Cardinality:** `Company (1)` to `Task (M)`.

-   **User (Candidate) ↔ Submission (One-to-Many)**
    -   **Description:** A `User` with the role of 'candidate' can make multiple `Submissions` for different tasks. Each `Submission` belongs to a single candidate.
    -   **Implementation:** The `submissions` document contains a `userId` field.
    -   **Cardinality:** `User (1)` to `Submission (M)`.

-   **Task ↔ Submission (One-to-Many)**
    -   **Description:** A `Task` can receive many `Submissions` from different candidates. Each `Submission` is for exactly one `Task`.
    -   **Implementation:** The `submissions` document contains a `taskId` field.
    -   **Cardinality:** `Task (1)` to `Submission (M)`.

-   **Submission ↔ Evaluation (One-to-One)**
    -   **Description:** For the initial version, each `Submission` will have at most one `Evaluation`. This establishes a direct link between the work submitted and the feedback provided.
    -   **Implementation:** The `evaluations` document contains a `submissionId`. Firestore security rules will enforce that only one evaluation can be created per submission ID.
    -   **Cardinality:** `Submission (1)` to `Evaluation (1)`.

-   **User (Evaluator) ↔ Evaluation (One-to-Many)**
    -   **Description:** A `User` (with 'company' or 'admin' role) can perform multiple `Evaluations`. Each `Evaluation` is performed by a single `User`.
    -   **Implementation:** The `evaluations` document contains an `evaluatedBy` field, which stores the `userId` of the evaluator.
    -   **Cardinality:** `User (1)` to `Evaluation (M)`.

### 4.5. Data Integrity & Constraints

These rules will be enforced primarily through Firestore Security Rules to ensure the database remains consistent and secure.

-   A `Task` can only be created by a user with the 'company' role, and its `companyId` must match the user's `companyId`.
-   A `Submission` can only be created by a user with the 'candidate' role.
-   The `taskId` in a `Submission` must correspond to a valid, existing document in the `tasks` collection.
-   An `Evaluation` can only be created by a user belonging to the same company that posted the task.
-   An `Evaluation` cannot be created unless a corresponding `Submission` exists.
-   The `score` in an `Evaluation` must be within a predefined range (e.g., 0-100).
-   Once a `Submission` is evaluated, it cannot be modified by the candidate.

### 4.6. Future Relationship Extensions

-   **Multiple Evaluators:** The `Submission` to `Evaluation` relationship could become One-to-Many to allow for peer reviews or multiple rounds of feedback. This would require `evaluations` to be a sub-collection of `submissions`.
-   **Company Teams:** A `teams` sub-collection could be added under `companies` to group users, allowing tasks and submissions to be assigned to specific teams.
-   **Team Submissions:** The `Submission` entity could be modified to include an array of `userIds` to support collaborative tasks.

---

## 5. Role-Based Access Control (RBAC)

This section defines the permissions for each user role and the logic for enforcing them.

### 5.1. Role Overview

-   **Candidate:** A user who is looking for job opportunities. They can browse and complete tasks to showcase their skills.
-   **Company:** A user representing an organization. They create tasks to find and evaluate potential hires.
-   **Admin:** A superuser with full control over the platform. They manage users, moderate content, and oversee all platform activity.

### 5.2. Permission Matrix

| Feature/Action                     | Candidate | Company | Admin |
| :--------------------------------- | :-------: | :-----: | :---: |
| **User Management**                |           |         |       |
| View own profile                   |     ✅    |    ✅   |   ✅  |
| Edit own profile                   |     ✅    |    ✅   |   ✅  |
| View other user profiles           |     ❌    |    ✅*  |   ✅  |
| Manage all users (CRUD)            |     ❌    |    ❌   |   ✅  |
| **Company Management**             |           |         |       |
| View company profiles              |     ✅    |    ✅   |   ✅  |
| Create/Edit own company profile    |     ❌    |    ✅   |   ✅  |
| Manage all companies               |     ❌    |    ❌   |   ✅  |
| **Task Management**                |           |         |       |
| View/Browse all tasks              |     ✅    |    ✅   |   ✅  |
| Create/Edit/Delete own tasks       |     ❌    |    ✅   |   ✅  |
| Manage all tasks                   |     ❌    |    ❌   |   ✅  |
| **Submission Management**          |           |         |       |
| Create submission for a task       |     ✅    |    ❌   |   ❌  |
| View own submissions & status      |     ✅    |    ❌   |   ✅  |
| View submissions for own tasks     |     ❌    |    ✅   |   ✅  |
| Manage all submissions             |     ❌    |    ❌   |   ✅  |
| **Evaluation Management**          |           |         |       |
| View evaluation for own submission |     ✅    |    ❌   |   ✅  |
| Create/Edit evaluation for tasks   |     ❌    |    ✅   |   ✅  |
| Manage all evaluations             |     ❌    |    ❌   |   ✅  |

_*Companies can only view profiles of candidates who have submitted a solution to one of their tasks._

### 5.3. Access Control Enforcement

-   **Primary Enforcement: Firestore Security Rules**
    -   This is the most critical layer of security. Rules will be written to secure the database at the source.
    -   **Example Rule:** A user can only write to a `submissions` document if their `auth.uid` matches the `userId` on the document and their `role` is 'candidate'.
    -   **Example Rule:** A user can only read `submissions` for a task if their `companyId` matches the `companyId` on the task.

-   **Client-Side UI Control:**
    -   The Next.js frontend will use the authenticated user's role (from `useAuth` context) to conditionally render UI elements.
    -   For example, the "Create Task" button will only be visible to users with the 'company' role.
    -   This improves user experience by not showing actions that would be denied by the backend anyway.

-   **Server-Side Logic (Server Actions / Cloud Functions):**
    -   Any backend logic will re-validate the user's role and permissions before executing an operation. This provides a second layer of defense and is crucial for any actions that have side-effects beyond a simple database write.

---

## 6. Core System Flow (Example: Task Submission & Evaluation)

1.  **Task Creation:** A logged-in 'company' user fills out the "Create Task" form. A Next.js Server Action is invoked, which writes a new document to the `tasks` collection in Firestore.
2.  **Task Discovery:** A 'candidate' user browses the tasks page, which securely reads from the `tasks` collection.
3.  **Submission:** The candidate submits their work. The client uploads the file to **Cloud Storage** and then creates a new document in the `submissions` collection with the file path/link, `taskId`, and `userId`. Firestore Security Rules verify the user is a 'candidate'.
4.  **Evaluation:** A 'company' user associated with the task views the submission. After reviewing, they submit a score and feedback. This action creates a new document in the `evaluations` collection and updates the `status` of the corresponding `submission` document to 'evaluated'. Security rules ensure only the correct company can evaluate.
5.  **Feedback:** The candidate sees the updated 'evaluated' status and can view the data from the `evaluations` document.

---

## 7. Lifecycle States

This section defines the lifecycle states for the primary entities in the system. These states are critical for managing the application workflow, tracking progress, and enforcing business rules.

### 7.1. Task Lifecycle

The task lifecycle tracks a task from its creation to its eventual archiving.

-   **States:**
    1.  **Draft:** The initial state when a company user is creating a task. It is not yet visible to candidates.
    2.  **Open:** The task is published and visible on the marketplace. Candidates can view details and submit their work.
    3.  **Closed:** The submission deadline has passed. The task is still visible but no longer accepts new submissions.
    4.  **Archived:** The task is no longer active and has been moved to an archive for record-keeping. It is not visible on the main task list.

-   **State Details & Transitions:**
    -   **`Draft` → `Open`**
        -   **Action:** "Publish Task"
        -   **Actor:** Company user, Admin.
        -   **Rule:** The task must have all required fields (title, description, etc.) before it can be published.
    -   **`Open` → `Closed`**
        -   **Action:** This is an automated transition.
        -   **Trigger:** The system automatically changes the state when `current_time` > `deadline`.
        -   **Rule:** No new submissions are accepted once the task is closed.
    -   **`Closed` → `Archived`**
        -   **Action:** "Archive Task"
        -   **Actor:** Company user, Admin.
        -   **Rule:** A task can be archived to clean up the main view. This is a manual action.

### 7.2. Submission Lifecycle

The submission lifecycle tracks a candidate's work from the moment it's submitted until a final decision is made.

-   **States:**
    1.  **Pending:** A candidate has successfully submitted their work. It is now awaiting review from the company. This is the initial state upon creation.
    2.  **In-Review:** A company user has started reviewing the submission. This state indicates to the candidate and other company members that the submission is actively being assessed.
    3.  **Evaluated:** The submission has been scored and feedback has been provided.
    4.  **Shortlisted:** The company has marked this submission as a top performer. This candidate is considered for the next stage of the hiring process.
    5.  **Rejected:** The company has decided not to move forward with this candidate for this task.

-   **State Details & Transitions:**
    -   **`Pending` → `In-Review`**
        -   **Action:** "Start Review"
        -   **Actor:** Company user, Admin.
        -   **Rule:** This is a manual action taken by a reviewer from the submission dashboard. It helps prevent multiple reviewers from assessing the same submission simultaneously.
    -   **`In-Review` → `Evaluated`**
        -   **Action:** "Submit Evaluation"
        -   **Actor:** Company user, Admin.
        -   **Rule:** This transition occurs when an `evaluations` document is successfully created and linked to the submission. The evaluation must contain a score and feedback.
    -   **`Evaluated` → `Shortlisted` / `Rejected`**
        -   **Action:** "Shortlist Candidate" or "Reject Candidate"
        -   **Actor:** Company user, Admin.
        -   **Rule:** After evaluation, the company makes a final decision. This is a manual action that sets the final status of the submission.

-   **Automation & Rules:**
    -   Candidates cannot submit work for tasks that are not in the `Open` state.
    -   Submissions cannot be edited by the candidate after being submitted.
    -   Notifications should be triggered to inform the candidate when their submission moves to `Evaluated`.

### 7.3. Candidate Lifecycle (High-Level)

This describes the journey of a candidate on the platform, which can be tracked for analytics and user engagement purposes.

-   **States:**
    -   **Registered:** User has created an account with the 'candidate' role.
    -   **Active:** Candidate has completed their profile (e.g., added skills, bio).
    -   **Participated:** Candidate has made at least one submission.
    -   **Evaluated:** At least one of the candidate's submissions has been evaluated.
    -   **Shortlisted:** Candidate has been shortlisted for at least one task.

-   **State Updates:** These are not strict states but rather milestones. They would be derived from user activity rather than being a single field in the `users` document. For example, a candidate is "shortlisted" if any of their submissions have a status of `shortlisted`.

---

## 8. Infrastructure

-   **Hosting:**
    -   **Frontend (Next.js):** Vercel (Recommended) or Firebase App Hosting. Vercel provides seamless integration with Next.js.
    -   **Backend (Firebase):** Google Cloud's global infrastructure.
-   **Database Hosting:** Firestore is fully managed by Google Cloud.
-   **File Storage:** Cloud Storage for Firebase will be used for storing submission files.

---

## 9. Scalability Considerations

The chosen architecture is inherently scalable.

-   **Serverless:** Firebase services (Auth, Firestore, Storage) and Next.js Server Actions/Vercel Functions are serverless, scaling automatically with demand.
-   **Decoupled Frontend/Backend:** The frontend is decoupled from the backend logic, allowing them to be scaled independently.
-   **AI Integration:** The existing Genkit flows for AI evaluation are designed as separate, scalable services that don't block core application functionality.
-   **Future Microservices:** If a complex piece of business logic emerges (e.g., advanced analytics), it can be built as a separate Cloud Function without altering the core application.

---

## 10. Security Considerations

-   **Authentication & Authorization:** Firebase Auth provides robust authentication. **Firestore Security Rules are critical** and will be the primary method for authorization, preventing unauthorized data access.
-   **Data Validation:**
    -   **Client-Side:** Libraries like `zod` will be used in forms.
    -   **Backend:** Security rules will perform data validation on all writes to Firestore.
-   **Secure File Uploads:** Cloud Storage for Firebase has its own security rules system to ensure that only authenticated candidates can upload submissions for specific tasks.
-   **Rate Limiting:** Firebase services have built-in abuse protection. Additional rate limiting can be implemented in Cloud Functions if needed.
