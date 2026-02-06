import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import { Label } from 'reactstrap';
import { useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';

import LevySettingsServices from '../../../../service/settings/LevySetting';

const LevyFormModal = ({ show, onClose, title, setYear, editData, refreshList, refreshYears }) => {
  const [isToDateCustomized, setIsToDateCustomized] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: null,
      mode: 0,
      leavyName: '',
      fromDate: null,
      ToDate: null,
    },
    validationSchema: Yup.object({
      leavyName: Yup.string().required('Levy Name is Required'),
      fromDate: Yup.date().nullable().required('From Date is Required'),
      ToDate: Yup.date()
        .nullable()
        .required('To Date is required')
        .when('fromDate', (fromDate, schema) =>
          fromDate ? schema.min(fromDate, 'To Date must be greater than From Date') : schema,
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        const formattedValues = {
          id: values.id,
          mode: values.mode,
          leavyName: values.leavyName,
          fromDate: values.fromDate ? moment(values.fromDate).format('YYYY-MM-DD') : null,
          ToDate: values.ToDate ? moment(values.ToDate).format('YYYY-MM-DD') : null,
          // mode: editData ? 'edit' : 'add', // ✅ mode flag
        };

        const res = await LevySettingsServices.saveDataLevy(formattedValues);

        if (res.data?.status === true) {
          toast.success(res.data.msg || 'Data saved successfully');
          setYear?.(values.ToDate?.getFullYear?.() || '');
          await refreshList?.();
          await refreshYears?.();
          onClose();
          resetForm();
        } else {
          toast.error(res.data?.msg || 'Something went wrong.');
        }
      } catch (error) {
        toast.error(error?.response?.data?.msg || 'API call failed');
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm(); // ✅ reset form fields
    setIsToDateCustomized(false); // reset internal state
    onClose(); // ✅ call parent’s onClose to hide modal
  };

  useEffect(() => {
    if (editData) {
      formik.setValues({
        id: editData.id || null,
        mode: 1, // update
        leavyName: editData.leavyName || '',
        fromDate: editData.fromDate ? new Date(editData.fromDate) : null,
        ToDate: editData.toDate ? new Date(editData.toDate) : null,
      });
    } else {
      formik.resetForm();
      formik.setFieldValue('mode', 0); // add mode
    }
  }, [editData]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        {/* <Modal.Title>{title || 'Add Levy'}</Modal.Title> */}
        <Modal.Title>{editData ? 'Edit Levy' : 'Add Levy'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            {/* Levy Name */}
            <div className="col-md-4 mb-3">
              <Label>
                Levy Name <span className="text-danger">*</span>
              </Label>
              <input
                type="text"
                name="leavyName"
                className="form-control"
                placeholder="Enter Levy Name"
                value={formik.values.leavyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                maxLength={6}
              />
              {formik.touched.leavyName && formik.errors.leavyName && (
                <div className="text-danger">{formik.errors.leavyName}</div>
              )}
            </div>

            {/* From Date */}
            <div className="col-md-4 mb-3">
              <Label>
                From Date <span className="text-danger">*</span>
              </Label>
              <DatePicker
                selected={formik.values.fromDate}
                onChange={(date) => {
                  formik.setFieldValue('fromDate', date);
                  const toDate = formik.values.ToDate;
                  if (date && (!toDate || toDate === '')) {
                    const endOfYear = new Date(date.getFullYear(), 11, 31);
                    formik.setFieldValue('ToDate', endOfYear);
                  }
                }}
                className="form-control"
                placeholderText="Select Start Date"
                dateFormat="dd-MMM-yyyy"
                isClearable
                showMonthDropdown // Show the month dropdown
                showYearDropdown // Show the year dropdown
                yearDropdownItemNumber={15} // Number of years to display in the year dropdown
                scrollableYearDropdown // Make the year dropdown scrollable
                dropdownMode="select"
              />
              {formik.touched.fromDate && formik.errors.fromDate && (
                <div className="text-danger">{formik.errors.fromDate}</div>
              )}
            </div>

            {/* To Date */}
            <div className="col-md-4 mb-3">
              <Label>
                To Date <span className="text-danger">*</span>
              </Label>
              <DatePicker
                selected={formik.values.ToDate}
                onChange={(date) => {
                  setIsToDateCustomized(true);
                  formik.setFieldValue('ToDate', date);
                  if (date && (!formik.values.ToDate || !isToDateCustomized)) {
                    const endOfYear = new Date(date.getFullYear(), 11, 31);
                    formik.setFieldValue('ToDate', endOfYear);
                  }
                }}
                className="form-control"
                placeholderText="Select End Date"
                dateFormat="dd-MMM-yyyy"
                isClearable
                showMonthDropdown // Show the month dropdown
                showYearDropdown // Show the year dropdown
                yearDropdownItemNumber={15} // Number of years to display in the year dropdown
                scrollableYearDropdown // Make the year dropdown scrollable
                dropdownMode="select"
              />
              {formik.touched.ToDate && formik.errors.ToDate && (
                <div className="text-danger">{formik.errors.ToDate}</div>
              )}
            </div>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" className="btn-light" onClick={onClose}>
          Cancel
        </Button>
        {/* <Button variant="primary" onClick={formik.handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button> */}
        <Button variant="primary" onClick={formik.handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Saving...
            </>
          ) : editData ? (
            'Update'
          ) : (
            'Save'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

LevyFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editData: PropTypes.func.isRequired,
  title: PropTypes.string,
  setYear: PropTypes.func, // optional callback
  refreshList: PropTypes.func,
  refreshYears: PropTypes.func,
};

export default LevyFormModal;
