import { Label, Spinner, Input } from 'reactstrap';
import { toast } from 'react-toastify';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getByIdNonWorkingDirectory,
  editNonWorkingDirector,
} from '../../../store/apps/nonWorkingDirectory/NonWorkingDirectory';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';

const EditNonWorkingDirectory = () => {
  const [loading, setLoading] = useState(false);
  const { getDataByID } = useSelector((state) => state.nonWorkingDirectorySlice);
  const { message, type: messageType } = useSelector((state) => state?.messageReducer);
  const CompanyId = localStorage.getItem('companyId');
  const dispatch = useDispatch('');
  const [errors, setErrors] = useState({});
  // const DirectorId = 66;
  const location = useLocation();
  const { id: employeeID } = location.state || {};
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
    wadeg: 0,
    lastPayDate: null,
    terminated: null,
    commencementDate: null,
    payPeriod: '',
    maritalStat: '',
    occupation: '',
    department: '',
    isemployeeDirector: true,
    isLevyExempt: true,
    start_Date: '',
    end_Date: '',
    monthno: 0,
    yearName: '',
    holidayPay_Date: '',
    wagespaydate: '',
    wagesAmount: 0,
    employeeID: 0,
    emplCode: 'string',
    mode: 2,
    companyid: CompanyId,
  });

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({
      ...prev,
      mobile: phone,
    }));
  };

  const handleChangeCommencement = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      commencementDate: date ? moment(date).format('YYYY-MM-DD') : null, // Store in API format
    }));
  };

  const handleDateChangeTerminated = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      terminated: date ? moment(date).format('YYYY-MM-DD') : null, // Store in API format
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
    // if (!formData.rbmale) {
    //   formErrors.rbmale = 'Gender is required.';
    // }

    if (formData.rbmale === null) {
      // Corrected the field to rbmale

      formErrors.rbmale = 'Gender is required';
    }
    // if (!formData.commencementDate) {
    //   formErrors.commencementDate = 'Commencement Date is required.';
    // }

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

    // const getValidNumberLength = (number, prefix = '') => {
    //   if (!number) return 0;
    //   const cleanedNumber = number.replace(/\D/g, '');

    //   return cleanedNumber.length - prefix.replace(/\D/g, '').length;
    // };

    // const mobileDigits = getValidNumberLength(formData.mobile, '+1-869-');
    // const phoneDigits = getValidNumberLength(formData.phone, '');

    // if (!mobileDigits && !phoneDigits) {
    //   formErrors.mobiles = 'Either Mobile or Phone is required';
    // }

    // if (mobileDigits > 0 && mobileDigits < 6) {
    //   formErrors.mobiles = 'Mobile number must be at least 7 digits';
    // }

    // if (mobileDigits > 0 && mobileDigits < 7) {
    //   formErrors.phone = 'Phone number must be at least 7 digits';
    // }

    // 13-08-2025 remove by anjani

    if (!formData.payPeriod) {
      formErrors.payPeriod = 'Pay Period is required';
    }
    if (!formData.wadeg) {
      formErrors.wadeg = 'Salary is required';
    }

    // if (!formData.payPeriod) {
    //   formErrors.payPeriod = 'Pay Period is required.';
    // }
    // if (!formData.wadeg) {
    //   formErrors.wadeg = 'Salary is required.';
    // }

    // Return errors object
    return formErrors;
  };

  useEffect(() => {
    dispatch(getByIdNonWorkingDirectory({ employeeID }));
  }, []);

 

  useEffect(() => {
    if (getDataByID) {
      setFormData((prevState) => ({
        ...prevState,
        socSecNum: getDataByID?.data?.socSecNum || '',
        firstName: getDataByID?.data?.firstName || '',
        middleName: getDataByID?.data?.middleName || '',
        lastName: getDataByID?.data?.lastName || '',
        birthDate: getDataByID?.data?.birthDate.split('T')[0],
        rbmale: getDataByID?.data?.rbmale ?? true,
        maritalStat: getDataByID?.data?.maritalStat || '',
        email: getDataByID?.data?.email || '',
        phone: getDataByID?.data?.phone || '',
        mobile: getDataByID?.data?.mobile || '',
        address1: getDataByID?.data?.address1 || '',
        address2: getDataByID?.data?.address2 || '',
        city: getDataByID?.data?.city || '',
        state: getDataByID?.data?.state || '',
        zip: getDataByID?.data?.zip || '',
        country: getDataByID?.data?.country || 'India',
        department: getDataByID?.data?.department || '',
        occupation: getDataByID?.data?.occupation || '',
        wadeg: getDataByID?.data?.wadeg ?? 0,

        //  lastPayDate: getDataByID?.data?.lastPayDate || '',
        terminated: getDataByID?.data?.terminated
          ? moment(getDataByID?.data?.terminated).format('YYYY-MM-DD')
          : null,
        commencementDate: getDataByID?.data?.commencementDate
          ? moment(getDataByID?.data?.commencementDate).format('YYYY-MM-DD')
          : null,

        payPeriod: getDataByID?.data?.payPeriod || '',
        isemployeeDirector: getDataByID?.data?.isemployeeDirector ?? true,
        isLevyExempt: getDataByID?.data?.isLevyExempt ?? true,
        start_Date: getDataByID?.data?.start_Date || '',
        end_Date: getDataByID?.data?.end_Date || '',
        monthno: getDataByID?.data?.monthno ?? 0,
        yearName: getDataByID?.data?.yearName || '',
        holidayPay_Date: getDataByID?.data?.holidayPay_Date || '',
        wagespaydate: getDataByID?.data?.wagespaydate || '',
        wagesAmount: getDataByID?.data?.wagesAmount ?? 0,
        employeeID: getDataByID?.data?.employeeID ?? 0,
        emplCode: getDataByID?.data?.emplCode || 'string',
        mode: getDataByID?.data?.mode ?? 2,
        companyid: getDataByID?.data?.companyid || CompanyId,
      }));
    }
  }, [getDataByID]);

  // const validateForm = () => {
  //   const formErrors = {};

  //   if (!formData.socSecNum) {
  //     formErrors.socSecNum = 'Social Security number is required.';
  //   } else if (formData.socSecNum.length !== 6) {
  //     formErrors.socSecNum = 'Social Security number must be exactly 6 digits.';
  //   }

  //   if (!formData.birthDate) {
  //     formErrors.birthDate = 'Date of Birth is required.';
  //   }
  //   if (!formData.firstName) {
  //     formErrors.firstName = 'First Name is required.';
  //   }
  //   if (!formData.lastName) {
  //     formErrors.lastName = 'Last Name is required.';
  //   }
  //   if (!formData.rbmale) {
  //     formErrors.rbmale = 'Gender is required.';
  //   }
  //   if (!formData.payPeriod) {
  //     formErrors.payPeriod = 'Pay Period is required.';
  //   }
  //   if (!formData.amount) {
  //     formErrors.amount = 'Salary is required.';
  //   }

  //   Return errors object
  //   return formErrors;
  // };

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;

  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [name]: '',
  //   }));

  //   const newValue = type === 'checkbox' ? checked : value;

  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [name]: newValue,
  //     // [name]: name === 'wadeg' ? parseInt(value, 10) : value,
  //   }));

  //   if (name === 'rbmale') {
  //     setFormData({
  //       ...formData,
  //       [name]: value === 'Male',
  //     });
  //   }
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // List of fields that should be set to null if the value is an empty string
    const fieldsToNullify = [
      'holidayPay_Date',
      'terminated',
      'birthDate',
      'commencementDate',
      'lastPayDate', // Added lastPayDate to the list
    ];

    // Check if the value is an empty string and set it to null for specific fields
    const processedValue = fieldsToNullify.includes(name) && value === '' ? null : value;

    // If holidayPay_Date is being updated, update both holidayPay_Date and wagespaydate
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

    setErrors((prevErrors) => ({
      ...prevErrors,
      mobile: value ? '' : prevErrors.mobile, // Remove Mobile error if there's a value
      mobiles: value || formData.phone ? '' : prevErrors.mobiles, // Remove combined error if either field is filled
    }));

    // If the radio button for gender is changed, update rbmale specifically

    if (name === 'rbmale') {
      setFormData({
        ...formData,
        [name]: value === 'Male',
      });
    }
  };

  const maxBirthDate = new Date();
  maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 10);

  // const handleDateChange = (date) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     birthDate: date ? moment(date).format("YYYY-MM-DD") : "", // Store in API format
  //   }));
  //   handleChange({ target: { name: "birthDate", value: date ? moment(date).format("YYYY-MM-DD") : "" } });
  // };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      dispatch(editNonWorkingDirector({ formData }))
        .unwrap()
        .then((res) => {
          navigate('/apps/director/NwDirector');
        })
        .catch((err) => {
           console.error('Something went wrong:', err);
        })
        .finally(() => {
          setLoading(false);
        });
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

  

  return (
    <div id="layout-wrapper">
      <my-header />

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <ul className="d-flex align-items-center gap-2 mt-3 list-unstyled">
          <li className="fw-medium">
            <span className="d-flex align-items-center gap-1 text-muted">
              {' '}
              <i className="ti-home" /> Dashboard{' '}
            </span>
          </li>
          <li>-</li>
          <li className="fw-medium">
            <span className="d-flex align-items-center gap-1 text-muted"> New Director </span>
          </li>
          <li>-</li>
          <li className="fw-medium">Edit Nw Director </li>
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
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>
                              Social Security <span className="text-danger">*</span>
                            </Label>
                            <input
                              type="text"
                              name="socSecNum"
                              disabled
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

                            <DatePicker
                              disabled
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

                                // Only allow numeric characters (0-9), no dashes allowed manually
                                let val = e.target.value.replace(/[^0-9]/g, ''); // keep only numbers, remove all dashes

                                // 🔹 Auto-insert dash after day
                                if (val.length > 2) val = `${val.slice(0, 2)}-${val.slice(2)}`;

                                // 🔹 Auto-insert dash after month
                                if (val.length > 5) val = `${val.slice(0, 5)}-${val.slice(5)}`;

                                // 🔹 Limit max length (dd-mm-yyyy → 10 chars)
                                e.target.value = val.slice(0, 10);

                                const normalizeDate = (input) => {
                                  if (!input) return null;

                                  // Case 1: 8 digits → dd-mm-yyyy
                                  if (/^\d{8}$/.test(input)) {
                                    const day = input.slice(0, 2);
                                    let month = parseInt(input.slice(2, 4), 10);
                                    month = month > 12 ? 12 : month; // ✅ auto-correct month if > 12
                                    const year = input.slice(4);
                                    input = `${day}-${month.toString().padStart(2, '0')}-${year}`;
                                  }

                                  // Case 2: dd-mm-yyyy or dd/mm/yyyy → keep numeric format
                                  if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(input)) {
                                    const [day, month, year] = input.split(/[-/]/);
                                    const monthNum = Math.min(parseInt(month, 10), 12); // ✅ cap month at 12
                                    input = `${day}-${monthNum
                                      .toString()
                                      .padStart(2, '0')}-${year}`;
                                  }

                                  // Parse only numeric date formats
                                  const parsed = moment(input, ['DD-MM-YYYY', 'DD/MM/YYYY'], true);
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
                                    const day = input.slice(0, 2);
                                    let month = parseInt(input.slice(2, 4), 10);
                                    month = month > 12 ? 12 : month; // ✅ auto-correct month if > 12
                                    const year = input.slice(4);
                                    input = `${day}-${month.toString().padStart(2, '0')}-${year}`;
                                  }

                                  if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(input)) {
                                    const [day, month, year] = input.split(/[-/]/);
                                    const monthNum = Math.min(parseInt(month, 10), 12); // ✅ cap month at 12
                                    input = `${day}-${monthNum
                                      .toString()
                                      .padStart(2, '0')}-${year}`;
                                  }

                                  // Parse only numeric date formats
                                  const parsed = moment(input, ['DD-MM-YYYY', 'DD/MM/YYYY'], true);
                                  return parsed.isValid() ? parsed.toDate() : null;
                                };

                                const normalized = normalizeDate(e.target.value);
                                setFormData((prev) => ({
                                  ...prev,
                                  birthDate: normalized
                                    ? moment(normalized).format('YYYY-MM-DD')
                                    : '',
                                }));
                              }}
                              dateFormat="dd-MM-yyyy" // Always display as 12-01-2014
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
                              disabled
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
                              disabled
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
                      </div>
                    </div>
                    <div className=" mb-2"></div>
                    <div className="card-header bg-light py-3">
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
                              <option value="">Select Gender</option>
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
                    <div className="card-header bg-light py-3">
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
                              <option value="Navis">Nevis</option>
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
                              style={{ height: '48px', width: '100%' }}
                              forceDialCode
                            />
                            {errors.mobiles && <div className="text-danger">{errors.mobiles}</div>}
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>
                              Phone Number
                              {/* <span className="text-danger">*</span> */}
                            </Label>
                            <input
                              type="text"
                              className="form-control"
                              name="phone"
                              value={formData.phone}
                              //onChange={handleChange}
                              onChange={(e) => {
                                if (/^[^a-zA-Z]*$/.test(e.target.value)) {
                                  handleChange(e);
                                }
                              }}
                              maxLength="15"
                            />

                            {errors.phone && <div className="text-danger">{errors.phone}</div>}
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

                            <DatePicker
                              selected={
                                formData.commencementDate
                                  ? moment(formData.commencementDate, 'YYYY-MM-DD').toDate()
                                  : null
                              }
                              onChange={handleChangeCommencement}
                              dateFormat="dd-MMM-yyyy" // Display format (e.g., 15-Mar-2025)
                              isClearable
                              maxDate={formData.terminated ? new Date(formData.terminated) : null} // Restrict max date
                              className={`form-control ${
                                errors.commencementDate ? 'is-invalid' : ''
                              }`} // Handle validation styling
                              placeholderText="dd-mmm-yyyy"
                              onKeyDown={(e) => e.preventDefault()} // Disable manual input
                              showMonthDropdown // Show the month dropdown
                              showYearDropdown // Show the year dropdown
                              yearDropdownItemNumber={15} // Number of years to display in the year dropdown
                              scrollableYearDropdown // Make the year dropdown scrollable
                              dropdownMode="select" // To ensure dropdown mode is used
                            />
                            {errors.commencementDate && (
                              <div className="text-danger">{errors.commencementDate}</div>
                            )}
                            {/* {errors.commencementDate && (
                              <small className="text-danger">{errors.commencementDate}</small>
                            )} */}
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>Termination</Label>

                            <DatePicker
                              // selected={formData.terminated ? new Date(formData.terminated) : null}
                              selected={
                                formData.terminated
                                  ? moment(formData.terminated, 'YYYY-MM-DD').toDate()
                                  : null
                              }
                              onChange={handleDateChangeTerminated}
                              dateFormat="dd-MMM-yyyy" // Display format (e.g., 15-Mar-2025)
                              minDate={
                                formData.commencementDate
                                  ? new Date(formData.commencementDate)
                                  : null
                              } // Restrict min date
                              className="form-control"
                              placeholderText="dd-mmm-yyyy"
                              disabled={!formData.commencementDate} // Disable if commencement date is not selected
                              isClearable
                              onKeyDown={(e) => e.preventDefault()} // Disable manual input
                              showMonthDropdown // Show the month dropdown
                              showYearDropdown // Show the year dropdown
                              yearDropdownItemNumber={15} // Number of years to display in the year dropdown
                              scrollableYearDropdown // Make the year dropdown scrollable
                              dropdownMode="select" // To ensure dropdown mode is used
                            />
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
                              //onChange={handleChange}
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
                                  formattedValue = `${cleanedValue.slice(
                                    0,
                                    6,
                                  )}.${cleanedValue.slice(6, 8)}`; // Insert decimal after 6 digits
                                }

                                // Limit to 6 digits before the decimal and 2 digits after
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
export default EditNonWorkingDirectory;
