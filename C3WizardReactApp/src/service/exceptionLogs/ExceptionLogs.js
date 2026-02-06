import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

// const getException = () => {
//   return http.get(`/C3/GetLoggedExceptionsReport`, {
//     headers: authHeader(),
//   });
// };

const getException = (queryParams) => {
  return http.get(`/Administration/GetLoggedExceptionsReport`, {
    headers: authHeader(),
    params: queryParams, // axios will append these as query params
  });
};

const ExceptionLogs = {
  getException,
};

export default ExceptionLogs;
