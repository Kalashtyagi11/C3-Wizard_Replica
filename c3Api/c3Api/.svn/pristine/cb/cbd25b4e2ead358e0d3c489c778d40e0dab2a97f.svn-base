using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace C3WizardHelper.ViewModels
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Routing;
    using Microsoft.Extensions.Logging;
    using System.Threading.Tasks;

    public static class ExceptionMiddleware
    {


        public static (string Controller, string Action) GetActionInfo(ControllerBase controllerBase)
        {
            var controllerName = controllerBase.ControllerContext.ActionDescriptor.RouteValues["controller"];
            var actionName = controllerBase.ControllerContext.ActionDescriptor.RouteValues["action"];
            return (controllerName ?? "UnknownController", actionName ?? "UnknownAction");
        }

        //private readonly RequestDelegate _next;

        //private readonly LoggingHelper _logHelper;

        //public ExceptionMiddleware(RequestDelegate next, LoggingHelper logHelper)
        //{
        //    _next = next;
        //    _logHelper = logHelper;
        //}
        ///// <summary>
        ///// 
        ///// </summary>
        ///// <param name="context"></param>
        ///// <returns></returns>
        //public async Task InvokeAsync(HttpContext context)
        //{
        //    try
        //    {
        //        await _next(context);
        //    }
        //    catch (Exception ex)
        //    {
        //        var routeData = context.GetRouteData();
        //        var controller = routeData?.Values["controller"]?.ToString() ?? "UnknownController";
        //        var action = routeData?.Values["action"]?.ToString() ?? "UnknownAction";
        //        _logHelper.LogError(controller, action, ex.Message, ex.StackTrace);

        //        context.Response.StatusCode = 500;
        //        await context.Response.WriteAsync("Internal Server Error occurred.");
        //    }
        //}
    }


}
