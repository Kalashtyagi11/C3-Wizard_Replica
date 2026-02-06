/**
 * TEMPORARY PLACEHOLDER
 * 
 * This hook is disabled until the database schema is rebuilt with legacy table names.
 * Once SelfEmployee table is created, this will be updated.
 */

export interface SelfEmployedProfile {
  id: string;
  user_id: string;
  ssn: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  birth_date: string;
  gender: string | null;
  marital_status: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state_region: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  business_name: string | null;
  business_type: string | null;
  occupation: string | null;
  industry: string | null;
  tin: string | null;
  wage_category_id: number | null;
  is_active: boolean | null;
  status: string | null;
  created_at: string | null;
}

export function useSelfEmployedProfiles() {
  return {
    profiles: [] as SelfEmployedProfile[],
    isLoading: false,
    error: null as string | null,
    fetchProfiles: async () => {},
    updateProfile: async (_id: string, _profileData: Partial<SelfEmployedProfile>) => ({ 
      error: 'Database schema not yet migrated' 
    }),
    deleteProfile: async (_id: string) => ({ 
      error: 'Database schema not yet migrated' 
    }),
  };
}
