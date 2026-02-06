import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
  Button,
  Modal,
  ModalHeader,
} from 'reactstrap';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import Select from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
import UserManagementServices from '../../../service/user-management/UserManagementServices';
import Loader from '../../../layouts/loader/Loader';
import CustomPagination from '../component/CustomPagination';
import { getAllCompanyList } from '../../../store/apps/administration/AdministrationSlice';
import RealationShipSetting from '../C3/realtionShipSetting';

const AdminEmployerDetails = () => {
  const relationRef = useRef(null);
  const [footerLoading, setFooterLoading] = useState(false);
  const dispatch = useDispatch();
  const { companyList: reduxCompanyList, loading: reduxLoading } = useSelector(
    (state) => state.administration || {},
  );
  const [companyList, setCompanyList] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'ssn', direction: 'asc' });
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // const getServerSortIcon = (key) => {
  //   if (sortConfig.key !== key) {
  //     return Icon.ArrowUp ? <Icon.ArrowUp size={14} /> : null;
  //   }

  //   if (sortConfig.direction === 'asc') {
  //     return Icon.ArrowUp ? <Icon.ArrowUp size={14} /> : null;
  //   }

  //   return Icon.ArrowDown ? <Icon.ArrowDown size={14} /> : null;
  // };

  const getServerSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;

    return sortConfig.direction === 'asc' ? (
      Icon.ArrowUp ? (
        <Icon.ArrowUp size={14} />
      ) : null
    ) : Icon.ArrowDown ? (
      <Icon.ArrowDown size={14} />
    ) : null;
  };

  const [dropdownCompanyList, setDropdownCompanyList] = useState([]); // Separate state for dropdown
  const [searchName, setSearchName] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState('');
  const { message, type } = useSelector((state) => state.messageReducer);
  const [loading, setLoading] = useState(false);
  const roleId = parseInt(localStorage.getItem('roleId'), 10);
  const categoryRole = localStorage.getItem('roleCategory')?.trim()?.toUpperCase();
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles.find((role) => role.title === 'EMPLOYER DETAILS');
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const canEditEmployer = employerPermission?.updatePermission;
  const canViewEmployer = employerPermission?.viewPermission;

  useEffect(() => {
    if (canViewEmployer === false) {
      navigate('/login');
    }
  }, [canViewEmployer, navigate]);

  // Mapping countryId to country name
  const getCountryName = (countryId) => {
    return countryId === '1' ? 'Saint Kitts' : countryId === '2' ? 'Nevis' : 'Unknown';
  };

  // Get companies for grid
  const getAllCompaniesHandler = async () => {
    setLoading(true);
    try {
      const result = await dispatch(
        getAllCompanyList({
          pageNumber,
          pageSize,
          firstName: selectedValue,
          sortConfig,
        }),
      ).unwrap();

      // The result contains the full response, we need to extract the data
      // Since we're not storing totalRecords and totalPages in Redux, we need to get them from the result
      if (result && result.companyList) {
        setCompanyList(result.companyList.records);
        setTotalRecords(result.companyList.totalRecords);
        setTotalPages(result.companyList.totalPages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Get companies for dropdown only
  const getAllCompanyDataHandler = async () => {
    setLoadingDropdown(true);
    try {
      const res = await UserManagementServices.getAllCompanyData();
      setDropdownCompanyList(res.data.data);
    } catch (error) {
      console.error('Error fetching companies for dropdown:', error);
    } finally {
      setLoadingDropdown(false);
    }
  };

  // Prepare options for dropdown
  const options = dropdownCompanyList
    .filter((item) => item.companyName !== 'SSB')
    .sort((a, b) => a.companyName.localeCompare(b.companyName))
    .map((item) => ({
      value: item.companyName,
      // label: item.companyName,
      label: `${item.companyName} (${item.regNumber || 'N/A'})`, // show both companyName & regNumber
      regNumber: item.regNumber,
    }));

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption?.value || '');
    setPageNumber(0); // Reset to first page when filtering
  };

  // Override handleSort to work with server-side sorting
  // const handleServerSort = (key) => {
  //   setSortConfig((prevConfig) => {
  //     if (prevConfig.key === key && prevConfig.direction === 'asc') {
  //       return { key, direction: 'desc' };
  //     }
  //     return { key, direction: 'asc' };
  //   });
  //   setPageNumber(0); // Reset to first page when sorting
  // };

  const handleServerSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key && prevConfig.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return { key, direction: 'asc' };
    });
    setPageNumber(0); // Reset to first page when sorting
  };

  useEffect(() => {
    if (categoryRole === 'SSB') {
      getAllCompaniesHandler();
    }
  }, [pageNumber, pageSize, selectedValue, sortConfig, dispatch]);

  useEffect(() => {
    getAllCompanyDataHandler();
  }, []);

  const countryMapping = {
    'saint kitts': '1',
    nevis: '2',
  };

  const handleSearchNameChange = (e) => setSearchName(e.target.value);

  // const handleAddEmployer = () => {
  //   navigate('/apps/addEmployer/AddEmployer', { state: { isEdit: false } });
  // };

  const [showRelationModal, setShowRelationModal] = useState(false);

  const openRelationModal = () => setShowRelationModal(true);
  const closeRelationModal = () => setShowRelationModal(false);

  const parentIdsWithChildren = new Set(
    companyList.filter((item) => item.parentId !== 0).map((item) => item.parentId),
  );

  return (
    <>
      <Helmet>
        <title>Employer Details - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />
        <sidebar-barrrrrr />
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
          <ul className="d-flex align-items-center mt-3 gap-2 list-unstyled">
            <li className="fw-medium">
              <Link to="/admin-dashboard" className="d-flex align-items-center gap-1 text-muted">
                <i className="ti-home" /> Admin Dashboard{' '}
              </Link>
            </li>
            <li>-</li>

            <li className="fw-medium">Employers Details </li>
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
                          <div className="col-xl-5 col-5 mb-2 mb-lg-0">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user text-success pe-2" />
                              Employer List
                            </h4>
                          </div>

                          <div className="col-md-4  col-lg-4 col-xl-4">
                            <div className="select-wrapper">
                              <Select
                                options={options}
                                value={options.find((opt) => opt.value === selectedValue) || null}
                                onChange={handleChange}
                                placeholder="Search by employer name or reg number"
                                isSearchable
                                isClearable
                                isLoading={false}
                                classNamePrefix="custom-select"
                                styles={{
                                  control: () => ({
                                    padding: '0px',
                                  }),
                                }}
                              />
                              {loadingDropdown && (
                                <Spinner size="sm" color="primary" className="select-spinner" />
                              )}
                            </div>
                          </div>

                          <div className="col-md-3 text-end">
                            <button
                              type="submit"
                              className="btn btn-success"
                              onClick={openRelationModal}
                            >
                              Company Relationship Mapping
                            </button>
                          </div>
                          {/* <div className="col-xl-2 col-12 mb-2 mb-lg-0">
                            <Button
                              className="btn btn-success waves-effect waves-light h-45"
                              type="submit"
                              onClick={handleAddEmployer}
                            >
                              <i className="fas fa-plus pe-1" /> Add Employer
                            </Button>
                          </div> */}
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="table-responsive">
                          {loading ? (
                            <Loader />
                          ) : (
                            <table className="table table-hover new_table mb-0">
                              <thead>
                                <tr className="border-b">
                                  <th
                                    onClick={() => handleServerSort('ssn')}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    Registration No. {getServerSortIcon('ssn')}
                                  </th>
                                  <th
                                    onClick={() => handleServerSort('insertedOn')}
                                    style={{ cursor: 'pointer', minWidth: 150 }}
                                  >
                                    C3 Reg. Date {getServerSortIcon('insertedOn')}
                                  </th>
                                  <th
                                    onClick={() => handleServerSort('contactperson')}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    Contact Person {getServerSortIcon('contactperson')}
                                  </th>
                                  <th
                                    onClick={() => handleServerSort('name')}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    Employer Name {getServerSortIcon('name')}
                                  </th>
                                  <th>Mobile No</th>
                                  <th
                                    onClick={() => handleServerSort('email')}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    Email Id {getServerSortIcon('email')}
                                  </th>
                                  <th>Edit</th>
                                  <th>Users</th>
                                  <th>Employees</th>
                                </tr>
                              </thead>

                              <tbody>
                                {companyList?.length > 0 ? (
                                  companyList.map((item) => (
                                    <tr
                                      key={item.companyId}
                                      // className={item.parentId === 0 ? 'parent-row' : 'child-row'}
                                      className={
                                        item.parentId === 0 &&
                                        parentIdsWithChildren.has(item.companyId)
                                          ? 'parent-rows'
                                          : 'child-rows'
                                      }
                                    >
                                      <td>{item?.regNumber}</td>
                                      <td>
                                        {item.insertedOn
                                          ? moment(item.insertedOn).format('DD-MMM-YYYY')
                                          : ''}
                                      </td>

                                      <td>{item.contactPerson}</td>
                                      <td>{item?.companyName}</td>
                                      <td>{item.mobile}</td>
                                      <td>{item.email}</td>
                                      <td>
                                        {canEditEmployer ? (
                                          <Link
                                            to="/apps/updateEmployer/UpdateEmployer"
                                            state={{ companyId: item.companyId }}
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
                                        <Link
                                          to="/admin/manage-users/company-users"
                                          state={{ companyId: item.companyId }}
                                          className="text-decoration-none"
                                        >
                                          <span
                                            className="badge   align-items-center bg-soft-primary gap-1 border2"
                                            style={{ fontSize: '9px' }}
                                          >
                                            <Icon.User size={20} />

                                            <span className="position-absolute translate-middle-y badge rounded-pill bg-info">
                                              {item.usercount}
                                              <span className="visually-hidden">
                                                unread messages
                                              </span>
                                            </span>
                                          </span>
                                        </Link>
                                      </td>

                                      <td>
                                        <Link
                                          to="/admin/manage-users/employee"
                                          state={{ companyId: item.companyId }}
                                          className="text-decoration-none"
                                          style={{ marginLeft: '10px' }}
                                        >
                                          <span className="badge align-items-center bg-soft-success gap-1 border2">
                                            <Icon.Users size={20} />

                                            <span
                                              className="position-absolute translate-middle-y badge rounded-pill bg-primary"
                                              style={{ fontSize: '9px' }}
                                            >
                                              {item.employeeCount}
                                              <span className="visually-hidden">
                                                unread messages
                                              </span>
                                            </span>
                                          </span>
                                        </Link>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="8" className="text-center">
                                      No Records Found
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          )}
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
            </div>
          </div>
        </div>
      </div>

      {showRelationModal && (
        <div
          className="modal fade show"
          style={{
            display: 'block',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <ModalHeader toggle={closeRelationModal}>
                <i className="far fa-user text-dark pe-2" />
                Mapping Relationship Companies
              </ModalHeader>

              <div className="modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <RealationShipSetting ref={relationRef} onLoadingChange={setFooterLoading} />
              </div>

              <div
                className="modal-footer"
                style={{
                  position: 'relative',
                  zIndex: 0,
                }}
              >
                <Button
                  type="button"
                  className="btn-light btn-secondary"
                  onClick={closeRelationModal}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  className="btn btn-success  fw-bold"
                  disabled={footerLoading}
                  onClick={() => relationRef.current?.submit()}
                >
                  {footerLoading ? (
                    <>
                      <Spinner size="sm" /> Processing...
                    </>
                  ) : (
                    'Save Mapping'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AdminEmployerDetails;
