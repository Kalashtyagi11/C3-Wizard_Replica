import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const login = ({ userName, userPass }) => {
  return http.post('/Auth/Login', {
    userName,
    userPass,
  });
};

const getProfile = (userId) => {
  return http.get(`/Administration/GetUserProfile?userId=${userId}`, {
    headers: authHeader(),
  });
};

const getProfiles = (userId) => {
  return http.get(`/Administration/GetUserProfile?userId=${userId}`, {
    headers: authHeader(),
  });
};

const forgotPassword = ({ formData }) => {
  return http.post(`/Auth/ForgetPasswordbtnNext`, formData, {
    headers: authHeader(),
  });
};

const forgotDetails = ({ formData }) => {
  return http.post(`/Auth/ForgotPassword`, formData, {
    headers: authHeader(),
  });
};

const changePassword = ({ formData }) => {
  return http.post(`/Administration/ResetPassword`, formData, {
    headers: authHeader(),
  });
};

// const selfRegister = ({ selfFormData }) => {
//   return http.post(`/Auth/RegisterCompanyNew`, selfFormData);

// };
const selfRegister = ({ selfFormData }) => {
  return http.post(`/Auth/RegisterCompanyNew`, selfFormData, {
    headers: {
      'Content-Type': 'application/json',
      headers: authHeader(),
    },
  });
};

const getAllCategory = () => {
  return http.get('/Auth/LoadCategoryAll', {
    headers: authHeader(),
  });
};

const getAllCountry = () => {
  return http.get('/Auth/GetAllCountry', {
    headers: authHeader(),
  });
};

const regNumber = () => {
  return http.post('/Auth/GetAllCountry', {
    headers: authHeader(),
  });
};
const companyRegister = ({ formData }) => {
  return http.post(`/Auth/RegisterCompanyNew`, formData, {
    headers: {
      'Content-Type': 'application/json',
      headers: authHeader(),
    },
  });
};

// const updateProfile = (formDataToSend) => {
//
//   console.log('formData', formDataToSend);
//   return http.post(`/Administration/EditUserProfile`, formDataToSend, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// };

const updateProfile = (formDataToSend) => {
  console.log('formData', formDataToSend);
  return http.post(`/Administration/EditUserProfile`, formDataToSend, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...authHeader(),
    },
  });
};

const getQuestionAnswer = ({ regNo, userName }) => {
  return http.get(`/Auth/QuestionAnswerForget?regNo=${regNo}&userName=${userName}`, {
    headers: authHeader(),
  });
};

const checkUserName = ({ UserName }) => {
  return http.post(`/Auth/TextChangeUserRegister?userName=${UserName}`, {
    headers: authHeader(),
  });
};

// const checkUserEmail = ({ EmailId, regNumber }) => {
//   return http.post(`/Auth/TextChangeUserEmail?EmailId=${EmailId}?regNo=${regNumber}`, {
//     headers: authHeader(),
//   });
// };
const checkUserEmail = ({ EmailId, regNo }) => {
  return http.post(
    `/Auth/TextChangeUserEmail?EmailId=${EmailId}&regNo=${regNo}`,

    {
      headers: authHeader(),
    },
  );
};

const checkUser = ({ SocSecNum, EmailId }) => {
  return http.get(`/Auth/TextChangeSsnSelfRegister?ssN=${SocSecNum}&email=${EmailId}`, {
    headers: authHeader(),
  });
};

const checkUserNameCompany = ({ UserName }) => {
  return http.post(`/Auth/TextChangeUserRegister?userName=${UserName}`, {
    headers: authHeader(),
  });
};

const checkUserCompany = ({ EmailId, regNo }) => {
  return http.get(
    `/Auth/ValidateRegistration?email=${encodeURIComponent(EmailId)}&regNo=${regNo}`,
    {
      headers: authHeader(),
    },
  );
};

const logout = ({ logId }) => {
  return http.post(`/Administration/Logout?logId=${logId}`, null, {
    headers: authHeader(),
  });
};

const ExitingUser = (formData) => {
  return http.post(`/Auth/btnNext_Click`, null, {
    params: {
      UserName: formData.UserName,
      Password: formData.Password,
    },
    headers: authHeader(),
  });
};

const verificationUser = (formData) => {
  return http.get(`/Auth/varificatiion_code`, {
    params: {
      code: formData.code,
      UserName: formData.UserName,
    },
    headers: authHeader(),
  });
};

const ImportEmployee = (formData) => {
  return http.get(`/Auth/ImportVerifiedDatainSSB`, {
    params: {
      UserName: formData.UserName,
      SSN: formData.SSN,
      regno: formData.regno,
    },
    headers: authHeader(),
  });
};

const resetUerPassword = (formData) => {
  return http.post(`/Administration/ResetPassword`, formData, {
    headers: authHeader(),
  });
};

const VerificationLink = ({ UserName, Password }) => {
  return http.get(`/Auth/ReSendvarifycode?UserName=${UserName}&Password=${Password}`, {
    headers: authHeader(),
  });
};

const getCardDetail = (userId, c3HeaderId) => {
  return http.get(`/Payment/CardDetailsByCyber?userId=${userId}&headerId=${c3HeaderId ?? 0}`, {
    headers: authHeader(),
  });
};

const upDatecardDetails = (editableCard) => {
  return http.post('/Payment/CardDetailsUpdateAndDel', editableCard, {
    headers: authHeader(),
  });
};

const deleteCardDetails = (editableCard) => {
  return http.post('/Payment/CardDetailsUpdateAndDel', editableCard, {
    headers: authHeader(),
  });
};

const VerifyMFAOtp = (userId, type, code) => {
  return http.post(`/Auth/VerifyMFAOtp?userId=${userId}&type=${type}&otp=${code}`, {
    headers: authHeader(),
  });
};

const AuthServices = {
  login,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  forgotDetails,
  selfRegister,
  companyRegister,
  regNumber,
  getAllCategory,
  getAllCountry,
  changePassword,
  getQuestionAnswer,
  checkUser,
  checkUserName,
  checkUserNameCompany,
  checkUserCompany,
  getProfiles,
  checkUserEmail,
  ExitingUser,
  verificationUser,
  ImportEmployee,
  resetUerPassword,
  VerificationLink,
  getCardDetail,
  upDatecardDetails,
  deleteCardDetails,
  VerifyMFAOtp,
};

export default AuthServices;
