# User Flows Specification

This document details key operational and user journeys through the application.

---

## Flow 1: Organization Onboarding & Registration

- **Trigger:** New tenant signs up from landing page (`/register`).
- **Actor:** Organization Administrator (`org_admin`).
- **Preconditions:** Unregistered tenant.
- **Steps:**
  1. Navigate to `/register`.
  2. **Step 1 (Admin Details):** Enter Administrator Full Name, Email Address, Password, Password Confirmation. Validate password minimum 8 characters.
  3. **Step 2 (Organization Details):** Enter Organization Name, auto-generate/verify Subdomain/Slug, Phone Number, Default Base Currency (AED, USD, EUR, GBP, INR, SAR, QAR, OMR, BHD), Industry Category.
  4. **Step 3 (Plan Selection):** Select Tier Plan (Free Version or Pro Tier).
  5. **Step 4 (Finalize & Provision):** Click "Complete Signup". Backend provisions organization record, assigns default admin role, creates default leave types and document categories, and establishes session.
- **Postconditions:** Organization is active; admin redirected to executive dashboard (`/dashboard`).
- **Success Signal:** Redirect to `/dashboard` with banner "Welcome back, [Admin Name]!".

---

## Flow 2: Employee Creation & Profile Management

- **Trigger:** Admin or HR Staff creates a new employee record.
- **Actor:** `org_admin` or `org_staff`.
- **Preconditions:** Department and Designation optionally configured.
- **Steps:**
  1. Navigate to `/employees` and click "Add Employee" (`/employees/create`).
  2. Fill **Personal Details:** Full Name, Email Address, Phone Number, Date of Birth, Gender, Nationality, Marital Status.
  3. Fill **Employment Details:** Employee Code / ID, Department ID, Designation ID, Joining Date, Employment Type (Full-time, Part-time, Contract), Reporting Manager.
  4. Fill **Compensation Details:** Basic Salary, Allowances, Payment Mode, Bank Account / IBAN.
  5. Submit form.
- **Postconditions:** New employee record created with initial leave entitlements allocated.

---

## Flow 3: Leave Request & Approval Lifecycle

- **Trigger:** Employee or HR requests time off.
- **Actor:** Employee / `org_staff` / `org_admin`.
- **Preconditions:** Leave types configured and balance available.
- **Steps:**
  1. Navigate to `/leaves/requests`.
  2. Click "Apply Leave" modal. Select Employee, Leave Type (Annual, Sick, Emergency, Unpaid), Start Date, End Date, Reason / Notes, and optional Attachment.
  3. System calculates number of working days excluding public holidays.
  4. Request submitted with status `pending`.
  5. Admin or Line Manager reviews request in `/leaves/requests`.
  6. Admin clicks "Approve" or "Reject".
  7. On approval: Employee leave balance decremented, calendar updated.
- **Success Signal:** Status badge changes to `Approved` and appears on `/leaves/calendar`.

---

## Flow 4: Document Upload & Expiry Tracking

- **Trigger:** HR uploads compliance documents (Passport, Visa, Emirates ID, Labor Card, Contract).
- **Actor:** `org_admin` / `org_staff`.
- **Steps:**
  1. Navigate to `/documents`.
  2. Click "Upload Document" modal.
  3. Select Employee, Document Category (Passport, Visa, National ID, Driving License, Degree Certificate, Insurance, Contract), Document Number, Issue Date, Expiry Date, and File Attachment (PDF, JPG, PNG).
  4. Set Alert Window (30, 60, 90 days before expiry).
  5. Submit upload.
- **Postconditions:** Document encrypted/stored, expiry scheduled in cron notification queue.

---

## Flow 5: Employee Loans & Salary Advances

- **Trigger:** Employee requests financial advance / loan.
- **Actor:** `org_admin` / `org_staff`.
- **Steps:**
  1. Navigate to `/payroll/loans`.
  2. Click "New Loan Application".
  3. Select Employee, Loan Amount, Repayment Term (Months), Monthly Deduction EMI, Start Month, Reason.
  4. Admin approves loan. System schedules deductions against payroll batches.

---

## Flow 6: Company Announcements & Bulletins

- **Trigger:** Management broadcasts notice to staff.
- **Actor:** `org_admin`.
- **Steps:**
  1. Navigate to `/announcements`.
  2. Click "Create Announcement".
  3. Enter Title, Content, Priority (Normal, High, Urgent), Publish Date, Expiry Date, Attachment.
  4. Publish notice. Visible on all user dashboard feeds.
