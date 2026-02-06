import React from 'react';
import PropTypes from 'prop-types'; // <-- import PropTypes
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Table } from 'reactstrap';

const CustomModal = ({
  isOpen,
  toggle,
  title,
  message,
  tableHeaders = [],
  tableData = [],
  showTable = false,
  onConfirm,
  confirmText = 'Yes',
  showClose = true,
  closeText = 'Close',
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="">
      <ModalHeader toggle={toggle}>{title}</ModalHeader>

      <ModalBody>
        {message && <Label>{message}</Label>}

        {/* {showTable && tableHeaders.length > 0 && (
          <div>
            <Table bordered responsive>
              <thead>
                <tr>
                  <th>Exception Type</th>
                  <th>Media File Value</th>
                  <th>As Per C3 Calculation</th>
                </tr>
              </thead>

              <tbody>
                {(Array.Array(tableData) ? tableData : []).map((item, index) => (
              
                  <tr key={index}>
                    {tableHeaders.map((head) => (
                      <td key={head}>{item[head]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )} */}
      </ModalBody>

      <ModalFooter>
        {showClose && (
          <Button className="btn-light" onClick={toggle}>
            {closeText}
          </Button>
        )}
        {/* {onConfirm && (
          <Button
            color="success"
            onClick={() => {
              toggle();
              onConfirm();
            }}
          >
            {confirmText}
          </Button>
        )} */}
      </ModalFooter>
    </Modal>
  );
};

// Add PropTypes validation
CustomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  tableHeaders: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.object),
  showTable: PropTypes.bool,
  onConfirm: PropTypes.func,
  confirmText: PropTypes.string,
  showClose: PropTypes.bool,
  closeText: PropTypes.string,
};

export default CustomModal;
