import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ConfirmationModal = ({ show, onClose, onConfirm, title, message, loading }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title || 'Confirm Action'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message || 'Are you sure you want to proceed?'}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" className="btn-light" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={loading}>
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Deleting...
            </>
          ) : (
            'Confirm'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired, // Must be a boolean
  onClose: PropTypes.func.isRequired, // Must be a function
  onConfirm: PropTypes.func.isRequired, // Must be a function
  title: PropTypes.string, // Optional string
  message: PropTypes.string, // Optional string
  loading: PropTypes.bool,
};

export default ConfirmationModal;
