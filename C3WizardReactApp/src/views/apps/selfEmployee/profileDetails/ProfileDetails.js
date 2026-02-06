import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { Label, Spinner, Input } from 'reactstrap';
import HttpCommon from '../../../../baseUrl/HttpCommon';
import { clearMessage, setMessage } from '../../../../store/apps/message/MessageSlice';
import {
  getPersonalDetail,
  updatePersonal,
  getCategory,
  getCountry,
} from '../../../../store/apps/selfEmployee/PersonalDetails';
import Loader from '../../../../layouts/loader/Loader';

const ProfileDetails = () => {
  const location = useLocation();

  const dispatch = useDispatch();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const { PersonalData, CategoryData, CountryData, loading } = useSelector(
    (state) => state.personalDetails,
  );
  const navigate = useNavigate();
  const selfEmployeeid = localStorage.getItem('companyId');
  const { message, type: messageType } = useSelector((state) => state?.messageReducer);
  const userId = localStorage.getItem('userID') || '';
  const userPass = localStorage.getItem('userPassword') || '';
  const [showAnswerFirst, setShowAnswerFirst] = useState(false);
  const [showAnswerSecond, setShowAnswerSecond] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    employeeId: 0,
    socSecNum: '',
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '2025-Jan-04',
    rblgender: null,
    address1: '',
    category_Type: 5,
    address2: '',
    city: '',
    country: '0',
    zip: '',
    phone: '',
    mobile: '+1-869-',
    email: '',
    tin: '',
    maritalStat: '',
    occupation: null,
    mode: null,
    helperCompanyId: selfEmployeeid,
    helperLoginId: userId,
    helperUser_Password: userPass,

    question1: '',
    question2: '',
    answer1: '',
    answer2: '',
  });

  const handlePhoneChange = (phone) => {
    const cleaned = phone.replace(/\s|-/g, ''); // remove spaces or dashes
    const formatted =
      cleaned.startsWith('+') && cleaned.length > 4
        ? `${cleaned.slice(0, 5)} - ${cleaned.slice(5)}`
        : phone;

    setFormData((prev) => ({
      ...prev,
      mobile: formatted,
    }));
  };

  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles.find(
    (role) => role.description.toUpperCase() === 'PERSONAL DETAILS',
  );
  const canEditProfileDetails = employerPermission?.updatePermission;
  const canViewProfileDetails = employerPermission?.viewPermission;

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      birthDate: date ? moment(date).format('YYYY-MM-DD') : '',
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      birthDate: '',
    }));
  };

  const validateForm = () => {
    const formErrors = {};

    if (!formData.socSecNum) {
      formErrors.socSecNum = 'Social Security number is required.';
    } else if (formData.socSecNum.length !== 6) {
      formErrors.socSecNum = 'Social Security number must be exactly 6 digits.';
    }

    if (!formData.firstName) {
      formErrors.firstName = 'First Name is required.';
    }

    if (!formData.lastName) {
      formErrors.lastName = 'Last Name is required.';
    }

    if (!formData.category_Type) {
      formErrors.category_Type = 'Category Type  is required.';
    }

    if (!formData.country) {
      formErrors.country = 'Country is required.';
    }

    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      formErrors.email = 'Email is required';
    } else if (/\s/.test(email)) {
      formErrors.email = 'Email cannot contain spaces';
    } else if (!emailRegex.test(email)) {
      formErrors.email = 'Invalid email format';
    } else {
      const localPart = email.split('@')[0]; // Get part before '@'
      if (localPart.length < 1 || localPart.length > 64) {
        formErrors.email = 'Email  must be between 1 and 64 characters';
      }
    }

    const getValidNumberLength = (number, prefix = '') => {
      if (!number) return 0;
      const cleanedNumber = number.replace(/\D/g, '');

      return cleanedNumber.length - prefix.replace(/\D/g, '').length;
    };

    const mobileDigits = getValidNumberLength(formData.mobile, '+1-869-');
    const phoneDigits = getValidNumberLength(formData.phone, '');

    if (!mobileDigits && !phoneDigits) {
      formErrors.mobiles = 'Either Mobile or Phone is required';
    }
    // Validate mobile number only if it's entered and incorrect
    if (mobileDigits > 0 && (mobileDigits < 7 || mobileDigits > 15)) {
      formErrors.mobiles = 'Mobile number must be between 7 and 15 digits';
    }
    // Validate phone number only if it's entered and incorrect
    if (phoneDigits > 0 && (phoneDigits < 7 || phoneDigits > 15)) {
      formErrors.phone = 'Phone number must be between 7 and 15 digits';
    }

    if (!formData.question1) {
      formErrors.question1 = 'Security question #1 is required';
    }

    if (!formData.question2) {
      formErrors.question2 = 'Security question #2 is required';
    }

    // ✅ Check if both selected questions are the same
    if (formData.question1 && formData.question2 && formData.question1 === formData.question2) {
      formErrors.question2 = 'Security question #2 must be different from question #1';
    }

    if (!formData.answer1) {
      formErrors.answer1 = 'Answer1 is required';
    }

    if (!formData.answer2) {
      formErrors.answer2 = 'Answer2 is required';
    }

    if (!formData.birthDate) {
      formErrors.birthDate = 'BirthDate is required';
    }

    return formErrors;
  };

  useEffect(() => {
    if (canViewProfileDetails === false) {
      navigate('/login');
    }
  }, [canViewProfileDetails, navigate]);

  useEffect(() => {
    dispatch(getPersonalDetail({ selfEmployeeid }));
  }, []);

  useEffect(() => {
    if (PersonalData) {
      setFormData(PersonalData);
    }
  }, [PersonalData]);

  useEffect(() => {
    if (selfEmployeeid) {
      console.log('personalData', formData);
    }
  }, []);

  useEffect(() => {
    dispatch(getCategory());
    dispatch(getCountry());
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === 'mobile') {
      const prefix = '+1-869-';

      // Ensure the input always starts with the prefix
      if (!value.startsWith(prefix)) {
        newValue = prefix;
      } else {
        // Allow only numbers after the prefix
        newValue = prefix + value.slice(prefix.length).replace(/[^0-9]/g, '');
      }
    }

    // Convert "true"/"false" string values to actual boolean
    if (name === 'rblgender') {
      newValue = value === 'true'; // Converts "true" to true and "false" to false
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      mobile: value ? '' : prevErrors.mobile, // Remove Mobile error if there's a value
      phoneOrMobile: value || formData.phone ? '' : prevErrors.phoneOrMobile, // Remove combined error
    }));

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoadingProfile(true);

      const updatedFormData = {
        ...formData,
        // country: String(formData.country),
        helperCompanyId: localStorage.getItem('companyId') || '0',
        helperLoginId: localStorage.getItem('userID') || '',
        helperUser_Password: localStorage.getItem('userPassword') || '',
        mode: 2,
      };
      dispatch(updatePersonal(updatedFormData))
        .unwrap()
        .then((result) => {
          // navigate('/apps/dashboards');
        })
        .catch((err) => {
          console.error('Error:', err);
        })
        .finally(() => {
          setLoadingProfile(false);
        });
    }
  };

  const dateTimeNew = formData?.birthDate
    ? moment(formData.birthDate).format('YYYY-MM-DD') // Ensure it's YYYY-MM-DD for input type="date"
    : '';

  return (
    <>
      <Helmet>
        <title>C3 wizard - Personal Details</title>
      </Helmet>
      <div id="layout-wrapper">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
          <ul className="d-flex align-items-center gap-2 mt-3 list-unstyled">
            <li className="fw-medium">
              <Link to="/apps/dashboards" className="d-flex align-items-center gap-1 text-muted">
                <i className="ti-home" />
                Dashboard{' '}
              </Link>
            </li>
            <li>-</li>
            {/* <li className="fw-medium">
                    <span className="d-flex align-items-center gap-1 text-muted">NW</span>
                  </li> */}
            <li>-</li>
            <li className="fw-medium"> Personal Details </li>
          </ul>
        </div>
        {/* {loading ? (
          <Loader />
        ) : (
          <> */}
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
                              <i className="far fa-user text-success pe-2" />
                              Self Employee basic details
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>
                                Social Security <span className="text-danger">*</span>
                              </Label>
                              <input
                                type="text"
                                className="form-control"
                                id="regNumber"
                                placeholder=""
                                name="socSecNum"
                                value={formData.socSecNum}
                                onChange={handleInputChange}
                                disabled
                              />

                              {errors.socSecNum && (
                                <div className="text-danger">{errors.socSecNum}</div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>
                                Email Id <span className="text-danger">*</span>
                              </Label>
                              <input
                                type="text"
                                name="email"
                                className="form-control"
                                id="email"
                                placeholder=""
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled
                              />
                              {/* <span class="form_icon"><i class="far fa-envelope"></i></span> */}
                              {errors.email && <div className="text-danger">{errors.email}</div>}
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>
                                First Name <span className="text-danger">*</span>{' '}
                              </Label>
                              <input
                                type="text"
                                className="form-control"
                                id="First Name"
                                name="firstName"
                                placeholder=""
                                value={formData.firstName}
                                onChange={handleInputChange}
                              />
                              {errors.firstName && (
                                <div className="text-danger">{errors.firstName}</div>
                              )}
                            </div>
                          </div>

                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>Last Name </Label> <span className="text-danger">*</span>{' '}
                              <input
                                type="text"
                                className="form-control"
                                id="tradeName"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                              />
                              {errors.lastName && (
                                <div className="text-danger">{errors.lastName}</div>
                              )}
                            </div>
                          </div>

                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            <Label>
                              Date of Birth <span className="text-danger">*</span>
                            </Label>

                            <div className="mb-3">
                              <DatePicker
                                selected={formData?.birthDate ? new Date(formData.birthDate) : null}
                                onChange={handleDateChange}
                                dateFormat="dd-MMM-yyyy" // ✅ display format like 12-Mar-2025
                                placeholderText="dd-mm-yyyy"
                                maxDate={
                                  new Date(new Date().setFullYear(new Date().getFullYear() - 10))
                                }
                                className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
                                disabled
                                showMonthDropdown
                                showYearDropdown
                                yearDropdownItemNumber={15}
                                scrollableYearDropdown
                                dropdownMode="select"
                                isClearable
                                onChangeRaw={(e) => {
                                  if (!e || !e.target || e.target.tagName !== 'INPUT') return;

                                  const raw = e.target.value ?? '';
                                  // Only allow numeric characters (0-9), no dashes allowed manually
                                  let input = raw.replace(/[^0-9]/g, ''); // keep only numbers, remove all dashes

                                  // Auto-insert dash after day (2 digits)
                                  if (input.length > 2)
                                    input = `${input.slice(0, 2)}-${input.slice(2)}`;
                                  // Auto-insert dash after month (2 digits)
                                  if (input.length > 5)
                                    input = `${input.slice(0, 5)}-${input.slice(5)}`;

                                  // Limit length (dd-mm-yyyy => max 10 chars)
                                  e.target.value = input.slice(0, 10);

                                  // Try to parse and validate the date
                                  const cleanInput = input.replace(/\D/g, '');
                                  if (cleanInput.length === 8) {
                                    const formattedDate = `${cleanInput.slice(
                                      0,
                                      2,
                                    )}-${cleanInput.slice(2, 4)}-${cleanInput.slice(4)}`;
                                    const parsed = moment(formattedDate, ['DD-MM-YYYY'], true);
                                    if (parsed.isValid()) {
                                      handleDateChange(parsed.toDate()); // update state
                                    }
                                  }
                                }}
                              />
                              {errors.birthDate && (
                                <div className="text-danger">{errors.birthDate}</div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>
                                Category Type <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                className="form-control"
                                name="category_Type"
                                id="category_Type"
                                value={formData?.category_Type} // Set the value dynamically
                                onChange={handleInputChange}
                                disabled
                              >
                                <option selected>Select Wage Category</option>
                                {CategoryData?.map((category, index) => (
                                  <option key={index} value={category.categoryID}>
                                    {/* // <option key={index} value={index}> */}
                                    {category.categoryDescription}
                                  </option>
                                ))}
                              </Input>
                              {errors.category_Type && (
                                <div className="text-danger">{errors.category_Type}</div>
                              )}
                            </div>
                          </div>
                          <div className="'col-md-6 col-lg-6 col-xl-6 font_custom">
                            <div className="mb-3">
                              <Label>
                                Mobile Number<span className="text-danger">*</span>
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
                                style={{
                                  height: '42px',
                                  width: '100%',
                                  marginBottom: '10px',
                                  fontSize: '12px',
                                }}
                                forceDialCode
                              />
                              {errors.mobiles && (
                                <div className="text-danger">{errors.mobiles}</div>
                              )}
                            </div>
                          </div>
                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>
                                Phone Number<span className="text-danger">*</span>{' '}
                              </Label>
                              <input
                                type="text"
                                className="form-control"
                                id="phone"
                                name="phone"
                                placeholder=""
                                value={formData.phone}
                                onChange={handleInputChange}
                              />
                              {errors.phone && <div className="text-danger">{errors.phone}</div>}
                            </div>
                          </div>
                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label> Tin</Label>
                              <input
                                type="text"
                                className="form-control position-relative"
                                id="companyName"
                                name="tin"
                                placeholder=""
                                value={formData.tin}
                                onChange={handleInputChange}
                              />
                              {/*   <span class="form_icon"><i class="far fa-building"></i></span> */}
                              {errors.tin && <div className="text-danger">{errors.tin}</div>}
                            </div>
                          </div>
                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>Marital Status</Label>
                              <Input
                                type="select"
                                id="maritalStat"
                                name="maritalStat"
                                className="form-control"
                                value={formData.maritalStat}
                                onChange={handleInputChange}
                              >
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                              </Input>
                            </div>
                          </div>
                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>
                                Gender <span className="text-danger">*</span>{' '}
                              </Label>
                              <Input
                                type="select"
                                id="rblgender"
                                name="rblgender"
                                className="form-control"
                                value={formData.rblgender}
                                onChange={handleInputChange}
                              >
                                <option value="true">Male</option>
                                <option value="false">Female</option>
                              </Input>
                              {/* {errors.rblgender && (
                            <div className="text-danger">{errors.rblgender}</div>
                          )} */}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-header bg-light py-3 mb-2">
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
                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>
                                Address #1
                                {/* <span className="text-danger">*</span> */}
                              </Label>
                              <input
                                type="text"
                                className="form-control"
                                id="address1"
                                placeholder=""
                                name="address1"
                                value={formData.address1}
                                onChange={handleInputChange}
                              />

                              {errors.address1 && (
                                <div className="text-danger">{errors.address1}</div>
                              )}
                            </div>
                          </div>
                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>Address #2</Label>
                              <input
                                type="text"
                                className="form-control"
                                id="address2"
                                placeholder=""
                                name="address2"
                                value={formData.address2}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>City</Label>
                              <input
                                type="text"
                                className="form-control"
                                id="city"
                                placeholder=""
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                              />
                              {/*           <span class="form_icon"><i class="fas fa-city"></i></span> */}
                            </div>
                          </div>
                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>Postal Code</Label>
                              <input
                                type="text"
                                className="form-control"
                                id="zip"
                                name="zip"
                                placeholder=""
                                value={formData.zip}
                                onChange={handleInputChange}
                              />
                              {errors.zip && <div className="text-danger">{errors.zip}</div>}
                            </div>
                          </div>
                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>
                                Country <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                className="form-control"
                                value={formData.country}
                                onChange={handleInputChange}
                                id="country"
                                name="country"
                              >
                                {CountryData?.map((country, index) => (
                                  <option key={index} value={country.conId}>
                                    {country.name}
                                  </option>
                                ))}
                              </Input>
                              {errors.country && (
                                <div className="text-danger">{errors.country}</div>
                              )}
                            </div>
                          </div>
                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            <Label>Occupation</Label>
                            <div className="mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="occupation"
                                name="occupation"
                                placeholder="Enter Occupation"
                                onChange={handleInputChange}
                                value={formData.occupation}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-header bg-light py-3 mb-2">
                        <div className="row g-3 align-items-center">
                          <div className="col">
                            <h5 className="header-title mb-0 text-success">User Profile Details</h5>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>User Name</Label>
                              <input
                                type="text"
                                className={`form-control ${errors.loginId ? 'is-invalid' : ''}`}
                                id="loginId"
                                name="loginId"
                                placeholder=" First Name"
                                // onChange={handleInputChange}
                                value={formData.loginId}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-lg-6"></div>

                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>
                                Question1 <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                id="question1"
                                className="form-control"
                                name="question1"
                                value={formData.question1}
                                onChange={handleInputChange}
                              >
                                <option value="">Security Question #1</option>
                                <option value="What Is Your Birth Place">
                                  What Is Your Birth Place
                                </option>
                                <option value="What Is Your Favorite Place">
                                  What Is Your Favorite Place
                                </option>
                                <option value="What Is Your Childhood Name">
                                  What Is Your Childhood Name
                                </option>
                                <option value="What Is Your First School">
                                  What Is Your First School
                                </option>
                                <option value="What Is Your Favorite Dish">
                                  What Is Your Favorite Dish
                                </option>
                                <option value="What Is Your Favorite Snacks">
                                  What Is Your Favorite Snacks
                                </option>
                              </Input>
                              {errors.question1 && (
                                <div className="text-danger">{errors.question1}</div>
                              )}
                            </div>
                          </div>
                          <div className="'col-md-6 col-lg-6 col-xl-6 eye">
                            <div className="mb-3">
                              <Label>
                                Answer1 <span className="text-danger">*</span>
                              </Label>
                              <input
                                type={showAnswerFirst ? 'text' : 'password'}
                                className="form-control"
                                id="answer1"
                                name="answer1"
                                placeholder=" Answer #1"
                                onChange={handleInputChange}
                                value={formData.answer1}
                              />
                              <button
                                type="button"
                                className="showPassword"
                                onClick={() => setShowAnswerFirst(!showAnswerFirst)}
                                style={{ top: '47%' }}
                              >
                                {showAnswerFirst ? (
                                  <i className="fas fa-eye-slash" />
                                ) : (
                                  <i className="fas fa-eye" />
                                )}
                              </button>
                              {errors.answer1 && (
                                <div className="text-danger">{errors.answer1}</div>
                              )}
                            </div>
                          </div>

                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            <div className="mb-3">
                              <Label>
                                Question2 <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                className="form-control"
                                id="question2"
                                name="question2"
                                onChange={handleInputChange}
                                value={formData.question2}
                              >
                                <option value="">Security Question #2</option>
                                <option value="What Is Your Birth Place">
                                  What Is Your Birth Place
                                </option>
                                <option value="What Is Your Favorite Place">
                                  What Is Your Favorite Place
                                </option>
                                <option value="What Is Your Childhood Name">
                                  What Is Your Childhood Name
                                </option>
                                <option value="What Is Your First School">
                                  What Is Your First School
                                </option>
                                <option value="What Is Your Favorite Dish">
                                  What Is Your Favorite Dish
                                </option>
                                <option value="What Is Your Favorite Snacks">
                                  What Is Your Favorite Snacks
                                </option>
                              </Input>
                              {errors.question2 && (
                                <div className="text-danger">{errors.question2}</div>
                              )}
                            </div>
                          </div>
                          <div className="'col-md-6 col-lg-6 col-xl-6 eye">
                            <Label>
                              Answer2 <span className="text-danger">*</span>
                            </Label>
                            <div className="mb-3">
                              <input
                                type={showAnswerSecond ? 'text' : 'password'}
                                className="form-control"
                                id="answer2"
                                name="answer2"
                                placeholder=" Answer #2"
                                onChange={handleInputChange}
                                value={formData.answer2}
                              />
                              <button
                                type="button"
                                className="showPassword"
                                onClick={() => setShowAnswerSecond(!showAnswerSecond)}
                                style={{ top: '47%' }}
                              >
                                {showAnswerSecond ? (
                                  <i className="fas fa-eye-slash" />
                                ) : (
                                  <i className="fas fa-eye" />
                                )}
                              </button>
                              {errors.answer2 && (
                                <div className="text-danger">{errors.answer2}</div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="'col-md-6 col-lg-6 col-xl-6">
                            {canEditProfileDetails ? (
                              <button
                                type="button"
                                className="btn btn-success px-4 me-3"
                                disabled={loadingProfile}
                                // onClick={handleSubmit}
                                onClick={() => handleSubmit(formData.employeeId)}
                              >
                                {loadingProfile ? (
                                  <>
                                    <Spinner size="sm"></Spinner> Saving...
                                  </>
                                ) : (
                                  <>
                                    {' '}
                                    <i className="far fa-save pe-1" /> Save
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                className="btn btn-secondary h-45"
                                type="button"
                                disabled
                                style={{ opacity: 0.6 }}
                              >
                                Save
                              </button>
                            )}

                            <Link to="/apps/dashboards">
                              <button type="button" className="btn btn-light border px-4">
                                <i className="fas fa-times" /> Cancel
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
        {/* </>
        )} */}
      </div>
    </>
  );
};
export default ProfileDetails;
