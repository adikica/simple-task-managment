REST API v1 Routes Overview
All endpoints are prefixed with /api/v1 to support versioning.

Authentication (auth)
POST /api/v1/auth/register – Register a new company/user.
POST /api/v1/auth/login – Authenticate and obtain a JWT.
POST /api/v1/auth/forgot-password – Request a password reset.
POST /api/v1/auth/reset-password – Reset password using a token.
Companies
GET /api/v1/companies – List companies.
GET /api/v1/companies/:companyId – Get company details.
POST /api/v1/companies – Create a company.
PUT/PATCH /api/v1/companies/:companyId – Update a company.
DELETE /api/v1/companies/:companyId – Delete/archive a company.
Clients
GET /api/v1/clients – List all clients.
GET /api/v1/clients/:clientId – Get client details.
POST /api/v1/clients – Create a client.
PUT/PATCH /api/v1/clients/:clientId – Update a client.
DELETE /api/v1/clients/:clientId – Delete/archive a client.
Client Groups
GET /api/v1/client-groups – List client groups.
GET /api/v1/client-groups/:clientGroupId – Get client group details.
POST /api/v1/client-groups – Create a client group.
PUT/PATCH /api/v1/client-groups/:clientGroupId – Update a client group.
DELETE /api/v1/client-groups/:clientGroupId – Delete a client group.
Users
GET /api/v1/users – List users.
GET /api/v1/users/:userId – Get user details.
POST /api/v1/users – Create a user.
PUT/PATCH /api/v1/users/:userId – Update a user.
DELETE /api/v1/users/:userId – Delete a user.
Groups
GET /api/v1/groups – List groups.
GET /api/v1/groups/:groupId – Get group details.
POST /api/v1/groups – Create a group.
PUT/PATCH /api/v1/groups/:groupId – Update a group.
DELETE /api/v1/groups/:groupId – Delete a group.
Labels/Tags
GET /api/v1/labels-tags – List global labels/tags.
GET /api/v1/labels-tags/:labelId – Get label/tag details.
POST /api/v1/labels-tags – Create a label/tag.
PUT/PATCH /api/v1/labels-tags/:labelId – Update a label/tag.
DELETE /api/v1/labels-tags/:labelId – Delete a label/tag.
Lists
GET /api/v1/lists – List task lists (filtered by board context).
POST /api/v1/lists – Create a new list.
PUT/PATCH /api/v1/lists/:listId – Update a list.
DELETE /api/v1/lists/:listId – Delete a list.
Client Tasks
GET /api/v1/client-tasks – List client tasks.
GET /api/v1/client-tasks/:taskId – Get client task details.
POST /api/v1/client-tasks – Create a client task.
PUT/PATCH /api/v1/client-tasks/:taskId – Update a client task.
DELETE /api/v1/client-tasks/:taskId – Delete/archive a client task.
Task Stages
GET /api/v1/task-stages – List task stages.
GET /api/v1/task-stages/:stageId – Get task stage details.
POST /api/v1/task-stages – Create a task stage.
PUT/PATCH /api/v1/task-stages/:stageId – Update a task stage.
DELETE /api/v1/task-stages/:stageId – Delete a task stage.
User Tasks
GET /api/v1/user-tasks – List user tasks (subtasks).
GET /api/v1/user-tasks/:userTaskId – Get user task details.
POST /api/v1/user-tasks – Create a user task.
PUT/PATCH /api/v1/user-tasks/:userTaskId – Update a user task.
DELETE /api/v1/user-tasks/:userTaskId – Delete a user task.
Time Logs
GET /api/v1/time-logs – List time logs.
GET /api/v1/time-logs/:timeLogId – Get time log details.
POST /api/v1/time-logs – Create a time log.
PUT/PATCH /api/v1/time-logs/:timeLogId – Update a time log.
DELETE /api/v1/time-logs/:timeLogId – Delete a time log.
Task Comments
GET /api/v1/task-comments – List task comments.
GET /api/v1/task-comments/:commentId – Get task comment details.
POST /api/v1/task-comments – Create a task comment.
PUT/PATCH /api/v1/task-comments/:commentId – Update a task comment.
DELETE /api/v1/task-comments/:commentId – Delete a task comment.
Task Notes
GET /api/v1/task-notes – List task notes.
GET /api/v1/task-notes/:noteId – Get task note details.
POST /api/v1/task-notes – Create a task note.
PUT/PATCH /api/v1/task-notes/:noteId – Update a task note.
DELETE /api/v1/task-notes/:noteId – Delete a task note.
Invoices
GET /api/v1/invoices – List invoices.
GET /api/v1/invoices/:invoiceId – Get invoice details.
POST /api/v1/invoices – Create an invoice.
PUT/PATCH /api/v1/invoices/:invoiceId – Update an invoice.
DELETE /api/v1/invoices/:invoiceId – Delete an invoice.
Currency Rates
GET /api/v1/currency-rates – List currency rates.
GET /api/v1/currency-rates/:rateId – Get currency rate details.
POST /api/v1/currency-rates – Create a currency rate.
PUT/PATCH /api/v1/currency-rates/:rateId – Update a currency rate.
DELETE /api/v1/currency-rates/:rateId – Delete a currency rate.
User Payment Preferences
GET /api/v1/user-payment-preferences – List user payment preferences.
GET /api/v1/user-payment-preferences/:prefId – Get details of a payment preference.
POST /api/v1/user-payment-preferences – Create a payment preference.
PUT/PATCH /api/v1/user-payment-preferences/:prefId – Update a payment preference.
DELETE /api/v1/user-payment-preferences/:prefId – Delete a payment preference.
