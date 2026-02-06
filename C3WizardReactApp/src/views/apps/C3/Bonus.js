import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Spinner,
} from 'reactstrap';

import { toast } from 'react-toastify';
import * as Icon from 'react-feather';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  deleteBonus,
  getBonus,
  getEmployee,
  saveBonus,
  saveEdit,
} from '../../../store/apps/C/CSlice';
import Loader from '../../../layouts/loader/Loader';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';

const Bonus = () => {
  const dispatch = useDispatch();
  const [loadingBonus, setLoadingBonus] = useState(false);
  const companyId = localStorage.getItem('companyId');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [employees, setEmployees] = useState([]);
  const { message, type } = useSelector((state) => state.messageReducer);
  const { CList, employee, loading } = useSelector((state) => state.cSlice);
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);
  const [employeessn, setEmployeessn] = useState('');
  const [payDates, setPayDate] = useState('');
  const [amount, setAmount] = useState('');
  const [payIds, setPayId] = useState('');
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState(''); // Current column to sort
  const [sortOrder, setSortOrder] = useState('asc'); // Sorting order: 'asc' or 'desc'

  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'BONUS');
  const canAddC3Bonus = employerPermission?.addPermission;
  const canEditC3Bonus = employerPermission?.updatePermission;
  const canDeleteC3Bonus = employerPermission?.deletePermission;
  const canViewC3Bonus = employerPermission?.viewPermission;

  useEffect(() => {
    if (canViewC3Bonus === false) {
      navigate('/login');
    }
  }, [canViewC3Bonus, navigate]);

  const toggle = () => {
    setModal(!modal);
    setIsEdit(false);
    setEmployeessn('');
    setPayDate('');
    setAmount('');
    setPayId('');
  };

  useEffect(() => {
    if (companyId) {
      dispatch(getBonus(companyId));
      dispatch(getEmployee(companyId));
    }
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

  const sortedHolidayList = [...CList].sort((a, b) => {
    if (sortColumn === 'ssn') {
      const aValue = String(a.employeeID || '');
      const bValue = String(b.employeeID || '');
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    if (sortColumn === 'name') {
      const aValue = String(a.employeename || '');
      const bValue = String(b.employeename || '');
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return 0;
  });

  // Handle column sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  function save() {
    let isValid = true;

    if (employeessn === '') {
      toast.error('Please Select an Employee');
      isValid = false;
    }

    if (payDates === '') {
      toast.error('Please Select an Payment Date');
      isValid = false;
    }
    if (amount === '') {
      toast.error('Please Select an Amount');
      isValid = false;
    }

    if (isValid) {
      setLoad(true);
      dispatch(saveBonus({ employeessn, payDate: payDates, amount, companyId }))
        .unwrap()
        .then((response) => {
          dispatch(getBonus(companyId));
          setModal(!modal);
          setEmployeessn('');
          setPayDate('');
          setAmount('');
          setPayId('');
          toast.success(response.saveBonusResponse.message);
          setLoad(false);
        });
    }
  }

  function edit(ssn, name, date, amt, pid) {
    setIsEdit(true);
    setModal(!modal);
    setEmployeessn(`${ssn}(${name})`);
    setPayDate(`${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`);
    setAmount(amt);
    setPayId(pid);
  }

  function editSave() {
    setLoad(true);
    dispatch(saveEdit({ employeessn, payDate: payDates, amount, companyId, payId: payIds }))
      .unwrap()
      .then((response) => {
        dispatch(getBonus(companyId));
        toast.success(response.saveEditResponse.message);
        setModal(!modal);
        setEmployeessn('');
        setPayDate('');
        setAmount('');
        setPayId('');
        setIsEdit(false);
        setLoad(false);
      })
      .catch((e) => {
        setModal(!modal);
        toast.error(e.message);
        setEmployeessn('');
        setPayDate('');
        setAmount('');
        setPayId('');
        setIsEdit(false);
        setLoad(false);
      });
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onConfirm = () => {
    
    toggleModal();
  };

  const onCancel = () => {
    setIsEdit(false);
    toggleModal(); // Close the modal after cancellation
  };
  const [deleteItem, setDelete] = useState({});
  function deleteBonusModal(payId, payDate, employeeId, company) {
    setIsModalOpen(!isModalOpen);
    setDelete({ payId, payDate, employeeId, companyId });
  }

  async function deleteBonusApi() {
    setLoadingBonus(true);
    try {
      const response = await dispatch(deleteBonus(deleteItem)).unwrap();
      dispatch(getBonus(companyId)); // refresh list
      toast.success(response.deleteBonusResponse.message);
      setIsModalOpen(!isModalOpen); // close modal
    } catch (error) {
      toast.error('Failed to delete bonus.');
    } finally {
      setLoadingBonus(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Bonus - C3Wizard</title>
      </Helmet>
      {loading ? (
        <Loader />
      ) : (
        <div id="layout-wrapper">
          <Container fluid>
            {/* Page Header */}

            {/* Bonus List */}
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
                <li className="fw-medium"> Bonus </li>
              </ul>
            </div>
            <Row>
              <Col xl="12">
                <Card>
                  <div className="card-header py-2 bg_ligh">
                    <div className="d-flex justify-content-between">
                      <h4 className="header-title mb-0 text-success mt-2">
                        <Icon.User className="me-2" />
                        Bonus List
                      </h4>

                      {canAddC3Bonus ? (
                        <Button color="success" onClick={toggle}>
                          <Icon.Plus className="me-1" /> Add Bonus
                        </Button>
                      ) : (
                        <button
                          className="btn btn-secondary h-45"
                          type="button"
                          disabled
                          style={{ opacity: 0.6 }}
                        >
                          <Icon.Plus className="me-1" /> Add Bonus
                        </button>
                      )}
                    </div>
                  </div>
                  <CardBody>
                    <Table hover className="tableword-wrap">
                      <thead>
                        <tr>
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
                          <th>Payment Date</th>
                          <th className="td-text-align1">Amount</th>
                          <th className="td-pl-2">Edit</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedHolidayList.length > 0 ? (
                          sortedHolidayList.map((item, index) => (
                            <tr key={index}>
                              <td>{item.employeeID}</td>
                              <td>{item.employeename}</td>
                              <td>{moment(item.pay_Date, 'DD-MM-YYYY').format('DD-MMM-YYYY')}</td>

                              <td className="td-text-align1">
                                ${item.amount?.toFixed(2) ?? '0.00'}
                              </td>
                              <td className="td-pl-2">
                                {canEditC3Bonus ? (
                                  <Button
                                    className="badge bg-soft-success text-success"
                                    onClick={(e) =>
                                      edit(
                                        item.employeeID,
                                        item.employeename,
                                        item.pay_Date,
                                        item.amount,
                                        item.wages_Bonus_PayId,
                                      )
                                    }
                                    style={{
                                      border: '1px solid #119310',
                                      // padding: '5px 5px',
                                    }}
                                  >
                                    <Icon.Edit size={20} />
                                  </Button>
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
                                {canDeleteC3Bonus ? (
                                  <button
                                    type="button"
                                    className="badge bg-soft-danger text-danger"
                                  >
                                    <Icon.Trash
                                      size={20}
                                      onClick={() =>
                                        deleteBonusModal(
                                          item.wages_Bonus_PayId,
                                          item.pay_Date,
                                          item.employeeID,
                                          companyId,
                                        )
                                      }
                                    />
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
                            <td colSpan="6" className="text-center">
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Add Bonus Modal */}
            <Modal isOpen={modal} toggle={toggle} size="lg">
              <ModalHeader toggle={toggle}>Employee Bonus Details</ModalHeader>
              <ModalBody>
                <Row>
                  <Col md="6">
                    <Label for="employee">
                      Employee <span className="text-danger">*</span>
                    </Label>
                    {/* <Input
                    type="select"
                    id="employeessn"
                    className="form-control"
                    // value={formData.employeessn}
                    disabled={isEdit}
                    onChange={(e) => setEmployeessn(e.target.value)}
                  >
                    <option>Select Employee</option>
                    {employee.length > 0
                      ? employee.map((item) => (
                          <option value={item.name} selected={employeessn === item.name}>
                            {item.name}
                          </option>
                        ))
                      : null}
                  </Input> */}
                    <Autocomplete
                      id="employeessn"
                      disabled={isEdit}
                      size="small"
                      options={employee || []}
                      getOptionLabel={(option) => option.name || ''}
                      value={employee.find((item) => item.name === employeessn) || null}
                      onChange={(event, newValue) => setEmployeessn(newValue ? newValue.name : '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Employee"
                          variant="outlined"
                          className="form-control"
                          style={{ background: '#fff' }}
                        />
                      )}
                    />
                  </Col>
                  <Col md="6">
                    <Label for="paymentDate">
                      Payment Date <span className="text-danger">*</span>
                    </Label>
                    {/*<Input type="date" id="payDate" value={payDates} onChange={(e)=>setPayDate(e.target.value)}/> */}
                    <div className="dateWidth">
                      <DatePicker
                        // selected={payDates ? new Date(payDates) : null}
                        selected={payDates ? moment(payDates, 'YYYY-MM-DD').toDate() : null}
                        onChange={(date) =>
                          setPayDate(date ? moment(date).format('YYYY-MM-DD') : '')
                        }
                        dateFormat="dd-MMM-yyyy" // Display format (e.g., 13-Mar-2025)
                        className="form-control"
                        placeholderText="dd-mmm-yyyy"
                        showMonthDropdown // Show the month dropdown
                        showYearDropdown // Show the year dropdown
                        yearDropdownItemNumber={15} // Number of years to display in the year dropdown
                        scrollableYearDropdown // Make the year dropdown scrollable
                        dropdownMode="select" // To ensure dropdown mode is used
                        onKeyDown={(e) => e.preventDefault()} // Disable manual input
                        isClearable
                      />
                    </div>
                  </Col>
                  <Col md="6" className="mt-3">
                    <Label for="amount">
                      Amount<span className="text-danger">*</span>
                    </Label>
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
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="success"
                  disabled={load}
                  onClick={() => (isEdit ? editSave() : save())}
                >
                  {load ? (
                    <>
                      <Spinner size="sm" />
                      &nbsp; Saving...
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
              {/* <CardBody className="border-top">
              <Table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Amount</th>
                    <th>Pay Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={1}>
                    <td>{1}</td>
                    <td>{20}</td>
                    <td>{30}</td>
                  </tr>
                </tbody>
              </Table>
            </CardBody> */}
            </Modal>

            <Modal isOpen={isModalOpen} toggle={toggleModal}>
              <ModalHeader toggle={toggleModal}>Confirm Action</ModalHeader>
              <ModalBody>Are you sure you want to permanently delete this Bonus?</ModalBody>
              <ModalFooter>
                <Button color="secondary" className="btn-light" onClick={onCancel}>
                  No
                </Button>
                <Button color="primary" onClick={deleteBonusApi} disabled={loadingBonus}>
                  {loadingBonus ? (
                    <>
                      <Spinner size="sm" /> Deleting..
                    </>
                  ) : (
                    <> Yes</>
                  )}
                </Button>
              </ModalFooter>
            </Modal>
          </Container>
        </div>
      )}
    </>
  );
};

export default Bonus;
