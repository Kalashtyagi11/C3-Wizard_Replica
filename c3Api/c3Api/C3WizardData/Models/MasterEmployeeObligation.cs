using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class MasterEmployeeObligation
{
    public int EmpOblId { get; set; }

    public int? EmployeeId { get; set; }

    public string? EmplCode { get; set; }

    public string? OblCode { get; set; }

    public int? LineNo { get; set; }

    public decimal? DedRate { get; set; }

    public decimal? OblLimit { get; set; }

    public string? OblApply { get; set; }

    public int? AcctNo { get; set; }

    public string? Department { get; set; }

    public int? BalAcctNo { get; set; }

    public decimal? OblQtd1 { get; set; }

    public decimal? OblQtd2 { get; set; }

    public decimal? OblQtd3 { get; set; }

    public decimal? OblQtd4 { get; set; }

    public decimal? OblYtd { get; set; }

    public decimal? PayLimit { get; set; }
}
