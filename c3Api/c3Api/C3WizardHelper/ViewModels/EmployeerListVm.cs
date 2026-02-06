using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class EmployeerListVm
    {
        public int CompanyId { get; set; }

        public string? CompanyName { get; set; }

        public string? TradeName { get; set; }

        public string? RegNumber { get; set; }

        public string? Address1 { get; set; }

        public string? Address2 { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }

        public string? Zip { get; set; }

        public string? Country { get; set; }

        public string? Mobile { get; set; }

        public string? Landline { get; set; }

        public string? Fax { get; set; }

        public string? ContactPerson { get; set; }

        public string? Email { get; set; }
        public bool? IsVerified { get; set; }
    }
}
