import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const getCSettings = () => {
  return http.get(`/Settings/GetAllC3Settings?RoleId=1`,
    {
      headers: authHeader()
    }
  );
};
const getCSettingsPeriod = (from,to) => {
  return http.get(`/Settings/GetAllC3Settings?fromPeriod=${from}&toPeriod=${to}&RoleId=1`,
    {
      headers: authHeader()
    }
  );
};

const createC3Settings = (data) => {
  return http.post(`/Settings/C3Settings`,data ,
    {
      headers: authHeader()
    }
  );
};

const bonusSetting = ({RoleId, year}) => {
  return http.get(`/Settings/Get_EXEMPTED_CONTRIBUTION_Settings?RoleId=${RoleId}&year=${year}`,
    {
      headers: authHeader()
    }
  );
};

const getC3Settings = (id) => {
  return http.get(`/Settings/C3Settingedit?Gsettingid=${id}`,
    {
      headers: authHeader()
    }
  );
};

const deleteC3Settings = (id,stD,enD) => {
  return http.post(`/Settings/C3SettingDeleteNew?Gsettingid=${id}&st_Date=${stD}&en_Date=${enD}&message=true&HelperRoleId=1`,{},
    {
      headers: authHeader()
    }
  );
};

const CSettings = {
  getCSettings,
  bonusSetting,createC3Settings,getC3Settings,deleteC3Settings,getCSettingsPeriod
};

export default CSettings;
