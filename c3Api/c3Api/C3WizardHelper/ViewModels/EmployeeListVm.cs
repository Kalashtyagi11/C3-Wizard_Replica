using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class EmployeeListVm
    {
        public int EmployeeID { get; set; }
        public string? Empl_Code { get; set; }
        public string? Soc_Sec_Num { get; set; }
        public string? FirstName { get; set; }
        public string? Middle_Name { get; set; }
        public string? Last_Name { get; set; }
        public string? Type_Code { get; set; }
        public DateTime? BirthDate { get; set; }
        public DateTime? AppintDate { get; set; }
        public DateTime? Last_Pay_Date { get; set; }
        public DateTime? Terminated { get; set; }
        public DateTime? Wages_Pay_Date { get; set; }
        public string? Empl_Status { get; set; }
        public string? Pay_Period { get; set; }
        public int? AllowAnces { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public string? Country { get; set; }
        public string? Mobile { get; set; }
        public string? Phone { get; set; }
        public string? Landline { get; set; }
        public string? Fax { get; set; }
        public string? Tin { get; set; }
        public string? ContactPerson { get; set; }
        public string? Email { get; set; }
        public bool? IsVerified { get; set; }
        public int? CompanyId { get; set; }
        public string? CompanyName { get; set; }
        public string? TradeName { get; set; }
        public string? RegNumber { get; set; }
        public decimal? Wage { get; set; } // For calculated wage
        public decimal? WageAmt { get; set; }
        public string? Department { get; set; }
        public bool? IsdirectorOnly { get; set; }
        public bool? IsemployeeDirector { get; set; }
        public bool? IsLevyExempt { get; set; }
        public string? Bank_Acct_No { get; set; }
        public int? State_Allow { get; set; }
        public string? Marital_Stat { get; set; }
        public string Hold_Pymnt { get; set; }
        public decimal? State_udf { get; set; }
        public string? FlexDeptAcctType { get; set; }
        public DateTime? Last_Inc_Date { get; set; }


        //editDirector
        public string? occupation { get; set; }
        public string? Salary { get; set; }


    }

}
