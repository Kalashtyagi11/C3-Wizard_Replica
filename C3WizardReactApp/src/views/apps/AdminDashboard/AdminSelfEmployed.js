import { Helmet } from 'react-helmet';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import Select from 'react-select';
import TextField from '@mui/material/TextField';
import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import moment from 'moment';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import { format, parse } from 'date-fns';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Label,
  Spinner,
  Input,
  UncontrolledTooltip,
  Card,
  CardBody,
  Table,
  FormGroup,
} from 'reactstrap';
import {
  clearDashboardData,
  getDashboardList,
  previewNWData,
  getReportList,
  selfAdminDelete,
} from '../../../store/apps/selfEmployee/dashboard/SelfDashboardSlice';
import { StatusChange, getStatus } from '../../../store/apps/dashboard/DashboardSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import DashboardService from '../../../service/dashboard/Dashboard';
import formatDate, { formatDateDDMMMYYYY } from '../../../helpers/dateFormater';
import PeriodSelectorWithState from './components/PeriodSelectorWithState';
import user1 from '../../../assets/images/users/user4.jpg';
import Paid from '../../../assets/images/users/Paid.png';
import ReportLogo from '../../../assets/images/users/Reportlogo.jpg';
import DeleteModal from './components/AdminDelete';
import NillImage from '../../../assets/images/users/Nill.png';
import AdminCustomize from '../component/AdminCustomizes';
import NotesModal from '../component/NotesModal';
import './Switch..scss';

const AdminSelfEmployed = () => {
  const [isLoadingDown, setIsLoadingDown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showModalNote, setShowModalNote] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [loadingNoteId, setLoadingNoteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [loadingSwitch, setLoadingSwitch] = useState(false);
  const [toggleValue, setToggleValue] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [isSubmittedNill, setIsSubmittedNill] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // renamed
  const [deleteItem, setDeleteItem] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
  const [loadingHeaderId, setLoadingHeaderId] = useState(null);
  const userId = localStorage.getItem('userID');
  const [showRecipt, setShowRecipt] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [data, setData] = useState(null);
  const printRef = useRef();
  const userID = localStorage.getItem('userID');
  const CompanyIdSelected = localStorage.getItem('CompanyIdSelected');
  const [fromPeriod, setFromPeriod] = useState(null);
  const [toPeriod, setToPeriod] = useState(null);
  const [isPaidStatus, setIsPaidStatus] = useState(null);
  const [endPeriod, setEndPeriod] = useState(null);
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'SELF EMPLOYED');
  const canPreviewSelfAdminReport = employerPermission?.is_preview;
  const canPrintSelfAdminReport = employerPermission?.is_Print;
  const canViewAdminReport = employerPermission?.viewPermission;
  const navigate = useNavigate();
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedValue, setSelectedValue] = useState(CompanyIdSelected || '');
  const handleClose2 = () => setShow2(false);
  const { toPDF: toPDF1, targetRef: targetRef1 } = usePDF({ filename: 'TransactionReceipt.pdf' });
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
          margin: 0mm 8mm;
      }
         table th, table td {
        font-size: 10px !important;
      }
    </style>
    ${printContent}
  `;

    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload page
  };

  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.messageReducer);
  const { DashboardData, previewNWDataList, ReportData } = useSelector(
    (state) => state.selfDashboardSlice,
  );
  const [FMonth, setFMonth] = useState();
  const [TMonth, setTMonth] = useState(new Date().getMonth());

  const [year, setYear] = useState('');
  const [filteredData, setFilteredData] = useState(DashboardData?.dashboardddata || []);

  const [currentDateTime, setCurrentDateTime] = useState('');

  const handlePayClick = (headerId) => {
    navigate(`/admin/C3/offlineReportSelf/${headerId}`);
  };

  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);

  useEffect(() => {
    if (canViewAdminReport === false) {
      navigate('/login');
    }
  }, [canViewAdminReport, navigate]);

  const options = (employeeList || [])
    .filter((item) => item.fullName !== 'SSB')
    .map((item) => ({
      value: item.employeeID,
      // label: item.fullName,
      label: `${item.fullName} (${item.socSecNum || 'N/A'})`,
      socSecNum: item.socSecNum,
    }));

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption?.value || '');
  };

  const getAllSelfEmployerHandler = async () => {
    setLoadingDropdown(true);
    try {
      const res = await UserManagementServices.getAllSelfEmployerData();
      setEmployeeList(res.data.data);
    } catch (err) {
        console.error('Something went wrong:', err);
    } finally {
      setLoadingDropdown(false);
    }
  };

  // 🔹 reusable function
  const fetchReportList = () => {
    const selectedYear = fromPeriod ? moment(fromPeriod).format('YYYY') : new Date().getFullYear();

    const selectedEndYear = endPeriod ? moment(endPeriod).format('YYYY') : new Date().getFullYear();

    if (!selectedValue) return; // safeguard

    const fromMonthFormatted = fromPeriod ? moment(fromPeriod).format('MM') : '01';
    const toMonthFormatted = toPeriod ? moment(toPeriod).format('MM') : '12';

    dispatch(
      getReportList({
        CompanyId: selectedValue,
        MonthF: fromMonthFormatted,
        MonthTO: toMonthFormatted,
        Year: selectedYear,
        endYear: selectedEndYear,
      }),
    );
  };

  useEffect(() => {
    fetchReportList();
    return () => {
      localStorage.removeItem('CompanyIdSelected');
    };
  }, [selectedValue, fromPeriod, toPeriod, endPeriod, dispatch]);

  const handleShow2 = (headerId, currentYear, monthNo, ispaid, isSubmitted) => {
    dispatch(previewNWData({ headerId, year: currentYear, monthNo }));
    setShow2(true);
    setIsPaidStatus(ispaid);
    setIsSubmittedNill(isSubmitted);
  };

  const handleSearch = () => {
    if (!selectedValue) {
      toast.error('Please select a company. ');
      return;
    }

    if (fromPeriod && toPeriod && toPeriod < fromPeriod) {
      toast.error('To Period cannot be smaller than From Period!');
      return;
    }

    const fromMonthFormatted = fromPeriod ? moment(fromPeriod).format('MM') : 0;
    const toMonthFormatted = toPeriod ? moment(toPeriod).format('MM') : 0;
    const selectedYear = fromPeriod ? moment(fromPeriod).format('YYYY') : 0;
    const selectedEndYear = endPeriod ? moment(endPeriod).format('YYYY') : 0;

    setLoadingReport(true);

    dispatch(
      getReportList({
        CompanyId: selectedValue,
        MonthF: fromMonthFormatted,
        MonthTO: toMonthFormatted,
        Year: selectedYear,
        endYear: selectedEndYear,
      }),
    )
      .unwrap()
      .then((response) => {
        // handle success if needed
      })
      .catch((err) => {
        toast.error('Failed to fetch contribution data.');
      })
      .finally(() => {
        setLoadingReport(false);
      });
  };

  const DownloadPrint = async (headerId, transactionID) => {
    setLoadingHeaderId(headerId);
    try {
      const res = await DashboardService.downloadTransactionAdmin({
        // userId,
        transactionID,
        c3HeaderId: headerId, // ✅ set headerID to c3HeaderId
      });
      if (res.data.status === true) {
        setData(res.data.data);
        setIsOpen(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
        console.error('Something went wrong:', err);
    } finally {
      setLoadingHeaderId(null);
    }
  };

  const handleDownload = async () => {
    setIsLoadingDown(true);
    try {
      await toPDF1(); // if it's not async, remove `await`
    } finally {
      setIsLoadingDown(false);
    }
  };

  const handleClosePrint = () => {
    setIsOpen(false);
    setData(null);
  };

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

  useEffect(() => {
    getAllSelfEmployerHandler();

    return () => {
      dispatch(clearDashboardData());

      localStorage.removeItem('CompanyIdSelected');
    };
  }, []);

  const handleDeleteClick = (deleteId, delUserId = userId, delType = 'self') => {
    setDeleteItem({
      id: deleteId,
      userId: delUserId,
      type: delType,
    });
    toggleDeleteModal();
  };

  const confirmDelete = () => {
    setLoadingDelete(true);
    dispatch(
      selfAdminDelete({
        headerId: deleteItem.id,
        userid: deleteItem.userId,
        type: deleteItem.type,
      }),
    )
      .unwrap()
      .then((response) => {
        fetchReportList();
        toggleDeleteModal();
      })
      .catch((err) => {
        console.error('Something went wrong:', err);
      })
      .finally(() => {
        toggleDeleteModal();
        setLoadingDelete(false);
      });
  };

  const handleToggle = (id, checked) => {
    setSelectedId(id);
    setToggleValue(checked);
    setModalOpen(true);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setNotes(''); // reset notes when closing
  };

  const handleConfirm = async () => {
    if (!notes.trim()) {
      toast.error('Please enter a reason.');
      return;
    }
    setLoadingSwitch(true);
    const payload = {
      notes,
      headerId: selectedId,
      companyId: selectedValue,
      userId: userID,
      type: 'self',
    };

    try {
      const response = await dispatch(StatusChange(payload)).unwrap();
      if (response) {
        fetchReportList();
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Something went wrong:', error);
    } finally {
      setLoadingSwitch(false);
      setModalOpen(false);
      setNotes('');
    }
  };

  const parseData = (rawData) => {
    if (!rawData) return [];

    if (Array.isArray(rawData) && typeof rawData[0] === 'string') {
      return rawData.map((item) => {
        const parts = item.split(',');
        return {
          date: parts[0]?.trim() || '',
          user: parts[1]?.replace('by', '').trim() || '',
          statusChange: parts[2]?.trim() || '',
          reason: parts.slice(3).join(',').trim() || '',
        };
      });
    }

    if (typeof rawData === 'string') {
      const parts = rawData.split(',');
      return [
        {
          date: parts[0]?.trim() || '',
          user: parts[1]?.replace('by', '').trim() || '',
          statusChange: parts[2]?.trim() || '',
          reason: parts.slice(3).join(',').trim() || '',
        },
      ];
    }

    if (Array.isArray(rawData)) {
      return rawData.map((item) => ({
        date: item.date || '',
        user: item.user || '',
        statusChange: item.statusChange || '',
        reason: item.reason || '',
      }));
    }

    return [];
  };

  const getLatestNote = (noteData) => {
    const parsed = parseData(noteData);
    return parsed.length > 0 ? parsed[parsed.length - 1] : null;
  };

  const formatValue = (val) => {
    if (!val) return '';
    if (typeof val === 'object') {
      const reason = val.reason || '';
      return reason.length > 10 ? `${reason.substring(0, 10)}` : reason;
    }
    return val;
  };

  const getFirstNote = (noteData) => {
    if (!noteData) return '';
    if (Array.isArray(noteData) && noteData.length > 0) return noteData[0];
    if (typeof noteData === 'string') return noteData.split('\n')[0];
    return noteData;
  };

  const closeModal = () => setShowModalNote(false);
  const handleShowMore = (itemId) => {
    const payload = {
      type: 'self',
      headerId: itemId,
    };
    setLoadingNoteId(itemId);

    dispatch(getStatus(payload))
      .unwrap()
      .then((response) => {
        const rawData = response?.StatusData || [];
        const parsedData = parseData(rawData);
        setModalContent(parsedData);
        setShowModalNote(true);
      })
      .catch((err) => console.error('Error fetching note:', err))
      .finally(() => setLoadingNoteId(null));
  };

  return (
    <>
      <Helmet>
        <title>Self Employed - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
        <sidebar-barrrrrr></sidebar-barrrrrr>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
          <ul className="d-flex align-items-center mt-3 gap-2 list-unstyled">
            <li className="fw-medium">
              <Link to="/admin-dashboard" className="d-flex align-items-center gap-1 text-muted">
                <i className="ti-home" /> Admin Dashboard{' '}
              </Link>
            </li>
            <li>-</li>

            <li className="fw-medium">Self Employed </li>
          </ul>
        </div>

        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="page-content-wrapper">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-body px-4 py-2">
                        <div className="row mt-3">
                          <div className="col-4 addition">
                            <Label className="mb-0">Select Self Employee</Label>

                            {/* <Select
                              classNamePrefix="react-select"
                              options={options}
                              value={options.find((opt) => opt.value === selectedValue) || null}
                              onChange={handleChange} 
                              placeholder="Select Employer"
                              isSearchable
                              isClearable
                            /> */}
                            <div className="select-wrapper">
                              <Select
                                options={options}
                                value={options.find((opt) => opt.value === selectedValue) || null}
                                onChange={handleChange}
                                placeholder="Search employee name or social sec number"
                                isSearchable
                                isClearable
                                isLoading={false} // We use custom spinner
                                classNamePrefix="custom-select"
                                styles={{
                                  control: () => ({
                                    padding: '0px',
                                  }), // Disable inline styles
                                }}
                              />

                              {loadingDropdown && (
                                <Spinner size="sm" color="primary" className="select-spinner" />
                              )}
                            </div>
                          </div>

                          {/* <PeriodSelectorWithState
                            fromPeriod={fromPeriod}
                            setFromPeriod={setFromPeriod}
                            toPeriod={toPeriod}
                            setToPeriod={setToPeriod}
                          /> */}
                          <PeriodSelectorWithState
                            fromPeriod={fromPeriod}
                            setFromPeriod={setFromPeriod}
                            endPeriod={endPeriod}
                            setEndPeriod={setEndPeriod}
                            toPeriod={toPeriod}
                            setToPeriod={setToPeriod}
                          />
                          <div className="col-md-2 col-lg-2 col-xl-2">
                            {/* <Label>&nbsp;</Label> */}
                            <div className="mb-3">
                              <Button
                                onClick={handleSearch}
                                disabled={loadingReport}
                                // disabled={loading || !year || !FMonth || !TMonth}
                                className="btn btn-success waves-effect waves-light h-45"
                                style={{ height: '45px', minWidth: '100px', marginTop: '22px' }}
                              >
                                {loadingReport ? (
                                  <>
                                    <Spinner size="sm" /> Searching...
                                  </>
                                ) : (
                                  <>
                                    {' '}
                                    <Icon.Search size={20} style={{ cursor: 'pointer' }} /> Search
                                  </>
                                )}
                              </Button>
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
                        <h4 className="header-title mb-0 text-success">Report List</h4>
                      </div>
                      <div className="card-body pt-1">
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead>
                              <tr className="border-b">
                                <th>Month</th>
                                <th>Year</th>

                                <th className="td-text-align1">Wages</th>
                                <th className="td-text-align1">Fine</th>
                                <th className="td-text-align1">Total</th>

                                <th className="td-pl-2">Creation Date</th>
                                <th>Notes</th>
                                <th>Is Submitted</th>

                                <th>Preview</th>
                                <th>Delete</th>
                                <th>Payment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* {ReportData?.data && ReportData?.data?.length > 0 ? (
                                ReportData?.data?.map((item) => ( */}
                              {ReportData?.data?.dashboardddata &&
                              ReportData?.data?.dashboardddata?.filter(
                                (item) => String(item.is_submitted).toLowerCase() === 'true',
                              )?.length > 0 ? (
                                ReportData?.data?.dashboardddata
                                  ?.filter((item) => item.is_submitted)
                                  ?.map((item) => (
                                    <tr key={item.headerId}>
                                      <td>
                                        <span
                                          className=""
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="top"
                                          title="Submitted"
                                        >
                                          {item.is_submitted === true ? (
                                            <i className="fa fa-check-circle text-success" />
                                          ) : (
                                            <i className="fa fa-times-circle text-danger" />
                                          )}
                                        </span>
                                        &nbsp;
                                        {item?.month ?? 'N/A'}
                                      </td>
                                      <td>{item?.year ?? 'N/A'}</td>
                                      <td className="td-text-align1">
                                        ${item?.totalWages?.toFixed(2) ?? '0.00'}
                                      </td>

                                      <td className="td-text-align1">
                                        ${item?.totalsspenalty?.toFixed(2) ?? '0.00'}
                                      </td>

                                      <td className="td-text-align1">
                                        ${item?.countribution?.toFixed(2) ?? '0.00'}
                                      </td>

                                      <td className="td-pl-2">
                                        {item?.creationDate
                                          ? formatDateDDMMMYYYY(item?.creationDate)
                                          : 'N/A'}
                                      </td>
                                      <td style={{ maxWidth: '100px' }}>
                                        {formatValue(getLatestNote(item.notes))}
                                        {item.notes &&
                                          typeof item.notes === 'string' &&
                                          item.notes.trim() !== '' && (
                                            <span
                                              onClick={() => handleShowMore(item.headerId)}
                                              style={{
                                                cursor: 'pointer',
                                              }}
                                            >
                                              {loadingNoteId === item.headerId ? (
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
                                      <td>
                                        <div className="toggle-container">
                                          {/* <div
                                            className={`toggle-switch ${
                                              item.is_submitted !== 'true' ? 'on' : ''
                                            }${
                                              item.ispaid === true || item.ispaid === 'true'
                                                ? 'disabled'
                                                : ''
                                            }`}
                                          > */}
                                          <div
                                            className={`toggle-switch ${
                                              item.is_submitted !== 'true' ? 'on' : ''
                                            }${
                                              item.ispaid === true ||
                                              item.ispaid === 'true' ||
                                              item.isImportFromBEMA === true ||
                                              item.isImportFromBEMA === 'true'
                                                ? 'disabled'
                                                : ''
                                            }`}
                                          >
                                            <FormGroup check>
                                              <Input
                                                type="checkbox"
                                                className="toggle-input"
                                                id={`toggle-${item.headerId}`}
                                                checked={item.is_submitted !== 'true'}
                                                onChange={(e) =>
                                                  handleToggle(item.headerId, e.target.checked)
                                                }
                                                disabled={
                                                  item.ispaid === true || item.ispaid === 'true'
                                                }
                                                // disabled={
                                                //   item.ispaid === true ||
                                                //   item.ispaid === 'true' ||
                                                //   item.isImportFromBEMA === true ||
                                                //   item.isImportFromBEMA === 'true'
                                                // }
                                              />

                                              {/* Toggle handle (clickable) */}
                                              <Label
                                                htmlFor={`toggle-${item.headerId}`}
                                                className="toggle-handle"
                                              />

                                              {/* Yes/No text (now clickable too) */}
                                              <Label
                                                htmlFor={`toggle-${item.id}`}
                                                className="toggle-status"
                                              >
                                                {item.is_submitted !== 'true' ? 'Yes' : 'No'}
                                              </Label>
                                            </FormGroup>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        {canPreviewSelfAdminReport ? (
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#myModal3"
                                            className="badge bg-soft-primary text-primary f-18"
                                            data-bs-placement="top"
                                            title="Preview"
                                            onClick={() =>
                                              handleShow2(
                                                item.headerId,
                                                item.year,
                                                item.monthNo,
                                                item.ispaid,
                                                item.isNilReturn,
                                              )
                                            }
                                          >
                                            <i className="fas fa-eye" />
                                          </a>
                                        ) : (
                                          <a
                                            className="badge bg-soft-primary text-primary f-18"
                                            title="Preview"
                                            style={{ cursor: 'not-allowed', opacity: 0.4 }}
                                          >
                                            <i className="fas fa-eye" />
                                          </a>
                                        )}
                                      </td>

                                      <td>
                                        {selfAdminDelete ? (
                                          <button
                                            type="button"
                                            className="badge bg-soft-danger text-danger"
                                            onClick={() => handleDeleteClick(item.headerId)}
                                          >
                                            <Icon.Trash size={20} />
                                          </button>
                                        ) : (
                                          <span
                                            className="badge bg-soft-secondary text-muted"
                                            style={{ opacity: 0.5, pointerEvents: 'none' }}
                                          >
                                            <i className="ti-trash f-20"></i>
                                          </span>
                                        )}
                                      </td>
                                      <td className="d-non">
                                        {item.isImportFromBEMA ? (
                                          <a
                                            className="btn btn-success waves-effect waves-light py-1"
                                            type="button"
                                            disabled
                                            style={{ cursor: 'not-allowed', opacity: '0.4' }}
                                          >
                                            BIMA
                                          </a>
                                        ) : !item.ispaid ? (
                                          <a
                                            onClick={() => handlePayClick(item.headerId)}
                                            className="btn btn-success waves-effect waves-light py-1"
                                            type="button"
                                          >
                                            <i className="fas fa-dollar-sign" /> Pay
                                          </a>
                                        ) : (
                                          <span
                                            style={{
                                              marginLeft: '10px',

                                              cursor: 'pointer',
                                            }}
                                            id="downloadIcon"
                                            onClick={() =>
                                              DownloadPrint(item.headerId, item.transactionID)
                                            }
                                          >
                                            Paid &nbsp;
                                            {loadingHeaderId === item.headerId ? (
                                              <>
                                                <Spinner size="sm" />
                                              </>
                                            ) : (
                                              <>
                                                <span style={{ color: '#119310' }}>
                                                  <i
                                                    className="mdi mdi-printer f-18"
                                                    aria-hidden="true"
                                                  />
                                                </span>
                                                <UncontrolledTooltip
                                                  placement="top"
                                                  target="downloadIcon"
                                                >
                                                  Download Payment Receipt
                                                </UncontrolledTooltip>
                                              </>
                                            )}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))
                              ) : (
                                <tr>
                                  <td colSpan="15" className="text-center">
                                    No records found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
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
          {/* end main content*/}
        </div>
        {/* END layout-wrapper */}

        {/* PopUp Start   */}
        <Modal isOpen={show2} size="lg" onHide={handleClose2}>
          <ModalHeader toggle={handleClose2}>
            <h2>Report</h2>
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
                                        {/* <div className="col-xl-5"></div>
                                        <div className="col-xl-2"></div>
                                        <div className="col-xl-5">
                                          <span className="text_font">For</span> &nbsp;
                                          {previewNWDataList?.data?.[0]?.currentMonth}
                                          <span
                                            className="border mr-bottom"
                                            style={{
                                              borderBottom: '1px solid #666 !important',
                                              width: '80%',
                                              display: 'block',
                                            }}
                                          ></span>
                                        </div> */}
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
                                                  {previewNWDataList?.data?.[0]?.currentMonth || ''}
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
                                          {previewNWDataList?.data?.[0]?.empName}{' '}
                                        </span>
                                      </p>
                                      <p style={{ textAlign: 'left' }} className="mb-2">
                                        <b>Social Security Number</b>{' '}
                                        <span className="s9">
                                          {' '}
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
                                          {isSubmittedNill ? (
                                            <>&nbsp;</>
                                          ) : (
                                            <>
                                              $
                                              {previewNWDataList?.data?.[0]?.grandTotal.toFixed(
                                                2,
                                              ) ?? '0.00'}
                                            </>
                                          )}
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
                                              <th rowSpan={2} style={{ minWidth: '150px' }}>
                                                {' '}
                                                Self Employed Contribution
                                              </th>
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
                                                {' '}
                                                {previewNWDataList?.data?.[0]?.fourthWeekOfMonth}
                                              </td>
                                              <td className="text-center">
                                                {' '}
                                                {previewNWDataList?.data?.[0]?.fifthWeekOfMonth}
                                              </td>
                                              <td className="text-end">
                                                {' '}
                                                {/* $
                                                {previewNWDataList?.data?.[0]?.deductLeavyWages.toFixed(
                                                  2,
                                                ) ?? '0.00'} */}
                                              </td>
                                              <td className="">
                                                {' '}
                                                {previewNWDataList?.data?.[0]?.remarks}{' '}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td colSpan={5}>
                                                {' '}
                                                <b> a) Total Contribution:</b>
                                                ----------------------------------------------------------------------------------
                                                &gt;
                                              </td>
                                              <td className="text-end">
                                                {isSubmittedNill ? (
                                                  <>&nbsp;</>
                                                ) : (
                                                  <>
                                                    $
                                                    {previewNWDataList?.data?.[0]?.deductLeavyWages.toFixed(
                                                      2,
                                                    ) ?? '0.00'}
                                                  </>
                                                )}
                                              </td>
                                              <td rowSpan={2}>
                                                {isPaidStatus && <span> Receipt No. </span>}

                                                {isPaidStatus && (
                                                  <>{previewNWDataList?.data?.[0]?.receiptNumber}</>
                                                )}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td colSpan={5}>
                                                <b> b) Fines:</b>
                                                ---------------------------------------------------------
                                                {isPaidStatus
                                                  ? '----------------------------------------'
                                                  : '-----------------------------------------'}
                                                ------&gt;
                                              </td>

                                              <td
                                                className={`text-end ${
                                                  previewNWDataList?.data?.[0]?.fine > 0
                                                    ? 'text-danger'
                                                    : 'text-black'
                                                }`}
                                              >
                                                {isSubmittedNill ? (
                                                  <>&nbsp;</>
                                                ) : (
                                                  <>
                                                    $
                                                    {(
                                                      previewNWDataList?.data?.[0]?.fine ?? 0
                                                    ).toFixed(2)}
                                                  </>
                                                )}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td colSpan={5}>
                                                <b> c) Grand Total:</b>
                                                ---------------------------------------------------------
                                                {isPaidStatus
                                                  ? '--------------------------------'
                                                  : '---------------------------------'}
                                                ----&gt;
                                              </td>
                                              <td className="text-end">
                                                {isSubmittedNill ? (
                                                  <>&nbsp;</>
                                                ) : (
                                                  <>
                                                    $
                                                    {previewNWDataList?.data?.[0]?.grandTotal.toFixed(
                                                      2,
                                                    ) ?? '0.00'}
                                                  </>
                                                )}
                                              </td>

                                              <td>
                                                {isPaidStatus && (
                                                  <>
                                                    <span> Paid on </span> <br />
                                                    <span>
                                                      {moment(
                                                        previewNWDataList?.data?.[0]?.receiptDate,
                                                        'DD/MM/YYYY HH:mm:ss',
                                                      ).format('DD-MMM-YYYY hh:mm:ss A')}
                                                    </span>
                                                  </>
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <p className="text-center">
                                          I hereby certify that the particulars stated above are
                                          true and correct <br />
                                          the best of my knowledge and belief
                                        </p>
                                      </div>
                                      <div className="row mt-3">
                                        <table className="w-100">
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  width: isPaidStatus ? '30%' : '40%',
                                                  verticalAlign: 'top',
                                                }}
                                              >
                                                <div style={{ height: '25px' }}>&nbsp;</div>
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
                                              <td
                                                style={{
                                                  width: isPaidStatus ? '5%' : '10%',
                                                  verticalAlign: 'top',
                                                }}
                                              ></td>

                                              <td
                                                style={{
                                                  width: isPaidStatus ? '30%' : '40%',
                                                  verticalAlign: 'top',
                                                }}
                                              >
                                                <div
                                                  className="addon_class"
                                                  style={{ marginBottom: '4px' }}
                                                >
                                                  {moment(
                                                    previewNWDataList?.data?.[0]?.date,
                                                    'MM/DD/YYYY h:mm:ss A',
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
                                              <td
                                                style={{
                                                  width: isPaidStatus ? '5%' : '10%',
                                                  verticalAlign: 'top',
                                                }}
                                              ></td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                    <div className="draft-img">
                                      {isPaidStatus && (
                                        <span className="Paid_Image">
                                          <img src={Paid} alt="Paid" />
                                        </span>
                                      )}
                                      {isSubmittedNill && (
                                        <span className="Paid_Image">
                                          <img
                                            src={NillImage}
                                            alt="Submitted"
                                            width={20}
                                            height={20}
                                          />
                                        </span>
                                      )}
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
                  {/* end main content*/}
                </div>
                {/* END layout-wrapper */}

                {/* Right bar overlay*/}

                {/* JAVASCRIPT */}
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
            {canPrintSelfAdminReport ? (
              <Button
                color="btn btn-info waves-effect waves-light h-45 btn btn-secondary"
                onClick={toPDF}
              >
                <i className="fas fa-download"></i> Download PDF
              </Button>
            ) : (
              <Button color="secondary" style={{ cursor: 'not-allowed', opacity: 0.4 }}>
                <i className="fas fa-download"></i> Download PDF
              </Button>
            )}
          </ModalFooter>
        </Modal>
        {/* Popup End  */}
        <Modal isOpen={isOpen} toggle={handleClosePrint} size="lg" centered scrollable>
          <ModalHeader toggle={handleClosePrint}>Payment</ModalHeader>
          <ModalBody>
            <div ref={targetRef1}>
              <Card style={{ maxWidth: '700px', margin: 'auto', fontSize: '1.2rem' }}>
                <CardBody className="border p-4 shadow">
                  <>
                    <div className="receipt-box shadow-sm p-4 rounded">
                      <div className="receipt-header">
                        <div className="d-flex align-items-center">
                          <img src={user1} alt="" width="80px" />
                          <h4 className="mt-2 ms-4 fw-bold">
                            St. Christopher and Nevis Social Security Board
                          </h4>
                        </div>
                        <h1 className="my-3 text-center fw-bold">RECEIPT</h1>
                      </div>
                      <div className="text-center profile-area mb-4">
                        <div className="row mt-5">
                          <div className="col-6">
                            <p
                              className="mb-0"
                              style={{
                                fontWeight: '600',
                                fontSize: '18px',
                                textAlign: 'left',
                              }}
                            >
                              Head Office
                            </p>
                            <p
                              className="mb-1"
                              style={{
                                fontSize: '16px',
                                textAlign: 'left',
                                borderRight: '1px solid #000',
                              }}
                            >
                              Robert Llewellyn Bradshaw Building
                              <br />
                              P.O. Box 79, Bay Road, Basseterre, St. Kitts
                              <br />
                              PHONE: +1 (869) 465-2535
                              <br />
                              EMAIL: pubinfo@socialsecurity.kn
                            </p>
                          </div>
                          <div className="col-6">
                            <p
                              className="mb-0"
                              style={{
                                fontWeight: '600',
                                fontSize: '18px',
                                textAlign: 'left',
                              }}
                            >
                              Branch Office
                            </p>
                            <p className="mb-1" style={{ fontSize: '16px', textAlign: 'left' }}>
                              {`{Pinney's}`} Commercial Site
                              <br />
                              P.O. Box 667 Nevis
                              <br />
                              PHONE: +1 (869) 469-5245
                              <br />
                              EMAIL: nevis@socialsecurity.kn
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="receipt-number">
                        RECEIPT# <span className="amount">{data?.receiptNumber || '0000001'}</span>
                      </div>

                      <table className="table table-bordered">
                        <tbody>
                          <tr className="bg-light">
                            <th>Reg No.</th>
                            <td>{data?.regNo}</td>
                          </tr>
                          <tr>
                            <th>Customer Name</th>
                            <td>{data?.refCustomerName}</td>
                          </tr>
                          <tr>
                            <th>Transaction ID</th>
                            <td>{data?.paymentGatewayTransactionID}</td>
                          </tr>
                          {data?.totalSscontributions != null && (
                            <tr>
                              <th>Total SS Contributions</th>
                              <td className="amount1">
                                ${Number(data.totalSscontributions).toFixed(2)}
                              </td>
                            </tr>
                          )}

                          {data?.totalSspenalty != null && (
                            <tr>
                              <th>Total SS Penalty</th>
                              <td className="amount1">${Number(data.totalSspenalty).toFixed(2)}</td>
                            </tr>
                          )}

                          {data?.totalLeavy != null && (
                            <tr>
                              <th>Total Levy</th>
                              <td className="amount1">${Number(data.totalLeavy).toFixed(2)}</td>
                            </tr>
                          )}

                          {data?.totalLevyeepenalty != null && (
                            <tr>
                              <th>Total Levy Penalty</th>
                              <td className="amount1">
                                ${Number(data.totalLevyeepenalty).toFixed(2)}
                              </td>
                            </tr>
                          )}

                          {data?.totalServayance != null && (
                            <tr>
                              <th>Total Severance</th>
                              <td className="amount1">
                                ${Number(data.totalServayance).toFixed(2)}
                              </td>
                            </tr>
                          )}

                          {data?.totalPepenalty != null && (
                            <tr>
                              <th>Total PE Penalty</th>
                              <td className="amount1">${Number(data.totalPepenalty).toFixed(2)}</td>
                            </tr>
                          )}
                          <tr>
                            <th>Amount</th>
                            <td className="amount">
                              <b>${Number(data?.paymentAmount).toFixed(2)}</b>
                            </td>
                          </tr>
                          <tr>
                            <th>Status</th>
                            <td
                              className={
                                data?.paymentStatus === 'AUTHORIZED' ? 'status-authorized' : ''
                              }
                            >
                              <b>{data?.paymentStatus}</b>
                            </td>
                          </tr>
                          <tr>
                            <th>Period</th>
                            <td>
                              {data?.period
                                ? moment(data.period, 'MM/YYYY').format('MMM-YYYY')
                                : 'N/A'}
                            </td>
                          </tr>
                          <tr>
                            <th>Transaction Date</th>
                            <td>{data?.createTime || 'N/A'}</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="disclaimer border rounded p-3 mt-4">
                        <strong>RECEIPT DISCLAIMER:</strong>
                        <br />
                        Your Payment has been posted to your account and will be applied to any past
                        due social security contributions, levy, severance, fines and penalties or
                        against the current period liabilities.
                      </div>
                    </div>
                  </>
                </CardBody>
              </Card>
            </div>
            <Card style={{ maxWidth: '700px', margin: 'auto', fontSize: '1.2rem' }}>
              <CardBody style={{ textAlign: 'end' }}>
                <Button color="success" onClick={handleDownload} disabled={isLoadingDown}>
                  {isLoadingDown ? (
                    <>
                      <Spinner size="sm" /> Downloading...
                    </>
                  ) : (
                    'Download'
                  )}
                </Button>
                <Button
                  variant="secondary"
                  className="h-45 btn btn-light"
                  onClick={() => {
                    handleClosePrint();
                  }}
                >
                  Close
                </Button>
              </CardBody>
            </Card>
          </ModalBody>
        </Modal>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Confirmation"
        message="Do you really want to delete this self employee?"
        loadingDelete={loadingDelete}
      />
      <AdminCustomize
        isOpen={modalOpen}
        toggle={toggleModal}
        title="Are you sure you want to change the status of the Self Employee Contribution?"
        toggleValue={toggleValue}
        notes={notes}
        setNotes={setNotes}
        loading={loadingSwitch}
        onConfirm={handleConfirm}
      />
      <NotesModal isOpen={showModalNote} toggle={closeModal} modalContent={modalContent} />
    </>
  );
};
export default AdminSelfEmployed;
