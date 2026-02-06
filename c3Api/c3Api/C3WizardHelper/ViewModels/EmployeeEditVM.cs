using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class EmployeeEditVM
    {
        public string? SocSecNum { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public bool? rbmale { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? Zip { get; set; }
        public string? Phone { get; set; }
        public string? Mobile { get; set; }
        public string? Email { get; set; }
        public string? Tin { get; set; }
        //public string? IncRate { get; set; }
        public DateTime? lastPayDate { get; set; }
        public DateTime? Terminated { get; set; }
        public bool? Terminatedchecked { get; set; }
        public bool? IsDirectorchecked { get; set; }
        public bool? commencementDatechecked { get; set; }
        public string? incRate { get; set; }

        public DateTime? commencementDate { get; set; }
        public string? payPeriod { get; set; }
        public string? MaritalStat { get; set; }
        public string? Occupation { get; set; }
        public string? Department { get; set; }
        public bool? isemployeeDirector { get; set; }
        
        public bool? IsLevyExempt { get; set; }
        //update
        public int? EmployeeID { get; set; }
        public string EmplCode { get; set; }
        public int? mode { get; set; }
        public decimal? amount { get; set; }
        public decimal? wagesAmount { get; set; }
        public DateTime? holidayPay_Date { get; set; }
        public int? HolidayPayId { get; set; }


    }
}
