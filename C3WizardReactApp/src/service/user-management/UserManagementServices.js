import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const getLoadUsers = (CompanyId, roleId, UserId) => {
  return http.get(
    `/Administration/LoadUsers?CompanyId=${CompanyId}&RoleId=${roleId}&userId=${UserId}`,
    {
      headers: authHeader(),
    },
  );
};
const getUserManagement = (userId) => {
  return http.get(`/Administration/GetEditUserManagement?Userid=${userId}`, {
    headers: authHeader(),
  });
};

// const getAuditTrails = (CompanyId, roleId) => {
//   return http.get(`/Administration/GetUserAuditTrail?CompanyId=${CompanyId}&RoleId=${roleId}`, {
//     headers: authHeader(),
//   });
// };

// const getUserAuditTrail = (params) => {
//   return http.get('/SelfUserManagement/AllDetailsAuditLog', {
//     headers: authHeader(),
//     params, // Axios will build the query string automatically
//   });
// };

const getUserAuditTrail = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/SelfUserManagement/AllDetailsAuditLogPgn?${queryString}`, null, {
    headers: authHeader(),
  });
};

const getLoggedHistory = (
  CompanyId,
  isSelfEmployed,
  roleId,
  pageNumber = 1,
  pageSize = 10,
  fromDate,
  toDate,
) => {
  return http.get(
    `/Administration/LoggedInHistory?companyId=${CompanyId}${
      isSelfEmployed ? `&isSelfEmployed=${isSelfEmployed}` : ''
    }&RoleId=${roleId}&pageNumber=${pageNumber}&pageSize=${pageSize}&fromDate=${
      fromDate ?? ''
    }&toDate=${toDate ?? ''}`,
    {
      headers: authHeader(),
    },
  );
};

const saveAndUpdateUser = (data) => {
  return http.post(`/Administration/SaveUser/UpdateUser`, data, {
    headers: authHeader(),
  });
};

const resetPassword = (data) => {
  return http.post(`/Administration/ResetPassword`, data, {
    headers: authHeader(),
  });
};

const getAllCompanyData = (isNW) => {
  return http.get(`/Auth/GetAllCompanyData${isNW ? '?nw=true' : ''}`, {
    headers: authHeader(),
  });
};

const getAllMapingData = (companyId = 0) => {
  return http.get(`/Auth/relationshipdropdown?compid=${companyId}`, {
    headers: authHeader(),
  });
};
const MappingCompanies = (data) => {
  return http.post(`/Auth/RelationShipCompanies`, data, {
    headers: authHeader(),
  });
};

// const getAllCompany = (isNW, pageNumber, pageSize) => {
//   const params = new URLSearchParams();

//   if (isNW) params.append('nw', 'true');
//   if (pageNumber !== undefined) params.append('pageNumber', pageNumber);
//   if (pageSize !== undefined) params.append('pageSize', pageSize);

//   const queryString = params.toString(); // "nw=true&pageNumber=1&pageSize=10"

//   return http.get(`/Auth/GetAllCompany${queryString ? `?${queryString}` : ''}`, {
//     headers: authHeader(),
//   });
// };

// const getAllCompany = (pageNumber, pageSize, firstName) => {
//   const encodedName = encodeURIComponent(firstName || '');
//   return http.get(
//     `/Auth/GetAllCompany?pageNumber=${pageNumber}&pageSize=${pageSize}&empName=${encodedName}`,
//     {
//       headers: authHeader(),
//     },
//   );
// };

const getAllCompany = (pageNumber, pageSize, firstName, sortConfig) => {
  const encodedName = encodeURIComponent(firstName || '');

  // Add sorting parameters if provided
  let url = `/Auth/GetAllCompany?pageNumber=${pageNumber}&pageSize=${pageSize}&empName=${encodedName}`;

  if (sortConfig) {
    const orderName = sortConfig.direction === 'desc' ? 'desc' : 'asc';

    // Map frontend sort keys to backend keys if needed
    const keyNameMap = {
      regNumber: 'regNumber',
      contactPerson: 'contactPerson',
      companyName: 'companyName',
      email: 'email',
    };

    const keyName = keyNameMap[sortConfig.key] || sortConfig.key || 'regNumber';

    url += `&orderName=${orderName}&keyName=${keyName}`;
  }

  return http.get(url, {
    headers: authHeader(),
  });
};

const getAllSelfEmployerData = () => {
  return http.get(`/Auth/GetAllEmployersSelfData?userid=0&roleid=1`, {
    headers: authHeader(),
  });
};

const getAllSelfEmployer = (pageNumber, pageSize, firstName, sortConfig) => {
  // Base URL with required parameters
  let url = `/Auth/GetAllEmployersSelf?userid=0&roleid=1&pageNumber=${pageNumber}&pageSize=${pageSize}&empName=${
    firstName || ''
  }`;

  // Add sorting parameters if provided
  if (sortConfig && sortConfig.key) {
    const orderName = sortConfig.direction === 'desc' ? 'desc' : 'asc';

    // Map frontend sort keys to backend keys if needed
    const keyNameMap = {
      socSecNum: 'socSecNum',
      fullName: 'fullName',
      email: 'email',
      mobile: 'mobile',
    };

    const keyName = keyNameMap[sortConfig.key] || sortConfig.key || 'socSecNum';

    url += `&orderName=${orderName}&keyName=${keyName}`;
  }

  return http.get(url, {
    headers: authHeader(),
  });
};

const getSelfPersonal = (userId) => {
  return http.get(`/Administration/GetUserProfile?userId=${userId}`, {
    headers: authHeader(),
  });
};

const getSelfEmployeeReport = ({ companyId }) => {
  return http.get(`/SelfEmpContribution/MainGridSelfEmpContribution?CompanyId=${companyId}`, {
    headers: authHeader(),
  });
};

const resetUserData = (userId) => {
  return http.get(`/Administration/ResetSendMail?UserId=${userId}`, {
    headers: authHeader(),
  });
};

const getAllEmployeeAndWoking = (CompanyId, roleId = 1) => {
  return http.get(`/Administration/LoadUsers?CompanyId=${CompanyId}&RoleId=${roleId}`, {
    headers: authHeader(),
  });
};

const getAllAcountHolder = () => {
  return http.get(`/Payment/getCardHolderName`, {
    headers: authHeader(),
  });
};

const UserUpdateStatus = (userId, RoleId) => {
  return http.post(`/Administration/userInactive?userId=${userId}&RoleId=${RoleId}`, {
    headers: authHeader(),
  });
};

const UserManagementServices = {
  getLoadUsers,
  saveAndUpdateUser,
  getSelfPersonal,
  getAllSelfEmployer,
  getSelfEmployeeReport,
  getUserAuditTrail,
  getUserManagement,
  getLoggedHistory,
  getAllCompany,
  resetPassword,
  resetUserData,
  getAllCompanyData,
  getAllSelfEmployerData,
  getAllEmployeeAndWoking,
  getAllAcountHolder,
  UserUpdateStatus,
  MappingCompanies,
  getAllMapingData,
};

export default UserManagementServices;
