using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class HolidayPayDatesVm
    {

        public HolidayPayDatesVm()
        {
            holidaypayId = 0;                        
            Emp_Name = string.Empty;                 
            descother = string.Empty;                
            HolidayPayWithLeave = false;            
            LeaveType = string.Empty;               
            from_date = null;                       
            to_date = null;                         
            IsWorkingDirector = false;              
            PayDate = null;                         
            HolidayPayLeaveOther = false;           
            Amount = null;                          
            CompanyId = 0;                          
            employeinmode = 0;                      
        }

        public int holidaypayId { get; set; }
        public string? Emp_Name { get; set; }
        public string? descother { get; set; }
        public bool? HolidayPayWithLeave { get; set; }
        public String? LeaveType { get; set; }
        public DateTime? from_date { get; set; }
        public DateTime? to_date { get; set; }
        public bool? IsWorkingDirector { get; set; }
        public DateTime? PayDate { get; set; }
        public bool? HolidayPayLeaveOther { get; set; }
        public decimal? Amount { get; set; }
        public int? CompanyId { get; set; }
        public int? employeinmode { get; set; }
        
    }

    public class Holiday_Pay_Dates
    {
        public Int32? S_No { get; set; }
        public Int32? EmployeeID { get; set; }
        public Int32? Company_ID { get; set; }
        public string? SocialSecurityNo { get; set; }
        public string? Emp_Name { get; set; }
        public string? name { get; set; }
        public decimal Amount { get; set; }
        public DateTime holidayPay_Date { get; set; }
        public string? hodayPay_Date { get; set; }
        
    }


}
