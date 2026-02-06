using C3Wizard.COMMONPROP;
using C3WizardData.Models;
using C3WizardHelper.ViewModels;
using C3WizardLayer.BusinessObjects;
using C3WizardLayer.DataObjects;
using C3WizardRepository.Repository;
using iText.Commons.Actions.Contexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Newtonsoft.Json;
using PayPal.Api;
using System.ComponentModel.Design;
using System.Data;
using System.IO;
using System.Reflection;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace C3WIZARDWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class DashBoardController : ControllerBase
    {

        private readonly DashBoardRepo _DashBoardRepo;
        private readonly C3wizardContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly RepoC3 _C3;


        //private readonly ConnectionInfo ConnectionInfo;
        public DashBoardController(DashBoardRepo DashBoardRepo, IWebHostEnvironment env, RepoC3 c3)
        {
            _DashBoardRepo = DashBoardRepo;
            _env = env;
            _C3 = c3;

        }


      

        [HttpGet("FillCompanyDropdown")]
        public async Task<IActionResult> FillCompanyDropdown(int ParentId,int UserID, int roleId)
        {
            //int userid = Helper.UserID;
            try
            {
                SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
                if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();
                //DataSet dataSet = new DataSet();
                DataTable dt = new DataTable();
               // SqlCommand cmdEmployerList = new SqlCommand("SELECT mc.Company_Id,mc.REG_NUMBER,  Company_Name, mc.Parent_Id  FROM MasterCompany mc WHERE mc.Isactive=1 And mc.Company_Id = " + ParentId + "OR Parent_Id =" + ParentId + "", staticConnection);
                SqlCommand cmdEmployerList = new SqlCommand("SELECT mc.Company_Id,mc.CompanyLogo,mc.REG_NUMBER,mc.Company_Name,mc.Parent_Id FROM MasterCompany mc INNER JOIN SECUsersProfile ta ON mc.Company_Id = ta.EmpId WHERE mc.Isactive = 1 and ta.IsActive=1 AND ta.UserId =" + UserID + "", staticConnection);
                cmdEmployerList.CommandType = CommandType.Text;
                SqlDataAdapter adapter = new SqlDataAdapter();
                adapter.SelectCommand = cmdEmployerList;
                //adapter.Fill(dataSet);
                adapter.Fill(dt);
                staticConnection.Close();
                //cmbEmployer.ItemsSource = dataSet.Tables[0].DefaultView;
                //cmbEmployer.DisplayMemberPath = dataSet.Tables[0].Columns["Company_Name"].ToString();
                //cmbEmployer.SelectedValuePath = dataSet.Tables[0].Columns["Company_Id"].ToString();

                //  Bindselectedcompanyname(ParentId, UserID);

                var dropdownList = dt.AsEnumerable().Select(row => new
                {
                    Company_Id = row["Company_Id"],
                    REG_NUMBER = row["REG_NUMBER"],
                    CompanyLogo = $"{Request.Scheme}://{Request.Host}/CompanyLogo/{row["CompanyLogo"]}",
                    Company_Name = row["Company_Name"],
                    Parent_Id = row["Parent_Id"]
                }).ToList();


                //string filePath = Path.Combine(Path.Combine(_env.ContentRootPath, "wwwroot\\MenuList"), "MenuC3.xml");
                //var Menu = await _DashBoardRepo.MenuList(filePath, roleId);


                //var resultSet = new
                //{
                //    dropdown = dropdownList,
                //    //RegNo = RegNo,
                //    //Address = Address,
                //    //IsLevyExempt = IsLevyExempt,
                //    //MenuList = Menu

                //};


                return Ok(new ResponseModel { Status = true, Message = "data  found..!", Data = dropdownList });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return Conflict(new ResponseModel { Status = false, Message = "Something Went Wrong..!", Data = null });
            }

        }
        string RegNo = "", Address = "", CompanyLogo = "";
        bool? IsLevyExempt = false;
        private void Bindselectedcompanyname(int CompanyId, int UserID)
        {
            try
            {
                SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
                SqlCommand CurrentCompany = new SqlCommand("SELECT mc.Company_Id, mc.REG_NUMBER, mc.Address1, mc.Address2, mc.City, mc.State, mc.ZIP, mc.CompanyLogo, mc.IsLevyExempt, C.Name FROM MasterCompany mc, Country c WHERE mc.Isactive = 1 And mc.Company_Id = " + CompanyId + " And mc.Country=c.ConId", staticConnection);
                if (staticConnection.State == System.Data.ConnectionState.Closed) staticConnection.Open();

                SqlDataReader dr = CurrentCompany.ExecuteReader();

                while (dr.Read())
                {
                    //companyid = dr["Company_Id"].ToString();
                    RegNo = dr["REG_NUMBER"].ToString();
                    Address = dr["Address1"].ToString() + " " + dr["City"].ToString() + " " + dr["State"].ToString() + " " + dr["Name"].ToString() + " " + dr["ZIP"].ToString();
                    CompanyLogo = dr["CompanyLogo"].ToString();
                    IsLevyExempt = (bool?)dr["IsLevyExempt"];
                    //bool IsLevyExempt = Helper.IsLevyExempt;
                }
                staticConnection.Close();
                //cmbEmployer.SelectedValue = int.Parse(companyid);
                //Txt_Registration_No = RegNo;
                //Txt_Address = Address;
                List<BLSECUsers> blList_ALL = new List<BLSECUsers>();
                List<BLSECUsers> blList = new List<BLSECUsers>();

                blList_ALL = BLSECUsers.SECUsersCollection().ToList();
                blList = blList_ALL.Where(t => t.UserId == UserID).ToList();
                if (blList.Count == 1)
                {
                    try
                    {
                        CompanyLogo = string.IsNullOrEmpty(blList.ElementAt(0).ProfileImage) ? "" : blList.ElementAt(0).ProfileImage.ToString();
                        if (CompanyLogo != null && CompanyLogo != "")
                        {
                            var applicationPath = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
                            //var uri = new Uri(applicationPath + "/UserImage/" + CompanyLogo);
                            //var bitmap = new BitmapImage(uri);
                            //image.ImageSource = bitmap;
                            CompanyLogo = Path.Combine(applicationPath + "/UserImage/" + CompanyLogo);
                        }
                        else
                        {
                            //var uri = new Uri("pack://application:,,,/Images/user.jpg");
                            //var bitmap = new BitmapImage(uri);
                            //image.ImageSource = bitmap;
                            CompanyLogo = Path.Combine("pack://application:,,,/Images/user.jpg");
                        }
                    }
                    catch (Exception ex)
                    {
                        //Login login = new Login();
                        //login.Error_Log(ex.Message);

                    }

                }
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                //Login login = new Login();
                //login.Error_Log(ex.Message);

            }
        }




        [HttpGet("load_dashboard")]
        public async Task<IActionResult> load_dashboard(int CompanyId, int? Year, int? endYear, string? ResultArea, int? FromMonth, int? ToMonth)
        {
            try
            {

                int? StartMonths = null;
                int? endMonths = null;
                //if (FromMonth != null && FromMonth > 0)
                //{
                //    StartMonths = FromMonth;

                //}
                //if (ToMonth != null && ToMonth > 0)
                //{
                //    endMonths = ToMonth;
                //}

                // 1. FromMonth >= and ToMonth is null
                if (FromMonth != null && FromMonth > 0 && (ToMonth == null || ToMonth <= 0))
                {
                    StartMonths = FromMonth;
                    endMonths = null; // No upper bound
                }
                // 2. FromMonth >= and ToMonth <=
                else if (FromMonth != null && FromMonth > 0 && ToMonth != null && ToMonth > 0)
                {
                    StartMonths = FromMonth;
                    endMonths = ToMonth;
                }
                // 3. FromMonth is null and ToMonth <=
                else if ((FromMonth == null || FromMonth <= 0) && ToMonth != null && ToMonth > 0)
                {
                    StartMonths = null;
                    endMonths = ToMonth;
                }
                // 4. FromMonth is null and ToMonth is null
                else if ((FromMonth == null || FromMonth <= 0) && (ToMonth == null || ToMonth <= 0))
                {
                    StartMonths = null;
                    endMonths = null;
                }
                int? StartYear = null;
                int? EndYear = null;

                // --- Year Logic ---
                if (Year != null && Year > 0 && (endYear == null || endYear <= 0))
                {
                    StartYear = Year;
                    EndYear = null;
                }
                else if (Year != null && Year > 0 && endYear != null && endYear > 0)
                {
                    StartYear = Year;
                    EndYear = endYear;
                }
                else if ((Year == null || Year <= 0) && endYear != null && endYear > 0)
                {
                    StartYear = null;
                    EndYear = endYear;
                }
                else if ((Year == null || Year <= 0) && (endYear == null || endYear <= 0))
                {
                    StartYear = null;
                    EndYear = null;
                }
                var data = await _DashBoardRepo.load_dashboard(CompanyId, StartMonths, endMonths, StartYear, EndYear, ResultArea);
                var ss = new
                {
                    //data[0].Key.ToString() = data
                    EmployeesContribution = data.FirstOrDefault(e => e.Key == "EmployeesContribution")?.Value,
                    total = data.FirstOrDefault(e => e.Key == "total")?.Value,
                    unPaid = data.FirstOrDefault(e => e.Key == "unPaid")?.Value,
                    paidMonths = data.FirstOrDefault(e => e.Key == "paidMonths")?.Value,
                    unPaidMonths = data.FirstOrDefault(e => e.Key == "unPaidMonths")?.Value,
                    Pendingc3 = data.FirstOrDefault(e => e.Key == "Pendingc3")?.Value,
                    Pendingc3Foreground = data.FirstOrDefault(e => e.Key == "Pendingc3Foreground")?.Value,
                    dashboard_list = JsonConvert.DeserializeObject<List<C3HeaderVM>>(data.FirstOrDefault(e => e.Key == "dashboard_list")?.Value ?? "[]"),// as  List<C3Header>,
                    DirectorsContribution = data.FirstOrDefault(e => e.Key == "DirectorsContribution")?.Value,
                    Director_total = data.FirstOrDefault(e => e.Key == "Director_total")?.Value,
                    unPaidDir = data.FirstOrDefault(e => e.Key == "unPaidDir")?.Value,
                    paidMonthsDir = data.FirstOrDefault(e => e.Key == "paidMonthsDir")?.Value,
                    unPaidMonthsDir = data.FirstOrDefault(e => e.Key == "unPaidMonthsDir")?.Value,

                    DirectorsPendingC3 = data.FirstOrDefault(e => e.Key == "DirectorsPendingC3")?.Value,
                    DirectorsPendingC3Foreground = data.FirstOrDefault(e => e.Key == "DirectorsPendingC3Foreground")?.Value,
                    Director_dashboard_list = JsonConvert.DeserializeObject<List<C3HeaderVM>>(data.FirstOrDefault(e => e.Key == "Director_dashboard_list")?.Value ?? "[]"),

                };


                //await load_dashboard1(CompanyId);

                return Ok(new ResponseModel { Status = true, Message = "data  found..!", Data = ss });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new ResponseModel { Status = false, Message = "Something Went Wrong..!", Data = ex });
            }

        }



        [HttpPost("isC3satusChange")]
        public async Task<IActionResult> unSubmitC3(string notes, int headerId, int companyId, int userId, string type)
        {

            try
            {
                if (string.IsNullOrWhiteSpace(notes) || headerId == 0 || companyId == 0)
                {
                    return BadRequest("please fill All fields");
                }

                var dataC3h = await _DashBoardRepo.statusChangeMainC3Table(headerId, companyId, notes, userId, type);
                if (dataC3h?.Item1==true)
                {
                    return Ok(new { status = true, msg = "status change successfully.." });
                }
                else if(dataC3h?.Item1 == false &&dataC3h?.Item2=="")
                {
                    return BadRequest(new { status = false, msg = "c3 status change failed" });
                }
                else
                {
                    if (dataC3h?.Item2 != ""&&dataC3h?.Item2!=null)
                    {
                        return BadRequest(new { status = false, msg = dataC3h.Item2 });
                    }
                    return BadRequest(new { status = false, msg = "Modification is not allowed as C3 has already been finalized" });
                }
                   
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new ResponseModel { Status = false, Message = "Something Went Wrong..!", Data = ex });
            }
        }


        [HttpGet("GetUnSubmitNotes")]
        public async Task<IActionResult> GetUnSubmitNotes(int headerId, string type)
        {
            var response = new ResponseModel();

            try
            {
                if (headerId > 0)
                {
                    var note = await _DashBoardRepo.getNotesC3(headerId, type);

                    if (!string.IsNullOrEmpty(note))
                    {
                        var parts = note.Split(',', StringSplitOptions.RemoveEmptyEntries);

                        var notesArray = new List<string>();
                        var currentNote = "";

                        foreach (var part in parts)
                        {
                            var trimmed = part.Trim();


                            if (DateTime.TryParseExact(trimmed, "dd/MMM/yyyy",
                                    System.Globalization.CultureInfo.InvariantCulture,
                                    System.Globalization.DateTimeStyles.None, out _))
                            {

                                if (!string.IsNullOrEmpty(currentNote))
                                {
                                    notesArray.Add(currentNote.Trim());
                                }
                                currentNote = trimmed;
                            }
                            else
                            {

                                currentNote += ", " + trimmed;
                            }
                        }


                        if (!string.IsNullOrEmpty(currentNote))
                            notesArray.Add(currentNote.Trim());

                        //Sort date-wise (desc)
                        notesArray = notesArray
                            .OrderByDescending(n =>
                            {
                                var datePart = n.Split(',')[0].Trim();
                                DateTime.TryParseExact(datePart, "dd/MMM/yyyy",
                                    System.Globalization.CultureInfo.InvariantCulture,
                                    System.Globalization.DateTimeStyles.None, out var parsedDate);
                                return parsedDate;
                            })
                            .ToList();


                        response.Status = true;
                        response.Statuscode = 200;
                        response.Data = notesArray;
                        response.Message = "Fetched successfully.";
                        return Ok(response);
                    }
                    else
                    {
                        response.Status = false;
                        response.Statuscode = 404;
                        response.Message = "No records found.";
                        return NotFound(response);
                    }
                }
                else
                {
                    response.Status = false;
                    response.Statuscode = 400;
                    response.Message = "Invalid request parameters.";
                    return BadRequest(response);

                }


            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                response.Status = false;
                response.Statuscode = 500;
                response.Message = $"An error occurred: {ex.Message}";

                return StatusCode(500, response);
            }
        }


        [HttpGet("AdminDashBoardMaster")]
        //[EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> AdminDashBoardMaster()
        {

            try
            {
                var data = await _DashBoardRepo.AdminDashBoard();

                return Ok(new ResponseModel { Status = true, Message = "data  found..!", Data = data });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new ResponseModel { Status = false, Message = "Something Went Wrong..!", Data = ex });
            }

        }

        [HttpGet("AdminRoleWiseMenu")]
        public async Task<IActionResult> AdminRoleWiseMenu(int roleId)
        {
            try
            {
                //string filePath = Path.Combine(Path.Combine(_env.ContentRootPath, "wwwroot\\MenuList"), "MenuC3.xml");
                var Menu = await _DashBoardRepo.MenuList(roleId);
                return Ok(new ResponseModel { Status = true, Message = "data  found..!", Data = Menu });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return Conflict(new ResponseModel { Status = false, Message = "Something Went Wrong..!", Data = null });
            }
        }


        [HttpPost("SaveRoleMapping")]
        public async Task<IActionResult> SaveRoleMapping([FromBody] List<MenuItem> menuList)
        {
            try
            {

                var msg = await _DashBoardRepo.SaveOrUpdateROles(menuList);
                if (msg == "-1")
                {
                    return Conflict(new ResponseModel { Status = false, Message = "Roles Permission Failed.", Data = null });
                }
                return Ok(new ResponseModel { Status = true, Message = msg, Data = null });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new ResponseModel { Status = false, Message = "Something Went Wrong..!", Data = ex });
            }


        }


        [HttpGet("DeleteRoleMapping")]
        public async Task<ResponseModel> DeleteRoleMapping(int ModuleId)
        {
            var response = new ResponseModel();

            try
            {

                var existing = await _context.SecuserModules.FirstOrDefaultAsync(x => x.ModuleId == ModuleId);
                if (existing != null)
                {
                    _context.SecuserModules.Remove(existing);
                    await _context.SaveChangesAsync();

                }
                response.Status = true;
                response.Statuscode = 200;
                response.Data = existing;
                response.Message = "Deleted successfully!";
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                response.Status = false;
                response.Statuscode = 500;
                response.Message = $"Error updating role: {ex.Message}";
            }

            return response;
        }


    }
}
