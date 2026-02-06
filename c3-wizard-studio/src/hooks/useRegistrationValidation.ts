import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EmployerData {
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
}

interface SelfEmployedData {
  firstName: string;
  lastName: string;
  middleName: string;
  tradeName: string;
  tin: string;
  dateOfBirth: string;
  wageCategory: string;
  mobile: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  gender: string;
  maritalStatus: string;
  dateRegistered: string;
  officeCode: string;
  isLevyExempt: boolean;
  email: string;
}

interface ValidationResult {
  success: boolean;
  message: string;
  error?: string;
}

export function useRegistrationValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [employerData, setEmployerData] = useState<EmployerData | null>(null);
  const [selfEmployedData, setSelfEmployedData] = useState<SelfEmployedData | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const validateEmployer = async (registrationNo: string, email: string): Promise<ValidationResult> => {
    setIsValidating(true);
    setValidationError(null);
    setEmployerData(null);
    setIsValidated(false);

    try {
      const { data, error } = await supabase.functions.invoke('validate-registration', {
        body: {
          action: 'validate_employer',
          payload: { registrationNo, email }
        }
      });

      if (error) {
        const errorMessage = 'Failed to validate registration number';
        setValidationError(errorMessage);
        return { success: false, message: errorMessage };
      }

      if (!data.success) {
        setValidationError(data.message);
        return { success: false, message: data.message, error: data.error };
      }

      setEmployerData(data.data);
      setIsValidated(true);
      return { success: true, message: data.message };
    } catch {
      const errorMessage = 'Unable to connect to validation service';
      setValidationError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsValidating(false);
    }
  };

  const validateSelfEmployed = async (ssn: string, email: string): Promise<ValidationResult> => {
    setIsValidating(true);
    setValidationError(null);
    setSelfEmployedData(null);
    setIsValidated(false);

    try {
      const { data, error } = await supabase.functions.invoke('validate-registration', {
        body: {
          action: 'validate_self_employed',
          payload: { ssn, email }
        }
      });

      if (error) {
        const errorMessage = 'Failed to validate SSN';
        setValidationError(errorMessage);
        return { success: false, message: errorMessage };
      }

      if (!data.success) {
        setValidationError(data.message);
        return { success: false, message: data.message, error: data.error };
      }

      setSelfEmployedData(data.data);
      setIsValidated(true);
      return { success: true, message: data.message };
    } catch {
      const errorMessage = 'Unable to connect to validation service';
      setValidationError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsValidating(false);
    }
  };

  const checkUsername = async (username: string): Promise<{ available: boolean; message?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('validate-registration', {
        body: {
          action: 'check_username',
          payload: { username }
        }
      });

      if (error) {
        return { available: false, message: 'Unable to check username' };
      }

      return { available: data.available, message: data.message };
    } catch {
      return { available: false, message: 'Unable to check username' };
    }
  };

  const resetValidation = () => {
    setEmployerData(null);
    setSelfEmployedData(null);
    setValidationError(null);
    setIsValidated(false);
  };

  return {
    isValidating,
    employerData,
    selfEmployedData,
    validationError,
    isValidated,
    validateEmployer,
    validateSelfEmployed,
    checkUsername,
    resetValidation,
  };
}
