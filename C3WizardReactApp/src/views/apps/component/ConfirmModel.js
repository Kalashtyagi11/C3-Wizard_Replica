import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onCancel}>
      <ModalHeader toggle={onCancel}>{title}</ModalHeader>
      <ModalBody>{message}</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button className="btn-light" color="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
};

ConfirmModal.defaultProps = {
  title: 'Action Confirm ',
  message: 'Are you sure you want to cancel payroll generation? All unsaved data will be lost.',
  confirmLabel: 'Yes',
  cancelLabel: 'No',
};

export default ConfirmModal;
