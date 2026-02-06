import * as Icon from 'react-feather';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Label } from 'reactstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  editPayrollDirector,
  ViewPayrollDirector,
} from '../../../store/apps/nonWorkingDirectory/NonWorkingDirectory';
import { clearMessage, setMessage } from '../../../store/apps/message/MessageSlice';

const EditDirectorPayroll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const CompanyId = localStorage.getItem('companyId');
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const { EditPayrollData } = useSelector((state) => state.nonWorkingDirectorySlice);
  const { message, type } = useSelector((state) => state.messageReducer);
  const [year, setYear] = useState(2025);
  const [MonthName, setMonthName] = useState('February');
  const [monthNum, setMonthNum] = useState(2);
  const [cmbPayPeriod, setCmbPayPeriod] = useState([{ key: 'Monthly', value: 'M' }]);
  const [directorExistContinue, setDirectorExistContinue] = useState(false);
  const [isPayPeriodChange, setIsPayPeriodChange] = useState(false);
  const [userID, setUserID] = useState('0');
  const [machineInfo, setMachineInfo] = useState('0');
  const [userName, setUserName] = useState('0');
  const [loading, setLoading] = useState(false);
  // const [checked, setChecked] = useState('');
  const [dataLoad, setDataLoad] = useState({});
  const location = useLocation();
  const { id: headerID } = location.state || {};
  const headID = headerID;
  const [payData, setPayData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [payload, setPayload] = useState({
    MonthName: 'February',
    monthNum: 2,
    companyId: CompanyId,
    year: 2025,
    cmbPayPeriod: [
      {
        key: 'Monthly',
        value: 'M',
      },
    ],
    directorExistContinue: false,
    userID: 0,
    MachineInfo: '0',
    User_Name: '0',
    h_Id: headerID,
    isPayPeriodChange: false,
    editDirPayrolList: {
      wageS1: 0,
      wageS2: 15,
      wageS3: 0,
      wageS4: 10,
      wageS5: 0,
      weeK1: true,
      weeK2: true,
      weeK3: false,
      weeK4: true,
      weeK5: true,
      remarks: '',
    },
  });
  //const [selectedRows, setSelectedRows] = useState([]);

  const [selectedRows, setSelectedRows] = useState(payData.map((item) => item.ssn));

  // Update selectData when loadEmployeeList changes
  useEffect(() => {
    if (payData.length > 0) {
      setSelectedRows(payData.map((item) => item.ssn));
    }
  }, [payData]);

  const handleCheckboxChange = (ssn) => {
    const newSelectedRows = [...selectedRows];

    if (newSelectedRows.includes(ssn)) {
      const index = newSelectedRows.indexOf(ssn);
      newSelectedRows.splice(index, 1);
    } else {
      newSelectedRows.push(ssn);
    }

    setSelectedRows(newSelectedRows);
  };

  // code-18--2-24

  useEffect(() => {
    // Map selected options to the required structure
    const mappedOptions = selectedOptions.map((option) => {
      switch (option) {
        case 'Weekly':
          return { key: 'Weekly', value: 'W' };
        case '2 Weekly':
          return { key: 'E2 Weekly', value: 'B' };
        case '2/ Monthly':
          return { key: '2 /Monthly', value: 'S' };
        case 'Monthly':
          return { key: 'Monthly', value: 'M' };
        default:
          return {
            key: 'All',
            value: 'All',
          };
      }
    });

    // Add the "All" option if no specific selections are made
    if (selectedOptions.length === 0) {
      mappedOptions.push({ key: 'All', value: 'All' });
    }

    setCmbPayPeriod(mappedOptions);
  }, [selectedOptions]);

  // Get unique pay periods dynamically

  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { id: 'checkbox-custom_01', label: 'Weekly' },
    { id: 'checkbox-custom_02', label: 'Monthly' },
    { id: 'checkbox-custom_03', label: '2 Weekly' },
    { id: 'checkbox-custom_04', label: '2/ Monthly' },
  ];
  useEffect(() => {
    setSelectedOptions(options.map((option) => option.label));
  }, []);

  const handleLabelClick = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleCheckAllChange = ({ target: { checked } }) => {
    if (checked) {
      setSelectedOptions(options.map((option) => option.label));
    } else {
      setSelectedOptions([]);
    }
  };

  const handleCheckBoxChange = ({ target: { checked, nextSibling } }) => {
    const value = nextSibling.textContent;
    if (checked) {
      setSelectedOptions((prevOptions) => [...prevOptions, value]);
    } else {
      setSelectedOptions((prevOptions) => prevOptions.filter((option) => option !== value));
    }
  };

  const getLabelText = () => {
    if (selectedOptions.length === 0) return 'Select Period';
    if (selectedOptions.length === options.length) return 'All';
    return selectedOptions.join(', ');
  };

  useEffect(() => {
    // Close dropdown if clicked outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // End

  function handleInputChange(ssn, field, value) {
    setPayData((prev) =>
      prev.map((item) => (item.ssn === ssn ? { ...item, [field]: value } : item)),
    );

    setPayload((prevPayload) => ({
      ...prevPayload,
      editDirPayrolList: {
        ...prevPayload.editDirPayrolList,
        [field]: value,
      },
    }));
  }

  const handleSubmit = () => {
    if (selectedRows.length === 0) {
      toggleModal();
      return; // Exit the function early if no rows are selected
    }
    setLoading(true);

    dispatch(editPayrollDirector({ payload }))
      .then(() => {
        setLoading(false);
        navigate('/apps/director/NwDirectorPayroll');
        dispatch(ViewPayrollDirector({ headerID, CompanyId }));
      })
      .catch((error) => {
        setLoading(false);
         console.error('Something went wrong:', error);
      });
  };

  const handleShow = () => {
    setShow(true);
  };

  const onCancel = () => {
    toggleModal();
  };

  const deleteNWDirectory = () => {
    toggleModal(); // Close the modal
  };

  const handleYearChange = (e) => setYear(Number(e.target.value));
  const handleMonthChange = (e) => setMonthName(Number(e.target.value));
  const handlePayPeriodChange = (e) => {
    const temp = {
      key: '',
      value: '',
    };
    const CmbPayPeriodTemp = [...cmbPayPeriod];
    if (e.target.value === 'M') {
      temp.key = 'Monthly';
      temp.value = 'M';
    } else if (e.target.value === 'W') {
      temp.key = 'Weekly';
      temp.value = 'W';
    } else {
      temp.key = 'All';
      temp.value = 'All';
    }

    CmbPayPeriodTemp.push(temp);
    setCmbPayPeriod(CmbPayPeriodTemp);
  };



  useEffect(() => {
    if (payData.length > 0) {
      const updatedPayload = {
        ...payload,
        editDirPayrolList: {
          wageS1: payData[0]?.wageS1 || 0,
          wageS2: payData[0]?.wageS2 || 0,
          wageS3: payData[0]?.wageS3 || 0,
          wageS4: payData[0]?.wageS4 || 0,
          wageS5: payData[0]?.wageS5 || 0,
          weeK1: payData[0]?.weeK1 || false,
          weeK2: payData[0]?.weeK2 || false,
          weeK3: payData[0]?.weeK3 || false,
          weeK4: payData[0]?.weeK4 || false,
          weeK5: payData[0]?.weeK5 || false,
          remarks: payData[0]?.remarks || '',
        },
      };
      setPayload(updatedPayload);
    }
  }, [payData]);

  useEffect(() => {
    const temp = { ...payload };
    temp.cmbPayPeriod = cmbPayPeriod;
    setPayload(temp);
  }, [cmbPayPeriod]);

  useEffect(() => {
    setPayData(EditPayrollData);
  }, [EditPayrollData]);

  useEffect(() => {
    if (headerID && CompanyId) {
      dispatch(ViewPayrollDirector({ headerID, CompanyId }));
    }
  }, [headerID, CompanyId, dispatch]);

  useEffect(() => {
    if (message) {
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      }
      dispatch(setMessage({ message: '', type: '' }));
    }
  }, [message, type, dispatch]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const groupedData = payData?.reduce((groups, item) => {
    const group = item?.payFreq || 'Unknown'; // Group by payFreq, default to 'Unknown' if undefined
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group]?.push(item);
    return groups;
  }, {});

  

  return (
    <div id="layout-wrapper">
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="page-content-wrapper">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24"></div>
              <div className="row">
                <div className="col-xl-12">
                  <div className="card">
                    <div className="card-header py-3 bg_ligh">
                      <div className="row align-items-center d-flex">
                        <div className="col-xl-8">
                          <h4 className="header-title mb-0 text-success">
                            <i className="far fa-file-alt pe-1" />
                            Edit Director Payroll
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row"></div>
                      <div className="row mt-3">
                        <div className="col-md-3 col-lg-3 col-xl-3">
                          <div className="mb-3">
                            <Label>Year</Label>
                            <select
                              id="month"
                              name="year"
                              className="form-select"
                              value={year}
                              onChange={(e) => setYear(e.target.value)}
                            >
                              <option value="2022">2022</option>
                              <option value="2023">2023</option>
                              <option value="2024">2024</option>
                              <option value="2025">2025</option>
                              <option value="2026">2026</option>
                              <option value="2027">2027</option>
                              <option value="2028">2028</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-md-3 col-lg-3 col-xl-3">
                          <div className="mb-3">
                            <Label>Period</Label>
                            <select
                              id="month11"
                              name="MonthName"
                              className="form-select"
                              value={MonthName}
                              onChange={handleMonthChange}
                            >
                              <option value="">Select Month</option>
                              <option value="January">January</option>
                              <option value="February">February</option>
                              <option value="March">March</option>
                              <option value="April">April</option>
                              <option value="May">May</option>
                              <option value="June">June</option>
                              <option value="July">July</option>
                              <option value="August">August</option>
                              <option value="September">September</option>
                              <option value="October">October</option>
                              <option value="November">November</option>
                              <option value="December">December</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-md-3 col-lg-3 col-xl-3">
                          <div className="mb-3">
                            <Label>Pay Period</Label>
                            <div className="dropdown form-select p-0 px-4 4 open">
                              <div className="dropdown-label" onClick={handleLabelClick}>
                                {getLabelText()}
                              </div>

                              {isOpen && (
                                <div className="dropdown-list form-select">
                                  <div className="checkbox">
                                    <input
                                      type="checkbox"
                                      name="dropdown-group-all"
                                      className="check-all checkbox-custom"
                                      id="checkbox-main"
                                      onChange={handleCheckAllChange}
                                      checked={selectedOptions.length === options.length}
                                    />
                                    <Label
                                      htmlFor="checkbox-main"
                                      className="checkbox-custom-Label"
                                    >
                                      All
                                    </Label>
                                  </div>

                                  {options.map((option) => (
                                    <div className="checkbox" key={option.id}>
                                      <input
                                        type="checkbox"
                                        name="dropdown-group"
                                        className="check checkbox-custom"
                                        id={option.id}
                                        onChange={handleCheckBoxChange}
                                        checked={selectedOptions.includes(option.label)}
                                      />
                                      <Label htmlFor={option.id} className="checkbox-custom-Label">
                                        {option.label}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3 col-lg-3 col-xl-3">
                          <Label>&nbsp;</Label>
                          <div className="mb-3">
                            {/* <button
                              onClick={handleSubmit}
                              disabled={loading}
                              className="btn btn-success waves-effect waves-light h-45"
                              type="submit"
                            >
                              {loading ? (
                                <>
                                  <Spinner size="sm" /> Saving...
                                </>
                              ) : (
                                <>Save</>
                              )}
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-12">
                  <div className="card">
                    <div className="card-header py-3 bg_ligh">
                      <div className="row align-items-center d-flex">
                        <div className="col-xl-4 col-6 mb-2 mb-lg-0">
                          <h4 className="header-title mb-0 text-success">
                            <i className="far fa-user text-success pe-2" />
                            Director Payroll List
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="card-header py-2 bg_ligh">
                      <div className="row">
                        <div className="col-md-3 col-12 text-lg-end">
                          <input
                            type="text"
                            className="form-control d-inline"
                            placeholder="Search by SSN or Name"
                            // onChange={(e)=>handleSSNChange(e)}
                          />
                        </div>
                        <div className="col-md-9 col-12 text-lg-end">
                          <Button
                            className="btn btn-info waves-effect waves-light h-45"
                            type="button"
                            onClick={() => handleShow()}
                          >
                            <i className="far fa-eye"></i>
                            &nbsp; Preview
                          </Button>

                          <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn btn-success waves-effect waves-light h-45"
                            type="submit"
                          >
                            {loading ? (
                              <>
                                <Spinner size="sm" /> Saving...
                              </>
                            ) : (
                              <>
                                {' '}
                                <i className="far fa-save"></i> Save
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead>
                            <tr className="border-b">
                              <th>Select</th>
                              <th>SSN</th>
                              <th>Employee Name</th>
                              {/* <th>Department</th> */}

                              <th>Week 1</th>
                              <th>Week 2</th>
                              <th>Week 3</th>
                              <th>Week 4</th>
                              <th>Week 5</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(groupedData || {}).length === 0 ? (
                              <tr>
                                <td colSpan="16" className="text-center">
                                  No records found
                                </td>
                              </tr>
                            ) : (
                              Object.keys(groupedData)?.map((payFreq) => (
                                <>
                                  <tr className="bg-light" key={payFreq}>
                                    <td className="bg-light f-600 text-dark" colSpan="18">
                                      {payFreq}
                                    </td>
                                  </tr>
                                  {groupedData[payFreq]?.map((item) => (
                                    <tr
                                      key={item.ssn}
                                      className={
                                        selectedRows?.includes(item.ssn) ? 'selected-row' : ''
                                      }
                                    >
                                      <td>
                                        <input
                                          className="form-check-input mt-0"
                                          type="checkbox"
                                          checked={selectedRows?.includes(item.ssn)}
                                          onChange={() => handleCheckboxChange(item.ssn)}
                                        />
                                      </td>
                                      <td>{item?.ssnd}</td>
                                      <td>{item?.employeeName ?? 'N/A'}</td>
                                      <td>
                                        <div className="input-group">
                                          <div className="input-group-text">
                                            <input
                                              className="form-check-input mt-0"
                                              type="checkbox"
                                              checked={item?.weeK1 || false}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  item.ssn,
                                                  'weeK1',
                                                  e.target.checked,
                                                )
                                              }
                                            />
                                          </div>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="00.00"
                                            width="40px"
                                            value={item.wageS1}
                                            onChange={(e) =>
                                              handleInputChange(item.ssn, 'wageS1', e.target.value)
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="input-group">
                                          <div className="input-group-text">
                                            <input
                                              className="form-check-input mt-0"
                                              type="checkbox"
                                              checked={item?.weeK2 ?? false}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  item.ssn,
                                                  'weeK2',
                                                  e.target.checked,
                                                )
                                              }
                                            />
                                          </div>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="00.00"
                                            width="40px"
                                            value={item.wageS2}
                                            onChange={(e) =>
                                              handleInputChange(item.ssn, 'wageS2', e.target.value)
                                            }
                                          />
                                        </div>
                                      </td>

                                      <td>
                                        <div className="input-group">
                                          <div className="input-group-text">
                                            <input
                                              className="form-check-input mt-0"
                                              type="checkbox"
                                              checked={item?.weeK3 ?? false}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  item.ssn,
                                                  'weeK3',
                                                  e.target.checked,
                                                )
                                              }
                                            />
                                          </div>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="00.00"
                                            width="40px"
                                            value={item.wageS3}
                                            onChange={(e) =>
                                              handleInputChange(item.ssn, 'wageS3', e.target.value)
                                            }
                                          />
                                        </div>
                                      </td>

                                      <td>
                                        <div className="input-group">
                                          <div className="input-group-text">
                                            <input
                                              className="form-check-input mt-0"
                                              type="checkbox"
                                              checked={item?.weeK4 ?? false}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  item.ssn,
                                                  'weeK4',
                                                  e.target.checked,
                                                )
                                              }
                                            />
                                          </div>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="00.00"
                                            width="40px"
                                            value={item.wageS4}
                                            onChange={(e) =>
                                              handleInputChange(item.ssn, 'wageS4', e.target.value)
                                            }
                                          />
                                        </div>
                                      </td>

                                      <td>
                                        <div className="input-group">
                                          <div className="input-group-text">
                                            <input
                                              className="form-check-input mt-0"
                                              type="checkbox"
                                              checked={item?.weeK5 ?? false}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  item.ssn,
                                                  'weeK5',
                                                  e.target.checked,
                                                )
                                              }
                                            />
                                          </div>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="00.00"
                                            width="40px"
                                            value={item.wageS5}
                                            // onChange={(e) =>
                                            //   handleInputChange(item.ssn, 'wageS5', e.target.value)
                                            // }

                                            onChange={({ target: { value } }) => {
                                              // Remove non-numeric characters except for the decimal
                                              const cleanedValue = value.replace(/[^0-9.]/g, '');

                                              // Insert decimal point after 6 digits if there are more than 6 digits
                                              let formattedValue = cleanedValue;
                                              if (
                                                cleanedValue.length > 6 &&
                                                !cleanedValue.includes('.')
                                              ) {
                                                formattedValue = `${cleanedValue.slice(
                                                  0,
                                                  6,
                                                )}.${cleanedValue.slice(6, 8)}`; // Use template literal
                                              }

                                              // Limit to 6 digits before the decimal and 2 digits after
                                              const regex = /^(\d{0,6})(\.\d{0,2})?$/;
                                              if (regex.test(formattedValue)) {
                                                handleInputChange(
                                                  item.ssn,
                                                  'wageS5',
                                                  formattedValue,
                                                );
                                              }
                                            }}
                                          />
                                        </div>
                                      </td>

                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder=""
                                          value={item?.remarks}
                                          style={{ height: '30px' }}
                                          onChange={(e) =>
                                            handleInputChange(item.ssn, 'remarks', e.target.value)
                                          }
                                        ></input>
                                      </td>
                                    </tr>
                                  ))}
                                </>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>{' '}
            {/* container-fluid */}
          </div>
          {/* End Page-content */}
          <sidebar-barrrrr></sidebar-barrrrr>
        </div>
        {/* end main content*/}
      </div>
      {/* END layout-wrapper */}

      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Action</ModalHeader>
        <ModalBody>Please select at least one row before submitting.</ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-light" onClick={onCancel}>
            No
          </Button>
          <Button color="primary" onClick={deleteNWDirectory}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={show} size="xl" onHide={handleClose}>
        <ModalHeader closeButton>
          <h2>Report</h2>
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                {/* <div className="card-header py-3 bg_ligh">
                <div className="row align-items-center d-flex">
                  <div className="col-xl-4 col-6 mb-2 mb-lg-0">
                    <h4 className="header-title mb-0 text-success">
                      <i className="far fa-user text-success pe-2" />
                      Add C3 Generation
                    </h4>
                  </div>
                </div>
              </div> */}
                <div className="card-body">
                  <h3 style={{ lineHeight: '131%', textAlign: 'center' }}>
                    ST.CHRISTOPHER AND NEVIS - SOCIAL SECURITY BOARD
                    <br /> STATEMENT OF WAGES AND CONTRIBUTIONS
                  </h3>
                  <h5 style={{ textAlign: 'center' }} className="mb-3">
                    Social Security Act, 1977, Housing and Social Development Levy Act, 1977, and
                    the Protectoin of Employment ACT, 1986
                  </h5>
                  <p className="p">
                    This form is in quadruplicate. Please carefully read the notes at the back of
                    the last copy. Which is the Employer&#39;s copy
                  </p>
                  <p style={{ textAlign: 'left' }} className="mb-2">
                    <b>Name of Employer :</b>{' '}
                    <span className="s5">{EditPayrollData?.[0]?.employeeName || 'N/A'}</span>
                    <b>Trade Name: </b>
                    <span className="s4">{EditPayrollData?.[0]?.department || 'N/A'} </span>
                    <b>Employer&#39;s Registration No. :</b>
                    {EditPayrollData?.[0]?.ssnd || 'Default Name'}
                  </p>
                  <p className="mb-2">
                    <b>
                      Address <span className="p">(Location &amp; Box No. If address changed)</span>
                    </b>{' '}
                    : <span className="s3">&nbsp;</span>
                    <span className="s5">{EditPayrollData?.data?.companyAddress}</span>
                    <span className="s1"> </span>
                    <b>Total Number of Employees in this Report</b>
                    <u>:</u>
                    <span className="s5">
                      {EditPayrollData?.data?.noOfEmployee}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                  </p>
                  <p className="mb-2">
                    <b>Address</b>{' '}
                    <span className="p">
                      To: Director of Social Security, With this statement is a cheque and/or cash
                      in respect of the Acts mentioned above for the month of{' '}
                    </span>
                    : <span className="s3">&nbsp;&nbsp;&nbsp;</span>
                    <span className="s6">{EditPayrollData?.data?.companyAddress}</span>
                  </p>
                  <p className="s7">
                    <b>(1) Director. Social Security Board :</b> ${' '}
                    <span className="s4">{EditPayrollData?.data?.totalSocSec}</span>
                    <span className="s10"> </span>
                    <b>(2) Accountant General :</b> ${' '}
                    <span className="s4">{EditPayrollData?.data?.accountGeneralTotal}</span>
                    &nbsp;&nbsp;<span className="s1"> </span>
                    <b>Total :</b> $ <span className="s4">{EditPayrollData?.data?.total}</span>
                  </p>
                  <div className="table-responsive">
                    <table className="table table-hover table-bordered mb-0 white-space2 mb-4 report-table">
                      <thead>
                        <tr>
                          <th rowSpan={2}>(1)</th>
                          <th rowSpan={2}>
                            (2) <br />
                            Social Security Number
                            <br /> (6 digits)
                          </th>
                          <th rowSpan={2}>
                            (3) <br />
                            Name of Employee
                            <br /> (Surname First)
                          </th>
                          <th rowSpan={2}>
                            (4) <br />
                            Termination or Commencement Date 
                          </th>
                          <th rowSpan={2}>
                            (5) <br />
                            Pay Period/ Schedule e.g. W E2/W M 2/M
                          </th>
                          <th colSpan={5}>
                            (6a) <br />
                            Put X in the Week(s) Worked or Week(s) for which Holiday/Other Pay was
                            made
                          </th>
                          <th colSpan={7}>
                            (6b) <br />
                            In accordance with the pay Schedule indicated in Column 5, record
                            Wages/Salaries in respect of the weeks worked or in the case of Holiday
                            pay/Other Pay, record in the weeks for which the payment applies
                          </th>
                          <th rowSpan={2}>
                            (7) <br />
                            Total Wages/Salaries paid for the month
                          </th>
                          <th rowSpan={2}>
                            (8) <br />
                            Deduct levy from Wages of employee. (See note 9 for exemption)
                          </th>
                          <th rowSpan={2}>
                            (9) <br />
                            Total Soc. Sec. 11% or 1% of Wages/Salaries of each employee. (See note
                            8)
                          </th>
                          <th rowSpan={2}>
                            (10) <br />
                            Remarks
                          </th>
                        </tr>
                        <tr>
                          <th>1</th>
                          <th>2</th>
                          <th>3</th>
                          <th>4</th>
                          <th>5</th>
                          <th>WK1</th>
                          <th>WK2</th>
                          <th>WK3</th>
                          <th>WK4</th>
                          <th>WK5</th>
                          <th>HPay</th>
                          <th>Bonus</th>
                        </tr>
                      </thead>
                      <tbody>
                        {EditPayrollData?.data?.listc3ReportViewModel?.map((row, index) => (
                          <tr key={index}>
                            <td>{row.rowNo}</td>
                            <td>{row.socialSecurityNo}</td>
                            <td>{row.empName}</td>
                            <td>{row.appintDate || '-'}</td>
                            <td>{row.payPeriod}</td>
                            <td>{row.firstWeekOfMonth || '-'}</td>
                            <td>{row.secondWeekOfMonth || '-'}</td>
                            <td>{row.thirdWeekOfMonth || '-'}</td>
                            <td>{row.fourWeekOfMonth || '-'}</td>
                            <td>{row.fiveWeekOfMonth || '-'}</td>
                            <td>{row.firstWeekOfSalary || '0.00'}</td>
                            <td>{row.secondWeekOfSalary || '0.00'}</td>
                            <td>{row.thirdWeekOfSalary || '0.00'}</td>
                            <td>{row.fourWeekOfSalary || '0.00'}</td>
                            <td>{row.fiveWeekOfSalary || '0.00'}</td>
                            <td>{row.column2 || '0.00'}</td>
                            <td>{row.column1 || '0.00'}</td>
                            <td>{row.totalWages || '0.00'}</td>
                            <td>{row.deductLeavyWages || '0.00'}</td>
                            <td>{row.totalSocSec || '0.00'}</td>
                            <td>{row.remarks || '-'}</td>
                          </tr>
                        ))}

                        <tr>
                          <td colSpan={15}>
                            a) Total wages and employee levy
                            contribution----------------------------------------------------------------------------------------------------------&gt;
                          </td>
                          <td colSpan={2}>{EditPayrollData?.data?.totalWages}</td>
                          <td>0.00</td>
                          <td colSpan={2}>56.7</td>
                          <td rowSpan={6} className="text-center">
                            <span className="text_decoration">FOR OFFICIAL USE ONLY</span>
                            <br />
                            <br />
                            1- DATE RECEIVED
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={17}>
                            b) Employer&#39;s 3% of Wages fo levy
                            Contribution-------------------------------------------------------------------------------------------------------------------&gt;{' '}
                          </td>
                          <td>{EditPayrollData?.data?.wagesLevyContribution}</td>
                          <td colSpan={2}>56.7</td>
                        </tr>
                        <tr>
                          <td colSpan={17}>
                            c) Employer&#39;s 1% of Wages for Severance Payments Contribution
                            -------------------------------------------------------------------------------------------&gt;{' '}
                          </td>
                          <td>{EditPayrollData?.data?.servayance}</td>
                          <td colSpan={2}>56.7</td>
                        </tr>
                        <tr>
                          <td colSpan={17}>
                            d) Levy Penality for the month (if any)
                            ------------------------------------------------------------------------------------------------------------------------------------&gt;
                          </td>
                          <td>{EditPayrollData?.data?.totalLevyEEPenalty}</td>
                          <td colSpan={2}>56.7</td>
                        </tr>
                        <tr>
                          <td colSpan={17}>
                            e) Severance Penality for month (if any)
                            ---------------------------------------------------------------------------------------------------------------------------------&gt;
                          </td>
                          <td>{EditPayrollData?.data?.servayancePePenalty}</td>
                          <td colSpan={2}>56.7</td>
                        </tr>
                        <tr>
                          <td colSpan={17}>
                            f) Total (a) to (e) due to the Accountant General
                            -----------------------------------------------------------------------------------------------------------------------&gt;
                          </td>
                          <td>{EditPayrollData?.data?.accountGeneralTotal}</td>
                          <td colSpan={2}>56.7</td>
                        </tr>
                        <tr>
                          <td colSpan={18}>
                            g) Social Security Contribution due for the month
                            ----------------------------------------------------------------------------------------------------------------------------------------&gt;
                          </td>
                          <td colSpan={2}>{EditPayrollData?.data?.totalSocSec}</td>
                          <td rowSpan={4} colSpan={2} className="text-center">
                            II- PAID YES NO
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={18}>
                            h) Fines due for the month (if any)
                            -----------------------------------------------------------------------------------------------------------------------------------------------------------&gt;
                          </td>
                          <td colSpan={2}>{EditPayrollData?.data?.finedueMonth}</td>
                        </tr>
                        <tr>
                          <td colSpan={18}>
                            i) Total (g) and (h) (Social Security Remittance due for the month)
                            -----------------------------------------------------------------------------------------------------------------&gt;
                          </td>
                          <td colSpan={2}>{EditPayrollData?.data?.remitedDueMonth}</td>
                        </tr>
                      </tbody>
                    </table>
                    <p>
                      I/We hereby certify that the particulars stated above are true and correct to
                      the best of my/our knowledge and belief.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default EditDirectorPayroll;
