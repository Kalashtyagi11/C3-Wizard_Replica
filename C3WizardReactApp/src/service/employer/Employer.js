import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

// const getEmployerList = (CompanyId) => {
//   return http.get(`/Auth/GetAllEmployers?CompanyId=${CompanyId}`);
// };

const getEmployerList = (CompanyId, roleId) => {
  return http.get(`/Auth/GetAllEmployers?CompanyId=${CompanyId}&roleid=${roleId}`, {
    headers: authHeader(),
  });
};

const EmployersGetById = (companyId, UserId) => {
  return http.get(`/Auth/EmployersGetById?CompanyId=${companyId}&userId=${UserId}`, {
    headers: authHeader(),
  });
};

const EmployersGetByHeader = (companyId, UserId) => {
  return http.get(`/Auth/EmployersGetById?CompanyId=${companyId}&userId=${UserId}`, {
    headers: authHeader(),
  });
};

const postEmployer = (formData) => {
  return http.post(`/Auth/SaveEmployeer`, formData, {
    headers: authHeader(),
  });
};

const EmployerService = {
  getEmployerList,
  postEmployer,
  EmployersGetById,
  EmployersGetByHeader,
};

export default EmployerService;
