import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';


const GetpaidOrUnpaid = (data) => {
 
  return http.get(`/DashBoard/AdminDashBoardMaster`,
    {
      headers: authHeader()
    }
  );
};



const dashService = {

  GetpaidOrUnpaid,

 
};

export default dashService;
