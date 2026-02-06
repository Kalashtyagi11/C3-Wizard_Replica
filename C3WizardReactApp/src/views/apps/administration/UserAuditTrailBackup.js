import React, { useEffect, useState } from 'react';
import { Label } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAuditTrail } from '../../../store/apps/administration/AuditTrailSlice';

const UserAuditTrail = () => {
  const [activeTab, setActiveTab] = useState('regular');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auditTrails } = useSelector((state) => state.AuditTrailReducer || {});

  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'USER AUDIT TRAIL');

  const canViewUserAuditTrail = employerPermission?.viewPermission;

  useEffect(() => {
    if (canViewUserAuditTrail === false) {
      navigate('/login');
    }
  }, [canViewUserAuditTrail, navigate]);

  useEffect(() => {
    dispatch(getUserAuditTrail());
  }, []);

  return (
    <>
      <Helmet>
        <title>User Audit Trail - C3wizard</title>
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
                {/*    <div class="page-title mb-3">
                      <h5>Employer Details</h5> 
                  </div>
           */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                  <h5 className="fw-semibold mb-0"> User Audit Trail </h5>
                  <ul className="d-flex align-items-center gap-2 list-unstyled">
                    <li className="fw-medium">
                      <span className="d-flex align-items-center gap-1 text-muted">
                        {' '}
                        <i className="ti-home" /> Dashboard{' '}
                      </span>
                    </li>
                    <li>-</li>
                    <li className="fw-medium">User Audit Trail </li>
                  </ul>
                </div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-header py-3 bg_ligh">
                        <div className="row align-items-center d-flex">
                          <div className="col-xl-12 col-12 mb-2 mb-lg-0">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user text-success pe-2" /> Audit Trail
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="card-body profile">
                        <div className="row">
                          <div className="col-md-12 col-12 pad-0 w-55 pr-0">
                            {/* Tabs Navigation */}
                            <ul className="nav nav-pills mb-3 border-bottom border-2">
                              <li className="nav-item">
                                <button
                                  type="button"
                                  className={`nav-link text-dark fw-semibold position-relative ${
                                    activeTab === 'regular' ? 'active' : ''
                                  }`}
                                  onClick={() => setActiveTab('regular')}
                                >
                                  Regular Employees Submitted C3
                                </button>
                              </li>
                              <li className="nav-item">
                                <button
                                  type="button"
                                  className={`nav-link text-dark fw-semibold position-relative ${
                                    activeTab === 'nonworking' ? 'active' : ''
                                  }`}
                                  onClick={() => setActiveTab('nonworking')}
                                >
                                  Non-Working Director Submitted C3
                                </button>
                              </li>
                            </ul>

                            {/* Tab Content */}
                            <div className="tab-content rounded-3 p-3">
                              {/* Regular Employees Tab */}
                              {activeTab === 'regular' && (
                                <div className="tab-pane fade show active">
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="table-container">
                                        <table className="table table-hover mb-0 ">
                                          <thead>
                                            <tr className="border-b">
                                              <th>Period</th>
                                              <th>Total Wages($)</th>
                                              <th>Social Security ($)</th>
                                              <th>Levy($)</th>
                                              <th>Severance ($)</th>
                                              <th>Schedule</th>
                                              <th>Inserted On</th>
                                              <th>Inserted By</th>
                                              <th>Last Modified On</th>
                                              <th>Last Modified By</th>
                                              <th>Last Submitted On</th>
                                              <th>Last Submitted By</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {auditTrails?.regularEmployeesSubmittedc3?.length >
                                            0 ? (
                                              auditTrails?.regularEmployeesSubmittedc3?.map(
                                                (item, index) => (
                                                  <tr key={index}>
                                                    <td>
                                                      <span>
                                                        <i className="fa fa-times-circle text-danger" />{' '}
                                                        {item.period}
                                                      </span>
                                                    </td>
                                                    <td>
                                                      <b>$</b>
                                                      {item.totalWages?.toFixed(2) ?? '0.00'}
                                                    </td>
                                                    <td>
                                                      <b>$</b>
                                                      {item.socialSecurity?.toFixed(2) ?? '0.00'}
                                                    </td>
                                                    <td>
                                                      <b>$</b>
                                                      {item.levy?.toFixed(2) ?? '0.00'}
                                                    </td>
                                                    <td>
                                                      <b>$</b>
                                                      {item.serverance}
                                                    </td>

                                                    <td>{item.schedule}</td>
                                                    {/* <td>{item.insertedOn}</td> */}
                                                    <td>
                                                      {moment(item.insertedOn, 'DD-MM-YYYY').format(
                                                        'DD-MMM-YYYY',
                                                      )}
                                                    </td>
                                                    <td>{item.insertedBy}</td>
                                                    {/* <td>{item.lastModifiedOn}</td> */}
                                                    <td>
                                                      {moment(
                                                        item.lastModifiedOn,
                                                        'DD-MM-YYYY',
                                                      ).format('DD-MMM-YYYY')}
                                                    </td>
                                                    <td>{item.lastModifiedBy || 'N/A'}</td>
                                                    <td>{item.lastSubmittedOn || 'N/A'}</td>
                                                    <td>{item.lastSubmittedBy || 'N/A'}</td>
                                                  </tr>
                                                ),
                                              )
                                            ) : (
                                              <tr>
                                                <td colSpan="12" className="text-center">
                                                  No records found
                                                </td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Non-Working Director Tab */}
                              {activeTab === 'nonworking' && (
                                <div className="tab-pane fade show active">
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="table-container">
                                        <table className="table table-hover mb-0">
                                          <thead>
                                            <tr className="border-b">
                                              <th>Period</th>
                                              <th>Total Wages($)</th>
                                              <th>Levy($)</th>
                                              <th>Date of Submission</th>
                                              <th>Schedule</th>
                                              <th>Inserted On</th>
                                              <th>Inserted By</th>
                                              <th>Last Modified On</th>
                                              <th>Last Modified By</th>
                                              <th>Last Submitted On</th>
                                              <th>Last Submitted By</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {auditTrails?.nonWorkingDirectorSubmittedc3.length >
                                            0 ? (
                                              auditTrails?.nonWorkingDirectorSubmittedc3?.map(
                                                (item, index) => (
                                                  <tr key={index}>
                                                    <td>
                                                      <span>
                                                        <i className="fa fa-times-circle text-danger" />{' '}
                                                        {item.period}
                                                      </span>
                                                    </td>
                                                    <td>
                                                      <b>$</b>
                                                      {item.totalWages?.toFixed(2) ?? '0.00'}
                                                    </td>
                                                    <td>
                                                      <b>$</b>
                                                      {item.levy?.toFixed(2) ?? '0.00'}
                                                    </td>
                                                    <td>{item.dateOfSubmission}</td>
                                                    <td>{item.schedule}</td>
                                                    {/* <td>{item.insertedOn}</td> */}
                                                    <td>
                                                      {' '}
                                                      {moment(item.insertedOn, 'DD-MM-YYYY').format(
                                                        'DD-MMM-YYYY',
                                                      )}
                                                    </td>
                                                    <td>{item.insertedBy}</td>
                                                    {/* <td>{item.lastModifiedOn || 'N/A'}</td> */}
                                                    <td>
                                                      {' '}
                                                      {moment(
                                                        item.lastModifiedOn,
                                                        'DD-MM-YYYY',
                                                      ).format('DD-MMM-YYYY')}
                                                    </td>
                                                    <td>{item.lastModifiedBy || 'N/A'}</td>

                                                    <td>
                                                      {item.lastSubmittedOn
                                                        ? moment(
                                                            item.lastSubmittedOn,
                                                            'DD-MM-YYYY',
                                                          ).isValid()
                                                          ? moment(
                                                              item.lastSubmittedOn,
                                                              'DD-MM-YYYY',
                                                            ).format('DD-MMM-YYYY')
                                                          : 'N/A'
                                                        : 'N/A'}
                                                    </td>
                                                    <td>{item.lastSubmittedBy || 'N/A'}</td>
                                                  </tr>
                                                ),
                                              )
                                            ) : (
                                              <tr>
                                                <td colSpan="12" className="text-center">
                                                  No records found
                                                </td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
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
        <div className="modal" id="myModal">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h4 className="modal-title">Employee Bonus Details</h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal" />
              </div>
              {/* Modal body */}
              <div className="modal-body">
                <div className="row">
                  {/*          <div class="col-md-6 col-lg-6 col-xl-6">
              <label class="d-block">&nbsp; </label>
         
          </div>   */}
                  <div className="col-md-6 col-lg-6 col-xl-6">
                    <div className="mb-3">
                      <Label>
                        Employee <span className="text-danger">*</span>{' '}
                      </Label>
                      <select className="form-select" aria-label="Default select example">
                        <option selected="">Select Employee</option>
                        <option value={1}>100001(Bhanu)</option>
                        <option value={2}>100001(Rajesh)</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-6">
                    <div className="mb-3">
                      <Label>
                        Payment Date <span className="text-danger">*</span>
                      </Label>
                      <input type="date" className="form-control" id="username" placeholder="" />
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-6">
                    <div className="mb-3">
                      <Label>
                        Amount <span className="text-danger">*</span>
                      </Label>
                      <input type="number" className="form-control" id="username" placeholder="" />
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-6 mt-4 pt-2">
                    <button type="button" className="btn btn-success px-4 me-3">
                      Save
                    </button>
                    <button type="button" className="btn btn-light border px-4">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              {/* Modal footer */}
              <div className="border-top">
                <div className="px-4 py-3">
                  <div className="row">
                    <div className="col-md-12 col-lg-12 col-xl-12">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0 white-space">
                          <thead>
                            <tr className="border-b">
                              <th scope="row">S.No.</th>
                              <th>Amount</th>
                              <th>Pay Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>$682</td>
                              <td>12/12/2024</td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>$582</td>
                              <td>24/12/2024</td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>$452</td>
                              <td>29/12/2024</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default UserAuditTrail;
