import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input, Button, Spinner } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BonusPayForm = ({ loading, onSave, rowData, monthFromState, yearFromState, setPayModalOpen }) => {
  const [formData, setFormData] = useState({
    empName: '',
    amount: '',
    payDate: null,
  });

  const [errors, setErrors] = useState({});

  const monthStartDate = useMemo(
    () => new Date(yearFromState, monthFromState - 1, 1),
    [monthFromState, yearFromState],
  );

  const monthEndDate = useMemo(
    () => new Date(yearFromState, monthFromState, 0),
    [monthFromState, yearFromState],
  );

  // Set data from selected row
  useEffect(() => {
    if (rowData) {
      setFormData({
        empName: rowData.employeeName || '',
        amount: rowData.bonus || '0.00',
        payDate: rowData.payDate ? new Date(rowData.payDate) : null,
      });
      setErrors({});
    }
  }, [rowData]);

  const update = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null })); // clear error
  };

  const handleSave = () => {
    const newErrors = {};

    if (!formData.payDate) {
      newErrors.payDate = 'Payment Date is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const CompanyId = localStorage.getItem('companyId') || '';

    const payload = {
      employeessn: `${rowData.ssn}(${rowData.employeeName})`,
      payDate: formData.payDate.toISOString().split('T')[0],
      amount: formData.amount,
      companyId: CompanyId,
      ssn: rowData.ssn,
      employeeId: rowData.employeeId,
    };

    onSave(payload);
  };

  return (
    <Form>
      <div className="row">
        {/* Employee */}
        <div className="col-md-12">
          <FormGroup>
            <Label>Employee</Label>
            <Input value={formData.empName} disabled />
          </FormGroup>
        </div>

        {/* Payment Date */}
        <div className="col-md-6">
          <FormGroup>
            <Label>
              Payment Date <span className="text-danger">*</span>
            </Label>
            <DatePicker
              className={`form-control ${errors.payDate ? 'is-invalid' : ''}`}
              selected={formData.payDate}
              onChange={(date) => update('payDate', date)}
              minDate={monthStartDate}
              maxDate={monthEndDate}
              dateFormat="dd-MMM-yyyy"
              placeholderText="dd-mmm-yyyy"
            />
            {errors.payDate && <div className="text-danger small">{errors.payDate}</div>}
          </FormGroup>
        </div>

        {/* Amount */}
        <div className="col-md-6">
          <FormGroup>
            <Label>Amount</Label>
            <Input
              disabled
              value={formData.amount ? Number(formData.amount).toFixed(2) : '0.00'}
              placeholder="Enter Amount"
            />
          </FormGroup>
        </div>
      </div>

      {/* Submit */}
      <div className="text-end mt-3">
         <Button className="btn-light" color="secondary"  onClick={() => setPayModalOpen(false)}>
          Close
        </Button>
        <Button color="success" onClick={handleSave} disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Save'}
        </Button>
       
      </div>
    </Form>
  );
};

BonusPayForm.propTypes = {
  loading: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  rowData: PropTypes.object.isRequired,
  monthFromState: PropTypes.number.isRequired,
  yearFromState: PropTypes.number.isRequired,
  setPayModalOpen: PropTypes.func.isRequired,
};

BonusPayForm.defaultProps = {
  loading: false,
};

export default BonusPayForm;
