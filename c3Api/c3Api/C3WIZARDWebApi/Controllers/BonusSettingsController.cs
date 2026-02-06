using C3WizardHelper.ViewModels;
using C3WizardRepository.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using PayPal.Api;

namespace C3WIZARDWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BonusSettingsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly RepoBonusSettings _repoBonusSettings;
        public BonusSettingsController(IConfiguration configuration, RepoBonusSettings repoBonusSettings)
        {
            _configuration = configuration;
            _repoBonusSettings = repoBonusSettings;
        }
        [HttpGet("GetBonusSettingList")]
        public async Task<IActionResult> GetBonusSettingList()
        {
            try
            {
                var data = await _repoBonusSettings.Get_EXEMPTED_CONTRIBUTION_Settings();

                if (data == null)
                {
                    return NotFound(new { message = "User not found"});
                }

                return Ok(data);
            }
            catch (SqlException sqlEx)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, sqlEx.Message, sqlEx.StackTrace);
                return StatusCode(500, new { message = "Database error occurred.", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        [HttpPost("BonusSettingAddOrUpdate")]
        public async Task<IActionResult> BonusSettingAddOrUpdate(BonusSettingVM bonusSettingVM)
        {
            try
            {
                var data = await _repoBonusSettings.Save_button_Click(bonusSettingVM);

                if (data == null)
                {
                    return NotFound(new { message = "User not found", userId = bonusSettingVM.Id });
                }

                return Ok(data);
            }
            catch (SqlException sqlEx)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, sqlEx.Message, sqlEx.StackTrace);
                return StatusCode(500, new { message = "Database error occurred.", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        [HttpGet("GetBonusSettingById")]
        public async Task<IActionResult> GetBonusSetting(int Id)
        {
            try
            {
                var data = await _repoBonusSettings.Get_December_Bonus_Settings(Id);

                if (data == null)
                {
                    return NotFound(new { message = "User not found", userId = Id });
                }

                return Ok(data);
            }
            catch (SqlException sqlEx)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, sqlEx.Message, sqlEx.StackTrace);
                return StatusCode(500, new { message = "Database error occurred.", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        [HttpGet("DeleteBonusSetting")]
        public async Task<IActionResult> DeleteBonusSetting(int Id, string Year, string? st_Date, string? en_Date, bool UserMessage)
        {
            try
            {
                var data = await _repoBonusSettings.C3_Setting_Delete_Click(Id,Year,st_Date,en_Date,UserMessage);

                if (data == null)
                {
                    return NotFound(new { message = "User not found", userId = Id });
                }

                return Ok(data);
            }
            catch (SqlException sqlEx)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, sqlEx.Message, sqlEx.StackTrace);
                return StatusCode(500, new { message = "Database error occurred.", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                var (controller, action) = ExceptionMiddleware.GetActionInfo(this);
                LoggingHelper.LogError(controller, action, ex.Message, ex.StackTrace);
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
    }
}
