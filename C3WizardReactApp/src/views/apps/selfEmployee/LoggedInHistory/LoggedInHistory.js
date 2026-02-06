import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Label, Spinner } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import * as Icon from 'react-feather';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedInHistory } from '../../../../store/apps/selfEmployee/userAuditTrail/UserAuditTrail';
import CustomPagination from '../../component/CustomPagination';
import Loader from '../../../../layouts/loader/Loader';

const UserAuditTrail = () => {
  const dispatch = useDispatch();
 
  const initToday = new Date();
  const initFrom = new Date();
  initFrom.setDate(initToday.getDate() - 6);
  const [fromDate, setFromDate] = useState(initFrom);
  const [toDate, setToDate] = useState(initToday);
  const [appliedFromDate, setAppliedFromDate] = useState(initFrom);
  const [appliedToDate, setAppliedToDate] = useState(initToday);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const CompanyId = localStorage.getItem('companyId');
  const { getLoggedData, loading } = useSelector((state) => state.UserAuditTrailSlices || {});
  const isSelfEmployed = localStorage.getItem('isSelfEmployed');
  const roleId = localStorage.getItem('roleId');
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles.find((role) => role.description === 'LOGGED IN HISTORY');
  const canViewSelfEmployee = employerPermission && employerPermission.viewPermission;

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // (helper removed; initial 7-day window is set in state above)

  useEffect(() => {
    if (canViewSelfEmployee === false) {
      navigate('login');
    }
  }, [canViewSelfEmployee, navigate]);

  useEffect(() => {
    if (CompanyId && isSelfEmployed && roleId) {
      const payload = {
        CompanyId,
        isSelfEmployed,
        roleId,
        pageNumber,
        pageSize,
      };

   
      if (appliedFromDate) payload.fromDate = formatDate(appliedFromDate);
      if (appliedToDate) payload.toDate = formatDate(appliedToDate);

      dispatch(getLoggedInHistory(payload));
    }
  }, [
    CompanyId,
    isSelfEmployed,
    roleId,
    pageNumber,
    pageSize,
    appliedFromDate,
    appliedToDate,
    dispatch,
  ]);

  // Update totalRecords & totalPages when data changes
  useEffect(() => {
    if (getLoggedData) {
      console.log('API Response:', getLoggedData);
      setTotalRecords(getLoggedData.totalRecords || 0);
      setTotalPages(Math.ceil((getLoggedData.totalRecords || 0) / pageSize));
    }
  }, [getLoggedData, pageSize]);

  // Turn off the search loading state after data is received
  useEffect(() => {
    if (loadingSearch && !loading) {
      setLoadingSearch(false);
    }
  }, [loading, loadingSearch]);

  const handleSubmit = async (page = 0) => {
    const pageNumberToSend = typeof page === 'number' ? page : 0;
    setPageNumber(pageNumberToSend);

    if (fromDate && toDate && moment(toDate).isBefore(moment(fromDate), 'day')) {
      toast.error("'To' date cannot be smaller than 'From' date");
      return;
    }

  
    setLoadingSearch(true);
    setAppliedFromDate(fromDate || null);
    setAppliedToDate(toDate || null);
  };

  return (
    <>
      <Helmet>
        <title>Logged In History - C3wizard</title>
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
            <li className="fw-medium"> Logged In History </li>
          </ul>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            {' '}
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                   
        
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                   
                    </div>
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-3 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-12 col-12 mb-2 mb-lg-0">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-user text-success pe-2" /> Logged In History
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="card-body profile my-1">
                            <div className="row">
                              <div className="col-md-3 col-lg-3 col-xl-3">
                                <Label>From Date</Label>

                                <DatePicker
                                  selected={fromDate}
                                  onChange={(date) => setFromDate(date || null)}
                                  dateFormat="dd/MMM/yyyy"
                                  showMonthDropdown
                                  showYearDropdown
                                  yearDropdownItemNumber={15}
                                  scrollableYearDropdown
                                  dropdownMode="select"
                                  className="form-control"
                                  placeholderText="Select Month and Year"
                                  isClearable
                                />
                              </div>

                              <div className="col-md-3 col-lg-3 col-xl-3">
                                <Label>To Date</Label>

                                <DatePicker
                                  selected={toDate}
                                  onChange={(date) => setToDate(date || null)}
                                  dateFormat="dd/MMM/yyyy"
                                  showMonthDropdown
                                  showYearDropdown
                                  yearDropdownItemNumber={15}
                                  scrollableYearDropdown
                                  dropdownMode="select"
                                  className="form-control"
                                  placeholderText="Select Month and Year"
                                  isClearable
                                />
                              </div>

                              <div className="col-md-2 col-lg-2 col-xl-2">
                                <div className="mb-3 mt-2">
                                  <button
                                    onClick={handleSubmit}
                                    disabled={loadingSearch}
                                    className="btn btn-success waves-effect waves-light h-45"
                                    type="submit"
                                    style={{ height: '45px', minWidth: '100px', marginTop: '22px' }}
                                  >
                                    {loadingSearch ? (
                                      <>
                                        <Spinner size="sm" /> Searching...
                                      </>
                                    ) : (
                                      <>
                                        <Icon.Search size={20} style={{ cursor: 'pointer' }} />{' '}
                                        Search
                                      </>
                                    )}
                                  </button>
                                </div>
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
                                            <th>User Name</th>
                                            <th>Email Id</th>
                                            <th>Login Time</th>
                                            <th>Logout Time</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {getLoggedData &&
                                          getLoggedData.records &&
                                          getLoggedData.records.length > 0 ? (
                                            getLoggedData.records.map((item, index) => (
                                              <tr key={index}>
                                                <td>
                                                  <span>
                                                    {item && item.userName != null
                                                      ? item.userName
                                                      : 'N/A'}
                                                  </span>
                                                </td>
                                                <td>
                                                  {item && item.emailId != null
                                                    ? item.emailId
                                                    : 'N/A'}
                                                </td>
                                                <td>
                                                  {item && item.loginTime
                                                    ? moment(item.loginTime).format(
                                                        'DD-MMM-YYYY HH:mm:ss',
                                                      )
                                                    : 'N/A'}
                                                </td>
                                                <td>
                                                  {item && item.logoutTime
                                                    ? moment(item.logoutTime).format(
                                                        'DD-MMM-YYYY HH:mm:ss',
                                                      )
                                                    : 'N/A'}
                                                </td>
                                              </tr>
                                            ))
                                          ) : (
                                            <tr>
                                              <td colSpan="4" className="text-center">
                                                No records found
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                                <CustomPagination
                                  pageNumber={pageNumber}
                                  pageSize={pageSize}
                                  totalRecords={totalRecords}
                                  totalPages={totalPages}
                                  onPageChange={setPageNumber}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>{' '}
                 
                </div>
              
                <sidebar-barrrrr></sidebar-barrrrr>
              </div>
              
            </div>
          </>
        )}

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
