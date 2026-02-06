import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/loader/Loadable';
import Success from '../views/apps/Payments/Success';

// import { element } from 'prop-types';

/****Layouts*****/
const FullLayout = Loadable(lazy(() => import('../layouts/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/BlankLayout')));
const PrivateRoute = Loadable(lazy(() => import('../views/PrivateRoute')));
const RoleBasedRoute = Loadable(lazy(() => import('../views/RoleBasedRoute')));
/***** Pages ****/

/***** Apps ****/

const SiteSetting = Loadable(lazy(() => import('../views/apps/Payments/SiteSetting')));
const RealtionShipSetting = Loadable(lazy(() => import('../views/apps/C3/realtionShipSetting')));
const TestPayReports = Loadable(lazy(() => import('../views/apps/Payments/AdmiTestPaymentReport')));
const SiteSettingList = Loadable(lazy(() => import('../views/apps/Payments/SiteSettingList')));
const TestpaymentCapture = Loadable(
  lazy(() => import('../views/apps/Payments/TestpaymentCapture')),
);
const PaymentForm = Loadable(lazy(() => import('../views/apps/Payments/paymentCapture')));
const Contacts = Loadable(lazy(() => import('../views/apps/contacts/Contacts')));

const Aboutus = Loadable(lazy(() => import('../views/apps/aboutus/Aboutus')));
const AdminDashboard = Loadable(lazy(() => import('../views/apps/AdminDashboard/AdminDashboard')));
const AdminDetailspage = Loadable(
  lazy(() => import('../views/apps/AdminDashboard/components/AdminDetailspage')),
);
const Dashboard = Loadable(lazy(() => import('../views/apps/dashboard/Dashboard')));
const Employerdetails = Loadable(
  lazy(() => import('../views/apps/employerdetails/Employerdetails')),
);
const Transections = Loadable(lazy(() => import('../views/apps/transection/Transection')));
const AdminEmployerDetails = Loadable(
  lazy(() => import('../views/apps/employerdetails/AdminEmployerDetails')),
);

const AdminSelfEmployerDetails = Loadable(
  lazy(() => import('../views/apps/employerdetails/AdminSelfEmployee')),
);
const AdminSelfEmployerDetailExcel = Loadable(
  lazy(() => import('../views/apps/employerdetails/AdminSelfEmployeeExcel')),
);
const AdminEmployerDetailsExcel = Loadable(
  lazy(() => import('../views/apps/employerdetails/AdminEmployerExcel')),
);
const AdminPaymentHistory = Loadable(
  lazy(() => import('../views/apps/employerdetails/PaymentReportExcel')),
);

const AdminReconcilationHistory = Loadable(
  lazy(() => import('../views/apps/employerdetails/ReconcilationReportExcel')),
);
const AdminUserHistory = Loadable(
  lazy(() => import('../views/apps/employerdetails/UserReportHistory')),
);

const AdminSelfUpdate = Loadable(
  lazy(() => import('../views/apps/employerdetails/AdminSelfEmplyeeUpdate')),
);

const Reconciliation = Loadable(lazy(() => import('../views/apps/reconciliation/Reconciliation')));

const C3Settings = Loadable(lazy(() => import('../views/apps/settings/C3Settings')));
const RoleManagement = Loadable(lazy(() => import('../views/apps/settings/RoleManagement')));
const SelfEmployedSettings = Loadable(
  lazy(() => import('../views/apps/settings/SelfEmployedSettings')),
);
const AddC3Settings = Loadable(
  lazy(() => import('../views/apps/settings/components/AddC3Settings')),
);
const RoleMaster = Loadable(lazy(() => import('../views/apps/roleMaster/RoleMaster')));
const AddRole = Loadable(lazy(() => import('../views/apps/roleMaster/AddRole')));
const UpdateRole = Loadable(lazy(() => import('../views/apps/roleMaster/UpdateRole')));
const AddSelfEmployedSettings = Loadable(
  lazy(() => import('../views/apps/settings/components/AddSelfEmployedSettings')),
);
const ViewSelfEmployedSettings = Loadable(
  lazy(() => import('../views/apps/settings/components/ViewSelfEmployedSettings')),
);
const AddBonusSettings = Loadable(
  lazy(() => import('../views/apps/settings/components/AddBonusSettings')),
);
//const AddRole = Loadable(lazy(() => import('../views/apps/roleMaster/AddRole')));
const AddLevySettings = Loadable(
  lazy(() => import('../views/apps/settings/components/AddLevySettings')),
);
const AdminC3Contribution = Loadable(
  lazy(() => import('../views/apps/AdminDashboard/AdminC3Contribution')),
);
const OfflineReport = Loadable(
  lazy(() => import('../views/apps/AdminDashboard/OfflinePaymentReport')),
);
const OfflineReportNotWorking = Loadable(
  lazy(() => import('../views/apps/AdminDashboard/OfflinePaymentReportNotWorking')),
);

const OfflineReportSelf = Loadable(
  lazy(() => import('../views/apps/AdminDashboard/OfflinePaymentReportSelf')),
);

const AdminNonWorkingDirector = Loadable(
  lazy(() => import('../views/apps/AdminDashboard/AdminNonWorkingDirector')),
);
const AdminSelfEmployed = Loadable(
  lazy(() => import('../views/apps/AdminDashboard/AdminSelfEmployed')),
);
const AdminReport = Loadable(lazy(() => import('../views/apps/AdminDashboard/AdminReport')));
const SelfEmployePaymentDetails = Loadable(
  lazy(() => import('../views/apps/AdminDashboard/AdminReport')),
);
const CompanyPaymentDetails = Loadable(
  lazy(() => import('../views/apps/AdminDashboard/AdminReport')),
);

const AdminEmployeeList = Loadable(
  lazy(() => import('../views/apps/employerdetails/AdminEmployeeList')),
);
const BonusSettings = Loadable(lazy(() => import('../views/apps/settings/BonusSettings')));
const LevySettings = Loadable(lazy(() => import('../views/apps/settings/LevySettings')));
const UserManagement = Loadable(lazy(() => import('../views/apps/administration/UserManagement')));
const MyUsers = Loadable(lazy(() => import('../views/apps/administration/MyUsers')));
const CompanyUsers = Loadable(lazy(() => import('../views/apps/administration/CompanyUsers')));
const SelfEmployedUsers = Loadable(
  lazy(() => import('../views/apps/administration/SelfEmployedUsers')),
);
// const MyU = Loadable(lazy(() => import('../views/apps/administration/UserManagement')));
const UserAuditTrail = Loadable(lazy(() => import('../views/apps/administration/UserAuditTrail')));
const ExceptionLogs = Loadable(lazy(() => import('../views/apps/administration/ExceptionLogs')));

const PerviewC3 = Loadable(lazy(() => import('../views/apps/C3/perviewC3')));
const LoggedInHistory = Loadable(
  lazy(() => import('../views/apps/administration/LoggedInHistory')),
);
const AdminLoggedHistory = Loadable(
  lazy(() => import('../views/apps/administration/AdminLoggedHistory')),
);
const NwDirector = Loadable(lazy(() => import('../views/apps/director/NwDirector')));
const AddDirectorPayroll = Loadable(
  lazy(() => import('../views/apps/director/AddDirectorPayroll')),
);
const NwDirectorReports = Loadable(lazy(() => import('../views/apps/director/NwDirectorReports')));
const NwDirectorPayroll = Loadable(lazy(() => import('../views/apps/director/NwDirectorPayroll')));
const UpdateEmployer = Loadable(lazy(() => import('../views/apps/addEmployer/UpdateEmployer')));

const EditDirectorPayroll = Loadable(
  lazy(() => import('../views/apps/director/EditDirectorPayroll')),
);
const PreviewNWDirectorPayroll = Loadable(
  lazy(() => import('../views/apps/director/PreviewNWDirectorPayroll')),
);
const Employee = Loadable(lazy(() => import('../views/apps/C3/Employee')));
const Holiday = Loadable(lazy(() => import('../views/apps/C3/Holiday')));
const C3Generation = Loadable(lazy(() => import('../views/apps/C3/C3Generation')));
const AddC3Generation = Loadable(lazy(() => import('../views/apps/C3/addC3Generation')));
const ImportC3File = Loadable(lazy(() => import('../views/apps/C3/C3Generation')));
const Bonus = Loadable(lazy(() => import('../views/apps/C3/Bonus')));
const Reports = Loadable(lazy(() => import('../views/apps/C3/Reports')));

const AddEmployee = Loadable(lazy(() => import('../views/apps/addEmployee/AddEmployee')));
const AddNonWorkingDirector = Loadable(
  lazy(() => import('../views/apps/director/AddNonWorkingDirector')),
);
const EditNonWorkingDirector = Loadable(
  lazy(() => import('../views/apps/director/EditNonWorkingDirectory')),
);
const AddUser = Loadable(lazy(() => import('../views/apps/addUser/AddUser')));
const UpdateUser = Loadable(lazy(() => import('../views/apps/addUser/UpdateUser')));
const UpdateAdminUser = Loadable(lazy(() => import('../views/apps/addUser/UpdateAdminUser')));
const UpdateCompanyUser = Loadable(lazy(() => import('../views/apps/addUser/UpdateCompanyUser')));
const UpdateSelfEmployedUser = Loadable(
  lazy(() => import('../views/apps/addUser/UpdateSelfEmployedUser')),
);
const AddAdminUser = Loadable(lazy(() => import('../views/apps/addUser/AddAdminUser')));
const AddSelfUser = Loadable(lazy(() => import('../views/apps/addUser/AddSelfUser')));
const AddCompanyUser = Loadable(lazy(() => import('../views/apps/addUser/AddCompanyUser')));
const AddSelfEmployedUser = Loadable(
  lazy(() => import('../views/apps/addUser/AddSelfEmployedUser')),
);
const AddEmployerPage = Loadable(lazy(() => import('../views/apps/addEmployer/AddEmployer')));
const Profile = Loadable(lazy(() => import('../views/apps/profile/Profile')));
const ChangePassword = Loadable(lazy(() => import('../views/apps/changePassword/ChangePassword')));
const CardDetails = Loadable(lazy(() => import('../views/apps/cardDetailSettings/CardDetails')));

const QustionAnswer = Loadable(lazy(() => import('../views/apps/questionAnswer/QuestionAnswer')));

// *** Self Employee ***//

const Dashboards = Loadable(lazy(() => import('../views/apps/selfEmployee/dashboard/Dashboard')));
const PersonalDetails = Loadable(
  lazy(() => import('../views/apps/selfEmployee/profileDetails/ProfileDetails')),
);
const SelfEmployeeConributions = Loadable(
  lazy(() =>
    import('../views/apps/selfEmployee/selfEmployeeContribution/SelfEmployeeContribution'),
  ),
);
const AddSelfEmployeeConributions = Loadable(
  lazy(() => import('../views/apps/selfEmployee/selfEmployeeContribution/AddSelfEmployee')),
);
const UpdateSelfEmployeeConributions = Loadable(
  lazy(() => import('../views/apps/selfEmployee/selfEmployeeContribution/UpdateSelfEmployee')),
);
const Report = Loadable(lazy(() => import('../views/apps/selfEmployee/reports/Reports')));
const UserManagements = Loadable(
  lazy(() => import('../views/apps/selfEmployee/userManagement/UserManagement')),
);
const BackUpRestoreDb = Loadable(
  lazy(() => import('../views/apps/selfEmployee/dashboard/Dashboard')),
);
const SelfEmployeeSettings = Loadable(
  lazy(() => import('../views/apps/selfEmployee/selfEmployeeSettings/SelfEmployeeSettings')),
);
const AddSelfEmployeeSettings = Loadable(
  lazy(() => import('../views/apps/selfEmployee/selfEmployeeSettings/AddSelfEmployeeSetting')),
);
const UserAuditTrails = Loadable(
  lazy(() => import('../views/apps/selfEmployee/userAuditTrail/UserAuditTrail')),
);
const LogInnHistory = Loadable(
  lazy(() => import('../views/apps/selfEmployee/LoggedInHistory/LoggedInHistory')),
);
const AboutUs = Loadable(lazy(() => import('../views/apps/selfEmployee/aboutUs/AboutUs')));

const BackupRestore = Loadable(
  lazy(() => import('../views/apps/selfEmployee/backupRestoreDb/BackupRestoreDb')),
);

/***** Auth Pages ****/
const Error = Loadable(lazy(() => import('../views/auth/Error')));
// const RegisterFormik = Loadable(lazy(() => import('../views/auth/RegisterFormik')));
const Login = Loadable(lazy(() => import('../views/auth/Login')));
const Maintanance = Loadable(lazy(() => import('../views/auth/Maintanance')));
const LockScreen = Loadable(lazy(() => import('../views/auth/LockScreen')));
const RecoverPassword = Loadable(lazy(() => import('../views/auth/RecoverPassword')));
const Register = Loadable(lazy(() => import('../views/auth/Register')));
const ForgotPassword = Loadable(lazy(() => import('../views/auth/ForgotPassword')));
const ForgotPasswordDetails = Loadable(lazy(() => import('../views/auth/ForgotPasswordDeatils')));
const ExitingUserLogin = Loadable(lazy(() => import('../views/auth/ExitingUserLogin')));
const VerificationDetails = Loadable(lazy(() => import('../views/auth/VerificationDetails')));

const VerifyProcess = Loadable(lazy(() => import('../views/auth/VarifyProcess')));
const VerifyQRCODE = Loadable(lazy(() => import('../views/auth/VerifyQrCode')));
const ResetPassword = Loadable(lazy(() => import('../views/auth/ResetPassword')));
const DateOfBirth = Loadable(lazy(() => import('../views/auth/DateOfBirth')));

/*****Routes******/

const ThemeRoutes = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/', element: <Navigate to="/login" /> },
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="404" /> },

      { path: 'register', element: <Register /> },
      { path: 'forgotpassword', element: <ForgotPassword /> },
      { path: 'forgotPasswordDetails', element: <ForgotPasswordDetails /> },

      { path: 'login', element: <Login /> },
      { path: 'exitinguser', element: <ExitingUserLogin /> },
      { path: 'Verification', element: <VerificationDetails /> },
      { path: 'VerifyProcess', element: <VerifyProcess /> },
      { path: 'VerifyQRCODE', element: <VerifyQRCODE /> },

      { path: 'ResetPassword', element: <ResetPassword /> },
      { path: 'maintanance', element: <Maintanance /> },
      { path: 'lockscreen', element: <LockScreen /> },
      { path: 'recoverpwd', element: <RecoverPassword /> },
      { path: 'dateOfBirth', element: <DateOfBirth /> },
    ],
  },
  {
    path: '/',
    element: <FullLayout />,
    children: [
      // { path: '/', name: 'dashboard', element: <Navigate to="/dashboard" /> },
      {
        path: '/dashboard',
        name: 'Minimal',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <Dashboard />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/admin-dashboard',
        name: 'Minimal',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/payment-success',
        name: 'success',
        exact: true,
        element: <Success />,
      },
      {
        path: '/paymentCapture',
        name: 'paymentCapture',
        exact: true,
        element: <PaymentForm />,
      },
      {
        path: '/TestPaymentCapture',
        name: 'paymentCapture',
        exact: true,
        element: <TestpaymentCapture />,
      },
      {
        path: '/SiteSetting',
        name: 'SiteSetting',
        exact: true,
        element: <SiteSetting />,
      },

      {
        path: '/SiteSettingList',
        name: 'SiteSettingList',
        exact: true,
        element: <SiteSettingList />,
      },
      {
        path: '/RealtionShipSetting',
        name: 'RealtionShipSetting',
        exact: true,
        element: <RealtionShipSetting />,
      },
      {
        path: '/TestPayReports',
        name: 'TestPayReports',
        exact: true,
        element: <TestPayReports />,
      },
      {
        path: '/admin-details/:id/:key/:year/:month',
        name: 'Minimal',
        exact: true,
        element: (
          // <PrivateRoute>
          //   <RoleBasedRoute allowedRoles={['Administrative']}>
          <AdminDetailspage />
          //   </RoleBasedRoute>
          // </PrivateRoute>
        ),
      },
      {
        path: '/apps/contacts',
        name: 'contacts',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee', 'SSB', 'Company']}>
              <Contacts />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      // {
      //   path: '/apps/logout',
      //   name: 'contacts',
      //   exact: true,
      //   element: (
      //     <PrivateRoute>
      //       <RoleBasedRoute allowedRoles={['Administrative']}>
      //         <Logout />
      //       </RoleBasedRoute>
      //     </PrivateRoute>
      //   ),
      // },
      {
        path: '/apps/aboutus',
        name: 'aboutus',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee', 'SSB', 'Company']}>
              <Aboutus />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/dashboard',
        name: 'dashboard',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <Dashboard />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/employerdetails',
        name: 'employerdetails',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <Employerdetails />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/Company/Transection',
        name: 'Transection',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <Transections />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/admin/employer-details',
        name: 'employer-details',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminEmployerDetails />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/admin/self-employed-details',
        name: 'Self Employer Details',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminSelfEmployerDetails />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/admin/self-employed-history',
        name: 'Self Employer Details Excel',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminSelfEmployerDetailExcel />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/admin/employer-history',
        name: 'Admin Employer Details Excel',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminEmployerDetailsExcel />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/payment-history',
        name: 'Admin Payment History',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminPaymentHistory />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/reconciliation-history',
        name: 'Admin Reconcilation History',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminReconcilationHistory />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/users-history',
        name: 'Admin User History',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminUserHistory />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/SelfUserDetails',
        name: 'SelfUserDetails',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminSelfUpdate />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/admin/reconciliation/Reconciliation',
        name: 'Reconciliation',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <Reconciliation />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/settings/C3Settings',
        name: 'C3Settings',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <C3Settings />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/settings/rolePermission',
        name: 'RoleManagement',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <RoleManagement />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/settings/SelfEmployedSettings',
        name: 'SelfEmployedSettings',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <SelfEmployedSettings />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/settings/add-c3-settings',
        name: 'AddC3Settings',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AddC3Settings />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/roleMaster/RoleMaster',
        name: 'RoleMaster',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <RoleMaster />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/roleMaster/AddRole',
        name: 'AddRole',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AddRole />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/roleMaster/updateRole/:id',
        name: 'UpdateRole',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <UpdateRole />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/settings/update-c3-settings/:id',
        name: 'AddC3Settings',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AddC3Settings />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/settings/add-self-employed-settings',
        name: 'AddSelfEmployedSettings',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AddSelfEmployedSettings />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/settings/update-self-employed-settings/:id',
        name: 'UpdateSelfEmployedSettings',
        exact: true,
        element: (
          <PrivateRoute>
            {/* <RoleBasedRoute allowedRoles={['Admin']}> */}
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AddSelfEmployedSettings />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/settings/update-bonus-settings/:id',
        name: 'UpdateSelfEmployedSettings',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AddBonusSettings />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/settings/update-levy-settings/:id',
        name: 'UpdateSelfEmployedSettings',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AddLevySettings />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/settings/view-self-employed-settings/:id',
        name: 'ViewSelfEmployedSettings',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <ViewSelfEmployedSettings />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/settings/add-bonus-settings',
        name: 'AddBonusSettings',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AddBonusSettings />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      // {
      //   path: '/apps/roleMaster/AddRole',
      //   name: 'AddRole',
      //   exact: true,
      //   element: (
      //     <PrivateRoute>
      //       <RoleBasedRoute allowedRoles={['Admin']}>
      //         <AddRole />
      //       </RoleBasedRoute>
      //     </PrivateRoute>
      //   ),
      // },

      {
        path: '/apps/settings/add-levy-settings',
        name: 'AddBonusSettings',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AddLevySettings />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/settings/BonusSettings',
        name: 'BonusSettings',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <BonusSettings />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/administration/UserAuditTrail',
        name: 'UserAuditTrail',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB', 'Company']}>
              <UserAuditTrail />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/administration/ExceptionLogs',
        name: 'ExceptionLogs',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <ExceptionLogs />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/settings/LevySettings',
        name: 'LevySettings',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <LevySettings />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/administration/UserManagement',
        name: 'UserManagement',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <UserManagement />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      // {
      //   path: '/apps/administration/UserAuditTrail',

      //   name: 'UserAuditTrail',
      //   exact: true,
      //   element: (
      //     <PrivateRoute>
      //       <RoleBasedRoute allowedRoles={['Company', 'Company User']}>
      //         <UserAuditTrail />
      //       </RoleBasedRoute>
      //     </PrivateRoute>
      //   ),
      // },
      {
        path: '/apps/administration/LoggedInHistory',
        name: 'LoggedInHistory',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <LoggedInHistory />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/director/NwDirector',
        name: 'NwDirector',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <NwDirector />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/director/NwDirectorPayroll',
        name: 'NwDirectorPayroll',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <NwDirectorPayroll />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/director/generateC3',
        name: 'NwDirectorReports',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <AddDirectorPayroll />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/director/editdirectorpayroll',
        name: 'editdirectorpayroll',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <EditDirectorPayroll />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/director/previewNWDirectorPayroll',
        name: 'PreviewNWDirectorPayroll',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <PreviewNWDirectorPayroll />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/director/NwDirectorReports',
        name: 'NwDirectorReports',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <NwDirectorReports />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/C3/Employee',
        name: 'LoggedInHistory',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <Employee />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/C3/Holiday',
        name: 'LoggedInHistory',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <Holiday />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/C3/C3Generation',
        name: 'LoggedInHistory',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <C3Generation />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/ImportC3/Generation',
        name: 'ImportC3Generation',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <ImportC3File />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/C3/Add-C3Generation',
        name: 'AddC3Generation',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <AddC3Generation />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/C3/PerviewC3',
        name: 'PerviewC3',
        exact: true,
        //element: <PerviewC3 />,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <PerviewC3 />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/C3/Bonus',
        name: 'LoggedInHistory',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <Bonus />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/C3/Reports',
        name: 'LoggedInHistory',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <Reports />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/login/Login',
        name: 'login',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <Login />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/addEmployee/AddEmployee',
        name: 'addEmployee',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company', 'SSB']}>
              <AddEmployee />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/addNonWorkingDirector/AddNonWorkingDirector',
        name: 'AddNonWorkingDirector',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <AddNonWorkingDirector />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/editNonWorkingDirector',
        name: 'EditNonWorkingDirector',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <EditNonWorkingDirector />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/updateEmployer/UpdateEmployer',
        name: 'UpdateEmployer',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB', 'Company']}>
              <UpdateEmployer />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/addUser/AddUser',
        name: 'AddUser',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <AddUser />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/update-user/',
        name: 'UpdateUser',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <UpdateUser />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/admin/manage-users/my-users',
        name: 'MyUsers',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <MyUsers />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/manage-users/company-users',
        name: 'CompanyUsers',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <CompanyUsers />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/admin/manage-users/employee',
        name: 'CompanyUsers',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminEmployeeList />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/admin/C3/c3-contribution',
        name: 'C3Contribution',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminC3Contribution />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/admin/C3/offlineReport/:headerID',
        name: 'OfflineReport',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <OfflineReport />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/admin/C3/offlineReportNW/:headerID',
        name: 'OfflineReport',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <OfflineReportNotWorking />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/admin/C3/offlineReportSelf/:headerId',
        name: 'OfflineReport',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <OfflineReportSelf />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/c3/nw-director',
        name: 'NonWorkingDirector',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminNonWorkingDirector />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/c3/self-employed',
        name: 'SelfEmployed',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminSelfEmployed />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/admin/c3/report',
        name: 'Report',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminReport />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/admin/manage-users/self-employed-users',
        name: 'SelfEmployedUsers',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <SelfEmployedUsers />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/add-user',
        name: 'AddUser',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company']}>
              <AddUser />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/paymentdetails',
        name: 'paymentdetails',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company', 'SelfEmployee']}>
              <CompanyPaymentDetails />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/admin/add-admin-user',
        name: 'AddAdminUser',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AddAdminUser />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/add-self-user',
        name: 'AddSelfUser',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AddSelfUser />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/add-company-user/:compId',
        name: 'AddCompanyUser',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AddCompanyUser />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/update-self-employed-user/:id',
        name: 'UpdateSelfEmployedUser',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <UpdateSelfEmployedUser />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/update-user/',
        name: 'UpdateUser',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <UpdateUser />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/update-admin-user/:id',
        name: 'UpdateAdminUser',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <UpdateAdminUser />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/update-company-user/:id',
        name: 'UpdateCompanyUser',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <UpdateCompanyUser />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/addEmployer/AddEmployer',
        name: 'AddEmployer',
        exact: true,

        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['Company', 'SSB']}>
              <AddEmployerPage />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/profile',
        name: 'profile',
        exact: true,
        // element: <Profile />,
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/changepassword',
        name: 'changepassword',
        exact: true,
        // element: <ChangePassword />,
        element: (
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/cardDetail',
        name: 'cardDetail',
        exact: true,
        // element: <CardDetails />,
        element: (
          <PrivateRoute>
            <CardDetails />
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/questionAnswer',
        name: 'questionanswer',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee', 'Company']}>
              <QustionAnswer />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      // **** Self Employee ****/

      {
        path: '/apps/Management',
        name: 'userManagement',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee']}>
              <UserManagements />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/dashboards',
        name: 'dashboard',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee']}>
              <Dashboards />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/personalDetails',
        name: 'profileDetails',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee']}>
              <PersonalDetails />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/selfEmployeeContribution',
        name: 'selfEmployeeContribution',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee']}>
              <SelfEmployeeConributions />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/addSelfEmployeeContribution',
        name: 'selfEmployeeContribution',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee']}>
              <AddSelfEmployeeConributions />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/updateSelfEmployeeContribution',
        name: 'selfEmployeeContribution',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee']}>
              <UpdateSelfEmployeeConributions />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/report',
        name: 'report',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee']}>
              <Report />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/Profile',
        name: 'userManagement',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee']}>
              <UserManagements />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/backupRestoreDb',
        name: 'backupRestore',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee']}>
              <BackupRestore />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/addSelfEmployeeSettings',
        name: 'ADDselfEmployeeSettings',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee']}>
              <AddSelfEmployeeSettings />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/userAuditTrails',
        name: 'userAuditTrail',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee']}>
              {/* <UserAuditTrails /> */}
              <UserAuditTrail />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/loggedInHistorys',
        name: 'loggedInHistory',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee']}>
              <LogInnHistory />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/logged-in-history',
        name: 'loggedInHistory',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SSB']}>
              <AdminLoggedHistory />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/paymentdetails',
        name: 'paymentDetail',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee']}>
              <SelfEmployePaymentDetails />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },

      {
        path: '/apps/contacts',
        name: 'contacts',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee', 'SSB', 'Company']}>
              <Contacts />
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
      {
        path: '/apps/aboutUs',
        name: 'aboutUs',
        exact: true,
        element: (
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['SelfEmployee', 'SSB', 'Company']}>
              <AboutUs />,
            </RoleBasedRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
];

export default ThemeRoutes;
