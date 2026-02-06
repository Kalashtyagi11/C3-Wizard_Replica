using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class NonWorkingDirectorWage
    {
        public string BirthDate { get; set; }
        public string EndDate { get; set; }
        public string FirstName { get; set; }
        public decimal LevyAmt { get; set; }
        public decimal Levy_amt { get; set; }  // Consider renaming for clarity
        public string MiddleName { get; set; }
        public string PayerId { get; set; }
        public string PayerType { get; set; }
        public string Period { get; set; }
        public int SequenceNo { get; set; }
        public string Ssn { get; set; }
        public string StartDate { get; set; }
        public string SurName { get; set; }
        public decimal Wages { get; set; }
    }
}
