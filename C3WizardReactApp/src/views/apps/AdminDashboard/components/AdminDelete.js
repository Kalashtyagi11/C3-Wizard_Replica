import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "reactstrap";

const DeleteModal = ({ isOpen, toggle, onConfirm, title, message, loadingDelete }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} >
      <ModalHeader toggle={toggle}>{title || "Confirm Delete"}</ModalHeader>
      <ModalBody>{message || "Are you sure you want to delete this item?"}</ModalBody>
      <ModalFooter>
        <Button color="secondary" className="btn-light" onClick={toggle} disabled={loadingDelete}>
          Cancel
        </Button>
        <Button color="primary" onClick={onConfirm} disabled={loadingDelete}>
          {loadingDelete ? (
            <>
              <Spinner size="sm" className="me-2" /> Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  loadingDelete: PropTypes.bool
};

export default DeleteModal;
