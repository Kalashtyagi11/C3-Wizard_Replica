import { Helmet } from 'react-helmet';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Label, Spinner } from 'reactstrap';
//import { Label } from 'reactstrap';
import * as Icon from 'react-feather';
import {
  getContribution,
  previewAllData,
  ImportCThree,
  ImportCThreeLatest,
  getLoaddashboardPaymentStatus,
} from '../../../store/apps/dashboard/DashboardSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';

const Transection = () => {
  const [show, setShow] = useState(false);
  const [headerId, setHeaderId] = useState(null);
  const [periodYear, setPeriodYear] = useState(null);
  const [periodMonth, setPeriodMonth] = useState(null);
  const CompanyId = localStorage.getItem('companyId');
  const userId = localStorage.getItem('userID');
  const userName = localStorage.getItem('userId');
  const userPassword = localStorage.getItem('userPassword');
  const UserName = localStorage.getItem('userName');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    setCurrentDateTime(moment().format('YYYY-MMM-DD HH:mm:ss'));
  }, []);

  const [selectedCheckbox, setSelectedCheckbox] = useState('inlineCheckbox1');
  const handleCheckboxChange = (checkboxId) => {
    setSelectedCheckbox(checkboxId === selectedCheckbox ? null : checkboxId);
  };

  const [params, setParams] = useState({
    month: null,
    year: null,
    companyId: parseInt(localStorage.getItem('companyId'), 10),
    c3HeaderId: null,
  });

  const dispatch = useDispatch();
   // const companyId = localStorage.getItem('companyId');
  const companyId = 2;
  const { message, type } = useSelector((state) => state.messageReducer);
  const { ContributionCount, LoaddashboardPayment } = useSelector((state) => state.dashboardSlice);
  const { previewData } = useSelector((state) => state.dashboardSlice);
  const getDate = new Date();
  const [Year, setYear] = useState(getDate.getFullYear().toString());
  const [FromMonth, setFromMonth] = useState('');
  const [ToMonth, setToMonth] = useState('');

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

  //   useEffect(() => {
  //     if (companyId) {
  //       dispatch(getContribution({ companyId, ResultArea: 'R', FromMonth, ToMonth, Year }));
  //     }
  //     console.log('ContributionCount', ContributionCount);
  //   }, [Year, FromMonth, ToMonth]);

  useEffect(() => {
    

    dispatch(
      getLoaddashboardPaymentStatus({ companyId, ResultArea: 'D', FromMonth, ToMonth, Year }),
    );

    console.log('LoaddashboardPaymentttttttt', LoaddashboardPayment?.dashboard_list);
  }, [Year, FromMonth, ToMonth]);

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


  // const filteredData = LoaddashboardPayment?.dashboard_list?.payDetails?.transactionStatus?.filter((item) => {
  //   if (!statusFilter) return true; // Show all if no filter is selected
  //   return item.status === statusFilter;
  // });


  const mapTransactionStatus = (status) => {
    switch (status?.toLowerCase()) {
        case "created":
            return "Pending";
        case "cancel":
            return "Cancelled";
        case "completed":
            return "Completed";
        case "failed":
            return "Failed";
        case "refunded":
            return "Refunded";
        default:
            return "Unknown";
    }
};
const filteredList = LoaddashboardPayment?.dashboard_list?.filter((item) => {
  const matchesYear = selectedYear ? item.period_year === selectedYear : true;

  const matchesStatus = selectedStatus
    ? item.payDetails?.some(detail => detail.transactionStatus === selectedStatus)
    : true;

  return matchesYear && matchesStatus;
});




  return (
    <>
      <Helmet>
        <title>Reports - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
       
        <sidebar-barrrrrr></sidebar-barrrrrr>
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="page-content-wrapper">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                  {/* <h5 className="fw-semibold mb-0"> Report </h5> */}
                  <ul className="d-flex align-items-center gap-2 list-unstyled">
                    <li className="fw-medium">
                      <span className="d-flex align-items-center gap-1 text-muted">
                        {' '}
                        <span className="ti-home" /> Dashboard{' '}
                      </span>
                    </li>
                    <li>-</li>
                    <li className="fw-medium">
                      <span className="d-flex align-items-center gap-1 text-muted">C3</span>
                    </li>
                    <li>-</li>
                    <li className="fw-medium">Transaction Report </li>
                  </ul>
                </div>
      

                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-header py-3 bg_ligh">
                      <div className="row">
                      <div className="col-xl-6">
                        <h4 className="header-title mb-0 text-success">Transaction Report </h4>
                   
</div>
<div className="col-xl-6 text-end d-flex align-items-center justify-content-end">
<select
    className="form-select w-auto me-4"
    onChange={(e) => setSelectedStatus(e.target.value)}
    value={selectedStatus}
  >
    <option value="">All</option>
    <option value="CREATED">Created</option>
    <option value="Cancel">Cancelled</option>
  </select>
  <select
      className="form-select"
      style={{ width: '150px' }}
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
    >
      <option value="">All Years</option>
      {[...new Set(LoaddashboardPayment?.dashboard_list?.map(item => item.period_year))]
        .filter(year => !!year)
        .map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
    </select>
    </div>
    </div>
                      </div>
                     
                      
                      <div className="card-body pt-1">
                        <div className="table-responsive">
                          <table className="table table-hover mb-0  white-space  tableword-wrap">
                            <thead>
                              <tr className="border-b">
                                <th>Month</th>
                                <th>Year</th>
                                <th>Wages</th>
                                <th>Social Security</th>
                                <th>Levy</th>
                                <th>C3 Penalty</th>
                                <th>Severance</th>
                                <th>Creation Date</th>
                                <th>Schedule</th>
                                <th>Transaction ID &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </th>
                                <th>Transaction Date</th>
                                <th>Transaction Status</th>
                                {/* <th>Preview</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {LoaddashboardPayment?.dashboard_list &&
                              LoaddashboardPayment?.dashboard_list?.length > 0 ? (
                                LoaddashboardPayment?.dashboard_list
                                ?.filter((item) => {
                                  const matchesStatus = selectedStatus
                                    ? item?.payDetails?.some(payment => payment.transactionStatus === selectedStatus)
                                    : true;
                              
                                  const matchesYear = selectedYear ? item.period_year === selectedYear : true;
                              
                                  return matchesStatus && matchesYear;
                                })
                                ?.filter((item) => {
                                  if (!selectedStatus) return true;
                                  return item?.payDetails?.some(payment => payment.transactionStatus === selectedStatus);
                                })
                                ?.map((item) => (
                                  <tr>
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
                                      </span>{' '}
                                      {item.period_Month ?? 'N/A'}
                                    </td>
                                    <td>{item.period_year ?? 'N/A'}</td>
                                    <td>${item.totaL_WAGES ?? 'N/A'}</td>
                                    <td>${item.totalsscontributions}</td>
                                   
                                    <td>${item.totallevyeeemployee}</td>
                                    <td>$0.00</td>
                                    <td>${item.totalservayance}</td>
                                    {/* <td>{item?.insert_Datetimeinfo? moment(item?.insert_Datetimeinfo).format('DD-MMM-YYYY') : 'N/A'}</td> */}
                                    <td>
                                      {moment(item.insert_Datetimeinfo, 'DD-MM-YYYY').format(
                                        'DD-MMM-YYYY',
                                      )}
                                    </td>
                                    <td>
                                      {item?.schedule_NO
                                        ? moment(item?.schedule_NO).format('DD-MMM-YYYY')
                                        : 'N/A'}
                                    </td>

                                    {/* <td>
                                        
                                      {item?.payDetails?.map((payment, index) => (
                                      
                                      <tr key={index}>
                                          <td>{payment.transactionID}</td>
                                          
                                        </tr>
                                        
                                      ))}
                                    </td> */}

<td style={{ color: 'black' }}>
  {item?.payDetails?.map((payment, index) => (
    <div key={index} style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '3px' }}>
      {payment.transactionID}
    </div>
  ))}
</td>

                                    {/* <td>
                                    
                                          {item?.payDetails?.map((payment, index) => (
                                            <tr key={index}>
                                              <td>{payment.transactionDate}</td>
                                            </tr>
                                          ))}
                                        </td> */}
                                        <td style={{ color: 'black' }}>
  {item?.payDetails?.map((payment, index) => (
    <div key={index} style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '4px' }}>
      {moment(payment.transactionDate).format('DD-MMM-YYYY')}
    </div>
  ))}
</td>     

<td style={{ color: 'black' }}>
  {item?.payDetails?.map((payment, index) => (
    <div
      key={index}
      style={{
        borderBottom: '1px solid #ccc',
        paddingBottom: '4px',
        marginBottom: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      {payment.transactionStatus === 'CREATED' ? (
        <i className="fa fa-check-circle text-success" aria-hidden="true"></i>
      ) : payment.transactionStatus === 'Cancel' ? (
        <i className="fa fa-times-circle text-danger" aria-hidden="true"></i>
      ) : null}
      <span>{payment.transactionStatus}</span>
    </div>
  ))}
</td>

                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="11" className="text-center">
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
      </div>
    </>
  );
};
export default Transection;
