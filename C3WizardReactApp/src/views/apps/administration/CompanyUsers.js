import React, { useEffect, useState } from 'react';
import {
  Button,
  Spinner,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import Select from 'react-select';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import ResetPasswordUser from './ResetPasswordUser';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import {
  getLoadUsersListFromCompany,
  resetUserData,
  UserUpdateStatus,
} from '../../../store/apps/administration/AdministrationSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import { useSortableTable } from '../component/SortableTable';
import '../Payments/Active.scss';

const CompanyUsers = () => {
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const toggle = () => setModal(!modal);
  const roleId = localStorage.getItem('roleId');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const { message, type } = useSelector((state) => state.messageReducer);
  const [resetLoading, setResetLoading] = useState(null);
  const [userIdState, setUserIdState] = useState('');
  const [show, setShow] = useState(false);
  const { state: navigationState } = useLocation();
  const [selectedValue, setSelectedValue] = useState(null);
  const [companyList, setCompanyList] = useState([]);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  // const employerPermission = savedRoles.find((role) => role.title === 'Company Users');
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'EMPLOYERS');
  const canAddCompanyUsersSetting = employerPermission?.addPermission;
  const canEditCompanyUsersSetting = employerPermission?.updatePermission;
  const canDeleteCompanyUsersSetting = employerPermission?.deletePermission;
  const canViewCompanyUsersSetting = employerPermission?.viewPermission;

  const { CompanyUsersList } = useSelector((state) => state.AdministrationReducer || {});
  const { sortedData, handleSort, getSortIcon } = useSortableTable(CompanyUsersList);

  // const handleChange = (event) => {
  //   setSelectedValue(event.target.value);
  // };
  const options = companyList
    .filter((item) => item.companyName !== 'SSB')
    .map((item) => ({
      value: item.companyId,
      // label: item.companyName,
      label: `${item.companyName} (${item.regNumber || 'N/A'})`, // show both companyName & regNumber
      regNumber: item.regNumber,
      userId: item.userId,
      parentId: item.parentId,
    }));

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption || null);
  };

  const validParentUserId =
    sortedData?.find((user) => user.parentuserid !== null && user.parentuserid !== 0)
      ?.parentuserid || (sortedData && sortedData.length > 0 ? sortedData[0].userId : null);

  const handleAddUser = () => {
    if (!selectedValue) return;
    navigate(`/admin/add-company-user/${selectedValue.value}`, {
      state: {
        companyId: selectedValue.value,
        // UseridUnique: selectedValue.userId,
        UseridUnique: validParentUserId,
        regNumber: selectedValue.regNumber,
      },
    });
  };

  const handleShow = (id) => {
    setShow(true);
    setUserIdState(id);
  };

  const handleReset = (userId) => {
    setResetLoading(userId);
    dispatch(resetUserData(userId))
      .unwrap()
      .then((res) => {
        console.log('Reset success:', res);
      })
      .catch((err) => {
        console.error('Reset failed:', err);
      })
      .finally(() => {
        setResetLoading(null);
      });
  };

  const handleToggle = (itemId, currentStatus) => {
    setCurrentItem(itemId);
    setIsActive(!currentStatus);
    setModal(true);
  };

  const handleSubmit = async () => {
    setLoadingUser(true);

    try {
      await dispatch(UserUpdateStatus({ userId: currentItem, RoleId: roleId })).unwrap();

      if (selectedValue && selectedValue.value) {
        dispatch(
          getLoadUsersListFromCompany({
            CompanyId: selectedValue.value,
            roleId: 0,
            userId: 0,
          }),
        );
      }
    } catch (err) {
      console.error('Error updating user status:', err);
    } finally {
      setLoadingUser(false);
      setModal(false);
    }
  };

  const getAllCompaniesHandler = async () => {
    setLoadingDropdown(true);
    try {
      const res = await UserManagementServices.getAllCompanyData();
      setCompanyList(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDropdown(false);
    }
  };

  useEffect(() => {
    getAllCompaniesHandler();
  }, []);

  // Hydrate selectedValue from navigation state when options are ready
  useEffect(() => {
    if (navigationState?.companyId && companyList.length > 0) {
      const match = companyList
        .filter((item) => item.companyName !== 'SSB')
        .map((item) => ({
          value: item.companyId,
          label: `${item.companyName} (${item.regNumber || 'N/A'})`,
          userId: item.userId,
          companyName: item.companyName,
        }))
        .find((opt) => opt.value === navigationState.companyId);
      if (match) {
        setSelectedValue(match);
      }
    }
  }, [navigationState, companyList]);

  useEffect(() => {
    if (canViewCompanyUsersSetting === false) {
      navigate('/login');
    }
  }, [canViewCompanyUsersSetting, navigate]);

  useEffect(() => {
    if (selectedValue && selectedValue.value) {
      dispatch(
        getLoadUsersListFromCompany({
          CompanyId: selectedValue.value,
          roleId: 0,
          userId: 0,
          // userId: selectedValue.parentId === 0 ? 0 : selectedValue.userId,
        }),
      );
    }
  }, [selectedValue]);

  useEffect(() => {
    if (message) {
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      }
      // Reset the message after showing the toast to ensure it triggers again
      dispatch(setMessage({ message: '', type: '' }));
    }
  }, [message, type, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Employer Users - C3wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
        {/* ========== Left Sidebar Start ========== */}
        {/* Left Sidebar End */}
        <sidebar-barrrrrr></sidebar-barrrrrr>
        {/* ============================================================== */}
        {/* Start right Content here */}
        {/* ============================================================== */}

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
          <ul className="d-flex align-items-center mt-3 gap-2 list-unstyled">
            <li className="fw-medium">
              <Link to="/admin-dashboard" className="d-flex align-items-center gap-1 text-muted">
                <i className="ti-home" /> Admin Dashboard{' '}
              </Link>
            </li>
            <li>-</li>

            <li className="fw-medium">Employers</li>
          </ul>
        </div>
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="page-content-wrapper">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24"></div>

                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-header py-2 bg_ligh">
                        <div className="row align-items-center d-flex">
                          <div className="col-xl-6 col-6 mb-2 mb-lg-0">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user text-success pe-2" />
                              Employer Users
                            </h4>
                          </div>
                          <div className="col-4 addition">
                            {/* <Select
                              classNamePrefix="react-select"
                              options={options}
                              value={options.find((opt) => opt.value === selectedValue) || null}
                              onChange={handleChange} // <-- FIXED
                              placeholder="Select Employer"
                              isSearchable
                              isClearable
                            /> */}
                            <div className="select-wrapper">
                              <Select
                                options={options}
                                value={selectedValue || null}
                                onChange={handleChange}
                                placeholder="Search employer name or reg. Number"
                                isSearchable
                                isClearable
                                isLoading={false} // We use custom spinner
                                classNamePrefix="custom-select"
                                styles={{
                                  control: () => ({
                                    padding: '0px',
                                  }), // Disable inline styles
                                }}
                              />

                              {loadingDropdown && (
                                <Spinner size="sm" color="primary" className="select-spinner" />
                              )}
                            </div>
                          </div>
                          <div className="col-xl-2 col-2 text-end">
                            {selectedValue &&
                              selectedValue.value &&
                              selectedValue.parentId === 0 &&
                              (canAddCompanyUsersSetting ? (
                                <Button
                                  className="btn btn-success waves-effect waves-light h-45"
                                  type="submit"
                                  onClick={handleAddUser}
                                  disabled={!selectedValue || !selectedValue.value}
                                  title={
                                    !selectedValue || !selectedValue.value
                                      ? 'Select Employer to add users.'
                                      : ''
                                  }
                                >
                                  <i className="fas fa-plus pe-1" /> Add User
                                </Button>
                              ) : (
                                <button
                                  className="btn btn-secondary h-45"
                                  type="button"
                                  disabled
                                  style={{ opacity: 0.6 }}
                                >
                                  <i className="fas fa-plus pe-1" /> Add User{' '}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row align-items-center d-flex mt-3">
                          <div className="col-md-12 col-lg-12 col-xl-12">
                            <table className="table table-hover mb-0">
                              <thead>
                                <tr className="border-b">
                                  <th
                                    scope="row"
                                    onClick={() => handleSort('firstName')}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    Name {getSortIcon('firstName', Icon)}
                                  </th>
                                  <th
                                    onClick={() => handleSort('insertedOn')}
                                    style={{ cursor: 'pointer', minWidth: 150 }}
                                  >
                                    C3 Reg. Date {getSortIcon('insertedOn')}
                                  </th>
                                  <th
                                    onClick={() => handleSort('loginId')}
                                    style={{ minWidth: 150, cursor: 'pointer' }}
                                  >
                                    UserID / LoginId {getSortIcon('loginId', Icon)}
                                  </th>
                                  <th
                                    onClick={() => handleSort('roleId')}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    User Role {getSortIcon('roleId', Icon)}
                                  </th>
                                  <th
                                    onClick={() => handleSort('emailId')}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    Email {getSortIcon('emailId', Icon)}
                                  </th>
                                  <th>User Status</th>
                                  <th>Edit</th>
                                  <th>Reset Password</th>
                                  <th>Change Password</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sortedData?.length > 0 && selectedValue && selectedValue.value ? (
                                  sortedData?.map((item) => (
                                    <tr key={item.userId}>
                                      <td>{item.firstName}</td>
                                      <td>
                                        {item.insertedOn
                                          ? moment(item.insertedOn).format('DD-MMM-YYYY')
                                          : ''}
                                      </td>

                                      <td>{item.loginId}</td>
                                      <td>{item.roleId === 3 ? 'Company' : 'Company User'}</td>
                                      <td>{item.emailId}</td>
                                      {/* <td>{item.isActive ? 'True' : 'False'}</td> */}
                                      <td>
                                        <div className="toggle-container">
                                          <div
                                            className={`toggle-switchPayment ${
                                              item.isActive ? 'on' : ''
                                            }`}
                                            style={
                                              !canEditCompanyUsersSetting
                                                ? {
                                                    backgroundColor: '#d3d3d3', // gray background when disabled
                                                    opacity: 0.8, // slightly faded
                                                    cursor: 'not-allowed', // disable pointer
                                                  }
                                                : {}
                                            }
                                          >
                                            <FormGroup check>
                                              <Input
                                                type="checkbox"
                                                className="toggle-input"
                                                id={`toggle-${item.userId}`}
                                                checked={item.isActive}
                                                onChange={(e) =>
                                                  handleToggle(item.userId, e.target.checked)
                                                }
                                                disabled={!canEditCompanyUsersSetting}
                                              />

                                              <Label
                                                htmlFor={`toggle-${item.userId}`}
                                                className="toggle-handle"
                                              />

                                              <Label
                                                htmlFor={`toggle-${item.userId}`}
                                                className="toggle-status"
                                              >
                                                {item.isActive ? 'Active' : 'Inactive'}
                                              </Label>
                                            </FormGroup>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        {canEditCompanyUsersSetting ? (
                                          <Link
                                            to={`/apps/update-company-user/${item.userId}`}
                                            className="text-decoration-none"
                                            state={{
                                              companyId: selectedValue?.value,
                                              UseridUnique: selectedValue.userId,
                                              regNumber: selectedValue.regNumber,
                                              parentId: item.parentuserid ?? item.userId,
                                            }}
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
                                        <button
                                          type="submit"
                                          className="btn btn-success waves-effect waves-light"
                                          onClick={() => handleReset(item.userId)}
                                          disabled={resetLoading === item.userId}
                                        >
                                          {resetLoading === item.userId ? (
                                            <>
                                              <Spinner size="sm" /> Reset..
                                            </>
                                          ) : (
                                            <>
                                              <Icon.RotateCcw size={18} /> Reset
                                            </>
                                          )}
                                        </button>
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="badge bg-soft-primary text-primary p-1"
                                          onClick={() => handleShow(item.userId)}
                                        >
                                          <i className="fas fa-lock f-20" />{' '}
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="8" className="text-center">
                                      No records found
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
              </div>{' '}
              {/* container-fluid */}
            </div>
            {/* End Page-content */}
            <sidebar-barrrrr></sidebar-barrrrr>
          </div>
          {/* end main content*/}
        </div>
        <ResetPasswordUser show={show} handleClose={() => setShow(false)} userId={userIdState} />
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Confirm Action</ModalHeader>
        <ModalBody>
          <Label>Are you sure you want to change status?</Label>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" onClick={handleSubmit} disabled={loadingUser}>
            {loadingUser ? (
              <>
                Saving.. <Spinner size="sm" />
              </>
            ) : (
              'Save'
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default CompanyUsers;
