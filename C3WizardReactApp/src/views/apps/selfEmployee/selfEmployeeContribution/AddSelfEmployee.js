import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, Link } from 'react-router-dom';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import { debounce } from 'lodash';
import moment from 'moment';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Label,
  Input,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  createSelfContribution,
  saveSelfContribution,
  updateOnChange,
  getSelfEmployee,
  isCreatedCThree,
  exportCreatedCThree,
  ExportCThree,
  resetSelfEmployeeState,
} from '../../../../store/apps/selfEmployee/selfEmployeeContribution/SelfEmployeeContributionSlice';
import {
  getDashboardList,
  previewNWData,
} from '../../../../store/apps/selfEmployee/dashboard/SelfDashboardSlice';
import { clearMessage, setMessage } from '../../../../store/apps/message/MessageSlice';
import draftImage from '../../../../assets/images/users/draft.jpg';
import ReportLogo from '../../../../assets/images/users/Reportlogo.jpg';

const AddSelfEmployee = () => {
  const userId = localStorage.getItem('userID');
  const userName = localStorage.getItem('userId');
  const userPassword = localStorage.getItem('userPassword');
  const UserName = localStorage.getItem('userName');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpens, setIsModalOpens] = useState(false);
  const [isModalOpenCThree, setIsModalOpenCThree] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [exportCThreeItems, setExportCThreeItems] = useState(null);
  const toggleModal1 = () => setIsModalOpen(!isModalOpens);
  const toggleModalECThree = () => setIsModalOpenCThree(!isModalOpenCThree);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const CompanyId = parseInt(localStorage.getItem('companyId'), 10) || 0;
  const [createdNewItems, setCreatedNewItems] = useState(null);
  const companyId = localStorage.getItem('companyId');
  const UserId = localStorage.getItem('userID');
  const { SelfEmployeeData, SelfContributionList } = useSelector(
    (state) => state.selfEmployeeContributionSlice || {},
  );
  const { DashboardData, previewNWDataList } = useSelector((state) => state.selfDashboardSlice);
  const { message, type } = useSelector((state) => state.messageReducer);
  const [Year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadingss, setLoadingss] = useState(true);
  const handleYearChange = (e) => setYear(Number(e.target.value));
  const handleMonthChange = (e) => setMonth(Number(e.target.value));
  const [dropNo, setDropNo] = useState(0);
  const [selectData, setSelectedData] = useState({});
  const [modalData, setModalData] = useState({ year: '', month: '' });
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [response, setResponse] = useState('');
  const handleClose2 = () => setShow2(false);
  const handleClose3 = () => setShow3(false);
  const [selfContributionData, setSelfContributionData] = useState(null);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles.find(
    (role) => role.description === 'SELF EMPLOYEE CONTRIBUTION',
  );
  const canViewSElfEmployee = employerPermission?.viewPermission;
  const [selectedDate, setSelectedDate] = useState(null);
  const previousMonthDate = new Date();
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  //   setMonth(date?.getMonth());
  //   // setMonth(date?.getMonth() + 1);
  //   setYear(date?.getFullYear());
  // };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Get month as string '01' to '12' using Intl
    const monthString = new Intl.DateTimeFormat('en', {
      month: '2-digit',
    }).format(date);

    const monthNumber = parseInt(monthString, 10); // '01' -> 1

    setMonth(monthNumber);
    setYear(date.getFullYear());

    console.log('Selected Month Index:', monthNumber); // 1 to 12
    console.log('Selected Year:', date.getFullYear());
  };

  useEffect(() => {
    if (canViewSElfEmployee === false) {
      navigate('/login');
    }
  }, [canViewSElfEmployee, navigate]);

  useEffect(() => {
    console.log('SelfContributionList', SelfContributionList);
  });

  useEffect(() => {
    const storedData = localStorage.getItem('selfContributionData');
    if (storedData) {
      setSelfContributionData(JSON.parse(storedData));
    }
  }, []);

  const [isCreated, setIsCreated] = useState(false);

  const [isTableDisabled, setIsTableDisabled] = useState(false);

  const formattedBirthDate =
    selfContributionData?.obj_list?.length > 0 && selfContributionData?.obj_list[0]?.birthDate
      ? moment(selfContributionData?.obj_list[0]?.birthDate).format('DD-MMM-YYYY')
      : 'N/A';

  const handleShow2 = (headerId) => {
    // Dispatch API request with the correct headerId
    dispatch(previewNWData({ headerId: response, year: Year, monthNo: month }));

    if (response) {
      console.log('Opening Modal 2 with headerId:', response);
      setShow2(true); // Open Modal 2 if headerId exists
    }

    // Check if selfContributionData exists, then open Modal 3
    else if (selfContributionData) {
      console.log('Using Stored Data:', selfContributionData);
      setShow3(true); // Open Modal 3
    }
  };

  const printRef = useRef();

  // const { toPDF, targetRef } = usePDF({
  //   filename: 'SocialSecurityReport.pdf',
  //   page: { margin: Margin.SMALL, orientation: 'landscape' },
  // });

  const { toPDF, targetRef } = usePDF({
    filename: 'SocialSecurityReport.pdf',
    page: {
      format: 'letter', // 8.5 x 11 inches
      orientation: 'portrait',
      margin: 8, // small margin in points (default is ~40)
    },
  });

  const handlePrint = () => {
    const printContent = targetRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
    <style>
      @page {
        size: letter portrait;
        margin: 10mm;
      }
    </style>
    ${printContent}
  `;

    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload page
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  useEffect(() => {
    if (message) {
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      }
      dispatch(setMessage({ message: '', type: '' }));
    }
  }, [message, type, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const [onChangeData, setOnChangeData] = useState({
    indexListNo: 0,
    dropNo: 0,
    year: '0',
    month: 0,
    ssNofEmp: '',
    userName: '',
    textTotalWages: '',
    address: '',
    textTotalWagesNLevy: '',
    textLevyPenalty: '',
    wcontribution: 150,
    wincome: 1500,
    textTotalAccountantGeneral: '',
    obj_list: [
      {
        contid: 0,
        c3HEADERID: 0,
        ssn: 'string',
        ssnd: 'string',
        employeeId: 0,
        employeeName: 'string',
        period_Month: 'string',
        period_year: 'string',
        payFreq: 'string',
        isSelectedWEEK1: 'string',
        isSelectedWEEK2: 'string',
        isSelectedWEEK3: 'string',
        isSelectedWEEK4: 'string',
        isSelectedWEEK5: 'string',
        empSalary: 0,
        wage_Amt: 0,
        wageS1: 0,
        wageS2: 0,
        wageS3: 0,
        wageS4: 0,
        wageS5: 0,
        tempWAGES1: 0,
        tempWAGES2: 0,
        tempWAGES3: 0,
        tempWAGES4: 0,
        tempWAGES5: 0,
        hpay: 0,
        otherPAY: 0,
        directorWagesPAY: 0,
        isHPAY: 'string',
        bonus: 0,
        totalWadeges: 0,
        weeK1: true,
        weeK2: true,
        weeK3: true,
        weeK4: true,
        weeK5: true,
        selectedTypeWEEK1: 0,
        selectedTypeWEEK2: 0,
        selectedTypeWEEK3: 0,
        selectedTypeWEEK4: 0,
        selectedTypeWEEK5: 0,
        isWeekfifth: true,
        emp_add_remove: true,
        isRemarkDisable: true,
        isemployeeDirector: true,
        isLevyExempt: true,
        levyee: 0,
        socialSecurity: 0,
        sS_Fines: 0,
        sS_Employee: 0,
        sS_Employer: 0,
        levy_Penalty: 0,
        servayance: 0,
        servayancE_PENALTY: 0,
        date_Joining: 'string',
        date_terminated: 'string',
        birthDate: 'string',
        t_C_Date: 'string',
        remarks: '',
        dirRemarks: 'string',
        department: 'string',
        payPeriod: 'string',
        hPay_Week1: 0,
        hPay_Week2: 0,
        hPay_Week3: 0,
        hPay_Week4: 0,
        hPay_Week5: 0,
      },
    ],
  });

  const [data, setData] = useState({
    month: 0,
    year: 0,
    h_Id: 0,
    ssNofEmp: 0,
    userName: 'string',
    textLevyPenalty: 'string',
    UserId: 0,
    obj_list: [
      {
        contid: 0,
        c3HEADERID: 0,
        ssn: 'string',
        snd: 'string',
        employeeId: 0,
        employeeName: 'string',
        period_Month: 'string',
        period_year: 'string',
        payFreq: 'string',
        isSelectedWEEK1: 'string',
        isSelectedWEEK2: 'string',
        isSelectedWEEK3: 'string',
        isSelectedWEEK4: 'string',
        isSelectedWEEK5: 'string',
        empSalary: 0,
        wage_Amt: 0,
        wageS1: 0,
        wageS2: 0,
        wageS3: 0,
        wageS4: 0,
        wageS5: 0,
        tempWAGES1: 0,
        tempWAGES2: 0,
        tempWAGES3: 0,
        tempWAGES4: 0,
        tempWAGES5: 0,
        hpay: 0,
        otherPAY: 0,
        directorWagesPAY: 0,
        isHPAY: 'string',
        bonus: 0,
        totalWadeges: 0,
        weeK1: true,
        weeK2: true,
        weeK3: true,
        weeK4: true,
        weeK5: true,
        selectedTypeWEEK1: 0,
        selectedTypeWEEK2: 0,
        selectedTypeWEEK3: 0,
        selectedTypeWEEK4: 0,
        selectedTypeWEEK5: 0,
        isWeekfifth: true,
        emp_add_remove: true,
        isRemarkDisable: true,
        isemployeeDirector: true,
        isLevyExempt: true,
        levyee: 0,
        socialSecurity: 0,
        sS_Fines: 0,
        sS_Employee: 0,
        sS_Employer: 0,
        levy_Penalty: 0,
        servayance: 0,
        servayancE_PENALTY: 0,
        date_Joining: 'string',
        date_terminated: 'string',
        birthDate: 'string',
        t_C_Date: 'string',
        remarks: 'anjani',
        dirRemarks: 'anjani',
        department: 'string',
        payPeriod: 'string',
        hPay_Week1: 0,
        hPay_Week2: 0,
        hPay_Week3: 0,
        hPay_Week4: 0,
        hPay_Week5: 0,
      },
    ],
  });

  const [NewData, setNewData] = useState({
    indexListNo: 0,
    dropNo: 0,
    year: '0',
    month: 0,
    ssNofEmp: '',
    userName: '',
    textTotalWages: '',
    textTotalWagesNLevy: '',
    textLevyPenalty: '',
    wcontribution: 150,
    wincome: 1500,
    textTotalAccountantGeneral: '',
    obj_list: [
      {
        contid: 0,
        c3HEADERID: 0,
        ssn: 'string',
        ssnd: 'string',
        employeeId: 0,
        employeeName: 'string',
        period_Month: 'string',
        period_year: 'string',
        payFreq: 'string',
        isSelectedWEEK1: 'string',
        isSelectedWEEK2: 'string',
        isSelectedWEEK3: 'string',
        isSelectedWEEK4: 'string',
        isSelectedWEEK5: 'string',
        empSalary: 0,
        wage_Amt: 0,
        wageS1: 0,
        wageS2: 0,
        wageS3: 0,
        wageS4: 0,
        wageS5: 0,
        tempWAGES1: 0,
        tempWAGES2: 0,
        tempWAGES3: 0,
        tempWAGES4: 0,
        tempWAGES5: 0,
        hpay: 0,
        otherPAY: 0,
        directorWagesPAY: 0,
        isHPAY: 'string',
        bonus: 0,
        totalWadeges: 0,
        weeK1: true,
        weeK2: true,
        weeK3: true,
        weeK4: true,
        weeK5: true,
        selectedTypeWEEK1: 0,
        selectedTypeWEEK2: 0,
        selectedTypeWEEK3: 0,
        selectedTypeWEEK4: 0,
        selectedTypeWEEK5: 0,
        isWeekfifth: true,
        emp_add_remove: true,
        isRemarkDisable: true,
        isemployeeDirector: true,
        isLevyExempt: true,
        levyee: 0,
        socialSecurity: 0,
        sS_Fines: 0,
        sS_Employee: 0,
        sS_Employer: 0,
        levy_Penalty: 0,
        servayance: 0,
        servayancE_PENALTY: 0,
        date_Joining: 'string',
        date_terminated: 'string',
        birthDate: 'string',
        t_C_Date: 'string',
        remarks: '',
        dirRemarks: 'string',
        department: 'string',
        payPeriod: 'string',
        hPay_Week1: 0,
        hPay_Week2: 0,
        hPay_Week3: 0,
        hPay_Week4: 0,
        hPay_Week5: 0,
      },
    ],
  });

  const handleSubmit = () => {
    if (!selectedDate) {
      toast.error('Please select  month and year.');
      return;
    }
    setLoading(true);
    const formData = {
      Year,
      month,
    

      CompanyId,
     
    };

    dispatch(createSelfContribution({ formData }))
      .unwrap()
      .then((res) => {
        console.log('res', res.SelfContributionList);
        setSelfContributionData(res.SelfContributionList);
        localStorage.setItem('selfContributionData', JSON.stringify(res.SelfContributionList));

        if (res !== null) {
          console.log('res', res.SelfContributionList);

          setData({
            ...data,
            month,
            year: Year,
           
            UserId,
            category_Type: res.SelfContributionList.category_Type,
            ssNofEmp: res.SelfContributionList.ssNofEmp,
            textLevyPenalty: res.SelfContributionList.textLevyPenalty,
            obj_list: res.SelfContributionList.obj_list.map((item) => ({
              ...item,
          

              totalWadeges: item.totalWadeges || 0,
              levyee: item.levyee || 0,
            })),
          });

          setSelectedData({
            ...selectData,
            month,
            year: Year,

         
            UserId,
            ssNofEmp: res.SelfContributionList.ssNofEmp,
            userName: res.SelfContributionList.userName,
            category_Type: res.SelfContributionList.category_Type,
            textLevyPenalty: res.SelfContributionList.textLevyPenalty,
            obj_list: res.SelfContributionList.obj_list.map((item) => ({
              ...item,
              remarks: '',

              totalWadeges: item.totalWadeges || 0,
              levyee: item.levyee || 0,
            })),
          });
        }

        if (res !== null) {
          console.log('res', res.data);

          setOnChangeData({
            ...onChangeData,
            year: Year,

            UserId,
            dropNo,
            month: res.SelfContributionList.month,
            ssNofEmp: res.SelfContributionList.ssNofEmp,
            userName: res.SelfContributionList.userName,
            textTotalAccountantGeneral: res.SelfContributionList.textTotalAccountantGeneral,
            textTotalWages: res.SelfContributionList.textTotalWages,
            textTotalWagesNLevy: res.SelfContributionList.textTotalWagesNLevy,
            textLevyPenalty: res.SelfContributionList.textLevyPenalty,
            wcontribution: res.SelfContributionList.wcontribution,
            category_Type: res.SelfContributionList.category_Type,
            wincome: res.SelfContributionList.wincome,
            address: '',
            obj_list: res.SelfContributionList.obj_list.map((item) => ({
              ...item,
              remarks: '',

              totalWadeges: item.totalWadeges || 0,
              levyee: item.levyee || 0,
            })),
          });

          setIsCreated(true);
        }
      })
      .catch((err) => {
        console.log('Error occurred:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const savedSelfContributionData = localStorage.getItem('selfContributionData');
    if (savedSelfContributionData) {
      setSelfContributionData(JSON.parse(savedSelfContributionData));
    }

    const savedData = localStorage.getItem('data');
    if (savedData) {
      setData(JSON.parse(savedData));
    }

    const savedSelectedData = localStorage.getItem('selectedData');
    if (savedSelectedData) {
      setSelectedData(JSON.parse(savedSelectedData));
    }

    const savedOnChangeData = localStorage.getItem('onChangeData');
    if (savedOnChangeData) {
      setOnChangeData(JSON.parse(savedOnChangeData));
    }
  }, []);

  // const handleSaveSubmit = () => {
  //
  //   setLoadings(true);

  //   dispatch(saveSelfContribution({ data: selectData }))
  //     .unwrap()
  //     .then((res) => {
  //

  //       setResponse(res.hid);
  //       setLoadingss(false);
  //       setIsSaved(true);

  //       // ✅ Check the correct field 'msg' instead of 'message'
  //       if (res?.msg?.trim().toLowerCase() === 'self employed c3 finalized successfully') {
  //         console.log('✅ C3 finalized successfully, modal NOT opened.');
  //       } else {
  //         console.log('⚠ Opening modal...');
  //         setCreatedNewItems({ ...data, h_Id: res.hid, ...onChangeData });
  //         setIsModalOpens(true);
  //         setModalData({ year: Year, month: monthNames[month] });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log('❌ Error occurred:', err);
  //     })
  //     .finally(() => {
  //       setLoadings(false);
  //       setIsTableDisabled(true);
  //     });
  // };

  const handleSaveSubmit = () => {
    setLoadings(true);

    dispatch(saveSelfContribution({ data: selectData }))
      .unwrap()
      .then((res) => {
        const messageShow = res?.msg?.trim().toLowerCase(); // Normalize the message

        setResponse(res.hid);
        setLoadingss(false);
        setIsSaved(true);

        if (messageShow === 'openpopup') {
          // ✅ Open modal
          console.log('⚠ Opening modal...');
          setCreatedNewItems({ ...data, h_Id: res.hid, ...onChangeData });
          setModalData({ year: Year, month: monthNames[month - 1] });
          setIsModalOpens(true);
        } else if (messageShow === 'submitteddata') {
          // ✅ Do NOT open modal
          console.log('✅ Data submitted already, not opening modal.');
          setIsModalOpens(false);
        } else {
          // 🟡 Optional: handle unexpected messages here
          console.warn('⚠ Unhandled message:', messageShow);
          setIsModalOpens(false);
        }
      })
      .catch((err) => {
        console.log('❌ Error occurred:', err);
      })
      .finally(() => {
        setLoadings(false);
        setIsTableDisabled(true);
      });
  };

  const handleSaveAndSubmit = () => {
    setLoadings(true);
    const payload = {
      SSNofEmp: selectData.ssNofEmp, // Adjusted to match API parameter names
      Headerid: response,
      period_Month: selectData.month, // Keep as API expects
      Period_year: selectData.year, // Keep as API expects
      CompanyId,
      UserLoginID: userName,
      User_Password: userPassword,
      UserID: userId,
    };
    dispatch(ExportCThree(payload)) // 👈 Replace with your actual submit API call
      .unwrap()
      .then(() => {
        setIsSaved(true); // Optional: reset back to Save
        setIsSubmitted(true);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoadings(false));
  };

  const handleWeekChange = async (e, headerId) => {
    const selectedValue = e.target.value;

    setOnChangeData((prevData) => ({
      ...prevData,

      dropNo: parseInt(selectedValue, 10) || 0,
      year: String(Year),
      indexListNo: headerId,
      obj_list: prevData.obj_list.map((item) =>
        item.c3HEADERID === headerId
          ? { ...item, remarks: e.target.value } // Update the specific object's remarks
          : item,
      ),
    }));

    setLoading(true); // Indicate loading state
  };

  const handleInput = (e, headerId) => {
    const selectedValue = e.target.value;

    setOnChangeData((prevData) => ({
      ...prevData,
      obj_list: prevData?.obj_list?.map((item) =>
        item.c3HEADERID === headerId
          ? { ...item, remarks: selectedValue } // Update remarks for the specific item
          : item,
      ),
    }));

    setSelectedData((prevSelectedData) => ({
      ...prevSelectedData,
      obj_list: prevSelectedData?.obj_list?.map((item) =>
        item.c3HEADERID === headerId
          ? { ...item, remarks: selectedValue } // Update remarks for the specific item
          : item,
      ),
    }));
  };

  useEffect(() => {
    dispatch(updateOnChange({ onChangeData }))
      .unwrap()
      .then((res) => {
        console.log('resres', res);
        setOnChangeData({
          ...onChangeData,
          year: Year,
          UserId,
          dropNo,
          month: res.data.month,
          ssNofEmp: res.data.ssNofEmp,
          userName: res.data.userName,
          textTotalAccountantGeneral: res.data.textTotalAccountantGeneral,
          textTotalWages: res.data.textTotalWages,
          textTotalWagesNLevy: res.data.textTotalWagesNLevy,
          textLevyPenalty: res.data.textLevyPenalty,
          wcontribution: res.data.wcontribution,
          wincome: res.data.wincome,
          category_Type: res.data.category_Type,
          address: '',

          obj_list: res.data.obj_list.map((item) => ({
            ...item,
            remarks: '',
            wageS1: item.wageS1,
            wageS2: item.wageS2,
            wageS3: item.wageS3,
            wageS4: item.wageS4,
            wageS5: item.wageS5,
            totalWadeges: item.totalWadeges || 0,
            levyee: item.levyee || 0,
          })),
        });

        setSelectedData({
          ...selectData,
          year: Year,
          UserId,
          dropNo,
          month: res.data.month,
          ssNofEmp: res.data.ssNofEmp,
          userName: res.data.userName,
          textTotalAccountantGeneral: res.data.textTotalAccountantGeneral,
          textTotalWages: res.data.textTotalWages,
          textTotalWagesNLevy: res.data.textTotalWagesNLevy,
          textLevyPenalty: res.data.textLevyPenalty,
          wcontribution: res.data.wcontribution,
          wincome: res.data.wincome,
          category_Type: res.data.category_Type,
          address: '',
          obj_list: res.data.obj_list.map((item) => ({
            ...item,
            remarks: '',
            wageS1: item.wageS1,
            wageS2: item.wageS2,
            wageS3: item.wageS3,
            wageS4: item.wageS4,
            wageS5: item.wageS5,
            totalWadeges: item.totalWadeges || 0,
            levyee: item.levyee || 0,
          })),
        });

        setLoading(false);
        console.log('Data updated successfully');
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [onChangeData]);

  const onCanceled = () => {
    setIsModalOpens(false);
    setIsSubmitted(false);
    setIsSaved(false); // ⬅️ Reset to show "Save" button again
  };

  const isSubmitC3 = () => {
    if (!createdNewItems) return;
    dispatch(isCreatedCThree({ createdNewItems }))
      .unwrap()
      .then((responses) => {
        setIsTableDisabled(false);
        console.log('✅ createdNewItems updated:', createdNewItems);
        console.log('Submited successfully:', responses);
        // dispatch(getSelfEmployee({ companyId }));
        setIsModalOpens(false);
      })
      .catch((error) => {
        console.error('Error Submit:', error);
        setIsModalOpens(false);
      });
  };

  const exportECThree = (ssNofEmp) => {
    setExportCThreeItems({
      // SSNofEmp: ssNofEmp, // Adjusted to match API parameter names
      Headerid: response,
      Month: monthNames[month], // Keep as API expects
      year: Year, // Keep as API expects
      // CompanyId,
      // UserLoginID: userName,
      // User_Password: userPassword,
      // UserID: userId,
    });
    setIsModalOpenCThree(true); // Open the modal
  };

  const isSubmitECThree = () => {
    if (!exportCThreeItems) return;

    dispatch(exportCreatedCThree(exportCThreeItems))
      .unwrap()
      .then(async (ress) => {
        console.log(ress); // Debugging - Check the response content

        // Close the modal after successful export
        setIsModalOpenCThree(false);

        // Assuming ress is a text-based CSV (if the ress is binary, use ress.arrayBuffer() instead)
        const blob = new Blob([ress], { type: 'text/csv;charset=utf-8;' });

        if (window.showSaveFilePicker) {
          try {
            const handle = await window.showSaveFilePicker({
              suggestedName: 'ExportedFile.csv',
              types: [
                { description: 'CSV File', accept: { 'text/csv': ['.csv'] } },
                {
                  description: 'Excel File',
                  accept: {
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                  },
                },
                { description: 'Text File', accept: { 'text/plain': ['.txt'] } },
                { description: 'WordPad File', accept: { 'application/rtf': ['.rtf'] } },
              ],
            });

            // Create a writable stream and write the blob content to it
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
          } catch (error) {
            console.error('File save canceled or failed:', error);
          }
        } else {
          // Fallback for older browsers (using an anchor element)
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'ExportedFile.csv'; // Default filename
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch((error) => {
        console.error('Error submitting:', error);
        setIsModalOpenCThree(false); // Close the modal on error
      });
  };

  const onCanceledECThree = () => {
    setIsModalOpenCThree(false);
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      dispatch(resetSelfEmployeeState());
    };
  }, [dispatch]);

  const handleRemarksBlur = (e) => {
    setRemarks(e.target.value);
    console.log('📝 Remarks updated on blur:', e.target.value);
  };

  return (
    <div id="layout-wrapper">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <ul className="d-flex align-items-center gap-2 mt-3 list-unstyled">
          <li className="fw-medium">
            <Link to="/apps/dashboards" className="d-flex align-items-center gap-1 text-muted">
              <i className="ti-home" />
              Dashboard{' '}
            </Link>
          </li>
          <li>-</li>
          {/* <li className="fw-medium">
                                  <span className="d-flex align-items-center gap-1 text-muted">NW</span>
                                </li> */}
          <li>-</li>
          <li className="fw-medium"> Generate Self Employee C3 </li>
        </ul>
      </div>
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
                        <div className="col-xl-8">
                          <h4 className="header-title mb-0 text-success">
                            <i className="far fa-file-alt pe-1" />
                            Generate Self Employed C3
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row ">
                        {/* <div className="col-md-3 col-lg-3 col-xl-3">
                          <div className="mb-3">
                            <Label>Month</Label>
                            <select
                              id="month"
                              name="month"
                              value={month}
                              className="form-select"
                              onChange={handleMonthChange}
                              disabled={isTableDisabled}
                            >
                              <option value="">Select Month</option>
                              <option value="0">January</option>
                              <option value="1">February</option>
                              <option value="2">March</option>
                              <option value="3">April</option>
                              <option value="4">May</option>
                              <option value="5">June</option>
                              <option value="6">July</option>
                              <option value="7">August</option>
                              <option value="8">September</option>
                              <option value="9">October</option>
                              <option value="10">November</option>
                              <option value="11">December</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-md-3 col-lg-3 col-xl-3">
                          <div className="mb-3">
                            <Label>Year</Label>
                            <select
                              id="Year"
                              name="Year"
                              className="form-select"
                              value={Year}
                              onChange={handleYearChange}
                              disabled={isTableDisabled}
                            >
                              <option value="">Select Year</option>
                              <option value={2022}>2022</option>
                              <option value={2023}>2023</option>
                              <option value={2024}>2024</option>
                              <option value={2025}>2025</option>
                              <option value={2026}>2026</option>
                              <option value={2027}>2027</option>
                              <option value={2028}>2028</option>
                              <option value={2029}>2029</option>
                              <option value={2030}>2030</option>
                              <option value={2031}>2031</option>
                              <option value={2032}>2032</option>
                              <option value={2033}>2033</option>
                            </select>
                          </div>
                        </div> */}
                        <div className="col-md-5 col-lg-5 col-xl-5">
                          <Label>Month & Year</Label> <span className="text-danger">*</span>
                         
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="MMM yyyy"
                            showMonthYearPicker
                            className="form-control"
                            disabled={isTableDisabled}
                            placeholderText="Select Month and Year"
                            openToDate={previousMonthDate}
                          />
                        </div>
                        <div className="col-md-3 col-lg-3 col-xl-3">
                          <div className="mb-3 mt-2">
                            <button
                              onClick={handleSubmit}
                              // disabled={loading || !Year || month === ''}
                              disabled={loading}
                              className="btn btn-success waves-effect waves-light h-45"
                              type="submit"
                              style={{ height: '45px', minWidth: '100px', marginTop: '22px' }}
                            >
                              {loading ? (
                                <>
                                  <Spinner size="sm" /> Creating...
                                </>
                              ) : (
                                <>
                                  <i className="far fa-save"></i> Create
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-12">
                  <div className="card">
                    <div className="card-header py-3 bg_ligh">
                      <div className="row align-items-center d-flex">
                        <div className="col-xl-4 col-6 mb-2 mb-lg-0">
                        
                        </div>
                      </div>
                    </div>
                    <div className="card-header py-2 bg_ligh">
                      <div className="row">
                        <div className="col-md-3 col-12 text-lg-end">
                        
                        </div>
                        <div className="col-md-9 col-12 text-lg-end">
                          <Button
                            className="btn btn-success waves-effect waves-light h-45"
                            type="button"
                            disabled={loadingss || !Year || month === ''}
                            onClick={() => exportECThree(SelfContributionList.ssNofEmp)}
                          >
                            <i className="fa fa-download"></i> &nbsp; Export EC3
                          </Button>
                          <Button
                            className="btn btn-info waves-effect waves-light h-45"
                            type="button"
                            disabled={!isCreated || loadings}
                            // disabled={loadingss || !Year || month === ''}
                            onClick={() => handleShow2()}
                          >
                            <i className="far fa-eye"></i> &nbsp; Preview
                          </Button>
                          <button
                            onClick={isSaved ? handleSaveAndSubmit : handleSaveSubmit}
                            disabled={!isCreated || loadings || isSubmitted}
                            className="btn btn-success waves-effect waves-light h-45"
                            type="submit"
                          >
                            {loadings ? (
                              <>
                                <Spinner size="sm" /> {isSaved ? 'Submitting...' : 'Saving...'}
                              </>
                            ) : (
                              <>
                                <i className="far fa-save"></i> {isSaved ? 'Submit' : 'Save'}
                              </>
                            )}
                          </button>
                          <Link to="/apps/selfEmployeeContribution">
                            <Button className="h-45 btn btn-light" style={{ padding: '8px' }}>
                              <i className="fas fa-times" /> Close
                            </Button>
                          </Link>

                        
                        </div>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead>
                            <tr className="border-b">
                              <th>SSN</th>
                              <th>Employee Name</th>

                              <th>Week 1</th>
                              <th>Week 2</th>
                              <th>Week 3</th>
                              <th>Week 4</th>
                              <th>Week 5</th>
                              <th>Income</th>
                              <th>Contribution</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {SelfContributionList && SelfContributionList?.obj_list?.length > 0 ? (
                              SelfContributionList?.obj_list?.map((item, index) => (
                                <tr key={item}>
                                  <td>{item?.ssn}</td>
                                  <td>{item?.employeeName ?? 'N/A'}</td>

                                  <td>
                                    <div className="input_change">
                                      <div className="input-groups">
                                        <select
                                          className="form-select"
                                          id="selectedTypeWEEK1"
                                          name="selectedTypeWEEK1"
                                          value={item?.selectedTypeWEEK1}
                                          onChange={(e) => handleWeekChange(e, 1)}
                                          disabled={isTableDisabled}
                                          style={{
                                            height: '30px',
                                            minWidth: '50px',
                                            borderRadius: '5px 0px 0px 5px',
                                            paddingLeft: '5px',
                                            paddingRight: '5px',
                                          }}
                                        >
                                          <option value={0}>X</option>
                                          <option value={1}>S</option>
                                          <option value={2}>M</option>
                                          <option value={3}>U</option>
                                        </select>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="00.00"
                                          style={{
                                            height: '30px',
                                            borderRadius: '0px 5px 5px 0px',
                                            maxWidth: '50px',
                                            paddingLeft: '5px',
                                            paddingRight: '5px',
                                          }}
                                          value={(item?.wageS1 ?? 0).toFixed(2)}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                  </td>

                                  <td>
                                    <div className="input_change">
                                      <div className="input-groups">
                                        <select
                                          className="form-select"
                                          id="selectedTypeWEEK2"
                                          name="selectedTypeWEEK2"
                                          // value={item.selectedTypeWEEK2}
                                          onChange={(e) => handleWeekChange(e, 2)}
                                          disabled={isTableDisabled}
                                          style={{
                                            height: '30px',
                                            minWidth: '50px',
                                            borderRadius: '5px 0px 0px 5px',
                                            paddingLeft: '5px',
                                            paddingRight: '5px',
                                          }}
                                        >
                                          <option value="">X</option>
                                          <option value={1}>S</option>
                                          <option value={2}>M</option>
                                          <option value={3}>U</option>
                                        </select>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="00.00"
                                          style={{
                                            height: '30px',
                                            borderRadius: '0px 5px 5px 0px',
                                            maxWidth: '50px',
                                            paddingLeft: '5px',
                                            paddingRight: '5px',
                                          }}
                                          value={(item?.wageS2 ?? 0).toFixed(2)}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                  </td>

                                  <td>
                                    <div className="input_change">
                                      <div className="input-groups">
                                        <select
                                          className="form-select"
                                          id="selectedTypeWEEK3"
                                          name="selectedTypeWEEK3"
                                          // value={item.selectedTypeWEEK3}
                                          disabled={isTableDisabled}
                                          style={{
                                            height: '30px',
                                            minWidth: '50px',
                                            borderRadius: '5px 0px 0px 5px',
                                            paddingLeft: '5px',
                                            paddingRight: '5px',
                                          }}
                                          onChange={(e) => handleWeekChange(e, 3)}
                                        >
                                          <option value={0}>X</option>
                                          <option value={1}>S</option>
                                          <option value={2}>M</option>
                                          <option value={3}>U</option>
                                        </select>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="00.00"
                                          style={{
                                            height: '30px',
                                            borderRadius: '0px 5px 5px 0px',
                                            maxWidth: '50px',
                                            paddingLeft: '5px',
                                            paddingRight: '5px',
                                          }}
                                          value={(item?.wageS3 ?? 0).toFixed(2)}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                  </td>

                                  <td>
                                    <div className="input_change">
                                      <div className="input-groups">
                                        <select
                                          className="form-select"
                                          id="selectedTypeWEEK4"
                                          name="selectedTypeWEEK4"
                                          // value={item.selectedTypeWEEK4}
                                          disabled={isTableDisabled}
                                          style={{
                                            height: '30px',
                                            minWidth: '50px',
                                            borderRadius: '5px 0px 0px 5px',
                                            paddingLeft: '5px',
                                            paddingRight: '5px',
                                          }}
                                          onChange={(e) => handleWeekChange(e, 4)}
                                        >
                                          <option value={0}>X</option>
                                          <option value={1}>S</option>
                                          <option value={2}>M</option>
                                          <option value={3}>U</option>
                                        </select>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="00.00"
                                          style={{
                                            height: '30px',
                                            borderRadius: '0px 5px 5px 0px',
                                            maxWidth: '50px',
                                            paddingLeft: '5px',
                                            paddingRight: '5px',
                                          }}
                                          value={(item?.wageS4 ?? 0).toFixed(2)}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                  </td>

                                  <td>
                                    <div className="input_change">
                                      <div className="input-groups">
                                        <select
                                          className="form-select"
                                          id="selectedTypeWEEK5"
                                          name="selectedTypeWEEK5"
                                          disabled={isTableDisabled}
                                          // value={item.selectedTypeWEEK5}
                                          onChange={(e) => handleWeekChange(e, 5)}
                                          style={{
                                            height: '30px',
                                            minWidth: '50px',
                                            borderRadius: '5px 0px 0px 5px',
                                            paddingLeft: '5px',
                                            paddingRight: '5px',
                                          }}
                                        >
                                          <option value={0}>X</option>
                                          <option value={1}>S</option>
                                          <option value={2}>M</option>
                                          <option value={3}>U</option>
                                        </select>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="00.00"
                                          style={{
                                            height: '30px',
                                            borderRadius: '0px 5px 5px 0px',
                                            maxWidth: '50px',
                                            paddingLeft: '5px',
                                            paddingRight: '5px',
                                          }}
                                          value={(item?.wageS5 ?? 0).toFixed(2)}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder=""
                                      style={{ height: '30px', minWidth: '60px', maxWidth: '90px' }}
                                      // value={item?.totalWadeges}

                                      value={`$${(item?.totalWadeges ?? 0).toFixed(2)}`}
                                      disabled
                                    />
                                  </td>

                                  <td>
                                    <div>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder=""
                                        style={{
                                          height: '30px',
                                          minWidth: '60px',
                                          maxWidth: '90px',
                                        }}
                                        // value={item?.levyee}

                                        value={`$${(item?.levyee ?? 0).toFixed(2)}`}
                                        disabled
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="remarks"
                                      // value={item?.remarks}

                                      value={
                                        onChangeData?.obj_list?.find(
                                          (dataItem) => dataItem.c3HEADERID === item.c3HEADERID,
                                        )?.remarks || ''
                                      }
                                      onChange={(e) => handleInput(e, item.c3HEADERID)}
                                      onBlur={handleRemarksBlur}
                                      style={{
                                        height: '30px',
                                        minWidth: '50px',
                                        maxWidth: '150px',
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="12" className="text-center">
                                  No Records Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* new-addon */}

                    <div className="card my-3">
                      <div className="card-header py-3 bg_ligh">
                        <div className="row align-items-center d-flex">
                          <div className="col-xl-2"></div>
                          <div className="col-xl-3">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user text-success pe-2" />
                              C3 Contribution Summary
                            </h4>
                          </div>
                          <div className="col-xl-7 text-end"></div>
                        </div>
                      </div>

                      <div className="card-body p-0">
                        <div className="row">
                          <div className="col-md-8 col-12 pad-0 w-55 pr-0 mx-auto">
                            <div className="bg-light1 pt-2 p-3 h-100">
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600 col-md-7 col-7 p-0">a) Total Income</span>

                                <span className="font-bold col-md-2 col-2 td-text-align ">
                                  <span className="trigger">
                                    <span className="td-text-align trigger">
                                      $
                                      {Number(SelfContributionList?.textTotalWages ?? 0).toFixed(2)}
                                    </span>
                                  </span>
                                </span>
                              </p>
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600 col-md-7 col-7 p-0">
                                  b) Total Contribution
                                </span>

                                <span className="font-bold col-md-2 col-2 td-text-align ">
                                  <span className="trigger">
                                    <span className="td-text-align trigger">
                                      $
                                      {Number(
                                        SelfContributionList?.textTotalWagesNLevy ?? 0,
                                      ).toFixed(2)}
                                    </span>
                                  </span>
                                </span>
                              </p>
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600 col-md-7 col-7 p-0">c) Fines</span>

                                <span className="font-bold col-md-2 col-2 td-text-align ">
                                  {/* <span className="td-text-align text-primary"> */}
                                  <span
                                    className={`text-end ${
                                      SelfContributionList?.textLevyPenalty > 1 ? 'text-danger' : ''
                                    }`}
                                  >
                                    ${Number(SelfContributionList?.textLevyPenalty ?? 0).toFixed(2)}
                                  </span>
                                </span>
                              </p>
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600 col-md-7 col-7 p-0">
                                  d) Total Contribution and Fine due to the Accountant General
                                </span>
                                {/* <span className="f-400 col-md-3 col-3 p-0">
                                -------------------------------------------
                              </span> */}
                                <span className="font-bold col-md-2 col-2 td-text-align ">
                                  <span className="trigger">
                                    <span className="td-text-align trigger">
                                      $
                                      {Number(
                                        SelfContributionList?.textTotalAccountantGeneral ?? 0,
                                      ).toFixed(2)}
                                    </span>
                                  </span>
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* new-addon */}
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
      {/* END layout-wrapper */}
      <div className="modal" id="myModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h4 className="modal-title">Employee Bonus Details</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            {/* Modal body */}
            <div className="modal-body">
              <div className="row">
                {/*          <div class="col-md-6 col-lg-6 col-xl-6">
              <Label class="d-block">&nbsp; </Label>
         
          </div>   */}
                <div className="col-md-6 col-lg-6 col-xl-6">
                  <div className="mb-3">
                    <Label>
                      Employee <span className="text-danger">*</span>{' '}
                    </Label>
                    <select className="form-select" aria-label="Default select example">
                      <option selected="">Select Employee</option>
                      <option value={1}>100001(Bhanu)</option>
                      <option value={2}>100001(Rajesh)</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 col-lg-6 col-xl-6">
                  <div className="mb-3">
                    <Label>
                      Payment Date <span className="text-danger">*</span>
                    </Label>
                    <input type="date" className="form-control" id="username" placeholder="" />
                  </div>
                </div>
                <div className="col-md-6 col-lg-6 col-xl-6">
                  <div className="mb-3">
                    <Label>
                      Amount <span className="text-danger">*</span>
                    </Label>
                    <input type="number" className="form-control" id="username" placeholder="" />
                  </div>
                </div>
                <div className="col-md-6 col-lg-6 col-xl-6 mt-4 pt-2">
                  <button type="button" className="btn btn-success px-4 me-3">
                    Save
                  </button>
                  <button type="button" className="btn btn-light border px-4">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            {/* Modal footer */}
            <div className="border-top">
              <div className="px-4 py-3">
                <div className="row">
                  <div className="col-md-12 col-lg-12 col-xl-12">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0 white-space">
                        <thead>
                          <tr className="border-b">
                            <th scope="row">S.No.</th>
                            <th>Amount</th>
                            <th>Pay Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>$682</td>
                            <td>12/12/2024</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>$582</td>
                            <td>24/12/2024</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>$452</td>
                            <td>29/12/2024</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={show2} size="lg" onHide={handleClose2}>
        <ModalHeader toggle={handleClose2}>
          <div className="row">
            <div className="col-lg-6">
              <h2>Report</h2>
            </div>
            {/* <div className="col-lg-6">Anjani</div> */}
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="main-content">
            <div className="page-content">
              <div className="container-fluid">
                <div className="page-content-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header py-3 bg_ligh">
                          <div className="row align-items-center d-flex">
                            <div className="col-xl-12 col-12 mb-2 mb-lg-0">
                              <h4 className="header-title mb-0 text-success">
                                <i className="far fa-user text-success pe-2" />
                                Self Employed C3 Report{' '}
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div ref={targetRef}>
                          <div className="row">
                            <div className="col-xl-12 ">
                              <div className="card">
                                <div className="card-body">
                                  <div className="draft">
                                    <h3 style={{ lineHeight: '131%', textAlign: 'center' }}>
                                      SOCIAL SECURITY BOARD
                                    </h3>
                                    <h5 style={{ textAlign: 'center' }} className="mb-4">
                                      SELF EMPLOYED PERSON CONTRIBUTION REMITTANCE FORM
                                    </h5>
                                    <div className="row mt-3">
                                      <table
                                        style={{
                                          width: '100%',
                                          borderCollapse: 'collapse',
                                          marginBottom: '20px',
                                        }}
                                      >
                                        <thead>
                                          <tr>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th
                                              colSpan={4}
                                              style={{
                                                borderBottom: '1px solid #000',
                                                textAlign: 'left',
                                              }}
                                            >
                                              <span className="text_font">For</span>&nbsp;
                                              <span className="adjustment_UI">
                                                {' '}
                                                {previewNWDataList?.data?.[0]?.currentMonth}
                                              </span>
                                            </th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                          </tr>
                                        </thead>
                                      </table>
                                    </div>
                                    <p style={{ textAlign: 'left' }} className="mb-2">
                                      <b>Name of Self Employed:</b>{' '}
                                      <span className="s9">
                                        {previewNWDataList?.data?.[0]?.empName}
                                      </span>
                                    </p>
                                    <p style={{ textAlign: 'left' }} className="mb-2">
                                      <b>Social Security Number</b>{' '}
                                      <span className="s9">
                                        {previewNWDataList?.data?.[0]?.socialSecurityNo}
                                      </span>
                                    </p>
                                    <p style={{ textAlign: 'left' }} className="mb-2">
                                      <b>Address: (Location &amp; Box No.)</b>{' '}
                                      <span className="s9" style={{ width: '66%' }}>
                                        {previewNWDataList?.data?.[0]?.companyAddress}
                                      </span>
                                    </p>
                                    <p style={{ textAlign: 'left' }} className="mb-2">
                                      <b>Income Category Selected:</b>{' '}
                                      <span className="s9" style={{ width: '70%' }}>
                                        {previewNWDataList?.data?.[0]?.category_Type}
                                      </span>
                                    </p>
                                    <p className="mb-2">
                                      <b>To: Director Social Security.</b>
                                    </p>
                                    <p style={{ textAlign: 'left' }} className="mb-3">
                                      <b>With this statement is a cheque and/or cash for</b>{' '}
                                      <span
                                        className=""
                                        style={{
                                          width: '54%',
                                          borderBottom: '1px dotted #666',
                                          display: 'inline-block',
                                        }}
                                      >
                                        $
                                        {previewNWDataList?.data?.[0]?.grandTotal?.toFixed(2) ??
                                          '0.00'}
                                      </span>
                                    </p>
                                    <p className="mb-2 f-14 text-center">
                                      <b>
                                        Complete table if you are not paying for all the weeks in
                                        this month
                                      </b>
                                    </p>
                                    <div className="table-responsive draft">
                                      <table className="table table-hover table-bordered mb-0 white-space2 mb-4 report-table">
                                        <thead>
                                          <tr>
                                            <th
                                              colSpan={5}
                                              className="text-start"
                                              style={{ textAlign: 'left' }}
                                            >
                                              {' '}
                                              Put &#39;X&#39; for wks worked, &#39;S&#39; for sick
                                              leave
                                              <br /> sickness, &#39;M&#39; for Maternity &amp;
                                              &#39;U&#39;
                                              <br /> for unemployment.
                                            </th>
                                            <th rowSpan={2}> Self Employed Contribution</th>
                                            <th rowSpan={2}>Remarks</th>
                                          </tr>
                                          <tr>
                                            <th>WK1</th>
                                            <th>WK2</th>
                                            <th>WK3</th>
                                            <th>WK4</th>
                                            <th>WK5</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td className="text-center">
                                              {previewNWDataList?.data?.[0]?.firstWeekOfMonth}
                                            </td>
                                            <td className="text-center">
                                              {previewNWDataList?.data?.[0]?.secondWeekOfMonth}
                                            </td>
                                            <td className="text-center">
                                              {previewNWDataList?.data?.[0]?.thirdWeekOfMonth}
                                            </td>
                                            <td className="text-center">
                                              {previewNWDataList?.data?.[0]?.fourthWeekOfMonth}
                                            </td>
                                            <td className="text-center">
                                              {previewNWDataList?.data?.[0]?.fifthWeekOfMonth}
                                            </td>
                                            <td className="text-end">
                                              {/* $
                                      {previewNWDataList?.data?.[0]?.deductLeavyWages?.toFixed(2) ??
                                        '0.00'} */}
                                            </td>
                                            <td className="">
                                              {' '}
                                              {previewNWDataList?.data?.[0]?.remarks}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td colSpan={5}>
                                              {' '}
                                              <b> a) Total Contribution:</b>
                                              -----------------------------------------------------------------------------------------------------&gt;
                                            </td>
                                            <td className="text-end">
                                              $
                                              {previewNWDataList?.data?.[0]?.deductLeavyWages.toFixed(
                                                2,
                                              ) ?? '0.00'}
                                            </td>
                                            <td rowSpan={2}>Receipt No.</td>
                                          </tr>
                                          <tr>
                                            <td colSpan={5}>
                                              <b> b) Fines:</b>
                                              ------------------------------------------------------------------------------------------------------------------------&gt;
                                            </td>
                                            {/* <td className="text-end text-primary">
                                              $
                                              {previewNWDataList?.data?.[0]?.fine.toFixed(2) ??
                                                '0.00'}
                                            </td> */}
                                            {/* <td
                                              className={`text-end ${
                                                previewNWDataList?.data?.[0]?.fine > 1
                                                  ? 'text-danger'
                                                  : 'text-black'
                                              }`}
                                            >
                                              $
                                              {typeof previewNWDataList?.data?.[0]?.fine ===
                                              'number'
                                                ? previewNWDataList.data[0].fine.toFixed(2)
                                                : '0.00'}
                                            </td> */}
                                            <td
                                              className={`text-end ${
                                                Number(previewNWDataList?.data?.[0]?.fine) > 0
                                                  ? 'text-danger'
                                                  : 'text-black'
                                              }`}
                                            >
                                              $
                                              {Number(
                                                previewNWDataList?.data?.[0]?.fine || 0,
                                              ).toFixed(2)}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td colSpan={5}>
                                              <b> c) Grand Total:</b>
                                              ---------------------------------------------------------------------------------------------------------------&gt;
                                            </td>
                                            <td className="text-end">
                                              {' '}
                                              $
                                              {previewNWDataList?.data?.[0]?.grandTotal.toFixed(
                                                2,
                                              ) ?? '0.00'}
                                            </td>
                                            <td className="" />
                                          </tr>
                                        </tbody>
                                      </table>
                                      <p className="text-center">
                                        I hereby certify that the particulars stated above are true
                                        and correct <br />
                                        the best of my knowledge and belief
                                      </p>
                                    </div>
                                    <div className="row mt-3">
                                      <table className="w-100">
                                        <tbody>
                                          <tr>
                                            <td style={{ width: '45%', verticalAlign: 'top' }}>
                                              <div style={{ height: '20px' }}>&nbsp;</div>
                                              <div
                                                style={{
                                                  borderBottom: '1px solid #666',
                                                  display: 'inline-block',
                                                  width: '100%',
                                                  marginBottom: '4px',
                                                }}
                                              ></div>
                                              <p style={{ textAlign: 'center', marginBottom: 0 }}>
                                                Signature
                                              </p>
                                            </td>

                                            <td style={{ width: '10%' }}></td>

                                            <td style={{ width: '45%', verticalAlign: 'top' }}>
                                              <div
                                                className="addon_class"
                                                style={{ marginBottom: '4px' }}
                                              >
                                                {moment(
                                                  new Date(currentDateTime),
                                                  'DD-MM-YYYY',
                                                ).format('DD-MMM-YYYY')}
                                              </div>
                                              <div
                                                style={{
                                                  borderBottom: '1px solid #666',
                                                  display: 'inline-block',
                                                  width: '100%',
                                                  marginBottom: '4px',
                                                }}
                                              ></div>
                                              <p style={{ textAlign: 'center', marginBottom: 0 }}>
                                                Date
                                              </p>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
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
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" className="h-45 btn btn-light" onClick={handleClose2}>
            <i className="fas fa-times"></i> Close
          </Button>
          <Button color="success" onClick={handlePrint}>
            <i className="dripicons-print" /> Print
          </Button>
          <Button
            color="btn btn-info waves-effect waves-light h-45 btn btn-secondary"
            onClick={toPDF}
          >
            <i className="fas fa-download"></i> Download PDF
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={show3} size="lg" onHide={handleClose3}>
        <ModalHeader toggle={handleClose3}>
          <div className="row">
            <div className="col-lg-6">
              <h2>Report</h2>
            </div>
            {/* <div className="col-lg-6">Anjani</div> */}
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="main-content">
            <div className="page-content">
              <div className="container-fluid">
                <div className="page-content-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header py-3 bg_ligh">
                          <div className="row align-items-center d-flex">
                            <div className="col-xl-12 col-12 mb-2 mb-lg-0">
                              <h4 className="header-title mb-0 text-success">
                                <i className="far fa-user text-success pe-2" />
                                Self Employed C3 Report{' '}
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div ref={targetRef}>
                          <div className="row">
                            <div className="col-xl-12 ">
                              <div className="card">
                                <div className="card-body">
                                  <div className="draft">
                                    <h3 style={{ lineHeight: '131%', textAlign: 'center' }}>
                                      SOCIAL SECURITY BOARD
                                    </h3>
                                    <h5 style={{ textAlign: 'center' }} className="mb-4">
                                      SELF EMPLOYED PERSON CONTRIBUTION REMITTANCE FORM
                                    </h5>
                                    <div className="row mt-3">
                                      <table
                                        style={{
                                          width: '100%',
                                          borderCollapse: 'collapse',
                                          marginBottom: '20px',
                                        }}
                                      >
                                        <thead>
                                          <tr>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th
                                              colSpan={4}
                                              style={{
                                                borderBottom: '1px solid #000',
                                                textAlign: 'left',
                                              }}
                                            >
                                              <span className="text_font">For</span>&nbsp;
                                              <span className="adjustment_UI">
                                                {' '}
                                                {selfContributionData?.currentMonth}
                                              </span>
                                            </th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                            <th colSpan={4}>&nbsp;</th>
                                          </tr>
                                        </thead>
                                      </table>
                                    </div>
                                    <p style={{ textAlign: 'left' }} className="mb-2">
                                      <b>Name of Self Employed:</b>{' '}
                                      <span className="s9"> {SelfContributionList?.userName}</span>
                                    </p>
                                    <p style={{ textAlign: 'left' }} className="mb-2">
                                      <b>Social Security Number</b>{' '}
                                      <span className="s9"> {SelfContributionList?.ssNofEmp}</span>
                                    </p>
                                    <p style={{ textAlign: 'left' }} className="mb-2">
                                      <b>Address: (Location &amp; Box No.)</b>{' '}
                                      <span className="s9" style={{ width: '66%' }}>
                                        {selfContributionData?.address}
                                      </span>
                                    </p>
                                    <p style={{ textAlign: 'left' }} className="mb-2">
                                      <b>Income Category Selected:</b>{' '}
                                      <span className="s9" style={{ width: '70%' }}>
                                        {SelfContributionList?.category_Type}
                                      </span>
                                    </p>
                                    <p className="mb-2">
                                      <b>To: Director Social Security.</b>
                                    </p>
                                    <p style={{ textAlign: 'left' }} className="mb-3">
                                      <b>With this statement is a cheque and/or cash for</b>{' '}
                                      <span
                                        className=""
                                        style={{
                                          width: '54%',
                                          borderBottom: '1px dotted #666',
                                          display: 'inline-block',
                                        }}
                                      >
                                        $
                                        {Number(
                                          SelfContributionList?.textTotalAccountantGeneral || 0,
                                        ).toFixed(2)}
                                      </span>
                                    </p>
                                    <p className="mb-2 f-14 text-center">
                                      <b>
                                        Complete table if you are not paying for all the weeks in
                                        this month
                                      </b>
                                    </p>
                                    <div className="table-responsive draft">
                                      <table className="table table-hover table-bordered mb-0 white-space2 mb-4 report-table">
                                        <thead>
                                          <tr>
                                            <th
                                              colSpan={5}
                                              className="text-start"
                                              style={{ textAlign: 'left' }}
                                            >
                                              {' '}
                                              Put &#39;X&#39; for wks worked, &#39;S&#39; for sick
                                              leave
                                              <br /> sickness, &#39;M&#39; for Maternity &amp;
                                              &#39;U&#39;
                                              <br /> for unemployment.
                                            </th>
                                            <th rowSpan={2}> Self Employed Contribution</th>
                                            <th rowSpan={2}>Remarks</th>
                                          </tr>
                                          <tr>
                                            <th>WK1</th>
                                            <th>WK2</th>
                                            <th>WK3</th>
                                            <th>WK4</th>
                                            <th>WK5</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td className="text-center">
                                              {/* {PreviewData?.data?.[0]?.firstWeekOfMonth} */}X
                                            </td>
                                            <td className="text-center">
                                              {/* {PreviewData?.data?.[0]?.secondWeekOfMonth} */}X
                                            </td>
                                            <td className="text-center">
                                              {/* {PreviewData?.data?.[0]?.thirdWeekOfMonth} */}X
                                            </td>
                                            <td className="text-center">
                                              {' '}
                                              {/* {PreviewData?.data?.[0]?.fourthWeekOfMonth} */}X
                                            </td>
                                            <td className="text-center">
                                              {' '}
                                              {/* {PreviewData?.data?.[0]?.fifthWeekOfMonth} */}X
                                            </td>
                                            <td className="text-end">
                                              {/* $
                                              {selfContributionData?.obj_list?.length > 0
                                                ? selfContributionData?.obj_list[0]?.levyee || 'N/A'
                                                : 'N/A'} */}
                                            </td>
                                            <td className=""> {remarks}</td>
                                          </tr>
                                          <tr>
                                            <td colSpan={5}>
                                              {' '}
                                              <b> a) Total Contribution:</b>
                                              -----------------------------------------------------------------------------------------------------&gt;
                                            </td>
                                            <td className="text-end">
                                              $
                                              {Number(
                                                SelfContributionList?.textTotalWagesNLevy ?? 0,
                                              ).toFixed(2)}
                                            </td>
                                            <td rowSpan={2}>Receipt No.</td>
                                          </tr>
                                          <tr>
                                            <td colSpan={5}>
                                              <b> b) Fines:</b>
                                              ------------------------------------------------------------------------------------------------------------------------&gt;
                                            </td>
                                            <td className="text-end text-danger">
                                              <span
                                                className={`text-end ${
                                                  Number(SelfContributionList?.textLevyPenalty) > 0
                                                    ? 'text-danger'
                                                    : 'text-black'
                                                }`}
                                              >
                                                $
                                                {Number(
                                                  SelfContributionList?.textLevyPenalty || 0,
                                                ).toFixed(2)}
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td colSpan={5}>
                                              <b> c) Grand Total:</b>
                                              ---------------------------------------------------------------------------------------------------------------&gt;
                                            </td>
                                            <td className="text-end">
                                              $
                                              {Number(
                                                SelfContributionList?.textTotalAccountantGeneral ??
                                                  0,
                                              ).toFixed(2)}
                                            </td>
                                            <td className="" />
                                          </tr>
                                        </tbody>
                                      </table>
                                      <p className="text-center">
                                        I hereby certify that the particulars stated above are true
                                        and correct <br />
                                        the best of my knowledge and belief
                                      </p>
                                    </div>
                                    <div className="row mt-3">
                                      <table className="w-100">
                                        <tbody>
                                          <tr>
                                            <td style={{ width: '45%', verticalAlign: 'top' }}>
                                              <div style={{ height: '20px' }}>&nbsp;</div>
                                              <div
                                                style={{
                                                  borderBottom: '1px solid #666',
                                                  display: 'inline-block',
                                                  width: '100%',
                                                  marginBottom: '4px',
                                                }}
                                              ></div>
                                              <p style={{ textAlign: 'center', marginBottom: 0 }}>
                                                Signature
                                              </p>
                                            </td>

                                            <td style={{ width: '10%' }}></td>

                                            <td style={{ width: '45%', verticalAlign: 'top' }}>
                                              <div
                                                className="addon_class"
                                                style={{ marginBottom: '4px' }}
                                              >
                                                {moment(
                                                  new Date(currentDateTime),
                                                  'DD-MM-YYYY',
                                                ).format('DD-MMM-YYYY')}
                                              </div>
                                              <div
                                                style={{
                                                  borderBottom: '1px solid #666',
                                                  display: 'inline-block',
                                                  width: '100%',
                                                  marginBottom: '4px',
                                                }}
                                              ></div>
                                              <p style={{ textAlign: 'center', marginBottom: 0 }}>
                                                Date
                                              </p>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                  <div className="draft-img">
                                    {/* {isPaidStatus && (
                                      <span className="Paid_Image"> */}
                                    <img src={draftImage} alt="Paid" />
                                    {/* </span>
                                    )} */}
                                  </div>
                                </div>
                              </div>
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
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" className="h-45 btn btn-light" onClick={handleClose3}>
            <i className="fas fa-times"></i> Close
          </Button>
          <Button color="success" onClick={handlePrint}>
            <i className="dripicons-print" /> Print
          </Button>
          <Button
            color="btn btn-info waves-effect waves-light h-45 btn btn-secondary"
            onClick={toPDF}
          >
            <i className="fas fa-download"></i> Download PDF
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isModalOpens} toggle={onCanceled}>
        <ModalHeader toggle={onCanceled}>Confirm Action</ModalHeader>
        <ModalBody>
          A C3 for this period ({modalData.month} {modalData.year}) has already been created.
          Overwriting it will replace the existing C3. Would you like to proceed?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={onCanceled}>
            No
          </Button>
          <Button color="primary" onClick={isSubmitC3}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isModalOpenCThree} toggle={toggleModalECThree}>
        <ModalHeader toggle={toggleModalECThree}>Confirm Action</ModalHeader>
        <ModalBody>Do you want to Export this C3 ?</ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={onCanceledECThree}>
            No
          </Button>
          <Button color="primary" onClick={isSubmitECThree}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default AddSelfEmployee;
