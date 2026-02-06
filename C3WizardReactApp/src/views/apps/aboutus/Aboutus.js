import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Aboutus = () => {
  const navigate = useNavigate();
  const roleId = parseInt(localStorage.getItem('roleId'), 10) || 8;
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles.find((role) => role.description === 'ABOUT US');
  const canAddAboutUs = employerPermission?.addPermission;
  const canViewAboutUs = employerPermission?.viewPermission;

  const employerPermissionSelf = savedRoles.find((role) => role.description === 'About Us');
  const canAddSelfAboutUs = employerPermissionSelf?.addPermission;
  const canViewSelfAboutUs = employerPermissionSelf?.viewPermission;

  useEffect(() => {
    
    if ([3, 4].includes(roleId)) {
      if (canViewAboutUs === false) {
        navigate('/login');
      }
    } else if ([5, 6].includes(roleId)) {
      if (canViewSelfAboutUs === false) {
        navigate('/login');
      }
    }
  }, [roleId, canViewAboutUs, canViewSelfAboutUs, navigate]);

  return (
    <>
      <Helmet>
        <title>About Us - C3wizard</title>
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
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24"></div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-header py-3 bg_ligh">
                        <div className="row align-items-center d-flex">
                          <div className="col-xl-12 col-12 mb-2 mb-lg-0">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user text-success pe-2" /> About
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="card-body profile">
                        <h4 className="pt-3">
                          The Social Security Board C3 Wizard v4.0 is a full-fledged application
                          designed to overcomethe short-comings or weaknesses of its predecessor. It
                          is a more robust application and addressing all the weaknesses of the
                          previous version.
                        </h4>
                        <h5>
                          Here are the salient improvements that were made in this new version:
                        </h5>
                        <ul className="mt-3">
                          <li>
                            <p>A version for Mac Users </p>
                            <p />
                          </li>
                          <li>
                            <div>
                              Upon successful registration, Employer data would be retrieved from
                              SSB database. Data will include all employees from the last c3 that
                              was entered and verified as well as C3s for the current year that have
                              already been entered and verified{' '}
                            </div>
                            <p />
                            <p />
                          </li>
                          <li>
                            <div>
                              For customers with internet connection, data submitted from the C3
                              Wizard will update SSB database, thus no need to enter C3s manually{' '}
                            </div>
                            <p />
                            <p />
                          </li>
                          <li>
                            <div>
                              Employers can now input the employees holiday pay and the period for
                              the payment, the application will divide the holiday pay amount based
                              on the period inserted by the Employer{' '}
                            </div>
                            <p />
                            <p />
                          </li>
                          <li>
                            <div>
                              The C3 Wizard can now easily accommodate exemptions from Social
                              Security, Levy and Severance deductions{' '}
                            </div>
                            <p />
                            <p />
                          </li>
                          <li>
                            <div>
                              The completion of Non- working Directors remittances is also
                              implemented in this version with similar APIs as the C3{' '}
                            </div>
                            <p />
                            <p />
                          </li>
                          <li>
                            <div>
                              Self-Employed Persons can register to use the application with the
                              ability to retrieve and submit through Application Interfaces (APIs).
                              That is, the ability to retrieve past remittances and submission of
                              new remittances{' '}
                            </div>
                            <p />
                            <p />
                          </li>
                          <li>
                            <div>
                              In the event the customer does not have internet access, he/she can
                              still use the application. This standalone version does not give the
                              user access to the SSB database to retrieve data, but he/she can still
                              complete their remittances{' '}
                            </div>
                            <p />
                          </li>
                        </ul>
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
                      <label htmlFor="Employee">
                        Employee <span className="text-danger">*</span>{' '}
                      </label>
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        id="Employee"
                      >
                        <option selected="">Select Employee</option>
                        <option value={1}>100001(Bhanu)</option>
                        <option value={2}>100001(Rajesh)</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-6">
                    <div className="mb-3">
                      <label htmlFor="username">
                        Payment Date <span className="text-danger">*</span>{' '}
                      </label>
                      <input type="date" className="form-control" id="username" placeholder="" />
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-6">
                    <div className="mb-3">
                      <label htmlFor="Amount">
                        Amount <span className="text-danger">*</span>{' '}
                      </label>
                      <input type="number" className="form-control" id="Amount" placeholder="" />
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
export default Aboutus;
