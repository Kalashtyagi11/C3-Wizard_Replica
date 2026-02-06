import { useState } from 'react';
import { Button, Label } from 'reactstrap';
import { Modal } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import UserManagementServices from '../../../service/user-management/UserManagementServices';

const initialValues = {
  newPassword: '',
  confirmPassword: '',
};

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(40, 'Password must not exceed 40 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('New Password is required')
    .required('New Password is Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')

    .required('Confirm Password is Required'),
});

const ResetPasswordUser = ({ show, handleClose, userId }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const LoginId = localStorage.getItem('userId');
  const Password = localStorage.getItem('userPassword');
  const Id = localStorage.getItem('userID');
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = { Id, LoginId, Password, userId, ...values };
      const res = await UserManagementServices.resetPassword(payload);

      toast.success(res.data.message);
      resetForm();
      handleClose();
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.response.data.message);
    }
    setSubmitting(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <FormikForm>
              <div className="mb-3" style={{ position: 'relative' }}>
                <Label>New Password</Label> <span className="text-danger">*</span>
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  className="form-control"
                />
                <button
                  type="button"
                  className="showPreview showPassword"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ top: '40px' }}
                >
                  {showPassword ? <i className="fas fa-eye-slash" /> : <i className="fas fa-eye" />}
                </button>
                <ErrorMessage name="newPassword" component="div" className="text-danger" />
              </div>

              <div className="mb-3" style={{ position: 'relative' }}>
                <Label>Confirm Password</Label> <span className="text-danger">*</span>
                <Field
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-control"
                />
                <button
                  type="button"
                  className=" showPassword"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ top: '40px' }}
                >
                  {showConfirmPassword ? (
                    <i className="fas fa-eye-slash" />
                  ) : (
                    <i className="fas fa-eye" />
                  )}
                </button>
                <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
              </div>
              <div className="text-center">
                <Button
                  variant="primary"
                  type="submit"
                  className="btn btn-success waves-effect waves-light h-45"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

ResetPasswordUser.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired, // userId must be a number
};

export default ResetPasswordUser;
