import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { format, parse } from 'date-fns';
import C3Tabs from './C3Tabs';
import C3Header from './C3Header';
import C3Services from '../../../../service/settings/CSettings';

const validationSchema = Yup.object().shape({
  // fromMonth: Yup.string().required('Required'),
  // toMonth: Yup.string().required('Required'),
  // fromYear: Yup.string().required('Required'),
  // toYear: Yup.string().required('Required'),

  fromPeriod: Yup.date().required('From Month-Year is required'),
  toPeriod: Yup.date()
    .required('To Month-Year is required')
    .min(Yup.ref('fromPeriod'), 'To Period must be after From Period'),

  severanceContributionRate: Yup.number().required('Required').min(1, 'Must be positive'),
  minAge: Yup.number().required('Required').min(16, 'Minimum age is 16'),
  maxAge: Yup.number()
    .required('Required')
    .min(Yup.ref('minAge'), 'Max age must be greater than or equal to min age'),
  additionalFineRate: Yup.number().required('Required').min(1, 'Must be positive'),
  minPenaltyRate: Yup.number().required('Required').min(1, 'Must be positive'),
  employerLevyRate: Yup.number().required('Required').min(1, 'Must be positive'),
  additionalPenaltyRate: Yup.number().required('Required').min(1, 'Must be positive'),
  minFineRate: Yup.number().required('Required').min(1, 'Must be positive'),
  employeeLevyBonus: Yup.number().required('Required').min(1, 'Must be positive'),
  employerSocialSecurityRate: Yup.number().required('Required').min(1, 'Must be positive'),
  maxEmployerSocialSecurity: Yup.number().required('Required').min(1, 'Must be positive'),
  maxPayableEmployer: Yup.number().required('Required').min(1, 'Must be positive'),
  employeeSocialSecurityRate: Yup.number().required('Required').min(1, 'Must be positive'),
  maxEmployeeSocialSecurity: Yup.number().required('Required').min(1, 'Must be positive'),
  maxPayableEmployee: Yup.number().required('Required').min(1, 'Must be positive'),
  eibContributionRate: Yup.number().required('Required').min(1, 'Must be positive'),
  maxEibAmount: Yup.number().required('Required').min(1, 'Must be positive'),
  maxPayableEib: Yup.number().required('Required').min(1, 'Must be positive'),
});

const AddC3Settings = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('general');
  const [c3PrevData, setC3PrevData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Tab data
  const tabs = [
    {
      id: 'general',
      Label: 'General',
      fields: [
        'severanceContributionRate',
        'minAge',
        'maxAge',
        'additionalFineRate',
        'minPenaltyRate',
        'employerLevyRate',
        'additionalPenaltyRate',
        'minFineRate',
      ],
    },
    {
      id: 'bonus',
      Label: 'Bonus',
      fields: ['employeeLevyBonus'],
    },
    {
      id: 'sser',
      Label: 'S.S.ER',
      fields: ['employerSocialSecurityRate', 'maxEmployerSocialSecurity', 'maxPayableEmployer'],
    },
    {
      id: 'ssee',
      Label: 'S.S.EE',
      fields: ['employeeSocialSecurityRate', 'maxEmployeeSocialSecurity', 'maxPayableEmployee'],
    },
    { id: 'eib', Label: 'EIB', fields: ['eibContributionRate', 'maxEibAmount', 'maxPayableEib'] },
  ];

  const formik = useFormik({
    initialValues: {
      // fromMonth: c3PrevData?.fromMonth || '',
      // toMonth: c3PrevData?.toMonth || '',
      // fromYear: c3PrevData?.fromYear || '',
      // toYear: c3PrevData?.toYear || '',

      fromPeriod: c3PrevData?.fromPeriod || null,
      toPeriod: c3PrevData?.toPeriod || null,

      // general fields
      severanceContributionRate: c3PrevData?.severanceCountributionRate || 0,
      minAge: c3PrevData?.minAge || 0,
      maxAge: c3PrevData?.maxAge || 0,
      additionalFineRate: c3PrevData?.additionalFineRate || 0,
      minPenaltyRate: c3PrevData?.minPenaltyRate || 0,
      employerLevyRate: c3PrevData?.employerLevyrate || 0,
      additionalPenaltyRate: c3PrevData?.additionalPenaltyRate || 0,
      minFineRate: c3PrevData?.mineFineRate || 0,
      // ---------------------------

      // bonus field
      employeeLevyBonus: c3PrevData?.employeeLevyCountrybutionbonus || 0,
      // --------------------------

      // SSER fields
      employerSocialSecurityRate: c3PrevData?.employerSSCountributionrate || 0,
      maxEmployerSocialSecurity: c3PrevData?.maxAmountforemployersocialsecurity || 0,
      maxPayableEmployer: c3PrevData?.maxAmountPayableforemployersocialsecurity || 0,
      // -------------------------

      //SSEE
      employeeSocialSecurityRate: c3PrevData?.employeeSocialSecurityContributionRate || 0,
      maxEmployeeSocialSecurity: c3PrevData?.maxAmountForEmployeeSocialSecurity || 0,
      maxPayableEmployee: c3PrevData?.maxAmountPayableForEmployeeSocialSecurity || 0,
      // -----------------

      //EID
      eibContributionRate: c3PrevData?.eibContributionRate || 0,
      maxEibAmount: c3PrevData?.maxAmountForEIB || 0,
      maxPayableEib: c3PrevData?.maxAmountPayableForEIB || 0,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      const filteredDates = {
        fromMonth: values.fromPeriod ? format(values.fromPeriod, 'MM') : '',
        fromYear: values.fromPeriod ? format(values.fromPeriod, 'yyyy') : '',
        toMonth: values.toPeriod ? format(values.toPeriod, 'MM') : '',
        toYear: values.toPeriod ? format(values.toPeriod, 'yyyy') : '',
      };

      const data = {
        fromMonth: filteredDates.fromMonth,
        toMonth: filteredDates.toMonth,
        fromYear: Number(filteredDates.fromYear),
        toYear: Number(filteredDates.toYear),
        severanceCountributionRate: Number(values.severanceContributionRate),
        minAge: Number(values.minAge),
        maxAge: Number(values.maxAge),
        additionalFineRate: Number(values.additionalFineRate),
        minPenaltyRate: Number(values.minPenaltyRate),
        employerLevyrate: Number(values.employerLevyRate),
        additionalPenaltyRate: Number(values.additionalPenaltyRate),
        mineFineRate: Number(values.minFineRate),
        employeeLevyCountrybutionbonus: Number(values.employeeLevyBonus),
        employerSSCountributionrate: Number(values.employerSocialSecurityRate),
        maxAmountforemployersocialsecurity: Number(values.maxEmployerSocialSecurity),
        maxAmountPayableforemployersocialsecurity: Number(values.maxPayableEmployer),
        employeeSocialSecurityContributionRate: Number(values.employeeSocialSecurityRate),
        maxAmountForEmployeeSocialSecurity: Number(values.maxEmployeeSocialSecurity),
        maxAmountPayableForEmployeeSocialSecurity: Number(values.maxPayableEmployee),
        eibContributionRate: Number(values.eibContributionRate),
        maxAmountForEIB: Number(values.maxEibAmount),
        maxAmountPayableForEIB: Number(values.maxPayableEib),

        message: true,
        param: id ? 1 : 0,
        mrsId: c3PrevData?.mrsId || 0,
        dedcodeid: c3PrevData?.dedcodeid || 0,
        eibid: c3PrevData?.eibid || 0,
        socerOblID: c3PrevData?.socerOblID || 0,
      };

      try {
        const res = await C3Services.createC3Settings(data);
        if (res.data.status) {
          toast.success(res.data.message);
          navigate(-1);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGetC3 = async () => {
    try {
      const resp = await C3Services.getC3Settings(id);
      if (resp.data.status) {
        const dataRes = resp.data.data;

        const fromPeriod = parse(
          `${dataRes.fromMonth}-01-${dataRes.fromYear}`,
          'MM-dd-yyyy',
          new Date(),
        );
        const toPeriod = parse(`${dataRes.toMonth}-25-${dataRes.toYear}`, 'MM-dd-yyyy', new Date());

        setC3PrevData({ ...dataRes, fromPeriod, toPeriod });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      if (errors.fromPeriod || errors.toPeriod) {
        formik.handleSubmit();
      }
      const tabWithError = tabs.find((tab) => {
        return tab.fields.some((field) => errors[field]);
      });
      if (tabWithError) {
        toast.warn(`Missing required fields in ${tabWithError.Label}`);
        setActiveTab(tabWithError.id);
      }
    } else {
      formik.handleSubmit(); // Proceed with form submission
    }
  };

  useEffect(() => {
    if (id) {
      handleGetC3();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Add C3 Settings - C3wizard</title>
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

                    <li className="fw-medium">{id ? 'Update' : 'Add'} C3 Settings</li>
                  </ul>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-12 py-0">
                      <div className="card">
                        <div className="card-header py-2 bg_ligh">
                          <div className="row align-items-center d-flex">
                            <div className="col-xl-3">
                              <h4 className="header-title mb-0 text-success">
                                <i className="far fa-user text-success pe-2"></i>
                                {id ? 'Update' : 'Add'} C3 Settings
                              </h4>
                            </div>
                          </div>
                        </div>
                        <C3Header formik={formik} />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header py-3 bg_ligh">
                          <div className="row align-items-center d-flex">
                            <div className="col-xl-3">
                              <h4 className="header-title mb-0 text-success">
                                <i className="far fa-user text-success pe-2"></i>
                                General Settings
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-12 col-12 pad-0 w-55 pr-0">
                              <C3Tabs
                                formik={formik}
                                tabs={tabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                              />
                              <div className="row mt-4">
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

export default AddC3Settings;
