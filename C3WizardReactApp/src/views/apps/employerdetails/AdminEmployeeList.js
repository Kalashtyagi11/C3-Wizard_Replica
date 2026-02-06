import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from 'reactstrap';
import {
  deleteEmployee,
  editEmployeeList,
  getEmployeeList,
  getViewDirectorWages,
  viewDirectorWages,
} from '../../../store/apps/employee/EmployeeSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import UserManagementServices from '../../../service/user-management/UserManagementServices';

const AdminEmployeeList = () => {
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.messageReducer);
  const { state: navigationState } = useLocation();
  const [selectedValue, setSelectedValue] = useState(navigationState?.companyId || '');
  const [companyList, setCompanyList] = useState([]);
  const { EmployeeList = [] } = useSelector((state) => state.employeeSlice || {});

  const [sortColumn, setSortColumn] = useState(''); // Current column to sort
  const [sortOrder, setSortOrder] = useState('asc'); // Sorting order: 'asc' or 'desc'

  const getAllCompaniesHandler = async () => {
    setLoadingDropdown(true);
    try {
      const res = await UserManagementServices.getAllCompanyData();
      setCompanyList(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDropdown(false);
    }
  };

  useEffect(() => {
    dispatch(getEmployeeList(selectedValue));
  }, [selectedValue]);

  useEffect(() => {
    getAllCompaniesHandler();
  }, []);

  const filteredEmployeeList = EmployeeList?.filter((employee) => {
    const searchLower = searchTerm.toLowerCase();
    return employee.firstName?.toLowerCase().includes(searchLower);
  });

  const sortedEmployeeList = filteredEmployeeList.sort((a, b) => {
    if (sortColumn === 'ssn') {
      return sortOrder === 'asc'
        ? a.socSecNum.localeCompare(b.socSecNum)
        : b.socSecNum.localeCompare(a.socSecNum);
    }
    if (sortColumn === 'name') {
      return sortOrder === 'asc'
        ? a.firstName.localeCompare(b.firstName)
        : b.firstName.localeCompare(a.firstName);
    }
    if (sortColumn === 'department') {
      return sortOrder === 'asc'
        ? a.department.localeCompare(b.department)
        : b.department.localeCompare(a.department);
    }
    return 0;
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle sorting order if the same column is clicked again
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sorting column and default to ascending order
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  // Split the list into Employees and Employee Directors
  const employees = sortedEmployeeList?.filter((employee) => !employee.isemployeeDirector);
  const employeeDirectors = sortedEmployeeList?.filter((employee) => employee.isemployeeDirector);

  const options = companyList
    .filter((item) => item.companyName !== 'SSB')
    .map((item) => ({
      value: item.companyId,
      label: `${item.companyName} (${item.regNumber || 'N/A'})`, // show both companyName & regNumber
      regNumber: item.regNumber,
    }));

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption?.value || '');
  };

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

  const [editeLoad, setEditeLoad] = useState(false);
  const [editActive, seteditActive] = useState('');

  const handleAddEmployee = (employeeID) => {
    setEditeLoad(true);
    seteditActive(employeeID);
    dispatch(editEmployeeList(employeeID))
      .unwrap()
      .then((response) => {
        setEditeLoad(false);
        navigate('/apps/addEmployee/AddEmployee', { state: response.editEmployeeListResponse });
      })
      .catch((e) => {
        setEditeLoad(false);
        toast.error('Something went wrong');
      });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [deleteItem, setDelete] = useState('');

  const deleteEmplyee = (id) => {
    setIsModalOpen(!isModalOpen);
    setDelete(id);
  };

  const deleteeEmplyeeApi = () => {
    dispatch(deleteEmployee(deleteItem))
      .unwrap()
      .then((response) => {
        toast.success(response.deleteEmpResponse.message);
        dispatch(getEmployeeList(selectedValue));
        setIsModalOpen(!isModalOpen);
      });
  };

  const [showEmployees, setShowEmployees] = useState(true);
  const [showEmployeesDirectors, setShowEmployeesDirectors] = useState(true);

  useEffect(() => {
    setShowEmployees(true);
    setShowEmployeesDirectors(true);
  }, [searchTerm]);

  const [payDates, setPayDate] = useState('');
  const [amount, setAmount] = useState('');

  const [viewLoad, setViewLoad] = useState(false);
  const [viewActive, setviewActive] = useState('');
  const [viewHoliday, setViewHoliday] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [employeeSSN, setEmployeeSSN] = useState('');
  const viewToggleModal = () => {
    setViewModal(!viewModal);
    if (!viewModal) {
      // Reset form when modal opens
      setAmount('');
      setPayDate('');
    }
  };

  function setViewHolidayPay(employee) {
    setViewLoad(true);
    setviewActive(employee);
    setEmployeeSSN(employee);
    dispatch(getViewDirectorWages({ employee, CompanyId: selectedValue }))
      .unwrap()
      .then((response) => {
        console.log('viewDirectorWages response', response.getViewDirectorWagesResponse);
        setViewHoliday(response.getViewDirectorWagesResponse);
        setViewLoad(false);
        setViewModal(!viewModal);
      })
      .catch((e) => {
        setViewLoad(false);
      });
  }

  // const handleChange = (event) => {
  //   setSelectedValue(event.target.value);
  // };

  async function addDirectorWages(employee) {
    let isValid = true; // Flag to track if all conditions are valid
    if (amount === '') {
      toast.error('Please Enter an amount');
      isValid = false;
    }
    if (payDates === '') {
      toast.error('Please Enter a valid Pay Date');
      isValid = false;
    }

    // setViewLoad(false);

    if (isValid) {
      const loadDirectorWages = {
        employeeSSN,
        wHpayType: 'Director Wages',
        txt_Other: '',
        isWorkingDirector: true,
        selectedValue,
        amount,
        pay_date: moment(payDates).format('YYYY-MM-DD'),
      };

      try {
        // Dispatch the action and wait for the response
        setViewLoad(true);
        const response = await dispatch(viewDirectorWages(loadDirectorWages)).unwrap();
        console.log('addDirectorWages response', response);

        // Reset state after successful submission
        setPayDate('');
        setAmount('');

        // Dispatch getViewDirectorWages if the first dispatch was successful
        const responses = await dispatch(
          getViewDirectorWages({ employee: employeeSSN, selectedValue }),
        ).unwrap();
        console.log('viewDirectorWages response', responses.getViewDirectorWagesResponse);
        setViewHoliday(responses.getViewDirectorWagesResponse);
      } catch (error) {
        // Handle the error that occurs in either dispatch
        console.error('Error in addDirectorWages:', error);
        // toast.error(`Error: ${error.message || error}`);
      } finally {
        // Ensure the loading state is reset no matter what
        setViewLoad(false);
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Employee - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
        <sidebar-barrrrrr></sidebar-barrrrrr>
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="page-content-wrapper">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                  <ul className="d-flex align-items-center gap-2 list-unstyled">
                    <li className="fw-medium">
                      <Link
                        to="/admin-dashboard"
                        className="d-flex align-items-center gap-1 text-muted"
                      >
                        <i className="ti-home" /> Admin Dashboard{' '}
                      </Link>
                    </li>
                    <li>-</li>

                    <li className="fw-medium">Employee</li>
                  </ul>
                </div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-header py-2 bg_ligh">
                        <div className="row align-items-center d-flex">
                          <div className="col-xl-4 col-12 mb-2 mb-lg-0">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user text-success pe-2" />
                              Employee List
                            </h4>
                          </div>
                          <div className="col-xl-8 col-12 text-lg-end ">
                            {/* <select
                              value={selectedValue}
                              onChange={handleChange}
                              className="form-select d-inline w-50 mx-2 py-2"
                            >
                              <option value="" disabled>
                                Select Employer
                              </option>
                              {companyList?.map((item) => (
                                <option key={item.companyId} value={item.companyId}>
                                  {item.companyName}
                                </option>
                              ))}
                            </select> */}
                            <div className="row">
                              <div className="col-3  addition"></div>
                              <div className="col-5 text-start ">
                                {/* <Select
                                  classNamePrefix="react-select"
                                  options={options}
                                  value={options.find((opt) => opt.value === selectedValue) || null}
                                  onChange={handleChange} // <-- FIXED
                                  placeholder="Select Employer"
                                  isSearchable
                                  isClearable
                                /> */}
                                <div className="select-wrapper" style={{ minWidth: '0px' }}>
                                  <Select
                                    options={options}
                                    value={
                                      options.find((opt) => opt.value === selectedValue) || null
                                    }
                                    onChange={handleChange}
                                    placeholder="Search employer or reg number"
                                    isSearchable
                                    isClearable
                                    isLoading={false} // We use custom spinner
                                    classNamePrefix="custom-select"
                                    styles={{
                                      control: () => ({
                                        padding: '0px',
                                      }), // Disable inline styles
                                    }}
                                  />

                                  {loadingDropdown && (
                                    <Spinner size="sm" color="primary" className="select-spinner" />
                                  )}
                                </div>
                              </div>
                              <div className="col-4 addition">
                                <input
                                  type="text"
                                  className="form-control custom d-inline w-100 mb-3 mb-lg-0"
                                  placeholder="Search by employee name"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="table-container">
                          <div className="table-responsive">
                            <table className="table table-hover mb-0 white-space tableword-wrap">
                              <thead>
                                <tr className="border-b">
                                  <th scope="row">S.No.</th>
                                  <th onClick={() => handleSort('ssn')}>
                                    SSN{' '}
                                    {sortColumn === 'ssn' &&
                                      (sortOrder === 'asc' ? (
                                        <Icon.ArrowUp size={14} />
                                      ) : (
                                        <Icon.ArrowDown size={14} />
                                      ))}
                                  </th>
                                  <th onClick={() => handleSort('name')}>
                                    Name{' '}
                                    {sortColumn === 'name' &&
                                      (sortOrder === 'asc' ? (
                                        <Icon.ArrowUp size={14} />
                                      ) : (
                                        <Icon.ArrowDown size={14} />
                                      ))}
                                  </th>
                                  <th onClick={() => handleSort('department')}>
                                    Department{' '}
                                    {sortColumn === 'department' &&
                                      (sortOrder === 'asc' ? (
                                        <Icon.ArrowUp size={14} />
                                      ) : (
                                        <Icon.ArrowDown size={14} />
                                      ))}
                                  </th>
                                  <th width="10%">Address Details</th>
                                  <th style={{ minWidth: '80px' }}>Salary</th>
                                  <th>Pay Period</th>
                                  <th>Commencement Date</th>
                                  <th>Termination Date</th>
                                  <th>Is Director?</th>
                                  <th style={{ minWidth: '80px' }}>Wages</th>
                                  <th style={{ minWidth: '100px' }}>Edit</th>
                                  <th>Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* Employees Section */}
                                {employees.length > 0 ? (
                                  <tr>
                                    <td colSpan="13" className="bg-light">
                                      <div
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                        }}
                                      >
                                        <strong>Employees</strong>
                                        <button
                                          type="button"
                                          onClick={() => setShowEmployees(!showEmployees)}
                                          style={{ background: 'none', border: 'none' }}
                                        >
                                          {showEmployees ? (
                                            <Icon.ArrowUpCircle size={20} />
                                          ) : (
                                            <Icon.ArrowDownCircle size={20} />
                                          )}
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ) : null}

                                {showEmployees
                                  ? employees && employees.length > 0
                                    ? employees.map((item, index) => (
                                        <tr key={item.employeeID}>
                                          <td>{index + 1}</td>
                                          <td>{item?.socSecNum}</td>
                                          <td>{item.firstName}</td>
                                          <td>{item.department}</td>
                                          <td>{item.address1 ? item.address1 : 'N/A'}</td>
                                          {/* <td>${item.wadeg}</td> */}
                                          <td>${Number(item.wadeg || 0).toFixed(2)}</td>

                                          <td>{item.payPeriod}</td>
                                          <td>
                                            {item.appintDate
                                              ? moment(item.appintDate).format('DD-MMM-YYYY')
                                              : 'N/A'}
                                          </td>
                                          <td>
                                            {item.terminated
                                              ? moment(item.terminated).format('DD-MMM-YYYY')
                                              : 'N/A'}
                                          </td>
                                          <td>
                                            {item.isemployeeDirector === true ? (
                                              <i className="fa fa-check-circle text-success" />
                                            ) : (
                                              <i className="fa fa-times-circle text-danger" />
                                            )}
                                          </td>
                                          <td>
                                            <b>$</b>

                                            {Number(item.wage_Amt || 0).toFixed(2)}
                                          </td>
                                          <td>
                                            <a
                                              className="text-decoration-none"
                                              onClick={() => handleAddEmployee(item.employeeID)}
                                            >
                                              <span
                                                className="badge text-success"
                                                style={{
                                                  border: '1px solid #119310',
                                                  padding: '5px 5px',
                                                }}
                                              >
                                                {editeLoad && editActive === item.employeeID ? (
                                                  <Spinner color="success" size="sm">
                                                    Loading...
                                                  </Spinner>
                                                ) : (
                                                  <Icon.Edit size={20} />
                                                )}
                                              </span>
                                            </a>

                                            {/* <button
                                            type="button"
                                            className="badge  text-success  p-1"
                                            aria-hidden="true"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            data-bs-original-title="wages Pay"
                                            onClick={() =>
                                              setViewHolidayPay(
                                                `${item.socSecNum}(${item.firstName})`,
                                              )
                                            }
                                            style={{
                                              marginLeft: 5,
                                              width: '32px',
                                              border: '1px solid #00c292',
                                              background: 'none',
                                              cursor: 'pointer',
                                            }}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 576 512"
                                              fill="#00c292"
                                            >
                                              <path d="M312 24l0 10.5c6.4 1.2 12.6 2.7 18.2 4.2c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17c-10.9-2.9-21.1-4.9-30.2-5c-7.3-.1-14.7 1.7-19.4 4.4c-2.1 1.3-3.1 2.4-3.5 3c-.3 .5-.7 1.2-.7 2.8c0 .3 0 .5 0 .6c.2 .2 .9 1.2 3.3 2.6c5.8 3.5 14.4 6.2 27.4 10.1l.9 .3s0 0 0 0c11.1 3.3 25.9 7.8 37.9 15.3c13.7 8.6 26.1 22.9 26.4 44.9c.3 22.5-11.4 38.9-26.7 48.5c-6.7 4.1-13.9 7-21.3 8.8l0 10.6c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-11.4c-9.5-2.3-18.2-5.3-25.6-7.8c-2.1-.7-4.1-1.4-6-2c-12.6-4.2-19.4-17.8-15.2-30.4s17.8-19.4 30.4-15.2c2.6 .9 5 1.7 7.3 2.5c13.6 4.6 23.4 7.9 33.9 8.3c8 .3 15.1-1.6 19.2-4.1c1.9-1.2 2.8-2.2 3.2-2.9c.4-.6 .9-1.8 .8-4.1l0-.2c0-1 0-2.1-4-4.6c-5.7-3.6-14.3-6.4-27.1-10.3l-1.9-.6c-10.8-3.2-25-7.5-36.4-14.4c-13.5-8.1-26.5-22-26.6-44.1c-.1-22.9 12.9-38.6 27.7-47.4c6.4-3.8 13.3-6.4 20.2-8.2L264 24c0-13.3 10.7-24 24-24s24 10.7 24 24zM568.2 336.3c13.1 17.8 9.3 42.8-8.5 55.9L433.1 485.5c-23.4 17.2-51.6 26.5-80.7 26.5L192 512 32 512c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l36.8 0 44.9-36c22.7-18.2 50.9-28 80-28l78.3 0 16 0 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0-16 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l120.6 0 119.7-88.2c17.8-13.1 42.8-9.3 55.9 8.5zM193.6 384c0 0 0 0 0 0l-.9 0c.3 0 .6 0 .9 0z" />
                                            </svg>
                                          </button> */}
                                          </td>
                                          <td>
                                            <button
                                              type="button"
                                              className="badge bg-soft-danger text-danger"
                                              onClick={() => deleteEmplyee(item.employeeID)}
                                            >
                                              <Icon.Trash size={20} />
                                            </button>
                                          </td>
                                        </tr>
                                      ))
                                    : null
                                  : null}

                                {/* Employee Directors Section */}
                                {employeeDirectors.length > 0 ? (
                                  <tr>
                                    <td colSpan="13" className="bg-light">
                                      <div
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                        }}
                                      >
                                        <strong>Employee Directors</strong>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setShowEmployeesDirectors(!showEmployeesDirectors)
                                          }
                                          style={{ background: 'none', border: 'none' }}
                                        >
                                          {showEmployeesDirectors ? (
                                            <Icon.ArrowUpCircle size={20} />
                                          ) : (
                                            <Icon.ArrowDownCircle size={20} />
                                          )}
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ) : null}

                                {showEmployeesDirectors
                                  ? employeeDirectors && employeeDirectors.length > 0
                                    ? employeeDirectors.map((item, index) => (
                                        <tr key={item.employeeID}>
                                          <td>{index + 1}</td>
                                          <td>{item?.socSecNum}</td>
                                          <td>{item.firstName}</td>
                                          <td>{item.department}</td>
                                          <td>{item.address1 ? item.address1 : 'N/A'}</td>
                                          <td>${Number(item.wadeg || 0).toFixed(2)}</td>

                                          <td>{item.payPeriod}</td>
                                          <td>
                                            {item.appintDate
                                              ? moment(item.appintDate).format('DD-MMM-YYYY')
                                              : 'N/A'}
                                          </td>
                                          <td>
                                            {item.terminated
                                              ? moment(item.terminated).format('DD-MMM-YYYY')
                                              : 'N/A'}
                                          </td>
                                          <td>
                                            {item.isemployeeDirector === true ? (
                                              <i className="fa fa-check-circle text-success" />
                                            ) : (
                                              <i className="fa fa-times-circle text-danger" />
                                            )}
                                          </td>
                                          <td>
                                            <b>$</b>
                                            {/* {item.wadeg} */}
                                            {Number(item.wage_Amt || 0).toFixed(2)}
                                          </td>
                                          <td>
                                            <a
                                              className="text-decoration-none"
                                              onClick={() => handleAddEmployee(item.employeeID)}
                                            >
                                              <span
                                                className="badge text-success"
                                                style={{
                                                  border: '1px solid #119310',
                                                  padding: '5px 5px',
                                                }}
                                              >
                                                {editeLoad && editActive === item.employeeID ? (
                                                  <Spinner color="success" size="sm">
                                                    Loading...
                                                  </Spinner>
                                                ) : (
                                                  <Icon.Edit size={20} />
                                                )}
                                              </span>
                                            </a>

                                            <button
                                              type="button"
                                              className="badge  text-success  p-1"
                                              aria-hidden="true"
                                              data-bs-toggle="tooltip"
                                              data-bs-placement="top"
                                              data-bs-original-title="wages Pay"
                                              onClick={() =>
                                                setViewHolidayPay(
                                                  `${item.socSecNum}(${item.firstName})`,
                                                )
                                              }
                                              style={{
                                                marginLeft: 5,
                                                width: '32px',
                                                border: '1px solid #00c292',
                                                background: 'none',
                                                cursor: 'pointer',
                                              }}
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 576 512"
                                                fill="#00c292"
                                              >
                                                <path d="M312 24l0 10.5c6.4 1.2 12.6 2.7 18.2 4.2c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17c-10.9-2.9-21.1-4.9-30.2-5c-7.3-.1-14.7 1.7-19.4 4.4c-2.1 1.3-3.1 2.4-3.5 3c-.3 .5-.7 1.2-.7 2.8c0 .3 0 .5 0 .6c.2 .2 .9 1.2 3.3 2.6c5.8 3.5 14.4 6.2 27.4 10.1l.9 .3s0 0 0 0c11.1 3.3 25.9 7.8 37.9 15.3c13.7 8.6 26.1 22.9 26.4 44.9c.3 22.5-11.4 38.9-26.7 48.5c-6.7 4.1-13.9 7-21.3 8.8l0 10.6c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-11.4c-9.5-2.3-18.2-5.3-25.6-7.8c-2.1-.7-4.1-1.4-6-2c-12.6-4.2-19.4-17.8-15.2-30.4s17.8-19.4 30.4-15.2c2.6 .9 5 1.7 7.3 2.5c13.6 4.6 23.4 7.9 33.9 8.3c8 .3 15.1-1.6 19.2-4.1c1.9-1.2 2.8-2.2 3.2-2.9c.4-.6 .9-1.8 .8-4.1l0-.2c0-1 0-2.1-4-4.6c-5.7-3.6-14.3-6.4-27.1-10.3l-1.9-.6c-10.8-3.2-25-7.5-36.4-14.4c-13.5-8.1-26.5-22-26.6-44.1c-.1-22.9 12.9-38.6 27.7-47.4c6.4-3.8 13.3-6.4 20.2-8.2L264 24c0-13.3 10.7-24 24-24s24 10.7 24 24zM568.2 336.3c13.1 17.8 9.3 42.8-8.5 55.9L433.1 485.5c-23.4 17.2-51.6 26.5-80.7 26.5L192 512 32 512c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l36.8 0 44.9-36c22.7-18.2 50.9-28 80-28l78.3 0 16 0 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0-16 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l120.6 0 119.7-88.2c17.8-13.1 42.8-9.3 55.9 8.5zM193.6 384c0 0 0 0 0 0l-.9 0c.3 0 .6 0 .9 0z" />
                                              </svg>
                                            </button>
                                          </td>
                                          <td>
                                            <button
                                              type="button"
                                              className="badge bg-soft-danger text-danger"
                                              onClick={() => deleteEmplyee(item.employeeID)}
                                            >
                                              <Icon.Trash size={20} />
                                            </button>
                                          </td>
                                        </tr>
                                      ))
                                    : null
                                  : null}

                                {sortedEmployeeList.length === 0 ? (
                                  <tr>
                                    <td colSpan="13" className="text-center">
                                      No record found
                                    </td>
                                  </tr>
                                ) : null}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Modal isOpen={isModalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Confirm Action</ModalHeader>
                <ModalBody>Are you sure you want to permanently delete this Employee?</ModalBody>
                <ModalFooter>
                  <Button color="secondary" className="btn-light" onClick={toggleModal}>
                    No
                  </Button>
                  <Button color="primary" onClick={deleteeEmplyeeApi}>
                    Yes
                  </Button>
                </ModalFooter>
              </Modal>

              <Modal isOpen={viewModal} toggle={viewToggleModal}>
                <ModalHeader toggle={viewToggleModal}>
                  <b>View Holiday Pay Date</b>
                </ModalHeader>
                <ModalBody>
                  <Row className="mb-2">
                    <Col md="6">
                      <Label for="amount">Amount</Label>
                      <Input
                        type="text"
                        id="amount"
                        value={amount}
                        maxLength="10"
                        onChange={({ target: { value } }) => {
                          // Prevent alphabetic characters from being entered
                          if (/[a-zA-Z]/.test(value)) {
                            return; // Exit if any alphabetic characters are detected
                          }

                          // Remove non-numeric characters except for the decimal
                          const cleanedValue = value.replace(/[^0-9.]/g, '');

                          // Insert decimal point after 6 digits if there are more than 6 digits
                          let formattedValue = cleanedValue;
                          if (cleanedValue.length > 6 && !cleanedValue.includes('.')) {
                            formattedValue = `${cleanedValue.slice(0, 6)}.${cleanedValue.slice(
                              6,
                              8,
                            )}`; // Insert decimal after 6 digits
                          }

                          // Limit to 6 digits before the decimal and 2 digits after
                          const regex = /^(\d{0,6})(\.\d{0,2})?$/;
                          if (regex.test(formattedValue)) {
                            setAmount(formattedValue);
                          }
                        }}
                      />
                    </Col>
                    <Col md="6">
                      <Label for="paymentDate">Payment Date</Label>
                      {/* <Input
                        type="date"
                        id="payDate"
                        value={payDates}
                        onChange={(e) => setPayDate(e.target.value)}
                      /> */}
                      <DatePicker
                        selected={payDates}
                        className="form-control"
                        onChange={(date) => setPayDate(date)}
                        dateFormat="dd-MMM-yyyy"
                        placeholderText="dd-mmm-yyyy"
                      />
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md="12">
                      <Button
                        type="button"
                        color="success"
                        className="px-4 me-3 w-100"
                        onClick={addDirectorWages}
                        disabled={viewLoad} // Disable button while loading
                      >
                        {viewLoad ? (
                          <>
                            <Spinner size="sm"> Loading...</Spinner> Saving
                          </>
                        ) : (
                          <>
                            <i className="far fa-save pe-1" /> Save
                          </>
                        )}
                      </Button>
                    </Col>
                  </Row>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0 white-space  tableword-wrap">
                      <thead>
                        <tr className="border-b">
                          <th>From Date</th>
                          <th>To Date</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewHoliday !== null && viewHoliday.length > 0
                          ? viewHoliday.map((item, index) => (
                              <tr>
                                {/* <td>{item.st_Date}</td> */}
                                <td>
                                  {/* {item.st_Date
                                    ? moment(item.st_Date).format('DD-MMM-YYYY')
                                    : 'N/A'} */}
                                  <td>
                                    {moment(item.st_Date, 'DD-MM-YYYY').format('DD-MMM-YYYY')}
                                  </td>
                                </td>

                                <td>{moment(item.en_Date, 'DD-MM-YYYY').format('DD-MMM-YYYY')}</td>

                                {/* <td>{item.en_Date}</td> */}
                                <td>{item.amount}</td>
                              </tr>
                            ))
                          : null}
                      </tbody>
                    </table>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={viewToggleModal}>
                    ok
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminEmployeeList;
