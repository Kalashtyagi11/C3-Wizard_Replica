import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import Loader from '../../../layouts/loader/Loader';
import { getEmployerList } from '../../../store/apps/employer/EmployerSlice';
import { getProfile } from '../../../store/apps/auth/AuthSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';

const Employerdetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.messageReducer);
  const { profileData } = useSelector((state) => state.authSlice);
  const CategoryType = localStorage.getItem('roleCategory');
  const RoleId = localStorage.getItem('roleId');
  const { EmployeeList, loading } = useSelector((state) => state.employerSlice || {});
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles.find((role) => role.description === 'EMPLOYER DETAILS');
  const canAddDashboard = employerPermission?.addPermission;
  const canEditEmployer = employerPermission?.updatePermission;
  const canDeleteDashboard = employerPermission?.deletePermission;
  const canViewDashboard = employerPermission?.viewPermission;

  useEffect(() => {
    if (canViewDashboard === false) {
      navigate('/login');
    }
  }, [canViewDashboard, navigate]);

  useEffect(() => {
    const companyId = parseInt(localStorage.getItem('companyId'), 10);
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    dispatch(getEmployerList({ companyId, roleId }));
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
        <title>Employer Details - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
        {/* ========== Left Sidebar Start ========== */}
        {/* Left Sidebar End */}
        <sidebar-barrrrrr></sidebar-barrrrrr>
        {/* ============================================================== */}
        {/* Start right Content here */}
        {/* ============================================================== */}
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
              <ul className="d-flex align-items-center mt-3 gap-2 list-unstyled">
                <li className="fw-medium">
                  <Link to="/dashboard" className="d-flex align-items-center gap-1 text-muted">
                    <i className="ti-home" />
                    Dashboard{' '}
                  </Link>
                </li>
                <li>-</li>

                <li className="fw-medium">Employer Details </li>
              </ul>
            </div>
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
                          <div className="card-header py-3 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-8">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-user text-success pe-2" />
                                  Employer List
                                </h4>
                              </div>
                              <div className="col-xl-4 text-end  ">
                                {canAddDashboard ? (
                                  <Button
                                    className="btn btn-success waves-effect waves-light h-45"
                                    type="submit"
                                    onClick={handleAddEmployer}
                                  >
                                    <i className="fas fa-plus pe-1" /> Add Employer
                                  </Button>
                                ) : (
                                  <Button
                                    className="btn btn-secondary waves-effect waves-light h-45"
                                    type="button"
                                    disabled
                                    style={{
                                      cursor: 'not-allowed',
                                      opacity: 0.6,
                                    }}
                                  >
                                    <i className="fas fa-plus pe-1" /> Add Employer
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table table-hover mb-0">
                                <thead>
                                  <tr className="border-b">
                                    <th scope="row">Registration No.</th>
                                    <th>Contact Person</th>
                                    <th>Employer Name</th>
                                    <th>Mobile No</th>
                                    <th>Email Id</th>
                                    <th>Edit</th>
                                    {/* <th>Need to Verify</th> */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {EmployeeList && EmployeeList?.length > 0 ? (
                                    EmployeeList?.map((item) => (
                                      <tr
                                        key={item}
                                        className={
                                          item.parent_Id === 0 ? 'parent-row' : 'child-row'
                                        }
                                      >
                                        <td>{item?.regNumber}</td>
                                        <td>{item.contactPerson}</td>
                                        <td>{item?.companyName} </td>
                                        <td>{item.mobile}</td>
                                        <td>{item.email}</td>
                                        <td>
                                          {canEditEmployer ? (
                                            <Link
                                              to="/apps/updateEmployer/UpdateEmployer"
                                              state={{ companyId: item.companyId }}
                                              className="text-decoration-none"
                                            >
                                              <span className="badge bg-soft-success text-success">
                                                <Icon.Edit size={20} />
                                              </span>
                                            </Link>
                                          ) : (
                                            <span
                                              className="badge bg-soft-secondary text-muted"
                                              title="No permission to edit"
                                              style={{ cursor: 'not-allowed', opacity: 0.6 }}
                                            >
                                              <Icon.Edit size={20} />
                                            </span>
                                          )}
                                        </td>
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
          </>
        )}

        {/* END layout-wrapper */}
        {/* Right Sidebar */}
      </div>
    </>
  );
};
export default Employerdetails;
