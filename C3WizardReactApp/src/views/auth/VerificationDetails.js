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
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLogo from '../../layouts/logo/AuthLogo';
import {
  verificationUser,
  ImportEmployee,
  VerificationLink,
} from '../../store/apps/auth/AuthSlice';
import { clearMessage, setMessage } from '../../store/apps/message/MessageSlice';

import { ReactComponent as LeftBg } from '../../assets/images/bg/login-bgleft.svg';
import { ReactComponent as RightBg } from '../../assets/images/bg/login-bg-right.svg';
import Logo from '../../assets/images/logo-w.png';

const VerificationDetails = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state?.messageReducer);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const UserName = localStorage.getItem('userId');
  const regno = localStorage.getItem('regNumber');
  const SSN = localStorage.getItem('SocSecNum');
  const location = useLocation();
  const userName = location.state?.userName;
  const Password = location.state?.userPass;

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLogin = async (formValue) => {
    setLoading(true);
    const { code } = formValue;

    const userData = await dispatch(verificationUser({ code, UserName: userName }))
      .unwrap()
      .then((res) => {
        console.log('res', res);

        // if (res.status === true) {
        //   setIsModalOpen(!isModalOpen);
        //   setSaveMessage(res.message);
        // }

        // localStorage.setItem('userPassword', userPass);
        // localStorage.setItem('userId', userName);
        const roleId = localStorage.getItem('roleId');
        setLoading(false);
        const roleNames = localStorage.getItem('isSelfEmployed') === 'true';
        navigate('/login');
        // if ((roleId === '3' || roleId === '4') && !roleNames) {
        //   navigate('/apps/dashboard');
        // } else if ((roleId === '5' || roleId === '6') && roleNames) {
        //   navigate('/apps/dashboards');
        // } else if (roleId === '1' || roleId === '2') {
        //   navigate('/admin-dashboard');
        // }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const handleLink = () => {
    setVerifyLoading(true);
    dispatch(VerificationLink({ UserName: userName, Password }))
      .unwrap()
      .then((res) => {
        console.log('Reset success:', res);
      })
      .catch((err) => {
        console.error('Reset failed:', err);
      })
      .finally(() => {
        setVerifyLoading(false);
      });
  };

  function save() {
    const formdata = {
      UserName,
      SSN,
      regno,
    };

    dispatch(ImportEmployee(formdata))
      .unwrap()
      .then((response) => {
        navigate('/login');
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  const initialValues = {
    code: '',
    // userPass: '',
  };

  const validationSchema = Yup.object().shape({
    code: Yup.string().required('Verification Details is required'),
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

  return (
    <>
      <Helmet>
        <title>Verification Details - C3Wizard</title>
      </Helmet>
      <div className="loginBox my-4">
        <Container fluid className="h-100">
          <Row className="justify-content-center align-items-center h-100">
            <Col lg="12" className="loginContainer">
              <Card>
                <CardBody className="p-4 m-1">
                  <div className="col-lg-12 mb-4 text-center mx-auto">
                    <img src={Logo} width={80} alt="Logo" />
                  </div>
                  <h5 className="mb-3 text-center cutom_heading"> Verification Details </h5>
                  <div
                    className="alert alert-info text-center py-2 mb-4"
                    style={{
                      backgroundColor: '#e8f4fd',
                      border: '1px solid #b6e0fe',
                      color: '#0b5394',
                      borderRadius: '10px',
                      fontSize: '15px',
                    }}
                  >
                    Your account is not yet active. A verification code has been sent to your
                    registered email address. Please enter the code below to activate your account.
                  </div>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                    render={({ errors, touched }) => (
                      <Form>
                        <FormGroup>
                          <Label htmlFor="code">
                            Verification Details <span className="text-danger">*</span>
                          </Label>
                          <Field
                            name="code"
                            type="text"
                            className={`mb-4 form-control${
                              errors.code && touched.code ? ' is-invalid' : ''
                            }`}
                          />
                          <ErrorMessage name="code" component="div" className="invalid-feedback" />
                        </FormGroup>

                        <FormGroup>
                          <Button
                            type="submit"
                            disabled={loading}
                            color="success"
                            outline
                            className="me-2 mb-3"
                            style={{ width: '100%' }}
                          >
                            {loading ? (
                              <>
                                <Spinner size="sm" /> Verifying...
                              </>
                            ) : (
                              <>Verify & Continue</>
                            )}
                          </Button>
                        </FormGroup>
                        <FormGroup style={{ marginBottom: 0 }}>
                          <small className="d-block" style={{ color: '#807979', fontSize: '16px' }}>
                            Resend Verification Code
                            <span
                              onClick={handleLink}
                              style={{
                                color: '#613a5f',
                                fontSize: '14px',
                                marginLeft: '5px',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                              }}
                              disabled={verifyLoading}
                            >
                              {verifyLoading ? (
                                <>
                                  Sending..{' '}
                                  <Spinner
                                    size="sm"
                                    className="text-info"
                                    style={{ marginRight: '5px' }}
                                  />
                                </>
                              ) : (
                                <>Resend Code</>
                              )}
                            </span>
                          </small>
                        </FormGroup>

                        <FormGroup>
                          <small
                            className="pb-2 d-block"
                            style={{ color: '#807979', fontSize: '16px' }}
                          >
                            If Already Have An Account? Please
                            <Link
                              to="/login"
                              style={{ color: '#613a5f', fontSize: '14px', marginLeft: '5px' }}
                            >
                              Login Here
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

      {/* ---------modal POP---- */}
      {/* <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Action</ModalHeader>
        <ModalBody>{saveMessage}</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            No
          </Button>
          <Button color="primary" onClick={() => save({})}>
            Yes
          </Button>
        </ModalFooter>
      </Modal> */}
      {/* End Modal------- */}
    </>
  );
};

export default VerificationDetails;
