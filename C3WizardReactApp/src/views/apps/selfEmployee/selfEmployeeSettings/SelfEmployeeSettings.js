import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { gerSelfSetting } from '../../../../store/apps/selfEmployee/selfEmployeeSetting/SelfEmployeeSetting';
import { clearMessage, setMessage } from '../../../../store/apps/message/MessageSlice';

const SelfEmployeeSettings = () => {
  const companyId = localStorage.getItem('companyId');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.messageReducer);
  const { SelfSettingList } = useSelector((state) => state.selfEmployeeSetting || {});

  useEffect(() => {
    dispatch(gerSelfSetting());
  }, []);

  useEffect(() => {
    console.log('CSettingList', SelfSettingList);
  }, [SelfSettingList]);

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
    navigate('/apps/addEmployer/AddEmployer');
  };

  return (
    <>
      <Helmet>
        <title>Self Employee Settings - C3Wizard</title>
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
            
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24"></div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-header py-2 bg_ligh">
                        <div className="row align-items-center d-flex">
                          <div className="col-xl-8">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user text-success pe-2" />
                              Self Employee Settings Lists
                            </h4>
                          </div>
                          <div className="col-xl-4 text-end">
                            <Link to="/apps/addSelfEmployeeSettings">
                            <Button
                              className="btn btn-success waves-effect waves-light h-45"
                              type="submit"
                              onClick={handleAddEmployer}
                            >
                              <i className="fas fa-plus pe-1" /> Add Self  Employer C3 Settings
                            </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead>
                              <tr className="border-b">
                                <th scope="row">From Date</th>
                                <th>To Date</th>

                                <th>Edit</th>
                                <th>Delete</th>
                              </tr>
                            </thead>
                            <tbody>
                              {SelfSettingList && SelfSettingList?.length > 0 ? (
                                SelfSettingList?.map((item) => (
                                  <tr key={item}>
                                    <td>{item?.regNumber}</td>
                                    <td>{item.contactPerson}</td>

                                    <td>
                                      <a href="#" className="text-decoration-none">
                                        <span className="badge bg-soft-success text-success">
                                          <Icon.Edit size={20} />
                                        </span>
                                      </a>
                                    </td>
                                    <td>
                                      <span className="badge bg-soft-warning text-warning">
                                        <Icon.Trash size={20} />
                                      </span>
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
        {/* END layout-wrapper */}
        {/* Right Sidebar */}
      </div>
    </>
  );
};
export default SelfEmployeeSettings;
