import http from '../../../baseUrl/HttpCommon';
import authHeader from '../../authHeader/AuthHeader';

const getContribution = (data) => {
  
  return http.get(
    `/SelfEmpContribution/ReprtsdataSelfSearach?CompanyId=${data.companyId}&Fmonth=${data.Fmonth}&Tmonth=${data.Tmonth}&year=${data.year}`,
    {
      headers: authHeader(),
    },
  );
};

const previewNWData = ({ headerId, year, monthNo }) => {
  
  return http.get(
    `/SelfEmpContribution/ReprtsdataSelfAndDashboard?month=${monthNo}&year=${year}&SEC3ID=${headerId}`,
    {},
    {
      headers: authHeader(),
    },
  );
};

const ImportSubmitted = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/SelfEmployee/btn_DownloadSubmittedC3_Click?${queryString}`, {
    headers: authHeader(),
  });
}; 

const ImportSubmittedLatest = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/SelfEmployee/btn_ImportLastC3_Click?${queryString}`, {
    headers: authHeader(),
  });
};

const ImportBima = (formData) => {
  return http.get(`/Auth/ImportVerifiedDatainSSB`, {
    params: {
      UserName: formData.UserName,
      SSN: formData.SSN,
      regno: formData.regno,
    },
    headers: authHeader(),
  });
};

const NonWorkingDirectory = {
  getContribution,
  previewNWData,
  ImportSubmitted,
  ImportSubmittedLatest,
  ImportBima
};

export default NonWorkingDirectory;
