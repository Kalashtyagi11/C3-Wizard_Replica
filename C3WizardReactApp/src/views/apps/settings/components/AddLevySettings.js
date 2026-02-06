import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Icon from 'react-feather';
import { Helmet } from 'react-helmet';
import { Label, Input, Button } from 'reactstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { format, parse } from 'date-fns';
import LevySettingsServices from '../../../../service/settings/LevySetting';
import LevyFormModal from './ConfirmModelDateSelect';
import BonusSettingsServices from '../../../../service/settings/BonusSetting';

const years = Array.from({ length: 2035 - 2018 + 1 }, (_, i) => 2018 + i);

const AddLevySettings = () => {
  const [show, setShow] = useState(false);
  const [settingsData, setSettingsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [yearsList, setYearsList] = useState([]);
  const [year, setYear] = useState('2025');
  const isEditMode = !!settingsData?.taxHeaderID;
  const formatDateToYMD = (date) => {
    if (!date) return '';
    const d = new Date(date);
    // const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formik = useFormik({
    initialValues: {
      taxTabId: id || 0,
      taxHeaderID: settingsData?.taxHeaderID || '',
      taxYear: settingsData?.taxYear || '',
      //year: settingsData?.year || '',
      // startDate: settingsData?.startDate ? new Date(settingsData.startDate) : '',
      // endDate: settingsData?.endDate ? new Date(settingsData.endDate) : '',
      // maritalStat: settingsData?.maritalStat || '',
      maritalStat: 'M',
      dedCode: settingsData?.dedCode || 'LEVYEE',
      payPeriod: settingsData?.payPeriod || '',
      overAmt: settingsData?.overAmt || '',
      baseAmt: settingsData?.baseAmt || '',
      taxRate: settingsData?.taxRate || '',
      // orderNo: settingsData?.orderNo || '',
    },

    validationSchema: Yup.object({
      // taxYear: Yup.string().required('Tax Year is required'),
      // startDate: Yup.string().required('Start date is required'),
      // endDate: Yup.string().required('End date is required'),
      // taxYear: Yup.string().required('Tax Year is required'),
      taxHeaderID: Yup.string().required('Year is required'),
      maritalStat: Yup.string().required('Marital Status is required'),
      payPeriod: Yup.string().required('Pay Period is required'),
      overAmt: Yup.number()
        .typeError('Threshold must be a number')
        .moreThan(0, 'Threshold must be greater than 0')
        .required('Threshold is required'),
      baseAmt: Yup.number()
        .typeError('Base Amount must be a number')
        .moreThan(0, 'Base Amount must be greater than 0')
        .required('Base Amount is required'),
      taxRate: Yup.number()
        .typeError('Tax Rate must be a number')
        .moreThan(0, 'Tax Rate must be greater than 0')
        .required('Tax Rate is required'),
      // orderNo: Yup.number()
      //   .typeError('Order number must be a number')
      //   .required('Order number is required'),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      const updateValues = [
        {
          ...values,
          overAmt: Number(values.overAmt),
          baseAmt: Number(values.baseAmt),
          taxRate: Number(values.taxRate),
          year: values.year,
          // startDate: formatDateToYMD(values.startDate),
          // endDate: formatDateToYMD(values.endDate),
        },
      ];
      try {
        const res = await LevySettingsServices.addUpdateLevySettings(updateValues);
        if (res.data.status) {
          toast.success(res.data.message);
          navigate(-1);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGetYears = async () => {
    try {
      const res = await BonusSettingsServices.getYearsList();
      setYearsList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetYears();
  }, []);

  const handleGetSettings = async () => {
    try {
      const res = await LevySettingsServices.getLevySettingsById(id);
      // const resData = res.data;

      let resData = res.data;
      resData = {
        ...resData,
        overAmt: parseFloat(resData.overAmt).toFixed(2),
        baseAmt: parseFloat(resData.baseAmt).toFixed(2),
        taxRate: parseFloat(resData.taxRate).toFixed(2),
      };
      setSettingsData(resData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleYearChanged = (selectedYear) => {
    setYear(selectedYear);
  };

  const yearOptions = yearsList?.map((item) => ({
    value: item.value,
    label: item.key,
  }));

  useEffect(() => {
    if (id) {
      handleGetSettings();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Add Levy Settings - C3wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="page-content-wrapper">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                  <ul className="d-flex align-items-center gap-2 list-unstyled">
                    <li className="fw-medium">
                      <Link
                        to="/admin-dashboard"
                        className="d-flex align-items-center gap-1 text-muted"
                      >
                        <i className="ti-home" /> Admin Dashboard{' '}
                      </Link>
                    </li>
                    <li>-</li>

                    <li className="fw-medium">{id ? 'Update' : 'Add'} Levy Settings</li>
                  </ul>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header py-3 bg_ligh">
                          <div className="row align-items-center d-flex">
                            <div className="col-xl-12 col-12 mb-2 mb-lg-0">
                              <h4 className="header-title mb-0 text-success">
                                {/* <i className="fas fa-dollar-sign ps-2"></i> */}
                                {id ? 'Update' : 'Add'} Levy Settings
                              </h4>
                            </div>
                          </div>
                        </div>

                        <div className="card-body">
                          <div className="row align-items-center d-flex mt-1">
                            {/* <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                              <Label>
                                Start Date <span className="text-danger">*</span>
                              </Label>

                              <DatePicker
                                selected={formik.values.startDate}
                                onChange={(date) => {
                                  formik.setFieldValue('startDate', date);

                                  if (date) {
                                    const year = new Date(date).getFullYear();
                                    formik.setFieldValue('taxYear', year.toString());
                                  } else {
                                    formik.setFieldValue('taxYear', '');
                                  }
                                }}
                                className="form-control"
                                placeholderText="Select Start Date"
                                dateFormat="dd-MMM-yyyy" // <-- Format: 20-Jul-2025
                                isClearable
                              />

                              {formik.touched.startDate && formik.errors.startDate && (
                                <div className="text-danger">{formik.errors.startDate}</div>
                              )}
                            </div> */}

                            {/* <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                              <Label>
                                End Date <span className="text-danger">*</span>
                              </Label>

                              <DatePicker
                                selected={formik.values.endDate}
                                onChange={(date) => {
                                  formik.setFieldValue('endDate', date); // ✅ Only set endDate
                                }}
                                className="form-control"
                                placeholderText="Select End Date"
                                dateFormat="dd-MMM-yyyy"
                                isClearable
                              />

                              {formik.touched.endDate && formik.errors.endDate && (
                                <div className="text-danger">{formik.errors.endDate}</div>
                              )}
                            </div> */}

                            <div className="col-lg-4 mb-3">
                              <Label>
                                Select Year <span className="text-danger">*</span>
                              </Label>

                              <Select
                                id="taxHeaderID"
                                name="taxHeaderID"
                                className="basic-single"
                                classNamePrefix="select"
                                options={yearOptions}
                                value={
                                  yearOptions.find(
                                    (option) => option.value === formik.values.taxHeaderID,
                                  ) || null
                                }
                                onChange={(selectedOption) =>
                                  formik.setFieldValue(
                                    'taxHeaderID',
                                    selectedOption ? selectedOption.value : '',
                                  )
                                }
                                onBlur={() => formik.setFieldTouched('taxHeaderID', true)}
                                isClearable
                                isSearchable
                                isDisabled={isEditMode}
                                placeholder="Select Year"
                                styles={{
                                  control: (provided) => ({
                                    ...provided,
                                    padding: '5px 10px', // <-- Add padding inside the input
                                    minHeight: '40px', // Optional: control height
                                  }),
                                  valueContainer: (provided) => ({
                                    ...provided,
                                    padding: '0px 6px', // <-- Inner padding for selected value
                                  }),
                                }}
                              />
                              <div style={{ minHeight: '20px' }}>
                                {formik.touched.taxHeaderID && formik.errors.taxHeaderID && (
                                  <div className="text-danger">{formik.errors.taxHeaderID}</div>
                                )}
                              </div>
                            </div>

                            {!isEditMode && (
                              <div className="col-lg-2 mb-3 mt-2 " style={{ paddingLeft: '0px' }}>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id="tooltip-add-levy">
                                      Configure New Tax Levy Year
                                    </Tooltip>
                                  }
                                >
                                  <Button
                                    className="btn btn-success height_cutomize"
                                    onClick={() => setShow(true)}
                                  >
                                    <Icon.Plus size={16} className="me-1" /> Add
                                    {/* <Icon.File size={16} className="me-1" /> */}
                                  </Button>
                                </OverlayTrigger>
                              </div>
                            )}

                            <div className="col-lg-2 mb-3"></div>

                            {/* Tax Year */}
                            {/* <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                              <Label>
                                Tax Year <span className="text-danger">*</span>
                              </Label>
                              <select
                                name="taxYear"
                                className="form-control"
                                value={formik.values.taxYear}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              >
                                <option value="">Select Tax Year</option>
                                {years.map((item) => (
                                  <option key={item} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </select>
                              {formik.touched.taxYear && formik.errors.taxYear && (
                                <div className="text-danger">{formik.errors.taxYear}</div>
                              )}
                            </div> */}

                            {/* Marital Status */}
                            {/* <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                              <Label>
                                Marital Status <span className="text-danger">*</span>
                              </Label>
                              <select
                                name="maritalStat"
                                className="form-control"
                                value={formik.values.maritalStat}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              >
                                <option value="">Select Marital Status</option>
                                <option value="S">Single</option>
                                <option value="M">Married</option>
                              </select>
                              {formik.touched.maritalStat && formik.errors.maritalStat && (
                                <div className="text-danger">{formik.errors.maritalStat}</div>
                              )}
                            </div> */}

                            {/* Pay Period */}

                            {/* Tax Rate */}
                            <div className="col-md-4 col-lg-4 col-xl-4 mb-3"></div>
                            <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                              <Label>
                                Tax Rate (e.g. 0.035 for 3.5%)
                                <span className="text-danger">*</span>
                              </Label>

                              <input
                                type="number"
                                name="taxRate"
                                className="form-control"
                                placeholder="Enter Tax Rate"
                                value={formik.values.taxRate}
                                onChange={formik.handleChange}
                                onBlur={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (!Number.isNaN(value)) {
                                    formik.setFieldValue('taxRate', value.toFixed(3));
                                  }
                                  formik.handleBlur(e);
                                }}
                                onKeyDown={(e) => {
                                  if (['e', 'E', '+', '-'].includes(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                              />

                              <div style={{ minHeight: '20px' }}>
                                {formik.touched.taxRate && formik.errors.taxRate && (
                                  <div className="text-danger">{formik.errors.taxRate}</div>
                                )}
                              </div>
                            </div>

                            {/* Threshold */}
                            <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                              <Label>
                                Threshold <span className="text-danger">*</span>
                              </Label>

                              <input
                                type="number"
                                name="overAmt"
                                className="form-control"
                                placeholder="Enter Threshold"
                                value={formik.values.overAmt}
                                onChange={formik.handleChange}
                                onBlur={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (!Number.isNaN(value)) {
                                    formik.setFieldValue('overAmt', value.toFixed(2));
                                  }
                                  formik.handleBlur(e);
                                }}
                                onKeyDown={(e) => {
                                  if (['e', 'E', '+', '-'].includes(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                              <div style={{ minHeight: '20px' }}>
                                {formik.touched.overAmt && formik.errors.overAmt && (
                                  <div className="text-danger">{formik.errors.overAmt}</div>
                                )}
                              </div>
                            </div>

                            {/* Base Amount */}
                            <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                              <Label>
                                Base Amount <span className="text-danger">*</span>
                              </Label>

                              <input
                                type="number"
                                name="baseAmt"
                                className="form-control"
                                placeholder="Enter Base Amount"
                                value={formik.values.baseAmt}
                                onChange={formik.handleChange}
                                onBlur={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (!Number.isNaN(value)) {
                                    formik.setFieldValue('baseAmt', value.toFixed(2));
                                  }
                                  formik.handleBlur(e);
                                }}
                                onKeyDown={(e) => {
                                  if (['e', 'E', '+', '-'].includes(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                              <div style={{ minHeight: '20px' }}>
                                {formik.touched.baseAmt && formik.errors.baseAmt && (
                                  <div className="text-danger">{formik.errors.baseAmt}</div>
                                )}
                              </div>
                            </div>
                            <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                              <Label>
                                Pay Period <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                name="payPeriod"
                                className="form-control"
                                value={formik.values.payPeriod}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              >
                                <option value="">Select Pay Period</option>
                                <option value="W">W - Weekly</option>
                                <option value="M">M - Monthly</option>
                                <option value="E2W">E2W - Every Two Weeks</option>
                                <option value="2M">2M - Twice Monthly</option>
                              </Input>
                              {formik.touched.payPeriod && formik.errors.payPeriod && (
                                <div className="text-danger">{formik.errors.payPeriod}</div>
                              )}
                            </div>

                            {/* Order No */}
                            {/* <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
                              <Label>Order No. <span className="text-danger">*</span></Label>
                              <input
                                type="text"
                                name="orderNo"
                                className="form-control"
                                placeholder="Enter Order Number"
                                value={formik.values.orderNo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.orderNo && formik.errors.orderNo && (
                                <div className="text-danger">{formik.errors.orderNo}</div>
                              )}
                            </div> */}
                          </div>

                          <div className="row mt-3">
                            <div className="col-md-12 col-lg-12 col-xl-12 text-end">
                              <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-success px-4 me-3"
                              >
                                {loading ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <i className="far fa-save pe-1"></i> Save
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn btn-light border px-4"
                              >
                                <i className="fas fa-times"></i> Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <>
        <LevyFormModal
          show={show}
          onClose={() => setShow(false)}
          title="Add New Levy"
          formik={formik}
          loading={loading}
          refreshYears={handleGetYears}
        />
      </>
    </>
  );
};

export default AddLevySettings;
