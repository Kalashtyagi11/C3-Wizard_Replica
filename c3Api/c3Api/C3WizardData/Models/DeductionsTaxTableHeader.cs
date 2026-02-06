using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class DeductionsTaxTableHeader
{
    public int TaxTabHid { get; set; }

    public string? TaxYear { get; set; }

    public string? DedCode { get; set; }

    public decimal? WeekAllow { get; set; }

    public decimal? BiweekAllow { get; set; }

    public decimal? SmonthAllow { get; set; }

    public decimal? MonthAllow { get; set; }

    public decimal? QuarterAllow { get; set; }

    public decimal? SyearAllow { get; set; }

    public decimal? YearAllow { get; set; }

    public decimal? MiscAllow { get; set; }

    public decimal? HrsWeekAllow { get; set; }

    public decimal? HrsBiweekAllow { get; set; }

    public decimal? HrsSmonthAllow { get; set; }

    public decimal? HrsMonthAllow { get; set; }

    public decimal? HrsQuarterAllow { get; set; }

    public decimal? HrsSyearAllow { get; set; }

    public decimal? HrsYearAllow { get; set; }

    public decimal? HrsMiscAllow { get; set; }

    public string? AllowOrLimit { get; set; }
  public DateTime? startDate { get; set; }
  public DateTime? endDate { get; set; }
}
