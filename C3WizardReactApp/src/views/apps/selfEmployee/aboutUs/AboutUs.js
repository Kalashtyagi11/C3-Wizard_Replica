import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, CardTitle, Container, Row, Col, Card, CardBody } from 'reactstrap';
import AuthLogo from '../../../../assets/images/logo-w.png';

import { ReactComponent as LeftBg } from '../../../../assets/images/bg/login-bgleft.svg';
import { ReactComponent as RightBg } from '../../../../assets/images/bg/login-bg-right.svg';

const AboutUs = () => {
  const navigate = useNavigate();
  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles.find((role) => role.description === 'ABOUT US');
  const canViewSelfEmployee = employerPermission?.viewPermission;

  useEffect(() => {
    if (canViewSelfEmployee === false) {
      navigate('/login');
    }
  }, [canViewSelfEmployee, navigate]);

  return (
    <div className="loginBox">
      <LeftBg className="position-absolute left bottom-0" />
      <RightBg className="position-absolute end-0 top" />
      <Container fluid className="h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col lg="12" className="loginContainer">
            <AuthLogo />
            <Card>
              <CardBody className="p-4 m-1 text-center">
                <div className="mt-3 mb-2">
                  <i className="bi bi-exclamation-triangle-fill text-warning display-5"></i>
                </div>
                <CardTitle tag="h4">Your page in under maintenance</CardTitle>
                <h5 className="mb-0 text-muted font-medium">Something wrong going on this page.</h5>
                <h5 className="text-muted font-medium mb-4">Please Check back again.</h5>

                <div className="d-flex align-items-center justify-content-center gap-2">
                  <Button color="primary">
                    <i aria-hidden="true" className="bi bi-facebook"></i>
                  </Button>
                  <Button color="info">
                    <i aria-hidden="true" className="bi bi-twitter"></i>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs;
