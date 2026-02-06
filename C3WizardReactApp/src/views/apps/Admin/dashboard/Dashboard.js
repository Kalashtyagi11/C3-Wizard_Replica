import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
//import { Label } from 'reactstrap';
import { Helmet } from 'react-helmet';
import * as Icon from 'react-feather';
import { clearMessage, setMessage } from '../../../../store/apps/message/MessageSlice';
import { getContribution } from '../../../../store/apps/dashboard/DashboardSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const companyId = localStorage.getItem('companyId');
  const { message, type } = useSelector((state) => state.messageReducer);
  const { ContributionCount } = useSelector((state) => state.dashboardSlice);

  useEffect(() => {
    if (companyId) {
      dispatch(getContribution(companyId));
    }
  }, []);

  useEffect(() => {
    console.log('ContributionCount', ContributionCount);
    console.log('table', ContributionCount?.dashboard_list);
  }, [ContributionCount]);

  useEffect(() => {
    if (message) {
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      }
      // Reset the message after showing the toast to ensure it triggers again
      dispatch(setMessage({ message: '', type: '' }));
    }
  }, [message, type, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Dashboard - C3Wizard </title>
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
                <div className="row gy-4 font-b mb-4">
                  <div className="col-xxl-6 col-xl-6 col-sm-6">
                    <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-1 left-line line-bg-primary position-relative overflow-hidden">
                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                        <div>
                          <span className="mb-2 fw-medium text-secondary-light text-md">
                            Total Payment Received (Online)
                          </span>
                          <h6 className="fw-semibold mb-1">$542411111</h6>
                        </div>
                        <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-2xl mb-12 bg-primary-100">
                          <i className="fas fa-user f-20" />
                        </span>
                      </div>
                      <p className="text-sm mb-0">
                        <span className="bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm">
                          <i className="mdi mdi-arrow-top-right" /> 80%
                        </span>{' '}
                        From last month{' '}
                      </p>
                    </div>
                  </div>
                  <div className="col-xxl-6 col-xl-6 col-sm-6">
                    <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-1 left-line line-bg-primary position-relative overflow-hidden">
                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                        <div>
                          <span className="mb-2 fw-medium text-secondary-light text-md">
                            Total Payment Received (Offline)
                          </span>
                          <h6 className="fw-semibold mb-1">$3,50011111</h6>
                        </div>
                        <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-2xl mb-12 bg-primary-100">
                          <i className="fas fa-dollar-sign f-20" />
                        </span>
                      </div>
                      <p className="text-sm mb-0">
                        <span className="bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm">
                          <i className="mdi mdi-arrow-top-right" /> 15%
                        </span>{' '}
                        From last month{' '}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-8">
                    <div className="card">
                      <div className="card-header py-3 bg_ligh">
                        {' '}
                        <h4 className="header-title mb-0 text-success">
                          <i className="far fa-money-bill-alt f-18" /> Payment Details
                        </h4>
                      </div>
                      <div className="card-body">
                        <div className="clearfix" />
                        <div className="row align-items-center">
                          <div className="col-xl-12">
                            <div>
                              <div id="spline_area" className="apex-charts" dir="ltr" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4">
                    <div className="card">
                      <div className="card-header py-3 bg_ligh">
                        <h4 className="header-title mb-0 text-success">
                          {' '}
                          <i className="far fa-money-bill-alt f-18" /> Payment Status
                        </h4>
                      </div>
                      <div className="card-body">
                        <ul className="list-unstyled activity-wid mb-4 mt-2">
                          <li className="activity-list activity-border">
                            <div className="activity-icon avatar-sm">
                              <img src="assets/images/slh.png" className="avatar-sm" alt="" />
                            </div>
                            <div className="media">
                              <div className="me-3">
                                <p className="text-muted font-size-14 mb-0">
                                  {' '}
                                  S L Horsford &amp; Company Limited
                                </p>
                              </div>
                              <div className="media-body">
                                <div className="text-end d-none d-md-block">
                                  <span className="text-warning fw-medium text-md">Offline</span>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="activity-list activity-border">
                            <div className="activity-icon avatar-sm">
                              <img src="assets/images/koscab.jpg" className="avatar-sm" alt="" />
                            </div>
                            <div className="media">
                              <div className="me-3">
                                {/* <h5 class="font-size-15 mb-1">Cameron Williamson</h5> */}
                                <p className="text-muted font-size-14 mb-0 mt-2">
                                  {' '}
                                  Koscab (St. Kitts) Ltd.
                                </p>
                              </div>
                              <div className="media-body">
                                <div className="text-end d-none d-md-block">
                                  <span className="text-success fw-medium text-md">Online</span>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="activity-list activity-border">
                            <div className="activity-icon avatar-sm">
                              <img src="assets/images/carib.png" className="avatar-sm" alt="" />
                            </div>
                            <div className="media">
                              <div className="me-3">
                                <p className="text-muted font-size-14 mb-0">
                                  Carib Brewery (St Kitts &amp; Nevis) Limited
                                </p>
                              </div>
                              <div className="media-body">
                                <div className="text-end d-none d-md-block">
                                  <span className="text-danger fw-medium text-md">Pending</span>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="activity-list activity-border">
                            <div className="activity-icon avatar-sm">
                              <img
                                src="assets/images/park-head.jpg"
                                className="avatar-sm rounded-circle"
                                alt=""
                              />
                            </div>
                            <div className="media">
                              <div className="me-3">
                                <p className="text-muted font-size-14 mb-0 mt-2">
                                  {' '}
                                  Park Hyatt St. Kitts
                                </p>
                              </div>
                              <div className="media-body">
                                <div className="text-end d-none d-md-block">
                                  <span className="text-warning fw-medium text-md">Offline</span>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="activity-list activity-border">
                            <div className="activity-icon avatar-sm">
                              <img src="assets/images/marriott.png" className="avatar-sm" alt="" />
                            </div>
                            <div className="media">
                              <div className="me-3">
                                <p className="text-muted font-size-14 mb-0 mt-2">
                                  {' '}
                                  St. Kitts Marriott Resort
                                </p>
                              </div>
                              <div className="media-body">
                                <div className="text-end d-none d-md-block">
                                  <span className="text-success fw-medium text-md">Online</span>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* END layout-wrapper */}
        {/* Right Sidebar */}
      </div>
    </>
  );
};
export default AdminDashboard;
