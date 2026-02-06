import http from '../../../baseUrl/HttpCommon';
import authHeader from '../../authHeader/AuthHeader';

// const getEmployerList = (CompanyId) => {
//   return http.get(`/Auth/GetAllEmployers?CompanyId=${CompanyId}`);
// };

const gerSelfSetting = (CompanyId, roleId) => {
  
  return http.get(`/Auth/GetAllEmployers?CompanyId=${CompanyId}&roleid=${roleId}`,
    {
      headers: authHeader()
    }
  );
};


  
const PersonalDetails = {
    gerSelfSetting,

};

export default PersonalDetails;

