import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const getBonusSettings = (CompanyId) => {
  return http.get(`/C3/Load_Wages_Bonus_PayEmployee?CompanyId=${1}`,
    {
      headers: authHeader()
    }
  );
};
const getBonusSettingsList = () => {
  return http.get(`/BonusSettings/GetBonusSettingList`,
    {
      headers: authHeader()
    }
  );
};
const getBonusSettingsById = (id) => {
  return http.get(`/BonusSettings/GetBonusSettingById?Id=${id}`,
    {
      headers: authHeader()
    }
  );
};

const getYearsList = () => {
  return http.get(`/Administration/GetYearList`,
    {
      headers: authHeader()
    }
  );
};

const createBonusSetting = (data) => {
  return http.post(`/BonusSettings/BonusSettingAddOrUpdate`,data ,
    {
      headers: authHeader()
    }
  );
};

const deleteSetting = (id,year,msg) => {
  return http.get(`/BonusSettings/DeleteBonusSetting?Id=${id}&Year=${year}&UserMessage=${msg}`,
    {
      headers: authHeader()
    }
  );
};

const BonusSettingsServices = {
  getBonusSettings,createBonusSetting,getBonusSettingsList,getBonusSettingsById,getYearsList,deleteSetting
};

export default BonusSettingsServices;