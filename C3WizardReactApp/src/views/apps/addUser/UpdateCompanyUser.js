import React, { useEffect, useRef, useState } from 'react';
import { Label, Input, Spinner } from 'reactstrap';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { getRoleById } from '../../../store/apps/Admin/RolemanagementSlice';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import profileImg from '../../../assets/images/users/profile.png';
import { getCompanyDropdown } from '../../../store/apps/dashboard/DashboardSlice';
import Loader from '../../../layouts/loader/Loader';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  userName: Yup.string().required('Username is required'),
  companyId: Yup.string(),
  userRole: Yup.string().required('User Role is required'),
  isWorkingDirector: Yup.boolean(),
  SECUsersProfilesString: Yup.array()
    .min(1, 'Please select at least one company') // at least 1 company must be selected
    .required('Company User is required'),
});

const UpdateCompanyUser = () => {
  const [profileImgState, setProfileImgState] = useState(profileImg); // Default Image
  const [loader, setLoader] = useState(true);
  const [companyList, setCompanyList] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { companyId: navCompanyId, UseridUnique, regNumber, parentId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [roleId, setRoleId] = useState(id ? null : 3);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const dispatch = useDispatch();
  const { RoleList, RoleListById } = useSelector((state) => state.RoleSlice || {});
  const { CompanyDropdown } = useSelector((state) => state.dashboardSlice || {});
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const getAllCompaniesHandler = async () => {
    setLoadingCompanies(true);
    try {
      const res = await UserManagementServices.getAllCompanyData();
      setCompanyList(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCompanies(false);
    }
  };
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      userRole: '',
      isWorkingDirector: false,
      companyId: '',
      profilePhoto: null,
      SECUsersProfiles: null,
      SECUsersProfilesString: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const { firstName, lastName, email, userName, userRole, companyId, profilePhoto } = values;
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
      formData.append('ParentUserId', parentId);
      formData.append('UserRole', Number(userRole));
      formData.append('CompanyId', Number(companyId));
      formData.append('UserId', id);
      formData.append('Reg_Number', regNumber);
      formData.append('SelfEmpId', null);
      formData.append('mode', 2);
      if (profilePhoto) {
        formData.append('UserImage', profilePhoto);
      }
      const payloadCompanies = (CompanyDropdown || []).map((company) => ({
        ...company,
        seleted_Comp: selectedCompanies.some((c) => c.company_Id === company.company_Id),
      }));
      formData.append('SECUsersProfilesString', JSON.stringify(payloadCompanies));

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
        console.log(error);
        const errorMessage = error?.response?.data?.message || 'Something went wrong!';
        toast.error(errorMessage);
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
      const dropdown = res.data.dropdown || [];
      if (data) {
        const userRoleId = data.roleId || '';
        formik.setValues({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.emailId || '',
          userName: data.loginId || '',
          companyId: data.empId || '',
          userRole: data.roleId || '',
          isWorkingDirector: data.isWorkingDirector || false,
          profilePhoto: null,
          SECUsersProfilesString: [],
        });

        if (data.profileImage) {
          setProfileImgState(data.profileImage); // Set profile image preview
        }

        // Set the roleId state for dropdown selection
        setRoleId(userRoleId.toString());

        if (data.profileImage) {
          setProfileImgState(data.profileImage); // Set profile image preview
        }
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
    ParentId: navCompanyId,
    UserID: parentId,
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
    // This should trigger if dev tools are open

    if (selectedCompanies.length > 0) {
      const names = selectedCompanies.map((c) => c.company_Name).join(', ');
      console.log('Selected Companies:', names);
    } else {
      console.log('No companies selected');
    }
  }, []);

  useEffect(() => {
    if (id) {
      handleGetUser();
      getAllCompaniesHandler();
    }
  }, [id]);

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
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24"></div>
              <div className="row">
                <div className="col-xl-12">
                  <div className="card">
                    <div className="card-header py-3 bg_ligh">
                      <div className="row align-items-center d-flex">
                        <div className="col-xl-8 col-8 mb-2 mb-lg-0">
                          <h4 className="header-title mb-0 text-success">
                            <i className="far fa-user text-success pe-2" /> Update User
                          </h4>
                        </div>
                        {/* Company */}
                        <div className="col-md-4 col-lg-4 col-xl-4">
                          <div className="mt-2">
                            <div className="select-wrapper">
                              <select
                                className={`form-select ${
                                  formik.touched.companyId && formik.errors.companyId
                                    ? 'is-invalid'
                                    : ''
                                }`}
                                disabled
                                id="companyId"
                                name="companyId"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.companyId}
                              >
                                <option value="">Select Employer</option>
                                {companyList.map((item) => (
                                  <option key={item.companyId} value={item.companyId}>
                                    {item.companyName}
                                  </option>
                                ))}
                              </select>
                              {loadingCompanies && (
                                <Spinner size="sm" color="primary" className="select-spinner" />
                              )}
                            </div>
                            {formik.touched.companyId && formik.errors.companyId ? (
                              <div className="invalid-feedback">{formik.errors.companyId}</div>
                            ) : null}
                          </div>
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
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = profileImg;
                                  // If image fails to load, show default
                                }}
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
                                  <Label>Email</Label> <span className="text-danger">*</span>
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
                                    // disabled
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
                                        if (group.name === 'Company') {
                                          // Only render "SSB" group
                                          return (
                                            <optgroup key={group.id} label={group.name}>
                                              {group.roleName.map((role) => (
                                                <option
                                                  key={role.roleId}
                                                  value={role.roleId}
                                                  disabled={role.roleName !== 'Company User'}
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
export default UpdateCompanyUser;
