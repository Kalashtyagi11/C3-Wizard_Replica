using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
  public class DecBonusSetting_Details
  {
    public Int32? DBSid { get; set; }
    public string Employee_Levy { get; set; }
    public string Employer_Levy { get; set; }
    public string Severance { get; set; }
    public string Social_Security { get; set; }
    public DateTime? start_Date { get; set; }
    public DateTime? end_Date { get; set; }
    public string st_Date { get; set; }
    public string en_Date { get; set; }
    public string yearName { get; set; }
    public string islocked { get; set; }
    public bool Candelete { get; set; }
    public bool Canedit { get; set; }
    public int? MonthNo { get; set; }
  }

  public class deductionHeaderVm
  {
    public string leavyName { get; set; }
    public string fromDate { get; set; }
    public string toDate { get; set; }
    public int mode { get; set; }
    public int? id { get; set; }
  }
}
