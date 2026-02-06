import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import profileImg from '../../../assets/images/users/profile.png';
import Loader from '../../../layouts/loader/Loader';
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

  userRole: Yup.string().required('User Role is required'),
  isWorkingDirector: Yup.boolean(),
});

const UpdateAdminUser = () => {
  const dispatch = useDispatch();
  const CategoryType = localStorage.getItem('roleCategory');
  const [profileImgState, setProfileImgState] = useState(profileImg); // Default Image
  const [loader, setLoader] = useState(true);
  const fileInputRef = useRef(null);
  const companyId = localStorage.getItem('companyId');
  const parentUserId = localStorage.getItem('userID');
  const regNumber = localStorage.getItem('reG_NUMBER');
  const navigate = useNavigate();
  const { id } = useParams();
  const { RoleList, RoleListById } = useSelector((state) => state.RoleSlice || {});
  const [loading, setLoading] = useState(false);
  const roleIdLogin = parseInt(localStorage.getItem('roleId'), 10);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [roleId, setRoleId] = useState(id ? null : 1); // Default to 1 for new users, null for existing

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      userRole: id ? 2 : 1, // Default to 1 for new users, 2 for existing
      isWorkingDirector: false,
      profilePhoto: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const { firstName, lastName, email, userName, userRole, profilePhoto } = values;
      const formData = new FormData();
      formData.append('FirstName', firstName);
      formData.append('LastName', lastName);
      formData.append('EmailId', email);
      formData.append('LoginId', userName);
      formData.append('EmpId', '0');
      formData.append('MachineInfo', null);
      formData.append('Department', null);
      formData.append('InsertedMachineInfo', null);
      formData.append('UpdatedMachineInfo', null);
      formData.append('ParentUserId', parentUserId);
      formData.append('UserRole', userRole);
      formData.append('CompanyId', companyId);
      formData.append('Reg_Number', regNumber);
      formData.append('UserId', id);
      formData.append('SelfEmpId', null);
      formData.append('mode', 2);
      if (profilePhoto) {
        formData.append('UserImage', profilePhoto);
      }

      try {
        const res = await UserManagementServices.saveAndUpdateUser(formData);
        if (res.data.status) {
          toast.success(res.data.message);
          navigate(-1);
        } else {
          // Handle error response from API
          const errorMessage = res.data.message || 'An error occurred';
          toast.error(errorMessage);
        }
        console.log(res);
      } catch (error) {
        // Handle network errors or other exceptions
        const errorMessage =
          error.response?.data?.message || error.message || 'An error occurred while saving user';
        toast.error(errorMessage);
        console.error('Error saving user:', error);
      } finally {
        setLoading(false);
      }
      // Handle form submission here
    },
  });

  const handleGetUser = async () => {
    try {
      const res = await UserManagementServices.getUserManagement(id);
      //eslint-disabled-next-line
      const data = res.data.data || res.data;
      if (data) {
        const userRoleId = data.roleId || '';
        formik.setValues({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.emailId || '',
          userName: data.loginId || '',
          userRole: userRoleId,
          isWorkingDirector: data.isWorkingDirector || false,
          profilePhoto: null,
        });

        // Set the roleId state for dropdown selection
        setRoleId(userRoleId.toString());

        if (data.profileImage) {
          setProfileImgState(data.profileImage); // Set profile image preview
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue('profilePhoto', file); // Store file in Formik
      setProfileImgState(URL.createObjectURL(file)); // Update preview
    }
  };

  useEffect(() => {
    if (id) {
      handleGetUser();
    }
  }, [id]);

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

  // Effect to synchronize roleId when RoleListById loads
  useEffect(() => {
    if (RoleListById && !id) {
      // For new users, ensure default roleId 1 is properly set in dropdown
      setRoleId('1');
      formik.setFieldValue('userRole', 1);
    }
  }, [RoleListById, id]);

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
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24 mt-0">
          <ul className="d-flex align-items-center gap-2 list-unstyled mt-3">
            <li className="fw-medium">
              <Link to="/apps/dashboard" className="d-flex align-items-center gap-1 text-muted">
                {' '}
                <i className="ti-home" /> Dashboard{' '}
              </Link>
            </li>
            <li>-</li>
            <li className="fw-medium">
              <Link
                to="/apps/administration/UserManagement"
                className="d-flex align-items-center gap-1 text-muted"
              >
                {' '}
                My Users
              </Link>
            </li>
            <li>-</li>
            <li className="fw-medium">Update Admin User </li>
          </ul>
        </div>
        <div className="page-content">
          <div className="container-fluid mt-2">
            <div className="page-content-wrapper">
              <div className="row">
                <div className="col-xl-12">
                  <div className="card">
                    <div className="card-header py-3 bg_ligh">
                      <div className="row align-items-center d-flex">
                        <div className="col-xl-12 col-12 mb-2 mb-lg-0">
                          <h4 className="header-title mb-0 text-success">
                            <i className="far fa-user text-success pe-2" /> Update User
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="card-body profile">
                      {loader ? (
                        <Loader />
                      ) : (
                        <>
                          <div className="row g-3 align-items-center mt-1 mb-4">
                            <div className="col-12 col-md-2 col-lg-2">
                              <img
                                className="profile-image mb-2"
                                src={profileImgState || profileImg}
                                alt="Profile"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = profileImg;
                                  // If image fails to load, show default
                                }}
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
                                    <div className="invalid-feedback">
                                      {formik.errors.firstName}
                                    </div>
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
                                      formik.touched.email && formik.errors.email
                                        ? 'is-invalid'
                                        : ''
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
                                    disabled={CategoryType !== 'SSB'}
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

                              {/* User Role */}
                              {/* <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mb-3">
                              <Label>User Role</Label>
                              <select
                                className={`form-select ${
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
                                <option value={1}>Administrative</option>
                                <option value={2}>Standard</option>
                              </select>
                              {formik.touched.userRole && formik.errors.userRole ? (
                                <div className="invalid-feedback">{formik.errors.userRole}</div>
                              ) : null}
                            </div>
                          </div> */}

                              {/* <div className="col-md-4 col-lg-4 col-xl-4">
                                <div className="mb-3">
                                  <Label>User Role</Label>
                                  <div className="mb-3">
                                    <select
                                      id="role"
                                      name="role"
                                      className="form-select"
                                      value={roleId || ''}
                                      onChange={handleRoleChange}
                                      style={{ padding: '12px' }}
                                    >
                                      <option value="">Select a Role</option>

                                      {RoleListById?.map((group) => (
                                        <optgroup key={group.id} label={group.name}>
                                          {group.roleName.map((role) => (
                                            <option key={role.roleId} value={role.roleId}>
                                              {role.roleName}
                                            </option>
                                          ))}
                                        </optgroup>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div> */}

                              <div className="col-md-4 col-lg-4 col-xl-4">
                                <div className="mb-3">
                                  <Label>User Role</Label>
                                  <div className="mb-3">
                                    <select
                                      id="role"
                                      name="role"
                                      className="form-select"
                                      value={roleId || ''}
                                      onChange={handleRoleChange}
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
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Submit Button */}
                            <div className="row mt-4">
                              <div className="col-md-4 col-lg-4 col-xl-4">
                                <button
                                  type="submit"
                                  className="btn btn-success px-4 me-3"
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-2" />
                                      Saving...
                                    </>
                                  ) : (
                                    <>
                                      <i className="far fa-save pe-1"></i> Save
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
                        </>
                      )}
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
export default UpdateAdminUser;
