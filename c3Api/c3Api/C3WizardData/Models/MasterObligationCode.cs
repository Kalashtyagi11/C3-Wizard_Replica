using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class MasterObligationCode
{
    public int OblCodeId { get; set; }

    public string? OblCode { get; set; }

    public string? Description { get; set; }

    public string? OblType { get; set; }

    public decimal? DfltRate { get; set; }

    public decimal? DfltLimit { get; set; }

    public decimal? DfltPayLimit { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public bool? IsLocked { get; set; }
}
