using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class Self_Employed_Setting_Details
    {
        public Int32? SESId { get; set; }
        public string islocked { get; set; }
        public string year { get; set; }
        public bool Candelete { get; set; }
        public bool Canedit { get; set; }
        public DateTime? start_Date { get; set; }
        public DateTime? end_Date { get; set; }
        public string st_Date { get; set; }
        public string en_Date { get; set; }
        public string Name { get; set; }

    }
}
