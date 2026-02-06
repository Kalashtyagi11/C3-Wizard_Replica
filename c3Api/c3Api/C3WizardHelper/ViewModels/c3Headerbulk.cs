using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class c3Headerbulk
    {
        public decimal totalEmpPePenalty { get; set; }
        public decimal calcEmpLevyAmt { get; set; }
        public decimal totalEmpLevyPenalty { get; set; }
        public decimal calcEmpPeAmt { get; set; }
        public decimal calcEmpSsAmt { get; set; }
        public decimal totalEmpSsFines { get; set; }
        public string c3Status { get; set; }
        public int numberEmployed { get; set; }
        public string notes { get; set; }
        public string submittedByEmail { get; set; }
        public string submittedByName { get; set; }
        public string dateReceived { get; set; }
        public string receivedBy { get; set; }
        public int nilReturn { get; set; }
    }
    
    public class nonWorkingDirectorWagesbulk
  {
    public string birthDate { get; set; }
    public string firstName { get; set; }
    public string surName { get; set; }
    public int sequenceNo { get; set; }
    public decimal levyAmt { get; set; }
    public string period { get; set; }
    public bool isNilReturn { get; set; }
    public string payerId { get; set; }
    public string payerType { get; set; }
    public int schedule { get; set; }
    public string ssn { get; set; }
    public decimal wages { get; set; }

  }
}
