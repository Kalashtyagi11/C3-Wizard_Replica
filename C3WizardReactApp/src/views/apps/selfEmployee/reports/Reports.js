import { Helmet } from 'react-helmet';
import { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Label, Spinner } from 'reactstrap';
import * as Icon from 'react-feather';
import {
  getContribution,
  ImportSubmitted,
  ImportSubmittedLatest,
} from '../../../../store/apps/selfEmployee/reports/ReportsSlice';
import {
  getReportList,
  getPreviewNWData,
  getDashboardList,
} from '../../../../store/apps/selfEmployee/dashboard/SelfDashboardSlice';
import { clearMessage, setMessage } from '../../../../store/apps/message/MessageSlice';
import formatDate, { formatDateDDMMMYYYY } from '../../../../helpers/dateFormater';
import PeriodSelectorWithState from '../../AdminDashboard/components/PeriodReportSelector';
import Paid from '../../../../assets/images/users/Paid.png';
import ReportLogo from '../../../../assets/images/users/Reportlogo.jpg';
import Loader from '../../../../layouts/loader/Loader';
import { previewNWData } from '../../../../store/apps/dashboard/DashboardSlice';

const Reports = () => {
  const [show, setShow] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [isPaidStatus, setIsPaidStatus] = useState(null);
  const [periodYear, setPeriodYear] = useState(null);
  const [periodMonth, setPeriodMonth] = useState(null);
  const UserPassword = localStorage.getItem('userPassword');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const UserName = localStorage.getItem('userName');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const navigate = useNavigate();
  const UserID = localStorage.getItem('userID');
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);

  const [params, setParams] = useState({
    month: null,
    year: null,
    companyId: parseInt(localStorage.getItem('companyId'), 10),
    c3HeaderId: null,
  });

  const handleClose = () => setShow(false);
  const dispatch = useDispatch();
  const companyId = localStorage.getItem('companyId');
  const CompanyId = localStorage.getItem('companyId');
  const { message, type } = useSelector((state) => state.messageReducer);
  const { ContributionCount } = useSelector((state) => state.reportSelfSlice);
  const {
    ReportData,
    PreviewData,
    loading: isLoading,
  } = useSelector((state) => state.selfDashboardSlice);
  const getDate = new Date();
  const [FMonth, setFMonth] = useState('');
  const [TMonth, setTMonth] = useState('');
  const [year, setYear] = useState('');
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles.find((role) => role.description === 'REPORTS');
  const canPreviewSelfEmployee = employerPermission?.is_preview;
  const canPrintSelfEmployee = employerPermission?.is_Print;
  const canViewSelfEmployee = employerPermission?.viewPermission;

  const [fromPeriod, setFromPeriod] = useState(null);
  const [toPeriod, setToPeriod] = useState(null);
  const [endPeriod, setEndPeriod] = useState(null);

  const [selectedCheckbox, setSelectedCheckbox] = useState('inlineCheckbox1');
  const handleCheckboxChange = (checkboxId) => {
    setSelectedCheckbox(checkboxId === selectedCheckbox ? null : checkboxId);
    setFromPeriod(null);
    setToPeriod(null);
    setEndPeriod(null);
  };

  const importSubmit = () => {
    if (fromPeriod && toPeriod && toPeriod < fromPeriod) {
      toast.error('To Period cannot be smaller than From Period!');
      return;
    }

    setLoading(true);

    const fromMonthFormatted = fromPeriod ? moment(fromPeriod).format('MM') : '01';
    const toMonthFormatted = toPeriod ? moment(toPeriod).format('MM') : '12';
    const selectedYear = fromPeriod ? moment(fromPeriod).format('YYYY') : new Date().getFullYear();
    const selectedEndYear = moment(toPeriod).format('YYYY');

    const payload = {
      MonthF: fromMonthFormatted,
      MonthTO: toMonthFormatted,
      Year: selectedYear,
      endYear: selectedEndYear,
      CompanyId,
      LoginID: UserName,
      UserID,
    };

    dispatch(ImportSubmitted(payload))
      .unwrap()
      .then((response) => {
        dispatch(getDashboardList({ CompanyId }));
      })
      .catch((err) => {
        console.error('Error Submit:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const importSubmitLatest = () => {
    setImportLoading(true); // start loader

    const payload = {
      companyId,
      LoginID: UserName,
      UserID,
    };

    dispatch(ImportSubmittedLatest(payload))
      .unwrap()
      .then((response) => {
        dispatch(getDashboardList({ CompanyId }));
      })
      .catch((err) => {
        console.error('Error Submit:', err);
      })
      .finally(() => {
        setImportLoading(false); // stop loader
      });
  };

  useEffect(() => {
    if (canViewSelfEmployee === false) {
      navigate('/login');
    }
  }, [canViewSelfEmployee, navigate]);

  // useEffect(() => {
  //   if (CompanyId) {
  //     dispatch(getReportList({ CompanyId }));
  //   }
  // }, [CompanyId]);

  useEffect(() => {
    const selectedYear = fromPeriod ? moment(fromPeriod).format('YYYY') : new Date().getFullYear();
    const selectedEndYear = endPeriod ? moment(endPeriod).format('YYYY') : new Date().getFullYear();

    if (CompanyId) {
      const fromMonthFormatted = fromPeriod ? moment(fromPeriod).format('MM') : '01';
      const toMonthFormatted = toPeriod ? moment(toPeriod).format('MM') : '12';

      dispatch(
        getReportList({
          CompanyId,
          MonthF: fromMonthFormatted,
          MonthTO: toMonthFormatted,
          Year: selectedYear,
          endYear: selectedEndYear,
        }),
      );
    }
  }, []);

  const handleShow2 = (headerId, currentYear, monthNo, ispaid) => {
    dispatch(getPreviewNWData({ headerId, year: currentYear, monthNo }));
    setShow2(true);
    setIsPaidStatus(ispaid);
  };

  const handleSearch = () => {
    if (fromPeriod && toPeriod && toPeriod < fromPeriod) {
      toast.error('To Period cannot be smaller than From Period!');
      return;
    }

    const fromMonthFormatted = fromPeriod ? moment(fromPeriod).format('MM') : '01';
    const toMonthFormatted = toPeriod ? moment(toPeriod).format('MM') : '12';
    const selectedYear = fromPeriod ? moment(fromPeriod).format('YYYY') : new Date().getFullYear();
    const selectedEndYear = toPeriod ? moment(toPeriod).format('YYYY') : new Date().getFullYear();

    setLoadingReport(true);

    dispatch(
      getReportList({
        CompanyId,
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
        console.error('Fetch error:', err);
        toast.error('Failed to fetch contribution data.');
      })
      .finally(() => {
        setLoadingReport(false);
      });
  };

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

  return (
    <>
      <Helmet>
        <title>Reports - C3Wizard</title>
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
            <li className="fw-medium"> Reports </li>
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
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24"></div>
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-3 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-8">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-file-alt pe-1" />
                                  Report
                                </h4>
                              </div>
                            </div>
                          </div>

                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-12 col-lg-12 col-xl-12">
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="inlineCheckbox1"
                                    defaultValue="option1"
                                    checked={selectedCheckbox === 'inlineCheckbox1'}
                                    onChange={() => handleCheckboxChange('inlineCheckbox1')}
                                  />
                                  <Label className="form-check-Label" htmlFor="inlineCheckbox1">
                                    Search C3
                                  </Label>
                                </div>
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="inlineCheckbox2"
                                    defaultValue="option2"
                                    checked={selectedCheckbox === 'inlineCheckbox2'}
                                    onChange={() => handleCheckboxChange('inlineCheckbox2')}
                                  />
                                  <Label className="form-check-Label" htmlFor="inlineCheckbox2">
                                    Import Submitted C3 (Based on Period)
                                  </Label>
                                </div>
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="inlineCheckbox3"
                                    defaultValue="option3"
                                    checked={selectedCheckbox === 'inlineCheckbox3'}
                                    onChange={() => handleCheckboxChange('inlineCheckbox3')}
                                  />
                                  <Label className="form-check-Label" htmlFor="inlineCheckbox3">
                                    Import Latest Submitted C3
                                  </Label>
                                </div>
                                {selectedCheckbox === 'inlineCheckbox3' && (
                                  <Button
                                    className="btn btn-success waves-effect waves-light h-45"
                                    type="submit"
                                    disabled={importLoading}
                                    onClick={() => importSubmitLatest()}
                                  >
                                    {importLoading ? (
                                      <>
                                        <Spinner size="sm" /> Import Latest Submitted C3..
                                      </>
                                    ) : (
                                      <>
                                        <i className="fas fa-download pe-1" /> Import Latest
                                        Submitted C3
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>

                            <div className="row mt-3">
                              {(selectedCheckbox === 'inlineCheckbox1' ||
                                selectedCheckbox === 'inlineCheckbox2') && (
                                <div className="col-lg-9">
                                  <div className="row">
                                    <PeriodSelectorWithState
                                      fromPeriod={fromPeriod}
                                      setFromPeriod={setFromPeriod}
                                      toPeriod={toPeriod}
                                      setToPeriod={setToPeriod}
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="col-md-3 col-lg-3 col-xl-3">
                                {/* <Label>&nbsp;</Label> */}
                                <div className="mb-3">
                                  {selectedCheckbox === 'inlineCheckbox2' && (
                                    <Button
                                      className="btn btn-success waves-effect waves-light h-45"
                                      type="submit"
                                      disabled={loading}
                                      onClick={() => importSubmit()}
                                      style={{
                                        height: '45px',
                                        minWidth: '100px',
                                        marginTop: '22px',
                                      }}
                                    >
                                      {loading ? (
                                        <>
                                          <Spinner size="sm" /> Import Submitted C3
                                        </>
                                      ) : (
                                        <>
                                          <i className="fas fa-download pe-1" />
                                          Import Submitted C3
                                        </>
                                      )}
                                    </Button>
                                  )}

                                  {selectedCheckbox === 'inlineCheckbox1' && (
                                    <Button
                                      onClick={handleSearch}
                                      disabled={loadingReport}
                                      // disabled={loading || !year || !FMonth || !TMonth}
                                      className="btn btn-success waves-effect waves-light h-45"
                                      type="submit"
                                      style={{
                                        height: '45px',
                                        minWidth: '100px',
                                        marginTop: '22px',
                                      }}
                                    >
                                      {loadingReport ? (
                                        <>
                                          <Spinner size="sm" /> Searching...
                                        </>
                                      ) : (
                                        <>
                                          <Icon.Search size={20} style={{ cursor: 'pointer' }} />{' '}
                                          Search
                                        </>
                                      )}
                                    </Button>
                                  )}
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
                                    <th className="td-text-align1">Contribution</th>
                                    <th className="td-text-align1">Fine</th>
                                    <th className="td-text-align1">Total</th>
                                    <th className="td-pl-2">Creation Date</th>
                                    <th>Preview</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {ReportData?.data?.dashboardddata &&
                                  ReportData?.data?.dashboardddata?.length > 0 ? (
                                    ReportData?.data?.dashboardddata?.map((item) => (
                                      <tr key={item.headerId}>
                                        <td>
                                          {item.is_submitted === true ? (
                                            <i className="fa fa-check-circle text-success" />
                                          ) : (
                                            <i className="fa fa-times-circle text-danger" />
                                          )}
                                          &nbsp;{item?.month ?? 'N/A'}
                                        </td>
                                        <td>{item?.year ?? 'N/A'}</td>
                                        <td className="td-text-align1">
                                          ${item?.totalWages?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align1">
                                          ${item?.countribution?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align1">
                                          ${item?.totalsspenalty?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td
                                          className={`td-text-align1 ${
                                            item?.isImportFromBEMA
                                              ? 'text-dark'
                                              : item?.ispaid
                                              ? 'text-success'
                                              : 'text-danger'
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
                  {/* container-fluid */}
                </div>
                {/* End Page-content */}
                <sidebar-barrrrr></sidebar-barrrrr>
              </div>
              {/* end main content*/}
            </div>
          </>
        )}
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
                                                  {PreviewData?.data?.[0]?.currentMonth}
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
                                          {PreviewData?.data?.[0]?.empName}{' '}
                                        </span>
                                      </p>
                                      <p style={{ textAlign: 'left' }} className="mb-2">
                                        <b>Social Security Number</b>{' '}
                                        <span className="s9">
                                          {' '}
                                          {PreviewData?.data?.[0]?.socialSecurityNo}
                                        </span>
                                      </p>
                                      <p style={{ textAlign: 'left' }} className="mb-2">
                                        <b>Address: (Location &amp; Box No.)</b>{' '}
                                        <span className="s9" style={{ width: '66%' }}>
                                          {PreviewData?.data?.[0]?.companyAddress}
                                        </span>
                                      </p>
                                      <p style={{ textAlign: 'left' }} className="mb-2">
                                        <b>Income Category Selected:</b>{' '}
                                        <span className="s9" style={{ width: '70%' }}>
                                          {PreviewData?.data?.[0]?.category_Type}
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
                                          ${PreviewData?.data?.[0]?.grandTotal.toFixed(2) ?? '0.00'}
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
                                                {PreviewData?.data?.[0]?.firstWeekOfMonth}
                                              </td>
                                              <td className="text-center">
                                                {PreviewData?.data?.[0]?.secondWeekOfMonth}
                                              </td>
                                              <td className="text-center">
                                                {PreviewData?.data?.[0]?.thirdWeekOfMonth}
                                              </td>
                                              <td className="text-center">
                                                {' '}
                                                {PreviewData?.data?.[0]?.fourthWeekOfMonth}
                                              </td>
                                              <td className="text-center">
                                                {' '}
                                                {PreviewData?.data?.[0]?.fifthWeekOfMonth}
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
                                                {PreviewData?.data?.[0]?.remarks}{' '}
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
                                                {PreviewData?.data?.[0]?.deductLeavyWages.toFixed(
                                                  2,
                                                ) ?? '0.00'}
                                              </td>
                                              <td rowSpan={2}>
                                                {isPaidStatus && <span> Receipt No. </span>}
                                                
                                                {isPaidStatus && (
                                                  <>{PreviewData?.data?.[0]?.receiptNumber}</>
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
                                              {/* <td className="text-end text-primary">
                                                ${PreviewData?.data?.[0]?.fine.toFixed(2) ?? '0.00'}
                                              </td> */}
                                              <td
                                                className={`text-end ${
                                                  PreviewData?.data?.[0]?.fine > 0
                                                    ? 'text-danger'
                                                    : 'text-black'
                                                }`}
                                              >
                                                ${(PreviewData?.data?.[0]?.fine ?? 0).toFixed(2)}
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
                                                {PreviewData?.data?.[0]?.grandTotal.toFixed(2) ??
                                                  '0.00'}
                                              </td>
                                              <td>
                                                {isPaidStatus && (
                                                  <>
                                                    <span> Paid on </span> <br />
                                                    <span>
                                                      {moment(
                                                        PreviewData?.data?.[0]?.receiptDate,
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
                                                    PreviewData?.data?.[0]?.date,
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
        {/* Popup End  */}
      </div>
    </>
  );
};
export default Reports;
