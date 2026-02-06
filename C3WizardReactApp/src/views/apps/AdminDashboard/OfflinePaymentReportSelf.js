import { Helmet } from 'react-helmet';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import * as Icon from 'react-feather';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Input,
  FormGroup,
  Label,
  Container,
  Row,
  Col,
  Button,
  CardBody,
  Table,
  Card,
  Spinner,
} from 'reactstrap';

import {
  submitPayment,
  getReportedListSelf,
  adminSearchResultsC3,
} from '../../../store/apps/dashboard/DashboardSlice';
import user1 from '../../../assets/images/users/user4.jpg';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import Payment from '../Payments/Payment.scss';

const OfflinePaymentReportSelf = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID');
  const [InputLoading, setInputLoading] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [c3PaymentData, setC3PaymentData] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const { headerId } = useParams();
  const { getListReport } = useSelector((state) => state.dashboardSlice);
  const { message, type } = useSelector((state) => state.messageReducer);
  const [paymentData, setPaymentData] = useState(null);
  const { toPDF, targetRef } = usePDF({
    filename: 'TransactionReceipt.pdf',
    page: { margin: Margin.SMALL, orientation: 'landscape' },
  });

  const initialFormData = {
    headerId,
    userID,
    bankName: null,
    checkNum: null,
    checkDate: null,
    JVNumber: null,
    jvDate: null,
    needToPay: '',
    transactionDate: null,
    BimaRefNum: null,
    mode: null,
    creditCardCode: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const rawDate = c3PaymentData?.batch?.batchDate;
  const apiDate = rawDate ? (typeof rawDate === 'string' ? new Date(rawDate) : rawDate) : null;

  const handlePaymentChange = (paymentType) => {
    setSelectedPayment(paymentType);
    // setFormData({
    //   ...initialFormData,
    //    needToPay: prevState.needToPay,
    //   mode: paymentType, // Set mode in payload
    // });
    setFormData((prevState) => ({
      ...initialFormData, // reset to base values
      needToPay: prevState.needToPay, // preserve the existing calculated total
      mode: paymentType, // update the selected mode
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Remove $ sign automatically
    const cleanValue = value.replace(/^\$/, '');

    setFormData((prev) => ({
      ...prev,
      [name]: cleanValue,
    }));

    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (updatedErrors[name]) delete updatedErrors[name];
      return updatedErrors;
    });
  };

  const validateForm = (data) => {
    const err = {};
    if (!data.headerId) err.headerId = 'Header ID is required';
    if (!data.mode) err.mode = 'Payment mode is required';
    if (!data.needToPay) err.needToPay = 'Contributions is required';
    if (!data.transactionDate) err.transactionDate = 'Transaction Date is required';
    // if (!data.BimaRefNum) err.BimaRefNum = 'Bima Ref Number is required';

    if (data.mode === 'Cheque') {
      if (!data.bankName) err.bankName = 'Bank Name is required';
      // if (!data.checkNum) err.checkNum = 'Cheque Number is required';
      if (!data.checkNum) {
        err.checkNum = 'Cheque Number is required';
      } else if (parseInt(data.checkNum, 10) < 0) {
        err.checkNum = 'Cheque Number cannot be negative';
      } else if (data.checkNum.toString().length < 3) {
        err.checkNum = 'Cheque Number must be at least 3 digits';
      }
      if (!data.checkDate) err.checkDate = 'Cheque Date is required';
    }

    if (data.mode === 'JV') {
      if (!data.JVNumber) err.JVNumber = 'Journal Number is required';
      if (!data.jvDate) err.jvDate = 'Journal Date is required';
    }
    if (data.mode === 'CreditDebit') {
      if (!data.creditCardCode) err.creditCardCode = 'Credit Card is required';
    }

    return err;
  };

  const handlePay = () => {
    const errors = validateForm({ ...formData, mode: selectedPayment });
    setFormErrors(errors); // Update state to show inline errors

    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors)[0]);
      return;
    }
    setLoading(true);

    const payload = {
      headerId: formData.headerId,
      userID: formData.userID,
      bankName: formData.bankName,
      checkNum: formData.checkNum,
      checkDate: formData.checkDate
        ? format(formData.checkDate, 'dd-MMM-yyyy') // e.g. 16-May-2025
        : null,
      JVNumber: formData.JVNumber,
      jvDate: formData.jvDate ? format(formData.jvDate, 'dd-MMM-yyyy') : null,
      needToPay: formData.needToPay,
      transactionDate: formData.transactionDate
        ? format(formData.transactionDate, 'dd-MMM-yyyy')
        : null,
      BimaRefNum: formData.BimaRefNum,
      mode: selectedPayment,
      creditCardCode: formData.creditCardCode,
    };

    dispatch(submitPayment(payload))
      .unwrap()
      .then((res) => {
        setPaymentData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Something went wrong:', error);
        setLoading(false);
      });
  };

  const handleBlur = async () => {
    if (receiptNumber.trim()) {
      setInputLoading(true); // start loading
      try {
        const result = await dispatch(
          adminSearchResultsC3({ receiptId: receiptNumber, userId: userID }),
        ).unwrap();
        const paymentMode = result?.PaymentC3Response?.data || null;
        setC3PaymentData(paymentMode);
        if (paymentMode?.mopCode) {
          switch (paymentMode.mopCode) {
            case 'CSH':
              setSelectedPayment('Cash');
              break;
            case 'CRD':
              setSelectedPayment('Card');
              break;
            case 'CHQ':
              setSelectedPayment('Cheque');
              break;
            default:
              setSelectedPayment('');
          }
        }
      } catch (error) {
        console.error('Something went wrong:', error);

        // Reset values on error
        setC3PaymentData('');
        setSelectedPayment('Cash'); // Optional reset
      } finally {
        setInputLoading(false);
      }
    }
  };

  useEffect(() => {
    if (headerId) {
      dispatch(getReportedListSelf({ HeaderId: headerId }));
    }
  }, [headerId, dispatch]);

  useEffect(() => {
    if (getListReport && getListReport.length > 0) {
      const total = getListReport.reduce((acc, item) => acc + (item.total || 0), 0);
      setFormData((prevState) => ({
        ...prevState,
        needToPay: total.toFixed(2),
      }));
    }
  }, [getListReport]);

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

  useEffect(() => {
    if (c3PaymentData?.batch?.batchDate) {
      setFormData((prev) => ({
        ...prev,
        transactionDate: new Date(c3PaymentData.batch.batchDate),
      }));
    }
  }, [c3PaymentData]);

  return (
    <>
      <Helmet>
        <title>C3 Contribution - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <div style={{ display: paymentData === null ? 'block' : 'none' }}>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
            <ul className="d-flex align-items-center mt-3 gap-2 list-unstyled">
              <li className="fw-medium">
                <Link to="/admin-dashboard" className="d-flex align-items-center gap-1 text-muted">
                  <i className="ti-home" /> Admin Dashboard{' '}
                </Link>
              </li>
              <li>-</li>

              <li className="fw-medium">Offline Payment </li>
            </ul>
          </div>
          <div className="main-content">
            <div className="page-content">
              <div className="container-fluid">
                <div className="page-content-wrapper"></div>

                <div className="card card-header py-3 bg_ligh">
                  <div className="row">
                    <div className="col-xl-6">
                      <div className="card">
                        <div className="card-header py-3 bg_ligh">
                          <h4 className="header-title mb-0 text-success">Payment Details</h4>
                        </div>

                        <div className="card-body pt-1">
                          <div className="mb-3" style={{ position: 'relative' }}>
                            <Label>
                              Receipt Number <span className="text-danger">*</span>
                            </Label>

                            <input
                              type="text"
                              className="form-control"
                              id="receiptNumber"
                              placeholder="Enter Receipt Number (e.g. 123BER)"
                              value={receiptNumber}
                              onChange={(e) => setReceiptNumber(e.target.value)}
                              onBlur={handleBlur}
                              maxLength={64}
                              style={{ paddingRight: '44px' }}
                            />

                            {/* 👇 Spinner + Search icon */}
                            <span
                              className="position-absolute"
                              style={{
                                right: '10px',
                                top: '70%',
                                transform: 'translateY(-50%)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                zIndex: 3,
                                pointerEvents: 'none',
                              }}
                            >
                              {InputLoading && <Spinner size="sm" color="primary" />}
                              <Icon.Search size={18} style={{ cursor: 'pointer' }} />
                            </span>
                          </div>
                          <Col md={12}>
                            <FormGroup>
                              <Label for="BimaRefNum">Batch Number</Label>
                              <Input
                                type="text"
                                name="BimaRefNum"
                                id="BimaRefNum"
                                value={c3PaymentData?.batch?.batchNumber}
                                // onChange={handleInputChange}
                                placeholder="Enter value"
                                disabled
                              />
                            </FormGroup>
                          </Col>
                          <Label>Transaction Date</Label>
                          <DatePicker
                            selected={formData.transactionDate || null}
                            onChange={(date) =>
                              setFormData((prev) => ({ ...prev, transactionDate: date }))
                            }
                            dateFormat="dd-MMM-yyyy" // Example: 16-May-2025
                            placeholderText="dd-mmm-yyyy"
                            className="form-control"
                            isClearable
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                          />

                          {formErrors.transactionDate && (
                            <div className="text-danger">{formErrors.transactionDate}</div>
                          )}

                          <Label className="mt-3">Select Payment Type</Label>

                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                checked={selectedPayment === 'Cash'}
                                onChange={() => handlePaymentChange('Cash')}
                              />
                              Cash Payment
                            </Label>
                          </FormGroup>

                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                checked={selectedPayment === 'Cheque'}
                                onChange={() => handlePaymentChange('Cheque')}
                              />
                              Cheque Payment
                            </Label>
                          </FormGroup>

                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                checked={selectedPayment === 'JV'}
                                onChange={() => handlePaymentChange('JV')}
                              />
                              JV Payment
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                checked={selectedPayment === 'CreditDebit'}
                                onChange={() => handlePaymentChange('CreditDebit')}
                              />
                              Credit Card
                            </Label>
                          </FormGroup>

                          {selectedPayment === 'Cheque' && (
                            <Col md={12}>
                              <FormGroup>
                                <Label for="bankName">
                                  Bank <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="text"
                                  name="bankName"
                                  id="bankName"
                                  value={formData.bankName}
                                  onChange={handleInputChange}
                                  placeholder="Enter Bank Name"
                                />
                                {formErrors.bankName && (
                                  <div className="text-danger">{formErrors.bankName}</div>
                                )}
                              </FormGroup>
                              <FormGroup>
                                <Label for="checkNum">
                                  Cheque No. <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="number"
                                  name="checkNum"
                                  id="checkNum"
                                  min="0"
                                  value={formData.checkNum}
                                  onChange={handleInputChange}
                                  placeholder="Enter Cheque Number"
                                />
                                {formErrors.checkNum && (
                                  <div className="text-danger">{formErrors.checkNum}</div>
                                )}
                              </FormGroup>

                              <FormGroup>
                                <Label for="checkDate">
                                  Cheque Date <span className="text-danger">*</span>
                                </Label>
                                <DatePicker
                                  selected={formData.checkDate}
                                  onChange={(date) =>
                                    setFormData((prev) => ({ ...prev, checkDate: date }))
                                  }
                                  dateFormat="dd-MMM-yyyy"
                                  placeholderText="dd-mmm-yyyy"
                                  className="form-control"
                                  isClearable
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                />
                                {formErrors.checkDate && (
                                  <div className="text-danger">{formErrors.checkDate}</div>
                                )}
                              </FormGroup>
                            </Col>
                          )}

                          {selectedPayment === 'JV' && (
                            <Col md={12}>
                              <FormGroup>
                                <Label for="JVNumber">
                                  Journal Voucher No. <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="text"
                                  name="JVNumber"
                                  id="JVNumber"
                                  value={formData.JVNumber}
                                  onChange={handleInputChange}
                                  placeholder="Enter Journal Voucher Number"
                                />
                                {formErrors.JVNumber && (
                                  <div className="text-danger">{formErrors.JVNumber}</div>
                                )}
                              </FormGroup>

                              <FormGroup>
                                <Label>
                                  Journal Voucher Date <span className="text-danger">*</span>
                                </Label>
                                <DatePicker
                                  selected={formData.jvDate}
                                  onChange={(date) =>
                                    setFormData((prev) => ({ ...prev, jvDate: date }))
                                  }
                                  dateFormat="dd-MMM-yyyy"
                                  placeholderText="dd-mmm-yyyy"
                                  className="form-control"
                                  isClearable
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                />

                                {formErrors.jvDate && (
                                  <div className="text-danger">{formErrors.jvDate}</div>
                                )}
                              </FormGroup>
                            </Col>
                          )}
                          {selectedPayment === 'CreditDebit' && (
                            <Col md={12}>
                              <FormGroup>
                                <Label for="JVNumber">
                                  Credit Card Number <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="text"
                                  name="creditCardCode"
                                  id="creditCardCode"
                                  value={formData.creditCardCode}
                                  onChange={handleInputChange}
                                  placeholder="Enter the last four digits of the credit card"
                                />
                                {formErrors.creditCardCode && (
                                  <div className="text-danger">{formErrors.creditCardCode}</div>
                                )}
                              </FormGroup>
                            </Col>
                          )}
                          <Col md={12}>
                            <FormGroup>
                              <Label for="needToPay"> Total Contributions</Label>
                              <Input
                                type="text"
                                name="needToPay"
                                id="needToPay"
                                value={
                                  c3PaymentData?.totalAmount != null
                                    ? `$${Number(c3PaymentData.totalAmount).toFixed(2)}`
                                    : '$0.00'
                                }
                                // onChange={handleInputChange}
                                placeholder="Enter value"
                              />
                            </FormGroup>
                          </Col>

                          <Col md={12}>
                            <FormGroup>
                              <Label for="needToPay">Total Pay</Label>
                              <Input
                                type="text"
                                name="needToPay"
                                id="needToPay"
                                value={`$${formData.needToPay}`}
                                onChange={handleInputChange}
                                placeholder="Enter value"
                              />
                            </FormGroup>
                          </Col>

                          <Col md={12} className="d-flex justify-content-end mt-3">
                            <button
                              type="button"
                              className="btn btn-success waves-effect waves-light py-1"
                              onClick={handlePay}
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-dollar-sign" /> Pay
                                </>
                              )}
                            </button>

                            <Button type="button" className="btn-light btn-secondary">
                              <Link
                                to="/admin/c3/self-employed"
                                className="d-flex align-items-center gap-1"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                              >
                                Cancel
                              </Link>
                            </Button>
                          </Col>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-xl-6">
                      <div className="card">
                        <div className="card-header py-3 bg_ligh">
                          <h4 className="header-title mb-0 text-success">Payment Report List</h4>
                        </div>
                        <div className="card-body pt-1">
                          <div className="table-responsive">
                            <table className="table table-hover mb-0 white-space tableword-wrap">
                              <tbody>
                                <tr>
                                  <th>Period</th>
                                  {getListReport && getListReport.length > 0 ? (
                                    getListReport.map((item, index) => (
                                      <td key={index}>{item?.period ?? 'N/A'}</td>
                                    ))
                                  ) : (
                                    <td>N/A</td>
                                  )}
                                </tr>
                                <tr>
                                  <th>Creation Date</th>
                                  {getListReport && getListReport.length > 0 ? (
                                    getListReport.map((item, index) => (
                                      // <td key={index}>{item?.creationDate ?? 'N/A'}</td>
                                      <td key={index}>
                                        {item?.creationDate
                                          ? moment(item.creationDate).format('DD-MMM-YYYY')
                                          : 'N/A'}
                                      </td>
                                    ))
                                  ) : (
                                    <td>N/A</td>
                                  )}
                                </tr>
                                <tr>
                                  <th>Schedule</th>
                                  {getListReport && getListReport.length > 0 ? (
                                    getListReport.map((item, index) => (
                                      <td key={index}>{item?.schedule ?? 'N/A'}</td>
                                    ))
                                  ) : (
                                    <td>N/A</td>
                                  )}
                                </tr>
                                <tr>
                                  <th>Total Wages($)</th>
                                  {getListReport && getListReport.length > 0 ? (
                                    getListReport.map((item, index) => (
                                      <td key={index}>${item?.totalWages?.toFixed(2) ?? '0.00'}</td>
                                    ))
                                  ) : (
                                    <td>0.00</td>
                                  )}
                                </tr>
                                <tr>
                                  <th>Contribution($)</th>
                                  {getListReport && getListReport.length > 0 ? (
                                    getListReport.map((item, index) => (
                                      <td key={index}>
                                        ${item?.socialSecurity?.toFixed(2) ?? '0.00'}
                                      </td>
                                    ))
                                  ) : (
                                    <td>0.00</td>
                                  )}
                                </tr>
                                <tr>
                                  <th>Penalty ($)</th>
                                  {getListReport && getListReport.length > 0 ? (
                                    getListReport.map((item, index) => (
                                      <td key={index}>${item?.penalty?.toFixed(2) ?? '0.00'}</td>
                                    ))
                                  ) : (
                                    <td>0.00</td>
                                  )}
                                </tr>

                                <tr>
                                  <th>Total($)</th>
                                  {getListReport && getListReport.length > 0 ? (
                                    getListReport.map((item, index) => (
                                      <td key={index}>${item?.total?.toFixed(2) ?? '0.00'}</td>
                                    ))
                                  ) : (
                                    <td>0.00</td>
                                  )}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <div className="col-xl-6">
                      <div className="card new-card p-3">
                        <h4 className="header-title mb-0 text-success">Payment Report List</h4>

                        {getListReport && getListReport.length > 0 ? (
                          getListReport.map((item, index) => (
                            <div key={index} className="mt-3">
                              <div className="feature">
                                <div className="feature-left">
                                  <div className="feature-name">Period</div>
                                </div>
                                <div>{item?.period ?? 'N/A'}</div>
                              </div>

                              <div className="feature mt-2">
                                <div className="feature-left">
                                  <div className="feature-name">Creation Date</div>
                                </div>
                                <div>
                                  {item?.creationDate
                                    ? moment(item.creationDate).format('DD-MMM-YYYY')
                                    : 'N/A'}
                                </div>
                              </div>

                              <div className="feature mt-2">
                                <div className="feature-left">
                                  <div className="feature-name">Schedule</div>
                                </div>
                                <div>{item?.schedule ?? 'N/A'}</div>
                              </div>

                              <div className="feature mt-2">
                                <div className="feature-left">
                                  <div className="feature-name">Total Wages ($)</div>
                                </div>
                                <div>${Number(item?.totalWages || 0).toFixed(2)}</div>
                              </div>

                              <div className="feature mt-2">
                                <div className="feature-left">
                                  <div className="feature-name">Contribution ($)</div>
                                </div>
                                <div>${Number(item?.socialSecurity || 0).toFixed(2)}</div>
                              </div>

                              <div className="feature mt-2">
                                <div className="feature-left">
                                  <div className="feature-name">Penalty ($)</div>
                                </div>
                                <div>${Number(item?.penalty || 0).toFixed(2)}</div>
                              </div>

                              <hr className="my-2" />

                              <div className="feature mt-2">
                                <div className="feature-left">
                                  <div className="feature-name text-danger fw-bold">Total ($)</div>
                                </div>
                                <div className="text-danger fw-bold">
                                  ${Number(item?.total || 0).toFixed(2)}
                                </div>
                              </div>

                              {index !== getListReport.length - 1 && (
                                <hr className="my-3 border-secondary" />
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-muted fs-5 mb-0">
                            No report data available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={targetRef} style={{ display: paymentData === null ? 'none' : 'block' }}>
        <Card style={{ maxWidth: '700px', margin: 'auto', fontSize: '1.2rem' }}>
          <CardBody className="border p-4 shadow">
            <div className="text-center profile-area mb-4">
              <img src={user1} alt="John Deo" width={70} className="mb-3" />
              <h2 className="fw-bold mb-1">Social Security Board</h2>
              <div className="row">
                <div className="col-6">
                  <p
                    className="mb-0"
                    style={{ fontWeight: '600', fontSize: '18px', textAlign: 'left' }}
                  >
                    Head Office
                  </p>
                  <p
                    className="mb-1"
                    style={{ fontSize: '16px', textAlign: 'left', borderRight: '1px solid #000' }}
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
                    style={{ fontWeight: '600', fontSize: '18px', textAlign: 'left' }}
                  >
                    Branch Office
                  </p>
                  <p className="mb-1" style={{ fontSize: '16px', textAlign: 'left' }}>
                    Pinney’s Commercial Site
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

            {paymentData ? (
              <Table bordered className="text-lg" style={{ fontSize: '1.15rem' }}>
                <tbody>
                  <tr>
                    <th className="p-3">Payment Mode</th>
                    <td className="p-3 text-success fw-bold">{paymentData.paymentStatus}</td>
                  </tr>
                  <tr>
                    <th className="p-3 w-50">Payment Type</th>
                    <td className="p-3">{paymentData.mode}</td>
                  </tr>
                  <tr>
                    <th className="p-3 w-50">Bima Reference Number</th>
                    <td className="p-3">{paymentData.bimaRefNum}</td>
                  </tr>

                  <tr>
                    <th className="p-3 w-50">Transaction ID</th>
                    <td className="p-3">{paymentData.paymentGatewayTransactionID}</td>
                  </tr>
                  <tr>
                    <th className="p-3">Amount </th>
                    <td className="p-3">{paymentData.needToPay}</td>
                  </tr>

                  <tr>
                    <th className="p-3">Customer Name</th>
                    <td className="p-3">{paymentData.refCustomerName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th className="p-3">Transaction Date</th>
                    <td className="p-3">
                      {paymentData.transactionDate
                        ? moment(paymentData.transactionDate).format('DD-MMM-YYYY')
                        : 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </Table>
            ) : (
              <p className="text-center text-muted fs-5">Loading payment details...</p>
            )}
          </CardBody>
        </Card>
      </div>
      <div style={{ display: paymentData === null ? 'none' : 'block' }}>
        <div style={{ display: paymentData === null ? 'none' : 'block' }}>
          <Card className=" pt-0" style={{ maxWidth: '700px', margin: 'auto', fontSize: '1.2rem' }}>
            <CardBody style={{ textAlign: 'end' }}>
              <Button color="success" onClick={toPDF}>
                Download
              </Button>
              <Button color="success" onClick={() => navigate('/admin-dashboard')}>
                Go To DashBoard
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};
export default OfflinePaymentReportSelf;
