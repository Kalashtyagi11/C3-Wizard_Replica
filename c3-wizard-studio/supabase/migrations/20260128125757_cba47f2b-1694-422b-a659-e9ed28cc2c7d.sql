-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE "SECRole" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SECModule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MasterCompany" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SelfEmployee" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SECUsers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SECUsersProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MasterEmployee" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SECUserModule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserPermission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SecurityQuestionAnswer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserOtp" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MasterEmpType" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MasterEmployerCodes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Country" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "State" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "City" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Master_Rate_Setting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Deductions_Tax_Table_Header" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Deductions_Tax_Table_Details" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WageCategories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Self_Employed_Settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DECEMBER_BONUS_EXEMPTED_CONTRIBUTION" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NWD_Master_Rate_Settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MasterDeductionCodes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MasterIncCodes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MasterObligationCodes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MasterEmployeeDeductions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MasterEmployeeIncomes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MasterEmployeeObligations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MasterHolidayPayDetails" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HolidayPayDates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BonusPayDetails" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WagesPayDetails" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmployeeTCard_Header" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmployeeTCard_Details" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmployeeWorkDurationDetails" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PROCESS_C3Header" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Process_Contributions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PROCESS_Self_EmployedC3" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OnlinePayments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BankPaymentsMain" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserCardDetail" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Reconciliation_Cyber_Space" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Reconciliation_Cyber_Space_Column" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReconciliationPayment_Details" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payroll_Process_Header" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payroll_Process_Details" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Process_PayEmployee" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Process_PayDeductions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Process_PayIncomes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Process_Payobligations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLogs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoginLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CustomErrorLogs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ErrorLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Exception_log" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactUs_Log" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AboutUs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE BASIC RLS POLICIES
-- =====================================================

-- user_roles policies
CREATE POLICY "Users can view own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON user_roles FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Public read for lookup tables
CREATE POLICY "Public read for SECRole" ON "SECRole" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for SECModule" ON "SECModule" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for Country" ON "Country" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for State" ON "State" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for City" ON "City" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for MasterEmpType" ON "MasterEmpType" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for Master_Rate_Setting" ON "Master_Rate_Setting" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for Deductions_Tax_Table_Header" ON "Deductions_Tax_Table_Header" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for Deductions_Tax_Table_Details" ON "Deductions_Tax_Table_Details" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for WageCategories" ON "WageCategories" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for Self_Employed_Settings" ON "Self_Employed_Settings" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for DECEMBER_BONUS_EXEMPTED_CONTRIBUTION" ON "DECEMBER_BONUS_EXEMPTED_CONTRIBUTION" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for NWD_Master_Rate_Settings" ON "NWD_Master_Rate_Settings" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for SiteSettings" ON "SiteSettings" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for MasterDeductionCodes" ON "MasterDeductionCodes" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for MasterIncCodes" ON "MasterIncCodes" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for MasterObligationCodes" ON "MasterObligationCodes" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read for AboutUs" ON "AboutUs" FOR SELECT USING (true);

-- Admin full access policies
CREATE POLICY "Admin full access SECRole" ON "SECRole" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access SECModule" ON "SECModule" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access SECUsers" ON "SECUsers" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access SECUsersProfile" ON "SECUsersProfile" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access MasterCompany" ON "MasterCompany" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access MasterEmployee" ON "MasterEmployee" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access SelfEmployee" ON "SelfEmployee" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access SECUserModule" ON "SECUserModule" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access UserPermission" ON "UserPermission" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Country" ON "Country" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access State" ON "State" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access City" ON "City" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access MasterEmpType" ON "MasterEmpType" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Master_Rate_Setting" ON "Master_Rate_Setting" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Deductions_Tax_Table_Header" ON "Deductions_Tax_Table_Header" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Deductions_Tax_Table_Details" ON "Deductions_Tax_Table_Details" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access WageCategories" ON "WageCategories" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Self_Employed_Settings" ON "Self_Employed_Settings" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access DECEMBER_BONUS_EXEMPTED_CONTRIBUTION" ON "DECEMBER_BONUS_EXEMPTED_CONTRIBUTION" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access NWD_Master_Rate_Settings" ON "NWD_Master_Rate_Settings" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access SiteSettings" ON "SiteSettings" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access MasterDeductionCodes" ON "MasterDeductionCodes" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access MasterIncCodes" ON "MasterIncCodes" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access MasterObligationCodes" ON "MasterObligationCodes" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access AboutUs" ON "AboutUs" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access AuditLogs" ON "AuditLogs" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access LoginLog" ON "LoginLog" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access CustomErrorLogs" ON "CustomErrorLogs" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access ErrorLog" ON "ErrorLog" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Exception_log" ON "Exception_log" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access ContactUs_Log" ON "ContactUs_Log" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access OnlinePayments" ON "OnlinePayments" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Reconciliation_Cyber_Space" ON "Reconciliation_Cyber_Space" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Reconciliation_Cyber_Space_Column" ON "Reconciliation_Cyber_Space_Column" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access ReconciliationPayment_Details" ON "ReconciliationPayment_Details" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access PROCESS_C3Header" ON "PROCESS_C3Header" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Process_Contributions" ON "Process_Contributions" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access PROCESS_Self_EmployedC3" ON "PROCESS_Self_EmployedC3" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Authenticated read for remaining tables
CREATE POLICY "Authenticated read SecurityQuestionAnswer" ON "SecurityQuestionAnswer" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read UserOtp" ON "UserOtp" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read MasterEmployerCodes" ON "MasterEmployerCodes" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read MasterEmployeeDeductions" ON "MasterEmployeeDeductions" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read MasterEmployeeIncomes" ON "MasterEmployeeIncomes" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read MasterEmployeeObligations" ON "MasterEmployeeObligations" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read MasterHolidayPayDetails" ON "MasterHolidayPayDetails" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read HolidayPayDates" ON "HolidayPayDates" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read BonusPayDetails" ON "BonusPayDetails" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read WagesPayDetails" ON "WagesPayDetails" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read EmployeeTCard_Header" ON "EmployeeTCard_Header" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read EmployeeTCard_Details" ON "EmployeeTCard_Details" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read EmployeeWorkDurationDetails" ON "EmployeeWorkDurationDetails" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read BankPaymentsMain" ON "BankPaymentsMain" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read UserCardDetail" ON "UserCardDetail" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read Payroll_Process_Header" ON "Payroll_Process_Header" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read Payroll_Process_Details" ON "Payroll_Process_Details" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read Process_PayEmployee" ON "Process_PayEmployee" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read Process_PayDeductions" ON "Process_PayDeductions" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read Process_PayIncomes" ON "Process_PayIncomes" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read Process_Payobligations" ON "Process_Payobligations" FOR SELECT TO authenticated USING (true);

-- Admin full access for remaining tables
CREATE POLICY "Admin full access SecurityQuestionAnswer" ON "SecurityQuestionAnswer" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access UserOtp" ON "UserOtp" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access MasterEmployerCodes" ON "MasterEmployerCodes" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access MasterEmployeeDeductions" ON "MasterEmployeeDeductions" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access MasterEmployeeIncomes" ON "MasterEmployeeIncomes" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access MasterEmployeeObligations" ON "MasterEmployeeObligations" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access MasterHolidayPayDetails" ON "MasterHolidayPayDetails" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access HolidayPayDates" ON "HolidayPayDates" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access BonusPayDetails" ON "BonusPayDetails" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access WagesPayDetails" ON "WagesPayDetails" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access EmployeeTCard_Header" ON "EmployeeTCard_Header" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access EmployeeTCard_Details" ON "EmployeeTCard_Details" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access EmployeeWorkDurationDetails" ON "EmployeeWorkDurationDetails" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access BankPaymentsMain" ON "BankPaymentsMain" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access UserCardDetail" ON "UserCardDetail" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Payroll_Process_Header" ON "Payroll_Process_Header" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Payroll_Process_Details" ON "Payroll_Process_Details" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Process_PayEmployee" ON "Process_PayEmployee" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Process_PayDeductions" ON "Process_PayDeductions" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Process_PayIncomes" ON "Process_PayIncomes" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access Process_Payobligations" ON "Process_Payobligations" FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));