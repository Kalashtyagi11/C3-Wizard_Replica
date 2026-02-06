import React from 'react'
import { Label } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { addEmployee } from '../../../store/apps/employee/EmployeeSlice';



 const AddEmployee = () => {
    // Initial form values
    const initialValues = {
      socSecNum:'',
      firstName:'',
      middleName: '',
      lastName:'',
      birthDate: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: '',
      zip: '',
      phone: '',
      mobile: '',
      email: '',
      tin: '',
      incRate:'',
      lastPayDate: '',
      commencementDate: '',
      payPeriod: '',
      maritalStat: '',
      occupation: '',
      department: '',
      isemployeeDirector: false,
      isLevyExempt: false,
      
      
      yearName: '',
      wagesAmount: '0',
      
      emplCode: '',
      mode: '1',
      companyid: 1,
    };
  
    // Validation Schema using Yup
    const validationSchema = Yup.object({
      socSecNum: Yup.string().required('Social Security number is required'),
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      birthDate: Yup.date().required('Birth Date is required'),
      gender: Yup.string().required('Gender is required'),
      maritalStatus: Yup.string().required('Marital Status is required'),
      address1: Yup.string().required('Address #1 is required'),
      country: Yup.string().required('Country is required'),
      zip: Yup.string().required('Postal Code is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      phone: Yup.string().required('Phone Number is required'),
      mobile: Yup.string().required('Mobile Number is required'),
      incRate: Yup.string().required('Salary is required'),
      payPeriod: Yup.string().required('Pay Period is required'),
    });
  

      const dispatch = useDispatch();
      const { message, type } = useSelector((state) => state.messageReducer);
    
      const { addEmployeeR } = useSelector((state) => state.employeeSlice || {});
  const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = (values, { resetForm }) => {
      // Simulate API call or other processing logic
      dispatch(addEmployee({...values,amount: 0,monthno: 0,employeeID: 0,rbmale: true,terminated: null,start_Date: null,end_Date: null,holidayPay_Date: null,wagespaydate: null,})).unwrap().then((response)=>{
              console.log("saveHoliday response",response.deleteHolidayResponse)
              toast.success(response.addEmployeeResponse.message);
              navigate('/apps/C3/Employee')
            })
    };


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
            <h5 className="fw-semibold mb-0"> Add Employee Details </h5>
            <ul className="d-flex align-items-center gap-2 list-unstyled">
              <li className="fw-medium">
                <a
                  href="index.html"
                  className="d-flex align-items-center gap-1 text-muted"
                >
                  {" "}
                  <i className="ti-home" /> Dashboard{" "}
                </a>
              </li>
              <li>-</li>
              <li className="fw-medium">
                <a
                  href="employee.html"
                  className="d-flex align-items-center gap-1 text-muted"
                >
                  {" "}
                  Add Employee{" "}
                </a>
              </li>
              <li>-</li>
              <li className="fw-medium"> Employee </li>
            </ul>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-header py-3 bg_ligh">
                  <div className="row align-items-center d-flex">
                    <div className="col-xl-8">
                      <h4 className="header-title mb-0 text-success">
                        <i className="far fa-user text-success pe-2" />
                        Add Employee Details
                      </h4>
                    </div>
                    {/*         <div class="col-xl-4 text-end">
                                      <button class="btn btn-success waves-effect waves-light h-45" type="submit"><i class="fas fa-plus pe-1"></i> Add Employer</button>
                              </div> */}
                  </div>
                </div>
                <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              
                render={({ errors, touched }) => (
                  <Form>
<div className="card-body">
                  <div className="row">
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>
                          Social Security <span className="text-danger">*</span>
                        </Label>
                        <Field
                                type="text"
                                name="socSecNum"
                                className="form-control"
                                placeholder="Enter SSN"
                              />
                              <ErrorMessage name="socSecNum" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>
                          Date <span className="text-danger">*</span>
                        </Label>
                        <Field
                                type="date"
                                name="birthDate"
                                className="form-control"
                              />
                              <ErrorMessage name="birthDate" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>
                          {" "}
                          First Name <span className="text-danger">*</span>
                        </Label>
                        <Field
                                type="text"
                                name="firstName"
                                className="form-control"
                                placeholder="Enter First Name"
                              />
                              <ErrorMessage name="firstName" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>
                          Last Name <span className="text-danger">*</span>
                        </Label>
                        <Field
                                type="text"
                                name="lastName"
                                className="form-control"
                                placeholder="Enter Last Name"
                              />
                              <ErrorMessage name="lastName" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>Middle Name</Label>
                        <Field
                                type="text"
                                name="middleName"
                                className="form-control"
                                placeholder="Enter Middle Name"
                              />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <Label>
                        Gender <span className="text-danger">*</span>
                      </Label>
                      <div className="mb-3">
                        <Field as="select" name="gender" className="form-select">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </Field>
                              <ErrorMessage name="gender" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>Marital Status</Label>
                        <Field as="select" name="maritalStatus" className="form-select">
                                <option value="">Select Marital Status</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                              </Field>
                              <ErrorMessage name="maritalStatus" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>Working Director? </Label>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="formCheck1"
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
                 <div className="card-header bg-light py-3 mb-2">
                  <div className="row g-3 align-items-center">
                    <div className="col">
                      <h5 className="header-title mb-0 text-success">
                        <i className="fas fa-map-marker-alt f-20" /> Address
                        Details
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
                        <Field
                                type="text"
                                name="address1"
                                className="form-control"
                                placeholder="Enter Address #1"
                              />
                              <ErrorMessage name="address1" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>Address #2</Label>
                        <Field
                                type="text"
                                name="address2"
                                className="form-control"
                                placeholder="Enter Address #2"
                          />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>City</Label>
                        <Field
                                type="text"
                                name="city"
                                className="form-control"
                                placeholder="Enter City"
                              />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>Postal Code</Label>
                        <Field
                                type="text"
                                name="zip"
                                className="form-control"
                                placeholder="Enter Postal Code"
                              />
                              <ErrorMessage name="zip" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>
                          Country <span className="text-danger">*</span>{" "}
                        </Label>
                        <Field as="select" name="country" className="form-select">
                                <option value="">Select Country</option>
                                <option value="1">Saint Kitts</option>
                                <option value="2">Nevis</option>
                              </Field>
                              <ErrorMessage name="country" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>Email</Label>
                        <Field
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter Email"
                              />
                              <ErrorMessage name="email" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>Mobile Number</Label>
                        <Field
                                type="text"
                                name="mobile"
                                className="form-control"
                                placeholder="Enter Mobile Number"
                              />
                              <ErrorMessage name="mobile" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>Phone Number </Label>
                        <Field
                                type="text"
                                name="phone"
                                className="form-control"
                                placeholder="Enter Phone Number"
                              />
                              <ErrorMessage name="phone" component="div" className="text-danger" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-header bg-light py-3 mb-2">
                  <div className="row g-3 align-items-center">
                    <div className="col">
                      <h5 className="header-title mb-0 text-success">
                        <i className="far fa-file-alt f-18" /> Other Details{" "}
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>Commencement</Label>
                        <Field
                                type="date"
                                name="commencementDate"
                                className="form-control"
                              />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>Termination </Label>
                        <Field
                                type="date"
                                name="terminationDate"
                                className="form-control"
                              />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>Last Pay Date </Label>
                        <Field
                                type="date"
                                name="lastPayDate"
                                className="form-control"
                              />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>Occupation </Label>
                        <Field
                                type="text"
                                name="occupation"
                                className="form-control"
                                placeholder="Enter Occupation"
                              />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>
                          Pay Period <span className="text-danger">*</span>
                        </Label>
                        <Field as="select" name="payPeriod" className="form-select">
                                <option value="">Select Pay Period</option>
                                <option value="weekly">Weekly</option>
                                <option value="bi-weekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                              </Field>
                              <ErrorMessage name="payPeriod" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>Is Levy Exempt ? </Label>
                        <div className="form-check">
                        <Field type="checkbox" name="isLevyExempt" />
                          <Label
                            className="form-check-Label"
                            htmlFor="formCheck1"
                          ></Label>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>
                          Salary <span className="text-danger">*</span>
                        </Label>
                        <Field
                                type="text"
                                name="incRate"
                                className="form-control"
                                placeholder="Enter Salary"
                              />
                              <ErrorMessage name="incRate" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <div className="mb-3">
                        <Label>Department </Label>
                        <Field
                                type="text"
                                name="department"
                                className="form-control"
                                placeholder="Enter Department"
                              />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-md-4 col-lg-4 col-xl-4">
                      <button
                        type="submit"
                        className="btn btn-success px-4 me-3"
                      >
                        <i className="far fa-save pe-1" /> Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-light border px-4"
                      >
                        <i className="fas fa-times" /> Cancel
                      </button>
                    </div>
                  </div>
                </div>
                  </Form>
                 )}
              />
                
             
              </div>
            </div>
          </div>
        </div>{" "}
        {/* container-fluid */}
      </div>
      {/* End Page-content */}
      <sidebar-barrrrr></sidebar-barrrrr>
    </div>
    {/* end main content*/}
  </div>
</div>

  )
};
export default AddEmployee;
