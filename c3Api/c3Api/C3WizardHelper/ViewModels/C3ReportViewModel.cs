using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class C3ReportsViewModel
    {
        public int row_no { get; set; }
       
        public string company_name { get; set; }

        public string trade_name { get; set; }
        public string company_address { get; set; }

        public string? OrderName { get; set; }
        public string? OrderKey { get; set; }


        public string company_reg_no { get; set; }
        public int no_of_employee { get; set; }
        public string current_month { get; set; }
        public string social_security_no { get; set; }
        public string emp_name { get; set; }
        public string Appint_Date { get; set; }
        public string Column4 { get; set; }
        public string pay_period { get; set; }
        public string first_week_of_month { get; set; }
        public string second_week_of_month { get; set; }
        public string third_week_of_month { get; set; }
        public string four_week_of_month { get; set; }
        public string five_week_of_month { get; set; }
        public decimal? first_week_of_salary { get; set; }
        public decimal? second_week_of_salary { get; set; }
        public decimal? third_week_of_salary { get; set; }
        public decimal? four_week_of_salary { get; set; }
        public decimal? five_week_of_salary { get; set; }
        public decimal Column2 { get; set; }
        public decimal Column1 { get; set; }
        public decimal TotalWages { get; set; }
        public decimal total_wages { get; set; }

        public decimal deduct_leavy_wages { get; set; }
        public decimal total_soc_sec { get; set; }
        public decimal SERVAYANCE { get; set; }
        public decimal SERVAYANCE_PEPENALTY { get; set; }
        public decimal TOTAL_LEVYEEPENALTY { get; set; }
        public decimal TOTAL_SSPENALTY { get; set; }
        public string remarks { get; set; }
        public decimal Column3 { get; set; }
        public decimal HPay_Week1 { get; set; }
        public decimal HPay_Week2 { get; set; }
        public decimal HPay_Week3 { get; set; }
        public decimal HPay_Week4 { get; set; }
        public decimal HPay_Week5 { get; set; }
    }
}
