import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Form,
  FormGroup,
  Label,
  Spinner,
} from 'reactstrap';
import Loader from '../../../layouts/loader/Loader';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import DashboardService from '../../../service/dashboard/Dashboard';
import { UpdateStatus } from '../../../store/apps/dashboard/DashboardSlice';
import './Active.scss';

const SiteSettingList = () => {
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [currentItem, setCurrentItem] = useState(null); // Store the current item being toggled
  const [isActive, setIsActive] = useState(null);
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const toggle = () => setModal(!modal);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { message, type } = useSelector((state) => state.messageReducer);
  const [GridData, setGridData] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false); // Track loading state
  const [formData, setFormData] = useState({
    secretKey: '',
    keyId: '',
    merchantId: '',
    type: 'Test',
    loginId: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    // Validate userId
    if (!userId) {
      errors.userId = 'User ID is required';
    }

    // Validate userPassword
    if (!userPassword) {
      errors.userPassword = 'Password is required';
    } else if (userPassword.length < 6) {
      errors.userPassword = 'Password must be at least 6 characters long';
    } else if (!/[A-Z]/.test(userPassword)) {
      errors.userPassword = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(userPassword)) {
      errors.userPassword = 'Password must contain at least one lowercase letter';
    } else if (!/\d/.test(userPassword)) {
      errors.userPassword = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(userPassword)) {
      errors.userPassword = 'Password must contain at least one special character';
    }

    return errors;
  };

  const LoadDataGrid = async (e) => {
    //setShowConfirm(false);
    setLoading(true);
    //formData.saveCard = e;
    try {
      const res = await DashboardService.saveConfig(formData);

      setGridData(res.data.data);
      //console.log("asasas",paymentData);
      //window.location.href = res.data.data.approvalUrl;
    } catch (err) {
      console.log(err);
      //setError("Error fetching payment response");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    LoadDataGrid();
  }, []);

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

  const handleAddEmployer = () => {
    navigate('/apps/addEmployer/AddEmployer', { state: { isEdit: false } });
    //navigate('/apps/addEmployer/AddEmployer');
  };

  const handleUpdateEmployer = (companyId) => {
    navigate(`/apps/updateEmployer/UpdateEmployer?companyId=${companyId}`);
    //navigate('/apps/updateEmployer/UpdateEmployer');
  };

  const handleToggle = (itemId, currentStatus) => {
    setCurrentItem(itemId);
    setIsActive(!currentStatus);
    setModal(true);
  };

  // Function to toggle modal visibility
  const toggleModal = () => {
    setModal(!modal);
    setUserId('');
    setUserPassword('');
  };

  const handleSubmit = async () => {
    const errors = validateForm(userId, userPassword);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setLoadingUser(true);

    try {
      const payload = {
        siteSettings_Id: currentItem,
        loginId: userId,
        password: userPassword,
      };
      dispatch(UpdateStatus({ payload }))
        .unwrap()
        .then(() => {
          setLoadingUser(false);
          setModal(false);
          LoadDataGrid();
          setUserId('');
          setUserPassword('');
        });
    } catch (err) {
      console.log('err', err);
    } finally {
      setLoadingUser(false);
      setModal(false);
    }
  };
  return (
    <>
      <Helmet>
        <title>CyberSource Settings - C3Wizard</title>
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

                <li className="fw-medium">CyberSource Settings </li>
              </ul>
            </div>
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <div className="page-content-wrapper">
                    {/*                       <div class="page-title mb-3">
                      <h5>Employer List</h5> 
                  </div>
           */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24"></div>
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-header py-2 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-8">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-user text-success pe-2" />
                                  Payments Settings
                                </h4>
                              </div>
                              <div className="col-xl-4 text-end">
                                {/* <Button
                              className="btn btn-success waves-effect waves-light h-45"
                              type="submit"
                              onClick={handleAddEmployer}
                            >
                              <i className="fas fa-plus pe-1" /> Add Employer
                            </Button> */}
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table table-hover mb-0">
                                <thead>
                                  <tr className="border-b">
                                    <th scope="row">Id</th>
                                    <th>Envirement</th>
                                    <th>MerchantId</th>
                                    <th>KeyId</th>
                                    <th>SecretKey</th>
                                    <th>BaseUrl</th>
                                    <th>IsActive</th>
                                    <th>Edit</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {GridData && GridData?.length > 0 ? (
                                    GridData?.map((item) => (
                                      <tr key={item}>
                                        <td>{item?.siteSettings_Id}</td>
                                        <td>{item?.environment}</td>
                                        <td>
                                          {item?.merchantId
                                            ? `****${item.merchantId.slice(-8)}`
                                            : ''}
                                        </td>
                                        <td>{item?.keyId ? `****${item.keyId.slice(-8)}` : ''}</td>
                                        <td>
                                          {item?.secretKey ? `****${item.secretKey.slice(-8)}` : ''}
                                        </td>

                                        <td>{item?.baseUrl}</td>

                                        <td>
                                          {/* <span
                                            className={`btn btn-sm ${
                                              item.isActive ? 'btn-success' : 'btn-danger'
                                            }`}
                                            onClick={() =>
                                              handleToggle(item.siteSettings_Id, item.isActive)
                                            }
                                          >
                                            {item.isActive ? 'Active' : 'Inactive'}
                                          </span> */}

                                          <div className="toggle-container">
                                            <div
                                              className={`toggle-switchPayment ${
                                                item.isActive ? 'on' : ''
                                              }`}
                                            >
                                              <FormGroup check>
                                                <Input
                                                  type="checkbox"
                                                  className="toggle-input"
                                                  id={`toggle-${item.siteSettings_Id}`}
                                                  checked={item.isActive}
                                                  onChange={(e) =>
                                                    handleToggle(
                                                      item.siteSettings_Id,
                                                      e.target.checked,
                                                    )
                                                  }
                                                />

                                                <Label
                                                  htmlFor={`toggle-${item.siteSettings_Id}`}
                                                  className="toggle-handle"
                                                />

                                                <Label
                                                  htmlFor={`toggle-${item.siteSettings_Id}`}
                                                  className="toggle-status"
                                                >
                                                  {item.isActive ? 'Active' : 'Inactive'}
                                                </Label>
                                              </FormGroup>
                                            </div>
                                          </div>
                                        </td>

                                        <td>
                                          <Link
                                            to="/SiteSetting"
                                            state={{ data: item }}
                                            className="text-decoration-none"
                                          >
                                            <span className="badge bg-soft-success text-success">
                                              <Icon.Edit size={20} />
                                            </span>
                                          </Link>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
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
        {/* Right Sidebar */}
      </div>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Confirm Action</ModalHeader>
        <ModalBody>
          <Form>
            {/* UserId Input */}
            <FormGroup>
              <Label for="userId">UserId</Label>
              <Input
                type="text"
                name="userId"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your UserId"
                required
              />
              {formErrors.userId && <div className="text-danger">{formErrors.userId}</div>}
            </FormGroup>

            {/* UserPassword Input */}
            <FormGroup>
              <Label for="userPassword">Password</Label>
              <Input
                type="password"
                name="userPassword"
                id="userPassword"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              {formErrors.userPassword && (
                <div className="text-danger">{formErrors.userPassword}</div>
              )}
            </FormGroup>

            {/* Submit Button */}
          </Form>
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
export default SiteSettingList;
