import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// BIMA API Configuration
const BIMA_BASE_URL = Deno.env.get('BIMA_API_BASE_URL') || 'https://bima.sknsocialboard.gov.kn/api';
const BIMA_USERNAME = Deno.env.get('BIMA_API_USERNAME');
const BIMA_PASSWORD = Deno.env.get('BIMA_API_PASSWORD');
const ENABLE_BIMA = Deno.env.get('ENABLE_BIMA_INTEGRATION') === 'true';

interface C3SubmissionPayload {
  payerId: string;
  month: number;
  year: number;
  scheduleNo: number;
  c3Header: {
    c3Status: string;
    numberEmployed: number;
    calcEmpSsAmt: number;
    calcEmpLevyAmt: number;
    calcEmpPeAmt: number;
    totalEmpSsFines: number;
    totalEmpLevyPenalty: number;
    totalEmpPePenalty: number;
    dateReceived: string;
    receivedBy: string;
    submittedByName: string;
    submittedByEmail: string;
    nilReturn: number;
  };
  ipWages: Array<{
    ssn: string;
    firstName: string;
    surName: string;
    birthDate: string;
    payPeriod: string;
    paidCode1: string;
    paidCode2: string;
    paidCode3: string;
    paidCode4: string;
    paidCode5: string;
    paidCode6: string;
    paidCode7: string;
    wagesPaid1: number;
    wagesPaid2: number;
    wagesPaid3: number;
    wagesPaid4: number;
    wagesPaid5: number;
    wagesPaid6: number;
    wagesPaid7: number;
    ipSsAmt: number;
    erSsAmt: number;
    ipLevyAmt: number;
    erLevyAmt: number;
    ipPeAmt: number;
    erEiAmt: number;
    startDate: string | null;
    endDate: string | null;
    wageType: string | null;
  }>;
}

interface PaymentPostPayload {
  payerId: string;
  month: number;
  year: number;
  scheduleNo: number;
  paymentAmount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  receiptNumber: string;
}

// Create Basic Auth header
function createAuthHeader(): string {
  if (!BIMA_USERNAME || !BIMA_PASSWORD) {
    throw new Error('BIMA credentials not configured');
  }
  const credentials = btoa(`${BIMA_USERNAME}:${BIMA_PASSWORD}`);
  return `Basic ${credentials}`;
}

// Mock BIMA responses for testing
function mockBIMAResponse(action: string, payload: any): any {
  switch (action) {
    case 'submit_c3':
      return {
        status: 200,
        message: 'SUCCESS (TEST MODE)',
        receiptId: `TEST-BIMA-${Date.now()}`,
        scheduleNo: payload.scheduleNo || 1,
      };
    case 'post_payment':
      return {
        status: 200,
        message: 'Payment posted successfully (TEST MODE)',
        bimaReceiptNumber: `TEST-PAY-${Date.now()}`,
      };
    case 'get_employee':
      return {
        status: 200,
        data: [{
          socSecNum: payload.ssn,
          firstName: 'Test',
          surName: 'Employee',
          birthDate: '01/01/1990',
          gender: 'M',
          maritalStatus: 'S',
          streetAddress: '123 Test St',
          cityTownName: 'Basseterre',
          stateRegion: 'St. George Basseterre',
          postalCode: 'KN0101',
          countryCode: 'KN',
          email: 'test@example.com',
          phone: '869-465-1234',
          mobile: '869-662-5678',
          occupation: 'Test Occupation',
          payPeriod: '1',
        }],
      };
    default:
      return { status: 400, message: 'Unknown action' };
  }
}

// Submit C3 to BIMA
async function submitC3ToBIMA(payload: C3SubmissionPayload): Promise<any> {
  if (!ENABLE_BIMA) {
    console.log('BIMA integration disabled, using mock response');
    return mockBIMAResponse('submit_c3', payload);
  }

  const url = `${BIMA_BASE_URL}/C3/c3BulkSubmit/${payload.payerId}/C3Submitted/${payload.month},${payload.year},${payload.scheduleNo},ER/EE`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        c3Header: payload.c3Header,
        ipWages: payload.ipWages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`BIMA API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting to BIMA:', error);
    throw error;
  }
}

// Post payment to BIMA
async function postPaymentToBIMA(payload: PaymentPostPayload): Promise<any> {
  if (!ENABLE_BIMA) {
    console.log('BIMA integration disabled, using mock response');
    return mockBIMAResponse('post_payment', payload);
  }

  const url = `${BIMA_BASE_URL}/Payment/PostPayment`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`BIMA API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting payment to BIMA:', error);
    throw error;
  }
}

// Get employee details from BIMA
async function getEmployeeFromBIMA(ssn: string, birthDate: string, firstName: string, lastName: string): Promise<any> {
  if (!ENABLE_BIMA) {
    console.log('BIMA integration disabled, using mock response');
    return mockBIMAResponse('get_employee', { ssn });
  }

  const url = `${BIMA_BASE_URL}/Employee/getIpDetailsByQuery/${ssn},${birthDate},${firstName},,${lastName}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { status: 404, message: 'Employee not found in BIMA' };
      }
      const errorText = await response.text();
      throw new Error(`BIMA API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return { status: 200, data };
  } catch (error) {
    console.error('Error fetching employee from BIMA:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, payload, userId } = await req.json();

    let result;
    let auditAction = '';

    switch (action) {
      case 'submit_c3': {
        auditAction = 'BIMA_C3_SUBMIT';
        result = await submitC3ToBIMA(payload);
        
        // Record BIMA submission in database
        if (result.status === 200) {
          await supabase.from('c3_bima_submissions').insert({
            c3_header_id: payload.c3HeaderId,
            submission_type: 'C3_FORM',
            status: 'SUCCESS',
            bima_receipt_id: result.receiptId,
            schedule_number: result.scheduleNo,
            request_payload: payload,
            response_payload: result,
            submitted_by: userId,
          });
        }
        break;
      }

      case 'post_payment': {
        auditAction = 'BIMA_PAYMENT_POST';
        result = await postPaymentToBIMA(payload);
        
        // Update payment record with BIMA receipt
        if (result.status === 200 && payload.paymentId) {
          await supabase.from('c3_payments').update({
            bima_receipt_number: result.bimaReceiptNumber,
            is_bima_posted: true,
            bima_payment_response: result,
          }).eq('id', payload.paymentId);
        }
        break;
      }

      case 'get_employee': {
        auditAction = 'BIMA_EMPLOYEE_LOOKUP';
        result = await getEmployeeFromBIMA(
          payload.ssn,
          payload.birthDate,
          payload.firstName,
          payload.lastName
        );
        break;
      }

      case 'check_status': {
        // Check if BIMA integration is enabled
        result = {
          enabled: ENABLE_BIMA,
          configured: !!(BIMA_USERNAME && BIMA_PASSWORD),
          baseUrl: BIMA_BASE_URL,
        };
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Log audit entry
    if (auditAction && userId) {
      await supabase.from('c3_audit_logs').insert({
        user_id: userId,
        action: auditAction,
        resource_type: 'BIMA_API',
        new_values: {
          action,
          status: result.status || 200,
          response_summary: result.message || 'Success',
        },
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    console.error('BIMA integration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return new Response(JSON.stringify({
      status: 500,
      message: errorMessage,
      error: true,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
