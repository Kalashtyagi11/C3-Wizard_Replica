import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

// const getEmployerList = (CompanyId) => {
//   return http.get(`/Auth/GetAllEmployers?CompanyId=${CompanyId}`);
// };

const getPersonalDetail = ({ selfEmployeeid }) => {
  return http.get(`/SelfEmployee/SelfEmployeeGet?selfEmployeeid=${selfEmployeeid}`, {
    headers: authHeader(),
  });
};

const updatePersonal = (updatedFormData) => {
  return http.post(`/SelfEmployee/Update_SelfEmployee`, updatedFormData, {
    headers: authHeader(),
  });
};

const getCategory = () => {
  return http.get('/Auth/LoadCategoryAll');
};

const getCountry = () => {
  return http.get('/Auth/GetAllCountry');
};

const PersonalDetails = {
  getPersonalDetail,
  updatePersonal,
  getCategory,
  getCountry,
};

export default PersonalDetails;
