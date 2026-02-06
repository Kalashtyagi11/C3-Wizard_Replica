import http from '../../../baseUrl/HttpCommon';
import authHeader from '../../authHeader/AuthHeader';

const getDashboardList = ({ CompanyId }) => {
  return http.get(`/SelfEmployee/load_dashboard?CompanyId=${CompanyId}`, {
    headers: authHeader(),
  });
};

const previewNWData = ({ headerId, year, monthNo }) => {
  return http.get(
    `/SelfEmpContribution/ReprtsdataSelfAndDashboard?month=${monthNo}&year=${year}&SEC3ID=${headerId}`,
    {
      headers: authHeader(),
    },
  );
};

const getReportList = (data) => {
  return http.get(
    `/SelfEmployee/load_dashboard?CompanyId=${data.CompanyId}&MonthF=${data.MonthF}&MonthTO=${data.MonthTO}&Year=${data.Year}&endYear=${data.endYear}`,
    {
      headers: authHeader(),
    },
  );
};

const getPreviewNWData = ({ headerId, year, monthNo }) => {
  return http.get(
    `/SelfEmpContribution/ReprtsdataSelfAndDashboard?month=${monthNo}&year=${year}&SEC3ID=${headerId}`,
    {
      headers: authHeader(),
    },
  );
};

const selfAdminDelete = (headerId, userid, type) => {

  return http.post(`/C3/DeleteC3data?c3headerid=${headerId}&userid=${userid}&type=${type}`, {
    headers: authHeader(),
  });
};

const DashboardService = {
  getDashboardList,
  previewNWData,
  getReportList,
  getPreviewNWData,
  selfAdminDelete,
};

export default DashboardService;
