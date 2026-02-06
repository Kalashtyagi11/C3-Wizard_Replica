import { Helmet } from 'react-helmet';
import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { toast } from 'react-toastify';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Label,
  Spinner,
  FormGroup,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  Switch,
  DropdownItem,
  Toast,
} from 'reactstrap';
import { object } from 'prop-types';
import * as Icon from 'react-feather';
import {
  uploadExcelData,
  reconciliationGet,
  ReconcileData,
  ColumnGet,
  CustomizeData,
  ExcelreconciliationGet,
  reconcilationUpdate,
  getReconcilationUpdate,
} from '../../../store/apps/dashboard/DashboardSlice';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import ConfirmationModal from '../settings/components/ConfirmationModal';
import Loader from '../../../layouts/loader/Loader';
import CustomPagination from '../component/CustomPagination';
import './Toogle.scss';

const Reconciliation = () => {
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [accountHolder, setAccountHolder] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [show, setShow] = useState(false);
  const [headerId, setHeaderId] = useState(null);
  const [periodYear, setPeriodYear] = useState(null);
  const [periodMonth, setPeriodMonth] = useState(null);
  const CompanyId = localStorage.getItem('companyId');
  // const UserId = localStorage.getItem('userID');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [reconciledOption, setReconciledOption] = useState(null);
  const [cardHolderOption, setCardHolderOption] = useState(null);
  const [optionsCardHolder, setOptionsCardHolder] = useState([]);
  const UserId = parseInt(localStorage.getItem('userID'), 10);
  const userName = localStorage.getItem('userId');
  const userPassword = localStorage.getItem('userPassword');
  const UserName = localStorage.getItem('userName');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIdActive, setSelectedIdActive] = useState(null);
  const [toggleValue, setToggleValue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isReconcile, setIsReconcile] = useState(false);
  const [isReconcileMultiple, setIsReconcileMultiple] = useState(false);
  const [isCustomize, setIsCustomize] = useState(false);
  const [exportNWItem, setExportNWItem] = useState(null);
  const [exportNWItemMultiple, setExportNWItemMultiple] = useState(null);
  const toggleModalReconcile = () => setIsReconcile(!isReconcile);
  const toggleModalCustomize = () => setIsReconcile(!isCustomize);
  const toggleModalReconcileMultiple = () => setIsReconcileMultiple(!isReconcileMultiple);
  const [notes, setNotes] = useState('');
  const [checkedMap, setCheckedMap] = useState({});
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const { message, type } = useSelector((state) => state.messageReducer);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const {
    ReconciliationData,
    ReconciliationExcel,
    ColumnData,
    loading: reduxLoading,
  } = useSelector((state) => state.dashboardSlice);
  const visibleFields = ColumnData?.filter((col) => col.status).map((col) => col.field);
  const hiddenFields = ColumnData?.filter((col) => !col.status).map((col) => col.field);
  const [localColumnData, setLocalColumnData] = useState([]);
  const { previewData } = useSelector((state) => state.dashboardSlice);
  const getDate = new Date();
  const [Year, setYear] = useState(getDate.getFullYear().toString());
  const [FromMonth, setFromMonth] = useState('');
  const [ToMonth, setToMonth] = useState('');
  const [customizeResponse, setCustomizeResponse] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showModalNote, setShowModalNote] = useState(false);
  const [modalContent, setModalContent] = useState('');
  // State to track if user has performed a search
  const [hasSearched, setHasSearched] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    fromDate: null,
    toDate: null,
    status: null,
    cardHolderName: null,
  });
  const [loadingNoteId, setLoadingNoteId] = useState(null);

  const getAllHolder = async () => {
    setLoadingDropdown(true);
    try {
      const res = await UserManagementServices.getAllAcountHolder();

      const formattedOptions = res.data.data.map((holder) => ({
        value: holder.cardHolderName,
        label: holder.cardHolderName,
      }));

      setOptionsCardHolder(formattedOptions);
    } catch (error) {
      console.error('Error fetching card holders:', error);
    } finally {
      setLoadingDropdown(false);
    }
  };

  // Only handle pagination changes after a search has been performed
  useEffect(() => {
    if (hasSearched) {
      const payload = {
        pageNumber: typeof pageNumber === 'number' ? pageNumber : 0,
        pageSize: typeof pageSize === 'number' ? pageSize : 10,
        ...currentFilters,
      };

      dispatch(reconciliationGet(payload))
        .then((res) => {
          if (UserId) {
            dispatch(ColumnGet(UserId));
          }

          const { totalRecords: responseRecords, totalPages: responsePages } =
            res.payload.ReconciliationDataResponse;
          setTotalRecords(responseRecords || 0);
          setTotalPages(responsePages || 0);
        })
        .catch(() => {
          setTotalRecords(0);
          setTotalPages(0);
        });
    }
  }, [pageNumber, pageSize, hasSearched, currentFilters, dispatch, UserId]);

  const optionsStatus = [
    { value: 'Reconciled', label: 'Reconciled' },
    { value: 'Pending', label: 'Not Reconciled' },
  ];

  const options = [
    { value: 'c1', label: 'Company 1' },
    { value: 'c2', label: 'Company 2' },
    { value: 'c3', label: 'Company 3' },
  ];

  const formatValue = (val) => {
    if (!val || (typeof val === 'object' && Object.keys(val).length === 0)) return '';
    return typeof val === 'object' ? JSON.stringify(val) : val;
  };

  const isLoading = reduxLoading;

  const handlePageClick = (page) => {
    setPageNumber(page);
  };
  const handlePrevious = () => {
    if (pageNumber > 0) {
      handlePageClick(pageNumber - 1);
    }
  };

  const handleNext = () => {
    if (pageNumber < totalPages - 1) {
      handlePageClick(pageNumber + 1);
    }
  };

  useEffect(() => {
    // Only load initial data if no search has been performed
    if (!hasSearched) {
      const payload = {
        pageNumber: typeof pageNumber === 'number' ? pageNumber : 0,
        pageSize: typeof pageSize === 'number' ? pageSize : 10,
        fromDate: null,
        toDate: null,
        status: null,
        cardHolderName: null,
      };

      dispatch(reconciliationGet(payload))
        .then((res) => {
          if (UserId) {
            dispatch(ColumnGet(UserId));
          }

          const { totalRecords: responseRecords, totalPages: responsePages } =
            res.payload.ReconciliationDataResponse;
          setTotalRecords(responseRecords || 0);
          setTotalPages(responsePages || 0);
        })
        .catch(() => {
          // Handle error case
          setTotalRecords(0);
          setTotalPages(0);
        });

      if (UserId) {
        dispatch(ExcelreconciliationGet(UserId));
      }
    }
  }, [dispatch, UserId, pageNumber, pageSize, hasSearched]);

  useEffect(() => {
    if (ColumnData) {
      setLocalColumnData(ColumnData);
    }
  }, [ColumnData]);

  useEffect(() => {
    if (message) {
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      }
      // Reset the message after showing the toast to ensure it triggers again
      dispatch(setMessage({ message: '', type: '' }));
    }
  }, [message, type, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const handleExcelUpload = async (e) => {
    e.preventDefault();

    if (!excelFile) {
      toast.error('Please select a CSV file');
      return;
    }

    const allowedExtensions = ['.csv']; // only allow .csv
    const fileName = excelFile.name.toLowerCase();
    const isValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidExtension) {
      toast.error('Invalid file type. Only .csv files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('file', excelFile);
    formData.append('UserId', UserId);

    try {
      const res = await dispatch(uploadExcelData(formData)).unwrap();
      dispatch(reconciliationGet({ pageNumber, pageSize }));
    } catch (err) {
      console.log('err');
    }
  };

  const Reconcile = (id) => {
    const selectedIds = Object.keys(checkedMap).filter((key) => checkedMap[key]);

    if (selectedIds.length === 0) {
      toast.error('Please select at least one  record to reconcile.');
      return;
    }

    if (selectedIds.length > 1) {
      toast.error("You can't reconcile multiple transactions at once.");
      return;
    }

    setExportNWItem({ id });

    setIsReconcile(true);

    // Open the modal
  };

  const Reconcilation = () => {
    if (!exportNWItem) return;
    setLoading(true);
    const payload = {
      id: [exportNWItem.id],
      reasonsForReconciliation: notes,
      userId: UserId,
    };

    dispatch(ReconcileData(payload))
      .unwrap()
      .then((response) => {
        const refreshPayload = {
          pageNumber,
          pageSize,
          fromDate: null,
          toDate: null,
          status: null,
          cardHolderName: null,
        };
        dispatch(reconciliationGet(refreshPayload));
        dispatch(ExcelreconciliationGet());
        setIsReconcile(false);
        setNotes('');
        setCheckedMap({});
      })
      .catch((error) => {
        console.error('Export failed:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleReconciliationClick = () => {
    const selectedIds = Object.keys(checkedMap).filter((id) => checkedMap[id]);

    if (selectedIds.length === 0) {
      toast.error('Please select at least one  record to reconcile.');
      return;
    }

    // if (selectedIds.length < 2) {
    //   toast.error('Please select at least two records to reconcile.');
    //   return;
    // }

    setExportNWItemMultiple(selectedIds);
    setIsReconcileMultiple(true);
  };

  const ReConcilationMultiple = () => {
    if (!exportNWItemMultiple) {
      toast.error('No record selected.');
      return;
    }

    if (!notes.trim()) {
      toast.error('Please enter a reason.');
      return;
    }

    setLoading(true);

    const payload = {
      // id: [exportNWItemMultiple.id],
      id: exportNWItemMultiple.map((x) => parseInt(x, 10)),
      reasonsForReconciliation: notes,
      userId: UserId,
      status: true,
    };

    dispatch(ReconcileData(payload))
      .unwrap()
      .then(() => {
        dispatch(ExcelreconciliationGet());
        setIsReconcileMultiple(false);
        setExportNWItemMultiple(null);
        setNotes('');
        setCheckedMap({});
        const refreshPayload = {
          pageNumber,
          pageSize,
          fromDate: null,
          toDate: null,
          status: null,
          cardHolderName: null,
        };
        dispatch(reconciliationGet(refreshPayload));
      })
      .catch(() => {
        // toast.error('');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onCanceled = () => {
    setIsReconcile(false);
    setExportNWItem(null);
    setNotes('');
  };

  const onCanceledMultiple = () => {
    setIsReconcileMultiple(false);
    setExportNWItemMultiple(null);
    setNotes('');
    setCheckedMap({});
  };

  const handleCheckboxChange = (id) => {
    setCheckedMap((prev) => ({
      ...prev,
      [id]: !prev[id], // toggle checked state of this id
    }));
  };

  const handleCustomizeColumn = () => {
    if (!isCustomize) {
      setLocalColumnData(ColumnData); // restore from Redux
    }
    setIsCustomize((prev) => !prev);
    if (UserId) {
      dispatch(ColumnGet(UserId));
    }
  };

  const handleCheckboxChangeColumn = (index, checked) => {
    console.log(`Checkbox changed at index ${index}: ${checked}`);
    const updated = [...localColumnData];
    updated[index] = { ...updated[index], status: checked };
    setLocalColumnData(updated);
  };

  const UserApply = () => {
    setLoading(true);

    const payload = localColumnData.map((item) => ({
      ...item,
      userId: UserId, // Add userId to each object
    }));

    dispatch(CustomizeData(payload))
      .unwrap()
      .then((res) => {
        setCustomizeResponse(res.data);
        const refreshPayload = {
          pageNumber,
          pageSize,
          fromDate: null,
          toDate: null,
          status: null,
          cardHolderName: null,
        };
        dispatch(reconciliationGet(refreshPayload));
        setIsCustomize(false);
        dispatch(ColumnGet(UserId));
      })
      .catch(() => {
        toast.error('Reconciliation failed.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cancelCustomize = () => {
    setIsCustomize(false);
  };

  const formatHeading = (str) => {
    if (!str) return '';

    // Add space before capital letters
    let result = str.replace(/([a-z])([A-Z])/g, '$1 $2');

    // Capitalize the first letter
    result = result.charAt(0).toUpperCase() + result.slice(1);

    // Replace common acronyms with uppercase
    result = result
      .replace(/\bId\b/g, 'ID')
      .replace(/\bIp\b/g, 'IP')
      .replace(/\bPa\b/g, 'PA')
      .replace(/\bUi\b/g, 'UI')
      .replace(/\bXid\b/g, 'XID')
      .replace(/\bIcsr\b/g, 'ICSR')
      .replace(/\bApi\b/g, 'API');

    return result;
  };

  const handleToggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const exportExcel = () => {
    // const allRows = ReconciliationData?.records || [];
    const allRows = ReconciliationExcel || [];

    // Fallback if there's no data
    const fallbackRecord = {
      PaymentGatewayTransactionID: '',
      TransactionDate: '',
      PaymentAmount: '',
      PaymentStatus: '',

      ReconciledByName: '',

      ReconciledDate: '',
      Notes: '',
    };

    const dataToExport = allRows.length > 0 ? allRows : [fallbackRecord];

    const formattedData = dataToExport.map((item) => {
      const baseData = {
        'Transaction ID': item.PaymentGatewayTransactionID || '',
        'Transaction Date': item.TransactionDate
          ? moment(item.TransactionDate).format('YYYY-MMM-DD')
          : '',
        'Payment Amount': item.PaymentAmount?.toFixed(2) || '0.00',
        'Payment Status': item.PaymentStatus || '',

        'Reconciled By Name': item.ReconciledByName || '',

        'Reconciled By Date':
          item?.ReconciledDate &&
          typeof item.ReconciledDate === 'string' &&
          moment(item.ReconciledDate).isValid()
            ? moment(item.ReconciledDate).format('DD-MMM-YYYY')
            : '',
        Notes: item.Notes || '',
      };

      // ✅ Add dynamic fields based on visibleFields
      const dynamicData = {};
      if (Array.isArray(visibleFields)) {
        visibleFields.forEach((field) => {
          const label = formatHeading(field); // e.g., converts "userName" → "User Name"
          dynamicData[label] = item[field] !== undefined ? item[field] : '';
        });
      }

      return {
        ...baseData,
        ...dynamicData,
      };
    });

    try {
      // ✅ Ensure XLSX and saveAs are properly imported
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reconciliation');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, 'Reconciliation_Data.xlsx');
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Excel download failed. Please check console for errors.');
    }
  };

  const exportCSV = () => {
    const allRows = ReconciliationExcel || [];

    const fallbackRecord = {
      PaymentGatewayTransactionID: '',
      TransactionDate: '',
      PaymentAmount: '',
      PaymentStatus: '',
      ReconciledByName: '',
      ReconciledDate: '',
      Notes: '',
    };

    const dataToExport = allRows.length > 0 ? allRows : [fallbackRecord];

    const formattedData = dataToExport.map((item) => {
      const baseData = {
        'Transaction ID': item.PaymentGatewayTransactionID
          ? `="${item.PaymentGatewayTransactionID}"`
          : '',
        'Transaction Date': item.TransactionDate
          ? moment(item.TransactionDate).format('YYYY-MMM-DD')
          : '',
        'Payment Amount':
          typeof item.PaymentAmount === 'number' ? item.PaymentAmount.toFixed(2) : '0.00',
        'Payment Status': item.PaymentStatus || '',
        'Reconciled By Name':
          typeof item.ReconciledByName === 'object' ? '' : item.ReconciledByName || '',
        'Reconciled By Date':
          item?.ReconciledDate && typeof item.ReconciledDate === 'string'
            ? moment(item.ReconciledDate).format('DD-MMM-YYYY')
            : '',
        Notes: typeof item.Notes === 'object' ? '' : item.Notes || '',
      };

      // Add extra fields if visibleFields is provided
      const dynamicData = {};
      if (Array.isArray(visibleFields)) {
        visibleFields.forEach((field) => {
          const label = formatHeading(field); // Converts camelCase → Title Case
          let value = item[field];
          if (value === null || value === undefined) value = '';
          if (typeof value === 'object') value = ''; // Avoid [object Object]
          dynamicData[label] = value;
        });
      }

      return { ...baseData, ...dynamicData };
    });

    // Build header row
    const headers = Object.keys(formattedData[0] || {});

    // Build CSV rows
    const csvRows = formattedData.map((row) =>
      headers
        .map((header) => {
          let cell = row[header] ?? '';
          cell = cell.toString().replace(/"/g, '""'); // Escape double quotes
          return `"${cell}"`;
        })
        .join(','),
    );

    const csvContent = [headers.map((h) => `"${h}"`).join(','), ...csvRows].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Reconciliation_Data.csv');
  };

  const [statusChecked, setStatusChecked] = useState(false);

  const handleToggle = (id, checked) => {
    setSelectedId(id); // Store item.id
    setToggleValue(checked); // true or false
    setModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setModalOpen(false);
    setNotes('');
    setSelectedId(null);
    setToggleValue(false);
    setShowModalNote(false);
  };

  const ReconciledUpdate = async () => {
    if (!notes.trim()) {
      toast.error('Please enter a reason.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: selectedId,
        status: toggleValue,
        notes,
        Userid: UserId,
      };

      dispatch(reconcilationUpdate(payload))
        .unwrap()
        .then(() => {
          const refreshPayload = {
            pageNumber,
            pageSize,
            fromDate: null,
            toDate: null,
            status: null,
            cardHolderName: null,
          };
          dispatch(reconciliationGet(refreshPayload));
          setExportNWItemMultiple(null);
          setNotes('');
        });
    } catch (err) {
      // console.error('Reconciliation error:', err);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const getStatusInfo = () => {
    if (toggleValue === true) {
      return { text: 'Reconciled', color: 'success' };
    }

    // Fixed: No else needed after return
    return { text: 'Unreconciled', color: 'danger' };
  };

  function parseData(dataArray) {
    return dataArray.map((entry) => {
      // Updated pattern to match the actual date format: 20/Aug/2025
      const pattern = /(?<date>\d{1,2}\/[A-Za-z]+\/\d{4})/;
      const userMatch = entry.match(/by\s+([^,]+)/);
      const statusMatch = entry.match(
        /(Unreconciled\s--->\sReconciled|Reconciled\s--->\sUnreconciled)/,
      );
      const reasonMatch = entry.split(',').pop()?.trim();

      const dateMatch = pattern.exec(entry);
      const date = dateMatch?.groups?.date || '';

      return {
        date: date || '',
        user: userMatch ? userMatch[1] : '',
        statusChange: statusMatch ? statusMatch[0] : '',
        reason: reasonMatch,
      };
    });
  }

  const handleShowMore = (itemId) => {
    setLoadingNoteId(itemId);
    dispatch(getReconcilationUpdate(itemId))
      .unwrap()
      .then((response) => {
        const rawData = response.updateRecord || [];
        const parsedData = parseData(rawData); // Parse the raw strings
        setModalContent(parsedData);
        setShowModalNote(true);
      })
      .catch((error) => {
        console.error('Error fetching note:', error);
        // Handle error
      })
      .finally(() => {
        setLoadingNoteId(null);
      });
  };

  useEffect(() => {
    // Only run this effect if we're not in a search state
    // When hasSearched is true, the other useEffect will handle pagination
    if (!hasSearched) {
      const payload = {
        pageNumber: typeof pageNumber === 'number' ? pageNumber : 0,
        pageSize: typeof pageSize === 'number' ? pageSize : 10,
        fromDate: null,
        toDate: null,
        status: null,
        cardHolderName: null,
      };

      dispatch(reconciliationGet(payload))
        .then((res) => {
          if (UserId) {
            dispatch(ColumnGet(UserId));
          }

          const { totalRecords: responseRecords, totalPages: responsePages } =
            res.payload.ReconciliationDataResponse;
          setTotalRecords(responseRecords || 0);
          setTotalPages(responsePages || 0);
        })
        .catch(() => {
          // Handle error case
          setTotalRecords(0);
          setTotalPages(0);
        });

      if (UserId) {
        dispatch(ExcelreconciliationGet(UserId));
      }
    }
  }, [dispatch, UserId, pageNumber, pageSize, hasSearched]);

  const getFirstNote = (noteStr) => {
    if (!noteStr || typeof noteStr !== 'string') return '';

    // Split on date pattern (e.g., 20/Aug/2025), include the date in the result
    const entries = noteStr.split(/(?=\d{2}\/[A-Za-z]{3}\/\d{4})/);

    // Return the last non-empty trimmed note
    return entries.length ? entries[entries.length - 1].trim() : noteStr.trim();
  };

  const handleSubmit = async (page = 0) => {
    try {
      if (startDate && endDate && moment(endDate).isBefore(moment(startDate))) {
        toast.error('To Date must be greater than or equal to From Date.');
        return;
      }

      setLoadingSearch(true);

      // Save current filter values
      const filters = {
        fromDate: startDate ? moment(startDate).format('YYYY-MM-DD') : null,
        toDate: endDate ? moment(endDate).format('YYYY-MM-DD') : null,
        status: reconciledOption ? reconciledOption.value : null,
        cardHolderName: cardHolderOption ? cardHolderOption.value : null,
      };

      const payload = {
        pageNumber: 0, // Always start from page 0 when searching
        pageSize,
        ...filters,
      };

      const res = await dispatch(reconciliationGet(payload)).unwrap();

      if (UserId) {
        dispatch(ColumnGet(UserId));
      }

      const { totalRecords: responseRecords, totalPages: responsePages } =
        res.ReconciliationDataResponse;

      // Save filters and mark that search has been performed
      setCurrentFilters(filters);
      setHasSearched(true);
      setPageNumber(0); // Reset to first page

      // If no records found, reset to page 0
      if (responseRecords === 0) {
        setTotalRecords(0);
        setTotalPages(0);
      } else {
        setTotalRecords(responseRecords);
        setTotalPages(responsePages);
      }
    } catch (error) {
      setPageNumber(0);
      setTotalRecords(0);
      setTotalPages(0);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleClearFilters = () => {
    // Reset all filter states
    setStartDate(null);
    setEndDate(null);
    setReconciledOption(null);
    setCardHolderOption(null);
    setHasSearched(false);
    setPageNumber(0);

    // Load initial data without filters
    const payload = {
      pageNumber: 0,
      pageSize,
      fromDate: null,
      toDate: null,
      status: null,
      cardHolderName: null,
    };

    dispatch(reconciliationGet(payload))
      .then((res) => {
        if (UserId) {
          dispatch(ColumnGet(UserId));
        }

        const { totalRecords: responseRecords, totalPages: responsePages } =
          res.payload.ReconciliationDataResponse;
        setTotalRecords(responseRecords || 0);
        setTotalPages(responsePages || 0);
      })
      .catch(() => {
        setTotalRecords(0);
        setTotalPages(0);
      });
  };

  useEffect(() => {
    getAllHolder();
  }, []);

  return (
    <>
      <Helmet>
        <title>Reconciliation - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
        {/* ========== Left Sidebar Start ========== */}
        {/* Left Sidebar End */}
        <sidebar-barrrrrr></sidebar-barrrrrr>
        {/* ============================================================== */}
        {/* Start right Content here */}
        {/* ============================================================== */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
          <ul className="d-flex align-items-center mt-3 gap-2 list-unstyled">
            <li className="fw-medium">
              <Link to="/admin-dashboard" className="d-flex align-items-center gap-1 text-muted">
                <i className="ti-home" /> Dashboard{' '}
              </Link>
            </li>
            <li>-</li>
            <li className="fw-medium">
              <span className="d-flex align-items-center gap-1 text-muted">Administration</span>
            </li>
            <li>-</li>
            <li className="fw-medium">Reconciliation </li>
          </ul>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <form
                          className="d-flex flex-wrap align-items-center gap-2"
                          onSubmit={handleExcelUpload}
                          encType="multipart/form-data"
                        >
                          <input
                            type="file"
                            accept=".xlsx, .xls,.csv"
                            onChange={(e) => setExcelFile(e.target.files[0])}
                            className="form-control"
                            required
                            style={{ maxWidth: '300px' }}
                          />
                          <button
                            type="submit"
                            className="btn btn-success waves-effect waves-light"
                            style={{ height: '45px', minWidth: '100px' }}
                          >
                            <i className="fas fa-upload pe-1"></i> Upload CSV File
                          </button>
                        </form>
                      </div>

                      <div className="col-md-6 text-end">
                        <button
                          type="submit"
                          className="btn btn-success waves-effect waves-light"
                          style={{ height: '45px', minWidth: '100px' }}
                          onClick={handleReconciliationClick}
                        >
                          <Icon.Clock size={20} title="Pending" /> Reconciliation
                        </button>
                        <button
                          type="submit"
                          className="btn btn-success waves-effect waves-light"
                          style={{ height: '45px', minWidth: '100px' }}
                          onClick={handleCustomizeColumn}
                        >
                          <Icon.Edit size={20} title="Pending" /> Customize Column
                        </button>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-3 bg_ligh">
                            <div className="row">
                              <div className="col-md-3 col-lg-3 addition col-xl-3 px-1">
                                <div className="mb-3">
                                  <Label>Reconcile Status</Label>
                                  <Select
                                    value={reconciledOption}
                                    onChange={setReconciledOption}
                                    options={optionsStatus}
                                    isSearchable
                                    placeholder="Reconcile Status"
                                    isClearable
                                  />
                                </div>
                              </div>
                              <div className="col-md-3  col-lg-3 addition col-xl-3 px-1">
                                <div className="mb-3">
                                  <Label>Card Holder Name</Label>
                                  <Select
                                    value={cardHolderOption}
                                    onChange={setCardHolderOption}
                                    options={optionsCardHolder}
                                    isSearchable
                                    placeholder="Card holder name"
                                    isClearable
                                  />
                                </div>
                              </div>
                              {/* <div className="col-md-2 addition col-lg-2 col-xl-2 px-1">
                                <Label className="mb">Customer Name or Reg N.</Label>
                                <Select
                                  value={selectedOption}
                                  onChange={setSelectedOption}
                                  options={options}
                                  isSearchable
                                  placeholder="Customer name or reg."
                                  isClearable
                                />
                              </div> */}
                              <div className="col-md-2 addition col-lg-2 col-xl-2 px-1">
                                <Label className="mb">From Date</Label>
                                <DatePicker
                                  selected={startDate}
                                  onChange={(date) => setStartDate(date)}
                                  dateFormat="dd-MMM-yyyy"
                                  placeholderText="Start Date"
                                  isClearable
                                  className="form-control w-auto me-2 "
                                />
                              </div>
                              <div className="col-md-2 addition col-lg-2 col-xl-2 px-1">
                                <Label className="mb">To Date</Label>
                                <DatePicker
                                  selected={endDate}
                                  onChange={(date) => setEndDate(date)}
                                  dateFormat="dd-MMM-yyyy"
                                  placeholderText="End Date"
                                  className="form-control w-auto "
                                  minDate={startDate}
                                  isClearable
                                />
                              </div>
                              <div className="col-md-2 col-lg-2 col-xl-2 px-0 ">
                                <button
                                  onClick={handleSubmit}
                                  disabled={loadingSearch}
                                  className="btn btn-success waves-effect waves-light h-45"
                                  type="submit"
                                  style={{ height: '45px', marginTop: '30px' }}
                                >
                                  {loadingSearch ? (
                                    <>
                                      <Spinner size="sm" /> Searching...
                                    </>
                                  ) : (
                                    <>
                                      <Icon.Search size={20} style={{ cursor: 'pointer' }} /> Search
                                    </>
                                  )}
                                </button>
                              </div>
                              {/* <div className="col-md-1 col-lg-1 col-xl-1 px-0 ">
                                <button
                                  onClick={handleClearFilters}
                                  disabled={loadingSearch}
                                  className="btn btn-secondary waves-effect waves-light h-45"
                                  type="button"
                                  style={{
                                    height: '45px',
                                    marginTop: '30px',
                                    fontSize: '12px',
                                    marginLeft: '5px',
                                  }}
                                >
                                  <Icon.X size={20} style={{ cursor: 'pointer' }} /> Clear
                                </button>
                              </div> */}
                            </div>
                            <div className="row">
                              <div className="col-xl-6">
                                <h4 className="header-title mb-0 text-success">
                                  Reconciliation List
                                </h4>
                              </div>

                              <div
                                className="col-lg-6 text-end position-relative"
                                ref={dropdownRef}
                              >
                                {/* <Label className="mb">Download CSV & Excel</Label> */}
                                <div>
                                  <span
                                    onClick={handleToggleDropdown}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <Icon.MoreVertical size={20} color="#000" />
                                  </span>
                                </div>

                                {showDropdown && (
                                  <div
                                    className="dropdown-menu show"
                                    style={{
                                      position: 'absolute',
                                      right: 0,
                                      top: '100%',
                                      zIndex: 1000,
                                      display: 'block',
                                      padding: '10px',
                                      minWidth: '150px',
                                      background: '#fff',
                                      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    <Button
                                      className="dropdown-item d-flex align-items-center"
                                      onClick={exportCSV}
                                    >
                                      <Icon.File size={18} className="me-2" /> Export as CSV
                                    </Button>
                                    <DropdownItem divider />

                                    <Button
                                      className="dropdown-item d-flex align-items-center"
                                      onClick={exportExcel}
                                    >
                                      <Icon.FileText size={18} className="me-2" /> Export as Excel
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="card-body pt-1">
                            <div className="table-container">
                              <table className="table table-hover mb-0">
                                <thead>
                                  <tr className="border-b">
                                    <th>Status</th>
                                    <th>Payment Transaction ID</th>
                                    <th>Transaction Date</th>
                                    <th>Payment Amount </th>
                                    <th>Payment Status</th>
                                    <th>Reconciled By Name</th>
                                    <th>Reconciled By Date </th>
                                    <th>Notes</th>

                                    {visibleFields.map((field, index) => (
                                      <th key={index}>{formatHeading(field)}</th>
                                    ))}
                                    {/* <th>Reconciliation Action</th> */}
                                    <th>Reconciliation</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {ReconciliationData?.records &&
                                  ReconciliationData?.records?.length > 0 ? (
                                    ReconciliationData?.records.map((item) => {
                                      const { id, ReconciliationStatus } = item;
                                      const isPending = ReconciliationStatus === 'Pending';
                                      const isChecked = isPending ? !!checkedMap[id] : true;
                                      const isDisabled = !isPending;

                                      return (
                                        <tr key={id}>
                                          <td>
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              checked={isChecked}
                                              disabled={isDisabled}
                                              onChange={() => handleCheckboxChange(id)}
                                            />
                                          </td>
                                          <td>{item?.PaymentGatewayTransactionID ?? ''}</td>
                                          <td style={{ minWidth: '150px' }}>
                                            {item?.TransactionDate
                                              ? moment(item?.TransactionDate).format('YYYY-MMM-DD')
                                              : ''}
                                          </td>
                                          <td className="td-text-align">
                                            ${item?.PaymentAmount.toFixed(2) ?? '0.00'}
                                          </td>
                                          <td className="fw-medium" style={{ minWidth: '140px' }}>
                                            {item?.PaymentStatus === 'AUTHORIZED' ? (
                                              <>
                                                <i className="fa fa-check-circle text-success me-1" />
                                                <span className="text-success">
                                                  {item.PaymentStatus}
                                                </span>
                                              </>
                                            ) : (
                                              <>
                                                <i className="fa fa-times-circle text-danger me-1" />
                                                <span className="text-danger">
                                                  {item?.PaymentStatus ?? ''}
                                                </span>
                                              </>
                                            )}
                                          </td>

                                          {!hiddenFields.includes('ReconciledByName') && (
                                            <td>{formatValue(item?.ReconciledByName)}</td>
                                          )}
                                          {!hiddenFields.includes('ReconciledDate') && (
                                            <td>
                                              {item?.ReconciledDate &&
                                              typeof item.ReconciledDate === 'string'
                                                ? moment(item.ReconciledDate).format('DD-MMM-YYYY')
                                                : ''}
                                            </td>
                                          )}

                                          {!hiddenFields.includes('Notes') && (
                                            <td style={{ minWidth: '150px' }}>
                                              {formatValue(getFirstNote(item.Notes))}
                                              {item.Notes &&
                                                typeof item.Notes === 'string' &&
                                                item.Notes.trim() !== '' && (
                                                  <span
                                                    onClick={() => handleShowMore(item.id)}
                                                    style={{
                                                      cursor: 'pointer',
                                                    }}
                                                  >
                                                    {loadingNoteId === item.id ? (
                                                      <Spinner
                                                        size="sm"
                                                        color="primary"
                                                        style={{ marginLeft: '5px' }}
                                                      />
                                                    ) : (
                                                      <>
                                                        <Icon.MoreHorizontal size={18} />
                                                      </>
                                                    )}
                                                  </span>
                                                )}
                                            </td>
                                          )}

                                          {!hiddenFields?.includes('CyberSourceMerchantID') && (
                                            <td>{formatValue(item?.CyberSourceMerchantID)}</td>
                                          )}
                                          {!hiddenFields?.includes('DateandTime') && (
                                            <td style={{ minWidth: '150px' }}>
                                              {moment(
                                                item?.DateandTime,
                                                'DD-MM-YYYY',
                                                true,
                                              ).isValid()
                                                ? moment(item?.DateandTime, 'DD-MM-YYYY').format(
                                                    'YYYY-MMM-DD',
                                                  )
                                                : ''}
                                            </td>
                                          )}
                                          {!hiddenFields.includes('RequestID') && (
                                            <td>{formatValue(item?.RequestID)}</td>
                                          )}
                                          {!hiddenFields.includes('MerchantReferenceNumber') && (
                                            <td>{formatValue(item?.MerchantReferenceNumber)}</td>
                                          )}
                                          {!hiddenFields.includes('RetrievalReferenceNumber') && (
                                            <td>{formatValue(item?.RetrievalReferenceNumber)}</td>
                                          )}
                                          {!hiddenFields.includes('InstalmentIdentifier') && (
                                            <td>{formatValue(item?.InstalmentIdentifier)}</td>
                                          )}
                                          {!hiddenFields.includes('LastName') && (
                                            <td>{formatValue(item?.LastName)}</td>
                                          )}
                                          {!hiddenFields.includes('FirstName') && (
                                            <td>{formatValue(item?.FirstName)}</td>
                                          )}
                                          {!hiddenFields.includes('Email') && (
                                            <td>{formatValue(item?.Email)}</td>
                                          )}
                                          {!hiddenFields.includes('Amount') && (
                                            <td>{formatValue(item?.Amount)}</td>
                                          )}
                                          {!hiddenFields.includes('Currency') && (
                                            <td>{formatValue(item?.Currency)}</td>
                                          )}
                                          {!hiddenFields.includes('AccountPrefix') && (
                                            <td>{formatValue(item?.AccountPrefix)}</td>
                                          )}
                                          {!hiddenFields.includes('AccountSuffix') && (
                                            <td>{formatValue(item?.AccountSuffix)}</td>
                                          )}
                                          {!hiddenFields.includes('Applications') && (
                                            <td>{formatValue(item?.Applications)}</td>
                                          )}
                                          {!hiddenFields.includes('PaymentMethod') && (
                                            <td>{formatValue(item?.PaymentMethod)}</td>
                                          )}
                                          {!hiddenFields.includes('PaymentSolution') && (
                                            <td>{formatValue(item?.PaymentSolution)}</td>
                                          )}
                                          {!hiddenFields.includes('TransactionReferenceNumber') && (
                                            <td>{formatValue(item?.TransactionReferenceNumber)}</td>
                                          )}
                                          {!hiddenFields.includes('AuthorisationIndicator') && (
                                            <td>{formatValue(item?.AuthorisationIndicator)}</td>
                                          )}
                                          {!hiddenFields.includes(
                                            'PartnerOriginalTransactionID',
                                          ) && (
                                            <td>
                                              {formatValue(item?.PartnerOriginalTransactionID)}
                                            </td>
                                          )}
                                          {!hiddenFields.includes('PartnerSolutionID') && (
                                            <td>{formatValue(item?.PartnerSolutionID)}</td>
                                          )}
                                          {!hiddenFields.includes('DeviceID') && (
                                            <td>{formatValue(item?.DeviceID)}</td>
                                          )}
                                          {!hiddenFields.includes('TerminalSerialNumber') && (
                                            <td>{formatValue(item?.TerminalSerialNumber)}</td>
                                          )}
                                          {!hiddenFields.includes('Processor') && (
                                            <td>{formatValue(item?.Processor)}</td>
                                          )}
                                          {!hiddenFields.includes('TokenID') && (
                                            <td>{formatValue(item?.TokenID)}</td>
                                          )}
                                          {!hiddenFields.includes('BusinessApplicationID') && (
                                            <td>{formatValue(item?.BusinessApplicationID)}</td>
                                          )}
                                          {!hiddenFields.includes('TerminalID') && (
                                            <td>{formatValue(item?.TerminalID)}</td>
                                          )}
                                          {!hiddenFields.includes('PATransactionID') && (
                                            <td>{formatValue(item?.PATransactionID)}</td>
                                          )}
                                          {!hiddenFields.includes('XID') && (
                                            <td>{formatValue(item?.XID)}</td>
                                          )}
                                          {!hiddenFields.includes('MerchantDefinedData1') && (
                                            <td>{formatValue(item?.MerchantDefinedData1)}</td>
                                          )}
                                          {!hiddenFields.includes('MerchantDefinedData2') && (
                                            <td>{formatValue(item?.MerchantDefinedData2)}</td>
                                          )}
                                          {!hiddenFields.includes('MerchantDefinedData3') && (
                                            <td>{formatValue(item?.MerchantDefinedData3)}</td>
                                          )}
                                          {!hiddenFields.includes('MerchantDefinedData4') && (
                                            <td>{formatValue(item?.MerchantDefinedData4)}</td>
                                          )}
                                          {!hiddenFields.includes('ClientUser') && (
                                            <td>{formatValue(item?.ClientUser)}</td>
                                          )}
                                          {!hiddenFields.includes('SalesSlipNumber') && (
                                            <td>{formatValue(item?.SalesSlipNumber)}</td>
                                          )}
                                          {!hiddenFields.includes('AuthorisationCode') && (
                                            <td>{formatValue(item?.AuthorisationCode)}</td>
                                          )}
                                          {!hiddenFields.includes('AcquirerAccountID') && (
                                            <td>{formatValue(item?.AcquirerAccountID)}</td>
                                          )}
                                          {!hiddenFields.includes('JCCATerminalID') && (
                                            <td>{formatValue(item?.JCCATerminalID)}</td>
                                          )}
                                          {!hiddenFields.includes('BillingAddress1') && (
                                            <td>{formatValue(item?.BillingAddress1)}</td>
                                          )}
                                          {!hiddenFields.includes('BillingCity') && (
                                            <td>{formatValue(item?.BillingCity)}</td>
                                          )}
                                          {!hiddenFields.includes('BillingCounty_Region') && (
                                            <td>{formatValue(item?.BillingCounty_Region)}</td>
                                          )}
                                          {!hiddenFields.includes('BillingPostalCode') && (
                                            <td>{formatValue(item?.BillingPostalCode)}</td>
                                          )}
                                          {!hiddenFields.includes('BillingPhoneNumber') && (
                                            <td>{formatValue(item?.BillingPhoneNumber)}</td>
                                          )}
                                          {!hiddenFields.includes('IPAddress') && (
                                            <td>{formatValue(item?.IPAddress)}</td>
                                          )}
                                          {!hiddenFields.includes('BillingCountry') && (
                                            <td>{formatValue(item?.BillingCountry)}</td>
                                          )}
                                          {!hiddenFields.includes('ShippingFirstName') && (
                                            <td>{formatValue(item?.ShippingFirstName)}</td>
                                          )}
                                          {!hiddenFields.includes('ShippingLastName') && (
                                            <td>{formatValue(item?.ShippingLastName)}</td>
                                          )}
                                          {!hiddenFields.includes('ShippingAddress1') && (
                                            <td>{formatValue(item?.ShippingAddress1)}</td>
                                          )}
                                          {!hiddenFields.includes('ShippingCity') && (
                                            <td>{formatValue(item?.ShippingCity)}</td>
                                          )}
                                          {!hiddenFields.includes('ShippingCounty_Region') && (
                                            <td>{formatValue(item?.ShippingCounty_Region)}</td>
                                          )}
                                          {!hiddenFields.includes('ShippingCountry') && (
                                            <td>{formatValue(item?.ShippingCountry)}</td>
                                          )}
                                          {!hiddenFields.includes('ShippingPostalCode') && (
                                            <td>{formatValue(item?.ShippingPostalCode)}</td>
                                          )}
                                          {!hiddenFields.includes('ShippingPhoneNumber') && (
                                            <td>{formatValue(item?.ShippingPhoneNumber)}</td>
                                          )}
                                          {!hiddenFields.includes('CustomerID') && (
                                            <td>{formatValue(item?.CustomerID)}</td>
                                          )}
                                          {!hiddenFields.includes('ClientApplication') && (
                                            <td>{formatValue(item?.ClientApplication)}</td>
                                          )}
                                          {!hiddenFields.includes('DeviceFingerprint') && (
                                            <td>{formatValue(item?.DeviceFingerprint)}</td>
                                          )}
                                          {!hiddenFields.includes('ICSRflag') && (
                                            <td>{formatValue(item?.ICSRflag)}</td>
                                          )}
                                          {!hiddenFields.includes('ICSRcode') && (
                                            <td>{formatValue(item?.ICSRcode)}</td>
                                          )}
                                          {!hiddenFields.includes('ReasonCode') && (
                                            <td>{formatValue(item?.ReasonCode)}</td>
                                          )}
                                          {!hiddenFields.includes('CommerceIndicator') && (
                                            <td>{formatValue(item?.CommerceIndicator)}</td>
                                          )}
                                          {!hiddenFields.includes('ProviderTransactionId') && (
                                            <td>{formatValue(item?.ProviderTransactionId)}</td>
                                          )}

                                          {/* <td>
                                            <div className="toggle-container">
                                              <div
                                                className={`toggle-switch ${
                                                  item.ReconciliationStatus !== 'Pending'
                                                    ? 'on'
                                                    : ''
                                                }`}
                                              >
                                                <FormGroup check>
                                                  <Input
                                                    type="checkbox"
                                                    className="toggle-input"
                                                    id={`toggle-${item.id}`}
                                                    checked={
                                                      item.ReconciliationStatus !== 'Pending'
                                                    }
                                                    onChange={(e) =>
                                                      handleToggle(item.id, e.target.checked)
                                                    }
                                                  />
                                                  <Label
                                                    htmlFor={`toggle-${item.id}`}
                                                    className="toggle-handle"
                                                  />
                                                  <span className="toggle-status">
                                                    {item.ReconciliationStatus !== 'Pending'
                                                      ? 'Yes'
                                                      : 'No'}
                                                  </span>
                                                </FormGroup>
                                              </div>
                                            </div>
                                          </td> */}
                                          <td>
                                            <div className="toggle-container">
                                              <div
                                                className={`toggle-switch ${
                                                  item.ReconciliationStatus !== 'Pending'
                                                    ? 'on'
                                                    : ''
                                                }`}
                                              >
                                                <FormGroup check>
                                                  <Input
                                                    type="checkbox"
                                                    className="toggle-input"
                                                    id={`toggle-${item.id}`}
                                                    checked={
                                                      item.ReconciliationStatus !== 'Pending'
                                                    }
                                                    onChange={(e) =>
                                                      handleToggle(item.id, e.target.checked)
                                                    }
                                                  />

                                                  {/* Toggle handle (clickable) */}
                                                  <Label
                                                    htmlFor={`toggle-${item.id}`}
                                                    className="toggle-handle"
                                                  />

                                                  {/* Yes/No text (now clickable too) */}
                                                  <Label
                                                    htmlFor={`toggle-${item.id}`}
                                                    className="toggle-status"
                                                  >
                                                    {item.ReconciliationStatus !== 'Pending'
                                                      ? 'Yes'
                                                      : 'No'}
                                                  </Label>
                                                </FormGroup>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      <td colSpan="12" className="text-center">
                                        No records found
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <CustomPagination
                              pageNumber={pageNumber}
                              pageSize={pageSize}
                              totalRecords={totalRecords}
                              totalPages={totalPages}
                              onPageChange={setPageNumber}
                            />
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
          </>
        )}
      </div>

      <Modal isOpen={isReconcile} toggle={onCanceled}>
        <ModalHeader toggle={onCanceled}>Are you sure want to reconcile ?</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="notse">
              Notes <span className="text-danger">*</span>
            </Label>
            <textarea
              id="notes"
              name="notes"
              type="text"
              className="form-control"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter reason here"
              rows={4}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={onCanceled}>
            cancel
          </Button>
          <Button color="primary" disabled={loading} onClick={Reconcilation}>
            {loading ? (
              <>
                <Spinner size="sm" /> Reconciliation
              </>
            ) : (
              <> Reconciliation</>
            )}
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isReconcileMultiple} toggle={onCanceledMultiple}>
        <ModalHeader toggle={onCanceledMultiple}>Are you sure want to reconcile ?</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="notse">
              Notes <span className="text-danger">*</span>
            </Label>
            <textarea
              id="notes"
              name="notes"
              type="text"
              value={notes}
              className="form-control"
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter reason here"
              rows={4}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onCanceledMultiple}>
            Cancel
          </Button>
          <Button color="primary" disabled={loading} onClick={ReConcilationMultiple}>
            {loading ? (
              <>
                <Spinner size="sm" /> Reconciliation
              </>
            ) : (
              <> Reconciliation</>
            )}
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isCustomize} toggle={toggleModalCustomize}>
        <ModalHeader toggle={cancelCustomize}>Table Customize Column </ModalHeader>
        <ModalBody>
          <div
            className="table-container"
            style={{ maxHeight: '350px', overflowY: 'auto', minWidth: 'auto' }}
          >
            <table className="table table-hover responsive mb-0">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Column Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ColumnData && ColumnData.length > 0 ? (
                  ColumnData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.field || ''}</td>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          // checked={item.status === true}
                          checked={localColumnData[index]?.status === true}
                          onChange={(e) => handleCheckboxChangeColumn(index, e.target.checked)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No record found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={cancelCustomize}>
            No
          </Button>
          <Button color="primary" disabled={loading} onClick={UserApply}>
            {loading ? (
              <>
                <Spinner size="sm" /> Apply
              </>
            ) : (
              <> Apply</>
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>Confirm Action</ModalHeader>
        <ModalBody>
          <FormGroup>
            <div className="d-flex align-items-center">
              <span className="">
                {toggleValue === true && 'Reconciled'}
                {toggleValue === false && 'Unreconciled'}
              </span>
            </div>
          </FormGroup>

          <FormGroup>
            <Label for="notse">
              Notes <span className="text-danger">*</span>
            </Label>
            <textarea
              id="notes"
              name="notes"
              type="text"
              className="form-control"
              value={notes}
              // rows="4" // height (number of text lines)
              // cols="50"
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter reason here"
              rows={4}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={closeModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={ReconciledUpdate}>
            {loading ? (
              <>
                <Spinner size="sm" /> Save
              </>
            ) : (
              <>
                <i className="far fa-save"></i> Save
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={showModalNote} toggle={closeModal} scrollable>
        <ModalHeader toggle={closeModal}>Notes</ModalHeader>
        <ModalBody>
          <FormGroup>
            {/* <div>{modalContent}</div> */}
            {Array.isArray(modalContent) && modalContent.length > 0 ? (
              modalContent.map((note, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '15px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <div>
                    <strong>Date:</strong> {note.date}
                  </div>
                  <div>
                    <strong>User:</strong> {note.user}
                  </div>
                  <div>
                    <strong>Status:</strong> {note.statusChange}
                  </div>
                  <div>
                    <strong>Reason:</strong> {note.reason}
                  </div>
                </div>
              ))
            ) : (
              <div>No notes found.</div>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={closeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default Reconciliation;
