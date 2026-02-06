using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class MasterDeductionCode
{
    public int DedCodeId { get; set; }

    public string? DedCode { get; set; }

    public string? Description { get; set; }

    public string? DedType { get; set; }

    public string? DedTaxred { get; set; }

    public decimal? DfltRate { get; set; }

    public decimal? DfltLimit { get; set; }

    public string? DfltApply { get; set; }

    public decimal? DfltHiDedAmt { get; set; }

    public decimal? DfltLoDedAmt { get; set; }

    public string? StateEin { get; set; }

    public string? TaxJur { get; set; }

    public decimal DfltPayLimit { get; set; }

    public string? Yearrollover { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public bool? IsLocked { get; set; }
}
