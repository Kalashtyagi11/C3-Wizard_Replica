# Email Notifications & Templates

## Overview

The C3-Wizard application sends transactional emails for registration, authentication, payments, and account management.
**Important:** The recreated system MUST use **Supabase Edge Functions** with **SendGrid** (or Resend) instead of the legacy SMTP implementation.

## Email Provider Migration

- **Current System:** ASP.NET Core `SmtpClient` with `RazorLight` templates.
- **Recreated System (Lovable):** Supabase Edge Function (`send-email`) calling Resend API.

## List of Email Notifications

### 1. Registration Confirmation (Customer)

- **Trigger:** When a new employer/self-employed user successfully registers.
- **Recipient:** Customer Email.
- **Subject:** "C3 Remittances — Account Information"
- **Legacy Template:** `WelcomeCustomer.cshtml`
- **Data Required:**
  - `Name`: Customer Name
  - `LoginId`: Username
  - `Password`: Plain text password (Legacy behavior - _Recommendation: Do not send password in email for security, send activation link instead_)
  - `RegNumber`: Registration Number
  - `Country`: Country Name

### 2. Registration Notification (SSB Admin)

- **Trigger:** When a new registration occurs.
- **Recipient:** SSB Admin Email (`SSBMail` config).
- **Subject:** "New C3 Wizard Portal Registration Request {RegNumber} {CompanyName}"
- **Legacy Template:** `Welcome.cshtml`
- **Data Required:**
  - `CompanyName`
  - `RegNumber`
  - `TradeName`
  - `employmentType` (Company/SelfEmployed)
  - `IsLevyExempt` (Boolean)
  - `ContactPerson`
  - `Mobile`
  - `EmailId`

### 3. Account Activation/Verification Code

- **Trigger:** Local registration verification step.
- **Recipient:** Customer Email.
- **Subject:** "C3 Remittances — Account Activation"
- **Legacy Template:** `verifictionTemplate.cshtml`
- **Data Required:**
  - `Name`: Customer Name
  - `ActivationCode`: The verification code

### 4. OTP Verification (Login)

- **Trigger:** Login requiring 2FA/OTP.
- **Recipient:** Customer Email.
- **Subject:** "C3 Remittances — Login Otp"
- **Legacy Template:** `OtpVerificationLogin.cshtml`
- **Data Required:**
  - `Name`: Customer Name
  - `ActivationCode`: The OTP code

### 5. Payment Receipt (Customer)

- **Trigger:** Successful payment transaction via CyberSource.
- **Recipient:** Customer Email.
- **Subject:** "C3 Remittances Transaction {Name}"
- **Legacy Template:** `payment.cshtml` (Sent as PDF Attachment + HTML Body)
- **Data Required:**
  - `Name`: Customer Name
  - `receiptNumber`: Transaction Receipt #
  - `regNo`: Registration #
  - `Id`: Transaction ID
  - `PaymentStatus`: Status (e.g., AUTHORIZED)
  - `Amount`: Total Amount Paid
  - `date`: Transaction Date
  - `payC3Period`: Period (e.g., "2023 - October")
  - `PaymentHeaderdetails`: List of payment breakdown items (Code, Amount).

### 6. Payment Notification (SSB Admin)

- **Trigger:** Successful payment transaction.
- **Recipient:** SSB Admin Email.
- **Subject:** "C3 Remittances Transaction Alert - Payment received from {Name}"
- **Legacy Template:** `payment.cshtml` (Sent as PDF Attachment + HTML Body)
- **Data Required:** Same as Payment Receipt (Customer).

### 7. Password Reset

- **Trigger:** User requests password reset.
- **Recipient:** User Email.
- **Subject:** "C3 Wizard Reset Your Password!"
- **Legacy Template:** `WelcomeCustomerResetMail.cshtml`
- **Data Required:**
  - `Name`: User Name
  - `ResetPasswordUrl`: Link with token

### 8. Account Activation/Deactivation Alert

- **Trigger:** Admin manually activates or deactivates a user.
- **Recipient:** User Email.
- **Subject:** "C3 Remittances — Account Activation" OR "C3 Remittances — Account Deactivation"
- **Legacy Template:** `activationTemplate.cshtml`
- **Data Required:**
  - `FirstName`: User First Name
  - `IsActive`: Boolean status

### 9. Contact Us / Complaint

- **Trigger:** User submits "Contact Us" form.
- **Recipient:** SSB Support Email.
- **Subject:** "Complaint from {Name}"
- **Legacy Template:** `complaint.cshtml`

## Technical Implementation (Supabase Edge Function)

The system will use a single Edge Function `send-email` to handle all notifications.

### Function: `send-email`

**Endpoint:** `POST /functions/v1/send-email`

**Headers:**

- `Authorization`: `Bearer <anon_key>`
- `Content-Type`: `application/json`

**Payload Schema:**

```json
{
  "to": ["user@example.com"],
  "cc": ["admin@ssb.kn"],
  "template_id": "sendgrid_template_id_here",
  "dynamic_template_data": {
    "name": "John Doe",
    "receipt_number": "12345",
    "amount": "150.00",
    "action_url": "https://c3wizard.ssb.kn/login"
  },
  "attachments": [
    {
      "content": "base64_string...",
      "filename": "receipt.pdf",
      "type": "application/pdf"
    }
  ]
}
```

### SendGrid Template Mapping

Create the following Dynamic Templates in SendGrid dashboard and map them in `supabase/functions/send-email/index.ts`:

| Notification Type    | Legacy Template                   | SendGrid Template Name      | Key Variables                                              |
| -------------------- | --------------------------------- | --------------------------- | ---------------------------------------------------------- |
| Registration (User)  | `WelcomeCustomer.cshtml`          | `c3-welcome-customer`       | `name`, `login_id`, `reg_number`                           |
| Registration (Admin) | `Welcome.cshtml`                  | `c3-new-registration-alert` | `company_name`, `reg_number`, `contact_person`             |
| OTP Verification     | `OtpVerificationLogin.cshtml`     | `c3-otp-verification`       | `code`, `name`                                             |
| Payment Receipt      | `payment.cshtml`                  | `c3-payment-receipt`        | `receipt_number`, `amount`, `date`, `payment_rows` (array) |
| Password Reset       | `WelcomeCustomerResetMail.cshtml` | `c3-password-reset`         | `reset_url`, `name`                                        |

### PDF Generation Strategy

For payment receipts, the Edge Function should:

1. Generate the PDF using `pdf-lib` or a dedicated PDF service (e.g., Docraptor) based on the transaction data.
2. Convert PDF to Base64.
3. Attach to the SendGrid API call.

- **Recipient:** SSB Support Email.
- **Subject:** "SSB. C3 Wizard - Complaint / Feedback"
- **Legacy Template:** None (Raw String Body).
- **Data Required:**
  - `description`: Message content
  - `contactPerson`: Name
  - `companyName`: Company
  - `mobile`: Contact Number
  - `RegNo`: Registration Number

## Supabase Implementation Strategy

Create a Supabase Edge Function `send-email` that accepts a JSON payload:

```json
{
  "to": "user@example.com",
  "template": "payment_receipt",
  "data": {
    "name": "John Doe",
    "amount": 150.00,
    "receipt_number": "123456"
  }
}
```

The Edge Function should handle the logic to map the `template` key to the appropriate SendGrid Template ID or construct the HTML body dynamically if using a generic template.

**Note:** For PDF generation (Payment Receipts), use a library like `pdf-lib` or `jspdf` within the Edge Function or a dedicated `generate-pdf` function before sending the email.
