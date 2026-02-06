import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// BIMA API Configuration
const BIMA_BASE_URL = Deno.env.get('BIMA_API_BASE_URL') || 'https://bematest.ssbeservices.net';
const BIMA_USERNAME = Deno.env.get('BIMA_API_USERNAME') || '';
const BIMA_PASSWORD = Deno.env.get('BIMA_API_PASSWORD') || '';

// Create Basic Auth header
function createAuthHeader(): string {
  const credentials = btoa(`${BIMA_USERNAME}:${BIMA_PASSWORD}`);
  return `Basic ${credentials}`;
}

interface EmployerValidationResponse {
  success: boolean;
  message: string;
  data?: {
    companyName: string;
    tradeName: string;
    contactPerson: string;
    address1: string;
    address2: string;
    city: string;
    postalCode: string;
    phone: string;
    mobile: string;
    email: string;
    dateRegistered: string;
    officeCode: string;
    isLevyExempt: boolean;
  };
  error?: string;
}

interface SelfEmployedValidationResponse {
  success: boolean;
  message: string;
  data?: {
    firstName: string;
    lastName: string;
    middleName: string;
    tradeName: string;
    tin: string;
    dateOfBirth: string;
    wageCategory: string;
    mobile: string;
    phone: string;
    email: string;
    address1: string;
    address2: string;
    city: string;
    gender: string;
    maritalStatus: string;
    officeCode: string;
    dateRegistered: string;
    isLevyExempt: boolean;
  };
  error?: string;
}

// Validate Employer Registration Number via BIMA API
async function validateEmployer(regNo: string, email: string): Promise<EmployerValidationResponse> {
  // First check local database for duplicates
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Check if registration number already exists locally
  const { data: existingCompany } = await supabase
    .from('c3_companies')
    .select('id, registration_number')
    .eq('registration_number', regNo)
    .eq('is_deleted', false)
    .maybeSingle();
  
  if (existingCompany) {
    return {
      success: false,
      message: 'Registration number already exists in the system',
      error: 'DUPLICATE_REGISTRATION'
    };
  }
  
  // Check if email already exists
  const { data: existingUser } = await supabase
    .from('c3_users')
    .select('id, email')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  
  if (existingUser) {
    return {
      success: false,
      message: 'Email address already registered',
      error: 'DUPLICATE_EMAIL'
    };
  }
  
  // Validate with BIMA API
  try {
    const url = `${BIMA_BASE_URL}/Employer/getERMasterDetails/${regNo}`;
    console.log('Calling BIMA API:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    console.log('BIMA response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('BIMA API error:', errorText);
      
      // Parse BIMA error response for better messaging
      try {
        const bimaError = JSON.parse(errorText);
        if (bimaError.message?.includes('Employer Not Found') || response.status === 404) {
          return {
            success: false,
            message: 'Registration number not found. Please verify it is a valid employer registration number registered with Social Security.',
            error: 'NOT_FOUND_IN_BIMA'
          };
        }
      } catch {
        // Not JSON, continue with generic error
      }
      
      return {
        success: false,
        message: 'Unable to validate registration number. Please try again later.',
        error: 'BIMA_API_ERROR'
      };
    }
    
    const bimaData = await response.json();
    console.log('BIMA data received:', JSON.stringify(bimaData));
    
    // Handle array response (BIMA returns array)
    const companyInfo = Array.isArray(bimaData) ? bimaData[0] : bimaData;
    
    if (!companyInfo) {
      return {
        success: false,
        message: 'Registration number not found',
        error: 'NO_DATA'
      };
    }
    
    // Validate email matches BIMA record (case-insensitive)
    const bimaEmail = (companyInfo.email || companyInfo.Email || '').toLowerCase().trim();
    const inputEmail = email.toLowerCase().trim();
    
    // Only validate email if BIMA has an email on record
    if (bimaEmail && bimaEmail !== inputEmail) {
      return {
        success: false,
        message: 'Email does not match the registered email for this company',
        error: 'EMAIL_MISMATCH'
      };
    }
    
    // Log raw BIMA response for debugging
    console.log('Raw BIMA Employer data keys:', Object.keys(companyInfo));
    console.log('Mapping employer data from BIMA...');

    // Return company details for auto-fill with more field variations
    const mappedData = {
      companyName: companyInfo.companyName || companyInfo.CompanyName || companyInfo.erName || companyInfo.ERName || companyInfo.company_name || companyInfo.name || companyInfo.Name || '',
      tradeName: companyInfo.tradeName || companyInfo.TradeName || companyInfo.trade_name || companyInfo.businessName || companyInfo.BusinessName || '',
      contactPerson: companyInfo.contactPerson || companyInfo.ContactPerson || companyInfo.contact_person || companyInfo.contact || companyInfo.Contact || '',
      address1: companyInfo.address1 || companyInfo.Address1 || companyInfo.streetAddress || companyInfo.StreetAddress || companyInfo.street || companyInfo.Street || companyInfo.addressLine1 || '',
      address2: companyInfo.address2 || companyInfo.Address2 || companyInfo.streetAddress2 || companyInfo.addressLine2 || '',
      city: companyInfo.city || companyInfo.City || companyInfo.cityTownName || companyInfo.CityTownName || companyInfo.town || companyInfo.Town || companyInfo.parish || companyInfo.Parish || '',
      postalCode: companyInfo.postalCode || companyInfo.PostalCode || companyInfo.zip || companyInfo.Zip || companyInfo.zipCode || companyInfo.ZipCode || '',
      phone: companyInfo.phone || companyInfo.Phone || companyInfo.landline || companyInfo.Landline || companyInfo.tel || companyInfo.Tel || companyInfo.telephone || companyInfo.Telephone || '',
      mobile: companyInfo.mobile || companyInfo.Mobile || companyInfo.cellPhone || companyInfo.CellPhone || companyInfo.cell || companyInfo.Cell || companyInfo.mobilePhone || '',
      email: companyInfo.email || companyInfo.Email || companyInfo.emailAddress || companyInfo.EmailAddress || '',
      dateRegistered: companyInfo.dateRegistered || companyInfo.DateRegistered || companyInfo.registrationDate || companyInfo.RegistrationDate || companyInfo.regDate || '',
      officeCode: companyInfo.officeCode || companyInfo.OfficeCode || companyInfo.office_code || companyInfo.branchCode || companyInfo.BranchCode || '',
      isLevyExempt: companyInfo.isLevyExempt || companyInfo.IsLevyExempt || companyInfo.levyExempt || companyInfo.LevyExempt || false,
    };

    console.log('Mapped Employer data:', JSON.stringify(mappedData));

    return {
      success: true,
      message: 'Validation successful',
      data: mappedData
    };
    
  } catch (error) {
    console.error('Error calling BIMA API:', error);
    return {
      success: false,
      message: 'Unable to connect to validation service',
      error: 'CONNECTION_ERROR'
    };
  }
}

// Validate Self-Employed SSN via BIMA API
async function validateSelfEmployed(ssn: string, email: string): Promise<SelfEmployedValidationResponse> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Check if SSN already exists locally
  const { data: existingProfile } = await supabase
    .from('c3_self_employed')
    .select('id, social_security_number')
    .eq('social_security_number', ssn)
    .eq('is_deleted', false)
    .maybeSingle();
  
  if (existingProfile) {
    return {
      success: false,
      message: 'Social Security Number already registered',
      error: 'DUPLICATE_SSN'
    };
  }
  
  // Check if email already exists
  const { data: existingUser } = await supabase
    .from('c3_users')
    .select('id, email')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  
  if (existingUser) {
    return {
      success: false,
      message: 'Email address already registered',
      error: 'DUPLICATE_EMAIL'
    };
  }
  
  // Validate with BIMA API
  try {
    const url = `${BIMA_BASE_URL}/Employer/getSEMasterDetails/${ssn}`;
    console.log('Calling BIMA API for SE:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    console.log('BIMA SE response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          message: 'SSN not found in BIMA system',
          error: 'NOT_FOUND_IN_BIMA'
        };
      }
      const errorText = await response.text();
      console.error('BIMA API error:', errorText);
      return {
        success: false,
        message: 'Unable to validate SSN',
        error: 'BIMA_API_ERROR'
      };
    }
    
    const bimaData = await response.json();
    console.log('BIMA SE data received:', JSON.stringify(bimaData));
    
    // Handle array response
    const seInfo = Array.isArray(bimaData) ? bimaData[0] : bimaData;
    
    if (!seInfo) {
      return {
        success: false,
        message: 'SSN not found',
        error: 'NO_DATA'
      };
    }
    
    // Check status - must be 'D' (Deactivated) or 'O' (Other) to be eligible
    const statusCode = seInfo.statusCode || seInfo.StatusCode || seInfo.status || '';
    if (statusCode && !['D', 'O', ''].includes(statusCode.toUpperCase())) {
      return {
        success: false,
        message: 'This SSN is not eligible for self-employed registration',
        error: 'INELIGIBLE_STATUS'
      };
    }
    
    // Validate email matches BIMA record
    const bimaEmail = (seInfo.email || seInfo.Email || '').toLowerCase().trim();
    const inputEmail = email.toLowerCase().trim();
    
    if (bimaEmail && bimaEmail !== inputEmail) {
      return {
        success: false,
        message: 'Email does not match the registered email for this SSN',
        error: 'EMAIL_MISMATCH'
      };
    }
    
    // Log raw BIMA response for debugging
    console.log('Raw BIMA SE data keys:', Object.keys(seInfo));
    console.log('Mapping self-employed data from BIMA...');

    // Return self-employed details for auto-fill
    // Handle various BIMA API field name variations
    const mappedData = {
      firstName: seInfo.firstName || seInfo.FirstName || seInfo.first_name || seInfo.foreName || seInfo.Forename || seInfo.givenName || '',
      lastName: seInfo.lastName || seInfo.LastName || seInfo.last_name || seInfo.surName || seInfo.SurName || seInfo.surname || seInfo.Surname || seInfo.familyName || '',
      middleName: seInfo.middleName || seInfo.MiddleName || seInfo.middle_name || seInfo.otherNames || seInfo.OtherNames || '',
      tradeName: seInfo.tradeName || seInfo.TradeName || seInfo.trade_name || seInfo.businessName || seInfo.BusinessName || '',
      tin: seInfo.tin || seInfo.TIN || seInfo.Tin || seInfo.taxIdNumber || seInfo.taxId || seInfo.TaxId || '',
      dateOfBirth: seInfo.birthDate || seInfo.BirthDate || seInfo.dateOfBirth || seInfo.DateOfBirth || seInfo.dob || seInfo.DOB || seInfo.birth_date || '',
      wageCategory: seInfo.wageCategory || seInfo.WageCategory || seInfo.categoryType || seInfo.CategoryType || seInfo.category || seInfo.Category || seInfo.wageCat || '',
      mobile: seInfo.mobile || seInfo.Mobile || seInfo.cellPhone || seInfo.CellPhone || seInfo.cell || seInfo.Cell || seInfo.mobilePhone || seInfo.MobilePhone || '',
      phone: seInfo.phone || seInfo.Phone || seInfo.landline || seInfo.Landline || seInfo.homePhone || seInfo.HomePhone || seInfo.tel || seInfo.Tel || seInfo.telephone || seInfo.Telephone || '',
      email: seInfo.email || seInfo.Email || seInfo.emailAddress || seInfo.EmailAddress || '',
      address1: seInfo.address1 || seInfo.Address1 || seInfo.streetAddress || seInfo.StreetAddress || seInfo.street || seInfo.Street || seInfo.addressLine1 || seInfo.AddressLine1 || '',
      address2: seInfo.address2 || seInfo.Address2 || seInfo.streetAddress2 || seInfo.addressLine2 || seInfo.AddressLine2 || '',
      city: seInfo.city || seInfo.City || seInfo.cityTownName || seInfo.CityTownName || seInfo.town || seInfo.Town || seInfo.parish || seInfo.Parish || '',
      gender: seInfo.gender || seInfo.Gender || seInfo.sex || seInfo.Sex || '',
      maritalStatus: seInfo.maritalStatus || seInfo.MaritalStatus || seInfo.marital_status || '',
      officeCode: seInfo.officeCode || seInfo.OfficeCode || seInfo.office_code || seInfo.branchCode || seInfo.BranchCode || '',
      dateRegistered: seInfo.dateRegistered || seInfo.DateRegistered || seInfo.registrationDate || seInfo.RegistrationDate || seInfo.regDate || '',
      isLevyExempt: seInfo.isLevyExempt || seInfo.IsLevyExempt || seInfo.levyExempt || seInfo.LevyExempt || false,
    };

    console.log('Mapped SE data:', JSON.stringify(mappedData));
    
    return {
      success: true,
      message: 'Validation successful',
      data: mappedData
    };
    
  } catch (error) {
    console.error('Error calling BIMA API:', error);
    return {
      success: false,
      message: 'Unable to connect to validation service',
      error: 'CONNECTION_ERROR'
    };
  }
}

// Check if username is available
async function checkUsername(username: string): Promise<{ available: boolean; message: string }> {
  if (username.length < 3) {
    return { available: false, message: 'Username must be at least 3 characters' };
  }
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data: existingUser } = await supabase
    .from('c3_users')
    .select('id')
    .eq('login_id', username.toLowerCase())
    .maybeSingle();
  
  if (existingUser) {
    return { available: false, message: 'Username is already taken' };
  }
  
  return { available: true, message: 'Username is available' };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, payload } = await req.json();
    
    let result;
    
    switch (action) {
      case 'validate_employer': {
        const { registrationNo, email } = payload;
        if (!registrationNo || !email) {
          throw new Error('Registration number and email are required');
        }
        result = await validateEmployer(registrationNo, email);
        break;
      }
      
      case 'validate_self_employed': {
        const { ssn, email } = payload;
        if (!ssn || !email) {
          throw new Error('SSN and email are required');
        }
        result = await validateSelfEmployed(ssn, email);
        break;
      }
      
      case 'check_username': {
        const { username } = payload;
        if (!username) {
          throw new Error('Username is required');
        }
        result = await checkUsername(username);
        break;
      }
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    console.error('Validation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return new Response(JSON.stringify({
      success: false,
      message: errorMessage,
      error: 'SERVER_ERROR',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
