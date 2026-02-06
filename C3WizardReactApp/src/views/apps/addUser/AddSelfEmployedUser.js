
import React, { useEffect, useRef, useState } from 'react';
import { Label } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import profileImg from "../../../assets/images/users/profile.png"

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
  companyId: Yup.string().required('Employer is required'),
});

const AddSelfEmployedUser = () => {

  const [profileImgState, setProfileImgState] = useState(profileImg); // Default Image
  const [companyList, setCompanyList] = useState([]);
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const getAllCompaniesHandler=async()=>{
    try {
      const res = await UserManagementServices.getAllCompany()
      setCompanyList(res.data.data)
        } catch (error) {
      console.log(error)
    }
  } 
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      password: '',
      confirmPassword: '',
      userRole: '',
      companyId: '',
      profilePhoto: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const {
        firstName,
        lastName,
        email,
        userName,
        password,
        userRole,companyId,
        profilePhoto
      } = values;
      const userId = localStorage.getItem("userID")
      const formData = new FormData();
      formData.append('FirstName',firstName);
      formData.append('LastName',lastName);
      formData.append('EmailId',email);
      formData.append('LoginId',userName);
      formData.append('Password',password);
      formData.append('EmpId',"0");
      formData.append('MachineInfo',null);
      formData.append('Department',null);
      formData.append('InsertedMachineInfo',null);
      formData.append('UpdatedMachineInfo',null);
      formData.append('ParentUserId',0);
      formData.append('UserRole',Number(userRole));
      formData.append('CompanyId',Number(companyId));
      formData.append('UserId',userId);
      formData.append('SelfEmpId',null);
      formData.append('mode',1);
      if(profilePhoto){

        formData.append('UserImage',profilePhoto);
      }

      try {
        const res = await UserManagementServices.saveAndUpdateUser(formData);
        if(res.data.status){
          toast.success(res.data.message)
          navigate("/admin/manage-users/company-users", {
            state: { companyId },
          });
        }
        console.log(res)
      } catch (error) {
        console.log(error)
      }
      // Handle form submission here
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("profilePhoto", file); // Store file in Formik
      setProfileImgState(URL.createObjectURL(file)); // Update preview
    }
  }

  useEffect(() => {
    getAllCompaniesHandler()
  }, [])
  
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
                    <Link to="/apps/dashboard" className="d-flex align-items-center gap-1 text-muted">
                      {' '}
                      <i className="ti-home" /> Dashboard{' '}
                    </Link>
                  </li>
                  <li>-</li>
                  <li className="fw-medium">
                    <Link to="/admin/manage-users/company-users" 
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
                        <div className="col-xl-12 col-12 mb-2 mb-lg-0">
                          <h4 className="header-title mb-0 text-success">
                            <i className="far fa-user text-success pe-2" /> Add User
                          </h4>
                        </div>
                         {/* Company */}
                         <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mt-2">
                              {/* <Label>Company</Label> */}
                              <select
                                className={`form-select ${
                                  formik.touched.companyId && formik.errors.companyId
                                    ? 'is-invalid'
                                    : ''
                                }`}
                                id="companyId"
                                name="companyId"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.companyId}
                              >
                                <option value="">Select Employer</option>
                                {
                    companyList.map(item=>(

                      <option key={item.companyId} value={item.companyId} >{item.companyName}</option>

                    ))
                  }
                 
                              </select>
                              {formik.touched.companyId && formik.errors.companyId ? (
                                <div className="invalid-feedback">{formik.errors.companyId}</div>
                              ) : null}
                            </div>
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
            style={{ cursor: "pointer", color: "blue" }}
          >
            Change Profile Photo
          </span>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef} // Assign ref
            style={{ display: "none" }}
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

                          {/* Password */}
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <div className="mb-3">
                              <Label>Password</Label>
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
                              <Label>Confirm Password</Label>
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
                                <option value={3}>Employer</option>
                                <option value={4}>Employer User</option>
                              </select>
                              {formik.touched.userRole && formik.errors.userRole ? (
                                <div className="invalid-feedback">{formik.errors.userRole}</div>
                              ) : null}
                            </div>
                          </div>
                          

                        
                        </div>

                        {/* Submit Button */}
                        <div className="row mt-4">
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <button type="submit" className="btn btn-success px-4 me-3">
                              <i className="far fa-save pe-1" /> Save
                            </button>
                            <button type="button" onClick={()=>navigate(-1)} className="btn btn-light border px-4">
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
export default AddSelfEmployedUser;
