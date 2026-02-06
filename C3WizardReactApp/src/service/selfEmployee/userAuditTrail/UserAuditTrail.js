import http from '../../../baseUrl/HttpCommon';
import authHeader from '../../authHeader/AuthHeader';

const getLoadUsers = ({ CompanyId }) => {
  return http.get(`/SelfUserManagement/GetUserAuditTrail?CompanyId=${CompanyId}`, {
    headers: authHeader(),
  });
};

// const getLoggedInHistory = ({CompanyId, isSelfEmployed, roleId}) => {
//
//   return http.get(`/SelfUserManagement/GetUserAuditTrail?CompanyId=${CompanyId, isSelfEmployed, roleId}`);
// };

const getLoggedInHistory = ({
  CompanyId,
  isSelfEmployed,
  roleId,
  pageNumber,
  pageSize,
  fromDate,
  toDate,
}) => {
  return http.get(
    `/Administration/LoggedInHistory?companyId=${CompanyId}&isSelfEmployed=${isSelfEmployed}&RoleId=${roleId}&pageNumber=${pageNumber}&pageSize=${pageSize}&fromDate=${fromDate}&toDate=${toDate}`,
    {
      headers: authHeader(),
    },
  );
};

const UserAuditTrail = {
  getLoadUsers,
  getLoggedInHistory,
};

export default UserAuditTrail;
