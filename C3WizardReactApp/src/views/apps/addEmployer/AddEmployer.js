import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import { Label, Spinner } from 'reactstrap';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import { postEmployer, EmployersGetById } from '../../../store/apps/employer/EmployerSlice';
import { checkUserCompany } from '../../../store/apps/auth/AuthSlice';
import { getCompanyDropdown } from '../../../store/apps/dashboard/DashboardSlice';
import user1 from '../../../assets/images/users/Company_log.png';

const AddEmployer = () => {
  const location = useLocation();
  const CompanyId = localStorage.getItem('companyId');
  const UserId = localStorage.getItem('userID');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { EmployersGetBydata } = useSelector((state) => state.employerSlice);
  const navigate = useNavigate();
  const { message, type: messageType } = useSelector(
    (state) => (state && state.messageReducer) || {},
  );
  const [companyImage, setCompanyImage] = useState(null);
  const [InputLoading, setInputLoading] = useState(false);
  const [error, setError] = useState({});
  const [backendMessage, setBackendMessage] = useState('');
  const isEdit = location && location.state && location.state.isEdit;

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
    mobile: '',
    landline: '',
    contactPerson: '',
    email: '',
    isLevyExempt: false,
    mode: 1,
    companyId: 0,
    companyLogo: '',
    parentCompanyId: localStorage.getItem('parentIdID'),
    userId: UserId,
    officeCode:'',
  });

  const [errors, setErrors] = useState({});

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({
      ...prev,
      mobile: phone,
    }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked, files } = e.target;

    if (type === 'file' && files && files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(`Base64 ${id}:`, reader.result);

        if (id === 'company-logo-upload') {
          setCompanyImage(reader.result);

          setFormData((prevData) => ({
            ...prevData,
            companyLogo: reader.result,
          }));
        }
      };

      reader.readAsDataURL(file);
      return;
    }

    if (id === 'regNumber') {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData((prevData) => ({
        ...prevData,
        [id]: numericValue,
      }));

      if (numericValue.length !== 6) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          regNumber: 'Registration number must be exactly 6 digits.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          regNumber: '',
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        companyId: parseInt(localStorage.getItem('companyId'), 10),
        [id]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.regNumber.trim()) newErrors.regNumber = 'Registration No. is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Employer Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email ID is required';
    if (!formData.address1.trim()) newErrors.address1 = 'Address #1 is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact Person is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isEdit) {
      dispatch(EmployersGetById({ company: CompanyId, UserId }));
    } else {
      setFormData({
        companyName: '',
        tradeName: '',
        regNumber: '',
        address1: '',
        address2: '',
        city: '',
        zip: '',
        country: '',
        mobile: '',
        landline: '',
        contactPerson: '',
        email: '',
        isLevyExempt: false,
        mode: 1,
        
        companyId: parseInt(localStorage.getItem('companyId'), 10),
        companyLogo: '',
        parentCompanyId: localStorage.getItem('parentIdID'),
        userId: UserId,
        officeCode:'',
      });
    }
  }, [dispatch, isEdit, CompanyId]);

  useEffect(() => {
    if (isEdit && EmployersGetBydata) {
      setFormData({
        ...EmployersGetBydata,
        companyId: parseInt(localStorage.getItem('companyId'), 10),
        mode: 2,
      });

      if (EmployersGetBydata.companyLogo) {
        setCompanyImage(EmployersGetBydata.companyLogo);
      }
    }
  }, [EmployersGetBydata, isEdit]);

  const handleSaveEmployer = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    dispatch(postEmployer(formData))
      .unwrap()
      .then(() => {
        navigate('/apps/employerdetails');
        const dropDownload = {
          ParentId: localStorage.getItem('companyId'),
          UserID: localStorage.getItem('userID'),
          roleId: localStorage.getItem('roleId'),
        };
        dispatch(getCompanyDropdown(dropDownload));
      })
      .catch((err) => {
        console.log('err');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBlurEmail = async () => {
    const { email, regNumber } = formData;
    const trimmedEmail = (email || '').trim();
    const trimmedRegNo = (regNumber || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let hasError = false;

    // 🔹 Registration Number Validation
    if (!trimmedRegNo || trimmedRegNo.length < 6) {
      setError((prev) => ({
        ...prev,
        regNumber: !trimmedRegNo
          ? 'Registration No is required'
          : 'Registration number must be 6 digits',
      }));
      hasError = true;
    } else {
      setError((prev) => ({ ...prev, regNumber: '' }));
    }

    // 🔹 Email Validation
    if (!trimmedEmail) {
      setError((prev) => ({
        ...prev,
        email: 'Email is required',
      }));
      hasError = true;
    } else if (!emailRegex.test(trimmedEmail)) {
      setError((prev) => ({
        ...prev,
        email: 'Enter a valid email address',
      }));
      hasError = true;
    } else {
      setError((prev) => ({ ...prev, email: '' }));
    }

    if (hasError) return;

    setInputLoading(true);

    try {
      const response = await dispatch(
        checkUserCompany({ EmailId: trimmedEmail, regNo: trimmedRegNo }),
      ).unwrap();

      if (response && response.userDetails) {
        setBackendMessage('');
        const data = response?.userDetails || {};

        // 🔹 Map API response fields to formData
        setFormData((prev) => {
          const newFormData = {
            ...prev,
            companyName: data.compName || data.name || '',
            tradeName: data.tradeName || '',
            regNumber: data.regNo || '',
            address1: data.address1 || '',
            address2: data.address2 || '',
            city: data.city || '',
            zip: data.postalCode || '',
            country:
              data.countryName && data.countryName.trim() !== '' && data.countryName.trim() !== ' '
                ? data.countryName.includes('Nevis')
                  ? '2'
                  : '1'
                : '',
            mobile: data.mobileNo ? `+1${data.mobileNo}` : '',
            landline: data.phoneNo || '',
            contactPerson: data.contactPerson || '',
            email: data.email || '',
            officeCode: data.officeCode ||'',
            userId: UserId,
          };

          return newFormData;
        });
      } else {
        setBackendMessage(response?.message || 'Invalid details.');
      }
    } catch (err) {
      setBackendMessage('An error occurred while checking registration.');
    } finally {
      setInputLoading(false);
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
      {/* ========== Left Sidebar Start ========== */}
      {/* Left Sidebar End */}
      <sidebar-barrrrrr></sidebar-barrrrrr>
      {/* ============================================================== */}
      {/* Start right Content here */}
      {/* ============================================================== */}
      <div className="row">
        <div className="col-lg-12">
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
                <span className="d-flex align-items-center gap-1 text-muted"> Add </span>
              </li>
              <li>-</li>
              <li className="fw-medium">Employer Details</li>
            </ul>
          </div>
        </div>
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
                        <div className="col-xl-4">
                          <h4 className="header-title mb-0 text-success">
                            <i className="far fa-user text-success pe-2" />
                            Employer Details
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row d-flex align-items-center">
                        <div className="col-lg-12 mb-3  fw-bold">
                          {' '}
                          Parent Company Name :- &nbsp; {companyName}
                        </div>
                        <div className="col-lg-3 mb-3">
                          <div className="row">
                            <div className="col-lg-12 mb-3">
                              <div className="image-upload-container text-center">
                                <label
                                  htmlFor="company-logo-upload"
                                  className="custom-file-input-label"
                                >
                                  {companyImage || formData.companyLogo ? (
                                    <img
                                      src={companyImage || formData.companyLogo}
                                      alt="Selected"
                                      className="image-preview"
                                    />
                                  ) : (
                                    <img
                                      src={user1}
                                      alt="Default"
                                      className="image-preview1"
                                      width="70"
                                      height="70"
                                    />
                                  )}
                                  <div>
                                    <span className="user_change">
                                      {companyImage || formData.companyLogo
                                        ? 'Uploaded Company Logo'
                                        : 'Upload Company Logo'}
                                    </span>
                                  </div>
                                </label>
                                <input
                                  id="company-logo-upload"
                                  type="file"
                                  name="companyLogo"
                                  accept="image/*"
                                  onChange={handleChange}
                                  style={{ display: 'none' }}
                                  // onKeyDown={handleKeyDown}
                                />
                                {errors.companyLogo && (
                                  <div className="text-danger">{errors.companyLogo}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-9">
                          <div className="row">
                            <div className="col-md-6 col-lg-6 col-xl-6">
                              <div className="mb-3" style={{ position: 'relative' }}>
                                <Label>
                                  Registration No. <span className="text-danger">*</span>
                                </Label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="regNumber"
                                  placeholder=""
                                  value={formData.regNumber}
                                  onChange={handleChange}
                                  onBlur={handleBlurEmail}
                                  style={{ paddingRight: '44px' }}
                                />
                                {error.regNumber && (
                                  <div className="text-danger">{error.regNumber}</div>
                                )}
                                {/* {backendMessage && (
                                <div className="text-danger">{backendMessage}</div>
                              )} */}

                                {errors.regNumber && (
                                  <div className="text-danger">{errors.regNumber}</div>
                                )}
                              </div>
                            </div>

                            <div className="col-md-6 col-lg-6 col-xl-6">
                              <div className="mb-3" style={{ position: 'relative' }}>
                                <Label>
                                  Email Id <span className="text-danger">*</span>
                                </Label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="email"
                                  placeholder=""
                                  value={formData.email}
                                  onChange={handleChange}
                                  maxLength={64}
                                  onBlur={handleBlurEmail}
                                  style={{ paddingRight: '44px' }}
                                />
                                <span
                                  className="position-absolute"
                                  style={{
                                    right: '10px',
                                    top: '70%',
                                    transform: 'translateY(-50%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    zIndex: 3,
                                    pointerEvents: 'none',
                                  }}
                                >
                                  {InputLoading && <Spinner size="sm" color="primary" />}
                                  <Icon.Search size={18} style={{ cursor: 'pointer' }} />
                                </span>

                                {errors.email && <div className="text-danger">{errors.email}</div>}
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-6">
                              <div className="mb-3">
                                <Label>Trade Name(If any) </Label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="tradeName"
                                  placeholder=""
                                  value={formData.tradeName}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-6">
                              <div className="mb-3">
                                <Label>
                                  Contact Person <span className="text-danger">*</span>
                                </Label>
                                <input
                                  type="text"
                                  className="form-control"
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

                            <div className="col-md-6 col-lg-6 col-xl-6">
                              <div className="mb-3">
                                <Label>Mobile Number</Label>
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
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-6">
                              <div className="mb-3">
                                <Label>Phone Number </Label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="landline"
                                  placeholder=""
                                  value={formData.landline}
                                  onChange={handleChange}
                                />
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
                                  className="form-control position-relative"
                                  id="companyName"
                                  placeholder=""
                                  value={formData.companyName}
                                  onChange={handleChange}
                                />
                                {/*   <span class="form_icon"><i class="far fa-building"></i></span> */}
                                {errors.companyName && (
                                  <div className="text-danger">{errors.companyName}</div>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-6">
                              <div className="mb-3 d-flex">
                                <div className="form-check mx-1">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="isLevyExempt"
                                    checked={formData.isLevyExempt}
                                    onChange={handleChange}
                                  />
                                  <Label className="form-check-Label" htmlFor="formCheck1"></Label>
                                </div>
                                <Label>Is Levy Exempt ? </Label>
                              </div>
                            </div>
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
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>
                              Address #1 <span className="text-danger">*</span>
                            </Label>
                            <input
                              type="text"
                              className="form-control"
                              id="address1"
                              placeholder=""
                              value={formData.address1}
                              onChange={handleChange}
                            />
                            {/*      <span class="form_icon"><i class="fas fa-map-marker-alt"></i></span> */}
                            {errors.address1 && (
                              <div className="text-danger">{errors.address1}</div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>Address #2</Label>
                            <input
                              type="text"
                              className="form-control"
                              id="address2"
                              placeholder=""
                              value={formData.address2}
                              onChange={handleChange}
                            />
                            {/*      <span class="form_icon"><i class="fas fa-map-marker-alt"></i></span> */}
                          </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-xl-4">
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
                        <div className="col-md-4 col-lg-4 col-xl-4">
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
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mb-3">
                            <Label>
                              Country <span className="text-danger">*</span>{' '}
                            </Label>
                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                              id="country"
                              value={formData.country}
                              onChange={handleChange}
                            >
                              <option selected="">Select Country</option>
                              <option value={1}>Saint Kitts</option>
                              <option value={2}>Nevis</option>
                            </select>
                            {errors.country && <div className="text-danger">{errors.country}</div>}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="row"></div>
                      <div className="row mt-3">
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <button
                            type="button"
                            className="btn btn-success px-4 me-3"
                            disabled={loading}
                            onClick={handleSaveEmployer}
                          >
                            <i className="far fa-save pe-1" />{' '}
                            {loading ? (
                              <>
                                <Spinner size="sm"></Spinner> Saving...
                              </>
                            ) : (
                              <>Save</>
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
    </div>
  );
};
export default AddEmployer;
