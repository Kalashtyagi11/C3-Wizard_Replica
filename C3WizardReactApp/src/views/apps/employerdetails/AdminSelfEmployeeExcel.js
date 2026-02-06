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
import { toast } from 'react-toastify';
import Select from 'react-select';
import { Helmet } from 'react-helmet';
import moment from 'moment';
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
import EmployeeDownloadButton from '../component/AdminSelfEmployeeDownload';

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
    .find((child) => child.description === 'SELF EMPLOYED HISTORY');
  const canAddSelfEmployedUserSetting = employerPermission?.addPermission;
  const canEditSelfEmployedUsersSetting = employerPermission?.updatePermission;
  const canDeleteSelfEmployedUserSetting = employerPermission?.deletePermission;
  const canViewSelfEmployedUserSetting = employerPermission?.viewPermission;

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

  const handleEditClick = (employeeID) => {
    navigate('/admin/SelfUserDetails', {
      state: { selfEmployeeid: employeeID },
    });
  };

  const exportExcel = () => {
    console.log('exportExcel');
  };

  return (
    <>
      <Helmet>
        <title>Self Employee History - C3wizard</title>
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

                <li className="fw-medium">Self Employee History </li>
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
                                  Self Employed History
                                </h4>
                              </div>
                              <div className="col-xl-2 col-12 mb-2 mb-lg-0"></div>

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

                              <div className="col-xl-2 col-12 mb-2 mb-lg-0">
                                <EmployeeDownloadButton selectedValue={selectedValue} />
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
                                        C3 Reg. Date {getSortIcon('insertedOn')}
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
