import { Helmet } from 'react-helmet';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Select from 'react-select';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import * as Icon from 'react-feather';
import TextField from '@mui/material/TextField';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Label,
  Input,
  UncontrolledTooltip,
  Card,
  CardBody,
  Table,
  Spinner,
  FormGroup,
} from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';

import { format, parse } from 'date-fns';
import {
  clearContributionCount,
  getContribution,
} from '../../../store/apps/nonWorkingDirectory/NonWorkingDirectory';
import {
  previewNWData,
  deleteContibutionAdmin,
  StatusChange,
  getStatus,
} from '../../../store/apps/dashboard/DashboardSlice';

import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import DashboardService from '../../../service/dashboard/Dashboard';
// import { formatDateDDMMMYYYY } from '../../../helpers/dateFormater';
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

const AdminNonWorkingDirector = () => {
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
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [loadingHeaderId, setLoadingHeaderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userID');
  const [showRecipt, setShowRecipt] = useState(false);
  const [data, setData] = useState(null);
  const printRef = useState();
  const navigate = useNavigate();
  const CompanyIdSelected = localStorage.getItem('CompanyIdSelected');
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isPaidStatus, setIsPaidStatus] = useState(null);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const userID = localStorage.getItem('userID');
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'NW DIRECTOR');
  const canPreviewNWDAdminReport = employerPermission?.is_preview;
  const canPrintNWDAdminReport = employerPermission?.is_Print;
  const canViewAdminReport = employerPermission?.viewPermission;
  const { toPDF: toPDF1, targetRef: targetRef1 } = usePDF({ filename: 'TransactionReceipt.pdf' });
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    if (canViewAdminReport === false) {
      navigate('/login');
    }
  }, [canViewAdminReport, navigate]);

  const handlePayClick = (headerID) => {
    navigate(`/admin/C3/offlineReportNW/${headerID}`);
  };

  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);

  const [companyList, setCompanyList] = useState([]);
  const [params, setParams] = useState({
    month: null,
    year: null,
    companyId: '',
    c3HeaderId: null,
  });
  const [selectedValue, setSelectedValue] = useState(CompanyIdSelected || '');
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.messageReducer);
  const { ContributionCount } = useSelector((state) => state.nonWorkingDirectorySlice);
  const { previewNWDataList } = useSelector((state) => state.dashboardSlice);

  const options = (companyList || [])
    .filter((item) => item.companyName !== 'SSB')
    .map((item) => ({
      value: item.companyId,
      // label: item.companyName,
      label: `${item.companyName} (${item.regNumber || 'N/A'})`, // show both companyName & regNumber
      regNumber: item.regNumber,
    }));

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption?.value || '');
  };
  const getDate = new Date();
  const [Year, setYear] = useState(getDate.getFullYear().toString());
  const [MonthF, setMonthF] = useState('');
  const [MonthTO, setMonthTO] = useState('');

  const monthList = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const getFilteredMonths = (fromMonth) => {
    return monthList.filter((month) => month.value >= fromMonth);
  };

  const getAllCompaniesHandler = async () => {
    setLoadingDropdown(true);
    try {
      const res = await UserManagementServices.getAllCompanyData(true);
      setCompanyList(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDropdown(false);
    }
  };

  const { toPDF, targetRef } = usePDF({
    filename: 'SocialSecurityReport.pdf',
    page: { margin: Margin.SMALL, orientation: 'landscape' },
  });

  const handlePrint = () => {
    const printContent = targetRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
    <style>
      @page {
        size: legal landscape;
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

  const handleShow2 = (headerID, month, ispaid, isSubmitted) => {
    setIsSubmittedNill(isSubmitted);
    const updatedParams = {
      monthId: month,
      year: Year,
      companyId: selectedValue,
      c3HeaderId: headerID,
    };

    setParams(updatedParams);

    dispatch(previewNWData(updatedParams));
    setShow2(true);
    setIsPaidStatus(ispaid);
  };

  const [fromPeriod, setFromPeriod] = useState(null);
  const [toPeriod, setToPeriod] = useState(null);
  const [endPeriod, setEndPeriod] = useState(null);

  const fetchContribution = () => {
    const selectedYear = fromPeriod ? moment(fromPeriod).format('YYYY') : new Date().getFullYear();
    const selectedEndYear = endPeriod ? moment(endPeriod).format('YYYY') : new Date().getFullYear();

    if (selectedValue) {
      const fromMonthFormatted = fromPeriod ? moment(fromPeriod).format('MM') : '01';
      const toMonthFormatted = toPeriod ? moment(toPeriod).format('MM') : '12';

      dispatch(
        getContribution({
          companyId: selectedValue,
          ResultArea: 'R',
          MonthF: fromMonthFormatted, // 🔹 keep consistent key names
          MonthTO: toMonthFormatted,
          Year: selectedYear,
          endYear: selectedEndYear,
        }),
      );
    }
  };

  useEffect(() => {
    fetchContribution();

    return () => {
      dispatch(clearContributionCount());
      localStorage.removeItem('CompanyIdSelected');
    };
  }, [selectedValue]);

  const DownloadPrint = async (headerID, transactionID) => {
    setLoadingHeaderId(headerID);
    try {
      const res = await DashboardService.downloadTransactionAdmin({
        // userId,
        transactionID,
        c3HeaderId: headerID, // ✅ set headerID to c3HeaderId
      });
      if (res.data.status === true) {
        setData(res.data.data);
        setIsOpen(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
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

  useEffect((headerID, month) => {
    if (headerID && month) {
      dispatch(previewNWData(headerID, month));
    }
  }, []);

  useEffect(() => {
    getAllCompaniesHandler();
  }, []);

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
      getContribution({
        companyId: selectedValue,
        ResultArea: 'R',
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
      .catch((error) => {
        toast.error('Failed to fetch contribution data.');
      })
      .finally(() => {
        setLoadingReport(false);
      });
  };

  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const handleDeleteClick = (deleteId, delUserId = userId, delType = 'dir') => {
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
      deleteContibutionAdmin({
        headerId: deleteItem.id,
        userid: deleteItem.userId,
        type: deleteItem.type,
      }),
    )
      .unwrap()
      .then((response) => {
        fetchContribution();
        toggleDeleteModal();
      })
      .catch((error) => {
        console.error('Something went wrong:', error);
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
      type: 'comp',
    };

    try {
      const response = await dispatch(StatusChange(payload)).unwrap();
      if (response) {
        fetchContribution();
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Something went wrong:', err);
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
      type: 'comp',
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
      .catch((error) => console.error('Error fetching note:', error))
      .finally(() => setLoadingNoteId(null));
  };

  return (
    <>
      <Helmet>
        <title>Non Working Director - C3Wizard</title>
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
                <i className="ti-home" />
                Admin Dashboard{' '}
              </Link>
            </li>
            <li>-</li>
            <li className="fw-medium">Non Working Director </li>
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
                          <div className="col-md-4 addition col-lg-4 col-xl-4">
                            <Label className="mb-0">Select Non Working Director</Label>

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
                                placeholder="Search non working director name or Reg Number "
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
                                <th className="td-text-align1"> Wages</th>
                                <th className="td-text-align1">Levy</th>

                                <th className="td-text-align1">Fines and Penalties</th>
                                <th className="td-text-align1">Total</th>
                                <th className="td-pl-2">Creation Date</th>
                                <th>Schedule</th>
                                <th>Is Nil</th>
                                <th>Notes</th>

                                <th>Is Submitted</th>
                                <th>Preview</th>
                                <th>Delete</th>
                                <th>Payment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.isArray(ContributionCount) &&
                              ContributionCount.filter((item) => item.is_submitted === true)
                                .length > 0 ? (
                                ContributionCount.filter((item) => item.is_submitted === true).map(
                                  (item) => (
                                    <tr>
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
                                        ${item?.levy?.toFixed(2) ?? '0.00'}
                                      </td>

                                      <td className="td-text-align1">
                                        ${item?.totallevyeepenalty?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align1">
                                        ${Number(item?.payAmt ?? 0).toFixed(2)}
                                      </td>
                                      <td className="td-pl-2">
                                        {item?.createDate
                                          ? formatDateDDMMMYYYY(item?.createDate)
                                          : 'NA'}
                                      </td>
                                      <td>{item?.schedule ?? 'NA'}</td>
                                      <td>
                                        {item.isNilReturn === true ? (
                                          <i className="fa fa-check-circle text-success" />
                                        ) : (
                                          <i className="fa fa-times-circle text-danger" />
                                        )}{' '}
                                      </td>
                                      <td style={{ maxWidth: '100px' }}>
                                        {formatValue(getLatestNote(item.notes))}
                                        {item.notes &&
                                          typeof item.notes === 'string' &&
                                          item.notes.trim() !== '' && (
                                            <span
                                              onClick={() => handleShowMore(item.headerID)}
                                              style={{
                                                cursor: 'pointer',
                                              }}
                                            >
                                              {loadingNoteId === item.headerID ? (
                                                <Spinner size="sm" color="primary" />
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
                                                id={`toggle-${item.headerID}`}
                                                checked={item.is_submitted !== 'true'}
                                                onChange={(e) =>
                                                  handleToggle(item.headerID, e.target.checked)
                                                }
                                                disabled={
                                                  item.ispaid === true || item.ispaid === 'true'
                                                }
                                              />

                                              {/* Toggle handle (clickable) */}

                                              <Label
                                                htmlFor={`toggle-${item.headerID}`}
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
                                        {canPreviewNWDAdminReport ? (
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#myModal3"
                                            className="badge bg-soft-primary text-primary f-18"
                                            data-bs-placement="top"
                                            title="Preview"
                                            onClick={() =>
                                              handleShow2(
                                                item.headerID,
                                                item.month,
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
                                        {deleteContibutionAdmin ? (
                                          <button
                                            type="button"
                                            className="badge bg-soft-danger text-danger"
                                            onClick={() => handleDeleteClick(item.headerID)}
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
                                      <td className="d-noe">
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
                                            onClick={() => handlePayClick(item.headerID)}
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
                                              DownloadPrint(item.headerID, item.transactionID)
                                            }
                                          >
                                            Paid &nbsp;
                                            {loadingHeaderId === item.headerID ? (
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
                                  ),
                                )
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
        <Modal isOpen={show2} size="xl" onHide={handleClose2}>
          <ModalHeader toggle={handleClose2}>
            <h2>Nw Director Reports</h2>
          </ModalHeader>
          <ModalBody>
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                    {/*    <div class="page-title mb-3">
                              <h5>Employer Details</h5> 
                          </div>
                   */}
                    {/* <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                  <h5 className="fw-semibold mb-0"> Director C3 Report </h5>
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
                    <li className="fw-medium">Director C3 Report </li>
                  </ul>
                </div> */}
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div ref={targetRef}>
                            <div className="card-body add_custom" style={{ position: 'relative' }}>
                              <h3 style={{ lineHeight: '131%', textAlign: 'center' }}>
                                THE ST.CHRISTOPHER AND NEVIS - SOCIAL SECURITY BOARD
                                <br /> STATEMENT OF WAGES AND CONTRIBUTIONS
                              </h3>
                              <h5 style={{ textAlign: 'center' }} className="mb-3">
                                Social Security Act, 1977, Housing and Social Development Levy Act,
                                1997, and the Protection of Employment Act, 1986
                              </h5>
                              <p className="p">
                                NB. To be used when reporting payments related to
                                <b>
                                  <span className="custom_font">Employees.</span>
                                </b>
                              </p>
                              <p className="c_style">
                                (This form is in quadruplicate. Please read these notes carefully.)
                              </p>
                              <div className="row" style={{ padding: '10px' }}>
                                <table className="w-100 full-border no-border-table">
                                  <tbody>
                                    {/* Row 1: Company Details */}
                                    <tr>
                                      <th className="label-cell fix-widthzero" colSpan="7">
                                        Name of Employer{' '}
                                        <span className="add-bottom-border">
                                          {isSubmittedNill ? (
                                            <> {previewNWDataList?.data?.company_name}</>
                                          ) : (
                                            <>{previewNWDataList?.data?.nameOfEmployer}</>
                                          )}
                                        </span>
                                      </th>

                                      <th className="label-cell fix-width" colSpan="7">
                                        Trade Name{' '}
                                        <span className="add-bottom-border">
                                          {isSubmittedNill ? (
                                            <>{previewNWDataList?.data?.trade_name}</>
                                          ) : (
                                            <>{previewNWDataList?.data?.tradeName}</>
                                          )}
                                        </span>
                                      </th>

                                      <th className="label-cell text-end" colSpan="4">
                                        Employer&#39;s Registration No.{' '}
                                        <span className="add-full-border">
                                          {isSubmittedNill ? (
                                            <>{previewNWDataList?.data?.company_reg_no}</>
                                          ) : (
                                            <>{previewNWDataList?.data?.empRegNo}</>
                                          )}
                                        </span>
                                      </th>
                                    </tr>

                                    {/* Row 2: Address & Employees */}
                                    <tr>
                                      <td
                                        colSpan="18"
                                        style={{
                                          height: '10px',
                                          border: 'none',
                                          padding: 0,
                                        }}
                                      ></td>
                                    </tr>
                                    <tr>
                                      <th className="label-cell" colSpan="14">
                                        Address{' '}
                                        <span className="p">
                                          (Location &amp; Box No. If address changed){' '}
                                          <span className="add-bottom-border">
                                            {isSubmittedNill ? (
                                              <>{previewNWDataList?.data?.company_address}</>
                                            ) : (
                                              <>{previewNWDataList?.data?.address}</>
                                            )}
                                          </span>
                                        </span>
                                      </th>
                                      <th className="label-cell text-end" colSpan="4">
                                        Director(s){' '}
                                        <span className="add-full-border">
                                          {isSubmittedNill ? (
                                            <>&nbsp;</>
                                          ) : (
                                            <>{previewNWDataList?.data?.noOfDir}</>
                                          )}
                                        </span>
                                      </th>
                                    </tr>

                                    {/* Row 3: Statement Note */}
                                    <tr>
                                      <td
                                        colSpan="18"
                                        style={{
                                          height: '10px',
                                          border: 'none',
                                          padding: 0,
                                        }}
                                      ></td>
                                    </tr>
                                    <tr>
                                      <th className="label-cell" colSpan="14">
                                        <span>To: Director of Social Security,</span>
                                        <br />
                                        <span style={{ marginLeft: '40px' }}>
                                          With this statement is a cheque and/or cash in respect of
                                          the Acts mentioned above for the month of:
                                        </span>{' '}
                                        <span className="add-bottom-adjust">
                                          {isSubmittedNill ? (
                                            <> {previewNWDataList?.data?.month_year}</>
                                          ) : (
                                            <> {previewNWDataList?.data?.month}</>
                                          )}
                                        </span>
                                      </th>
                                    </tr>

                                    {/* Row 4: Payment Breakdown */}
                                    <tr>
                                      <td
                                        colSpan="18"
                                        style={{
                                          height: '10px',
                                          border: 'none',
                                          padding: 0,
                                        }}
                                      ></td>
                                    </tr>
                                    <tr>
                                      <th className="label-cell" colSpan="3">
                                        (1) Accountant General :{' '}
                                        <span className="add-bottom-adjust">
                                          {isSubmittedNill ? (
                                            <>&nbsp;</>
                                          ) : (
                                            <>
                                              $
                                              {Number(
                                                previewNWDataList?.data?.accountantGenreal || 0,
                                              )?.toFixed(2)}
                                            </>
                                          )}
                                        </span>
                                      </th>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>

                              <div className="table-responsive mt-2">
                                <table className="table custom_tables table-hover table-bordered mb-0 white-space2 mb-1 report-table">
                                  {isPaidStatus && (
                                    <span className="Paid_Image">
                                      <img src={Paid} alt="Paid" />
                                    </span>
                                  )}
                                  {isSubmittedNill && (
                                    <span className="Paid_Image">
                                      <img src={NillImage} alt="Submitted" width={20} height={20} />
                                    </span>
                                  )}
                                  <span className="report_logo">
                                    <img src={ReportLogo} alt="ReportLogo" />
                                  </span>
                                  <thead>
                                    <tr>
                                      <th rowSpan={2}>(1)</th>
                                      <th rowSpan={2}>
                                        (2) <br />
                                        Social Security Number
                                        <br /> (6 digits)
                                      </th>
                                      <th rowSpan={2}>
                                        (3) <br />
                                        Name of Director/Board member
                                        <br /> (Surname First)
                                      </th>
                                      {/*      <th rowspan="2">(4) <br>Termination or Commencement Date of new employees Precede the date ith T for termination C for Commencement</th>
                                            <th rowspan="2">(5) <br>Pay Period/ Schedule e.g. W E2/W M 2/M</th> */}
                                      <th colSpan={5} className="td-text-align">
                                        {' '}
                                        (4)
                                        <br />
                                        Record Director Fees If More Than Once Per Month
                                      </th>
                                      <th className="td-text-align">
                                        {' '}
                                        (5)
                                        <br />
                                        Total Wages / Fee For The month
                                      </th>
                                      <th className="td-text-align">
                                        (6)
                                        <br />
                                        levy Deduction
                                      </th>
                                      <th rowSpan={2}>
                                        (7) <br />
                                        Remarks
                                      </th>
                                      {/*  <th rowspan="2">(8) <br>Deduct levy from Wages of employee. (See note 9 for exemption)</th>
                                            <th rowspan="2">(9) <br>Total Soc. Sec. 11% or 1% of Wages/Salaries of each employee. (See note 8)</th>
                                            <th rowspan="2">(10) <br>Remarks</th> */}
                                    </tr>
                                    <tr>
                                      <th className="td-text-align">WK1</th>
                                      <th className="td-text-align">WK2</th>
                                      <th className="td-text-align">WK3</th>
                                      <th className="td-text-align">WK4</th>
                                      <th className="td-text-align">WK5</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {isSubmittedNill
                                      ? // Show 10 blank rows
                                        Array.from({ length: 10 }).map((_, index) => (
                                          <tr key={index}>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                          </tr>
                                        ))
                                      : previewNWDataList?.data?.dirReportsList?.map(
                                          (item, index) => (
                                            <tr>
                                              <td>{index + 1}</td>
                                              <td>{item.socialSecNum}</td>
                                              <td>{item.nameOfDir}</td>
                                              <td className="td-text-align">
                                                ${item.wageS1?.toFixed(2) ?? '0.00'}
                                              </td>
                                              <td className="td-text-align">
                                                ${item.wageS2?.toFixed(2) ?? '0.00'}
                                              </td>
                                              <td className="td-text-align">
                                                ${item.wageS3?.toFixed(2) ?? '0.00'}
                                              </td>
                                              <td className="td-text-align">
                                                ${item.wageS4?.toFixed(2) ?? '0.00'}
                                              </td>
                                              <td className="td-text-align">
                                                ${item.wageS5?.toFixed(2) ?? '0.00'}
                                              </td>
                                              <td className="td-text-align">
                                                ${item.total_wages?.toFixed(2) ?? '0.00'}
                                              </td>
                                              <td className="td-text-align">
                                                ${item.deduct_leavy_wages?.toFixed(2) ?? '0.00'}
                                              </td>
                                              <td>{item.remarks}</td>
                                            </tr>
                                          ),
                                        )}

                                    <tr className="new_remove">
                                      <td className="borders" colSpan={8}>
                                        <div className="man_flex">
                                          <div className="right_border">
                                            a) Total Fees and Directors levy Contribution{' '}
                                          </div>
                                          <div
                                            className="left
                              -border"
                                          >
                                            <div className="borde_down"></div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="td-text-align">
                                        {isSubmittedNill ? (
                                          <>&nbsp;</>
                                        ) : (
                                          <>
                                            $
                                            {Number(
                                              previewNWDataList?.data?.totalFeesDir || 0,
                                            )?.toFixed(2)}
                                          </>
                                        )}
                                      </td>
                                      <td className="td-text-align">
                                        {isSubmittedNill ? (
                                          <>&nbsp;</>
                                        ) : (
                                          <>
                                            $
                                            {Number(
                                              previewNWDataList?.data?.accountantGenreal || 0,
                                            )?.toFixed(2)}
                                          </>
                                        )}
                                      </td>
                                      <td className="text-center" rowSpan={3}>
                                        <span className="text_decoration">
                                          FOR OFFICIAL USE ONLY
                                        </span>
                                        <br />
                                        <br />
                                        I- DATE RECEIVED
                                        <br />
                                        {isPaidStatus && (
                                          <span>
                                            {moment(
                                              previewNWDataList?.data?.receiptDate,
                                              'DD/MM/YYYY HH:mm:ss',
                                            ).format('DD-MMM-YYYY hh:mm:ss A')}
                                          </span>
                                        )}
                                        <br />
                                        <>
                                          <span>
                                            {' '}
                                            II- PAID{' '}
                                            {isPaidStatus ? (
                                              <>
                                                <i className="mdi mdi-check-circle text-success" />{' '}
                                                Yes
                                              </>
                                            ) : (
                                              <>
                                                <i className="fa fa-times-circle text-danger" /> No
                                              </>
                                            )}
                                          </span>
                                          <br />
                                          {isPaidStatus && (
                                            <span>
                                              Receipt No. <br />{' '}
                                              {previewNWDataList?.data?.receiptNumber}
                                            </span>
                                          )}
                                        </>
                                      </td>
                                    </tr>
                                    <tr className="new_remove">
                                      <td className="borders" colSpan={9}>
                                        <div className="man_flex">
                                          <div className="right_border">
                                            b) Levy Penality for the month (if any){' '}
                                          </div>
                                          <div
                                            className="left
                              -border"
                                          >
                                            <div className="borde_down"></div>
                                          </div>
                                        </div>
                                      </td>

                                      <td
                                        className={`td-text-align ${
                                          Number(previewNWDataList?.data?.leavyPanelty) > 0
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
                                              Number(previewNWDataList?.data?.leavyPanelty) || 0
                                            ).toFixed(2)}
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                    <tr className="new_remove">
                                      <td className="borders" colSpan={9}>
                                        <div className="man_flex">
                                          <div className="right_border">
                                            c) Total Accountant General{' '}
                                          </div>
                                          <div
                                            className="left
                              -border"
                                          >
                                            <div className="borde_down"></div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="td-text-align">
                                        {isSubmittedNill ? (
                                          <>&nbsp;</>
                                        ) : (
                                          <>
                                            $
                                            {Number(
                                              previewNWDataList?.data?.accountantGenreal || 0,
                                            )?.toFixed(2)}
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <p>
                                  I/We hereby certify that the particulars stated above are true and
                                  correct to the best of my/our knowledge and belief
                                </p>
                                <div className="container-fluid" style={{ paddingLeft: 0 }}>
                                  <div className="row align-items-end stylenews mb-2">
                                    <div className="col-5">
                                      <div
                                        style={{
                                          justifyContent: 'space-between',
                                          alignItems: 'end',
                                        }}
                                      >
                                        <p className="mb-4 dish_name">
                                          Signature of Employer or Agent <br />
                                          (Please affix office stamp)
                                        </p>
                                        <div
                                          style={{
                                            borderBottom: '1px solid #000',
                                            height: 1,
                                            width: '50%',
                                            alignItems: 'first baseline',
                                          }}
                                        >
                                          <span className="span_name">
                                            {/* {
                                              companyList?.find(
                                                (item) => item.companyId === Number(selectedValue),
                                              )?.contactPerson
                                            } */}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-3">
                                      <div
                                        className="d-flex"
                                        style={{
                                          alignItems: 'end',
                                        }}
                                      >
                                        <p style={{ marginBottom: 0, marginRight: '10px' }}>
                                          Date :
                                        </p>
                                        <div
                                          style={{
                                            borderBottom: '1px solid #000',
                                            height: 1,
                                            width: '70%',
                                            alignItems: 'first baseline',
                                          }}
                                        >
                                          <span className="span_name">
                                            {moment(
                                              previewNWDataList?.data?.date,
                                              'MM/DD/YYYY h:mm:ss A',
                                            ).format('DD-MMM-YYYY')}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    {/* <div
                                                                                  className="col-3 mb-4 text-end"
                                                                                  style={{ position: 'relative', top: '25px' }}
                                                                                >
                                                                                  {isPaidStatus && (
                                                                                    <>
                                                                                      <div
                                                                                        className="d-flex"
                                                                                        style={{
                                                                                          alignItems: 'end',
                                                                                        }}
                                                                                      >
                                                                                        <p
                                                                                          style={{
                                                                                            marginBottom: 0,
                                                                                            marginRight: '10px',
                                                                                          }}
                                                                                        >
                                                                                          Reciept No. :
                                                                                        </p>
                                                                                        <div
                                                                                          style={{
                                                                                            borderBottom: '1px solid #000',
                                                                                            height: 1,
                                                                                            width: '60%',
                                                                                            alignItems: 'first baseline',
                                                                                          }}
                                                                                        >
                                                                                          <span className="span_name">
                                                                                            {previewNWDataList?.data?.receiptNumber}
                                                                                          </span>
                                                                                        </div>
                                                                                      </div>
                                                                                      <div
                                                                                        className="d-flex"
                                                                                        style={{
                                                                                          alignItems: 'end',
                                                                                        }}
                                                                                      >
                                                                                        <p
                                                                                          style={{
                                                                                            marginBottom: 0,
                                                                                            marginRight: '20px',
                                                                                          }}
                                                                                        >
                                                                                          Paid On :
                                                                                        </p>
                                                                                        <div
                                                                                          style={{
                                                                                            borderBottom: '1px solid #000',
                                                                                            height: 1,
                                                                                            width: '60%',
                                                                                            alignItems: 'first baseline',
                                                                                          }}
                                                                                        >
                                                                                          <span className="span_name">
                                                                                            {moment(
                                                                                              previewNWDataList?.data?.receiptDate,
                                                                                              'MM/DD/YYYY h:mm:ss A',
                                                                                            ).format('DD-MMM-YYYY')}
                                                                                          </span>
                                                                                        </div>
                                                                                      </div>
                                                                                    </>
                                                                                  )}
                                                                                </div> */}
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
              {/* end main content*/}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" className="h-45 btn btn-light" onClick={handleClose2}>
              <i className="fas fa-times"></i> Close
            </Button>
            <Button color="success" onClick={handlePrint}>
              <i className="dripicons-print" /> Print
            </Button>
            {canPrintNWDAdminReport ? (
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
        message="Do you really want to delete this non working director?"
        loadingDelete={loadingDelete}
      />
      <AdminCustomize
        isOpen={modalOpen}
        toggle={toggleModal}
        title="Are you sure you want to change the status of the Non working director?"
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
export default AdminNonWorkingDirector;
