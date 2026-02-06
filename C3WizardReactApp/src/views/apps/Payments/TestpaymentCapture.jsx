import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardBody, Table, Alert, Button, Label } from 'reactstrap';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';
import DashboardService from '../../../service/dashboard/Dashboard';
import user1 from '../../../assets/images/users/user4.jpg';

const TestpaymentCapture = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const userId = localStorage.getItem('userID');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const location = useLocation();
  // const rPayload = location.state;

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    cardNumber: '',

    expirationYear: '',
    securityCode: '',
    cardHolderName: '',
    totalAmount: '',
    TransactionFor: '0',
    c3HeaderId: '0',
    userId,
    paymentMethod: 'CreditCard',
    secretKey: '',
    keyId: '',
    merchantId: '',
    //type: "",
    saveCard: false,
  });
  const getEnvireoment = async () => {
    try {
      const res = await DashboardService.saveConfig(formData);
      if (res && res.data && res.data.status) {
        const activeSetting = res.data.data.find((item) => item.isActive === true);
        if (activeSetting) {
          setSelectedOption(activeSetting.environment);
        }
      }
    } catch (err) {
      setError('Error fetching payment response');
      console.log('Error fetching payment response:', err);
    }
  };
  useEffect(() => {
    getEnvireoment();
  });

  const validate = () => {
    const errs = {};

    Object.keys(formData).forEach((field) => {
      if (
        field !== 'saveCard' &&
        field !== 'keyId' &&
        field !== 'merchantId' &&
        field !== 'secretKey'
      ) {
        if (!formData[field].trim()) {
          errs[field] = `${field.replace(/([A-Z])/g, ' $1').toUpperCase()} is required.`;
        }
      }
    });

    // Validate Card Number (16 digits only, integers)
    if (formData.cardNumber && !/^\d{16}$/.test(formData.cardNumber)) {
      errs.cardNumber = 'Card Number must be exactly 16 digits.';
    }

    // if (!(+formData.expirationMonth >= 1 && +formData.expirationMonth <= 12)) errs.expirationMonth = "Invalid month (1-12).";
    // // Validate Expiration Year (4 digits only, integers)
    // if (formData.expirationYear && !/^\d{4}$/.test(formData.expirationYear)) {
    //   errs.expirationYear = "Expiration Year must be exactly 4 digits.";
    // }

    if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(formData.expirationYear)) {
      errs.expirationYear = 'Expiration date must be in MM/YYYY format';
    }

    // Validate Security Code (CVV) (3 digits only)
    if (formData.securityCode && !/^\d{3,4}$/.test(formData.securityCode)) {
      errs.securityCode = 'Security Code (CVV) must be exactly (3 or 4 digits)';
    }

    if (!/^\d+(\.\d{1,2})?$/.test(formData.totalAmount)) errs.totalAmount = 'Enter a valid amount.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [loading, setLoading] = useState(false);

  // const handleChange = (e) => {
  //   setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  // };
  const handleChange = (e) => {
    const { id, value } = e.target;

    let newValue = value;

    if (id === 'expirationYear') {
      // allow only numbers
      newValue = newValue.replace(/[^\d]/g, '');

      // add slash after MM
      if (newValue.length >= 3) {
        newValue = `${newValue.slice(0, 2)}/${newValue.slice(2, 6)}`;
      }

      // restrict length to MM/YYYY
      newValue = newValue.slice(0, 7);
    }

    setFormData((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  const printRef = useRef();
  const navigate = useNavigate();

  const { toPDF, targetRef } = usePDF({
    filename: 'TransactionReceipt.pdf',
    page: { margin: Margin.SMALL, orientation: 'landscape' },
  });

  const confirmSubmit = async (e) => {
    //setShowConfirm(false);
    setLoading(true);
    //formData.saveCard = e;
    try {
      const res = await DashboardService.payNowCyberSourceTestAndLive(formData);

      setLoading(false);
      setPaymentData(res.data.data);
      console.log('asasas', paymentData);
      //window.location.href = res.data.data.approvalUrl;
    } catch (err) {
      console.log(err);
      setError('Error fetching payment response');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    console.log('ae', formData);
    e.preventDefault();
    if (!validate()) return;

    // if (formData.saveCard === false) {
    //   setShowConfirm(true);

    // }
    // else {
    confirmSubmit(true);

    //}
  };

  const handleCheckboxChange = (option) => {
    setSelectedOption((prev) => {
      const newSelection = prev === option ? null : option;
      setFormData((prev1) => ({
        ...prev1,
        merchantId: '',
        keyId: '',
        secretKey: '',
        type: newSelection,
      }));
      return newSelection;
    });
  };

  return (
    <>
      <Helmet>
            <title>Test Payment  - C3Wizard</title>
          </Helmet>
      <div
        className="container py-5"
        style={{ maxWidth: '480px', display: paymentData === null ? 'block' : 'none' }}
      >
        <div className="card">
          <div className="card-body">
            <h4 className="mb-3">Payment</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <div className="form-check form-switch" disabled>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="envSwitch"
                    checked={selectedOption === 'Production'}
                  />
                  <Label className="form-check-label" htmlFor="envSwitch">
                    {selectedOption === 'Production' ? 'Live Environment' : 'Test Environment'}
                  </Label>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex gap-3 align-items-center">
                  {['CreditCard', 'DebitCard'].map((method) => (
                    <div className="form-check" key={method}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id={method}
                        checked={formData.paymentMethod === method}
                        onChange={() => setFormData((prev) => ({ ...prev, paymentMethod: method }))}
                      />
                      <Label className="form-check-label" htmlFor={method}>
                        {method === 'CreditCard' ? 'Credit Card' : 'Debit Card'}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-3 d-flex gap-3">
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

              <div className="mb-3">
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
                  <span className="input-group-text bg-white border-start-0">
                    <img
                      src="https://img.icons8.com/color/48/000000/mastercard-logo.png"
                      height="20"
                      alt="Card"
                    />
                  </span>
                  {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                </div>
              </div>

              <div className="mb-3">
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

              <div className="row">
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
                <div className="col-md-6 mb-3" style={{ position: 'relative' }}>
                  <Label htmlFor="securityCode" className="form-label">
                    CVV
                  </Label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-control ${errors.securityCode ? 'is-invalid' : ''}`}
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
              </div>

              <div className="col-md-12 mb-3">
                <Label htmlFor="totalAmount" className="form-label">
                  Amount
                </Label>
                <input
                  type="text"
                  className={`form-control ${errors.totalAmount ? 'is-invalid' : ''}`}
                  id="totalAmount"
                  placeholder="Enter Amount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  onBlur={validate}
                />
                {errors.totalAmount && <div className="invalid-feedback">{errors.totalAmount}</div>}
              </div>

              <button type="submit" className="btn btn-success w-100 fw-bold" disabled={loading}>
                {loading ? 'Processing...' : 'Pay $'}
                {formData.totalAmount}
              </button>

              {/* <p className="mt-4 text-muted small">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
              </p> */}
            </form>
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
                    <th className="p-3 w-50">Transaction ID</th>
                    <td className="p-3">{paymentData.id}</td>
                  </tr>
                  <tr>
                    <th className="p-3">Amount </th>
                    <td className="p-3">{paymentData.amount}</td>
                  </tr>
                  <tr>
                    <th className="p-3">Status</th>
                    {/* <td className="p-3 text-success fw-bold">{paymentData.paymentStatus}</td> */}
                    <td
                      className={
                        paymentData.paymentStatus === 'AUTHORIZED' ? 'status-authorized' : ''
                      }
                    >
                      <b>{paymentData.paymentStatus || 'AUTHORIZED'}</b>
                    </td>
                  </tr>
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <td className="p-3">{paymentData.name}</td>
                  </tr>
                  <tr>
                    <th>Card Holder Name</th>
                    <td>{paymentData.cardHolderName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th className="p-3">Transaction Date</th>
                    <td className="p-3">{paymentData.date || 'N/A'}</td>
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
      {showConfirm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
          style={{ zIndex: 1050 }}
        >
          <div className="bg-white p-4 rounded shadow" style={{ maxWidth: '400px', width: '100%' }}>
            <h5>Confirm Payment</h5>
            <p>Do you want to Save Card?</p>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-success"
                type="button"
                onClick={() => confirmSubmit(false)}
              >
                No
              </button>
              <button className="btn btn-success" type="button" onClick={() => confirmSubmit(true)}>
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestpaymentCapture;
