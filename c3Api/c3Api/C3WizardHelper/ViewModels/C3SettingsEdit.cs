using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class C3SettingsEdit
    {
        public string FromMonth { get; set; }
        public string? ToMonth { get; set; }
        public int? FromYear { get; set; }
        public int? ToYear { get; set; }
        //General
        public string? SeveranceCountributionRate { get; set; }
        public string? MinAge { get; set; }
        public string? MaxAge { get; set; }
        public string? MineFineRate { get; set; }
        public string? AdditionalFineRate { get; set; }
        public string? MinPenaltyRate { get; set; }
        public string? AdditionalPenaltyRate { get; set; }
        public string? EmployerLevyrate { get; set; }
        //Bonus
        public string? EmployeeLevyCountrybutionbonus { get; set; }
        //S.S.ER
        public string? EmployerSSCountributionrate { get; set; }
        public string? MaxAmountforemployersocialsecurity { get; set; }
        public string? MaxAmountPayableforemployersocialsecurity { get; set; }
        //S.S.EE
        public string? EmployeeSocialSecurityContributionRate { get; set; }
        public string? MaxAmountForEmployeeSocialSecurity { get; set; }
        public string? MaxAmountPayableForEmployeeSocialSecurity { get; set; }
        //EIB
        public string? EIBContributionRate { get; set; }
        public string? MaxAmountForEIB { get; set; }
        public string? MaxAmountPayableForEIB { get; set; }


        public int? mrsId { get; set; }
        public int? dedcodeid { get; set; }
        public int? socerOblID { get; set; }
        public int? eibid { get; set; }
    }
}
