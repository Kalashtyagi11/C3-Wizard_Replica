import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import * as Icon from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Helmet } from 'react-helmet';

import {
  Input,
  FormGroup,
  Spinner,
  Label,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

import { TextField, MenuItem, InputAdornment } from '@mui/material';
import Logo from '../../assets/images/logo-w.png';
import user from '../../assets/images/users/profile.png';
import user1 from '../../assets/images/users/Company_log.png';
import './register.scss';
import {
  selfRegister,
  companyRegister,
  getAllCategory,
  getAllCountry,
  checkUser,
  checkUserName,
  checkUserNameCompany,
  checkUserCompany,
  checkUserEmail,
} from '../../store/apps/auth/AuthSlice';

import { clearMessage, setMessage } from '../../store/apps/message/MessageSlice';

const DobInput = React.forwardRef((props, ref) => {
  return <TextField {...props} inputRef={ref} fullWidth />;
});

const RegisterUser = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const phoneUtil = PhoneNumberUtil.getInstance();
  const isPhoneValid = (phoneNo) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phoneNo));
    } catch (error) {
      return false;
    }
  };

  const { message, type: messageType } = useSelector((state) => state.messageReducer);
  const { CategoryData, CountryData, userDetails, selfUserDetails } = useSelector(
    (state) => state.authSlice,
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [InputLoading, setInputLoading] = useState(false);
  const [selectedForm, setSelectedForm] = useState('Company');
  const [selectedSelfForm, setSelectedSelfForm] = useState('SelfEmployed');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [defaultCountry, setDefaultCountry] = useState('Saint Kitts');
  const [backendMessage, setBackendMessage] = useState('');
  const [backendMessageName, setBackendMessageName] = useState('');
  const [lastChecked, setLastChecked] = useState('');
  const [lastQueriedRegNumber, setLastQueriedRegNumber] = useState('');

  const [selectedSelfCountry, setSelectedSelfCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [companyImage, setCompanyImage] = useState(null);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [pendingFormType, setPendingFormType] = useState('');
  const [error, setError] = useState({});
  const [errors, setErrors] = useState({});

  const initialFormDataCompany = {
    employmentType: 'Company',
    firstName: '',
    middleName: '',
    lastName: '',
    loginId: '',
    password: '',
    EmailId: '',
    profileImage: null,
    companyName: '',
    dateRegistered: '',
    officeCode: '',
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
    isLevyExempt: false,
    question1: '',
    question2: '',
    answer1: '',
    answer2: '',
    socSecNum: '',
    categoryType: '',
    companyLogo: '',
    maritalStat: '',
    birthDate: null,
    gender: '',
    phone: '',
    tin: '',
    userName: '',
    registrationNo: null,
    confirmPassword: '',
  };

  const [formData, setFormData] = useState(initialFormDataCompany);

  useEffect(() => {
    if (userDetails) {
      setFormData((prev) => ({
        ...prev,
        regNumber: userDetails.regNo || '',
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        address1: userDetails.address1 || '',
        address2: userDetails.address2 || '',
        EmailId: userDetails.email || '',
        phone: userDetails.phoneNo || '',
        mobile: userDetails.mobileNo || '',
        companyName: userDetails.compName || '',
        tradeName: userDetails.tradeName || '',
        contactPerson: userDetails.contactPerson || '',
        city: userDetails.city || '',
        countryName: userDetails.countryName || '',
        zip: userDetails.postalCode || '',
        question1: userDetails.question1 || '',
        question2: userDetails.question2 || '',
        answer1: userDetails.answer1 || '',
        answer2: userDetails.answer2 || '',
        dateRegistered: userDetails.dateRegistered || '',
        officeCode: userDetails.officeCode || '',
      }));
      setLoading(false);
    }

    return () => {
      setFormData(initialFormDataCompany); // ✅ reset on unmount
    };
  }, [userDetails]);

  useEffect(() => {
    setFormData(initialFormDataCompany);
    if (location.state && location.state.registrationType) {
      setSelectedForm(location.state.registrationType);
    }
  }, [location.state]);

  const initialFormData = {
    employmentType: 'SelfEmployed',
    SocSecNum: '',
    EmailId: '',
    FirstName: '',
    LastName: '',
    MiddleName: '',
    BirthDate: '',
    CategoryType: '',
    Mobile: '',
    phone: '',
    profileImage: '',
    IsLevyExempt: false,
    dateRegistered: '',
    officeCode: '',
    Address1: '',
    Address2: '',
    City: '',
    Zip: '',
    Country: '',
    UserName: '',
    Password: '',
    Question1: '',
    Question2: '',
    Answer1: '',
    Answer2: '',
    tin: '',
    confirmPassword: '',
  };

  const [selfFormData, setSelfFormData] = useState(initialFormData);

  const isFormFilledCompany = () => {
    let filledFieldsCount = 0;

    Object.keys(formData).forEach((key, index) => {
      if (index > 5 && formData[key] !== '' && formData[key] !== initialFormDataCompany[key]) {
        filledFieldsCount++;
      }
    });
    return filledFieldsCount > 5;
  };

  const isFormFilled = () => {
    let filledFieldsCount = 0;

    Object.keys(selfFormData).forEach((key, index) => {
      if (index > 5 && selfFormData[key] !== '' && selfFormData[key] !== initialFormData[key]) {
        filledFieldsCount++;
      }
    });

    return filledFieldsCount > 5;
  };

  const goToLogin = (e) => {
    e.preventDefault();
    if (isFormFilled() || isFormFilledCompany()) {
      setIsModalOpen(true);
    } else {
      navigate('/login');
    }
  };

  const confirmLeave = () => {
    setIsModalOpen(false);
    navigate('/login');
  };

  // Cancel navigation
  const cancelLeave = () => {
    setIsModalOpen(false);
  };

  const confirmFormSwitch = () => {
    setSelectedForm(pendingFormType);
    setSelectedImage(null);
    setShowSwitchModal(false);

    // Clear form data based on new employment type
    if (pendingFormType === 'Company') {
      setFormData({
        employmentType: 'Company',
        firstName: '',
        middleName: '',
        lastName: '',
        loginId: '',
        password: '',
        EmailId: '',
        profileImage: null,
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
        isLevyExempt: false,
        question1: '',
        question2: '',
        answer1: '',
        answer2: '',
        socSecNum: '',
        categoryType: '',
        companyLogo: '',
        maritalStat: '',
        birthDate: null,
        gender: '',
        phone: '',
        tin: '',
        userName: '',
        registrationNo: null,
        confirmPassword: '',
        dateRegistered: '',
        officeCode: '',
      });
      setSelfFormData({
        employmentType: 'SelfEmployed',
        SocSecNum: '',
        EmailId: '',
        FirstName: '',
        LastName: '',
        MiddleName: '',
        BirthDate: '',
        CategoryType: '',
        Mobile: '',
        phone: '',
        profileImage: '',
        IsLevyExempt: false,
        Address1: '',
        Address2: '',
        City: '',
        Zip: '',
        Country: '',
        UserName: '',
        Password: '',
        Question1: '',
        Question2: '',
        Answer1: '',
        Answer2: '',
        tin: '',
        confirmPassword: '',
        dateRegistered: '',
        officeCode: '',
      });
    } else if (pendingFormType === 'SelfEmployed') {
      setFormData({
        employmentType: 'Company',
        firstName: '',
        middleName: '',
        lastName: '',
        loginId: '',
        password: '',
        EmailId: '',
        profileImage: null,
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
        isLevyExempt: false,
        question1: '',
        question2: '',
        answer1: '',
        answer2: '',
        socSecNum: '',
        categoryType: '',
        companyLogo: '',
        maritalStat: '',
        birthDate: null,
        gender: '',
        phone: '',
        tin: '',
        userName: '',
        registrationNo: null,
        confirmPassword: '',
        dateRegistered: '',
        officeCode: '',
      });
      setSelfFormData({
        employmentType: 'SelfEmployed',
        SocSecNum: '',
        EmailId: '',
        FirstName: '',
        LastName: '',
        MiddleName: '',
        BirthDate: '',
        CategoryType: '',
        Mobile: '',
        phone: '',
        profileImage: '',
        IsLevyExempt: false,
        Address1: '',
        Address2: '',
        City: '',
        Zip: '',
        Country: '',
        UserName: '',
        Password: '',
        Question1: '',
        Question2: '',
        Answer1: '',
        Answer2: '',
        tin: '',
        confirmPassword: '',
        dateRegistered: '',
        officeCode: '',
      });
    }

    // Clear errors
    setError({});
    setErrors({});
  };

  // Cancel form type switch
  const cancelFormSwitch = () => {
    setShowSwitchModal(false);
    setPendingFormType('');
  };

  useEffect(() => {
    if (selfUserDetails && CategoryData && CategoryData.length > 0) {
      const matchedCategory = CategoryData.find(
        (cat) => cat.categoryDescription === selfUserDetails.dropdownText,
      );

      setSelfFormData((prev) => ({
        ...prev,
        FirstName: selfUserDetails.firstName || '',
        LastName: selfUserDetails.lastName || '',
        Address1: selfUserDetails.address1 || '',
        Address2: selfUserDetails.address2 || '',
        EmailId: selfUserDetails.email || '',
        BirthDate: selfUserDetails.dateOfBirth
          ? moment(selfUserDetails.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD')
          : null,
        CategoryType:
          matchedCategory && matchedCategory.categoryID
            ? matchedCategory.categoryID.toString()
            : '',

        phone: selfUserDetails.phoneNo || '',
        Mobile: selfUserDetails.mobileNo || '',
        companyName: selfUserDetails.compName || '',
        tradeName: selfUserDetails.tradeName || '',
        contactPerson: selfUserDetails.contactPerson || '',
        City: selfUserDetails.city || '',
        countryName: selfUserDetails.countryName || '',
        Zip: selfUserDetails.postalCode || '',
        Question1: selfUserDetails.question1 || '',
        Question2: selfUserDetails.question2 || '',
        Answer1: selfUserDetails.answer1 || '',
        Answer2: selfUserDetails.answer2 || '',
        dateRegistered: selfUserDetails.dateRegistered || '',
        officeCode: selfUserDetails.officeCode || '',
      }));

      setLoading(false);
    }
  }, [selfUserDetails, CategoryData]);

  useEffect(() => {
    setSelfFormData(initialFormData); // 👈 Reset form every time this page is opened
  }, []);

  const validate = () => {
    const formErrors = {};

    if (!formData.firstName) {
      formErrors.firstName = 'First Name is required';
    }

    if (!formData.lastName) {
      formErrors.lastName = 'Last Name is required';
    }

    const email = formData.EmailId.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      formErrors.EmailId = 'Email is required';
    } else if (/\s/.test(email)) {
      formErrors.EmailId = 'Email cannot contain spaces';
    } else if (!emailRegex.test(email)) {
      formErrors.EmailId = 'Invalid email format';
    } else {
      const localPart = email.split('@')[0]; // Get part before '@'
      if (localPart.length < 1 || localPart.length > 64) {
        formErrors.EmailId = 'Email  must be between 1 and 64 characters';
      }
    }

    // Validate Password
    if (!formData.password) {
      formErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.address1) {
      formErrors.address1 = 'Address Line 1 is required';
    }

    if (!formData.regNumber) {
      formErrors.regNumber = 'Registration No is required';
    }
    // Check if registration number is exactly 6 digits
    else if (!/^\d{6}$/.test(formData.regNumber)) {
      formErrors.regNumber = 'Registration No must be exactly 6 digits';
    }

    // Validate Tin
    if (formData.tin && !/^\d{9}$/.test(formData.tin)) {
      formErrors.tin = 'Tin number required';
    }

    // Validate Contact Person
    if (!formData.contactPerson) {
      formErrors.contactPerson = 'Contact Person is required';
    }

    // Validate Employer Name
    if (!formData.companyName) {
      formErrors.companyName = 'Employer Name is required';
    }

    // Validate Login ID
    if (!formData.loginId) {
      formErrors.loginId = 'User Name is required';
    } else if (formData.loginId.length < 3) {
      formErrors.loginId = 'User Name must be at least 3 characters long';
    }

    if (!formData.question1) {
      formErrors.question1 = 'Security question #1 is required';
    }

    if (!formData.question2) {
      formErrors.question2 = 'Security question #2 is required';
    }

    // ✅ Check if both selected questions are the same
    if (formData.question1 && formData.question2 && formData.question1 === formData.question2) {
      formErrors.question2 = 'Security question #2 must be different from question #1';
    }

    if (!formData.answer1) {
      formErrors.answer1 = 'Answer1 is required';
    }

    if (!formData.answer2) {
      formErrors.answer2 = 'Answer2 is required';
    }

    // Password validation
    if (!formData.password) {
      formErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters long';
    } else if (!/[A-Z]/.test(formData.password)) {
      // Check for at least one uppercase letter
      formErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      // Check for at least one lowercase letter
      formErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/\d/.test(formData.password)) {
      // Check for at least one number
      formErrors.password = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      // Check for at least one special character
      formErrors.password = 'Password must contain at least one special character';
    }

    // Confirm Password validation
    if (!formData.ConfirmPassword) {
      formErrors.ConfirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.ConfirmPassword) {
      formErrors.ConfirmPassword = 'Passwords do not match';
    }

    const mobileNumber = formData.mobile ? formData.mobile.replace(/\D/g, '') : '';
    const phoneNumber = formData.phone ? formData.phone.replace(/\D/g, '') : '';

    const countryCode = formData.mobileCountryCode
      ? formData.mobileCountryCode.replace(/\D/g, '')
      : '';

    const mobileDigits = mobileNumber.startsWith(countryCode)
      ? mobileNumber.slice(countryCode.length).length
      : mobileNumber.length;

    const phoneDigits = phoneNumber.length;

    if (formData.mobile) {
      if (mobileDigits < 10) {
        formErrors.mobile = 'Mobile number must be at least 7 digits';
      }
    }

    if (formData.phone) {
      if (phoneDigits < 7) {
        formErrors.phone = 'Phone number must be at least 7 digits';
      }
    }

    return formErrors;
  };

  console.log('error', error);

  const selfEmployeeValidate = () => {
    const selfEmployeeFormErrors = {};

    if (!selfFormData.FirstName) {
      selfEmployeeFormErrors.FirstName = 'First Name is required';
    }

    if (!selfFormData.LastName) {
      selfEmployeeFormErrors.LastName = 'Last Name is required';
    }

    const email = selfFormData.EmailId.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      selfEmployeeFormErrors.EmailId = 'Email is required';
    } else if (/\s/.test(email)) {
      selfEmployeeFormErrors.EmailId = 'Email cannot contain spaces';
    } else if (!emailRegex.test(email)) {
      selfEmployeeFormErrors.EmailId = 'Invalid email format';
    } else {
      const localPart = email.split('@')[0]; // Get part before '@'
      if (localPart.length < 1 || localPart.length > 64) {
        selfEmployeeFormErrors.EmailId = 'Email  must be between 1 and 64 characters';
      }
    }

    // Validate Category Type
    if (!selfFormData.CategoryType) {
      selfEmployeeFormErrors.CategoryType = 'Category type is required';
    }

    // if (!selfFormData.Country) {
    //   selfEmployeeFormErrors.Country = 'Country type is required';
    // }

    if (!selfFormData.Password) {
      selfEmployeeFormErrors.Password = 'Password is required';
    } else if (selfFormData.Password.length < 6) {
      selfEmployeeFormErrors.Password = 'Password must be at least 6 characters long';
    } else if (!/[A-Z]/.test(selfFormData.Password)) {
      // Check for at least one uppercase letter
      selfEmployeeFormErrors.Password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(selfFormData.Password)) {
      // Check for at least one lowercase letter
      selfEmployeeFormErrors.Password = 'Password must contain at least one lowercase letter';
    } else if (!/\d/.test(selfFormData.Password)) {
      // Check for at least one number
      selfEmployeeFormErrors.Password = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(selfFormData.Password)) {
      // Check for at least one special character
      selfEmployeeFormErrors.Password = 'Password must contain at least one special character';
    }

    if (!selfFormData.ConfirmPassword) {
      selfEmployeeFormErrors.ConfirmPassword = 'Confirm password is required';
    } else if (selfFormData.Password !== selfFormData.ConfirmPassword) {
      selfEmployeeFormErrors.ConfirmPassword = 'Passwords do not match';
    }

    // Validate Date of Birth
    if (!selfFormData.BirthDate) {
      selfEmployeeFormErrors.BirthDate = 'Date of Birth is required';
    } else {
      const today = new Date();
      const birthDate = new Date(selfFormData.BirthDate);
      const age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      const day = today.getDate() - birthDate.getDate();

      if (age < 10 || (age === 10 && (month < 0 || (month === 0 && day < 0)))) {
        selfEmployeeFormErrors.BirthDate = 'You must be at least 10 years old';
      }
    }

    const mobileNumber = selfFormData.Mobile ? selfFormData.Mobile.replace(/\D/g, '') : '';
    const phoneNumber = selfFormData.phone ? selfFormData.phone.replace(/\D/g, '') : '';

    // Extract country code if using react-phone-input-2
    const countryCode = selfFormData.mobileCountryCode
      ? selfFormData.mobileCountryCode.replace(/\D/g, '') // Only numeric country code
      : '';

    // Remove country code from mobile number before checking length
    const mobileDigits = mobileNumber.startsWith(countryCode)
      ? mobileNumber.slice(countryCode.length).length // Ignore country code length
      : mobileNumber.length;

    const phoneDigits = phoneNumber.length;

    if (selfFormData.Mobile) {
      if (mobileDigits < 10) {
        selfEmployeeFormErrors.Mobile = 'Mobile number must be at least 7 digits';
      }
    }

    if (selfFormData.phone) {
      if (phoneDigits < 7) {
        selfEmployeeFormErrors.phone = 'Phone number must be at least 7 digits';
      }
    }
    // mobile end

    // Validate Address
    if (!selfFormData.Address1) {
      selfEmployeeFormErrors.Address1 = 'Address Line 1 is required';
    }

    if (selfFormData.tin && !/^\d{1,10}$/.test(selfFormData.tin)) {
      selfEmployeeFormErrors.tin = 'TIN Number must be a maximum of 10 digits';
    }

    // Validate Username
    if (!selfFormData.UserName) {
      selfEmployeeFormErrors.UserName = 'User Name is required';
    } else if (selfFormData.UserName.length < 3) {
      selfEmployeeFormErrors.UserName = 'User Name must be at least 3 characters long';
    }

    // Validate Social Security Number (6 digits)
    if (!selfFormData.SocSecNum) {
      selfEmployeeFormErrors.SocSecNum = 'Social security ID is required';
    }

    // Validate Security Questions
    if (!selfFormData.Question1) {
      selfEmployeeFormErrors.Question1 = 'Security question #1 is required';
    }

    if (!selfFormData.Question2) {
      selfEmployeeFormErrors.Question2 = 'Security question #2 is required';
    }

    // Prevent duplicate security questions
    if (
      selfFormData.Question1 &&
      selfFormData.Question2 &&
      selfFormData.Question1 === selfFormData.Question2
    ) {
      selfEmployeeFormErrors.Question2 = 'Security question #2 must be different from question #1';
    }

    // Validate Security Answers
    if (!selfFormData.Answer1) {
      selfEmployeeFormErrors.Answer1 = 'Answer 1 is required';
    }

    if (!selfFormData.Answer2) {
      selfEmployeeFormErrors.Answer2 = 'Answer 2 is required';
    }

    return selfEmployeeFormErrors;
  };

  console.log('selfFormData', selfFormData);

  const handleFormChange = (event) => {
    const newFormType = event.target.value;

    // Check if user is switching between forms and has filled data
    if (newFormType !== selectedForm && (isFormFilled() || isFormFilledCompany())) {
      setPendingFormType(newFormType);
      setShowSwitchModal(true);
      return;
    }

    // If no data filled or same form type, proceed normally
    setSelectedForm(newFormType);
    setSelectedImage(null); // Clear the selected image

    // Clear form data based on employment type
    if (newFormType === 'Company') {
      setFormData({
        employmentType: 'Company',
        firstName: '',
        middleName: '',
        lastName: '',
        loginId: '',
        password: '',
        EmailId: '',
        profileImage: null,
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
        isLevyExempt: false,
        question1: '',
        question2: '',
        answer1: '',
        answer2: '',
        socSecNum: '',
        categoryType: '',
        companyLogo: '',
        maritalStat: '',
        birthDate: null,
        gender: '',
        phone: '',
        tin: '',
        userName: '',
        registrationNo: null,
        confirmPassword: '',
        dateRegistered: '',
      });
      setSelfFormData({
        employmentType: 'SelfEmployed',
        SocSecNum: '',
        EmailId: '',
        FirstName: '',
        LastName: '',
        MiddleName: '',
        BirthDate: '',
        CategoryType: '',
        Mobile: '',
        phone: '',
        profileImage: '',
        IsLevyExempt: false,
        Address1: '',
        Address2: '',
        City: '',
        Zip: '',
        Country: '',
        UserName: '',
        Password: '',
        Question1: '',
        Question2: '',
        Answer1: '',
        Answer2: '',
        tin: '',
        confirmPassword: '',
        dateRegistered: '',
        officeCode: '',
      });
    }

    if (event.target.value === 'SelfEmployed') {
      setFormData({
        employmentType: 'Company',
        firstName: '',
        middleName: '',
        lastName: '',
        loginId: '',
        password: '',
        EmailId: '',
        profileImage: null,
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
        isLevyExempt: false,
        question1: '',
        question2: '',
        answer1: '',
        answer2: '',
        socSecNum: '',
        categoryType: '',
        companyLogo: '',
        maritalStat: '',
        birthDate: null,
        gender: '',
        phone: '',
        tin: '',
        userName: '',
        registrationNo: null,
        confirmPassword: '',
        dateRegistered: '',
        officeCode: '',
      });
      setSelfFormData({
        employmentType: 'SelfEmployed',
        SocSecNum: '',
        EmailId: '',
        FirstName: '',
        LastName: '',
        MiddleName: '',
        BirthDate: '',
        CategoryType: '',
        Mobile: '',
        phone: '',
        profileImage: '',
        IsLevyExempt: false,
        Address1: '',
        Address2: '',
        City: '',
        Zip: '',
        Country: '',
        UserName: '',
        Password: '',
        Question1: '',
        Question2: '',
        Answer1: '',
        Answer2: '',
        tin: '',
        confirmPassword: '',
        dateRegistered: '',
        officeCode: '',
      });
    }
  };

  const handleChange = (event) => {
    setSelectedSelfForm(event.target.value);
    setSelfFormData((prev) => ({
      ...prev,
      employmentType: event.target.value,
    }));
  };

  const handleCountryChange = (event) => {
    setDefaultCountry(event.target.value);
    setFormData((prev) => ({
      ...prev,
      country: event.target.value,
    }));

    setSelfFormData((prev) => ({
      ...prev,
      country: event.target.value,
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      mobile: value,
    }));

    setSelfFormData((prevState) => ({
      ...prevState,
      Mobile: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      Mobile: value ? '' : prevErrors.Mobile, // Remove Mobile error if there's a value
      phoneOrMobile: value || selfFormData.phone ? '' : prevErrors.phoneOrMobile, // Remove combined error if either field is filled
    }));

    setError((prevErrors) => ({
      ...prevErrors,
      mobile: value ? '' : prevErrors.mobile, // Remove Mobile error if there's a value
      phoneOrMobile: value || formData.phone ? '' : prevErrors.phoneOrMobile, // Remove combined error if either field is filled
    }));
  };

  const handleBlurA = async () => {
    const { SocSecNum, EmailId } = selfFormData;

    if (EmailId.trim() !== '') {
      // 1. Check if SocSecNum is empty
      if (SocSecNum.trim() === '') {
        setErrors((prev) => ({
          ...prev,
          SocSecNum: 'Social security ID is required',
        }));
        return;
      }

      // 2. Check if SocSecNum is not exactly 6 digits
      if (!/^\d{6}$/.test(SocSecNum.trim())) {
        setErrors((prev) => ({
          ...prev,
          SocSecNum: 'Social security ID must be exactly 6 digits',
        }));
        return;
      }

      // ✅ Clear previous error if validation passed
      setErrors((prev) => ({
        ...prev,
        SocSecNum: '',
      }));

      // Proceed with API call
      setInputLoading(true);
      try {
        const response = await dispatch(checkUser({ SocSecNum, EmailId })).unwrap();

        if (!response.status) {
          console.log(response.message);
        } else {
          console.log('User validation successful.');
        }
      } catch (err) {
        console.log('An error occurred while checking registration.');
        setSelfFormData(initialFormData);
      } finally {
        setInputLoading(false);
      }
    }
  };

  const handleSelfInputChange = (e) => {
    const { id, name, value, type, checked, files } = e.target;

    // Create a new errors object
    const selfEmployeeFormErrors = {};

    setSelfFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: name === 'SocSecNum' ? value.replace(/\D/g, '').slice(0, 6) : value,
      };

      // Perform validation
      // validateFields(updatedData);

      return updatedData;
    });

    // Reset profileImage error if image is uploaded
    if (selfFormData.profileImage) {
      selfEmployeeFormErrors.profileImage = '';
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      Mobile: value ? '' : prevErrors.Mobile, // Remove Mobile error if there's a value
      phoneOrMobile: value || selfFormData.phone ? '' : prevErrors.phoneOrMobile, // Remove combined error if either field is filled
    }));

    if (type === 'file' && files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        console.log('Base64 Image:', reader.result);

        setSelectedImage(reader.result);

        setSelfFormData((prevData) => ({
          ...prevData,
          profileImage: reader.result,
        }));

        setErrors((prevErrors) => ({
          ...prevErrors,
          profileImage: '', // Ensure no error is shown for the image
        }));
      };

      reader.readAsDataURL(file);
    } else {
      setSelfFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleBlur = (date) => {
    const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 10));

    if (date && date > maxDate) {
      // If the selected date is greater than the maxDate, set it to maxDate
      date = maxDate;
    }

    setSelfFormData((prev) => ({
      ...prev,
      BirthDate: date ? moment(date).format('YYYY-MM-DD') : '',
    }));
  };

  // const handleKeyUpCompany = (regNumber) => {
  //

  //   // const regNumber = event.target.value;

  //   if (regNumber.length === 6) {
  //     setLoading(true);
  //     try {
  //       const response = dispatch(checkUserCompany({ SocSecNum: regNumber })).unwrap();
  //       if (!response.status) {
  //         // setBackendMessage(response.message); // Show backend message to user
  //       } else {
  //         // setBackendMessage(''); // Clear error if success
  //       }
  //     } catch (errorss) {
  //       // setBackendMessage('An error occurred while checking registration.'); // Handle API errors
  //     }
  //     finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  // const handleKeyUpCompany = async (regNumber) => {
  //   if (regNumber.length === 6 && regNumber !== lastQueriedRegNumber) {
  //     setInputLoading(true);
  //     setLastQueriedRegNumber(regNumber); // mark this as already queried

  //     try {
  //       const response = await dispatch(checkUserCompany({ SocSecNum: regNumber })).unwrap();
  //       if (!response.status) {
  //         // handle error message
  //       } else {
  //         // clear error message
  //       }
  //     } catch (errorrr) {
  //       // handle API error
  //     } finally {
  //       setInputLoading(false);
  //     }
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    const formErrors = {};
    //for regNumber validation start
    const formErrors1 = { ...error };

    if (name === 'regNumber') {
      const numericValue = value.replace(/\D/g, '');

      if (numericValue.length > 6) return;

      if (numericValue.length < 6) {
        formErrors1.regNumber = 'Registration number must be exactly 6 digits';
      }
      // else {
      //   formErrors1.regNumber = '';
      //   handleKeyUpCompany(numericValue);
      // }

      // setFormData((prevData) => ({
      //   ...prevData,
      //   [name]: numericValue,
      // }));

      setFormData((prevData) => ({
        ...prevData,
        [name]: numericValue,
        country: prevData.country ? prevData.country.toString() : '',
      }));

      setError(formErrors1);
      return;
    }

    if (type === 'file' && files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        console.log(`Base64 ${name}:`, reader.result);

        if (name === 'companyLogo') {
          setCompanyImage(reader.result);
        } else if (name === 'profileImage') {
          setSelectedImage(reader.result);
        }

        setFormData((prevData) => ({
          ...prevData,
          [name]: reader.result, // Dynamically set the correct image field
          country: prevData.country ? prevData.country.toString() : '',
        }));

        setError((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));

        setError((prevErrors) => ({
          ...prevErrors,
          mobile: value ? '' : prevErrors.mobile, // Remove Mobile error if there's a value
          phoneOrMobile: value || formData.phone ? '' : prevErrors.phoneOrMobile, // Remove combined error if either field is filled
        }));
      };

      reader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
        country: name === 'country' ? value.toString() : prevData.country,
      }));

      setError((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));

      setError((prevErrors) => ({
        ...prevErrors,
        mobile: value ? '' : prevErrors.mobile, // Remove Mobile error if there's a value
        phoneOrMobile: value || formData.phone ? '' : prevErrors.phoneOrMobile, // Remove combined error if either field is filled
      }));
    }
  };

  const handleInputChangeForLogo = (e) => {
    console.log('hITTT');
    const { files } = e.target;

    if (files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        console.log('Base64 Logo:', reader.result);

        setCompanyImage(reader.result);

        setFormData((prevData) => ({
          ...prevData,
          companyLogo: reader.result, // Store company logo
        }));

        // localStorage.setItem('companyLogo', reader.result);
        setError((prevErrors) => ({
          ...prevErrors,
          companyLogo: '',
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);

      try {
        const formDataToSend = { ...formData };

        if (selectedImage) {
          formDataToSend.profileImage = formData.profileImage;
        }

        // Send JSON instead of FormData
        const res = await dispatch(companyRegister({ formData: formDataToSend })).unwrap();
        console.log('Company registered successfully:', res);

        if (formData.tradeName) {
          localStorage.setItem('TradeName', formData.tradeName);
        }
        if (formData.firstName) {
          localStorage.setItem('Name', formData.firstName);
        }

        if (formData.address1) {
          localStorage.setItem('Address', formData.address1);
        }
        if (formData.regNumber) {
          localStorage.setItem('regNumber', formData.regNumber);
        }

        if (formData.loginId) {
          localStorage.setItem('UserName', formData.loginId);
        }

        // navigate('/login');
        if (res && res.data === 'Existing User') {
          // navigate('/Verification');
          navigate('/Verification', { state: { userName: formData.loginId } });
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.log('Error occurred during registration:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setError(formErrors);
      console.log('Form contains errors:', formErrors);
    }
  };

  const handleSelfSubmit = async (e) => {
    e.preventDefault();
    const selfEmployeeFormErrors = selfEmployeeValidate();

    if (Object.keys(selfEmployeeFormErrors).length === 0) {
      setLoading(true);

      try {
        // Create an object instead of FormData
        const formDataToSend = {
          ...selfFormData,
          CategoryType: selfFormData.CategoryType.toString(),
          Country: selfFormData.Country.toString(),
        };

        // Ensure the image is in Base64 format
        if (selectedImage) {
          formDataToSend.profileImage = selfFormData.profileImage;
        }

        // Send JSON instead of FormData
        const res = await dispatch(selfRegister({ selfFormData: formDataToSend })).unwrap();
        console.log('Company registered successfully:', res);

        // navigate('/login');
        if (selfFormData.SocSecNum) {
          localStorage.setItem('SocSecNum', selfFormData.SocSecNum);
        }

        if (selfFormData.UserName) {
          localStorage.setItem('UserName', selfFormData.UserName);
        }

        // navigate('/login');
        if (res && res.data === 'Existing User') {
          navigate('/Verification', { state: { userName: selfFormData.UserName } });
        } else {
          navigate('/login');
        }
      } catch (err) {
        if (err && err.response && err.response.status === 500) {
          toast.error(
            'Server error! Please try again later. Please contact the Social Security department.',
          );
        }
        console.error('Error occurred during registration:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(selfEmployeeFormErrors);
      console.log('Form contains errors:', selfEmployeeFormErrors);
    }
  };

  useEffect(() => {
    dispatch(getAllCategory());
    dispatch(getAllCountry());
  }, []);

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

  const handleKeyUpName = async (event) => {
    const userName = event.target.value.trim();

    if (userName.length > 0 && userName !== lastChecked) {
      // Avoid re-checking the same value
      setLastChecked(userName);
      if (userName.length >= 3) {
        try {
          const response = await dispatch(checkUserName({ UserName: userName })).unwrap();

          if (!response.status) {
            // setBackendMessage(response.message);
          } else {
            setBackendMessage('');
          }
        } catch (errorsss) {
          setBackendMessage('An error occurred while checking registration.');
        }
      }
    }
  };

  const handleKeyUpNameCompany = async (event) => {
    const loginId = event.target.value.trim();

    if (loginId.length > 0 && loginId !== lastChecked) {
      // Avoid re-checking the same value
      setLastChecked(loginId);
      if (loginId.length >= 3) {
        try {
          const response = await dispatch(checkUserNameCompany({ UserName: loginId })).unwrap();

          if (!response.status) {
            // setBackendMessage(response.message);
          } else {
            setBackendMessage('');
          }
        } catch (errorsss) {
          setBackendMessage('An error occurred while checking registration.');
        }
      }
    }
  };

  const handleBlurEmail = async () => {
    const { EmailId, regNumber } = formData;
    const trimmedEmail = EmailId ? EmailId.trim() : '';
    const trimmedRegNo = regNumber ? regNumber.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let hasError = false;

    // Validate regNumber
    if (!trimmedRegNo || trimmedRegNo.length < 6) {
      setError((prev) => ({
        ...prev,
        regNumber: !trimmedRegNo
          ? 'Registration No is required'
          : 'Registration number must be 6 digits',
      }));
      hasError = true;
    } else {
      setError((prev) => ({ ...prev, regNumber: '' }));
    }

    // Validate EmailId
    if (!trimmedEmail) {
      setError((prev) => ({
        ...prev,
        EmailId: 'Email is required',
      }));
      hasError = true;
    } else if (!emailRegex.test(trimmedEmail)) {
      setError((prev) => ({
        ...prev,
        EmailId: 'Enter a valid email address',
      }));
      hasError = true;
    } else {
      setError((prev) => ({ ...prev, EmailId: '' }));
    }

    // ✅ Completely block API call if any error
    if (hasError) return;

    // ✅ Safe API call with validated fields
    setLastChecked(trimmedEmail);
    setInputLoading(true);

    try {
      const response = await dispatch(
        checkUserCompany({ EmailId: trimmedEmail, regNo: trimmedRegNo }),
      ).unwrap();

      if (!response.status) {
        setBackendMessage(response.message || 'Invalid email.');
      } else {
        setBackendMessage('');
      }
    } catch (err) {
      setBackendMessage('An error occurred while checking registration.');
      setFormData(initialFormDataCompany);
    } finally {
      setInputLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSelfSubmit();
      handleSubmit();
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - C3Wizard</title>
      </Helmet>
      <div className="home-center">
        <div className="home-desc-center">
          <div className="container">
            <div className="home-btn1 mt-4">
              <div className="row">
                <div className="col-md-11 col-lg-11 col-xl-11 mx-auto">
                  <div className="card">
                    <div className="card-body px-0">
                      <div className="px-0 py-3">
                        <div className="text-center">
                          <a href="index.html">
                            <img src={Logo} height={122} alt="logo" />
                          </a>
                          <h2 className="text_success mb-2 mt-4 f-500">Register your Account</h2>
                        </div>
                        <div className="row">
                          <div className="col-md-12 col-lg-12 col-xl-12">
                            <div className="px-4">
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  value="Company"
                                  checked={selectedForm === 'Company'}
                                  onChange={handleFormChange}
                                  id="inlineCheckbox1"
                                />

                                <Label
                                  className="form-check-Label add_design_custom"
                                  htmlFor="inlineCheckbox1"
                                >
                                  Employer
                                </Label>
                              </div>
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  id="inlineCheckbox2"
                                  type="radio"
                                  value="SelfEmployed"
                                  checked={selectedForm === 'SelfEmployed'}
                                  onChange={handleFormChange}
                                />
                                <Label
                                  className="form-check-Label add_design_custom"
                                  htmlFor="inlineCheckbox2"
                                >
                                  Self Employed
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Company Registration Form Start  */}
                        {selectedForm === 'Company' && (
                          <div>
                            <div className="card-header bg-light py-3 mb-2 mt-3">
                              <div className="row g-3 align-items-center">
                                <div className="col">
                                  <h5 className="header-title mb-0 text_success">
                                    {' '}
                                    Organization Basic Details{' '}
                                  </h5>
                                </div>
                              </div>
                            </div>
                            <form id="multi-step-form">
                              <div className="px-4 mt-3">
                                <div className="row  d-flex align-items-center">
                                  <div className="col-lg-3 mb-3">
                                    <div className="row">
                                      <div className="col-lg-12 mb-3">
                                        <div className="image-upload-container text-center">
                                          <label
                                            htmlFor="company-logo-upload"
                                            className="custom-file-input-label"
                                          >
                                            {companyImage ? (
                                              <img
                                                src={companyImage}
                                                alt="Selected"
                                                className="image-preview"
                                              />
                                            ) : (
                                              <img
                                                src={user1}
                                                alt="Default"
                                                className="image-preview1"
                                                width="70"
                                                height="70"
                                              />
                                            )}
                                            <div>
                                              <span className="user_change">
                                                {companyImage
                                                  ? 'Uploaded Company Logo'
                                                  : 'Upload Company Logo'}
                                              </span>
                                            </div>
                                          </label>
                                          <input
                                            id="company-logo-upload"
                                            type="file"
                                            name="companyLogo"
                                            accept="image/*"
                                            onChange={handleInputChange}
                                            style={{ display: 'none' }}
                                            onKeyDown={handleKeyDown}
                                          />
                                          {error.companyLogo && (
                                            <div className="text-danger">{error.companyLogo}</div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-9 mb-3">
                                    <div className="row">
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control anjani"
                                            id="regNumber"
                                            name="regNumber"
                                            maxLength="6"
                                            onBlur={handleBlurEmail}
                                            label={
                                              <>
                                                Registration No{' '}
                                                <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleInputChange}
                                            value={formData.regNumber}
                                          />
                                          {error.regNumber && (
                                            <div className="text-danger">{error.regNumber}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="EmailId"
                                            name="EmailId"
                                            label={
                                              <>
                                                Email <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleInputChange}
                                            value={formData.EmailId}
                                            onBlur={handleBlurEmail} // 👈 trigger API on blur
                                            InputProps={{
                                              endAdornment: (
                                                <InputAdornment position="end">
                                                  <div
                                                    style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      gap: '6px',
                                                    }}
                                                  >
                                                    {InputLoading && (
                                                      <Spinner size="sm" color="primary" />
                                                    )}
                                                    <Icon.Search
                                                      size={20}
                                                      style={{ cursor: 'pointer' }}
                                                    />
                                                  </div>
                                                </InputAdornment>
                                              ),
                                            }}
                                          />
                                          {error.EmailId && (
                                            <div className="text-danger">{error.EmailId}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="tradeName"
                                            name="tradeName"
                                            maxLength="40"
                                            label="Trade Name"
                                            onChange={handleInputChange}
                                            value={formData.tradeName}
                                            onKeyDown={handleKeyDown}
                                          />
                                          {error.tradeName && (
                                            <div className="text-danger">{error.tradeName}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="contactPerson"
                                            name="contactPerson"
                                            maxLength="40"
                                            label={
                                              <>
                                                Contact Person{' '}
                                                <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleInputChange}
                                            value={formData.contactPerson}
                                            onKeyDown={handleKeyDown}
                                          />
                                          {error.contactPerson && (
                                            <div className="text-danger">{error.contactPerson}</div>
                                          )}
                                        </div>
                                      </div>
                                      <Label for="Either Enter The Mobile Number OR Phone Number">
                                        Either Enter The Mobile Number OR Phone Number{' '}
                                        <span className="text-danger">*</span>
                                      </Label>
                                      <div className="col-md-6 col-lg-6 col-xl-6 mobile_class">
                                        <div className="mb-3">
                                          <PhoneInput
                                            value={formData.mobile}
                                            onChange={handlePhoneChange}
                                            defaultCountry="kn"
                                            onCountryChange={handleCountryChange}
                                            placeholder="Enter your phone number"
                                            style={{
                                              height: '48px',
                                              width: '100%',
                                              fontFamily: 'Roboto, sans-serif',
                                            }}
                                            onKeyDown={handleKeyDown}
                                          />
                                          {error.mobile && (
                                            <div
                                              className="text-danger"
                                              style={{ marginTop: '10px' }}
                                            >
                                              {error.mobile}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="phone"
                                            name="phone"
                                            maxLength="40"
                                            label="Phone Number"
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            value={formData.phone}
                                          />
                                          {error.phone && (
                                            <div className="text-danger">{error.phone}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="companyName"
                                            name="companyName"
                                            maxLength="40"
                                            label={
                                              <>
                                                Name of Company{' '}
                                                <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleInputChange}
                                            value={formData.companyName}
                                            onKeyDown={handleKeyDown}
                                          />
                                          {error.companyName && (
                                            <div className="text-danger">{error.companyName}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6 d-none">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="dateRegistered"
                                            name="dateRegistered"
                                            maxLength="40"
                                            label={
                                              <>
                                                Register Date{' '}
                                                {/* <span style={{ color: 'red' }}>*</span> */}
                                              </>
                                            }
                                            disabled
                                            // onChange={handleInputChange}
                                            value={formData.dateRegistered}
                                            onKeyDown={handleKeyDown}
                                          />
                                          {/* {error.companyName && (
                                            <div className="text-danger">{error.companyName}</div>
                                          )} */}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="d-flex align-items-center justify-content-between">
                                          <div>
                                            <div className="custom-control custom-checkbox">
                                              <input
                                                className="form-check-input mt-1"
                                                type="checkbox"
                                                id="isLevyExempt"
                                                name="isLevyExempt"
                                                checked={formData.isLevyExempt}
                                                onChange={handleInputChange}
                                                onKeyDown={handleKeyDown}
                                              />
                                              <Label
                                                className="custom-control-Label c-pointer"
                                                htmlFor="isLevyExempt"
                                              >
                                                &nbsp;<span> Is Levy Exempt?</span>
                                              </Label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="card-header bg-light py-3 mb-2 mt-3">
                                <div className="row g-3 align-items-center">
                                  <div className="col">
                                    <h5 className="header-title mb-0 text_success">
                                      Address Details
                                    </h5>
                                  </div>
                                </div>
                              </div>
                              <div className="px-4">
                                <div className="row mt-4">
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        className="form-control"
                                        id="address1"
                                        label={
                                          <>
                                            Address #1 <span style={{ color: 'red' }}>*</span>
                                          </>
                                        }
                                        maxLength="250"
                                        onChange={handleInputChange}
                                        value={formData.address1}
                                        onKeyDown={handleKeyDown}
                                        name="address1"
                                      />
                                      {error.address1 && (
                                        <div className="text-danger">{error.address1}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        name="address2"
                                        className="form-control"
                                        maxLength="250"
                                        id="address2"
                                        label="Address #2"
                                        onChange={handleInputChange}
                                        value={formData.address2}
                                        onKeyDown={handleKeyDown}
                                      />
                                      {error.address2 && (
                                        <div className="text-danger">{error.address2}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        name="city"
                                        className="form-control"
                                        id="city"
                                        maxLength="50"
                                        label="City"
                                        onChange={handleInputChange}
                                        value={formData.city}
                                        onKeyDown={handleKeyDown}
                                      />
                                      {error.city && (
                                        <div className="text-danger">{error.city}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        name="zip"
                                        className="form-control"
                                        id="zip"
                                        label="Postal Code"
                                        onChange={handleInputChange}
                                        value={formData.zip}
                                        onKeyDown={handleKeyDown}
                                      />
                                      {error.zip && <div className="text-danger">{error.zip}</div>}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        select
                                        fullWidth
                                        label={<>Country</>}
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        variant="outlined"
                                        id="country"
                                        name="country"
                                      >
                                        {CountryData &&
                                          CountryData.map((country, index) => (
                                            <MenuItem key={index} value={country.conId}>
                                              {country.name}
                                            </MenuItem>
                                          ))}
                                      </TextField>
                                      {error.country && (
                                        <div className="text-danger">{error.country}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="card-header bg-light py-3 mb-2 mt-3">
                                <div className="row g-3 align-items-center">
                                  <div className="col">
                                    <h5 className="header-title mb-0 text_success">
                                      {' '}
                                      User Profile Details
                                    </h5>
                                  </div>
                                </div>
                              </div>
                              <div className="px-4 mt-3">
                                {/* Step 3 form fields here */}
                                <div className="row  d-flex align-items-center">
                                  <div className="col-lg-3 mb-3">
                                    <div className="row">
                                      <div className="col-lg-12 mb-3">
                                        <div className="image-upload-container text-center">
                                          <label
                                            htmlFor="profile-image-upload"
                                            className="custom-file-input-label"
                                          >
                                            {selectedImage ? (
                                              <img
                                                src={selectedImage}
                                                alt="Selected"
                                                className="image-preview"
                                              />
                                            ) : (
                                              <img
                                                src={user}
                                                alt="Default"
                                                className="image-preview"
                                                width="70"
                                                height="70"
                                              />
                                            )}
                                            <div>
                                              <span className="user_change">
                                                {selectedImage
                                                  ? 'Uploaded Profile Image'
                                                  : 'Upload Profile Image'}
                                              </span>
                                            </div>
                                          </label>
                                          <input
                                            id="profile-image-upload"
                                            type="file"
                                            name="profileImage"
                                            accept="image/*"
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            style={{ display: 'none' }}
                                          />
                                          {error.profileImage && (
                                            <div className="text-danger">{error.profileImage}</div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-lg-9 mb-3">
                                    <div className="row mt-4">
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            name="firstName"
                                            maxLength="50"
                                            label={
                                              <>
                                                First Name <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            value={formData.firstName}
                                          />
                                          {error.firstName && (
                                            <div className="text-danger">{error.firstName}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="middleName"
                                            name="middleName"
                                            maxLength="50"
                                            label="Middle Name"
                                            onChange={handleInputChange}
                                            value={formData.middleName}
                                            onKeyDown={handleKeyDown}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            name="lastName"
                                            maxLength="50"
                                            label={
                                              <>
                                                Last Name <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            value={formData.lastName}
                                          />
                                          {error.lastName && (
                                            <div className="text-danger">{error.lastName}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="loginId"
                                            name="loginId"
                                            label={
                                              <>
                                                User Name <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleInputChange}
                                            value={formData.loginId}
                                            onKeyUp={handleKeyUpNameCompany}
                                            onKeyDown={handleKeyDown}
                                            onPaste={(e) => {
                                              setTimeout(() => handleInputChange(e), 0); // Ensures value updates before validation runs
                                            }}
                                          />
                                          {error.loginId && (
                                            <div className="text-danger">{error.loginId}</div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="col-md-6 col-lg-6 col-xl-6 eye">
                                        <div className="mb-3">
                                          <TextField
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            label={
                                              <>
                                                Password <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            value={formData.password}
                                          />
                                          <button
                                            type="button"
                                            className="showPassword"
                                            onClick={() => setShowPassword(!showPassword)}
                                          >
                                            {showPassword ? (
                                              <i className="fas fa-eye-slash" />
                                            ) : (
                                              <i className="fas fa-eye" />
                                            )}
                                          </button>
                                          {error.password && (
                                            <div className="text-danger">{error.password}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6 eye">
                                        <div className="mb-3">
                                          <TextField
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="ConfirmPassword"
                                            className="form-control"
                                            id="ConfirmPassword"
                                            label={
                                              <>
                                                Confirm Password{' '}
                                                <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            value={formData.ConfirmPassword}
                                          />
                                          <button
                                            type="button"
                                            className="showPassword"
                                            onClick={() =>
                                              setShowConfirmPassword(!showConfirmPassword)
                                            }
                                          >
                                            {showConfirmPassword ? (
                                              <i className="fas fa-eye-slash" />
                                            ) : (
                                              <i className="fas fa-eye" />
                                            )}
                                          </button>
                                          {error.ConfirmPassword && (
                                            <div className="text-danger">
                                              {error.ConfirmPassword}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            select
                                            fullWidth
                                            label={
                                              <>
                                                Security Question #1
                                                <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            id="question2"
                                            name="question1"
                                            value={formData.question1}
                                            onKeyDown={handleKeyDown}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                          >
                                            <MenuItem value="">Select a question</MenuItem>
                                            <MenuItem value="What Is Your Birth Place">
                                              What Is Your Birth Place
                                            </MenuItem>
                                            <MenuItem value="What Is Your Favorite Place">
                                              What Is Your Favorite Place
                                            </MenuItem>
                                            <MenuItem value="What Is Your Childhood Name">
                                              What Is Your Childhood Name
                                            </MenuItem>
                                            <MenuItem value="What Is Your First School">
                                              What Is Your First School
                                            </MenuItem>
                                            <MenuItem value="What Is Your Favorite Dish">
                                              What Is Your Favorite Dish
                                            </MenuItem>
                                            <MenuItem value="What Is Your Favorite Snacks">
                                              What Is Your Favorite Snacks
                                            </MenuItem>
                                          </TextField>
                                          {error.question1 && (
                                            <div className="text-danger">{error.question1}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="answer1"
                                            name="answer1"
                                            maxLength="250"
                                            label={
                                              <>
                                                Answer #1 <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            value={formData.answer1}
                                          />
                                          {error.answer1 && (
                                            <div className="text-danger">{error.answer1}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            select
                                            fullWidth
                                            label={
                                              <>
                                                Security Question #2
                                                <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            id="question2"
                                            name="question2"
                                            value={formData.question2}
                                            onKeyDown={handleKeyDown}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                          >
                                            <MenuItem value="">Select a question</MenuItem>
                                            <MenuItem value="What Is Your Birth Place">
                                              What Is Your Birth Place
                                            </MenuItem>
                                            <MenuItem value="What Is Your Favorite Place">
                                              What Is Your Favorite Place
                                            </MenuItem>
                                            <MenuItem value="What Is Your Childhood Name">
                                              What Is Your Childhood Name
                                            </MenuItem>
                                            <MenuItem value="What Is Your First School">
                                              What Is Your First School
                                            </MenuItem>
                                            <MenuItem value="What Is Your Favorite Dish">
                                              What Is Your Favorite Dish
                                            </MenuItem>
                                            <MenuItem value="What Is Your Favorite Snacks">
                                              What Is Your Favorite Snacks
                                            </MenuItem>
                                          </TextField>
                                          {error.question2 && (
                                            <div className="text-danger">{error.question2}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="answer2"
                                            name="answer2"
                                            maxLength="250"
                                            label={
                                              <>
                                                Answer #2 <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            value={formData.answer2}
                                          />
                                          {error.answer2 && (
                                            <div className="text-danger">{error.answer1}</div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12 col-lg-12 col-xl-12 text-end">
                                  <Button
                                    type="button"
                                    disabled={loading}
                                    className="btn btn-light mt-3"
                                    onClick={goToLogin}
                                  >
                                    <Icon.ArrowLeft size={24} color="currentColor" /> &nbsp;Back To
                                    Login
                                  </Button>
                                  <Button
                                    disabled={loading}
                                    type="submit"
                                    onClick={handleSubmit}
                                    onKeyDown={handleKeyDown}
                                    className="btn btn-success mt-3"
                                  >
                                    {loading ? (
                                      <>
                                        <Spinner size="sm" /> &nbsp;Register...
                                      </>
                                    ) : (
                                      <>
                                        {' '}
                                        <Icon.UserPlus size={24} color="currentColor" /> &nbsp;
                                        Register
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* Company Registration Form End  */}

                        {/* Self Employee Form Started  */}
                        {selectedForm === 'SelfEmployed' && (
                          <div>
                            <div className="card-header bg-light py-3 mb-2 mt-3">
                              <div className="row g-3 align-items-center">
                                <div className="col">
                                  <h5 className="header-title mb-0 text_success">
                                    {' '}
                                    Self Employed Basic Details
                                  </h5>
                                </div>
                              </div>
                            </div>
                            <form id="multi-step-form">
                              <div className="px-4">
                                <div className="row">
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        className="form-control"
                                        id="SocSecNum"
                                        name="SocSecNum"
                                        label={
                                          <>
                                            Social Security Number{' '}
                                            <span style={{ color: 'red' }}>*</span>
                                          </>
                                        }
                                        onChange={handleSelfInputChange}
                                        onKeyDown={handleKeyDown}
                                        onBlur={handleBlurA}
                                        value={selfFormData.SocSecNum}
                                        maxLength="6"
                                        max="999999"
                                        onInput={(e) => {
                                          e.target.value = e.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 6);
                                        }}
                                        // InputProps={{
                                        //   endAdornment: (
                                        //     <InputAdornment position="end">
                                        //       <div
                                        //         style={{
                                        //           display: 'flex',
                                        //           alignItems: 'center',
                                        //           gap: '6px',
                                        //         }}
                                        //       >
                                        //         {InputLoading && (
                                        //           <Spinner size="sm" color="primary" />
                                        //         )}
                                        //         <Icon.Search
                                        //           size={20}
                                        //           style={{ cursor: 'pointer' }}
                                        //         />
                                        //       </div>
                                        //     </InputAdornment>
                                        //   ),
                                        // }}
                                      />

                                      {errors.SocSecNum && (
                                        <div className="text-danger">{errors.SocSecNum}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        className="form-control"
                                        id="EmailId"
                                        name="EmailId"
                                        label={
                                          <>
                                            Email <span style={{ color: 'red' }}>*</span>
                                          </>
                                        }
                                        onChange={handleSelfInputChange}
                                        onKeyDown={handleKeyDown}
                                        // onKeyUp={handleKeyUp}
                                        onBlur={handleBlurA}
                                        value={selfFormData.EmailId}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: '6px',
                                                }}
                                              >
                                                {InputLoading && (
                                                  <Spinner size="sm" color="primary" />
                                                )}
                                                <Icon.Search
                                                  size={20}
                                                  style={{ cursor: 'pointer' }}
                                                />
                                              </div>
                                            </InputAdornment>
                                          ),
                                        }}
                                      />

                                      {errors.EmailId && (
                                        <div className="text-danger">{errors.EmailId}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        className="form-control"
                                        id="FirstName"
                                        name="FirstName"
                                        label={
                                          <>
                                            First Name <span style={{ color: 'red' }}>*</span>
                                          </>
                                        }
                                        onChange={handleSelfInputChange}
                                        onKeyDown={handleKeyDown}
                                        value={selfFormData.FirstName}
                                      />
                                      {errors.FirstName && (
                                        <div className="text-danger">{errors.FirstName}</div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        className="form-control"
                                        id="LastName"
                                        name="LastName"
                                        label={
                                          <>
                                            Last Name <span style={{ color: 'red' }}>*</span>
                                          </>
                                        }
                                        onChange={handleSelfInputChange}
                                        onKeyDown={handleKeyDown}
                                        value={selfFormData.LastName}
                                      />

                                      {errors.LastName && (
                                        <div className="text-danger">{errors.LastName}</div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <DatePicker
                                        selected={
                                          selfFormData.BirthDate
                                            ? moment(selfFormData.BirthDate, 'YYYY-MM-DD').toDate()
                                            : null
                                        }
                                        onChange={(date) => {
                                          setSelfFormData((prev) => ({
                                            ...prev,
                                            BirthDate: date
                                              ? moment(date).format('YYYY-MM-DD')
                                              : null,
                                          }));
                                          setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            BirthDate: '',
                                          }));
                                        }}
                                        onChangeRaw={(e) => {
                                          if (!e || !e.target || e.target.tagName !== 'INPUT')
                                            return;

                                          const raw = e.target.value || '';

                                          // Check the type of operation
                                          const isDeleteOperation =
                                            e.nativeEvent &&
                                            (e.nativeEvent.inputType === 'deleteContentBackward' ||
                                              e.nativeEvent.inputType === 'deleteContentForward');

                                          const isReplaceOperation =
                                            e.nativeEvent &&
                                            (e.nativeEvent.inputType === 'insertText' ||
                                              e.nativeEvent.inputType === 'insertCompositionText');

                                          let input = raw;

                                          // For delete operations, preserve the input as-is
                                          if (isDeleteOperation) {
                                            // Don't auto-format during deletion
                                            return;
                                          }

                                          // For replace operations or normal typing
                                          if (isReplaceOperation || !e.nativeEvent) {
                                            // Format the input as the user types
                                            input = String(raw).replace(/\D/g, ''); // remove non-numeric

                                            // Add formatting dashes as the user types
                                            if (input.length > 2)
                                              input = `${input.slice(0, 2)}-${input.slice(2)}`;
                                            if (input.length > 5)
                                              input = `${input.slice(0, 5)}-${input.slice(5)}`;

                                            // Limit to 10 characters max (dd-mm-yyyy)
                                            input = input.slice(0, 10);

                                            // Update the input field
                                            e.target.value = input;
                                          }

                                          // Try to parse the date for validation
                                          const cleanInput = input.replace(/\D/g, '');
                                          if (cleanInput.length === 8) {
                                            const day = cleanInput.slice(0, 2);
                                            const month = cleanInput.slice(2, 4);
                                            const year = cleanInput.slice(4, 8);

                                            // Validate date components
                                            const dayNum = parseInt(day, 10);
                                            const monthNum = parseInt(month, 10);
                                            const yearNum = parseInt(year, 10);

                                            const isValidDay = dayNum >= 1 && dayNum <= 31;
                                            const isValidMonth = monthNum >= 1 && monthNum <= 12;
                                            const isValidYear =
                                              yearNum >= 1900 &&
                                              yearNum <= new Date().getFullYear();

                                            if (isValidDay && isValidMonth && isValidYear) {
                                              const formattedDate = `${day}-${month}-${year}`;
                                              const parsed = moment(
                                                formattedDate,
                                                ['DD-MM-YYYY'],
                                                true,
                                              );

                                              if (parsed.isValid()) {
                                                setSelfFormData((prev) => ({
                                                  ...prev,
                                                  BirthDate: parsed.format('YYYY-MM-DD'),
                                                }));
                                                setErrors((prevErrors) => ({
                                                  ...prevErrors,
                                                  BirthDate: '',
                                                }));
                                              }
                                            } else {
                                              // Clear invalid date
                                              setSelfFormData((prev) => ({
                                                ...prev,
                                                BirthDate: '',
                                              }));
                                              setErrors((prevErrors) => ({
                                                ...prevErrors,
                                                BirthDate: 'Please enter a valid date',
                                              }));
                                            }
                                          } else if (cleanInput.length > 8) {
                                            // Clear if too many digits
                                            setSelfFormData((prev) => ({
                                              ...prev,
                                              BirthDate: '',
                                            }));
                                            setErrors((prevErrors) => ({
                                              ...prevErrors,
                                              BirthDate: 'Please enter a valid date',
                                            }));
                                          }
                                        }}
                                        dateFormat="dd-MMM-yyyy" // display format like 12-Dec-2014
                                        customInput={
                                          <DobInput
                                            label={
                                              <>
                                                Date of Birth{' '}
                                                <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            placeholder="dd-mm-yyyy"
                                          />
                                        }
                                        maxDate={
                                          new Date(
                                            new Date().setFullYear(new Date().getFullYear() - 10),
                                          )
                                        }
                                        showMonthDropdown
                                        showYearDropdown
                                        yearDropdownItemNumber={15}
                                        scrollableYearDropdown
                                        dropdownMode="select"
                                        className="form-control"
                                        placeholderText="dd-mm-yyyy"
                                        style={{ display: 'block', width: '100%' }}
                                        isClearable
                                      />

                                      {errors.BirthDate && (
                                        <div className="text-danger">{errors.BirthDate}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        select
                                        fullWidth
                                        name="CategoryType"
                                        id="CategoryType"
                                        label={
                                          <>
                                            Wage Category <span style={{ color: 'red' }}>*</span>
                                          </>
                                        }
                                        value={selfFormData.CategoryType} // Set the value dynamically
                                        onChange={handleSelfInputChange}
                                        onKeyDown={handleKeyDown}
                                        variant="outlined"
                                      >
                                        <option value="">Select Wage Category</option>
                                        {CategoryData &&
                                          CategoryData.map((category, index) => (
                                            // <option key={index} value={index}>
                                            <MenuItem key={index} value={category.categoryID}>
                                              {category.categoryDescription}
                                            </MenuItem>
                                          ))}
                                      </TextField>
                                      {errors.CategoryType && (
                                        <div className="text-danger">{errors.CategoryType}</div>
                                      )}
                                    </div>
                                  </div>
                                  <Label for="Either Enter The Mobile Number OR Phone Number">
                                    Either Enter The Mobile Number OR Phone Number{' '}
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <div className="col-md-6 col-lg-6 mobile_class col-xl-6">
                                    <div className="mb-3">
                                      <PhoneInput
                                        value={selfFormData.Mobile}
                                        onChange={handlePhoneChange}
                                        onKeyDown={handleKeyDown}
                                        defaultCountry="kn"
                                        onCountryChange={handleCountryChange}
                                        placeholder="Enter your phone number"
                                        style={{
                                          height: '56px',
                                          width: '100%',
                                          fontFamily: 'Roboto, sans-serif',
                                        }} // Applying width and height to the outer container
                                      />
                                      {errors.Mobile && (
                                        <div className="text-danger " style={{ marginTop: '10px' }}>
                                          {errors.Mobile}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        label="Phone Number"
                                        onChange={handleSelfInputChange}
                                        onKeyDown={handleKeyDown}
                                        value={selfFormData.phone}
                                      />
                                      {errors.phone && (
                                        <div className="text-danger">{errors.phone}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        className="form-control"
                                        id="tin"
                                        name="tin"
                                        label="Tin Number"
                                        onChange={handleSelfInputChange}
                                        onKeyDown={handleKeyDown}
                                        value={selfFormData.tin}
                                      />
                                      {errors.tin && (
                                        <div className="text-danger">{errors.tin}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-xl-6 d-none">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        className="form-control"
                                        id="dateRegistered"
                                        name="dateRegistered"
                                        label="Register Date"
                                        // onChange={handleSelfInputChange}
                                        disabled
                                        onKeyDown={handleKeyDown}
                                        value={selfFormData.dateRegistered}
                                      />
                                      {/* {errors.tin && (
                                        <div className="text-danger">{errors.tin}</div>
                                      )} */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="card-header bg-light py-3 mb-2 mt-3">
                                <div className="row g-3 align-items-center">
                                  <div className="col">
                                    <h5 className="header-title mb-0 text_success">
                                      {' '}
                                      Address Details{' '}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                              <div className="px-4">
                                <div className="row mt-4">
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        className="form-control"
                                        id="Address1"
                                        name="Address1"
                                        label={
                                          <>
                                            Address1 <span style={{ color: 'red' }}>*</span>
                                          </>
                                        }
                                        onChange={handleSelfInputChange}
                                        onKeyDown={handleKeyDown}
                                        value={selfFormData.Address1}
                                      />
                                      {errors.Address1 && (
                                        <div className="text-danger">{errors.Address1}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        className="form-control"
                                        id="Address2"
                                        name="Address2"
                                        label="Address #2"
                                        onChange={handleSelfInputChange}
                                        onKeyDown={handleKeyDown}
                                        value={selfFormData.Address2}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        className="form-control"
                                        id="City"
                                        name="City"
                                        label="City"
                                        onChange={handleSelfInputChange}
                                        onKeyDown={handleKeyDown}
                                        value={selfFormData.City}
                                      />
                                      {errors.City && (
                                        <div className="text-danger">{errors.City}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        type="text"
                                        className="form-control"
                                        id="Zip"
                                        name="Zip"
                                        label="Postal Code"
                                        onChange={handleSelfInputChange}
                                        onKeyDown={handleKeyDown}
                                        value={selfFormData.Zip}
                                      />
                                      {errors.Zip && (
                                        <div className="text-danger">{errors.Zip}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="mb-3">
                                      <TextField
                                        select
                                        fullWidth
                                        value={selfFormData.Country}
                                        onChange={handleSelfInputChange}
                                        id="Country"
                                        name="Country"
                                        variant="outlined"
                                        label={<>Country</>}
                                      >
                                        {/* <option value="">Select Country</option> */}
                                        {CountryData &&
                                          CountryData.map((country, index) => (
                                            <MenuItem key={index} value={country.conId}>
                                              {country.name}
                                            </MenuItem>
                                          ))}
                                      </TextField>

                                      {errors.Country && (
                                        <div className="text-danger">{errors.Country}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="card-header bg-light py-3 mb-2 mt-3">
                                <div className="row g-3 align-items-center">
                                  <div className="col">
                                    <h5 className="header-title mb-0 text_success">
                                      {' '}
                                      User Profile Details{' '}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                              <div className="px-4">
                                <div className="row  d-flex align-items-center">
                                  <div className="col-lg-3 mb-3 text-center">
                                    <div className="image-upload-container">
                                      <label
                                        htmlFor="image-upload"
                                        className="custom-file-input-label"
                                      >
                                        {selectedImage ? (
                                          <img
                                            src={selectedImage}
                                            alt="Selected"
                                            className="image-preview"
                                          />
                                        ) : (
                                          <img
                                            src={user}
                                            alt="Default"
                                            className="image-preview"
                                            width="70"
                                            height="70"
                                          />
                                        )}
                                        <div>
                                          <span className="user_change">
                                            {selectedImage
                                              ? 'Uploaded Profile Picture'
                                              : 'Upload Profile Picture'}
                                          </span>
                                        </div>
                                      </label>
                                      <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleSelfInputChange}
                                        onKeyDown={handleKeyDown}
                                        style={{ display: 'none' }}
                                      />
                                      {errors.profileImage && (
                                        <div className="text-danger">{errors.profileImage}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-lg-9">
                                    <div className="row mt-4">
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="UserName"
                                            name="UserName"
                                            label={
                                              <>
                                                User Name <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleSelfInputChange}
                                            onKeyDown={handleKeyDown}
                                            value={selfFormData.UserName}
                                            onKeyUp={handleKeyUpName}
                                          />
                                          {errors.UserName && (
                                            <div className="text-danger">{errors.UserName}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6"></div>

                                      <div className="col-md-6 col-lg-6 col-xl-6 eye">
                                        <div className="mb-3">
                                          <TextField
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            id="Password"
                                            name="Password"
                                            label={
                                              <>
                                                Password <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleSelfInputChange}
                                            onKeyDown={handleKeyDown}
                                            value={selfFormData.Password}
                                          />
                                          <button
                                            type="button"
                                            className="showPassword"
                                            onClick={() => setShowPassword(!showPassword)}
                                          >
                                            {showPassword ? (
                                              <i className="fas fa-eye-slash" />
                                            ) : (
                                              <i className="fas fa-eye" />
                                            )}
                                          </button>
                                          {errors.Password && (
                                            <div className="text-danger">{errors.Password}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6 eye">
                                        <div className="mb-3">
                                          <TextField
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="ConfirmPassword"
                                            className="form-control"
                                            id="ConfirmPassword"
                                            label={
                                              <>
                                                Confirm Password{' '}
                                                <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleSelfInputChange}
                                            onKeyDown={handleKeyDown}
                                            value={formData.ConfirmPassword}
                                          />
                                          <button
                                            type="button"
                                            className="showPassword"
                                            onClick={() =>
                                              setShowConfirmPassword(!showConfirmPassword)
                                            }
                                          >
                                            {showConfirmPassword ? (
                                              <i className="fas fa-eye-slash" />
                                            ) : (
                                              <i className="fas fa-eye" />
                                            )}
                                          </button>
                                          {errors.ConfirmPassword && (
                                            <div className="text-danger">
                                              {errors.ConfirmPassword}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            select
                                            fullWidth
                                            id="Question1"
                                            className="form-control"
                                            name="Question1"
                                            label={
                                              <>
                                                Security Question #1
                                                <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            value={selfFormData.Question1}
                                            onKeyDown={handleKeyDown}
                                            onChange={handleSelfInputChange}
                                            variant="outlined"
                                          >
                                            <MenuItem value="">Select a question</MenuItem>
                                            <MenuItem value="What Is Your Birth Place">
                                              What Is Your Birth Place
                                            </MenuItem>
                                            <MenuItem value="What Is Your Favorite Place">
                                              What Is Your Favorite Place
                                            </MenuItem>
                                            <MenuItem value="What Is Your Childhood Name">
                                              What Is Your Childhood Name
                                            </MenuItem>
                                            <MenuItem value="What Is Your First School">
                                              What Is Your First School
                                            </MenuItem>
                                            <MenuItem value="What Is Your Favorite Dish">
                                              What Is Your Favorite Dish
                                            </MenuItem>
                                            <MenuItem value="What Is Your Favorite Snacks">
                                              What Is Your Favorite Snacks
                                            </MenuItem>
                                          </TextField>
                                          {errors.Question1 && (
                                            <div className="text-danger">{errors.Question1}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="Answer1"
                                            name="Answer1"
                                            label={
                                              <>
                                                Answer #1 <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleSelfInputChange}
                                            onKeyDown={handleKeyDown}
                                            value={selfFormData.Answer1}
                                          />
                                          {errors.Answer1 && (
                                            <div className="text-danger">{errors.Answer1}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            select
                                            fullWidth
                                            id="Question2"
                                            name="Question2"
                                            label={
                                              <>
                                                Security Question #2{' '}
                                                <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            value={selfFormData.Question2}
                                            onChange={handleSelfInputChange}
                                            variant="outlined"
                                          >
                                            <MenuItem value="">Select a question</MenuItem>
                                            <MenuItem value="What Is Your Birth Place">
                                              What Is Your Birth Place
                                            </MenuItem>
                                            <MenuItem value="What Is Your Favorite Place">
                                              What Is Your Favorite Place
                                            </MenuItem>
                                            <MenuItem value="What Is Your Childhood Name">
                                              What Is Your Childhood Name
                                            </MenuItem>
                                            <MenuItem value="What Is Your First School">
                                              What Is Your First School
                                            </MenuItem>
                                            <MenuItem value="What Is Your Favorite Dish">
                                              What Is Your Favorite Dish
                                            </MenuItem>
                                            <MenuItem value="What Is Your Favorite Snacks">
                                              What Is Your Favorite Snacks
                                            </MenuItem>
                                          </TextField>
                                          {errors.Question2 && (
                                            <div className="text-danger">{errors.Question2}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-6 col-lg-6 col-xl-6">
                                        <div className="mb-3">
                                          <TextField
                                            type="text"
                                            className="form-control"
                                            id="Answer2"
                                            name="Answer2"
                                            label={
                                              <>
                                                Answer #2 <span style={{ color: 'red' }}>*</span>
                                              </>
                                            }
                                            onChange={handleSelfInputChange}
                                            onKeyDown={handleKeyDown}
                                            value={selfFormData.Answer2}
                                          />
                                          {errors.Answer2 && (
                                            <div className="text-danger">{errors.Answer2}</div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-12 col-lg-12 col-xl-12 text-end">
                                  <Button
                                    type="button"
                                    disabled={loading}
                                    className="btn btn-light mt-3"
                                    onClick={goToLogin}
                                  >
                                    <Icon.ArrowLeft size={24} color="currentColor" /> &nbsp;Back To
                                    Login
                                  </Button>
                                  <Button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-success mt-3"
                                    onClick={handleSelfSubmit}
                                  >
                                    {loading ? (
                                      <>
                                        <Spinner size="sm" />
                                        &nbsp; Register
                                      </>
                                    ) : (
                                      <>
                                        <Icon.UserPlus size={24} color="currentColor" /> &nbsp;
                                        Register
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Confirmation Modal */}
      <Modal isOpen={isModalOpen} toggle={cancelLeave}>
        <ModalHeader toggle={cancelLeave}>Confirm Navigation</ModalHeader>
        <ModalBody>
          Are you sure you want to leave this page? All unsaved information will be lost.
        </ModalBody>
        <ModalFooter>
          <Button className="btn-light" color="secondary" onClick={cancelLeave}>
            No
          </Button>
          <Button color="primary" onClick={confirmLeave}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>

      {/* Form Type Switch Confirmation Modal */}
      <Modal isOpen={showSwitchModal} toggle={cancelFormSwitch}>
        <ModalHeader toggle={cancelFormSwitch}>Confirm Form Type Change</ModalHeader>
        <ModalBody>
          <p className="mb-3">
            Are you sure you want to switch from <strong>{selectedForm}</strong> to{' '}
            <strong>{pendingFormType}</strong>?
          </p>
          <p className="text-warning">
            <i className="fas fa-exclamation-triangle me-2"></i>
            All current form data will be lost.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button className="btn-light" color="secondary" onClick={cancelFormSwitch}>
            Cancel
          </Button>
          <Button color="primary" onClick={confirmFormSwitch}>
            Yes, Switch
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default RegisterUser;
