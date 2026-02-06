using C3WizardHelper.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using System;


public static class ExceptionMiddleware1
{
    private static IHttpContextAccessor _httpContextAccessor;

    public static void Init(IHttpContextAccessor accessor)
    {
        _httpContextAccessor = accessor;
    }

    public static (string Controller, string Action) GetActionInfo()
    {
        var context = _httpContextAccessor?.HttpContext;
        var routeData = context?.GetRouteData();
        var controllerName = routeData?.Values["controller"]?.ToString() ?? "UnknownController";
        var actionName = routeData?.Values["action"]?.ToString() ?? "UnknownAction";
        return (controllerName, actionName);
    }
}



