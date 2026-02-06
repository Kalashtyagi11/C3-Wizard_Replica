import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'reactstrap';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import axios from 'axios';

import http from '../../../baseUrl/HttpCommon';

const EmployeeDownloadButton = ({ buttonLabel, fileName, employeeType }) => {
  const [exportLoading, setExportLoading] = useState(false);
  const CompanyId = localStorage.getItem('companyId');

  const handleDownload = async () => {
    setExportLoading(true);
    try {
      const response = await http.get('/C3/GetEmployeesOrDirector', {
        params: {
          Employeetype: false, // false for employee, true for director
          empId: CompanyId,
        },
      });

      const jsonData = response.data?.data;

      if (!Array.isArray(jsonData)) {
        throw new Error('Invalid data format');
      }

      if (jsonData.length === 0) {
        toast.error('No employee data found to export.');
        return;
      }

      // Convert JSON to worksheet
      const worksheet = XLSX.utils.json_to_sheet(jsonData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      const fileBlob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(fileBlob, fileName);
    } catch (error) {
      console.error('Excel generation failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <Button
      className="btn btn-success waves-effect waves-light h-50"
      type="button"
      disabled={exportLoading}
      onClick={handleDownload}
    >
      {exportLoading ? (
        <>
          <Spinner size="sm" /> Downloading...
        </>
      ) : (
        <>
          <i className="fas fa-upload pe-1"></i>
          {buttonLabel}
        </>
      )}
    </Button>
  );
};

EmployeeDownloadButton.propTypes = {
  buttonLabel: PropTypes.string,
  fileName: PropTypes.string,
  employeeType: PropTypes.bool, // false = employee, true = director
};

EmployeeDownloadButton.defaultProps = {
  buttonLabel: 'Export Excel',
  fileName: 'C3_Employees.xlsx',
  employeeType: false,
};

export default EmployeeDownloadButton;
