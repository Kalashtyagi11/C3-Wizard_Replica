import React, { useEffect, useState } from 'react';
import { Label, Spinner, Input, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DatePicker from 'react-datepicker';
import * as Icon from 'react-feather';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserAuditTrail,
  resetAuditTrail,
} from '../../../store/apps/administration/AuditTrailSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import CustomPagination from '../component/CustomPagination';
import Loader from '../../../layouts/loader/Loader';
import UserManagementServices from '../../../service/user-management/UserManagementServices';

const UserAuditTrail = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const userId = localStorage.getItem('userID');
  const RoleID = parseInt(localStorage.getItem('roleId'), 10);
  const CategoryType = localStorage.getItem('roleCategory')?.trim()?.toUpperCase();
  const [activeTab, setActiveTab] = useState('regular');
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auditTrails, loading: reduxLoading } = useSelector(
    (state) => state.AuditTrailReducer || {},
  );
  const { message, type } = useSelector((state) => state.messageReducer);
  const [loading, setLoading] = useState(false);
  const isLoading = reduxLoading || loading;
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventType, setEventType] = useState('Modified');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const CompanyIdSelected = localStorage.getItem('CompanyIdSelected');
  const [selectedValue, setSelectedValue] = useState(CompanyIdSelected || '');
  const [companyList, setCompanyList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [selfEmployee, setSelfEmployee] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedSelfEmployee, setSelectedSelfEmployee] = useState(null);
  const [isSelfEmployee, setIsSelfEmployee] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'USER AUDIT TRAIL');

  const canViewUserAuditTrail = employerPermission?.viewPermission;

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
  }, []);

  const getAllCompaniesHandler = async () => {
    setLoadingDropdown(true);
    try {
      const res = await UserManagementServices.getAllCompanyData();
      setCompanyList(res.data.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoadingDropdown(false);
    }
  };

  const getAllEmployeesHandler = async (CompanyId) => {
    setLoadingDropdown(true);
    try {
      const res = await UserManagementServices.getAllEmployeeAndWoking(CompanyId);
      setEmployeeList(res.data.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoadingDropdown(false);
    }
  };

  const getAllSelfEmployeeHandler = async () => {
    setLoadingDropdown(true);
    try {
      const res = await UserManagementServices.getAllSelfEmployerData();
      setSelfEmployee(res.data.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoadingDropdown(false);
    }
  };

  const options = companyList
    .filter((item) => item.companyName !== 'SSB')
    .map((item) => ({
      value: item.companyId,
      label: `${item.companyName} (${item.regNumber || 'N/A'})`, // show both companyName & regNumber
      regNumber: item.regNumber,
    }));

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption?.value || null);
    setSelectedEmployee(null);

    if (selectedOption?.value) {
      getAllEmployeesHandler(selectedOption.value); // pass companyId
    } else {
      setEmployeeList([]); // clear on clear
    }
  };

  const fetchAuditTrail = () => {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const storedUserId = localStorage.getItem('userID');

    let resolvedUserId;

    if (isAdmin) {
      resolvedUserId = storedUserId;
    } else if (CategoryType === 'SSB') {
      if (isSelfEmployee) {
        if (!selectedSelfEmployee?.value) {
          console.warn('Self-employee not selected yet');
          return; // Avoid undefined
        }
        resolvedUserId = selectedSelfEmployee.value;
      } else {
        if (!selectedEmployee?.value) {
          console.warn('Employee not selected yet');
          return; // Avoid undefined
        }
        resolvedUserId = selectedEmployee.value;
      }
    } else {
      resolvedUserId = storedUserId;
    }

    if (!resolvedUserId) {
      console.warn('Resolved User ID is still undefined');
      return;
    }

    const payload = {
      eventType,
      userId: resolvedUserId,
      pageNumber,
      pageSize,
      FromDate: formatDate(fromDate), // e.g., "05/05/2025"
      ToDate: formatDate(toDate),
    };

    setLoading(true);
    dispatch(getUserAuditTrail(payload))
      .unwrap()
      .then((res) => {
        setTotalRecords(res.auditTrails.totalRecords);
        setTotalPages(res.auditTrails.totalPages);
      })
      .catch((error) => {
        // handle/log error here if needed
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (fromDate && toDate) {
      fetchAuditTrail();
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);

    if (isAdmin || CategoryType !== 'SSB') {
      fetchAuditTrail();
    }
  }, [pageNumber, pageSize, isAdmin]);

  const handleSelfEmployeeChange = (e) => {
    const { checked } = e.target;
    setIsSelfEmployee(checked);
    setIsAdmin(false);

    if (checked) {
      setSelectedValue(null);
      setSelectedEmployee(null);
      const { from, to } = getLast7Days(); // already uses destructuring ✅
      setFromDate(from);
      setToDate(to);
    } else {
      setSelectedSelfEmployee(null);
    }

    setPageNumber(0);
    setPageSize(10);
    setTotalPages(0);
    setTotalRecords(0);

    dispatch(resetAuditTrail());
  };

  const handleAdminChange = (e) => {
    const { checked } = e.target;
    setIsAdmin(checked);
    setIsSelfEmployee(false);

    if (checked) {
      setSelectedValue(null);
      setSelectedEmployee(null);
      setSelectedSelfEmployee(null);
      fetchAuditTrail();
    }

    setPageNumber(0);
    setPageSize(10);
    setTotalPages(0);
    setTotalRecords(0);

    dispatch(resetAuditTrail());
  };

  const handleSubmit = async (page = 0) => {
    const pageNumberToSend = typeof page === 'number' ? page : 0;
    setPageNumber(pageNumberToSend);

    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const storedUserId = localStorage.getItem('userID');

    let resolvedUserId = null;

    if ([3, 4, 5, 6].includes(roleId)) {
      resolvedUserId = storedUserId;
    } else if (isAdmin) {
      // ✅ Skip validation and use stored userId for admin
      resolvedUserId = storedUserId;
    } else if (isSelfEmployee) {
      if (!selectedSelfEmployee) {
        toast.error('Please select a self employee');
        return;
      }
      resolvedUserId = selectedSelfEmployee?.value;
    } else {
      if (!selectedValue) {
        toast.error('Please select an employer');
        return;
      }

      if (!selectedEmployee) {
        toast.error('Please select a user');
        return;
      }

      resolvedUserId = selectedEmployee?.value;
    }

    // if (toDate && fromDate && new Date(toDate) < new Date(fromDate)) {
    //   toast.error("'To' date cannot be smaller than 'From' date");
    //   return;
    // }
    if (moment(toDate).isBefore(moment(fromDate), 'day')) {
      toast.error("'To' date cannot be smaller than 'From' date");
      return;
    }

    if (!eventType) {
      toast.error('Please select an event type');
      return;
    }

    // const localUserId = localStorage.getItem('userID');

    const payload = {
      FromDate: formatDate(fromDate), // e.g., "05/05/2025"
      ToDate: formatDate(toDate),
      eventType,
      userId: resolvedUserId,
      pageNumber: pageNumberToSend,
      pageSize,
      // pageNumber,
      // pageSize,
      // userId: selectedEmployee?.value,
      // userId: selectedSelfEmployee?.value,
    };

    try {
      setLoadingSearch(true);

      const response = await dispatch(getUserAuditTrail(payload)).unwrap();

      // Optional: handle response (set pagination totals, data etc.)
      // if (response?.auditTrails) {
      //   setTotalRecords(response.auditTrails.totalRecords || 0);
      //   setTotalPages(response.auditTrails.totalPages || 0);
      //   // setAuditData(response.auditTrails.data || []);
      // }

      const auditList = response?.auditTrails;

      if (!auditList || auditList.length === 0) {
        setTotalRecords(0);
        setTotalPages(0);
        setPageNumber(0);
        // setAuditData([]);
      } else {
        setTotalRecords(response.auditTrails.totalRecords || 0);
        setTotalPages(response.auditTrails.totalPages || 0);
        setPageSize(response.auditTrails.pageSize || 10);

        if (response.auditTrails.pageNumber === 1) {
          setPageNumber(0); // Adjust to zero-based index if needed
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
    if (canViewUserAuditTrail === false) {
      navigate('/login');
    }
  }, [canViewUserAuditTrail, navigate]);

  useEffect(() => {
    getAllCompaniesHandler();
    getAllEmployeesHandler();
    getAllSelfEmployeeHandler();
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

  useEffect(() => {
    if (
      selectedValue &&
      Array.isArray(employeeList) &&
      employeeList.length > 0 &&
      !selectedEmployee
    ) {
      const firstUser = employeeList[0];
      setSelectedEmployee({
        value: firstUser.userId,
        label: firstUser.name || firstUser.firstName || `Employee ${firstUser.userId}`,
      });
    }
  }, [selectedValue, employeeList, selectedEmployee]);

  useEffect(() => {
    dispatch(resetAuditTrail());
  }, [dispatch]);

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
          <ul className="d-flex align-items-center mt-3 gap-2 list-unstyled">
            <li className="fw-medium">
              <Link to="/dashboard" className="d-flex align-items-center gap-1 text-muted">
                {' '}
                <i className="ti-home" /> Dashboard{' '}
              </Link>
            </li>
            <li>-</li>
            <li className="fw-medium">
              <span className="d-flex align-items-center gap-1 text-muted">User Audit Trail</span>
            </li>
          </ul>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <>
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
                              <div className="col-xl-8">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-file-alt pe-1" />
                                  User Audit Trail
                                </h4>
                              </div>
                              {CategoryType === 'SSB' && (
                                <>
                                  <div className="col-lg-2 text-end">
                                    <Label>
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={isAdmin}
                                        onChange={handleAdminChange}
                                      />
                                      &nbsp; Is Admin?
                                    </Label>
                                  </div>
                                  <div className="col-lg-2 text-end">
                                    <Label>
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={isSelfEmployee}
                                        onChange={handleSelfEmployeeChange}
                                      />
                                      &nbsp; Is Self Employee?
                                    </Label>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="row"></div>
                            <div className="row ">
                              {CategoryType === 'SSB' &&
                                !isAdmin &&
                                (isSelfEmployee ? (
                                  <div className="col-md-4 addition col-lg-4 col-xl-4">
                                    <Label className="mb">Select Self Employee</Label>
                                    <div className="select-wrapper">
                                      <Select
                                        options={
                                          Array.isArray(selfEmployee)
                                            ? selfEmployee.map((emp) => ({
                                                value: emp.userId,
                                                label:
                                                  emp.name ||
                                                  emp.firstName ||
                                                  `Employee ${emp.userId}`,
                                              }))
                                            : []
                                        }
                                        onChange={(selectedOption) => {
                                          setSelectedSelfEmployee(selectedOption); // Save the whole object or
                                        }}
                                        placeholder="Select Self Employee"
                                        isSearchable
                                        isClearable
                                        isLoading={loadingDropdown}
                                        classNamePrefix="custom-select"
                                        styles={{
                                          control: () => ({
                                            padding: '0px',
                                            minWidth: 'auto',
                                          }), // Disable inline styles
                                        }}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="col-md-3 addition col-lg-3 col-xl-3">
                                      <Label className="mb">Select Employer</Label>

                                      <div className="select-wrapper">
                                        <Select
                                          options={options}
                                          value={
                                            options.find((opt) => opt.value === selectedValue) ||
                                            null
                                          }
                                          onChange={handleChange}
                                          placeholder="Employer name or reg. Number"
                                          isSearchable
                                          isClearable
                                          isLoading={false} // We use custom spinner
                                          classNamePrefix="custom-select"
                                          styles={{
                                            control: () => ({
                                              padding: '0px',
                                              minWidth: 'auto',
                                            }), // Disable inline styles
                                          }}
                                        />

                                        {loadingDropdown && (
                                          <Spinner
                                            size="sm"
                                            color="primary"
                                            className="select-spinner"
                                          />
                                        )}
                                      </div>
                                    </div>

                                    {selectedValue && (
                                      <div className="col-md-3 addition col-lg-3 col-xl-3">
                                        <Label className="mb">Select User</Label>
                                        <div className="select-wrapper">
                                          <Select
                                            value={selectedEmployee}
                                            options={
                                              Array.isArray(employeeList)
                                                ? employeeList.map((emp) => ({
                                                    value: emp.userId,
                                                    label:
                                                      emp.name ||
                                                      emp.firstName ||
                                                      `Employee ${emp.userId}`,
                                                  }))
                                                : []
                                            }
                                            onChange={(selectedOption) => {
                                              setSelectedEmployee(selectedOption);
                                            }}
                                            placeholder="Select User"
                                            isSearchable
                                            isClearable
                                            isLoading={loadingDropdown}
                                            classNamePrefix="custom-select"
                                            styles={{
                                              control: () => ({
                                                padding: '0px',
                                                minWidth: 'auto',
                                              }),
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ))}

                              <div
                                className={
                                  isSelfEmployee || isAdmin
                                    ? 'col-md-3 col-lg-3 col-xl-3'
                                    : RoleID === 1 || RoleID === 2
                                    ? 'col-md-2 col-lg-2 col-xl-2'
                                    : 'col-md-3 col-lg-3 col-xl-3'
                                }
                              >
                                <Label>From Date</Label>
                                {/* <span className="text-danger">*</span> */}
                                <DatePicker
                                  selected={fromDate}
                                  onChange={(date) => setFromDate(date || '')}
                                  dateFormat="dd/MMM/yyyy"
                                  // showMonthYearPicker
                                  // showFullMonthYearPicker
                                  showMonthDropdown // Show the month dropdown
                                  showYearDropdown // Show the year dropdown
                                  yearDropdownItemNumber={15} // Number of years to display in the year dropdown
                                  scrollableYearDropdown // Make the year dropdown scrollable
                                  dropdownMode="select" // To ensure dropdown mode is used
                                  className="form-control"
                                  placeholderText="Select Month and Year"
                                  isClearable
                                />
                              </div>

                              <div
                                className={
                                  isSelfEmployee || isAdmin
                                    ? 'col-md-3 col-lg-3 col-xl-3'
                                    : RoleID === 1 || RoleID === 2
                                    ? 'col-md-2 col-lg-2 col-xl-2'
                                    : 'col-md-3 col-lg-3 col-xl-3'
                                }
                              >
                                <Label>To Date</Label>
                                {/* <span className="text-danger">*</span> */}
                                <DatePicker
                                  selected={toDate}
                                  onChange={(date) => setToDate(date || '')}
                                  dateFormat="dd/MMM/yyyy"
                                  // showMonthYearPicker
                                  // showFullMonthYearPicker
                                  showMonthDropdown // Show the month dropdown
                                  showYearDropdown // Show the year dropdown
                                  yearDropdownItemNumber={15} // Number of years to display in the year dropdown
                                  scrollableYearDropdown // Make the year dropdown scrollable
                                  dropdownMode="select" // To ensure dropdown mode is used
                                  className="form-control"
                                  placeholderText="Select Month and Year"
                                  isClearable
                                />
                              </div>

                              {/* <div className="col-md-3 col-lg-3 col-xl-3">
                            <Label>Event Type</Label> <span className="text-danger">*</span>
                            <Input
                              type="select"
                              className="form-control"
                              value={eventType}
                              onChange={(e) => {
                                setEventType(e.target.value);
                              }}
                            >
                              <option value="Modified">Modified</option>
                              <option value="DELETE">Deleted</option>
                              <option value="Added">Added</option>
                            </Input>
                          </div> */}
                              <div className="col-md-2 col-lg-2 col-xl-2">
                                <div className="mb-3 mt-2">
                                  <button
                                    onClick={handleSubmit}
                                    // disabled={loading || !Year || month === ''}
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
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-3 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-12 col-12 mb-2 mb-lg-0">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-user text-success pe-2" /> User Audit Trail
                                  List
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
                                            <th>Screen Name</th>
                                            <th>Event Type</th>
                                            <th>Column Name</th>
                                            <th>Old Value</th>
                                            <th>New value</th>
                                            <th>Created By</th>
                                            <th>Created On</th>

                                            {/* <th>User Name</th>
                                        <th>Action</th> */}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {auditTrails?.records?.length > 0 ? (
                                            auditTrails?.records?.map((item, index) => (
                                              <tr key={index}>
                                                <td>
                                                  <span>{item.tableName ?? 'N/A'}</span>
                                                </td>
                                                <td>{item.eventType ?? 'N/A'}</td>
                                                <td>{item.columnName ?? 'N/A'}</td>
                                                {/* <td>
                                              {item.oldValue
                                                ? `IsReconciled: ${item.oldValue.IsReconciled}, Notes: ${item.oldValue.Notes}`
                                                : 'N/A'}
                                            </td>
                                            <td>
                                              {item.newValue
                                                ? `IsReconciled: ${item.newValue.IsReconciled}, Notes: ${item.newValue.Notes}`
                                                : 'N/A'}
                                            </td> */}
                                                {/* <td>
                                              {item.oldValue
                                                ? `IsReconciled: ${
                                                    item.oldValue?.IsReconciled ?? 'N/A'
                                                  }, Notes: ${item.oldValue?.Notes ?? 'N/A'}`
                                                : 'N/A'}
                                            </td> */}
                                                <td
                                                  style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                  }}
                                                >
                                                  {item.oldValue
                                                    ? item.oldValue.replace(/(.{20})/g, '$1\n')
                                                    : 'N/A'}
                                                </td>
                                                {/* <td>{item.newValue ?? 'N/A'}</td> */}
                                                <td
                                                  style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                  }}
                                                >
                                                  {item.newValue
                                                    ? item.newValue.replace(/(.{20})/g, '$1\n')
                                                    : 'N/A'}
                                                </td>

                                                <td>{item.userName ?? 'N/A'}</td>

                                                <td>
                                                  {moment(item.createdOn).format('DD-MMM-YYYY')}
                                                </td>
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
                                  <CustomPagination
                                    pageNumber={pageNumber}
                                    pageSize={pageSize}
                                    totalRecords={totalRecords}
                                    totalPages={totalPages}
                                    // onPageChange={setPageNumber}

                                    onPageChange={
                                      CategoryType === 'SSB'
                                        ? (newPage) => {
                                            setPageNumber(newPage);
                                            handleSubmit(newPage); // API call only for roleId 1 & 2
                                          }
                                        : (newPage) => {
                                            setPageNumber(newPage); // Just update page for other roles
                                          }
                                    }
                                  />
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
          </>
        )}
      </div>
    </>
  );
};
export default UserAuditTrail;
