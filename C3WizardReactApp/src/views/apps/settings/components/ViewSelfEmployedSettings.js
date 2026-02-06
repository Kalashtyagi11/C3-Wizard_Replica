import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import SelfSettings from '../../../../service/settings/SelfSettings';

const ViewSelfEmployedSettings = () => {
  const [settingsData, setSettingsData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      wcid: id || 0,
      userMessage: false,
      param: id ? 1 : 0,
      fromYear: settingsData?.fromyear || '',
      toYear: settingsData?.toyear || '',
      fromMonth: settingsData?.frommonth || 0,
      toMonth: settingsData?.tomonth || 0,
      a: settingsData?.a || '',
      awc: settingsData?.awc || '',
      b: settingsData?.b || '',
      bwc: settingsData?.bwc || '',
      c: settingsData?.c || '',
      cwc: settingsData?.cwc || '',
      d: settingsData?.d || '',
      dwc: settingsData?.dwc || '',
      e: settingsData?.e || '',
      ewc: settingsData?.ewc || '',
      f: settingsData?.f || '',
      fwc: settingsData?.fwc || '',
      g: settingsData?.g || '',
      gwc: settingsData?.gwc || '',
      h: settingsData?.h || '',
      hwc: settingsData?.hwc || '',
      i: settingsData?.i || '',
      iwc: settingsData?.iwc || '',
      j: settingsData?.j || '',
      jwc: settingsData?.jwc || '',
      k: settingsData?.k || '',
      kwc: settingsData?.kwc || '',
      l: settingsData?.l || '',
      lwc: settingsData?.lwc || '',
      m: settingsData?.m || '',
      mwc: settingsData?.mwc || '',
      special: settingsData?.s || '',
      specialWC: settingsData?.swc || '',
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const updatedValues = {
        ...values,
        fromMonth: Number(values.fromMonth),
        toMonth: Number(values.toMonth),
      };
      try {
        const res = await SelfSettings.createSelfEmployedSettings(updatedValues);
        if (res.data.status) {
          toast.success(res.data.message);
          navigate(-1);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleGetSettings = async () => {
    try {
      const res = await SelfSettings.getSelfEmployedSettingById(id);
      setSettingsData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (id) {
      handleGetSettings();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>View Self Employed Settings - C3wizard</title>
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

                    <li className="fw-medium">View Self Employed Settings</li>
                  </ul>
                </div>
                <form onSubmit={formik.handleSubmit}>
                

                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header py-3 bg_ligh">
                          <div className="row align-items-center d-flex">
                            <div className="col-xl-3">
                              <h4 className="header-title mb-0 text-success">
                                <i className="far fa-user text-success pe-2"></i>
                                Self Employed Settings
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="table-responsive">
                            <table className="table table-hover mb-0 w-50">
                              <thead>
                                <tr className="border-b">
                                  <th scope="row">Wage Categories</th>
                                  <th>Weekly Income</th>
                                  <th>Weekly Contribution</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    {' '}
                                    A <span className="text-danger">*</span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.a && formik.errors.a ? 'is-invalid' : ''
                                      }`}
                                      id="a"
                                      name="a"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.a}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.awc && formik.errors.awc ? 'is-invalid' : ''
                                      }`}
                                      id="awc"
                                      name="awc"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.awc}
                                    />
                                  </td>
                                </tr>

                                <tr>
                                  <td>
                                    {' '}
                                    B <span className="text-danger">*</span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.b && formik.errors.b ? 'is-invalid' : ''
                                      }`}
                                      id="b"
                                      name="b"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.b}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.bwc && formik.errors.bwc ? 'is-invalid' : ''
                                      }`}
                                      id="bwc"
                                      name="bwc"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.bwc}
                                    />
                                  </td>
                                </tr>

                                <tr>
                                  <td>
                                    {' '}
                                    C <span className="text-danger">*</span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.c && formik.errors.c ? 'is-invalid' : ''
                                      }`}
                                      id="c"
                                      name="c"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.c}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.cwc && formik.errors.cwc ? 'is-invalid' : ''
                                      }`}
                                      id="cwc"
                                      name="cwc"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.cwc}
                                    />
                                  </td>
                                </tr>

                                <tr>
                                  <td>
                                    {' '}
                                    D <span className="text-danger">*</span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.d && formik.errors.d ? 'is-invalid' : ''
                                      }`}
                                      id="d"
                                      name="d"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.d}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.dwc && formik.errors.dwc ? 'is-invalid' : ''
                                      }`}
                                      id="dwc"
                                      name="dwc"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.dwc}
                                    />
                                  </td>
                                </tr>

                                <tr>
                                  <td>
                                    {' '}
                                    E <span className="text-danger">*</span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.e && formik.errors.e ? 'is-invalid' : ''
                                      }`}
                                      id="e"
                                      name="e"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.e}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.ewc && formik.errors.ewc ? 'is-invalid' : ''
                                      }`}
                                      id="ewc"
                                      name="ewc"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.ewc}
                                    />
                                  </td>
                                </tr>

                                <tr>
                                  <td>
                                    {' '}
                                    F <span className="text-danger">*</span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.f && formik.errors.f ? 'is-invalid' : ''
                                      }`}
                                      id="f"
                                      name="f"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.f}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.fwc && formik.errors.fwc ? 'is-invalid' : ''
                                      }`}
                                      id="fwc"
                                      name="fwc"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.fwc}
                                    />
                                  </td>
                                </tr>

                                <tr>
                                  <td>
                                    {' '}
                                    G <span className="text-danger">*</span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.g && formik.errors.g ? 'is-invalid' : ''
                                      }`}
                                      id="g"
                                      name="g"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.g}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.gwc && formik.errors.gwc ? 'is-invalid' : ''
                                      }`}
                                      id="gwc"
                                      name="gwc"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.gwc}
                                    />
                                  </td>
                                </tr>

                                <tr>
                                  <td>
                                    {' '}
                                    H <span className="text-danger">*</span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.h && formik.errors.h ? 'is-invalid' : ''
                                      }`}
                                      id="h"
                                      name="h"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.h}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.hwc && formik.errors.hwc ? 'is-invalid' : ''
                                      }`}
                                      id="hwc"
                                      name="hwc"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.hwc}
                                    />
                                  </td>
                                </tr>

                                <tr>
                                  <td>
                                    {' '}
                                    I <span className="text-danger">*</span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.i && formik.errors.i ? 'is-invalid' : ''
                                      }`}
                                      id="i"
                                      name="i"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.i}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.iwc && formik.errors.iwc ? 'is-invalid' : ''
                                      }`}
                                      id="iwc"
                                      name="iwc"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.iwc}
                                    />
                                  </td>
                                </tr>

                                <tr>
                                  <td>
                                    {' '}
                                    J <span className="text-danger">*</span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.j && formik.errors.j ? 'is-invalid' : ''
                                      }`}
                                      id="j"
                                      name="j"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.j}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.jwc && formik.errors.jwc ? 'is-invalid' : ''
                                      }`}
                                      id="jwc"
                                      name="jwc"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.jwc}
                                    />
                                  </td>
                                </tr>

                                <tr>
                                  <td>
                                    {' '}
                                    K <span className="text-danger">*</span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.k && formik.errors.k ? 'is-invalid' : ''
                                      }`}
                                      id="k"
                                      name="k"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.k}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.kwc && formik.errors.kwc ? 'is-invalid' : ''
                                      }`}
                                      id="kwc"
                                      name="kwc"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.kwc}
                                    />
                                  </td>
                                </tr>

                                <tr>
                                  <td>
                                    {' '}
                                    L <span className="text-danger">*</span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.l && formik.errors.l ? 'is-invalid' : ''
                                      }`}
                                      id="l"
                                      name="l"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.l}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.lwc && formik.errors.lwc ? 'is-invalid' : ''
                                      }`}
                                      id="lwc"
                                      name="lwc"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.lwc}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    {' '}
                                    M <span className="text-danger">*</span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.m && formik.errors.m ? 'is-invalid' : ''
                                      }`}
                                      id="m"
                                      name="m"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.m}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.mwc && formik.errors.mwc ? 'is-invalid' : ''
                                      }`}
                                      id="mwc"
                                      name="mwc"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.mwc}
                                    />
                                  </td>
                                </tr>

                       

                                <tr>
                                  <td>
                                    {' '}
                                    Special <span className="text-danger">*</span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.special && formik.errors.special
                                          ? 'is-invalid'
                                          : ''
                                      }`}
                                      id="special"
                                      name="special"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.special}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className={`form-control ${
                                        formik.touched.specialWC && formik.errors.specialWC
                                          ? 'is-invalid'
                                          : ''
                                      }`}
                                      id="specialWC"
                                      name="specialWC"
                                      onChange={formik.handleChange}
                                      disabled
                                      onBlur={formik.handleBlur}
                                      value={formik.values.specialWC}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="col-md-12 col-lg-12 col-xl-12 text-end">
                            {/* <button type="submit" className="btn btn-success px-4 me-3">
                              <i className="far fa-save pe-1"></i> Save
                            </button> */}
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewSelfEmployedSettings;
