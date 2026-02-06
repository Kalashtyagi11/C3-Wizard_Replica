import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const getCGeneration = (CompanyId) => {
  console.log('getCGeneration CompanyId', CompanyId);
  return http.get(`/C3/GetC3Reports/${CompanyId}`, {
    headers: authHeader(),
  });
};

const loadEmployee = (data) => {
  console.log('loadEmployee load ', data.dataLoad);
  return http.post(
    `/C3/LoadEmployee?CompanyId=${data.CompanyId}&monthno=${data.month}&Year=${data.year}&isNilReturn=${data.isNilReturn}`,
    data.dataLoad,
    {
      headers: authHeader(),
    },
  );
};

const loadEmployeeNill = (data) => {
  console.log('loadEmployee load ', data.dataLoad);
  return http.post(
    `/C3/LoadEmployee?CompanyId=${data.CompanyId}&monthno=${data.month}&Year=${data.year}&isNilReturn=${data.isNilReturn}`,
    data.dataLoad,
    {
      headers: authHeader(),
    },
  );
};

const previewApi = (data) => {
  console.log('previewApi load ', data);
  return http.post(`/C3/SaveNContinue?`, data, {
    headers: authHeader(),
  });
};

// const editC3EmployeeListingApi = (data) => {
//   return http.get(
//     `/C3/EditC3EmployeeListing?headerId=${data.headerId}&CompanyId=${
//       data.CompanyId
//     }&popUpList=${encodeURIComponent(JSON.stringify(data.popUpList))}`,
//     {
//       headers: authHeader(),
//     },
//   );
// };

const editC3EmployeeListingApi = (data) => {
  return http.post(
    `/C3/EditC3EmployeeListing`,
    {
      headerId: data.headerId,
      CompanyId: data.CompanyId,
      popUpList: data.popUpList,
      isNilReturn: data.isNilReturn,
      // Sent in body, not in URL
    },
    {
      headers: authHeader(),
    },
  );
};

const deleteCGeneration = (headerId) => {
  return http.get(`/C3/DeleteC3?headerId=${headerId}`, {
    headers: authHeader(),
  });
};

const submitC3 = (data) => {
  console.log('submitC3 data', data);
  return http.post(
    `/C3/SubmitC3Bulk?headerId=${data.headerID}&CompanyId=${data.CompanyId}&UserID=${data.UserID}`,
    null,
    {
      headers: authHeader(),
    },
  );
};

const checkC3Created = (data) => {
  return http.get(
    `/C3/check_C3Created?Year=${data.year}&Month=${data.month}&CompanyId=${data.CompanyId}`,
    {
      headers: authHeader(),
    },
  );
};

const addOrUpdateSaveNContinue = (data) => {
  return http.post(`/C3/AddOrUpdateSaveNContinue`, data, {
    headers: authHeader(),
  });
};

const UpdateExceptionRow = (userId, companyId, row) => {
  return http.post(`/C3/validateC3FileEmp?userid=${userId}&companyId=${companyId}`, [row], {
    headers: authHeader(),
  });
};

const AddExceptionRow = (userId, companyId, row) => {
  return http.post(`/C3/validateC3FileEmp2?userid=${userId}&companyId=${companyId}`, [row], {
    headers: authHeader(),
  });
};

const ImportC3Data = (formData) => {
  return http.post(`/C3/UploadC3File2`, formData, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
};

const CGenerationService = {
  getCGeneration,
  loadEmployee,
  loadEmployeeNill,
  previewApi,
  editC3EmployeeListingApi,
  deleteCGeneration,
  submitC3,
  checkC3Created,
  addOrUpdateSaveNContinue,
  ImportC3Data,
  UpdateExceptionRow,
  AddExceptionRow,
};

export default CGenerationService;
