import { useState, useEffect } from 'react';
import { Input, FormGroup, Spinner, Label } from 'reactstrap';

import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import Logo from '../../assets/images/logo-w.png';
import { forgotDetails } from '../../store/apps/auth/AuthSlice';
import { clearMessage, setMessage } from '../../store/apps/message/MessageSlice';

const ForgetPasswordDetails = () => {
  const [loading, setLoading] = useState(false);
  const { message, type } = useSelector((state) => state.messageReducer);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, id } = location.state || {};

  

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    userId: id,
    regNo: data.regNo,
    userName: data.userName,
    question1: data.question1,
    question2: data.question2,
    answer1: data.answer1,
    answer2: data.answer2,
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    userId: id,
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

    // Check if the new password is filled
    // if (!formData.password) {
    //   formErrors.password = 'New password is required';
    //   isValid = false;
    // }

    if (!formData.password) {
      formErrors.password = 'New password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      formErrors.password = 'Password must contain at least one uppercase letter';
      isValid = false;
    } else if (!/[a-z]/.test(formData.password)) {
      formErrors.password = 'Password must contain at least one lowercase letter';
      isValid = false;
    } else if (!/\d/.test(formData.password)) {
      formErrors.password = 'Password must contain at least one number';
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      formErrors.password = 'Password must contain at least one special character';
      isValid = false;
    }

    // Check if the confirm password is filled
    if (!formData.confirmPassword) {
      formErrors.confirmPassword = 'Confirm password is required';
      isValid = false;
    }

    // Check if the new password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    
    e.preventDefault(); // Prevent default form submission

    if (validate()) {
      setLoading(true);
      // Create a new object excluding confirmPassword from formData
      const { confirmPassword, ...payload } = formData;

      // Dispatch the action with the updated payload (without confirmPassword)
      dispatch(forgotDetails({ formData: payload }))
        .unwrap()
        .then((res) => {
          console.log('response', res);

          navigate('/login');

          // Handle success (e.g., redirect, show success message)
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
        <title>Forgot Password - C3Wizard</title>
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
                          <h2 className="text-success mb-2  f-500">Forgot Password</h2>
                        </div>
                        <div className="row w-100">
                          <div className="col-md-12 col-lg-12 col-xl-12 mx-auto">
                            <form className="form-horizontal mt-4 pt-2" action="index.html">
                              <div className="mb-3">
                              <Label>
                                Password <span className="text-danger">*</span>
                              </Label>
                                <input
                                  type="password"
                                  className="form-control"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  onKeyDown={handleKeyDown}
                                  placeholder="New Password"
                                />
                                {errors.password && (
                                  <small className="text-danger">{errors.password}</small>
                                )}
                              </div>

                              <div className="mb-3">
                              <Label>
                              Confirm Password <span className="text-danger">*</span>
                              </Label>
                                <input
                                  type="password"
                                  className="form-control"
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleChange}
                                  onKeyDown={handleKeyDown}
                                  placeholder="Confirm Password"
                                />
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

export default ForgetPasswordDetails;
