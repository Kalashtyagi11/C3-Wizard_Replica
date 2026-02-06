import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { Label, Spinner, Input } from 'reactstrap';
import HttpCommon from '../../../baseUrl/HttpCommon';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import { postEmployer, EmployersGetById } from '../../../store/apps/employer/EmployerSlice';
import user1 from '../../../assets/images/users/Company_log.png';
import user from '../../../assets/images/users/profile.png';
import Loader from '../../../layouts/loader/Loader';

const UpdateEmployer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const CategoryType = localStorage.getItem('roleCategory');
  // const queryParams = new URLSearchParams(location.search);
  // const companyId = queryParams.get('companyId');
  const companyId = location.state?.companyId;
  const localCompanyId = localStorage.getItem('companyId');
  const [companyImage, setCompanyImage] = useState(localStorage.getItem('companyLogo') || user1);
  const [logoFile, setLogoFile] = useState(null);
  const [showAnswerFirst, setShowAnswerFirst] = useState(false);
  const [showAnswerSecond, setShowAnswerSecond] = useState(false);
  const [loading, setLoading] = useState(false);
  const { EmployersGetBydata, loading: isLoading } = useSelector((state) => state.employerSlice);
  const [errors, setErrors] = useState({});
  const { message, type: messageType } = useSelector((state) => state?.messageReducer);
  const roleId = localStorage.getItem('roleId');
  const UserId = localStorage.getItem('userID');
  const categoryRole = localStorage.getItem('roleCategory')?.trim()?.toUpperCase();
  const loginId = localStorage.getItem('userName') || '';
  const userPass = localStorage.getItem('userPassword') || '';
  const [status, setStatus] = useState('');
  const companyName = localStorage.getItem('companyName');

  const [formData, setFormData] = useState({
    companyName: '',
    tradeName: '',
    regNumber: '',
    address1: '',
    address2: '',
    city: '',
    zip: '',
    country: '',
    mobile: '+1-869-',
    landline: '',
    contactPerson: '',
    email: '',
    isLevyExempt: false,
    mode: 1,
    companyId,
    companyLogo: '',
    question1: '',
    question2: '',
    answer1: '',
    answer2: '',
    lastName: '',
    firstName: '',
    dateRegistered:'',
  });

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({
      ...prev,
      mobile: phone,
    }));
  };

  const securityQuestions = [
    'What Is Your Birth Place',
    'What Is Your Favorite Place',
    'What Is Your Childhood Name',
    'What Is Your First School',
    'What Is Your Favorite Dish',
    'What Is Your Favorite Snacks',
  ];

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prevData) => {
      let updatedValue = value;

      // Handle checkbox separately
      if (type === 'checkbox') {
        updatedValue = checked;
      } else if (id === 'mobile') {
        const prefix = '+1-869-';

        if (!value.startsWith(prefix)) {
          updatedValue = prefix;
        } else {
          const numberPart = value.slice(prefix.length).replace(/\D/g, ''); // Extract only digits
          updatedValue = prefix + numberPart;
        }

        // Validation excluding prefix
        const mobileDigits = updatedValue.slice(prefix.length); // Get only the number part
        setErrors((prevErrors) => ({
          ...prevErrors,
          mobile:
            mobileDigits.length < 7
              ? 'Mobile number must be at least 7 digits after the prefix.'
              : '',
        }));
      } else if (id === 'landline') {
        updatedValue = value.replace(/\D/g, '');

        setErrors((prevErrors) => ({
          ...prevErrors,
          mobile: value ? '' : prevErrors.mobile,
          mobiles: value || formData.phone ? '' : prevErrors.mobiles,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [id]: '',
        }));
      }

      return {
        ...prevData,
        [id]: updatedValue,
      };
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {}; // Initialize errors object
    // const prefix = '+1-869-';
    // Required field validations
    if (!formData.regNumber.trim()) {
      newErrors.regNumber = 'Registration No. is required';
    } else if (formData.regNumber.length !== 6) {
      newErrors.regNumber = 'Registration number must be exactly 6 digits.';
    }

    if (!formData.companyName.trim()) newErrors.companyName = 'Employer Name is required';
    // if (!formData.country.trim()) newErrors.country = 'Country is required';
    // if (!formData.country || formData.country === '') {
    //   newErrors.country = 'Country is required';
    // }
    // if (formData.country !== '1' && formData.country !== '2') {
    //   newErrors.country = 'Please select a valid country';
    // }
    if (!formData.email.trim()) newErrors.email = 'Email ID is required';
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    // if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid Email';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const localPart = formData.email.split('@')[0]; // Extract part before '@'

    // if (!emailRegex.test(formData.email)) {
    //   newErrors.email = 'Invalid Email';
    // } else if (localPart.length < 1 || localPart.length > 64) {
    //   newErrors.email = 'Email must be between 1 and 64 characters';
    // }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid Email';
    } else if (localPart.length < 1 || localPart.length > 64) {
      newErrors.email = 'Email must be between 1 and 64 characters';
    }

    if (!formData.address1.trim()) newErrors.address1 = 'Address #1 is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact Person is required';

    const getValidNumberLength = (number, prefix = '') => {
      if (!number) return 0;
      const cleanedNumber = number.replace(/\D/g, '');

      return cleanedNumber.length - prefix.replace(/\D/g, '').length;
    };

    const mobileDigits = getValidNumberLength(formData.mobile, '+1-869-');
    const phoneDigits = getValidNumberLength(formData.landline, '');

    if (!mobileDigits && !phoneDigits) {
      newErrors.mobiles = 'Either Mobile or Phone is required';
    }
    // Validate mobile number only if it's entered and incorrect
    if (mobileDigits > 0 && mobileDigits < 7) {
      newErrors.mobiles = 'Mobile  number must be at least 7 digits';
    }
    // Validate phone number only if it's entered and incorrect
    if (phoneDigits > 0 && phoneDigits < 7) {
      newErrors.landline = 'Phone number must be at least 7 digits';
    }

    // Security Question validation
    if (!formData.question1) {
      newErrors.question1 = 'Security Question 1 is required';
    }
    if (!formData.question2) {
      newErrors.question2 = 'Security Question 2 is required';
    }
    if (formData.question1 && formData.question2 && formData.question1 === formData.question2) {
      newErrors.question2 = 'Security Question 2 must be different from Question 1';
    }

    // Answer validation
    if (!formData.answer1.trim()) newErrors.answer1 = 'Answer 1 is required';
    if (!formData.answer2.trim()) newErrors.answer2 = 'Answer 2 is required';
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.firstName) {
      newErrors.firstName = 'First Name is required';
    }

    if (!formData.loginId) {
      newErrors.loginId = 'User Name is Required';
    }

    setErrors(newErrors); // Update state with errors

    return Object.keys(newErrors).length === 0; // Returns true if there are no errors
  };

  useEffect(() => {
    if (EmployersGetBydata) {
      const safeData = {
        ...EmployersGetBydata,
        parentCompanyId: parseInt(localStorage.getItem('parentIdID'), 10),
        question1: EmployersGetBydata?.question1 || '',
        mode: 2,

        isLevyExempt: !!EmployersGetBydata?.isLevyExempt, // ✅ Ensure checkbox gets a boolean value
      };

      // ✅ Convert all `null` values to empty string '', to avoid React input crash
      const sanitizedData = Object.fromEntries(
        Object.entries(safeData).map(([key, value]) => [
          key,
          value === null ? '' : value, // ✅ Null-safe: avoid null in controlled input fields
        ]),
      );

      setFormData((prevData) => ({
        ...prevData,
        ...sanitizedData, // ✅ Safe data used to update form
      }));

      if (EmployersGetBydata.companyLogo) {
        setCompanyImage(EmployersGetBydata.companyLogo);
      }
    }
  }, [EmployersGetBydata]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result;
        setCompanyImage(imageUrl); // Update preview
        localStorage.setItem('companyLogo', imageUrl);

        // Update form data with the new logo
        setFormData((prevData) => ({
          ...prevData,
          companyLogo: imageUrl, // Save base64 logoemp
        }));
      };
      reader.readAsDataURL(file);
      setLogoFile(file);
    }
  };

  const handleSaveEmployer = async () => {
    if (!validateForm()) {
      toast.error('Please correct the highlighted errors.');
      return;
    }

    setLoading(true);

    const updatedData = {
      ...formData,
      loginId,
      user_Password: userPass,
      isVerified: null,
      companyLogo: formData.companyLogo || localStorage.getItem('companyLogo'), // Ensure latest logo is sent
    };

    if (!logoFile) {
      delete updatedData.companyLogo; // Exclude companyLogo if no new file is selected
    }

    dispatch(postEmployer(updatedData))
      .unwrap()
      .then(() => {
        if (categoryRole === 'SSB') {
          // navigate('/apps/employerdetails');
          navigate('/admin/employer-details');
        }
        if (categoryRole === 'COMPANY') {
          navigate('/apps/employerdetails');
        }
      })
      .catch((err) => {
        // toast.error(err);
        toast.error(err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
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

  // comment because coming issue from backend side 30

  useEffect(() => {
    dispatch(EmployersGetById({companyId, UserId}));
  }, [dispatch]);

  return (
    <>
      <div id="layout-wrapper">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
          <ul className="d-flex align-items-center mt-3 gap-2 list-unstyled">
            <li className="fw-medium">
              {CategoryType === 'SSB' && (
                <Link to="/admin-dashboard" className="d-flex align-items-center gap-1 text-muted">
                  <i className="ti-home" /> Admin Dashboard{' '}
                </Link>
              )}
              {CategoryType === 'Company' && (
                <Link to="/dashboard" className="d-flex align-items-center gap-1 text-muted">
                  {' '}
                  <i className="ti-home" /> Dashboard{' '}
                </Link>
              )}
            </li>

            <li className="fw-medium">Employer Details </li>
          </ul>
        </div>
        {isLoading ? (
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
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-4">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-user text-success pe-2" />
                                  Update Employer Details
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-lg-12 mb-3  fw-bold">
                                {categoryRole === 'COMPANY' && (
                                  <span className="">
                                    {EmployersGetBydata.parentCompanyId > 0 && (
                                      <> Parent Company Name :- &nbsp; {companyName}</>
                                    )}
                                  </span>
                                )}
                              </div>
                              <div className="row d-flex align-items-center">
                                <div className="col-lg-3 mb-3">
                                  <div className="col-lg-12 mb-3">
                                    <div className="image-upload-container text-center">
                                      <Label
                                        htmlFor="company-logo-upload"
                                        className="custom-file-input-label"
                                      >
                                        <img
                                          src={companyImage}
                                          alt="Company Logo"
                                          className="image-preview"
                                          width="70"
                                          height="70"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = user1;
                                            // If image fails to load, show default
                                          }}
                                        />
                                        <div>
                                          <span className="user_change">Update Company Logo</span>
                                        </div>
                                      </Label>
                                      <input
                                        id="company-logo-upload"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleLogoChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="row col-lg-9 mb-3">
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <Label>
                                        Registration No. <span className="text-danger">*</span>
                                      </Label>
                                      <input
                                        type="text"
                                        className={`form-control ${
                                          errors.regNumber ? 'is-invalid' : ''
                                        }`}
                                        disabled
                                        id="regNumber"
                                        placeholder=""
                                        value={formData.regNumber}
                                        onChange={handleChange}
                                        readOnly
                                      />
                                      {errors.regNumber && (
                                        <div className="text-danger">{errors.regNumber}</div>
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
                                        // className="form-control"
                                        className={`form-control ${
                                          errors.email ? 'is-invalid' : ''
                                        }`}
                                        id="email"
                                        placeholder=""
                                        value={formData.email}
                                        onChange={handleChange}
                                      />
                                      {errors.email && (
                                        <div className="text-danger">{errors.email}</div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <Label>Trade Name(If any) </Label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        // className={`form-control ${errors.tradeName ? "is-invalid" : ""}`}
                                        id="tradeName"
                                        placeholder=""
                                        value={formData.tradeName}
                                        onChange={handleChange}
                                      />
                                      {/*  <span class="form_icon"><i class="far fa-user"></i></span> */}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <Label>
                                        Contact Person <span className="text-danger">*</span>
                                      </Label>
                                      <input
                                        type="text"
                                        // className="form-control"
                                        className={`form-control ${
                                          errors.contactPerson ? 'is-invalid' : ''
                                        }`}
                                        id="contactPerson"
                                        placeholder=""
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                      />
                                      {errors.contactPerson && (
                                        <div className="text-danger">{errors.contactPerson}</div>
                                      )}
                                    </div>
                                  </div>
                                  {/* <Label for="Either Enter The Mobile Number OR Phone Number">
                              Either Enter The Mobile Number OR Phone Number{' '}
                              <span className="text-danger">*</span>
                            </Label> */}
                                  <div className="col-md-6 col-lg-6 col-xl-6 font_custom">
                                    <div className="mb-3">
                                      <Label>
                                        Mobile Number <span className="text-danger">*</span>
                                      </Label>

                                      <PhoneInput
                                        defaultCountry="kn" // Set default country (e.g., India)
                                        value={formData.mobile}
                                        onChange={handlePhoneChange}
                                        inputClass={`form-control ${
                                          errors.mobile ? 'is-invalid' : ''
                                        }`}
                                        inputProps={{
                                          id: 'mobile',
                                          placeholder: 'Enter mobile number',
                                          maxLength: 20,
                                        }}
                                        style={{ height: '48px', width: '100%' }}
                                        forceDialCode
                                      />
                                      {errors.mobiles && (
                                        <div className="text-danger">{errors.mobiles}</div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <Label>
                                        Phone Number <span className="text-danger">*</span>
                                      </Label>
                                      <input
                                        type="text"
                                        className={`form-control ${
                                          errors.landline ? 'is-invalid' : ''
                                        }`}
                                        id="landline"
                                        placeholder=""
                                        value={formData.landline}
                                        onChange={handleChange}
                                        maxLength={15}
                                        //title="Please enter a valid phone number with at least 7 digits."
                                      />
                                      {errors.landline && (
                                        <div className="text-danger">{errors.landline}</div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <Label>
                                        {' '}
                                        Name of Company <span className="text-danger">*</span>
                                      </Label>
                                      <input
                                        type="text"
                                        // className="form-control position-relative"
                                        className={`position-relative form-control ${
                                          errors.companyName ? 'is-invalid' : ''
                                        }`}
                                        id="companyName"
                                        placeholder=""
                                        value={formData.companyName}
                                        onChange={handleChange}
                                      />
                                      {errors.companyName && (
                                        <div className="text-danger">{errors.companyName}</div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <Label>Is Levy Exempt ? </Label>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id="isLevyExempt"
                                          checked={formData.isLevyExempt}
                                          onChange={handleChange}
                                        />
                                        <Label
                                          className="form-check-Label"
                                          htmlFor="formCheck1"
                                        ></Label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* </div> */}
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
                              <div className="col-md-6 col-lg-6 col-xl-6">
                                <div className="mb-3">
                                  <Label>
                                    Address #1 <span className="text-danger">*</span>
                                  </Label>
                                  <input
                                    type="text"
                                    // className="form-control"
                                    className={`form-control ${
                                      errors.address1 ? 'is-invalid' : ''
                                    }`}
                                    id="address1"
                                    placeholder=""
                                    value={formData.address1}
                                    onChange={handleChange}
                                  />
                                  {errors.address1 && (
                                    <div className="text-danger">{errors.address1}</div>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-6 col-xl-6">
                                <div className="mb-3">
                                  <Label>Address #2</Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    // className={`form-control ${errors.address2 ? "is-invalid" : ""}`}
                                    id="address2"
                                    placeholder=""
                                    value={formData.address2}
                                    onChange={handleChange}
                                  />
                                  {/*      <span class="form_icon"><i class="fas fa-map-marker-alt"></i></span> */}
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-6 col-xl-6">
                                <div className="mb-3">
                                  <Label>City</Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="city"
                                    placeholder=""
                                    value={formData.city}
                                    onChange={handleChange}
                                  />
                                  {/*           <span class="form_icon"><i class="fas fa-city"></i></span> */}
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-6 col-xl-6">
                                <div className="mb-3">
                                  <Label>Postal Code</Label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="zip"
                                    placeholder=""
                                    value={formData.zip}
                                    onChange={handleChange}
                                  />
                                  {/*   <span class="form_icon"><i class="fas fa-map-marker-alt"></i></span> */}
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-6 col-xl-6">
                                <div className="mb-3">
                                  <Label>
                                    Country
                                    {/* <span className="text-danger">*</span>{' '} */}
                                  </Label>
                                  <Input
                                    type="select"
                                    // className="form-select"
                                    name="country"
                                    className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                                    aria-label="Default select example"
                                    id="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                  >
                                    <option value="">Select Country</option>
                                    <option value={1}>Saint Kitts</option>
                                    <option value={2}>Nevis</option>
                                  </Input>
                                  {errors.country && (
                                    <div className="text-danger">{errors.country}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className=" mb-2"></div>
                          {EmployersGetBydata?.parentCompanyId === 0 && (
                            <div className="card-header bg-light py-3 ">
                              <div className="row g-3 align-items-center">
                                <div className="col">
                                  <h5 className="header-title mb-0 text-success">
                                    User Profile Details
                                  </h5>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="card-body">
                            {EmployersGetBydata?.parentCompanyId === 0 && (
                              <div className="row">
                                <div className="col-md-6 col-lg-6 col-xl-6">
                                  <div className="mb-3">
                                    <Label>User Name</Label>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        errors.loginId ? 'is-invalid' : ''
                                      }`}
                                      id="loginId"
                                      name="loginId"
                                      placeholder=" First Name"
                                      onChange={handleChange}
                                      disabled={CategoryType !== 'SSB'}
                                      value={formData.loginId}
                                    />
                                    {errors.loginId && (
                                      <div className="text-danger">{errors.loginId}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-6"></div>
                                <div className="col-md-6 col-lg-6 col-xl-6">
                                  <div className="mb-3">
                                    <Label>
                                      First Name <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        errors.firstName ? 'is-invalid' : ''
                                      }`}
                                      id="firstName"
                                      name="firstName"
                                      placeholder=" First Name"
                                      onChange={handleChange}
                                      value={formData.firstName}
                                    />
                                    {errors.firstName && (
                                      <div className="text-danger">{errors.firstName}</div>
                                    )}
                                  </div>
                                </div>

                                <div className="col-md-6 col-lg-6 col-xl-6">
                                  <div className="mb-3">
                                    <Label>
                                      Last Name <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        errors.lastName ? 'is-invalid' : ''
                                      }`}
                                      id="lastName"
                                      name="lastName"
                                      placeholder=" Enter Last Name"
                                      onChange={handleChange}
                                      value={formData.lastName}
                                    />
                                    {errors.lastName && (
                                      <div className="text-danger">{errors.lastName}</div>
                                    )}
                                  </div>
                                </div>

                                <div className="col-md-6 col-lg-6 col-xl-6">
                                  <div className="mb-3">
                                    <Label>
                                      Question1 <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                      type="select"
                                      id="question1"
                                      className={`form-control ${
                                        errors.question1 ? 'is-invalid' : ''
                                      }`}
                                      name="question1"
                                      value={formData.question1 || ''}
                                      onChange={handleChange}
                                    >
                                      <option value="">Security Question #1</option>
                                      {securityQuestions.map((question, index) => (
                                        <option key={index} value={question}>
                                          {question}
                                        </option>
                                      ))}
                                    </Input>
                                    {errors.question1 && (
                                      <div className="text-danger">{errors.question1}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-6 eye">
                                  <div className="mb-3">
                                    <Label>
                                      Answer1 <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                      type={showAnswerFirst ? 'text' : 'password'}
                                      className={`form-control ${
                                        errors.answer1 ? 'is-invalid' : ''
                                      }`}
                                      id="answer1"
                                      name="answer1"
                                      placeholder=" Answer #1"
                                      onChange={handleChange}
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
                                <div className="col-md-6 col-lg-6 col-xl-6">
                                  <div className="mb-3">
                                    <Label>
                                      Question2 <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                      type="select"
                                      id="question2"
                                      className={`form-control ${
                                        errors.question2 ? 'is-invalid' : ''
                                      }`}
                                      name="question2"
                                      value={formData.question2 || ''}
                                      onChange={handleChange}
                                    >
                                      <option value="">Security Question #2</option>
                                      {securityQuestions.map((question, index) => (
                                        <option key={index} value={question}>
                                          {question}
                                        </option>
                                      ))}
                                    </Input>
                                    {errors.question2 && (
                                      <div className="text-danger">{errors.question2}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-6 eye">
                                  <Label>
                                    Answer2 <span className="text-danger">*</span>
                                  </Label>
                                  <div className="mb-3">
                                    <input
                                      type={showAnswerSecond ? 'text' : 'password'}
                                      className={`form-control ${
                                        errors.answer2 ? 'is-invalid' : ''
                                      }`}
                                      id="answer2"
                                      name="answer2"
                                      placeholder=" Answer #2"
                                      onChange={handleChange}
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
                            )}

                            <div className="row mt-3">
                              <div className="col-md-4 col-lg-4 col-xl-4">
                                <button
                                  type="button"
                                  className="btn btn-success px-4 me-3"
                                  disabled={loading}
                                  onClick={handleSaveEmployer}
                                >
                                  {loading ? (
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
                                <button
                                  type="button"
                                  className="btn btn-light border px-4"
                                  onClick={() => navigate(-1)}
                                >
                                  <i className="fas fa-times" /> Cancel
                                </button>
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
          </>
        )}
      </div>
    </>
  );
};
export default UpdateEmployer;
