import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  getWorkingDirector,
  deleteNonDirector,
  directorImport,
} from '../../../store/apps/nonWorkingDirectory/NonWorkingDirectory';
import Loader from '../../../layouts/loader/Loader';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import NWEmployeeDownloadButton from '../component/NWDirector';

const NwDirector = () => {
  const companyId = localStorage.getItem('companyId');
  const userId = localStorage.getItem('userID');
  const userName = localStorage.getItem('userId');
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const userPassword = localStorage.getItem('userPassword');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const CompanyId = localStorage.getItem('companyId');
  const { nwWorkingData, loading } = useSelector((state) => state.nonWorkingDirectorySlice);
  const { message, type } = useSelector((state) => state.messageReducer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null); // Store the item to be deleted
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [sortColumn, setSortColumn] = useState(''); // Current column to sort
  const [sortOrder, setSortOrder] = useState('asc'); // Sorting order: 'asc' or 'desc'
  const [isModalOpens, setIsModalOpens] = useState(false);
  const [exportItems, setExportItems] = useState(null);
  const toggleModal1 = () => setIsModalOpens(!isModalOpens);

  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'NW DIRECTOR');
  const canAddNWDirector = employerPermission?.addPermission;
  const canEditNWDirector = employerPermission?.updatePermission;
  const canDeleteNWDirector = employerPermission?.deletePermission;
  const canViewNWDirector = employerPermission?.viewPermission;

  useEffect(() => {
    if (canViewNWDirector === false) {
      navigate('/login');
    }
  }, [canViewNWDirector, navigate]);

  const deleteBonusModal = (employeeID, isC3Created) => {
    setDeleteItem({ employeeID, isC3Created }); // Store the employeeID in state
    setIsModalOpen(true); // Open the modal
  };
  useEffect(() => {
    dispatch(getWorkingDirector({ CompanyId }));
  }, []);



  const deleteNWDirectory = (isC3Created) => {
    if (!deleteItem) return;

    dispatch(deleteNonDirector(deleteItem))
      .unwrap()
      .then((response) => {
        dispatch(getWorkingDirector({ CompanyId }));
        setIsModalOpen(false);
      })
      .catch((error) => {
          console.error('Something went wrong:', error);
        setIsModalOpen(false);
      });
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

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

  const handleNonWorkingDirector = () => {
    navigate('/apps/addNonWorkingDirector/AddNonWorkingDirector');
  };

  // Filter the data based on searchTerm
  const filteredData = nwWorkingData?.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item?.socSecNum?.toLowerCase().includes(searchLower) ||
      item?.firstName?.toLowerCase().includes(searchLower)
    );
  });

  const sortedEmployeeList = filteredData.sort((a, b) => {
    if (sortColumn === 'ssn') {
      return sortOrder === 'asc'
        ? a.socSecNum.localeCompare(b.socSecNum)
        : b.socSecNum.localeCompare(a.socSecNum);
    }
    if (sortColumn === 'name') {
      return sortOrder === 'asc'
        ? a.firstName.localeCompare(b.firstName)
        : b.firstName.localeCompare(a.firstName);
    }
    if (sortColumn === 'department') {
      return sortOrder === 'asc'
        ? a.department.localeCompare(b.department)
        : b.department.localeCompare(a.department);
    }
    return 0;
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle sorting order if the same column is clicked again
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sorting column and default to ascending order
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const isSelfEmployeeSubmitted = (headerId, ssnemp, month, year) => {
    setExportItems({
      companyId,
      LoginId: userName,
      Password: userPassword,
      // UserMeassage: true,
      UserID: userId,
      // isTrue,
    });

    setIsModalOpens(true);
  };

  const isSubmitC3 = () => {
    if (!exportItems) return;
    setImportLoading(true);
    dispatch(directorImport(exportItems))
      .unwrap()
      .then((response) => {
        dispatch(getWorkingDirector({ CompanyId }));
      })

      .catch((error) => {
          console.error('Something went wrong:', error);
      })
      .finally(() => {
        setImportLoading(false); // stop loader
      });
    setIsModalOpens(false);
  };

  const onCanceled = () => {
    setIsModalOpens(false);
  };

  const exportToExcel = () => {
    if (!sortedEmployeeList || sortedEmployeeList.length === 0) return;

    setExportLoading(true); // Start loading

    try {
      const exportData = sortedEmployeeList.map((item, index) => ({
        'S.No.': index + 1,
        SSN: item.socSecNum || '',
        Name: item.firstName || '',
        Department: item.department || '',
        'Address Details': item.address1 || '',
        Salary: `$${parseFloat(item.wadeg || 0).toFixed(2)}`,
        'Commencement Date': item.appintDate ? new Date(item.appintDate) : '',
        'Termination Date': item.terminated ? new Date(item.terminated) : '',
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, 'Employees.xlsx');
    } catch (error) {
        console.error('Something went wrong:', error);
    } finally {
      setExportLoading(false); // Stop loading
    }
  };

  return (
    <>
      {' '}
      <Helmet>
        <title>Non Working Director - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <my-header />

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
          <ul className="d-flex align-items-center gap-2 mt-3 list-unstyled">
            <li className="fw-medium">
              <Link to="/dashboard" className="d-flex align-items-center gap-1 text-muted">
                <i className="ti-home" />
                Dashboard{' '}
              </Link>
            </li>
            <li>-</li>
            {/* <li className="fw-medium">
            <span className="d-flex align-items-center gap-1 text-muted">NW</span>
          </li> */}
            <li>-</li>
            <li className="fw-medium"> Non Working Director List </li>
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
                          <div className="card-header py-2 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-4 col-12 mb-2 mb-lg-0">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-user text-success pe-2" />
                                  Non Working Director List{' '}
                                </h4>
                              </div>
                              <div className="col-xl-8 col-12 text-lg-end ">
                                {/* <a href="#" className="btn text-white bg-success mb-3 mb-lg-0">
                            <i className="fa fa-download me-2" />
                            <span>Import Director</span>
                          </a> */}
                                <input
                                  type="text"
                                  className="form-control custom d-inline w-25 mb-3 mb-lg-0"
                                  placeholder="Search by SSN or Name"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                />

                                {canAddNWDirector ? (
                                  <Link to="/apps/addNonWorkingDirector/AddNonWorkingDirector">
                                    <Button
                                      className="btn btn-success waves-effect waves-light h-45"
                                      type="submit"
                                    >
                                      <i className="fas fa-plus pe-1" /> Add Non Working Director{' '}
                                    </Button>
                                  </Link>
                                ) : (
                                  <button
                                    className="btn btn-secondary h-45"
                                    type="button"
                                    disabled
                                    style={{ opacity: 0.6 }}
                                  >
                                    <i className="fas fa-plus pe-1" /> Add Non Working Director
                                  </button>
                                )}

                                <Button
                                  className="btn btn-success waves-effect waves-light h-45"
                                  type="submit"
                                  disabled={importLoading}
                                  onClick={() => isSelfEmployeeSubmitted()}
                                >
                                  {importLoading ? (
                                    <>
                                      <Spinner size="sm" /> Import Director...
                                    </>
                                  ) : (
                                    <>
                                      <i className="fas fa-download pe-1" /> Import Director
                                    </>
                                  )}
                                </Button>
                                {/* <Button
                                className="btn btn-success waves-effect waves-light h-50"
                                type="submit"
                                disabled={exportLoading}
                                onClick={() => exportToExcel()}
                              >
                                {exportLoading ? (
                                  <>
                                    <Spinner size="sm" /> Downloading..
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-download pe-1" /> Export Excel
                                  </>
                                )}
                              </Button> */}
                                <NWEmployeeDownloadButton />
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table table-hover mb-0 white-space">
                                <thead>
                                  <tr className="border-b">
                                    <th scope="row">S.No.</th>
                                    <th onClick={() => handleSort('ssn')}>
                                      SSN{' '}
                                      {sortColumn === 'ssn' &&
                                        (sortOrder === 'asc' ? (
                                          <Icon.ArrowUp size={14} />
                                        ) : (
                                          <Icon.ArrowDown size={14} />
                                        ))}
                                    </th>
                                    <th onClick={() => handleSort('name')}>
                                      Name{' '}
                                      {sortColumn === 'name' &&
                                        (sortOrder === 'asc' ? (
                                          <Icon.ArrowUp size={14} />
                                        ) : (
                                          <Icon.ArrowDown size={14} />
                                        ))}
                                    </th>
                                    <th onClick={() => handleSort('department')}>
                                      Department{' '}
                                      {sortColumn === 'department' &&
                                        (sortOrder === 'asc' ? (
                                          <Icon.ArrowUp size={14} />
                                        ) : (
                                          <Icon.ArrowDown size={14} />
                                        ))}
                                    </th>
                                    <th>Address Details</th>
                                    <th>Salary</th>
                                    <th>Pay Period</th>
                                    <th>Date of Joining</th>
                                    <th>Termination Date</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sortedEmployeeList && sortedEmployeeList?.length > 0 ? (
                                    sortedEmployeeList?.map((item, index) => (
                                      <tr key={item.item}>
                                        <td>{index + 1}</td>
                                        <td>{item?.socSecNum}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item?.department}</td>

                                        <td>{item?.address1 ?? 'N?A'}</td>
                                        <td>${item?.wadeg?.toFixed(2) ?? '0.00'}</td>
                                        <td>{item?.payPeriod ?? 'N/A'}</td>
                                        <td>
                                          {item?.appintDate
                                            ? moment(item.appintDate).format('DD-MMM-YYYY')
                                            : 'N/A'}
                                        </td>
                                        <td>
                                          {item?.terminated
                                            ? moment(item.terminated).format('DD-MMM-YYYY')
                                            : 'N/A'}
                                        </td>

                                        <td>
                                          {canEditNWDirector ? (
                                            <Link
                                              to="/apps/editNonWorkingDirector"
                                              state={{ id: item.employeeID }}
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
                                          {canDeleteNWDirector ? (
                                            <button
                                              type="button"
                                              className="badge bg-soft-danger text-danger"
                                            >
                                              <Icon.Trash
                                                size={20}
                                                onClick={() =>
                                                  deleteBonusModal(
                                                    item.employeeID,
                                                    item.isC3Created === true,
                                                  )
                                                } // Pass the
                                              />
                                            </button>
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
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="10" className="text-center">
                                        {' '}
                                        {/* Colspan should match number of columns */}
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

        <Modal isOpen={isModalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Confirm Action</ModalHeader>
          <ModalBody>
            Are you sure you want to permanently delete this Non Working Director
          </ModalBody>
          <ModalFooter>
            <Button className="btn-light" color="secondary" onClick={onCancel}>
              No
            </Button>
            <Button color="primary" onClick={deleteNWDirectory}>
              Yes
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={isModalOpens} toggle={toggleModal1}>
          <ModalHeader toggle={toggleModal1}>Confirm Action</ModalHeader>
          <ModalBody>
            Do you want to import your list of NW Directors based on your last C3 Submission from
            Social Security System
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" className="btn-light" onClick={onCanceled}>
              No
            </Button>
            <Button color="primary" onClick={isSubmitC3}>
              Yes
            </Button>
          </ModalFooter>
        </Modal>

        {/* END layout-wrapper */}
        {/* Right Sidebar */}
      </div>
    </>
  );
};
export default NwDirector;
