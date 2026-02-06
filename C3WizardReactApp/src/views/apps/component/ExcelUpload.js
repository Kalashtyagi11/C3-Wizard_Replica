import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Collapse,
  Row,
  Col,
  Button,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap';

const ExcelUpload = ({ isOpen, onUpload, onClose }) => {
  const [excelFile, setExcelFile] = useState(null);
  const [openAccordionItem, setOpenAccordionItem] = useState('');

  const toggle = (id) => {
    setOpenAccordionItem(openAccordionItem === id ? undefined : id);
  };

  // Upload handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!excelFile) return;
    onUpload(excelFile);
  };

  // Download EC3 template handler
  const handleDownloadTemplate = () => {
    const content = `HDR,000000,DD/MM/YYYY,0.0.0,DUMMY COMPANY NAME
1,1XXXX4,ALEXANDER,SABINA,,,,1,1,1,1,0,0,0,0,500.63,500.63,500.63,0.0,0,0,0,52.56,165.21
2,2XXXX5,ALLEN,CAMERON,,,,1,1,1,1,1,0,0,0,909.16,505.0,505.0,505.0,0,0,0,84.83,266.66
3,3XXXX6,ALLEN,LYDIA,,,,1,0,1,1,1,0,0,0,0.0,480.0,480.0,480.0,0,0,0,50.4,158.4
FTR,000000,DD/MM/YYYY,1500.0,165.0,68.0,27.0,15.0`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'EC3_Template.C3';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Collapse isOpen={isOpen} className="mt-3">
      <Card>
        <CardBody>
          <Row className="align-items-center">
            {/* Upload Section */}
            <Col md="7">
              <form
                className="d-flex flex-wrap align-items-center gap-2"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                <input
                  type="file"
                  accept=".C3"
                  onChange={(e) => setExcelFile(e.target.files[0])}
                  className="form-control"
                  required
                  style={{ maxWidth: '400px' }}
                />

                <Button
                  type="submit"
                  className="btn btn-success waves-effect waves-light"
                  style={{ height: '45px', minWidth: '140px' }}
                >
                  <i className="fas fa-upload pe-1"></i>
                  Upload C3 File
                </Button>
              </form>
            </Col>

            {/* Action Buttons */}
            <Col md="5" className="text-end">
              <Button
                type="button"
                className="btn btn-success waves-effect waves-light me-2"
                style={{ height: '45px', minWidth: '180px' }}
                onClick={handleDownloadTemplate}
              >
                <i className="fas fa-download pe-1"></i>
                Download Template
              </Button>

              <Button
                color="danger"
                className="btn-light"
                onClick={onClose}
                style={{ height: '45px', minWidth: '100px' }}
              >
                Close
              </Button>
            </Col>
          </Row>

          <hr />

          {/* Notes */}

          <Accordion open={openAccordionItem} toggle={toggle}>
            <AccordionItem>
              <AccordionHeader targetId="1">EC3 (Electronic C3) Guidelines</AccordionHeader>
              <AccordionBody accordionId="1" style={{ backgroundColor: '#FFF' }}>
                <div>
                  <strong>Note:</strong> Please ensure that the uploaded file strictly complies with
                  the EC3 (Electronic C3) file format and submission guidelines.
                  <ul className="mt-2">
                    <li>
                      Only <b>.C3</b> files are accepted. The file must be a <b>plain text</b> file
                      with
                      <b> comma-delimited fields</b>. Quoted values are not permitted.
                    </li>

                    <li>
                      Each line in the file must be terminated using
                      <b> CR/LF (Carriage Return + Line Feed)</b>.
                    </li>

                    <li>
                      The file name must follow the approved naming convention:
                      <b> Company Registration Number + Submission Period (MM)</b>, with a{' '}
                      <b>.C3</b>
                      extension.
                      <br />
                      <small>
                        Example: <b>10203007.C3</b> or <b>102030072002.C3</b>
                      </small>
                    </li>

                    <li>
                      The file must contain records in the following sequence only:
                      <b> HDR (Header)</b>, followed by <b>Employee Detail Records</b>, and ending
                      with a <b>FTR (Footer)</b>.
                    </li>

                    <li>
                      The <b>Header (HDR)</b> record must include the Company Registration Number,
                      submission Period in <b>01/MM/YYYY</b> format, file Version, and Company Name.
                    </li>

                    <li>
                      The submission period must always be represented as the
                      <b> first day of the month</b> (<b>01/MM/YYYY</b> format).
                    </li>

                    <li>
                      Each employee detail record must begin with a
                      <b> unique, sequential line number</b> (e.g., 001, 002, 003).
                    </li>

                    <li>
                      Employee <b>Social Security Numbers (SSN)</b> must be six (6) digits, and
                      employee names must exactly match those shown on the Social Security card
                      (Surname and First Name only).
                    </li>

                    <li>
                      Commencement and termination dates, where applicable, must be provided in
                      <b> DD/MM/YYYY</b> format.
                    </li>

                    <li>
                      Pay frequency values must be entered using the approved codes:
                      <b> 1</b> = Weekly,
                      <b> 2</b> = Bi-Weekly,
                      <b> 3</b> = Monthly,
                      <b> 4</b> = Twice per Month.
                    </li>

                    <li>
                      Weekly indicators (<b>WK1–WK5</b>) must contain <b>1</b> for weeks worked and
                      <b>0</b> for weeks not worked.
                    </li>

                    <li>
                      Holiday Pay (<b>HOLPAID</b>) and Bonus Pay (<b>BPAID</b>) indicators must be
                      set to <b>1</b> when applicable; otherwise, they must be set to <b>0</b>.
                    </li>

                    <li>
                      Holiday and bonus amounts must only be populated when their corresponding
                      indicators are set to <b>1</b>.
                    </li>

                    <li>
                      Salary and remuneration values must be entered in the
                      <b> PAY1–PAY5</b> fields as applicable.
                    </li>

                    <li>
                      The <b>LEVY</b> field must contain the employee Housing and Social Development
                      Levy only.
                    </li>

                    <li>
                      The <b>SOCSEC</b> field must contain the total Social Security contribution
                      for both the employer and the employee.
                    </li>

                    <li>
                      The <b>Footer (FTR)</b> record must include total wages, total Social Security
                      contributions, total levy, total severance, and the total number of employee
                      records submitted.
                    </li>

                    <li>
                      Footer totals must exactly reconcile with the sum of all employee detail
                      records.
                    </li>

                    <li>
                      A sample test file may be required for validation and approval prior to
                      regular electronic submission.
                    </li>

                    <li>
                      Files that do not strictly conform to the EC3 specifications will be
                      <b> rejected</b>.
                    </li>

                    <li>
                      Submission of an electronic EC3 file does <b>not</b> replace the requirement
                      to submit signed and printed copies where applicable.
                    </li>
                  </ul>
                </div>
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>
    </Collapse>
  );
};

ExcelUpload.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onUpload: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExcelUpload;
