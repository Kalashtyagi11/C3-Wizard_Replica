/**
 * TEMPORARY PLACEHOLDER
 * 
 * This hook is disabled until the database schema is rebuilt with legacy table names.
 */

export interface AdminDashboardStats {
  totalCompanies: number;
  activeCompanies: number;
  totalEmployers: number;
  totalSelfEmployed: number;
  totalC3Forms: number;
  pendingC3Forms: number;
  submittedC3Forms: number;
  paidC3Forms: number;
  totalContributions: number;
  monthlyContributions: number;
}

export interface EmployerDashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  totalC3Forms: number;
  pendingC3Forms: number;
  submittedC3Forms: number;
  paidC3Forms: number;
  totalContributions: number;
  unpaidContributions: number;
}

export interface SelfEmployedDashboardStats {
  wageCategory: string;
  weeklyWage: number;
  totalContributions: number;
  pendingContributions: number;
  paidContributions: number;
  totalPaid: number;
  totalPending: number;
}

export function useDashboardStats() {
  return {
    adminStats: null as AdminDashboardStats | null,
    employerStats: null as EmployerDashboardStats | null,
    selfEmployedStats: null as SelfEmployedDashboardStats | null,
    isLoading: false,
    error: null as string | null,
    fetchAdminStats: async () => {},
    fetchEmployerStats: async () => {},
    fetchSelfEmployedStats: async () => {},
  };
}
