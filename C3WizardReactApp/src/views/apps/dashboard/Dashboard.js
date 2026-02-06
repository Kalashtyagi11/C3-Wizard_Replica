import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
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
  UncontrolledTooltip,
} from 'reactstrap';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import { Helmet } from 'react-helmet';
import * as Icon from 'react-feather';
import Loader from '../../../layouts/loader/Loader';
import http from '../../../baseUrl/HttpCommon';
import authHeader from '../../../service/authHeader/AuthHeader';
import {
  getContribution,
  previewAllData,
  previewNWData,
  dashboardSubmitDirector,
  ExportCompany,
  ExportNotWorking,
  dashboardSubmitContribution,
  getContributionSingle,
} from '../../../store/apps/dashboard/DashboardSlice';
import DashboardService from '../../../service/dashboard/Dashboard';
import { ViewPayrollDirector } from '../../../store/apps/nonWorkingDirectory/NonWorkingDirectory';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import { editC3EmployeeListing } from '../../../store/apps/cGeneration/CGenerationSlice';
import { getEmployeeList } from '../../../store/apps/employee/EmployeeSlice';
import { ImportEmployee } from '../../../store/apps/auth/AuthSlice';
import user1 from '../../../assets/images/users/user4.jpg';
import Paid from '../../../assets/images/users/Paid.png';
import ReportLogo from '../../../assets/images/users/Reportlogo.jpg';
import EmployeeC3DownloadLink from '../component/EmployerReportLink';
import NonWorkingDownloadLink from '../component/NwReportLInk';
import PaymentForm from '../Payments/paymentCapture';
import NillImage from '../../../assets/images/users/Nill.png';

const Dashboard = () => {
  const [isLoadingDown, setIsLoadingDown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingHeaderId, setLoadingHeaderId] = useState(null);
  const UserName = localStorage.getItem('userName');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSubmit, setIsModalSubmit] = useState(false);
  const [isModalSubmitC, setIsModalSubmitC] = useState(false);
  const [selectedHeaderID, setSelectedHeaderID] = useState(null);
  const [isModalOpenExport, setIsModalOpenExport] = useState(false);
  const [exportItem, setExportItem] = useState(null);
  const toggleModalExport = () => setIsModalOpenExport(!isModalOpenExport);
  const [isNWModalOpenExport, setIsNWModalOpenExport] = useState(false);
  const [exportNWItem, setExportNWItem] = useState(null);
  const toggleModalNWExport = () => setIsNWModalOpenExport(!isNWModalOpenExport);
  const { EmployeeList = [] } = useSelector((state) => state.employeeSlice || {});
  const { loadingModal } = useSelector((state) => state.authSlice);
  const [apiFinished, setApiFinished] = useState(false);
  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);
  const [loadings, setLoadings] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [isPaidStatus, setIsPaidStatus] = useState(null);
  const [isSubmittedNill, setIsSubmittedNill] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [showRecipt, setShowRecipt] = useState(false);
  const [params, setParams] = useState({
    month: null,
    year: null,
    companyId: parseInt(localStorage.getItem('companyId'), 10),
    c3HeaderId: null,
  });
  const [editeNwLoad, setEditeNwLoad] = useState(false);
  const [payNwLoad, setNwNwLoad] = useState(false);
  const [editNwActive, seteditNwActive] = useState('');
  const [hasSavedOnce, setHasSavedOnce] = useState(false);

  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);
  const dispatch = useDispatch();
  const companyId = localStorage.getItem('companyId');
  const regno = localStorage.getItem('reG_NUMBER');
  const { message, type } = useSelector((state) => state.messageReducer);
  const { ContributionCount, loading: reduxLoading } = useSelector((state) => state.dashboardSlice);
  const { previewData } = useSelector((state) => state.dashboardSlice);
  const { previewNWDataList } = useSelector((state) => state.dashboardSlice);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission1 = savedRoles?.find((role) => role.description === 'DASHBOARD') || null;
  const canEditDashboard = employerPermission1?.updatePermission;
  const canPreviewDashboard = employerPermission1?.is_preview;
  const canPrintDashboard = employerPermission1?.is_Print;
  const canSubmittedDashboard = employerPermission1?.is_Submitted;
  const canPayDashboard = employerPermission1?.is_pay;
  const c3EditPermission = Array.isArray(savedRoles)
    ? savedRoles
        .flatMap((role) => role.children || [])
        .find((child) => child.description === 'C3 GENERATION')
    : null;
  const canC3EditPermission = c3EditPermission?.updatePermission;
  const canPreviewPermission = c3EditPermission?.is_preview;
  const canPrintPermission = c3EditPermission?.is_Print;
  const canSubmittedPermission = c3EditPermission?.is_Submitted;
  const employerPermission = Array.isArray(savedRoles)
    ? savedRoles
        .flatMap((role) => role.children || [])
        .find((child) => child.description === 'NW DIRECTOR PAYROLL')
    : null;
  const canEditNWDirectorPayroll = employerPermission?.updatePermission;
  const canPreviewNWDirectorPayroll = employerPermission?.is_preview;
  const canPrintNWDirectorPayroll = employerPermission?.is_Print;
  const canSubmittedNWDirectorPayroll = employerPermission?.is_Submitted;
  const printRef = useRef();
  const [data, setData] = useState(null);
  const { toPDF: toPDF1, targetRef: targetRef1 } = usePDF({ filename: 'TransactionReceipt.pdf' });
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentPayload, setPaymentPayload] = useState(null);
  const isLoading = reduxLoading || loadings;

  useEffect(() => {
    if (companyId) {
      dispatch(
        getContribution({
          companyId,
          ResultArea: 'D',
          FromMonth: '',
          ToMonth: '',
          Year: '',
          endYear: '',
        }),
      );
    }
  }, [localStorage.getItem('companyId')]);

  useEffect(() => {
    if (companyId) {
      dispatch(getContributionSingle(companyId));
    }
  }, []);

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

  const handleShow = (id, years, months, ispaid, isSubmitted) => {
    const updatedParams = {
      monthName: months,
      year: years,
      companyId: parseInt(localStorage.getItem('companyId'), 10),
      c3HeaderId: id,
    };

    setParams(updatedParams);

    dispatch(previewAllData(updatedParams));
    setShow(true);
    setIsPaidStatus(ispaid);
    setIsSubmittedNill(isSubmitted);
  };

  const handleShow2 = (id, years, months, ispaid, isSubmitted) => {
    const updatedParams = {
      monthId: months,
      year: years,
      companyId: parseInt(localStorage.getItem('companyId'), 10),
      c3HeaderId: id,
    };

    setParams(updatedParams);

    dispatch(previewNWData(updatedParams));
    setShow2(true);
    setIsPaidStatus(ispaid);
    setIsSubmittedNill(isSubmitted);
  };

  const CompanyId = localStorage.getItem('companyId');
  const userId = localStorage.getItem('userID');
  const [editeLoad, setEditeLoad] = useState(false);
  const [editActive, seteditActive] = useState('');

  function editc3(headerId) {
    setEditeLoad(true);
    seteditActive(headerId);
    dispatch(editC3EmployeeListing({ headerId, CompanyId }))
      .unwrap()
      .then((response) => {
        navigate('/apps/C3/Add-C3Generation', { state: response.editC3EmployeeResponse });
        setEditeLoad(false);
      })
      .catch((e) => {
        setEditeLoad(false);
        toast.error('something went wrong');
      });
  }

  const monthName = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const formatPayC3Period = (periodMonth, periodYear) => {
    if (!periodMonth || !periodYear) return null;

    const monthMap = {
      january: 'jan',
      february: 'feb',
      march: 'mar',
      april: 'apr',
      may: 'may',
      june: 'jun',
      july: 'jul',
      august: 'aug',
      september: 'sep',
      october: 'oct',
      november: 'nov',
      december: 'dec',
    };

    const shortMonth = monthMap[periodMonth.toLowerCase()];

    return shortMonth ? `${shortMonth}/${periodYear}` : null;
  };

  function editNwc3(headerID, monthKey, Year) {
    setEditeNwLoad(true);
    seteditNwActive(headerID);
    const monthNumber = monthName[monthKey];
    dispatch(ViewPayrollDirector({ headerID, monthno: monthNumber, Year, CompanyId }))
      .unwrap()
      .then((response) => {
        navigate('/apps/director/generateC3', { state: response.EditPayrollData });
        setEditeNwLoad(false);
      })
      .catch((e) => {
        setEditeNwLoad(false);
        toast.error('something went wrong');
      });
  }

  const SubmitDirector = (headerID) => {
    setSelectedHeaderID(headerID); // store for later
    setIsModalSubmitC(true); // open modal
  };

  const handleCancel = () => {
    setIsModalSubmit(false);
    setIsModalSubmitC(false);
  };

  const handleConfirmSubmit = () => {
    setLoadingSubmit(true);
    const payload = {
      CompanyId,
      userId,
      headerID: selectedHeaderID,
    };

    dispatch(dashboardSubmitDirector(payload))
      .unwrap()
      .then((response) => {
        dispatch(getContributionSingle(companyId));
        setIsModalSubmitC(false);
      })
      .catch((error) => {
        console.error('Something went wrong:', error);
      })
      .finally(() => {
        setLoadingSubmit(false);
      });
  };

  const payNow = async (c3HeaderId, payC3Period) => {
    debugger;
    setNwNwLoad(true);
    seteditNwActive(c3HeaderId);
    const payload = {
      // amount,
      userId,
      c3HeaderId,
      payC3Period,
      TransactionFor: 'Company',
    };
    setPaymentPayload(payload);
    setOpenPaymentModal(true);
    //navigate('/paymentCapture', { state: payload });
  };

  const DownloadPrint = async (headerID) => {
    setLoadingHeaderId(headerID);
    try {
      const res = await DashboardService.downloadTransaction({
        userId,
        c3HeaderId: headerID,
      });

      if (res.data.status === true) {
        setData(res.data.data);
        setIsOpen(true); // Open modal here
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

  const SubmitContribution = (headerID) => {
    setSelectedHeaderID(headerID); // store for later
    setIsModalSubmit(true); // open modal
  };

  const handleConfirmSubmitNotWorking = () => {
    setLoadingSubmit(true);
    const payload = {
      CompanyId,
      userId,
      headerID: selectedHeaderID,
    };

    dispatch(dashboardSubmitContribution(payload))
      .unwrap()
      .then((response) => {
        dispatch(getContributionSingle(companyId));
        setIsModalSubmit(false);
      })
      .catch((error) => {
        console.error('Something went wrong:', error);
      })
      .finally(() => {
        setLoadingSubmit(false);
      });
  };

  const { toPDF, targetRef } = usePDF({
    filename: 'SocialSecurityReport.pdf',

    page: { margin: Margin.NONE, orientation: 'landscape' },
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

  // ---C3 Employee Check------------

  const [Employees, setEmployees] = useState(null);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleGoToAddEmployee = () => {
    setIsModalOpen(false); // Optional: close modal
    navigate('/apps/addEmployee/AddEmployee'); // Replace with your actual route
  };

  // ---C3 Employee EXport---------

  const CompanyExportCThree = (scheduleNo, periodMonth, periodYear) => {
    setExportItem({
      schedule_NO: scheduleNo, // Matching API field
      period_Month: periodMonth, // Matching API field
      period_year: periodYear, // Matching API field
      CompanyId,
    });

    setIsModalOpenExport(true); // Open the modal
  };

  const CompanyCThreeExport = () => {
    if (!exportItem) return;
    setLoadingExport(true);
    dispatch(ExportCompany(exportItem))
      .unwrap()
      .then(async (response) => {
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
                // { description: "PDF File", accept: { "application/pdf": [".pdf"] } },
                { description: 'Text File', accept: { 'text/plain': ['.txt'] } },
                { description: 'WordPad File', accept: { 'application/rtf': ['.rtf'] } },
              ],
            });

            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
          } catch (error) {
            console.error('Something went wrong:', error);
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
        console.error('Something went wrong:', error);
      })
      .finally(() => {
        setLoadingExport(false);
      });
  };

  // Not working Export

  const CompanyExportNW = (headerId, ssnemp, month, year) => {
    setExportNWItem({
      SSNofEmp: ssnemp, // Adjusted to match API parameter names
      Headerid: headerId,
      period_Month: month, // Keep as API expects
      Period_year: year, // Keep as API expects
    });

    setIsNWModalOpenExport(true); // Open the modal
  };

  const CompanyNWExport = () => {
    if (!exportNWItem) return;
    setLoadingExport(true);
    dispatch(ExportNotWorking(exportNWItem))
      .unwrap()
      .then(async (response) => {
        setIsNWModalOpenExport(false);
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
                // { description: "PDF File", accept: { "application/pdf": [".pdf"] } },
                { description: 'Text File', accept: { 'text/plain': ['.txt'] } },
                { description: 'WordPad File', accept: { 'application/rtf': ['.rtf'] } },
              ],
            });

            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
          } catch (error) {
            console.error('Something went wrong:', error);
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
        console.error('Something went wrong:', error);
      })
      .finally(() => {
        setLoadingExport(false);
      });
  };

  const onCanceled = () => {
    setIsModalOpenExport(false);
    setIsNWModalOpenExport(false);
  };

  const save = async () => {
    const formdata = {
      UserName,
      regno,
    };

    try {
      const response = await dispatch(ImportEmployee(formdata)).unwrap();
      if (response.status === true) {
        await dispatch(getContributionSingle(companyId));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Something went wrong:', error);
      throw error; // Re-throw to handle in useEffect
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoadings(true);
      try {
        const response = await http.get(`/C3/GetAllEmployee?CompanyId=${CompanyId}`);
        if (isMounted) {
          const result = response.data?.data || [];
          setEmployees(result);
          if (result.length === 0) {
            await save();
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Something went wrong:', error);
        }
      } finally {
        if (isMounted) {
          setLoadings(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [CompanyId]);

  const [showMorePaid, setShowMorePaid] = useState(false);
  const [showMoreUnPaid, setShowMoreUnPaid] = useState(false);
  const [showMoreDirPaid, setShowMoreDirPaid] = useState(false);
  const [showMoreDirUnPaid, setShowMoreDirUnPaid] = useState(false);

  // Employer Paid
  const paidMonths =
    ContributionCount?.paidMonths
      ?.split(',')
      .map((m) => m.trim().substring(0, 3))
      .join(', ') ?? '';

  const PaidPreviewText = paidMonths.substring(0, 18);

  // Employer Unpaid
  const unPaidMonths =
    ContributionCount?.unPaidMonths
      ?.split(',')
      .map((m) => m.trim().substring(0, 3))
      .join(', ') ?? '';

  const UnPaidPreviewText = unPaidMonths.substring(0, 18);

  // Director Paid
  const directorPaidMonths =
    ContributionCount?.paidMonthsDir
      ?.split(',')
      .map((m) => m.trim().substring(0, 3))
      .join(', ') ?? '';

  const DirPaidPreviewText = directorPaidMonths.substring(0, 18);

  // Director Unpaid
  const directorUnPaidMonths =
    ContributionCount?.unPaidMonthsDir
      ?.split(',')
      .map((m) => m.trim().substring(0, 3))
      .join(', ') ?? '';

  const DirUnPaidPreviewText = directorUnPaidMonths.substring(0, 18);

  return (
    <>
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
      <Helmet>
        <title>Dashboard - C3Wizard </title>
      </Helmet>

      <div id="layout-wrapper">
        <my-header />
        {/* ========== Left Sidebar Start ========== */}
        {/* Left Sidebar End */}
        <sidebar-barrrrrr></sidebar-barrrrrr>
        {/* ============================================================== */}
        {/* Start right Content here */}
        {/* ============================================================== */}
        {isLoading ? (
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
              </ul>
            </div>
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                    <div className="row g-3 mb-4 ">
                      {/* <div className="col-md-6">
                        <div className="card p-3">
                          <h5 className="fw-bold text-center">
                            <i className="bi bi-briefcase-fill title-icon text-primary"></i>
                            Employer
                          </h5>
                          <div className="section-separator"></div>
                          <div className="row text-center">
                          
                            <div className="col-6">
                              <h6 className="fw-bold">
                                <i className="bi bi-cash-stack title-icon text-success"></i>
                                Paid
                              </h6>
                              <div className="amount-green  text-success">
                                {ContributionCount?.total ?? 0.0}
                              </div>
                              <small className="text-success">
                                {ContributionCount?.dashboard_list?.[0]?.period_year || null}-{' '}
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
                              <div className="amount-red  text-danger">
                                {ContributionCount?.unPaid ?? 0.0}
                              </div>
                              <small className="text-danger">
                                {ContributionCount?.dashboard_list?.[0]?.period_year || null}-{' '}
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
                      </div>

                     
                      <div className="col-md-6">
                        <div className="card p-3">
                          <h5 className="fw-bold text-center">
                            <i className="bi bi-person-badge-fill title-icon text-primary"></i>
                            NW Director
                          </h5>
                          <div className="section-separator"></div>
                          <div className="row text-center">
                           
                            <div className="col-6">
                              <h6 className="fw-bold">
                                <i className="bi bi-cash-stack title-icon text-success"></i>
                                Paid
                              </h6>
                              <div className="amount-green text-success">
                                {ContributionCount?.director_total ?? 0.0}
                              </div>
                              <small className="text-success">
                                {ContributionCount?.dashboard_list?.[0]?.period_year || null}-{' '}
                                {showMoreDirPaid ? directorPaidMonths : DirPaidPreviewText}
                                {directorPaidMonths.length > 18 && (
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setShowMoreDirPaid(!showMoreDirPaid);
                                    }}
                                    className="ms-1"
                                  >
                                    {showMoreDirPaid ? 'Read less' : 'Read more'}
                                  </a>
                                )}
                              </small>
                            </div>

                           
                            <div className="col-6 divider">
                              <h6 className="fw-bold">
                                <i className="bi bi-exclamation-triangle-fill title-icon text-danger"></i>
                                Unpaid
                              </h6>
                              <div className="amount-red  text-danger">
                                {ContributionCount?.unPaidDir ?? 0}
                              </div>
                              <small className="text-danger">
                                {ContributionCount?.dashboard_list?.[0]?.period_year || null}-{' '}
                                {showMoreDirUnPaid ? directorUnPaidMonths : DirUnPaidPreviewText}
                                {directorUnPaidMonths.length > 18 && (
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setShowMoreDirUnPaid(!showMoreDirUnPaid);
                                    }}
                                    className="ms-1"
                                  >
                                    {showMoreDirUnPaid ? 'Read less' : 'Read more'}
                                  </a>
                                )}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </div>

                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-3 bg_ligh">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-money-bill-alt f-18" /> C3 Contribution
                            </h4>
                          </div>
                          <div className="card-body pt-1">
                            <div className="table-responsive table-container">
                              <table className="table new_table table-hover mb-0">
                                <thead>
                                  <tr className="border-b">
                                    <th>Month</th>
                                    <th>Year</th>
                                    <th className="td-text-align1">Wages</th>
                                    <th className="td-text-align1">Social Security</th>
                                    <th className="td-text-align1">Levy</th>
                                    <th className="td-text-align1">Fines and Penalties</th>
                                    <th className="td-text-align1">Severance</th>
                                    <th className="td-text-align1">Total</th>
                                    <th className="td-pl-2">Creation Date</th>
                                    <th>Schedule</th>
                                    <th>Edit</th>
                                    <th>Preview</th>
                                    <th>Submit</th>
                                    <th style={{ minWidth: '90px' }}>Payment</th>
                                    <th className="d-none">C3 Download</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {ContributionCount?.dashboard_list &&
                                  ContributionCount?.dashboard_list?.length > 0 ? (
                                    ContributionCount?.dashboard_list?.map((item, itemIndex) => (
                                      <tr
                                        key={item}
                                        className={
                                          itemIndex % 2 === 0
                                            ? 'alternate-row-red'
                                            : 'alternate-row-blue'
                                        }
                                      >
                                        <td>
                                          {item.is_submitted === true ? (
                                            <i className="fa fa-check-circle text-success" />
                                          ) : (
                                            <i className="fa fa-times-circle text-danger" />
                                          )}{' '}
                                          {item?.period_Month ?? 'N/A'}
                                        </td>
                                        <td>{item?.period_year}</td>
                                        <td className="td-text-align1">
                                          ${item?.totaL_WAGES?.toFixed(2) ?? 'N/A'}
                                        </td>
                                        <td className="td-text-align1">
                                          ${item?.totalsscontributions?.toFixed(2)}
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
                                          ${item?.totalSSBpenanlity?.toFixed(2)}
                                        </td>
                                        <td className="td-text-align1">
                                          ${item?.totalservayance?.toFixed(2)}
                                        </td>
                                        {/* <td
                                          className="td-text-align text-primary"
                                          style={{ fontWeight: '600' }}
                                        >
                                          ${item?.payAmt?.toFixed(2)}
                                        </td> */}
                                        <td
                                          className={`td-text-align1 ${
                                            item?.isImportFromBEMA
                                              ? ''
                                              : item?.ispaid
                                              ? 'text-success1'
                                              : 'text-danger1'
                                          }`}
                                          style={{ fontWeight: '600' }}
                                        >
                                          ${Number(item?.payAmt ?? 0).toFixed(2)}
                                        </td>
                                        <td className="td-pl-2">
                                          {moment(item.insert_Datetimeinfo, 'DD-MM-YYYY').format(
                                            'DD-MMM-YYYY',
                                          )}
                                        </td>
                                        <td>{item?.schedule_NO ?? 'N/A'}</td>

                                        <td>
                                          {canC3EditPermission && canEditDashboard ? (
                                            item.is_submitted ? (
                                              // Disable if paid
                                              <span
                                                className="badge bg-soft-secondary text-muted"
                                                title="Paid - Edit disabled"
                                                style={{
                                                  cursor: 'not-allowed',
                                                  opacity: 0.6,
                                                  pointerEvents: 'none',
                                                }}
                                              >
                                                <Icon.Edit size={20} />
                                              </span>
                                            ) : (
                                              // Enable if not paid
                                              <span className="badge bg-soft-success text-success">
                                                {editeLoad && editActive === item.headerID ? (
                                                  <Spinner color="success" size="sm">
                                                    Loading...
                                                  </Spinner>
                                                ) : (
                                                  <Icon.Edit
                                                    size={20}
                                                    onClick={() => editc3(item.headerID)}
                                                  />
                                                )}
                                              </span>
                                            )
                                          ) : (
                                            // No permission
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
                                          {canPreviewDashboard && canPreviewPermission ? (
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

                                        {/* <EmployeeC3DownloadLink
                                          monthName={item.period_Month}
                                          year={item.period_year}
                                          c3HeaderId={item.headerID}
                                          companyId={parseInt(localStorage.getItem('companyId'), 10)}
                                          disabled={!canPreviewDashboard || !canPreviewPermission}
                                          
                                        /> */}

                                        <td>
                                          <button
                                            className="btn waves-effect waves-light py-0 submitIcon"
                                            type="button"
                                            onClick={() => SubmitDirector(item.headerID)}
                                            disabled={
                                              !canSubmittedDashboard ||
                                              !canSubmittedPermission ||
                                              item.is_submitted
                                            }
                                            style={
                                              !canSubmittedDashboard ||
                                              !canSubmittedPermission ||
                                              item.is_submitted
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

                                        <td>
                                          {item.isNilReturn ? (
                                            <a
                                              className="btn btn-light waves-effect waves-light py-1"
                                              type="submit"
                                              disabled=""
                                              style={{ cursor: 'not-allowed', opacity: '0.4' }}
                                            >
                                              Nil Return
                                            </a>
                                          ) : item.isImportFromBEMA ? (
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
                                                  <button
                                                    onClick={() => {
                                                      if (!canPayDashboard) return;
                                                      const {
                                                        period_Month: periodMonth,
                                                        period_year: periodYear,
                                                      } = item;

                                                      const payC3Period = formatPayC3Period(
                                                        periodMonth,
                                                        periodYear,
                                                      );
                                                      payNow(item.headerID, payC3Period);
                                                    }}
                                                    className={`btn btn-success waves-effect waves-light py-1 ${
                                                      !canPayDashboard ? 'disabled-btn' : ''
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
                                                  </button>
                                                ) : (
                                                  <span
                                                    style={{
                                                      marginLeft: '10px',

                                                      cursor: 'pointer',
                                                    }}
                                                    id="downloadIcon"
                                                    onClick={() => DownloadPrint(item.headerID)}
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
                                            <span
                                              style={{ fontWeight: '600', fontSize: '9px' }}
                                              className={`text-manage ${
                                                item.isPaidStatus === 'AUTHORIZED'
                                                  ? 'text-success'
                                                  : 'text-danger'
                                              }`}
                                            >
                                              {item.isPaidStatus}
                                            </span>
                                          )}
                                        </td>

                                        <td className="d-none">
                                          <span
                                            style={{
                                              display: 'inline-block',
                                              cursor: !item.is_submitted
                                                ? 'not-allowed'
                                                : 'pointer',
                                            }}
                                          >
                                            <button
                                              className="btn waves-effect waves-light py-0 submitIconExport"
                                              type="button"
                                              disabled={!item.is_submitted}
                                              style={{
                                                backgroundColor: !item.is_submitted
                                                  ? '#e0e0e0'
                                                  : '#007bff', // Gray if disabled, blue if enabled
                                                color: !item.is_submitted ? '#888' : '#fff', // Light gray text if disabled
                                                border: 'none',
                                              }}
                                              onClick={() =>
                                                CompanyExportCThree(
                                                  item.schedule_NO,
                                                  item.period_Month,
                                                  item.period_year,
                                                )
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
                                                />
                                              </span>
                                            </button>
                                          </span>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="16" className="text-center">
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
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-3 bg_ligh">
                            <h4 className="header-title mb-0 text-success">
                              <i className="fas fa-money-bill-wave text-success" /> NW Director
                              Contribution
                            </h4>
                          </div>
                          <div className="card-body pt-1">
                            <div className="table-responsive table-container">
                              <table className="table new_table table-hover mb-0">
                                <thead>
                                  <tr className="border-b">
                                    <th>Month</th>
                                    <th>Year</th>
                                    <th className="td-text-align1">Wages</th>
                                    <th className="td-text-align1">Levy</th>
                                    <th className="td-text-align1">Fines and Penalties</th>
                                    <th className="td-text-align1">Total</th>
                                    <th className="td-pl-2">Creation Date</th>
                                    <th>Schedule</th>
                                    <th>Edit</th>
                                    <th>Preview</th>
                                    <th>Submit</th>
                                    <th style={{ maxWidth: '80px' }}>Payment</th>
                                    <th className="d-none">C3 Download</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {ContributionCount?.director_dashboard_list &&
                                  ContributionCount?.director_dashboard_list?.length > 0 ? (
                                    ContributionCount?.director_dashboard_list?.map(
                                      (item, itemIndex) => (
                                        <tr
                                          className={
                                            itemIndex % 2 === 0
                                              ? 'alternate-row-red'
                                              : 'alternate-row-blue'
                                          }
                                        >
                                          <td>
                                            {item.is_submitted === true ? (
                                              <i className="fa fa-check-circle text-success" />
                                            ) : (
                                              <i className="fa fa-times-circle text-danger" />
                                            )}{' '}
                                            {item.period_Month ?? 'N/A'}
                                          </td>

                                          <td>{item?.period_year ?? 'N/A'}</td>

                                          <td className="td-text-align1">
                                            ${item.totaL_WAGES?.toFixed(2) ?? '0.00'}
                                          </td>
                                          <td className="td-text-align1">
                                            ${item.totallevyeeemployee?.toFixed(2) ?? '0.00'}
                                          </td>
                                          <td className="td-text-align1">
                                            ${item?.totalSSBpenanlity?.toFixed(2) ?? '0.00'}
                                          </td>

                                          <td
                                            className={`td-text-align1 ${
                                              item?.isImportFromBEMA
                                                ? ''
                                                : item?.ispaid
                                                ? 'text-success1'
                                                : 'text-danger1'
                                            }`}
                                            style={{ fontWeight: '600' }}
                                          >
                                            ${Number(item?.payAmt ?? 0).toFixed(2)}
                                          </td>

                                          <td className="td-pl-2">
                                            {moment(item.insert_Datetimeinfo, 'DD-MM-YYYY').format(
                                              'DD-MMM-YYYY',
                                            )}
                                          </td>
                                          <td>{item?.schedule_NO ?? 'NA'}</td>

                                          <td>
                                            {canEditNWDirectorPayroll && canEditDashboard ? (
                                              item.is_submitted ? (
                                                // Disable if paid
                                                <span
                                                  className="badge bg-soft-secondary text-muted"
                                                  title="Paid - Edit disabled"
                                                  style={{
                                                    cursor: 'not-allowed',
                                                    opacity: 0.6,
                                                    pointerEvents: 'none',
                                                  }}
                                                >
                                                  <Icon.Edit size={20} />
                                                </span>
                                              ) : (
                                                // Enable if not paid
                                                <span className="badge bg-soft-success text-success">
                                                  {editeNwLoad && editNwActive === item.headerID ? (
                                                    <Spinner color="success" size="sm">
                                                      Loading...
                                                    </Spinner>
                                                  ) : (
                                                    <Icon.Edit
                                                      size={20}
                                                      onClick={() =>
                                                        editNwc3(
                                                          item.headerID,
                                                          item.period_Month,
                                                          item.period_year,
                                                        )
                                                      }
                                                    />
                                                  )}
                                                </span>
                                              )
                                            ) : (
                                              // No permission
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
                                            {canPreviewDashboard && canPreviewNWDirectorPayroll ? (
                                              <a
                                                data-bs-toggle="modal"
                                                data-bs-target="#myModal3"
                                                className="badge bg-soft-primary text-primary f-18"
                                                data-bs-placement="top"
                                                title="Preview"
                                                onClick={() =>
                                                  handleShow2(
                                                    item.headerID,
                                                    item.period_year,
                                                    item.period_Month,
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

                                          {/* <NonWorkingDownloadLink
                                          month={item.period_Month}
                                          year={item.period_year}
                                          c3HeaderId={item.headerID}
                                          companyId={parseInt(
                                            localStorage.getItem('companyId'),
                                            10,
                                          )}
                                          disabled={!canPreviewDashboard || !canPreviewPermission}
                                        /> */}

                                          <td>
                                            <button
                                              className="btn waves-effect waves-light py-0 submitIcon"
                                              type="button"
                                              onClick={() => SubmitContribution(item.headerID)}
                                              disabled={
                                                !canSubmittedDashboard ||
                                                !canSubmittedNWDirectorPayroll ||
                                                item.is_submitted
                                              }
                                              style={
                                                !canSubmittedDashboard ||
                                                !canSubmittedNWDirectorPayroll ||
                                                item.is_submitted
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
                                          <td>
                                            {item.isNilReturn ? (
                                              <a
                                                className="btn btn-light waves-effect waves-light py-1"
                                                type="submit"
                                                disabled=""
                                                style={{ cursor: 'not-allowed', opacity: '0.4' }}
                                              >
                                                Nil Return
                                              </a>
                                            ) : item.isImportFromBEMA ? (
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
                                                        if (!canPayDashboard) return;
                                                        const {
                                                          period_Month: periodMonth,
                                                          period_year: periodYear,
                                                        } = item;

                                                        const payC3Period = formatPayC3Period(
                                                          periodMonth,
                                                          periodYear,
                                                        );
                                                        payNow(item.headerID, payC3Period);
                                                      }}
                                                      className={`btn btn-success waves-effect waves-light py-1 ${
                                                        !canPayDashboard ? 'disabled-btn' : ''
                                                      }`}
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
                                                      onClick={() => DownloadPrint(item.headerID)}
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
                                              <span
                                                style={{ fontWeight: '600', fontSize: '9px' }}
                                                className={`text-manage ${
                                                  item.isPaidStatus === 'AUTHORIZED'
                                                    ? 'text-success'
                                                    : 'text-danger'
                                                }`}
                                              >
                                                {item.isPaidStatus}
                                              </span>
                                            )}
                                          </td>

                                          <td className="d-none">
                                            <span
                                              style={{
                                                display: 'inline-block',
                                                cursor: !item.is_submitted
                                                  ? 'not-allowed'
                                                  : 'pointer',
                                              }}
                                            >
                                              <button
                                                className="btn waves-effect waves-light py-0 submitIconExport"
                                                type="button"
                                                disabled={!item.is_submitted}
                                                style={{
                                                  backgroundColor: !item.is_submitted
                                                    ? '#e0e0e0'
                                                    : '#007bff', // Gray if disabled, blue if enabled
                                                  color: !item.is_submitted ? '#888' : '#fff', // Light gray text if disabled
                                                  border: 'none',
                                                }}
                                                onClick={() =>
                                                  CompanyExportNW(
                                                    item.headerID,
                                                    item.regNo,
                                                    item.period_Month,
                                                    item.period_year,
                                                  )
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
                                                      color: !item.is_submitted ? '#999' : '#fff', // Dim icon when disabled
                                                    }}
                                                  />
                                                </span>
                                              </button>
                                            </span>
                                          </td>
                                        </tr>
                                      ),
                                    )
                                  ) : (
                                    <tr>
                                      <td colSpan="18" className="text-center">
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
                  {/* PopUp Start   */}
                  {/* <Modal isOpen={show} size="xl" onHide={handleClose}>
                    <ModalHeader toggle={handleClose}> */}
                  <Modal isOpen={show} size="xl" onHide={handleClose}>
                    <ModalHeader toggle={handleClose}>
                      <h2>Report </h2>
                    </ModalHeader>
                    <ModalBody>
                      <div className="row">
                        <div className="col-xl-12">
                          <div className="card">
                            <div ref={targetRef}>
                              <div
                                className="card-body add_custom "
                                style={{ position: 'relative' }}
                                ref={printRef}
                              >
                                <h3 style={{ lineHeight: '131%', textAlign: 'center' }}>
                                  THE ST.CHRISTOPHER AND NEVIS - SOCIAL SECURITY BOARD
                                  <br /> STATEMENT OF WAGES AND CONTRIBUTIONS
                                </h3>
                                <h5 style={{ textAlign: 'center' }} className="mb-3">
                                  Social Security Act, 1977, Housing and Social Development Levy
                                  Act, 1997, and the Protection of Employment Act, 1986
                                </h5>
                                <p className="p">
                                  NB. To be used when reporting payments related to
                                  <b>
                                    <span className="custom_font">Employees.</span>
                                  </b>
                                </p>
                                <p className="c_style">
                                  (This form is in quadruplicate. Please read these notes
                                  carefully.)
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
                                              <> {previewData?.data?.company_name}</>
                                            ) : (
                                              <> {previewData?.data?.companyName}</>
                                            )}
                                          </span>
                                        </th>

                                        <th className="label-cell fix-width" colSpan="7">
                                          Trade Name{' '}
                                          <span className="add-bottom-border">
                                            {isSubmittedNill ? (
                                              <> {previewData?.data?.trade_name}</>
                                            ) : (
                                              <> {previewData?.data?.tradeName}</>
                                            )}
                                          </span>
                                        </th>

                                        <th className="label-cell text-end" colSpan="4">
                                          Employer&#39;s Registration No.&nbsp;
                                          <span className="add-full-border">
                                            {isSubmittedNill ? (
                                              <> {previewData?.data?.company_reg_no}</>
                                            ) : (
                                              <> {previewData?.data?.companyRegNo}</>
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
                                                <> {previewData?.data?.company_address}</>
                                              ) : (
                                                <> {previewData?.data?.companyAddress}</>
                                              )}
                                            </span>
                                          </span>
                                        </th>

                                        <th className="label-cell text-end" colSpan="4">
                                          Employees(s) &nbsp;
                                          <span className="add-full-border">
                                            {isSubmittedNill ? (
                                              <>&nbsp;</>
                                            ) : (
                                              <>
                                                {previewData?.data?.listc3ReportViewModel?.length}
                                              </>
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
                                            With this statement is a cheque and/or cash in respect
                                            of the Acts mentioned above for the month of:
                                          </span>{' '}
                                          <span className="add-bottom-adjust">
                                            {isSubmittedNill ? (
                                              <> {previewData?.data?.month_year}</>
                                            ) : (
                                              <> {previewData?.data?.currentMonth}</>
                                            )}
                                          </span>
                                        </th>
                                      </tr>

                                      {/* Row 4: Payment Breakdown */}
                                      <tr>
                                        <td
                                          colSpan="16"
                                          style={{ height: '10px', border: 'none', padding: 0 }}
                                        ></td>
                                      </tr>
                                      <tr>
                                        <th className="label-cell" colSpan="4">
                                          (1) Director, Social Security Board
                                          <span className="add-bottom-adjust">
                                            {isSubmittedNill ? (
                                              <>&nbsp;</>
                                            ) : (
                                              <>
                                                $
                                                {previewData?.data?.remitedDueMonth?.toFixed(2) ??
                                                  '0.00'}
                                              </>
                                            )}
                                          </span>
                                        </th>

                                        <th className="label-cell " colSpan="2"></th>
                                        <th className="label-cell " colSpan="4">
                                          (2) Accountant General
                                          <span className="add-bottom-adjust">
                                            {isSubmittedNill ? (
                                              <>&nbsp;</>
                                            ) : (
                                              <>
                                                $
                                                {previewData?.data?.accountGeneralTotal?.toFixed(
                                                  2,
                                                ) ?? '0.00'}
                                              </>
                                            )}
                                          </span>
                                        </th>

                                        <th className="label-cell " colSpan="2"></th>

                                        <th className="label-cell " colSpan="4">
                                          Total
                                          <span className="add-bottom-adjust">
                                            {isSubmittedNill ? (
                                              <>&nbsp;</>
                                            ) : (
                                              <>${previewData?.data?.total?.toFixed(2) ?? '0.00'}</>
                                            )}
                                          </span>
                                        </th>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                <div
                                  className="table-responsive mt-2"
                                  style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    border: 'none',
                                    boxShadow: 'none',
                                    margin: 0,
                                    padding: 0,
                                  }}
                                >
                                  <table
                                    className="table custom_tables table-hover table-bordered mb-0 white-space2 mb-1 report-table"
                                    style={{
                                      width: '100%',
                                      borderCollapse: 'collapse',
                                      border: 'none',
                                      boxShadow: 'none',
                                      margin: 0,
                                      padding: 0,
                                    }}
                                  >
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
                                          Put X in the Week(s) Worked or Week(s) Holiday/Other Pay
                                          was made
                                        </th>
                                        <th colSpan={7}>
                                          (6b) <br />
                                          In accordance with the pay Schedule indicated in Column 5,
                                          record Wages/Salaries in respect of the weeks worked or in
                                          the case of Holiday pay/Other Pay, record in the weeks for
                                          which the payment applies
                                        </th>
                                        <th rowSpan={2}>
                                          (7) <br />
                                          Total Wages/Salaries Paid for the month
                                        </th>
                                        <th rowSpan={2}>
                                          (8) <br />
                                          Deduct levy from Wages of employee. See note 9 for
                                          exemption
                                        </th>
                                        <th rowSpan={2}>
                                          (9) <br />
                                          Total So. Sec. 11% or 1% of Wages/Salaries of each
                                          employee. See note 8
                                        </th>
                                        <th style={{ minWidth: '150px' }} rowSpan={2}>
                                          (10) <br />
                                          Remarks
                                        </th>
                                      </tr>
                                      <tr>
                                        <th>1</th>

                                        <th>2</th>
                                        <th>3</th>
                                        <th>4</th>
                                        <th>5</th>
                                        <th>WK1</th>
                                        <th>WK2</th>
                                        <th>WK3</th>
                                        <th>WK4</th>
                                        <th>WK5</th>
                                        <th>HPay</th>
                                        <th>Bonus</th>
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
                                        : previewData?.data?.listc3ReportViewModel?.map(
                                            (row, index) => (
                                              <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{row.socialSecurityNo}</td>
                                                <td>{row.empName}</td>
                                                {/* <td>{row.appintDate || ''}</td> */}
                                                <td>
                                                  {row.appintDate &&
                                                  moment(
                                                    row.appintDate,
                                                    'DD-MM-YYYY',
                                                    true,
                                                  ).isValid()
                                                    ? moment(row.appintDate, 'DD-MM-YYYY').format(
                                                        'DD-MMM-YYYY',
                                                      )
                                                    : ''}
                                                </td>
                                                <td>{row.payPeriod}</td>
                                                <td className="text-center">
                                                  {row.firstWeekOfMonth || ''}
                                                </td>
                                                <td className="text-center">
                                                  {row.secondWeekOfMonth || ''}
                                                </td>
                                                <td className="text-center">
                                                  {row.thirdWeekOfMonth || ''}
                                                </td>
                                                <td className="text-center">
                                                  {row.fourWeekOfMonth || ''}
                                                </td>
                                                <td className="text-center">
                                                  {row.fiveWeekOfMonth || ''}
                                                </td>
                                                <td className=" td-text-align">
                                                  ${row.firstWeekOfSalary?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className=" td-text-align">
                                                  ${row.secondWeekOfSalary?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className=" td-text-align">
                                                  ${row.thirdWeekOfSalary?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className=" td-text-align">
                                                  ${row.fourWeekOfSalary?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className=" td-text-align">
                                                  ${row.fiveWeekOfSalary?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className=" td-text-align">
                                                  ${row.column1?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className=" td-text-align">
                                                  ${row.column2?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className=" td-text-align">
                                                  ${row.totalWages?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className=" td-text-align">
                                                  ${row.deductLeavyWages?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className=" td-text-align">
                                                  ${row.totalSocSec?.toFixed(2) || '0.00'}
                                                </td>
                                                <td>{row.remarks || ''}</td>
                                              </tr>
                                            ),
                                          )}

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
                                        <td className=" td-text-align" colSpan={1}>
                                          {isSubmittedNill ? (
                                            <>&nbsp;</>
                                          ) : (
                                            <>
                                              ${previewData?.data?.totalWages?.toFixed(2) ?? '0.00'}
                                            </>
                                          )}
                                        </td>
                                        <td className=" td-text-align">
                                          {isSubmittedNill ? (
                                            <>&nbsp;</>
                                          ) : (
                                            <>
                                              $
                                              {previewData?.data?.totalDeductLeavy?.toFixed(2) ??
                                                '0.00'}
                                            </>
                                          )}
                                        </td>
                                        <td colSpan={1} rowSpan={6}></td>
                                        <td rowSpan={9} className="text-center">
                                          <span className="text_decoration">
                                            FOR OFFICIAL USE ONLY
                                          </span>
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
                                                <i className="mdi mdi-check-circle text-success" />{' '}
                                                Yes
                                              </>
                                            ) : (
                                              <>
                                                <i className="fa fa-times-circle text-danger" /> No
                                              </>
                                            )}
                                            <br />
                                            <br />
                                            {isPaidStatus && (
                                              <span>
                                                Receipt No. <br />{' '}
                                                {previewData?.data?.receiptNumber}
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
                                        <td className=" td-text-align">
                                          {isSubmittedNill ? (
                                            <>&nbsp;</>
                                          ) : (
                                            <>
                                              $
                                              {previewData?.data?.wagesLevyContribution?.toFixed(
                                                2,
                                              ) ?? '0.00'}
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
                                        <td className=" td-text-align">
                                          {isSubmittedNill ? (
                                            <>&nbsp;</>
                                          ) : (
                                            <>
                                              ${previewData?.data?.servayance?.toFixed(2) ?? '0.00'}
                                            </>
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
                                        <td className=" td-text-align">
                                          <span
                                            className={
                                              Number(previewData?.data?.totalLevyEEPenalty) > 1
                                                ? 'text-danger'
                                                : ''
                                            }
                                          >
                                            {isSubmittedNill ? (
                                              <>&nbsp;</>
                                            ) : (
                                              <>
                                                $
                                                {Number(
                                                  previewData?.data?.totalLevyEEPenalty || 0,
                                                ).toFixed(2)}
                                              </>
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
                                        <td className=" td-text-align">
                                          <span
                                            className={
                                              Number(previewData?.data?.servayancePePenalty) > 1
                                                ? 'text-danger'
                                                : ''
                                            }
                                          >
                                            {isSubmittedNill ? (
                                              <>&nbsp;</>
                                            ) : (
                                              <>
                                                $
                                                {Number(
                                                  previewData?.data?.servayancePePenalty || 0,
                                                ).toFixed(2)}
                                              </>
                                            )}
                                          </span>
                                        </td>
                                        {/* <td colSpan={1}></td> */}
                                      </tr>
                                      <tr className="new_remove">
                                        <td className="borders" colSpan={18}>
                                          <div className="man_flex">
                                            <div className="right_border">
                                              f) Total Accountant General
                                            </div>
                                            <div
                                              className="left
                              -border"
                                            >
                                              <div className="borde_down"></div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className=" td-text-align">
                                          <span className="">
                                            {isSubmittedNill ? (
                                              <>&nbsp;</>
                                            ) : (
                                              <>
                                                $
                                                {previewData?.data?.accountGeneralTotal?.toFixed(
                                                  2,
                                                ) ?? '0.00'}
                                              </>
                                            )}
                                          </span>
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
                                        <td className=" td-text-align" colSpan={1}>
                                          {isSubmittedNill ? (
                                            <>&nbsp;</>
                                          ) : (
                                            <>
                                              $
                                              {previewData?.data?.totalSocSec?.toFixed(2) ?? '0.00'}
                                            </>
                                          )}
                                        </td>
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
                                        <td className=" td-text-align" colSpan={1}>
                                          <span
                                            className={
                                              Number(previewData?.data?.finedueMonth) > 1
                                                ? 'text-danger'
                                                : ''
                                            }
                                          >
                                            {isSubmittedNill ? (
                                              <>&nbsp;</>
                                            ) : (
                                              <>
                                                $
                                                {Number(
                                                  previewData?.data?.finedueMonth || 0,
                                                ).toFixed(2)}
                                              </>
                                            )}
                                          </span>
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
                                        <td className=" td-text-align" colSpan={1}>
                                          {isSubmittedNill ? (
                                            <>&nbsp;</>
                                          ) : (
                                            <>
                                              $
                                              {previewData?.data?.remitedDueMonth?.toFixed(2) ??
                                                '0.00'}
                                            </>
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <p className="stylenew">
                                    I/We hereby certify that the particulars stated above are true
                                    and correct to the best of my/our knowledge and belief.
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
                                            <span className="span_name">{/* {UserName} */}</span>
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
                                                previewData?.data?.date,
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
                      <Button
                        variant="secondary"
                        className="h-45 btn btn-light"
                        onClick={handleClose}
                      >
                        <i className="fas fa-times"></i> Close
                      </Button>
                      <Button color="success" onClick={handlePrint}>
                        <i className="dripicons-print" /> Print
                      </Button>
                      {canPrintPermission && canPrintDashboard ? (
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
                  {/* NW Model Popup start */}
                  <Modal isOpen={show2} size="xl" onHide={handleClose2}>
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
                                    <div ref={targetRef}>
                                      <div
                                        className="card-body add_custom"
                                        style={{ position: 'relative' }}
                                      >
                                        <h3 style={{ lineHeight: '131%', textAlign: 'center' }}>
                                          THE ST.CHRISTOPHER AND NEVIS - SOCIAL SECURITY BOARD
                                          <br /> STATEMENT OF WAGES AND CONTRIBUTIONS
                                        </h3>
                                        <h5 style={{ textAlign: 'center' }} className="mb-3">
                                          Social Security Act, 1977, Housing and Social Development
                                          Levy Act, 1997, and the Protection of Employment Act, 1986
                                        </h5>
                                        <p className="p">
                                          NB. To be used when reporting payments related to
                                          <b>
                                            <span className="custom_font">Employees.</span>
                                          </b>
                                        </p>
                                        <p className="c_style">
                                          (This form is in quadruplicate. Please read these notes
                                          carefully.)
                                        </p>
                                        <div className="row" style={{ padding: '10px' }}>
                                          <table className="w-100 full-border no-border-table">
                                            <tbody>
                                              {/* Row 1: Company Details */}
                                              <tr>
                                                <th
                                                  className="label-cell fix-widthzero"
                                                  colSpan="7"
                                                >
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
                                                        <>
                                                          {previewNWDataList?.data?.company_address}
                                                        </>
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
                                                    With this statement is a cheque and/or cash in
                                                    respect of the Acts mentioned above for the
                                                    month of:
                                                  </span>{' '}
                                                  <span className="add-bottom-adjust">
                                                    {' '}
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
                                                          previewNWDataList?.data
                                                            ?.accountantGenreal || 0,
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
                                                <img
                                                  src={NillImage}
                                                  alt="Submitted"
                                                  width={20}
                                                  height={20}
                                                />
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
                                                          $
                                                          {item.deduct_leavy_wages?.toFixed(2) ??
                                                            '0.00'}
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
                                                <td className="text-end">
                                                  {isSubmittedNill ? (
                                                    <>&nbsp;</>
                                                  ) : (
                                                    <>
                                                      $
                                                      {Number(
                                                        previewNWDataList?.data?.totalFeesDir || 0,
                                                      ).toFixed(2)}
                                                    </>
                                                  )}
                                                </td>
                                                <td className="text-end">
                                                  {isSubmittedNill ? (
                                                    <>&nbsp;</>
                                                  ) : (
                                                    <>
                                                      $
                                                      {Number(
                                                        previewNWDataList?.data?.totalLevy || 0,
                                                      ).toFixed(2)}
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
                                                  <span
                                                    className="custom_border"
                                                    style={{ position: 'inherit' }}
                                                  >
                                                    II- PAID{' '}
                                                    {isPaidStatus ? (
                                                      <>
                                                        <i className="mdi mdi-check-circle text-success" />{' '}
                                                        Yes
                                                      </>
                                                    ) : (
                                                      <>
                                                        <i className="fa fa-times-circle text-danger" />{' '}
                                                        No
                                                      </>
                                                    )}
                                                  </span>
                                                  <br />
                                                  {isPaidStatus && (
                                                    <span>
                                                      Receipt No. <br />
                                                      {previewNWDataList?.data?.receiptNumber}
                                                    </span>
                                                  )}
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
                                                  className={`text-end ${
                                                    Number(previewNWDataList?.data?.leavyPanelty) >
                                                    1
                                                      ? 'text-danger'
                                                      : ''
                                                  }`}
                                                >
                                                  {isSubmittedNill ? (
                                                    <>&nbsp;</>
                                                  ) : (
                                                    <>
                                                      $
                                                      {Number(
                                                        previewNWDataList?.data?.leavyPanelty || 0,
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
                                                <td className="text-end">
                                                  {isSubmittedNill ? (
                                                    <>&nbsp;</>
                                                  ) : (
                                                    <>
                                                      $
                                                      {Number(
                                                        previewNWDataList?.data
                                                          ?.accountantGenreal || 0,
                                                      ).toFixed(2)}
                                                    </>
                                                  )}
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                          <p>
                                            I/We hereby certify that the particulars stated above
                                            are true and correct to the best of my/our knowledge and
                                            belief
                                          </p>
                                          <div
                                            className="container-fluid"
                                            style={{ paddingLeft: 0 }}
                                          >
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
                                                      {/* {UserName} */}
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
                                                  <p
                                                    style={{ marginBottom: 0, marginRight: '10px' }}
                                                  >
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
                      {/* <Button variant="secondary" color="h-45 btn btn-light" >
                        <i className="fas fa-times"></i> Closes
                      </Button> */}
                      <Button
                        variant="secondary"
                        className="h-45 btn btn-light"
                        onClick={handleClose2}
                      >
                        <i className="fas fa-times"></i> Close
                      </Button>
                      <Button color="success" onClick={handlePrint}>
                        <i className="dripicons-print" /> Print
                      </Button>
                      {canPrintNWDirectorPayroll && canPrintDashboard ? (
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
                  {/* NW Model Popup End */}
                  {/* container-fluid */}
                </div>
                {/* End Page-content */}
                {/*      <footer class="footer bg-light px-lg-4">
          <div class="container-fluid">
              <div class="row">
                  <div class="col-sm-8">
                      <ul class="nav navbar-brand">
                          <li class="me-4 text-white f-14">  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 34 34" fill="none">
                              <path d="M27.2348 21.5771L23.6683 21.1699C23.249 21.1207 22.8239 21.1671 22.425 21.3057C22.0262 21.4443 21.6639 21.6716 21.3655 21.9703L18.7819 24.5539C14.7961 22.5262 11.5563 19.2864 9.52867 15.3006L12.1263 12.703C12.7301 12.0992 13.025 11.2567 12.9267 10.4002L12.5195 6.86179C12.4402 6.1767 12.1115 5.54474 11.5962 5.08639C11.0809 4.62804 10.4149 4.37534 9.72525 4.37647H7.2961C5.70942 4.37647 4.38953 5.69636 4.48782 7.28303C5.23202 19.2743 14.8223 28.8505 26.7995 29.5947C28.3862 29.693 29.7061 28.3731 29.7061 26.7865V24.3573C29.7201 22.9391 28.653 21.7456 27.2348 21.5771Z" fill="#fff"/>
                            </svg> +1 (869) 465-2535</li>
                           <li class="me-4 text-white f-14"><i class="fas fa-map-marker-alt text-white pe-1"></i> P.O. Box 79 Bay Road, Basseterre St. Kitts</li>
                            <li class="text-white f-14"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 34 34" fill="none">
                              <path d="M28.1641 5.7666H5.69792C4.15337 5.7666 2.90369 7.03032 2.90369 8.57487L2.88965 25.4245C2.88965 26.969 4.15337 28.2328 5.69792 28.2328H28.1641C29.7086 28.2328 30.9724 26.969 30.9724 25.4245V8.57487C30.9724 7.03032 29.7086 5.7666 28.1641 5.7666ZM27.6024 11.7342L17.6752 17.9405C17.2259 18.2213 16.6361 18.2213 16.1868 17.9405L6.25957 11.7342C6.11878 11.6551 5.99548 11.5484 5.89715 11.4203C5.79882 11.2922 5.72749 11.1455 5.68749 10.9891C5.64749 10.8327 5.63965 10.6698 5.66444 10.5102C5.68923 10.3507 5.74613 10.1978 5.83171 10.0609C5.91728 9.92395 6.02975 9.80582 6.1623 9.71362C6.29486 9.62142 6.44474 9.55708 6.60288 9.52449C6.76102 9.49189 6.92413 9.49173 7.08233 9.52399C7.24054 9.55626 7.39055 9.6203 7.5233 9.71222L16.931 15.5955L26.3387 9.71222C26.4715 9.6203 26.6215 9.55626 26.7797 9.52399C26.9379 9.49173 27.101 9.49189 27.2591 9.52449C27.4173 9.55708 27.5671 9.62142 27.6997 9.71362C27.8323 9.80582 27.9447 9.92395 28.0303 10.0609C28.1159 10.1978 28.1728 10.3507 28.1976 10.5102C28.2224 10.6698 28.2145 10.8327 28.1745 10.9891C28.1345 11.1455 28.0632 11.2922 27.9649 11.4203C27.8665 11.5484 27.7432 11.6551 27.6024 11.7342Z" fill="#fff"/>
                            </svg> pubinfo@socialsecurity.kn</li>
                          </ul>
                    
                  </div>
                  <div class="col-sm-4">
                      <div class="text-end d-none d-sm-block">
                         <p class=" f-14"> <span class="f-600">Environment:</span> V 4.0.0.2</p>

                  
                      </div>
                  </div>
              </div>
          </div>
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

        <Modal isOpen={isModalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Confirm Action</ModalHeader>
          <ModalBody>
            Do you want to import your list of employees based on your last C3 Submission from
            Social Security System?
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" className="btn-light" onClick={handleGoToAddEmployee}>
              No
            </Button>
            <Button disabled={loadingModal} color="primary" onClick={() => save({})}>
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
        <Modal isOpen={isModalSubmitC}>
          <ModalHeader>Confirm Action </ModalHeader>
          <ModalBody>
            Do you want to submit your C3? If you submit, you won&#39;t be able to edit it later.
            The edit button will be disabled.
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" className="btn-light" onClick={handleCancel}>
              No
            </Button>
            <Button color="primary" onClick={handleConfirmSubmit} disabled={loadingSubmit}>
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
        <Modal isOpen={isModalSubmit}>
          <ModalHeader>Confirm Action</ModalHeader>
          <ModalBody>
            Do you want to submit your C3? If you submit, you won&#39;t be able to edit it later.
            The edit button will be disabled.
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" className="btn-light" onClick={handleCancel}>
              No
            </Button>
            <Button
              color="primary"
              onClick={handleConfirmSubmitNotWorking}
              disabled={loadingSubmit}
            >
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
            <Button color="primary" onClick={CompanyCThreeExport} disabled={loadingExport}>
              {loadingExport ? (
                <>
                  <Spinner size="sm" /> Loading..
                </>
              ) : (
                <>Yes</>
              )}
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={isNWModalOpenExport} toggle={toggleModalNWExport}>
          <ModalHeader toggle={toggleModalNWExport}>Confirm Action</ModalHeader>
          <ModalBody>Do you want to Export this C3 ?</ModalBody>
          <ModalFooter>
            <Button color="secondary" className="btn-light" onClick={onCanceled}>
              No
            </Button>
            <Button color="primary" onClick={CompanyNWExport} disabled={loadingExport}>
              {loadingExport ? (
                <>
                  <Spinner size="sm" /> Loading..
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
