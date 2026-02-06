using C3WizardData.Models;
using C3WizardHelper.ViewModels;
using C3WizardLayer.DataObjects;
using C3WizardRepository.Interface;
using C3WizardRepository.Repository;
using C3WIZARDWebApi.Common;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Payroll_25.Repo;
using System.Text;
using C3WizardLayer.BusinessObjects;
using Newtonsoft.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//builder.Services.AddControllers();
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
//builder.Services.AddCors(options =>
//{
//  options.AddPolicy("AllowAll",
//      builder =>
//      {
//        builder.AllowAnyOrigin() // Use specific origins
//                 .AllowAnyMethod()
//                 .AllowAnyHeader();
//      });
//});




//// Configure DbContext with SQL Server
//builder.Services.AddDbContext<C3wizardContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories and services
//builder.Services.AddTransient<RepoRegisterCompany>();
//builder.Services.AddTransient<RepoC3>();
//builder.Services.AddTransient<RepoNonDirector>();
//builder.Services.AddTransient<NonDirectorRepo>();
//builder.Services.AddTransient<JwtTokenHelper>();
//builder.Services.AddTransient<DashBoardRepo>();
//builder.Services.AddTransient<RepoSelfUserManagement>();
//builder.Services.AddTransient<RepoSelfEmployee>();

//var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
//builder.Services.AddControllers()
//    .AddNewtonsoftJson(options =>
//    {
//      //options.SerializerSettings.Converters.Add(new DecimalToStringConverter());
//      //options.SerializerSettings.Formatting = Formatting.Indented;
//      options.SerializerSettings.ContractResolver = new DefaultContractResolver();
//    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
var accessor = builder.Services.BuildServiceProvider().GetRequiredService<IHttpContextAccessor>();
C3WizardLayerConn_BaseData.Configure(accessor);



//var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        policy =>
        {
          policy.WithOrigins("http://localhost:3000", "https://test.ssbeservices.net", "https://c3.ssbeservices.net", "https://testapi.ssbeservices.net", "https://api.ssbeservices.net", "https://c3test.digitalnoticeboard.biz", "https://c3prod.digitalnoticeboard.biz")
              .AllowAnyMethod()  
                  .AllowAnyHeader()
                  .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                  .AllowCredentials();
        });
});

//builder.Services.AddCors(options =>
//{
//  options.AddPolicy("AllowAll",
//      builder => builder.AllowAnyOrigin()
//                        .AllowAnyMethod()
//                        .AllowAnyHeader());
//});

// Configure DbContext with SQL Server
builder.Services.AddDbContext<C3wizardContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Register repositories and services
builder.Services.AddTransient<RepoRegisterCompany>();
builder.Services.AddTransient<RepoC3>();
builder.Services.AddTransient<RepoNonDirector>();
builder.Services.AddTransient<NonDirectorRepo>();
builder.Services.AddTransient<JwtTokenHelper>();
builder.Services.AddTransient<DashBoardRepo>();
builder.Services.AddTransient<RepoSelfEmployee>();
builder.Services.AddTransient<SelpEmpContributionRepo>();
builder.Services.AddTransient<RepoSelfUserManagement>();
builder.Services.AddTransient<RepoBonusSettings>();
builder.Services.AddTransient<PaymentRepo>();

builder.Services.AddSignalR();

var jwtIssuer = builder.Configuration.GetSection("Jwt:Issuer").Get<string>();
var jwtKey = builder.Configuration.GetSection("Jwt:Key").Get<string>();
var jwtAudience = builder.Configuration.GetSection("Jwt:Audience").Get<string>();
builder.Services.AddHttpContextAccessor(); 
builder.Services.AddHttpContextAccessor();
//builder.Services.AddTransient<LoggingHelper>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
C3WizardLayerConn_BaseData.InitializeStaticConnectionString(builder.Configuration);

//narendra========================
// Add Swagger and configure token support
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    // Add bearer token support
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      Example: 'Bearer eyJhbGciOiJIUzI1...'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

//==========================


LoggingHelper.Initialize(builder.Configuration);
var app = builder.Build();
ServiceLocator.Configure(app.Services);
ExceptionMiddleware1.Init(app.Services.GetRequiredService<IHttpContextAccessor>());
//app.UseCors("AllowAll");
//app.UseCors("AllowAll");
//app.Use(async (context, next) =>
//{
//  context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
//  context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//  context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");

//  if (context.Request.Method == "OPTIONS")
//  {
//    context.Response.StatusCode = 200;
//    return;
//  }

//  await next();
//});

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
  app.UseSwagger();
  app.UseSwaggerUI();
//}
app.UseRouting();


app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("AllowAllOrigins");  // Enable CORS before Authentication
//app.UseAuthentication(); 
// Add Authentication Middleware
//app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthorization();      // Add Authorization Middleware
app.MapControllers();
app.MapHub<NotificationHub>("/EmailVerified");
app.Run();

