import { configureStore } from '@reduxjs/toolkit';
import NotesReducer from './apps/notes/NotesSlice';
import CustomizerReducer from './customizer/CustomizerSlice';
import ChatsReducer from './apps/chat/ChatSlice';
import ContactsReducer from './apps/contacts/ContactSlice';
import EmailReducer from './apps/email/EmailSlice';
import TicketReducer from './apps/ticket/TicketSlice';
import MessageSlice from './apps/message/MessageSlice';
import AuthSlice from './apps/auth/AuthSlice';
import CSlice from './apps/C/CSlice';
import CSettingsSlice from './apps/settings/CSettingsSlice';
import BonusSlice from './apps/settings/BonusSlice';
import EmployerSlice from './apps/employer/EmployerSlice';
import EmployeeSlice from './apps/employee/EmployeeSlice';
import CGenerationSlice from './apps/cGeneration/CGenerationSlice';
import DashboardSlice from './apps/dashboard/DashboardSlice';
import AdminDashSlice from './apps/AdminDashS/AdminDashSlice';
import HolidaySlice from './apps/cGeneration/holiday';
import ContactusSlice from './apps/contactus/ContactusSlice';
import AdministrationSlice from './apps/administration/AdministrationSlice';
import AuditTrailSlice from './apps/administration/AuditTrailSlice';
import NonWorkingDirectorySlice from './apps/nonWorkingDirectory/NonWorkingDirectory';
import PersonalDetails from './apps/selfEmployee/PersonalDetails';
import SelfEmployeeSetting from './apps/selfEmployee/selfEmployeeSetting/SelfEmployeeSetting';
import SelfEmployeeContributionSlice from './apps/selfEmployee/selfEmployeeContribution/SelfEmployeeContributionSlice';
import ReportSelfSlice from './apps/selfEmployee/reports/ReportsSlice';

import SelfDashboardSlice from './apps/selfEmployee/dashboard/SelfDashboardSlice';
import UserManagementSlice from './apps/selfEmployee/userManagement/userManagementSlice';
import userAuditTrailSlices from './apps/selfEmployee/userAuditTrail/UserAuditTrail';
import roleSlice from './apps/Admin/RolemanagementSlice';
import exceptionLogs from './apps/exceptionLogs/ExceptionLogsSlice';

// import SelfDashboardSlice from './apps/selfEmployee/dashboard/SelfDashboardSlice'

import LoggedHistorySlice from './apps/administration/LoggedHistorySlice';

export const store = configureStore({
  reducer: {
    customizer: CustomizerReducer,
    notesReducer: NotesReducer,
    chatReducer: ChatsReducer,
    contactsReducer: ContactsReducer,
    emailReducer: EmailReducer,
    ticketReducer: TicketReducer,
    authSlice: AuthSlice,
    messageReducer: MessageSlice,
    cSlice: CSlice,
    cSettingsSlice: CSettingsSlice,
    bonusSlice: BonusSlice,
    employerSlice: EmployerSlice,
    employeeSlice: EmployeeSlice,
    cGenerationSlice: CGenerationSlice,
    dashboardSlice: DashboardSlice,
    adminDashSlice: AdminDashSlice,
    holidaySlice: HolidaySlice,
    contactusSlice: ContactusSlice,
    nonWorkingDirectorySlice: NonWorkingDirectorySlice,
    AdministrationReducer: AdministrationSlice,
    AuditTrailReducer: AuditTrailSlice,
    personalDetails: PersonalDetails,
    selfEmployeeSetting: SelfEmployeeSetting,
    selfEmployeeContributionSlice: SelfEmployeeContributionSlice,
    selfDashboardSlice: SelfDashboardSlice,
    userManagementSlice: UserManagementSlice,
    UserAuditTrailSlices: userAuditTrailSlices,
    LoggedHistoryReducer: LoggedHistorySlice,
    reportSelfSlice: ReportSelfSlice,
    RoleSlice: roleSlice,
    ExceptionLogs: exceptionLogs,
  },
});

export default store;
