1. Company & Tenant
Table: Company

id: String (Primary Key, UUID, default generated)
Unique identifier for each company (tenant).
email: String (Unique)
Company’s email for registration/communication.
passwordHash: String
Hashed password for company account.
representative: String?
Name of the company representative.
companyName: String?
Name of the company.
address: String?
Physical address of the company.
phone: String?
Contact phone number.
website: String?
Company website (if available).
createdAt: DateTime (default: now)
Timestamp when the company was created.
updatedAt: DateTime (@updatedAt)
Timestamp for the last update.
Relationships:

One-to-many with Users, ClientGroups, Clients, TaskLists, ClientTasks, Invoices, FileAttachments, and TaskStages.
2. Role & Group (RBAC)
Table: Role

id: String (Primary Key, UUID)
Unique identifier for each role.
name: String
Role name (e.g., "Project Manager", "Developer").
permissions: Json
*JSON object defining permissions. Example:
json
Copy
{
  "board": { "create": true, "viewAll": true },
  "list": { "create": true, "update": true },
  "task": { "assign": true, "trackTime": true }
}
```*
createdAt: DateTime (default: now)
updatedAt: DateTime (@updatedAt)
Table: Group

id: String (Primary Key, UUID)
Unique identifier for each group.
companyId: String
Foreign key referencing Company(id).
name: String
Group name (e.g., "Designers", "Developers").
description: String?
Optional description of the group.
roleId: String
Foreign key referencing Role(id).
createdAt: DateTime (default: now)
updatedAt: DateTime (@updatedAt)
Relationships:

Each Group is linked to one Role; multiple groups can share the same role.
A Group has many Users and can be linked to many TaskStages (defining which group is responsible for a stage).
3. User & Payment Preferences
Table: User

id: String (Primary Key, UUID)
Unique identifier for each user.
companyId: String
Foreign key referencing Company(id).
groupId: String
Foreign key referencing Group(id).
name: String
User’s full name.
email: String (Unique)
User’s email address.
passwordHash: String
Hashed password.
phone: String?
address: String?
hourlyRate: Float?
Hourly rate if the user is paid hourly.
fixedSalary: Float?
Fixed monthly salary, if applicable.
currency: String
Currency code for the user’s pay (e.g., "USD", "EUR").
createdAt: DateTime (default: now)
updatedAt: DateTime (@updatedAt)
Relationships:

A User belongs to a Company and a Group.
A User has many UserTasks, TimeLogs, TaskComments, and FileAttachments.
A User may be linked to managed Clients (if they serve as a project manager).
One-to-one relationship with UserPaymentPreference.
Table: UserPaymentPreference

id: String (Primary Key, UUID)
userId: String (Unique, foreign key to User(id))
method: String
Preferred payment method (e.g., "paypal", "wise", "bank_transfer").
details: Json?
Additional payment details (e.g., PayPal email, IBAN, SWIFT code).
createdAt: DateTime (default: now)
updatedAt: DateTime (@updatedAt)
4. Client Groups & Client
Table: ClientGroup

id: String (Primary Key, UUID)
companyId: String
Foreign key referencing Company(id).
name: String
Name of the client group (e.g., "Top Clients").
description: String?
createdAt: DateTime (default: now)
updatedAt: DateTime (@updatedAt)
Table: Client

id: String (Primary Key, UUID)
companyId: String
Foreign key referencing Company(id).
clientGroupId: String?
Foreign key referencing ClientGroup(id).
projectManagerId: String?
Foreign key referencing User(id) who is the project manager.
name: String
email: String?
phone: String?
address: String?
notes: String?
createdAt: DateTime (default: now)
updatedAt: DateTime (@updatedAt)
Relationships:

A Client belongs to a Company and optionally a ClientGroup.
A Client may be managed by a User (project manager).
A Client has many TaskLists and ClientTasks.
5. Boards, Lists & Tasks
Table: TaskList

id: String (Primary Key, UUID)
companyId: String
Foreign key to Company.
clientId: String?
Optional: if the list is part of a client board.
name: String
description: String?
orderIndex: Int
Defines display order within a board.
createdAt: DateTime (default: now)
updatedAt: DateTime (@updatedAt)
Relationships:

A TaskList belongs to a Company (and optionally a Client).
A TaskList contains many ClientTasks.
Table: ClientTask

id: String (Primary Key, UUID)
companyId: String
clientId: String
listId: String
title: String
description: String?
dueDate: DateTime?
overallStatus: String
(E.g., "Pending", "In Progress", "Completed")
financialInfo: Json?
Billing details, credits, etc.
createdById: String?
assignedById: String?
assignedAt: DateTime?
orderIndex: Int
createdAt: DateTime (default: now)
updatedAt: DateTime (@updatedAt)
Relationships:

A ClientTask belongs to a Company, Client, and TaskList.
A ClientTask has many TaskStages, UserTasks, TaskComments, and Invoices.
Table: TaskStage

id: String (Primary Key, UUID)
companyId: String
clientTaskId: String
name: String
(E.g., "Design", "Development", "Review")
description: String?
Stage-specific instructions.
orderIndex: Int
groupId: String
Foreign key to Group (responsible for the stage).
defaultAssignedUserId: String?
createdAt: DateTime (default: now)
updatedAt: DateTime (@updatedAt)
Relationships:

A TaskStage belongs to a Company and a ClientTask.
It is assigned to a Group.
A TaskStage can have multiple UserTasks, TaskComments, and FileAttachments.
Table: UserTask

id: String (Primary Key, UUID)
clientTaskId: String
companyId: String
assignedUserId: String?
taskStageId: String?
title: String
description: String?
createdById: String?
assignedById: String?
assignedAt: DateTime?
timeLogged: Float @default(0)
status: String
(E.g., "To Do", "In Progress", "Ready for Review", "Completed")
orderIndex: Int
createdAt: DateTime (default: now)
updatedAt: DateTime (@updatedAt)
Relationships:

A UserTask belongs to a Company and a ClientTask.
Optionally linked to a TaskStage.
Has many TimeLogs, TaskComments, and FileAttachments.
6. Time Logs, Task Comments, & Task Notes
Table: TimeLog

id: String (Primary Key, UUID)
userTaskId: String
userId: String
hours: Float
logDate: DateTime (default: now)
notes: String?
Detailed note describing work done during this time entry.
createdAt: DateTime (default: now)
Relationships:

A TimeLog belongs to a UserTask and a User.
Table: TaskComment

id: String (Primary Key, UUID)
taskType: String
(Indicates "client_task", "user_task", or "task_stage".)
taskId: String
ID of the related task entity.
userId: String
content: String
createdAt: DateTime (default: now)
Relationships:

A TaskComment belongs to a User and references the parent task via taskId.
Table: TaskNote
(Alternatively, TaskNote can be integrated with TimeLog. Here we define it as a separate model.)

id: String (Primary Key, UUID)
userTaskId: String?
(Optional: associated with a UserTask)
clientTaskId: String?
(Optional: associated directly with a ClientTask)
userId: String
note: String
Short note detailing what was done.
createdAt: DateTime (default: now)
Relationships:

A TaskNote belongs to a User and can reference either a UserTask or a ClientTask.
7. Invoice & Currency
Table: Invoice

id: String (Primary Key, UUID)
companyId: String
relatedTaskId: String?
Reference to a ClientTask or aggregation from UserTasks.
invoiceType: String
E.g., "Client Billing", "Member Payout".
amount: Float
currency: String
E.g., "USD", "EUR".
exchangeRate: Float?
Optional conversion rate.
status: String
E.g., "Pending", "Paid".
generatedAt: DateTime (default: now)
dueDate: DateTime?
paidAt: DateTime?
createdAt: DateTime (default: now)
Relationships:

An Invoice belongs to a Company.
Table: CurrencyRate

id: String (Primary Key, UUID)
currency: String
ISO code (e.g., "USD", "EUR").
rate: Float
Conversion rate relative to a base currency.
updatedAt: DateTime (default: now, @updatedAt)
Unique Constraint:

Ensure one entry per currency (@@unique([currency])).
8. Monthly Invoice Models
Table: MonthlyInvoice

id: String (Primary Key, UUID)
userId: String
periodStart: DateTime
Start of the invoice period (precise to seconds).
periodEnd: DateTime
End of the invoice period.
totalAmount: Float
Aggregated total amount for the period.
createdAt: DateTime (default: now)
updatedAt: DateTime (@updatedAt)
Relationships:

Belongs to a User.
Has many MonthlyInvoiceLines.
Table: MonthlyInvoiceLine

id: String (Primary Key, UUID)
monthlyInvoiceId: String
clientId: String
taskId: String
Reference to the associated task (ClientTask or UserTask).
taskLink: String
URL or unique identifier to view task details.
note: String
Short note describing work done.
timeSpent: Float
Hours logged for this line item.
hourlyRate: Float
Hourly rate applied.
currency: String
Currency code (e.g., "USD", "EUR").
total: Float
Calculated as timeSpent * hourlyRate (with any adjustments).
finishedAt: DateTime
When the stage was confirmed as complete.
createdAt: DateTime (default: now)
Relationships:

Belongs to a MonthlyInvoice.
References a Client for billing context.
Relationships Summary
Company is the root for all tenant data. Child entities (Users, Clients, etc.) reference Company via foreign keys.
Role & Group: Roles define permissions; Groups are linked to Roles, and Users belong to Groups.
Client & ClientGroup: Clients are organized into ClientGroups and assigned to a project manager.
Boards & Lists: TaskLists (lists) are rendered on boards (inferred by grouping lists by Client or User).
Tasks:
ClientTask is the main task record for a Client.
TaskStage divides a task into stages with stage-specific details and responsible groups.
UserTask represents subtasks assigned to users and can reference a TaskStage.
Time & Notes:
TimeLog records work hours with detailed notes.
TaskNote (or integrated into TimeLog) captures short notes on what was done.
Financials:
Invoice and MonthlyInvoice/MonthlyInvoiceLine models aggregate billing data.
CurrencyRate holds conversion rates.
File Attachments:
FileAttachment stores file metadata and a relative URL, using a structured path (year/month/day).
