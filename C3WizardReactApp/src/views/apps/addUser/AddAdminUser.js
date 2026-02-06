import React, { useRef, useState, useEffect } from 'react';
import { Label, Spinner, Input } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import profileImg from '../../../assets/images/users/profile.png';
import useTogglePassword from '../../../hooks/useTogglePassword';
import {
  getRoleList,
  getRoleById,
  updateRoleList,
  getRoleListSide,
  // getRoleListSide
} from '../../../store/apps/Admin/RolemanagementSlice';

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
    .required('Confirm Password is Required'),
  userRole: Yup.string().required('User Role is required'),
});

const AddAdminUser = () => {
  const { RoleList, RoleListById } = useSelector((state) => state.RoleSlice || {});
  const [profileImgState, setProfileImgState] = useState(profileImg); // Default Image
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const roleIdLogin = parseInt(localStorage.getItem('roleId'), 10);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [roleId, setRoleId] = useState(roleIdLogin);
  const dispatch = useDispatch();
  const companyId = localStorage.getItem('companyId');
  const regNumber = localStorage.getItem('reG_NUMBER');

  const {
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useTogglePassword();

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
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const { firstName, lastName, email, userName, password, userRole, profilePhoto } = values;
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
      formData.append('UserRole', userRole);
      formData.append('CompanyId', companyId);
      formData.append('Reg_Number', regNumber);
      formData.append('UserId', userId);
      formData.append('SelfEmpId', null);
      formData.append('mode', 1);
      if (profilePhoto) {
        formData.append('UserImage', profilePhoto);
      }

      try {
        const res = await UserManagementServices.saveAndUpdateUser(formData);
        if (res.data.status) {
          toast.success(res.data.message);
          navigate(-1);
        } else {
          toast.error(res.message || 'An error occurred while saving the user.');
        }
        console.log(res);
      } catch (error) {
        // toast.error(error.message || 'There was a problem processing your request.');
        toast.error(
          error.response?.data?.message ||
            error.message ||
            'There was a problem processing your request.',
        );
      } finally {
        setLoading(false);
      }
      // Handle form submission here
    },
  });

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
                <h5 className="fw-semibold mb-0"> Add Admin User </h5>
                <ul className="d-flex align-items-center gap-2 list-unstyled">
                  <li className="fw-medium">
                    <Link
                      to="/admin-dashboard"
                      className="d-flex align-items-center gap-1 text-muted"
                    >
                      {' '}
                      <i className="ti-home" /> Dashboard{' '}
                    </Link>
                  </li>
                  <li>-</li>
                  <li className="fw-medium">
                    <Link
                      to="/admin/manage-users/my-users"
                      className="d-flex align-items-center gap-1 text-muted"
                    >
                      {' '}
                      My Users{' '}
                    </Link>
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
                              <Label>Email</Label>
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
                              <Label>User Name</Label>
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
                              <Label>Password</Label>
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
                              <Label>Confirm Password</Label>
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

                          {/* User Role */}

                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mb-3">
                              <Label>User Role</Label>
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
                                    if (group.name === 'SSB') {
                                      // Only render "SSB" group
                                      return (
                                        <optgroup key={group.id} label={group.name}>
                                          {group.roleName.map((role) => (
                                            <option key={role.roleId} value={role.roleId}>
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
                        </div>

                        {/* Submit Button */}
                        <div className="row mt-4">
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <button type="submit" className="btn btn-success px-4 me-3">
                              <i className="far fa-save pe-1" />
                              {loading ? (
                                <>
                                  <Spinner size="sm" /> Saving ..
                                </>
                              ) : (
                                <>Save</>
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
export default AddAdminUser;
