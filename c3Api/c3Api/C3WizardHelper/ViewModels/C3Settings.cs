using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class C3Settings
    {
       

        public string? FromMonth { get; set; }
        public string? ToMonth { get; set; }
        public int? FromYear { get; set; }
        public int? ToYear { get; set; }
        public int? param { get; set; }//
        public bool message { get; set; }
        //General
        public double? SeveranceCountributionRate { get; set; }
        public int? MinAge { get; set; }
        public int? MaxAge { get; set; }
        public double? MineFineRate { get; set; }
        public double? AdditionalFineRate { get; set; }
        public double? MinPenaltyRate { get; set; }
        public double? AdditionalPenaltyRate { get; set; }
        public double? EmployerLevyrate { get; set; }
        //Bonus
        public double? EmployeeLevyCountrybutionbonus { get; set; }
        //S.S.ER
        public decimal? EmployerSSCountributionrate { get; set; }
        public decimal? MaxAmountforemployersocialsecurity { get; set; }
        public decimal? MaxAmountPayableforemployersocialsecurity { get; set; }
        //S.S.EE
        public double? EmployeeSocialSecurityContributionRate { get; set; }
        public double? MaxAmountForEmployeeSocialSecurity { get; set; }
        public double? MaxAmountPayableForEmployeeSocialSecurity { get; set; }
        //EIB
        public double? EIBContributionRate { get; set; }
        public double? MaxAmountForEIB { get; set; }
        public double? MaxAmountPayableForEIB { get; set; }


        //update
        public int? mrsId { get; set; }
        public int? dedcodeid { get; set; }
        public int? socerOblID { get; set; }
        public int? eibid { get; set; }
       
    }
}
