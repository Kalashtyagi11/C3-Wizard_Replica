import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

// ✅ Use camelCase (no underscore)
const AdminCustomize = ({
  isOpen,
  toggle,
  title = 'Confirm Action',
  toggleValue,
  notes,
  setNotes,
  loading,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" style={{ maxWidth: '570px' }}>
      <ModalHeader toggle={toggle}>Confirm Action</ModalHeader>
      <ModalBody>
        {/* <Label>{title}</Label> */}
        <Label>
          <strong> Do you want to send this C3 back to the employer for modification?</strong>
          <div>
            Once sent, the employer will be able to make the necessary corrections and resubmit it.
          </div>
          <strong>Note: </strong> If any payments have already been made, the C3 cannot be returned
          for modification.
        </Label>

        <FormGroup>
          <Label for="notes">
            Notes <span className="text-danger">*</span>
          </Label>
          <textarea
            id="notes"
            name="notes"
            type="text"
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter reason here"
            rows={4}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" className="btn-light" onClick={toggle}>
          Cancel
        </Button>
        <Button color="primary" onClick={onConfirm} disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" /> Saving...
            </>
          ) : (
            <>
              <i className="far fa-save"></i> Save
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// ✅ PropTypes validation
AdminCustomize.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string,
  toggleValue: PropTypes.bool,
  notes: PropTypes.string.isRequired,
  setNotes: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
};

export default AdminCustomize;
