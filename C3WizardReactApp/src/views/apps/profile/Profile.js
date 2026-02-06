import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import { Input, FormGroup, Spinner, Label } from 'reactstrap';
import { Helmet } from 'react-helmet';
// import Logo from '../../../assets/images/users/profile.png';
import { getProfiles, updateProfile } from '../../../store/apps/auth/AuthSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import user from '../../../assets/images/users/profile.png';

const Profile = () => {
  const companyId = localStorage.getItem('companyId');
  const { message, type: messageType } = useSelector((state) => state?.messageReducer);
  const { profileDataNew } = useSelector((state) => state.authSlice);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem('userID'), 10);
  const [errors, setErrors] = useState({});

  const savedRoles = JSON.parse(localStorage.getItem('roleList'));
  const employerPermission = savedRoles
    .flatMap((role) => role.children || [])
    .find((child) => child.description === 'USER MANAGEMENT');
  //const canAddUserManagement = employerPermission?.addPermission;
  const canEditUserManagement = employerPermission?.updatePermission;

  const selfprofile = savedRoles.find((role) => role.description === 'User Profile');
  const canEditProfileDetails = selfprofile?.updatePermission;

  const [formData, setFormData] = useState({
    userId,
    firstName: '',
    lastName: '',
    emailId: '',
    profileImage: null,
  });

  const validateForm = () => {
    const formErrors = {};

    if (!formData.firstName) {
      formErrors.firstName = 'First Name is required.';
    }

    if (!formData.lastName) {
      formErrors.lastName = 'Last Name is required.';
    }

    if (!formData.emailId) {
      formErrors.emailId = 'Email is required';
    } else if (/\s/.test(formData.emailId)) {
      formErrors.emailId = 'Email cannot contain spaces';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.emailId)) {
      formErrors.emailId = 'Invalid email format';
    }

    return formErrors;
  };

  // useEffect(() => {
  //   if (userId) {
  //     dispatch(getProfiles(userId));
  //   }
  // }, [userId]);

  useEffect(() => {
    if (profileDataNew) {
      setFormData(profileDataNew);
      if (profileDataNew.profileImage) {
        setSelectedImage(profileDataNew.profileImage);
      }
    }
  }, [profileDataNew]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && files.length > 0) {
      const file = files[0];
      const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      // Check if the file type is valid
      if (!validImageTypes.includes(file.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          profileImage: 'Only PNG, JPG, and JPEG images are allowed.',
        }));
        return; // Exit the function if the file type is invalid
      }

      // Clear any previous errors
      setErrors((prevErrors) => ({
        ...prevErrors,
        profileImage: '',
      }));

      // Set the selected image to state
      setFormData({
        ...formData,
        [name]: file, // Set the file in the state
      });

      // Set the selected image for preview
      setSelectedImage(URL.createObjectURL(file));
    } else {
      // Handle text inputs (for fields like name, email, etc.)
      setFormData({
        ...formData,
        [name]: value,
      });

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true); // Show loading indicator
      try {
        const formDataToSend = new FormData();
        // formDataToSend.append('roleId', formData.roleId);
        formDataToSend.append('userId', formData.userId);
        formDataToSend.append('profileImage', formData.profileImage || selectedImage);
        formDataToSend.append('emailId', formData.emailId);
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);

        // Dispatch action and handle the response
        const response = await dispatch(updateProfile(formDataToSend)).unwrap();
        console.log('Profile updated successfully:', response);
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setLoading(false); // Hide loading indicator
      }
    }
  };

  useEffect(() => {
    if (message) {
      if (messageType === 'success') {
        toast.success(message);
      } else if (messageType === 'error') {
        toast.error(message);
      }
      // Reset the message after showing the toast to ensure it triggers again
      dispatch(setMessage({ message: '', messageType: '' }));
    }
  }, [message, messageType, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Profile - C3Wizard</title>
      </Helmet>
      <div id="layout-wrapper">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
          <ul className="d-flex align-items-center gap-2 mt-3 list-unstyled">
            {/* <li className="fw-medium">
              <Link to="/apps/dashboards" className="d-flex align-items-center gap-1 text-muted">
                <i className="ti-home" />
                Dashboard{' '}
              </Link>
            </li>
            <li>-</li>
           
            <li>-</li> */}
            <li className="fw-medium"> User Profile </li>
          </ul>
        </div>
        <div className="home-center ">
          <div className="home-desc-center">
            <div className="container">
              <div className="main-content">
                <div className="page-content">
                  <div className="container-fluid">
                    <div className="page-content-wrapper">
                      <div className="row">
                        <div className="col-xl-12">
                          <div className="card">
                            <div className="card-body profile">
                              <div className="row g-3 align-items-center mt-1 mb-4">
                                <div className="col-lg-12">
                                  <div className="image-upload-container">
                                    <label
                                      htmlFor="image-upload"
                                      className="custom-file-input-label"
                                    >
                                      {selectedImage ? (
                                        <img
                                          src={selectedImage}
                                          alt="Selected"
                                          className="image-preview"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = user;
                                            // If image fails to load, show default
                                          }}
                                        />
                                      ) : (
                                        <img
                                          // src={
                                          //   profileDataNew?.profileImage
                                          //     ? profileDataNew.profileImage
                                          //     : user
                                          // }
                                          src={profileDataNew?.profileImage || user}
                                          default
                                          image
                                          path
                                          alt="Default"
                                          className="image-preview"
                                          width="100"
                                          height="100"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = user;
                                            // If image fails to load, show default
                                          }}
                                        />
                                      )}
                                      <div>
                                        <span className="user_change">
                                          {selectedImage
                                            ? 'Upload Profile Picture'
                                            : 'Upload Profile Picture'}
                                        </span>
                                      </div>
                                    </label>
                                    <input
                                      id="image-upload"
                                      type="file"
                                      name="profileImage"
                                      accept="image/*"
                                      onChange={handleInputChange}
                                      style={{ display: 'none' }}
                                    />
                                    {errors.profileImage && (
                                      <div className="text-danger">{errors.profileImage}</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-4 col-lg-4 col-xl-4">
                                  <div className="mb-3">
                                    <Label>
                                      First Name <span className="text-danger">*</span>
                                    </Label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="first-name"
                                      placeholder=""
                                      value={formData.firstName}
                                      onChange={handleInputChange}
                                      name="firstName"
                                    />
                                    {errors.firstName && (
                                      <div className="text-danger">{errors.firstName}</div>
                                    )}
                                  </div>
                                </div>

                                <div className="col-md-4 col-lg-4 col-xl-4">
                                  <div className="mb-3">
                                    <Label>
                                      Last Name &nbsp;<span className="text-danger">*</span>
                                    </Label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="last-name"
                                      placeholder=""
                                      value={formData.lastName}
                                      onChange={handleInputChange}
                                      name="lastName"
                                    />
                                    {errors.lastName && (
                                      <div className="text-danger">{errors.lastName}</div>
                                    )}
                                  </div>
                                </div>

                                <div className="col-md-4 col-lg-4 col-xl-4">
                                  <div className="mb-3">
                                    <Label>
                                      Email<span className="text-danger">*</span>
                                    </Label>
                                    <input
                                      type="email"
                                      className="form-control"
                                      id="email"
                                      placeholder=""
                                      value={formData.emailId}
                                      onChange={handleInputChange}
                                      name="emailId"
                                      maxLength={64}
                                    />
                                    {errors.emailId && (
                                      <div className="text-danger">{errors.emailId}</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="row mt-4">
                                <div className="col-md-4 col-lg-4 col-xl-4">
                                  {(
                                    canEditProfileDetails === undefined
                                      ? canEditUserManagement === true ||
                                        canEditUserManagement === undefined
                                      : canEditProfileDetails
                                  ) ? (
                                    <button
                                      onClick={handleSubmit}
                                      type="submit"
                                      className="btn btn-success px-4 me-3"
                                    >
                                      {loading ? (
                                        <>
                                          <Spinner size="sm" />
                                          &nbsp; Saving...
                                        </>
                                      ) : (
                                        <>
                                          <i className="far fa-save pe-1"></i> Save
                                        </>
                                      )}
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-secondary h-45"
                                      type="button"
                                      disabled
                                      style={{ opacity: 0.6 }}
                                    >
                                      Save
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="btn btn-light border px-4"
                                  >
                                    <i className="fas fa-times"></i> Cancel
                                  </button>
                                  {/* <button
                                  onClick={handleSubmit}
                                  type="submit"
                                  className="btn btn-success px-4 me-3"
                                >
                                  {loading ? (
                                    <>
                                      <Spinner size="sm" />
                                      &nbsp; Saving...
                                    </>
                                  ) : (
                                    <>
                                      <i className="far fa-save pe-1"></i> Save
                                    </>
                                  )}
                                </button> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* End Main Content */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Log In page */}
    </>
  );
};
export default Profile;
