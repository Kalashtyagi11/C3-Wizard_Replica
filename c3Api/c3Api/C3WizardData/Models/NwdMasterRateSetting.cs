using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class NwdMasterRateSetting
{
    public int NwdsId { get; set; }

    public double? NwdlevyRate { get; set; }

    public int? MinAge { get; set; }

    public int? MaxAge { get; set; }

    public double? PenalityRate { get; set; }

    public double? AdditionalPenaltyRate { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public bool? IsLocked { get; set; }
}
