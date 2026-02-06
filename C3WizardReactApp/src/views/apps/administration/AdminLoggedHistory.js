import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import * as Icon from 'react-feather';
import { Label, Input, Pagination, PaginationItem, PaginationLink, Spinner } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearLogs,
  getLoggedHistoryHandler,
} from '../../../store/apps/administration/LoggedHistorySlice';
import CustomPagination from '../component/CustomPagination';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import Loader from '../../../layouts/loader/Loader';

const AdminLoggedHistory = () => {
  const [selectedValueCompany, setSelectedValueCompany] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedValueEmp, setSelectedValueEmp] = useState('');
  const [isAdminLogs, setIsAdminLogs] = useState(true);
  const [companyList, setCompanyList] = useState([]);
  const [employee, setEmployee] = useState(false);
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // applied filters used for API calls (updated only on Search)
  const [appliedCompany, setAppliedCompany] = useState('');
  const [appliedEmployee, setAppliedEmployee] = useState(false);
  const [appliedIsAdminLogs, setAppliedIsAdminLogs] = useState(true);
  const [appliedStartDate, setAppliedStartDate] = useState(null);
  const [appliedEndDate, setAppliedEndDate] = useState(null);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'LOGGED IN HISTORY');
  const canViewAdminLoggedHistory = employerPermission?.viewPermission;

  const { logsList, loading } = useSelector((state) => state.LoggedHistoryReducer || {});

  const options = companyList
    .filter((item) => item.companyName !== 'SSB')
    .map((item) => ({
      value: item.companyId,
      label: `${item.companyName} (${item.regNumber || 'N/A'})`, // show both companyName & regNumber
      regNumber: item.regNumber,
    }));

  const handleChange = (selectedOption) => {
    setEmployee(false);
    setIsAdminLogs(false);
    setSelectedValueCompany(selectedOption?.value || '');
  };

  // const handleChange = (event) => {
  //   setEmployee(false);
  //   setIsAdminLogs(false);
  //   setSelectedValueCompany(event.target.value);
  // };
  const handleChangeEmp = () => {
    setEmployee(!employee);
    setSelectedValueCompany('');
    setIsAdminLogs(false);
  };
  const handleChangeAdmin = () => {
    setEmployee(false);
    setSelectedValueCompany('');
    setIsAdminLogs(!isAdminLogs);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'M-d-yyyy h:mm a');
  };

  // default last 7 days
  const getLast7Days = () => {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 6); // includes today
    return { from, to: today };
  };

  const getAllCompaniesHandler = async () => {
    setLoadingDropdown(true);
    try {
      const res = await UserManagementServices.getAllCompanyData();
      setCompanyList(res.data.data);
    } catch (error) {
      console.error('Something went wrong:', error);
    } finally {
      setLoadingDropdown(false);
    }
  };

  // On mount set default last 7 days and apply them
  useEffect(() => {
    const { from, to } = getLast7Days();
    setStartDate(from);
    setEndDate(to);
    setAppliedStartDate(from);
    setAppliedEndDate(to);
    setAppliedCompany('');
    setAppliedEmployee(false);
    setAppliedIsAdminLogs(true);
  }, []);

  // Fetch when applied filters or pagination change
  useEffect(() => {
    // Build request params based on applied filters
    const baseDates = {
      fromDate: appliedStartDate ? moment(appliedStartDate).format('YYYY-MM-DD') : '',
      toDate: appliedEndDate ? moment(appliedEndDate).format('YYYY-MM-DD') : '',
    };

    if (appliedEmployee) {
      dispatch(
        getLoggedHistoryHandler({
          CompanyId: 0,
          isSelfEmployed: true,
          pageNumber,
          pageSize,
          ...baseDates,
        }),
      );
    } else if (appliedCompany) {
      dispatch(
        getLoggedHistoryHandler({
          CompanyId: appliedCompany,
          pageNumber,
          pageSize,
          ...baseDates,
        }),
      );
    } else if (appliedIsAdminLogs && !appliedCompany) {
      dispatch(
        getLoggedHistoryHandler({
          CompanyId: null,
          pageNumber,
          pageSize,
          ...baseDates,
        }),
      );
    } else if (!appliedIsAdminLogs && !appliedCompany) {
      dispatch(clearLogs());
      setPageNumber(1);
    }
  }, [
    appliedCompany,
    appliedEmployee,
    appliedIsAdminLogs,
    appliedStartDate,
    appliedEndDate,
    pageNumber,
    pageSize,
    dispatch,
  ]);

  useEffect(() => {
    getAllCompaniesHandler();
    // getAllSelfEmployerHandler();
  }, []);

  useEffect(() => {
    if (logsList) {
      setTotalRecords(logsList.totalRecords || 0);
      setTotalPages(logsList.totalPages);
      setLoadingSearch(false);
    }
  }, [logsList, pageSize, pageNumber]);

  useEffect(() => {
    if (canViewAdminLoggedHistory === false) {
      navigate('/login');
    }
  }, [canViewAdminLoggedHistory, navigate]);

  const handleSubmit = async (page = 0) => {
    const pageNumberToSend = typeof page === 'number' ? page : 0;
    setPageNumber(pageNumberToSend);

    if (startDate && endDate && moment(endDate).isBefore(moment(startDate), 'day')) {
      toast.error("'To' date cannot be smaller than 'From' date");
      return;
    }

    // apply filters only when user clicks Search; pagination will reuse these
    setLoadingSearch(true);
    setAppliedStartDate(startDate || null);
    setAppliedEndDate(endDate || null);
    setAppliedCompany(selectedValueCompany || '');
    setAppliedEmployee(!!employee);
    setAppliedIsAdminLogs(!!isAdminLogs);
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
              <Link to="/admin-dashboard" className="d-flex align-items-center gap-1 text-muted">
                <i className="ti-home" /> Admin Dashboard{' '}
              </Link>
            </li>
            <li>-</li>

            <li className="fw-medium">Admin Logged History</li>
          </ul>
        </div>

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
                          <div className="col-xl-7">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user text-success pe-2" /> Logged In History
                            </h4>
                          </div>

                          <div className="col-3">
                            <Input
                              type="checkbox"
                              id="checkSelf"
                              onChange={handleChangeEmp}
                              checked={employee}
                              className="custom-control-input mx-1"
                            />
                            <Label for="checkSelf">Select Self Employed Logs</Label>
                          </div>

                          <div className="col-2 text-end">
                            <Input
                              type="checkbox"
                              id="check"
                              onChange={handleChangeAdmin}
                              checked={isAdminLogs}
                              className="custom-control-input mx-1"
                            />
                            <Label for="check">Admin Logs</Label>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row  align-items-center d-flex">
                          <div className="col-lg-3 ">
                            <div className="select-wrapper">
                              <Label className="mb">Select Employer</Label>
                              <Select
                                options={options}
                                value={
                                  options.find((opt) => opt.value === selectedValueCompany) || null
                                }
                                onChange={handleChange}
                                placeholder=" Employer name or reg. Number"
                                isSearchable
                                isClearable
                                isLoading={false} // We use custom spinner
                                classNamePrefix="custom-select"
                                styles={{
                                  control: () => ({
                                    padding: '5px',
                                  }), // Disable inline styles
                                }}
                              />

                              {loadingDropdown && (
                                <Spinner size="sm" color="primary" className="select-spinner" />
                              )}
                            </div>
                          </div>

                          <div className="col-md-3  col-lg-3 col-xl-3 ">
                            <Label className="mb">From Date</Label>
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              dateFormat="dd-MMM-yyyy"
                              placeholderText="Start Date"
                              isClearable
                              className="form-control "
                            />
                          </div>
                          <div className="col-md-3  col-lg-3 col-xl-3 ">
                            <Label className="mb">To Date</Label>
                            <DatePicker
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              dateFormat="dd-MMM-yyyy"
                              placeholderText="End Date"
                              className="form-control  "
                              minDate={startDate}
                              isClearable
                            />
                          </div>
                          <div className="col-md-2 col-lg-2 col-xl-2">
                            <div className=" mt-2">
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
                                    <Icon.Search size={20} style={{ cursor: 'pointer' }} /> Search
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card-body mt-1 profile">
                        <div className="table-responsive">
                          {loading ? (
                            <Loader />
                          ) : (
                            <table className="table table-hover mb-0">
                              <thead>
                                <tr className="border-b">
                                  <th scope="row">Submitted</th>
                                  <th>EmailId</th>
                                  <th>LoginTime</th>
                                  <th>Logout Time</th>
                                </tr>
                              </thead>
                              <tbody>
                                {logsList?.records?.length > 0 ? (
                                  logsList?.records?.map((item) => (
                                    <tr key={item.loginTime}>
                                      <td>{item.userName}</td>
                                      <td>{item.emailId}</td>
                                      <td>
                                        {item?.loginTime
                                          ? moment(item.loginTime).format('DD-MMM-YYYY HH:mm:ss')
                                          : 'N/A'}
                                      </td>
                                      <td>
                                        {item?.logoutTime
                                          ? moment(item.logoutTime).format('DD-MMM-YYYY HH:mm:ss')
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
                          )}
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
            {/* <div className="mt-3 d-flex justify-content-end align-items-center">
              <button
                className="btn btn-success"
                type="button"
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                disabled={pageNumber === 1}
              >
                <i className="fas fa-arrow-left f-10"></i>
              </button>
              <span style={{ margin: '0 10px' }}>
                Page {pageNumber} of {totalPages}
              </span>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
                disabled={pageNumber === totalPages}
              >
                <i className="fas fa-arrow-right f-10"></i>
              </button>
            </div> */}
          </div>
          {/* end main content*/}
        </div>
      </div>
    </>
  );
};
export default AdminLoggedHistory;
