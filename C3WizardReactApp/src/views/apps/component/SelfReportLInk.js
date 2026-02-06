import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Spinner } from 'reactstrap';
import http from '../../../baseUrl/HttpCommon';

const SelfC3DownloadLink = ({ month, year, sec3Id, children, disabled }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handlePreview = async (e) => {
    e.preventDefault();
    if (disabled) return;

    try {
      setLoading(true);
      const response = await http.get('/SelfEmpContribution/DownloadSelfC3Pdf', {
        params: { month, year, sec3Id },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setModalOpen(true);
    } catch (error) {
      console.error('Failed to load preview:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <a
        href="#"
        onClick={handlePreview}
        className="badge bg-soft-primary text-primary f-18"
        title={disabled ? 'Preview not allowed' : 'Preview Self C3'}
        style={disabled ? { cursor: 'not-allowed', opacity: 0.5 } : { cursor: 'pointer' }}
      >
        {loading ? <Spinner size="sm" /> : children}
      </a>

      <Modal isOpen={modalOpen} toggle={toggleModal} size="xl" style={{ maxWidth: '90%' }}>
        <ModalHeader toggle={toggleModal}>Self Employee Report Preview</ModalHeader>
        <ModalBody style={{ height: '80vh' }}>
          {pdfUrl ? (
            // <iframe
            //   src={pdfUrl}
            //   title="Self C3 Preview"
            //   style={{
            //     width: '100%',
            //     height: '100%',
            //     transform: 'scale(0.8)',
            //     transformOrigin: 'top left',
            //   }}
            // />
            <iframe
              src={`${pdfUrl}#zoom=100`}
              title="Self Report PDF"
              width="100%"
              height="600px"
              style={{ border: 'none' }}
            />
          ) : (
            <p>Loading preview...</p>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

SelfC3DownloadLink.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  sec3Id: PropTypes.number.isRequired,
  children: PropTypes.node,
  disabled: PropTypes.bool,
};

SelfC3DownloadLink.defaultProps = {
  children: <i className="fas fa-eye" />,
  disabled: false,
};

export default SelfC3DownloadLink;
