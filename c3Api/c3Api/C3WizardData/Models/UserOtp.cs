using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardData.Models
{
    public partial class UserOtp
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string OtpType { get; set; }
        public string OtpCode { get; set; }
        public DateTime ExpiryTime { get; set; }
        public bool IsUsed { get; set; }
    }

}
