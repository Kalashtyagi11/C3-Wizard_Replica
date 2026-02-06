using CyberSource.Client;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public static class LoggingHelper
    {
        private static string _connectionString;

        public static void Initialize(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public static void LogError(string controller, string method, string message, string stackTrace)
        {
            try
            {
                if (string.IsNullOrEmpty(_connectionString))
                    throw new InvalidOperationException("LoggingHelper is not initialized. Call Initialize() first.");
                using (var connection = new SqlConnection(_connectionString))
                {
                    var command = new SqlCommand(@"
                        INSERT INTO CustomErrorLogs 
                        (ControllerName, MethodName, ErrorMessage, StackTrace, IsActive, LogDate) 
                        VALUES (@Controller, @Method, @Message, @StackTrace, @IsActive, @LogDate)", connection);

                    command.Parameters.AddWithValue("@Controller", controller);
                    command.Parameters.AddWithValue("@Method", method);
                    command.Parameters.AddWithValue("@Message", message);
                    command.Parameters.AddWithValue("@StackTrace", stackTrace ?? "");
                    command.Parameters.AddWithValue("@IsActive", true);
                    command.Parameters.AddWithValue("@LogDate", DateTime.Now);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Logging failed: " + ex.Message);
                
            }
        }

        

    }

}
