import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import * as Icon from 'react-feather';
import { Label, Input, Button } from 'reactstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import LevySettingsServices from '../../../service/settings/LevySetting';
import ConfirmationModal from './components/ConfirmationModal';
import BonusSettingsServices from '../../../service/settings/BonusSetting';
import Loader from '../../../layouts/loader/Loader';
import CarryForward from './components/CarryForward';
import LevyFormModal from './components/ConfirmModelDateSelect';

const LevySettings = () => {
  const [show, setShow] = useState(false);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settingList, setSettingsList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [year, setYear] = useState('2025');
  const [yearsList, setYearsList] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedEditYear, setSelectedEditYear] = useState(null);
  const [filters, setFilters] = useState({
    payPeriod: '',
    maritalStat: '',
  });

  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  // const employerPermission = savedRoles.find((role) => role.title === 'Levy Settings');
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'LEVY SETTINGS');
  const canAddLevySetting = employerPermission?.addPermission;
  const canEditLevySetting = employerPermission?.updatePermission;
  const canDeleteLevySetting = employerPermission?.deletePermission;
  const canViewLevySetting = employerPermission?.viewPermission;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const payPeriodOptions = [
    { value: '', label: 'Select Pay Period' },
    { value: 'W', label: 'W - Weekly' },
    { value: 'M', label: 'M - Monthly' },
    { value: 'E2W', label: 'E2W - Every Two Weeks' },
    { value: '2M', label: '2M - Twice Monthly' },
  ];

  const yearOptions = yearsList.map((item) => ({
    value: item.value,
    label: item.key,
  }));

  const handleYearChanged = (selectedYear) => {
    setYear(selectedYear);
  };

  // const filteredData = settingList?.filter((item) => {
  //   const matchesPayPeriod = filters.payPeriod ? item.payPeriod === filters.payPeriod : true;
  //   const matchesMaritalStatus = filters.maritalStat
  //     ? item.maritalStat === filters.maritalStat
  //     : true;
  //   return matchesPayPeriod && matchesMaritalStatus;
  // });
  const filteredData = Array.isArray(settingList)
    ? settingList.filter((item) => {
        const matchesPayPeriod = filters.payPeriod ? item.payPeriod === filters.payPeriod : true;
        const matchesMaritalStatus = filters.maritalStat
          ? item.maritalStat === filters.maritalStat
          : true;
        return matchesPayPeriod && matchesMaritalStatus;
      })
    : [];

  const groupedData = filteredData?.reduce((acc, item) => {
    if (!acc[item.payPeriod]) acc[item.payPeriod] = [];
    acc[item.payPeriod].push(item);
    return acc;
  }, {});

  const payPeriodLabels = {
    W: 'Weekly',
    M: 'Monthly',
    A: 'Annually',
    '2M': 'Twice Monthly',
    E2W: 'Every 2 Weeks',
  };

  const getSettingsListHandler = async () => {
    setLoading(true);
    try {
      const res = await LevySettingsServices.getLevySettings(year);

      setSettingsList(res.data.data);
    } catch (error) {
      setSettingsList([]);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await LevySettingsServices.deleteLevySettings(selectedItem.itemId);
      if (res.data.status) {
        toast.success(res.data.message);
        const updated = settingList.filter((item) => item.taxTabId !== selectedItem.itemId);
        setSettingsList(updated);
        setModalShow(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleGetYears = async () => {
    try {
      const res = await BonusSettingsServices.getYearsList();
      setYearsList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const selectedYear = yearOptions.find((y) => y.value === year);

  useEffect(() => {
    if (year) {
      getSettingsListHandler();
    }
  }, [year]);

  useEffect(() => {
    handleGetYears();
  }, []);

  useEffect(() => {
    if (canViewLevySetting === false) {
      navigate('/login');
    }
  }, [canViewLevySetting, navigate]);

  return (
    <>
      <Helmet>
        <title>Levy Settings - C3wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
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

                <li className="fw-medium">Levy Settings</li>
              </ul>
            </div>
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                    <CarryForward
                      yearsList={yearsList}
                      setYear={setYear}
                      setShow={setShow}
                      setEditData={setEditData}
                      setSelectedEditYear={setSelectedEditYear}
                      refreshList={getSettingsListHandler}
                      refreshYears={handleGetYears}
                    />

                    <div className="row mt-3">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-2 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-3 col-3 mb-2 mb-lg-0">
                                <h4 className="header-title mb-0 text-success">
                                  {/* <i className="fas fa-dollar-sign ps-2"></i> */}
                                  Levy Settings
                                </h4>
                              </div>
                              {/* <div className="col-xl-2 col-2">
                                <select
                                  name="maritalStat"
                                  className="form-select"
                                  value={filters.maritalStat}
                                  onChange={handleChange}
                                >
                                  <option value="">Select Marital Status</option>
                                  <option value="S">Single</option>
                                  <option value="M">Married</option>
                                </select>
                              </div> */}

                              <div className="col-xl-4 col-4">
                                {/* <select
                                  id="year"
                                  name="year"
                                  className="form-select"
                                  value={year}
                                  onChange={handleYearChange} // Handle year change
                                >
                                  <option value="">Select Year</option>
                                  {yearsList.map((item) => (
                                    <option key={item} value={item}>
                                      {item}
                                    </option>
                                  ))}
                                </select> */}
                                <div className="d-flex">
                                  <Select
                                    id="year"
                                    name="year"
                                    className="basic-single w-100"
                                    classNamePrefix="select"
                                    options={yearOptions}
                                    value={
                                      yearOptions.find((option) => option.value === year) || null
                                    }
                                    onChange={(selectedOption) =>
                                      handleYearChanged(selectedOption ? selectedOption.value : '')
                                    }
                                    isClearable
                                    isSearchable
                                    placeholder="Select Year"
                                  />

                                  <span
                                    className="badge bg-soft-success text-success ml-1"
                                    style={{ marginLeft: '4px', paddingTop: '8px' }}
                                    onClick={async () => {
                                      if (!selectedYear) {
                                        toast.error('Please select a tax year before editing.');
                                        return;
                                      }
                                      setEditData(null); // clear any previous data
                                      setSelectedEditYear(year); // ✅ Set selected year

                                      try {
                                        setLoading(true);

                                        // Fetch levy setting by year
                                        const res = await LevySettingsServices.getLevySettingsDate(
                                          year,
                                        );

                                        const levyData = res?.data?.data;

                                        if (levyData) {
                                          setEditData({
                                            ...levyData,
                                            year: year?.value || year, // optionally include selected year
                                          });
                                          setSettingsList([levyData]); // If needed to show list
                                        } else {
                                          setEditData(null);
                                          setSettingsList([]);
                                        }

                                        setShow(true); // ✅ Open modal
                                      } catch (error) {
                                        console.error('Error fetching settings:', error);
                                        setEditData(null);
                                        setSettingsList([]);
                                      } finally {
                                        setLoading(false);
                                      }
                                    }}
                                  >
                                    <Icon.Edit size={20} />
                                  </span>
                                </div>
                                {/* <OverlayTrigger placement="top"
                                  overlay={<Tooltip id="tooltip-add-levy">Configure New Tax Levy Year</Tooltip>}
                                >
                                  <Button
                                    className="btn btn-success waves-effect waves-light h-45 ms-0"
                                    onClick={() => setShow(true)}>
                                    <Icon.Edit size={16} className="me-1" /> 
                                  </Button>
                                </OverlayTrigger> */}
                              </div>

                              <div className="col-xl-3 col-2">
                                {/* <select
                                  name="payPeriod"
                                  className="form-select"
                                  value={filters.payPeriod}
                                  onChange={handleChange}
                                >
                                  <option value="">Select Pay Period</option>
                                  <option value="W">W - Weekly</option>
                                  <option value="M">M - Monthly</option>
                                  <option value="E2W">E2W - Every Two Weeks</option>
                                  <option value="2M">2M - Twice Monthly</option>
                                </select> */}
                                <Select
                                  name="payPeriod"
                                  className="basic-single"
                                  classNamePrefix="select"
                                  options={payPeriodOptions.slice(1)} // remove "Select Pay Period" from list
                                  value={
                                    payPeriodOptions.find(
                                      (option) => option.value === filters.payPeriod,
                                    ) || null
                                  }
                                  onChange={(selectedOption) =>
                                    handleChange({
                                      target: {
                                        name: 'payPeriod',
                                        value: selectedOption ? selectedOption.value : '',
                                      },
                                    })
                                  }
                                  isClearable
                                  isSearchable
                                  placeholder="Select Pay Period"
                                />
                              </div>

                              <div className="col-xl-2 col-2 text-end">
                                {canAddLevySetting ? (
                                  <Link
                                    to="/apps/settings/add-levy-settings"
                                    className="btn btn-success waves-effect waves-light h-45"
                                    type="submit"
                                  >
                                    <i className="fas fa-plus pe-1"></i> Add Levy Settings
                                  </Link>
                                ) : (
                                  <button
                                    className="btn btn-secondary h-45"
                                    type="button"
                                    disabled
                                    style={{ opacity: 0.6 }}
                                  >
                                    <i className="fas fa-plus pe-1"></i> Add Levy Settings
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="table-responsive">
                                  <p>
                                    <b>Tax Year:</b> {selectedYear?.label}
                                  </p>
                                  <table className="table table-hover mb-0">
                                    <thead>
                                      <tr className="border-b">
                                        {/* <th scope="row">Period</th> */}
                                        {/* <th>Tax Year</th> */}
                                        {/* <th>Pay Period</th> */}
                                        {/* <th>Marital Status</th> */}
                                        <th>Threshold</th>
                                        <th>Base Amount</th>
                                        <th>Tax Rate</th>
                                        {/* <th>Order No</th> */}
                                        <th>Edit</th>
                                        <th>Delete</th>
                                      </tr>
                                    </thead>
                                    {/* <tbody>
                                      {filteredData?.map((item) => (
                                        <tr key={item.taxTabId}>
                                          <td>{item.taxYear}</td>
                                          <td>{item.payPeriod}</td> 
                                        
                                          <td>${item.overAmt?.toFixed(2) ?? '0.00'}</td>
                                          <td>${item.baseAmt?.toFixed(2) ?? '0.00'}</td>
                                          <td>{item.taxRate?.toFixed(3) ?? '0.000'} %</td>
                                     
                                          <td>
                                            {canEditLevySetting ? (
                                              <Link
                                                to={`/apps/settings/update-levy-settings/${item.taxTabId}`}
                                              >
                                                {' '}
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
                                            {canDeleteLevySetting ? (
                                              <span
                                                onClick={() => {
                                                  setModalShow(true);
                                                  setSelectedItem({
                                                    itemId: item.taxTabId,
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
                                      {settingList?.length === 0 && (
                                        <tr>
                                          <td colSpan="9" className="text-center">
                                            No Records Found
                                          </td>
                                        </tr>
                                      )}
                                    </tbody> */}
                                    <tbody>
                                      {groupedData &&
                                        Object.entries(groupedData).map(([payPeriod, items]) => [
                                          // Group header
                                          // <tr key={`group-${payPeriod}`}>
                                          //   <td colSpan="7" style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                          //     Pay Period: {payPeriodLabels?.[payPeriod] || payPeriod}
                                          //   </td>
                                          // </tr>,

                                          <tr key={`group-${payPeriod}`} className="bg-light">
                                            <td className="bg-light f-600 text-dark" colSpan="18">
                                              {payPeriodLabels?.[payPeriod] || payPeriod}
                                            </td>
                                          </tr>,

                                          // Group items
                                          ...items.map((item) => (
                                            <tr key={item.taxTabId}>
                                              {/* <td>{item.taxYear}</td> */}
                                              {/* <td>{item.payPeriod}</td> */}
                                              <td>${item.overAmt?.toFixed(2) ?? '0.00'}</td>
                                              <td>${item.baseAmt?.toFixed(2) ?? '0.00'}</td>
                                              <td>{item.taxRate?.toFixed(3) ?? '0.000'}</td>
                                              <td>
                                                {canEditLevySetting ? (
                                                  <Link
                                                    to={`/apps/settings/update-levy-settings/${item.taxTabId}`}
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
                                                {canDeleteLevySetting ? (
                                                  <span
                                                    onClick={() => {
                                                      setModalShow(true);
                                                      setSelectedItem({ itemId: item.taxTabId });
                                                    }}
                                                    className="badge bg-soft-danger text-danger"
                                                    title="Delete"
                                                  >
                                                    <i className="ti-trash f-20"></i>
                                                  </span>
                                                ) : (
                                                  <span
                                                    className="badge bg-soft-secondary text-muted"
                                                    title="No permission"
                                                    style={{ opacity: 0.5, pointerEvents: 'none' }}
                                                  >
                                                    <i className="ti-trash f-20"></i>
                                                  </span>
                                                )}
                                              </td>
                                            </tr>
                                          )),
                                        ])}

                                      {filteredData?.length === 0 && (
                                        <tr>
                                          <td colSpan="7" className="text-center">
                                            No Records Found
                                          </td>
                                        </tr>
                                      )}
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
        loading={isDeleting}
        refreshList={getSettingsListHandler}
        refreshYears={handleGetYears}
      />

      <>
        <LevyFormModal
          show={show}
          onClose={() => setShow(false)}
          // title="Add New Levy"
          editData={editData}
          title={editData ? 'Edit Levy' : 'Add New Levy'}
          loading={loading}
          refreshList={getSettingsListHandler}
          refreshYears={handleGetYears}
        />
      </>
    </>
  );
};

export default LevySettings;
