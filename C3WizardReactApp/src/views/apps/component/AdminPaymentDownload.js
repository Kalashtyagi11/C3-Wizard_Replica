import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'reactstrap';

import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import axios from 'axios';
import http from '../../../baseUrl/HttpCommon';

const AdminPaymentDownload = ({
  buttonLabel,
  fileName,
  employeeType,
  selectedStatus,
  selectedCompanyId,
  selectedUserId,
  selectedType,
}) => {
  const [exportLoading, setExportLoading] = useState(false);

  const handleDownload = async () => {
    setExportLoading(true);
    try {
      const response = await http.post(
        '/Payment/AdminTranactionHistory',
        {},
        {
          params: {
            PaymentStatus: selectedStatus,
            FromDate: '',
            ToDate: '',
            CompanyId: selectedCompanyId,
            UserId: selectedUserId,
            types: selectedType || 'SSB',
          },
        },
      );

      const jsonData = response.data?.data?.transactionList?.records;

      if (!Array.isArray(jsonData)) {
        throw new Error('Invalid data format');
      }

      if (jsonData.length === 0) {
        toast.error('No employee data found to export.');
        return;
      }

      const filteredData = jsonData.map((item) => ({
        Month: item.period_Month,
        Year: item.period_year,
        Wages: item.totaL_WAGES,
        SocialSecurity: item.totalsscontributions,
        Levy: item.totallevyeeemployee,
        FinesandPenalties: item.totalsspenalty,
        Severance: item.totalservayance,
        CreationDate: item.insert_Datetimeinfo,
        Schedule: item.schedule_NO,
        PaymentAmount: item.payDetails?.[0]?.paymentAmount ?? '',
        TransactionID: item.payDetails?.[0]?.transactionID ?? '',
        TransactionDate: item.payDetails?.[0]?.transactionDate ?? '',
        TransactionStatus: item.payDetails?.[0]?.transactionStatus ?? '',
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

AdminPaymentDownload.propTypes = {
  buttonLabel: PropTypes.string,
  fileName: PropTypes.string,
  employeeType: PropTypes.bool, // false = employee, true = director
  selectedStatus: PropTypes.string,
  selectedCompanyId: PropTypes.string,
  selectedUserId: PropTypes.string,
  selectedType: PropTypes.string,
};

AdminPaymentDownload.defaultProps = {
  buttonLabel: 'Export Excel',
  fileName: 'Payment_History.xlsx',
  employeeType: false,
};

export default AdminPaymentDownload;
