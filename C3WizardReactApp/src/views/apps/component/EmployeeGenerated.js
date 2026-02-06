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
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './MainSwitch.scss';

const EmployeeGenerated = ({
  isOpen,
  toggle,
  modalData,
  setModalData,
  onSave,
  // payPeriodOptions,
  closeModal,
  monthFromState,
  yearFromState,
}) => {
  const [modalConfirmationValid, setmodalConfirmationValid] = useState(false);

  const selectedMonthIndex = parseInt(monthFromState, 10) - 1; // 0-indexed (Jan=0)
  const selectedYear = parseInt(yearFromState, 10);
  // const maxCommencementDate = new Date(selectedYear, selectedMonthIndex, 0);
  // const minTerminationDate = new Date(selectedYear, selectedMonthIndex + 1, 1);
  // last day of the selected month for maxCommencementDate
  const maxCommencementDate = new Date(selectedYear, selectedMonthIndex + 1, 0); // 🔹 correct

  // first day of next month for minTerminationDate
  const minTerminationDate = new Date(selectedYear, selectedMonthIndex + 1, 1);

  const update = (field, value) => {
    setModalData((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value,
        validationErrors: { ...prev.formData.validationErrors, [field]: '' },
      },
    }));
  };

  const handlePhoneChange = (value) => {
    update('mobile', value);
  };

  const validate = () => {
    const errors = {};
    const f = modalData.formData;

    if (!f.socSecNum) errors.socSecNum = 'SSN is required';
    if (!f.firstName) errors.firstName = 'First name is required';
    if (!f.surName) errors.surName = 'Last name is required';
    // if (f.email && f.email.trim() !== '') {
    //   const email = f.email.trim();

    //   if (!email.includes('@') || (!email.endsWith('.com') && !email.endsWith('.in'))) {
    //     errors.email = 'Please enter a valid email address';
    //   }
    // }

    if (!f.gender) errors.gender = 'Gender is required';
    // if (!f.streetAddress) errors.streetAddress = 'Address is required';
    if (!f.salary) {
      errors.salary = 'Salary is required';
    } else if (f.salary <= 0) {
      errors.salary = 'Salary must be greater than 0';
    }

    if (!f.payPeriod) errors.payPeriod = 'Pay Period is required';

    if (f.isemployeeDirector) {
      if (!f.wageAmt) errors.wageAmt = 'Director amount is required';
      if (!f.tcDate) errors.tcDate = 'Director pay date is required';
    }

    setModalData((prev) => ({
      ...prev,
      formData: { ...prev.formData, validationErrors: errors },
    }));

    return Object.keys(errors).length === 0;
  };

  const saveHandler = () => {
    if (!validate()) return;
    setmodalConfirmationValid(true);
  };

  const f = modalData.formData;

  const payPeriodOptions = [
    { key: 'W', label: 'Weekly' },
    { key: 'M', label: 'Monthly' },
    { key: 'E2W', label: 'Every Two Weeks' },
    { key: '2M', label: 'Twice Monthly' },
  ];

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

  const handleConfirmSave = () => {
    debugger;
    setmodalConfirmationValid(false);
    // onSave(modalData.formData);
    const payload = {
      ...modalData.formData,
      wage_Amt: modalData.formData.wageAmt,
      holidayPayDate: modalData.formData.tcDate,
      date_Joining: formatDateForPayload(modalData.formData.date_Joining),
      date_terminated: formatDateForPayload(modalData.formData.date_terminated),
    };
    delete payload.wageAmt;
    delete payload.tcDate;

    if (!payload.isemployeeDirector) {
      delete payload.wage_Amt;
      delete payload.holidayPayDate;
    }
    onSave(payload);
  };

  useEffect(() => {
    if (!isOpen) return;

    setModalData((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        date_Joining: (() => {
          const val =
            prev.row?.date_Joining ?? prev.row?.commencementDate ?? prev.formData.date_Joining;
          const m = moment(val, ['YYYY-MM-DD', 'DD-MM-YYYY', 'DD/MM/YYYY'], true);
          return m.isValid() ? m.format('DD/MM/YYYY') : null;
        })(),
        date_terminated: (() => {
          const val =
            prev.row?.date_terminated ?? prev.row?.terminationDate ?? prev.formData.date_terminated;
          const m = moment(val, ['YYYY-MM-DD', 'DD-MM-YYYY', 'DD/MM/YYYY'], true);
          return m.isValid() ? m.format('DD/MM/YYYY') : null;
        })(),
      },
    }));
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={null} // disable automatic toggle for modal itself
        backdrop="static" // prevent outside click
        keyboard={false} // prevent ESC
        size="xl"
      >
        <ModalHeader toggle={closeModal}>Employee Details</ModalHeader>

        <ModalBody style={{ backgroundColor: 'white', padding: '15px' }}>
          <div className="container noPaddingModal">
            {f.validateMsg && (
              <div
                className="alert py-2 mt-3 mb-4"
                style={{
                  backgroundColor: '#fde8e8',
                  border: '1px solid #f5b5b5',
                  color: '#b10000',
                  borderRadius: '10px',
                  fontSize: '15px',
                  maxWidth: '1000px',
                  margin: '0 auto',
                  textAlign: 'left',
                  fontWeight: '600',
                  padding: '15px',
                }}
              >
                <div style={{ marginBottom: '10px', fontSize: '16px' }}>
                  <strong>Data Mismatch Detected</strong>
                </div>

                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: '400',
                    color: '#000',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6',
                  }}
                >
                  <strong>Details:</strong>
                  <br />
                  {f.validateMsg}
                  <br />
                  <strong>Note:</strong>
                  <br />
                  The record will be saved according to the <strong>BEMA record</strong>. Any
                  incorrect value provided in the <strong>C3 file</strong> will be ignored.
                </div>
              </div>
            )}
            <div className="card">
              {/* ================= PROFILE DETAILS ================= */}
              <div className="card-header bg-light py-3 bg_ligh">
                <h4 className="header-title mb-0 text-success">
                  <i className="far fa-user pe-2" /> Profile Details
                </h4>
              </div>

              <div className="col-lg-12 noPaddingModal1 px-3">
                <div className="row noPaddingModal">
                  {/* Social Security */}
                  <div className="mb-3 col-lg-4">
                    <Label>
                      Social Security <span className="text-danger">*</span>
                    </Label>
                    <Input
                      disabled
                      value={f.socSecNum}
                      placeholder="Enter Social Security Number"
                      onChange={(e) => update('socSecNum', e.target.value)}
                    />
                    {f.validationErrors?.socSecNum && (
                      <div className="text-danger">{f.validationErrors.socSecNum}</div>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="mb-3 col-lg-4">
                    <Label>
                      Date of Birth <span className="text-danger">*</span>
                    </Label>
                    <DatePicker
                      disabled
                      selected={
                        f.birthDate
                          ? moment(f.birthDate, ['YYYY-MM-DD', 'DD/MM/YYYY']).toDate()
                          : null
                      }
                      onChange={(date) =>
                        update('birthDate', date ? moment(date).format('YYYY-MM-DD') : null)
                      }
                      dateFormat="dd-MMM-yyyy"
                      className="form-control"
                      placeholderText="DD-MMM-YYYY"
                    />
                  </div>

                  {/* First Name */}
                  <div className="mb-3 col-lg-4">
                    <Label>
                      First Name <span className="text-danger">*</span>
                    </Label>
                    <Input value={f.firstName || ''} placeholder="Enter First Name" disabled />
                    {f.validationErrors?.firstName && (
                      <div className="text-danger">{f.validationErrors.firstName}</div>
                    )}
                  </div>

                  {/* Middle Name */}
                  <div className="mb-3 col-lg-4">
                    <Label>Middle Name</Label>
                    <Input value={f.middleName} placeholder="Enter Middle Name" disabled />
                  </div>

                  {/* Last Name */}
                  <div className="mb-3 col-lg-4">
                    <Label>
                      Last Name <span className="text-danger">*</span>
                    </Label>
                    <Input value={f.surName || ''} placeholder="Enter Last Name" disabled />
                    {f.validationErrors?.surName && (
                      <div className="text-danger">{f.validationErrors.surName}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* ================= PERSONAL DETAILS ================= */}
              <div className="card-header bg-light py-3 ">
                <h5 className="header-title mb-0 text-success">
                  <i className="far fa-user pe-2" /> Personal Details
                </h5>
              </div>

              <div className="col-lg-12 px-3 noPaddingModal1">
                <div className="row noPaddingModal">
                  {/* Gender */}
                  <div className="col-lg-4 mb-3">
                    <Label>
                      Gender <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="select"
                      className="form-control"
                      value={f.gender}
                      onChange={(e) => update('gender', e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </Input>
                    {f.validationErrors?.gender && (
                      <div className="text-danger">{f.validationErrors.gender}</div>
                    )}
                  </div>

                  {/* Marital Status */}
                  <div className="col-lg-4 mb-3">
                    <Label>Marital Status</Label>
                    <Input
                      type="select"
                      className="form-control"
                      value={f.maritalStatus}
                      onChange={(e) => update('maritalStatus', e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="S">Single</option>
                      <option value="M">Married</option>
                    </Input>
                  </div>
                  <div className="col-md-4 col-lg-4 col-xl-4 text-start">
                    <FormGroup>
                      <Label check htmlFor="isemployeeDirector" style={{ marginRight: '18px' }}>
                        Working Director?
                      </Label>

                      <div
                        className="toggle-container"
                        style={{ cursor: 'not-allowed', opacity: 0.6, justifyContent: 'start' }}
                      >
                        <div className={`toggle-switch ${f.isemployeeDirector ? 'on' : ''}`}>
                          <FormGroup check>
                            <Input
                              disabled
                              type="checkbox"
                              id="isemployeeDirector"
                              name="isemployeeDirector"
                              className="toggle-input"
                              checked={!!f.isemployeeDirector}
                              onChange={(e) => update('isemployeeDirector', e.target.checked)}
                            />

                            <Label htmlFor="isemployeeDirector" className="toggle-handle" />

                            <Label htmlFor="isemployeeDirector" className="toggle-status">
                              {f.isemployeeDirector ? 'Yes' : 'No'}
                            </Label>
                          </FormGroup>
                        </div>
                      </div>
                    </FormGroup>
                  </div>
                  {/* <div className="col-md-4 text-start"></div>
                  <div className="col-md-4 text-start">
                    <FormGroup>
                      <Label check htmlFor="isemployeeDirector" style={{ marginRight: '18px' }}>
                        Working Director?
                      </Label>

                      <div className="toggle-container" style={{ justifyContent: 'start' }}>
                        <div className={`toggle-switch ${f.isemployeeDirector ? 'on' : ''}`}>
                          <FormGroup check>
                            <Input
                              type="checkbox"
                              id="isemployeeDirector"
                              className="toggle-input"
                              checked={!!f.isemployeeDirector}
                              onChange={({ target: { checked } }) =>
                                setModalData((prev) => ({
                                  ...prev,
                                  formData: {
                                    ...prev.formData,
                                    isemployeeDirector: checked,
                                    wageAmt: checked ? prev.formData.wageAmt : '',
                                    tcDate: checked ? prev.formData.tcDate : null,
                                  },
                                }))
                              }
                            />
                            <Label htmlFor="isemployeeDirector" className="toggle-handle" />
                            <Label htmlFor="isemployeeDirector" className="toggle-status">
                              {f.isemployeeDirector ? 'Yes' : 'No'}
                            </Label>
                          </FormGroup>
                        </div>
                      </div>
                    </FormGroup>
                  </div>

                  {f.isemployeeDirector && (
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <Label>
                          Director Amount <span className="text-danger">*</span>
                        </Label>
                        <Input
                          value={f.wageAmt}
                          onChange={(e) =>
                            update('wageAmt', e.target.value.replace(/[^0-9.]/g, ''))
                          }
                          className={f.validationErrors?.wageAmt ? 'is-invalid' : ''}
                        />
                        <div className="invalid-feedback">{f.validationErrors?.wageAmt}</div>
                      </div>

                      <div className="col-md-4 mb-3">
                        <Label>
                          Director Pay Date <span className="text-danger">*</span>
                        </Label>
                        <DatePicker
                          selected={
                            f.tcDate
                              ? moment(f.tcDate, 'DD/MM/YYYY').toDate() // parse ///
                              : null
                          }
                          onChange={(date) =>
                            update(
                              'tcDate',
                              date ? moment(date).format('DD/MM/YYYY') : null, // send ///
                            )
                          }
                          dateFormat="dd/MM/yyyy" // UI ///
                          className={`form-control ${
                            f.validationErrors?.tcDate ? 'is-invalid' : ''
                          }`}
                          placeholderText="Select Director Pay Date"
                          maxDate={maxCommencementDate}
                          showPopperArrow={false}
                          isClearable
                        />

                        <div className="invalid-feedback d-block">{f.validationErrors?.tcDate}</div>
                      </div>
                    </div>
                  )} */}
                </div>
              </div>

              {/* ================= ADDRESS DETAILS ================= */}
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
                      value={f.streetAddress}
                      placeholder="Enter Address Line 1"
                      onChange={(e) => update('streetAddress', e.target.value)}
                    />
                    {f.validationErrors?.streetAddress && (
                      <div className="text-danger">{f.validationErrors.streetAddress}</div>
                    )}
                  </div>
                  <div className="col-lg-4 mb-3">
                    <Label>Address 2</Label>
                    <Input
                      value={f.streetAddress2}
                      placeholder="Enter Address Line 2"
                      onChange={(e) => update('streetAddress2', e.target.value)}
                    />
                  </div>
                  <div className="col-lg-4 mb-3">
                    <Label>City</Label>
                    <Input
                      value={f.cityTownName}
                      placeholder="Enter City"
                      onChange={(e) => update('cityTownName', e.target.value)}
                    />
                  </div>
                  <div className="col-lg-4 mb-3">
                    <Label>State</Label>
                    <Input
                      value={f.stateRegion}
                      placeholder="Enter State"
                      onChange={(e) => update('stateRegion', e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 col-lg-4 col-xl-4">
                    <div className="mb-3">
                      <Label>Country</Label>
                      <Input
                        type="select"
                        className="form-control"
                        id="countryCode"
                        value={f.countryCode || ''}
                        onChange={(e) => update('countryCode', e.target.value)}
                      >
                        <option value="">Select Country</option>
                        <option value="1">Saint Kitts</option>
                        <option value="2">Nevis</option>
                      </Input>
                    </div>
                  </div>

                  <div className="col-lg-4 mb-3">
                    <Label>Postal Code</Label>
                    <Input
                      value={f.postalCode}
                      placeholder="Enter Postal Code"
                      onChange={(e) => update('postalCode', e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={f.email}
                      placeholder="Enter Email"
                      onChange={(e) => update('email', e.target.value)}
                    />
                    {f.validationErrors?.email && (
                      <div className="text-danger">{f.validationErrors.email}</div>
                    )}
                  </div>
                  <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                    <Label>Mobile Number</Label>
                    <PhoneInput
                      defaultCountry="KN"
                      international
                      withCountryCallingCode
                      forceDialCode
                      value={f.mobile}
                      onChange={handlePhoneChange}
                      className="w-100"
                      inputProps={{ placeholder: 'Enter mobile number', maxLength: 20 }}
                    />
                  </div>
                  <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                    <Label>Phone Number</Label>
                    <Input
                      type="text"
                      value={f.phone || ''}
                      maxLength="15"
                      onChange={(e) => update('phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* ================= OTHER DETAILS ================= */}
              <div className="card-header bg-light py-3">
                <h5 className="header-title mb-0 text-success">
                  <i className="far fa-file-alt" /> Other Details
                </h5>
              </div>

              <div className="col-lg-12 px-3 noPaddingModal1">
                <div className="row noPaddingModal">
                  <div className="row">
                    <div className="col-lg-4 mb-3">
                      <Label>Commencement</Label>
                      <DatePicker
                        selected={parseDate(f.date_Joining)}
                        onChange={(date) =>
                          update('date_Joining', date ? moment(date).format('DD/MM/YYYY') : null)
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
                        selected={parseDate(f.date_terminated)}
                        onChange={(date) =>
                          update('date_terminated', date ? moment(date).format('DD/MM/YYYY') : null)
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
                        selected={parseDate(f.last_Pay_Date)}
                        onChange={(date) =>
                          update('last_Pay_Date', date ? moment(date).format('DD-MM-YYYY') : null)
                        }
                        dateFormat="dd-MMM-yyyy"
                        className="form-control"
                        placeholderText="Enter Last Pay Date"
                      />
                    </div>

                    <div className="col-lg-4 mb-3">
                      <Label>Occupation</Label>
                      <Input
                        value={f.occupation}
                        placeholder="Enter Occupation"
                        onChange={(e) => update('occupation', e.target.value)}
                      />
                    </div>

                    <div className="col-lg-4 mb-3">
                      <Label>
                        Pay Period <span className="text-danger">*</span>
                      </Label>
                      <Input
                        // disabled
                        type="select"
                        className="form-control"
                        value={f.payPeriod || ''}
                        onChange={(e) => update('payPeriod', e.target.value)}
                      >
                        <option value="">Select Pay Period</option>
                        {payPeriodOptions.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.key} - {option.label}
                          </option>
                        ))}
                      </Input>
                      {f.validationErrors?.payPeriod && (
                        <div className="text-danger">{f.validationErrors.payPeriod}</div>
                      )}
                    </div>

                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <FormGroup>
                        <Label>Is Levy Exempt ? &nbsp;</Label>
                        <Input
                          type="checkbox"
                          name="isLevyExempt"
                          checked={!!f.isLevyExempt}
                          onChange={(e) => update('isLevyExempt', e.target.checked)}
                        />
                      </FormGroup>
                    </div>

                    <div className="col-lg-4 mb-3">
                      <Label>
                        Salary <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="number"
                        value={f.salary}
                        placeholder="Enter Salary"
                        onChange={(e) => update('salary', e.target.value)}
                        onBlur={(e) => update('salary', parseFloat(e.target.value || 0).toFixed(2))}
                      />
                      {f.validationErrors?.salary && (
                        <div className="text-danger">{f.validationErrors.salary}</div>
                      )}
                    </div>

                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <Label>Department </Label>
                      <Input
                        type="text"
                        name="department"
                        value={f.department}
                        onChange={(e) => update('department', e.target.value)}
                        maxLength="50"
                        placeholder="Enter Department"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={closeModal}>
            Close
          </Button>
          <Button color="success" onClick={saveHandler}>
            Save
          </Button>
        </ModalFooter>
      </Modal>

      {/* Confirmation Modal */}
      <Modal isOpen={modalConfirmationValid} onClick={() => setmodalConfirmationValid(false)}>
        <ModalHeader toggle={() => setmodalConfirmationValid(false)}>Confirm Save</ModalHeader>
        <ModalBody>Are you sure you want to save this employee?</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setmodalConfirmationValid(false)}>
            No
          </Button>
          <Button color="primary" onClick={handleConfirmSave}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

EmployeeGenerated.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  modalData: PropTypes.object.isRequired,
  setModalData: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  // payPeriodOptions: PropTypes.array,
  monthFromState: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  yearFromState: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  closeModal: PropTypes.bool.isRequired,
};

export default EmployeeGenerated;
