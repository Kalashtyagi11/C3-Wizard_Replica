import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
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
import Loader from '../../../layouts/loader/Loader';
import {
  deleteEmployee,
  editEmployeeList,
  getEmployeeList,
  getViewDirectorWages,
  viewDirectorWages,
  employeeImport,
} from '../../../store/apps/employee/EmployeeSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import EmployeeDownloadButton from '../component/EmployeeDownload';

const Employee = () => {
  const companyId = localStorage.getItem('companyId');
  const userId = localStorage.getItem('userID');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const dispatch = useDispatch();
  const [loaders, setLoaders] = useState(false);
  const { message, type } = useSelector((state) => state.messageReducer);
  const CompanyId = localStorage.getItem('companyId');
  const [exportItems, setExportItems] = useState(null);
  const [isModalOpens, setIsModalOpens] = useState(false);
  const { loading, EmployeeList = [] } = useSelector((state) => state.employeeSlice || {});
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const toggleModal1 = () => setIsModalOpens(!isModalOpens);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'EMPLOYEE');
  const canAddEmployee = employerPermission?.addPermission;
  const canEditEmployee = employerPermission?.updatePermission;
  const canDeleteEmployee = employerPermission?.deletePermission;
  const canViewEmployee = employerPermission?.viewPermission;

  useEffect(() => {
    if (canViewEmployee === false) {
      navigate('/login');
    }
  }, [canViewEmployee, navigate]);

  useEffect(() => {
    if (CompanyId) {
      dispatch(getEmployeeList(CompanyId));
    }
  }, [CompanyId, dispatch]);

  useEffect(() => {
    console.log('');
  }, [EmployeeList]);

  const filteredEmployeeList = EmployeeList?.filter((employee) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee.socSecNum?.toLowerCase().includes(searchLower) ||
      employee.firstName?.toLowerCase().includes(searchLower)
    );
  });

  const sortedEmployeeList = filteredEmployeeList.sort((a, b) => {
    if (sortColumn === 'ssn') {
      return sortOrder === 'asc'
        ? (a.socSecNum || '').localeCompare(b.socSecNum || '')
        : (b.socSecNum || '').localeCompare(a.socSecNum || '');
    }
    if (sortColumn === 'name') {
      return sortOrder === 'asc'
        ? (a.firstName || '').localeCompare(b.firstName || '')
        : (b.firstName || '').localeCompare(a.firstName || '');
    }
    if (sortColumn === 'department') {
      return sortOrder === 'asc'
        ? (a.department || '').localeCompare(b.department || '')
        : (b.department || '').localeCompare(a.department || '');
    }
    return 0;
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const employees = sortedEmployeeList?.filter((employee) => !employee.isemployeeDirector);
  const employeeDirectors = sortedEmployeeList?.filter((employee) => employee.isemployeeDirector);
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

  const [deleteItem, setDelete] = useState({ id: '', isc3created: '' });

  const deleteEmplyee = (id, isc3created) => {
    setIsModalOpen(true);
    setDelete({ id, isc3created });
  };

  const deleteeEmplyeeApi = (isc3created) => {
    dispatch(deleteEmployee(deleteItem))
      .unwrap()
      .then((response) => {
        toast.success(response.deleteEmpResponse.message);
        dispatch(getEmployeeList(CompanyId));
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
      setAmount('');
      setPayDate('');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [day, mon, year] = dateStr.split('-');
    const monthMap = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };
    return `${year}-${monthMap[mon]}-${day}`;
  };

  function setViewHolidayPay(employee) {
    setViewLoad(true);
    setviewActive(employee);
    setEmployeeSSN(employee);
    dispatch(getViewDirectorWages({ employee, CompanyId }))
      .unwrap()
      .then((response) => {
        
        setViewHoliday(response.getViewDirectorWagesResponse);
        setViewLoad(false);
        setViewModal(!viewModal);
      })
      .catch((e) => {
        setViewLoad(false);
      });
  }

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
        companyId: CompanyId,
        amount,
        pay_date: moment(payDates).format('YYYY-MM-DD'),
      };

      try {
        setViewLoad(true);
        const response = await dispatch(viewDirectorWages(loadDirectorWages)).unwrap();

        setPayDate('');
        setAmount('');
        const responses = await dispatch(
          getViewDirectorWages({ employee: employeeSSN, CompanyId }),
        ).unwrap();
        setViewHoliday(responses.getViewDirectorWagesResponse);
      } catch (error) {
        console.error('Something went wrong:', error);
      } finally {
        setViewLoad(false);
      }
    }
  }

  const importEmployee = () => {
    setExportItems({
      CompanyId: companyId,
      UserID: userId,
    });

    setIsModalOpens(true); // Open the modal
  };

  const isImportC3 = () => {
    if (!exportItems) return;
    setImportLoading(true);

    dispatch(employeeImport(exportItems))
      .unwrap()
      .then((response) => {
        dispatch(getEmployeeList(CompanyId));
      })

      .catch((error) => {
          console.error('Something went wrong:', error);
      })
      .finally(() => {
        setImportLoading(false); // stop loader
      });
    setIsModalOpens(false);
  };

  const onCanceled = () => {
    setIsModalOpens(false);
  };

  const exportToExcel = () => {
    if (!employees || employees.length === 0) return;

    setExportLoading(true); // Start loading

    try {
      const exportData = employees.map((item, index) => ({
        'S.No.': index + 1,
        SSN: item.socSecNum || '',
        Name: item.firstName || '',
        Department: item.department || '',
        'Address Details': item.address1 || '',
        Salary: `$${parseFloat(item.wadeg || 0).toFixed(2)}`,
        'Pay Period': item.payPeriod || '',
        'Commencement Date': item.appintDate ? new Date(item.appintDate) : '',
        'Termination Date': item.terminated ? new Date(item.terminated) : '',
        Wages: `$${parseFloat(item.wage_Amt || 0).toFixed(2)}`,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, 'Employees.xlsx');
    } catch (error) {
      console.error('');
    } finally {
      setExportLoading(false); // Stop loading
    }
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

  return (
    <>
      <Helmet>
        <title>Employee - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
        <sidebar-barrrrrr></sidebar-barrrrrr>
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
            <li className="fw-medium"> Employee </li>
          </ul>
        </div>

        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="page-content-wrapper">
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
                            <input
                              type="text"
                              className="form-control custom d-inline w-25 mb-3 mb-lg-0"
                              placeholder="Search by SSN or Name"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {canAddEmployee ? (
                              <Link
                                className="btn btn-success waves-effect waves-light h-50 mb-3 mb-lg-0"
                                to="/apps/addEmployee/AddEmployee"
                              >
                                <i className="fas fa-plus pe-1" /> Add Employee
                              </Link>
                            ) : (
                              <button
                                className="btn btn-secondary h-45"
                                type="button"
                                disabled
                                style={{ opacity: 0.6 }}
                              >
                                <i className="fas fa-plus pe-1"></i> Add Employee
                              </button>
                            )}

                            <Button
                              className="btn btn-success waves-effect waves-light h-50"
                              type="submit"
                              disabled={importLoading}
                              onClick={() => importEmployee()}
                            >
                              {importLoading ? (
                                <>
                                  <Spinner size="sm" /> Import Employee..
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-download pe-1" /> Import Employee
                                </>
                              )}
                            </Button>
                            {/* <Button
                              className="btn btn-success waves-effect waves-light h-50"
                              type="submit"
                              disabled={exportLoading}
                              onClick={() => exportToExcel()}
                            >
                              {exportLoading ? (
                                <>
                                  <Spinner size="sm" /> Downloading..
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-download pe-1" /> Export Excel
                                </>
                              )}
                            </Button> */}
                            <EmployeeDownloadButton />
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          {loading ? (
                            <Loader />
                          ) : (
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
                                  <th className="td-text-align1" style={{ minWidth: '70px' }}>
                                    Salary
                                  </th>
                                  <th className="td-pl-2">Pay Period</th>
                                  <th>Commencement Date</th>
                                  <th>Termination Date</th>
                                  {/* <th>Is Director?</th> */}
                                  <th className="td-text-align1">Wages</th>
                                  <th className="td-pl-2" style={{ minWidth: '120px' }}>
                                    Edit
                                  </th>
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
                                          <td className="td-text-align1">
                                            ${item.wadeg?.toFixed(2) ?? '0.00'}
                                          </td>
                                          <td className="td-pl-2">{item.payPeriod}</td>
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

                                          <td className="td-text-align1">
                                            <b>$</b>
                                            {item.wage_Amt?.toFixed(2) ?? '0.00'}
                                          </td>
                                          <td className="td-pl-2">
                                            {canEditEmployee ? (
                                              <a
                                                className="text-decoration-none"
                                                onClick={() => handleAddEmployee(item.employeeID)}
                                              >
                                                <span
                                                  className="badge bg-soft-success text-success"
                                                  // style={{
                                                  //   border: '1px solid #119310',
                                                  //   padding: '5px 5px',
                                                  // }}
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
                                            {canDeleteEmployee ? (
                                              <button
                                                type="button"
                                                className="badge bg-soft-danger text-danger"
                                                onClick={() =>
                                                  deleteEmplyee(item.employeeID, item.isC3Created)
                                                }
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
                                        <strong>Directors</strong>
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
                                          <td className="td-text-align1">
                                            ${item.wadeg?.toFixed(2) ?? '0.00'}
                                          </td>
                                          <td className="td-pl-2">{item.payPeriod}</td>
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
                                          {/* <td>
                                          {item.isemployeeDirector === true ? (
                                            <i className="fa fa-check-circle text-success" />
                                          ) : (
                                            <i className="fa fa-times-circle text-danger" />
                                          )}
                                        </td> */}
                                          <td className="td-text-align1">
                                            <b>$</b>
                                            {item.wage_Amt?.toFixed(2) ?? '0.00'}
                                          </td>
                                          <td className="td-pl-2">
                                            {canEditEmployee ? (
                                              <a
                                                className="text-decoration-none"
                                                onClick={() => handleAddEmployee(item.employeeID)}
                                              >
                                                <span className="badge bg-soft-success text-success">
                                                  {editeLoad && editActive === item.employeeID ? (
                                                    <Spinner color="success" size="sm">
                                                      Loading...
                                                    </Spinner>
                                                  ) : (
                                                    <Icon.Edit size={20} />
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

                                            {canEditEmployee ? (
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
                                            ) : (
                                              <button
                                                type="button"
                                                className="badge  text-success  p-1"
                                                aria-hidden="true"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="top"
                                                data-bs-original-title="wages Pay"
                                                style={{
                                                  marginLeft: 5,
                                                  width: '32px',
                                                  border: '1px solid #ccc',
                                                  background: 'none',

                                                  opacity: 0.4,
                                                  pointerEvents: 'none',
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
                                            )}
                                          </td>
                                          <td>
                                            {canDeleteEmployee ? (
                                              <button
                                                type="button"
                                                className="badge bg-soft-danger text-danger"
                                                onClick={() =>
                                                  deleteEmplyee(item.employeeID, item.isC3Created)
                                                }
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
                          )}
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
                      <Label for="amount">Amount</Label> <span className="text-danger">*</span>
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
                      <Label for="paymentDate">Payment Date</Label>{' '}
                      <span className="text-danger">*</span>
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

      <Modal isOpen={isModalOpens} toggle={toggleModal1}>
        <ModalHeader toggle={toggleModal1}>Confirm Action</ModalHeader>
        <ModalBody>
          Do you want to import your list of Employees based on your last C3 Submission from Social
          Security System
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={onCanceled}>
            No
          </Button>
          <Button color="primary" onClick={isImportC3}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Employee;
