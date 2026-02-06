using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using C3WizardHelper.ViewModels;
using Microsoft.Extensions.Configuration;


namespace C3WizardRepository.Repository
{
    public static class ConnectionInfoSSB
    {
        public static async Task<bool> APIConnectionAsync(IConfiguration _configuration)
        {
            try
            {
                string serviceUri = _configuration["ServiceConfig:ServiceUriString"];
                string authUser = _configuration["ServiceConfig:AuthUser"];
                string authPass = _configuration["ServiceConfig:AuthPass"];

                if (string.IsNullOrEmpty(serviceUri) || string.IsNullOrEmpty(authUser) || string.IsNullOrEmpty(authPass))
                {
                    throw new ArgumentException("Configuration values are missing or invalid.");
                }
                string sURL = $"{serviceUri.TrimEnd('/')}/ReferenceData/about/";
                using HttpClientHandler handler = new HttpClientHandler();
                using HttpClient httpClient = new HttpClient(handler)
                {
                    BaseAddress = new Uri(sURL),
                    Timeout = TimeSpan.FromSeconds(30)
                };
                httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
                var plainTextBytes = Encoding.UTF8.GetBytes($"{authUser}:{authPass}");
                string authHeaderValue = Convert.ToBase64String(plainTextBytes);
                httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authHeaderValue);
                HttpResponseMessage response = await httpClient.GetAsync(sURL);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    return true;
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
                Console.WriteLine($"Error in APIConnectionAsync: {ex.Message}");
                return false;
            }
        }
    }

}


