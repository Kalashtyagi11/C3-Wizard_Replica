using Azure.Core;
using C3Wizard.COMMONPROP;
using C3WizardData.Models;
using C3WizardHelper.ViewModels;
using C3WizardLayer.BusinessObjects;
using C3WizardLayer.DataObjects;
using C3WizardRepository.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace C3WizardRepository.Repository
{
    public class RepoSelfUserManagement
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
        public RepoSelfUserManagement(IConfiguration configuration,IHttpContextAccessor httpContextAccessor, C3wizardContext context, Microsoft.AspNetCore.Hosting.IHostingEnvironment Environment)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            _environment = Environment;
        }
        public async Task<User> GetSelfUserManagement(int UserId)
        {
            try
            {
                //ObjDashboardWindow = Application.Current.Windows.OfType<C3Wizard.SelfEmployedDashboard>().First();
                //Application.Current.Properties["Currentform"] = "Edit Self Employed User Management";
                //Application.Current.Properties["TextChanged"] = 0;
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

            //InitializeComponent();

            //ObjDashboardWindow.unselctdashboard("All", 0);

            //ObjDashboardWindow.USERMANAGEMENT.Background = Brushes.Green;
            //ObjDashboardWindow.USERMANAGEMENT.Foreground = Brushes.White;
            //das.ImageSource = new BitmapImage(new Uri(@"\img\96x96_usermanagement_w.png", UriKind.Relative));
            //ObjDashboardWindow.Img_USERMANAGEMENT.Source = das.ImageSource;

            //LoadUserRole();
            List<BLSECUsers> blList = new List<BLSECUsers>();
            //List<BLEmployeeProfessional> blempListpro = new List<BLEmployeeProfessional>();
            //blemp.UserId = param;
            blList_ALL = BLSECUsers.SECUsersCollection().ToList();
            blList = blList_ALL.Where(t => t.UserId == UserId).ToList();


            if (blList.Count == 1)
            {
                var data = new User();
                //userRole.IsEnabled = Helper.UserID != param ? true : false;
                data.userId = blList.ElementAt(0).UserId ?? 0;
                data.firstName = string.IsNullOrEmpty(blList.ElementAt(0).FirstName) ? "" : blList.ElementAt(0).FirstName.ToString();
                data.middleName = string.IsNullOrEmpty(blList.ElementAt(0).MiddleName) ? "" : blList.ElementAt(0).MiddleName.ToString();
                data.lastName = string.IsNullOrEmpty(blList.ElementAt(0).LastName) ? "" : blList.ElementAt(0).LastName.ToString();
                data.loginId = string.IsNullOrEmpty(blList.ElementAt(0).LoginId) ? "" : blList.ElementAt(0).LoginId.ToString();
                //Txt_UserName.IsEnabled = false;
                data.emailId = string.IsNullOrEmpty(blList.ElementAt(0).EmailId) ? "" : blList.ElementAt(0).EmailId.ToString();
                data.roleId = blList.ElementAt(0).RoleId ?? 0;
                //activestatus.IsChecked = blList.ElementAt(0).Status;
                //activestatus.Visibility = Helper.RoleId != 1 ? Visibility.Visible : Visibility.Hidden;
                //Status.Visibility = Helper.RoleId != 1 ? Visibility.Visible : Visibility.Hidden;
                data.status = string.IsNullOrEmpty(blList.ElementAt(0).Status.ToString()) ? false : (bool)blList.ElementAt(0).Status;
                //userRole.SelectedValue = string.IsNullOrEmpty(blList.ElementAt(0).RoleId.ToString()) ? 0 : blList.ElementAt(0).RoleId;
                data.parentUserId = blList.ElementAt(0).parentuserid == null ? 0 : (int)blList.ElementAt(0).parentuserid;
                data.isPPOC = blList.ElementAt(0).IsPPOC == null ? true : (bool)blList.ElementAt(0).IsPPOC;
                try
                {
                    Userimage = string.IsNullOrEmpty(blList.ElementAt(0).ProfileImage) ? "" : blList.ElementAt(0).ProfileImage.ToString();
                    var Request = _httpContextAccessor.HttpContext.Request;
                    string imageUrl = $"{Request.Scheme}://{Request.Host}/UserImage/{Userimage}";

                    data.profileImage = imageUrl;


                    return  data ;
                    //Userimage = string.IsNullOrEmpty(blList.ElementAt(0).ProfileImage) ? "" : blList.ElementAt(0).ProfileImage.ToString();
                    //if (Userimage != null && Userimage != "")
                    //{
                    //    var applicationPath = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
                    //    var uri = new Uri(applicationPath + "/UserImage/" + Userimage);
                    //    var bitmap = new BitmapImage(uri);
                    //    imgProfilePic.Source = bitmap;
                    //}
                    //else
                    //{
                    //    var uri = new Uri("pack://application:,,,/Images/user.jpg");
                    //    var bitmap = new BitmapImage(uri);
                    //    imgProfilePic.Source = bitmap;
                    //}
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

                UserId = UserId;

                //Application.Current.Properties["TextChanged"] = 0;
            }
            //Application.Current.Properties["TextChanged"] = 0;
            return null ;
        }
        public async Task<ResponseModel> UpdateSelfUserManagement(UserImagePost selfusermanagement)
        {
            var user = await _context.Secusers.FindAsync(selfusermanagement.userId);
            if (user == null)
            {
                ResponseModel.Message = "User Not Found";
                ResponseModel.Statuscode = 500;
                return ResponseModel;  
            }
            BLSECUsers secuser = new BLSECUsers();
            secuser.FirstName = selfusermanagement.firstName;
            //secuser.MiddleName = selfusermanagement.middleName;
            secuser.LastName = selfusermanagement.lastName;
            secuser.EmailId = selfusermanagement.emailId;
            secuser.RoleId = user.RoleId;
            secuser.Status = user.Status;
            // secuser.EmpId = Helper.UserID.ToString();

            try
            {
                if (selfusermanagement.profileImage != null && selfusermanagement.profileImage.Length > 0)
                {
                    string uploadsFolder = Path.Combine(_environment.WebRootPath, "UserImage");
                    Directory.CreateDirectory(uploadsFolder);
                    Imagename = Guid.NewGuid().ToString() + Path.GetExtension(selfusermanagement.profileImage.FileName);
                    string filePath = Path.Combine(uploadsFolder, Imagename);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        selfusermanagement.profileImage.CopyTo(fileStream);
                    }
                    secuser.ProfileImage = Imagename;
                }

                else
                {
                    secuser.ProfileImage = user.UserImage;
                }
                //if (filepath != null)
                //{
                //    string imagepath = filepath;
                //    var imageFile = new System.IO.FileInfo(imagepath);
                //    if (imageFile.Exists)// check image file exist
                //    {
                //        // get your application folder
                //        var applicationPath = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
                //        // get your 'Uploaded' folder
                //        var dir = new System.IO.DirectoryInfo(System.IO.Path.Combine(applicationPath, "UserImage"));
                //        if (!dir.Exists)
                //            dir.Create();
                //        // Copy file to your folder
                //        Imagename = System.IO.Path.GetFileName(filepath);
                //        string destinationPath = GetDestinationPath(Imagename, "UserImage");
                //        if (!Helper.IsFileLocked(destinationPath))
                //        {
                //            File.Copy(imagepath, destinationPath, true);
                //        }

                //        // imageFile.CopyTo(System.IO.Path.Combine( destinationPath, dir.FullName));
                //        secuser.ProfileImage = Imagename;
                //    }
                //}
                //else
                //{
                //    secuser.ProfileImage = Userimage;
                //}
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
                //secuser.ProfileImage = Imagename;
            }

            secuser.IsLoggedIn = false;
            try
            {
                secuser.IsActive = true;
                secuser.UserId = selfusermanagement.userId;
                secuser.parentuserid = selfusermanagement.parentUserId;
                secuser.IsPPOC = selfusermanagement.isPPOC;
                //secuser.UpdatedBy = Helper.CompanyId;
                secuser.UpdatedOn = DateTime.Now;
                secuser.UpdatedMachineInfo = Helper.MachineInfo;
                secuser.Update();

                List<BLSECUsers> blList = new List<BLSECUsers>();
                blList_ALL = BLSECUsers.SECUsersCollection().ToList();
                blList = blList_ALL.Where(t => t.UserId == secuser.UserId).ToList();

                Userimage = string.IsNullOrEmpty(blList.ElementAt(0).ProfileImage) ? "" : blList.ElementAt(0).ProfileImage.ToString();
                var Request = _httpContextAccessor.HttpContext.Request;
                string imageUrl = $"{Request.Scheme}://{Request.Host}/UserImage/{Userimage}";

                secuser.ProfileImage = imageUrl;

                ResponseModel.Data= secuser;
                ResponseModel.Message = "Data Update successfully";
                ResponseModel.Statuscode= 200;

                return ResponseModel;

                //return Ok(new { Message = "Data Update successfully", Data = secuser });

                //Application.Current.Properties["TextChanged"] = 0;
                //C3WizardMessageBox.Show("C3 Wizard", "User updated successfully.");
                //Application.Current.Properties["User_Name"] = Txt_FirstName.Text.Trim();
                //ObjDashboardWindow.Welcome.Text = "Welcome : " + Helper.User_Name;
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

                //C3WizardMessageBox.Show("C3 Wizard", "Error :" + ex);
            }
            if (filepath != null)
            {
                try
                {
                    //if (Imagename != null && Imagename != "")
                    //{
                    //    var applicationPath = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
                    //    var uri = new Uri(applicationPath + "/UserImage/" + Imagename);
                    //    var bitmap = new BitmapImage(uri);
                    //    ObjDashboardWindow.image.ImageSource = bitmap;
                    //}
                    //else
                    //{
                    //    var uri = new Uri("pack://application:,,,/Images/user.jpg");
                    //    var bitmap = new BitmapImage(uri);
                    //    ObjDashboardWindow.image.ImageSource = bitmap;
                    //}

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
            }
            //ObjDashboardWindow.unselctdashboard("USERMANAGEMENT");
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
            //if (form_d)
            //{
            //    ObjDashboardWindow.MainMdiContainer.Children.Clear();
            //    ObjDashboardWindow.MainMdiContainer.Children.Add(new MdiChild()
            //    {
            //        Title = "SELF EMPLOYED DASHBOARD",
            //        Height = (System.Windows.SystemParameters.PrimaryScreenHeight) - 150,
            //        Width = width,//(System.Windows.SystemParameters.PrimaryScreenWidth) - 350,
            //        Style = null,
            //        Content = new SelfEmployedHome()
            //    });
            //}
            //else
            //{
            //    ObjDashboardWindow.MainMdiContainer.Children.Clear();
            //    ObjDashboardWindow.MainMdiContainer.Children.Add(new MdiChild()
            //    {
            //        Title = "SELF EMPLOYED DASHBOARD",
            //        Height = (System.Windows.SystemParameters.PrimaryScreenHeight) - 150,
            //        Width = width,//(System.Windows.SystemParameters.PrimaryScreenWidth) - 350,
            //        Style = null,
            //        Content = new SelfEmployedHome()
            //    });
            //}
            return null;
        }
        public async Task<ResponseModel> GetSelfEmployedReports(int CompanyId)
        {
            // Mouse.OverrideCursor = System.Windows.Input.Cursors.Wait;
            try
            {
                //   ObjDashboardWindow = Application.Current.Windows.OfType<C3Wizard.SelfEmployedDashboard>().First();
                //   Application.Current.Properties["Currentform"] = "REPORTS";
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
                // login.Error_Log(ex.Message);
            }
            // InitializeComponent();
            // SearchC3.IsChecked = true;
            // Btn_ImportLastSubmittedC3.Visibility = Visibility.Hidden;
            // ylist = Helper.yearlist();
            // CmbYear.ItemsSource = ylist;
            // screenfont(Helper.screensize());
            List<BLSelfEmployed> emplist = BLSelfEmployed.SelfEmployedCollection().ToList();
            emplist = emplist.Where(x => x.EmployeeID == CompanyId).ToList();
            SSNofEmp = emplist.Count > 0 ? emplist.FirstOrDefault().SocSecNum : null;
            var data = load_dashboard(SSNofEmp);
            
            //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
            if(data != null)
            {
                ResponseModel.Status = true;
                ResponseModel.Data = data;
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
        private List<C3HeaderVM> load_dashboard(string SSNofEmp)
        {
            List<C3Header> listDVOC3Header = new List<C3Header>();
            try
            {

                SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
                SqlCommand cmd = new SqlCommand("Get_PROCESS_Self_Employed_C3_Genrated_data", staticConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@SSN", SqlDbType.Int, 50, ParameterDirection.Input, false, 10, 0, "", DataRowVersion.Proposed, (object)SSNofEmp ?? (object)DBNull.Value));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sqlAdapter.Fill(dt);
                if (dt.Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Rows)
                    {
                        //bool issubmited = Convert.IsDBNull(row["Is_Fianalize"]) ? false : bool.Parse(row["Is_Fianalize"].ToString());
                        //bool isfinalize = Convert.IsDBNull(row["Is_submitted"]) ? false : bool.Parse(row["Is_Fianalize"].ToString());
                        //if (issubmited == true || isfinalize == true)
                        //{
                        C3Header Obj = new C3Header();
                        Obj.HeaderID = Convert.IsDBNull(row["SEC3ID"]) ? 0 : int.Parse(row["SEC3ID"].ToString());
                        Obj.RegNo = Convert.IsDBNull(row["SSN"]) ? null : row["SSN"].ToString();
                        Obj.period_Month = Convert.IsDBNull(row["PERIODD_MONTH"]) || row["PERIODD_MONTH"].ToString() == string.Empty ? null : MonthName(row["PERIODD_MONTH"].ToString());
                        Obj.Period_year = Convert.IsDBNull(row["PERIOD_YEAR"]) || row["PERIOD_YEAR"].ToString() == string.Empty ? null : row["PERIOD_YEAR"].ToString();
                        Obj.TOTAL_WAGES = Convert.IsDBNull(row["TOTAL_WAGES"]) ? decimal.Parse(String.Format("{0:0.00}", 0.00)) : decimal.Parse(String.Format("{0:0.00}", decimal.Parse(row["TOTAL_WAGES"].ToString())));
                        Obj.TOTALSSCONTRIBUTIONS = Convert.IsDBNull(row["TOTAL_CONTRIBUTIONS"]) ? decimal.Parse(String.Format("{0:0.00}", 0.00)) : decimal.Parse(String.Format("{0:0.00}", decimal.Parse(row["TOTAL_CONTRIBUTIONS"].ToString())));
                        Obj.TOTALSSPENALTY = Convert.IsDBNull(row["TOTAL_Fine"]) ? decimal.Parse(String.Format("{0:0.00}", 0.00)) : decimal.Parse(row["TOTAL_Fine"].ToString());
                        Obj.TOTALSSCONTRIBUTIONS = Obj.TOTALSSCONTRIBUTIONS + Obj.TOTALSSPENALTY;
                        Obj.Insert_Datetimeinfo = Convert.IsDBNull(row["Insert_Datetimeinfo"]) ? null : DateTime.Parse(row["Insert_Datetimeinfo"].ToString()).ToString(Helper.DisplayDateFormat);
                        Obj.Is_Fianalize = Convert.IsDBNull(row["Is_Fianalize"]) ? false : bool.Parse(row["Is_Fianalize"].ToString());
                        Obj.Is_submitted = Convert.IsDBNull(row["Is_Fianalize"]) ? false : bool.Parse(row["Is_submitted"].ToString());
                        Obj.C3_IsFinalized = !Obj.C3_IsFinalized;
                        Obj.IssubmittedShow = (bool)Obj.Is_submitted ? "C3 Submitted" : "C3 Not Submitted";
                        Obj.Issubmittedcolor = (bool)Obj.Is_submitted ? "Black" : "Red";
                        Obj.IssubmittedShowimg = (bool)Obj.Is_submitted ? "/img/RightSine.png" : "/img/close.png";
                        listDVOC3Header.Add(Obj);
                        //}
                    }

                    //dashboard_list.ItemsSource = listDVOC3Header;
                    //dashboard_list.SelectedIndex = -1;
                }
                else
                { 
                    //dashboard_list.ItemsSource = null;
                    
                    return null;
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
            var list1 = listDVOC3Header.Select(e => new C3HeaderVM
            {
                TOTAL_WAGES = e.TOTAL_WAGES,
                TOTALSSCONTRIBUTIONS = e.TOTALSSCONTRIBUTIONS,
                period_Month = e.period_Month,
                Period_year = e.P_year.ToString(),
                Insert_Datetimeinfo = e.Insert_Datetimeinfo
            }).ToList();

            return list1;
        }
        private string MonthName(string m_no)
        {
            string Month = "";
            switch (m_no)
            {
                case "0":
                    Month = "January";
                    break;
                case "1":
                    Month = "February";
                    break;
                case "2":
                    Month = "March";
                    break;
                case "3":
                    Month = "April";
                    break;
                case "4":
                    Month = "May";
                    break;
                case "5":
                    Month = "June";
                    break;
                case "6":
                    Month = "July";
                    break;
                case "7":
                    Month = "August";
                    break;
                case "8":
                    Month = "September";
                    break;
                case "9":
                    Month = "October";
                    break;
                case "10":
                    Month = "November";
                    break;
                case "11":
                    Month = "December";
                    break;
                default:
                    Month = string.Empty;
                    break;
            }
            return Month;
        }
        public async Task<ResponseModel> SelfImportLastC3(string email, string password, string companyid, int userid,int SEC3ID=0)
        {
            if (ConnectionInfom.HasConnection() && ConnectionInfom.APIConnection(_configuration))
            {
                //if (ConnectionInfom.HasConnection() && ConnectionInfom.APIConnection(_configuration))
                //{
                try
                {
                    c3Headerbulk C3Header = new c3Headerbulk();

                    string regn = regno(companyid);
                    //String Newsurl = ConfigurationManager.AppSettings["ServiceUriString"];
                    string Newsurl = _configuration["ServiceConfig:ServiceUriString"];
                    //string NewsURL = Newsurl + "/C3/c3EmpSubmissionBulk";
                    string NewsURL = Newsurl + "/C3/" + regn + "/C3Submitted/SE/1,EE";

                    HttpMessageHandler handler = new HttpClientHandler()
                    {
                    };

                    var httpClient = new HttpClient(handler)
                    {
                        BaseAddress = new Uri(NewsURL),
                        Timeout = new TimeSpan(0, 2, 0)
                    };
                    httpClient.DefaultRequestHeaders.Add("ContentType", "application/json");
                    //This is the key section you were missing    
                    var plainTextBytes = _configuration["EnableBEMAAuthInsteadOfLocal"] == "1" ? System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + ":" + _configuration["ServiceConfig:AuthPass"]) : System.Text.Encoding.UTF8.GetBytes(email + ":" + password);
                    string val = System.Convert.ToBase64String(plainTextBytes);
                    httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + val);
                    HttpResponseMessage response = httpClient.GetAsync(NewsURL).Result;
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        var customerJsonString = await response.Content.ReadAsStringAsync();
                        var C3Header_model = JsonConvert.DeserializeObject<c3Header>(customerJsonString);
                        if (C3Header_model != null)
                        {
                            if (C3Header_model.payerType == "SE")
                            {
                                int paymonth = DateTime.ParseExact(C3Header_model.period, Helper.DateFormat, CultureInfo.InvariantCulture).Month;
                                int payyear = DateTime.ParseExact(C3Header_model.period, Helper.DateFormat, CultureInfo.InvariantCulture).Year;

                                SqlConnection Get_C3staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection;
                                SqlCommand cmdSSN = new SqlCommand("Check_SelfEmployed_C3Created", Get_C3staticConnection);
                                cmdSSN.CommandType = CommandType.StoredProcedure;
                                cmdSSN.Parameters.Add(new SqlParameter("@Month", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)(paymonth - 1) ?? (object)DBNull.Value));
                                cmdSSN.Parameters.Add(new SqlParameter("@Year", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)payyear ?? (object)DBNull.Value));
                                cmdSSN.Parameters.Add(new SqlParameter("@SSN", SqlDbType.Int, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)regn ?? (object)DBNull.Value));

                                cmdSSN.Parameters.Add(new SqlParameter("@SEC3ID", SqlDbType.Int, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)SEC3ID ?? (object)DBNull.Value));
                                SqlDataAdapter sqlAdapterSSN = new SqlDataAdapter(cmdSSN);
                                DataTable dtSSN = new DataTable();
                                sqlAdapterSSN.Fill(dtSSN);
                                if (dtSSN.Rows.Count == 0)
                                {
                                    //String Emp_surl = ConfigurationManager.AppSettings["ServiceUriString"];
                                    string Emp_surl = _configuration["ServiceConfig:ServiceUriString"];
                                    string Emp_sURL = Emp_surl + "/C3/" + C3Header_model.payerId + "/C3Submitted/" + paymonth + "," + payyear + "," + C3Header_model.sequenceNo + "," + C3Header_model.payerType;
                                    HttpMessageHandler gethandler = new HttpClientHandler()
                                    {
                                    };
                                    var gethttpClient = new HttpClient(gethandler)
                                    {
                                        BaseAddress = new Uri(Emp_sURL),
                                        Timeout = new TimeSpan(0, 2, 0)
                                    };
                                    gethttpClient.DefaultRequestHeaders.Add("ContentType", "application/json");
                                    //This is the key section you were missing    
                                    var getplainTextBytes = _configuration["EnableBEMAAuthInsteadOfLocal"] == "1" ? System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + ":" + _configuration["ServiceConfig:AuthPass"]) : System.Text.Encoding.UTF8.GetBytes(email + ":" + password);
                                    string getval = System.Convert.ToBase64String(getplainTextBytes);
                                    gethttpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + getval);
                                    HttpResponseMessage getresponse = httpClient.GetAsync(Emp_sURL).Result;
                                    if (getresponse.StatusCode == HttpStatusCode.OK)
                                    {
                                        var getcustomerJsonString = await getresponse.Content.ReadAsStringAsync();
                                        var submitC3_model = JsonConvert.DeserializeObject<submitC3string>(getcustomerJsonString);
                                        if (submitC3_model != null)
                                        {
                                            submitC3string subc3 = new submitC3string();
                                            subc3.c3Header = submitC3_model.c3Header;
                                            subc3.ipWages = submitC3_model.ipWages;
                                            SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
                                            if (subc3.c3Header.receivedBy == "c3svc" || (subc3.c3Header.receivedBy != "c3svc" && subc3.c3Header.c3Status == "VAC"))
                                            {
                                                int islocked = 0;
                                                if (subc3.c3Header.receivedBy != "c3svc" && subc3.c3Header.c3Status == "VAC")
                                                {
                                                    islocked = 1;
                                                }
                                                if (subc3.c3Header != null && subc3.ipWages != null)
                                                {
                                                    if (staticConnection.State == ConnectionState.Open)
                                                    {
                                                        staticConnection.Close();
                                                    }
                                                    SqlCommand insertC3Header = null;
                                                    foreach (var ipWages in subc3.ipWages)
                                                    {
                                                        insertC3Header = new SqlCommand("INSERT [dbo].[PROCESS_Self_EmployedC3]([SSN],  [PERIODD_MONTH],[PERIOD_YEAR],[TOTAL_WAGES], [TOTAL_CONTRIBUTIONS],[TOTAL_Fine],[Category_Type], [WAGES1]," +
                                                                                          "[WAGES2], [WAGES3], [WAGES4],[WAGES5],[SelectedTypeWEEK1],[SelectedTypeWEEK2],[SelectedTypeWEEK3],[SelectedTypeWEEK4],[SelectedTypeWEEK5],[WEEK1],[WEEK2]," +
                                                                                          "[WEEK3], [WEEK4], [WEEK5], [Remarks], [Insert_Datetimeinfo],[Schedule_NO],[Is_Fianalize], [Is_submitted])" +
                                                                                          "VALUES(" + subc3.c3Header.payerId + "," + (paymonth - 1) + "," + payyear + "," +
                                                                                          (decimal.Parse(ipWages.wagesPaid1) + decimal.Parse(ipWages.wagesPaid2) + decimal.Parse(ipWages.wagesPaid3) + decimal.Parse(ipWages.wagesPaid4) + decimal.Parse(ipWages.wagesPaid5) + decimal.Parse(ipWages.wagesPaid6) + decimal.Parse(ipWages.wagesPaid7)) +
                                                                                          "," + decimal.Parse(subc3.c3Header.calcEmpSsAmt) + "," + decimal.Parse(subc3.c3Header.totalEmpSsFines) + ", ''," + decimal.Parse(ipWages.wagesPaid1) + "," + decimal.Parse(ipWages.wagesPaid2) + "," + decimal.Parse(ipWages.wagesPaid3) + "," + decimal.Parse(ipWages.wagesPaid4) + "," + decimal.Parse(ipWages.wagesPaid5) + "," +
                                                                                          ipWages.paidCode1 + "," + ipWages.paidCode2 + "," + ipWages.paidCode3 + "," + ipWages.paidCode4 + "," + ipWages.paidCode5 + "," +
                                                                                          ipWages.paidCode1 + "," + ipWages.paidCode2 + "," + ipWages.paidCode3 + "," + ipWages.paidCode4 + "," + ipWages.paidCode5 + ",''," + DateTime.Now.ToShortDateString() + "," + subc3.c3Header.sequenceNo + "," + 1 + "," + 1 + "," + islocked + "," + userid + "," + userid + ",'" + Helper.MachineInfo + "'," + 0 + "," + 0 + "," + 1 + ",'" + subc3.c3Header.submittedByName + "','',''," + subc3.c3Header.dateReceived + ")", staticConnection);
                                                    }
                                                    if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                                                    int insert = insertC3Header != null ? insertC3Header.ExecuteNonQuery() : 0;
                                                    staticConnection.Close();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                        //C3WizardMessageBox.Show("C3 Wizard", "Submitted Last C3 imported successfully");
                        //btn_Search_Click(sender, e);

                    }
                    else
                    {
                        //var customerJsonString = await response.Content.ReadAsStringAsync();
                        //var Emp_model = JsonConvert.DeserializeObject<Apistatus>(customerJsonString);
                        //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                        //C3WizardMessageBox.Show("C3 Wizard", Emp_model.message);

                        //
                    }
                    ResponseModel.Status=true;
                    ResponseModel.Message = "Data imported successfully";
                    ResponseModel.Statuscode = 200;
                    return ResponseModel;
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
                    ResponseModel.Status = false;
                    ResponseModel.Message = "Check your internet connection OR the server may not be responding. Please try again later or contact support.";
                    ResponseModel.Statuscode = 400;
                    return ResponseModel;
                }

            }
            else
            {
                //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                //C3WizardMessageBox.Show("C3 Wizard", "Check your internet connection OR May server not responding.\nplease try after sometime or contact S.S.B for any assistance.");
                ResponseModel.Status = false;
                ResponseModel.Message = "Check your internet connection OR the server may not be responding. Please try again later or contact support.";
                ResponseModel.Statuscode = 400;
                return ResponseModel;
            }
        }
        public async Task<ResponseModel> SelfDownloadSubmittedC3(string email, string password, string companyid, int userid, int fmonths, int tomonths, int year, int SEC3ID=0)
        {
            if (ConnectionInfom.HasConnection() && ConnectionInfom.APIConnection(_configuration))
            {

                try
                {
                    List<c3Headerbulk> C3Header = new List<c3Headerbulk>();

                    int F_month = fmonths;
                    //int F_month = CmbFromMonth.SelectedIndex;
                    int T_month = tomonths;
                    //int T_month = CmbToMonth.SelectedIndex;
                    // ComboBoxItem year = (ComboBoxItem)CmbYear.SelectedItem;
                    string value = year != null ? year.ToString() : null;
                    string S_year = year != 0 ? value : null;
                    string statedate = "01-" + (F_month + 1) + "-" + S_year;
                    string enddate = "01-" + (T_month + 1) + "-" + S_year;
                    string regn = regno(companyid);
                    //String Newsurl = ConfigurationManager.AppSettings["ServiceUriString"];
                    string Newsurl = _configuration["ServiceConfig:ServiceUriString"];
                    //string NewsURL = Newsurl + "/C3/c3EmpSubmissionBulk";
                    string NewsURL = Newsurl + "/C3/" + regn + "/C3Submitted/SE/range/" + statedate + "/" + enddate + ",EE";

                    HttpMessageHandler handler = new HttpClientHandler()
                    {
                    };

                    var httpClient = new HttpClient(handler)
                    {
                        BaseAddress = new Uri(NewsURL),
                        Timeout = new TimeSpan(0, 2, 0)
                    };
                    httpClient.DefaultRequestHeaders.Add("ContentType", "application/json");
                    //This is the key section you were missing    
                    var plainTextBytes = _configuration["EnableBEMAAuthInsteadOfLocal"] == "1" ? System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + ":" + _configuration["ServiceConfig:AuthPass"]) : System.Text.Encoding.UTF8.GetBytes(email + ":" + password);
                    string val = System.Convert.ToBase64String(plainTextBytes);
                    httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + val);
                    HttpResponseMessage response = httpClient.GetAsync(NewsURL).Result;
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        var customerJsonString = await response.Content.ReadAsStringAsync();
                        var C3Header_model = JsonConvert.DeserializeObject<List<c3Header>>(customerJsonString);
                        C3Header_model = C3Header_model.Where(x => x.payerType == "SE").ToList();
                        if (C3Header_model != null)
                        {
                            foreach (var header in C3Header_model)
                            {
                                if (header.receivedBy == "c3svc" || (header.receivedBy != "c3svc" && header.c3Status == "VAC"))
                                {
                                    int islocked = 0;
                                    if (header.receivedBy != "c3svc" && header.c3Status == "VAC")
                                    {
                                        islocked = 1;
                                    }
                                    int paymonth = DateTime.ParseExact(header.period, Helper.DateFormat, CultureInfo.InvariantCulture).Month;
                                    int payyear = DateTime.ParseExact(header.period, Helper.DateFormat, CultureInfo.InvariantCulture).Year;

                                    SqlConnection Get_C3staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection;
                                    SqlCommand cmdSSN = new SqlCommand("Check_SelfEmployed_C3Created", Get_C3staticConnection);
                                    cmdSSN.CommandType = CommandType.StoredProcedure;
                                    cmdSSN.Parameters.Add(new SqlParameter("@Month", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)(paymonth - 1) ?? (object)DBNull.Value));
                                    cmdSSN.Parameters.Add(new SqlParameter("@Year", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)payyear ?? (object)DBNull.Value));
                                    cmdSSN.Parameters.Add(new SqlParameter("@SSN", SqlDbType.Int, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)regn ?? (object)DBNull.Value));

                                    cmdSSN.Parameters.Add(new SqlParameter("@SEC3ID", SqlDbType.Int, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)SEC3ID ?? (object)DBNull.Value));
                                    SqlDataAdapter sqlAdapterSSN = new SqlDataAdapter(cmdSSN);
                                    DataTable dtSSN = new DataTable();
                                    sqlAdapterSSN.Fill(dtSSN);
                                    if (dtSSN.Rows.Count == 0)
                                    {
                                        //String Emp_surl = ConfigurationManager.AppSettings["ServiceUriString"];
                                        string Emp_surl = _configuration["ServiceConfig:ServiceUriString"];
                                        string Emp_sURL = Emp_surl + "/C3/" + header.payerId + "/C3Submitted/" + paymonth + "," + payyear + "," + header.sequenceNo + "," + header.payerType + ",EE";
                                        HttpMessageHandler gethandler = new HttpClientHandler()
                                        {
                                        };
                                        var gethttpClient = new HttpClient(gethandler)
                                        {
                                            BaseAddress = new Uri(Emp_sURL),
                                            Timeout = new TimeSpan(0, 2, 0)
                                        };
                                        gethttpClient.DefaultRequestHeaders.Add("ContentType", "application/json");
                                        //This is the key section you were missing    
                                        var getplainTextBytes = _configuration["EnableBEMAAuthInsteadOfLocal"] == "1" ? System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + ":" + _configuration["ServiceConfig:AuthPass"]) : System.Text.Encoding.UTF8.GetBytes(email + ":" + password);
                                        string getval = System.Convert.ToBase64String(getplainTextBytes);
                                        gethttpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + getval);
                                        HttpResponseMessage getresponse = httpClient.GetAsync(Emp_sURL).Result;
                                        if (getresponse.StatusCode == HttpStatusCode.OK)
                                        {
                                            var getcustomerJsonString = await getresponse.Content.ReadAsStringAsync();
                                            var submitC3_model = JsonConvert.DeserializeObject<submitC3string>(getcustomerJsonString);
                                            if (submitC3_model != null)
                                            {
                                                submitC3string subc3 = new submitC3string();
                                                subc3.c3Header = submitC3_model.c3Header;
                                                subc3.ipWages = submitC3_model.ipWages;
                                                SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
                                                if (subc3.c3Header != null && subc3.ipWages != null)
                                                {
                                                    if (staticConnection.State == ConnectionState.Open)
                                                    {
                                                        staticConnection.Close();
                                                    }
                                                    SqlCommand insertC3Header = null;
                                                    foreach (var ipWages in subc3.ipWages)
                                                    {
                                                        insertC3Header = new SqlCommand("INSERT [dbo].[PROCESS_Self_EmployedC3]([SSN],  [PERIODD_MONTH],[PERIOD_YEAR],[TOTAL_WAGES], [TOTAL_CONTRIBUTIONS],[TOTAL_Fine],[Category_Type], [WAGES1]," +
                                                                                          "[WAGES2], [WAGES3], [WAGES4],[WAGES5],[SelectedTypeWEEK1],[SelectedTypeWEEK2],[SelectedTypeWEEK3],[SelectedTypeWEEK4],[SelectedTypeWEEK5],[WEEK1],[WEEK2]," +
                                                                                          "[WEEK3], [WEEK4], [WEEK5], [Remarks], [Insert_Datetimeinfo],[Schedule_NO],[Is_Fianalize], [Is_submitted],[C3_IsFinalized],[IsUnLocked],[Inserted_By],[Modified_By],[Modified_Machineinfo] ,[Print_By],[Export_By],[IsImportFromBEMA],[UserName],[Modified_On],[Export_On],C3_SubmittedDate)" +
                                                                                          "VALUES(" + subc3.c3Header.payerId + "," + (paymonth - 1) + "," + payyear + "," +
                                                                                          (decimal.Parse(ipWages.wagesPaid1) + decimal.Parse(ipWages.wagesPaid2) + decimal.Parse(ipWages.wagesPaid3) + decimal.Parse(ipWages.wagesPaid4) + decimal.Parse(ipWages.wagesPaid5) + decimal.Parse(ipWages.wagesPaid6) + decimal.Parse(ipWages.wagesPaid7)) +
                                                                                          "," + decimal.Parse(subc3.c3Header.calcEmpSsAmt) + "," + decimal.Parse(subc3.c3Header.totalEmpSsFines) + ", ''," + decimal.Parse(ipWages.wagesPaid1) + "," + decimal.Parse(ipWages.wagesPaid2) + "," + decimal.Parse(ipWages.wagesPaid3) + "," + decimal.Parse(ipWages.wagesPaid4) + "," + decimal.Parse(ipWages.wagesPaid5) + "," +
                                                                                          ipWages.paidCode1 + "," + ipWages.paidCode2 + "," + ipWages.paidCode3 + "," + ipWages.paidCode4 + "," + ipWages.paidCode5 + "," +
                                                                                          ipWages.paidCode1 + "," + ipWages.paidCode2 + "," + ipWages.paidCode3 + "," + ipWages.paidCode4 + "," + ipWages.paidCode5 + ",''," + DateTime.Now.ToShortDateString() + "," + subc3.c3Header.sequenceNo + "," + 1 + "," + 1 + "," + 1 + "," + islocked + "," + userid + "," + userid + ",'" + Helper.MachineInfo + "'," + 0 + "," + 0 + "," + 1 + ",'" + subc3.c3Header.submittedByName + "','',''," + subc3.c3Header.dateReceived + ")", staticConnection);
                                                    }
                                                    if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                                                    int insert = insertC3Header != null ? insertC3Header.ExecuteNonQuery() : 0;
                                                    staticConnection.Close();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                        //C3WizardMessageBox.Show("C3 Wizard", "Submitted C3 imported successfully");
                        //btn_Search_Click(sender, e);
                    }
                    else
                    {
                        //var customerJsonString = await response.Content.ReadAsStringAsync();
                        //var Emp_model = JsonConvert.DeserializeObject<Apistatus>(customerJsonString);
                        //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                        //C3WizardMessageBox.Show("C3 Wizard", Emp_model.message);

                        //
                    }
                    ResponseModel.Status = true;
                    ResponseModel.Message = "Data imported successfully";
                    ResponseModel.Statuscode = 200;
                    return ResponseModel;
                }
                catch (Exception ex)
                {
                    //Login login = new Login();
                    //login.Error_Log(ex.Message);
                    ResponseModel.Status = false;
                    ResponseModel.Message = "Check your internet connection OR the server may not be responding. Please try again later or contact support.";
                    ResponseModel.Statuscode = 400;
                    return ResponseModel;
                }

            }

            else
            {
                //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                //C3WizardMessageBox.Show("C3 Wizard", "Check your internet connection OR May server not responding.\nplease try after sometime or contact S.S.B for any assistance.");
                ResponseModel.Status = false;
                ResponseModel.Message = "Check your internet connection OR the server may not be responding. Please try again later or contact support.";
                ResponseModel.Statuscode = 400;
                return ResponseModel;
            }
        }
        private string regno(string companyid)
        {
            SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
            SqlCommand CurrentCompany = new SqlCommand("SELECT mc.EmployeeID, mc.Soc_Sec_Num,mc.Last_Name,mc.First_Name, mc.Address1, mc.Address2, mc.City, mc.State, mc.ZIP, C.Name FROM SelfEmployee mc, Country c WHERE mc.Isactive = 1 And mc.EmployeeID = " + companyid + " And mc.Country=cast(c.ConId as int)", staticConnection);
            if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
            SqlDataReader dr = CurrentCompany.ExecuteReader();
            string companyid_str = "", RegNo = "", Address = "", CompanyLogo = "";
            while (dr.Read())
            {
                companyid_str = dr["EmployeeID"].ToString();
                List<BLSelfEmployed> emplist = BLSelfEmployed.SelfEmployedCollection().ToList();
                emplist = emplist.Where(x => x.EmployeeID == Convert.ToInt32(companyid)).ToList();
                RegNo = emplist.Count > 0 ? emplist.FirstOrDefault().SocSecNum : null;
                Address = dr["Address1"].ToString() + " " + dr["City"].ToString() + " " + dr["State"].ToString() + " " + dr["Name"].ToString() + " " + dr["ZIP"].ToString();
            }
            staticConnection.Close();

            return RegNo;
        }
        public async Task<List<SelfEmployedReport>> GenerateSelfEmployedReport(string month, string year, int? sec3Id)
        {
            List<SelfEmployedReport> reports = new List<SelfEmployedReport>();
            
            using (SqlConnection connection = C3WizardLayerConn_BaseData.StaticSqlConnection)
            {
                await connection.OpenAsync();
                using (SqlCommand cmd = new SqlCommand("Generate_Self_Employed_C3_Report", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Month", month ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Year", year ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@SEC3ID", sec3Id ?? (object)DBNull.Value);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            reports.Add(new SelfEmployedReport
                            {
                                Id = reader.GetInt32(0),
                                Name = reader.GetString(1),
                                CompanyAddress =reader.GetString(2)
                            });
                        }
                    }
                }
            }

            return reports;
        }
        public async Task<ResponseModel> GetUSERAUDITTRAIL(int CompanyId)
        {
            List<BLSECUsers> userlist = new List<BLSECUsers>();
            BLMasterEmployee blemp = new BLMasterEmployee();
            userlist = BLSECUsers.SECUsersCollection_gridnew(CompanyId).ToList();
            List<BLSelfEmployed> emplist = BLSelfEmployed.SelfEmployedCollection().ToList();
            emplist = emplist.Where(x => x.EmployeeID == CompanyId).ToList();
            string SSNofEmp = emplist.Count > 0 ? emplist.FirstOrDefault().SocSecNum : null;
            SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
            List<C3Header> listDVOC3Header = new List<C3Header>();
            SqlConnection Director_staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection;
            if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
            SqlCommand Director_cmd = new SqlCommand("Get_PROCESS_Self_Employed_C3_Genrated_data", staticConnection);
            Director_cmd.CommandType = CommandType.StoredProcedure;
            Director_cmd.Parameters.Add(new SqlParameter("@SSN", SqlDbType.Int, 50, ParameterDirection.Input, false, 10, 0, "", DataRowVersion.Proposed, (object)SSNofEmp ?? (object)DBNull.Value));
            
            SqlDataAdapter Director_sqlAdapter = new SqlDataAdapter(Director_cmd);
            DataTable Director_dt = new DataTable();
            Director_sqlAdapter.Fill(Director_dt);
            if (Director_dt.Rows.Count > 0)
            {
                foreach (DataRow row in Director_dt.Rows)
                {
                    bool locked = Convert.IsDBNull(row["IsUnLocked"]) ? false : bool.Parse(row["IsUnLocked"].ToString());
                    bool isimportedbema = Convert.IsDBNull(row["IsImportFromBEMA"]) ? false : bool.Parse(row["IsImportFromBEMA"].ToString());
                    if (!locked && !isimportedbema)
                    {
                        C3Header Obj = new C3Header();
                        Obj.HeaderID = Convert.IsDBNull(row["SEC3ID"]) ? 0 : int.Parse(row["SEC3ID"].ToString());
                        Obj.RegNo = Convert.IsDBNull(row["SSN"]) ? null : row["SSN"].ToString();
                        Obj.period_Month = Convert.IsDBNull(row["PERIODD_MONTH"]) || row["PERIODD_MONTH"].ToString() == string.Empty ? null : MonthName(row["PERIODD_MONTH"].ToString());
                        Obj.Period_year = Convert.IsDBNull(row["PERIOD_YEAR"]) || row["PERIOD_YEAR"].ToString() == string.Empty ? null : row["PERIOD_YEAR"].ToString();
                        Obj.TOTAL_WAGES = Convert.IsDBNull(row["TOTAL_WAGES"]) ? decimal.Parse(String.Format("{0:0.00}", 0.00)) : decimal.Parse(String.Format("{0:0.00}", decimal.Parse(row["TOTAL_WAGES"].ToString())));
                        Obj.TOTALSSCONTRIBUTIONS = Convert.IsDBNull(row["TOTAL_CONTRIBUTIONS"]) ? decimal.Parse(String.Format("{0:0.00}", 0.00)) : decimal.Parse(String.Format("{0:0.00}", decimal.Parse(row["TOTAL_CONTRIBUTIONS"].ToString())));
                        Obj.TOTALSSPENALTY = Convert.IsDBNull(row["TOTAL_Fine"]) ? decimal.Parse(String.Format("{0:0.00}", 0.00)) : decimal.Parse(row["TOTAL_Fine"].ToString());
                        Obj.Insert_Datetimeinfo = Convert.IsDBNull(row["Insert_Datetimeinfo"]) ? null : DateTime.Parse(row["Insert_Datetimeinfo"].ToString()).ToString(Helper.DisplayDateFormat);
                        Obj.Is_Fianalize = Convert.IsDBNull(row["Is_Fianalize"]) ? false : bool.Parse(row["Is_Fianalize"].ToString());
                        Obj.Is_submitted = Convert.IsDBNull(row["Is_submitted"]) ? false : bool.Parse(row["Is_submitted"].ToString());
                        Obj.C3_IsFinalized = Convert.IsDBNull(row["C3_IsFinalized"]) ? false : bool.Parse(row["C3_IsFinalized"].ToString());
                        Obj.C3_SubmittedBy = Convert.IsDBNull(row["C3_SubmittedBy"]) ? 0 : int.Parse(row["C3_SubmittedBy"].ToString());
                        //Obj.C3_SubmittedByName = Obj.C3_SubmittedBy > 0 ? User_Name : null; //Obj.C3_SubmittedBy > 0 ? userlist.Any(x => x.UserId == Obj.C3_SubmittedBy) ? userlist.FirstOrDefault(x => x.UserId == Obj.C3_SubmittedBy).FirstName : null : null;
                        Obj.C3_SubmittedByName = Obj.C3_SubmittedBy > 0 ? userlist.Any(x => x.UserId == Obj.C3_SubmittedBy) ? userlist.FirstOrDefault(x => x.UserId == Obj.C3_SubmittedBy).FirstName : null : null;
                        Obj.C3_SubmittedDate = Convert.IsDBNull(row["C3_SubmittedDate"]) ? null : ((DateTime)row["C3_SubmittedDate"]).ToString("dd-MM-yyyy");
                        Obj.C3_SubmittedDate = Obj.C3_SubmittedDate == "01-01-1900" ? null : Obj.C3_SubmittedDate;
                        Obj.Insert_Datetimeinfo = Convert.IsDBNull(row["Insert_Datetimeinfo"]) ? null : ((DateTime)row["Insert_Datetimeinfo"]).ToString("dd-MM-yyyy");
                        Obj.Insert_Datetimeinfo = Obj.Insert_Datetimeinfo == "01-01-1900" ? null : Obj.Insert_Datetimeinfo;
                        Obj.Inserted_By = Convert.IsDBNull(row["Inserted_By"]) ? 0 : int.Parse(row["Inserted_By"].ToString());
                        //Obj.Inserted_ByName = Obj.Inserted_By > 0 ? User_Name : null; //Obj.Inserted_By > 0 ? userlist.Any(x => x.UserId == Obj.Inserted_By) ? userlist.FirstOrDefault(x => x.UserId == Obj.Inserted_By).FirstName : null : null;
                        Obj.Inserted_ByName = Obj.Inserted_By > 0 ? userlist.Any(x => x.UserId == Obj.Inserted_By) ? userlist.FirstOrDefault(x => x.UserId == Obj.Inserted_By).FirstName : null : null;
                        Obj.Modified_On = Convert.IsDBNull(row["Modified_On"]) ? null : ((DateTime)row["Modified_On"]).ToString("dd-MM-yyyy");
                        Obj.Modified_On = Obj.Modified_On == "01-01-1900" ? null : Obj.Modified_On;
                        Obj.Modified_By = Convert.IsDBNull(row["Modified_By"]) ? 0 : int.Parse(row["Modified_By"].ToString());
                        //Obj.Modified_ByName = Obj.Modified_By > 0 ? User_Name : null; //Obj.Modified_By > 0 ? userlist.Any(x => x.UserId == Obj.Modified_By) ? userlist.FirstOrDefault(x => x.UserId == Obj.Modified_By).FirstName : null : null;
                        Obj.Modified_ByName = Obj.Modified_By > 0 ? userlist.Any(x => x.UserId == Obj.Modified_By) ? userlist.FirstOrDefault(x => x.UserId == Obj.Modified_By).FirstName : null : null;
                        Obj.IssubmittedShow = (bool)Obj.Is_submitted ? "C3 Submitted" : "C3 Not Submitted";
                        Obj.Issubmittedcolor = (bool)Obj.Is_submitted ? "Black" : "Red";
                        Obj.IssubmittedShowimg = (bool)Obj.Is_submitted ? "/img/RightSine.png" : "/img/close.png";
                        Obj.C3submittedShow = (bool)Obj.Is_submitted ? "Resubmit C3" : "Submit C3";
                        Obj.C3submittedShowimg = (bool)Obj.Is_submitted ? "/Images/restore.png" : "/Images/finalyze20x20.png";
                        listDVOC3Header.Add(Obj);
                    }
                }
            }

            //C3EmpUserAuditTrail.ItemsSource = listDVOC3Header;
            //C3EmpUserAuditTrail.SelectedIndex = -1;
            //var list1 = listDVOC3Header.Select(e => new C3HeaderVM
            //{
            //    TOTAL_WAGES = e.TOTAL_WAGES,
            //    TOTALSSCONTRIBUTIONS = e.TOTALSSCONTRIBUTIONS,
            //    period_Month = e.period_Month,
            //    Period_year = e.P_year.ToString(),
            //    Insert_Datetimeinfo = e.Insert_Datetimeinfo
            //}).ToList();
            var list1 = listDVOC3Header.Select(e => new C3HeaderSelfUserManagementVM
            {
                period = e.period_Month,
                totalWages = e.TOTAL_WAGES,
                contribution = e.TOTALSSCONTRIBUTIONS,
                insertedOn = e.Insert_Datetimeinfo,
                insertedBy = e.Inserted_ByName,
                lastModifiedOn = e.Modified_On,
                lastModifiedBy = e.Modified_ByName,
                lastSubmittedOn = e.C3_SubmittedDate,
                lastSubmittedBy = e.C3_SubmittedByName
            }).ToList();

            ResponseModel.Status = true;
            ResponseModel.Message = "Data get successfully";
            ResponseModel.Data=list1;
            ResponseModel.Statuscode= 200;
            staticConnection.Close();
            return ResponseModel;
            //return Ok(list1);
        }
        public List<AuditDetailsVM> LogList(int? UserId)
        {
            //int userId = AppUserManager.GetUserId();
            var data = (from a in _context.AuditLogs
                       join us in _context.Secusers on a.CreatedBy equals us.UserId into u
                        from us in u.DefaultIfEmpty()
                        where a.IsActive && UserId == a.CreatedBy
                        select new AuditDetailsVM()
                        {
                            EventType = a.EventType,
                            TableName = a.TableName,
                            ColumnName = a.ColumnName,
                            OldValue = a.OldValue,
                            NewValue = a.NewValue,
                            Url = a.Url,
                            Controller = a.Controller,
                            Action = a.Action,
                            Area = a.Area,
                            IPAddress = a.Ipaddress,
                            RecordId = a.RecordId??0,
                            CreatedBy = a.CreatedBy??0,
                            CreatedOn = a.CreatedOn,
                            ModifiedBy = a.ModifiedBy??0,
                            ModifiedOn = a.ModifiedOn,
                            IsActive = a.IsActive,
                            Id = a.Id,
                            UserName = us != null ? us.FirstName + " " + us.LastName : "",
                        }).ToList();
            return data;
        }



    public static Dictionary<string, object>? TryFixAndParse(string input)
    {
      if (string.IsNullOrWhiteSpace(input) || input.ToLower() == "null")
        return null;

      try
      {
        return JsonConvert.DeserializeObject<Dictionary<string, object>>(input);
        //return input;
      }
      catch (JsonReaderException)
      {
        try
        {
          
          string fixedJson = FixCommonIssues(input);

          return JsonConvert.DeserializeObject<Dictionary<string, object>>(fixedJson);
          //return fixedJson;
        }
        catch(Exception ex)
        {
                    string controller = "UnknownController";
                    string action = "UnknownAction";
                    var context = ExceptionMiddleware1.GetActionInfo();
                    controller = context.Controller;
                    action = context.Action;
                    LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                    // Still invalid, return null or log
                    return null;
        }
      }
    }

    public  static string FixCommonIssues(string input)
    {
      string output = input;

      // Fix +number to "+number"
      output = Regex.Replace(output, @"(?<key>""[^""]+""\s*:\s*)\+(?<num>\d+)", "${key}\"+${num}\"");

      // Add quotes around unquoted string values after colon (very basic)
      output = Regex.Replace(output, @"(?<key>""[^""]+""\s*:\s*)(\d{10,})", "${key}\"${2}\"");

      return output;
    }
  }
}
