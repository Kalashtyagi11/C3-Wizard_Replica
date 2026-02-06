import { Helmet } from 'react-helmet';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Label, Spinner } from 'reactstrap';
import moment from 'moment';
import {
  getRoleList,
  getRoleById,
  updateRoleList,
  getRoleListSide,
  // getRoleListSide
} from '../../../store/apps/Admin/RolemanagementSlice';
import Loader from '../../../layouts/loader/Loader';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';

const RoleManagement = () => {
  const dispatch = useDispatch();
  const [loadings, setLoadings] = useState(false);
  const { RoleList, RoleListById, loading } = useSelector((state) => state.RoleSlice || {});
  const { message, type } = useSelector((state) => state.messageReducer);
  const roleIdLogin = parseInt(localStorage.getItem('roleId'), 10);
  const CategoryType = localStorage.getItem('roleCategory')?.trim()?.toUpperCase();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [roleIdNew, setRoleIdNew] = useState(0);
  const [roleId, setRoleId] = useState(roleIdLogin);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (RoleList?.length > 0) {
      const flattenedList = [];

      RoleList.forEach((item) => {
        // Add main menu item
        flattenedList.push({
          ...item,
          viewPermission: item.viewPermission ?? false,
          addPermission: item.addPermission ?? false,
          updatePermission: item.updatePermission ?? false,
          deletePermission: item.deletePermission ?? false,
        });

        // Add each submenu as its own row
        if (item.children?.length > 0) {
          item.children.forEach((subItem) => {
            flattenedList.push({
              ...subItem,
              parentMenu: item.title, // Optional, to show parent in UI
              viewPermission: subItem.viewPermission ?? false,
              addPermission: subItem.addPermission ?? false,
              updatePermission: subItem.updatePermission ?? false,
              deletePermission: subItem.deletePermission ?? false,
            });
          });
        }
      });

      setPermissions(flattenedList);
    }
  }, [RoleList]);

  const handleCheckboxChange = (menuId, permissionType) => {
    setPermissions((prevPermissions) => {
      const updateItem = (item, isChecked) => ({
        ...item,
        [permissionType]: isChecked,
        children: item.children
          ? item.children.map((child) => updateItem(child, isChecked))
          : undefined,
      });

      const updatedPermissions = prevPermissions.map((item) => {
        if (item.title.toLowerCase() === 'dashboard' && permissionType === 'viewPermission') {
          return { ...item, [permissionType]: true };
        }

        // If parent menu is clicked
        if (item.id === menuId) {
          const newPermissionValue = !item[permissionType];
          return updateItem(item, newPermissionValue); // This already updates children
        }

        // If child menu is clicked
        if (item.parentId === menuId) {
          const newPermissionValue = !item[permissionType];
          const updatedChild = { ...item, [permissionType]: newPermissionValue };

          const siblings = prevPermissions.filter(
            (sibling) => sibling.parentId === item.parentId && sibling.id !== item.id,
          );
          const allUnchecked = siblings.every((sib) => !sib[permissionType]) && !newPermissionValue;

          return updatedChild;
        }

        return item;
      });

      // After updating, uncheck parent if all children are unchecked
      const finalPermissions = updatedPermissions.map((item) => {
        if (item.children && item.children.length > 0) {
          const allChildrenUnchecked = item.children.every((child) => !child[permissionType]);
          return {
            ...item,
            [permissionType]: allChildrenUnchecked ? false : item[permissionType],
          };
        }
        return item;
      });

      return finalPermissions;
    });
  };

  const findParentPermission = (parentId, permissionType) => {
    const parent = permissions.find((item) => item.id === parentId);
    return parent ? parent[permissionType] : true; // Default to true if no parent found
  };

  // const HandleSubmit = async () => {
  //   setLoadings(true);
  //   setRoleIdNew(roleId);
  //   try {
  //     await dispatch(updateRoleList(permissions))
  //       .unwrap()
  //       .then((response) => {
  //         if (roleId === '1' && roleIdNew === roleId) {
  //           dispatch(getRoleListSide(Number(roleId)));
  //         }
  //         if (roleId === 2 && roleIdNew === roleId) {
  //           dispatch(getRoleListSide(Number(roleId)));
  //         }
  //       });
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //   } finally {
  //     setLoadings(false);
  //   }
  // };

  const HandleSubmit = async () => {
    setLoadings(true);

    try {
      const response = await dispatch(updateRoleList(permissions)).unwrap();

      // If API success and roleId is 1 or 2 => dispatch update
      const id = Number(roleId);

      if (response?.status === true) {
        if (id === 1 || id === 2) {
          dispatch(getRoleListSide(id));
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoadings(false);
    }
  };

  const handleRoleChange = (e) => {
    const selectedRoleId = e.target.value;
    setRoleId(selectedRoleId);

    // find the parent category of this role
    const category = RoleListById?.find((group) =>
      group.roleName.some((role) => role.roleId.toString() === selectedRoleId),
    );

    setSelectedCategoryId(category?.id || '');
  };

  useEffect(() => {
    dispatch(getRoleById());
  }, [dispatch]);

  useEffect(() => {
    if (RoleList?.length > 0) {
      const defaultRole = RoleList.find((role) => role.roleId === 1); // or match by roleName === "Administrative"
      if (defaultRole) {
        setRoleId(defaultRole.roleId.toString());
        const category = RoleListById?.find((group) =>
          group.roleName.some((r) => r.roleId === defaultRole.roleId),
        );
        setSelectedCategoryId(category?.id || '');
      }
    }
  }, [RoleList, RoleListById]);

  useEffect(() => {
    if (roleId) {
      dispatch(getRoleList(Number(roleId)));
    }
  }, [dispatch, roleId]);

  useEffect(() => {
    dispatch(getRoleList(roleId));
  }, [dispatch, roleId]);

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

  return (
    <>
      <Helmet>
        <title>Role Permission - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
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
            <li className="fw-medium">Role Management </li>
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
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24"></div>
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-3 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-8">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-file-alt pe-1" />
                                  Role Permission
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="row mt-3">
                              <div className="col-md-4 col-lg-4 col-xl-4">
                                <div className="mb-3">
                                  <Label>Role Permission</Label>
                                  <div className="mb-3">
                                    <select
                                      id="role"
                                      name="role"
                                      className="form-select"
                                      value={roleId || ''}
                                      onChange={handleRoleChange}
                                    >
                                      <option value="">Select a Role</option>

                                      {RoleListById?.map((group) => (
                                        <optgroup key={group.id} label={group.name}>
                                          {group.roleName.map((role) => (
                                            <option key={role.roleId} value={role.roleId}>
                                              {role.roleName}
                                            </option>
                                          ))}
                                        </optgroup>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-3 col-lg-3 col-xl-3">
                                <Label>&nbsp;</Label>
                                <div className="mb-3">
                                  <button
                                    className="btn btn-success waves-effect waves-light h-45"
                                    type="submit"
                                    onClick={HandleSubmit}
                                    disabled={loadings}
                                  >
                                    {loadings ? (
                                      <>
                                        <Spinner size="sm" /> Saving ..
                                      </>
                                    ) : (
                                      <>
                                        <i className="far fa-save pe-1" /> Save
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-3 bg_ligh">
                            <h4 className="header-title mb-0 text-success">List</h4>
                          </div>
                          <div className="card-body pt-1">
                            <div className="table-responsive Customize_row">
                              <table className=" Customize_rowtable  table table-hover mb-0  white-space  tableword-wrap">
                                <thead>
                                  <tr className="border-b">
                                    <th style={{ maxWidth: '200px' }}>Module</th>
                                    {/* <th style={{ minWidth: '200px' }}>SubMenu</th> */}
                                    <th>View</th>
                                    <th>Add</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>Preview</th>
                                    <th>Print</th>
                                    <th>Submit</th>
                                    {selectedCategoryId !== 'SSB' && <th>Pay</th>}
                                  </tr>
                                </thead>

                                <tbody className="Customize_rowtbody">
                                  {permissions.length > 0 ? (
                                    permissions.map((item) => (
                                      // <tr className='customizetr' key={item.id}>
                                      <tr
                                        key={item.id}
                                        className="customizetr"
                                        style={{
                                          backgroundColor: !item.parentMenu
                                            ? '#e3f2fd'
                                            : 'transparent',
                                          fontWeight: !item.parentMenu ? 'bold' : 'normal',
                                          borderBottom: !item.parentMenu
                                            ? '2px solid #9e9490'
                                            : 'none',
                                        }}
                                      >
                                        {/* <td>{item.parentMenu || item.menuName}</td> */}
                                        {/* If it's submenu, show parentMenu */}
                                        <td>{item.title}</td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={item.viewPermission}
                                            onChange={() =>
                                              handleCheckboxChange(item.id, 'viewPermission')
                                            }
                                            disabled={
                                              item.parentId &&
                                              !findParentPermission(item.parentId, 'viewPermission')
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={item.addPermission}
                                            onChange={() =>
                                              handleCheckboxChange(item.id, 'addPermission')
                                            }
                                            disabled={
                                              item.parentId &&
                                              !findParentPermission(item.parentId, 'viewPermission')
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={item.updatePermission}
                                            onChange={() =>
                                              handleCheckboxChange(item.id, 'updatePermission')
                                            }
                                            disabled={
                                              item.parentId &&
                                              !findParentPermission(item.parentId, 'viewPermission')
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={item.deletePermission}
                                            onChange={() =>
                                              handleCheckboxChange(item.id, 'deletePermission')
                                            }
                                            disabled={
                                              item.parentId &&
                                              !findParentPermission(item.parentId, 'viewPermission')
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={item.is_preview}
                                            onChange={() =>
                                              handleCheckboxChange(item.id, 'is_preview')
                                            }
                                            disabled={
                                              item.parentId &&
                                              !findParentPermission(item.parentId, 'is_preview')
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={item.is_Print}
                                            onChange={() =>
                                              handleCheckboxChange(item.id, 'is_Print')
                                            }
                                            disabled={
                                              item.parentId &&
                                              !findParentPermission(item.parentId, 'is_Print')
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={item.is_Submitted}
                                            onChange={() =>
                                              handleCheckboxChange(item.id, 'is_Submitted')
                                            }
                                            disabled={
                                              item.parentId &&
                                              !findParentPermission(item.parentId, 'is_Submitted')
                                            }
                                          />
                                        </td>
                                        {selectedCategoryId !== 'SSB' && (
                                          <td>
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              checked={item.is_pay}
                                              onChange={() =>
                                                handleCheckboxChange(item.id, 'is_pay')
                                              }
                                              disabled={
                                                item.parentId &&
                                                !findParentPermission(item.parentId, 'is_pay')
                                              }
                                            />
                                          </td>
                                        )}
                                      </tr>
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

        {/* END layout-wrapper */}

        {/* PopUp Start   */}

        {/* Popup End  */}
      </div>
    </>
  );
};
export default RoleManagement;
