using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardData.Models
{
    public partial class PROCESS_C3Header_Backup
    {
        public int Id { get; set; }
        public int C3headerid { get; set; }

        public string? RegNo { get; set; }

        public string? PerioddMonth { get; set; }

        public string? PeriodYear { get; set; }

        public double? TotalWages { get; set; }

        public double? TotalSscontributions { get; set; }

        public double? TotalLevyeeemployee { get; set; }

        public double? TotalLevyeeemployer { get; set; }

        public double? TotalServayance { get; set; }

        public double? TotalLevyeepenalty { get; set; }

        public double? TotalPepenalty { get; set; }

        public double? TotalSspenalty { get; set; }

        public DateTime? InsertDatetimeinfo { get; set; }

        public string? InsertMachineinfo { get; set; }

        public DateTime? PrintDatetimeinfo { get; set; }

        public int? EmployerId { get; set; }

        public bool? ForDirector { get; set; }

        public int? ScheduleNo { get; set; }

        public bool? IsFianalize { get; set; }

        public bool? IsSubmitted { get; set; }
        public string? Notes { get; set; }

        public DateTime? C3SubmittedDate { get; set; }

        public int? C3SubmittedBy { get; set; }

        public bool? C3IsFinalized { get; set; }

        public DateTime? C3FinalizedDate { get; set; }

        public int? C3FinalizedBy { get; set; }

        public bool? IsUnLocked { get; set; }

        public string? ErrorDesc { get; set; }

        public int? InsertedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public string? ModifiedMachineinfo { get; set; }

        public int? PrintBy { get; set; }

        public int? ExportBy { get; set; }

        public bool? IsImportFromBema { get; set; }

        public string? UserName { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public DateTime? ExportOn { get; set; }

        public string? OrderName { get; set; }

        public string? OrderKey { get; set; }
        public bool? isNilReturn { get; set; }
        public bool? IsSentForEdit { get; set; }
        public bool? isImportC3file { get; set; }
        public string? ImportC3Filepath { get; set; }
        public int? EditPermittedBy { get; set; }
        public DateTime? SentOnForEdit { get; set; }
    }

    public partial class Process_Contributions_Backup
    {
        public int Id { get; set; }
        public int ContId { get; set; }

        public int? C3headerid { get; set; }

        public string? Ssn { get; set; }

        public string? PerioddMonth { get; set; }

        public string? PeriodYear { get; set; }

        public string? PayFreq { get; set; }

        public double? Wages1 { get; set; }

        public double? Wages2 { get; set; }

        public double? Wages3 { get; set; }

        public double? Wages4 { get; set; }

        public double? Wages5 { get; set; }

        public double? Hpay { get; set; }

        public double? Bonus { get; set; }

        public double? DirectorWage { get; set; }

        public bool? Week1 { get; set; }

        public bool? Week2 { get; set; }

        public bool? Week3 { get; set; }

        public bool? Week4 { get; set; }

        public bool? Week5 { get; set; }

        public double? Levyee { get; set; }

        public double? SocialSecurity { get; set; }

        public DateTime? DateJoining { get; set; }

        public DateTime? DateTerminated { get; set; }

        public string? Remarks { get; set; }

        public bool? IsFianalize { get; set; }

        public bool? IsSubmitted { get; set; }

        public DateTime? C3SubmittedDate { get; set; }

        public int? C3SubmittedBy { get; set; }

        public bool? C3IsFinalized { get; set; }

        public DateTime? C3FinalizedDate { get; set; }

        public int? C3FinalizedBy { get; set; }

        public bool? IsUnLocked { get; set; }

        public string? ErrorDesc { get; set; }

        public double? SocialSecurityEr { get; set; }

        public double? SocialSecurityEe { get; set; }

        public double? ServayanceEe { get; set; }

        public double? ServayanceEr { get; set; }

        public double? LevyEr { get; set; }

        public string? Ssnd { get; set; }

        public double? HpayWeek1 { get; set; }

        public double? HpayWeek2 { get; set; }

        public double? HpayWeek3 { get; set; }

        public double? HpayWeek4 { get; set; }

        public double? HpayWeek5 { get; set; }
    }

    public partial class PROCESS_Self_EmployedC3_Backup
    {
        public int Id { get; set; }
        public int Sec3id { get; set; }

        public string? Ssn { get; set; }

        public string? PerioddMonth { get; set; }

        public string? PeriodYear { get; set; }

        public double? TotalWages { get; set; }

        public double? TotalContributions { get; set; }

        public double? TotalFine { get; set; }

        public string? CategoryType { get; set; }

        public double? Wages1 { get; set; }

        public double? Wages2 { get; set; }

        public double? Wages3 { get; set; }

        public double? Wages4 { get; set; }

        public double? Wages5 { get; set; }

        public int? SelectedTypeWeek1 { get; set; }

        public int? SelectedTypeWeek2 { get; set; }

        public int? SelectedTypeWeek3 { get; set; }

        public int? SelectedTypeWeek4 { get; set; }

        public int? SelectedTypeWeek5 { get; set; }

        public bool? Week1 { get; set; }

        public bool? Week2 { get; set; }

        public bool? Week3 { get; set; }

        public bool? Week4 { get; set; }

        public bool? Week5 { get; set; }

        public string? Remarks { get; set; }

        public DateTime? InsertDatetimeinfo { get; set; }

        public string? InsertMachineinfo { get; set; }

        public DateTime? PrintDatetimeinfo { get; set; }

        public int? ScheduleNo { get; set; }

        public bool? IsFianalize { get; set; }

        public bool? IsSubmitted { get; set; }

        public DateTime? C3SubmittedDate { get; set; }

        public int? C3SubmittedBy { get; set; }

        public bool? C3IsFinalized { get; set; }

        public DateTime? C3FinalizedDate { get; set; }

        public int? C3FinalizedBy { get; set; }

        public bool? IsUnLocked { get; set; }

        public string? ErrorDesc { get; set; }

        public int? InsertedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public string? ModifiedMachineinfo { get; set; }

        public int? PrintBy { get; set; }

        public int? ExportBy { get; set; }

        public bool? IsImportFromBema { get; set; }

        public string? UserName { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public DateTime? ExportOn { get; set; }
        public string? Notes { get; set; }
        public bool? IsSentForEdit { get; set; }
        public int? EditPermittedBy { get; set; }
        public DateTime? SentOnForEdit { get; set; }
    }
}
