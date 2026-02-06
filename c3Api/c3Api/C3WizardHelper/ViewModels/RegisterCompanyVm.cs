using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class RegisterCompanyVm
    {

        public RegisterCompanyVm()
        {
            FirstName = string.Empty;
            MiddleName = string.Empty;
            LastName = string.Empty;
            LoginId = string.Empty;
            Password = string.Empty;
            EmailId = string.Empty;
            CompanyName = string.Empty;
            RegNumber = string.Empty;
            Address1 = string.Empty;
            Address2 = string.Empty;
            City = string.Empty;
            Zip = string.Empty;
            Country = string.Empty;
            Mobile = string.Empty;
            Landline = string.Empty;
            ContactPerson = string.Empty;
            Email = string.Empty;
            Question1 = string.Empty;


        }
        [Required(ErrorMessage = "Employment Type is required.")]
        public string? employmentType { get; set; }
        public string? FirstName { get; set; } = null!;
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string LoginId { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? EmailId { get; set; }
        public string? profileImage { get; set; }
        public string? companyLogo { get; set; }
        public string? CompanyName { get; set; }
        public string? TradeName { get; set; }
        public string? RegNumber { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public string? Zip { get; set; }
        public string? Country { get; set; }
        public string? Mobile { get; set; }
        public string? Landline { get; set; }
        public string? ContactPerson { get; set; }
        public string? Email { get; set; }
        public bool? IsLevyExempt { get; set; }
        public string? Question1 { get; set; }
        public string? Question2 { get; set; }
        public string? Answer1 { get; set; }
        public string? Answer2 { get; set; }

        //selfemployee
        public string? SocSecNum { get; set; }
        public string? CategoryType { get; set; }
        public string? MaritalStat { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Gender { get; set; }
        public string? Phone { get; set; }
        public string? Tin { get; set; }
        public string? UserName { get; set; }
        public int? RegistrationNo { get; set; }
        public string? UserStatus { get; set; }
        public string? dateRegistered { get; set; }
        public string? officeCode { get; set; }


    }

}
