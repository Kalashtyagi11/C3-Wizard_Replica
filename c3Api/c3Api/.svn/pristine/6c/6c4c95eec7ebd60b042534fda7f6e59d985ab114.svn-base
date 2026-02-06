using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class BonusVM
    {

        public string EMPLOYEESSN { get; set; }


        public DateTime PayDate { get; set; }


        public int monthno { get; set; }

        public string? year { get; set; }

        public decimal Amount { get; set; }
        public int CompanyId { get; set; }

        public int PayId { get; set; }


        //public List<Holiday_Pay_Dates> HolidayPayDates { get; set; } = new List<Holiday_Pay_Dates>();




    }

    public class SaveBonusVM
    {
        [Required(ErrorMessage = "Employee SSN is required.")]
        public string EMPLOYEESSN { get; set; }

        [Required(ErrorMessage = "CompanyId is required.")]
        public int CompanyId { get; set; }

        [Required(ErrorMessage = "PayDate is required.")]
        public DateTime PayDate { get; set; }

        [Required(ErrorMessage = "Amount is required.")]
        public decimal Amount { get; set; }
    }
    //public class Wages_Pay_Details
    //{
    //    public Int32? Wages_Bonus_PayId { get; set; }
    //    public Int32? employeeID { get; set; }
    //    public Int32? company_ID { get; set; }
    //    public decimal Amount { get; set; }
    //    public DateTime? start_Date { get; set; }
    //    public DateTime? end_Date { get; set; }
    //    public string st_Date { get; set; }
    //    public string en_Date { get; set; }
    //    public string pay_Date { get; set; }
    //    public DateTime? Wages_bonus_PayDate { get; set; }
    //    public Int32? PayNoOfTimes { get; set; }
    //    public Int32? insertedby { get; set; }
    //    public string Wage_Bonus_Des { get; set; }
    //    public string insertedmachineinfo { get; set; }
    //    public DateTime? insertedon { get; set; }
    //    public Int32? updateby { get; set; }
    //    public string updatemachineinfo { get; set; }
    //    public DateTime? updateon { get; set; }
    //    public string employeename { get; set; }
    //    public bool PayStatus { get; set; }
    //    public string yearName { get; set; }
    //}


    public class C3ReportViewModel
    {
        public int RowNo { get; set; }
        public string CompanyName { get; set; }
        //public string company_name { get; set; }
        
        public string TradeName { get; set; }
        public string CompanyAddress { get; set; }

        public string? OrderName { get; set; }
        public string? OrderKey { get; set; }


        public string CompanyRegNo { get; set; }
        public int NoOfEmployee { get; set; }
        public string CurrentMonth { get; set; }
        public string SocialSecurityNo { get; set; }
        public string EmpName { get; set; }
        public string AppintDate { get; set; }
        public string EmployeeStatus { get; set; }
        public string PayPeriod { get; set; }
        public string FirstWeekOfMonth { get; set; }
        public string SecondWeekOfMonth { get; set; }
        public string ThirdWeekOfMonth { get; set; }
        public string FourWeekOfMonth { get; set; }
        public string FiveWeekOfMonth { get; set; }
        public decimal? FirstWeekOfSalary { get; set; }
        public decimal? SecondWeekOfSalary { get; set; }
        public decimal? ThirdWeekOfSalary { get; set; }
        public decimal? FourWeekOfSalary { get; set; }
        public decimal? FiveWeekOfSalary { get; set; }
        public decimal Column2 { get; set; }
        public decimal Column1 { get; set; }
        public decimal TotalWages { get; set; }
       // public decimal total_wages { get; set; }
        
        public decimal DeductLeavyWages { get; set; }
        public decimal TotalSocSec { get; set; }
        public decimal Servayance { get; set; }
        public decimal ServayancePePenalty { get; set; }
        public decimal TotalLevyEEPenalty { get; set; }
        public decimal TotalSSPenalty { get; set; }
        public string Remarks { get; set; }
        public string date { get; set; }
        public decimal Column3 { get; set; }
        public decimal HPay_Week1 { get; set; }
        public decimal HPay_Week2 { get; set; }
        public decimal HPay_Week3 { get; set; }
        public decimal HPay_Week4 { get; set; }
        public decimal HPay_Week5 { get; set; }
    }


    public class C3ResponseViewModel
    {
        public List<C3ReportViewModel> Listc3ReportViewModel { get; set; }
        public string CompanyName { get; set; }
        public string date { get; set; }
        public string TradeName { get; set; }
        public string CompanyAddress { get; set; }
        public string CompanyRegNo { get; set; }
        public int NoOfEmployee { get; set; }
        public string CurrentMonth { get; set; }
        public string AppintDate { get; set; }
        public string? OrderName { get; set; }
        public string? OrderKey { get; set; }
        public bool isNilReturn { get; set; }
        public string EmployeeStatus { get; set; }
        public decimal TotalWages { get; set; }
        public decimal TotalSocSec { get; set; }
        public decimal Servayance { get; set; }
        public decimal ServayancePePenalty { get; set; }
        public decimal TotalLevyEEPenalty { get; set; }
        public decimal TotalDeductLeavy { get; set; }
        public decimal AccountGeneralTotal { get; set; }
        public decimal WagesLevyContribution { get; set; }
        public decimal RemitedDueMonth { get; set; }
        public decimal finedueMonth { get; set; }
        public decimal Total { get; set; }
        public string Remarks { get; set; }
        public string receiptNumber { get; set; }
        public string receiptDate { get; set; }
    }
    public class ipWagesbulk
    {
        public string birthDate { get; set; }
        public string firstName { get; set; }
        public string surName { get; set; }
        public string endDate { get; set; }
        public decimal erEiAmt { get; set; }
        public decimal erLevyAmt { get; set; }
        public decimal erSsAmt { get; set; }
        public decimal ipLevyAmt { get; set; }
        public decimal ipPeAmt { get; set; }
        public decimal ipSsAmt { get; set; }
        public string paidCode1 { get; set; }
        public string paidCode2 { get; set; }
        public string paidCode3 { get; set; }
        public string paidCode4 { get; set; }
        public string paidCode5 { get; set; }
        public string paidCode6 { get; set; }
        public string paidCode7 { get; set; }
        public string wageType { get; set; }
        public string payPeriod { get; set; }
        public string ssn { get; set; }
        public string startDate { get; set; }
        public decimal wagesPaid1 { get; set; }
        public decimal wagesPaid2 { get; set; }
        public decimal wagesPaid3 { get; set; }
        public decimal wagesPaid4 { get; set; }
        public decimal wagesPaid5 { get; set; }
        public decimal wagesPaid6 { get; set; }
        public decimal wagesPaid7 { get; set; }

    }

    public class Holiday_Pay1
    {

        public Int32? EmployeeID { get; set; }
        public Int32? Company_ID { get; set; }
        public string SocialSecurityNo { get; set; }
        public decimal Amount { get; set; }
        public DateTime From_Date { get; set; }
        public DateTime To_Date { get; set; }
        public Int32? PayNoOfTimes { get; set; }
        public Int32? HolidayPayId { get; set; }
        public string EmployeeDetails { get; set; }
    }
    public class Employee_holidpd_Weelky_list1
    {
        public decimal Amount { get; set; }
        public string Month { get; set; }
        public decimal? WAGES1 { get; set; }
        public decimal? WAGES2 { get; set; }
        public decimal? WAGES3 { get; set; }
        public decimal? WAGES4 { get; set; }
        public decimal? WAGES5 { get; set; }
    }
    public class submitC3bulk
    {
        public c3Headerbulk c3Header { get; set; }
        public List<ipWagesbulk> ipWages { get; set; }
        public List<nonWorkingDirectorWagesbulk> nonWorkingDirectorWages { get; set; }
    }


    public class UserVM
    {
        public string LoginUserEmail { get; set; }
        public string LoginUserName { get; set; }
        public string User_Name { get; set; }
        public string ParentUser_Password { get; set; }
        public string ParentUserLoginID { get; set; }
        public string company_name { get; set; }
        public string trade_name { get; set; }
        public string company_address { get; set; }
        public string company_reg_no { get; set; }
    }
    public class HolypayList
    {
        public List<Employee_holidpd_list1> employeeHolidayPayList { get; set; }
        public List<Employee_holidpd_list1> employeeHolidayPayDatesList { get; set; }
    }
}
