using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    using System.ComponentModel.DataAnnotations;

    public class ForgetpasswordVm
    {
        [Required(ErrorMessage = "Registration number is required.")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "Registration number should be exactly 6 digits.")]
        public string regNo { get; set; }

        public int? UserId { get; set; }

        [Required(ErrorMessage = "Login ID is required.")]
        public string? userName { get; set; }

        [Required(ErrorMessage = "Please select Question 1.")]
        public string? Question1 { get; set; }

        [Required(ErrorMessage = "Please select Question 2.")]
        public string? Question2 { get; set; }

        [Required(ErrorMessage = "Answer 1 is required.")]
        public string? Answer1 { get; set; }

        [Required(ErrorMessage = "Answer 2 is required.")]
        public string? Answer2 { get; set; }

        public string? Password { get; set; }
    }

}
