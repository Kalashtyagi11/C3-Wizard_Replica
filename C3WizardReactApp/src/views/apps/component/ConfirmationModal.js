import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const ConfirmationModal = ({
  show = false,
  title = 'Confirmation',
  message = '',
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal isOpen={show} toggle={onCancel}>
      <ModalHeader toggle={onCancel}>{title}</ModalHeader>

      <ModalBody>
        <p>{message}</p>
      </ModalBody>

      <ModalFooter>
        <Button className="btn-light" color="secondary" onClick={onCancel}>
          No
        </Button>
        <Button color="primary" onClick={onConfirm}>
          Yes
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationModal;
