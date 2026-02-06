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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import ResetPasswordUser from './ResetPasswordUser';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import {
  getLoadSelfEmployList,
  getLoadUsersListFromCompany,
  resetUserData,
  getLoadSelfEmployListData,
  UserUpdateStatus,
} from '../../../store/apps/administration/AdministrationSlice';
import Loader from '../../../layouts/loader/Loader';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import { useSortableTable } from '../component/SortableTable';
import '../Payments/Active.scss';

const SelfEmployedUsers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const toggle = () => setModal(!modal);
  const roleId = localStorage.getItem('roleId');
  const [userIdState, setUserIdState] = useState('');
  const [show, setShow] = useState(false);
  const { state: navigationState } = useLocation();
  const { message, type } = useSelector((state) => state.messageReducer);
  const [selectedValue, setSelectedValue] = useState(navigationState?.companyId || '');
  const { selfUsersList, loading } = useSelector((state) => state.AdministrationReducer || {});
  const { sortedData, handleSort, getSortIcon } = useSortableTable(selfUsersList);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const [resetLoading, setResetLoading] = useState(null);
  const employerPermissionAdmin = savedRoles
    .flatMap((role) => role.children || [])
    .find(
      (child) =>
        child.description === 'SELF EMPLOYED' &&
        child.href === '/admin/manage-users/self-employed-users',
    );
  const canAddSelfEmployedUserSetting = employerPermissionAdmin?.addPermission;
  const canEditSelfEmployedUsersSetting = employerPermissionAdmin?.updatePermission;
  const canDeleteSelfEmployedUserSetting = employerPermissionAdmin?.deletePermission;
  const canViewSelfEmployedUserSetting = employerPermissionAdmin?.viewPermission;

  console.log('SELF EMPLOYED PERMISSION:', canEditSelfEmployedUsersSetting);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleAddUser = () => {
    navigate('/admin/add-self-user');
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
      dispatch(UserUpdateStatus({ userId: currentItem, RoleId: roleId }))
        .unwrap()
        .then(() => {
          dispatch(getLoadSelfEmployListData());
          setLoadingUser(false);
          setModal(false);
        });
    } catch (err) {
      console.log('err', err);
    } finally {
      setLoadingUser(false);
      setModal(false);
    }
  };

  useEffect(() => {
    dispatch(getLoadSelfEmployListData());
  }, []);

  useEffect(() => {
    if (canViewSelfEmployedUserSetting === false) {
      navigate('/login');
    }
  }, [canViewSelfEmployedUserSetting, navigate]);

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
        <title>Self Employed Users - C3wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
        {/* ========== Left Sidebar Start ========== */}
        {/* Left Sidebar End */}
        <sidebar-barrrrrr></sidebar-barrrrrr>
        {/* ============================================================== */}
        {/* Start right Content here */}
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

                <li className="fw-medium">Self Employee </li>
              </ul>
            </div>
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                    {/*    <div class="page-title mb-3">
                      <h5>Employer Details</h5> 
                  </div>
           */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24"></div>

                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header  bg_ligh">
                            <div className="row py-2 align-items-center d-flex">
                              <div className="col-xl-4 col-6 my-2 mb-lg-0">
                                <h4 className="header-title  ">
                                  <i className="far fa-user pe-2" />
                                  Self Employed Users
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="row align-items-center d-flex">
                              <div className="col-md-12 col-lg-12 col-xl-12">
                                <table className="table table-hover mb-0">
                                  <thead>
                                    <tr className="border-b">
                                      <th
                                        scope="row"
                                        onClick={() => handleSort('firstName')}
                                        style={{ cursor: 'pointer', minWidth: '140px' }}
                                      >
                                        Name {getSortIcon('firstName', Icon)}
                                      </th>
                                      <th
                                        onClick={() => handleSort('insertedOn')}
                                        style={{ cursor: 'pointer', }}
                                      >
                                        C3 Reg. Date {getSortIcon('insertedOn')}
                                      </th>

                                      <th
                                        onClick={() => handleSort('socSecNum')}
                                        style={{ cursor: 'pointer',  }}
                                      >
                                        SSN {getSortIcon('socSecNum', Icon)}
                                      </th>
                                      <th
                                        onClick={() => handleSort('email')}
                                        style={{ cursor: 'pointer', minWidth: 150 }}
                                      >
                                        Email {getSortIcon('email', Icon)}
                                      </th>
                                      <th>Mobile</th>
                                      <th>User Status</th>
                                      <th>Edit</th>
                                      <th style={{ minWidth: '120px' }}>Reset Password</th>
                                      <th>Change Password</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sortedData?.length > 0 ? (
                                      sortedData?.map((item) => (
                                        <tr key={item.employeeID}>
                                          <td>{item.fullName}</td>
                                          <td>
                                            {item.insertedOn
                                              ? moment(item.insertedOn).format('DD-MMM-YYYY')
                                              : ''}
                                          </td>
                                          <td>{item.socSecNum}</td>

                                          <td>{item.email}</td>
                                          <td>{item.mobile}</td>
                                          {/* <td>{item.isActive ? 'True' : 'False'}</td> */}
                                          <td>
                                            <div className="toggle-container">
                                              <div
                                                className={`toggle-switchPayment ${
                                                  item.isActive ? 'on' : ''
                                                }`}
                                                style={
                                                  !canEditSelfEmployedUsersSetting
                                                    ? {
                                                        backgroundColor: '#d3d3d3', // gray background when disabled
                                                        opacity: 0.6, // slightly faded
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
                                                    disabled={!canEditSelfEmployedUsersSetting}
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
                                            {canEditSelfEmployedUsersSetting ? (
                                              <Link
                                                to={`/admin/update-self-employed-user/${item.userId}`}
                                                className="text-decoration-none"
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
          </>
        )}
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
export default SelfEmployedUsers;
