using C3Wizard.COMMONPROP;
using C3WizardData.Models;
using C3WizardHelper.ViewModels;
using C3WizardLayer.BusinessObjects;
using C3WizardLayer.DataObjects;
using C3WizardRepository.Common;
using C3WizardRepository.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.SqlServer.Server;
using Newtonsoft.Json;
using System.Data;
using static C3WizardRepository.Repository.RepoRegisterCompany;
using System.Globalization;
using System.Net;
using static System.Net.Mime.MediaTypeNames;
using System.ComponentModel.Design;
using Microsoft.AspNetCore.Authorization;
using CrystalDecisions.Shared;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Security.AccessControl;
using System.Text.Json;
using PayPal.Api;


namespace C3WIZARDWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SelfUserManagementController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly RepoSelfUserManagement _repoSelfUserManagement;
        private readonly C3wizardContext _wizardContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public SelfUserManagementController(IConfiguration configuration, RepoSelfUserManagement repoSelfUserManagement, C3wizardContext wizardContext, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _repoSelfUserManagement = repoSelfUserManagement;
            _wizardContext = wizardContext;
            _httpContextAccessor = httpContextAccessor;

        }

        [HttpGet("GetSelfUserManagement")]
        public async Task<IActionResult> GetSelfUserManagement(int UserId)
        {
            try
            {
                var data = await _repoSelfUserManagement.GetSelfUserManagement(UserId);

                if (data == null)
                {
                    return NotFound(new { message = "User not found", userId = UserId });
                }

                return Ok(data);
            }
            catch (SqlException sqlEx)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, sqlEx.Message, sqlEx.StackTrace);
                return StatusCode(500, new { message = "Database error occurred.", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        [HttpPost("UpdateSelfUserManagement")]
        public async Task<IActionResult> UpdateSelfUserManagement([FromForm] UserImagePost selfusermanagement)
        {
            try
            {
                var data = await _repoSelfUserManagement.UpdateSelfUserManagement(selfusermanagement);

                if (data == null)
                {
                    return NotFound(new { message = "User not found", userId = selfusermanagement.userId });
                }

                return Ok(data);
            }
            catch (SqlException sqlEx)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, sqlEx.Message, sqlEx.StackTrace);
                return StatusCode(500, new { message = "Database error occurred.", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        [HttpGet("GetSelfEmployedReports")]
        public async Task<IActionResult> GetSelfEmployedReports(int CompanyId)
        {
            try
            {
                var data = await _repoSelfUserManagement.GetSelfEmployedReports(CompanyId);

                if (data == null)
                {
                    return NotFound(new { Message = "User not found", CompanyId = CompanyId });
                }

                return Ok(data);
            }
            catch (SqlException sqlEx)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, sqlEx.Message, sqlEx.StackTrace);
                return StatusCode(500, new { message = "Database error occurred.", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        [HttpGet("SelfImportLastC3")]
        public async Task<IActionResult> SelfImportLastC3(string email, string password, string companyid, int userid)
        {
            try
            {
                var data = await _repoSelfUserManagement.SelfImportLastC3(email, password, companyid, userid);

                if (data == null)
                {
                    return NotFound(new { Message = "User not found", CompanyId = companyid });
                }

                return Ok(data);
            }
            catch (SqlException sqlEx)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, sqlEx.Message, sqlEx.StackTrace);
                return StatusCode(500, new { message = "Database error occurred.", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        [HttpGet("SelfDownloadSubmittedC3")]
        public async Task<IActionResult> SelfDownloadSubmittedC3(string email, string password, string companyid, int userid, int fmonths, int tomonths, int year)
        {
            try
            {
                var data = await _repoSelfUserManagement.SelfDownloadSubmittedC3(email, password, companyid, userid, fmonths, tomonths, year);

                if (data == null)
                {
                    return NotFound(new { Message = "User not found", CompanyId = companyid });
                }

                return Ok(data);
            }
            catch (SqlException sqlEx)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, sqlEx.Message, sqlEx.StackTrace);
                return StatusCode(500, new { message = "Database error occurred.", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        //bool is_dashboard = false;
        //[HttpGet("check_batch_created")]
        //public async Task<IActionResult> check_batch_created(string Month, string year, int SEC3ID, bool is_dash)
        //{
        //    //close_button.Visibility = Visibility.Visible;
        //    //ReportDataSource reportDataSource = new ReportDataSource();
        //    DataTable dt = new DataTable();
        //    is_dashboard = is_dash;
        //    SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
        //    SqlCommand cmd = new SqlCommand("Generate_Self_Employed_C3_Report", staticConnection);
        //    cmd.Parameters.Add(new SqlParameter("@Month", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)Month ?? (object)DBNull.Value));
        //    cmd.Parameters.Add(new SqlParameter("@Year", SqlDbType.VarChar, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)year ?? (object)DBNull.Value));
        //    cmd.Parameters.Add(new SqlParameter("@SEC3ID", SqlDbType.Int, 50, ParameterDirection.Input, false, 0, 0, "", DataRowVersion.Proposed, (object)SEC3ID ?? (object)DBNull.Value));
        //    cmd.CommandType = CommandType.StoredProcedure;
        //    SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
        //    sqlAdapter.Fill(dt);

        //    return Ok(dt);
        //    //ReportDataSource rprtDTSource = new ReportDataSource("C3Report", dt);
        //    //reportDataSource.Name = "CustomerReport"; // Name of the DataSet we set in .rdlc
        //    //reportViewer.LocalReport.ReportPath = Helper.ApplicationPath("SelfEmployedC3Report.rdlc");  // Path of the rdlc file
        //    //reportViewer.LocalReport.DataSources.Add(rprtDTSource);
        //    //reportViewer.SetDisplayMode(Microsoft.Reporting.WinForms.DisplayMode.PrintLayout);
        //    //reportViewer.ZoomMode = ZoomMode.Percent;
        //    //reportViewer.ZoomPercent = 100;
        //    //reportViewer.RefreshReport();
        //}
        [HttpGet("ReportPreview")]
        public async Task<IActionResult> ReportPreview([FromQuery] string month, [FromQuery] string year, [FromQuery] int? sec3Id)
        {
            try
            {
                List<SelfEmployedReport> reportData = await _repoSelfUserManagement.GenerateSelfEmployedReport(month, year, sec3Id);
                if (reportData.Count == 0)
                    return NotFound("No data found");

                return Ok(reportData);
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("GetUserAuditTrail")]
        public async Task<IActionResult> GetUserAuditTrail(int CompanyId)
        {
            try
            {
                var data = await _repoSelfUserManagement.GetUSERAUDITTRAIL(CompanyId);

                if (data == null)
                {
                    return NotFound(new { Message = "User not found", CompanyId = CompanyId });
                }

                return Ok(data);
            }
            catch (SqlException sqlEx)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, sqlEx.Message, sqlEx.StackTrace);
                return StatusCode(500, new { message = "Database error occurred.", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);

                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        //[HttpGet("GetLoggedInHistory")]
        //public async Task<IActionResult> GetLoggedInHistory(int CompanyId,bool IsSelfEmployed)
        //{
        //    try
        //    {
        //       // SqlConnection staticConnection = C3WizardLayerConn_BaseData.StaticSqlConnection; C3WizardLayerConn_BaseData.SetAuditSessionContextAsync(staticConnection);
        //        List<BLLoginLog> loginlist = new List<BLLoginLog>();
        //        loginlist = BLLoginLog.LoginCollection(CompanyId, IsSelfEmployed).ToList();
        //        if (loginlist != null && loginlist.Any()) // Check if data exists
        //        {
        //            return Ok(new ResponseModel
        //            {
        //                Status = true,
        //                Message = "Login logs retrieved successfully.",
        //                Data = loginlist,
        //                Statuscode = 200
        //            });
        //        }
        //        else
        //        {
        //            return NotFound(new ResponseModel
        //            {
        //                Status = false,
        //                Message = "No login logs found.",
        //                Data = null,
        //                Statuscode = 404
        //            });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new ResponseModel
        //        {
        //            Status = false,
        //            Message = $"Internal server error: {ex.Message}",
        //            Data = null,
        //            Statuscode = 500
        //        });
        //    }
        //}
        [AllowAnonymous]
        [HttpGet]
        [Route("GetLoggedInHistory")]
        public async Task<IActionResult> GetLoggedInHistory(int companyId, bool isSelfEmployed, int pageNumber, int pageSize)
        {
            try
            {
                // Validate page number and page size
                //if (pageNumber < 1) pageNumber = 1;
                //if (pageSize < 1) pageSize = 10;
                if (pageNumber < 0) pageNumber = 0;
                if (pageSize < 1) pageSize = 10;

                // Fetch total records count
                int totalRecords = BLLoginLog.LoginCollection(companyId, isSelfEmployed).Count();

                // Apply pagination using Skip() and Take()
                //List<BLLoginLog> loginList = BLLoginLog.LoginCollection(companyId, isSelfEmployed)
                //    .Skip((pageNumber - 1) * pageSize)
                //    .Take(pageSize)
                //    .ToList();
                List<BLLoginLog> loginList = BLLoginLog.LoginCollection(companyId, isSelfEmployed)
                       .Skip(pageNumber * pageSize)
                       .Take(pageSize)
                       .ToList();

                if (loginList.Any())
                {
                    return Ok(new ResponseModel
                    {
                        Status = true,
                        Message = "Login logs retrieved successfully.",
                        Data = new
                        {
                            TotalRecords = totalRecords,
                            PageNumber = pageNumber,
                            PageSize = pageSize,
                            TotalPages = (int)Math.Ceiling((double)totalRecords / pageSize),
                            Records = loginList
                        },
                        Statuscode = 200
                    });
                }
                else
                {
                    return NotFound(new ResponseModel
                    {
                        Status = false,
                        Message = "No login logs found.",
                        Data = null,
                        Statuscode = 404
                    });
                }
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new ResponseModel
                {
                    Status = false,
                    Message = $"Internal server error: {ex.Message}",
                    Data = null,
                    Statuscode = 500
                });
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("AllDetailsAuditLog")]
        public async Task<IActionResult> AllDetailsAuditLog(string? EventType, DateTime? FromDate, DateTime? ToDate, int? UserId)
        {
            try
            {
                var AllRecords = _repoSelfUserManagement.LogList(UserId).OrderBy(a => a.EventType).OrderByDescending(a => a.CreatedOn);

                //if (!string.IsNullOrEmpty(EventType))
                //{
                //    AllRecords = AllRecords.Where(a => (a.EventType + "").Contains(EventType)).OrderBy(a => a.EventType).OrderByDescending(a => a.CreatedOn);
                //}
                if (FromDate != null)
                {
                    AllRecords = AllRecords.Where(a => a.CreatedOn > FromDate).OrderBy(a => a.EventType).OrderByDescending(a => a.CreatedOn);
                }
                if (ToDate != null)
                {
                    ToDate = Convert.ToDateTime(ToDate).AddDays(1);
                    AllRecords = AllRecords.Where(a => a.CreatedOn < ToDate).OrderBy(a => a.EventType).OrderByDescending(a => a.CreatedOn);
                }
                if (AllRecords.Any())
                {
                    return Ok(new ResponseModel
                    {
                        Status = true,
                        Message = "AllRecords retrieved successfully.",
                        Data = AllRecords,
                        Statuscode = 200
                    });
                }
                else
                {
                    return NotFound(new ResponseModel
                    {
                        Status = false,
                        Message = "No audit logs found.",
                        Data = null,
                        Statuscode = 404
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseModel
                {
                    Status = false,
                    Message = $"Internal server error: {ex.Message}",
                    Data = null,
                    Statuscode = 500
                });
            }

        }
        [AllowAnonymous]
        [HttpGet]
        [Route("AllDetailsAuditLogPgn")]
        public async Task<IActionResult> AllDetailsAuditLogPgn(string? EventType, DateTime? FromDate, DateTime? ToDate, int? UserId, int pageNumber, int pageSize)
        {
            try
            {
                //if (pageNumber < 1) pageNumber = 1;
                //if (pageSize < 1) pageSize = 10;
                if (pageNumber < 0) pageNumber = 0;
                if (pageSize < 1) pageSize = 10;

                var AllRecords = _repoSelfUserManagement.LogList(UserId).OrderBy(a => a.EventType).OrderByDescending(a => a.CreatedOn);

                //if (!string.IsNullOrEmpty(EventType))
                //{
                //    AllRecords = AllRecords.Where(a => (a.EventType + "").Contains(EventType)).OrderBy(a => a.EventType).OrderByDescending(a => a.CreatedOn);
                //}
                if (FromDate != null)
                {
                    AllRecords = AllRecords.Where(a => a.CreatedOn > FromDate).OrderBy(a => a.EventType).OrderByDescending(a => a.CreatedOn);
                }
                if (ToDate != null)
                {
                    ToDate = Convert.ToDateTime(ToDate).AddDays(1);
                    AllRecords = AllRecords.Where(a => a.CreatedOn < ToDate).OrderBy(a => a.EventType).OrderByDescending(a => a.CreatedOn);
                }
                //if (AllRecords.Any())
                //{
                //  return Ok(new ResponseModel
                //  {
                //    Status = true,
                //    Message = "AllRecords retrieved successfully.",
                //    Data = AllRecords,
                //    Statuscode = 200
                //  });
                //}
                int totalRecords = AllRecords.Count();
                int totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

                // Apply pagination
                //var pagedCompanies = AllRecords
                //    .Skip((pageNumber - 1) * pageSize)
                //    .Take(pageSize)
                //    .ToList();
                var pagedCompanies = AllRecords
                       .Skip(pageNumber * pageSize)
                       .Take(pageSize)
                       .ToList();

                if (pagedCompanies.Any())
                {
                    return Ok(new ResponseModel
                    {
                        Message = "Data retrieved successfully!",
                        Statuscode = 200,
                        Status = true,
                        Data = new
                        {
                            TotalRecords = totalRecords,
                            PageNumber = pageNumber,
                            PageSize = pageSize,
                            TotalPages = totalPages,
                            Records = pagedCompanies
                        }
                    });
                }
                else
                {
                    return NotFound(new ResponseModel
                    {
                        Status = false,
                        Message = "No audit logs found.",
                        Data = null,
                        Statuscode = 404
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseModel
                {
                    Status = false,
                    Message = $"Internal server error: {ex.Message}",
                    Data = null,
                    Statuscode = 500
                });
            }

        }
        //public class AuditEntry
        //{
        //    public AuditEntry(EntityEntry entry)
        //    {
        //        Entry = entry;
        //    }

        //    public EntityEntry Entry { get; }
        //    public string TableName { get; set; }
        //    public string Action { get; set; }
        //    public string ChangedBy { get; set; }
        //    public DateTime ChangedOn { get; set; }
        //    public Dictionary<string, object> OldValues { get; } = new();
        //    public Dictionary<string, object> NewValues { get; } = new();
        //    public List<PropertyEntry> TemporaryProperties { get; } = new();

        //    public bool HasTemporaryProperties => TemporaryProperties.Any();

        //    public AuditLog ToAuditLog()
        //    {
        //        var keyNames = Entry.Metadata.FindPrimaryKey().Properties
        //                         .Select(p => p.Name);
        //        var keyValues = keyNames.ToDictionary(name => name, name => Entry.Property(name).CurrentValue);

        //        return new AuditLog
        //        {
        //            TableName = TableName,
        //            Action = Action,
        //            Ipaddress = System.Text.Json.JsonSerializer.Serialize(keyValues),
        //            OldValue = OldValues.Any() ? System.Text.Json.JsonSerializer.Serialize(OldValues) : null,
        //            NewValue = NewValues.Any() ? System.Text.Json.JsonSerializer.Serialize(NewValues) : null,
        //            CreatedBy = int.Parse(ChangedBy),
        //            CreatedOn = ChangedOn
        //        };
        //    }
        //}

        //public override int SaveChanges()
        //{
        //    OnBeforeSaveChanges();
        //    return SaveChanges();
        //}
        //public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        //{
        //    OnBeforeSaveChanges();
        //    return await SaveChangesAsync(cancellationToken);
        //}
        //private void OnBeforeSaveChanges()
        //{
        //    var auditEntries = new List<AuditEntry>();
        //    foreach (var entry in ChangeTracker.Entries())
        //    {
        //        if (entry.Entity is AuditLog || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
        //            continue;

        //        var auditEntry = new AuditEntry(entry);
        //        auditEntry.TableName = entry.Entity.GetType().Name;
        //        auditEntry.Action = entry.State.ToString();
        //        auditEntry.ChangedBy = _httpContextAccessor.HttpContext?.User?.FindFirst("UserId")?.Value ?? "0";
        //        auditEntry.ChangedOn = DateTime.UtcNow;

        //        foreach (var property in entry.Properties)
        //        {
        //            string propertyName = property.Metadata.Name;
        //            if (property.IsTemporary)
        //            {
        //                auditEntry.TemporaryProperties.Add(property);
        //                continue;
        //            }

        //            switch (entry.State)
        //            {
        //                case EntityState.Added:
        //                    auditEntry.NewValues[propertyName] = property.CurrentValue;
        //                    break;

        //                case EntityState.Deleted:
        //                    auditEntry.OldValues[propertyName] = property.OriginalValue;
        //                    break;

        //                case EntityState.Modified:
        //                    if (property.IsModified)
        //                    {
        //                        auditEntry.OldValues[propertyName] = property.OriginalValue;
        //                        auditEntry.NewValues[propertyName] = property.CurrentValue;
        //                    }
        //                    break;
        //            }
        //        }

        //        auditEntries.Add(auditEntry);
        //    }

        //    // Save audit logs after saving main changes (in SaveChanges)
        //    foreach (var auditEntry in auditEntries)
        //    {
        //        AuditLog.Add(auditEntry.ToAuditLog());
        //    }
        //}

        //public int SaveChangesUserId(int userId)
        //{
        //    try
        //    {
        //        var httpContext = _httpContextAccessor.HttpContext;

        //        var path = httpContext.Request.Path.Value ?? "";

        //        bool isApiRoute = path.Contains("/api/", StringComparison.OrdinalIgnoreCase);

        //        //int userId = isApiRoute ? userid : AppUserManager.GetUserId();
        //        //var modified = ChangeTracker.Entries().Where(e => e.State == EntityState.Modified || e.State == EntityState.Added || e.State == EntityState.Deleted);
        //        var auditEntries = new List<AuditLog>();
        //        var entries = ChangeTracker.Entries().Where(e => e.Entity is BaseEntity && (e.State == EntityState.Added || e.State == EntityState.Modified || e.State ==EntityState.Deleted));
        //        foreach (DbEntityEntry item in modified)
        //        {
        //            var changedOrAddedItem = item.Entity as BaseEntity;
        //            if (changedOrAddedItem != null)
        //            {
        //                if (item.State == EntityState.Added)
        //                {
        //                    changedOrAddedItem.CreatedBy = userId;
        //                    changedOrAddedItem.CreatedOn = DateTime.Now;
        //                    changedOrAddedItem.IsActive = true;
        //                }
        //                // For each changed record, get the audit record entries and add them
        //                try
        //                {
        //                    foreach (AuditLog x in GetAuditRecordsForChange(item, userId))
        //                    {
        //                        AuditLog.Add(x);
        //                    }
        //                }
        //                catch (Exception ex)
        //                {
        //                    //TODO: Track db errors
        //                    //AddErrors(ex);
        //                   throw  ex.Message;
        //                }
        //                changedOrAddedItem.ModifiedBy = userId;
        //                changedOrAddedItem.ModifiedOn = DateTime.Now;
        //                changedOrAddedItem.SourceData = route == true ? 2 : 1;
        //            }
        //        }
        //        base.SaveChanges();
        //        return 1;
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //        //TODO: Track db errors
        //        foreach (var eve in e.EntityValidationErrors)
        //        {
        //            Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
        //                eve.Entry.Entity.GetType().Name, eve.Entry.State);
        //            foreach (var ve in eve.ValidationErrors)
        //            {
        //                Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
        //                    ve.PropertyName, ve.ErrorMessage);
        //            }
        //        }
        //        //AddErrors(e);
        //        throw e;
        //    }
        //    catch (Exception ex)
        //    {
        //        //TODO: Track db errors
        //        //AddErrors(ex);
        //        throw ex;
        //    }
        //    return 0;
        //}
        //private System.Collections.Generic.List<AuditLog> GetAuditRecordsForChange(DbEntityEntry dbEntry, int userId)
        //{
        //    C3wizardContext db = new C3wizardContext();
        //    try
        //    {
        //        System.Collections.Generic.List<AuditLog> result = new System.Collections.Generic.List<AuditLog>();
        //        string area = string.Empty;
        //        string action = string.Empty;
        //        string controller = string.Empty;
        //        Int32 keyName = 0;
        //        var IpAddressCheck = "";
        //        string Url = string.Empty;
        //        DateTime changeTime = DateTime.UtcNow;
        //        var m = HttpContext.Current;
        //        if (m == null)
        //        {
        //            area = string.Empty;
        //            action = string.Empty;
        //            controller = string.Empty;
        //            IpAddressCheck = "";
        //        }
        //        else
        //        {

        //            var route = HttpContext.Current.Request.RequestContext.RouteData.Values;
        //            var keysList = route.Keys.ToList(); // Convert keys to a list
        //            var keyAtIndex0 = keysList[0]; // Accessing the key at index 0
        //            var valueAtIndex0 = route[keyAtIndex0];

        //            if (keyAtIndex0 == "MS_SubRoutes")
        //            {
        //                int userId1 = AppUserManager.GetUserId();
        //                var modified = ChangeTracker.Entries().Where(e => e.State == EntityState.Modified || e.State == EntityState.Added || e.State == EntityState.Deleted);
        //                foreach (DbEntityEntry item in modified)
        //                {
        //                    var changedOrAddedItem = item.Entity as BaseEntity;
        //                    if (changedOrAddedItem != null)
        //                    {
        //                        changedOrAddedItem.CreatedBy = userId;
        //                        changedOrAddedItem.CreatedOn = DateTime.Now;
        //                        changedOrAddedItem.IsActive = true;
        //                        changedOrAddedItem.ModifiedBy = userId;
        //                        changedOrAddedItem.ModifiedOn = DateTime.Now;
        //                    }
        //                }
        //                //base.SaveChanges();
        //                return result;
        //            }
        //            action = route["action"].ToString();
        //            controller = route["controller"].ToString();
        //            var routingValues = System.Web.Routing.RouteTable.Routes.GetRouteData(new HttpContextWrapper(HttpContext.Current)).Values;
        //            area = (string)routingValues["area"];
        //            Url = HttpContext.Current.Request.RawUrl;

        //            IpAddressCheck = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] ?? HttpContext.Current.Request.UserHostAddress;
        //        }
        //        // Get the Table() attribute, if one exists
        //        TableAttribute tableAttr = dbEntry.Entity.GetType().GetCustomAttributes(typeof(TableAttribute), false).SingleOrDefault() as TableAttribute;
        //        // Get table name (if it has a Table attribute, use that, otherwise get the pluralized name)
        //        string tableName = GetTableName(dbEntry);// tableAttr != null ? tableAttr.Name : dbEntry.Entity.GetType().FullName;
        //        if (tableName == "Users")
        //        {
        //            tableName = tableAttr != null ? tableAttr.Name : dbEntry.Entity.GetType().Name;
        //        }
        //        if (tableName.Contains("_") && (tableName.Contains("UserProfile") || tableName.Contains("AppUser") || tableName.Contains("AppUserClaim")))
        //        { tableName = tableName.Split('_')[0]; }

        //        if (tableName != "AppUser" && tableName != "Roles" && tableName != "UserRole")
        //        {
        //            keyName = ((App.Data.Entities.BaseEntity)dbEntry.Entity).Id; //Convert.ToInt32(dbEntry.OriginalValues.GetValue<object>("Id")); 
        //        }
        //        else if (dbEntry.State == EntityState.Added)
        //        {
        //            keyName = 0;
        //        }
        //        else
        //        {
        //            keyName = Convert.ToInt32(dbEntry.OriginalValues.GetValue<object>("Id"));
        //        }
        //        if (dbEntry.State == EntityState.Deleted)
        //        {
        //            string Json = string.Empty;
        //            foreach (string propertyName in dbEntry.OriginalValues.PropertyNames)
        //            {
        //                //if (propertyName != "CreatedBy" && propertyName != "CreatedOn" && propertyName != "ModifiedBy" && propertyName != "ModifiedOn" && propertyName != "Id")
        //                if (string.IsNullOrWhiteSpace(Json))
        //                    Json += propertyName + " : '" + dbEntry.OriginalValues.GetValue<object>(propertyName) + "'";
        //                else
        //                    Json += " , " + propertyName + " : '" + dbEntry.OriginalValues.GetValue<object>(propertyName) + "'";
        //            }
        //            Json = "{ " + Json + " }";
        //            // Same with deletes, do the whole record, and use either the description from Describe() or ToString()
        //            result.Add(new AuditLog()
        //            {
        //                //UserId = userId,
        //                EventType = "Deleted", // Deleted
        //                TableName = tableName,
        //                RecordId = keyName,
        //                ColumnName = "*ALL",
        //                NewValue = Json,
        //                CreatedBy = userId,
        //                CreatedOn = DateTime.Now,
        //                Action = action,
        //                Controller = controller,
        //                Area = area,
        //                Ipaddress = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] ?? HttpContext.Current.Request.UserHostAddress,
        //                Url = Url,
        //                IsActive = true
        //            }
        //                );
        //        }
        //        else if (dbEntry.State == EntityState.Modified)
        //        {
        //            string UserAction = string.Empty;
        //            foreach (string propertyName in dbEntry.OriginalValues.PropertyNames)
        //            {
        //                string propName = propertyName;
        //                string oldValue = string.Empty;
        //                string newValue = string.Empty;
        //                var a = dbEntry.OriginalValues.GetValue<object>(propertyName);
        //                dynamic b = dbEntry.CurrentValues.GetValue<object>(propertyName);
        //                // For updates, we only want to capture the columns that actually changed
        //                if (!object.Equals(dbEntry.OriginalValues.GetValue<object>(propertyName), dbEntry.CurrentValues.GetValue<object>(propertyName)))
        //                {

        //                    if (propertyName != "CreatedBy" && propertyName != "CreatedOn" && propertyName != "ModifiedOn" && propertyName != "ModifiedBy" && action != "Login" && propertyName != "PasswordHash" && propertyName != "SecurityStamp" && propertyName != "LastPasswordChangedDate")
        //                    {
        //                        if (propertyName == "IsActive" && b == false)
        //                        {
        //                            b = false;
        //                            UserAction = "Deleted";
        //                            propName = "N/A";
        //                            oldValue = "N/A";
        //                            newValue = "N/A";
        //                        }
        //                        else
        //                        {
        //                            oldValue = dbEntry.OriginalValues.GetValue<object>(propertyName) == null ? null : dbEntry.OriginalValues.GetValue<object>(propertyName).ToString();
        //                            newValue = dbEntry.CurrentValues.GetValue<object>(propertyName) == null ? null : dbEntry.CurrentValues.GetValue<object>(propertyName).ToString();
        //                            UserAction = "Updated";
        //                        }
        //                        result.Add(new AuditLog()
        //                        {

        //                            EventType = "Modified",    // Modified
        //                            TableName = tableName,
        //                            RecordId = keyName,
        //                            ColumnName = propName,
        //                            OldValue = oldValue,
        //                            NewValue = newValue,
        //                            CreatedBy = userId,
        //                            CreatedOn = DateTime.Now,
        //                            Action = action,
        //                            Controller = controller,
        //                            Area = area,
        //                            Ipaddress = IpAddressCheck,
        //                            Url = Url,
        //                            IsActive = true
        //                        }
        //                        );
        //                    }
        //                }
        //            }
        //        }
        //        else if (dbEntry.State == EntityState.Added)
        //        {
        //            //foreach (string propertyName in dbEntry.CurrentValues.PropertyNames)
        //            //{
        //            //    // var a = dbEntry.OriginalValues.GetValue<object>(propertyName);
        //            //    string b = dbEntry.CurrentValues.GetValue<object>(propertyName) == null ? null : dbEntry.CurrentValues.GetValue<object>(propertyName).ToString();
        //            //    //// For updates, we only want to capture the columns that actually changed
        //            //    //if (!object.Equals(dbEntry.OriginalValues.GetValue<object>(propertyName), dbEntry.CurrentValues.GetValue<object>(propertyName)))
        //            //    //{
        //            //    if (propertyName != "CreatedBy" && propertyName != "CreatedOn" && propertyName != "IsActive" && propertyName != "Id" && propertyName != "ModifiedOn" && propertyName != "ModifiedBy" && action != "Login" && b != null && b != "0" && propertyName != "PasswordHash" && propertyName != "SecurityStamp" && propertyName != "LastPasswordChangedDate")
        //            //    {
        //            //        result.Add(new AuditLog()
        //            //        {

        //            //            EventType = "Added",    // Added
        //            //            TableName = tableName,
        //            //            RecordId = keyName,
        //            //            ColumnName = propertyName,
        //            //            OldValue = "",
        //            //            NewValue = dbEntry.CurrentValues.GetValue<object>(propertyName) == null ? null : dbEntry.CurrentValues.GetValue<object>(propertyName).ToString(),
        //            //            CreatedBy = userId,
        //            //            CreatedOn = DateTime.Now,
        //            //            Action = action,
        //            //            Controller = controller,
        //            //            Area = area,
        //            //            IPAddress = IpAddressCheck,
        //            //            Url = Url,
        //            //            IsActive = true
        //            //        }
        //            //            );
        //            //    }
        //            //    //}
        //            //}
        //        }
        //        // Otherwise, don't do anything, we don't care about Unchanged or Detached entities
        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //}
        //private string GetTableName(DbEntityEntry ent)
        //{
        //    ObjectContext objectContext = ((IObjectContextAdapter)this).ObjectContext;
        //    Type entityType = ent.Entity.GetType();

        //    if (entityType.BaseType != null && entityType.Namespace == "System.Data.Entity.DynamicProxies")
        //        entityType = entityType.BaseType;

        //    string entityTypeName = entityType.Name;

        //    System.Data.Entity.Core.Metadata.Edm.EntityContainer container =
        //        objectContext.MetadataWorkspace.GetEntityContainer(objectContext.DefaultContainerName, System.Data.Entity.Core.Metadata.Edm.DataSpace.CSpace);
        //    string entitySetName = (from meta in container.BaseEntitySets
        //                            where meta.ElementType.Name == entityTypeName
        //                            select meta.Name).First();
        //    return entitySetName;
        //}
    }
}
