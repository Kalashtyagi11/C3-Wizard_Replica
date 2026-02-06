import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const getNwDirectorPayroll = (CompanyId) => {
  return http.get(`/NonDirector/NewDirectorMainDetails?CompanyId=${CompanyId}`, {
    headers: authHeader(),
  });
};

const getC3generation = (data) => {
  console.log('getC3generation apiLoad', data);
  return http.post(
    `/NonDirector/NewDirectorDetailsC3?CompanyId=${data.CompanyId}&monthNo=${data.monthNo}&Year=${data.Year}&isNilReturn=${data.isNilReturn}`,
    data.dataLoad,
    {
      headers: authHeader(),
    },
  );
};

const getC3generationNill = (data) => {
  return http.post(
    `/NonDirector/NewDirectorDetailsC3?CompanyId=${data.CompanyId}&monthNo=${data.monthNo}&Year=${data.Year}&isNilReturn=${data.isNilReturn}`,
    data.dataLoad,
    {
      headers: authHeader(),
    },
  );
};

const saveC3generation = ({ dataSave }) => {
  console.log('atul', dataSave);

  return http.post(`/NonDirector/SaveNewDirector`, dataSave, {
    headers: authHeader(),
  });
};
// const ViewPayrollDirector = ({ headerID, CompanyId, monthno, Year }) => {
//
//   return http.get(
//     `/NonDirector/EditDirectorPayrollView?HeaderId=${headerID}&CompanyId=${CompanyId}&monthno=${monthno}&Year=${Year}`,
//     {
//       headers: authHeader(),
//     },
//   );
// };

const ViewPayrollDirector = ({ headerID, CompanyId, monthno, Year, popUpList, isNilReturn }) => {
  const requestBody = {
    headerID,
    CompanyId,
    monthno,
    year: Year,
    popUpList,
    isNilReturn,
  };

  return http.post('/NonDirector/EditDirectorPayrollView', requestBody, {
    headers: authHeader(),
  });
};

const editPayrollDirector = ({ payload }) => {
  console.log('anjani', payload);
  return http.post(`/NonDirector/EditDirectorPayroll`, payload, {
    headers: authHeader(),
  });
};

const getWorkingDirector = ({ CompanyId }) => {
  return http.get(`/NonWorkingDirector/NonWorkingDirector_List?CompanyId=${CompanyId}`, {
    headers: authHeader(),
  });
};

const addNonDirector = ({ formData }) => {
  return http.post('/NonWorkingDirector/Save_Director', formData, {
    headers: authHeader(),
  });
};
const editNonWorkingDirector = ({ formData }) => {
  return http.post('/NonWorkingDirector/Save_Director', formData, {
    headers: authHeader(),
  });
};

const deleteNonDirector = ({ employeeID, isC3Created }) => {
  return http.get(
    `/NonWorkingDirector/DeleteDirector?EmployeeId=${employeeID}&isc3created=${isC3Created}`,
    {
      headers: authHeader(),
    },
  );
};

const deleteNonDirectorPayroll = (headerID) => {
  return http.post(
    `/NonDirector/C3Report_Delete_Click?HeaderID=${headerID}`,
    {},
    {
      headers: authHeader(),
    },
  );
};

const getByIdNonWorkingDirectory = ({ employeeID }) => {
  return http.get(`/NonWorkingDirector/NonWorkingDirectorGetById?employeeID=${employeeID}`, {
    headers: authHeader(),
  });
};

const previewApi = (data) => {
  console.log('previewApi load ', data);
  return http.post(`/C3/SaveNContinue?`, data, {
    headers: authHeader(),
  });
};
const getContribution = (data) => {
  return http.get(
    `/NonDirector/NWDirectorReports?CompanyId=${data.companyId}&MonthF=${data.MonthF}&MonthTO=${data.MonthTO}&Year=${data.Year}&endYear=${data.endYear}`,
    {
      headers: authHeader(),
    },
  );
};

const PreviewPayroll = (data) => {
  return http.get(
    `/NonDirector/NWDirectorReports?CompanyId=${data.companyId}&MonthF=${data.MonthF}&MonthTO=${data.MonthTO}&Year=${data.Year}`,
    {
      headers: authHeader(),
    },
  );
};

const PreviewDirectorc3 = (data) => {
  console.log('PreviewDirectorc3 axios load', data);
  return http.post(`/NonDirector/NWSaveNContinue`, data, {
    headers: authHeader(),
  });
};

const PostNWSubmitC3Bulk = (data) => {
  console.log('PostNWSubmitC3Bulk apiLoad', data);
  return http.post(
    `/NonDirector/NWSubmitC3Bulk?CompanyId=${data.CompanyId}&headerId=${data.headerId}&UserID=${data.UserID}`,
    data.dataLoad,
    {
      headers: authHeader(),
    },
  );
};

const directorImport = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/NonWorkingDirector/ImportDirector?${queryString}`, {
    headers: authHeader(),
  });
};

const ImportSubmitted = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/NonWorkingDirector/DownloadSubmittedC3_Click?${queryString}`, {
    headers: authHeader(),
  });
};

const ImportSubmittedLatest = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/NonWorkingDirector/ImportLastC3_Click?${queryString}`, {
    headers: authHeader(),
  });
};

// const GetNwCheckC3Created = (data) => {
//
//   console.log('GetNwCheckC3Created apiLoad', data);
//   return http.get(
//     `/NonDirector/NwCheckC3Created?Year=${data.Year}&Month=${data.Month}&CompanyId=${data.CompanyId}`,
//     data.dataLoad,
//     null,
//     {
//      headers: authHeader(),
//     },
//   );
// };

const GetNwCheckC3Created = (data) => {
  console.log('GetNwCheckC3Created apiLoad', data);

  const config = {
    ...data.dataLoad, // Optional: spread additional Axios options like `timeout`, `params`, etc.
    headers: authHeader(), // Include the authorization header
  };

  return http.get(
    `/NonDirector/NwCheckC3Created?Year=${data.Year}&Month=${data.Month}&CompanyId=${data.CompanyId}`,
    config,
  );
};

const OverwritingNWdirector = (payload) => {
  return http.post('/NonDirector/NWButton_Finalize_Click', payload, {
    headers: authHeader(),
  });
};

const getNWDirector = (payload) => {
  const query = new URLSearchParams(payload).toString();
  return http.get(`/NonWorkingDirector/Get_NWEmployeeDetails_SSB_Click?${query}`, {
    headers: authHeader(),
  });
};

const getNWDirectorNew = (payload) => {
  const query = new URLSearchParams(payload).toString();
  return http.get(`/NonWorkingDirector/Get_NWEmployeeDetails_SSB_Click?${query}`, {
    headers: authHeader(),
  });
};

const ImportC3Data = (formData) => {
  return http.post(`/NonDirector/UploadC3FileDir`, formData, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
};

const UpdateExceptionRow = (userId, companyId, row) => {
  return http.post(
    `/NonDirector/validateC3FileEmpDir?userid=${userId}&companyId=${companyId}`,
    [row],
    {
      headers: authHeader(),
    },
  );
};

const NonWorkingDirectory = {
  getNwDirectorPayroll,
  getC3generation,
  getC3generationNill,
  saveC3generation,
  getWorkingDirector,
  ViewPayrollDirector,
  editPayrollDirector,
  addNonDirector,
  deleteNonDirector,
  getByIdNonWorkingDirectory,
  editNonWorkingDirector,
  previewApi,
  deleteNonDirectorPayroll,
  getContribution,
  PreviewPayroll,
  PreviewDirectorc3,
  PostNWSubmitC3Bulk,
  directorImport,
  ImportSubmitted,
  ImportSubmittedLatest,
  GetNwCheckC3Created,
  OverwritingNWdirector,
  getNWDirector,
  getNWDirectorNew,
  ImportC3Data,
  UpdateExceptionRow,
};

export default NonWorkingDirectory;
