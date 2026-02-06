using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class C3HeaderViewModel
    {
        public int HeaderID { get; set; }
        public string RegNo { get; set; }
        public string PeriodMonth { get; set; }
        public string PeriodYear { get; set; }
        public int PMonth { get; set; }
        public int PYear { get; set; }
        public decimal TotalWages { get; set; }
        public decimal TotalSSContributions { get; set; }
        public decimal TotalLevyEmployee { get; set; }
        public decimal TotalServayance { get; set; }
        public string InsertDatetimeInfo { get; set; }
        public bool IsFinalized { get; set; }
        public bool IsSubmitted { get; set; }
        public bool C3IsFinalized { get; set; }
        public string IssubmittedShow { get; set; }
        public string IssubmittedColor { get; set; }
        public string IssubmittedShowImg { get; set; }
        public int ScheduleNo { get; set; }
    }
}

