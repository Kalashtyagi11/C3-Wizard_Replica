import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from 'reactstrap';
import { debounce } from 'lodash';
import {
  checkC3Created,
  editC3EmployeeListing,
  getCGeneration,
  loadEmployee,
  loadEmployeeNill,
  PreviewPost,
  UpdateExceptionRow,
  AddExceptionRow,
} from '../../../store/apps/cGeneration/CGenerationSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import { getEmployee, saveBonus } from '../../../store/apps/C/CSlice';
import {
  editHoliday,
  employeeAndWokingEmployeelist,
  getAllHolidayPayById,
} from '../../../store/apps/cGeneration/holiday';
import EmployeeImportModal from '../component/ImportEmployeeC3';
import EmployeeGenerated from '../component/EmployeeGenerated';
import BulkUpdateModal from '../component/BulkUpdateModal';
import CustomModal from '../component/CustomModal';
import EmployeePayTabsModal from '../component/EmployeePayTabsModal';
import UnsavedPayGuard from '../component/UnsavedPayGuard';
import ConfirmationModal from '../component/ConfirmationModal';

import './Toggle.scss';
import PerviewC3 from './perviewC3';
import Loader from '../../../layouts/loader/Loader';

const AddC3Generation = () => {
  const location = useLocation();
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [modalGenerated, setModalGenerated] = useState(false);
  const closeEmployeeModal = () => setModalGenerated(false);
  const [savedPayVersion, setSavedPayVersion] = useState(0);
  const UploadedC3 = location.state?.UploadedC3;
  const [payData, setPayData] = useState(() => {
    const saved = sessionStorage.getItem('payData');
    return saved ? JSON.parse(saved) : { bonus: [], holiday: [] };
  });
  const [modalData, setModalData] = useState({
    formData: {},
    row: null,
  });
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [availableTabs, setAvailableTabs] = useState([]);
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [previewModalOpenNew, setPreviewModalOpenNew] = useState(false);
  const [errorDataModalOpen, setErrorDataModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const [modalHolidayPay, setModalHolidayPay] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tempMonth, setTempMonth] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showApiMsg, setShowApiMsg] = useState(true);
  const [showBackButton, setShowBackButton] = useState('');
  const [showYesNoButtons, setShowYesNoButtons] = useState(true);
  const [showNoRecords, setShowNoRecords] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [exceptionModalMessage, setExceptionModalMessage] = useState('');
  const [isActive, setIsActive] = useState(location?.state?.isNilReturn ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNill, setIsNill] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [apiMsg, setApiMsg] = useState('');
  const [apiMsgNew, setApiMsgNew] = useState('');
  const [importList, setImportList] = useState([]);
  const [hasShownImportModal, setHasShownImportModal] = useState(false);
  const CompanyId = localStorage.getItem('companyId');
  const getDate = new Date();
  const [saveLoad, setSaveLoad] = useState(false);
  const [nillSave, setNillSave] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenSubmit, setIsModalOpenSubmit] = useState(false);
  const [headerid, setHeaderid] = useState('');
  const currentMonth = getDate.getMonth() + 1;
  const [month, setMonth] = useState(currentMonth < '10' ? `0${currentMonth}` : currentMonth);
  const [year, setyear] = useState(getDate.getFullYear().toString());
  const { message, type } = useSelector((state) => state.messageReducer);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [monthOther, setMonthOther] = useState('');
  const [yearOther, setYearOther] = useState('');
  const [selectedOptionsOther, setSelectedOptionsOther] = useState([]);
  const [exceptionData, setExceptionData] = useState([]);
  const [bemaListData, setBemaListData] = useState([]);
  const [loadingException, setLoadingException] = useState(null);
  const [bulkUpdateLoading, setBulkUpdateLoading] = useState(false);
  const [bulkUpdateModalOpen, setBulkUpdateModalOpen] = useState(false);
  const [bulkUpdateEmployees, setBulkUpdateEmployees] = useState([]);
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [isImportC3file, setIsImportC3file] = useState(null);
  const [errorExceptionData, setErrorExceptionData] = useState([]);
  const [footerCalculate, setFooterCalculate] = useState(null);
  const hideToggle = location.state?.hideToggle;
  const ImportFileDataC3 = location.state?.ImportFileDataC3;
  const runOnceRef = useRef(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermDepartment, setSearchTermDepartment] = useState('');
  const [searchTermPeriod, setSearchTermPeriod] = useState('');

  const {
    loadEmployeeList,
    previewData,
    loading,
    loadingings: reduxLoading,
  } = useSelector((state) => state.cGenerationSlice || {});
  const [pageLoading, setPageLoading] = useState('false');
  const isLoadingMain = reduxLoading || pageLoading;
  const [sortCriteria, setSortCriteria] = useState(''); // Default sorting by SSN
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'C3 GENERATION');
  const canPreviewC3Generation = employerPermission?.is_preview;
  const canPrintC3Generation = employerPermission?.is_Print;
  const canViewC3Generation = employerPermission?.viewPermission;
  const [payPeriodSearch, setPayPeriodSearch] = useState('');
  const Unique = localStorage.getItem('userID'); // or however you store it
  const Regular = localStorage.getItem('companyId');
  const [isExceptionUpdated, setIsExceptionUpdated] = useState(false);

  useEffect(() => {
    const shouldClear = sessionStorage.getItem('clearPayDataOnLoad');

    if (shouldClear === 'true') {
      setPayData({ bonus: [], holiday: [] });
      sessionStorage.removeItem('payData');

      // 🔒 consume the flag (VERY IMPORTANT)
      sessionStorage.removeItem('clearPayDataOnLoad');
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('payData', JSON.stringify(payData));
  }, [payData]);

  useEffect(() => {
    if (canViewC3Generation === false) {
      navigate('/login');
    }
  }, [canViewC3Generation, navigate]);

  useEffect(() => {
    dispatch(getEmployee(CompanyId));
  }, []);
  const [CmbPayPeriod, setCmbPayPeriod] = useState([]);

  useEffect(() => {
    const mappedOptions = selectedOptions.map((option) => {
      switch (option) {
        case 'W - Weekly':
          return { key: 'W - Weekly', value: 'W' };
        case 'E2W - Every Two Weeks':
          return { key: 'E2W - Every Two Weeks', value: 'E2W' };
        case '2M - Twice Monthly':
          return { key: '2M - Twice Monthly', value: '2M' };
        case 'M - Monthly':
          return { key: 'M - Monthly', value: 'M' };
        default:
          return {
            key: 'All',
            value: 'All',
          };
      }
    });

    // Add the "All" option if no specific selections are made
    if (selectedOptions.length === 0) {
      mappedOptions.push({ key: 'All', value: 'All' });
    }

    setCmbPayPeriod(mappedOptions);
  }, [selectedOptions]);

  const dataLoad = [
    {
      key: 'Weekly',
      value: 'W',
    },
    {
      key: 'Monthly',
      value: 'M',
    },
    {
      key: '2 /Monthly',
      value: 'string',
    },
    {
      key: 'E2 Weekly',
      value: 'S',
    },
    {
      key: 'All',
      value: 'All',
    },
  ];
  const apiLoad = {
    CompanyId,
    month,
    year,
    dataLoad: CmbPayPeriod,
    isNilReturn: isActive,
  };
  const [data, setData] = useState([]);
  const [disButton, setDisButton] = useState(false);
  useEffect(() => {
    setDisButton(true);
  }, [month, year, CmbPayPeriod]);
  useEffect(() => {
    if (loading === false) {
      setDisButton(false);
    }
  }, [loading]);
  const [debouncedValues, setDebouncedValues] = useState({ month, year, CmbPayPeriod });
  const debouncedApiCall = debounce(() => {
    const errorMessage = [];
    setPageLoading(true);
    dispatch(loadEmployee(apiLoad))
      .then((action) => {
        const payload = action?.payload || {};
        const { isNilReturn } = payload;
        if (action.payload?.msg && action.payload.msg.trim() !== '' && !location.state) {
          setApiMsg(action.payload.msg);
          setIsModalOpenSubmit(true);
          setShowNoRecords(true);
        } else {
          setShowNoRecords(false);
        }
        if (typeof isNilReturn !== 'undefined') {
          setIsActive(isNilReturn);
        }
      })
      .catch((error) => {
        setShowNoRecords(false);
      })

      .finally(() => {
        setPageLoading(false); // stop loading
      });
  });

  const debouncedApiCallNew = debounce((payload) => {
    const errorMessage = [];
    const finalApiLoad = {
      ...apiLoad,
      month: payload.month,
      year: payload.year,
      dataLoad: payload.CmbPayPeriod,
    };

    setMonth(payload.month);
    setyear(payload.year);
    setCmbPayPeriod(payload.CmbPayPeriod);
    const newSelectedOptions = payload.CmbPayPeriod.map((item) => item.key);
    setSelectedOptions(newSelectedOptions);

    setPageLoading(true);
    dispatch(loadEmployee(finalApiLoad))
      .then((action) => {
        if (action.payload?.msg && action.payload.msg.trim() !== '' && !location.state) {
          setApiMsgNew(action.payload.msg);
          setIsModalOpenSubmit(true); // open modal for toggle
          setShowNoRecords(true);
        } else {
          setShowNoRecords(false);
          setApiMsgNew('');
          setShowNoRecords(false);
        }
      })
      .catch((error) => {
        setShowNoRecords(false);
      })
      .finally(() => {
        setPageLoading(false); // stop loading
      });
  });

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!month || !year || !CmbPayPeriod || CmbPayPeriod.length === 0) return;

    setDebouncedValues((prev) => {
      const isSame =
        prev.month === month &&
        prev.year === year &&
        JSON.stringify(prev.CmbPayPeriod) === JSON.stringify(CmbPayPeriod);

      return isSame ? prev : { month, year, CmbPayPeriod };
    });
  }, [month, year, CmbPayPeriod]);

  // ✅ Effect 2: Trigger API only once per valid debounced change
  useEffect(() => {
    const isValid =
      debouncedValues.month &&
      debouncedValues.year &&
      debouncedValues.CmbPayPeriod &&
      debouncedValues.CmbPayPeriod.length > 0;

    if (isValid) {
      // Prevent double call on first edit load
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
      }

      debouncedApiCall(debouncedValues);
    }

    // ✅ Always return a cleanup (avoids ESLint warning)
    return () => {
      if (isValid && debouncedApiCall.cancel) {
        debouncedApiCall.cancel();
      }
    };
  }, [debouncedValues]);

  const [scheduleNo, setscheduleNo] = useState(0);

  useEffect(() => {
    // If location.state exists → EDIT mode → do nothing
    if (location.state) return;

    // If ADD mode → set previous month
    const today = new Date();
    today.setDate(1); // 👈 IMPORTANT
    today.setMonth(today.getMonth() - 1);

    setMonth(String(today.getMonth() + 1).padStart(2, '0'));
    setyear(String(today.getFullYear()));
  }, []);

  useEffect(
    () => {
      const uploadedData = location.state?.uploadedData?.postReq;
      if (hideToggle === false) {
        setMonth(location.state?.uploadedData?.postReq?.monthno || '');
        setyear(location.state?.uploadedData?.postReq?.year || '');
      }
      setIsImportC3file(location.state?.uploadedData?.postReq?.isImportC3file || false);
      setBemaListData(location.state?.uploadedData?.bimaEmpViled || []);
      setErrorExceptionData(location.state?.uploadedData?.exceptionList || []);
      setUploadedFileData(location.state?.uploadedData?.postReq?.c3FilePath || '');
      setFooterCalculate(location.state?.uploadedData?.postReq?.footerCalcuations || null);
      const uploadedDataException = location.state?.uploadedData?.exceptionList.map((x) => ({
        ...x,
        wageS1: (+x.wageS1 || 0).toFixed(2),
        wageS2: (+x.wageS2 || 0).toFixed(2),
        wageS3: (+x.wageS3 || 0).toFixed(2),
        wageS4: (+x.wageS4 || 0).toFixed(2),
        wageS5: (+x.wageS5 || 0).toFixed(2),
      }));

      let finalData = [];

      if (
        uploadedData?.allEmployeeList_List &&
        Array.isArray(uploadedData.allEmployeeList_List) &&
        uploadedData.allEmployeeList_List.length > 0
      ) {
        finalData = uploadedData.allEmployeeList_List.map((x) => ({
          ...x,
          wageS1: (+x.wageS1 || 0).toFixed(2),
          wageS2: (+x.wageS2 || 0).toFixed(2),
          wageS3: (+x.wageS3 || 0).toFixed(2),
          wageS4: (+x.wageS4 || 0).toFixed(2),
          wageS5: (+x.wageS5 || 0).toFixed(2),
        }));

        setMonth(uploadedData.monthno?.toString().padStart(2, '0') || '');
        setyear(uploadedData.year || '');
        setscheduleNo(uploadedData.schedule_no || 0);

        setExceptionData(uploadedDataException ?? []);
      }
      // ------ CASE 2: Coming from Previous Page ------
      else if (location.state?.header) {
        finalData = location.state.employees.map((x) => ({
          ...x,
          wageS1: (+x.wageS1).toFixed(2),
          wageS2: (+x.wageS2).toFixed(2),
          wageS3: (+x.wageS3).toFixed(2),
          wageS4: (+x.wageS4).toFixed(2),
          wageS5: (+x.wageS5).toFixed(2),
        }));

        setMonth(
          location.state.header.period_Month.length === 1
            ? `0${location.state.header.period_Month}`
            : location.state.header.period_Month,
        );
        setyear(location.state.header.period_year);
        setscheduleNo(location.state.header.schedule_NO);

        if (
          Array.isArray(location.state.popUpList) &&
          location.state.popUpList.length > 0 &&
          !hasShownImportModal &&
          !showImportModal
        ) {
          setShowImportModal(true);
          setImportList(location.state.popUpList);
          setHasShownImportModal(true);
        }

        setExceptionData([]);
      } else if (hideToggle === false) {
        setExceptionData(uploadedDataException ?? []);
      } else {
        finalData = loadEmployeeList;
        setExceptionData([]);
      }
      // ------ CASE 3: Fallback (Refresh / Direct Open) ------

      setData(finalData);

      const filteredData = finalData.filter((item) => item.isemployeeDirector === false);
      const uniquePayPeriods = [...new Set(filteredData.map((item) => item.payPeriod))];
      setSelectedOptions(uniquePayPeriods);
    },
    isExceptionUpdated ? [location.state] : [location.state, loadEmployeeList],
  );

  // useEffect(
  //   () => {
  //     // ✅ RUN ONLY ONCE (React 18 StrictMode safe)
  //     if (runOnceRef.current) return;
  //     runOnceRef.current = true;

  //     const uploadedData = location.state?.uploadedData?.postReq;

  //     if (hideToggle === false) {
  //       setMonth(location.state?.uploadedData?.postReq?.monthno || '');
  //       setyear(location.state?.uploadedData?.postReq?.year || '');
  //     }

  //     setIsImportC3file(location.state?.uploadedData?.postReq?.isImportC3file || false);
  //     setBemaListData(location.state?.uploadedData?.bimaEmpViled || []);
  //     setErrorExceptionData(location.state?.uploadedData?.exceptionList || []);
  //     setUploadedFileData(location.state?.uploadedData?.postReq?.c3FilePath || '');
  //     setFooterCalculate(location.state?.uploadedData?.postReq?.footerCalcuations || null);

  //     const uploadedDataException = location.state?.uploadedData?.exceptionList.map((x) => ({
  //       ...x,
  //       wageS1: (+x.wageS1 || 0).toFixed(2),
  //       wageS2: (+x.wageS2 || 0).toFixed(2),
  //       wageS3: (+x.wageS3 || 0).toFixed(2),
  //       wageS4: (+x.wageS4 || 0).toFixed(2),
  //       wageS5: (+x.wageS5 || 0).toFixed(2),
  //     }));

  //     let finalData = [];

  //     if (
  //       uploadedData?.allEmployeeList_List &&
  //       Array.isArray(uploadedData.allEmployeeList_List) &&
  //       uploadedData.allEmployeeList_List.length > 0
  //     ) {
  //       finalData = uploadedData.allEmployeeList_List.map((x) => ({
  //         ...x,
  //         wageS1: (+x.wageS1 || 0).toFixed(2),
  //         wageS2: (+x.wageS2 || 0).toFixed(2),
  //         wageS3: (+x.wageS3 || 0).toFixed(2),
  //         wageS4: (+x.wageS4 || 0).toFixed(2),
  //         wageS5: (+x.wageS5 || 0).toFixed(2),
  //       }));

  //       setMonth(uploadedData.monthno?.toString().padStart(2, '0') || '');
  //       setyear(uploadedData.year || '');
  //       setscheduleNo(uploadedData.schedule_no || 0);
  //       setExceptionData(uploadedDataException ?? []);
  //     } else if (location.state?.header) {
  //       finalData = location.state.employees.map((x) => ({
  //         ...x,
  //         wageS1: (+x.wageS1).toFixed(2),
  //         wageS2: (+x.wageS2).toFixed(2),
  //         wageS3: (+x.wageS3).toFixed(2),
  //         wageS4: (+x.wageS4).toFixed(2),
  //         wageS5: (+x.wageS5).toFixed(2),
  //       }));

  //       setMonth(
  //         location.state.header.period_Month.length === 1
  //           ? `0${location.state.header.period_Month}`
  //           : location.state.header.period_Month,
  //       );
  //       setyear(location.state.header.period_year);
  //       setscheduleNo(location.state.header.schedule_NO);

  //       if (
  //         Array.isArray(location.state.popUpList) &&
  //         location.state.popUpList.length > 0 &&
  //         !hasShownImportModal &&
  //         !showImportModal
  //       ) {
  //         setShowImportModal(true);
  //         setImportList(location.state.popUpList);
  //         setHasShownImportModal(true);
  //       }

  //       setExceptionData([]);
  //     } else if (hideToggle === false) {
  //       setExceptionData(uploadedDataException ?? []);
  //     } else {
  //       finalData = loadEmployeeList;
  //       setExceptionData([]);
  //     }

  //     setData(finalData);

  //     const filteredData = finalData.filter((item) => item.isemployeeDirector === false);
  //     const uniquePayPeriods = [...new Set(filteredData.map((item) => item.payPeriod))];
  //     setSelectedOptions(uniquePayPeriods);
  //   },
  //   isExceptionUpdated ? [location.state] : [location.state, loadEmployeeList],
  // );

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpenModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const options = [
    { id: 'checkbox-custom_01', label: 'W - Weekly' },
    { id: 'checkbox-custom_02', label: 'M - Monthly' },
    { id: 'checkbox-custom_03', label: 'E2W - Every Two Weeks' },
    { id: 'checkbox-custom_04', label: '2M - Twice Monthly' },
  ];
  const optionsOther = [
    { id: 'checkbox-custom_01', label: 'W - Weekly', value: 'W' },
    { id: 'checkbox-custom_02', label: 'M - Monthly', value: 'M' },
    { id: 'checkbox-custom_03', label: 'E2W - Every Two Weeks', value: 'E2W' },
    { id: 'checkbox-custom_04', label: '2M - Twice Monthly', value: '2M' },
  ];

  useEffect(() => {
    setSelectedOptions(options.map((option) => option.label));
  }, []);

  const handleLabelClick = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleLabelClickModal = () => {
    setIsOpenModal((prevState) => !prevState);
  };

  const handleCheckAllChange = ({ target: { checked } }) => {
    if (checked) {
      setSelectedOptions(options.map((option) => option.label));
    } else {
      setSelectedOptions([]);
    }
  };

  const handleCheckBoxChange = ({ target: { checked, nextSibling } }) => {
    const value = nextSibling.textContent;

    if (checked) {
      setSelectedOptions((prevOptions) => [...prevOptions, value]);
    } else {
      setSelectedOptions((prevOptions) => prevOptions.filter((option) => option !== value));
    }
  };

  useEffect(() => {
    if (isModalOpenSubmit) {
      setSelectedOptionsOther(optionsOther.map((o) => o.label));
    }
  }, [isModalOpenSubmit]);

  useEffect(() => {
    setSearchTermPeriod('');
    setSearchTermDepartment('');
    setSearchTerm('');
  }, []);

  const handleCheckAllChangeModal = ({ target: { checked } }) => {
    if (checked) {
      setSelectedOptionsOther(optionsOther.map((o) => o.label)); // all options except "All"
    } else {
      setSelectedOptionsOther([]);
    }
  };

  const handleCheckBoxChangeModal = ({ target: { checked, id } }) => {
    const value = optionsOther.find((o) => o.id === id)?.label;

    if (!value) return; // safety check

    if (checked) {
      setSelectedOptionsOther((prev) => [...prev, value]);
    } else {
      setSelectedOptionsOther((prev) => prev.filter((opt) => opt !== value));
    }
  };

  const getLabelTextOther = () => {
    if (selectedOptionsOther.length === 0) return 'Select Pay Period';
    if (selectedOptionsOther.length === optionsOther.length) return 'All';
    return selectedOptionsOther.join(', ');
  };

  const getLabelText = () => {
    if (selectedOptions.length === 0) return 'Select Period';
    if (selectedOptions.length === options.length) return 'All';
    return selectedOptions.join(', ');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  function weekData(empKey, labelType, value) {
    setData((prev) =>
      prev.map((item) => {
        const matchKey = ImportFileDataC3 === false ? item.ssn : item.employeeId;

        if (matchKey === empKey) {
          return {
            ...item,
            [labelType]: value,
          };
        }

        return item;
      }),
    );
  }

  const getEmpKey = (item) => (ImportFileDataC3 === false ? item.ssn : item.employeeId);

  const getEmpFromList = (list, item) =>
    list?.find(
      (emp) => (ImportFileDataC3 === false ? emp.ssn : emp.employeeId) === getEmpKey(item),
    );

  const getEmpFromAllSources = (item) => {
    const primaryList =
      location.state?.employees?.length > 0 ? location.state.employees : loadEmployeeList;

    let emp = getEmpFromList(primaryList, item);

    // ADDON source — SSN based only
    if (!emp && ImportFileDataC3 === false) {
      emp =
        location.state?.uploadedData?.postReq?.allEmployeeList_List?.find(
          (e) => e.ssn === item.ssn,
        ) || null;
    }

    return emp;
  };

  const [filterSSN, setFilterSSN] = useState('');

  const [selectData, setSelectData] = useState(() => {
    const source = location.state?.employees?.length ? location.state.employees : loadEmployeeList;

    if (ImportFileDataC3 === false) {
      return source.map((item) => item.ssn);
    }
    return source.map((item) => item.employeeId);
  });

  useEffect(() => {
    let source = [];

    if (ImportFileDataC3 === false) {
      const allEmpList = location.state?.uploadedData?.postReq?.allEmployeeList_List;

      if (allEmpList?.length > 0) {
        source = allEmpList;
        setSelectData(source.map((item) => item.ssn).filter(Boolean));
      } else if (loadEmployeeList?.length > 0) {
        source = loadEmployeeList;

        setSelectData(source.map((item) => item.ssn || item.employeeId).filter(Boolean));
      } else {
        setSelectData([]);
      }
    } else {
      // employeeId-based selection
      source = location.state?.employees || loadEmployeeList || [];
      setSelectData(source.map((item) => item.employeeId).filter((id) => id > 0));
    }
  }, [loadEmployeeList, location.state, ImportFileDataC3]);

  function selectDataItem(id) {
    setSelectData((prev) => {
      const prevIdsMap = prev.map((item) => item);
      if (prevIdsMap.includes(id)) {
        return prev.filter((item) => item !== id); // Remove item ID
      }
      return [...prev, id];
    });
  }

  const handleSSNChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase()); // Convert to lowercase for case-insensitive search
  };

  const handlePayPeriodChange = (e) => {
    setSearchTermPeriod(e.target.value.toLowerCase()); // Convert to lowercase for case-insensitive search
  };

  const handleDepartSearch = (e) => {
    setSearchTermDepartment(e.target.value.toLowerCase()); // Convert to lowercase for case-insensitive
  };

  const [payPeriods, setPayPeriods] = useState([]);

  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.ssn.toLowerCase().includes(searchTerm) || // Search by SSN
        item.employeeName.toLowerCase().includes(searchTerm), // Search by Employee Name
    );
    const uniquePayPeriods = [...new Set(filtered.map((item) => item.payPeriod))];

    setPayPeriods(uniquePayPeriods);

    //Anubhav Code start
    const filteredData = data.filter((item) => item.isemployeeDirector === false);
    const TheuniquePayPeriods = [...new Set(filteredData.map((item) => item.payPeriod))];
  }, [data, searchTerm]);

  const filteredPayPeriods = payPeriods.filter((period) =>
    (period?.toLowerCase() || '').includes(payPeriodSearch?.toLowerCase() || ''),
  );

  const filteredData = (period, rows = data) => {
    let filtered = rows
      .filter((item) => {
        // Only filter by period if period is provided
        if (period) return item.payPeriod === period;
        return true;
      })
      .filter(
        (item) =>
          item.ssn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    if (searchTermDepartment) {
      filtered = filtered.filter((item) =>
        item.department?.toLowerCase().includes(searchTermDepartment.toLowerCase()),
      );
    }

    if (searchTermPeriod) {
      filtered = filtered.filter((item) =>
        item.payPeriod?.toLowerCase().includes(searchTermPeriod.toLowerCase()),
      );
    }

    if (sortCriteria) {
      filtered = [...filtered].sort((a, b) => {
        if (a[sortCriteria] < b[sortCriteria]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortCriteria] > b[sortCriteria]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      const allIds = data.map((item) => (ImportFileDataC3 === false ? item.ssn : item.employeeId));
      setSelectData(allIds);
    } else {
      // Unselect all employees
      setSelectData([]);
    }
  };

  const handleSort = (criteria) => {
    if (sortCriteria === criteria) {
      // Toggle sorting order if the same column is clicked again
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriteria(criteria);
      setSortOrder('asc');
    }
  };

  const [selectDataJson, setSelectDataJson] = useState([]);

  const previewDataLoad = {
    CompanyId,
    monthno: +month,
    MonthName: month.toString(),
    Year: year,
    IsLevyExempt: false,
    isrecordEdit: false,
    TextChanged: 'rphit',
    ListHavingItems: true,
    User_Name: 'rohit',
    UserID: localStorage.getItem('userID'),

    H_Id: location?.state?.header?.headerID || 0,
  };

  const [previewShow, setPreviewShow] = useState(false);
  const [previewDatapayload, setPreviewDatapayload] = useState([]);
  const [calculateValidation, setCalculateValidation] = useState([]);
  const [saveData, setSaveData] = useState();
  const [previewLoad, setpreviewLoad] = useState(false);
  const tableHeaders =
    calculateValidation && calculateValidation.length > 0
      ? Object.keys(calculateValidation[0])
      : [];

  const selected = exceptionData.filter((item) => item.isSelected);

  const validateAllBonusAndHolidaySaved = () => {
    let missingCount = 0;
    const missingEmployees = [];

    filteredPayPeriods.forEach((period) => {
      const rows = filteredData(period);

      rows.forEach((item) => {
        const needsBonus = item.bonus && Number(item.bonus) > 0;
        const needsHoliday = item.hpay && Number(item.hpay) > 0;

        const bonusSaved = payData.bonus.some((b) => b.ssn === item.ssn);

        const holidaySaved = payData.holiday.some((h) => h.ssn === item.ssn);

        if ((needsBonus && !bonusSaved) || (needsHoliday && !holidaySaved)) {
          missingCount++;
          missingEmployees.push(item.employeeName);
        }
      });
    });

    if (missingCount > 0) {
      setErrorModalMessage(
        `
      Bonus or holiday pay dates are missing for ${missingCount} Employee(s). Please complete the required details.
     `,
      );
      setErrorDataModalOpen(true);
      return false;
    }

    return true;
  };

  const payPeriodMap = {
    W: 'W - Weekly',
    M: 'M - Monthly',
    E2W: 'E2W - Every Two Weeks',
    '2M': '2M - Twice Monthly',
  };

  function preview() {
    const errorMessage = [];
    if (location?.state?.isNilReturn === false) {
      if (month === '') errorMessage.push('Month');
      if (year === '') errorMessage.push('Year');
      const found = CmbPayPeriod.find((item) => item.key === 'All');
      if (found) errorMessage.push('Pay Period');
      if (selectData.length === 0 || !selectData) errorMessage.push('employees');
      if (errorMessage.length) {
        toast.error(`Please Select a ${errorMessage.join(', ').replace(/, ([^,]*)$/, ' & $1')}`);
        return;
      }
    }

    setpreviewLoad(true);

    const selectedItems = [];

    const allSelectedEmployees = data.filter((item) =>
      selectData.includes(ImportFileDataC3 === false ? item.ssn : item.employeeId),
    );

    if (data.length > 0 && allSelectedEmployees.length === 0 && hideToggle === false) {
      toast.error('Please select at least one employee with corrected data.');
      setpreviewLoad(false);
      return;
    }

    if (allSelectedEmployees.length === 0 && hideToggle === false) {
      setExceptionModalMessage('All employee data is incorrect, so you can’t preview it.');
      setPreviewModalOpenNew(true); // open modal even if nothing is selected
      setpreviewLoad(false);
      return;
    }

    const selectedKeys = allSelectedEmployees.map((emp) =>
      ImportFileDataC3 === false ? emp.ssn : emp.employeeId,
    );

    // ================= STEP 3: MATCHED BEMA / FILE EMPLOYEES =================
    const selectedBemaEmployees = bemaListData.filter((item) =>
      selectedKeys.includes(ImportFileDataC3 === false ? item.socSecNum : item.employeeId),
    );

    const transformedData = allSelectedEmployees.map((filterItem) => ({
      BirthDate: filterItem.birthDate,
      C3HEADERID: filterItem.c3HEADERID,
      Date_Joining: filterItem.date_Joining === null ? null : filterItem.date_Joining,
      Date_terminated: filterItem.date_terminated === null ? null : filterItem.date_terminated,
      DirRemarks: filterItem.dirRemarks,
      emp_add_remove: filterItem.emp_add_remove,
      EmployeeId: filterItem.employeeId,
      // Department: filterItem.department === null ? '' : filterItem.department,
      Department: filterItem.department || '',
      EmployeeName: filterItem.employeeName,
      EmpSalary: filterItem.empSalary,
      HPay_Week1: filterItem.hPay_Week1,
      HPay_Week2: filterItem.hPay_Week2,
      HPay_Week3: filterItem.hPay_Week3,
      HPay_Week4: filterItem.hPay_Week4,
      HPay_Week5: filterItem.hPay_Week5,
      PayFreq: filterItem.payFreq,
      SSN: filterItem.ssn,
      T_C_Date: filterItem.t_C_Date === null ? '' : filterItem.t_C_Date,
      // holidayPayDate: filterItem.holidayPayDate === null ? '' : filterItem.holidayPayDate,
      wage_Amt: filterItem.wage_Amt,
      WAGES1: filterItem.wageS1,
      WAGES2: filterItem.wageS2,
      WAGES3: filterItem.wageS3,
      WAGES4: filterItem.wageS4,
      WAGES5: filterItem.wageS5,
      WEEK1: filterItem.weeK1,
      WEEK2: filterItem.weeK2,
      WEEK3: filterItem.weeK3,
      WEEK4: filterItem.weeK4,
      WEEK5: filterItem.weeK5,
      Bonus: filterItem.bonus,
      HPAY: filterItem.hpay,
      Remarks: filterItem.remarks,
      isLevyExempt: filterItem.isLevyExempt,
      tempWAGES1: filterItem.tempWAGES1,
      tempWAGES2: filterItem.tempWAGES2,
      tempWAGES3: filterItem.tempWAGES3,
      tempWAGES4: filterItem.tempWAGES4,
      tempWAGES5: filterItem.tempWAGES5,
      isemployeeDirector: filterItem.isemployeeDirector,
      directorWagesPAY: filterItem.directorWagesPAY,
    }));

    setSelectDataJson(transformedData);

    const addFileEmp = selectedBemaEmployees.map((emp) => ({
      ...emp,
      isemployeeDirector: emp.isemployeeDirector ? 'true' : 'false',
      directorWagesPAY: emp.directorWagesPAY?.toString() || '',
      isLevyExempt: emp.isLevyExempt?.toString() || '',
    }));

    // Dynamically generate CmbPayPeriod from actual employee data
    // Extract unique pay periods from the original data (before transformation)
    const uniquePayPeriods = new Map();
    allSelectedEmployees.forEach((emp) => {
      if (emp.payPeriod && emp.payFreq) {
        // Use payPeriod as key (e.g., "W - Weekly") and payFreq as value (e.g., "W")
        if (!uniquePayPeriods.has(emp.payPeriod)) {
          uniquePayPeriods.set(emp.payPeriod, emp.payFreq);
        }
      } else if (emp.payFreq) {
        // Fallback: map payFreq to payPeriod using payPeriodMap
        const mappedPayPeriod = payPeriodMap[emp.payFreq] || emp.payFreq;
        if (!uniquePayPeriods.has(mappedPayPeriod)) {
          uniquePayPeriods.set(mappedPayPeriod, emp.payFreq);
        }
      }
    });

    const dynamicCmbPayPeriod = Array.from(uniquePayPeriods.entries()).map(([key, value]) => ({
      key,
      value,
    }));

    const apiLoadData = {
      ...previewDataLoad,
      CmbPayPeriod: dynamicCmbPayPeriod.length > 0 ? dynamicCmbPayPeriod : CmbPayPeriod,
      AllEmployeeList_List: transformedData,
      is_preview: true,
      isSave: false,
      IsLevyExempt: (localStorage.getItem('isLevyExempt') === 'true') === true,
      isImportC3file,
      schedule_no: scheduleNo,
      OrderName: sortCriteria,
      OrderKey: sortOrder === 'asc' ? 'desc' : 'asc',
      isNilReturn: isActive,
      c3FilePath: uploadedFileData,
      footerCalcuations: footerCalculate,
      ...(ImportFileDataC3 === false ? { addFileEmp } : {}),
      bonusObj: payData.bonus,
      holidayPayDates: payData.holiday,
    };

    dispatch(PreviewPost(apiLoadData))
      .unwrap()
      .then((response) => {
        if (response?.previewResponse?.status === true) {
          setPreviewShow(true);
          setPreviewDatapayload(response?.previewResponse?.data);

          setCalculateValidation(response?.previewResponse?.calculationsValidation);
          setSaveData(apiLoadData);
          setpreviewLoad(false);
        } else {
          setpreviewLoad(false);
          toast.error(response?.previewResponse.message);
        }
      })
      .catch((error) => {
        if (error) {
          toast.error(error);
        }
      })
      .finally(() => {
        setpreviewLoad(false);
      });
  }

  const CloseModalAll = () => {
    setHeaderid('');
    setIsModalOpen(!isModalOpen);
  };

  const toggleModal = () => {
    setIsModalOpenSubmit(!isModalOpenSubmit);
  };

  const handleGenerateC3Click = async () => {
    if (!monthOther || !yearOther) {
      toast.error('Please select Month and Year.', {});
      return;
    }

    if (selectedOptionsOther.length === 0) {
      toast.error('Please select at least one Pay Period.', {});
      return;
    }

    const allSelected = selectedOptionsOther.length === optionsOther.length;

    const selectedObjects = optionsOther.filter((opt) => selectedOptionsOther.includes(opt.label));

    const payload = {
      month: monthOther,
      year: yearOther,
      CmbPayPeriod: allSelected
        ? optionsOther.map((opt) => ({ key: opt.label, value: opt.value || opt.label }))
        : selectedObjects.map((opt) => ({ key: opt.label, value: opt.value || opt.label })),
    };

    try {
      setPageLoading(true);
      const res = await debouncedApiCallNew(payload);

      if (res?.status === 200 || res?.success) {
        setSelectedOptionsOther([]);
        setMonthOther('');
        setYearOther('');
      }

      setIsModalOpenSubmit(false);
      setShowNoRecords(false);
    } catch (error) {
      console.error('Something went wrong:', error);
    } finally {
      setPageLoading(true);
    }
  };

  const handleNoClick = () => {
    setShowApiMsg(false);
    setApiMsgNew('');
    setShowYesNoButtons(false);
    setShowBackButton(true);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowApiMsg(true);
    setShowYesNoButtons(true);
    setShowBackButton(false);
    setShowForm(false);
  };

  const AlreadySubmit = () => {
    setIsModalOpenSubmit(false);
    setShowNoRecords(false);
  };

  function save() {
    setSaveLoad(true);

    const allSelectedEmployees = data.filter((item) =>
      selectData.includes(ImportFileDataC3 === false ? item.ssn : item.employeeId),
    );

    if (data.length > 0 && allSelectedEmployees.length === 0 && hideToggle === false) {
      toast.error('Please select at least one employee with corrected data.');
      setSaveLoad(false);
      return;
    }

    if (allSelectedEmployees.length === 0 && hideToggle === false) {
      setExceptionModalMessage('All employee data is incorrect, so you can’t save it.');
      setPreviewModalOpenNew(true); // open modal even if nothing is selected
      setIsModalOpen(false);
      setSaveLoad(false);
      return;
    }

    const selectedKeys = allSelectedEmployees.map((emp) =>
      ImportFileDataC3 === false ? emp.ssn : emp.employeeId,
    );

    // ================= STEP 3: MATCHED BEMA / FILE EMPLOYEES =================
    const selectedBemaEmployees = bemaListData.filter((item) =>
      selectedKeys.includes(ImportFileDataC3 === false ? item.socSecNum : item.employeeId),
    );

    const transformedData = allSelectedEmployees.map((filterItem) => ({
      BirthDate: filterItem.birthDate,
      C3HEADERID: filterItem.c3HEADERID,
      Date_Joining: filterItem.date_Joining === null ? null : filterItem.date_Joining,
      Date_terminated: filterItem.date_terminated === null ? null : filterItem.date_terminated,
      DirRemarks: filterItem.dirRemarks,
      emp_add_remove: filterItem.emp_add_remove,
      EmployeeId: filterItem.employeeId,
      EmployeeName: filterItem.employeeName,
      EmpSalary: filterItem.empSalary,
      HPay_Week1: filterItem.hPay_Week1,
      HPay_Week2: filterItem.hPay_Week2,
      HPay_Week3: filterItem.hPay_Week3,
      HPay_Week4: filterItem.hPay_Week4,
      HPay_Week5: filterItem.hPay_Week5,
      PayFreq: filterItem.payFreq,
      SSN: filterItem.ssn,
      T_C_Date: filterItem.t_C_Date === null ? '' : filterItem.t_C_Date,
      // holidayPayDate: filterItem.holidayPayDate === null ? '' : filterItem.holidayPayDate,
      wage_Amt: filterItem.wage_Amt,
      WAGES1: filterItem.wageS1,
      WAGES2: filterItem.wageS2,
      WAGES3: filterItem.wageS3,
      WAGES4: filterItem.wageS4,
      WAGES5: filterItem.wageS5,
      WEEK1: filterItem.weeK1,
      WEEK2: filterItem.weeK2,
      WEEK3: filterItem.weeK3,
      WEEK4: filterItem.weeK4,
      WEEK5: filterItem.weeK5,
      Bonus: filterItem.bonus,
      HPAY: filterItem.hpay,
      Remarks: filterItem.remarks,
      isLevyExempt: filterItem.isLevyExempt,
      tempWAGES1: filterItem.tempWAGES1,
      tempWAGES2: filterItem.tempWAGES2,
      tempWAGES3: filterItem.tempWAGES3,
      tempWAGES4: filterItem.tempWAGES4,
      tempWAGES5: filterItem.tempWAGES5,
      isemployeeDirector: filterItem.isemployeeDirector,
      directorWagesPAY: filterItem.directorWagesPAY,
    }));

    setSelectDataJson(transformedData);

    const addFileEmp = selectedBemaEmployees.map((emp) => ({
      ...emp,
      isemployeeDirector: emp.isemployeeDirector ? 'true' : 'false',
      directorWagesPAY: emp.directorWagesPAY?.toString() || '',
      isLevyExempt: emp.isLevyExempt?.toString() || '',
    }));

    // Dynamically generate CmbPayPeriod from actual employee data
    // Extract unique pay periods from the original data (before transformation)
    const uniquePayPeriods = new Map();
    allSelectedEmployees.forEach((emp) => {
      if (emp.payPeriod && emp.payFreq) {
        // Use payPeriod as key (e.g., "W - Weekly") and payFreq as value (e.g., "W")
        if (!uniquePayPeriods.has(emp.payPeriod)) {
          uniquePayPeriods.set(emp.payPeriod, emp.payFreq);
        }
      } else if (emp.payFreq) {
        // Fallback: map payFreq to payPeriod using payPeriodMap
        const mappedPayPeriod = payPeriodMap[emp.payFreq] || emp.payFreq;
        if (!uniquePayPeriods.has(mappedPayPeriod)) {
          uniquePayPeriods.set(mappedPayPeriod, emp.payFreq);
        }
      }
    });

    const dynamicCmbPayPeriod = Array.from(uniquePayPeriods.entries()).map(([key, value]) => ({
      key,
      value,
    }));

    const apiLoadData = {
      ...previewDataLoad,
      CmbPayPeriod: dynamicCmbPayPeriod.length > 0 ? dynamicCmbPayPeriod : CmbPayPeriod,
      AllEmployeeList_List: transformedData,
      is_preview: false,
      isSave: true,
      isImportC3file,
      IsLevyExempt: localStorage.getItem('isLevyExempt') === 'true',
      schedule_no: scheduleNo,
      OrderName: sortCriteria,
      OrderKey: sortOrder === 'asc' ? 'desc' : 'asc',
      isNilReturn: isActive,
      c3FilePath: uploadedFileData,
      ...(ImportFileDataC3 === false ? { addFileEmp } : {}),
      bonusObj: payData.bonus,
      holidayPayDates: payData.holiday,
    };

    dispatch(PreviewPost(apiLoadData))
      .unwrap()
      .then((response) => {
        if (response?.previewResponse?.status === true) {
          if (hideToggle === false) {
            navigate('/apps/ImportC3/Generation');
          } else {
            navigate('/apps/C3/C3Generation');
          }

          setSaveLoad(false);
          setPayData({ bonus: [], holiday: [] });
        } else {
          setSaveLoad(false);
          toast.error(response?.previewResponse.message);
        }
      })
      .catch((error) => {
        if (error) {
          toast.error(error);
          setSaveLoad(false);
        }
      });
  }

  const checkC3exists = () => {
    const errorMessage = [];
    if (location?.state?.isNilReturn === false) {
      if (month === '') errorMessage.push('Month');
      if (year === '') errorMessage.push('Year');
      const found = CmbPayPeriod.find((item) => item.key === 'All');
      if (found) errorMessage.push('Pay Period');
      if (selectData.length === 0) errorMessage.push('employees');
      if (errorMessage.length) {
        toast.error(`Please Select  ${errorMessage.join(', ').replace(/, ([^,]*)$/, ' & $1')}`);
        return;
      }
    }
    setSaveLoad(true);

    dispatch(checkC3Created({ CompanyId, month, year }))
      .unwrap()
      .then((response) => {
        const res = response?.checkC3CreatedResponse;

        if (res?.status === true) {
          setIsModalOpen((prev) => !prev);
          setSaveMessage(res.message || '');
          setHeaderid(res.data || '');
          setSaveLoad(false); // ✅ End loading here
        } else {
          setHeaderid('');
          setSaveLoad(false); // ✅ End loading before calling save
          save(); // 👈 let save() handle its own loading
        }
      })
      .catch((error) => {
        if (error?.response?.status === 500) {
          toast.error('Internal Server Error (500). Please try again later.');
        }
        setSaveLoad(false);
      });
  };

  function handleSaveClick() {
    if (hideToggle === false) {
      if (!validateAllBonusAndHolidaySaved()) return;
    }
    const selectedRows = exceptionData.filter((x) => x.isSelected);
    if (selectedRows.length > 0) {
      setErrorModalMessage(
        'Please deselect the employees who are not associated with you before saving.',
      );
      setErrorDataModalOpen(true);
      return;
    }

    if (exceptionData.length > 0) {
      setConfirmationMessage('Some employees have exceptions. Do you want to continue saving?');
      setConfirmationModalOpen(true); // Show new confirmation modal
      return;
    }

    checkC3exists();
  }

  function handleConfirmSave() {
    setConfirmationModalOpen(false); // Close modal
    checkC3exists(); // Proceed with save
  }

  function handleCancelSave() {
    setConfirmationModalOpen(false); // Close modal only
  }

  useEffect(() => {}, [selectData]);

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const [employeessn, setEmployeessn] = useState('');
  const [payDates, setPayDate] = useState('');
  const [amount, setAmount] = useState('');
  const [payIds, setPayId] = useState('');

  const { CList, employee } = useSelector((state) => state.cSlice);

  function saveBonusApi(event) {
    if (event) event.preventDefault();

    let isValid = true; // Flag to track validation

    // Validation checks
    if (!employeessn) {
      toast.error('Please Select an Employee');
      isValid = false;
    }
    if (!payDates) {
      toast.error('Please Select a Payment Date');
      isValid = false;
    }
    if (!amount) {
      toast.error('Please Enter an Amount');
      isValid = false;
    }

    if (!isValid) return; // Stop execution if validation fails

    // Dispatch API call
    dispatch(saveBonus({ employeessn, payDate: payDates, amount, companyId: CompanyId }))
      .unwrap()
      .then((response) => {
        // Ensure response is valid
        if (response && response.saveBonusResponse) {
          toast.success(response.saveBonusResponse.message);

          // Debugging: Log modal state before changing it

          // Close modal safely
          setModal((prevModal) => !prevModal);

          // Reload employee data

          if (location.state) {
            dispatch(editC3EmployeeListing({ headerId: location.state.header.headerID, CompanyId }))
              .unwrap()
              .then((responses) => {
                setData(responses.editC3EmployeeResponse.employees);
                // navigate('/apps/C3/Add-C3Generation', { state: response.editC3EmployeeResponse });
                // setEditeLoad(false);
              })
              .catch((e) => {
                // setEditeLoad(false);
                toast.error('something went wrong');
              });
          } else {
            dispatch(loadEmployee(apiLoad));
          }
        }
      })
      .catch((error) => {
        console.error('Something went wrong:', error);
      });
  }

  const { HolidayList, EmployeeAndWokinglist } = useSelector((state) => state.holidaySlice || {});
  const [isWorkingDirector, setisWorkingDirector] = useState(false);
  const [empName, setEmpName] = useState('');
  const [holidayPayWithLeave, setHolidayPayWithLeave] = useState(true);
  const [leaveType, setLeaveType] = useState('');
  const [amounts, setAmounts] = useState('');
  const [fromDate, setFromdate] = useState(null);
  const [toDate, setTodate] = useState(null);
  const [payDatess, setPayDatess] = useState(null);
  const [descother, setDescother] = useState('');
  const [holidaypayId, setholidaypayId] = useState(0);
  const [hmodals, setHModals] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    dispatch(
      employeeAndWokingEmployeelist({ CompanyId, isEmployeeDirector: isWorkingDirector ? 1 : 0 }),
    );
  }, [isWorkingDirector]);

  const Htoggles = () => {
    setisWorkingDirector(false);
    setEmpName('');
    setHolidayPayWithLeave(true);
    setLeaveType(true);
    setAmounts('');
    setFromdate(null);
    setTodate(null);
    setPayDatess(null);
    setDescother('');
    setHModals(!hmodals);
    setIsEdit(false);
  };

  const [editeLoad, setEditeLoad] = useState(false);
  const [editActive, seteditActive] = useState('');

  const hapiLoad = {
    holidaypayId,
    emp_Name: empName,
    descother,
    holidayPayWithLeave,
    leaveType,
    from_date: fromDate,
    to_date: toDate,
    isWorkingDirector,
    payDate: payDatess,
    holidayPayLeaveOther: !holidayPayWithLeave,
    amount: amounts,
    companyId: CompanyId,
    employeinmode: 2,
  };

  function setHolidayData(holidayPayId) {
    setEditeLoad(true);
    seteditActive(holidayPayId);
    setIsEdit(true);
    dispatch(getAllHolidayPayById({ holidayPayId, CompanyId, holidayPayView: false }))
      .unwrap()
      .then((response) => {
        if (
          response?.HolidayPayByIdResponse?.status === false ||
          response?.HolidayPayByIdResponse?.statuscode === 400
        ) {
          toast.warn(response?.HolidayPayByIdResponse?.message || 'Warning');
          setEditeLoad(false);
          setIsEdit(false);
          return; // stop further processing
        }
        setisWorkingDirector(response.HolidayPayByIdResponse.isWorkingDirector);
        setEmpName(response.HolidayPayByIdResponse.emp_Name);
        setHolidayPayWithLeave(response.HolidayPayByIdResponse.holidayPayWithLeave);
        setLeaveType(response.HolidayPayByIdResponse.leaveType);
        setAmounts(response.HolidayPayByIdResponse.amount);
        setFromdate(response.HolidayPayByIdResponse.from_date);
        setTodate(response.HolidayPayByIdResponse.to_date);
        setPayDatess(response.HolidayPayByIdResponse.payDate);
        setDescother(response.HolidayPayByIdResponse.descother);
        setholidaypayId(response.HolidayPayByIdResponse.holidayPayId);
        setEditeLoad(false);
        setHModals(!hmodals);
      })
      .catch((e) => {
        setEditeLoad(false);
        setIsEdit(false);
      });
  }

  function editHolidayData() {
    let isValid = true; // Flag to track if all conditions are valid

    if (empName === '') {
      toast.error('Please Select an Employee');
      isValid = false;
    }

    if (holidayPayWithLeave) {
      if (amounts === '') {
        toast.error('Please Enter an amount');
        isValid = false;
      }

      if (!fromDate || !toDate) {
        toast.error('Please Enter a From Date & To Date');
        isValid = false;
      } else if (new Date(fromDate) > new Date(toDate)) {
        toast.error('From Date cannot be greater than To Date');
        isValid = false;
      }
    } else {
      if (leaveType === '') {
        toast.error('Please Select leave Type');
        isValid = false;
      }

      if (!leaveType || leaveType === 'Select') {
        toast.error('Please select a leave Type');
        isValid = false;
      }

      if (amounts === '') {
        toast.error('Please Enter an amount');
        isValid = false;
      }

      if (payDatess === null) {
        toast.error('Please Enter a valid Pay Date');
        isValid = false;
      }
    }

    if (isValid) {
      dispatch(editHoliday(hapiLoad))
        .unwrap()
        .then((response) => {
          toast.success(response.editHolidayResponse.message);
          dispatch(loadEmployee(apiLoad));
          Htoggles();
        })
        .catch((e) => {
          toast.success('something went wrong');
          setIsEdit(false);
        });
    }
  }

  const formatDate = (date) => {
    if (date) {
      return date.toISOString().split('T')[0];
    }
    return null;
  };

  const handleDateChange = (date) => {
    setPayDatess(date ? moment(date).format('YYYY-MM-DD') : null);
  };

  const handleFromDate = (date) => {
    setFromdate(date ? moment(date).format('YYYY-MM-DD') : null);
  };

  const handleToDate = (date) => {
    setTodate(date ? moment(date).format('YYYY-MM-DD') : null);
  };

  useEffect(() => {
    if (location.state && location.state.popUpList && location.state.popUpList.length > 0) {
      setHasShownImportModal(false);
    }
  }, [location.state]);

  useEffect(() => {
    if (location?.state?.isNilReturn !== undefined) {
      setIsActive(location.state.isNilReturn);
    }
  }, [location?.state?.isNilReturn]);

  if (previewShow) {
    return (
      <PerviewC3
        data={previewDatapayload}
        saveDataLoad={saveData}
        ValidateData={calculateValidation}
        BimaDataList={bemaListData}
        ErrorDataAPI={selected}
        previewShow={setPreviewShow}
        validateAllBonusAndHolidaySaved={validateAllBonusAndHolidaySaved}
        errorModalMessage={errorModalMessage}
        hideToggle={hideToggle}
        isActive={!isActive}
      />
    );
  }

  const handleConfirmImport = async (selectedEmployees) => {
    setIsLoading(true);

    if (location.state) {
      try {
        setShowImportModal(false);
        setHasShownImportModal(true);
        const responses = await dispatch(
          editC3EmployeeListing({
            headerId: location.state.header.headerID,
            CompanyId,
            popUpList: selectedEmployees,
          }),
        ).unwrap();

        const employeeList = responses.editC3EmployeeResponse.employees;

        const formattedEmployeeList = employeeList.map((x) => ({
          ...x,
          wageS1: (+x.wageS1).toFixed(2),
          wageS2: (+x.wageS2).toFixed(2),
          wageS3: (+x.wageS3).toFixed(2),
          wageS4: (+x.wageS4).toFixed(2),
          wageS5: (+x.wageS5).toFixed(2),
        }));

        setData(formattedEmployeeList);
        setSelectData(formattedEmployeeList.map((item) => item.employeeId));

        const importedPayPeriods = [
          ...new Set(formattedEmployeeList.map((item) => item.payPeriod)),
        ];
        const updatedSelectedOptions = [...new Set([...selectedOptions, ...importedPayPeriods])];

        setSelectedOptions(updatedSelectedOptions);
        toast.success('Successfully added!');
        if (location.state) {
          location.state.employees = formattedEmployeeList;
          location.state.popUpList = [];
        }
        dispatch({
          type: 'CGeneration/loadEmployee/fulfilled',
          payload: {
            loadEmployeeResponse: {
              employees: formattedEmployeeList,
              status: true,
              message: 'Employees imported successfully',
            },
          },
        });

        if (formattedEmployeeList.length > 0) {
          toast.success('Successfully added!');
        }
      } catch (error) {
        console.error('Something went wrong:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowImportModal(false);
      setHasShownImportModal(true);
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setIsActive((prev) => !prev);
    setIsNill(true);
  };

  const AllNill = async () => {
    const apiData = { CompanyId, month, year, isNilReturn: isActive, dataLoad: CmbPayPeriod };

    try {
      setNillSave(true);

      const response = await dispatch(loadEmployeeNill(apiData)).unwrap();

      if (response?.previewResponse?.status === true) {
        setIsNill(false);
      }

      const editResponse = await dispatch(
        editC3EmployeeListing({
          headerId: location.state.header.headerID,
          CompanyId,
          isNilReturn: isActive,
        }),
      ).unwrap();

      const formattedEmployees = (editResponse?.editC3EmployeeResponse?.employees ?? []).map(
        (x) => ({
          ...x,
          wageS1: (+x.wageS1).toFixed(2),
          wageS2: (+x.wageS2).toFixed(2),
          wageS3: (+x.wageS3).toFixed(2),
          wageS4: (+x.wageS4).toFixed(2),
          wageS5: (+x.wageS5).toFixed(2),
        }),
      );
      setData(formattedEmployees);

      setIsNill(false);
    } catch (error) {
      // toast.error('An error occurred while saving data.');
    } finally {
      setNillSave(false);
      setIsNill(false);
    }
  };

  const CloseModalNill = () => {
    setIsNill(!isNill);
    setIsActive(!isActive);
  };

  const getBimaEmployeeBySSN = (ssn) => {
    return bemaListData.find((emp) => String(emp.socSecNum) === String(ssn));
  };

  const handleExceptionChange = (index, field, value) => {
    setExceptionData((prev) => {
      if (!prev || prev.length === 0) return prev;

      const updated = [...prev];

      if (index < 0 || index >= updated.length) return prev;

      const currentRow = updated[index];

      // Prevent selecting rows with "Employee data not found in our system" or "Duplicate SSN found" messages
      if (field === 'isSelected' && value === true) {
        if (
          currentRow.validateMsg === 'Employee data not found in our system' ||
          (currentRow.validateMsg && currentRow.validateMsg.includes('Duplicate SSN found'))
        ) {
          return prev; // Don't update if trying to select a row with this error
        }
      }

      const newPayPeriod =
        field === 'payFreq' && value ? payPeriodMap[value] : currentRow.payPeriod;

      updated[index] = {
        ...currentRow,
        [field]: value,
        payPeriod: newPayPeriod,
      };

      return updated;
    });
  };

  const handleSelectAllExceptions = (checked) => {
    setExceptionData((prev) =>
      prev.map((ex) => {
        // Don't select rows with "Employee data not found in our system" or "Duplicate SSN found" messages
        if (
          ex.validateMsg === 'Employee data not found in our system' ||
          (ex.validateMsg && ex.validateMsg.includes('Duplicate SSN found'))
        ) {
          return { ...ex, isSelected: false };
        }
        return {
          ...ex,
          isSelected: checked,
        };
      }),
    );
  };

  const moveExceptionToMain = (index) => {
    const fixedRow = exceptionData[index];
    if (!fixedRow) return;

    setExceptionData((prev) => prev.filter((_, i) => i !== index));

    setData((prev) => [...prev, fixedRow]);

    setSelectData((prev) => [...new Set([...prev, fixedRow.employeeId])]);
  };

  const updateExceptionRow = async (row) => {
    const duplicate =
      exceptionData.some((r) => r.ssn === row.ssn && r.employeeId !== row.employeeId) ||
      data.some((r) => r.ssn === row.ssn && r.employeeId !== row.employeeId);

    if (duplicate) {
      toast.error('SSN already exists in another row!');
      return;
    }

    if (!row.payFreq) {
      toast.error('Please select Pay Period!');
      return;
    }
    if (!row.ssn) {
      toast.error('SSN is required!');
      return;
    }
    if (!row.employeeName) {
      toast.error('Employee Name is required!');
      return;
    }

    try {
      setLoadingException(row.ssn);

      const payload = {
        contid: row.contid || 0,
        c3HEADERID: row.c3HEADERID || 0,
        ssn: row.ssn,
        ssnd: row.ssnd,
        employeeId: row.employeeId,
        employeeName: row.employeeName,
        period_Month: row.period_Month,
        period_year: row.period_year,
        payFreq: row.payFreq,
        isSelectedWEEK1: String(row.weeK1),
        isSelectedWEEK2: String(row.weeK2),
        isSelectedWEEK3: String(row.weeK3),
        isSelectedWEEK4: String(row.weeK4),
        isSelectedWEEK5: String(row.weeK5),
        empSalary: row.empSalary,
        wage_Amt: row.wage_Amt,
        wageS1: row.wageS1,
        wageS2: row.wageS2,
        wageS3: row.wageS3,
        wageS4: row.wageS4,
        wageS5: row.wageS5,
        tempWAGES1: row.tempWAGES1,
        tempWAGES2: row.tempWAGES2,
        tempWAGES3: row.tempWAGES3,
        tempWAGES4: row.tempWAGES4,
        tempWAGES5: row.tempWAGES5,
        hpay: row.hpay,
        otherPAY: row.otherPAY,
        directorWagesPAY: row.directorWagesPAY,
        isHPAY: String(row.isHPAY),
        bonus: row.bonus,
        totalWadeges: row.totalWadeges,
        weeK1: row.weeK1,
        weeK2: row.weeK2,
        weeK3: row.weeK3,
        weeK4: row.weeK4,
        weeK5: row.weeK5,
        selectedTypeWEEK1: row.selectedTypeWEEK1,
        selectedTypeWEEK2: row.selectedTypeWEEK2,
        selectedTypeWEEK3: row.selectedTypeWEEK3,
        selectedTypeWEEK4: row.selectedTypeWEEK4,
        selectedTypeWEEK5: row.selectedTypeWEEK5,
        isWeekfifth: row.isWeekfifth,
        emp_add_remove: row.emp_add_remove,
        isRemarkDisable: row.isRemarkDisable,
        isemployeeDirector: row.isemployeeDirector,
        isLevyExempt: row.isLevyExempt,
        levyee: row.levyee,
        socialSecurity: row.socialSecurity,
        sS_Fines: row.sS_Fines,
        sS_Employee: row.sS_Employee,
        sS_Employer: row.sS_Employer,
        levy_Penalty: row.levy_Penalty,
        servayance: row.servayance,
        servayancE_PENALTY: row.servayancE_PENALTY,
        date_Joining: row.date_Joining,
        date_terminated: row.date_terminated,
        birthDate: row.birthDate,
        t_C_Date: row.t_C_Date,
        remarks: row.remarks,
        dirRemarks: row.dirRemarks,
        department: row.department,
        payPeriod: row.payPeriod,
        hPay_Week1: row.hPay_Week1,
        hPay_Week2: row.hPay_Week2,
        hPay_Week3: row.hPay_Week3,
        hPay_Week4: row.hPay_Week4,
        hPay_Week5: row.hPay_Week5,
        holidayPayId: row.holidayPayId,
        noteS_TABLE_RECORD_ID: row.noteS_TABLE_RECORD_ID,
      };

      const response = await dispatch(
        UpdateExceptionRow({
          userId: Unique,
          companyId: Regular,
          row: payload,
        }),
      ).unwrap();

      const updatedRow = response?.UpdateExceptionRowResponse?.data?.[0];
      if (updatedRow) {
        setModalData({
          formData: updatedRow,
          success: [updatedRow],
          error: [],
          message: 'Row updated successfully',
        });
        setModalGenerated(true);

        setExceptionData((prev) => prev.filter((r) => String(r.ssn) !== String(updatedRow.ssn)));
        // setExceptionData((prev) => [...prev, updatedRow]);
        setErrorExceptionData((prev) => {
          const filtered = prev.filter((r) => String(r.ssn) !== String(updatedRow.ssn));
          return filtered.length > 0 ? filtered : [];
        });

        setData((prev) => [
          ...prev,
          {
            ...updatedRow,
            wageS1: (+updatedRow.wageS1).toFixed(2),
            wageS2: (+updatedRow.wageS2).toFixed(2),
            wageS3: (+updatedRow.wageS3).toFixed(2),
            wageS4: (+updatedRow.wageS4).toFixed(2),
            wageS5: (+updatedRow.wageS5).toFixed(2),
          },
        ]);
        setSelectData((prev) => [...new Set([...prev, updatedRow.employeeId])]);
        const mergedCmbPayPeriod = [
          ...CmbPayPeriod,
          { key: updatedRow.payPeriod, value: updatedRow.payFreq }, // new value
        ];

        // Update state
        setCmbPayPeriod(mergedCmbPayPeriod);
        setIsExceptionUpdated(true);
        toast.success(
          response?.UpdateExceptionRowResponse?.message || 'Exception row updated successfully',
        );
        setSearchTermPeriod('');
        setSearchTermDepartment('');
        setSearchTerm('');

        // setExceptionData([]);
        // setErrorExceptionData([]);
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      // const errorRow = err?.data?.data?.[0] || {};
      // Get first error row from either structure
      const errorRow =
        (err?.data?.data?.length ? err.data.data : err?.data?.length ? err.data : [])?.[0] || {};

      setExceptionData((prev) =>
        prev.map((r) =>
          String(r.ssn) === String(errorRow.ssn)
            ? { ...r, validateMsg: errorRow.validateMsg || 'Validation failed' }
            : r,
        ),
      );

      setModalData({
        formData: errorRow || modalData.formData,
        success: [],
        error: errorRow ? [errorRow] : [],
        message: 'Validation failed',
      });
      setModalGenerated(true);
      // toast.error(err.message);
    } finally {
      setLoadingException(null);
    }
  };

  const addNewEmployee = async (row) => {
    const duplicate =
      exceptionData.some((r) => r.ssn === row.ssn && r.employeeId !== row.employeeId) ||
      data.some((r) => r.ssn === row.ssn && r.employeeId !== row.employeeId);

    if (duplicate) {
      toast.error('SSN already exists in another row!');
      return; // Stop execution if duplicate
    }

    if (!row.payFreq) {
      toast.error('Please select Pay Period!');
      return;
    }
    if (!row.ssn) {
      toast.error('SSN is required!');
      return;
    }
    if (!row.employeeName) {
      toast.error('Employee Name is required!');
      return;
    }

    try {
      setLoadingException(row.ssn);

      const payload = {
        contid: row.contid || 0,
        c3HEADERID: row.c3HEADERID || 0,
        ssn: row.ssn,
        ssnd: row.ssnd,
        employeeId: row.employeeId,
        employeeName: row.employeeName,
        period_Month: row.period_Month,
        period_year: row.period_year,
        payFreq: row.payFreq,
        isSelectedWEEK1: String(row.weeK1),
        isSelectedWEEK2: String(row.weeK2),
        isSelectedWEEK3: String(row.weeK3),
        isSelectedWEEK4: String(row.weeK4),
        isSelectedWEEK5: String(row.weeK5),
        empSalary: row.empSalary,
        wage_Amt: row.wage_Amt,
        wageS1: row.wageS1,
        wageS2: row.wageS2,
        wageS3: row.wageS3,
        wageS4: row.wageS4,
        wageS5: row.wageS5,
        tempWAGES1: row.tempWAGES1,
        tempWAGES2: row.tempWAGES2,
        tempWAGES3: row.tempWAGES3,
        tempWAGES4: row.tempWAGES4,
        tempWAGES5: row.tempWAGES5,
        hpay: row.hpay,
        otherPAY: row.otherPAY,
        directorWagesPAY: row.directorWagesPAY,
        isHPAY: String(row.isHPAY),
        bonus: row.bonus,
        totalWadeges: row.totalWadeges,
        weeK1: row.weeK1,
        weeK2: row.weeK2,
        weeK3: row.weeK3,
        weeK4: row.weeK4,
        weeK5: row.weeK5,
        selectedTypeWEEK1: row.selectedTypeWEEK1,
        selectedTypeWEEK2: row.selectedTypeWEEK2,
        selectedTypeWEEK3: row.selectedTypeWEEK3,
        selectedTypeWEEK4: row.selectedTypeWEEK4,
        selectedTypeWEEK5: row.selectedTypeWEEK5,
        isWeekfifth: row.isWeekfifth,
        emp_add_remove: row.emp_add_remove,
        isRemarkDisable: row.isRemarkDisable,
        isemployeeDirector: row.isemployeeDirector,
        isLevyExempt: row.isLevyExempt,
        levyee: row.levyee,
        socialSecurity: row.socialSecurity,
        sS_Fines: row.sS_Fines,
        sS_Employee: row.sS_Employee,
        sS_Employer: row.sS_Employer,
        levy_Penalty: row.levy_Penalty,
        servayance: row.servayance,
        servayancE_PENALTY: row.servayancE_PENALTY,
        date_Joining: row.date_Joining,
        date_terminated: row.date_terminated,
        birthDate: row.birthDate,
        t_C_Date: row.t_C_Date,
        remarks: row.remarks,
        dirRemarks: row.dirRemarks,
        department: row.department,
        payPeriod: row.payPeriod,
        hPay_Week1: row.hPay_Week1,
        hPay_Week2: row.hPay_Week2,
        hPay_Week3: row.hPay_Week3,
        hPay_Week4: row.hPay_Week4,
        hPay_Week5: row.hPay_Week5,
        holidayPayId: row.holidayPayId,
        noteS_TABLE_RECORD_ID: row.noteS_TABLE_RECORD_ID,
      };

      const response = await dispatch(
        AddExceptionRow({
          userId: Unique,
          companyId: Regular,
          row: payload,
        }),
      ).unwrap();

      const updatedRow = response.AddExceptionRowResponse?.data?.data?.[0];

      if (updatedRow) {
        // ---- REMOVE FROM ERROR LISTS ----
        setExceptionData((prev) => prev.filter((r) => String(r.ssn) !== String(updatedRow.ssn)));

        setErrorExceptionData((prev) =>
          prev.filter((r) => String(r.ssn) !== String(updatedRow.ssn)),
        );

        // ---- ⬅ CORRECT BEMA LIST PATH ----
        const bimaList = response.AddExceptionRowResponse?.data?.bimaEmpViled || [];

        setBemaListData(bimaList);

        setData((prev) => [
          ...prev,
          {
            ...updatedRow,
            wageS1: (+updatedRow.wageS1).toFixed(2),
            wageS2: (+updatedRow.wageS2).toFixed(2),
            wageS3: (+updatedRow.wageS3).toFixed(2),
            wageS4: (+updatedRow.wageS4).toFixed(2),
            wageS5: (+updatedRow.wageS5).toFixed(2),
          },
        ]);
        setSelectData((prev) => [...new Set([...prev, updatedRow.employeeId])]);
        const mergedCmbPayPeriod = [
          ...CmbPayPeriod,
          { key: updatedRow.payPeriod, value: updatedRow.payFreq }, // new value
        ];

        setCmbPayPeriod(mergedCmbPayPeriod);
        setIsExceptionUpdated(true);
        toast.success(
          response?.AddExceptionRowResponse?.message || 'Exception row updated successfully',
        );
        setSearchTermPeriod('');
        setSearchTermDepartment('');
        setSearchTerm('');
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      const errorRow =
        (err?.data?.data?.length ? err.data.data : err?.data?.length ? err.data : [])?.[0] || {};

      setExceptionData((prev) =>
        prev.map((r) =>
          String(r.ssn) === String(errorRow.ssn)
            ? { ...r, validateMsg: errorRow.validateMsg || 'Validation failed' }
            : r,
        ),
      );

      toast.error(err.message);
    } finally {
      setLoadingException(null);
    }
  };

  const handleUpdateClick = (ex) => {
    const bimaEmployee = getBimaEmployeeBySSN(ex.ssn);

    if (!bimaEmployee) {
      toast.error('BIMA employee not found for this SSN');
      return;
    }

    setModalData({
      formData: {
        ...bimaEmployee, // ✅ SHOW ONLY BIMA DATA
        validateMsg: ex.validateMsg || '',
      },
      row: ex, // ✅ keep exception row for Save
    });

    setModalGenerated(true);
  };

  const handleBulkUpdate = () => {
    const selectedExceptions = exceptionData.filter((ex) => ex.isSelected);

    if (selectedExceptions.length === 0) {
      toast.error('Please select at least one employee.');
      return;
    }

    // Set loading immediately to show loading indicator
    setBulkUpdateLoading(true);
    
   

    // Use requestAnimationFrame to allow React to render the loading state before heavy processing
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          // Prepare employee data with BIMA data merged
          const employeesWithBima = selectedExceptions.map((ex) => {
            const bimaEmployee = getBimaEmployeeBySSN(ex.ssn);
            return {
              exceptionRow: ex,
              bimaData: bimaEmployee || {},
            };
          });

          setBulkUpdateEmployees(employeesWithBima);
          setBulkUpdateModalOpen(true);
        } catch (error) {
          console.error('Error processing bulk update:', error);
          toast.error('An error occurred while processing employees.');
        } finally {
          setBulkUpdateLoading(false);
        }
      }, 0);
    });
  };

  const handleBulkSaveAll = (allEmployeeData) => {
    // Set loading state immediately
    setBulkUpdateLoading(true);

    // Use requestAnimationFrame to allow React to render the loading state before heavy processing
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          // Process each employee like handleEmployeeSave does (local state only, no API)
          allEmployeeData.forEach((updatedEmp) => {
            const fieldNames = {
              firstName: 'First Name',
              surName: 'Surname',
              socSecNum: 'Social Security Number',
              salary: 'Salary',
              gender: 'Gender',
            };

            const requiredFields = [
              'firstName',
              'surName',
              'socSecNum',
              'salary',
              'gender',
            ];

            const emptyFields = requiredFields.filter(
              (field) => !updatedEmp[field] || updatedEmp[field].toString().trim() === '',
            );

            if (emptyFields.length > 0) {
              const fieldList = emptyFields.map((f) => fieldNames[f] || f).join(', ');
              toast.error(`Employee ${updatedEmp.socSecNum}: Please fill required fields ${fieldList}`);
              return;
            }

            // Salary validation
            if (Number(updatedEmp.salary) <= 0) {
              toast.error(`Employee ${updatedEmp.socSecNum}: Salary must be greater than 0`);
              return;
            }

            // Update BEMA list
            setBemaListData((prev) =>
              prev.map((emp) => (emp.socSecNum === updatedEmp.socSecNum ? updatedEmp : emp)),
            );

            // Find existing row (exception OR main)
            const existingRow =
              exceptionData.find((ex) => ex.ssn === updatedEmp.socSecNum) ||
              data.find((d) => d.ssn === updatedEmp.socSecNum);

            // Remove from exception list
            setExceptionData((prev) => prev.filter((ex) => ex.ssn !== updatedEmp.socSecNum));

            setData((prevData) => {
              const mergedSavedRow = {
                ...(existingRow || {}),
                ...updatedEmp,

                // Core mapping
                ssn: updatedEmp.socSecNum,
                employeeName: `${updatedEmp.surName} ${updatedEmp.firstName}`,
                empSalary: Number(updatedEmp.salary),
                payFreq: updatedEmp.payFreq || updatedEmp.payPeriod?.split(' ')[0],
                payPeriod:
                  payPeriodMap[updatedEmp.payFreq || updatedEmp.payPeriod?.split(' ')[0]] ||
                  existingRow?.payPeriod,
                date_Joining: updatedEmp.date_Joining ?? existingRow?.date_Joining ?? null,
                date_terminated: updatedEmp.date_terminated ?? existingRow?.date_terminated ?? null,
                streetAddress: updatedEmp.streetAddress,
                streetAddress2: updatedEmp.streetAddress2,
                cityTownName: updatedEmp.cityTownName,
                stateRegion: updatedEmp.stateRegion,
                postalCode: updatedEmp.postalCode,
                department: updatedEmp.department,
                email: updatedEmp.email,
                phone: updatedEmp.phone,
                mobile: updatedEmp.mobile,
                occupation: updatedEmp.occupation,
                countryCode: updatedEmp.countryCode,
                lastPayDate: updatedEmp.last_Pay_Date,

                isLevyExempt: !!updatedEmp.isLevyExempt,
                isemployeeDirector: !!updatedEmp.isemployeeDirector,
              };

              const updatedMain = prevData.map((d) =>
                d.ssn === mergedSavedRow.ssn ? mergedSavedRow : d,
              );
              if (!updatedMain.some((d) => d.ssn === mergedSavedRow.ssn)) {
                updatedMain.push(mergedSavedRow);
              }

              return updatedMain;
            });

            setSelectData((prev) => {
              const key = ImportFileDataC3 === false ? updatedEmp.socSecNum : updatedEmp.employeeId;
              return prev.includes(key) ? prev : [...prev, key];
            });
          });

          toast.success(`Successfully updated ${allEmployeeData.length} employee(s)`);
       

          // Clear selections and close modal after bulk update
          setExceptionData((prev) => prev.map((ex) => ({ ...ex, isSelected: false })));
          setBulkUpdateModalOpen(false);
          setBulkUpdateEmployees([]);
        } catch (error) {
          console.error('Error in bulk save:', error);
          toast.error('An error occurred while updating employees.');
        } finally {
          setBulkUpdateLoading(false);
        }
      }, 0);
    });
  };

  const handleEmployeeSave = (updatedEmp) => {
    const fieldNames = {
      firstName: 'First Name',
      surName: 'Surname',
      socSecNum: 'Social Security Number',
      salary: 'Salary',
      gender: 'Gender',
    };

    const requiredFields = [
      'firstName',
      'surName',
      'socSecNum',
      'salary',
      'gender',
    ];

    const emptyFields = requiredFields.filter(
      (field) => !updatedEmp[field] || updatedEmp[field].toString().trim() === '',
    );

    if (emptyFields.length > 0) {
      const fieldList = emptyFields.map((f) => fieldNames[f] || f).join(', ');
      toast.error(`Please fill required fields ${fieldList}`);
      return;
    }

    // 2️⃣ Salary validation
    if (Number(updatedEmp.salary) <= 0) {
      toast.error('Salary must be greater than 0');
      return;
    }

    // 3️⃣ Update BEMA list
    setBemaListData((prev) =>
      prev.map((emp) => (emp.socSecNum === updatedEmp.socSecNum ? updatedEmp : emp)),
    );

    // 4️⃣ Find existing row (exception OR main)
    const existingRow =
      exceptionData.find((ex) => ex.ssn === updatedEmp.socSecNum) ||
      data.find((d) => d.ssn === updatedEmp.socSecNum);

    // 5️⃣ Remove from exception list
    const remainingExceptions = exceptionData.filter((ex) => ex.ssn !== updatedEmp.socSecNum);
    setExceptionData(remainingExceptions);

    setData((prevData) => {
      const mergedSavedRow = {
        ...(existingRow || {}),
        ...updatedEmp,

        // Core mapping
        ssn: updatedEmp.socSecNum,
        employeeName: `${updatedEmp.surName} ${updatedEmp.firstName}`,
        empSalary: Number(updatedEmp.salary),
        payFreq: updatedEmp.payFreq || updatedEmp.payPeriod?.split(' ')[0],
        payPeriod:
          payPeriodMap[updatedEmp.payFreq || updatedEmp.payPeriod?.split(' ')[0]] ||
          existingRow?.payPeriod,
        date_Joining: updatedEmp.date_Joining ?? existingRow?.date_Joining ?? null,
        date_terminated: updatedEmp.date_terminated ?? existingRow?.date_terminated ?? null,
        // wage_Amt: updatedEmp.wage_Amt ?? existingRow?.wage_Amt ?? null,
        // holidayPayDate: updatedEmp.holidayPayDate ?? existingRow?.holidayPayDate ?? null,
        streetAddress: updatedEmp.streetAddress,
        streetAddress2: updatedEmp.streetAddress2,
        cityTownName: updatedEmp.cityTownName,
        stateRegion: updatedEmp.stateRegion,
        postalCode: updatedEmp.postalCode,
        department: updatedEmp.department,
        email: updatedEmp.email,
        phone: updatedEmp.phone,
        mobile: updatedEmp.mobile,
        occupation: updatedEmp.occupation,
        countryCode: updatedEmp.countryCode,
        lastPayDate: updatedEmp.last_Pay_Date,

        isLevyExempt: !!updatedEmp.isLevyExempt,
        isemployeeDirector: !!updatedEmp.isemployeeDirector,
      };

      const updatedMain = prevData.map((d) => (d.ssn === mergedSavedRow.ssn ? mergedSavedRow : d));
      if (!updatedMain.some((d) => d.ssn === mergedSavedRow.ssn)) {
        updatedMain.push(mergedSavedRow);
      }

      return updatedMain;
    });

    setSelectData((prev) => {
      const key = ImportFileDataC3 === false ? updatedEmp.socSecNum : updatedEmp.employeeId;

      return prev.includes(key) ? prev : [...prev, key];
    });

    setModalGenerated(false);
  };

  const normalize = (val = '') => val.trim().toLowerCase().replace(/\s+/g, ' ');

  const handleEmployeeBlur = (ssn) => {
    setExceptionData((prev) =>
      prev.map((row) => {
        if (row.ssn !== ssn) return row;
        const bemaEmp = bemaListData.find((b) => b.socSecNum === row.ssn);
        if (!bemaEmp) {
          return {
            ...row,
            validateMsg: 'Employee data not found in BEMA',
          };
        }

        const enteredName = normalize(row.employeeName);
        const bemaName = normalize(`${bemaEmp.surName} ${bemaEmp.firstName}`);
        if (enteredName !== bemaName) {
          return {
            ...row,
            validateMsg: `Name mismatch in C3 file recorded as ${row.employeeName} (first name, last name); correct name as per BEMA record is ${bemaEmp.firstName} ${bemaEmp.surName}.`,
          };
        }

        // ✅ Name matches BEMA → clear message
        return {
          ...row,
          validateMsg: '',
        };
      }),
    );
  };

  const handlePayClick = (row) => {
    setSelectedRow(row);

    const tabs = [];
    if (row.bonus && parseFloat(row.bonus) > 0) tabs.push('bonus');
    if (row.hpay && row.hpay > 0) tabs.push('holiday');

    setAvailableTabs(tabs);
    setActiveTab(tabs[0] || null);
    setPayModalOpen(true);
  };

  const getSavedPayStatus = (row) => {
    const savedBonus = payData.bonus.some((b) => b.ssn === row.ssn);

    const savedHoliday = payData.holiday.some((h) => h.ssn === row.ssn);

    return { savedBonus, savedHoliday };
  };

  const handleSaveBonusPay = (bonusRow) => {
    setPayData((prev) => {
      const index = prev.bonus.findIndex((b) => b.ssn === bonusRow.ssn);
      const updatedBonus =
        index > -1
          ? prev.bonus.map((b, i) => (i === index ? { ...b, ...bonusRow } : b))
          : [...prev.bonus, { ...bonusRow, id: Date.now() }];
      return { ...prev, bonus: updatedBonus };
    });
    setSavedPayVersion((v) => v + 1);
  };

  const handleSaveHolidayPay = (holidayRow) => {
    setPayData((prev) => {
      const index = prev.holiday.findIndex((h) => h.ssn === holidayRow.ssn);
      const updatedHoliday =
        index > -1
          ? prev.holiday.map((h, i) => (i === index ? { ...h, ...holidayRow } : h))
          : [...prev.holiday, { ...holidayRow, id: Date.now() }];
      return { ...prev, holiday: updatedHoliday };
    });
    setSavedPayVersion((v) => v + 1);
  };

  return (
    <>
      <Helmet>
        <title>C3 Generation - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
        {/* ========== Left Sidebar Start ========== */}
        {/* Left Sidebar End */}
        <sidebar-barrrrrr></sidebar-barrrrrr>
        {/* ============================================================== */}
        {/* Start right Content here */}
        {/* ============================================================== */}

        {isLoadingMain ? (
          <Loader />
        ) : (
          <>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
              <ul className="d-flex align-items-center mt-3 gap-2 list-unstyled">
                <li className="fw-medium">
                  <span className="d-flex align-items-center gap-1 text-muted">
                    <i className="ti-home"></i>Dashboard
                  </span>
                </li>
                <li>-</li>
                <li className="fw-medium">
                  <span className="d-flex align-items-center gap-1 text-muted">C3 Generation</span>
                </li>
                <li>-</li>
                <li className="fw-medium">{location.state ? 'Edit' : 'Add'} C3 Generation</li>
              </ul>
            </div>

            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-3 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-8">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-user text-success pe-2"></i>
                                  {location.state ? 'Edit' : 'Add'} C3 Generation
                                </h4>
                              </div>
                              <div className="col-md-2 col-lg-2 col-xl-2"></div>
                              <div className="col-md-2 col-lg-2 col-xl-2 ">
                                {hideToggle === undefined && (
                                  <div className="toggle-container mt-2">
                                    <span style={{ fontSize: '15px', marginRight: '10px' }}>
                                      Is Nil Return
                                    </span>{' '}
                                    <div className={`toggle-switch ${isActive ? 'on' : ''}`}>
                                      <FormGroup check>
                                        <Input
                                          type="checkbox"
                                          className="toggle-input"
                                          id="toggle-switch"
                                          checked={isActive}
                                          onChange={handleToggle}
                                        />

                                        <Label htmlFor="toggle-switch" className="toggle-handle" />

                                        <Label htmlFor="toggle-switch" className="toggle-status">
                                          {isActive ? 'Yes' : 'No'}
                                        </Label>
                                      </FormGroup>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-4 col-lg-4 col-xl-4">
                                <Label>Month Year</Label>

                                <DatePicker
                                  selected={
                                    month && year
                                      ? new Date(year, parseInt(month, 10) - 1, 1)
                                      : null
                                  }
                                  onChange={(date) => {
                                    setMonth(String(date.getMonth() + 1).padStart(2, '0')); // e.g., '01'
                                    setyear(String(date.getFullYear()));
                                  }}
                                  dateFormat="MMMM yyyy"
                                  showMonthYearPicker
                                  className="form-control"
                                  disabled={location.state}
                                />
                              </div>
                              <div className="col-md-6 col-lg-6 col-xl-6">
                                <Label>Pay Period</Label>
                                <div className="mb-3">
                                  {location.state ? (
                                    <div>
                                      <div
                                        className="dropdown form-select p-0  open"
                                        style={{
                                          background: '#e9ecef',
                                          paddingLeft: '10px',
                                          padding: '2px',
                                        }}
                                      >
                                        <div
                                          className="dropdown-label drop_custom"
                                          style={{
                                            background: '#e9ecef',

                                            padding: '0px 8px',
                                            paddingLeft: '10px !important',
                                          }}
                                        >
                                          {payPeriods.join(', ') || 'All'}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className="dropdown form-select p-0 px-4 4 open"
                                      style={{
                                        background: !isActive ? '' : '#e9ecef',
                                      }}
                                    >
                                      <div
                                        className="dropdown-label drop_custom"
                                        onClick={handleLabelClick}
                                        style={{
                                          background: isActive ? '#e9ecef' : '',
                                          opacity: isActive ? 0.6 : 1,
                                          pointerEvents: isActive ? 'none' : 'auto',
                                          cursor: isActive ? 'not-allowed' : 'pointer',
                                        }}
                                      >
                                        {getLabelText()}
                                      </div>

                                      {isOpen && (
                                        <div className="dropdown-list form-select">
                                          <div className="checkbox">
                                            <input
                                              type="checkbox"
                                              name="dropdown-group-all"
                                              className="check-all checkbox-custom"
                                              id="checkbox-main"
                                              onChange={handleCheckAllChange}
                                              checked={selectedOptions.length === options.length}
                                            />
                                            <Label
                                              htmlFor="checkbox-main"
                                              className="checkbox-custom-Label"
                                            >
                                              &nbsp; All
                                            </Label>
                                          </div>

                                          {options.map((option) => (
                                            <div className="checkbox" key={option.id}>
                                              <input
                                                type="checkbox"
                                                name="dropdown-group"
                                                className="check checkbox-custom"
                                                id={option.id}
                                                onChange={handleCheckBoxChange}
                                                checked={selectedOptions.includes(option.label)}
                                              />

                                              <Label
                                                htmlFor={option.id}
                                                className="checkbox-custom-Label"
                                              >
                                                {option.label}
                                              </Label>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="col-md-2 col-12 mt-2 text-lg-end">
                                {hideToggle === undefined && (
                                  <button
                                    type="button"
                                    className="btn btn-success waves-effect waves-light h-45"
                                    onClick={() => toggle()}
                                    style={{ height: '45px', minWidth: '100px', marginTop: '22px' }}
                                    disabled={isActive}
                                  >
                                    <i className="fas fa-plus pe-1"></i>Bonus
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-2 bg_ligh">
                            <div className="row">
                              <div className="col-md-3 col-12 text-lg-end">
                                <input
                                  type="text"
                                  className="form-control custom d-inline"
                                  placeholder="Search by SSN or Name"
                                  value={searchTerm} // 👈 important
                                  onChange={handleSSNChange}
                                />
                              </div>

                              <div className="col-md-3 col-12 text-lg-end">
                                <input
                                  type="text"
                                  className="form-control custom d-inline"
                                  placeholder="Search by Department"
                                  value={searchTermDepartment}
                                  onChange={handleDepartSearch}
                                />
                              </div>
                              <div className="col-md-3 col-12 text-lg-end mb-3">
                                <input
                                  type="text"
                                  className="form-control custom"
                                  placeholder="Search by Pay Period"
                                  value={payPeriodSearch}
                                  onChange={(e) => setPayPeriodSearch(e.target.value)}
                                />
                              </div>
                              <div className="col-md-3 col-12 text-lg-end">
                                {canPreviewC3Generation ? (
                                  <Button
                                    className="btn btn-info waves-effect waves-light h-45"
                                    type="button"
                                    onClick={() => preview()}
                                  >
                                    {previewLoad ? (
                                      <Spinner color="dark" size="sm">
                                        Loading...
                                      </Spinner>
                                    ) : (
                                      <i className="far fa-eye"></i>
                                    )}{' '}
                                    &nbsp; Preview
                                  </Button>
                                ) : (
                                  <Button
                                    className="btn btn-info waves-effect waves-light h-45"
                                    type="button"
                                    style={{ cursor: 'not-allowed', opacity: 0.4 }}
                                  >
                                    <i className="far fa-eye"></i> &nbsp; Preview
                                  </Button>
                                )}

                                <button
                                  className="btn btn-success waves-effect waves-light h-45"
                                  type="button"
                                  // onClick={() => checkC3exists()}
                                  onClick={() => handleSaveClick()}
                                  disabled={saveLoad}
                                >
                                  {saveLoad ? (
                                    <Spinner color="dark" size="sm">
                                      Loading...
                                    </Spinner>
                                  ) : (
                                    <i className="far fa-save"></i>
                                  )}
                                  &nbsp; Save
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="card-body pt-2">
                            {/* <div className="table_wrap">
                              <table className="table table-hover mb-0 white-space"> */}
                            <div className="table-container Bg_addon table_wrap">
                              <table className="table table-hover mb-0">
                                <thead>
                                  <tr className="border-b">
                                    <th scope="row">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={
                                          selectData.length === data.length && data.length > 0
                                        }
                                        onChange={handleSelectAll}
                                      />
                                      {/* &nbsp;<Label className="mb-0">Select</Label> */}
                                    </th>
                                    <th
                                      scope="row"
                                      style={{ cursor: 'pointer', minWidth: '80px' }}
                                      onClick={() => handleSort('ssn')}
                                    >
                                      SSN{' '}
                                      {sortCriteria === 'ssn' &&
                                        (sortOrder === 'asc' ? (
                                          <Icon.ArrowUp size={14} />
                                        ) : (
                                          <Icon.ArrowDown size={14} />
                                        ))}
                                    </th>
                                    <th
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => handleSort('employeeName')}
                                    >
                                      Employee Name{' '}
                                      {sortCriteria === 'employeeName' &&
                                        (sortOrder === 'asc' ? (
                                          <Icon.ArrowUp size={14} />
                                        ) : (
                                          <Icon.ArrowDown size={14} />
                                        ))}
                                    </th>
                                    <th
                                      style={{ cursor: 'pointer', maxWidth: '80px' }}
                                      onClick={() => handleSort('department')}
                                    >
                                      Department{' '}
                                      {sortCriteria === 'department' &&
                                        (sortOrder === 'asc' ? (
                                          <Icon.ArrowUp size={14} />
                                        ) : (
                                          <Icon.ArrowDown size={14} />
                                        ))}
                                    </th>
                                    <th>Week 1</th>
                                    <th>Week 2</th>
                                    <th>Week 3</th>
                                    <th>Week 4</th>
                                    <th>Week 5</th>
                                    <th>Hpay</th>
                                    <th>Bonus</th>
                                    <th width="15%">Remarks</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {showNoRecords || isModalOpenSubmit ? (
                                    <tr>
                                      <td colSpan="13" className="text-center py-4">
                                        No C3 data available.
                                      </td>
                                    </tr>
                                  ) : (
                                    <>
                                      {filteredPayPeriods.map((period) => (
                                        <React.Fragment key={period}>
                                          <tr className="bg-light">
                                            <td className="bg-light f-600 text-dark" colSpan="18">
                                              {period}
                                            </td>
                                          </tr>

                                          {filteredData(period).map((item) => {
                                            const hasHoliday =
                                              (item.holidayPayId && item.holidayPayId > 0) ||
                                              (item.hpay && parseFloat(item.hpay) > 0);

                                            const hasBonus =
                                              item.bonus &&
                                              parseFloat(item.bonus) > 0 &&
                                              hideToggle === false;

                                            const isEnabledWhenToggleFalse = hasHoliday || hasBonus;

                                            const { savedBonus, savedHoliday } =
                                              getSavedPayStatus(item);
                                            const showWarning =
                                              hideToggle === false &&
                                              isEnabledWhenToggleFalse &&
                                              !savedBonus &&
                                              !savedHoliday;

                                            const showSuccess =
                                              hideToggle === false &&
                                              isEnabledWhenToggleFalse &&
                                              (savedBonus || savedHoliday);
                                            return (
                                              <tr key={item.employeeId}>
                                                <td>
                                                  <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={
                                                      ImportFileDataC3 === false
                                                        ? selectData.includes(item.ssn)
                                                        : selectData.includes(item.employeeId)
                                                    }
                                                    id="defaultCheck1"
                                                    onChange={(e) => {
                                                      if (ImportFileDataC3 === false) {
                                                        selectDataItem(item.ssn);
                                                      } else {
                                                        selectDataItem(item.employeeId);
                                                      }
                                                    }}
                                                  />
                                                </td>
                                                <td>{item?.ssn}</td>
                                                <td>{item?.employeeName}</td>

                                                <td
                                                  style={{
                                                    maxWidth: '120px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    cursor: 'pointer',
                                                  }}
                                                  title={item?.department}
                                                >
                                                  {item?.department}
                                                </td>

                                                <td>
                                                  <div
                                                    className="input-group"
                                                    style={{ minWidth: '90px' }}
                                                  >
                                                    <div
                                                      className="input-group-text"
                                                      style={{ padding: '4px' }}
                                                    >
                                                      <input
                                                        className="form-check-input mt-0"
                                                        type="checkbox"
                                                        checked={item.weeK1}
                                                        onChange={(e) => {
                                                          const isChecked = e.target.checked;

                                                          weekData(
                                                            getEmpKey(item),
                                                            'weeK1',
                                                            isChecked,
                                                          );

                                                          const sourceEmp =
                                                            getEmpFromAllSources(item);

                                                          weekData(
                                                            getEmpKey(item),
                                                            'wageS1',
                                                            isChecked
                                                              ? sourceEmp?.wageS1 || '0.00'
                                                              : '0.00',
                                                          );
                                                        }}
                                                      />
                                                    </div>

                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="00.00"
                                                      width="40px"
                                                      disabled={!item.weeK1}
                                                      value={item.wageS1}
                                                      onChange={({ target: { value } }) => {
                                                        const cleaned = value.replace(
                                                          /[^0-9.]/g,
                                                          '',
                                                        );
                                                        const regex = /^(\d{0,6})(\.\d{0,2})?$/;

                                                        if (regex.test(cleaned)) {
                                                          weekData(
                                                            getEmpKey(item),
                                                            'wageS1',
                                                            cleaned,
                                                          );
                                                        }
                                                      }}
                                                      onBlur={() => {
                                                        const val = parseFloat(
                                                          item.wageS1 || 0,
                                                        ).toFixed(2);
                                                        weekData(getEmpKey(item), 'wageS1', val);
                                                      }}
                                                    />
                                                  </div>
                                                </td>

                                                <td>
                                                  <div
                                                    className="input-group"
                                                    style={{ minWidth: '90px' }}
                                                  >
                                                    <div
                                                      className="input-group-text"
                                                      style={{ padding: '4px' }}
                                                    >
                                                      <input
                                                        className="form-check-input mt-0"
                                                        type="checkbox"
                                                        checked={item.weeK2}
                                                        onChange={(e) => {
                                                          const isChecked = e.target.checked;

                                                          weekData(
                                                            getEmpKey(item),
                                                            'weeK2',
                                                            isChecked,
                                                          );

                                                          const sourceEmp =
                                                            getEmpFromAllSources(item);

                                                          weekData(
                                                            getEmpKey(item),
                                                            'wageS2',
                                                            isChecked
                                                              ? sourceEmp?.wageS2 || '0.00'
                                                              : '0.00',
                                                          );
                                                        }}
                                                      />
                                                    </div>

                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="00.00"
                                                      width="40px"
                                                      disabled={!item.weeK2}
                                                      value={item.wageS2}
                                                      onChange={({ target: { value } }) => {
                                                        const cleaned = value.replace(
                                                          /[^0-9.]/g,
                                                          '',
                                                        );
                                                        const regex = /^(\d{0,6})(\.\d{0,2})?$/;

                                                        if (regex.test(cleaned)) {
                                                          weekData(
                                                            getEmpKey(item),
                                                            'wageS2',
                                                            cleaned,
                                                          );
                                                        }
                                                      }}
                                                      onBlur={() => {
                                                        const val = parseFloat(
                                                          item.wageS2 || 0,
                                                        ).toFixed(2);
                                                        weekData(getEmpKey(item), 'wageS2', val);
                                                      }}
                                                    />
                                                  </div>
                                                </td>

                                                <td>
                                                  <div
                                                    className="input-group"
                                                    style={{ minWidth: '90px' }}
                                                  >
                                                    <div
                                                      className="input-group-text"
                                                      style={{ padding: '4px' }}
                                                    >
                                                      <input
                                                        className="form-check-input mt-0"
                                                        type="checkbox"
                                                        checked={item.weeK3}
                                                        onChange={(e) => {
                                                          const isChecked = e.target.checked;

                                                          weekData(
                                                            getEmpKey(item),
                                                            'weeK3',
                                                            isChecked,
                                                          );

                                                          const sourceEmp =
                                                            getEmpFromAllSources(item);

                                                          weekData(
                                                            getEmpKey(item),
                                                            'wageS3',
                                                            isChecked
                                                              ? sourceEmp?.wageS3 || '0.00'
                                                              : '0.00',
                                                          );
                                                        }}
                                                      />
                                                    </div>

                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="00.00"
                                                      width="40px"
                                                      disabled={!item.weeK3}
                                                      value={item.wageS3}
                                                      onChange={({ target: { value } }) => {
                                                        const cleaned = value.replace(
                                                          /[^0-9.]/g,
                                                          '',
                                                        );
                                                        const regex = /^(\d{0,6})(\.\d{0,2})?$/;

                                                        if (regex.test(cleaned)) {
                                                          weekData(
                                                            getEmpKey(item),
                                                            'wageS3',
                                                            cleaned,
                                                          );
                                                        }
                                                      }}
                                                      onBlur={() => {
                                                        const val = parseFloat(
                                                          item.wageS3 || 0,
                                                        ).toFixed(2);
                                                        weekData(getEmpKey(item), 'wageS3', val);
                                                      }}
                                                    />
                                                  </div>
                                                </td>
                                                <td>
                                                  <div
                                                    className="input-group"
                                                    style={{ minWidth: '90px' }}
                                                  >
                                                    <div
                                                      className="input-group-text"
                                                      style={{ padding: '4px' }}
                                                    >
                                                      <input
                                                        className="form-check-input mt-0"
                                                        type="checkbox"
                                                        checked={item.weeK4}
                                                        onChange={(e) => {
                                                          const isChecked = e.target.checked;

                                                          weekData(
                                                            getEmpKey(item),
                                                            'weeK4',
                                                            isChecked,
                                                          );

                                                          const sourceEmp =
                                                            getEmpFromAllSources(item);

                                                          weekData(
                                                            getEmpKey(item),
                                                            'wageS4',
                                                            isChecked
                                                              ? sourceEmp?.wageS4 || '0.00'
                                                              : '0.00',
                                                          );
                                                        }}
                                                      />
                                                    </div>

                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="00.00"
                                                      width="40px"
                                                      disabled={!item.weeK4}
                                                      value={item.wageS4}
                                                      onChange={({ target: { value } }) => {
                                                        const cleaned = value.replace(
                                                          /[^0-9.]/g,
                                                          '',
                                                        );
                                                        const regex = /^(\d{0,6})(\.\d{0,2})?$/;

                                                        if (regex.test(cleaned)) {
                                                          weekData(
                                                            getEmpKey(item),
                                                            'wageS4',
                                                            cleaned,
                                                          );
                                                        }
                                                      }}
                                                      onBlur={() => {
                                                        const val = parseFloat(
                                                          item.wageS4 || 0,
                                                        ).toFixed(2);
                                                        weekData(getEmpKey(item), 'wageS4', val);
                                                      }}
                                                    />
                                                  </div>
                                                </td>
                                                <td>
                                                  <div
                                                    className="input-group"
                                                    style={{ minWidth: '90px' }}
                                                  >
                                                    <div
                                                      className="input-group-text"
                                                      style={{ padding: '4px' }}
                                                    >
                                                      <input
                                                        className="form-check-input mt-0"
                                                        type="checkbox"
                                                        disabled={
                                                          !getEmpFromAllSources(item)?.weeK5
                                                        }
                                                        checked={item.weeK5}
                                                        onChange={(e) => {
                                                          const isChecked = e.target.checked;

                                                          weekData(
                                                            getEmpKey(item),
                                                            'weeK5',
                                                            isChecked,
                                                          );

                                                          const sourceEmp =
                                                            getEmpFromAllSources(item);

                                                          weekData(
                                                            getEmpKey(item),
                                                            'wageS5',
                                                            isChecked
                                                              ? sourceEmp?.wageS5 || '0.00'
                                                              : '0.00',
                                                          );
                                                        }}
                                                      />
                                                    </div>

                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="00.00"
                                                      width="40px"
                                                      disabled={!item.weeK5}
                                                      value={item.wageS5}
                                                      onChange={({ target: { value } }) => {
                                                        const cleaned = value.replace(
                                                          /[^0-9.]/g,
                                                          '',
                                                        );
                                                        const regex = /^(\d{0,6})(\.\d{0,2})?$/;

                                                        if (regex.test(cleaned)) {
                                                          weekData(
                                                            getEmpKey(item),
                                                            'wageS5',
                                                            cleaned,
                                                          );
                                                        }
                                                      }}
                                                      onBlur={() => {
                                                        const val = parseFloat(
                                                          item.wageS5 || 0,
                                                        ).toFixed(2);
                                                        weekData(getEmpKey(item), 'wageS5', val);
                                                      }}
                                                    />
                                                  </div>
                                                </td>

                                                <td style={{ minWidth: '55px' }}>
                                                  <input
                                                    type="text"
                                                    className="form-control w-60"
                                                    placeholder="00.00"
                                                    disabled
                                                    value={Number(item.hpay || 0).toFixed(2)}
                                                  />
                                                </td>

                                                <td style={{ minWidth: '50px' }}>
                                                  <input
                                                    type="text"
                                                    className="form-control w-60"
                                                    placeholder="00.00"
                                                    width="40px"
                                                    disabled
                                                    value={
                                                      item.bonus === 0
                                                        ? `${item.bonus}.00`
                                                        : item.bonus
                                                    }
                                                    onChange={({ target: { value } }) => {
                                                      const cleanedValue = value.replace(
                                                        /[^0-9.]/g,
                                                        '',
                                                      );

                                                      let formattedValue = cleanedValue;
                                                      if (
                                                        cleanedValue.length > 6 &&
                                                        !cleanedValue.includes('.')
                                                      ) {
                                                        formattedValue = `${cleanedValue.slice(
                                                          0,
                                                          6,
                                                        )}.${cleanedValue.slice(6, 8)}`;
                                                      }

                                                      const regex = /^(\d{0,6})(\.\d{0,2})?$/;
                                                      if (regex.test(formattedValue)) {
                                                        weekData(
                                                          ImportFileDataC3 === false
                                                            ? item.ssn
                                                            : item.employeeId,
                                                          'bonus',
                                                          formattedValue === ''
                                                            ? '0.00'
                                                            : formattedValue,
                                                        );
                                                      }
                                                    }}
                                                  />
                                                </td>
                                                <td>
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    value={item.remarks}
                                                    onChange={(e) =>
                                                      weekData(
                                                        ImportFileDataC3 === false
                                                          ? item.ssn
                                                          : item.employeeId,
                                                        'remarks',
                                                        e.target.value,
                                                      )
                                                    }
                                                  />
                                                </td>

                                                <td>
                                                  {(() => {
                                                    const isDisabled =
                                                      hideToggle === false
                                                        ? !isEnabledWhenToggleFalse
                                                        : !(item.holidayPayId > 0);

                                                    const tooltipText = (() => {
                                                      if (isDisabled) return undefined; // 🚫 no tooltip when disabled

                                                      if (hideToggle === false) {
                                                        const missingBonus =
                                                          !item.bonus ||
                                                          parseFloat(item.bonus) === 0;
                                                        const missingHoliday =
                                                          !item.remarks ||
                                                          item.remarks.trim() === '';

                                                        if (missingBonus && missingHoliday)
                                                          return 'Bonus and holiday pay dates are missing.';
                                                        if (missingBonus)
                                                          return 'Bonus payment date is missing.';
                                                        if (missingHoliday)
                                                          return 'Holiday pay date is missing.';
                                                      }

                                                      // hideToggle === true
                                                      return 'Holiday / Bonus Pay';
                                                    })();

                                                    return (
                                                      <button
                                                        type="button"
                                                        className={`badge p-1 border-0 ${
                                                          !isEnabledWhenToggleFalse
                                                            ? 'bg-light text-white'
                                                            : showSuccess
                                                            ? 'bg-primary text-white'
                                                            : showWarning
                                                            ? 'bg-warning  text-white'
                                                            : 'bg-primary-100 text-white'
                                                        }`}
                                                        disabled={isDisabled}
                                                        title={tooltipText}
                                                        onClick={() => {
                                                          if (isDisabled) return;

                                                          if (hideToggle === false) {
                                                            handlePayClick(item);
                                                          } else {
                                                            setHolidayData(item.holidayPayId);
                                                          }
                                                        }}
                                                        style={{
                                                          cursor: isDisabled
                                                            ? 'not-allowed'
                                                            : 'pointer',
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                          }}
                                                        >
                                                          <i
                                                            className="fas fa-money-bill-wave"
                                                            style={{
                                                              color: showSuccess
                                                                ? '#ffffff'
                                                                : showWarning
                                                                ? '#856404'
                                                                : isEnabledWhenToggleFalse
                                                                ? '#098b06'
                                                                : '#7f7878',
                                                              marginRight: '5px',
                                                            }}
                                                          />

                                                          {savedBonus && hideToggle === false && (
                                                            <i
                                                              className="fas fa-check"
                                                              style={{
                                                                color: '#ffffff',
                                                                fontSize: '12px',
                                                                marginRight: '2px',
                                                              }}
                                                            />
                                                          )}

                                                          {savedHoliday && hideToggle === false && (
                                                            <i
                                                              className="fas fa-check"
                                                              style={{
                                                                color: '#ffffff',
                                                                fontSize: '12px',
                                                              }}
                                                            />
                                                          )}
                                                        </span>
                                                      </button>
                                                    );
                                                  })()}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </React.Fragment>
                                      ))}
                                    </>
                                  )}
                                  {exceptionData?.length > 0 && (
                                    <>
                                      <tr className="bg-light-warning">
                                        <td colSpan="15" className="p-2">
                                          <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center gap-2">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={
                                                  exceptionData.length > 0 &&
                                                  exceptionData
                                                    .filter(
                                                      (ex) =>
                                                        ex.validateMsg !==
                                                          'Employee data not found in our system' &&
                                                        !(ex.validateMsg && ex.validateMsg.includes('Duplicate SSN found')),
                                                    )
                                                    .every((ex) => ex.isSelected) &&
                                                  exceptionData.filter(
                                                    (ex) =>
                                                      ex.validateMsg !==
                                                        'Employee data not found in our system' &&
                                                      !(ex.validateMsg && ex.validateMsg.includes('Duplicate SSN found')),
                                                  ).length > 0
                                                }
                                                onChange={(e) =>
                                                  handleSelectAllExceptions(e.target.checked)
                                                }
                                                style={{ marginRight: '8px', cursor: 'pointer' }}
                                              />
                                              <span className="fw-bold text-dark">
                                                Correction List ({exceptionData.length} employee(s))
                                              </span>
                                              <span className="text-dark">
                                                (
                                                {exceptionData.filter((ex) => ex.isSelected).length}{' '}
                                                selected)
                                              </span>
                                            </div>
                                            <Button
                                              color="primary"
                                              size="sm"
                                              onClick={handleBulkUpdate}
                                              disabled={bulkUpdateLoading}
                                              style={{ position: 'absolute', right: '2%' }}
                                            >
                                              {bulkUpdateLoading ? (
                                                <>
                                                  <Spinner size="sm" className="me-1" />
                                                  Updating...
                                                </>
                         
                        ) : (
                                                <>
                                                  <i className="fas fa-sync-alt me-1"></i>
                                                  Bulk Update Selected
                                                </>
                                              )}
                                            </Button>
                                          </div>
                                        </td>
                                      </tr>
                                      {filteredData(null, exceptionData).map((ex, index) => {
                                        const isEmployeeMissing =
                                          ex.validateMsg === 'Employee data not found in our system';
                                        const isDuplicateSSN =
                                          ex.validateMsg && ex.validateMsg.includes('Duplicate SSN found');
                                        const isNotSelectable = isEmployeeMissing || isDuplicateSSN;
                                        return (
                                          <>
                                            <tr key={index} className="bg-light-danger">
                                              <td>
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  checked={ex.isSelected || false}
                                                  disabled={isNotSelectable}
                                                  onChange={(e) =>
                                                    handleExceptionChange(
                                                      index,
                                                      'isSelected',
                                                      e.target.checked,
                                                    )
                                                  }
                                                  style={{
                                                    cursor: isNotSelectable ? 'not-allowed' : 'pointer',
                                                    opacity: isNotSelectable ? 0.5 : 1,
                                                  }}
                                                />
                                              </td>
                                              <td>
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  value={ex.ssn || ''}
                                                  onChange={(e) =>
                                                    handleExceptionChange(
                                                      index,
                                                      'ssn',
                                                      e.target.value,
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  value={ex.employeeName || ''}
                                                  onChange={(e) =>
                                                    handleExceptionChange(
                                                      index,
                                                      'employeeName',
                                                      e.target.value,
                                                    )
                                                  }
                                                  onBlur={() => handleEmployeeBlur(ex.ssn)}
                                                />
                                              </td>

                                              <td>
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  value={ex.department || ''}
                                                  onChange={(e) =>
                                                    handleExceptionChange(
                                                      index,
                                                      'department',
                                                      e.target.value,
                                                    )
                                                  }
                                                  style={{
                                                    maxWidth: '120px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                  }}
                                                  title={ex.department}
                                                />
                                              </td>

                                              <td>
                                                <div
                                                  className="input-group"
                                                  style={{ minWidth: '90px' }}
                                                >
                                                  <div
                                                    className="input-group-text"
                                                    style={{ padding: '4px' }}
                                                  >
                                                    <input
                                                      className="form-check-input mt-0"
                                                      type="checkbox"
                                                      checked={ex.weeK1}
                                                      disabled={isEmployeeMissing}
                                                      onChange={(e) => {
                                                        const isChecked = e.target.checked;

                                                        const defaultWage =
                                                          (
                                                            location.state?.uploadedData
                                                              ?.exceptionList || loadEmployeeList
                                                          ).find((emp) => emp.ssn === ex.ssn)
                                                            ?.wageS1 || '0';

                                                        handleExceptionChange(
                                                          index,
                                                          'weeK1',
                                                          isChecked,
                                                        );

                                                        handleExceptionChange(
                                                          index,
                                                          'wageS1',
                                                          isChecked
                                                            ? parseFloat(defaultWage).toFixed(2) // ✅ 24.00
                                                            : '0.00', // ✅ 0.00
                                                        );
                                                      }}
                                                    />
                                                  </div>

                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="00.00"
                                                    disabled={!ex.weeK1}
                                                    value={ex.wageS1}
                                                    onChange={(e) => {
                                                      const cleaned = e.target.value.replace(
                                                        /[^0-9.]/g,
                                                        '',
                                                      );
                                                      const regex = /^(\d{0,6})(\.\d{0,2})?$/;

                                                      if (regex.test(cleaned)) {
                                                        handleExceptionChange(
                                                          index,
                                                          'wageS1',
                                                          cleaned,
                                                        );
                                                      }
                                                    }}
                                                    onBlur={() =>
                                                      handleExceptionChange(
                                                        index,
                                                        'wageS1',
                                                        parseFloat(ex.wageS1 || 0).toFixed(2),
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </td>

                                              <td>
                                                <div
                                                  className="input-group"
                                                  style={{ minWidth: '90px' }}
                                                >
                                                  <div
                                                    className="input-group-text"
                                                    style={{ padding: '4px' }}
                                                  >
                                                    <input
                                                      className="form-check-input mt-0"
                                                      type="checkbox"
                                                      checked={ex.weeK2}
                                                      disabled={isEmployeeMissing}
                                                      onChange={(e) => {
                                                        const isChecked = e.target.checked;

                                                        const defaultWage =
                                                          (
                                                            location.state?.uploadedData
                                                              ?.exceptionList || loadEmployeeList
                                                          ).find((emp) => emp.ssn === ex.ssn)
                                                            ?.wageS2 || '0';

                                                        handleExceptionChange(
                                                          index,
                                                          'weeK2',
                                                          isChecked,
                                                        );

                                                        handleExceptionChange(
                                                          index,
                                                          'wageS2',
                                                          isChecked
                                                            ? parseFloat(defaultWage).toFixed(2) // ✅ 24.00
                                                            : '0.00', // ✅ 0.00
                                                        );
                                                      }}
                                                    />
                                                  </div>

                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="00.00"
                                                    disabled={!ex.weeK2}
                                                    value={ex.wageS2}
                                                    onChange={(e) => {
                                                      const cleaned = e.target.value.replace(
                                                        /[^0-9.]/g,
                                                        '',
                                                      );
                                                      const regex = /^(\d{0,6})(\.\d{0,2})?$/;

                                                      if (regex.test(cleaned)) {
                                                        handleExceptionChange(
                                                          index,
                                                          'wageS2',
                                                          cleaned,
                                                        );
                                                      }
                                                    }}
                                                    onBlur={() =>
                                                      handleExceptionChange(
                                                        index,
                                                        'wageS2',
                                                        parseFloat(ex.wageS2 || 0).toFixed(2),
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </td>

                                              <td>
                                                <div
                                                  className="input-group"
                                                  style={{ minWidth: '90px' }}
                                                >
                                                  <div
                                                    className="input-group-text"
                                                    style={{ padding: '4px' }}
                                                  >
                                                    <input
                                                      className="form-check-input mt-0"
                                                      type="checkbox"
                                                      checked={ex.weeK3}
                                                      disabled={isEmployeeMissing}
                                                      onChange={(e) => {
                                                        const isChecked = e.target.checked;

                                                        const defaultWage =
                                                          (
                                                            location.state?.uploadedData
                                                              ?.exceptionList || loadEmployeeList
                                                          ).find((emp) => emp.ssn === ex.ssn)
                                                            ?.wageS3 || '0';

                                                        handleExceptionChange(
                                                          index,
                                                          'weeK3',
                                                          isChecked,
                                                        );

                                                        handleExceptionChange(
                                                          index,
                                                          'wageS3',
                                                          isChecked
                                                            ? parseFloat(defaultWage).toFixed(2) // ✅ 24.00
                                                            : '0.00', // ✅ 0.00
                                                        );
                                                      }}
                                                    />
                                                  </div>

                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="00.00"
                                                    disabled={!ex.weeK3}
                                                    value={ex.wageS3}
                                                    onChange={(e) => {
                                                      const cleaned = e.target.value.replace(
                                                        /[^0-9.]/g,
                                                        '',
                                                      );
                                                      const regex = /^(\d{0,6})(\.\d{0,2})?$/;

                                                      if (regex.test(cleaned)) {
                                                        handleExceptionChange(
                                                          index,
                                                          'wageS3',
                                                          cleaned,
                                                        );
                                                      }
                                                    }}
                                                    onBlur={() =>
                                                      handleExceptionChange(
                                                        index,
                                                        'wageS3',
                                                        parseFloat(ex.wageS3 || 0).toFixed(2),
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </td>

                                              <td>
                                                <div
                                                  className="input-group"
                                                  style={{ minWidth: '90px' }}
                                                >
                                                  <div
                                                    className="input-group-text"
                                                    style={{ padding: '4px' }}
                                                  >
                                                    <input
                                                      className="form-check-input mt-0"
                                                      type="checkbox"
                                                      checked={ex.weeK4}
                                                      disabled={isEmployeeMissing}
                                                      onChange={(e) => {
                                                        const isChecked = e.target.checked;

                                                        const defaultWage =
                                                          (
                                                            location.state?.uploadedData
                                                              ?.exceptionList || loadEmployeeList
                                                          ).find((emp) => emp.ssn === ex.ssn)
                                                            ?.wageS4 || '0';

                                                        handleExceptionChange(
                                                          index,
                                                          'weeK4',
                                                          isChecked,
                                                        );

                                                        handleExceptionChange(
                                                          index,
                                                          'wageS4',
                                                          isChecked
                                                            ? parseFloat(defaultWage).toFixed(2) // ✅ 24.00
                                                            : '0.00', // ✅ 0.00
                                                        );
                                                      }}
                                                    />
                                                  </div>

                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="00.00"
                                                    disabled={!ex.weeK4}
                                                    value={ex.wageS4}
                                                    onChange={(e) => {
                                                      const cleaned = e.target.value.replace(
                                                        /[^0-9.]/g,
                                                        '',
                                                      );
                                                      const regex = /^(\d{0,6})(\.\d{0,2})?$/;

                                                      if (regex.test(cleaned)) {
                                                        handleExceptionChange(
                                                          index,
                                                          'wageS4',
                                                          cleaned,
                                                        );
                                                      }
                                                    }}
                                                    onBlur={() =>
                                                      handleExceptionChange(
                                                        index,
                                                        'wageS4',
                                                        parseFloat(ex.wageS4 || 0).toFixed(2),
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </td>

                                              <td>
                                                <div
                                                  className="input-group"
                                                  style={{ minWidth: '90px' }}
                                                >
                                                  <div
                                                    className="input-group-text"
                                                    style={{ padding: '4px' }}
                                                  >
                                                    <input
                                                      className="form-check-input mt-0"
                                                      type="checkbox"
                                                      disabled={
                                                        !(
                                                          location.state?.employees?.length > 0
                                                            ? location.state.employees ||
                                                              location.state?.uploadedData
                                                                ?.exceptionList
                                                            : loadEmployeeList
                                                        )?.find(
                                                          (f) => f.employeeId === ex.employeeId,
                                                        )?.weeK5
                                                      }
                                                      checked={ex.weeK5}
                                                      onChange={(e) => {
                                                        const isChecked = e.target.checked;

                                                        handleExceptionChange(
                                                          index,
                                                          'weeK5',
                                                          isChecked,
                                                        );
                                                        handleExceptionChange(
                                                          index,
                                                          'wageS5',
                                                          isChecked
                                                            ? (
                                                                location.state?.employees ||
                                                                loadEmployeeList
                                                              ).find((emp) => emp.ssn === ex.ssn)
                                                                ?.wageS5 || '0.00'
                                                            : '0.00',
                                                        );
                                                      }}
                                                    />
                                                  </div>

                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="00.00"
                                                    disabled={!ex.weeK5}
                                                    value={ex.wageS5}
                                                    onChange={(e) => {
                                                      const cleaned = e.target.value.replace(
                                                        /[^0-9.]/g,
                                                        '',
                                                      );
                                                      const regex = /^(\d{0,6})(\.\d{0,2})?$/;

                                                      if (regex.test(cleaned)) {
                                                        handleExceptionChange(
                                                          index,
                                                          'wageS5',
                                                          cleaned,
                                                        );
                                                      }
                                                    }}
                                                    onBlur={() =>
                                                      handleExceptionChange(
                                                        index,
                                                        'wageS5',
                                                        parseFloat(ex.wageS5 || 0).toFixed(2),
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </td>
                                              <td style={{ minWidth: '50px' }}>
                                                <input
                                                  type="text"
                                                  className="form-control w-60"
                                                  placeholder="00.00"
                                                  disabled
                                                  value={Number(ex.hpay || 0).toFixed(2)}
                                                />
                                              </td>

                                              <td style={{ minWidth: '50px' }}>
                                                <input
                                                  type="text"
                                                  className="form-control w-60"
                                                  placeholder="00.00"
                                                  width="40px"
                                                  disabled
                                                  value={
                                                    ex.bonus === 0 ? `${ex.bonus}.00` : ex.bonus
                                                  }
                                                  onChange={({ target: { value } }) => {
                                                    const cleanedValue = value.replace(
                                                      /[^0-9.]/g,
                                                      '',
                                                    );

                                                    let formattedValue = cleanedValue;
                                                    if (
                                                      cleanedValue.length > 6 &&
                                                      !cleanedValue.includes('.')
                                                    ) {
                                                      formattedValue = `${cleanedValue.slice(
                                                        0,
                                                        6,
                                                      )}.${cleanedValue.slice(6, 8)}`;
                                                    }

                                                    const regex = /^(\d{0,6})(\.\d{0,2})?$/;
                                                    if (regex.test(formattedValue)) {
                                                      weekData(
                                                        ex.employeeId,
                                                        'bonus',
                                                        formattedValue === ''
                                                          ? '0.00'
                                                          : formattedValue,
                                                      );
                                                    }
                                                  }}
                                                />
                                              </td>

                                              <td style={{ minWidth: '120px' }}>
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  value={ex.remarks || ''}
                                                  onChange={(e) =>
                                                    handleExceptionChange(
                                                      index,
                                                      'remarks',
                                                      e.target.value,
                                                    )
                                                  }
                                                  style={{
                                                    maxWidth: '120px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                  }}
                                                  title={ex.remarks}
                                                />
                                              </td>
                                              <td>
                                                <button
                                                  type="button"
                                                  className={`badge p-1 border-0 ${
                                                    ex.holidayPayId > 0
                                                      ? 'bg-primary-100 text-white'
                                                      : 'bg-light text-muted'
                                                  }`}
                                                  aria-hidden="true"
                                                  data-bs-toggle="tooltip"
                                                  data-bs-placement="top"
                                                  data-bs-original-title="Holiday Pay"
                                                  disabled={!ex.holidayPayId > 0}
                                                  onClick={() => setHolidayData(ex.holidayPayId)}
                                                >
                                                  <span>
                                                    <i
                                                      className="fas fa-money-bill-wave"
                                                      style={{
                                                        color:
                                                          ex.holidayPayId > 0
                                                            ? '#098b06'
                                                            : '#7f7878',
                                                      }}
                                                      data-bs-toggle="tooltip"
                                                      data-bs-placement="top"
                                                      title="Holiday Pay"
                                                    ></i>
                                                  </span>
                                                </button>
                                              </td>

                                              {!ex.isUpdated && (
                                                <td>
                                                  {isEmployeeMissing ? (
                                                    <Button
                                                      className="btn btn-sm btn-success"
                                                      disabled={loadingException === ex.ssn}
                                                      onClick={async () => {
                                                        const result = await addNewEmployee(ex);
                                                        if (result.success)
                                                          moveExceptionToMain(index);
                                                      }}
                                                    >
                                                      {loadingException === ex.ssn ? (
                                                        <>
                                                          <Spinner size="sm" /> Adding...
                                                        </>
                                                      ) : (
                                                        'Add'
                                                      )}
                                                    </Button>
                                                  ) : (
                                                    <Button
                                                      className="btn btn-sm btn-success"
                                                      disabled={loadingException === ex.ssn}
                                                      onClick={() => handleUpdateClick(ex)}
                                                    >
                                                      {loadingException === ex.ssn ? (
                                                        <>
                                                          <Spinner size="sm" /> Updating...
                                                        </>
                                                      ) : (
                                                        'Update'
                                                      )}
                                                    </Button>
                                                  )}
                                                </td>
                                              )}
                                            </tr>
                                            {(ex.validateMsg || ex.ValidateMsg) && (
                                              <tr className="bg-light-danger">
                                                <td colSpan="15">
                                                  <span className="text-danger fw-bold d-block">
                                                    {ex.validateMsg || ex.ValidateMsg}
                                                  </span>
                                                </td>
                                              </tr>
                                            )}
                                          </>
                                        );
                                      })}
                                    </>
                                  )}
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
              {/* end main content*/}
            </div>
          </>
        )}
      </div>

      {/* Add Bonus Modal */}
      <Modal isOpen={modal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Employee Bonus Details</ModalHeader>
        <ModalBody>
          <Row>
            <Col md="6">
              <Label for="employee">
                Employee<span className="text-danger">*</span>
              </Label>

              <Autocomplete
                id="employeessn"
                size="small"
                options={employee || []}
                getOptionLabel={(option) => option.name || ''}
                value={employee.find((item) => item.name === employeessn) || null}
                onChange={(event, newValue) => setEmployeessn(newValue ? newValue.name : '')}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Employee" variant="outlined" />
                )}
                style={{ background: '#fff' }}
              />
            </Col>
            <Col md="6">
              <Label for="paymentDate">
                Payment Date<span className="text-danger">*</span>
              </Label>

              <DatePicker
                selected={payDates ? new Date(payDates) : null}
                onChange={(date) => setPayDate(formatDate(date))}
                dateFormat="dd-MMM-yyyy"
                isClearable
                id="payDate"
                placeholderText="dd-mmm-yyyy"
                className="datepicker"
                showMonthDropdown
                showYearDropdown
                yearDropdownItemNumber={15}
                scrollableYearDropdown
                dropdownMode="select"
              />
            </Col>
            <Col md="6" className="mt-3">
              <Label for="amount">
                Amount<span className="text-danger">*</span>
              </Label>
              <Input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => saveBonusApi()}>
            <Icon.Save className="me-1" /> Save
          </Button>
          <Button color="secondary" className="h-45 btn btn-light" onClick={toggle}>
            <i className="fas fa-times"></i> Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={hmodals} toggle={Htoggles} size="lg">
        <ModalHeader toggle={Htoggles}>Employee Holiday/Other Pay</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Working Director?</Label>
              <div>
                <Input
                  type="checkbox"
                  id="isDirector"
                  disabled
                  checked={isWorkingDirector}
                  onChange={(e) => setisWorkingDirector(e.target.checked)}
                />
                <Label for="isDirector" className="ms-2">
                  Yes
                </Label>
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="employee">Employee</Label> <span className="text-danger">*</span>
              <Input
                type="select"
                id="employee"
                value={empName}
                disabled={isEdit}
                onChange={(e) => setEmpName(e.target.value)}
              >
                <option>Select Employee</option>
                {EmployeeAndWokinglist !== null && EmployeeAndWokinglist.length > 0
                  ? EmployeeAndWokinglist.map((item) => (
                      <option value={item.name}>{item.name}</option>
                    ))
                  : null}
              </Input>
            </FormGroup>
            <div className="row">
              <div className="col-xl-6">
                <FormGroup>
                  <Label>Holiday Pay with Leave</Label>
                  <div>
                    <Input
                      type="radio"
                      id="holidayPayYes"
                      name="holidayPay"
                      checked={holidayPayWithLeave === true}
                      onChange={(e) =>
                        e.target.checked
                          ? setHolidayPayWithLeave(true)
                          : setHolidayPayWithLeave(false)
                      }
                    />
                    <Label for="holidayPayYes" className="ms-2">
                      Yes
                    </Label>
                  </div>
                </FormGroup>
              </div>
              <div className="col-xl-6">
                <FormGroup>
                  <Label>Other</Label>
                  <div>
                    <Input
                      type="radio"
                      id="holidayPayNo"
                      name="holidayPay"
                      checked={holidayPayWithLeave === false}
                      onChange={(e) => (e.target.checked ? setHolidayPayWithLeave(false) : null)}
                    />
                    <Label for="holidayPayNo" className="ms-2">
                      Yes
                    </Label>
                  </div>
                </FormGroup>
              </div>
            </div>
            {holidayPayWithLeave === false ? (
              <FormGroup>
                <Label for="employee">
                  Type <span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="leaveType"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option>Select </option>
                  <option value="Leave Without Pay">Leave Without Pay</option>
                  <option value="Service Charge">Service Charge</option>
                  {isWorkingDirector === true ? (
                    <option value="Director Wages">Director Wages</option>
                  ) : null}
                  <option value="Commission">Commission</option>
                  <option value="Other">Other</option>
                </Input>
              </FormGroup>
            ) : null}

            <FormGroup>
              <Label for="amount">Amount</Label> <span className="text-danger">*</span>
              <Input
                type="number"
                id="amount"
                placeholder="Enter amount"
                value={amounts}
                onChange={(e) => setAmounts(e.target.value)}
              />
            </FormGroup>

            {holidayPayWithLeave === false ? (
              <>
                <FormGroup>
                  <Label for="toDate">Pay Date</Label> <span className="text-danger">*</span>
                  <DatePicker
                    selected={payDatess ? new Date(payDatess) : null}
                    onChange={handleDateChange}
                    dateFormat="dd-MMM-yyyy"
                    isClearable
                    maxDate={new Date()}
                    className="form-control"
                    placeholderText="Select Pay Date"
                  />
                </FormGroup>
                {leaveType === 'Other' ? (
                  <FormGroup>
                    <Label for="description">Payment Description</Label>
                    <Input
                      type="textarea"
                      id="description"
                      value={descother}
                      onChange={(e) => setDescother(e.target.value)}
                    />
                  </FormGroup>
                ) : null}
              </>
            ) : (
              <>
                {' '}
                <FormGroup>
                  <Label for="fromDate">From Date</Label> <span className="text-danger">*</span>
                  <DatePicker
                    selected={fromDate ? new Date(fromDate) : null}
                    onChange={handleFromDate}
                    id="fromDate"
                    dateFormat="dd-MMM-yyyy"
                    isClearable
                    className="form-control"
                    placeholderText="dd-mmm-yyyy"
                    showMonthDropdown
                    showYearDropdown
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                    dropdownMode="select"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="toDate">To Date</Label> <span className="text-danger">*</span>
                  <DatePicker
                    selected={toDate ? new Date(toDate) : null}
                    onChange={handleToDate}
                    id="toDate"
                    dateFormat="dd-MMM-yyyy"
                    isClearable
                    className="form-control"
                    placeholderText="dd-mmm-yyyy"
                    showMonthDropdown
                    showYearDropdown
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                    dropdownMode="select"
                  />
                </FormGroup>
              </>
            )}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => editHolidayData()}>
            Save
          </Button>
          <Button className="btn-light" color="secondary" onClick={Htoggles}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isModalOpen} toggle={CloseModalAll}>
        <ModalHeader toggle={CloseModalAll}>Confirm Action</ModalHeader>
        <ModalBody>{saveMessage}</ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={CloseModalAll}>
            No
          </Button>
          <Button
            color="primary"
            onClick={() =>
              save({
                h_Id: headerid,
                is_Preview: true,
                isRecordEdit: true,
                companyId: CompanyId,
                schedule_no: data.schedule_no,
              })
            }
          >
            {saveLoad ? (
              <>
                <Spinner size="sm" /> Loading..
              </>
            ) : (
              'Yes'
            )}
          </Button>
        </ModalFooter>
      </Modal>
      <Modal keyboard={false} backdrop="static" isOpen={isNill} toggle={CloseModalNill}>
        <ModalHeader toggle={CloseModalNill}>Confirm Action</ModalHeader>
        <ModalBody>
          {isActive
            ? 'Are you sure you want to process this C3 for a Nil return?'
            : 'Are you sure you want to process this C3 as a regular C3?'}
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            className="btn-light"
            onClick={() => {
              CloseModalNill();
            }}
          >
            No
          </Button>
          <Button color="primary" onClick={AllNill} disabled={nillSave}>
            {nillSave ? (
              <>
                <Spinner size="sm" /> Loading..
              </>
            ) : (
              'Yes'
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={isModalOpenSubmit}
        toggle={() => {}}
        backdrop="static" // prevents clicking outside to close
        keyboard={false}
      >
        <ModalHeader
          toggle={() => {
            toggleModal();
            navigate('/apps/C3/C3Generation');
          }}
        >
          Confirm Action
        </ModalHeader>
        <ModalBody>
          {apiMsgNew ? (
            <div className="alert alert-warning">{apiMsgNew}</div>
          ) : showApiMsg && apiMsg ? (
            <div className="alert alert-warning">{apiMsg}</div>
          ) : null}
          {showForm && !showApiMsg && !apiMsgNew && (
            <Form>
              <div className="row">
                <div className="col-md-6 col-lg-6 col-xl-6">
                  <Label>Month Year</Label>

                  <DatePicker
                    selected={
                      monthOther && yearOther
                        ? new Date(yearOther, parseInt(monthOther, 10) - 1, 1)
                        : null
                    }
                    onChange={(date) => {
                      setMonthOther(String(date.getMonth() + 1).padStart(2, '0')); // e.g., '01'
                      setYearOther(String(date.getFullYear()));
                    }}
                    label="A"
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    className="form-control"
                    // disabled={location.state}
                    placeholderText="Select Month Year"
                  />
                </div>

                <div className="col-md-6 col-lg-6 col-xl-6">
                  <Label>Pay Period</Label>
                  <div className="mb-3">
                    <div className="dropdown form-select p-0 px-4 open" ref={modalRef}>
                      <div className="dropdown-label drop_custom" onClick={handleLabelClickModal}>
                        {getLabelTextOther()}
                      </div>

                      {isOpenModal && (
                        <div className="dropdown-list form-select">
                          <div className="checkbox">
                            <input
                              type="checkbox"
                              name="dropdown-group-all"
                              className="check-all checkbox-custom"
                              id="checkbox-main"
                              onChange={handleCheckAllChangeModal}
                              checked={selectedOptionsOther.length === optionsOther.length}
                            />
                            <Label htmlFor="checkbox-main" className="checkbox-custom-Label">
                              &nbsp; All
                            </Label>
                          </div>

                          {optionsOther.map((option) => (
                            <div className="checkbox" key={option.id}>
                              <input
                                type="checkbox"
                                name="dropdown-group"
                                className="check checkbox-custom"
                                id={option.id}
                                onChange={handleCheckBoxChangeModal}
                                checked={selectedOptionsOther.includes(option.label)}
                              />
                              <Label htmlFor={option.id} className="checkbox-custom-Label">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </ModalBody>

        <ModalFooter>
          {showYesNoButtons ? (
            <>
              <Button
                color="info"
                type="button"
                onClick={handleNoClick}
                style={{ position: 'absolute', left: '10px' }}
              >
                Generate C3 for Other Month &nbsp;
                {'>'}
              </Button>
              <Button
                type="button"
                color="secondary"
                className="btn-light"
                onClick={() => {
                  toggleModal();
                  navigate('/apps/C3/C3Generation');
                }}
              >
                Cancel
              </Button>

              <Button color="primary" onClick={AlreadySubmit}>
                Yes
              </Button>
            </>
          ) : (
            <>
              {showBackButton && !apiMsgNew && (
                <Button
                  type="button"
                  color="secondary"
                  className="btn-light"
                  onClick={handleBack}
                  style={{ position: 'absolute', left: '10px' }}
                >
                  <>{'<'} &nbsp;Back</>
                </Button>
              )}
              <Button
                type="button"
                color="secondary"
                className="btn-light"
                onClick={() => {
                  toggleModal();
                  navigate('/apps/C3/C3Generation');
                }}
              >
                Cancel
              </Button>

              {apiMsgNew ? (
                <>
                  <Button
                    color="info"
                    type="button"
                    onClick={handleNoClick}
                    style={{ position: 'absolute', left: '10px' }}
                  >
                    Generate C3 for Other Month &nbsp;
                    {'>'}
                  </Button>
                  <Button type="button" color="primary" onClick={AlreadySubmit}>
                    Yes
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  color="primary"
                  onClick={handleGenerateC3Click}
                  disabled={pageLoading}
                >
                  {pageLoading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Generating...
                    </>
                  ) : (
                    'Generate C3'
                  )}
                </Button>
              )}
            </>
          )}
        </ModalFooter>
      </Modal>

      <EmployeeImportModal
        key={`import-modal-${showImportModal}-${isLoading}`}
        isOpen={showImportModal}
        toggle={() => {
          setShowImportModal(false);
          setHasShownImportModal(true);
          setIsLoading(false);
        }}
        employeeList={importList}
        onConfirm={handleConfirmImport}
        loading={isLoading}
      />

      <CustomModal
        isOpen={previewModalOpenNew}
        toggle={() => setPreviewModalOpenNew(false)}
        title="Exception Details"
        message={exceptionModalMessage}
        tableHeaders={tableHeaders}
        tableData={footerCalculate}
        showTable
        onConfirm={checkC3exists}
      />

      <CustomModal
        isOpen={errorDataModalOpen}
        toggle={() => setErrorDataModalOpen(false)}
        title=" Action  Confirm "
        message={errorModalMessage}
        showClose
      />

      <ConfirmationModal
        show={confirmationModalOpen}
        title="Confirmation"
        message={confirmationMessage}
        onConfirm={handleConfirmSave}
        onCancel={handleCancelSave}
      />

      <EmployeeGenerated
        isOpen={modalGenerated}
        closeModal={closeEmployeeModal}
        toggle={toggleModal}
        modalData={modalData}
        setModalData={setModalData}
        monthFromState={month}
        yearFromState={year}
        onSave={handleEmployeeSave}
      />

      <BulkUpdateModal
        isOpen={bulkUpdateModalOpen}
        toggle={() => {
          setBulkUpdateModalOpen(false);
          setBulkUpdateEmployees([]);
        }}
        employees={bulkUpdateEmployees}
        onSaveAll={handleBulkSaveAll}
        monthFromState={month}
        yearFromState={year}
        loading={bulkUpdateLoading}
      />

      <EmployeePayTabsModal
        isOpen={payModalOpen}
        toggle={() => setPayModalOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loading={loading}
        selectedRow={selectedRow}
        employeeList={EmployeeAndWokinglist}
        onSaveHoliday={handleSaveHolidayPay}
        onSaveBonus={handleSaveBonusPay}
        monthFromState={month}
        yearFromState={year}
        setPayModalOpen={setPayModalOpen}
      />

      <UnsavedPayGuard payData={payData} hideToggle={hideToggle}></UnsavedPayGuard>
    </>
  );
};
export default AddC3Generation;
