using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class Holiday_Pay_Details
    {
        public Int32? holidayPayId { get; set; }
        public Int32? employeeID { get; set; }
        public Int32? company_ID { get; set; }
        public decimal Amount { get; set; }
        public DateTime? start_Date { get; set; }
        public DateTime? end_Date { get; set; }
        public string st_Date { get; set; }
        public string en_Date { get; set; }
        public string IsWithoutLeave { get; set; }
        public string otherHpaydes { get; set; }
        public Int32? PayNoOfTimes { get; set; }
        public Int32? insertedby { get; set; }
        public string insertedmachineinfo { get; set; }
        public DateTime? insertedon { get; set; }
        public Int32? updateby { get; set; }
        public string updatemachineinfo { get; set; }
        public DateTime? updateon { get; set; }
        public string employeename { get; set; }
        public string emptype { get; set; }
        public string IsempDirector { get; set; }
        public bool PayStatus { get; set; }
        public SortYear Year { get; set; }
        public string yearName { get; set; }
        public int monthno { get; set; }
        public bool isHpay { get; set; }
    }
    public enum SortYear { _2012, _2013, _2014, _2015, _2016, _2017, _2018, _2019, _2020, _2021, _2022, _2023, _2024, _2025, _0000 }
  public class HolidayPayRequest
  {
    public string EmployeeSSN { get; set; }
    public string? WHpayType { get; set; }
    public string? HpayType { get; set; }
    public string? Txt_Other { get; set; }
    public bool IsWorkingDirector { get; set; }
    public int CompanyId { get; set; }
    public decimal Amount { get; set; }
    public DateTime Pay_date { get; set; }
  }
}
