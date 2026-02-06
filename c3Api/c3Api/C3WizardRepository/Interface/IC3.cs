using C3WizardData.Models;
using C3WizardHelper.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardRepository.Interface
{
  public interface IC3
  {
   
    public Task<IEnumerable<C3HeaderVM>> GetC3ReportsAlldata(int companyId);
    public Task<IEnumerable<MasterEmployee>> LoadEmployeeAsyn(int companyId);
  }
}
