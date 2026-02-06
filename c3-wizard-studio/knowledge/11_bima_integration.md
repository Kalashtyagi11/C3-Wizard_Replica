# 11. BIMA API Integration

**Document Version**: 1.0  
**Last Updated**: January 21, 2026  
**Purpose**: Complete documentation of BIMA (St. Kitts & Nevis Social Security Board) API integration

---

## Overview

C3 Wizard integrates with the **BIMA API** (St. Kitts & Nevis Social Security Board official system) for:
- **Employee data import** from BIMA to C3 Wizard
- **C3 form submission** from C3 Wizard to BIMA
- **Payment posting** to BIMA
- **Employee verification** against BIMA records

---

## Configuration

### Environment Variables

```typescript
// Required in Supabase Edge Function environment or .env
BIMA_API_BASE_URL=https://bima.sknsocialboard.gov.kn/api  // Example URL
BIMA_API_USERNAME=your_username
BIMA_API_PASSWORD=your_password
ENABLE_BIMA_AUTH=1  // Toggle between BIMA auth and local auth
```

### Configuration Keys (from appsettings.json in original)

```json
{
  "ServiceConfig": {
    "ServiceUriString": "https://bima.sknsocialboard.gov.kn/api",
    "AuthUser": "c3wizard_integration_user",
    "AuthPass": "encrypted_password_here"
  },
  "EnableBEMAAuthInsteadOfLocal": "1"  // 1 = Use BIMA auth, 0 = Use local auth
}
```

**Note**: "BEMA" and "BIMA" are used interchangeably in the codebase (typo in original).

---

## Authentication

### Basic Auth Header

All BIMA API calls use **HTTP Basic Authentication**:

```typescript
// Construct Basic Auth header
const authString = `${username}:${password}`;
const base64Auth = btoa(authString);  // Base64 encode
const headers = {
  'Authorization': `Basic ${base64Auth}`,
  'Content-Type': 'application/json'
};
```

### Conditional Authentication Logic

```typescript
// Use BIMA credentials if enabled, otherwise use employer's own credentials
const enableBimaAuth = process.env.ENABLE_BIMA_AUTH === '1';

const authCredentials = enableBimaAuth
  ? { username: process.env.BIMA_API_USERNAME, password: process.env.BIMA_API_PASSWORD }
  : { username: userLoginId, password: userPassword };  // Employer's own login
```

---

## API Endpoints

### 1. Get Employee Details by Query

**Endpoint**: `GET /Employee/getIpDetailsByQuery/{ssn},{birthDate},{firstName},{middleName},{lastName}`

**Purpose**: Fetch employee details from BIMA to auto-populate employee form

**Request**:
```http
GET /Employee/getIpDetailsByQuery/123456789,15-05-1990,John,Michael,Doe
Authorization: Basic {base64_credentials}
```

**Response**:
```json
[
  {
    "socSecNum": "123456789",
    "firstName": "John",
    "surName": "Doe",
    "birthDate": "15/05/1990",
    "gender": "M",
    "maritalStatus": "S",
    "streetAddress": "123 Main St",
    "streetName": "Main Street",
    "cityTownName": "Basseterre",
    "stateRegion": "St. George Basseterre",
    "postalCode": "KN0101",
    "countryCode": "KN",
    "email": "john.doe@example.com",
    "phone": "869-465-1234",
    "mobile": "869-662-5678",
    "occupation": "Software Engineer",
    "payPeriod": "1",  // 1=Weekly, 2=Biweekly, 3=Monthly, 4=Twice Monthly
    "wagesPaid1": "800.00",
    "wagesPaid2": "800.00",
    "wagesPaid3": "800.00",
    "wagesPaid4": "800.00",
    "wagesPaid5": "0.00",
    "isdirectorOnly": "false",
    "isemployeeDirector": "false"
  }
]
```

**Error Responses**:
- `404`: Employee not found in BIMA
- `400`: Invalid search parameters
- `401`: Authentication failed

---

### 2. Submit C3 Form (Bulk)

**Endpoint**: `POST /C3/c3BulkSubmit/{payerId}/C3Submitted/{month},{year},{scheduleNo},ER/EE`

**Purpose**: Submit complete C3 form with all employees to BIMA

**Request**:
```http
POST /C3/c3BulkSubmit/ER12345/C3Submitted/12,2025,1,ER/EE
Authorization: Basic {base64_credentials}
Content-Type: application/json
```

**Request Body**:
```json
{
  "c3Header": {
    "c3Status": "PEN",  // PEN = Pending
    "numberEmployed": 5,
    "calcEmpSsAmt": 500.00,
    "calcEmpLevyAmt": 150.00,
    "calcEmpPeAmt": 500.00,
    "totalEmpSsFines": 0.00,
    "totalEmpLevyPenalty": 0.00,
    "totalEmpPePenalty": 0.00,
    "dateReceived": "21/01/2026",
    "receivedBy": "System",
    "submittedByName": "John Smith",
    "submittedByEmail": "john.smith@company.com",
    "nilReturn": 0  // 0 = Normal return, 1 = Nil return (no employees)
  },
  "ipWages": [
    {
      "ssn": "123456789",
      "firstName": "John",
      "surName": "Doe",
      "birthDate": "15/05/1990",
      "payPeriod": "1",  // 1=Weekly
      "paidCode1": "1",  // 1=Paid, 0=Not paid
      "paidCode2": "1",
      "paidCode3": "1",
      "paidCode4": "1",
      "paidCode5": "0",
      "paidCode6": "1",  // Holiday pay
      "paidCode7": "0",  // Bonus
      "wagesPaid1": 800.00,
      "wagesPaid2": 800.00,
      "wagesPaid3": 800.00,
      "wagesPaid4": 800.00,
      "wagesPaid5": 0.00,
      "wagesPaid6": 200.00,  // Holiday pay
      "wagesPaid7": 0.00,    // Bonus
      "ipSsAmt": 100.00,     // Employee SS
      "erSsAmt": 100.00,     // Employer SS
      "ipLevyAmt": 80.00,    // Employee Levy
      "erLevyAmt": 96.00,    // Employer Levy
      "ipPeAmt": 100.00,     // Employee PE
      "erEiAmt": 100.00,     // Employer PE (EI in API response, actually PE)
      "startDate": null,
      "endDate": null,
      "wageType": null
    }
  ]
}
```

**Success Response** (200 OK):
```json
{
  "status": 200,
  "message": "C3 submitted successfully",
  "receiptId": "BIMA-2026-001234",  // BIMA-generated receipt number
  "scheduleNo": 1
}
```

**Error Responses**:
- `400`: Validation error (e.g., employee SSN not found in BIMA)
- `401`: Authentication failed
- `500`: BIMA server error

---

### 3. Retrieve Submitted C3

**Endpoint**: `GET /C3/{payerId}/C3Submitted/{month},{year},{scheduleNo},ER,EE`

**Purpose**: Retrieve C3 submission status and BIMA-assigned schedule number

**Request**:
```http
GET /C3/ER12345/C3Submitted/12,2025,1,ER,EE
Authorization: Basic {base64_credentials}
```

**Response**:
```json
{
  "c3Header": {
    "c3Status": "ACCEPTED",
    "scheduleNo": 1,
    "receiptId": "BIMA-2026-001234"
  },
  "ipWages": [
    {
      "ssn": "123456789",
      "status": "ACCEPTED"
    }
  ]
}
```

---

### 4. Delete C3 from BIMA

**Endpoint**: `DELETE /C3/deleteC3/{payerId}/C3Submitted/{month},{year},{scheduleNo},ER,EE`

**Purpose**: Delete a C3 form from BIMA (before finalization)

**Request**:
```http
DELETE /C3/deleteC3/ER12345/C3Submitted/12,2025,1,ER,EE
Authorization: Basic {base64_credentials}
Content-Type: application/json
```

**Request Body**:
```json
{
  "c3Header": { "numberEmployed": 1 },
  "ipWages": [
    { "ssn": "123456789" }
  ]
}
```

**Success Response** (200 OK):
```json
{
  "status": 200,
  "message": "C3 deleted successfully"
}
```

---

### 5. Post Payment to BIMA

**Endpoint**: `POST /Payment/PostPayment`

**Purpose**: Notify BIMA that payment was made for a C3 form

**Request Body**:
```json
{
  "payerId": "ER12345",
  "month": 12,
  "year": 2025,
  "scheduleNo": 1,
  "paymentAmount": 1500.00,
  "paymentDate": "21/01/2026",
  "paymentMethod": "CyberSource",  // CyberSource, PayPal, Bank Transfer, Check, Cash
  "transactionId": "CS-2026-9876543",
  "receiptNumber": "C3WIZ-000123"
}
```

**Success Response** (200 OK):
```json
{
  "status": 200,
  "message": "Payment posted successfully",
  "bimaReceiptNumber": "BIMA-PAY-2026-001234"
}
```

---

## Database Fields for BIMA Integration

### OnlinePayments Table

```sql
CREATE TABLE c3_payments (
  id SERIAL PRIMARY KEY,
  c3_header_id INTEGER REFERENCES c3_contribution_headers(id),
  payment_amount DECIMAL(18, 2),
  payment_status VARCHAR(50),  -- AUTHORIZED, PENDING, FAILED, Offline Payment
  bima_receipt_number VARCHAR(100),  -- Receipt number from BIMA
  bima_payment_response TEXT,  -- Full JSON response from BIMA payment API
  bima_ref_num VARCHAR(100),  -- BIMA reference number
  payment_gateway_transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### ProcessC3Header Table

```sql
CREATE TABLE c3_contribution_headers (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES c3_companies(id),
  month INTEGER,
  year INTEGER,
  schedule_no INTEGER,
  is_submitted BOOLEAN DEFAULT FALSE,
  bima_submit_response TEXT,  -- Full JSON response from BIMA C3 submission
  c3_submitted_date TIMESTAMP,
  c3_submitted_by INTEGER REFERENCES c3_users(id)
);
```

---

## Integration Workflows

### Workflow 1: Import Employee from BIMA

```
User Action: Click "Import from BIMA" on Add Employee screen

1. User enters: SSN, First Name, Last Name, Birth Date (minimum required)
2. Call BIMA API: GET /Employee/getIpDetailsByQuery/{ssn},{birthDate},{firstName},,{lastName}
3. If found:
   - Auto-populate all fields (address, phone, occupation, pay period, etc.)
   - User reviews and confirms
   - Save to c3_employees table
4. If not found:
   - Show error: "Employee not found in BIMA. Please enter manually."
   - Allow manual entry
```

### Workflow 2: Submit C3 to BIMA

```
User Action: Click "Submit" on C3 form (after finalizing)

1. Generate C3 payload (c3Header + ipWages array)
2. Call local DELETE endpoint first (to remove any previous submission):
   - DELETE /C3/deleteC3/{payerId}/C3Submitted/{month},{year},{scheduleNo},ER,EE
3. Call BIMA API: POST /C3/c3BulkSubmit/{payerId}/C3Submitted/{month},{year},{scheduleNo},ER/EE
4. If successful:
   - Call GET /C3/{payerId}/C3Submitted/{month},{year},{scheduleNo},ER,EE to get BIMA response
   - Update local database:
     - is_submitted = TRUE
     - bima_submit_response = JSON response
     - c3_submitted_date = NOW()
     - c3_submitted_by = current_user_id
   - Show success message with BIMA receipt number
5. If failed:
   - Show error message
   - Keep C3 as "Finalized" but not "Submitted"
   - Allow user to retry
```

### Workflow 3: Post Payment to BIMA

```
User Action: Payment is AUTHORIZED (via CyberSource/PayPal) or Offline Payment is recorded

1. Check if BIMA integration is enabled (ENABLE_BIMA_AUTH = 1)
2. If yes:
   - Call BIMA API: POST /Payment/PostPayment
   - Receive bimaReceiptNumber from response
   - Update c3_payments table:
     - bima_receipt_number = response.bimaReceiptNumber
     - bima_payment_response = full JSON response
3. If no:
   - Skip BIMA posting (for testing/staging environments)
```

---

## Error Handling

### Common BIMA API Errors

| Error Code | Message | Resolution |
|------------|---------|------------|
| 401 | Authentication failed | Check BIMA credentials in env variables |
| 404 | Employee not found | Employee does not exist in BIMA records |
| 400 | Invalid SSN format | Ensure SSN is 9 digits |
| 400 | C3 already submitted for this period | Use DELETE endpoint first, then resubmit |
| 500 | BIMA server error | Retry after 5 minutes, contact BIMA support if persistent |
| 503 | BIMA service unavailable | BIMA system is down for maintenance |

### Offline Mode

If BIMA API is unreachable:

```typescript
// Check connection before calling BIMA
const isOnline = await checkBIMAConnection();

if (!isOnline) {
  // Store submission locally
  await supabase
    .from('c3_contribution_headers')
    .update({
      is_submitted: false,  // Not submitted to BIMA yet
      pending_bima_submission: true,  // Flag for later sync
      local_finalized_date: new Date()
    })
    .eq('id', c3HeaderId);
  
  // Show warning to user
  showNotification({
    type: 'warning',
    message: 'C3 form finalized locally. BIMA is currently unavailable. Submission will be retried automatically.'
  });
}
```

### Retry Logic

```typescript
// Retry BIMA submission with exponential back off
async function submitToBIMAWithRetry(payload, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(bimaUrl, {
        method: 'POST',
        headers: { Authorization: `Basic ${base64Auth}` },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      // If 400 or 404, don't retry (client error)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`BIMA API error: ${response.statusText}`);
      }
      
      // If 500+ (server error), retry
      if (attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt) * 1000;  // 2s, 4s, 8s
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
}
```

---

## Testing BIMA Integration

### Test Mode Toggle

```typescript
// In Supabase Edge Function or environment config
const BIMA_TEST_MODE = process.env.BIMA_TEST_MODE === 'true';

if (BIMA_TEST_MODE) {
  // Use mock BIMA responses
  return mockBIMAResponse(endpoint, payload);
} else {
  // Call real BIMA API
  return callRealBIMAAPI(endpoint, payload);
}
```

### Mock BIMA Responses

```typescript
function mockBIMAResponse(endpoint: string, payload: any) {
  if (endpoint.includes('/Employee/getIpDetailsByQuery')) {
    return {
      status: 200,
      data: [{
        socSecNum: '123456789',
        firstName: 'Test',
        surName: 'Employee',
        // ... other fields
      }]
    };
  }
  
  if (endpoint.includes('/C3/c3BulkSubmit')) {
    return {
      status: 200,
      message: 'SUCCESS (TEST MODE)',
      receiptId: 'TEST-BIMA-001234',
      scheduleNo: payload.c3Header.scheduleNo || 1
    };
  }
}
```

---

## Security Considerations

### 1. Credential Storage

- ✅ **DO**: Store BIMA credentials in Supabase secrets (encrypted environment variables)
- ❌ **DON'T**: Hardcode credentials in code
- ❌ **DON'T**: Expose credentials in client-side code

### 2. Data Validation

Before sending to BIMA:
- Validate SSN format (9 digits, no dashes)
- Validate all monetary amounts (2 decimal places)
- Validate dates (dd/MM/yyyy format for BIMA)
- Ensure no special characters in names

### 3. Audit Logging

Log all BIMA API calls:

```typescript
await supabase.from('c3_audit_logs').insert({
  user_id: userId,
  action: 'BIMA_C3_SUBMIT',
  resource_type: 'C3_FORM',
  resource_id: c3HeaderId,
  details: {
    endpoint: bimaEndpoint,
    status_code: response.status,
    bima_response: response.data
  },
  ip_address: request.headers['x-real-ip'],
  created_at: new Date()
});
```

---

## Migration to ASP.NET Core

When migrating from Supabase to ASP.NET Core:

### Supabase Edge Function (Current)
```typescript
// Supabase Edge Function: functions/submit-to-bima/index.ts
export async function submitToBIMA(payload) {
  const response = await fetch(`${bimaUrl}/C3/c3BulkSubmit/...`, {
    method: 'POST',
    headers: { Authorization: `Basic ${base64Auth}` },
    body: JSON.stringify(payload)
  });
  return response.json();
}
```

### ASP.NET Core (Future)
```csharp
// ASP.NET Core Service: Services/BIMAService.cs
public class BIMAService {
  private readonly HttpClient _httpClient;
  private readonly IConfiguration _config;
  
  public async Task<BIMAResponse> SubmitC3Async(C3Payload payload) {
    var authBytes = Encoding.UTF8.GetBytes($"{_config["BIMA:Username"]}:{_config["BIMA:Password"]}");
    var base64Auth = Convert.ToBase64String(authBytes);
    
    _httpClient.DefaultRequestHeaders.Authorization = 
      new AuthenticationHeaderValue("Basic", base64Auth);
    
    var response = await _httpClient.PostAsJsonAsync(
      $"{_config["BIMA:BaseUrl"]}/C3/c3BulkSubmit/{payload.PayerId}/...",
      payload
    );
    
    return await response.Content.ReadAsAsync<BIMAResponse>();
  }
}
```

---

## Summary for Lovable

**CRITICAL**: BIMA integration is OPTIONAL but implemented in the original system.

For Lovable implementation:
1. **Include toggle**: `ENABLE_BIMA_INTEGRATION` environment variable
2. **If enabled (`true`)**:
   - Implement all BIMA API calls in Supabase Edge Functions
   - Use Basic Auth with credentials from Supabase secrets
   - Store `bima_receipt_number` and `bima_submit_response` in database
3. **If disabled (`false`)**:
   - Skip all BIMA API calls
   - System works standalone (for testing/demo)
4. **Always**:
   - Log all BIMA interactions in audit log
   - Handle errors gracefully (show user-friendly messages)
   - Implement retry logic for server errors

**Test Scenarios**:
- Employee import from BIMA (successful and not found)
- C3 submission to BIMA (successful and failed)
- Payment posting to BIMA
- BIMA API unavailable (offline mode)

---

**Document Complete** ✅
