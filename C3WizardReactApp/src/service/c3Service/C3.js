import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const getBonus = (CompanyId) => {
  return http.get(`/C3/Load_Wages_Bonus_PayEmployee?CompanyId=${CompanyId}`);
};

const deleteBonus = (data) => {
  return http.post(`/C3/DeleteBonus?BonusPayID=${data.payId}&PayDate=${data.payDate}&EmployeeId=${data.employeeId}&CompanyId=${data.companyId}`);
};

const saveBonus = (data) => {
  return http.post(`/C3/SaveBonus`,data,
    {
        headers: authHeader()
      }
  );
};

const GetEmployeeList = (CompanyId) => {
  console.log("getEmployee api call")
  return http.get(`/C3/GetEmployee_List?CompanyId=${CompanyId}`,
    {
        headers: authHeader()
      }
  );
};
const saveEdit = (data) => {
  return http.post(`/C3/UpdateBonus`,data,
    {
        headers: authHeader()
      }
  );
};









const C3Services = {
  getBonus,
  deleteBonus,
  saveBonus,
  GetEmployeeList,
  saveEdit,
};

export default C3Services;
