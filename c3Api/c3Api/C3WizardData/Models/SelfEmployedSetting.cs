using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class SelfEmployedSetting
{
    public int Sesid { get; set; }

    public string? Name { get; set; }

    public DateTime? FormDate { get; set; }

    public DateTime? ToDate { get; set; }

    public bool? IsLocked { get; set; }
}
