using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class EmployeeWorkDurationDetail
{
    public int Id { get; set; }

    public string? RegNo { get; set; }

    public string? Ssn { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string? Designation { get; set; }

    public string? PayPeriod { get; set; }

    public decimal? Wage { get; set; }

    public int? EmployeeId { get; set; }

    public int? CompanyId { get; set; }

    public DateTime? InsertedOn { get; set; }

    public string? InsertedMachineInfo { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedOn { get; set; }

    public string? UpdatedMachineInfo { get; set; }

    public bool IsActive { get; set; }

    public int? InsertedBy { get; set; }
}
