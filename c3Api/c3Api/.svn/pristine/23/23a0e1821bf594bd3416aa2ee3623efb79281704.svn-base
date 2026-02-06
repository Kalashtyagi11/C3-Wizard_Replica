using C3Wizard.COMMONPROP;
using C3WizardData.Models;
using C3WizardHelper.ViewModels;
using C3WizardLayer.BusinessObjects;
using C3WizardLayer.DataObjects;
using C3WizardRepository.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Reporting.NETCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Data;
using System.Runtime.Intrinsics.X86;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace C3WIZARDWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class SelfEmpContributionController : ControllerBase
    {

        private readonly SelpEmpContributionRepo _selpEmpContributionRepo;
        private readonly C3wizardContext _context;


        //private readonly ConnectionInfo ConnectionInfo;
        public SelfEmpContributionController(SelpEmpContributionRepo SelpEmpContributionRepo,C3wizardContext context)
        {
            _selpEmpContributionRepo = SelpEmpContributionRepo;
            _context = context;

        }

        [HttpPost("ChangeSelpEmpContribution")]
        public async Task<IActionResult> ChangeSelpEmpContribution(selfEmpVm chgObj)//(decimal wincome, decimal wcontribution, decimal wage_amt, decimal stw, decimal totalWadeges, decimal textLevyPenalty, decimal textTotalWagesNLevy, decimal levyee, int monthNo, int year)
        {
            try
            {

                if (chgObj == null ||
            chgObj.wincome == null ||
            chgObj.wcontribution == null ||
            chgObj.dropNo == null ||
            chgObj.obj_list == null || chgObj.obj_list.Count == 0 ||
            chgObj.obj_list[0].TotalWadeges == null ||
            chgObj.textLevyPenalty == null ||
            chgObj.textTotalWagesNLevy == null ||
            chgObj.obj_list[0].LEVYEE == null ||
            chgObj.month == null ||
            chgObj.year == null)
                {
                    return BadRequest("One or more required fields are null.");
                }


                decimal? wagesAmount = chgObj.indexListNo switch
                {
                    1 => chgObj.obj_list[0].WAGES1,
                    2 => chgObj.obj_list[0].WAGES2,
                    3 => chgObj.obj_list[0].WAGES3,
                    4 => chgObj.obj_list[0].WAGES4,
                    5 => chgObj.obj_list[0].WAGES5,
                    _ => 0
                };


                var data = await _selpEmpContributionRepo.BindCountribution(chgObj.wincome ?? 0, chgObj.wcontribution ?? 0, wagesAmount ?? 0, chgObj.dropNo, chgObj.obj_list[0].TotalWadeges ?? 0, Convert.ToDecimal(chgObj.textLevyPenalty ?? "0"), Convert.ToDecimal(chgObj.textTotalWagesNLevy ?? "0"), chgObj.obj_list[0].LEVYEE ?? 0, chgObj.month, Convert.ToInt32(chgObj.year));

                if (data != null)
                {
                    //        "data": {
                    //          "totalWadeges": null,
                    //  "levyee": null,
                    //  "textTotalWages": "733.00",
                    //  "textTotalWagesNLevy": -468,
                    //  "textLevyPenalty": 0,
                    //  "textTotalAccountantGeneral": -468,
                    //  "gridAmount": 0
                    //},
                    chgObj.obj_list[0].TotalWadeges = Convert.ToDecimal(data.TextTotalWages ?? "0");
                    chgObj.obj_list[0].LEVYEE = Convert.ToDecimal(data.TextTotalWagesNLevy ?? 0);
                    chgObj.textTotalWages = data.TextTotalWages;
                    chgObj.textTotalWagesNLevy = data.TextTotalWagesNLevy?.ToString();
                    chgObj.textLevyPenalty = data.TextLevyPenalty?.ToString();
                    chgObj.textTotalAccountantGeneral = data.TextTotalAccountantGeneral?.ToString();

                    switch (chgObj.indexListNo)
                    {
                        case 1: chgObj.obj_list[0].WAGES1 = data.gridAmount; chgObj.obj_list[0].tempWAGES1 = data.gridAmount; chgObj.obj_list[0].SelectedTypeWEEK1 = chgObj.dropNo; break;
                        case 2: chgObj.obj_list[0].WAGES2 = data.gridAmount; chgObj.obj_list[0].tempWAGES2 = data.gridAmount; chgObj.obj_list[0].SelectedTypeWEEK2 = chgObj.dropNo; break;
                        case 3: chgObj.obj_list[0].WAGES3 = data.gridAmount; chgObj.obj_list[0].tempWAGES3 = data.gridAmount; chgObj.obj_list[0].SelectedTypeWEEK3 = chgObj.dropNo; break;
                        case 4: chgObj.obj_list[0].WAGES4 = data.gridAmount; chgObj.obj_list[0].tempWAGES4 = data.gridAmount; chgObj.obj_list[0].SelectedTypeWEEK4 = chgObj.dropNo; break;
                        case 5: chgObj.obj_list[0].WAGES5 = data.gridAmount; chgObj.obj_list[0].tempWAGES5 = data.gridAmount; chgObj.obj_list[0].SelectedTypeWEEK5 = chgObj.dropNo; break;
                    }

                    return Ok(new ResponseModel { Status = true, Message = "Data Found..!", Data = chgObj });
                }
                return NotFound(new ResponseModel { Status = false, Message = "Data Not Found..!", Data = null });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                return Ok(new ResponseModel { Status = false, Message = "Something Went Wrong..!", Data = null });
            }
        }

        [AllowAnonymous]
        [HttpGet("SearchSelpEmpContribution")]
        public async Task<IActionResult> SearchSelpEmpContribution(int month, int Year, int CompanyId, int? SEC3ID)
        {
            try
            {
                var data = await _selpEmpContributionRepo.btn_SearchSelfEmpContribution(month, Year, CompanyId, SEC3ID);

                try
                {
                    var ReturnData = JsonConvert.DeserializeObject<selfEmpVm>(data);

                    if (ReturnData.obj_list.Count != 0)
                    {
                        return Ok(new ResponseModel { Status = true, Message = "Data Found..!", Data = ReturnData });
                    }
                }
                catch (JsonException ex)
                {
                    //if (data.Contains("Already"))
                    //{

                    //  var existData = await _selpEmpContributionRepo.Editload_defaults(Convert.ToInt32(data.Split("-")[1]), CompanyId);
                    //  if (existData.obj_list != null && existData.obj_list.Count != 0)
                    //  {
                    //    var upObj = new SaveSelEmpVM();
                    //    upObj.obj_list = existData.obj_list;
                    //    upObj.SSNofEmp = Convert.ToInt32(existData.ssNofEmp);
                    //    upObj.UserName = existData.userName;
                    //    upObj.TextLevyPenalty = existData.textLevyPenalty;
                    //    upObj.H_Id = Convert.ToInt32(data.Split("-")[1]);
                    //    upObj.textTotalWages

                    //    return Ok(new ResponseModel { Status = true, Message = "Self employed C3 already exists", Data = existData });
                    //  }

                    //}
                    var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                    LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                    return NotFound(new ResponseModel { Status = false, Message = data, Data = null });
                }
                return NotFound(new ResponseModel { Status = false, Message = "Data Not Found..!", Data = null });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                return Ok(new ResponseModel { Status = false, Message = "Something Went Wrong..!", Data = null });
            }
        }




        [AllowAnonymous]
        [HttpPost("SaveSelfEmployeeContribution")]
        public async Task<IActionResult> SaveSelfEmployeeContribution(SaveSelEmpVM obj)
        {
            try
            {
                string errormessage = "";
                if (obj.month == -1)
                { errormessage = errormessage + "Month" + "\n"; }
                if (obj.Year == -1)
                { errormessage = errormessage + "Year" + "\n"; }
                if (errormessage != "")
                {
                    //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                    //C3WizardMessageBox.Show("C3 Wizard", "Please enter required field value." + "\n" + errormessage);

                    return BadRequest(new { status = false, msg = "C3 Wizard\", \"Please enter required field value.\" + \"\\n\" + errormessage" });
                }

                var msg = await _selpEmpContributionRepo.Save_button_Click(obj.month, obj.Year, obj.H_Id, obj.SSNofEmp, obj.UserName, obj.UserID, obj.obj_list, obj.TextLevyPenalty);
                if (msg == "false")
                {
                    return BadRequest(new
                    {
                        status = false,
                        msg = msg,
                    });
                }
                else
                {
                    var msgSplit = msg?.Split(",");
                    return Ok(new
                    {
                        status = true,
                        msg = msgSplit[0],
                        hid = Convert.ToInt32(msgSplit[1])
                    });
                }
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                return StatusCode(500,ex.Message);
            }

        }


        [HttpGet("MainGridSelfEmpContribution")]
        public async Task<IActionResult> MainGridSelfEmpContribution(int CompanyId)
        {

            try
            {
                List<BLSelfEmployed> emplist = BLSelfEmployed.SelfEmployedCollection().ToList();
                string ssN = emplist.FirstOrDefault(x => x.EmployeeID == CompanyId).SocSecNum;

                var data = await _selpEmpContributionRepo.load_defaults(ssN);
                if (data.Count != 0 && data != null)
                {
                    return Ok(new
                    {
                        status = true,
                        msg = "data found",
                        data = data
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        status = false,
                        msg = "data not found",
                    });
                }
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                return StatusCode(500,ex.Message);
            }


        }

        [HttpGet("DeleteSelfEmpContribution")]
        public async Task<IActionResult> DeleteSelfEmpContribution(int headerId)
        {
            try
            {
                var isSubmitted = _context.ProcessSelfEmployedC3s.FirstOrDefault(p => p.Sec3id == headerId);
                if ((isSubmitted?.IsSubmitted ?? false) || (isSubmitted?.IsSentForEdit ?? false))
                {
                    return BadRequest(new ResponseModel
                    {
                        Status = true,  // Indicate success
                        Message = "Deletion is not allowed as this record has already been submitted for SSB.",
                        Data = "",
                        Statuscode = 200
                    });
                }

                var msg = await _selpEmpContributionRepo.C3Report_Delete_Click(headerId);
                if (msg != "false")
                {
                    return Ok(new
                    {
                        status = true,
                        msg = msg,

                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        status = false,
                        msg = "data not found",
                    });
                }
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("DownloadSelfC3Pdf")]
        public async Task<IActionResult> DownloadDirectorC3Pdf(string month, string year, int sec3Id,bool ispaid,bool isDraft)
        {
            try
            {
                var dt = new DataTable();
                using (SqlConnection con = new SqlConnection(C3WizardLayerConn_BaseData.StaticSqlConnection.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Generate_Self_Employed_C3_Report", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add(new SqlParameter("@Month", SqlDbType.VarChar, 50) { Value = (object)month ?? DBNull.Value });
                        cmd.Parameters.Add(new SqlParameter("@Year", SqlDbType.VarChar, 50) { Value = (object)year ?? DBNull.Value });
                        cmd.Parameters.Add(new SqlParameter("@SEC3ID", SqlDbType.Int) { Value = sec3Id });

                        await con.OpenAsync();
                        SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                        adapter.Fill(dt);
                        await con.CloseAsync();
                    }
                }

                if (dt.Rows.Count == 0)
                    return NotFound("No data returned from stored procedure.");

                string rdlcFile = "SelfEmployedC3Report.rdlc";
                string reportPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Report", rdlcFile);

                if (!System.IO.File.Exists(reportPath))
                    return BadRequest("RDLC file not found at: " + reportPath);

                LocalReport report = new LocalReport();
                report.ReportPath = reportPath;
                report.DataSources.Add(new ReportDataSource("C3Report", dt));
                
                report.EnableExternalImages = true;

                string imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Paid.png");
                string watermarkImage = "";

                if (ispaid && System.IO.File.Exists(imagePath))
                {
                    // Use file:// URI path
                    watermarkImage = "file:///" + imagePath.Replace("\\", "/");
                }
                if(isDraft)
                {
                    string imagePathd = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Draft.png");
                    watermarkImage = "file:///" + imagePathd.Replace("\\", "/");
                }
                report.SetParameters(new ReportParameter("WatermarkImage", watermarkImage));
                byte[] pdfBytes = report.Render("PDF");
                return File(pdfBytes, "application/pdf", $"SelfC3Report_{month}_{year}.pdf");
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                return BadRequest("Error generating PDF: " + ex.Message);
            }
        }
        [HttpGet("ReprtsdataSelfAndDashboard")]
        public async Task<IActionResult> ReprtsdataSelfAndDashboard(int month, string year, int SEC3ID)
        {
            try
            {
                var report = await _selpEmpContributionRepo.check_batch_created(month, year, SEC3ID);

                var Paymentdetails = _context.OnlinePayments.Where(e => e.C3HeaderId == SEC3ID && (e.PaymentStatus == "AUTHORIZED" || e.PaymentStatus == "Offline Payment") && e.IsActive && e.TransactionFor == "Self").OrderByDescending(f => f.Id).Select(r => new { r.CreateTime, r.bimaReceiptNumber,r.Id }).FirstOrDefault();

                if (Paymentdetails!=null)
                {
                    report.ForEach(r => { r.receiptNumber = Paymentdetails.bimaReceiptNumber ?? Paymentdetails.Id.ToString("D6"); r.receiptDate = Paymentdetails.CreateTime; });

                }
                if (report != null && report.Count != 0)
                {
                    return Ok(new
                    {
                        status = true,
                        msg = "data Found",
                        data = report

                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        status = false,
                        msg = "data not found",
                        data = "[]"
                    });
                }
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                return StatusCode(500,ex.Message);
            }
        }


        [HttpGet("ReprtsdataSelfSearach")]
        public async Task<IActionResult> ReprtsdataSelfSearach(int Fmonth, int Tmonth, string year, int CompanyId)
        {
            try
            {

                if (Fmonth != -1)
                {
                    if (Tmonth != -1)
                    {
                        if (Fmonth > Tmonth)
                        {
                            //Mouse.OverrideCursor = System.Windows.Input.Cursors.Arrow;
                            //C3WizardMessageBox.Show("C3 Wizard", "Selected 'To Month' should be greater than or equal to 'From Month'");

                            return BadRequest(new
                            {
                                status = false,
                                msg = "Selected 'To Month' should be greater than or equal to 'From Month'",
                                data = "[]"
                            });
                        }
                    }

                }
                var report = await _selpEmpContributionRepo.btn_Search_ReprtsSelfEmp(Fmonth, Tmonth, year, CompanyId);
                if (report != null && report.Count != 0)
                {
                    return Ok(new
                    {
                        status = true,
                        msg = "data Found",
                        data = report

                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        status = false,
                        msg = "data not found",
                        data = "[]"
                    });
                }
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                return StatusCode(500,ex.Message);
            }
        }


        [HttpGet("EditListingSelfContibution")]
        public async Task<IActionResult> EditListingSelfContibution(int H_Id, int CompanyId)
        {
            try
            {
                var data = await _selpEmpContributionRepo.Editload_defaults(H_Id, CompanyId);
                if (data.obj_list != null && data.obj_list.Count != 0)
                {
                    return Ok(new
                    {
                        status = true,
                        msg = "data Found",
                        data = data

                    });
                }

                return NotFound(new ResponseModel { Status = false, Message = "Data Not Found..!", Data = null });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                return Ok(new ResponseModel { Status = false, Message = "Something Went Wrong..!", Data = null });
            }
        }



    }
}
