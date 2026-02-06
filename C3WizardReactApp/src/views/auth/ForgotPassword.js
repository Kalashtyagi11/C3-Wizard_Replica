import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import { Input, FormGroup, Spinner, Button, Label } from 'reactstrap';
import { Helmet } from 'react-helmet';
import Logo from '../../assets/images/logo-w.png';
import { forgotPassword, getQuestionAnswer } from '../../store/apps/auth/AuthSlice';
import { clearMessage, setMessage } from '../../store/apps/message/MessageSlice';

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { message, type } = useSelector((state) => state.messageReducer);
  const { getQuestAns } = useSelector((state) => state.authSlice);
  const [apiCallComplete, setApiCallComplete] = useState(false);
  const [apiResponse, setApiResponse] = useState('getQuestAns');
  const [securityQuestions, setSecurityQuestions] = useState({
    question1: '',
    question2: '',
    answer1: '',
    answer2: '',
    userName: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    regNo: null,
    question1: '',
    answer1: '',
    question2: '',
    answer2: '',
    userName: '',
    user: '',
  });

  const [errors, setErrors] = useState({
    regNo: '',
    question1: '',
    answer1: '',
    question2: '',
    answer2: '',
    userName: '',
    user: '',
  });

  const validate = () => {
    const formErrors = {};

    if (!formData.regNo) {
      formErrors.regNo = 'Registration No is required';
    }
    // You can also check if the file is an image by inspecting the file type

    if (!formData.userName) {
      formErrors.userName = 'User Name is required';
    }

    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let parsedValue = value;
    if (name === 'regNo' || name === 'userName') {
      parsedValue = value ? parseInt(value, 10) : '';
    }

    setFormData({ ...formData, [name]: value });

    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '', // Remove error message for the updated field
      }));
    }
  };

  useEffect(() => {
    
    if (getQuestAns) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        question1: getQuestAns.question1 || '',
        question2: getQuestAns.question2 || '',
      }));
    }
  }, [getQuestAns]);

  useEffect(() => {
    if (getQuestAns) {
      setSecurityQuestions({
        regNo: getQuestAns?.result?.regNo || '',
        question1: getQuestAns?.result?.question1 || '',
        question2: getQuestAns?.result?.question2 || '',
        answer1: getQuestAns?.result?.answer1 || '',
        answer2: getQuestAns?.result?.answer2 || '',
        userName: getQuestAns?.result?.userName || '',
        // user: getQuestAns?.user || '',
      });
    }
  }, [getQuestAns]);

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

  // const handleNextChange = () => {
  const handleNextChange = () => {
    // Validate form data and get errors
    const formErrors = validate();

    // If there are errors, set them to the error state and return early
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Stop further execution if there are validation errors
    }

    setLoading(true);
    const { regNo, userName: rawUserId } = formData;

    let userName = rawUserId;
    if (typeof userName === 'object' && userName !== null) {
      userName = userName.id || '';
    }

    if (userName && typeof userName !== 'string') {
      userName = String(userName);
    }

    if (regNo && userName) {
      
      dispatch(getQuestionAnswer({ regNo, userName }))
        .unwrap()
        .then((response) => {
          
          console.log('API Response:', response);

          if (response?.payload?.status) {
            setApiResponse(response.payload.data);
          } else {
            setApiResponse(null);
          }

          setApiCallComplete(true);
        })
        .catch((error) => {
          
          console.error('API call failed', error);
          setApiCallComplete(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log('Missing regNo or userId');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    // Form validation
    const formErrors = {};

    // Check if answer1 and answer2 match the stored answers
    // if (!formData.answer1 || formData.answer1 !== securityQuestions.answer1) {
    //   formErrors.answer1 = 'Answer for question 1 is incorrect';
    // }

    // if (!formData.answer2 || formData.answer2 !== securityQuestions.answer2) {
    //   formErrors.answer2 = 'Answer for question 2 is incorrect';
    // }

    if (!formData.answer1) {
      formErrors.answer1 = 'Answer  is required';
    } else if (formData.answer1 !== securityQuestions.answer1) {
      formErrors.answer1 = 'Answer for question 1 is incorrect';
    }

    if (!formData.answer2) {
      formErrors.answer2 = 'Answer is required';
    } else if (formData.answer2 !== securityQuestions.answer2) {
      formErrors.answer2 = 'Answer for question 2 is incorrect';
    }

    // If there are errors, set the error state and stop submission
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false); // Stop the loading spinner
      return;
    }

    // Proceed with API call if no errors
    const updatedFormData = {
      ...formData,
      question1: securityQuestions.question1,
      question2: securityQuestions.question2,
      answer1: securityQuestions.answer1,
      answer2: securityQuestions.answer2,
      userName: securityQuestions.userName,
    };

    dispatch(forgotPassword({ formData: updatedFormData }))
      .unwrap()
      .then((res) => {
        
        const { data } = res;
        navigate('/forgotPasswordDetails', { state: { data: updatedFormData, id: data } });
      })
      .catch((error) => {
        console.error('Error occurred:', error);
        toast.error('Failed to reset password. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleKeyDowns = (event) => {
    if (event.keyCode === 13) {
      handleNextChange();
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSubmit(event);
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
                    <div className="card-body">
                      <div className="px-2 py-3">
                        <div className="text-center">
                          <h2 className="text-success mb-2 f-500">Forgot Password</h2>
                        </div>
                        <div className="row w-100">
                          <div className="col-md-12 col-lg-12 col-xl-12 mx-auto">
                            <div className="form-horizontal mt-4 pt-2">
                              {/* Initial Fields before API Call */}
                              {!apiCallComplete && (
                                <>
                                  <div className="mb-3">
                                    <Label>
                                      Registration No. <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Registration No."
                                      name="regNo"
                                      value={formData.regNo}
                                      maxLength={6} // Restricts input to 6 characters
                                      onKeyDown={handleKeyDowns}
                                      // onChange={handleChange}
                                      // onKeyUp={handleKeyUp}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                                        handleChange({ target: { name: 'regNo', value } });
                                      }}
                                    />
                                    {errors.regNo && (
                                      <small className="text-danger">{errors.regNo}</small>
                                    )}
                                  </div>

                                  <div className="mb-3">
                                    <Label>
                                      User Name <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="User Name"
                                      name="userName"
                                      value={formData.userName}
                                      onKeyDown={handleKeyDowns}
                                      onChange={handleChange}
                                      // onChange={(e) => {
                                      //   const value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
                                      //   handleChange({ target: { name: 'userName', value } });
                                      // }}
                                    />
                                    {errors.userName && (
                                      <small className="text-danger">{errors.userName}</small>
                                    )}
                                  </div>
                                  <div className="mb-2">
                                    <button
                                      type="button"
                                      className="btn btn-success w-100 waves-effect waves-light h-50 f-500 f-17"
                                      disabled={loading}
                                      onClick={handleNextChange}
                                    >
                                      {loading ? (
                                        <>
                                          <Spinner size="sm" /> Sending...
                                        </>
                                      ) : (
                                        <>
                                          Next <Icon.ArrowRight />
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </>
                              )}

                              {/* Show Security Questions after API Call */}
                              {apiCallComplete && (
                                <>
                                  <div className="mb-3">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="User Name"
                                      name="userName"
                                      value={getQuestAns?.result?.userName}
                                      onKeyDown={handleKeyDown}
                                      onChange={handleChange}
                                      disabled
                                    />
                                    {errors.user && (
                                      <small className="text-danger">{errors.user}</small>
                                    )}
                                  </div>
                                  <div className="mb-3">
                                    <input
                                      className="form-control"
                                      name="question1"
                                      value={getQuestAns?.result?.question1}
                                      onKeyDown={handleKeyDown}
                                      onChange={handleChange}
                                      disabled
                                    />
                                  </div>

                                  <div className="mb-3">
                                  <Label>
                                Answer1 <span className="text-danger">*</span>
                              </Label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Answer"
                                      name="answer1"
                                      value={formData?.answer1}
                                      onChange={handleChange}
                                      onKeyDown={handleKeyDown}
                                    />
                                    {errors.answer1 && (
                                      <small className="text-danger">{errors.answer1}</small>
                                    )}
                                  </div>

                                  <div className="mb-3">
                                    <input
                                      className="form-control"
                                      name="question2"
                                      value={getQuestAns?.result?.question2}
                                      onKeyDown={handleKeyDown}
                                      onChange={handleChange}
                                      disabled
                                    />
                                  </div>

                                  <div className="mb-3">
                                  <Label>
                                Answer 2 <span className="text-danger">*</span>
                              </Label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Answer"
                                      name="answer2"
                                      value={formData?.answer2}
                                      onChange={handleChange}
                                      onKeyDown={handleKeyDown}
                                    />
                                    {errors.answer2 && (
                                      <small className="text-danger">{errors.answer2}</small>
                                    )}
                                  </div>

                                  <div className="mb-2">
                                    <button
                                      type="button"
                                      className="btn btn-success w-100 waves-effect waves-light h-50 f-500 f-17"
                                      onClick={handleSubmit}
                                      disabled={loading}
                                    >
                                      {loading ? (
                                        <>
                                          <Spinner size="sm" /> Sending...
                                        </>
                                      ) : (
                                        <>
                                          Next <Icon.ArrowRight />
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </>
                              )}

                              {/* Link to login page */}
                              <div className="mt-3 text-center">
                                <small
                                  className="pb-4 d-block"
                                  style={{ color: '#807979', fontSize: '16px' }}
                                >
                                  If you already have an account, please
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
        </div>
      </div>
      {/* End Log In page */}
    </>
  );
};
export default ForgetPassword;
