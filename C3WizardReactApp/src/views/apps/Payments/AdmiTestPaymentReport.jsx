import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import DashboardService from '../../../service/dashboard/Dashboard';

const AdmiTestPaymentReport = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.messageReducer);
  const [GridData, setGridData] = useState([]);

  const LoadDataGrid = async (e) => {
    //setShowConfirm(false);
    //setLoading(true);
    //formData.saveCard = e;
    try {
      const res = await DashboardService.TestTransaction();

      setGridData(res.data.data);
      //console.log("asasas",paymentData);
      //window.location.href = res.data.data.approvalUrl;
    } catch (err) {
      console.log(err);
      //setError("Error fetching payment response");
      //setLoading(false);
    }
  };
  useEffect(() => {
    LoadDataGrid();
  }, []);

  useEffect(() => {
    if (message) {
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      }

      dispatch(setMessage({ message: '', type: '' }));
    }
  }, [message, type, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const handleAddEmployer = () => {
    navigate('/apps/addEmployer/AddEmployer', { state: { isEdit: false } });
    //navigate('/apps/addEmployer/AddEmployer');
  };

  const handleUpdateEmployer = (companyId) => {
    navigate(`/apps/updateEmployer/UpdateEmployer?companyId=${companyId}`);
    //navigate('/apps/updateEmployer/UpdateEmployer');
  };

  return (
    <>
      <Helmet>
        <title>Test Payment History - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
        {/* ========== Left Sidebar Start ========== */}
        {/* Left Sidebar End */}
        <sidebar-barrrrrr></sidebar-barrrrrr>
        {/* ============================================================== */}
        {/* Start right Content here */}
        {/* ============================================================== */}
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="page-content-wrapper">
                {/*                       <div class="page-title mb-3">
                      <h5>Employer List</h5> 
                  </div>
           */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24"></div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-header py-2 bg_ligh">
                        <div className="row align-items-center d-flex">
                          <div className="col-xl-8">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user text-success pe-2" />
                              Payments Settings
                            </h4>
                          </div>
                          <div className="col-xl-4 text-end">
                            {/* <Button
                              className="btn btn-success waves-effect waves-light h-45"
                              type="submit"
                              onClick={handleAddEmployer}
                            >
                              <i className="fas fa-plus pe-1" /> Add Employer
                            </Button> */}
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead>
                              <tr className="border-b">
                                <th scope="row">TransactionId</th>
                                <th>Enviroment</th>
                                <th>Transaction Status</th>
                                <th>Transaction Date</th>
                                <th>Transaction Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {GridData && GridData?.length > 0 ? (
                                GridData?.map((item) => (
                                  <tr key={item}>
                                    <td>{item?.paymentGatewayTransactionID}</td>
                                    <td>{item?.transactionFor}</td>
                                    <td>{item?.paymentStatus}</td>
                                    <td>{item?.createTime}</td>
                                    <td>${(item?.paymentAmount ?? 0).toFixed(2)}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="7" className="text-center">
                                    No Records Found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{' '}
              {/* container-fluid */}
            </div>
            {/* End Page-content */}
            <sidebar-barrrrr></sidebar-barrrrr>
          </div>
          {/* end main content*/}
        </div>
        {/* END layout-wrapper */}
        {/* Right Sidebar */}
      </div>
    </>
  );
};
export default AdmiTestPaymentReport;
