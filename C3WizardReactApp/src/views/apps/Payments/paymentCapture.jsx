import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import {
  Card,
  CardBody,
  Button,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
  ModalFooter,
  Input,
} from 'reactstrap';
import { usePDF } from 'react-to-pdf';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Confetti from 'react-confetti';
import DashboardService from '../../../service/dashboard/Dashboard';
import { getDashboardList } from '../../../store/apps/selfEmployee/dashboard/SelfDashboardSlice';
import { getContributionSingle } from '../../../store/apps/dashboard/DashboardSlice';
import user1 from '../../../assets/images/users/user4.jpg';
import Payment from './Payment.scss';

const PaymentForm = ({ isOpen, toggle, rPayload }) => {
  const dispatch = useDispatch();
  const CompanyId = localStorage.getItem('companyId');
  const companyId = localStorage.getItem('companyId');
  const CategoryType = localStorage.getItem('roleCategory');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const location = useLocation();
  const roleId = localStorage.getItem('roleId');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  //const rPayload = location.state;

  const [errors, setErrors] = useState({});
  // const [formData, setFormData] = useState({
  //   cardNumber: '',
  //   expirationYear: '',
  //   securityCode: '',
  //   cardHolderName: '',
  //   totalAmount: rPayload.amount.toFixed(2).toString(),
  //   TransactionFor: rPayload.TransactionFor,
  //   c3HeaderId: rPayload.c3HeaderId.toString(),
  //   userId: rPayload.userId.toString(),
  //   paymentMethod: 'CreditCard',
  //   saveCard: false,
  // });
  const [formData, setFormData] = useState({
    cardNumber: '',
    expirationYear: '',
    securityCode: '',
    cardHolderName: '',
    // totalAmount: '0.00',
    TransactionFor: '',
    c3HeaderId: '',
    userId: '',
    paymentMethod: 'CreditCard',
    saveCard: false,
    companyId,
  });

  const getcardDetails = async () => {
    try {
      setFormData((prev) => ({
        ...prev,
        totalAmount: Number(formData.payAmt || 0).toFixed(2),
        TransactionFor: rPayload.TransactionFor || '',
        c3HeaderId: rPayload.c3HeaderId?.toString() || '',
        userId: rPayload.userId?.toString() || '',
        payC3Period: rPayload.payC3Period,
      }));

      const res = await DashboardService.CardDetailsCyber(rPayload.userId, rPayload.c3HeaderId);
      if (res?.data?.status) {
        const cardData = res.data.data;
        const hasCardData =
          cardData.cardNumber !== null &&
          cardData.expirationYear !== null &&
          cardData.cardHolderName !== null &&
          cardData.securityCode !== null &&
          cardData.paymentMethod !== null;

        setFormData((prev) => ({
          ...prev,
          ...cardData,
          totalAmount: Number(cardData.payAmt || 0).toFixed(2),
          saveCard: hasCardData,
          companyId,
          // totalSscontributions: cardData?.totalSscontributions.toString() || 0,
          // totalSspenalty: cardData?.totalSspenalty || 0,
          // totalServayance: cardData?.totalServayance || 0,
          // totalPepenalty: cardData?.totalPepenalty || 0,
          // sumPenalty: cardData?.sumPenalty || 0,
          // totalLevyeepenalty: cardData?.totalLevyeepenalty || 0,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          saveCard: false,
          // totalAmount: Number(rPayload?.payAmt || 0).toFixed(2),
          paymentMethod: 'CreditCard',
        }));
      }
    } catch (err) {
      setError('Error fetching payment response');
    }
  };

  useEffect(() => {
    if (isOpen) getcardDetails(); // Load data only if modal is open
  }, [isOpen]);

  const validate = () => {
    const errs = {};

    Object.keys(formData).forEach((field) => {
      if (field !== 'saveCard') {
        const value = formData[field];

        // handle strings safely
        if (typeof value === 'string' && !value.trim()) {
          errs[field] = `${field.replace(/([A-Z])/g, ' $1').toUpperCase()} is required.`;
        }

        // handle null/undefined
        if (value === null || value === undefined) {
          errs[field] = `${field.replace(/([A-Z])/g, ' $1').toUpperCase()} is required.`;
        }
      }
    });

    if (formData.cardNumber && !/^\d{16}$/.test(formData.cardNumber)) {
      errs.cardNumber = 'Card Number must be exactly 16 digits.';
    }

    if (formData.expirationYear && !/^(0[1-9]|1[0-2])\/\d{4}$/.test(formData.expirationYear)) {
      errs.expirationYear = 'Expiration date must be in MM/YYYY format';
    }

    if (!formData.paymentMethod) {
      errs.paymentMethod = 'Payment Method is required';
    }

    if (formData.securityCode && !/^\d{3,4}$/.test(formData.securityCode)) {
      errs.securityCode = 'CVV must be 3 or 4 digits.';
    }

    // if (formData.totalAmount && !/^\d+(\.\d{1,2})?$/.test(formData.totalAmount)) {
    //   errs.totalAmount = "Enter a valid amount.";
    // }

    return errs; // return the error object instead of just boolean
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    const disableSaveCardFields = [
      'cardHolderName',
      'securityCode',
      'expirationYear',
      'cardNumber',
    ];

    let newValue = value;

    if (id === 'expirationYear') {
      newValue = value.replace(/\D/g, ''); // only digits

      // restrict month to 01–12
      if (newValue.length >= 2) {
        let month = parseInt(newValue.slice(0, 2), 10);
        if (Number.isNaN(month) || month <= 0) month = 1;
        if (month > 12) month = 12;
        newValue = `${String(month).padStart(2, '0')}${newValue.slice(2)}`;
      }

      // add slash after MM
      if (newValue.length >= 3) {
        newValue = `${newValue.slice(0, 2)}/${newValue.slice(2, 6)}`;
      }

      // max length MM/YYYY
      newValue = newValue.slice(0, 7);
    }

    setFormData((prev) => ({
      ...prev,
      [id]: newValue,
      ...(disableSaveCardFields.includes(id) && { saveCard: false }),
    }));
  };

  const { toPDF, targetRef } = usePDF({
    filename: 'TransactionReceipt.pdf',
    page: {
      format: 'letter',
      orientation: 'portrait',
      margin: 8,
    },
  });

  const handleDownloadPDF = async () => {
    setIsLoading(true); // Start loader

    try {
      await toPDF(); // Trigger PDF download
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  const [loading, setLoading] = useState(false);

  const confirmSubmit = async () => {
    setLoading(true);
    try {
      const res = await DashboardService.payNowDataCyber(formData);

      const responseData = res.data.data;
      setPaymentData(responseData);
      //  setPaymentData(res.data.data);

      dispatch(getDashboardList({ CompanyId }));
      dispatch(getContributionSingle(companyId));

      if (responseData && responseData[0]?.paymentStatus === 'AUTHORIZED') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 10000);
      }

      setFormData({
        cardNumber: '',
        expirationYear: '',
        securityCode: '',
        cardHolderName: '',
        TransactionFor: '',
        c3HeaderId: '',
        userId: '',
        paymentMethod: 'CreditCard',
        saveCard: false,
        companyId,
      });
    } catch (err) {
      console.error('Payment error:', err);

      if (err.response) {
        // Server responded with a status code
        if (err.response.status === 500) {
          toast.error('Internal Server Error. Please try again later.');
        } else {
          toast.error(`Internal Server Error. Please try again later.`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    confirmSubmit();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={() => {
          // toggle(false);
          setPaymentData(null);
        }}
        size="lg"
        centered
        scrollable
      >
        <ModalHeader
          toggle={() => {
            toggle(false);
            setPaymentData(null);
          }}
        >
          Payment
        </ModalHeader>
        <ModalBody>
          {paymentData === null ? (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6">
                  <div className="card new-card p-3">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <Label className="form-label">Payment Method</Label>
                        <div className="d-flex gap-3 align-items-center">
                          {['CreditCard', 'DebitCard'].map((method) => (
                            <div className="form-check" key={method}>
                              <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                id={method}
                                checked={formData.paymentMethod === method}
                                onChange={() =>
                                  setFormData((prev) => ({ ...prev, paymentMethod: method }))
                                }
                              />
                              <Label className="form-check-label" htmlFor={method}>
                                {method === 'CreditCard' ? 'Credit Card' : 'Debit Card'}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {errors.paymentMethod && (
                          <div className="text-danger">{errors.paymentMethod}</div>
                        )}
                        <div className="mt-2 d-flex gap-3">
                          <img
                            src="https://img.icons8.com/color/48/000000/mastercard-logo.png"
                            height="30"
                            alt="Mastercard"
                          />
                          <img
                            src="https://img.icons8.com/color/48/000000/visa.png"
                            height="30"
                            alt="Visa"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="mb-2">
                        <Label htmlFor="cardNumber" className="form-label">
                          Card Number
                        </Label>
                        <div className="input-group">
                          <input
                            type="text"
                            className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                            id="cardNumber"
                            placeholder="Enter Card Number"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            onBlur={validate}
                            maxLength={16}
                          />
                          <span className="input-group-text input-group-customs bg-white border-start-0">
                            <img
                              src="https://img.icons8.com/color/48/000000/mastercard-logo.png"
                              height="20"
                              alt="Card"
                            />
                          </span>
                          {errors.cardNumber && (
                            <div className="invalid-feedback">{errors.cardNumber}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="mb-2">
                        <Label htmlFor="cardHolderName" className="form-label">
                          Cardholder Name
                        </Label>
                        <input
                          type="text"
                          className={`form-control ${errors.cardHolderName ? 'is-invalid' : ''}`}
                          id="cardHolderName"
                          placeholder="Card Holder Name"
                          value={formData.cardHolderName}
                          onChange={handleChange}
                          onBlur={validate}
                        />
                        {errors.cardHolderName && (
                          <div className="invalid-feedback">{errors.cardHolderName}</div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-2">
                      <div className="col-md-6 mb-3">
                        <Label htmlFor="expirationYear" className="form-label">
                          Expiration Date
                        </Label>
                        <input
                          type="text"
                          className={`form-control ${errors.expirationYear ? 'is-invalid' : ''}`}
                          id="expirationYear"
                          placeholder="MM/YYYY"
                          value={formData.expirationYear}
                          onChange={handleChange}
                          onBlur={validate}
                        />
                        {errors.expirationYear && (
                          <div className="invalid-feedback">{errors.expirationYear}</div>
                        )}
                      </div>
                      <div className="col-md-6 mb-2" style={{ position: 'relative' }}>
                        <Label htmlFor="securityCode" className="form-label">
                          CVV
                        </Label>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className={`form-control  ${errors.securityCode ? 'is-invalid' : ''}`}
                          id="securityCode"
                          placeholder="***"
                          value={formData.securityCode}
                          onChange={handleChange}
                          onBlur={validate}
                          minLength={3}
                          maxLength={4}
                        />
                        <button
                          type="button"
                          className="showPreview showPassword"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <i className="fas fa-eye-slash" />
                          ) : (
                            <i className="fas fa-eye" />
                          )}
                        </button>
                        {errors.securityCode && (
                          <div className="invalid-feedback">{errors.securityCode}</div>
                        )}
                      </div>
                      <div className="col-md-12 mb-1">
                        <Input
                          type="checkbox"
                          id="saveCard"
                          checked={formData.saveCard}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              saveCard: e.target.checked,
                            }))
                          }
                        />
                        &nbsp;&nbsp;<Label htmlFor="saveCard">Save card for next time.</Label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      color="success"
                      className="w-100 fw-bold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Processing...
                        </>
                      ) : (
                        <>Pay ${Number(formData?.payAmt || 0).toFixed(2)}</>
                      )}
                    </Button>

                    {/* <p className="mt-2">Secured by Cybersource Payment Gateway</p> */}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card new-card p-3">
                    <Label className="form-label">Contribution Summary</Label>
                    {/* <p>Review your premium features</p> */}

                    <div className="feature mt-3">
                      <div className="feature-left">
                        <div className="feature-name">Pay Period</div>
                      </div>
                      <div>{formData?.monthPeriod}</div>
                    </div>

                    <div className="feature mt-3">
                      <div className="feature-left">
                        <div className="feature-name">Social Security</div>
                      </div>
                      {/* <div>${Number(formData?.totalSscontributions || 0).toFixed(2)}</div> */}
                      <div>
                        $
                        {Number(
                          CategoryType === 'SelfEmployee'
                            ? formData?.totalContributions || 0
                            : formData?.totalSscontributions || 0,
                        ).toFixed(2)}
                      </div>
                    </div>
                    {CategoryType !== 'SelfEmployee' && (
                      <div className="feature">
                        <div className="feature-left">
                          {/* <div className="feature-icon">
                          <i className="fa-solid fa-chart-line"></i>
                        </div> */}
                          <div className="feature-name">Levy</div>
                        </div>
                        <div>${Number(formData?.sumLeavy || 0).toFixed(2)}</div>
                      </div>
                    )}

                    <div className="feature">
                      <div className="feature-left">
                        <div className="feature-name">Fines and Penalties</div>
                      </div>
                      <div>
                        {/* ${Number(formData?.sumPenalty || 0).toFixed(2)} */}$
                        {Number(
                          CategoryType === 'SelfEmployee'
                            ? formData?.totalFine || 0
                            : formData?.sumPenalty || 0,
                        ).toFixed(2)}
                      </div>
                    </div>
                    {CategoryType !== 'SelfEmployee' && (
                      <div className="feature">
                        <div className="feature-left">
                          <div className="feature-name">Severance</div>
                        </div>
                        <div>${Number(formData?.totalServayance || 0).toFixed(2)}</div>
                      </div>
                    )}

                    <hr />

                    <div className="total my-1">
                      <span>Total</span>
                      <div className="text-danger">
                        {' '}
                        ${Number(formData?.payAmt || 0).toFixed(2)}
                      </div>
                    </div>
                    {/* <div className="feature">
                      <div className="feature-left">
                        <div className="feature-name">Total</div>
                      </div>
                      <div className="text-danger">$19.99</div>
                    </div> */}

                    {/* <a href="#" className="btn btn-pay btn-success">
                      <i className="fa-solid fa-lock"></i> Complete Payment $161.97
                    </a> */}
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <>
              {showConfetti && (
                <div>
                  <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={600} // slightly fewer if pieces are bigger
                    gravity={0.4}
                    recycle={false}
                    drawShape={(ctx) => {
                      ctx.beginPath();
                      ctx.rect(-20, -20, 40, 40); // bigger pieces
                      ctx.fill();
                    }}
                  />
                </div>
              )}

              <div ref={targetRef} style={{ display: paymentData === null ? 'none' : 'block' }}>
                <Card
                  className=""
                  style={{ maxWidth: '700px', margin: 'auto', fontSize: '1.2rem' }}
                >
                  <CardBody className="border p-4 shadow">
                    {paymentData ? (
                      <div className="table-responsive">
                        <div className="receipt-box shadow-sm p-4 rounded">
                          <div className="receipt-header">
                            <div className="d-flex align-items-center">
                              <img src={user1} alt="" width="80px" />
                              <h4 className="mt-2 ms-4 fw-bold">
                                St. Christopher and Nevis Social Security Board
                              </h4>
                            </div>
                            <h1 className="my-3 fw-bold text-center">RECEIPT</h1>
                          </div>
                          <div className="text-center profile-area mb-4">
                            <div className="row mt-5">
                              <div className="col-6">
                                <p
                                  className="mb-0"
                                  style={{ fontWeight: '600', fontSize: '18px', textAlign: 'left' }}
                                >
                                  Head Office
                                </p>
                                <p
                                  className="mb-1"
                                  style={{
                                    fontSize: '16px',
                                    textAlign: 'left',
                                    borderRight: '1px solid #000',
                                  }}
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
                                  {`{Pinney's}`} Commercial Site
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
                          <div className="receipt-number">
                            RECEIPT#{' '}
                            <span className="amount">{paymentData[0].receiptNumber || 'N/A'}</span>
                          </div>
                          <table className="table table-bordered">
                            <tbody>
                              <tr className="bg-light">
                                <th>Reg No.</th>
                                <td>{paymentData[0].regNo || 'N/A'}</td>
                              </tr>
                              <tr>
                                <th>Customer Name</th>
                                <td>{paymentData[0].name || 'N/A'}</td>
                              </tr>
                              <tr>
                                <th>Card Holder Name</th>
                                <td>{paymentData[0].cardHolderName || 'N/A'}</td>
                              </tr>
                              <tr>
                                <th>Transaction ID</th>
                                <td>{paymentData[0].id || 'N/A'}</td>
                              </tr>
                              {paymentData[0]?.paymentHeaderdetails?.map((item, index) => (
                                <tr key={index}>
                                  <th>{item.paymentCode}</th>
                                  <td>${Number(item.paymentAmount || 0).toFixed(2)}</td>
                                </tr>
                              ))}
                              <tr>
                                <th>Amount</th>
                                <td className="amount">
                                  <b>${(paymentData[0].amount || 0).toFixed(2)}</b>
                                </td>
                              </tr>
                              <tr>
                                <th>Status</th>
                                {/* <td className="status-authorized"> */}
                                <td
                                  className={
                                    paymentData[0].paymentStatus === 'AUTHORIZED'
                                      ? 'status-authorized'
                                      : ''
                                  }
                                >
                                  <b>{paymentData[0].paymentStatus || 'AUTHORIZED'}</b>
                                </td>
                              </tr>

                              <tr>
                                <th>Period</th>
                                <td>
                                  {paymentData[0]?.payC3Period
                                    ? moment(paymentData[0].payC3Period, 'MMM/YYYY').format(
                                        'MMM-YYYY',
                                      )
                                    : 'N/A'}
                                </td>
                              </tr>

                              <tr>
                                <th>Transaction Date</th>
                                <td>{paymentData[0].date || 'N/A'}</td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="disclaimer border rounded p-3 mt-4">
                            <strong>RECEIPT DISCLAIMER:</strong>
                            <br />
                            Your Payment has been posted to your account and will be applied to any
                            past due social security contributions, levy, severance, fines and
                            penalties or against the current period liabilities.
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-muted fs-5">Loading payment details...</p>
                    )}
                  </CardBody>
                </Card>
              </div>
              <div style={{ display: paymentData === null ? 'none' : 'block' }}>
                <Card
                  className=" pt-0"
                  style={{ maxWidth: '700px', margin: 'auto', fontSize: '1.2rem' }}
                >
                  <CardBody style={{ textAlign: 'end' }}>
                    <Button
                      className="h-45"
                      color="success"
                      onClick={handleDownloadPDF}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" /> Downloading...
                        </>
                      ) : (
                        'Download'
                      )}
                    </Button>

                    <Button
                      variant="secondary"
                      className="h-45 btn btn-light"
                      onClick={() => {
                        toggle(false);
                        setPaymentData(null);
                      }}
                    >
                      Close
                    </Button>
                  </CardBody>
                </Card>
              </div>
            </>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};
PaymentForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  rPayload: PropTypes.shape({
    amount: PropTypes.number,
    TransactionFor: PropTypes.string,
    c3HeaderId: PropTypes.number,
    userId: PropTypes.string,
    payC3Period: PropTypes.string,
  }),
};
export default PaymentForm;
