using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class Secmodule
{
    public int ModuleId { get; set; }

    public string? Module { get; set; }
    public string? PageUrl { get; set; }
    public string? icon { get; set; }

    public string? Description { get; set; }

    public int? Level { get; set; }

    public int? ParentId { get; set; }

    public string? FormName { get; set; }

    public int? ModuleTypeId { get; set; }

    public string? Option { get; set; }

    public int? InsertedBy { get; set; }

    public DateTime? InsertedOn { get; set; }

    public string? InsertedMachineInfo { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedOn { get; set; }

    public string? UpdatedMachineInfo { get; set; }

    public bool IsActive { get; set; }
}
