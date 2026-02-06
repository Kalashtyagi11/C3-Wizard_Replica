import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import { Input, FormGroup, Spinner, Label } from 'reactstrap';
import { Helmet } from 'react-helmet';
import Logo from '../../../assets/images/logo-w.png';
import { changePassword } from '../../../store/apps/auth/AuthSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const { message, type } = useSelector((state) => state.messageReducer);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const oldPassword = localStorage.getItem('userPassword');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userID');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
    userId,
  });

  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    userId,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear the error when the user starts typing
    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '', // Clear error for the field being typed
      }));
    }
  };

  const validate = () => {
    const formErrors = {};
    let isValid = true;

    // Check if Old Password is empty
    if (!formData.oldPassword) {
      formErrors.oldPassword = 'Old password is required';
      isValid = false;
    } else if (formData.oldPassword !== oldPassword) {
      formErrors.oldPassword = 'Old password is wrong';
      isValid = false;
    } else if (!formData.oldPassword === oldPassword) {
      formErrors.oldPassword = 'Old password is wrong';
      isValid = false;
    }

    if (!formData.newPassword) {
      formErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      formErrors.newPassword = 'Password must be at least 6 characters long';
      isValid = false;
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      formErrors.newPassword = 'Password must contain at least one uppercase letter';
      isValid = false;
    } else if (!/[a-z]/.test(formData.newPassword)) {
      formErrors.newPassword = 'Password must contain at least one lowercase letter';
      isValid = false;
    } else if (!/\d/.test(formData.newPassword)) {
      formErrors.newPassword = 'Password must contain at least one number';
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)) {
      formErrors.newPassword = 'Password must contain at least one special character';
      isValid = false;
    }

    // Check if Confirm Password is empty
    if (!formData.confirmPassword) {
      formErrors.confirmPassword = 'Confirm password is required';
      isValid = false;
    }

    // Check if the new password and confirm password match
    if (
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      formErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Ensure old and new passwords are not the same (only if new password is entered)
    if (
      formData.oldPassword &&
      formData.newPassword &&
      formData.oldPassword === formData.newPassword
    ) {
      formErrors.newPassword = 'New password cannot be the same as the old password';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);

      dispatch(changePassword({ formData }))
        .unwrap()
        .then((res) => {
          console.log('response', res);
          navigate('/login');
        })
        .catch((error) => {
          console.error('Error:', error);
        })
        .finally(() => {
          setLoading(false);
        });

      console.log('Form Submitted');
    } else {
      console.log('Form contains errors');
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };

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
        <title>Change Password -C3 Wizard</title>
      </Helmet>
      <div className="home-center">
        <div className="home-desc-center">
          <div className="container">
            <div className="home-btn1 hv-100">
              <div className="row w-100 mt-4">
                <div className="col-md-5 col-lg-5 col-xl-5 mx-auto">
                  <div className="card">
                    <div className="card-body pb-lg-5">
                      <div className="px-2 py-3">
                        <div className="text-center">
                          {/* <a href="index.html">
                          <img src={Logo} height={122} alt="logo" />
                          </a> */}
                          <h2 className="text-success mb-2 mt-4 f-500">Change Password</h2>
                        </div>
                        <div className="row w-100">
                          <div className="col-md-12 col-lg-12 col-xl-12 mx-auto ">
                            <form className="form-horizontal mt-4 pt-2">
                              <div className="mb-3 eye">
                                <Label>
                                  Old Password <span className="text-danger">*</span>
                                </Label>
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  className="form-control"
                                  name="oldPassword"
                                  value={formData.oldPassword}
                                  onChange={handleChange}
                                  onKeyDown={handleKeyDown}
                                  placeholder="Old Password"
                                  autoComplete="off"
                                />
                                <button
                                  type="button"
                                  className="showPassword"
                                  onClick={() => setShowPassword(!showPassword)}
                                  style={{ top: '50%' }}
                                >
                                  {showPassword ? (
                                    <i className="fas fa-eye-slash" />
                                  ) : (
                                    <i className="fas fa-eye" />
                                  )}
                                </button>
                                {errors.oldPassword && (
                                  <small className="text-danger">{errors.oldPassword}</small>
                                )}
                              </div>
                              <div className="mb-3 eye">
                                <Label>
                                  Password <span className="text-danger">*</span>
                                </Label>
                                <input
                                  type={showPasswordConfirm ? 'text' : 'password'}
                                  className="form-control"
                                  name="newPassword"
                                  value={formData.newPassword}
                                  onChange={handleChange}
                                  onKeyDown={handleKeyDown}
                                  placeholder="New Password"
                                  autoComplete="off"
                                />
                                <button
                                  type="button"
                                  className="showPassword"
                                  style={{ top: '50%' }}
                                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                >
                                  {showPasswordConfirm ? (
                                    <i className="fas fa-eye-slash" />
                                  ) : (
                                    <i className="fas fa-eye" />
                                  )}
                                </button>
                                {errors.newPassword && (
                                  <small className="text-danger">{errors.newPassword}</small>
                                )}
                              </div>
                              <div className="mb-3 eye">
                                <Label>
                                  New Password <span className="text-danger">*</span>
                                </Label>
                                <input
                                  type={showPasswordNew ? 'text' : 'password'}
                                  className="form-control"
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleChange}
                                  onKeyDown={handleKeyDown}
                                  placeholder="Confirm Password"
                                />
                                <button
                                  type="button"
                                  className="showPassword"
                                  onClick={() => setShowPasswordNew(!showPasswordNew)}
                                  style={{ top: '50%' }}
                                >
                                  {showPasswordNew ? (
                                    <i className="fas fa-eye-slash " />
                                  ) : (
                                    <i className="fas fa-eye" />
                                  )}
                                </button>
                                {errors.confirmPassword && (
                                  <small className="text-danger">{errors.confirmPassword}</small>
                                )}
                              </div>
                              <div>
                                <button
                                  onClick={handleSubmit}
                                  disabled={loading}
                                  className="btn btn-success w-100 waves-effect waves-light h-50 f-500 f-17"
                                  type="submit"
                                >
                                  {loading ? (
                                    <>
                                      <Spinner size="sm" /> Changing Password..
                                    </>
                                  ) : (
                                    <> Change Password</>
                                  )}
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Log In page */}
    </>
  );
};
export default ChangePassword;
