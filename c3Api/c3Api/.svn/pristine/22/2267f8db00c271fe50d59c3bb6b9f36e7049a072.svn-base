using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{

  public class C3ContributionVm
  {
    public int? CONTID { get; set; }
    public int? C3HEADERID { get; set; }
    public string SSN { get; set; }
    public string? SSND { get; set; }
    public int? EmployeeId { get; set; }
    public string EmployeeName { get; set; }
    public string? period_Month { get; set; }
    public string? Period_year { get; set; }
    public string? PayFreq { get; set; }
    public string? ISSelectedWEEK1 { get; set; }
    public string? ISSelectedWEEK2 { get; set; }
    public string? ISSelectedWEEK3 { get; set; }
    public string? ISSelectedWEEK4 { get; set; }
    public string? ISSelectedWEEK5 { get; set; }
    public decimal? EmpSalary { get; set; }
    public virtual decimal? wage_Amt { get; set; }
    public decimal? WAGES1 { get; set; }
    public decimal? WAGES2 { get; set; }
    public decimal? WAGES3 { get; set; }
    public decimal? WAGES4 { get; set; }
    public decimal? WAGES5 { get; set; }
    public decimal? tempWAGES1 { get; set; }
    public decimal? tempWAGES2 { get; set; }
    public decimal? tempWAGES3 { get; set; }
    public decimal? tempWAGES4 { get; set; }
    public decimal? tempWAGES5 { get; set; }
    public decimal? HPAY { get; set; }
    public decimal? OtherPAY { get; set; }
    public decimal? DirectorWagesPAY { get; set; }
    public string? IsHPAY { get; set; }
    public decimal? BONUS { get; set; }
    public decimal? TotalWadeges { get; set; }
    public bool WEEK1 { get; set; }
    public bool WEEK2 { get; set; }
    public bool WEEK3 { get; set; }
    public bool WEEK4 { get; set; }
    public bool WEEK5 { get; set; }
    public int? SelectedTypeWEEK1 { get; set; }
    public int? SelectedTypeWEEK2 { get; set; }
    public int? SelectedTypeWEEK3 { get; set; }
    public int? SelectedTypeWEEK4 { get; set; }
    public int? SelectedTypeWEEK5 { get; set; }
    public bool IsWeekfifth { get; set; }
    public bool emp_add_remove { get; set; }
    public bool IsRemarkDisable { get; set; }
    public bool IsemployeeDirector { get; set; }
    public bool IsLevyExempt { get; set; }
    public decimal? LEVYEE { get; set; }
    public decimal? SocialSecurity { get; set; }
    public decimal? SS_Fines { get; set; }
    public decimal? SS_Employee { get; set; }
    public decimal? SS_Employer { get; set; }
    public decimal? Levy_Penalty { get; set; }
    public decimal? SERVAYANCE { get; set; }
    public decimal? SERVAYANCE_PENALTY { get; set; }
    public string? Date_Joining { get; set; }
    public string? Date_terminated { get; set; }
    public string? BirthDate { get; set; }
    public string? T_C_Date { get; set; }
    public string? Remarks { get; set; }
    public string? DirRemarks { get; set; }
    public string? Department { get; set; }
    public string? PayPeriod { get; set; }
    public decimal? HPay_Week1 { get; set; }
    public decimal? HPay_Week2 { get; set; }
    public decimal? HPay_Week3 { get; set; }
    public decimal? HPay_Week4 { get; set; }
    public decimal? HPay_Week5 { get; set; }
  }

  public class previewDirectorVm
  {
    public List<C3ContributionVm> obj_list { get; set; }
    public List<C3ContributionVm> Not_Selected_list { get; set; }
    public int monthNum { get; set; }
    public int year { get; set; }
    public int H_Id { get; set; }
    public int schedule_no { get; set; }
    public bool Isneedtosave { get; set; }
    public bool isrecordEdit { get; set; }
    public bool is_preview { get; set; }

  }

  public class selfEmpVm
  {

    public int indexListNo { get; set; }  //edit||change
    public int dropNo { get; set; }  //edit||change
    public string year { get; set; }  //edit||change
    public int month { get; set; }//edit||change
    public string ssNofEmp { get; set; }
    public string userName { get; set; }
    public string? address { get; set; }
    public string textTotalWages { get; set; }
    public string textTotalWagesNLevy { get; set; }
    public string textLevyPenalty { get; set; }
    public decimal? wcontribution { get; set; }
    public decimal? wincome { get; set; }
    public string category_Type { get; set; }
    public string textTotalAccountantGeneral { get; set; }
    public string? currentMonth { get; set; }
    public List<C3ContributionVm> obj_list { get; set; }
  }

  public class SaveSelEmpVM
  {
    public int month { get; set; }
    public int Year { get; set; }
    public int H_Id { get; set; }
    public int SSNofEmp { get; set; }
    public string UserName { get; set; }
    public string TextLevyPenalty { get; set; }
   
    public int UserID { get; set; }
    public List<C3ContributionVm> obj_list { get; set; }
  }

  public class SelfEmployedC3ReportVM
  {

    public string EmpName { get; set; }
    public string SocialSecurityNo { get; set; }
    public string CompanyAddress { get; set; }
    public string CurrentMonth { get; set; }
    public string date { get; set; }
    public string FirstWeekOfMonth { get; set; }
    public string SecondWeekOfMonth { get; set; }
    public string ThirdWeekOfMonth { get; set; }
    public string FourthWeekOfMonth { get; set; }
    public string FifthWeekOfMonth { get; set; }
    public decimal DeductLeavyWages { get; set; }
    public decimal TotalWages { get; set; }
    public decimal fine { get; set; }
    public decimal grandTotal { get; set; }
    public string Remarks { get; set; }
    public string Category_Type { get; set; }
    public string receiptNumber { get; set; }
    public string receiptDate { get; set; }


  }

  public class ContributionOnChange
  {
    public decimal?  TotalWadeges { get; set; }
    public decimal?  LEVYEE { get; set; }
    public string ? TextTotalWages { get; set; }
    public decimal?  TextTotalWagesNLevy { get; set; }
    public decimal?  TextLevyPenalty { get; set; }
    public decimal?  TextTotalAccountantGeneral { get; set; }
    public decimal? gridAmount { get; set; }
  }


}
