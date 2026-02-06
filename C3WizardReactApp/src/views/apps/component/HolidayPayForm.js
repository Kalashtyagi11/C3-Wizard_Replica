import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input, Button, Row, Col, Spinner } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const HolidayPayForm = ({
  loading = false,
  rowData,
  onSave,
  isEdit = false,
  monthFromState,
  yearFromState,
  setPayModalOpen,
}) => {
  const [formData, setFormData] = useState({
    isWorkingDirector: false,
    empName: '',
    holidayPayWithLeave: true,
    leaveType: '',
    amount: '',
    payDate: null,
    fromDate: null,
    toDate: null,
    descother: '',
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

  useEffect(() => {
    if (rowData) {
      setFormData((prev) => ({
        ...prev,
        empName: rowData.employeeName || '',
        amount: rowData.hpay || '',
        payDate: rowData.payDate ? new Date(rowData.payDate) : null,
        fromDate: rowData.fromDate ? new Date(rowData.fromDate) : null,
        toDate: rowData.toDate ? new Date(rowData.toDate) : null,
      }));
    }
  }, [rowData]);

  const update = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const clearError = (key) =>
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

  const handleSubmit = () => {
    const newErrors = {};

    if (formData.holidayPayWithLeave) {
      if (!formData.fromDate) {
        newErrors.fromDate = 'From Date is required';
      }

      if (!formData.toDate) {
        newErrors.toDate = 'To Date is required';
      }

      if (
        formData.fromDate &&
        formData.toDate &&
        new Date(formData.fromDate) > new Date(formData.toDate)
      ) {
        newErrors.toDate = 'To Date must be after From Date';
      }
    } else {
      if (!formData.leaveType) {
        newErrors.leaveType = 'Leave Type is required';
      }

      if (!formData.payDate) {
        newErrors.payDate = 'Pay Date is required';
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const CompanyId = localStorage.getItem('companyId') || '';

    const dataToSave = {
      holidaypayId: rowData?.holidayPayId || 0,
      // emp_Name: formData.empName,
      emp_Name: `${rowData.ssn}(${rowData.employeeName})`,
      ssn: rowData?.ssn,
      descother: formData.descother,
      holidayPayWithLeave: formData.holidayPayWithLeave,
      leaveType: formData.leaveType,
      from_date: formData.fromDate ? formData.fromDate.toISOString().split('T')[0] : null,
      to_date: formData.toDate ? formData.toDate.toISOString().split('T')[0] : null,
      isWorkingDirector: formData.isWorkingDirector,
      payDate: formData.payDate ? formData.payDate.toISOString().split('T')[0] : null,
      holidayPayLeaveOther: formData.leaveType === 'Other',
      amount: formData.amount,
      companyId: CompanyId,
      employeinmode: rowData?.employeinmode || 2,
    };

    onSave(dataToSave);
  };

  return (
    <Form>
      {/* Working Director */}
      <FormGroup check className="mb-3">
        <Input
          disabled
          type="checkbox"
          checked={formData.isWorkingDirector}
          onChange={(e) => update('isWorkingDirector', e.target.checked)}
        />
        <Label check className="ms-2">
          Working Director?
        </Label>
      </FormGroup>

      {/* Employee */}
      <FormGroup className="mb-3">
        <Label>
          Employee <span className="text-danger">*</span>
        </Label>
        <Input value={formData.empName} disabled />
      </FormGroup>

      {/* Radio */}
      <Row className="mb-3">
        <Col>
          <FormGroup check>
            <Input
              type="radio"
              name="payType"
              checked={formData.holidayPayWithLeave}
              onChange={() => update('holidayPayWithLeave', true)}
            />
            <Label check>Holiday Pay with Leave</Label>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup check>
            <Input
              type="radio"
              name="payType"
              checked={!formData.holidayPayWithLeave}
              onChange={() => update('holidayPayWithLeave', false)}
            />
            <Label check>Other</Label>
          </FormGroup>
        </Col>
      </Row>

      {/* Type */}
      {!formData.holidayPayWithLeave && (
        <FormGroup className="mb-3">
          <Label>
            Type <span className="text-danger">*</span>
          </Label>
          <Input
            type="select"
            value={formData.leaveType}
            className={`form-control ${errors.leaveType ? 'is-invalid' : ''}`}
            onChange={(e) => {
              update('leaveType', e.target.value);
              clearError('leaveType');
            }}
          >
            <option value="">Select</option>
            <option>Leave Without Pay</option>
            <option>Service Charge</option>
            {formData.isWorkingDirector && <option>Director Wages</option>}
            <option>Commission</option>
            <option>Other</option>
          </Input>
          {errors.leaveType && <div className="text-danger small">{errors.leaveType}</div>}
        </FormGroup>
      )}

      {/* Amount */}
      <FormGroup className="mb-3">
        <Label>
          Amount <span className="text-danger">*</span>
        </Label>
        <Input disabled value={formData.amount ? Number(formData.amount).toFixed(2) : '0.00'} />
      </FormGroup>

      {/* Dates */}
      {!formData.holidayPayWithLeave ? (
        <FormGroup className="mb-3">
          <Label>
            Pay Date <span className="text-danger">*</span>
          </Label>
          <DatePicker
            selected={formData.payDate}
            onChange={(d) => {
              update('payDate', d);
              clearError('payDate');
            }}
            minDate={monthStartDate}
            maxDate={monthEndDate}
            className={`form-control ${errors.payDate ? 'is-invalid' : ''}`}
            dateFormat="dd-MMM-yyyy"
          />
          {errors.payDate && <div className="text-danger small">{errors.payDate}</div>}
        </FormGroup>
      ) : (
        <Row>
          <Col md={6}>
            <FormGroup className="mb-3">
              <Label>
                From Date <span className="text-danger">*</span>
              </Label>
              <DatePicker
                selected={formData.fromDate}
                onChange={(d) => {
                  update('fromDate', d);
                  clearError('fromDate');
                }}
                minDate={monthStartDate}
                maxDate={monthEndDate}
                className={`form-control ${errors.fromDate ? 'is-invalid' : ''}`}
                dateFormat="dd-MMM-yyyy"
              />
              {errors.fromDate && <div className="text-danger small">{errors.fromDate}</div>}
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup className="mb-3">
              <Label>
                To Date <span className="text-danger">*</span>
              </Label>
              <DatePicker
                selected={formData.toDate}
                onChange={(d) => {
                  update('toDate', d);
                  clearError('toDate');
                }}
                minDate={formData.fromDate || monthStartDate}
                maxDate={monthEndDate}
                className={`form-control ${errors.toDate ? 'is-invalid' : ''}`}
                dateFormat="dd-MMM-yyyy"
              />
              {errors.toDate && <div className="text-danger small">{errors.toDate}</div>}
            </FormGroup>
          </Col>
        </Row>
      )}

      {/* Description */}
      {formData.leaveType === 'Other' && (
        <FormGroup className="mb-3">
          <Label>Description</Label>
          <Input
            type="textarea"
            value={formData.descother}
            onChange={(e) => update('descother', e.target.value)}
          />
        </FormGroup>
      )}

      {/* Submit */}
      <div className="text-end">
        <Button className="btn-light" color="secondary" onClick={() => setPayModalOpen(false)}>
          Close
        </Button>
        <Button color="success" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Save'}
        </Button>
      </div>
    </Form>
  );
};

HolidayPayForm.propTypes = {
  loading: PropTypes.bool,
  setPayModalOpen: PropTypes.bool.isRequired,
  rowData: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  monthFromState: PropTypes.number.isRequired,
  yearFromState: PropTypes.number.isRequired,
};

export default HolidayPayForm;
