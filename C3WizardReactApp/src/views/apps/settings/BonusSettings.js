import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from '../../../layouts/loader/Loader';
import BonusSettingsServices from '../../../service/settings/BonusSetting';
import ConfirmationModal from './components/ConfirmationModal';

const BonusSettings = () => {
  const navigate = useNavigate();
  const [settingList, setSettingsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  // const employerPermission = savedRoles.find((role) => role.title === 'Bonus Settings');
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'BONUS SETTINGS');
  const canAddBonusSetting = employerPermission?.addPermission;
  const canEditBonusSetting = employerPermission?.updatePermission;
  const canDeleteBonusSetting = employerPermission?.deletePermission;
  const canViewBonusSetting = employerPermission?.viewPermission;

  const getSettingsListHandler = async () => {
    setLoading(true);
    try {
      const res = await BonusSettingsServices.getBonusSettingsList();
      setSettingsList(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await BonusSettingsServices.deleteSetting(
        selectedItem.dbSid,
        selectedItem.year,
        true,
      );
      if (res.data.status) {
        toast.success(res.data.message);
        const updated = settingList.filter((item) => item.dbSid !== selectedItem.dbSid);
        setSettingsList(updated);
        setModalShow(false);
      }
    } catch (error) {
      toast.error(error.response.message);
      console.log(error);
    }
  };

  useEffect(() => {
    getSettingsListHandler();
  }, []);

  useEffect(() => {
    if (canViewBonusSetting === false) {
      navigate('/login');
    }
  }, [canViewBonusSetting, navigate]);

  return (
    <>
      <Helmet>
        <title>Bonus Settings - C3wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
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
                    <i className="ti-home" /> Admin Dashboard{' '}
                  </Link>
                </li>
                <li>-</li>

                <li className="fw-medium">Bonus Settings</li>
              </ul>
            </div>
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-2 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-4 col-12 mb-2 mb-lg-0">
                                <h4 className="header-title mb-0 text-success">
                                  {/* <i className="fas fa-dollar-sign ps-2"></i> */}
                                  Bonus Settings
                                </h4>
                              </div>
                              <div className="col-xl-8 text-end">
                                {canAddBonusSetting ? (
                                  <Link
                                    to="/apps/settings/add-bonus-settings"
                                    className="btn btn-success waves-effect waves-light h-45"
                                    type="submit"
                                  >
                                    <i className="fas fa-plus pe-1"></i> Add Bonus Settings
                                  </Link>
                                ) : (
                                  <button
                                    className="btn btn-secondary h-45"
                                    type="button"
                                    disabled
                                    style={{ opacity: 0.6 }}
                                  >
                                    <i className="fas fa-plus pe-1"></i> Add Bonus Settings
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="table-responsive">
                                  <table className="table table-hover mb-0">
                                    <thead>
                                      <tr className="border-b">
                                        <th scope="row">Period</th>
                                        <th>Employee Levy</th>
                                        <th>Employer Levy</th>
                                        <th>Severance</th>
                                        <th>Social Security</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {settingList?.map((item) => (
                                        <tr key={item.dbSid}>
                                          <td>
                                            <div className="d-flex align-items-center gap-3">
                                              {/* {item?.monthNo}-{item.yearName} */}
                                              {moment(
                                                `${item?.yearName}-${item?.monthNo}`,
                                                'YYYY-M',
                                              ).format('MMM-YYYY')}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="d-flex text-success align-items-center gap-3">
                                              {item.employee_Levy === '1' ? (
                                                <i
                                                  className="fa fa-check-circle"
                                                  aria-hidden="true"
                                                ></i>
                                              ) : (
                                                <i
                                                  className="fa fa-times-circle text-danger"
                                                  aria-hidden="true"
                                                ></i>
                                              )}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="d-flex text-success align-items-center gap-3">
                                              {item.employer_Levy === '1' ? (
                                                <i
                                                  className="fa fa-check-circle"
                                                  aria-hidden="true"
                                                ></i>
                                              ) : (
                                                <i
                                                  className="fa fa-times-circle text-danger"
                                                  aria-hidden="true"
                                                ></i>
                                              )}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="d-flex text-success align-items-center gap-3">
                                              {item.severance === '1' ? (
                                                <i
                                                  className="fa fa-check-circle"
                                                  aria-hidden="true"
                                                ></i>
                                              ) : (
                                                <i
                                                  className="fa fa-times-circle text-danger"
                                                  aria-hidden="true"
                                                ></i>
                                              )}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="d-flex text-success align-items-center gap-3">
                                              {item.social_Security === '1' ? (
                                                <i
                                                  className="fa fa-check-circle"
                                                  aria-hidden="true"
                                                ></i>
                                              ) : (
                                                <i
                                                  className="fa fa-times-circle text-danger"
                                                  aria-hidden="true"
                                                ></i>
                                              )}
                                            </div>
                                          </td>

                                          <td>
                                            {canEditBonusSetting ? (
                                              <Link
                                                to={`/apps/settings/update-bonus-settings/${item.dbSid}`}
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
                                          </td>
                                          <td>
                                            {canDeleteBonusSetting ? (
                                              <span
                                                onClick={() => {
                                                  setModalShow(true);
                                                  setSelectedItem({
                                                    dbSid: item.dbSid,
                                                    yearName: item.year,
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
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

export default BonusSettings;
