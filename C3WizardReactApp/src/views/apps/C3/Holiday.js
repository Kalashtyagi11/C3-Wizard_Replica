import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
} from 'reactstrap';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Icon from 'react-feather';
import Loader from '../../../layouts/loader/Loader';
import {
  deleteHoliday,
  editHoliday,
  employeeAndWokingEmployeelist,
  getAllHolidayPayById,
  getHoliday,
  saveHoliday,
} from '../../../store/apps/cGeneration/holiday';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';

const Holiday = () => {
  const [modal, setModal] = useState(false);
  const CompanyId = localStorage.getItem('companyId');

  const dispatch = useDispatch();

  const { HolidayList, EmployeeAndWokinglist, loading } = useSelector(
    (state) => state.holidaySlice || {},
  );

  useEffect(() => {
    dispatch(getHoliday(CompanyId));
  }, []);

 
  const { message, type } = useSelector((state) => state.messageReducer);
  const [isWorkingDirector, setisWorkingDirector] = useState(false);
  const [empName, setEmpName] = useState('');
  const [holidayPayWithLeave, setHolidayPayWithLeave] = useState(true);
  const [leaveType, setLeaveType] = useState('');
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [payDate, setPayDate] = useState(null);
  const [descother, setDescother] = useState('');
  const [holidaypayId, setholidaypayId] = useState(0);
  const [sortColumn, setSortColumn] = useState(''); // Current column to sort
  const [sortOrder, setSortOrder] = useState('asc'); // Sorting order: 'asc' or 'desc'
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'HOLIDAY/OTHER PAYMENT');
  const canAddHoliday = employerPermission?.addPermission;
  const canEditHoliday = employerPermission?.updatePermission;
  const canDeleteHoliday = employerPermission?.deletePermission;
  const canViewHoliday = employerPermission?.viewPermission;

  useEffect(() => {
    if (canViewHoliday === false) {
      navigate('/login');
    }
  }, [canViewHoliday, navigate]);

  useEffect(() => {
    dispatch(
      employeeAndWokingEmployeelist({ CompanyId, isEmployeeDirector: isWorkingDirector ? 1 : 0 }),
    );
  }, [isWorkingDirector]);

  // Sorting logic
  const sortedHolidayList = [...HolidayList].sort((a, b) => {
    if (sortColumn === 'ssn') {
      const aValue = String(a.employeeID || ''); // Convert to string, default to empty string if null/undefined
      const bValue = String(b.employeeID || '');
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    if (sortColumn === 'name') {
      const aValue = String(a.employeename || ''); // Convert to string, default to empty string if null/undefined
      const bValue = String(b.employeename || '');
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return 0;
  });

  // Utility function to handle dates without timezone issues
  const formatDateForAPI = (date) => {
    if (!date) return null;
    // Use moment to format in YYYY-MM-DD without timezone conversion
    return moment(date).format('YYYY-MM-DD');
  };

  const handleDateChange = (date) => {
    setPayDate(date); // Store as Date object
  };

  const [suggestedToDate, setSuggestedToDate] = useState(null);

  const handleDateChange1 = (date) => {
    if (!date) {
      setFromDate(null);
      setToDate(null);
      setSuggestedToDate(null);
      return;
    }

    const selectedDate = moment(date);
    setFromDate(date); // Store as Date object

    if (selectedDate.date() >= 1 && selectedDate.date() <= 29) {
      // For days 1–29 → same month
      setSuggestedToDate(selectedDate.clone().toDate());
    } else if (selectedDate.date() === 30 || selectedDate.date() === 31) {
      let suggestion = selectedDate.clone().add(1, 'month');

      // if next month doesn't have 31 → fallback to 30
      if (selectedDate.date() === 31 && suggestion.date() !== 31) {
        suggestion = suggestion.date(30);
      }

      setSuggestedToDate(suggestion.toDate());
    } else {
      // otherwise don't suggest anything
      setSuggestedToDate(null);
    }
  };

  const handleToDateChange2 = (date) => {
    setToDate(date); // Store as Date object
  };

  // Handle column sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const [isEdit, setIsEdit] = useState(false);
  const toggle = () => {
    setisWorkingDirector(false);
    setEmpName('');
    setHolidayPayWithLeave(true);
    setLeaveType('');
    setAmount('');
    setFromDate(null);
    setToDate(null);
    setPayDate(null);
    setDescother('');
    setModal(!modal);
    setIsEdit(false);
    setholidaypayId(0);
  };

  const apiLoad = {
    holidaypayId,
    emp_Name: empName,
    descother,
    holidayPayWithLeave,
    leaveType,
    from_date: formatDateForAPI(fromDate),
    to_date: formatDateForAPI(toDate),
    isWorkingDirector,
    payDate: formatDateForAPI(payDate),
    holidayPayLeaveOther: !holidayPayWithLeave,
    amount,
    companyId: CompanyId,
    employeinmode: 2,
  };
  const [load, setLoad] = useState(false);
  function holidaySave() {
    let isValid = true; // Flag to track if all conditions are valid

    if (empName === '') {
      toast.error('Please Select an Employee');
      isValid = false;
    }

    if (holidayPayWithLeave) {
      if (amount === '') {
        toast.error('Please Enter an amount');
        isValid = false;
      }

      if (!fromDate || !toDate) {
        toast.error('Please Enter a From Date & To Date');
        isValid = false;
      } else if (new Date(fromDate) > new Date(toDate)) {
        toast.error('From Date cannot be greater than To Date');
        isValid = false;
      }
    } else {
      if (leaveType === '') {
        toast.error('Please Select leave Type');
        isValid = false;
      }

      if (amount === '') {
        toast.error('Please Enter an amount');
        isValid = false;
      }

      if (payDate === null) {
        toast.error('Please Enter a valid Pay Date');
        isValid = false;
      }
    }

    // If all conditions are valid, make the API call
    if (isValid) {
      setLoad(true);
     
      dispatch(saveHoliday(apiLoad))
        .unwrap()
        .then((response) => {
          
          toast.success(response.saveHolidayResponse.message);
          dispatch(getHoliday(CompanyId));
          toggle();
          setLoad(false);
        });
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const onConfirm = () => {
  
    toggleModal(); // Close the modal after confirmation
  };

  const onCancel = () => {
  
    toggleModal(); // Close the modal after cancellation
  };
  const [deleteItem, setDelete] = useState('');

  function deleteHolidayModal(id) {
    setIsModalOpen(!isModalOpen);
    setDelete(id);
   
  }

  function deleteHolidayApi() {
    dispatch(deleteHoliday(deleteItem))
      .unwrap()
      .then((response) => {
        const res = response.deleteHolidayResponse;
        if (res.statuscode === 400 || res.status === false) {
          toast.warn(res.message || 'Warning');
          setIsModalOpen(false);
          return;
        }
        toast.success(response.deleteHolidayResponse.message);
        dispatch(getHoliday(CompanyId));

        setIsModalOpen(false);
      });
  }

  const [editeLoad, setEditeLoad] = useState(false);
  const [editActive, seteditActive] = useState('');

  function setHolidayData(holidayPayId) {
    setEditeLoad(true);
    seteditActive(holidayPayId);
    setIsEdit(true);

    dispatch(getAllHolidayPayById({ holidayPayId, CompanyId, holidayPayView: false }))
      .unwrap()
      .then((response) => {
        if (
          response?.HolidayPayByIdResponse?.status === false ||
          response?.HolidayPayByIdResponse?.statuscode === 400
        ) {
          toast.warn(response?.HolidayPayByIdResponse?.message || 'Warning');
          setEditeLoad(false);
          setIsEdit(false);
          return; // stop further processing
        }
        setisWorkingDirector(response.HolidayPayByIdResponse.isWorkingDirector);
        setEmpName(response.HolidayPayByIdResponse.emp_Name);
        setHolidayPayWithLeave(response.HolidayPayByIdResponse.holidayPayWithLeave);
        setLeaveType(response.HolidayPayByIdResponse.leaveType);
        setAmount(response.HolidayPayByIdResponse.amount);
        setFromDate(
          response.HolidayPayByIdResponse.from_date
            ? new Date(response.HolidayPayByIdResponse.from_date)
            : null,
        );
        setToDate(
          response.HolidayPayByIdResponse.to_date
            ? new Date(response.HolidayPayByIdResponse.to_date)
            : null,
        );
        setPayDate(
          response.HolidayPayByIdResponse.payDate
            ? new Date(response.HolidayPayByIdResponse.payDate)
            : null,
        );
        setDescother(response.HolidayPayByIdResponse.descother);
        setholidaypayId(response.HolidayPayByIdResponse.holidayPayId);
        setEditeLoad(false);

        setModal(!modal);
      })
      .catch((e) => {
        setEditeLoad(false);
        setIsEdit(false);
      });
  }

  const [viewLoad, setViewLoad] = useState(false);
  const [viewActive, setviewActive] = useState('');
  const [viewHoliday, setViewHoliday] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const viewToggleModal = () => setViewModal(!viewModal);

  function setViewHolidayPay(holidayPayId) {

    setViewLoad(true);
    setviewActive(holidayPayId);

    dispatch(getAllHolidayPayById({ holidayPayId, CompanyId, holidayPayView: true }))
      .unwrap()
      .then((response) => {
     
        setViewHoliday(response.HolidayPayByIdResponse.holiday_Pay_Date);
        setViewLoad(false);
        setViewModal(!viewModal);
      })
      .catch((e) => {
        setViewLoad(false);
      });
  }

  function editHolidayData() {
    let isValid = true; // Flag to track if all conditions are valid

    if (!empName || empName === 'Select Employee' || empName.trim() === '') {
      toast.error('Please Select an Employee');
      isValid = false;
    }

    if (holidayPayWithLeave) {
      if (amount === '') {
        toast.error('Please Enter an amount');
        isValid = false;
      }

      if (fromDate === null || toDate === null) {
        toast.error('Please Enter a from Date & To Date');
        isValid = false;
      } else if (new Date(fromDate) > new Date(toDate)) {
        toast.error('From Date cannot be greater than To Date');
        isValid = false;
      }
    } else {
      if (!leaveType || leaveType === 'Select') {
        toast.error('Please Select Leave Type');
        isValid = false;
      }

      if (amount === '') {
        toast.error('Please Enter an amount');
        isValid = false;
      }

      if (payDate === null) {
        toast.error('Please Enter a valid Pay Date');
        isValid = false;
      }

      if (leaveType === '') {
        toast.error('Please select a Type');
        isValid = false;
      }
    }

    // If all conditions are valid, make the API call
    if (isValid) {
      setLoad(true);
      dispatch(editHoliday(apiLoad))
        .unwrap()
        .then((response) => {
         
          setholidaypayId(0);
          toast.success(response.editHolidayResponse.message);
          dispatch(getHoliday(CompanyId));
          toggle();
          setLoad(false);
        })
        .catch((e) => {
          toast.success('something went wrong');
          setIsEdit(false);
        });
    }
  }

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

  return (
    <>
      <Helmet>
        <title>Holiday - C3Wizard</title>
      </Helmet>

      <div id="layout-wrapper">
        <my-header />
        <sidebar-barrrrrr></sidebar-barrrrrr>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
              <ul className="d-flex align-items-center gap-2 mt-3 list-unstyled">
                <li className="fw-medium">
                  <Link to="/dashboard" className="d-flex align-items-center gap-1 text-muted">
                    <i className="ti-home" />
                    Dashboard{' '}
                  </Link>
                </li>
                <li>-</li>
                <li className="fw-medium">
                  <span className="d-flex align-items-center gap-1 text-muted">C3</span>
                </li>
                <li>-</li>
                <li className="fw-medium"> Holiday </li>
              </ul>
            </div>
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header py-2 bg_ligh">
                          <div className="d-flex justify-content-between">
                            <h4 className="header-title mb-0 text-success mt-2">
                              <i className="far fa-user text-success pe-2" />
                              Holiday Payment List
                            </h4>
                            {canAddHoliday ? (
                              <Button color="success" onClick={toggle}>
                                <i className="fas fa-plus pe-1" /> Add Holiday/ Other Pay
                              </Button>
                            ) : (
                              <button
                                className="btn btn-secondary h-45"
                                type="button"
                                disabled
                                style={{ opacity: 0.6 }}
                              >
                                <i className="fas fa-plus pe-1"></i> Add Holiday/ Other Pay
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="table-responsive">
                            {/* Table content */}
                            <table className="table table-hover mb-0 white-space  tableword-wrap">
                              <thead>
                                <tr className="border-b">
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
                                    Employee Name{' '}
                                    {sortColumn === 'name' &&
                                      (sortOrder === 'asc' ? (
                                        <Icon.ArrowUp size={14} />
                                      ) : (
                                        <Icon.ArrowDown size={14} />
                                      ))}
                                  </th>
                                  <th>From Date</th>
                                  <th>To Date</th>
                                  <th className="td-text-align1">Amount</th>
                                  <th className="td-pl-2">Payment Description</th>
                                  <th>Is Director?</th>
                                  <th>View Pay Date</th>
                                  <th>Edit</th>
                                  <th>Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* Example Rows */}
                                {sortedHolidayList.length > 0 ? (
                                  sortedHolidayList.map((item) => (
                                    <tr>
                                      <td>{item.employeeID}</td>
                                      <td>{item.employeename}</td>
                                      <td>
                                        {moment(item.st_Date, 'DD-MM-YYYY').isValid()
                                          ? moment(item.st_Date, 'DD-MM-YYYY').format('DD-MMM-YYYY')
                                          : 'N/A'}
                                      </td>

                                      <td>
                                        {moment(item.en_Date, 'DD-MM-YYYY').isValid()
                                          ? moment(item.en_Date, 'DD-MM-YYYY').format('DD-MMM-YYYY')
                                          : 'N/A'}
                                      </td>

                                      <td className="td-text-align1">
                                        ${item.amount?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-pl-2">{item.otherHpaydes}</td>
                                      <td>
                                        {item.emptype === 'True' ? (
                                          <i
                                            className="mdi mdi-check-circle text-success "
                                            aria-hidden="true"
                                          />
                                        ) : (
                                          <i
                                            className="fa fa-times-circle text-danger"
                                            aria-hidden="true"
                                          />
                                        )}
                                      </td>
                                      <td>
                                        <a className="text-decoration-none">
                                          <span className="badge bg-soft-primary text-primary f-18">
                                            {viewLoad && viewActive === item.holidayPayId ? (
                                              <Spinner color="success" size="sm">
                                                Loading...
                                              </Spinner>
                                            ) : (
                                              <i
                                                className="fas fa-eye"
                                                onClick={() => setViewHolidayPay(item.holidayPayId)}
                                              />
                                            )}
                                          </span>
                                        </a>
                                      </td>
                                      <td>
                                        {canEditHoliday ? (
                                          <a className="text-decoration-none">
                                            <span
                                              className="badge text-success"
                                              style={{
                                                border: '1px solid #119310',
                                                padding: '5px 5px',
                                              }}
                                            >
                                              {editeLoad && editActive === item.holidayPayId ? (
                                                <Spinner color="success" size="sm">
                                                  Loading...
                                                </Spinner>
                                              ) : (
                                                <Icon.Edit
                                                  size={20}
                                                  onClick={() => setHolidayData(item.holidayPayId)}
                                                />
                                              )}
                                            </span>
                                          </a>
                                        ) : (
                                          <span
                                            className="badge bg-soft-secondary text-muted"
                                            title="No permission to edit"
                                            style={{ cursor: 'not-allowed', opacity: 0.6 }}
                                          >
                                            <Icon.Edit size={20} />
                                          </span>
                                        )}
                                      </td>
                                      <td>
                                        {canDeleteHoliday ? (
                                          <button
                                            onClick={() => deleteHolidayModal(item.holidayPayId)}
                                            type="button"
                                            className="badge bg-soft-danger text-danger"
                                          >
                                            <Icon.Trash size={20} />
                                          </button>
                                        ) : (
                                          <span
                                            className="badge bg-soft-secondary text-muted"
                                            aria-hidden="true"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            aria-label="Delete"
                                            data-bs-original-title="No permission"
                                            style={{ opacity: 0.5, pointerEvents: 'none' }}
                                          >
                                            <i className="ti-trash f-20"></i>
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="8" className="text-center">
                                      No records found
                                    </td>
                                  </tr>
                                )}

                                {/* Add more rows as needed */}
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
          </>
        )}

        {/* Modal */}
        <Modal isOpen={modal} toggle={toggle} size="lg">
          <ModalHeader toggle={toggle}>Employee Holiday/Other Pay</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label>Working Director?</Label>
                <div>
                  <Input
                    type="checkbox"
                    id="isDirector"
                    checked={isWorkingDirector}
                    disabled={isEdit}
                    onChange={(e) => {
                      setisWorkingDirector(e.target.checked);
                      if (!e.target.checked) {
                        setEmpName('');
                      }
                    }}
                  />
                  <Label for="isDirector" className="ms-2">
                    Yes
                  </Label>
                </div>
              </FormGroup>
              <FormGroup>
                <Label for="employee">
                  Employee <span className="text-danger">*</span>
                </Label>
                <Autocomplete
                  id="employee"
                  disabled={isEdit}
                  size="small"
                  options={EmployeeAndWokinglist || []}
                  getOptionLabel={(option) => option.name || ''}
                  value={EmployeeAndWokinglist?.find((item) => item.name === empName) || null}
                  onChange={(event, newValue) => setEmpName(newValue ? newValue.name : '')}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Employee" variant="outlined" />
                  )}
                  style={{ background: '#fff' }}
                />
              </FormGroup>
              <div className="row">
                <div className="col-xl-6">
                  <FormGroup>
                    <Label>Holiday Pay with Leave</Label>
                    <div>
                      <Input
                        type="radio"
                        id="holidayPayYes"
                        name="holidayPay"
                        checked={holidayPayWithLeave === true}
                        onChange={(e) =>
                          e.target.checked
                            ? setHolidayPayWithLeave(true)
                            : setHolidayPayWithLeave(false)
                        }
                      />
                      <Label for="holidayPayYes" className="ms-2">
                        Yes
                      </Label>
                    </div>
                  </FormGroup>
                </div>
                <div className="col-xl-6">
                  <FormGroup>
                    <Label>Other</Label>
                    <div>
                      <Input
                        type="radio"
                        id="holidayPayNo"
                        name="holidayPay"
                        checked={holidayPayWithLeave === false}
                        onChange={(e) => (e.target.checked ? setHolidayPayWithLeave(false) : null)}
                      />
                      <Label for="holidayPayNo" className="ms-2">
                        Yes
                      </Label>
                    </div>
                  </FormGroup>
                </div>
              </div>
              {holidayPayWithLeave === false ? (
                <FormGroup>
                  <Label for="employee">
                    Type<span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="select"
                    className="form-control"
                    id="leaveType"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                  >
                    <option>Select </option>
                    <option value="Leave Without Pay">Leave Without Pay</option>
                    <option value="Service Charge">Service Charge</option>
                    {isWorkingDirector === true ? (
                      <option value="Director Wages">Director Wages</option>
                    ) : null}
                    <option value="Commission">Commission</option>
                    <option value="Other">Other</option>
                  </Input>
                </FormGroup>
              ) : null}

              <FormGroup>
                <Label for="amount">
                  Amount<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={({ target: { value } }) => {
                    if (/[a-zA-Z]/.test(value)) {
                      return;
                    }

                    const cleanedValue = value.replace(/[^0-9.]/g, '');

                    let formattedValue = cleanedValue;
                    if (cleanedValue.length > 6 && !cleanedValue.includes('.')) {
                      formattedValue = `${cleanedValue.slice(0, 6)}.${cleanedValue.slice(6, 8)}`;
                    }

                    const regex = /^(\d{0,6})(\.\d{0,2})?$/;
                    if (regex.test(formattedValue)) {
                      setAmount(formattedValue);
                    }
                  }}
                />
              </FormGroup>

              {holidayPayWithLeave === false ? (
                <>
                  <FormGroup>
                    <Label for="toDate">
                      Pay Date <span className="text-danger">*</span>
                    </Label>
                    <DatePicker
                      selected={payDate}
                      onChange={handleDateChange}
                      dateFormat="dd-MMM-yyyy"
                      maxDate={new Date()}
                      className="form-control"
                      isClearable
                      placeholderText="dd-mmm-yyyy"
                      showMonthDropdown
                      showYearDropdown
                      yearDropdownItemNumber={15}
                      scrollableYearDropdown
                      dropdownMode="select"
                    />
                  </FormGroup>
                  {leaveType === 'Other' ? (
                    <FormGroup>
                      <Label for="description">Payment Description</Label>
                      <Input
                        type="textarea"
                        id="description"
                        value={descother}
                        onChange={(e) => setDescother(e.target.value)}
                      />
                    </FormGroup>
                  ) : null}
                </>
              ) : (
                <>
                  <FormGroup>
                    <Label for="fromDate">
                      From Date<span className="text-danger">*</span>
                    </Label>
                    <DatePicker
                      selected={fromDate}
                      onChange={handleDateChange1}
                      dateFormat="dd-MMM-yyyy"
                      className="form-control"
                      placeholderText="dd-mmm-yyyy"
                      showMonthDropdown
                      showYearDropdown
                      yearDropdownItemNumber={15}
                      scrollableYearDropdown
                      dropdownMode="select"
                      isClearable
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="toDate">
                      To Date<span className="text-danger">*</span>
                    </Label>
                    <DatePicker
                      selected={toDate}
                      onChange={handleToDateChange2}
                      openToDate={suggestedToDate}
                      dateFormat="dd-MMM-yyyy"
                      minDate={fromDate}
                      className="form-control"
                      placeholderText="dd-mmm-yyyy"
                      showMonthDropdown
                      showYearDropdown
                      yearDropdownItemNumber={15}
                      scrollableYearDropdown
                      dropdownMode="select"
                      isClearable
                    />
                  </FormGroup>
                </>
              )}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              disabled={load}
              onClick={() => (isEdit ? editHolidayData() : holidaySave())}
            >
              {load ? (
                <>
                  <Spinner size="sm"> Loading...</Spinner> Saving
                </>
              ) : (
                <>
                  <i className="far fa-save pe-1" /> Save
                </>
              )}
            </Button>
            <Button color="secondary" className="h-45 btn btn-light" onClick={toggle}>
              <i className="fas fa-times"></i> Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={isModalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Confirm Action</ModalHeader>
          <ModalBody>Are you sure you want to permanently delete this Holiday?</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={onCancel}>
              No
            </Button>
            <Button color="primary" onClick={deleteHolidayApi}>
              Yes
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={viewModal} toggle={viewToggleModal}>
          <ModalHeader toggle={viewToggleModal}>
            <b>View Holiday Pay Date</b>
          </ModalHeader>
          <ModalBody>
            <div className="table-responsive">
              <table className="table table-hover mb-0 white-space  tableword-wrap">
                <thead>
                  <tr className="border-b">
                    <th>S.No.</th>
                    <th className="td-text-align1">Amount</th>
                    <th className="td-pl-2">Pay Date</th>
                  </tr>
                </thead>
                <tbody>
                  {viewHoliday !== null && viewHoliday?.length > 0
                    ? viewHoliday.map((item, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td className="td-text-align1 ImpotantC">
                            <b>$</b>
                            {item.amount?.toFixed(2) ?? '0.00'}
                          </td>
                          <td className="td-pl-2">
                            {moment(item.hodayPay_Date, 'DD-MM-YYYY').format('DD-MMM-YYYY')}
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className="badge bg-soft-primary text-primary f-18"
              onClick={viewToggleModal}
              style={{ border: '1px solid #42a1d8' }}
            >
              <i className="fas fa-check pe-1" /> Ok
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default Holiday;
