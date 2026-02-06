# C3 Wizard Application - Complete Business Flow Documentation

## Document Purpose
This document describes the complete business flow for every user action in the C3 Wizard system. It explains what happens when a user interacts with the system, from clicking a button to the final database operation, including all validations, calculations, data transformations, database table structures, and field data types.

**Target Audience**: AI systems or development teams that need to understand the business logic and recreate the same functionality.

---

## Table of Contents

1. [Database Schema Overview](#database-schema-overview)
2. [Company Registration Flow](#1-company-registration-flow)
3. [User Login Flow](#2-user-login-flow)
4. [Add Employee Flow](#3-add-employee-flow)
5. [C3 Generation Flow](#4-c3-generation-flow)
6. [Edit C3 Contribution Flow](#5-edit-c3-contribution-flow)
7. [Submit C3 Flow](#6-submit-c3-flow)
8. [NW Director Payroll Flow](#7-nw-director-payroll-flow)
9. [Payment Processing Flow](#8-payment-processing-flow)
10. [Report Generation Flow](#9-report-generation-flow)
11. [Admin Settings Flow](#10-admin-settings-flow)

---

## Database Schema Overview

### Primary Tables

#### 1. Secuser (User Accounts Table)
**Purpose**: Stores all user accounts with authentication and profile information.

**Primary Key**: `UserId` (INT, IDENTITY)

**Field Structure**:
- **Authentication Fields**:
  - `UserId` (INT, NOT NULL) - Unique user identifier
  - `LoginId` (VARCHAR(50), NULL) - Login username
  - `Password` (VARCHAR(255), NULL) - Encrypted password
  - `EmailId` (VARCHAR(100), NULL) - User email address
  - `IsActive` (BIT, NULL) - Account active status

- **Profile Fields**:
  - `FirstName` (VARCHAR(50), NULL) - User's first name
  - `LastName` (VARCHAR(50), NULL) - User's last name
  - `EmpId` (VARCHAR(20), NULL) - Employee ID
  - `SelfEmpId` (VARCHAR(20), NULL) - Self-employed ID

- **Security Fields**:
  - `RoleId` (INT, NULL) - User's role identifier
  - `LastLoginTime` (DATETIME, NULL) - Last successful login timestamp
  - `IsLoggedIn` (BIT, NULL) - Current login status
  - `UserExpiresOn` (DATETIME, NULL) - Account expiration date
  - `PwdExpiresOn` (DATETIME, NULL) - Password expiration date

#### 2. MasterEmployee (Employee Records Table)
**Purpose**: Stores traditional employee records for employer-managed employees.

**Primary Key**: `EmployeeId` (INT, IDENTITY)

**Field Structure**:
- **Personal Information**:
  - `EmployeeId` (INT, NOT NULL) - Unique employee identifier
  - `EmplCode` (VARCHAR(10), NULL) - Employee code
  - `SocSecNum` (VARCHAR(20), NULL) - Social Security Number
  - `FirstName` (VARCHAR(50), NULL) - Employee first name
  - `LastName` (VARCHAR(50), NULL) - Employee last name
  - `MiddleName` (VARCHAR(50), NULL) - Employee middle name

- **Contact Information**:
  - `Address1` (VARCHAR(100), NULL) - Primary address
  - `Address2` (VARCHAR(100), NULL) - Secondary address
  - `City` (VARCHAR(50), NULL) - City
  - `State` (VARCHAR(50), NULL) - State
  - `Country` (VARCHAR(50), NULL) - Country
  - `Zip` (VARCHAR(10), NULL) - ZIP code
  - `Phone` (VARCHAR(20), NULL) - Phone number
  - `Mobile` (VARCHAR(20), NULL) - Mobile number
  - `Email` (VARCHAR(100), NULL) - Email address

- **Employment Details**:
  - `TypeCode` (VARCHAR(10), NULL) - Employee type code
  - `AppintDate` (DATETIME, NULL) - Appointment date
  - `LastPayDate` (DATETIME, NULL) - Last payment date
  - `WagesPayDate` (DATETIME, NULL) - Wages payment date
  - `BirthDate` (DATETIME, NULL) - Date of birth
  - `Gender` (VARCHAR(10), NULL) - Gender
  - `Tin` (VARCHAR(20), NULL) - Tax Identification Number

- **Company Association**:
  - `CompanyId` (INT, NULL) - Associated company identifier

#### 3. ProcessContribution (Contribution Calculation Table)
**Purpose**: Stores calculated contribution amounts for each employee/contribution period.

**Primary Key**: `ContId` (INT, IDENTITY)

**Field Structure**:
- **Reference Fields**:
  - `ContId` (INT, NOT NULL) - Unique contribution identifier
  - `C3headerid` (INT, NULL) - Associated C3 header identifier
  - `Ssn` (VARCHAR(20), NULL) - Social Security Number
  - `PerioddMonth` (VARCHAR(10), NULL) - Contribution period month
  - `PeriodYear` (VARCHAR(4), NULL) - Contribution period year

- **Wage Information**:
  - `Wages1` (FLOAT, NULL) - Wages for week 1
  - `Wages2` (FLOAT, NULL) - Wages for week 2
  - `Wages3` (FLOAT, NULL) - Wages for week 3
  - `Wages4` (FLOAT, NULL) - Wages for week 4
  - `Wages5` (FLOAT, NULL) - Wages for week 5
  - `Hpay` (FLOAT, NULL) - Holiday pay amount
  - `Bonus` (FLOAT, NULL) - Bonus amount
  - `DirectorWage` (FLOAT, NULL) - Director wage amount

- **Contribution Amounts**:
  - `Levyee` (FLOAT, NULL) - Levy contribution amount
  - `SocialSecurity` (FLOAT, NULL) - Social Security contribution amount

- **Work Period Flags**:
  - `Week1` (BIT, NULL) - Worked in week 1
  - `Week2` (BIT, NULL) - Worked in week 2
  - `Week3` (BIT, NULL) - Worked in week 3
  - `Week4` (BIT, NULL) - Worked in week 4
  - `Week5` (BIT, NULL) - Worked in week 5

- **Additional Fields**:
  - `DateJoining` (DATETIME, NULL) - Employee joining date
  - `PayFreq` (VARCHAR(10), NULL) - Payment frequency

#### 4. ProcessC3header (C3 Header Table)
**Purpose**: Stores header information for C3 contribution forms.

**Primary Key**: `C3headerid` (INT, IDENTITY)

**Field Structure**:
- **Header Information**:
  - `C3headerid` (INT, NOT NULL) - Unique C3 header identifier
  - `CompanyId` (INT, NULL) - Company identifier
  - `MonthName` (VARCHAR(20), NULL) - Month name
  - `Year` (VARCHAR(4), NULL) - Year
  - `Status` (VARCHAR(20), NULL) - C3 status (Draft, Submitted, Paid)

- **Summary Amounts**:
  - `TotalEmployees` (INT, NULL) - Number of employees
  - `TotalWages` (DECIMAL(18,2), NULL) - Total wages
  - `TotalLevy` (DECIMAL(18,2), NULL) - Total levy amount
  - `TotalSS` (DECIMAL(18,2), NULL) - Total social security amount

- **Audit Fields**:
  - `CreatedBy` (INT, NULL) - User who created
  - `CreatedDate` (DATETIME, NULL) - Creation timestamp
  - `ModifiedBy` (INT, NULL) - User who last modified
  - `ModifiedDate` (DATETIME, NULL) - Last modification timestamp
  - `SubmittedBy` (INT, NULL) - User who submitted
  - `SubmittedDate` (DATETIME, NULL) - Submission timestamp

#### 5. OnlinePayments (Payment Records Table)
**Purpose**: Stores payment transaction records from online payment gateways.

**Primary Key**: `PaymentId` (INT, IDENTITY)

**Field Structure**:
- **Payment Information**:
  - `PaymentId` (INT, NOT NULL) - Unique payment identifier
  - `CompanyId` (INT, NULL) - Company identifier
  - `Amount` (DECIMAL(18,2), NULL) - Payment amount
  - `PaymentDate` (DATETIME, NULL) - Payment completion timestamp

- **Gateway Details**:
  - `GatewayName` (VARCHAR(50), NULL) - Payment gateway used
  - `TransactionId` (VARCHAR(100), NULL) - Gateway transaction identifier
  - `Status` (VARCHAR(20), NULL) - Payment status

- **Reference Fields**:
  - `C3HeaderId` (INT, NULL) - Associated C3 header
  - `CreatedBy` (INT, NULL) - User who initiated payment

---

## 1. Company Registration Flow

### Business Purpose
When a new company wants to register in the C3 Wizard system, they must provide company information and create an employer account. The system validates the company details, creates the company record, and sets up the employer user account.

### Step-by-Step Flow

1. **User Accesses Registration Page**
   - User navigates to company registration page
   - System displays registration form with:
     - Company Information: Company Name, Registration Number, Address
     - Employer Details: Name, Email, Phone
     - Account Details: Username, Password

2. **Form Validation (Client-Side)**
   - System validates required fields
   - Email format validation
   - Password strength requirements
   - Company registration number format

3. **Form Submission**
   - User clicks "Register Company" button
   - System sends POST request to `/api/Auth/RegisterCompanyNew` with form data

4. **Server-Side Validation**
   - System validates company registration number uniqueness
   - Checks email uniqueness in Secuser table
   - Validates username uniqueness
   - Ensures password meets complexity requirements

5. **Company Record Creation**
   - System creates company record in MasterCompany table
   - Generates unique CompanyId

6. **User Account Creation**
   - System inserts new record into Secuser table:
     ```sql
     INSERT INTO Secuser (
         LoginId, Password, EmailId, FirstName, LastName,
         EmpId, RoleId, IsActive, InsertedOn
     ) VALUES (
         @LoginId, @EncryptedPassword, @EmailId, @FirstName, @LastName,
         @EmpId, @EmployerRoleId, 1, GETDATE()
     )
     ```

7. **Email Verification**
   - System sends verification email
   - User must verify email before full access

8. **Response to User**
   - System returns success message
   - User is redirected to login page

### Business Rules
- Company registration numbers must be unique
- Employers get specific role permissions
- Email verification required for account activation
- Company records are created before user accounts

---

## 2. User Login Flow

### Business Purpose
When an existing user wants to access the C3 Wizard system, they must provide valid credentials. The system authenticates the user and loads their permissions and company context.

### Step-by-Step Flow

1. **User Accesses Login Page**
   - User enters LoginId and Password
   - System validates input format

2. **Authentication**
   - System queries Secuser table:
     ```sql
     SELECT * FROM Secuser WHERE LoginId = @LoginId AND IsActive = 1
     ```

3. **Password Verification**
   - System decrypts stored password
   - Compares with provided password

4. **Permission Loading**
   - System loads user role from Secrole table
   - Retrieves permissions from SecuserModule and UserPermission tables
   - Loads company context if employer

5. **Session Creation**
   - System updates LastLoginTime
   - Sets IsLoggedIn flag
   - Stores user context in session/localStorage

6. **Dashboard Redirect**
   - User redirected to dashboard
   - System loads company-specific data

### Business Rules
- Accounts must be active and not expired
- Passwords expire after set period
- Login attempts are tracked
- Users can only access their company's data

---

## 3. Add Employee Flow

### Business Purpose
When an employer wants to add a new employee to their company, they must provide complete employee information including SSN, personal details, and employment information.

### Step-by-Step Flow

1. **User Accesses Add Employee Page**
   - Employer navigates to employee management
   - System displays employee form with personal, contact, and employment fields

2. **Form Validation**
   - Client-side validation for required fields
   - SSN format validation
   - Email format validation

3. **SSN Uniqueness Check**
   - System sends request to check SSN uniqueness within company
   - API queries MasterEmployee table:
     ```sql
     SELECT COUNT(*) FROM MasterEmployee 
     WHERE SocSecNum = @SSN AND CompanyId = @CompanyId AND Isactive = 1
     ```

4. **Employee Creation**
   - If SSN unique, system calls `/api/C3/SaveEmployee`
   - API inserts into MasterEmployee table:
     ```sql
     INSERT INTO MasterEmployee (
         EmplCode, SocSecNum, FirstName, LastName, MiddleName,
         BirthDate, Gender, Address1, Address2, City, State,
         Country, Zip, Phone, Mobile, Email, Tin, TypeCode,
         AppintDate, CompanyId, Isactive
     ) VALUES (
         @GeneratedCode, @SocSecNum, @FirstName, @LastName, @MiddleName,
         @BirthDate, @Gender, @Address1, @Address2, @City, @State,
         @Country, @Zip, @Phone, @Mobile, @Email, @Tin, @TypeCode,
         @AppintDate, @CompanyId, 1
     )
     ```

5. **Audit Logging**
   - System logs employee creation in audit tables

6. **Response**
   - Success message displayed
   - Employee list refreshed

### Business Rules
- SSN must be unique within each company
- Employee codes auto-generated
- All employees linked to specific company
- Soft delete used for employee removal

---

## 4. C3 Generation Flow

### Business Purpose
Employers generate C3 contribution forms for their employees. The system calculates contributions based on wages, work periods, and applicable rates.

### Step-by-Step Flow

1. **Access C3 Generation**
   - Employer selects month and year for contribution
   - System displays C3 generation interface

2. **Employee Selection**
   - System loads active employees for the company
   - Employer selects employees to include

3. **Wage Data Entry**
   - For each employee, enter wages for each week
   - Specify work periods (Week1-Week5 flags)
   - Enter holiday pay, bonus amounts

4. **Contribution Calculation**
   - System calculates for each employee:
     - Social Security: Based on total wages × SS rate
     - Levy: Based on wages × levy rate
   - Uses current rates from system settings

5. **C3 Header Creation**
   - System creates ProcessC3header record:
     ```sql
     INSERT INTO ProcessC3header (
         CompanyId, MonthName, Year, Status, TotalEmployees,
         TotalWages, TotalLevy, TotalSS, CreatedBy, CreatedDate
     ) VALUES (
         @CompanyId, @Month, @Year, 'Draft', @EmpCount,
         @TotalWages, @TotalLevy, @TotalSS, @UserId, GETDATE()
     )
     ```

6. **Contribution Records**
   - System creates ProcessContribution records for each employee
   - Links to C3 header via C3headerid

7. **Draft Saving**
   - All data saved as draft status
   - Can be edited before submission

### Business Rules
- C3 forms generated monthly
- Calculations based on actual wages paid
- Work period flags determine contribution weeks
- Draft status allows editing

---

## 5. Edit C3 Contribution Flow

### Business Purpose
Employers can modify C3 contribution data before submission. The system allows editing wages, work periods, and recalculates contributions.

### Step-by-Step Flow

1. **Select C3 for Editing**
   - Employer selects draft C3 from list
   - System loads existing contribution data

2. **Data Modification**
   - User modifies wages, work periods, bonus amounts
   - System validates input changes

3. **Recalculation**
   - System recalculates contributions based on changes
   - Updates ProcessContribution records

4. **Header Update**
   - System updates ProcessC3header totals
   - Maintains audit trail of changes

### Business Rules
- Only draft C3 forms can be edited
- All changes trigger recalculation
- Audit trail maintained for compliance

---

## 6. Submit C3 Flow

### Business Purpose
After reviewing and finalizing C3 contribution data, employers submit the form for processing. The system locks the data and prepares for payment.

### Step-by-Step Flow

1. **C3 Review**
   - Employer reviews all contribution data
   - System displays summary totals

2. **Final Validation**
   - System validates all required data present
   - Checks calculations are correct

3. **Status Update**
   - System updates ProcessC3header status to 'Submitted'
   - Sets SubmittedBy and SubmittedDate

4. **Data Locking**
   - Contribution records locked from editing
   - ProcessContribution records marked as submitted

5. **Notification**
   - System sends confirmation to employer
   - Prepares payment workflow

### Business Rules
- Submitted C3 cannot be modified
- Triggers payment process initiation
- Audit trail for submission event

---

## 7. NW Director Payroll Flow

### Business Purpose
For non-working directors, the system processes payroll contributions separately from regular employees.

### Step-by-Step Flow

1. **Director Selection**
   - Employer identifies non-working directors
   - System loads director information

2. **Wage Calculation**
   - Directors have fixed or calculated wages
   - System applies director-specific rates

3. **Contribution Processing**
   - Similar to employee contributions but director-specific
   - Uses DirectorWage field in calculations

4. **Separate Tracking**
   - Directors tracked separately from regular employees
   - Different reporting requirements

### Business Rules
- Directors have different contribution rules
- Separate processing from employee payroll
- Specific reporting requirements

---

## 8. Payment Processing Flow

### Business Purpose
After C3 submission, employers process payments for calculated contributions through integrated payment gateways.

### Step-by-Step Flow

1. **Payment Initiation**
   - Employer selects submitted C3
   - Clicks payment button

2. **Amount Calculation**
   - System sums total contributions (SS + Levy)
   - Displays payment amount

3. **Gateway Selection**
   - User selects payment method (PayPal, CyberSource, etc.)
   - System initiates gateway transaction

4. **Payment Processing**
   - Gateway processes payment
   - System receives callback/webhook

5. **Payment Recording**
   - System creates OnlinePayments record:
     ```sql
     INSERT INTO OnlinePayments (
         CompanyId, C3HeaderId, Amount, GatewayName,
         TransactionId, Status, PaymentDate, CreatedBy
     ) VALUES (
         @CompanyId, @C3HeaderId, @Amount, @Gateway,
         @TxnId, 'Completed', GETDATE(), @UserId
     )
     ```

6. **Status Update**
   - Updates ProcessC3header status to 'Paid'
   - Links payment to C3 record

### Business Rules
- Payments must match calculated amounts
- Multiple gateway support
- Payment status tracked for reconciliation

---

## 9. Report Generation Flow

### Business Purpose
Users generate various reports for compliance, auditing, and business intelligence purposes.

### Step-by-Step Flow

1. **Report Selection**
   - User selects report type (C3 summary, employee list, etc.)
   - Specifies date range and filters

2. **Data Query**
   - System queries relevant tables
   - Applies company and permission filters

3. **Data Processing**
   - Aggregates data as needed
   - Formats for display

4. **Export Options**
   - PDF generation for official reports
   - Excel export for data analysis
   - Print-friendly formatting

### Business Rules
- Reports respect user permissions
- Company data isolation maintained
- Audit logging for report access

---

## 10. Admin Settings Flow

### Business Purpose
Administrators configure system-wide settings including contribution rates, payment gateways, and user permissions.

### Step-by-Step Flow

1. **Settings Access**
   - Admin navigates to settings section
   - System loads current configuration

2. **Rate Configuration**
   - Admin updates SS rates, levy rates
   - Sets effective dates for changes

3. **System Configuration**
   - Updates gateway settings
   - Configures email templates

4. **Validation and Saving**
   - System validates configuration
   - Updates database settings
   - Logs configuration changes

### Business Rules
- Rate changes have effective dates
- Configuration changes audited
- Some changes require system restart

---

This documentation provides a complete business flow reference for the C3 Wizard application, specifically tailored to the St. Kitts and Nevis self-employed contribution management system.

---

## Database Schema Overview

### Primary Tables

#### 1. SecUser (User Accounts Table)
**Purpose**: Stores all user accounts with authentication and profile information.

**Primary Key**: `UserId` (INT, IDENTITY)

**Field Structure**:
- **Authentication Fields**:
  - `UserId` (INT, NOT NULL) - Unique user identifier
  - `UserName` (VARCHAR(50), NULL) - Login username
  - `PasswordHash` (VARCHAR(255), NULL) - Hashed password
  - `Email` (VARCHAR(100), NULL) - User email address
  - `IsActive` (BIT, NULL) - Account active status

- **Profile Fields**:
  - `FirstName` (VARCHAR(50), NULL) - User's first name
  - `LastName` (VARCHAR(50), NULL) - User's last name
  - `Phone` (VARCHAR(20), NULL) - Contact phone number
  - `CompanyId` (INT, NULL) - Associated company identifier

- **Security Fields**:
  - `RoleId` (INT, NULL) - User's role identifier
  - `LastLoginDate` (DATETIME, NULL) - Last successful login timestamp
  - `FailedLoginAttempts` (INT, NULL) - Count of failed login attempts
  - `LockoutEndDate` (DATETIME, NULL) - Account lockout expiration

#### 2. MasterEmployee (Employee Records Table)
**Purpose**: Stores traditional employee records for employer-managed employees.

**Primary Key**: `EmployeeId` (INT, IDENTITY)

**Field Structure**:
- **Personal Information**:
  - `EmployeeId` (INT, NOT NULL) - Unique employee identifier
  - `EmplCode` (VARCHAR(10), NULL) - Employee code
  - `SocSecNum` (VARCHAR(20), NULL) - Social Security Number
  - `FirstName` (VARCHAR(50), NULL) - Employee first name
  - `LastName` (VARCHAR(50), NULL) - Employee last name
  - `MiddleName` (VARCHAR(50), NULL) - Employee middle name

- **Contact Information**:
  - `Address1` (VARCHAR(100), NULL) - Primary address
  - `Address2` (VARCHAR(100), NULL) - Secondary address
  - `City` (VARCHAR(50), NULL) - City
  - `State` (VARCHAR(50), NULL) - State
  - `Country` (VARCHAR(50), NULL) - Country
  - `Zip` (VARCHAR(10), NULL) - ZIP code
  - `Phone` (VARCHAR(20), NULL) - Phone number
  - `Mobile` (VARCHAR(20), NULL) - Mobile number
  - `Email` (VARCHAR(100), NULL) - Email address

- **Employment Details**:
  - `TypeCode` (VARCHAR(10), NULL) - Employee type code
  - `AppintDate` (DATETIME, NULL) - Appointment date
  - `LastPayDate` (DATETIME, NULL) - Last payment date
  - `WagesPayDate` (DATETIME, NULL) - Wages payment date
  - `BirthDate` (DATETIME, NULL) - Date of birth
  - `Gender` (VARCHAR(10), NULL) - Gender
  - `Tin` (VARCHAR(20), NULL) - Tax Identification Number

- **Company Association**:
  - `CompanyId` (INT, NULL) - Associated company identifier

#### 3. SelfEmployee (Self-Employed Records Table)
**Purpose**: Stores self-employed individual records.

**Primary Key**: `EmployeeId` (INT, IDENTITY)

**Field Structure**:
- **Personal Information**: (Same as MasterEmployee)
  - `EmployeeId` (INT, NOT NULL)
  - `EmplCode` (VARCHAR(10), NULL)
  - `SocSecNum` (VARCHAR(20), NULL)
  - `FirstName` (VARCHAR(50), NULL)
  - `LastName` (VARCHAR(50), NULL)
  - `MiddleName` (VARCHAR(50), NULL)

- **Contact Information**: (Same as MasterEmployee)
  - `Address1` (VARCHAR(100), NULL)
  - `Address2` (VARCHAR(100), NULL)
  - `City` (VARCHAR(50), NULL)
  - `State` (VARCHAR(50), NULL)
  - `Country` (VARCHAR(50), NULL)
  - `Zip` (VARCHAR(10), NULL)
  - `Phone` (VARCHAR(20), NULL)
  - `Mobile` (VARCHAR(20), NULL)
  - `Email` (VARCHAR(100), NULL)

- **Self-Employment Details**:
  - `CategoryType` (INT, NULL) - Self-employment category
  - `AppintDate` (DATETIME, NULL) - Registration date
  - `LastPayDate` (DATETIME, NULL) - Last contribution payment date
  - `Terminated` (DATETIME, NULL) - Termination date if applicable
  - `BirthDate` (DATETIME, NULL) - Date of birth
  - `Gender` (VARCHAR(10), NULL) - Gender
  - `Tin` (VARCHAR(20), NULL) - Tax Identification Number

#### 4. PayrollProcessHeader (Payroll Batch Header Table)
**Purpose**: Stores header information for payroll processing batches.

**Primary Key**: `PayrollId` (INT, IDENTITY)

**Field Structure**:
- **Batch Information**:
  - `PayrollId` (INT, NOT NULL) - Unique payroll batch identifier
  - `CompanyId` (INT, NULL) - Company identifier
  - `PayrollPeriod` (DATETIME, NULL) - Payroll period start date
  - `PayrollEndDate` (DATETIME, NULL) - Payroll period end date
  - `Status` (VARCHAR(20), NULL) - Batch status (Draft, Submitted, Processed, Paid)

- **Summary Amounts**:
  - `TotalEmployees` (INT, NULL) - Number of employees in batch
  - `TotalWages` (DECIMAL(18,2), NULL) - Total wages amount
  - `TotalDeductions` (DECIMAL(18,2), NULL) - Total deductions amount
  - `TotalNetPay` (DECIMAL(18,2), NULL) - Total net pay amount

- **Audit Fields**:
  - `CreatedBy` (INT, NULL) - User who created the batch
  - `CreatedDate` (DATETIME, NULL) - Creation timestamp
  - `ModifiedBy` (INT, NULL) - User who last modified
  - `ModifiedDate` (DATETIME, NULL) - Last modification timestamp
  - `SubmittedBy` (INT, NULL) - User who submitted for processing
  - `SubmittedDate` (DATETIME, NULL) - Submission timestamp

#### 5. ProcessContribution (Contribution Calculation Table)
**Purpose**: Stores calculated contribution amounts for each employee/payroll period.

**Primary Key**: `ContributionId` (INT, IDENTITY)

**Field Structure**:
- **Reference Fields**:
  - `ContributionId` (INT, NOT NULL) - Unique contribution identifier
  - `EmployeeId` (INT, NULL) - Employee identifier
  - `PayrollId` (INT, NULL) - Associated payroll batch
  - `CompanyId` (INT, NULL) - Company identifier
  - `Period` (DATETIME, NULL) - Contribution period

- **Contribution Amounts**:
  - `EmployeeSS` (DECIMAL(18,2), NULL) - Employee Social Security contribution
  - `EmployerSS` (DECIMAL(18,2), NULL) - Employer Social Security contribution
  - `EmployeeEI` (DECIMAL(18,2), NULL) - Employee Employment Insurance
  - `EmployerEI` (DECIMAL(18,2), NULL) - Employer Employment Insurance
  - `SeverancePay` (DECIMAL(18,2), NULL) - Severance pay contribution
  - `LevyAmount` (DECIMAL(18,2), NULL) - Levy amount
  - `TotalContribution` (DECIMAL(18,2), NULL) - Total contribution amount

- **Calculation Metadata**:
  - `RateSS` (DECIMAL(5,4), NULL) - Social Security rate used
  - `RateEI` (DECIMAL(5,4), NULL) - Employment Insurance rate used
  - `WageBase` (DECIMAL(18,2), NULL) - Wage amount used for calculation
  - `CalculationDate` (DATETIME, NULL) - When calculation was performed

#### 6. OnlinePayments (Payment Records Table)
**Purpose**: Stores payment transaction records from online payment gateways.

**Primary Key**: `PaymentId` (INT, IDENTITY)

**Field Structure**:
- **Payment Information**:
  - `PaymentId` (INT, NOT NULL) - Unique payment identifier
  - `PayrollId` (INT, NULL) - Associated payroll batch
  - `CompanyId` (INT, NULL) - Company identifier
  - `Amount` (DECIMAL(18,2), NULL) - Payment amount
  - `Currency` (VARCHAR(3), NULL) - Payment currency (default: USD)

- **Gateway Details**:
  - `GatewayName` (VARCHAR(50), NULL) - Payment gateway used (PayPal, CyberSource)
  - `TransactionId` (VARCHAR(100), NULL) - Gateway transaction identifier
  - `GatewayResponse` (TEXT, NULL) - Raw gateway response data

- **Status Tracking**:
  - `Status` (VARCHAR(20), NULL) - Payment status (Pending, Completed, Failed, Refunded)
  - `PaymentDate` (DATETIME, NULL) - Payment completion timestamp
  - `FailureReason` (VARCHAR(500), NULL) - Failure reason if applicable

- **Audit Fields**:
  - `CreatedBy` (INT, NULL) - User who initiated payment
  - `CreatedDate` (DATETIME, NULL) - Payment initiation timestamp

---

## 1. User Registration Flow

### Business Purpose
When a new user wants to create an account in the C3 Wizard system, they must provide their personal information, company details (if applicable), and set up security credentials. The system validates the information, creates the user account, and sends a verification email.

### Step-by-Step Flow

1. **User Accesses Registration Page**
   - User navigates to the registration page
   - System displays registration form with fields for:
     - Personal Information: First Name, Last Name, Email, Phone
     - Account Details: Username, Password, Confirm Password
     - Company Information: Company Name, Registration Number (if employer)
     - User Type: Employer, Self-Employed, Administrator

2. **Form Validation (Client-Side)**
   - System validates required fields are filled
   - Email format validation
   - Password strength requirements (minimum 8 characters, special characters)
   - Password confirmation matching
   - Username uniqueness check (AJAX call to backend)

3. **Form Submission**
   - User clicks "Register" button
   - System sends POST request to `/api/Auth/Register` with form data

4. **Server-Side Validation**
   - System validates all input data:
     - Email format and uniqueness in SecUser table
     - Username uniqueness in SecUser table
     - Password meets complexity requirements
     - Required fields are present
   - If validation fails, return error messages to user

5. **Duplicate Check**
   - System queries SecUser table:
     ```sql
     SELECT COUNT(*) FROM SecUser WHERE Email = @Email OR UserName = @UserName
     ```
   - If duplicates found, return "Email/Username already exists" error

6. **Password Hashing**
   - System generates salt
   - Hashes password using bcrypt algorithm
   - Stores hash and salt for later verification

7. **User Account Creation**
   - System inserts new record into SecUser table:
     ```sql
     INSERT INTO SecUser (
         UserName, PasswordHash, Email, FirstName, LastName, 
         Phone, IsActive, RoleId, CreatedDate
     ) VALUES (
         @UserName, @PasswordHash, @Email, @FirstName, @LastName,
         @Phone, 0, @DefaultRoleId, GETDATE()
     )
     ```
   - IsActive set to 0 (inactive) until email verification

8. **Email Verification Setup**
   - System generates unique verification token
   - Stores token in temporary storage or database
   - Sends verification email to user's email address
   - Email contains clickable link with token

9. **Response to User**
   - System returns success message: "Registration successful. Please check your email to verify your account."
   - User is redirected to login page

10. **Email Verification Process**
    - User clicks verification link in email
    - System validates token
    - Updates SecUser.IsActive to 1
    - User can now login

### Business Rules
- All users must verify email before account activation
- Usernames must be unique across the system
- Email addresses must be unique across the system
- Passwords must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
- Self-employed users get default role, employers get employer role
- Administrators are created by existing admins only

### Error Scenarios
- Duplicate email/username: "This email/username is already registered"
- Invalid email format: "Please enter a valid email address"
- Weak password: "Password must meet complexity requirements"
- Server error: "Registration failed. Please try again later"

---

## 2. User Login Flow

### Business Purpose
When an existing user wants to access the C3 Wizard system, they must provide valid credentials. The system authenticates the user, generates a JWT token, and grants access based on their role permissions.

### Step-by-Step Flow

1. **User Accesses Login Page**
   - User navigates to login page
   - System displays login form with:
     - Username or Email field
     - Password field
     - "Remember Me" checkbox
     - "Forgot Password" link

2. **Form Validation (Client-Side)**
   - System validates username/email and password are entered
   - Basic format validation for email if email is used

3. **Form Submission**
   - User clicks "Login" button
   - System sends POST request to `/api/Auth/Login` with credentials

4. **Server-Side Authentication**
   - System queries SecUser table to find user:
     ```sql
     SELECT * FROM SecUser WHERE (UserName = @Input OR Email = @Input) AND IsActive = 1
     ```
   - If user not found, return "Invalid credentials" error

5. **Password Verification**
   - System retrieves stored password hash and salt
   - Hashes provided password with same salt
   - Compares hashes
   - If mismatch, increment FailedLoginAttempts and return "Invalid credentials"

6. **Account Lockout Check**
   - If FailedLoginAttempts >= 5, check LockoutEndDate
   - If lockout still active, return "Account locked. Try again later"
   - If lockout expired, reset FailedLoginAttempts to 0

7. **Role and Permissions Loading**
   - System retrieves user's role from SecRole table
   - Loads associated permissions from SecUserModule and UserPermission tables
   - Builds user permission set for frontend

8. **JWT Token Generation**
   - System creates JWT payload with:
     - UserId
     - UserName
     - Email
     - RoleId
     - Permissions array
     - Issued timestamp
     - Expiration timestamp (24 hours)
   - Signs token with secret key

9. **Login Audit Logging**
   - System inserts record into LoginLog table:
     ```sql
     INSERT INTO LoginLog (UserId, LoginDate, IpAddress, UserAgent, Success)
     VALUES (@UserId, GETDATE(), @ClientIP, @UserAgent, 1)
     ```

10. **Update Last Login**
    - System updates SecUser.LastLoginDate:
       ```sql
       UPDATE SecUser SET LastLoginDate = GETDATE() WHERE UserId = @UserId
       ```

11. **Response to User**
    - System returns JWT token and user profile data
    - Frontend stores token in localStorage
    - User is redirected to dashboard

### Business Rules
- Accounts must be active (IsActive = 1) to login
- Failed login attempts are tracked and lock account after 5 failures
- Lockout duration is 30 minutes
- JWT tokens expire after 24 hours
- Successful logins reset failed attempt counter
- Login attempts are logged for security auditing

### Error Scenarios
- Invalid credentials: "Invalid username/email or password"
- Account locked: "Account is temporarily locked due to multiple failed attempts"
- Account inactive: "Account not verified. Please check your email"
- Server error: "Login failed. Please try again later"

---

## 3. Add Employee Flow

### Business Purpose
When an employer wants to add a new employee to their company, they must provide complete employee information. The system validates the data, generates an employee code, and stores the record for future payroll processing.

### Step-by-Step Flow

1. **User Accesses Add Employee Page**
   - Employer user navigates to employee management section
   - Clicks "Add Employee" button
   - System displays employee form with sections:
     - Personal Information: First Name, Last Name, Middle Name, SSN, DOB, Gender
     - Contact Information: Address, City, State, ZIP, Phone, Mobile, Email
     - Employment Details: Employee Type, Hire Date, TIN

2. **Form Validation (Client-Side)**
   - System validates required fields
   - SSN format validation (XXX-XX-XXXX)
   - Email format validation
   - Date validations (DOB reasonable, hire date not future)
   - Phone number format

3. **Form Submission**
   - User clicks "Save Employee" button
   - System sends POST request to `/api/SelfEmployee/Create` with employee data

4. **Server-Side Validation**
   - System validates all input data:
     - Required fields present
     - SSN uniqueness within company
     - Email format and uniqueness within company
     - Date validations
   - If validation fails, return field-specific error messages

5. **Employee Code Generation**
   - System generates unique employee code:
     - Format: EMP + CompanyId + Sequential number
     - Example: EMP0010001 (Company 1, Employee 1)
   - Checks uniqueness in MasterEmployee table

6. **Duplicate SSN Check**
   - System queries MasterEmployee table:
     ```sql
     SELECT COUNT(*) FROM MasterEmployee 
     WHERE SocSecNum = @SSN AND CompanyId = @CompanyId
     ```
   - If duplicate found, return "Employee with this SSN already exists" error

7. **Employee Record Creation**
   - System inserts new record into MasterEmployee table:
     ```sql
     INSERT INTO MasterEmployee (
         EmplCode, SocSecNum, FirstName, MiddleName, LastName,
         BirthDate, Gender, Address1, Address2, City, State, 
         Country, Zip, Phone, Mobile, Email, Tin, TypeCode,
         AppintDate, CompanyId, CreatedDate, CreatedBy
     ) VALUES (
         @GeneratedCode, @SocSecNum, @FirstName, @MiddleName, @LastName,
         @BirthDate, @Gender, @Address1, @Address2, @City, @State,
         @Country, @Zip, @Phone, @Mobile, @Email, @Tin, @TypeCode,
         @AppintDate, @CompanyId, GETDATE(), @CurrentUserId
     )
     ```

8. **Audit Logging**
   - System inserts record into AuditLog table:
     ```sql
     INSERT INTO AuditLog (TableName, RecordId, Action, UserId, ChangeDate, Details)
     VALUES ('MasterEmployee', @NewEmployeeId, 'INSERT', @CurrentUserId, GETDATE(), 'New employee added')
     ```

9. **Response to User**
   - System returns success message with new employee ID
   - Frontend displays success notification
   - User is redirected to employee list or stays on form for another entry

### Business Rules
- Employee codes are auto-generated and unique
- SSN must be unique within each company
- Email addresses should be unique within company (soft validation)
- All employees are associated with a company
- Audit trail maintained for all employee changes
- Employee types determine contribution calculations

### Error Scenarios
- Duplicate SSN: "An employee with this Social Security Number already exists in your company"
- Invalid SSN format: "Please enter a valid Social Security Number"
- Future hire date: "Hire date cannot be in the future"
- Server error: "Failed to add employee. Please try again"

---

## 4. Edit Employee Flow

### Business Purpose
When an employer needs to update an existing employee's information, they can modify personal details, contact information, or employment data. The system tracks all changes for audit purposes.

### Step-by-Step Flow

1. **User Accesses Employee List**
   - Employer navigates to employee management
   - System displays paginated list of employees
   - User clicks "Edit" button next to desired employee

2. **Load Employee Data**
   - System queries MasterEmployee table:
     ```sql
     SELECT * FROM MasterEmployee WHERE EmployeeId = @EmployeeId AND CompanyId = @CompanyId
     ```
   - If employee not found or doesn't belong to user's company, return error

3. **Display Edit Form**
   - System populates form with current employee data
   - All fields are editable except EmployeeId and EmplCode
   - Form includes validation rules

4. **Form Modification**
   - User modifies desired fields
   - Client-side validation occurs on field changes

5. **Form Submission**
   - User clicks "Update Employee" button
   - System sends PUT request to `/api/SelfEmployee/Update/{id}` with updated data

6. **Server-Side Validation**
   - System validates updated data
   - Checks SSN uniqueness (excluding current employee)
   - Validates email format and company uniqueness
   - Ensures required fields are present

7. **Change Detection**
   - System compares new values with existing values
   - Identifies which fields changed
   - Prepares audit trail data

8. **Employee Record Update**
   - System updates MasterEmployee table:
     ```sql
     UPDATE MasterEmployee SET
         FirstName = @FirstName,
         LastName = @LastName,
         Address1 = @Address1,
         Phone = @Phone,
         Email = @Email,
         ModifiedDate = GETDATE(),
         ModifiedBy = @CurrentUserId
     WHERE EmployeeId = @EmployeeId AND CompanyId = @CompanyId
     ```

9. **Audit Logging**
   - System inserts detailed audit record:
     ```sql
     INSERT INTO AuditLog (TableName, RecordId, Action, UserId, ChangeDate, OldValues, NewValues)
     VALUES ('MasterEmployee', @EmployeeId, 'UPDATE', @CurrentUserId, GETDATE(), @OldDataJson, @NewDataJson)
     ```

10. **Response to User**
    - System returns success message
    - Frontend updates employee list if needed
    - User sees confirmation of successful update

### Business Rules
- Users can only edit employees in their own company
- SSN changes require uniqueness validation
- All changes are tracked in audit log with before/after values
- Email changes trigger uniqueness checks within company
- System prevents editing of system-generated fields (EmployeeId, EmplCode)

### Error Scenarios
- Employee not found: "Employee not found or access denied"
- Duplicate SSN: "Another employee with this SSN already exists"
- Concurrency error: "Employee was modified by another user. Please refresh and try again"
- Server error: "Failed to update employee. Please try again"

---

## 5. Delete Employee Flow

### Business Purpose
When an employer needs to remove an employee from their company records, the system performs soft deletion to maintain data integrity and audit trails. The employee record remains in the database but is marked as inactive.

### Step-by-Step Flow

1. **User Accesses Employee List**
   - Employer views employee list
   - Clicks "Delete" button next to employee
   - System displays confirmation dialog: "Are you sure you want to delete this employee?"

2. **Deletion Confirmation**
   - User confirms deletion
   - System checks if employee has pending payroll or contributions

3. **Dependency Check**
   - System queries related tables:
     ```sql
     SELECT COUNT(*) FROM PayrollProcessDetail WHERE EmployeeId = @EmployeeId
     SELECT COUNT(*) FROM ProcessContribution WHERE EmployeeId = @EmployeeId AND Status = 'Pending'
     ```
   - If active payroll dependencies found, show warning

4. **Soft Deletion**
   - System updates MasterEmployee table:
     ```sql
     UPDATE MasterEmployee SET
         IsActive = 0,
         Terminated = GETDATE(),
         ModifiedDate = GETDATE(),
         ModifiedBy = @CurrentUserId
     WHERE EmployeeId = @EmployeeId AND CompanyId = @CompanyId
     ```

5. **Audit Logging**
   - System records deletion in audit log:
     ```sql
     INSERT INTO AuditLog (TableName, RecordId, Action, UserId, ChangeDate, Details)
     VALUES ('MasterEmployee', @EmployeeId, 'DELETE', @CurrentUserId, GETDATE(), 'Employee marked as inactive')
     ```

6. **Update Related Records**
   - System updates any pending payroll records to exclude deleted employee
   - Marks related contributions as cancelled if not yet processed

7. **Response to User**
   - System returns success message
   - Frontend removes employee from list or shows inactive status
   - User sees confirmation of deletion

### Business Rules
- Deletion is soft (IsActive = 0) to preserve data integrity
- Terminated date is set to current date
- Audit trail maintained for all deletions
- Related pending payroll records are handled appropriately
- Hard deletion only possible by administrators for data cleanup

### Error Scenarios
- Employee not found: "Employee not found"
- Active payroll dependencies: "Cannot delete employee with active payroll. Please process or cancel pending payroll first"
- Server error: "Failed to delete employee. Please try again"

---

## 6. Calculate Contributions Flow

### Business Purpose
When processing payroll, the system calculates contribution amounts for each employee based on their wages, employment type, and applicable rates. This includes Social Security, Employment Insurance, severance pay, and levy amounts.

### Step-by-Step Flow

1. **Payroll Batch Creation**
   - Employer creates new payroll batch
   - Selects payroll period (month/year)
   - System loads active employees for the company

2. **Wage Data Input**
   - For each employee, system displays wage input form
   - User enters gross wages, hours worked, deductions
   - System validates wage data

3. **Rate Retrieval**
   - System queries MasterRateSetting table for current rates:
     ```sql
     SELECT * FROM MasterRateSetting WHERE IsActive = 1 AND EffectiveDate <= @PayrollPeriod
     ORDER BY EffectiveDate DESC
     ```

4. **Contribution Calculation**
   - For each employee, system calculates:
     - Employee SS: WageBase × EmployeeSSRate
     - Employer SS: WageBase × EmployerSSRate
     - Employee EI: WageBase × EmployeeEIRate
     - Employer EI: WageBase × EmployerEIRate
     - Severance Pay: WageBase × SeveranceRate (if applicable)
     - Levy: WageBase × LevyRate (if applicable)

5. **Tax Calculation**
   - System applies tax brackets from DeductionsTaxTable
   - Calculates income tax deductions
   - Applies tax credits and exemptions

6. **Total Contribution**
   - System sums all contribution components
   - Stores individual amounts and totals

7. **Record Storage**
   - System inserts into ProcessContribution table:
     ```sql
     INSERT INTO ProcessContribution (
         EmployeeId, PayrollId, Period, EmployeeSS, EmployerSS,
         EmployeeEI, EmployerEI, SeverancePay, LevyAmount,
         TotalContribution, WageBase, CalculationDate
     ) VALUES (
         @EmployeeId, @PayrollId, @Period, @EmpSS, @EmpSS,
         @EmpEI, @EmpEI, @Severance, @Levy, @Total, @WageBase, GETDATE()
     )
     ```

8. **Batch Total Calculation**
   - System aggregates all employee contributions
   - Updates PayrollProcessHeader with totals

9. **Validation Checks**
   - System validates total amounts are reasonable
   - Checks for negative contributions
   - Verifies rate applications

### Business Rules
- Calculations based on current active rates
- Rates can change over time with effective dates
- Contributions calculated on gross wages before deductions
- Self-employed have different calculation rules
- All calculations are audited and stored

### Error Scenarios
- Invalid wage data: "Please enter valid wage amounts"
- No active rates: "No contribution rates configured for this period"
- Calculation error: "Failed to calculate contributions. Please try again"

---

## 7. Submit Payroll Flow

### Business Purpose
After calculating contributions and reviewing payroll data, the employer submits the payroll batch for processing. The system validates all data, locks the batch, and prepares it for payment processing.

### Step-by-Step Flow

1. **Payroll Review**
   - Employer reviews calculated payroll data
   - System displays summary of employees, wages, contributions
   - User can make final adjustments if needed

2. **Final Validation**
   - System validates all required data is present
   - Checks contribution calculations
   - Verifies employee data completeness

3. **Batch Status Update**
   - System updates PayrollProcessHeader:
     ```sql
     UPDATE PayrollProcessHeader SET
         Status = 'Submitted',
         SubmittedBy = @CurrentUserId,
         SubmittedDate = GETDATE()
     WHERE PayrollId = @PayrollId
     ```

4. **Lock Records**
   - System locks contribution records from further editing
   - Updates ProcessContribution status to 'Locked'

5. **Audit Logging**
   - System records payroll submission in audit log
   - Logs all batch details for compliance

6. **Notification Generation**
   - System sends confirmation email to employer
   - Includes payroll summary and next steps

7. **Payment Preparation**
   - System calculates total payment amount
   - Prepares payment gateway integration data

### Business Rules
- Submitted payroll cannot be modified
- All calculations are final after submission
- Audit trail maintained for regulatory compliance
- Notifications sent for important milestones

---

## 8. Process Payment Flow

### Business Purpose
After payroll submission, the employer initiates payment for the calculated contributions. The system integrates with payment gateways to process the transaction securely.

### Step-by-Step Flow

1. **Payment Initiation**
   - Employer clicks "Pay Now" button
   - System displays payment summary and amount
   - User selects payment method (PayPal, CyberSource, Bank Transfer)

2. **Payment Gateway Integration**
   - System creates payment request for selected gateway
   - Generates unique transaction reference
   - Redirects to gateway or displays payment form

3. **Payment Processing**
   - Gateway processes payment
   - System receives webhook/callback with payment status
   - Updates OnlinePayments table with transaction details

4. **Payment Verification**
   - System verifies payment amount matches payroll total
   - Updates payment status in database

5. **Payroll Status Update**
   - If payment successful, updates payroll status to 'Paid'
   - Links payment record to payroll batch

6. **Confirmation Generation**
   - System generates payment receipt
   - Sends confirmation email with receipt
   - Updates employer dashboard

### Business Rules
- Payments must match exact payroll amount
- Multiple payment attempts allowed until successful
- Payment failures are logged and reported
- Successful payments trigger downstream processes

---

## 9. Generate Report Flow

### Business Purpose
Users can generate various reports for compliance, auditing, and business intelligence. The system queries relevant data, formats it appropriately, and provides export options.

### Step-by-Step Flow

1. **Report Selection**
   - User selects report type from dashboard
   - System displays report parameters form
   - User enters date ranges, filters, company selection

2. **Data Query**
   - System builds dynamic SQL query based on parameters
   - Queries relevant tables (PayrollProcessHeader, ProcessContribution, etc.)
   - Applies user permissions and company filtering

3. **Data Processing**
   - System aggregates data as needed
   - Applies calculations for summary reports
   - Formats data for display

4. **Report Generation**
   - System generates report in requested format (PDF, Excel, CSV)
   - Applies company branding and formatting
   - Includes report metadata (generation date, parameters)

5. **Export Delivery**
   - System provides download link
   - For scheduled reports, queues for email delivery
   - Logs report generation for audit

### Business Rules
- Reports respect user permissions and company boundaries
- Large reports are processed asynchronously
- Report generation is logged for security
- Export formats support different use cases

---

## 10. Admin User Management Flow

### Business Purpose
Administrators can manage user accounts, roles, and permissions across the system. This includes creating new users, modifying permissions, and managing account status.

### Step-by-Step Flow

1. **User List Access**
   - Admin navigates to user management section
   - System displays paginated list of all users
   - Shows user details, roles, status, last login

2. **User Creation**
   - Admin clicks "Add User"
   - Fills user details, assigns role and company
   - System creates user account with temporary password

3. **Role Assignment**
   - System assigns role from SecRole table
   - Updates user permissions in SecUserModule

4. **Permission Management**
   - Admin can modify individual user permissions
   - System updates UserPermission table

5. **Account Management**
   - Admin can activate/deactivate accounts
   - Reset passwords, unlock accounts
   - View user activity logs

### Business Rules
- Only administrators can manage users
- Role changes are audited
- Password resets require secure procedures
- Account changes trigger notifications

---

## 11. Settings Management Flow

### Business Purpose
Administrators and employers can configure system settings, rates, and business rules that affect calculations and system behavior.

### Step-by-Step Flow

1. **Settings Access**
   - User navigates to settings section
   - System loads current settings from SiteSettings table

2. **Rate Configuration**
   - Admin updates contribution rates in MasterRateSetting
   - Sets effective dates for rate changes

3. **System Configuration**
   - Updates general system settings
   - Configures email templates, notifications

4. **Validation and Saving**
   - System validates setting changes
   - Updates database with new values
   - Logs configuration changes

### Business Rules
- Rate changes have effective dates
- Configuration changes are audited
- Some settings require system restart
- Validation prevents invalid configurations

---

## 12. Multi-Factor Authentication (MFA) Flow

### Business Purpose
To enhance security, the system supports multi-factor authentication using OTP (One-Time Password) sent via email. Users can enable MFA for their accounts to add an extra layer of security beyond username and password.

### Step-by-Step Flow

1. **MFA Enrollment (Optional)**
   - User enables MFA in account settings
   - System sets MFA flag in Secuser table
   - User selects MFA method (Email OTP)

2. **Login with MFA Enabled**
   - User enters username and password
   - System validates credentials
   - If MFA enabled, system generates 6-digit OTP
   - System sends OTP to user's registered email

3. **OTP Generation**
   - System generates random 6-digit code
   - Stores OTP in UserOtp table:
     ```sql
     INSERT INTO UserOtp (
         UserId, OtpCode, OtpType, CreatedDate, ExpiryDate, IsUsed
     ) VALUES (
         @UserId, @GeneratedOTP, 'Login', GETDATE(), DATEADD(MINUTE, 10, GETDATE()), 0
     )
     ```

4. **OTP Email Sending**
   - System sends email with OTP code
   - Email template includes:
     - OTP code
     - Expiry time (10 minutes)
     - Warning about not sharing code

5. **OTP Verification**
   - User receives OTP email
   - User enters OTP code in application
   - System calls `/api/Auth/VerifyMFAOtp` with userId, type, and OTP

6. **OTP Validation**
   - System queries UserOtp table:
     ```sql
     SELECT * FROM UserOtp 
     WHERE UserId = @UserId AND OtpCode = @OtpCode 
     AND OtpType = 'Login' AND IsUsed = 0 
     AND ExpiryDate > GETDATE()
     ```
   - If valid, marks OTP as used
   - Generates JWT token
   - User is logged in

7. **Failed OTP Handling**
   - If OTP invalid or expired, reject login
   - Allow maximum 3 attempts
   - After 3 failed attempts, generate new OTP

### Business Rules
- OTP expires after 10 minutes
- Maximum 3 OTP verification attempts
- OTP can only be used once
- New OTP invalidates previous unused OTPs
- MFA can be disabled by user in settings

### Database Tables

#### UserOtp Table
- `OtpId` (INT, IDENTITY) - Primary key
- `UserId` (INT, NULL) - User identifier
- `OtpCode` (VARCHAR(10), NULL) - Generated OTP
- `OtpType` (VARCHAR(20), NULL) - Type: Login, PasswordReset
- `CreatedDate` (DATETIME, NULL) - When OTP was created
- `ExpiryDate` (DATETIME, NULL) - When OTP expires
- `IsUsed` (BIT, NULL) - Whether OTP has been used
- `UsedDate` (DATETIME, NULL) - When OTP was used

---

## 13. BIMA API Integration Flow

### Business Purpose
The C3 Wizard system integrates with the St. Kitts and Nevis Social Security Board's BIMA system. This integration allows:
- Employee data import from BIMA
- Payment posting to BIMA
- Registration validation against BIMA records
- Receipt number synchronization

### Step-by-Step Flow

#### A. Employee Import from BIMA

1. **Import Initiation**
   - Employer enters employee SSN
   - System checks if SSN exists in local database
   - If not found, queries BIMA API

2. **BIMA API Request**
   - System calls BIMA API endpoint with SSN
   - Endpoint: `{BIMA_BASE_URL}/api/employee/{ssn}`
   - Uses Basic Authentication with configured credentials
   - Timeout: 2 minutes

3. **BIMA Response Processing**
   - System receives employee data from BIMA:
     - SSN
     - First Name, Middle Name, Last Name
     - Date of Birth
     - Gender
     - Address details
     - Email
     - Employment status

4. **Data Validation**
   - System validates email matches if provided
   - Checks if employee already registered
   - Validates SSN format

5. **Local Database Storage**
   - If validation passes, creates MasterEmployee record
   - Marks as imported from BIMA: `IsImportFromBema = true`
   - Links to company

#### B. Payment Posting to BIMA

1. **Payment Success Trigger**
   - When payment is authorized through CyberSource/PayPal
   - System prepares payment data for BIMA

2. **BIMA Payment Request**
   - System calls BIMA payment API
   - Endpoint: `{BIMA_BASE_URL}/api/payment/post`
   - Payload includes:
     - Registration number
     - Payment amount
     - Payment date
     - Period (month/year)
     - Transaction ID
     - Payment breakdown (SS, Levy, Severance, Penalties)

3. **BIMA Receipt Generation**
   - BIMA system processes payment
   - Returns official receipt number
   - System stores in OnlinePayments.bimaReceiptNumber

4. **Reconciliation**
   - System updates payment status
   - Stores BIMA reference: `BimaRefNum`
   - Marks payment as posted to BIMA

#### C. Registration Validation

1. **Company Registration Check**
   - During company registration
   - System validates registration number against BIMA
   - Endpoint: `{BIMA_BASE_URL}/api/company/validate`

2. **BIMA Validation Response**
   - Returns company details if valid
   - Confirms registration number exists
   - Provides company name and status

3. **Auto-Population**
   - If valid, populates company information
   - Links BIMA company ID with local CompanyId

### Configuration Settings

System uses these configuration values (in appsettings.json):
- `IsBEMA_APIs_Integration`: Enable/disable BIMA integration (0 or 1)
- `EnableBEMAAuthInsteadOfLocal`: Use BIMA auth or local (0 or 1)
- `ServiceConfig:ServiceUriString`: BIMA API base URL
- `ServiceConfig:AuthUser`: BIMA API username
- `ServiceConfig:AuthPass`: BIMA API password

### Error Handling

1. **Connection Failures**
   - System checks internet connectivity
   - Displays message: "Check your internet connection or the server may not be responding"
   - Returns HTTP 503 (Service Unavailable)

2. **BIMA System Down**
   - System allows offline mode
   - Queues data for later synchronization
   - Logs failed API calls

3. **Data Mismatch**
   - If email doesn't match BIMA records
   - Shows error: "Email ID and Social Security Number do not match"
   - Prevents registration until corrected

### Business Rules
- BIMA integration is configurable (can be disabled)
- All BIMA API calls have 2-minute timeout
- Failed BIMA calls are logged for retry
- BIMA receipt numbers take precedence over local receipt numbers
- Only successful payments are posted to BIMA

---

## 14. Holiday Pay Management Flow

### Business Purpose
Employers can track and manage holiday pay for employees on a week-by-week basis. This integrates with C3 contribution calculations to ensure accurate wage reporting.

### Step-by-Step Flow

1. **Holiday Pay Setup**
   - Admin configures holiday dates in system
   - System stores in HolidayPayDate table
   - Defines standard holiday pay rates

2. **Holiday Pay Entry**
   - Employer selects employee and pay period
   - System displays 5 weeks of the month
   - User enters holiday pay amount for specific weeks

3. **Holiday Pay Storage**
   - System saves to MasterHolidayPayDetail table:
     ```sql
     INSERT INTO MasterHolidayPayDetail (
         EmployeeId, CompanyId, PayDate, HolidayPayAmount,
         Week1Amount, Week2Amount, Week3Amount, Week4Amount, Week5Amount,
         CreatedBy, CreatedDate
     ) VALUES (
         @EmployeeId, @CompanyId, @PayDate, @TotalAmount,
         @Week1, @Week2, @Week3, @Week4, @Week5,
         @UserId, GETDATE()
     )
     ```

4. **Integration with C3**
   - When generating C3 for period, system loads holiday pay
   - Adds to ProcessContribution.Hpay field
   - Separate tracking: HpayWeek1, HpayWeek2, HpayWeek3, HpayWeek4, HpayWeek5
   - Includes in total wages for contribution calculation

5. **Holiday Pay Updates**
   - System tracks updates in HolidayPayUpdates table
   - Maintains audit trail of changes
   - Records who modified and when

### Database Tables

#### HolidayPayDate Table
- `HolidayDateId` (INT, IDENTITY) - Primary key
- `HolidayDate` (DATETIME, NULL) - Date of holiday
- `HolidayName` (VARCHAR(100), NULL) - Name of holiday
- `IsActive` (BIT, NULL) - Active status
- `Year` (INT, NULL) - Year of holiday

#### MasterHolidayPayDetail Table
- `HolidayPayId` (INT, IDENTITY) - Primary key
- `EmployeeId` (INT, NULL) - Employee reference
- `CompanyId` (INT, NULL) - Company reference
- `PayDate` (DATETIME, NULL) - Payment date
- `HolidayPayAmount` (DECIMAL(18,2), NULL) - Total holiday pay
- `Week1Amount` (DECIMAL(18,2), NULL) - Week 1 holiday pay
- `Week2Amount` (DECIMAL(18,2), NULL) - Week 2 holiday pay
- `Week3Amount` (DECIMAL(18,2), NULL) - Week 3 holiday pay
- `Week4Amount` (DECIMAL(18,2), NULL) - Week 4 holiday pay
- `Week5Amount` (DECIMAL(18,2), NULL) - Week 5 holiday pay
- `CreatedBy` (INT, NULL) - User who created
- `CreatedDate` (DATETIME, NULL) - Creation timestamp

#### HolidayPayUpdates Table
- `UpdateId` (INT, IDENTITY) - Primary key
- `HolidayPayId` (INT, NULL) - Reference to holiday pay record
- `OldAmount` (DECIMAL(18,2), NULL) - Previous amount
- `NewAmount` (DECIMAL(18,2), NULL) - Updated amount
- `UpdatedBy` (INT, NULL) - User who updated
- `UpdatedDate` (DATETIME, NULL) - Update timestamp
- `Reason` (VARCHAR(500), NULL) - Reason for update

### Business Rules
- Holiday pay is tracked separately from regular wages
- Can be entered week-by-week for accuracy
- Integrates into total wages for C3 calculations
- All changes are audited
- Holiday pay dates configured annually

---

## 15. Bonus Payment Management Flow

### Business Purpose
System allows employers to track bonus payments separately from regular wages. Bonuses are included in C3 contribution calculations but tracked distinctly for reporting purposes.

### Step-by-Step Flow

1. **Bonus Entry**
   - Employer navigates to bonus management
   - Selects employee and pay period
   - Enters bonus amount and type

2. **Bonus Types**
   - December Bonus (Christmas/Year-end)
   - Performance Bonus
   - Production Bonus
   - Other Bonus

3. **Bonus Storage**
   - System saves to BonusPayDetail table:
     ```sql
     INSERT INTO BonusPayDetail (
         EmployeeId, CompanyId, BonusAmount, BonusType,
         PaymentDate, PeriodMonth, PeriodYear,
         CreatedBy, CreatedDate
     ) VALUES (
         @EmployeeId, @CompanyId, @Amount, @Type,
         @PayDate, @Month, @Year,
         @UserId, GETDATE()
     )
     ```

4. **December Bonus Exemption**
   - System checks if December bonus is exempt from contributions
   - Uses DecemberBonusExemptedContribution table
   - If exempt, excludes from C3 calculation

5. **Integration with C3**
   - When generating C3, system loads bonus for period
   - Adds to ProcessContribution.Bonus field
   - Includes in total wages (unless exempted)
   - Calculates contributions on bonus amount

6. **Bonus Editing**
   - User can edit bonus before C3 submission
   - System updates BonusPayDetail record
   - Recalculates C3 contributions

7. **Bonus Deletion**
   - User can delete bonus entry
   - System soft-deletes (marks inactive)
   - Updates C3 calculations

### Database Tables

#### BonusPayDetail Table
- `BonusPayId` (INT, IDENTITY) - Primary key
- `EmployeeId` (INT, NULL) - Employee reference
- `CompanyId` (INT, NULL) - Company reference
- `BonusAmount` (DECIMAL(18,2), NULL) - Bonus amount
- `BonusType` (VARCHAR(50), NULL) - Type of bonus
- `PaymentDate` (DATETIME, NULL) - When bonus paid
- `PeriodMonth` (VARCHAR(10), NULL) - Period month
- `PeriodYear` (VARCHAR(4), NULL) - Period year
- `IsActive` (BIT, NULL) - Active status
- `CreatedBy` (INT, NULL) - User who created
- `CreatedDate` (DATETIME, NULL) - Creation timestamp
- `ModifiedBy` (INT, NULL) - User who modified
- `ModifiedDate` (DATETIME, NULL) - Modification timestamp

#### DecemberBonusExemptedContribution Table
- `ExemptionId` (INT, IDENTITY) - Primary key
- `EmployeeId` (INT, NULL) - Employee reference
- `BonusAmount` (DECIMAL(18,2), NULL) - Exempted amount
- `Year` (INT, NULL) - Exemption year
- `CreatedDate` (DATETIME, NULL) - Creation timestamp

### Business Rules
- December bonuses may be exempt from contributions (configurable)
- Bonuses are tracked separately but included in total wages
- All bonus entries are audited
- Bonuses can be edited until C3 is submitted
- Multiple bonuses can be entered for same employee in same period

---

## 16. Director-Specific C3 Processing Flow

### Business Purpose
Non-working directors and employee-directors have different contribution rules. System handles director-specific C3 forms separately with different calculations and reporting.

### Director Types

1. **Director Only (Non-Working Director)**
   - Does not perform employee duties
   - Receives director fees/wages only
   - Has simplified contribution calculation
   - MasterEmployee.IsdirectorOnly = true

2. **Employee-Director**
   - Performs both employee and director duties
   - Receives both regular wages and director fees
   - Contributions calculated on combined income
   - MasterEmployee.IsemployeeDirector = true

### Step-by-Step Flow

1. **Director Identification**
   - System identifies directors via employee flags
   - Query:
     ```sql
     SELECT * FROM MasterEmployee 
     WHERE CompanyId = @CompanyId 
     AND (IsdirectorOnly = 1 OR IsemployeeDirector = 1)
     AND IsActive = 1
     ```

2. **Director C3 Generation**
   - User selects "Generate Director C3"
   - System creates separate C3 header with ForDirector = true
   - ProcessC3header.ForDirector = true

3. **Director Wage Entry**
   - User enters director fees for period
   - Stored in ProcessContribution.DirectorWage
   - For employee-directors, combines with regular wages

4. **Director Contribution Calculation**
   - For director-only:
     - Uses director wage rates (from NwdMasterRateSetting)
     - Calculates SS and Levy on director wages
   - For employee-directors:
     - Combines regular wages + director wages
     - Applies standard rates to combined amount

5. **Separate C3 Form**
   - Director C3 forms are separate from employee C3
   - Different schedule numbers
   - Different reporting requirements

6. **Director C3 Submission**
   - Follows same submission flow as regular C3
   - Separate payment processing
   - Separate receipt generation

### Database Tables

#### NwdMasterRateSetting Table (Non-Working Director Rates)
- `RateId` (INT, IDENTITY) - Primary key
- `SSRate` (DECIMAL(5,4), NULL) - Social Security rate
- `LevyRate` (DECIMAL(5,4), NULL) - Levy rate
- `EffectiveDate` (DATETIME, NULL) - When rate becomes active
- `EndDate` (DATETIME, NULL) - When rate expires
- `IsActive` (BIT, NULL) - Active status
- `CreatedBy` (INT, NULL) - User who created
- `CreatedDate` (DATETIME, NULL) - Creation timestamp

### Business Rules
- Directors have separate C3 forms
- Director-only rates may differ from employee rates
- Employee-directors have combined wage reporting
- Director wages tracked in separate field
- All director contributions reported separately

---

## 17. CyberSource Payment Gateway Integration Flow

### Business Purpose
CyberSource is the primary payment gateway for processing online payments. System integrates with CyberSource Secure Acceptance API for secure credit card processing.

### Step-by-Step Flow

1. **CyberSource Configuration**
   - Admin configures CyberSource credentials
   - System stores in SiteSettings table:
     - Merchant ID
     - Secret Key
     - API Key ID
     - Environment (Test/Live)

2. **Payment Initiation**
   - User clicks "Pay Now" on C3
   - System calculates total amount:
     - Total SS contributions
     - Total Levy (employee + employer)
     - Total Severance
     - Total Penalties (SS + PE + Levy)

3. **Card Details Entry**
   - User enters or selects saved card:
     - Card Number
     - Cardholder Name
     - Expiry Month/Year
     - CVV/Security Code
     - Card Type (Visa/MasterCard/etc.)

4. **Save Card Option**
   - User can choose to save card for future use
   - If selected, system tokenizes card details
   - Stores in UserCardDetails table (encrypted)

5. **Payment Request to CyberSource**
   - System builds CyberSource payment request:
     ```csharp
     {
         "merchantId": config.MerchantId,
         "amount": totalAmount,
         "currency": "USD",
         "cardNumber": encryptedCardNumber,
         "expiryMonth": expiryMonth,
         "expiryYear": expiryYear,
         "cvv": cvv,
         "billToFirstName": firstName,
         "billToLastName": lastName,
         "billToEmail": email
     }
     ```

6. **Payment Processing**
   - CyberSource processes payment
   - Returns transaction response with:
     - Transaction ID
     - Authorization Code
     - Status (AUTHORIZED, DECLINED, ERROR)
     - Response Code
     - Response Message

7. **Payment Recording**
   - System creates OnlinePayments record:
     ```sql
     INSERT INTO OnlinePayments (
         C3HeaderId, PaymentAmount, PaymentGatewayTransactionID,
         PaymentStatus, mode, CreatedOn, RefCustomerName, Email,
         totalSscontributions, totalLeavy, totalServayance,
         totalSspenalty, totalPepenalty, totalLevyeepenalty,
         TransactionFor, RegNumber
     ) VALUES (
         @C3HeaderId, @Amount, @TransactionId,
         @Status, 'CyberSource', GETDATE(), @CustomerName, @Email,
         @SSAmount, @LevyAmount, @SeveranceAmount,
         @SSPenalty, @PEPenalty, @LevyPenalty,
         'Employee', @RegNumber
     )
     ```

8. **BIMA Posting (if enabled)**
   - If payment successful and BIMA integration enabled
   - System posts payment to BIMA API
   - Receives BIMA receipt number
   - Updates OnlinePayments.bimaReceiptNumber

9. **Receipt Generation**
   - System generates PDF receipt using RazorLight
   - Template: wwwroot/Email/payment.cshtml
   - Includes:
     - Receipt number
     - Transaction ID
     - Payment amount
     - Payment breakdown
     - Company/customer details
     - Transaction date

10. **Email Notification**
    - System sends two emails:
      - Customer email with receipt PDF attachment
      - SSB notification email with payment details

11. **C3 Status Update**
    - If payment successful:
      - Updates ProcessC3header.IsSubmitted = true
      - Sets C3SubmittedDate
      - Locks C3 from further editing

### Card Management

#### Save Card for Future Use
- User can save card during payment
- System tokenizes card via CyberSource
- Stores token in UserCardDetails table:
  ```sql
  INSERT INTO UserCardDetails (
      UserId, CardHolderName, CardNumber, CardMonthExpiry,
      CardType, CVV, IsActive, CreatedDate
  ) VALUES (
      @UserId, @Name, @EncryptedCardNumber, @Expiry,
      @Type, @EncryptedCVV, 1, GETDATE()
  )
  ```

#### Load Saved Cards
- When user returns for payment
- System displays saved cards (masked)
- User selects card or enters new one

#### Update Card Details
- User can update saved card information
- System re-encrypts new details
- Updates UserCardDetails record

#### Delete Card
- User can delete saved cards
- System soft-deletes (IsActive = 0)

### Database Tables

#### UserCardDetails Table
- `CardId` (INT, IDENTITY) - Primary key
- `UserId` (INT, NULL) - User reference
- `CardHolderName` (VARCHAR(100), NULL) - Name on card
- `CardNumber` (VARCHAR(255), NULL) - Encrypted card number
- `CardMonthExpiry` (VARCHAR(10), NULL) - Expiry month/year
- `CardType` (VARCHAR(50), NULL) - Card type (Visa, MC)
- `CVV` (VARCHAR(50), NULL) - Encrypted CVV
- `IsActive` (BIT, NULL) - Active status
- `CreatedDate` (DATETIME, NULL) - Creation timestamp
- `ModifiedDate` (DATETIME, NULL) - Modification timestamp

#### SiteSettings Table (for CyberSource Config)
- `SettingId` (INT, IDENTITY) - Primary key
- `SettingKey` (VARCHAR(100), NULL) - Setting key name
- `SettingValue` (VARCHAR(MAX), NULL) - Setting value
- `IsActive` (BIT, NULL) - Active status

### Configuration Keys
- `CyberSource_MerchantId`: Merchant identifier
- `CyberSource_SecretKey`: API secret key
- `CyberSource_KeyId`: API key identifier
- `CyberSource_Environment`: Test or Live
- `CyberSource_IsActive`: Enable/disable gateway

### Error Handling

1. **Declined Payments**
   - Display decline reason to user
   - Log transaction with DECLINED status
   - Allow user to retry with different card

2. **Gateway Errors**
   - Display user-friendly error message
   - Log full error details
   - Provide option to try again or use offline payment

3. **Timeout Handling**
   - 2-minute timeout for payment requests
   - If timeout, check transaction status via CyberSource API
   - Prevent duplicate charges

### Business Rules
- Only authorized payments update C3 status
- Failed payments are logged for audit
- Card numbers are encrypted at rest
- CVV is never stored in plain text (only temporarily for transaction)
- Payment receipts emailed within minutes of success
- All payment attempts logged regardless of outcome
- Test mode uses CyberSource sandbox environment

---

## 18. PayPal Payment Integration Flow

### Business Purpose
PayPal provides an alternative payment method for employers who prefer not to use credit cards. Integration uses PayPal REST API for payment processing.

### Step-by-Step Flow

1. **Payment Initiation**
   - User selects PayPal as payment method
   - System calculates total payment amount
   - User clicks "Pay with PayPal"

2. **PayPal Payment Creation**
   - System calls PayPal API to create payment
   - Endpoint: PayPal Create Payment API
   - Request includes:
     - Amount
     - Currency (USD)
     - Description (C3 Contribution Payment)
     - Return URL (success callback)
     - Cancel URL (cancellation callback)

3. **PayPal Redirect**
   - System receives PayPal approval URL
   - User is redirected to PayPal website
   - User logs into PayPal account
   - Reviews payment details
   - Approves or cancels payment

4. **Payment Approval**
   - If user approves, PayPal redirects back to success URL
   - URL includes:
     - Payment ID (token)
     - Payer ID
   - System captures these parameters

5. **Payment Execution**
   - System calls `/api/Payment/Paymentsuccess`
   - Sends payment token and payer ID
   - System executes payment via PayPal API:
     ```csharp
     var payment = Payment.Execute(apiContext, new PaymentExecution
     {
         payer_id = payerId
     });
     ```

6. **Payment Verification**
   - PayPal returns payment status
   - System verifies:
     - Payment state is "approved"
     - Amount matches expected amount
     - Transaction ID is valid

7. **Payment Recording**
   - System creates OnlinePayments record
   - Stores PayPal transaction ID
   - Sets mode = "PayPal"
   - Records payment status

8. **Subscription Support**
   - System supports PayPal subscriptions
   - Endpoint: `/api/Payment/BuySubscription`
   - For recurring C3 payments
   - Creates billing agreement with PayPal

9. **Payment Cancellation**
   - If user cancels on PayPal
   - PayPal redirects to cancel URL
   - System calls `/api/Payment/PaymentCancel`
   - Logs cancelled transaction
   - User returned to payment page

### PayPal Configuration

System requires these configuration values:
- `PayPal_ClientId`: PayPal app client ID
- `PayPal_ClientSecret`: PayPal app secret
- `PayPal_Mode`: Sandbox or Live
- `PayPal_ReturnUrl`: Success return URL
- `PayPal_CancelUrl`: Cancellation return URL

### Database Storage

Payment stored same as CyberSource but with:
- `mode` = "PayPal"
- `PaymentGatewayTransactionID` = PayPal transaction ID
- Additional PayPal-specific fields in JSON format

### Business Rules
- PayPal payments are recorded after execution
- Pending payments not considered successful
- Subscription payments require billing agreement
- All PayPal fees absorbed by system (not passed to user)
- PayPal transactions have unique transaction IDs

---

## 19. Offline Payment Management Flow

### Business Purpose
Not all payments are made online. System supports offline payment tracking for bank deposits, checks, and journal vouchers submitted directly to Social Security Board.

### Offline Payment Types

1. **Bank Payment**
   - Direct bank deposit
   - Records bank name and transaction details

2. **Check Payment**
   - Payment by check
   - Records check number and date

3. **Journal Voucher (JV)**
   - Government journal voucher
   - Records JV number and date

### Step-by-Step Flow

1. **Offline Payment Entry**
   - Admin/employer navigates to offline payment section
   - Selects C3 to mark as paid offline
   - Chooses payment type (Bank/Check/JV)

2. **Payment Details Entry**
   - For Bank Payment:
     - Bank name
     - Transaction date
     - Reference number
     - Deposit slip number
   
   - For Check Payment:
     - Check number
     - Check date
     - Bank name
     - Check amount
   
   - For Journal Voucher:
     - JV number
     - JV date
     - Amount

3. **Offline Payment Storage**
   - System saves to OnlinePayments table:
     ```sql
     INSERT INTO OnlinePayments (
         C3HeaderId, PaymentAmount, mode, PaymentStatus,
         BankName, checkNum, checkDate, JVNumber, jvDate,
         transactionDate, BimaRefNum, CreatedOn,
         RefCustomerName, RegNumber
     ) VALUES (
         @C3HeaderId, @Amount, @Mode, 'Completed',
         @BankName, @CheckNum, @CheckDate, @JVNum, @JVDate,
         @TransactionDate, @BimaRef, GETDATE(),
         @CustomerName, @RegNumber
     )
     ```

4. **BIMA Reference**
   - If payment made at SSB office
   - SSB provides BIMA reference number
   - System stores in BimaRefNum field

5. **C3 Status Update**
   - Updates ProcessC3header.IsSubmitted = true
   - Sets payment date
   - Locks C3 from editing

6. **Supporting Documents**
   - System can attach scanned documents
   - Stores file path in ImportC3Filepath
   - Marks: isImportC3file = true

### Offline Payment Retrieval

API Endpoints:
- `/api/Payment/GetOfflinePaymentData` - For employee C3
- `/api/Payment/GetOfflinePaymentDataDirector` - For director C3
- `/api/Payment/GetOfflinePaymentDataSelfEmp` - For self-employed C3

Returns payment details including:
- Payment method
- Transaction references
- Payment date
- Amount
- BIMA reference if applicable

### Database Fields for Offline Payments

In OnlinePayments table:
- `mode` (VARCHAR(50)) - Payment mode: "Bank", "Check", "JV"
- `BankName` (VARCHAR(100)) - Bank name
- `checkNum` (VARCHAR(50)) - Check number
- `checkDate` (DATETIME) - Check date
- `JVNumber` (VARCHAR(50)) - Journal voucher number
- `jvDate` (DATETIME) - JV date
- `transactionDate` (DATETIME) - Transaction date
- `BimaRefNum` (VARCHAR(50)) - BIMA reference number

### Business Rules
- Offline payments require admin approval
- Supporting documents recommended
- BIMA reference number validates payment
- Offline payments still reconciled monthly
- Manual payment entry audited

---

## 20. Payment Reconciliation Flow

### Business Purpose
Monthly reconciliation ensures all payments recorded in C3 Wizard match bank statements and CyberSource reports. This is critical for financial accuracy and audit compliance.

### Step-by-Step Flow

1. **Reconciliation Data Import**
   - Admin downloads CyberSource transaction report (CSV)
   - Navigates to reconciliation module
   - Uploads CSV file via `/api/Payment/UploadCyberCsv`

2. **CSV Processing**
   - System parses CSV file
   - Extracts transaction data:
     - Transaction ID
     - Transaction date
     - Amount
     - Cardholder name
     - Card type
     - Status
     - Settlement date

3. **Data Storage**
   - System stores in ReconciliationCyberSpace table:
     ```sql
     INSERT INTO ReconciliationCyberSpace (
         RequestID, TransactionID, MerchantReferenceNumber,
         TransactionDate, Amount, CardholderName, CardType,
         AuthorizationCode, ProcessorResponse, PaymentStatus,
         SettlementDate, MerchantID, UploadedBy, UploadedDate
     ) VALUES (
         @RequestID, @TransactionID, @MerchantRef,
         @TransactionDate, @Amount, @CardholderName, @CardType,
         @AuthCode, @ProcessorResponse, @Status,
         @SettlementDate, @MerchantID, @UserId, GETDATE()
     )
     ```

4. **Automatic Matching**
   - System matches CyberSource transactions with OnlinePayments
   - Matches on:
     - Transaction ID
     - Amount
     - Date (within tolerance)
   - Updates IsReconciled flag if match found

5. **Manual Reconciliation Interface**
   - Displays unreconciled transactions
   - Shows:
     - C3 Wizard payments without CyberSource match
     - CyberSource transactions without C3 Wizard payment
   - Allows admin to manually match

6. **Reconciliation Actions**
   - Admin can mark transaction as reconciled
   - Must provide reason/notes
   - System records:
     ```sql
     UPDATE OnlinePayments SET
         IsReconciled = 1,
         ReconciledBy = @UserId,
         ReconciledOn = GETDATE(),
         Notes = @Notes
     WHERE Id = @PaymentId
     ```

7. **Reconciliation Notes**
   - All reconciliation actions logged
   - Notes format: "Date, by UserName, OldStatus ---> NewStatus, Reason"
   - Multiple notes appended chronologically

8. **Reconciliation Reports**
   - System generates reconciliation reports:
     - Matched transactions
     - Unmatched C3 payments
     - Unmatched CyberSource transactions
     - Discrepancies (amount mismatches)

9. **Column Configuration**
   - Users can customize which CyberSource columns to display
   - Configuration stored per user
   - Stored in ReconciliationCyberSpaceColumn table

### Database Tables

#### ReconciliationCyberSpace Table
- `ReconciliationId` (INT, IDENTITY) - Primary key
- `RequestID` (VARCHAR(100), NULL) - CyberSource request ID
- `TransactionID` (VARCHAR(100), NULL) - Transaction ID (unique)
- `MerchantReferenceNumber` (VARCHAR(100), NULL) - Merchant reference
- `TransactionDate` (DATETIME, NULL) - Transaction date
- `Amount` (DECIMAL(18,2), NULL) - Transaction amount
- `CardholderName` (VARCHAR(100), NULL) - Cardholder name
- `CardType` (VARCHAR(50), NULL) - Card type
- `AuthorizationCode` (VARCHAR(50), NULL) - Auth code
- `ProcessorResponse` (VARCHAR(255), NULL) - Processor response
- `PaymentStatus` (VARCHAR(50), NULL) - Payment status
- `SettlementDate` (DATETIME, NULL) - Settlement date
- `MerchantID` (VARCHAR(50), NULL) - Merchant ID
- `UploadedBy` (INT, NULL) - User who uploaded
- `UploadedDate` (DATETIME, NULL) - Upload date

#### ReconciliationCyberSpaceColumn Table
- `ColumnId` (INT, IDENTITY) - Primary key
- `UserId` (INT, NULL) - User reference
- `Columns` (VARCHAR(100), NULL) - Column name
- `IsActive` (BIT, NULL) - Show/hide column
- `CreatedBy` (INT, NULL) - User who configured
- `CreatedOn` (DATETIME, NULL) - Configuration date

#### OnlinePayments (Reconciliation Fields)
- `IsReconciled` (BIT, NULL) - Reconciliation status
- `ReconciledBy` (INT, NULL) - User who reconciled
- `ReconciledOn` (DATETIME, NULL) - Reconciliation date
- `Notes` (TEXT, NULL) - Reconciliation notes

### API Endpoints

- `POST /api/Payment/UploadCyberCsv` - Upload CyberSource CSV
- `POST /api/Payment/UploadCyberJson` - Upload JSON data
- `GET /api/Payment/GetReconciliationDataCyber` - Get reconciliation data
- `POST /api/Payment/UpdateReconciliationData` - Bulk reconciliation
- `POST /api/Payment/UpdateReconciliationNotes` - Add notes
- `POST /api/Payment/GetReconcilNotes` - View notes history
- `GET /api/Payment/GetCyberSourceFields` - Get column configuration
- `POST /api/Payment/PostCyberSourceList` - Save column configuration

### Business Rules
- CSV uploads validated for required fields
- Duplicate transaction IDs rejected
- Reconciliation requires admin privileges
- All reconciliation actions audited
- Notes cannot be deleted, only appended
- Reconciliation status can be toggled (reconciled <-> unreconciled)
- Monthly reconciliation mandatory

---

## 21. Email Notification System

### Business Purpose
System sends automated emails for various events to keep users informed and provide receipts/confirmations.

### Email Types and Triggers

#### 1. Registration Verification Email
**Trigger**: New user registration  
**Recipient**: Registered user  
**Template**: `EmailVerification.cshtml`

**Content**:
- Welcome message
- Verification link with token
- Instructions to verify email
- Token expiry time (24 hours)

**Flow**:
```csharp
var token = Guid.NewGuid().ToString("N").Substring(0, 8);
await SendEmail(email, "Email Verification", template, token);
```

#### 2. OTP Verification Email
**Trigger**: MFA login attempt  
**Recipient**: User with MFA enabled  
**Template**: `OtpVerificationLogin.cshtml`

**Content**:
- 6-digit OTP code
- Expiry time (10 minutes)
- Security warning

#### 3. Password Reset Email
**Trigger**: Forgot password request  
**Recipient**: User requesting reset  
**Template**: `PasswordReset.cshtml`

**Content**:
- Password reset link
- Token expiry time
- Security instructions

#### 4. Payment Success Email (Customer)
**Trigger**: Successful payment  
**Recipient**: Employer/customer  
**Template**: `payment.cshtml`

**Content**:
- Receipt number
- Transaction ID
- Payment amount and breakdown
- Company/customer details
- Period covered
- PDF receipt attachment

**Payment Breakdown Includes**:
- Social Security contributions
- Levy (employee + employer)
- Severance pay
- Penalties (if any)
- Total amount

#### 5. Payment Success Email (SSB)
**Trigger**: Successful payment  
**Recipient**: Social Security Board (SSB)  
**Template**: `payment.cshtml` (modified for SSB)

**Content**:
- Payment notification
- Company registration number
- Payment amount and breakdown
- Transaction details
- PDF receipt attachment

#### 6. Payment Failed Email
**Trigger**: Failed payment  
**Recipient**: Customer  
**Template**: `payment.cshtml` (failure variant)

**Content**:
- Transaction ID
- Failure reason
- Amount attempted
- Instructions to retry

### Email Configuration

System uses SMTP for email delivery. Configuration (in appsettings.json):

```json
{
  "EmailSettings": {
    "SenderEmail": "noreply@c3wizard.com",
    "SenderPassword": "encrypted_password",
    "SmtpServer": "smtp.gmail.com",
    "Port": 587,
    "EnableSsl": true
  },
  "IsTestMail": "0",
  "TestMail": "test@example.com",
  "SSBMail": "ssb@socialsecurity.gov.kn"
}
```

**Configuration Keys**:
- `IsTestMail`: "1" to send all emails to test address, "0" for production
- `TestMail`: Test email address for development
- `SSBMail`: Social Security Board official email

### Email Templates

Templates stored in: `wwwroot/Email/`

**RazorLight Engine**:
- Compiles Razor templates at runtime
- Supports dynamic data binding
- Generates HTML content

**Example Template Structure**:
```cshtml
@model TransactionReceipt

<!DOCTYPE html>
<html>
<head>
    <title>Payment Receipt</title>
</head>
<body>
    <h1>Payment Receipt</h1>
    <p>Receipt #: @Model.receiptNumber</p>
    <p>Amount: $@Model.Amount</p>
    <!-- More content -->
</body>
</html>
```

### PDF Generation for Receipts

**Process**:
1. Render Razor template to HTML
2. Convert HTML to PDF using iText
3. Attach PDF to email
4. Send email with attachment

**Code Flow**:
```csharp
string htmlContent = await engine.CompileRenderAsync("payment.cshtml", model);
byte[] pdfBytes = await GeneratePdfFromHtml(htmlContent);
message.Attachments.Add(new Attachment(new MemoryStream(pdfBytes), "Receipt.pdf"));
await smtpClient.SendMailAsync(message);
```

### Error Handling

1. **SMTP Failures**
   - Log error details
   - Display message: "Email could not be sent at this time"
   - Payment still processed successfully

2. **Template Errors**
   - Fallback to plain text email
   - Log template rendering error

3. **Attachment Failures**
   - Send email without attachment
   - Notify user to download receipt from portal

### Business Rules
- All payment receipts emailed within 5 minutes
- Failed email attempts logged
- Users can resend verification emails
- SSB receives notification for all successful payments
- Email delivery does not block payment processing
- Test mode sends all emails to configured test address

---

## 22. Dashboard Analytics Flow

### Business Purpose
System provides comprehensive dashboard showing contribution summaries, payment status, pending C3 forms, and financial analytics for employers and administrators.

### Dashboard Components

#### 1. Employer Dashboard

**Data Displayed**:
- Total employees
- Pending C3 count
- Submitted C3 count
- Total contributions (current month)
- Payment status summary
- Recent transactions

**API Endpoint**: `/api/Payment/loaddashboardPaymentStatus`

**Parameters**:
- `CompanyId`: Company identifier
- `FromMonth`: Start month filter
- `ToMonth`: End month filter
- `Year`: Year filter
- `ResultArea`: Data area to load (optional)

**Response Structure**:
```json
{
  "EmployeesContribution": {
    "totalEmployees": 50,
    "totalWages": 125000.00,
    "totalSS": 12500.00,
    "totalLevy": 6250.00
  },
  "total": 18750.00,
  "Pendingc3": 2,
  "Pendingc3Foreground": "red",
  "dashboard_list": [
    {
      "C3headerid": 123,
      "PeriodMonth": "January",
      "PeriodYear": "2024",
      "Status": "Pending",
      "PayDetails": []
    }
  ],
  "DirectorsContribution": {
    "totalDirectors": 3,
    "totalDirectorWages": 30000.00
  },
  "Director_dashboard_list": []
}
```

#### 2. Admin Dashboard

**Additional Data**:
- All companies' contributions
- Total system revenue
- Payment gateway statistics
- Unreconciled payments
- Failed transactions

**API Endpoint**: `/api/AdminDash/GetAdminDashboard`

### Dashboard Calculations

#### Employee Contributions Summary
```sql
SELECT 
    COUNT(DISTINCT pc.SSN) as TotalEmployees,
    SUM(pc.Wages1 + pc.Wages2 + pc.Wages3 + pc.Wages4 + pc.Wages5 + 
        pc.Hpay + pc.Bonus) as TotalWages,
    SUM(pc.SocialSecurityEe + pc.SocialSecurityEr) as TotalSS,
    SUM(pc.LevyEr) as TotalLevy,
    SUM(pc.ServayanceEe + pc.ServayanceEr) as TotalSeverance
FROM ProcessContribution pc
INNER JOIN ProcessC3header ch ON pc.C3headerid = ch.C3headerid
WHERE ch.CompanyId = @CompanyId
AND ch.PerioddMonth = @Month
AND ch.PeriodYear = @Year
AND ch.ForDirector = 0
```

#### Director Contributions Summary
```sql
SELECT 
    COUNT(DISTINCT pc.SSN) as TotalDirectors,
    SUM(pc.DirectorWage) as TotalDirectorWages,
    SUM(pc.SocialSecurity) as TotalSS
FROM ProcessContribution pc
INNER JOIN ProcessC3header ch ON pc.C3headerid = ch.C3headerid
WHERE ch.CompanyId = @CompanyId
AND ch.PerioddMonth = @Month
AND ch.PeriodYear = @Year
AND ch.ForDirector = 1
```

#### Pending C3 Count
```sql
SELECT COUNT(*) as PendingCount
FROM ProcessC3header
WHERE CompanyId = @CompanyId
AND (IsSubmitted = 0 OR IsSubmitted IS NULL)
AND PeriodYear = @Year
```

### Payment Status Filtering

Users can filter dashboard data by:
- Payment status (Pending, Completed, Failed)
- Date range (From Date, To Date)
- Period (From Month, To Month, Year)

**Filter Application**:
```csharp
var filteredPayments = c3List
    .Where(c3 => c3.PayDetails != null)
    .Where(c3 => 
        (status == null || c3.PayDetails.Any(p => p.TransactionStatus == status)) &&
        (fromDate == null || c3.PayDetails.Any(p => p.TransactionDate >= fromDate)) &&
        (toDate == null || c3.PayDetails.Any(p => p.TransactionDate <= toDate))
    )
    .ToList();
```

### Visual Indicators

**Status Colors**:
- Pending: Red
- Submitted: Yellow
- Paid: Green
- Failed: Red

**Charts** (Frontend):
- Monthly contribution trends
- Employee vs Director breakdown
- Payment method distribution
- Contribution type pie chart (SS, Levy, Severance)

### Business Rules
- Dashboard data refreshes on page load
- Filters persist in session
- Pending C3 highlighted in red
- Overdue payments flagged
- Real-time payment status updates

---

## 23. Transaction History and Reporting Flow

### Business Purpose
Comprehensive transaction history for all payments with advanced filtering, searching, and export capabilities.

### Transaction History Features

#### 1. Admin Transaction History

**API Endpoint**: `/api/Payment/AdminTranactionHistory`

**Parameters**:
- `PaymentStatus`: Filter by status
- `FromDate`: Start date
- `ToDate`: End date
- `CompanyId`: Specific company (optional)
- `UserId`: Specific user (optional)
- `types`: Transaction type (Employee, Director, SelfEmployee)
- `pageNumber`: Pagination page
- `pageSize`: Records per page

**Response**:
```json
{
  "Status": true,
  "Message": "data found",
  "Data": {
    "transactions": [],
    "totalCount": 150,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 15
  }
}
```

#### 2. Transaction Details

**API Endpoint**: `/api/Payment/TransactionReport`

**Parameters**:
- `userId`: User identifier
- `C3HeaderId`: C3 header reference
- `transactionId`: Transaction ID (optional)

**Returns**:
- Complete transaction details
- Payment breakdown
- Receipt number
- Registration number
- Period covered
- Payment method
- Transaction status

### Offline Payment Details

For offline payments, system returns additional fields:
- Bank name
- Check number and date
- Journal voucher number and date
- BIMA reference number
- Transaction date

**API Endpoints**:
- `/api/Payment/getOfflinePaymentsDetails` - Query by receipt ID

### Export Capabilities

#### PDF Export
- Individual transaction receipts
- Generates PDF using iText
- Includes all transaction details
- Company branding

#### Excel Export
- Bulk transaction export
- Filtered transaction lists
- Customizable columns
- Date range exports

### Business Rules
- All transactions logged (successful and failed)
- Transaction history immutable
- Pagination for large datasets (default 10 per page)
- Transactions searchable by multiple criteria
- Export limited to user's permissions

---

## 24. Audit Logging Flow

### Business Purpose
Complete audit trail of all system actions for compliance, security, and troubleshooting.

### Audit Log Types

#### 1. User Actions
**Logged Events**:
- Login/logout
- Password changes
- Profile updates
- Email verifications

**Storage**: LoginLog table

**Fields**:
- `LogId` (INT, IDENTITY)
- `UserId` (INT)
- `LoginDate` (DATETIME)
- `LogoutDate` (DATETIME)
- `IpAddress` (VARCHAR(50))
- `UserAgent` (VARCHAR(500))
- `Success` (BIT)
- `FailureReason` (VARCHAR(500))

#### 2. Employee Changes
**Logged Events**:
- Employee creation
- Employee updates
- Employee deletion (soft delete)

**Storage**: AuditLog table

**Fields**:
- `AuditId` (INT, IDENTITY)
- `TableName` (VARCHAR(100)) - Table affected
- `RecordId` (INT) - Record ID
- `Action` (VARCHAR(20)) - INSERT, UPDATE, DELETE
- `UserId` (INT) - Who made change
- `ChangeDate` (DATETIME) - When changed
- `OldValues` (TEXT) - JSON of old values
- `NewValues` (TEXT) - JSON of new values
- `Details` (VARCHAR(500)) - Change description

#### 3. Payment Transactions
**Logged Events**:
- Payment attempts
- Payment successes
- Payment failures
- Refunds
- Reconciliation actions

**Storage**: OnlinePayments + CustomErrorLog

#### 4. System Errors
**Logged Events**:
- API exceptions
- Database errors
- Integration failures
- Payment gateway errors

**Storage**: ExceptionLog, ErrorLog, CustomErrorLog

**ExceptionLog Fields**:
- `ExceptionId` (INT, IDENTITY)
- `ExceptionMessage` (TEXT)
- `StackTrace` (TEXT)
- `InnerException` (TEXT)
- `Source` (VARCHAR(255))
- `Controller` (VARCHAR(100))
- `Action` (VARCHAR(100))
- `UserId` (INT)
- `CreatedDate` (DATETIME)
- `IpAddress` (VARCHAR(50))

### Logging Implementation

**Middleware**: ExceptionMiddleware

**Usage**:
```csharp
var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
```

**LoggingHelper Methods**:
- `LogError()` - Log exceptions
- `LogInfo()` - Log information
- `LogWarning()` - Log warnings
- `LogDebug()` - Log debug info

### Audit Queries

Administrators can query audit logs by:
- User
- Date range
- Action type
- Table/entity
- Success/failure

### Business Rules
- All sensitive operations logged
- Logs retained for 7 years (compliance)
- PII in logs encrypted
- Log access restricted to admins
- Logs cannot be modified or deleted
- Failed login attempts tracked for security

---

## 25. Self-Employed User Flow

### Business Purpose
Self-employed individuals can register and manage their own contributions without an employer. System provides separate workflow for self-employed users.

### Self-Employed Registration

1. **Registration Initiation**
   - User selects "Self-Employed Registration"
   - Different form from employer registration

2. **SSN Validation**
   - User enters SSN and email
   - System validates against BIMA database
   - Endpoint: `/api/Auth/TextChangeSsnSelfRegister`

3. **BIMA Data Import**
   - If SSN found in BIMA:
     - Auto-populates personal details
     - Validates email matches
     - Retrieves contribution history

4. **Self-Employed Account Creation**
   - Creates Secuser record with IsSelfEmployee = true
   - Creates SelfEmployee record (not MasterEmployee)
   - Links to self-employment category

### Self-Employed C3 Generation

**Differences from Employer C3**:
- Single employee (self)
- Fixed contribution amounts by category
- Monthly contribution schedule
- Simplified wage entry

**API Endpoint**: `/api/SelfEmployee/CreateC3`

**Flow**:
1. Self-employed user selects contribution month/year
2. System loads their category and rate
3. User confirms contribution amount
4. System creates ProcessSelfEmployedC3 record
5. Calculates total contributions (SS + penalties if late)

### Database Tables

#### SelfEmployee Table
- `EmployeeId` (INT, IDENTITY) - Primary key
- `EmplCode` (VARCHAR(10), NULL) - Employee code
- `SocSecNum` (VARCHAR(20), NULL) - SSN
- `FirstName` (VARCHAR(50), NULL) - First name
- `MiddleName` (VARCHAR(50), NULL) - Middle name
- `LastName` (VARCHAR(50), NULL) - Last name
- `CategoryType` (INT, NULL) - Self-employment category
- `Email` (VARCHAR(100), NULL) - Email address
- `Address1` (VARCHAR(100), NULL) - Address
- `City` (VARCHAR(50), NULL) - City
- `State` (VARCHAR(50), NULL) - State
- `Phone` (VARCHAR(20), NULL) - Phone
- `BirthDate` (DATETIME, NULL) - Date of birth
- `Gender` (VARCHAR(10), NULL) - Gender
- `AppintDate` (DATETIME, NULL) - Registration date
- `IsActive` (BIT, NULL) - Active status

#### ProcessSelfEmployedC3 Table
- `Sec3id` (INT, IDENTITY) - Primary key
- `Ssn` (VARCHAR(20), NULL) - SSN
- `PerioddMonth` (VARCHAR(10), NULL) - Period month
- `PeriodYear` (VARCHAR(4), NULL) - Period year
- `TotalContributions` (DECIMAL(18,2), NULL) - Total contributions
- `TotalFine` (DECIMAL(18,2), NULL) - Late payment fine
- `IsSubmitted` (BIT, NULL) - Submission status
- `SubmittedDate` (DATETIME, NULL) - Submission date
- `PaymentStatus` (VARCHAR(20), NULL) - Payment status

#### SelfEmployedSetting Table
- `SettingId` (INT, IDENTITY) - Primary key
- `CategoryType` (INT, NULL) - Category identifier
- `CategoryName` (VARCHAR(100), NULL) - Category name
- `MonthlyRate` (DECIMAL(18,2), NULL) - Monthly contribution
- `SSRate` (DECIMAL(5,4), NULL) - SS rate
- `EffectiveDate` (DATETIME, NULL) - Rate effective date
- `IsActive` (BIT, NULL) - Active status

### Self-Employed Categories

Examples:
1. **Category 1**: Professionals (Lawyers, Doctors)
   - Monthly contribution: $150

2. **Category 2**: Small Business Owners
   - Monthly contribution: $100

3. **Category 3**: Tradespeople
   - Monthly contribution: $75

### Self-Employed Payment

- Same payment gateways (CyberSource, PayPal)
- Offline payments supported
- Receipt generation
- BIMA posting

**API Endpoint**: `/api/Payment/GetOfflinePaymentDataSelfEmp`

### Business Rules
- Self-employed pay fixed monthly amounts by category
- Late payments incur penalties
- Category can be changed annually
- Must maintain continuous contributions
- Separate C3 forms from employers

---

## Complete Database Schema Reference

### Updated Field Mappings

This section provides the complete, accurate database schema based on the actual implementation.

#### Secuser (Complete)
```sql
CREATE TABLE Secuser (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NULL,
    MiddleName VARCHAR(50) NULL,
    LoginId VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    EmailId VARCHAR(100) NULL,
    SelfEmpId VARCHAR(20) NULL,
    EmpId VARCHAR(20) NOT NULL,
    Department VARCHAR(100) NULL,
    RoleId INT NOT NULL,
    InsertedBy INT NULL,
    InsertedOn DATETIME NULL,
    InsertedMachineInfo VARCHAR(255) NULL,
    UpdatedBy INT NULL,
    UpdatedOn DATETIME NULL,
    UpdatedMachineInfo VARCHAR(255) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    IsSelfEmployee BIT NULL DEFAULT 0,
    LastLoginTime DATETIME NULL,
    IsLoggedIn BIT NOT NULL DEFAULT 0,
    UserExpiresOn DATETIME NULL,
    PwdExpiresOn DATETIME NULL,
    LastPwdUpddate DATETIME NULL,
    Status BIT NULL DEFAULT 1,
    UserImage VARCHAR(500) NULL,
    Parentuserid INT NULL,
    IsPpoc BIT NULL DEFAULT 0,
    REG_NUMBER VARCHAR(50) NULL,
    token VARCHAR(50) NULL,
    userstts VARCHAR(20) NULL
)
```

#### ProcessC3header (Complete)
```sql
CREATE TABLE ProcessC3header (
    C3headerid INT IDENTITY(1,1) PRIMARY KEY,
    RegNo VARCHAR(50) NULL,
    PerioddMonth VARCHAR(20) NULL,
    PeriodYear VARCHAR(4) NULL,
    TotalWages FLOAT NULL,
    TotalSscontributions FLOAT NULL,
    TotalLevyeeemployee FLOAT NULL,
    TotalLevyeeemployer FLOAT NULL,
    TotalServayance FLOAT NULL,
    TotalLevyeepenalty FLOAT NULL,
    TotalPepenalty FLOAT NULL,
    TotalSspenalty FLOAT NULL,
    InsertDatetimeinfo DATETIME NULL,
    InsertMachineinfo VARCHAR(255) NULL,
    PrintDatetimeinfo DATETIME NULL,
    EmployerId INT NULL,
    ForDirector BIT NULL DEFAULT 0,
    ScheduleNo INT NULL,
    IsFianalize BIT NULL DEFAULT 0,
    IsSubmitted BIT NULL DEFAULT 0,
    Notes TEXT NULL,
    C3SubmittedDate DATETIME NULL,
    C3SubmittedBy INT NULL,
    C3IsFinalized BIT NULL DEFAULT 0,
    C3FinalizedDate DATETIME NULL,
    C3FinalizedBy INT NULL,
    IsUnLocked BIT NULL DEFAULT 0,
    ErrorDesc TEXT NULL,
    InsertedBy INT NULL,
    ModifiedBy INT NULL,
    ModifiedMachineinfo VARCHAR(255) NULL,
    PrintBy INT NULL,
    ExportBy INT NULL,
    IsImportFromBema BIT NULL DEFAULT 0,
    UserName VARCHAR(50) NULL,
    ModifiedOn DATETIME NULL,
    ExportOn DATETIME NULL,
    OrderName VARCHAR(100) NULL,
    OrderKey VARCHAR(100) NULL,
    isNilReturn BIT NULL DEFAULT 0,
    IsSentForEdit BIT NULL DEFAULT 0,
    isImportC3file BIT NULL DEFAULT 0,
    ImportC3Filepath VARCHAR(500) NULL,
    EditPermittedBy INT NULL,
    SentOnForEdit DATETIME NULL
)
```

#### OnlinePayments (Complete)
```sql
CREATE TABLE OnlinePayments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    C3HeaderId INT NULL,
    PaymentGatewayTransactionID VARCHAR(100) NULL,
    PaymentAmount DECIMAL(18,2) NULL,
    Currency VARCHAR(3) NULL DEFAULT 'USD',
    PaymentStatus VARCHAR(50) NULL,
    mode VARCHAR(50) NULL, -- CyberSource, PayPal, Bank, Check, JV
    RefCustomerName VARCHAR(100) NULL,
    Email VARCHAR(100) NULL,
    CreatedOn DATETIME NULL DEFAULT GETDATE(),
    TransactionFor VARCHAR(20) NULL, -- Employee, Director, Self
    RegNumber VARCHAR(50) NULL,
    
    -- Payment Breakdown
    totalSscontributions DECIMAL(18,2) NULL,
    totalLeavy DECIMAL(18,2) NULL,
    totalServayance DECIMAL(18,2) NULL,
    totalSspenalty DECIMAL(18,2) NULL,
    totalPepenalty DECIMAL(18,2) NULL,
    totalLevyeepenalty DECIMAL(18,2) NULL,
    
    -- Reconciliation
    IsReconciled BIT NULL,
    ReconciledBy INT NULL,
    ReconciledOn DATETIME NULL,
    Notes TEXT NULL,
    
    -- BIMA Integration
    bimaReceiptNumber VARCHAR(50) NULL,
    BimaRefNum VARCHAR(50) NULL,
    
    -- Offline Payment Details
    BankName VARCHAR(100) NULL,
    checkNum VARCHAR(50) NULL,
    checkDate DATETIME NULL,
    JVNumber VARCHAR(50) NULL,
    jvDate DATETIME NULL,
    transactionDate DATETIME NULL
)
```

---

## API Endpoint Complete Reference

### Authentication & User Management
```
POST   /api/Auth/RegisterCompanyNew          - Company registration
POST   /api/Auth/Login                        - User login
POST   /api/Auth/ForgetPasswordbtnNext        - Initiate password reset
POST   /api/Auth/ForgotPassword               - Reset password
POST   /api/Auth/ResetPassword                - Change password
POST   /api/Auth/VerifyMFAOtp                 - Verify MFA OTP
POST   /api/Auth/TextChangeUserRegister       - Check username availability
GET    /api/Auth/TextChangeSsnSelfRegister    - Validate SSN for self-employed
POST   /api/Auth/TextChangeUserEmail          - Check email availability
GET    /api/Auth/QuestionAnswerForget         - Get security questions
POST   /api/Auth/btnNext_Click                - Existing user verification
GET    /api/Auth/varificatiion_code           - Verify verification code
GET    /api/Auth/ImportVerifiedDatainSSB      - Import from BIMA
GET    /api/Auth/ReSendvarifycode             - Resend verification
POST   /api/Auth/SaveEmployeer                - Save employer details
```

### Employee Management
```
GET    /api/C3/GetAllEmployee                 - List all employees
POST   /api/C3/SaveEmployee                   - Create/update employee
GET    /api/C3/GetEmployeeByid                - Get employee by ID
GET    /api/C3/DeleteEmployee                 - Delete employee
GET    /api/C3/Get_EmployeeDetails_SSB_Click  - Get employee from BIMA
GET    /api/C3/btnImportEmp_Click             - Import employee
```

### C3 Forms & Contributions
```
GET    /api/C3/Load_Wages_Bonus_PayEmployee   - Load bonus data
POST   /api/C3/SaveBonus                      - Save bonus
POST   /api/C3/UpdateBonus                    - Update bonus
POST   /api/C3/DeleteBonus                    - Delete bonus
POST   /api/C3/SaveEmployeeHoliday            - Save holiday pay
GET    /api/C3/GetHolidayPayByEmployee        - Get holiday pay
POST   /api/C3/AddDirectorWagesHolidayPay     - Add director wages
GET    /api/C3/GetEmployee_List               - Get employee list
```

### Payment Processing
```
POST   /api/Payment/BuySubscription           - Process subscription payment
POST   /api/Payment/Paymentsuccess            - PayPal success callback
POST   /api/Payment/PaymentCancel             - PayPal cancel callback
POST   /api/Payment/payNowDataCyberSource     - CyberSource payment
POST   /api/Payment/OfflinepayNowDataCyberSource - Offline payment entry
GET    /api/Payment/CardDetailsByCyber        - Get saved card details
POST   /api/Payment/CardDetailsUpdateAndDel   - Update/delete card
GET    /api/Payment/TransactionReport         - Transaction details
```

### Payment Reconciliation
```
GET    /api/Payment/GetReconciliationData     - Get reconciliation data
GET    /api/Payment/GetReconciliationDataCyber - Get CyberSource reconciliation
POST   /api/Payment/UploadExcelData           - Upload Excel reconciliation
POST   /api/Payment/UploadCyberCsv            - Upload CyberSource CSV
POST   /api/Payment/UploadCyberJson           - Upload JSON data
POST   /api/Payment/UpdateReconciliationData  - Bulk reconciliation
POST   /api/Payment/UpdateReconciliationNotes - Add reconciliation notes
POST   /api/Payment/GetReconcilNotes          - Get note history
GET    /api/Payment/GetCyberSourceFields      - Get column config
POST   /api/Payment/PostCyberSourceList       - Save column config
```

### Dashboard & Reporting
```
GET    /api/Payment/loaddashboardPaymentStatus - Load dashboard data
POST   /api/Payment/AdminTranactionHistory     - Admin transaction history
GET    /api/Payment/GetOfflinePaymentData      - Offline payment details
GET    /api/Payment/GetOfflinePaymentDataDirector - Director offline payment
GET    /api/Payment/GetOfflinePaymentDataSelfEmp - Self-employed offline payment
GET    /api/Payment/getOfflinePaymentsDetails  - Query offline payment by receipt
```

### Administration
```
GET    /api/Administration/GetUserProfile     - Get user profile
POST   /api/Administration/EditUserProfile    - Update user profile
POST   /api/Administration/ResetPassword      - Reset password
POST   /api/Administration/Logout             - User logout
```

### Settings & Configuration
```
POST   /api/Payment/saveConfigCyberSource     - Save CyberSource config
POST   /api/Payment/updateStatusConfig        - Update config status
```

### Self-Employed
```
POST   /api/SelfEmployee/SaveEmployeeSettings - Save self-employed settings
GET    /api/SelfEmployee/Create               - Create self-employed C3
```

---

This documentation now provides complete business flow reference for the C3 Wizard application, including all features, integrations, database schemas, and API endpoints needed to fully recreate the system.</content>
<parameter name="filePath">d:\Projects\Neeraj Sir APP\C3_Wizard_Business_Flow_Documentation.md