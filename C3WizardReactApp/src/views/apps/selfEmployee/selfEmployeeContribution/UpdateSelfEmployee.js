import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useNavigate, Link, useLocation } from 'react-router-dom';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import { debounce } from 'lodash';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Label,
  Input,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  createSelfContribution,
  saveSelfContribution,
  saveSelfContributionPreview,
  getList,
  updateOnChange,
  ExportCThreeData,
  ExportCThree,
} from '../../../../store/apps/selfEmployee/selfEmployeeContribution/SelfEmployeeContributionSlice';
import { clearMessage, setMessage } from '../../../../store/apps/message/MessageSlice';
import {
  getDashboardList,
  previewNWData,
} from '../../../../store/apps/selfEmployee/dashboard/SelfDashboardSlice';
import Loader from '../../../../layouts/loader/Loader';
import ReportLogo from '../../../../assets/images/users/Reportlogo.jpg';

const UpdateSelfEmployee = () => {
  const [isLoading, setIsLoading] = useState(false);
  const companyId = localStorage.getItem('companyId');
  const userId = localStorage.getItem('userID');
  const userName = localStorage.getItem('userId');
  const userPassword = localStorage.getItem('userPassword');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpens, setIsModalOpens] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [exportItems, setExportItems] = useState({});
  const toggleModal1 = () => setIsModalOpen(!isModalOpens);
  const UserName = localStorage.getItem('userName');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const UserId = localStorage.getItem('userID');
  const CompanyId = localStorage.getItem('companyId');
  const { SelfEmployeeData, SelfContributionList, EditDataList } = useSelector(
    (state) => state.selfEmployeeContributionSlice || {},
  );
  const {
    DashboardData,
    previewNWDataList,
    loading: reduxLoading,
  } = useSelector((state) => state.selfDashboardSlice);
  const isAnyLoading = isLoading || reduxLoading;
  const { message, type } = useSelector((state) => state.messageReducer);
  const [Year, setYear] = useState('');
  const [monthIndex, setMonthIndex] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const location = useLocation();
  const { id } = location.state || {};
  const headerId = id;
  const handleYearChange = (e) => setYear(Number(e.target.value));
  const handleMonthChange = (e) => setMonthIndex(Number(e.target.value));
  const [selectData, setSelectedData] = useState('');
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [dropNo, setDropNo] = useState(0);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles.find(
    (role) => role.description === 'SELF EMPLOYEE CONTRIBUTION',
  );
  const canPrintSelfEmployee = employerPermission?.is_Print;
  const canSubmittedSelfEmployee = employerPermission?.is_Submitted;
  const canViewSElfEmployee = employerPermission?.viewPermission;

  const [onChangeData, setOnChangeData] = useState({
    indexListNo: 0,
    dropNo: 0,
    year: '0',
    month: 0,
    ssNofEmp: '',
    userName: '',
    address: 'string',
    textTotalWages: '',
    textTotalWagesNLevy: '',
    textLevyPenalty: '',
    wcontribution: 150,
    wincome: 1500,
    textTotalAccountantGeneral: '',
    obj_list: [
      {
        contid: 0,
        c3HEADERID: 0,
        ssn: 'string',
        ssnd: 'string',
        employeeId: 0,
        employeeName: 'string',
        period_Month: 'string',
        period_year: 'string',
        payFreq: 'string',
        isSelectedWEEK1: 'string',
        isSelectedWEEK2: 'string',
        isSelectedWEEK3: 'string',
        isSelectedWEEK4: 'string',
        isSelectedWEEK5: 'string',
        empSalary: 0,
        wage_Amt: 0,
        wageS1: 0,
        wageS2: 0,
        wageS3: 0,
        wageS4: 0,
        wageS5: 0,
        tempWAGES1: 0,
        tempWAGES2: 0,
        tempWAGES3: 0,
        tempWAGES4: 0,
        tempWAGES5: 0,
        hpay: 0,
        otherPAY: 0,
        directorWagesPAY: 0,
        isHPAY: 'string',
        bonus: 0,
        totalWadeges: 0,
        weeK1: true,
        weeK2: true,
        weeK3: true,
        weeK4: true,
        weeK5: true,
        selectedTypeWEEK1: 0,
        selectedTypeWEEK2: 0,
        selectedTypeWEEK3: 0,
        selectedTypeWEEK4: 0,
        selectedTypeWEEK5: 0,
        isWeekfifth: true,
        emp_add_remove: true,
        isRemarkDisable: true,
        isemployeeDirector: true,
        isLevyExempt: true,
        levyee: 0,
        socialSecurity: 0,
        sS_Fines: 0,
        sS_Employee: 0,
        sS_Employer: 0,
        levy_Penalty: 0,
        servayance: 0,
        servayancE_PENALTY: 0,
        date_Joining: 'string',
        date_terminated: 'string',
        birthDate: 'string',
        t_C_Date: 'string',
        remarks: 'string',
        dirRemarks: 'string',
        department: 'string',
        payPeriod: 'string',
        hPay_Week1: 0,
        hPay_Week2: 0,
        hPay_Week3: 0,
        hPay_Week4: 0,
        hPay_Week5: 0,
      },
    ],
  });

  const year = Year;

  useEffect(() => {
    if (canViewSElfEmployee === false) {
      navigate('/login');
    }
  }, [canViewSElfEmployee, navigate]);


  useEffect(() => {
    let timer;

    if (headerId && CompanyId) {
      // Start loading
      setIsLoading(true);

      // Dispatch your API call
      dispatch(getList({ headerId, CompanyId })).finally(() => {
        // Set a timeout to show the loader for at least 10 seconds
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 1000); // 10 seconds
      });
    }

    // Cleanup timeout when component unmounts or reruns
    return () => clearTimeout(timer);
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
  const Yearint = +EditDataList?.year;
  const ssNofEmp = +EditDataList?.ssNofEmp;
  const headerIdInt = +headerId;
  const UserIdInt = +UserId;
  const [data, setData] = useState({});
  useEffect(() => {
    setData({
      ...EditDataList,
      userID: UserIdInt,
      year: Yearint,
      ssNofEmp,
      h_Id: headerIdInt,
    });

    setOnChangeData({
      ...EditDataList,
      indexListNo: 50,
      dropNo: 50,
      userID: UserIdInt,
      year: String(Yearint),
      ssNofEmp: String(ssNofEmp),
      h_Id: headerIdInt,
    });
  }, [EditDataList]);

  console.log('datagetdata', data);

  const handleSubmit = () => {
    setLoading(true);
    const formData = {
      Year,
      monthIndex,
      H_Id: 0, // Assuming H_Id is fixed or comes from elsewhere
      CompanyId: 3, // Assuming CompanyId is fixed or comes from elsewhere
    };

    dispatch(createSelfContribution({ formData }))
      .unwrap()
      .then((res) => {
        console.log('res', res);
        // navigate('/apps/director/NwDirectorPayroll');
      })
      .catch((err) => {
        console.log('Error occurred:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSaveSubmit = () => {
    setLoadingSubmit(true);
    dispatch(saveSelfContribution({ data }))
      .unwrap()
      .then((res) => {
        console.log('res', res);
        setIsSaved(true);
      })
      .catch((err) => {
        console.log('Error occurred:', err);
      })
      .finally(() => {
        setLoadingSubmit(false);
      });
  };

  const handleSaveAndSubmit = () => {
    setLoadingSubmit(true);
    const payload = {
      SSNofEmp: data.ssNofEmp, // Adjusted to match API parameter names
      Headerid: data.h_Id,
      period_Month: data.month, // Keep as API expects
      Period_year: data.year, // Keep as API expects
      companyId,
      UserLoginID: userName,
      User_Password: userPassword,
      userId,
    };
    dispatch(ExportCThree(payload)) // 👈 Replace with your actual submit API call
      .unwrap()
      .then(() => {
        setIsSaved(true); // Optional: reset back to Save
        setIsSubmitted(true);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoadingSubmit(false));
  };

  const handleShow2 = async () => {
    setLoadings(true);
    try {
      const saveResponse = await dispatch(saveSelfContributionPreview({ data })).unwrap();
      console.log('saveSelfContribution response:', saveResponse);

      const previewResponse = await dispatch(
        previewNWData({ headerId, year: EditDataList?.year, monthNo: EditDataList?.month }),
      ).unwrap();
      console.log('previewNWData response:', previewResponse);

      setShow2(true);
      setLoadings(false);
    } catch (error) {
      console.error('Error in API calls:', error);
    }
  };

  const handleWeekChange = async (e, headerIdd) => {
    const selectedValue = e.target.value;

    setOnChangeData((prevData) => ({
      ...prevData,
      ...data,
      dropNo: parseInt(selectedValue, 10),
      year: EditDataList?.year,
      indexListNo: headerIdd,
      month: EditDataList.month,
      textLevyPenalty: EditDataList.textLevyPenalty,
      textTotalWages: EditDataList.textTotalWages,
      ssNofEmp: EditDataList.ssNofEmp.toString(),
      address: '',
    }));
  };

  const handleRemarksChange = (e, index) => {
    const { value } = e.target;

    setOnChangeData((prevData) => ({
      ...prevData,
      obj_list:
        prevData?.obj_list?.map((obj, i) => (i === index ? { ...obj, remarks: value } : obj)) || [],
    }));
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // Skip the first render
      return;
    }

    // setLoading(true);
    dispatch(updateOnChange({ onChangeData }))
      .unwrap()
      .then((res) => {
        console.log('resres', res.data);
        setData({
          ...res.data,
          userID: UserIdInt,
          year: Yearint,
          ssNofEmp,
          h_Id: headerIdInt,
        });
        // setLoading(false);
        console.log('Data updated successfully');
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  }, [onChangeData]);

  const isSelfEmployeeSubmitted = (selectedYear, month) => {
    setExportItems({
      headerId,
      month,
      year: selectedYear,
    });

    setIsModalOpens(true); // Open the modal
  };

  const isSubmitC3 = () => {
    if (!exportItems) return;

    dispatch(ExportCThreeData({ exportItems }))
      .unwrap()
      .then(async (response) => {
        console.log(response); // Debugging
        setIsModalOpens(false);
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
      });
  };

  const onCanceled = () => {
    setIsModalOpens(false);
  };

  const printRef = useRef();

  const { toPDF, targetRef } = usePDF({
    filename: 'SocialSecurityReport.pdf',
    page: {
      format: 'letter', // 8.5 x 11 inches
      orientation: 'portrait',
      margin: 8,
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

  return (
    <div id="layout-wrapper">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <ul className="d-flex align-items-center gap-2 mt-3 list-unstyled">
          <li className="fw-medium">
            <Link to="/apps/dashboards" className="d-flex align-items-center gap-1 text-muted">
              <i className="ti-home" />
              Dashboard{' '}
            </Link>
          </li>

          <li>-</li>
          <li className="fw-medium"> Generate Self Employee C3 </li>
        </ul>
      </div>

      <div className="main-content">
        {isAnyLoading ? (
          <Loader />
        ) : (
          <>
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
                                Generate Self Employed C3
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-5 col-lg-5 col-xl-5">
                              <div className="mb-3">
                                <Label>Month & Year </Label>
                                <DatePicker
                                  selected={
                                    EditDataList?.year != null && EditDataList?.month != null
                                      ? new Date(EditDataList.year, EditDataList.month - 1, 1)
                                      : null
                                  }
                                  dateFormat="MMMM yyyy"
                                  showMonthYearPicker
                                  className="form-control"
                                  readOnly
                                  disabled
                                />
                              </div>
                            </div>

                            <div className="col-md-3 col-lg-3 col-xl-3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header py-3 bg_ligh">
                          <div className="row align-items-center d-flex"></div>
                        </div>
                        <div className="card-header py-2 bg_ligh">
                          <div className="row">
                            <div className="col-md-3 col-12 text-lg-end"></div>
                            <div className="col-md-9 col-12 text-lg-end">
                              <Button
                                className="btn btn-success waves-effect waves-light h-45"
                                type="button"
                                onClick={() =>
                                  isSelfEmployeeSubmitted(EditDataList.year, EditDataList.month)
                                }
                              >
                                <i className="fa fa-download"></i> &nbsp; Export EC3
                              </Button>
                              <Button
                                className="btn btn-info waves-effect waves-light h-45"
                                type="button"
                                disabled={loadings}
                                onClick={() =>
                                  handleShow2(
                                    EditDataList.headerId,
                                    EditDataList.year,
                                    EditDataList.month,
                                  )
                                }
                              >
                                {loadings ? (
                                  <Spinner color="dark" size="sm">
                                    Loading...
                                  </Spinner>
                                ) : (
                                  <i className="far fa-eye"></i>
                                )}{' '}
                                &nbsp; Preview
                              </Button>

                              <Button
                                onClick={isSaved ? handleSaveAndSubmit : handleSaveSubmit}
                                disabled={loadingSubmit || isSubmitted}
                                className="btn btn-success waves-effect waves-light h-45"
                                type="submit"
                              >
                                {loadingSubmit ? (
                                  <>
                                    <Spinner size="sm" /> {isSaved ? 'Submitting...' : 'Saving...'}
                                  </>
                                ) : (
                                  <>
                                    <i className="far fa-save"></i> {isSaved ? 'Submit' : 'Save'}
                                  </>
                                )}
                              </Button>
                              <Link to="/apps/selfEmployeeContribution">
                                <Button className="h-45 btn btn-light">
                                  <i className="fas fa-times" /> Close
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>

                        <div className="card-body">
                          <div className="table-responsive">
                            <table className="table table-hover mb-0">
                              <thead>
                                <tr className="border-b">
                                  <th>SSN</th>
                                  <th>Employee Name</th>

                                  <th>Week 1</th>
                                  <th>Week 2</th>
                                  <th>Week 3</th>
                                  <th>Week 4</th>
                                  <th>Week 5</th>
                                  <th>Income</th>
                                  <th>Contribution</th>
                                  <th>Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data && data?.obj_list?.length > 0 ? (
                                  data?.obj_list?.map((item, index) => (
                                    <tr key={item}>
                                      <td>{item?.ssn}</td>
                                      <td>{item?.employeeName ?? 'N/A'}</td>

                                      <td>
                                        <div className="input_change">
                                          <div className="input-groups">
                                            <select
                                              className="form-select"
                                              id="selectedTypeWEEK1"
                                              name="selectedTypeWEEK1"
                                              value={item?.selectedTypeWEEK1}
                                              onChange={(e) => handleWeekChange(e, 1)}
                                              style={{
                                                height: '30px',
                                                minWidth: '50px',
                                                borderRadius: '5px 0px 0px 5px',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                              }}
                                            >
                                              <option value={0}>X</option>
                                              <option value={1}>S</option>
                                              <option value={2}>M</option>
                                              <option value={3}>U</option>
                                            </select>
                                          </div>
                                          <div>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="00.00"
                                              style={{
                                                height: '30px',
                                                borderRadius: '0px 5px 5px 0px',
                                                maxWidth: '50px',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                              }}
                                              value={(item?.wageS1 ?? 0).toFixed(2)}
                                              disabled
                                            />
                                          </div>
                                        </div>
                                      </td>

                                      <td>
                                        <div className="input_change">
                                          <div className="input-groups">
                                            <select
                                              className="form-select"
                                              id="selectedTypeWEEK2"
                                              name="selectedTypeWEEK2"
                                              value={item.selectedTypeWEEK2}
                                              onChange={(e) => handleWeekChange(e, 2)}
                                              style={{
                                                height: '30px',
                                                minWidth: '50px',
                                                borderRadius: '5px 0px 0px 5px',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                              }}
                                            >
                                              <option value={0}>X</option>
                                              <option value={1}>S</option>
                                              <option value={2}>M</option>
                                              <option value={3}>U</option>
                                            </select>
                                          </div>
                                          <div>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="00.00"
                                              style={{
                                                height: '30px',
                                                borderRadius: '0px 5px 5px 0px',
                                                maxWidth: '50px',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                              }}
                                              value={(item?.wageS2 ?? 0).toFixed(2)}
                                              disabled
                                            />
                                          </div>
                                        </div>
                                      </td>

                                      <td>
                                        <div className="input_change">
                                          <div className="input-groups">
                                            <select
                                              className="form-select"
                                              id="selectedTypeWEEK3"
                                              name="selectedTypeWEEK3"
                                              value={item.selectedTypeWEEK3}
                                              style={{
                                                height: '30px',
                                                minWidth: '50px',
                                                borderRadius: '5px 0px 0px 5px',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                              }}
                                              onChange={(e) => handleWeekChange(e, 3)}
                                            >
                                              <option value={0}>X</option>
                                              <option value={1}>S</option>
                                              <option value={2}>M</option>
                                              <option value={3}>U</option>
                                            </select>
                                          </div>
                                          <div>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="00.00"
                                              style={{
                                                height: '30px',
                                                borderRadius: '0px 5px 5px 0px',
                                                maxWidth: '50px',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                              }}
                                              value={(item?.wageS3 ?? 0).toFixed(2)}
                                              disabled
                                            />
                                          </div>
                                        </div>
                                      </td>

                                      <td>
                                        <div className="input_change">
                                          <div className="input-groups">
                                            <select
                                              className="form-select"
                                              id="selectedTypeWEEK4"
                                              name="selectedTypeWEEK4"
                                              value={item.selectedTypeWEEK4}
                                              style={{
                                                height: '30px',
                                                minWidth: '50px',
                                                borderRadius: '5px 0px 0px 5px',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                              }}
                                              onChange={(e) => handleWeekChange(e, 4)}
                                            >
                                              <option value={0}>X</option>
                                              <option value={1}>S</option>
                                              <option value={2}>M</option>
                                              <option value={3}>U</option>
                                            </select>
                                          </div>
                                          <div>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="00.00"
                                              style={{
                                                height: '30px',
                                                borderRadius: '0px 5px 5px 0px',
                                                maxWidth: '50px',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                              }}
                                              value={(item?.wageS4 ?? 0).toFixed(2)}
                                              disabled
                                            />
                                          </div>
                                        </div>
                                      </td>

                                      <td>
                                        <div className="input_change">
                                          <div className="input-groups">
                                            <select
                                              className="form-select"
                                              id="selectedTypeWEEK5"
                                              name="selectedTypeWEEK5"
                                              value={item.selectedTypeWEEK5}
                                              onChange={(e) => handleWeekChange(e, 5)}
                                              style={{
                                                height: '30px',
                                                minWidth: '50px',
                                                borderRadius: '5px 0px 0px 5px',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                              }}
                                            >
                                              <option value={0}>X</option>
                                              <option value={1}>S</option>
                                              <option value={2}>M</option>
                                              <option value={3}>U</option>
                                            </select>
                                          </div>
                                          <div>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="00.00"
                                              style={{
                                                height: '30px',
                                                borderRadius: '0px 5px 5px 0px',
                                                maxWidth: '50px',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                              }}
                                              value={(item?.wageS5 ?? 0).toFixed(2)}
                                              disabled
                                            />
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder=""
                                          style={{
                                            height: '30px',
                                            minWidth: '60px',
                                            maxWidth: '90px',
                                          }}
                                          value={`$${(item?.totalWadeges ?? 0).toFixed(2)}`}
                                          disabled
                                        />
                                      </td>

                                      <td>
                                        <div>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder=""
                                            style={{
                                              height: '30px',
                                              minWidth: '60px',
                                              maxWidth: '90px',
                                            }}
                                            // value={item?.levyee}
                                            value={`$${(item?.levyee ?? 0).toFixed(2)}`}
                                            disabled
                                          />
                                        </div>
                                      </td>

                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          name="remarks"
                                          Value={item?.remarks}
                                          onInput={(e) => handleRemarksChange(e, index)}
                                          // onBlur={(e) => handleRemarksChange(e, index)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              handleRemarksChange(e, index);
                                            }
                                          }}
                                          style={{
                                            height: '30px',
                                            minWidth: '50px',
                                            maxWidth: '150px',
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="12" className="text-center">
                                      No Records Found
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      
                        <div className="card my-3">
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
                                    <span className="f-600 col-md-7 col-7 p-0">
                                      a) Total Income
                                    </span>

                                    <span className="font-bold col-md-2 col-2 td-text-align ">
                                      <span className="trigger">
                                        ${Number(data?.textTotalWages ?? 0).toFixed(2)}
                                      </span>
                                    </span>
                                  </p>
                                  <p className="mb-0 row border-dotted align-items-center f-14">
                                    <span className="f-600 col-md-7 col-7 p-0">
                                      b) Total Contribution
                                    </span>

                                    <span className="font-bold col-md-2 col-2 td-text-align ">
                                      <span className="trigger">
                                        <span className="td-text-align trigger">
                                          ${Number(data?.textTotalWagesNLevy ?? 0).toFixed(2)}
                                        </span>
                                      </span>
                                    </span>
                                  </p>
                                  <p className="mb-0 row border-dotted align-items-center f-14">
                                    <span className="f-600 col-md-7 col-7 p-0">c) Fines</span>

                                    <span className="font-bold col-md-2 col-2 td-text-align ">
                                      <span
                                        className={`td-text-align ${
                                          Number(data?.textLevyPenalty) > 1 ? 'text-danger' : ''
                                        }`}
                                      >
                                        ${Number(data?.textLevyPenalty ?? 0).toFixed(2)}
                                      </span>
                                    </span>
                                  </p>
                                  <p className="mb-0 row border-dotted align-items-center f-14">
                                    <span className="f-600 col-md-7 col-7 p-0">
                                      d) Total Contribution and Fine due to the Accountant General
                                    </span>
                                    {/* <span className="f-400 col-md-3 col-3 p-0">
                                -------------------------------------------
                              </span> */}
                                    <span className="font-bold col-md-2 col-2 td-text-align ">
                                      <span className="trigger">
                                        ${Number(data?.textTotalAccountantGeneral ?? 0).toFixed(2)}
                                      </span>
                                    </span>
                                  </p>
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
          </>
        )}
      </div>

      {/* END layout-wrapper */}
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
                                                {previewNWDataList?.data?.[0]?.currentMonth}
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
                                            <td
                                              className={`text-end ${
                                                Number(previewNWDataList?.data?.[0]?.fine) > 1
                                                  ? 'text-danger'
                                                  : 'text-dark'
                                              }`}
                                            >
                                              $
                                              {Number(
                                                previewNWDataList?.data?.[0]?.fine ?? 0,
                                              ).toFixed(2)}
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
      <Modal isOpen={isModalOpens} toggle={toggleModal1}>
        <ModalHeader toggle={toggleModal1}>Confirm Action</ModalHeader>
        <ModalBody>Do you want to Export this C3 ?</ModalBody>
        <ModalFooter>
          <Button className="btn-light" color="secondary" onClick={onCanceled}>
            No
          </Button>
          <Button color="primary" onClick={isSubmitC3}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default UpdateSelfEmployee;
