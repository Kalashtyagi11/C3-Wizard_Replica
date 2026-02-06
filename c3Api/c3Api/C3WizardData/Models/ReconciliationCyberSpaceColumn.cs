using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace C3WizardData.Models;

public partial class ReconciliationCyberSpaceColumn
{
    public int Id { get; set; }

    public string? Columns { get; set; }

    public bool? IsActive { get; set; }

    public int? UserId { get; set; }

    public DateTime? CreatedOn { get; set; }

    public int? CreatedBy { get; set; }
}
