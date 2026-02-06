import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const getContribution = (data) => {
  return http.get(
    `/DashBoard/load_dashboard?CompanyId=${data.companyId}&ResultArea=${
      data.ResultArea
    }&FromMonth=${data.FromMonth}&ToMonth=${data.ToMonth}&Year=${data.Year}&endYear=${
      data.endYear ?? ''
    }`,
    {
      headers: authHeader(),
    },
  );
};

const getStatus = (data) => {
  return http.get(`/DashBoard/GetUnSubmitNotes?headerId=${data.headerId}&type=${data.type}`, {
    headers: authHeader(),
  });
};

const getContributionSingle = (data) => {
  return http.get(`/DashBoard/load_dashboard?CompanyId=${data}`, {
    headers: authHeader(),
  });
};

const previewAllData = ({ monthName, year, companyId, c3HeaderId }) => {
  return http.get('/C3/C3Report', {
    params: { monthName, year, companyId, c3HeaderId },
    headers: authHeader(),
  });
};

const getCompanyDropdown = (data) => {
  console.log('getCompanyDropdown', data);
  return http.get(
    `/DashBoard/FillCompanyDropdown?ParentId=${data.ParentId}&UserID=${data.UserID}&roleId=${data.roleId}`,
    {
      headers: authHeader(),
    },
  );
};

const getCompanyDropdownUser = (data) => {
  console.log('getCompanyDropdown', data);
  return http.get(
    `/DashBoard/FillCompanyDropdown?ParentId=${data.ParentId}&UserID=${data.UserID}&roleId=${data.roleId}`,
    {
      headers: authHeader(),
    },
  );
};

const previewNWData = ({ monthId, year, companyId, c3HeaderId }) => {
  return http.get('/NonDirector/checkDirectorReports', {
    params: { monthId, year, companyId, c3HeaderId },
    headers: authHeader(),
  });
};

const ImportCThree = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/C3/btn_DownloadSubmittedC3_Click?${queryString}`, {
    headers: authHeader(),
  });
};

const ImportCThreeLatest = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/C3/btn_ImportLastC3_Click?${queryString}`, null, {
    headers: authHeader(),
  });
};

const dashboardSubmitDirector = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.post(`/C3/SubmitC3Bulk?${queryString}`, null, {
    headers: authHeader(),
  });
};

const dashboardSubmitContribution = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.post(`/NonDirector/NWSubmitC3Bulk?${queryString}`, null, {
    headers: authHeader(),
  });
};

const paynowdata = (formData) => {
  return http.post(`/Payment/BuySubscription`, formData, {
    headers: authHeader(),
  });
};

const payNowDataCyber = (formData) => {
  return http.post(`/Payment/payNowDataCyberSource`, formData, {
    headers: authHeader(),
  });
};

const payNowCyberSourceTestAndLive = (formData) => {
  return http.post(`/Payment/payNowCyberSourceTestAndLive`, formData, {
    headers: authHeader(),
  });
};
const saveConfig = (formData) => {
  return http.post(`/Payment/saveConfigCyberSource`, formData, {
    headers: authHeader(),
  });
};
const TestTransaction = () => {
  return http.get(`/Payment/TestPaymentTransactionHistory`, {
    headers: authHeader(),
  });
};

// const downloadTransaction = ({ userId, c3HeaderId, transactionID }) => {
//

//   return http.get(
//     `/Payment/TransactionReport?userId=${userId}&c3HeaderId=${c3HeaderId}&transactionID=${transactionID}`,
//     {
//       headers: authHeader(),
//     },
//   );
// };

const downloadTransaction = ({ userId, c3HeaderId, transactionID = null }) => {
  // Build query parameters
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('c3HeaderId', c3HeaderId);

  // Only add transactionID if it exists
  if (transactionID) {
    params.append('transactionID', transactionID);
  }

  return http.get(`/Payment/TransactionReport?${params.toString()}`, {
    headers: authHeader(),
  });
};

const downloadTransactionAdmin = ({ transactionID, c3HeaderId }) => {
  const params = new URLSearchParams();
  params.append('transactionId', transactionID);
  params.append('c3HeaderId', c3HeaderId);
  return http.get(`/Payment/TransactionReport?${params.toString()}`, {
    headers: authHeader(),
  });
};

const CardDetailsCyber = (userId, c3HeaderId) => {
  return http.get(
    `/Payment/CardDetailsByCyber?userId=${userId}&headerId
=${c3HeaderId}`,
    null,
    {
      headers: authHeader(),
    },
  );
};

const paymentResponse = (formData) => {
  return http.post(`/Payment/Paymentsuccess`, formData, {
    headers: authHeader(),
  });
};

const paymentResponseCancel = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.post(`/Payment/PaymentCancel?${queryString}`, {
    headers: authHeader(),
  });
};

const getLoaddashboardPaymentStatus = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.post(`/Payment/AdminTranactionHistory?${queryString}`, null, {
    headers: authHeader(),
  });
};

// const getLoaddashboardPaymentStatus = (params) => {
//   const queryString = new URLSearchParams(params).toString();
//   return http.post(`/Payment/AdminTranactionHistoryData?${queryString}`, null, {
//     headers: authHeader(),
//   });
// };

const getAllRoles = () => {
  return http.get(`/Administration/GetAllRoles`, {
    headers: authHeader(),
  });
};

const postSaveRole = (data) => {
  return http.post(`/Administration/SaveRole`, data, {
    headers: authHeader(),
  });
};

const getRoleById = (Roleid) => {
  console.log('getRoleById', Roleid);
  return http.get(`/Administration/GetRoleById?Roleid=${Roleid}`, {
    headers: authHeader(),
  });
};

const deleteRole = (roleId) => {
  return http.get(`/Administration/DeleteRole/${roleId}`, {
    headers: authHeader(),
  });
};

const updateRole = (data) => {
  return http.post(`/Administration/UpdateRole`, data, {
    headers: authHeader(),
  });
};

const uploadExcelData = (formData) => {
  return http.post(`/Payment/UploadCyberCsv`, formData, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
};

const reconciliationGet = (pageNumber, pageSize, fromDate, toDate, status, cardHolderName) => {
  const params = new URLSearchParams({
    pageNumber,
    pageSize,
  });

  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  if (status) params.append('status', status);
  if (cardHolderName) params.append('cardHolderName', cardHolderName);

  const url = `/Payment/GetReconciliationDataCyber?${params.toString()}`;

  return http.get(url, {
    headers: authHeader(),
  });
};

const ExcelreconciliationGet = () => {
  return http.get(`/Payment/GetReconciliationDataCyberData`, {
    headers: authHeader(),
  });
};

const ExportCompany = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.post(`/SelfEmployee/Export_C3_Data?${queryString}`, null, {
    headers: authHeader(),
  });
};

const ExportNotWorking = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.post(`/SelfEmployee/Export_button_Data?${queryString}`, null, {
    headers: authHeader(),
  });
};

const submitPayment = (params) => {
  return http.post('/Payment/OfflinepayNowDataCyberSource', params, {
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json',
    },
  });
};

const getReportedList = ({ HeaderId }) => {
  return http.get(`/Payment/GetOfflinePaymentData?HeaderId=${HeaderId}`);
};

const getReportedListNW = ({ HeaderId }) => {
  return http.get(`/Payment/GetOfflinePaymentDataDirector?HeaderId=${HeaderId}`);
};

const getReportedListSelf = ({ HeaderId }) => {
  return http.get(`/Payment/GetOfflinePaymentDataSelfEmp?SelfHeaderId=${HeaderId}`);
};

const ReconcileData = (payload) => {
  return http.post('/Payment/UpdateReconciliationData', payload, {
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json',
    },
  });
};

const reconcilationUpdate = (payload) => {
  return http.post('/Payment/UpdateReconciliationNotes', payload, {
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json',
    },
  });
};

const UpdateStatus = (payload) => {
  return http.post('/Payment/updateStatusConfig', payload, {
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json',
    },
  });
};

const StatusChange = (payload) => {
  return http.post('/DashBoard/isC3satusChange', null, {
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json',
    },
    params: payload,
  });
};

const getReconcilationUpdate = (id) => {
  return http.post(`/Payment/GetReconcilNotes?id=${id}`);
};

const CustomizeData = (payload) => {
  return http.post('/Payment/PostCyberSourceList', payload, {
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json',
    },
  });
};

const ColumnGet = (UserId) => {
  return http.get(`/Payment/GetCyberSourceFields?UserId=${UserId}`, {
    headers: authHeader(),
  });
};

const deleteContibutionAdmin = (headerId, userid, type) => {
  return http.post(`/C3/DeleteC3data?c3headerid=${headerId}&userid=${userid}&type=${type}`, {
    headers: authHeader(),
  });
};

const adminSearchResultsC3 = (receiptId, userId) => {
  return http.get(`/Payment/getOfflinePaymentsDetails?receiptId=${receiptId}&userId=${userId}`, {
    headers: authHeader(),
  });
};

const adminSearchResultsNW = (receiptId, userId) => {
  return http.get(`/Payment/getOfflinePaymentsDetails?receiptId=${receiptId}&userId=${userId}`, {
    headers: authHeader(),
  });
};

const adminSearchResultsSelf = (receiptId, userId) => {
  return http.get(`/Payment/getOfflinePaymentsDetails?receiptId=${receiptId}&userId=${userId}`, {
    headers: authHeader(),
  });
};

const DashboardService = {
  getContribution,
  getStatus,
  getContributionSingle,
  previewAllData,
  getCompanyDropdown,
  previewNWData,
  ImportCThree,
  ImportCThreeLatest,
  dashboardSubmitDirector,
  dashboardSubmitContribution,
  paynowdata,
  payNowDataCyber,
  payNowCyberSourceTestAndLive,
  downloadTransaction,
  TestTransaction,
  saveConfig,
  paymentResponse,
  paymentResponseCancel,
  getLoaddashboardPaymentStatus,
  getAllRoles,
  postSaveRole,
  getRoleById,
  deleteRole,
  updateRole,
  uploadExcelData,
  reconciliationGet,
  CardDetailsCyber,
  ExportCompany,
  ExportNotWorking,
  submitPayment,
  getReportedList,
  getReportedListNW,
  getReportedListSelf,
  ReconcileData,
  ColumnGet,
  CustomizeData,
  ExcelreconciliationGet,
  reconcilationUpdate,
  getReconcilationUpdate,
  deleteContibutionAdmin,
  UpdateStatus,
  StatusChange,
  getCompanyDropdownUser,
  adminSearchResultsC3,
  adminSearchResultsNW,
  adminSearchResultsSelf,
  downloadTransactionAdmin,
};

export default DashboardService;
