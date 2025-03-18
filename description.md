Project: Multi‑Tenant Task Management & Financial Tracking System
1. Project Overview
Our platform is a multi‑tenant task management and financial tracking system designed exclusively for companies. Inspired by Trello, Asana, and Monday—with unique enhancements—this system enables companies to:

Securely manage teams and projects:

Register companies, create team groups, and assign roles using a robust Role‑Based Access Control (RBAC) system.
Each team member inherits a set of permissions defined in a JSON‑formatted Role, ensuring consistent access control.
Manage Clients and Projects:

Organize clients into client groups (e.g., Top Clients, Law Firms) and assign each client to a project manager.
Each client and user has a dedicated board. Boards contain lists (e.g., "Upcoming Tasks," "Tasks in Progress," "On-Hold Tasks," "Completed Tasks") that group task cards. Lists are rendered as part of the board, not as separate pages.
Task & Workflow Management:

Create tasks (cards) with detailed descriptions, progress them through multiple stages (e.g., Design, Development, Review), and record audit information (who created and assigned tasks with timestamps).
Each task stage is modeled separately so that stage‑specific details, attachments, and instructions appear only for the responsible group (e.g., designers vs. developers).
Users can log time spent on tasks and leave short notes describing what work was completed. These details feed into our invoicing system.
Financial Tracking & Invoicing:

Generate dynamic monthly (or weekly) invoices that aggregate each user's work. Each invoice line item includes the client name, task link, work notes, time spent, hourly rate, currency, and computed totals.
Store currency conversion rates centrally via a dedicated table.
Capture each user’s preferred payment method (e.g., PayPal, Wise, Payoneer, bank transfer) and related payment details.
Rich Collaboration & File Handling:

Use a Quill‑based rich‑text editor for task descriptions, comments, and stage notes.
Custom image handlers in Quill upload images via multipart/form-data to the backend, where files are stored on disk in a structured folder format (year/month/day) and referenced by URL.
Operational Excellence & Future‑Proofing:

Endpoints are versioned (starting with /api/v1) to support future upgrades (e.g., /api/v2).
Daily backups are scheduled via cron jobs.
The frontend is a Progressive Web App (PWA) built with Next.js (App Router) and React v19.
Zod is used for robust runtime validation on both backend and frontend.
The architecture is modular and prepared for future AI integrations (e.g., smart routing, predictive analytics).
2. Technology Stack & Dependencies
Backend
Fastify:
High‑performance Node.js framework with built‑in Pino logging and plugin support.
Prisma ORM:
Type‑safe, schema‑driven ORM for PostgreSQL with migration support.
PostgreSQL:
Robust relational database for multi‑tenant data storage.
jsonwebtoken & bcryptjs:
For secure JWT‑based authentication and password hashing.
fastify-cors & fastify-cookie:
To handle CORS and secure cookie management.
fastify-multipart:
For handling file uploads.
nodemailer:
For email notifications (registration, password resets).
dotenv:
For managing environment variables.
Zod:
For runtime request validation (integrated into validation files).
ESLint & Prettier:
To enforce code quality and formatting.
Testing Tools (Jest/Tap):
For unit and integration tests.
Frontend
Next.js (with App Router) & React v19:
Core framework for SSR, routing, and UI development.
Tailwind CSS:
Utility‑first CSS framework for consistent styling.
@hello-pangea/dnd:
For drag‑and‑drop functionality (reordering lists and cards).
Quill:
Rich‑text editor with a custom image handler that uploads files to the backend.
React Context & Custom Hooks:
For managing global state (authentication, RBAC).
Built‑in fetch API:
For HTTP requests.
TanStack Query:
For robust data fetching and caching.
Zod:
For client‑side validation (mirroring backend validations).
PWA Support:
Configured via Next.js PWA plugins or a custom service worker.
3. Database Schema (Prisma)
Our schema is designed to keep growing datasets in separate tables with efficient foreign key relationships. Below is an overview of the key models.

Company, Role & Group
Company:
Stores tenant details (email, representative, etc.) and is referenced by child models.
Role:
Contains a JSON field for permission flags.
Group:
Each Group is linked to a Role; Users belong to Groups.
User & Payment Preference
User:
Contains user details, compensation info (hourlyRate, fixedSalary, currency), and links to a UserPaymentPreference.
UserPaymentPreference:
Stores preferred payment methods (e.g., PayPal, Wise) and additional payment details.
Clients & Client Groups
ClientGroup:
Organizes clients.
Client:
Stores client details and links to a project manager (a User) and ClientGroup.
Boards, Lists & Tasks
TaskList:
Represents lists on boards. A list belongs to a client board (or optionally a user board) and contains tasks.
ClientTask:
High‑level tasks tied to a client; includes audit fields (createdBy, assignedBy, assignedAt).
TaskStage:
Splits a ClientTask into stages; holds stage‑specific details, instructions, and attachments.
UserTask:
Represents subtasks assigned to users, optionally linked to a TaskStage.
TimeLog:
Records hours logged on a task, including detailed notes.
TaskComment:
Stores comments on tasks or stages.
TaskNote:
(Alternatively, integrated into TimeLog) Stores a short note for what was done on a task—useful for invoicing.
Invoicing & Currency
Invoice (MonthlyInvoice):
Aggregates a user’s work over a defined period (with periodStart and periodEnd) and includes a total amount.
MonthlyInvoiceLine:
Details individual line items from tasks, including client, task link, work note, time spent, hourly rate, currency, and total.
CurrencyRate:
Maintains currency conversion rates.
File Attachments
FileAttachment:
Stores file metadata and relative URLs (e.g., /uploads/{year}/{month}/{day}/filename.ext).
(Refer to the detailed schema above for full field definitions.)

4. Backend Project Structure
Our backend code is organized into domains under /backend/src:

csharp
Copy
/backend
  └── src
      ├── api
      │   ├── auth
      │   │   ├── auth-controller.js       // Handles register, login, forgot/reset password
      │   │   ├── auth-service.js          // Contains authentication business logic
      │   │   ├── auth-routes.js           // Defines endpoints: POST /api/v1/auth/login, etc.
      │   │   └── auth-validation.js       // Zod validations for auth endpoints
      │   ├── companies
      │   │   ├── company-controller.js    // CRUD for companies
      │   │   ├── company-service.js
      │   │   ├── company-routes.js        // Endpoints: /api/v1/companies
      │   │   └── company-validation.js
      │   ├── clients
      │   │   ├── client-controller.js     // CRUD for clients
      │   │   ├── client-service.js
      │   │   ├── client-routes.js         // Endpoints: /api/v1/clients
      │   │   └── client-validation.js
      │   ├── users
      │   │   ├── user-controller.js       // CRUD for team members
      │   │   ├── user-service.js
      │   │   ├── user-routes.js           // Endpoints: /api/v1/users
      │   │   └── user-validation.js
      │   ├── groups
      │   │   ├── group-controller.js      // CRUD for groups (team member groups)
      │   │   ├── group-service.js
      │   │   ├── group-routes.js          // Endpoints: /api/v1/groups
      │   │   └── group-validation.js
      │   ├── clientGroups
      │   │   ├── clientGroup-controller.js// CRUD for client groups
      │   │   ├── clientGroup-service.js
      │   │   ├── clientGroup-routes.js    // Endpoints: /api/v1/client-groups
      │   │   └── clientGroup-validation.js
      │   ├── labelsTags
      │   │   ├── label-controller.js      // CRUD for global labels/tags
      │   │   ├── label-service.js
      │   │   ├── label-routes.js          // Endpoints: /api/v1/labels-tags
      │   │   └── label-validation.js
      │   ├── lists
      │   │   ├── list-controller.js       // CRUD for task lists (rendered on boards)
      │   │   ├── list-service.js
      │   │   ├── list-routes.js           // Endpoints: /api/v1/lists
      │   │   └── list-validation.js
      │   ├── clientTasks
      │   │   ├── clientTask-controller.js // CRUD for client tasks
      │   │   ├── clientTask-service.js
      │   │   ├── clientTask-routes.js     // Endpoints: /api/v1/client-tasks
      │   │   └── clientTask-validation.js
      │   ├── taskStages
      │   │   ├── taskStage-controller.js  // CRUD for task stages
      │   │   ├── taskStage-service.js
      │   │   ├── taskStage-routes.js      // Endpoints: /api/v1/task-stages
      │   │   └── taskStage-validation.js
      │   ├── userTasks
      │   │   ├── userTask-controller.js   // CRUD for user tasks (subtasks)
      │   │   ├── userTask-service.js
      │   │   ├── userTask-routes.js       // Endpoints: /api/v1/user-tasks
      │   │   └── userTask-validation.js
      │   ├── timeLogs
      │   │   ├── timeLog-controller.js    // CRUD for time logs (with detailed work notes)
      │   │   ├── timeLog-service.js
      │   │   ├── timeLog-routes.js        // Endpoints: /api/v1/time-logs
      │   │   └── timeLog-validation.js
      │   ├── taskComments
      │   │   ├── taskComment-controller.js// CRUD for task comments
      │   │   ├── taskComment-service.js
      │   │   ├── taskComment-routes.js    // Endpoints: /api/v1/task-comments
      │   │   └── taskComment-validation.js
      │   ├── taskNotes
      │   │   ├── taskNote-controller.js   // CRUD for task notes (short notes on work done)
      │   │   ├── taskNote-service.js
      │   │   ├── taskNote-routes.js       // Endpoints: /api/v1/task-notes
      │   │   └── taskNote-validation.js
      │   ├── invoices
      │   │   ├── invoice-controller.js    // CRUD for invoices (monthly/weekly)
      │   │   ├── invoice-service.js
      │   │   ├── invoice-routes.js        // Endpoints: /api/v1/invoices
      │   │   └── invoice-validation.js
      │   ├── currencyRates
      │   │   ├── currencyRate-controller.js  // CRUD for currency rates
      │   │   ├── currencyRate-service.js
      │   │   ├── currencyRate-routes.js      // Endpoints: /api/v1/currency-rates
      │   │   └── currencyRate-validation.js
      │   ├── userPaymentPreferences
      │   │   ├── userPaymentPreference-controller.js  // CRUD for payment preferences
      │   │   ├── userPaymentPreference-service.js
      │   │   ├── userPaymentPreference-routes.js      // Endpoints: /api/v1/user-payment-preferences
      │   │   └── userPaymentPreference-validation.js
      ├── config
      │   └── index.js                     // Global configuration (env variables, file paths, etc.)
      ├── middlewares
      │   ├── auth-middleware.js           // Verifies JWT and attaches req.user
      │   ├── role-middleware.js           // Checks RBAC permissions via Zod and role data
      │   ├── error-handler.js             // Global error handling middleware
      │   └── rate-limit.js                // (Optional) Rate limiting middleware
      ├── prisma
      │   └── schema.prisma                // Prisma schema definition (see above)
      ├── utils
      │   ├── logger.js                    // Centralized logging (using Pino)
      │   ├── fileStorage.js               // Helper functions for generating file paths (year/month/day)
      │   └── helpers.js                   // Miscellaneous helper functions
      └── server.js                        // Fastify instance and startup logic
  └── package.json
5. Frontend Project Structure
Our frontend uses Next.js with the new App Router, configured as a PWA. Pages are organized under /src/app with dedicated areas for authentication and a dashboard. Boards for clients and users display lists (which are rendered as components within board pages, not standalone pages).

arduino
Copy
/frontend
  └── src
      ├── app
      │   ├── layout.jsx               // Global layout (includes Header, Footer, global providers)
      │   ├── page.jsx                 // Landing/Home page
      │   ├── auth
      │   │   ├── login
      │   │   │   └── page.jsx         // Login page
      │   │   ├── register
      │   │   │   └── page.jsx         // Registration page
      │   │   ├── forgot-password
      │   │   │   └── page.jsx         // Forgot password page
      │   │   └── reset-password
      │   │       └── page.jsx         // Reset password page
      │   ├── dashboard
      │   │   ├── layout.jsx           // Dashboard layout (Sidebar, Header, etc.)
      │   │   ├── page.jsx             // Dashboard home
      │   │   ├── companies
      │   │   │   ├── page.jsx         // Companies list (CRUD)
      │   │   │   └── [companyId]
      │   │   │       ├── page.jsx     // Company detail view
      │   │   │       └── edit
      │   │   │           └── page.jsx // Edit company form
      │   │   ├── clients
      │   │   │   ├── page.jsx         // Clients list (CRUD)
      │   │   │   └── [clientId]
      │   │   │       ├── page.jsx     // Client detail view
      │   │   │       ├── boards         // Client board for tasks and lists
      │   │   │       │   └── page.jsx   // Renders pre-created lists (Upcoming, In Progress, On-Hold, Completed) and supports card creation/movement
      │   │   │       └── edit
      │   │   │           └── page.jsx // Edit client form
      │   │   ├── users
      │   │   │   ├── page.jsx         // Users list (CRUD)
      │   │   │   └── [userId]
      │   │   │       ├── page.jsx     // User detail view
      │   │   │       ├── boards         // User board for tasks and lists
      │   │   │       │   └── page.jsx   // Renders lists and cards (tasks)
      │   │   │       └── edit
      │   │   │           └── page.jsx // Edit user form
      │   │   ├── invoices
      │   │   │   ├── page.jsx         // Invoices list (CRUD)
      │   │   │   └── [invoiceId]
      │   │   │       └── page.jsx     // Invoice detail view
      │   │   ├── labelsTags
      │   │   │   ├── page.jsx         // Global labels/tags list (CRUD)
      │   │   │   └── edit
      │   │   │       └── page.jsx     // Edit label/tag form
      │   │   └── settings
      │   │       └── page.jsx         // Application/user settings
      │   └── api                       // (Optional) Next.js API routes if needed
      ├── components
      │   ├── common
      │   │   ├── Button.jsx           // Reusable button component
      │   │   ├── Input.jsx            // Reusable input component
      │   │   ├── Modal.jsx            // Reusable modal component
      │   │   └── RichTextEditor.jsx   // Quill-based editor with custom image handler
      │   ├── layout
      │   │   ├── Header.jsx
      │   │   ├── Footer.jsx
      │   │   └── Sidebar.jsx
      │   └── dashboard
      │       ├── DashboardSidebar.jsx
      │       └── DashboardHeader.jsx
      ├── hooks
      │   ├── useAuth.js               // Provides authentication state and RBAC info
      │   └── useRequireAuth.js        // Protects pages based on auth status
      ├── lib
      │   ├── apiClient.js             // Wrapper for fetch API
      │   └── auth.js                  // Helper functions for token management
      ├── styles
      │   ├── globals.css              // Global Tailwind CSS and custom styles
      │   └── tailwind.config.js       // Tailwind configuration
      └── package.json
6. Frontend Dependencies Recap
Next.js & React (v19): Core framework for SSR, routing, and UI.
Tailwind CSS: For styling.
@hello-pangea/dnd: For drag‑and‑drop reordering.
Quill: For rich‑text editing (with a custom image handler).
React Context & Custom Hooks: For managing global state (authentication, RBAC).
Built‑in fetch API: For HTTP requests.
TanStack Query: For data fetching and caching (if required).
Zod: For client‑side validation.
PWA Support: Configured via Next.js PWA plugins or a custom service worker.
7. Cron Jobs & Backups
Daily Backups:
A cron job (using node‑cron) executes daily backup scripts (e.g., /backend/src/cron/backup-job.js) to back up the PostgreSQL database. Backups are stored in a designated folder with rotation management.
8. Additional Operational Considerations
Logging & Monitoring:
Use Fastify’s built‑in Pino for centralized logging; consider future integration with Sentry.
Security:
Implement rate limiting (fastify‑rate‑limit) and enforce API versioning (/api/v1).
Documentation:
Maintain internal documentation for API endpoints and data models; consider integrating Swagger/Redoc later.
Testing:
Develop comprehensive unit, integration, and end‑to‑end tests using Jest, React Testing Library, and possibly Cypress.
9. Development Order & Workflow
To ensure proper dependency management and avoid gaps in functionality, we propose the following development order:

Authentication Module:

Develop backend auth endpoints (register, login, password resets) with JWT and middleware.
Build frontend authentication pages (login, register, forgot/reset password) and set up React Context for auth state.
Role, Group & User Modules:

Implement backend models and CRUD for Roles, Groups, and Users.
Create endpoints for managing Groups and Users.
Build frontend pages to manage and display groups and users.
Payment Preferences:

Create backend endpoints for UserPaymentPreference.
Build a frontend form to let users set their preferred payment method and details.
Client Management:

Build backend modules for ClientGroup and Client with full CRUD endpoints.
Develop frontend pages for listing, viewing, and editing clients.
Ensure each client is assigned a project manager and belongs to a client group.
Board & List Structure:

Implement TaskList endpoints; lists will be rendered on boards rather than as separate pages.
Frontend: Build board pages for clients (/clients/[clientId]/boards) and for users (/team/[userId]/board), where pre‑created lists (Upcoming Tasks, In Progress, On-Hold, Completed) are rendered and cards can be added/moved.
Task & Workflow Modules:

Develop backend modules for ClientTask, TaskStage, and UserTask (with audit fields, time logging, and task notes).
Build endpoints for CRUD operations on tasks and stages.
Frontend: Implement card creation/editing interfaces within boards, including drag‑and‑drop reordering and rich‑text editing via the custom Quill component.
Time Logs & Task Notes:

Implement backend modules for TimeLog and TaskNote (if separate from TimeLog).
Develop endpoints to record hours and work notes.
Frontend: Integrate forms for users to log time and notes when marking work complete.
Global Labels/Tags:

Build backend modules for labelsTags with full CRUD endpoints.
Frontend: Develop pages for managing global labels and tags.
Invoicing & Currency:

Implement backend modules for MonthlyInvoice, MonthlyInvoiceLine, and CurrencyRate.
Develop endpoints for generating and updating invoices as tasks are marked complete.
Frontend: Create invoice dashboards for users and finance, including filtering by month and custom period boundaries.
File Attachments:

Develop backend modules for FileAttachment; integrate fastify‑multipart for file uploads.
Implement helper functions (in utils/fileStorage.js) to generate file paths (year/month/day).
Frontend: Integrate the custom image handler in Quill to upload images and insert returned URLs.
Final Touches:

Set up cron jobs for daily backups.
Finalize error handling, logging, and rate limiting.
Write tests for all modules and document endpoints.
Final Summary
This comprehensive project blueprint outlines our multi‑tenant task management system from A to Z:

Backend:
• Built with Fastify, Prisma, and PostgreSQL; organized into domains (auth, companies, clients, users, groups, client groups, labels/tags, lists, client tasks, task stages, user tasks, time logs, task comments, task notes, invoices, currency rates, and user payment preferences).
• REST API endpoints are versioned under /api/v1 and support full CRUD operations.
• Audit fields, file attachments (stored with a year/month/day path), and robust validations (with Zod) are included.

Frontend:
• Built with Next.js (App Router) and React v19; styled with Tailwind CSS and configured as a PWA.
• Organized under /src/app with pages for auth and dashboard modules (companies, clients with boards, users with boards, invoices, labels/tags, settings).
• Boards render lists as components (not separate pages) and support drag‑and‑drop reordering.
• Rich‑text editing via a Quill‑based reusable component (with a custom image handler) is used for task descriptions and comments.
• Global state is managed with React Context and custom hooks, while HTTP requests are handled with the built‑in fetch API (with optional TanStack Query for advanced caching).

Operational Considerations:
• Daily backups via cron jobs, comprehensive testing, code quality (ESLint/Prettier), centralized logging (Pino), and API versioning ensure a robust production system.
• The development order ensures that dependencies (e.g., Groups and Users) are created before Clients, so that each client can be associated with a group and a project manager.

