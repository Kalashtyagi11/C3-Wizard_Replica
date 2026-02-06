import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import * as Icon from 'react-feather';
import 'react-datepicker/dist/react-datepicker.css';
import { Label, Pagination, PaginationItem, PaginationLink, Spinner } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../layouts/loader/Loader';
import { getLoggedHistoryHandler } from '../../../store/apps/administration/LoggedHistorySlice';
import CustomPagination from '../component/CustomPagination';

const LoggedInHistory = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const CompanyId = localStorage.getItem('companyId');
  const roleId = localStorage.getItem('roleId');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logsList, loading } = useSelector((state) => state.LoggedHistoryReducer || {});
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const isSelfEmployed = localStorage.getItem('isSelfEmployed');
  // dates actually applied to API requests (only change on Search)
  const [appliedFromDate, setAppliedFromDate] = useState(null);
  const [appliedToDate, setAppliedToDate] = useState(null);

  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'LOGGED IN HISTORY');

  const canViewUserLoggedHistory = employerPermission?.viewPermission;

  useEffect(() => {
    if (canViewUserLoggedHistory === false) {
      navigate('/login');
    }
  }, [canViewUserLoggedHistory, navigate]);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 🔁 Get last 7 days
  const getLast7Days = () => {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 6); // Includes today
    return { from, to: today };
  };

  useEffect(() => {
    const { from, to } = getLast7Days();
    setFromDate(from);
    setToDate(to);
    setAppliedFromDate(from);
    setAppliedToDate(to);
  }, []);

  useEffect(() => {
    if (CompanyId && isSelfEmployed && roleId) {
      const params = {
        CompanyId,
        isSelfEmployed,
        roleId,
        pageNumber,
        pageSize,
      };
      if (appliedFromDate) params.fromDate = formatDate(appliedFromDate);
      if (appliedToDate) params.toDate = formatDate(appliedToDate);
      dispatch(getLoggedHistoryHandler(params));
    }
  }, [
    CompanyId,
    isSelfEmployed,
    roleId,
    appliedFromDate,
    appliedToDate,
    pageNumber,
    pageSize,
    dispatch,
  ]);

  useEffect(() => {
    if (logsList) {
      console.log('API Response:', logsList);
      setTotalRecords(logsList.totalRecords || 0);
      setTotalPages(logsList.totalPages);
      setLoadingSearch(false);
    }
  }, [logsList, pageSize, pageNumber]);

  const handleSubmit = async (page = 0) => {
    const pageNumberToSend = typeof page === 'number' ? page : 0;
    setPageNumber(pageNumberToSend);

    if (fromDate && toDate && moment(toDate).isBefore(moment(fromDate), 'day')) {
      toast.error("'To' date cannot be smaller than 'From' date");
      return;
    }

    // apply dates only when user clicks Search; pagination will reuse these
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
          <ul className="d-flex align-items-center mt-3 gap-2 list-unstyled">
            <li className="fw-medium">
              <Link to="/dashboard" className="d-flex align-items-center gap-1 text-muted">
                {' '}
                <i className="ti-home" /> Dashboard{' '}
              </Link>
            </li>
            <li>-</li>
            <li className="fw-medium">
              <span className="d-flex align-items-center gap-1 text-muted">Logged In History</span>
            </li>
          </ul>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
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
                                  onChange={(date) => setFromDate(date || '')}
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
                                  onChange={(date) => setToDate(date || '')}
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
                            <div className="table-responsive">
                              <table className="table table-hover mb-0">
                                <thead>
                                  <tr className="border-b">
                                    <th scope="row">User Name</th>
                                    <th>Email Id</th>
                                    <th>LoginTime</th>
                                    <th>Logout Time</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {logsList?.records?.length > 0 ? (
                                    logsList?.records?.map((item, index) => (
                                      <tr key={item.loginTime}>
                                        <td>{item.userName}</td>
                                        <td>{item.emailId}</td>
                                        {/* <td>{formatDate(item.loginTime)}</td> */}
                                        <td>
                                          {item?.loginTime
                                            ? moment(item.loginTime).format('DD-MMM-YYYY HH:mm:ss')
                                            : 'N/A'}
                                        </td>
                                        <td>
                                          {item?.logoutTime
                                            ? moment(item.loginTime).format('DD-MMM-YYYY HH:mm:ss')
                                            : 'N/A'}
                                        </td>
                                      </tr>
                                    ))
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
      </div>
    </>
  );
};
export default LoggedInHistory;
