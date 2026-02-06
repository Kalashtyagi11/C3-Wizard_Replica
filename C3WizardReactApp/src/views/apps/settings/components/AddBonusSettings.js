import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { Label } from 'reactstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import DatePicker from 'react-datepicker';
import { format, parse } from 'date-fns';
import BonusSettingsServices from '../../../../service/settings/BonusSetting';
import 'react-datepicker/dist/react-datepicker.css';

const AddBonusSettings = () => {
  const [loading, setLoading] = useState(false);

  const [settingsData, setSettingsData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      id: id || 0,
      period: settingsData?.period || null,
      // year: yearsList[settingsData?.year] || '',
      // month: '',
      employee_Levy: settingsData?.employee_Levy || false,
      employer_Levy: settingsData?.employer_Levy || false,
      severance: settingsData?.severance || false,
      social_Security: settingsData?.social_Security || false,
      mode: id ? 1 : 0,
    },

    validationSchema: Yup.object({
      period: Yup.date().required('Month-Year is required'),
      // year: Yup.string().required('Year is required'),
      // companyId: Yup.string().required('Company is required'),
      // month: Yup.string().required('Month is required'),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const month = values.period ? format(values.period, 'MM') : '';
      const year = values.period ? format(values.period, 'yyyy') : '';
      const updatedValues = {
        ...values,
        year: `${year}`,
        monthNo: month,
      };
      setLoading(true);
      try {
        const res = await BonusSettingsServices.createBonusSetting(updatedValues);
        if (res.data.status) {
          toast.success(res.data.message);
          navigate(-1);
        } else {
          toast.warn(res.data.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // stop loading
      }
    },
  });

  const handleGetSettings = async () => {
    try {
      const res = await BonusSettingsServices.getBonusSettingsById(id);
      const resData = res.data;
      const period = parse(`${resData.monthNo}-01-${resData.year}`, 'MM-dd-yyyy', new Date());
      setSettingsData({ ...res.data, period });
    } catch (error) {
      console.log(error);
    }
  };

  //   try {
  //     const res = await BonusSettingsServices.getYearsList();
  //     setYearsList(res.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const getAllCompaniesHandler = async () => {
  //   try {
  //     const res = await UserManagementServices.getAllCompany();
  //     setCompanyList(res.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  useEffect(() => {
    if (id) {
      handleGetSettings();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Add Bonus Settings - C3wizard</title>
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

                    <li className="fw-medium">{id ? 'Update' : 'Add'} Bonus Settings</li>
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
                                EXEMPTED CONTRIBUTION BONUS
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row align-items-center d-flex mt-1">
                            <div className="col-md-4 col-lg-4 col-xl-4">
                              <div className="mb-3">
                                <DatePicker
                                  selected={formik.values.period}
                                  onChange={(date) => formik.setFieldValue('period', date)}
                                  dateFormat="MMM-yyyy"
                                  showMonthYearPicker
                                  placeholderText="Select Period"
                                  className={`form-control ${
                                    formik.touched.period && formik.errors.period
                                      ? 'is-invalid'
                                      : ''
                                  }`}
                                />
                                {formik.touched.period && formik.errors.period && (
                                  <div className="invalid-feedback">{formik.errors.period}</div>
                                )}
                              </div>
                            </div>

                            <div className="col-md-8">
                              <div className="row">
                                <div className="col-md-3 col-lg-3 col-xl-3">
                                  <div className="mb-3">
                                    <div className="form-check">
                                      <input
                                        className={`form-check-input ${
                                          formik.touched.employee_Levy &&
                                          formik.errors.employee_Levy
                                            ? 'is-invalid'
                                            : ''
                                        }`}
                                        id="employee_Levy"
                                        name="employee_Levy"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        checked={formik.values.employee_Levy}
                                        type="checkbox"
                                      />

                                      <Label className="form-check-label" for="employee_Levy">
                                        Employee Levy
                                      </Label>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-3 col-lg-3 col-xl-3">
                                  <div className="mb-3">
                                    <div className="form-check">
                                      <input
                                        className={`form-check-input ${
                                          formik.touched.employer_Levy &&
                                          formik.errors.employer_Levy
                                            ? 'is-invalid'
                                            : ''
                                        }`}
                                        id="employer_Levy"
                                        name="employer_Levy"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        checked={formik.values.employer_Levy}
                                        type="checkbox"
                                      />
                                      <Label className="form-check-label" for="employer_Levy">
                                        Employer Levy
                                      </Label>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-3 col-lg-3 col-xl-3">
                                  <div className="mb-3">
                                    <div className="form-check">
                                      <input
                                        className={`form-check-input ${
                                          formik.touched.severance && formik.errors.severance
                                            ? 'is-invalid'
                                            : ''
                                        }`}
                                        id="severance"
                                        name="severance"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        checked={formik.values.severance}
                                        type="checkbox"
                                      />
                                      <Label className="form-check-label" for="severance">
                                        Severance
                                      </Label>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-3 col-lg-3 col-xl-3">
                                  <div className="mb-3">
                                    <div className="form-check">
                                      <input
                                        className={`form-check-input ${
                                          formik.touched.social_Security &&
                                          formik.errors.social_Security
                                            ? 'is-invalid'
                                            : ''
                                        }`}
                                        id="social_Security"
                                        name="social_Security"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        checked={formik.values.social_Security}
                                        type="checkbox"
                                      />
                                      <Label className="form-check-label" for="social_Security">
                                        Social Security
                                      </Label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row mt-3">
                            <div className="col-md-12 col-lg-12 col-xl-12 text-end">
                              <button
                                type="submit"
                                className="btn btn-success px-4 me-3"
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                    />
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

                          <div className="row">
                            <div className="col-md-12 col-lg-12 col-xl-12 d-flex">
                              <p className="f-600 pe-2 f-14">Note:</p>
                              <p className="f-14 text-warning">
                                If Checkbox is Selected then Contribution will not be Calculated for
                                that Month Bonus.
                                <br />
                                If Checkbox is not Selected then Contribution will be Calculated for
                                that Month Bonus.
                              </p>
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
    </>
  );
};

export default AddBonusSettings;
