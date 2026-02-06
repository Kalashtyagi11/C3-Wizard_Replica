import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
  FormGroup,
  Spinner,
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';
import './MainSwitch.scss';

const BulkUpdateModal = ({
  isOpen,
  toggle,
  employees,
  onSaveAll,
  monthFromState,
  yearFromState,
  loading,
}) => {
  const [employeeData, setEmployeeData] = useState([]);
  const [viewFormat, setViewFormat] = useState('table'); // 'table' or 'detail'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const rowsPerPage = 10;

  const selectedMonthIndex = parseInt(monthFromState, 10) - 1;
  const selectedYear = parseInt(yearFromState, 10);
  const maxCommencementDate = new Date(selectedYear, selectedMonthIndex + 1, 0);
  const minTerminationDate = new Date(selectedYear, selectedMonthIndex + 1, 1);

  useEffect(() => {
    if (isOpen && employees && employees.length > 0) {
      // Initialize employee data with BIMA data merged, similar to EmployeeGenerated
      const initializedData = employees.map((emp) => {
        const bimaData = emp.bimaData || {};
        const exceptionRow = emp.exceptionRow || {};

        return {
          ...bimaData,
          row: exceptionRow,
          validateMsg: exceptionRow.validateMsg || '',
          validationErrors: {},
          date_Joining: (() => {
            const val = exceptionRow.date_Joining || bimaData.startDate || '';
            const m = moment(val, ['YYYY-MM-DD', 'DD-MM-YYYY', 'DD/MM/YYYY'], true);
            return m.isValid() ? m.format('DD/MM/YYYY') : null;
          })(),
          date_terminated: (() => {
            const val = exceptionRow.date_terminated || bimaData.endDate || '';
            const m = moment(val, ['YYYY-MM-DD', 'DD-MM-YYYY', 'DD/MM/YYYY'], true);
            return m.isValid() ? m.format('DD/MM/YYYY') : null;
          })(),
        };
      });
      setEmployeeData(initializedData);
    }
  }, [isOpen, employees]);

  const updateEmployee = (index, field, value) => {
    setEmployeeData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
        validationErrors: {
          ...updated[index].validationErrors,
          [field]: '',
        },
      };
      return updated;
    });
  };

  const handlePhoneChange = (index, value) => {
    updateEmployee(index, 'mobile', value);
  };

  const validateEmployee = (emp) => {
    const errors = {};
    if (!emp.socSecNum) errors.socSecNum = 'SSN is required';
    if (!emp.firstName) errors.firstName = 'First name is required';
    if (!emp.surName) errors.surName = 'Last name is required';
    // if (emp.email && emp.email.trim() !== '') {
    //   const email = emp.email.trim();
    //   if (!email.includes('@') || (!email.endsWith('.com') && !email.endsWith('.in'))) {
    //     errors.email = 'Please enter a valid email address';
    //   }
    // }
    if (!emp.gender) errors.gender = 'Gender is required';
    // if (!emp.streetAddress) errors.streetAddress = 'Address is required';
    if (!emp.salary) {
      errors.salary = 'Salary is required';
    } else if (Number(emp.salary) <= 0) {
      errors.salary = 'Salary must be greater than 0';
    }
    if (!emp.payPeriod) errors.payPeriod = 'Pay Period is required';
    return errors;
  };

  const validateAll = () => {
    let isValid = true;
    const updatedData = employeeData.map((emp) => {
      const errors = validateEmployee(emp);
      if (Object.keys(errors).length > 0) {
        isValid = false;
      }
      return {
        ...emp,
        validationErrors: errors,
      };
    });
    setEmployeeData(updatedData);
    return isValid;
  };

  const parseDate = (value) => {
    if (!value) return null;
    const m = moment(value, ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD'], true);
    return m.isValid() ? m.toDate() : null;
  };

  const formatDateForPayload = (value) => {
    if (!value) return null;
    const m = moment(value, ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD'], true);
    return m.isValid() ? m.format('DD/MM/YYYY') : null;
  };

  const handleSaveAll = () => {
    if (!validateAll()) {
      toast.error('Please fix all validation errors before saving');
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const confirmSaveAll = () => {
    setShowConfirmModal(false);
    setIsSaving(true);

    // Record start time to ensure minimum 2 seconds loading
    const startTime = Date.now();
    const minimumLoadingTime = 2000; // 2 seconds

    // Use requestAnimationFrame to allow React to render the loading state before processing
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          // Format data like EmployeeGenerated does
          const formattedData = employeeData.map((emp) => {
            const payload = {
              ...emp,
              wage_Amt: emp.wageAmt,
              holidayPayDate: emp.tcDate,
              date_Joining: formatDateForPayload(emp.date_Joining),
              date_terminated: formatDateForPayload(emp.date_terminated),
            };
            delete payload.wageAmt;
            delete payload.tcDate;
            delete payload.validationErrors;
            delete payload.validateMsg;
            delete payload.row;

            if (!payload.isemployeeDirector) {
              delete payload.wage_Amt;
              delete payload.holidayPayDate;
            }
            return payload;
          });

          onSaveAll(formattedData);

          // Calculate elapsed time and ensure minimum 2 seconds
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

          // Wait for remaining time before dismissing loading
          setTimeout(() => {
            setIsSaving(false);
          }, remainingTime);
        } catch (error) {
          console.error('Error saving bulk update:', error);
          toast.error('An error occurred while updating employees.');

          // Calculate elapsed time and ensure minimum 2 seconds
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

          // Wait for remaining time before dismissing loading
          setTimeout(() => {
            setIsSaving(false);
          }, remainingTime);
        }
      }, 0);
    });
  };

  const cancelSaveAll = () => {
    setShowConfirmModal(false);
  };

  const payPeriodOptions = [
    { key: 'W', label: 'Weekly' },
    { key: 'M', label: 'Monthly' },
    { key: 'E2W', label: 'Every Two Weeks' },
    { key: '2M', label: 'Twice Monthly' },
  ];

  // Filter employees based on search term (SSN or Name)
  const filteredEmployeeData = employeeData.filter((emp) => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase().trim();
    const ssn = (emp.socSecNum || '').toLowerCase();
    const firstName = (emp.firstName || '').toLowerCase();
    const surName = (emp.surName || '').toLowerCase();
    const fullName = `${firstName} ${surName}`.trim();
    const reverseName = `${surName} ${firstName}`.trim();

    return (
      ssn.includes(search) ||
      firstName.includes(search) ||
      surName.includes(search) ||
      fullName.includes(search) ||
      reverseName.includes(search)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredEmployeeData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedEmployeeData = filteredEmployeeData.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Reset to page 1 when view format changes
  useEffect(() => {
    setCurrentPage(1);
  }, [viewFormat]);

  if (!employees || employees.length === 0) {
    return null;
  }

  const renderTableView = () => {
    const compactInputStyle = {
      padding: '2px 4px',
      fontSize: '11px',
      height: '24px',
      lineHeight: '1.2',
    };
    const compactCellStyle = {
      padding: '4px 6px',
      verticalAlign: 'middle',
    };

    // Helper function to get style for mandatory fields
    const getMandatoryFieldStyle = (value, hasError) => {
      const baseStyle = { ...compactInputStyle };
      if (!value || hasError) {
        return {
          ...baseStyle,
          border: '1px solid #dc3545',
          borderColor: '#dc3545',
        };
      }
      return baseStyle;
    };

    return (
      <>
        <div
          className="table-responsive"
          style={{ maxHeight: '', overflowY: 'auto', overflowX: 'auto' }}
        >
          <table className="table table-bordered table-hover" style={{ minWidth: '1800px' }}>
            <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                {/* Mandatory fields first */}
                <th style={{ minWidth: '80px', fontSize: '11px', padding: '4px 6px' }}>SSN</th>
                <th style={{ minWidth: '90px', fontSize: '11px', padding: '4px 6px' }}>
                  First Name
                </th>
                <th style={{ minWidth: '90px', fontSize: '11px', padding: '4px 6px' }}>
                  Last Name
                </th>
                <th style={{ minWidth: '70px', fontSize: '11px', padding: '4px 6px' }}>Gender*</th>
                <th style={{ minWidth: '110px', fontSize: '11px', padding: '4px 6px' }}>
                  Address 1 
               
                </th>
                <th style={{ minWidth: '85px', fontSize: '11px', padding: '4px 6px' }}>
                  Pay Period <span className="text-danger">*</span>
                </th>
                <th style={{ minWidth: '80px', fontSize: '11px', padding: '4px 6px' }}>
                  Salary <span className="text-danger">*</span>
                </th>
                {/* Other fields */}
                <th style={{ minWidth: '85px', fontSize: '11px', padding: '4px 6px' }}>
                  Date of Birth
                </th>
                <th style={{ minWidth: '85px', fontSize: '11px', padding: '4px 6px' }}>
                  Marital Status
                </th>
                <th style={{ minWidth: '100px', fontSize: '11px', padding: '4px 6px' }}>
                  Address 2
                </th>
                <th style={{ minWidth: '80px', fontSize: '11px', padding: '4px 6px' }}>City</th>
                <th style={{ minWidth: '80px', fontSize: '11px', padding: '4px 6px' }}>State</th>
                <th style={{ minWidth: '80px', fontSize: '11px', padding: '4px 6px' }}>Country</th>
                <th style={{ minWidth: '85px', fontSize: '11px', padding: '4px 6px' }}>
                  Postal Code
                </th>
                <th style={{ minWidth: '120px', fontSize: '11px', padding: '4px 6px' }}>Email</th>
                <th style={{ minWidth: '120px', fontSize: '11px', padding: '4px 6px' }}>Mobile</th>
                <th style={{ minWidth: '90px', fontSize: '11px', padding: '4px 6px' }}>Phone</th>
                <th style={{ minWidth: '100px', fontSize: '11px', padding: '4px 6px' }}>
                  Commencement
                </th>
                <th style={{ minWidth: '100px', fontSize: '11px', padding: '4px 6px' }}>
                  Termination
                </th>
                <th style={{ minWidth: '100px', fontSize: '11px', padding: '4px 6px' }}>
                  Last Pay Date
                </th>
                <th style={{ minWidth: '100px', fontSize: '11px', padding: '4px 6px' }}>
                  Occupation
                </th>
                <th style={{ minWidth: '80px', fontSize: '11px', padding: '4px 6px' }}>
                  Levy Exempt
                </th>
                <th style={{ minWidth: '90px', fontSize: '11px', padding: '4px 6px' }}>
                  Department
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployeeData.map((emp, originalIndex) => {
                // Find the original index in employeeData for updateEmployee function
                const index = employeeData.findIndex((e) => e.socSecNum === emp.socSecNum);
                if (index === -1) return null; // Safety check
                const errors = emp.validationErrors || {};
                const hasBimaData = emp.hasBimaData !== false;
                return (
                  <React.Fragment key={emp.socSecNum || originalIndex}>
                    {!hasBimaData && (
                      <tr className="bg-light-danger">
                        <td colSpan="23" className="p-2">
                          <span className="text-danger fw-bold d-block">
                            Employee data not found in our system
                          </span>
                        </td>
                      </tr>
                    )}
                    <tr className={emp.validateMsg ? 'table-warning' : ''}>
                      {/* Mandatory fields first */}
                      <td style={compactCellStyle}>
                        <Input
                          disabled
                          value={emp.socSecNum || ''}
                          className="form-control-sm"
                          style={compactInputStyle}
                        />
                        {errors.socSecNum && (
                          <div
                            className="text-danger"
                            style={{ fontSize: '9px', marginTop: '2px' }}
                          >
                            {errors.socSecNum}
                          </div>
                        )}
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          disabled
                          value={emp.firstName || ''}
                          className="form-control-sm"
                          style={compactInputStyle}
                        />
                        {errors.firstName && (
                          <div
                            className="text-danger"
                            style={{ fontSize: '9px', marginTop: '2px' }}
                          >
                            {errors.firstName}
                          </div>
                        )}
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          disabled
                          value={emp.surName || ''}
                          className="form-control-sm"
                          style={compactInputStyle}
                        />
                        {errors.surName && (
                          <div
                            className="text-danger"
                            style={{ fontSize: '9px', marginTop: '2px' }}
                          >
                            {errors.surName}
                          </div>
                        )}
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          type="select"
                          value={emp.gender || ''}
                          onChange={(e) => updateEmployee(index, 'gender', e.target.value)}
                          className="form-control-sm"
                          style={getMandatoryFieldStyle(emp.gender, !!errors.gender)}
                        >
                          <option value="">Select</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </Input>
                        {errors.gender && (
                          <div
                            className="text-danger"
                            style={{ fontSize: '9px', marginTop: '2px' }}
                          >
                            {errors.gender}
                          </div>
                        )}
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          value={emp.streetAddress || ''}
                          onChange={(e) => updateEmployee(index, 'streetAddress', e.target.value)}
                          className="form-control-sm"
                          style={compactInputStyle}
                        />
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          onChange={(e) => updateEmployee(index, 'payPeriod', e.target.value)}
                          type="select"
                          value={emp.payPeriod || emp.payFreq || ''}
                          className="form-control-sm"
                          style={getMandatoryFieldStyle(
                            emp.payPeriod || emp.payFreq,
                            !!errors.payPeriod,
                          )}
                        >
                          <option value="">Select</option>
                          {payPeriodOptions.map((option) => (
                            <option key={option.key} value={option.key}>
                              {option.key} - {option.label}
                            </option>
                          ))}
                        </Input>
                        {errors.payPeriod && (
                          <div
                            className="text-danger"
                            style={{ fontSize: '9px', marginTop: '2px' }}
                          >
                            {errors.payPeriod}
                          </div>
                        )}
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          type="number"
                          value={emp.salary || ''}
                          onChange={(e) => updateEmployee(index, 'salary', e.target.value)}
                          onBlur={(e) =>
                            updateEmployee(
                              index,
                              'salary',
                              parseFloat(e.target.value || 0).toFixed(2),
                            )
                          }
                          className="form-control-sm"
                          style={getMandatoryFieldStyle(emp.salary, !!errors.salary)}
                        />
                        {errors.salary && (
                          <div
                            className="text-danger"
                            style={{ fontSize: '9px', marginTop: '2px' }}
                          >
                            {errors.salary}
                          </div>
                        )}
                      </td>
                      {/* Other fields */}
                      <td style={compactCellStyle}>
                        <DatePicker
                          disabled
                          selected={
                            emp.birthDate
                              ? moment(emp.birthDate, ['YYYY-MM-DD', 'DD/MM/YYYY']).toDate()
                              : null
                          }
                          dateFormat="dd-MMM-yyyy"
                          className="form-control form-control-sm bulk-update-datepicker"
                          placeholderText="DD-MMM-YYYY"
                          style={compactInputStyle}
                        />
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          type="select"
                          value={emp.maritalStatus || ''}
                          onChange={(e) => updateEmployee(index, 'maritalStatus', e.target.value)}
                          className="form-control-sm"
                          style={compactInputStyle}
                        >
                          <option value="">Select</option>
                          <option value="S">Single</option>
                          <option value="M">Married</option>
                        </Input>
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          value={emp.streetAddress2 || ''}
                          onChange={(e) => updateEmployee(index, 'streetAddress2', e.target.value)}
                          className="form-control-sm"
                          style={compactInputStyle}
                        />
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          value={emp.cityTownName || ''}
                          onChange={(e) => updateEmployee(index, 'cityTownName', e.target.value)}
                          className="form-control-sm"
                          style={compactInputStyle}
                        />
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          value={emp.stateRegion || ''}
                          onChange={(e) => updateEmployee(index, 'stateRegion', e.target.value)}
                          className="form-control-sm"
                          style={compactInputStyle}
                        />
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          type="select"
                          value={emp.countryCode || ''}
                          onChange={(e) => updateEmployee(index, 'countryCode', e.target.value)}
                          className="form-control-sm"
                          style={compactInputStyle}
                        >
                          <option value="">Select</option>
                          <option value="1">Saint Kitts</option>
                          <option value="2">Nevis</option>
                        </Input>
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          value={emp.postalCode || ''}
                          onChange={(e) => updateEmployee(index, 'postalCode', e.target.value)}
                          className="form-control-sm"
                          style={compactInputStyle}
                        />
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          type="email"
                          value={emp.email || ''}
                          onChange={(e) => updateEmployee(index, 'email', e.target.value)}
                          className="form-control-sm"
                          style={compactInputStyle}
                        />
                        {errors.email && (
                          <div
                            className="text-danger"
                            style={{ fontSize: '9px', marginTop: '2px' }}
                          >
                            {errors.email}
                          </div>
                        )}
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          type="text"
                          value={emp.mobile || ''}
                          maxLength="15"
                          onChange={(e) => updateEmployee(index, 'mobile', e.target.value)}
                          className="form-control-sm"
                          style={compactInputStyle}
                        />
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          type="text"
                          value={emp.phone || ''}
                          maxLength="15"
                          onChange={(e) => updateEmployee(index, 'phone', e.target.value)}
                          className="form-control-sm"
                          style={compactInputStyle}
                        />
                      </td>
                      <td style={compactCellStyle}>
                        <DatePicker
                          selected={parseDate(emp.date_Joining)}
                          onChange={(date) =>
                            updateEmployee(
                              index,
                              'date_Joining',
                              date ? moment(date).format('DD/MM/YYYY') : null,
                            )
                          }
                          dateFormat="dd-MMM-yyyy"
                          className="form-control form-control-sm bulk-update-datepicker"
                          placeholderText="Commencement"
                          isClearable
                          maxDate={maxCommencementDate}
                          style={compactInputStyle}
                        />
                      </td>
                      <td style={compactCellStyle}>
                        <DatePicker
                          selected={parseDate(emp.date_terminated)}
                          onChange={(date) =>
                            updateEmployee(
                              index,
                              'date_terminated',
                              date ? moment(date).format('DD/MM/YYYY') : null,
                            )
                          }
                          dateFormat="dd-MMM-yyyy"
                          className="form-control form-control-sm bulk-update-datepicker"
                          placeholderText="Termination"
                          isClearable
                          minDate={minTerminationDate}
                          style={compactInputStyle}
                        />
                      </td>
                      <td style={compactCellStyle}>
                        <DatePicker
                          selected={parseDate(emp.last_Pay_Date)}
                          onChange={(date) =>
                            updateEmployee(
                              index,
                              'last_Pay_Date',
                              date ? moment(date).format('DD-MM-YYYY') : null,
                            )
                          }
                          dateFormat="dd-MMM-yyyy"
                          className="form-control form-control-sm bulk-update-datepicker"
                          placeholderText="Last Pay Date"
                          style={compactInputStyle}
                        />
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          value={emp.occupation || ''}
                          onChange={(e) => updateEmployee(index, 'occupation', e.target.value)}
                          className="form-control-sm"
                          style={compactInputStyle}
                        />
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          type="checkbox"
                          checked={!!emp.isLevyExempt}
                          onChange={(e) => updateEmployee(index, 'isLevyExempt', e.target.checked)}
                          className="form-check-input"
                          style={{ margin: '0 auto', display: 'block' }}
                        />
                      </td>
                      <td style={compactCellStyle}>
                        <Input
                          value={emp.department || ''}
                          onChange={(e) => updateEmployee(index, 'department', e.target.value)}
                          className="form-control-sm"
                          maxLength="50"
                          style={compactInputStyle}
                        />
                      </td>
                    </tr>
                    {emp.validateMsg && (
                      <tr className="bg-light-danger">
                        <td colSpan="23" style={{ padding: '4px 6px' }}>
                          <span
                            className="text-danger fw-bold d-block"
                            style={{ fontSize: '11px' }}
                          >
                            {emp.validateMsg}
                          </span>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted small">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployeeData.length)} of{' '}
              {filteredEmployeeData.length} employee(s)
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                color="secondary"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left me-1"></i>
                Previous
              </Button>
              <div className="d-flex align-items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        color={currentPage === page ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        style={{ minWidth: '40px' }}
                      >
                        {page}
                      </Button>
                    );
                  }
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              <Button
                color="secondary"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <i className="fas fa-chevron-right ms-1"></i>
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        backdrop="static"
        keyboard={false}
        size="xl"
        style={{ maxWidth: '95%' }}
      >
        <ModalHeader>
          <div className="d-flex justify-content-between align-items-center w-100">
            <span>Bulk Update Employees ({employees.length} selected)</span>
            <button
              type="button"
              className="btn-close"
              onClick={toggle}
              aria-label="Close"
              style={{ position: 'absolute', right: '20px' }}
            ></button>
          </div>
        </ModalHeader>
        <ModalBody
          style={{
            maxHeight: '75vh',
            overflowY: 'auto',
            padding: '15px',
            backgroundColor: 'white',
          }}
        >
          {/* Search Field and Format Buttons */}
          <div
            className="d-flex justify-content-between align-items-center mb-3"
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 5,
              backgroundColor: 'white',
              padding: '10px 0',
            }}
          >
            {/* Left Side: Format Buttons */}
            <div className="d-flex gap-2">
              <Button
                color={viewFormat === 'table' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewFormat('table')}
                style={{ minWidth: '100px' }}
              >
                <i className="fas fa-table me-1"></i>
                Table
              </Button>
              <Button
                color={viewFormat === 'detail' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewFormat('detail')}
                style={{ minWidth: '100px' }}
              >
                <i className="fas fa-list-alt me-1"></i>
                Detail
              </Button>
            </div>

            {/* Right Side: Search Field */}
            <div className="d-flex align-items-center gap-2">
              <div className="input-group" style={{ maxWidth: '600px', minWidth: '300px' }}>
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <Input
                  type="text"
                  placeholder="Search by SSN or Employee Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearchTerm('')}
                    title="Clear search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
          {searchTerm && (
            <div className="mb-2 text-muted small text-end">
              Showing {filteredEmployeeData.length} of {employeeData.length} employee(s)
            </div>
          )}
          {filteredEmployeeData.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <p className="text-muted">No employees found matching your search criteria.</p>
              {searchTerm && (
                <Button color="secondary" size="sm" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              {viewFormat === 'table' && <div key="table-view">{renderTableView()}</div>}
              {viewFormat === 'detail' && (
                <div key="detail-view">
                  {filteredEmployeeData.map((emp, originalIndex) => {
                    // Find the original index in employeeData for updateEmployee function
                    const index = employeeData.findIndex((e) => e.socSecNum === emp.socSecNum);
                    if (index === -1) return null; // Safety check
                    const errors = emp.validationErrors || {};
                    return (
                      <div
                        key={emp.socSecNum || originalIndex}
                        className="mb-4"
                        style={{
                          border: '2px solid #dee2e6',
                          borderRadius: '8px',
                          padding: '15px',
                        }}
                      >
                        {/* Employee Header */}
                        <div
                          className="mb-3"
                          style={{ borderBottom: '2px solid #dee2e6', paddingBottom: '10px' }}
                        >
                          <h5 className="mb-2">
                            Employee {index + 1}: {emp.surName} {emp.firstName} ({emp.socSecNum})
                          </h5>
                          {emp.validateMsg && (
                            <div
                              className="alert py-2 mt-2 mb-0"
                              style={{
                                backgroundColor: '#fde8e8',
                                border: '1px solid #f5b5b5',
                                color: '#b10000',
                                borderRadius: '10px',
                                fontSize: '13px',
                              }}
                            >
                              <div style={{ marginBottom: '5px', fontSize: '14px' }}>
                                <strong>Data Mismatch Detected</strong>
                              </div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '400',
                                  color: '#000',
                                  whiteSpace: 'pre-wrap',
                                }}
                              >
                                <strong>Details:</strong>
                                <br />
                                {emp.validateMsg}
                                <br />
                                <strong>Note:</strong>
                                <br />
                                The record will be saved according to the{' '}
                                <strong>BEMA record</strong>. Any incorrect value provided in the{' '}
                                <strong>C3 file</strong> will be ignored.
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="card">
                          {/* Profile Details */}
                          <div className="card-header bg-light py-3 bg_ligh">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user pe-2" /> Profile Details
                            </h4>
                          </div>
                          <div className="col-lg-12 noPaddingModal1 px-3">
                            <div className="row noPaddingModal">
                              <div className="mb-3 col-lg-4">
                                <Label>
                                  Social Security <span className="text-danger">*</span>
                                </Label>
                                <Input disabled value={emp.socSecNum || ''} />
                                {errors.socSecNum && (
                                  <div className="text-danger small">{errors.socSecNum}</div>
                                )}
                              </div>
                              <div className="mb-3 col-lg-4">
                                <Label>
                                  Date of Birth <span className="text-danger">*</span>
                                </Label>
                                <DatePicker
                                  disabled
                                  selected={
                                    emp.birthDate
                                      ? moment(emp.birthDate, ['YYYY-MM-DD', 'DD/MM/YYYY']).toDate()
                                      : null
                                  }
                                  dateFormat="dd-MMM-yyyy"
                                  className="form-control"
                                  placeholderText="DD-MMM-YYYY"
                                />
                              </div>
                              <div className="mb-3 col-lg-4">
                                <Label>
                                  First Name <span className="text-danger">*</span>
                                </Label>
                                <Input disabled value={emp.firstName || ''} />
                                {errors.firstName && (
                                  <div className="text-danger small">{errors.firstName}</div>
                                )}
                              </div>
                              <div className="mb-3 col-lg-4">
                                <Label>Middle Name</Label>
                                <Input disabled value={emp.middleName || ''} />
                              </div>
                              <div className="mb-3 col-lg-4">
                                <Label>
                                  Last Name <span className="text-danger">*</span>
                                </Label>
                                <Input disabled value={emp.surName || ''} />
                                {errors.surName && (
                                  <div className="text-danger small">{errors.surName}</div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Personal Details */}
                          <div className="card-header bg-light py-3">
                            <h5 className="header-title mb-0 text-success">
                              <i className="far fa-user pe-2" /> Personal Details
                            </h5>
                          </div>
                          <div className="col-lg-12 px-3 noPaddingModal1">
                            <div className="row noPaddingModal">
                              <div className="col-lg-4 mb-3">
                                <Label>
                                  Gender <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="select"
                                  className="form-control"
                                  value={emp.gender || ''}
                                  onChange={(e) => updateEmployee(index, 'gender', e.target.value)}
                                >
                                  <option value="">Select Gender</option>
                                  <option value="M">Male</option>
                                  <option value="F">Female</option>
                                </Input>
                                {errors.gender && (
                                  <div className="text-danger small">{errors.gender}</div>
                                )}
                              </div>
                              <div className="col-lg-4 mb-3">
                                <Label>Marital Status</Label>
                                <Input
                                  type="select"
                                  className="form-control"
                                  value={emp.maritalStatus || ''}
                                  onChange={(e) =>
                                    updateEmployee(index, 'maritalStatus', e.target.value)
                                  }
                                >
                                  <option value="">Select Status</option>
                                  <option value="S">Single</option>
                                  <option value="M">Married</option>
                                </Input>
                              </div>
                              <div className="col-md-4 col-lg-4 col-xl-4 text-start">
                                <FormGroup>
                                  <Label
                                    check
                                    htmlFor={`isemployeeDirector-${index}`}
                                    style={{ marginRight: '18px' }}
                                  >
                                    Working Director?
                                  </Label>
                                  <div
                                    className="toggle-container"
                                    style={{
                                      cursor: 'not-allowed',
                                      opacity: 0.6,
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div
                                      className={`toggle-switch ${
                                        emp.isemployeeDirector ? 'on' : ''
                                      }`}
                                    >
                                      <FormGroup check>
                                        <Input
                                          disabled
                                          type="checkbox"
                                          id={`isemployeeDirector-${index}`}
                                          checked={!!emp.isemployeeDirector}
                                        />
                                        <Label
                                          htmlFor={`isemployeeDirector-${index}`}
                                          className="toggle-handle"
                                        />
                                        <Label
                                          htmlFor={`isemployeeDirector-${index}`}
                                          className="toggle-status"
                                        >
                                          {emp.isemployeeDirector ? 'Yes' : 'No'}
                                        </Label>
                                      </FormGroup>
                                    </div>
                                  </div>
                                </FormGroup>
                              </div>
                            </div>
                          </div>

                          {/* Address Details */}
                          <div className="card-header bg-light py-3">
                            <h5 className="header-title mb-0 text-success">
                              <i className="fas fa-map-marker-alt" /> Address Details
                            </h5>
                          </div>
                          <div className="col-lg-12 px-3 noPaddingModal1">
                            <div className="row noPaddingModal">
                              <div className="col-lg-4 mb-3">
                                <Label>
                                  Address 1 
                                </Label>
                                <Input
                                  value={emp.streetAddress || ''}
                                  onChange={(e) =>
                                    updateEmployee(index, 'streetAddress', e.target.value)
                                  }
                                />
                                {/* {errors.streetAddress && (
                                  <div className="text-danger small">{errors.streetAddress}</div>
                                )} */}
                              </div>
                              <div className="col-lg-4 mb-3">
                                <Label>Address 2</Label>
                                <Input
                                  value={emp.streetAddress2 || ''}
                                  onChange={(e) =>
                                    updateEmployee(index, 'streetAddress2', e.target.value)
                                  }
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <Label>City</Label>
                                <Input
                                  value={emp.cityTownName || ''}
                                  onChange={(e) =>
                                    updateEmployee(index, 'cityTownName', e.target.value)
                                  }
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <Label>State</Label>
                                <Input
                                  value={emp.stateRegion || ''}
                                  onChange={(e) =>
                                    updateEmployee(index, 'stateRegion', e.target.value)
                                  }
                                />
                              </div>
                              <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                                <Label>Country</Label>
                                <Input
                                  type="select"
                                  value={emp.countryCode || ''}
                                  onChange={(e) =>
                                    updateEmployee(index, 'countryCode', e.target.value)
                                  }
                                >
                                  <option value="">Select Country</option>
                                  <option value="1">Saint Kitts</option>
                                  <option value="2">Nevis</option>
                                </Input>
                              </div>
                              <div className="col-lg-4 mb-3">
                                <Label>Postal Code</Label>
                                <Input
                                  value={emp.postalCode || ''}
                                  onChange={(e) =>
                                    updateEmployee(index, 'postalCode', e.target.value)
                                  }
                                />
                              </div>
                              <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                                <Label>Email</Label>
                                <Input
                                  type="email"
                                  value={emp.email || ''}
                                  onChange={(e) => updateEmployee(index, 'email', e.target.value)}
                                />
                                {errors.email && (
                                  <div className="text-danger small">{errors.email}</div>
                                )}
                              </div>
                              <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                                <Label>Mobile Number</Label>
                                <PhoneInput
                                  defaultCountry="KN"
                                  international
                                  withCountryCallingCode
                                  forceDialCode
                                  value={emp.mobile || ''}
                                  onChange={(value) => handlePhoneChange(index, value)}
                                  className="w-100"
                                  inputProps={{ placeholder: 'Enter mobile number', maxLength: 20 }}
                                />
                              </div>
                              <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                                <Label>Phone Number</Label>
                                <Input
                                  type="text"
                                  value={emp.phone || ''}
                                  maxLength="15"
                                  onChange={(e) => updateEmployee(index, 'phone', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Other Details */}
                          <div className="card-header bg-light py-3">
                            <h5 className="header-title mb-0 text-success">
                              <i className="far fa-file-alt" /> Other Details
                            </h5>
                          </div>
                          <div className="col-lg-12 px-3 noPaddingModal1">
                            <div className="row noPaddingModal">
                              <div className="col-lg-4 mb-3">
                                <Label>Commencement</Label>
                                <DatePicker
                                  selected={parseDate(emp.date_Joining)}
                                  onChange={(date) =>
                                    updateEmployee(
                                      index,
                                      'date_Joining',
                                      date ? moment(date).format('DD/MM/YYYY') : null,
                                    )
                                  }
                                  dateFormat="dd-MMM-yyyy"
                                  className="form-control"
                                  placeholderText="Enter Commencement Date"
                                  isClearable
                                  maxDate={maxCommencementDate}
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <Label>Termination</Label>
                                <DatePicker
                                  selected={parseDate(emp.date_terminated)}
                                  onChange={(date) =>
                                    updateEmployee(
                                      index,
                                      'date_terminated',
                                      date ? moment(date).format('DD/MM/YYYY') : null,
                                    )
                                  }
                                  dateFormat="dd-MMM-yyyy"
                                  className="form-control"
                                  placeholderText="Enter Termination Date"
                                  isClearable
                                  minDate={minTerminationDate}
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <Label>Last Pay Date</Label>
                                <DatePicker
                                  selected={parseDate(emp.last_Pay_Date)}
                                  onChange={(date) =>
                                    updateEmployee(
                                      index,
                                      'last_Pay_Date',
                                      date ? moment(date).format('DD-MM-YYYY') : null,
                                    )
                                  }
                                  dateFormat="dd-MMM-yyyy"
                                  className="form-control"
                                  placeholderText="Enter Last Pay Date"
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <Label>Occupation</Label>
                                <Input
                                  value={emp.occupation || ''}
                                  onChange={(e) =>
                                    updateEmployee(index, 'occupation', e.target.value)
                                  }
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <Label>
                                  Pay Period <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  onChange={(e) =>
                                    updateEmployee(index, 'payPeriod', e.target.value)
                                  }
                                  type="select"
                                  className="form-control"
                                  value={emp.payPeriod || emp.payFreq || ''}
                                >
                                  <option value="">Select Pay Period</option>
                                  {payPeriodOptions.map((option) => (
                                    <option key={option.key} value={option.key}>
                                      {option.key} - {option.label}
                                    </option>
                                  ))}
                                </Input>
                                {errors.payPeriod && (
                                  <div className="text-danger small">{errors.payPeriod}</div>
                                )}
                              </div>
                              <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                                <FormGroup>
                                  <Label>Is Levy Exempt ? &nbsp;</Label>
                                  <Input
                                    type="checkbox"
                                    checked={!!emp.isLevyExempt}
                                    onChange={(e) =>
                                      updateEmployee(index, 'isLevyExempt', e.target.checked)
                                    }
                                  />
                                </FormGroup>
                              </div>
                              <div className="col-lg-4 mb-3">
                                <Label>
                                  Salary <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="number"
                                  value={emp.salary || ''}
                                  onChange={(e) => updateEmployee(index, 'salary', e.target.value)}
                                  onBlur={(e) =>
                                    updateEmployee(
                                      index,
                                      'salary',
                                      parseFloat(e.target.value || 0).toFixed(2),
                                    )
                                  }
                                />
                                {errors.salary && (
                                  <div className="text-danger small">{errors.salary}</div>
                                )}
                              </div>
                              <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                                <Label>Department</Label>
                                <Input
                                  value={emp.department || ''}
                                  onChange={(e) =>
                                    updateEmployee(index, 'department', e.target.value)
                                  }
                                  maxLength="50"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} disabled={loading || isSaving}>
            Close
          </Button>
          <Button color="success" onClick={handleSaveAll} disabled={loading || isSaving}>
            {loading || isSaving ? (
              <>
                <Spinner size="sm" className="me-1" />
                Updating...
              </>
            ) : (
              'Update All'
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <ConfirmationModal
        show={showConfirmModal}
        title="Confirm Bulk Update"
        message={`Are you sure you want to update ${employeeData.length} employee(s).`}
        onConfirm={confirmSaveAll}
        onCancel={cancelSaveAll}
      />
    </>
  );
};

BulkUpdateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  employees: PropTypes.array.isRequired,
  onSaveAll: PropTypes.func.isRequired,
  monthFromState: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  yearFromState: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.bool,
};

export default BulkUpdateModal;
