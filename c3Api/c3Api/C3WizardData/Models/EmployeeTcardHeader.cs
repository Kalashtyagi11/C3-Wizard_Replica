using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class EmployeeTcardHeader
{
    public int EmpTcardId { get; set; }

    public long? CardNo { get; set; }

    public string? EmplCode { get; set; }

    public string? EmplName { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string? UsedFlag { get; set; }

    public int? Pybatchid { get; set; }

    public int? CompanyId { get; set; }
}
