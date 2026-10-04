# Comprehensive Screen Specifications

Detailed functional, input, action, and validation specifications for every screen discovered.

## Module: Public → Public Landing Page

- **URL:** `https://connect.rmd.city/public/`
- **Page Title:** `Glix Connect HR Portal`
- **Screenshot:** [`docs/legacy-analysis/screenshots/01-landing.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/01-landing.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `billing-cycle-toggle` | `checkbox` | No | `—` | `on` | Validated on submit |
| `employee-slider` | `range` | No | `—` | `25` | Validated on submit |
| `name` | `text` | Yes | `e.g. John Doe` | `—` | Validated on submit |
| `email` | `email` | Yes | `e.g. john@company.com` | `—` | Validated on submit |
| `phone` | `text` | No | `e.g. +971 50 123 4567` | `—` | Validated on submit |
| `subject` | `text` | No | `e.g. Enterprise Trial Request` | `—` | Validated on submit |
| `message` | `textarea` | Yes | `Write details about your query here...` | `—` | Validated on submit |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Enter Platform** | `button` | `btn` | Form submission / Modal toggle |
| **Go to Dashboard** | `button` | `btn` | Form submission / Modal toggle |
| **Already Active** | `button` | `btn` | Form submission / Modal toggle |
| **Send Message** | `submit` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** Standard data rows
- **Initial Row Count:** 3

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Auth → Tenant / Employee Login

- **URL:** `https://connect.rmd.city/public/login`
- **Page Title:** `Connect - Dashboard`
- **Screenshot:** [`docs/legacy-analysis/screenshots/02-login.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/02-login.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Add Employee** | `button` | `btn` | Form submission / Modal toggle |
| **0 Valid** | `button` | `btn` | Form submission / Modal toggle |
| **0 Expired** | `button` | `btn` | Form submission / Modal toggle |
| **Edit Settings** | `button` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Name` | `Code` | `Department` | `Designation` | `Joining Date`
- **Initial Row Count:** 1

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Auth → Super Admin Login

- **URL:** `https://connect.rmd.city/public/superadmin/login`
- **Page Title:** `Connect - Dashboard`
- **Screenshot:** [`docs/legacy-analysis/screenshots/03-superadmin-login.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/03-superadmin-login.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Add Employee** | `button` | `btn` | Form submission / Modal toggle |
| **0 Valid** | `button` | `btn` | Form submission / Modal toggle |
| **0 Expired** | `button` | `btn` | Form submission / Modal toggle |
| **Edit Settings** | `button` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Name` | `Code` | `Department` | `Designation` | `Joining Date`
- **Initial Row Count:** 1

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Auth → Organization Registration (4-Step Wizard)

- **URL:** `https://connect.rmd.city/public/register`
- **Page Title:** `Connect - Dashboard`
- **Screenshot:** [`docs/legacy-analysis/screenshots/04-register.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/04-register.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Add Employee** | `button` | `btn` | Form submission / Modal toggle |
| **0 Valid** | `button` | `btn` | Form submission / Modal toggle |
| **0 Expired** | `button` | `btn` | Form submission / Modal toggle |
| **Edit Settings** | `button` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Name` | `Code` | `Department` | `Designation` | `Joining Date`
- **Initial Row Count:** 1

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Public → Privacy Policy

- **URL:** `https://connect.rmd.city/public/privacy-policy`
- **Page Title:** `Privacy Policy - Glix Connect`
- **Screenshot:** [`docs/legacy-analysis/screenshots/05-privacy.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/05-privacy.png)

### Inputs & Fields
*No direct text inputs on page body.*

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Back to Home** | `button` | `btn` | Form submission / Modal toggle |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Public → Terms & Conditions

- **URL:** `https://connect.rmd.city/public/terms-conditions`
- **Page Title:** `Terms & Conditions - Glix Connect`
- **Screenshot:** [`docs/legacy-analysis/screenshots/06-terms.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/06-terms.png)

### Inputs & Fields
*No direct text inputs on page body.*

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Back to Home** | `button` | `btn` | Form submission / Modal toggle |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Public → Refund Policy

- **URL:** `https://connect.rmd.city/public/refund-policy`
- **Page Title:** `Refund Policy - Glix Connect`
- **Screenshot:** [`docs/legacy-analysis/screenshots/07-refund.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/07-refund.png)

### Inputs & Fields
*No direct text inputs on page body.*

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Back to Home** | `button` | `btn` | Form submission / Modal toggle |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Dashboard → Executive Dashboard Overview

- **URL:** `https://connect.rmd.city/public/dashboard`
- **Page Title:** `Connect - Dashboard`
- **Screenshot:** [`docs/legacy-analysis/screenshots/10-dashboard.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/10-dashboard.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Add Employee** | `button` | `btn` | Form submission / Modal toggle |
| **0 Valid** | `button` | `btn` | Form submission / Modal toggle |
| **0 Expired** | `button` | `btn` | Form submission / Modal toggle |
| **Edit Settings** | `button` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Name` | `Code` | `Department` | `Designation` | `Joining Date`
- **Initial Row Count:** 1

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Employees → All Employees Directory

- **URL:** `https://connect.rmd.city/public/employees`
- **Page Title:** `Connect - Employees`
- **Screenshot:** [`docs/legacy-analysis/screenshots/11-employees-list.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/11-employees-list.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `search` | `text` | No | `Search by name, email, code...` | `—` | Validated on submit |

### Dropdowns & Selects
| Select Name | Required | Options Count | Sample Options |
| :--- | :--- | :--- | :--- |
| `company_id` | No | 2 | All Companies, Apex Global 70705 |
| `department_id` | No | 1 | All Departments |
| `designation_id` | No | 1 | All Designations |
| `status` | No | 4 | All Statuses, Active, Inactive, Terminated |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Import / Export** | `button` | `btn` | Form submission / Modal toggle |
| **Add Employee** | `button` | `btn` | Form submission / Modal toggle |
| **Clear** | `button` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Employee Name` | `Code` | `Company` | `Department` | `Designation` | `Status` | `Date Joined` | `Actions`
- **Initial Row Count:** 1

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Employees → Add Employee Form

- **URL:** `https://connect.rmd.city/public/employees/create`
- **Page Title:** `Connect - Register Employee`
- **Screenshot:** [`docs/legacy-analysis/screenshots/12-employees-create.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/12-employees-create.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Yes | `Identity as per Passport` | `—` | Validated on submit |
| `employee_id` | `text` | Yes | `EMP-000` | `—` | Validated on submit |
| `email` | `email` | Yes | `corporate@domain.com` | `—` | Validated on submit |
| `uae_mobile` | `text` | No | `+971 -- --- ----` | `—` | Validated on submit |
| `home_country_mobile` | `text` | No | `Overseas Number` | `—` | Validated on submit |
| `date_of_birth` | `date` | No | `—` | `—` | Validated on submit |
| `join_date` | `date` | Yes | `—` | `2026-10-04` | Validated on submit |
| `photo` | `file` | No | `—` | `—` | Validated on submit |
| `emergency_contact_name` | `text` | No | `Contact Person Name` | `—` | Validated on submit |
| `emergency_contact_relationship` | `text` | No | `Spouse, Father, Friend...` | `—` | Validated on submit |
| `emergency_contact_no` | `text` | No | `+971 -- --- ----` | `—` | Validated on submit |
| `passport_number` | `text` | No | `—` | `—` | Validated on submit |
| `passport_issued_country` | `text` | No | `—` | `—` | Validated on submit |
| `passport_issue_date` | `date` | No | `—` | `—` | Validated on submit |
| `passport_expiry_date` | `date` | No | `—` | `—` | Validated on submit |
| `passport_file` | `file` | No | `—` | `—` | Validated on submit |
| `visa_file_number` | `text` | No | `—` | `—` | Validated on submit |
| `unified_number` | `text` | No | `—` | `—` | Validated on submit |
| `visa_issue_date` | `date` | No | `—` | `—` | Validated on submit |
| `visa_expiry_date` | `date` | No | `—` | `—` | Validated on submit |
| `visa_file` | `file` | No | `—` | `—` | Validated on submit |
| `emirates_id_number` | `text` | No | `784-XXXX-XXXXXXX-X` | `—` | Validated on submit |
| `emirates_id_issue_date` | `date` | No | `—` | `—` | Validated on submit |
| `emirates_id_expiry_date` | `date` | No | `—` | `—` | Validated on submit |
| `emirates_id_file` | `file` | No | `—` | `—` | Validated on submit |
| `basic_salary` | `number` | No | `0.00` | `0` | Validated on submit |
| `allowance` | `number` | No | `0.00` | `0` | Validated on submit |
| `` | `checkbox` | No | `—` | `on` | Validated on submit |
| `labour_personal_no` | `text` | No | `—` | `—` | Validated on submit |
| `work_permit_no` | `text` | No | `—` | `—` | Validated on submit |
| `labor_card_expiry_date` | `date` | No | `—` | `—` | Validated on submit |
| `labor_card_issue_date` | `date` | No | `—` | `—` | Validated on submit |
| `labor_card_file` | `file` | No | `—` | `—` | Validated on submit |
| `labour_contract_file` | `file` | No | `—` | `—` | Validated on submit |
| `` | `checkbox` | No | `—` | `on` | Validated on submit |
| `driving_license_number` | `text` | No | `—` | `—` | Validated on submit |
| `driving_license_place_of_issue` | `text` | No | `UAE Emirate` | `—` | Validated on submit |
| `driving_license_issue_date` | `date` | No | `—` | `—` | Validated on submit |
| `driving_license_expiry_date` | `date` | No | `—` | `—` | Validated on submit |
| `driving_license_file` | `file` | No | `—` | `—` | Validated on submit |
| `` | `checkbox` | No | `—` | `on` | Validated on submit |
| `soe_card_no` | `text` | No | `—` | `—` | Validated on submit |
| `soe_degree` | `text` | No | `e.g. B.Tech Civil` | `—` | Validated on submit |
| `soe_expiry_date` | `date` | No | `—` | `—` | Validated on submit |
| `soe_card_file` | `file` | No | `—` | `—` | Validated on submit |
| `` | `checkbox` | No | `—` | `on` | Validated on submit |
| `iloe_coi_number` | `text` | No | `—` | `—` | Validated on submit |
| `iloe_start_date` | `date` | No | `—` | `—` | Validated on submit |
| `iloe_expiry_date` | `date` | No | `—` | `—` | Validated on submit |
| `` | `checkbox` | No | `—` | `on` | Validated on submit |
| `medical_card_no` | `text` | No | `—` | `—` | Validated on submit |
| `medical_plan` | `text` | No | `e.g. VIP, Gold, Standard` | `—` | Validated on submit |
| `medical_start_date` | `date` | No | `—` | `—` | Validated on submit |
| `medical_expiry_date` | `date` | No | `—` | `—` | Validated on submit |
| `medical_card_file` | `file` | No | `—` | `—` | Validated on submit |
| `notes` | `textarea` | No | `Enter confidential notes (only visible to HR and Admins)...` | `—` | Validated on submit |

### Dropdowns & Selects
| Select Name | Required | Options Count | Sample Options |
| :--- | :--- | :--- | :--- |
| `company_id` | Yes | 2 | Select Company, Apex Global 70705 |
| `nationality` | No | 97 | Select Nationality, United Arab Emirates, Afghanistan, Albania... |
| `designation_id` | Yes | 1 | Select Position |
| `department_id` | No | 1 | Select Department |
| `status` | Yes | 5 | Active, Notice Period, Probation, Resigned... |
| `gender` | No | 4 | Select Gender, Male, Female, Other |
| `marital_status` | No | 5 | Select Marital Status, Single, Married, Divorced... |
| `blood_group` | No | 9 | Select Blood Group, A+, A-, B+... |
| `role` | Yes | 3 | Employee, HR Manager, Tenant Admin |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Back to Directory** | `button` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Save Employee Profile** | `submit` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Employees → Employees Bulk Import / Export

- **URL:** `https://connect.rmd.city/public/employees/import-export`
- **Page Title:** `Connect - Import / Export Employees`
- **Screenshot:** [`docs/legacy-analysis/screenshots/13-employees-import-export.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/13-employees-import-export.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `file` | `file` | Yes | `—` | `—` | Validated on submit |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Back to Directory** | `button` | `btn` | Form submission / Modal toggle |
| **Export Excel Workbook** | `button` | `btn` | Form submission / Modal toggle |
| **Upload and Import** | `submit` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Column Heading` | `Requirement` | `Expected Values / Format` | `Fallback Behaviour`
- **Initial Row Count:** 13

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Leave Management → Leave Requests & Approvals

- **URL:** `https://connect.rmd.city/public/leaves/requests`
- **Page Title:** `Connect - Leave Authorization`
- **Screenshot:** [`docs/legacy-analysis/screenshots/14-leaves-requests.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/14-leaves-requests.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |

### Dropdowns & Selects
| Select Name | Required | Options Count | Sample Options |
| :--- | :--- | :--- | :--- |
| `employee_id` | No | 1 | All Employees |
| `leave_type_id` | No | 6 | All Types, Annual Leave, Maternity Leave, Paternity Leave... |
| `status` | No | 4 | All Statuses, Pending, Approved, Rejected |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Log Leave Request** | `button` | `btn` | Form submission / Modal toggle |
| **Clear Filters** | `button` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Employee Name` | `Leave Type` | `Duration` | `Total Days` | `Reason` | `Attachment` | `Status` | `Actions`
- **Initial Row Count:** 1

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Leave Management → Employee Leave Balances

- **URL:** `https://connect.rmd.city/public/leaves/balances`
- **Page Title:** `Connect - Leave Balances`
- **Screenshot:** [`docs/legacy-analysis/screenshots/15-leaves-balances.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/15-leaves-balances.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `year` | `hidden` | No | `—` | `2026` | Validated on submit |
| `allocated` | `number` | Yes | `e.g. 30` | `—` | Validated on submit |

### Dropdowns & Selects
| Select Name | Required | Options Count | Sample Options |
| :--- | :--- | :--- | :--- |
| `year` | No | 4 | 2025, 2026, 2027, 2028 |
| `employee_id` | Yes | 1 | Choose Employee |
| `leave_type_id` | Yes | 6 | Choose Leave Type, Annual Leave, Maternity Leave, Paternity Leave... |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Adjust Balance** | `button` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Save Allocation** | `submit` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Employee` | `Leave Type` | `Allocated` | `Used` | `Remaining` | `Quick Action`
- **Initial Row Count:** 1

### Associated Modals & Dialogs
#### Modal: Adjust Allocation Limits
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `year` | `hidden` | No | `—` |
| `employee_id` | `select-one` | Yes | `—` |
| `leave_type_id` | `select-one` | Yes | `—` |
| `allocated` | `number` | Yes | `e.g. 30` |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Leave Management → Leave Types Configuration

- **URL:** `https://connect.rmd.city/public/leaves/types`
- **Page Title:** `Connect - Leave Types`
- **Screenshot:** [`docs/legacy-analysis/screenshots/16-leaves-types.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/16-leaves-types.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_method` | `hidden` | No | `—` | `DELETE` | Validated on submit |
| `_method` | `hidden` | No | `—` | `DELETE` | Validated on submit |
| `_method` | `hidden` | No | `—` | `DELETE` | Validated on submit |
| `_method` | `hidden` | No | `—` | `DELETE` | Validated on submit |
| `_method` | `hidden` | No | `—` | `DELETE` | Validated on submit |
| `name` | `text` | Yes | `Annual Leave` | `—` | Validated on submit |
| `code` | `text` | Yes | `AL` | `—` | Validated on submit |
| `days_per_year` | `number` | Yes | `30` | `—` | Validated on submit |
| `description` | `textarea` | No | `Description of leave type policy...` | `—` | Validated on submit |
| `_method` | `hidden` | No | `—` | `PUT` | Validated on submit |
| `name` | `text` | Yes | `—` | `Annual Leave` | Validated on submit |
| `code` | `text` | Yes | `—` | `annual` | Validated on submit |
| `days_per_year` | `number` | Yes | `—` | `30` | Validated on submit |
| `description` | `textarea` | No | `—` | `Standard paid annual vacation leave.` | Validated on submit |
| `_method` | `hidden` | No | `—` | `PUT` | Validated on submit |
| `name` | `text` | Yes | `—` | `Maternity Leave` | Validated on submit |
| `code` | `text` | Yes | `—` | `maternity` | Validated on submit |
| `days_per_year` | `number` | Yes | `—` | `60` | Validated on submit |
| `description` | `textarea` | No | `—` | `Maternity leave for female employees.` | Validated on submit |
| `_method` | `hidden` | No | `—` | `PUT` | Validated on submit |
| `name` | `text` | Yes | `—` | `Paternity Leave` | Validated on submit |
| `code` | `text` | Yes | `—` | `paternity` | Validated on submit |
| `days_per_year` | `number` | Yes | `—` | `5` | Validated on submit |
| `description` | `textarea` | No | `—` | `Paternity leave for male employees.` | Validated on submit |
| `_method` | `hidden` | No | `—` | `PUT` | Validated on submit |
| `name` | `text` | Yes | `—` | `Sick Leave` | Validated on submit |
| `code` | `text` | Yes | `—` | `sick` | Validated on submit |
| `days_per_year` | `number` | Yes | `—` | `15` | Validated on submit |
| `description` | `textarea` | No | `—` | `Paid sick leave for medical issues.` | Validated on submit |
| `_method` | `hidden` | No | `—` | `PUT` | Validated on submit |
| `name` | `text` | Yes | `—` | `Unpaid Leave` | Validated on submit |
| `code` | `text` | Yes | `—` | `unpaid` | Validated on submit |
| `days_per_year` | `number` | Yes | `—` | `365` | Validated on submit |
| `description` | `textarea` | No | `—` | `Unpaid leave of absence.` | Validated on submit |

### Dropdowns & Selects
| Select Name | Required | Options Count | Sample Options |
| :--- | :--- | :--- | :--- |
| `is_paid` | No | 2 | Paid Leave, Unpaid Leave |
| `is_paid` | No | 2 | Paid Leave, Unpaid Leave |
| `is_paid` | No | 2 | Paid Leave, Unpaid Leave |
| `is_paid` | No | 2 | Paid Leave, Unpaid Leave |
| `is_paid` | No | 2 | Paid Leave, Unpaid Leave |
| `is_paid` | No | 2 | Paid Leave, Unpaid Leave |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Add Leave Type** | `button` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Create Policy** | `submit` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Save Changes** | `submit` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Save Changes** | `submit` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Save Changes** | `submit` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Save Changes** | `submit` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Save Changes** | `submit` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Name` | `Code` | `Days Per Year` | `Paid / Unpaid` | `Description` | `Actions`
- **Initial Row Count:** 5

### Associated Modals & Dialogs
#### Modal: Create New Leave Type
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `name` | `text` | Yes | `Annual Leave` |
| `code` | `text` | Yes | `AL` |
| `days_per_year` | `number` | Yes | `30` |
| `is_paid` | `select-one` | No | `—` |
| `description` | `textarea` | No | `Description of leave type policy...` |

#### Modal: Edit Leave Type: Annual Leave
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `_method` | `hidden` | No | `—` |
| `name` | `text` | Yes | `—` |
| `code` | `text` | Yes | `—` |
| `days_per_year` | `number` | Yes | `—` |
| `is_paid` | `select-one` | No | `—` |
| `description` | `textarea` | No | `—` |

#### Modal: Edit Leave Type: Maternity Leave
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `_method` | `hidden` | No | `—` |
| `name` | `text` | Yes | `—` |
| `code` | `text` | Yes | `—` |
| `days_per_year` | `number` | Yes | `—` |
| `is_paid` | `select-one` | No | `—` |
| `description` | `textarea` | No | `—` |

#### Modal: Edit Leave Type: Paternity Leave
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `_method` | `hidden` | No | `—` |
| `name` | `text` | Yes | `—` |
| `code` | `text` | Yes | `—` |
| `days_per_year` | `number` | Yes | `—` |
| `is_paid` | `select-one` | No | `—` |
| `description` | `textarea` | No | `—` |

#### Modal: Edit Leave Type: Sick Leave
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `_method` | `hidden` | No | `—` |
| `name` | `text` | Yes | `—` |
| `code` | `text` | Yes | `—` |
| `days_per_year` | `number` | Yes | `—` |
| `is_paid` | `select-one` | No | `—` |
| `description` | `textarea` | No | `—` |

#### Modal: Edit Leave Type: Unpaid Leave
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `_method` | `hidden` | No | `—` |
| `name` | `text` | Yes | `—` |
| `code` | `text` | Yes | `—` |
| `days_per_year` | `number` | Yes | `—` |
| `is_paid` | `select-one` | No | `—` |
| `description` | `textarea` | No | `—` |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Leave Management → Public & Organization Holidays

- **URL:** `https://connect.rmd.city/public/holidays`
- **Page Title:** `Connect - Public Holidays`
- **Screenshot:** [`docs/legacy-analysis/screenshots/17-holidays.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/17-holidays.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Yes | `UAE National Day` | `—` | Validated on submit |
| `date` | `date` | Yes | `—` | `2026-10-04` | Validated on submit |
| `description` | `textarea` | No | `Description of the holiday...` | `—` | Validated on submit |

### Dropdowns & Selects
| Select Name | Required | Options Count | Sample Options |
| :--- | :--- | :--- | :--- |
| `is_recurring` | No | 2 | Yes, recurs on same day every year, No, single date event |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Add Holiday** | `button` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Create Holiday** | `submit` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Name` | `Date` | `Is Recurring Yearly` | `Description` | `Actions`
- **Initial Row Count:** 1

### Associated Modals & Dialogs
#### Modal: Create New Holiday
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `name` | `text` | Yes | `UAE National Day` |
| `date` | `date` | Yes | `—` |
| `is_recurring` | `select-one` | No | `—` |
| `description` | `textarea` | No | `Description of the holiday...` |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Leave Management → Leave Calendar View

- **URL:** `https://connect.rmd.city/public/leaves/calendar`
- **Page Title:** `Connect - Team Leave Calendar`
- **Screenshot:** [`docs/legacy-analysis/screenshots/18-leaves-calendar.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/18-leaves-calendar.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |

### Dropdowns & Selects
| Select Name | Required | Options Count | Sample Options |
| :--- | :--- | :--- | :--- |
| `month` | No | 12 | January, February, March, April... |
| `year` | No | 4 | 2025, 2026, 2027, 2028 |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Sun` | `Mon` | `Tue` | `Wed` | `Thu` | `Fri` | `Sat`
- **Initial Row Count:** 5

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Payroll & Loans → Employee Loans & Advances

- **URL:** `https://connect.rmd.city/public/payroll/loans`
- **Page Title:** `Connect - Loan Management`
- **Screenshot:** [`docs/legacy-analysis/screenshots/19-loans.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/19-loans.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `amount` | `number` | Yes | `e.g. 10000` | `—` | Validated on submit |
| `installments_count` | `number` | Yes | `e.g. 12` | `—` | Validated on submit |
| `purpose` | `textarea` | No | `e.g. Emergency medical expenses` | `—` | Validated on submit |
| `attachment` | `file` | No | `—` | `—` | Validated on submit |
| `auto_approve` | `checkbox` | No | `—` | `1` | Validated on submit |

### Dropdowns & Selects
| Select Name | Required | Options Count | Sample Options |
| :--- | :--- | :--- | :--- |
| `status` | No | 5 | All Statuses, Pending Approval, Active / Approved, Rejected... |
| `employee_id` | Yes | 1 | Choose active employee... |
| `start_month` | Yes | 12 | January, February, March, April... |
| `start_year` | Yes | 3 | 2026, 2027, 2028 |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Add Loan Record** | `button` | `btn` | Form submission / Modal toggle |
| **Filter** | `submit` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Create Loan Record** | `submit` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Employee` | `Loan Principal` | `Installments` | `Monthly Rate` | `Remaining Bal.` | `Start Month` | `Status` | `Actions`
- **Initial Row Count:** 1

### Associated Modals & Dialogs
#### Modal: Add Employee Loan Record
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `employee_id` | `select-one` | Yes | `—` |
| `amount` | `number` | Yes | `e.g. 10000` |
| `installments_count` | `number` | Yes | `e.g. 12` |
| `start_month` | `select-one` | Yes | `—` |
| `start_year` | `select-one` | Yes | `—` |
| `purpose` | `textarea` | No | `e.g. Emergency medical expenses` |
| `attachment` | `file` | No | `—` |
| `auto_approve` | `checkbox` | No | `—` |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Announcements → Company Announcements & Bulletins

- **URL:** `https://connect.rmd.city/public/announcements`
- **Page Title:** `Connect - Announcements`
- **Screenshot:** [`docs/legacy-analysis/screenshots/20-announcements.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/20-announcements.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Add Announcement** | `button` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Title` | `Content Snippet` | `Published At` | `Expires At` | `Status` | `Actions`
- **Initial Row Count:** 1

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Documents → Document Categories & Types

- **URL:** `https://connect.rmd.city/public/documents/types`
- **Page Title:** `Connect - Document Types`
- **Screenshot:** [`docs/legacy-analysis/screenshots/21-document-types.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/21-document-types.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Yes | `e.g. Passport, Emirates ID` | `—` | Validated on submit |

### Dropdowns & Selects
| Select Name | Required | Options Count | Sample Options |
| :--- | :--- | :--- | :--- |
| `is_required` | No | 2 | Yes, required for all employee profiles, No, optional document |
| `has_expiry` | No | 2 | Yes, tracks expiry date and flags when expired, No, date tracking not needed |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Add Category** | `button` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Next: Design Form** | `button` | `btn` | Form submission / Modal toggle |
| **Back** | `button` | `btn` | Form submission / Modal toggle |
| **Create Category** | `submit` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Category Name` | `Is Required for Profiles` | `Tracks Expiry Date` | `Actions`
- **Initial Row Count:** 1

### Associated Modals & Dialogs
#### Modal: Step 1 of 2
                    Create New Document Category
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `name` | `text` | Yes | `e.g. Passport, Emirates ID` |
| `is_required` | `select-one` | No | `—` |
| `has_expiry` | `select-one` | No | `—` |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Documents → All Documents & Expiry Tracking

- **URL:** `https://connect.rmd.city/public/documents`
- **Page Title:** `Connect - Document Directory`
- **Screenshot:** [`docs/legacy-analysis/screenshots/22-documents-all.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/22-documents-all.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `file` | `file` | Yes | `—` | `—` | Validated on submit |
| `document_number` | `text` | No | `Enter document number` | `—` | Validated on submit |
| `issue_date` | `date` | No | `—` | `—` | Validated on submit |
| `expiry_date` | `date` | No | `—` | `—` | Validated on submit |

### Dropdowns & Selects
| Select Name | Required | Options Count | Sample Options |
| :--- | :--- | :--- | :--- |
| `employee_id` | No | 1 | All Employees |
| `document_type_id` | No | 1 | All Types |
| `is_verified` | No | 3 | All Statuses, Verified Only, Pending Verification |
| `expiry_status` | No | 5 | All Expiries, Expired, Expiring Soon, Active / Valid... |
| `employee_id` | Yes | 1 | Choose Employee |
| `document_type_id` | Yes | 1 | Choose Category |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Upload Document** | `button` | `btn` | Form submission / Modal toggle |
| **Clear** | `button` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Upload Record** | `submit` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Employee` | `Document Category` | `File Name` | `Storage Disk` | `Expiry Date` | `Verification` | `Actions`
- **Initial Row Count:** 1

### Associated Modals & Dialogs
#### Modal: Upload Compliance Document
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `employee_id` | `select-one` | Yes | `—` |
| `document_type_id` | `select-one` | Yes | `—` |
| `file` | `file` | Yes | `—` |
| `document_number` | `text` | No | `Enter document number` |
| `issue_date` | `date` | No | `—` |
| `expiry_date` | `date` | No | `—` |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Reports → Reports Overview & Summary

- **URL:** `https://connect.rmd.city/public/reports`
- **Page Title:** `Forbidden`
- **Screenshot:** [`docs/legacy-analysis/screenshots/23-reports-overview.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/23-reports-overview.png)

### Inputs & Fields
*No direct text inputs on page body.*

### Actions & Buttons
*No major action buttons.*

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Reports → Employee Demographics Report

- **URL:** `https://connect.rmd.city/public/reports/employees`
- **Page Title:** `Forbidden`
- **Screenshot:** [`docs/legacy-analysis/screenshots/24-reports-employees.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/24-reports-employees.png)

### Inputs & Fields
*No direct text inputs on page body.*

### Actions & Buttons
*No major action buttons.*

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Reports → Leave Utilization Report

- **URL:** `https://connect.rmd.city/public/reports/leaves`
- **Page Title:** `Forbidden`
- **Screenshot:** [`docs/legacy-analysis/screenshots/25-reports-leaves.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/25-reports-leaves.png)

### Inputs & Fields
*No direct text inputs on page body.*

### Actions & Buttons
*No major action buttons.*

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Reports → Document Expiries Report

- **URL:** `https://connect.rmd.city/public/reports/documents`
- **Page Title:** `Forbidden`
- **Screenshot:** [`docs/legacy-analysis/screenshots/26-reports-documents.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/26-reports-documents.png)

### Inputs & Fields
*No direct text inputs on page body.*

### Actions & Buttons
*No major action buttons.*

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Reports → Loan Balances & Deductions Report

- **URL:** `https://connect.rmd.city/public/reports/loans`
- **Page Title:** `Forbidden`
- **Screenshot:** [`docs/legacy-analysis/screenshots/27-reports-loans.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/27-reports-loans.png)

### Inputs & Fields
*No direct text inputs on page body.*

### Actions & Buttons
*No major action buttons.*

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Billing → Subscription & Billing Plans

- **URL:** `https://connect.rmd.city/public/settings/subscription`
- **Page Title:** `Connect - Subscription & Billing`
- **Screenshot:** [`docs/legacy-analysis/screenshots/28-subscription.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/28-subscription.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `` | `checkbox` | No | `—` | `on` | Validated on submit |
| `vat_number` | `text` | No | `e.g. 100xxxxxxxxx003` | `—` | Validated on submit |
| `card_name` | `text` | Yes | `e.g. John Doe` | `—` | Validated on submit |
| `card_number` | `text` | Yes | `4111 2222 3333 4444` | `—` | Validated on submit |
| `card_expiry` | `text` | Yes | `MM/YY` | `—` | Validated on submit |
| `card_cvc` | `password` | Yes | `•••` | `******` | Validated on submit |

### Dropdowns & Selects
| Select Name | Required | Options Count | Sample Options |
| :--- | :--- | :--- | :--- |
| `card_brand` | Yes | 4 | Visa, MasterCard, American Express, Discover |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Add Credit/Debit Card** | `button` | `btn` | Form submission / Modal toggle |
| **Save VAT Number** | `submit` | `btn` | Form submission / Modal toggle |
| **Monthly Billing** | `button` | `btn` | Form submission / Modal toggle |
| **Annual Billing Save** | `button` | `btn` | Form submission / Modal toggle |
| **Current Package** | `button` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Save Card** | `submit` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Invoice Number` | `Billing Date` | `Amount` | `Payment Method` | `Status` | `Actions`
- **Initial Row Count:** 1

### Associated Modals & Dialogs
#### Modal: Add Payment Card
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `card_brand` | `select-one` | Yes | `—` |
| `card_name` | `text` | Yes | `e.g. John Doe` |
| `card_number` | `text` | Yes | `4111 2222 3333 4444` |
| `card_expiry` | `text` | Yes | `MM/YY` |
| `card_cvc` | `password` | Yes | `•••` |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Support → Help & Support Tickets

- **URL:** `https://connect.rmd.city/public/support`
- **Page Title:** `Connect - Help & Support`
- **Screenshot:** [`docs/legacy-analysis/screenshots/29-support.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/29-support.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `subject` | `text` | Yes | `Briefly describe the issue (e.g. Leave balance calculation mismatch)` | `—` | Validated on submit |
| `description` | `textarea` | Yes | `Please provide all details needed for our team to reproduce and resolve the issue...` | `—` | Validated on submit |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **New Support Ticket** | `button` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Submit Ticket** | `submit` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `ID` | `Subject` | `Description` | `Status` | `Date Logged` | `Actions`
- **Initial Row Count:** 1

### Associated Modals & Dialogs
#### Modal: New Support Ticket
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `subject` | `text` | Yes | `Briefly describe the issue (e.g. Leave balance calculation mismatch)` |
| `description` | `textarea` | Yes | `Please provide all details needed for our team to reproduce and resolve the issue...` |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Settings → Organization Profile & Branding

- **URL:** `https://connect.rmd.city/public/settings/profile`
- **Page Title:** `Connect - Organization Profile Settings`
- **Screenshot:** [`docs/legacy-analysis/screenshots/30-settings-profile.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/30-settings-profile.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `logo` | `file` | No | `—` | `—` | Validated on submit |
| `name` | `text` | Yes | `—` | `Apex Global 70705` | Validated on submit |
| `email` | `email` | Yes | `—` | `crawler_admin_70705@glix-corp.ae` | Validated on submit |
| `phone` | `text` | No | `—` | `+971 50 888 9999` | Validated on submit |
| `industry` | `text` | No | `e.g. Technology, Retail, Finance` | `—` | Validated on submit |
| `document_expiry_email` | `email` | No | `compliance@yourcompany.com` | `—` | Validated on submit |
| `document_expiry_alert_days` | `number` | Yes | `—` | `30` | Validated on submit |
| `address` | `textarea` | No | `Company physical address...` | `—` | Validated on submit |

### Dropdowns & Selects
| Select Name | Required | Options Count | Sample Options |
| :--- | :--- | :--- | :--- |
| `currency` | Yes | 5 | AED - United Arab Emirates Dirham, USD - United States Dollar, EUR - Euro, GBP - British Pound... |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Save Changes** | `submit` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Settings → Department Hierarchy

- **URL:** `https://connect.rmd.city/public/departments`
- **Page Title:** `Connect - Departments`
- **Screenshot:** [`docs/legacy-analysis/screenshots/31-departments.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/31-departments.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Yes | `IT Infrastructure, Human Resources, etc.` | `—` | Validated on submit |
| `description` | `textarea` | No | `Define the department's role within the organization` | `—` | Validated on submit |

### Dropdowns & Selects
| Select Name | Required | Options Count | Sample Options |
| :--- | :--- | :--- | :--- |
| `parent_id` | No | 1 | None |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Add Department** | `button` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Create Department** | `submit` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Name` | `Parent Department` | `Description` | `Created` | `Actions`
- **Initial Row Count:** 1

### Associated Modals & Dialogs
#### Modal: Add Department
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `name` | `text` | Yes | `IT Infrastructure, Human Resources, etc.` |
| `parent_id` | `select-one` | No | `—` |
| `description` | `textarea` | No | `Define the department's role within the organization` |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Settings → Designations & Job Titles

- **URL:** `https://connect.rmd.city/public/designations`
- **Page Title:** `Connect - Designations`
- **Screenshot:** [`docs/legacy-analysis/screenshots/32-designations.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/32-designations.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Yes | `Senior Software Engineer, HR Specialist, etc.` | `—` | Validated on submit |
| `description` | `textarea` | No | `Brief details about the role's primary function` | `—` | Validated on submit |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Add Designation** | `button` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Create Designation** | `submit` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Table Columns
- **Columns:** `Job Title / Designation` | `Description` | `Created` | `Actions`
- **Initial Row Count:** 1

### Associated Modals & Dialogs
#### Modal: Add Designation
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `name` | `text` | Yes | `Senior Software Engineer, HR Specialist, etc.` |
| `description` | `textarea` | No | `Brief details about the role's primary function` |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Settings → Roles & Permission Access Matrix

- **URL:** `https://connect.rmd.city/public/settings/roles`
- **Page Title:** `Connect - Roles & Permissions`
- **Screenshot:** [`docs/legacy-analysis/screenshots/33-roles-permissions.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/33-roles-permissions.png)

### Inputs & Fields
| Field Name | Type | Required | Placeholder | Default / Value | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Yes | `e.g. Finance Officer, HR Assistant` | `—` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `dashboard.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.create` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.edit` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.delete` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.import` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.export` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `departments.manage` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `designations.manage` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.apply` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.approve` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.manage_settings` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `holidays.manage` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.upload` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.verify` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.delete` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.settings` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `settings.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `settings.update` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `announcements.manage` | Validated on submit |
| `_method` | `hidden` | No | `—` | `PUT` | Validated on submit |
| `name` | `hidden` | No | `—` | `Employee` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `dashboard.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.create` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.edit` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.delete` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.import` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.export` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `departments.manage` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `designations.manage` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.apply` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.approve` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.manage_settings` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `holidays.manage` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.upload` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.verify` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.delete` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.settings` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `settings.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `settings.update` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `announcements.manage` | Validated on submit |
| `_method` | `hidden` | No | `—` | `PUT` | Validated on submit |
| `name` | `hidden` | No | `—` | `HR Manager` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `dashboard.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.create` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.edit` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.delete` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.import` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.export` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `departments.manage` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `designations.manage` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.apply` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.approve` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.manage_settings` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `holidays.manage` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.upload` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.verify` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.delete` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.settings` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `settings.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `settings.update` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `announcements.manage` | Validated on submit |
| `_method` | `hidden` | No | `—` | `PUT` | Validated on submit |
| `name` | `hidden` | No | `—` | `Tenant Admin` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `dashboard.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.create` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.edit` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.delete` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.import` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `employees.export` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `departments.manage` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `designations.manage` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.apply` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.approve` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `leaves.manage_settings` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `holidays.manage` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.upload` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.verify` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.delete` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `documents.settings` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `settings.view` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `settings.update` | Validated on submit |
| `permissions[]` | `checkbox` | No | `—` | `announcements.manage` | Validated on submit |

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Employees** | `button` | `nav-link` | Form submission / Modal toggle |
| **Leave Management** | `button` | `nav-link` | Form submission / Modal toggle |
| **Documents** | `button` | `nav-link` | Form submission / Modal toggle |
| **Reports** | `button` | `nav-link` | Form submission / Modal toggle |
| **Settings** | `button` | `nav-link` | Form submission / Modal toggle |
| **Sign Out** | `submit` | `dropdown-item` | Form submission / Modal toggle |
| **Create Custom Role** | `button` | `btn` | Form submission / Modal toggle |
| **Edit Permissions** | `button` | `btn` | Form submission / Modal toggle |
| **Edit Permissions** | `button` | `btn` | Form submission / Modal toggle |
| **Edit Permissions** | `button` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Create Role** | `submit` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Save Changes** | `submit` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Save Changes** | `submit` | `btn` | Form submission / Modal toggle |
| **Cancel** | `button` | `btn` | Form submission / Modal toggle |
| **Save Changes** | `submit` | `btn` | Form submission / Modal toggle |
| **Not Now** | `button` | `btn` | Form submission / Modal toggle |
| **Install** | `button` | `btn` | Form submission / Modal toggle |

### Associated Modals & Dialogs
#### Modal: Create Custom Role
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `name` | `text` | Yes | `e.g. Finance Officer, HR Assistant` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |

#### Modal: Edit Role: Employee
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `_method` | `hidden` | No | `—` |
| `name` | `hidden` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |

#### Modal: Edit Role: HR Manager
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `_method` | `hidden` | No | `—` |
| `name` | `hidden` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |

#### Modal: Edit Role: Tenant Admin
| Modal Input | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| `_token` | `hidden` | No | `—` |
| `_method` | `hidden` | No | `—` |
| `name` | `hidden` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |
| `permissions[]` | `checkbox` | No | `—` |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

## Module: Settings → Notification Templates & Triggers

- **URL:** `https://connect.rmd.city/public/settings/templates`
- **Page Title:** `Connect`
- **Screenshot:** [`docs/legacy-analysis/screenshots/34-notification-templates.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/34-notification-templates.png)

### Inputs & Fields
*No direct text inputs on page body.*

### Actions & Buttons
| Button Label | Type | Class / Variant | Action Triggered |
| :--- | :--- | :--- | :--- |
| **Copy as Markdown** | `button` | `text-sm` | Form submission / Modal toggle |
| **1** | `button` | `cursor-pointer` | Form submission / Modal toggle |
| **2** | `button` | `cursor-pointer` | Form submission / Modal toggle |

### Persona Findings
- **Persona A (Naive Explorer):** Clean UI with responsive bootstrap styling; empty states render helpful informational text and quick create action buttons.
- **Persona B (Senior QA):** Client-side validation active on forms; mandatory fields enforce data presence; dates formatted cleanly.

---

