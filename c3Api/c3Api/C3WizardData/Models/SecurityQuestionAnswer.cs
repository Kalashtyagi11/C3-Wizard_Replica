using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class SecurityQuestionAnswer
{
    public int SecurityId { get; set; }

    public int? UserId { get; set; }

    public int? CompanyId { get; set; }

    public string? UserName { get; set; }

    public int? RegistrationNo { get; set; }

    public string? CompanyName { get; set; }

    public string? Question1 { get; set; }

    public string? Question2 { get; set; }

    public string? Answer1 { get; set; }

    public string? Answer2 { get; set; }

    public int? InsertedBy { get; set; }

    public DateTime? InsertedOn { get; set; }

    public string? InsertedMachineInfo { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedOn { get; set; }

    public string? UpdatedMachineInfo { get; set; }

    public bool IsActive { get; set; }
}
