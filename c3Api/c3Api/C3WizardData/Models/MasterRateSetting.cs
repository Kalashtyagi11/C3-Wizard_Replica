using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class MasterRateSetting
{
    public int Mrsid { get; set; }

    public double? BonusLevyEeRate { get; set; }

    public double? SeveranceRate { get; set; }

    public double? SocEeRate { get; set; }

    public double? SocErRate { get; set; }

    public double? Eib { get; set; }

    public double? FineRate { get; set; }

    public double? AdditionalFineRate { get; set; }

    public double? PenaltyRate { get; set; }

    public double? AdditionalPenaltyRate { get; set; }

    public int? MinAge { get; set; }

    public int? MaxAge { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public bool? IsLocked { get; set; }

    public double? EmployerLevy { get; set; }
}
