using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class LoginResponse
    {
        public string FirstName { get; set; } = null!;

        public string? LastName { get; set; }

        public string LoginId { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? EmailId { get; set; }

        public string? SelfEmpId { get; set; }

        public string EmpId { get; set; } = null!;

        public string? Department { get; set; }

        public int? RoleId { get; set; }
        public string? MiddleName { get; set; }

        public bool? Status { get; set; }

        public string? UserImage { get; set; }

        public int? Parentuserid { get; set; }

  
    }
}
