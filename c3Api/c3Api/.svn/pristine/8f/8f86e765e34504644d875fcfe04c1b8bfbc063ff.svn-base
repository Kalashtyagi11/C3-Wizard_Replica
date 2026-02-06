using C3Wizard.COMMONPROP;
using C3WizardData.Models;
using C3WizardHelper.ViewModels;
using C3WizardLayer.BusinessObjects;
using C3WizardLayer.DataObjects;
using C3WizardRepository.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace C3WizardRepository.Repository
{
    public class RepoBonusSettings
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly C3wizardContext _context;
        private Microsoft.AspNetCore.Hosting.IHostingEnvironment _environment;
        int parentuserid = 0;
        bool isPPOC = false;
        string Userimage = null;
        List<BLSECUsers> blList_ALL = new List<BLSECUsers>();
        ResponseModel ResponseModel = new ResponseModel();
        string filepath;
        string Imagename = null;
        string SSNofEmp;
        public RepoBonusSettings(IConfiguration configuration, IHttpContextAccessor httpContextAccessor, C3wizardContext context, Microsoft.AspNetCore.Hosting.IHostingEnvironment Environment)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            _environment = Environment;
        }
        public async Task<ResponseModel> Get_EXEMPTED_CONTRIBUTION_Settings()
        {
            List<DecBonusSetting_Details> DBsettinglist = new List<DecBonusSetting_Details>();


            SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
            SqlCommand cmd = new SqlCommand("Get_EXEMPTED_CONTRIBUTION_SettingsNew", staticConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            sqlAdapter.Fill(ds);

            DataTable dtMRS = new DataTable();
            dtMRS = ds.Tables[0];
            if (dtMRS.Rows.Count > 0)
            {
                foreach (DataRow row in dtMRS.Rows)
                {

                    DecBonusSetting_Details CSD = new DecBonusSetting_Details();
                    CSD.DBSid = Convert.IsDBNull(row["DBSId"]) ? 0 : int.Parse(row["DBSId"].ToString());
                    CSD.MonthNo = Convert.IsDBNull(row["MonthNo"]) ? null : Convert.ToInt32(row["MonthNo"]);
                    CSD.yearName = Convert.IsDBNull(row["Year"]) ? null : row["Year"].ToString();
                    //CSD.Employee_Levy = Convert.IsDBNull(row["IsexemptedLevy"]) ? "/img/close.png" : bool.Parse(row["IsexemptedLevy"].ToString()) ? "/img/RightSine.png" : "/img/close.png";
                    //CSD.Employer_Levy = Convert.IsDBNull(row["IsexemptedEmployerLevy"]) ? "/img/close.png" : bool.Parse(row["IsexemptedEmployerLevy"].ToString()) ? "/img/RightSine.png" : "/img/close.png";
                    //CSD.Severance = Convert.IsDBNull(row["IsexemptedSeverance"]) ? "/img/close.png" : bool.Parse(row["IsexemptedSeverance"].ToString()) ? "/img/RightSine.png" : "/img/close.png";
                    //CSD.Social_Security = Convert.IsDBNull(row["Isexemptedsocialsecurity"]) ? "/img/close.png" : bool.Parse(row["Isexemptedsocialsecurity"].ToString()) ? "/img/RightSine.png" : "/img/close.png";
                    CSD.Employee_Levy = Convert.IsDBNull(row["IsexemptedLevy"]) || row["IsexemptedLevy"].ToString() == "False" ? "0" : "1";

                    CSD.Employer_Levy = Convert.IsDBNull(row["IsexemptedEmployerLevy"]) || row["IsexemptedEmployerLevy"].ToString() == "False" ? "0" : "1";
                    CSD.Severance = Convert.IsDBNull(row["IsexemptedSeverance"]) || row["IsexemptedSeverance"].ToString() == "False" ? "0" : "1";
                    CSD.Social_Security = Convert.IsDBNull(row["Isexemptedsocialsecurity"]) || row["Isexemptedsocialsecurity"].ToString() == "False" ? "0" : "1";
                    CSD.islocked = Convert.IsDBNull(row["IsLocked"]) ? "False" : bool.Parse(row["IsLocked"].ToString()).ToString();
                    //CSD.Candelete = Helper.RoleId == 1 ? true : false;
                    CSD.Canedit = CSD.islocked == "True" ? false : true;
                    CSD.Candelete = CSD.islocked == "True" ? false : CSD.Candelete;
                    DBsettinglist.Add(CSD);
                }
            }

            //lvC3Setting.ItemsSource = DBsettinglist;
            //lvC3Setting.SelectedIndex = -1;

            //CollectionView view = (CollectionView)CollectionViewSource.GetDefaultView(lvC3Setting.ItemsSource);
            //PropertyGroupDescription groupDescription = new PropertyGroupDescription("yearName");
            //view.GroupDescriptions.Add(groupDescription);

            if (DBsettinglist != null)
            {
                ResponseModel.Status = true;
                ResponseModel.Data = DBsettinglist;
                ResponseModel.Message = "Data get successfully";
                ResponseModel.Statuscode = 200;
            }
            else
            {
                ResponseModel.Status = false;
                ResponseModel.Data = null;
                ResponseModel.Message = "Data not found";
                ResponseModel.Statuscode = 404;
            }
            return ResponseModel;
        }
        public async Task<ResponseModel> Save_button_Click(BonusSettingVM bonusSettingVM)
        {
            if (bonusSettingVM.Year != null)
            {
                if (true)
                {
                    SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
                    if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                    if (bonusSettingVM.mode == 0)
                    {
                        if (IsDecember_Bonus_SettingsExists(bonusSettingVM.Year,bonusSettingVM.MonthNo))
                        {
                            SqlCommand cmd = new SqlCommand("Insert Into DECEMBER_BONUS_EXEMPTED_CONTRIBUTION (IsexemptedLevy, IsexemptedEmployerLevy, IsexemptedSeverance, Isexemptedsocialsecurity,Year, MonthNo) " +
                                                   "VALUES ('" + bonusSettingVM.Employee_Levy + "','" + bonusSettingVM.Employer_Levy + "','" + bonusSettingVM.Severance + "','" + bonusSettingVM.Social_Security + "','" + bonusSettingVM.Year + "'," + bonusSettingVM.MonthNo + ")", staticConnection);
                            cmd.ExecuteNonQuery();
                            //C3WizardMessageBox.Show("C3Wizard", "Saved Successfully");
                            ResponseModel.Status = true;
                            ResponseModel.Message = "C3Wizard saved successfully";
                            ResponseModel.Statuscode = 200;
                        }
                        else
                        {
                            ResponseModel.Status = false; 
                            ResponseModel.Data = null;
                            ResponseModel.Message = "Bonus settings already exists for this year in month.";
                            ResponseModel.Statuscode = 404;
                            return ResponseModel;
                        }

                    }
                    if (bonusSettingVM.mode == 1)
                    {
                        SqlCommand cmd = new SqlCommand("UPDATE DECEMBER_BONUS_EXEMPTED_CONTRIBUTION SET IsexemptedLevy='" + bonusSettingVM.Employee_Levy +
                                                        "', IsexemptedEmployerLevy='" + bonusSettingVM.Employer_Levy + "', IsexemptedSeverance='" + bonusSettingVM.Severance +
                                                        "', Isexemptedsocialsecurity='" + bonusSettingVM.Social_Security + "', MonthNo=" + bonusSettingVM.MonthNo + " Where DBSId=" + bonusSettingVM.Id, staticConnection);
                        cmd.ExecuteNonQuery();
                        // C3WizardMessageBox.Show("C3Wizard", "Updated Successfully");
                        ResponseModel.Status = true;
                        ResponseModel.Message = "C3Wizard update successfully";
                        ResponseModel.Statuscode = 200;
                    }


                    staticConnection.Close();
                    //Application.Current.Properties["TextChanged"] = 0;
                    //string ResPath = Directory.GetCurrentDirectory() + "\\Resources.resx";//same fileName
                    //var reader = new ResXResourceReader(Helper.ApplicationPath("Resources.resx"));
                    //var node = reader.GetEnumerator();
                    ////  var writer = new ResXResourceWriter(@"D:\C3Wizard\C3Wizard\Properties\Resources.resx");//same fileName(not new)
                    //double width = 0.00;
                    //while (node.MoveNext())
                    //{
                    //    width = (double)(node.Value);
                    //}
                    //ObjDashboardWindow.MainMdiContainer.Children.Clear();
                    //ObjDashboardWindow.MainMdiContainer.Children.Add(new MdiChild()
                    //{
                    //    Title = "DECEMBER BONUS SETTINGS LIST",
                    //    Height = (System.Windows.SystemParameters.PrimaryScreenHeight) - 150,
                    //    Width = width,//(System.Windows.SystemParameters.PrimaryScreenWidth) - 350,
                    //    Style = null,
                    //    Content = new DecemberBonusSettingList()
                    //});
                }
            }
            else
            {
                //C3WizardMessageBox.Show("C3 Wizard", "Please select year.");
                ResponseModel.Message = "Please select year.";
            }
            return ResponseModel;
        }
        public bool IsDecember_Bonus_SettingsExists(string year,int? monthno)
        {
            bool ret_uren = true;
            SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
            SqlCommand cmd = new SqlCommand("Get_EXEMPTED_CONTRIBUTION_SettingsNew", staticConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            sqlAdapter.Fill(ds);

            DataTable dtMRS = new DataTable();
            dtMRS = ds.Tables[0];
            if (dtMRS.Rows.Count > 0)
            {
                foreach (DataRow row in dtMRS.Rows)
                {
                    if (year == (Convert.IsDBNull(row["Year"]) ? null : row["Year"].ToString()) && monthno== (Convert.IsDBNull(row["MonthNo"]) ? null : Convert.ToInt32(row["MonthNo"])))
                    {
                        ret_uren = false;
                        //C3WizardMessageBox.Show("C3 Wizard", "December bonus settings already exists for this year.");
                    }
                }
            }
            return ret_uren;
        }
        int[] ylist = null;
        int DBSId = 0;
        public async Task<BonusSettingVM> Get_December_Bonus_Settings(int? DBSid)
        {
            ylist = Helper.yearlist();
            DBSId = (int)DBSid;
            SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
            SqlCommand cmd = new SqlCommand("Get_EXEMPTED_CONTRIBUTION_SettingsNew", staticConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            sqlAdapter.Fill(ds);

            DataTable dtMRS = new DataTable();
            dtMRS = ds.Tables[0];
            if (dtMRS.Rows.Count > 0)
            {
                foreach (DataRow row in dtMRS.Rows)
                {
                    int D_bid = Convert.IsDBNull(row["DBSId"]) ? 0 : int.Parse(row["DBSId"].ToString());
                    if (D_bid == DBSid)
                    {
                        var data = new BonusSettingVM();
                        // CmbFYear.Text = Convert.IsDBNull(row["Year"]) ? null : row["Year"].ToString();
                        string year = Convert.IsDBNull(row["Year"]) ? null : row["Year"].ToString();
                        //data.Year = Helper.yearindex(ylist, int.Parse(year)) > -1 ? Helper.yearindex(ylist, int.Parse(year)).ToString() : Addyearindex(int.Parse(year)).ToString();
                        data.Year = year;
                        data.Employee_Levy = Convert.IsDBNull(row["IsexemptedLevy"]) ? false : bool.Parse(row["IsexemptedLevy"].ToString());
                        data.Employer_Levy = Convert.IsDBNull(row["IsexemptedEmployerLevy"]) ? false : bool.Parse(row["IsexemptedEmployerLevy"].ToString());
                        data.Severance = Convert.IsDBNull(row["IsexemptedSeverance"]) ? false : bool.Parse(row["IsexemptedSeverance"].ToString());
                        data.Social_Security = Convert.IsDBNull(row["Isexemptedsocialsecurity"]) ? false : bool.Parse(row["Isexemptedsocialsecurity"].ToString());
                        //islocked = Convert.IsDBNull(row["IsLocked"]) ? false : bool.Parse(row["IsLocked"].ToString());
                        data.MonthNo= Convert.IsDBNull(row["MonthNo"]) ? null :Convert.ToInt32(row["MonthNo"]);
                        data.Id = Convert.IsDBNull(row["DBSId"]) ? null : Convert.ToInt32(row["DBSId"]);
                        return data;
                    }
                }
            }
            return null;
        }
        public int Addyearindex(int selectedyear)
        {
            int ycount = ylist.ToList().Count;
            int yindex = ycount;
            Array.Resize(ref ylist, ycount + 1);
            ylist[ycount] = selectedyear;
            //CmbFYear.ItemsSource = ylist;
            return yindex; ;
        }
        public async Task<ResponseModel> C3_Setting_Delete_Click(int Id,string Year, string? st_Date,string? en_Date,bool UserMessage)
        {
            //var item = ((DecBonusSetting_Details)(((System.Windows.Controls.Primitives.ButtonBase)(e.Source)).CommandParameter));
            //int? Dbsettingsid = item.DBSid;
            int? Dbsettingsid = Id;
            if (isC3Finilize(Year))
            {
                //if (C3WizardMessageBox.Show("C3 Wizard", "Do you want to delete this december bonus settings details?", MessageBoxButton.YesNo, MessageBoxImage.Warning) == MessageBoxResult.No)
                if(UserMessage==false)
                {
                    return null;
                }
                else
                {
                    int RoleId = 1;
                    if (RoleId == 1)
                    {


                        DateTime? item_en_Date = en_Date == null ? null : (DateTime?)DateTime.ParseExact(en_Date, Helper.DisplayDateFormat, System.Globalization.CultureInfo.InvariantCulture);
                        DateTime? item_st_Date = st_Date == null ? null : (DateTime?)DateTime.ParseExact(st_Date, Helper.DisplayDateFormat, System.Globalization.CultureInfo.InvariantCulture);
                        SqlCommand cmd = null;
                        SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
                        cmd = new SqlCommand("DeleteDecSettingDetails", staticConnection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@DBSId", SqlDbType.Int, 12, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)Id ?? (object)DBNull.Value));
                        cmd.Parameters.Add(new SqlParameter("@From_date", SqlDbType.DateTime, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)item_st_Date ?? (object)DBNull.Value));
                        cmd.Parameters.Add(new SqlParameter("@To_date", SqlDbType.DateTime, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)item_en_Date ?? (object)DBNull.Value));
                        SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);

                        DataTable dt = new DataTable();
                        sqlAdapter.Fill(dt);
                        //Get_EXEMPTED_CONTRIBUTION_Settings();
                        ResponseModel.Status = true;
                        ResponseModel.Message = "Data deleted successfully";
                        ResponseModel.Statuscode = 200;
                        return ResponseModel;
                    }
                }
            }
            return null;
        }
        public bool isC3Finilize(string year)
        {
            bool ret_uren = true;
            try
            {
                List<C3Header> listDVOC3Header = new List<C3Header>();
                SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
                SqlCommand cmd = new SqlCommand("get_C3Genrated_dataSettings", staticConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sqlAdapter.Fill(dt);
                if (dt.Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Rows)
                    {

                        C3Header Obj = new C3Header();
                        Obj.HeaderID = Convert.IsDBNull(row["C3HEADERID"]) ? 0 : int.Parse(row["C3HEADERID"].ToString());
                        Obj.p_Month = Convert.IsDBNull(row["PERIODD_MONTH"]) || row["PERIODD_MONTH"].ToString() == "" ? -1 : int.Parse(row["PERIODD_MONTH"].ToString()) + 1;
                        Obj.P_year = Convert.IsDBNull(row["PERIOD_YEAR"]) || row["PERIOD_YEAR"].ToString() == "" ? -1 : int.Parse(row["PERIOD_YEAR"].ToString());
                        Obj.Schedule_NO = Convert.IsDBNull(row["Schedule_NO"]) ? 0 : int.Parse(row["Schedule_NO"].ToString());
                        listDVOC3Header.Add(Obj);

                    }
                    bool exists = listDVOC3Header.Any(x => x.P_year == int.Parse(year) && x.p_Month == 12);
                    if (exists)
                    {
                        ret_uren = false;
                        //C3WizardMessageBox.Show("C3 Wizard", "December bonus settings already used \n You can not delete this december bonus settings details");

                    }
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
                // Login login = new Login();
                //login.Error_Log(ex.Message);

            }
            return ret_uren;
        }
    }
}
