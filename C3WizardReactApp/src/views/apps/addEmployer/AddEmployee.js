import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
//import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import { Label, Spinner } from 'reactstrap';
import HttpCommon from '../../../baseUrl/HttpCommon';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import { postEmployer, EmployersGetById } from '../../../store/apps/employer/EmployerSlice';

const AddEmployer = () => {
  const location = useLocation();
  const CompanyId = localStorage.getItem('companyId');
  const UserId = localStorage.getItem('userID');
  //const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { EmployersGetBydata } = useSelector((state) => state.employerSlice);
  const navigate = useNavigate();
  const { message, type: messageType } = useSelector((state) => state?.messageReducer);

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
    isLevyExempt: true,
    mode: 1,
    parentCompanyId: localStorage.getItem('parentIdID'),
    //companyId:0
  });

  const [errors, setErrors] = useState({});
  // const handleChange = (e) => {

  //   const { id, value, type, checked } = e.target;
  //   setFormData({
  //     ...formData,
  //     [id]: type === "checkbox" ? checked : value,
  //   });
  // };
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      parentCompanyId: parseInt(localStorage.getItem('parentIdID'), 10),
      //companyId : parseInt(localStorage.getItem("companyId"), 10),
      [id]: type === 'checkbox' ? checked : value,
      // mode: prevData.mode,
    }));
    if (id === 'regNumber') {
      if (value.length !== 6 || Number.isNaN(value)) {
        setErrors({
          ...errors,
          regNumber: 'Registration number must be 6 digits.',
        });
      } else {
        setErrors({
          ...errors,
          regNumber: '',
        });
      }
    }
  };

  // const validateForm = () => {
  //   const newErrors = {};
  //   if (!formData.regNumber.trim()) newErrors.regNumber = "Registration No. is required";
  //   if (!formData.companyName.trim()) newErrors.companyName = "Employer Name is required";
  //   if (!formData.email.trim()) newErrors.email = "Email ID is required";
  //   if (!formData.address1.trim()) newErrors.address1 = "Address #1 is required";
  //   if (!formData.country.trim()) newErrors.country = "Country is required";
  //   if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact Person is required";

  //   // setErrors(newErrors);
  //   // return Object.keys(newErrors).length === 0;
  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     console.log("new Error things",newErrors);

  //   } else {
  //     setErrors({});
  //     // Proceed with form submission
  //   }
  // };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.regNumber.trim()) newErrors.regNumber = 'Registration No. is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Employer Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email ID is required';
    if (!formData.address1.trim()) newErrors.address1 = 'Address #1 is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact Person is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  useEffect(() => {
    if (location.state?.isEdit) {
      dispatch(EmployersGetById({ companyId: CompanyId, UserId }));
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
        isLevyExempt: true,
        mode: 1,
        companyId: parseInt(localStorage.getItem('companyId'), 10),
      });
    }
  }, [dispatch, location.state, CompanyId]);

  // useEffect(() => {
  //
  //   if (EmployersGetBydata) {
  //     setFormData((prevData) => ({
  //       ...prevData,

  //       ...EmployersGetBydata,
  //       companyId : parseInt(localStorage.getItem("companyId"), 10),
  //       mode: 2,
  //     }));
  //   }
  // }, [EmployersGetBydata]);

  useEffect(() => {
    if (location.state?.isEdit && EmployersGetBydata) {
      setFormData({
        ...EmployersGetBydata,
        companyId: parseInt(localStorage.getItem('companyId'), 10),
        mode: 2,
      });
    }
  }, [EmployersGetBydata, location.state]);

  // const handleSaveEmployer = async () => {

  //   setLoading(true);
  //   console.log("FormData before sending:", formData); // Debugging line

  //   dispatch(postEmployer( formData ))
  //     .unwrap()
  //     .then(() => {
  //       navigate('/apps/employerdetails');
  //     })
  //     .catch((err) => {
  //       toast.error(err);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

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
      })
      .catch((err) => {
        toast.error(err);
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

  // useEffect(() =>{
  //
  //   dispatch(EmployersGetById(CompanyId));
  // }, []);

  useEffect(() => {
    if (CompanyId) {
      console.log('EmployersGetBydata', EmployersGetBydata);
    }
  });

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className="page-content-wrapper">
            {/*    <div class="page-title mb-3">
                      <h5>Employer Details</h5> 
                  </div>
           */}
            <div className="row">
              <div className="col-xl-12">
                <div className="card">
                  <div className="card-header py-3 bg_ligh">
                    <div className="row align-items-center d-flex">
                      <div className="col-xl-8">
                        <h4 className="header-title mb-0 text-success">
                          <i className="far fa-user text-success pe-2" />
                          Employer Details
                        </h4>
                      </div>
                      {/*         <div class="col-xl-4 text-end">
                                      <button class="btn btn-success waves-effect waves-light h-45" type="submit"><i class="fas fa-plus pe-1"></i> Add Employer</button>
                              </div> */}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 col-lg-4 col-xl-4">
                        <div className="mb-3">
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
                          />
                          {/*  <span class="form_icon"><i class="far fa-id-badge"></i></span> */}
                          {errors.regNumber && (
                            <div className="text-danger">{errors.regNumber}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4 col-lg-4 col-xl-4">
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
                      <div className="col-md-4 col-lg-4 col-xl-4">
                        <div className="mb-3">
                          <Label>
                            Email Id <span className="text-danger">*</span>
                          </Label>
                          <input
                            type="text"
                            className="form-control"
                            id="email"
                            placeholder=""
                            value={formData.email}
                            maxLength={64}
                            onChange={handleChange}
                          />
                          {/* <span class="form_icon"><i class="far fa-envelope"></i></span> */}
                          {errors.email && <div className="text-danger">{errors.email}</div>}
                        </div>
                      </div>
                      <div className="col-md-4 col-lg-4 col-xl-4">
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
                          {/*  <span class="form_icon"><i class="far fa-user"></i></span> */}
                        </div>
                      </div>
                      <div className="col-md-4 col-lg-4 col-xl-4">
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
                            <Label className="form-check-Label" htmlFor="formCheck1"></Label>
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
                          {errors.address1 && <div className="text-danger">{errors.address1}</div>}
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
                            className="form-select"
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
                  <div className="card-header bg-light py-3 mb-2">
                    <div className="row g-3 align-items-center">
                      <div className="col">
                        <h5 className="header-title mb-0 text-success">
                          <i className="fas fa-phone-volume f-20" /> Either Enter The Mobile Number
                          OR Phone Number{' '}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 col-lg-4 col-xl-4">
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
                      <div className="col-md-4 col-lg-4 col-xl-4">
                        <div className="mb-3">
                          <Label>Mobile Number</Label>
                          <input
                            type="text"
                            className="form-control"
                            id="mobile"
                            placeholder=""
                            value={formData.mobile}
                            onChange={handleChange}
                            onClick={(e) => {
                              if (formData.mobile === '') {
                                setFormData({
                                  ...formData,
                                  mobile: '+1-869-',
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-lg-4 col-xl-4">
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
                    </div>
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
                          onClick={() => location(-1)}
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
  );
};
export default AddEmployer;
