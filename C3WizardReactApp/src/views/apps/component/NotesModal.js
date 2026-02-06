import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup } from 'reactstrap';

const NotesModal = ({ isOpen, toggle, modalContent }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} scrollable>
      <ModalHeader toggle={toggle}>Notes</ModalHeader>
      <ModalBody>
        <FormGroup>
          {Array.isArray(modalContent) && modalContent.length > 0 ? (
            modalContent.map((note, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '15px',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <div>
                  <strong>Date:</strong> {note.date}
                </div>
                <div>
                  <strong>User:</strong> {note.user}
                </div>
                <div>
                  <strong>Status:</strong> {note.statusChange}
                </div>
                <div>
                  <strong>Reason:</strong> {note.reason}
                </div>
              </div>
            ))
          ) : (
            <div>No notes found.</div>
          )}
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" className="btn-light" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

NotesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  modalContent: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      user: PropTypes.string,
      statusChange: PropTypes.string,
      reason: PropTypes.string,
    }),
  ),
};

export default NotesModal;
