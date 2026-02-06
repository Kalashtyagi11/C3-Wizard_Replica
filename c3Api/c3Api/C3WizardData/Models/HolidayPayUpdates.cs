using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardData.Models
{
    public class HolidayPayUpdates
    {
        public HolidayPayUpdates()
        {
            holidaypayId = 0;
            Emp_Name = string.Empty;
            descother = string.Empty;
            HolidayPayWithLeave = true;
            LeaveType = string.Empty;
            from_date = null;
            to_date = null;
            IsWorkingDirector = false;
            holidayPay_Date = null;
            HolidayPayLeaveOther = false;
            wagesAmount = null;
            CompanyId = 0;
            employeinmode = 0;
        }


        public int holidaypayId { get; set; }
        public decimal? wagesAmount { get; set; }
        public DateTime? holidayPay_Date { get; set; }
        public int? CompanyId { get; set; }
        public string? SSN { get; set; }

     
        public string? Emp_Name { get; set; }
        public string? descother { get; set; }
        public bool? HolidayPayWithLeave { get; set; }
        public String? LeaveType { get; set; }
        public DateTime? from_date { get; set; }
        public DateTime? to_date { get; set; }
        public bool? IsWorkingDirector { get; set; }
        public bool? HolidayPayLeaveOther { get; set; }
       
        
        public int? employeinmode { get; set; }

    }
}
