using C3WizardData.Models;
using C3WizardHelper.ViewModels;
using C3WizardLayer.BusinessObjects;
using C3WizardLayer.DataObjects;
using C3WizardRepository.Common;
using C3WizardRepository.Interface;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace C3WizardRepository.Repository
{
    public class RepoNonDirector 
    {
        private readonly C3wizardContext _DbContext;
        public RepoNonDirector(C3wizardContext c3WizardContext)
        {
            _DbContext = c3WizardContext;

        }

        //public async Task<ResponseModel> Save_Employee_Click(C3EmployeeVM DirectorVM)
        //{
            
        //    ResponseModel response = new ResponseModel();
        //    bool companyexist = false;
        //    int companyid = 1, existingcompanyid = 0;
        //    int? ssn = DirectorVM.SocSecNum;

        //    if (DirectorVM.SocSecNum != null)
        //    {
        //        //BLMasterEmployee bme;
        //        SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
        //        DataSet dataSet = new DataSet();
        //        try
        //        {
        //            //string SqlQuerystring = ConfigurationSettings.AppSettings.Get("AppConnection");
        //            SqlConnection con = new SqlConnection(C3WizardLayerConn_BaseData.StaticSqlConnection.ConnectionString);
        //            con.Open();
        //            SqlCommand cmd = new SqlCommand("SELECT * FROM MasterEmployee WHERE Isactive=1 And Soc_Sec_Num=" + ssn + " and CompanyId=" + companyid, con);
        //            cmd.CommandType = CommandType.Text;
        //            SqlDataAdapter adapter = new SqlDataAdapter();
        //            adapter.SelectCommand = cmd;
        //            adapter.Fill(dataSet);
        //            if (dataSet.Tables[0].Rows.Count > 0)
        //            {
        //                for (int i = 0; dataSet.Tables[0].Rows.Count > i; i++)
        //                {
        //                    existingcompanyid = int.Parse(dataSet.Tables[0].Rows[i][41].ToString());

        //                    if (existingcompanyid == companyid && DirectorVM.mode != 2)
        //                    {
        //                        con.Close();
        //                        response.Message = "C3 Wizard,Director/Employee already exist in this company";
        //                        response.Status = true;
        //                        return response;
        //                    }

        //                }
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            response.Message = "Error: " + ex.Message;
        //            response.Status = false;
        //        }
        //    }

        //    BLMasterEmployee blemployee = new BLMasterEmployee();
        //    string gender = null;
        //    if (DirectorVM.rbmale == true)
        //    {
        //        gender = "Male";
        //    }
        //    else
        //    {
        //        gender = "Female";
        //    }
        //    blemployee.SocSecNum = DirectorVM.SocSecNum.ToString();
        //    blemployee.FirstName = DirectorVM.FirstName;
        //    blemployee.MiddleName = DirectorVM.MiddleName;
        //    blemployee.LastName = DirectorVM.LastName;
        //    blemployee.Phone = DirectorVM.Phone;
        //    blemployee.Mobile = DirectorVM.Mobile;
        //    blemployee.MaritalStat = DirectorVM.MaritalStat;
        //    blemployee.Address1 = DirectorVM.Address1;
        //    blemployee.Address2 = DirectorVM.Address2;
        //    blemployee.Country = String.IsNullOrEmpty(DirectorVM.Country) ? "0" : DirectorVM.Country.ToString();
        //    blemployee.City = DirectorVM.City;
        //    blemployee.Zip = DirectorVM.Zip;
        //    blemployee.IsActive = true;
        //    blemployee.IsdirectorOnly = true;
        //    blemployee.IsemployeeDirector = false;
        //    blemployee.BirthDate = DirectorVM.BirthDate;
        //    blemployee.Gender = gender;
        //    blemployee.Email = DirectorVM.Email;
        //    blemployee.CompanyId = companyid;
        //    try
        //    {
        //        if (DirectorVM.MaritalStat != null)
        //            blemployee.MaritalStat = DirectorVM.MaritalStat.ToString() == "Single" ? "S" : (DirectorVM.MaritalStat.ToString() == "Married" ? "M" : "");
        //    }
        //    catch { }
        //    try
        //    {
        //        if (DirectorVM.PayPeriod == "Weekly")
        //            blemployee.PayPeriod = "W";
        //        if (DirectorVM.PayPeriod == "Monthly")
        //            blemployee.PayPeriod = "M";
        //        if (DirectorVM.PayPeriod == "Every Two Weeks")
        //            blemployee.PayPeriod = "B";
        //        if (DirectorVM.PayPeriod == "Twice Monthly")
        //            blemployee.PayPeriod = "S";

        //    }
        //    catch (Exception ex)
        //    {
        //        response.Message = "Error: " + ex.Message;
        //        response.Status = false;

        //    }
        //    blemployee.Terminated = DirectorVM.Terminated;
        //    decimal? Salary = DirectorVM.IncRate;
        //    int? mode = DirectorVM.mode;
        //    blemployee.AppintDate = DirectorVM.commencementDate;
        //    blemployee.occupation = DirectorVM.Occupation;
        //    blemployee.Department = DirectorVM.Department;
        //    if (DirectorVM.mode == 1 && companyexist == false)
        //    {
        //        try
        //        {
        //            blemployee.InsertedBy = companyid;
        //            blemployee.InsertedOn = DateTime.Now;

        //            blemployee.SaveNew();
        //            var saveemployeeincome = save_MasterEmployeeIncomes(blemployee, Salary, mode);

        //            response.Status = true;
        //            response.Message = "Director data saved successfully";
        //            response.Statuscode = 200;
        //            response.Data = new { blemployee, saveemployeeincome };
        //            try
        //            {
        //                SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
        //                if (staticConnection.State == ConnectionState.Open)
        //                {
        //                    staticConnection.Close();
        //                }
        //                SqlCommand updateContributions = new SqlCommand("Update Process_Contributions set SSN='" + blemployee.EmployeeID + "' from Process_Contributions pc inner join PROCESS_C3Header pc3 on pc.C3HEADERID=pc3.C3HEADERID 	where  pc.C3HEADERID=pc3.C3HEADERID and pc3.EmployerID=" + companyid + " And SSND ='" + ssn + "' ", staticConnection);
        //                if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
        //                int urow = updateContributions.ExecuteNonQuery();
        //                staticConnection.Close();
        //            }
        //            catch (Exception ex)
        //            {

        //            }
        //        }
        //        catch (Exception ex)
        //        {

        //            // Set the response message
        //            response.Message = "An error occurred while saving the new record. Please contact the support team.";
        //            response.Status = false;
        //            return response;
        //        }


        //    }
        //    else if (DirectorVM.mode == 2)
        //    {
        //        try
        //        {
        //            blemployee.EmployeeID = DirectorVM.EmployeeID;
        //            blemployee.EmplCode = DirectorVM.EmplCode;
        //            blemployee.UpdatedBy = companyid;
        //            blemployee.UpdatedOn = DateTime.Now;
        //            blemployee.Update();
        //            var saveemployeeincome = save_MasterEmployeeIncomes(blemployee, Salary, mode);

        //            response.Status = true;
        //            response.Message = "Director data Updated successfully";
        //            response.Statuscode = 200;
        //            response.Data = new { blemployee, saveemployeeincome };

        //        }
        //        catch (Exception ex)
        //        {
                  
        //            response.Message = "Error saving new record: system has detected a data exception.";
        //            response.Status = false;
        //            return response;
                   
        //        }
               
        //    }
        //    return response;

        //}


        private BLMasterEmployeeIncomes save_MasterEmployeeIncomes(BLMasterEmployee obj, decimal? Salary,int? mode)
        {
            int EmpIncomeID = 0;
            BLMasterEmployeeIncomes empInc = new BLMasterEmployeeIncomes();
            try
            {
                empInc.EmpIncomeID = EmpIncomeID;
                empInc.EmployeeID = obj.EmployeeID;
                empInc.EmplCode = null;
                empInc.LineNo = null;
                empInc.IncRate = Salary;
                empInc.IncNumber = null;
                empInc.AcctNo = null;
                empInc.Department = null;
                empInc.IncQtd1 = null;
                empInc.IncQtd2 = null;
                empInc.IncQtd3 = null;
                empInc.IncQtd4 = null;

                empInc.LoIncAmt = null;
                empInc.HiIncAmt = null;
                if (mode == 1)
                {
                    empInc.SaveNew();

                }
                else
                {
                    empInc.Update();
                }
            }
            catch (Exception ex)
            {
                //Login login = new Login();
                //login.Error_Log(ex.Message);

            }

            return empInc;

        }

        public BLMasterEmployeeIncomes save_MasterDirectorIncomes(BLMasterEmployee obj, decimal? Salary, int? mode)
        {
            //int EmpIncomeID = 0;
            BLMasterEmployeeIncomes empInc = new BLMasterEmployeeIncomes();
            try
            {
                empInc.EmpIncomeID = obj.EmployeeID;
                empInc.EmployeeID = obj.EmployeeID;
                empInc.EmplCode = null;
                empInc.LineNo = null;
                empInc.IncRate = Salary;
                empInc.IncNumber = null;
                empInc.AcctNo = null;
                empInc.Department = null;
                empInc.IncQtd1 = null;
                empInc.IncQtd2 = null;
                empInc.IncQtd3 = null;
                empInc.IncQtd4 = null;

                empInc.LoIncAmt = null;
                empInc.HiIncAmt = null;
                if (mode == 1)
                {
                    empInc.SaveNew();

                }
                else
                {
                    empInc.Update();
                }
            }
            catch (Exception ex)
            {
                string controller = "UnknownController";
                string action = "UnknownAction";
                var context = ExceptionMiddleware1.GetActionInfo();
                controller = context.Controller;
                action = context.Action;
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                //Login login = new Login();
                //login.Error_Log(ex.Message);

            }

            return empInc;

        }




    }
}
