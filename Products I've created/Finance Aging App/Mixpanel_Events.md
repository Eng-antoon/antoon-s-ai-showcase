# Mixpanel Events Documentation

> **Last Updated:** December 2024

This document provides a comprehensive overview of all Mixpanel analytics events tracked in the application.

## Overview

- **Mixpanel Token**: `78e7e61d422e8647cc0d2b7c82cb0298`
- **API Host**: EU (`https://api-eu.mixpanel.com`)
- **Autocapture**: Disabled

---

## User Context (Automatic Properties)

All events automatically include the following user context properties:

| Property | Type | Description |
|----------|------|-------------|
| `userId` | string | The authenticated user's unique ID |
| `userEmail` | string | The authenticated user's email address |
| `userName` | string | The authenticated user's display name |
| `timestamp` | ISO string | The exact time the event occurred |

---

## Authentication Events

### User Signed In
**Trigger**: User successfully logs into the application

| Property | Type | Description |
|----------|------|-------------|
| `email` | string | The email address used to sign in |
| `method` | string | Authentication method (e.g., "email") |

---

### User Signed Out
**Trigger**: User clicks the sign out button

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Login Failed
**Trigger**: User attempts to log in with invalid credentials

| Property | Type | Description |
|----------|------|-------------|
| `email` | string | The email address that failed authentication |
| `error` | string | The error message returned |

---

## Page View Events

All page views follow the naming convention: `View - {Page Name}`

### View - Login Page
**Trigger**: User navigates to the login page

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### View - Dashboard Page
**Trigger**: User navigates to the dashboard

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### View - Clients Page
**Trigger**: User navigates to the clients page

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### View - Invoices Page
**Trigger**: User navigates to the invoices page

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### View - Reconciliation Page
**Trigger**: User navigates to the reconciliation page

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### View - Activity Log Page
**Trigger**: User navigates to the activity log page

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

## Tab Change Events

Tab changes follow the naming convention: `{Page Name} - {Tab Name}`

### Reconciliation - Manual Entry
**Trigger**: User switches to the Manual Entry tab on Reconciliation page

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Reconciliation - Bulk Upload
**Trigger**: User switches to the Bulk Upload tab on Reconciliation page

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Reconciliation - History
**Trigger**: User switches to the History tab on Reconciliation page

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

## Language Events

### Language Toggled
**Trigger**: User clicks the language toggle button to switch between English and Arabic

| Property | Type | Description |
|----------|------|-------------|
| `newLanguage` | string | The language code switched to ("en" or "ar") |

---

## Dashboard Events

### Dashboard - Client Filter Applied
**Trigger**: User selects a client filter on the dashboard

| Property | Type | Description |
|----------|------|-------------|
| `clientId` | string | The selected client's unique ID |
| `clientName` | string | The selected client's name |
| `clientCode` | string | The selected client's code |

---

### Dashboard - Client Filter Cleared
**Trigger**: User clears the client filter on the dashboard

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

## Client Management Events

### Client - Add Button Clicked
**Trigger**: User clicks the "Add Client" button

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Client - Edit Button Clicked
**Trigger**: User clicks the edit button for a client

| Property | Type | Description |
|----------|------|-------------|
| `clientId` | string | The client's unique ID |
| `clientName` | string | The client's name |

---

### Client - Delete Button Clicked
**Trigger**: User clicks the delete button for a client

| Property | Type | Description |
|----------|------|-------------|
| `clientId` | string | The client's unique ID |
| `clientName` | string | The client's name |

---

### Client - Created Successfully
**Trigger**: A new client is successfully created

| Property | Type | Description |
|----------|------|-------------|
| `clientId` | string | The new client's unique ID |
| `clientName` | string | The client's name |
| `clientCode` | string | The client's code |

---

### Client - Updated Successfully
**Trigger**: A client is successfully updated

| Property | Type | Description |
|----------|------|-------------|
| `clientId` | string | The client's unique ID |
| `clientName` | string | The client's name |
| `clientCode` | string | The client's code |

---

### Client - Deleted Successfully
**Trigger**: A client is successfully deleted

| Property | Type | Description |
|----------|------|-------------|
| `clientId` | string | The deleted client's unique ID |
| `clientName` | string | The deleted client's name |

---

### Client - Delete Blocked
**Trigger**: User attempts to delete a client with existing transactions

| Property | Type | Description |
|----------|------|-------------|
| `clientId` | string | The client's unique ID |
| `clientName` | string | The client's name |
| `reason` | string | The reason the deletion was blocked |

---

### Client - Create Validation Failed
**Trigger**: User attempts to create a client but validation fails

| Property | Type | Description |
|----------|------|-------------|
| `reason` | string | The validation failure reason (e.g., "missing_required_fields", "duplicate_code") |
| `missingFields` | string[] | Array of missing field names (when reason is "missing_required_fields") |
| `clientCode` | string | The duplicate client code (when reason is "duplicate_code") |

---

### Client - Update Validation Failed
**Trigger**: User attempts to update a client but validation fails

| Property | Type | Description |
|----------|------|-------------|
| `reason` | string | The validation failure reason (e.g., "missing_required_fields", "duplicate_code") |
| `missingFields` | string[] | Array of missing field names (when reason is "missing_required_fields") |
| `clientId` | string | The client's unique ID |
| `clientCode` | string | The duplicate client code (when reason is "duplicate_code") |

---

### Client - Add Dialog Cancel
**Trigger**: User cancels the add client dialog

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Client - Edit Dialog Cancel
**Trigger**: User cancels the edit client dialog

| Property | Type | Description |
|----------|------|-------------|
| `clientId` | string | The client's unique ID |

---

### Client - Delete Dialog Cancel
**Trigger**: User cancels the delete client confirmation dialog

| Property | Type | Description |
|----------|------|-------------|
| `clientId` | string | The client's unique ID |

---

### Clients - Search
**Trigger**: User types in the client search field (debounced 500ms)

| Property | Type | Description |
|----------|------|-------------|
| `searchTerm` | string | The search query entered |
| `resultsCount` | number | Number of results matching the search |

---

### Clients - Template Download Clicked
**Trigger**: User clicks the download template button for bulk import

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Clients - Import Started
**Trigger**: User selects a file to import

| Property | Type | Description |
|----------|------|-------------|
| `fileName` | string | Name of the uploaded file |

---

### Clients - Import Failed
**Trigger**: Client import validation fails

| Property | Type | Description |
|----------|------|-------------|
| `fileName` | string | Name of the uploaded file |
| `errorCount` | number | Number of validation errors |
| `errors` | string[] | Array of error messages (first 20) |

---

### Clients - Import Completed
**Trigger**: Client import successfully completes

| Property | Type | Description |
|----------|------|-------------|
| `fileName` | string | Name of the uploaded file |
| `importedCount` | number | Number of clients imported |

---

## Invoice Management Events

### Invoice - Add Button Clicked
**Trigger**: User clicks the "Add Invoice" button

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Invoice - Edit Button Clicked
**Trigger**: User clicks the edit button for an invoice

| Property | Type | Description |
|----------|------|-------------|
| `invoiceId` | string | The invoice's unique ID |
| `invoiceNumber` | string | The invoice number |

---

### Invoice - Delete Button Clicked
**Trigger**: User clicks the delete button for an invoice

| Property | Type | Description |
|----------|------|-------------|
| `invoiceId` | string | The invoice's unique ID |
| `invoiceNumber` | string | The invoice number |

---

### Invoice - Created Successfully
**Trigger**: A new invoice is successfully created

| Property | Type | Description |
|----------|------|-------------|
| `invoiceId` | string | The new invoice's unique ID |
| `invoiceNumber` | string | The invoice number |
| `clientId` | string | The associated client's ID |
| `amount` | number | The invoice total value |

---

### Invoice - Updated Successfully
**Trigger**: An invoice is successfully updated

| Property | Type | Description |
|----------|------|-------------|
| `invoiceId` | string | The invoice's unique ID |
| `invoiceNumber` | string | The invoice number |

---

### Invoice - Create Validation Failed
**Trigger**: User attempts to create an invoice but validation fails

| Property | Type | Description |
|----------|------|-------------|
| `reason` | string | The validation failure reason (e.g., "missing_required_fields", "future_date", "duplicate_found") |
| `missingFields` | string[] | Array of missing field names (when reason is "missing_required_fields") |
| `invoiceDate` | string | The invalid invoice date (when reason is "future_date") |
| `errors` | string[] | Array of duplicate errors (when reason is "duplicate_found") |

---

### Invoice - Update Validation Failed
**Trigger**: User attempts to update an invoice but validation fails

| Property | Type | Description |
|----------|------|-------------|
| `reason` | string | The validation failure reason (e.g., "missing_required_fields", "future_date", "duplicate_found", "not_unpaid_status") |
| `missingFields` | string[] | Array of missing field names (when reason is "missing_required_fields") |
| `invoiceId` | string | The invoice's unique ID |
| `invoiceDate` | string | The invalid invoice date (when reason is "future_date") |
| `currentStatus` | string | The current invoice status (when reason is "not_unpaid_status") |
| `errors` | string[] | Array of duplicate errors (when reason is "duplicate_found") |

---

### Invoice - Deleted Successfully
**Trigger**: An invoice is successfully deleted

| Property | Type | Description |
|----------|------|-------------|
| `invoiceId` | string | The deleted invoice's unique ID |
| `invoiceNumber` | string | The deleted invoice number |

---

### Invoices - Search
**Trigger**: User types in the invoice search field (debounced 500ms)

| Property | Type | Description |
|----------|------|-------------|
| `searchTerm` | string | The search query entered |
| `resultsCount` | number | Number of results matching the search |

---

### Invoices - Status Filter Applied
**Trigger**: User selects a status filter

| Property | Type | Description |
|----------|------|-------------|
| `status` | string | The selected status filter value |

---

### Invoices - Status Filter Cleared
**Trigger**: User clears the status filter

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Invoices - Client Filter Applied
**Trigger**: User selects a client filter on invoices page

| Property | Type | Description |
|----------|------|-------------|
| `clientId` | string | The selected client's unique ID |
| `clientName` | string | The selected client's name |

---

### Invoices - Client Filter Cleared
**Trigger**: User clears the client filter on invoices page

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Invoices - Page Changed
**Trigger**: User navigates to a different page in the pagination

| Property | Type | Description |
|----------|------|-------------|
| `page` | number | The page number navigated to |

---

### Invoices - Template Download Clicked
**Trigger**: User clicks the download template button for bulk import

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Invoices - Import Started
**Trigger**: User selects a file to import invoices

| Property | Type | Description |
|----------|------|-------------|
| `fileName` | string | Name of the uploaded file |

---

### Invoices - Import Failed
**Trigger**: Invoice import validation fails

| Property | Type | Description |
|----------|------|-------------|
| `fileName` | string | Name of the uploaded file |
| `errorCount` | number | Number of validation errors |
| `errors` | string[] | Array of error messages (first 20) |

---

### Invoices - Import Completed
**Trigger**: Invoice import successfully completes

| Property | Type | Description |
|----------|------|-------------|
| `fileName` | string | Name of the uploaded file |
| `importedCount` | number | Number of invoices imported |

---

### Invoices - Error Modal Understood Clicked
**Trigger**: User clicks the "Understood" button in the import error modal

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Invoices - Download Errors Clicked
**Trigger**: User downloads the import errors file from the invoice error modal

| Property | Type | Description |
|----------|------|-------------|
| `errorCount` | number | Number of errors in the downloaded file |

---

### Invoices - Export Clicked
**Trigger**: User clicks the export button to download filtered invoices

| Property | Type | Description |
|----------|------|-------------|
| `totalExported` | number | Number of invoices exported |
| `filters.searchTerm` | string \| null | Active search term filter |
| `filters.statusFilter` | string | Active status filter (e.g., "all", "UNPAID", "PAST_DUE") |
| `filters.clientFilter` | string \| null | Active client ID filter |

---

## Reconciliation Events

### Reconciliation - Completed
**Trigger**: A manual reconciliation is successfully processed

| Property | Type | Description |
|----------|------|-------------|
| `clientId` | string | The reconciled client's unique ID |
| `clientName` | string | The client's name |
| `amount` | number | The reconciliation amount |

---

### Reconciliation - Template Download Clicked
**Trigger**: User clicks the download template button for bulk reconciliation

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Reconciliation - Bulk Import Started
**Trigger**: User selects a file to import reconciliations

| Property | Type | Description |
|----------|------|-------------|
| `fileName` | string | Name of the uploaded file |

---

### Reconciliation - Bulk Import Failed
**Trigger**: Reconciliation import validation fails

| Property | Type | Description |
|----------|------|-------------|
| `fileName` | string | Name of the uploaded file |
| `errorCount` | number | Number of validation errors |
| `errors` | string[] | Array of error messages (first 20) |

---

### Reconciliation - Bulk Import Completed
**Trigger**: Reconciliation import successfully completes

| Property | Type | Description |
|----------|------|-------------|
| `fileName` | string | Name of the uploaded file |
| `processedCount` | number | Number of reconciliations processed |

---

### Reconciliation - History Filter Applied
**Trigger**: User selects a client filter on reconciliation history

| Property | Type | Description |
|----------|------|-------------|
| `clientId` | string | The selected client's unique ID |
| `clientName` | string | The selected client's name |

---

### Reconciliation - History Filter Cleared
**Trigger**: User clears the history client filter

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Reconciliation - Validation Failed
**Trigger**: User attempts a manual reconciliation but validation fails

| Property | Type | Description |
|----------|------|-------------|
| `reason` | string | The validation failure reason (e.g., "no_client_selected", "invalid_amount", "future_date", "overpayment") |
| `attemptedAmount` | string/number | The amount attempted (when reason is "invalid_amount" or "overpayment") |
| `attemptedDate` | string | The invalid date attempted (when reason is "future_date") |
| `clientId` | string | The client's unique ID (when reason is "overpayment") |
| `clientName` | string | The client's name (when reason is "overpayment") |
| `error` | string | The error message (when reason is "overpayment") |

---

### Reconciliation - Error Modal Understood Clicked
**Trigger**: User clicks the "Understood" button in the bulk import error modal

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Reconciliation - Download Errors Clicked
**Trigger**: User downloads the import errors file from the error modal

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

## Client Combobox Events

### Client Combobox - Search
**Trigger**: User types in any client combobox search field (debounced 500ms)

| Property | Type | Description |
|----------|------|-------------|
| `searchTerm` | string | The search query entered |
| `resultsCount` | number | Number of matching clients |
| `location` | string | Page where the combobox is used (e.g., "dashboard", "invoices", "reconciliation") |

---

### Client Combobox - Client Selected
**Trigger**: User selects a client from the combobox dropdown

| Property | Type | Description |
|----------|------|-------------|
| `clientId` | string | The selected client's unique ID |
| `clientName` | string | The selected client's name |
| `location` | string | Page where the selection was made |

---

## Activity Log Events

### Activity Log - Search
**Trigger**: User types in the activity log search field (debounced 500ms)

| Property | Type | Description |
|----------|------|-------------|
| `searchTerm` | string | The search query entered |
| `resultsCount` | number | Number of matching activities |

---

## Navigation Events

### Sign Out Button Clicked
**Trigger**: User clicks the sign out button in the sidebar

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

## Implementation Details

### Initialization
Mixpanel is initialized in `src/App.tsx` on application startup via `initMixpanel()`.

### User Identification
- On login: `identifyUser()` is called with the user's ID, email, and name
- On logout: `resetUser()` is called to clear the user profile

### Debounced Search Tracking
Search events are debounced at 500ms to prevent excessive event firing while users type. This applies to:
- Clients - Search
- Invoices - Search
- Activity Log - Search
- Client Combobox - Search

### Files
- `src/lib/mixpanel.ts` - Core Mixpanel initialization and helper functions
- `src/hooks/useMixpanel.ts` - Custom hook that provides tracking functions with automatic user context injection

---

## Invoice Detail Modal Events

### Invoice - Detail Modal Opened
**Trigger**: User clicks on an invoice row to view details

| Property | Type | Description |
|----------|------|-------------|
| `invoiceId` | string | The invoice's unique ID |
| `invoiceNumber` | string | The invoice number |
| `orderId` | string | The order ID |
| `clientName` | string | The client's name |
| `status` | string | The display status (PAID, OVERDUE, DUE, CURRENT) |
| `isPartiallyPaid` | boolean | Whether the invoice has partial payments |

---

### Invoice - Detail Modal Closed
**Trigger**: User closes the invoice detail modal

| Property | Type | Description |
|----------|------|-------------|
| `invoiceId` | string | The invoice's unique ID |
| `invoiceNumber` | string | The invoice number |

---

### Invoice Detail - Reconciliation History Loaded
**Trigger**: Reconciliation history is fetched when invoice detail modal opens

| Property | Type | Description |
|----------|------|-------------|
| `invoiceId` | string | The invoice's unique ID |
| `invoiceNumber` | string | The invoice number |
| `reconciliationCount` | number | Number of reconciliation records |
| `totalAmountPaid` | number | Total amount paid across all reconciliations |

---

## Invoice Dialog Events

### Invoice - Add Dialog Opened
**Trigger**: User clicks the "Add Invoice" button

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Invoice - Add Dialog Cancel
**Trigger**: User cancels the add invoice dialog

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Invoice - Edit Dialog Cancel
**Trigger**: User cancels the edit invoice dialog

| Property | Type | Description |
|----------|------|-------------|
| `invoiceId` | string | The invoice's unique ID |
| `invoiceNumber` | string | The invoice number |
| `editType` | string | Type of edit: "complete_data" or "edit" |

---

### Invoice - Delete Dialog Cancel
**Trigger**: User cancels the delete invoice confirmation dialog

| Property | Type | Description |
|----------|------|-------------|
| `invoiceId` | string | The invoice's unique ID |
| `invoiceNumber` | string | The invoice number |

---

### Invoice - Error Modal Understood Clicked
**Trigger**: User clicks the "Understood" button in the import error modal

| Property | Type | Description |
|----------|------|-------------|
| `errorCount` | number | Number of errors shown in the modal |

---

## Invoice Incomplete Data Events

### Invoice - Show Incomplete Filter Toggled
**Trigger**: User toggles the "Show Incomplete" filter button

| Property | Type | Description |
|----------|------|-------------|
| `enabled` | boolean | Whether the filter is now enabled |
| `resultsCount` | number | Number of invoices matching the filter |

---

### Invoice - Complete Missing Data Started
**Trigger**: User initiates editing a PAID invoice to complete missing data

| Property | Type | Description |
|----------|------|-------------|
| `invoiceId` | string | The invoice's unique ID |
| `invoiceNumber` | string | The current invoice number (may be null) |
| `orderId` | string | The current order ID (may be null) |
| `status` | string | The invoice status (PARTIALLY_PAID or PAID) |
| `missingField` | string | Which field is missing: "invoice_number", "order_id", or "both" |

---

### Invoice - Complete Missing Data Success
**Trigger**: User successfully completes missing data on a PAID invoice

| Property | Type | Description |
|----------|------|-------------|
| `invoiceId` | string | The invoice's unique ID |
| `invoiceNumber` | string | The updated invoice number |
| `orderId` | string | The updated order ID |
| `completedFields` | string[] | Array of fields that were completed |

---

## Reconciliation Client Selection Events

### Reconciliation - Client Selected
**Trigger**: User selects a client in the manual reconciliation form

| Property | Type | Description |
|----------|------|-------------|
| `clientId` | string | The selected client's unique ID |
| `clientName` | string | The client's name |
| `clientCode` | string | The client's code |
| `totalDebt` | number | The client's total outstanding debt |

---

## Collection Management Events

### View - Collection Management Page
**Trigger**: User navigates to the Collection Management page

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Collection Management - Breakdown
**Trigger**: User switches to the Breakdown tab

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Collection Management - Agent Management
**Trigger**: User switches to the Agent Management tab

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Collection Management - Search
**Trigger**: User types in the search field (debounced 500ms)

| Property | Type | Description |
|----------|------|-------------|
| `searchTerm` | string | The search query entered |
| `resultsCount` | number | Number of results matching the search |

---

### Collection Management - Territory Filter Changed
**Trigger**: User selects a territory filter

| Property | Type | Description |
|----------|------|-------------|
| `territory` | string | The selected territory value |

---

### Collection Management - Agent Filter Changed
**Trigger**: User selects an agent filter on the breakdown tab

| Property | Type | Description |
|----------|------|-------------|
| `agentName` | string | The selected agent's name |

---

### Collection Management - Sort Changed
**Trigger**: User clicks a sortable column header

| Property | Type | Description |
|----------|------|-------------|
| `column` | string | The column sorted (`overdue` or `due_date`) |
| `direction` | string | Sort direction (`asc` or `desc`) |

---

### Page Size Changed
**Trigger**: User changes the page size dropdown

| Property | Type | Description |
|----------|------|-------------|
| `page_size` | number | The new page size selected |

---

### Assign Dialog Opened
**Trigger**: User clicks the "Assign Agent" button to open the dialog

| Property | Type | Description |
|----------|------|-------------|
| `selected_count` | number | Number of clients selected for assignment |

---

### Agent Assigned
**Trigger**: Agent is successfully assigned to clients

| Property | Type | Description |
|----------|------|-------------|
| `agent_name` | string | The assigned agent's name |
| `client_count` | number | Number of clients assigned |

---

### Agent Unassigned
**Trigger**: Agent is unassigned from a client

| Property | Type | Description |
|----------|------|-------------|
| `agent_name` | string | The unassigned agent's name |
| `client_id` | string | The client ID unassigned from |

---

### Create Agent Dialog Opened
**Trigger**: User clicks the "Add Agent" button

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Agent Created
**Trigger**: A new agent is successfully created

| Property | Type | Description |
|----------|------|-------------|
| `agent_name` | string | The new agent's name |
| `agent_code` | string | The new agent's code |

---

### Edit Agent Dialog Opened
**Trigger**: User clicks the edit (pencil) icon on an agent row

| Property | Type | Description |
|----------|------|-------------|
| `agent_name` | string | The agent's name |

---

### Agent Updated
**Trigger**: An agent's details are successfully updated (without status change)

| Property | Type | Description |
|----------|------|-------------|
| `agent_name` | string | The agent's name |
| `agent_code` | string | The agent's code |

---

### Agent Status Changed
**Trigger**: Agent is toggled between Active and Disabled

| Property | Type | Description |
|----------|------|-------------|
| `agent_name` | string | The agent's name |
| `new_status` | string | The new status: `Active` or `Disabled` |

---

### Agent Status Change Blocked
**Trigger**: Attempt to disable agent blocked due to pending submissions

| Property | Type | Description |
|----------|------|-------------|
| `agent_name` | string | The agent's name |

---

## Approvals Queue Events

### View - Approvals Queue
**Trigger**: User navigates to the Approvals Queue page

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Approvals Queue - Review
**Trigger**: User switches to the Review Submissions tab

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Approvals Queue - Analytics
**Trigger**: User switches to the Performance Analytics tab

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Approvals Queue - Date Filter Changed
**Trigger**: User selects a date range filter

| Property | Type | Description |
|----------|------|-------------|
| `from` | string | Start date ISO string |
| `to` | string | End date ISO string |

---

### Approvals Queue - Agent Filter Changed
**Trigger**: User selects an agent filter

| Property | Type | Description |
|----------|------|-------------|
| `agent_name` | string | The selected agent's name |

---

### Approvals Queue - Filters Cleared
**Trigger**: User clicks the "Clear Filters" button

| Property | Type | Description |
|----------|------|-------------|
| (none) | - | Standard user context only |

---

### Approvals Queue - Agent Expanded
**Trigger**: User expands an agent's accordion to view submissions

| Property | Type | Description |
|----------|------|-------------|
| `agent_name` | string | The expanded agent's name |
| `pending_count` | number | Number of pending submissions for this agent |

---

### Submission Approved
**Trigger**: Supervisor approves selected submissions

| Property | Type | Description |
|----------|------|-------------|
| `agent_name` | string | The agent whose submissions were approved |
| `approved_count` | number | Number of submissions approved |
| `total_amount` | number | Total amount approved |
| `batch_id` | string | The reconciliation batch ID generated |

---

### Submission Rejected
**Trigger**: Supervisor rejects selected submissions

| Property | Type | Description |
|----------|------|-------------|
| `agent_name` | string | The agent whose submissions were rejected |
| `rejected_count` | number | Number of submissions rejected |

---
