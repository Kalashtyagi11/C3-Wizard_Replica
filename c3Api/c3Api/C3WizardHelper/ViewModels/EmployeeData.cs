using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class EmployeeData
    {
        public string Empl_Code { get; set; }
        public string Soc_Sec_Num { get; set; }
        public string First_Name { get; set; }
        public string Middle_Name { get; set; }
        public string Last_Name { get; set; }
        public string Type_Code { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Gender { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public DateTime? Appint_Date { get; set; }
        public DateTime? Last_Pay_Date { get; set; }
        public DateTime? Wages_Pay_Date { get; set; }
        public DateTime? Terminated { get; set; }
        public string Empl_Status { get; set; }
        public string Pay_Period { get; set; }
        public string Marital_Stat { get; set; }
        public bool? Hold_Pymnt { get; set; }
        public DateTime? Last_Inc_Date { get; set; }
        public string Occupation { get; set; }
    }

}
