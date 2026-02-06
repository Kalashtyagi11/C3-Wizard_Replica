import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const createSelfEmployedSettings = (data) => {
    return http.post(`/SelfEmployee/SaveEmployeeSettings`,data,
      {
        headers: authHeader()
      }
    );
  };
  
  const getSelfEmployedSettings = () => {
    return http.get(`/SelfEmployee/Get_Master_Self_Employed_Settings`,
      {
        headers: authHeader()
      }
    );
  };
  
  const getSelfEmployedSettingById = (id) => {
    return http.get(`/SelfEmployee/Get_Wages_Catagory_Self_Employed_SettingsEdit?SESId=${id}`,
      {
        headers: authHeader()
      }
    );
  };


  const deleteSelfEmployedSetting = (id,st,en) => {
    return http.get(`/SelfEmployee/C3_Setting_Delete_Click?SESId=${id}&Start_Date=${st}&End_Date=${en}&IsLocked=false`,
      {
        headers: authHeader()
      }
    );
  };

  const SelfSettings = {
    createSelfEmployedSettings,getSelfEmployedSettings,getSelfEmployedSettingById,deleteSelfEmployedSetting
  };
  
  export default SelfSettings;