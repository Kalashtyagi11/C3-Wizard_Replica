import http from '../../baseUrl/HttpCommon';
import authHeader from '../authHeader/AuthHeader';

const getDashboardData = () => {

  return http.get(`/DashBoard/AdminDashBoardMaster`,
    {
      headers: authHeader()
    }
  );
};


const AdminServices = {
    getDashboardData
};

export default AdminServices;