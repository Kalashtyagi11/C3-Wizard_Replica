import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Label,
  FormGroup,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Spinner,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import AuthLogo from '../../layouts/logo/AuthLogo';
import { login } from '../../store/apps/auth/AuthSlice';
import { clearMessage, setMessage } from '../../store/apps/message/MessageSlice';

import { ReactComponent as LeftBg } from '../../assets/images/bg/login-bgleft.svg';
import { ReactComponent as RightBg } from '../../assets/images/bg/login-bg-right.svg';
import Logo from '../../assets/images/logo-w.png';

const Login = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state?.messageReducer);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // const handleLogin = async (formValue) => {
  //   ;
  //   setLoading(true);
  //   const { userName, userPass } = formValue;
  //   await dispatch(login({ userName, userPass }))
  //     .unwrap()
  //     .then(() => {
  //       navigate('/dashboard');
  //     })
  //     .catch((err) => {
  //       console.log('error', err);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  const handleLogin = async (formValue) => {
    
    setLoading(true);
    const { userName, userPass } = formValue;

    const userData = await dispatch(login({ userName, userPass }))
      .unwrap()
      .then((res) => {
        console.log('res', res);
        localStorage.setItem('userPassword', userPass);
        localStorage.setItem('userId', userName);

        // if (res.data === 'active-link') {
        //   setLoading(false);
        //   // navigate('/Verification');
        //   navigate('/Verification', {
        //     state: {
        //       userId: userName,
        //       userPassword: userPass,
        //     },
        //   });
        //   return;
        // }

        if (res?.data?.type === 'mailVarifyProcess') {
          const qrMessage = res.message;
          const userIdMFA = res.data.userid;

          localStorage.setItem('qrMessage', qrMessage);
          localStorage.setItem('userIdMFA', userIdMFA);
          localStorage.setItem('userPassword', userPass);
          localStorage.setItem('userId', userName);

          setLoading(false);
          navigate('/VerifyProcess');
          return;
        }

        if (res?.data?.type === 'MFAProcess') {
          const qrMessage = res.message;
          const userIdMFA = res.data.userid;

          localStorage.setItem('qrMessage', qrMessage);
          localStorage.setItem('userIdMFA', userIdMFA);
          localStorage.setItem('userPassword', userPass);
          localStorage.setItem('userId', userName);

          setLoading(false);
          navigate('/VerifyQRCODE');
          return;
        }

        const roleId = localStorage.getItem('roleId');
        setLoading(false);
        const roleNames = localStorage.getItem('isSelfEmployed') === 'true';
        const CategoryType = localStorage.getItem('roleCategory');
        if (CategoryType === 'Company') {
          navigate('/apps/dashboard');
        } else if (CategoryType === 'SelfEmployee') {
          navigate('/apps/dashboards');
        } else if (CategoryType === 'SSB') {
          navigate('/admin-dashboard');
        }
      })
      .catch((error) => {
        if (typeof error === 'string' && error.includes('User account is not active')) {
          setLoading(false);
          // navigate('/Verification');
          navigate('/Verification', {
            state: {
              userName,
              userPass,
            },
          });
          toast.success(error);
          return;
        }
        setLoading(false);
      });
  };

  const initialValues = {
    userName: '',
    userPass: '',
  };

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required('User Name is required'),
    userPass: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

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

  const handleCreateAccountClick = (e) => {
    e.preventDefault();
    setShowRegistrationModal(true);
  };

  const handleRegistrationTypeSelect = (registrationType) => {
    setShowRegistrationModal(false);
    navigate('/register', { state: { registrationType } });
  };

  return (
    <>
      <Helmet>
        <title>Login - C3Wizard</title>
      </Helmet>
      <div className="loginBox">
        <Container fluid className="h-100">
          <Row className="justify-content-center align-items-center h-100">
            <Col lg="12" className="loginContainer">
              <Card>
                <CardBody className="p-4 m-1">
                  <div className="col-lg-12 mb-4 text-center mx-auto">
                    <img src={Logo} width={70} alt="Logo" />
                  </div>
                  <h5 className="mb-3 text-center cutom_heading">Login to your Account </h5>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                    render={({ errors, touched }) => (
                      <Form>
                        <FormGroup>
                          <Label htmlFor="userName">
                            User Name <span className="text-danger">*</span>
                          </Label>
                          <Field
                            name="userName"
                            type="text"
                            className={`form-control${
                              errors.userName && touched.userName ? ' is-invalid' : ''
                            }`}
                          />
                          <ErrorMessage
                            name="userName"
                            component="div"
                            className="invalid-feedback"
                          />
                        </FormGroup>
                        <FormGroup style={{ position: 'relative' }}>
                          <Label htmlFor="userPass">
                            Password <span className="text-danger">*</span>
                          </Label>
                          <Field
                            name="userPass"
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={`form-control${
                              errors.userPass && touched.userPass ? ' is-invalid' : ''
                            }`}
                          />
                          <button
                            type="button"
                            className="showPreview showPassword"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <i className="fas fa-eye-slash" />
                            ) : (
                              <i className="fas fa-eye" />
                            )}
                          </button>
                          <ErrorMessage
                            name="userPass"
                            component="div"
                            className="invalid-feedback"
                          />
                        </FormGroup>

                        <FormGroup>
                          <Button
                            type="submit"
                            disabled={loading}
                            color="success"
                            outline
                            className="btn btn-success w-100 waves-effect waves-light h-50 f-500 f-17"
                            style={{ width: '100%' }}
                          >
                            {loading ? (
                              <>
                                <Spinner size="sm" /> Logging...
                              </>
                            ) : (
                              <>Login</>
                            )}
                          </Button>
                        </FormGroup>
                        <FormGroup>
                          <small
                            className="pb-1 d-block"
                            style={{ color: '#807979', fontSize: '16px' }}
                          >
                            Do not have an account?
                            <button
                              type="button"
                              onClick={handleCreateAccountClick}
                              style={{
                                color: '#613a5f',
                                fontSize: '14px',
                                marginLeft: '5px',
                                background: 'none',
                                border: 'none',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                            >
                              Create an Account
                            </button>
                          </small>
                        </FormGroup>
                        <FormGroup style={{ display: 'flex', justifyContent: 'space-between' }}>
                          {/* <Link to="/exitinguser">
                            <small style={{ color: '#613a5f', fontSize: '14px' }}>
                              Exiting User Login
                            </small>
                          </Link> */}

                          <small style={{ color: '#613a5f', fontSize: '14px' }}>
                            <Link
                              to="/forgotpassword"
                              style={{ color: '#613a5f', fontSize: '14px', marginLeft: '5px' }}
                            >
                              Forgot Password?
                            </Link>
                          </small>
                        </FormGroup>
                      </Form>
                    )}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Registration Type Selection Modal */}
      <Modal isOpen={showRegistrationModal} toggle={() => setShowRegistrationModal(false)}>
        <ModalHeader toggle={() => setShowRegistrationModal(false)}>
          Select Registration Type
        </ModalHeader>
        <ModalBody>
          <p className="mb-3">Please select the type of account you want to create:</p>
          <div className="row">
            <div className="col-lg-6 mb-2">
              <Button
                color="primary"
                outline
                className="w-100"
                onClick={() => handleRegistrationTypeSelect('Company')}
              >
                <i className="fas fa-building me-2"></i>
                Employer Registration
              </Button>
            </div>
            <div className="col-lg-6 mb-2">
              <Button
                color="primary"
                outline
                className="w-100"
                onClick={() => handleRegistrationTypeSelect('SelfEmployed')}
              >
                <i className="fas fa-user me-2"></i>
                Self Employed Registration
              </Button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary btn-light" onClick={() => setShowRegistrationModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Login;
