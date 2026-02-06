import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const getRoleList = (roleId) => {
  return http.get(`/DashBoard/AdminRoleWiseMenu?roleId=${roleId}`, {
    headers: authHeader(),
  });
};

const getRoleListSide = (roleId) => {
  return http.get(`/DashBoard/AdminRoleWiseMenu?roleId=${roleId}`, {
    headers: authHeader(),
  });
};


const getRoleById = () => {
  return http.get('/Administration/GetAllRoles', {
    headers: authHeader(),
  });
};

const updateRoleList = (permissions) => {
  return http.post('/DashBoard/SaveRoleMapping', permissions, {
    headers: authHeader(),
  });
};

const RoleManagements = {
  getRoleList,
  getRoleById,
  updateRoleList,
  getRoleListSide,
};

export default RoleManagements;
