using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class C3HeaderD
    {
        public string C3Status { get; set; }
        public decimal CalcEmpLevyAmt { get; set; }
        public decimal CalcEmpPeAmt { get; set; }
        public decimal CalcEmpSsAmt { get; set; }
        public string DateReceived { get; set; }
        public int NilReturn { get; set; }
        public string Notes { get; set; }
        public int NumberEmployed { get; set; }
        public string PayerId { get; set; }
        public string PayerType { get; set; }
        public string Period { get; set; }
        public string ReceivedBy { get; set; }
        public int SequenceNo { get; set; }
        public string SubmittedByEmail { get; set; }
        public string SubmittedByName { get; set; }
        public decimal TotalEmpLevyPenalty { get; set; }
        public decimal TotalEmpPePenalty { get; set; }
        public decimal TotalEmpSsFines { get; set; }

    }

}
