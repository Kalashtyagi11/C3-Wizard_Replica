import { Helmet } from 'react-helmet';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import * as Icon from 'react-feather';
import Select from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';

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
import moment from 'moment';
import { format, parse } from 'date-fns';
import {
  clearContributionCount,
  getContribution,
  previewAllData,
  deleteContibutionAdmin,
  StatusChange,
  getStatus,
} from '../../../store/apps/dashboard/DashboardSlice';
import DashboardService from '../../../service/dashboard/Dashboard';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import user1 from '../../../assets/images/users/user4.jpg';
import formatDate, { formatDateDDMMMYYYY } from '../../../helpers/dateFormater';
import PeriodSelectorWithState from './components/PeriodSelectorWithState';
import Paid from '../../../assets/images/users/Paid.png';
import ReportLogo from '../../../assets/images/users/Reportlogo.jpg';
import Loader from '../../../layouts/loader/Loader';
import DeleteModal from './components/AdminDelete';
import NillImage from '../../../assets/images/users/Nill.png';
import AdminCustomize from '../component/AdminCustomizes';
import NotesModal from '../component/NotesModal';
import './Switch..scss';

const AdminC3Contribution = () => {
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
  const [loadingHeaderId, setLoadingHeaderId] = useState(null);
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [show, setShow] = useState(false);
  const userId = localStorage.getItem('userID');
  const userID = localStorage.getItem('userID');
  const [showRecipt, setShowRecipt] = useState(false);
  const [data, setData] = useState(null);
  const [isPaidStatus, setIsPaidStatus] = useState(null);
  const [headerId, setHeaderId] = useState(null);
  const [periodYear, setPeriodYear] = useState(null);
  const [periodMonth, setPeriodMonth] = useState(null);
  const [companyList, setCompanyList] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const navigate = useNavigate();
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'C3 CONTRIBUTION');
  const canPreviewAdminC3Report = employerPermission?.is_preview;
  const canPrintAdminReport = employerPermission?.is_Print;
  const canViewAdminReport = employerPermission?.viewPermission;
  const CompanyIdSelected = localStorage.getItem('CompanyIdSelected');
  const [params, setParams] = useState({
    month: null,
    year: null,
    companyId: '',
    c3HeaderId: null,
  });
  const getDate = new Date();
  const [Year, setYear] = useState(getDate.getFullYear().toString());
  const [FromMonth, setFromMonth] = useState('');
  const [ToMonth, setToMonth] = useState('');
  const [reportLoad, setreportLoad] = useState(false);
  const [activeHeaderId, setactiveHeaderId] = useState('');
  const [selectedValue, setSelectedValue] = useState(CompanyIdSelected || '');

  const { message, type } = useSelector((state) => state.messageReducer);
  const { ContributionCount, StatusData, loading } = useSelector((state) => state.dashboardSlice);
  const { previewData } = useSelector((state) => state.dashboardSlice);
  const dispatch = useDispatch();

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

  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    if (canViewAdminReport === false) {
      navigate('/login');
    }
  }, [canViewAdminReport, navigate]);

  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);

  const getFilteredMonths = (fromMonth) => {
    return monthList.filter((month) => month.value >= fromMonth);
  };

  const handleClose = () => setShow(false);

  const handleShow = (id, years, months, ispaid, isSubmitted) => {
    setreportLoad(true);
    setactiveHeaderId(id);
    setHeaderId(id);
    setPeriodYear(years);
    setPeriodMonth(months);
    setIsPaidStatus(ispaid);
    setIsSubmittedNill(isSubmitted);

    // Update params dynamically before dispatch
    const updatedParams = {
      monthName: months,
      year: years,
      companyId: selectedValue,
      c3HeaderId: id,
    };

    setParams(updatedParams);

    dispatch(previewAllData(updatedParams))
      .unwrap()
      .then((response) => {
        setShow(true);
        setreportLoad(false);
      })
      .catch((e) => {
        setreportLoad(false);
      });
    setShow(true);
  };

  // const handleChange = (event) => {
  //   setSelectedValue(event.target.value);
  // };
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

  const getAllCompaniesHandler = async () => {
    setLoadingDropdown(true);
    try {
      const res = await UserManagementServices.getAllCompanyData();
      setCompanyList(res.data.data);
    } catch (error) {
      console.error('Something went wrong:', error);
    } finally {
      setLoadingDropdown(false);
    }
  };

  const handlePayClick = (headerID) => {
    navigate(`/admin/C3/offlineReport/${headerID}`);
  };

  // -----new--added-by-Anjani-23-04-25
  const [fromPeriod, setFromPeriod] = useState(null);
  const [endPeriod, setEndPeriod] = useState(null);
  const [toPeriod, setToPeriod] = useState(null);

  useEffect(() => {
    const selectedYear = fromPeriod ? moment(fromPeriod).format('YYYY') : new Date().getFullYear();
    const selectedEndYear = endPeriod ? moment(endPeriod).format('YYYY') : new Date().getFullYear();

    if (selectedValue) {
      const fromMonthFormatted = fromPeriod ? moment(fromPeriod).format('MM') : '01';
      const toMonthFormatted = toPeriod ? moment(toPeriod).format('MM') : '12';

      dispatch(
        getContribution({
          companyId: selectedValue,
          ResultArea: 'R',
          FromMonth: fromMonthFormatted,
          ToMonth: toMonthFormatted,
          Year: selectedYear,
          endYear: selectedEndYear,
        }),
      );
    }

    return () => {
      dispatch(clearContributionCount());
      localStorage.removeItem('CompanyIdSelected');
    };
  }, [selectedValue]);

  const handleSearch = () => {
    if (!selectedValue) {
      toast.error('Please select a company. ');
      return;
    }

    if (fromPeriod && toPeriod && toPeriod < fromPeriod) {
      toast.error('To Period cannot be smaller than From Period!');
      return; // 🔥 STOP execution if validation fails
    }

    const fromMonthFormatted = fromPeriod ? moment(fromPeriod).format('MM') : 0;
    const toMonthFormatted = toPeriod ? moment(toPeriod).format('MM') : 0;
    const selectedYear = fromPeriod ? moment(fromPeriod).format('YYYY') : 0;
    const selectedEndYear = endPeriod ? moment(endPeriod).format('YYYY') : 0;

    setLoadingReport(true);

    dispatch(
      getContribution({
        companyId: selectedValue, // or use `companyId` if different
        ResultArea: 'R',
        FromMonth: fromMonthFormatted,
        ToMonth: toMonthFormatted,
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

  useEffect(() => {
    getAllCompaniesHandler();
  }, []);

  const printRef = useRef();

  const { toPDF, targetRef } = usePDF({
    filename: 'SocialSecurityReport.pdf',
    page: { margin: Margin.SMALL, orientation: 'landscape' },
  });

  const { toPDF: toPDF1, targetRef: targetRef1 } = usePDF({ filename: 'TransactionReceipt.pdf' });

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
      console.error('Something went wrong:', error);
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

  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const handleDeleteClick = (deleteId, delUserId = userId, delType = 'comp') => {
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
        dispatch(
          getContribution({
            companyId: selectedValue,
            ResultArea: 'R',
            FromMonth: fromPeriod ? moment(fromPeriod).format('MM') : '01',
            ToMonth: toPeriod ? moment(toPeriod).format('MM') : '12',
            Year: fromPeriod ? moment(fromPeriod).format('YYYY') : new Date().getFullYear(),
            endYear: endPeriod ? moment(endPeriod).format('YYYY') : new Date().getFullYear(),
          }),
        );
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
        dispatch(
          getContribution({
            companyId: selectedValue,
            ResultArea: 'R',
            FromMonth: fromPeriod ? moment(fromPeriod).format('MM') : '01',
            ToMonth: toPeriod ? moment(toPeriod).format('MM') : '12',
            Year: fromPeriod ? moment(fromPeriod).format('YYYY') : new Date().getFullYear(),
            endYear: endPeriod ? moment(endPeriod).format('YYYY') : new Date().getFullYear(),
          }),
        );
      }

      setModalOpen(false);
    } catch (error) {
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
        <title>C3 Contribution - C3Wizard</title>
      </Helmet>

      <div id="layout-wrapper">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
          <ul className="d-flex align-items-center mt-3 gap-2 list-unstyled">
            <li className="fw-medium">
              <Link to="/admin-dashboard" className="d-flex align-items-center gap-1 text-muted">
                <i className="ti-home" /> Admin Dashboard{' '}
              </Link>
            </li>
            <li>-</li>

            <li className="fw-medium">C3 Contribution </li>
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
                            <Label className="mb-0">Select Employer</Label>

                            <div className="select-wrapper">
                              <Select
                                options={options}
                                value={options.find((opt) => opt.value === selectedValue) || null}
                                onChange={handleChange}
                                placeholder="Search Employer Name or Reg Number"
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
                        <div className="table-responsive ">
                          <table className="table table-hover mb-0  white-space  ">
                            <thead>
                              <tr className="border-b">
                                <th style={{ minWidth: '90px' }}>Month</th>
                                <th>Year</th>
                                <th className="td-text-align1"> Wages</th>
                                <th className="td-text-align1">Social Security</th>
                                <th className="td-text-align1">Levy</th>
                                <th className="td-text-align1">Fines and Penalties</th>
                                <th className="td-text-align1">Severance</th>

                                <th className="td-text-align1">Total</th>
                                <th className="td-pl-2">Creation Date</th>
                                <th>Schedule</th>
                                <th>Is Nil</th>
                                <th>Notes</th>
                                <th>Is Submitted</th>
                                <th>Preview</th>
                                <th>Delete</th>
                                <th style={{ minWidth: '140px' }}>Payment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ContributionCount?.dashboard_list &&
                              ContributionCount?.dashboard_list?.filter(
                                (item) => String(item.is_submitted).toLowerCase() === 'true',
                              )?.length > 0 ? (
                                ContributionCount?.dashboard_list
                                  ?.filter((item) => item.is_submitted)
                                  ?.map((item) => (
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
                                        {item.period_Month}
                                      </td>
                                      <td>{item?.period_year}</td>
                                      <td className="td-text-align1">
                                        ${item.totaL_WAGES?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align1">
                                        ${item.totalsscontributions?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align1">
                                        {item.isImportFromBEMA
                                          ? `$${(item?.totallevyeeemployee || 0).toFixed(2)}`
                                          : `$${(
                                              (item?.totallevyeeemployee || 0) +
                                              (item?.totallevyeeemployer || 0)
                                            ).toFixed(2)}`}
                                      </td>

                                      <td className="td-text-align1">
                                        ${item.totalSSBpenanlity?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align1">
                                        ${item.totalservayance?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align1">
                                        ${Number(item?.payAmt ?? 0).toFixed(2)}
                                      </td>
                                      <td className="td-pl-2">
                                        {item?.insert_Datetimeinfo
                                          ? formatDateDDMMMYYYY(item?.insert_Datetimeinfo)
                                          : 'NA'}
                                      </td>
                                      <td>{item?.schedule_NO ?? 'NA'}</td>
                                      <td>
                                        {item.isNilReturn === true ? (
                                          <i className="fa fa-check-circle text-success" />
                                        ) : (
                                          <i className="fa fa-times-circle text-danger" />
                                        )}{' '}
                                      </td>
                                      <td style={{ maxWidth: '130px', minWidth: '80px' }}>
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
                                        {canPreviewAdminC3Report ? (
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#myModal3"
                                            className="badge bg-soft-primary text-primary f-18"
                                            data-bs-placement="top"
                                            title="Preview"
                                            onClick={() =>
                                              handleShow(
                                                item.headerID,
                                                item.period_year,
                                                item.period_Month,
                                                item.ispaid,
                                                item.isNilReturn,
                                              )
                                            }
                                          >
                                            {reportLoad && activeHeaderId === item.headerID ? (
                                              <>
                                                <Spinner color="dark" size="sm">
                                                  {' '}
                                                  Loading...
                                                </Spinner>{' '}
                                              </>
                                            ) : (
                                              <>
                                                <i className="fas fa-eye" />
                                              </>
                                            )}
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
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                            id={`downloadIcon-${item.headerID}`}
                                            onClick={() =>
                                              DownloadPrint(item.headerID, item.transactionID)
                                            }
                                          >
                                            Paid &nbsp;
                                            {loadingHeaderId === item.headerID ? (
                                              <Spinner size="sm" />
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
                                                  target={`downloadIcon-${item.headerID}`}
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

        <Modal isOpen={show} size="xl" onHide={handleClose} style={{ width: '1250px !important' }}>
          <ModalHeader toggle={handleClose}>
            <h2>Report</h2>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-xl-12">
                <div className="card">
                  {/* <div className="card-header py-3 bg_ligh">
       
               <div className="row align-items-center d-flex">
       
                 <div className="col-xl-4 col-6 mb-2 mb-lg-0">
                   <h4 className="header-title mb-0 text-success">
                     <i className="far fa-user text-success pe-2" />
                     Add C3 Generation
                   </h4>
                 </div>
               </div>
             </div> */}
                  <div ref={targetRef}>
                    <div className="card-body add_custom" style={{ position: 'relative' }}>
                      <h3 style={{ lineHeight: '131%', textAlign: 'center' }}>
                        THE ST.CHRISTOPHER AND NEVIS - SOCIAL SECURITY BOARD
                        <br /> STATEMENT OF WAGES AND CONTRIBUTIONS
                      </h3>
                      <h5 style={{ textAlign: 'center' }} className="mb-3">
                        Social Security Act, 1977, Housing and Social Development Levy Act, 1997,
                        and the Protection of Employment Act, 1986
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
                              <th className="label-cell fix-widthzero" colSpan="0">
                                Name of Employer
                              </th>
                              <td className="value-cell" colSpan="7">
                                {isSubmittedNill ? (
                                  <> {previewData?.data?.company_name}</>
                                ) : (
                                  <> {previewData?.data?.companyName}</>
                                )}
                              </td>

                              <th className="label-cell fix-width" colSpan="1">
                                Trade Name
                              </th>
                              <td className="value-cell" colSpan="6">
                                {isSubmittedNill ? (
                                  <> {previewData?.data?.trade_name}</>
                                ) : (
                                  <> {previewData?.data?.tradeName}</>
                                )}
                              </td>

                              <th className="label-cell text-end" colSpan="2">
                                Employer&#39;s Registration No.
                              </th>
                              <td className="value-cell-border" colSpan="2">
                                {isSubmittedNill ? (
                                  <> {previewData?.data?.company_reg_no}</>
                                ) : (
                                  <> {previewData?.data?.companyRegNo}</>
                                )}
                              </td>
                            </tr>

                            {/* Row 2: Address & Employees */}
                            <tr>
                              <td
                                colSpan="16"
                                style={{ height: '10px', border: 'none', padding: 0 }}
                              ></td>
                            </tr>
                            <tr>
                              <th className="label-cell" colSpan="5">
                                Address{' '}
                                <span className="p">
                                  (Location &amp; Box No. If address changed)
                                </span>
                              </th>
                              <td className="value-cell" colSpan="10">
                                {isSubmittedNill ? (
                                  <> {previewData?.data?.company_address}</>
                                ) : (
                                  <> {previewData?.data?.companyAddress}</>
                                )}
                              </td>

                              <th className="label-cell text-end" colSpan="2">
                                Employees(s)
                              </th>
                              <td className="value-cell-border" colSpan="2">
                                {isSubmittedNill ? (
                                  <>&nbsp;</>
                                ) : (
                                  <>{previewData?.data?.listc3ReportViewModel?.length}</>
                                )}
                              </td>
                            </tr>

                            {/* Row 3: Statement Note */}
                            <tr>
                              <td
                                colSpan="16"
                                style={{ height: '10px', border: 'none', padding: 0 }}
                              ></td>
                            </tr>
                            <tr>
                              <th className="label-cell" colSpan="14">
                                <span>To: Director of Social Security,</span>
                                <br />
                                <span style={{ marginLeft: '40px' }}>
                                  With this statement is a cheque and/or cash in respect of the Acts
                                  mentioned above for the month of:
                                </span>
                              </th>
                              <td className="value-cell cell-center" colSpan="1">
                                {isSubmittedNill ? (
                                  <> {previewData?.data?.month_year}</>
                                ) : (
                                  <> {previewData?.data?.currentMonth}</>
                                )}
                              </td>
                            </tr>

                            {/* Row 4: Payment Breakdown */}
                            <tr>
                              <td
                                colSpan="16"
                                style={{ height: '10px', border: 'none', padding: 0 }}
                              ></td>
                            </tr>
                            <tr>
                              <th className="label-cell" colSpan="3">
                                (1) Director, Social Security Board
                              </th>
                              <td className="value-cell cell-center" colSpan="2">
                                {isSubmittedNill ? (
                                  <>&nbsp;</>
                                ) : (
                                  <>${previewData?.data?.remitedDueMonth?.toFixed(2) ?? '0.00'}</>
                                )}
                              </td>
                              <th className="label-cell " colSpan="1"></th>
                              <th className="label-cell " colSpan="1"></th>

                              <th className="label-cell " colSpan="3">
                                (2) Accountant General
                              </th>
                              <td className="value-cell cell-center" colSpan="2">
                                {isSubmittedNill ? (
                                  <>&nbsp;</>
                                ) : (
                                  <>
                                    ${previewData?.data?.accountGeneralTotal?.toFixed(2) ?? '0.00'}
                                  </>
                                )}
                              </td>

                              <th className="label-cell " colSpan="1"></th>
                              <th className="label-cell " colSpan="2"></th>

                              <th className="label-cell " colSpan="1">
                                Total
                              </th>
                              <td className="value-cell cell-center" colSpan="1">
                                {isSubmittedNill ? (
                                  <>&nbsp;</>
                                ) : (
                                  <>${previewData?.data?.total?.toFixed(2) ?? '0.00'}</>
                                )}
                              </td>
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
                              <th style={{ minWidth: '120px' }} rowSpan={2}>
                                (3) <br />
                                Name of Employee
                                <br /> (Surname First)
                              </th>
                              <th style={{ maxWidth: '190px' }} rowSpan={2}>
                                (4) <br />
                                Termination or Commencement Date
                              </th>
                              <th style={{ maxWidth: '85px' }} rowSpan={2}>
                                (5) <br />
                                Pay Period/ Schedule W, E2W, M, 2M
                              </th>
                              <th style={{ maxWidth: '150px' }} colSpan={5}>
                                (6a) <br />
                                Put X in the Week(s) Worked or Week(s) Holiday/Other Pay was made
                              </th>
                              <th className="td-text-align" colSpan={7}>
                                (6b) <br />
                                In accordance with the pay Schedule indicated in Column 5, record
                                Wages/Salaries in respect of the weeks worked or in the case of
                                Holiday pay/Other Pay, record in the weeks for which the payment
                                applies
                              </th>
                              <th className="td-text-align" rowSpan={2}>
                                (7) <br />
                                Total Wages/Salaries Paid for the month
                              </th>
                              <th className="td-text-align" rowSpan={2}>
                                (8) <br />
                                Deduct levy from Wages of employee. See note 9 for exemption
                              </th>
                              <th className="td-text-align" rowSpan={2}>
                                (9) <br />
                                Total So. Sec. 11% or 1% of Wages/Salaries of each employee. See
                                note 8
                              </th>
                              <th style={{ minWidth: '150px' }} rowSpan={2}>
                                (10) <br />
                                Remarks
                              </th>
                            </tr>
                            <tr>
                              <th className="td-text-align">1</th>

                              <th className="td-text-align">2</th>
                              <th className="td-text-align">3</th>
                              <th className="td-text-align">4</th>
                              <th className="td-text-align">5</th>
                              <th className="td-text-align">WK1</th>
                              <th className="td-text-align">WK2</th>
                              <th className="td-text-align">WK3</th>
                              <th className="td-text-align">WK4</th>
                              <th className="td-text-align">WK5</th>
                              <th className="td-text-align">HPay</th>
                              <th className="td-text-align">Bonus</th>
                            </tr>
                          </thead>
                          <tbody>
                            {isSubmittedNill
                              ? // Show 10 blank rows
                                Array.from({ length: 10 }).map((_, index) => (
                                  <tr key={index}>
                                    <td className="td-text-align">{index + 1}</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>

                                    <td>&nbsp;</td>

                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td className="td-text-align">&nbsp;</td>
                                    <td className="td-text-align">&nbsp;</td>
                                    <td className="td-text-align">&nbsp;</td>
                                    <td className="td-text-align">&nbsp;</td>
                                    <td className="td-text-align">&nbsp;</td>
                                    <td className="td-text-align">&nbsp;</td>
                                    <td className="td-text-align">&nbsp;</td>
                                    <td className="td-text-align">&nbsp;</td>
                                    <td className="td-text-align">&nbsp;</td>
                                    <td className="td-text-align">&nbsp;</td>

                                    <td colSpan={2}>&nbsp;</td>
                                  </tr>
                                ))
                              : previewData?.data?.listc3ReportViewModel?.map((row, index) => (
                                  <tr key={index}>
                                    <td className="td-text-align">{index + 1}</td>
                                    <td>{row.socialSecurityNo}</td>
                                    <td>{row.empName}</td>
                                    <td>{row.appintDate || ''}</td>
                                    <td>{row.payPeriod}</td>
                                    <td className="td-text-align">{row.firstWeekOfMonth || ''}</td>
                                    <td className="td-text-align">{row.secondWeekOfMonth || ''}</td>
                                    <td className="td-text-align">{row.thirdWeekOfMonth || ''}</td>
                                    <td className="td-text-align">{row.fourWeekOfMonth || ''}</td>
                                    <td className="td-text-align">{row.fiveWeekOfMonth || ''}</td>
                                    <td className="td-text-align">
                                      ${row.firstWeekOfSalary?.toFixed(2) ?? 0.0}
                                    </td>
                                    <td className="td-text-align">
                                      ${row.secondWeekOfSalary?.toFixed(2) ?? 0.0}
                                    </td>
                                    <td className="td-text-align">
                                      ${row.thirdWeekOfSalary?.toFixed(2) ?? 0.0}
                                    </td>
                                    <td className="td-text-align">
                                      ${row.fourWeekOfSalary?.toFixed(2) ?? 0.0}
                                    </td>
                                    <td className="td-text-align">
                                      ${row.fiveWeekOfSalary?.toFixed(2) ?? 0.0}
                                    </td>
                                    <td className="td-text-align">
                                      ${row.column1?.toFixed(2) ?? 0.0}
                                    </td>
                                    <td className="td-text-align">
                                      ${row.column2?.toFixed(2) ?? 0.0}
                                    </td>
                                    <td className="td-text-align">
                                      ${row.totalWages?.toFixed(2) ?? 0.0}
                                    </td>
                                    <td className="td-text-align">
                                      ${row.deductLeavyWages?.toFixed(2) ?? 0.0}
                                    </td>
                                    <td className="td-text-align">
                                      ${row.totalSocSec?.toFixed(2) ?? 0.0}
                                    </td>
                                    <td>{row.remarks || ''}</td>
                                  </tr>
                                ))}

                            <tr className="new_remove">
                              <td className="borders" colSpan={17}>
                                <div className="man_flex">
                                  <div className="right_border">
                                    a) Total wages and employee levy contribution
                                  </div>
                                  <div
                                    className="left
                                     -border"
                                  >
                                    <div className="borde_down"></div>
                                  </div>
                                </div>
                              </td>
                              <td className="td-text-align" colSpan={1}>
                                {isSubmittedNill ? (
                                  <>&nbsp;</>
                                ) : (
                                  <>${previewData?.data?.totalWages?.toFixed(2) ?? 0.0}</>
                                )}
                              </td>
                              <td className="td-text-align">
                                {isSubmittedNill ? (
                                  <>&nbsp;</>
                                ) : (
                                  <>${previewData?.data?.totalDeductLeavy?.toFixed(2) ?? 0.0}</>
                                )}
                              </td>
                              <td colSpan={1} rowSpan={6}></td>
                              {/* <td rowSpan={9} className="text-center">
                                <span className="text_decoration">FOR OFFICIAL USE ONLY</span>
                                <br />
                                <br />
                                1- DATE RECEIVED
                                <br />
                                <br />
                                <span className="custom_border">II- PAID YES NO</span>
                              </td> */}
                              <td rowSpan={9} className="text-center">
                                <span className="text_decoration">FOR OFFICIAL USE ONLY</span>
                                <br />
                                <br />
                                1- DATE RECEIVED <br />
                                {isPaidStatus && (
                                  <span>
                                    {moment(
                                      previewData?.data?.receiptDate,
                                      'DD/MM/YYYY HH:mm:ss',
                                    ).format('DD-MMM-YYYY hh:mm:ss A')}
                                  </span>
                                )}
                                <br />
                                <span className="custom_border">
                                  II- PAID{' '}
                                  {isPaidStatus ? (
                                    <>
                                      <i className="mdi mdi-check-circle text-success" /> Yes
                                    </>
                                  ) : (
                                    <>
                                      <i className="fa fa-times-circle text-danger" /> No
                                    </>
                                  )}
                                  <br />
                                  {isPaidStatus && (
                                    <span>
                                      Receipt No. <br /> {previewData?.data?.receiptNumber}
                                    </span>
                                  )}
                                </span>
                              </td>
                            </tr>
                            <tr className="new_remove">
                              <td className="borders" colSpan={18}>
                                <div className="man_flex">
                                  <div className="right_border">
                                    b) Employer&#39;s 3% of Wages fo levy Contribution
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
                                    ${previewData?.data?.wagesLevyContribution?.toFixed(2) ?? 0.0}
                                  </>
                                )}
                              </td>
                              {/* <td colSpan={1}></td> */}
                            </tr>
                            <tr className="new_remove">
                              <td className="borders" colSpan={18}>
                                <div className="man_flex">
                                  <div className="right_border">
                                    c) Employer&#39;s 1% of Wages for Severance Payments
                                    Contribution
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
                                  <>${previewData?.data?.servayance?.toFixed(2) ?? 0.0}</>
                                )}
                              </td>
                              {/* <td colSpan={1}></td> */}
                            </tr>
                            <tr className="new_remove">
                              <td className="borders" colSpan={18}>
                                <div className="man_flex">
                                  <div className="right_border">
                                    d) Levy Penality for the month (if any)
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
                                <span
                                  className={
                                    previewData?.data?.totalLevyEEPenalty > 0
                                      ? 'text-danger'
                                      : 'text-black'
                                  }
                                >
                                  {isSubmittedNill ? (
                                    <>&nbsp;</>
                                  ) : (
                                    <>${(previewData?.data?.totalLevyEEPenalty ?? 0).toFixed(2)}</>
                                  )}
                                </span>
                              </td>
                              {/* <td colSpan={1}></td> */}
                            </tr>
                            <tr className="new_remove">
                              <td className="borders" colSpan={18}>
                                <div className="man_flex">
                                  <div className="right_border">
                                    e) Severance Penality for month (if any)
                                  </div>
                                  <div
                                    className="left
                                     -border"
                                  >
                                    <div className="borde_down"></div>
                                  </div>
                                </div>
                              </td>
                              <td className="td-text-align ">
                                <span
                                  className={
                                    previewData?.data?.servayancePePenalty > 0
                                      ? 'text-danger'
                                      : 'text-black'
                                  }
                                >
                                  {isSubmittedNill ? (
                                    <>&nbsp;</>
                                  ) : (
                                    <>${(previewData?.data?.servayancePePenalty ?? 0).toFixed(2)}</>
                                  )}
                                </span>
                              </td>
                              {/* <td colSpan={1}></td> */}
                            </tr>
                            <tr className="new_remove">
                              <td className="borders" colSpan={18}>
                                <div className="man_flex">
                                  <div className="right_border">f) Total Accountant General</div>
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
                                  <>${previewData?.data?.accountGeneralTotal?.toFixed(2) ?? 0.0}</>
                                )}
                              </td>
                              {/* <td colSpan={1}></td> */}
                            </tr>
                            <tr className="new_remove">
                              <td className="borders" colSpan={19}>
                                <div className="man_flex">
                                  <div className="right_border">
                                    g) Social Security Contribution due for the month
                                  </div>
                                  <div
                                    className="left
                                     -border"
                                  >
                                    <div className="borde_down"></div>
                                  </div>
                                </div>
                              </td>
                              <td className="td-text-align" colSpan={1}>
                                {isSubmittedNill ? (
                                  <>&nbsp;</>
                                ) : (
                                  <>${previewData?.data?.totalSocSec?.toFixed(2) ?? 0.0}</>
                                )}
                              </td>
                              {/* <td rowSpan={4} colSpan={2} className="text-center">
                                     II- PAID YES NO
                                   </td> */}
                            </tr>
                            <tr className="new_remove">
                              <td className="borders" colSpan={19}>
                                <div className="man_flex">
                                  <div className="right_border">
                                    h) Fines due for the month (if any)
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
                                  previewData?.data?.finedueMonth > 0 ? 'text-danger' : 'text-black'
                                }`}
                                colSpan={1}
                              >
                                {isSubmittedNill ? (
                                  <>&nbsp;</>
                                ) : (
                                  <>${(previewData?.data?.finedueMonth ?? 0).toFixed(2)}</>
                                )}
                              </td>
                            </tr>
                            <tr className="new_remove">
                              <td className="borders" colSpan={19}>
                                <div className="man_flex">
                                  <div className="right_border">
                                    i) Total Social Security Remittance due for the month
                                  </div>
                                  <div
                                    className="left
                                     -border"
                                  >
                                    <div className="borde_down"></div>
                                  </div>
                                </div>
                              </td>
                              <td className="td-text-align" colSpan={1}>
                                {isSubmittedNill ? (
                                  <>&nbsp;</>
                                ) : (
                                  <>${previewData?.data?.remitedDueMonth?.toFixed(2) ?? '0.00'}</>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p className="stylenew">
                          I/We hereby certify that the particulars stated above are true and correct
                          to the best of my/our knowledge and belief.
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
                                    {' '}
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
                                <p style={{ marginBottom: 0, marginRight: '10px' }}>Date :</p>
                                <div
                                  style={{
                                    borderBottom: '1px solid #000',
                                    height: 1,
                                    width: '70%',
                                    alignItems: 'first baseline',
                                  }}
                                >
                                  <span className="span_name">
                                    {moment(previewData?.data?.date, 'MM/DD/YYYY h:mm:ss A').format(
                                      'DD-MMM-YYYY',
                                    )}
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
                                        {previewData?.data?.receiptNumber}
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
                                          previewData?.data?.receiptDate,
                                          'MM/DD/YYYY h:mm:ss A',
                                        ).format('DD-MMM-YYYY')}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div> */}
                            <div
                              className="col-2 mb-4 text-end"
                              style={{ position: 'relative', top: '25px' }}
                            >
                              <div>{/* <p>SSB C3Wizard</p> */}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className="h-45 btn btn-light" variant="secondary" onClick={handleClose}>
              <i className="fas fa-times"></i> Close
            </Button>
            <Button color="success" onClick={handlePrint}>
              <i className="dripicons-print" /> Print
            </Button>
            {canPreviewAdminC3Report ? (
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
        message="Do you really want to delete this C3 Contribution?"
        loadingDelete={loadingDelete}
      />

      <AdminCustomize
        isOpen={modalOpen}
        toggle={toggleModal}
        title="Are you sure you want to change the status of the C3 Contribution?"
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
export default AdminC3Contribution;
