import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { Card, CardBody, Table, Alert, Button, Label, Spinner } from 'reactstrap';
import DashboardService from '../../../service/dashboard/Dashboard';

const SiteSetting = () => {
  //const [paymentData, setPaymentData] = useState(null);

  const location = useLocation();
  const { data } = location.state || {};
  const [formData, setFormData] = useState({
    secretKey: data.secretKey || '',
    keyId: data.keyId || '',
    merchantId: data.merchantId || '',
    environment: 'Test',
    SiteSettings_Id: data.siteSettings_Id || '0',
  });
  const [selectedOption, setSelectedOption] = useState('Test');

  const handleToggle = () => {
    setSelectedOption((prev) => (prev === 'Test' ? 'Live' : 'Test'));
    setFormData((prev) => ({ ...prev, environment: selectedOption }));
  };

  const [errors, setErrors] = useState({});

  // const getcardDetails = async () => {
  //   try {
  //     const res = await DashboardService.saveConfig(formData);
  //     if (res && res.data && res.data.status) {
  //       console.log("test", res.data.data);
  //       setFormData(prev => ({ ...prev, ...res.data.data }));
  //     }
  //   } catch (err) {
  //     //setError("Error fetching payment response");
  //     console.log("Error fetching payment response:", err);
  //   }
  // };
  useEffect(() => {
    setSelectedOption(data.environment === 'Production' ? 'Live' : 'Test');
    //getcardDetails();
  }, []);

  const validate = () => {
    const errs = {};

    Object.keys(formData).forEach((field) => {
      if (field !== 'SiteSettings_Id') {
        if (!formData[field].trim()) {
          errs[field] = `${field.replace(/([A-Z])/g, ' $1').toUpperCase()} is required.`;
        }
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const confirmSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    //formData.saveCard = e;
    try {
      const res = await DashboardService.saveConfig(formData);

      setLoading(false);
      toast.success('Cyber Source Settings updated');
    } catch (err) {
      console.log(err);
      //setError("Error fetching payment response");
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '480px' }}>
      <div className="card">
        <div className="card-body">
          <h4 className="mb-3" style={{ fontSize: 'x-large', fontWeight: '500' }}>
            {selectedOption === 'Live' ? 'Live Environment' : 'Test Environment'}
          </h4>
          <form onSubmit={confirmSubmit}>
            <div className="mb-3">
              <Label htmlFor="extraField1" className="form-label">
                merchantId
              </Label>
              <input
                type="text"
                id="merchantId"
                value={formData.merchantId}
                onChange={handleChange}
                onBlur={validate}
                className={`form-control ${errors.merchantId ? 'is-invalid' : ''}`}
              />
              {errors.merchantId && <div className="invalid-feedback">{errors.merchantId}</div>}

              <Label htmlFor="extraField2" className="form-label">
                keyId
              </Label>
              <input
                type="text"
                id="keyId"
                value={formData.keyId}
                onChange={handleChange}
                onBlur={validate}
                className={`form-control ${errors.keyId ? 'is-invalid' : ''}`}
              />
              {errors.keyId && <div className="invalid-feedback">{errors.keyId}</div>}

              <Label htmlFor="extraField3" className="form-label">
                secretKey
              </Label>
              <input
                type="text"
                id="secretKey"
                value={formData.secretKey}
                onChange={handleChange}
                onBlur={validate}
                className={`form-control ${errors.secretKey ? 'is-invalid' : ''}`}
              />
              {errors.secretKey && <div className="invalid-feedback">{errors.secretKey}</div>}
            </div>

            <button type="submit" className="btn btn-success w-100 fw-bold" disabled={loading}>
              {/* {loading ? 
                            ' Processing...' : 'Update'} */}
              {loading ? (
                <>
                  <Spinner size='sm' /> Processing...
                </>
              ) : (
                'Update'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SiteSetting;
