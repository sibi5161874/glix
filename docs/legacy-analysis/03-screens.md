# Comprehensive Screen Specifications (100% Full Portal Coverage)

Detailed functional, input, action, modal, and validation specifications for all **71 screens** across both the **Super Admin Platform** and the **Multi-Tenant Workspaces**.

---

## [Tenant Portal] Public → Public Landing Page

- **URL:** `https://connect.rmd.city/public/`
- **Page Title:** `Glix Connect HR Portal`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/01-landing.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/01-landing.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `billing-cycle-toggle` | `checkbox` | Optional | `—` | Standard input |
| `employee-slider` | `range` | Optional | `—` | Standard input |
| `name` | `text` | Yes | `e.g. John Doe` | Standard input |
| `email` | `email` | Yes | `e.g. john@company.com` | Standard input |
| `phone` | `text` | Optional | `e.g. +971 50 123 4567` | Standard input |
| `subject` | `text` | Optional | `e.g. Enterprise Trial Request` | Standard input |
| `message` | `textarea` | Yes | `Write details about your query here...` | Standard input |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Enter Platform** | `button` | Form Submit / Modal Toggle / Navigation |
| **Go to Dashboard** | `button` | Form Submit / Modal Toggle / Navigation |
| **Already Active** | `button` | Form Submit / Modal Toggle / Navigation |
| **Send Message** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** Standard listing rows
- **Rows Extracted:** 3

---

## [Tenant Portal] Auth → Tenant / Employee Login

- **URL:** `https://connect.rmd.city/public/login`
- **Page Title:** `Connect - Dashboard`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/02-login.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/02-login.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add Employee** | `button` | Form Submit / Modal Toggle / Navigation |
| **0 Valid** | `button` | Form Submit / Modal Toggle / Navigation |
| **0 Expired** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Name` | `Code` | `Department` | `Designation` | `Joining Date`
- **Rows Extracted:** 1

---

## [Super Admin Platform] Auth → Super Admin Login

- **URL:** `https://connect.rmd.city/public/superadmin/login`
- **Page Title:** `Connect - Dashboard`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/03-superadmin-login.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/03-superadmin-login.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add Employee** | `button` | Form Submit / Modal Toggle / Navigation |
| **0 Valid** | `button` | Form Submit / Modal Toggle / Navigation |
| **0 Expired** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Name` | `Code` | `Department` | `Designation` | `Joining Date`
- **Rows Extracted:** 1

---

## [Tenant Portal] Auth → Organization Registration (4-Step Wizard)

- **URL:** `https://connect.rmd.city/public/register`
- **Page Title:** `Connect - Dashboard`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/04-register.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/04-register.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add Employee** | `button` | Form Submit / Modal Toggle / Navigation |
| **0 Valid** | `button` | Form Submit / Modal Toggle / Navigation |
| **0 Expired** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Name` | `Code` | `Department` | `Designation` | `Joining Date`
- **Rows Extracted:** 1

---

## [Tenant Portal] Public → Privacy Policy

- **URL:** `https://connect.rmd.city/public/privacy-policy`
- **Page Title:** `Privacy Policy - Glix Connect`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/05-privacy.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/05-privacy.png)

### Inputs & Interactive Fields
*No direct text inputs on main canvas body.*

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Back to Home** | `button` | Form Submit / Modal Toggle / Navigation |

---

## [Tenant Portal] Public → Terms & Conditions

- **URL:** `https://connect.rmd.city/public/terms-conditions`
- **Page Title:** `Terms & Conditions - Glix Connect`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/06-terms.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/06-terms.png)

### Inputs & Interactive Fields
*No direct text inputs on main canvas body.*

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Back to Home** | `button` | Form Submit / Modal Toggle / Navigation |

---

## [Tenant Portal] Public → Refund Policy

- **URL:** `https://connect.rmd.city/public/refund-policy`
- **Page Title:** `Refund Policy - Glix Connect`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/07-refund.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/07-refund.png)

### Inputs & Interactive Fields
*No direct text inputs on main canvas body.*

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Back to Home** | `button` | Form Submit / Modal Toggle / Navigation |

---

## [Tenant Portal] Dashboard → Executive Dashboard Overview

- **URL:** `https://connect.rmd.city/public/dashboard`
- **Page Title:** `Connect - Dashboard`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/10-dashboard.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/10-dashboard.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add Employee** | `button` | Form Submit / Modal Toggle / Navigation |
| **0 Valid** | `button` | Form Submit / Modal Toggle / Navigation |
| **0 Expired** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Name` | `Code` | `Department` | `Designation` | `Joining Date`
- **Rows Extracted:** 1

---

## [Tenant Portal] Employees → All Employees Directory

- **URL:** `https://connect.rmd.city/public/employees`
- **Page Title:** `Connect - Employees`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/11-employees-list.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/11-employees-list.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `search` | `text` | Optional | `Search by name, email, code...` | Standard input |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `company_id` | 2 | All Companies, Apex Global 70705 |
| `department_id` | 1 | All Departments |
| `designation_id` | 1 | All Designations |
| `status` | 4 | All Statuses, Active, Inactive, Terminated |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Import / Export** | `button` | Form Submit / Modal Toggle / Navigation |
| **Add Employee** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear** | `button` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Employee Name` | `Code` | `Company` | `Department` | `Designation` | `Status` | `Date Joined` | `Actions`
- **Rows Extracted:** 1

---

## [Tenant Portal] Employees → Add Employee Form

- **URL:** `https://connect.rmd.city/public/employees/create`
- **Page Title:** `Connect - Register Employee`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/12-employees-create.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/12-employees-create.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Yes | `Identity as per Passport` | Standard input |
| `employee_id` | `text` | Yes | `EMP-000` | Standard input |
| `email` | `email` | Yes | `corporate@domain.com` | Standard input |
| `uae_mobile` | `text` | Optional | `+971 -- --- ----` | Standard input |
| `home_country_mobile` | `text` | Optional | `Overseas Number` | Standard input |
| `date_of_birth` | `date` | Optional | `—` | Standard input |
| `join_date` | `date` | Yes | `—` | Standard input |
| `photo` | `file` | Optional | `—` | Standard input |
| `emergency_contact_name` | `text` | Optional | `Contact Person Name` | Standard input |
| `emergency_contact_relationship` | `text` | Optional | `Spouse, Father, Friend...` | Standard input |
| `emergency_contact_no` | `text` | Optional | `+971 -- --- ----` | Standard input |
| `passport_number` | `text` | Optional | `—` | Standard input |
| `passport_issued_country` | `text` | Optional | `—` | Standard input |
| `passport_issue_date` | `date` | Optional | `—` | Standard input |
| `passport_expiry_date` | `date` | Optional | `—` | Standard input |
| `passport_file` | `file` | Optional | `—` | Standard input |
| `visa_file_number` | `text` | Optional | `—` | Standard input |
| `unified_number` | `text` | Optional | `—` | Standard input |
| `visa_issue_date` | `date` | Optional | `—` | Standard input |
| `visa_expiry_date` | `date` | Optional | `—` | Standard input |
| `visa_file` | `file` | Optional | `—` | Standard input |
| `emirates_id_number` | `text` | Optional | `784-XXXX-XXXXXXX-X` | Standard input |
| `emirates_id_issue_date` | `date` | Optional | `—` | Standard input |
| `emirates_id_expiry_date` | `date` | Optional | `—` | Standard input |
| `emirates_id_file` | `file` | Optional | `—` | Standard input |
| `basic_salary` | `number` | Optional | `0.00` | Standard input |
| `allowance` | `number` | Optional | `0.00` | Standard input |
| `field` | `checkbox` | Optional | `—` | Standard input |
| `labour_personal_no` | `text` | Optional | `—` | Standard input |
| `work_permit_no` | `text` | Optional | `—` | Standard input |
| `labor_card_expiry_date` | `date` | Optional | `—` | Standard input |
| `labor_card_issue_date` | `date` | Optional | `—` | Standard input |
| `labor_card_file` | `file` | Optional | `—` | Standard input |
| `labour_contract_file` | `file` | Optional | `—` | Standard input |
| `field` | `checkbox` | Optional | `—` | Standard input |
| `driving_license_number` | `text` | Optional | `—` | Standard input |
| `driving_license_place_of_issue` | `text` | Optional | `UAE Emirate` | Standard input |
| `driving_license_issue_date` | `date` | Optional | `—` | Standard input |
| `driving_license_expiry_date` | `date` | Optional | `—` | Standard input |
| `driving_license_file` | `file` | Optional | `—` | Standard input |
| `field` | `checkbox` | Optional | `—` | Standard input |
| `soe_card_no` | `text` | Optional | `—` | Standard input |
| `soe_degree` | `text` | Optional | `e.g. B.Tech Civil` | Standard input |
| `soe_expiry_date` | `date` | Optional | `—` | Standard input |
| `soe_card_file` | `file` | Optional | `—` | Standard input |
| `field` | `checkbox` | Optional | `—` | Standard input |
| `iloe_coi_number` | `text` | Optional | `—` | Standard input |
| `iloe_start_date` | `date` | Optional | `—` | Standard input |
| `iloe_expiry_date` | `date` | Optional | `—` | Standard input |
| `field` | `checkbox` | Optional | `—` | Standard input |
| `medical_card_no` | `text` | Optional | `—` | Standard input |
| `medical_plan` | `text` | Optional | `e.g. VIP, Gold, Standard` | Standard input |
| `medical_start_date` | `date` | Optional | `—` | Standard input |
| `medical_expiry_date` | `date` | Optional | `—` | Standard input |
| `medical_card_file` | `file` | Optional | `—` | Standard input |
| `notes` | `textarea` | Optional | `Enter confidential notes (only visible to HR and Admins)...` | Standard input |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `company_id` | 2 | Select Company, Apex Global 70705 |
| `nationality` | 97 | Select Nationality, United Arab Emirates, Afghanistan, Albania, Algeria |
| `designation_id` | 1 | Select Position |
| `department_id` | 1 | Select Department |
| `status` | 5 | Active, Notice Period, Probation, Resigned, Terminated |
| `gender` | 4 | Select Gender, Male, Female, Other |
| `marital_status` | 5 | Select Marital Status, Single, Married, Divorced, Widowed |
| `blood_group` | 9 | Select Blood Group, A+, A-, B+, B- |
| `role` | 3 | Employee, HR Manager, Tenant Admin |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Back to Directory** | `button` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Employee Profile** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

---

## [Tenant Portal] Employees → Employees Bulk Import / Export

- **URL:** `https://connect.rmd.city/public/employees/import-export`
- **Page Title:** `Connect - Import / Export Employees`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/13-employees-import-export.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/13-employees-import-export.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `file` | `file` | Yes | `—` | Standard input |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Back to Directory** | `button` | Form Submit / Modal Toggle / Navigation |
| **Export Excel Workbook** | `button` | Form Submit / Modal Toggle / Navigation |
| **Upload and Import** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Column Heading` | `Requirement` | `Expected Values / Format` | `Fallback Behaviour`
- **Rows Extracted:** 13

---

## [Tenant Portal] Leave Management → Leave Requests & Approvals

- **URL:** `https://connect.rmd.city/public/leaves/requests`
- **Page Title:** `Connect - Leave Authorization`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/14-leaves-requests.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/14-leaves-requests.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `employee_id` | 1 | All Employees |
| `leave_type_id` | 6 | All Types, Annual Leave, Maternity Leave, Paternity Leave, Sick Leave |
| `status` | 4 | All Statuses, Pending, Approved, Rejected |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Log Leave Request** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear Filters** | `button` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Employee Name` | `Leave Type` | `Duration` | `Total Days` | `Reason` | `Attachment` | `Status` | `Actions`
- **Rows Extracted:** 1

---

## [Tenant Portal] Leave Management → Employee Leave Balances

- **URL:** `https://connect.rmd.city/public/leaves/balances`
- **Page Title:** `Connect - Leave Balances`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/15-leaves-balances.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/15-leaves-balances.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `year` | `hidden` | Optional | `—` | Standard input |
| `allocated` | `number` | Yes | `e.g. 30` | Standard input |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `year` | 4 | 2025, 2026, 2027, 2028 |
| `employee_id` | 1 | Choose Employee |
| `leave_type_id` | 6 | Choose Leave Type, Annual Leave, Maternity Leave, Paternity Leave, Sick Leave |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Adjust Balance** | `button` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Allocation** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Employee` | `Leave Type` | `Allocated` | `Used` | `Remaining` | `Quick Action`
- **Rows Extracted:** 1

### Modals & Dialog Workflows
#### Dialog: Adjust Allocation Limits

---

## [Tenant Portal] Leave Management → Leave Types Configuration

- **URL:** `https://connect.rmd.city/public/leaves/types`
- **Page Title:** `Connect - Leave Types`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/16-leaves-types.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/16-leaves-types.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `name` | `text` | Yes | `Annual Leave` | Standard input |
| `code` | `text` | Yes | `AL` | Standard input |
| `days_per_year` | `number` | Yes | `30` | Standard input |
| `description` | `textarea` | Optional | `Description of leave type policy...` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `name` | `text` | Yes | `—` | Standard input |
| `code` | `text` | Yes | `—` | Standard input |
| `days_per_year` | `number` | Yes | `—` | Standard input |
| `description` | `textarea` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `name` | `text` | Yes | `—` | Standard input |
| `code` | `text` | Yes | `—` | Standard input |
| `days_per_year` | `number` | Yes | `—` | Standard input |
| `description` | `textarea` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `name` | `text` | Yes | `—` | Standard input |
| `code` | `text` | Yes | `—` | Standard input |
| `days_per_year` | `number` | Yes | `—` | Standard input |
| `description` | `textarea` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `name` | `text` | Yes | `—` | Standard input |
| `code` | `text` | Yes | `—` | Standard input |
| `days_per_year` | `number` | Yes | `—` | Standard input |
| `description` | `textarea` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `name` | `text` | Yes | `—` | Standard input |
| `code` | `text` | Yes | `—` | Standard input |
| `days_per_year` | `number` | Yes | `—` | Standard input |
| `description` | `textarea` | Optional | `—` | Standard input |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `is_paid` | 2 | Paid Leave, Unpaid Leave |
| `is_paid` | 2 | Paid Leave, Unpaid Leave |
| `is_paid` | 2 | Paid Leave, Unpaid Leave |
| `is_paid` | 2 | Paid Leave, Unpaid Leave |
| `is_paid` | 2 | Paid Leave, Unpaid Leave |
| `is_paid` | 2 | Paid Leave, Unpaid Leave |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add Leave Type** | `button` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Create Policy** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Changes** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Changes** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Changes** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Changes** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Changes** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Name` | `Code` | `Days Per Year` | `Paid / Unpaid` | `Description` | `Actions`
- **Rows Extracted:** 5

### Modals & Dialog Workflows
#### Dialog: Create New Leave Type
#### Dialog: Edit Leave Type: Annual Leave
#### Dialog: Edit Leave Type: Maternity Leave
#### Dialog: Edit Leave Type: Paternity Leave
#### Dialog: Edit Leave Type: Sick Leave
#### Dialog: Edit Leave Type: Unpaid Leave

---

## [Tenant Portal] Leave Management → Public & Organization Holidays

- **URL:** `https://connect.rmd.city/public/holidays`
- **Page Title:** `Connect - Public Holidays`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/17-holidays.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/17-holidays.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Yes | `UAE National Day` | Standard input |
| `date` | `date` | Yes | `—` | Standard input |
| `description` | `textarea` | Optional | `Description of the holiday...` | Standard input |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `is_recurring` | 2 | Yes, recurs on same day every year, No, single date event |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add Holiday** | `button` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Create Holiday** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Name` | `Date` | `Is Recurring Yearly` | `Description` | `Actions`
- **Rows Extracted:** 1

### Modals & Dialog Workflows
#### Dialog: Create New Holiday

---

## [Tenant Portal] Leave Management → Leave Calendar View

- **URL:** `https://connect.rmd.city/public/leaves/calendar`
- **Page Title:** `Connect - Team Leave Calendar`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/18-leaves-calendar.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/18-leaves-calendar.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `month` | 12 | January, February, March, April, May |
| `year` | 4 | 2025, 2026, 2027, 2028 |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Sun` | `Mon` | `Tue` | `Wed` | `Thu` | `Fri` | `Sat`
- **Rows Extracted:** 5

---

## [Tenant Portal] Payroll & Loans → Employee Loans & Advances

- **URL:** `https://connect.rmd.city/public/payroll/loans`
- **Page Title:** `Connect - Loan Management`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/19-loans.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/19-loans.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `amount` | `number` | Yes | `e.g. 10000` | Standard input |
| `installments_count` | `number` | Yes | `e.g. 12` | Standard input |
| `purpose` | `textarea` | Optional | `e.g. Emergency medical expenses` | Standard input |
| `attachment` | `file` | Optional | `—` | Standard input |
| `auto_approve` | `checkbox` | Optional | `—` | Standard input |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `status` | 5 | All Statuses, Pending Approval, Active / Approved, Rejected, Fully Repaid / Completed |
| `employee_id` | 1 | Choose active employee... |
| `start_month` | 12 | January, February, March, April, May |
| `start_year` | 3 | 2026, 2027, 2028 |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add Loan Record** | `button` | Form Submit / Modal Toggle / Navigation |
| **Filter** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Create Loan Record** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Employee` | `Loan Principal` | `Installments` | `Monthly Rate` | `Remaining Bal.` | `Start Month` | `Status` | `Actions`
- **Rows Extracted:** 1

### Modals & Dialog Workflows
#### Dialog: Add Employee Loan Record

---

## [Tenant Portal] Announcements → Company Announcements & Bulletins

- **URL:** `https://connect.rmd.city/public/announcements`
- **Page Title:** `Connect - Announcements`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/20-announcements.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/20-announcements.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add Announcement** | `button` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Title` | `Content Snippet` | `Published At` | `Expires At` | `Status` | `Actions`
- **Rows Extracted:** 1

---

## [Tenant Portal] Documents → Document Categories & Types

- **URL:** `https://connect.rmd.city/public/documents/types`
- **Page Title:** `Connect - Document Types`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/21-document-types.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/21-document-types.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Yes | `e.g. Passport, Emirates ID` | Standard input |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `is_required` | 2 | Yes, required for all employee profiles, No, optional document |
| `has_expiry` | 2 | Yes, tracks expiry date and flags when expired, No, date tracking not needed |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add Category** | `button` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Next: Design Form** | `button` | Form Submit / Modal Toggle / Navigation |
| **Back** | `button` | Form Submit / Modal Toggle / Navigation |
| **Create Category** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Category Name` | `Is Required for Profiles` | `Tracks Expiry Date` | `Actions`
- **Rows Extracted:** 1

### Modals & Dialog Workflows
#### Dialog: Step 1 of 2
                    Create New Document Category

---

## [Tenant Portal] Documents → All Documents & Expiry Tracking

- **URL:** `https://connect.rmd.city/public/documents`
- **Page Title:** `Connect - Document Directory`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/22-documents-all.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/22-documents-all.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `file` | `file` | Yes | `—` | Standard input |
| `document_number` | `text` | Optional | `Enter document number` | Standard input |
| `issue_date` | `date` | Optional | `—` | Standard input |
| `expiry_date` | `date` | Optional | `—` | Standard input |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `employee_id` | 1 | All Employees |
| `document_type_id` | 1 | All Types |
| `is_verified` | 3 | All Statuses, Verified Only, Pending Verification |
| `expiry_status` | 5 | All Expiries, Expired, Expiring Soon, Active / Valid, Lifetime (No Expiry) |
| `employee_id` | 1 | Choose Employee |
| `document_type_id` | 1 | Choose Category |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Upload Document** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear** | `button` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Upload Record** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Employee` | `Document Category` | `File Name` | `Storage Disk` | `Expiry Date` | `Verification` | `Actions`
- **Rows Extracted:** 1

### Modals & Dialog Workflows
#### Dialog: Upload Compliance Document

---

## [Tenant Portal] Reports → Reports Overview & Summary

- **URL:** `https://connect.rmd.city/public/reports`
- **Page Title:** `Forbidden`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/23-reports-overview.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/23-reports-overview.png)

### Inputs & Interactive Fields
*No direct text inputs on main canvas body.*

---

## [Tenant Portal] Reports → Employee Demographics Report

- **URL:** `https://connect.rmd.city/public/reports/employees`
- **Page Title:** `Forbidden`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/24-reports-employees.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/24-reports-employees.png)

### Inputs & Interactive Fields
*No direct text inputs on main canvas body.*

---

## [Tenant Portal] Reports → Leave Utilization Report

- **URL:** `https://connect.rmd.city/public/reports/leaves`
- **Page Title:** `Forbidden`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/25-reports-leaves.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/25-reports-leaves.png)

### Inputs & Interactive Fields
*No direct text inputs on main canvas body.*

---

## [Tenant Portal] Reports → Document Expiries Report

- **URL:** `https://connect.rmd.city/public/reports/documents`
- **Page Title:** `Forbidden`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/26-reports-documents.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/26-reports-documents.png)

### Inputs & Interactive Fields
*No direct text inputs on main canvas body.*

---

## [Tenant Portal] Reports → Loan Balances & Deductions Report

- **URL:** `https://connect.rmd.city/public/reports/loans`
- **Page Title:** `Forbidden`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/27-reports-loans.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/27-reports-loans.png)

### Inputs & Interactive Fields
*No direct text inputs on main canvas body.*

---

## [Tenant Portal] Billing → Subscription & Billing Plans

- **URL:** `https://connect.rmd.city/public/settings/subscription`
- **Page Title:** `Connect - Subscription & Billing`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/28-subscription.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/28-subscription.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `field` | `checkbox` | Optional | `—` | Standard input |
| `vat_number` | `text` | Optional | `e.g. 100xxxxxxxxx003` | Standard input |
| `card_name` | `text` | Yes | `e.g. John Doe` | Standard input |
| `card_number` | `text` | Yes | `4111 2222 3333 4444` | Standard input |
| `card_expiry` | `text` | Yes | `MM/YY` | Standard input |
| `card_cvc` | `password` | Yes | `•••` | Standard input |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `card_brand` | 4 | Visa, MasterCard, American Express, Discover |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add Credit/Debit Card** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save VAT Number** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Monthly Billing** | `button` | Form Submit / Modal Toggle / Navigation |
| **Annual Billing Save** | `button` | Form Submit / Modal Toggle / Navigation |
| **Current Package** | `button` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Card** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Invoice Number` | `Billing Date` | `Amount` | `Payment Method` | `Status` | `Actions`
- **Rows Extracted:** 1

### Modals & Dialog Workflows
#### Dialog: Add Payment Card

---

## [Tenant Portal] Support → Help & Support Tickets

- **URL:** `https://connect.rmd.city/public/support`
- **Page Title:** `Connect - Help & Support`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/29-support.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/29-support.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `subject` | `text` | Yes | `Briefly describe the issue (e.g. Leave balance calculation mismatch)` | Standard input |
| `description` | `textarea` | Yes | `Please provide all details needed for our team to reproduce and resolve the issue...` | Standard input |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **New Support Ticket** | `button` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Submit Ticket** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `ID` | `Subject` | `Description` | `Status` | `Date Logged` | `Actions`
- **Rows Extracted:** 1

### Modals & Dialog Workflows
#### Dialog: New Support Ticket

---

## [Tenant Portal] Settings → Organization Profile & Branding

- **URL:** `https://connect.rmd.city/public/settings/profile`
- **Page Title:** `Connect - Organization Profile Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/30-settings-profile.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/30-settings-profile.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `logo` | `file` | Optional | `—` | Standard input |
| `name` | `text` | Yes | `—` | Standard input |
| `email` | `email` | Yes | `—` | Standard input |
| `phone` | `text` | Optional | `—` | Standard input |
| `industry` | `text` | Optional | `e.g. Technology, Retail, Finance` | Standard input |
| `document_expiry_email` | `email` | Optional | `compliance@yourcompany.com` | Standard input |
| `document_expiry_alert_days` | `number` | Yes | `—` | Standard input |
| `address` | `textarea` | Optional | `Company physical address...` | Standard input |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `currency` | 5 | AED - United Arab Emirates Dirham, USD - United States Dollar, EUR - Euro, GBP - British Pound, INR - Indian Rupee |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Save Changes** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

---

## [Tenant Portal] Settings → Department Hierarchy

- **URL:** `https://connect.rmd.city/public/departments`
- **Page Title:** `Connect - Departments`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/31-departments.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/31-departments.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Yes | `IT Infrastructure, Human Resources, etc.` | Standard input |
| `description` | `textarea` | Optional | `Define the department's role within the organization` | Standard input |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `parent_id` | 1 | None |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add Department** | `button` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Create Department** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Name` | `Parent Department` | `Description` | `Created` | `Actions`
- **Rows Extracted:** 1

### Modals & Dialog Workflows
#### Dialog: Add Department

---

## [Tenant Portal] Settings → Designations & Job Titles

- **URL:** `https://connect.rmd.city/public/designations`
- **Page Title:** `Connect - Designations`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/32-designations.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/32-designations.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Yes | `Senior Software Engineer, HR Specialist, etc.` | Standard input |
| `description` | `textarea` | Optional | `Brief details about the role's primary function` | Standard input |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add Designation** | `button` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Create Designation** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Job Title / Designation` | `Description` | `Created` | `Actions`
- **Rows Extracted:** 1

### Modals & Dialog Workflows
#### Dialog: Add Designation

---

## [Tenant Portal] Settings → Roles & Permission Access Matrix

- **URL:** `https://connect.rmd.city/public/settings/roles`
- **Page Title:** `Connect - Roles & Permissions`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/33-roles-permissions.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/33-roles-permissions.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Yes | `e.g. Finance Officer, HR Assistant` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `name` | `hidden` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `name` | `hidden` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `name` | `hidden` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |
| `permissions[]` | `checkbox` | Optional | `—` | Standard input |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Employees** | `button` | Form Submit / Modal Toggle / Navigation |
| **Leave Management** | `button` | Form Submit / Modal Toggle / Navigation |
| **Documents** | `button` | Form Submit / Modal Toggle / Navigation |
| **Reports** | `button` | Form Submit / Modal Toggle / Navigation |
| **Settings** | `button` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Create Custom Role** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Permissions** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Permissions** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Permissions** | `button` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Create Role** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Changes** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Changes** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Changes** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Install** | `button` | Form Submit / Modal Toggle / Navigation |

### Modals & Dialog Workflows
#### Dialog: Create Custom Role
#### Dialog: Edit Role: Employee
#### Dialog: Edit Role: HR Manager
#### Dialog: Edit Role: Tenant Admin

---

## [Tenant Portal] Settings → Notification Templates & Triggers

- **URL:** `https://connect.rmd.city/public/settings/templates`
- **Page Title:** `Connect`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/34-notification-templates.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/34-notification-templates.png)

### Inputs & Interactive Fields
*No direct text inputs on main canvas body.*

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Copy as Markdown** | `button` | Form Submit / Modal Toggle / Navigation |
| **1** | `button` | Form Submit / Modal Toggle / Navigation |
| **2** | `button` | Form Submit / Modal Toggle / Navigation |

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin Dashboard

- **URL:** `https://connect.rmd.city/public/superadmin/dashboard`
- **Page Title:** `Glix System Control - Dashboard`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-01-dashboard.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-01-dashboard.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Organization` | `Slug` | `Limit` | `Registered`
- **Rows Extracted:** 4
- **Columns:** `Tenant` | `Plan` | `Status` | `Started`
- **Rows Extracted:** 4
- **Columns:** `Invoice #` | `Tenant ID` | `Amount` | `Payment Status` | `Method` | `Date` | `Actions`
- **Rows Extracted:** 1

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin profile

- **URL:** `https://connect.rmd.city/public/superadmin/profile`
- **Page Title:** `Super Admin Profile`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-02-profile.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-02-profile.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Optional | `—` | Administrator Name |
| `email` | `email` | Optional | `—` | Email Address |
| `password` | `password` | Optional | `••••••••` | New Password |
| `password_confirmation` | `password` | Optional | `••••••••` | Confirm New Password |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Save Changes** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin settings

- **URL:** `https://connect.rmd.city/public/superadmin/settings`
- **Page Title:** `Glix System Control - System Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-03-settings.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-03-settings.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `app_name` | `text` | Optional | `Glix Connect HR Portal` | Platform Application Name |
| `central_support_email` | `email` | Optional | `support@glix.ae` | Support Center Email |
| `superadmin_prefix` | `text` | Optional | `superadmin` | Super Admin URL Prefix |
| `brand_color_picker` | `color` | Optional | `—` | Standard input |
| `brand_color` | `text` | Optional | `#f76707` | Standard input |
| `app_logo` | `file` | Optional | `—` | Software Logo (Light Mode / Default) |
| `app_logo_dark` | `file` | Optional | `—` | Software Logo (Dark Mode) |
| `app_favicon` | `file` | Optional | `—` | Software Favicon / Icon |
| `billing_vat` | `number` | Optional | `5.00` | Billing VAT / Tax Percentage (%) |
| `invoice_company_name` | `text` | Optional | `e.g. Connect Portal` | Billing Entity Name / Brand |
| `invoice_company_legal_name` | `text` | Optional | `e.g. Glix Systems Engineering Ltd.` | Billing Entity Legal Name |
| `invoice_company_email` | `email` | Optional | `e.g. support@glix.ae` | Billing Support Email |
| `invoice_company_website` | `text` | Optional | `e.g. edocs.glix.ae` | Billing Website URL |
| `invoice_company_phone` | `text` | Optional | `e.g. +971 4 123 4567` | Billing Phone Number |
| `invoice_company_address` | `textarea` | Optional | `e.g. Dubai, United Arab Emirates` | Billing Physical/Mailing Address |
| `invoice_title` | `text` | Optional | `e.g. INVOICE` | Invoice PDF Title |
| `invoice_prefix` | `text` | Optional | `e.g. INV` | Invoice Prefix Key |
| `invoice_series_starting` | `number` | Optional | `e.g. 1001` | Invoice Series Start Number |
| `mail_from_address` | `email` | Optional | `noreply@glix.ae` | Mail From Address |
| `mail_from_name` | `text` | Optional | `Connect HR` | Mail From Name |
| `smtp_host` | `text` | Optional | `smtp.mailtrap.io` | SMTP Host |
| `smtp_port` | `number` | Optional | `2525` | SMTP Port |
| `smtp_username` | `text` | Optional | `Enter username` | SMTP Username |
| `smtp_password` | `password` | Optional | `••••••••` | SMTP Password |
| `smtp_test_email` | `email` | Optional | `e.g. admin@example.com` | Standard input |
| `whatsapp_phone_number_id` | `text` | Optional | `e.g. 109823485741029` | WhatsApp Phone Number ID |
| `whatsapp_business_account_id` | `text` | Optional | `e.g. 102938475610293` | WhatsApp Business Account ID |
| `whatsapp_access_token` | `password` | Optional | `EAAG••••••••` | Permanent Access Token |
| `payment_stripe_enabled` | `checkbox` | Optional | `—` | Enable Stripe Method |
| `stripe_publishable_key` | `text` | Optional | `pk_test_...` | Stripe Publishable Key |
| `stripe_secret_key` | `password` | Optional | `sk_test_••••••••` | Stripe Secret Key |
| `payment_paypal_enabled` | `checkbox` | Optional | `—` | Enable PayPal Method |
| `paypal_client_id` | `text` | Optional | `Enter Client ID` | PayPal Client ID |
| `paypal_secret` | `password` | Optional | `Enter Secret` | PayPal Secret Key |
| `pusher_app_id` | `text` | Optional | `Enter App ID` | Pusher App ID |
| `pusher_key` | `text` | Optional | `Enter Key` | Pusher Key |
| `pusher_secret` | `password` | Optional | `Enter Secret` | Pusher Secret |
| `pusher_cluster` | `text` | Optional | `mt1` | Pusher Cluster |
| `google_client_id` | `text` | Optional | `Enter Google Client ID` | Google Client ID |
| `google_client_secret` | `password` | Optional | `Enter Google Client Secret` | Google Client Secret |
| `s3_key` | `text` | Optional | `Enter Access Key` | Access Key ID |
| `s3_secret` | `password` | Optional | `Enter Secret Key` | Secret Access Key |
| `s3_bucket` | `text` | Optional | `Enter Bucket Name` | Bucket Name |
| `s3_region` | `text` | Optional | `us-east-1` | Region |
| `s3_endpoint` | `text` | Optional | `e.g., https://s3.wasabisys.com` | Custom Endpoint (Optional) |
| `bunny_storage_name` | `text` | Optional | `my-bunny-zone` | Storage Zone Name |
| `bunny_api_key` | `password` | Optional | `Enter API Password` | API Access Password |
| `bunny_region` | `text` | Optional | `de` | Region Code (Standard core uses blank / de) |
| `bunny_pull_zone` | `text` | Optional | `https://myzone.b-cdn.net` | Pull Zone CDN URL (Optional) |
| `google_maps_api_key` | `text` | Optional | `AIzaSy...` | Google Maps API Key |
| `pwa_short_name` | `text` | Optional | `Connect` | PWA App Short Name |
| `pwa_theme_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_theme_color` | `text` | Optional | `#0052FF` | Standard input |
| `pwa_bg_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_background_color` | `text` | Optional | `#0b0e14` | Standard input |
| `pwa_icon` | `file` | Optional | `—` | PWA Launcher Icon (512x512 PNG) |
| `allow_registration` | `checkbox` | Optional | `—` | Allow Public Organization Registration |
| `maintenance_mode` | `checkbox` | Optional | `—` | Enable Maintenance Mode |
| `updater_github_repo` | `text` | Optional | `e.g. owner/repository` | GitHub Repository |
| `updater_github_token` | `password` | Optional | `ghp_••••••••••••••••••••` | GitHub Personal Access Token (PAT) |
| `updater_github_branch` | `text` | Optional | `e.g. main` | Target GitHub Branch |
| `updater_current_version` | `text` | Optional | `e.g. 1.0.0` | Current System Version |
| `confirm_text` | `text` | Optional | `Type here...` | Type the confirmation phrase to proceed: |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `base_timezone` | 6 | Asia/Dubai (GST - Gulf Standard Time), UTC (Coordinated Universal Time), Europe/London (GMT/BST), America/New_York (EST/EDT), Asia/Kolkata (IST) |
| `base_currency` | 5 | AED (United Arab Emirates Dirham), USD (United States Dollar), EUR (Euro), GBP (British Pound), INR (Indian Rupee) |
| `mail_mailer` | 3 | Log (Debug / Local Testing), Custom SMTP, Brevo SMTP Relay |
| `smtp_encryption` | 3 | TLS, SSL, None |
| `whatsapp_enabled` | 2 | Disabled, Enabled |
| `stripe_mode` | 2 | Sandbox, Live |
| `paypal_mode` | 2 | Sandbox, Live |
| `broadcast_driver` | 3 | Log (Local Debugging), Pusher, Null (Disabled) |
| `google_login_enabled` | 2 | Disabled, Enabled (OAuth Sandbox) |
| `storage_type` | 3 | Local Server Storage (Default), Amazon Web Services (AWS S3), Bunny.net Storage Zones |
| `map_provider` | 2 | OpenStreetMap (Leaflet - Free / Default), Google Maps (API Key required) |
| `pwa_enabled` | 2 | Disabled, Enabled |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Send Test** | `button` | Form Submit / Modal Toggle / Navigation |
| **Check for Updates** | `button` | Form Submit / Modal Toggle / Navigation |
| **Fetch & Update Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear System Data** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save All Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Erase All Data** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Modals & Dialog Workflows
#### Dialog: Confirm System Reset
- **Fields:** `_token`, `confirm_text`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin settings - General Settings

- **URL:** `https://connect.rmd.city/public/superadmin/settings`
- **Page Title:** `Glix System Control - System Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-03-settings-tab-1.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-03-settings-tab-1.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `app_name` | `text` | Optional | `Glix Connect HR Portal` | Platform Application Name |
| `central_support_email` | `email` | Optional | `support@glix.ae` | Support Center Email |
| `superadmin_prefix` | `text` | Optional | `superadmin` | Super Admin URL Prefix |
| `brand_color_picker` | `color` | Optional | `—` | Standard input |
| `brand_color` | `text` | Optional | `#f76707` | Standard input |
| `app_logo` | `file` | Optional | `—` | Software Logo (Light Mode / Default) |
| `app_logo_dark` | `file` | Optional | `—` | Software Logo (Dark Mode) |
| `app_favicon` | `file` | Optional | `—` | Software Favicon / Icon |
| `billing_vat` | `number` | Optional | `5.00` | Billing VAT / Tax Percentage (%) |
| `invoice_company_name` | `text` | Optional | `e.g. Connect Portal` | Billing Entity Name / Brand |
| `invoice_company_legal_name` | `text` | Optional | `e.g. Glix Systems Engineering Ltd.` | Billing Entity Legal Name |
| `invoice_company_email` | `email` | Optional | `e.g. support@glix.ae` | Billing Support Email |
| `invoice_company_website` | `text` | Optional | `e.g. edocs.glix.ae` | Billing Website URL |
| `invoice_company_phone` | `text` | Optional | `e.g. +971 4 123 4567` | Billing Phone Number |
| `invoice_company_address` | `textarea` | Optional | `e.g. Dubai, United Arab Emirates` | Billing Physical/Mailing Address |
| `invoice_title` | `text` | Optional | `e.g. INVOICE` | Invoice PDF Title |
| `invoice_prefix` | `text` | Optional | `e.g. INV` | Invoice Prefix Key |
| `invoice_series_starting` | `number` | Optional | `e.g. 1001` | Invoice Series Start Number |
| `mail_from_address` | `email` | Optional | `noreply@glix.ae` | Mail From Address |
| `mail_from_name` | `text` | Optional | `Connect HR` | Mail From Name |
| `smtp_host` | `text` | Optional | `smtp.mailtrap.io` | SMTP Host |
| `smtp_port` | `number` | Optional | `2525` | SMTP Port |
| `smtp_username` | `text` | Optional | `Enter username` | SMTP Username |
| `smtp_password` | `password` | Optional | `••••••••` | SMTP Password |
| `smtp_test_email` | `email` | Optional | `e.g. admin@example.com` | Standard input |
| `whatsapp_phone_number_id` | `text` | Optional | `e.g. 109823485741029` | WhatsApp Phone Number ID |
| `whatsapp_business_account_id` | `text` | Optional | `e.g. 102938475610293` | WhatsApp Business Account ID |
| `whatsapp_access_token` | `password` | Optional | `EAAG••••••••` | Permanent Access Token |
| `payment_stripe_enabled` | `checkbox` | Optional | `—` | Enable Stripe Method |
| `stripe_publishable_key` | `text` | Optional | `pk_test_...` | Stripe Publishable Key |
| `stripe_secret_key` | `password` | Optional | `sk_test_••••••••` | Stripe Secret Key |
| `payment_paypal_enabled` | `checkbox` | Optional | `—` | Enable PayPal Method |
| `paypal_client_id` | `text` | Optional | `Enter Client ID` | PayPal Client ID |
| `paypal_secret` | `password` | Optional | `Enter Secret` | PayPal Secret Key |
| `pusher_app_id` | `text` | Optional | `Enter App ID` | Pusher App ID |
| `pusher_key` | `text` | Optional | `Enter Key` | Pusher Key |
| `pusher_secret` | `password` | Optional | `Enter Secret` | Pusher Secret |
| `pusher_cluster` | `text` | Optional | `mt1` | Pusher Cluster |
| `google_client_id` | `text` | Optional | `Enter Google Client ID` | Google Client ID |
| `google_client_secret` | `password` | Optional | `Enter Google Client Secret` | Google Client Secret |
| `s3_key` | `text` | Optional | `Enter Access Key` | Access Key ID |
| `s3_secret` | `password` | Optional | `Enter Secret Key` | Secret Access Key |
| `s3_bucket` | `text` | Optional | `Enter Bucket Name` | Bucket Name |
| `s3_region` | `text` | Optional | `us-east-1` | Region |
| `s3_endpoint` | `text` | Optional | `e.g., https://s3.wasabisys.com` | Custom Endpoint (Optional) |
| `bunny_storage_name` | `text` | Optional | `my-bunny-zone` | Storage Zone Name |
| `bunny_api_key` | `password` | Optional | `Enter API Password` | API Access Password |
| `bunny_region` | `text` | Optional | `de` | Region Code (Standard core uses blank / de) |
| `bunny_pull_zone` | `text` | Optional | `https://myzone.b-cdn.net` | Pull Zone CDN URL (Optional) |
| `google_maps_api_key` | `text` | Optional | `AIzaSy...` | Google Maps API Key |
| `pwa_short_name` | `text` | Optional | `Connect` | PWA App Short Name |
| `pwa_theme_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_theme_color` | `text` | Optional | `#0052FF` | Standard input |
| `pwa_bg_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_background_color` | `text` | Optional | `#0b0e14` | Standard input |
| `pwa_icon` | `file` | Optional | `—` | PWA Launcher Icon (512x512 PNG) |
| `allow_registration` | `checkbox` | Optional | `—` | Allow Public Organization Registration |
| `maintenance_mode` | `checkbox` | Optional | `—` | Enable Maintenance Mode |
| `updater_github_repo` | `text` | Optional | `e.g. owner/repository` | GitHub Repository |
| `updater_github_token` | `password` | Optional | `ghp_••••••••••••••••••••` | GitHub Personal Access Token (PAT) |
| `updater_github_branch` | `text` | Optional | `e.g. main` | Target GitHub Branch |
| `updater_current_version` | `text` | Optional | `e.g. 1.0.0` | Current System Version |
| `confirm_text` | `text` | Optional | `Type here...` | Type the confirmation phrase to proceed: |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `base_timezone` | 6 | Asia/Dubai (GST - Gulf Standard Time), UTC (Coordinated Universal Time), Europe/London (GMT/BST), America/New_York (EST/EDT), Asia/Kolkata (IST) |
| `base_currency` | 5 | AED (United Arab Emirates Dirham), USD (United States Dollar), EUR (Euro), GBP (British Pound), INR (Indian Rupee) |
| `mail_mailer` | 3 | Log (Debug / Local Testing), Custom SMTP, Brevo SMTP Relay |
| `smtp_encryption` | 3 | TLS, SSL, None |
| `whatsapp_enabled` | 2 | Disabled, Enabled |
| `stripe_mode` | 2 | Sandbox, Live |
| `paypal_mode` | 2 | Sandbox, Live |
| `broadcast_driver` | 3 | Log (Local Debugging), Pusher, Null (Disabled) |
| `google_login_enabled` | 2 | Disabled, Enabled (OAuth Sandbox) |
| `storage_type` | 3 | Local Server Storage (Default), Amazon Web Services (AWS S3), Bunny.net Storage Zones |
| `map_provider` | 2 | OpenStreetMap (Leaflet - Free / Default), Google Maps (API Key required) |
| `pwa_enabled` | 2 | Disabled, Enabled |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Send Test** | `button` | Form Submit / Modal Toggle / Navigation |
| **Check for Updates** | `button` | Form Submit / Modal Toggle / Navigation |
| **Fetch & Update Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear System Data** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save All Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Erase All Data** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Modals & Dialog Workflows
#### Dialog: Confirm System Reset
- **Fields:** `_token`, `confirm_text`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin settings - Branding

- **URL:** `https://connect.rmd.city/public/superadmin/settings`
- **Page Title:** `Glix System Control - System Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-03-settings-tab-2.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-03-settings-tab-2.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `app_name` | `text` | Optional | `Glix Connect HR Portal` | Platform Application Name |
| `central_support_email` | `email` | Optional | `support@glix.ae` | Support Center Email |
| `superadmin_prefix` | `text` | Optional | `superadmin` | Super Admin URL Prefix |
| `brand_color_picker` | `color` | Optional | `—` | Standard input |
| `brand_color` | `text` | Optional | `#f76707` | Standard input |
| `app_logo` | `file` | Optional | `—` | Software Logo (Light Mode / Default) |
| `app_logo_dark` | `file` | Optional | `—` | Software Logo (Dark Mode) |
| `app_favicon` | `file` | Optional | `—` | Software Favicon / Icon |
| `billing_vat` | `number` | Optional | `5.00` | Billing VAT / Tax Percentage (%) |
| `invoice_company_name` | `text` | Optional | `e.g. Connect Portal` | Billing Entity Name / Brand |
| `invoice_company_legal_name` | `text` | Optional | `e.g. Glix Systems Engineering Ltd.` | Billing Entity Legal Name |
| `invoice_company_email` | `email` | Optional | `e.g. support@glix.ae` | Billing Support Email |
| `invoice_company_website` | `text` | Optional | `e.g. edocs.glix.ae` | Billing Website URL |
| `invoice_company_phone` | `text` | Optional | `e.g. +971 4 123 4567` | Billing Phone Number |
| `invoice_company_address` | `textarea` | Optional | `e.g. Dubai, United Arab Emirates` | Billing Physical/Mailing Address |
| `invoice_title` | `text` | Optional | `e.g. INVOICE` | Invoice PDF Title |
| `invoice_prefix` | `text` | Optional | `e.g. INV` | Invoice Prefix Key |
| `invoice_series_starting` | `number` | Optional | `e.g. 1001` | Invoice Series Start Number |
| `mail_from_address` | `email` | Optional | `noreply@glix.ae` | Mail From Address |
| `mail_from_name` | `text` | Optional | `Connect HR` | Mail From Name |
| `smtp_host` | `text` | Optional | `smtp.mailtrap.io` | SMTP Host |
| `smtp_port` | `number` | Optional | `2525` | SMTP Port |
| `smtp_username` | `text` | Optional | `Enter username` | SMTP Username |
| `smtp_password` | `password` | Optional | `••••••••` | SMTP Password |
| `smtp_test_email` | `email` | Optional | `e.g. admin@example.com` | Standard input |
| `whatsapp_phone_number_id` | `text` | Optional | `e.g. 109823485741029` | WhatsApp Phone Number ID |
| `whatsapp_business_account_id` | `text` | Optional | `e.g. 102938475610293` | WhatsApp Business Account ID |
| `whatsapp_access_token` | `password` | Optional | `EAAG••••••••` | Permanent Access Token |
| `payment_stripe_enabled` | `checkbox` | Optional | `—` | Enable Stripe Method |
| `stripe_publishable_key` | `text` | Optional | `pk_test_...` | Stripe Publishable Key |
| `stripe_secret_key` | `password` | Optional | `sk_test_••••••••` | Stripe Secret Key |
| `payment_paypal_enabled` | `checkbox` | Optional | `—` | Enable PayPal Method |
| `paypal_client_id` | `text` | Optional | `Enter Client ID` | PayPal Client ID |
| `paypal_secret` | `password` | Optional | `Enter Secret` | PayPal Secret Key |
| `pusher_app_id` | `text` | Optional | `Enter App ID` | Pusher App ID |
| `pusher_key` | `text` | Optional | `Enter Key` | Pusher Key |
| `pusher_secret` | `password` | Optional | `Enter Secret` | Pusher Secret |
| `pusher_cluster` | `text` | Optional | `mt1` | Pusher Cluster |
| `google_client_id` | `text` | Optional | `Enter Google Client ID` | Google Client ID |
| `google_client_secret` | `password` | Optional | `Enter Google Client Secret` | Google Client Secret |
| `s3_key` | `text` | Optional | `Enter Access Key` | Access Key ID |
| `s3_secret` | `password` | Optional | `Enter Secret Key` | Secret Access Key |
| `s3_bucket` | `text` | Optional | `Enter Bucket Name` | Bucket Name |
| `s3_region` | `text` | Optional | `us-east-1` | Region |
| `s3_endpoint` | `text` | Optional | `e.g., https://s3.wasabisys.com` | Custom Endpoint (Optional) |
| `bunny_storage_name` | `text` | Optional | `my-bunny-zone` | Storage Zone Name |
| `bunny_api_key` | `password` | Optional | `Enter API Password` | API Access Password |
| `bunny_region` | `text` | Optional | `de` | Region Code (Standard core uses blank / de) |
| `bunny_pull_zone` | `text` | Optional | `https://myzone.b-cdn.net` | Pull Zone CDN URL (Optional) |
| `google_maps_api_key` | `text` | Optional | `AIzaSy...` | Google Maps API Key |
| `pwa_short_name` | `text` | Optional | `Connect` | PWA App Short Name |
| `pwa_theme_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_theme_color` | `text` | Optional | `#0052FF` | Standard input |
| `pwa_bg_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_background_color` | `text` | Optional | `#0b0e14` | Standard input |
| `pwa_icon` | `file` | Optional | `—` | PWA Launcher Icon (512x512 PNG) |
| `allow_registration` | `checkbox` | Optional | `—` | Allow Public Organization Registration |
| `maintenance_mode` | `checkbox` | Optional | `—` | Enable Maintenance Mode |
| `updater_github_repo` | `text` | Optional | `e.g. owner/repository` | GitHub Repository |
| `updater_github_token` | `password` | Optional | `ghp_••••••••••••••••••••` | GitHub Personal Access Token (PAT) |
| `updater_github_branch` | `text` | Optional | `e.g. main` | Target GitHub Branch |
| `updater_current_version` | `text` | Optional | `e.g. 1.0.0` | Current System Version |
| `confirm_text` | `text` | Optional | `Type here...` | Type the confirmation phrase to proceed: |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `base_timezone` | 6 | Asia/Dubai (GST - Gulf Standard Time), UTC (Coordinated Universal Time), Europe/London (GMT/BST), America/New_York (EST/EDT), Asia/Kolkata (IST) |
| `base_currency` | 5 | AED (United Arab Emirates Dirham), USD (United States Dollar), EUR (Euro), GBP (British Pound), INR (Indian Rupee) |
| `mail_mailer` | 3 | Log (Debug / Local Testing), Custom SMTP, Brevo SMTP Relay |
| `smtp_encryption` | 3 | TLS, SSL, None |
| `whatsapp_enabled` | 2 | Disabled, Enabled |
| `stripe_mode` | 2 | Sandbox, Live |
| `paypal_mode` | 2 | Sandbox, Live |
| `broadcast_driver` | 3 | Log (Local Debugging), Pusher, Null (Disabled) |
| `google_login_enabled` | 2 | Disabled, Enabled (OAuth Sandbox) |
| `storage_type` | 3 | Local Server Storage (Default), Amazon Web Services (AWS S3), Bunny.net Storage Zones |
| `map_provider` | 2 | OpenStreetMap (Leaflet - Free / Default), Google Maps (API Key required) |
| `pwa_enabled` | 2 | Disabled, Enabled |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Send Test** | `button` | Form Submit / Modal Toggle / Navigation |
| **Check for Updates** | `button` | Form Submit / Modal Toggle / Navigation |
| **Fetch & Update Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear System Data** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save All Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Erase All Data** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Modals & Dialog Workflows
#### Dialog: Confirm System Reset
- **Fields:** `_token`, `confirm_text`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin settings - Billing & Invoice

- **URL:** `https://connect.rmd.city/public/superadmin/settings`
- **Page Title:** `Glix System Control - System Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-03-settings-tab-3.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-03-settings-tab-3.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `app_name` | `text` | Optional | `Glix Connect HR Portal` | Platform Application Name |
| `central_support_email` | `email` | Optional | `support@glix.ae` | Support Center Email |
| `superadmin_prefix` | `text` | Optional | `superadmin` | Super Admin URL Prefix |
| `brand_color_picker` | `color` | Optional | `—` | Standard input |
| `brand_color` | `text` | Optional | `#f76707` | Standard input |
| `app_logo` | `file` | Optional | `—` | Software Logo (Light Mode / Default) |
| `app_logo_dark` | `file` | Optional | `—` | Software Logo (Dark Mode) |
| `app_favicon` | `file` | Optional | `—` | Software Favicon / Icon |
| `billing_vat` | `number` | Optional | `5.00` | Billing VAT / Tax Percentage (%) |
| `invoice_company_name` | `text` | Optional | `e.g. Connect Portal` | Billing Entity Name / Brand |
| `invoice_company_legal_name` | `text` | Optional | `e.g. Glix Systems Engineering Ltd.` | Billing Entity Legal Name |
| `invoice_company_email` | `email` | Optional | `e.g. support@glix.ae` | Billing Support Email |
| `invoice_company_website` | `text` | Optional | `e.g. edocs.glix.ae` | Billing Website URL |
| `invoice_company_phone` | `text` | Optional | `e.g. +971 4 123 4567` | Billing Phone Number |
| `invoice_company_address` | `textarea` | Optional | `e.g. Dubai, United Arab Emirates` | Billing Physical/Mailing Address |
| `invoice_title` | `text` | Optional | `e.g. INVOICE` | Invoice PDF Title |
| `invoice_prefix` | `text` | Optional | `e.g. INV` | Invoice Prefix Key |
| `invoice_series_starting` | `number` | Optional | `e.g. 1001` | Invoice Series Start Number |
| `mail_from_address` | `email` | Optional | `noreply@glix.ae` | Mail From Address |
| `mail_from_name` | `text` | Optional | `Connect HR` | Mail From Name |
| `smtp_host` | `text` | Optional | `smtp.mailtrap.io` | SMTP Host |
| `smtp_port` | `number` | Optional | `2525` | SMTP Port |
| `smtp_username` | `text` | Optional | `Enter username` | SMTP Username |
| `smtp_password` | `password` | Optional | `••••••••` | SMTP Password |
| `smtp_test_email` | `email` | Optional | `e.g. admin@example.com` | Standard input |
| `whatsapp_phone_number_id` | `text` | Optional | `e.g. 109823485741029` | WhatsApp Phone Number ID |
| `whatsapp_business_account_id` | `text` | Optional | `e.g. 102938475610293` | WhatsApp Business Account ID |
| `whatsapp_access_token` | `password` | Optional | `EAAG••••••••` | Permanent Access Token |
| `payment_stripe_enabled` | `checkbox` | Optional | `—` | Enable Stripe Method |
| `stripe_publishable_key` | `text` | Optional | `pk_test_...` | Stripe Publishable Key |
| `stripe_secret_key` | `password` | Optional | `sk_test_••••••••` | Stripe Secret Key |
| `payment_paypal_enabled` | `checkbox` | Optional | `—` | Enable PayPal Method |
| `paypal_client_id` | `text` | Optional | `Enter Client ID` | PayPal Client ID |
| `paypal_secret` | `password` | Optional | `Enter Secret` | PayPal Secret Key |
| `pusher_app_id` | `text` | Optional | `Enter App ID` | Pusher App ID |
| `pusher_key` | `text` | Optional | `Enter Key` | Pusher Key |
| `pusher_secret` | `password` | Optional | `Enter Secret` | Pusher Secret |
| `pusher_cluster` | `text` | Optional | `mt1` | Pusher Cluster |
| `google_client_id` | `text` | Optional | `Enter Google Client ID` | Google Client ID |
| `google_client_secret` | `password` | Optional | `Enter Google Client Secret` | Google Client Secret |
| `s3_key` | `text` | Optional | `Enter Access Key` | Access Key ID |
| `s3_secret` | `password` | Optional | `Enter Secret Key` | Secret Access Key |
| `s3_bucket` | `text` | Optional | `Enter Bucket Name` | Bucket Name |
| `s3_region` | `text` | Optional | `us-east-1` | Region |
| `s3_endpoint` | `text` | Optional | `e.g., https://s3.wasabisys.com` | Custom Endpoint (Optional) |
| `bunny_storage_name` | `text` | Optional | `my-bunny-zone` | Storage Zone Name |
| `bunny_api_key` | `password` | Optional | `Enter API Password` | API Access Password |
| `bunny_region` | `text` | Optional | `de` | Region Code (Standard core uses blank / de) |
| `bunny_pull_zone` | `text` | Optional | `https://myzone.b-cdn.net` | Pull Zone CDN URL (Optional) |
| `google_maps_api_key` | `text` | Optional | `AIzaSy...` | Google Maps API Key |
| `pwa_short_name` | `text` | Optional | `Connect` | PWA App Short Name |
| `pwa_theme_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_theme_color` | `text` | Optional | `#0052FF` | Standard input |
| `pwa_bg_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_background_color` | `text` | Optional | `#0b0e14` | Standard input |
| `pwa_icon` | `file` | Optional | `—` | PWA Launcher Icon (512x512 PNG) |
| `allow_registration` | `checkbox` | Optional | `—` | Allow Public Organization Registration |
| `maintenance_mode` | `checkbox` | Optional | `—` | Enable Maintenance Mode |
| `updater_github_repo` | `text` | Optional | `e.g. owner/repository` | GitHub Repository |
| `updater_github_token` | `password` | Optional | `ghp_••••••••••••••••••••` | GitHub Personal Access Token (PAT) |
| `updater_github_branch` | `text` | Optional | `e.g. main` | Target GitHub Branch |
| `updater_current_version` | `text` | Optional | `e.g. 1.0.0` | Current System Version |
| `confirm_text` | `text` | Optional | `Type here...` | Type the confirmation phrase to proceed: |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `base_timezone` | 6 | Asia/Dubai (GST - Gulf Standard Time), UTC (Coordinated Universal Time), Europe/London (GMT/BST), America/New_York (EST/EDT), Asia/Kolkata (IST) |
| `base_currency` | 5 | AED (United Arab Emirates Dirham), USD (United States Dollar), EUR (Euro), GBP (British Pound), INR (Indian Rupee) |
| `mail_mailer` | 3 | Log (Debug / Local Testing), Custom SMTP, Brevo SMTP Relay |
| `smtp_encryption` | 3 | TLS, SSL, None |
| `whatsapp_enabled` | 2 | Disabled, Enabled |
| `stripe_mode` | 2 | Sandbox, Live |
| `paypal_mode` | 2 | Sandbox, Live |
| `broadcast_driver` | 3 | Log (Local Debugging), Pusher, Null (Disabled) |
| `google_login_enabled` | 2 | Disabled, Enabled (OAuth Sandbox) |
| `storage_type` | 3 | Local Server Storage (Default), Amazon Web Services (AWS S3), Bunny.net Storage Zones |
| `map_provider` | 2 | OpenStreetMap (Leaflet - Free / Default), Google Maps (API Key required) |
| `pwa_enabled` | 2 | Disabled, Enabled |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Send Test** | `button` | Form Submit / Modal Toggle / Navigation |
| **Check for Updates** | `button` | Form Submit / Modal Toggle / Navigation |
| **Fetch & Update Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear System Data** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save All Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Erase All Data** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Modals & Dialog Workflows
#### Dialog: Confirm System Reset
- **Fields:** `_token`, `confirm_text`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin settings - Mail & SMTP

- **URL:** `https://connect.rmd.city/public/superadmin/settings`
- **Page Title:** `Glix System Control - System Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-03-settings-tab-4.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-03-settings-tab-4.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `app_name` | `text` | Optional | `Glix Connect HR Portal` | Platform Application Name |
| `central_support_email` | `email` | Optional | `support@glix.ae` | Support Center Email |
| `superadmin_prefix` | `text` | Optional | `superadmin` | Super Admin URL Prefix |
| `brand_color_picker` | `color` | Optional | `—` | Standard input |
| `brand_color` | `text` | Optional | `#f76707` | Standard input |
| `app_logo` | `file` | Optional | `—` | Software Logo (Light Mode / Default) |
| `app_logo_dark` | `file` | Optional | `—` | Software Logo (Dark Mode) |
| `app_favicon` | `file` | Optional | `—` | Software Favicon / Icon |
| `billing_vat` | `number` | Optional | `5.00` | Billing VAT / Tax Percentage (%) |
| `invoice_company_name` | `text` | Optional | `e.g. Connect Portal` | Billing Entity Name / Brand |
| `invoice_company_legal_name` | `text` | Optional | `e.g. Glix Systems Engineering Ltd.` | Billing Entity Legal Name |
| `invoice_company_email` | `email` | Optional | `e.g. support@glix.ae` | Billing Support Email |
| `invoice_company_website` | `text` | Optional | `e.g. edocs.glix.ae` | Billing Website URL |
| `invoice_company_phone` | `text` | Optional | `e.g. +971 4 123 4567` | Billing Phone Number |
| `invoice_company_address` | `textarea` | Optional | `e.g. Dubai, United Arab Emirates` | Billing Physical/Mailing Address |
| `invoice_title` | `text` | Optional | `e.g. INVOICE` | Invoice PDF Title |
| `invoice_prefix` | `text` | Optional | `e.g. INV` | Invoice Prefix Key |
| `invoice_series_starting` | `number` | Optional | `e.g. 1001` | Invoice Series Start Number |
| `mail_from_address` | `email` | Optional | `noreply@glix.ae` | Mail From Address |
| `mail_from_name` | `text` | Optional | `Connect HR` | Mail From Name |
| `smtp_host` | `text` | Optional | `smtp.mailtrap.io` | SMTP Host |
| `smtp_port` | `number` | Optional | `2525` | SMTP Port |
| `smtp_username` | `text` | Optional | `Enter username` | SMTP Username |
| `smtp_password` | `password` | Optional | `••••••••` | SMTP Password |
| `smtp_test_email` | `email` | Optional | `e.g. admin@example.com` | Standard input |
| `whatsapp_phone_number_id` | `text` | Optional | `e.g. 109823485741029` | WhatsApp Phone Number ID |
| `whatsapp_business_account_id` | `text` | Optional | `e.g. 102938475610293` | WhatsApp Business Account ID |
| `whatsapp_access_token` | `password` | Optional | `EAAG••••••••` | Permanent Access Token |
| `payment_stripe_enabled` | `checkbox` | Optional | `—` | Enable Stripe Method |
| `stripe_publishable_key` | `text` | Optional | `pk_test_...` | Stripe Publishable Key |
| `stripe_secret_key` | `password` | Optional | `sk_test_••••••••` | Stripe Secret Key |
| `payment_paypal_enabled` | `checkbox` | Optional | `—` | Enable PayPal Method |
| `paypal_client_id` | `text` | Optional | `Enter Client ID` | PayPal Client ID |
| `paypal_secret` | `password` | Optional | `Enter Secret` | PayPal Secret Key |
| `pusher_app_id` | `text` | Optional | `Enter App ID` | Pusher App ID |
| `pusher_key` | `text` | Optional | `Enter Key` | Pusher Key |
| `pusher_secret` | `password` | Optional | `Enter Secret` | Pusher Secret |
| `pusher_cluster` | `text` | Optional | `mt1` | Pusher Cluster |
| `google_client_id` | `text` | Optional | `Enter Google Client ID` | Google Client ID |
| `google_client_secret` | `password` | Optional | `Enter Google Client Secret` | Google Client Secret |
| `s3_key` | `text` | Optional | `Enter Access Key` | Access Key ID |
| `s3_secret` | `password` | Optional | `Enter Secret Key` | Secret Access Key |
| `s3_bucket` | `text` | Optional | `Enter Bucket Name` | Bucket Name |
| `s3_region` | `text` | Optional | `us-east-1` | Region |
| `s3_endpoint` | `text` | Optional | `e.g., https://s3.wasabisys.com` | Custom Endpoint (Optional) |
| `bunny_storage_name` | `text` | Optional | `my-bunny-zone` | Storage Zone Name |
| `bunny_api_key` | `password` | Optional | `Enter API Password` | API Access Password |
| `bunny_region` | `text` | Optional | `de` | Region Code (Standard core uses blank / de) |
| `bunny_pull_zone` | `text` | Optional | `https://myzone.b-cdn.net` | Pull Zone CDN URL (Optional) |
| `google_maps_api_key` | `text` | Optional | `AIzaSy...` | Google Maps API Key |
| `pwa_short_name` | `text` | Optional | `Connect` | PWA App Short Name |
| `pwa_theme_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_theme_color` | `text` | Optional | `#0052FF` | Standard input |
| `pwa_bg_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_background_color` | `text` | Optional | `#0b0e14` | Standard input |
| `pwa_icon` | `file` | Optional | `—` | PWA Launcher Icon (512x512 PNG) |
| `allow_registration` | `checkbox` | Optional | `—` | Allow Public Organization Registration |
| `maintenance_mode` | `checkbox` | Optional | `—` | Enable Maintenance Mode |
| `updater_github_repo` | `text` | Optional | `e.g. owner/repository` | GitHub Repository |
| `updater_github_token` | `password` | Optional | `ghp_••••••••••••••••••••` | GitHub Personal Access Token (PAT) |
| `updater_github_branch` | `text` | Optional | `e.g. main` | Target GitHub Branch |
| `updater_current_version` | `text` | Optional | `e.g. 1.0.0` | Current System Version |
| `confirm_text` | `text` | Optional | `Type here...` | Type the confirmation phrase to proceed: |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `base_timezone` | 6 | Asia/Dubai (GST - Gulf Standard Time), UTC (Coordinated Universal Time), Europe/London (GMT/BST), America/New_York (EST/EDT), Asia/Kolkata (IST) |
| `base_currency` | 5 | AED (United Arab Emirates Dirham), USD (United States Dollar), EUR (Euro), GBP (British Pound), INR (Indian Rupee) |
| `mail_mailer` | 3 | Log (Debug / Local Testing), Custom SMTP, Brevo SMTP Relay |
| `smtp_encryption` | 3 | TLS, SSL, None |
| `whatsapp_enabled` | 2 | Disabled, Enabled |
| `stripe_mode` | 2 | Sandbox, Live |
| `paypal_mode` | 2 | Sandbox, Live |
| `broadcast_driver` | 3 | Log (Local Debugging), Pusher, Null (Disabled) |
| `google_login_enabled` | 2 | Disabled, Enabled (OAuth Sandbox) |
| `storage_type` | 3 | Local Server Storage (Default), Amazon Web Services (AWS S3), Bunny.net Storage Zones |
| `map_provider` | 2 | OpenStreetMap (Leaflet - Free / Default), Google Maps (API Key required) |
| `pwa_enabled` | 2 | Disabled, Enabled |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Send Test** | `button` | Form Submit / Modal Toggle / Navigation |
| **Check for Updates** | `button` | Form Submit / Modal Toggle / Navigation |
| **Fetch & Update Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear System Data** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save All Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Erase All Data** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Modals & Dialog Workflows
#### Dialog: Confirm System Reset
- **Fields:** `_token`, `confirm_text`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin settings - WhatsApp Cloud

- **URL:** `https://connect.rmd.city/public/superadmin/settings`
- **Page Title:** `Glix System Control - System Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-03-settings-tab-5.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-03-settings-tab-5.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `app_name` | `text` | Optional | `Glix Connect HR Portal` | Platform Application Name |
| `central_support_email` | `email` | Optional | `support@glix.ae` | Support Center Email |
| `superadmin_prefix` | `text` | Optional | `superadmin` | Super Admin URL Prefix |
| `brand_color_picker` | `color` | Optional | `—` | Standard input |
| `brand_color` | `text` | Optional | `#f76707` | Standard input |
| `app_logo` | `file` | Optional | `—` | Software Logo (Light Mode / Default) |
| `app_logo_dark` | `file` | Optional | `—` | Software Logo (Dark Mode) |
| `app_favicon` | `file` | Optional | `—` | Software Favicon / Icon |
| `billing_vat` | `number` | Optional | `5.00` | Billing VAT / Tax Percentage (%) |
| `invoice_company_name` | `text` | Optional | `e.g. Connect Portal` | Billing Entity Name / Brand |
| `invoice_company_legal_name` | `text` | Optional | `e.g. Glix Systems Engineering Ltd.` | Billing Entity Legal Name |
| `invoice_company_email` | `email` | Optional | `e.g. support@glix.ae` | Billing Support Email |
| `invoice_company_website` | `text` | Optional | `e.g. edocs.glix.ae` | Billing Website URL |
| `invoice_company_phone` | `text` | Optional | `e.g. +971 4 123 4567` | Billing Phone Number |
| `invoice_company_address` | `textarea` | Optional | `e.g. Dubai, United Arab Emirates` | Billing Physical/Mailing Address |
| `invoice_title` | `text` | Optional | `e.g. INVOICE` | Invoice PDF Title |
| `invoice_prefix` | `text` | Optional | `e.g. INV` | Invoice Prefix Key |
| `invoice_series_starting` | `number` | Optional | `e.g. 1001` | Invoice Series Start Number |
| `mail_from_address` | `email` | Optional | `noreply@glix.ae` | Mail From Address |
| `mail_from_name` | `text` | Optional | `Connect HR` | Mail From Name |
| `smtp_host` | `text` | Optional | `smtp.mailtrap.io` | SMTP Host |
| `smtp_port` | `number` | Optional | `2525` | SMTP Port |
| `smtp_username` | `text` | Optional | `Enter username` | SMTP Username |
| `smtp_password` | `password` | Optional | `••••••••` | SMTP Password |
| `smtp_test_email` | `email` | Optional | `e.g. admin@example.com` | Standard input |
| `whatsapp_phone_number_id` | `text` | Optional | `e.g. 109823485741029` | WhatsApp Phone Number ID |
| `whatsapp_business_account_id` | `text` | Optional | `e.g. 102938475610293` | WhatsApp Business Account ID |
| `whatsapp_access_token` | `password` | Optional | `EAAG••••••••` | Permanent Access Token |
| `payment_stripe_enabled` | `checkbox` | Optional | `—` | Enable Stripe Method |
| `stripe_publishable_key` | `text` | Optional | `pk_test_...` | Stripe Publishable Key |
| `stripe_secret_key` | `password` | Optional | `sk_test_••••••••` | Stripe Secret Key |
| `payment_paypal_enabled` | `checkbox` | Optional | `—` | Enable PayPal Method |
| `paypal_client_id` | `text` | Optional | `Enter Client ID` | PayPal Client ID |
| `paypal_secret` | `password` | Optional | `Enter Secret` | PayPal Secret Key |
| `pusher_app_id` | `text` | Optional | `Enter App ID` | Pusher App ID |
| `pusher_key` | `text` | Optional | `Enter Key` | Pusher Key |
| `pusher_secret` | `password` | Optional | `Enter Secret` | Pusher Secret |
| `pusher_cluster` | `text` | Optional | `mt1` | Pusher Cluster |
| `google_client_id` | `text` | Optional | `Enter Google Client ID` | Google Client ID |
| `google_client_secret` | `password` | Optional | `Enter Google Client Secret` | Google Client Secret |
| `s3_key` | `text` | Optional | `Enter Access Key` | Access Key ID |
| `s3_secret` | `password` | Optional | `Enter Secret Key` | Secret Access Key |
| `s3_bucket` | `text` | Optional | `Enter Bucket Name` | Bucket Name |
| `s3_region` | `text` | Optional | `us-east-1` | Region |
| `s3_endpoint` | `text` | Optional | `e.g., https://s3.wasabisys.com` | Custom Endpoint (Optional) |
| `bunny_storage_name` | `text` | Optional | `my-bunny-zone` | Storage Zone Name |
| `bunny_api_key` | `password` | Optional | `Enter API Password` | API Access Password |
| `bunny_region` | `text` | Optional | `de` | Region Code (Standard core uses blank / de) |
| `bunny_pull_zone` | `text` | Optional | `https://myzone.b-cdn.net` | Pull Zone CDN URL (Optional) |
| `google_maps_api_key` | `text` | Optional | `AIzaSy...` | Google Maps API Key |
| `pwa_short_name` | `text` | Optional | `Connect` | PWA App Short Name |
| `pwa_theme_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_theme_color` | `text` | Optional | `#0052FF` | Standard input |
| `pwa_bg_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_background_color` | `text` | Optional | `#0b0e14` | Standard input |
| `pwa_icon` | `file` | Optional | `—` | PWA Launcher Icon (512x512 PNG) |
| `allow_registration` | `checkbox` | Optional | `—` | Allow Public Organization Registration |
| `maintenance_mode` | `checkbox` | Optional | `—` | Enable Maintenance Mode |
| `updater_github_repo` | `text` | Optional | `e.g. owner/repository` | GitHub Repository |
| `updater_github_token` | `password` | Optional | `ghp_••••••••••••••••••••` | GitHub Personal Access Token (PAT) |
| `updater_github_branch` | `text` | Optional | `e.g. main` | Target GitHub Branch |
| `updater_current_version` | `text` | Optional | `e.g. 1.0.0` | Current System Version |
| `confirm_text` | `text` | Optional | `Type here...` | Type the confirmation phrase to proceed: |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `base_timezone` | 6 | Asia/Dubai (GST - Gulf Standard Time), UTC (Coordinated Universal Time), Europe/London (GMT/BST), America/New_York (EST/EDT), Asia/Kolkata (IST) |
| `base_currency` | 5 | AED (United Arab Emirates Dirham), USD (United States Dollar), EUR (Euro), GBP (British Pound), INR (Indian Rupee) |
| `mail_mailer` | 3 | Log (Debug / Local Testing), Custom SMTP, Brevo SMTP Relay |
| `smtp_encryption` | 3 | TLS, SSL, None |
| `whatsapp_enabled` | 2 | Disabled, Enabled |
| `stripe_mode` | 2 | Sandbox, Live |
| `paypal_mode` | 2 | Sandbox, Live |
| `broadcast_driver` | 3 | Log (Local Debugging), Pusher, Null (Disabled) |
| `google_login_enabled` | 2 | Disabled, Enabled (OAuth Sandbox) |
| `storage_type` | 3 | Local Server Storage (Default), Amazon Web Services (AWS S3), Bunny.net Storage Zones |
| `map_provider` | 2 | OpenStreetMap (Leaflet - Free / Default), Google Maps (API Key required) |
| `pwa_enabled` | 2 | Disabled, Enabled |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Send Test** | `button` | Form Submit / Modal Toggle / Navigation |
| **Check for Updates** | `button` | Form Submit / Modal Toggle / Navigation |
| **Fetch & Update Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear System Data** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save All Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Erase All Data** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Modals & Dialog Workflows
#### Dialog: Confirm System Reset
- **Fields:** `_token`, `confirm_text`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin settings - Payment Gateways

- **URL:** `https://connect.rmd.city/public/superadmin/settings`
- **Page Title:** `Glix System Control - System Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-03-settings-tab-6.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-03-settings-tab-6.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `app_name` | `text` | Optional | `Glix Connect HR Portal` | Platform Application Name |
| `central_support_email` | `email` | Optional | `support@glix.ae` | Support Center Email |
| `superadmin_prefix` | `text` | Optional | `superadmin` | Super Admin URL Prefix |
| `brand_color_picker` | `color` | Optional | `—` | Standard input |
| `brand_color` | `text` | Optional | `#f76707` | Standard input |
| `app_logo` | `file` | Optional | `—` | Software Logo (Light Mode / Default) |
| `app_logo_dark` | `file` | Optional | `—` | Software Logo (Dark Mode) |
| `app_favicon` | `file` | Optional | `—` | Software Favicon / Icon |
| `billing_vat` | `number` | Optional | `5.00` | Billing VAT / Tax Percentage (%) |
| `invoice_company_name` | `text` | Optional | `e.g. Connect Portal` | Billing Entity Name / Brand |
| `invoice_company_legal_name` | `text` | Optional | `e.g. Glix Systems Engineering Ltd.` | Billing Entity Legal Name |
| `invoice_company_email` | `email` | Optional | `e.g. support@glix.ae` | Billing Support Email |
| `invoice_company_website` | `text` | Optional | `e.g. edocs.glix.ae` | Billing Website URL |
| `invoice_company_phone` | `text` | Optional | `e.g. +971 4 123 4567` | Billing Phone Number |
| `invoice_company_address` | `textarea` | Optional | `e.g. Dubai, United Arab Emirates` | Billing Physical/Mailing Address |
| `invoice_title` | `text` | Optional | `e.g. INVOICE` | Invoice PDF Title |
| `invoice_prefix` | `text` | Optional | `e.g. INV` | Invoice Prefix Key |
| `invoice_series_starting` | `number` | Optional | `e.g. 1001` | Invoice Series Start Number |
| `mail_from_address` | `email` | Optional | `noreply@glix.ae` | Mail From Address |
| `mail_from_name` | `text` | Optional | `Connect HR` | Mail From Name |
| `smtp_host` | `text` | Optional | `smtp.mailtrap.io` | SMTP Host |
| `smtp_port` | `number` | Optional | `2525` | SMTP Port |
| `smtp_username` | `text` | Optional | `Enter username` | SMTP Username |
| `smtp_password` | `password` | Optional | `••••••••` | SMTP Password |
| `smtp_test_email` | `email` | Optional | `e.g. admin@example.com` | Standard input |
| `whatsapp_phone_number_id` | `text` | Optional | `e.g. 109823485741029` | WhatsApp Phone Number ID |
| `whatsapp_business_account_id` | `text` | Optional | `e.g. 102938475610293` | WhatsApp Business Account ID |
| `whatsapp_access_token` | `password` | Optional | `EAAG••••••••` | Permanent Access Token |
| `payment_stripe_enabled` | `checkbox` | Optional | `—` | Enable Stripe Method |
| `stripe_publishable_key` | `text` | Optional | `pk_test_...` | Stripe Publishable Key |
| `stripe_secret_key` | `password` | Optional | `sk_test_••••••••` | Stripe Secret Key |
| `payment_paypal_enabled` | `checkbox` | Optional | `—` | Enable PayPal Method |
| `paypal_client_id` | `text` | Optional | `Enter Client ID` | PayPal Client ID |
| `paypal_secret` | `password` | Optional | `Enter Secret` | PayPal Secret Key |
| `pusher_app_id` | `text` | Optional | `Enter App ID` | Pusher App ID |
| `pusher_key` | `text` | Optional | `Enter Key` | Pusher Key |
| `pusher_secret` | `password` | Optional | `Enter Secret` | Pusher Secret |
| `pusher_cluster` | `text` | Optional | `mt1` | Pusher Cluster |
| `google_client_id` | `text` | Optional | `Enter Google Client ID` | Google Client ID |
| `google_client_secret` | `password` | Optional | `Enter Google Client Secret` | Google Client Secret |
| `s3_key` | `text` | Optional | `Enter Access Key` | Access Key ID |
| `s3_secret` | `password` | Optional | `Enter Secret Key` | Secret Access Key |
| `s3_bucket` | `text` | Optional | `Enter Bucket Name` | Bucket Name |
| `s3_region` | `text` | Optional | `us-east-1` | Region |
| `s3_endpoint` | `text` | Optional | `e.g., https://s3.wasabisys.com` | Custom Endpoint (Optional) |
| `bunny_storage_name` | `text` | Optional | `my-bunny-zone` | Storage Zone Name |
| `bunny_api_key` | `password` | Optional | `Enter API Password` | API Access Password |
| `bunny_region` | `text` | Optional | `de` | Region Code (Standard core uses blank / de) |
| `bunny_pull_zone` | `text` | Optional | `https://myzone.b-cdn.net` | Pull Zone CDN URL (Optional) |
| `google_maps_api_key` | `text` | Optional | `AIzaSy...` | Google Maps API Key |
| `pwa_short_name` | `text` | Optional | `Connect` | PWA App Short Name |
| `pwa_theme_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_theme_color` | `text` | Optional | `#0052FF` | Standard input |
| `pwa_bg_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_background_color` | `text` | Optional | `#0b0e14` | Standard input |
| `pwa_icon` | `file` | Optional | `—` | PWA Launcher Icon (512x512 PNG) |
| `allow_registration` | `checkbox` | Optional | `—` | Allow Public Organization Registration |
| `maintenance_mode` | `checkbox` | Optional | `—` | Enable Maintenance Mode |
| `updater_github_repo` | `text` | Optional | `e.g. owner/repository` | GitHub Repository |
| `updater_github_token` | `password` | Optional | `ghp_••••••••••••••••••••` | GitHub Personal Access Token (PAT) |
| `updater_github_branch` | `text` | Optional | `e.g. main` | Target GitHub Branch |
| `updater_current_version` | `text` | Optional | `e.g. 1.0.0` | Current System Version |
| `confirm_text` | `text` | Optional | `Type here...` | Type the confirmation phrase to proceed: |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `base_timezone` | 6 | Asia/Dubai (GST - Gulf Standard Time), UTC (Coordinated Universal Time), Europe/London (GMT/BST), America/New_York (EST/EDT), Asia/Kolkata (IST) |
| `base_currency` | 5 | AED (United Arab Emirates Dirham), USD (United States Dollar), EUR (Euro), GBP (British Pound), INR (Indian Rupee) |
| `mail_mailer` | 3 | Log (Debug / Local Testing), Custom SMTP, Brevo SMTP Relay |
| `smtp_encryption` | 3 | TLS, SSL, None |
| `whatsapp_enabled` | 2 | Disabled, Enabled |
| `stripe_mode` | 2 | Sandbox, Live |
| `paypal_mode` | 2 | Sandbox, Live |
| `broadcast_driver` | 3 | Log (Local Debugging), Pusher, Null (Disabled) |
| `google_login_enabled` | 2 | Disabled, Enabled (OAuth Sandbox) |
| `storage_type` | 3 | Local Server Storage (Default), Amazon Web Services (AWS S3), Bunny.net Storage Zones |
| `map_provider` | 2 | OpenStreetMap (Leaflet - Free / Default), Google Maps (API Key required) |
| `pwa_enabled` | 2 | Disabled, Enabled |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Send Test** | `button` | Form Submit / Modal Toggle / Navigation |
| **Check for Updates** | `button` | Form Submit / Modal Toggle / Navigation |
| **Fetch & Update Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear System Data** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save All Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Erase All Data** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Modals & Dialog Workflows
#### Dialog: Confirm System Reset
- **Fields:** `_token`, `confirm_text`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin settings - SSO & WebSockets

- **URL:** `https://connect.rmd.city/public/superadmin/settings`
- **Page Title:** `Glix System Control - System Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-03-settings-tab-7.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-03-settings-tab-7.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `app_name` | `text` | Optional | `Glix Connect HR Portal` | Platform Application Name |
| `central_support_email` | `email` | Optional | `support@glix.ae` | Support Center Email |
| `superadmin_prefix` | `text` | Optional | `superadmin` | Super Admin URL Prefix |
| `brand_color_picker` | `color` | Optional | `—` | Standard input |
| `brand_color` | `text` | Optional | `#f76707` | Standard input |
| `app_logo` | `file` | Optional | `—` | Software Logo (Light Mode / Default) |
| `app_logo_dark` | `file` | Optional | `—` | Software Logo (Dark Mode) |
| `app_favicon` | `file` | Optional | `—` | Software Favicon / Icon |
| `billing_vat` | `number` | Optional | `5.00` | Billing VAT / Tax Percentage (%) |
| `invoice_company_name` | `text` | Optional | `e.g. Connect Portal` | Billing Entity Name / Brand |
| `invoice_company_legal_name` | `text` | Optional | `e.g. Glix Systems Engineering Ltd.` | Billing Entity Legal Name |
| `invoice_company_email` | `email` | Optional | `e.g. support@glix.ae` | Billing Support Email |
| `invoice_company_website` | `text` | Optional | `e.g. edocs.glix.ae` | Billing Website URL |
| `invoice_company_phone` | `text` | Optional | `e.g. +971 4 123 4567` | Billing Phone Number |
| `invoice_company_address` | `textarea` | Optional | `e.g. Dubai, United Arab Emirates` | Billing Physical/Mailing Address |
| `invoice_title` | `text` | Optional | `e.g. INVOICE` | Invoice PDF Title |
| `invoice_prefix` | `text` | Optional | `e.g. INV` | Invoice Prefix Key |
| `invoice_series_starting` | `number` | Optional | `e.g. 1001` | Invoice Series Start Number |
| `mail_from_address` | `email` | Optional | `noreply@glix.ae` | Mail From Address |
| `mail_from_name` | `text` | Optional | `Connect HR` | Mail From Name |
| `smtp_host` | `text` | Optional | `smtp.mailtrap.io` | SMTP Host |
| `smtp_port` | `number` | Optional | `2525` | SMTP Port |
| `smtp_username` | `text` | Optional | `Enter username` | SMTP Username |
| `smtp_password` | `password` | Optional | `••••••••` | SMTP Password |
| `smtp_test_email` | `email` | Optional | `e.g. admin@example.com` | Standard input |
| `whatsapp_phone_number_id` | `text` | Optional | `e.g. 109823485741029` | WhatsApp Phone Number ID |
| `whatsapp_business_account_id` | `text` | Optional | `e.g. 102938475610293` | WhatsApp Business Account ID |
| `whatsapp_access_token` | `password` | Optional | `EAAG••••••••` | Permanent Access Token |
| `payment_stripe_enabled` | `checkbox` | Optional | `—` | Enable Stripe Method |
| `stripe_publishable_key` | `text` | Optional | `pk_test_...` | Stripe Publishable Key |
| `stripe_secret_key` | `password` | Optional | `sk_test_••••••••` | Stripe Secret Key |
| `payment_paypal_enabled` | `checkbox` | Optional | `—` | Enable PayPal Method |
| `paypal_client_id` | `text` | Optional | `Enter Client ID` | PayPal Client ID |
| `paypal_secret` | `password` | Optional | `Enter Secret` | PayPal Secret Key |
| `pusher_app_id` | `text` | Optional | `Enter App ID` | Pusher App ID |
| `pusher_key` | `text` | Optional | `Enter Key` | Pusher Key |
| `pusher_secret` | `password` | Optional | `Enter Secret` | Pusher Secret |
| `pusher_cluster` | `text` | Optional | `mt1` | Pusher Cluster |
| `google_client_id` | `text` | Optional | `Enter Google Client ID` | Google Client ID |
| `google_client_secret` | `password` | Optional | `Enter Google Client Secret` | Google Client Secret |
| `s3_key` | `text` | Optional | `Enter Access Key` | Access Key ID |
| `s3_secret` | `password` | Optional | `Enter Secret Key` | Secret Access Key |
| `s3_bucket` | `text` | Optional | `Enter Bucket Name` | Bucket Name |
| `s3_region` | `text` | Optional | `us-east-1` | Region |
| `s3_endpoint` | `text` | Optional | `e.g., https://s3.wasabisys.com` | Custom Endpoint (Optional) |
| `bunny_storage_name` | `text` | Optional | `my-bunny-zone` | Storage Zone Name |
| `bunny_api_key` | `password` | Optional | `Enter API Password` | API Access Password |
| `bunny_region` | `text` | Optional | `de` | Region Code (Standard core uses blank / de) |
| `bunny_pull_zone` | `text` | Optional | `https://myzone.b-cdn.net` | Pull Zone CDN URL (Optional) |
| `google_maps_api_key` | `text` | Optional | `AIzaSy...` | Google Maps API Key |
| `pwa_short_name` | `text` | Optional | `Connect` | PWA App Short Name |
| `pwa_theme_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_theme_color` | `text` | Optional | `#0052FF` | Standard input |
| `pwa_bg_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_background_color` | `text` | Optional | `#0b0e14` | Standard input |
| `pwa_icon` | `file` | Optional | `—` | PWA Launcher Icon (512x512 PNG) |
| `allow_registration` | `checkbox` | Optional | `—` | Allow Public Organization Registration |
| `maintenance_mode` | `checkbox` | Optional | `—` | Enable Maintenance Mode |
| `updater_github_repo` | `text` | Optional | `e.g. owner/repository` | GitHub Repository |
| `updater_github_token` | `password` | Optional | `ghp_••••••••••••••••••••` | GitHub Personal Access Token (PAT) |
| `updater_github_branch` | `text` | Optional | `e.g. main` | Target GitHub Branch |
| `updater_current_version` | `text` | Optional | `e.g. 1.0.0` | Current System Version |
| `confirm_text` | `text` | Optional | `Type here...` | Type the confirmation phrase to proceed: |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `base_timezone` | 6 | Asia/Dubai (GST - Gulf Standard Time), UTC (Coordinated Universal Time), Europe/London (GMT/BST), America/New_York (EST/EDT), Asia/Kolkata (IST) |
| `base_currency` | 5 | AED (United Arab Emirates Dirham), USD (United States Dollar), EUR (Euro), GBP (British Pound), INR (Indian Rupee) |
| `mail_mailer` | 3 | Log (Debug / Local Testing), Custom SMTP, Brevo SMTP Relay |
| `smtp_encryption` | 3 | TLS, SSL, None |
| `whatsapp_enabled` | 2 | Disabled, Enabled |
| `stripe_mode` | 2 | Sandbox, Live |
| `paypal_mode` | 2 | Sandbox, Live |
| `broadcast_driver` | 3 | Log (Local Debugging), Pusher, Null (Disabled) |
| `google_login_enabled` | 2 | Disabled, Enabled (OAuth Sandbox) |
| `storage_type` | 3 | Local Server Storage (Default), Amazon Web Services (AWS S3), Bunny.net Storage Zones |
| `map_provider` | 2 | OpenStreetMap (Leaflet - Free / Default), Google Maps (API Key required) |
| `pwa_enabled` | 2 | Disabled, Enabled |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Send Test** | `button` | Form Submit / Modal Toggle / Navigation |
| **Check for Updates** | `button` | Form Submit / Modal Toggle / Navigation |
| **Fetch & Update Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear System Data** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save All Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Erase All Data** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Modals & Dialog Workflows
#### Dialog: Confirm System Reset
- **Fields:** `_token`, `confirm_text`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin settings - Storage & Maps

- **URL:** `https://connect.rmd.city/public/superadmin/settings`
- **Page Title:** `Glix System Control - System Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-03-settings-tab-8.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-03-settings-tab-8.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `app_name` | `text` | Optional | `Glix Connect HR Portal` | Platform Application Name |
| `central_support_email` | `email` | Optional | `support@glix.ae` | Support Center Email |
| `superadmin_prefix` | `text` | Optional | `superadmin` | Super Admin URL Prefix |
| `brand_color_picker` | `color` | Optional | `—` | Standard input |
| `brand_color` | `text` | Optional | `#f76707` | Standard input |
| `app_logo` | `file` | Optional | `—` | Software Logo (Light Mode / Default) |
| `app_logo_dark` | `file` | Optional | `—` | Software Logo (Dark Mode) |
| `app_favicon` | `file` | Optional | `—` | Software Favicon / Icon |
| `billing_vat` | `number` | Optional | `5.00` | Billing VAT / Tax Percentage (%) |
| `invoice_company_name` | `text` | Optional | `e.g. Connect Portal` | Billing Entity Name / Brand |
| `invoice_company_legal_name` | `text` | Optional | `e.g. Glix Systems Engineering Ltd.` | Billing Entity Legal Name |
| `invoice_company_email` | `email` | Optional | `e.g. support@glix.ae` | Billing Support Email |
| `invoice_company_website` | `text` | Optional | `e.g. edocs.glix.ae` | Billing Website URL |
| `invoice_company_phone` | `text` | Optional | `e.g. +971 4 123 4567` | Billing Phone Number |
| `invoice_company_address` | `textarea` | Optional | `e.g. Dubai, United Arab Emirates` | Billing Physical/Mailing Address |
| `invoice_title` | `text` | Optional | `e.g. INVOICE` | Invoice PDF Title |
| `invoice_prefix` | `text` | Optional | `e.g. INV` | Invoice Prefix Key |
| `invoice_series_starting` | `number` | Optional | `e.g. 1001` | Invoice Series Start Number |
| `mail_from_address` | `email` | Optional | `noreply@glix.ae` | Mail From Address |
| `mail_from_name` | `text` | Optional | `Connect HR` | Mail From Name |
| `smtp_host` | `text` | Optional | `smtp.mailtrap.io` | SMTP Host |
| `smtp_port` | `number` | Optional | `2525` | SMTP Port |
| `smtp_username` | `text` | Optional | `Enter username` | SMTP Username |
| `smtp_password` | `password` | Optional | `••••••••` | SMTP Password |
| `smtp_test_email` | `email` | Optional | `e.g. admin@example.com` | Standard input |
| `whatsapp_phone_number_id` | `text` | Optional | `e.g. 109823485741029` | WhatsApp Phone Number ID |
| `whatsapp_business_account_id` | `text` | Optional | `e.g. 102938475610293` | WhatsApp Business Account ID |
| `whatsapp_access_token` | `password` | Optional | `EAAG••••••••` | Permanent Access Token |
| `payment_stripe_enabled` | `checkbox` | Optional | `—` | Enable Stripe Method |
| `stripe_publishable_key` | `text` | Optional | `pk_test_...` | Stripe Publishable Key |
| `stripe_secret_key` | `password` | Optional | `sk_test_••••••••` | Stripe Secret Key |
| `payment_paypal_enabled` | `checkbox` | Optional | `—` | Enable PayPal Method |
| `paypal_client_id` | `text` | Optional | `Enter Client ID` | PayPal Client ID |
| `paypal_secret` | `password` | Optional | `Enter Secret` | PayPal Secret Key |
| `pusher_app_id` | `text` | Optional | `Enter App ID` | Pusher App ID |
| `pusher_key` | `text` | Optional | `Enter Key` | Pusher Key |
| `pusher_secret` | `password` | Optional | `Enter Secret` | Pusher Secret |
| `pusher_cluster` | `text` | Optional | `mt1` | Pusher Cluster |
| `google_client_id` | `text` | Optional | `Enter Google Client ID` | Google Client ID |
| `google_client_secret` | `password` | Optional | `Enter Google Client Secret` | Google Client Secret |
| `s3_key` | `text` | Optional | `Enter Access Key` | Access Key ID |
| `s3_secret` | `password` | Optional | `Enter Secret Key` | Secret Access Key |
| `s3_bucket` | `text` | Optional | `Enter Bucket Name` | Bucket Name |
| `s3_region` | `text` | Optional | `us-east-1` | Region |
| `s3_endpoint` | `text` | Optional | `e.g., https://s3.wasabisys.com` | Custom Endpoint (Optional) |
| `bunny_storage_name` | `text` | Optional | `my-bunny-zone` | Storage Zone Name |
| `bunny_api_key` | `password` | Optional | `Enter API Password` | API Access Password |
| `bunny_region` | `text` | Optional | `de` | Region Code (Standard core uses blank / de) |
| `bunny_pull_zone` | `text` | Optional | `https://myzone.b-cdn.net` | Pull Zone CDN URL (Optional) |
| `google_maps_api_key` | `text` | Optional | `AIzaSy...` | Google Maps API Key |
| `pwa_short_name` | `text` | Optional | `Connect` | PWA App Short Name |
| `pwa_theme_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_theme_color` | `text` | Optional | `#0052FF` | Standard input |
| `pwa_bg_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_background_color` | `text` | Optional | `#0b0e14` | Standard input |
| `pwa_icon` | `file` | Optional | `—` | PWA Launcher Icon (512x512 PNG) |
| `allow_registration` | `checkbox` | Optional | `—` | Allow Public Organization Registration |
| `maintenance_mode` | `checkbox` | Optional | `—` | Enable Maintenance Mode |
| `updater_github_repo` | `text` | Optional | `e.g. owner/repository` | GitHub Repository |
| `updater_github_token` | `password` | Optional | `ghp_••••••••••••••••••••` | GitHub Personal Access Token (PAT) |
| `updater_github_branch` | `text` | Optional | `e.g. main` | Target GitHub Branch |
| `updater_current_version` | `text` | Optional | `e.g. 1.0.0` | Current System Version |
| `confirm_text` | `text` | Optional | `Type here...` | Type the confirmation phrase to proceed: |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `base_timezone` | 6 | Asia/Dubai (GST - Gulf Standard Time), UTC (Coordinated Universal Time), Europe/London (GMT/BST), America/New_York (EST/EDT), Asia/Kolkata (IST) |
| `base_currency` | 5 | AED (United Arab Emirates Dirham), USD (United States Dollar), EUR (Euro), GBP (British Pound), INR (Indian Rupee) |
| `mail_mailer` | 3 | Log (Debug / Local Testing), Custom SMTP, Brevo SMTP Relay |
| `smtp_encryption` | 3 | TLS, SSL, None |
| `whatsapp_enabled` | 2 | Disabled, Enabled |
| `stripe_mode` | 2 | Sandbox, Live |
| `paypal_mode` | 2 | Sandbox, Live |
| `broadcast_driver` | 3 | Log (Local Debugging), Pusher, Null (Disabled) |
| `google_login_enabled` | 2 | Disabled, Enabled (OAuth Sandbox) |
| `storage_type` | 3 | Local Server Storage (Default), Amazon Web Services (AWS S3), Bunny.net Storage Zones |
| `map_provider` | 2 | OpenStreetMap (Leaflet - Free / Default), Google Maps (API Key required) |
| `pwa_enabled` | 2 | Disabled, Enabled |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Send Test** | `button` | Form Submit / Modal Toggle / Navigation |
| **Check for Updates** | `button` | Form Submit / Modal Toggle / Navigation |
| **Fetch & Update Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear System Data** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save All Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Erase All Data** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Modals & Dialog Workflows
#### Dialog: Confirm System Reset
- **Fields:** `_token`, `confirm_text`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin settings - PWA Options

- **URL:** `https://connect.rmd.city/public/superadmin/settings`
- **Page Title:** `Glix System Control - System Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-03-settings-tab-9.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-03-settings-tab-9.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `app_name` | `text` | Optional | `Glix Connect HR Portal` | Platform Application Name |
| `central_support_email` | `email` | Optional | `support@glix.ae` | Support Center Email |
| `superadmin_prefix` | `text` | Optional | `superadmin` | Super Admin URL Prefix |
| `brand_color_picker` | `color` | Optional | `—` | Standard input |
| `brand_color` | `text` | Optional | `#f76707` | Standard input |
| `app_logo` | `file` | Optional | `—` | Software Logo (Light Mode / Default) |
| `app_logo_dark` | `file` | Optional | `—` | Software Logo (Dark Mode) |
| `app_favicon` | `file` | Optional | `—` | Software Favicon / Icon |
| `billing_vat` | `number` | Optional | `5.00` | Billing VAT / Tax Percentage (%) |
| `invoice_company_name` | `text` | Optional | `e.g. Connect Portal` | Billing Entity Name / Brand |
| `invoice_company_legal_name` | `text` | Optional | `e.g. Glix Systems Engineering Ltd.` | Billing Entity Legal Name |
| `invoice_company_email` | `email` | Optional | `e.g. support@glix.ae` | Billing Support Email |
| `invoice_company_website` | `text` | Optional | `e.g. edocs.glix.ae` | Billing Website URL |
| `invoice_company_phone` | `text` | Optional | `e.g. +971 4 123 4567` | Billing Phone Number |
| `invoice_company_address` | `textarea` | Optional | `e.g. Dubai, United Arab Emirates` | Billing Physical/Mailing Address |
| `invoice_title` | `text` | Optional | `e.g. INVOICE` | Invoice PDF Title |
| `invoice_prefix` | `text` | Optional | `e.g. INV` | Invoice Prefix Key |
| `invoice_series_starting` | `number` | Optional | `e.g. 1001` | Invoice Series Start Number |
| `mail_from_address` | `email` | Optional | `noreply@glix.ae` | Mail From Address |
| `mail_from_name` | `text` | Optional | `Connect HR` | Mail From Name |
| `smtp_host` | `text` | Optional | `smtp.mailtrap.io` | SMTP Host |
| `smtp_port` | `number` | Optional | `2525` | SMTP Port |
| `smtp_username` | `text` | Optional | `Enter username` | SMTP Username |
| `smtp_password` | `password` | Optional | `••••••••` | SMTP Password |
| `smtp_test_email` | `email` | Optional | `e.g. admin@example.com` | Standard input |
| `whatsapp_phone_number_id` | `text` | Optional | `e.g. 109823485741029` | WhatsApp Phone Number ID |
| `whatsapp_business_account_id` | `text` | Optional | `e.g. 102938475610293` | WhatsApp Business Account ID |
| `whatsapp_access_token` | `password` | Optional | `EAAG••••••••` | Permanent Access Token |
| `payment_stripe_enabled` | `checkbox` | Optional | `—` | Enable Stripe Method |
| `stripe_publishable_key` | `text` | Optional | `pk_test_...` | Stripe Publishable Key |
| `stripe_secret_key` | `password` | Optional | `sk_test_••••••••` | Stripe Secret Key |
| `payment_paypal_enabled` | `checkbox` | Optional | `—` | Enable PayPal Method |
| `paypal_client_id` | `text` | Optional | `Enter Client ID` | PayPal Client ID |
| `paypal_secret` | `password` | Optional | `Enter Secret` | PayPal Secret Key |
| `pusher_app_id` | `text` | Optional | `Enter App ID` | Pusher App ID |
| `pusher_key` | `text` | Optional | `Enter Key` | Pusher Key |
| `pusher_secret` | `password` | Optional | `Enter Secret` | Pusher Secret |
| `pusher_cluster` | `text` | Optional | `mt1` | Pusher Cluster |
| `google_client_id` | `text` | Optional | `Enter Google Client ID` | Google Client ID |
| `google_client_secret` | `password` | Optional | `Enter Google Client Secret` | Google Client Secret |
| `s3_key` | `text` | Optional | `Enter Access Key` | Access Key ID |
| `s3_secret` | `password` | Optional | `Enter Secret Key` | Secret Access Key |
| `s3_bucket` | `text` | Optional | `Enter Bucket Name` | Bucket Name |
| `s3_region` | `text` | Optional | `us-east-1` | Region |
| `s3_endpoint` | `text` | Optional | `e.g., https://s3.wasabisys.com` | Custom Endpoint (Optional) |
| `bunny_storage_name` | `text` | Optional | `my-bunny-zone` | Storage Zone Name |
| `bunny_api_key` | `password` | Optional | `Enter API Password` | API Access Password |
| `bunny_region` | `text` | Optional | `de` | Region Code (Standard core uses blank / de) |
| `bunny_pull_zone` | `text` | Optional | `https://myzone.b-cdn.net` | Pull Zone CDN URL (Optional) |
| `google_maps_api_key` | `text` | Optional | `AIzaSy...` | Google Maps API Key |
| `pwa_short_name` | `text` | Optional | `Connect` | PWA App Short Name |
| `pwa_theme_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_theme_color` | `text` | Optional | `#0052FF` | Standard input |
| `pwa_bg_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_background_color` | `text` | Optional | `#0b0e14` | Standard input |
| `pwa_icon` | `file` | Optional | `—` | PWA Launcher Icon (512x512 PNG) |
| `allow_registration` | `checkbox` | Optional | `—` | Allow Public Organization Registration |
| `maintenance_mode` | `checkbox` | Optional | `—` | Enable Maintenance Mode |
| `updater_github_repo` | `text` | Optional | `e.g. owner/repository` | GitHub Repository |
| `updater_github_token` | `password` | Optional | `ghp_••••••••••••••••••••` | GitHub Personal Access Token (PAT) |
| `updater_github_branch` | `text` | Optional | `e.g. main` | Target GitHub Branch |
| `updater_current_version` | `text` | Optional | `e.g. 1.0.0` | Current System Version |
| `confirm_text` | `text` | Optional | `Type here...` | Type the confirmation phrase to proceed: |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `base_timezone` | 6 | Asia/Dubai (GST - Gulf Standard Time), UTC (Coordinated Universal Time), Europe/London (GMT/BST), America/New_York (EST/EDT), Asia/Kolkata (IST) |
| `base_currency` | 5 | AED (United Arab Emirates Dirham), USD (United States Dollar), EUR (Euro), GBP (British Pound), INR (Indian Rupee) |
| `mail_mailer` | 3 | Log (Debug / Local Testing), Custom SMTP, Brevo SMTP Relay |
| `smtp_encryption` | 3 | TLS, SSL, None |
| `whatsapp_enabled` | 2 | Disabled, Enabled |
| `stripe_mode` | 2 | Sandbox, Live |
| `paypal_mode` | 2 | Sandbox, Live |
| `broadcast_driver` | 3 | Log (Local Debugging), Pusher, Null (Disabled) |
| `google_login_enabled` | 2 | Disabled, Enabled (OAuth Sandbox) |
| `storage_type` | 3 | Local Server Storage (Default), Amazon Web Services (AWS S3), Bunny.net Storage Zones |
| `map_provider` | 2 | OpenStreetMap (Leaflet - Free / Default), Google Maps (API Key required) |
| `pwa_enabled` | 2 | Disabled, Enabled |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Send Test** | `button` | Form Submit / Modal Toggle / Navigation |
| **Check for Updates** | `button` | Form Submit / Modal Toggle / Navigation |
| **Fetch & Update Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear System Data** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save All Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Erase All Data** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Modals & Dialog Workflows
#### Dialog: Confirm System Reset
- **Fields:** `_token`, `confirm_text`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin settings - Security & Updates

- **URL:** `https://connect.rmd.city/public/superadmin/settings`
- **Page Title:** `Glix System Control - System Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-03-settings-tab-10.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-03-settings-tab-10.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `app_name` | `text` | Optional | `Glix Connect HR Portal` | Platform Application Name |
| `central_support_email` | `email` | Optional | `support@glix.ae` | Support Center Email |
| `superadmin_prefix` | `text` | Optional | `superadmin` | Super Admin URL Prefix |
| `brand_color_picker` | `color` | Optional | `—` | Standard input |
| `brand_color` | `text` | Optional | `#f76707` | Standard input |
| `app_logo` | `file` | Optional | `—` | Software Logo (Light Mode / Default) |
| `app_logo_dark` | `file` | Optional | `—` | Software Logo (Dark Mode) |
| `app_favicon` | `file` | Optional | `—` | Software Favicon / Icon |
| `billing_vat` | `number` | Optional | `5.00` | Billing VAT / Tax Percentage (%) |
| `invoice_company_name` | `text` | Optional | `e.g. Connect Portal` | Billing Entity Name / Brand |
| `invoice_company_legal_name` | `text` | Optional | `e.g. Glix Systems Engineering Ltd.` | Billing Entity Legal Name |
| `invoice_company_email` | `email` | Optional | `e.g. support@glix.ae` | Billing Support Email |
| `invoice_company_website` | `text` | Optional | `e.g. edocs.glix.ae` | Billing Website URL |
| `invoice_company_phone` | `text` | Optional | `e.g. +971 4 123 4567` | Billing Phone Number |
| `invoice_company_address` | `textarea` | Optional | `e.g. Dubai, United Arab Emirates` | Billing Physical/Mailing Address |
| `invoice_title` | `text` | Optional | `e.g. INVOICE` | Invoice PDF Title |
| `invoice_prefix` | `text` | Optional | `e.g. INV` | Invoice Prefix Key |
| `invoice_series_starting` | `number` | Optional | `e.g. 1001` | Invoice Series Start Number |
| `mail_from_address` | `email` | Optional | `noreply@glix.ae` | Mail From Address |
| `mail_from_name` | `text` | Optional | `Connect HR` | Mail From Name |
| `smtp_host` | `text` | Optional | `smtp.mailtrap.io` | SMTP Host |
| `smtp_port` | `number` | Optional | `2525` | SMTP Port |
| `smtp_username` | `text` | Optional | `Enter username` | SMTP Username |
| `smtp_password` | `password` | Optional | `••••••••` | SMTP Password |
| `smtp_test_email` | `email` | Optional | `e.g. admin@example.com` | Standard input |
| `whatsapp_phone_number_id` | `text` | Optional | `e.g. 109823485741029` | WhatsApp Phone Number ID |
| `whatsapp_business_account_id` | `text` | Optional | `e.g. 102938475610293` | WhatsApp Business Account ID |
| `whatsapp_access_token` | `password` | Optional | `EAAG••••••••` | Permanent Access Token |
| `payment_stripe_enabled` | `checkbox` | Optional | `—` | Enable Stripe Method |
| `stripe_publishable_key` | `text` | Optional | `pk_test_...` | Stripe Publishable Key |
| `stripe_secret_key` | `password` | Optional | `sk_test_••••••••` | Stripe Secret Key |
| `payment_paypal_enabled` | `checkbox` | Optional | `—` | Enable PayPal Method |
| `paypal_client_id` | `text` | Optional | `Enter Client ID` | PayPal Client ID |
| `paypal_secret` | `password` | Optional | `Enter Secret` | PayPal Secret Key |
| `pusher_app_id` | `text` | Optional | `Enter App ID` | Pusher App ID |
| `pusher_key` | `text` | Optional | `Enter Key` | Pusher Key |
| `pusher_secret` | `password` | Optional | `Enter Secret` | Pusher Secret |
| `pusher_cluster` | `text` | Optional | `mt1` | Pusher Cluster |
| `google_client_id` | `text` | Optional | `Enter Google Client ID` | Google Client ID |
| `google_client_secret` | `password` | Optional | `Enter Google Client Secret` | Google Client Secret |
| `s3_key` | `text` | Optional | `Enter Access Key` | Access Key ID |
| `s3_secret` | `password` | Optional | `Enter Secret Key` | Secret Access Key |
| `s3_bucket` | `text` | Optional | `Enter Bucket Name` | Bucket Name |
| `s3_region` | `text` | Optional | `us-east-1` | Region |
| `s3_endpoint` | `text` | Optional | `e.g., https://s3.wasabisys.com` | Custom Endpoint (Optional) |
| `bunny_storage_name` | `text` | Optional | `my-bunny-zone` | Storage Zone Name |
| `bunny_api_key` | `password` | Optional | `Enter API Password` | API Access Password |
| `bunny_region` | `text` | Optional | `de` | Region Code (Standard core uses blank / de) |
| `bunny_pull_zone` | `text` | Optional | `https://myzone.b-cdn.net` | Pull Zone CDN URL (Optional) |
| `google_maps_api_key` | `text` | Optional | `AIzaSy...` | Google Maps API Key |
| `pwa_short_name` | `text` | Optional | `Connect` | PWA App Short Name |
| `pwa_theme_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_theme_color` | `text` | Optional | `#0052FF` | Standard input |
| `pwa_bg_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_background_color` | `text` | Optional | `#0b0e14` | Standard input |
| `pwa_icon` | `file` | Optional | `—` | PWA Launcher Icon (512x512 PNG) |
| `allow_registration` | `checkbox` | Optional | `—` | Allow Public Organization Registration |
| `maintenance_mode` | `checkbox` | Optional | `—` | Enable Maintenance Mode |
| `updater_github_repo` | `text` | Optional | `e.g. owner/repository` | GitHub Repository |
| `updater_github_token` | `password` | Optional | `ghp_••••••••••••••••••••` | GitHub Personal Access Token (PAT) |
| `updater_github_branch` | `text` | Optional | `e.g. main` | Target GitHub Branch |
| `updater_current_version` | `text` | Optional | `e.g. 1.0.0` | Current System Version |
| `confirm_text` | `text` | Optional | `Type here...` | Type the confirmation phrase to proceed: |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `base_timezone` | 6 | Asia/Dubai (GST - Gulf Standard Time), UTC (Coordinated Universal Time), Europe/London (GMT/BST), America/New_York (EST/EDT), Asia/Kolkata (IST) |
| `base_currency` | 5 | AED (United Arab Emirates Dirham), USD (United States Dollar), EUR (Euro), GBP (British Pound), INR (Indian Rupee) |
| `mail_mailer` | 3 | Log (Debug / Local Testing), Custom SMTP, Brevo SMTP Relay |
| `smtp_encryption` | 3 | TLS, SSL, None |
| `whatsapp_enabled` | 2 | Disabled, Enabled |
| `stripe_mode` | 2 | Sandbox, Live |
| `paypal_mode` | 2 | Sandbox, Live |
| `broadcast_driver` | 3 | Log (Local Debugging), Pusher, Null (Disabled) |
| `google_login_enabled` | 2 | Disabled, Enabled (OAuth Sandbox) |
| `storage_type` | 3 | Local Server Storage (Default), Amazon Web Services (AWS S3), Bunny.net Storage Zones |
| `map_provider` | 2 | OpenStreetMap (Leaflet - Free / Default), Google Maps (API Key required) |
| `pwa_enabled` | 2 | Disabled, Enabled |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Send Test** | `button` | Form Submit / Modal Toggle / Navigation |
| **Check for Updates** | `button` | Form Submit / Modal Toggle / Navigation |
| **Fetch & Update Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear System Data** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save All Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Erase All Data** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Modals & Dialog Workflows
#### Dialog: Confirm System Reset
- **Fields:** `_token`, `confirm_text`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin settings - Danger Zone

- **URL:** `https://connect.rmd.city/public/superadmin/settings`
- **Page Title:** `Glix System Control - System Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-03-settings-tab-11.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-03-settings-tab-11.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `app_name` | `text` | Optional | `Glix Connect HR Portal` | Platform Application Name |
| `central_support_email` | `email` | Optional | `support@glix.ae` | Support Center Email |
| `superadmin_prefix` | `text` | Optional | `superadmin` | Super Admin URL Prefix |
| `brand_color_picker` | `color` | Optional | `—` | Standard input |
| `brand_color` | `text` | Optional | `#f76707` | Standard input |
| `app_logo` | `file` | Optional | `—` | Software Logo (Light Mode / Default) |
| `app_logo_dark` | `file` | Optional | `—` | Software Logo (Dark Mode) |
| `app_favicon` | `file` | Optional | `—` | Software Favicon / Icon |
| `billing_vat` | `number` | Optional | `5.00` | Billing VAT / Tax Percentage (%) |
| `invoice_company_name` | `text` | Optional | `e.g. Connect Portal` | Billing Entity Name / Brand |
| `invoice_company_legal_name` | `text` | Optional | `e.g. Glix Systems Engineering Ltd.` | Billing Entity Legal Name |
| `invoice_company_email` | `email` | Optional | `e.g. support@glix.ae` | Billing Support Email |
| `invoice_company_website` | `text` | Optional | `e.g. edocs.glix.ae` | Billing Website URL |
| `invoice_company_phone` | `text` | Optional | `e.g. +971 4 123 4567` | Billing Phone Number |
| `invoice_company_address` | `textarea` | Optional | `e.g. Dubai, United Arab Emirates` | Billing Physical/Mailing Address |
| `invoice_title` | `text` | Optional | `e.g. INVOICE` | Invoice PDF Title |
| `invoice_prefix` | `text` | Optional | `e.g. INV` | Invoice Prefix Key |
| `invoice_series_starting` | `number` | Optional | `e.g. 1001` | Invoice Series Start Number |
| `mail_from_address` | `email` | Optional | `noreply@glix.ae` | Mail From Address |
| `mail_from_name` | `text` | Optional | `Connect HR` | Mail From Name |
| `smtp_host` | `text` | Optional | `smtp.mailtrap.io` | SMTP Host |
| `smtp_port` | `number` | Optional | `2525` | SMTP Port |
| `smtp_username` | `text` | Optional | `Enter username` | SMTP Username |
| `smtp_password` | `password` | Optional | `••••••••` | SMTP Password |
| `smtp_test_email` | `email` | Optional | `e.g. admin@example.com` | Standard input |
| `whatsapp_phone_number_id` | `text` | Optional | `e.g. 109823485741029` | WhatsApp Phone Number ID |
| `whatsapp_business_account_id` | `text` | Optional | `e.g. 102938475610293` | WhatsApp Business Account ID |
| `whatsapp_access_token` | `password` | Optional | `EAAG••••••••` | Permanent Access Token |
| `payment_stripe_enabled` | `checkbox` | Optional | `—` | Enable Stripe Method |
| `stripe_publishable_key` | `text` | Optional | `pk_test_...` | Stripe Publishable Key |
| `stripe_secret_key` | `password` | Optional | `sk_test_••••••••` | Stripe Secret Key |
| `payment_paypal_enabled` | `checkbox` | Optional | `—` | Enable PayPal Method |
| `paypal_client_id` | `text` | Optional | `Enter Client ID` | PayPal Client ID |
| `paypal_secret` | `password` | Optional | `Enter Secret` | PayPal Secret Key |
| `pusher_app_id` | `text` | Optional | `Enter App ID` | Pusher App ID |
| `pusher_key` | `text` | Optional | `Enter Key` | Pusher Key |
| `pusher_secret` | `password` | Optional | `Enter Secret` | Pusher Secret |
| `pusher_cluster` | `text` | Optional | `mt1` | Pusher Cluster |
| `google_client_id` | `text` | Optional | `Enter Google Client ID` | Google Client ID |
| `google_client_secret` | `password` | Optional | `Enter Google Client Secret` | Google Client Secret |
| `s3_key` | `text` | Optional | `Enter Access Key` | Access Key ID |
| `s3_secret` | `password` | Optional | `Enter Secret Key` | Secret Access Key |
| `s3_bucket` | `text` | Optional | `Enter Bucket Name` | Bucket Name |
| `s3_region` | `text` | Optional | `us-east-1` | Region |
| `s3_endpoint` | `text` | Optional | `e.g., https://s3.wasabisys.com` | Custom Endpoint (Optional) |
| `bunny_storage_name` | `text` | Optional | `my-bunny-zone` | Storage Zone Name |
| `bunny_api_key` | `password` | Optional | `Enter API Password` | API Access Password |
| `bunny_region` | `text` | Optional | `de` | Region Code (Standard core uses blank / de) |
| `bunny_pull_zone` | `text` | Optional | `https://myzone.b-cdn.net` | Pull Zone CDN URL (Optional) |
| `google_maps_api_key` | `text` | Optional | `AIzaSy...` | Google Maps API Key |
| `pwa_short_name` | `text` | Optional | `Connect` | PWA App Short Name |
| `pwa_theme_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_theme_color` | `text` | Optional | `#0052FF` | Standard input |
| `pwa_bg_color_picker` | `color` | Optional | `—` | Standard input |
| `pwa_background_color` | `text` | Optional | `#0b0e14` | Standard input |
| `pwa_icon` | `file` | Optional | `—` | PWA Launcher Icon (512x512 PNG) |
| `allow_registration` | `checkbox` | Optional | `—` | Allow Public Organization Registration |
| `maintenance_mode` | `checkbox` | Optional | `—` | Enable Maintenance Mode |
| `updater_github_repo` | `text` | Optional | `e.g. owner/repository` | GitHub Repository |
| `updater_github_token` | `password` | Optional | `ghp_••••••••••••••••••••` | GitHub Personal Access Token (PAT) |
| `updater_github_branch` | `text` | Optional | `e.g. main` | Target GitHub Branch |
| `updater_current_version` | `text` | Optional | `e.g. 1.0.0` | Current System Version |
| `confirm_text` | `text` | Optional | `Type here...` | Type the confirmation phrase to proceed: |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `base_timezone` | 6 | Asia/Dubai (GST - Gulf Standard Time), UTC (Coordinated Universal Time), Europe/London (GMT/BST), America/New_York (EST/EDT), Asia/Kolkata (IST) |
| `base_currency` | 5 | AED (United Arab Emirates Dirham), USD (United States Dollar), EUR (Euro), GBP (British Pound), INR (Indian Rupee) |
| `mail_mailer` | 3 | Log (Debug / Local Testing), Custom SMTP, Brevo SMTP Relay |
| `smtp_encryption` | 3 | TLS, SSL, None |
| `whatsapp_enabled` | 2 | Disabled, Enabled |
| `stripe_mode` | 2 | Sandbox, Live |
| `paypal_mode` | 2 | Sandbox, Live |
| `broadcast_driver` | 3 | Log (Local Debugging), Pusher, Null (Disabled) |
| `google_login_enabled` | 2 | Disabled, Enabled (OAuth Sandbox) |
| `storage_type` | 3 | Local Server Storage (Default), Amazon Web Services (AWS S3), Bunny.net Storage Zones |
| `map_provider` | 2 | OpenStreetMap (Leaflet - Free / Default), Google Maps (API Key required) |
| `pwa_enabled` | 2 | Disabled, Enabled |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Send Test** | `button` | Form Submit / Modal Toggle / Navigation |
| **Check for Updates** | `button` | Form Submit / Modal Toggle / Navigation |
| **Fetch & Update Now** | `button` | Form Submit / Modal Toggle / Navigation |
| **Clear System Data** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save All Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Erase All Data** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Modals & Dialog Workflows
#### Dialog: Confirm System Reset
- **Fields:** `_token`, `confirm_text`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin dashboard

- **URL:** `https://connect.rmd.city/public/superadmin/dashboard`
- **Page Title:** `Glix System Control - Dashboard`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-04-dashboard.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-04-dashboard.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Organization` | `Slug` | `Limit` | `Registered`
- **Rows Extracted:** 4
- **Columns:** `Tenant` | `Plan` | `Status` | `Started`
- **Rows Extracted:** 4
- **Columns:** `Invoice #` | `Tenant ID` | `Amount` | `Payment Status` | `Method` | `Date` | `Actions`
- **Rows Extracted:** 1

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin organizations

- **URL:** `https://connect.rmd.city/public/superadmin/organizations`
- **Page Title:** `Glix System Control - Organizations`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-05-organizations.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-05-organizations.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `tenant_id` | `hidden` | Optional | `—` | Organization Name |
| `name` | `text` | Optional | `—` | Organization Name |
| `employee_limit` | `number` | Optional | `—` | Employee Limit |
| `name` | `text` | Optional | `e.g. Acme Corporation` | Organization Name |
| `slug` | `text` | Optional | `e.g. acme-corporation` | Slug (Unique identifier) |
| `email` | `email` | Optional | `contact@acme.com` | Email Address |
| `phone` | `text` | Optional | `+971 50 123 4567` | Phone Number |
| `industry` | `text` | Optional | `e.g. Logistics, Technology` | Industry |
| `address` | `textarea` | Optional | `Company address details...` | Address |
| `employee_limit` | `number` | Optional | `—` | Employee Limit |
| `admin_name` | `text` | Optional | `e.g. John Doe` | Admin Full Name |
| `admin_email` | `email` | Optional | `admin@acme.com` | Admin Email Address |
| `admin_password` | `password` | Optional | `Min. 6 characters` | Admin Password |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `status` | 3 | Active (Full Access), Suspended (Blocked Access), Under Maintenance |
| `currency` | 5 | AED (United Arab Emirates Dirham), USD (United States Dollar), EUR (Euro), GBP (British Pound), INR (Indian Rupee) |
| `plan` | 1 | Free Version (Max 5 Emps) |
| `status` | 3 | Active, Suspended, Under Maintenance |
| `status` | 3 | Active (Full Access), Suspended (Blocked Access), Under Maintenance |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Bulk Update Status** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add Organization** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Document Types** | `button` | Form Submit / Modal Toggle / Navigation |
| **View Users** | `button` | Form Submit / Modal Toggle / Navigation |
| **Add User** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Document Types** | `button` | Form Submit / Modal Toggle / Navigation |
| **View Users** | `button` | Form Submit / Modal Toggle / Navigation |
| **Add User** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Document Types** | `button` | Form Submit / Modal Toggle / Navigation |
| **View Users** | `button` | Form Submit / Modal Toggle / Navigation |
| **Add User** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Document Types** | `button` | Form Submit / Modal Toggle / Navigation |
| **View Users** | `button` | Form Submit / Modal Toggle / Navigation |
| **Add User** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Changes** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Create Organization** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Update All Tenants** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `ID` | `Name` | `Slug` | `Employee Limit` | `Status` | `Registered At` | `Actions`
- **Rows Extracted:** 4

### Modals & Dialog Workflows
#### Dialog: Edit Organization Settings
- **Fields:** `_token`, `tenant_id`, `name`, `employee_limit`, `status`
#### Dialog: Add New Organization
- **Fields:** `_token`, `name`, `slug`, `email`, `phone`, `currency`, `industry`, `address`, `employee_limit`, `plan`, `status`, `admin_name`, `admin_email`, `admin_password`
#### Dialog: Bulk Update Tenant Status
- **Fields:** `_token`, `status`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin subscriptions

- **URL:** `https://connect.rmd.city/public/superadmin/subscriptions`
- **Page Title:** `Glix System Control - Subscriptions`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-06-subscriptions.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-06-subscriptions.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `starts_at` | `date` | Optional | `—` | Start Date |
| `ends_at` | `date` | Optional | `—` | End Date |
| `tenant_id` | `hidden` | Optional | `—` | Select Plan |
| `starts_at` | `date` | Optional | `—` | Start Date |
| `ends_at` | `date` | Optional | `—` | End Date |
| `tenant_id` | `hidden` | Optional | `—` | Select Plan to Purchase |
| `tenant_id` | `hidden` | Optional | `—` | Select Plan to Purchase |
| `tenant_id` | `hidden` | Optional | `—` | Select Plan |
| `starts_at` | `date` | Optional | `—` | Start Date |
| `ends_at` | `date` | Optional | `—` | End Date |
| `tenant_id` | `hidden` | Optional | `—` | Select Plan to Purchase |
| `tenant_id` | `hidden` | Optional | `—` | Select Plan to Purchase |
| `tenant_id` | `hidden` | Optional | `—` | Select Plan |
| `starts_at` | `date` | Optional | `—` | Start Date |
| `ends_at` | `date` | Optional | `—` | End Date |
| `tenant_id` | `hidden` | Optional | `—` | Select Plan to Purchase |
| `tenant_id` | `hidden` | Optional | `—` | Select Plan to Purchase |
| `tenant_id` | `hidden` | Optional | `—` | Select Plan |
| `starts_at` | `date` | Optional | `—` | Start Date |
| `ends_at` | `date` | Optional | `—` | End Date |
| `tenant_id` | `hidden` | Optional | `—` | Select Plan to Purchase |
| `tenant_id` | `hidden` | Optional | `—` | Select Plan to Purchase |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `tenant_id` | 5 | -- Choose Tenant --, Apex Tech 04323 (ID: 1), Apex Enterprise 50639 (ID: 2), Apex Enterprise 11076 (ID: 3), Apex Global 70705 (ID: 4) |
| `plan_id` | 2 | -- Choose Plan --, Free Version (0 AED - Max 5 Emps) |
| `status` | 4 | Active, Trialing, Cancelled, Expired |
| `plan_id` | 1 | Free Version (0 AED - Max 5 Emps) |
| `status` | 4 | Active, Trialing, Cancelled, Expired |
| `plan_id` | 1 | Free Version (0.00 AED/mo - Max 5 Emps) |
| `plan_id` | 1 | Free Version (0.00 AED/mo - Max 5 Emps) |
| `plan_id` | 1 | Free Version (0 AED - Max 5 Emps) |
| `status` | 4 | Active, Trialing, Cancelled, Expired |
| `plan_id` | 1 | Free Version (0.00 AED/mo - Max 5 Emps) |
| `plan_id` | 1 | Free Version (0.00 AED/mo - Max 5 Emps) |
| `plan_id` | 1 | Free Version (0 AED - Max 5 Emps) |
| `status` | 4 | Active, Trialing, Cancelled, Expired |
| `plan_id` | 1 | Free Version (0.00 AED/mo - Max 5 Emps) |
| `plan_id` | 1 | Free Version (0.00 AED/mo - Max 5 Emps) |
| `plan_id` | 1 | Free Version (0 AED - Max 5 Emps) |
| `status` | 4 | Active, Trialing, Cancelled, Expired |
| `plan_id` | 1 | Free Version (0.00 AED/mo - Max 5 Emps) |
| `plan_id` | 1 | Free Version (0.00 AED/mo - Max 5 Emps) |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Configure Subscription** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Modify** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Stripe Pay** | `submit` | Form Submit / Modal Toggle / Navigation |
| **PayPal Pay** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Modify** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Stripe Pay** | `submit` | Form Submit / Modal Toggle / Navigation |
| **PayPal Pay** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Modify** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Stripe Pay** | `submit` | Form Submit / Modal Toggle / Navigation |
| **PayPal Pay** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Modify** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Stripe Pay** | `submit` | Form Submit / Modal Toggle / Navigation |
| **PayPal Pay** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Configure Plan** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Update Plan** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Proceed to Checkout** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Proceed to PayPal** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Update Plan** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Proceed to Checkout** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Proceed to PayPal** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Update Plan** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Proceed to Checkout** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Proceed to PayPal** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Update Plan** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Proceed to Checkout** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Proceed to PayPal** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Tenant` | `Current Plan` | `Billing Frequency` | `Starts At` | `Ends At` | `Status` | `Actions`
- **Rows Extracted:** 4

### Modals & Dialog Workflows
#### Dialog: Configure New Subscription
- **Fields:** `_token`, `tenant_id`, `plan_id`, `status`, `starts_at`, `ends_at`
#### Dialog: Modify Subscription - Apex Global 70705
- **Fields:** `_token`, `tenant_id`, `plan_id`, `status`, `starts_at`, `ends_at`
#### Dialog: Stripe Subscription - Apex Global 70705
- **Fields:** `_token`, `tenant_id`, `plan_id`
#### Dialog: PayPal Subscription - Apex Global 70705
- **Fields:** `_token`, `tenant_id`, `plan_id`
#### Dialog: Modify Subscription - Apex Enterprise 11076
- **Fields:** `_token`, `tenant_id`, `plan_id`, `status`, `starts_at`, `ends_at`
#### Dialog: Stripe Subscription - Apex Enterprise 11076
- **Fields:** `_token`, `tenant_id`, `plan_id`
#### Dialog: PayPal Subscription - Apex Enterprise 11076
- **Fields:** `_token`, `tenant_id`, `plan_id`
#### Dialog: Modify Subscription - Apex Enterprise 50639
- **Fields:** `_token`, `tenant_id`, `plan_id`, `status`, `starts_at`, `ends_at`
#### Dialog: Stripe Subscription - Apex Enterprise 50639
- **Fields:** `_token`, `tenant_id`, `plan_id`
#### Dialog: PayPal Subscription - Apex Enterprise 50639
- **Fields:** `_token`, `tenant_id`, `plan_id`
#### Dialog: Modify Subscription - Apex Tech 04323
- **Fields:** `_token`, `tenant_id`, `plan_id`, `status`, `starts_at`, `ends_at`
#### Dialog: Stripe Subscription - Apex Tech 04323
- **Fields:** `_token`, `tenant_id`, `plan_id`
#### Dialog: PayPal Subscription - Apex Tech 04323
- **Fields:** `_token`, `tenant_id`, `plan_id`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin users

- **URL:** `https://connect.rmd.city/public/superadmin/users`
- **Page Title:** `Glix System Control - Users`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-07-users.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-07-users.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `search` | `text` | Optional | `Search by name or email...` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `name` | `text` | Optional | `e.g. Jane Smith` | Full Name |
| `email` | `email` | Optional | `jane@acme.com` | Email Address |
| `password` | `password` | Optional | `Min. 6 characters` | Password |
| `name` | `text` | Optional | `—` | Full Name |
| `email` | `email` | Optional | `—` | Email Address |
| `password` | `password` | Optional | `••••••••` | Password (Leave blank to keep current) |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `tenant_id` | 5 | -- Select Organization --, Apex Enterprise 11076 (Tenant #3), Apex Enterprise 50639 (Tenant #2), Apex Global 70705 (Tenant #4), Apex Tech 04323 (Tenant #1) |
| `role` | 3 | Employee (Standard Portal Access), HR Manager (Manage Staff & Onboarding), Tenant Admin (Full Organization Access) |
| `status` | 2 | Active, Suspended |
| `tenant_id` | 5 | -- Select Organization --, Apex Enterprise 11076 (Tenant #3), Apex Enterprise 50639 (Tenant #2), Apex Global 70705 (Tenant #4), Apex Tech 04323 (Tenant #1) |
| `role` | 3 | Employee (Standard Portal Access), HR Manager (Manage Staff & Onboarding), Tenant Admin (Full Organization Access) |
| `status` | 2 | Active, Suspended |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add User** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Filter** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Edit** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit** | `button` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Add User Account** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Changes** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `ID` | `User` | `Email` | `Organization / Tenant` | `Associated Employee` | `Status` | `Registered At` | `Actions`
- **Rows Extracted:** 4

### Modals & Dialog Workflows
#### Dialog: Add New Platform User
- **Fields:** `_token`, `name`, `email`, `password`, `tenant_id`, `role`, `status`
#### Dialog: Edit User Account
- **Fields:** `_token`, `name`, `email`, `password`, `tenant_id`, `role`, `status`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin team

- **URL:** `https://connect.rmd.city/public/superadmin/team`
- **Page Title:** `Glix System Control - Super Admin Team`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-08-team.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-08-team.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Optional | `Enter full name` | Full Name |
| `email` | `email` | Optional | `superadmin@glix.ae` | Email Address |
| `password` | `password` | Optional | `Min. 6 characters` | Password |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add System Admin** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Create Admin Account** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `ID` | `Name` | `Email` | `Status` | `Created At` | `Actions`
- **Rows Extracted:** 1

### Modals & Dialog Workflows
#### Dialog: Add System Super Administrator
- **Fields:** `_token`, `name`, `email`, `password`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin roles

- **URL:** `https://connect.rmd.city/public/superadmin/roles`
- **Page Title:** `Glix System Control - Roles & Permissions`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-09-roles.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-09-roles.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Role Name` | `Guard Name` | `Created At`
- **Rows Extracted:** 4
- **Columns:** `Permission Name` | `Guard Name`
- **Rows Extracted:** 23

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin invoices

- **URL:** `https://connect.rmd.city/public/superadmin/invoices`
- **Page Title:** `Glix System Control - Invoices`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-10-invoices.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-10-invoices.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `invoice_number` | `text` | Optional | `INV-2026-003` | Invoice Number |
| `amount` | `number` | Optional | `599.00` | Invoice Amount (AED) |
| `payment_method` | `text` | Optional | `Credit Card, Bank Transfer, PayPal...` | Payment Method |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `tenant_id` | 5 | -- Choose Tenant --, Apex Tech 04323 (ID: 1), Apex Enterprise 50639 (ID: 2), Apex Enterprise 11076 (ID: 3), Apex Global 70705 (ID: 4) |
| `status` | 3 | Unpaid, Paid, Refunded |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Record Invoice/Payment** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Record Invoice** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Invoice Number` | `Tenant (Organization)` | `Billing Amount` | `Status` | `Payment Method` | `Payment Date` | `Logged At` | `Actions`
- **Rows Extracted:** 1

### Modals & Dialog Workflows
#### Dialog: Record Invoice / Payment
- **Fields:** `_token`, `invoice_number`, `tenant_id`, `amount`, `status`, `payment_method`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin support

- **URL:** `https://connect.rmd.city/public/superadmin/support`
- **Page Title:** `Glix System Control - Support Tickets`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-11-support.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-11-support.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `subject` | `text` | Optional | `Issue with payroll batch, profile page, etc.` | Subject |
| `description` | `textarea` | Optional | `Detail the issue reported by the customer...` | Detailed Description |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `tenant_id` | 5 | -- Choose Tenant --, Apex Tech 04323 (ID: 1), Apex Enterprise 50639 (ID: 2), Apex Enterprise 11076 (ID: 3), Apex Global 70705 (ID: 4) |
| `status` | 3 | Open, In Progress, Closed |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Log Support Ticket** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Log Ticket** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `ID` | `Tenant (Organization)` | `Subject` | `Description` | `Status` | `Date Logged` | `Actions`
- **Rows Extracted:** 1

### Modals & Dialog Workflows
#### Dialog: Log Support Ticket
- **Fields:** `_token`, `tenant_id`, `subject`, `description`, `status`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin plans

- **URL:** `https://connect.rmd.city/public/superadmin/plans`
- **Page Title:** `Glix System Control - Subscription Plans`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-12-plans.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-12-plans.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `_method` | `hidden` | Optional | `—` | Standard input |
| `plan_id` | `hidden` | Optional | `—` | Plan Name |
| `name` | `text` | Optional | `e.g., Enterprise Premium` | Plan Name |
| `slug` | `text` | Optional | `e.g., enterprise-premium` | Slug |
| `price` | `number` | Optional | `0.00` | Standard input |
| `price_annual` | `number` | Optional | `0.00` | Standard input |
| `employee_limit` | `number` | Optional | `e.g., 50` | Employee Limit |
| `currency` | `text` | Optional | `AED` | Currency |
| `core_features[]` | `checkbox` | Optional | `—` | Employee Directory
                                    Profiles, documents, bank, experience |
| `core_features[]` | `checkbox` | Optional | `—` | Self-Service Portal
                                    Employee personal dashboard login |
| `core_features[]` | `checkbox` | Optional | `—` | Leave Planner
                                    Requests, calendar, entitlements |
| `core_features[]` | `checkbox` | Optional | `—` | Document Automation
                                    Uploads, custom types, expiry alerts |
| `core_features[]` | `checkbox` | Optional | `—` | Multi-Company
                                    Sub-entities & company documents |
| `core_features[]` | `checkbox` | Optional | `—` | Reports & Rosters
                                    Rosters, leaves, custom reports |
| `core_features[]` | `checkbox` | Optional | `—` | WhatsApp Alerts
                                    Automated WhatsApp alerts template |
| `core_features[]` | `checkbox` | Optional | `—` | AWS S3 Integration
                                    Configure S3/BunnyCDN file storage |
| `core_features[]` | `checkbox` | Optional | `—` | Letters Builder
                                    Visa and salary letter certificates |
| `custom_features` | `textarea` | Optional | `e.g.
Custom Domain Branding
Dedicated Database Cluster` | Additional / Custom Features (One per line) |
| `is_private` | `checkbox` | Optional | `—` | Private / Custom Package
                            If enabled, this plan is hidden from the public landing pages, signup forms, and standard tenant self-service subscription panels. It can only be assigned manually by Superadmins. |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `billing_period` | 2 | Monthly, Yearly |
| `status` | 2 | Active (Available for subscription), Inactive (Hidden from public/new users) |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Create Subscription Plan** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Edit** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Plan** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Modals & Dialog Workflows
#### Dialog: Plan Configuration
- **Fields:** `_token`, `plan_id`, `name`, `slug`, `price`, `price_annual`, `employee_limit`, `currency`, `billing_period`, `core_features[]`, `core_features[]`, `core_features[]`, `core_features[]`, `core_features[]`, `core_features[]`, `core_features[]`, `core_features[]`, `core_features[]`, `custom_features`, `is_private`, `status`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin faq

- **URL:** `https://connect.rmd.city/public/superadmin/faq`
- **Page Title:** `Glix System Control - FAQ Manager`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-13-faq.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-13-faq.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `faq_id` | `hidden` | Optional | `—` | Question |
| `question` | `text` | Optional | `e.g., How do I invite new users?` | Question |
| `answer` | `textarea` | Optional | `Provide a detailed, clear answer...` | Answer Text |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `status` | 2 | Active (Visible to public), Inactive (Draft/Hidden) |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add FAQ Entry** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save FAQ Entry** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `ID` | `Question` | `Answer Summary` | `Status` | `Created At` | `Actions`
- **Rows Extracted:** 1

### Modals & Dialog Workflows
#### Dialog: FAQ Details
- **Fields:** `_token`, `faq_id`, `question`, `answer`, `status`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin reviews

- **URL:** `https://connect.rmd.city/public/superadmin/reviews`
- **Page Title:** `Glix System Control - Reviews Manager`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-14-reviews.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-14-reviews.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `review_id` | `hidden` | Optional | `—` | Reviewer Name |
| `reviewer_name` | `text` | Optional | `e.g., Ahmed Al Mansoori` | Reviewer Name |
| `reviewer_role` | `text` | Optional | `e.g., Chief HR Officer` | Reviewer Designation / Role |
| `reviewer_org` | `text` | Optional | `e.g., Dubai Customs` | Reviewer Organization / Company |
| `review_text` | `textarea` | Optional | `Enter the customer testimonial details...` | Review Text |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `rating` | 5 | 5 Stars (Excellent), 4 Stars (Good), 3 Stars (Average), 2 Stars (Poor), 1 Star (Very Poor) |
| `status` | 2 | Active (Visible on landings), Inactive (Hidden/Draft) |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Add Review Entry** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Review** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `ID` | `Reviewer` | `Role & Company` | `Rating` | `Review Content` | `Status` | `Actions`
- **Rows Extracted:** 1

### Modals & Dialog Workflows
#### Dialog: Customer Review Details
- **Fields:** `_token`, `review_id`, `reviewer_name`, `reviewer_role`, `reviewer_org`, `rating`, `review_text`, `status`

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin landing

- **URL:** `https://connect.rmd.city/public/superadmin/landing`
- **Page Title:** `Glix System Control - Landing Page Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-15-landing.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-15-landing.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `landing_hero_badge` | `text` | Optional | `Enter hero badge text` | Hero Badge Tagline |
| `landing_hero_title` | `text` | Optional | `Enter hero title` | Hero Title (Headline) |
| `landing_hero_desc` | `textarea` | Optional | `Enter hero description` | Hero Subtitle / Description |
| `landing_cta_text` | `text` | Optional | `Get Started Now` | Call-To-Action (CTA) Button Text |
| `landing_features_title` | `text` | Optional | `—` | Features Section Heading |
| `landing_features_subtitle` | `text` | Optional | `—` | Features Section Subheading |
| `landing_feature_1_title` | `text` | Optional | `—` | Title |
| `landing_feature_1_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_1_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_2_title` | `text` | Optional | `—` | Title |
| `landing_feature_2_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_2_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_3_title` | `text` | Optional | `—` | Title |
| `landing_feature_3_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_3_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_4_title` | `text` | Optional | `—` | Title |
| `landing_feature_4_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_4_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_5_title` | `text` | Optional | `—` | Title |
| `landing_feature_5_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_5_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_6_title` | `text` | Optional | `—` | Title |
| `landing_feature_6_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_6_desc` | `textarea` | Optional | `—` | Description |
| `landing_pricing_title` | `text` | Optional | `—` | Pricing Section Heading |
| `landing_pricing_subtitle` | `text` | Optional | `—` | Pricing Section Subheading |
| `landing_pricing_slider_title` | `text` | Optional | `—` | Estimator Slider Heading |
| `landing_pricing_slider_subtitle` | `text` | Optional | `—` | Estimator Slider Subheading |
| `landing_reviews_title` | `text` | Optional | `—` | Reviews Section Heading |
| `landing_reviews_subtitle` | `text` | Optional | `—` | Reviews Section Subheading |
| `landing_faqs_title` | `text` | Optional | `—` | FAQs Section Heading |
| `landing_faqs_subtitle` | `text` | Optional | `—` | FAQs Section Subheading |
| `landing_contact_title` | `text` | Optional | `—` | Contact Heading |
| `landing_contact_subtitle` | `text` | Optional | `—` | Contact Subheading |
| `landing_footer_subtitle` | `text` | Optional | `—` | Footer Subtitle / Tagline |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `allow_registration` | 2 | Enabled (Users can register organizations), Disabled (Only Superadmin can add organizations) |
| `landing_show_pricing` | 2 | Visible (Show plans & limits card), Hidden |
| `landing_show_reviews` | 2 | Visible (Loads active reviews), Hidden |
| `landing_show_faqs` | 2 | Visible (Show FAQ accordion), Hidden |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Save Landing Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin landing - Hero & Header

- **URL:** `https://connect.rmd.city/public/superadmin/landing`
- **Page Title:** `Glix System Control - Landing Page Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-15-landing-tab-1.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-15-landing-tab-1.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `landing_hero_badge` | `text` | Optional | `Enter hero badge text` | Hero Badge Tagline |
| `landing_hero_title` | `text` | Optional | `Enter hero title` | Hero Title (Headline) |
| `landing_hero_desc` | `textarea` | Optional | `Enter hero description` | Hero Subtitle / Description |
| `landing_cta_text` | `text` | Optional | `Get Started Now` | Call-To-Action (CTA) Button Text |
| `landing_features_title` | `text` | Optional | `—` | Features Section Heading |
| `landing_features_subtitle` | `text` | Optional | `—` | Features Section Subheading |
| `landing_feature_1_title` | `text` | Optional | `—` | Title |
| `landing_feature_1_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_1_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_2_title` | `text` | Optional | `—` | Title |
| `landing_feature_2_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_2_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_3_title` | `text` | Optional | `—` | Title |
| `landing_feature_3_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_3_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_4_title` | `text` | Optional | `—` | Title |
| `landing_feature_4_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_4_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_5_title` | `text` | Optional | `—` | Title |
| `landing_feature_5_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_5_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_6_title` | `text` | Optional | `—` | Title |
| `landing_feature_6_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_6_desc` | `textarea` | Optional | `—` | Description |
| `landing_pricing_title` | `text` | Optional | `—` | Pricing Section Heading |
| `landing_pricing_subtitle` | `text` | Optional | `—` | Pricing Section Subheading |
| `landing_pricing_slider_title` | `text` | Optional | `—` | Estimator Slider Heading |
| `landing_pricing_slider_subtitle` | `text` | Optional | `—` | Estimator Slider Subheading |
| `landing_reviews_title` | `text` | Optional | `—` | Reviews Section Heading |
| `landing_reviews_subtitle` | `text` | Optional | `—` | Reviews Section Subheading |
| `landing_faqs_title` | `text` | Optional | `—` | FAQs Section Heading |
| `landing_faqs_subtitle` | `text` | Optional | `—` | FAQs Section Subheading |
| `landing_contact_title` | `text` | Optional | `—` | Contact Heading |
| `landing_contact_subtitle` | `text` | Optional | `—` | Contact Subheading |
| `landing_footer_subtitle` | `text` | Optional | `—` | Footer Subtitle / Tagline |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `allow_registration` | 2 | Enabled (Users can register organizations), Disabled (Only Superadmin can add organizations) |
| `landing_show_pricing` | 2 | Visible (Show plans & limits card), Hidden |
| `landing_show_reviews` | 2 | Visible (Loads active reviews), Hidden |
| `landing_show_faqs` | 2 | Visible (Show FAQ accordion), Hidden |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Save Landing Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin landing - Platform Features

- **URL:** `https://connect.rmd.city/public/superadmin/landing`
- **Page Title:** `Glix System Control - Landing Page Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-15-landing-tab-2.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-15-landing-tab-2.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `landing_hero_badge` | `text` | Optional | `Enter hero badge text` | Hero Badge Tagline |
| `landing_hero_title` | `text` | Optional | `Enter hero title` | Hero Title (Headline) |
| `landing_hero_desc` | `textarea` | Optional | `Enter hero description` | Hero Subtitle / Description |
| `landing_cta_text` | `text` | Optional | `Get Started Now` | Call-To-Action (CTA) Button Text |
| `landing_features_title` | `text` | Optional | `—` | Features Section Heading |
| `landing_features_subtitle` | `text` | Optional | `—` | Features Section Subheading |
| `landing_feature_1_title` | `text` | Optional | `—` | Title |
| `landing_feature_1_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_1_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_2_title` | `text` | Optional | `—` | Title |
| `landing_feature_2_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_2_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_3_title` | `text` | Optional | `—` | Title |
| `landing_feature_3_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_3_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_4_title` | `text` | Optional | `—` | Title |
| `landing_feature_4_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_4_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_5_title` | `text` | Optional | `—` | Title |
| `landing_feature_5_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_5_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_6_title` | `text` | Optional | `—` | Title |
| `landing_feature_6_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_6_desc` | `textarea` | Optional | `—` | Description |
| `landing_pricing_title` | `text` | Optional | `—` | Pricing Section Heading |
| `landing_pricing_subtitle` | `text` | Optional | `—` | Pricing Section Subheading |
| `landing_pricing_slider_title` | `text` | Optional | `—` | Estimator Slider Heading |
| `landing_pricing_slider_subtitle` | `text` | Optional | `—` | Estimator Slider Subheading |
| `landing_reviews_title` | `text` | Optional | `—` | Reviews Section Heading |
| `landing_reviews_subtitle` | `text` | Optional | `—` | Reviews Section Subheading |
| `landing_faqs_title` | `text` | Optional | `—` | FAQs Section Heading |
| `landing_faqs_subtitle` | `text` | Optional | `—` | FAQs Section Subheading |
| `landing_contact_title` | `text` | Optional | `—` | Contact Heading |
| `landing_contact_subtitle` | `text` | Optional | `—` | Contact Subheading |
| `landing_footer_subtitle` | `text` | Optional | `—` | Footer Subtitle / Tagline |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `allow_registration` | 2 | Enabled (Users can register organizations), Disabled (Only Superadmin can add organizations) |
| `landing_show_pricing` | 2 | Visible (Show plans & limits card), Hidden |
| `landing_show_reviews` | 2 | Visible (Loads active reviews), Hidden |
| `landing_show_faqs` | 2 | Visible (Show FAQ accordion), Hidden |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Save Landing Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin landing - Pricing & Slider

- **URL:** `https://connect.rmd.city/public/superadmin/landing`
- **Page Title:** `Glix System Control - Landing Page Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-15-landing-tab-3.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-15-landing-tab-3.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `landing_hero_badge` | `text` | Optional | `Enter hero badge text` | Hero Badge Tagline |
| `landing_hero_title` | `text` | Optional | `Enter hero title` | Hero Title (Headline) |
| `landing_hero_desc` | `textarea` | Optional | `Enter hero description` | Hero Subtitle / Description |
| `landing_cta_text` | `text` | Optional | `Get Started Now` | Call-To-Action (CTA) Button Text |
| `landing_features_title` | `text` | Optional | `—` | Features Section Heading |
| `landing_features_subtitle` | `text` | Optional | `—` | Features Section Subheading |
| `landing_feature_1_title` | `text` | Optional | `—` | Title |
| `landing_feature_1_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_1_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_2_title` | `text` | Optional | `—` | Title |
| `landing_feature_2_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_2_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_3_title` | `text` | Optional | `—` | Title |
| `landing_feature_3_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_3_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_4_title` | `text` | Optional | `—` | Title |
| `landing_feature_4_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_4_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_5_title` | `text` | Optional | `—` | Title |
| `landing_feature_5_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_5_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_6_title` | `text` | Optional | `—` | Title |
| `landing_feature_6_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_6_desc` | `textarea` | Optional | `—` | Description |
| `landing_pricing_title` | `text` | Optional | `—` | Pricing Section Heading |
| `landing_pricing_subtitle` | `text` | Optional | `—` | Pricing Section Subheading |
| `landing_pricing_slider_title` | `text` | Optional | `—` | Estimator Slider Heading |
| `landing_pricing_slider_subtitle` | `text` | Optional | `—` | Estimator Slider Subheading |
| `landing_reviews_title` | `text` | Optional | `—` | Reviews Section Heading |
| `landing_reviews_subtitle` | `text` | Optional | `—` | Reviews Section Subheading |
| `landing_faqs_title` | `text` | Optional | `—` | FAQs Section Heading |
| `landing_faqs_subtitle` | `text` | Optional | `—` | FAQs Section Subheading |
| `landing_contact_title` | `text` | Optional | `—` | Contact Heading |
| `landing_contact_subtitle` | `text` | Optional | `—` | Contact Subheading |
| `landing_footer_subtitle` | `text` | Optional | `—` | Footer Subtitle / Tagline |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `allow_registration` | 2 | Enabled (Users can register organizations), Disabled (Only Superadmin can add organizations) |
| `landing_show_pricing` | 2 | Visible (Show plans & limits card), Hidden |
| `landing_show_reviews` | 2 | Visible (Loads active reviews), Hidden |
| `landing_show_faqs` | 2 | Visible (Show FAQ accordion), Hidden |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Save Landing Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin landing - Other Sections & Footer

- **URL:** `https://connect.rmd.city/public/superadmin/landing`
- **Page Title:** `Glix System Control - Landing Page Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-15-landing-tab-4.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-15-landing-tab-4.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `landing_hero_badge` | `text` | Optional | `Enter hero badge text` | Hero Badge Tagline |
| `landing_hero_title` | `text` | Optional | `Enter hero title` | Hero Title (Headline) |
| `landing_hero_desc` | `textarea` | Optional | `Enter hero description` | Hero Subtitle / Description |
| `landing_cta_text` | `text` | Optional | `Get Started Now` | Call-To-Action (CTA) Button Text |
| `landing_features_title` | `text` | Optional | `—` | Features Section Heading |
| `landing_features_subtitle` | `text` | Optional | `—` | Features Section Subheading |
| `landing_feature_1_title` | `text` | Optional | `—` | Title |
| `landing_feature_1_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_1_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_2_title` | `text` | Optional | `—` | Title |
| `landing_feature_2_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_2_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_3_title` | `text` | Optional | `—` | Title |
| `landing_feature_3_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_3_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_4_title` | `text` | Optional | `—` | Title |
| `landing_feature_4_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_4_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_5_title` | `text` | Optional | `—` | Title |
| `landing_feature_5_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_5_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_6_title` | `text` | Optional | `—` | Title |
| `landing_feature_6_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_6_desc` | `textarea` | Optional | `—` | Description |
| `landing_pricing_title` | `text` | Optional | `—` | Pricing Section Heading |
| `landing_pricing_subtitle` | `text` | Optional | `—` | Pricing Section Subheading |
| `landing_pricing_slider_title` | `text` | Optional | `—` | Estimator Slider Heading |
| `landing_pricing_slider_subtitle` | `text` | Optional | `—` | Estimator Slider Subheading |
| `landing_reviews_title` | `text` | Optional | `—` | Reviews Section Heading |
| `landing_reviews_subtitle` | `text` | Optional | `—` | Reviews Section Subheading |
| `landing_faqs_title` | `text` | Optional | `—` | FAQs Section Heading |
| `landing_faqs_subtitle` | `text` | Optional | `—` | FAQs Section Subheading |
| `landing_contact_title` | `text` | Optional | `—` | Contact Heading |
| `landing_contact_subtitle` | `text` | Optional | `—` | Contact Subheading |
| `landing_footer_subtitle` | `text` | Optional | `—` | Footer Subtitle / Tagline |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `allow_registration` | 2 | Enabled (Users can register organizations), Disabled (Only Superadmin can add organizations) |
| `landing_show_pricing` | 2 | Visible (Show plans & limits card), Hidden |
| `landing_show_reviews` | 2 | Visible (Loads active reviews), Hidden |
| `landing_show_faqs` | 2 | Visible (Show FAQ accordion), Hidden |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Save Landing Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin landing - Visibility & Controls

- **URL:** `https://connect.rmd.city/public/superadmin/landing`
- **Page Title:** `Glix System Control - Landing Page Settings`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-15-landing-tab-5.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-15-landing-tab-5.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `landing_hero_badge` | `text` | Optional | `Enter hero badge text` | Hero Badge Tagline |
| `landing_hero_title` | `text` | Optional | `Enter hero title` | Hero Title (Headline) |
| `landing_hero_desc` | `textarea` | Optional | `Enter hero description` | Hero Subtitle / Description |
| `landing_cta_text` | `text` | Optional | `Get Started Now` | Call-To-Action (CTA) Button Text |
| `landing_features_title` | `text` | Optional | `—` | Features Section Heading |
| `landing_features_subtitle` | `text` | Optional | `—` | Features Section Subheading |
| `landing_feature_1_title` | `text` | Optional | `—` | Title |
| `landing_feature_1_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_1_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_2_title` | `text` | Optional | `—` | Title |
| `landing_feature_2_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_2_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_3_title` | `text` | Optional | `—` | Title |
| `landing_feature_3_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_3_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_4_title` | `text` | Optional | `—` | Title |
| `landing_feature_4_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_4_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_5_title` | `text` | Optional | `—` | Title |
| `landing_feature_5_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_5_desc` | `textarea` | Optional | `—` | Description |
| `landing_feature_6_title` | `text` | Optional | `—` | Title |
| `landing_feature_6_icon` | `text` | Optional | `—` | Icon Class (Tabler Icon) |
| `landing_feature_6_desc` | `textarea` | Optional | `—` | Description |
| `landing_pricing_title` | `text` | Optional | `—` | Pricing Section Heading |
| `landing_pricing_subtitle` | `text` | Optional | `—` | Pricing Section Subheading |
| `landing_pricing_slider_title` | `text` | Optional | `—` | Estimator Slider Heading |
| `landing_pricing_slider_subtitle` | `text` | Optional | `—` | Estimator Slider Subheading |
| `landing_reviews_title` | `text` | Optional | `—` | Reviews Section Heading |
| `landing_reviews_subtitle` | `text` | Optional | `—` | Reviews Section Subheading |
| `landing_faqs_title` | `text` | Optional | `—` | FAQs Section Heading |
| `landing_faqs_subtitle` | `text` | Optional | `—` | FAQs Section Subheading |
| `landing_contact_title` | `text` | Optional | `—` | Contact Heading |
| `landing_contact_subtitle` | `text` | Optional | `—` | Contact Subheading |
| `landing_footer_subtitle` | `text` | Optional | `—` | Footer Subtitle / Tagline |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `allow_registration` | 2 | Enabled (Users can register organizations), Disabled (Only Superadmin can add organizations) |
| `landing_show_pricing` | 2 | Visible (Show plans & limits card), Hidden |
| `landing_show_reviews` | 2 | Visible (Loads active reviews), Hidden |
| `landing_show_faqs` | 2 | Visible (Show FAQ accordion), Hidden |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Save Landing Settings** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin policies

- **URL:** `https://connect.rmd.city/public/superadmin/policies`
- **Page Title:** `Glix System Control - Platform Policies`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-16-policies.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-16-policies.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `policy_privacy` | `textarea` | Optional | `Write or paste your Privacy Policy here...` | Policy Content |
| `policy_terms` | `textarea` | Optional | `Write or paste your Terms & Conditions here...` | Terms Content |
| `policy_refund` | `textarea` | Optional | `Write or paste your Refund Policy here...` | Refund Policy Content |
| `policy_other` | `textarea` | Optional | `Write or paste any other policy information or legal disclaimer here...` | Custom Policy Content |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Policies** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin policies - Privacy Policy

- **URL:** `https://connect.rmd.city/public/superadmin/policies`
- **Page Title:** `Glix System Control - Platform Policies`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-16-policies-tab-1.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-16-policies-tab-1.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `policy_privacy` | `textarea` | Optional | `Write or paste your Privacy Policy here...` | Policy Content |
| `policy_terms` | `textarea` | Optional | `Write or paste your Terms & Conditions here...` | Terms Content |
| `policy_refund` | `textarea` | Optional | `Write or paste your Refund Policy here...` | Refund Policy Content |
| `policy_other` | `textarea` | Optional | `Write or paste any other policy information or legal disclaimer here...` | Custom Policy Content |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Policies** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin policies - Terms & Conditions

- **URL:** `https://connect.rmd.city/public/superadmin/policies`
- **Page Title:** `Glix System Control - Platform Policies`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-16-policies-tab-2.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-16-policies-tab-2.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `policy_privacy` | `textarea` | Optional | `Write or paste your Privacy Policy here...` | Policy Content |
| `policy_terms` | `textarea` | Optional | `Write or paste your Terms & Conditions here...` | Terms Content |
| `policy_refund` | `textarea` | Optional | `Write or paste your Refund Policy here...` | Refund Policy Content |
| `policy_other` | `textarea` | Optional | `Write or paste any other policy information or legal disclaimer here...` | Custom Policy Content |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Policies** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin policies - Refund Policy

- **URL:** `https://connect.rmd.city/public/superadmin/policies`
- **Page Title:** `Glix System Control - Platform Policies`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-16-policies-tab-3.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-16-policies-tab-3.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `policy_privacy` | `textarea` | Optional | `Write or paste your Privacy Policy here...` | Policy Content |
| `policy_terms` | `textarea` | Optional | `Write or paste your Terms & Conditions here...` | Terms Content |
| `policy_refund` | `textarea` | Optional | `Write or paste your Refund Policy here...` | Refund Policy Content |
| `policy_other` | `textarea` | Optional | `Write or paste any other policy information or legal disclaimer here...` | Custom Policy Content |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Policies** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin policies - Other Policies

- **URL:** `https://connect.rmd.city/public/superadmin/policies`
- **Page Title:** `Glix System Control - Platform Policies`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-16-policies-tab-4.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-16-policies-tab-4.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `policy_privacy` | `textarea` | Optional | `Write or paste your Privacy Policy here...` | Policy Content |
| `policy_terms` | `textarea` | Optional | `Write or paste your Terms & Conditions here...` | Terms Content |
| `policy_refund` | `textarea` | Optional | `Write or paste your Refund Policy here...` | Refund Policy Content |
| `policy_other` | `textarea` | Optional | `Write or paste any other policy information or legal disclaimer here...` | Custom Policy Content |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Preview Live Page** | `button` | Form Submit / Modal Toggle / Navigation |
| **Save Policies** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin leads

- **URL:** `https://connect.rmd.city/public/superadmin/leads`
- **Page Title:** `Glix System Control - Leads Follow-Up`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-17-leads.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-17-leads.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `search` | `text` | Optional | `Search leads...` | Standard input |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `status` | 5 | All Leads, New Submissions, In Progress, Contacted, Closed / Resolved |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Apply Filters** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Lead Name` | `Email & Phone` | `Subject` | `Submitted Date` | `Status` | `Actions`
- **Rows Extracted:** 1

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin email-templates

- **URL:** `https://connect.rmd.city/public/superadmin/email-templates`
- **Page Title:** `Glix System Control - Email Templates`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-18-email-templates.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-18-email-templates.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Edit Template** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Template** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Template** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Template** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Template** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Template** | `button` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Template Name` | `Email Subject` | `Placeholders Available` | `Last Modified` | `Action`
- **Rows Extracted:** 6

---

## [Super Admin Platform] SuperAdmin Platform Control → Super Admin whatsapp-templates

- **URL:** `https://connect.rmd.city/public/superadmin/whatsapp-templates`
- **Page Title:** `Glix System Control - WhatsApp Templates`
- **Screenshot Path:** [`docs/legacy-analysis/screenshots/superadmin-19-whatsapp-templates.png`](file:///C:/Users/SIBI/Documents/proj/glix/docs/legacy-analysis/screenshots/superadmin-19-whatsapp-templates.png)

### Inputs & Interactive Fields
| Field Name / ID | Input Type | Required | Placeholder | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `text` | Optional | `e.g. Leave Approval Alert` | Template Display Name |
| `template_name` | `text` | Optional | `e.g. leave_approval_alert` | Meta Template Name |
| `key` | `text` | Optional | `e.g. leave_approved` | Application Lookup Key |
| `body` | `textarea` | Optional | `Hello 1, your leave request has been approved. Remarks: 2.` | Template Body Text |

### Dropdowns & Select Controls
| Control Name | Options Count | Sample Options |
| :--- | :--- | :--- |
| `category` | 3 | UTILITY (Transactional notifications), MARKETING (Offers/General engagement), AUTHENTICATION (OTPs/Security codes) |
| `language` | 5 | English (US) - en_US, English - en, Arabic - ar, Hindi - hi, Urdu - ur |

### Action Buttons & Triggers
| Button Text | Type | Action / Interaction |
| :--- | :--- | :--- |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sign Out** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Sync from Meta** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Create Template on Meta** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Template** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Template** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Template** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Template** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Template** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Template** | `button` | Form Submit / Modal Toggle / Navigation |
| **Edit Template** | `button` | Form Submit / Modal Toggle / Navigation |
| **Cancel** | `button` | Form Submit / Modal Toggle / Navigation |
| **Register & POST to Meta** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Not Now** | `submit` | Form Submit / Modal Toggle / Navigation |
| **Install** | `submit` | Form Submit / Modal Toggle / Navigation |

### Table Columns & Data View
- **Columns:** `Template Name` | `Meta Template Name` | `Language` | `Status` | `Placeholders Available` | `Action`
- **Rows Extracted:** 7

### Modals & Dialog Workflows
#### Dialog: Create Template on Meta
- **Fields:** `_token`, `name`, `template_name`, `key`, `category`, `language`, `body`

---

