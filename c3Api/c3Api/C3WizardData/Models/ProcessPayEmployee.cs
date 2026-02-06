using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class ProcessPayEmployee
{
    public long PayProcessId { get; set; }

    public long DocNo { get; set; }

    public string? EmplCode { get; set; }

    public DateTime? DocDate { get; set; }

    public DateTime? PayDate { get; set; }

    public DateTime? EopDate { get; set; }

    public string? PrintCheck { get; set; }

    public int? CashAccNo { get; set; }

    public string? Department { get; set; }

    public decimal? CashAmount { get; set; }

    public string? CheckNo { get; set; }

    public decimal? IncGross { get; set; }

    public decimal? DedFica { get; set; }

    public decimal? IncTaxable { get; set; }

    public decimal? DedMedicare { get; set; }

    public decimal? DedFedTax { get; set; }

    public decimal? DedStaTax { get; set; }

    public decimal? DedLocTax { get; set; }

    public decimal? DedOther { get; set; }

    public decimal? OblFuta { get; set; }

    public decimal? OblFica { get; set; }

    public decimal? OblMedicare { get; set; }

    public decimal? OblOther { get; set; }

    public decimal? OblTotal { get; set; }

    public decimal? IncNet { get; set; }

    public decimal? IncExpense { get; set; }

    public decimal? TotalHours { get; set; }

    public string? OkToPost { get; set; }

    public string? AccureStick { get; set; }

    public string? AccureVac { get; set; }

    public decimal? Bonus { get; set; }

    public string? Deposit { get; set; }

    public DateTime? PayStartDate { get; set; }

    public int? Pybatchid { get; set; }
}
