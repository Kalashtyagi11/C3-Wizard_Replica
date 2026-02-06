import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useEffect, useState, useRef } from 'react';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import { debounce } from 'lodash';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Label,
  Table,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import draftImage from '../../../assets/images/users/draft.jpg';
import NillImage from '../../../assets/images/users/Nill.png';
import Paid from '../../../assets/images/users/Paid.png';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import ConfirmModal from '../component/ConfirmModel';
import {
  PreviewDirectorc3,
  GetNwCheckC3Created,
  OverwritingNWdirector,
} from '../../../store/apps/nonWorkingDirectory/NonWorkingDirectory';
import ReportLogo from '../../../assets/images/users/Reportlogo.jpg';

const PreviewNWDirectorPayroll = (previewDatapayload) => {
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPaidStatus, setIsPaidStatus] = useState(null);
  const [isSubmittedNill, setIsSubmittedNillLocal] = useState(null);
  const RegisterN = localStorage.getItem('reG_NUMBER');
  const TradeN = localStorage.getItem('TradeName');
  const EmployerName = localStorage.getItem('Name');
  const CompanyAddress = localStorage.getItem('Address');
  const UserName = localStorage.getItem('userName');
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState('');
  const [previewModalOpenNew, setPreviewModalOpenNew] = useState('');
  const [errorDataModalOpen, setErrorDataModalOpen] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const getDate = new Date();
  const [month, setMonth] = useState(getDate.getMonth());
  const [year, setyear] = useState(getDate.getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [showModalSave, setShowModalSave] = useState(false);

  const [headerId, setHeaderId] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  // const { data, apiLoadData } = location.state;

  const {
    data,
    previewShow,
    ValidateData,
    apiLoadData,
    ErrorDataAPI,
    isSubmittedNill: propIsSubmittedNill,
  } = previewDatapayload;

  

  const tableHeaders = ValidateData && ValidateData.length > 0 ? Object.keys(ValidateData[0]) : [];

  // Set the isSubmittedNill from props
  useEffect(() => {
    if (propIsSubmittedNill !== undefined) {
      setIsSubmittedNillLocal(propIsSubmittedNill);
    }
  }, [propIsSubmittedNill]);
  
  const { message, type } = useSelector((state) => state.messageReducer);
  const { previewData, NwCheckC3CreatedData } = useSelector(
    (state) => state.nonWorkingDirectorySlice,
  );
  

  const [saveLoad, setSaveLoad] = useState(false);

  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);

  const [show, setShow] = useState(false);
  const [showNew, setShowNew] = useState(false);
  // const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleClose2 = () => setShowNew(false);

  const printRef = useRef();
  const { toPDF, targetRef } = usePDF({
    filename: 'SocialSecurityReport.pdf',
    page: { margin: Margin.SMALL, orientation: 'landscape' },
  });

  const { toPDF: toPDF1, targetRef: targetRef1 } = usePDF({
    filename: 'ExceptionReport.pdf',
    page: { margin: Margin.SMALL, orientation: 'portrait' },
  });

  // function save() {
  //   setSaveLoad(true);
  //   const finalApiLoadData = { ...apiLoadData, is_preview: false, isSave: true, Is_SendBima: true };

  //   dispatch(PreviewDirectorc3(finalApiLoadData))
  //     .unwrap()
  //     .then((response) => {
  //       if (response?.PreviewDirectorc3Data?.status === true) {
  //         navigate('/apps/director/NwDirectorPayroll');
  //         setHeaderId(response.PreviewDirectorc3Data.data);
  //         setIsSubmitted(false);

  //       }

  //     })
  //     .catch((error) => {
  //       console.log('error', error);
  //     })
  //     .finally(() => {
  //       setSaveLoad(false);
  //     });
  // }

  // const saveAndSubmit = () => {
  //   setSaveLoad(true);

  //   const newData = {
  //     CompanyId: apiLoadData.CompanyId,
  //     Year: apiLoadData.Year,
  //     Month: apiLoadData.MonthName,
  //   };
  //   dispatch(GetNwCheckC3Created(newData))
  //     .unwrap()
  //     .then((response) => {

  //       if (response.NwCheckC3CreatedData.status === true) {
  //         setShowModal(!showModal);
  //         setModalMessage(response.NwCheckC3CreatedData.message);
  //         setHeaderId(response.NwCheckC3CreatedData.data);
  //       } else {
  //         setHeaderId('');
  //         save();
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('API Error:', error);
  //     })
  //     .finally(() => {
  //       setSaveLoad(false);
  //     });
  // };

  const save = async () => {
    const finalApiLoadData = {
      ...apiLoadData,
      is_preview: false,
      isSave: true,
      Is_SendBima: true,
    };

    try {
      const response = await dispatch(PreviewDirectorc3(finalApiLoadData)).unwrap();

      if (response?.PreviewDirectorc3Data?.status === true) {
        navigate('/apps/director/NwDirectorPayroll');
        setHeaderId(response.PreviewDirectorc3Data.data);
        setIsSubmitted(false);
      }
    } catch (error) {
      if (error?.response?.status === 500) {
        toast.error('Internal Server Error (500). Please try again later.');
      }
    }
  };

  const saveAndSubmit = async () => {
    setSaveLoad(true);

    const newData = {
      CompanyId: apiLoadData.CompanyId,
      Year: apiLoadData.Year,
      Month: apiLoadData.MonthName,
    };

    try {
      const response = await dispatch(GetNwCheckC3Created(newData)).unwrap();

      if (response.NwCheckC3CreatedData.status === true) {
        setShowModal(true);
        setModalMessage(response.NwCheckC3CreatedData.message);
        setHeaderId(response.NwCheckC3CreatedData.data);
      } else {
        setHeaderId('');
        await save(); // Wait for the save API to finish
      }
    } catch (error) {
       console.error('Something went wrong:', error);
    } finally {
      setSaveLoad(false); // Only stop loading after all async calls
    }
  };

  const saveLocal = async () => {
    setIsLoadingDraft(true); // Start loader before API call

    const finalApiLoadData = {
      ...previewDatapayload.apiLoadData,
      is_preview: false,
      isSave: true,
    };

    try {
      const response = await dispatch(PreviewDirectorc3(finalApiLoadData)).unwrap();

      if (response?.PreviewDirectorc3Data?.status === true) {
        setHeaderId(response.PreviewDirectorc3Data.data);
        setShowModalSave(false); // Ensure modal is closed on success
      }
      return response;
    } catch (error) {
      if (error?.response?.status === 500) {
        toast.error('Internal Server Error (500). Please try again later.');
      }
      return null;
    } finally {
      setIsLoadingDraft(false); // Stop loader after API completes
    }
  };

  async function saveAsDraft() {
    setIsLoadingDraft(true); // Start main loader

    const newData = {
      CompanyId: apiLoadData.CompanyId,
      Year: apiLoadData.Year,
      Month: apiLoadData.MonthName,
    };

    try {
      const response = await dispatch(GetNwCheckC3Created(newData)).unwrap();

      if (response.NwCheckC3CreatedData.status === true) {
        setShowModalSave(true);
        setModalMessage(response.NwCheckC3CreatedData.message);
        setHeaderId(response.NwCheckC3CreatedData.data);
      } else {
        setHeaderId('');
        await saveLocal(); // Wait for saveLocal to complete
      }
    } catch (error) {
       console.error('Something went wrong:', error);
     
    } finally {
      setIsLoadingDraft(false); // Final loader stop
    }
  }

  function handleSaveClick() {
    
    if (ErrorDataAPI?.length > 0) {
      setErrorDataModalOpen(true); // Open your error modal
      return;
    }

    if (ValidateData && ValidateData.length > 0) {
      setPreviewModalOpenNew(true);
      return;
    }

    saveAsDraft();
  }

  const handleYes = () => {
    setIsLoading(true);
    const keysToDelete = [
      'inserT_SPNAME',
      'updatE_SPNAME',
      'deletE_SPNAME',
      'finD_SPNAME',
      'alL_SPNAME',
      'tablE_NAME',
      'uniquE_ID',
      'noteS_TABLE_RECORD_ID',
    ];

    let cleanedEmployeeList = [];

    if (Array.isArray(data.allEmployeeList_List)) {
      cleanedEmployeeList = data.allEmployeeList_List.map((employee) => {
        const cloned = { ...employee };
        keysToDelete.forEach((key) => {
          const descriptor = Object.getOwnPropertyDescriptor(cloned, key);
          if (!descriptor || descriptor.configurable) {
            delete cloned[key];
          } else {
            console.warn('');
          }
        });
        return cloned;
      });
    }

    // Prepare the payload to dispatch, using modified data
    const payload = {
      ...data,
      allEmployeeList_List: cleanedEmployeeList,
      cmbPayPeriod: apiLoadData.CmbPayPeriod,
      H_Id: headerId, // Include the header ID as part of the payload
    };

    // Dispatch the action
    dispatch(OverwritingNWdirector(payload))
      .unwrap()
      .then((res) => {
      
        setShowModal(false); // Close the modal on success
      })
      .catch((err) => {
        if (err?.response?.status === 500) {
          toast.error('Internal Server Error (500). Please try again later.');
        }
      })
      .finally(() => {
        setIsLoading(false); // ✅ stop loading
      });
  };

  function handleNo() {
    setShowModal(false);
    setShowModalSave(false);
  }

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

  const handleShow = () => {
    if (headerId) {
      setShow(true);
    } else {
      setShowNew(true);
    }
  };

  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'NW DIRECTOR PAYROLL');
  const canPreviewNWDirectorPayroll = employerPermission?.is_preview;
  const canPrintNWDirectorPayroll = employerPermission?.is_Print;

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

  const handleCancelClick = () => {
    setShowModalConfirm(true); // Show confirmation modal
  };

  const handleConfirmCancel = () => {
    setShowModalConfirm(false);
    navigate('/apps/director/NwDirectorPayroll'); // Proceed to cancel
  };

  const handleCloseModal = () => {
    setShowModalConfirm(false); // Just close modal
  };

 

  return (
    <>
      <div id="layout-wrapper">
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
            <li className="fw-medium"> Preview C3 Generation </li>
          </ul>
          {/* <span className="custom_design_flow">
            {previewDatapayload.isActive ? <>&apos;&apos;</> : <>This C3 is a Nil return.</>}
          </span> */}
        </div>
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="page-content-wrapper">
                {/*    <div class="page-title mb-3">
                        <h5>Employer Details</h5> 
                    </div>
             */}

                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-header py-3 bg_ligh">
                        <div className="row align-items-center d-flex">
                          <div className="col-xl-8">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user text-success pe-2" />
                              NW Director Payroll
                            </h4>
                          </div>
                          <div className="col-lg-4 text-end">
                            {!ErrorDataAPI?.length > 0 && ValidateData?.length > 0 && (
                              <Button
                                className="btn-light"
                                onClick={() => setPreviewModalOpen(true)}
                              >
                                Exception Detail
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12 col-lg-12 col-xl-12">
                            <table width="100%">
                              <tr>
                                <td style={{ fontSize: '16px' }}>
                                  <b>Period :</b>
                                  &nbsp;{data.monthName} - {data.year !== null ? data.year : year}{' '}
                                </td>
                                <td style={{ fontSize: '16px' }}>
                                  <b>Schedule :</b>
                                  &nbsp;
                                  {data.isNilReturn === false ? (
                                    <> {data?.schedule_no}</>
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </td>
                                <td style={{ fontSize: '16px' }}>
                                  <b>Director(s) :</b>
                                  &nbsp;
                                  {data.isNilReturn === false ? (
                                    <> {data?.allEmployeeList_List?.length}</>
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </td>
                                <td style={{ fontSize: '16px' }}>
                                  <b>Accountant General :</b>&nbsp;
                                  {data.isNilReturn === false ? (
                                    <>
                                      {' '}
                                      <span className="td-text-align">
                                        ${Number(data?.textAccountantGeneral || 0)?.toFixed(2)}
                                      </span>
                                    </>
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={4}>
                                  <div className="row border-dotted"></div>
                                </td>
                              </tr>
                              <br />
                              <tr>
                                <td width="25%" style={{ fontSize: '16px' }}></td>
                                <td width="25%" style={{ fontSize: '16px' }}></td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-body px-2">
                        <div className="table-responsive font-14">
                          <table className="table table-hover mb-0 white-space">
                            <thead>
                              <tr className="border-b">
                                <th>SSN</th>
                                <th>Director Name</th>
                                <th>Department</th>
                                <th>Period</th>

                                <th className="td-text-align">Week 1</th>
                                <th className="td-text-align">Week 2</th>
                                <th className="td-text-align">Week 3</th>
                                <th className="td-text-align">Week 4</th>
                                <th className="td-text-align">Week 5</th>

                                <th className="td-text-align">Total Wages</th>
                                <th className="td-text-align"> Employee Levy</th>

                                <th className="td-pl-2">Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.isNilReturn === true ? (
                                [...Array(10)].map((_, index) => (
                                  <>
                                    <tr key={index}>
                                      <td colSpan="16" className="text-center font-15"></td>
                                    </tr>
                                    <div className="draft-imgNill">
                                      <>
                                        <img
                                          src={NillImage}
                                          className="mb-4"
                                          width="455"
                                          alt="Draft"
                                        />
                                      </>
                                    </div>
                                  </>
                                ))
                              ) : data?.allEmployeeList_List &&
                                data?.allEmployeeList_List?.length > 0 ? (
                                <>
                                  {data?.allEmployeeList_List?.map((item, index) => (
                                    <tr key={item.item}>
                                      <td>{item?.ssnd || item.ssn}</td>
                                      <td>{item?.employeeName}</td>
                                      <td
                                        style={{
                                          maxWidth: '120px',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          cursor: 'pointer',
                                        }}
                                        title={item?.department} // 👈 this shows full text on hover
                                      >
                                        {item?.department}
                                      </td>
                                      <td>{item?.payFreq}</td>

                                      <td className="td-text-align">
                                        {item?.wageS1?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item?.wageS2?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item?.wageS3?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item?.wageS4?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item?.wageS5?.toFixed(2) ?? '0.00'}
                                      </td>

                                      <td className="td-text-align">
                                        {item?.totalWadeges?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item?.levyee?.toFixed(2) ?? '0.00'}
                                      </td>

                                      <td className="td-pl-2">{item?.remarks ?? 'N/A'}</td>
                                    </tr>
                                  ))}
                                  {(ErrorDataAPI?.length ?? 0) > 0 && (
                                    <>
                                      {/* <tr className="bg-danger text-white">
                                          <td
                                            colSpan="16"
                                            className="text font-weight-bold bg-light"
                                          >
                                            Exception Error Records
                                          </td>
                                        </tr> */}
                                      {ErrorDataAPI?.map((item, index) => (
                                        <>
                                          <tr key={`exception-${index}`} className="bg-warning">
                                            <td>{item.ssn}</td>
                                            <td>{item.employeeName}</td>
                                            <td
                                              style={{
                                                maxWidth: '120px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                cursor: 'pointer',
                                              }}
                                              title={item?.department}
                                            >
                                              {item?.department}
                                            </td>
                                            <td>{item.payFreq}</td>
                                            <td className="td-text-align">{item.wageS1}</td>
                                            <td className="td-text-align">{item.wageS2}</td>
                                            <td className="td-text-align">{item.wageS3}</td>
                                            <td className="td-text-align">{item.wageS4}</td>
                                            <td className="td-text-align">{item.wageS5}</td>
                                            {/* <td className="td-text-align">
                                              {item.hpay > 0 ? (
                                                <i className="mdi mdi-check-circle text-success" />
                                              ) : (
                                                <i className="fa fa-times-circle text-danger" />
                                              )}
                                              &nbsp;{item.hpay?.toFixed(2) ?? '0.00'}
                                            </td> */}
                                            {/* <td className="td-text-align">
                                              {item.bonus?.toFixed(2) ?? '0.00'}
                                            </td> */}
                                            <td className="td-text-align">
                                              {item.totalWadeges?.toFixed(2) ?? '0.00'}
                                            </td>
                                            <td className="td-text-align">
                                              {item.levyee?.toFixed(2) ?? '0.00'}
                                            </td>
                                            {/* <td className="td-text-align">
                                              {item.socialSecurity?.toFixed(2) ?? '0.00'}
                                            </td> */}
                                            <td className="td-pl-2">{item.remarks}</td>
                                          </tr>
                                          {(item.validateMsg || item.ValidateMsg) && (
                                            <tr className="bg-light-danger">
                                              <td colSpan="15">
                                                <span className="text-danger fw-bold d-block">
                                                  {item.validateMsg || item.ValidateMsg}
                                                </span>
                                              </td>
                                            </tr>
                                          )}
                                        </>
                                      ))}
                                    </>
                                  )}
                                </>
                              ) : (
                                <tr>
                                  <td colSpan="16" className="text-center">
                                    {' '}
                                    {/* Colspan should match number of columns */}
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
                        <div className="row align-items-center d-flex">
                          <div className="col-xl-2"></div>
                          <div className="col-xl-3">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user text-success pe-2" />
                              C3 Contribution Summary
                            </h4>
                          </div>
                          <div className="col-xl-7 text-end"></div>
                        </div>
                      </div>
                      <div className="card-body p-0">
                        <div className="row">
                          <div className="col-md-8 col-12 pad-0 w-55 pr-0 mx-auto">
                            <div className="bg-light1 pt-2 p-3 h-100">
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600 col-md-7 col-7 p-0">a) Total Fees</span>
                                {/* <span className="f-400 col-md-4 col-4 p-0">
                                ----------------------------------------------------------
                              </span> */}
                                <span className="font-bold col-md-2 col-2 td-text-align ">
                                  <span className="trigger">
                                    {data.isNilReturn === false ? (
                                      <>${Number(data?.textTotalWages || 0).toFixed(2)}</>
                                    ) : (
                                      <>&nbsp;</>
                                    )}
                                  </span>
                                </span>
                              </p>
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600 col-md-7 col-7 p-0">
                                  b) Directors levy Contribution
                                </span>
                                {/* <span className="f-400 col-md-3 col-3 p-0">
                                -------------------------------------------
                              </span> */}
                                <span className="font-bold col-md-2 col-2 td-text-align ">
                                  <span className="trigger">
                                    <span className="td-text-align trigger">
                                      {data.isNilReturn === false ? (
                                        <> ${Number(data?.textTotalWagesNLevy || 0).toFixed(2)}</>
                                      ) : (
                                        <>&nbsp;</>
                                      )}
                                    </span>
                                  </span>
                                </span>
                              </p>
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600 col-md-7 col-7 p-0">
                                  c) Levy Penalty for the month (if any)
                                </span>

                                {/* <span className="f-400 col-md-2 col-2 p-0">
                                -----------------------------
                              </span> */}
                                <span className="font-bold col-md-2 col-2 td-text-align ">
                                  {data.isNilReturn === false ? (
                                    <>
                                      {' '}
                                      <span
                                        className={`td-text-align ${
                                          Number(data?.textLevyPenalty) > 1 ? 'text-danger' : ''
                                        }`}
                                      >
                                        ${Number(data?.textLevyPenalty || 0).toFixed(2)}
                                      </span>
                                    </>
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </span>
                              </p>
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600 col-md-7 col-7 p-0">
                                  d) Accountant General
                                </span>

                                <span className="font-bold col-md-2 col-2 td-text-align ">
                                  {data.isNilReturn === false ? (
                                    <>
                                      {' '}
                                      <span className="trigger">
                                        ${Number(data?.textTotalAccountantGeneral || 0).toFixed(2)}
                                      </span>
                                    </>
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </span>
                              </p>

                              <div className="col-md-12 col-12 d-flex mt-4">
                                <button
                                  type="button"
                                  className="btn btn-success waves-effect waves-light h-45"
                                  // onClick={() => saveAsDraft()}
                                  onClick={handleSaveClick}
                                  disabled={isLoadingDraft}
                                >
                                  {isLoadingDraft ? (
                                    <>
                                      <Spinner color="dark" size="sm" /> Loading...
                                    </>
                                  ) : (
                                    <>
                                      Save <i className="far fa-save"></i>
                                    </>
                                  )}
                                </button>
                                <Label className="d-block"> &nbsp;</Label>
                                {/* <Button
                                  className="btn btn-success waves-effect waves-light h-45"
                                  type="button"
                                
                                  onClick={() => saveAndSubmit()}
                                  disabled={saveLoad || isSubmitted}
                                >
                                  {saveLoad ? (
                                    <Spinner color="dark" size="sm">
                                      Loading...
                                    </Spinner>
                                  ) : (
                                    <i className="far fa-save"></i>
                                  )}
                                  &nbsp; Save &amp; Submit{' '}
                                </Button> */}

                                <button
                                  type="button"
                                  className="btn btn-info waves-effect waves-light h-45 btn btn-secondary"
                                  onClick={handleShow}
                                >
                                  <i className="dripicons-print" /> &nbsp;
                                  <span>Print</span>
                                </button>
                                {/* <Button className="btn text-white bg-success">
                                <i className="dripicons-print" />
                                <span>Print</span>
                              </Button> */}
                                {/* <Button
                                className="btn btn-info waves-effect waves-light h-45"
                                type="submit"
                              >
                                <i className="dripicons-export" /> Export EC3
                              </Button> */}
                                {/* <Link
                                  to="/apps/director/NwDirectorPayroll"
                                  className="h-45 btn btn-light pt-2"
                                >
                                  <i className="fas fa-times" /> Cancel
                                </Link> */}
                                <button
                                  type="button"
                                  className="h-45 btn btn-light"
                                  onClick={handleCancelClick}
                                >
                                  <i className="fas fa-times" /> Cancel
                                </button>

                                <Button
                                  type="button"
                                  color="primary"
                                  // onClick={() => navigate('/apps/C3/Add-C3Generation')}
                                  // onClick={() => navigate(-1)}
                                  onClick={() => previewShow(false)}
                                  style={{ position: 'absolute', right: '25px' }}
                                >
                                  <i className="fas fa-arrow-left" /> Back
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{' '}
            </div>

            <sidebar-barrrrr></sidebar-barrrrr>
          </div>
          {/* end main content*/}
        </div>
      </div>
      {/* END layout-wrapper */}
      <div className="modal" id="myModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h4 className="modal-title">Employee Bonus Details</h4>
              <Button className="btn-close" data-bs-dismiss="modal" />
            </div>
            {/* Modal body */}
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 col-lg-6 col-xl-6">
                  <div className="mb-3">
                    <Label>
                      Employee <span className="text-danger">*</span>{' '}
                    </Label>
                    <select className="form-select" aria-label="Default select example">
                      <option selected="">Select Employee</option>
                      <option value={1}>100001(Bhanu)</option>
                      <option value={2}>100001(Rajesh)</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 col-lg-6 col-xl-6">
                  <div className="mb-3">
                    <Label>
                      Payment Date <span className="text-danger">*</span>
                    </Label>
                    <input type="date" className="form-control" id="username" placeholder="" />
                  </div>
                </div>
                <div className="col-md-6 col-lg-6 col-xl-6">
                  <div className="mb-3">
                    <Label>
                      Amount <span className="text-danger">*</span>
                    </Label>
                    <input type="number" className="form-control" id="username" placeholder="" />
                  </div>
                </div>
                <div className="col-md-6 col-lg-6 col-xl-6 mt-4 pt-2">
                  <Button className="btn btn-success px-4 me-3">
                    <i className="far fa-save pe-1" /> Save
                  </Button>
                  <Button
                    type="button"
                    className="btn btn-light border px-4"
                    data-bs-dismiss="modal"
                  >
                    <i className="fas fa-times" /> Cancel
                  </Button>
                </div>
              </div>
            </div>
            {/* Modal footer */}
            <div className="border-top">
              <div className="px-4 py-3">
                <div className="row">
                  <div className="col-md-12 col-lg-12 col-xl-12">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0 white-space">
                        <thead>
                          <tr className="border-b">
                            <th scope="row">S.No.</th>
                            <th>Amount</th>
                            <th>Pay Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>$682</td>
                            <td>12/12/2024</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>$582</td>
                            <td>24/12/2024</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>$452</td>
                            <td>29/12/2024</td>
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

      <Modal isOpen={show} size="xl" onHide={handleClose}>
        <ModalHeader toggle={handleClose}>
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
                            <div className="col-xl-4 col-6 mb-2 mb-lg-0">
                              <h4 className="header-title mb-0 text-success">
                                <i className="far fa-user text-success pe-2" />
                                Report
                              </h4>
                            </div>
                          </div>
                        </div>
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
                                        {' '}
                                        {data?.company_name}
                                      </span>
                                    </th>

                                    <th className="label-cell fix-width" colSpan="7">
                                      Trade Name{' '}
                                      <span className="add-bottom-border"> {data?.trade_name}</span>
                                    </th>

                                    <th className="label-cell text-end" colSpan="4">
                                      Employer&#39;s Registration No.{' '}
                                      <span className="add-full-border">
                                        {' '}
                                        {data?.company_reg_no}
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
                                          {' '}
                                          {data?.company_address}
                                        </span>
                                      </span>
                                    </th>

                                    <th className="label-cell text-end" colSpan="4">
                                      Director(s){' '}
                                      <span className="add-full-border">
                                        {data.isNilReturn === false ? (
                                          <>{data?.allEmployeeList_List?.length}</>
                                        ) : (
                                          <>&nbsp;</>
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
                                        {data.monthName} - {data.year !== null ? data.year : year}
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
                                        {data.isNilReturn === false ? (
                                          <>
                                            ${(Number(data?.textAccountantGeneral) || 0).toFixed(2)}
                                          </>
                                        ) : (
                                          <>&nbsp;</>
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

                                {data.isNilReturn === true && (
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
                                    <th className="td-text-align">WK1</th>
                                    <th className="td-text-align">WK2</th>
                                    <th className="td-text-align">WK3</th>
                                    <th className="td-text-align">WK4</th>
                                    <th className="td-text-align">WK5</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data.isNilReturn === true // Show 10 blank rows
                                    ? Array.from({ length: 10 }).map((_, index) => (
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
                                    : data?.allEmployeeList_List?.map((item, index) => (
                                        <tr>
                                          <td>{index + 1}</td>
                                          <td>{item.ssnd}</td>
                                          <td>{item.employeeName}</td>
                                          <td className="td-text-align">
                                            ${(Number(item.wageS1) || 0).toFixed(2)}
                                          </td>
                                          <td className="td-text-align">
                                            ${(Number(item.wageS2) || 0).toFixed(2)}
                                          </td>
                                          <td className="td-text-align">
                                            ${(Number(item.wageS3) || 0).toFixed(2)}
                                          </td>
                                          <td className="td-text-align">
                                            ${(Number(item.wageS4) || 0).toFixed(2)}
                                          </td>
                                          <td className="td-text-align">
                                            ${(Number(item.wageS5) || 0).toFixed(2)}
                                          </td>
                                          <td className="td-text-align">
                                            ${(Number(item.totalWadeges) || 0).toFixed(2)}
                                          </td>
                                          <td className="td-text-align">
                                            ${(Number(item.levyee) || 0).toFixed(2)}
                                          </td>

                                          <td>{item.remarks}</td>
                                        </tr>
                                      ))}
                                  <tr className="new_remove">
                                    <td className="borders" colSpan={8}>
                                      <div className="man_flex">
                                        <div className="right_border">
                                          a) Total Fees and Directors levy Contribution
                                        </div>
                                        <div className="left-border">
                                          <div className="borde_down"></div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="text-end">
                                      {data.isNilReturn === false ? (
                                        <>${(Number(data?.textTotalWages) || 0).toFixed(2)}</>
                                      ) : (
                                        <>&nbsp;</>
                                      )}
                                    </td>
                                    <td className="text-end">
                                      {data.isNilReturn === false ? (
                                        <>${(Number(data?.textTotalWagesNLevy) || 0).toFixed(2)}</>
                                      ) : (
                                        <>&nbsp;</>
                                      )}
                                    </td>
                                    <td className="text-center" rowSpan={3}>
                                      <span className="text_decoration">FOR OFFICIAL USE ONLY</span>
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
                                    </td>
                                  </tr>
                                  <tr className="new_remove">
                                    <td className="borders" colSpan={9}>
                                      <div className="man_flex">
                                        <div className="right_border">
                                          b) Levy Penality for the month (if any)
                                        </div>
                                        <div className="left-border">
                                          <div className="borde_down"></div>
                                        </div>
                                      </div>
                                    </td>

                                    <td
                                      className={`text-end ${
                                        Number(data?.textLevyPenalty) > 1 ? 'text-danger' : ''
                                      }`}
                                    >
                                      {data.isNilReturn === false ? (
                                        <>${Number(data?.textLevyPenalty || 0).toFixed(2)}</>
                                      ) : (
                                        <>&nbsp;</>
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
                                      {data.isNilReturn === false ? (
                                        <>
                                          $
                                          {(Number(data?.textTotalAccountantGeneral) || 0).toFixed(
                                            2,
                                          )}
                                        </>
                                      ) : (
                                        <>&nbsp;</>
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
                                          {' '}
                                          {moment(new Date(currentDateTime), 'DD-MM-YYYY').format(
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
          <Button variant="secondary" className="h-45 btn btn-light" onClick={handleClose}>
            <i className="fas fa-times"></i> Close
          </Button>
          <Button color="success" onClick={handlePrint}>
            <i className="dripicons-print" /> Print
          </Button>
          {canPrintNWDirectorPayroll ? (
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

      <Modal isOpen={showNew} size="xl" onHide={handleClose2}>
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
                      <div ref={targetRef}>
                        <div className="card">
                          <div className="card-body add_custom">
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
                                        {' '}
                                        {data?.company_name}
                                      </span>
                                    </th>

                                    <th className="label-cell fix-width" colSpan="7">
                                      Trade Name{' '}
                                      <span className="add-bottom-border"> {data?.trade_name}</span>
                                    </th>

                                    <th className="label-cell text-end" colSpan="4">
                                      Employer&#39;s Registration No.{' '}
                                      <span className="add-full-border">
                                        {' '}
                                        {data?.company_reg_no}
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
                                          {' '}
                                          {data?.company_address}
                                        </span>
                                      </span>
                                    </th>

                                    <th className="label-cell text-end" colSpan="4">
                                      Director(s){' '}
                                      <span className="add-full-border">
                                        {' '}
                                        {data.isNilReturn === false ? (
                                          <> {data?.allEmployeeList_List?.length}</>
                                        ) : (
                                          <>&nbsp;</>
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
                                        {' '}
                                        {data.monthName} - {data.year !== null ? data.year : year}
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
                                        {data.isNilReturn === false ? (
                                          <>
                                            {' '}
                                            ${(Number(data?.textAccountantGeneral) || 0).toFixed(2)}
                                          </>
                                        ) : (
                                          <>&nbsp;</>
                                        )}
                                      </span>
                                    </th>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <span className="report_logo">
                              <img src={ReportLogo} alt="ReportLogo" />
                            </span>
                            {/* {data.isNilReturn === true && (
                              <span className="Paid_Image">
                                <img src={NillImage} alt="Submitted" width={20} height={20} />
                              </span>
                            )} */}
                            <div className="table-responsive mt-2 draft">
                              {data.h_Id === 0 && data.isNilReturn !== true && (
                                <div className="draft-img1">
                                  <img src={draftImage} className="mb-4" width="455" alt="Draft" />
                                </div>
                              )}

                              {/* <table className="table table-hover table-bordered mb-0 white-space2 mb-4 report-table"> */}

                              <table className="table custom_tables table-hover table-bordered mb-0 white-space2 mb-1 report-table">
                                {isPaidStatus && (
                                  <span className="Paid_Image">
                                    <img src={Paid} alt="Paid" />
                                  </span>
                                )}

                                {data.isNilReturn === true && (
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
                                    <th className="td-text-align">WK1</th>
                                    <th className="td-text-align">WK2</th>
                                    <th className="td-text-align">WK3</th>
                                    <th className="td-text-align">WK4</th>
                                    <th className="td-text-align">WK5</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data.isNilReturn === true // Show 10 blank rows
                                    ? Array.from({ length: 10 }).map((_, index) => (
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
                                    : data?.allEmployeeList_List?.map((item, index) => (
                                        <tr>
                                          <td>{index + 1}</td>
                                          <td>{item.ssnd}</td>
                                          <td>{item.employeeName}</td>
                                          <td className="td-text-align">
                                            ${(Number(item.wageS1) || 0).toFixed(2)}
                                          </td>
                                          <td className="td-text-align">
                                            ${(Number(item.wageS2) || 0).toFixed(2)}
                                          </td>
                                          <td className="td-text-align">
                                            ${(Number(item.wageS3) || 0).toFixed(2)}
                                          </td>
                                          <td className="td-text-align">
                                            ${(Number(item.wageS4) || 0).toFixed(2)}
                                          </td>
                                          <td className="td-text-align">
                                            ${(Number(item.wageS5) || 0).toFixed(2)}
                                          </td>
                                          <td className="td-text-align">
                                            ${(Number(item.totalWadeges) || 0).toFixed(2)}
                                          </td>
                                          <td className="td-text-align">
                                            ${(Number(item.levyee) || 0).toFixed(2)}
                                          </td>

                                          <td>{item.remarks}</td>
                                        </tr>
                                      ))}
                                  <tr className="new_remove">
                                    <td className="borders" colSpan={8}>
                                      <div className="man_flex">
                                        <div className="right_border">
                                          a) Total Fees and Directors levy Contribution
                                        </div>
                                        <div className="left-border">
                                          <div className="borde_down"></div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="text-end">
                                      {data.isNilReturn === false ? (
                                        <>${(Number(data?.textTotalWages) || 0).toFixed(2)}</>
                                      ) : (
                                        <>&nbsp;</>
                                      )}
                                    </td>
                                    <td className="text-end">
                                      {data.isNilReturn === false ? (
                                        <>${(Number(data?.textTotalWagesNLevy) || 0).toFixed(2)}</>
                                      ) : (
                                        <>&nbsp;</>
                                      )}
                                    </td>

                                    <td className="text-center" rowSpan={3}>
                                      FOR OFFICIAL USE ONLY
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
                                    </td>
                                  </tr>
                                  <tr className="new_remove">
                                    <td className="borders" colSpan={9}>
                                      <div className="man_flex">
                                        <div className="right_border">
                                          b) Levy Penality for the month (if any)
                                        </div>
                                        <div className="left-border">
                                          <div className="borde_down"></div>
                                        </div>
                                      </div>
                                    </td>
                                    <td
                                      className={`text-end ${
                                        Number(data?.textLevyPenalty) > 1 ? 'text-danger' : ''
                                      }`}
                                    >
                                      {data.isNilReturn === false ? (
                                        <>${(Number(data?.textLevyPenalty) || 0).toFixed(2)}</>
                                      ) : (
                                        <>&nbsp;</>
                                      )}
                                    </td>
                                  </tr>
                                  <tr className="new_remove">
                                    <td className="borders" colSpan={9}>
                                      <div className="man_flex">
                                        <div className="right_border">
                                          c) Total to due to the Accountant General
                                        </div>
                                        <div className="left-border">
                                          <div className="borde_down"></div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="text-end">
                                      {data.isNilReturn === false ? (
                                        <>
                                          $
                                          {(Number(data?.textTotalAccountantGeneral) || 0).toFixed(
                                            2,
                                          )}
                                        </>
                                      ) : (
                                        <>&nbsp;</>
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
                                          {' '}
                                          {moment(new Date(currentDateTime), 'DD-MM-YYYY').format(
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
          {canPrintNWDirectorPayroll ? (
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

      <Modal isOpen={showModal} toggle={handleNo}>
        <ModalHeader toggle={handleNo}>Confirmation</ModalHeader>
        <ModalBody>{modalMessage}</ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={handleNo}>
            No
          </Button>
          <Button
            color="primary"
            onClick={() =>
              handleYes({
                h_Id: headerId,
                is_Preview: true,
                isRecordEdit: true,
                schedule_no: data.schedule_no,
              })
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                &nbsp; Saving...
              </>
            ) : (
              'Yes'
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={showModalSave} toggle={handleNo}>
        <ModalHeader toggle={handleNo}>Confirmation</ModalHeader>
        <ModalBody>{modalMessage}</ModalBody>
        <ModalFooter>
          <Button className="btn-light" color="secondary" onClick={handleNo}>
            No
          </Button>
          <Button color="primary" onClick={saveLocal}>
            {isLoadingDraft ? (
              <>
                <Spinner size="sm" /> Loading..
              </>
            ) : (
              'Yes'
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <ConfirmModal
        isOpen={showModalConfirm}
        onConfirm={handleConfirmCancel}
        onCancel={handleCloseModal}
      />
      <Modal isOpen={previewModalOpen} toggle={() => setPreviewModalOpen(false)} size="lg">
        <ModalHeader toggle={() => setPreviewModalOpen(false)}>Exception Details</ModalHeader>

        <ModalBody>
          <div ref={targetRef1}>
            <Table bordered responsive>
              <thead>
                <tr>
                  <th>Exception Type</th>
                  <th>Media File Value</th>
                  <th>As Per C3 Calculation</th>
                </tr>
              </thead>

              <tbody>
                {(Array.isArray(ValidateData) ? ValidateData : []).map((item, index) => (
                  <tr key={index}>
                    {(Array.isArray(tableHeaders) ? tableHeaders : []).map((head) => (
                      <td key={head}>{item[head]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button className="btn-light" onClick={() => setPreviewModalOpen(false)}>
            Close
          </Button>
          {/* <Button
               color="success"
               onClick={() => {
                 setPreviewModalOpen(false);
               }}
             >
               Yes
             </Button> */}
          <Button color="primary" onClick={toPDF1}>
            Download PDF
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={previewModalOpenNew} toggle={() => setPreviewModalOpenNew(false)} size="lg">
        <ModalHeader toggle={() => setPreviewModalOpenNew(false)}>Exception Details</ModalHeader>

        <ModalBody>
          <Label>
            There are some calculation exceptions in this C3 media file. If you save it, the C3
            application&apos;s calculated values will be saved, and the application will ignore the
            C3 media file values. Do you want to continue saving the C3 application&apos;s
            calculated values?
          </Label>
          <div ref={targetRef1}>
            <Table bordered responsive>
              <thead>
                <tr>
                  <th>Exception Type</th>
                  <th>Media File Value</th>
                  <th>As Per C3 Calculation</th>
                </tr>
              </thead>

              <tbody>
                {(Array.isArray(ValidateData) ? ValidateData : []).map((item, index) => (
                  <tr key={index}>
                    {(Array.isArray(tableHeaders) ? tableHeaders : []).map((head) => (
                      <td key={head}>{item[head]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button className="btn-light" onClick={() => setPreviewModalOpenNew(false)}>
            Close
          </Button>
          <Button
            color="success"
            onClick={() => {
              setPreviewModalOpenNew(false); // Close modal
              saveAsDraft(); // Call save function
            }}
          >
            Yes
          </Button>
          {/* <Button color="primary" onClick={toPDF1}>
               Download PDF
             </Button> */}
        </ModalFooter>
      </Modal>

      <Modal isOpen={errorDataModalOpen} toggle={() => setErrorDataModalOpen(false)}>
        <ModalHeader toggle={() => setErrorDataModalOpen(false)}>Exception Details</ModalHeader>

        <ModalBody>
          <Label>
            There are a few employees not associated with you, so you cannot save the details of
            this C3 media file.
          </Label>
        </ModalBody>

        <ModalFooter>
          <Button className="btn-light" onClick={() => setErrorDataModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default PreviewNWDirectorPayroll;
