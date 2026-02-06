import { Helmet } from 'react-helmet';
import { useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import moment from 'moment';
import { toast } from 'react-toastify';
import Select from 'react-select';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Spinner,
  Input,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  UncontrolledTooltip,
  Card,
  CardBody,
} from 'reactstrap';

import * as Icon from 'react-feather';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import DashboardService from '../../../service/dashboard/Dashboard';
import {
  getContribution,
  previewAllData,
  ImportCThree,
  ImportCThreeLatest,
  getLoaddashboardPaymentStatus,
} from '../../../store/apps/dashboard/DashboardSlice';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import user1 from '../../../assets/images/users/user4.jpg';
import Loader from '../../../layouts/loader/Loader';

const AdminReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState({});
  const [loadingHeaderId, setLoadingHeaderId] = useState(null);
  const [data, setData] = useState(null);
  const [showRecipt, setShowRecipt] = useState(false);
  const { toPDF: toPDF1, targetRef: targetRef1 } = usePDF({ filename: 'TransactionReceipt.pdf' });
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [show, setShow] = useState(false);
  const [headerId, setHeaderId] = useState(null);
  const [periodYear, setPeriodYear] = useState(null);
  const [periodMonth, setPeriodMonth] = useState(null);
  const CompanyIdLocal = parseInt(localStorage.getItem('companyId'), 10);
  const userId = localStorage.getItem('userID');
  const userName = localStorage.getItem('userId');
  const userPassword = localStorage.getItem('userPassword');
  const UserName = localStorage.getItem('userName');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState({ label: 'All Status', value: '' });
  const [localLoading, setLocalLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const roleId = parseInt(localStorage.getItem('roleId'), 10);
  const categoryRole = localStorage.getItem('roleCategory')?.trim()?.toUpperCase();
  const [selectedKey, setSelectedKey] = useState('');
  const [tableData, setTableData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [companyList, setCompanyList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [selfEmployee, setSelfEmployee] = useState([]);
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const CategoryType = localStorage.getItem('roleCategory')?.trim()?.toUpperCase();
  const CompanyIdSelected = localStorage.getItem('CompanyIdSelected');
  const [selectedValue, setSelectedValue] = useState(CompanyIdSelected || '');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedSelfEmployee, setSelectedSelfEmployee] = useState(null);
  const { message, type } = useSelector((state) => state.messageReducer);
  const {
    ContributionCount,
    LoaddashboardPayment,
    loading: reduxLoading,
  } = useSelector((state) => state.dashboardSlice);

  const pageLoading = reduxLoading || loadingCompanies || loadingEmployees;
  const [showContent, setShowContent] = useState(false);
  const { previewData } = useSelector((state) => state.dashboardSlice);
  const getDate = new Date();
  const [Year, setYear] = useState(getDate.getFullYear().toString());
  const [FromDate, setFromMonth] = useState('');
  const [ToDate, setToMonth] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [filteredCompanyData, setFilteredCompanyData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  // New-added-04-08-2025

  const getAllCompaniesHandler = async () => {
    setLoadingCompanies(true);
    try {
      const res = await UserManagementServices.getAllCompanyData();
      let filteredCompanies = [];

      if (CategoryType === 'COMPANY') {
        filteredCompanies = res.data.data.filter((item) => item.companyId === CompanyIdLocal);
      } else {
        filteredCompanies = res.data.data;
      }

      setCompanyList(filteredCompanies);
    } catch (error) {
      console.log('');
    } finally {
      setLoadingCompanies(false);
    }
  };

  const getAllEmployeesHandler = async (CompanyId) => {
    setLoadingEmployees(true);
    try {
      const res = await UserManagementServices.getAllEmployeeAndWoking(CompanyId);
      setEmployeeList(res.data.data);
    } catch (error) {
      console.error('Something went wrong:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const getAllSelfEmployeeHandler = async () => {
    setLoadingDropdown(true);
    try {
      const res = await UserManagementServices.getAllSelfEmployerData();
      setSelfEmployee(res.data.data);
    } catch (error) {
      console.error('Something went wrong:', error);
    } finally {
      setLoadingDropdown(false);
    }
  };

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'INVALID_REQUEST', value: 'INVALID_REQUEST' },
    { label: 'AUTHORIZED', value: 'AUTHORIZED' },
    { label: 'DECLINED', value: 'DECLINED' },
  ];

  const typeOptions = [
    { label: 'Employer', value: 'Company' },
    { label: 'Self Employed', value: 'SelfEmployee' },
  ];

  const options = companyList
    .filter((item) => item.companyName !== 'SSB')
    .map((item) => ({
      value: item.companyId,
      // label: item.companyName,
      label: `${item.companyName} (${item.regNumber || 'N/A'})`, // show both companyName & regNumber
      regNumber: item.regNumber,
    }));

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption?.value || null);
    setSelectedEmployee(null);
    setSelectedUserId(null);
    setEmployeeList([]);

    if (selectedOption?.value) {
      getAllEmployeesHandler(selectedOption.value);
    } else {
      setEmployeeList([]);
    }
  };

  const handleChangeStatus = (option) => {
    setSelectedStatus(option || { label: 'All Status', value: '' });
  };

  const [selectedType, setSelectedType] = useState(() => {
    if (CategoryType === 'SELFEMPLOYEE') {
      return typeOptions.find((opt) => opt.value === 'SelfEmployee');
    }

    if (CategoryType === 'SSB') {
      return typeOptions.find((opt) => opt.value === '');
    }

    return typeOptions.find((opt) => opt.value === 'Company');
  });

  const handleChangeType = (selected) => {
    setSelectedType(selected);
  };

  useEffect(() => {
    getAllCompaniesHandler();
    getAllEmployeesHandler();
    getAllSelfEmployeeHandler();
  }, []);

  useEffect(() => {
    if (
      CategoryType === 'COMPANY' &&
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
  }, [selectedValue, employeeList, selectedEmployee, CategoryType]);

  useEffect(() => {
    if (CategoryType === 'COMPANY' && companyList.length === 1) {
      const selectedCompanyID = {
        value: companyList[0].companyId,
        label: companyList[0].companyName,
      };
      handleChange(selectedCompanyID);
    }
  }, [companyList]);

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
    if (users.length > 0 && !selectedUserId && selectedCompany?.id) {
      const ppocUser = users.find((user) => user.isPPOC === true);
      if (ppocUser) {
        setSelectedUserId(ppocUser.id);
      }
    }
  }, [users, selectedUserId, CategoryType, selectedCompany]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (startDate && endDate && startDate > endDate) {
        toast.error('Start Date cannot be greater than End Date');
        return;
      }

      const isSelfType = selectedType?.value === 'SelfEmployee';
      const isSSB = CategoryType === 'SSB';

      const params = {
        PaymentStatus: selectedStatus?.value || '',
        FromDate: startDate ? format(startDate, 'MM-dd-yyyy') : '',
        ToDate: endDate ? format(endDate, 'MM-dd-yyyy') : '',
        CompanyId: '',
        UserId: '',
        types: '',
      };

      params.CompanyId = isSSB ? selectedValue || '' : selectedValue || CompanyIdLocal || '';

      switch (CategoryType) {
        case 'SSB':
          params.UserId = isSelfType
            ? selectedSelfEmployee?.value || selectedEmployee?.value || ''
            : selectedEmployee?.value || selectedSelfEmployee?.value || '';
          params.types = selectedType?.value || 'SSB';
          break;
        case 'COMPANY':
          params.UserId = selectedUserId || '';
          params.types = selectedType?.value || 'Company';
          break;
        case 'SELFEMPLOYEE':
          params.UserId = userId;
          params.types = selectedType?.value || 'SelfEmployee';
          break;
        default:
          params.UserId = isSelfType
            ? selectedSelfEmployee?.value || selectedEmployee?.value || userId || ''
            : selectedEmployee?.value || selectedSelfEmployee?.value || userId || '';
          params.types = selectedType?.value || 'Company';
          break;
      }

      setLocalLoading(true);
      try {
        await dispatch(getLoaddashboardPaymentStatus(params)).unwrap();
      } catch (error) {
        console.error('Something went wrong:', error);
      } finally {
        setLocalLoading(false);
      }
    };

    fetchDashboardData();
  }, [
    dispatch,
    startDate,
    endDate,
    selectedStatus,
    selectedCompanyId,
    selectedUserId,
    selectedType,
    selectedValue,
    selectedEmployee,
    selectedSelfEmployee,
    CategoryType,
  ]);

  useEffect(() => {
    if (CategoryType === 'SELFEMPLOYEE' && selfEmployee.length > 0) {
      const selectedUser = selfEmployee.find((emp) => emp.userId?.toString() === userId);
      if (selectedUser) {
        setSelectedSelfEmployee({
          value: selectedUser.userId,
          label: selectedUser.name || selectedUser.firstName || `Employee ${selectedUser.userId}`,
        });
      }
    }
  }, [selfEmployee]);

  const { toPDF, targetRef } = usePDF({
    filename: 'SocialSecurityReport.pdf',
    page: { margin: Margin.NONE, orientation: 'landscape' },
  });

  const DownloadPrint = async (headerID, transactionID, userIdToUse) => {
    setLoadingTransactions((prev) => ({
      ...prev,
      [`${headerID}-${transactionID}`]: true,
    }));

    try {
      // let userIdToUse = null;
      // if (CategoryType === 'SSB') {
      //   userIdToUse = selectedUserId || selectedSelfEmployee?.value || userId;
      // } else if (CategoryType === 'SELFEMPLOYEE') {
      //   userIdToUse = selectedSelfEmployee?.value || userId;
      // } else {
      //   userIdToUse = userId;
      // }

      // if (!userIdToUse) {
      //   throw new Error('User ID not available');
      // }

      const res = await DashboardService.downloadTransaction({
        userId: userIdToUse,
        c3HeaderId: headerID,
        transactionID,
      });

      if (res.data.status === true) {
        setData(res.data.data);
        setShowRecipt(true);
        setIsOpen(true);
      } else {
        throw new Error(res.data.message || 'Failed to download receipt');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to download receipt');
    } finally {
      setLoadingTransactions((prev) => ({
        ...prev,
        [`${headerID}-${transactionID}`]: false,
      }));
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      await toPDF1();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowRecipt(false);
  };

  useEffect(() => {
    let timer;
    if (!pageLoading) {
      timer = setTimeout(() => {
        setShowContent(true);
      }, 1000);
    } else {
      setShowContent(false);
    }
    return () => clearTimeout(timer);
  }, [pageLoading, CategoryType]);

  return (
    <>
      <Helmet>
        <title>Payment Report - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />

        <sidebar-barrrrrr></sidebar-barrrrrr>
        <>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
            <ul className="d-flex align-items-center mt-3 gap-2 list-unstyled">
              <li className="fw-medium">
                {CategoryType === 'SSB' && (
                  <Link
                    to="/admin-dashboard"
                    className="d-flex align-items-center gap-1 text-muted"
                  >
                    <i className="ti-home" /> Admin Dashboard{' '}
                  </Link>
                )}
                {CategoryType === 'COMPANY' && (
                  <Link to="/dashboard" className="d-flex align-items-center gap-1 text-muted">
                    {' '}
                    <i className="ti-home" /> Dashboard{' '}
                  </Link>
                )}
                {CategoryType === 'SELFEMPLOYEE' && (
                  <Link
                    to="/apps/dashboards"
                    className="d-flex align-items-center gap-1 text-muted"
                  >
                    {' '}
                    <i className="ti-home" /> Dashboard{' '}
                  </Link>
                )}
              </li>
              <li>-</li>
              <li className="fw-medium">
                <span className="d-flex align-items-center gap-1 text-muted">Payment Details</span>
              </li>
            </ul>
          </div>
        </>

        {pageLoading || !showContent ? (
          <Loader />
        ) : (
          <>
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-3 bg_ligh">
                            <div className="row">
                              <div
                                className={
                                  CategoryType === 'SSB'
                                    ? 'col-xl-12  d-flex align-items-center justify-content-end'
                                    : 'col-xl-12  d-flex align-items-center justify-content-end'
                                }
                              >
                                <>
                                  <div className="col-md-2 addition col-lg-2 col-xl-2 me-1">
                                    <Label className="mb">Select Payment Status</Label>
                                    <Select
                                      options={statusOptions}
                                      value={selectedStatus}
                                      onChange={handleChangeStatus}
                                      placeholder="select status"
                                      isClearable
                                      isSearchable
                                    />
                                  </div>
                                  {CategoryType === 'SSB' &&
                                    selectedType?.value !== 'SelfEmployee' && (
                                      <div className="col-md-2 addition col-lg-2 col-xl-2 me-1">
                                        <Label className="mb">Select Type</Label>
                                        <Select
                                          options={typeOptions}
                                          value={selectedType}
                                          onChange={handleChangeType}
                                          isSearchable
                                          placeholder="Select Type"
                                          isClearable
                                        />
                                      </div>
                                    )}
                                </>

                                {(CategoryType === 'SSB' || CategoryType === 'COMPANY') &&
                                  selectedType?.value === 'Company' && (
                                    <>
                                      <div className="col-md-2 addition col-lg-2 col-xl-2 me-1">
                                        <Label className="mb">Select Employer</Label>

                                        <div className="select-wrapper">
                                          <Select
                                            options={options}
                                            value={
                                              options.find((opt) => opt.value === selectedValue) ||
                                              null
                                            }
                                            onChange={handleChange}
                                            placeholder="Select Employer"
                                            isSearchable
                                            isDisabled={CategoryType === 'COMPANY'}
                                            isClearable
                                            isLoading={false}
                                            classNamePrefix="custom-select"
                                            styles={{
                                              control: () => ({
                                                padding: '0px',
                                                minWidth: 'auto',
                                              }),
                                            }}
                                          />

                                          {loadingCompanies && (
                                            <Spinner
                                              size="sm"
                                              color="primary"
                                              className="select-spinner"
                                            />
                                          )}
                                        </div>
                                      </div>

                                      {selectedValue && (
                                        <div className="col-md-2 addition col-lg-2 col-xl-2 me-1">
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
                                                setSelectedUserId(selectedOption?.value || null);
                                              }}
                                              placeholder="Select User"
                                              isSearchable
                                              isClearable
                                              isLoading={false}
                                              classNamePrefix="custom-select"
                                              styles={{
                                                control: () => ({
                                                  padding: '0px',
                                                  minWidth: 'auto',
                                                }),
                                              }}
                                            />

                                            {loadingEmployees && (
                                              <Spinner
                                                size="sm"
                                                color="primary"
                                                className="select-spinner"
                                              />
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}

                                {(selectedType?.value === 'SelfEmployee' ||
                                  CategoryType === 'SELFEMPLOYEE') && (
                                  <div className="col-md-2 addition col-lg-2 col-xl-2 me-1">
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
                                          setSelectedSelfEmployee(selectedOption);
                                        }}
                                        value={selectedSelfEmployee}
                                        placeholder="Select Self Employee"
                                        isSearchable
                                        isClearable
                                        isDisabled={CategoryType === 'SELFEMPLOYEE'}
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

                                <div className="col-md-2 addition col-lg-2 col-xl-2">
                                  <Label className="mb">From Date</Label>
                                  <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="dd-MMM-yyyy"
                                    placeholderText="Start Date"
                                    isClearable
                                    className="form-control w-auto me-2 "
                                  />
                                </div>
                                <div className="col-md-2 addition col-lg-2 col-xl-2">
                                  <Label className="mb">To Date</Label>
                                  <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    dateFormat="dd-MMM-yyyy"
                                    placeholderText="End Date"
                                    className="form-control w-auto "
                                    minDate={startDate}
                                    isClearable
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="card">
                            <div className="card-header py-3 bg_ligh">
                              <h4 className="header-title mb-0 text-success">Report List</h4>
                            </div>
                            <div className="card-body pt-1">
                              <div className="table-container">
                                <table className="table new_table table-hover mb-0">
                                  <thead>
                                    <tr className="border-b">
                                      <th style={{ minWidth: '70px' }}>Month</th>
                                      <th className="td-text-align1">Year&nbsp;&nbsp;</th>
                                      <th className="td-text-align1">Wages</th>
                                      <th className="td-text-align1">
                                        {CategoryType === 'SELFEMPLOYEE' ||
                                        selectedType?.value === 'SelfEmployee'
                                          ? 'Contribution'
                                          : 'Social Security'}
                                      </th>

                                      {!(
                                        CategoryType === 'SELFEMPLOYEE' ||
                                        selectedType?.value === 'SelfEmployee'
                                      ) && <th className="td-text-align1">Levy</th>}

                                      <th className="td-text-align1">Fines and Penalties</th>
                                      {!(
                                        CategoryType === 'SELFEMPLOYEE' ||
                                        selectedType?.value === 'SelfEmployee'
                                      ) && <th className="td-text-align1">Severance</th>}
                                      <th className="td-text-align1"> Payment Amount</th>
                                      <th className="td pd_left" style={{ minWidth: '160px' }}>
                                        Creation Date
                                      </th>
                                      <th>Schedule</th>
                                      <th className="td-text-alignss" style={{ minWidth: '160px' }}>
                                        Transaction ID
                                      </th>
                                      <th className="td-text-alignss">Transaction Date</th>
                                      <th className="td-text-alignss">
                                        Transaction Status{' '}
                                        <span style={{ marginLeft: '35px' }}>Download Pdf</span>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {LoaddashboardPayment?.records &&
                                    LoaddashboardPayment?.records?.length > 0 ? (
                                      LoaddashboardPayment.records
                                        .filter((item) => {
                                          const matchesStatus = selectedStatus?.value
                                            ? item?.payDetails?.some(
                                                (p) => p.transactionStatus === selectedStatus.value,
                                              )
                                            : true;
                                          const matchesYear = selectedYear
                                            ? item.period_year === selectedYear
                                            : true;
                                          return matchesStatus && matchesYear;
                                        })
                                        .map((item, itemIndex) => (
                                          <tr
                                            key={item.headerID}
                                            className={
                                              itemIndex % 2 === 0
                                                ? 'alternate-row-red'
                                                : 'alternate-row-blue'
                                            }
                                          >
                                            <td>
                                              <span
                                                className=""
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="top"
                                                title="Submitted"
                                              >
                                                {item.is_submitted === true ? (
                                                  <i className="fa fa-check-circle text-success" />
                                                ) : (
                                                  <i className="fa fa-times-circle text-danger" />
                                                )}
                                              </span>{' '}
                                              {item.period_Month ?? 'N/A'}
                                            </td>
                                            <td className="td-text-align1">
                                              {item.period_year ?? 'N/A'}
                                            </td>
                                            <td className="td-text-align1">
                                              ${item.totaL_WAGES?.toFixed(2) ?? '0.00'}
                                            </td>
                                            <td className="td-text-align1">
                                              ${item.totalsscontributions?.toFixed(2) ?? '0.00'}
                                            </td>
                                            {!(
                                              CategoryType === 'SELFEMPLOYEE' ||
                                              selectedType?.value === 'SelfEmployee'
                                            ) && (
                                              <td className="td-text-align1">
                                                ${item.totallevyeeemployee?.toFixed(2) ?? '0.00'}
                                              </td>
                                            )}
                                            <td className="td-text-align1">
                                              ${item.totalsspenalty?.toFixed(2) ?? '0.00'}
                                            </td>
                                            {!(
                                              CategoryType === 'SELFEMPLOYEE' ||
                                              selectedType?.value === 'SelfEmployee'
                                            ) && (
                                              <>
                                                <td className="td-text-align1">
                                                  ${item.totalservayance?.toFixed(2) ?? '0.00'}
                                                </td>
                                              </>
                                            )}
                                            <td className="td-text-align1">
                                              $
                                              {item.payDetails?.[0]?.paymentAmount?.toFixed(2) ??
                                                '0.00'}
                                            </td>
                                            <td className="td-pl-2 pd_left">
                                              {moment(
                                                item.insert_Datetimeinfo,
                                                'DD-MM-YYYY',
                                              ).format('DD-MMM-YYYY')}
                                            </td>
                                            <td>
                                              <span className="badge bg-primary">
                                                {item?.schedule_NO ?? '0'}
                                              </span>
                                            </td>
                                            <td
                                              className="td-text-alignss"
                                              style={{ color: 'black' }}
                                            >
                                              {item?.payDetails?.map((payment, index) => (
                                                <div
                                                  key={index}
                                                  style={{
                                                    borderBottom: '1px solid #ccc',
                                                    paddingBottom: '4px',
                                                    marginBottom: '3px',
                                                  }}
                                                >
                                                  {payment.transactionID}
                                                </div>
                                              ))}
                                            </td>
                                            <td
                                              className="td-text-alignss"
                                              style={{ color: 'black' }}
                                            >
                                              {item?.payDetails?.map((payment, index) => (
                                                <div
                                                  key={index}
                                                  style={{
                                                    borderBottom: '1px solid #ccc',
                                                    paddingBottom: '4px',
                                                    marginBottom: '4px',
                                                  }}
                                                >
                                                  {moment(payment.transactionDate).format(
                                                    'DD-MMM-YYYY',
                                                  )}
                                                </div>
                                              ))}
                                            </td>
                                            <td
                                              className="td-text-alignss"
                                              style={{ color: 'black' }}
                                            >
                                              {item?.payDetails?.map((payment, index) => (
                                                <div
                                                  key={index}
                                                  style={{
                                                    borderBottom: '1px solid #ccc',
                                                    paddingBottom: '4px',
                                                    marginBottom: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                  }}
                                                >
                                                  <span
                                                    className="fw-medium"
                                                    style={{ minWidth: '140px' }}
                                                  >
                                                    {payment?.transactionStatus === 'AUTHORIZED' ? (
                                                      <>
                                                        <i className="fa fa-check-circle text-success me-1" />
                                                        <span className="text-success">
                                                          {payment.transactionStatus}
                                                        </span>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <i className="fa fa-times-circle text-danger me-1" />
                                                        <span className="text-danger">
                                                          {payment?.transactionStatus ?? ''}
                                                        </span>
                                                      </>
                                                    )}
                                                  </span>

                                                  <span
                                                    style={{
                                                      marginLeft: '10px',
                                                      cursor: 'pointer',
                                                      display: 'inline-flex',
                                                      alignItems: 'center',
                                                      gap: '4px',
                                                    }}
                                                    id={`downloadIcon-${item.headerID}-${index}`}
                                                    onClick={() => {
                                                      DownloadPrint(
                                                        item.headerID,
                                                        payment.transactionID,
                                                        item.userId,
                                                      );
                                                    }}
                                                  >
                                                    {loadingTransactions[
                                                      `${item.headerID}-${payment.transactionID}`
                                                    ] ? (
                                                      <Spinner size="sm" className="me-1" />
                                                    ) : (
                                                      <>
                                                        <span style={{ color: '#119310' }}>
                                                          <i
                                                            className="mdi mdi-printer f-18"
                                                            aria-hidden="true"
                                                          />
                                                        </span>
                                                        <UncontrolledTooltip
                                                          placement="top"
                                                          target={`downloadIcon-${item.headerID}-${index}`}
                                                        >
                                                          Download Payment Receipt
                                                        </UncontrolledTooltip>
                                                      </>
                                                    )}
                                                  </span>
                                                </div>
                                              ))}
                                            </td>
                                          </tr>
                                        ))
                                    ) : (
                                      <tr>
                                        <td className="text-center" colSpan="13">
                                          No data available
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
            </div>
          </>
        )}
      </div>

      <Modal isOpen={isOpen} toggle={handleClose} size="lg" centered scrollable>
        <ModalHeader toggle={handleClose}>Payment</ModalHeader>
        <ModalBody>
          <>
            <div ref={targetRef1}>
              <Card style={{ maxWidth: '700px', margin: 'auto', fontSize: '1.2rem' }}>
                <CardBody className="border p-4 shadow">
                  {data ? (
                    <div className="table-responsive">
                      <div className="receipt-box shadow-sm p-4 rounded">
                        <div className="receipt-header">
                          <div className="d-flex align-items-center">
                            <img src={user1} alt="" width="80px" />
                            <h4 className="mt-2 ms-4 fw-bold">
                              St. Christopher and Nevis Social Security Board
                            </h4>
                          </div>
                          <h1 className="my-3 fw-bold text-center">RECEIPT</h1>
                        </div>
                        <div className="text-center profile-area mb-4">
                          <div className="row mt-5">
                            <div className="col-6">
                              <p
                                className="mb-0"
                                style={{
                                  fontWeight: '600',
                                  fontSize: '18px',
                                  textAlign: 'left',
                                }}
                              >
                                Head Office
                              </p>
                              <p
                                className="mb-1"
                                style={{
                                  fontSize: '16px',
                                  textAlign: 'left',
                                  borderRight: '1px solid #000',
                                }}
                              >
                                Robert Llewellyn Bradshaw Building
                                <br />
                                P.O. Box 79, Bay Road, Basseterre, St. Kitts
                                <br />
                                PHONE: +1 (869) 465-2535
                                <br />
                                EMAIL: pubinfo@socialsecurity.kn
                              </p>
                            </div>
                            <div className="col-6">
                              <p
                                className="mb-0"
                                style={{
                                  fontWeight: '600',
                                  fontSize: '18px',
                                  textAlign: 'left',
                                }}
                              >
                                Branch Office
                              </p>
                              <p className="mb-1" style={{ fontSize: '16px', textAlign: 'left' }}>
                                {`{Pinney's}`} Commercial Site
                                <br />
                                P.O. Box 667 Nevis
                                <br />
                                PHONE: +1 (869) 469-5245
                                <br />
                                EMAIL: nevis@socialsecurity.kn
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="receipt-number">
                          RECEIPT# <span className="amount">{data.receiptNumber || '0000001'}</span>
                        </div>
                        <table className="table table-bordered">
                          <tbody>
                            <tr className="bg-light" style={{ backgroundColor: '#f9f9f9' }}>
                              <th>Reg No.</th>
                              {/* <td>{localStorage.getItem('reG_NUMBER') || 'N/A'}</td> */}
                              <td>{data?.regNo || 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>Customer Name</th>
                              <td>{data.refCustomerName}</td>
                            </tr>
                            <tr>
                              <th>Transaction ID</th>
                              <td>{data.paymentGatewayTransactionID}</td>
                            </tr>
                            {data?.totalSscontributions != null && (
                              <tr>
                                <th>Total SS Contributions</th>
                                <td className="amount1">
                                  ${Number(data.totalSscontributions).toFixed(2)}
                                </td>
                              </tr>
                            )}

                            {data?.totalSspenalty != null && (
                              <tr>
                                <th>Total SS Penalty</th>
                                <td className="amount1">
                                  ${Number(data.totalSspenalty).toFixed(2)}
                                </td>
                              </tr>
                            )}

                            {data?.totalLeavy != null && (
                              <tr>
                                <th>Total Levy</th>
                                <td className="amount1">${Number(data.totalLeavy).toFixed(2)}</td>
                              </tr>
                            )}

                            {data?.totalLevyeepenalty != null && (
                              <tr>
                                <th>Total Levy Penalty</th>
                                <td className="amount1">
                                  ${Number(data.totalLevyeepenalty).toFixed(2)}
                                </td>
                              </tr>
                            )}

                            {data?.totalServayance != null && (
                              <tr>
                                <th>Total Severance</th>
                                <td className="amount1">
                                  ${Number(data.totalServayance).toFixed(2)}
                                </td>
                              </tr>
                            )}

                            {data?.totalPepenalty != null && (
                              <tr>
                                <th>Total PE Penalty</th>
                                <td className="amount1">
                                  ${Number(data.totalPepenalty).toFixed(2)}
                                </td>
                              </tr>
                            )}
                            <tr>
                              <th>Amount</th>
                              <td className="amount">
                                <b>${Number(data.paymentAmount).toFixed(2)}</b>
                              </td>
                            </tr>
                            <tr>
                              <th>Status</th>
                              <td
                                className={
                                  data.paymentStatus === 'AUTHORIZED' ? 'status-authorized' : ''
                                }
                              >
                                <b>{data.paymentStatus}</b>
                              </td>
                            </tr>
                            <tr>
                              <th>Period</th>
                              <td>
                                {data?.period
                                  ? moment(data.period, 'MM/YYYY').format('MMM-YYYY')
                                  : 'N/A'}
                              </td>
                            </tr>
                            <tr>
                              <th>Transaction Date</th>
                              <td>{data.createTime || 'N/A'}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="disclaimer border rounded p-3 mt-4">
                          <strong>RECEIPT DISCLAIMER:</strong>
                          <br />
                          Your Payment has been posted to your account and will be applied to any
                          past due social security contributions, levy, severance, fines and
                          penalties or against the current period liabilities.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted fs-5">Loading payment details...</p>
                  )}
                </CardBody>
              </Card>
            </div>
            <Card style={{ maxWidth: '700px', margin: 'auto', fontSize: '1.2rem' }}>
              <CardBody style={{ textAlign: 'end' }}>
                <Button
                  color="success"
                  className="h-45 btn"
                  onClick={handleDownload}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" /> Downloading...
                    </>
                  ) : (
                    'Download'
                  )}
                </Button>
                <Button
                  variant="secondary"
                  className="h-45 btn btn-light"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Close
                </Button>
              </CardBody>
            </Card>
          </>
        </ModalBody>
      </Modal>
    </>
  );
};
export default AdminReport;
