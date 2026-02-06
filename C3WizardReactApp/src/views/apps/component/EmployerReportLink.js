import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Spinner } from 'reactstrap';
import PropTypes from 'prop-types';
import http from '../../../baseUrl/HttpCommon';

const EmployeeC3DownloadLink = ({ monthName, year, companyId, c3HeaderId, children, disabled }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handlePreview = async (e) => {
    e.preventDefault();

    if (disabled) return;

    setIsLoading(true);
    setPdfUrl(null);
    setIsModalOpen(true); // Show modal immediately

    try {
      const response = await http.get('/C3/C3Report/DownloadPdf', {
        params: {
          monthName,
          year,
          companyId,
          c3HeaderId,
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      setPdfUrl(fileURL);
    } catch (error) {
      console.error('Preview failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {disabled ? (
        <span
          className="badge bg-soft-primary text-primary f-18"
          title="Preview not allowed"
          style={{ cursor: 'not-allowed', opacity: 0.4 }}
        >
          {children}
        </span>
      ) : (
        <a
          href="#"
          onClick={handlePreview}
          className="badge bg-soft-primary text-primary f-18"
          title="Preview C3 PDF"
          style={{ padding: '5px 11px', marginTop: '12px', marginLeft: '10px' }}
        >
          {isLoading ? <Spinner size="sm" color="primary" style={{ marginRight: 5 }} /> : children}
        </a>
      )}

      <Modal isOpen={isModalOpen} toggle={toggleModal} size="xl">
        <ModalHeader toggle={toggleModal}>C3 Report Preview</ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
              <p className="mt-2">Loading PDF...</p>
            </div>
          ) : pdfUrl ? (
            // <iframe
            //   src={pdfUrl}
            //   title="C3 Report PDF"
            //   width="100%"
            //   height="600px"
            //   style={{ border: 'none' }}
            // />
            <iframe
              src={`${pdfUrl}#zoom=80`}
              title="C3 Report PDF"
              width="100%"
              height="600px"
              style={{ border: 'none' }}
            />
          ) : (
            <p className="text-danger">Failed to load PDF preview.</p>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

EmployeeC3DownloadLink.propTypes = {
  monthName: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  companyId: PropTypes.number.isRequired,
  c3HeaderId: PropTypes.number.isRequired,
  children: PropTypes.node,
  disabled: PropTypes.bool,
};

EmployeeC3DownloadLink.defaultProps = {
  children: <i className="fas fa-eye" />,
  disabled: false,
};

export default EmployeeC3DownloadLink;
