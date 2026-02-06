using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class MasterIncCode
{
    public int IncCodeId { get; set; }

    public string? IncCode { get; set; }

    public string? Description { get; set; }

    public decimal? DfltNum { get; set; }

    public decimal? DfltRate { get; set; }

    public decimal? DfltHours { get; set; }

    public int? DfltAcct { get; set; }

    public string? DfltDept { get; set; }

    public string? IncType { get; set; }

    public int? DfltLoIncAmt { get; set; }

    public int? DfltHiIncAmt { get; set; }

    public string? NonQual { get; set; }

    public string? DfltAccountType { get; set; }

    public int? InsertedBy { get; set; }

    public DateTime? InsertedOn { get; set; }

    public string? InsertedMachineInfo { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedOn { get; set; }

    public string? UpdatedMachineInfo { get; set; }

    public bool IsActive { get; set; }
}
