import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const UnsavedPayGuard = ({ payData, hideToggle, children }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);

  const hasUnsavedData =
    payData.bonus.length > 0 || payData.holiday.length > 0 || hideToggle === false;

  // Intercept navigation clicks
  useEffect(() => {
    const handleClick = (e) => {
      if (!hasUnsavedData) return;

      let currentElement = e.target;

      while (currentElement && currentElement !== document.body) {
        const path =
          currentElement.getAttribute?.('data-path') || currentElement.getAttribute?.('href');

        if (path && !path.startsWith('#')) {
          e.preventDefault();
          setPendingPath(path);
          setShowModal(true);
          break;
        }

        currentElement = currentElement.parentElement;
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [hasUnsavedData]);

  const confirmLeave = () => {
    sessionStorage.removeItem('payData');
    setShowModal(false);
    if (pendingPath) {
      navigate(pendingPath);
    }
  };

  const cancelLeave = () => {
    setShowModal(false);
    setPendingPath(null);
  };

  return (
    <>
      {children}

      <Modal isOpen={showModal} toggle={cancelLeave}>
        <ModalHeader toggle={cancelLeave}>Unsaved Changes</ModalHeader>
        <ModalBody>
          {/* {payData.bonus.length > 0 && payData.holiday.length > 0 && (
            <>You have unsaved bonus and holiday data. Are you sure you want to leave this page?</>
          )}
          {payData.bonus.length > 0 && payData.holiday.length === 0 && (
            <>You have unsaved bonus data. Are you sure you want to leave this page?</>
          )}
          {payData.holiday.length > 0 && payData.bonus.length === 0 && (
            <>You have unsaved holiday data. Are you sure you want to leave this page?</>
          )} */}
          Your data will be discarded. Are you sure you want to exit this screen?
        </ModalBody>
        <ModalFooter>
          <Button className="btn-light" color="secondary" onClick={cancelLeave}>
            No
          </Button>
          <Button color="primary" onClick={confirmLeave}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

UnsavedPayGuard.propTypes = {
  payData: PropTypes.shape({
    bonus: PropTypes.array.isRequired,
    holiday: PropTypes.array.isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
  hideToggle: PropTypes.bool.isRequired,
};

export default UnsavedPayGuard;
