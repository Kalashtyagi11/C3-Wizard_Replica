using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class MasterHolidayPayDetail
{
    public int HolidayPayId { get; set; }

    public int? EmployeeId { get; set; }

    public int? CompanyId { get; set; }

    public decimal? Amount { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public int? PayNoOfTimes { get; set; }

    public int? Insertedby { get; set; }

    public DateTime? Insertedon { get; set; }

    public string? Insertedmachineinfo { get; set; }

    public int? Updateby { get; set; }

    public DateTime? Updateon { get; set; }

    public string? Updatemachineinfo { get; set; }

    public string? EmployeeDetails { get; set; }

    public bool? IsWithoutLeave { get; set; }

    public string? PerioddMonth { get; set; }

    public string? PeriodYear { get; set; }

    public string? OtherHpaydes { get; set; }
}
