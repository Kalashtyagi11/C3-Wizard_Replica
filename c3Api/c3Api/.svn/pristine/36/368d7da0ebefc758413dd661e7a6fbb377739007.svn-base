using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore.Query.Internal;
using C3WizardHelper.ViewModels;
using Microsoft.AspNetCore.Http;

namespace C3WizardRepository.Repository
{
    public static class ConnectionInfom
    {
      

        [DllImport("wininet.dll", CharSet = CharSet.Auto)]
        private extern static bool InternetGetConnectedState(ref InternetConnectionState_e lpdwFlags, int dwReserved);

        [Flags]
        enum InternetConnectionState_e : int
        {
            INTERNET_CONNECTION_MODEM = 0x1,
            INTERNET_CONNECTION_LAN = 0x2,
            INTERNET_CONNECTION_PROXY = 0x4,
            INTERNET_RAS_INSTALLED = 0x10,
            INTERNET_CONNECTION_OFFLINE = 0x20,
            INTERNET_CONNECTION_CONFIGURED = 0x40
        }

        // Return true or false if connecting through a proxy server
        public static bool connectingThroughProxy()
        {
            InternetConnectionState_e flags = 0;
            InternetGetConnectedState(ref flags, 0);
            bool hasProxy = false;

            if ((flags & InternetConnectionState_e.INTERNET_CONNECTION_PROXY) != 0)
            {
                hasProxy = true;
            }
            else
            {
                hasProxy = false;
            }

            return hasProxy;
        }

        public static bool HasConnection()
        {
            try
            {
                System.Net.IPHostEntry i = System.Net.Dns.GetHostEntry("www.google.com");
                return true;
            }
            catch
            {
                return false;
            }
        }
        public static bool APIConnection(IConfiguration configuration)
        {
            try
            {
                string surl = configuration["ServiceConfig:ServiceUriString"];
                if (string.IsNullOrEmpty(surl))
                {
                    throw new Exception("ServiceUriString not found in configuration.");
                }

                string sURL = $"{surl}/ReferenceData/about/";
                using HttpClient httpClient = new HttpClient
                {
                    BaseAddress = new Uri(sURL),
                    Timeout = TimeSpan.FromMinutes(2)
                };

                httpClient.DefaultRequestHeaders.Add("ContentType", "application/json");

                // Basic Authentication
                string authUser = configuration["ServiceConfig:AuthUser"];
                string authPass = configuration["ServiceConfig:AuthPass"];
                if (string.IsNullOrEmpty(authUser) || string.IsNullOrEmpty(authPass))
                {
                    throw new Exception("Authentication credentials are missing.");
                }

                string authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{authUser}:{authPass}"));
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Basic {authHeader}");
                HttpClient client = new HttpClient();
                client.Timeout = TimeSpan.FromMinutes(2);
                HttpResponseMessage response = httpClient.GetAsync(sURL).Result;

                
                string resultContent = response.Content.ReadAsStringAsync().Result;
                Console.WriteLine($"Error: {(int)response.StatusCode} {response.ReasonPhrase}");
                Console.WriteLine("Response Message: " + resultContent);

                return response.IsSuccessStatusCode;
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
                return false;
            }
        }

    public static string APIConnectionError(IConfiguration configuration)
    {
      try
      {
        string surl = configuration["ServiceConfig:ServiceUriString"];
        if (string.IsNullOrEmpty(surl))
        {
          throw new Exception("ServiceUriString not found in configuration.");
        }

        string sURL = $"{surl}/ReferenceData/about/";
        using HttpClient httpClient = new HttpClient
        {
          BaseAddress = new Uri(sURL),
          Timeout = TimeSpan.FromMinutes(2)
        };

        httpClient.DefaultRequestHeaders.Add("ContentType", "application/json");

        // Basic Authentication
        string authUser = configuration["ServiceConfig:AuthUser"];
        string authPass = configuration["ServiceConfig:AuthPass"];
        if (string.IsNullOrEmpty(authUser) || string.IsNullOrEmpty(authPass))
        {
          throw new Exception("Authentication credentials are missing.");
        }

        string authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{authUser}:{authPass}"));
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Basic {authHeader}");
        HttpClient client = new HttpClient();
        client.Timeout = TimeSpan.FromMinutes(2);
        HttpResponseMessage response = httpClient.GetAsync(sURL).Result;

        string resultContent = response.Content.ReadAsStringAsync().Result;
        Console.WriteLine($"Error: {(int)response.StatusCode} {response.ReasonPhrase}");
        Console.WriteLine("Response Message: " + resultContent);

        return resultContent;
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
        return ex.Message;
      }
    }
  }
}
