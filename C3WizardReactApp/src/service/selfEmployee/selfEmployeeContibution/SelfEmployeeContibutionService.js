import http from '../../../baseUrl/HttpCommon';
import authHeader from '../../authHeader/AuthHeader';

const getSelfEmployee = ({ companyId }) => {
  return http.get(`/SelfEmpContribution/MainGridSelfEmpContribution?CompanyId=${companyId}`, {
    headers: authHeader(),
  });
};

const addSelfEmployee = ({ formData }) => {
  return http.post(`/SelfEmployee/Update_SelfEmployee`, formData, {
    headers: authHeader(),
  });
};

const updateSelfEmployee = ({ formData }) => {
  return http.post(`/SelfEmployee/Update_SelfEmployee`, formData, {
    headers: authHeader(),
  });
};

const createSelfContribution = ({ formData }) => {
  return http.get(
    '/SelfEmpContribution/SearchSelpEmpContribution',
    {
      params: formData,
      headers: authHeader(),
    },
    {},
  );
};

const saveSelfContribution = ({ data }) => {
  return http.post(`/SelfEmpContribution/SaveSelfEmployeeContribution`, data, {
    headers: authHeader(),
  });
};

const saveSelfContributionPreview = ({ data }) => {
  return http.post(`/SelfEmpContribution/SaveSelfEmployeeContribution`, data, {
    headers: authHeader(),
  });
};

const deleteSelfEmployee = (headerId) => {
  return http.get(`/SelfEmpContribution/DeleteSelfEmpContribution?headerId=${headerId}`, {
    headers: authHeader(),
  });
};

const getList = ({ headerId, CompanyId }) => {
  return http.get(
    `/SelfEmpContribution/EditListingSelfContibution?H_Id=${headerId}&companyId=${CompanyId}`,
    {
      headers: authHeader(),
    },
  );
};

const updateOnChange = ({ onChangeData }) => {
  return http.post('/SelfEmpContribution/ChangeSelpEmpContribution', onChangeData, {
    headers: authHeader(),
  });
};

// const ExportCThree = (params) => {

//   const queryString = new URLSearchParams(params).toString();
//   return http.post(`/SelfEmployee/Submit_C3_Click?${queryString}`, null, {
//     headers: authHeader(),
//   });
// };

const ExportCThree = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.post(`/SelfEmployee/Submit_C3_Click?${queryString}`, {
    headers: authHeader(),
  });
};

const EXportSubmit = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.post(`/SelfEmployee/Export_button_Data?${queryString}`, null, {
    headers: authHeader(),
  });
};

const ExportCThreeData = (headerId, month, year) => {
  return http.post(
    `/SelfEmployee/Export_button_Click?year=${year}&month=${month}&headerId=${headerId}`,
    null,
    {
      headers: authHeader(),
    },
  ); // Passing data in the body
};

const exportCreatedCThree = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.post(`/SelfEmployee/Export_button_Click?${queryString}`, null, {
    headers: authHeader(),
  });
};

const isCreatedCThree = ({ createdNewItems }) => {
  return http.post('/SelfEmpContribution/SaveSelfEmployeeContribution', createdNewItems, {
    headers: authHeader(),
  });
};

const PersonalDetails = {
  getSelfEmployee,
  addSelfEmployee,
  updateSelfEmployee,
  createSelfContribution,
  saveSelfContribution,
  saveSelfContributionPreview,
  deleteSelfEmployee,
  getList,
  updateOnChange,
  ExportCThree,
  isCreatedCThree,
  exportCreatedCThree,
  ExportCThreeData,
  EXportSubmit,
};

export default PersonalDetails;
