using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
  public class Employee_holidpd_list1
  {
    public Int32? holidayPayId { get; set; }
    public Int32? employeeID { get; set; }
    public Int32? company_ID { get; set; }
    public decimal Amount { get; set; }
    public string Month { get; set; }
    public DateTime? start_Date { get; set; }
    public DateTime? end_Date { get; set; }
    public string st_Date { get; set; }
    public string en_Date { get; set; }
    public Int32? PayNoOfTimes { get; set; }
    public string employeename { get; set; }
    public bool PayStatus { get; set; }
    public decimal? WAGES1 { get; set; }
    public decimal? WAGES2 { get; set; }
    public decimal? WAGES3 { get; set; }
    public decimal? WAGES4 { get; set; }
    public decimal? WAGES5 { get; set; }
    public string IsWithoutLeave { get; set; }
    public bool isHpay { get; set; }
    public string visabile { get; set; }

   
  }


  public class holidpd_listDataVm
  {
    public List<Employee_holidpd_list1>? Employee_holidpd_list1 { get; set; }

    public List<Employee_holidpd_list1>? Employee_holidpd_list2 { get; set; }
    public bool ishavinghpay { get; set; }
  }
}
