import axios from 'axios';

export default axios.create({
  baseURL: 'https://c3testapi.digitalnoticeboard.biz/api/',
  // baseURL: 'https://testapi.ssbeservices.net/api/',
  // baseURL: 'https://api.ssbeservices.net/api/',

  headers: {
    // 'Content-Type': 'application/json',
  },
});
