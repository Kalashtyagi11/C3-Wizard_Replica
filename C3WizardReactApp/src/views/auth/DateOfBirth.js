// src/pages/UserFormPage.js
import React, { useState, useRef } from 'react';
import InputMask from 'react-input-mask';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const DateOfBirth = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    // Group 1
    day1: '',
    month1: '',
    year1: '',
    // Group 2
    day2: '',
    month2: '',
    year2: '',
    // Group 3
    day3: '',
    month3: '',
    year3: '',
    // Group 4
    day4: '',
    month4: '',
    year4: '',
    // Datepicker values
    dob1: null,
    dob2: null,
  });

  const dayRef2 = useRef(null);
  const monthRef2 = useRef(null);
  const yearRef2 = useRef(null);
  const dayRef3 = useRef(null);
  const monthRef3 = useRef(null);
  const yearRef3 = useRef(null);

  // Month dropdown (MMM) for group 4
  const [isMonth4DropdownOpen, setIsMonth4DropdownOpen] = useState(false);
  const MONTHS_MMM = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const handleSubmit = () => {
    // Build dob1 from group 1 inputs if needed
    let { dob1 } = formData;
    if (!dob1 && formData.day1 && formData.month1 && formData.year1) {
      const d = moment(`${formData.year1}-${formData.month1}-${formData.day1}`, 'YYYY-MM-DD', true);
      if (d.isValid()) dob1 = d.toDate();
    }

    // Build dob2 from group 2 (month could be MMM from picker)
    let { dob2 } = formData;
    if (!dob2 && formData.day2 && formData.month2 && formData.year2) {
      const month2Num = moment(formData.month2, ['MM', 'MMM']).format('MM');
      const d = moment(`${formData.year2}-${month2Num}-${formData.day2}`, 'YYYY-MM-DD', true);
      if (d.isValid()) dob2 = d.toDate();
    }

    // Build dob3 from group 3 manual inputs
    let dob3 = null;
    if (formData.day3 && formData.month3 && formData.year3) {
      const d = moment(`${formData.year3}-${formData.month3}-${formData.day3}`, 'YYYY-MM-DD', true);
      if (d.isValid()) dob3 = d.toDate();
    }

    // Build dob4 from group 4 manual inputs
    let dob4 = null;
    if (formData.day4 && formData.month4 && formData.year4) {
      const d = moment(`${formData.year4}-${formData.month4}-${formData.day4}`, 'YYYY-MM-DD', true);
      if (d.isValid()) dob4 = d.toDate();
    }

    const formattedData = {
      ...formData,
      dob1: dob1 ? moment(dob1).format('DD-MMM-YYYY') : null,
      dob2: dob2 ? moment(dob2).format('DD-MMM-YYYY') : null,
      dob3: dob3 ? moment(dob3).format('DD-MMM-YYYY') : null,
      dob4: dob4 ? moment(dob4).format('DD-MMM-YYYY') : null,
    };

    console.log('Form submitted:', formattedData);
    alert('Form submitted successfully! Check console for data.');
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      day1: '',
      month1: '',
      year1: '',
      day2: '',
      month2: '',
      year2: '',
      day3: '',
      month3: '',
      year3: '',
      day4: '',
      month4: '',
      year4: '',
      dob1: null,
      dob2: null,
    });
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={6} md={10}>
          <Card>
            <CardHeader className="bg-primary text-white">
              <h4 className="mb-0">User Form</h4>
            </CardHeader>
            <CardBody className="p-4">
              {/* Datepicker 1 (DD/MM/YYYY) */}
              <FormGroup>
                <Label>Applicant DOB (DD/MM/YYYY - 1)</Label>
                <DatePicker
                  selected={formData.dob1}
                  onChange={(date) => {
                    if (date) {
                      setFormData({
                        ...formData,
                        dob1: date,
                        day1: moment(date).format('DD'),
                        month1: moment(date).format('MM'),
                        year1: moment(date).format('YYYY'),
                      });
                    } else {
                      setFormData({ ...formData, dob1: null, day1: '', month1: '', year1: '' });
                    }
                  }}
                  customInput={
                    <InputMask
                      mask="99/99/9999"
                      placeholder="DD/MM/YYYY"
                      value={formData.dob1 ? moment(formData.dob1).format('DD/MM/YYYY') : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.length === 10) {
                          const [day, month, year] = val.split('/');
                          if (year.startsWith('0')) return; // 🚫 Block years starting with 0
                          const date = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').toDate();
                          if (date) {
                            setFormData({
                              ...formData,
                              dob1: date,
                              day1: day,
                              month1: month,
                              year1: year,
                            });
                          }
                        } else {
                          setFormData({ ...formData, dob1: null, day1: '', month1: '', year1: '' });
                        }
                      }}
                      className="form-control"
                    />
                  }
                  dateFormat="dd/MM/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  isClearable
                />
              </FormGroup>

              {/* Date Inputs - Group 3 */}
              <FormGroup>
                <Label>Applicant DOB (Enter Input DD MM YYYY - 2)</Label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Input
                    type="text"
                    name="day3"
                    value={formData.day3}
                    maxLength={2}
                    inputMode="numeric"
                    placeholder="DD"
                    style={{ width: '70px' }}
                    innerRef={dayRef2}
                    onChange={(e) => {
                      let input = e.target.value.replace(/\D/g, '');
                      if (input.length === 1 && parseInt(input, 10) > 3) input = `0${input}`;
                      if (input.length === 2) {
                        let num = parseInt(input, 10);
                        if (num < 1) num = 1;
                        else if (num > 31) num = 31;
                        input = num.toString().padStart(2, '0');
                        setTimeout(() => monthRef2.current && monthRef2.current.focus(), 0);
                      }
                      setFormData((prev) => ({ ...prev, day3: input }));
                    }}
                    onBlur={(e) => {
                      const v = e.target.value.replace(/\D/g, '');
                      if (v.length === 1) {
                        let n = parseInt(v, 10);
                        if (Number.isNaN(n) || n < 1) n = 1;
                        if (n > 31) n = 31;
                        setFormData((prev) => ({ ...prev, day3: String(n).padStart(2, '0') }));
                      }
                    }}
                  />
                  <Input
                    type="text"
                    name="month3"
                    value={formData.month3}
                    maxLength={2}
                    inputMode="numeric"
                    placeholder="MM"
                    style={{ width: '70px' }}
                    innerRef={monthRef2}
                    onChange={(e) => {
                      let input = e.target.value.replace(/\D/g, '');
                      if (input.length === 1 && parseInt(input, 10) > 1) input = `0${input}`;
                      if (input.length === 2) {
                        let num = parseInt(input, 10);
                        if (num < 1) num = 1;
                        else if (num > 12) num = 12;
                        input = num.toString().padStart(2, '0');
                        setTimeout(() => yearRef2.current && yearRef2.current.focus(), 0);
                      }
                      setFormData((prev) => ({ ...prev, month3: input }));
                    }}
                    onBlur={(e) => {
                      const v = e.target.value.replace(/\D/g, '');
                      if (v.length === 1) {
                        let n = parseInt(v, 10);
                        if (Number.isNaN(n) || n < 1) n = 1;
                        if (n > 12) n = 12;
                        setFormData((prev) => ({ ...prev, month3: String(n).padStart(2, '0') }));
                      }
                    }}
                  />
                  <Input
                    type="text"
                    name="year3"
                    value={formData.year3}
                    maxLength={4}
                    inputMode="numeric"
                    placeholder="YYYY"
                    style={{ width: '100px' }}
                    innerRef={yearRef2}
                    onChange={(e) => {
                      let input = e.target.value.replace(/\D/g, '');
                      if (input.startsWith('0')) input = input.replace(/^0+/, ''); // 🚫 No leading 0
                      setFormData((prev) => ({ ...prev, year3: input }));
                    }}
                    onKeyDown={(e) => {
                      const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'];
                      if (e.key === 'Backspace' && e.currentTarget.value.length === 0) {
                        setTimeout(() => monthRef2.current && monthRef2.current.focus(), 0);
                      }
                      if (!/^[0-9]$/.test(e.key) && !allowed.includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </FormGroup>

              {/* Date Inputs - Group 4 */}
              <FormGroup>
                <Label>Applicant DOB (Enter Input Month Select or Type DD MMM YYYY 3)</Label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Input
                    type="text"
                    name="day4"
                    value={formData.day4}
                    maxLength={2}
                    inputMode="numeric"
                    placeholder="DD"
                    style={{ width: '70px' }}
                    innerRef={dayRef3}
                    onChange={(e) => {
                      let input = e.target.value.replace(/\D/g, '');
                      if (input.length === 1 && parseInt(input, 10) > 3) input = `0${input}`;
                      if (input.length === 2) {
                        let num = parseInt(input, 10);
                        if (num < 1) num = 1;
                        else if (num > 31) num = 31;
                        input = num.toString().padStart(2, '0');
                        setTimeout(() => {
                          if (monthRef3.current) {
                            monthRef3.current.focus();
                            setIsMonth4DropdownOpen(true);
                          }
                        }, 0);
                      }
                      setFormData((prev) => ({ ...prev, day4: input }));
                    }}
                    onBlur={(e) => {
                      const v = e.target.value.replace(/\D/g, '');
                      if (v.length === 1) {
                        let n = parseInt(v, 10);
                        if (Number.isNaN(n) || n < 1) n = 1;
                        if (n > 31) n = 31;
                        setFormData((prev) => ({ ...prev, day4: String(n).padStart(2, '0') }));
                      }
                    }}
                  />
                  <div style={{ position: 'relative' }}>
                    <Input
                      type="text"
                      name="month4"
                      value={formData.month4}
                      maxLength={3}
                      inputMode="text"
                      placeholder="MMM"
                      style={{ width: '90px' }}
                      innerRef={monthRef3}
                      onFocus={() => setIsMonth4DropdownOpen(true)}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const letters = raw.replace(/[^a-zA-Z]/g, '').slice(0, 3);
                        setFormData((prev) => ({
                          ...prev,
                          month4: letters.charAt(0).toUpperCase() + letters.slice(1).toLowerCase(),
                        }));
                        setIsMonth4DropdownOpen(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && e.currentTarget.value.length === 0) {
                          setTimeout(() => dayRef3.current && dayRef3.current.focus(), 0);
                        }
                      }}
                    />
                    {isMonth4DropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 38,
                          left: 0,
                          background: '#fff',
                          border: '1px solid #ddd',
                          borderRadius: 4,
                          zIndex: 2000,
                          width: 120,
                        }}
                        onMouseLeave={() => setIsMonth4DropdownOpen(false)}
                      >
                        {MONTHS_MMM.map((m) => (
                          <div
                            key={m}
                            style={{ padding: '6px 10px', cursor: 'pointer' }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setFormData((prev) => ({ ...prev, month4: m }));
                              setIsMonth4DropdownOpen(false);
                              setTimeout(() => yearRef3.current && yearRef3.current.focus(), 0);
                            }}
                          >
                            {m}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Input
                    type="text"
                    name="year4"
                    value={formData.year4}
                    maxLength={4}
                    inputMode="numeric"
                    placeholder="YYYY"
                    style={{ width: '100px' }}
                    innerRef={yearRef3}
                    onChange={(e) => {
                      let input = e.target.value.replace(/\D/g, '');
                      if (input.startsWith('0')) input = input.replace(/^0+/, ''); // 🚫 No leading 0
                      setFormData((prev) => ({ ...prev, year4: input }));
                    }}
                    onKeyDown={(e) => {
                      const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'];
                      if (e.key === 'Backspace' && e.currentTarget.value.length === 0) {
                        setTimeout(() => monthRef3.current && monthRef3.current.focus(), 0);
                      }
                      if (!/^[0-9]$/.test(e.key) && !allowed.includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </FormGroup>

              {/* Datepicker 2 (DD/MMM/YYYY) */}
              <FormGroup>
                <Label>Applicant DOB (DD/MMM/YYYY - 4)</Label>
                <DatePicker
                  selected={formData.dob2}
                  onChange={(date) => {
                    if (date) {
                      setFormData({
                        ...formData,
                        dob2: date,
                        day2: moment(date).format('DD'),
                        month2: moment(date).format('MMM'),
                        year2: moment(date).format('YYYY'),
                      });
                    } else {
                      setFormData({ ...formData, dob2: null, day2: '', month2: '', year2: '' });
                    }
                  }}
                  customInput={
                    <InputMask
                      mask="99/aaa/9999"
                      maskChar={null}
                      placeholder="DD/MMM/YYYY"
                      value={formData.dob2 ? moment(formData.dob2).format('DD/MMM/YYYY') : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.length === 11) {
                          const [day, mon, year] = val.split('/');
                          if (year.startsWith('0')) return; // 🚫 Block years starting with 0
                          const monthNum = moment(mon, 'MMM').format('MM');
                          const date = moment(`${year}-${monthNum}-${day}`, 'YYYY-MM-DD').toDate();
                          if (date) {
                            setFormData({
                              ...formData,
                              dob2: date,
                              day2: day,
                              month2: mon,
                              year2: year,
                            });
                          }
                        } else {
                          setFormData({ ...formData, dob2: null, day2: '', month2: '', year2: '' });
                        }
                      }}
                      className="form-control"
                    />
                  }
                  dateFormat="dd/MMM/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  isClearable
                />
              </FormGroup>

              {/* Buttons */}
              <div className="d-flex gap-2 justify-content-end mt-4">
                <Button color="secondary" onClick={handleReset}>
                  Reset
                </Button>
                <Button color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DateOfBirth;
