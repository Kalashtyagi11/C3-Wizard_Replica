# 16. Complete Validation Rules

**Document Version**: 1.0  
**Last Updated**: January 21, 2026  
**Purpose**: All field validation rules extracted from frontend code for 100% replica accuracy

---

## General Validation Patterns

### Required Field Validation

All required fields show inline error messages below the field labeled in **red text**:
```
"This field is required"
```

###

 Toast Notification Style

```typescript
// Success (green background)
toast.success("Message here");

// Error (red background)
toast.error("Error message here");

// Warning (yellow background)
toast.warning("Warning message here");

// Info (blue background)
toast.info("Info message here");
```

---

## C3 Form Generation Validation

### Period Selection

| Field | Validation Rule | Error Message |
|-------|----------------|---------------|
| Month | Required, Must be 1-12 | "Please select Month and Year." |
| Year | Required, 4-digit year | "Please select Month and Year." |
| Pay Period | Must select at least one checkbox (W, E2W, M, 2M) | "Please select at least one Pay Period." |

### Employee Selection

| Rule | Error Message |
|------|---------------|
| Must select at least 1 employee | "Please select at least one employee with corrected data." |
| Cannot generate C3 with no employees (unless Nil Return) | Auto-shows "Nil Return" toggle if no employees |

### Validation Before Preview/Save

**Error Messages (Combined)**:
```typescript
const errorMessages = [];

if (!month || !year) {
  errorMessages.push("Month and Year");
}

if (!CmbPayPeriod || CmbPayPeriod.length === 0) {
  errorMessages.push("Pay Period");
}

if (errorMessages.length > 0) {
  toast.error(`Please Select  ${errorMessages.join(', ').replace(/, ([^,]*)$/, ' & $1')}`);
}
```

**Example Output**:
- "Please Select Month and Year & Pay Period"
- "Please Select Pay Period"

---

## Employee Management Validation

### SSN (Social Security Number)

| Validation Rule | Regex Pattern | Error Message |
|----------------|---------------|---------------|
| Format: `XXX-XX-XXXX` | `/^\d{3}-\d{2}-\d{4}$/` | "Invalid SSN format. Use XXX-XX-XXXX" |
| Required | Not empty | "SSN is required" |
| Must be unique per company | Database check | "This SSN already exists for this company" |
| Must be 9 digits (with dashes) | Length check | "SSN must be exactly 9 digits" |

**Formatting**:
- Auto-format as user types: `123456789` → `123-45-6789`
- Strip dashes before saving to database (store as `123456789`)

### Email

| Validation Rule | Pattern | Error Message |
|----------------|---------|---------------|
| Valid email format | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | "Please enter a valid email address" |
| Required for user accounts | Not empty | "Email is required" |
| Must be unique | Database check | "This email is already registered" |

### Phone Numbers

| Field | Format | Example | Error Message |
|-------|--------|---------|---------------|
| Phone | `XXX-XXX-XXXX` | `869-465-1234` | "Invalid phone number format" |
| Mobile | `XXX-XXX-XXXX` | `869-662-5678` | "Invalid mobile number format" |

### Names

| Field | Validation | Max Length | Error Message |
|-------|-----------|------------|---------------|
| First Name | Required, Letters only | 100 chars | "First name is required" / "First name contains invalid characters" |
| Last Name | Required, Letters only | 100 chars | "Last name is required" / "Last name contains invalid characters" |
| Middle Name | Optional, Letters only | 100 chars | "Middle name contains invalid characters" |

### Birth Date

| Validation Rule | Error Message |
|----------------|---------------|
| Required | "Birth date is required" |
| Must be in past | "Birth date cannot be in the future" |
| Employee must be between 16-62 years old (for contributions) | "Employee must be between 16 and 62 years old to contribute to Social Security" |

### Pay Period

| Value | Display Text | Validation |
|-------|--------------|------------|
| `W` | Weekly | Required for employee |
| `E2W` | Every Two Weeks | Required for employee |
| `M` | Monthly | Required for employee |
| `2M` | Twice Monthly | Required for employee |

**Note**: Old code used `B` for biweekly and `S` for semi-monthly, converted to `E2W` and `2M` respectively.

---

## Wages & Contribution Validation

### Wage Entry

| Field | Validation | Format | Error Message |
|-------|-----------|--------|---------------|
| WAGES1-5 | Decimal, max 2 decimal places | `0.00` | Auto-formats to 2 decimals |
| Holiday Pay | Decimal, max 2 decimals | `0.00` | Auto-formats |
| Bonus | Decimal, max 2 decimals | `0.00` | Auto-formats |
| Amount | Must be ≥ 0 | Non-negative | "Amount cannot be negative" |

### Weekly Paid Checkbox

| Field | Rule |
|-------|------|
| WEEK1-5 checkboxes | Auto-checked if wage > 0, can be manually toggled |
| Holiday Pay checkbox | Auto-checked if HPay > 0 |
| Bonus checkbox | Auto-checked if BONUS > 0 |

---

## Holiday Pay Validation

**From `Holiday.js`**:

| Rule | Error Message |
|------|---------------|
| Employee must be selected | "Please Select an Employee" |
| Amount must be entered | "Please Enter an amount" |
| From Date & To Date required | "Please Enter a From Date & To Date" |
| From Date cannot be > To Date | "From Date cannot be greater than To Date" |
| Leave Type must be selected | "Please Select leave Type" / "Please Select Leave Type" (inconsistent casing) |
| Pay Date must be valid | "Please Enter a valid Pay Date" |
| Type must be selected (Holiday/Sick) | "Please select a Type" |

---

## Bonus Validation

**From `Bonus.js`**:

| Rule | Error Message |
|------|---------------|
| Employee must be selected | "Please Select an Employee" |
| Payment Date required | "Please Select an Payment Date" |
| Amount required | "Please Select an Amount" |

---

## C3 File Upload Validation

**From `C3Generation.js`**:

| Rule | Error Message |
|------|---------------|
| File must be selected | "Please select a C3 file" |
| File extension must be `.c3` | "Invalid file type. Only .c3 files are allowed" |

---

## Report Period Validation

**From `Reports.js`**:

| Rule | Error Message |
|------|---------------|
| To Period cannot be smaller than From Period | "To Period cannot be smaller than From Period!" |
| Failed to fetch data | "Failed to fetch contribution data." |

---

## Payment Validation

### Online Payment (CyberSource/PayPal)

| Field | Validation | Error Message |
|-------|-----------|---------------|
| Amount | Must match C3 total | "Payment amount does not match C3 total" |
| Card Number | Valid credit card format | Handled by payment gateway |
| CVV | 3-4 digits | Handled by payment gateway |
| Expiry | MM/YY, future date | Handled by payment gateway |

### Offline Payment

| Field | Validation | Error Message |
|-------|-----------|---------------|
| Payment Method | Must select one (Check, Cash, Bank Transfer, Journal Voucher) | "Please select a payment method" |
| Amount | Required, decimal | "Amount is required" |
| Check Number | Required if method = Check | "Check number is required" |
| Bank Name | Required if method = Bank Transfer | "Bank name is required" |
| Transaction Reference | Optional | - |

---

## Admin Reconciliation Validation

**From `realtionShipSetting.jsx`**:

| Rule | Error Message |
|------|---------------|
| Parent company must be selected | "Please select a parent company" |
| At least one child company must be selected | "Please select at least one child company" |
| Mapping submission error | "Error submitting mapping" |

---

## Password Validation

| Rule | Pattern | Error Message |
|------|---------|---------------|
| Minimum 8 characters | Length ≥ 8 | "Password must be at least 8 characters" |
| Must contain uppercase | `/[A-Z]/` | "Password must contain at least one uppercase letter" |
| Must contain lowercase | `/[a-z]/` | "Password must contain at least one lowercase letter" |
| Must contain number | `/[0-9]/` | "Password must contain at least one number" |
| Must contain special char | `/[!@#$%^&*]/` | "Password must contain at least one special character (!@#$%^&*)" |

---

## OTP Validation

| Field | Validation | Timeout | Error Message |
|-------|-----------|---------|---------------|
| OTP Code | 6 digits | 10 minutes | "Invalid OTP code" |
| Attempts | Max 3 attempts | - | "Too many failed attempts. Please request a new OTP." |

---

## Security Questions

| Rule | Error Message |
|------|---------------|
| Must select 2 different questions | "Please select two different security questions" |
| Answers cannot be empty | "Security answers are required" |

---

## File Upload Validation

### Accepted File Types

| Module | Accepted Extensions | Max Size | Error Message |
|--------|-------------------|----------|---------------|
| C3 Import | `.c3` | Not specified | "Invalid file type. Only .c3 files are allowed" |
| Reconciliation | `.csv`, `.xlsx` | 25 MB | "File size exceeds 25MB limit" |
| Profile Image | `.jpg`, `.jpeg`, `.png` | 2 MB | "Image size exceeds 2MB limit" |

---

## Date Range Validation

| Context | Rule | Error Message |
|---------|------|---------------|
| Report Periods | From Date ≤ To Date | "To Period cannot be smaller than From Period!" |
| Holiday Pay | From Date ≤ To Date | "From Date cannot be greater than To Date" |
| Employment Dates | Hire Date ≤ Termination Date (if exists) | "Termination date cannot be before hire date" |

---

## Decimal Precision Rules

All monetary amounts:
- **Input**: Accept up to 4 decimal places
- **Storage**: Store as `DECIMAL(18, 2)`
- **Display**: Always show 2 decimal places (`$1,234.56`)
- **Auto-format**: On blur, round/truncate to 2 decimals

---

## Nil Return Toggle

| Rule | Behavior |
|------|----------|
| No employees for selected period | Auto-show "Nil Return" toggle option |
| Nil Return enabled | Allow C3 submission with 0 employees |
| Nil Return disabled | Require at least 1 employee |

---

## Summary of All Error Messages (Alphabetical)

```
- "Amount cannot be negative"
- "Amount is required"
- "Birth date cannot be in the future"
- "Birth date is required"
- "Check number is required"
- "Check your internet connection or the server may not be responding."
- "Email is required"
- "Email must be a valid email address"
- "Employee must be between 16 and 62 years old to contribute to Social Security"
- "Error submitting mapping"
- "Failed to delete bonus."
- "Failed to fetch contribution data."
- "Failed to post payment to BIMA"
- "File size exceeds 25MB limit"
- "First name contains invalid characters"
- "First name is required"
- "From Date cannot be greater than To Date"
- "Image size exceeds 2MB limit"
- "Internal Server Error (500). Please try again later."
- "Invalid email address"
- "Invalid file type. Only .c3 files are allowed"
- "Invalid OTP code"
- "Invalid phone number format"
- "Invalid SSN format. Use XXX-XX-XXXX"
- "Last name contains invalid characters"
- "Last name is required"
- "Middle name contains invalid characters"
- "Password must be at least 8 characters"
- "Password must contain at least one number"
- "Password must contain at least one special character (!@#$%^&*)"
- "Password must contain at least one uppercase letter"
- "Payment amount does not match C3 total"
- "Please Enter a From Date & To Date"
- "Please Enter a valid Pay Date"
- "Please Enter an amount"
- "Please select a C3 file"
- "Please select a parent company"
- "Please select a payment method"
- "Please select a Type"
- "Please select at least one child company"
- "Please select at least one employee with corrected data."
- "Please select at least one Pay Period."
- "Please Select an Amount"
- "Please Select an Employee"
- "Please Select an Payment Date"
- "Please select leave Type"
- "Please Select Leave Type"
- "Please select Month and Year."
- "Please select two different security questions"
- "Security answers are required"
- "something went wrong"
- "Something went wrong"
- "SSN already exists for this company"
- "SSN is required"
- "SSN must be exactly 9 digits"
- "Termination date cannot be before hire date"
- "This email is already registered"
- "This field is required"
- "To Period cannot be smaller than From Period!"
- "Too many failed attempts. Please request a new OTP."
```

---

## Validation Implementation in Lovable

### Inline Field Validation (Example)

```typescript
// SSN Field
const [ssn, setSSN] = useState('');
const [ssnError, setSSNError] = useState('');

const validateSSN = (value: string) => {
  const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
  if (!value) {
    setSSNError('SSN is required');
    return false;
  }
  if (!ssnPattern.test(value)) {
    setSSNError('Invalid SSN format. Use XXX-XX-XXXX');
    return false;
  }
  setSSNError('');
  return true;
};

// Auto-format SSN as user types
const formatSSN = (value: string) => {
  const cleaned = value.replace(/\D/g, ''); // Remove all non-digits
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 5) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
};

return (
  <div>
    <input
      type="text"
      value={ssn}
      onChange={(e) => setSSN(formatSSN(e.target.value))}
      onBlur={() => validateSSN(ssn)}
      maxLength={11}  // 9 digits + 2 dashes
    />
    {ssnError && <span className="text-red-500 text-sm">{ssnError}</span>}
  </div>
);
```

---

**Complete Validation Rules Documentation** ✅
