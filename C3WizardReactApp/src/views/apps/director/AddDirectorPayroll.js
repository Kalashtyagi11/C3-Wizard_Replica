import { flushSync } from 'react-dom';
import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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
  getC3generation,
  getC3generationNill,
  PreviewDirectorc3,
  PreviewPayroll,
  PreviewPost,
  saveC3generation,
  ViewPayrollDirector,
  OverwritingNWdirector,
  GetNwCheckC3Created,
  UpdateExceptionRow,
} from '../../../store/apps/nonWorkingDirectory/NonWorkingDirectory';

import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import { getEmployee, saveBonus } from '../../../store/apps/C/CSlice';
import {
  editHoliday,
  employeeAndWokingEmployeelist,
  getAllHolidayPayById,
} from '../../../store/apps/cGeneration/holiday';
import NwDirectorEmployee from '../component/NwDirectorEmployee';
import PreviewNWDirectorPayroll from './PreviewNWDirectorPayroll';
import Loader from '../../../layouts/loader/Loader';
import CustomModal from '../component/CustomModal';
import './Toggle.scss';

const AddDirectorPayroll = () => {
  const [previewModalOpenNew, setPreviewModalOpenNew] = useState(false);
  const [errorDataModalOpen, setErrorDataModalOpen] = useState(false);
  const [isNill, setIsNill] = useState(false);
  const [nillSave, setNillSave] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showApiMsg, setShowApiMsg] = useState(true);
  const [showNoRecords, setShowNoRecords] = useState(false);
  const [showYesNoButtons, setShowYesNoButtons] = useState(true);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const CompanyId = localStorage.getItem('companyId');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importList, setImportList] = useState([]);
  const [skipApiCall, setSkipApiCall] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getDate = new Date();
  const [saveData, setSaveData] = useState();
  const currentMonth = getDate.getMonth() + 1;
  const [month, setMonth] = useState(currentMonth < '10' ? `0${currentMonth}` : currentMonth);
  const [year, setyear] = useState(getDate.getFullYear().toString());
  const { message, type } = useSelector((state) => state.messageReducer);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [pageLoading, setPageLoading] = useState('false');
  const [errorExceptionData, setErrorExceptionData] = useState([]);
  const [uploadedFileData, setUploadedFileData] = useState('');
  const [footerCalculate, setFooterCalculate] = useState(null);

  const [loadingException, setLoadingException] = useState(null);
  const [exceptionData, setExceptionData] = useState([]);
  const Unique = localStorage.getItem('userID'); // or however you store it
  const Regular = localStorage.getItem('companyId');
  const [isExceptionUpdated, setIsExceptionUpdated] = useState(false);
  const [calculateValidation, setCalculateValidation] = useState([]);

  const { loadEmployeeList, previewData } = useSelector((state) => state.cGenerationSlice || {});
  const {
    C3GenerationData,
    EditPayrollData,
    loading: reduxLoading,
  } = useSelector((state) => state?.nonWorkingDirectorySlice);

  const isLoadingMain = reduxLoading || pageLoading;
  const [showBackButton, setShowBackButton] = useState(true);
  const [payPeriodSearch, setPayPeriodSearch] = useState('');
  const [saveLoad, setSaveLoad] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const location = useLocation();
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [modalMessage, setModalMessage] = useState('');
  const [exceptionModalMessage, setExceptionModalMessage] = useState('');
  const [headerId, setHeaderId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isModalOpenSubmit, setIsModalOpenSubmit] = useState(false);
  const [apiMsg, setApiMsg] = useState('');
  const [apiMsgNew, setApiMsgNew] = useState('');
  const [monthOther, setMonthOther] = useState('');
  const [yearOther, setYearOther] = useState('');
  const [selectedOptionsOther, setSelectedOptionsOther] = useState([]);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'NW DIRECTOR PAYROLL');
  const canPreviewNWDirectorPayroll = employerPermission?.is_preview;
  const canViewNWDirectorPayroll = employerPermission?.viewPermission;
  const [isActive, setIsActive] = useState(location?.state?.header?.isNilReturn ?? false);
  const hideToggle = location.state?.hideToggle;
  useEffect(() => {
    if (canViewNWDirectorPayroll === false) {
      navigate('/login');
    }
  }, [canViewNWDirectorPayroll, navigate]);

  useEffect(() => {
  
    dispatch(getEmployee(CompanyId));
  }, []);
  const [CmbPayPeriod, setCmbPayPeriod] = useState([]);
  const didFetch = useRef(false);
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
    monthNo: month,
    Year: year,
    dataLoad: CmbPayPeriod,
    isNilReturn: isActive,
  };

  const [disButton, setDisButton] = useState(false);
  useEffect(() => {
    setDisButton(true);
  }, [month, year, CmbPayPeriod]);

  useEffect(() => {
    if (reduxLoading === false) {
      setDisButton(false);
    }
  }, [reduxLoading]);

  const [debouncedValues, setDebouncedValues] = useState({ month, year, CmbPayPeriod });

  const debouncedApiCall = debounce(() => {
    if (skipApiCall) {
      return;
    }

    setPageLoading(true);
    dispatch(getC3generation(apiLoad))
      .then((action) => {
        const payload = action?.payload || {};
        const { msg, isNilReturn } = payload;

        if (msg?.trim() && !location.state) {
          setApiMsg(msg);
          setShowNoRecords(true);
          setIsModalOpenSubmit(true);
        } else {
          setShowNoRecords(false);
        }

        if (typeof isNilReturn !== 'undefined') {
          setIsActive(isNilReturn);
        }
      })
      .catch(() => {
        setShowNoRecords(false);
      })
      .finally(() => {
        setPageLoading(false);
      });
  });

  const debouncedApiCallNew = debounce((payload) => {
    const errorMessage = [];
    const finalApiLoad = {
      ...apiLoad,
      monthNo: payload.month,
      Year: payload.year,
      dataLoad: payload.CmbPayPeriod,
    };

    setMonth(payload.month);
    setyear(payload.year);
    setCmbPayPeriod(payload.CmbPayPeriod);
    const newSelectedOptions = payload.CmbPayPeriod.map((item) => item.key);
    setSelectedOptions(newSelectedOptions);

    setPageLoading(true);
    dispatch(getC3generation(finalApiLoad))
      .then((action) => {
        if (action.payload?.msg && action.payload.msg.trim() !== '' && !location.state) {
          setApiMsgNew(action.payload.msg);
          setIsModalOpenSubmit(true);
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

  useEffect(() => {
    debouncedApiCall();

    return () => debouncedApiCall.cancel();
  }, [debouncedValues]);

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (
      month !== debouncedValues.month ||
      year !== debouncedValues.year ||
      JSON.stringify(CmbPayPeriod) !== JSON.stringify(debouncedValues.CmbPayPeriod)
    ) {
      setDebouncedValues({ month, year, CmbPayPeriod });
    }
  }, [month, year, CmbPayPeriod]);

  const [selectData, setSelectData] = useState(C3GenerationData.map((item) => item.employeeId));

  useEffect(() => {
    if (C3GenerationData.length > 0) {
      setSelectData(C3GenerationData.map((item) => item.employeeId));
    }
  }, [C3GenerationData]);

  useEffect(() => {
    // If in Edit mode, do nothing
    if (location.state) return;

    // ADD mode → set previous month/year
    const today = new Date();
     today.setDate(1); // 👈 IMPORTANT
    today.setMonth(today.getMonth() - 1);

    setMonth(String(today.getMonth() + 1).padStart(2, '0')); // '01' to '12'
    setyear(String(today.getFullYear()));
  }, []);


  

  // useEffect(
  //   () => {
  //     if (location.state) {
  //       setSelectData(location?.state?.dataEdit?.map((item) => item?.employeeId));

  //       setData(
  //         location?.state?.dataEdit.map((x) => ({
  //           ...x,
  //           wageS1: (+x.wageS1).toFixed(2),
  //           wageS2: (+x.wageS2).toFixed(2),
  //           wageS3: (+x.wageS3).toFixed(2),
  //           wageS4: (+x.wageS4).toFixed(2),
  //           wageS5: (+x.wageS5).toFixed(2),
  //         })),
  //       );

  //       setMonth(
  //         location.state.header.period_Month.length === 1
  //           ? `0${location.state.header.period_Month}`
  //           : location.state.header.period_Month,
  //       );
  //       setyear(location.state.header.period_year);
  //       const filteredData = data.filter((item) => item.isemployeeDirector === false);
  //       const uniquePayPeriods = [...new Set(filteredData.map((item) => item.payPeriod))];
  //       setSelectedOptions(uniquePayPeriods);

  //       if (Array.isArray(location.state.popUpList) && location.state.popUpList.length > 0) {
  //         setShowImportModal(true);
  //         setImportList(location.state.popUpList);
  //       }
  //     } else {
  //       if (C3GenerationData.length === 0) {
  //         setSelectData([]);
  //       }
  //       setData(C3GenerationData);
  //     }

  
  //     // }, []);
  //   },
  //   location.state ? [] : [C3GenerationData],
  // );

  useEffect(
    () => {
      if (location.state) {
        // ------------------ SAFE EDIT MODE ------------------
        setSelectData(location?.state?.dataEdit?.map((item) => item?.employeeId) || []);

        setData(
          (location?.state?.dataEdit || []).map((x) => ({
            ...x,
            wageS1: (+x.wageS1 || 0).toFixed(2),
            wageS2: (+x.wageS2 || 0).toFixed(2),
            wageS3: (+x.wageS3 || 0).toFixed(2),
            wageS4: (+x.wageS4 || 0).toFixed(2),
            wageS5: (+x.wageS5 || 0).toFixed(2),
          })),
        );

        setMonth(
          location.state?.header?.period_Month?.length === 1
            ? `0${location.state.header.period_Month}`
            : location.state?.header?.period_Month,
        );

        setyear(location.state?.header?.period_year || '');

        const filteredData = (data || []).filter((item) => item.isemployeeDirector === false);

        const uniquePayPeriods = [...new Set(filteredData.map((item) => item.payPeriod))];

        setSelectedOptions(uniquePayPeriods || []);

        if (Array.isArray(location.state?.popUpList) && location.state.popUpList.length > 0) {
          setShowImportModal(true);
          setImportList(location.state.popUpList);
        }

        // --------------------------------------------------------------
        // ⭐ SAFE ADD-ON (No map errors)
        // --------------------------------------------------------------
        if (hideToggle === false && location.state?.uploadedData) {
          const uploadedData = location.state?.uploadedData?.postReq;
          setMonth(uploadedData?.monthno || '');
          const uploadedDataException = (location.state?.uploadedData?.exceptionList || []).map(
            (x) => ({
              ...x,
              wageS1: (+x.wageS1 || 0).toFixed(2),
              wageS2: (+x.wageS2 || 0).toFixed(2),
              wageS3: (+x.wageS3 || 0).toFixed(2),
              wageS4: (+x.wageS4 || 0).toFixed(2),
              wageS5: (+x.wageS5 || 0).toFixed(2),
            }),
          );

          setErrorExceptionData(location.state?.uploadedData?.exceptionList || []);
          setUploadedFileData(uploadedData?.c3FilePath || '');
          setFooterCalculate(uploadedData?.footerCalcuations || null);
          setExceptionData(uploadedDataException || []);

          const list = uploadedData?.allEmployeeList_List || [];

          if (Array.isArray(list)) {
            const formattedData = list.map((x) => ({
              ...x,
              wageS1: (+x.wageS1 || 0).toFixed(2),
              wageS2: (+x.wageS2 || 0).toFixed(2),
              wageS3: (+x.wageS3 || 0).toFixed(2),
              wageS4: (+x.wageS4 || 0).toFixed(2),
              wageS5: (+x.wageS5 || 0).toFixed(2),
            }));

            setMonth(uploadedData.monthno?.toString().padStart(2, '0') || '');
            setyear(uploadedData.year || '');

            setData(formattedData || []);
            // setSelectData(list.map((item) => item.employeeId) || []);
            setSelectData([...new Set(list.map((item) => item.employeeId))]);
          }
        }
        // --------------------------------------------------------------
      } else {
        // ---------------- SAFE ADD MODE ---------------------
        if (C3GenerationData.length === 0) {
          setSelectData([]);
        }
        setData(C3GenerationData || []);
      }

     
    },
    // location.state ? [] : [C3GenerationData],
    // isExceptionUpdated ? [location.state] : [location.state, C3GenerationData],
    hideToggle === false
      ? isExceptionUpdated
        ? [location.state]
        : [location.state, C3GenerationData]
      : location.state
      ? []
      : [C3GenerationData],
  );

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

  const handleCheckAllChangeModal = ({ target: { checked } }) => {
    if (checked) {
      setSelectedOptionsOther(optionsOther.map((o) => o.label)); // all options except "All"
    } else {
      setSelectedOptionsOther([]);
    }
  };

  const handleCheckBoxChangeModal = ({ target: { checked, id } }) => {
    const value = optionsOther.find((o) => o.id === id)?.label;

    if (!value) return;

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
    if (selectedOptions.length === 0) return 'All';
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

  function weekData(employeeId, labletype, value) {
    setData((prev) => {
      return prev.map((item) => {
        if (item.employeeId === employeeId) {
          return {
            ...item,
            [labletype]: value,
          };
        }
        return item;
      });
    });
   
  }
  const [filterSSN, setFilterSSN] = useState('');

  function selectDataItem(id) {
    setSelectData((prev) => {
      const prevIdsMap = prev.map((item) => item);
      if (prevIdsMap.includes(id)) {
        return prev.filter((item) => item !== id); // Remove item ID
      }
      return [...prev, id];
    });
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermDepartment, setSearchTermDepartment] = useState('');

  const handleSSNChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleDepartSearch = (e) => {
    setSearchTermDepartment(e.target.value.toLowerCase());
  };
  const [payPeriods, setPayPeriods] = useState([]);

  const filteredPayPeriods = payPeriods.filter((period) =>
    period.toLowerCase().includes(payPeriodSearch.toLowerCase()),
  );

  useEffect(() => {
    let filtered = data.filter(
      (item) =>
        item.ssnd.toLowerCase().includes(searchTerm) ||
        item.employeeName.toLowerCase().includes(searchTerm),
    );
    if (searchTermDepartment) {
      filtered = filtered.filter((item) =>
        item.department?.toLowerCase().includes(searchTermDepartment),
      );
    }

    const uniquePayPeriods = [...new Set(filtered.map((item) => item.payPeriod))];
    setPayPeriods(uniquePayPeriods);
  }, [data, searchTerm, searchTermDepartment]);

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      // Select all employees - add all employee IDs to selectData
      const allEmployeeIds = data.map((item) => item.employeeId);
      setSelectData(allEmployeeIds);
    } else {
      // Unselect all employees - clear selectData
      setSelectData([]);
    }
  };

  // const filteredData = (period) => {
  //   let filtered = data
  //     .filter((item) => item.payPeriod === period)
  //     .filter(
  //       (item) =>
  //         item.ssnd.toLowerCase().includes(searchTerm) ||
  //         item.employeeName.toLowerCase().includes(searchTerm),
  //     );

  //   // Apply sorting
  //   if (sortCriteria) {
  //     filtered = [...filtered].sort((a, b) => {
  //       if (a[sortCriteria] < b[sortCriteria]) return sortOrder === 'asc' ? -1 : 1;
  //       if (a[sortCriteria] > b[sortCriteria]) return sortOrder === 'asc' ? 1 : -1;
  //       return 0;
  //     });
  //   }

  //   return filtered;
  // };

  const filteredData = (period, rows = data) => {
    let filtered = rows
      .filter((item) => {
        // Only filter by period if provided
        if (period) return item.payPeriod === period;
        return true;
      })
      .filter(
        (item) =>
          (item.ssnd || '')?.toLowerCase().includes(searchTerm) ||
          (item.employeeName || '')?.toLowerCase().includes(searchTerm),
      );

    if (searchTermDepartment) {
      filtered = filtered.filter((item) =>
        (item.department || '')?.toLowerCase().includes(searchTermDepartment),
      );
    }

    // if (searchTermPeriod) {
    //   filtered = filtered.filter((item) =>
    //     (item.payPeriod || '')?.toLowerCase().includes(searchTermPeriod),
    //   );
    // }

    // Apply sorting
    if (sortCriteria) {
      filtered = [...filtered].sort((a, b) => {
        if ((a[sortCriteria] || '') < (b[sortCriteria] || '')) return sortOrder === 'asc' ? -1 : 1;
        if ((a[sortCriteria] || '') > (b[sortCriteria] || '')) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const handleSort = (criteria) => {
    if (sortCriteria === criteria) {
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
    // MonthName: month.toString(),
    MonthName: month ? month.toString() : '',

    Year: year,
    IsLevyExempt: false,
    isrecordEdit: false,
    TextChanged: 'rphit',
    ListHavingItems: false,
    User_Name: 'rohit',
    UserID: localStorage.getItem('userID'),
    // H_Id: location.state === null ? 0 : location.state.header.headerID,
    H_Id: location?.state?.header?.headerID || 0,
  };

  const [previewShow, setPreviewShow] = useState(false);
  const [previewDatapayload, setPreviewDatapayload] = useState([]);
  const [apiLoadDataPayLoad, setApiLoadDataPayLoad] = useState([]);
  const [previewLoad, setpreviewLoad] = useState(false);
  const [isSubmittedNill, setIsSubmittedNill] = useState(true); // Set to true to show submitted status
  const selected = exceptionData.filter((item) => item.isSelected);

  function preview() {
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

    setpreviewLoad(true);

    let selectedItems = [];

    CmbPayPeriod.forEach((payPeriod) => {
      if (payPeriod.value !== 'All') {
        const period = payPeriod.key;
        const filtered = filteredData(period);

       

        const transformedData = filtered.map((filterItem) => ({
          BirthDate: filterItem.birthDate,
          C3HEADERID: filterItem.c3HEADERID,
          Date_Joining: filterItem.date_Joining === null ? '' : filterItem.date_Joining,
          Date_terminated: filterItem.date_terminated === null ? '' : filterItem.date_terminated,
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
          ssnd: filterItem.ssnd,
        }));

        const itemsForPeriod = transformedData.filter((item) =>
          selectData.includes(item.EmployeeId),
        );

        // selectedItems = [...selectedItems, ...itemsForPeriod];
        selectedItems.push(...itemsForPeriod);
      }
    });

    selectedItems = selectedItems.filter(
      (emp, index, arr) => index === arr.findIndex((e) => e.EmployeeId === emp.EmployeeId),
    );
    // 1️⃣ User has data but selected NOTHING → show toast only
    if (data.length > 0 && selectedItems.length === 0 && hideToggle === false) {
      toast.error('Please select at least one employee with corrected data.');
      setpreviewLoad(false);
      return;
    }

    // 2️⃣ No valid data (exception case) → open modal
    if (data.length === 0 && selectedItems.length === 0 && hideToggle === false) {
      setExceptionModalMessage('All employee data is incorrect, so you can’t preview it.');
      setPreviewModalOpenNew(true);
      setpreviewLoad(false);
      return;
    }

    setSelectDataJson(selectedItems);

    const apiLoadData = {
      ...previewDataLoad,
      CmbPayPeriod,
      AllEmployeeList_List: selectedItems,
      is_preview: true,
      isSave: false,
      IsLevyExempt: localStorage.getItem('isLevyExempt') === 'true',
      OrderName: sortCriteria,
      OrderKey: sortOrder,
      isNilReturn: isActive,
      c3FilePath: uploadedFileData,
      footerCalcuations: footerCalculate,
    };

    
    setApiLoadDataPayLoad(apiLoadData);
    dispatch(PreviewDirectorc3(apiLoadData))
      .unwrap()
      .then((response) => {
      
        const cloneValidation = JSON.parse(
          JSON.stringify(response?.PreviewDirectorc3Data?.calculationsValidation || []),
        );

        setCalculateValidation(cloneValidation);
        if (response?.PreviewDirectorc3Data?.status === true) {
          setpreviewLoad(false);
          setPreviewShow(true);
          setPreviewDatapayload({
            ...response?.PreviewDirectorc3Data?.data,
            isSubmittedNill,
          });
          setSaveData(apiLoadData);
        } else {
          setpreviewLoad(false);
          toast.error(response?.PreviewDirectorc3Data.message);
        }
      })

      .catch((error) => {
        setpreviewLoad(false);
        toast.error(error);
      });
  }

  const save = () => {
    const errorMessage = [];
    if (location?.state?.isNilReturn === false) {
      if (month === '') errorMessage.push('Month');
      if (year === '') errorMessage.push('Year');
      const found = CmbPayPeriod.find((item) => item.key === 'All');
      if (found) errorMessage.push('Pay Period');
      if (selectData.length === 0) errorMessage.push('employees');

      if (errorMessage.length) {
        toast.error(`Please Select  ${errorMessage.join(', ').replace(/, ([^,]*)$/, ' & $1')}`);
        return; // Prevent the function from continuing
      }
    }

    setSaveLoad(true);
    let selectedItems = [];

    CmbPayPeriod.forEach((payPeriod) => {
      if (payPeriod.value !== 'All') {
        const period = payPeriod.key;
        const filtered = filteredData(period);
     
        const transformedData = filtered.map((filterItem) => ({
          BirthDate: filterItem.birthDate,
          C3HEADERID: filterItem.c3HEADERID,
          Date_Joining: filterItem.date_Joining === null ? '' : filterItem.date_Joining,
          Date_terminated: filterItem.date_terminated === null ? '' : filterItem.date_terminated,
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
          ssnd: filterItem.ssnd,
        }));

        const itemsForPeriod = transformedData.filter((item) =>
          selectData.includes(item.EmployeeId),
        );

        // selectedItems = [...selectedItems, ...itemsForPeriod];
        selectedItems.push(...itemsForPeriod);
      }
    });

    selectedItems = selectedItems.filter(
      (emp, index, arr) => index === arr.findIndex((e) => e.EmployeeId === emp.EmployeeId),
    );

    if (data.length > 0 && selectedItems.length === 0 && hideToggle === false) {
      toast.error('Please select at least one employee with corrected data.');
      setShowModal(false);
      setSaveLoad(false);

      return;
    }

    if (selectedItems.length === 0 && hideToggle === false) {
      setExceptionModalMessage('All employee data is incorrect, so you can’t save it.');
      setPreviewModalOpenNew(true); // open modal even if nothing is selected
      setShowModal(false);
      setSaveLoad(false);
      return;
    }

    setSelectDataJson(selectedItems);

    const apiLoadData = {
      ...previewDataLoad,
      CmbPayPeriod,
      AllEmployeeList_List: selectedItems,
      is_preview: false,
      isSave: true,
      IsLevyExempt: localStorage.getItem('isLevyExempt') === 'true',
      OrderName: sortCriteria,
      OrderKey: sortOrder,
      isNilReturn: isActive,
      c3FilePath: '',
    };
   
    dispatch(PreviewDirectorc3(apiLoadData))
      .unwrap()
      .then((response) => {
        if (response?.PreviewDirectorc3Data?.status === true) {
          navigate('/apps/director/NwDirectorPayroll');
          setSaveLoad(false);
        } else {
          toast.error(response?.PreviewDirectorc3Data.message);
        }
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setSaveLoad(false);
      });
  };

  const updateSelectedData = (selectedItems) => {
    if (didFetch.current) return; // ⛔ stops second render call
    didFetch.current = true;

    setSelectDataJson(selectedItems); // ✅ WILL NOT RUN TWICE
  };

  useEffect(() => {}, [selectData]);

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const [employeessn, setEmployeessn] = useState('');
  const [payDates, setPayDate] = useState('');
  const [amount, setAmount] = useState('');
  const [payIds, setPayId] = useState('');

  const { CList, employee } = useSelector((state) => state.cSlice);

  function saveBonusApi() {
    dispatch(saveBonus({ employeessn, payDate: payDates, amount, companyId: CompanyId }))
      .unwrap()
      .then((response) => {
        dispatch(getC3generation(apiLoad));
        setModal(!modal);

        toast.success(response.saveBonusResponse.message);
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
    dispatch(getAllHolidayPayById({ holidayPayId, CompanyId }))
      .unwrap()
      .then((response) => {
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
    dispatch(editHoliday(hapiLoad))
      .unwrap()
      .then((response) => {
        toast.success(response.editHolidayResponse.message);
        dispatch(getC3generation(apiLoad));
        Htoggles();
      })
      .catch((e) => {
        toast.success('something went wrong');
        setIsEdit(false);
      });
  }

  const saveAndSubmit = () => {
    if (!selectData || (selectData.length === 0 && location?.state?.isNilReturn === false)) {
      toast.error('Please select at least one employee.');
      return;
    }

    const newData = {
      CompanyId,
      Year: year,
      Month: month,
    };

    setSaveLoading(true);

    dispatch(GetNwCheckC3Created(newData))
      .unwrap()
      .then((response) => {
        if (response.NwCheckC3CreatedData.status === true) {
          setShowModal(!showModal);
          setModalMessage(response.NwCheckC3CreatedData.message);
          setHeaderId(response.NwCheckC3CreatedData.data);
        } else {
          setHeaderId('');
          save();
        }
      })
      .catch((error) => {
       console.error('Something went wrong:', error);
      })
      .finally(() => {
        setSaveLoading(false); // ✅ Wrapped in a function
      });
  };

  function handleSaveClick() {
    const selectedRows = exceptionData.filter((x) => x.isSelected);
    if (selectedRows.length > 0) {
      setErrorDataModalOpen(true);
      return;
    }

    saveAndSubmit();
  }

  const handleYes = () => {
    const errorMessage = [];
    if (month === '') errorMessage.push('Month');
    if (year === '') errorMessage.push('Year');
    const found = CmbPayPeriod.find((item) => item.key === 'All');
    if (found) errorMessage.push('Pay Period');
    if (selectData.length === 0) errorMessage.push('employees');

    if (errorMessage.length) {
      toast.error(`Please Select  ${errorMessage.join(', ').replace(/, ([^,]*)$/, ' & $1')}`);
      return; // Prevent the function from continuing
    }

    setSaveLoad(true);
    let selectedItems = [];

    // Iterate over each pay period in CmbPayPeriod (excluding "All")
    CmbPayPeriod.forEach((payPeriod) => {
      if (payPeriod.value !== 'All') {
        const period = payPeriod.key; // Use the pay period key (e.g., "Weekly", "Monthly")
        const filtered = filteredData(period); // Filter data for this pay period
        const transformedData = filtered.map((filterItem) => ({
          BirthDate: filterItem.birthDate,
          C3HEADERID: filterItem.c3HEADERID,
          Date_Joining: filterItem.date_Joining === null ? '' : filterItem.date_Joining,
          Date_terminated: filterItem.date_terminated === null ? '' : filterItem.date_terminated,
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
          ssnd: filterItem.ssnd,
        }));
        const itemsForPeriod = transformedData.filter((item) =>
          selectData.includes(item.EmployeeId),
        );

        selectedItems = [...selectedItems, ...itemsForPeriod];
      }
    });

    setSelectDataJson(selectedItems);

    const payload = {
      ...previewDataLoad,
      CmbPayPeriod,
      AllEmployeeList_List: selectedItems,
      is_preview: false,
      isSave: true,
      H_Id: headerId,
      IsLevyExempt: localStorage.getItem('isLevyExempt') === 'true',
      OrderName: sortCriteria,
      OrderKey: sortOrder,
    };
    dispatch(OverwritingNWdirector(payload))
      .unwrap()
      .then((res) => {
      
        setShowModal(false);
        // navigate('/apps/director/generateC3');
      })
      .catch((err) => {
        console.error('Something went wrong:', err);
      })
      .finally(() => {
        setSaveLoad(false);
      });
  };

  function handleNo() {
    setShowModal(false);
    setIsModalOpenSubmit(false);
    setShowBackButton(true);
    setShowForm(true);
  }

  const handleBack = () => {
    setShowApiMsg(true);
    setShowYesNoButtons(true);
    setShowBackButton(false);
    setShowForm(false);
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
    }
  };

  const handleNoClick = () => {
    setShowApiMsg(false);
    setApiMsgNew('');
    setShowYesNoButtons(false);
    setShowBackButton(true);
    setShowForm(true);
  };

  const AlreadySubmit = () => {
    setIsModalOpenSubmit(false);
    setShowNoRecords(false);
  };

  useEffect(() => {
    if (location?.state?.header?.isNilReturn !== undefined) {
      setIsActive(location.state.header.isNilReturn);
    }
  }, [location?.state?.header?.isNilReturn]);

  if (previewShow) {
    return (
      <PreviewNWDirectorPayroll
        data={previewDatapayload}
        apiLoadData={apiLoadDataPayLoad}
        ValidateData={calculateValidation}
        ErrorDataAPI={selected}
        previewShow={setPreviewShow}
      />
    );
  }

  const handleConfirmImport = async (selectedSSNs) => {
    setSkipApiCall(true);
    setIsLoading(true);

    try {
      const response = await dispatch(
        ViewPayrollDirector({
          headerID: location.state.header.headerID,
          CompanyId,
          monthno: month,
          Year: year,
          popUpList: selectedSSNs,
        }),
      ).unwrap();

      // Step 3: Format the API response data
      const updatedDataFromAPI =
        response?.EditPayrollData?.dataEdit?.map((x) => ({
          ...x,
          wageS1: (+x.wageS1).toFixed(2),
          wageS2: (+x.wageS2).toFixed(2),
          wageS3: (+x.wageS3).toFixed(2),
          wageS4: (+x.wageS4).toFixed(2),
          wageS5: (+x.wageS5).toFixed(2),
        })) || [];

      const originalData = data || [];

      const mergedData = [
        ...updatedDataFromAPI,
        ...originalData.filter(
          (orig) => !updatedDataFromAPI.some((upd) => upd.employeeId === orig.employeeId),
        ),
      ];

      flushSync(() => {
        setData(mergedData);
        setSelectData(mergedData.map((item) => item.employeeId));
      });

      const importedPayPeriods = [...new Set(mergedData.map((item) => item.payPeriod))];
      const updatedSelectedOptions = [...new Set([...selectedOptions, ...importedPayPeriods])];
      setSelectedOptions(updatedSelectedOptions);

      dispatch({
        type: 'IMPORT_EMPLOYEES',
        payload: selectedSSNs,
      });
      if (updatedDataFromAPI.length > 0) {
        toast.success('Successfully added!');
      }
    } catch (error) {
      toast.error('Failed to import employees');
    } finally {
      setIsLoading(false);
      setShowImportModal(false);

      setTimeout(() => {
        setSkipApiCall(false);
      }, 500);
    }
  };

  const handleToggle = () => {
    setIsActive(!isActive);
    setIsNill(true);
  };

  const AllNill = async () => {
    const apiData = {
      CompanyId,
      monthNo: month,
      Year: year,
      isNilReturn: isActive,
      dataLoad: CmbPayPeriod,
    };

    try {
      setNillSave(true);
      const response = await dispatch(getC3generationNill(apiData)).unwrap();

      if (response?.msg) {
        setIsNill(false);
      }
      const editResponse = await dispatch(
        ViewPayrollDirector({
          headerID: location.state.header.headerID,
          CompanyId,
          monthno: month,
          Year: year,
          isNilReturn: isActive,
        }),
      ).unwrap();

      const formattedData = editResponse?.EditPayrollData?.dataEdit?.map((x) => ({
        ...x,
        wageS1: (+x.wageS1).toFixed(2),
        wageS2: (+x.wageS2).toFixed(2),
        wageS3: (+x.wageS3).toFixed(2),
        wageS4: (+x.wageS4).toFixed(2),
        wageS5: (+x.wageS5).toFixed(2),
      }));

      setData(formattedData);
      setSelectData(editResponse?.EditPayrollData?.dataEdit.map((item) => item.employeeId));
      setMonth(editResponse?.EditPayrollData?.header?.period_Month ?? []);
      setyear(editResponse?.EditPayrollData?.header?.period_year ?? []);

      const dataEdit = editResponse?.EditPayrollData?.dataEdit.filter(
        (item) => item.isemployeeDirector === false,
      );
      const uniquePayPeriods = [...new Set(dataEdit.map((item) => item.payPeriod))];

      setSelectedOptions(uniquePayPeriods);
    } catch (error) {
        console.error('Something went wrong:', error);
    } finally {
      setNillSave(false);
      setIsNill(false);
    }
  };

  const CloseModal = () => {
    setIsNill(!isNill);
    setIsActive(!isActive);
  };

  const tableHeaders =
    calculateValidation && calculateValidation.length > 0
      ? Object.keys(calculateValidation[0])
      : [];

  const payPeriodMap = {
    W: 'W - Weekly',
    M: 'M - Monthly',
    E2W: 'E2W - Every Two Weeks',
    '2M': '2M - Twice Monthly',
  };

  const handleExceptionChange = (index, field, value) => {
    setExceptionData((prev) => {
      if (!prev || prev.length === 0) return prev;

      const updated = [...prev];

      if (index < 0 || index >= updated.length) return prev;

      const currentRow = updated[index];

      // Recalculate payPeriod only when field is payFreq
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

  const moveExceptionToMain = (index) => {
    const fixedRow = exceptionData[index];
    if (!fixedRow) return;

    setExceptionData((prev) => prev.filter((_, i) => i !== index));

    setData((prev) => [...prev, fixedRow]);

    setSelectData((prev) => [...new Set([...prev, fixedRow.employeeId])]);
  };

  const updateExceptionRow = async (row) => {
    const duplicate =
      exceptionData.some((r) => r.ssnd === row.ssnd && r.employeeId !== row.employeeId) ||
      data.some((r) => r.ssnd === row.ssnd && r.employeeId !== row.employeeId);

    if (duplicate) {
      toast.error('SSN already exists in another row!');
      return; // Stop execution if duplicate
    }
    if (!row.payFreq) {
      toast.error('Please select Pay Period!');
      return;
    }
    if (!row.ssnd) {
      toast.error('SSN is required!');
      return;
    }
    if (!row.employeeName) {
      toast.error('Employee Name is required!');
      return;
    }
    try {
      setLoadingException(row.ssnd);

      const payload = {
        contid: row.contid || 0,
        c3HEADERID: row.c3HEADERID || 0,
        ssnd: row.ssnd,
        ssn: row.ssn,
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
        setExceptionData((prev) => prev.filter((r) => String(r.ssnd) !== String(updatedRow.ssnd)));
        // setExceptionData((prev) => [...prev, updatedRow]);
        setErrorExceptionData((prev) => {
          const filtered = prev.filter((r) => String(r.ssnd) !== String(updatedRow.ssnd));
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
        setSearchTerm('');
        setSearchTermDepartment('');
        setSearchTerm('');

        // setExceptionData([]);
        // setErrorExceptionData([]);
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      const error = err?.data?.data?.[0] || {};
      setExceptionData((prev) =>
        prev.map((r) =>
          String(r.ssnd) === String(error.ssnd)
            ? { ...r, validateMsg: error.validateMsg || 'Validation failed' }
            : r,
        ),
      );
      toast.error(err.message);
    } finally {
      setLoadingException(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Direct Payroll C3 Generation - C3Wizard</title>
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
                  <Link to="/dashboard" className="d-flex align-items-center gap-1 text-muted">
                    <i className="ti-home" />
                    Dashboard{' '}
                  </Link>
                </li>
                <li>-</li>
                <li className="fw-medium">
                  <span className="d-flex align-items-center gap-1 text-muted">
                    Nw Direct Payroll
                  </span>
                </li>
                <li>-</li>
                <li className="fw-medium">{location.state ? 'Edit' : 'Add'} Nw Director Payroll</li>
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
                                  {location.state ? 'Edit' : 'Add '} Nw Director Payroll
                                </h4>
                              </div>
                              <div className="col-md-2 col-lg-2 col-xl-2"></div>
                              <div className="col-md-2 col-lg-2 col-xl-2">
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
                              <div className="col-md-5 col-lg-5 col-xl-5">
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
                              <div className="col-md-5    col-lg-5 col-xl-5">
                                <Label>Pay Period</Label>
                                <div className="mb-3">
                                  {location.state ? (
                                    <div
                                      className="dropdown form-select p-0 px-4 4 open"
                                      style={{ background: '#e9ecef' }}
                                    >
                                      <div
                                        className="dropdown-label drop_custom"
                                        onClick={handleLabelClick}
                                        style={{
                                          background: '#e9ecef',
                                          lineHeight: '45px !important',
                                        }}
                                      >
                                        {getLabelText()}
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
                                          lineHeight: '45px !important',
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
                                              All
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
                                                style={{ lineHeight: '45px !important' }}
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
                              <div className="col-md-4 col-12 text-lg-end"></div>
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
                                  value={searchTerm}
                                  onChange={handleSSNChange}
                                  // onChange={(e) => handleSSNChange(e)}
                                />
                              </div>
                              <div className="col-md-3 col-12 text-lg-end">
                                <input
                                  type="text"
                                  className="form-control custom d-inline"
                                  placeholder="Search by Department"
                                  value={searchTermDepartment}
                                  onChange={handleDepartSearch}
                                  // onChange={(e) => handleDepartSearch(e)}
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
                                {canPreviewNWDirectorPayroll ? (
                                  <Button
                                    className="btn btn-info waves-effect waves-light h-45"
                                    type="button"
                                    onClick={() => preview()}
                                  >
                                    {previewLoad === true ? (
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
                                    className="btn btn-info  h-45"
                                    type="button"
                                    style={{ cursor: 'not-allowed', opacity: 0.4 }}
                                  >
                                    <i className="far fa-eye"></i>
                                    &nbsp; Preview
                                  </Button>
                                )}

                                <button
                                  className="btn btn-success waves-effect waves-light h-45"
                                  type="button"
                                  disabled={saveLoading}
                                  // onClick={() => saveAndSubmit()}
                                  onClick={() => handleSaveClick()}
                                >
                                  {saveLoading ? (
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
                            <div className="table-container Bg_addon table_wrap">
                              <table className="table table-hover mb-0">
                                <thead>
                                  <tr className="border-b">
                                    <th scope="row">
                                      {' '}
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
                                      style={{ cursor: 'pointer', minWidth: '80px' }}
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
                                      style={{
                                        cursor: 'pointer',
                                        maxWidth: '80px',
                                        minWidth: '80px',
                                      }}
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

                                    <th width="15%">Remarks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {showNoRecords || isModalOpenSubmit ? (
                                    <tr>
                                      <td colSpan="15" className="text-center py-4">
                                        No director data available.
                                      </td>
                                    </tr>
                                  ) : (
                                    <>
                                      {filteredPayPeriods.map((period) => (
                                        <React.Fragment key={period}>
                                          {/* Render header for each payPeriod */}
                                          <tr className="bg-light">
                                            <td className="bg-light f-600 text-dark" colSpan="18">
                                              {period}
                                            </td>
                                          </tr>

                                          {filteredData(period).map((item) => (
                                            <tr key={item.employeeId}>
                                              <td>
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  checked={selectData.includes(item.employeeId)}
                                                  id="defaultCheck1"
                                                  onChange={(e) =>
                                                    e.target.checked
                                                      ? selectDataItem(item.employeeId)
                                                      : selectDataItem(item.employeeId)
                                                  }
                                                />
                                              </td>
                                              <td>{item.ssnd || item.ssn}</td>
                                              <td>{item.employeeName}</td>

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
                                                <div className="input-group">
                                                  <div className="input-group-text">
                                                    <input
                                                      className="form-check-input mt-0"
                                                      type="checkbox"
                                                      checked={item.weeK1}
                                                      onChange={(e) => {
                                                        weekData(
                                                          item.employeeId,
                                                          'weeK1',
                                                          e.target.checked,
                                                        );
                                                        if (!item.weeK1 === false) {
                                                          weekData(
                                                            item.employeeId,
                                                            'wageS1',
                                                            '0.00',
                                                          );
                                                        } else {
                                                          weekData(
                                                            item.employeeId,
                                                            'wageS1',
                                                            C3GenerationData.find(
                                                              (filt) =>
                                                                filt.employeeId === item.employeeId,
                                                            ).wageS1,
                                                          );
                                                        }
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
                                                          item.employeeId,
                                                          'wageS1',
                                                          formattedValue === ''
                                                            ? '0.00'
                                                            : formattedValue,
                                                        );
                                                        if (formattedValue === '') {
                                                          weekData(item.employeeId, 'weeK1', false);
                                                        }
                                                      }
                                                    }}
                                                    onBlur={() => {
                                                      const val = parseFloat(
                                                        item.wageS1 || 0,
                                                      ).toFixed(2);
                                                      weekData(item.employeeId, 'wageS1', val);
                                                    }}
                                                    onKeyDown={(e) => {
                                                      if (e.key === 'Enter') {
                                                        const val = parseFloat(
                                                          item.wageS1 || 0,
                                                        ).toFixed(2);
                                                        weekData(item.employeeId, 'wageS1', val);
                                                      }
                                                    }}
                                                  />
                                                </div>
                                              </td>
                                              <td>
                                                <div className="input-group">
                                                  <div className="input-group-text">
                                                    <input
                                                      className="form-check-input mt-0"
                                                      type="checkbox"
                                                      checked={item.weeK2}
                                                      onChange={(e) => {
                                                        weekData(
                                                          item.employeeId,
                                                          'weeK2',
                                                          e.target.checked,
                                                        );
                                                        if (!item.weeK2 === false) {
                                                          weekData(
                                                            item.employeeId,
                                                            'wageS2',
                                                            '0.00',
                                                          );
                                                        } else {
                                                          weekData(
                                                            item.employeeId,
                                                            'wageS2',
                                                            C3GenerationData.find(
                                                              (filt) =>
                                                                filt.employeeId === item.employeeId,
                                                            ).wageS2,
                                                          );
                                                        }
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
                                                          item.employeeId,
                                                          'wageS2',
                                                          formattedValue === ''
                                                            ? '0.00'
                                                            : formattedValue,
                                                        );
                                                        if (formattedValue === '') {
                                                          weekData(item.employeeId, 'weeK2', false);
                                                        }
                                                      }
                                                    }}
                                                    onBlur={() => {
                                                      const val = parseFloat(
                                                        item.wageS2 || 0,
                                                      ).toFixed(2);
                                                      weekData(item.employeeId, 'wageS2', val);
                                                    }}
                                                    onKeyDown={(e) => {
                                                      if (e.key === 'Enter') {
                                                        const val = parseFloat(
                                                          item.wageS2 || 0,
                                                        ).toFixed(2);
                                                        weekData(item.employeeId, 'wageS2', val);
                                                      }
                                                    }}
                                                  />
                                                </div>
                                              </td>
                                              <td>
                                                <div className="input-group">
                                                  <div className="input-group-text">
                                                    <input
                                                      className="form-check-input mt-0"
                                                      type="checkbox"
                                                      checked={item.weeK3}
                                                      onChange={(e) => {
                                                        weekData(
                                                          item.employeeId,
                                                          'weeK3',
                                                          e.target.checked,
                                                        );
                                                        if (!item.weeK3 === false) {
                                                          weekData(
                                                            item.employeeId,
                                                            'wageS3',
                                                            '0.00',
                                                          );
                                                        } else {
                                                          weekData(
                                                            item.employeeId,
                                                            'wageS3',
                                                            C3GenerationData.find(
                                                              (filt) =>
                                                                filt.employeeId === item.employeeId,
                                                            ).wageS3,
                                                          );
                                                        }
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
                                                          item.employeeId,
                                                          'wageS3',
                                                          formattedValue === ''
                                                            ? '0.00'
                                                            : formattedValue,
                                                        );
                                                        if (formattedValue === '') {
                                                          weekData(item.employeeId, 'weeK3', false);
                                                        }
                                                      }
                                                    }}
                                                    onBlur={() => {
                                                      const val = parseFloat(
                                                        item.wageS3 || 0,
                                                      ).toFixed(2);
                                                      weekData(item.employeeId, 'wageS3', val);
                                                    }}
                                                    onKeyDown={(e) => {
                                                      if (e.key === 'Enter') {
                                                        const val = parseFloat(
                                                          item.wageS3 || 0,
                                                        ).toFixed(2);
                                                        weekData(item.employeeId, 'wageS3', val);
                                                      }
                                                    }}
                                                  />
                                                </div>
                                              </td>
                                              <td>
                                                <div className="input-group">
                                                  <div className="input-group-text">
                                                    <input
                                                      className="form-check-input mt-0"
                                                      type="checkbox"
                                                      checked={item.weeK4}
                                                      onChange={(e) => {
                                                        weekData(
                                                          item.employeeId,
                                                          'weeK4',
                                                          e.target.checked,
                                                        );
                                                        if (!item.weeK4 === false) {
                                                          weekData(
                                                            item.employeeId,
                                                            'wageS4',
                                                            '0.00',
                                                          );
                                                        } else {
                                                          weekData(
                                                            item.employeeId,
                                                            'wageS4',
                                                            C3GenerationData.find(
                                                              (filt) =>
                                                                filt.employeeId === item.employeeId,
                                                            ).wageS4,
                                                          );
                                                        }
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
                                                          item.employeeId,
                                                          'wageS4',
                                                          formattedValue === ''
                                                            ? '0.00'
                                                            : formattedValue,
                                                        );
                                                        if (formattedValue === '') {
                                                          weekData(item.employeeId, 'weeK4', false);
                                                        }
                                                      }
                                                    }}
                                                    onBlur={() => {
                                                      const val = parseFloat(
                                                        item.wageS4 || 0,
                                                      ).toFixed(2);
                                                      weekData(item.employeeId, 'wageS4', val);
                                                    }}
                                                    onKeyDown={(e) => {
                                                      if (e.key === 'Enter') {
                                                        const val = parseFloat(
                                                          item.wageS4 || 0,
                                                        ).toFixed(2);
                                                        weekData(item.employeeId, 'wageS4', val);
                                                      }
                                                    }}
                                                  />
                                                </div>
                                              </td>
                                              <td>
                                                <div className="input-group">
                                                  <div className="input-group-text">
                                                    <input
                                                      className="form-check-input mt-0"
                                                      type="checkbox"
                                                      disabled={
                                                        !C3GenerationData?.find(
                                                          (filt) =>
                                                            filt?.employeeId === item?.employeeId,
                                                        )?.weeK5
                                                      }
                                                      checked={item.weeK5}
                                                      onChange={(e) => {
                                                        weekData(
                                                          item.employeeId,
                                                          'weeK5',
                                                          e.target.checked,
                                                        );
                                                        if (!item.weeK5 === false) {
                                                          weekData(
                                                            item.employeeId,
                                                            'wageS5',
                                                            '0.00',
                                                          );
                                                        } else {
                                                          weekData(
                                                            item.employeeId,
                                                            'wageS5',
                                                            C3GenerationData.find(
                                                              (filt) =>
                                                                filt.employeeId === item.employeeId,
                                                            ).wageS5,
                                                          );
                                                        }
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
                                                          item.employeeId,
                                                          'wageS5',
                                                          formattedValue === ''
                                                            ? '0.00'
                                                            : formattedValue,
                                                        );
                                                        if (formattedValue === '') {
                                                          weekData(item.employeeId, 'weeK5', false);
                                                        }
                                                      }
                                                    }}
                                                    onBlur={() => {
                                                      const val = parseFloat(
                                                        item.wageS5 || 0,
                                                      ).toFixed(2);
                                                      weekData(item.employeeId, 'wageS5', val);
                                                    }}
                                                    onKeyDown={(e) => {
                                                      if (e.key === 'Enter') {
                                                        const val = parseFloat(
                                                          item.wageS5 || 0,
                                                        ).toFixed(2);
                                                        weekData(item.employeeId, 'wageS5', val);
                                                      }
                                                    }}
                                                  />
                                                </div>
                                              </td>

                                              <td>
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  value={item.remarks}
                                                  // disabled
                                                  onChange={(e) =>
                                                    weekData(
                                                      item.employeeId,
                                                      'remarks',
                                                      e.target.value,
                                                    )
                                                  }
                                                />
                                              </td>
                                            </tr>
                                          ))}
                                        </React.Fragment>
                                      ))}
                                    </>
                                  )}

                                  {exceptionData?.length > 0 && (
                                    <>
                                      {/* {exceptionData.map((ex, index) => { */}
                                      {filteredData(null, exceptionData).map((ex, index) => {
                                        const isEmployeeMissing =
                                          ex.validateMsg ===
                                          'Employee data not found in our system';

                                        return (
                                          <>
                                            <tr key={index} className="bg-light-danger">
                                              <td>
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  checked={ex.isSelected || false}
                                                  onChange={(e) =>
                                                    handleExceptionChange(
                                                      index,
                                                      'isSelected',
                                                      e.target.checked,
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  value={ex.ssnd || ''}
                                                  onChange={(e) =>
                                                    handleExceptionChange(
                                                      index,
                                                      'ssnd',
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
                                                  title={ex.department} // still show hover tooltip
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

                                                        handleExceptionChange(
                                                          index,
                                                          'weeK1',
                                                          isChecked,
                                                        );
                                                        handleExceptionChange(
                                                          index,
                                                          'wageS1',
                                                          isChecked
                                                            ? (
                                                                location.state?.employees ||
                                                                loadEmployeeList
                                                              ).find(
                                                                (emp) =>
                                                                  emp.employeeId === ex.employeeId,
                                                              )?.wageS1 || '0.00'
                                                            : '0.00',
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

                                                        handleExceptionChange(
                                                          index,
                                                          'weeK2',
                                                          isChecked,
                                                        );
                                                        handleExceptionChange(
                                                          index,
                                                          'wageS2',
                                                          isChecked
                                                            ? (
                                                                location.state?.employees ||
                                                                loadEmployeeList
                                                              ).find(
                                                                (emp) =>
                                                                  emp.employeeId === ex.employeeId,
                                                              )?.wageS2 || '0.00'
                                                            : '0.00',
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

                                                        handleExceptionChange(
                                                          index,
                                                          'weeK3',
                                                          isChecked,
                                                        );
                                                        handleExceptionChange(
                                                          index,
                                                          'wageS3',
                                                          isChecked
                                                            ? (
                                                                location.state?.employees ||
                                                                loadEmployeeList
                                                              ).find(
                                                                (emp) =>
                                                                  emp.employeeId === ex.employeeId,
                                                              )?.wageS3 || '0.00'
                                                            : '0.00',
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

                                                        handleExceptionChange(
                                                          index,
                                                          'weeK4',
                                                          isChecked,
                                                        );
                                                        handleExceptionChange(
                                                          index,
                                                          'wageS4',
                                                          isChecked
                                                            ? (
                                                                location.state?.employees ||
                                                                loadEmployeeList
                                                              ).find(
                                                                (emp) =>
                                                                  emp.employeeId === ex.employeeId,
                                                              )?.wageS4 || '0.00'
                                                            : '0.00',
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
                                                            ? location.state.employees
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
                                                              ).find(
                                                                (emp) =>
                                                                  emp.employeeId === ex.employeeId,
                                                              )?.wageS5 || '0.00'
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
                                                  title={ex.remarks} // still show hover tooltip
                                                />
                                              </td>

                                              <td style={{ minWidth: '155px' }}>
                                                <div
                                                  className="select-arrow"
                                                  style={{ minWidth: '155px' }}
                                                >
                                                  <select
                                                    className="form-control important-select px-2 py-1"
                                                    value={ex.payFreq || ''}
                                                    onChange={({ target: { value } }) => {
                                                      if (value) {
                                                        handleExceptionChange(
                                                          index,
                                                          'payFreq',
                                                          value,
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <option value="">Select Pay Period</option>
                                                    <option value="W">W - Weekly</option>
                                                    <option value="M">M - Monthly</option>
                                                    <option value="E2W">
                                                      E2W - Every Two Weeks
                                                    </option>
                                                    <option value="2M">2M - Twice Monthly</option>
                                                  </select>
                                                </div>
                                              </td>

                                              <td>
                                                <Button
                                                  className="btn btn-sm btn-success"
                                                  disabled={loadingException === ex.ssnd} // disable during load
                                                  onClick={async () => {
                                                    const result = await updateExceptionRow(ex);

                                                    if (result.success) {
                                                      moveExceptionToMain(index);
                                                    }
                                                  }}
                                                >
                                                  {loadingException === ex.ssnd ? (
                                                    <>
                                                      <Spinner size="sm" /> Updating...
                                                    </>
                                                  ) : (
                                                    'Update'
                                                  )}
                                                </Button>
                                              </td>
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
              <Label for="employee">Employee</Label>
              <Input
                type="select"
                id="employeessn"
                onChange={(e) => setEmployeessn(e.target.value)}
              >
                <option>Select Employee</option>
                {employee.length > 0
                  ? employee.map((item) => (
                      <option value={item.name} selected={employeessn === item.name}>
                        {item.name}
                      </option>
                    ))
                  : null}
              </Input>
            </Col>
            <Col md="6">
              <Label for="paymentDate">Payment Date</Label>
              <Input
                type="date"
                id="payDate"
                value={payDates}
                onChange={(e) => setPayDate(e.target.value)}
              />
            </Col>
            <Col md="6" className="mt-3">
              <Label for="amount">Amount</Label>
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
          <Button color="secondary" onClick={toggle}>
            Cancel
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
                  checked={isWorkingDirector}
                  onChange={(e) => setisWorkingDirector(e.target.checked)}
                />
                <Label for="isDirector" className="ms-2">
                  Yes
                </Label>
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="employee">Employee</Label>
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
                <Label for="employee">Type</Label>
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
              <Label for="amount">Amount</Label>
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
                  <Label for="toDate">Pay Date</Label>
                  <Input
                    type="date"
                    id="toDate"
                    value={payDatess !== null ? payDatess.split('T')[0] : null}
                    onChange={(e) => setPayDatess(e.target.value)}
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
                  <Label for="fromDate">From Date</Label>
                  <Input
                    type="date"
                    id="fromDate"
                    value={fromDate !== null ? fromDate.split('T')[0] : null}
                    onChange={(e) => setFromdate(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="toDate">To Date</Label>
                  <Input
                    type="date"
                    id="toDate"
                    value={toDate !== null ? toDate.split('T')[0] : null}
                    onChange={(e) => setTodate(e.target.value)}
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
          <Button color="secondary" onClick={Htoggles}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={showModal} toggle={handleNo}>
        <ModalHeader toggle={handleNo}>Confirmation</ModalHeader>
        <ModalBody>{modalMessage}</ModalBody>
        <ModalFooter>
          <Button className="btn-light" color="secondary" onClick={handleNo}>
            No
          </Button>
          <Button color="primary" onClick={save}>
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
      <Modal isOpen={isModalOpenSubmit} toggle={() => {}} backdrop="static" keyboard={false}>
        <ModalHeader
          toggle={() => {
            handleNo();
            navigate('/apps/director/NwDirectorPayroll');
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
          )}
        </ModalBody>
        <ModalFooter>
          {showYesNoButtons ? (
            <>
              <Button
                color="info"
                onClick={handleNoClick}
                style={{ position: 'absolute', left: '10px' }}
              >
                Generate director for Other Month {'>'}
              </Button>
              <Button
                color="secondary"
                className="btn-light"
                onClick={() => {
                  handleNo();
                  navigate('/apps/director/NwDirectorPayroll');
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
                  color="secondary"
                  className="btn-light"
                  onClick={handleBack}
                  style={{ position: 'absolute', left: '10px' }}
                >
                  <>{'<'} &nbsp;Back</>
                </Button>
              )}
              <Button
                color="secondary"
                className="btn-light"
                onClick={() => {
                  handleNo();
                  navigate('/apps/director/NwDirectorPayroll');
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
                <Button color="primary" onClick={handleGenerateC3Click}>
                  Generate C3
                </Button>
              )}
            </>
          )}
        </ModalFooter>
      </Modal>

      <Modal isOpen={isNill} toggle={CloseModal}>
        <ModalHeader toggle={CloseModal}>Confirm Action</ModalHeader>
        <ModalBody>
          {isActive
            ? 'NW: Are you sure you want to process this C3 for a Nil return?'
            : 'NW: Are you sure you want to process this C3 as a regular C3?'}
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            className="btn-light"
            onClick={() => {
              CloseModal();
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

      <NwDirectorEmployee
        isOpen={showImportModal}
        toggle={() => setShowImportModal(false)}
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
        onConfirm={saveAndSubmit}
      />

      <CustomModal
        isOpen={errorDataModalOpen}
        toggle={() => setErrorDataModalOpen(false)}
        title="Exception Details"
        message="There are a few employees not associated with you, so you cannot save the details of this C3 media file."
        showClose
      />
    </>
  );
};
export default AddDirectorPayroll;
