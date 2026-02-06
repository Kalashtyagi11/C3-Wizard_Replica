using AdoNetCore.AseClient;
using C3Wizard.COMMONPROP;
using C3WizardHelper.ViewModels;
using CrystalDecisions.ReportAppServer.DataDefModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Drawing;
using System.Globalization;
using System.Text;



namespace C3WIZARDWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class javaEmployerController : ControllerBase
    {

        private readonly string _con = string.Empty;

        public javaEmployerController(IConfiguration config)
        {
            _con = "Data Source=10.247.20.50,4100;Database=test_db;Uid=MISHAINFOTECH;Pwd=L1amigua$;";// config.GetConnectionString("DefaultConnection");
        }

        [HttpGet("getERMasterDetails")]
        public async Task<IActionResult> GetERMasterDetails(string regNo, string email)
        {
            try
            {
                var employerDetails = await GetEmployer(regNo.Trim(), "2", "ER");

                if (employerDetails == null)
                {
                    return NotFound(new ResponseModel
                    {
                        Status = false,
                        Message = "This registration number is not registered SSB but is not valid.",
                        Statuscode = 404
                    });
                }
                else if (employerDetails.email.Trim().ToLower() != email.Trim().ToLower())
                {
                    return BadRequest(new ResponseModel
                    {
                        Status = true,
                        Message = "User email Invalid",
                        Statuscode = 400,
                        Data = ""
                    });
                }
                else if (employerDetails.c3RegnStatusCode == "D")
                {
                    return Ok(new ResponseModel
                    {
                        Status = true,
                        Message = "This registration number is registered at S.S.B. Do you want to register this employer on the SSB server?",
                        Statuscode = 200,
                        Data = employerDetails
                    });
                }
                else if (employerDetails.c3RegnStatusCode == "A")
                {
                    return Ok(new ResponseModel
                    {
                        Status = true,
                        Message = "This registration number is registered at S.S.B. Do you want to register this employer on the SSB server?",
                        Statuscode = 200,
                        Data = employerDetails
                    });
                }
                else if (employerDetails.c3RegnStatusCode == "O")
                {
                    return Ok(new ResponseModel
                    {
                        Status = true,
                        Message = "Already registered with same payerId and EmailId",
                        Statuscode = 200,
                        Data = employerDetails
                    });
                }

                return BadRequest(new ResponseModel
                {
                    Status = true,
                    Message = "You are already registered with this registration number! Please log in with your credentials.",
                    Statuscode = 200
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        private async Task<GetEmployerDeailsModule> GetEmployer(string regNo, string addressType, string employerType)
        {
            if (string.IsNullOrEmpty(addressType) || addressType == "0")
                throw new Exception("Address Type is required");

            string sql = employerType == "ER"
 ? $@"SELECT '' wage_category,
(SELECT MAX(ISNULL(userstts,'O')) FROM dbo.c3_regn WHERE regno = '{regNo}') c3regnstts,
'ER' empltype,s.description isActive,e.trade_name tradename,
hq_addr1 + hq_addr2 companyAddress,
maddr1 address1,maddr2 address2,e.mobile mobileno,e.phone phoneno,
parent_regno prntRegNo,e.regno,e.name,e.email,e.status statuscode,
s.description statustext,e.registration_date,e.office_code officeCode
FROM dbo.er_master e
LEFT JOIN dbo.tb_employer_status s ON e.status=s.code
WHERE e.regno = '{regNo}'"
 : $@"SELECT 'SE' empltype,e.self_ref_no regno,
ip.firstname + ' ' + ip.surname name,
ip.email_addr email,e.office_code officeCode
FROM dbo.ip_self_employ e
JOIN dbo.ip_master ip ON e.ssn = ip.ssn
WHERE e.ssn = '{regNo}'";

            using var con = new AseConnection("Data Source=10.247.20.50,4100;Database=test_db;Uid=MISHAINFOTECH;Pwd=L1amigua$;");
            using var cmd = new AseCommand(sql, con);

            con.Open();
            using var row = cmd.ExecuteReader();

            if (!row.Read()) return null;

            var emp = new GetEmployerDeailsModule();

            emp.regNo = row["regno"]?.ToString();
            emp.email = row["email"]?.ToString();
            emp.name = row["name"]?.ToString();

            emp.dateRegistered = GetDbDateToDisplayDate(row["registration_date"]);

            emp.statusCode = row["statuscode"]?.ToString();
            emp.statusText = row["statustext"]?.ToString();
            emp.tradeName = row["tradename"]?.ToString();
            emp.compName = row["name"]?.ToString();

            emp.contactPerson = "";

            emp.address1 = string.IsNullOrWhiteSpace(row["address1"]?.ToString()) ? "" : row["address1"]?.ToString().Trim();
            emp.address2 = string.IsNullOrWhiteSpace(row["address2"]?.ToString()) ? "" : row["address2"]?.ToString().Trim();
            emp.city = "";
            emp.countryName = "";
            emp.postalCode = "";

            emp.phoneNo = row["phoneno"]?.ToString();
            emp.mobileNo = row["mobileno"]?.ToString();
            emp.prntRegNo = row["prntRegNo"]?.ToString();

            emp.officeCode = row["officeCode"]?.ToString();

            emp.firstName = "";
            emp.lastName = "";
            emp.companyAddress = "";
            emp.userName = "";

            emp.isActive = row["statuscode"]?.ToString()?.Equals("A", StringComparison.OrdinalIgnoreCase) == true
                ? "true"
                : "false";

            emp.userType = "";
            emp.employerType = row["empltype"]?.ToString();

            emp.c3RegnStatusText = GetRegisterationText(row["c3regnstts"]?.ToString());
            emp.c3RegnStatusCode = row["c3regnstts"]?.ToString();
            return emp;

        }

        private string GetRegisterationText(string? arg)
        {
            if (string.IsNullOrWhiteSpace(arg))
                return "Not Registered";

            switch (arg.Trim().ToUpperInvariant())
            {
                case "O": return "Registered, Not Active";
                case "A": return "Registered, Active";
                case "I": return "Registered,Inactive";
                case "N": return "Registered,Not ReActivated";
                case "T": return "Registered,Terminated";
                case "S": return "Registered,Suspended";
                default: return "Unknonw Status";
            }
        }



        private string? GetDbDateToDisplayDate(object value)
        {
            if (value == null || value == DBNull.Value)
                return null;

            string input = value.ToString().Trim();

            string[] formats =
            {
        "MM-dd-yyyy", "M-d-yyyy",
        "dd-MM-yyyy", "d-M-yyyy",
        "MM/dd/yyyy", "M/d/yyyy",
        "dd/MM/yyyy", "d/M/yyyy",
        "yyyy-MM-dd", "yyyy-M-d",
        "yyyy/MM/dd",
        "yyyy-MM-dd HH:mm:ss",
        "yyyy-MM-ddTHH:mm:ss",
        "yyyy/MM/dd HH:mm:ss"
    };

            if (DateTime.TryParseExact(input, formats,
                CultureInfo.InvariantCulture,
                DateTimeStyles.AllowWhiteSpaces,
                out DateTime dt))
            {
                return dt.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);
            }

            // fallback – handles weird DB formats
            if (DateTime.TryParse(input, out dt))
                return dt.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);

            return null;
        }


        //=============
        //[HttpGet("Get_EmployeeDetails_SSB_Click")]
        //public async Task<IActionResult> GetIpDetailsByQuery(string ssn, string dob, string fName, string lName, string? mName)
        //{
        //    try
        //    {
        //        if (string.IsNullOrEmpty(dob))
        //            return BadRequest(DataValidationException("ES1132"));

        //        if (string.IsNullOrEmpty(fName) && string.IsNullOrEmpty(lName))
        //            return BadRequest(DataValidationException("ES1133"));

        //        fName ??= "notsure";
        //        lName ??= "notsure";

        //        var list = await GetEmployerInsuredPersonByQuery(ssn, dob, fName, lName, mName);

        //        if (list == null || list.Count == 0)
        //            return BadRequest(DataValidationException("ES1134"));


        //        return Ok(result);
        //    }
        //    catch (DataValidationException ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //    catch (Exception)
        //    {
        //        return StatusCode(500, "Internal Server Error");
        //    }
        //}

//        public async Task<List<Employeedetails>> GetEmployerInsuredPersonByQuery(
//       string ssn, string dob, string fName, string lName, string? mName)
//        {
//            dob = DateTime.Parse(dob).ToString("yyyy-MM-dd");

//            var sql = new StringBuilder(@"
//SELECT 
// m.middle_name,
// m.mail_addr1,
// m.mail_addr2,
// (SELECT short_description FROM dbo.tb_occup WHERE code = m.primary_occup) AS primary_occup,
// m.email_addr,
// NULL AS regno,
// m.sex,
// m.phone_mobile,
// m.ssn,
// m.surname,
// m.firstname,
// m.middle_name,
// m.dob,
// m.status,
// m.work_permit,
// m.marital_status,
// m.phone,
// m.work_permit_expiration,
// NULL AS start_date,
// NULL AS end_date
//FROM ip_master m
//WHERE m.ssn = @ssn
//  AND m.dob = @dob
//  AND LOWER(m.firstname) = LOWER(@fname)
//  AND LOWER(m.surname)  = LOWER(@lname)
//");

//            if (!string.IsNullOrEmpty(mName))
//                sql.Append(" OR m.middle_name = @mname");

//            var list = new List<Employeedetails>();

//            using var con = new AseConnection(_con);
//            using var cmd = new AseCommand(sql.ToString(), con);

//            cmd.Parameters.Add(new AseParameter("@ssn", ssn));
//            cmd.Parameters.Add(new AseParameter("@dob", dob));
//            cmd.Parameters.Add(new AseParameter("@fname", fName));
//            cmd.Parameters.Add(new AseParameter("@lname", lName));
//            if (!string.IsNullOrEmpty(mName))
//                cmd.Parameters.Add(new AseParameter("@mname", mName));

//            await con.OpenAsync();

//            using var reader = await cmd.ExecuteReaderAsync();

//            while (await reader.ReadAsync())
//            {
//                var p = new Employeedetails
//                {
//                    socSecNum = reader["ssn"]?.ToString(),
//                    regNo = reader["regno"]?.ToString(),
//                    firstName = reader["firstname"]?.ToString(),
//                    surName = reader["surname"]?.ToString(),
//                    birthDate = reader["dob"] == DBNull.Value ? "" : Convert.ToDateTime(reader["dob"]).ToString("dd-MM-yyyy"),
//                    gender = reader["sex"]?.ToString(),
//                    maritalStatus = reader["marital_status"]?.ToString(),
//                    phone = reader["phone"]?.ToString(),
//                    mobile = reader["phone_mobile"]?.ToString(),
//                    email = reader["email_addr"]?.ToString(),

//                    startDate = "",
//                    last_Pay_Date = "",
//                    endDate = "",
//                    payPeriod = "",
//                    isActive = reader["status"]?.ToString() == "A" ? "true" : "false",
//                    isLevyExempt = "",
//                    occupation = reader["occupation"]?.ToString(),
//                    isdirectorOnly = "",
//                    isemployeeDirector = "",
//                    emptype = "",
//                    salary = "",
//                    status = reader["status"]?.ToString(),

//                    addressTypeDescr = "",
//                    addressLinkId = "",
//                    addressTypeCode = "",
//                    streetAddress = reader["mail_addr2"]?.ToString(),
//                    streetName = reader["mail_addr1"]?.ToString(),
//                    cityTownName = "",
//                    stateRegion = "",
//                    postalCode = "",
//                    countryCode = "",

//                    wagesPaid1 = "",
//                    wagesPaid2 = "",
//                    wagesPaid3 = "",
//                    wagesPaid4 = "",
//                    wagesPaid5 = "",
//                    wagesPaid6 = "",
//                    wagesPaid7 = ""
//                };

//                list.Add(p);
//            }

//            return list.Count > 0 ? list : null;
//        }

//        private async Task<LanguageEntity> FindByKeyAndLocale(string key, string locale)
//        {
//            const string sql = @"
//            SELECT msg_key AS [Key], locale, content, msgtype, msgresolution
//            FROM sys_language_messages
//            WHERE msg_key = @key AND locale = @locale";

//            using var con = new AseConnection(_con);
//            using var cmd = new AseCommand(sql, con);

//            cmd.Parameters.Add(new AseParameter("@key", key));
//            cmd.Parameters.Add(new AseParameter("@locale", locale));

//            await con.OpenAsync();

//            using var rd = await cmd.ExecuteReaderAsync();
//            if (!await rd.ReadAsync()) return null;

//            return new LanguageEntity
//            {
//                Key = rd["Key"].ToString(),
//                Locale = rd["locale"].ToString(),
//                Content = rd["content"].ToString(),
//                MsgType = rd["msgtype"].ToString(),
//                MsgResolution = rd["msgresolution"]?.ToString()
//            };
//        }

//        public class LanguageEntity
//        {
//            public string Key { get; set; }
//            public string Locale { get; set; }
//            public string Content { get; set; }
//            public string MsgType { get; set; }
//            public string MsgResolution { get; set; }
//        }


//        private const string DEFAULT_LOCALE_CODE = "en";
//        private async Task<ResponseModel> DataValidationException(string key)
//        {
//            var message = await FindByKeyAndLocale(key, DEFAULT_LOCALE_CODE);

//            if (message == null)
//            {
//                return new ResponseModel
//                {
//                    Status = false,
//                    Statuscode = 404,
//                    Message = $"Message not found for {key}, please contact social security",
                  
//                };
//            }

//            string msg;

//            if (message.MsgType.Equals("I", StringComparison.OrdinalIgnoreCase))
//            {
//                msg = $"Code       : {message.MsgType}{message.Key}{Environment.NewLine}" +
//                      $"Message    : {message.Content}";

//                if (!string.IsNullOrEmpty(message.MsgResolution))
//                    msg += $"{Environment.NewLine}Addl Info  : {message.MsgResolution}";
//            }
//            else
//            {
//                msg = $"Code       : {message.MsgType}{message.Key}{Environment.NewLine}" +
//                      $"Message    : {message.Content}{Environment.NewLine}" +
//                      $"Resolution : {message.MsgResolution}";

            
//            }

//            return new ResponseModel
//            {
//                Status = message.MsgType.Equals("I", StringComparison.OrdinalIgnoreCase),
//                Statuscode = message.MsgType.Equals("I", StringComparison.OrdinalIgnoreCase) ? 200 : 202,
//                Message = msg,
              
//            };
//        }
    }
}

