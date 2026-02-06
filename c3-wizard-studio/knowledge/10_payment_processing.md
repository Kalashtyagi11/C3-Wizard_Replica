# 10. Payment Processing

**Document Version**: 1.0
**Last Updated**: January 22, 2026
**Purpose**: Technical documentation of payment gateway integrations and processing workflows.

---

## 10.1 Payment Methods

The system supports multiple payment methods:
1.  **Online Credit/Debit Card** (via CyberSource)
2.  **PayPal**
3.  **Offline Methods** (Cash, Check, Bank Transfer, Journal Voucher) - Recorded by Admin

---

## 10.2 CyberSource Integration

### Configuration
Credentials are stored in secure environment variables (Supabase Secrets):
*   `CYBERSOURCE_MERCHANT_ID`
*   `CYBERSOURCE_KEY_ID`
*   `CYBERSOURCE_SECRET_KEY`
*   `CYBERSOURCE_BASE_URL` (Test vs Production)

### Payment Flow
1.  **Initiation**: User clicks "Pay Now" on a finalized C3 form.
2.  **Tokenization**: Card details are sent directly to CyberSource (Secure Acceptance) to obtain a token.
3.  **Authorization**: Token + Amount sent to CyberSource API.
4.  **Verification**: CyberSource returns `AUTHORIZED` or `DECLINED`.
5.  **Recording**:
    *   If `AUTHORIZED`, record transaction in `c3_payments`.
    *   Update C3 status to `PAID`.
    *   Generate Receipt.

### Code Reference (Legacy)
*   **Controller**: `PaymentController.cs`
*   **Endpoint**: `payNowDataCyberSource`
*   **Key Logic**:
    ```csharp
    // Legacy C# Logic
    var dt = await _paymentRepo.PayCharge(modal);
    // ...
    if (dt.Rows[0]["PaymentStatus"].ToString() == "AUTHORIZED") {
       // Send email
    }
    ```

---

## 10.3 BIMA Payment Posting

When a payment is successfully processed (Online or Offline), the system must notify the BIMA backend if integration is enabled.

### Logic
*   **Check**: Is `ENABLE_BIMA_INTEGRATION = 1`?
*   **Action**: Call BIMA `PostPayment` endpoint.
*   **Data**: Payer ID, Amount, Date, Receipt Number.
*   **Legacy Mapping**:
    ```csharp
    modal.isBimapost = true; // If enabled in config
    ```

---

## 10.4 Offline Payments

Admins can manually record payments received outside the system.
*   **Inputs**: Payer Name, Amount, Date, Reference Number (Check #), Payment Mode.
*   **Validation**: Amount must match the C3 form total.
*   **Action**: Updates C3 status to `PAID` and triggers BIMA posting.

---

## 10.5 Receipt Generation

*   **Format**: PDF
*   **Content**: Transaction ID, Date, Payer Name, Amount, Payment Breakdown (SS, Levy, etc.).
*   **Delivery**: Downloadable immediately + Email attachment.
*   **Implementation**:
    *   Supabase Edge Function generates PDF from HTML template.
    *   Stored in Supabase Storage (`receipts` bucket).

---

## 10.6 Database Schema

**`c3_payments` Table**:
*   `id`: UUID
*   `c3_header_id`: FK
*   `payment_gateway`: 'CYBERSOURCE', 'PAYPAL', 'OFFLINE'
*   `transaction_id`: External Ref ID
*   `amount`: Decimal
*   `status`: 'PENDING', 'AUTHORIZED', 'FAILED'
*   `bima_receipt_number`: String (from BIMA sync)
*   `created_at`: Timestamp

---

**Document Status**: Active
