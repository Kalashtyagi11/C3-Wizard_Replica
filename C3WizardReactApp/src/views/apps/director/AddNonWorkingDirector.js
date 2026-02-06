import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, Spinner, CardBody } from 'reactstrap';
import { PhoneInput } from 'react-international-phone';

import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {
  addNonDirector,
  getNWDirector,
  clearEmployeeNWList,
  getNWDirectorNew,
} from '../../../store/apps/nonWorkingDirectory/NonWorkingDirectory';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';

const AddNonWorkingDirector = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { message, type: messageType } = useSelector((state) => state?.messageReducer);
  const { EmployeeNWList, EmployeeNWListNew } = useSelector(
    (state) => state.nonWorkingDirectorySlice,
  );
  const CompanyId = localStorage.getItem('companyId');
  const UserName = localStorage.getItem('userId');
  const UserPassword = localStorage.getItem('userPassword');
  const dispatch = useDispatch('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    socSecNum: '',
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '',
    rbmale: null,
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    phone: '',
    mobile: '+1-869-',
    email: '',
    wadeg: null,
    lastPayDate: '2025-02-12T10:19:28.581Z',
    terminated: null,
    commencementDate: null,
    payPeriod: '',
    maritalStat: '',
    occupation: '',
    department: '',
    isLevyExempt: true,
    start_Date: '2025-02-12T10:19:28.581Z',
    end_Date: '2025-02-12T10:19:28.581Z',
    monthno: 0,
    yearName: '',
    holidayPay_Date: '2025-02-12T10:19:28.581Z',
    wagespaydate: '2025-02-12T10:19:28.581Z',
    wagesAmount: 0,
    employeeID: 0,
    emplCode: 'string',
    mode: 1,
    companyid: CompanyId,
  });

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({
      ...prev,
      mobile: phone,
    }));
  };

  const validateForm = () => {
    const formErrors = {};

    if (!formData.socSecNum) {
      formErrors.socSecNum = 'Social Security number is required.';
    } else if (formData.socSecNum.length !== 6) {
      formErrors.socSecNum = 'Social Security number must be exactly 6 digits.';
    }

    if (!formData.birthDate) {
      formErrors.birthDate = 'Date of Birth is required.';
    }
    if (!formData.firstName) {
      formErrors.firstName = 'First Name is required.';
    }
    if (!formData.lastName) {
      formErrors.lastName = 'Last Name is required.';
    }
    if (formData.rbmale === null) {
      formErrors.rbmale = 'Gender is required.';
    }

    if (!formData.address1) {
      formErrors.address1 = 'Address #1 is required.';
    }
    // if (!formData.country) {
    //   formErrors.country = 'Country  is required.';
    // }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const localPart = formData.email.split('@')[0]; // Extract part before '@'

    // 13-08-2025 remove by anjani

    // if (!formData.email) {
    //   formErrors.email = 'Email is required';
    // } else if (!emailRegex.test(formData.email)) {
    //   formErrors.email = 'Invalid Email';
    // } else if (localPart.length < 1 || localPart.length > 64) {
    //   formErrors.email = 'Email must be between 1 and 64 characters';
    // }

    // const getValidNumberLength = (number, prefix) => {
    //   if (!number || number === prefix) return 0;
    //   return number.replace(/\D/g, '').length;
    // };

    // const mobileDigits = getValidNumberLength(formData.mobile, '+1-869-');
    // const phoneDigits = getValidNumberLength(formData.phone, '');

    // if (!mobileDigits && !phoneDigits) {
    //   formErrors.mobiles = 'Either Mobile or Phone is required';
    // }

    // if (mobileDigits > 0 && mobileDigits < 10) {
    //   formErrors.mobiles = 'Mobile number must be at least 7 digits';
    // }

    // if (phoneDigits > 0 && phoneDigits < 7) {
    //   formErrors.phone = 'Phone number must be at least 7 digits';
    // }

    // 13-08-2025 remove by anjani

    if (!formData.payPeriod) {
      formErrors.payPeriod = 'Pay Period is required';
    }
    if (!formData.wadeg) {
      formErrors.wadeg = 'Salary is required';
    }

    return formErrors;
  };

  const handleSearch = () => {
    return new Promise((resolve, reject) => {
      const requiredFields = [
        { field: formData.socSecNum, name: 'Social Security Number' },
        { field: formData.birthDate, name: 'Birth Date' },
        { field: formData.firstName, name: 'First Name' },
        { field: formData.lastName, name: 'Last Name' },
      ];

      const missingField = requiredFields.find((f) => !f.field || f.field.trim() === '');
      if (missingField) {
        toast.error(`${missingField.name} is required.`);
        return reject(new Error(`${missingField.name} is required.`)); // ❗ reject the promise
      }
      setLoading(true);
      const payload = {
        Txt_SSN: formData.socSecNum,
        DOB: formData.birthDate,
        Txt_Fname: formData.firstName,
        Txt_Mname: formData.middleName,
        Txt_Surname: formData.lastName,
        username: UserName,
        password: UserPassword,
      };

      return dispatch(getNWDirector(payload)) // ✅ return this promise chain
        .unwrap()
        .then((res) => {
          return resolve(res);
        })
        .catch((err) => {
          return reject(err);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const handleSearchNew = () => {
    return new Promise((resolve, reject) => {
      const requiredFields = [
        { field: formData.socSecNum, name: 'Social Security Number' },
        { field: formData.birthDate, name: 'Birth Date' },
        { field: formData.firstName, name: 'First Name' },
        { field: formData.lastName, name: 'Last Name' },
      ];

      const missingField = requiredFields.find((f) => !f.field || f.field.trim() === '');
      if (missingField) {
        toast.error(`${missingField.name} is required.`);
        return reject(new Error(`${missingField.name} is required.`)); // ❗ reject the promise
      }
      setLoading(true);
      const payload = {
        Txt_SSN: formData.socSecNum,
        DOB: formData.birthDate,
        Txt_Fname: formData.firstName,
        Txt_Mname: formData.middleName,
        Txt_Surname: formData.lastName,
        username: UserName,
        password: UserPassword,
      };

      return dispatch(getNWDirectorNew(payload)) // ✅ return this promise chain
        .unwrap()
        .then((res) => {
          return resolve(res);
        })
        .catch((err) => {
          return reject(err);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const fieldsToNullify = [
      'holidayPay_Date',
      'terminated',
      'birthDate',
      'commencementDate',
      'lastPayDate',
    ];

    const processedValue = fieldsToNullify.includes(name) && value === '' ? null : value;

    if (name === 'holidayPay_Date') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        holidayPay_Date: processedValue,
        wagespaydate: processedValue,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === 'checkbox' ? checked : processedValue,
      }));
    }

    // Ensure errors are cleared if either phone or mobile is filled with a valid number
    setErrors((prevErrors) => ({
      ...prevErrors,
      mobile: value && value !== '+1-869-' ? '' : prevErrors.mobile,
      mobiles:
        (formData.phone && formData.phone !== '+1-869-') || (value && value !== '+1-869-')
          ? ''
          : prevErrors.mobiles,
    }));

    if (name === 'rbmale') {
      setFormData({
        ...formData,
        [name]: value === 'Male',
      });
    }
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      birthDate: date ? moment(date).format('DD-MMM-YYYY') : '',
    }));
  };

  const handleDateChangeCommencement = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      commencementDate: date ? moment(date).format('YYYY-MM-DD') : null, // Store in "dd-MMM-yyyy" format
    }));
  };

  const handleDateChangeTerminated = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      terminated: date ? moment(date).format('YYYY-MM-DD') : null,
    }));
  };

  useEffect(() => {
    if (EmployeeNWList && EmployeeNWList.length > 0) {
      const emp = EmployeeNWList[0];
      const convertDate = (dateStr) => {
        if (!dateStr || dateStr.includes('T')) return dateStr;
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
      };

      setFormData((prev) => ({
        ...prev,
        socSecNum: emp.socSecNum || '',
        firstName: emp.firstName || '',
        lastName: emp.surName || '',
        birthDate: convertDate(emp.birthDate),
        rbmale: emp.gender === 'M' ? true : emp.gender === 'F' ? false : null,
        address1: emp.streetAddress || '',
        address2: emp.streetName || '',
        city: emp.cityTownName || '',
        state: emp.stateRegion || '',
        country: emp.countryCode || '',
        zip: emp.postalCode || '',
        phone: emp.phone || '',
        mobile: emp.mobile || '',
        email: emp.email || '',
        payPeriod: emp.payPeriod || '',
        // maritalStat: emp.maritalStatus || '',
        maritalStat:
          emp.maritalStatus === 'S' ? 'Single' : emp.maritalStatus === 'M' ? 'Married' : '',
        occupation: emp.occupation || '',
        isLevyExempt: emp.isLevyExempt === 'true',
        start_Date: convertDate(emp.startDate),
        end_Date: convertDate(emp.endDate),
        // lastPayDate: convertDate(emp.last_Pay_Date),
        lastPayDate: emp.last_Pay_Date ? convertDate(emp.last_Pay_Date) : null,
        companyid: CompanyId,
      }));
    }
  }, [EmployeeNWList, CompanyId]);

  useEffect(() => {
    dispatch(clearEmployeeNWList());

    setFormData({
      socSecNum: '',
      firstName: '',
      middleName: '',
      lastName: '',
      birthDate: '',
      rbmale: null,
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: '',
      zip: '',
      phone: '',
      mobile: '+1-869-',
      email: '',
      wadeg: null,
      lastPayDate: '2025-02-12T10:19:28.581Z',
      terminated: null,
      commencementDate: null,
      payPeriod: '',
      maritalStat: '',
      occupation: '',
      department: '',
      isLevyExempt: true,
      start_Date: '2025-02-12T10:19:28.581Z',
      end_Date: '2025-02-12T10:19:28.581Z',
      monthno: 0,
      yearName: '',
      holidayPay_Date: '2025-02-12T10:19:28.581Z',
      wagespaydate: '2025-02-12T10:19:28.581Z',
      wagesAmount: 0,
      employeeID: 0,
      emplCode: 'string',
      mode: 1,
      companyid: CompanyId,
    });
  }, [location.key]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const result = await handleSearchNew();

      if (result?.statuscode === 400) {
        // toast.error(result.message || 'Record already exists.');
        return;
      }

      // Step 2: Validate the form
      const validationErrors = validateForm();
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) {
      
        return;
      }

      // Step 3: Dispatch if all is good
      await dispatch(addNonDirector({ formData }));

      // Step 4: Navigate after success
      navigate('/apps/director/NwDirector');
    } catch (error) {
        console.error('Something went wrong:', error);
      
    } finally {
      setLoading(false);
    }
  };

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

  const handleBlur = (date) => {
    const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 10));

    if (date && date > maxDate) {
      // If the selected date is greater than the maxDate, set it to maxDate
      date = maxDate;
    }

    setFormData((prev) => ({
      ...prev,
      birthDate: date ? moment(date).format('YYYY-MM-DD') : '',
    }));
  };
  return (
    <div id="layout-wrapper">
      <my-header />

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
            <span className="d-flex align-items-center gap-1 text-muted"> Add NW Director </span>
          </li>
          <li>-</li>
          <li className="fw-medium">Director </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="page-content-wrapper">
              <div className="row">
                <div className="col-xl-12">
                  <div className="card">
                    <div className="card-header py-3 bg_ligh">
                      <div className="row align-items-center d-flex">
                        <div className="col-xl-8">
                          <h4 className="header-title mb-0 text-success">
                            <i className="fas fa-search text-success pe-2" />
                            Search Profile Details
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-12 mb-3  fw-bold">
                          Enter SSN, DOB, First Name and Last Name to retrieve employee details.
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>
                              Social Security <span className="text-danger">*</span>
                            </Label>
                            <input
                              type="text"
                              name="socSecNum"
                              value={formData.socSecNum}
                              //onChange={handleChange}
                              onChange={(e) => {
                                if (/^[0-9]*$/.test(e.target.value)) {
                                  handleChange(e);
                                }
                              }}
                              maxLength="6"
                              //className="form-control"
                              className={
                                errors.socSecNum ? 'is-invalid form-control' : 'form-control'
                              }
                            />
                            {errors.socSecNum && (
                              <small className="text-danger">{errors.socSecNum}</small>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>
                              Date Of Birth <span className="text-danger">*</span>
                            </Label>

                            <div className="dateWidth">
                              <DatePicker
                                selected={
                                  formData.birthDate
                                    ? moment(formData.birthDate, 'YYYY-MM-DD').toDate()
                                    : null
                                }
                                onChange={(date) => {
                                  // Calendar selection
                                  setFormData((prev) => ({
                                    ...prev,
                                    birthDate: date ? moment(date).format('YYYY-MM-DD') : '',
                                  }));
                                }}
                                onChangeRaw={(e) => {
                                  if (!e?.target || e.target.tagName !== 'INPUT') return;

                                  const raw = e.target.value ?? '';

                                  let val = raw.replace(/[^0-9]/g, '');

                                  if (val.length > 2) val = `${val.slice(0, 2)}-${val.slice(2)}`;

                                  if (val.length > 5) val = `${val.slice(0, 5)}-${val.slice(5)}`;

                                  e.target.value = val.slice(0, 10);

                                  const normalizeDate = (input) => {
                                    if (!input) return null;

                                    if (/^\d{8}$/.test(input)) {
                                      input = `${input.slice(0, 2)}-${input.slice(
                                        2,
                                        4,
                                      )}-${input.slice(4)}`;
                                    }

                                    const parsed = moment(
                                      input,
                                      ['DD-MM-YYYY', 'DD/MM/YYYY'],
                                      true,
                                    );
                                    return parsed.isValid() ? parsed.toDate() : null;
                                  };

                                  const normalized = normalizeDate(e.target.value);
                                  if (normalized) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      birthDate: moment(normalized).format('YYYY-MM-DD'),
                                    }));
                                  }
                                }}
                      
                                onBlur={(e) => {
                                  const normalizeDate = (input) => {
                                    if (!input) return null;

                                    if (/^\d{8}$/.test(input)) {
                                      input = `${input.slice(0, 2)}-${input.slice(
                                        2,
                                        4,
                                      )}-${input.slice(4)}`;
                                    }

                                    const parsed = moment(
                                      input,
                                      ['DD-MM-YYYY', 'DD/MM/YYYY'],
                                      true,
                                    );
                                    return parsed.isValid() ? parsed.toDate() : null;
                                  };

                                  const normalized = normalizeDate(e.target.value);

                                  
                                  if (normalized) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      birthDate: moment(normalized).format('YYYY-MM-DD'),
                                    }));
                                  }
                                 
                                }}
                                dateFormat="dd-MMM-yyyy"
                                placeholderText="dd-mmm-yyyy"
                                isClearable
                                maxDate={
                                  new Date(new Date().setFullYear(new Date().getFullYear() - 10))
                                }
                                className={`form-control full-width-datepicker w-100 ${
                                  errors.birthDate ? 'is-invalid' : ''
                                }`}
                                style={{ display: 'block', width: '100%' }}
                                showMonthDropdown
                                showYearDropdown
                                yearDropdownItemNumber={15}
                                scrollableYearDropdown
                                dropdownMode="select"
                              />
                            </div>

                            {errors.birthDate && (
                              <small className="text-danger">{errors.birthDate}</small>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>
                              {' '}
                              First Name <span className="text-danger">*</span>
                            </Label>
                            <input
                              type="text"
                              className={
                                errors.firstName ? 'is-invalid form-control' : 'form-control'
                              }
                              name="firstName"
                              value={formData.firstName}
                              maxLength="30"
                              onChange={handleChange}
                            />

                            {errors.firstName && (
                              <small className="text-danger">{errors.firstName}</small>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>
                              Last Name <span className="text-danger">*</span>
                            </Label>
                            <input
                              type="text"
                              className={
                                errors.lastName ? 'is-invalid form-control' : 'form-control'
                              }
                              name="lastName"
                              value={formData.lastName}
                              maxLength="30"
                              onChange={handleChange}
                            />
                            {errors.lastName && (
                              <small className="text-danger">{errors.lastName}</small>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>Middle Name</Label>
                            <input
                              type="text"
                              className="form-control"
                              name="middleName"
                              value={formData.middleName}
                              maxLength="30"
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-4 mt-2 col-lg-4 col-xl-4">
                          <Button
                            // type="submit"
                            color="success"
                            className="CustomMarginBtn"
                            disabled={loading}
                            onClick={handleSearch}
                          >
                            {loading ? (
                              <>
                                <Spinner size="sm" /> Get Details...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-search pe-1" /> Get Details
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="card-header bg-light py-3 ">
                      <div className="row g-3 align-items-center">
                        <div className="col">
                          <h5 className="header-title mb-0 text-success">
                            <i className="far fa-user  pe-2" /> Profile Details
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <Label>
                            Gender <span className="text-danger">*</span>
                          </Label>
                          <div className="mb-3">
                            <Input
                              type="select"
                              name="rbmale"
                              className={errors.rbmale ? 'is-invalid form-control' : 'form-control'}
                              value={
                                formData.rbmale === null
                                  ? ''
                                  : formData.rbmale === true
                                  ? 'Male'
                                  : 'Female'
                              }
                              onChange={handleChange}
                              aria-label="Gender select"
                            >
                              <option>Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </Input>
                            {errors.rbmale && (
                              <small className="text-danger">{errors.rbmale}</small>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>Marital Status</Label>
                            <select
                              id="maritalStat"
                              name="maritalStat"
                              className="form-control"
                              value={formData.maritalStat} // Bind to formData.MaritalStat
                              onChange={handleChange} // Handle changes
                            >
                              <option value="">Select Marital Status</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" mb-2"></div>
                    <div className="card-header bg-light py-3 ">
                      <div className="row g-3 align-items-center">
                        <div className="col">
                          <h5 className="header-title mb-0 text-success">
                            <i className="fas fa-map-marker-alt f-20" /> Address Details
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>
                              Address #1 <span className="text-danger">*</span>
                            </Label>
                            <input
                              type="text"
                              className={
                                errors.address1 ? 'is-invalid form-control' : 'form-control'
                              }
                              name="address1"
                              value={formData.address1}
                              maxLength="250"
                              onChange={handleChange}
                            />
                            {errors.address1 && (
                              <small className="text-danger">{errors.address1}</small>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>Address #2</Label>
                            <input
                              type="text"
                              className="form-control"
                              name="address2"
                              value={formData.address2}
                              maxLength="250"
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>City</Label>
                            <input
                              type="text"
                              className="form-control"
                              name="city"
                              value={formData.city}
                              maxLength="50"
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>Postal Code</Label>
                            <input
                              type="text"
                              className="form-control"
                              name="zip"
                              value={formData.zip}
                              //onChange={handleChange}
                              maxLength="10"
                              onChange={(e) => {
                                if (/^[a-zA-Z0-9]*$/.test(e.target.value)) {
                                  handleChange(e);
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>
                              Country
                              {/* <span className="text-danger">*</span>{' '} */}
                            </Label>
                            <Input
                              type="select"
                              className={
                                errors.address1 ? 'is-invalid form-control' : 'form-control'
                              }
                              name="country"
                              onChange={handleChange}
                              value={formData.country}
                            >
                              <option selected="">Select Country</option>
                              <option value="India">Saint Kitts</option>
                              <option value="Nevis">Nevis</option>
                            </Input>
                            {errors.country && (
                              <small className="text-danger">{errors.country}</small>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>
                              Email
                              {/* <span className="text-danger">*</span>{' '} */}
                            </Label>
                            <input
                              type="mail"
                              className="form-control"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4 font_custom">
                          <div className="mb-3">
                            <Label>
                              Mobile Number
                              {/* <span className="text-danger">*</span> */}
                            </Label>

                            <PhoneInput
                              defaultCountry="kn" // Set default country (e.g., India)
                              value={formData.mobile}
                              onChange={handlePhoneChange}
                              inputClass={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                              inputProps={{
                                id: 'mobile',
                                placeholder: 'Enter mobile number',
                                maxLength: 20,
                              }}
                              style={{ height: '48px', width: '100%', fontSize: '14px!important' }}
                              forceDialCode
                            />
                            {errors.mobiles && (
                              <small className="text-danger">{errors.mobiles}</small>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>
                              Phone Number
                              {/* <span className="text-danger">*</span>{' '} */}
                            </Label>
                            <input
                              type="text"
                              className={errors.phone ? 'is-invalid form-control' : 'form-control'}
                              name="phone"
                              value={formData.phone}
                              onChange={(e) => {
                                if (/^[^a-zA-Z]*$/.test(e.target.value)) {
                                  handleChange(e);
                                }
                              }}
                              maxLength="15"
                            />
                            {errors.phone && <small className="text-danger">{errors.phone}</small>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" mb-2"></div>
                    <div className="card-header bg-light py-3 ">
                      <div className="row g-3 align-items-center">
                        <div className="col">
                          <h5 className="header-title mb-0 text-success">
                            <i className="far fa-file-alt f-18" /> Other Details{' '}
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>Commencement</Label>

                            <div className="dateWidth">
                              <DatePicker
                                selected={
                                  formData.commencementDate
                                    ? moment(formData.commencementDate, 'YYYY-MM-DD').toDate()
                                    : null
                                }
                                onChange={handleDateChangeCommencement}
                                dateFormat="dd-MMM-yyyy"
                                className={`form-control ${
                                  errors.commencementDate ? 'is-invalid' : ''
                                }`}
                                placeholderText="dd-mmm-yyyy"
                                showMonthDropdown
                                showYearDropdown
                                yearDropdownItemNumber={15}
                                scrollableYearDropdown
                                dropdownMode="select"
                                isClearable
                                onKeyDown={(e) => e.preventDefault()}
                              />
                            </div>

                            {/* {errors.commencementDate && (
                              <small className="text-danger">{errors.commencementDate}</small>
                            )} */}
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>Termination </Label>

                            <div className="dateWidth">
                              <DatePicker
                                selected={
                                  formData.terminated
                                    ? moment(formData.terminated, 'YYYY-MM-DD').toDate()
                                    : null
                                }
                                onChange={handleDateChangeTerminated} // Calls function on date change
                                dateFormat="dd-MMM-yyyy" // Display format (e.g., 15-Mar-2025)
                                className="form-control"
                                placeholderText="dd-mmm-yyyy"
                                minDate={
                                  formData.commencementDate
                                    ? new Date(formData.commencementDate)
                                    : null
                                } // Restrict min date
                                disabled={!formData.commencementDate} // Disable if commencement date is not selected
                                isClearable // Allows clearing the date
                                onKeyDown={(e) => e.preventDefault()} // Disable manual input
                                showMonthDropdown // Show the month dropdown
                                showYearDropdown // Show the year dropdown
                                yearDropdownItemNumber={15} // Number of years to display in the year dropdown
                                scrollableYearDropdown // Make the year dropdown scrollable
                                dropdownMode="select" // To ensure dropdown mode is used
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>Occupation </Label>
                            <input
                              type="text"
                              className="form-control"
                              name="occupation"
                              maxLength="50"
                              value={formData.occupation}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>
                              Pay Period <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="select"
                              id="PayPeriod"
                              name="payPeriod"
                              className={
                                errors.payPeriod ? 'is-invalid form-control' : 'form-control'
                              }
                              value={formData.payPeriod} // Bind to formData
                              onChange={handleChange} // Handle changes
                            >
                              <option value="">Select Period</option>
                              <option value="Weekly">W - Weekly</option>
                              <option value="Monthly">M - Monthly</option>
                              <option value="Every Two Weeks">E2W - Every Two Weeks</option>
                              <option value="Twice Monthly">2M - Twice Monthly</option>
                            </Input>
                            {errors.payPeriod && (
                              <small className="text-danger">{errors.payPeriod}</small>
                            )}
                          </div>
                        </div>

                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>
                              Salary <span className="text-danger">*</span>
                            </Label>
                            <input
                              type="text"
                              className={errors.wadeg ? 'is-invalid form-control' : 'form-control'}
                              name="wadeg"
                              value={formData.wadeg}
                              onChange={({ target: { value } }) => {
                                if (/[a-zA-Z]/.test(value)) {
                                  return; // Exit if any alphabetic characters are detected
                                }

                                const cleanedValue = value.replace(/[^0-9.]/g, '');

                                let formattedValue = cleanedValue;
                                if (cleanedValue.length > 6 && !cleanedValue.includes('.')) {
                                  formattedValue = `${cleanedValue.slice(
                                    0,
                                    6,
                                  )}.${cleanedValue.slice(6, 8)}`;
                                }

                                const regex = /^(\d{0,6})(\.\d{0,2})?$/;
                                if (regex.test(formattedValue)) {
                                  setFormData({
                                    ...formData,
                                    wadeg: formattedValue,
                                  });
                                }
                              }}
                            />
                            {errors.wadeg && <small className="text-danger">{errors.wadeg}</small>}
                          </div>
                        </div>

                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>Department </Label>
                            <input
                              type="text"
                              className="form-control"
                              name="department"
                              maxLength="50"
                              value={formData.department}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn btn-success px-4 me-3"
                          >
                            {loading ? (
                              <>
                                {' '}
                                <Spinner size="sm" /> Saving...
                              </>
                            ) : (
                              <>Save</>
                            )}
                          </button>
                          <Link to="/apps/director/NwDirector">
                            <button type="button" className="btn btn-light border px-4">
                              Cancel
                            </button>
                          </Link>
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
    </div>
  );
};
export default AddNonWorkingDirector;
