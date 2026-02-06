import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEmployerDetails from "./pages/admin/EmployerDetails";
import AdminSelfEmployedDetails from "./pages/admin/SelfEmployedDetails";
import AdminC3Contribution from "./pages/admin/C3Contribution";
import AdminNWDirector from "./pages/admin/NWDirector";
import AdminPayments from "./pages/admin/Payments";
import AdminReconciliation from "./pages/admin/Reconciliation";
import AdminLevySettings from "./pages/admin/LevySettings";
import AdminBonusSettings from "./pages/admin/BonusSettings";
import AdminCyberSourceSettings from "./pages/admin/CyberSourceSettings";
import AdminManageUsers from "./pages/admin/ManageUsers";
import AdminCompanyManagement from "./pages/admin/CompanyManagement";
import AdminEmployerUsers from "./pages/admin/EmployerUsers";
import AdminSelfEmployedUsers from "./pages/admin/SelfEmployedUsers";
import AdminSystemRates from "./pages/admin/SystemRates";
import AdminWageCategorySettings from "./pages/admin/WageCategorySettings";
import AdminReports from "./pages/admin/Reports";
import AdminExceptionLogs from "./pages/admin/ExceptionLogs";
import AdminRoleManagement from "./pages/admin/RoleManagement";
import AdminDataMigration from "./pages/admin/DataMigration";
import AdminLoggedInHistory from "./pages/admin/LoggedInHistory";

// Employer pages
import EmployerDashboard from "./pages/employer/Dashboard";
import EmployerDetailsPage from "./pages/employer/EmployerDetailsPage";
import EmployeeManagement from "./pages/employer/EmployeeManagement";
import C3Generation from "./pages/employer/C3Generation";
import EmployerPayments from "./pages/employer/Payments";
import HolidayPayment from "./pages/employer/HolidayPayment";
import BonusManagement from "./pages/employer/BonusManagement";
import EmployerNWDirector from "./pages/employer/NWDirector";
import EmployerAdministration from "./pages/employer/Administration";
import ImportC3 from "./pages/employer/ImportC3";

// Self-Employed pages
import SelfEmployedDashboard from "./pages/self-employed/Dashboard";
import PersonalDetails from "./pages/self-employed/PersonalDetails";
import SelfEmployedContribution from "./pages/self-employed/Contribution";
import SelfEmployedPayments from "./pages/self-employed/Payments";

// Shared pages
import AboutUs from "./pages/shared/AboutUs";
import ContactUs from "./pages/shared/ContactUs";
import UserProfile from "./pages/shared/UserProfile";
import ChangePassword from "./pages/shared/ChangePassword";
import AuditTrail from "./pages/shared/AuditTrail";
import LoginHistory from "./pages/shared/LoginHistory";

const queryClient = new QueryClient();

// Dashboard redirect component
function DashboardRedirect() {
  const { role, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  switch (role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'employer':
      return <Navigate to="/employer/dashboard" replace />;
    case 'self_employed':
      return <Navigate to="/self-employed/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
           <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Dashboard redirect based on role */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employer-details"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEmployerDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/self-employed-details"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSelfEmployedDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/c3/contribution"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminC3Contribution />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/c3/nw-director"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminNWDirector />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reconciliation"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReconciliation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings/levy"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLevySettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings/c3"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSystemRates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings/self-employed"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminWageCategorySettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings/bonus"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminBonusSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings/cybersource"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCyberSourceSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/administrative"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/employer"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEmployerUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/self-employed"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSelfEmployedUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/role-permission"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRoleManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/role-master"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRoleManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCompanyManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/employer-history"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReports type="employer" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/self-employed-history"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReports type="self-employed" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/payment-history"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReports type="payment" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/reconciliation-history"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReports type="payment" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/user-history"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReports type="user" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs/exception"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminExceptionLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs/login-history"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLoggedInHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/data-migration"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDataMigration />
              </ProtectedRoute>
            }
          />

          {/* Employer Routes */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/details"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/employees"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployeeManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/c3"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <C3Generation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/import-c3"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <ImportC3 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/payments"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/holiday-payment"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <HolidayPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/bonus"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <BonusManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/nw-director"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerNWDirector />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/administration"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerAdministration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/profile"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/audit-trail"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <AuditTrail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/login-history"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <LoginHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/contact"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <ContactUs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/about"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <AboutUs />
              </ProtectedRoute>
            }
          />

          {/* Self-Employed Routes */}
          <Route
            path="/self-employed/dashboard"
            element={
              <ProtectedRoute allowedRoles={['self_employed']}>
                <SelfEmployedDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/self-employed/personal-details"
            element={
              <ProtectedRoute allowedRoles={['self_employed']}>
                <PersonalDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/self-employed/contribution"
            element={
              <ProtectedRoute allowedRoles={['self_employed']}>
                <SelfEmployedContribution />
              </ProtectedRoute>
            }
          />
          <Route
            path="/self-employed/payments"
            element={
              <ProtectedRoute allowedRoles={['self_employed']}>
                <SelfEmployedPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/self-employed/profile"
            element={
              <ProtectedRoute allowedRoles={['self_employed']}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/self-employed/audit-trail"
            element={
              <ProtectedRoute allowedRoles={['self_employed']}>
                <AuditTrail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/self-employed/login-history"
            element={
              <ProtectedRoute allowedRoles={['self_employed']}>
                <LoginHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/self-employed/contact"
            element={
              <ProtectedRoute allowedRoles={['self_employed']}>
                <ContactUs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/self-employed/about"
            element={
              <ProtectedRoute allowedRoles={['self_employed']}>
                <AboutUs />
              </ProtectedRoute>
            }
          />

          {/* Shared Profile Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* Fallback Routes */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
