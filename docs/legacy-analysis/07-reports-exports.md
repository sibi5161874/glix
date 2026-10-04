# Reports & Export Specifications

This document catalogs all reporting views, export formats, and filter criteria available in the application.

---

## 1. Employee Demographics Report (`/reports/employees`)
- **Filters:** Department, Designation, Employment Status (`active`, `probation`, `terminated`), Joining Date Range.
- **Columns:** Employee Code, Full Name, Email, Department, Designation, Joining Date, Basic Salary, Status.
- **Export Formats:** Excel (.xlsx), CSV, Print / PDF.

## 2. Leave Utilization Report (`/reports/leaves`)
- **Filters:** Date Range, Leave Type, Department, Approval Status.
- **Columns:** Employee Name, Department, Leave Type, Start Date, End Date, Total Days, Approver, Status.
- **Export Formats:** Excel (.xlsx), CSV.

## 3. Document Expiries Report (`/reports/documents`)
- **Filters:** Expiry Horizon (30 days, 60 days, 90 days, Expired), Document Category, Department.
- **Columns:** Employee Code, Employee Name, Document Type, Document Number, Expiry Date, Remaining Days, Status Flag (`Valid`, `Expiring Soon`, `Expired`).
- **Export Formats:** Excel (.xlsx), PDF Summary.

## 4. Loan Summaries Report (`/reports/loans`)
- **Filters:** Loan Status (`Active`, `Settled`), Date Range.
- **Columns:** Employee Name, Principal Amount, Monthly EMI, Paid Amount, Outstanding Balance, Start Month, End Month.
- **Export Formats:** Excel (.xlsx), CSV.
