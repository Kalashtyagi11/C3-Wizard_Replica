import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from 'reactstrap';
import draftImage from '../../../assets/images/users/draft.jpg';
import NillImage from '../../../assets/images/users/Nill.png';
import ReportLogo from '../../../assets/images/users/Reportlogo.jpg';
import {
  addOrUpdateSaveNContinue,
  checkC3Created,
  getCGeneration,
  PreviewPost,
} from '../../../store/apps/cGeneration/CGenerationSlice';
import ConfirmModal from '../component/ConfirmModel';
import UnsavedPayGuard from '../component/UnsavedPayGuard';
import CustomModal from '../component/CustomModal';

import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import { previewAllData } from '../../../store/apps/dashboard/DashboardSlice';

const PerviewC3 = (previewDatapayload) => {
  const [previewModalOpen, setPreviewModalOpen] = useState('');
  const [previewModalOpenNew, setPreviewModalOpenNew] = useState('');
  const [errorDataModalOpenException, setErrorDataModalOpenException] = useState('');
  const [errorDataModalOpen, setErrorDataModalOpen] = useState(false);
  const [savedPayVersion, setSavedPayVersion] = useState(0);
  const [payData, setPayData] = useState({ bonus: [], holiday: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenSave, setIsModalOpenSave] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const CompanyId = localStorage.getItem('companyId');
  const RegisterN = localStorage.getItem('reG_NUMBER');
  const TradeN = localStorage.getItem('TradeName');
  const EmployerName = localStorage.getItem('Name');
  const CompanyAddress = localStorage.getItem('Address');
  const userID = localStorage.getItem('userID');
  const UserName = localStorage.getItem('userName');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const getDate = new Date();
 
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [saveLoad, setSaveLoad] = useState(false);
  const [headerid, setHeaderid] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [show, setShow] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);
  const [month, setMonth] = useState(getDate.getMonth());
  const [year, setyear] = useState(getDate.getFullYear());
  const {
    data,
    previewShow,
    ValidateData,
    ErrorDataAPI,
    BimaDataList,
    hideToggle,
    validateAllBonusAndHolidaySaved,
    errorModalMessage,
  } = previewDatapayload;
  const { message, type } = useSelector((state) => state.messageReducer);
  const { previewData } = useSelector((state) => state.cGenerationSlice);
  
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'C3 GENERATION');
  const canPreviewC3Generation = employerPermission?.is_preview;
  const canPrintC3Generation = employerPermission?.is_Print;
  const tableHeaders = ValidateData && ValidateData.length > 0 ? Object.keys(ValidateData[0]) : [];

  const previewDataLoad = {
    CompanyId: 3,
    monthno: 2,
    MonthName: month,
    Year: year,
    IsLevyExempt: false,
    isrecordEdit: false,
    TextChanged: 'rphit',
    ListHavingItems: true,
    User_Name: 'rohit',
    UserID: 123,
    H_Id: 1,
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleModalSave = () => setIsModalOpenSave(!isModalOpenSave);

  const handleNo = () => {
    setIsSubmitted(false); // optional: or just close the modal
    toggleModal();
    toggleModalSave();
  };

  async function updateAdd(headerdata) {
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
          }
        });
        return cloned;
      });
    }

    const cleanedData = {
      ...data,
      allEmployeeList_List: cleanedEmployeeList,
      ...headerdata,
      userID,
    };

    try {
      const response = await dispatch(addOrUpdateSaveNContinue(cleanedData)).unwrap();
      
      setIsModalOpen(false);
      setHeaderid(response.addOrUpdateSaveNContinueResponse.data);
      return response;
    } catch (error) {
       console.error('Something went wrong:', error);
      throw error;
    } finally {
      setIsLoading(false); // ✅ Stop modal spinner here
      setIsModalOpen(false);
    }
  }

  async function save() {
    setIsLoading(true);

    try {
      const response = await dispatch(
        checkC3Created({ CompanyId, month: data.monthno, year: data.year }),
      ).unwrap();

      const result = response?.checkC3CreatedResponse;
      

      setIsSubmitted(true);

      if (result?.status === true) {
        setIsModalOpen(!isModalOpen);
        setSaveMessage(result?.message);
        setHeaderid(result?.data);
      } else {
        await updateAdd({
          // ✅ Await this if it is async
          h_Id: 0,
          is_Preview: true,
          isRecordEdit: true,
          companyId: CompanyId,
          schedule_no: data.schedule_no,
        });
      }
    } catch (error) {
       console.error('Something went wrong:', error);
    } finally {
      setIsLoading(false); // ✅ Loader closes after everything, including updateAdd
    }
  }

  async function SaveLocally() {
    setIsLoadingDraft(true);

    const cleanedData = {
      ...previewDatapayload.saveDataLoad,
      is_preview: false,
      isSave: true,
    };

    try {
      const response = await dispatch(PreviewPost(cleanedData)).unwrap();
      setIsModalOpenSave(false);
      setHeaderid(response.previewResponse.data);
      setSavedPayVersion((v) => v + 1);
      setPayData({ bonus: [], holiday: [] });

      return response;
    } catch (error) {
      if (error?.response?.status === 500) {
        toast.error('Internal Server Error (500). Please try again later.');
      }
    } finally {
      setIsLoadingDraft(false); // Stop loading after API completes (success or error)
    }
  }

  async function saveAsDraft() {
    setIsLoadingDraft(true); // Start loading before first API call

    try {
      const response = await dispatch(
        checkC3Created({
          CompanyId,
          month: data.monthno,
          year: data.year,
        }),
      ).unwrap();

      const res = response?.checkC3CreatedResponse;

      if (res?.status === true) {
        setIsModalOpenSave((prev) => !prev);
        setSaveMessage(res.message || '');
        setHeaderid(res.data || '');
        setIsModalOpenSave(true);
      } else {
        setHeaderid('');

        setIsLoadingDraft(true);
        await SaveLocally(); // Wait for SaveLocally to complete
      }
    } catch (error) {
        console.error('Something went wrong:', error);
    } finally {
      setIsLoadingDraft(false);
      // setIsModalOpenSave(false);
    }
  }

  function handleSaveClick() {
    
    if (hideToggle === false) {
      const isValid = validateAllBonusAndHolidaySaved();
    
      if (!isValid) {
        setErrorDataModalOpen(true); // ✅ open AFTER message is set

        return;
      }
    }

    if (ErrorDataAPI?.length > 0) {
      setErrorDataModalOpenException(true); // Open your error modal
      return;
    }

    if (ValidateData && ValidateData.length > 0) {
      setPreviewModalOpenNew(true);
      return;
    }

    saveAsDraft();
  }

  const handleShow = () => {
    if (headerid) {
      setShow(true);
    } else {
      setShowNew(true);
    }
  };

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
    setShowModalConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowModalConfirm(false);
    navigate('/apps/C3/C3Generation');
  };

  const handleCloseModal = () => {
    setShowModalConfirm(false);
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
        <div className="row">
          <div className="col-lg-12">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
              <ul className="d-flex align-items-center gap-2 mt-3 list-unstyled">
                <li className="fw-medium">
                  <span className="d-flex align-items-center gap-1 text-muted">
                    {' '}
                    <i className="ti-home" /> Dashboard{' '}
                  </span>
                </li>
                <li>-</li>
                <li className="fw-medium">
                  <span className="d-flex align-items-center gap-1 text-muted">
                    {' '}
                    C3 Generation{' '}
                  </span>
                </li>
                <li>-</li>
                <li className="fw-medium">Preview C3 Generation </li>
              </ul>
            </div>
          </div>
        </div>
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
                              <i className="far fa-user text-success pe-2" />
                              Preview C3 Generation
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
                                  &nbsp;{data.monthName} - {data.year !== null ? data.year : year}
                                </td>
                                <td style={{ fontSize: '16px' }}>
                                  <b>Schedule :</b>
                                  &nbsp;
                                  {previewDatapayload.isActive ? (
                                    <>{data.schedule_no}</>
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </td>
                                <td style={{ fontSize: '16px' }}>
                                  <b>Employees :</b>
                                  &nbsp;
                                  {previewDatapayload.isActive ? (
                                    <>{(data?.allEmployeeList_List ?? []).length}</>
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={3}>
                                  <div className="row border-dotted"></div>
                                </td>
                              </tr>
                              <br />
                              <tr>
                                <td width="33%" style={{ fontSize: '16px' }}>
                                  <b>Social Security:</b>&nbsp;
                                  {previewDatapayload.isActive ? (
                                    <>${Number(data?.texttotalSS || 0).toFixed(2)}</>
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </td>
                                <td width="33%" style={{ fontSize: '16px' }}>
                                  <b>Accountant General :</b>&nbsp;
                                  {previewDatapayload.isActive ? (
                                    <>${Number(data?.textAccountantGeneral || 0).toFixed(2)}</>
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </td>

                                <td width="34%" style={{ fontSize: '16px' }}>
                                  <b>Grand Total :</b>&nbsp;
                                  {previewDatapayload.isActive ? (
                                    <>${Number(data?.txt_GrandTotal || 0).toFixed(2)}</>
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </td>
                                <td width="25%" style={{ fontSize: '16px' }}></td>
                                <td width="25%" style={{ fontSize: '16px' }}></td>
                              </tr>
                              <tr>
                                <td colSpan={3}>
                                  <div className="row border-dotted"></div>
                                </td>
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
                        <div className="table-responsive Bg_addon font-14">
                          <table className="table table-hover mb-0 white-space">
                            <thead>
                              <tr className="border-b">
                                <th>SSN</th>
                                <th>Employee</th>
                                <th>Department</th>
                                <th>Period</th>
                                <th className="td-text-align">Week 1</th>
                                <th className="td-text-align">Week 2</th>
                                <th className="td-text-align">Week 3</th>
                                <th className="td-text-align">Week 4</th>
                                <th className="td-text-align">Week 5</th>
                                <th className="td-text-align" style={{ minWidth: '75px' }}>
                                  H Pay
                                </th>
                                <th className="td-text-align">Bonus</th>
                                <th className="td-text-align">Total Wages</th>
                                <th className="td-text-align">Levy</th>
                                <th className="td-text-align">Social Security</th>
                                <th className="td-pl-2">Remarks</th>
                              </tr>
                            </thead>
                            {/* <tbody>
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
                                data?.allEmployeeList_List.length > 0 &&
                                data?.allEmployeeList_List !== undefined ? (
                                data?.allEmployeeList_List.map((item) => (
                                  <tr>
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
                                      title={item?.department} // 👈 this shows full text on hover
                                    >
                                      {item?.department}
                                    </td>
                                    <td>{item.payFreq}</td>
                                    <td className="td-text-align">
                                      {item.wageS1?.toFixed(2) ?? '0.00'}
                                    </td>
                                    <td className="td-text-align">
                                      {item.wageS2?.toFixed(2) ?? '0.00'}
                                    </td>
                                    <td className="td-text-align">
                                      {item.wageS3?.toFixed(2) ?? '0.00'}
                                    </td>
                                    <td className="td-text-align">
                                      {item.wageS4?.toFixed(2) ?? '0.00'}
                                    </td>
                                    <td className="td-text-align">
                                      {item.wageS5?.toFixed(2) ?? '0.00'}
                                    </td>
                                    <td className="td-text-align">
                                      {item.hpay > 0 ? (
                                        <i className="mdi mdi-check-circle text-success " />
                                      ) : (
                                        <i className="fa fa-times-circle text-danger" />
                                      )}
                                      &nbsp;{item.hpay?.toFixed(2) ?? '0.00'}
                                    </td>
                                    <td className="td-text-align">
                                      {item.bonus?.toFixed(2) ?? '0.00'}
                                    </td>
                                    <td className="td-text-align">
                                      {item.totalWadeges?.toFixed(2) ?? '0.00'}
                                    </td>
                                    <td className="td-text-align">
                                      {item.levyee?.toFixed(2) ?? '0.00'}
                                    </td>
                                    <td className="td-text-align">
                                      {item.socialSecurity?.toFixed(2) ?? '0.00'}
                                    </td>
                                    <td className="td-pl-2">{item.remarks}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="16" className="text-center">
                                    {' '}
                                    No records found
                                  </td>
                                </tr>
                              )}
                            </tbody> */}
                            {/* <tbody>
                              {data.isNilReturn === true ? (
                                [...Array(10)].map((_, index) => (
                                  <>
                                    <tr key={index}>
                                      <td colSpan="16" className="text-center font-15"></td>
                                    </tr>
                                    <div className="draft-imgNill">
                                      <img
                                        src={NillImage}
                                        className="mb-4"
                                        width="455"
                                        alt="Draft"
                                      />
                                    </div>
                                  </>
                                ))
                              ) : 
                              data?.allEmployeeList_List &&
                                data?.allEmployeeList_List.length > 0 &&
                                data?.allEmployeeList_List !== undefined ? (
                                <>
                                  {data.allEmployeeList_List.map((item) => (
                                    <tr key={`main-${item.ssn}`}>
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
                                      <td className="td-text-align">
                                        {item.wageS1?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.wageS2?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.wageS3?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.wageS4?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.wageS5?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.hpay > 0 ? (
                                          <i className="mdi mdi-check-circle text-success" />
                                        ) : (
                                          <i className="fa fa-times-circle text-danger" />
                                        )}
                                        &nbsp;{item.hpay?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.bonus?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.totalWadeges?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.levyee?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.socialSecurity?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-pl-2">{item.remarks}</td>
                                    </tr>
                                  ))}

                                  {ValidateData.length === 0 && ErrorDataAPI?.length > 0 && (
                                    <tr>
                                      <td colSpan="16" className="text font-weight-bold bg-light">
                                        Exception Error Data
                                      </td>
                                    </tr>
                                  )}
                                  {ValidateData.length === 0 &&
                                    ErrorDataAPI?.length > 0 &&
                                    ErrorDataAPI.map((item, index) => (
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
                                        <td className="td-text-align">
                                          {item.wageS1?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align">
                                          {item.wageS2?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align">
                                          {item.wageS3?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align">
                                          {item.wageS4?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align">
                                          {item.wageS5?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align">
                                          {item.hpay > 0 ? (
                                            <i className="mdi mdi-check-circle text-success" />
                                          ) : (
                                            <i className="fa fa-times-circle text-danger" />
                                          )}
                                          &nbsp;{item.hpay?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align">
                                          {item.bonus?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align">
                                          {item.totalWadeges?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align">
                                          {item.levyee?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-text-align">
                                          {item.socialSecurity?.toFixed(2) ?? '0.00'}
                                        </td>
                                        <td className="td-pl-2">{item.remarks}</td>
                                      </tr>
                                    ))}
                                </>
                              ) : (
                                <tr>
                                  <td colSpan="16" className="text-center">
                                    No records found
                                  </td>
                                </tr>
                              )}
                            </tbody> */}
                            <tbody>
                              {/* Nil return rows */}
                              {/* {data?.isNilReturn ? (
                                [...Array(10)].map((_, index) => (
                                  <tr key={`nil-${index}`}>
                                    <td colSpan="16" className="text-center font-15">
                                      <img
                                        src={NillImage}
                                        className="mb-4"
                                        width="455"
                                        alt="Draft"
                                      />
                                    </td>
                                  </tr>
                                )) */}
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
                              ) : Array.isArray(data?.allEmployeeList_List) &&
                                data.allEmployeeList_List.length > 0 ? (
                                <>
                                  {/* Valid employee rows */}
                                  {data.allEmployeeList_List.map((item) => (
                                    <tr key={`main-${item.ssn}`}>
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
                                      <td className="td-text-align">
                                        {item.wageS1?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.wageS2?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.wageS3?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.wageS4?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.wageS5?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.hpay > 0 ? (
                                          <i className="mdi mdi-check-circle text-success" />
                                        ) : (
                                          <i className="fa fa-times-circle text-danger" />
                                        )}
                                        &nbsp;{item.hpay?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.bonus?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.totalWadeges?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.levyee?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-text-align">
                                        {item.socialSecurity?.toFixed(2) ?? '0.00'}
                                      </td>
                                      <td className="td-pl-2">{item.remarks}</td>
                                    </tr>
                                  ))}

                                  {/* Exception/Error rows */}
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
                                            <td className="td-text-align">
                                              {item.hpay > 0 ? (
                                                <i className="mdi mdi-check-circle text-success" />
                                              ) : (
                                                <i className="fa fa-times-circle text-danger" />
                                              )}
                                              &nbsp;{item.hpay?.toFixed(2) ?? '0.00'}
                                            </td>
                                            <td className="td-text-align">
                                              {item.bonus?.toFixed(2) ?? '0.00'}
                                            </td>
                                            <td className="td-text-align">
                                              {item.totalWadeges?.toFixed(2) ?? '0.00'}
                                            </td>
                                            <td className="td-text-align">
                                              {item.levyee?.toFixed(2) ?? '0.00'}
                                            </td>
                                            <td className="td-text-align">
                                              {item.socialSecurity?.toFixed(2) ?? '0.00'}
                                            </td>
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
                          <div className="col-xl-6 text-end"></div>
                        </div>
                      </div>
                      <div className="card-body p-0">
                        <div className="row">
                          <div className="col-md-8 col-12 pad-0 w-55 pr-0 mx-auto">
                            <div className="bg-light1 pt-2 p-3 h-100">
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600 col-md-7 col-7 p-0">Total Wages</span>
                                <span className="font-bold col-md-2 col-2 td-text-align">
                                  <span className="trigger ">
                                    {previewDatapayload.isActive ? (
                                      <>${Number(data?.textTotalWages || 0).toFixed(2)}</>
                                    ) : (
                                      <>&nbsp;</>
                                    )}
                                  </span>
                                </span>
                              </p>

                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600  col-md-7 col-7 p-0">
                                  Employee{`${"'"}`}s Levy
                                </span>
                                <span className="font-bold col-md-2 col-2 td-text-align">
                                  <span className="trigger ">
                                    {previewDatapayload.isActive ? (
                                      <>${Number(data?.textTotalWagesNLevy || 0).toFixed(2)}</>
                                    ) : (
                                      <>&nbsp;</>
                                    )}
                                  </span>
                                </span>
                              </p>

                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600 col-md-7 col-7 p-0">
                                  Employer{`${"'"}`}s 3% of Wages for Levy Contribution
                                </span>
                                <span className="font-bold col-md-2 col-2 td-text-align ">
                                  {previewDatapayload.isActive ? (
                                    <>${Number(data.textEmployerLevy || 0).toFixed(2)}</>
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </span>
                              </p>
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600 col-md-7 col-7 p-0">
                                  Employer{`${"'"}`}s 1% of Wages for Severance Payment Contribution
                                </span>
                                <span className="font-bold col-md-2 col-2 td-text-align ">
                                  <span className="trigger">
                                    {previewDatapayload.isActive ? (
                                      <>${Number(data.textServayance || 0).toFixed(2)}</>
                                    ) : (
                                      <>&nbsp;</>
                                    )}
                                  </span>
                                </span>
                              </p>
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600  p-0 col-md-7 col-7">
                                  Levy Penalty for the Month
                                </span>
                                <span className="font-bold col-md-2 col-2 td-text-align">
                                  {previewDatapayload.isActive ? (
                                    <>
                                      <span
                                        className={`trigger ${
                                          Number(data?.textLevyPenalty) > 0
                                            ? 'text-danger'
                                            : 'text-black'
                                        }`}
                                      >
                                        ${(Number(data?.textLevyPenalty) || 0).toFixed(2)}
                                      </span>
                                    </>
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </span>
                              </p>
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600  col-md-7 col-7 p-0">
                                  Severance Penalty for the Month
                                </span>
                                <span className="font-bold col-md-2 col-2  td-text-align">
                                  {previewDatapayload.isActive ? (
                                    <>
                                      <span
                                        className={`trigger ${
                                          Number(data?.textPEPenalty) > 0
                                            ? 'text-danger'
                                            : 'text-black'
                                        }`}
                                      >
                                        ${(Number(data?.textPEPenalty) || 0).toFixed(2)}
                                      </span>
                                    </>
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </span>
                              </p>
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600  p-0  col-md-7 col-7">
                                  Total Accountant General
                                </span>
                                <span className="font-bold col-md-2 col-2 td-text-align">
                                  <span className="trigger ">
                                    {previewDatapayload.isActive ? (
                                      <>
                                        ${Number(data.textTotalAccountantGeneral || 0).toFixed(2)}
                                      </>
                                    ) : (
                                      <>&nbsp;</>
                                    )}
                                  </span>
                                </span>
                              </p>
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600  p-0  col-md-7 col-7">
                                  Social Security Contribution Due for the Month
                                </span>
                                <span className="font-bold col-md-2 col-2 td-text-align">
                                  <span className="trigger ">
                                    {previewDatapayload.isActive ? (
                                      <>${Number(data.textSSContribution || 0).toFixed(2)}</>
                                    ) : (
                                      <>&nbsp;</>
                                    )}
                                  </span>
                                </span>
                              </p>
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600  p-0 col-md-7 col-7">
                                  Fine Due for the Month(if Any)
                                </span>
                                <span className="font-bold col-md-2 col-2 td-text-align">
                                  {previewDatapayload.isActive ? (
                                    <>
                                      <span
                                        className={`trigger ${
                                          Number(data?.textSSPenalty) > 0
                                            ? 'text-danger'
                                            : 'text-black'
                                        }`}
                                      >
                                        ${(Number(data?.textSSPenalty) || 0).toFixed(2)}
                                      </span>
                                    </>
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </span>
                              </p>
                              <p className="mb-0 row border-dotted align-items-center f-14">
                                <span className="f-600 p-0 col-md-7 col-7">
                                  Total Social Security Remittances Due for the Month
                                </span>
                                <span className="font-bold col-md-2 col-2 td-text-align">
                                  <span className="trigger ">
                                    {previewDatapayload.isActive ? (
                                      <>${Number(data.texttotalSS || 0).toFixed(2)}</>
                                    ) : (
                                      <>&nbsp;</>
                                    )}
                                  </span>
                                </span>
                                {/* <span className="font-bold col-md-2 col-2"></span> */}
                              </p>
                              <div className="col-md-10 col-10 d-flex mt-4">
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
                                {/* <button
                                  className="btn btn-success waves-effect waves-light h-45"
                                  type="button"
                                  onClick={() => save()}
                                  disabled={isLoading || isSubmitted}
                                >
                                  {isLoading ? (
                                    <>
                                      <Spinner color="dark" size="sm" /> Loading...
                                    </>
                                  ) : (
                                    <>
                                      &nbsp;Save &amp; Submit <i className="far fa-save"></i>
                                    </>
                                  )}
                                </button> */}

                                <button
                                  type="button"
                                  className="btn btn-info waves-effect waves-light h-45 btn btn-secondary"
                                  onClick={handleShow}
                                >
                                  <i className="dripicons-print" /> &nbsp;
                                  <span>Print</span>
                                </button>

                                {/* <button
                                  type="button"
                                  className="h-45 btn btn-light"
                                  onClick={() => navigate('/apps/C3/C3Generation')}
                                >
                                  <i className="fas fa-times" /> Cancel
                                </button> */}
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
                                  onClick={() => {
                                    previewShow(false);
                                    setErrorDataModalOpen(false);
                                  }}
                                  // onClick={() => {previewShow(false), setErrorDataModalOpen(false)}}
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
              {/* container-fluid */}
            </div>
            {/* End Page-content */}
            <sidebar-barrrrr></sidebar-barrrrr>
          </div>
          {/* end main content*/}
        </div>
      </div>

      {/* PopUp Start   */}
      <Modal isOpen={show} size="xl" onHide={handleClose}>
        <ModalHeader toggle={handleClose}>
          <h2>Report </h2>
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-xl-12">
              <div ref={targetRef}>
                <div className="card">
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
                              {data?.company_name}
                            </td>

                            <th className="label-cell fix-width" colSpan="1">
                              Trade Name
                            </th>
                            <td className="value-cell" colSpan="6">
                              {data?.trade_name}
                            </td>

                            <th className="label-cell text-end" colSpan="2">
                              Employer&#39;s Registration No.
                            </th>
                            <td className="value-cell-border" colSpan="2">
                              {data?.company_reg_no}
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
                              {data?.company_address}
                            </td>

                            <th className="label-cell text-end" colSpan="2">
                              Employees(s)
                            </th>
                            <td className="value-cell-border" colSpan="2">
                              {previewDatapayload.isActive ? (
                                <> {(data?.allEmployeeList_List ?? []).length}</>
                              ) : (
                                <>&nbsp;</>
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
                              {data?.monthName} - {data?.year}
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
                              {previewDatapayload.isActive ? (
                                <> ${Number(data.texttotalSS || 0)?.toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                            <th className="label-cell " colSpan="1"></th>
                            <th className="label-cell " colSpan="1"></th>

                            <th className="label-cell " colSpan="3">
                              (2) Accountant General
                            </th>
                            <td className="value-cell cell-center" colSpan="2">
                              {previewDatapayload.isActive ? (
                                <> ${Number(data.textAccountantGeneral || 0)?.toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>

                            <th className="label-cell " colSpan="1"></th>
                            <th className="label-cell " colSpan="2"></th>

                            <th className="label-cell " colSpan="1">
                              Total
                            </th>
                            <td className="value-cell cell-center" colSpan="1">
                              {previewDatapayload.isActive ? (
                                <> ${Number(data.txt_GrandTotal || 0)?.toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <span className="report_logo">
                      <img src={ReportLogo} alt="ReportLogo" />
                    </span>
                    {data.isNilReturn === true && (
                      <span className="Paid_Image">
                        <img src={NillImage} alt="Submitted" width={20} height={20} />
                      </span>
                    )}
                    <div className="table-responsive mt-2 new_data draft">
                      <table className="table custom_tables table-hover table-bordered mb-0 white-space2 mb-1 report-table">
                        <div className="draft-img1"></div>

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
                            <th style={{ maxWidth: '150px' }} colSpan={5} className="td-text-align">
                              (6a) <br />
                              Put X in the Week(s) Worked or Week(s) Holiday/Other Pay was made
                            </th>
                            <th colSpan={7} className="td-text-align">
                              (6b) <br />
                              In accordance with the pay Schedule indicated in Column 5, record
                              Wages/Salaries in respect of the weeks worked or in the case of
                              Holiday pay/Other Pay, record in the weeks for which the payment
                              applies
                            </th>
                            <th rowSpan={2} className="td-text-align">
                              (7) <br />
                              Total Wages/Salaries Paid for the month
                            </th>
                            <th rowSpan={2} className="td-text-align">
                              (8) <br />
                              Deduct levy from Wages of employee. See note 9 for exemption
                            </th>
                            <th rowSpan={2} className="td-text-align">
                              (9) <br />
                              Total So. Sec. 11% or 1% of Wages/Salaries of each employee. See note
                              8
                            </th>
                            <th style={{ minWidth: '150px' }} rowSpan={2} colSpan={2}>
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
                          {data.isNilReturn === true // Show 10 blank rows
                            ? Array.from({ length: 10 }).map((_, index) => (
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
                            : previewDatapayload?.data?.allEmployeeList_List?.map((row, index) => (
                                <tr key={index}>
                                  <td className="td-text-align">{index + 1}</td>
                                  <td>{row.ssn}</td>
                                  <td>{row.employeeName}</td>
                                  <td>{row.t_C_Date || ''}</td>
                                  <td>{row.payFreq}</td>
                                  <td className="td-text-align">{row.isSelectedWEEK1 || ''}</td>
                                  <td className="td-text-align">{row.isSelectedWEEK2 || ''}</td>
                                  <td className="td-text-align">{row.isSelectedWEEK3 || ''}</td>
                                  <td className="td-text-align">{row.isSelectedWEEK4 || ''}</td>
                                  <td className="td-text-align">{row.isSelectedWEEK5 || ''}</td>

                                  <td className="td-text-align">
                                    ${(Number(row.wageS1) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.wageS2) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.wageS3) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.wageS4) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.wageS5) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.hpay) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.bonus) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.totalWadeges) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.levyee) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.socialSecurity) || 0).toFixed(2)}
                                  </td>

                                  <td colSpan={2}>{row.remarks || ''}</td>
                                </tr>
                              ))}

                          <tr>
                            <td colSpan={17}>
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
                            <td className="td-text-align">
                              {previewDatapayload.isActive ? (
                                <> ${data.textTotalWages}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>

                            <td className="td-text-align" colSpan={1}>
                              {previewDatapayload.isActive ? (
                                <> ${data?.textTotalWagesNLevy}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                            <td className="amitss" rowSpan={6} colSpan={1}>
                              {/* ${previewData?.data?.totalWages || '0.00'} */}
                            </td>
                            <td rowSpan={9} className="text-center">
                              <span className="text_decoration">FOR OFFICIAL USE ONLY</span>
                              <br />
                              <br />
                              1- DATE RECEIVED
                              <br />
                              <br />
                              <span className="custom_border">II- PAID YES NO</span>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={18}>
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
                              {previewDatapayload.isActive ? (
                                <> ${data.textEmployerLevy}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>

                            {/* <td className="td-text-align" colSpan={1}></td> */}
                          </tr>
                          <tr>
                            <td colSpan={18}>
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
                              {previewDatapayload.isActive ? (
                                <> ${data.textServayance}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={18}>
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

                            <td
                              className={`td-text-align ${
                                Number(data?.textLevyPenalty) > 0 ? 'text-danger' : 'text-black'
                              }`}
                            >
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.textLevyPenalty) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>

                            {/* <td className="td-text-align" colSpan={1}></td> */}
                          </tr>
                          <tr>
                            <td colSpan={18}>
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

                            <td
                              className={`td-text-align ${
                                Number(data?.textPEPenalty) > 0 ? 'text-danger' : 'text-black'
                              }`}
                            >
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.textPEPenalty) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>

                            {/* <td className="td-text-align" colSpan={1}></td> */}
                          </tr>
                          <tr>
                            <td colSpan={18}>
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
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.textTotalAccountantGeneral) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                            {/* <td className="td-text-align" colSpan={1}></td> */}
                          </tr>
                          <tr>
                            <td colSpan={19}>
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
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.texttotalSS) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                            {/* <td rowSpan={4} colSpan={2} className="text-center">
                              II- PAID YES NO
                            </td> */}
                          </tr>
                          <tr>
                            <td colSpan={19}>
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
                                Number(data?.textSSPenalty) > 0 ? 'text-danger' : 'text-black'
                              }`}
                            >
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.textSSPenalty) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={19}>
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
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.texttotalSS) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
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
        </ModalBody>
        <ModalFooter>
          <Button className="h-45 btn btn-light" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="success" onClick={handlePrint}>
            <i className="dripicons-print" /> Print
          </Button>

          {canPrintC3Generation ? (
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
          <div className="row">
            <div className="col-xl-12">
              <div ref={targetRef}>
                <div className="card">
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
                              {data?.company_name}
                            </td>

                            <th className="label-cell fix-width" colSpan="1">
                              Trade Name
                            </th>
                            <td className="value-cell" colSpan="6">
                              {data?.trade_name}
                            </td>

                            <th className="label-cell text-end" colSpan="2">
                              Employer&#39;s Registration No.
                            </th>
                            <td className="value-cell-border" colSpan="2">
                              {data?.company_reg_no}
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
                              {data?.company_address}
                            </td>

                            <th className="label-cell text-end" colSpan="2">
                              Employees(s)
                            </th>
                            <td className="value-cell-border" colSpan="2">
                              {previewDatapayload.isActive ? (
                                <> {(data?.allEmployeeList_List ?? []).length}</>
                              ) : (
                                <>&nbsp;</>
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
                              {data?.monthName} - {data?.year}
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
                              {previewDatapayload.isActive ? (
                                <> ${Number(data.texttotalSS || 0)?.toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                            <th className="label-cell " colSpan="1"></th>
                            <th className="label-cell " colSpan="1"></th>

                            <th className="label-cell " colSpan="3">
                              (2) Accountant General
                            </th>
                            <td className="value-cell cell-center" colSpan="2">
                              {previewDatapayload.isActive ? (
                                <> ${Number(data.textAccountantGeneral || 0)?.toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>

                            <th className="label-cell " colSpan="1"></th>
                            <th className="label-cell " colSpan="2"></th>

                            <th className="label-cell " colSpan="1">
                              Total
                            </th>
                            <td className="value-cell cell-center" colSpan="1">
                              {previewDatapayload.isActive ? (
                                <> ${Number(data.txt_GrandTotal || 0)?.toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* <table className="table table-hover table-bordered mb-0 white-space2 mb-4 report-table"> */}
                    <span className="report_logo">
                      <img src={ReportLogo} alt="ReportLogo" />
                    </span>
                    {data.isNilReturn === true && (
                      <span className="Paid_Image">
                        <img src={NillImage} alt="Submitted" width={20} height={20} />
                      </span>
                    )}

                    <div className="table-responsive new_data draft mt-2">
                      <table className="table custom_tables table-hover table-bordered mb-0 white-space2 mb-1 report-table">
                        {data.h_Id === 0 && data.isNilReturn !== true && (
                          <div className="draft-img1">
                            <img src={draftImage} className="mb-4" width="455" alt="Draft" />
                          </div>
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
                            <th style={{ maxWidth: '150px' }} colSpan={5} className="td-text-align">
                              (6a) <br />
                              Put X in the Week(s) Worked or Week(s) Holiday/Other Pay was made
                            </th>
                            <th colSpan={7} className="td-text-align">
                              (6b) <br />
                              In accordance with the pay Schedule indicated in Column 5, record
                              Wages/Salaries in respect of the weeks worked or in the case of
                              Holiday pay/Other Pay, record in the weeks for which the payment
                              applies
                            </th>
                            <th rowSpan={2} className="td-text-align">
                              (7) <br />
                              Total Wages/Salaries Paid for the month
                            </th>
                            <th rowSpan={2} className="td-text-align">
                              (8) <br />
                              Deduct levy from Wages of employee. See note 9 for exemption
                            </th>
                            <th rowSpan={2} className="td-text-align">
                              (9) <br />
                              Total So. Sec. 11% or 1% of Wages/Salaries of each employee. See note
                              8
                            </th>
                            <th colSpan={2} style={{ minWidth: '150px' }} rowSpan={2}>
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
                          {data.isNilReturn === true
                            ? Array.from({ length: 10 }).map((_, index) => (
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
                            : previewDatapayload?.data?.allEmployeeList_List?.map((row, index) => (
                                <tr key={index}>
                                  <td className="td-text-align">{index + 1}</td>
                                  <td>{row.ssn}</td>
                                  <td>{row.employeeName}</td>

                                  <td>
                                    {row.date_terminated
                                      ? moment(row.date_terminated, 'DD/MM/YYYY').format(
                                          'DD-MMM-YYYY',
                                        )
                                      : ''}
                                  </td>

                                  <td>{row.payFreq}</td>
                                  <td className="td-text-align">{row.isSelectedWEEK1 || ''}</td>
                                  <td className="td-text-align">{row.isSelectedWEEK2 || ''}</td>
                                  <td className="td-text-align">{row.isSelectedWEEK3 || ''}</td>
                                  <td className="td-text-align">{row.isSelectedWEEK4 || ''}</td>
                                  <td className="td-text-align">{row.isSelectedWEEK5 || ''}</td>

                                  <td className="td-text-align">
                                    ${(Number(row.wageS1) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.wageS2) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.wageS3) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.wageS4) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.wageS5) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.hpay) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.bonus) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.totalWadeges) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.levyee) || 0).toFixed(2)}
                                  </td>
                                  <td className="td-text-align">
                                    ${(Number(row.socialSecurity) || 0).toFixed(2)}
                                  </td>

                                  <td colSpan={2}>{row.remarks || ''}</td>
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
                            <td className="td-text-align">
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.textTotalWages) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                            <td className="td-text-align" colSpan={1}>
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.textTotalWagesNLevy) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                            <td className="amit td-text-align" rowSpan={6} colSpan={1}>
                              {/* ${previewData?.data?.totalWages || '0.00'} */}
                            </td>

                            <td rowSpan={9} className="text-center">
                              <span className="text_decoration">FOR OFFICIAL USE ONLY</span>
                              <br />
                              <br />
                              1- DATE RECEIVED
                              <br />
                              <br />
                              <span className="custom_border">II- PAID YES NO</span>
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
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.textEmployerLevy) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                            {/* <td className="td-text-align" colSpan={1}></td> */}
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
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.textServayance) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                            {/* <td className="td-text-align" colSpan={1}></td> */}
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

                            <td
                              className={`td-text-align ${
                                Number(data?.textLevyPenalty) > 0 ? 'text-danger' : 'text-black'
                              }`}
                            >
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.textLevyPenalty) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>

                            {/* <td className="td-text-align" colSpan={1}></td> */}
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
                            <td
                              className={`td-text-align ${
                                Number(data?.textPEPenalty) > 0 ? 'text-danger' : 'text-black'
                              }`}
                            >
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.textPEPenalty) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>

                            {/* <td className="td-text-align" colSpan={1}></td> */}
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
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.textTotalAccountantGeneral) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                            {/* <td className="td-text-align" colSpan={1}></td> */}
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
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.textSSContribution) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
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
                                Number(data?.textSSPenalty) > 0 ? 'text-danger' : 'text-black'
                              }`}
                              colSpan={1}
                            >
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.textSSPenalty) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
                              )}
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
                              {previewDatapayload.isActive ? (
                                <> ${(Number(data?.texttotalSS) || 0).toFixed(2)}</>
                              ) : (
                                <>&nbsp;</>
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
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" className="h-45 btn btn-light" onClick={handleClose2}>
            <i className="fas fa-times"></i> Cancel
          </Button>
          <Button color="success" onClick={handlePrint}>
            <i className="dripicons-print" /> Print
          </Button>
          {canPrintC3Generation ? (
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

      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Action</ModalHeader>
        <ModalBody>{saveMessage}</ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={handleNo}>
            No
          </Button>
          <Button
            color="primary"
            onClick={() =>
              updateAdd({
                h_Id: headerid,
                is_Preview: true,
                isRecordEdit: true,
                companyId: CompanyId,
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

      <Modal isOpen={isModalOpenSave} toggle={toggleModalSave}>
        <ModalHeader toggle={toggleModalSave}>Confirm Action</ModalHeader>
        <ModalBody>{saveMessage}</ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={toggleModalSave}>
            No
          </Button>
          <Button
            color="primary"
            onClick={() =>
              SaveLocally({
                h_Id: headerid,
                is_Preview: true,
                isRecordEdit: true,
                companyId: CompanyId,
                schedule_no: data.schedule_no,
              })
            }
          >
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

      <Modal
        isOpen={errorDataModalOpenException}
        toggle={() => setErrorDataModalOpenException(false)}
      >
        <ModalHeader toggle={() => setErrorDataModalOpenException(false)}>
          Exception Details
        </ModalHeader>

        <ModalBody>
          <Label>
            There are a few employees not associated with you, so you cannot save the details of
            this C3 media file.
          </Label>
        </ModalBody>

        <ModalFooter>
          <Button className="btn-light" onClick={() => setErrorDataModalOpenException(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <CustomModal
        isOpen={errorDataModalOpen}
        toggle={() => setErrorDataModalOpen(false)}
        title=" Action  Confirm "
        message={errorModalMessage}
        showClose
      />

      <UnsavedPayGuard payData={payData} hideToggle={hideToggle}></UnsavedPayGuard>
    </>
  );
};
export default PerviewC3;
