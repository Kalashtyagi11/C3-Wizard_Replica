import { useState, useEffect } from 'react';
import { Input, FormGroup, Spinner, Label } from 'reactstrap';

import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import Logo from '../../assets/images/logo-w.png';
import { resetUerPassword } from '../../store/apps/auth/AuthSlice';
import { clearMessage, setMessage } from '../../store/apps/message/MessageSlice';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { message, type } = useSelector((state) => state.messageReducer);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get('id');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
    EnUserId: id,
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
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

    // Check if the confirm password is filled
    if (!formData.confirmPassword) {
      formErrors.confirmPassword = 'Confirm password is required';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    if (validate()) {
      setLoading(true);

      dispatch(resetUerPassword(formData))
        .unwrap()
        .then((res) => {
          console.log('response', res);
          // const UserId = res?.data;

          // if (UserId) {
          //   const newPayload = {
          //     UserId,
          //     ...formData,
          //   };

          //   navigate('/login');
          // }

          navigate('/login');
        })
        .catch((error) => {
          console.error('Error:', error);
          // Handle error (e.g., show error message)
        })
        .finally(() => {
          setLoading(false);
        });

      console.log('Form Submitted');
    } else {
      console.log('Form contains errors');
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

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password - C3Wizard</title>
      </Helmet>
      <div className="home-center mt-5">
        <div className="home-desc-center">
          <div className="container">
            <div className="home-btn1 hv-100">
              <div className="row w-100">
                <div className="col-md-5 col-lg-5 col-xl-5 mx-auto">
                  <div className="card">
                    <div className="card-body pb-lg-5">
                      <div className="px-2 py-3">
                        <div className="text-center">
                          <a href="index.html">
                            <img src={Logo} height={80} alt="logo" />
                          </a>
                          <h2 className="text-success mb-2  f-500">Reset Password</h2>
                        </div>
                        <div className="row w-100">
                          <div className="col-md-12 col-lg-12 col-xl-12 mx-auto">
                            <form className="form-horizontal mt-4 pt-2" action="index.html">
                              <div className="mb-3 ">
                                <Label>
                                  Password <span className="text-danger">*</span>
                                </Label>
                                <input
                                  type="password"
                                  className="form-control"
                                  name="newPassword"
                                  value={formData.newPassword}
                                  onChange={handleChange}
                                  onKeyDown={handleKeyDown}
                                  placeholder="New Password"
                                />

                                {errors.newPassword && (
                                  <small className="text-danger">{errors.newPassword}</small>
                                )}
                              </div>

                              <div className="mb-3" style={{ position: 'relative' }}>
                                <Label>
                                  Confirm Password <span className="text-danger">*</span>
                                </Label>
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  className="form-control"
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleChange}
                                  onKeyDown={handleKeyDown}
                                  placeholder="Confirm Password"
                                />
                                <button
                                  type="button"
                                  className="showPreview showPassword"
                                  onClick={() => setShowPassword(!showPassword)}
                                  style={{ top: '40px' }}
                                >
                                  {showPassword ? (
                                    <i className="fas fa-eye-slash" />
                                  ) : (
                                    <i className="fas fa-eye" />
                                  )}
                                </button>
                                {errors.confirmPassword && (
                                  <small className="text-danger">{errors.confirmPassword}</small>
                                )}
                              </div>
                              <FormGroup>
                                <small
                                  className="pb-4 d-block"
                                  style={{ color: '#807979', fontSize: '16px' }}
                                >
                                  If Already Have An Account ? Please
                                  <Link
                                    to="/login"
                                    style={{
                                      color: '#613a5f',
                                      fontSize: '14px',
                                      marginLeft: '5px',
                                    }}
                                  >
                                    Login Here
                                  </Link>
                                </small>
                              </FormGroup>

                              <div>
                                <button
                                  onClick={handleSubmit}
                                  disabled={loading}
                                  className="btn btn-success w-100 waves-effect waves-light h-50 f-500 f-17"
                                  type="submit"
                                >
                                  {loading ? (
                                    <>
                                      <Spinner size="sm" /> Saving...
                                    </>
                                  ) : (
                                    <> Save</>
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
    </>
  );
};

export default ResetPassword;
