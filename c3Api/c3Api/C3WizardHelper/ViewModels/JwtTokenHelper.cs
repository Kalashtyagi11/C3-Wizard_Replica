using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
  public class JwtTokenHelper
  {
    private readonly IConfiguration _config;

    public JwtTokenHelper(IConfiguration config)
    {
      _config = config;
    }

    public string GenerateToken(string userId, string roleName, string UserEmail, string REG_NUMBER)
    {
      var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
      var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

      var claims = new[]
      {
            new Claim("UserId", userId),
            new Claim("RoleName", roleName),
               new Claim("UserEmail", UserEmail),
                  new Claim("REG_NUMBER", REG_NUMBER)

        };

      var token = new JwtSecurityToken(_config["Jwt:Issuer"],
        _config["Jwt:Issuer"],
        claims,
        expires: DateTime.Now.AddDays(1),
        signingCredentials: credentials);

      return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal ValidateToken(string token)
    {
      var tokenHandler = new JwtSecurityTokenHandler();
      var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
      var validationParameters = new TokenValidationParameters
      {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = _config["Jwt:Issuer"],
        ValidAudience = _config["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
      };

      try
      {
        var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
        return principal;
      }
      catch
      {
        return null;
      }
    }
  }
}
