using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
  public class AuditDetailsVM : BaseViewModel
  {

    public string? EventType { get; set; }
    public string? TableName { get; set; }
    public string? ColumnName { get; set; }
    public string OldValue { get; set; }
    public string NewValue { get; set; }
    public string? Url { get; set; }
    public string? Controller { get; set; }
    public string? Action { get; set; }
    public string? Area { get; set; }
    public string? IPAddress { get; set; }
    public int? RecordId { get; set; }
    public string? UserName { get; set; }

  }
  public class BaseViewModel
  {
    public int Id { get; set; }
    public int CreatedBy { get; set; }

    [Column(TypeName = "smalldatetime")]
    public DateTime? CreatedOn { get; set; }
    public int ModifiedBy { get; set; }

    [Column(TypeName = "smalldatetime")]
    public DateTime? ModifiedOn { get; set; }
    [Display(Name = "Status")]
    public bool IsActive { get; set; }
    public string EncriptedId { get; set; }
  }
}
