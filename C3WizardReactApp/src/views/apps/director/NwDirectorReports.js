import { Helmet } from 'react-helmet';
import moment from 'moment';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Label, Spinner } from 'reactstrap';

//import { Label } from 'reactstrap';
import * as Icon from 'react-feather';
import {
  getContribution,
  ImportSubmitted,
  ImportSubmittedLatest,
} from '../../../store/apps/nonWorkingDirectory/NonWorkingDirectory';
import { previewNWData } from '../../../store/apps/dashboard/DashboardSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import formatDate, { formatDateDDMMMYYYY } from '../../../helpers/dateFormater';
import PeriodSelectorWithState from '../AdminDashboard/components/PeriodReportSelector';
import ReportLogo from '../../../assets/images/users/Reportlogo.jpg';
import Paid from '../../../assets/images/users/Paid.png';
import Loader from '../../../layouts/loader/Loader';
import NillImage from '../../../assets/images/users/Nill.png';

const Reports = () => {
  const [isSubmittedNill, setIsSubmittedNill] = useState(false);
  const [isPaidStatus, setIsPaidStatus] = useState(null);
  const navigate = useNavigate();
  const CompanyId = localStorage.getItem('companyId');
  const userId = localStorage.getItem('userID');
  const userName = localStorage.getItem('userId');
  const userPassword = localStorage.getItem('userPassword');
  const [loadingReport, setLoadingReport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [headerId, setHeaderId] = useState(null);
  const [periodYear, setPeriodYear] = useState(null);
  const [periodMonth, setPeriodMonth] = useState(null);
  const [fromPeriod, setFromPeriod] = useState(null);
  const [endPeriod, setEndPeriod] = useState(null);
  const [toPeriod, setToPeriod] = useState(null);
  const UserName = localStorage.getItem('userName');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'NW DIRECTOR REPORTS');
  const canPreviewNWDirectorPayrollC3Report = employerPermission?.is_preview;
  const canPrintNWDirectorPayrollReport = employerPermission?.is_Print;
  const canViewNWDirectorPayrollReport = employerPermission?.viewPermission;

  useEffect(() => {
    if (canViewNWDirectorPayrollReport === false) {
      navigate('/login');
    }
    
  }, [canViewNWDirectorPayrollReport, navigate]);

  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);

  const [selectedCheckbox, setSelectedCheckbox] = useState('inlineCheckbox1');
  const handleCheckboxChange = (checkboxId) => {
    setSelectedCheckbox(checkboxId === selectedCheckbox ? null : checkboxId);

    setFromPeriod(null);
    setEndPeriod(null);
    setToPeriod(null);
  };

  const [params, setParams] = useState({
    month: null,
    year: null,
    companyId: parseInt(localStorage.getItem('companyId'), 10),
    c3HeaderId: null,
  });

  const handleClose = () => setShow(false);
  const dispatch = useDispatch();
  const companyId = localStorage.getItem('companyId');
  const { message, type } = useSelector((state) => state.messageReducer);
  const { ContributionCount, loading: isLoading } = useSelector(
    (state) => state.nonWorkingDirectorySlice,
  );
  const { previewData } = useSelector((state) => state.dashboardSlice);
  const { previewNWDataList } = useSelector((state) => state.dashboardSlice);
  // const { previewNWDataList } = useSelector((state) => state.dashboardSlice);
  const getDate = new Date();
  const [Year, setYear] = useState(getDate.getFullYear().toString());
  const [MonthF, setMonthF] = useState('');
  const [MonthTO, setMonthTO] = useState('');

  const printRef = useRef();

  const { toPDF, targetRef } = usePDF({
    filename: 'SocialSecurityReport.pdf',
    page: { margin: Margin.SMALL, orientation: 'landscape' },
  });

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

  // This will get the list of months from the selected "From" month to December
  const getFilteredMonths = (fromMonth) => {
    return monthList.filter((month) => month.value >= fromMonth);
  };

  // useEffect(() => {
  //   if (companyId) {
  //     dispatch(getContribution({ companyId, MonthF, MonthTO, Year, endYear: 0 }));
  //   }
  // }, [Year, MonthF, MonthTO]);

  // -----new--added-by-Anjani-23-04-25

  useEffect(() => {
    const selectedYear = fromPeriod ? moment(fromPeriod).format('YYYY') : new Date().getFullYear();
    const selectedEndYear = endPeriod ? moment(endPeriod).format('YYYY') : new Date().getFullYear();

    if (companyId) {
      const fromMonthFormatted = fromPeriod ? moment(fromPeriod).format('MM') : '01';
      const toMonthFormatted = toPeriod ? moment(toPeriod).format('MM') : '12';

      dispatch(
        getContribution({
          companyId,
          ResultArea: 'R',
          MonthF: fromMonthFormatted,
          MonthTO: toMonthFormatted,
          Year: selectedYear,
          endYear: selectedEndYear,
        }),
      );
    }
  }, []);

  // const handleSearch = () => {
  //   if (!Year || Year === 'Select Year') {
  //     toast.error('Please select Year!');
  //     return;
  //   }
  //   if (!MonthF) {
  //     toast.error('Please select From Month!');
  //     return;
  //   }
  //   if (!MonthTO) {
  //     toast.error('Please select To Month!');
  //     return;
  //   }

  //   setLoadingReport(true); // Start loading

  //   dispatch(
  //     getContribution({
  //       companyId,
  //       ResultArea: 'R',
  //       MonthF,
  //       MonthTO,
  //       Year,
  //       endYear: 0,
  //     }),
  //   )
  //     .unwrap()
  //     .then((response) => {
  //       // Optional: handle success
  //     })
  //     .catch((error) => {
  //
  //       toast.error('Failed to fetch contribution data.');
  //     })
  //     .finally(() => {
  //       setLoadingReport(false); // Stop loading
  //     });
  // };

  const handleSearch = () => {
    // if (!fromPeriod) {
    //   toast.error('Please select From Period!');
    //   return;
    // }

    // // Validate toPeriod
    // if (!toPeriod) {
    //   toast.error('Please select To Period!');
    //   return;
    // }

    // if (toPeriod < fromPeriod) {
    //   toast.error('To Period cannot be smaller than From Period!');
    // }

    if (fromPeriod && toPeriod && toPeriod < fromPeriod) {
      toast.error('To Period cannot be smaller than From Period!');
      return; // 🔥 STOP execution if validation fails
    }

    const fromMonthFormatted = fromPeriod ? moment(fromPeriod).format('MM') : '01';
    const toMonthFormatted = toPeriod ? moment(toPeriod).format('MM') : '12';
    const selectedYear = fromPeriod ? moment(fromPeriod).format('YYYY') : new Date().getFullYear();
    const selectedEndYear = endPeriod ? moment(endPeriod).format('YYYY') : new Date().getFullYear();

    setLoadingReport(true);

    dispatch(
      getContribution({
        companyId,
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

  const [reportLoad, setreportLoad] = useState(false);
  const [activeHeaderId, setactiveHeaderId] = useState('');

  useEffect((headerID, month) => {
    if (headerID && month) {
      dispatch(previewNWData(headerID, month));
    }
  }, []); // dependencies

  const handleShow2 = (headerID, month, year, ispaid, isSubmitted) => {
    setIsPaidStatus(ispaid);
    setIsSubmittedNill(isSubmitted);

    const updatedParams = {
      monthId: month,
      year,
      companyId: parseInt(localStorage.getItem('companyId'), 10),
      c3HeaderId: headerID,
    };

    setParams(updatedParams);

    dispatch(previewNWData(updatedParams));
    setShow2(true);
  };

  const fetchContributionData = () => {
    const selectedYear = fromPeriod ? moment(fromPeriod).format('YYYY') : new Date().getFullYear();
    const selectedEndYear = endPeriod ? moment(endPeriod).format('YYYY') : new Date().getFullYear();
    const fromMonthFormatted = fromPeriod ? moment(fromPeriod).format('MM') : '01';
    const toMonthFormatted = toPeriod ? moment(toPeriod).format('MM') : '12';

    if (companyId) {
      dispatch(
        getContribution({
          companyId,
          ResultArea: 'R',
          MonthF: fromMonthFormatted,
          MonthTO: toMonthFormatted,
          Year: selectedYear,
          endYear: selectedEndYear,
        }),
      );
    }
  };

  const importSubmit = () => {
    // if (!fromPeriod) {
    //   toast.error('Please select From Period!');
    //   return;
    // }

    // // Validate toPeriod
    // if (!toPeriod) {
    //   toast.error('Please select To Period!');
    //   return;
    // }

    // if (toPeriod < fromPeriod) {
    //   toast.error('To Period cannot be smaller than From Period!');
    //   return;
    // }

    if (fromPeriod && toPeriod && toPeriod < fromPeriod) {
      toast.error('To Period cannot be smaller than From Period!');
      return; // 🔥 STOP execution if validation fails
    }

    setLoading(true);

    const fromMonthFormatted = fromPeriod ? moment(fromPeriod).format('MM') : '01';
    const toMonthFormatted = toPeriod ? moment(toPeriod).format('MM') : '12';
    const selectedYear = fromPeriod ? moment(fromPeriod).format('YYYY') : new Date().getFullYear();
    const selectedEndYear = endPeriod ? moment(endPeriod).format('YYYY') : new Date().getFullYear();

    const payload = {
      f_month: fromMonthFormatted,
      t_month: toMonthFormatted,
      // year: Year, // Keep as API expects
      Year: selectedYear,
      endYear: selectedEndYear,
      companyId,
      LoginID: userName,
      Password: userPassword,
      userId,
      // isTrue,
    };

    dispatch(ImportSubmitted(payload))
      .unwrap()
      .then((response) => {
        fetchContributionData(); // 🔁 Refetch after import
      })
      .catch((error) => {
        console.error('Something went wrong:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const importSubmitLatest = () => {
    setImportLoading(true);

    const payload = {
      companyId,
      LoginID: userName,
      Password: userPassword,
      userId,
      // isTrue,
    };

    dispatch(ImportSubmittedLatest(payload))
      .unwrap()
      .then((response) => {
        fetchContributionData(); // 🔁 Refetch after import
      })
      .catch((error) => {
        console.error('Something went wrong:', error);
      })
      .finally(() => {
        setImportLoading(false); // stop loader
      });
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

  return (
    <>
      <Helmet>
        <title>Non Working Director Report - C3Wizard</title>
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
              <Link to="/dashboard" className="d-flex align-items-center gap-1 text-muted">
                <i className="ti-home" />
                Dashboard{' '}
              </Link>
            </li>
            <li>-</li>
            {/* <li className="fw-medium">
              <span className="d-flex align-items-center gap-1 text-muted">NW</span>
            </li> */}
            <li>-</li>
            <li className="fw-medium"> Non Working Report </li>
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
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-3 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-8">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-file-alt pe-1" />
                                  Nw Director Reports
                                </h4>
                              </div>
                              {/*         <div class="col-xl-4 text-end">
                              <button class="btn btn-success waves-effect waves-light h-45" type="submit"><i class="fas fa-plus pe-1"></i> Add Employer</button>
                      </div> */}
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
                                        <Spinner size="sm" />
                                        &nbsp; Import Latest Submitted C3..
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
                                    {/* <div className="col-md-4 col-lg-4 col-xl-4">
                                  <div className="mb-3">
                                    <Label>
                                      Year <span className="text-danger">*</span>
                                    </Label>
                                    <div className="mb-3">
                                      <select
                                        id="month"
                                        name="month"
                                        className="form-select"
                                        onChange={(e) => {
                                          setYear(e.target.value);
                                        }}
                                        value={Year}
                                      >
                                        <option>Select Year</option>
                                        <option value={2022}>2022</option>
                                        <option value={2023}>2023</option>
                                        <option value={2024}>2024</option>
                                        <option value={2025}>2025</option>
                                        <option value={2026}>2026</option>
                                        <option value={2027}>2027</option>
                                        <option value={2028}>2028</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-xl-4">
                                  <div className="mb-3">
                                    <Label>From</Label>
                                    <select
                                      id="MonthF"
                                      name="MonthF"
                                      className="form-select"
                                      onChange={(e) => {
                                        setMonthF(e.target.value); 
                                        setMonthTO(''); 
                                      }}
                                      value={MonthF} 
                                    >
                                      <option value="">Select Month</option>
                                      {monthList.map((month) => (
                                        <option key={month.value} value={month.value}>
                                          {month.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-xl-4">
                                  <div className="mb-3">
                                    <Label>To</Label>
                                    <select
                                      id="MonthTO"
                                      name="MonthTO"
                                      className="form-select"
                                      onChange={(e) => setMonthTO(e.target.value)} 
                                      value={MonthTO} 
                                    >
                                      <option value="">Select Month</option>
                                      {getFilteredMonths(MonthF).map((month) => (
                                        <option key={month.value} value={month.value}>
                                          {month.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div> */}
                                    <PeriodSelectorWithState
                                      fromPeriod={fromPeriod}
                                      setFromPeriod={setFromPeriod}
                                      endPeriod={endPeriod}
                                      setEndPeriod={setEndPeriod}
                                      toPeriod={toPeriod}
                                      setToPeriod={setToPeriod}
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="col-md-3 col-lg-3 col-xl-3">
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
                                          {' '}
                                          <Icon.Search
                                            size={20}
                                            style={{ cursor: 'pointer' }}
                                          />{' '}
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
                                    {/* <th>Social Security</th> */}
                                    <th className="td-text-align1">Levy Contribution</th>
                                    <th className="td-text-align1">Fines and Penalties</th>
                                    <th className="td-text-align1">Total</th>
                                    <th className="td-pl-2">Creation Date</th>

                                    <th>Schedule</th>
                                    <th>Is Nil</th>
                                    <th>Preview</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {ContributionCount && ContributionCount?.length > 0 ? (
                                    ContributionCount?.map((item) => (
                                      <tr>
                                        {/* <td>
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
                                      {item?.month ?? 'N/A'}
                                    </td> */}
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
                                          &nbsp;{item.month ?? 'N/A'}
                                        </td>
                                        <td>{item?.year ?? 'N/A'}</td>
                                        <td className="td-text-align1">
                                          ${item?.totalWages?.toFixed(2) ?? '0.00'}
                                        </td>
                                        {/* <td>${item.totalsscontributions}</td> */}
                                        <td className="td-text-align1">
                                          ${item?.levy?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align1">
                                          ${item?.totallevyeepenalty?.toFixed(2) ?? '0.00'}
                                        </td>

                                        <td
                                          className={`td-text-align1 ${
                                            item?.isImportFromBEMA
                                              ? ''
                                              : item?.ispaid
                                              ? 'text-success'
                                              : 'text-danger'
                                          }`}
                                          style={{ fontWeight: '600' }}
                                        >
                                          ${Number(item?.payAmt ?? 0).toFixed(2)}
                                        </td>
                                        <td className="td-pl-2">
                                          {moment(item.createDate, 'DD-MM-YYYY').format(
                                            'DD-MMM-YYYY',
                                          )}
                                        </td>
                                        <td>{item?.schedule ?? 'NA'}</td>

                                        <td>
                                          {item.isNilReturn === true ? (
                                            <i className="fa fa-check-circle text-success" />
                                          ) : (
                                            <i className="fa fa-times-circle text-danger" />
                                          )}{' '}
                                        </td>
                                        <td>
                                          {canPreviewNWDirectorPayrollC3Report ? (
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
                                                  item.year,
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
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="8" className="text-center">
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
                                            <> {previewNWDataList?.data?.noOfDir}</>
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
                                              {' '}
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

                                      <th colSpan={5}>
                                        {' '}
                                        (4)
                                        <br />
                                        Record Director Fees If More Than Once Per Month
                                      </th>
                                      <th>
                                        {' '}
                                        (5)
                                        <br />
                                        Total Wages / Fee For The month
                                      </th>
                                      <th>
                                        (6)
                                        <br />
                                        levy Deduction
                                      </th>
                                      <th style={{ minWidth: '130px' }} rowSpan={2}>
                                        (7) <br />
                                        Remarks
                                      </th>
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
                                              <td className="td-text-align">${item.wageS1}</td>
                                              <td className="td-text-align">${item.wageS2}</td>
                                              <td className="td-text-align">${item.wageS3}</td>
                                              <td className="td-text-align">${item.wageS4}</td>
                                              <td className="td-text-align">${item.wageS5}</td>
                                              <td className="td-text-align">${item.total_wages}</td>
                                              <td className="td-text-align">
                                                ${item.deduct_leavy_wages}
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
                                          <div className="left-border">
                                            <div className="borde_down"></div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="text-end">
                                        {isSubmittedNill ? (
                                          <>&nbsp;</>
                                        ) : (
                                          <>${previewNWDataList?.data?.totalFeesDir}</>
                                        )}
                                      </td>
                                      <td className="text-end">
                                        {isSubmittedNill ? (
                                          <>&nbsp;</>
                                        ) : (
                                          <>${previewNWDataList?.data?.totalLevy}</>
                                        )}
                                      </td>
                                      {/* <td className="text-center" rowSpan={3}>
                                        <span className="text_decoration">
                                          FOR OFFICIAL USE ONLY
                                        </span>
                                        <br />
                                        <br />
                                        I- DATE RECEIVED
                                        <br />
                                        <br />
                                        <span
                                          className="custom_border"
                                          style={{ position: 'inherit' }}
                                        >
                                          II- PAID YES NO
                                        </span>
                                      </td> */}
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
                                      </td>
                                    </tr>
                                    <tr className="new_remove">
                                      <td className="borders" colSpan={9}>
                                        <div className="man_flex">
                                          <div className="right_border">
                                            b) Levy Penality for the month (if any){' '}
                                          </div>
                                          <div className="left-border">
                                            <div className="borde_down"></div>
                                          </div>
                                        </div>
                                      </td>
                                      <td
                                        className={`text-end ${
                                          Number(previewNWDataList?.data?.leavyPanelty) > 1
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
                                          <div className="left-border">
                                            <div className="borde_down"></div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="text-end">
                                        {isSubmittedNill ? (
                                          <>&nbsp;</>
                                        ) : (
                                          <>${previewNWDataList?.data?.accountantGenreal}</>
                                        )}
                                      </td>
                                      {/* <td className="text-center">II- PAID YES NO</td> */}
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
            {canPrintNWDirectorPayrollReport ? (
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
