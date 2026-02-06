import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useParams } from 'react-router-dom';
import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import { Input, FormGroup, Spinner, Label } from 'reactstrap';
import { Helmet } from 'react-helmet';
import {
  getPersonal,
  updatePersonal,
} from '../../../store/apps/selfEmployee/userManagement/userManagementSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';
import user from '../../../assets/images/users/profile.png';

const UpdateSelfUser = () => {
  const { message, type: messageType } = useSelector((state) => state?.messageReducer);
  const { PersonalData } = useSelector((state) => state.userManagementSlice);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId,
    firstName: '',
    lastName: '',
    emailId: '',
    // roleId,
    profileImage: null,
  });

  useEffect(() => {
    if (userId) {
      dispatch(getPersonal(userId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (PersonalData) {
      setFormData(PersonalData);
      if (PersonalData.profileImage) {
        setSelectedImage(PersonalData.profileImage);
      }
    }
  }, [PersonalData]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0], // Set the file in the state
      });

      setSelectedImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('userId', formData.userId);
      formDataToSend.append('profileImage', formData.profileImage || selectedImage);
      formDataToSend.append('emailId', formData.emailId);
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);

      // Dispatch action and handle the response
      const response = await dispatch(updatePersonal(formDataToSend)).unwrap();
      navigate(-1);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  useEffect(() => {
    if (message) {
      if (messageType === 'success') {
        toast.success(message);
      } else if (messageType === 'error') {
        toast.error(message);
      }
      dispatch(setMessage({ message: '', messageType: '' }));
    }
  }, [message, messageType, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Update Self Employed User - C3Wizard</title>
      </Helmet>
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
                          <div className="card-header py-3 bg_ligh">
                            <div className="row align-items-center d-flex">
                              <div className="col-xl-12 col-12 mb-2 mb-lg-0">
                                <h4 className="header-title mb-0 text-success">
                                  <i className="far fa-user text-success pe-2" /> Update Self
                                  Employed User
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="card-body profile">
                            <div className="row g-3 align-items-center mt-1 mb-4">
                              <div className="col-lg-12">
                                <div className="image-upload-container">
                                  <label htmlFor="image-upload" className="custom-file-input-label">
                                    {selectedImage ? (
                                      <img
                                        src={selectedImage || user}
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
                                        src={
                                          PersonalData?.profileImage
                                            ? PersonalData.profileImage
                                            : user
                                        }
                                        default
                                        image
                                        path
                                        alt="Default"
                                        className="image-preview"
                                        width="100"
                                        height="100"
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
                                </div>
                              </div>

                              <div className="col-md-4 col-lg-4 col-xl-4">
                                <div className="mb-3">
                                  <Label>
                                    Last Name <span className="text-danger">*</span>
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
                                </div>
                              </div>

                              <div className="col-md-4 col-lg-4 col-xl-4">
                                <div className="mb-3">
                                  <Label>Email</Label>
                                  <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder=""
                                    v
                                    value={formData.emailId}
                                    onChange={handleInputChange}
                                    name="emailId"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="row mt-4">
                              <div className="col-md-4 col-lg-4 col-xl-4">
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
                                      {' '}
                                      <i className="far fa-save pe-1"></i> Save
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => navigate(-1)}
                                  type="button"
                                  className="btn btn-light border px-4"
                                >
                                  <i className="fas fa-times"></i> Cancel
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

              {/* End Main Content */}
            </div>
          </div>
        </div>
      </div>
      {/* End Log In page */}
    </>
  );
};
export default UpdateSelfUser;
