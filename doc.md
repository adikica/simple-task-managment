
---

## Final Summary

This complete project blueprint includes:

- **Prisma Schema:**  
  A detailed schema with inline comments for every model and field, covering Company, Role, Group, User (with payment preferences), ClientGroup, Client, TaskList, ClientTask, TaskStage, UserTask, TimeLog, TaskComment, Invoice, FileAttachment, CurrencyRate, MonthlyInvoice, and MonthlyInvoiceLine.

- **REST API v1 Routes:**  
  A comprehensive list of versioned endpoints for full CRUD operations across all entities (auth, companies, clients, client groups, users, groups, labels/tags, lists, client tasks, task stages, user tasks, time logs, task comments, task notes, invoices, currency rates, user payment preferences).

- **Backend Structure:**  
  A domain‑based folder structure with clear responsibilities for controllers, services, routes, and validation files. Each domain (auth, companies, clients, etc.) is designed to keep growing datasets in separate tables (via foreign keys) to avoid bloating parent records.

- **Frontend Structure:**  
  Next.js (App Router) based PWA with organized pages under `/src/app` for authentication and a dashboard that includes companies, clients (with boards), users (with boards), invoices, labels/tags, and settings. Reusable components and global state management (React Context, custom hooks) ensure code consistency and maintainability.

- **Dependencies & Operational Considerations:**  
  A lean set of backend and frontend dependencies (Fastify, Prisma, PostgreSQL, JWT, bcrypt, Zod, Next.js, Tailwind, Quill, etc.), daily backups via cron, logging with Pino, rate limiting, testing with Jest, and a future‑proof, versioned API strategy.

- **Development Workflow:**  
  A recommended order for development—starting with authentication, then user and group management, client modules, board/list structures, task/workflow modules, time logging/task notes, labels/tags, invoicing, file attachments, currency rates, and payment preferences—ensuring dependencies are set up correctly before creating dependent entities.

This detailed blueprint serves as a comprehensive reference for building the system from A to Z without redundant dependencies or mid‑project refactoring.

Feel free to save this Markdown document to your GitHub repository for future reference and to share with your team. If you need further adjustments or additional details, let me know.
