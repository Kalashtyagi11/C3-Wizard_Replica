import React, { useRef, useState, useEffect } from 'react';
import { Label, Spinner, Input } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import { getCompanyDropdownUser } from '../../../store/apps/dashboard/DashboardSlice';
import { getRoleById } from '../../../store/apps/Admin/RolemanagementSlice';
import profileImg from '../../../assets/images/users/profile.png';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  userName: Yup.string().required('Username is required'),
  password: Yup.string()
    // .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  userRole: Yup.string().required('User Role is required'),
  SECUsersProfilesString: Yup.array()
    .min(1, 'Please select at least one company') // at least 1 company must be selected
    .required('Company User is required'),
});

const AddUser = () => {
  const [profileImgState, setProfileImgState] = useState(profileImg); // Default Image
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { CompanyDropdownRes } = useSelector((state) => state.dashboardSlice || {});
  const { RoleList, RoleListById } = useSelector((state) => state.RoleSlice || {});
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const roleIdLogin = parseInt(localStorage.getItem(''), 10);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [roleId, setRoleId] = useState(roleIdLogin);
  const [isOpen, setIsOpen] = useState(false);
  const regNumber = localStorage.getItem('reG_NUMBER');
  const dropdownRef = useRef(null);
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      password: '',
      confirmPassword: '',
      userRole: '',
      profilePhoto: null,
      SECUsersProfiles: null,
      SECUsersProfilesString: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const { firstName, lastName, email, userName, password, userRole, profilePhoto } = values;
      const userId = localStorage.getItem('userID');
      const companyId = localStorage.getItem('companyId');
      const formData = new FormData();
      formData.append('FirstName', firstName);
      formData.append('LastName', lastName);
      formData.append('EmailId', email);
      formData.append('LoginId', userName);
      formData.append('Password', password);
      formData.append('EmpId', '0');
      formData.append('MachineInfo', null);
      formData.append('Department', null);
      formData.append('InsertedMachineInfo', null);
      formData.append('UpdatedMachineInfo', null);
      formData.append('ParentUserId', 0);
      formData.append('UserRole', Number(userRole));
      formData.append('CompanyId', companyId);
      formData.append('UserId', userId);
      formData.append('Reg_Number', regNumber);
      formData.append('SelfEmpId', null);
      formData.append('mode', 1);
      if (profilePhoto) {
        formData.append('UserImage', profilePhoto);
      }

      // const selectedCompanyIds = selectedCompanies.map((c) => c.company_Id);
      // formData.append('SelectedCompanies', JSON.stringify(selectedCompanyIds));
      formData.append('SECUsersProfiles', null);
      formData.append('SECUsersProfilesString', JSON.stringify(selectedCompanies));

      try {
        const res = await UserManagementServices.saveAndUpdateUser(formData);
        if (res.data.status) {
          toast.success(res.data.message);
          navigate(-1);
        }
        console.log(res);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
      // Handle form submission here
    },
  });

  // const fileToBase64 = (file) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });

  // const formik = useFormik({
  //   initialValues: {
  //     firstName: '',
  //     lastName: '',
  //     email: '',
  //     userName: '',
  //     password: '',
  //     confirmPassword: '',
  //     userRole: '',
  //     profilePhoto: null,
  //     SECUsersProfilesString: [],
  //   },
  //   validationSchema,
  //   onSubmit: async (values) => {
  //     setLoading(true);
  //     const userId = localStorage.getItem('userID');
  //     const companyId = localStorage.getItem('companyId');

  //     let profilePhotoBase64 = null;
  //     if (values.profilePhoto) {
  //       profilePhotoBase64 = await fileToBase64(values.profilePhoto);
  //     }

  //     // Prepare JSON payload
  //     const payload = {
  //       FirstName: values.firstName,
  //       LastName: values.lastName,
  //       EmailId: values.email,
  //       LoginId: values.userName,
  //       Password: values.password,
  //       EmpId: "0",
  //       MachineInfo: null,
  //       Department: null,
  //       InsertedMachineInfo: null,
  //       UpdatedMachineInfo: null,
  //       ParentUserId: 0,
  //       UserRole: Number(values.userRole),
  //       CompanyId: companyId,
  //       UserId: userId,
  //       SelfEmpId: null,
  //       mode: 1,
  //       ProfilePhoto: profilePhotoBase64,
  //       SECUsersProfilesString: selectedCompanies, // send as array
  //     };

  //     try {
  //       const res = await UserManagementServices.saveAndUpdateUser(payload);
  //       if (res.data.status) {
  //         toast.success(res.data.message);
  //         navigate(-1);
  //       } else {
  //         toast.error(res.data.message);
  //       }
  //     } catch (err) {
  //       toast.error(err.response?.data?.message || 'Something went wrong');
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  // });

  const handleRoleChange = (e) => {
    const selectedRoleId = e.target.value;
    setRoleId(selectedRoleId);

    formik.setFieldValue('userRole', selectedRoleId);

    // find the parent category of this role
    const category = RoleListById?.find((group) =>
      group.roleName.some((role) => role.roleId.toString() === selectedRoleId),
    );

    setSelectedCategoryId(category?.id || '');
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue('profilePhoto', file); // Store file in Formik
      setProfileImgState(URL.createObjectURL(file)); // Update preview
    }
  };

  const dropDownload = {
    ParentId: localStorage.getItem('companyId'),
    UserID: localStorage.getItem('userID'),
    roleId: localStorage.getItem('roleId'),
  };

  useEffect(() => {
    dispatch(getCompanyDropdownUser(dropDownload));
  }, []);

  useEffect(() => {
    dispatch(getRoleById());
  }, [dispatch]);

  const handleCheckboxChange = (company) => {
    let updated = [];
    if (selectedCompanies.some((c) => c.company_Id === company.company_Id)) {
      updated = selectedCompanies.filter((c) => c.company_Id !== company.company_Id);
    } else {
      updated = [...selectedCompanies, company];
    }

    setSelectedCompanies(updated);

    // Update Formik field value
    formik.setFieldValue('SECUsersProfilesString', updated);

    // Mark field as touched to trigger validation
    formik.setFieldTouched('SECUsersProfilesString', true);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Display selected company names as comma-separated string
  const selectedNames =
    selectedCompanies.length > 0
      ? selectedCompanies.map((c) => c.company_Name).join(', ')
      : 'Select Company';

  return (
    <div id="layout-wrapper">
      <my-header />
      {/* ========== Left Sidebar Start ========== */}
      {/* Left Sidebar End */}
      <sidebar-barrrrrr></sidebar-barrrrrr>
      {/* ============================================================== */}
      {/* Start right Content here */}
      {/* ============================================================== */}
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="page-content-wrapper">
              {/*    <div class="page-title mb-3">
                      <h5>Employer Details</h5> 
                  </div>
           */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                <h5 className="fw-semibold mb-0"> Add User </h5>
                <ul className="d-flex align-items-center gap-2 list-unstyled">
                  <li className="fw-medium">
                    <span className="d-flex align-items-center gap-1 text-muted">
                      {' '}
                      <i className="ti-home" /> Dashboard{' '}
                    </span>
                  </li>
                  <li>-</li>
                  <li className="fw-medium">
                    <span className="d-flex align-items-center gap-1 text-muted">
                      {' '}
                      User Management{' '}
                    </span>
                  </li>
                  <li>-</li>
                  <li className="fw-medium">Add User </li>
                </ul>
              </div>
              <div className="row">
                <div className="col-xl-12">
                  <div className="card">
                    <div className="card-header py-3 bg_ligh">
                      <div className="row align-items-center d-flex">
                        <div className="col-xl-12 col-12 mb-2 mb-lg-0">
                          <h4 className="header-title mb-0 text-success">
                            <i className="far fa-user text-success pe-2" /> Add User
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="card-body profile">
                      <div className="row g-3 align-items-center mt-1 mb-4">
                        <div className="col-12 col-md-2 col-lg-2">
                          <img className="profile-image mb-2" src={profileImgState} alt="Profile" />
                          <br />
                          <span
                            onClick={() => fileInputRef.current.click()} // Trigger file input
                            className="mt-2"
                            style={{ cursor: 'pointer', color: 'blue' }}
                          >
                            Change Profile Photo
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef} // Assign ref
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                          />
                        </div>
                      </div>
                      <form onSubmit={formik.handleSubmit}>
                        <div className="row">
                          {/* First Name */}
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mb-3">
                              <Label>
                                First Name <span className="text-danger">*</span>
                              </Label>
                              <input
                                type="text"
                                className={`form-control ${
                                  formik.touched.firstName && formik.errors.firstName
                                    ? 'is-invalid'
                                    : ''
                                }`}
                                id="firstName"
                                name="firstName"
                                placeholder="Enter First Name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.firstName}
                              />
                              {formik.touched.firstName && formik.errors.firstName ? (
                                <div className="invalid-feedback">{formik.errors.firstName}</div>
                              ) : null}
                            </div>
                          </div>

                          {/* Last Name */}
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mb-3">
                              <Label>
                                Last Name <span className="text-danger">*</span>
                              </Label>
                              <input
                                type="text"
                                className={`form-control ${
                                  formik.touched.lastName && formik.errors.lastName
                                    ? 'is-invalid'
                                    : ''
                                }`}
                                id="lastName"
                                name="lastName"
                                placeholder="Enter Last Name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.lastName}
                              />
                              {formik.touched.lastName && formik.errors.lastName ? (
                                <div className="invalid-feedback">{formik.errors.lastName}</div>
                              ) : null}
                            </div>
                          </div>

                          {/* Email */}
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mb-3">
                              <Label>
                                Email <span className="text-danger">*</span>
                              </Label>
                              <input
                                type="email"
                                className={`form-control ${
                                  formik.touched.email && formik.errors.email ? 'is-invalid' : ''
                                }`}
                                id="email"
                                name="email"
                                placeholder="Enter Email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                              />
                              {formik.touched.email && formik.errors.email ? (
                                <div className="invalid-feedback">{formik.errors.email}</div>
                              ) : null}
                            </div>
                          </div>

                          {/* Username */}
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mb-3">
                              <Label>
                                User Name <span className="text-danger">*</span>
                              </Label>
                              <input
                                type="text"
                                className={`form-control ${
                                  formik.touched.userName && formik.errors.userName
                                    ? 'is-invalid'
                                    : ''
                                }`}
                                id="userName"
                                name="userName"
                                placeholder="Enter Username"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.userName}
                              />
                              {formik.touched.userName && formik.errors.userName ? (
                                <div className="invalid-feedback">{formik.errors.userName}</div>
                              ) : null}
                            </div>
                          </div>

                          {/* Password */}
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mb-3">
                              <Label>
                                Password <span className="text-danger">*</span>
                              </Label>
                              <input
                                type="password"
                                className={`form-control ${
                                  formik.touched.password && formik.errors.password
                                    ? 'is-invalid'
                                    : ''
                                }`}
                                id="password"
                                name="password"
                                placeholder="Enter Password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                              />
                              {formik.touched.password && formik.errors.password ? (
                                <div className="invalid-feedback">{formik.errors.password}</div>
                              ) : null}
                            </div>
                          </div>

                          {/* Confirm Password */}
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mb-3">
                              <Label>
                                Confirm Password <span className="text-danger">*</span>
                              </Label>
                              <input
                                type="password"
                                className={`form-control ${
                                  formik.touched.confirmPassword && formik.errors.confirmPassword
                                    ? 'is-invalid'
                                    : ''
                                }`}
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirmPassword}
                              />
                              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className="invalid-feedback">
                                  {formik.errors.confirmPassword}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          {/* User Role */}
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mb-3">
                              <Label>
                                User Role <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                className={`form-control ${
                                  formik.touched.userRole && formik.errors.userRole
                                    ? 'is-invalid'
                                    : ''
                                }`}
                                id="userRole"
                                name="userRole"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.userRole}
                              >
                                <option value="">Select User Role</option>
                                {/* <option disabled value={3}>
                                  Employer
                                </option>
                                <option value={4}>Employer User</option> */}
                                {RoleListById?.map((group) => {
                                  if (group.name === 'Company') {
                                    // Only render "SSB" group
                                    return (
                                      <optgroup key={group.id} label={group.name}>
                                        {group.roleName.map((role) => (
                                          <option
                                            key={role.roleId}
                                            value={role.roleId}
                                            // disabled={role.roleName !== 'Company User'}
                                            disabled={role.roleName === 'Company'}
                                          >
                                            {role.roleName}
                                          </option>
                                        ))}
                                      </optgroup>
                                    );
                                  }
                                  return null; // For non-SSB groups, return nothing (skip them)
                                })}
                              </Input>
                              {formik.touched.userRole && formik.errors.userRole ? (
                                <div className="invalid-feedback">{formik.errors.userRole}</div>
                              ) : null}
                            </div>
                          </div>

                          {/* User Company */}
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mb-3">
                              <Label>
                                Select Company <span className="text-danger">*</span>
                              </Label>
                              <div style={{ position: 'relative' }} ref={dropdownRef}>
                                <div
                                  onClick={() => {
                                    setIsOpen(!isOpen);
                                    formik.setFieldTouched('SECUsersProfilesString', true);
                                  }}
                                  className={`form-control d-flex justify-content-between align-items-center ${
                                    formik.touched.SECUsersProfilesString &&
                                    formik.errors.SECUsersProfilesString
                                      ? 'is-invalid'
                                      : ''
                                  }`}
                                >
                                  <span>
                                    {selectedCompanies.length > 0
                                      ? selectedCompanies.map((c) => c.company_Name).join(', ')
                                      : 'Select Companies'}
                                  </span>
                                  <span>
                                    {isOpen ? (
                                      <i className="fas fa-chevron-up"></i>
                                    ) : (
                                      <i className="fas fa-chevron-down"></i>
                                    )}
                                  </span>
                                </div>

                                {isOpen && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: '100%',
                                      left: 0,
                                      width: '100%',
                                      border: '1px solid #ccc',
                                      backgroundColor: '#fff',
                                      maxHeight: '200px',
                                      overflowY: 'auto',
                                      zIndex: 1000,
                                      padding: '10px',
                                    }}
                                  >
                                    {CompanyDropdownRes?.map((company) => (
                                      <div key={company.company_Id}>
                                        <Label>
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={selectedCompanies.some(
                                              (c) => c.company_Id === company.company_Id,
                                            )}
                                            onChange={() => handleCheckboxChange(company)}
                                          />{' '}
                                          {company.company_Name}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {formik.touched.SECUsersProfilesString &&
                                formik.errors.SECUsersProfilesString && (
                                  <div className="text-danger">
                                    {formik.errors.SECUsersProfilesString}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="row mt-4">
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <button type="submit" className="btn btn-success px-4 me-3">
                              {' '}
                              {loading ? (
                                <>
                                  <Spinner size="sm" /> Saving ..
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
                              onClick={() => navigate(-1)}
                              className="btn btn-light border px-4"
                            >
                              <i className="fas fa-times" /> Cancel
                            </button>
                          </div>
                        </div>
                      </form>
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
export default AddUser;
