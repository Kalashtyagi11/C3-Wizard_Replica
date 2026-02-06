import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Label, Pagination, PaginationItem, PaginationLink, Spinner } from 'reactstrap';
import { Helmet } from 'react-helmet';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getException } from '../../../store/apps/exceptionLogs/ExceptionLogsSlice';
import CustomPagination from '../component/CustomPagination';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import Loader from '../../../layouts/loader/Loader';

const ExceptionLogs = () => {
  const [loadingSearch, setLoadingSearch] = useState(false);
  const dispatch = useDispatch();
  const CompanyId = localStorage.getItem('companyId');
  const { ExceptionData, loading } = useSelector((state) => state.ExceptionLogs || {});
  const { message, type: messageType } = useSelector((state) => state?.messageReducer);
  const RoleID = parseInt(localStorage.getItem('roleId'), 10);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));

  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'EXCEPTION LOGS');
  const canViewException = employerPermission?.viewPermission;

  useEffect(() => {
    if (canViewException === false) {
      navigate('/not-authorized'); // Better to redirect to not-authorized page
    }
  }, [canViewException, navigate]);

  const formatDate = (date) => {
    // if (!date) return null;
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
  }, []);

  const fetchAuditTrail = () => {
    debugger;
    const payload = {
      pageNumber,
      pageSize,
      fromDate: formatDate(fromDate), // e.g., "05/05/2025"
      toDate: formatDate(toDate),
    };

    setLoadingSearch(true);
    dispatch(getException(payload))
      .unwrap()
      .then((res) => {
        setTotalRecords(res.ExceptionData.totalRecords);
        setTotalPages(res.ExceptionData.totalPages);
      })
      .catch((error) => {
        console.error('Failed to fetch audit trail:', error);
        setTotalRecords(0);
        setTotalPages(0);
          setPageNumber(0);
      })
      .finally(() => setLoadingSearch(false));
  };

  const handleSubmit = async () => {
    if (toDate && moment(toDate).isBefore(moment(fromDate), 'day')) {
      toast.error("'To' date cannot be smaller than 'From' date");
      return;
    }

    const payload = {
      fromDate: formatDate(fromDate), // e.g., "05/05/2025"
      toDate: formatDate(toDate),
      pageNumber,
      pageSize,
    };

    try {
      setLoadingSearch(true);

      const response = await dispatch(getException(payload)).unwrap();

      const exceptionList = response?.ExceptionData;

      if (!exceptionList || exceptionList.length === 0) {
        setTotalRecords(0);
        setTotalPages(0);
        setPageNumber(0);
      } else {
        setTotalRecords(response.ExceptionData.totalRecords || 0);
        setTotalPages(response.ExceptionData.totalPages || 0);
        setPageSize(response.ExceptionData.pageSize || 10);

        if (response.exceptionList.pageNumber === 1) {
          setPageNumber(0);
        }
      }
    } catch (error) {
      setTotalRecords(0);
      setTotalPages(0);
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    fetchAuditTrail();
  }, [pageNumber, pageSize, fromDate, toDate]);

  useEffect(() => {
    if (message) {
      if (messageType === 'success') {
        toast.success(message);
      } else if (messageType === 'error') {
        toast.error(message);
      }

      dispatch(setMessage({ message: '', messageType: '' }));
    }
  }, [message, messageType, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Exception - C3wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
        <sidebar-barrrrrr></sidebar-barrrrrr>

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
          <ul className="d-flex align-items-center gap-2 mt-3 list-unstyled">
            <li className="fw-medium">
              <Link to="/apps/dashboards" className="d-flex align-items-center gap-1 text-muted">
                <i className="ti-home" />
                Dashboard
              </Link>
            </li>
            <li>-</li>
            <li className="fw-medium"> Exception Logs </li>
          </ul>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="main-content">
            <div className="page-content">
              <div className="container-fluid">
                <div className="page-content-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header py-3 bg_ligh">
                          <h4 className="header-title mb-0 text-success">
                            <i className="far fa-user text-success pe-2" /> Exception Logs
                          </h4>
                        </div>
                        <div className="card-body profile">
                          <div className="row">
                            <div className="tab-pane fade show active">
                              <div className="row">
                                <div className="col-md-3 col-lg-3 col-xl-3">
                                  <Label>From Date</Label>
                                  <DatePicker
                                    selected={fromDate}
                                    onChange={setFromDate}
                                    dateFormat="dd/MMM/yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    yearDropdownItemNumber={15}
                                    scrollableYearDropdown
                                    dropdownMode="select"
                                    className="form-control"
                                    placeholderText="Select Date"
                                    isClearable
                                  />
                                </div>

                                <div className="col-md-3 col-lg-3 col-xl-3">
                                  <Label>To Date</Label>
                                  <DatePicker
                                    selected={toDate}
                                    onChange={setToDate}
                                    dateFormat="dd/MMM/yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    yearDropdownItemNumber={15}
                                    scrollableYearDropdown
                                    dropdownMode="select"
                                    className="form-control"
                                    placeholderText="Select Date"
                                    isClearable
                                  />
                                </div>

                                <div className="col-md-2 col-lg-2 col-xl-2">
                                  <div className="mb-3 mt-2">
                                    <button
                                      onClick={handleSubmit}
                                      disabled={loadingSearch}
                                      type="button"
                                      className="btn btn-success waves-effect waves-light h-45"
                                      style={{
                                        height: '45px',
                                        minWidth: '100px',
                                        marginTop: '22px',
                                      }}
                                    >
                                      {loadingSearch ? (
                                        <>
                                          <Spinner size="sm" /> Searching...
                                        </>
                                      ) : (
                                        <>
                                          <Icon.Search size={20} /> Search
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-12">
                                  <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                      <thead>
                                        <tr className="border-b">
                                          <th style={{ minWidth: '130px' }}>Controller Name</th>
                                          <th>Method Name</th>
                                          <th style={{ minWidth: '160px' }}>Log Time</th>
                                          <th>Error Message</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {ExceptionData?.data?.length > 0 ? (
                                          ExceptionData?.data?.map((item, index) => (
                                            <tr key={index}>
                                              <td>{item.controllerName ?? 'N/A'}</td>
                                              <td>{item.methodName ?? 'N/A'}</td>
                                              <td>
                                                {item?.logDate
                                                  ? moment(item.logDate).format(
                                                      'DD-MMM-YYYY HH:mm:ss',
                                                    )
                                                  : 'N/A'}
                                              </td>
                                              <td>{item?.errorMessage ?? 'N/A'}</td>
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
                                onPageChange={(newPage) => {
                                  setPageNumber(newPage);
                                  handleSubmit(newPage); // Always call API on page change
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExceptionLogs;
