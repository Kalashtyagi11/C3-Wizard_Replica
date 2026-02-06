using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class User
    {
        [Key]
        public int userId { get; set; }

        [Required]
        public string firstName { get; set; }

        public string middleName { get; set; }

        [Required]
        public string lastName { get; set; }

        public string loginId { get; set; }

        public string emailId { get; set; }

        [Required]
        public int roleId { get; set; }

        public bool status { get; set; }

        public int? parentUserId { get; set; }

        public bool isPPOC { get; set; }
        [NotMapped]
        public string? RegNumber { get; set; }
        [NotMapped]
        public string? profileImage { get; set; }
        public IFormFile? userImage { get; set; }

    }
}
