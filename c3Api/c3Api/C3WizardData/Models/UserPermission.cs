using System;
using System.Collections.Generic;

namespace C3WizardData.Models;

public partial class UserPermission
{
    public int Id { get; set; }

    public int CompanyId { get; set; }

    public bool? Administrative { get; set; }

    public bool? Standard { get; set; }

    public string? MenuItemName { get; set; }
}
