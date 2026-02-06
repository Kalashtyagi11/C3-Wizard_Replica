using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
  
    public class C3Setting_Details
    {
        public Int32? GSettingId { get; set; }
        public Int32? BonusSettingId { get; set; }
        public Int32? SOCEEID { get; set; }
        public Int32? SOCERID { get; set; }
        public Int32? EIBID { get; set; }
        public string islocked { get; set; }
        public string GSetting { get; set; }
        public string BonusSetting { get; set; }
        public string SOCEE { get; set; }
        public string SOCER { get; set; }
        public string EIB { get; set; }
        public bool Candelete { get; set; }
        public bool Canedit { get; set; }
        public DateTime? start_Date { get; set; }
        public DateTime? end_Date { get; set; }
        public DateTime? Gstart_Date { get; set; }
        public DateTime? Gend_Date { get; set; }
        public DateTime? eestart_Date { get; set; }
        public DateTime? eeend_Date { get; set; }
        public DateTime? erstart_Date { get; set; }
        public DateTime? erend_Date { get; set; }
        public DateTime? eibstart_Date { get; set; }
        public DateTime? eibend_Date { get; set; }
        public string st_Date { get; set; }
        public string en_Date { get; set; }
        public string yearName { get; set; }
        public int monthno { get; set; }
        public string Bonus_Levy_EE_Rate { get; set; }
        public string SeveranceRate { get; set; }
        public string Fine_Rate { get; set; }
        public string Additional_Fine_Rate { get; set; }
        public string Penalty_Rate { get; set; }
        public string Additional_Penalty_Rate { get; set; }
        public string min_age { get; set; }
        public string max_age { get; set; }
        public string EmployerLevy { get; set; }

        public string EE_dflt_rate { get; set; }
        public string EE_dflt_pay_limit { get; set; }
        public string EE_dflt_limit { get; set; }
        public string ER_dflt_rate { get; set; }
        public string Er_dflt_pay_limit { get; set; }
        public string Er_dflt_limit { get; set; }
        public string EIBdflt_rate { get; set; }
        public string EIBdflt_pay_limit { get; set; }
        public string EIBdflt_limit { get; set; }

    }
}
