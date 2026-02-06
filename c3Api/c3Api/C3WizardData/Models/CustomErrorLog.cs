using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardData.Models
{
    public class CustomErrorLog
    {
        public int Id { get; set; }

        public string ControllerName { get; set; } = null!;

        public string MethodName { get; set; } = null!;

        public string ErrorMessage { get; set; } = null!;

        public string? StackTrace { get; set; }

        public DateTime? LogDate { get; set; }

        public bool? IsActive { get; set; }
    }
}
