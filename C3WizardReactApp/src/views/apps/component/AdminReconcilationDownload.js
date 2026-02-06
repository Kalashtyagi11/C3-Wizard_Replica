import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'reactstrap';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import axios from 'axios';

import http from '../../../baseUrl/HttpCommon';

const AdminReconcilationDownload = ({
  buttonLabel,
  fileName,
  reconciledOption,
  cardHolderOption,
}) => {
  const [exportLoading, setExportLoading] = useState(false);

  const handleDownload = async () => {
    setExportLoading(true);
    try {
      const response = await http.get(
        '/Payment/GetReconciliationDataCyber',
        {},
        {
          params: {
            pageNumber: null,
            pageSize: null,
            status: reconciledOption,
            cardHolderName: cardHolderOption,
          },
        },
      );

      const jsonData = response.data?.data?.records;

      if (!Array.isArray(jsonData)) {
        throw new Error('Invalid data format');
      }

      if (jsonData.length === 0) {
        toast.error('No employee data found to export.');
        return;
      }

      const filteredData = jsonData.map((item) => ({
        PaymentTransactionID: item.PaymentGatewayTransactionID,
        TransactionDate: item.TransactionDate,
        PaymentAmount: item.PaymentAmount,
        PaymentStatus: item.PaymentStatus,
        ReconciledByName: item.ReconciledByName,
        ReconciledByDate: item.ReconciledDate,
        Notes: item.Notes,
        // Amount: item.mobile,
      }));

      // Convert JSON to worksheet
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
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

AdminReconcilationDownload.propTypes = {
  buttonLabel: PropTypes.string,
  fileName: PropTypes.string,
  reconciledOption: PropTypes.bool, // false = employee, true = director
  cardHolderOption: PropTypes.string,
};

AdminReconcilationDownload.defaultProps = {
  buttonLabel: 'Export Excel',
  fileName: 'Reconcilation_History.xlsx',
  // employeeType: false,
};

export default AdminReconcilationDownload;
