import http from '../../../baseUrl/HttpCommon';
import authHeader from '../../authHeader/AuthHeader';

const getPersonal = (userId) => {
  return http.get(`/Administration/GetUserProfile?userId=${userId}`, {
    headers: authHeader(),
  });
};

const updatePersonal = (formDataToSend) => {
  console.log('formData', formDataToSend);
  return http.post(`/Administration/EditUserProfile`, formDataToSend, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...authHeader(),
    },
  });
};

const UserManagementService = {
  getPersonal,
  updatePersonal,
};

export default UserManagementService;
