import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Label } from 'reactstrap';
import {
  getSelfEmployee,
  deleteSelfEmployee,
  ExportCThree,
} from '../../../../store/apps/selfEmployee/selfEmployeeContribution/SelfEmployeeContributionSlice';
import { clearMessage, setMessage } from '../../../../store/apps/message/MessageSlice';
import {
  getDashboardList,
  previewNWData,
} from '../../../../store/apps/selfEmployee/dashboard/SelfDashboardSlice';
import ReportLogo from '../../../../assets/images/users/Reportlogo.jpg';
import Loader from '../../../../layouts/loader/Loader';

const SelfEmployeeContribution = () => {
  const [loading, setLoading] = useState(false);
  const companyId = localStorage.getItem('companyId');
  const CompanyId = localStorage.getItem('companyId');
  const userId = localStorage.getItem('userID');
  const userName = localStorage.getItem('userId');
  const userPassword = localStorage.getItem('userPassword');
  const UserName = localStorage.getItem('userName');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles.find(
    (role) => role.description === 'SELF EMPLOYEE CONTRIBUTION',
  );
  const canAddSElfEmployee = employerPermission?.addPermission;
  const canEditSElfEmployee = employerPermission?.updatePermission;
  const canDeleteSElfEmployee = employerPermission?.deletePermission;
  const canViewSElfEmployee = employerPermission?.viewPermission;
  const canPreviewSelfEmployee = employerPermission?.is_preview;
  const canPrintSelfEmployee = employerPermission?.is_Print;
  const canSubmittedSelfEmployee = employerPermission?.is_Submitted;

  const DashboardPermission = savedRoles.find((role) => role.description === 'DASHBOARD');

  const canEditDashboard = DashboardPermission?.updatePermission;

  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.messageReducer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpens, setIsModalOpens] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [exportItems, setExportItems] = useState(null);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleModal1 = () => setIsModalOpen(!isModalOpens);
  const { SelfEmployeeData, loading: isLoading } = useSelector(
    (state) => state.selfEmployeeContributionSlice,
  );
  const { DashboardData, previewNWDataList } = useSelector((state) => state.selfDashboardSlice);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);

  useEffect(() => {
    if (CompanyId) {
      dispatch(getDashboardList({ CompanyId }));
    }
  }, []);

  useEffect(() => {
    if (canViewSElfEmployee === false) {
      navigate('/login');
    }
  }, [canViewSElfEmployee, navigate]);

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



  const handleShow2 = (headerID, periodYear, periodMonthName) => {
    const monthIndexMap = {
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

    // Convert month name to index
    const periodMonth = monthIndexMap[periodMonthName] ?? null;

    // Ensure it's a valid number before dispatching
    if (periodMonth === null) {
      console.error('Invalid month name:', periodMonthName);
      return;
    }

    dispatch(
      previewNWData({
        headerId: headerID,
        year: periodYear, // Ensure year is a number
        monthNo: Number(periodMonth), // Ensure monthNo is a number
      }),
    );

    setShow2(true);
  };

  const deleteSelfEmployees = (headerID) => {
    setDeleteItem(headerID); // Store the employeeID in state
    setIsModalOpen(true); // Open the modal
  };

  const deleteSelfEmployeeContribution = () => {
    if (!deleteItem) return;
    dispatch(deleteSelfEmployee(deleteItem))
      .unwrap()
      .then((response) => {
        console.log('Deleted successfully:', response);
        dispatch(getSelfEmployee({ companyId }));
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
        setIsModalOpen(false);
      });
  };

  const isSelfEmployeeSubmitted = (headerID, regNo, pMonth, periodYear) => {
    setExportItems({
      SSNofEmp: regNo, // Adjusted to match API parameter names
      Headerid: headerID,
      period_Month: pMonth, // Keep as API expects
      Period_year: periodYear, // Keep as API expects
      companyId,
      UserLoginID: userName,
      User_Password: userPassword,
      userId,
    });

    setIsModalOpens(true);
  };



  const isSubmitC3 = async () => {
    if (!exportItems) return;
    setLoading(true);
    try {
      await dispatch(ExportCThree(exportItems)).unwrap();
      dispatch(getSelfEmployee({ companyId }));
      // Close modal
      setIsModalOpens(false);

      // CSV export logic removed
    } catch (error) {
      console.error('Error during ExportCThree:', error);
    } finally {
      setLoading(false); // ✅ always runs
    }
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const onCanceled = () => {
    setIsModalOpens(false);
  };

  useEffect(() => {
    dispatch(getSelfEmployee({ companyId }));
  }, []);

  console.log('SelfEmployeeData', SelfEmployeeData);

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

  return (
    <>
      <Helmet>
        <title>Self Employee Contribution - C3Wizard</title>
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
         
           
            <li className="fw-medium"> Self Employee Contribution </li>
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
                          <div className="card-header py-2 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-8">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-user text-success pe-2" />
                                  Self Employee C3 Generation
                                </h4>
                              </div>
                              <div className="col-xl-4 text-end">
                                {canAddSElfEmployee ? (
                                  <Link to="/apps/addSelfEmployeeContribution">
                                    <Button
                                      className="btn btn-success waves-effect waves-light h-45"
                                      type="submit"
                                    >
                                      <i className="fas fa-plus pe-1" /> Generate C3
                                    </Button>
                                  </Link>
                                ) : (
                                  <button
                                    className="btn btn-secondary h-45"
                                    type="button"
                                    disabled
                                    style={{ opacity: 0.6 }}
                                  >
                                    <i className="fas fa-plus pe-1"></i> Generate C3
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table table-hover mb-0">
                                <thead>
                                  <tr className="border-b">
                                    {/* <th scope="row">Year</th> */}
                                    <th>Month</th>
                                    <th className="td-text-align">Wages</th>
                                    <th className="td-text-align">Contribution</th>
                                    <th className="td-text-align">Fines and Penalties</th>
                                    <th className="td-text-align">Total</th>
                                    <th className="td-pl-2">Date Of Creation</th>
                                    <th>Edit</th>
                                    <th>Submit C3</th>
                                    <th>Preview</th>
                                    <th>Delete</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* Check if there's data */}
                                  {SelfEmployeeData && SelfEmployeeData.length > 0 ? (
                                    // Get unique years from the data
                                    [
                                      ...new Set(SelfEmployeeData.map((item) => item.period_year)),
                                    ].map((year) => (
                                      <React.Fragment key={year}>
                                        {/* Display the year in the table header */}
                                        <tr className="bg-light">
                                          <td className="bg-light f-600 text-dark" colSpan="18">
                                            {/* Displaying the period_year dynamically */}
                                            {year}
                                          </td>
                                        </tr>

                                        {/* Render the rows for each year */}
                                        {SelfEmployeeData.filter(
                                          (item) => item.period_year === year,
                                        ).map((item) => (
                                          <tr key={item.headerID}>
                                            {/* <td>{item.period_year}</td> */}
                                            <td>{item?.period_Month}</td>
                                            <td className="td-text-align">
                                              ${item?.totaL_WAGES?.toFixed(2) ?? '0.00'}
                                            </td>
                                            <td className="td-text-align">
                                              ${item.totalsscontributions?.toFixed(2) ?? '0.00'}
                                            </td>
                                            <td className="td-text-align">
                                              ${item?.totalsspenalty?.toFixed(2) ?? '0.00'}
                                            </td>
                                            <td
                                              className={`td-text-align ${
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
                                              {moment(
                                                item.insert_Datetimeinfo,
                                                'DD-MM-YYYY',
                                              ).format('DD-MMM-YYYY')}
                                            </td>

                                            <td>
                                              {canEditSElfEmployee && canEditDashboard ? (
                                                <Link
                                                  to="/apps/updateSelfEmployeeContribution"
                                                  state={{ id: item.headerID }}
                                                >
                                                  <span className="badge bg-soft-success text-success">
                                                    <Icon.Edit size={20} />
                                                  </span>
                                                </Link>
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
                                            <td style={{ cursor: 'pointer' }}>
                                              {canSubmittedSelfEmployee ? (
                                                item?.is_submitted === true ? (
                                                  <button
                                                    className="btn waves-effect waves-light py-0 submitIcon"
                                                    type="button"
                                                    onClick={() =>
                                                      isSelfEmployeeSubmitted(
                                                        item.headerID,
                                                        item.regNo,
                                                        item.pMonth,
                                                        item.period_year,
                                                      )
                                                    }
                                                  >
                                                    <span
                                                      data-bs-toggle="tooltip"
                                                      data-bs-placement="top"
                                                      aria-label="Submit"
                                                      data-bs-original-title="Submit"
                                                    >
                                                      <i
                                                        className="mdi mdi-check-circle f-18"
                                                        aria-hidden="true"
                                                      />
                                                    </span>
                                                  </button>
                                                ) : (
                                                  <Button className="badge bg-soft-danger text-danger">
                                                    <Icon.X size={20} />
                                                  </Button>
                                                )
                                              ) : (
                                                <button
                                                  className="btn waves-light py-0 submitIcon1"
                                                  type="button"
                                                  style={{ cursor: 'not-allowed', opacity: 0.4 }}
                                                >
                                                  <span>
                                                    <i
                                                      className="mdi mdi-check-circle f-18"
                                                      aria-hidden="true"
                                                    />
                                                  </span>
                                                </button>
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
                                                      item.headerID,
                                                      item.period_year,
                                                      item.period_Month,
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
                                              {canDeleteSElfEmployee ? (
                                                <span
                                                  onClick={() => deleteSelfEmployees(item.headerID)}
                                                  className="badge bg-soft-danger text-danger"
                                                >
                                                  <Icon.Trash size={20} />
                                                </span>
                                              ) : (
                                                <span
                                                  className="badge bg-soft-secondary text-muted"
                                                  aria-hidden="true"
                                                  data-bs-toggle="tooltip"
                                                  data-bs-placement="top"
                                                  aria-label="Delete"
                                                  data-bs-original-title="No permission"
                                                  style={{ opacity: 0.5, pointerEvents: 'none' }}
                                                >
                                                  <i className="ti-trash f-20"></i>
                                                </span>
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </React.Fragment>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="8" className="text-center">
                                        No Records Found
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
        {/* Right Sidebar */}
      </div>

      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Action</ModalHeader>
        <ModalBody>
          Are you sure you want to permanently delete this self employee contribution
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={onCancel}>
            No
          </Button>
          <Button color="primary" onClick={deleteSelfEmployeeContribution}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>

     

      <Modal isOpen={isModalOpens} toggle={toggleModal1}>
        <ModalHeader toggle={toggleModal1}>Confirm Action</ModalHeader>
        <ModalBody>
          {' '}
          Do you want to submit your C3? If you submit, you won&#39;t be able to edit it later. The
          edit button will be disabled.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={onCanceled}>
            No
          </Button>

          <Button color="primary" onClick={isSubmitC3} disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" /> Loading
              </>
            ) : (
              <>Yes</>
            )}
          </Button>
        </ModalFooter>
      </Modal>

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
                                            <th rowSpan={2}> Self Employed Contribution</th>
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
                                              -----------------------------------------------------------------------------------------------------&gt;
                                            </td>
                                            <td className="text-end">
                                              $
                                              {previewNWDataList?.data?.[0]?.deductLeavyWages.toFixed(
                                                2,
                                              ) ?? '0.00'}
                                            </td>
                                            <td rowSpan={2}>
                                              {/* Receipt No. */}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td colSpan={5}>
                                              <b> b) Fines:</b>
                                              ------------------------------------------------------------------------------------------------------------------------&gt;
                                            </td>
                                            {/* <td className="text-end text-primary">
                                              $
                                              {previewNWDataList?.data?.[0]?.fine.toFixed(2) ??
                                                '0.00'}
                                            </td> */}
                                            <td
                                              className={`text-end ${
                                                previewNWDataList?.data?.[0]?.fine > 0
                                                  ? 'text-danger'
                                                  : 'text-black'
                                              }`}
                                            >
                                              $
                                              {(previewNWDataList?.data?.[0]?.fine ?? 0).toFixed(2)}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td colSpan={5}>
                                              <b> c) Grand Total:</b>
                                              ---------------------------------------------------------------------------------------------------------------&gt;
                                            </td>
                                            <td className="text-end">
                                              {' '}
                                              $
                                              {previewNWDataList?.data?.[0]?.grandTotal.toFixed(
                                                2,
                                              ) ?? '0.00'}
                                            </td>
                                            <td className="" />
                                          </tr>
                                        </tbody>
                                      </table>
                                      <p className="text-center">
                                        I hereby certify that the particulars stated above are true
                                        and correct <br />
                                        the best of my knowledge and belief
                                      </p>
                                    </div>
                                    <div className="row mt-3">
                                      <table className="w-100">
                                        <tbody>
                                          <tr>
                                            <td style={{ width: '45%', verticalAlign: 'top' }}>
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

                                            <td style={{ width: '10%' }}></td>

                                            <td style={{ width: '45%', verticalAlign: 'top' }}>
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
                                          </tr>
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
              Download PDF
            </Button>
          ) : (
            <Button color="secondary" style={{ cursor: 'not-allowed', opacity: 0.4 }}>
              Download PDF
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </>
  );
};
export default SelfEmployeeContribution;
