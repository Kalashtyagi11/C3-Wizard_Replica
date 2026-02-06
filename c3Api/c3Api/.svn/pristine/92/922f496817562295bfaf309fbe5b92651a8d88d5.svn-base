using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class DTOResponsemodel
    {
        public bool Status { get; set; }
        public string Message { get; set; }
        public dynamic Data { get; set; }
    }

    public class DTOSubscriptionPayment
    {
        public int c3HeaderId { get; set; }
        public int userId { get; set; }
        public decimal Amount { get; set; }
        public string TransactionFor { get; set; }

    }

    public class PaymentDetails1
    {
        public string token { get; set; }
        public string PayerID { get; set; }
    }

    public class PayPalTransactionExcelList
    {
        public string Id { get; set; }
        public string Status { get; set; }
        public string Amount { get; set; }
        public string Currency { get; set; }
        public string PayerEmail { get; set; }
    }


    public class PaymentFormModelVm
    {
        //public decimal? totalSscontributions { get; set; }
        //public decimal? totalServayance { get; set; }
        //public decimal? sumLeavy { get; set; }
        //public decimal? totalSspenalty { get; set; }
        //public decimal? totalPepenalty { get; set; }
        //public decimal? TotalLevyeepenalty { get; set; }

        public string CardNumber { get; set; }
        public string ExpirationYear { get; set; }
        public string paymentMethod { get; set; }
        public bool saveCard { get; set; }
        public bool? isBimapost { get; set; }
        public string SecurityCode { get; set; }
        public string cardHolderName { get; set; }

        public decimal TotalAmount { get; set; }
        public string TransactionFor { get; set; }
        public int C3HeaderId { get; set; }
        public int UserId { get; set; }
        public int companyId { get; set; }
        public string? Currency { get; set; }
      
        //public string? payC3Period { get; set; }

    }

    public class CarddetailsModelVm
    {
        public string CardNumber { get; set; }
        public string ExpirationYear { get; set; }
        public string cardtype { get; set; }

        public string SecurityCode { get; set; }
        public string cardHolderName { get; set; }
        public int? mode { get; set; }


        public int UserId { get; set; }


    }
    public class PaymentDetailsofflineVm
    {
        public string? BankName { get; set; }
        public string? checkNum { get; set; }
        //public DateTime? checkDate { get; set; }
        public string? checkDate { get; set; }
        public string? JVNumber { get; set; }
        //public DateTime? jvDate { get; set; }
        public string? jvDate { get; set; }
        public string? needToPay { get; set; }
        //public DateTime? transactionDate { get; set; }
        public string? transactionDate { get; set; }
        public string? BimaRefNum { get; set; }
        public string? mode { get; set; }
        public string? headerID { get; set; }
        public string? UserId { get; set; }
        public string? creditCardCode { get; set; }

    }
    public class GetOfflinePaymentDataVm
    {
        public string? Period { get; set; }
        public DateTime? CreationDate { get; set; }
        public int? Schedule { get; set; }
        public double? TotalWages { get; set; }
        public double? SocialSecurity { get; set; }
        public double? Levy { get; set; }
        public double? Penalty { get; set; }
        public double? Severance { get; set; }
        public double? TotalSspenalty { get; set; }
        public double? TotalLevyeepenalty { get; set; }
        public double? Total { get; set; }
    }
    public class SiteSettingsVm
    {

        public int SiteSettings_Id { get; set; }

        public string? merchantId { get; set; }
        public string? password { get; set; }
        public string? loginId { get; set; }

        public string? keyId { get; set; }

        public string? secretKey { get; set; }

        public string? BaseUrl { get; set; }


        public string? Environment { get; set; }

        public int? InsertedBy { get; set; }
        public DateTime? InsertedOn { get; set; }

        public string? InsertedMachineInfo { get; set; }

        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdatedMachineInfo { get; set; }
        public bool IsActive { get; set; }
    }

    public class TransactionReceipt
    {
        public int types { get; set; }

        public string receiptNumber { get; set; }

        public string regNo { get; set; }

        public string Id { get; set; }

        public string Name { get; set; }
        public string Email { get; set; }

        public string PaymentStatus { get; set; }

        public decimal Amount { get; set; }

        public string date { get; set; }
        public string payC3Period { get; set; }
        public string cardHolderName { get; set; }
        public List<PaymentHeaderVm> PaymentHeaderdetails { get; set; }
    }


    public class PaymentHeaderVm
    {
        public string fundCode { get; set; }
        public string paymentCode { get; set; }
        public decimal paymentAmount { get; set; }
    }

    public class BimaPaymentRequestVM
    {
        public string bankCode { get; set; }
        public string creditCardCode { get; set; }
        public List<PaymentHeaderVm> paymentHeaders { get; set; }
        public string mopAccountNumber { get; set; }
        public string mopCode { get; set; }
        public string officeCode { get; set; }
        public string mopNotes1 { get; set; }
        public string mopNumber { get; set; }
        public decimal? totalAmount { get; set; }
    }
    //public class BimaPaymentResponse
    //{
    //    public string message { get; set; }
    //    public string receiptId { get; set; }
    //    public bool status { get; set; }
    //}

    public class BimaPaymentResponse
    {
        public string message { get; set; }
        public string receiptId { get; set; }
        public bool status { get; set; }
        public string payerId { get; set; }
        public string companyName { get; set; }
        public string companyAddress1 { get; set; }
        public string companyAddress2 { get; set; }
        public string postalCode { get; set; }
        public string paymentDate { get; set; }
        public string modeOfPayment { get; set; }
        public string bankCode { get; set; }
        public decimal totalAmount { get; set; }
        public List<PaymentHeaderVm> paymentHeaders { get; set; }
    }


    public class offilinePaymentResonseBimaVM
    {
        public string? bankCode { get; set; }
        public string? creditCardCode { get; set; }
        public string? mopAccountNumber { get; set; }
        public string? mopCode { get; set; }
        public string? mopNotes1 { get; set; }
        public string? mopNumber { get; set; }
        public double totalAmount { get; set; }
        public List<PaymentHeaderVm>? paymentHeaders { get; set; }
        public BatchVM? batch { get; set; }
    }



    public class BatchVM
    {
        public string? batchNumber { get; set; }
        public string? batchStatus { get; set; }
        public DateTime batchDate { get; set; }
    }




    public class PaymentAuthorizedResponse
    {
        public _links _links { get; set; }
        public clientReferenceInformation clientReferenceInformation { get; set; }
        public string id { get; set; }
        public orderInformation orderInformation { get; set; }
        public paymentAccountInformation paymentAccountInformation { get; set; }
        public paymentInformation paymentInformation { get; set; }
        public processorInformation processorInformation { get; set; }
        public string reconciliationId { get; set; }
        public string status { get; set; }
        public DateTime submitTimeUtc { get; set; }
    }
    public class paymentInformation
    {
        public tokenizedCard tokenizedCard { get; set; }
        public card card { get; set; }
    }

    public class _links
    {
        [JsonProperty("void")]
        public linkInfo void_ { get; set; }

        public linkInfo self { get; set; }
    }

    public class linkInfo
    {
        public string method { get; set; }
        public string href { get; set; }
    }
    public class clientReferenceInformation
    {
        public string code { get; set; }
    }
    public class orderInformation
    {
        public amountDetails amountDetails { get; set; }
    }

    public class amountDetails
    {
        public string totalAmount { get; set; }
        public string authorizedAmount { get; set; }
        public string currency { get; set; }
    }
    public class paymentAccountInformation
    {
        public card card { get; set; }
    }
    public class card
    {
        public string type { get; set; }
    }

    public class tokenizedCard
    {
        public string type { get; set; }
    }

    public class processorInformation
    {
        public string systemTraceAuditNumber { get; set; }
        public string merchantNumber { get; set; }
        public string approvalCode { get; set; }
        public cardVerification cardVerification { get; set; }
        public merchantAdvice merchantAdvice { get; set; }
        public string responseDetails { get; set; }
        public string networkTransactionId { get; set; }
        public string retrievalReferenceNumber { get; set; }
        public consumerAuthenticationResponse consumerAuthenticationResponse { get; set; }
        public string transactionId { get; set; }
        public string responseCode { get; set; }
        public avs avs { get; set; }
    }
    public class cardVerification
    {
        public string resultCodeRaw { get; set; }
        public string resultCode { get; set; }
    }

    public class merchantAdvice
    {
        public string code { get; set; }
        public string codeRaw { get; set; }
    }

    public class consumerAuthenticationResponse
    {
        public string code { get; set; }
        public string codeRaw { get; set; }
    }

    public class avs
    {
        public string code { get; set; }
        public string codeRaw { get; set; }
    }

}
