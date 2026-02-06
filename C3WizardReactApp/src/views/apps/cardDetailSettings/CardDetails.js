import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Table, Spinner, Modal, ModalBody, Button, ModalHeader, ModalFooter } from 'reactstrap';
import { Helmet } from 'react-helmet';
import * as Icon from 'react-feather';

import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaRegCreditCard } from 'react-icons/fa';
import Loader from '../../../layouts/loader/Loader';
import Logo from '../../../assets/images/logo-w.png';
import {
  getCardDetail,
  upDatecardDetails,
  deleteCardDetails,
} from '../../../store/apps/auth/AuthSlice';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';

const CardDetails = () => {
  const [isDelete, setIsDelete] = useState(false);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editableCard, setEditableCard] = useState({});
  const { message, type } = useSelector((state) => state.messageReducer);
  const { CardData, loading } = useSelector((state) => state.authSlice);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const hasCard = CardData && Object.values(CardData).some((value) => value !== '');
  const dispatch = useDispatch();
  //   const userId = localStorage.getItem('userID');
  const userId = parseInt(localStorage.getItem('userID'), 10); // parse to number

  const getCardType = (number) => {
    if (!number) return 'unknown';
    const cleaned = number.replace(/\D/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';
    return 'unknown';
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    // Keep last 4 digits visible
    const visibleDigits = cardNumber.slice(-4);
    // Mask all other digits with 'xxxx'
    const maskedPart = cardNumber.slice(0, -4).replace(/\d/g, 'x');
    // Format with spaces every 4 characters
    const formatted = (maskedPart + visibleDigits).replace(/(.{4})/g, '$1 ').trim();
    return formatted;
  };

  const getCardIcon = (cardType) => {
    switch (cardType) {
      case 'visa':
        return <FaCcVisa size={40} color="#1a1f71" />;
      case 'mastercard':
        return <FaCcMastercard size={40} color="#eb001b" />;
      case 'amex':
        return <FaCcAmex size={40} color="#2e77bc" />;
      case 'discover':
        return <FaCcDiscover size={40} color="#86b8cf" />;
      default:
        return <FaRegCreditCard size={40} />;
    }
  };

  useEffect(() => {
    if (userId) {
      dispatch(getCardDetail(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (message) {
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      }
      dispatch(setMessage({ message: '', type: '' }));
    }
  }, [message, type, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const handleEdit = () => {
    setEditMode(true);
    setEditableCard({ ...CardData });
    setErrors({});
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditableCard({});
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableCard((prev) => ({ ...prev, [name]: value }));

    if (value.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateFields = () => {
    const newErrors = {};

    if (!editableCard.cardHolderName?.trim()) {
      newErrors.cardHolderName = 'Card Holder Name is required';
    }

    if (!editableCard.cardNumber?.trim()) {
      newErrors.cardNumber = 'Card Number is required';
    } else if (!/^\d{16}$/.test(editableCard.cardNumber)) {
      newErrors.cardNumber = 'Card Number must be exactly 16 digits';
    }

    if (!editableCard.expirationYear?.trim()) {
      newErrors.expirationYear = 'Expiration Date is required';
    } else if (!/^(0[1-9]|1[0-2])\/20\d{2}$/.test(editableCard.expirationYear)) {
      newErrors.expirationYear = 'Enter valid expiration (MM/YYYY)';
    }

    // Add more validations as needed...

    setErrors(newErrors); // update state if you're showing field errors

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (!validateFields()) return;

    const cardData = {
      ...editableCard,
      userId,
      mode: 1,
      cardtype: editableCard.paymentMethod || editableCard.cardtype || '',
    };

    setIsUpdating(true);

    dispatch(upDatecardDetails(cardData))
      .unwrap()
      .then(() => {
        dispatch(getCardDetail(userId));
        setEditMode(false);
      })
      .catch(() => {
        // toast.error('Failed to update card details.');
      })
      .finally(() => {
        setIsUpdating(false); // Stop loading
      });
  };

  // const handleDelete = () => {
  //   setIsDelete(true);

  //   const cardData = {
  //     userId,
  //     cardtype: '',
  //     CardNumber: '',
  //     SecurityCode: '',
  //     ExpirationYear: '',
  //     cardHolderName: '',
  //   };

  //   dispatch(deleteCardDetails(cardData))
  //     .unwrap()
  //     .then(() => {
  //       dispatch(getCardDetail(userId));
  //       toast.success(' Card details deleted successfully');
  //       setEditMode(false);
  //     })
  //     .catch(() => {
  //       // toast.error('Failed to update card details.');
  //     })
  //     .finally(() => {
  //       setIsDelete(false); // Stop loading
  //     });
  // };

  const handleDelete = () => {
    setConfirmModal(true); // Show confirmation modal first
  };

  const confirmDelete = () => {
    setIsDelete(true);
    setConfirmModal(false); // Close the modal

    const cardData = {
      userId,
      cardtype: '',
      CardNumber: '',
      SecurityCode: '',
      ExpirationYear: '',
      cardHolderName: '',
      mode: 0,
    };

    dispatch(deleteCardDetails(cardData))
      .unwrap()
      .then(() => {
        dispatch(getCardDetail(userId));
        toast.success('Card details deleted successfully');
        setEditMode(false);
      })
      .catch(() => {
        // toast.error('Failed to update card details.');
      })
      .finally(() => {
        setIsDelete(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>Card Detail - C3 Wizard</title>
      </Helmet>

      <>
        <div className="home-center">
          <div className="home-desc-center">
            <div className="container">
              <div className="home-btn1 hv-100">
                <div className="row w-100 mt-4">
                  <div
                    className={`mx-auto ${
                      editMode ? 'col-md-10 col-lg-10 col-xl-10' : 'col-md-9 col-lg-9 col-xl-9'
                    }`}
                  >
                    <div className="card">
                      <div className="card-body pb-lg-5">
                        <div className="px-2">
                          <div className="text-center">
                            <h2 className="text-success mb-3 mt-3 f-500">Card Detail</h2>
                          </div>
                          <div className="row w-100">
                            <div className="col-md-12 col-lg-12 col-xl-12 mx-auto">
                              <Table responsive>
                                <thead>
                                  <tr>
                                    <th style={{ minWidth: '120px' }}>Card Type</th>
                                    <th>Card Holder Name</th>
                                    <th>Card Number</th>
                                    <th>Card Expiry</th>
                                    <th style={editMode ? { minWidth: '200px' } : {}}>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {hasCard && CardData && CardData.cardNumber ? (
                                    <tr>
                                      <td>
                                        <span
                                          style={
                                            editMode
                                              ? { position: 'relative', top: '-10px' }
                                              : undefined
                                          }
                                        >
                                          {editableCard.paymentMethod || CardData.paymentMethod}
                                          &nbsp; &nbsp;
                                          {getCardIcon(
                                            getCardType(
                                              editMode
                                                ? editableCard.cardNumber
                                                : CardData.cardNumber,
                                            ),
                                          )}
                                        </span>
                                      </td>
                                      <td>
                                        {editMode ? (
                                          <>
                                            <input
                                              type="text"
                                              name="cardHolderName"
                                              value={editableCard.cardHolderName}
                                              onChange={handleChange}
                                              className="form-control"
                                            />
                                            <div style={{ minHeight: '20px' }}>
                                              {errors.cardHolderName && (
                                                <div className="text-danger">
                                                  {errors.cardHolderName}
                                                </div>
                                              )}
                                            </div>
                                          </>
                                        ) : (
                                          CardData.cardHolderName
                                        )}
                                      </td>
                                      <td>
                                        {editMode ? (
                                          <>
                                            <input
                                              type="text"
                                              name="cardNumber"
                                              value={editableCard.cardNumber}
                                              onChange={handleChange}
                                              className="form-control"
                                            />
                                            <div style={{ minHeight: '20px' }}>
                                              {errors.cardNumber && (
                                                <div className="text-danger">
                                                  {errors.cardNumber}
                                                </div>
                                              )}
                                            </div>
                                          </>
                                        ) : (
                                          // CardData.cardNumber
                                          maskCardNumber(CardData.cardNumber)
                                        )}
                                      </td>
                                      <td>
                                        {editMode ? (
                                          <>
                                            <input
                                              type="text"
                                              name="expirationYear"
                                              value={editableCard.expirationYear}
                                              onChange={handleChange}
                                              className="form-control"
                                            />
                                            <div style={{ minHeight: '20px' }}>
                                              {errors.expirationYear && (
                                                <div className="text-danger">
                                                  {errors.expirationYear}
                                                </div>
                                              )}
                                            </div>
                                          </>
                                        ) : (
                                          CardData.expirationYear
                                        )}
                                      </td>
                                      <td>
                                        {editMode ? (
                                          <>
                                            <button
                                              type="button"
                                              className="btn bg-success text-white me-1"
                                              onClick={handleUpdate}
                                              disabled={isUpdating} // disable button during update
                                              style={{ marginBottom: '20px' }}
                                            >
                                              {isUpdating ? (
                                                <>
                                                  <Spinner size="sm" />
                                                  Updating...
                                                </>
                                              ) : (
                                                'Update'
                                              )}
                                            </button>

                                            <button
                                              type="button"
                                              className="btn-light btn"
                                              onClick={handleCancel}
                                              style={{ marginBottom: '20px' }}
                                            >
                                              Close
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button
                                              type="button"
                                              className="badge bg-soft-success text-success me-1"
                                              onClick={handleEdit}
                                            >
                                              <Icon.Edit size={20} />
                                            </button>
                                            <button
                                              type="button"
                                              className="badge bg-soft-danger text-danger"
                                              onClick={handleDelete}
                                            >
                                              {isDelete ? (
                                                <Spinner size="sm" />
                                              ) : (
                                                <Icon.Trash size={20} />
                                              )}
                                            </button>
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                  ) : (
                                    <tr>
                                      <td colSpan="6" className="text-center">
                                        No Card details
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </Table>
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

      <Modal isOpen={confirmModal} toggle={() => setConfirmModal(false)}>
        <ModalHeader toggle={() => setConfirmModal(false)}>Confirm Deletion</ModalHeader>
        <ModalBody>Are you sure you want to remove this card?</ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={() => setConfirmModal(false)}>
            Cancel
          </Button>
          <Button className="btn-success" onClick={confirmDelete} disabled={isDelete}>
            {isDelete ? (
              <>
                <Spinner /> Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CardDetails;
