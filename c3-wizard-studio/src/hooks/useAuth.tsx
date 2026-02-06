import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Auth Hook for C3 Wizard
 * 
 * Role detection now uses JWT custom claims injected by the database hook.
 * This eliminates the need for an extra API call after login.
 * 
 * JWT Claims include: role_id, user_type, company_id, self_employed_id
 */

type UserRole = 'admin' | 'employer' | 'self_employed' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  roleId: number | null;
  companyId: number | null;
  selfEmployedId: number | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Map legacy role IDs to application roles for routing.
 * 
 * All 12 legacy roles from c3_roles table are mapped to 3 app roles:
 * - admin: SSB Staff roles (Administrative, Inspector, Finance, MIS, etc.)
 * - employer: Company roles (Company Owner, Company User, Test Payment)
 * - self_employed: Self-Employed individuals
 */
const mapRoleIdToRole = (roleId: number | null): UserRole => {
  if (!roleId) return null;
  
  // Admin roles (SSB Staff - different departments)
  if ([13, 14, 18, 19, 20, 21, 22, 24].includes(roleId)) {
    return 'admin';
  }
  
  // Employer roles (Company users)
  if ([15, 16, 23].includes(roleId)) {
    return 'employer';
  }
  
  // Self-employed
  if (roleId === 17) {
    return 'self_employed';
  }
  
  return null;
};

/**
 * Extract role information from JWT token claims.
 * The custom_access_token_hook injects these claims during token generation.
 */
const extractRoleFromSession = (session: Session | null): {
  role: UserRole;
  roleId: number | null;
  companyId: number | null;
  selfEmployedId: number | null;
} => {
  if (!session?.access_token) {
    return { role: null, roleId: null, companyId: null, selfEmployedId: null };
  }

  try {
    // Decode JWT payload (base64)
    const payload = session.access_token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    
    const roleId = decoded.role_id ?? null;
    const userType = decoded.user_type ?? null;
    const companyId = decoded.company_id ?? null;
    const selfEmployedId = decoded.self_employed_id ?? null;
    
    // Prefer user_type if available, otherwise map from role_id
    let role: UserRole = null;
    if (userType === 'admin') role = 'admin';
    else if (userType === 'employer') role = 'employer';
    else if (userType === 'self_employed') role = 'self_employed';
    else role = mapRoleIdToRole(roleId);
    
    console.log('JWT Claims:', { roleId, userType, companyId, selfEmployedId, role });
    
    return { role, roleId, companyId, selfEmployedId };
  } catch (err) {
    console.error('Error decoding JWT:', err);
    return { role: null, roleId: null, companyId: null, selfEmployedId: null };
  }
};

/**
 * Fallback: Fetch role from c3_users if not in JWT (for legacy users)
 */
const fetchUserRoleFallback = async (
  authUserId: string | undefined,
  email: string | undefined,
  accessToken: string | null
): Promise<{ role: UserRole; roleId: number | null; companyId: number | null; selfEmployedId: number | null }> => {
  if (!authUserId && !email) {
    return { role: null, roleId: null, companyId: null, selfEmployedId: null };
  }
  
  if (!accessToken) {
    return { role: null, roleId: null, companyId: null, selfEmployedId: null };
  }

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const base = `${supabaseUrl}/rest/v1/c3_users?select=role_id,user_type,company_id,self_employed_id`;

    const fetchRows = async (url: string) => {
      const response = await fetch(url, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) return [];
      return await response.json();
    };

    let rows = [];
    if (authUserId) {
      rows = await fetchRows(`${base}&auth_user_id=eq.${authUserId}`);
    }
    if (rows.length === 0 && email) {
      rows = await fetchRows(`${base}&email=eq.${encodeURIComponent(email)}`);
    }

    if (rows.length === 0) {
      return { role: null, roleId: null, companyId: null, selfEmployedId: null };
    }

    const data = rows[0];
    let role: UserRole = null;
    if (data.user_type === 'admin') role = 'admin';
    else if (data.user_type === 'employer') role = 'employer';
    else if (data.user_type === 'self_employed') role = 'self_employed';
    else role = mapRoleIdToRole(data.role_id);

    return {
      role,
      roleId: data.role_id,
      companyId: data.company_id,
      selfEmployedId: data.self_employed_id,
    };
  } catch (err) {
    console.error('Error fetching user role fallback:', err);
    return { role: null, roleId: null, companyId: null, selfEmployedId: null };
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [selfEmployedId, setSelfEmployedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateRoleState = async (currentSession: Session | null) => {
    // First try to extract from JWT claims (fastest, no API call)
    const jwtData = extractRoleFromSession(currentSession);
    
    if (jwtData.role) {
      setRole(jwtData.role);
      setRoleId(jwtData.roleId);
      setCompanyId(jwtData.companyId);
      setSelfEmployedId(jwtData.selfEmployedId);
      return;
    }
    
    // Fallback to API call for legacy users without JWT claims
    if (currentSession?.user) {
      console.log('JWT claims not found, falling back to API call...');
      const fallbackData = await fetchUserRoleFallback(
        currentSession.user.id,
        currentSession.user.email,
        currentSession.access_token
      );
      setRole(fallbackData.role);
      setRoleId(fallbackData.roleId);
      setCompanyId(fallbackData.companyId);
      setSelfEmployedId(fallbackData.selfEmployedId);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        await updateRoleState(session);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        await updateRoleState(session);
      } else {
        setRole(null);
        setRoleId(null);
        setCompanyId(null);
        setSelfEmployedId(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error && data?.session) {
      setSession(data.session);
      setUser(data.session.user);
      await updateRoleState(data.session);
    }

    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setRoleId(null);
    setCompanyId(null);
    setSelfEmployedId(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      role, 
      roleId, 
      companyId, 
      selfEmployedId, 
      isLoading, 
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
