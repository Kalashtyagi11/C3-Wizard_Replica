import React, { useEffect, useState } from 'react';
import {
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
  Spinner,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';
import moment from 'moment';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import CustomPagination from '../component/CustomPagination';
import {
  getLoadSelfEmployList,
  getLoadUsersListFromCompany,
  resetUserData,
  UserUpdateStatus,
} from '../../../store/apps/administration/AdministrationSlice';
import Loader from '../../../layouts/loader/Loader';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import { useSortableTable } from '../component/SortableTable';
import '../Payments/Active.scss';

const AdminSelfEmployee = () => {
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const toggle = () => setModal(!modal);
  const roleId = localStorage.getItem('roleId');
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchName, setSearchName] = useState('');
  const [userIdState, setUserIdState] = useState('');
  const [show, setShow] = useState(false);
  const { state: navigationState } = useLocation();
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { message, type } = useSelector((state) => state.messageReducer);
  const [selectedValue, setSelectedValue] = useState(navigationState?.companyId || '');
  const { selfUsersList, loading } = useSelector((state) => state.AdministrationReducer || {});
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const [resetLoading, setResetLoading] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'ssn', direction: 'asc' });

  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'SELF EMPLOYED');
  const canAddSelfEmployedUserSetting = employerPermission?.addPermission;
  const canEditSelfEmployedUsersSetting = employerPermission?.updatePermission;
  const canDeleteSelfEmployedUserSetting = employerPermission?.deletePermission;
  const canViewSelfEmployedUserSetting = employerPermission?.viewPermission;

  // Using a simpler approach for sorting - we'll rely on server-side sorting
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key && prev.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key, SortIcons) => {
    if (!SortIcons) return null;

    if (sortConfig.key !== key) {
      return SortIcons.ArrowUpDown ? <SortIcons.ArrowUpDown size={14} /> : null;
    }

    if (sortConfig.direction === 'asc') {
      return SortIcons.ArrowUp ? <SortIcons.ArrowUp size={14} /> : null;
    }

    return SortIcons.ArrowDown ? <SortIcons.ArrowDown size={14} /> : null;
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  console.log('selfUsersList', selfUsersList);
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

  const getAllSelfEmployerHandler = async () => {
    setLoadingDropdown(true);
    try {
      const res = await UserManagementServices.getAllSelfEmployerData();
      setEmployeeList(res.data.data);
      setTotalRecords(res.data.data.totalRecords);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingDropdown(false);
    }
  };

  useEffect(() => {
    getAllSelfEmployerHandler();
  }, []);

  const options = employeeList
    .filter((item) => item.firstName !== 'SSB')
    .sort((a, b) => a.firstName.localeCompare(b.firstName))
    .map((item) => ({
      value: item.firstName,
      // label: item.firstName,
      label: `${item.firstName} (${item.socSecNum || 'N/A'})`,
      socSecNum: item.socSecNum,
    }));

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
          dispatch(
            getLoadSelfEmployList({ pageNumber, pageSize, firstName: selectedValue, sortConfig }),
          );
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

  const handleChanged = (selectedOption) => {
    setSelectedValue(selectedOption?.value || '');
    setPageNumber(0);
  };

  useEffect(() => {
    dispatch(getLoadSelfEmployList({ pageNumber, pageSize, firstName: selectedValue, sortConfig }))
      .unwrap()
      .then((res) => {
        setTotalRecords(res.selfUsersList.totalRecords);
        setTotalPages(res.selfUsersList.totalPages);
      });
  }, [pageNumber, pageSize, selectedValue, sortConfig]);

  useEffect(() => {
    if (canViewSelfEmployedUserSetting === false) {
      navigate('/login');
    }
  }, [canViewSelfEmployedUserSetting, navigate]);

  // Filter the data based on search term (this will now be done on server-side filtered data)
  const filteredData =
    selfUsersList?.records?.filter((user) =>
      user.fullName?.toLowerCase().includes(searchName.toLowerCase()),
    ) || [];

  const handleSearchNameChange = (e) => setSearchName(e.target.value);

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

  // const handleEditClick = (employeeID) => {
  //   navigate(`/apps/personalDetails/${employeeID}`);
  // };

  const handleEditClick = (employeeID) => {
    navigate('/admin/SelfUserDetails', {
      state: { selfEmployeeid: employeeID },
    });
  };

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

                <li className="fw-medium">Self Employee Details </li>
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
                          <div className="card-header py-2 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-4 col-6 mb-2 mb-lg-0">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-user text-success pe-2" />
                                  Self Employed List
                                </h4>
                              </div>
                              <div className="col-xl-4 col-6 mb-2 mb-lg-0"></div>
                              <div className="col-xl-4 col-12 ">
                                <div className="select-wrapper">
                                  <Select
                                    options={options}
                                    value={
                                      options.find((opt) => opt.value === selectedValue) || null
                                    }
                                    onChange={handleChanged}
                                    placeholder="Search by self employer name or SSN"
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
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="row align-items-center d-flex ">
                              <div className="col-md-12 col-lg-12 col-xl-12">
                                <table className="table table-hover mb-0">
                                  <thead>
                                    <tr className="border-b">
                                      <th
                                        onClick={() => handleSort('ssn')}
                                        style={{ cursor: 'pointer', minWidth: 150 }}
                                      >
                                        SSN&nbsp;
                                        {getSortIcon('ssn', Icon)}
                                      </th>
                                      <th
                                        onClick={() => handleSort('insertedOn')}
                                        style={{ cursor: 'pointer', minWidth: 150 }}
                                      >
                                        C3 Reg. Date
                                        {getSortIcon('insertedOn')}
                                      </th>
                                      <th
                                        onClick={() => handleSort('name')}
                                        style={{ cursor: 'pointer' }}
                                        scope="row"
                                      >
                                        Name {getSortIcon('name', Icon)}
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
                                      <th>Users</th>
                                      {/* <th style={{ minWidth: '120px' }}>Reset Password</th>
                                      <th>Change Password</th> */}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData?.length > 0 ? (
                                      filteredData.map((item, index) => (
                                        <tr key={item.employeeID}>
                                          <td>{item.socSecNum}</td>
                                          <td>
                                            {item.insertedOn
                                              ? moment(item.insertedOn).format('DD-MMM-YYYY')
                                              : ''}
                                          </td>
                                          <td>{item.fullName}</td>

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
                                              // <Link
                                              //   to={`/admin/update-self-employed-user/${item.userId}`}
                                              //   className="text-decoration-none"
                                              // >
                                              //   <span className="badge bg-soft-success text-success">
                                              //     <Icon.Edit size={20} />
                                              //   </span>
                                              // </Link>
                                              <span
                                                type="button"
                                                // className="badge bg-soft-success text-success border-0"
                                                onClick={() => handleEditClick(item.employeeID)}
                                              >
                                                <span className="badge bg-soft-success text-success">
                                                  <Icon.Edit size={20} />
                                                </span>
                                              </span>
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
                                            {canEditSelfEmployedUsersSetting ? (
                                              <Link
                                                to={`/admin/update-self-employed-user/${item.userId}`}
                                                className="text-decoration-none"
                                              >
                                                <span className="badge align-items-center bg-soft-success gap-1 border2">
                                                  <Icon.Users size={20} />

                                                  <span
                                                    className="position-absolute translate-middle-y badge rounded-pill bg-primary"
                                                    style={{ fontSize: '9px' }}
                                                  >
                                                    {/* {item.employeeCount} */}1
                                                    <span className="visually-hidden">
                                                      unread messages
                                                    </span>
                                                  </span>
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
                                          {/* <td>
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
                                          </td> */}
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
                              {/* <div className="d-flex justify-content-between align-items-center mt-3">
                            
                                <div className="mb-3">
                                  {totalRecords === 0
                                    ? '0'
                                    : `${pageNumber * pageSize + 1}-${Math.min(
                                        (pageNumber + 1) * pageSize,
                                        totalRecords,
                                      )} of ${totalRecords}`}
                                </div>

                                
                                <Pagination>
                                  
                                  <PaginationItem disabled={pageNumber === 0}>
                                    <PaginationLink previous onClick={handlePrevious}>
                                      <Icon.ChevronLeft size={16} /> Back
                                    </PaginationLink>
                                  </PaginationItem>

                                
                                  <PaginationItem active={pageNumber === 0}>
                                    <PaginationLink onClick={() => handlePageClick(0)}>
                                      1
                                    </PaginationLink>
                                  </PaginationItem>

                                 
                                  {totalPages > 1 && (
                                    <PaginationItem active={pageNumber === 1}>
                                      <PaginationLink onClick={() => handlePageClick(1)}>
                                        2
                                      </PaginationLink>
                                    </PaginationItem>
                                  )}

                               
                                  {pageNumber > 1 && totalPages > 2 && (
                                    <>
                                      <PaginationItem>
                                        <PaginationLink disabled>...</PaginationLink>
                                      </PaginationItem>
                                      <PaginationItem active>
                                        <PaginationLink>{pageNumber + 1}</PaginationLink>
                                      </PaginationItem>
                                    </>
                                  )}

                                 
                                  {totalPages > 3 && pageNumber < totalPages - 2 && (
                                    <PaginationItem>
                                      <PaginationLink disabled>...</PaginationLink>
                                    </PaginationItem>
                                  )}

                             
                                  <PaginationItem disabled={pageNumber >= totalPages - 1}>
                                    <PaginationLink next onClick={handleNext}>
                                      Next <Icon.ChevronRight size={16} />
                                    </PaginationLink>
                                  </PaginationItem>
                                </Pagination>
                              </div> */}
                              <CustomPagination
                                pageNumber={pageNumber}
                                pageSize={pageSize}
                                totalRecords={totalRecords}
                                totalPages={totalPages}
                                onPageChange={setPageNumber}
                              />
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
        {/* <ResetPasswordUser show={show} handleClose={() => setShow(false)} userId={userIdState} /> */}
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
export default AdminSelfEmployee;
