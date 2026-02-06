import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Label, Input } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import { getCompanyDropdown } from '../../../store/apps/dashboard/DashboardSlice';
import profileImg from '../../../assets/images/users/profile.png';
import Loader from '../../../layouts/loader/Loader';
import { getRoleById } from '../../../store/apps/Admin/RolemanagementSlice';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  userName: Yup.string().required('Username is required'),

  userRole: Yup.string().required('User Role is required'),
  isWorkingDirector: Yup.boolean(),
  SECUsersProfilesString: Yup.array()
    .min(1, 'Please select at least one company') // at least 1 company must be selected
    .required('Company User is required'),
});

const UpdateUser = () => {
  const [profileImgState, setProfileImgState] = useState(profileImg); // Default Image
  const [loader, setLoader] = useState(true);
  const fileInputRef = useRef(null);
  const regNumber = localStorage.getItem('reG_NUMBER');
  const navigate = useNavigate();
  const id = localStorage.getItem('editUserId');
  const parent = localStorage.getItem('parentId');

  const dispatch = useDispatch();
  const { RoleList, RoleListById } = useSelector((state) => state.RoleSlice || {});

  const roleIdLogin = parseInt(localStorage.getItem(''), 10);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [roleId, setRoleId] = useState(roleIdLogin);
  // const { CompanyDropdown } = useSelector((state) => state.dashboardSlice || {});
  const [CompanyDropdown, setCompanyDropdown] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      userRole: '',
      isWorkingDirector: false,
      profilePhoto: null,
      SECUsersProfiles: null,
      SECUsersProfilesString: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      const { firstName, lastName, email, userName, userRole, profilePhoto } = values;
      // const userId = localStorage.getItem('userID');
      const companyId = localStorage.getItem('companyId');
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
      formData.append('ParentUserId', parent);
      formData.append('UserRole', Number(userRole));
      formData.append('CompanyId', companyId);
      formData.append('UserId', id);
      formData.append('Reg_Number', regNumber);
      formData.append('SelfEmpId', null);
      formData.append('mode', 2);
      formData.append('SECUsersProfiles', null);
      // Build SECUsersProfilesString from all companies, mark selected/unselected explicitly
      const payloadCompanies = (CompanyDropdown || []).map((company) => ({
        ...company,
        seleted_Comp: selectedCompanies.some((c) => c.company_Id === company.company_Id),
      }));
      formData.append('SECUsersProfilesString', JSON.stringify(payloadCompanies));

      if (profilePhoto) {
        formData.append('UserImage', profilePhoto);
      }

      try {
        const res = await UserManagementServices.saveAndUpdateUser(formData);
        if (res.data.status) {
          toast.success(res.data.message);
          navigate(-1);
        }
        console.log(res);
      } catch (error) {
        toast.error(error.response.data.message);

        console.log(error);
      }
      // Handle form submission here
    },
  });

  const handleGetUser = async () => {
    try {
      const res = await UserManagementServices.getUserManagement(id);
      //eslint-disabled-next-line
      const data = res.data.data || res.data;

      const dropdown = res.data.dropdown || [];
      if (data) {
        formik.setValues({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.emailId || '',
          userName: data.loginId || '',
          userRole: data.roleId || '',
          isWorkingDirector: data.isWorkingDirector || false,
          profilePhoto: null,
          SECUsersProfilesString: [],
        });

        if (data.profileImage) {
          setProfileImgState(data.profileImage); // Set profile image preview
        }

        setCompanyDropdown(dropdown);

        const preSelectedCompanies = dropdown.filter((c) => c.seleted_Comp === true);
        setSelectedCompanies(preSelectedCompanies);
        formik.setFieldValue('SECUsersProfilesString', preSelectedCompanies);
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

  const dropDownload = {
    ParentId: localStorage.getItem('companyId'),
    UserID: localStorage.getItem('userID'),
    roleId: localStorage.getItem('roleId'),
  };

  // useEffect(() => {
  //   dispatch(getCompanyDropdown(dropDownload));
  // }, []);

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

  useEffect(() => {
    // This should trigger if dev tools are open

    if (selectedCompanies.length > 0) {
      const names = selectedCompanies.map((c) => c.company_Name).join(', ');
      console.log('Selected Companies:', names);
    } else {
      console.log('No companies selected');
    }
  }, []);

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
                <h5 className="fw-semibold mb-0"> Update User </h5>
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
                  <li className="fw-medium">Update User </li>
                </ul>
              </div>
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
                                src={profileImgState}
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
                                  <Label>
                                    Email <span className="text-danger">*</span>
                                  </Label>
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
                                  <Label>User Name</Label> <span className="text-danger">*</span>
                                  <input
                                    type="text"
                                    className={`form-control ${
                                      formik.touched.userName && formik.errors.userName
                                        ? 'is-invalid'
                                        : ''
                                    }`}
                                    disabled
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
                              <div className="col-md-4 col-lg-4 col-xl-4">
                                <div className="mb-3">
                                  <Label>User Role</Label> <span className="text-danger">*</span>
                                  <Input
                                    disabled
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
                                    {/* <option value={3} disabled>
                                      Employer
                                    </option>
                                    <option value={4}>Employer User</option> */}
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
                                        {/* {selectedCompanies.length > 0
                                          ? selectedCompanies.map((c) => c.company_Name).join(', ')
                                          : 'Select Companies'} */}
                                        {selectedCompanies.length > 0
                                          ? selectedCompanies.map((c) => c.company_Name).join(' ')
                                          : ''}
                                        {selectedCompanies.map((c) => c.company_name).join(', ')}
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
                                              {company.company_name}
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
export default UpdateUser;
