import React, { useEffect, useRef, useState } from 'react';
import { Label } from 'reactstrap';
import { useFormik } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import { getRoleById } from '../../../store/apps/Admin/RolemanagementSlice';
import profileImg from '../../../assets/images/users/profile.png';
import useTogglePassword from '../../../hooks/useTogglePassword';
import { getCompanyDropdown } from '../../../store/apps/dashboard/DashboardSlice';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  userName: Yup.string().required('Username is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(40, 'Password must not exceed 40 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required')
    .required('Password is Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  userRole: Yup.string().required('User Role is required'),
  companyId: Yup.string().required('Employer is required'),
  SECUsersProfilesString: Yup.array()
    .min(1, 'Please select at least one company') // at least 1 company must be selected
    .required('Company User is required'),
});

const AddCompanyUser = () => {
  const [profileImgState, setProfileImgState] = useState(profileImg); // Default Image
  const [companyList, setCompanyList] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { compId, UserId } = useParams();
  const location = useLocation();
  const { companyId: navCompanyId, UseridUnique, regNumber } = location.state || {};
  const dispatch = useDispatch();
  const roleIdLogin = parseInt(localStorage.getItem(''), 10);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [roleId, setRoleId] = useState(roleIdLogin);
  const { RoleList, RoleListById } = useSelector((state) => state.RoleSlice || {});
  const { CompanyDropdown } = useSelector((state) => state.dashboardSlice || {});
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useTogglePassword();

  const getAllCompaniesHandler = async () => {
    try {
      const res = await UserManagementServices.getAllCompanyData();
      setCompanyList(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      password: '',
      confirmPassword: '',
      userRole: '',
      companyId: compId || navCompanyId || '',
      profilePhoto: null,
      SECUsersProfiles: null,
      SECUsersProfilesString: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      const { firstName, lastName, email, userName, password, userRole, companyId, profilePhoto } =
        values;
      const userId = localStorage.getItem('userID');
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
      formData.append('CompanyId', Number(companyId));
      formData.append('UserId', UseridUnique);
      formData.append('Reg_Number', regNumber);
      formData.append('SelfEmpId', null);
      formData.append('mode', 1);
      formData.append('SECUsersProfiles', null);
      formData.append('SECUsersProfilesString', JSON.stringify(selectedCompanies));
      if (profilePhoto) {
        formData.append('UserImage', profilePhoto);
      }
      try {
        const res = await UserManagementServices.saveAndUpdateUser(formData);
        if (res.data.status) {
          toast.success(res.data.message);
          navigate('/admin/manage-users/company-users', {
            state: { companyId },
          });
        }
        console.log(res);
      } catch (error) {
        toast.error(error.response.data.message);
      }
      // Handle form submission here
    },
  });

  const options = companyList.map((item) => ({
    value: item.companyId,
    label: item.companyName,
  }));

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue('profilePhoto', file); // Store file in Formik
      setProfileImgState(URL.createObjectURL(file)); // Update preview
    }
  };

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

  const dropDownload = {
    ParentId: compId || navCompanyId,
    UserID: UseridUnique,
    roleId: localStorage.getItem('roleId'),
  };

  useEffect(() => {
    dispatch(getCompanyDropdown(dropDownload));
  }, []);

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

  useEffect(() => {
    getAllCompaniesHandler();
  }, []);

  useEffect(() => {
    dispatch(getRoleById());
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
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="page-content-wrapper">
              {/*    <div class="page-title mb-3">
                      <h5>Employer Details</h5> 
                  </div>
           */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                <h5 className="fw-semibold mb-0"> Add Employer User </h5>
                <ul className="d-flex align-items-center gap-2 list-unstyled">
                  <li className="fw-medium">
                    <Link
                      to="/apps/dashboard"
                      className="d-flex align-items-center gap-1 text-muted"
                    >
                      {' '}
                      <i className="ti-home" /> Dashboard{' '}
                    </Link>
                  </li>
                  <li>-</li>
                  <li className="fw-medium">
                    <Link
                      to="/admin/manage-users/company-users"
                      className="d-flex align-items-center gap-1 text-muted"
                    >
                      {' '}
                      Employer Users{' '}
                    </Link>
                  </li>
                  <li>-</li>
                  <li className="fw-medium">Add User </li>
                </ul>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-header py-3 bg_ligh">
                        <div className="row align-items-center d-flex">
                          <div className="col-xl-8 col-8 mb-2 mb-lg-0">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user text-success pe-2" /> Add User
                            </h4>
                          </div>
                          {/* Company */}
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="">
                              {/* <Select
                                id="companyId"
                                name="companyId"
                                options={options}
                                value={options.find(
                                  (option) => option.value === formik.values.companyId,
                                )}
                                onChange={(selectedOption) =>
                                  formik.setFieldValue(
                                    'companyId',
                                    selectedOption ? selectedOption.value : '',
                                  )
                                }
                                onBlur={formik.handleBlur}
                                className={`form ${
                                  formik.touched.companyId && formik.errors.companyId
                                    ? 'is-invalid'
                                    : ''
                                }`}
                                placeholder="Select Employer"
                                isClearable
                              />
                              {formik.touched.companyId && formik.errors.companyId ? (
                                <div className="invalid-feedback">{formik.errors.companyId}</div>
                              ) : null} */}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body profile">
                        <div className="row g-3 align-items-center mt-1 mb-4">
                          <div className="col-12 col-md-2 col-lg-2">
                            <img
                              className="profile-image mb-2"
                              src={profileImgState}
                              alt="Profile"
                            />
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
                              <Label>Email</Label> <span className="text-danger">*</span>
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
                              <Label>User Name</Label> <span className="text-danger">*</span>
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

                          {/* Password Field */}
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mb-3 position-relative">
                              <Label>Password</Label> <span className="text-danger">*</span>
                              <div className="input-group">
                                <input
                                  type={showPassword ? 'text' : 'password'}
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
                                <button
                                  type="button"
                                  className="btn btn-secondary eye-btn"
                                  onClick={togglePasswordVisibility}
                                >
                                  {showPassword ? (
                                    <i className="fa fa-eye"></i>
                                  ) : (
                                    <i className="fa  fa-eye-slash"></i>
                                  )}
                                </button>

                                {formik.touched.password && formik.errors.password ? (
                                  <div className="invalid-feedback">{formik.errors.password}</div>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          {/* Confirm Password Field */}
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mb-3 position-relative">
                              <Label>Confirm Password</Label> <span className="text-danger">*</span>
                              <div className="input-group">
                                <input
                                  type={showConfirmPassword ? 'text' : 'password'}
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
                                <button
                                  type="button"
                                  className="btn btn-secondary eye-btn"
                                  onClick={toggleConfirmPasswordVisibility}
                                >
                                  {showConfirmPassword ? (
                                    <i className="fa fa-eye"></i>
                                  ) : (
                                    <i className="fa  fa-eye-slash"></i>
                                  )}
                                </button>
                                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                  <div className="invalid-feedback">
                                    {formik.errors.confirmPassword}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mb-3">
                              <Label>User Role</Label> <span className="text-danger">*</span>
                              <div className="mb-3">
                                <select
                                  id="userRole"
                                  name="userRole" // Ensure this matches the validation field name
                                  className={`form-select ${
                                    formik.touched.userRole && formik.errors.userRole
                                      ? 'is-invalid'
                                      : ''
                                  }`}
                                  value={formik.values.userRole || ''}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  style={{ padding: '12px' }}
                                >
                                  <option value="">Select a Role</option>

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
                                </select>
                                {formik.touched.userRole && formik.errors.userRole ? (
                                  <div className="invalid-feedback">{formik.errors.userRole}</div>
                                ) : null}
                              </div>
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
                                    {CompanyDropdown?.map((company) => (
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
                              <i className="far fa-save pe-1" /> Save
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
                      </div>
                    </div>
                  </div>
                </div>
              </form>
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
export default AddCompanyUser;
