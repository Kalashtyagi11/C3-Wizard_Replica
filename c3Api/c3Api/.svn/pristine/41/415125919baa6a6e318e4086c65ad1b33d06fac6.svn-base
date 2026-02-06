using C3WizardData.Models;
using C3WizardHelper.ViewModels;
using C3WizardLayer.BusinessObjects;
using C3WizardLayer.DataObjects;
using C3WizardRepository.Common;
using C3WizardRepository.Interface;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http2.HPack;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Ocsp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.AspNetCore.Hosting.Internal.HostingApplication;
using static System.Net.Mime.MediaTypeNames;



namespace C3WizardRepository.Repository
{
    public class RepoRegisterCompany
    {
        private readonly C3wizardContext _DbContext;
        private IHostingEnvironment _environment;
        private IConfiguration _configuration;
        HashPassword hashPassword = new HashPassword();
        PasswordAlgorithns EncryptDecryptPassword = new PasswordAlgorithns();
        ResponseModel response = new ResponseModel();

        public RepoRegisterCompany(C3wizardContext c3WizardContext, IHostingEnvironment Environment, IConfiguration configuration)
        {
            this._DbContext = c3WizardContext;
            _environment = Environment;
            _configuration = configuration;


        }
        public string GetIncome_Wages_Catagory_Self_Employed(int index)
        {
            string income = "0.00";
            try
            {
                var dtMRS = _DbContext.WageCategories.ToList();
                if (dtMRS.Count > 0 && dtMRS.Count > index)
                {
                    var weeklyIncome = dtMRS[index].WeeklyIncome;
                    income = weeklyIncome.HasValue ? weeklyIncome.Value.ToString("0.00") : "0.00";
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
                Console.WriteLine($"Error: {ex.Message}");
            }
            return income;
        }
        ///// <summary>
        ///// This method is used to forget password
        ///// </summary>
        ///// <param name="resend"></param>
        ///// <returns></returns>
        //public ResponseModel ForgetPassword(ForgetpasswordVm forgetpassword)
        //{
        //    ResponseModel responseModel = new ResponseModel();
        //    try
        //    {
        //        var data = _DbContext.Secusers.Where(x => x.EmailId == forgetpassword.Email).FirstOrDefault();
        //        if (data != null)
        //        {
        //            string sendotp = new Random().Next(1000, 9999).ToString();
        //            OtpRequest otprequest = new OtpRequest
        //            {
        //                OtpNumber = sendotp,
        //                UserEmail = data.EmailId,
        //                UserId = data.UserId.ToString()
        //            };
        //            _DbContext.OtpRequests.Update(otprequest);
        //            _DbContext.SaveChanges();

        //            var path = _environment.WebRootPath + "\\" + "Email" + "\\" + "ForgetPassword.html";
        //            var FromAddress = new MailAddress("wow.mipl@gmail.com");
        //            var subject = $"Welcome to C3 Wizard, {data.FirstName} {data.MiddleName} {data.LastName}!";
        //            var toaddress = new MailAddress(data.EmailId);
        //            const string frompassword = "pnesduwwkwrheury";

        //            string text = System.IO.File.ReadAllText(path);
        //            StringBuilder sb = new StringBuilder(text);
        //            sb.Replace("UserName", $"{data.FirstName} {data.MiddleName} {data.LastName}");
        //            sb.Replace("Otp", sendotp);
        //            sb.Replace("liveurl", "NarendraTesting");

        //            var smtp = new SmtpClient
        //            {
        //                Host = "smtp.gmail.com",
        //                Port = 587,
        //                EnableSsl = true,
        //                DeliveryMethod = SmtpDeliveryMethod.Network,
        //                UseDefaultCredentials = false,
        //                Credentials = new NetworkCredential(FromAddress.Address, frompassword)
        //            };

        //            using (var message = new MailMessage(FromAddress, toaddress)
        //            {
        //                Subject = subject,
        //                Body = sb.ToString(),
        //                IsBodyHtml = true
        //            })
        //            {
        //                smtp.Send(message);
        //            }

        //            responseModel.Status = true;
        //            responseModel.Message = "OTP sent successfully";
        //            responseModel.Data = otprequest;
        //            responseModel.Statuscode = 200;
        //        }
        //        else
        //        {
        //            responseModel.Status = false;
        //            responseModel.Message = "Email not found";
        //            responseModel.Data = "Data not found";
        //            responseModel.Statuscode = 404;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        responseModel.Status = false;
        //        responseModel.Message = $"An error occurred: {ex.Message}";
        //        responseModel.Data = null;
        //        responseModel.Statuscode = 500;
        //    }
        //    return responseModel;
        //}


        /// <summary>
        /// This method is used to verify otp password
        /// </summary>
        /// <param name="verfiyOTP"></param>
        /// <param name=""></param>
        /// <returns></returns>
        public ResponseModel VerfiyOtpforgetpass(VerfiyOTP verfiyOTP)
        {
            try
            {
                var otpRequest = _DbContext.OtpRequests.Where(x => x.OtpNumber == verfiyOTP.OtpNumber).FirstOrDefault();
                if (otpRequest != null)
                {
                    return new ResponseModel
                    {
                        Status = true,
                        Message = "Otp match successfully",
                        Data = otpRequest,
                        Statuscode = 200,

                    };
                }
                else
                {
                    return new ResponseModel { Status = false, Message = "Otp does not match", Statuscode = 404 };
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
                throw ex;
            }
        }
        public ResponseModel ResetForgetPasswordn(ResetPasswordModel resetPassword)
        {
            var user = _DbContext.Secusers.Where(x => x.EmailId == resetPassword.Email).FirstOrDefault();

            try
            {
                if (user != null)
                {
                    HashPassword hash = new HashPassword();
                    var pass = hash.EncodePasswordToBase64(resetPassword.ConfirmPassword);
                    user.Password = pass;

                    _DbContext.Secusers.Update(user);
                    _DbContext.SaveChanges();

                    response.Status = true;
                    response.Message = "Reset password successfully";
                    response.Data = user;
                    response.Statuscode = 200;
                }
                else
                {
                    response.Status = false;
                    response.Message = "Reset password failed";
                    response.Data = "Data not found";
                    response.Statuscode = 403;
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

                throw;
            }
            return response;
        }

        int compid = 0;
        public async Task<ResponseModel> RegisterCompany(RegisterCompanyVm registerCompanyVm)
        {
            try
            {
                ResponseModel responseModel = new ResponseModel();
                string username, companyname; bool isLocal = false;

                SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection;

                if (staticConnection.State != ConnectionState.Open)
                {
                    await staticConnection.OpenAsync();
                }

                C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
                //await staticConnection.OpenAsync();
                SqlCommand cmd = new SqlCommand("check_company_reg_no", staticConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@REG_NUMBER", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)registerCompanyVm.RegNumber ?? (object)DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Company_Name", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)registerCompanyVm.CompanyName ?? (object)DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@OLD_REG_NUMBER", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)"" ?? (object)DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@OLD_Company_Name", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)"" ?? (object)DBNull.Value));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sqlAdapter.Fill(dt);
                await staticConnection.CloseAsync();
                if (dt.Rows.Count > 0)
                {
                    response.Message = "Entered registration no. is already exists in Company";
                    response.Status = false;
                    response.Data = Array.Empty<object>();
                    //isLocal = true;
                    return response;
                }
                //bool isuserregistered = false;

                try
                {
                    if (ConnectionInfom.HasConnection() && _configuration["IsBEMARegistrationEnabled"] == "1" && ConnectionInfom.APIConnection(_configuration))
                    {
                        compid = 0;
                        try
                        {


                            var reg = new EmployerDeailsModule();
                            reg.payerId = registerCompanyVm.RegNumber.Trim();
                            reg.companyName = Helper.ReplaceCharacter(registerCompanyVm.CompanyName.Trim());
                            reg.tradeName = Helper.ReplaceCharacter(registerCompanyVm.TradeName.Trim());
                            reg.employerType = "ER";
                            reg.contactName = Helper.ReplaceCharacter(registerCompanyVm.ContactPerson.Trim());
                            reg.mobile = registerCompanyVm.Mobile.Trim();
                            reg.phone = registerCompanyVm.Phone.Trim();
                            reg.email = string.IsNullOrEmpty(registerCompanyVm.Email) ? registerCompanyVm.EmailId : registerCompanyVm.Email;
                            reg.address1 = Helper.ReplaceCharacter(registerCompanyVm.Address1.Trim());
                            reg.address2 = Helper.ReplaceCharacter(registerCompanyVm.Address2.Trim());
                            reg.country = registerCompanyVm.Country;
                            reg.postalCode = registerCompanyVm.Zip;
                            reg.city = Helper.ReplaceCharacter(registerCompanyVm.City.Trim());
                            reg.firstName = Helper.ReplaceCharacter(registerCompanyVm.FirstName.Trim());
                            reg.surName = Helper.ReplaceCharacter(registerCompanyVm.LastName.Trim());
                            reg.userName = Helper.ReplaceCharacter(registerCompanyVm.LoginId.Trim());
                            reg.passwordHash = EncryptDecryptPassword.Encrypt(registerCompanyVm.Password.Trim()); // change by rohit
                                                                                                                  //reg.deviceName = Helper.MachineInfo;
                                                                                                                  //reg.deviceIp = Helper.MachineInfo;
                            reg.macDeviceId = "";
                            reg.question1 = registerCompanyVm.Question1;
                            reg.answer1 = Helper.ReplaceCharacter(registerCompanyVm.Answer1);
                            reg.question2 = registerCompanyVm.Question2;
                            reg.answer2 = Helper.ReplaceCharacter(registerCompanyVm.Answer2);
                            reg.userStatus = "A";
                            reg.parentCompanyRegistration = "";
                            String surl = _configuration["ServiceConfig:ServiceUriString"];
                            string sURL = surl + "/User/registerUser";
                            var myContent = JsonConvert.SerializeObject(reg);
                            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
                            var byteContent = new ByteArrayContent(buffer);
                            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                            HttpMessageHandler handler = new HttpClientHandler()
                            {
                            };

                            var httpClient = new HttpClient(handler)
                            {
                                BaseAddress = new Uri(sURL),
                                Timeout = new TimeSpan(0, 2, 0)
                            };
                            httpClient.DefaultRequestHeaders.Add("ContentType", "application/json");
                            //This is the key section you were missing    
                            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + ":" + _configuration["ServiceConfig:AuthPass"]);
                            string val = System.Convert.ToBase64String(plainTextBytes);
                            httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + val);
                            HttpResponseMessage response = httpClient.PutAsync(sURL, byteContent).Result;
                            if (response.StatusCode == HttpStatusCode.OK)
                            {
                                string customerJsonString = await response.Content.ReadAsStringAsync();
                                var Emp_model = JsonConvert.DeserializeObject<Apistatus>(customerJsonString);
                                if (Emp_model.message == "Code       : IUC1000\r\nMessage    : Successfully registered\r\nAddl Info  : An activation code has been sent to your registered email. Please use the activation code to activate your account.")
                                {
                                    responseModel.Message = "Successfully registered.An activation code has been sent to your registered email. Please use the activation code to activate your account...";
                                }
                                else
                                {
                                    responseModel.Message = $"{Emp_model.message}";
                                }
                                responseModel.Data = "Existing User";
                                //if (isLocal==false)
                                //{
                                ResponseModel res = RegisterCompanylocal(registerCompanyVm);
                                //}
                                responseModel.Statuscode = 200;
                                responseModel.Status = true;
                                return responseModel;
                            }
                            else
                            {

                                //string customerJsonString = response.Content.ReadAsStringAsync().ToString();
                                //var Emp_model = JsonConvert.DeserializeObject<Apistatus>(customerJsonString);
                                //responseModel.Message = $"C3 Wizard, {Emp_model.message}";

                                string customerJsonString = await response.Content.ReadAsStringAsync();
                                var Emp_model = JsonConvert.DeserializeObject<Apistatus>(customerJsonString);
                                var msg = Emp_model.message.Split(":");
                                if (isLocal == false && msg[2].Trim().Contains("Already registered with same payerId and EmailId".Trim()))
                                {
                                    ResponseModel res = RegisterCompanylocal(registerCompanyVm);
                                    return res;
                                }
                                else if (isLocal == true && msg[2].Trim().Contains("Already registered with same payerId and EmailId".Trim()))
                                {
                                    responseModel.Message = $"{Emp_model.message}";
                                    responseModel.Statuscode = 400;
                                    responseModel.Status = false;
                                }
                                else
                                {
                                    responseModel.Message = $"{Emp_model.message}";
                                    responseModel.Statuscode = 401;
                                    responseModel.Status = false;
                                }


                                return responseModel;

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
                            responseModel.Message = ex.Message;
                            response.Statuscode = 500;
                            response.Status = false;
                            return response;

                        }
                    }
                    else
                    {
                        ResponseModel res = RegisterCompanylocal(registerCompanyVm);
                        res.auth_token = "local";
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
                    responseModel.Message = ex.Message;
                    response.Statuscode = 500;
                    response.Status = false;
                    return response;


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
                throw ex;
            }
            return response;
        }




        public async Task<string> CheckUserNameExist(string UserName)
        {
            if (UserName == "")
            {
                //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                //C3WizardMessageBox.Show("C3 Wizard", "Please enter user name.");
                return "Please enter user name.";
            }
            else
            {
                DataSet dataSet = new DataSet();
                //string SqlQuerystring = ConfigurationSettings.AppSettings.Get("AppConnection");
                SqlConnection con = C3WizardLayerConn_BaseData.StaticSqlConnection;
                con.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM SecUsers WHERE Isactive=1 And LoginId='" + UserName + "'", con);
                cmd.CommandType = CommandType.Text;
                SqlDataAdapter adapter = new SqlDataAdapter();
                adapter.SelectCommand = cmd;
                adapter.Fill(dataSet);
                con.Close();
                try
                {
                    if (dataSet.Tables[0].Rows.Count > 0)
                    {
                        //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                        //C3WizardMessageBox.Show("C3 Wizard", "User name already exists !");
                        //Txt_UserName.Text = "";
                        return "User name already exists !";
                    }
                    else
                    {
                        //Mouse.OverrideCursor = System.Windows.Input.Cursors.Wait;
                        if (ConnectionInfom.HasConnection() && ConnectionInfom.APIConnection(_configuration))
                        {
                            bool isexist = await IsUserExists(UserName);
                            if (isexist)
                            {
                                //C3WizardMessageBox.Show("C3 Wizard", "User name already exists !");
                                //Txt_UserName.Text = "";
                                return "User name already exists !";
                            }
                        }
                        //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;

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
                    //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                    //Login login = new Login();
                    //login.Error_Log(ex.Message);
                    //C3WizardMessageBox.Show("C3 Wizard", "Error" + ex);
                }
                return "success";
            }
        }

        public async Task<bool> IsUserExists(string UserName)
        {
            try
            {
                String surl = _configuration["ServiceConfig:ServiceUriString"]; ;// ConfigurationManager.AppSettings["ServiceUriString"];
                string sURL = surl + "/User/" + UserName.Trim();
                HttpMessageHandler handler = new HttpClientHandler()
                {
                };
                var httpClient = new HttpClient(handler)
                {
                    BaseAddress = new Uri(sURL),
                    Timeout = new TimeSpan(0, 2, 0)
                };
                httpClient.DefaultRequestHeaders.Add("ContentType", "application/json");
                string authUser = _configuration["ServiceConfig:AuthUser"];
                string authPass = _configuration["ServiceConfig:AuthPass"];
                //This is the key section you were missing    
                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(authUser + ":" + authUser);
                string val = System.Convert.ToBase64String(plainTextBytes);
                httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + val);
                HttpResponseMessage response = httpClient.GetAsync(sURL).Result;
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var customerJsonString = await response.Content.ReadAsStringAsync();
                    if (customerJsonString == "true")
                        return true;
                }
                else
                {
                    return false;
                }

                return false;
            }
            catch (Exception ex)
            {
                string controller = "UnknownController";
                string action = "UnknownAction";
                var context = ExceptionMiddleware1.GetActionInfo();
                controller = context.Controller;
                action = context.Action;
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                // C3WizardMessageBox.Show("C3 Wizard", "" + ex);
                return false;
            }
        }

        public async Task<string> Txt_LostFocusCompanyEmail(string userName)
        {



            string msg = await CheckUserNameExist(userName);
            return msg;
        }
        public async Task<string> Txt_LostFocusSElfSsn(string ssN)
        {
            if (string.IsNullOrEmpty(ssN))
            {
                return "Please enter Social Security Number.";

            }
            else if (ssN.Trim().Length != 6)
            {
                return "Social Security Number should be 6 digits.";

            }
            else
            {

                try
                {
                    int ssn = int.Parse(ssN);
                    DataSet dataSet = new DataSet();

                    SqlConnection con = C3WizardLayerConn_BaseData.StaticSqlConnection;
                    con.Open();
                    SqlCommand cmd = new SqlCommand("SELECT * FROM SelfEmployee WHERE Isactive=1 And Soc_Sec_Num=" + ssn, con);
                    cmd.CommandType = CommandType.Text;
                    SqlDataAdapter adapter = new SqlDataAdapter();
                    adapter.SelectCommand = cmd;
                    adapter.Fill(dataSet);
                    con.Close();
                    if (dataSet.Tables[0].Rows.Count > 0)
                    {
                        //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                        //C3WizardMessageBox.Show("C3 Wizard", "This Self Employed Already Registered");
                        return "This Self Employed Already Registered";
                    }
                    var data = _DbContext.MasterCompanies.Where(x => x.RegNumber == ssn.ToString()).FirstOrDefault();
                    if (data != null)
                    {
                        return "This Self Employed Already Registered!";
                    }
                    //if (ConnectionInfo.HasConnection() && ConnectionInfo.APIConnection())
                    //{

                    //  GetSelfEmployedDetails();
                    //  Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                    //}
                    //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                    return "true";
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
                    //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                    //C3WizardMessageBox.Show("C3 Wizard", "Error: " + ex);
                    return ex.Message.ToString();
                }

            }


        }

        public async Task<string> Txt_regno_LostFocus(string regNo)
        {
            if (string.IsNullOrEmpty(regNo))
            {
                return "Please enter registration no.";
                //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
            }
            else if (regNo.Trim().Length != 6)
            {
                return "Registration no should be 6 digits.";
                //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
            }
            else
            {
                if (regNo.Contains(" "))
                {
                    //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                    return "Please enter registration no without white space ";
                    //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                    //Txt_regno.Text = "";
                }
                else
                {
                    try
                    {
                        int ssn = int.Parse(regNo);
                        DataSet dataSet = new DataSet();

                        SqlConnection con = C3WizardLayerConn_BaseData.StaticSqlConnection;
                        con.Open();
                        SqlCommand cmd = new SqlCommand("SELECT * FROM MasterCompany WHERE Isactive=1 And REG_NUMBER=" + ssn, con);
                        cmd.CommandType = CommandType.Text;
                        SqlDataAdapter adapter = new SqlDataAdapter();
                        adapter.SelectCommand = cmd;
                        adapter.Fill(dataSet);
                        con.Close();
                        if (dataSet.Tables[0].Rows.Count > 0)
                        {
                            //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                            return "This registration number is already in use!";

                        }

                        var data = _DbContext.SelfEmployees.Where(x => x.SocSecNum == ssn.ToString()).FirstOrDefault();
                        if (data != null)
                        {
                            return "This registration number is already in use!";
                        }
                        else
                        {
                            return "Success";
                        }

                        //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
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
                        //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                        //C3WizardMessageBox.Show("C3 Wizard", "Error: " + ex);
                        return "something Went Wrong";
                    }
                }
            }
        }




        public List<c3WageCategory> LoadCategory()
        {
            try
            {
                var wagecatlist = new List<c3WageCategory>();
                DataSet CdataSet = new DataSet();

                SqlConnection con = C3WizardLayerConn_BaseData.StaticSqlConnection;
                con.Open();
                SqlCommand cmd = new SqlCommand("SELECT CategoryID, Category + ' (Weekly Income : '+ cast(cast(WeeklyIncome as numeric(18,2)) as nvarchar(20))+', '+'Weekly Contribution : '+ cast(cast(WeeklyContribution as numeric(18,2)) as nvarchar(20))+' )' As WageCategory FROM WageCategories where IsLocked=" + 1, con);
                cmd.CommandType = CommandType.Text;
                SqlDataAdapter adapter = new SqlDataAdapter();
                adapter.SelectCommand = cmd;
                adapter.Fill(CdataSet);
                //cmbIncomeCategory.ItemsSource = CdataSet.Tables[0].DefaultView;
                con.Close();

                try
                {
                    foreach (DataRow row in CdataSet.Tables[0].Rows)
                    {
                        c3WageCategory wagecat = new c3WageCategory();
                        wagecat.CategoryID = Convert.IsDBNull(row["CategoryID"]) ? 0 : int.Parse(row["CategoryID"].ToString());
                        wagecat.CategoryDescription = Convert.IsDBNull(row["WageCategory"]) ? null : row["WageCategory"].ToString();
                        wagecatlist.Add(wagecat);
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

                }

                return wagecatlist;
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
                return new List<c3WageCategory>();
            }

        }
        // bool iswagecatfromserver = false;
        string gender = "";
        string maritalstat = "";



        public async Task<SelfEmployedDeailsModuleVm> GetSelfEmployedDetails(string ssN)
        {
            var obj = new SelfEmployedDeailsModuleVm();
            try
            {
                //cmbIncomeCategory.IsEnabled = true;
                //iswagecatfromserver = false;
                String surl = _configuration["ServiceConfig:ServiceUriString"];

                string sURL = surl + "/Employer/getSEMasterDetails/" + ssN;
                HttpMessageHandler handler = new HttpClientHandler()
                {
                };

                var httpClient = new HttpClient(handler)
                {
                    BaseAddress = new Uri(sURL),
                    Timeout = new TimeSpan(0, 2, 0)
                };
                httpClient.DefaultRequestHeaders.Add("ContentType", "application/json");
                string authUser = _configuration["ServiceConfig:AuthUser"];
                string authPass = _configuration["ServiceConfig:AuthPass"];
                //This is the key section you were missing    
                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(authUser + ":" + authPass);
                string val = System.Convert.ToBase64String(plainTextBytes);
                httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + val);
                HttpResponseMessage response = httpClient.GetAsync(sURL).Result;
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var customerJsonString = await response.Content.ReadAsStringAsync();
                    var Emp_model = JsonConvert.DeserializeObject<SelfEmployedDeailsModule>(customerJsonString);
                    if (Emp_model == null)//if (!strResult.Contains("isSuccess\":true"))
                    {
                        obj.ValidationMsg = "Registration number or emailId is invalid! please enter correct details";
                        return obj;
                    }
                    else
                    {
                        string modelemail = Emp_model.email != null && Emp_model.email != "" ? Emp_model.email.Trim().ToLower() : null;
                        //if (modelemail == emailid.Trim().ToLower())
                        //{
                        if (Emp_model.c3RegnStatusCode == "D" || Emp_model.c3RegnStatusCode == "O")
                        {

                            obj.tradeName = Emp_model.tradeName;
                            obj.tin = Emp_model.tin;
                            obj.dateOfBirth = Emp_model.dateOfBirth;

                            obj.c3WageCategory = LoadCategory();
                            if (obj.c3WageCategory.Count > 0)
                            {
                                foreach (var item in obj.c3WageCategory)
                                {
                                    if (Emp_model.wageCategory == item.CategoryDescription.Substring(0, 1))
                                    {
                                        obj.dropdownText = item.CategoryDescription;
                                        //cmbIncomeCategory.IsEnabled = false;
                                        //iswagecatfromserver = true;
                                    }
                                }
                            }


                            obj.mobile = Emp_model.mobileNo;
                            obj.email = Emp_model.email;
                            obj.wageCategory = Emp_model.wageCategory;
                            obj.phoneNo = Emp_model.phoneNo;

                            obj.address1 = Emp_model.address1 != null ? Emp_model.address1.TrimStart('\r', '\n', '\t') : null;
                            obj.address2 = Emp_model.address2 != null ? Emp_model.address2.TrimStart('\r', '\n', '\t') : null;
                            obj.city = Emp_model.city;
                            obj.userName = Emp_model.userName;
                            obj.firstName = Emp_model.firstName;
                            obj.lastName = Emp_model.lastName;
                            obj.dateRegistered = Emp_model.dateRegistered;
                            obj.officeCode = Emp_model.officeCode;
                            try
                            {
                                if (Emp_model.name != "")
                                {
                                    string[] splitname = Emp_model.name.Split(' ');

                                    //Txt_SEFname.Text = splitname.Count() > 0 ? splitname[0] : "";
                                    //Txt_SELastName.Text = splitname.Count() > 1 ? splitname[1] : "";

                                    obj.sefFirstName = splitname.Count() > 0 ? splitname[0] : "";
                                    obj.sefLastName = splitname.Count() > 1 ? splitname[1] : "";
                                    obj.firstName = Emp_model.firstName == "" ? obj.sefFirstName : Emp_model.firstName;
                                    obj.lastName = Emp_model.lastName == "" ? obj.sefLastName : Emp_model.surName;
                                }
                                if (Emp_model.gender == "M")
                                {
                                    gender = "Male";
                                }
                                else if (Emp_model.gender == "F")
                                {
                                    gender = "Female";
                                }
                                if (Emp_model.maritalStatus == "S")
                                {
                                    maritalstat = "S";
                                }
                                else if (Emp_model.gender == "M")
                                {
                                    maritalstat = "M";
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
                            }
                            return obj;

                            //Txt_Password.Password = null;
                            //Txt_conPassword.Password = null;
                            //cmbQues1.Text = null;
                            //cmbQues2.Text = null;
                            //Txt_Ans1.Text = null;
                            //Txt_Ans2.Text = null;
                        }
                        else
                        {
                            //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                            obj.ValidationMsg = "S.S.B. Server Message with this Registraion # and Email id \n" + Emp_model.c3RegnStatusText + "\n Please try to login from login screen.";
                            return obj;
                        }
                        //}
                        //else
                        //{
                        //  //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                        //  if (modelemail == null)
                        //  {
                        //    obj.ValidationMsg = "Your email address not registered, Please reach out to social security !";
                        //    return obj;
                        //  }
                        //  else
                        //  {
                        //    obj.ValidationMsg = "Incorrect  email address, please enter correct email address !";
                        //    return obj;
                        //  }
                        //}
                    }
                }
                else
                {
                    string responseContent = response.Content.ReadAsStringAsync().Result;
                    obj.ValidationMsg = responseContent;
                    return obj;
                }
                //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                return obj;
            }
            catch (Exception ex)
            {
                //Login login = new Login();
                //login.Error_Log(ex.Message);
                //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                //C3WizardMessageBox.Show("C3 Wizard", ex.Message); //"Registration number or emailId validation Failed! web service is not working");

                obj.ValidationMsg = "something went wrong\n" + ex;
                return obj;
            }
        }

        public async Task<ResponseModel> RegisterSelfEmployed(RegisterCompanyVm registerCompanyVm)
        {
            try
            {
                bool chkTwice = false;
                ResponseModel responseModel = new ResponseModel();
                string Imagename = null;
                SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection;

                if (staticConnection.State != ConnectionState.Open)
                {
                    await staticConnection.OpenAsync();
                }

                C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);

                SqlCommand cmd = new SqlCommand("Check_SelfEmp_SSN", staticConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@SSN_NUMBER", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)registerCompanyVm.SocSecNum ?? (object)DBNull.Value));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sqlAdapter.Fill(dt);
                await staticConnection.CloseAsync();
                if (dt.Rows.Count > 0)
                {
                    response.Message = "C3 Wizard,Social security number already exists";
                    response.Status = false;
                    response.Statuscode = 409;
                    chkTwice = true;
                    response.Data = Array.Empty<object>();
                    return response;

                }


                bool isuserregistered = false;
                try
                {
                    if (ConnectionInfom.HasConnection() && _configuration["IsBEMARegistrationEnabled"] == "1" && ConnectionInfom.APIConnection(_configuration))
                    {
                        try
                        {

                            var reg = new SelfEmployedDeailsModule();
                            reg.payerId = registerCompanyVm.SocSecNum;
                            reg.tin = null;
                            reg.firstName = registerCompanyVm.FirstName;
                            reg.surName = registerCompanyVm.LastName;

                            try
                            {
                                reg.wageCategory = GetIncome_Wages_Catagory_Self_Employed(registerCompanyVm.CategoryType);
                                reg.dateOfBirth = registerCompanyVm.BirthDate != null ? ((DateTime)registerCompanyVm.BirthDate).ToString(Helper.DateFormat, CultureInfo.InvariantCulture) : "";

                            }
                            catch (Exception ex)
                            {
                                string controller = "UnknownController";
                                string action = "UnknownAction";
                                var context = ExceptionMiddleware1.GetActionInfo();
                                controller = context.Controller;
                                action = context.Action;
                                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                            }
                            reg.companyName = registerCompanyVm.CompanyName;
                            reg.tradeName = registerCompanyVm.TradeName;
                            reg.employerType = "SE";
                            reg.contactName = "";
                            reg.mobile = registerCompanyVm.Mobile;
                            reg.Phone = registerCompanyVm.Phone;
                            reg.phone = registerCompanyVm.Phone;
                            reg.email = string.IsNullOrEmpty(registerCompanyVm.Email) ? registerCompanyVm.EmailId : registerCompanyVm.Email;
                            reg.address1 = registerCompanyVm.Address1;
                            reg.address2 = registerCompanyVm.Address2;
                            reg.city = registerCompanyVm.City;
                            reg.country = registerCompanyVm.Country;
                            reg.postalCode = registerCompanyVm.Zip;
                            reg.firstName = registerCompanyVm.FirstName;
                            reg.tin = registerCompanyVm.Tin;
                            reg.surName = registerCompanyVm.LastName;
                            reg.userName = registerCompanyVm.UserName;
                            reg.passwordHash = EncryptDecryptPassword.Encrypt(registerCompanyVm.Password.Trim());
                            reg.isActive = true;
                            reg.question1 = registerCompanyVm.Question1;
                            reg.answer1 = registerCompanyVm.Answer1;
                            reg.question2 = registerCompanyVm.Question2;
                            reg.answer2 = registerCompanyVm.Answer2;
                            reg.userStatus = "A";
                            reg.parentCompanyRegistration = "";

                            string surl = _configuration["ServiceConfig:ServiceUriString"];
                            string sURL = surl + "/User/registerUser";
                            var myContent = JsonConvert.SerializeObject(reg);
                            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
                            var byteContent = new ByteArrayContent(buffer);
                            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");


                            HttpMessageHandler handler = new HttpClientHandler()
                            {
                            };

                            var httpClient = new HttpClient(handler)
                            {
                                BaseAddress = new Uri(sURL),
                                Timeout = new TimeSpan(0, 2, 0)
                            };
                            httpClient.DefaultRequestHeaders.Add("ContentType", "application/json");
                            //This is the key section you were missing    
                            //var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + _configuration["ServiceConfig:AuthPass"]);
                            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + ":" + _configuration["ServiceConfig:AuthPass"]);
                            string val = System.Convert.ToBase64String(plainTextBytes);
                            httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + val);

                            HttpResponseMessage response = httpClient.PutAsync(sURL, byteContent).Result;

                            if (response.StatusCode == HttpStatusCode.OK)
                            {

                                //if (chkTwice==false)
                                //{
                                ResponseModel res = RegisterSelfEmployedlocal(registerCompanyVm);
                                //}
                                string customerJsonString = await response.Content.ReadAsStringAsync();
                                var Emp_model = JsonConvert.DeserializeObject<Apistatus>(customerJsonString);
                                responseModel.Message = $"C3 Wizard, {Emp_model.message}";

                                responseModel.Statuscode = 200;
                                responseModel.Data = "Existing User";
                                responseModel.Status = true;
                                return responseModel;

                            }
                            else
                            {
                                string customerJsonString = await response.Content.ReadAsStringAsync();
                                var Emp_model = JsonConvert.DeserializeObject<Apistatus>(customerJsonString);
                                responseModel.Message = $"C3 Wizard, {Emp_model.message}";

                                responseModel.Statuscode = 409;
                                responseModel.Status = false;
                                return responseModel;
                            }
                        }
                        catch (Exception ex)
                        {
                            responseModel.Message = ex.Message;
                            response.Statuscode = 500;
                            response.Status = false;
                            return response;
                        }
                    }
                    else
                    {
                        ResponseModel res = RegisterSelfEmployedlocal(registerCompanyVm);
                        res.auth_token = "local";
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return response;
        }

        public ResponseModel RegisterSelfEmployedlocal(RegisterCompanyVm registerSelfEmpVm)
        {
            bool iswagecatfromserver = false;
            string Imagename = null;

            SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
            if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();

            SqlCommand cmd = new SqlCommand("Check_SelfEmp_SSN", staticConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(new SqlParameter("@SSN_NUMBER", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)registerSelfEmpVm.SocSecNum ?? (object)DBNull.Value));
            SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            sqlAdapter.Fill(dt);
            staticConnection.Close();
            if (dt.Rows.Count > 0)
            {

                response.Message = "C3 Wizard,Social security number already exists";
                response.Status = false;
                response.Statuscode = 409;
                response.Data = null;
                return response;
            }

            BLSelfEmployed SelfEmployed = new BLSelfEmployed();
            SelfEmployed.SocSecNum = registerSelfEmpVm.SocSecNum;
            SelfEmployed.Tin = registerSelfEmpVm.Tin;
            SelfEmployed.FirstName = registerSelfEmpVm.FirstName;
            SelfEmployed.LastName = registerSelfEmpVm.LastName;
            SelfEmployed.Category_Type = Convert.ToInt32(registerSelfEmpVm.CategoryType);
            SelfEmployed.Address1 = registerSelfEmpVm.Address1;
            SelfEmployed.Address2 = registerSelfEmpVm.Address2;
            SelfEmployed.Country = registerSelfEmpVm.Country;
            SelfEmployed.City = registerSelfEmpVm.City;
            SelfEmployed.Zip = registerSelfEmpVm.Zip;
            SelfEmployed.Mobile = registerSelfEmpVm.Mobile;
            SelfEmployed.Phone = registerSelfEmpVm.Phone;
            SelfEmployed.Email = string.IsNullOrEmpty(registerSelfEmpVm.Email) ? registerSelfEmpVm.EmailId : registerSelfEmpVm.Email;
            SelfEmployed.InsertedBy = 1;
            SelfEmployed.InsertedOn = DateTime.Now;

            SelfEmployed.IsActive = true;
            SelfEmployed.BirthDate = registerSelfEmpVm.BirthDate;
            SelfEmployed.Gender = registerSelfEmpVm.Gender;
            SelfEmployed.MaritalStat = registerSelfEmpVm.MaritalStat;
            SelfEmployed.IswageCategoryfromAPI = iswagecatfromserver;
            SelfEmployed.officeCode = registerSelfEmpVm.officeCode;
            SelfEmployed.regDate = string.IsNullOrEmpty(registerSelfEmpVm.dateRegistered) ? null : DateTime.ParseExact(registerSelfEmpVm.dateRegistered, Helper.DateFormat, CultureInfo.InvariantCulture); 
            SelfEmployed.SaveNew();

            //if (registerSelfEmpVm.UserImage != null && registerSelfEmpVm.UserImage.Length > 0)
            //{
            //    string uploadsFolder = Path.Combine(_environment.WebRootPath, "UserImage");
            //    Directory.CreateDirectory(uploadsFolder);
            //    Imagename = Guid.NewGuid().ToString() + Path.GetExtension(registerSelfEmpVm.UserImage.FileName);
            //    string filePath = Path.Combine(uploadsFolder, Imagename);
            //    using (var fileStream = new FileStream(filePath, FileMode.Create))
            //    {
            //        registerSelfEmpVm.UserImage.CopyTo(fileStream);
            //    }
            //}
            string uploadsFolder = Path.Combine(_environment.WebRootPath, "UserImage");
            var imagName = registerSelfEmpVm.SocSecNum + "_" + DateTime.Now.ToString("yyyyMMdd_HHmmss") + ".png";
            SaveBase64Image(registerSelfEmpVm.profileImage, uploadsFolder, imagName);

            BLSECUsers secuser = new BLSECUsers();
            secuser.FirstName = registerSelfEmpVm.FirstName;
            secuser.LastName = registerSelfEmpVm.LastName;
            secuser.LoginId = registerSelfEmpVm.UserName;
            secuser.Password = EncryptDecryptPassword.Encrypt(registerSelfEmpVm.Password);
            secuser.EmailId = string.IsNullOrEmpty(registerSelfEmpVm.Email) ? registerSelfEmpVm.EmailId : registerSelfEmpVm.Email;
            secuser.EmpId = "0";
            secuser.SelfEmpID = SelfEmployed.EmployeeID != null ? SelfEmployed.EmployeeID.ToString() : "0";
            secuser.RoleId = 5;
            secuser.ProfileImage = imagName;
            secuser.InsertedBy = 1;
            secuser.InsertedOn = DateTime.Now;
            //secuser.InsertedMachineInfo = Helper.MachineInfo;
            secuser.IsActive = true;
            secuser.IsSelfEmployee = true;
            secuser.IsLoggedIn = true;
            secuser.Status = true;
            secuser.parentuserid = 0;
            secuser.IsPPOC = true;
            secuser.RegNumber = registerSelfEmpVm.SocSecNum;
            secuser.SaveNew();
            BLUserSecurityQuestionAnswer secqa = new BLUserSecurityQuestionAnswer();
            secqa.UserId = (int)secuser.UserId;
            secqa.CompanyId = SelfEmployed.EmployeeID != null ? (int)SelfEmployed.EmployeeID : 0;
            secqa.UserName = registerSelfEmpVm.UserName;
            secqa.RegistrationNo = Convert.ToInt32(registerSelfEmpVm.SocSecNum);
            secqa.Question1 = registerSelfEmpVm.Question1;
            secqa.Question2 = registerSelfEmpVm.Question2;
            secqa.Answer1 = registerSelfEmpVm.Answer1;
            secqa.Answer2 = registerSelfEmpVm.Answer2;
            secqa.InsertedBy = 1;
            secqa.InsertedOn = DateTime.Now;

            secqa.IsActive = true;
            secqa.SaveNew();

            var secuserprofileAdd = new SECUsersProfile
            {
                EmpId = secqa.CompanyId,
                REG_NUMBER = secqa.RegistrationNo.ToString(),
                UserId = secqa.UserId,
                InsertedBy = secqa.CompanyId,
                InsertedOn = DateTime.Now,
                IsActive = true,
                ISSelfEmployee = true

            };

            _DbContext.SECUsersProfiles.Add(secuserprofileAdd);
            _DbContext.SaveChanges();

            response.Message = "Thank you for registering! Your account is not yet active. A verification code has been sent to your registered email. Please check your inbox to activate your account.";
            response.Status = true;
            response.Statuscode = 200;
            response.Data = new
            {
                SelfEmployedd = SelfEmployed,
                SecUser = secuser,
                SecQA = secqa
            };

            return response;
        }

        public ResponseModel RegisterCompanylocal(RegisterCompanyVm registerCompanyVm)
        {
            try
            {
                string username, companyname;
                string Imagename = null;
                //SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
                //if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                //SqlCommand cmd = new SqlCommand("check_company_reg_no", staticConnection);
                //cmd.CommandType = CommandType.StoredProcedure;
                //cmd.Parameters.Add(new SqlParameter("@REG_NUMBER", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)registerCompanyVm.RegNumber ?? (object)DBNull.Value));
                //cmd.Parameters.Add(new SqlParameter("@Company_Name", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)registerCompanyVm.CompanyName ?? (object)DBNull.Value));
                //cmd.Parameters.Add(new SqlParameter("@OLD_REG_NUMBER", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)"" ?? (object)DBNull.Value));
                //cmd.Parameters.Add(new SqlParameter("@OLD_Company_Name", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)"" ?? (object)DBNull.Value));
                //SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                //DataTable dt = new DataTable();
                //sqlAdapter.Fill(dt);
                //staticConnection.Close();
                //if (dt.Rows.Count > 0)
                //{
                //  response.Message = "Entered registration no. is already exists.";
                //  response.Status = false;
                //  response.Statuscode = 409;
                //  response.Data = null;
                //  return response;
                //}



                BLMasterCompany mastercompany = new BLMasterCompany();
                mastercompany.CompanyId = 0;
                mastercompany.Parent_Id = 0;
                mastercompany.CompanyName = registerCompanyVm.CompanyName;
                companyname = registerCompanyVm.CompanyName;
                mastercompany.TradeName = registerCompanyVm.TradeName;
                mastercompany.RegNumber = registerCompanyVm.RegNumber;
                mastercompany.Address1 = registerCompanyVm.Address1;
                mastercompany.Address2 = registerCompanyVm.Address2;
                mastercompany.Country = registerCompanyVm.Country;
                mastercompany.City = registerCompanyVm.City;
                mastercompany.Zip = registerCompanyVm.Zip;
                mastercompany.Mobile = registerCompanyVm.Mobile;
                mastercompany.Landline = registerCompanyVm.Phone;
                mastercompany.Fax = string.Empty;
                mastercompany.ContactPerson = registerCompanyVm.ContactPerson;
                mastercompany.Email = string.IsNullOrEmpty(registerCompanyVm.Email) ? registerCompanyVm.EmailId : registerCompanyVm.Email;
                mastercompany.InsertedBy = 1;// because login pending
                mastercompany.InsertedOn = DateTime.Now;
                mastercompany.IsActive = true;
                mastercompany.IsLevyExempt = registerCompanyVm.IsLevyExempt;
                mastercompany.IsVerified = false;
                mastercompany.Tokan = "";
                mastercompany.officeCode = registerCompanyVm.officeCode;
                mastercompany.regDate = string.IsNullOrEmpty(registerCompanyVm.dateRegistered) ? null : DateTime.ParseExact(registerCompanyVm.dateRegistered, Helper.DateFormat, CultureInfo.InvariantCulture);
                string imageFileName = string.Empty;
                //if (registerCompanyVm.profileImage != null && registerCompanyVm.profileImage.Length > 0)
                //{
                //    string uploadsFolder = Path.Combine(_environment.WebRootPath, "UserImage");
                //    Directory.CreateDirectory(uploadsFolder);
                //    imageFileName = Guid.NewGuid().ToString() + Path.GetExtension(registerCompanyVm.profileImage.FileName);
                //    string filePath = Path.Combine(uploadsFolder, imageFileName);
                //    using (var fileStream = new FileStream(filePath, FileMode.Create))
                //    {
                //        registerCompanyVm.profileImage.CopyTo(fileStream);
                //    }
                //}

                string uploadsFolder = Path.Combine(_environment.WebRootPath, "UserImage");
                var imagName = registerCompanyVm.SocSecNum + "_" + DateTime.Now.ToString("yyyyMMdd_HHmmss") + ".png";
                SaveBase64Image(registerCompanyVm.profileImage, uploadsFolder, imagName);

                //string uploadsFolderlogo = Path.Combine(_environment.WebRootPath, "CompanyLogo");
                //var imagNamelogo = registerCompanyVm.SocSecNum + "_" + DateTime.Now.ToString("yyyyMMdd_HHmmss") + ".png";
                //SaveBase64Image(registerCompanyVm.companyLogo, uploadsFolderlogo, imagNamelogo);
                //        mastercompany.CompanyLogo = imagNamelogo;
                string uploadsFolderlogo = Path.Combine(_environment.WebRootPath, "CompanyLogo");

                // Check if companyLogo is not null or empty
                if (!string.IsNullOrEmpty(registerCompanyVm.companyLogo) && registerCompanyVm.companyLogo != "string")
                {
                    var imagNamelogo = registerCompanyVm.SocSecNum + "_" + DateTime.Now.ToString("yyyyMMdd_HHmmss") + ".png";
                    SaveBase64Image(registerCompanyVm.companyLogo, uploadsFolderlogo, imagNamelogo);
                    mastercompany.CompanyLogo = imagNamelogo; // Save image name if valid logo exists
                }
                else
                {
                    mastercompany.CompanyLogo = null; // Store null if companyLogo is null or empty
                }

                mastercompany.SaveNew();
                BLSECUsers secuser = new BLSECUsers();
                secuser.FirstName = registerCompanyVm.FirstName;
                secuser.LastName = registerCompanyVm.LastName;
                secuser.LoginId = registerCompanyVm.LoginId;
                username = registerCompanyVm.UserName;
                //secuser.Password = hashPassword.EncodePasswordToBase64(registerCompanyVm.Password);// this formet not Support SSB 
                secuser.Password = EncryptDecryptPassword.Encrypt(registerCompanyVm.Password);
                secuser.EmailId = string.IsNullOrEmpty(registerCompanyVm.Email) ? registerCompanyVm.EmailId : registerCompanyVm.Email;
                secuser.EmpId = mastercompany.CompanyId != null ? mastercompany.CompanyId.ToString() : "0";
                secuser.SelfEmpID = "0";
                secuser.RoleId = 3;
                secuser.ProfileImage = imagName;
                secuser.InsertedBy = 1;//pending
                secuser.InsertedOn = DateTime.Now;

                secuser.IsActive = true;
                secuser.IsSelfEmployee = false;
                //secuser.RegNumber = mastercompany.RegNumber
                secuser.IsLoggedIn = true;
                secuser.Status = true;
                secuser.parentuserid = 0;
                secuser.IsPPOC = true;
                secuser.RegNumber = registerCompanyVm.RegNumber;
                secuser.SaveNew();
                BLUserSecurityQuestionAnswer secqa = new BLUserSecurityQuestionAnswer();
                secqa.UserId = (int)secuser.UserId;
                secqa.CompanyId = (int)mastercompany.CompanyId;
                secqa.UserName = registerCompanyVm.LoginId;
                secqa.RegistrationNo = Convert.ToInt32(registerCompanyVm.RegNumber);
                secqa.CompanyName = companyname;
                secqa.Question1 = registerCompanyVm.Question1;
                secqa.Question2 = registerCompanyVm.Question2;
                secqa.Answer1 = registerCompanyVm.Answer1;
                secqa.Answer2 = registerCompanyVm.Answer2;
                secqa.InsertedBy = 1;
                secqa.InsertedOn = DateTime.Now;
                secqa.IsActive = true;
                secqa.SaveNew();

                var secuserprofileAdd = new SECUsersProfile
                {
                    EmpId = secqa.CompanyId,
                    REG_NUMBER = registerCompanyVm.RegNumber,
                    UserId = secqa.UserId,
                    InsertedBy = secqa.CompanyId,
                    InsertedOn = DateTime.Now,
                    IsActive = true,
                    ISSelfEmployee = false

                };

                _DbContext.SECUsersProfiles.Add(secuserprofileAdd);
                _DbContext.SaveChanges();

                SqlConnection con = new SqlConnection(C3WizardLayerConn_BaseData.StaticSqlConnection.ConnectionString);
                con.Open();
                SqlCommand CurrentCompanyId = new SqlCommand("Insert Into UserPermission(Company_Id, Administrative, Standard, MenuItemName) values(" + mastercompany.CompanyId + ",1,1,'DASHBOARD'),(" + mastercompany.CompanyId + ",1,1,'EMPLOYER DETAILS'),(" + mastercompany.CompanyId + ",1,1,'EMPLOYEE'),(" + mastercompany.CompanyId + ",1,1,'USER MANAGEMENT'),(" + mastercompany.CompanyId + ",1,1,'PAYROLL PROCESS'),(" + mastercompany.CompanyId + ",1,1,'WAGES / CONTRIBUTION'),(" + mastercompany.CompanyId + ",1,1,'BACKUP/RESTORE DATABASE'),(" + mastercompany.CompanyId + ",1,1,'REPORTS'),(" + mastercompany.CompanyId + ",1,1,'SETTINGS')", con);
                CurrentCompanyId.ExecuteNonQuery();
                con.Close();

                response.Message = "Thank you for registering! Your account is not yet active. A verification code has been sent to your registered email. Please check your inbox to activate your account.";
                response.Status = true;
                response.Statuscode = 200;
                response.Data = new
                {
                    MasterCompany = mastercompany,
                    SecUser = secuser,
                    SecQA = secqa
                };

                //return res = mastercompany.CompanyId != null ? (int)mastercompany.CompanyId : 0;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
            }
            return response;
        }


        public async Task<ResponseModel> varifyUser(string UserName, string Password)
        {
            ResponseModel resmodel = new ResponseModel();
            try
            {
                var log = new LoginDeails();
                log.userName = UserName;
                log.userPass = EncryptDecryptPassword.Encrypt(Password);
                string surl = _configuration["ServiceConfig:ServiceUriString"];
                string sURL = surl + "/User/loginUser";

                var myContent = JsonConvert.SerializeObject(log);
                var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
                var byteContent = new ByteArrayContent(buffer);
                byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                string authUser = _configuration["ServiceConfig:AuthUser"];
                string authPass = _configuration["ServiceConfig:AuthPass"];

                HttpMessageHandler handler = new HttpClientHandler()
                {
                };

                var httpClient = new HttpClient(handler)
                {
                    BaseAddress = new Uri(sURL),
                    Timeout = new TimeSpan(0, 2, 0)
                };
                httpClient.DefaultRequestHeaders.Add("ContentType", "application/json");
                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(authUser + ":" + authPass);
                string val = System.Convert.ToBase64String(plainTextBytes);
                httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + val);

                HttpResponseMessage response = httpClient.PostAsync(sURL, byteContent).Result;
                if (response.StatusCode == HttpStatusCode.OK)
                {

                    var customerJsonString = await response.Content.ReadAsStringAsync();
                    var Emp_model = JsonConvert.DeserializeObject<Apistatus>(customerJsonString);
                    bool res = await Sendvarify_code(UserName, Password);
                    if (res)
                    {
                        resmodel.Message = "Verification code sent to registered email.";
                        resmodel.Status = true;
                        return resmodel;
                    }

                }
                else
                {
                    var customerJsonString = await response.Content.ReadAsStringAsync();
                    var Emp_model = JsonConvert.DeserializeObject<Apistatus>(customerJsonString);

                    resmodel.Message = Emp_model.message;
                    resmodel.Status = false;
                    return resmodel;
                }
            }
            catch (Exception ex)
            {
                resmodel.Message = ex.Message;
                resmodel.Status = false;
                return resmodel;
            }
            return resmodel;
        }

        public async Task<bool> Sendvarify_code(string UserName, string Password)
        {
            try
            {
                var log = new ResendDeails();
                log.regNo = payerId(UserName, EncryptDecryptPassword.Encrypt(Password));
                log.userName = UserName;
                log.userPass = EncryptDecryptPassword.Encrypt(Password);
                string surl = _configuration["ServiceConfig:ServiceUriString"];
                string sURL = surl + "/User/reactivate";
                var myContent = JsonConvert.SerializeObject(log);
                var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
                var byteContent = new ByteArrayContent(buffer);
                byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");


                HttpMessageHandler handler = new HttpClientHandler()
                {
                };

                var httpClient = new HttpClient(handler)
                {
                    BaseAddress = new Uri(sURL),
                    Timeout = new TimeSpan(0, 2, 0)
                };
                httpClient.DefaultRequestHeaders.Add("ContentType", "application/json");

                var plainTextBytes = _configuration["EnableBEMAAuthInsteadOfLocal"] == "1" ? System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + ":" + _configuration["ServiceConfig:AuthPass"]) : System.Text.Encoding.UTF8.GetBytes(log.userName + ":" + log.userPass);
                string val = System.Convert.ToBase64String(plainTextBytes);
                httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + val);

                HttpResponseMessage response = httpClient.PostAsync(sURL, byteContent).Result;
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    return true;
                }
                else
                {
                    var customerJsonString = await response.Content.ReadAsStringAsync();
                    var Emp_model = JsonConvert.DeserializeObject<Apistatus>(customerJsonString);
                    if (Emp_model.message.Contains("User account is not active"))
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                }

            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public string payerId(string Loginid, string password)
        {
            DataSet dataSet = new DataSet();
            DataSet dataSetCompany = new DataSet();
            string SqlQuerystring = C3WizardLayerConn_BaseData.StaticSqlConnection.ConnectionString;
            SqlConnection con = new SqlConnection(SqlQuerystring);
            con.Open();
            SqlCommand cmd = new SqlCommand("SELECT * FROM SECUsers WHERE LoginId ='" + Loginid + "'  AND Password ='" + password + "' and Isactive=1 and status=1", con);
            cmd.CommandType = CommandType.Text;
            SqlDataAdapter adapter = new SqlDataAdapter();
            adapter.SelectCommand = cmd;
            adapter.Fill(dataSet);
            con.Close();
            if (dataSet != null && dataSet.Tables[0].Rows.Count > 0)
            {
                int Employerid = 0; //Convert.ToInt32(dataSet.Tables[0].Rows[0]["SelfEmpID"]);
                int Userid = Convert.ToInt32(dataSet.Tables[0].Rows[0]["UserId"]);
                string userpassword = (dataSet.Tables[0].Rows[0]["Password"]).ToString();
                string username = (dataSet.Tables[0].Rows[0]["LoginId"]).ToString();
                bool isselfemployee = dataSet.Tables[0].Rows[0]["IsSelfEmployee"] != null || dataSet.Tables[0].Rows[0]["IsSelfEmployee"] != "" ? Convert.ToBoolean(dataSet.Tables[0].Rows[0]["IsSelfEmployee"]) : false;
                if (C3WizardRepository.Repository.ConnectionInfom.HasConnection() && C3WizardRepository.Repository.ConnectionInfom.APIConnection(_configuration))
                {
                    try
                    {
                        if (isselfemployee)
                        {
                            try
                            {
                                Employerid = Convert.ToInt32(dataSet.Tables[0].Rows[0]["SelfEmpID"]);
                                con.Open();
                                SqlCommand cmdmastercompany = new SqlCommand("SELECT * FROM SelfEmployee WHERE EmployeeID =" + Employerid + " and Isactive=1", con);
                                cmdmastercompany.CommandType = CommandType.Text;
                                SqlDataAdapter adaptermastercompany = new SqlDataAdapter();
                                adaptermastercompany.SelectCommand = cmdmastercompany;
                                adaptermastercompany.Fill(dataSetCompany);
                                con.Close();
                                if (dataSetCompany != null && dataSetCompany.Tables[0].Rows.Count > 0)
                                {
                                    return (string)(dataSetCompany.Tables[0].Rows[0]["Soc_Sec_Num"]);
                                }
                            }
                            catch (Exception ex)
                            {

                            }
                        }
                        else
                        {
                            Employerid = Convert.ToInt32(dataSet.Tables[0].Rows[0]["EmpID"]);
                            con.Open();
                            SqlCommand cmdmastercompany = new SqlCommand("SELECT * FROM MasterCompany WHERE Company_Id =" + Employerid + " and Isactive=1", con);
                            cmdmastercompany.CommandType = CommandType.Text;
                            SqlDataAdapter adaptermastercompany = new SqlDataAdapter();
                            adaptermastercompany.SelectCommand = cmdmastercompany;
                            adaptermastercompany.Fill(dataSetCompany);
                            con.Close();
                            if (dataSetCompany != null && dataSetCompany.Tables[0].Rows.Count > 0)
                            {
                                return (string)(dataSetCompany.Tables[0].Rows[0]["REG_NUMBER"]);

                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        return "";
                    }
                }

            }
            return "";
        }
        public async Task<ResponseModel> varify_varificatiion_code(string code, string UserName, string Password)
        {
            var res = new ResponseModel();
            try
            {
                string baseUrl = _configuration["ServiceConfig:ServiceUriString"];
                string sURL = baseUrl + "/User/activateUser/" + code;
                HttpMessageHandler handler = new HttpClientHandler()
                {
                };
                var httpClient = new HttpClient(handler)
                {
                    BaseAddress = new Uri(sURL),
                    Timeout = new TimeSpan(0, 2, 0)
                };
                httpClient.DefaultRequestHeaders.Add("ContentType", "application/json");
                //This is the key section you were missing    
                var plainTextBytes = _configuration["EnableBEMAAuthInsteadOfLocal"] == "1" ? System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + ":" + _configuration["ServiceConfig:AuthPass"]) : System.Text.Encoding.UTF8.GetBytes(UserName.Trim() + ":" + Password);
                string val = System.Convert.ToBase64String(plainTextBytes);
                httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + val);
                HttpResponseMessage response = httpClient.GetAsync(sURL).Result;
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var customerJsonString = await response.Content.ReadAsStringAsync();
                    var Emp_model = JsonConvert.DeserializeObject<success>(customerJsonString);
                    res.Status = true;
                    res.Message = Emp_model.message;
                    return res;
                }
                else
                {
                    var customerJsonString = await response.Content.ReadAsStringAsync();
                    var Emp_model = JsonConvert.DeserializeObject<Apistatus>(customerJsonString);
                    res.Status = false;
                    res.Message = Emp_model.message;
                    return res;
                }
            }
            catch (Exception ex)
            {
                res.Status = false;
                res.Message = ex.Message;
                return res;
            }
        }
        public void save_MasterEmployeeIncomes(BLMasterEmployee obj, decimal salary)
        {
            try
            {

                BLMasterEmployeeIncomes empInc = new BLMasterEmployeeIncomes();
                empInc.EmployeeID = obj.EmployeeID;
                empInc.EmplCode = null;
                empInc.IncCode = "Fixed";
                empInc.LineNo = null;
                empInc.IncRate = salary;
                empInc.IncNumber = null;
                empInc.IncHours = 1;
                empInc.AcctNo = null;
                empInc.Department = null;
                empInc.IncQtd1 = null;
                empInc.IncQtd2 = null;
                empInc.IncQtd3 = null;
                empInc.IncQtd4 = null;
                empInc.IncYtd = 1;
                empInc.LoIncAmt = null;
                empInc.HiIncAmt = null;
                empInc.SaveNew();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void updateemployer(string code, int Employerid)
        {
            SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
            if (staticConnection.State == ConnectionState.Open)
            {
                staticConnection.Close();
            }
            SqlCommand updateC3Header = new SqlCommand("Update MasterCompany set IsVerified=1 , Tokan='" + code + "' where Company_Id=" + Employerid, staticConnection);
            if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
            int uprow = updateC3Header.ExecuteNonQuery();
            staticConnection.Close();
        }
        public async void DownloadSelfEmpSubmittedC3_Click(string regno, int compid, string UserName, string Password, int UserID, int SEC3ID = 0)
        {
            try
            {
                List<c3Headerbulk> C3Header = new List<c3Headerbulk>();

                int F_month = DateTime.Now.Month - 5;
                int T_month = DateTime.Now.Month;
                int year = DateTime.Now.Year;
                string S_year = year.ToString();
                string statedate = "01-" + (F_month) + "-" + S_year;
                string enddate = "01-" + (T_month) + "-" + S_year;


                //DateTime currentDate = DateTime.Now;
                //DateTime startDate = currentDate.AddMonths(-5); // 5 months before current
                //startDate = new DateTime(startDate.Year, startDate.Month, 1); // First day of that month

                //DateTime endDate = new DateTime(currentDate.Year, currentDate.Month, 1); // First day of current month

                //string statedate = startDate.ToString("dd-MM-yyyy"); // "01-MM-yyyy"
                //string enddate = endDate.ToString("dd-MM-yyyy");
                string regn = regno;
                String Newsurl = _configuration["ServiceConfig:ServiceUriString"];
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
                var plainTextBytes = _configuration["EnableBEMAAuthInsteadOfLocal"] == "1" ? System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + ":" + _configuration["ServiceConfig:AuthPass"]) : System.Text.Encoding.UTF8.GetBytes(UserName.Trim() + ":" + Password.Trim());
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
                                cmdSSN.Parameters.Add(new SqlParameter("@Month", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)(paymonth) ?? (object)DBNull.Value));
                                cmdSSN.Parameters.Add(new SqlParameter("@Year", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)payyear ?? (object)DBNull.Value));
                                cmdSSN.Parameters.Add(new SqlParameter("@SSN", SqlDbType.Int, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)regn ?? (object)DBNull.Value));

                                cmdSSN.Parameters.Add(new SqlParameter("@SEC3ID", SqlDbType.Int, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)SEC3ID ?? (object)DBNull.Value));
                                SqlDataAdapter sqlAdapterSSN = new SqlDataAdapter(cmdSSN);
                                DataTable dtSSN = new DataTable();
                                sqlAdapterSSN.Fill(dtSSN);
                                if (dtSSN.Rows.Count == 0)
                                {
                                    String Emp_surl = _configuration["ServiceConfig:ServiceUriString"];
                                    //String Emp_surl = _configuration["ServiceUriString"];
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
                                    var getplainTextBytes = _configuration["EnableBEMAAuthInsteadOfLocal"] == "1" ? System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + ":" + _configuration["ServiceConfig:AuthPass"]) : System.Text.Encoding.UTF8.GetBytes(UserName.Trim() + ":" + EncryptDecryptPassword.Encrypt(Password.Trim()));
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
                                                                                      "VALUES(" + subc3.c3Header.payerId + "," + (paymonth) + "," + payyear + "," +
                                                                                      (decimal.Parse(ipWages.wagesPaid1) + decimal.Parse(ipWages.wagesPaid2) + decimal.Parse(ipWages.wagesPaid3) + decimal.Parse(ipWages.wagesPaid4) + decimal.Parse(ipWages.wagesPaid5) + decimal.Parse(ipWages.wagesPaid6) + decimal.Parse(ipWages.wagesPaid7)) +
                                                                                      "," + decimal.Parse(subc3.c3Header.calcEmpSsAmt) + "," + decimal.Parse(subc3.c3Header.totalEmpSsFines) + ", ''," + decimal.Parse(ipWages.wagesPaid1) + "," + decimal.Parse(ipWages.wagesPaid2) + "," + decimal.Parse(ipWages.wagesPaid3) + "," + decimal.Parse(ipWages.wagesPaid4) + "," + decimal.Parse(ipWages.wagesPaid5) + "," +
                                                                                      ipWages.paidCode1 + "," + ipWages.paidCode2 + "," + ipWages.paidCode3 + "," + ipWages.paidCode4 + "," + ipWages.paidCode5 + "," +
                                                                                      ipWages.paidCode1 + "," + ipWages.paidCode2 + "," + ipWages.paidCode3 + "," + ipWages.paidCode4 + "," + ipWages.paidCode5 + ",'','" + DateTime.ParseExact(subc3.c3Header.dateReceived, "dd/MM/yyyy", CultureInfo.InvariantCulture).ToString("yyyy-MM-dd") + "'," + subc3.c3Header.sequenceNo + "," + 1 + "," + 1 + "," + 1 + "," + islocked + "," + UserID + "," + UserID + ",'" + Helper.MachineInfo + "'," + 0 + "," + 0 + "," + 1 + ",'" + subc3.c3Header.submittedByName + "','',''," + subc3.c3Header.dateReceived + ")", staticConnection);
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
                }
                else
                {
                    var customerJsonString = await response.Content.ReadAsStringAsync();
                    var Emp_model = JsonConvert.DeserializeObject<Apistatus>(customerJsonString);
                }
            }
            catch (Exception ex)
            {
                throw ex;

            }
        }
        public async Task<string> DownloadSubmittedC3_Click(string regno, int compid, string UserName, string Password, int UserID)
        {
            try
            {
                List<c3Headerbulk> C3Header = new List<c3Headerbulk>();

                int F_month = DateTime.Now.Month - 5;
                int T_month = DateTime.Now.Month;
                int year = DateTime.Now.Year;
                string S_year = year.ToString();
                string statedate = "01-" + (F_month) + "-" + S_year;
                string enddate = "01-" + (T_month) + "-" + (int.Parse(S_year)).ToString();
                string regn = regno;
                String Newsurl = _configuration["ServiceConfig:ServiceUriString"];

                string NewsURL = Newsurl + "/C3/" + regn + "/C3Submitted/ER/range/" + statedate + "/" + enddate + ",EE";


                //int startMonth = 1; // January
                //int startYear = 2023;

                //int endMonth = 12;  // December
                //int endYear = 2025;

                //string statedate = "01-" + startMonth + "-" + startYear;
                //string enddate = "31-" + endMonth + "-" + endYear;

                //string regn = regno;
                //string Newsurl = _configuration["ServiceConfig:ServiceUriString"];

                //string NewsURL = Newsurl + "/C3/" + regn + "/C3Submitted/ER/range/"
                //               + statedate + "/" + enddate + ",EE";


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
                var plainTextBytes = _configuration["EnableBEMAAuthInsteadOfLocal"] == "1" ? System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + ":" + _configuration["ServiceConfig:AuthPass"]) : System.Text.Encoding.UTF8.GetBytes(UserName.Trim() + ":" + Password.Trim());
                string val = System.Convert.ToBase64String(plainTextBytes);
                httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + val);
                HttpResponseMessage response = httpClient.GetAsync(NewsURL).Result;
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var customerJsonString = await response.Content.ReadAsStringAsync();
                    var C3Header_model = JsonConvert.DeserializeObject<List<c3Header>>(customerJsonString);
                    C3Header_model = C3Header_model.Where(x => x.payerType == "ER").ToList();
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
                                SqlCommand cmdSSN = new SqlCommand("check_C3Created", Get_C3staticConnection);
                                cmdSSN.CommandType = CommandType.StoredProcedure;
                                cmdSSN.Parameters.Add(new SqlParameter("@Month", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)(paymonth) ?? (object)DBNull.Value));
                                cmdSSN.Parameters.Add(new SqlParameter("@Year", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)payyear ?? (object)DBNull.Value));
                                cmdSSN.Parameters.Add(new SqlParameter("@CompanyId", SqlDbType.Int, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)compid ?? (object)DBNull.Value));
                                SqlDataAdapter sqlAdapterSSN = new SqlDataAdapter(cmdSSN);
                                DataTable dtSSN = new DataTable();
                                sqlAdapterSSN.Fill(dtSSN);
                                int schcount = 0;
                                if (dtSSN.Rows.Count > 0)
                                {

                                    foreach (DataRow row in dtSSN.Rows)
                                    {
                                        int scno = Convert.IsDBNull(row["Schedule_NO"]) ? 0 : int.Parse(row["Schedule_NO"].ToString());
                                        int hschid = header.sequenceNo;
                                        if (scno == hschid)
                                        {
                                            schcount++;
                                        }
                                    }
                                }
                                if (schcount == 0)
                                {
                                    String Emp_surl = _configuration["ServiceConfig:ServiceUriString"];
                                    // string Emp_surl = _configuration["ServiceUriString"];
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
                                    var getplainTextBytes = _configuration["EnableBEMAAuthInsteadOfLocal"] == "1" ? System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + ":" + _configuration["ServiceConfig:AuthPass"]) : System.Text.Encoding.UTF8.GetBytes(UserName.Trim() + ":" + Password.Trim());
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
                                            subc3.ipWages = submitC3_model.ipWages;// != null ? submitC3_model.ipWages.Where(x => x.sequenceNo == "1").ToList() : null;
                                            SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
                                            if (subc3.c3Header != null && subc3.ipWages != null)
                                            {
                                                if (subc3.ipWages.Count > 0)
                                                {
                                                    decimal EmployerLevy = 0;
                                                    decimal totalwages = 0;
                                                    foreach (var ipWage in subc3.ipWages)
                                                    {
                                                        EmployerLevy += decimal.Parse(ipWage.erLevyAmt);
                                                        totalwages += decimal.Parse(ipWage.wagesPaid1) + decimal.Parse(ipWage.wagesPaid2) + decimal.Parse(ipWage.wagesPaid3) + decimal.Parse(ipWage.wagesPaid4) + decimal.Parse(ipWage.wagesPaid5) + decimal.Parse(ipWage.wagesPaid6) + decimal.Parse(ipWage.wagesPaid7);

                                                    }
                                                    if (staticConnection.State == ConnectionState.Open)
                                                    {
                                                        staticConnection.Close();
                                                    }
                                                    //           SqlCommand insertC3Header = new SqlCommand("INSERT PROCESS_C3Header(RegNo,PERIODD_MONTH,PERIOD_YEAR,TOTAL_WAGES,TOTAL_SSCONTRIBUTIONS,TOTAL_LEVYEEEMPLOYEE,TOTAL_LEVYEEEMPLOYER,TOTAL_SERVAYANCE,TOTAL_LEVYEEPENALTY,TOTAL_PEPENALTY,TOTAL_SSPENALTY,EmployerID,Insert_Datetimeinfo,ForDirector,Schedule_NO,Is_Fianalize,Is_submitted,IsUnLocked,C3_IsFinalized,[Inserted_By],[Modified_By],[Modified_Machineinfo] ,[Print_By],[Export_By],[IsImportFromBEMA],[UserName],[Modified_On],[Export_On],C3_SubmittedDate)" +
                                                    //                                      "VALUES(" + subc3.c3Header.payerId + "," + (paymonth) + "," + payyear + "," + totalwages + "," + subc3.c3Header.calcEmpSsAmt + "," + subc3.c3Header.calcEmpLevyAmt + "," + EmployerLevy + "," + subc3.c3Header.calcEmpPeAmt + "," + subc3.c3Header.totalEmpLevyPenalty + "," + subc3.c3Header.totalEmpPePenalty + "," +
                                                    //subc3.c3Header.totalEmpSsFines + "," + compid + ",'" + subc3.c3Header.dateReceived + "'," + 0 + "," + subc3.c3Header.sequenceNo + "," + 1 + "," + 1 + "," + islocked + "," + 1 + "," + UserID + "," + UserID + ",'" + Helper.MachineInfo + "'," + 0 + "," + 0 + "," + 1 + ",'" + subc3.c3Header.submittedByName + "','','','" + DateTime.ParseExact(subc3.c3Header.dateReceived, "dd/MM/yyyy", CultureInfo.InvariantCulture).ToString("yyyy-MM-dd") + "')", staticConnection);
                                                    DateTime? parsedDate = null;
                                                    if (DateTime.TryParseExact(subc3.c3Header.dateReceived, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime tempDate))
                                                    {
                                                        parsedDate = tempDate;
                                                    }

                                                    SqlCommand insertC3Header = new SqlCommand(@"
                                                    INSERT INTO PROCESS_C3Header (
                                                        RegNo, PERIODD_MONTH, PERIOD_YEAR, TOTAL_WAGES, TOTAL_SSCONTRIBUTIONS,
                                                        TOTAL_LEVYEEEMPLOYEE, TOTAL_LEVYEEEMPLOYER, TOTAL_SERVAYANCE, TOTAL_LEVYEEPENALTY,
                                                        TOTAL_PEPENALTY, TOTAL_SSPENALTY, EmployerID, Insert_Datetimeinfo, ForDirector,
                                                        Schedule_NO, Is_Fianalize, Is_submitted, IsUnLocked, C3_IsFinalized, [Inserted_By],
                                                        [Modified_By], [Modified_Machineinfo], [Print_By], [Export_By], [IsImportFromBEMA],
                                                        [UserName], [Modified_On], [Export_On], C3_SubmittedDate
                                                    )
                                                    VALUES (
                                                        @RegNo, @PERIODD_MONTH, @PERIOD_YEAR, @TOTAL_WAGES, @TOTAL_SSCONTRIBUTIONS,
                                                        @TOTAL_LEVYEEEMPLOYEE, @TOTAL_LEVYEEEMPLOYER, @TOTAL_SERVAYANCE, @TOTAL_LEVYEEPENALTY,
                                                        @TOTAL_PEPENALTY, @TOTAL_SSPENALTY, @EmployerID, @Insert_Datetimeinfo, @ForDirector,
                                                        @Schedule_NO, @Is_Fianalize, @Is_submitted, @IsUnLocked, @C3_IsFinalized, @Inserted_By,
                                                        @Modified_By, @Modified_Machineinfo, @Print_By, @Export_By, @IsImportFromBEMA,
                                                        @UserName, @Modified_On, @Export_On, @C3_SubmittedDate
                                                    )", staticConnection);

                                                    // Add parameters with null/format safety
                                                    insertC3Header.Parameters.AddWithValue("@RegNo", subc3.c3Header.payerId ?? (object)DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@PERIODD_MONTH", (object)paymonth ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@PERIOD_YEAR", (object)payyear ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_WAGES", (object)totalwages ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_SSCONTRIBUTIONS", subc3.c3Header.calcEmpSsAmt ?? (object)DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_LEVYEEEMPLOYEE", subc3.c3Header.calcEmpLevyAmt ?? (object)DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_LEVYEEEMPLOYER", (object)EmployerLevy ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_SERVAYANCE", subc3.c3Header.calcEmpPeAmt ?? (object)DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_LEVYEEPENALTY", subc3.c3Header.totalEmpLevyPenalty ?? (object)DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_PEPENALTY", subc3.c3Header.totalEmpPePenalty ?? (object)DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_SSPENALTY", subc3.c3Header.totalEmpSsFines ?? (object)DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@EmployerID", (object)compid ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@Insert_Datetimeinfo", parsedDate ?? (object)DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@ForDirector", 0);
                                                    insertC3Header.Parameters.AddWithValue("@Schedule_NO", subc3.c3Header.sequenceNo ?? (object)DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@Is_Fianalize", 1);
                                                    insertC3Header.Parameters.AddWithValue("@Is_submitted", 1);
                                                    insertC3Header.Parameters.AddWithValue("@IsUnLocked", (object)islocked ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@C3_IsFinalized", 1);
                                                    insertC3Header.Parameters.AddWithValue("@Inserted_By", (object)UserID ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@Modified_By", (object)UserID ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@Modified_Machineinfo", Helper.MachineInfo ?? (object)DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@Print_By", 0);
                                                    insertC3Header.Parameters.AddWithValue("@Export_By", 0);
                                                    insertC3Header.Parameters.AddWithValue("@IsImportFromBEMA", 1);
                                                    insertC3Header.Parameters.AddWithValue("@UserName", subc3.c3Header.submittedByName ?? (object)DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@Modified_On", DBNull.Value);  // or parsedModifiedOn if available
                                                    insertC3Header.Parameters.AddWithValue("@Export_On", DBNull.Value);    // or parsedExportOn if available
                                                    insertC3Header.Parameters.AddWithValue("@C3_SubmittedDate", parsedDate ?? (object)DBNull.Value);
                                                    if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                                                    int insert = insertC3Header.ExecuteNonQuery();
                                                    staticConnection.Close();
                                                    int C3HEADERID = 0;
                                                    if (insert == 1)
                                                    {
                                                        if (staticConnection.State == ConnectionState.Open)
                                                        {
                                                            staticConnection.Close();
                                                        }
                                                        SqlCommand selectC3Header = new SqlCommand("select max(C3HEADERID) C3HEADERID from PROCESS_C3Header", staticConnection);
                                                        if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                                                        SqlDataReader dr = selectC3Header.ExecuteReader();

                                                        while (dr.Read())
                                                        {
                                                            C3HEADERID = int.Parse(dr["C3HEADERID"].ToString());
                                                        }
                                                        staticConnection.Close();
                                                    }

                                                    if (subc3.ipWages != null)
                                                    {
                                                        if (staticConnection.State == ConnectionState.Open)
                                                        {
                                                            staticConnection.Close();
                                                        }
                                                        if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                                                        foreach (var ipWages in subc3.ipWages)
                                                        {
                                                            if (staticConnection.State == ConnectionState.Open)
                                                            {
                                                                staticConnection.Close();
                                                            }
                                                            string PayFreq = "M";
                                                            try
                                                            {
                                                                if (ipWages?.payPeriod?.Trim() == "1")
                                                                    PayFreq = "W";
                                                                if (ipWages?.payPeriod?.Trim() == "2")
                                                                    PayFreq = "E2W";
                                                                if (ipWages?.payPeriod?.Trim() == "3")
                                                                    PayFreq = "M";
                                                                if (ipWages?.payPeriod?.Trim() == "4")
                                                                    PayFreq = "2M";
                                                            }
                                                            catch (Exception ex)
                                                            {
                                                                throw ex;
                                                            }
                                                            //SqlCommand insertC3ipWages = new SqlCommand("INSERT [dbo].[Process_Contributions]([C3HEADERID],[SSN],[PERIODD_MONTH], [PERIOD_YEAR],[PayFreq], [WAGES1], [WAGES2],[WAGES3],  [WAGES4],  [WAGES5], [HPay],[BONUS], [DirectorWage], [WEEK1], [WEEK2],[WEEK3],  [WEEK4], [WEEK5], [Levyee], [SocialSecurity],[SocialSecurity_ER],[SocialSecurity_EE],[SERVAYANCE_EE],[SERVAYANCE_ER],[LEVY_ER],  [Date_joining], [Date_terminated],  [Remarks]) VALUES (" +
                                                            //     C3HEADERID + "," + ipWages.ssn + "," + (paymonth) + "," + payyear + ",'" + PayFreq + "'," + ipWages.wagesPaid1 + "," + ipWages.wagesPaid2 + "," + ipWages.wagesPaid3 + "," + ipWages.wagesPaid4 + "," + ipWages.wagesPaid5 + "," + ipWages.wagesPaid6 + "," + ipWages.wagesPaid7 + "," +
                                                            //     (0.00) + "," + ipWages.paidCode1 + "," + ipWages.paidCode2 + "," + ipWages.paidCode3 + "," + ipWages.paidCode4 + "," + ipWages.paidCode5 + "," + ipWages.ipLevyAmt + "," + (decimal.Parse(ipWages.erSsAmt) + decimal.Parse(ipWages.ipSsAmt) + decimal.Parse(ipWages.erEiAmt)) + "," +
                                                            //     ipWages.ipSsAmt + "," + ipWages.erSsAmt + "," + ipWages.erEiAmt + "," + ipWages.ipPeAmt + "," + ipWages.erLevyAmt + "," +
                                                            //     (ipWages.startDate != null && ipWages.startDate != "" ? ipWages.startDate : "null") + "," + (ipWages.endDate != null && ipWages.endDate != "" ? ipWages.endDate : "null") + "," + "null" + ")", staticConnection);


                                                            SqlCommand insertC3ipWages = new SqlCommand(@"
                                                            INSERT INTO [dbo].[Process_Contributions] (
                                                                [C3HEADERID], [SSN], [PERIODD_MONTH], [PERIOD_YEAR], [PayFreq],
                                                                [WAGES1], [WAGES2], [WAGES3], [WAGES4], [WAGES5],
                                                                [HPay], [BONUS], [DirectorWage],
                                                                [WEEK1], [WEEK2], [WEEK3], [WEEK4], [WEEK5],
                                                                [Levyee], [SocialSecurity],
                                                                [SocialSecurity_ER], [SocialSecurity_EE],
                                                                [SERVAYANCE_EE], [SERVAYANCE_ER], [LEVY_ER],
                                                                [Date_joining], [Date_terminated], [Remarks]
                                                            ) VALUES (
                                                                @C3HEADERID, @SSN, @PERIODD_MONTH, @PERIOD_YEAR, @PayFreq,
                                                                @WAGES1, @WAGES2, @WAGES3, @WAGES4, @WAGES5,
                                                                @HPay, @BONUS, @DirectorWage,
                                                                @WEEK1, @WEEK2, @WEEK3, @WEEK4, @WEEK5,
                                                                @Levyee, @SocialSecurity,
                                                                @SocialSecurity_ER, @SocialSecurity_EE,
                                                                @SERVAYANCE_EE, @SERVAYANCE_ER, @LEVY_ER,
                                                                @Date_joining, @Date_terminated, @Remarks
                                                            )", staticConnection);

                                                            // Optional helpers
                                                            decimal SafeDecimal(string input) => decimal.TryParse(input, out var d) ? d : 0;
                                                            DateTime? SafeDate(string input) =>
                                                                DateTime.TryParseExact(input, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var d) ? d : (DateTime?)null;

                                                            insertC3ipWages.Parameters.AddWithValue("@C3HEADERID", (object?)C3HEADERID ?? DBNull.Value);
                                                            insertC3ipWages.Parameters.AddWithValue("@SSN", (object?)ipWages?.ssn ?? DBNull.Value);
                                                            insertC3ipWages.Parameters.AddWithValue("@PERIODD_MONTH", (object?)paymonth ?? DBNull.Value);
                                                            insertC3ipWages.Parameters.AddWithValue("@PERIOD_YEAR", (object?)payyear ?? DBNull.Value);
                                                            insertC3ipWages.Parameters.AddWithValue("@PayFreq", (object?)PayFreq ?? DBNull.Value);

                                                            // Wages (safe casting)
                                                            insertC3ipWages.Parameters.AddWithValue("@WAGES1", ipWages?.wagesPaid1 ?? "0");
                                                            insertC3ipWages.Parameters.AddWithValue("@WAGES2", ipWages?.wagesPaid2 ?? "0");
                                                            insertC3ipWages.Parameters.AddWithValue("@WAGES3", ipWages?.wagesPaid3 ?? "0");
                                                            insertC3ipWages.Parameters.AddWithValue("@WAGES4", ipWages?.wagesPaid4 ?? "0");
                                                            insertC3ipWages.Parameters.AddWithValue("@WAGES5", ipWages?.wagesPaid5 ?? "0");
                                                            insertC3ipWages.Parameters.AddWithValue("@HPay", ipWages?.wagesPaid6 ?? "0");
                                                            insertC3ipWages.Parameters.AddWithValue("@BONUS", ipWages?.wagesPaid7 ?? "0");
                                                            insertC3ipWages.Parameters.AddWithValue("@DirectorWage", 0.00M); // static for now

                                                            // Weeks
                                                            insertC3ipWages.Parameters.AddWithValue("@WEEK1", ipWages?.paidCode1 ?? "0");
                                                            insertC3ipWages.Parameters.AddWithValue("@WEEK2", ipWages?.paidCode2 ?? "0");
                                                            insertC3ipWages.Parameters.AddWithValue("@WEEK3", ipWages?.paidCode3 ?? "0");
                                                            insertC3ipWages.Parameters.AddWithValue("@WEEK4", ipWages?.paidCode4 ?? "0");
                                                            insertC3ipWages.Parameters.AddWithValue("@WEEK5", ipWages?.paidCode5 ?? "0");

                                                            // Contribution Calculations
                                                            insertC3ipWages.Parameters.AddWithValue("@Levyee", ipWages?.ipLevyAmt ?? "0");
                                                            insertC3ipWages.Parameters.AddWithValue("@SocialSecurity",
                                                                SafeDecimal(ipWages?.ipSsAmt) + SafeDecimal(ipWages?.erSsAmt) + SafeDecimal(ipWages?.erEiAmt));

                                                            insertC3ipWages.Parameters.AddWithValue("@SocialSecurity_EE", SafeDecimal(ipWages?.ipSsAmt));
                                                            insertC3ipWages.Parameters.AddWithValue("@SocialSecurity_ER", SafeDecimal(ipWages?.erSsAmt));
                                                            insertC3ipWages.Parameters.AddWithValue("@SERVAYANCE_EE", SafeDecimal(ipWages?.erEiAmt));
                                                            insertC3ipWages.Parameters.AddWithValue("@SERVAYANCE_ER", SafeDecimal(ipWages?.ipPeAmt));
                                                            insertC3ipWages.Parameters.AddWithValue("@LEVY_ER", SafeDecimal(ipWages?.erLevyAmt));

                                                            // Dates
                                                            insertC3ipWages.Parameters.AddWithValue("@Date_joining", (object?)SafeDate(ipWages?.startDate) ?? DBNull.Value);
                                                            insertC3ipWages.Parameters.AddWithValue("@Date_terminated", (object?)SafeDate(ipWages?.endDate) ?? DBNull.Value);

                                                            // Remarks
                                                            insertC3ipWages.Parameters.AddWithValue("@Remarks", DBNull.Value);
                                                            if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                                                            int insertipWages = insertC3ipWages.ExecuteNonQuery();
                                                            staticConnection.Close();
                                                        }
                                                    }
                                                }

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    return "1";
                }
                else
                {
                    var customerJsonString = await response.Content.ReadAsStringAsync();
                    var Emp_model = JsonConvert.DeserializeObject<Apistatus>(customerJsonString);
                    return "0";
                }
            }
            catch (Exception ex)
            {
                return "";

            }
        }
        public async Task<string> DownloadNWSSubmittedC3_Click(string regno, int compid, string UserName, string Password, int UserID)
        {
            try
            {
                List<c3Headerbulk> C3Header = new List<c3Headerbulk>();
                int F_month = DateTime.Now.Month - 5;
                int T_month = DateTime.Now.Month;
                int year = DateTime.Now.Year;
                string S_year = year.ToString();
                string statedate = "01-" + (F_month) + "-" + S_year;
                string enddate = "01-" + (T_month) + "-" + (int.Parse(S_year)).ToString();
                string regn = regno;
                string Newsurl = _configuration["ServiceConfig:ServiceUriString"];
                //string NewsURL = Newsurl + "/C3/c3EmpSubmissionBulk";
                string NewsURL = Newsurl + "/C3/" + regn + "/C3Submitted/ER/range/" + statedate + "/" + enddate + ",NW";

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
                var plainTextBytes = _configuration["EnableBEMAAuthInsteadOfLocal"] == "1" ? System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + ":" + _configuration["ServiceConfig:AuthPass"]) : System.Text.Encoding.UTF8.GetBytes(UserName.Trim() + ":" + Password.Trim());
                string val = System.Convert.ToBase64String(plainTextBytes);
                httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + val);
                HttpResponseMessage response = httpClient.GetAsync(NewsURL).Result;
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var customerJsonString = await response.Content.ReadAsStringAsync();
                    var C3Header_model = JsonConvert.DeserializeObject<List<c3Header>>(customerJsonString);
                    C3Header_model = C3Header_model.Where(x => x.payerType == "ER").ToList();
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
                                SqlCommand cmdSSN = new SqlCommand("check_Director_C3Created", Get_C3staticConnection);
                                cmdSSN.CommandType = CommandType.StoredProcedure;
                                cmdSSN.Parameters.Add(new SqlParameter("@Month", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)(paymonth) ?? (object)DBNull.Value));
                                cmdSSN.Parameters.Add(new SqlParameter("@Year", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)payyear ?? (object)DBNull.Value));
                                cmdSSN.Parameters.Add(new SqlParameter("@CompanyId", SqlDbType.Int, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)compid ?? (object)DBNull.Value));
                                SqlDataAdapter sqlAdapterSSN = new SqlDataAdapter(cmdSSN);
                                DataTable dtSSN = new DataTable();
                                sqlAdapterSSN.Fill(dtSSN);
                                int schcount = 0;
                                if (dtSSN.Rows.Count > 0)
                                {

                                    foreach (DataRow row in dtSSN.Rows)
                                    {
                                        int scno = Convert.IsDBNull(row["Schedule_NO"]) ? 0 : int.Parse(row["Schedule_NO"].ToString());
                                        int hschid = header.sequenceNo;
                                        if (scno == hschid)
                                        {
                                            schcount++;
                                        }
                                    }
                                }
                                if (schcount == 0)
                                {
                                    //string Emp_surl = _configuration["ServiceUriString"];
                                    string Emp_surl = _configuration["ServiceConfig:ServiceUriString"];
                                    string Emp_sURL = Emp_surl + "/C3/" + header.payerId + "/C3Submitted/" + paymonth + "," + payyear + "," + header.sequenceNo + "," + header.payerType + ",NW";
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
                                    var getplainTextBytes = _configuration["EnableBEMAAuthInsteadOfLocal"] == "1" ? System.Text.Encoding.UTF8.GetBytes(_configuration["ServiceConfig:AuthUser"] + ":" + _configuration["ServiceConfig:AuthPass"]) : System.Text.Encoding.UTF8.GetBytes(UserName.Trim() + ":" + Password.Trim());
                                    string getval = System.Convert.ToBase64String(getplainTextBytes);
                                    gethttpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + getval);
                                    HttpResponseMessage getresponse = httpClient.GetAsync(Emp_sURL).Result;
                                    if (getresponse.StatusCode == HttpStatusCode.OK)
                                    {
                                        int mondays = MondaysInMonth(paymonth, payyear);
                                        bool IsWeekfifth = mondays == 5 ? true : false;
                                        var getcustomerJsonString = await getresponse.Content.ReadAsStringAsync();
                                        var submitC3_model = JsonConvert.DeserializeObject<submitC3string>(getcustomerJsonString);
                                        if (submitC3_model != null)
                                        {
                                            submitC3string subc3 = new submitC3string();
                                            subc3.c3Header = submitC3_model.c3Header;
                                            subc3.nonWorkingDirectorWages = submitC3_model.nonWorkingDirectorWages;// != null ? submitC3_model.nonWorkingDirectorWages.Where(x => x.sequenceNo == "1").ToList() : null;
                                            SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
                                            if (subc3.c3Header != null && subc3.nonWorkingDirectorWages != null)
                                            {
                                                if (subc3.nonWorkingDirectorWages.Count > 0)
                                                {
                                                    decimal totalwagesDir = 0;
                                                    foreach (var nonWDWage in subc3.nonWorkingDirectorWages)
                                                    {
                                                        totalwagesDir += decimal.Parse(nonWDWage.wages);

                                                    }
                                                    if (staticConnection.State == ConnectionState.Open)
                                                    {
                                                        staticConnection.Close();
                                                    }
                                                    //            SqlCommand insertC3Header = new SqlCommand("INSERT PROCESS_C3Header(RegNo,PERIODD_MONTH,PERIOD_YEAR,TOTAL_WAGES,TOTAL_SSCONTRIBUTIONS,TOTAL_LEVYEEEMPLOYEE,TOTAL_LEVYEEEMPLOYER,TOTAL_SERVAYANCE,TOTAL_LEVYEEPENALTY,TOTAL_PEPENALTY,TOTAL_SSPENALTY,EmployerID,Insert_Datetimeinfo,ForDirector,Schedule_NO,Is_Fianalize,Is_submitted,IsUnLocked,C3_IsFinalized,[Inserted_By],[Modified_By],[Modified_Machineinfo] ,[Print_By],[Export_By],[IsImportFromBEMA],[UserName],[Modified_On],[Export_On],C3_SubmittedDate)" +
                                                    //                                       "VALUES(" + subc3.c3Header.payerId + "," + (paymonth) + "," + payyear + "," + totalwagesDir + "," + subc3.c3Header.calcEmpSsAmt + "," + subc3.c3Header.calcEmpLevyAmt + "," + 0.00 + "," + subc3.c3Header.calcEmpPeAmt + "," + subc3.c3Header.totalEmpLevyPenalty + "," + subc3.c3Header.totalEmpPePenalty + "," +
                                                    //subc3.c3Header.totalEmpSsFines + "," + compid + ",'" + DateTime.ParseExact(subc3.c3Header.dateReceived, "dd/MM/yyyy", CultureInfo.InvariantCulture).ToString("yyyy-MM-dd") + "'," + 1 + "," + subc3.c3Header.sequenceNo + "," + 1 + "," + 1 + "," + islocked + "," + 1 + "," + UserID + "," + UserID + ",'" + Helper.MachineInfo + "'," + 0 + "," + 0 + "," + 1 + ",'" + subc3.c3Header.submittedByName + "','','','" + DateTime.ParseExact(subc3.c3Header.dateReceived, "dd/MM/yyyy", CultureInfo.InvariantCulture).ToString("yyyy-MM-dd") + "')", staticConnection);
                                                    DateTime? parsedDate = null;
                                                    if (!string.IsNullOrWhiteSpace(subc3?.c3Header?.dateReceived))
                                                    {
                                                        if (DateTime.TryParseExact(subc3.c3Header.dateReceived, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime tempDate))
                                                        {
                                                            parsedDate = tempDate;
                                                        }
                                                    }

                                                    // Create the SQL command
                                                    SqlCommand insertC3Header = new SqlCommand(@"
                                                    INSERT INTO PROCESS_C3Header (
                                                        RegNo, PERIODD_MONTH, PERIOD_YEAR, TOTAL_WAGES, TOTAL_SSCONTRIBUTIONS,
                                                        TOTAL_LEVYEEEMPLOYEE, TOTAL_LEVYEEEMPLOYER, TOTAL_SERVAYANCE, TOTAL_LEVYEEPENALTY,
                                                        TOTAL_PEPENALTY, TOTAL_SSPENALTY, EmployerID, Insert_Datetimeinfo, ForDirector,
                                                        Schedule_NO, Is_Fianalize, Is_submitted, IsUnLocked, C3_IsFinalized,
                                                        [Inserted_By], [Modified_By], [Modified_Machineinfo], [Print_By], [Export_By],
                                                        [IsImportFromBEMA], [UserName], [Modified_On], [Export_On], C3_SubmittedDate
                                                    )
                                                    VALUES (
                                                        @RegNo, @PERIODD_MONTH, @PERIOD_YEAR, @TOTAL_WAGES, @TOTAL_SSCONTRIBUTIONS,
                                                        @TOTAL_LEVYEEEMPLOYEE, @TOTAL_LEVYEEEMPLOYER, @TOTAL_SERVAYANCE, @TOTAL_LEVYEEPENALTY,
                                                        @TOTAL_PEPENALTY, @TOTAL_SSPENALTY, @EmployerID, @Insert_Datetimeinfo, @ForDirector,
                                                        @Schedule_NO, @Is_Fianalize, @Is_submitted, @IsUnLocked, @C3_IsFinalized,
                                                        @Inserted_By, @Modified_By, @Modified_Machineinfo, @Print_By, @Export_By,
                                                        @IsImportFromBEMA, @UserName, @Modified_On, @Export_On, @C3_SubmittedDate
                                                    )", staticConnection);

                                                    // Add parameters with null safety
                                                    insertC3Header.Parameters.AddWithValue("@RegNo", (object?)subc3?.c3Header?.payerId ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@PERIODD_MONTH", (object?)paymonth ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@PERIOD_YEAR", (object?)payyear ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_WAGES", (object?)totalwagesDir ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_SSCONTRIBUTIONS", (object?)subc3?.c3Header?.calcEmpSsAmt ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_LEVYEEEMPLOYEE", (object?)subc3?.c3Header?.calcEmpLevyAmt ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_LEVYEEEMPLOYER", 0.00M);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_SERVAYANCE", (object?)subc3?.c3Header?.calcEmpPeAmt ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_LEVYEEPENALTY", (object?)subc3?.c3Header?.totalEmpLevyPenalty ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_PEPENALTY", (object?)subc3?.c3Header?.totalEmpPePenalty ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@TOTAL_SSPENALTY", (object?)subc3?.c3Header?.totalEmpSsFines ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@EmployerID", (object?)compid ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@Insert_Datetimeinfo", (object?)parsedDate ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@ForDirector", 1);
                                                    insertC3Header.Parameters.AddWithValue("@Schedule_NO", (object?)subc3?.c3Header?.sequenceNo ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@Is_Fianalize", 1);
                                                    insertC3Header.Parameters.AddWithValue("@Is_submitted", 1);
                                                    insertC3Header.Parameters.AddWithValue("@IsUnLocked", (object?)islocked ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@C3_IsFinalized", 1);
                                                    insertC3Header.Parameters.AddWithValue("@Inserted_By", (object?)UserID ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@Modified_By", (object?)UserID ?? DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@Modified_Machineinfo", Helper.MachineInfo ?? (object)DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@Print_By", 0);
                                                    insertC3Header.Parameters.AddWithValue("@Export_By", 0);
                                                    insertC3Header.Parameters.AddWithValue("@IsImportFromBEMA", 1);
                                                    insertC3Header.Parameters.AddWithValue("@UserName", subc3?.c3Header?.submittedByName ?? (object)DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@Modified_On", DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@Export_On", DBNull.Value);
                                                    insertC3Header.Parameters.AddWithValue("@C3_SubmittedDate", (object?)parsedDate ?? DBNull.Value);
                                                    if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                                                    int insert = insertC3Header.ExecuteNonQuery();
                                                    staticConnection.Close();
                                                    int C3HEADERID = 0;
                                                    if (insert == 1)
                                                    {
                                                        if (staticConnection.State == ConnectionState.Open)
                                                        {
                                                            staticConnection.Close();
                                                        }
                                                        SqlCommand selectC3Header = new SqlCommand("select max(C3HEADERID) C3HEADERID from PROCESS_C3Header", staticConnection);
                                                        if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                                                        SqlDataReader dr = selectC3Header.ExecuteReader();

                                                        while (dr.Read())
                                                        {
                                                            C3HEADERID = int.Parse(dr["C3HEADERID"].ToString());
                                                        }
                                                        staticConnection.Close();
                                                    }

                                                    if (subc3.nonWorkingDirectorWages != null)
                                                    {
                                                        if (staticConnection.State == ConnectionState.Open)
                                                        {
                                                            staticConnection.Close();
                                                        }
                                                        if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                                                        foreach (var nonWDWages in subc3.nonWorkingDirectorWages)
                                                        {
                                                            if (staticConnection.State == ConnectionState.Open)
                                                            {
                                                                staticConnection.Close();
                                                            }
                                                            string PayFreq = "M";
                                                            try
                                                            {
                                                                //if (nonWDWages.payPeriod.Trim() == "1")
                                                                //  PayFreq = "W";
                                                                //if (nonWDWages.payPeriod.Trim() == "2")
                                                                //  PayFreq = "E2/W";
                                                                //if (nonWDWages.payPeriod.Trim() == "3")
                                                                //  PayFreq = "M";
                                                                //if (nonWDWages.payPeriod.Trim() == "4")
                                                                //  PayFreq = "2/M";
                                                            }
                                                            catch (Exception ex)
                                                            {
                                                                string controller = "UnknownController";
                                                                string action = "UnknownAction";
                                                                var context = ExceptionMiddleware1.GetActionInfo();
                                                                controller = context.Controller;
                                                                action = context.Action;
                                                                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                                                                throw ex;
                                                            }
                                                            int empid = 0;
                                                            List<BLMasterEmployee> employeelist = new List<BLMasterEmployee>();
                                                            employeelist = BLMasterEmployee.MasterNWDirectorCollection_grid(compid).ToList();
                                                            empid = employeelist != null ? employeelist.Any(x => x.SocSecNum == nonWDWages.ssn) ? (int)employeelist.FirstOrDefault(x => x.SocSecNum == nonWDWages.ssn).EmployeeID : 0 : 0;
                                                            if (empid > 0)
                                                            {
                                                                //SqlCommand insertC3ipWages = new SqlCommand("INSERT [dbo].[Process_Contributions]([C3HEADERID],[SSN],[PERIODD_MONTH], [PERIOD_YEAR],[PayFreq], [WAGES1], [WAGES2],[WAGES3],  [WAGES4],  [WAGES5], [HPay],[BONUS], [DirectorWage], [WEEK1], [WEEK2],[WEEK3],  [WEEK4], [WEEK5], [Levyee], [SocialSecurity],  [Date_joining], [Date_terminated],  [Remarks],[SSND]) VALUES (" +
                                                                //  C3HEADERID + "," + empid + "," + (paymonth) + "," + payyear + ",'" + PayFreq + "'," + (0.00) + "," + (0.00) + "," + (0.00) + "," + (IsWeekfifth ? (0.00M) : decimal.Parse(nonWDWages.wages)) + "," + (IsWeekfifth ? decimal.Parse(nonWDWages.wages) : (0.00M)) + "," + (0.00) + "," + (0.00) + "," +
                                                                //  (nonWDWages.wages) + "," + 0 + "," + 0 + "," + 0 + "," + (IsWeekfifth ? 0 : 1) + "," + (IsWeekfifth ? 1 : 0) + "," + nonWDWages.levyAmt + "," +
                                                                //  (0.00) + "," + (nonWDWages.startDate != null && nonWDWages.startDate != "" ? DateTime.Parse(nonWDWages.startDate).ToShortDateString() : "null") + "," + (nonWDWages.endDate != null && nonWDWages.endDate != "" ? DateTime.Parse(nonWDWages.endDate).ToShortDateString() : "null") + "," + "null" + "," + nonWDWages.ssn + ")", staticConnection);
                                                                DateTime? startDate = null, endDate = null;
                                                                if (!string.IsNullOrWhiteSpace(nonWDWages.startDate) &&
                                                                    DateTime.TryParseExact(nonWDWages.startDate, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime tempStart))
                                                                    startDate = tempStart;

                                                                if (!string.IsNullOrWhiteSpace(nonWDWages.endDate) &&
                                                                    DateTime.TryParseExact(nonWDWages.endDate, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime tempEnd))
                                                                    endDate = tempEnd;

                                                                // Safely parse nonWDWages.wages
                                                                decimal directorWage = 0;
                                                                decimal.TryParse(nonWDWages.wages, out directorWage);

                                                                // Determine WAGES4 and WAGES5 based on IsWeekfifth
                                                                decimal wages4 = IsWeekfifth ? 0.00M : directorWage;
                                                                decimal wages5 = IsWeekfifth ? directorWage : 0.00M;

                                                                // Prepare the insert command with parameters
                                                                SqlCommand insertC3ipWages = new SqlCommand(@"
                                                                INSERT INTO [dbo].[Process_Contributions] (
                                                                    [C3HEADERID], [SSN], [PERIODD_MONTH], [PERIOD_YEAR], [PayFreq],
                                                                    [WAGES1], [WAGES2], [WAGES3], [WAGES4], [WAGES5], [HPay], [BONUS],
                                                                    [DirectorWage], [WEEK1], [WEEK2], [WEEK3], [WEEK4], [WEEK5],
                                                                    [Levyee], [SocialSecurity], [Date_joining], [Date_terminated], [Remarks], [SSND]
                                                                ) VALUES (
                                                                    @C3HEADERID, @SSN, @PERIODD_MONTH, @PERIOD_YEAR, @PayFreq,
                                                                    @WAGES1, @WAGES2, @WAGES3, @WAGES4, @WAGES5, @HPay, @BONUS,
                                                                    @DirectorWage, @WEEK1, @WEEK2, @WEEK3, @WEEK4, @WEEK5,
                                                                    @Levyee, @SocialSecurity, @Date_joining, @Date_terminated, @Remarks, @SSND
                                                                )", staticConnection);

                                                                // Add parameters safely
                                                                insertC3ipWages.Parameters.AddWithValue("@C3HEADERID", C3HEADERID);
                                                                insertC3ipWages.Parameters.AddWithValue("@SSN", (object)empid ?? DBNull.Value);
                                                                insertC3ipWages.Parameters.AddWithValue("@PERIODD_MONTH", (object)paymonth ?? DBNull.Value);
                                                                insertC3ipWages.Parameters.AddWithValue("@PERIOD_YEAR", (object)payyear ?? DBNull.Value);
                                                                insertC3ipWages.Parameters.AddWithValue("@PayFreq", PayFreq ?? (object)DBNull.Value);

                                                                insertC3ipWages.Parameters.AddWithValue("@WAGES1", 0.00M);
                                                                insertC3ipWages.Parameters.AddWithValue("@WAGES2", 0.00M);
                                                                insertC3ipWages.Parameters.AddWithValue("@WAGES3", 0.00M);
                                                                insertC3ipWages.Parameters.AddWithValue("@WAGES4", wages4);
                                                                insertC3ipWages.Parameters.AddWithValue("@WAGES5", wages5);
                                                                insertC3ipWages.Parameters.AddWithValue("@HPay", 0.00M);
                                                                insertC3ipWages.Parameters.AddWithValue("@BONUS", 0.00M);
                                                                insertC3ipWages.Parameters.AddWithValue("@DirectorWage", directorWage);

                                                                insertC3ipWages.Parameters.AddWithValue("@WEEK1", 0);
                                                                insertC3ipWages.Parameters.AddWithValue("@WEEK2", 0);
                                                                insertC3ipWages.Parameters.AddWithValue("@WEEK3", 0);
                                                                insertC3ipWages.Parameters.AddWithValue("@WEEK4", IsWeekfifth ? 0 : 1);
                                                                insertC3ipWages.Parameters.AddWithValue("@WEEK5", IsWeekfifth ? 1 : 0);

                                                                insertC3ipWages.Parameters.AddWithValue("@Levyee", (object?)nonWDWages.levyAmt ?? DBNull.Value);
                                                                insertC3ipWages.Parameters.AddWithValue("@SocialSecurity", 0.00M);
                                                                insertC3ipWages.Parameters.AddWithValue("@Date_joining", (object?)startDate ?? DBNull.Value);
                                                                insertC3ipWages.Parameters.AddWithValue("@Date_terminated", (object?)endDate ?? DBNull.Value);
                                                                insertC3ipWages.Parameters.AddWithValue("@Remarks", DBNull.Value); // Set if needed
                                                                insertC3ipWages.Parameters.AddWithValue("@SSND", nonWDWages.ssn ?? (object)DBNull.Value);
                                                                if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                                                                int insertipWages = insertC3ipWages.ExecuteNonQuery();
                                                                staticConnection.Close();
                                                            }

                                                        }
                                                    }
                                                }


                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return "1";
                }
                else
                {
                    var customerJsonString = await response.Content.ReadAsStringAsync();
                    var Emp_model = JsonConvert.DeserializeObject<Apistatus>(customerJsonString);
                    return "0";
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

                return "";

            }
        }
        private bool SaveBase64Image(string base64String, string folderPath, string fileName)
        {
            // Ensure the folder exists
            try
            {
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var base64Data = base64String.Split(',')[1];

                base64Data = base64Data.Replace("\n", "").Replace("\r", "").Trim();

                int padding = base64Data.Length % 4;
                if (padding > 0)
                {
                    base64Data = base64Data.PadRight(base64Data.Length + (4 - padding), '=');
                }

                // Convert the Base64 string to a byte array
                byte[] imageBytes = Convert.FromBase64String(base64Data);

                // Define the full file path (including the folder and file name)
                string filePath = Path.Combine(folderPath, fileName);

                // Write the byte array to the file
                File.WriteAllBytes(filePath, imageBytes);
                return true;
            }
            catch (Exception ex)
            {
                string controller = "UnknownController";
                string action = "UnknownAction";
                var context = ExceptionMiddleware1.GetActionInfo();
                controller = context.Controller;
                action = context.Action;
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return false;
            }


        }
        private string? GetIncome_Wages_Catagory_Self_Employed(string Wages_Catagory)
        {
            int index = Convert.ToInt32(Wages_Catagory);
            string income = "0.00";
            SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
            SqlCommand cmd = new SqlCommand("Get_Wages_Catagory_List", staticConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            sqlAdapter.Fill(ds);
            DataTable dtMRS = new DataTable();
            dtMRS = ds.Tables[0];
            if (dtMRS.Rows.Count > 0)
            {
                if (dtMRS.Rows.Count >= index)
                {
                    income = Convert.IsDBNull(dtMRS.Rows[index]["WeeklyIncome"]) ? "0.00" : decimal.Parse(String.Format("{0:0.00}", float.Parse(dtMRS.Rows[index]["WeeklyIncome"].ToString()))).ToString();
                }
            }
            return income;
        }
        public static int MondaysInMonth(int CmbMonth, int CmbYear)
        {
            int weeks = 0;
            int daysThisMonth = DateTime.DaysInMonth(CmbYear, CmbMonth);
            DateTime beginingOfThisMonth = new DateTime(CmbYear, CmbMonth, 1);
            for (int i = 0; i < daysThisMonth; i++)
                if (beginingOfThisMonth.AddDays(i).DayOfWeek == DayOfWeek.Monday)
                    weeks++;
            return weeks;
        }
        public class success
        {
            public string message { get; set; }
            public bool status { get; set; }
        }

        public class successpwd
        {
            public string Code { get; set; }
            public string Message { get; set; }
            public string Resolution { get; set; }
        }

        public class Apistatus
        {
            public string httpStatus { get; set; }
            public string message { get; set; }
            public string timeStamp { get; set; }
            public string path { get; set; }
            public string error { get; set; }
            public string status { get; set; }
        }
    }
}

