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
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import {
  getLoadUsersList,
  UserUpdateStatus,
} from '../../../store/apps/administration/AdministrationSlice';
import { getEmployerList, EmployersGetByHeader } from '../../../store/apps/employer/EmployerSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import ResetPasswordUser from './ResetPasswordUser';
import Loader from '../../../layouts/loader/Loader';
import '../Payments/Active.scss';

const UserManagement = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const toggle = () => setModal(!modal);
  const { message, type } = useSelector((state) => state.messageReducer);
  const { usersList } = useSelector((state) => state.AdministrationReducer || {});
  const { EmployeeList, EmployersHeader } = useSelector((state) => state.employerSlice || {});
  const [userIdState, setUserIdState] = useState('');
  const companyId = localStorage.getItem('companyId');
  const UserId = localStorage.getItem('userID');
  const roleId = localStorage.getItem('roleId');
  const [show, setShow] = useState(false);
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'USER MANAGEMENT');
  const canAddUserManagement = employerPermission?.addPermission;
  const canEditUserManagement = employerPermission?.updatePermission;
  const canDeleteUserManagement = employerPermission?.deletePermission;
  const canViewUserManagement = employerPermission?.viewPermission;

  useEffect(() => {
    if (canViewUserManagement === false) {
      navigate('/login');
    }
  }, [canViewUserManagement, navigate]);

  const handleAddUser = () => {
    navigate('/apps/add-user');
  };
  const handleShow = (id) => {
    setShow(true);
    setUserIdState(id);
  };

  const handleEdit = (userId, parentuserid) => {
    localStorage.setItem('editUserId', userId); // Save to storage
    localStorage.setItem('parentId', parentuserid);

    navigate('/apps/update-user'); // Navigate without ID in path
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
          const storedUserId = localStorage.getItem('userID');
          const hasParentZero = EmployeeList?.some((item) => item.parent_Id === 0);
          const payloadUserId = hasParentZero ? 0 : storedUserId;
          dispatch(getLoadUsersList({ companyId, UserId: payloadUserId, roleId }));
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
    dispatch(getEmployerList({ companyId, roleId }));
  }, []);

  useEffect(() => {
    setLoading(true);
    const storedUserId = localStorage.getItem('userID');
    const hasParentZero = EmployeeList?.some((item) => item.parent_Id === 0);
    const payloadUserId = hasParentZero ? 0 : storedUserId;
    dispatch(getLoadUsersList({ companyId, UserId: payloadUserId, roleId }))
      .unwrap()
      .then(() => {
        setLoading(false); // hide loader after success
      })
      .catch(() => {
        setLoading(false); // hide loader even on error
      });
  }, [EmployeeList, companyId, roleId]);

  useEffect(() => {
    dispatch(EmployersGetByHeader({ companyId, UserId }));
  }, [dispatch]);

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
        <title>User Management - C3wizard</title>
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
          <ul className="d-flex align-items-center gap-2 mt-3 list-unstyled">
            <li className="fw-medium">
              <Link to="/dashboard" className="d-flex align-items-center gap-1 text-muted">
                {' '}
                <i className="ti-home" /> Dashboard{' '}
              </Link>
            </li>
            <li>-</li>

            <li className="fw-medium"> User Management </li>
          </ul>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
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
                          <div className="card-header py-2 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-4 col-6 mb-2 mb-lg-0">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-user text-success pe-2" /> User Management
                                </h4>
                              </div>
                              <div className="col-xl-8 col-6 text-end">
                                {canAddUserManagement ? (
                                  <Button
                                    className="btn btn-success waves-effect waves-light h-45"
                                    type="submit"
                                    onClick={handleAddUser}
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
                                    <i className="fas fa-plus pe-1" /> Add User
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="row align-items-center d-flex mt-3">
                              <div className="col-md-12 col-lg-12 col-xl-12">
                                <table className="table table-hover mb-0">
                                  <thead>
                                    <tr className="border-b">
                                      <th scope="row">Name</th>
                                      <th style={{ minWidth: 150 }}>UserID / LoginId</th>
                                      <th>User Role</th>
                                      <th>Email</th>
                                      <th>User Status</th>
                                      <th>Edit</th>
                                      <th>Change Password</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {usersList?.length > 0 ? (
                                      usersList?.map((item) => (
                                        <tr key={item.userId}>
                                          <td>{item.firstName}</td>
                                          <td>{item.loginId}</td>
                                          <td>{item.lastName}</td>
                                          <td>{item.emailId}</td>
                                          {/* <td>{item.isActive ? 'True' : 'False'}</td> */}
                                          <td>
                                            <div className="toggle-container">
                                              <div
                                                className={`toggle-switchPayment ${
                                                  item.isActive ? 'on' : ''
                                                }`}
                                                style={
                                                  !canEditUserManagement
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
                                                    disabled={!canEditUserManagement}
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
                                            {canEditUserManagement ? (
                                              <div
                                                // <Link
                                                //   to={`/apps/update-user/${item.userId}`}
                                                onClick={() =>
                                                  handleEdit(
                                                    item.userId,
                                                    item.parentuserid !== null
                                                      ? item.parentuserid
                                                      : item.userId,
                                                  )
                                                }
                                                className="text-decoration-none"
                                              >
                                                <span className="badge bg-soft-success text-success">
                                                  <Icon.Edit size={20} />
                                                </span>
                                                {/* </Link> */}
                                              </div>
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
export default UserManagement;
