import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const getEmployeeList = (CompanyId) => {
  return http.get(`/C3/GetAllEmployee?CompanyId=${CompanyId}`, {
    headers: authHeader(),
  });
};

const getEmployeeSSN = (payload) => {
  const query = new URLSearchParams(payload).toString();
  return http.get(`/C3/Get_EmployeeDetails_SSB_Click?${query}`, {
    headers: authHeader(),
  });
};

const getEmployeeSSNNew = (payload) => {
  const query = new URLSearchParams(payload).toString();
  return http.get(`/C3/Get_EmployeeDetails_SSB_Click?${query}`, {
    headers: authHeader(),
  });
};

const addEmployee = (data) => {
  return http.post(`/C3/SaveEmployee`, data, {
    headers: authHeader(),
  });
};

// const deleteEmployee = (employeeId) => {
//   return http.get(`/C3/DeleteEmployee?EmployeeId=${employeeId}`);
// };

const deleteEmployee = ({ id, isc3created }) => {
  return http.get(`/C3/DeleteEmployee?EmployeeId=${id}&isc3created=${isc3created}`, {
    headers: authHeader(),
  });
};

const editEmployeeList = (employeeId) => {
  return http.get(`/C3/GetEmployeeByid?Employeeid=${employeeId}`, {
    headers: authHeader(),
  });
};

const AddDirectorWagesHolidayPay = (data) => {
  return http.post(`/C3/AddDirectorWagesHolidayPay`, data, {
    headers: authHeader(),
  });
};

const GetHolidayPayByEmployee = (data) => {
  return http.get(
    `/C3/GetHolidayPayByEmployee?employee=${data.employee}&CompanyId=${data.CompanyId}`,
    {
      headers: authHeader(),
    },
  );
};
const employeeImport = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/C3/btnImportEmp_Click?${queryString}`, {
    headers: authHeader(),
  });
};

const EmployeeService = {
  getEmployeeList,
  addEmployee,
  deleteEmployee,
  editEmployeeList,
  AddDirectorWagesHolidayPay,
  GetHolidayPayByEmployee,
  employeeImport,
  getEmployeeSSN,
  getEmployeeSSNNew,
};

export default EmployeeService;
