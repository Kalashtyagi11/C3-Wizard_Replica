import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Button,
  Input,
  Spinner,
} from 'reactstrap';

const EmployeeImportModal = ({ isOpen, toggle, employeeList = [], onConfirm, loading }) => {
  const [selectedEmployees, setSelectedEmployees] = useState({});

  useEffect(() => {
    if (isOpen) {
      const initialState = {};
      employeeList.forEach((emp) => {
        if (emp.ssn !== undefined) {
          initialState[emp.ssn] = true; // ✅ check all by default
        }
      });
      setSelectedEmployees(initialState);
    }
  }, [isOpen, employeeList]);

  const handleCheckboxChange = (ssn) => {
    setSelectedEmployees((prev) => ({
      ...prev,
      [ssn]: !prev[ssn],
    }));
  };

  const handleConfirm = () => {
    console.log('Confirm button clicked, loading:', loading);

    // Prevent multiple clicks while loading
    if (loading) {
      console.log('Button is disabled, ignoring click');
      return;
    }

    // const unselected = employeeList.filter((emp) => selectedEmployees[emp.ssn] === false);
    const unselectedSSNs = employeeList
      .filter((emp) => selectedEmployees[emp.ssn] === false)
      .map((emp) => emp.ssn);
    console.log('Unchecked SSNs:', unselectedSSNs);

    if (unselectedSSNs.length === employeeList.length) {
      toast.error('Please select at least one employee');
      return;
    }

    console.log('Calling onConfirm with:', unselectedSSNs);
    // Call onConfirm and let the parent handle the modal state
    onConfirm(unselectedSSNs); // ⬅️ send only SSN list as array
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>New Employees Detected - Add to Payroll?</ModalHeader>
      <ModalBody style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <Table bordered responsive>
          <thead>
            <tr>
              <th>Select</th>
              <th>SSN</th>
              <th>Employee</th>
              <th>Department</th>
              {/* <th>Address Details</th> */}
              <th>Salary</th>
              <th>Pay Period</th>
              <th>Commencement Date</th>
              <th>Termination Date</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.map((emp, index) => (
              <tr key={index}>
                <td>
                  <Input
                    type="checkbox"
                    checked={selectedEmployees[emp.ssn] || false}
                    onChange={() => handleCheckboxChange(emp.ssn)}
                  />
                </td>
                <td>{emp.ssn}</td>
                <td>{emp.employeeName ?? 'N/A'}</td>
                <td>{emp.department ?? 'N/A'}</td>
                {/* <td>{emp.wageS1}</td> */}
                <td>{Number(emp.empSalary || 0).toFixed(2)}</td>

                <td>{emp.payFreq}</td>
                <td>{emp.date_Joining ?? 'N/A'}</td>
                <td>{emp.date_terminated ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleConfirm} disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" /> Loading...
            </>
          ) : (
            'Yes'
          )}
        </Button>
        <Button color="secondary" className="btn-light" onClick={toggle}>
          Skip
        </Button>
      </ModalFooter>
    </Modal>
  );
};

EmployeeImportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  employeeList: PropTypes.arrayOf(
    PropTypes.shape({
      ssn: PropTypes.string.isRequired,
      employeeName: PropTypes.string.isRequired,
      department: PropTypes.string,
      empSalary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      payFreq: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date_Joining: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date_terminated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      // wageS5: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default EmployeeImportModal;
