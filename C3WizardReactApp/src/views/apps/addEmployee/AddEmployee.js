import React, { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Spinner } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import {
  addEmployee,
  getEmployeeSSN,
  getEmployeeSSNNew,
  clearEmployeeNWList,
} from '../../../store/apps/employee/EmployeeSlice';
import './MainSwitch.scss';

const AddEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UserName = localStorage.getItem('userId');
  const UserPassword = localStorage.getItem('userPassword');
  const { message, type: messageType } = useSelector((state) => state.messageReducer);
  const { addEmployeeR, EmployeeListSSN, EmployeeListSSNNew } = useSelector(
    (state) => state.employeeSlice || {},
  );
  const location = useLocation();
  const CompanyId = localStorage.getItem('companyId');
  console.log('AddEmployee location', location.state);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    socSecNum: '',
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '',
    address1: '',
    address2: '',
    rbmale: null,
    city: '',
    country: '',
    zip: '',
    phone: '',
    mobile: '+1-869-',
    email: '',
    tin: '',
    incRate: '',
    lastPayDate: null,
    commencementDate: null,
    payPeriod: '',
    maritalStat: '',
    occupation: '',
    department: '',
    isemployeeDirector: false,
    isLevyExempt: false,
    yearName: '',
    wagesAmount: null,
    emplCode: '',
    mode: '1',
    companyid: CompanyId,
    amount: 0,
    monthno: 0,
    employeeID: 0,
    terminated: null,
    start_Date: null,
    end_Date: null,
    holidayPay_Date: null,
    wagespaydate: null,
    holidayPayId: 0,
  });

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({
      ...prev,
      mobile: phone,
    }));
  };

  const [isWages, setisWages] = useState(false);
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   if (!formData.isemployeeDirector) {
  //     setisWages(false);
  //   }
  // }, [formData.isemployeeDirector]);
  useEffect(() => {
    if (formData.isemployeeDirector === true) {
      setisWages(true); // Show wages fields
    } else {
      setisWages(false); // Hide wages fields
    }
  }, [formData.isemployeeDirector]);

  useEffect(() => {
    if (location.state) {
      const updatedFormData = { ...formData };

      Object.keys(location.state).forEach((key) => {
        if (key in updatedFormData) {
          const value = location.state[key];

          if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
            const date = new Date(value);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            updatedFormData[key] = `${year}-${month}-${day}`;
          } else {
            updatedFormData[key] = value;
          }
        }
      });
      updatedFormData.mode = '2';
      setFormData(updatedFormData);
    }
  }, [location.state]);

  const validateForm = (data) => {
    const validationErrors = {};

    if (!data.socSecNum || data.socSecNum.length !== 6) {
      validationErrors.socSecNum = 'Social Security Number must be exactly 6 characters';
    }
    if (!data.firstName) {
      validationErrors.firstName = 'First Name is required';
    }
    if (!data.lastName) {
      validationErrors.lastName = 'Last Name is required';
    }
    // if (!data.birthDate) {
    //   validationErrors.birthDate = 'Birth Date is required';
    // }
    if (!data.birthDate || data.birthDate.trim() === '') {
      validationErrors.birthDate = 'Birth Date is required';
    }
    if (data.rbmale === null) {
      // Corrected the field to rbmale

      validationErrors.rbmale = 'Gender is required';
    }
    if (!data.address1) {
      validationErrors.address1 = 'Address #1 is required';
    }
    // if (!data.country) {
    //   validationErrors.country = 'Country is required';
    // }

    if (!data.payPeriod) {
      validationErrors.payPeriod = 'Pay Period is required';
    }
    if (!data.incRate) {
      validationErrors.incRate = 'Salary is required';
    }

    // if (data.isemployeeDirector === true && isWages && !data.wagesAmount) {
    //   validationErrors.wagesAmount = 'Amount is required';
    // }

    if (isWages && !data.wagesAmount) {
      validationErrors.wagesAmount = 'Amount is required';
    }

    if (data.isemployeeDirector === true && isWages && !data.holidayPay_Date) {
      // console.log("check Vaidation holidayPay Date",data.isemployeeDirector,data.amount,data.isemployeeDirector === true && !data.amount)
      validationErrors.holidayPay_Date = 'Pay Date is required';
    }

    const holidayPayDate = data.holidayPay_Date ? new Date(data.holidayPay_Date) : null;
    const birthDate = data.birthDate ? new Date(data.birthDate) : null;
    const commencementDate = data.commencementDate ? new Date(data.commencementDate) : null;
    const terminatedDate = data.terminated ? new Date(data.terminated) : null;

    if (holidayPayDate) {
      if (birthDate && holidayPayDate < birthDate) {
        validationErrors.holidayPay_Date = 'Pay Date cannot be before Birth Date';
      } else if (commencementDate && holidayPayDate < commencementDate) {
        validationErrors.holidayPay_Date = 'Pay Date cannot be before Commencement Date';
      } else if (terminatedDate && holidayPayDate > terminatedDate) {
        validationErrors.holidayPay_Date = 'Pay Date cannot be after Termination Date';
      }
    }

    // Email validation
    // if (!data.email && !/^[A-Za-z][A-Za-z0-9_.@]{8,100}$/.test(data.email)) {
    //   validationErrors.email = 'Email must contain @';
    // }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const localPart = data.email.split('@')[0]; // Extract part before '@'

    // if (!emailRegex.test(data.email)) {
    //   validationErrors.email = 'Invalid Email';
    // } else if (localPart.length < 1 || localPart.length > 64) {
    //   validationErrors.email = 'Email  must be between 1 and 64 characters';
    // }

    // 13-08-2025 remove by anjani
    // if (!data.email) {
    //   validationErrors.email = 'Email is required';
    // } else if (!emailRegex.test(data.email)) {
    //   validationErrors.email = 'Invalid Email';
    // } else if (localPart.length < 1 || localPart.length > 64) {
    //   validationErrors.email = 'Email must be between 1 and 64 characters';
    // }

    const getValidNumberLength = (number, prefix) => {
      if (!number || number === prefix) return 0;
      return number.replace(/\D/g, '').length;
    };

    // const mobileDigits = getValidNumberLength(formData.mobile, '+1-869-');
    // const phoneDigits = getValidNumberLength(formData.phone, '');

    // if (!mobileDigits && !phoneDigits) {
    //   validationErrors.mobile = 'Either Mobile or Phone is required';
    // }

    // if (mobileDigits > 0 && mobileDigits < 7) {
    //   validationErrors.mobile = 'Mobile number must be at least 7 digits';
    // }

    // if (phoneDigits > 0 && phoneDigits < 7) {
    //   validationErrors.phone = 'Phone number must be at least 7 digits';
    // }

    // 13-08-2025 remove by anjani

    // const holidayPayDate = data.holidayPay_Date ? new Date(data.holidayPay_Date) : null;
    // const birthDate = data.birthDate ? new Date(data.birthDate) : null;
    // const commencementDate = data.commencementDate ? new Date(data.commencementDate) : null;
    // const terminatedDate = data.terminated ? new Date(data.terminated) : null;

    // if (holidayPayDate) {
    //   if (birthDate && holidayPayDate < birthDate) {
    //     validationErrors.holidayPay_Date = 'Pay Date cannot be before Birth Date';
    //   }
    //  else if (commencementDate && holidayPayDate < commencementDate) {
    //     validationErrors.holidayPay_Date = 'Pay Date cannot be before Commencement Date';
    //   }
    //   else if (terminatedDate && holidayPayDate > terminatedDate) {
    //     validationErrors.holidayPay_Date = 'Pay Date cannot be after Termination Date';
    //   }
    // }

    return validationErrors;
  };

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: type === 'checkbox' ? checked : value,
  //   });
  //   if (name === 'rbmale') {
  //     setFormData({
  //       ...formData,
  //       [name]: value === 'Male',
  //     });
  //   }

  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // List of fields that should be set to null if the value is an empty string
    const fieldsToNullify = [
      'holidayPay_Date',
      'terminated',
      'birthDate',
      'commencementDate',
      'lastPayDate', // Added lastPayDate to the list
    ];

    // Check if the value is an empty string and set it to null for specific fields
    const processedValue = fieldsToNullify.includes(name) && value === '' ? null : value;

    // If holidayPay_Date is being updated, update both holidayPay_Date and wagespaydate
    if (name === 'holidayPay_Date') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        holidayPay_Date: processedValue,
        wagespaydate: processedValue,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === 'checkbox' ? checked : processedValue,
      }));
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      mobile:
        (formData.phone && formData.phone !== '+1-869-') || (value && value !== '+1-869-')
          ? ''
          : prevErrors.mobile,
    }));

    // If the radio button for gender is changed, update rbmale specifically

    if (name === 'rbmale') {
      setFormData({
        ...formData,
        [name]: value === 'Male',
      });
    }
  };

  const [load, setLoad] = useState(false);

  // const handleSearch = () => {
  //   const requiredFields = [
  //     { field: formData.socSecNum, name: 'Social Security Number' },
  //     { field: formData.birthDate, name: 'Birth Date' },
  //     { field: formData.firstName, name: 'First Name' },
  //     { field: formData.lastName, name: 'Last Name' },
  //   ];

  //   const missingField = requiredFields.find((f) => !f.field || f.field.trim?.() === '');

  //   if (missingField) {
  //     toast.error(`${missingField.name} is required.`);
  //     return;
  //   }

  //   setLoading(true);
  //   const payload = {
  //     Txt_SSN: formData.socSecNum,
  //     DOB: formData.birthDate,
  //     Txt_Fname: formData.firstName,
  //     Txt_Mname: formData.middleName,
  //     Txt_Surname: formData.lastName,
  //     username: UserName,
  //     password: UserPassword,
  //   };

  //   dispatch(getEmployeeSSN(payload))
  //     .unwrap()
  //     .then((res) => {
  //       console.error('Response:', res);
  //       // dispatch(setMessage({ message: 'Search successful!', type: 'success' }));
  //     })
  //     .catch((err) => {
  //       // dispatch(setMessage({ message: err || 'Search failed', type: 'error' }));
  //       console.error('Error', err);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  const handleSearch = () => {
    return new Promise((resolve, reject) => {
      const requiredFields = [
        { field: formData.socSecNum, name: 'Social Security Number' },
        { field: formData.birthDate, name: 'Birth Date' },
        { field: formData.firstName, name: 'First Name' },
        { field: formData.lastName, name: 'Last Name' },
      ];

      const missingField = requiredFields.find((f) => !f.field || f.field.trim?.() === '');
      if (missingField) {
        toast.error(`${missingField.name} is required.`);
        return reject(new Error(`${missingField.name} is required.`));
      }

      const payload = {
        Txt_SSN: formData.socSecNum,
        DOB: formData.birthDate,
        Txt_Fname: formData.firstName,
        Txt_Mname: formData.middleName,
        Txt_Surname: formData.lastName,
        username: UserName,
        password: UserPassword,
      };

      setLoading(true);
      return dispatch(getEmployeeSSN(payload))
        .unwrap()
        .then((res) => {
          console.log('Search success:', res);
          return resolve(res);
        })
        .catch((err) => {
          console.error('Search error:', err);
          return reject(err);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const handleSearchNew = () => {
    return new Promise((resolve, reject) => {
      const requiredFields = [
        { field: formData.socSecNum, name: 'Social Security Number' },
        { field: formData.birthDate, name: 'Birth Date' },
        { field: formData.firstName, name: 'First Name' },
        { field: formData.lastName, name: 'Last Name' },
      ];

      const missingField = requiredFields.find((f) => !f.field || f.field.trim?.() === '');
      if (missingField) {
        toast.error(`${missingField.name} is required.`);
        return reject(new Error(`${missingField.name} is required.`));
      }

      const payload = {
        Txt_SSN: formData.socSecNum,
        DOB: formData.birthDate,
        Txt_Fname: formData.firstName,
        Txt_Mname: formData.middleName,
        Txt_Surname: formData.lastName,
        username: UserName,
        password: UserPassword,
      };

      setLoading(true);
      return dispatch(getEmployeeSSNNew(payload))
        .unwrap()
        .then((res) => {
          console.log('Search success:', res);
          return resolve(res);
        })
        .catch((err) => {
          console.error('Search error:', err);
          return reject(err);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  useEffect(() => {
    dispatch(clearEmployeeNWList());
  }, [dispatch]);

  useEffect(() => {
    if (EmployeeListSSN && EmployeeListSSN.length > 0) {
      const data = EmployeeListSSN[0];

      const convertDate = (dateStr) => {
        if (!dateStr || dateStr.includes('T')) return dateStr;
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
      };

      setFormData((prevState) => ({
        ...prevState,
        socSecNum: data.socSecNum || '',
        firstName: data.firstName || '',
        middleName: '', // Not in API, set to blank
        lastName: data.surName || '',
        // birthDate: data.birthDate || '',
        // birthDate: data.birthDate ? moment(data.birthDate).format('YYYY-MM-DD') : null,
        birthDate: convertDate(data.birthDate),
        address1: data.streetAddress || '',
        address2: data.streetName || '',
        rbmale: data.gender === 'M' ? true : data.gender === 'F' ? false : null,
        city: data.cityTownName || '',
        country: data.countryCode || '',
        zip: data.postalCode || '',
        phone: data.phone || '',
        mobile: data.mobile || '',
        email: data.email || '',
        tin: data.regNo || '',
        incRate: data.salary || '',
        lastPayDate: data.last_Pay_Date || null,
        commencementDate: data.startDate || null,
        payPeriod: data.payPeriod || '',
        // maritalStat: data.maritalStatus || '',
        maritalStat:
          data.maritalStatus === 'S' ? 'Single' : data.maritalStatus === 'M' ? 'Married' : '',
        occupation: data.occupation || '',
        department: '', // Not provided, keep empty or default
        isemployeeDirector: data.isemployeeDirector === 'true',
        isLevyExempt: data.isLevyExempt === 'true',
        yearName: '', // Not provided
        wagesAmount: data.wagesPaid1 || null, // Or compute total
        emplCode: data.regNo || '',
        // Keep existing defaults for the following:
        mode: '1',
        companyid: CompanyId,
        amount: 0,
        monthno: 0,
        employeeID: 0,
        terminated: null,
        start_Date: null,
        end_Date: data.endDate || null,
        holidayPay_Date: null,
        wagespaydate: null,
        holidayPayId: 0,
      }));
    }
  }, [EmployeeListSSN]);

  useEffect(() => {
    if (!location.state) {
      dispatch(clearEmployeeNWList());
      setFormData({
        socSecNum: '',
        firstName: '',
        middleName: '',
        lastName: '',
        birthDate: '',
        address1: '',
        address2: '',
        rbmale: null,
        city: '',
        country: '',
        zip: '',
        phone: '',
        mobile: '+1-869-',
        email: '',
        tin: '',
        incRate: '',
        lastPayDate: null,
        commencementDate: null,
        payPeriod: '',
        maritalStat: '',
        occupation: '',
        department: '',
        isemployeeDirector: false,
        isLevyExempt: false,
        yearName: '',
        wagesAmount: null,
        emplCode: '',
        mode: '1',
        companyid: CompanyId,
        amount: 0,
        monthno: 0,
        employeeID: 0,
        terminated: null,
        start_Date: null,
        end_Date: null,
        holidayPay_Date: null,
        wagespaydate: null,
        holidayPayId: 0,
      });
    }
  }, [location.key]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setLoad(true);

  //     if (!location.state) {
  //       await handleSearchNew();
  //     }

  //     // ✅ Always run validation
  //     const validationErrors = validateForm(formData);
  //     setErrors(validationErrors);
  //     if (Object.keys(validationErrors).length > 0) return;

  //     const response = await dispatch(addEmployee({ ...formData })).unwrap();
  //     navigate(-1);
  //   } catch (error) {
  //     console.error('Form submission error:', error);
  //   } finally {
  //     setLoad(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);

    try {
      const validationErrors = validateForm(formData);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) {
        console.log('❌ Validation failed:', validationErrors);
        return;
      }

      // ✅ Step 2: Now call handleSearchNew (only if not from location.state)
      if (!location.state) {
        const searchResult = await handleSearchNew();
        console.log('🔍 Search API result:', searchResult);
        if (searchResult?.statuscode === 400) {
          // toast.error(searchResult.message || 'Employee already exists.');
          return;
        }
      }

      const response = await dispatch(addEmployee({ ...formData })).unwrap();

      navigate(-1);
    } catch (error) {
      console.error(' Form submission error:', error);
    } finally {
      setLoad(false);
    }
  };

  const handleBlur = (date) => {
    const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 10));

    if (date && date > maxDate) {
      // If the selected date is greater than the maxDate, set it to maxDate
      date = maxDate;
    }

    setFormData((prev) => ({
      ...prev,
      birthDate: date ? moment(date).format('YYYY-MM-DD') : '',
    }));
  };

  useEffect(() => {
    if (message) {
      if (messageType === 'success') {
        toast.success(message);
      } else if (messageType === 'error') {
        toast.error(message);
      }
      dispatch(setMessage({ message: '', type: '' }));
    }
  }, [message, messageType, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  return (
    <div id="layout-wrapper">
      <my-header />
      <sidebar-barrrrrr></sidebar-barrrrrr>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <ul className="d-flex align-items-center gap-2 mt-3 list-unstyled">
          <li className="fw-medium">
            <span className="d-flex align-items-center gap-1 text-muted">
              <i className="ti-home" /> Dashboard
            </span>
          </li>
          <li>-</li>
          <li className="fw-medium">
            <span className="d-flex align-items-center gap-1 text-muted">C3</span>
          </li>
          <li>-</li>
          <li className="fw-medium"> {location.state ? 'Edit' : 'Add'} Employee </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="page-content-wrapper">
              <div className="row">
                <div className="col-xl-12">
                  <div className="card">
                    <div className="card-header bg-light py-3 bg_ligh">
                      <div className="row align-items-center d-flex">
                        <div className="col-xl-8">
                          <h4 className="header-title mb-0 text-success">
                            <i className="fas fa-search text-success pe-2" />
                            Search Profile Details
                          </h4>
                        </div>
                      </div>
                    </div>
                    <Form onSubmit={handleSubmit}>
                      <div className="card-body">
                        <div className="row">
                          {!location.state && (
                            <div className="col-lg-12 mb-3  fw-bold">
                              Enter SSN, DOB, First Name and Last Name to retrieve employee details.
                            </div>
                          )}
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>
                                Social Security <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="text"
                                name="socSecNum"
                                disabled={location.state}
                                value={formData.socSecNum}
                                onChange={(e) => {
                                  if (/^[0-9]*$/.test(e.target.value)) {
                                    handleChange(e);
                                  }
                                }}
                                placeholder="Enter SSN"
                                maxLength="6"
                                className={errors.socSecNum ? 'is-invalid' : ''}
                              />
                              {errors.socSecNum && (
                                <div className="invalid-feedback">{errors.socSecNum}</div>
                              )}
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label style={{ display: 'block' }}>
                                Date of Birth <span className="text-danger">*</span>
                              </Label>

                              <div className="dateWidth">
                                <DatePicker
                                  disabled={location.state}
                                  selected={
                                    formData.birthDate
                                      ? moment(formData.birthDate, 'YYYY-MM-DD').toDate()
                                      : null
                                  }
                                  onChange={(date) => {
                                    // Calendar selection
                                    setFormData((prev) => ({
                                      ...prev,
                                      birthDate: date ? moment(date).format('YYYY-MM-DD') : '',
                                    }));
                                  }}
                                  onChangeRaw={(e) => {
                                    if (!e || !e.target || e.target.tagName !== 'INPUT') return;

                                    const raw = e.target.value ?? '';
                                    // Only allow numeric characters (0-9), no dashes allowed manually
                                    let input = raw.replace(/[^0-9]/g, ''); // keep only numbers, remove all dashes

                                    // Auto-insert `-` after day (2 digits) and after month (2 digits)
                                    if (input.length > 2)
                                      input = `${input.slice(0, 2)}-${input.slice(2)}`;
                                    if (input.length > 5)
                                      input = `${input.slice(0, 5)}-${input.slice(5)}`;

                                    // Limit length (dd-mm-yyyy => max 10 chars)
                                    e.target.value = input.slice(0, 10);
                                    setFormData((prev) => ({
                                      ...prev,
                                      birthDate: raw,
                                    }));
                                  }}
                                  onBlur={(e) => {
                                    const val = e.target.value.trim();

                                    let parsedDate = null;

                                    // Case 1: Plain 8 digits DDMMYYYY
                                    if (/^\d{8}$/.test(val)) {
                                      const day = val.substring(0, 2);
                                      const month = val.substring(2, 4);
                                      const year = val.substring(4, 8);
                                      const m = moment(
                                        `${day}-${month}-${year}`,
                                        'DD-MM-YYYY',
                                        true,
                                      );
                                      if (m.isValid()) parsedDate = m;
                                    }

                                    // Case 2: Dashes or slashes DD-MM-YYYY / DD/MM/YYYY
                                    if (
                                      !parsedDate &&
                                      moment(val, ['DD-MM-YYYY', 'DD/MM/YYYY'], true).isValid()
                                    ) {
                                      parsedDate = moment(val, ['DD-MM-YYYY', 'DD/MM/YYYY']);
                                    }

                                    // Case 3: Month name DD-MMM-YYYY / DD-MMMM-YYYY
                                    if (
                                      !parsedDate &&
                                      moment(val, ['DD-MMM-YYYY', 'DD-MMMM-YYYY'], true).isValid()
                                    ) {
                                      parsedDate = moment(val, ['DD-MMM-YYYY', 'DD-MMMM-YYYY']);
                                    }

                                    // Update state or clear if invalid
                                    setFormData((prev) => ({
                                      ...prev,
                                      birthDate: parsedDate ? parsedDate.format('YYYY-MM-DD') : '',
                                    }));
                                  }}
                                  dateFormat="dd-MMM-yyyy" // Display format
                                  placeholderText="dd-mmm-yyyy"
                                  isClearable
                                  showMonthDropdown
                                  showYearDropdown
                                  yearDropdownItemNumber={15}
                                  scrollableYearDropdown
                                  dropdownMode="select"
                                  maxDate={
                                    new Date(new Date().setFullYear(new Date().getFullYear() - 10))
                                  }
                                  className={`form-control full-width-datepicker w-100 ${
                                    errors.birthDate ? 'is-invalid' : ''
                                  }`}
                                />
                              </div>

                              {/* {errors.birthDate && (
                                <div className="invalid-feedback">{errors.birthDate}</div>
                              )} */}
                              {errors.birthDate && (
                                <div className="invalid-feedback d-block">{errors.birthDate}</div>
                              )}
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>
                                First Name <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={location.state}
                                placeholder="Enter First Name"
                                maxLength="30"
                                className={errors.firstName ? 'is-invalid' : ''}
                              />
                              {errors.firstName && (
                                <div className="invalid-feedback">{errors.firstName}</div>
                              )}
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>
                                Last Name <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="text"
                                name="lastName"
                                disabled={location.state}
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter Last Name"
                                maxLength="30"
                                className={errors.lastName ? 'is-invalid' : ''}
                              />
                              {errors.lastName && (
                                <div className="invalid-feedback">{errors.lastName}</div>
                              )}
                            </FormGroup>
                          </div>

                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>Middle Name</Label>
                              <Input
                                type="text"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                                maxLength="50"
                                placeholder="Enter Middle Name"
                              />
                            </FormGroup>
                          </div>

                          {!location.state && (
                            <div className="col-md-4 mt-2 col-lg-4 col-xl-4">
                              <Button
                                // type="submit"
                                color="success"
                                className="CustomMarginBtn"
                                disabled={loading}
                                onClick={handleSearch}
                              >
                                {loading ? (
                                  <>
                                    <Spinner size="sm" /> Get Details...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-search pe-1" /> Get Details
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Anjani-start */}
                      <div className=" mb-2"></div>
                      <div className="card-header bg-light py-3 ">
                        <div className="row g-3 align-items-center">
                          <div className="col">
                            <h5 className="header-title mb-0 text-success">
                              <i className="far fa-user text pe-2" /> Profile Details
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>
                                Gender <span className="text-danger">*</span>
                              </Label>
                              <Input
                                // className="form-control"
                                className={
                                  errors.rbmale ? 'is-invalid form-control' : 'form-control'
                                }
                                type="select"
                                name="rbmale"
                                value={
                                  formData.rbmale === null
                                    ? ''
                                    : formData.rbmale === true
                                    ? 'Male'
                                    : 'Female'
                                }
                                onChange={handleChange}
                              >
                                <option>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </Input>
                              {console.log('errors.rbmale', errors.rbmale && errors.rbmale)}
                              {errors.rbmale && (
                                <div className="invalid-feedback">{errors.rbmale}</div>
                              )}
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>Marital Status</Label>
                              <Input
                                type="select"
                                className="form-control"
                                name="maritalStat"
                                value={formData.maritalStat}
                                onChange={handleChange}
                              >
                                <option value="">Select Marital Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                              </Input>
                            </FormGroup>
                          </div>
                          <div className="col-md- col-lg-8 col-xl-8">
                            <div className="row">
                              <div className="col-md-4 col-lg-4 col-xl-4">
                                <FormGroup>
                                  {/* <Label>Working Director? </Label> */}
                                  {/* <Input
                                    type="checkbox"
                                    name="isemployeeDirector"
                                    checked={formData.isemployeeDirector}
                                    onChange={handleChange}
                                    style={{ marginLeft: 10 }}
                                  /> */}

                                  <Label
                                    check
                                    for="isemployeeDirector"
                                    style={{ marginRight: '18px' }}
                                  >
                                    Working Director?
                                  </Label>

                                  {/* <FormGroup check switch inline>
                                    <Input
                                      type="switch"
                                      name="isemployeeDirector"
                                      id="isemployeeDirector"
                                      checked={formData.isemployeeDirector}
                                      onChange={handleChange}
                                      style={{
                                        transform: 'scale(1.5)', 
                                        marginRight: '12px',
                                        position: 'relative',
                                        top: '6px',
                                      }}
                                    />
                                  </FormGroup> */}
                                  <div className="d-flex">
                                    <div className="toggle-container w-50">
                                      <div
                                        className={`toggle-switch ${
                                          formData.isemployeeDirector ? 'on' : ''
                                        }`}
                                      >
                                        <FormGroup check>
                                          <Input
                                            type="checkbox"
                                            className="toggle-input"
                                            id="isemployeeDirector"
                                            name="isemployeeDirector"
                                            checked={formData.isemployeeDirector}
                                            onChange={(e) =>
                                              handleChange({
                                                target: {
                                                  name: 'isemployeeDirector',
                                                  value: e.target.checked,
                                                },
                                              })
                                            }
                                          />

                                          {/* Toggle handle */}
                                          <Label
                                            htmlFor="isemployeeDirector"
                                            className="toggle-handle"
                                          />

                                          {/* Yes/No text */}
                                          <Label
                                            htmlFor="isemployeeDirector"
                                            className="toggle-status"
                                          >
                                            {formData.isemployeeDirector ? 'Yes' : 'No'}
                                          </Label>
                                        </FormGroup>
                                      </div>
                                    </div>

                                    {formData.isemployeeDirector ? (
                                      <button
                                        type="button"
                                        // onClick={() => setisWages(!isWages)}
                                        className="btn btn-success waves-effect waves-light h-45 mb-3 mb-lg-0"
                                      >
                                        <i className="fas fa-plus pe-1" /> Wages
                                      </button>
                                    ) : null}
                                  </div>
                                </FormGroup>
                              </div>
                              {isWages && formData.isemployeeDirector ? (
                                <>
                                  <div className="col-md-4 col-lg-4 col-xl-4">
                                    <FormGroup>
                                      <Label>
                                        Amount <span className="text-danger">*</span>
                                      </Label>
                                      <Input
                                        type="text"
                                        name="amount"
                                        value={formData.wagesAmount}
                                        //onChange={handleChange}
                                        placeholder="Enter Amount"
                                        className={errors.wagesAmount ? 'is-invalid' : ''}
                                        onChange={({ target: { value } }) => {
                                          // Prevent alphabetic characters from being entered
                                          if (/[a-zA-Z]/.test(value)) {
                                            return; // Exit if any alphabetic characters are detected
                                          }

                                          // Remove non-numeric characters except for the decimal
                                          const cleanedValue = value.replace(/[^0-9.]/g, '');

                                          // Insert decimal point after 6 digits if there are more than 6 digits
                                          let formattedValue = cleanedValue;
                                          if (
                                            cleanedValue.length > 6 &&
                                            !cleanedValue.includes('.')
                                          ) {
                                            formattedValue = `${cleanedValue.slice(
                                              0,
                                              6,
                                            )}.${cleanedValue.slice(6, 8)}`; // Insert decimal after 6 digits
                                          }

                                          // Limit to 6 digits before the decimal and 2 digits after
                                          const regex = /^(\d{0,6})(\.\d{0,2})?$/;
                                          if (regex.test(formattedValue)) {
                                            setFormData({
                                              ...formData,
                                              wagesAmount: formattedValue,
                                            });
                                          }
                                        }}
                                      />
                                      {errors.wagesAmount && (
                                        <div className="invalid-feedback">{errors.wagesAmount}</div>
                                      )}
                                    </FormGroup>
                                  </div>
                                  <div className="col-md-4 col-lg-4 col-xl-4">
                                    <FormGroup>
                                      <Label>
                                        Pay Date <span className="text-danger">*</span>
                                      </Label>

                                      <div className="dateWidth">
                                        <DatePicker
                                          // selected={
                                          //   formData.holidayPay_Date
                                          //     ? new Date(formData.holidayPay_Date)
                                          //     : null
                                          // }
                                          selected={
                                            formData.holidayPay_Date
                                              ? moment(
                                                  formData.holidayPay_Date,
                                                  'YYYY-MM-DD',
                                                ).toDate()
                                              : null
                                          }
                                          onChange={(date) =>
                                            setFormData((prev) => ({
                                              ...prev,
                                              holidayPay_Date: date
                                                ? moment(date).format('YYYY-MM-DD')
                                                : '',
                                            }))
                                          }
                                          dateFormat="dd-MMM-yyyy"
                                          minDate={
                                            formData.birthDate ? new Date(formData.birthDate) : null
                                          }
                                          className={`form-control ${
                                            errors.holidayPay_Date ? 'is-invalid' : ''
                                          }`}
                                          placeholderText="dd-mmm-yyyy"
                                          showMonthDropdown
                                          showYearDropdown
                                          yearDropdownItemNumber={15}
                                          scrollableYearDropdown
                                          dropdownMode="select"
                                          customInputRef="input"
                                        />
                                        {errors.holidayPay_Date && (
                                          <div className="invalid-feedback d-block">
                                            {errors.holidayPay_Date}
                                          </div>
                                        )}
                                      </div>
                                    </FormGroup>
                                  </div>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Anjani End */}

                      <div className=" mb-2"></div>
                      <div className="card-header bg-light py-3 ">
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
                            <FormGroup>
                              <Label>
                                Address #1 <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="text"
                                name="address1"
                                value={formData.address1}
                                onChange={handleChange}
                                placeholder="Enter Address #1"
                                maxLength="250"
                                className={errors.address1 ? 'is-invalid' : ''}
                              />
                              {errors.address1 && (
                                <div className="invalid-feedback">{errors.address1}</div>
                              )}
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>Address #2</Label>
                              <Input
                                type="text"
                                name="address2"
                                value={formData.address2}
                                onChange={handleChange}
                                maxLength="250"
                                placeholder="Enter Address #2"
                              />
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>City</Label>
                              <Input
                                type="text"
                                name="city"
                                value={formData.city}
                                maxLength="50"
                                onChange={handleChange}
                                placeholder="Enter City"
                              />
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>Postal Code</Label>
                              <Input
                                type="text"
                                name="zip"
                                value={formData.zip}
                                maxLength="10"
                                onChange={(e) => {
                                  if (/^[a-zA-Z0-9]*$/.test(e.target.value)) {
                                    handleChange(e);
                                  }
                                }}
                                placeholder="Enter Postal Code"
                              />
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>
                                Country
                                {/* <span className="text-danger">*</span> */}
                              </Label>
                              <Input
                                type="select"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className={
                                  errors.country ? 'is-invalid form-control' : 'form-control'
                                }
                              >
                                <option value="">Select Country</option>
                                <option value="1">Saint Kitts</option>
                                <option value="2">Nevis</option>
                              </Input>
                              {errors.country && (
                                <div className="invalid-feedback">{errors.country}</div>
                              )}
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>
                                Email
                                {/* <span className="text-danger">*</span> */}
                              </Label>
                              <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter Email"
                                className={errors.email ? 'is-invalid' : ''}
                              />
                              {errors.email && (
                                <div className="invalid-feedback">{errors.email}</div>
                              )}
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4 font_custom">
                            <FormGroup>
                              <Label>
                                Mobile Number
                                {/* <span className="text-danger">*</span> */}
                              </Label>

                              <PhoneInput
                                defaultCountry="KN"
                                international
                                withCountryCallingCode
                                forceDialCode
                                value={formData.mobile}
                                onChange={handlePhoneChange}
                                className="w-100" // wrapper
                                inputClass={`form-control ${errors.mobile ? 'is-invalid' : ''}`} // input
                                inputProps={{
                                  id: 'mobile',
                                  placeholder: 'Enter mobile number',
                                  maxLength: 20,
                                }}
                              />
                              {errors.mobile && (
                                <div className="invalid-feedback d-block">{errors.mobile}</div>
                              )}
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>
                                Phone Number
                                {/* <span className="text-danger">*</span> */}
                              </Label>
                              {/* <Input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => {
                                  if (/^[^a-zA-Z]*$/.test(e.target.value)) {
                                    handleChange(e);
                                  }
                                }}
                                // onChange={handleChange}
                                maxLength="15"
                                placeholder="Enter Phone Number"
                                className={errors.phoneOrMobile ? 'is-invalid' : ''}
                              /> */}

                              <input
                                type="text"
                                className={
                                  errors.phone ? 'is-invalid form-control' : 'form-control'
                                }
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => {
                                  if (/^[^a-zA-Z]*$/.test(e.target.value)) {
                                    handleChange(e);
                                  }
                                }}
                                maxLength="15"
                              />
                              {errors.phone && (
                                <div className="invalid-feedback">{errors.phone}</div>
                              )}
                            </FormGroup>
                          </div>
                        </div>
                      </div>

                      <div className=" mb-2"></div>
                      <div className="card-header bg-light py-3 ">
                        <div className="row g-3 align-items-center">
                          <div className="col">
                            <h5 className="header-title mb-0 text-success">
                              <i className="far fa-file-alt f-18" /> Other Details
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>Commencement</Label>
                              {/* <Input
                                type="date"
                                name="commencementDate"
                                min={formData.birthDate}
                                value={formData.commencementDate} 
                                onChange={handleChange}
                              /> */}
                              <div className="dateWidth">
                                <DatePicker
                                  // selected={
                                  //   formData.commencementDate
                                  //     ? new Date(formData.commencementDate)
                                  //     : null
                                  // }
                                  selected={
                                    formData.commencementDate
                                      ? moment(formData.commencementDate, 'YYYY-MM-DD').toDate()
                                      : null
                                  }
                                  onChange={(date) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      commencementDate: date
                                        ? moment(date).format('YYYY-MM-DD')
                                        : null,
                                    }))
                                  }
                                  dateFormat="dd-MMM-yyyy" // Display format (e.g., 13-Mar-2025)
                                  minDate={formData.birthDate ? new Date(formData.birthDate) : null} // Enforce min date
                                  className="form-control"
                                  placeholderText="dd-mmm-yyyy"
                                  isClearable
                                  showMonthDropdown // Show the month dropdown
                                  showYearDropdown // Show the year dropdown
                                  yearDropdownItemNumber={15} // Number of years to display in the year dropdown
                                  scrollableYearDropdown // Make the year dropdown scrollable
                                  dropdownMode="select" // To ensure dropdown mode is used
                                  //onKeyDown={(e) => e.preventDefault()} // Disable manual input
                                />
                              </div>
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>Termination </Label>
                              {/* <Input
                                type="date"
                                name="terminated"
                                min={formData.commencementDate}
                                value={formData.terminated}
                                disabled={!formData.commencementDate}
                                onChange={handleChange}
                              /> */}

                              <div className="dateWidth">
                                <DatePicker
                                  // selected={
                                  //   formData.terminated ? new Date(formData.terminated) : null
                                  // }

                                  selected={
                                    formData.terminated
                                      ? moment(formData.terminated, 'YYYY-MM-DD').toDate()
                                      : null
                                  }
                                  onChange={(date) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      terminated: date ? moment(date).format('YYYY-MM-DD') : null,
                                    }))
                                  }
                                  dateFormat="dd-MMM-yyyy" // Display format (e.g., 13-Mar-2025)
                                  isClearable
                                  minDate={
                                    formData.commencementDate
                                      ? new Date(formData.commencementDate)
                                      : null
                                  } // Enforce min date
                                  className="form-control"
                                  placeholderText="dd-mmm-yyyy"
                                  //onKeyDown={(e) => e.preventDefault()} // Disable manual input
                                  disabled={!formData.commencementDate} // Disable if commencementDate
                                  showMonthDropdown // Show the month dropdown
                                  showYearDropdown // Show the year dropdown
                                  yearDropdownItemNumber={15} // Number of years to display in the year dropdown
                                  scrollableYearDropdown // Make the year dropdown scrollable
                                  dropdownMode="select" // To ensure dropdown mode is used
                                />
                              </div>
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>Last Pay Date </Label>
                              {/* <Input
                                type="date"
                                name="lastPayDate"
                                min={formData.commencementDate}
                                value={formData.lastPayDate}
                                disabled={!formData.commencementDate}
                                onChange={handleChange}
                              /> */}
                              <div className="dateWidth">
                                <DatePicker
                                  // selected={
                                  //   formData.lastPayDate ? new Date(formData.lastPayDate) : null
                                  // }

                                  selected={
                                    formData.lastPayDate
                                      ? moment(formData.lastPayDate, 'YYYY-MM-DD').toDate()
                                      : null
                                  }
                                  onChange={(date) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      lastPayDate: date ? moment(date).format('YYYY-MM-DD') : null,
                                    }))
                                  }
                                  dateFormat="dd-MMM-yyyy" // Display format (e.g., 13-Mar-2025)
                                  isClearable
                                  minDate={
                                    formData.commencementDate
                                      ? new Date(formData.commencementDate)
                                      : null
                                  } // Enforce min date
                                  className="form-control"
                                  placeholderText="dd-mmm-yyyy"
                                  //onKeyDown={(e) => e.preventDefault()} // Disable manual input
                                  disabled={!formData.commencementDate} // Disable if commencementDate is not selected
                                  showMonthDropdown // Show the month dropdown
                                  showYearDropdown // Show the year dropdown
                                  yearDropdownItemNumber={15} // Number of years to display in the year dropdown
                                  scrollableYearDropdown // Make the year dropdown scrollable
                                  dropdownMode="select" // To ensure dropdown mode is used
                                />
                              </div>
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>Occupation </Label>
                              <Input
                                type="text"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                maxLength="50"
                                placeholder="Enter Occupation"
                              />
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>
                                Pay Period <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                name="payPeriod"
                                value={formData.payPeriod}
                                onChange={handleChange}
                                className={
                                  errors.payPeriod ? 'is-invalid form-control' : 'form-control'
                                }
                              >
                                <option value="">Select Pay Period</option>
                                <option value="Weekly">W - Weekly</option>
                                <option value="Monthly">M - Monthly</option>
                                <option value="Every Two Weeks">E2W - Every Two Weeks</option>
                                <option value="Twice Monthly">2M - Twice Monthly</option>
                              </Input>
                              {errors.payPeriod && (
                                <div className="invalid-feedback">{errors.payPeriod}</div>
                              )}
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>Is Levy Exempt ? &nbsp;</Label>
                              <Input
                                type="checkbox"
                                name="isLevyExempt"
                                checked={formData.isLevyExempt}
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>
                                Salary <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="text"
                                name="incRate"
                                value={formData.incRate}
                                // onChange={(e) => {
                                //   if (/^\d*\.?\d*$/.test(e.target.value)) {
                                //     handleChange(e);
                                //   }
                                // }}

                                onChange={({ target: { value } }) => {
                                  // Prevent alphabetic characters from being entered
                                  if (/[a-zA-Z]/.test(value)) {
                                    return; // Exit if any alphabetic characters are detected
                                  }

                                  // Remove non-numeric characters except for the decimal
                                  const cleanedValue = value.replace(/[^0-9.]/g, '');

                                  // Insert decimal point after 6 digits if there are more than 6 digits
                                  let formattedValue = cleanedValue;
                                  if (cleanedValue.length > 6 && !cleanedValue.includes('.')) {
                                    formattedValue = `${cleanedValue.slice(
                                      0,
                                      6,
                                    )}.${cleanedValue.slice(6, 8)}`; // Insert decimal after 6 digits
                                  }

                                  // Limit to 6 digits before the decimal and 2 digits after
                                  const regex = /^(\d{0,6})(\.\d{0,2})?$/;
                                  if (regex.test(formattedValue)) {
                                    setFormData({
                                      ...formData,
                                      incRate: formattedValue,
                                    });
                                  }
                                }}
                                maxLength="10"
                                placeholder="Enter Salary"
                                className={errors.incRate ? 'is-invalid' : ''}
                              />
                              {errors.incRate && (
                                <div className="invalid-feedback">{errors.incRate}</div>
                              )}
                            </FormGroup>
                          </div>
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <FormGroup>
                              <Label>Department </Label>
                              <Input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                maxLength="50"
                                placeholder="Enter Department"
                              />
                            </FormGroup>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-md-4 col-lg-4 col-xl-4">
                            <Button
                              type="submit"
                              color="success"
                              className="px-4 me-3"
                              disabled={load}
                            >
                              {load ? (
                                <>
                                  <Spinner size="sm"> Loading...</Spinner> Saving
                                </>
                              ) : (
                                <>
                                  <i className="far fa-save pe-1" /> Save
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              color="light"
                              className="border px-4"
                              onClick={() => navigate(-1)}
                            >
                              <i className="fas fa-times" /> Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
