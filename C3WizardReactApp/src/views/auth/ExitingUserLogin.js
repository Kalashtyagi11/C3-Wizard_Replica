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
} from 'reactstrap';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import AuthLogo from '../../layouts/logo/AuthLogo';
import { ExitingUser } from '../../store/apps/auth/AuthSlice';
import { clearMessage, setMessage } from '../../store/apps/message/MessageSlice';

import { ReactComponent as LeftBg } from '../../assets/images/bg/login-bgleft.svg';
import { ReactComponent as RightBg } from '../../assets/images/bg/login-bg-right.svg';
import Logo from '../../assets/images/logo-w.png';

const ExitingUserLogin = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state?.messageReducer);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // const handleLogin = async (formValue) => {
  //   ;
  //   setLoading(true);
  //   const { UserName, Password } = formValue;
  //   await dispatch(login({ UserName, Password }))
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
    const { UserName, Password } = formValue;

    const userData = await dispatch(ExitingUser({ UserName, Password }))
      .unwrap()
      .then((res) => {
        console.log('res', res);
        if (res.data.status) {
          localStorage.setItem('roleId', res.data.data.roleId);
          // Optional: store other details as needed
          // localStorage.setItem('userId', res.data.data.userId);
        }
        localStorage.setItem('Passwordword', Password);
        localStorage.setItem('userId', UserName);
        // localStorage.setItem('roleId', RoleId);
        const roleId = localStorage.getItem('roleId');
        setLoading(false);
        const roleNames = localStorage.getItem('isSelfEmployed') === 'true';

        if ((roleId === '3' || roleId === '4') && !roleNames) {
          navigate('/apps/dashboard');
        } else if ((roleId === '5' || roleId === '6') && roleNames) {
          navigate('/apps/dashboards');
        } else if (roleId === '1' || roleId === '2') {
          navigate('/admin-dashboard');
        }
        navigate('/Verification');
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const initialValues = {
    UserName: '',
    Password: '',
  };

  const validationSchema = Yup.object().shape({
    UserName: Yup.string().required('User Name is required'),
    Password: Yup.string()
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

  return (
    <>
      <Helmet>
        <title>Exiting User Login - C3Wizard</title>
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
                  <h5 className="mb-4 text-center cutom_heading">Exiting User Login </h5>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                    render={({ errors, touched }) => (
                      <Form>
                        <FormGroup>
                          <Label htmlFor="UserName">
                            User Name <span className="text-danger">*</span>
                          </Label>
                          <Field
                            name="UserName"
                            type="text"
                            className={`form-control${
                              errors.UserName && touched.UserName ? ' is-invalid' : ''
                            }`}
                          />
                          <ErrorMessage
                            name="UserName"
                            component="div"
                            className="invalid-feedback"
                          />
                        </FormGroup>
                        <FormGroup style={{ position: 'relative' }}>
                          <Label htmlFor="Password">
                            Password <span className="text-danger">*</span>
                          </Label>
                          <Field
                            name="Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={`form-control${
                              errors.Password && touched.Password ? ' is-invalid' : ''
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
                            name="Password"
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
                            className="me-2"
                            style={{ width: '100%' }}
                          >
                            {loading ? (
                              <>
                                <Spinner size="sm" /> Next...
                              </>
                            ) : (
                              <>Next</>
                            )}
                          </Button>
                        </FormGroup>
                        <FormGroup>
                          <small
                            className="pb-4 d-block"
                            style={{ color: '#807979', fontSize: '16px' }}
                          >
                            If Already have An Account Please
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
    </>
  );
};

export default ExitingUserLogin;
