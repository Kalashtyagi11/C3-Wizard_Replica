using Azure;
using C3WizardData.Models;
using C3WizardHelper.ViewModels;
using C3WizardLayer.BusinessObjects;
using C3WizardLayer.DataObjects;
using C3WizardRepository.Common;
using C3WizardRepository.Interface;
using C3WizardRepository.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Data;
using System.Globalization;
using System.Text;
using static System.Net.Mime.MediaTypeNames;

namespace C3WIZARDWebApi.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class SettingsController : ControllerBase
  {
    private readonly RepoC3 repo;
    private readonly C3wizardContext _Db;
    public SettingsController(RepoC3 repoC, C3wizardContext context)
    {
      this.repo = repoC;
      this._Db = context;
    }

    /// <summary>
    /// This method is used ADD C3Settings
    /// </summary>
    /// <param name="c3EmployeeVM"></param>
    /// <returns></returns>
    [HttpPost("C3Settings")]
    public ResponseModel C3Settings([FromBody] C3Settings settings)
    {
      int MRSId = Convert.ToInt32(settings.mrsId);
      int dedcodeid = Convert.ToInt32(settings.dedcodeid);
      int SOCEROblID = Convert.ToInt32(settings.socerOblID);
      int EIBID = Convert.ToInt32(settings.eibid);

      ResponseModel response = new ResponseModel();
      try
      {
        if (settings.FromYear != null && (settings.FromMonth != null))
        {

          bool datavalidate = true;
          string fyear = settings.FromYear != null ? settings.FromYear.ToString() : null;
          int fmonthno = DateTime.ParseExact(settings.FromMonth, "MM", CultureInfo.InvariantCulture).Month;
          string fMonthtype = settings.FromMonth;
          string fMvalue = fMonthtype;
          string fmonthval = fmonthno <= 9 ? "0" + fmonthno.ToString() : fmonthno.ToString();
          int tmonthno = DateTime.ParseExact(settings.ToMonth, "MM", CultureInfo.InvariantCulture).Month;
          string fromd = fyear + "-" + fmonthval + "-01";
          string tod = null;
          DateTime? newFrom_date = DateTime.ParseExact(("01/" + fmonthval + "/" + fyear), Helper.DateFormat, CultureInfo.InvariantCulture);
          DateTime? newTo_date = null;
          int daysfMonth = 0;
          if (settings.ToYear != null)
          {
            string tyear = settings.ToYear != null ? settings.ToYear.ToString() : null;
            string tMonthtype = settings.ToMonth;
            string tMvalue = tMonthtype;
            string tmonthval = tmonthno <= 9 ? "0" + tmonthno.ToString() : tmonthno.ToString();
            daysfMonth = DateTime.DaysInMonth(int.Parse(tyear), tmonthno);
            tod = tyear + "/" + tmonthval + "/" + daysfMonth;
            newTo_date = DateTime.ParseExact((daysfMonth + "/" + tmonthval + "/" + tyear), Helper.DateFormat, CultureInfo.InvariantCulture);
            datavalidate = newTo_date > newFrom_date ? true : false;
          }
          if (datavalidate)
          {
            if (repo.validateC3settingExists(settings.param, newFrom_date, newTo_date, MRSId))
            {

              if (settings.param == 0)
              {
                repo.General_Save_button_Click(settings.param, MRSId, fromd, tod, settings);
                repo.S_S_Employee_Save_button_Click(settings.param, dedcodeid, fromd, tod, settings);
                repo.S_S_Er_Save_button_Click(settings.param, SOCEROblID, fromd, tod, settings);
                repo.EIB_Save_button_Click(settings.param, EIBID, fromd, tod, settings);
                repo.SettodateC3setting(newFrom_date, newTo_date);

                response.Status = true;
                response.Message = "C3Settings Saved Successfully";
                response.Statuscode = 200;

              }
              else
              {
                bool result = true;
                if (!repo.isC3Finilize(newFrom_date, newTo_date))
                {
                  if (settings.message)
                  {
                    result = true;
                  }
                  else
                  {
                    result = false;
                  }
                }
                else
                {
                  if (settings.message)
                  {
                    result = true;
                  }

                  else
                  {
                    result = false;
                  }
                }

                if (result)
                {
                  repo.General_Save_button_Click(settings.param, MRSId, fromd, tod, settings);
                  repo.S_S_Employee_Save_button_Click(settings.param, dedcodeid, fromd, tod, settings);
                  repo.S_S_Er_Save_button_Click(settings.param, SOCEROblID, fromd, tod, settings);
                  repo.EIB_Save_button_Click(settings.param, EIBID, fromd, tod, settings);

                  response.Status = true;
                  response.Message = "C3Settings Updated Successfully";
                  response.Statuscode = 200;

                }
              }


            }
            else
            {
              response.Status = true;
              response.Message = "C3Settings Record already exist for these dates!";
              response.Statuscode = 200;
            }
          }
          else
          {
            response.Status = true;
            response.Message = "To date must be greater than from date";
            response.Statuscode = 200;

          }


        }
        else
        {
          response.Status = true;
          response.Message = " Please select from month and from year.";
          response.Statuscode = 200;

        }
      }
      catch (Exception ex)
      {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                throw ex;
      }


      return response;

    }




    int[] ylist = null;
    /// <summary>
    /// This method is used ADD C3Settings
    /// </summary>
    /// <param name="c3EmployeeVM"></param>
    /// <returns></returns>
    /// 
    private int AddyearToindex(int selectedyear)
    {
      int ycount = ylist.ToList().Count;
      int yindex = ycount;
      Array.Resize(ref ylist, ycount + 1);
      ylist[ycount] = selectedyear;
      //CmbToYear.ItemsSource = ylist;
      return yindex; ;
    }
    [HttpGet("C3Settingedit")]
    public ResponseModel C3Settingedit(int Gsettingid)
    {
      int[] ylist = null;
      ylist = Helper.yearlist();
      ResponseModel response = new ResponseModel();
      C3SettingsEdit c3Settings = new C3SettingsEdit();
      try
      {

        int MRSId = (int)Gsettingid;
        c3Settings.mrsId = MRSId;
        SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
        if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
        //SqlCommand cmd = new SqlCommand("Get_Master_Diduction_Rates", staticConnection);
        SqlCommand cmd = new SqlCommand("Get_Master_Diduction_Ratesedit", staticConnection);
        cmd.CommandType = CommandType.StoredProcedure;
        SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
        DataSet ds = new DataSet();
        sqlAdapter.Fill(ds);
        DataTable dtMRS = new DataTable();
        dtMRS = ds.Tables[2];
        DateTime? from_date = null;
        DateTime? To_date = null;

        staticConnection.Close();
        if (dtMRS.Rows.Count > 0)
        {
          foreach (DataRow row in dtMRS.Rows)
          {

            int G_C3Settingid = Convert.IsDBNull(row["MRSId"]) ? 0 : int.Parse(row["MRSId"].ToString());

            if (G_C3Settingid == Gsettingid)
            {
              from_date = Convert.IsDBNull(row["FromDate"]) ? null : (DateTime?)DateTime.Parse(row["FromDate"].ToString());
              To_date = Convert.IsDBNull(row["ToDate"]) ? null : (DateTime.Parse(row["ToDate"].ToString())).ToString(Helper.DisplayDateFormat) == "01-01-1900" ? null : (DateTime?)DateTime.Parse(row["ToDate"].ToString());
              c3Settings.FromMonth = from_date.Value.Month.ToString("D2");

              c3Settings.FromYear = from_date.Value.Year;

              c3Settings.ToMonth = To_date.HasValue ? To_date.Value.Month.ToString("D2") : null;
              c3Settings.ToYear = To_date.HasValue ? To_date.Value.Year : (int?)null;

              c3Settings.EmployeeLevyCountrybutionbonus = Convert.IsDBNull(row["Bonus_Levy_EE_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Bonus_Levy_EE_Rate"].ToString()) * 100)).ToString();
              c3Settings.SeveranceCountributionRate = Convert.IsDBNull(row["SeveranceRate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["SeveranceRate"].ToString()) * 100)).ToString();
              c3Settings.MineFineRate = Convert.IsDBNull(row["Fine_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Fine_Rate"].ToString()) * 100)).ToString();
              c3Settings.AdditionalFineRate = Convert.IsDBNull(row["Additional_Fine_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Additional_Fine_Rate"].ToString()) * 100)).ToString();
              c3Settings.MinPenaltyRate = Convert.IsDBNull(row["Penalty_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Penalty_Rate"].ToString()) * 100)).ToString();
              c3Settings.AdditionalPenaltyRate = Convert.IsDBNull(row["Additional_Penalty_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Additional_Penalty_Rate"].ToString()) * 100)).ToString();
              c3Settings.MinAge = Convert.IsDBNull(row["Min_Age"]) ? "0.00" : int.Parse(row["Min_Age"].ToString()).ToString();
              c3Settings.MaxAge = Convert.IsDBNull(row["Max_Age"]) ? "0.00" : int.Parse(row["Max_Age"].ToString()).ToString();
              c3Settings.EmployerLevyrate = Convert.IsDBNull(row["EmployerLevy"]) ? "0.00" : int.Parse(row["EmployerLevy"].ToString()).ToString();
              //islocked = Convert.IsDBNull(row["IsLocked"]) ? false : bool.Parse(row["IsLocked"].ToString());
            }
          }
        }
        DataTable dtMOC = new DataTable();
        dtMOC = ds.Tables[0];
        if (dtMOC.Rows.Count > 0)
        {
          foreach (DataRow row in dtMOC.Rows)
          {
            DateTime? MOCf_date = Convert.IsDBNull(row["FromDate"]) ? null : (DateTime?)DateTime.Parse(row["FromDate"].ToString());
            DateTime? MOCT_date = Convert.IsDBNull(row["ToDate"]) ? null : (DateTime?)DateTime.Parse(row["ToDate"].ToString());
            if (from_date.Value.Date == MOCf_date.Value.Date)
            {
              string Obl_code = Convert.IsDBNull(row["Obl_code"]) ? null : row["Obl_code"].ToString();
              if (Obl_code == "SOC_ER")
              {

                int SOCEROblID = Convert.IsDBNull(row["Obl_Code_ID"]) ? 0 : int.Parse(row["Obl_Code_ID"].ToString());
                c3Settings.EmployerSSCountributionrate = Convert.IsDBNull(row["dflt_rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_rate"].ToString()) * 100)).ToString();
                c3Settings.MaxAmountforemployersocialsecurity = Convert.IsDBNull(row["dflt_pay_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_pay_limit"].ToString()))).ToString();
                c3Settings.MaxAmountPayableforemployersocialsecurity = Convert.IsDBNull(row["dflt_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_limit"].ToString()))).ToString();
                c3Settings.socerOblID = SOCEROblID;

              }
              if (Obl_code == "EIB")
              {
                int EIBID = Convert.IsDBNull(row["Obl_Code_ID"]) ? 0 : int.Parse(row["Obl_Code_ID"].ToString());
                c3Settings.EIBContributionRate = Convert.IsDBNull(row["dflt_rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_rate"].ToString()) * 100)).ToString();
                c3Settings.MaxAmountForEIB = Convert.IsDBNull(row["dflt_pay_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_pay_limit"].ToString()))).ToString();
                c3Settings.MaxAmountPayableForEIB = Convert.IsDBNull(row["dflt_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_limit"].ToString()))).ToString();
                c3Settings.eibid = EIBID;

              }
            }
          }
        }
        DataTable dtMDC = new DataTable();
        dtMDC = ds.Tables[1];
        if (dtMDC.Rows.Count > 0)
        {
          foreach (DataRow row in dtMDC.Rows)
          {
            DateTime? MDCf_date = Convert.IsDBNull(row["FromDate"]) ? null : (DateTime?)DateTime.Parse(row["FromDate"].ToString());
            DateTime? MDCT_date = Convert.IsDBNull(row["ToDate"]) ? null : (DateTime?)DateTime.Parse(row["ToDate"].ToString());
            if (from_date == MDCf_date)
            {
              string dedcode = Convert.IsDBNull(row["ded_code"]) ? null : row["ded_code"].ToString();
              if (dedcode == "SOC_EE")
              {
                int dedcodeid = Convert.IsDBNull(row["ded_code_id"]) ? 0 : int.Parse(row["ded_code_id"].ToString());
                c3Settings.EmployeeSocialSecurityContributionRate = Convert.IsDBNull(row["dflt_rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_rate"].ToString()) * 100)).ToString();
                c3Settings.MaxAmountForEmployeeSocialSecurity = Convert.IsDBNull(row["dflt_pay_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_pay_limit"].ToString()))).ToString();
                c3Settings.MaxAmountPayableForEmployeeSocialSecurity = Convert.IsDBNull(row["dflt_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_limit"].ToString()))).ToString();
                c3Settings.dedcodeid = dedcodeid;
              }
            }

          }
        }
      }
      catch (Exception ex)
      {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                throw ex;

      }
      response.Message = "data retrived Successfully!";
      response.Status = true;
      response.Statuscode = 200;
      response.Data = c3Settings;

      return response;

    }
    //private int AddyearToindex(int selectedyear)
    //{
    //    int ycount = ylist.ToList().Count;
    //    int yindex = ycount;
    //    Array.Resize(ref ylist, ycount + 1);
    //    ylist[ycount] = selectedyear;
    //    //CmbToYear.ItemsSource = ylist;
    //    return yindex; ;
    //}
    DateTime? Impfrom_date = null;
    DateTime? ImpTo_date = null;
    /// <summary>
    /// This method is used ADD C3Settings
    /// </summary>
    /// <param name="c3EmployeeVM"></param>
    /// <returns></returns>
    [HttpGet("GetMasterDefaultSettingRatesRates")]
    public ResponseModel GetMasterDefaultSettingRatesRates()
    {
      ResponseModel response = new ResponseModel();
      C3SettingsEdit c3Settings = new C3SettingsEdit();
      SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
      if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
      SqlCommand cmd = new SqlCommand("Get_Master_Diduction_Rates", staticConnection);
      cmd.CommandType = CommandType.StoredProcedure;
      SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
      DataSet ds = new DataSet();
      sqlAdapter.Fill(ds);
      DataTable dtMRS = new DataTable();
      dtMRS = ds.Tables[2];
      staticConnection.Close();
      if (dtMRS.Rows.Count > 0)
      {
        foreach (DataRow row in dtMRS.Rows)
        {

          string islocked = Convert.IsDBNull(row["IsLocked"]) ? "False" : row["IsLocked"].ToString();

          if (islocked == "True")
          {
            Impfrom_date = Convert.IsDBNull(row["FromDate"]) ? null : (DateTime?)DateTime.Parse(row["FromDate"].ToString());
            ImpTo_date = Convert.IsDBNull(row["ToDate"]) ? null : (DateTime.Parse(row["ToDate"].ToString())).ToString(Helper.DisplayDateFormat) == "01-01-1900" ? null : (DateTime?)DateTime.Parse(row["ToDate"].ToString());

            c3Settings.EmployeeLevyCountrybutionbonus = Convert.IsDBNull(row["Bonus_Levy_EE_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Bonus_Levy_EE_Rate"].ToString()) * 100)).ToString();
            c3Settings.SeveranceCountributionRate = Convert.IsDBNull(row["SeveranceRate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["SeveranceRate"].ToString()) * 100)).ToString();
            c3Settings.MineFineRate = Convert.IsDBNull(row["Fine_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Fine_Rate"].ToString()) * 100)).ToString();
            c3Settings.AdditionalFineRate = Convert.IsDBNull(row["Additional_Fine_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Additional_Fine_Rate"].ToString()) * 100)).ToString();
            c3Settings.MinPenaltyRate = Convert.IsDBNull(row["Penalty_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Penalty_Rate"].ToString()) * 100)).ToString();
            c3Settings.AdditionalPenaltyRate = Convert.IsDBNull(row["Additional_Penalty_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Additional_Penalty_Rate"].ToString()) * 100)).ToString();
            c3Settings.MinAge = Convert.IsDBNull(row["Min_Age"]) ? "0.00" : int.Parse(row["Min_Age"].ToString()).ToString();
            c3Settings.MaxAge = Convert.IsDBNull(row["Max_Age"]) ? "0.00" : int.Parse(row["Max_Age"].ToString()).ToString();
            c3Settings.EmployerLevyrate = Convert.IsDBNull(row["EmployerLevy"]) ? "0.00" : int.Parse(row["EmployerLevy"].ToString()).ToString();

          }
        }
      }
      DataTable dtMOC = new DataTable();
      dtMOC = ds.Tables[0];
      if (dtMOC.Rows.Count > 0)
      {
        foreach (DataRow row in dtMOC.Rows)
        {
          DateTime? MOCf_date = Convert.IsDBNull(row["FromDate"]) ? null : (DateTime?)DateTime.Parse(row["FromDate"].ToString());
          DateTime? MOCT_date = Convert.IsDBNull(row["ToDate"]) ? null : (DateTime?)DateTime.Parse(row["ToDate"].ToString());
          if (Impfrom_date.Value.Date == MOCf_date.Value.Date)
          {
            string Obl_code = Convert.IsDBNull(row["Obl_code"]) ? null : row["Obl_code"].ToString();
            if (Obl_code == "SOC_ER")
            {
              int? SOCEROblID = Convert.IsDBNull(row["Obl_Code_ID"]) ? 0 : int.Parse(row["Obl_Code_ID"].ToString());
              c3Settings.EmployerSSCountributionrate = Convert.IsDBNull(row["dflt_rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_rate"].ToString()) * 100)).ToString();
              c3Settings.MaxAmountforemployersocialsecurity = Convert.IsDBNull(row["dflt_pay_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_pay_limit"].ToString()))).ToString();
              c3Settings.MaxAmountPayableforemployersocialsecurity = Convert.IsDBNull(row["dflt_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_limit"].ToString()))).ToString();

            }
            if (Obl_code == "EIB")
            {
              int EIBID = Convert.IsDBNull(row["Obl_Code_ID"]) ? 0 : int.Parse(row["Obl_Code_ID"].ToString());
              c3Settings.EIBContributionRate = Convert.IsDBNull(row["dflt_rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_rate"].ToString()) * 100)).ToString();
              c3Settings.MaxAmountForEIB = Convert.IsDBNull(row["dflt_pay_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_pay_limit"].ToString()))).ToString();
              c3Settings.MaxAmountPayableForEIB = Convert.IsDBNull(row["dflt_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_limit"].ToString()))).ToString();

            }
          }
        }
      }
      DataTable dtMDC = new DataTable();
      dtMDC = ds.Tables[1];
      if (dtMDC.Rows.Count > 0)
      {
        foreach (DataRow row in dtMDC.Rows)
        {
          DateTime? MDCf_date = Convert.IsDBNull(row["FromDate"]) ? null : (DateTime?)DateTime.Parse(row["FromDate"].ToString());
          DateTime? MDCT_date = Convert.IsDBNull(row["ToDate"]) ? null : (DateTime?)DateTime.Parse(row["ToDate"].ToString());
          if (Impfrom_date == MDCf_date)
          {
            string dedcode = Convert.IsDBNull(row["ded_code"]) ? null : row["ded_code"].ToString();
            if (dedcode == "SOC_EE")
            {
              c3Settings.EmployeeSocialSecurityContributionRate = Convert.IsDBNull(row["dflt_rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_rate"].ToString()) * 100)).ToString();
              c3Settings.MaxAmountForEmployeeSocialSecurity = Convert.IsDBNull(row["dflt_pay_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_pay_limit"].ToString()))).ToString();
              c3Settings.MaxAmountPayableForEmployeeSocialSecurity = Convert.IsDBNull(row["dflt_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_limit"].ToString()))).ToString();
            }
          }

        }
      }
      response.Message = "data retrived Successfully!";
      response.Status = true;
      response.Statuscode = 200;
      response.Data = c3Settings;

      return response;

    }

    // int[] ylist = null;
    /// <summary>
    /// This method is used C3SettingDeleteNew
    /// </summary>
    /// <param name="c3EmployeeVM"></param>
    /// <returns></returns>
    [HttpPost("C3SettingDeleteNew")]
    public ResponseModel C3SettingDeleteNew(int Gsettingid, string? st_Date, string? en_Date, bool message, int HelperRoleId)
    {
      DateTime start_Date = Convert.ToDateTime(st_Date);
      DateTime end_Date = Convert.ToDateTime(en_Date);
      ResponseModel response = new ResponseModel();
      try
      {
        int HpPayID = Gsettingid;
        bool result = true;
        if (!repo.isC3Finilize(start_Date, end_Date))
        {
          //if (C3WizardMessageBox.Show("C3 Wizard", "C3 settings already used. \n Do you want to delete this C3 settings details?", MessageBoxButton.YesNo, MessageBoxImage.Warning) == MessageBoxResult.No == false)
          if (message)
          {
            result = true;
          }
          else
          {
            result = false;
          }
        }
        else
        {
          //if (C3WizardMessageBox.Show("C3 Wizard", "Do you want to delete this C3 settings details?", MessageBoxButton.YesNo, MessageBoxImage.Warning) == MessageBoxResult.No == false)
          if (message)
          {
            result = true;
          }
          else
          {
            result = false;
          }
        }

        if (result)
        {
          if (HelperRoleId == 1)
          {
            DateTime? item_st_Date = start_Date == null ? (DateTime?)null : start_Date;

            DateTime? item_en_Date = end_Date == null ? (DateTime?)null : end_Date;
            SqlCommand cmd = null;
            SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
            if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();

            cmd = new SqlCommand("DeleteC3SettingDetails", staticConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(new SqlParameter("@MRSId", SqlDbType.Int, 12, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)HpPayID ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@From_date", SqlDbType.DateTime, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)item_st_Date ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@To_date", SqlDbType.DateTime, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)item_en_Date ?? (object)DBNull.Value));
            SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);

            DataTable dt = new DataTable();
            sqlAdapter.Fill(dt);
            staticConnection.Close();

            response.Data = null;
            response.Status = true;
            response.Statuscode = 200;
            response.Message = "Data Deleted Successfully!";

          }
        }
      }
      catch (Exception ex)
      {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                throw ex;

      }

      return response;

    }

    /// <summary>
    /// This method is used GetAllC3Settings
    /// </summary>
    /// <param name="c3EmployeeVM"></param>
    /// <returns></returns>
    [HttpGet("GetAllC3Settings")]
    public ResponseModel GetAllC3Settings(string? fromPeriod, string? toPeriod, int RoleId)
    {
      ResponseModel response = new ResponseModel();
      List<C3Setting_Details> c3settinglist = new List<C3Setting_Details>();
      List<C3Setting_Details> Gc3settinglist = new List<C3Setting_Details>();
      List<C3Setting_Details> SSEEc3settinglist = new List<C3Setting_Details>();
      List<C3Setting_Details> SSERc3settinglist = new List<C3Setting_Details>();
      List<C3Setting_Details> EIBc3settinglist = new List<C3Setting_Details>();

      SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
      if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
      SqlCommand cmd = new SqlCommand("GetAllC3Settings_testing", staticConnection);
      cmd.CommandType = CommandType.StoredProcedure;
      //cmd.Parameters.AddWithValue("@Year", year);
      cmd.Parameters.AddWithValue("@FromPeriod", fromPeriod);
      cmd.Parameters.AddWithValue("@ToPeriod", toPeriod);
      SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
      DataSet ds = new DataSet();
      sqlAdapter.Fill(ds);

      DataTable dtMRS = new DataTable();
      dtMRS = ds.Tables[2];
      staticConnection.Close();
      if (dtMRS.Rows.Count > 0)
      {
        foreach (DataRow row in dtMRS.Rows)
        {
          C3Setting_Details CSD = new C3Setting_Details();
          CSD.GSettingId = Convert.IsDBNull(row["MRSId"]) ? 0 : int.Parse(row["MRSId"].ToString());
          CSD.st_Date = Convert.IsDBNull(row["FromDate"]) ? null : DateTime.Parse(row["FromDate"].ToString()).ToString(Helper.DisplayDateFormat);
          CSD.en_Date = Convert.IsDBNull(row["ToDate"]) ? null : DateTime.Parse(row["ToDate"].ToString()).ToString(Helper.DisplayDateFormat) == "01-01-1900" ? null : DateTime.Parse(row["ToDate"].ToString()).ToString(Helper.DisplayDateFormat);
          CSD.Gstart_Date = Convert.IsDBNull(row["FromDate"]) ? null : (DateTime?)DateTime.Parse(row["FromDate"].ToString());
          CSD.Gend_Date = Convert.IsDBNull(row["ToDate"]) ? null : DateTime.Parse(row["ToDate"].ToString()).ToString(Helper.DisplayDateFormat) == "01-01-1900" ? null : (DateTime?)DateTime.Parse(row["ToDate"].ToString());
          CSD.yearName = CSD.st_Date != null ? (CSD.st_Date).Substring(6, 4) : null;
          CSD.Bonus_Levy_EE_Rate = Convert.IsDBNull(row["Bonus_Levy_EE_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Bonus_Levy_EE_Rate"].ToString()) * 100)).ToString();
          CSD.SeveranceRate = Convert.IsDBNull(row["SeveranceRate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["SeveranceRate"].ToString()) * 100)).ToString();
          CSD.Fine_Rate = Convert.IsDBNull(row["Fine_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Fine_Rate"].ToString()) * 100)).ToString();
          CSD.Additional_Fine_Rate = Convert.IsDBNull(row["Additional_Fine_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Additional_Fine_Rate"].ToString()) * 100)).ToString();
          CSD.Penalty_Rate = Convert.IsDBNull(row["Penalty_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Penalty_Rate"].ToString()) * 100)).ToString();
          CSD.Additional_Penalty_Rate = Convert.IsDBNull(row["Additional_Penalty_Rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["Additional_Penalty_Rate"].ToString()) * 100)).ToString();
          CSD.min_age = Convert.IsDBNull(row["Min_Age"]) ? "0.00" : int.Parse(row["Min_Age"].ToString()).ToString();
          CSD.max_age = Convert.IsDBNull(row["Max_Age"]) ? "0.00" : int.Parse(row["Max_Age"].ToString()).ToString();
          CSD.islocked = Convert.IsDBNull(row["IsLocked"]) ? "False" : bool.Parse(row["IsLocked"].ToString()).ToString();
          CSD.Candelete = RoleId == 1 ? true : false;
          CSD.Canedit = CSD.islocked == "True" ? false : true;
          CSD.EmployerLevy = Convert.IsDBNull(row["EmployerLevy"]) ? "0.00" : int.Parse(row["EmployerLevy"].ToString()).ToString();

          Gc3settinglist.Add(CSD);
        }
      }
      DataTable dtMOC = new DataTable();
      dtMOC = ds.Tables[0];
      if (dtMOC.Rows.Count > 0)
      {
        foreach (DataRow row in dtMOC.Rows)
        {
          C3Setting_Details ERCSD = new C3Setting_Details();
          C3Setting_Details EIBCSD = new C3Setting_Details();

          string Obl_code = Convert.IsDBNull(row["Obl_code"]) ? null : row["Obl_code"].ToString();
          if (Obl_code == "SOC_ER")
          {
            ERCSD.erstart_Date = Convert.IsDBNull(row["FromDate"]) ? null : (DateTime?)DateTime.Parse(row["FromDate"].ToString());
            ERCSD.erend_Date = Convert.IsDBNull(row["ToDate"]) ? null : DateTime.Parse(row["ToDate"].ToString()).ToString(Helper.DisplayDateFormat) == "01-01-1900" ? null : (DateTime?)DateTime.Parse(row["ToDate"].ToString());
            ERCSD.ER_dflt_rate = Convert.IsDBNull(row["dflt_rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_rate"].ToString()) * 100)).ToString();
            ERCSD.Er_dflt_pay_limit = Convert.IsDBNull(row["dflt_pay_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_pay_limit"].ToString()))).ToString();
            ERCSD.Er_dflt_limit = Convert.IsDBNull(row["dflt_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_limit"].ToString()))).ToString();
            ERCSD.islocked = Convert.IsDBNull(row["IsLocked"]) ? "False" : bool.Parse(row["IsLocked"].ToString()).ToString();
            SSERc3settinglist.Add(ERCSD);
          }
          if (Obl_code == "EIB")
          {
            ERCSD.eibstart_Date = Convert.IsDBNull(row["FromDate"]) ? null : (DateTime?)DateTime.Parse(row["FromDate"].ToString());
            ERCSD.eibend_Date = Convert.IsDBNull(row["ToDate"]) ? null : DateTime.Parse(row["ToDate"].ToString()).ToString(Helper.DisplayDateFormat) == "01-01-1900" ? null : (DateTime?)DateTime.Parse(row["ToDate"].ToString());
            EIBCSD.EIBdflt_rate = Convert.IsDBNull(row["dflt_rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_rate"].ToString()) * 100)).ToString();
            EIBCSD.EIBdflt_pay_limit = Convert.IsDBNull(row["dflt_pay_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_pay_limit"].ToString()))).ToString();
            EIBCSD.EIBdflt_limit = Convert.IsDBNull(row["dflt_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_limit"].ToString()))).ToString();
            EIBCSD.islocked = Convert.IsDBNull(row["IsLocked"]) ? "False" : bool.Parse(row["IsLocked"].ToString()).ToString();
            EIBc3settinglist.Add(EIBCSD);
          }

        }
      }
      DataTable dtMDC = new DataTable();
      dtMDC = ds.Tables[1];
      if (dtMDC.Rows.Count > 0)
      {
        foreach (DataRow row in dtMDC.Rows)


        {
          C3Setting_Details EECSD = new C3Setting_Details();

          string dedcode = Convert.IsDBNull(row["ded_code"]) ? null : row["ded_code"].ToString();
          if (dedcode == "SOC_EE")
          {
            EECSD.eestart_Date = Convert.IsDBNull(row["FromDate"]) ? null : (DateTime?)DateTime.Parse(row["FromDate"].ToString());
            EECSD.eeend_Date = Convert.IsDBNull(row["ToDate"]) ? null : DateTime.Parse(row["ToDate"].ToString()).ToString(Helper.DisplayDateFormat) == "01-01-1900" ? null : (DateTime?)DateTime.Parse(row["ToDate"].ToString());
            EECSD.EE_dflt_rate = Convert.IsDBNull(row["dflt_rate"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_rate"].ToString()) * 100)).ToString();
            EECSD.EE_dflt_pay_limit = Convert.IsDBNull(row["dflt_pay_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_pay_limit"].ToString()))).ToString();
            EECSD.EE_dflt_limit = Convert.IsDBNull(row["dflt_limit"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(row["dflt_limit"].ToString()))).ToString();
            EECSD.islocked = Convert.IsDBNull(row["IsLocked"]) ? "False" : bool.Parse(row["IsLocked"].ToString()).ToString();
            SSEEc3settinglist.Add(EECSD);
          }


        }
      }
      Gc3settinglist = Gc3settinglist.OrderBy(x => x.Gstart_Date).ToList();
      SSEEc3settinglist = SSEEc3settinglist.OrderBy(x => x.eestart_Date).ToList();
      SSERc3settinglist = SSERc3settinglist.OrderBy(x => x.erstart_Date).ToList();
      EIBc3settinglist = EIBc3settinglist.OrderBy(x => x.eibstart_Date).ToList();
      List<C3Setting_Details> Totalsettinglist = new List<C3Setting_Details>();
      for (int i = 0; i < Gc3settinglist.Count; i++)
      {
        C3Setting_Details settinglist = new C3Setting_Details();
        if (i < Gc3settinglist.Count)
        {
          settinglist.GSettingId = Gc3settinglist[i].GSettingId;
          settinglist.st_Date = Gc3settinglist[i].st_Date;
          settinglist.en_Date = Gc3settinglist[i].en_Date;
          settinglist.yearName = Gc3settinglist[i].yearName;
          settinglist.Bonus_Levy_EE_Rate = Gc3settinglist[i].Bonus_Levy_EE_Rate;
          settinglist.SeveranceRate = Gc3settinglist[i].SeveranceRate;
          settinglist.Fine_Rate = Gc3settinglist[i].Fine_Rate;
          settinglist.Additional_Fine_Rate = Gc3settinglist[i].Additional_Fine_Rate;
          settinglist.Penalty_Rate = Gc3settinglist[i].Penalty_Rate;
          settinglist.Additional_Penalty_Rate = Gc3settinglist[i].Additional_Penalty_Rate;
          settinglist.min_age = Gc3settinglist[i].min_age;
          settinglist.max_age = Gc3settinglist[i].max_age;
          settinglist.EmployerLevy = Gc3settinglist[i].EmployerLevy;
          settinglist.Candelete = RoleId == 1 ? true : false;
          settinglist.Canedit = Gc3settinglist[i].Canedit;
          settinglist.Candelete = !settinglist.Canedit && settinglist.Candelete ? settinglist.Canedit : settinglist.Candelete;
          settinglist.GSetting = "Severance : " + settinglist.SeveranceRate + "\nMin Age : " + settinglist.min_age + "\nMax Age : " + settinglist.max_age + "\nFine : " + settinglist.Fine_Rate + "\nAdditional Fine : " + settinglist.Additional_Fine_Rate + "\nPenalty : " + settinglist.Penalty_Rate + "\nAdditional Penalty : " + settinglist.Additional_Penalty_Rate + "\nEmployer Levy : " + settinglist.EmployerLevy;
        }
        if (i < SSEEc3settinglist.Count)
        {
          settinglist.EE_dflt_rate = SSEEc3settinglist[i].EE_dflt_rate;
          settinglist.EE_dflt_pay_limit = SSEEc3settinglist[i].EE_dflt_pay_limit;
          settinglist.EE_dflt_limit = SSEEc3settinglist[i].EE_dflt_limit;
          settinglist.SOCEE = "Contribution rate : " + settinglist.EE_dflt_rate + "\nMax Amount : " + settinglist.EE_dflt_limit + "\nMax Amount Payable  : " + settinglist.EE_dflt_pay_limit;
        }
        if (i < SSERc3settinglist.Count)
        {
          settinglist.ER_dflt_rate = SSERc3settinglist[i].ER_dflt_rate;
          settinglist.Er_dflt_pay_limit = SSERc3settinglist[i].Er_dflt_pay_limit;
          settinglist.Er_dflt_limit = SSERc3settinglist[i].Er_dflt_limit;
          settinglist.SOCER = "Contribution rate : " + settinglist.ER_dflt_rate + "\nMax Amount : " + settinglist.Er_dflt_limit + "\nMax Amount Payable : " + settinglist.Er_dflt_pay_limit;
        }
        if (i < EIBc3settinglist.Count)
        {
          settinglist.EIBdflt_rate = EIBc3settinglist[i].EIBdflt_rate;
          settinglist.EIBdflt_pay_limit = EIBc3settinglist[i].EIBdflt_pay_limit;
          settinglist.EIBdflt_limit = EIBc3settinglist[i].EIBdflt_limit;
          settinglist.EIB = "Contribution rate : " + settinglist.EIBdflt_rate + "\nMax Amount : " + settinglist.EIBdflt_limit + "\nMax Amount Payable : " + settinglist.EIBdflt_pay_limit;
        }
        Totalsettinglist.Add(settinglist);
      }
      if (Totalsettinglist.Count > 0)
      {
        response.Data = Totalsettinglist;
        response.Status = true;
        response.Statuscode = 200;
        response.Message = "Data Retrived successfully!";

      }
      else
      {
        response.Data = Totalsettinglist;
        response.Status = true;
        response.Statuscode = 200;
        response.Message = "Data Not Found!";

      }


      return response;



    }


    [HttpGet("Get_EXEMPTED_CONTRIBUTION_Settings")]
    public async Task<ResponseModel> Get_EXEMPTED_CONTRIBUTION_Settings(int RoleId, int year)
    {
      ResponseModel response = new ResponseModel();
      List<DecBonusSetting_Details> DBsettinglist = new List<DecBonusSetting_Details>();

      try
      {

        SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
        if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
        SqlCommand cmd = new SqlCommand("Get_EXEMPTED_CONTRIBUTION_Settings", staticConnection);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("@Year", year);
        SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
        DataSet ds = new DataSet();
        sqlAdapter.Fill(ds);

        DataTable dtMRS = new DataTable();
        dtMRS = ds.Tables[0];
        staticConnection.Close();
        if (dtMRS.Rows.Count > 0)
        {
          foreach (DataRow row in dtMRS.Rows)
          {
            DecBonusSetting_Details CSD = new DecBonusSetting_Details();
            CSD.DBSid = Convert.IsDBNull(row["DBSId"]) ? 0 : int.Parse(row["DBSId"].ToString());
            CSD.yearName = Convert.IsDBNull(row["Year"]) ? null : row["Year"].ToString();
            CSD.Employee_Levy = Convert.IsDBNull(row["IsexemptedLevy"]) || row["IsexemptedLevy"].ToString() == "False" ? "0" : "1";

            CSD.Employer_Levy = Convert.IsDBNull(row["IsexemptedEmployerLevy"]) || row["IsexemptedEmployerLevy"].ToString() == "False" ? "0" : "1";
            CSD.Severance = Convert.IsDBNull(row["IsexemptedSeverance"]) || row["IsexemptedSeverance"].ToString() == "False" ? "0" : "1";
            CSD.Social_Security = Convert.IsDBNull(row["Isexemptedsocialsecurity"]) || row["Isexemptedsocialsecurity"].ToString() == "False" ? "0" : "1";

            CSD.islocked = Convert.IsDBNull(row["IsLocked"]) ? "False" : bool.Parse(row["IsLocked"].ToString()).ToString();
            //CSD.Candelete = Helper.RoleId == 1 ? true : false;
            CSD.Candelete = RoleId == 1 ? true : false;
            CSD.Canedit = CSD.islocked == "True" ? false : true;
            CSD.Candelete = CSD.islocked == "True" ? false : CSD.Candelete;
            DBsettinglist.Add(CSD);
          }
        }
      }
      catch (Exception ex)
      {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                throw ex;
      }

      if (DBsettinglist.Count > 0)
      {
        response.Statuscode = 200;
        response.Status = true;
        response.Message = "Data Retrieved successfully!";
        response.Data = DBsettinglist;
      }
      else
      {
        response.Statuscode = 400;
        response.Status = false;
        response.Message = "Data not found!";
        response.Data = null;
      }

      return response;



    }


    [HttpPost("setHeadersDeductionsTaxTable")]

    public async Task<IActionResult> setHeadersDeductionsTaxTable(deductionHeaderVm obj)
    {
      try
      {
        if (!DateTime.TryParse(obj.fromDate, out DateTime newStartDate) ||
        !DateTime.TryParse(obj.toDate, out DateTime newEndDate))
        {
          return BadRequest("Invalid date format. Use yyyy-MM-dd.");
        }

        if (newStartDate > newEndDate)
        {
          return BadRequest("StartDate must be before EndDate.");
        }


        if (obj.mode == 0)
        {
          bool isOverlapping = _Db.DeductionsTaxTableHeaders.Any(h =>
              (newStartDate >= h.startDate && newStartDate <= h.endDate) ||
              (newEndDate >= h.startDate && newEndDate <= h.endDate) ||
              (newStartDate <= h.startDate && newEndDate >= h.endDate) ||
              (newStartDate == h.startDate || newEndDate == h.endDate));

          if (!isOverlapping)
          {
            _Db.DeductionsTaxTableHeaders.Add(new DeductionsTaxTableHeader
            {
              TaxYear = newStartDate.Year == newEndDate.Year ? newEndDate.Year.ToString() : newStartDate.Year + "-" + newEndDate.Year,
              DedCode = obj.leavyName,
              startDate = newStartDate,
              endDate = newEndDate
            });
           
          }
          else
          {

            //throw new Exception("Start/End date overlaps with existing record.");
            return BadRequest(new { status = true, msg = "Start/End date overlaps with existing record." });
          }
        }
        else
        {
          var header = _Db.DeductionsTaxTableHeaders.FirstOrDefault(e => e.TaxTabHid == obj.id);
          header.startDate = newStartDate;
          header.endDate = newEndDate;
          header.DedCode =obj.leavyName;
          header.TaxYear = newStartDate.Year == newEndDate.Year ? newEndDate.Year.ToString() : newStartDate.Year + "-" + newEndDate.Year;
        }
        _Db.SaveChanges();
        return Ok(new { status = true, msg = "Success" });
      }
      catch (Exception ex)
      {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                throw;
      }

    }

    [HttpGet("editHeadersDeductionsTaxTable")]
    public async Task<IActionResult> editHeadersDeductionsTaxTable(int id)
    {
      try
      {

        var header = _Db.DeductionsTaxTableHeaders.FirstOrDefault(e => e.TaxTabHid == id);
        
        if (header != null)
        {
          return Ok(new { status = true, msg = "Success", data = new {id=header.TaxTabHid, leavyName= header.DedCode, fromDate= header.startDate, toDate= header.endDate } });

        }
        else
        {

          //throw new Exception("Start/End date overlaps with existing record.");
          return BadRequest(new { status = true, msg = "Start/End date overlaps with existing record." });
        }


      }
      catch (Exception ex)
      {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                throw;
      }

    }

    [HttpGet("Get_Deductions_Tax_Table_Details_Settings")]
    public async Task<IActionResult> GetDeductionsTaxTableDetailsSettings(string year)
    {

      List<DeductionsTaxTableDetail> dbSettingList = new List<DeductionsTaxTableDetail>();
      try
      {
        //var query = _Db.DeductionsTaxTableDetails.AsQueryable();


        var query = (from detail in _Db.DeductionsTaxTableDetails
                     join header in _Db.DeductionsTaxTableHeaders
                         on detail.TaxHeaderID equals header.TaxTabHid
                     where header.startDate != null && header.endDate != null && header.TaxTabHid == Convert.ToInt32(year)
                     select new
                     {
                       detail.TaxTabId,
                       TaxYear = header.startDate.Value.ToString("dd-MMM-yyyy") + " - " + header.endDate.Value.ToString("dd-MMM-yyyy"),
                       detail.DedCode,
                       detail.PayPeriod,
                       detail.MaritalStat,
                       detail.OverAmt,
                       detail.BaseAmt,
                       detail.TaxRate,
                       detail.OrderNo,
                       detail.TaxHeaderID,
                       header.TaxTabHid,
                       header.startDate,
                       header.endDate
                     }).AsQueryable();




        //.Select(x => $"{x.startDate:dd-MMM-yyyy} - {x.endDate:dd-MMM-yyyy}")
        //.Distinct();

        //if (!string.IsNullOrWhiteSpace(year))
        //{
        //  if (year == "2025")
        //  {
        //    year = new DateTime(2025, 1, 1).ToString("dd-MMM-yyyy") + " - " + new DateTime(2025, 12, 31).ToString("dd-MMM-yyyy");
        //  }
        //  var dates = year.Split(" - ");
        //  DateTime.TryParseExact(dates[0], "dd-MMM-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime startDate);
        //  DateTime.TryParseExact(dates[1], "dd-MMM-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime endDate);

        //  if (dates.Length == 2)
        //  {
        //    query = query.Where(p =>
        //        p.startDate.HasValue && p.endDate.HasValue &&
        //        p.startDate.Value >= startDate && p.endDate.Value <= endDate);
        //  }
        //}


        //dbSettingList = await query.ToListAsync();
        //foreach (var item in dbSettingList)
        //{
        //  string formattedStartDate = item.startDate?.ToString("dd-MMM-yyyy") ?? "";
        //  string formattedEndDate = item.endDate?.ToString("dd-MMM-yyyy") ?? "";

        //  item.TaxYear = $"{formattedStartDate} - {formattedEndDate}";
        //}

        if (query.Any())
        {
          return Ok(new ResponseModel
          {
            Statuscode = 200,
            Status = true,
            Message = "Data retrieved successfully!",
            Data = query.ToList()
          });
        }
        else
        {
          return NotFound(new ResponseModel
          {
            Statuscode = 404,
            Status = false,
            Message = "Data not found!",
            Data = null
          });
        }
      }
      catch (Exception ex)
      {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new ResponseModel
        {
          Statuscode = 500,
          Status = false,
          Message = "An error occurred while processing your request.",
          Data = null
        });
      }
    }
    [HttpPost("AddOrUpdateDeductionsTaxTableDetail")]
    public async Task<IActionResult> AddOrUpdateDeductionsTaxTableDetail([FromBody] DeductionsTaxTableDetail detail)
    {
      try
      {
        if (detail == null)
        {
          return BadRequest(new ResponseModel
          {
            Statuscode = 400,
            Status = false,
            Message = "Invalid data provided.",
            Data = Array.Empty<object>()
          });
        }

        if (detail.TaxTabId > 0)
        {
          var existingDetail = await _Db.DeductionsTaxTableDetails.FindAsync(detail.TaxTabId);
          if (existingDetail == null)
          {
            return NotFound(new ResponseModel
            {
              Statuscode = 404,
              Status = false,
              Message = "Record not found.",
              Data = Array.Empty<object>()
            });
          }
          _Db.Entry(existingDetail).CurrentValues.SetValues(detail);
          await _Db.SaveChangesAsync();

          return Ok(new ResponseModel
          {
            Statuscode = 200,
            Status = true,
            Message = "Data updated successfully!",
            Data = new object[] { existingDetail }
          });
        }
        else
        {
          _Db.DeductionsTaxTableDetails.Add(detail);
          await _Db.SaveChangesAsync();

          return CreatedAtAction(nameof(AddOrUpdateDeductionsTaxTableDetail), new { id = detail.TaxTabId }, new ResponseModel
          {
            Statuscode = 201,
            Status = true,
            Message = "Data added successfully!",
            Data = new object[] { detail }
          });
        }
      }
      catch (Exception ex)
      {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new ResponseModel
        {
          Statuscode = 500,
          Status = false,
          Message = "An unexpected error occurred.",
          Data = new object[] { ex.Message }
        });
      }
    }


    [HttpPost("AddOrUpdateDeductionsTaxTableDetailNew")]
    public async Task<IActionResult> AddOrUpdateDeductionsTaxTableDetailNew([FromBody] List<DeductionsTaxTableDetail> obj)
    {
      try
      {
        if (obj[0].TaxTabId == 0)
        {

          if (_Db.DeductionsTaxTableDetails.Where(e => e.TaxHeaderID == obj[0].TaxHeaderID&&e.PayPeriod== obj[0].PayPeriod
          &&e.BaseAmt== obj[0].BaseAmt && e.TaxRate== obj[0].TaxRate && e.OverAmt== obj[0].OverAmt).Any())
          {
            return Ok(new ResponseModel
            {
              Statuscode = 400,
              Status = false,
              Message = "Duplicate Entry Not Allowed!",
              Data = new object[] { }
            });
          }

          var header = _Db.DeductionsTaxTableHeaders.FirstOrDefault(e => e.TaxTabHid == obj[0].TaxHeaderID);
          if (header is not null)
          {
            obj.ForEach(e => { e.TaxYear = header.TaxYear; e.DedCode = header.DedCode; e.OrderNo = 0; });
            _Db.DeductionsTaxTableDetails.AddRange(obj);
            _Db.SaveChanges();
            return Ok(new ResponseModel
            {
              Statuscode = 200,
              Status = true,
              Message = "Data Added successfully!",
              Data = new object[] { }
            });

          }
          return BadRequest(new ResponseModel
          {
            Statuscode = 400,
            Status = false,
            Message = "data not found!",
            Data = new object[] { }
          });
        }
        else
        {
          var details = _Db.DeductionsTaxTableDetails.FirstOrDefault(e => e.TaxTabId == obj[0].TaxTabId);
          if (details != null)
          {
            details.TaxRate = obj[0].TaxRate;
            details.BaseAmt = obj[0].BaseAmt;
            details.OverAmt = obj[0].OverAmt;
            details.PayPeriod = obj[0].PayPeriod;
            _Db.SaveChanges();
          }
          return Ok(new ResponseModel
          {
            Statuscode = 200,
            Status = true,
            Message = "Data updated successfully!",
            Data = new object[] { }
          });
        }

      }
      catch (Exception ex)
      {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new ResponseModel
        {
          Statuscode = 500,
          Status = false,
          Message = "An unexpected error occurred.",
          Data = new object[] { ex.Message }
        });
      }
    }

    [HttpGet("GetDeductionsTaxTableDetail")]
    public async Task<IActionResult> GetDeductionsTaxTableDetail(int TaxTabID)
    {
      var detail = await _Db.DeductionsTaxTableDetails.FindAsync(TaxTabID);

      if (detail == null)
      {
        return NotFound();
      }

      return Ok(detail);
    }

    [HttpGet("DeleteDeductionsTaxTableDetail")]
    public async Task<IActionResult> DeleteDeductionsTaxTableDetail(int TaxTabID)
    {
      try
      {
        if (TaxTabID == 0)
        {
          return BadRequest(new ResponseModel
          {
            Statuscode = 400,
            Status = false,
            Message = "Invalid data provided.",
            Data = Array.Empty<object>()
          });
        }

        var detail = await _Db.DeductionsTaxTableDetails.FindAsync(TaxTabID);
        var header = await _Db.DeductionsTaxTableHeaders.FirstOrDefaultAsync(p => p.TaxTabHid == (detail.TaxHeaderID ?? 0));

        string startYearStr = header?.startDate?.Year.ToString() ?? "";
        string endYearStr = header?.endDate?.Year.ToString() ?? "";
        int startMonth = header?.startDate?.Month ?? 0;
        int endMonth = header?.endDate?.Month ?? 0;

        bool isexistC3 = await _Db.ProcessC3headers.AnyAsync(p =>
            p.PeriodYear != null && p.PerioddMonth != null &&
            (
                (p.PeriodYear == startYearStr && Convert.ToInt32(p.PerioddMonth) >= startMonth) ||
                (p.PeriodYear == endYearStr && Convert.ToInt32(p.PerioddMonth) <= endMonth) ||
                (Convert.ToInt32(p.PeriodYear) > Convert.ToInt32(startYearStr) && Convert.ToInt32(p.PeriodYear) < Convert.ToInt32(endYearStr))
            )
        );


        //bool isexistC3 = _Db.ProcessC3headers.Any(p => p.PeriodYear == Year);
        if (isexistC3)
        {
          return Conflict(new ResponseModel
          {
            Statuscode = 404,
            Status = false,
            Message = "C3 has been Created for this year, So you can not delete settings ",
            Data = Array.Empty<object>()
          });
        }

        //var detail = await _Db.DeductionsTaxTableDetails.FindAsync(TaxTabID);
        if (detail == null)
        {
          return NotFound(new ResponseModel
          {
            Statuscode = 404,
            Status = false,
            Message = "Record not found.",
            Data = Array.Empty<object>()
          });
        }
        _Db.DeductionsTaxTableDetails.Remove(detail);
        await _Db.SaveChangesAsync();

        return Ok(new ResponseModel
        {
          Statuscode = 200,
          Status = true,
          Message = "Record deleted successfully.",
          Data = Array.Empty<object>()
        });
      }
      catch (Exception ex)
      {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new ResponseModel
        {
          Statuscode = 500,
          Status = false,
          Message = "An error occurred while deleting the record.",
          Data = new object[] { ex.Message }
        });
      }
    }



    [HttpGet("carryforwardDeductionsTaxTableDetailData")]
    public async Task<IActionResult> carryforwardDeductionsTaxTableDetailData(string Fromyear, string Toyear)
    {
      try
      {
        if (!int.TryParse(Fromyear, out int fromYear) || !int.TryParse(Toyear, out int toYear))
        {
          return BadRequest(new ResponseModel
          {
            Status = false,
            Statuscode = 400,
            Message = "Invalid year format.",
            Data = ""
          });
        }

        string staticConnection = C3WizardLayerConn_BaseData.StaticConnectionString;

        using (SqlConnection con = new SqlConnection(staticConnection))
        {
          await con.OpenAsync();
          DataTable originalData = new DataTable();
          using (SqlCommand selectCmd = new SqlCommand(@"
                SELECT Ded_Code, Pay_Period, Marital_Stat, Over_Amt, Base_Amt, Tax_Rate, Order_No 
                FROM Deductions_Tax_Table_Details 
                WHERE Tax_Year = @FromYear", con))
          {
            selectCmd.Parameters.AddWithValue("@FromYear", fromYear);
            using (SqlDataAdapter adapter = new SqlDataAdapter(selectCmd))
            {
              adapter.Fill(originalData);
            }
          }

          if (originalData.Rows.Count == 0)
          {
            return Ok(new ResponseModel
            {
              Status = true,
              Statuscode = 200,
              Message = $"No records found for Tax Year {fromYear}.",
              Data = ""
            });
          }

          using (SqlTransaction transaction = con.BeginTransaction())
          {
            try
            {
              int updateCount = 0, insertCount = 0;

              foreach (DataRow row in originalData.Rows)
              {
                string dedCode = row["Ded_Code"].ToString();
                string payPeriod = row["Pay_Period"].ToString();
                string maritalStat = row["Marital_Stat"].ToString();
                decimal? overAmt = row["Over_Amt"] != DBNull.Value ? Convert.ToDecimal(row["Over_Amt"]) : (decimal?)null;
                decimal? baseAmt = row["Base_Amt"] != DBNull.Value ? Convert.ToDecimal(row["Base_Amt"]) : (decimal?)null;
                decimal? taxRate = row["Tax_Rate"] != DBNull.Value ? Convert.ToDecimal(row["Tax_Rate"]) : (decimal?)null;


                string existQuery = @"SELECT COUNT(*) FROM Deductions_Tax_Table_Details 
                                    WHERE Tax_Year = @TaxYear AND Ded_Code = @DedCode 
                                    AND Pay_Period = @PayPeriod AND Marital_Stat = @MaritalStat
                                    AND Over_Amt = @Over_Amt AND Base_Amt = @Base_Amt AND Tax_Rate = @Tax_Rate";


                using (SqlCommand existCmd = new SqlCommand(existQuery, con, transaction))
                {
                  existCmd.Parameters.AddWithValue("@TaxYear", toYear);
                  existCmd.Parameters.AddWithValue("@DedCode", dedCode);
                  existCmd.Parameters.AddWithValue("@PayPeriod", payPeriod);
                  existCmd.Parameters.AddWithValue("@MaritalStat", maritalStat);
                  existCmd.Parameters.AddWithValue("@Over_Amt", (object?)overAmt ?? DBNull.Value);
                  existCmd.Parameters.AddWithValue("@Base_Amt", (object?)baseAmt ?? DBNull.Value);
                  existCmd.Parameters.AddWithValue("@Tax_Rate", (object?)taxRate ?? DBNull.Value);


                  int exists = (int)await existCmd.ExecuteScalarAsync();

                  if (exists > 0)
                  {
                    // Update
                    string updateQuery = @"UPDATE Deductions_Tax_Table_Details 
                                          SET Over_Amt = @OverAmt, Base_Amt = @BaseAmt, Tax_Rate = @TaxRate, Order_No = @OrderNo 
                                          WHERE Tax_Year = @TaxYear AND Ded_Code = @DedCode 
                                          AND Pay_Period = @PayPeriod AND Marital_Stat = @MaritalStat
                                          AND Over_Amt = @Over_Amt AND Base_Amt = @Base_Amt AND Tax_Rate = @Tax_Rate";


                    using (SqlCommand updateCmd = new SqlCommand(updateQuery, con, transaction))
                    {
                      // Parameters for SET clause
                      updateCmd.Parameters.AddWithValue("@OverAmt", overAmt);
                      updateCmd.Parameters.AddWithValue("@BaseAmt", baseAmt);
                      updateCmd.Parameters.AddWithValue("@TaxRate", taxRate);
                      updateCmd.Parameters.AddWithValue("@OrderNo", row["Order_No"] ?? DBNull.Value);

                      // Parameters for WHERE clause
                      updateCmd.Parameters.AddWithValue("@TaxYear", toYear);
                      updateCmd.Parameters.AddWithValue("@DedCode", dedCode);
                      updateCmd.Parameters.AddWithValue("@PayPeriod", payPeriod);
                      updateCmd.Parameters.AddWithValue("@MaritalStat", maritalStat);
                      updateCmd.Parameters.AddWithValue("@Over_Amt", (object?)overAmt ?? DBNull.Value);
                      updateCmd.Parameters.AddWithValue("@Base_Amt", (object?)baseAmt ?? DBNull.Value);
                      updateCmd.Parameters.AddWithValue("@Tax_Rate", (object?)taxRate ?? DBNull.Value);

                      await updateCmd.ExecuteNonQueryAsync();

                      updateCount++;
                    }

                  }
                  else
                  {
                    // Insert
                    string insertQuery = @"INSERT INTO Deductions_Tax_Table_Details 
                                                        (Tax_Year, Ded_Code, Pay_Period, Marital_Stat, Over_Amt, Base_Amt, Tax_Rate, Order_No) 
                                                        VALUES (@TaxYear, @DedCode, @PayPeriod, @MaritalStat, @OverAmt, @BaseAmt, @TaxRate, @OrderNo)";

                    using (SqlCommand insertCmd = new SqlCommand(insertQuery, con, transaction))
                    {
                      insertCmd.Parameters.AddWithValue("@TaxYear", toYear);
                      insertCmd.Parameters.AddWithValue("@DedCode", dedCode);
                      insertCmd.Parameters.AddWithValue("@PayPeriod", payPeriod);
                      insertCmd.Parameters.AddWithValue("@MaritalStat", maritalStat);
                      insertCmd.Parameters.AddWithValue("@OverAmt", row["Over_Amt"]);
                      insertCmd.Parameters.AddWithValue("@BaseAmt", row["Base_Amt"]);
                      insertCmd.Parameters.AddWithValue("@TaxRate", row["Tax_Rate"]);
                      insertCmd.Parameters.AddWithValue("@OrderNo", row["Order_No"] ?? DBNull.Value);

                      await insertCmd.ExecuteNonQueryAsync();
                      insertCount++;
                    }
                  }
                }
              }

              await transaction.CommitAsync();

              return Ok(new ResponseModel
              {
                Status = true,
                Statuscode = 200,
                Message = $"Successfully carried forward data from Tax Year {fromYear} to {toYear}. Inserted: {insertCount}, Updated: {updateCount}.",
                Data = ""
              });
            }
            catch (Exception ex)
            {
                            var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                            LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                            await transaction.RollbackAsync();
              return StatusCode(500, new ResponseModel
              {
                Status = false,
                Statuscode = 500,
                Message = "Transaction failed: " + ex.Message,
                Data = new object[] { ex.StackTrace }
              });
            }
          }
        }
      }
      catch (Exception ex)
      {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new ResponseModel
        {
          Status = false,
          Statuscode = 500,
          Message = "An error occurred while processing the data.",
          Data = new object[] { ex.Message }
        });
      }
    }

    [HttpGet("carryforwardDeductionsTaxTableDetailDataNew")]
    public async Task<IActionResult> carryforwardDeductionsTaxTableDetailDataNew(int Fromyear, int Toyear)
    {

      try
      {
        var oldheader = _Db.DeductionsTaxTableHeaders.FirstOrDefault(e => e.TaxTabHid == Fromyear);
        var header = _Db.DeductionsTaxTableHeaders.FirstOrDefault(e => e.TaxTabHid == Toyear);

        if (oldheader.startDate > header.startDate && oldheader.endDate > header.endDate)
        {
          
        
        return BadRequest(new ResponseModel
          {
            Statuscode = 400,
            Status = false,
            Message = "carry forward  Not Allowed to Back date",
            Data = Array.Empty<object>()
          });
        }

        var details = _Db.DeductionsTaxTableDetails.AsNoTracking().Where(e => e.TaxHeaderID == Fromyear).ToList();


        if (!_Db.DeductionsTaxTableDetails.Any(e => e.TaxHeaderID == Toyear) && header != null)
        {
          details.ForEach(e => { e.TaxHeaderID = Toyear; e.TaxYear = header.TaxYear; e.DedCode = header.DedCode; e.TaxTabId = 0; });
          _Db.DeductionsTaxTableDetails.AddRange(details);
          _Db.SaveChanges();
          return Ok(new ResponseModel
          {
            Statuscode = 200,
            Status = true,
            Message = "carry forward successfully",
            Data = Array.Empty<object>()
          });
        }
        else
        {
          return BadRequest(new ResponseModel
          {
            Statuscode = 400,
            Status = false,
            Message = "The provided date range overlaps with an existing record.",
            Data = Array.Empty<object>()
          });
        }
      }
      catch (Exception ex)
      {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new ResponseModel
        {
          Statuscode = 500,
          Status = false,
          Message = "An error occurred while deleting the record.",
          Data = new object[] { ex.Message }
        });
      }

    }

  }

}
