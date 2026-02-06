import { Helmet } from 'react-helmet';
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Label, Spinner } from 'reactstrap';
//import { Label } from 'reactstrap';
import * as Icon from 'react-feather';
import Loader from '../../../layouts/loader/Loader';
import { getAllRoles, deleteRole } from '../../../store/apps/dashboard/DashboardSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import ConfirmationModal from '../settings/components/ConfirmationModal';

const RoleMaster = () => {
  const [show, setShow] = useState(false);
  const [headerId, setHeaderId] = useState(null);
  const [periodYear, setPeriodYear] = useState(null);
  const [periodMonth, setPeriodMonth] = useState(null);
  const CompanyId = localStorage.getItem('companyId');
  const userId = localStorage.getItem('userID');
  const userName = localStorage.getItem('userId');
  const userPassword = localStorage.getItem('userPassword');
  const UserName = localStorage.getItem('userName');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { id } = useParams();

  const dispatch = useDispatch();
  // const companyId = localStorage.getItem('companyId');
  const companyId = 2;
  const { message, type } = useSelector((state) => state.messageReducer);
  const { AllRolesList, DeleteRole, loading } = useSelector((state) => state.dashboardSlice);
  const { previewData } = useSelector((state) => state.dashboardSlice);
  const getDate = new Date();
  const [Year, setYear] = useState(getDate.getFullYear().toString());
  const [FromMonth, setFromMonth] = useState('');
  const [ToMonth, setToMonth] = useState('');
  const navigate = useNavigate();

  const savedRoles = JSON.parse(localStorage.getItem('roleList'));

  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'ROLE MASTER');
  const canAddRoleMasterSetting = employerPermission?.addPermission;
  const canEditSRoleMasterSetting = employerPermission?.updatePermission;
  const canDeleteRoleMasterSetting = employerPermission?.deletePermission;
  const canViewRoleMasterSetting = employerPermission?.viewPermission;

  useEffect(() => {
    dispatch(getAllRoles());
    console.log('MasterRole', AllRolesList);
  }, []);

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

  const handleDelete = async () => {
    try {
      if (!selectedItem) return;
      console.log('selectedItemmmmm', selectedItem);
      const res = await dispatch(deleteRole(selectedItem)).unwrap();

      if (res === true) {
        toast.success(res.message || 'Role deleted successfully');
        dispatch(getAllRoles()); // Refresh role list
      } else {
        toast.error(res.message || 'Failed to delete role');
      }
    } catch (error) {
      // error is the message we passed via rejectWithValue
      //  toast.error(error || 'Error deleting role');
      //console.error(error);
      // } catch (error) {
      //
      toast.error(error || 'Error deleting role');
      //   console.error(error);
    } finally {
      setModalShow(false);
      setSelectedItem(null);
    }
  };

  const groupedRoles = AllRolesList?.roleCategories?.map((category) => ({
    categoryName: category.name,
    roles: category.roleName,
  }));

  useEffect(() => {
    if (canViewRoleMasterSetting === false) {
      navigate('/login');
    }
  }, [canViewRoleMasterSetting, navigate]);

  return (
    <>
      <Helmet>
        <title>Role Master - C3Wizard</title>
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
            <Link to="/admin-dashboard" className="d-flex align-items-center gap-1 text-muted">
              <i className="ti-home" /> Admin Dashboard{' '}
            </Link>
            {/* <li>-</li> */}
            {/* <li className="fw-medium">
                  <span className="d-flex align-items-center gap-1 text-muted">Administration</span>
                </li> */}
            <li>-</li>
            <li className="fw-medium">Role Master </li>
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
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-3 bg_ligh">
                            <div className="row">
                              <div className="col-xl-4">
                                <h4 className="header-title mb-0 text-success">Role List</h4>
                              </div>
                              <div className="col-xl-8 text-end">
                                {canAddRoleMasterSetting ? (
                                  <Link
                                    to="/apps/roleMaster/AddRole"
                                    className="btn btn-success waves-effect waves-light h-45"
                                    type="submit"
                                  >
                                    <i className="fas fa-plus pe-1"></i> Add Role
                                  </Link>
                                ) : (
                                  <button
                                    className="btn btn-secondary h-45"
                                    type="button"
                                    disabled
                                    style={{ opacity: 0.6 }}
                                  >
                                    <i className="fas fa-plus pe-1"></i> Add Role
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="card-body pt-1">
                            <div className="table-responsive">
                              <table className="table table-hover mb-0  white-space  tableword-wrap">
                                <thead>
                                  <tr className="border-b">
                                    <th>S.N.</th>
                                    <th>Role Id</th>
                                    <th>Role Name</th>
                                    <th>Description</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {groupedRoles && groupedRoles.length > 0 ? (
                                    groupedRoles.map((group, groupIndex) => (
                                      <>
                                        {/* Group header row */}
                                        <tr className="bg-light">
                                          <td className="bg-light f-600 text-dark" colSpan="18">
                                            {group.categoryName}
                                          </td>
                                        </tr>

                                        {/* Role rows under each group */}
                                        {group.roles.map((item, index) => (
                                          <tr key={item.roleId}>
                                            <td>{index + 1}</td>
                                            <td>{item.roleId ?? 'N/A'}</td>
                                            <td>{item.roleName ?? 'N/A'}</td>
                                            <td>{item.description ?? 'N/A'}</td>
                                            <td>
                                              {canEditSRoleMasterSetting ? (
                                                <Link
                                                  to={`/apps/roleMaster/updateRole/${item.roleId}`}
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
                                              {canDeleteRoleMasterSetting ? (
                                                <span
                                                  onClick={() => {
                                                    setModalShow(true);
                                                    setSelectedItem(item.roleId);
                                                  }}
                                                  className="badge bg-soft-danger text-danger"
                                                  aria-hidden="true"
                                                >
                                                  <i className="ti-trash f-20"></i>
                                                </span>
                                              ) : (
                                                <span
                                                  className="badge bg-soft-secondary text-muted"
                                                  style={{ opacity: 0.5, pointerEvents: 'none' }}
                                                >
                                                  <i className="ti-trash f-20"></i>
                                                </span>
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="6" className="text-center">
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
export default RoleMaster;
