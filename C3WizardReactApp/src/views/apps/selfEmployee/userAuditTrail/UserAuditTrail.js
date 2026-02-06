import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate, Link } from 'react-router-dom';
import { Label } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { getLoadUsers } from '../../../../store/apps/selfEmployee/userAuditTrail/UserAuditTrail';

const UserAuditTrail = () => {
  const [activeTab, setActiveTab] = useState('regular');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const CompanyId = localStorage.getItem('companyId');
  const { CategoryData } = useSelector((state) => state.UserAuditTrailSlices || {});
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles.find((role) => role.description === 'USER AUDIT TRAIL');
  const canViewSelfEmployee = employerPermission?.viewPermission;

  useEffect(() => {
    if (canViewSelfEmployee === false) {
      navigate('/login');
    }
  }, [canViewSelfEmployee, navigate]);

  useEffect(() => {
    if (CompanyId) {
      dispatch(getLoadUsers({ CompanyId }));
    }
  }, []);

  useEffect(() => {
    console.log('anjani', CategoryData);
  });

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
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
          <ul className="d-flex align-items-center gap-2 mt-3 list-unstyled">
            <li className="fw-medium">
              <Link to="/apps/dashboards" className="d-flex align-items-center gap-1 text-muted">
                <i className="ti-home" />
                Dashboard{' '}
              </Link>
            </li>
            <li>-</li>

            <li className="fw-medium"> User Audit Trail </li>
          </ul>
        </div>
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="page-content-wrapper">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24"></div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-header py-3 bg_ligh">
                        <div className="row align-items-center d-flex">
                          <div className="col-xl-12 col-12 mb-2 mb-lg-0">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user text-success pe-2" /> User Audit Trail
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="card-body profile">
                        <div className="row">
                          <div className="tab-pane fade show active">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="table-responsive">
                                  <table className="table table-hover mb-0">
                                    <thead>
                                      <tr className="border-b">
                                        <th>Period</th>
                                        <th className="td-text-align">Total Wages($)</th>
                                        <th className="td-text-align">Contribution ($)</th>
                                        <th className="td-pl-2">Inserted On</th>
                                        <th>Inserted By</th>

                                        <th>Last Modified On</th>
                                        <th>Last Modified By</th>
                                        <th>Last Submitted On</th>
                                        <th>Last Submitted By</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {CategoryData?.length > 0 ? (
                                        CategoryData?.map((item, index) => (
                                          <tr key={index}>
                                            <td>
                                              <span>{item.period ?? 'N/A'}</span>
                                            </td>
                                            <td className="td-text-align">
                                              ${item.totalWages?.toFixed(2) ?? '0.00'}
                                            </td>
                                            <td className="td-text-align">
                                              ${item.contribution?.toFixed(2) ?? '0.00'}
                                            </td>

                                          

                                            <td className="td-pl-2">
                                              {moment(item.insertedOn, 'DD-MM-YYYY').format(
                                                'DD-MMM-YYYY',
                                              )}
                                            </td>
                                            <td>{item.insertedBy ?? 'N/A'}</td>

                                           

                                            <td>
                                              {moment(item.lastModifiedOn, 'DD-MM-YYYY').format(
                                                'DD-MMM-YYYY',
                                              )}
                                            </td>

                                            <td>{item?.lastModifiedBy ?? 'N/A'}</td>

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

                                            <td>{item?.lastSubmittedBy ?? 'N/A'}</td>
                                          </tr>
                                        ))
                                      ) : (
                                        <tr>
                                          <td colSpan="9" className="text-center">
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
      </div>
    </>
  );
};
export default UserAuditTrail;
