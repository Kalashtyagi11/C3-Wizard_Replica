import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import { Label } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { format, parse } from 'date-fns';
import { getCSettings, getCSettingsWithDate } from '../../../store/apps/settings/CSettingsSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import Loader from '../../../layouts/loader/Loader';
import C3Services from '../../../service/settings/CSettings';
import ConfirmationModal from './components/ConfirmationModal';
import formatDate, { formatDateDDMMMYYYY } from '../../../helpers/dateFormater';
import PeriodSelectorWithState from './components/PeriodSelectorWithState';
import C3Tabs from './c3TabsView';
import C3Header from './components/C3Header';

// const yearList = Array.from({ length: 35 }, (_, index) => {
//   const year = 2018 + index; // Adjust the start year as needed
//   return { value: year, label: year.toString() };
// });

const C3Settings = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.messageReducer);

  const { CSettingList, loading } = useSelector((state) => state.cSettingsSlice || {});

  const [modalShow, setModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [fromPeriod, setFromPeriod] = useState(null);
  const [toPeriod, setToPeriod] = useState(null);

  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  // const employerPermission = savedRoles.find((role) => role.title === 'C3 Settings');
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'C3 SETTINGS');
  const canAddC3Setting = employerPermission?.addPermission;
  const canEditC3Setting = employerPermission?.updatePermission;
  const canDeleteC3Setting = employerPermission?.deletePermission;
  const canViewC3Setting = employerPermission?.deletePermission;
  const navigate = useNavigate();
  const CSettingData = CSettingList?.length > 0 ? CSettingList[0] : {};
  useEffect(() => {
    if (fromPeriod && toPeriod) {
      const from = format(fromPeriod, 'MM-yyyy') || '';
      const to = format(toPeriod, 'MM-yyyy') || '';
      dispatch(getCSettingsWithDate({ from, to }));
    } else {
      dispatch(getCSettings());
    }
  }, [fromPeriod, toPeriod, dispatch]);

  const handleDelete = async () => {
    const formattedStartDate = formatDate(selectedItem.startDate);
    const formattedEndDate = formatDate(selectedItem.endDate);
    try {
      const res = await C3Services.deleteC3Settings(
        selectedItem.id,
        formattedStartDate,
        formattedEndDate,
      );
      if (res.data.status) {
        toast.success(res.data.message);
        setModalShow(false);
        dispatch(getCSettings('0000'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [activeTab, setActiveTab] = useState('general');

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

  useEffect(() => {
    if (message) {
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      }

      dispatch(setMessage({ message: '', type: '' }));
    }
  }, [message, type, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    if (canViewC3Setting === false) {
      navigate('/login');
    }
  }, [canViewC3Setting, navigate]);

  return (
    <>
      <Helmet>
        <title>C3 Settings - C3wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />

        {/* ============================================================== */}

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
              <ul className="d-flex align-items-center gap-2 mt-3 list-unstyled">
                <li className="fw-medium">
                  <Link
                    to="/admin-dashboard"
                    className="d-flex align-items-center gap-1 text-muted"
                  >
                    <i className="ti-home" /> Admin Dashboard
                  </Link>
                </li>
                <li>-</li>

                <li className="fw-medium">C3 Settings</li>
              </ul>
            </div>
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                    <div className="row">
                      <div className="col-md-12 py-0">
                        <div className="card">
                          <div className="card-body">
                            <div className="row align-items-center d-flex">
                              <PeriodSelectorWithState
                                fromPeriod={fromPeriod}
                                setFromPeriod={setFromPeriod}
                                toPeriod={toPeriod}
                                setToPeriod={setToPeriod}
                              />

                              <div className="col-xl-6 text-end col-6">
                                {canAddC3Setting ? (
                                  <Link
                                    to="/apps/settings/add-c3-settings"
                                    className="btn btn-success waves-effect waves-light h-45"
                                    type="submit"
                                  >
                                    <i className="fas fa-plus pe-1"></i> Add C3 Settings
                                  </Link>
                                ) : (
                                  <button
                                    className="btn btn-secondary h-45"
                                    type="button"
                                    disabled
                                    style={{ opacity: 0.6 }}
                                  >
                                    <i className="fas fa-plus pe-1"></i> Add C3 Settings
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-2 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="row align-items-center justify-content-between d-flex">
                                <div className="col-lg-4">
                                  <div className="mb-3">
                                    <Label>Period From</Label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="severanceRate"
                                      value={
                                        CSettingData?.st_Date
                                          ? formatDateDDMMMYYYY(CSettingData.st_Date)
                                          : ''
                                      }
                                      name="severanceRate"
                                      disabled
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-4">
                                  <div className="mb-3">
                                    <Label>Period To</Label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="severanceRate"
                                      value={
                                        CSettingData?.en_Date
                                          ? formatDateDDMMMYYYY(CSettingData.en_Date)
                                          : ''
                                      }
                                      name="severanceRate"
                                      disabled
                                    />
                                  </div>
                                </div>

                                {CSettingData?.gSettingId && (
                                  <div className="col-xl-1 col-11 mb-2 mb-lg-0 d-flex align-items-center">
                                    {canEditC3Setting ? (
                                      <Link
                                        to={`/apps/settings/update-c3-settings/${CSettingData?.gSettingId}`}
                                        className="mx-1"
                                      >
                                        <span className="badge bg-soft-success text-success">
                                          <Icon.Edit size={20} />
                                        </span>
                                      </Link>
                                    ) : (
                                      <span
                                        className="badge bg-soft-secondary text-muted"
                                        title="No permission to edit"
                                        style={{ cursor: 'not-allowed', opacity: 0.6 }}
                                      >
                                        <Icon.Edit size={20} />
                                      </span>
                                    )}

                                    {canDeleteC3Setting ? (
                                      <span
                                        onClick={() => {
                                          setModalShow(true);
                                          setSelectedItem({
                                            id: CSettingData?.gSettingId,
                                            startDate: CSettingData?.st_Date,
                                            endDate: CSettingData?.en_Date,
                                          });
                                        }}
                                        className="badge bg-soft-danger text-danger"
                                        aria-hidden="true"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        aria-label="Not Submitted"
                                        data-bs-original-title="Delete"
                                      >
                                        <i className="ti-trash f-20"></i>
                                      </span>
                                    ) : (
                                      <span
                                        className="badge bg-soft-secondary text-muted"
                                        aria-hidden="true"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        aria-label="Delete"
                                        data-bs-original-title="No permission"
                                        style={{ opacity: 0.5, pointerEvents: 'none' }}
                                      >
                                        <i className="ti-trash f-20"></i>
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* <div className="card-body p-0">
                            {CSettingData?.gSettingId ? (
                              <div className="row">
                                <div className="col-md-6 col-12 pad-0 w-55 pr-0">
                                  <div className="bg-light pt-2 p-3 h-100">
                                    <p className="mb-0 row border-dotted align-items-center f-14">
                                      <span className="f-600 col-md-5 col-5 p-0">From Date:</span>
                                      <span className="font-bold col-md-7 col-7">
                                        <span className="trigger">
                                          {' '}
                                          <i className="far fa-calendar-alt" />{' '}
                                          {CSettingData?.st_Date
                                            ? formatDateDDMMMYYYY(CSettingData?.st_Date)
                                            : 'N/A'}
                                        </span>
                                      </span>
                                    </p>
                                    <p className="mb-0 row border-dotted align-items-center f-14">
                                      <span className="f-600 col-md-5 col-5 p-0">To Date:</span>
                                      <span className="font-bold col-md-7 col-7">
                                        <span className="trigger">
                                          {' '}
                                          <i className="far fa-calendar-alt" />{' '}
                                          {CSettingData?.en_Date
                                            ? formatDateDDMMMYYYY(CSettingData?.en_Date)
                                            : 'N/A'}
                                        </span>
                                      </span>
                                    </p>
                                    <p className="mb-0 px-2 pt-2 row align-items-center">
                                      <span className="f-600 col-md-8 font-17 text-success">
                                        General
                                      </span>
                                    </p>
                                    <p className="mb-0 row border-dotted align-items-center f-14">
                                      <span className="f-600 col-md-5 col-5 p-0">Severance</span>
                                      <span className="font-bold col-md-7 col-7">
                                        <span className="trigger">
                                          {' '}
                                          {CSettingData?.severanceRate}
                                        </span>
                                      </span>
                                    </p>
                                    <p className="mb-0 row border-dotted align-items-center f-14">
                                      <span className="f-600  col-md-5 p-0 col-5">Min Age</span>
                                      <span className="font-bold col-md-7 col-7">
                                        <span className="trigger">{CSettingData?.min_age}</span>
                                      </span>
                                    </p>
                                    <p className="mb-0 row border-dotted align-items-center f-14">
                                      <span className="f-600 col-md-5 col-5 p-0">Max Age </span>
                                      <span className="font-bold col-md-7 col-7">
                                        <span className="trigger">{CSettingData?.max_age}</span>
                                      </span>
                                    </p>
                                    <p className="mb-0 row border-dotted align-items-center f-14">
                                      <span className="f-600 col-md-5 col-5 p-0">Fine</span>
                                      <span className="font-bold col-md-7 col-7">
                                        <span className="trigger">{CSettingData?.fine_Rate}</span>
                                      </span>
                                    </p>
                                    <p className="mb-0 row border-dotted align-items-center f-14">
                                      <span className="f-600  col-md-5 p-0 col-5">
                                        Additional Fine{' '}
                                      </span>
                                      <span className="font-bold col-md-7 col-7">
                                        <span className="trigger">
                                          {CSettingData?.additional_Fine_Rate}
                                        </span>
                                      </span>
                                    </p>
                                    <p className="mb-0 row border-dotted align-items-center f-14">
                                      <span className="f-600  col-md-5 p-0 col-5">Penalty</span>
                                      <span className="font-bold col-md-7 col-7">
                                        <span className="trigger">
                                          {CSettingData?.penalty_Rate}
                                        </span>
                                      </span>
                                    </p>
                                    <p className="mb-0 row border-dotted align-items-center f-14">
                                      <span className="f-600  col-md-5 p-0 col-5">
                                        Additional Penalty
                                      </span>
                                      <span className="font-bold col-md-7 col-7">
                                        <span className="trigger">
                                          {CSettingData?.additional_Fine_Rate}
                                        </span>
                                      </span>
                                    </p>
                                    <p className="mb-0 row border-dotted align-items-center f-14">
                                      <span className="f-600  col-md-5 p-0 col-5">
                                        Employer Levy{' '}
                                      </span>
                                      <span className="font-bold col-md-7 col-7">
                                        <span className="trigger">
                                          {' '}
                                          {CSettingData?.employerLevy}
                                        </span>
                                      </span>
                                    </p>
                                    <p className="mb-0 row border-dotted align-items-center f-14">
                                      <span className="f-600  col-md-5 p-0 col-5">Bonus</span>
                                      <span className="font-bold col-md-7 col-7">
                                        <span className="trigger">
                                          {' '}
                                          {CSettingData?.bonus_Levy_EE_Rate}
                                        </span>
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="col-md-6 col-12 pad-0 w-55 bornew pb-3 my-2">
                                  <p className="mb-0 px-2 pt-2 row align-items-center">
                                    <span className="f-600 col-md-8 font-17 text-success">
                                      S.S. Employee
                                    </span>
                                  </p>
                                  <p className="mb-0 row border-dotted align-items-center f-14">
                                    <span className="f-600  col-md-5 p-0 col-5">
                                      Contribution rate
                                    </span>
                                    <span className="font-bold col-md-7 col-7">
                                      <span className="trigger">{CSettingData?.eE_dflt_rate}</span>
                                    </span>
                                  </p>
                                  <p className="mb-0 row border-dotted align-items-center f-14">
                                    <span className="f-600  col-md-5 p-0 col-5">Max Amount</span>
                                    <span className="font-bold col-md-7 col-7">
                                      <span className="trigger">
                                        {CSettingData?.eE_dflt_pay_limit}
                                      </span>
                                    </span>
                                  </p>
                                  <p className="mb-0 row border-dotted align-items-center f-14">
                                    <span className="f-600  col-md-5 p-0 col-5">
                                      Max Amount Payable
                                    </span>
                                    <span className="font-bold col-md-7 col-7">
                                      <span className="trigger">{CSettingData?.eE_dflt_limit}</span>
                                    </span>
                                  </p>
                                  <p className="mb-0 px-2 pt-2 row align-items-center">
                                    <span className="f-600 col-md-8 font-17 text-success">
                                      S.S. Employer
                                    </span>
                                  </p>
                                  <p className="mb-0 row border-dotted align-items-center f-14">
                                    <span className="f-600  col-md-5 p-0 col-5">
                                      Contribution rate
                                    </span>
                                    <span className="font-bold col-md-7 col-7">
                                      <span className="trigger">{CSettingData?.eR_dflt_rate}</span>
                                    </span>
                                  </p>
                                  <p className="mb-0 row border-dotted align-items-center f-14">
                                    <span className="f-600  col-md-5 p-0 col-5">Max Amount</span>
                                    <span className="font-bold col-md-7 col-7">
                                      <span className="trigger">
                                        {CSettingData?.er_dflt_pay_limit}
                                      </span>
                                    </span>
                                  </p>
                                  <p className="mb-0 row border-dotted align-items-center f-14">
                                    <span className="f-600  col-md-5 p-0 col-5">
                                      Max Amount Payable
                                    </span>
                                    <span className="font-bold col-md-7 col-7">
                                      <span className="trigger">
                                        {' '}
                                        {CSettingData?.er_dflt_limit}
                                      </span>
                                    </span>
                                  </p>
                                  <p className="mb-0 px-2 pt-2 row align-items-center">
                                    <span className="f-600 col-md-8 font-17 text-success">EIB</span>
                                  </p>
                                  <p className="mb-0 row border-dotted align-items-center f-14">
                                    <span className="f-600  col-md-5 p-0 col-5">
                                      Contribution rate
                                    </span>
                                    <span className="font-bold col-md-7 col-7">
                                      <span className="trigger">{CSettingData?.eiBdflt_rate}</span>
                                    </span>
                                  </p>
                                  <p className="mb-0 row border-dotted align-items-center f-14">
                                    <span className="f-600  col-md-5 p-0 col-5">Max Amount</span>
                                    <span className="font-bold col-md-7 col-7">
                                      <span className="trigger">
                                        {CSettingData?.eiBdflt_pay_limit}
                                      </span>
                                    </span>
                                  </p>
                                  <p className="mb-0 row border-dotted align-items-center f-14">
                                    <span className="f-600  col-md-5 p-0 col-5">
                                      Max Amount Payable
                                    </span>
                                    <span className="font-bold col-md-7 col-7">
                                      <span className="trigger">{CSettingData?.eiBdflt_limit}</span>
                                    </span>
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <h4 className="text-center header-title my-3">No Record Found</h4>
                            )}
                          </div> */}

                          <div className="card-body ">
                            <C3Tabs
                              CSettingData={CSettingData}
                              tabs={tabs}
                              activeTab={activeTab}
                              setActiveTab={setActiveTab}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>{' '}
                  {/* container-fluid */}
                </div>
                {/* End Page-content */}
                <sidebar-barrrrr></sidebar-barrrrr>
              </div>
              {/* end main content*/}
            </div>
          </>
        )}
      </div>
      <ConfirmationModal
        show={modalShow}
        onClose={() => setModalShow(false)}
        onConfirm={handleDelete}
        title="Delete Setting"
        message="Are you sure you want to delete this Setting?"
      />
    </>
  );
};
export default C3Settings;
