import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import http from '../../../baseUrl/HttpCommon';

const NonWorkingDownloadLink = ({ month, year, companyId, c3HeaderId, children, disabled }) => {
  //   const handleDownload = async (e) => {
  //     e.preventDefault();

  //     try {
  //       const response = await http.get('/SelfEmpContribution/DownloadSelfC3Pdf', {
  //         params: { month, year, sec3Id },
  //         responseType: 'blob',
  //       });

  //       const fileURL = window.URL.createObjectURL(new Blob([response.data]));
  //       const fileLink = document.createElement('a');
  //       fileLink.href = fileURL;
  //       fileLink.setAttribute('download', `SelfC3Report_${month}-${year}.pdf`);
  //       document.body.appendChild(fileLink);
  //       fileLink.click();
  //       document.body.removeChild(fileLink);
  //     } catch (error) {
  //       console.error('Download failed:', error);
  //       alert('Failed to download the report.');
  //     }
  //   };

  const handleDownload = async (e) => {
    e.preventDefault();

    try {
      const response = await http.get('/NonDirector/C3Report/DownloadDirectorPdf', {
        params: {
          month,
          year,
          companyId,
          c3HeaderId,
        },
        responseType: 'blob',
      });

      const fileBlob = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(fileBlob);

      // Open in new tab for preview
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error('Preview failed:', error);
      // alert('Failed to preview the report.');
    }
  };

  if (disabled) {
    return (
      <a
        className="badge bg-soft-primary text-primary f-18"
        title="Preview not allowed"
        style={{ cursor: 'not-allowed', opacity: 0.4 }}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href="#"
      onClick={handleDownload}
      className="badge bg-soft-primary text-primary f-18"
      title="Download Self C3 PDF"
      style={{ padding: '8px' }}
    >
      {children}
    </a>
  );
};

NonWorkingDownloadLink.propTypes = {
  month: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  companyId: PropTypes.number.isRequired,
  c3HeaderId: PropTypes.number.isRequired,
  children: PropTypes.node,
  disabled: PropTypes.bool,
};

NonWorkingDownloadLink.defaultProps = {
  children: <i className="fas fa-eye" />,
  disabled: false,
};

export default NonWorkingDownloadLink;
