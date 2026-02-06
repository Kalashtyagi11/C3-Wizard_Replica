import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Spinner,
  Card,
  CardBody,
  Table,
  Label,
  UncontrolledTooltip,
} from 'reactstrap';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import { Helmet } from 'react-helmet';
import * as Icon from 'react-feather';
import {
  getDashboardList,
  previewNWData,
} from '../../../../store/apps/selfEmployee/dashboard/SelfDashboardSlice';
import {
  ExportCThree,
  EXportSubmit,
} from '../../../../store/apps/selfEmployee/selfEmployeeContribution/SelfEmployeeContributionSlice';
import { ImportBima } from '../../../../store/apps/selfEmployee/reports/ReportsSlice';
import Loader from '../../../../layouts/loader/Loader';
import { clearMessage, setMessage } from '../../../../store/apps/message/MessageSlice';
import DashboardService from '../../../../service/dashboard/Dashboard';
import Paid from '../../../../assets/images/users/Paid.png';
import user1 from '../../../../assets/images/users/user4.jpg';
import ReportLogo from '../../../../assets/images/users/Reportlogo.jpg';
import SelfC3DownloadLink from '../../component/SelfReportLInk';
import PaymentForm from '../../Payments/paymentCapture';

const Dashboard = () => {
  const [isLoadingDown, setIsLoadingDown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const hasImportedRef = useRef(false);
  const isImportingRef = useRef(false);
  const [loadingHeaderId, setLoadingHeaderId] = useState(null);
  const companyId = localStorage.getItem('companyId');
  const regNumber = localStorage.getItem('reG_NUMBER');
  const userId = localStorage.getItem('userID');
  const userName = localStorage.getItem('userId');
  const UserID = localStorage.getItem('userID');
  // const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const userPassword = localStorage.getItem('userPassword');
  const dispatch = useDispatch();
  const CompanyId = localStorage.getItem('companyId');
  const { message, type } = useSelector((state) => state.messageReducer);
  const {
    DashboardData,
    previewNWDataList,
    loading: reduxLoading,
  } = useSelector((state) => state.selfDashboardSlice);
  const isLoading = isLoadingData || reduxLoading;
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [isModalOpens, setIsModalOpens] = useState(false);
  const [exportItems, setExportItems] = useState(null);
  const toggleModal1 = () => setIsModalOpens(!isModalOpens);
  const [isModalOpenExport, setIsModalOpenExport] = useState(false);
  const [exportItem, setExportItem] = useState(null);
  const toggleModalExport = () => setIsModalOpenExport(!isModalOpenExport);
  const UserName = localStorage.getItem('userName');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaidStatus, setIsPaidStatus] = useState(null);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));

  const employerPermission = Array.isArray(savedRoles)
    ? savedRoles.find((role) => role.description === 'DASHBOARD')
    : null;

  const canEditDashboard = employerPermission?.updatePermission;
  const canPaySelfEmployee1 = employerPermission?.is_pay;
  const SelfemployerPermission = Array.isArray(savedRoles)
    ? savedRoles.find((role) => role.description === 'SELF EMPLOYEE CONTRIBUTION')
    : null;
  const canEditSElfEmployee = SelfemployerPermission?.updatePermission;
  const canPreviewSelfEmployee = SelfemployerPermission?.is_preview;
  const canPrintSelfEmployee = SelfemployerPermission?.is_Print;
  const canSubmittedSelfEmployee = SelfemployerPermission?.is_Submitted;
  const canPaySelfEmployee = SelfemployerPermission?.is_pay;

  const navigate = useNavigate();

  const [showRecipt, setShowRecipt] = useState(false);
  const [data, setData] = useState(null);
  const { toPDF: toPDF1, targetRef: targetRef1 } = usePDF({ filename: 'TransactionReceipt.pdf' });
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentPayload, setPaymentPayload] = useState(null);

  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);

  useEffect(() => {
    if (CompanyId) {
      dispatch(getDashboardList({ CompanyId }));
    }
  }, []);

  const handleShow2 = (headerId, year, monthNo = 1, ispaid) => {
    dispatch(previewNWData({ headerId, year, monthNo }));
    setShow2(true);
    setIsPaidStatus(ispaid);
  };

  const formatPayC3Period = (monthNo, year) => {
    if (!monthNo || !year) return null;

    const months = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];

    return `${months[monthNo - 1]}/${year}`;
  };

  const isSelfEmployeeSubmitted = (headerId, ssnemp, monthNo, year) => {
    setExportItems({
      SSNofEmp: ssnemp, // Adjusted to match API parameter names
      Headerid: headerId,
      period_Month: monthNo, // Keep as API expects
      Period_year: year, // Keep as API expects
      companyId,
      UserLoginID: userName,
      User_Password: userPassword,
      userId,
      // isTrue,
    });

    setIsModalOpens(true); // Open the modal
  };

  const isSubmitC3 = () => {
    if (!exportItems) return;

    setLoadingSubmit(true);
    dispatch(ExportCThree(exportItems))
      .unwrap()
      .then(() => {
        setIsModalOpens(false);
        dispatch(getDashboardList({ CompanyId }));
      })
      .catch((error) => {
        console.error('Error Submit:', error);
      })
      .finally(() => {
        setLoadingSubmit(false);
      });
  };

  const ExportSubmitted = (headerId, month, year) => {
    setExportItem({
      Headerid: headerId,
      period_Month: month, // Keep as API expects
      Period_year: year, // Keep as API expects
      // isTrue,
    });

    setIsModalOpenExport(true); // Open the modal
  };

  const SubmitC3Export = () => {
    if (!exportItem) return;
    setLoadingExport(true);
    dispatch(EXportSubmit(exportItem))
      .unwrap()
      .then(async (response) => {
        console.log(response); // Debugging
        setIsModalOpenExport(false);
        const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });

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

            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
          } catch (error) {
            console.error('File save canceled or failed:', error);
          }
        } else {
          // Fallback for older browsers
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'ExportedFile.csv'; // Default filename
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch((error) => {
        console.error('Error Submit:', error);
      })
      .finally(() => {
        setLoadingExport(false);
      });
  };

  const DownloadPrint = async (headerId) => {
    setLoadingHeaderId(headerId);
    try {
      const res = await DashboardService.downloadTransaction({
        userId,
        c3HeaderId: headerId,
      });

      if (res.data.status === true) {
        setData(res.data.data);
        setIsOpen(true); // Open modal here
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
      await toPDF1();
    } finally {
      setIsLoadingDown(false);
    }
  };

  const handleClosePrint = () => {
    setIsOpen(false);
    setData(null);
  };

  const onCanceled = () => {
    setIsModalOpenExport(false);
    setIsModalOpens(false);
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

  const printRef = useRef();

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

  //const [payNwLoad, setNwNwLoad] = useState(false);
  const [editNwActive, seteditNwActive] = useState('');
  const payNow = async (c3HeaderId, payC3Period) => {
    debugger;
    //setNwNwLoad(true);
    seteditNwActive(c3HeaderId);
    const payload = {
      // amount,
      userId,
      c3HeaderId,
      payC3Period,
      TransactionFor: 'Self',
    };
    // navigate('/paymentCapture', { state: payload });
    setPaymentPayload(payload);
    setOpenPaymentModal(true);
  };

  const ImportSave = async () => {
    const formdata = {
      UserName,
      SSN: regNumber,
    };

    try {
      const response = await dispatch(ImportBima(formdata)).unwrap();
      if (response.status === true) {
        await dispatch(getDashboardList({ CompanyId }));
      } else {
        throw new Error(response.message || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      throw error; // Re-throw to handle in useEffect
    }
  };

  useEffect(() => {
    const dataArray = DashboardData?.data?.dashboardddata;

    if (
      hasImportedRef.current ||
      (Array.isArray(dataArray) && dataArray.length > 0) ||
      isImportingRef.current
    ) {
      return;
    }

    const executeImport = async () => {
      try {
        hasImportedRef.current = true;
        isImportingRef.current = true;
        setIsLoadingData(true);

        await ImportSave();
      } catch (error) {
        hasImportedRef.current = false; // Allow retry on failure
        console.error('Data import failed:', error);
      } finally {
        isImportingRef.current = false;
        setIsLoadingData(false);
      }
    };

    // Only execute if data is empty/null
    if (!dataArray || (Array.isArray(dataArray) && dataArray.length === 0)) {
      executeImport();
    }
  }, [DashboardData]);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const [showMorePaid, setShowMorePaid] = useState(false);
  const [showMoreUnPaid, setShowMoreUnPaid] = useState(false);

  const paidMonths =
    DashboardData?.data?.paidMonths
      ?.split(',')
      .map((m) => m.trim().substring(0, 3))
      .join(', ') ?? '';

  const PaidPreviewText = paidMonths.substring(0, 18);

  // Employer Unpaid
  const unPaidMonths =
    DashboardData?.data?.unpaidMonths
      ?.split(',')
      .map((m) => m.trim().substring(0, 3))
      .join(', ') ?? '';

  const UnPaidPreviewText = unPaidMonths.substring(0, 18);

  return (
    <>
      <Helmet>
        <title>Dashboard - C3Wizard </title>
      </Helmet>
      <style>
        {`
        
            .card {
    margin-bottom: 1px;
    background-color: #fff;
}
                .amount-green { color: green; font-size: 1.5rem; font-weight: bold; }
    .amount-red { color: red; font-size: 1.5rem; font-weight: bold; }
    .divider { border-left: 1px solid #ddd; }
    .title-icon { font-size: 1.2rem; margin-right: 5px; vertical-align: middle; }
    .section-separator { border-bottom: 2px solid #eee; margin: 0.5rem 0 1rem; }
        `}
      </style>
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
              <span className="d-flex align-items-center gap-1 text-muted">
                <i className="ti-home"></i>Dashboard
              </span>
            </li>
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
                    <div className="row gy-2 mb-2">
                      <div className="row mb-2">
                        {/* <div className="col-md-6">
                          <div className="card p-3">
                            <h5 className="fw-bold text-center">
                              <i className="bi bi-briefcase-fill title-icon text-primary"></i>
                              Self Employed
                            </h5>
                            <div className="section-separator"></div>
                            <div className="row text-center">
                             
                              <div className="col-6">
                                <h6 className="fw-bold">
                                  <i className="bi bi-cash-stack title-icon text-success"></i>
                                  Paid
                                </h6>
                                <div className="amount-green text-success">
                                  {(Number(DashboardData?.data?.director_total_con) || 0).toFixed(
                                    2,
                                  )}
                                 
                                </div>
                                <small className="text-success">
                                  {DashboardData?.data?.dashboardddata[0]?.year} -{' '}
                                  {showMorePaid ? paidMonths : PaidPreviewText}
                                  {paidMonths.length > 18 && (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setShowMorePaid(!showMorePaid);
                                      }}
                                      className="ms-1"
                                    >
                                      {showMorePaid ? 'Read less' : 'Read more'}
                                    </a>
                                  )}
                                </small>
                              </div>

                         
                              <div className="col-6 divider">
                                <h6 className="fw-bold">
                                  <i className="bi bi-exclamation-triangle-fill title-icon text-danger"></i>
                                  Unpaid
                                </h6>
                                <div className="amount-red text-danger">
                                  {DashboardData?.data?.unpaidSelf ?? 0}
                                </div>
                                <small className="text-danger">
                                  {showMoreUnPaid ? unPaidMonths : UnPaidPreviewText}
                                  {unPaidMonths.length > 18 && (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setShowMoreUnPaid(!showMoreUnPaid);
                                      }}
                                      className="ms-1"
                                    >
                                      {showMoreUnPaid ? 'Read less' : 'Read more'}
                                    </a>
                                  )}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-3 bg_ligh">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-money-bill-alt f-18" /> Self Employed
                              Contribution
                            </h4>
                          </div>
                          <div className="card-body pt-1">
                            <div className="table-responsive">
                              <table className="table table-hover mb-0">
                                <thead>
                                  <tr className="border-b">
                                    <th>Month</th>
                                    <th>Year</th>

                                    <th className="td-text-align1">Wages</th>
                                    <th className="td-text-align1">Contribution</th>
                                    <th className="td-text-align1">Fine</th>
                                    <th className="td-text-align1">Total</th>
                                    <th className="td-pl-2">Creation Date</th>

                                    <th>Edit</th>
                                    <th>Preview</th>
                                    <th>Submit</th>
                                    {/* <th>C3 Download</th> */}
                                    <th>Payment</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {DashboardData?.data?.dashboardddata &&
                                  DashboardData?.data?.dashboardddata?.length > 0 ? (
                                    DashboardData?.data?.dashboardddata?.map((item) => (
                                      <tr key={item}>
                                        <td>{item?.month ?? 'N/A'}</td>
                                        <td> {item?.year ?? 'N/A'}</td>
                                        <td className="td-text-align1">
                                          ${item?.totalWages.toFixed(2) ?? '0.00'}
                                        </td>

                                        <td className="td-text-align1">
                                          ${item?.countribution.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align1">
                                          ${item?.totalsspenalty.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td
                                          className={`td-text-align1 ${
                                            item?.isImportFromBEMA
                                              ? 'text-dark'
                                              : item?.ispaid
                                              ? 'text-success1'
                                              : 'text-danger1'
                                          }`}
                                          style={{ fontWeight: '600' }}
                                        >
                                          ${Number(item?.payAmt ?? 0).toFixed(2)}
                                        </td>

                                        <td className="td-pl-2">
                                          {moment(item.creationDate, 'DD-MM-YYYY').format(
                                            'DD-MMM-YYYY',
                                          )}
                                        </td>

                                        <td>
                                          {canEditSElfEmployee && canEditDashboard ? (
                                            item.is_submitted ? (
                                              <span
                                                className="badge bg-soft-secondary text-muted"
                                                title="Edit disabled for paid entries"
                                                style={{ cursor: 'not-allowed', opacity: 0.5 }}
                                              >
                                                <Icon.Edit size={20} />
                                              </span>
                                            ) : (
                                              <Link
                                                to="/apps/updateSelfEmployeeContribution"
                                                state={{ id: item.headerId }}
                                              >
                                                <span className="badge bg-soft-success text-success">
                                                  <Icon.Edit size={20} />
                                                </span>
                                              </Link>
                                            )
                                          ) : (
                                            <span
                                              className="badge bg-soft-secondary text-muted"
                                              title="No permission to edit"
                                              style={{ cursor: 'not-allowed', opacity: 0.6 }}
                                            >
                                              <Icon.Edit size={20} />
                                            </span>
                                          )}
                                        </td>

                                        <td>
                                          {canPreviewSelfEmployee ? (
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
                                          <button
                                            className="btn waves-effect waves-light py-0 submitIcon"
                                            type="button"
                                            onClick={() =>
                                              isSelfEmployeeSubmitted(
                                                item.headerId,
                                                item.ssnemp,
                                                item.monthNo,
                                                item.year,
                                              )
                                            }
                                            disabled={
                                              !canSubmittedSelfEmployee || item.is_submitted
                                            }
                                            style={
                                              !canSubmittedSelfEmployee || item.is_submitted
                                                ? { cursor: 'not-allowed', opacity: 0.4 }
                                                : {}
                                            }
                                          >
                                            <span
                                              data-bs-toggle="tooltip"
                                              data-bs-placement="top"
                                              title="Submit"
                                            >
                                              <i
                                                className="mdi mdi-check-circle f-18"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          </button>
                                        </td>

                                        {/* <td>
                                      <span
                                        style={{
                                          display: 'inline-block',
                                          cursor: !item.is_submitted ? 'not-allowed' : 'pointer',
                                        }}
                                      >
                                        <button
                                          className="btn waves-effect waves-light py-0 submitIconExport"
                                          type="button"
                                          disabled={!item.is_submitted}
                                          style={{
                                            backgroundColor: !item.is_submitted
                                              ? '#e0e0e0'
                                              : '#007bff', 
                                            color: !item.is_submitted ? '#888' : '#fff',
                                            border: 'none',
                                          }}
                                          onClick={() =>
                                            ExportSubmitted(item.headerId, item.month, item.year)
                                          }
                                        >
                                          <span
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title={
                                              item.is_submitted
                                                ? 'Download'
                                                : 'Disabled - Not Submitted Yet'
                                            }
                                          >
                                            <i
                                              className="mdi mdi-download f-18"
                                              aria-hidden="true"
                                              style={{
                                                color: !item.is_submitted ? '#999' : '#fff',
                                              }}
                                            />
                                          </span>
                                        </button>
                                      </span>
                                    </td> */}

                                        <td>
                                          {item.isImportFromBEMA ? (
                                            <a
                                              className="btn btn-success waves-effect waves-light py-1"
                                              type="submit"
                                              disabled=""
                                              style={{ cursor: 'not-allowed', opacity: '0.4' }}
                                            >
                                              BIMA
                                            </a>
                                          ) : (
                                            <>
                                              {item.is_submitted ? (
                                                !item.ispaid ? (
                                                  <a
                                                    onClick={() => {
                                                      if (!canPaySelfEmployee1) return;
                                                      const payC3Period = formatPayC3Period(
                                                        item.monthNo,
                                                        item.year,
                                                      );
                                                      payNow(item.headerId, payC3Period);
                                                    }}
                                                    className={`btn btn-success waves-effect waves-light py-1 ${
                                                      !canPaySelfEmployee1 ? 'disabled-btn' : ''
                                                    }`}
                                                    type="submit"
                                                  >
                                                    {openPaymentModal &&
                                                    editNwActive === item.headerID ? (
                                                      <Spinner color="success" size="sm">
                                                        Loading...
                                                      </Spinner>
                                                    ) : (
                                                      <i className="fas fa-dollar-sign" />
                                                    )}{' '}
                                                    Pay
                                                  </a>
                                                ) : (
                                                  <span
                                                    style={{
                                                      marginLeft: '10px',

                                                      cursor: 'pointer',
                                                    }}
                                                    id="downloadIcon"
                                                    onClick={() => DownloadPrint(item.headerId)}
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
                                                )
                                              ) : (
                                                <>
                                                  <i className="fa fa-times-circle text-danger ms-2" />{' '}
                                                  Not Submitted
                                                </>
                                              )}
                                            </>
                                          )}

                                          {!(
                                            item.isImportFromBEMA === true &&
                                            item.is_submitted === false
                                          ) && (
                                            <span className="text-manage">{item.payReason}</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>{' '}
                </div>

                {/*      <footer class="footer bg-light px-lg-4">
         
      </footer> */}
                {/*     <footerr>
          vdffggj
                  </footerr> */}
                <sidebar-barrrrr></sidebar-barrrrr>
              </div>
              {/* end main content*/}
            </div>
          </>
        )}
        {/* END layout-wrapper */}
        {/* Right Sidebar */}
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
                                          {' '}
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
                                          $
                                          {previewNWDataList?.data?.[0]?.grandTotal.toFixed(2) ??
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
                                                $
                                                {previewNWDataList?.data?.[0]?.deductLeavyWages.toFixed(
                                                  2,
                                                ) ?? '0.00'}
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
                                                  previewNWDataList?.data?.[0]?.fine > 1
                                                    ? 'text-danger'
                                                    : ''
                                                }`}
                                              >
                                                $
                                                {previewNWDataList?.data?.[0]?.fine?.toFixed(2) ??
                                                  '0.00'}
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
                                                {' '}
                                                $
                                                {previewNWDataList?.data?.[0]?.grandTotal.toFixed(
                                                  2,
                                                ) ?? '0.00'}
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
                                        {/* <div className="col-xl-5">
                                          &nbsp;
                                          <div
                                            className="border mr-bottom"
                                            style={{
                                              borderBottom: '1px solid #666 !important',
                                              display: 'inline-block',
                                              width: '100%',
                                            }}
                                          ></div>
                                          <p className="text-center mb-0"> Signature</p>
                                        </div>
                                        <div className="col-xl-2"></div>
                                        <div className="col-xl-5">
                                          <div className="addon_class">
                                            {moment(new Date(currentDateTime), 'DD-MM-YYYY').format(
                                              'DD-MMM-YYYY',
                                            )}
                                          </div>

                                          <span
                                            className="border mr-bottom"
                                            style={{
                                              borderBottom: '1px solid #666 !important',
                                              width: '100%',
                                              display: 'inline-block',
                                            }}
                                          ></span>
                                          <p className="text-center mb-0">Date </p>
                                        </div> */}
                                        <table className="w-100">
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  width: isPaidStatus ? '30%' : '40%',
                                                  verticalAlign: 'top',
                                                }}
                                              >
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
                <div className="rightbar-overlay" />
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
            {canPrintSelfEmployee ? (
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

        <Modal isOpen={isModalOpens} toggle={toggleModal1}>
          <ModalHeader toggle={toggleModal1}>Confirm Action</ModalHeader>
          <ModalBody>
            Do you want to submit your C3? If you submit, you won&#39;t be able to edit it later.
            The edit button will be disabled.
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" className="btn-light" onClick={onCanceled}>
              No
            </Button>
            <Button color="primary" onClick={isSubmitC3} disabled={loadingSubmit}>
              {loadingSubmit ? (
                <>
                  <Spinner size="sm" /> Loading
                </>
              ) : (
                <>Yes</>
              )}
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={isModalOpenExport} toggle={toggleModalExport}>
          <ModalHeader toggle={toggleModalExport}>Confirm Action</ModalHeader>
          <ModalBody>Do you want to Export this C3 ?</ModalBody>
          <ModalFooter>
            <Button color="secondary" className="btn-light" onClick={onCanceled}>
              No
            </Button>
            <Button color="primary" onClick={SubmitC3Export} disabled={loadingExport}>
              {loadingExport ? (
                <>
                  <Spinner size="sm" /> Loading
                </>
              ) : (
                <>Yes</>
              )}
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={isModalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Confirm Action</ModalHeader>
          <ModalBody>
            Do you want to import your list of employees based on your last C3 Submission from
            Social Security System?
          </ModalBody>
          <ModalFooter>
            <Button color="btn btn-light border px-4 " onClick={handleClose}>
              No
            </Button>
            <Button disabled={loadingModal} color="primary" onClick={() => ImportSave({})}>
              {loadingModal ? (
                <>
                  <Spinner size="sm" /> Loading...
                </>
              ) : (
                <>Yes</>
              )}
            </Button>
          </ModalFooter>
        </Modal>
      </div>

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
                          <td>{localStorage.getItem('reG_NUMBER') || 'N/A'}</td>
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
                            <td className="amount1">${Number(data.totalServayance).toFixed(2)}</td>
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

      <PaymentForm
        isOpen={openPaymentModal}
        rPayload={paymentPayload}
        toggle={() => setOpenPaymentModal(false)}
      />
    </>
  );
};
export default Dashboard;
