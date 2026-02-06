using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class ProcessPayIncome
{
    public int ProcessPayIncId { get; set; }

    public int DocNo { get; set; }

    public int? LineNo { get; set; }

    public string? IncCode { get; set; }

    public decimal? IncRate { get; set; }

    public decimal? Number { get; set; }

    public decimal? Hours { get; set; }

    public decimal? Amount { get; set; }

    public int? AcctNo { get; set; }

    public string? Department { get; set; }

    public short? ModFlag { get; set; }

    public string? AddCode { get; set; }

    public decimal? LoIncAmt { get; set; }

    public decimal? HiIncAmt { get; set; }
}
