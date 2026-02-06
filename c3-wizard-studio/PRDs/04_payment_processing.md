# PRD 04: Payment Processing

**Module**: Payment Processing  
**Version**: 1.0  
**Last Updated**: January 22, 2026

---

## 📋 Overview

Payment Processing module handles online and offline payments for C3 contributions, generates receipts, and posts payments to BIMA.

**Referenced By**:
- Master PRD: `PRDs/00_MAIN_PRD.md`
- BIMA Integration: `knowledge/11_bima_integration.md`
- Database: `knowledge/04_database_schema_part2.md` (c3_payments table)

---

## 💳 Payment Methods

### 1. **CyberSource** (Primary - Credit/Debit Cards)
- Visa, Mastercard, American Express
- Integrated via CyberSource Secure Acceptance

### 2. **PayPal**
- PayPal account or PayPal credit/debit card
- Integrated via PayPal REST API

### 3. **Offline Payments**
- Bank Transfer
- Check
- Cash
- Journal Voucher

---

## 🔄 Payment Flow

```
C3 Form Submitted
  ↓
Show Payment Summary Screen
  ├─ Total Amount Due
  ├─ Breakdown (SS, EI, Levy, PE, Penalties)
  └─ Select Payment Method
  ↓
ONLINE PAYMENT              OFFLINE PAYMENT
  ↓                           ↓
Gateway Redirect            Record Payment Details
  ↓                           ↓
Process Payment             Admin Approval (optional)
  ↓                           ↓
Success / Failure           Mark as Pending
  ↓                           ↓
Update Database             ↓
  ↓                           ↓
Post to BIMA (optional)     Post to BIMA (when approved)
  ↓                           ↓
Generate Receipt            Generate Receipt
  ↓                           ↓
Email Receipt               Email Receipt
  ↓                           ↓
Dashboard
```

---

## 💰 Payment Summary Screen

**Display**:
- C3 Form Details:
  - Period: Month/Year
  - Company Name (or Self-Employed Name)
  - Number of Employees

**Contribution Breakdown**:
| Component | Employee | Employer | Total |
|-----------|----------|----------|-------|
| Social Security | $X.XX | $X.XX | $X.XX |
| Employment Insurance | $X.XX | $X.XX | $X.XX |
| Levy | $X.XX | $X.XX | $X.XX |
| Severance Pay | $X.XX | $X.XX | $X.XX |
| **Subtotal** | $X.XX | $X.XX | $X.XX |

**Penalties** (if any):
| Penalty Type | Amount |
|--------------|--------|
| SS Late Submission | $X.XX |
| Levy Late Submission | $X.XX |
| PE Late Submission | $X.XX |
| **Penalty Total** | $X.XX |

**💵 TOTAL AMOUNT DUE**: **$X,XXX.XX**

**Payment Method Selection**:
- ⭕ Credit/Debit Card (CyberSource)
- ⭕ PayPal
- ⭕ Offline Payment

---

## 1️⃣ CyberSource Integration

### **Implementation**:

**Method**: Secure Acceptance (Hosted Payment Page)

**Flow**:
1. User selects "Credit/Debit Card"
2. Generate signed payment request
3. Redirect to CyberSource hosted page
4. User enters card details on CyberSource
5. CyberSource processes payment
6. User redirected back to C3 Wizard with result

**Required Fields** (signed request):
```json
{
  "access_key": "[CyberSource Access Key]",
  "profile_id": "[Profile ID]",
  "transaction_uuid": "[Unique UUID]",
  "signed_field_names": "access_key,profile_id,transaction_uuid,signed_field_names,...",
  "unsigned_field_names": "card_type,card_number,card_expiry_date",
  "signed_date_time": "[ISO 8601 timestamp]",
  "locale": "en",
  "transaction_type": "sale",
  "reference_number": "C3-[HEADER_ID]",
  "amount": "[Total Amount]",
  "currency": "XCD",  // East Caribbean Dollar
  "merchant_defined_data1": "[Company ID]",
  "merchant_defined_data2": "[C3 Header ID]"
}
```

**Signature**: HMAC-SHA256 hash of signed fields with secret key

**Response Handling**:
```javascript
// On return from CyberSource
const decision = params.decision;  // ACCEPT, DECLINE, REVIEW, ERROR

if (decision === 'ACCEPT') {
  // Payment successful
  await savePayment({
    c3_header_id: params.req_merchant_defined_data2,
    payment_gateway_transaction_id: params.transaction_id,
    payment_amount: params.req_amount,
    payment_status: 'AUTHORIZED',
    payment_method: 'CyberSource',
    payment_response: JSON.stringify(params)
  });
  
  // Post to BIMA (if enabled)
  await postPaymentToBIMA(...);
  
  // Generate receipt
  await generateReceipt(...);
}
```

**Environment Variables** (in Supabase secrets):
```
CYBERSOURCE_ACCESS_KEY=your_access_key
CYBERSOURCE_PROFILE_ID=your_profile_id
CYBERSOURCE_SECRET_KEY=your_secret_key
CYBERSOURCE_API_URL=https://secureacceptance.cybersource.com/pay
```

---

## 2️⃣ PayPal Integration

### **Implementation**:

**Method**: PayPal REST API (Server-side)

**Flow**:
1. User selects "PayPal"
2. Create PayPal order (server-side via Supabase Edge Function)
3. Redirect user to PayPal
4. User approves payment on PayPal
5. Capture payment (server-side)
6. Redirect back to C3 Wizard

**Create Order** (Supabase Edge Function):
```typescript
// Edge Function: create-paypal-order
const response = await fetch('https://api.paypal.com/v2/checkout/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: `C3-${c3HeaderId}`,
      amount: {
        currency_code: 'USD',  // or XCD if supported
        value: totalAmount.toFixed(2)
      },
      description: `C3 Contribution - ${month}/${year}`
    }],
    application_context: {
      return_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/cancel`
    }
  })
});

const { id, links } = await response.json();
return { orderId: id, approvalUrl: links.find(l => l.rel === 'approve').href };
```

**Capture Payment** (after user approval):
```typescript
// Edge Function: capture-paypal-payment
const response = await fetch(`https://api.paypal.com/v2/checkout/orders/${orderId}/capture`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  }
});

const capture = await response.json();
if (capture.status === 'COMPLETED') {
  // Save payment
  await savePayment({...});
}
```

**Environment Variables**:
```
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_API_URL=https://api.paypal.com  // or sandbox URL for testing
```

---

## 3️⃣ Offline Payments

### **Offline Payment Form**:

**Payment Method** (dropdown):
- Bank Transfer
- Check
- Cash
- Journal Voucher

**Fields** (conditional based on method):

**For Bank Transfer**:
- Bank Name (required)
- Account Number (required)
- Transaction Reference (required)
- Transaction Date (required)

**For Check**:
- Check Number (required)
- Bank Name (required)
- Check Date (required)

**For Cash**:
- Receipt Number (optional)
- Payment Date (required)

**For Journal Voucher**:
- Voucher Number (required)
- Voucher Date (required)

**Common Fields**:
- Amount (read-only, pre-filled with total due)
- Notes / Reason for Payment (optional, textarea)
- Upload Receipt/Proof (optional, file upload - PDF, JPG, PNG)

**Submit Button**: "Record Offline Payment"

**After Submit**:
- Payment status = 'Offline Payment'
- Admin can review and approve
- Generate receipt (marked as "Pending Verification")

---

## 📄 Receipt Generation

### **Receipt PDF Content**:

**Header**:
```
St. Kitts & Nevis Social Security Board
C3 Contribution Payment Receipt

Receipt Number: C3WIZ-000123
Date: January 22, 2026
```

**Payment Details**:
- Company Name / Self-Employed Name
- Registration Number / SSN
- C3 Period: Month/Year
- Payment Method: [CyberSource / PayPal / Offline]
- Transaction ID: [Gateway Transaction ID]

**Contribution Breakdown**: (same table as payment summary)

**Total Paid**: $X,XXX.XX

**Status**: PAID / PENDING VERIFICATION (for offline)

**Footer**:
```
This is an official receipt from C3 Wizard.
For inquiries, contact: support@c3wizard.gov.kn

BIMA Receipt Number: [if posted to BIMA]
```

**Email Receipt**:
```
Subject: Payment Receipt - C3 Contribution [Month/Year]

Hello [User Name],

Your payment of $X,XXX.XX for C3 contributions ([Month/Year]) has been received.

Please find the attached receipt for your records.

Best regards,
C3 Wizard Team
```

**Attachment**: `C3_Receipt_[ReceiptNumber].pdf`

---

## 🗄️ Database

**Table**: `c3_payments`

**See**: `knowledge/04_database_schema_part2.md` for complete structure

**Key Fields**:
- `c3_header_id` (link to C3 form)
- `payment_amount`, `payment_method`, `payment_status`
- `payment_gateway_transaction_id` (for online payments)
- `bima_receipt_number` (if posted to BIMA)
- `receipt_number` (C3WIZ-generated)
- `receipt_pdf_url` (link to PDF)

---

## 🔌 BIMA Payment Posting

**When**: After successful payment (online or approved offline)

**API Call**: `POST /Payment/PostPayment`

**See**: `knowledge/11_bima_integration.md` for complete API spec

**Payload**:
```json
{
  "payerId": "ER12345",
  "month": 12,
  "year": 2025,
  "scheduleNo": 1,
  "paymentAmount": 1500.00,
  "paymentDate": "22/01/2026",
  "paymentMethod": "CyberSource",
  "transactionId": "CS-2026-9876543",
  "receiptNumber": "C3WIZ-000123"
}
```

**Response**:
```json
{
  "status": 200,
  "message": "Payment posted successfully",
  "bimaReceiptNumber": "BIMA-PAY-2026-001234"
}
```

**Update Database**:
```sql
UPDATE c3_payments
SET bima_receipt_number = 'BIMA-PAY-2026-001234',
    is_bima_posted = TRUE
WHERE id = [payment_id];
```

---

## ✅ Acceptance Criteria

1. ✅ User can pay with CyberSource (credit/debit card)
2. ✅ User can pay with PayPal
3. ✅ User can record offline payment
4. ✅ PDF receipt is generated
5. ✅ Receipt is emailed to user
6. ✅ Payment is posted to BIMA (if enabled)
7. ✅ Payment status is updated correctly
8. ✅ Admin can view payment history
9. ✅ Offline payments can be approved by admin

---

**For implementation details, see referenced knowledge files.**

**Last Updated**: January 22, 2026
