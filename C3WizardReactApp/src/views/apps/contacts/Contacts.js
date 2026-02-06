import { Card, CardBody, Label, Spinner } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { contactusPost } from '../../../store/apps/contactus/ContactusSlice';

import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';

const Contacts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message, type: messageType } = useSelector((state) => state?.messageReducer);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
  });
  const categoryRole = localStorage.getItem('roleCategory')?.trim()?.toUpperCase();
  const roleId = parseInt(localStorage.getItem('roleId'), 10) || 8;
  const userId = parseInt(localStorage.getItem('userID'), 10) || 8;
  const companyId = parseInt(localStorage.getItem('companyId'), 10) || 8;
  const employer = localStorage.getItem('employer') || 'MIPL';
  const regNo = String(localStorage.getItem('reG_NUMBER') || '123456');
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles.find((role) => role.description === 'CONTACT US');
  const canAddContactUs = employerPermission?.addPermission;
  const canViewContactUs = employerPermission?.viewPermission;

  const employerPermissionSelf = savedRoles.find((role) => role.description === 'Contact Us');
  const canAddSelfContactUs = employerPermissionSelf?.addPermission;
  const canViewSelfContactUs = employerPermissionSelf?.viewPermission;

  useEffect(() => {
    if (categoryRole === 'COMPANY') {
      if (canViewContactUs === false) {
        navigate('/login');
      }
    } else if (categoryRole === 'SELFEMPLOYEE') {
      if (canViewSelfContactUs === false) {
        navigate('/login');
      }
    }
  }, [roleId, canViewContactUs, canViewSelfContactUs, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.description.trim()) {
      toast.error('Description cannot be empty.');
      return;
    }
    setLoading(true);
    console.log('handleSubmit called');
    const requestData = {
      userId,
      companyId,
      employer,
      //email,
      regNo,
      description: formData.description,
    };
    console.log('Sending request data:', requestData);

    dispatch(contactusPost(requestData))
      .unwrap()
      .then((res) => {
        console.log('API Response:', res);
        toast.success('Mail sent successfully!');
        setFormData({ description: '' });
      })
      .catch((err) => {
        console.error('API Error:', err);
        toast.error(err);
        toast.error('Failed to send message. Please try again.');
      })
      .finally(() => {
        setLoading(false); // Stop loading after request completes
      });
  };

  useEffect(() => {
    if (message) {
      if (messageType === 'success') {
        toast.success(message);
      } else if (messageType === 'error') {
        toast.error(message);
      }

      dispatch(setMessage({ message: '', messageType: '' }));
    }
  }, [message, messageType, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Contact Us - C3wizard</title>
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
            {/* <li className="fw-medium">
              <Link to="/apps/dashboards" className="d-flex align-items-center gap-1 text-muted">
                <i className="ti-home" />
                Dashboard{' '}
              </Link>
            </li>
            <li>-</li>
           
            <li>-</li> */}
            <li className="fw-medium"> Contact Us </li>
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
                      <div className="card-header py-3 bg_ligh">
                        <div className="row align-items-center d-flex">
                          <div className="col-xl-12 col-12 mb-2 mb-lg-0">
                            <h4 className="header-title mb-0 text-success">
                              <i className="far fa-user text-success pe-2" /> Contact us
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="card-body profile">
                        <div className="row">
                          <div className="col-lg-6 col-12">
                            <div className="form-group mb-3">
                              <Label>Contact Us</Label>
                              <span className="text-danger">*</span>
                              <textarea
                                name="description"
                                id="description"
                                cols={30}
                                rows={6}
                                className="form-control"
                                placeholder="Description"
                                //defaultValue={""}
                                value={formData.description}
                                onChange={handleChange}
                                style={{ resize: 'none' }}
                              />
                            </div>
                          </div>
                          <div className="form-btn mt-3">
                            <button
                              type="button"
                              className="btn btn-success px-4 me-3"
                              onClick={handleSubmit}
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  <Spinner size="sm" /> Submitting...
                                </>
                              ) : (
                                <>
                                  <i className="far fa-save pe-1" /> Submit
                                </>
                              )}
                            </button>
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
        {/* END layout-wrapper */}
      </div>
    </>
  );
};

export default Contacts;
