import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const contactusPost = (data) => {
  return http.post(`/Administration/SaveContactUs`, data, {
    headers: authHeader(),
  });
};

const ContactusService = {
  contactusPost,
};

export default ContactusService;
