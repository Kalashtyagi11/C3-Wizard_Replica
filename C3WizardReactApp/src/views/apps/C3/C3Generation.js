import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import moment from 'moment';
import html2pdf from 'html2pdf.js';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap';
import Loader from '../../../layouts/loader/Loader';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import NillImage from '../../../assets/images/users/Nill.png';
import ReportLogo from '../../../assets/images/users/Reportlogo.jpg';

import {
  deletetCGeneration,
  editC3EmployeeListing,
  getCGeneration,
  submitC3,
  ImportC3Data,
} from '../../../store/apps/cGeneration/CGenerationSlice';

import { previewAllData } from '../../../store/apps/dashboard/DashboardSlice';
import ExcelUpload from '../component/ExcelUpload';

const C3Generation = () => {
  const location = useLocation();
  const printRef = useRef();
  const contentRef = useRef();
  const UserName = localStorage.getItem('userName');
  const [showUpload, setShowUpload] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isSubmittedNill, setIsSubmittedNill] = useState(false);
  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);
  const UserId = parseInt(localStorage.getItem('userID'), 10);
  const CompanyId = localStorage.getItem('companyId');
  const UserID = localStorage.getItem('userID');
  const [isModalC3Exists, setIsModalC3Exists] = useState(false);
  const [existingC3Msg, setExistingC3Msg] = useState('');
  const navigate = useNavigate();
  const [C3ActionType, setC3ActionType] = useState('');

  const [importLoading, setImportLoading] = useState(false);
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.messageReducer);
  const { GenerationList, loading } = useSelector((state) => state.cGenerationSlice || {});
  const { previewData } = useSelector((state) => state.dashboardSlice);
  const [isModalSubmit, setIsModalSubmit] = useState(false);
  const [selectedHeaderID, setSelectedHeaderID] = useState(null);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  // const [excelFile, setExcelFile] = useState(null);
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'C3 GENERATION');
  const canAddC3Generation = employerPermission?.addPermission;
  const canEditC3Generation = employerPermission?.updatePermission;
  const canDeleteC3Generation = employerPermission?.deletePermission;
  const canViewC3Generation = employerPermission?.viewPermission;
  const canPreviewC3Generation = employerPermission?.is_preview;
  const canPrintC3Generation = employerPermission?.is_Print;
  const canSubmittedC3Generation = employerPermission?.is_Submitted;
  const employerPermission1 = savedRoles.find((role) => role.description === 'DASHBOARD');
  const canEditDashboard = employerPermission1?.updatePermission;
  const canPreviewDashboard = employerPermission1?.is_preview;
  const canPrintDashboard = employerPermission1?.is_Print;
  const canSubmittedDashboard = employerPermission1?.is_Submitted;
  const showUploadButton = location.pathname.includes('/ImportC3');
  const showGenerate = location.pathname.includes('/C3Generation');

  useEffect(() => {
    if (canViewC3Generation === false) {
      navigate('/login');
    }
  }, [canViewC3Generation, navigate]);

  useEffect(() => {
    dispatch(getCGeneration(CompanyId));
  }, []);

  useEffect(() => {
   
  }, [GenerationList]);

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const onConfirm = () => {
    toggleModal();
  };

  const onCancel = () => {
    toggleModal();
  };
  const [deleteItem, setDelete] = useState('');

  function deleteC3Modal(id) {
    setIsModalOpen(!isModalOpen);
    setDelete(id);
  }

  function deleteC3Api() {
    dispatch(deletetCGeneration(deleteItem))
      .unwrap()
      .then((response) => {
        toast.success(response.c3DeleteResponse.message);
        dispatch(getCGeneration(CompanyId));
        setIsModalOpen(!isModalOpen);
      });
  }

  const [show, setShow] = useState(false);
  const [reportLoad, setreportLoad] = useState(false);
  const [activeHeaderId, setactiveHeaderId] = useState('');
  const handleShow = (month, year, companyId, c3HeaderId, isSubmitted) => {
    setreportLoad(true);
    setactiveHeaderId(c3HeaderId);
    setIsSubmittedNill(isSubmitted);
    dispatch(previewAllData({ monthName: month, year, companyId: CompanyId, c3HeaderId }))
      .unwrap()
      .then((response) => {
        setShow(true);
        setreportLoad(false);
      })
      .catch((e) => {
        setreportLoad(false);
      });
  };

  const handleClose = () => setShow(false);

  const [params, setParams] = useState({
    month: 2,
    year: 2025,
    companyId: 1,
    c3HeaderId: 16,
  });

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

  const { toPDF, targetRef } = usePDF({
    filename: 'SocialSecurityReport.pdf',
    page: { margin: Margin.SMALL, orientation: 'landscape' },
  });

  const handleExcelUpload = async (excelFile) => {
    // e.preventDefault();

    if (!excelFile) {
      toast.error('Please select a C3 file');
      return;
    }

    const allowedExtensions = ['.c3'];
    const fileName = excelFile.name.toLowerCase();
    const isValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidExtension) {
      toast.error('Invalid file type. Only .c3 files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('companyId', CompanyId);
    formData.append('userId', UserId);
    formData.append('file', excelFile);

    try {
      const res = await dispatch(ImportC3Data(formData)).unwrap();
      const successMsg = res?.message || res?.msg || '';

      if (
        successMsg.includes('C3 file processed successfully') ||
        successMsg.includes('Overwriting it will replace the existing C3') ||
        successMsg.includes('C3 has already been submitted for this month')
      ) {
        await dispatch(getCGeneration(CompanyId));
        // navigate('/apps/C3/Add-C3Generation');
        sessionStorage.setItem('clearPayDataOnLoad', 'true');
        navigate('/apps/C3/Add-C3Generation', {
          state: {
            uploadedData: res.uploadedDataResponse, // ✅ send the complete data block
            hideToggle: false,
            ImportFileDataC3: false,
            UploadedC3: false,
          },
        });
      } else {
        toast.warn(successMsg || 'Unexpected response from server');
      }
    } catch (err) {
        console.error('Something went wrong:', err);
    }
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

  const submitC3Api = (headerID) => {
    setSelectedHeaderID(headerID); // store for later
    setIsModalSubmit(true); // open modal
  };

  const handleCancel = () => {
    setIsModalSubmit(false);
  };

  const handleConfirmSubmit = () => {
    setImportLoading(true);
    const payload = {
      CompanyId,
      UserID,
      headerID: selectedHeaderID,
    };

    dispatch(submitC3(payload))
      .unwrap()
      .then((response) => {
        dispatch(getCGeneration(CompanyId));
        setIsModalSubmit(false);
      })
      .catch((error) => {
          console.error('Something went wrong:', error);
      })
      .finally(() => {
        setImportLoading(false);
        setIsModalSubmit(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>C3 Generation - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
        {/* ========== Left Sidebar Start ========== */}
        {/* Left Sidebar End */}
        <sidebar-barrrrrr></sidebar-barrrrrr>
        {/* ============================================================== */}
        {/* Start right Content here */}
        {/* ============================================================== */}
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
              <ul className="d-flex align-items-center gap-2 mt-3 list-unstyled">
                <li className="fw-medium">
                  <Link to="/dashboard" className="d-flex align-items-center gap-1 text-muted">
                    <i className="ti-home" />
                    Dashboard{' '}
                  </Link>
                </li>
                <li>-</li>
                <li className="fw-medium">
                  <span className="d-flex align-items-center gap-1 text-muted">C3</span>
                </li>
                <li>-</li>
                <li className="fw-medium">
                  {' '}
                  {showUploadButton ? 'Import  C3 File' : 'C3 Generation'}{' '}
                </li>
              </ul>
            </div>
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-2 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-3 col-3 mb-2 mb-lg-0">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-user text-success pe-2" />

                                  {showUploadButton ? 'Import  C3 File' : 'C3 Generation Lists'}
                                </h4>
                              </div>
                              <div className="col-md-6  ">
                                {/* <form
                                    className="d-flex flex-wrap align-items-center gap-2  "
                                    onSubmit={handleExcelUpload}
                                    encType="multipart/form-data"
                                  >
                                    <input
                                      type="file"
                                      accept=".C3"
                                      onChange={(e) => setExcelFile(e.target.files[0])}
                                      className="form-control"
                                      required
                                      style={{ maxWidth: '400px' }}
                                    />
                                    <button
                                      type="submit"
                                      className="btn btn-success waves-effect waves-light"
                                      style={{ height: '45px', minWidth: '100px' }}
                                    >
                                      <i className="fas fa-upload pe-1"></i> Upload C3 file
                                    </button>
                                  </form> */}
                              </div>

                              {showUploadButton && (
                                <div className="col-xl-3 col-3 text-lg-end ">
                                  <Button
                                    className="btn btn-success waves-effect waves-light"
                                    onClick={() => setShowUpload(!showUpload)}
                                  >
                                    <i className="fas fa-upload pe-1"></i> Import C3 File
                                  </Button>
                                </div>
                              )}
                              {showGenerate && (
                                <div className="col-xl-3 col-3 text-lg-end ">
                                  {canAddC3Generation ? (
                                    <Link
                                      className="btn btn-success waves-effect waves-light h-45"
                                      to="/apps/C3/Add-C3Generation"
                                    >
                                      <i className="fas fa-plus pe-1" />
                                      Generate C3{' '}
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
                              )}
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <ExcelUpload
                                isOpen={showUpload}
                                onClose={() => setShowUpload(false)}
                                onUpload={handleExcelUpload}
                              />
                            </div>
                            <div className="table-responsive">
                              <table className="table table-hover mb-0 white-space">
                                <thead>
                                  <tr className="border-b">
                                    <th scope="row">Month</th>
                                    <th>Year</th>
                                    <th className="td-text-align1"> Wages </th>
                                    <th className="td-text-align1">SS Contribution</th>
                                    <th className="td-text-align1">Levy Contribution </th>
                                    <th className="td-text-align1">Fines and Penalties</th>
                                    <th className="td-text-align1">Severance </th>

                                    <th className="td-pl-2">Creation Date</th>
                                    <th>Schedule</th>
                                    <th>Is Nil</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>Preview</th>
                                    <th>Submit C3</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {GenerationList.length > 0 ? (
                                    GenerationList.map((item) => (
                                      <tr>
                                        <td>
                                          {item.is_submitted === true ? (
                                            <i className="fa fa-check-circle text-success" />
                                          ) : (
                                            <i className="fa fa-times-circle text-danger" />
                                          )}{' '}
                                          {item.period_Month}
                                        </td>
                                        <td>{item.period_year}</td>
                                        <td className="td-text-align1">
                                          <b>$</b>
                                          {item.totaL_WAGES?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align1">
                                          <b>$</b>
                                          {item.totalsscontributions?.toFixed(2) ?? '0.00'}{' '}
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
                                          ${item?.totalSSBpenanlity?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align1">
                                          <b>$</b>
                                          {item.totalservayance?.toFixed(2) ?? '0.00'}
                                        </td>
                                        {/* <td>{item.insert_Datetimeinfo
                                                                              ? moment(item.insert_Datetimeinfo).format('DD-MMM-YYYY')
                                                                              : 'N/A'}</td> */}
                                        <td className="td-pl-2">
                                          {moment(item.insert_Datetimeinfo, 'DD-MM-YYYY').format(
                                            'DD-MMM-YYYY',
                                          )}
                                        </td>

                                        <td>{item.schedule_NO}</td>
                                        <td>
                                          {item.isNilReturn === true ? (
                                            <i className="fa fa-check-circle text-success" />
                                          ) : (
                                            <i className="fa fa-times-circle text-danger" />
                                          )}{' '}
                                        </td>
                                        <td>
                                          {canEditC3Generation && canEditDashboard ? (
                                            <a className="text-decoration-none">
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
                                            </a>
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
                                          {canDeleteC3Generation ? (
                                            <button
                                              type="button"
                                              className="badge bg-soft-danger text-danger"
                                              onClick={() => deleteC3Modal(item.headerID)}
                                            >
                                              <Icon.Trash size={20} />
                                            </button>
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
                                        <td>
                                          {canPreviewC3Generation && canPreviewDashboard ? (
                                            <a
                                              data-bs-toggle="modal"
                                              data-bs-target="#myModal3"
                                              className="badge bg-soft-primary text-primary f-18"
                                              data-bs-placement="top"
                                              title="Preview"
                                              onClick={() =>
                                                handleShow(
                                                  item.period_Month,
                                                  item.period_year,
                                                  localStorage.getItem('companyId'),
                                                  item.headerID,
                                                  item.isNilReturn,
                                                )
                                              }
                                            >
                                              {reportLoad && activeHeaderId === item.headerID ? (
                                                <Spinner color="dark" size="sm">
                                                  Loading...
                                                </Spinner>
                                              ) : (
                                                <i className="fas fa-eye" />
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
                                          {canSubmittedC3Generation && canSubmittedDashboard ? (
                                            <button
                                              className="btn waves-effect waves-light py-0 submitIcon"
                                              type="button"
                                              onClick={() => submitC3Api(item.headerID)}
                                            >
                                              <span
                                                className=""
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
                                            <button
                                              className="btn  waves-light py-0 submitIcon1"
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
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="14" className="text-center">
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
      </div>

      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Action</ModalHeader>
        <ModalBody>Are you sure you want to permanently delete this C3?</ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={onCancel}>
            No
          </Button>
          <Button color="primary" onClick={deleteC3Api}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>

      {/* PopUp Start   */}
      <Modal isOpen={show} size="xl" onHide={handleClose}>
        <ModalHeader toggle={handleClose}>
          <h2>Report</h2>
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div ref={targetRef} className="pdf-table">
                  <div className="card-body add_custom" style={{ position: 'relative' }}>
                    <h3 style={{ lineHeight: '131%', textAlign: 'center' }}>
                      THE ST.CHRISTOPHER AND NEVIS - SOCIAL SECURITY BOARD
                      <br /> STATEMENT OF WAGES AND CONTRIBUTIONS
                    </h3>
                    <h5 style={{ textAlign: 'center' }} className="mb-3">
                      Social Security Act, 1977, Housing and Social Development Levy Act, 1997, and
                      the Protection of Employment Act, 1986
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
                              <span className="p">(Location &amp; Box No. If address changed)</span>
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
                                <>${previewData?.data?.accountGeneralTotal?.toFixed(2) ?? '0.00'}</>
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
                        <span className="report_logo">
                          <img src={ReportLogo} alt="ReportLogo" />
                        </span>
                        {isSubmittedNill && (
                          <span className="Paid_Image">
                            <img src={NillImage} alt="Submitted" width={20} height={20} />
                          </span>
                        )}
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
                            <th colSpan={7}>
                              (6b) <br />
                              In accordance with the pay Schedule indicated in Column 5, record
                              Wages/Salaries in respect of the weeks worked or in the case of
                              Holiday pay/Other Pay, record in the weeks for which the payment
                              applies
                            </th>
                            <th rowSpan={2}>
                              (7) <br />
                              Total Wages/Salaries Paid for the month
                            </th>
                            <th rowSpan={2}>
                              (8) <br />
                              Deduct levy from Wages of employee. See note 9 for exemption
                            </th>
                            <th rowSpan={2}>
                              (9) <br />
                              Total So. Sec. 11% or 1% of Wages/Salaries of each employee. See note
                              8
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
                            : previewData?.data?.listc3ReportViewModel?.map((row, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{row.socialSecurityNo}</td>
                                  <td>{row.empName}</td>
                                  <td>
                                    {row.appintDate &&
                                    moment(row.appintDate, 'DD-MM-YYYY', true).isValid()
                                      ? moment(row.appintDate, 'DD-MM-YYYY').format('DD-MMM-YYYY')
                                      : ''}
                                  </td>
                                  <td>{row.payPeriod}</td>
                                  <td className="text-center">{row.firstWeekOfMonth || ''}</td>
                                  <td className="text-center">{row.secondWeekOfMonth || ''}</td>
                                  <td className="text-center">{row.thirdWeekOfMonth || ''}</td>
                                  <td className="text-center">{row.fourWeekOfMonth || ''}</td>
                                  <td className="text-center">{row.fiveWeekOfMonth || ''}</td>
                                  <td className="td-text-align">
                                    ${row.firstWeekOfSalary?.toFixed(2) || '0.00'}
                                  </td>
                                  <td className="td-text-align">
                                    ${row.secondWeekOfSalary?.toFixed(2) || '0.00'}
                                  </td>
                                  <td className="td-text-align">
                                    ${row.thirdWeekOfSalary?.toFixed(2) || '0.00'}
                                  </td>
                                  <td className="td-text-align">
                                    ${row.fourWeekOfSalary?.toFixed(2) || '0.00'}
                                  </td>
                                  <td className="td-text-align">
                                    ${row.fiveWeekOfSalary || '0.00'}
                                  </td>
                                  <td className="td-text-align">
                                    ${row.column1?.toFixed(2) || '0.00'}
                                  </td>
                                  <td className="td-text-align">
                                    ${row.column2?.toFixed(2) || '0.00'}
                                  </td>
                                  <td className="td-text-align">
                                    ${row.totalWages?.toFixed(2) || '0.00'}
                                  </td>
                                  <td className="td-text-align">
                                    ${row.deductLeavyWages?.toFixed(2) || '0.00'}
                                  </td>
                                  <td className="td-text-align">
                                    ${row.totalSocSec?.toFixed(2) || '0.00'}
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
                                <>${previewData?.data?.totalWages?.toFixed(2) ?? '0.00'}</>
                              )}
                            </td>
                            <td className="td-text-align">
                              {isSubmittedNill ? (
                                <>&nbsp;</>
                              ) : (
                                <>${previewData?.data?.totalDeductLeavy?.toFixed(2) ?? '0.00'}</>
                              )}
                            </td>
                            <td rowSpan={6} colSpan={1}></td>
                            <td rowSpan={9} className="text-center">
                              <span className="text_decoration">FOR OFFICIAL USE ONLY</span>
                              <br />
                              <br />
                              1- DATE RECEIVED
                              <br />
                              <br />
                              <span className="custom_border">
                                II- PAID <i className="fa fa-times-circle text-danger" /> No
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
                                  ${previewData?.data?.wagesLevyContribution?.toFixed(2) ?? '0.00'}
                                </>
                              )}
                            </td>
                            {/* <td colSpan={1}></td> */}
                          </tr>
                          <tr className="new_remove">
                            <td className="borders" colSpan={18}>
                              <div className="man_flex">
                                <div className="right_border">
                                  c) Employer&#39;s 1% of Wages for Severance Payments Contribution
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
                                <>${previewData?.data?.servayance?.toFixed(2) ?? '0.00'}</>
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
                            <td className="td-text-align">
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
                                <div className="right_border">
                                  f) Total (a) to (e) due to the Accountant General
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
                                <>${previewData?.data?.accountGeneralTotal?.toFixed(2) ?? '0.00'}</>
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
                                <>${previewData?.data?.totalSocSec?.toFixed(2) ?? '0.00'}</>
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
                            <td className="td-text-align" colSpan={1}>
                              <span
                                className={
                                  previewData?.data?.finedueMonth > 0 ? 'text-danger' : 'text-black'
                                }
                              >
                                {isSubmittedNill ? (
                                  <>&nbsp;</>
                                ) : (
                                  <>${(previewData?.data?.finedueMonth ?? 0).toFixed(2)}</>
                                )}
                              </span>
                            </td>
                          </tr>
                          <tr className="new_remove">
                            <td className="borders" colSpan={19}>
                              <div className="man_flex">
                                <div className="right_border">
                                  i) Total (g) and (h) (Social Security Remittance due for the
                                  month)
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
                                <span className="span_name">{/* {UserName} */}</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
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
          <Button variant="secondary" className="h-45 btn btn-light" onClick={handleClose}>
            <i className="fas fa-times"></i> Close
          </Button>
          <Button color="success" onClick={handlePrint}>
            <i className="dripicons-print" /> Print
          </Button>
          {canPrintC3Generation && canPrintDashboard ? (
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

      <Modal isOpen={isModalSubmit}>
        <ModalHeader>Confirm Action</ModalHeader>
        <ModalBody>
          Do you want to submit your C3? If you submit, you won&#39;t be able to edit it later. The
          edit button will be disabled.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={handleCancel}>
            No
          </Button>
          <Button color="primary" disabled={importLoading} onClick={handleConfirmSubmit}>
            {importLoading ? (
              <>
                <Spinner size="sm" /> Process..
              </>
            ) : (
              <>Yes</>
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* <Modal isOpen={isModalC3Exists}>
        <ModalHeader>Existing C3 Found</ModalHeader>
        <ModalBody>{existingC3Msg}</ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={() => setIsModalC3Exists(false)}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setIsModalC3Exists(false);

              handleConfirmSave();
            }}
          >
            <i className="fas fa-plus pe-1"></i>
            {C3ActionType === 'val1' ? 'Overwrite C3' : 'Generate New C3'}
          </Button>
        </ModalFooter>
      </Modal> */}
    </>
  );
};
export default C3Generation;
