using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class UserImagePost
    {
        [Key]
        public int userId { get; set; }
        public int? selfempid { get; set; }

        [Required]
        public string? firstName { get; set; }

        public string? middleName { get; set; }

        //[Required]
        public string? lastName { get; set; }

        public string? loginId { get; set; }

        public string? emailId { get; set; }

        public int? roleId { get; set; }

        public bool? status { get; set; }

        public int? parentUserId { get; set; }

        public bool? isPPOC { get; set; }
        
        //public string? profileImage { get; set; }
        [NotMapped]
        public IFormFile? profileImage { get; set; }
    }
}
