using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class RegisterSelfEmpVm
    {
        //SelfEmp
        public string? SocSecNum { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public int? CategoryType { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Gender { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? Zip { get; set; }
        public string? Phone { get; set; }
        public string? Mobile { get; set; }
        public string? MaritalStat { get; set; }
        
        public string? Tin { get; set; }
        //secusers
        public string LoginId { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? EmailId { get; set; }
        public IFormFile? UserImage { get; set; }
        //securityans
        public string? UserName { get; set; }
        public int? RegistrationNo { get; set; }
        //public string? CompanyName { get; set; }
        public string? Question1 { get; set; }
        public string? Question2 { get; set; }
        public string? Answer1 { get; set; }
        public string? Answer2 { get; set; } 
    }
}
