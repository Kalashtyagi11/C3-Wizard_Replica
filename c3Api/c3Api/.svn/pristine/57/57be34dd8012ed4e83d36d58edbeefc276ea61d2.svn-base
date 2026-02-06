using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardData.Models
{
    public class AuditLog : BaseEntity
    {
        public int Id { get; set; }

        public string EventType { get; set; } = null!;

        public string TableName { get; set; } = null!;

        public string? ColumnName { get; set; } = null!;

        public string? OldValue { get; set; }

        public string? NewValue { get; set; }

        public string? Url { get; set; }

        public string? Controller { get; set; }

        public string? Action { get; set; }

        public string? Area { get; set; }

        public string? Ipaddress { get; set; }

        public int? RecordId { get; set; }

        public int? OldSystemId { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedOn { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public bool IsActive { get; set; }

        public string? Message { get; set; }

        public int? SourceData { get; set; }
    }
    public abstract class BaseEntity
    {
        public int Id { get; set; }

        [ScaffoldColumn(false)]
        public int? OldSystemId { get; set; }

        [ScaffoldColumn(false)]
        public int CreatedBy { get; set; }

        [Column(TypeName = "smalldatetime")]
        [ScaffoldColumn(false)]
        public DateTime? CreatedOn { get; set; }

        [ScaffoldColumn(false)]
        public int ModifiedBy { get; set; }

        [Column(TypeName = "smalldatetime")]
        [ScaffoldColumn(false)]
        public DateTime? ModifiedOn { get; set; }
        [Display(Name = "Status")]
        public bool IsActive { get; set; }
        public int SourceData { get; set; }
    }
}
