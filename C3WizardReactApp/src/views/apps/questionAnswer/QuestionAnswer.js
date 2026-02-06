import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import { Input, FormGroup, Spinner, Label } from 'reactstrap';
import { Helmet } from 'react-helmet';
import Logo from '../../../assets/images/logo-w.png';
import {
  getPersonalDetail,
  updatePersonal,
} from '../../../store/apps/selfEmployee/PersonalDetails';
import { postEmployer, EmployersGetById } from '../../../store/apps/employer/EmployerSlice';

import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';

const QuestionAnswer = () => {
  const [loading, setLoading] = useState(false);
  const { message, type } = useSelector((state) => state.messageReducer);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { PersonalData, CategoryData, CountryData } = useSelector((state) => state.personalDetails);
  const { EmployersGetBydata } = useSelector((state) => state.employerSlice);
  const dispatch = useDispatch();
  const selfEmployeeid = localStorage.getItem('companyId');
  const companyId = localStorage.getItem('companyId');
  const roleId = localStorage.getItem('roleId');
  const UserId = localStorage.getItem('userID');
  const categoryType = localStorage.getItem('roleCategory')?.trim()?.toUpperCase();
  const userPassword = localStorage.getItem('userPassword');
  const [showAnswerFirst, setShowAnswerFirst] = useState(false);
  const [showAnswerSecond, setShowAnswerSecond] = useState(false);

  const [formData, setFormData] = useState({
    question1: '',
    question2: '',
    answer1: '',
    answer2: '',
    mode: 1,
    user_Password: userPassword,
  });

  // useEffect(() => {
  //
  //   dispatch(getPersonalDetail({ selfEmployeeid }));
  //   dispatch(EmployersGetById(companyId));
  // }, []);

  // useEffect(() => {
  //   if (PersonalData) {
  //     setFormData(PersonalData);
  //     setFormData(EmployersGetBydata);
  //   }
  // }, [PersonalData, EmployersGetBydata]);

  useEffect(() => {
    if (categoryType === 'COMPANY') {
      dispatch(EmployersGetById({companyId, UserId}));
    } else if (categoryType === 'SELFEMPLOYEE') {
      dispatch(getPersonalDetail({ selfEmployeeid }));
    }
  }, [dispatch, categoryType, selfEmployeeid, companyId]);

  useEffect(() => {
    if (PersonalData || EmployersGetBydata) {
      if (categoryType === 'COMPANY') {
        setFormData((prevData) => ({
          ...prevData,
          ...EmployersGetBydata,
        }));
      } else if (categoryType === 'SELFEMPLOYEE') {
        setFormData((prevData) => ({
          ...prevData,
          ...PersonalData,
        }));
      }
    }
  }, [categoryType, PersonalData, EmployersGetBydata]);

  const validateForm = () => {
    const formErrors = {};

    if (!formData.question1) {
      formErrors.question1 = 'Security question #1 is required';
    }

    if (!formData.question2) {
      formErrors.question2 = 'Security question #2 is required';
    }

    // ✅ Check if both selected questions are the same
    if (formData.question1 && formData.question2 && formData.question1 === formData.question2) {
      formErrors.question2 = 'Security question #2 must be different from question #1';
    }

    if (!formData.answer1) {
      formErrors.answer1 = 'Answer1 is required';
    }

    if (!formData.answer2) {
      formErrors.answer2 = 'Answer2 is required';
    }

    return formErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'mode') return;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleSubmit = () => {
  //

  //   const validationErrors = validateForm();
  //   setErrors(validationErrors);

  //   if (Object.keys(validationErrors).length === 0) {
  //     setLoading(true);
  //     dispatch(updatePersonal({ formData }));
  //     dispatch(postEmployer(formData))
  //       .unwrap()
  //       .then((result) => {
  //         // navigate('/apps/dashboards');
  //       })
  //       .catch((err) => {
  //         console.error('Error:', err);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  // };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      if (categoryType === 'COMPANY') {
        const payload = {
          ...formData,
          mode: 2, // force it here
          companyLogo: null,
          user_Password: userPassword,
        };

        dispatch(postEmployer(payload))
          .unwrap()
          .then((res) => {
            dispatch(EmployersGetById({companyId, UserId}));
            // toast.success('Employer details updated successfully!');
          })
          .catch((err) => {
            // toast.error('Failed to update employer details.');
          })
          .finally(() => setLoading(false));
      } else if (categoryType === 'SELFEMPLOYEE') {
        const payload = {
          ...formData,
          mode: 2,
          helperUser_Password: userPassword,
        };
        dispatch(updatePersonal(payload))
          .unwrap()
          .then((res) => {
            // toast.success('Personal details updated successfully!');
          })
          .catch((err) => {
            // toast.error('Failed to update personal details.');
          })
          .finally(() => setLoading(false));
      }
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
        <title>Questions & Answer -C3 Wizard</title>
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
                          <h2 className="text-success mb-4 mt-2  f-500">Question Answer</h2>
                        </div>
                        <div className="row w-100">
                          <div className="col-md-12 col-lg-12 col-xl-12">
                            <div className="mb-3">
                              <Label>
                                Question1 <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                id="question1"
                                className="form-control"
                                name="question1"
                                value={formData.question1}
                                onChange={handleInputChange}
                              >
                                <option value="">Security Question #1</option>
                                <option value="What Is Your Birth Place">
                                  What Is Your Birth Place
                                </option>
                                <option value="What Is Your Favorite Place">
                                  What Is Your Favorite Place
                                </option>
                                <option value="What Is Your Childhood Name">
                                  What Is Your Childhood Name
                                </option>
                                <option value="What Is Your First School">
                                  What Is Your First School
                                </option>
                                <option value="What Is Your Favorite Dish">
                                  What Is Your Favorite Dish
                                </option>
                                <option value="What Is Your Favorite Snacks">
                                  What Is Your Favorite Snacks
                                </option>
                              </Input>
                              {errors.question1 && (
                                <div className="text-danger">{errors.question1}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-12 col-lg-12 col-xl-12 eye">
                            <div className="mb-3">
                              <Label>
                                Answer1 <span className="text-danger">*</span>
                              </Label>
                              <input
                                type={showAnswerFirst ? 'text' : 'password'}
                                className="form-control"
                                id="answer1"
                                name="answer1"
                                placeholder=" Answer #1"
                                onChange={handleInputChange}
                                value={formData.answer1}
                              />
                              <button
                                type="button"
                                className="showPassword"
                                onClick={() => setShowAnswerFirst(!showAnswerFirst)}
                                style={{ top: '47%' }}
                              >
                                {showAnswerFirst ? (
                                  <i className="fas fa-eye-slash" />
                                ) : (
                                  <i className="fas fa-eye" />
                                )}
                              </button>
                              {errors.answer1 && (
                                <div className="text-danger">{errors.answer1}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-12 col-lg-12 col-xl-12">
                            <div className="mb-3">
                              <Label>
                                Question2 <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                className="form-control"
                                id="question2"
                                name="question2"
                                onChange={handleInputChange}
                                value={formData.question2}
                              >
                                <option value="">Security Question #2</option>
                                <option value="What Is Your Birth Place">
                                  What Is Your Birth Place
                                </option>
                                <option value="What Is Your Favorite Place">
                                  What Is Your Favorite Place
                                </option>
                                <option value="What Is Your Childhood Name">
                                  What Is Your Childhood Name
                                </option>
                                <option value="What Is Your First School">
                                  What Is Your First School
                                </option>
                                <option value="What Is Your Favorite Dish">
                                  What Is Your Favorite Dish
                                </option>
                                <option value="What Is Your Favorite Snacks">
                                  What Is Your Favorite Snacks
                                </option>
                              </Input>
                              {errors.question2 && (
                                <div className="text-danger">{errors.question2}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-12 col-lg-12 col-xl-12 eye">
                            <Label>
                              Answer2 <span className="text-danger">*</span>
                            </Label>
                            <div className="mb-3">
                              <input
                                type={showAnswerSecond ? 'text' : 'password'}
                                className="form-control"
                                id="answer2"
                                name="answer2"
                                placeholder=" Answer #2"
                                onChange={handleInputChange}
                                value={formData.answer2}
                              />
                              <button
                                type="button"
                                className="showPassword"
                                onClick={() => setShowAnswerSecond(!showAnswerSecond)}
                                style={{ top: '47%' }}
                              >
                                {showAnswerSecond ? (
                                  <i className="fas fa-eye-slash" />
                                ) : (
                                  <i className="fas fa-eye" />
                                )}
                              </button>
                              {errors.answer2 && (
                                <div className="text-danger">{errors.answer2}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-12 text-center">
                            <button
                              type="submit"
                              className="btn btn-success w-100 waves-effect waves-light h-100 f-500 f-17"
                              disabled={loading}
                              // onClick={handleSubmit}
                              onClick={() => handleSubmit(formData.employeeId)}
                            >
                              <i className="far fa-save pe-1" />{' '}
                              {loading ? (
                                <>
                                  <Spinner size="sm"></Spinner> Saving...
                                </>
                              ) : (
                                <>Save</>
                              )}
                            </button>
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
export default QuestionAnswer;
