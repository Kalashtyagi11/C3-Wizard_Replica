using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class ReconciliationCyberJsonVm
    {
        public int ID { get; set; }
        public string? CyberSourceMerchantID { get; set; }
        public string? DateandTime { get; set; }
        public string? RequestID { get; set; }
        public string? MerchantReferenceNumber { get; set; }
        public string? RetrievalReferenceNumber { get; set; }
        public string? InstalmentIdentifier { get; set; }
        public string? LastName { get; set; }
        public string? FirstName { get; set; }
        public string? Email { get; set; }
        public decimal? Amount { get; set; }
        public string? Currency { get; set; }
        public string? AccountPrefix { get; set; }
        public string? AccountSuffix { get; set; }
        public List<ApplicationStatus>? Applications { get; set; }  // ✅ Changed to List
        public string? PaymentMethod { get; set; }
        public string? PaymentSolution { get; set; }
        public string? TransactionReferenceNumber { get; set; }
        public string? AuthorisationIndicator { get; set; }
        public string? PartnerOriginalTransactionID { get; set; }
        public string? PartnerSolutionID { get; set; }
        public string? DeviceID { get; set; }
        public string? TerminalSerialNumber { get; set; }
        public string? Processor { get; set; }
        public string? TokenID { get; set; }
        public string? BusinessApplicationID { get; set; }
        public string? TerminalID { get; set; }
        public string? PATransactionID { get; set; }
        public string? XID { get; set; }
        public string? MerchantDefinedData1 { get; set; }
        public string? MerchantDefinedData2 { get; set; }
        public string? MerchantDefinedData3 { get; set; }
        public string? MerchantDefinedData4 { get; set; }
        public string? ClientUser { get; set; }
        public string? SalesSlipNumber { get; set; }
        public string? AuthorisationCode { get; set; }
        public string? AcquirerAccountID { get; set; }
        public string? JCCATerminalID { get; set; }
        public string? BillingAddress1 { get; set; }
        public string? BillingCity { get; set; }
        public string? BillingCountyRegion { get; set; }
        public string? BillingPostalCode { get; set; }
        public string? BillingPhoneNumber { get; set; }
        public string? IPAddress { get; set; }
        public string? BillingCountry { get; set; }
        public string? ShippingFirstName { get; set; }
        public string? ShippingLastName { get; set; }
        public string? ShippingAddress1 { get; set; }
        public string? ShippingCity { get; set; }
        public string? ShippingCountyRegion { get; set; }
        public string? ShippingCountry { get; set; }
        public string? ShippingPostalCode { get; set; }
        public string? ShippingPhoneNumber { get; set; }
        public string? CustomerID { get; set; }
        public string? ClientApplication { get; set; }
        public string? DeviceFingerprint { get; set; }
        public string? ICSRflag { get; set; }
        public string? ICSRcode { get; set; }
        public string? ReasonCode { get; set; }
        public string? CommerceIndicator { get; set; }
        public string? ProviderTransactionId { get; set; }

    }


    public class ApplicationStatus
    {
        public string? DisplayName { get; set; }
        public string? Status { get; set; }
    }


}
