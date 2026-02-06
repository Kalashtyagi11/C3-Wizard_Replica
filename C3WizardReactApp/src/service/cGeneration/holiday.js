import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const getHoliday = (CompanyId) => {
  return http.post(`/C3/GetAllHolidayPay?CompanyId=${CompanyId}`, {
    headers: authHeader(),
  });
};

const getEmployeeAndWoking = (data) => {
  console.log('getEmployeeAndWoking', data.isEmployeeDirector);
  if (data.isEmployeeDirector === 0) {
    return http.get(`/Auth/Employeelist?CompanyId=${data.CompanyId}`, {
      headers: authHeader(),
    });
  }

  return http.get(`/Auth/WokingEmployeelist?CompanyId=${data.CompanyId}`, {
    headers: authHeader(),
  });
};

const saveHoliday = (data) => {
  return http.post(`/C3/SaveEmployeeHoliday`, data, {
    headers: authHeader(),
  });
};

const deleteHoliday = (id) => {
  return http.get(`/C3/HolidaypayDelete?holidayPayId=${id}`, {
    headers: authHeader(),
  });
};

const GetAllHolidayPayById = (data) => {
  return http.get(
    `/C3/GetAllHolidayPayById?CompanyId=${data.CompanyId}&holidayPayId=${data.holidayPayId}&holidayPayView=${data.holidayPayView}`,
    {
      headers: authHeader(),
    },
  );
};

const editHoliday = (data) => {
  return http.post(`/C3/UpdateEmployeeHoliday`, data, {
    headers: authHeader(),
  });
};

const HolidayService = {
  getHoliday,
  getEmployeeAndWoking,
  saveHoliday,
  deleteHoliday,
  GetAllHolidayPayById,
  editHoliday,
};

export default HolidayService;
