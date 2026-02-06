import * as Icon from 'react-feather';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Label } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNwDirectorPayroll,
  deleteNonDirectorPayroll,
  ViewPayrollDirector,
  PostNWSubmitC3Bulk,
  ImportC3Data,
} from '../../../store/apps/nonWorkingDirectory/NonWorkingDirectory';

import { previewNWData } from '../../../store/apps/dashboard/DashboardSlice';
import ReportLogo from '../../../assets/images/users/Reportlogo.jpg';
import Loader from '../../../layouts/loader/Loader';
import NillImage from '../../../assets/images/users/Nill.png';

import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';

const NwDirectorPayroll = () => {
  const [isSubmittedNill, setIsSubmittedNill] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const CompanyId = localStorage.getItem('companyId');
  const [isModalSubmit, setIsModalSubmit] = useState(false);
  const [selectedHeaderID, setSelectedHeaderID] = useState(null);
  const UserID = localStorage.getItem('userID');
  const [loadingHeaderId, setLoadingHeaderId] = useState(null);

  const { PayrollData, EditPayrollData, NWSubmitC3BulkData, loading } = useSelector(
    (state) => state.nonWorkingDirectorySlice,
  );
  const [importLoading, setImportLoading] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const { ContributionCount } = useSelector((state) => state.nonWorkingDirectorySlice);
  const { previewData } = useSelector((state) => state.dashboardSlice);
  const { previewNWDataList } = useSelector((state) => state.dashboardSlice);
  const { message, type } = useSelector((state) => state.messageReducer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null); // Store the item to be deleted
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'NW DIRECTOR PAYROLL');
  const canAddNWDirectorPayroll = employerPermission?.addPermission;
  const canEditNWDirectorPayroll = employerPermission?.updatePermission;
  const canDeleteNWDirectorPayroll = employerPermission?.deletePermission;
  const canViewNWDirectorPayroll = employerPermission?.viewPermission;
  const canPreviewNWDirectorPayroll = employerPermission?.is_preview;
  const canPrintNWDirectorPayroll = employerPermission?.is_Print;
  const canSubmittedNWDirectorPayroll = employerPermission?.is_Submitted;

  const employerPermission1 = savedRoles.find((role) => role.description === 'DASHBOARD');
  const canEditDashboard = employerPermission1?.updatePermission;
  const canPreviewDashboard = employerPermission1?.is_preview;
  const canPrintDashboard = employerPermission1?.is_Print;
  const canSubmittedDashboard = employerPermission1?.is_Submitted;

  useEffect(() => {
    if (canViewNWDirectorPayroll === false) {
      navigate('/login');
    }
  }, [canViewNWDirectorPayroll, navigate]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [myData, setMyData] = useState([]);
  const UserName = localStorage.getItem('userName');
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);

  const printRef = useRef();

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

  const handleShow = (headerID, isSubmitted) => {
    if (headerID && CompanyId) {
      setIsSubmittedNill(isSubmitted);
      dispatch(ViewPayrollDirector({ headerID, CompanyId }))
        .unwrap()
        .then((response) => {
          setShow(true);
        })
        .catch((error) => {
          console.error('Something went wrong:', error);
        });
    }
  };

  const deleteNonPayroll = (headerID) => {
    setDeleteItem(headerID); // Store the employeeID in state
    setIsModalOpen(true); // Open the modal
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    dispatch(getNwDirectorPayroll(CompanyId));
  }, []);

  const deleteNWDirectoryPayroll = () => {
    if (!deleteItem) return;
    dispatch(deleteNonDirectorPayroll(deleteItem))
      .unwrap()
      .then((response) => {
        dispatch(getNwDirectorPayroll(CompanyId));

        setIsModalOpen(false);
      })
      .catch((error) => {
        setIsModalOpen(false);
      });
  };

  useEffect(
    (headerID) => {
      if (headerID && CompanyId) {
        //  console.error('Something went wrong:',);
      }
    },
    [EditPayrollData, dispatch],
  );

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

  const [editeLoad, setEditeLoad] = useState(false);
  const [editActive, seteditActive] = useState('');

  function editc3(headerID, periodMonth, periodYear) {
    setEditeLoad(true);
    seteditActive(headerID);

    const monthMapping = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12',
    };

    const monthNo = monthMapping[periodMonth] || '00';

    dispatch(ViewPayrollDirector({ headerID, CompanyId, monthno: monthNo, Year: periodYear }))
      .unwrap()
      .then((response) => {
        navigate('/apps/director/generateC3', { state: response.EditPayrollData });
        setEditeLoad(false);
      })
      .catch((e) => {
        setEditeLoad(false);
        toast.error('something went wrong');
      });
  }

  const handleShow2 = async (headerID, month, Year, isSubmitted) => {
    setLoadingHeaderId(headerID);
    setIsSubmittedNill(isSubmitted);

    const updatedParams = {
      monthId: month,
      year: Year,
      companyId: parseInt(localStorage.getItem('companyId'), 10),
      c3HeaderId: headerID,
    };

    try {
      await dispatch(previewNWData(updatedParams)).unwrap();
      setShow(true);
    } catch (error) {
      console.error('Something went wrong:', error);
    } finally {
      setLoadingHeaderId(null); // end loading
    }
  };

  const handleSubmitC3 = ({ headerId1 }) => {
    setSelectedHeaderID({ headerId1 }); // store for later
    setIsModalSubmit(true); // open modal
  };

  const handleCancel = () => {
    setIsModalSubmit(false);
  };

  const handleConfirmSubmit = () => {
    setImportLoading(true);

    const requestData = {
      CompanyId: parseInt(localStorage.getItem('companyId'), 10) || 0,
      // headerId: selectedHeaderID,
      headerId: selectedHeaderID.headerId1,
      UserID: parseInt(localStorage.getItem('userID'), 10) || 0,
    };

    dispatch(PostNWSubmitC3Bulk(requestData))
      .unwrap()
      .then((response) => {
        dispatch(getNwDirectorPayroll(CompanyId));
        setIsModalSubmit(false);
      })
      .catch((error) => {
        console.error('Something went wrong:', error);
      })
      .finally(() => {
        setImportLoading(false);
      });
  };

  const handleExcelUpload = async (e) => {
    e.preventDefault();

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
    formData.append('userId', UserID);
    formData.append('file', excelFile);

    try {
      const res = await dispatch(ImportC3Data(formData)).unwrap();
      const successMsg = res?.message || res?.msg || '';

      if (
        successMsg.includes('C3 file processed successfully') ||
        successMsg.includes('Overwriting it will replace the existing C3') ||
        successMsg.includes('C3 has already been submitted for this month')
      ) {
        await dispatch(getNwDirectorPayroll(CompanyId));

        navigate('/apps/director/generateC3', {
          state: {
            uploadedData: res.uploadedDataResponse, // ✅ send the complete data block
            hideToggle: false,
          },
        });
      } else {
        toast.warn(successMsg || 'Unexpected response from server');
      }
    } catch (err) {
      console.error('Something went wrong:', err);
    }
  };

  // Not working action perform by anjani 08-05-2025

  return (
    <>
      <Helmet>
        <title>Non Working Director payroll- C3Wizard</title>
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
            <li className="fw-medium"> Non Working Director Payroll </li>
          </ul>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24"></div>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24"></div>
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-2 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-3 col-3 mb-2 mb-lg-0">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-user text-success pe-2" />
                                  NW Director Payroll
                                </h4>
                              </div>

                              <div className="col-xl-7 col-7">
                                <form
                                  className="d-flex flex-wrap align-items-center gap-2 d-none"
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
                                </form>
                              </div>

                              <div className="col-xl-2 col-2 text-lg-end ">
                                {canAddNWDirectorPayroll ? (
                                  <Link to="/apps/director/generateC3">
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
                                    <i className="fas fa-plus pe-1" /> Generate C3
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
                                    <th>Month</th>
                                    <th>Year</th>
                                    <th className="td-text-align1"> Wages</th>
                                    <th className="td-text-align1">Levy Contribution</th>
                                    <th className="td-text-align1">Fines and Penalties </th>
                                    <th className="td-pl-2"> Date of Creation</th>
                                    <th>Schedule</th>
                                    <th>Is Nil</th>
                                    <th>Edit</th>
                                    <th>Preview</th>
                                    <th>Delete</th>
                                    <th>Submit C3</th>
                                    {/* <th class="text-end">Actions</th> */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {PayrollData && PayrollData?.length > 0 ? (
                                    PayrollData?.map((item) => (
                                      <tr key={item}>
                                        <td>{item?.period_Month}</td>
                                        <td>{item?.period_year ?? 'N/A'}</td>
                                        <td className="td-text-align1">
                                          ${item?.totaL_WAGES?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align1">
                                          ${item?.totallevyeeemployee?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align1">
                                          ${item?.totallevyeepenalty?.toFixed(2) ?? '0.00'}
                                        </td>
                                        {/* <td>{item?.insert_Datetimeinfo? moment(item?.insert_Datetimeinfo).format('DD-MMM-YYYY') : 'N/A'}</td> */}
                                        <td className="td-pl-2">
                                          {moment(item.insert_Datetimeinfo, 'DD-MM-YYYY').format(
                                            'DD-MMM-YYYY',
                                          )}
                                        </td>
                                        <td>{item?.schedule_NO}</td>
                                        <td>
                                          {item.isNilReturn === true ? (
                                            <i className="fa fa-check-circle text-success" />
                                          ) : (
                                            <i className="fa fa-times-circle text-danger" />
                                          )}{' '}
                                        </td>
                                        <td>
                                          {canEditNWDirectorPayroll && canEditDashboard ? (
                                            <a
                                              //to="/apps/C3/Add-C3Generation"
                                              className="text-decoration-none"
                                            >
                                              <span
                                                className="badge bg-soft-success text-success"
                                                style={{
                                                  border: '1px solid #119310',
                                                }}
                                              >
                                                {editeLoad && editActive === item.headerID ? (
                                                  <Spinner color="success" size="sm">
                                                    Loading...
                                                  </Spinner>
                                                ) : (
                                                  <Icon.Edit
                                                    size={20}
                                                    onClick={() =>
                                                      editc3(
                                                        item.headerID,
                                                        item.period_Month,
                                                        item.period_year,
                                                      )
                                                    }
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
                                          {canPreviewNWDirectorPayroll && canPreviewDashboard ? (
                                            <a
                                              data-bs-toggle="modal"
                                              data-bs-target="#myModal3"
                                              className="badge bg-soft-primary text-primary f-18"
                                              data-bs-placement="top"
                                              title="Preview"
                                              onClick={() =>
                                                handleShow2(
                                                  item.headerID,
                                                  item.period_Month,
                                                  item.period_year,
                                                  item.isNilReturn,
                                                )
                                              }
                                            >
                                              {/* {loadingPreview ? (
                                                <i className="fas fa-spinner fa-spin" />
                                              ) : (
                                                <i className="fas fa-eye" />
                                              )} */}
                                              {loadingHeaderId === item.headerID ? (
                                                <Spinner color="dark" size="sm" />
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
                                          {canDeleteNWDirectorPayroll ? (
                                            <button
                                              type="button"
                                              className="badge bg-soft-danger text-danger"
                                            >
                                              <Icon.Trash
                                                size={20}
                                                onClick={() => deleteNonPayroll(item.headerID)}
                                              />
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
                                          {canSubmittedNWDirectorPayroll &&
                                          canSubmittedDashboard ? (
                                            item?.is_submitted ? (
                                              <button
                                                className="btn waves-effect waves-light py-0 submitIcon"
                                                type="button"
                                                onClick={() =>
                                                  handleSubmitC3({
                                                    headerId1: item.headerID,
                                                  })
                                                }
                                                title="Submitted"
                                              >
                                                <i
                                                  className="mdi mdi-check-circle f-18"
                                                  aria-hidden="true"
                                                />
                                              </button>
                                            ) : (
                                              <button
                                                className="btn waves-effect waves-light py-0 submitIcon"
                                                type="button"
                                                onClick={() =>
                                                  handleSubmitC3({
                                                    headerId1: item.headerID,
                                                  })
                                                }
                                                title="Not Submitted"
                                              >
                                                <i
                                                  className="mdi mdi-check-circle f-18"
                                                  aria-hidden="true"
                                                />
                                              </button>
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
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="9" className="text-center">
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

        <Modal isOpen={isModalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Confirm Action</ModalHeader>
          <ModalBody>
            Are you sure you want to permanently delete this Non Working Director Payroll
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" className="btn-light" onClick={onCancel}>
              No
            </Button>
            <Button color="primary" onClick={deleteNWDirectoryPayroll}>
              Yes
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={show} size="xl" onHide={handleClose}>
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
                                  With this statement is a cheque and/or cash in respect of the Acts
                                  mentioned above for the month of:
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
                              <th style={{ minWidth: '140px' }} rowSpan={2}>
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
                              : previewNWDataList?.data?.dirReportsList?.map((item, index) => (
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
                                    <td className="td-text-align">${item.deduct_leavy_wages}</td>
                                    <td>{item.remarks}</td>
                                  </tr>
                                ))}

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
                                  <> ${previewNWDataList?.data?.totalFeesDir}</>
                                )}
                              </td>
                              <td className="text-end">
                                {isSubmittedNill ? (
                                  <>&nbsp;</>
                                ) : (
                                  <> ${previewNWDataList?.data?.totalLevy}</>
                                )}
                              </td>
                              <td className="text-center" rowSpan={3}>
                                <span className="text_decoration">FOR OFFICIAL USE ONLY</span>
                                <br />
                                <br />
                                I- DATE RECEIVED
                                <br />
                                <br />
                                <span className="custom_border" style={{ position: 'inherit' }}>
                                  II- PAID <i className="fa fa-times-circle text-danger" /> No
                                </span>
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
                              <td className="text-end">
                                <span
                                  className={
                                    Number(previewNWDataList?.data?.leavyPanelty) > 1
                                      ? 'text-danger'
                                      : ''
                                  }
                                >
                                  {isSubmittedNill ? (
                                    <>&nbsp;</>
                                  ) : (
                                    <>
                                      {' '}
                                      $
                                      {Number(previewNWDataList?.data?.leavyPanelty || 0).toFixed(
                                        2,
                                      )}
                                    </>
                                  )}
                                </span>
                              </td>
                            </tr>
                            <tr className="new_remove">
                              <td className="borders" colSpan={9}>
                                <div className="man_flex">
                                  <div className="right_border">
                                    c) Total to due to the Accountant General{' '}
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
                                  <> ${previewNWDataList?.data?.accountantGenreal}</>
                                )}
                              </td>
                              {/* <td className="text-center">II- PAID YES NO</td> */}
                            </tr>
                          </tbody>
                        </table>
                        <p>
                          I/We hereby certify that the particulars stated above are true and correct
                          to the best of my/our knowledge and belief
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
                                    {moment(
                                      previewNWDataList?.data?.date,
                                      'MM/DD/YYYY h:mm:ss A',
                                    ).format('DD-MMM-YYYY')}
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
              Close
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

        <Modal isOpen={isModalSubmit}>
          <ModalHeader>Confirm Action</ModalHeader>
          <ModalBody>
            Do you want to submit your C3? If you submit, you won&#39;t be able to edit it later.
            The edit button will be disabled.
          </ModalBody>
          <ModalFooter>
            <Button className="btn-light" color="secondary" onClick={handleCancel}>
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
      </div>
    </>
  );
};
export default NwDirectorPayroll;
