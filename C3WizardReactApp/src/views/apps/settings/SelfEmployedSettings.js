import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import SelfSettings from '../../../service/settings/SelfSettings';
import Loader from '../../../layouts/loader/Loader';
import formatDate, { formatDateDDMMMYYYY } from '../../../helpers/dateFormater';
import ConfirmationModal from './components/ConfirmationModal';

const SelfEmployedSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settingList, setSettingsList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  // const employerPermission = savedRoles.find((role) => role.title === 'Self Employed Settings');
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'SELF EMPLOYED SETTINGS');
  const canAddSelfEmployeeSetting = employerPermission?.addPermission;
  const canEditSelfEmployeeSetting = employerPermission?.updatePermission;
  const canDeleteSelfEmployeeSetting = employerPermission?.deletePermission;
  const canViewSelfEmployeeSetting = employerPermission?.viewPermission;

  const getSettingsListHandler = async () => {
    setLoading(true);
    try {
      const res = await SelfSettings.getSelfEmployedSettings();
      setSettingsList(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const formattedStartDate = formatDate(selectedItem.startDate);
    const formattedEndDate = formatDate(selectedItem.endDate);
    try {
      const res = await SelfSettings.deleteSelfEmployedSetting(
        selectedItem.id,
        formattedStartDate,
        formattedEndDate,
      );
      if (res.data.status) {
        toast.success(res.data.message);
        setModalShow(false);
        const filteredData = settingList.filter((item) => item.sesId !== selectedItem.id);
        setSettingsList(filteredData);
      } else {
        toast.warning(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSettingsListHandler();
  }, []);

  useEffect(() => {
    if (canViewSelfEmployeeSetting === false) {
      navigate('/login');
    }
  }, [canViewSelfEmployeeSetting, navigate]);

  return (
    <>
      <Helmet>
        <title>Self Employed Settings - C3wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        {/* ============================================================== */}
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
              <ul className="d-flex align-items-center mt-3 gap-2 list-unstyled">
                <li className="fw-medium">
                  <Link
                    to="/admin-dashboard"
                    className="d-flex align-items-center gap-1 text-muted"
                  >
                    <i className="ti-home" /> Admin Dashboard{' '}
                  </Link>
                </li>
                <li>-</li>

                <li className="fw-medium">Self Employed Settings</li>
              </ul>
            </div>
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                      {/* <ul className="d-flex align-items-center gap-2 list-unstyled">
                    <li className="fw-medium">
                      <Link
                        to="/admin-dashboard"
                        className="d-flex align-items-center gap-1 text-muted"
                      >
                        <i className="ti-home" /> Admin Dashboard{' '}
                      </Link>
                    </li>
                    <li>-</li>

                    <li className="fw-medium">Self Employed Settings</li>
                  </ul> */}
                    </div>
                    <div className="row">
                      <div className="col-md-12 py-0">
                        <div className="card">
                          <div className="card-body">
                            <div className="row align-items-center justify-content-end d-flex">
                              <div className="col-xl-9 text-end col-6">
                                {canAddSelfEmployeeSetting ? (
                                  <Link
                                    to="/apps/settings/add-self-employed-settings"
                                    className="btn btn-success waves-effect waves-light h-45"
                                    type="submit"
                                  >
                                    <i className="fas fa-plus pe-1"></i> Add Self Employed Settings
                                  </Link>
                                ) : (
                                  <button
                                    className="btn btn-secondary h-45"
                                    type="button"
                                    disabled
                                    style={{ opacity: 0.6 }}
                                  >
                                    <i className="fas fa-plus pe-1"></i> Add Self Employed Settings
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
                              <div className="col-xl-8">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-user text-success pe-2"></i>
                                  Self Employed Settings
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="card-body">
                                <div className="table-responsive">
                                  <table className="table table-hover mb-0 ">
                                    <thead>
                                      <tr className="border-b">
                                        <th scope="row">From Date</th>
                                        <th>To Date</th>
                                        <th>Edit</th>
                                        <th>View</th>
                                        <th>Delete</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {settingList?.map((item) => (
                                        <tr key={item.sesId}>
                                          <td>
                                            {item.st_Date
                                              ? formatDateDDMMMYYYY(item.st_Date)
                                              : null}
                                          </td>
                                          <td>
                                            {item.en_Date
                                              ? formatDateDDMMMYYYY(item.en_Date)
                                              : null}
                                          </td>
                                          <td>
                                            {canEditSelfEmployeeSetting ? (
                                              <Link
                                                to={`/apps/settings/update-self-employed-settings/${item.sesId}`}
                                              >
                                                <span
                                                  className="badge bg-soft-success text-success"
                                                  style={{
                                                    border: '1px solid #119310',
                                                  }}
                                                >
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
                                            <Link
                                              to={`/apps/settings/view-self-employed-settings/${item.sesId}`}
                                              className="badge bg-soft-primary text-primary f-18"
                                              data-bs-placement="top"
                                              title="Preview"
                                            >
                                              <i className="fas fa-eye"></i>
                                            </Link>
                                          </td>
                                          <td>
                                            {canDeleteSelfEmployeeSetting ? (
                                              <span
                                                onClick={() => {
                                                  setModalShow(true);
                                                  setSelectedItem({
                                                    id: item?.sesId,
                                                    startDate: item?.st_Date,
                                                    endDate: item?.en_Date,
                                                  });
                                                }}
                                                className="badge bg-soft-danger text-danger"
                                                aria-hidden="true"
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
export default SelfEmployedSettings;
